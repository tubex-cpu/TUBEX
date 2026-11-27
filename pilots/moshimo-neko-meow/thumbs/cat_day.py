"""猫の回のサムネ（6億匹／同時に鳴いたら）を、1000年の夜のサムネと同じ世界観に：映画のような色（夕暮れの青と暖色、周辺を暗く）、明朝体・月明かりの白と淡い金。
社長（2026-11-27）「このサムネも千年眠ったサムネに世界観を合わせて欲しい。・デザイン、フォント修正 ・コピー変更 6億匹の猫が／同時に鳴いたら」"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import importlib.util
spec = importlib.util.spec_from_file_location('rg', 'refont_g_lib.py'); rg = importlib.util.module_from_spec(spec); spec.loader.exec_module(rg)
FONT = '/home/user/work_neko/fonts/' + sys.argv[1]
im = Image.open('cat6.webp').convert('RGB'); W0, H0 = im.size
base = rg.erase(im, [(20, 10, 800, 310), (10, 760, 1215, 941)]).convert('RGB').resize((1280, 720), Image.LANCZOS)
W, H = base.size
# 下段の元の文字を消した跡：左は上の道路を、右寄りはその左の道路を写して埋める（ふちはぼかす）
def _clone(img, box, dy=0, dx=0, blur=14):
    m = np.zeros(img.shape[:2], np.float32); x0, y0, x1, y1 = box; m[y0:y1, x0:x1] = 1
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur))).astype(np.float32)[..., None] / 255
    src = np.roll(np.roll(img, dy, axis=0), dx, axis=1)
    return img * (1 - m) + src * m
_b = np.asarray(base).astype(np.float32)
_b = _clone(_b, (0, 562, 480, H), dy=150)
_b = _clone(_b, (470, 600, 945, H), dx=440, blur=10)
base = Image.fromarray(_b.clip(0, 255).astype(np.uint8))
# 色：昼の明るさのまま。少しだけ落ち着いた映画調（彩度をわずかに下げ、コントラストを少し上げる）
base = ImageEnhance.Color(base).enhance(0.9)
base = ImageEnhance.Contrast(base).enhance(1.06).convert('RGBA')
GLOW = 0.6
MOON = ((248, 246, 238), (196, 206, 222)); GOLD = ((246, 226, 170), (204, 164, 88))
def line(parts, x, y, size):
    f = ImageFont.truetype(FONT, size); text = ''.join(p for p, _ in parts)
    l, t, r, b = f.getbbox(text); sw = max(3, size // 22)
    def m(txt, dx=0, dy=0, s=0):
        mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).text((x - l + dx, y - t + dy), txt, font=f, fill=255, stroke_width=s, stroke_fill=255); return mk
    base.paste(Image.new('RGBA', (W, H), (8, 12, 26, 255)), (0, 0), m(text, 0, 0, sw * 4).filter(ImageFilter.GaussianBlur(18)).point(lambda v: int(v * GLOW)))
    base.paste(Image.new('RGBA', (W, H), (0, 0, 0, 255)), (0, 0), m(text, 5, 8, sw).filter(ImageFilter.GaussianBlur(5)).point(lambda v: int(v * 0.8)))
    base.paste(Image.new('RGBA', (W, H), (14, 18, 30, 255)), (0, 0), m(text, 0, 0, sw))
    cx = x
    for txt, (c1, c2) in parts:
        mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).text((cx - l, y - t), txt, font=f, fill=255)
        g = Image.new('RGBA', (W, H)); gd = ImageDraw.Draw(g)
        for yy_ in range(y, y + (b - t) + 1):
            tt = (yy_ - y) / max(1, b - t); gd.line([(0, yy_), (W, yy_)], fill=tuple(int(p + (q - p) * tt) for p, q in zip(c1, c2)) + (255,))
        base.paste(g, (0, 0), mk); cx += f.getlength(txt)
    return r - l, b - t
def fit(text, w):
    s = 300
    while ImageFont.truetype(FONT, s).getlength(text) > w: s -= 2
    return s
S = fit('同時に鳴いたら', 720)   # 左上に2行。2行とも同じ大きさ
w1, h1 = line([('6億匹', GOLD), ('の猫が', MOON)], 28, 22, S)
w2, h2 = line([('同時に鳴いたら', MOON)], 28, 22 + h1 + 22, S)
print('bottom', 22 + h1 + 22 + h2)
img = base.convert('RGB'); out = f'cat_chic_{sys.argv[2]}.png'; img.save(out); img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
print(out, S, w1, w2)
