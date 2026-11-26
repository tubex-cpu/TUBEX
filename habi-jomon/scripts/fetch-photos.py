"""Wikimedia Commons から本能寺の変判決の写真をダウンロードする。

使い方:  python3 scripts/fetch-photos.py
  - scripts/photo-picks.json（保存名 → Commonsのファイル名）を読み、
    public/photos/<保存名>.jpg に保存する（長辺2400pxまで縮小、JPEG品質88）。
  - 作者・ライセンス・ページURLを public/photos/credits.json に記録する。
  - 途中で止まっても、もう一度実行すれば続きから再開する。
  - 429（アクセス過多）が返ったら retry-after の秒数だけ待ってから再試行する。
"""
import io
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
UA = 'HabiJudgeVideo/1.0 (educational YouTube video; photo credits)'
OUT = ROOT / 'public/photos'
OUT.mkdir(parents=True, exist_ok=True)
picks = json.loads((ROOT / 'scripts/photo-picks.json').read_text())
cred_path = OUT / 'credits.json'
credits = json.loads(cred_path.read_text()) if cred_path.exists() else {}


def fetch(url: str, timeout: int = 120) -> bytes:
    for _ in range(30):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            return urllib.request.urlopen(req, timeout=timeout).read()
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            wait = int(e.headers.get('retry-after', '60')) + 15
            print(f'  429：{wait}秒待って再試行', flush=True)
            time.sleep(wait)
    raise RuntimeError('アクセス制限が解除されませんでした')


def strip(s: str | None) -> str:
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s or '')).strip()


failed = []
for pid, title in picks.items():
    if pid in credits and (OUT / f'{pid}.jpg').exists():
        continue
    try:
        q = urllib.parse.urlencode({'action': 'query', 'format': 'json', 'titles': 'File:' + title, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': 2400})
        d = json.loads(fetch('https://commons.wikimedia.org/w/api.php?' + q))
        info = list(d['query']['pages'].values())[0].get('imageinfo', [{}])[0]
        ow, oh = info.get('width', 1), info.get('height', 1)
        # 横長の絵巻などは、幅2400に縮めると高さが足りない。高さ1400pxを保てる幅で取り直す
        long_side = 2400
        if ow / oh > 1.9 and oh > 1:
            long_side = min(ow, int(1400 * ow / oh))
            q = urllib.parse.urlencode({'action': 'query', 'format': 'json', 'titles': 'File:' + title, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': long_side})
            d = json.loads(fetch('https://commons.wikimedia.org/w/api.php?' + q))
        page = list(d['query']['pages'].values())[0]
        if 'imageinfo' not in page:
            raise RuntimeError('Commonsにファイルが見つからない')
        ii = page['imageinfo'][0]
        meta = ii.get('extmetadata', {})
        # 縮小版（thumburl）が使えればそちらを使う。無ければ原寸
        url = ii.get('thumburl') or ii['url']
        im = Image.open(io.BytesIO(fetch(url))).convert('RGB')
        im.thumbnail((max(2400, long_side), 2400), Image.LANCZOS)
        im.save(OUT / f'{pid}.jpg', quality=88)
        credits[pid] = {
            'file': f'{pid}.jpg',
            'title': title,
            'artist': strip(meta.get('Artist', {}).get('value')) or '作者不明',
            'license': strip(meta.get('LicenseShortName', {}).get('value')),
            'page': ii['descriptionurl'],
            'size': list(im.size),
        }
        cred_path.write_text(json.dumps(credits, ensure_ascii=False, indent=1))
        print(f'OK   {pid}  {im.size[0]}x{im.size[1]}  {credits[pid]["license"]}', flush=True)
    except Exception as e:  # noqa: BLE001
        failed.append(pid)
        print(f'FAIL {pid}  {e!r}', flush=True)
    time.sleep(5)

print(f'\n完了：{len(credits)}/{len(picks)}枚')
if failed:
    print('失敗：' + ', '.join(failed))
    sys.exit(1)
