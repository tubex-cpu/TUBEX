"""chizu-010-us-pivot-circles (long, ~15 min; 社長 2026-11-26「このまま動画制作まで貫通して」, 尺15〜30分).
Look = chizu-008 salmon (rounded-gothic subtitles, light background). Reuses chizu-005 render_v4 (and through it
render_v3 / render.py / chizu-001 render_v23) for drawing, timeline and subtitles; helpers copied from chizu-008 render.py.
Base maps and the globe: Natural Earth 1:10m land (public domain). No satellite or aerial images: the circle fields,
pivots and cross-sections are schematic drawings made here. No corner notes, headings or credits on screen (社長 2026-11-12).
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
    "ガーデンシティ": (-100.87, 37.97), "ダッジシティ": (-100.02, 37.75), "ホルコム": (-100.99, 37.99), "リベラル": (-100.92, 37.04),
    "シェリダン郡": (-100.44, 39.35), "コルビー": (-101.05, 39.40), "ワディ・アッシルハン": (38.3, 30.9),
})
B.SIDE.clear()
B.SIDE.update({"ガーデンシティ": "r", "ダッジシティ": "r", "ホルコム": "l", "リベラル": "r", "シェリダン郡": "r", "コルビー": "l",
               "ワディ・アッシルハン": "r"})

USA = dict(lon=-98.0, lat=39.0, kmpp=2.9)
PLAINS = dict(lon=-100.5, lat=39.5, kmpp=1.6)
KANSAS = dict(lon=-98.3, lat=38.5, kmpp=0.62)
ARABIA = dict(lon=43.0, lat=26.0, kmpp=2.2)
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
SOIL, DRY, GREEN, GREEN2 = (196, 168, 122), (214, 190, 146), (104, 158, 84), (132, 182, 104)
WATER = (86, 146, 204)
GROUND = (150, 118, 82)


def _fields_layer(t, cols=9, rows=5, cell=200, grow=None, years_k=None, big=True, x0=None, y0=None, alpha=1.0):
    """Top-down grid of square plots. grow: (t0, t1) circles fade in one by one. years_k: 0..1 share of plots that are
    circles (the rest are rectangles with rows of crops). big: one 2x2 block holds a full-section circle."""
    L, dr = layer()
    x0 = (W - cols * cell) / 2 if x0 is None else x0
    y0 = (H - rows * cell) / 2 if y0 is None else y0
    dr.rectangle([0, 0, W, H], fill=DRY + (int(255 * alpha),))
    n = cols * rows
    order = sorted(range(n), key=lambda i: (i * 7919) % n)
    rank = {c: k for k, c in enumerate(order)}
    bigblock = {(1, 1), (2, 1), (1, 2), (2, 2)} if big else set()
    for r_ in range(rows):
        for c in range(cols):
            i = r_ * cols + c
            x, y = x0 + c * cell, y0 + r_ * cell
            dr.rectangle([x + 3, y + 3, x + cell - 3, y + cell - 3], outline=(170, 146, 106, int(255 * alpha)), width=3)
            if (c, r_) in bigblock:
                continue
            k = 1.0
            if grow is not None:
                k = seg(t, grow[0] + (grow[1] - grow[0]) * rank[i] / n, grow[0] + (grow[1] - grow[0]) * rank[i] / n + 0.4)
            if years_k is not None:
                circ = rank[i] / n < years_k
                if not circ:
                    for j in range(6):
                        yy = y + 18 + j * (cell - 36) / 5
                        dr.line([(x + 16, yy), (x + cell - 16, yy)], fill=GREEN2 + (int(200 * alpha),), width=8)
                    continue
            if k <= 0:
                continue
            pad = 8
            dr.ellipse([x + pad, y + pad, x + cell - pad, y + cell - pad], fill=(GREEN if (i % 3) else GREEN2) + (int(255 * k * alpha),))
            dr.ellipse([x + cell / 2 - 5, y + cell / 2 - 5, x + cell / 2 + 5, y + cell / 2 + 5], fill=(240, 240, 236, int(255 * k * alpha)))
    if bigblock:
        k = 1.0 if grow is None else seg(t, grow[0], grow[0] + 0.5)
        x, y = x0 + cell, y0 + cell
        if years_k is None or years_k > 0.3:
            dr.ellipse([x + 8, y + 8, x + 2 * cell - 8, y + 2 * cell - 8], fill=GREEN + (int(255 * k * alpha),))
            dr.ellipse([x + cell - 6, y + cell - 6, x + cell + 6, y + cell + 6], fill=(240, 240, 236, int(255 * k * alpha)))
        else:
            for j in range(12):
                yy = y + 18 + j * (2 * cell - 36) / 11
                dr.line([(x + 16, yy), (x + 2 * cell - 16, yy)], fill=GREEN2 + (int(200 * alpha),), width=8)
    return L, (x0, y0, cell)


def d_fields(grow=(0.3, 3.0), diam=False, head=None):
    def fn(img, t, d):
        L, (x0, y0, cell) = _fields_layer(t, grow=grow)
        put(img, L, 1.0)
        if diam:
            a = seg(t, 2.0, 2.6)
            L2, d2 = layer()
            cx, cy = x0 + 4 * cell + cell / 2, y0 + 3 * cell + cell / 2
            d2.line([(cx - cell / 2 + 8, cy), (cx + cell / 2 - 8, cy)], fill=(255, 255, 255, int(255 * a)), width=6)
            bx, by = x0 + 2 * cell, y0 + 2 * cell
            d2.line([(bx - cell + 8, by), (bx + cell - 8, by)], fill=(255, 255, 255, int(255 * a)), width=6)
            put(img, L2, 1.0)
            label(img, (cx, cy - 60), "約800m", a, 44)
            label(img, (bx, by - 60), "約1,600m", a, 44)
        if head:
            label(img, (W / 2, 120), head, seg(t, 0.2, 0.8), 52)
    return fn


def d_years(img, t, d):
    """S05: around Garden City the rectangles turn into circles (schematic, not traced from images)."""
    yrs = [("1972年", 0.0), ("1988年", 0.35), ("2011年", 0.75), ("2015年", 0.9)]
    n = len(yrs)
    k = min(n - 1, int(t / max(0.1, d / n)))
    L, _ = _fields_layer(t, years_k=yrs[k][1])
    put(img, L, 1.0)
    label(img, (W / 2, 120), "ガーデンシティのまわり　" + yrs[k][0], 1.0, 56)


def d_pivot_top(img, t, d):
    """S06–S08: one circle seen from above: the well in the centre, the pipe turning, the watered part turning green."""
    cx, cy, R0 = W / 2, H / 2 + 20, 380
    L, dr = layer()
    dr.rectangle([0, 0, W, H], fill=DRY + (255,))
    dr.rectangle([cx - R0 - 10, cy - R0 - 10, cx + R0 + 10, cy + R0 + 10], outline=(170, 146, 106, 255), width=4)
    ang = (t / max(1.0, d)) * 300 - 90
    dr.pieslice([cx - R0, cy - R0, cx + R0, cy + R0], -90, ang, fill=GREEN + (255,))
    ex, ey = cx + R0 * math.cos(math.radians(ang)), cy + R0 * math.sin(math.radians(ang))
    dr.line([(cx, cy), (ex, ey)], fill=(236, 236, 232, 255), width=10)
    for j in range(1, 6):
        tx, ty = cx + (ex - cx) * j / 5, cy + (ey - cy) * j / 5
        dr.ellipse([tx - 12, ty - 12, tx + 12, ty + 12], fill=(90, 96, 104, 255))
    for j in range(14):
        u = (j + 0.5) / 14
        px, py = cx + (ex - cx) * u, cy + (ey - cy) * u
        dr.ellipse([px - 6, py + 14, px + 6, py + 26], fill=WATER + (200,))
    dr.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=WATER + (255,), outline=(255, 255, 255, 255), width=5)
    put(img, L, 1.0)
    label(img, (cx, cy - 70), "井戸", seg(t, 0.3, 0.9), 46)
    label(img, ((cx + ex) / 2, (cy + ey) / 2 - 60), "回る管", seg(t, 1.2, 1.8), 42)


def d_pivot_side(img, t, d):
    """S06/S07: side view: towers on wheels carry the pipe; the well goes down into the water layer."""
    L, dr = layer()
    gy = 560
    dr.rectangle([0, 0, W, gy], fill=(214, 228, 238, 255))
    dr.rectangle([0, gy, W, H], fill=GROUND + (255,))
    dr.rectangle([0, 800, W, H], fill=WATER + (255,))
    wx = 300
    dr.rectangle([wx - 10, gy - 140, wx + 10, 860], fill=(90, 96, 104, 255))
    off = (t * 60) % 300
    dr.line([(wx, gy - 140), (1820, gy - 140)], fill=(236, 236, 232, 255), width=12)
    for j in range(5):
        x = wx + 300 + j * 300
        dr.polygon([(x - 50, gy - 20), (x, gy - 140), (x + 50, gy - 20)], outline=(90, 96, 104, 255), width=8)
        dr.ellipse([x - 30, gy - 40, x + 30, gy + 20], outline=(60, 64, 70, 255), width=10)
    for j in range(40):
        x = wx + 40 + j * 38
        yy = gy - 130 + ((t * 300 + j * 37) % 120)
        dr.ellipse([x - 5, yy - 5, x + 5, yy + 5], fill=WATER + (220,))
    put(img, L, 1.0)
    label(img, (wx + 260, 850), "地下の水", seg(t, 0.3, 0.9), 42)
    label(img, (1200, gy - 210), "車輪のついた塔が、管を支えて回る", seg(t, 0.8, 1.4), 44)


def d_square(img, t, d):
    """S09: a circle in a square plot: the four corners get no water."""
    cx, cy, s = W / 2 - 260, H / 2 + 30, 300
    L, dr = layer()
    dr.rectangle([cx - s, cy - s, cx + s, cy + s], fill=(DRY if seg(t, 1.0, 1.6) > 0.5 else SOIL) + (255,), outline=(120, 96, 64, 255), width=6)
    a = seg(t, 0.4, 1.0)
    dr.ellipse([cx - s, cy - s, cx + s, cy + s], fill=GREEN + (int(255 * a),))
    put(img, L, 1.0)
    label(img, (cx, cy - s - 50), "一辺 約800m", seg(t, 0.2, 0.7), 44)
    text(img, (1250, 400), "160エーカー", 64, anchor="lm", alpha=seg(t, 0.6, 1.2))
    text(img, (1250, 500), "水が届くのは 約125エーカー", 46, anchor="lm", alpha=seg(t, 1.4, 2.0), fill=TE)
    text(img, (1250, 590), "四隅は乾いたまま", 46, anchor="lm", alpha=seg(t, 2.2, 2.8), fill=AM)


def d_grid(img, t, d):
    """S19: 6-mile township → 36 one-mile sections → a quarter section (160 acres)."""
    L, dr = layer()
    cx, cy, S0 = W / 2 - 300, H / 2 + 40, 600
    x0, y0 = cx - S0 / 2, cy - S0 / 2
    k1, k2, k3 = seg(t, 0.2, 1.0), seg(t, 1.5, 2.5), seg(t, 3.0, 3.8)
    dr.rectangle([x0, y0, x0 + S0, y0 + S0], fill=DRY + (255,), outline=(120, 96, 64, int(255 * k1)), width=6)
    for i in range(1, 6):
        a = int(255 * k2)
        dr.line([(x0 + i * S0 / 6, y0), (x0 + i * S0 / 6, y0 + S0)], fill=(150, 126, 90, a), width=3)
        dr.line([(x0, y0 + i * S0 / 6), (x0 + S0, y0 + i * S0 / 6)], fill=(150, 126, 90, a), width=3)
    sx, sy, ss = x0 + 2 * S0 / 6, y0 + 2 * S0 / 6, S0 / 6
    if k3 > 0:
        dr.rectangle([sx, sy, sx + ss, sy + ss], fill=AM + (int(200 * k3),))
        dr.line([(sx + ss / 2, sy), (sx + ss / 2, sy + ss)], fill=(255, 255, 255, int(255 * k3)), width=3)
        dr.line([(sx, sy + ss / 2), (sx + ss, sy + ss / 2)], fill=(255, 255, 255, int(255 * k3)), width=3)
        dr.rectangle([sx, sy, sx + ss / 2, sy + ss / 2], fill=GREEN + (int(255 * k3),))
    put(img, L, 1.0)
    text(img, (1180, 330), "6マイル四方", 56, anchor="lm", alpha=k1)
    text(img, (1180, 430), "→ 1マイル四方の36区画", 46, anchor="lm", alpha=k2)
    text(img, (1180, 520), "1区画 = 640エーカー", 46, anchor="lm", alpha=k2, fill=TE)
    text(img, (1180, 610), "その4分の1 = 160エーカー", 46, anchor="lm", alpha=k3, fill=AM)


def d_sizes(img, t, d):
    """S20: the two circle sizes fit the survey grid: 800 m in a quarter section, 1,600 m in a full section."""
    L, dr = layer()
    dr.rectangle([0, 0, W, H], fill=DRY + (255,))
    s = 300
    x0, y0 = 260, 200
    for i in range(3):
        for j in range(2):
            dr.rectangle([x0 + i * s, y0 + j * s, x0 + (i + 1) * s, y0 + (j + 1) * s], outline=(150, 126, 90, 255), width=3)
    a1, a2 = seg(t, 0.4, 1.0), seg(t, 1.4, 2.0)
    dr.ellipse([x0 + 6, y0 + 6, x0 + s - 6, y0 + s - 6], fill=GREEN + (int(255 * a1),))
    dr.ellipse([x0 + s + 6, y0 + 6, x0 + 3 * s - 6, y0 + 2 * s - 6], fill=GREEN2 + (int(255 * a2),))
    put(img, L, 1.0)
    label(img, (x0 + s / 2, y0 + s / 2), "直径 約800m", a1, 38)
    label(img, (x0 + 2 * s, y0 + s), "直径 約1,600m", a2, 44)
    text(img, (1180, 380), "160エーカーの一辺 ≒ 800m", 42, anchor="lm", alpha=a1)
    text(img, (1180, 480), "1マイル四方の一辺 ≒ 1,600m", 42, anchor="lm", alpha=a2)
    text(img, (1180, 600), "丸の大きさ ＝ 碁盤の目の大きさ", 42, anchor="lm", alpha=seg(t, 2.6, 3.2), fill=AM)


def d_section(drop=False, zoom=False, thick=False):
    """S23–S27, S32: cross-section: ground, the water-bearing layer of sand and gravel, wells; optionally the water
    table falling (largest decline) or a close-up of grains with water between them."""
    def fn(img, t, d):
        L, dr = layer()
        if zoom:
            dr.rectangle([0, 0, W, H], fill=WATER + (255,))
            rng = np.random.default_rng(7)
            for _ in range(260):
                x, y, r = rng.uniform(0, W), rng.uniform(0, H), rng.uniform(14, 60)
                c = (196, 170, 128) if rng.random() < 0.7 else (150, 140, 128)
                dr.ellipse([x - r, y - r, x + r, y + r], fill=c + (255,), outline=(120, 100, 76, 255), width=2)
            put(img, L, 1.0)
            label(img, (W / 2, 150), "砂や小石の粒のすき間に、水", seg(t, 0.3, 0.9), 52)
            return
        gy, wt0, base_ = 330, 470, 900
        wt = wt0 + (seg(t, 0.8, 3.2) * 230 if drop else 0)
        dr.rectangle([0, 0, W, gy], fill=(214, 228, 238, 255))
        for i in range(6):
            x = 160 + i * 300
            dr.ellipse([x - 110, gy - 18, x + 110, gy + 4], fill=GREEN + (255,))
        dr.rectangle([0, gy, W, base_], fill=GROUND + (255,))
        dr.rectangle([0, wt, W, base_], fill=WATER + (255,))
        rng = np.random.default_rng(3)
        for _ in range(300):
            x, y = rng.uniform(0, W), rng.uniform(gy + 10, base_ - 10)
            dr.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(120, 96, 70, 150))
        dr.rectangle([0, base_, W, H], fill=(110, 96, 86, 255))
        for i in range(6):
            x = 160 + i * 300
            dr.rectangle([x - 5, gy - 10, x + 5, base_ - 40], fill=(70, 74, 80, 255))
        if drop:
            dr.line([(0, wt0), (W, wt0)], fill=(255, 255, 255, 200), width=4)
        put(img, L, 1.0)
        if drop:
            text(img, (1500, wt0 - 30), "くみ上げ前の水面", 36, anchor="mm", alpha=1.0, fill=(255, 255, 255))
            label(img, (W / 2, (wt0 + wt) / 2 + 10), "最大 約81m 低下", seg(t, 2.6, 3.2), 50)
        elif thick:
            label(img, (W / 2, (wt0 + base_) / 2), "水をふくむ層　平均 約60m・厚いところ 約300m", seg(t, 0.4, 1.0), 44)
        else:
            label(img, (W / 2, (wt0 + base_) / 2), "地下の水の層", seg(t, 0.4, 1.0), 52)
    return fn


def L_meridian(lon, t0=0.3, color=None, lab=None, dash=True):
    def fn(img, p, t, d):
        k = seg(t, t0, t0 + 1.2)
        if k <= 0:
            return
        lats = np.linspace(50, 26, 120)
        x, y = p(np.full_like(lats, lon), lats)
        n = int(len(lats) * k)
        dr = ImageDraw.Draw(img)
        for i in range(0, max(1, n - 1), 2 if dash else 1):
            dr.line([(x[i], y[i]), (x[i + 1], y[i + 1])], fill=(color or RE) + (255,), width=7)
        if lab:
            text(img, (x[0], y[0] - 40), lab, 44, anchor="mm", fill=color or RE, alpha=seg(t, t0 + 0.8, t0 + 1.4))
    return fn


def L_tint(lon_from, lon_to, color, t0=0.6, alpha=0.18, lat=(25, 50)):
    """Shade the land west of a meridian (a band between two meridians, 25–50°N)."""
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 0.8)
        if a <= 0:
            return
        L = Image.new("RGBA", img.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(L)
        lons = np.linspace(lon_from, lon_to, 40)
        top = [p(lo, lat[1]) for lo in lons]; bot = [p(lo, lat[0]) for lo in lons[::-1]]
        dr.polygon([(a_[0], a_[1]) for a_ in top + bot], fill=color + (int(255 * alpha * a),))
        img.alpha_composite(L)
    return fn


STATES = [("テキサス", -101.5, 33.8), ("ニューメキシコ", -103.6, 34.6), ("オクラホマ", -100.5, 36.6), ("カンザス", -99.6, 38.6),
          ("コロラド", -103.0, 39.3), ("ネブラスカ", -100.0, 41.5), ("ワイオミング", -104.5, 42.6), ("サウスダコタ", -100.8, 43.9)]


def L_states(t0=0.3, stagger=0.25, names=None, size=36, color=None):
    def fn(img, p, t, d):
        for i, (nm, lo, la) in enumerate(STATES):
            if names and nm not in names:
                continue
            a = seg(t, t0 + i * stagger, t0 + i * stagger + 0.5)
            text(img, p(lo, la), nm, size, anchor="mm", alpha=a, fill=color or INK)
    return fn


def L_japan(at=(-80.0, 31.0), t0=1.0):
    """Japan drawn at the same scale as the map (Natural Earth, shifted to sit beside the High Plains for size)."""
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 0.8)
        if a <= 0:
            return
        L = Image.new("RGBA", img.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(L)
        kmpp = KMPP()
        ox, oy = p(*at)
        for poly in R.country("Japan"):
            r = poly[0]
            x, y = geo.laea(r[:, 0], r[:, 1], 137.0, 37.5)
            dr.polygon(list(zip(ox + x / kmpp, oy - y / kmpp)), fill=RE + (int(110 * a),), outline=RE + (int(255 * a),))
        img.alpha_composite(L)
        text(img, (ox + 420, oy - 260), "日本（同じ縮尺で重ねる）", 40, anchor="mm", alpha=a, fill=RE)
    return fn


def L_kansas(t0=0.0):
    """Kansas border, simplified (straight lines; the small north-east corner along the Missouri River is cut straight)."""
    pts = [(-102.05, 40.0), (-95.3, 40.0), (-94.6, 39.1), (-94.6, 37.0), (-102.05, 37.0)]
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 0.6)
        if a <= 0:
            return
        L = Image.new("RGBA", img.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(L)
        xy = [p(lo, la)[:2] for lo, la in pts]
        dr.polygon(xy, fill=AM + (int(40 * a),), outline=AM + (int(255 * a),), width=5)
        img.alpha_composite(L)
    return fn


def d_biwa(img, t, d):
    """S31: the lost water ≈ 13 Lake Biwa (schematic lake shapes)."""
    title(img, "減った水　約3,500億立方メートル", t, y=150)
    L, dr = layer()
    for i in range(13):
        a = seg(t, 0.4 + i * 0.18, 0.7 + i * 0.18)
        if a <= 0:
            continue
        x = 300 + (i % 7) * 220 + (110 if i >= 7 else 0); y = 420 + (i // 7) * 250
        dr.ellipse([x - 40, y - 100, x + 40, y + 30], fill=WATER + (int(255 * a),))
        dr.ellipse([x - 20, y + 10, x + 30, y + 90], fill=WATER + (int(255 * a),))
    put(img, L, 1.0)
    text(img, (W / 2, 860), "琵琶湖の水　約13杯分", 60, anchor="mm", alpha=seg(t, 2.8, 3.4), fill=AM)


def d_rain(img, t, d):
    """S34: of the rain that falls, about 2% reaches the water layer."""
    L, dr = layer()
    gy = 600
    dr.rectangle([0, 0, W, gy], fill=(214, 228, 238, 255))
    dr.rectangle([0, gy, W, H], fill=GROUND + (255,))
    dr.rectangle([0, 900, W, H], fill=WATER + (255,))
    for j in range(50):
        x = 120 + j * 34
        reach = j in (17, 36)
        ph = (t * 0.8 + j * 0.137) % 1.0
        y = 120 + ph * (gy - 120) if not reach else 120 + ph * (900 - 120)
        if not reach and ph > 0.85:
            continue
        dr.ellipse([x - 6, y - 12, x + 6, y + 6], fill=(WATER if reach else (150, 170, 190)) + (255,))
    put(img, L, 1.0)
    label(img, (W / 2, 760), "地下の水の層まで届くのは　約2%", seg(t, 0.6, 1.2), 52)


def d_sand(img, t, d):
    """S38: Saudi Arabia: no fields in 1984, circles everywhere by 2011 (schematic, not traced from images)."""
    k = 0.0 if t < d * 0.4 else 1.0
    L, (x0, y0, cell) = _fields_layer(t, years_k=None, grow=(d * 0.45, d * 0.85), big=False)
    if k == 0:
        L, dr = layer()
        dr.rectangle([0, 0, W, H], fill=(226, 200, 150, 255))
    put(img, L, 1.0)
    label(img, (W / 2, 120), "ワディ・アッシルハン　" + ("1984年" if k == 0 else "2011年"), 1.0, 56)


# ---------------------------------------------------------------- the edit
def si(sc, sub):
    for i, s in enumerate(R.SC[sc]["sentences"]):
        if sub in s["text"]:
            return i
    raise KeyError((sc, sub))


def MAPV(v, **k):
    return dict(v, move=False, **k)


def shots():
    S = []

    def add(sc, w, kind, at=None, **P):
        if at is not None:
            P["sent"] = si(sc, at)
        S.append((sc, w, kind, P))
    # 第1章
    add("S01", 8, "diag", fn=d_fields(), why="緑の丸が並ぶ（自作の模式図）")
    add("S01", 8, "diag", at="一つの丸の直径は", fn=d_fields(grow=None, diam=True), why="直径800m・1,600m")
    add("S02", 6, "map", **MAPV(USA), layers=[L_tint(-104, -97, AM, 0.3, 0.16), L_text(-100.5, 47.5, "グレートプレーンズ", 0.6, 48, AM)], why="大平原（位置は概略）")
    add("S02", 5, "diag", at="グレートプレーンズと呼ばれる", fn=d_big("444郡 / 484郡", "大平原の郡のうち　都市圏の外"), why="ほとんどが都市圏の外")
    add("S02", 6, "card", at="人は少ないのに", kicker="今日の問い", title="なぜ丸い畑だらけ？", why="問い")
    add("S02", 7, "diag", at="答えを追っていくと", fn=d_three("答えをたどると", [("一本の線", "地図の上"), ("碁盤の目", "開拓"), ("地下の水", "日本より広い"), ("砂漠の丸", "遠い国")]), why="予告")
    add("S03", 7, "diag", fn=d_compare("大平原の人口", ("1950年", "490万人", ""), ("2007年", "990万人", "")), why="人口は倍")
    add("S03", 6, "diag", at="都市圏に住む人の割合は", fn=d_bars("都市圏に住む人の割合", [("1950年", 39), ("2007年", 68)], "%"), why="都市へ")
    add("S03", 7, "diag", at="カンザス州の大平原の", fn=d_big("46 / 58郡", "カンザス州の大平原で人口が減った郡（1950→2007年）"), why="カンザス")
    add("S04", 8, "map", **MAPV(KANSAS), layers=[L_kansas(0.1), dots(["ガーデンシティ"], 0.4), L_text(-98.3, 40.4, "カンザス州", 0.2, 56)], why="ガーデンシティ")
    add("S04", 6, "diag", at="町を出ると", fn=d_fields(grow=(0.2, 2.0)), why="平らな畑と丸")
    add("S05", 14, "diag", fn=d_years, why="1972→2015 四角から丸へ（模式図）")
    # 第2章
    add("S06", 4, "card", kicker="第2章", title="丸の正体", why="章の扉")
    add("S06", 10, "diag", fn=d_pivot_top, why="井戸と回る管")
    add("S06", 6, "diag", at="管は", fn=d_pivot_side, why="車輪の塔")
    add("S07", 6, "diag", fn=d_pivot_side, why="電動機で車輪を回す")
    add("S07", 6, "diag", at="一番外側の塔が", fn=d_big("1時間に 約110〜170m", "いちばん外側の塔の速さ"), why="速さ")
    add("S07", 6, "diag", at="直径八百メートルの丸なら", fn=d_big("半日〜1日", "直径800mの丸を一周"), why="一周の時間（計算）")
    add("S08", 8, "diag", fn=d_pivot_top, why="センターピボット")
    add("S08", 4, "diag", at="空から見える", fn=d_fields(grow=None), why="水をまいた跡")
    add("S09", 14, "diag", fn=d_square, why="四隅が残る")
    add("S09", 6, "diag", at="地面に水を流すやり方より", fn=d_compare("丸い畑が選ばれた理由", ("地面に水を流す", "量の調整が難しい", ""), ("センターピボット", "水と肥料を細かく", "")), why="選ばれた理由")
    add("S10", 6, "diag", fn=d_year("1952年", "特許", "フランク・ザイバック「自分で進む散水の機械」"), why="特許")
    add("S10", 6, "diag", at="一九五〇年代の半ばに", fn=d_bars("センターピボットの生産", [("最初の年", 5), ("1960年", 50)], "台"), why="5台→50台")
    add("S11", 8, "diag", fn=d_timeline("広がるまで", [("1969年", "特許が切れる"), ("1972年", "ガーデンシティ\nまだ四角"), ("2015年", "丸が\n置き換わる")]), why="特許切れ")
    add("S12", 6, "map", **MAPV(PLAINS), layers=[L_states(0.2, 0.0, ["ネブラスカ", "カンザス"], 52)], why="ネブラスカ")
    add("S12", 7, "diag", at="ネブラスカの水をまく畑は", fn=d_three("ネブラスカ", [("約910万", "エーカー\n水をまく畑　全米1位"), ("約85%", "センターピボット")]), why="85%")
    # 第3章
    add("S13", 4, "card", kicker="第3章", title="雨が足りない", why="章の扉")
    add("S13", 6, "diag", at="答えは", fn=d_big("雨が足りない", "大平原"), why="答え")
    add("S14", 7, "map", **MAPV(USA), layers=[L_meridian(-100, 0.3, RE, "西経100度")], why="西経100度の線")
    add("S14", 9, "map", at="一八七八年", **MAPV(USA), layers=[L_meridian(-100, 0.0, RE, "西経100度"), L_tint(-125, -100, AM, 0.2, 0.14, (30, 49)),
                                                       L_text(-111, 44.5, "年の雨 約500mm未満", 1.0, 48, RE)], why="パウエルの報告")
    add("S15", 8, "diag", fn=d_bars("1年の雨", [("ガーデンシティ", 497), ("日本の平均", 1700)], "mm"), why="約3分の1")
    add("S16", 8, "diag", fn=d_bars("一作で使う水と1年の雨", [("とうもろこし（一作）", 580), ("ガーデンシティの雨（1年）", 497)], "mm"), why="雨だけでは足りない")
    add("S16", 8, "diag", at="一番水を飲む時期には", fn=d_compare("1日あたり", ("とうもろこし（多い時期）", "約9mm", ""), ("ガーデンシティの雨", "約1.4mm", "")), why="6倍以上")
    add("S17", 9, "map", **MAPV(USA), layers=[L_meridian(-100, 0.0, RE), L_text(-93.5, 41.0, "東：とうもろこし 7割", 0.4, 44, TE), L_text(-108, 41.0, "西：小麦が中心", 1.0, 44, AM)], why="東と西")
    add("S18", 10, "map", **MAPV(USA), layers=[L_meridian(-100, 0.0, (150, 150, 150)), L_meridian(-98, 0.6, RE, "約225km 東へ")], why="境が東へ")
    add("S19", 13, "diag", fn=d_grid, why="1785年の碁盤")
    add("S20", 12, "diag", fn=d_sizes, why="丸の大きさ＝区画の大きさ")
    add("S21", 6, "diag", fn=d_year("1862年", "ホームステッド法", "160エーカーずつ、住んで耕す人へ"), why="ホームステッド法")
    add("S21", 6, "diag", at="約六十五ヘクタール", fn=d_big("約65ha", "東京ドームの建物　約14個分"), why="広さ")
    add("S21", 5, "diag", at="この法律で", fn=d_big("約1割", "人の手に渡った土地　アメリカの面積の"), why="約1割")
    add("S22", 7, "diag", fn=d_year("1935年4月14日", "黒い日曜日", "大きな砂嵐が中央の大平原をのみこむ"), why="黒い日曜日")
    add("S22", 7, "map", at="砂嵐は午前中に", **MAPV(USA), layers=[L_states(0.0, 0.0, ["ネブラスカ", "カンザス", "テキサス"], 40), L_text(-92.0, 34.0, "↓ 約1,300km 南へ", 0.6, 48, RE)], why="南へ進む")
    add("S22", 5, "diag", at="この年の四月", fn=d_big("14日", "濃い砂ぼこりの日　1935年4月　ダッジシティ"), why="14日")
    add("S23", 8, "diag", fn=d_section(), why="足元の水")
    # 第4章
    add("S24", 4, "card", kicker="第4章", title="足元の巨大な水", why="章の扉")
    add("S24", 8, "map", **MAPV(PLAINS), layers=[L_states(0.2, 0.3)], why="8つの州")
    add("S24", 8, "map", at="広さは", **MAPV(USA), layers=[L_states(0.0, 0.0, size=26), L_japan((-101.0, 38.5), 0.5), L_text(-100.0, 47.8, "約45万km²", 0.3, 48, AM)], why="日本の約1.2倍")
    add("S25", 6, "diag", fn=d_big("湖ではない", "地下の水の層"), why="湖ではない")
    add("S25", 10, "diag", at="この層は", fn=d_section(zoom=True), why="粒のすき間")
    add("S25", 5, "diag", at="ガーデンシティでくみ上げる", fn=d_big("氷河期の水も", "ガーデンシティでくみ上げる水"), why="氷河期")
    add("S26", 10, "diag", fn=d_section(thick=True), why="厚さ")
    add("S27", 6, "diag", fn=d_big("約3割", "アメリカで畑に使う地下水のうち　この層から"), why="約3割")
    add("S27", 7, "diag", at="一九四九年から", fn=d_bars("1年にくみ上げる水", [("1949年", 49), ("1974年", 234)], "億m³"), why="約4.8倍")
    add("S28", 8, "diag", fn=d_three("丸い畑で育つもの", [("とうもろこし", ""), ("小麦", ""), ("ソルガム", "きびの仲間")]), why="作物")
    add("S29", 8, "map", **MAPV(KANSAS), layers=[L_kansas(0.0), dots(["ガーデンシティ", "ホルコム", "ダッジシティ", "リベラル"], 0.3, 0.4)], why="牛肉の町")
    add("S29", 4, "diag", at="一九八〇年", fn=d_year("1980年", "ホルコム", "当時世界最大の牛肉の工場"), why="1980")
    add("S30", 8, "diag", fn=d_bars("日本のとうもろこしの輸入（2023年）", [("アメリカ", 46), ("ブラジル", 45)], "%"), why="米国46%")
    add("S30", 7, "diag", at="小麦は二〇二四年", fn=d_bars("日本の小麦の輸入（2024年）", [("アメリカ", 211), ("カナダ", 201), ("オーストラリア", 109)], "万トン"), why="小麦")
    # 第5章
    add("S31", 4, "card", kicker="第5章", title="減っていく水", why="章の扉")
    add("S31", 10, "diag", at="くみ上げが始まる前の", fn=d_biwa, why="琵琶湖約13杯")
    add("S31", 8, "diag", at="日本で、一年に", fn=d_compare("比べると", ("減った水", "約3,500億m³", ""), ("日本の農業の水（1年）", "約530億m³", "")), why="約7年分")
    add("S31", 5, "diag", at="日本の農業の水のうち", fn=d_big("約5%", "日本の農業の水のうち　地下水"), why="日本は5%")
    add("S32", 12, "diag", fn=d_section(drop=True), why="最大約81m")
    add("S32", 5, "diag", at="層全体の平均では", fn=d_big("約5m", "層全体の平均の低下"), why="平均5m")
    add("S33", 9, "diag", fn=d_bars("取り出せる水の変化", [("1950年ごろ→2019年", 3530), ("2017→2019年（増えた分）", 20)], "億m³"), why="戻るのは1%未満")
    add("S34", 10, "diag", fn=d_rain, why="約2%")
    add("S34", 6, "diag", at="地下に届く水の九十五", fn=d_compare("地下に届く水の入り口", ("プラヤ（くぼ地）", "95%", "面積の5%"), ("それ以外", "5%", "面積の95%")), why="プラヤ")
    add("S35", 8, "map", **MAPV(KANSAS), layers=[L_kansas(0.0), L_tint(-102.05, -99.5, RE, 0.4, 0.18, (37.0, 40.0)), L_text(-98.3, 40.4, "西カンザス：25年未満の地域が多い（2000年の地図）", 0.8, 40, RE)], why="KGS（範囲は概略）")
    add("S36", 7, "diag", fn=d_big("節水型でも", "層は少しずつ干上がる"), why="節水しても")
    add("S37", 7, "map", **MAPV(KANSAS), layers=[L_kansas(0.0), dots(["シェリダン郡"], 0.3)], why="シェリダン郡")
    add("S37", 7, "diag", at="二〇一三年", fn=d_compare("くみ上げる水", ("計画（2013年）", "−20%", ""), ("4年後", "−35%", "")), why="−35%")
    add("S37", 7, "diag", at="地下の水面の下がり方は", fn=d_compare("水面の下がり方（1年あたり）", ("2002〜2012年", "約60cm", ""), ("2013〜2022年", "約15cm", "")), why="60cm→15cm")
    # 第6章
    add("S38", 4, "card", kicker="第6章", title="砂漠の丸", why="章の扉")
    add("S38", 6, "globe", lon=(262, 403), lat=(38, 27), r=(460, 520), cy=560, why="地球の反対側へ")
    add("S38", 10, "diag", at="一九八四年の", fn=d_sand, why="1984→2011（模式図）")
    add("S39", 8, "diag", fn=d_big("約2万年前の水", "サウジアラビアの井戸がくむ水"), why="化石水")
    add("S39", 6, "diag", at="雨は一年に", fn=d_bars("1年の雨", [("サウジアラビア（100〜200）", 200), ("ガーデンシティ", 497), ("日本の平均", 1700)], "mm"), why="雨100〜200mm（棒は上限）")
    add("S40", 7, "diag", fn=d_bars("砂漠の農業の水", [("1980年", 68), ("2006年", 210)], "億m³"), why="約3倍")
    add("S40", 8, "diag", at="二〇〇八年", fn=d_timeline("サウジアラビアの小麦", [("2008年", "補助金をやめる"), ("2016年", "栽培をやめる\n方針の期限"), ("2018年", "支援を再開")]), why="小麦")
    add("S40", 6, "diag", at="地下の古い水の量は", fn=d_compare("地下の古い水", ("見積もり", "252〜870km³", ""), ("くみ上げが割に合う", "約50年", "")), why="見積もり")
    # 第7章
    add("S41", 6, "diag", fn=d_fields(grow=None), why="冒頭に戻る")
    add("S41", 10, "diag", at="西経百度の線の西は", fn=d_three("丸い畑ができるまで", [("雨が足りない", "西経100度の西"), ("四角い区画", "開拓の碁盤"), ("回る機械", "井戸が中心"), ("地下の水", "日本より広い層")]), why="まとめ")
    add("S42", 8, "diag", fn=d_pivot_top, why="真ん中に井戸")
    add("S42", 6, "diag", at="その水は", fn=d_biwa, why="琵琶湖13杯")
    add("S42", 3, "diag", fn=d_biwa, why="琵琶湖13杯（続き）")
    add("S42", 6, "card", title="地球の事情", sub="地理・歴史・経済で、世界を読み解く", foot="音声：VOICEVOX:雀松朱司", why="締め")
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
        (EP / "shotlist.md").write_text("# カット表（render/render.py から自動生成）\n\n見た目はカナダ・バミューダと同じ（丸ゴシック字幕・明るい背景）。画面の注釈は出さない（社長 2026-11-12）。地図と地球儀の下地は Natural Earth 1:10m（パブリックドメイン）。陰影図 shadedrelief.jpg は使わない。丸い畑・機械・断面は自作の模式図（衛星画像・航空写真は使わない）。\n\n" + R.shotlist_md())
        return
    if a.still:
        for t in a.still:
            Image.fromarray(V4.frame(t)).save(OUT / f"still_{t:07.2f}.jpg", quality=88)
        return
    n = int(math.ceil(R.TOTAL / 10.0))
    if a.chunks:
        i, m = map(int, a.chunks.split("/"))
        for c in range(i - 1, n, m):
            dst = OUT / f"c10_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"c10_{c:03d}.tmp.mp4"
            V4.render(c * 10.0, min(R.TOTAL, (c + 1) * 10.0), tmp)
            tmp.rename(dst)
        return
    if a.mux:
        parts = sorted(OUT.glob("c10_[0-9][0-9][0-9].mp4"))
        assert len(parts) == n, len(parts)
        (OUT / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts.txt"),
                        "-i", str(OUT / "mix.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-15:TP=-1.5:LRA=11",
                        "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT / "chizu-010-us-pivot-circles_full.mp4")], check=True)


if __name__ == "__main__":
    main()
