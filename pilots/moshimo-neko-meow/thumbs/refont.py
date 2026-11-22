"""社長が ChatGPT で作った文字入りサムネ（t1・t2）の文字を消して、バナーと同じ Noto Sans JP Black で入れ直す。
社長（2026-11-22）「フォントをバナーと合わせてみて」。
使い方: python refont.py <in.webp> <out.png> <レイアウト名 t1|t2>（作業場所 /home/user/work_neko/thumbs/v6/）"""
import sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out, lay = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert('RGB'); W, H = im.size
a = np.asarray(im).astype(int)
# 元の文字の範囲（画像ごと、目で測った枠）
BOX = {'t1': [(40, 25, 1100, 200), (40, 215, 1110, 355), (25, 385, 625, 655)],
       't2': [(40, 25, 1100, 200), (40, 215, 1130, 355), (25, 610, 880, 920)]}[lay]
mask = np.zeros((H, W), np.uint8)
white = (a.min(axis=2) > 215); yel = (a[:, :, 0] > 200) & (a[:, :, 1] > 150) & (a[:, :, 2] < 110); dark = (a.max(axis=2) < 70)
for x0, y0, x1, y1 in BOX:
    sub = (white | yel | dark)[y0:y1, x0:x1]
    mask[y0:y1, x0:x1] = (sub * 255).astype(np.uint8)
mask = cv2.dilate(mask, np.ones((25, 25), np.uint8))  # 元の文字の縁取りと影まで消す
bgr = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)
clean = cv2.inpaint(bgr, mask, 15, cv2.INPAINT_TELEA)
base = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB)).convert('RGBA')
base.save(out.replace('.png', '_clean.png'))
F = '/home/user/work_neko/fonts/NotoSansCJKjp-Black.otf'
YELLOW = (255, 214, 48, 255); WHITE = (255, 255, 255, 255); INK = (16, 16, 16, 255)
def fit(text, w, h):
    s = 400
    while s > 20:
        f = ImageFont.truetype(F, s); l, t, r, b = f.getbbox(text)
        if r - l <= w and b - t <= h: return f
        s -= 2
    return ImageFont.truetype(F, s)
def put(text, box, hi=None, color=WHITE):
    x0, y0, x1, y1 = box
    f = fit(text, x1 - x0 - 20, y1 - y0 - 24); l, t, r, b = f.getbbox(text)
    x, y = x0 + 10 - l, y0 + (y1 - y0 - (b - t)) // 2 - t
    sw = max(8, f.size // 11)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((x + 7, y + 10), text, font=f, fill=(0, 0, 0, 180), stroke_width=sw, stroke_fill=(0, 0, 0, 180))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    d = ImageDraw.Draw(base); d.text((x, y), text, font=f, fill=color, stroke_width=sw, stroke_fill=INK)
    if hi:
        d.text((x, y), hi, font=f, fill=YELLOW, stroke_width=sw, stroke_fill=INK)
put('世界中の猫が', BOX[0], hi='世界中')
put('同時に鳴き出したら', BOX[1])
put('6億匹', BOX[2], color=YELLOW)
img = base.convert('RGB'); img.save(out)
img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
print(out)
