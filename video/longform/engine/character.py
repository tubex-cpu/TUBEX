"""頬なしの黒いキャラクターが店内にいるショット（承認済みパッケージの animation.py から移植）。

キャラクターの目は白のみ。黒い瞳・ピンクの頬は描かない（承認条件）。
元の animation.py は60秒全体の時刻で寄りの構図を切り替えていたが、承認済み60秒版で
使われていたのは「通常の構図」だけなので、そこだけを残している（42〜45秒で一致）。
"""
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SW, SH = 1672, 941
W, H = 1920, 1080


def ease(t):
    t = max(0, min(1, t))
    return t * t * (3 - 2 * t)


class Character:
    def __init__(self, assets):
        self.base = assets.image('scene').resize((SW, SH))
        blink = assets.image('blink').resize((SW, SH))
        self.sprites = []
        for name in ['salmon', 'tuna', 'egg', 'ikura', 'shrimp']:
            im = assets.image(name)
            self.sprites.append(im.crop(im.getchannel('A').getbbox()))
        post = Image.new('L', (SW, SH))
        d = ImageDraw.Draw(post)
        for x, y, w in [(66, 45, 43), (409, 115, 34), (612, 157, 23), (741, 186, 18)]:
            d.rectangle((x, y, x + w, 339 - x * .025), fill=255)
        # 皿の土台はステンレスの縁の後ろに回る。
        d.polygon([(0, 341), (990, 310), (990, 460), (0, 490)], fill=255)
        d.ellipse((927, 144, 1262, 455), fill=255)
        d.polygon([(0, 324), (114, 322), (230, 795), (0, 941)], fill=255)
        self.post = post
        eyes = Image.new('L', (SW, SH))
        d = ImageDraw.Draw(eyes)
        d.ellipse((962, 328, 1034, 391), fill=255)
        d.ellipse((1031, 303, 1116, 367), fill=255)
        eyes = eyes.filter(ImageFilter.GaussianBlur(5))
        self.ebox = (950, 288, 1133, 415)
        self.ecrop = eyes.crop(self.ebox)
        self.bcrop = blink.crop(self.ebox)
        self.sizes = {}

    def plate(self, kind, width):
        width = int(round(width / 2) * 2)
        key = (kind, width)
        if key not in self.sizes:
            im = self.sprites[kind]
            h = int(width * im.height / im.width)
            self.sizes[key] = im.resize((width, h), Image.Resampling.LANCZOS)
        return self.sizes[key]

    def conveyor(self, im, t):
        for k in range(7):
            p = (k / 7 + t / 20) % 1
            x = 1000 - 1240 * p
            bottom = 308 + 38 * p
            width = 57 + 190 * p
            asset = self.plate(k % len(self.sprites), width)
            im.alpha_composite(asset, (int(x - asset.width / 2), int(bottom - asset.height)))
        im.paste(self.base, (0, 0), self.post)

    def blink_and_breathe(self, im, t):
        phase = t % 4.8
        v = 0
        if 3.8 < phase < 4.12:
            q = (phase - 3.8) / .32
            v = math.sin(q * math.pi) ** .6
        if v:
            mask = self.ecrop.point(lambda a: int(a * v))
            im.paste(self.bcrop, self.ebox[:2], mask)
        # 頭部だけを局所メッシュでわずかに動かし、写真の光を崩さない。
        box = (885, 100, 1320, 520)
        part = im.crop(box)
        ww, hh = part.size
        dx = 2.5 * math.sin(t * 1.4)
        dy = 2 * math.sin(t * 1.7)

        def src(x, y):
            gx = x + box[0]
            gy = y + box[1]
            fall = max(0, 1 - ((gx - 1090) / 224) ** 2) * max(0, 1 - ((gy - 300) / 222) ** 2)
            return x - dx * fall, y - dy * fall
        mesh = []
        for y in range(0, hh, 35):
            for x in range(0, ww, 35):
                x1 = min(ww, x + 35)
                y1 = min(hh, y + 35)
                mesh.append(((x, y, x1, y1), src(x, y) + src(x, y1) + src(x1, y1) + src(x1, y)))
        part = part.transform((ww, hh), Image.Transform.MESH, mesh, Image.Resampling.BICUBIC)
        im.paste(part, box[:2])

    def shot(self, t):
        im = self.base.copy()
        self.conveyor(im, t)
        self.blink_and_breathe(im, t)
        im.alpha_composite(steam(t, 300, 250, 78, 0), (635, 322))
        im.alpha_composite(steam(t * .87, 165, 190, 55, 2), (1385, 461))
        z = 1.015 + .012 * math.sin(t * .13)
        cx, cy = 836, 470
        cw, ch = int(SW / z), int(SH / z)
        cx = max(cw / 2, min(SW - cw / 2, cx))
        cy = max(ch / 2, min(SH - ch / 2, cy))
        return im.crop((int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))).resize((W, H), Image.Resampling.LANCZOS)


_steamgrids = {}


def steam(t, width, height, strength, seed):
    """流れる半透明の湯気。"""
    key = (width, height)
    if key not in _steamgrids:
        yy, xx = np.mgrid[0:height, 0:width].astype(np.float32)
        _steamgrids[key] = (xx / width, 1 - yy / height)
    x, u = _steamgrids[key]
    a = np.zeros_like(x)
    for k in range(5):
        center = .5 + (k - 2) * .075 + (u * .08 + .016) * np.sin(u * 9 - t * 1.8 + k * 1.7 + seed)
        center += .032 * np.sin(u * 19 - t * .8 + k)
        sigma = .009 + .029 * u
        a += np.exp(-((x - center) / sigma) ** 2) * (.55 + .45 * np.sin(u * 18 - t * 2.1 + k) ** 2)
    envelope = (np.maximum(0, np.sin(np.pi * np.clip(u, 0, 1))) ** .8) * np.maximum(0, 1 - u) ** .4
    noise = .55 + .45 * np.sin(19 * x + 16 * u - t * 2 + seed) * np.sin(37 * x - 9 * u + t * 1.7)
    alpha = np.uint8(np.clip(a * envelope * noise * strength, 0, 90))
    arr = np.empty((height, width, 4), dtype=np.uint8)
    arr[:, :, :3] = [255, 247, 233]
    arr[:, :, 3] = alpha
    return Image.fromarray(arr).filter(ImageFilter.GaussianBlur(1.2))
