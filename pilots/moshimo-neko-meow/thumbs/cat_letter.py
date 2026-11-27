"""猫の回のサムネ（6億匹／同時に鳴いたら）を、1000年の夜のサムネと同じ世界観に：映画のような色（夕暮れの青と暖色、周辺を暗く）、明朝体・月明かりの白と淡い金。
社長（2026-11-27）「このサムネも千年眠ったサムネに世界観を合わせて欲しい。・デザイン、フォント修正 ・コピー変更 6億匹の猫が／同時に鳴いたら」"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import importlib.util
spec = importlib.util.spec_from_file_location('rg', 'refont_g_lib.py'); rg = importlib.util.module_from_spec(spec); spec.loader.exec_module(rg)
FONT = '/home/user/work_neko/fonts/' + sys.argv[1]
im = Image.open(sys.argv[3]).convert('RGB')
base = im.resize((1280, 720), Image.LANCZOS); W, H = base.size
base = ImageEnhance.Contrast(base).enhance(1.04).convert('RGBA')
GLOW = 0.45
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
S = fit('同時に鳴いたら', 700)   # 左上に2行。2行とも同じ大きさ
w1, h1 = line([('6億匹', GOLD), ('の猫が', MOON)], 28, 22, S)
w2, h2 = line([('同時に鳴いたら', MOON)], 28, 22 + h1 + 22, S)
print('bottom', 22 + h1 + 22 + h2)
img = base.convert('RGB'); out = f'cat_chic_{sys.argv[2]}.png'; img.save(out); img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
print(out, S, w1, w2)
