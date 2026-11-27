"""千年眠った後の世界：左右反転して信号機を右へ（コピーと重ねない）。コピーは左上に、世界観に合わせた明朝体・月明かりの白と淡い金で入れる。社長（2026-11-27）「コピーを左上に変更」「フォントをデザインの世界観とマッチするようにシックなデザインとカラーに変更」「信号機はコピーと重ならないように移動して」"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import importlib.util
spec = importlib.util.spec_from_file_location('rg', 'refont_g_lib.py'); rg = importlib.util.module_from_spec(spec); spec.loader.exec_module(rg)
FONT = '/home/user/work_neko/fonts/' + __import__('sys').argv[1]
base = rg.erase(Image.open('sen_night.jpg').convert('RGB'), [(750, 25, 1330, 305)])
base = ImageOps.mirror(base.convert('RGB')).convert('RGBA'); W, H = base.size
def grad_fill(size, c1, c2):
    g = Image.new('RGBA', size); d = ImageDraw.Draw(g)
    for y in range(size[1]):
        t = y / max(1, size[1] - 1); d.line([(0, y), (size[0], y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(c1, c2)) + (255,))
    return g
def line(parts, x, y, size):
    f = ImageFont.truetype(FONT, size); text = ''.join(p for p, _ in parts)
    l, t, r, b = f.getbbox(text); sw = max(3, size // 22)
    def m(txt, dx=0, dy=0, s=0):
        mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).text((x - l + dx, y - t + dy), txt, font=f, fill=255, stroke_width=s, stroke_fill=255); return mk
    glow = m(text, 0, 0, sw * 4).filter(ImageFilter.GaussianBlur(18))
    base.paste(Image.new('RGBA', (W, H), (8, 12, 26, 255)), (0, 0), glow.point(lambda v: int(v * 0.85)))  # 夜空になじむ影
    sh = m(text, 5, 8, sw).filter(ImageFilter.GaussianBlur(5))
    base.paste(Image.new('RGBA', (W, H), (0, 0, 0, 255)), (0, 0), sh.point(lambda v: int(v * 0.8)))
    base.paste(Image.new('RGBA', (W, H), (14, 18, 30, 255)), (0, 0), m(text, 0, 0, sw))  # 細い縁
    cx = x
    for txt, col in parts:
        mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).text((cx - l, y - t), txt, font=f, fill=255)
        c1, c2 = col
        base.paste(grad_fill((W, H), c1, c2).crop((0, 0, W, H)), (0, 0), mk) if False else None
        g = Image.new('RGBA', (W, H)); gd = ImageDraw.Draw(g)
        for yy in range(y, y + (b - t) + 1):
            tt = (yy - y) / max(1, b - t); gd.line([(0, yy), (W, yy)], fill=tuple(int(a + (bb - a) * tt) for a, bb in zip(c1, c2)) + (255,))
        base.paste(g, (0, 0), mk); cx += f.getlength(txt)
    return f, (r - l), (b - t)
MOON = ((248, 246, 238), (196, 206, 222)); GOLD = ((246, 226, 170), (204, 164, 88))
def fit(text, w):
    s = 300
    while ImageFont.truetype(FONT, s).getlength(text) > w: s -= 2
    return s
s1 = fit('千年眠った', 600); s2 = fit('後の世界', 600)
f, w1, h1 = line([('千年', GOLD), ('眠った', MOON)], 40, 44, s1)
line([('後の世界', MOON)], 40, 44 + h1 + 30, s2)
img = base.convert('RGB').resize((1280, 720), Image.LANCZOS)
out = 'sen_chic_' + __import__('sys').argv[2] + '.png'; img.save(out); img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png')); print(out, s1, s2)
