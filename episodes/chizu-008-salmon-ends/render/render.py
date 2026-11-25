"""chizu-008-salmon-ends (long, ~17 min; 社長 2026-11-25「動画を制作して」, 尺15〜30分 2026-11-24).
Look = Bermuda v4 / Canada (rounded-gothic subtitles, light background). Reuses chizu-005 render_v4 (and through it
render_v3 / render.py / chizu-001 render_v23) for drawing, timeline and subtitles; helpers copied from chizu-003 render.py.
Base maps and the globe: Natural Earth 1:10m land (public domain), drawn flat in light colours. The shaded-relief image
(shadedrelief.jpg) used by Canada/Bermuda is NOT used here (its terms are unconfirmed, 2026-11-21).
No corner notes, headings or credits on screen (社長 2026-11-12). Sources and credits go to the description.
Store names (コストコ・ロピア) are on-screen text only, no logos; no origin is tied to them (G06).
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

AM, TE, INK, MU, RE = NEW["AMBER"], NEW["TEAL"], NEW["INK"], NEW["MUTED"], NEW["RED"]
seg, ease, label, layer, put = B.seg, B.ease, B.label, B.layer, B.put
OUT = HERE / "out"; OUT.mkdir(exist_ok=True)

# ---------------------------------------------------------------- Natural Earth base (light, same colours as vector_map)
SEA, LAND, EDGE = (126, 170, 206), (178, 196, 170), (150, 165, 140)


def ne_texture(w=8192):
    p = HERE / "cache" / f"ne_light_{w}.png"
    p.parent.mkdir(exist_ok=True)
    if p.exists():
        return np.array(Image.open(p).convert("RGB"))
    h = w // 2
    im = Image.new("RGB", (w, h), SEA); d = ImageDraw.Draw(im)
    for _, _, polys in geo.land10():
        for poly in polys:
            for k, ring in enumerate(poly):
                pts = [((lon + 180) / 360 * w, (90 - lat) / 180 * h) for lon, lat in ring]
                if len(pts) > 2:
                    d.polygon(pts, fill=SEA if k else LAND, outline=None if k else EDGE)
    im.save(p)
    return np.array(im)


base._TEX = ne_texture()
_VM = {}


def flat_vector(W_, H_, lon0, lat0, kmpp, dx=0, dy=0):
    """All flat maps from the Natural Earth 1:10m coastline (sharp at every zoom); cached per view (maps here don't move)."""
    k = (round(lon0, 4), round(lat0, 4), round(kmpp, 4))
    if k not in _VM:
        _VM[k] = vmap(lon0, lat0, kmpp)
    return _VM[k]


def vmap(lon0, lat0, kmpp, ss=2):
    """Natural Earth 1:10m land with holes; rings far from the view centre (e.g. Antarctica wrapping around in the
    azimuthal projection) are skipped."""
    im = Image.new("RGB", (W * ss, H * ss), SEA); d = ImageDraw.Draw(im)
    la0, lo0 = math.radians(lat0), math.radians(lon0)
    for _, _, polys in geo.land10():
        for poly in polys:
            for k_, ring in enumerate(poly):
                la, lo = np.radians(ring[:, 1]), np.radians(ring[:, 0])
                cosc = np.sin(la0) * np.sin(la) + np.cos(la0) * np.cos(la) * np.cos(lo - lo0)
                if ring[:, 1].mean() < -60 or cosc.min() < -0.9:   # Antarctica / rings reaching the far side: skip
                    continue
                x, y = geo.laea(ring[:, 0], ring[:, 1], lon0, lat0)
                X, Y = (W / 2 + x / kmpp) * ss, (H / 2 - y / kmpp) * ss
                if X.max() < -50 or X.min() > W * ss + 50 or Y.max() < -50 or Y.min() > H * ss + 50:
                    continue
                d.polygon(list(zip(X, Y)), fill=SEA if k_ else LAND, outline=EDGE)
    return np.array(im.resize((W, H), Image.LANCZOS))


R.vector_map = lambda lon0, lat0, kmpp, ss=2: Image.fromarray(vmap(lon0, lat0, kmpp, ss)).convert("RGBA")


base.flatmap = flat_vector
base.TEX_LABEL = "naturalearth_10m_land"

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
    "東京": (139.69, 35.69), "函館": (140.73, 41.77), "北海道": (142.8, 43.4), "南三陸町": (141.45, 38.68),
    "プエルト・モン": (-72.94, -41.47), "コジャイケ": (-72.07, -45.57), "プエルト・ナターレス": (-72.51, -51.73),
    "ヒトラ島": (8.85, 63.55), "トロンハイム": (10.40, 63.43), "オスロ": (10.75, 59.91),
})
B.SIDE.clear()
B.SIDE.update({"東京": "r", "函館": "r", "北海道": "r", "南三陸町": "r", "プエルト・モン": "r", "コジャイケ": "r",
               "プエルト・ナターレス": "r", "ヒトラ島": "l", "トロンハイム": "r", "オスロ": "r"})

CHILE = dict(lon=-71.0, lat=-46.5, kmpp=1.5)
PATA = dict(lon=-74.5, lat=-49.0, kmpp=1.15)
NORWAY = dict(lon=12.0, lat=64.0, kmpp=1.4)
JAPAN = dict(lon=139.5, lat=39.5, kmpp=1.6)
HOKKAIDO = dict(lon=142.6, lat=43.4, kmpp=0.75)
MIYAGI = dict(lon=141.42, lat=38.66, kmpp=0.05)
TURKEY = dict(lon=32.0, lat=40.0, kmpp=1.9)
KMPP = lambda: R._KMPP[0]


# ---------------------------------------------------------------- map layers (this episode)
def L_country(name, t0=0.3, color=None, alpha=0.45):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.0)
        if a <= 0:
            return
        L = Image.new("RGBA", img.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(L)
        c = color or AM
        for poly in R.country(name):
            r = poly[0]
            x, y = p(r[:, 0], r[:, 1])
            if np.max(x) < -200 or np.min(x) > W + 200 or np.max(y) < -200 or np.min(y) > H + 200:
                continue
            dr.polygon(list(zip(x, y)), fill=c + (int(255 * alpha * a),), outline=c + (int(255 * a),))
        img.alpha_composite(L)
    return fn


d_big, title = V3.d_big, V3.title
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


def MAP(v, **k):
    return dict(v, **k)


# ---------------------------------------------------------------- diagrams (this episode)
def fish(dr, cx, cy, s, col, a=1.0):
    """A simple salmon silhouette (body + tail), s = length in px."""
    c = col + (int(255 * a),)
    dr.ellipse([cx - s * 0.42, cy - s * 0.16, cx + s * 0.36, cy + s * 0.16], fill=c)
    dr.polygon([(cx - s * 0.36, cy), (cx - s * 0.56, cy - s * 0.16), (cx - s * 0.56, cy + s * 0.16)], fill=c)
    dr.ellipse([cx + s * 0.22, cy - s * 0.05, cx + s * 0.27, cy], fill=(255, 255, 255, int(255 * a)))


SALMON = (236, 120, 84)


def d_shops(img, t, d):
    """S01: familiar places where salmon is bought or eaten (names as text only, no logos)."""
    items = ["コストコ", "ロピア", "回転寿司"]
    for i, nm in enumerate(items):
        a = seg(t, 0.2 + i * 0.5, 0.8 + i * 0.5)
        x = W / 2 + (i - 1) * 520
        panel(img, (x - 220, 300, x + 220, 700), fill=(16, 28, 50), alpha=0.95 * a, outline=AM)
        L, dr = layer()
        if a > 0:
            dr.rounded_rectangle([x - 150, 380, x + 150, 520], radius=20, fill=SALMON + (int(255 * a),))
            for j in range(5):
                xx = x - 120 + j * 60
                dr.line([(xx, 390), (xx + 40, 510)], fill=(255, 238, 228, int(230 * a)), width=8)
        put(img, L, 1.0)
        text(img, (x, 620), nm, 60, anchor="mm", alpha=a)
    text(img, (W / 2, 180), "どこの海で育った？", 64, anchor="mm", alpha=seg(t, 1.6, 2.2), fill=AM)


ORIGIN = [("くら寿司", "サーモン：チリなど／とろサーモン：ノルウェーなど", "2026年11月20日現在"),
          ("はま寿司", "ノルウェー・チリ・フェロー諸島・イギリス・デンマーク", "2026年10月1日更新"),
          ("かっぱ寿司", "チリ・ノルウェー・デンマーク・イギリス・トルコ・日本", "2026年9月30日"),
          ("スシロー", "サーモン：トルコ・チリ／生サーモン：チリ・ノルウェー", "2026年9月の表")]


def d_origin(reveal):
    """S02/S03: the chains' published origin tables, typed out (not images of the tables). Chile is hidden until S03."""
    def fn(img, t, d):
        title(img, "回転寿司チェーンの産地表（サーモン）", t, y=130)
        for i, (nm, s, when) in enumerate(ORIGIN):
            a = 1.0 if reveal else seg(t, 0.2 + i * 0.25, 0.7 + i * 0.25)
            y = 260 + i * 170
            panel(img, (140, y - 10, W - 140, y + 140), fill=(16, 28, 50), alpha=0.95 * a, outline=TE)
            text(img, (190, y + 45), nm, 48, anchor="lm", alpha=a)
            text(img, (190, y + 105), when, 28, anchor="lm", alpha=a, fill=MU, weight="500Medium")
            x = 520
            for k, part in enumerate(s.replace("／", "／|").split("|")):
                for w in part.split("・"):
                    w2 = w
                    hide = "チリ" in w and not reveal
                    k_a = a if not reveal else a
                    if hide:
                        w2 = w.replace("チリ", "？？")
                    col = AM if ("ノルウェー" in w) else (RE if ("チリ" in w and reveal) else INK)
                    if reveal and "チリ" in w:
                        k_a = a * (0.6 + 0.4 * abs(math.sin(t * 3)))
                    text(img, (x, y + 65), w2 + ("・" if not w.endswith("／") and w != part.split("・")[-1] else ""), 40, anchor="lm",
                         alpha=k_a, fill=col)
                    x += draw.text_w(w2, 40) + (40 if w != part.split("・")[-1] else 10)
    return fn


def d_lat2(img, t, d):
    """S14: Puerto Montt (41.5°S) and Hakodate (41.8°N) at nearly the same latitude, folded onto one line."""
    title(img, "南北に折り返すと、ほぼ同じ緯度", t, y=170)
    a, b = seg(t, 0.3, 0.9), seg(t, 1.0, 1.6)
    L, dr = layer()
    dr.line([(200, 520), (200 + 1520 * seg(t, 0.2, 1.2), 520)], fill=AM + (255,), width=6)
    put(img, L, 1.0)
    for x, nm, lat, al in ((560, "プエルト・モン（チリ）", "南緯 約41.5度", a), (1360, "函館", "北緯 約41.8度", b)):
        L2, d2 = layer(); d2.ellipse([x - 18, 502, x + 18, 538], fill=AM + (int(255 * al),), outline=(255, 255, 255, int(255 * al)), width=4); put(img, L2, 1.0)
        text(img, (x, 420), nm, 56, anchor="mm", alpha=al)
        text(img, (x, 620), lat, 48, anchor="mm", alpha=al, fill=AM)


def d_counts(img, t, d):
    """S19: anisakis found in fish tested (Tokyo survey cited in the MAFF risk profile)."""
    title(img, "アニサキスが見つかった魚", t, y=150)
    items = [("天然の秋ザケ", 27, 27, RE), ("ノルウェーの養殖\nアトランティックサーモン", 8, 0, TE), ("チリの養殖\nギンザケ", 9, 0, TE)]
    for i, (nm, n, k, col) in enumerate(items):
        a = seg(t, 0.4 + i * 1.0, 1.0 + i * 1.0)
        x = W / 2 + (i - 1) * 560
        panel(img, (x - 250, 250, x + 250, 820), fill=(16, 28, 50), alpha=0.95 * a, outline=col)
        for j, ln in enumerate(nm.split("\n")):
            text(img, (x, 310 + j * 48), ln, 38, anchor="mm", alpha=a)
        L, dr = layer()
        cols = 6
        for j in range(n):
            if a <= 0:
                break
            cx = x - 2.5 * 70 + (j % cols) * 70; cy = 450 + (j // cols) * 56
            fish(dr, cx, cy, 58, (col if j < k else (190, 192, 190)), a)
        put(img, L, 1.0)
        text(img, (x, 770), f"{n}匹中 {k}匹", 56, anchor="mm", alpha=a, fill=col)


def d_pens(img, t, d):
    """S12: schematic of floating net pens in a calm fjord inlet."""
    L, dr = layer()
    a = seg(t, 0.1, 0.7)
    dr.polygon([(0, 0), (W, 0), (W, 300), (1400, 380), (500, 380), (0, 300)], fill=(120, 140, 110, 255))
    dr.rectangle([0, 380, W, H], fill=SEA + (255,))
    dr.polygon([(0, 300), (500, 380), (0, 380)], fill=(120, 140, 110, 255))
    dr.polygon([(W, 300), (1400, 380), (W, 380)], fill=(120, 140, 110, 255))
    put(img, L, a)
    L2, d2 = layer()
    for i in range(4):
        k = seg(t, 0.6 + i * 0.4, 1.0 + i * 0.4)
        if k <= 0:
            continue
        cx = 420 + i * 360; cy = 620
        d2.ellipse([cx - 140, cy - 50, cx + 140, cy + 50], outline=(250, 250, 246, int(255 * k)), width=10)
        d2.ellipse([cx - 120, cy - 30, cx + 120, cy + 30], fill=(80, 130, 170, int(255 * k)))
        for j in range(3):
            fish(d2, cx - 60 + j * 60, cy, 50, SALMON, k)
    put(img, L2, 1.0)
    label(img, (960, 470), "波の静かな入り江に浮かべた生簀", seg(t, 1.6, 2.2), 52)


def d_arrows(img, t, d):
    """S32/S33: two arrows in opposite directions (schematic, not a map)."""
    title(img, "逆向きの二本の矢印", t, y=140)
    pts = {"日本": (960, 300), "チリ": (520, 680), "ノルウェー": (1400, 680)}
    for i, (nm, (x, y)) in enumerate(pts.items()):
        a = seg(t, 0.2 + i * 0.3, 0.7 + i * 0.3)
        L, dr = layer()
        dr.ellipse([x - 26, y - 26, x + 26, y + 26], fill=AM + (int(255 * a),), outline=(255, 255, 255, int(255 * a)), width=5)
        put(img, L, 1.0)
        text(img, ((x + 50 if x > 960 else x - 50) if y > 500 else x, y if y > 500 else y - 70), nm, 56,
             anchor=("lm" if x > 960 else "rm") if y > 500 else "mm", alpha=a)
        continue
        text(img, (x, y), nm, 56, anchor="mm", alpha=a)
    k1 = seg(t, 1.2, 2.4); k2 = seg(t, 2.6, 3.8)
    if k1 > 0:
        R.arrow(img, (930, 340), (550, 640), color=RE, width=10, prog=k1, alpha=1)
        text(img, (650, 520), "魚（卵）", 52, anchor="mm", fill=RE, alpha=seg(t, 2.0, 2.4))
    if k2 > 0:
        R.arrow(img, (1370, 640), (990, 340), color=TE, width=10, prog=k2, alpha=1)
        text(img, (1300, 520), "食べ方", 52, anchor="mm", fill=TE, alpha=seg(t, 3.4, 3.8))


def d_line(head, pts, unit, hi=None):
    """Line chart: pts = [(label, value), ...]; hi = index of the jump to highlight."""
    def fn(img, t, d):
        title(img, head, t, y=150)
        x0, x1, y0, y1 = 260, 1660, 780, 300
        vmax = max(v for _, v in pts) * 1.1
        n = len(pts)
        k = seg(t, 0.3, 0.3 + 2.5)
        L, dr = layer()
        dr.line([(x0, y0), (x1, y0)], fill=(150, 152, 156, 255), width=4)
        xy = [(x0 + (x1 - x0) * i / (n - 1), y0 - (y0 - y1) * v / vmax) for i, (_, v) in enumerate(pts)]
        m = k * (n - 1)
        for i in range(n - 1):
            if m <= i:
                break
            f = min(1.0, m - i)
            (xa, ya), (xb, yb) = xy[i], xy[i + 1]
            col = RE if hi is not None and i + 1 == hi else AM
            dr.line([(xa, ya), (xa + (xb - xa) * f, ya + (yb - ya) * f)], fill=col + (255,), width=8)
        for i, (x, y) in enumerate(xy):
            if i <= m:
                dr.ellipse([x - 10, y - 10, x + 10, y + 10], fill=AM + (255,))
        put(img, L, 1.0)
        for i, ((lab, v), (x, y)) in enumerate(zip(pts, xy)):
            if i <= m:
                text(img, (x, y0 + 50), lab, 32, anchor="mm")
                if i in (0, n - 1) or i == hi:
                    text(img, (x, y - 50), f"{v:,}{unit}", 40, anchor="mm", fill=RE if i == hi else AM)
    return fn


def si(sc, sub):
    """Index of the first sentence of scene sc that contains sub (for sent=)."""
    for i, s in enumerate(R.SC[sc]["sentences"]):
        if sub in s["text"]:
            return i
    raise KeyError((sc, sub))


def MAPV(v, **k):
    return dict(v, move=False, **k)


# ---------------------------------------------------------------- the edit
def shots():
    S = []

    def add(sc, w, kind, at=None, **P):
        if at is not None:
            P["sent"] = si(sc, at)
        S.append((sc, w, kind, P))
    # 第1章
    add("S01", 6, "diag", fn=d_shops, why="身近な売り場と回転寿司（店名は文字だけ）")
    add("S02", 6, "diag", fn=d_origin(False), why="4社の産地表（チリを伏せる）")
    add("S03", 4, "diag", fn=d_origin(True), why="答えはチリ")
    add("S03", 6, "globe", at="地球儀を回します", lon=(140, 288), lat=(36, -38), r=(420, 520), cy=560, why="日本の真裏のチリへ")
    add("S03", 6, "globe", at="ノルウェーは", lon=(288, 372), lat=(-38, 60), r=(520, 480), cy=560, why="北の果てのノルウェーへ")
    add("S04", 4, "card", kicker="量で一番は？", title="ノルウェー？", why="予想")
    add("S04", 3, "diag", at="けれど", fn=d_big("チリ", "量で一番"), why="答え")
    add("S04", 5, "diag", at="二〇二四年", fn=d_big("約22万トン", "日本が輸入したサケ・マス　2024年"), why="輸入量")
    add("S04", 8, "diag", at="そのうち約七割", fn=d_bars("輸入したサケ・マスの国別（量、2024年）", [("チリ", 68.9), ("ノルウェー", 11.6), ("ロシア", 8.0)], "%"), why="チリ約7割")
    add("S04", 6, "diag", at="この順番は", fn=d_big("2015年から", "1位チリ・2位ノルウェーは毎年同じ"), why="順位は不変")
    add("S05", 5, "diag", fn=d_compare("よくある答え", ("サーモンは", "冷たい海の魚", ""), ("だから", "寒い国から来る", "")), why="よくある答え")
    add("S05", 8, "diag", at="サーモンの海での養殖には", fn=d_three("海での養殖に要るもの", [("12〜15℃", "冷たい水"), ("入り江", "波が立たない")]), why="水温と入り江")
    add("S05", 5, "diag", at="日本の海は", fn=d_big("夏に水温が上がる", "日本の海"), why="日本の海は向かない")
    add("S06", 6, "map", **MAPV(HOKKAIDO), layers=[L_text(142.8, 43.6, "北海道", 0.3, 64), L_text(142.8, 42.8, "シロザケ", 0.9, 48, RE)], why="日本で獲れるサケ＝北海道のシロザケ")
    add("S06", 9, "diag", at="一九九六年", fn=d_bars("日本のサケの漁獲", [("1996年", 287459), ("2024年", 46706), ("2025年（速報）", 16600)], "トン"), why="漁獲の減少")
    add("S06", 6, "diag", at="いま日本が外国から買う", fn=d_compare("2024年", ("外国から買うサケ・マス", "約22万トン", ""), ("日本の海で獲れたサケ", "約4.7万トン", "")), why="輸入は国内漁獲の4倍超")
    # 第2章
    add("S07", 4, "card", kicker="第2章", title="サケのいなかった国", why="章の扉")
    add("S07", 7, "map", at="チリには、もともと", **MAPV(CHILE), layers=[L_country("Chile", 0.2, AM, 0.25), L_text(-80.5, -44.5, "半世紀前：サケ 0", 0.8, 52, RE)], why="チリにはサケがいなかった")
    add("S07", 5, "diag", at="サケのいなかった国から", fn=d_big("約7割", "いま日本のサケ・マスが来る国　チリ"), why="7割がチリ")
    add("S08", 6, "map", **MAPV(HOKKAIDO), layers=[L_text(142.8, 43.6, "北海道", 0.3, 64), L_text(142.8, 42.9, "1969年", 0.8, 52, AM)], why="北海道の国の孵化場（場所は描かない）")
    add("S08", 8, "diag", at="名前は", fn=d_compare("1969年　北海道で出会う", ("チリの研修生", "パブロ・アギレラ", ""), ("日本の水産技術者", "長澤有晃", "")), why="二人の出会い（名前は画面の文字）")
    add("S09", 5, "diag", fn=d_big("15万粒", "サクラマスの卵　北海道からチリへ　1972年11月"), why="1972年の卵")
    add("S09", 8, "map", at="行き先は", **MAPV(CHILE), layers=[L_country("Chile", 0.0, AM, 0.2), L_years([("コジャイケ", "1972年")], 0.3)], why="コジャイケ")
    add("S10", 6, "diag", fn=d_year("1973年", "チリでクーデター", "計画は一度止まる"), why="中断")
    add("S10", 6, "diag", at="毎年三百万粒", fn=d_big("毎年300万粒", "シロサケの卵　北海道からコジャイケへ"), why="シロサケの卵")
    add("S10", 8, "diag", at="一九七四年", fn=d_timeline("コジャイケ", [("1974年", "シロサケの放流式"), ("1976年", "孵化場が完成\n白石博士の名前")]), why="放流式と孵化場")
    add("S11", 5, "diag", fn=d_three("サケは", [("生まれた川へ", "帰ってくる魚")]), why="母川回帰")
    add("S11", 9, "map", at="一九八六年", **MAPV(PATA), layers=[L_years([("コジャイケ", "放流した場所"), ("プエルト・ナターレス", "1986年に発見")], 0.3, 1.2)], why="遠く離れた川で見つかる")
    add("S11", 6, "map", at="その湾の名前は", **MAPV(PATA), layers=[L_years([("コジャイケ", "放流した場所"), ("プエルト・ナターレス", "1986年に発見")], 0.0, 0.0),
                                                                     L_text(-79.0, -50.6, "ウルティマ・エスペランサ", 0.3, 44, TE), L_text(-79.0, -51.2, "＝最後の希望", 0.9, 44, TE)], why="湾の名前")
    add("S12", 6, "diag", fn=d_pens, why="海に浮かべた生簀（模式図）")
    add("S12", 10, "diag", at="日本の企業ニチロは", fn=d_timeline("海で育てる道", [("1979年", "ニチロ\nチリで初の海面養殖の商売"), ("1981年", "フィヨルドの生簀で\n親のサケを育てる実験")]), why="ニチロと生簀実験")
    add("S12", 5, "diag", at="この方法は", fn=d_pens, why="養殖会社へ広がる")
    add("S13", 8, "diag", fn=d_timeline("チリのサケ養殖", [("1980年代半ば", "チリの財団が\n大規模に事業化"), ("1988年", "ニッスイが\n買い取る")]), why="事業化")
    add("S13", 6, "diag", at="一九九三年", fn=d_people(4, 2, "56%", "1993年　チリが輸出したサケを買ったのは日本"), why="1993年、日本が56%")
    add("S14", 6, "map", **MAPV(CHILE), layers=[L_country("Chile", 0.0, AM, 0.2), dots(["プエルト・モン"], 0.3)], why="プエルト・モン")
    add("S14", 8, "diag", at="北半球に折り返すと", fn=d_lat2, why="函館とほぼ同じ緯度")
    add("S15", 8, "map", **MAPV(CHILE), layers=[L_country("Chile", 0.0, AM, 0.15), L_text(-80.0, -41.5, "ロス・ラゴス州 52%", 0.3, 40, AM),
                                                L_text(-80.0, -46.0, "アイセン州 37%", 0.8, 40, AM), L_text(-79.5, -50.2, "マガジャネス州 10%", 1.3, 40, AM)], why="州別の収穫（位置は概略）")
    add("S15", 8, "diag", at="中身は", fn=d_bars("チリのサケ・マスの収穫（2024年）", [("アトランティック", 69.3), ("ギンザケ", 24.4), ("トラウト", 6.3)], "%"), why="魚種の内訳")
    add("S15", 5, "diag", at="二〇二五年には", fn=d_big("386か所", "海で動いていた養殖場　2025年の多い月"), why="養殖場の数")
    add("S16", 6, "diag", fn=d_year("2007年", "ISAウイルス", "チリの養殖場で初めて見つかる"), why="ISA")
    add("S16", 9, "diag", at="ウイルスは広がり", fn=d_bars("チリのアトランティックサーモンの生産", [("2008年", 38.9), ("2010年", 12.3)], "万トン"), why="3分の1以下")
    add("S16", 5, "diag", at="この間も", fn=d_big("日本向けのトラウト", "輸出は大きくは崩れなかった"), why="日本向けトラウト")
    add("S17", 7, "map", **MAPV(CHILE), layers=[L_country("Chile", 0.0, AM, 0.15), L_text(-79.5, -41.5, "ロス・ラゴス州", 0.3, 44, RE), L_text(-79.5, -42.4, "2016年", 0.8, 44, RE)], why="2016年 ロス・ラゴス州")
    add("S17", 9, "diag", at="被害を受けた", fn=d_three("2016年の藻の大発生", [("45か所", "養殖場"), ("2,500万匹超", "死んだサケ"), ("約4万トン", "9割以上が\nアトランティック")]), why="被害")
    # 第3章
    add("S18", 4, "card", kicker="第3章", title="生で食べなかった日本人", why="章の扉")
    add("S18", 5, "diag", at="違います", fn=d_compare("昔の日本", ("サケの刺身", "食べなかった", ""), ("理由", "寄生虫の心配", "")), why="生では食べなかった")
    add("S19", 10, "diag", fn=d_counts, why="27/27、0/8、0/9")
    add("S19", 6, "diag", at="一匹あたり", fn=d_compare("天然の秋ザケ1匹あたり", ("平均", "22匹", ""), ("多い魚", "161匹", "")), why="寄生数")
    add("S19", 6, "diag", at="ところが", fn=d_counts, why="養殖からは0匹")
    add("S20", 8, "diag", fn=d_compare("違いは、エサ", ("天然のサケ", "海のエサ", ""), ("養殖のサーモン", "配合飼料", "寄生虫がいない")), why="配合飼料")
    add("S20", 7, "diag", at="ヨーロッパで", fn=d_big("リスクは無視できる", "ヨーロッパの食品安全の機関　配合飼料で育てた養殖アトランティック"), why="EFSA")
    add("S20", 6, "diag", at="天然の魚でも", fn=d_big("−20℃で丸一日", "凍らせれば、アニサキスは人にうつらない"), why="冷凍")
    add("S21", 8, "map", **MAPV(NORWAY), layers=[L_country("Norway", 0.0, TE, 0.2), L_years([("ヒトラ島", "1970年5月28日")], 0.3)], why="ヒトラ島")
    add("S21", 6, "diag", at="オーヴェと", fn=d_year("1970年5月28日", "ヒトラ島", "グロントヴェット兄弟が生簀にサーモンを入れる"), why="最初の養殖")
    add("S21", 8, "diag", at="一九七〇年に五百トン", fn=d_bars("ノルウェーの養殖サーモン", [("1970年", 500), ("1980年", 8000), ("1990年", 170000)], "トン"), why="生産量")
    add("S22", 6, "diag", fn=d_compare("1980年代の日本", ("すしの人気", "高まる", ""), ("マグロ", "追いつかない", "")), why="マグロ不足")
    add("S23", 9, "diag", fn=d_year("1985年", "ノルウェーの代表団が東京へ", "率いたのは元漁業大臣 トール・リスタウ"), why="プロジェクト・ジャパン")
    add("S23", 6, "diag", at="ノルウェー大使館", fn=d_three("サーモンのすしを食べてもらう", [("大使館", "夕食会"), ("輸入業者", ""), ("飲食店", "")]), why="試食")
    add("S24", 6, "diag", fn=d_big("築地で嫌われた", "最初のノルウェーのサーモン"), why="築地")
    add("S24", 8, "diag", at="一九八〇年、ノルウェーから", fn=d_bars("ノルウェーから日本へのサーモン", [("1980年", 2), ("20年後", 45000)], "トン"), why="2トン→4.5万トン")
    add("S24", 6, "diag", at="二〇二〇年の調査では", fn=d_big("9年連続1位", "回転寿司で一番人気のネタ　2020年の調査"), why="人気1位")
    add("S25", 7, "diag", fn=d_big("約126万トン", "ノルウェーが輸出したサーモン　2024年　過去最高額"), why="輸出量")
    add("S25", 8, "diag", at="ところが", fn=d_three("いちばん多く買う国", [("ポーランド", ""), ("アメリカ", ""), ("フランス", "")]), why="上位は欧米")
    # 第4章
    add("S26", 4, "card", kicker="第4章", title="一皿の中の地図", why="章の扉")
    add("S26", 10, "diag", at="この三つは", fn=d_three("「サーモン」は1種類ではない", [("タイセイヨウサケ", "アトランティック\nサーモン"), ("ニジマス", "サーモン\nトラウト"), ("ギンザケ", "")]), why="3種")
    add("S27", 8, "diag", fn=d_compare("届き方", ("チリ", "97%が冷凍", "中身の3分の2はギンザケ"), ("ノルウェー", "9割近くが生", "凍らずに届く分の4分の3")), why="冷凍と生")
    add("S27", 5, "diag", at="日本が輸入するサケとマスの四十五", fn=d_big("45%", "日本が輸入するサケ・マスのうち　チリの冷凍ギンザケ"), why="45%")
    add("S27", 5, "diag", at="一方", fn=d_big("4分の3", "日本に凍らずに届くサケ・マスのうち　ノルウェー産"), why="生鮮の4分の3")
    add("S27", 7, "diag", at="生のまま丸ごと", fn=d_bars("生のまま丸ごと届くアトランティックサーモン", [("ノルウェー", 66.8), ("オーストラリア", 16.8), ("カナダ", 14.2), ("チリ", 1.1)], "%"), why="生鮮アトランティック")
    add("S27", 6, "diag", at="一キロあたりの値段は", fn=d_compare("1kgあたりの輸入の値段（2024年）", ("ノルウェー産", "約2,100円", ""), ("チリ産", "約1,200円", "")), why="単価")
    add("S28", 6, "map", **MAPV(TURKEY), layers=[L_country("Turkey", 0.2, AM, 0.3), L_text(35.0, 39.0, "トルコ", 0.6, 64)], why="トルコ")
    add("S28", 8, "diag", at="トルコからの輸入は", fn=d_bars("トルコからのサケ・マスの輸入", [("2017年", 480), ("2024年", 6200)], "トン"), why="7年で約13倍")
    add("S28", 5, "diag", at="スシローの", fn=d_origin(True), why="スシローの表ではトルコが先")
    add("S29", 6, "map", **MAPV(JAPAN), layers=[dots(["南三陸町"], 0.3)], why="宮城県南三陸町")
    add("S29", 7, "map", at="卵から稚魚までは", **MAPV(MIYAGI), layers=[L_text(141.53, 38.645, "志津川湾", 0.3, 56, TE)], why="志津川湾")
    add("S29", 6, "diag", at="十一月", fn=d_compare("宮城のギンザケ", ("山の淡水の池", "卵→稚魚", ""), ("11月　海の生簀へ", "約150g→約2kg", "")), why="育て方")
    add("S29", 6, "diag", at="二〇一一年", fn=d_year("2011年", "東日本大震災の津波", "生簀も船も流された　山の池の稚魚は7割ほど無事"), why="震災")
    add("S29", 6, "diag", at="宮城のギンザケは", fn=d_year("2017年", "「みやぎサーモン」", "宮城県で初めての地理的表示（GI）"), why="GI")
    add("S30", 10, "diag", fn=d_bars("ギンザケ（2024年）", [("国産（養殖）", 1.7), ("チリ産（冷凍）", 9.9)], "万トン"), why="国産の約6倍")
    add("S31", 7, "diag", fn=d_bars("輸入したサケ・マスの1kgの値段", [("2015年", 771), ("2024年", 1279)], "円"), why="約1.7倍")
    add("S31", 5, "diag", at="ノルウェー産は", fn=d_compare("ノルウェー産の1kgの値段", ("2015年", "約1,040円", ""), ("2024年", "約2,100円", "")), why="2倍")
    add("S31", 7, "diag", at="買う量は", fn=d_compare("2015年→2024年", ("買う量", "約12%減", ""), ("払うお金", "約1.5倍", "")), why="量と金額")
    # 第5章
    add("S32", 4, "card", kicker="第5章", title="二本の矢印", why="章の扉")
    add("S32", 12, "diag", at="一本は", fn=d_arrows, why="逆向きの二本の矢印（模式図）")
    add("S33", 10, "diag", fn=d_arrows, why="結論")
    add("S33", 5, "diag", at="そのあいだに", fn=d_big("6分の1以下", "日本の海のサケ　いちばん多かった年と比べて"), why="日本の海のサケ")
    add("S33", 5, "globe", at="次に売り場や", lon=(140, 140), lat=(36, 30), r=(560, 380), cy=560, why="地球へ引く")
    add("S33", 7, "card", at="その一切れの後ろには", title="地球の事情", sub="地理・歴史・経済で、世界を読み解く", foot="音声：VOICEVOX:雀松朱司", why="締め")
    return S


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
        (EP / "shotlist.md").write_text("# カット表（render/render.py から自動生成）\n\n見た目はカナダ・バミューダと同じ（丸ゴシック字幕・明るい背景）。画面の注釈は出さない（社長 2026-11-12）。地図と地球儀の下地は Natural Earth 1:10m（パブリックドメイン）。陰影図 shadedrelief.jpg は使わない。店名は文字だけでロゴは使わない。\n\n" + R.shotlist_md())
        return
    if a.still:
        for t in a.still:
            Image.fromarray(V4.frame(t)).save(OUT / f"still_{t:07.2f}.jpg", quality=88)
        return
    n = int(math.ceil(R.TOTAL / 10.0))
    if a.chunks:
        i, m = map(int, a.chunks.split("/"))
        for c in range(i - 1, n, m):
            dst = OUT / f"c8_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"c8_{c:03d}.tmp.mp4"
            V4.render(c * 10.0, min(R.TOTAL, (c + 1) * 10.0), tmp)
            tmp.rename(dst)
        return
    if a.mux:
        parts = sorted(OUT.glob("c8_[0-9][0-9][0-9].mp4"))
        assert len(parts) == n, len(parts)
        (OUT / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts.txt"),
                        "-i", str(OUT / "mix.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-15:TP=-1.5:LRA=11",
                        "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT / "chizu-008-salmon-ends_full.mp4")], check=True)


if __name__ == "__main__":
    main()
