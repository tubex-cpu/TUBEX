"""手元で Commons から写真を取得する（GitHub Actions が混んでいるとき用）。
標準サイズの縮小版（1920px／3840px）を upload.wikimedia.org から取る。横長の絵巻は高さ1080px以上を保つ。
  python3 scripts/fetch-photos-local.py"""
import io, json, math, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ROOT = Path(__file__).resolve().parent.parent
UA = 'HabiJudgeVideo/1.0 (educational YouTube video; photo credits)'
OUT = ROOT / 'public/photos'
OUT.mkdir(parents=True, exist_ok=True)
picks = json.loads((ROOT / 'scripts/photo-picks.json').read_text())
cred_path = OUT / 'credits.json'
credits = json.loads(cred_path.read_text()) if cred_path.exists() else {}


def get(url):
    for _ in range(20):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=120).read()
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            wait = int(e.headers.get('retry-after', '60')) + 5
            print(f'  429 {wait}s', flush=True)
            time.sleep(wait)
    raise RuntimeError('429が続く')


def strip(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s or '')).strip()


# 縮小版で取れるものを先に、原寸が要る横長のものは最後に回す
order = sorted(picks.items(), key=lambda kv: kv[0].endswith('-w'))
for pid, title in order:
    if pid in credits and (OUT / f'{pid}.jpg').exists():
        continue
    try:
        q = urllib.parse.urlencode({'action': 'query', 'format': 'json', 'titles': 'File:' + title, 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata'})
        page = list(json.loads(get('https://commons.wikimedia.org/w/api.php?' + q))['query']['pages'].values())[0]
        ii = page['imageinfo'][0]
        ow, oh, orig = ii['width'], ii['height'], ii['url'].split('?')[0]
        need = 1920 if ow / oh <= 1.9 else math.ceil(1100 * ow / oh)
        is_svg = orig.lower().endswith('.svg')
        # 標準サイズ（960/1280/1920/3840）のうち、必要な幅以上で原寸より小さいもの。無ければ原寸より小さい最大のもの
        std = [s for s in (960, 1280, 1920, 3840) if s < ow]
        size = next((s for s in std if s >= need), std[-1] if std else None)
        if is_svg:
            size = 3840
        if size:
            m = re.match(r'(https://upload\.wikimedia\.org/wikipedia/commons/)(\w/\w\w/)(.+)$', orig)
            name = m.group(3)
            url = f'{m.group(1)}thumb/{m.group(2)}{name}/{size}px-{name}' + ('.png' if is_svg else '')
        else:
            url = orig
        im = Image.open(io.BytesIO(get(url))).convert('RGB')
        if ow / oh <= 1.9:
            im.thumbnail((2400, 2400), Image.LANCZOS)
        im.save(OUT / f'{pid}.jpg', quality=88)
        meta = ii.get('extmetadata', {})
        credits[pid] = {'file': f'{pid}.jpg', 'title': title, 'artist': strip(meta.get('Artist', {}).get('value')) or '作者不明',
                        'license': strip(meta.get('LicenseShortName', {}).get('value')), 'page': ii['descriptionurl'].split('?')[0], 'size': list(im.size)}
        cred_path.write_text(json.dumps(credits, ensure_ascii=False, indent=1))
        print(f'OK {pid} {im.size}', flush=True)
    except Exception as e:  # noqa: BLE001
        print(f'FAIL {pid} {e!r}', flush=True)
    time.sleep(1.5)
print('DONE', len(credits))
