"""サムネの文字入れ（ラフ）。主役素材（scenes.py の出力、文字なし）に、コピーを別工程で組む。
社長指示 2026-11-22「コピーのフォントや大きさも差別化したい」。
- 参考2チャンネル（ifと＝白い明朝の数字、ほんとにやったら＝橙・青の角ゴシック＋白フチ）と違う、丸ゴシックの極太
  （M PLUS Rounded 1c Black、SIL OFL 1.1。@fontsource/m-plus-rounded-1c 5.3.0 の分割ファイルを fontTools で1つにまとめて使う。git には入れない）
- 大きさ：主役の一語を画面の高さの約4割で1行。上に小さな黄色の札（黒文字）で前置きを置く
- 右下（再生時間の表示）は空ける
使い方: python compose.py <base.png> <札の文言> <主役の一語> <out.png> [left|right] [一語の上端(高さ比)] [一語の最大の高さ(高さ比)] [一語の最大の幅(幅比)]
"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = '/home/user/work_neko/fonts/MPLUSRounded1c-Black-merged.ttf'
W, H = 1280, 720
YELLOW = (255, 214, 48, 255)


def fit(text, max_w, max_h, start=360):
    size = start
    while size > 40:
        f = ImageFont.truetype(FONT, size)
        l, t, r, b = f.getbbox(text)
        if r - l <= max_w and b - t <= max_h:
            return f
        size -= 4
    return ImageFont.truetype(FONT, size)


def main():
    base, tag, word, out = sys.argv[1:5]
    side = sys.argv[5] if len(sys.argv) > 5 else 'left'
    im = Image.open(base).convert('RGBA').resize((W, H), Image.LANCZOS)
    # 文字の側を少し暗くして、主役と文字を浮かせる
    shade = Image.new('L', (W, H), 0); d = ImageDraw.Draw(shade)
    for x in range(W):
        a = (1 - x / (W * 0.7)) if side == 'left' else ((x - W * 0.3) / (W * 0.7))
        d.line((x, 0, x, H), fill=int(max(0, min(1, a)) * 120))
    im = Image.composite(Image.new('RGBA', (W, H), (0, 0, 0, 255)), im, shade)
    # 主役の一語
    ytop = float(sys.argv[6]) if len(sys.argv) > 6 else 0.36
    mh = float(sys.argv[7]) if len(sys.argv) > 7 else 0.40
    mw = float(sys.argv[8]) if len(sys.argv) > 8 else 0.62
    fw = fit(word, int(W * mw), int(H * mh))
    l, t, r, b = fw.getbbox(word, stroke_width=0)
    ww, wh = r - l, b - t
    x0 = 50 if side == 'left' else W - 50 - ww
    y0 = int(H * ytop)
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
    sw = max(10, fw.size // 14)
    # 影（下に少しずらしてぼかす）
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((x0 - l + 8, y0 - t + 12), word, font=fw, fill=(0, 0, 0, 200), stroke_width=sw, stroke_fill=(0, 0, 0, 200))
    lay.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    ld.text((x0 - l, y0 - t), word, font=fw, fill=(255, 255, 255, 255), stroke_width=sw, stroke_fill=(16, 16, 16, 255))
    # 札（黄色の地に黒文字）
    ft = fit(tag, int(W * 0.55), 78, start=90)
    tl, tt, tr, tb = ft.getbbox(tag)
    pw, ph = tr - tl + 44, tb - tt + 26
    tx = x0 if side == 'left' else W - 50 - pw
    ty = y0 - ph - 18
    ld.rounded_rectangle((tx + 6, ty + 8, tx + pw + 6, ty + ph + 8), 18, fill=(0, 0, 0, 170))
    ld.rounded_rectangle((tx, ty, tx + pw, ty + ph), 18, fill=YELLOW, outline=(16, 16, 16, 255), width=5)
    ld.text((tx + 22 - tl, ty + 13 - tt), tag, font=ft, fill=(16, 16, 16, 255))
    im.alpha_composite(lay)
    img = im.convert('RGB'); img.save(out)
    img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
    print(out, 'word', fw.size, (x0, y0, x0 + ww, y0 + wh), 'right edge', round((x0 + ww) / W, 2), 'bottom', round((y0 + wh) / H, 2))


if __name__ == '__main__':
    main()
