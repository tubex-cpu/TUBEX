"""chizu-003-canada-housing (long, 20+ min; 社長 2026-11-13「カナダ動画を制作して」・尺20〜30分).
Look = Bermuda v4 (社長 2026-11-12: rounded-gothic subtitles, light background). Reuses chizu-005 render_v4 (and through it
render_v3 / render.py / chizu-001 render_v23) for drawing, timeline and subtitles, and swaps in this episode's data:
05_script.md → audio/timings.json, subtitles.json, the shots below, Codex's images in gen/ (no on-screen AI label).
Maps: relief base (shadedrelief) with Natural Earth lakes / borders / provinces (ca_maps.py); zoomed maps = Natural Earth 1:10m land.
No corner notes, headings or credits on screen (社長 2026-11-12). Sources and credits go to the description.
Usage: python3 render.py --list | --shotlist | --still SEC ... | --chunks i/m | --mux
"""
import argparse, json, math, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
HERE = Path(__file__).resolve().parent
EP = HERE.parent
sys.path.insert(0, str(EP.parent / "chizu-005-bermuda-roof-water/render"))
sys.path.insert(0, str(HERE))
import render_v4 as V4
from render_v4 import B, R, V3, W, H, NEW, text, panel, font
import draw, geo, base
import ca_maps as M

AM, TE, INK, MU, RE = NEW["AMBER"], NEW["TEAL"], NEW["INK"], NEW["MUTED"], NEW["RED"]
seg, ease, label, layer, put = B.seg, B.ease, B.label, B.layer, B.put
OUT = HERE / "out"; OUT.mkdir(exist_ok=True)

# ---------------------------------------------------------------- episode data
TIM = json.loads((EP / "audio/timings.json").read_text())
R.EP, R.OUT, R.TIM = EP, OUT, TIM
R.SC = {s["scene"]: s for s in TIM["scenes"]}
R.TOTAL = TIM["scenes"][-1]["end"] + 2.5
R.SUBS = [(c["start"], c["end"], c["lines"]) for c in json.loads((EP / "subtitles.json").read_text())]
R.TL = None
B.EP, B.OUT = EP, OUT
R.CITIES.clear()
R.CITIES.update({
    "ケベック": (-71.21, 46.81), "モントリオール": (-73.57, 45.50), "オタワ": (-75.70, 45.42), "トロント": (-79.38, 43.65),
    "ハミルトン": (-79.87, 43.26), "ウィニペグ": (-97.14, 49.90), "レジャイナ": (-104.61, 50.45), "カルガリー": (-114.07, 51.05),
    "エドモントン": (-113.49, 53.55), "バンクーバー": (-123.12, 49.28), "ノースベイ": (-79.46, 46.31), "サドベリー": (-80.99, 46.49),
    "サンダーベイ": (-89.25, 48.38), "レヴェルストーク": (-118.20, 51.00), "キッキング・ホース峠": (-116.29, 51.45),
    "クレイゲラキー": (-118.65, 50.98), "ライス湖": (-78.20, 44.18), "ナイアガラ川": (-79.06, 43.10),
    "オークランド": (174.76, -36.85), "ミネアポリス": (-93.27, 44.98), "東京": (139.69, 35.69), "札幌": (141.35, 43.06),
})
B.SIDE.clear()
B.SIDE.update({"ケベック": "r", "モントリオール": "r", "オタワ": "l", "トロント": "l", "ハミルトン": "l", "ウィニペグ": "r",
               "レジャイナ": "r", "カルガリー": "r", "エドモントン": "r", "バンクーバー": "l", "ノースベイ": "r", "サドベリー": "l",
               "サンダーベイ": "l", "レヴェルストーク": "l", "キッキング・ホース峠": "r", "クレイゲラキー": "l", "ライス湖": "r",
               "ナイアガラ川": "r", "オークランド": "r", "ミネアポリス": "r", "東京": "r", "札幌": "r"})
CPR = ["モントリオール", "オタワ", "ノースベイ", "サドベリー", "サンダーベイ", "ウィニペグ", "レジャイナ", "カルガリー",
       "キッキング・ホース峠", "レヴェルストーク", "バンクーバー"]

CAN = dict(lon=-96.0, lat=58.0, kmpp=4.6)
SOUTH = dict(lon=-98.0, lat=50.5, kmpp=2.9)
EAST = dict(lon=-75.5, lat=45.6, kmpp=0.9)
TORV = dict(lon=-79.2, lat=43.75, kmpp=0.18)
GTA = dict(lon=-79.3, lat=43.85, kmpp=0.45)
VANV = dict(lon=-123.12, lat=49.25, kmpp=0.06)
METV = dict(lon=-122.85, lat=49.2, kmpp=0.09)
KMPP = lambda: R._KMPP[0]
M.LAKE = (140, 186, 220)


# ---------------------------------------------------------------- map layers
def L_lakes():
    return lambda img, p, t, d: M.fill_polys(img, p, M.lakes(), M.LAKE, outline=(120, 168, 204), width=1)


def L_can(t0=0.0, prov=False):
    return M.L_canada(t0=t0, provinces_on=prov)


def L_band(t0=0.4):
    return M.L_band(100, t0=t0, color=AM, kmpp=KMPP)


def L_terr(t0=0.3):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.0)
        pr = {g: ps for g, _, ps in M.provinces()}
        M.fill_polys(img, p, [pr["YT"], pr["NT"], pr["NU"]], TE, outline=TE, width=3, alpha=0.45 * a)
    return fn


def L_prov(ids, t0=0.3, color=None):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.0)
        pr = {g: ps for g, _, ps in M.provinces()}
        M.fill_polys(img, p, [pr[i] for i in ids], color or AM, outline=color or AM, width=3, alpha=0.4 * a)
    return fn


def L_japan(lon, lat, t0=0.6):
    """Japan's outline at the same scale (equal-area), centred at lon/lat of the current map."""
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.0)
        if a <= 0:
            return
        cx, cy = p(lon, lat)
        k = KMPP()
        L = Image.new("RGBA", img.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(L)
        for poly in R.country("Japan"):
            r = poly[0]
            if len(r) < 30:
                continue
            x, y = geo.laea(r[:, 0], r[:, 1], 137.5, 36.5)
            dr.polygon(list(zip(cx + x / k, cy - y / k)), fill=RE + (int(200 * a),), outline=RE + (int(255 * a),))
        img.alpha_composite(L)
        text(img, (cx + 170, cy + 60), "日本（同じ縮尺）", 44, anchor="lm", alpha=a, fill=RE)
    return fn


def L_line(names, t0=0.5, dur=3.0, color=None):
    """Dashed line through cities (a sketch of the route through those cities, not the exact track)."""
    def fn(img, p, t, d):
        k = seg(t, t0, t0 + dur)
        pts = [p(*R.CITIES[n]) for n in names]
        seglens = [math.dist(a, b) for a, b in zip(pts, pts[1:])]
        tot = sum(seglens) * k
        dr = ImageDraw.Draw(img)
        for (a, b), sl in zip(zip(pts, pts[1:]), seglens):
            if tot <= 0:
                break
            f = min(1.0, tot / sl)
            n = max(1, int(sl * f / 22))
            for i in range(n):
                u0, u1 = i / n * f, (i + 0.6) / n * f
                dr.line([(a[0] + (b[0] - a[0]) * u0, a[1] + (b[1] - a[1]) * u0), (a[0] + (b[0] - a[0]) * u1, a[1] + (b[1] - a[1]) * u1)],
                        fill=(color or RE) + (255,), width=6)
            tot -= sl
    return fn


def L_text(lon, lat, s, t0=0.3, size=40, color=None, anchor="mm"):
    return lambda img, p, t, d: text(img, p(lon, lat), s, size, anchor=anchor, fill=color or INK, alpha=seg(t, t0, t0 + 0.6))


def L_years(items, t0=0.3, stagger=0.7, size=40):
    """City dots with a year under each name: items = [(city, year), ...]."""
    def fn(img, p, t, d):
        for i, (c, y) in enumerate(items):
            a = seg(t, t0 + i * stagger, t0 + i * stagger + 0.5)
            if a <= 0:
                continue
            x, yy = p(*R.CITIES[c])
            dr = ImageDraw.Draw(img)
            dr.ellipse([x - 13, yy - 13, x + 13, yy + 13], fill=AM + (int(255 * a),), outline=(255, 255, 255, int(255 * a)), width=3)
            side = B.SIDE.get(c, "r")
            ax = x + 26 if side == "r" else x - 26
            text(img, (ax, yy - 18), c, size, anchor="lm" if side == "r" else "rm", alpha=a)
            text(img, (ax, yy + 26), y, size - 6, anchor="lm" if side == "r" else "rm", alpha=a, fill=AM)
    return fn


def L_measure(a, b, s, t0=0.6):
    def fn(img, p, t, d):
        k = seg(t, t0, t0 + 1.2)
        if k > 0:
            R.arrow(img, p(*R.CITIES[a])[:2], p(*R.CITIES[b])[:2], color=AM, width=6, prog=k, alpha=min(1, k * 3))
            pa, pb = p(*R.CITIES[a]), p(*R.CITIES[b])
            text(img, ((pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2 - 50), s, 46, anchor="mm", fill=AM, alpha=seg(t, t0 + 1.0, t0 + 1.6))
    return fn


def dots(names, t0=0.3, stagger=0.35, color=None, size=40):
    return B.L_dots(names, t0, stagger, color or AM, True, size)


# ---------------------------------------------------------------- diagrams
d_big, title = V3.d_big, V3.title


def d_bars(head, rows, unit=""):
    """V4.d_bars with thousands separators in the value labels."""
    lx = max(560, 140 + max(draw.text_w(k, 44) for k, _ in rows))
    x0 = lx + 40
    span = min(900, W - 360 - x0)

    def fn(img, t, d):
        title(img, head, t, y=170)
        mx = max(v for _, v in rows)
        for i, (k, v) in enumerate(rows):
            a = seg(t, 0.4 + i * 0.7, 1.4 + i * 0.7)
            y = 320 + i * 130
            text(img, (lx, y), k, 44, anchor="rm", alpha=min(1, a * 2))
            panel(img, (x0, y - 38, x0 + span * v / mx * a, y + 38), fill=TE if i else AM, alpha=0.9, radius=8)
            if a > 0.05:
                s = f"{v:,}" if isinstance(v, int) else f"{v:g}"
                text(img, (x0 + 20 + span * v / mx * a, y), s + unit, 44, anchor="lm", alpha=min(1, a * 2))
    return fn


def d_year(year, l1, l2=""):
    return B.d_year(year, l1, l2)


def d_people(n, k, cap, sub="", cols=None):
    """n person icons, the first k highlighted."""
    cols = cols or n
    def fn(img, t, d):
        L, dr = layer()
        rows = math.ceil(n / cols)
        sz = min(200, 1500 // cols)
        x0 = W / 2 - (cols - 1) * sz / 2
        y0 = 470 - (rows - 1) * sz * 0.8
        for i in range(n):
            a = seg(t, 0.1 + i * 0.12, 0.5 + i * 0.12)
            if a <= 0:
                continue
            x = x0 + (i % cols) * sz; y = y0 + (i // cols) * sz * 1.6
            col = (AM if i < k else (196, 196, 192)) + (int(255 * a),)
            r = sz * 0.2
            dr.ellipse([x - r, y - sz * 0.55 - r, x + r, y - sz * 0.55 + r], fill=col)
            dr.rounded_rectangle([x - sz * 0.32, y - sz * 0.3, x + sz * 0.32, y + sz * 0.35], radius=int(sz * 0.18), fill=col)
        put(img, L, 1.0)
        text(img, (W / 2, 160), cap, 60, anchor="mm", alpha=seg(t, 0.2, 0.8), fill=AM)
        if sub:
            text(img, (W / 2, 250), sub, 42, anchor="mm", alpha=seg(t, 0.6, 1.2))
    return fn


def d_three(head, items):
    """Up to four white cards in a row: items = [(big, small), ...]."""
    def fn(img, t, d):
        title(img, head, t, y=170)
        n = len(items); w = min(480, 1680 // n - 40)
        for i, (big, small) in enumerate(items):
            a = seg(t, 0.5 + i * 0.6, 1.0 + i * 0.6)
            x = W / 2 + (i - (n - 1) / 2) * (w + 40)
            panel(img, (x - w / 2, 320, x + w / 2, 700), fill=(16, 28, 50), alpha=0.95 * a, outline=TE if i else AM)
            sz = 64 if draw.text_w(big, 64) < w - 40 else 52
            text(img, (x, 470), big, sz, anchor="mm", alpha=a, fill=AM if i == 0 else TE)
            for j, ln in enumerate(small.split("\n")):
                text(img, (x, 580 + j * 50), ln, 36, anchor="mm", alpha=a, weight="500Medium")
    return fn


def d_timeline(head, items):
    """Horizontal timeline: items = [(when, what), ...]; what may contain \\n."""
    def fn(img, t, d):
        title(img, head, t, y=170)
        n = len(items); x0, x1, y = 260, 1660, 470
        k = seg(t, 0.2, 0.2 + 0.7 * n)
        L, dr = layer()
        dr.line([(x0 - 60, y), (x0 - 60 + (x1 - x0 + 120) * k, y)], fill=(150, 152, 156, 255), width=6)
        put(img, L, 1.0)
        for i, (wh, wt) in enumerate(items):
            a = seg(t, 0.4 + i * 0.7, 0.9 + i * 0.7)
            x = x0 + (x1 - x0) * (i / max(1, n - 1)) if n > 1 else W / 2
            L2, d2 = layer()
            d2.ellipse([x - 16, y - 16, x + 16, y + 16], fill=AM + (int(255 * a),), outline=(255, 255, 255, int(255 * a)), width=4)
            put(img, L2, 1.0)
            text(img, (x, y - 70), wh, 44, anchor="mm", alpha=a, fill=AM)
            for j, ln in enumerate(wt.split("\n")):
                text(img, (x, y + 80 + j * 52), ln, 38, anchor="mm", alpha=a)
    return fn


def d_compare(head, left, right, foot=""):
    """Two cards: left/right = (name, big, small)."""
    def fn(img, t, d):
        title(img, head, t, y=170)
        for i, (nm, big, small) in enumerate((left, right)):
            a = seg(t, 0.4 + i * 0.8, 1.0 + i * 0.8)
            x = W / 2 + (i - 0.5) * 760
            panel(img, (x - 340, 290, x + 340, 720), fill=(16, 28, 50), alpha=0.95 * a, outline=AM if i == 0 else TE)
            text(img, (x, 370), nm, 48, anchor="mm", alpha=a)
            sz = 84 if draw.text_w(big, 84) < 620 else 64
            text(img, (x, 500), big, sz, anchor="mm", alpha=a, fill=AM if i == 0 else TE)
            for j, ln in enumerate(small.split("\n")):
                text(img, (x, 610 + j * 48), ln, 36, anchor="mm", alpha=a, weight="500Medium")
        if foot:
            text(img, (W / 2, 790), foot, 40, anchor="mm", alpha=seg(t, 2.0, 2.6), fill=MU)
    return fn


def d_density(img, t, d):
    """Same-size squares: Toronto city vs Tokyo's 23 wards, dots ∝ population density (4,428 vs ~15,500 per km²)."""
    title(img, "ほぼ同じ広さ　人の密度は大きく違う", t, y=130)
    rng = np.random.default_rng(5)
    for i, (nm, area, dens, n) in enumerate((("トロント市", "約631km²", "約4,400人/km²", 130), ("東京23区", "約627.5km²", "約1万5,500人/km²", 455))):
        a = seg(t, 0.3 + i * 0.9, 0.9 + i * 0.9)
        x = W / 2 + (i - 0.5) * 760; s = 250
        panel(img, (x - s, 300, x + s, 740), fill=(16, 28, 50), alpha=0.95 * a, outline=AM if i == 0 else TE)
        L, dr = layer()
        k = seg(t, 0.8 + i * 0.9, 2.2 + i * 0.9)
        xs = rng.uniform(x - s + 20, x + s - 20, n); ys = rng.uniform(320, 720, n)
        for j in range(int(n * k)):
            dr.ellipse([xs[j] - 7, ys[j] - 7, xs[j] + 7, ys[j] + 7], fill=(AM if i == 0 else TE) + (220,))
        put(img, L, 1.0)
        text(img, (x, 250), f"{nm}　{area}", 44, anchor="mm", alpha=a)
        text(img, (x, 800), dens, 44, anchor="mm", alpha=a, fill=AM if i == 0 else TE)


def d_layers(kind):
    """Cross-sections: 'shield' = thin soil on bedrock, 'perma' = ground frozen all year under a thin active layer."""
    def fn(img, t, d):
        L, dr = layer()
        a = seg(t, 0.1, 0.7)
        y0 = 420
        if kind == "shield":
            dr.rectangle([0, y0, W, y0 + 40], fill=(120, 98, 72, 255))
            pts = [(0, y0 + 40)] + [(x, y0 + 40 + 18 * math.sin(x / 90)) for x in range(0, W + 1, 40)] + [(W, H), (0, H)]
            dr.polygon(pts, fill=(150, 150, 156, 255))
            for i in range(26):
                x = 80 + i * 72; dr.line([(x, y0 + 120 + (i % 3) * 40), (x + 60, y0 + 170 + (i % 3) * 40)], fill=(120, 120, 126, 255), width=4)
            for x in range(120, W, 260):
                dr.polygon([(x, y0), (x + 30, y0 - 120), (x + 60, y0)], fill=(70, 120, 80, 255))
            put(img, L, a)
            label(img, (1500, y0 + 20), "薄い土", seg(t, 0.6, 1.2), 44)
            label(img, (960, y0 + 300), "岩盤", seg(t, 1.0, 1.6), 64)
            title(img, "カナダ盾状地　陸地の約48%", t, y=170)
        else:
            dr.rectangle([0, y0, W, y0 + 60], fill=(120, 98, 72, 255))
            dr.rectangle([0, y0 + 60, W, H], fill=(178, 208, 226, 255))
            rng = np.random.default_rng(2)
            for x, y in zip(rng.uniform(0, W, 120), rng.uniform(y0 + 80, H, 120)):
                dr.line([(x - 10, y), (x + 10, y)], fill=(255, 255, 255, 200), width=3); dr.line([(x, y - 10), (x, y + 10)], fill=(255, 255, 255, 200), width=3)
            put(img, L, a)
            label(img, (960, y0 + 300), "一年中凍った地面（永久凍土）", seg(t, 0.6, 1.2), 56)
            title(img, "陸地の約半分の下", t, y=170)
    return fn


def d_lat(img, t, d):
    title(img, "ほぼ同じ緯度", t, y=170)
    a, b = seg(t, 0.3, 0.9), seg(t, 1.0, 1.6)
    L, dr = layer()
    dr.line([(200, 520), (200 + 1520 * seg(t, 0.2, 1.2), 520)], fill=AM + (255,), width=6)
    put(img, L, 1.0)
    for x, nm, lat, al in ((560, "トロント", "北緯 約43.7度", a), (1360, "札幌", "北緯 約43.1度", b)):
        L2, d2 = layer(); d2.ellipse([x - 18, 502, x + 18, 538], fill=AM + (int(255 * al),), outline=(255, 255, 255, int(255 * al)), width=4); put(img, L2, 1.0)
        text(img, (x, 420), nm, 64, anchor="mm", alpha=al)
        text(img, (x, 620), lat, 48, anchor="mm", alpha=al, fill=AM)


def d_yellow(img, t, d):
    """Toronto's 'Neighbourhoods' land: about 7 in 10 limited to detached / semi-detached houses."""
    title(img, "トロント市の住宅地", t, y=140)
    L, dr = layer()
    for i in range(10):
        a = seg(t, 0.3 + i * 0.12, 0.6 + i * 0.12)
        x = 360 + (i % 5) * 250; y = 240 + (i // 5) * 250
        col = (236, 196, 60) if i < 7 else (206, 208, 206)
        dr.rounded_rectangle([x, y, x + 220, y + 220], radius=16, fill=col + (int(255 * a),), outline=(150, 152, 156, int(255 * a)), width=3)
        if i < 7:
            B.house(dr, x + 60, x + 160, y + 190, 70, 50, wall=(250, 250, 246))
    put(img, L, 1.0)
    text(img, (W / 2, 790), "約7割：一戸建てか二戸建てまで", 54, anchor="mm", alpha=seg(t, 1.6, 2.2), fill=AM)


def d_lots(img, t, d):
    """2023: more homes on the same lot."""
    title(img, "同じ区画に、もっと多くの家を", t, y=150)
    items = [("トロント市", "2023年5月", "4戸まで", 4), ("バンクーバー市", "2023年9月", "3〜6戸", 6), ("BC州の法律", "2023年11月", "3〜6戸", 6)]
    for i, (nm, when, n, k) in enumerate(items):
        a = seg(t, 0.4 + i * 0.8, 1.0 + i * 0.8)
        x = W / 2 + (i - 1) * 560
        panel(img, (x - 250, 250, x + 250, 820), fill=(16, 28, 50), alpha=0.95 * a, outline=AM if i == 0 else TE)
        text(img, (x, 310), nm, 46, anchor="mm", alpha=a)
        text(img, (x, 370), when, 36, anchor="mm", alpha=a, fill=MU, weight="500Medium")
        L, dr = layer()
        cols = 2 if k <= 4 else 3
        for j in range(k):
            cx = x - (cols - 1) * 70 + (j % cols) * 140; cy = 560 + (j // cols) * 120
            if a > 0:
                dr.rectangle([cx - 50, cy - 40, cx + 50, cy + 40], fill=(236, 196, 160, int(255 * a)), outline=(150, 152, 156, int(255 * a)), width=3)
                dr.rectangle([cx - 15, cy - 10, cx + 15, cy + 20], fill=(60, 70, 90, int(255 * a)))
        put(img, L, 1.0)
        text(img, (x, 770), n, 56, anchor="mm", alpha=a, fill=AM if i == 0 else TE)


def d_measure(img, t, d):
    title(img, "1戸の着工あいだに増えた人口", t, y=170)
    rows = [("1972〜2024年の平均", 1.9), ("2023年", 5.1)]
    for i, (k, v) in enumerate(rows):
        a = seg(t, 0.4 + i * 1.2, 1.4 + i * 1.2)
        y = 400 + i * 220
        text(img, (W / 2, y - 70), k, 46, anchor="mm", alpha=min(1, a * 2))
        n = int(round(v * 10))
        L, dr = layer()
        for j in range(int(n * a)):
            x = W / 2 - 51 * 15 + j * 30
            dr.rounded_rectangle([x, y - 25, x + 22, y + 25], radius=8, fill=(AM if i else TE) + (255,))
        put(img, L, 1.0)
        text(img, (W / 2 + 51 * 15 + 40, y), f"{v}人", 52, anchor="lm", alpha=a, fill=AM if i else TE)


# ---------------------------------------------------------------- Codex images (gen/, first drafts audited on PR #13; no AI label on screen)
G_ZONE = {"gen": "CA-S06b_zoning_comparison_draft", "labels": [((0.25, 0.06), "一戸建てだけ", 0.4), ((0.75, 0.06), "集合住宅もある", 1.2)]}
G_BUILD = {"gen": "CA-S07_construction_stages_v2", "labels": [((0.17, 0.08), "更地", 0.4), ((0.5, 0.08), "工事", 1.0), ((0.83, 0.08), "完成", 1.6)]}
G_PIPE = {"gen": "CA-S09_infrastructure_draft", "labels": [((0.88, 0.55), "上水道", 0.6), ((0.88, 0.70), "下水道", 1.2)]}


def MAP(v, **k):
    return dict(v, **k)


# ---------------------------------------------------------------- the edit
def shots():
    S = []
    add = lambda sc, w, kind, **P: S.append((sc, w, kind, P))
    base_l = lambda: [L_lakes()]
    # 1 広い国の家不足
    add("S01", 5, "globe", lon=(10, -96), lat=(30, 56), r=(380, 560), cy=560, why="地球儀からカナダへ寄る")
    add("S01", 6, "map", **MAP(CAN, move=False), layers=base_l() + [L_can(0.0), L_japan(-100, 55, 0.4)], why="日本を同じ縮尺で重ねる（約26倍）")
    add("S01", 6, "diag", sent=3, fn=d_big("約2倍", "物価を差し引いた家の値段　2005→2025年"), why="実質価格が約2倍（CMHC 2026）")
    add("S01", 5, "card", sent=5, kicker="では", title="広いのに、なぜ家が足りない？", why="この動画の問い")
    # 2 よくある答え
    add("S02", 6, "diag", fn=d_three("よくある答え", [("寒い", "住める場所が\n少ない"), ("人が増えた", "急に増えた")]), why="よくある2つの答え")
    add("S02", 8, "diag", sent=4, fn=d_three("地図を3段で拡大", [("国", "どこに住めるか"), ("都市", "どこに集まるか"), ("土地", "どれだけ建てられるか")]), why="国→都市→土地の3段")
    # 3 国の大きさ
    add("S03", 7, "map", **MAP(CAN, move=False), layers=base_l() + [L_can(0.0, prov=True)], why="国全体")
    add("S03", 5, "diag", sent=2, fn=d_big("約3,700万人", "2021年の国勢調査"), why="人口")
    add("S03", 6, "diag", sent=3, fn=d_compare("1km²あたりの人", ("カナダ", "4.2人", "2021年"), ("日本", "約80倍", "カナダと比べて")), why="人口密度の比較")
    # 4 東京圏ほど
    add("S04", 10, "diag", fn=d_compare("人口はほぼ同じ", ("カナダ全体", "約3,699万人", "2021年"), ("東京圏", "約3,691万人", "東京・神奈川・埼玉・千葉\n2020年")), why="カナダ＝東京圏")
    add("S04", 4, "map", sent=2, **MAP(CAN, move=False), layers=base_l() + [L_can(0.0)], why="広い国土")
    # 5 北の大地
    add("S05", 9, "map", **MAP(CAN, move=False), layers=base_l() + [L_can(0.0, prov=True), L_terr(0.4)], why="3準州で陸地の4割近く")
    add("S05", 6, "diag", sent=2, fn=d_big("約11万8千人", "3つの準州の人口　全国の0.3%"), why="準州の人口")
    # 6 凍った地面
    add("S06", 10, "diag", fn=d_layers("perma"), why="永久凍土（断面の図）")
    # 7 岩の大地
    add("S07", 10, "diag", fn=d_layers("shield"), why="盾状地（断面の図）")
    # 8 畑
    add("S08", 5, "diag", fn=d_big("約7%", "農場の面積　陸地に対して"), why="農場は陸地の約7%")
    add("S08", 5, "diag", sent=2, fn=d_big("0.5%未満", "いちばん良い第1等級の農地　国土に対して"), why="最良の農地")
    add("S08", 5, "map", sent=3, **MAP(EAST, move=False), layers=base_l() + [L_can(0.0, prov=True), dots(["トロント", "ハミルトン"], 0.4)], why="その半分以上がオンタリオ州南部")
    # 9 街が農地に
    add("S09", 8, "diag", fn=d_big("7%超", "第1等級の農地の上の町や都市　2001年"), why="2001年、7%超")
    add("S09", 6, "map", sent=2, **MAP(EAST, move=False), layers=base_l() + [L_can(0.0), dots(["トロント", "ハミルトン", "オタワ", "モントリオール"], 0.3)], why="良い農地と都市が重なる南部")
    # 10 南の帯
    add("S10", 6, "diag", fn=d_people(3, 2, "3人に2人", "南の国境から100km以内（2021年）"), why="3人に2人")
    add("S10", 10, "map", sent=1, **MAP(CAN, move=False), layers=base_l() + [L_can(0.0), L_band(0.4)], why="南の国境から100kmの帯（アラスカ国境は除く）")
    # 11 札幌と同じ緯度
    add("S11", 5, "map", **MAP(SOUTH, move=False), layers=base_l() + [L_can(0.0), dots(["トロント"], 0.3)], why="トロント")
    add("S11", 8, "diag", sent=1, fn=d_lat, why="トロントと札幌の緯度")
    # 12 地理の役目
    add("S12", 8, "map", **MAP(CAN, move=False), layers=base_l() + [L_can(0.0), L_band(0.0)], why="住める場所は南の帯")
    add("S12", 8, "map", sent=3, lon=(-96, -79.4), lat=(58, 43.8), kmpp=(4.6, 0.6), layers=base_l() + [dots(["トロント", "モントリオール", "バンクーバー"], 0.3)], why="家が足りないのは南の都市の中")
    # 13 川が決めた町
    add("S13", 4, "card", kicker="歴史", title="なぜ、あの場所に都市が？", why="章の扉")
    add("S13", 9, "map", sent=2, **MAP(EAST, move=False), layers=base_l() + [L_can(0.0), L_years([("ケベック", "1608年")], 0.3)], why="1608年 ケベック")
    # 14 細長い区画
    add("S14", 10, "diag", fn=d_longlots, why="川に面した細長い区画（模式図）")
    # 15 船が止まる場所
    add("S15", 12, "map", **MAP(EAST, move=False), layers=base_l() + [L_can(0.0), L_years([("ケベック", "1608年"), ("モントリオール", "1642年")], 0.2)], why="1642年 モントリオール")
    # 16 島
    add("S16", 10, "map", lon=-73.7, lat=45.52, kmpp=0.06, move=False, layers=base_l() + [L_text(-73.68, 45.53, "モントリオール島", 0.4, 52)], why="川に囲まれた島")
    # 17 砂州の港
    add("S17", 6, "map", **MAP(EAST, move=False), layers=base_l() + [L_can(0.0), L_years([("ケベック", "1608年"), ("モントリオール", "1642年"), ("トロント", "1793年")], 0.0, 0.2)], why="1793年 ヨーク（トロント）")
    add("S17", 7, "diag", sent=2, fn=d_harbor, why="砂州に守られた港（模式図）")
    # 18 鉄道の約束
    add("S18", 7, "map", **MAP(SOUTH, move=False), layers=base_l() + [L_can(0.0, prov=True), L_prov(["BC"], 0.3)], why="1871年 BC州が加わる")
    add("S18", 7, "map", sent=1, **MAP(SOUTH, move=False), layers=base_l() + [L_can(0.0), L_line(CPR, 0.2, 4.0), dots(["モントリオール", "バンクーバー"], 0.2)], why="大陸横断鉄道（主な町を結んだ概略の線）")
    # 19 南を通る線路
    add("S19", 6, "map", **MAP(SOUTH, move=False), layers=base_l() + [L_can(0.0), L_line(CPR, 0.0, 0.1), L_band(0.3)], why="線路は南寄り")
    add("S19", 8, "map", sent=1, lon=-117.5, lat=51.0, kmpp=1.2, move=False, layers=base_l() + [L_line(CPR[6:], 0.0, 1.5), dots(["キッキング・ホース峠"], 0.6)], why="キッキング・ホース峠")
    # 20 平原への入植
    add("S20", 6, "map", lon=-102, lat=51.5, kmpp=1.6, move=False, layers=base_l() + [L_can(0.0, prov=True), L_prov(["MB", "SK", "AB"], 0.3, TE)], why="大平原（プレーリー）")
    add("S20", 8, "diag", sent=1, fn=d_compare("1872年の法律", ("手数料", "10ドル", ""), ("もらえる土地", "160エーカー", "約65ヘクタール")), why="10ドルで160エーカー")
    # 21 鉄道の町
    add("S21", 8, "map", lon=-113.5, lat=51.3, kmpp=1.2, move=False, layers=base_l() + [L_can(0.0), L_years([("カルガリー", "1875年 砦")], 0.3)], why="カルガリー（ボウ川とエルボー川の合流点の砦）")
    add("S21", 8, "map", sent=2, **MAP(SOUTH, move=False), layers=base_l() + [L_can(0.0), L_years([("カルガリー", "1883年 鉄道"), ("バンクーバー", "1886年 市")], 0.2)], why="鉄道の町")
    # 22 並ぶ都市
    add("S22", 12, "map", **MAP(SOUTH, move=False), layers=base_l() + [L_can(0.0), L_band(0.0), dots(["ケベック", "モントリオール", "トロント", "カルガリー", "バンクーバー"], 0.3, 0.4)], why="南の帯に並ぶ大都市")
    # 23 四人に三人
    add("S23", 10, "diag", fn=d_people(4, 3, "73.7%　ほぼ4人に3人", "41の大都市圏に住む（2021年）"), why="4人に3人")
    # 24 農村
    add("S24", 10, "diag", fn=d_big("17.8%", "農村部に住む人　2021年　9回続けて減少"), why="農村17.8%")
    # 25 三つの大都市圏
    add("S25", 10, "diag", fn=d_bars("大都市圏の人口（2021年）", [("トロント", 620), ("モントリオール", 429), ("バンクーバー", 264)], "万人"), why="3大都市圏")
    add("S25", 4, "diag", sent=4, fn=d_people(3, 1, "約3人に1人", "この3つの大都市圏に住む"), why="3人に1人")
    # 26 二つの州
    add("S26", 8, "map", **MAP(CAN, move=False), layers=base_l() + [L_can(0.0, prov=True), L_prov(["ON", "QC"], 0.3)], why="オンタリオ州とケベック州で約6割")
    # 27 遠い郊外
    add("S27", 12, "map", **MAP(GTA, move=False), layers=base_l() + [dots(["トロント"], 0.3)], why="トロント大都市圏")
    add("S27", 4, "diag", sent=2, fn=d_big("30分以上", "車で中心から　遠い郊外が伸びた（2016〜2021年）"), why="遠い郊外")
    # 28 トロントと23区
    add("S28", 5, "map", **MAP(TORV, move=False), layers=base_l() + [L_text(-79.38, 43.70, "トロント市", 0.3, 56)], why="トロント市")
    add("S28", 12, "diag", sent=1, fn=d_density, why="トロント市と東京23区（同じ広さ・密度の差）")
    # 29 バンクーバーの密度
    add("S29", 6, "map", **MAP(VANV, move=False), layers=base_l() + [dots(["バンクーバー"], 0.3, size=52)], why="バンクーバー市")
    add("S29", 8, "diag", sent=2, fn=d_compare("1km²あたりの人", ("バンクーバー市", "約5,750人", "2021年"), ("東京23区", "約1万5,500人", "2020年")), why="密度の比較")
    # 30 人が増えた
    add("S30", 4, "card", kicker="なぜ今？", title="人が増えた", why="章の扉")
    add("S30", 10, "diag", sent=2, fn=d_big("約127万人", "2023年の1年間の人口の増加　1957年以来の伸び"), why="2023年の人口増")
    # 31 増え方の変化
    add("S31", 14, "diag", fn=d_timeline("人口の増え方", [("2023年", "約127万人増"), ("2024年", "約74万人増"), ("2024年10月", "永住者の受け入れ\n目標を引き下げ"), ("2025年7〜9月", "人口が減少")]), why="増え方の変化（数字の事実のみ）")
    # 32 世帯
    add("S32", 7, "diag", fn=d_big("2.4人", "1世帯あたりの人数（2021年）　過去最低"), why="平均世帯人員")
    add("S32", 7, "diag", sent=3, fn=d_big("29.3%", "一人暮らしの世帯　いちばん多い形"), why="単身世帯")
    # 33 建てる量の歴史
    add("S33", 16, "diag", fn=d_bars("1年に建て始めた家（全地域）", [("1976年", 273203), ("2021年", 271198), ("2023年", 240267), ("2025年", 259028)], "戸"), why="着工の推移（CMHC 全地域の系列）")
    # 34 70年代
    add("S34", 12, "diag", fn=d_compare("1972〜1979年の年平均", ("建ち始めた家", "約24万戸", ""), ("増えた人口", "約28万人", "")), why="70年代の比較")
    # 35 一戸あたり
    add("S35", 14, "diag", fn=d_measure, why="1戸あたりの人口増（研究所の計算）")
    # 36 G7
    add("S36", 10, "diag", fn=d_big("424戸", "人口1,000人あたりの家（2020年）　G7で最少"), why="G7で最少（銀行の計算）")
    # 37 必要な量
    add("S37", 4, "card", kicker="どれだけ", title="足りないのか", why="章の扉")
    add("S37", 14, "diag", sent=1, fn=d_bars("1年に建てる家（2036年まで）", [("必要な量（下限）", 41.7), ("必要な量（上限）", 46.9), ("今の見込み", 23.1)], "万戸"), why="必要量と見込み（CMHC 2026年秋）")
    add("S37", 4, "diag", sent=3, fn=d_big("約半分", "今の見込みは、必要な量の"), why="約半分")
    # 38 値段の理由
    add("S38", 14, "diag", fn=d_three("家を求める人が増えた理由", [("人口", "の伸び"), ("所得", "の伸び"), ("低い金利", "")]), why="需要が増えた理由（CMHC）")
    add("S38", 6, "diag", sent=2, fn=d_compare("2010年代の後半から", ("求める量", "増えた", ""), ("建つ量", "ほぼ一定", "")), why="供給の伸びはほぼ一定")
    # 39 何が起きるか
    add("S39", 10, "diag", fn=d_big("1.5%", "賃貸住宅の空き室（2023年）　1988年以来の最低"), why="空室率")
    add("S39", 8, "diag", sent=3, fn=d_big("所得の半分超", "家を持つ費用（2023年末）　記録の上で最も重い"), why="住宅費の負担")
    # 40 バンクーバーの地形
    add("S40", 4, "card", kicker="都市", title="地図をもう一段", why="章の扉")
    add("S40", 14, "map", sent=2, **MAP(VANV, move=False), layers=base_l() + [dots(["バンクーバー"], 0.3, size=48), L_text(-123.02, 49.305, "バラード入江", 0.8, 44, TE),
                                                                               L_text(-123.05, 49.37, "ノースショアの山々", 1.3, 44, MU), L_text(-123.08, 49.14, "フレーザー川の三角州", 1.8, 44, TE),
                                                                               L_text(-123.33, 49.22, "ジョージア海峡", 2.3, 44, TE)], why="半島と入江・山・三角州")
    # 41 山と海と国境
    add("S41", 14, "map", lon=-122.6, lat=49.2, kmpp=0.2, move=False, layers=base_l() + [L_can(0.0), L_text(-122.6, 49.03, "アメリカとの国境", 0.4, 40, AM), L_text(-122.3, 49.5, "山", 0.8, 48, MU), L_text(-123.4, 49.25, "海", 1.2, 48, TE), dots(["バンクーバー"], 0.2)], why="山・海・国境に挟まれる")
    # 42 農地保全区域
    add("S42", 7, "map", lon=-125, lat=54, kmpp=1.6, move=False, layers=base_l() + [L_can(0.0, prov=True), L_prov(["BC"], 0.3, TE)], why="ブリティッシュ・コロンビア州")
    add("S42", 8, "diag", sent=1, fn=d_big("約460万ha", "農地保全区域（1973年〜）　州の土地の約5%"), why="ALR")
    # 43 グリーンベルト
    add("S43", 6, "map", lon=-79.1, lat=43.75, kmpp=0.32, move=False, layers=base_l() + [dots(["トロント", "ハミルトン"], 0.3, 0.3, size=46)], why="トロントとハミルトン")
    add("S43", 6, "map", sent=2, lon=-79.1, lat=43.75, kmpp=0.32, move=False, layers=base_l() + [dots(["トロント", "ハミルトン"], 0.0, 0.0, size=46), dots(["ライス湖", "ナイアガラ川"], 0.3, 0.5, color=TE, size=46)], why="グリーンベルトの東端（ライス湖の近く）と西端（ナイアガラ川）。範囲図は描かない")
    add("S43", 6, "diag", fn=d_big("約325km", "グリーンベルトの長さ　ライス湖の近くからナイアガラ川まで"), why="長さ（直線距離ではない）")
    add("S43", 6, "map", sent=3, lon=-79.1, lat=43.75, kmpp=0.32, move=False, layers=base_l() + [dots(["トロント", "ハミルトン"], 0.0, 0.0, size=46)], why="街を外側から囲む")
    # 44 外して戻した
    add("S44", 16, "diag", fn=d_timeline("グリーンベルト", [("2005年", "指定"), ("2022年末", "一部を外す"), ("2023年9月", "撤回"), ("2023年12月", "戻す法律")]), why="2022年に外し2023年に戻した")
    # 45 地理だけでは
    add("S45", 6, "card", kicker="でも", title="地理だけで説明できる？", why="章の扉")
    add("S45", 8, "diag", sent=3, fn=d_big("約10%", "供給がアメリカ並みに応えていたら　家の値段はこれだけ低かった"), why="CMHC 2026 の分析")
    add("S45", 8, "diag", sent=4, fn=d_three("原因", [("地理", ""), ("用途地域の規制", ""), ("人口の構成", "")]), why="3つの原因")
    # 46 黄色い住宅地
    add("S46", 4, "card", kicker="土地", title="一つひとつの区画へ", why="章の扉")
    add("S46", 12, "diag", sent=1, fn=d_yellow, why="住宅地の約7割は一戸建て・二戸建てまで（模式図）")
    add("S46", 6, "diag", sent=3, fn=lambda img, t, d: None, slot=G_ZONE, why="集合住宅には区域の変更が要る（生成画像）")
    # 47 州の法律
    add("S47", 10, "diag", fn=d_year("2022年11月", "オンタリオ州の法律", "1つの区画に3戸まで"), why="Bill 23")
    add("S47", 6, "diag", sent=2, fn=d_big("150万戸", "オンタリオ州の目標（2031年まで）"), why="州の目標")
    # 48 規制が厳しい街ほど
    add("S48", 16, "diag", fn=d_three("規制と家の値段", [("1", "規制が厳しい都市ほど\n家が手ごろでない"), ("2", "家が増えるペースが\n遅くなる"), ("3", "建て増しの声が強い所ほど\n変更が認められにくい")]), why="CMHC の研究の3点")
    # 49 待つ時間
    add("S49", 8, "diag", fn=lambda img, t, d: None, slot=G_BUILD, why="承認から完成まで（生成画像）")
    add("S49", 8, "diag", sent=2, fn=d_big("約4倍", "トロントとバンクーバーの承認期間　手ごろな地域と比べて"), why="承認期間の差")
    # 50 32か月
    add("S50", 14, "diag", fn=d_bars("開発の承認にかかる期間", [("トロント 2020年", 21), ("トロント 2022年", 32), ("最も短い街", 3)], "か月"), why="業界団体の調査")
    # 51 水道と人手
    add("S51", 9, "diag", fn=lambda img, t, d: None, slot=G_PIPE, why="道路の下の上下水道（生成画像）")
    add("S51", 7, "diag", sent=2, fn=d_big("約6,000億ドル", "必要な家を支える自治体の設備（最大）"), why="FCM 2023")
    add("S51", 7, "diag", sent=4, fn=d_big("約27万人", "これからの10年で引退する建設の働き手"), why="BuildForce")
    # 52 負担金
    add("S52", 14, "diag", fn=d_big("約18万ドル", "トロント市の一戸建て1戸あたりの開発負担金（2025年）"), why="開発負担金（CMHC 2025の集計）")
    # 53 設備への資金
    add("S53", 12, "diag", fn=d_big("60億ドル", "住宅のための水道・下水の基金（10年）"), why="CHIF")
    # 54 区域を変える
    add("S54", 4, "card", kicker="変わり始めた", title="カナダの動き", why="章の扉")
    add("S54", 16, "diag", sent=1, fn=d_lots, why="2023年の規則の変更")
    # 55 国の後押し
    add("S55", 16, "diag", fn=d_timeline("国の動き", [("2023年3月", "40億ドルの制度"), ("2024年4月", "2031年までに\n387万戸"), ("2025年9月", "新しい国の機関")]), why="連邦の施策")
    # 56 トロントへの資金
    add("S56", 12, "diag", fn=d_compare("トロント市（2023年12月）", ("受け取った資金", "4億7,100万ドル", "当時で最大"), ("上乗せの計画", "約1万1,800戸", "")), why="HAF トロント")
    # 57 変わり始めた数字
    add("S57", 7, "diag", fn=d_big("約25万9千戸", "2025年に建て始めた家　記録の上で5番目"), why="2025年の着工")
    add("S57", 7, "diag", sent=2, fn=d_bars("賃貸の空き室の割合", [("2023年", 1.5), ("2024年", 2.2), ("2025年", 3.1)], "%"), why="空室率の回復")
    add("S57", 5, "diag", sent=3, fn=d_big("約2割下落", "家の値段の指数　2022年3月の頂点から"), why="CREA HPI")
    # 58 賃貸が増える
    add("S58", 14, "diag", fn=d_compare("建ち始める家のうち賃貸住宅", ("10年前", "2割未満", ""), ("今", "約6割", "")), why="賃貸の比率")
    add("S58", 5, "diag", sent=2, fn=d_big("4.1%増", "賃貸専用の住宅（2024年）　30年あまりで最大"), why="賃貸ストック")
    # 59 東京
    add("S59", 6, "globe", lon=(-96, 139.7), lat=(50, 36), r=(560, 560), cy=560, why="日本へ")
    add("S59", 6, "diag", sent=1, fn=d_big("13種類", "日本の用途地域　法律で全国共通"), why="日本の用途地域")
    add("S59", 10, "diag", sent=3, fn=d_bars("2023年に建ち始めた家", [("東京都", 128330), ("カナダ全国", 240267)], "戸"), why="東京都とカナダの比較")
    # 60 オークランドとミネアポリス
    add("S60", 6, "globe", lon=(139.7, 174.8), lat=(36, -36.9), r=(560, 560), cy=560, why="ニュージーランドのオークランドへ")
    add("S60", 6, "diag", sent=1, fn=d_big("約5割増", "許可された家　計画がない場合と比べて（2016〜2021年）"), why="オークランドの研究")
    add("S60", 12, "diag", sent=2, fn=d_compare("2017〜2022年", ("ミネアポリス", "家 +12%", "家賃 +1%"), ("州のほかの地域", "家 +4%", "家賃 +14%")), why="ミネアポリス（Pew）")
    # 61 万能ではない
    add("S61", 8, "diag", fn=d_big("約87%", "ミネアポリスで増えた家のうち20戸以上の建物"), why="増えたのは大きな建物")
    add("S61", 8, "diag", sent=3, fn=d_three("答えは一つではない", [("土地", ""), ("規則", ""), ("設備と人手", "")]), why="いくつもの手")
    # 62 答え
    add("S62", 6, "map", **MAP(CAN, move=False), layers=base_l() + [L_can(0.0), L_band(0.0)], why="南の細い帯")
    add("S62", 6, "map", sent=3, lon=(-96, -79.3), lat=(58, 43.85), kmpp=(4.6, 0.45), layers=base_l() + [dots(["トロント"], 0.3)], why="都市へ")
    add("S62", 6, "diag", sent=4, fn=d_yellow, why="一つの土地へ")
    add("S62", 8, "card", sent=5, title="土地がない国ではない", sub="人が集まる場所で、家を建てる量が足りない国", why="結論")
    # 63 締め
    add("S63", 8, "diag", fn=d_big("年40万戸超", "今ある人手と資源で建てられる力（CMHCの計算）"), why="潜在能力")
    add("S63", 6, "globe", sent=1, lon=(-96, -60), lat=(56, 30), r=(560, 380), cy=560, why="地球へ引く")
    add("S63", 10, "card", sent=2, title="地球の事情", sub="地理・歴史・経済で、世界を読み解く", foot="音声：VOICEVOX:雀松朱司", why="締め")
    return S


def d_harbor(img, t, d):
    """Schematic: a lake shore with a sandbar enclosing a harbour that has one entrance (today's Toronto Islands)."""
    L, dr = layer()
    a = seg(t, 0.1, 0.7)
    dr.rectangle([0, 0, W, 360], fill=(196, 214, 170, 255))
    dr.rectangle([0, 360, W, H], fill=M.LAKE + (255,))
    k = seg(t, 0.5, 1.6)
    if k > 0:
        x1 = 300 + 1300 * k
        dr.rounded_rectangle([300, 600, x1, 650], radius=25, fill=(226, 208, 160, 255))
        if k > 0.95:
            dr.rounded_rectangle([1560, 380, 1620, 650], radius=25, fill=(226, 208, 160, 255))
    put(img, L, a)
    label(img, (960, 200), "トロント（ヨーク）", seg(t, 0.2, 0.8), 52)
    label(img, (800, 700), "砂州（いまのトロント諸島）", seg(t, 1.4, 2.0), 44)
    label(img, (800, 480), "守られた港", seg(t, 1.8, 2.4), 48)
    label(img, (200, 480), "入口", seg(t, 2.4, 3.0), 44)
    label(img, (960, 800), "オンタリオ湖", seg(t, 0.4, 1.0), 44)


def d_longlots(img, t, d):
    """Schematic: a river with long narrow lots running back from the bank."""
    L, dr = layer()
    a = seg(t, 0.1, 0.7)
    dr.rectangle([0, 600, W, 720], fill=M.LAKE + (255,))
    for i in range(14):
        x = 60 + i * 130
        k = seg(t, 0.4 + i * 0.08, 0.8 + i * 0.08)
        if k < 0.02:
            continue
        dr.rectangle([x, 600 - 440 * k, x + 120, 596], fill=((214, 222, 190) if i % 2 else (196, 214, 170)) + (255,), outline=(150, 152, 156, 255), width=2)
        if k > 0.9:
            B.house(dr, x + 30, x + 90, 590, 34, 26, wall=(250, 250, 246))
    put(img, L, a)
    label(img, (W / 2, 660), "川", seg(t, 0.3, 0.9), 52)
    label(img, (W / 2, 110), "川に面した細長い区画", seg(t, 1.2, 1.8), 54)


R.HEAD = {}
R.shots = shots


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--still", type=float, nargs="*")
    ap.add_argument("--chunks")
    ap.add_argument("--mux", action="store_true")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--shotlist", action="store_true")
    a = ap.parse_args()
    if a.list:
        for s in R.timeline():
            print(f"{s['start']:7.2f}–{s['end']:7.2f} {s['end'] - s['start']:5.1f} {s['scene']} {s['kind']:6s} {s['P'].get('why', '')}")
        return
    if a.shotlist:
        (EP / "shotlist.md").write_text("# カット表（render/render.py から自動生成）\n\n見た目はバミューダ v4（丸ゴシック字幕・明るい背景）。画面の注釈は出さない（社長 2026-11-12）。地図は地形の陰影図と Natural Earth（衛星画像ではない）。鉄道の線は主な町を結んだ概略。生成画像は Codex の素材（gen/）で、画面に AI 表示は出さない。\n\n" + R.shotlist_md())
        return
    if a.still:
        for t in a.still:
            Image.fromarray(V4.frame(t)).save(OUT / f"still_{t:07.2f}.jpg", quality=88)
        return
    n = int(math.ceil(R.TOTAL / 10.0))
    if a.chunks:
        i, m = map(int, a.chunks.split("/"))
        for c in range(i - 1, n, m):
            dst = OUT / f"c3_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"c3_{c:03d}.tmp.mp4"
            V4.render(c * 10.0, min(R.TOTAL, (c + 1) * 10.0), tmp)
            tmp.rename(dst)
        return
    if a.mux:
        parts = sorted(OUT.glob("c3_[0-9][0-9][0-9].mp4"))
        assert len(parts) == n, len(parts)
        (OUT / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts.txt"),
                        "-i", str(OUT / "mix.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-15:TP=-1.5:LRA=11",
                        "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT / "chizu-003-canada-housing_full.mp4")], check=True)


if __name__ == "__main__":
    main()
