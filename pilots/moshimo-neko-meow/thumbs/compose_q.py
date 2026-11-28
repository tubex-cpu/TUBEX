"""サムネの文字入れ（問いかけ型・2行）。社長指示 2026-11-22「コピーは６億匹（世界中）の猫が同時に鳴いたら？のようにもっと直接的でいい」
「視聴者がえっ気になると感情が動けばいい」。
- 書体：M PLUS Rounded 1c Black（SIL OFL 1.1）。白文字に黒の太フチと影。強調したい語（数字など）だけ黄色
- 2行。2行目を大きく。右下（再生時間の表示）は空ける
使い方: python compose_q.py <base.png> <1行目> <2行目> <out.png> [強調する語] [left|right] [上端(高さ比)] [最大の幅(幅比)]
"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = '/home/user/work_neko/fonts/MPLUSRounded1c-Black-merged.ttf'
W, H = 1280, 720
YELLOW = (255, 214, 48, 255)
WHITE = (255, 255, 255, 255)
INK = (16, 16, 16, 255)


def fit(text, max_w, max_h, start=320):
    size = start
    while size > 30:
        f = ImageFont.truetype(FONT, size)
        l, t, r, b = f.getbbox(text)
        if r - l <= max_w and b - t <= max_h:
            return f
        size -= 2
    return ImageFont.truetype(FONT, size)


def draw_line(lay, text, font, x, y, hi):
    """text を (x, y)＝左上に描く。hi に含まれる部分だけ黄色"""
    sw = max(8, font.size // 12)
    l, t, r, b = font.getbbox(text)
    sh = Image.new('RGBA', lay.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((x - l + 7, y - t + 10), text, font=font, fill=(0, 0, 0, 190), stroke_width=sw, stroke_fill=(0, 0, 0, 190))
    lay.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    d = ImageDraw.Draw(lay)
    d.text((x - l, y - t), text, font=font, fill=WHITE, stroke_width=sw, stroke_fill=INK)
    if hi and hi in text:
        i = text.index(hi)
        cx = x - l + font.getlength(text[:i])
        d.text((cx, y - t), hi, font=font, fill=YELLOW, stroke_width=sw, stroke_fill=INK)
    return r - l, b - t


def main():
    base, l1, l2, out = sys.argv[1:5]
    hi = sys.argv[5] if len(sys.argv) > 5 else ''
    side = sys.argv[6] if len(sys.argv) > 6 else 'left'
    ytop = float(sys.argv[7]) if len(sys.argv) > 7 else 0.08
    im = Image.open(base).convert('RGBA').resize((W, H), Image.LANCZOS)
    shade = Image.new('L', (W, H), 0); d = ImageDraw.Draw(shade)
    for y in range(H):
        d.line((0, y, W, y), fill=int(max(0, 1 - y / (H * 0.6)) * 110))
    im = Image.composite(Image.new('RGBA', (W, H), (0, 0, 0, 255)), im, shade)
    mw = float(sys.argv[8]) if len(sys.argv) > 8 else 0.92
    f1 = fit(l1, int(W * min(0.80, mw)), int(H * 0.17))
    f2 = fit(l2, int(W * mw), int(H * 0.27))
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    w1 = f1.getbbox(l1); w2 = f2.getbbox(l2)
    x1 = 46 if side == 'left' else W - 46 - (w1[2] - w1[0])
    x2 = 46 if side == 'left' else W - 46 - (w2[2] - w2[0])
    y1 = int(H * ytop)
    _, h1 = draw_line(lay, l1, f1, x1, y1, hi)
    _, h2 = draw_line(lay, l2, f2, x2, y1 + h1 + 26, hi)
    im.alpha_composite(lay)
    img = im.convert('RGB'); img.save(out)
    img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
    print(out, f1.size, f2.size, 'bottom', round((y1 + h1 + 26 + h2) / H, 2))


if __name__ == '__main__':
    main()
