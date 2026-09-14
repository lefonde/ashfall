"""Validate the web package and optionally compare it to the standalone beta."""
from pathlib import Path
import argparse
import base64
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'


def constants_in(script):
    metadata = script[:script.index('// SOURCE: state.js')]
    decoder = json.JSONDecoder()
    return {match.group(1): decoder.raw_decode(metadata, match.end())[0]
            for match in re.finditer(r'^const ([A-Z_0-9]+)=', metadata, re.M)}


def normalize_loading(name, source):
    if name == 'audio.js':
        old = 'const decode=s=>{const bytes=atob(s),out=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)out[i]=bytes.charCodeAt(i);return this.ctx.decodeAudioData(out.buffer);};'
        return source.replace(old, 'const decode=url=>loadAudioAsset(url,this.ctx);')
    replacements = {'creature-voices.js': ('CREATURE_AUDIO_DATA', 'monsterBank'),
                    'approved-creatures.js': ('CREATURE_AUDITION_DATA', 'approvedBank'),
                    'approved-cerberus.js': ('CREATURE_ROUND2_DATA', 'approvedCerberusBank'),
                    'approved-heart.js': ('CREATURE_ROUND3_DATA', 'approvedHeartBank')}
    if name in replacements:
        bank, field = replacements[name]
        if name == 'creature-voices.js':
            old = f'const bytes=atob({bank}),data=new Uint8Array(bytes.length);\n  for(let i=0;i<bytes.length;i++)data[i]=bytes.charCodeAt(i);\n  this.{field}=await this.ctx.decodeAudioData(data.buffer);'
        else:
            old = f'const raw=atob({bank}),bytes=new Uint8Array(raw.length);\n  for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);\n  this.{field}=await this.ctx.decodeAudioData(bytes.buffer);'
        return source.replace(old, f'this.{field}=await loadAudioAsset({bank},this.ctx);')
    if name == 'creature-gallery-r4.js':
        old = "const encoded=bank==='chosen'?CREATURE_AUDITION_DATA:bank==='round2'?CREATURE_ROUND2_DATA:bank==='round3'?CREATURE_ROUND3_DATA:AUDIO_DATA.fx;\n   const raw=atob(encoded),bytes=new Uint8Array(raw.length);\n   for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);\n   return ctx.decodeAudioData(bytes.buffer);"
        new = "const url=bank==='chosen'?CREATURE_AUDITION_DATA:bank==='round2'?CREATURE_ROUND2_DATA:bank==='round3'?CREATURE_ROUND3_DATA:AUDIO_DATA.fx;\n   return loadAudioAsset(url,ctx);"
        return source.replace(old, new)
    return source


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--standalone', type=Path)
    args = parser.parse_args()
    html = (ROOT / 'index.html').read_text()
    assert html.endswith('</html>\n') and len(html.encode()) < 40000
    js_path = re.search(r'<script src="([^"]+)"', html).group(1)
    css_path = re.search(r'<link rel="stylesheet" href="([^"]+)"', html).group(1)
    script, css = (ROOT / js_path).read_text(), (ROOT / css_path).read_text()
    assert hashlib.sha256(script.encode()).hexdigest()[:12] in js_path
    assert hashlib.sha256(css.encode()).hexdigest()[:12] in css_path
    assert not re.search(r'\batob\s*\(', script)
    assert 'const CREATURE_REVIEW_MODE=false;' in script
    assert '// SOURCE: navigation-review.js' not in script
    ids = re.findall(r'\bid="([^"]+)"', html)
    assert len(ids) == len(set(ids)), 'duplicate HTML IDs'
    constants = constants_in(script)
    assert constants['BUILD']['version'] == '0.2.9' and constants['BUILD']['distribution'] == 'github-pages'
    assert constants['HEART_AUDIO_CUES'], 'multiline finale cue data is required'
    media = json.loads((SRC / 'media.json').read_text())
    assert len(media) == 29
    for item in media:
        name = item['path']
        assert not name.startswith('/') and '..' not in name
        data = (ROOT / name).read_bytes()
        assert len(data) == item['bytes'] and hashlib.sha256(data).hexdigest() == item['sha256']
        assert item['sha256'][:12] in name
    media_constants = ['ASSETS', 'WARDEN_ART_DATA', 'AUDIO_DATA', 'NIGHT_AUDIO_DATA',
                       'CERBERUS_AUDIO_DATA', 'HEART_AUDIO_DATA', 'CREATURE_AUDIO_DATA',
                       'CREATURE_AUDITION_DATA', 'CREATURE_ROUND2_DATA', 'CREATURE_ROUND3_DATA']
    paths = []
    for key in media_constants:
        value = constants[key]
        paths.extend(value.values() if isinstance(value, dict) else [value])
    assert set(paths) == {item['path'] for item in media}
    modules = json.loads((SRC / 'modules.json').read_text())
    bundled = {m.group(1): m.group(2) for m in re.finditer(r'// SOURCE: ([^\n]+)\n([\s\S]*?)(?=// SOURCE: |$)', script)}
    assert list(bundled) == modules and len(modules) == 79
    assert modules.index('performance-preparation.js') < modules.index('boot.js')
    assert modules.index('performance-metrics.js') < modules.index('boot.js')
    for name in modules:
        assert bundled[name] == (SRC / name).read_text(), name
    if args.standalone:
        data = args.standalone.read_bytes()
        assert hashlib.sha256(data).hexdigest() == 'c38b4c928977a12710e2033e5bfac09d64041f935153b9b8895a9171e8a2d52b'
        original = data.decode()
        old_script = re.search(r'<script>([\s\S]*?)</script>', original).group(1)
        old_constants = constants_in(old_script)
        assert set(old_constants) == set(constants), 'all payload and cue constants must survive'
        for key, old in old_constants.items():
            if key in media_constants:
                pairs = [(old[k], constants[key][k]) for k in old] if isinstance(old, dict) else [(old, constants[key])]
                for encoded, name in pairs:
                    if encoded.startswith('data:'):
                        encoded = encoded.split(',', 1)[1]
                    assert base64.b64decode(encoded) == (ROOT / name).read_bytes(), key
            elif key != 'BUILD':
                assert old == constants[key], key + ' unchanged'
        # This release intentionally changes the Transfer, gameplay UI and input. Its inherited
        # media and cue data must still be byte-for-byte identical to beta 0.2.0.
        print('PASS beta 0.2.0 baseline: all 29 media payloads and audio cue constants preserved exactly.')
    size = len(html.encode()) + len(script.encode()) + len(css.encode()) + sum(item['bytes'] for item in media)
    print('PASS static project-relative paths, content-hashed assets, full script/cue data, unique IDs and public gallery policy.')
    print('Website bytes before HTTP compression:', size, '| HTML:', len(html.encode()))


if __name__ == '__main__':
    main()
