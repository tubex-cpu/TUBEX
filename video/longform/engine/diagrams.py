"""長尺用の図解（承認済み60秒版の見た目：暗い奥行き・金・白の要点文字に合わせた汎用部品）。

どれも ShotRenderer の layer_<type> として呼ばれる。要素は u（カット内の秒）で順に現れる。
文字は自動で幅に収める（はみ出し防止）。数値・語句は章の JSON に書く（ここに事実を書かない）。

  title_card : 中央の大きな問い・言葉（明朝）      {text, sub?, y?}
  quote      : 引用カード（細い金枠＋明朝）         {text, by}
  timeline_n : 年月の点を並べる線                    {points:[[label, caption]], highlight?}
  bars       : 横棒グラフ（伸びる）                  {items:[[label, value, value_label]], highlight?, unit_note?}
  steps      : 累計の階段グラフ                      {items:[[label, value, value_label]]}
  chips      : 言葉の札を順に並べる（×印も可）       {items:[...], cross?:bool, cols?, title?}
  compare    : 左右2列の比較（common の語を金色）    {left:{title, items}, right:{title, items}, common?}
  flow       : 箱を矢印でつなぐ                      {items:[...]}
  branch     : 1つから複数へ分かれる                 {source, targets:[...]}
  band       : 期間・時間の帯（伸びる）              {label, value, sub?}
  dots       : 点の格子のうち一部が金色              {total, lit, cols?, caption?}
  checklist  : 番号つきの確認項目（順に灯る）        {items:[...], active?}
  sizes      : 断面の大きさ比較（mm）                {items:[[label, w_mm, h_mm]], note?}
  ladder     : 値段などの推移（小さめの数字）        {items:[[label, value]]}
"""
import math

from PIL import Image, ImageDraw

from .character import steam
from .style import GOLD, MUTED, WHITE, W, bowl, ease

DIM = '#3d454b'
LINE = '#79582e'


class DiagramLayers:
    # --- 文字の補助 ---
    def fit(self, s, max_w, n, kind='sans', min_n=24):
        while n > min_n and self.s.ft(n, kind).getlength(s) > max_w:
            n -= 2
        return n

    def ctext(self, im, s, y, n, kind='sans', fill=WHITE, max_w=1600, anchor='mt', x=960):
        n = self.fit(s, max_w, n, kind)
        self.s.text(im, s, (x, y), n, fill=fill, kind=kind, anchor=anchor)
        return n

    def numtext(self, im, s, xy, n, fill=WHITE, anchor='ls'):
        """数字は数字用フォント、続く日本語（万杯・円など）は和文フォントで小さめに描く。anchor は 'ls'/'ms'/'rs'（下端そろえ）。"""
        i = len(s)
        while i and not s[i - 1].isascii():
            i -= 1
        head, unit = s[:i], s[i:]
        if any(not c.isascii() for c in head):
            head, unit = s, ''
        fn, fu = self.s.ft(n, 'num' if head else 'sans'), self.s.ft(int(n * .55), 'sans')
        wh = fn.getlength(head) if head else 0
        wu = fu.getlength(unit) if unit else 0
        x, y = xy
        if anchor[0] == 'm':
            x -= (wh + wu + 6) / 2
        elif anchor[0] == 'r':
            x -= wh + wu + 6
        d = ImageDraw.Draw(im)
        if head:
            d.text((x, y), head, font=fn, fill=fill, anchor='ls')
        if unit:
            d.text((x + wh + 6, y), unit, font=fu, fill=fill, anchor='ls')

    @staticmethod
    def appear(u, i, step=.35, start=.15):
        """i 番目の要素の出現度（0〜1）。"""
        return ease((u - start - i * step) / .35)

    # --- 文字の図 ---
    def layer_title_card(self, im, L, t, u):
        y = L.get('y', 430)
        p = ease(u / .5)
        self.ctext(im, L['text'], y + int(20 * (1 - p)), L.get('n', 110), kind=L.get('kind', 'serif'), max_w=1650)
        if L.get('sub'):
            self.ctext(im, L['sub'], y + L.get('n', 110) + 50, 44, fill=GOLD, max_w=1600)

    def layer_quote(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        p = ease(u / .45)
        x0, y0, x1, y1 = 180, 300, 1740, 760
        d.rounded_rectangle((x0, y0, x1, y1), radius=14, outline=GOLD, width=2, fill=(8, 12, 16, int(170 * p)))
        lines = L['text'].split('\n')
        n = min(self.fit(max(lines, key=len), 1360, 76, 'serif') for _ in [0])
        yy = 530 - (len(lines) - 1) * (n + 22) // 2
        for ln in lines:
            self.s.text(im, ln, (960, yy), n, kind='serif', anchor='mm')
            yy += n + 22
        if L.get('by'):
            self.ctext(im, '― ' + L['by'], y1 - 70, 34, fill=GOLD, max_w=1400)

    # --- 時間 ---
    def layer_timeline_n(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        pts = L['points']
        n = len(pts)
        x0, x1, y = 200, 1720, 600
        p = ease(u / 1.2)
        d.line((x0, y, x0 + int((x1 - x0) * p), y), fill=GOLD, width=5)
        hi = L.get('highlight')
        for i, (label, cap) in enumerate(pts):
            x = x0 + (x1 - x0) * (i / max(1, n - 1))
            a = self.appear(u, i, .3)
            if a <= 0:
                continue
            col = GOLD if (hi is None or hi == i) else MUTED
            r = 14 if hi == i else 10
            d.ellipse((x - r, y - r, x + r, y + r), fill=col)
            up = i % 2 == 0
            ln = 70 if label.isascii() else 56
            self.s.text(im, label, (x, y - 40 if up else y + 40), ln, kind='num' if label.isascii() else 'sans', fill=col, anchor='md' if up else 'ma')
            if cap:
                cn = self.fit(cap, 380, 36)
                self.s.text(im, cap, (x, y - 40 - ln - 16 if up else y + 40 + ln + 16), cn, fill=WHITE if col == GOLD else MUTED,
                            anchor='md' if up else 'ma')

    def layer_band(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        p = ease(u / 1.4)
        x0, x1, y = 260, 1660, 560
        d.rounded_rectangle((x0, y - 14, x1, y + 14), radius=14, fill='#1d252b')
        d.rounded_rectangle((x0, y - 14, x0 + max(28, int((x1 - x0) * p)), y + 14), radius=14, fill=GOLD)
        self.ctext(im, L['label'], y - 300, 50, fill=MUTED)
        self.s.text(im, L['value'], (960, y - 60), self.fit(L['value'], 1200, 170, 'serif'), kind='serif', anchor='md')
        if L.get('sub'):
            self.ctext(im, L['sub'], y + 60, 40, fill=WHITE)

    # --- 量 ---
    def layer_bars(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        items = L['items']
        vmax = max(v for _, v, _ in items)
        top = 300 if len(items) <= 4 else 250
        gap = min(150, 560 // len(items))
        hi = L.get('highlight')
        for i, (label, v, vl) in enumerate(items):
            y = top + i * gap
            a = self.appear(u, i, .25)
            col = GOLD if (hi is None or hi == i) else '#6b7177'
            ln = self.fit(label, 430, 44)
            self.s.text(im, label, (620, y + 22), ln, fill=WHITE if col == GOLD else MUTED, anchor='rm')
            w = int(980 * v / vmax * a)
            if w > 2:
                d.rounded_rectangle((660, y, 660 + w, y + 44), radius=8, fill=col)
            if a > .6:
                self.numtext(im, vl, (680 + w, y + 40), 46, fill=col, anchor='ls')
        if L.get('unit_note'):
            self.ctext(im, L['unit_note'], top + len(items) * gap + 40, 30, fill=MUTED)

    def layer_steps(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        items = L['items']
        n = len(items)
        vmax = max(v for _, v, _ in items)
        x0, x1, base, hmax = 300, 1620, 860, 470
        w = (x1 - x0) / n
        for i, (label, v, vl) in enumerate(items):
            a = self.appear(u, i, .4)
            h = int(hmax * v / vmax * a)
            x = x0 + i * w
            col = GOLD if i == n - 1 else '#a07c3e'
            d.rectangle((x + 18, base - h, x + w - 18, base), fill=col)
            if a > .5:
                self.numtext(im, vl, (x + w / 2, base - h - 18), 64, fill=GOLD, anchor='ms')
            self.s.text(im, label, (x + w / 2, base + 22), self.fit(label, w - 10, 36), fill=MUTED, anchor='ma')
        d.line((x0, base, x1, base), fill=LINE, width=2)

    def layer_dots(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        total, lit = L['total'], L['lit']
        cols = L.get('cols', 60)
        rows = math.ceil(total / cols)
        cell = min(1500 / cols, 520 / rows)
        x0 = 960 - cols * cell / 2
        y0 = 300
        k = int(lit * ease((u - .3) / 1.2))
        for j in range(total):
            r, c = divmod(j, cols)
            x = x0 + c * cell + cell / 2
            y = y0 + r * cell + cell / 2
            rr = max(1.5, cell * .32)
            d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=GOLD if j < k else '#2c353b')
        if L.get('caption'):
            self.ctext(im, L['caption'], y0 + rows * cell + 40, 44)

    def layer_sizes(self, im, L, t, u):
        """断面の比較。mm を同じ倍率で描く。"""
        d = ImageDraw.Draw(im)
        items = L['items']
        scale = L.get('px_per_mm', 60)
        n = len(items)
        for i, (label, wmm, hmm) in enumerate(items):
            a = self.appear(u, i, .35)
            cx = 960 + (i - (n - 1) / 2) * 520
            w, h = wmm * scale * a, hmm * scale * a
            col = GOLD if i == L.get('highlight', n - 1) else '#a9b5b8'
            if w > 1:
                d.rounded_rectangle((cx - w / 2, 560 - h / 2, cx + w / 2, 560 + h / 2), radius=6, fill=col)
            self.s.text(im, f'{wmm}mm x {hmm}mm', (cx, 720), 44, kind='num', fill=col, anchor='ma')
            self.s.text(im, label, (cx, 380), self.fit(label, 480, 40), fill=WHITE, anchor='ma')
        if L.get('note'):
            self.ctext(im, L['note'], 850, 30, fill=MUTED)

    def layer_ladder(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        items = L['items']
        n = len(items)
        for i, (label, v) in enumerate(items):
            a = self.appear(u, i, .4)
            if a <= 0:
                continue
            x = 960 + (i - (n - 1) / 2) * 400
            y = 600 - i * 50
            self.numtext(im, v, (x, y), 92, fill=GOLD if i == n - 1 else WHITE, anchor='ms')
            self.s.text(im, label, (x, y + 20), self.fit(label, 360, 32), fill=MUTED, anchor='ma')
            if i:
                px = 960 + (i - 1 - (n - 1) / 2) * 400
                d.line((px + 120, y + 20, x - 120, y - 30), fill=LINE, width=2)

    # --- ことば・関係 ---
    def layer_chips(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        items = L['items']
        cols = L.get('cols', min(4, len(items)))
        rows = math.ceil(len(items) / cols)
        cw, ch = 1500 / cols, 120
        y0 = 540 - rows * (ch + 30) / 2 + (40 if L.get('title') else 0)
        if L.get('title'):
            self.ctext(im, L['title'], y0 - 110, 50, fill=GOLD)
        for i, s in enumerate(items):
            a = self.appear(u, i, L.get('step', .22))
            if a <= 0:
                continue
            r, c = divmod(i, cols)
            last = len(items) - r * cols
            nrow = min(cols, last)
            x = 960 + (c - (nrow - 1) / 2) * cw
            y = y0 + r * (ch + 30)
            d.rounded_rectangle((x - cw / 2 + 16, y, x + cw / 2 - 16, y + ch), radius=12, outline=GOLD, width=2,
                                fill=(10, 14, 18, int(200 * a)))
            self.s.text(im, s, (x, y + ch / 2), self.fit(s, cw - 60, 52), anchor='mm')
            if L.get('cross') and u > .8 + i * .22:
                q = ease((u - .8 - i * .22) / .3)
                k = (cw / 2 - 40) * q
                d.line((x - k, y + 20, x + k, y + ch - 20), fill=GOLD, width=6)
                d.line((x - k, y + ch - 20, x + k, y + 20), fill=GOLD, width=6)

    def layer_compare(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        common = set(L.get('common', [])) or (set(L['left']['items']) & set(L['right']['items']))
        for side, x in (('left', 560), ('right', 1360)):
            col = L[side]
            self.s.text(im, col['title'], (x, 230), self.fit(col['title'], 700, 50), fill=GOLD, anchor='ma')
            for i, s in enumerate(col['items']):
                a = self.appear(u, i, .18)
                if a <= 0:
                    continue
                y = 320 + i * 82
                hit = s in common and u > 2.0
                if hit:
                    d.rounded_rectangle((x - 240, y - 6, x + 240, y + 62), radius=10, outline=GOLD, width=2)
                self.s.text(im, s, (x, y + 28), 46, fill=GOLD if hit else WHITE, anchor='mm')
        d.line((960, 230, 960, 900), fill=LINE, width=2)

    def layer_flow(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        items = L['items']
        n = len(items)
        bw = min(380, 1600 / n - 60)
        for i, s in enumerate(items):
            a = self.appear(u, i, .45)
            if a <= 0:
                continue
            x = 960 + (i - (n - 1) / 2) * (bw + 70)
            col = GOLD if i == n - 1 else '#a9b5b8'
            d.rounded_rectangle((x - bw / 2, 470, x + bw / 2, 610), radius=14, outline=col, width=3, fill=(10, 14, 18, 200))
            self.s.text(im, s, (x, 540), self.fit(s, bw - 30, 46), anchor='mm', fill=WHITE)
            if i:
                px = x - (bw + 70)
                d.line((px + bw / 2 + 8, 540, x - bw / 2 - 10, 540), fill=GOLD, width=4)
                d.polygon([(x - bw / 2 - 10, 540), (x - bw / 2 - 26, 530), (x - bw / 2 - 26, 550)], fill=GOLD)

    def layer_branch(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        targets = L['targets']
        sx, sy = 480, 540
        rr = 175
        d.ellipse((sx - rr, sy - rr, sx + rr, sy + rr), outline=GOLD, width=4, fill=(12, 16, 20, 230))
        self.s.text(im, L['source'], (sx, sy), self.fit(L['source'], 2 * rr - 30, 56, 'serif'), kind='serif', anchor='mm')
        n = len(targets)
        for i, s in enumerate(targets):
            a = self.appear(u, i, .35, .4)
            if a <= 0:
                continue
            ty = 540 + (i - (n - 1) / 2) * min(170, 700 / max(1, n - 1) if n > 1 else 0)
            tx = 1380
            ex = sx + rr + (tx - 200 - sx - rr) * a
            d.line((sx + rr, sy, ex, sy + (ty - sy) * a), fill=GOLD, width=3)
            if a > .8:
                d.rounded_rectangle((tx - 200, ty - 50, tx + 200, ty + 50), radius=12, outline=GOLD, width=2)
                self.s.text(im, s, (tx, ty), self.fit(s, 360, 48), anchor='mm')

    def layer_checklist(self, im, L, t, u):
        d = ImageDraw.Draw(im)
        items = L['items']
        act = L.get('active', len(items) - 1)
        y0 = 540 - len(items) * 95 / 2
        for i, s in enumerate(items):
            y = y0 + i * 95
            on = i <= act
            col = GOLD if i == act else ('#c9b48a' if on else '#3a4147')
            d.ellipse((260, y, 330, y + 70), outline=col, width=3, fill=(14, 18, 22, 255) if i != act else (60, 45, 20, 255))
            self.s.text(im, str(i + 1), (295, y + 35), 40, kind='num', fill=col, anchor='mm')
            self.s.text(im, s, (370, y + 35), self.fit(s, 1300, 46), fill=WHITE if on else '#59636a', anchor='lm')
