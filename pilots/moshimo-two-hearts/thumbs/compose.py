"""サムネの文字入れ：上段「全生物の」、下段「心臓が二つ？」（社長 2026-11-25「コピーは 全生物の心臓が二つ？」）。
書体・色は猫の回（pilots/moshimo-neko-meow/thumbs/compose_q.py）と同じ：M PLUS Rounded 1c Black（SIL OFL 1.1）、白に黒の太フチと影、「二つ」だけ黄色。
文字は上の空き（絵の上）に中央寄せで置き、絵と重ねない。
使い方: python compose.py <base.png> <out.png> [下端の上限(高さ比)]"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = '/home/user/work_neko/fonts/MPLUSRounded1c-Black-merged.ttf'
W, H = 1280, 720
YELLOW = (255, 214, 48, 255); WHITE = (255, 255, 255, 255); INK = (16, 16, 16, 255)
L1, L2, HI = '全生物の', '心臓が二つ？', '二つ'


def fit(text, max_w, max_h, start=320):
    size = start
    while size > 30:
        f = ImageFont.truetype(FONT, size); l, t, r, b = f.getbbox(text)
        if r - l <= max_w and b - t <= max_h:
            return f
        size -= 2
    return ImageFont.truetype(FONT, size)


def draw_line(lay, text, font, y):
    sw = max(8, font.size // 12)
    l, t, r, b = font.getbbox(text); x = (W - (r - l)) // 2
    sh = Image.new('RGBA', lay.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((x - l + 7, y - t + 10), text, font=font, fill=(0, 0, 0, 190), stroke_width=sw, stroke_fill=(0, 0, 0, 190))
    lay.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    d = ImageDraw.Draw(lay)
    d.text((x - l, y - t), text, font=font, fill=WHITE, stroke_width=sw, stroke_fill=INK)
    if HI in text:
        i = text.index(HI); cx = x - l + font.getlength(text[:i])
        d.text((cx, y - t), HI, font=font, fill=YELLOW, stroke_width=sw, stroke_fill=INK)
    return b - t


def main():
    base, out = sys.argv[1:3]
    limit = float(sys.argv[3]) if len(sys.argv) > 3 else 0.37
    im = Image.open(base).convert('RGBA').resize((W, H), Image.LANCZOS)
    top, gap = int(H * 0.035), 14
    avail = int(H * limit) - top - gap
    f1 = fit(L1, int(W * 0.6), int(avail * 0.38)); f2 = fit(L2, int(W * 0.94), int(avail * 0.62))
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    h1 = draw_line(lay, L1, f1, top)
    h2 = draw_line(lay, L2, f2, top + h1 + gap)
    im.alpha_composite(lay)
    img = im.convert('RGB'); img.save(out)
    img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
    print(out, f1.size, f2.size, 'bottom', round((top + h1 + gap + h2) / H, 3))


if __name__ == '__main__':
    main()
