"""社長が ChatGPT で作った文字入りサムネ（t1・t2）の文字を消し、コピー「6億匹／同時に鳴いたら」を Noto Sans JP Black で入れる。
社長（2026-11-23）「どちらもコピー変更 6億匹 同時に鳴いたら」。
使い方: python refont2.py <in.webp> <out.png> <t1|t2>（作業場所 /home/user/work_neko/thumbs/v6/）"""
import sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out, lay = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert('RGB'); W, H = im.size; a = np.asarray(im).astype(int)
ERASE = {'t1': [(40, 25, 1100, 200), (40, 215, 1110, 355), (25, 385, 625, 655)],
         't2': [(40, 25, 1100, 200), (40, 215, 1130, 355), (25, 610, 880, 920)]}[lay]
mask = np.zeros((H, W), np.uint8)
sel = (a.min(axis=2) > 215) | ((a[:, :, 0] > 200) & (a[:, :, 1] > 150) & (a[:, :, 2] < 110)) | (a.max(axis=2) < 70)
for x0, y0, x1, y1 in ERASE:
    mask[y0:y1, x0:x1] = (sel[y0:y1, x0:x1] * 255).astype(np.uint8)
mask = cv2.dilate(mask, np.ones((25, 25), np.uint8))
clean = cv2.inpaint(cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR), mask, 15, cv2.INPAINT_TELEA)
base = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB)).convert('RGBA')
# 消した跡を目立たなくする：消した範囲をぼかし、左から暗くするグラデーションを重ねる
soft = Image.fromarray(cv2.GaussianBlur(mask, (0, 0), 30)).point(lambda v: min(255, v * 2))
base = Image.composite(base.filter(ImageFilter.GaussianBlur(18)), base, soft)
shade = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(shade)
for x in range(W):
    sd.line((x, 0, x, H), fill=int(max(0.0, 1 - x / (W * 0.72)) ** 1.3 * 150))
base = Image.composite(Image.new('RGBA', (W, H), (8, 10, 18, 255)), base, shade)
import os
F = os.environ.get('THUMB_FONT', '/home/user/work_neko/fonts/NotoSansCJKjp-Black.otf')
YELLOW = (255, 214, 48, 255); WHITE = (255, 255, 255, 255); INK = (16, 16, 16, 255)
def fit(text, w, h):
    s = 500
    while s > 20:
        f = ImageFont.truetype(F, s); l, t, r, b = f.getbbox(text)
        if r - l <= w and b - t <= h: return f
        s -= 2
def put(text, box, color):
    x0, y0, x1, y1 = box
    f = fit(text, x1 - x0, y1 - y0); l, t, r, b = f.getbbox(text)
    x, y = x0 - l, y0 - t; sw = max(8, f.size // 11)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((x + 8, y + 12), text, font=f, fill=(0, 0, 0, 180), stroke_width=sw, stroke_fill=(0, 0, 0, 180))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(7)))
    ImageDraw.Draw(base).text((x, y), text, font=f, fill=color, stroke_width=sw, stroke_fill=INK)
    return y0 + (b - t)
# 文字の枠：猫に重ねない（t2 は右の茶トラ x>1150、t1 は下の猫の列 y>630）
# 元の文字があった場所（上の2行と下の大きな数字）に新しい文字を置き、消した跡の上を文字で覆う
if lay == 't2':
    put('6億匹', (50, 30, 900, 360), YELLOW)
    put('同時に鳴いたら', (40, 640, 1120, 880), WHITE)
else:
    put('6億匹', (50, 30, 900, 360), YELLOW)
    put('同時に鳴いたら', (40, 400, 1100, 610), WHITE)
img = base.convert('RGB'); img.save(out); img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png')); print(out)
