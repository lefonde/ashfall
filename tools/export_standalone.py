"""Export the built web release as one offline HTML file without changing media."""
from pathlib import Path
import argparse
import base64
import json
import re

ROOT = Path(__file__).resolve().parent.parent


def export(destination):
    page = (ROOT / 'index.html').read_text()
    script_path = re.search(r'<script src="([^"]+)"', page).group(1)
    style_path = re.search(r'<link rel="stylesheet" href="([^"]+)"', page).group(1)
    script = (ROOT / script_path).read_text().replace('"distribution":"github-pages"', '"distribution":"standalone"', 1)
    css = (ROOT / style_path).read_text()
    for item in json.loads((ROOT / 'src/media.json').read_text()):
        path = item['path']
        mime = 'audio/mpeg' if path.endswith('.mp3') else 'image/png'
        uri = 'data:' + mime + ';base64,' + base64.b64encode((ROOT / path).read_bytes()).decode()
        quoted = json.dumps(path)
        assert quoted in script, path
        script = script.replace(quoted, json.dumps(uri))
    loader = (ROOT / 'src/asset-loader.js').read_text()
    assert loader in script
    standalone_loader = '''// Offline transport: decode the identical embedded MP3 bytes.
async function loadAudioAsset(url,context){
 const raw=atob(url.slice(url.indexOf(',')+1)),bytes=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 return context.decodeAudioData(bytes.buffer);
}
'''
    script = script.replace(loader, standalone_loader, 1)
    assert '</script' not in script.lower()
    page = page.replace('<link rel="stylesheet" href="'+style_path+'">', '<style>'+css+'</style>', 1)
    page = page.replace('<script src="'+script_path+'"></script>', '<script>'+script+'</script>', 1)
    assert '<script src=' not in page and '<link rel="stylesheet"' not in page
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(page)
    print(json.dumps({'file':str(destination.resolve()),'bytes':destination.stat().st_size}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('destination', type=Path)
    export(parser.parse_args().destination)
