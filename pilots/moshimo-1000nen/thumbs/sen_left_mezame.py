"""千年眠った後の世界：左右反転して信号機を右へ（コピーと重ねない）。コピーは左上に、世界観に合わせた明朝体・月明かりの白と淡い金で入れる。社長（2026-11-27）「コピーを左上に変更」「フォントをデザインの世界観とマッチするようにシックなデザインとカラーに変更」「信号機はコピーと重ならないように移動して」"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import importlib.util
spec = importlib.util.spec_from_file_location('rg', 'refont_g_lib.py'); rg = importlib.util.module_from_spec(spec); spec.loader.exec_module(rg)
FONT = '/home/user/work_neko/fonts/' + __import__('sys').argv[1]
base = Image.open('sen_fix_base.png').convert('RGB'); W, H = base.size
# 左上（元の文字を消した跡）を、夜空になじむように少し暗くする
_v = np.zeros((H, W), np.float32)
_yy, _xx = np.mgrid[0:H, 0:W]
_d = np.sqrt(((_xx - 260) / 430.0) ** 2 + ((_yy - 140) / 230.0) ** 2)
_v = np.clip(1.25 - _d, 0, 1) ** 1.2 * 0.5
_a = np.asarray(base).astype(np.float32) * (1 - _v[..., None]) + np.array([8, 12, 26]) * _v[..., None]
base = Image.fromarray(_a.clip(0, 255).astype(np.uint8)).convert('RGBA')
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
s2 = fit('千年後の世界', 700); s1 = s2
f, w1, h1 = line([('目が覚めると', MOON)], 30, 30, s1)
f2, w2, h2 = line([('千年後', GOLD), ('の世界', MOON)], 36, 30 + h1 + 24, s2)
print('text bottom', 30 + h1 + 24 + h2, 'right', 36 + w2)
img = base.convert('RGB')
out = 'sen_chic_' + __import__('sys').argv[2] + '.png'; img.save(out); img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png')); print(out, s1, s2)
