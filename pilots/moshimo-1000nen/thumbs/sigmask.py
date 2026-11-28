import numpy as np, cv2
from PIL import Image, ImageDraw
im = Image.open('sen_night.jpg').convert('RGB').resize((1280, 720), Image.LANCZOS)
W, H = im.size
xs = lambda y: 228 - 0.22 * (y - 30)
m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
d.polygon([(xs(22) - 22, 22), (xs(22) + 24, 22), (xs(640) + 40, 640), (xs(640) - 44, 640)], fill=255)  # 柱（つる込み）
d.polygon([(xs(40) - 70, 380), (xs(380) - 2, 380), (xs(470) - 2, 470), (xs(470) - 72, 470)], fill=255)  # 柱の看板
d.polygon([(214, 96), (300, 112), (340, 118), (480, 128), (478, 210), (340, 206), (300, 160), (214, 150)], fill=255)  # 腕と灯器
d.polygon([(150, 120), (215, 100), (215, 240), (150, 250)], fill=255)  # 柱の上部のつる
mask = np.asarray(m)
ov = np.asarray(im).copy(); ov[mask > 0] = (ov[mask > 0] * 0.4 + np.array([255, 0, 0]) * 0.6).astype(np.uint8)
Image.fromarray(ov).crop((0, 0, 640, 720)).save('/tmp/claude-0/-home-user-TUBEX/ed84dc31-edc4-5d67-b731-886bff6d57d1/scratchpad/mask_ov.png')
Image.fromarray(mask).save('sig_mask2.png')
