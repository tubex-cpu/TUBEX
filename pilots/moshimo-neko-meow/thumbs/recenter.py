"""猫の群れ（都会の路地）のサムネ t4：猫を画面の中央に来るよう切り出し直し、コピー「6億匹／同時に鳴いたら」を猫に重ならない範囲で最大に入れる。
社長（2026-11-23）「猫をサムネの中央にくるようにデザイン調整」「デザイン調整後に上段、下段のコピーを猫に被らない範囲で大きくして」。書体 M PLUS Rounded 1c Black。
手順：元の文字を消す → 群れの中心（x≈1050）を画面の中央に切り出し、床を下へ少し伸ばして猫を上下の中ほどへ → 1672×941 に拡大 → 文字。
使い方: python recenter.py t4.webp t4_center.png（作業場所 /home/user/work_neko/thumbs/v6/）"""
import sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); W, H = im.size; a = np.asarray(im).astype(int)
mask = np.zeros((H, W), np.uint8)
sel = (a.min(axis=2) > 215) | ((a[:, :, 0] > 200) & (a[:, :, 1] > 150) & (a[:, :, 2] < 110)) | (a.max(axis=2) < 70)
for x0, y0, x1, y1 in [(15, 10, 720, 290), (15, 790, 880, 941)]:
    mask[y0:y1, x0:x1] = (sel[y0:y1, x0:x1] * 255).astype(np.uint8)
mask = cv2.dilate(mask, np.ones((17, 17), np.uint8))
clean = cv2.cvtColor(cv2.inpaint(cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR), mask, 15, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB)
# 床を下へ伸ばす（下端 60 行を 160 行に）
ext = cv2.resize(clean[H - 60:], (W, 160), interpolation=cv2.INTER_CUBIC)
tall = np.vstack([clean[:H - 60], ext])            # 高さ H+100
cx = 1050; half = min(cx, W - cx)                    # 群れの中心を画面の中央に
cw = 2 * half; ch = int(cw * H / W)
y0 = tall.shape[0] - ch
crop = Image.fromarray(tall[y0:, cx - half:cx + half]).resize((W, H), Image.LANCZOS)
base = crop.convert('RGBA'); k = W / cw
def Y(y): return int((y - y0) * k)
cat_top, cat_bot = Y(635), Y(825)                    # 猫の群れの頭・足元
print('cats y', cat_top, cat_bot, 'scale', round(k, 2))
F = '/home/user/work_neko/fonts/MPLUSRounded1c-Black-merged.ttf'
YELLOW = (255, 214, 48, 255); WHITE = (255, 255, 255, 255); INK = (16, 16, 16, 255)
def fit(text, w, h):
    s = 700
    while s > 20:
        f = ImageFont.truetype(F, s); l, t, r, b = f.getbbox(text); sw = max(8, s // 11)
        if r - l + 2 * sw <= w and b - t + 2 * sw <= h: return f
        s -= 2
def put(text, box, color):
    x0, y0_, x1, y1 = box
    f = fit(text, x1 - x0, y1 - y0_); l, t, r, b = f.getbbox(text); sw = max(8, f.size // 11)
    x = x0 + (x1 - x0 - (r - l)) // 2 - l; y = y0_ + (y1 - y0_ - (b - t)) // 2 - t
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((x + 7, y + 10), text, font=f, fill=(0, 0, 0, 170), stroke_width=sw, stroke_fill=(0, 0, 0, 170))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    ImageDraw.Draw(base).text((x, y), text, font=f, fill=color, stroke_width=sw, stroke_fill=INK)
    print(text, f.size)
put('6億匹', (20, 6, W - 20, cat_top - 14), YELLOW)
put('同時に鳴いたら', (20, cat_bot + 12, W - 20, H - 6), WHITE)
img = base.convert('RGB'); img.save(out); img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
