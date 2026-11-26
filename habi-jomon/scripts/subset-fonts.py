"""フォントを動画で使う文字だけに絞って public/fonts/*.woff2 に書き出す。
テキストを書き換えて新しい文字を使ったら、もう一度実行すること。
  pip install fonttools brotli
  python3 scripts/subset-fonts.py
元のTTF（Google Fonts, OFL）が fonts-src/ に無ければ自動でダウンロードする。"""
import subprocess, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS = {
    'ShipporiMinchoB1-ExtraBold': 'shipporiminchob1',
    'ZenKakuGothicNew-Bold': 'zenkakugothicnew',
    'ZenKakuGothicNew-Black': 'zenkakugothicnew',
}

chars = set()
for p in list((ROOT / 'src').rglob('*.ts*')) + [ROOT / 'scripts/script.txt']:
    chars |= set(p.read_text(encoding='utf-8'))
# ASCII・かな・よく使う記号は常に含める
chars |= {chr(c) for c in range(0x20, 0x7f)}
chars |= {chr(c) for c in range(0x3000, 0x30ff + 1)}
chars |= {chr(c) for c in range(0xff01, 0xff5e + 1)}
text = ''.join(sorted(c for c in chars if c.isprintable()))

src = ROOT / 'fonts-src'
src.mkdir(exist_ok=True)
out = ROOT / 'public/fonts'
out.mkdir(parents=True, exist_ok=True)
for name, folder in FONTS.items():
    ttf = src / f'{name}.ttf'
    if not ttf.exists():
        urllib.request.urlretrieve(f'https://raw.githubusercontent.com/google/fonts/main/ofl/{folder}/{name}.ttf', ttf)
    subprocess.run(['pyftsubset', str(ttf), f'--text={text}', '--flavor=woff2', f'--output-file={out / (name + ".woff2")}'], check=True)
    print(name, (out / f'{name}.woff2').stat().st_size // 1024, 'KB')
