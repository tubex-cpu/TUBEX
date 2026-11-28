"""社長が ChatGPT で作り直したサムネ（t3：路地と手前の茶トラ、上「6億匹」・下「同時に鳴いたら」）の文字を、猫に重ならない範囲でできるだけ大きく入れ直す。
社長（2026-11-23）「上段、下段のコピーを猫に被らない範囲でもっと大きくして」。書体は元と同じ M PLUS Rounded 1c Black。
使い方: python refont3.py t3.webp t3_big.png（作業場所 /home/user/work_neko/thumbs/v6/）"""
import sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); W, H = im.size; a = np.asarray(im).astype(int)
ERASE = [(15, 10, 690, 275), (15, 745, 1120, 941)]  # 元の文字の範囲
mask = np.zeros((H, W), np.uint8)
sel = (a.min(axis=2) > 215) | ((a[:, :, 0] > 200) & (a[:, :, 1] > 150) & (a[:, :, 2] < 110)) | (a.max(axis=2) < 70)
for x0, y0, x1, y1 in ERASE:
    mask[y0:y1, x0:x1] = (sel[y0:y1, x0:x1] * 255).astype(np.uint8)
mask = cv2.dilate(mask, np.ones((17, 17), np.uint8))
clean = cv2.inpaint(cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR), mask, 15, cv2.INPAINT_TELEA)
base = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB)).convert('RGBA')
F = '/home/user/work_neko/fonts/MPLUSRounded1c-Black-merged.ttf'
YELLOW = (255, 214, 48, 255); WHITE = (255, 255, 255, 255); INK = (16, 16, 16, 255)
def fit(text, w, h):
    s = 600
    while s > 20:
        f = ImageFont.truetype(F, s); l, t, r, b = f.getbbox(text); sw = max(8, s // 11)
        if r - l + 2 * sw <= w and b - t + 2 * sw <= h: return f
        s -= 2
def put(text, box, color, anchor='top'):
    x0, y0, x1, y1 = box
    f = fit(text, x1 - x0, y1 - y0); l, t, r, b = f.getbbox(text); sw = max(8, f.size // 11)
    x = x0 + sw - l
    y = (y0 + sw - t) if anchor == 'top' else (y1 - sw - (b - t) - t)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((x + 7, y + 10), text, font=f, fill=(0, 0, 0, 170), stroke_width=sw, stroke_fill=(0, 0, 0, 170))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    ImageDraw.Draw(base).text((x, y), text, font=f, fill=color, stroke_width=sw, stroke_fill=INK)
    print(text, f.size, 'box', x - sw + l, y - sw + t, x + (r - l) + sw, y + (b - t) + sw)
# 猫に重ならない枠：上は猫の群れの頭（y≒280〜）より上、手前の茶トラ（x≒1170〜）より左。下は群れの足元（y≒700）より下、茶トラ（x≒1230〜）より左
put('6億匹', (10, 2, 1150, 318), YELLOW, 'top')
put('同時に鳴いたら', (8, 705, 1235, 940), WHITE, 'bottom')
img = base.convert('RGB'); img.save(out); img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
