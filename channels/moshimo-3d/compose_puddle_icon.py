# プロフィール画像（水たまり案）：バナーと同じ素材（ChatGPT の画像 puddle.webp・empty.webp）から、太陽と月の水たまりを大きく組む。800×800。
# 作業場所 /home/user/work_neko/brand/ で実行。画像は git に入れない。
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
SRC = Image.open('puddle.webp').convert('RGB'); BG = Image.open('empty.webp').convert('RGB')
w0, h0 = SRC.size; A = np.asarray(SRC).astype(int)
water = ((A[:, :, 2] > A[:, :, 0] + 30) & (A.sum(axis=2) < 300)); water[:555] = False; water[760:] = False; water[:, :600] = False; water[:, 1600:] = False
m = Image.fromarray((water * 255).astype('uint8')).filter(ImageFilter.MaxFilter(41)).filter(ImageFilter.GaussianBlur(9))
x0, x1, y0, y1 = 671 - 45, 1520 + 45, 574 - 22, 715 + 30
pud = SRC.crop((x0, y0, x1, y1)); pm = m.crop((x0, y0, x1, y1))
S = 800; hz = int(S * 0.40)
sky = BG.crop((700, 150, 1400, 553)).resize((S, hz), Image.LANCZOS)
gnd = BG.crop((500, 553, 1500, h0)).resize((S, S - hz), Image.LANCZOS)
c = Image.new('RGB', (S, S)); c.paste(sky, (0, 0)); c.paste(gnd, (0, hz))
pk = (S * 1.45) / pud.width  # 月を大きく：水たまりの両端は丸の外にはみ出してよい
pud2 = pud.resize((int(pud.width * pk), int(pud.height * pk)), Image.LANCZOS); pm2 = pm.resize(pud2.size, Image.LANCZOS)
# 月（水たまりの中ほど）が画面の中央に来るよう左右をそろえる
px = S // 2 - int((1094 - x0) * pk); py = hz + 2
c.paste(pud2, (px, py), pm2)
cx, cy = S // 2, hz - 110
yy, xx = np.mgrid[0:S, 0:S]; r = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2); ang = np.arctan2(yy - cy, xx - cx)
g = np.clip(1.0 - r / 46, 0, 1) ** 0.5 + 0.35 * np.exp(-(r / 85) ** 2) + 0.12 * np.exp(-(r / 190) ** 2) + 0.10 * np.exp(-(r / 140) ** 2) * (0.5 + 0.5 * np.cos(ang * 12))
C = np.asarray(c).astype(float) + np.clip(g, 0, 1.4)[..., None] * np.array([255, 250, 235]) * 0.75
c = Image.fromarray(np.clip(C, 0, 255).astype('uint8'))
c.save('icon_puddle_800.png')
for s in (48, 98, 320):
    t = c.resize((s, s), Image.LANCZOS); mk = Image.new('L', (s, s), 0); ImageDraw.Draw(mk).ellipse((0, 0, s - 1, s - 1), fill=255)
    o = Image.new('RGB', (s, s), (255, 255, 255)); o.paste(t, (0, 0), mk); o.save(f'icon_puddle_{s}_circle.png')
print('moon area', px, py, pud2.size)
