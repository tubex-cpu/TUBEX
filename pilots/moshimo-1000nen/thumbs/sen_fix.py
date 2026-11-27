"""左右反転した夜の画像から右側の信号機を消し、元の向き（柱は左の歩道、腕は道路側）の信号機を、縮小して左下寄り（コピーの下）に置き直す。出力 sen_fix_base.png（文字なし 1280×720）"""
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import importlib.util
spec = importlib.util.spec_from_file_location('rg', 'refont_g_lib.py'); rg = importlib.util.module_from_spec(spec); spec.loader.exec_module(rg)
DX_CLONE = int(__import__('sys').argv[1]) if len(__import__('sys').argv) > 1 else 170
orig = Image.open('sen_night.jpg').convert('RGB').resize((1280, 720), Image.LANCZOS)  # 信号機の切り出し元（右上の文字は使わない範囲）
fb = ImageOps.mirror(rg.erase(Image.open('sen_night.jpg').convert('RGB'), [(750, 25, 1330, 305)]).convert('RGB').resize((1280, 720), Image.LANCZOS))
mask = np.asarray(Image.open('sig_mask2.png'))
m2 = Image.fromarray(mask); d = ImageDraw.Draw(m2); d.rectangle((52, 378, 118, 474), fill=255); mask = np.asarray(m2)
# 1) 右側の信号機を消す：左隣の景色を写して埋める（クローン）
mm = np.ascontiguousarray(mask[:, ::-1])
fa = np.asarray(fb)
def clone(dx):
    sh = np.zeros_like(fa); sh[:, dx:] = fa[:, :-dx]; return sh
soft = np.asarray(Image.fromarray(cv2.dilate(mm, np.ones((13, 13), np.uint8))).filter(ImageFilter.GaussianBlur(7))).astype(np.float32)[..., None] / 255
src = clone(DX_CLONE)
head = mm.copy(); head[236:, :] = 0
pole = mm.copy(); pole[:236, :] = 0
def blend(img, m, dx, k=13, blur=7, dy=0):
    sm = np.asarray(Image.fromarray(cv2.dilate(m, np.ones((k, k), np.uint8))).filter(ImageFilter.GaussianBlur(blur))).astype(np.float32)[..., None] / 255
    sh = np.roll(np.roll(img, dx, axis=1), dy, axis=0)
    return (img * (1 - sm) + sh * sm)
DXH = int(__import__('sys').argv[2]) if len(__import__('sys').argv) > 2 else 220
c1 = blend(fa.astype(np.float32), pole, DX_CLONE)
hA = head.copy(); hA[:, 975:] = 0
hB = head.copy(); hB[:, :975] = 0
top = head.copy(); top[96:, :] = 0
hA[:96, :] = 0; hB[:96, :] = 0
c2 = blend(c1, top, DXH, k=13, blur=7)
c2 = blend(c2, hA, DXH, k=17, blur=9, dy=75)
c2 = blend(c2, hB, DXH, k=17, blur=9, dy=75)
clean = Image.fromarray(np.clip(c2, 0, 255).astype(np.uint8))
# 2) 元の向きの信号機を縮小して左下寄りに置く（柱の根もとを左の歩道へ）
S = 0.55
sig = orig.copy(); sig.putalpha(Image.fromarray(mask).filter(ImageFilter.GaussianBlur(1.5)))
bb = sig.getbbox()
sig = sig.crop(bb).resize((int((bb[2] - bb[0]) * S), int((bb[3] - bb[1]) * S)), Image.LANCZOS)
# 柱の根もと（元 y=640 付近、x≈100）を (x0, y0) に合わせる
base_x = int((100 - bb[0]) * S); base_y = int((640 - bb[1]) * S)
X0, Y0 = 150, 640
out = clean.convert('RGBA'); out.alpha_composite(sig, (X0 - base_x, Y0 - base_y))
out.convert('RGB').save('sen_fix_base.png')
print('signal top y', Y0 - base_y, 'head y', Y0 - base_y + int((120 - bb[1]) * S))
