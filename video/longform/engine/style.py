"""承認済み60秒版（くら寿司・冒頭60秒 第6版）の描画部品。

`render.py`（承認済みパッケージ）の関数を、見た目を変えずに移したもの。
数値・色・順序を変えると承認済みの見た目から外れるため、変更するときは
`build.py selftest` で60秒版との一致を確かめる。
"""
from pathlib import Path
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080
GOLD = '#f5c76e'
WHITE = '#fff8eb'
MUTED = '#a9b5b8'


class Fonts:
    """project.json の fonts（種類 → [パス, index] の候補リスト）から最初に存在するものを使う。"""

    def __init__(self, spec):
        self.spec = spec
        self.cache = {}
        self.chosen = {}
        for kind, candidates in spec.items():
            for path, index in candidates:
                if Path(path).exists():
                    self.chosen[kind] = (path, index)
                    break

    def missing(self):
        return [k for k in self.spec if k not in self.chosen]

    def __call__(self, n, kind='sans'):
        key = (int(n), kind)
        if key not in self.cache:
            path, index = self.chosen[kind]
            self.cache[key] = ImageFont.truetype(str(path), int(n), index=index)
        return self.cache[key]


def ease(x):
    x = max(0, min(1, x))
    return 1 - (1 - x) ** 3


def _dark_base():
    y, x = np.mgrid[0:H, 0:W]
    v = np.exp(-(((x - 1100) / 1000) ** 2 + ((y - 480) / 700) ** 2))
    a = np.zeros((H, W, 4), dtype=np.uint8)
    a[:, :, 0] = 5 + v * 13
    a[:, :, 1] = 10 + v * 17
    a[:, :, 2] = 14 + v * 20
    a[:, :, 3] = 255
    return Image.fromarray(a)


class Style:
    def __init__(self, fonts, pictures):
        self.ft = fonts
        self.pic_src = pictures  # id -> RGBA Image（遅延読み込みの dict 風オブジェクト）
        self.cache = {}
        self.dark_base = _dark_base()
        rng = np.random.default_rng(6)
        self.particles = [(rng.uniform(0, W), rng.uniform(0, H), rng.uniform(.5, 2), rng.uniform(5, 24)) for _ in range(70)]

    # --- 文字 ---
    def text(self, im, s, xy, n=70, fill=WHITE, kind='sans', anchor='lt'):
        d = ImageDraw.Draw(im)
        d.text(tuple(xy), s, font=self.ft(n, kind), fill=fill, anchor=anchor, stroke_width=0)

    def shadowtext(self, im, s, xy, n=80, kind='sans', fill=WHITE, anchor='lt'):
        d = ImageDraw.Draw(im)
        d.text((xy[0] + 3, xy[1] + 5), s, font=self.ft(n, kind), fill=(0, 0, 0, 210), anchor=anchor, stroke_width=3)
        d.text(xy, s, font=self.ft(n, kind), fill=fill, anchor=anchor)

    def metal(self, s, n, kind='num'):
        """金色グラデーション＋約14pxの押し出しの立体文字。"""
        key = (s, n, kind)
        if key in self.cache:
            return self.cache[key]
        f = self.ft(n, kind)
        bb = f.getbbox(s)
        ww = bb[2] - bb[0] + 42
        hh = bb[3] - bb[1] + 42
        mask = Image.new('L', (ww, hh))
        ImageDraw.Draw(mask).text((20 - bb[0], 15 - bb[1]), s, font=f, fill=255)
        layer = Image.new('RGBA', (ww + 25, hh + 25))
        for z in range(14, 0, -1):
            layer.paste((61, 31, 10, 255), (z, z), mask)
        yy = np.arange(hh)[:, None]
        c = np.clip(.45 + .35 * np.cos((yy / hh - .3) * math.pi) + .25 * np.exp(-((yy / hh - .28) / .055) ** 2), 0, 1)
        arr = np.zeros((hh, ww, 4), dtype=np.uint8)
        for j, (lo, hi) in enumerate([(137, 255), (79, 240), (25, 194)]):
            arr[:, :, j] = lo + (hi - lo) * c
        arr[:, :, 3] = np.array(mask)
        layer.alpha_composite(Image.fromarray(arr))
        self.cache[key] = layer
        return layer

    def giant(self, im, s, unit, u, y=310, n=450):
        """画面いっぱいの数字。短いスケール収束つき。"""
        g = self.metal(s, n)
        un = self.metal(unit, 150, 'sans') if unit else None
        scale = 1 + .14 * (1 - ease(u / .55))
        width = g.width + (un.width + 8 if un else 0)
        layer = Image.new('RGBA', (width, max(g.height, un.height if un else 0)))
        layer.alpha_composite(g, (0, 0))
        if un:
            layer.alpha_composite(un, (g.width + 8, max(0, g.height - un.height - 24)))
        if scale != 1:
            layer = layer.resize((int(layer.width * scale), int(layer.height * scale)), Image.Resampling.BICUBIC)
        im.alpha_composite(layer, (int((W - layer.width) / 2), y))

    def credit(self, im, s):
        self.text(im, s, (100, 1015), 24, fill='#e3e0da')

    def eyebrow(self, im, s):
        self.text(im, s, (100, 85), 32, fill=GOLD)

    def title(self, im, s, u, y=730, n=100, kind='serif'):
        self.shadowtext(im, s, (100, y + int(25 * (1 - ease(u / .4)))), n, kind=kind)

    # --- 背景 ---
    def ambience(self, im, u, seed=0):
        d = ImageDraw.Draw(im)
        for j, (xx, yy, r, s) in enumerate(self.particles):
            xx = (xx + u * s + seed * 13) % W
            yy = (yy - u * (4 + j % 4)) % H
            d.ellipse((xx, yy, xx + r, yy + r), fill=(190, 135, 62, 60 + j % 90))
        return im

    def dark(self, u, grid=False):
        im = self.dark_base.copy()
        d = ImageDraw.Draw(im)
        if grid:
            for i in range(-14, 15):
                d.line((960 + i * 45, 420, 960 + i * 260, 1080), fill='#263039', width=1)
            for j in range(13):
                yy = 420 + ((j + u * .45) % 13 / 13) ** 2 * 660
                d.line((0, int(yy), W, int(yy)), fill='#253039', width=1)
        self.ambience(im, u)
        return im

    def pic(self, name, u, focus=(.5, .5), z=1.02):
        """写真は1.02倍を起点に、1秒あたり約0.025ずつゆっくり拡大。"""
        src = self.pic_src[name]
        zoom = z + .025 * u
        scale = max(W / src.width, H / src.height) * zoom
        cw, ch = W / scale, H / scale
        cx = max(cw / 2, min(src.width - cw / 2, src.width * focus[0]))
        cy = max(ch / 2, min(src.height - ch / 2, src.height * focus[1]))
        return src.crop((int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))).resize((W, H), Image.Resampling.LANCZOS)

    def scrim(self, im, amount=130):
        key = ('scrim', amount)
        if key not in self.cache:
            yy = np.linspace(0, 1, H)[:, None]
            alpha = (np.maximum(0, 1 - yy * 3) * amount + np.maximum(0, (yy - .55) / .45) * amount).astype(np.uint8)
            a = np.zeros((H, W, 4), dtype=np.uint8)
            a[:, :, 3] = alpha
            self.cache[key] = Image.fromarray(a)
        im.alpha_composite(self.cache[key])


def bowl(d, x, y, s, col):
    d.ellipse((x - s * .5, y - s * .12, x + s * .5, y + s * .17), fill='#503522', outline=col, width=max(1, int(s * .018)))
    d.pieslice((x - s * .5, y - s * .28, x + s * .5, y + s * .56), 0, 180, fill=col)
    d.ellipse((x - s * .5, y - s * .12, x + s * .5, y + s * .10), fill='#211f1b', outline=col, width=max(1, int(s * .018)))
    d.line((x - s * .2, y + s * .28, x + s * .2, y + s * .28), fill=col, width=max(2, int(s * .04)))
