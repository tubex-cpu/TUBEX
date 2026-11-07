"""v2 render of chizu-001-australia-coast (1920x1080, 30 fps). v1 (render.py, 24 fps) is kept unchanged. Free and local (numpy, OpenCV, Pillow, ffmpeg).

Usage: python3 render.py [--from SEC --to SEC] [--still SEC ...] [--part N/M] [--mux]
- Shots follow storyboard_v1.md, retimed to the real narration (../audio/timings.json).
- Photos: ../assets/*.jpg with credits from ../06c_assets.md (credit text is set in SHOT definitions below).
"""
import argparse, json, math, subprocess, sys
from pathlib import Path
import numpy as np, cv2
from PIL import Image, ImageDraw
import geo, base
from draw import (W, H, NAVY, INK, AMBER, TEAL, RED, MUTED, text, text_w, wrap, panel, ease, seg, font)

HERE = Path(__file__).resolve().parent
EP = HERE.parent
FPS = 30
TIM = json.loads((EP / "audio/timings.json").read_text())
SC = {s["scene"]: s for s in TIM["scenes"]}
TOTAL = TIM["scenes"][-1]["end"] + 2.5
OUT = HERE / "out"; OUT.mkdir(exist_ok=True)
CREDITS = json.loads((HERE / "credits.json").read_text()) if (HERE / "credits.json").exists() else {}

CITIES = {  # lon, lat (city centre)
    "シドニー": (151.21, -33.87), "メルボルン": (144.96, -37.81), "ブリスベン": (153.03, -27.47),
    "パース": (115.86, -31.95), "アデレード": (138.60, -34.93), "キャンベラ": (149.13, -35.28),
}
FIVE = ["シドニー", "メルボルン", "ブリスベン", "アデレード", "パース"]
POP = [("シドニー", 564), ("メルボルン", 544), ("ブリスベン", 283), ("パース", 245), ("アデレード", 149)]
AUS = (134.0, -27.5)

_LAND = None; _SUB = None; _CTRY = None


def land():
    global _LAND
    if _LAND is None:
        _LAND = geo.land10()
    return _LAND


def subunits():
    global _SUB
    if _SUB is None:
        _SUB = geo.subunits50()
    return _SUB


def country(name):
    global _CTRY
    if _CTRY is None:
        _CTRY = {n: p for _, n, p in geo.countries10()}
    return _CTRY[name]


def nsw():
    for gid, _, polys in subunits():
        if gid == "NS":
            lon = np.concatenate([r[:, 0] for p in polys for r in p])
            if lon.mean() > 140:
                return polys


# ---------------------------------------------------------------- overlays
def dots(img, p, names, t0=0.0, t=1.0, labels=True, color=AMBER, r=13, stagger=0.25, size=38, side=None, only=None):
    d = ImageDraw.Draw(img)
    side = side or {"パース": "l", "アデレード": "l", "メルボルン": "r", "シドニー": "r", "ブリスベン": "r", "キャンベラ": "l"}
    for i, n in enumerate(names):
        a = seg(t, t0 + i * stagger, t0 + i * stagger + 0.35)
        if a <= 0:
            continue
        lon, lat = CITIES[n]
        res = p(lon, lat)
        x, y = res[0], res[1]
        if len(res) == 3 and not res[2]:
            continue
        rr = r * (0.6 + 0.4 * a)
        glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(glow).ellipse((x - rr * 2.4, y - rr * 2.4, x + rr * 2.4, y + rr * 2.4), fill=color + (int(70 * a),))
        img.alpha_composite(glow)
        d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=color + (255,), outline=(255, 255, 255, 255), width=3)
        if labels:
            s = side.get(n, "r")
            if s == "r":
                text(img, (x + rr + 14, y), n, size, anchor="lm", alpha=a)
            elif s == "l":
                text(img, (x - rr - 14, y), n, size, anchor="rm", alpha=a)
            else:
                text(img, (x, y + rr + 10), n, size, anchor="ma", alpha=a)


def polyline(img, pts, color, width=4, alpha=1.0, closed=False, fill=None):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    pts = [tuple(map(float, q)) for q in pts]
    if fill:
        d.polygon(pts, fill=fill[:3] + (int(fill[3] * alpha),))
    if width:
        d.line(pts + ([pts[0]] if closed else []), fill=color + (int(255 * alpha),), width=width, joint="curve")
    img.alpha_composite(layer)


def draw_polys(img, p, polys, color=(255, 255, 255), width=3, alpha=1.0, fill=None):
    for poly in polys:
        ring = poly[0]
        x, y = p(ring[:, 0], ring[:, 1])[:2]
        polyline(img, list(zip(x, y)), color, width, alpha, closed=True, fill=fill)


def coast(img, p, region=(105, 160, -48, -8), color=(255, 255, 255), alpha=0.35, width=2):
    for _, _, polys in land():
        for poly in polys:
            r = poly[0]
            if r[:, 0].max() < region[0] or r[:, 0].min() > region[1] or r[:, 1].max() < region[2] or r[:, 1].min() > region[3]:
                continue
            if len(r) < 20:
                continue
            x, y = p(r[:, 0], r[:, 1])[:2]
            polyline(img, list(zip(x, y)), color, width, alpha, closed=True)


def arrow(img, a, b, color=AMBER, width=8, alpha=1.0, prog=1.0, head=26):
    ax, ay = a; bx, by = b
    bx, by = ax + (bx - ax) * prog, ay + (by - ay) * prog
    polyline(img, [(ax, ay), (bx, by)], color, width, alpha)
    ang = math.atan2(by - ay, bx - ax)
    pts = [(bx, by), (bx - head * math.cos(ang - 0.45), by - head * math.sin(ang - 0.45)),
           (bx - head * math.cos(ang + 0.45), by - head * math.sin(ang + 0.45))]
    polyline(img, pts, color, 0, alpha, fill=color + (255,))


def caption_box(img, s, a=1.0, y=170, size=46, x=80, color=INK):
    if a <= 0:
        return
    w = text_w(s, size) + 60
    panel(img, (x - 30, y - 18, x - 30 + w, y + size + 22), alpha=0.62 * a)
    text(img, (x, y), s, size, fill=color, alpha=a, stroke=3)


def note(img, s, a=1.0):
    text(img, (W - 40, 40), s, 22, fill=MUTED, anchor="ra", weight="500Medium", stroke=2, alpha=a, shadow=False)


def ai_label(img):
    pass


# ---------------------------------------------------------------- shot renderers
def r_globe(t, d, P):
    lon0 = P["lon"][0] + (P["lon"][1] - P["lon"][0]) * ease(t / d)
    lat0 = P["lat"][0] + (P["lat"][1] - P["lat"][0]) * ease(t / d)
    rad = P["r"][0] + (P["r"][1] - P["r"][0]) * ease(t / d)
    cy = P.get("cy", 560)
    img = Image.fromarray(base.globe(W, H, lon0, lat0, rad, W / 2, cy)).convert("RGBA")
    p = base.globe_proj(lon0, lat0, rad, W / 2, cy)
    if P.get("band"):
        a = seg(t, 0.5, 2.0)
        layer = Image.new("RGBA", img.size, (0, 0, 0, 0)); dd = ImageDraw.Draw(layer)
        for lat1, lat2 in P["band"]:
            lons = np.linspace(lon0 - 89, lon0 + 89, 120)
            top = [p(l, lat2) for l in lons]; bot = [p(l, lat1) for l in lons[::-1]]
            pts = [(q[0], q[1]) for q in top + bot if q[2]]
            if len(pts) > 3:
                dd.polygon(pts, fill=(255, 150, 60, int(90 * a)))
        img.alpha_composite(layer)
        if a > 0:
            lx, ly, _ = p(lon0 + 38, -31)
            text(img, (lx, ly), "亜熱帯高圧帯", 44, fill=AMBER, anchor="mm", alpha=a)
    if P.get("dots"):
        dots(img, p, P["dots"], t0=P.get("dots_t", 0.6), t=t, labels=P.get("labels", True), size=36)
    return img


def r_map(t, d, P):
    k = ease(t / d) if P.get("move", True) else 0
    lv = lambda key: P[key][0] + (P[key][1] - P[key][0]) * k if isinstance(P[key], (list, tuple)) else P[key]
    lon0, lat0, kmpp = lv("lon"), lv("lat"), lv("kmpp")
    if kmpp < 1.0:
        img = vector_map(lon0, lat0, kmpp)
    else:
        img = Image.fromarray(base.flatmap(W, H, lon0, lat0, kmpp)).convert("RGBA")
    dim = P.get("dim", 0.0)
    if dim:
        img.alpha_composite(Image.new("RGBA", img.size, (0, 0, 0, int(255 * dim))))
    p = base.map_proj(W, H, lon0, lat0, kmpp)
    for fn in P.get("layers", []):
        fn(img, p, t, d)
    return img


def vector_map(lon0, lat0, kmpp, ss=2):
    im = Image.new("RGB", (W * ss, H * ss), (16, 44, 80)); d = ImageDraw.Draw(im)
    for _, _, polys in land():
        for poly in polys:
            r = poly[0]
            if not (140 < r[:, 0].mean() < 160 or len(r) > 5000):
                continue
            x, y = geo.laea(r[:, 0], r[:, 1], lon0, lat0)
            d.polygon(list(zip((W / 2 + x / kmpp) * ss, (H / 2 - y / kmpp) * ss)), fill=(122, 112, 86))
    im = im.resize((W, H), Image.LANCZOS)
    note_img = im.convert("RGBA")
    note(note_img, "地図：Natural Earth（1:1000万）")
    return note_img


def r_photo(t, d, P):
    key = P["file"]
    if key not in _PH:
        path = EP / "assets" / key
        im = cv2.cvtColor(cv2.imread(str(path)), cv2.COLOR_BGR2RGB) if path.exists() else None
        _PH[key] = im
    im = _PH[key]
    if im is None:
        img = Image.new("RGBA", (W, H), (30, 30, 40, 255))
        text(img, (W / 2, H / 2), f"［素材なし：{key}］", 48, anchor="mm", fill=RED)
        return img
    h0, w0 = im.shape[:2]
    z0, z1 = P.get("zoom", (1.0, 1.08))
    z = z0 + (z1 - z0) * (t / d)
    fx, fy = P.get("focus", (0.5, 0.5))
    s = max(W / w0, H / h0) * z
    cw, ch = W / s, H / s
    x0 = min(max(fx * w0 - cw / 2, 0), w0 - cw); y0 = min(max(fy * h0 - ch / 2, 0), h0 - ch)
    M = np.float32([[s, 0, -x0 * s], [0, s, -y0 * s]])
    fr = cv2.warpAffine(im, M, (W, H), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_LINEAR)
    img = Image.fromarray(fr).convert("RGBA")
    # soft vignette for legibility
    img.alpha_composite(_VIG)
    if P.get("label"):
        caption_box(img, P["label"], seg(t, 0.2, 0.8), y=P.get("label_y", 150))
    cr = CREDITS.get(key)
    if cr:
        text(img, (W - 40, 40), cr, 22, fill=(235, 238, 244), anchor="ra", weight="500Medium", stroke=3, shadow=False)
    return img


_PH = {}
_v = np.zeros((H, W, 4), np.uint8)
yy = np.linspace(0, 1, H)[:, None]
_v[..., 3] = (np.clip((yy - 0.62) / 0.38, 0, 1) ** 1.6 * 150 + np.clip((0.2 - yy) / 0.2, 0, 1) * 90).astype(np.uint8)
_VIG = Image.fromarray(_v)
_s = np.zeros((H, W, 4), np.uint8)
_s[..., 3] = (np.clip((yy - 0.80) / 0.20, 0, 1) ** 1.3 * 130).astype(np.uint8)
_SUBBG = Image.fromarray(_s)


def r_card(t, d, P):
    img = Image.new("RGBA", (W, H), NAVY + (255,))
    g = Image.fromarray(base.space(W, H).astype(np.uint8)).convert("RGBA")
    img.alpha_composite(g)
    a = seg(t, 0.1, 0.7)
    if P.get("kicker"):
        text(img, (W / 2, H / 2 - 90), P["kicker"], 44, fill=AMBER, anchor="mm", alpha=a)
    text(img, (W / 2, H / 2 + 10), P["title"], 92, anchor="mm", alpha=a, stroke=5)
    if P.get("sub"):
        text(img, (W / 2, H / 2 + 120), P["sub"], 40, fill=MUTED, anchor="mm", alpha=seg(t, 0.5, 1.1), weight="500Medium")
    return img


def r_diag(t, d, P):
    img = Image.new("RGBA", (W, H), NAVY + (255,))
    img.alpha_composite(Image.fromarray(base.space(W, H).astype(np.uint8)).convert("RGBA"))
    P["fn"](img, t + P.get("t_off", 0.0), d + P.get("t_off", 0.0))
    return img


# ---------------------------------------------------------------- diagrams
def d_bars(n_show):
    def fn(img, t, d):
        text(img, (160, 170), "都市圏の人口（2025年6月末の推計）", 50)
        x0, y0, bw, gap = 420, 280, 1180, 120
        for i, (n, v) in enumerate(POP):
            if i >= n_show[1]:
                break
            st = 0 if i < n_show[0] else (i - n_show[0]) * 0.6 + 0.3
            a = seg(t, st, st + 1.0)
            y = y0 + i * gap
            text(img, (x0 - 30, y + 34), n, 48, anchor="rm", alpha=max(a, 0.0001) if i >= n_show[0] else 1)
            L = bw * v / 600 * (a if i >= n_show[0] else 1)
            ImageDraw.Draw(img).rounded_rectangle((x0, y + 6, x0 + max(L, 4), y + 64), radius=10, fill=(AMBER if i < 2 else TEAL) + (255,))
            if (a if i >= n_show[0] else 1) > 0.6:
                text(img, (x0 + L + 20, y + 34), f"約{v}万人", 44, anchor="lm")
        note(img, "オーストラリア統計局（ABS）・大都市統計圏（GCCSA）")
    return fn


def d_three(img, t, d, labels=(("水", "雨と気候"), ("港", "船と真水"), ("仕事", "人と仕事")), title="三つの理由"):
    text(img, (W / 2, 190), title, 60, anchor="mm")
    cols = [TEAL, AMBER, (150, 170, 255)]
    for i, (a_, b_) in enumerate(labels):
        a = 1.0 if i == 0 else seg(t, 0.15 + i * 0.6, 0.6 + i * 0.6)
        cx = W / 2 + (i - 1) * 520
        y = 330 + (1 - a) * 40
        panel(img, (cx - 220, y, cx + 220, y + 400), fill=(16, 28, 50), alpha=0.9 * a, outline=cols[i] if a > 0.5 else None)
        text(img, (cx, y + 70), f"理由{i + 1}", 36, fill=cols[i], anchor="mm", alpha=a)
        fs = min(110, int(360 / max(1, len(a_))))
        text(img, (cx, y + 190), a_, fs, anchor="mm", alpha=a, stroke=5)
        text(img, (cx, y + 320), b_, 42, fill=MUTED, anchor="mm", alpha=a, weight="500Medium")


def d_water(img, t, d):
    text(img, (W / 2, 170), "街を支えるのは、水", 60, anchor="mm", alpha=seg(t, 0, 0.5))
    items = [("飲み水", "毎日の暮らし"), ("畑・牧場", "食料をつくる"), ("工場", "働く場所")]
    cx0, cy = W / 2, 560
    dd = ImageDraw.Draw(img)
    a0 = seg(t, 0.2, 0.8)
    dd.ellipse((cx0 - 110, 300 - 110 + 40, cx0 + 110, 300 + 110 + 40), fill=(40, 120, 200, int(255 * a0)), outline=(160, 210, 255, int(255 * a0)), width=5)
    text(img, (cx0, 340), "水", 90, anchor="mm", alpha=a0)
    for i, (a_, b_) in enumerate(items):
        a = seg(t, 1.0 + i * 0.9, 1.6 + i * 0.9)
        x = cx0 + (i - 1) * 560
        arrow(img, (cx0, 470), (x, 560), color=(120, 190, 255), width=7, alpha=a, prog=a)
        panel(img, (x - 200, 570, x + 200, 740), fill=(16, 28, 50), alpha=0.9 * a)
        text(img, (x, 630), a_, 56, anchor="mm", alpha=a)
        text(img, (x, 700), b_, 36, fill=MUTED, anchor="mm", alpha=a, weight="500Medium")
    text(img, (W / 2, 820), "広い土地 ＝ 大勢を支えられる、ではない", 44, fill=AMBER, anchor="mm", alpha=seg(t, d * 0.65, d * 0.75))


def d_hadley(img, t, d):
    text(img, (W / 2, 140), "空気が下がると、雨が減る", 60, anchor="mm", alpha=seg(t, 0, 0.5))
    dd = ImageDraw.Draw(img)
    # ground line from equator (left) to 40S (right)
    gx0, gx1, gy = 260, 1660, 740
    dd.line((gx0, gy, gx1, gy), fill=(200, 200, 210, 255), width=4)
    for x, s in [(gx0, "赤道"), (gx0 + (gx1 - gx0) * 0.75, "南緯30度付近"), (gx1, "南緯40度")]:
        text(img, (x, gy + 50), s, 36, anchor="ma", fill=MUTED, weight="500Medium")
    top = 300
    xr = gx0 + (gx1 - gx0) * 0.75
    a1, a2, a3 = seg(t, 0.4, 2.2), seg(t, 2.0, 4.0), seg(t, 3.8, 6.0)
    arrow(img, (gx0 + 60, gy - 40), (gx0 + 60, top + 30), color=(255, 120, 90), width=12, prog=a1, alpha=min(1, a1 * 3))
    if a1 > 0.2:
        text(img, (gx0 + 100, gy - 220), "温められて上昇", 40, anchor="lm", alpha=a1)
    arrow(img, (gx0 + 90, top), (xr - 30, top), color=(220, 220, 230), width=10, prog=a2, alpha=min(1, a2 * 3))
    if a2 > 0.2:
        text(img, ((gx0 + xr) / 2, top - 50), "上空を流れる", 40, anchor="mm", alpha=a2)
    arrow(img, (xr, top + 30), (xr, gy - 40), color=(255, 190, 90), width=12, prog=a3, alpha=min(1, a3 * 3))
    if a3 > 0.3:
        text(img, (xr - 40, (top + gy) / 2), "乾いた空気が下降", 40, anchor="rm", alpha=a3)
    a4 = seg(t, 6.0, 7.5)
    if a4 > 0:
        dd.ellipse((xr - 70, gy - 190, xr + 70, gy - 50), outline=(255, 190, 90, int(255 * a4)), width=6)
        text(img, (xr, gy - 120), "高", 70, anchor="mm", fill=AMBER, alpha=a4)
        text(img, (xr + 110, gy - 140), "高気圧", 44, anchor="lm", alpha=a4, fill=AMBER)
        text(img, (xr + 110, gy - 80), "雲ができにくい", 38, anchor="lm", alpha=a4, weight="500Medium")
    a5 = seg(t, 12.3, 13.3)
    if a5 > 0:
        cx5, cy5 = xr + 220, gy - 360
        dd.ellipse((cx5 - 90, cy5 - 35, cx5 + 90, cy5 + 35), fill=(200, 205, 215, int(200 * a5)))
        dd.line((cx5 - 80, cy5 - 45, cx5 + 80, cy5 + 45), fill=(255, 90, 90, int(255 * a5)), width=8)
        dd.line((cx5 - 80, cy5 + 45, cx5 + 80, cy5 - 45), fill=(255, 90, 90, int(255 * a5)), width=8)
        text(img, (cx5, cy5 + 80), "雨が降りにくい", 42, anchor="mm", fill=(255, 170, 170), alpha=a5)
    note(img, "仕組みを示す模式図（気象局 BOM「Subtropical ridge」による）")


def d_coast_section(img, t, d):
    text(img, (W / 2, 140), "東の海岸：海の空気と山地", 60, anchor="mm", alpha=seg(t, 0, 0.5))
    dd = ImageDraw.Draw(img)
    gy = 780
    dd.rectangle((1180, gy, W, H), fill=(20, 70, 130, 255))
    text(img, (1560, gy + 70), "太平洋", 44, anchor="mm", fill=(170, 210, 250))
    mt = [(200, gy), (520, gy - 40), (820, gy - 330), (930, gy - 360), (1040, gy - 260), (1180, gy)]
    dd.polygon(mt + [(1180, H), (200, H)], fill=(90, 110, 80, 255))
    dd.rectangle((0, gy, 200, H), fill=(150, 120, 80, 255))
    text(img, (300, gy + 70), "内陸", 44, anchor="mm")
    text(img, (900, gy - 200), "山地", 44, anchor="mm")
    a = seg(t, 0.8, 3.0)
    arrow(img, (1700, gy - 160), (1100, gy - 300), color=(150, 210, 255), width=12, prog=a, alpha=min(1, a * 3))
    if a > 0.4:
        text(img, (1500, gy - 300), "湿った空気", 42, anchor="mm", alpha=a)
    b = seg(t, 3.0, 4.5)
    if b > 0:
        dd.ellipse((980, gy - 600, 1300, gy - 480), fill=(220, 225, 235, int(230 * b)))
        for i in range(12):
            x = 1010 + i * 24; y = gy - 470 + (i % 3) * 16
            dd.line((x, y, x - 12, y + 60), fill=(150, 200, 255, int(255 * b)), width=4)
        text(img, (1330, gy - 540), "雨が降る", 46, anchor="lm", alpha=b)
    c2 = seg(t, 6.2, 7.0)
    if c2 > 0:
        panel(img, (150, 230, 760, 330), alpha=0.8 * c2)
        text(img, (180, 280), "場所ごとに、雨と気温が違う", 42, anchor="lm", alpha=c2)
    c3 = seg(t, 9.6, 10.4)
    if c3 > 0:
        panel(img, (150, 350, 760, 450), alpha=0.8 * c3, outline=AMBER)
        text(img, (180, 400), "→ 都市の分布の土台", 42, anchor="lm", alpha=c3, fill=AMBER)
    note(img, "仕組みを示す模式図（気象局 BOM「Australian climate zones」による）")


def d_needs(img, t, d):
    text(img, (W / 2, 200), "船団に必要だった、二つのもの", 60, anchor="mm", alpha=seg(t, 0, 0.5))
    for i, (a_, b_, c) in enumerate([("安全な湾", "船を泊められる", TEAL), ("真水", "すぐに使える", (120, 190, 255))]):
        a = seg(t, 0.6 + i * 1.2, 1.3 + i * 1.2)
        x = W / 2 + (i - 0.5) * 640
        panel(img, (x - 260, 360, x + 260, 760), fill=(16, 28, 50), alpha=0.9 * a, outline=c)
        text(img, (x, 500), a_, 96, anchor="mm", alpha=a, stroke=5)
        text(img, (x, 640), b_, 44, fill=MUTED, anchor="mm", alpha=a, weight="500Medium")
    text(img, (W / 2, 560), "＋", 90, anchor="mm", alpha=seg(t, 1.8, 2.3), fill=AMBER)


def d_timeline(img, t, d):
    text(img, (W / 2, 190), "それ以前から続く暮らし", 60, anchor="mm", alpha=seg(t, 0, 0.5))
    a = seg(t, 0.5, 4.0)
    x0, x1, y = 160, 1760, 560
    dd = ImageDraw.Draw(img)
    dd.rounded_rectangle((x0, y - 30, x0 + (x1 - 60 - x0) * a, y + 30), radius=30, fill=(190, 140, 80, 255))
    if a > 0.3:
        text(img, (x0 + 40, y - 90), "先住民の人々が暮らしてきた、はるか昔からの時間", 44, anchor="ls", alpha=min(1, (a - 0.3) * 3))
    b = seg(t, 4.0, 5.0)
    if b > 0:
        dd.rectangle((x1 - 54, y - 70, x1 - 36, y + 70), fill=AMBER + (int(255 * b),))
        text(img, (x1 - 45, y + 110), "1788年", 48, anchor="ma", fill=AMBER, alpha=b)
        text(img, (x1 - 45, y + 170), "イギリスの植民地化", 36, anchor="ma", alpha=b, weight="500Medium")
    note(img, "帯の長さは年数を正確に表すものではない（オーストラリア国立博物館 NMA による）")


def d_cycle(img, t, d):
    text(img, (W / 2, 170), "街は、次の人を呼ぶ", 60, anchor="mm", alpha=seg(t, 0, 0.5))
    cx, cy, R = W / 2, 600, 260
    a = seg(t, 0.5, 1.2)
    for i, (s, ang) in enumerate([("人", 180), ("企業", 0)]):
        x = cx + R * math.cos(math.radians(ang)); y = cy
        ImageDraw.Draw(img).ellipse((x - 150, y - 150, x + 150, y + 150), fill=(16, 28, 50, int(240 * a)), outline=(AMBER if i == 0 else TEAL) + (int(255 * a),), width=6)
        text(img, (x, y), s, 84, anchor="mm", alpha=a)
    b = seg(t, 0.4, 2.2); c = seg(t, 4.3, 6.0)
    arrow(img, (cx - R + 120, cy - 120), (cx + R - 120, cy - 120), color=AMBER, width=10, prog=b, alpha=min(1, b * 3))
    if b > 0.4:
        text(img, (cx, cy - 190), "働き手を求めて、企業が集まる", 40, anchor="mm", alpha=b)
    arrow(img, (cx + R - 120, cy + 120), (cx - R + 120, cy + 120), color=TEAL, width=10, prog=c, alpha=min(1, c * 3))
    if c > 0.4:
        text(img, (cx, cy + 190), "仕事の選択肢を求めて、人が集まる", 40, anchor="mm", alpha=c)
    e = seg(t, 9.9, 10.8)
    if e > 0:
        ang = (t - 9.9) * 1.6
        for k in range(2):
            x = cx + (R - 40) * math.cos(ang + k * math.pi); y = cy + 150 * math.sin(ang + k * math.pi)
            ImageDraw.Draw(img).ellipse((x - 14, y - 14, x + 14, y + 14), fill=AMBER + (int(255 * e),))
        text(img, (cx, 255), "互いを引き寄せ合う", 46, anchor="mm", fill=AMBER, alpha=e)
    note(img, "オーストラリア財務省（2025年10月30日の講演）による一般的な仕組み")


def d_network(img, t, d):
    text(img, (W / 2, 150), "近くに集まることの強み", 60, anchor="mm", alpha=seg(t, 0, 0.5))
    nodes = [("専門の人", 560, 400), ("取引先", 1360, 400), ("大学・研究機関", 960, 300), ("港・空港・鉄道", 960, 760), ("企業", 960, 540)]
    a = seg(t, 0.3, 1.0)
    when = {"専門の人": 3.0, "大学・研究機関": 6.0, "取引先": 5.6, "港・空港・鉄道": 9.9}
    for i, (s, x, y) in enumerate(nodes[:-1]):
        b = seg(t, when[s], when[s] + 0.6)
        polyline(img, [(960, 540), (x, y)], (120, 170, 255), 6, b)
    for i, (s, x, y) in enumerate(nodes):
        b = a if s == "企業" else seg(t, when[s], when[s] + 0.6)
        w = text_w(s, 44) + 70
        panel(img, (x - w / 2, y - 50, x + w / 2, y + 50), fill=(16, 28, 50), alpha=0.95 * b, outline=AMBER if s == "企業" else TEAL)
        text(img, (x, y), s, 44, anchor="mm", alpha=b)


def d_year(img, t, d):
    text(img, (W / 2, 250), "シドニーでもメルボルンでもない場所", 46, anchor="mm", fill=MUTED, alpha=seg(t, 0.2, 0.9), weight="500Medium")
    text(img, (W / 2, 450), "1908年", 160, anchor="mm", fill=AMBER, alpha=seg(t, 3.4, 4.1), stroke=6)
    text(img, (W / 2, 630), "連邦議会が、首都の場所をヤス・キャンベラ地域に決定", 50, anchor="mm", alpha=seg(t, 5.6, 6.3))
    note(img, "Seat of Government Act 1908（オーストラリア議会教育局 PEO・首都庁 NCA による）")


def d_summary(img, t, d):
    d_three(img, t * 0.6 / 2.5 if t < 7 else t, d, labels=(("空気の流れ", "雨を左右する"), ("港と真水", "街の始まり"), ("人と仕事", "呼び合う力")), title="海の近くに集まる、三つの理由")


# ---------------------------------------------------------------- map layers
def L_coast(alpha=0.5):
    return lambda img, p, t, d: coast(img, p, alpha=alpha)


def L_dots(names, t0=0.3, stagger=0.35, labels=True, color=AMBER, size=40):
    return lambda img, p, t, d: dots(img, p, names, t0=t0, t=t, labels=labels, stagger=stagger, color=color, size=size)


def L_caption(s, t0=0.3, y=170, color=INK):
    return lambda img, p, t, d: caption_box(img, s, seg(t, t0, t0 + 0.6), y=y, color=color)


def L_coast_glow(t0=0.5):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.0)
        for _, _, polys in land():
            for poly in polys:
                r = poly[0]
                if 110 < r[:, 0].mean() < 155 and -45 < r[:, 1].mean() < -10 and len(r) > 400:
                    x, y = p(r[:, 0], r[:, 1])
                    polyline(img, list(zip(x, y)), AMBER, 7, 0.85 * a, closed=True)
    return fn


def L_japan(t0=0.6):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.2)
        jp = country("Japan")
        jx, jy = 137.5, 36.5  # Japan centre for its own equal-area projection
        for poly in jp:
            r = poly[0]
            if len(r) < 30:
                continue
            x, y = geo.laea(r[:, 0], r[:, 1], jx, jy)
            # place Japan's shape at the same scale, centred over central Australia
            cx, cy = p(*AUS)
            kmpp = _KMPP[0]
            pts = list(zip(cx + x / kmpp, cy - y / kmpp))
            polyline(img, pts, (255, 90, 90), 3, a, closed=True, fill=(255, 90, 90, 170))
        cx, cy = p(*AUS)
        text(img, (cx + 260, cy + 40), "日本（同じ縮尺）", 44, anchor="lm", alpha=a, fill=(255, 170, 170))
        b = seg(t, t0 + 1.5, t0 + 2.2)
        caption_box(img, "面積は、日本のおよそ20倍", b)
        note(img, "正積図法で同じ縮尺に表示（Natural Earth・Geoscience Australia・国土地理院の面積による）", b)
    return fn


_KMPP = [3.5]


def L_nsw(t0=0.3):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.0)
        draw_polys(img, p, nsw(), color=TEAL, width=5, alpha=a, fill=(90, 214, 200, 80))
        x, y = p(146.5, -32.0)
        text(img, (x, y), "ニューサウスウェールズ州", 46, anchor="mm", alpha=a)
    return fn


def L_circle(t0=0.5):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 2.0)
        lon, lat = CITIES["シドニー"]
        bs = np.linspace(0, 360 * a, max(3, int(240 * a)))
        pts = [p(*geo.dest(lon, lat, b, 160.9)) for b in bs]
        if len(pts) > 1:
            polyline(img, pts, AMBER, 6, 1.0)
        b = seg(t, t0 + 2.0, t0 + 2.8)
        caption_box(img, "シドニーから100マイル（約160km）以上", b)
        dots(img, p, ["シドニー", "キャンベラ"], t0=0, t=10, size=42)
        note(img, "オーストラリア憲法 第125条。円は縮尺どおり（Natural Earth）", b)
    return fn


def L_bands(t0=0.4):
    def fn(img, p, t, d):
        zones = [(-10, -19, (70, 170, 120), "北：熱帯"), (-19, -31, (230, 150, 70), "中央：乾燥"), (-31, -44, (90, 150, 230), "南：温帯")]
        for i, (la, lb, c, s) in enumerate(zones):
            a = seg(t, t0 + i * 0.8, t0 + i * 0.8 + 0.8)
            lons = np.linspace(110, 156, 60)
            pts = [p(l, la) for l in lons] + [p(l, lb) for l in lons[::-1]]
            polyline(img, pts, c, 0, a, fill=c + (85,))
            x, y = p(125 if la < -12 else 133, (la + lb) / 2 - (1.5 if la > -12 else 0))
            text(img, (x, y), s, 50, anchor="mm", alpha=a)
        note(img, "区分の位置は模式図（気象局 BOM の気候区分による）", seg(t, t0, t0 + 1))
    return fn


def L_points(items, t0=0.3):
    """items: (lon, lat, label, side)"""
    def fn(img, p, t, d):
        dd = ImageDraw.Draw(img)
        for i, (lon, lat, s, side) in enumerate(items):
            a = seg(t, t0 + i * 0.8, t0 + i * 0.8 + 0.5)
            if a <= 0:
                continue
            x, y = p(lon, lat)
            dd.ellipse((x - 14, y - 14, x + 14, y + 14), fill=AMBER + (int(255 * a),), outline=(255, 255, 255, int(255 * a)), width=3)
            if side == "r":
                text(img, (x + 30, y), s, 44, anchor="lm", alpha=a)
            elif side == "l":
                text(img, (x - 30, y), s, 44, anchor="rm", alpha=a)
            else:
                text(img, (x, y - 30), s, 44, anchor="ms", alpha=a)
    return fn


def L_bay_arrow(t0=1.0):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 2.0)
        s = p(151.20, -34.00); e = p(151.24, -33.86)
        arrow(img, s, e, color=AMBER, width=9, prog=a, alpha=min(1, a * 3))
    return fn


def L_layers(t0=0.4):
    def fn(img, p, t, d):
        cols = [TEAL, AMBER, (150, 170, 255)]
        labs = ["水と気候", "港", "仕事"]
        for i in range(3):
            st = t0 + (0.0, 2.0, 3.9)[i]
            a = seg(t, st, st + 0.8)
            caption_box(img, ("× " if i else "") + labs[i], a, y=170 + i * 100, color=cols[i])
            for n in FIVE:
                x, y = p(*CITIES[n])
                rr = 60 + i * 26
                layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
                ImageDraw.Draw(layer).ellipse((x - rr, y - rr, x + rr, y + rr), outline=cols[i] + (int(220 * a),), width=6)
                img.alpha_composite(layer)
    return fn


# ---------------------------------------------------------------- the edit
def MAPV(lon, lat, kmpp):
    return {"lon": lon, "lat": lat, "kmpp": kmpp}


AUSV = MAPV(AUS[0], -29.5, 4.0)


def L_label(lon, lat, s, t0=0.3, size=40, color=MUTED):
    return lambda img, p, t, d: text(img, p(lon, lat), s, size, anchor="mm", fill=color, alpha=seg(t, t0, t0 + 0.6), weight="500Medium")


PHOTO_MAX = 3.0


def shots():
    """(scene, weight, kind, params). sent=k pins a shot to the start of the scene's k-th sentence.
    Photos ("photo") are capped at PHOTO_MAX seconds and every photo file is used once.
    Maps, diagrams and archival images ("doc") may stay longer; their reason is in why= (written to shotlist_v2.md)."""
    S = []
    add = lambda sc, w, kind, **P: S.append((sc, w, kind, P))
    # S01
    add("S01", 6, "globe", lon=(60, 134), lat=(5, -26), r=(300, 470), cy=560, why="地球からオーストラリアへ寄り、問いの舞台を示す")
    add("S01", 5, "map", sent=1, lon=AUS[0], lat=-28.0, kmpp=(4.4, 3.7), layers=[L_dots(FIVE, 0.2, 0.55)], why="読み上げる5都市の位置を順に置く")
    add("S01", 3, "photo", sent=3, file="real_00a_sydney_cbd.jpg", label="シドニー")
    add("S01", 3, "map", **AUSV, move=False, layers=[L_dots(FIVE, 0, 0), L_caption("大陸の真ん中には、大都市がない", 0.2)], why="「真ん中には一つもない」を地図で確かめる")
    add("S01", 6, "map", sent=5, lon=AUS[0], lat=-28.0, kmpp=3.7, move=False, layers=[L_japan(0.3)], why="日本を同じ縮尺で重ね、約20倍の広さを見せる")
    # S02
    add("S02", 6, "map", lon=(134.0, 133.5), lat=(-28.0, -24.5), kmpp=(3.7, 1.6), layers=[L_caption("内陸が砂漠だから？", 0.3)], why="衛星画像で内陸の乾いた大地に寄る（「砂漠だから」「乾燥」の2文）")
    add("S02", 5, "map", sent=2, **AUSV, move=False, layers=[L_coast_glow(0.3), L_caption("海沿いなら、どこでも育つ？", 0.6)], why="海岸線全体を光らせ「海沿いならどこでも」を示す")
    add("S02", 3, "photo", sent=3, file="real_00b_canberra_parliament.jpg", label="首都キャンベラは、内陸")
    add("S02", 2, "map", **AUSV, move=False, layers=[L_dots(["シドニー", "キャンベラ"], 0, 0), L_caption("海から離れた首都", 0.1)], why="キャンベラが海から離れていることを位置で示す")
    add("S02", 7, "diag", sent=4, fn=d_three, why="今回の三つの理由（水・港・仕事）を読み上げに合わせて出す")
    # S03
    add("S03", 8, "diag", fn=d_bars((0, 1)), why="シドニーの数字を読み上げる間、グラフで示す")
    add("S03", 3, "photo", sent=2, file="real_01_melbourne.jpg", label="メルボルン")
    add("S03", 1, "diag", fn=d_bars((1, 2)), why="メルボルンの数字をグラフに足す")
    add("S03", 13, "map", sent=3, lon=(151.2, 151.1), lat=(-33.87, -33.6), kmpp=(0.45, 0.3), dim=0.1,
        layers=[L_points([(151.21, -33.87, "シドニー中心部", "r"), (151.34, -33.43, "セントラルコースト", "r")], 0.5),
                L_caption("「市」ではなく、周りまで含めた「都市圏」", 0.3)], why="都市圏が中心部から北のセントラルコーストまで広がることを地図で示す（3文）")
    # S04
    add("S04", 3, "photo", file="real_02_brisbane.jpg", label="ブリスベン")
    add("S04", 1, "diag", fn=d_bars((2, 3)), why="ブリスベンの数字をグラフに足す")
    add("S04", 3, "photo", sent=1, file="real_03_perth.jpg", label="パース")
    add("S04", 3, "map", sent=2, lon=138.4, lat=-34.9, kmpp=0.9, move=False,
        layers=[L_points([(138.60, -34.93, "アデレード", "r")], 0.1), L_caption("アデレード：南のセントビンセント湾に面した都市", 0.3)], why="アデレードの写真の代わりに、南の湾に面した実際の位置を地図で示す")
    add("S04", 6, "diag", sent=3, fn=d_bars((5, 5)), why="5都市の規模を並べ、東だけでなく南と西にも大都市があることを示す")
    add("S04", 4, "map", sent=5, **AUSV, move=False, layers=[L_coast_glow(0.2), L_dots(FIVE, 0.0, 0.1), L_caption("5都市すべてが、海の近く", 0.4)], why="5都市が海に面していることを地図で示す")
    # S05
    add("S05", 4, "card", kicker="理由1", title="水と気候", why="章の扉")
    add("S05", 9, "diag", sent=1, fn=d_water, why="飲み水・畑と牧場・工場の3つを読み上げに合わせて出す")
    add("S05", 3, "photo", sent=4, file="real_04_warragamba_dam.jpg", label="シドニーの水がめ、ワラガンバ・ダム")
    add("S05", 4, "diag", sent=5, fn=d_water, t_off=8.0, why="「広い土地と大勢の暮らしは別」の結論を図に出す")
    add("S05", 4, "map", sent=6, **AUSV, move=False, layers=[L_caption("なぜ、内陸は乾く？", 0.3)], why="次の問い（内陸の乾燥）を地図で示す")
    # S06
    add("S06", 14, "diag", fn=d_hadley, why="空気の上昇・移動・下降と高気圧を、読み上げの順に描く（4文）")
    add("S06", 11, "globe", sent=4, lon=(134, 134), lat=(-20, -26), r=(470, 520), cy=560, band=[(-24, -36)], why="亜熱帯高圧帯の帯が大陸の中央にかかることを地球儀で示す")
    # S07
    add("S07", 8, "map", **AUSV, move=False, dim=0.15, layers=[L_bands(0.3)], why="北・中央・南の気候の違いを地図で示す")
    add("S07", 3, "photo", sent=1, file="real_05_tropical_wetland.jpg", label="北部の熱帯（フォッグ・ダム保護区）")
    add("S07", 3, "photo", sent=2, file="real_06_temperate_farmland.jpg", label="南部の温帯（ビクトリア州）")
    add("S07", 1, "map", **AUSV, move=False, dim=0.15, layers=[L_bands(-5)], why="南部の温帯の位置に戻る")
    add("S07", 9, "diag", sent=3, fn=d_coast_section, why="海からの湿った空気と山地の関係を断面図で示す（3文）")
    # S08
    add("S08", 4, "card", kicker="理由2", title="港から始まった街", why="章の扉")
    add("S08", 9, "map", lon=(AUS[0], 148.0), lat=(-28.0, -32.0), kmpp=(3.7, 1.6), layers=[L_coast_glow(0.2), L_caption("どの海岸に、大都市ができたのか", 0.3)],
        why="「どの海岸に」の問いを地図で示し、1788年の南東の海岸へ寄る")
    add("S08", 6, "diag", sent=3, fn=d_needs, why="船団に必要だった二つ（湾と真水）を出す")
    # S09
    add("S09", 7, "map", lon=(151.2, 151.2), lat=(-33.6, -33.93), kmpp=(0.6, 0.13), dim=0.05,
        layers=[L_points([(151.19, -34.00, "ボタニー湾（1788年1月）", "r")], 1.0)], why="最初の計画地ボタニー湾の位置へ寄る")
    add("S09", 3, "photo", sent=2, file="real_07_botany_bay.jpg", label="今のボタニー湾")
    add("S09", 3, "map", lon=151.2, lat=-33.93, kmpp=0.13, move=False,
        layers=[L_points([(151.19, -34.00, "ボタニー湾", "r")], 0.0), L_caption("停泊地も真水も足りない", 0.2)], why="ボタニー湾の位置に戻り、足りなかったものを示す")
    add("S09", 3, "photo", sent=3, file="real_21_port_jackson_aerial.jpg", label="ポートジャクソン（シドニー湾）")
    add("S09", 3, "map", lon=151.2, lat=-33.93, kmpp=0.13, move=False,
        layers=[L_points([(151.19, -34.00, "ボタニー湾", "r"), (151.21, -33.86, "シドニー・コーブ", "r")], 0.0), L_bay_arrow(0.0)], why="ボタニー湾から北のシドニー・コーブへの移動を矢印で示す")
    add("S09", 7, "doc", sent=4, file="real_08_sydney_cove_1788.jpg", label="1788年のシドニー・コーブ（当時の水彩画）", zoom=(1.0, 1.06),
        why="入り江と小川を描いた当時の資料を、入り江と小川の2文の間見せる")
    add("S09", 3, "photo", sent=6, file="real_09_circular_quay.jpg", label="今のシドニー・コーブ")
    # S10
    add("S10", 10, "diag", fn=d_timeline, why="植民地化よりはるか前からの暮らしを年表で示す（2文）")
    add("S10", 3, "photo", sent=2, file="real_10_rock_engraving.jpg", label="シドニー北部に残る、先住民の人々の岩の線刻")
    add("S10", 8, "map", sent=3, **AUSV, move=False, dim=0.35, layers=[L_caption("土地を奪われていった歴史", 0.5)], why="大陸全体の地図で、植民地の拡大と土地の喪失の話を受ける（2文）")
    # S11
    add("S11", 6, "map", **AUSV, move=False, layers=[L_dots(FIVE, 0, 0), L_caption("船の時代が終わっても、大きいまま", 0.3)], why="問い（なぜ大都市は大きいままか）を5都市の地図で示す")
    add("S11", 3, "card", sent=1, kicker="理由3", title="人と仕事", why="章の扉")
    add("S11", 12, "diag", sent=2, fn=d_cycle, why="人と企業が引き寄せ合う循環を読み上げに合わせて描く（3文）")
    # S12
    add("S12", 10, "diag", fn=d_network, why="専門の人・取引先・大学がつながる図を読み上げに合わせて出す（3文）")
    add("S12", 2, "photo", sent=3, file="real_17_sydney_airport.jpg", label="空港（シドニー）")
    add("S12", 2, "photo", file="real_18_train.jpg", label="鉄道（メルボルン）")
    add("S12", 5, "diag", sent=4, fn=d_network, t_off=10.0, why="「近さの強み」をつながりの図で受ける")
    add("S12", 3, "photo", sent=5, file="real_11_suburbs.jpg", label="住宅費・混雑も、同じ集まりから")
    add("S12", 2, "map", lon=151.05, lat=-33.82, kmpp=0.35, move=False, dim=0.1,
        layers=[L_points([(151.21, -33.87, "シドニー中心部", "r"), (151.00, -33.81, "パラマタ", "l")], 0.0), L_caption("集まりが大きいほど、負担も大きい", 0.2)],
        why="写真の撮影地（パラマタ方面）と中心部の位置関係を示す")
    # S13
    add("S13", 4, "map", **AUSV, move=False, layers=[L_dots(FIVE, 0.0, 0.0)], why="最初の地図に戻る")
    add("S13", 14, "map", sent=1, **AUSV, move=False, layers=[L_dots(FIVE, 0.0, 0.0, labels=False), L_layers(0.0)], why="水と気候・港・仕事の3つを順に重ねる（5文）")
    # S14
    add("S14", 6, "map", lon=(AUS[0], 148.5), lat=(-28.0, -34.5), kmpp=(3.7, 1.0), layers=[L_dots(["シドニー", "キャンベラ"], 0.2, 0.6)], why="内陸のキャンベラへ寄る（2文）")
    add("S14", 3, "map", sent=2, lon=146.0, lat=-35.0, kmpp=1.6, move=False, layers=[L_dots(["シドニー", "メルボルン", "キャンベラ"], 0, 0), L_caption("新しい連邦の首都を、どこに置くか", 0.2)],
        why="候補になりえた2大都市と首都の位置を並べる")
    add("S14", 9, "diag", sent=3, fn=d_year, why="1908年の議会の決定を年号カードで示す")
    # S15
    add("S15", 8, "map", lon=148.0, lat=-33.0, kmpp=1.25, move=False, layers=[L_nsw(0.2)], why="憲法の条件（州の中）をニューサウスウェールズ州の範囲で示す")
    add("S15", 6, "map", sent=2, lon=150.0, lat=-34.4, kmpp=0.55, move=False, layers=[L_circle(0.3)], why="シドニーから100マイルの円を縮尺どおりに描く")
    add("S15", 3, "photo", sent=3, file="real_13_canberra_lake.jpg", label="キャンベラ")
    add("S15", 2, "map", lon=148.5, lat=-34.5, kmpp=1.0, move=False, layers=[L_dots(["シドニー", "キャンベラ"], 0, 0), L_caption("条件に合わせて選ばれた場所", 0.1)], why="条件に合う位置にキャンベラがあることを示す")
    add("S15", 5, "doc", sent=4, file="real_12_griffin_plan.jpg", label="首都の設計案（グリフィン、1911〜12年）", zoom=(1.0, 1.05),
        why="計画して造った首都の設計図を「人の決断が都市を生む」の2文の間見せる")
    # S16
    add("S16", 6, "map", **AUSV, move=False, layers=[L_caption("大都市がない ≠ 何もない", 0.3)], why="内陸の見方の話を大陸の地図で受ける（2文）")
    add("S16", 3, "photo", sent=2, file="real_14_cattle_station.jpg", label="放牧地（クイーンズランド州）")
    add("S16", 3, "photo", file="real_15_inland_park.jpg", label="自然保護区（カリジニ国立公園）")
    add("S16", 4, "map", lon=(134.0, 133.5), lat=(-28.0, -25.0), kmpp=(3.7, 2.4), layers=[L_caption("町があり、人々が暮らし続ける土地がある", 0.2)], why="町と先住民の人々の土地の話を、内陸全体の地図で受ける（特定の地点は示さない）")
    add("S16", 5, "map", sent=3, **AUSV, move=False, dim=0.2, layers=[L_caption("土地の役割は、人口の多さだけでは測れない", 0.3)], why="結論を大陸の地図で示す")
    # S17
    add("S17", 7, "map", **AUSV, move=False, layers=[L_dots(FIVE, 0.0, 0.0), L_caption("「砂漠だから」だけではない", 0.3)], why="最初の地図に戻る（2文）")
    add("S17", 12, "diag", sent=2, fn=d_summary, why="三つの理由を読み上げに合わせて並べる（3文）")
    add("S17", 7, "globe", sent=5, lon=(134, 120), lat=(-27, -10), r=(500, 330), cy=560, dots=FIVE, dots_t=-1, labels=False, why="5都市の点から地球全体へ引いて締める")
    # S18 (+ tail)
    add("S18", 10, "card", title="地図の向こうの理由", sub="音声：VOICEVOX:雀松朱司", why="締め")
    return S


HEAD = {"S01": "なぜ、海の近くに？", "S02": "「砂漠だから」で終わらない", "S03": "数字で見る偏り", "S04": "数字で見る偏り",
        "S05": "理由1 街を支えるのは、水", "S06": "理由1 空気が下がると、雨が減る", "S07": "理由1 国全体が同じ気候ではない",
        "S08": "理由2 次の手がかりは、港", "S09": "理由2 1788年、シドニー・コーブへ", "S10": "理由2 それ以前から続く暮らし",
        "S11": "理由3 街は、次の人を呼ぶ", "S12": "理由3 近くに集まることの強み", "S13": "水・港・仕事が重なる",
        "S14": "例外 では、キャンベラは？", "S15": "例外 人の決断も、地図を変える", "S16": "内陸にも続く暮らし",
        "S17": "最初の地図をもう一度", "S18": ""}



def timeline():
    """Shots fill each scene by weight; sent=k pins a shot to the k-th sentence. Photos are capped at PHOTO_MAX:
    the spare time goes to the next non-photo shot of the scene (or the previous one when the photo is last)."""
    order = [s["scene"] for s in TIM["scenes"]]
    sh = shots()
    out = []
    for i, sc in enumerate(order):
        a = SC[sc]["start"]
        b = SC[order[i + 1]]["start"] if i + 1 < len(order) else TOTAL
        items = [x for x in sh if x[0] == sc]
        sents = SC[sc]["sentences"]
        anchors = [(0, a)] + [(j, sents[x[3]["sent"]]["start"] - 0.15) for j, x in enumerate(items) if "sent" in x[3] and j > 0] + [(len(items), b)]
        seq = []
        for (j0, t0), (j1, t1) in zip(anchors, anchors[1:]):
            grp = items[j0:j1]
            tw = sum(x[1] for x in grp)
            cur = t0
            for _, w, kind, P in grp:
                dur = (t1 - t0) * w / tw
                seq.append({"scene": sc, "kind": kind, "P": P, "start": cur, "end": cur + dur})
                cur += dur
        for k, s in enumerate(seq):
            if s["kind"] == "photo" and s["end"] - s["start"] > PHOTO_MAX:
                extra = s["end"] - s["start"] - PHOTO_MAX
                if k + 1 < len(seq) and seq[k + 1]["kind"] != "photo":
                    s["end"] -= extra; seq[k + 1]["start"] -= extra
                elif k > 0 and seq[k - 1]["kind"] != "photo":
                    seq[k - 1]["end"] += extra; s["start"] += extra
                else:
                    raise SystemExit(f"{sc}: photo {s['P']['file']} longer than {PHOTO_MAX}s with no neighbour to absorb it")
        out += seq
    return out


def shotlist_md():
    sents = [(se["start"], se["end"], se["text"], sc["scene"]) for sc in TIM["scenes"] for se in sc["sentences"]]
    rows = ["| 時刻 | 長さ | 種類 | 中身 | 重なる読み上げ（冒頭） | 長く見せる根拠 |", "|---|---|---|---|---|---|"]
    kinds = {"photo": "実写", "doc": "資料（当時の絵・設計図）", "map": "地図", "globe": "地球儀", "diag": "図解", "card": "章の扉"}
    for s in timeline():
        d = s["end"] - s["start"]
        what = s["P"].get("file") or s["P"].get("label") or s["P"].get("title") or ""
        if s["kind"] in ("map", "globe", "diag") and not what:
            what = s["P"].get("fn").__name__ if s["kind"] == "diag" else "地図"
        over = [x for x in sents if x[0] < s["end"] and x[1] > s["start"]]
        nar = " / ".join(x[2][:14] for x in over)
        why = "" if s["kind"] == "photo" else s["P"].get("why", "")
        m, sec = divmod(s["start"], 60)
        rows.append(f"| {int(m)}:{sec:05.2f} | {d:.1f}秒 | {kinds[s['kind']]} | {what} | {nar} | {why} |")
    return "\n".join(rows) + "\n"


TL = None
SUBS = [(c["start"], c["end"], c["lines"]) for c in json.loads((EP / "subtitles_v2.json").read_text())]
XF = 0.4


def shot_frame(s, t):
    d = s["end"] - s["start"]
    tt = t - s["start"]
    k = s["kind"]
    if k == "map":
        kp = s["P"]["kmpp"]
        _KMPP[0] = kp[0] + (kp[1] - kp[0]) * ease(tt / d) if isinstance(kp, (list, tuple)) and s["P"].get("move", True) else (kp[0] if isinstance(kp, (list, tuple)) else kp)
    return {"globe": r_globe, "map": r_map, "photo": r_photo, "doc": r_photo, "card": r_card, "diag": r_diag}[k](tt, d, s["P"])


def frame(t):
    global TL
    TL = TL or timeline()
    cur = [s for s in TL if s["start"] <= t < s["end"]] or [TL[-1]]
    s = cur[0]
    img = shot_frame(s, t)
    i = TL.index(s)
    if i + 1 < len(TL) and t > s["end"] - XF:   # crossfade into the next shot
        nxt = shot_frame(TL[i + 1], TL[i + 1]["start"])
        a = (t - (s["end"] - XF)) / XF
        img = Image.blend(img, nxt, ease(a))
    # chrome: channel name + heading
    h = HEAD.get(s["scene"], "")
    if s["kind"] != "card":
        text(img, (60, 48), "地図の向こうの理由", 26, fill=MUTED, weight="500Medium", stroke=2, shadow=False)
        if h and s["kind"] in ("map", "globe"):
            text(img, (60, 88), h, 38, stroke=3)
    # subtitles
    img.alpha_composite(_SUBBG)
    for a, b, lines in SUBS:
        if a - 0.05 <= t < b + 0.05:
            y = H - 62 - (len(lines) - 1) * 88
            for j, ln in enumerate(lines):
                text(img, (W / 2, y + j * 88), ln, 72, anchor="ms", stroke=6)
            break
    return np.array(img.convert("RGB"))


def render(t0, t1, path):
    n0, n1 = int(round(t0 * FPS)), int(round(t1 * FPS))
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                          "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", str(path)],
                         stdin=subprocess.PIPE)
    for n in range(n0, n1):
        p.stdin.write(frame(n / FPS).tobytes())
        if n % 240 == 0:
            print(f"{path.name} {n / FPS:7.1f}s", flush=True)
    p.stdin.close(); p.wait()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--still", type=float, nargs="*")
    ap.add_argument("--part")
    ap.add_argument("--mux", action="store_true")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--shotlist", action="store_true")
    a = ap.parse_args()
    if a.shotlist:
        (EP / "shotlist_v2.md").write_text("# カット表 v2（render_v2.py から自動生成）\n\n実写は1カット3秒以内・1素材1回。地図・図解・資料を長く見せる区間は、読み上げとの対応を「長く見せる根拠」に書く。\n\n" + shotlist_md())
        return
    if a.list:
        for s in timeline():
            print(f"{s['start']:7.2f}–{s['end']:7.2f} {s['scene']} {s['kind']:6s} {s['P'].get('file') or s['P'].get('label') or s['P'].get('title') or ''}")
        return
    if a.still:
        for t in a.still:
            Image.fromarray(frame(t)).save(OUT / f"v2still_{t:07.2f}.jpg", quality=88)
        return
    if a.part:
        i, m = map(int, a.part.split("/"))
        L = TOTAL / m
        render(L * (i - 1), L * i, OUT / f"v2part{i}.mp4")
        return
    if a.mux:
        parts = sorted(OUT.glob("v2part*.mp4"))
        (OUT / "v2parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "v2parts.txt"),
                        "-i", str(OUT / "mix.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-15:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
                        "-shortest", str(OUT / "chizu-001-australia-coast_full_v2.mp4")], check=True)


if __name__ == "__main__":
    main()
