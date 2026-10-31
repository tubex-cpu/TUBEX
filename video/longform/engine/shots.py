"""ショット（1カット）を設定から描く。

ショット = 背景（bg）＋ 重ねる要素（layers）の順番どおりの描画。
章の JSON に書いた順に描くので、同じ設定なら同じ絵になる。

背景 bg.type
  photo     : {"asset", "focus":[x,y], "z", "scrim"}  実写・再現画像。ゆっくり拡大
  tiles     : {"assets":[3枚], "scrim"}                 実写3枚を縦長に並べる
  dark      : {"grid": bool}                            暗い奥行き＋粒子（図解用）
  character : {"scrim"}                                 頬なしキャラクターの店内

要素 layers[].type
  eyebrow / title / credit / text / giant / metal / steam
  timeline / tick_ring / bowl_grid / bowl_field / arcs / relation / radial
"""
import math

from PIL import Image, ImageDraw

from .character import steam
from .diagrams import DiagramLayers
from .style import GOLD, H, W, bowl, ease


class ShotRenderer(DiagramLayers):
    def __init__(self, style, character_factory):
        self.s = style
        self._character_factory = character_factory
        self._character = None

    @property
    def character(self):
        if self._character is None:
            self._character = self._character_factory()
        return self._character

    def background(self, bg, t, u):
        s = self.s
        kind = bg['type']
        if kind == 'photo':
            im = s.pic(bg['asset'], u, tuple(bg.get('focus', (.5, .5))), bg.get('z', 1.02))
        elif kind == 'character':
            im = self.character.shot(t + bg.get('offset', 0))
        elif kind == 'tiles':
            im = s.dark(u)
            for j, nn in enumerate(bg['assets']):
                src = s.pic_src[nn]
                cw = src.height * .58
                cx = src.width / 2
                tile = src.crop((int(cx - cw / 2), 0, int(cx + cw / 2), src.height)).resize((610, 1050), Image.Resampling.LANCZOS)
                im.alpha_composite(tile, (25 + j * 630, int(10 + 9 * math.sin(u + j))))
        elif kind == 'dark':
            im = s.dark(u, grid=bg.get('grid', False))
        else:
            raise ValueError('unknown bg type: ' + kind)
        if 'scrim' in bg:
            s.scrim(im, bg['scrim'])
        return im

    def frame(self, shot, t, u):
        """t: 章の先頭からの秒、u: ショットの先頭からの秒。"""
        im = self.background(shot['bg'], t, u)
        for layer in shot.get('layers', []):
            getattr(self, 'layer_' + layer['type'])(im, layer, t, u)
        # 大きな見せ場の頭だけ短く光らせる（枠やスライドの装飾は付けない）。
        if shot.get('flash') and u < .17:
            im.alpha_composite(Image.new('RGBA', (W, H), (255, 211, 140, int(65 * (1 - u / .17)))))
        return im.convert('RGB')

    # --- 文字 ---
    def layer_eyebrow(self, im, L, t, u):
        self.s.eyebrow(im, L['text'])

    def layer_title(self, im, L, t, u):
        self.s.title(im, L['text'], u, y=L.get('y', 730), n=L.get('n', 100), kind=L.get('kind', 'serif'))

    def layer_credit(self, im, L, t, u):
        self.s.credit(im, L['text'])

    def layer_text(self, im, L, t, u):
        self.s.text(im, L['text'], tuple(L['xy']), L.get('n', 70), fill=L.get('fill', '#fff8eb'), kind=L.get('kind', 'sans'), anchor=L.get('anchor', 'lt'))

    def layer_giant(self, im, L, t, u):
        """特大の金色立体数字。章ごとに使える回数を制限している（lint）。"""
        self.s.giant(im, L['value'], L.get('unit', ''), u, y=L.get('y', 310), n=L.get('n', 450))

    def layer_metal(self, im, L, t, u):
        g = self.s.metal(L['text'], L.get('n', 230), L.get('kind', 'serif'))
        im.alpha_composite(g, ((W - g.width) // 2, L.get('y', 430)))

    def layer_steam(self, im, L, t, u):
        w, h = L['size']
        im.alpha_composite(steam(t, w, h, L['strength'], L['seed']), tuple(L['at']))

    # --- 図解 ---
    def layer_timeline(self, im, L, t, u):
        """年月の立体タイムライン：左上の開始年月から右下の終了年月へ線が伸びる。"""
        s = self.s
        d = ImageDraw.Draw(im)
        s.text(im, L['start'], (130, 280), 175, kind='num')
        s.text(im, L['end'], (1090, 575), 175, kind='num')
        p = ease(u / 1.5)
        d.line((180, 570, 180 + int(1530 * p), 570), fill=GOLD, width=6)
        for xx, yy in [(180, 570), (1710, 570)]:
            d.ellipse((xx - 12, yy - 12, xx + 12, yy + 12), fill=GOLD)
        s.text(im, L['start_label'], (140, 630), 40)
        s.text(im, L['end_label'], (1480, 840), 40)

    def layer_tick_ring(self, im, L, t, u):
        """時間のスケール：目盛りの輪が順に点灯する。"""
        d = ImageDraw.Draw(im)
        n = L.get('ticks', 38)
        r = L.get('r', 360)
        for j in range(n):
            ang = (j / n * math.tau - math.pi / 2)
            x = 960 + math.cos(ang) * r
            y = 540 + math.sin(ang) * r
            d.line((x, y, x + math.cos(ang) * 26, y + math.sin(ang) * 26), fill=GOLD if j < n * ease(u / L.get('dur', 1.6)) else '#3a4147', width=7)

    def layer_bowl_grid(self, im, L, t, u):
        """数量図：丼1個＝unit。count 個が順に点灯（23個＝2,300万杯など）。"""
        d = ImageDraw.Draw(im)
        count = L['count']
        cols = L.get('cols', 8)
        for j in range(count):
            row = j // cols
            col = j % cols
            s = 80 + row * 36
            x = 230 + col * 205
            y = 620 + row * 145
            bowl(d, x, y, s, GOLD if j < int(count * ease(u / L.get('dur', 1.0))) else '#3d454b')

    def layer_bowl_field(self, im, L, t, u):
        """遠近の数量図：手前ほど大きい丼が count 個並ぶ（200個＝2万杯など）。"""
        d = ImageDraw.Draw(im)
        count = L['count']
        cols = L.get('cols', 20)
        rows = math.ceil(count / cols)
        for j in range(count):
            row = j // cols
            col = j % cols
            dep = (row + 1) / rows
            s = 12 + dep * 39
            x = 960 + (col - (cols - 1) / 2) * (27 + dep * 56)
            y = 280 + dep ** 1.5 * 610 + math.sin(u + j * .3) * 2
            bowl(d, x, y, s, '#cc9b4a' if j < int(count * ease(u / L.get('dur', 1.3))) else '#343d44')

    def layer_arcs(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        for r in L.get('radii', [235, 315, 395]):
            d.arc((960 - r, 530 - r, 960 + r, 530 + r), int(u * 32), int(u * 32 + 265), fill='#6b4f29', width=2)

    def layer_relation(self, im, L, t, u):
        """関係図：左の項目から中心の問いへ線が集まり、右の項目へつながる。"""
        s = self.s
        d = ImageDraw.Draw(im)
        for j in range(5):
            yy = 350 + j * 115
            xx = 400 + j * 90
            d.line((xx, yy, 960, 540), fill='#79582e', width=2)
            d.ellipse((xx - 9, yy - 9, xx + 9, yy + 9), fill=GOLD)
        d.line((960, 540, 1450, 540), fill=GOLD, width=5)
        rr = 155 + int(8 * math.sin(u * 2))
        d.ellipse((960 - rr, 540 - rr, 960 + rr, 540 + rr), outline=GOLD, width=3)
        s.text(im, L['center'], (960, 505), 105, kind='serif', anchor='mt')
        s.text(im, L['left'], (220, 210), 100, kind='serif')
        s.text(im, L['right'], (1260, 665), 100, kind='serif')
        s.text(im, L['caption'], (960, 895), 52, anchor='mt')

    def layer_radial(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        for j in range(35):
            ang = j / 35 * math.tau + u * .02
            d.line((960, 540, 960 + math.cos(ang) * 1600, 540 + math.sin(ang) * 1000), fill='#292b2b', width=1)
