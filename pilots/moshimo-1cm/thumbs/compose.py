"""1cm のサムネの文字入れ。書体・色は猫の回と同じ（M PLUS Rounded 1c Black、白に黒の太フチと影、強調語だけ黄色）。絵と重ねない位置に置く。
使い方: python compose.py <base.png> <out.png> <1行目> <2行目> <強調語> <left|center|right> <上端(高さ比)> <最大幅(幅比)> <下端の上限(高さ比)>"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = '/home/user/work_neko/fonts/MPLUSRounded1c-Black-merged.ttf'
W, H = 1280, 720
YELLOW = (255, 214, 48, 255); WHITE = (255, 255, 255, 255); INK = (16, 16, 16, 255)


def fit(text, max_w, max_h, start=320):
    size = start
    while size > 30:
        f = ImageFont.truetype(FONT, size); l, t, r, b = f.getbbox(text)
        if r - l <= max_w and b - t <= max_h:
            return f
        size -= 2
    return ImageFont.truetype(FONT, size)


def draw_line(lay, text, font, x, y, hi):
    sw = max(8, font.size // 12)
    l, t, r, b = font.getbbox(text)
    sh = Image.new('RGBA', lay.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((x - l + 7, y - t + 10), text, font=font, fill=(0, 0, 0, 190), stroke_width=sw, stroke_fill=(0, 0, 0, 190))
    lay.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    d = ImageDraw.Draw(lay)
    d.text((x - l, y - t), text, font=font, fill=WHITE, stroke_width=sw, stroke_fill=INK)
    if hi and hi in text:
        i = text.index(hi); cx = x - l + font.getlength(text[:i])
        d.text((cx, y - t), hi, font=font, fill=YELLOW, stroke_width=sw, stroke_fill=INK)
    return r - l, b - t


def main():
    base, out, l1, l2, hi, side = sys.argv[1:7]
    top, mw, limit = float(sys.argv[7]), float(sys.argv[8]), float(sys.argv[9])
    im = Image.open(base).convert('RGBA').resize((W, H), Image.LANCZOS)
    y0, gap = int(H * top), 12
    avail = int(H * limit) - y0 - gap
    f1 = fit(l1, int(W * mw * 0.8), int(avail * 0.4)); f2 = fit(l2, int(W * mw), int(avail * 0.6))
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    def xpos(f, t):
        l, _, r, _ = f.getbbox(t); w = r - l
        return 40 if side == 'left' else (W - 40 - w if side == 'right' else (W - w) // 2)
    _, h1 = draw_line(lay, l1, f1, xpos(f1, l1), y0, hi)
    _, h2 = draw_line(lay, l2, f2, xpos(f2, l2), y0 + h1 + gap, hi)
    im.alpha_composite(lay)
    img = im.convert('RGB'); img.save(out)
    img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
    print(out, f1.size, f2.size, 'bottom', round((y0 + h1 + gap + h2) / H, 3))


if __name__ == '__main__':
    main()
