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
# 色：彩度を落とし、暗めに、影は青、明るい所は暖色（夕暮れの映画の色）
base = ImageEnhance.Color(base).enhance(0.72)
a = np.asarray(base).astype(np.float32) / 255
lum = a.mean(axis=2, keepdims=True)
shadow = np.array([0.55, 0.62, 0.85]); high = np.array([1.05, 0.92, 0.78])
a = a * (shadow * (1 - lum) + high * lum) * 0.74
yy, xx = np.mgrid[0:H, 0:W]
d = np.sqrt(((xx - W * 0.62) / (W * 0.62)) ** 2 + ((yy - H * 0.58) / (H * 0.62)) ** 2)
vig = np.clip(1 - 0.55 * np.clip(d - 0.35, 0, 1) ** 1.3, 0.3, 1)[..., None]
a = a * vig
# 左上（元の文字を消した跡）を夜空の色で暗くなじませる
gy = np.clip(1 - yy / 270.0, 0, 1) ** 0.9
gx = np.clip(1 - (xx - 560) / 320.0, 0, 1)
k = (gy * gx * 0.8)[..., None]
a = a * (1 - k) + np.array([0.03, 0.05, 0.10]) * k
base = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).convert('RGBA')
MOON = ((248, 246, 238), (196, 206, 222)); GOLD = ((246, 226, 170), (204, 164, 88))
def line(parts, x, y, size):
    f = ImageFont.truetype(FONT, size); text = ''.join(p for p, _ in parts)
    l, t, r, b = f.getbbox(text); sw = max(3, size // 22)
    def m(txt, dx=0, dy=0, s=0):
        mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).text((x - l + dx, y - t + dy), txt, font=f, fill=255, stroke_width=s, stroke_fill=255); return mk
    base.paste(Image.new('RGBA', (W, H), (8, 12, 26, 255)), (0, 0), m(text, 0, 0, sw * 4).filter(ImageFilter.GaussianBlur(18)).point(lambda v: int(v * 0.85)))
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
S = fit('同時に鳴いたら', 900)   # 下段（右の大きな茶トラに重ねない幅）に合わせて、上段も同じ大きさ
w1, h1 = line([('6億匹', GOLD), ('の猫が', MOON)], 26, 92, S)
w2, h2 = line([('同時に鳴いたら', MOON)], 26, H - 26 - int(S * 0.92), S)
img = base.convert('RGB'); out = f'cat_chic_{sys.argv[2]}.png'; img.save(out); img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))
print(out, S, w1, w2)
