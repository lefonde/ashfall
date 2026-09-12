"""Build the static Pages release without npm, a server or runtime imports."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'


def build():
    constants = json.loads((SRC / 'constants.json').read_text())
    media = json.loads((SRC / 'media.json').read_text())
    modules = json.loads((SRC / 'modules.json').read_text())
    assert len(modules) == len(set(modules)) == 63
    assert modules[0] == 'state.js' and 'navigation-review.js' not in modules
    for item in media:
        data = (ROOT / item['path']).read_bytes()
        assert len(data) == item['bytes'], item['path']
        assert hashlib.sha256(data).hexdigest() == item['sha256'], item['path']
        assert item['sha256'][:12] in item['path'], 'Media filenames must identify their exact bytes'
    code = (SRC / 'asset-loader.js').read_text() + '\n'
    for name in modules:
        assert Path(name).name == name and name.endswith('.js')
        code += '// SOURCE: ' + name + '\n' + (SRC / name).read_text()
    css = (SRC / 'game.css').read_text()
    template = (SRC / 'index.html').read_text()
    constants['BUILD'].pop('source_digest', None)
    constants['BUILD']['source_digest'] = hashlib.sha256(
        (code + css + template + json.dumps(constants, sort_keys=True)).encode()).hexdigest()[:12]
    # One script preserves the original shared lexical scope and hoisting.
    script = "'use strict';\n" + ''.join(
        'const ' + name + '=' + json.dumps(value, ensure_ascii=False, separators=(',', ':')) + ';\n'
        for name, value in constants.items()) + code
    scripts = ROOT / 'assets' / 'code'
    scripts.mkdir(parents=True, exist_ok=True)
    js_name = 'game-' + hashlib.sha256(script.encode()).hexdigest()[:12] + '.js'
    css_name = 'game-' + hashlib.sha256(css.encode()).hexdigest()[:12] + '.css'
    for old in scripts.iterdir():
        if re.fullmatch(r'game-[a-f0-9]{12}\.(?:js|css)', old.name) and old.name not in [js_name, css_name]:
            old.unlink()
    (scripts / js_name).write_text(script)
    (scripts / css_name).write_text(css)
    html = template.replace('{{SCRIPT_PATH}}', 'assets/code/' + js_name).replace('{{STYLE_PATH}}', 'assets/code/' + css_name)
    assert '{{SCRIPT_PATH}}' not in html and '{{STYLE_PATH}}' not in html
    (ROOT / 'index.html').write_text(html)
    (ROOT / '.nojekyll').write_text('')
    size = len(html.encode()) + len(script.encode()) + len(css.encode()) + sum(item['bytes'] for item in media)
    print(json.dumps({'version': constants['BUILD']['version'], 'source_digest': constants['BUILD']['source_digest'],
                      'html_bytes': len(html.encode()), 'script_bytes': len(script.encode()), 'css_bytes': len(css.encode()),
                      'media_files': len(media), 'first_load_bytes_before_http_compression': size}))


if __name__ == '__main__':
    build()
