"""3D の主役素材（out/<id>_3d.png、文字なし）に、OFL の Noto Serif JP Black で文言を別工程で組む。

Usage: python3 scripts/compose.py <id> <1行目> <2行目> <出力PNG>
  - 1行目：上に中央寄せ。2行目：下に左寄せ（右下の再生時間表示の場所＝右18%×下15%に文字を置かない）
  - 文字は黒、やや下に濃い黄の影（立体感）。背景・主役は 3D 側で描く
  - 出力と同じ場所に <name>_320.png（スマホ幅 320px の確認用）も書く
フォント：vendor/noto-serif-jp（@fontsource/noto-serif-jp 5.3.1、SIL OFL 1.1。scripts/fetch_font.sh で取得、git には入れない）
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / 'vendor/noto-serif-jp/files/noto-serif-jp-japanese-900-normal.woff'
W, H = 1280, 720
SHADOW = (176, 140, 0, 255)


def fit(text: str, max_w: int, max_h: int) -> ImageFont.FreeTypeFont:
    size = 260
    while size > 40:
        f = ImageFont.truetype(str(FONT), size)
        l, t, r, b = f.getbbox(text)
        if r - l <= max_w and b - t <= max_h:
            return f
        size -= 2
    return ImageFont.truetype(str(FONT), size)


def draw_line(base: Image.Image, text: str, font: ImageFont.FreeTypeFont, x: int, y_top: int) -> tuple[int, int, int, int]:
    l, t, r, b = font.getbbox(text)
    ox, oy = x - l, y_top - t
    sh = Image.new('RGBA', base.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((ox + 5, oy + 7), text, font=font, fill=SHADOW)
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(2)))
    ImageDraw.Draw(base).text((ox, oy), text, font=font, fill=(10, 10, 10, 255))
    return (x, y_top, x + (r - l), y_top + (b - t))


def main() -> None:
    sid, line1, line2, out = sys.argv[1], sys.argv[2], sys.argv[3], Path(sys.argv[4])
    base = Image.open(ROOT / f'out/{sid}_3d.png').convert('RGBA').resize((W, H))
    f1 = fit(line1, 1180, 150)
    l, t, r, b = f1.getbbox(line1)
    box1 = draw_line(base, line1, f1, (W - (r - l)) // 2, 18)
    f2 = fit(line2, int(W * 0.78) - 48, 138)
    l, t, r, b = f2.getbbox(line2)
    box2 = draw_line(base, line2, f2, 48, H - 22 - (b - t))
    out.parent.mkdir(parents=True, exist_ok=True)
    img = base.convert('RGB')
    img.save(out)
    img.resize((320, 180), Image.LANCZOS).save(out.with_name(out.stem + '_320.png'))
    print(out, 'line1', f1.size, box1, 'line2', f2.size, box2, 'right edge of line2 =', round(box2[2] / W, 3))


if __name__ == '__main__':
    main()
