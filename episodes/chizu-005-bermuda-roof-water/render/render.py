"""chizu-005-bermuda-roof-water: full render (1920x1080, 30 fps). Free and local.
Reuses the drawing engine of chizu-001 (render_v23.py) with the relief base map of chizu-002 v2, and replaces the episode
data (timings, subtitles, shots, credits, output paths).

Images: photos and generated images are made by Codex (社長 2026-11-11). Each such shot is a "slot":
- photo slot: ../assets/<file> (real photo, credit in credits.json) — shown when the file exists, max 3 s
- gen slot:   ../gen/<key>.jpg (Codex-generated; no on-screen label since 2026-11-12)
When the file is missing, Claude's own diagram (fallback) is shown. Re-render after the files arrive.
Usage: python3 render.py --list | --shotlist | --still SEC ... | --chunks i/m | --mux
"""
import argparse, json, math, subprocess, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
EP = HERE.parent
R1 = EP.parent / "chizu-001-australia-coast" / "render"
sys.path.insert(0, str(R1))
import render_v23 as R
from render_v23 import (W, H, AMBER, TEAL, RED, INK, MUTED, text, panel, seg, ease, arrow)
import base, geo
import cv2, numpy as np
from PIL import Image, ImageDraw

_REL = HERE / "vendor" / "shadedrelief.jpg"
assert _REL.exists(), "run render/setup.sh"
base._TEX = cv2.cvtColor(cv2.imread(str(_REL)), cv2.COLOR_BGR2RGB)
base.TEX_LABEL = "shadedrelief_basemap_data_2_0_0"
R.NE_NOTE = "地図：地形の陰影図（shadedrelief.com／basemap-data）。衛星画像ではありません"


def vector_map(lon0, lat0, kmpp, ss=2):
    """Zoomed maps (<1 km/px): Natural Earth 1:10m coastline, coloured to match the relief map (as chizu-002 v2)."""
    SEA, LAND, EDGE = (126, 170, 206), (178, 196, 170), (150, 165, 140)
    im = Image.new("RGB", (W * ss, H * ss), SEA); d = ImageDraw.Draw(im)
    for _, _, polys in R.land():
        for poly in polys:
            r = poly[0]
            x, y = geo.laea(r[:, 0], r[:, 1], lon0, lat0)
            X, Y = (W / 2 + x / kmpp) * ss, (H / 2 - y / kmpp) * ss
            if X.max() < -50 or X.min() > W * ss + 50 or Y.max() < -50 or Y.min() > H * ss + 50:
                continue
            d.polygon(list(zip(X, Y)), fill=LAND, outline=EDGE)
    out = im.resize((W, H), Image.LANCZOS).convert("RGBA")
    R.note(out, "地図：Natural Earth（1:1000万・海岸線は簡略化され、細かい入り江や小島は省略）")
    return out


R.vector_map = vector_map

OUT = HERE / "out"; OUT.mkdir(exist_ok=True)
TIM = json.loads((EP / "audio/timings.json").read_text())
R.EP, R.OUT, R.TIM = EP, OUT, TIM
R.SC = {s["scene"]: s for s in TIM["scenes"]}
R.TOTAL = TIM["scenes"][-1]["end"] + 2.5
R.SUBS = [(c["start"], c["end"], c["lines"]) for c in json.loads((EP / "subtitles.json").read_text())]
R.CREDITS = CREDITS = json.loads((HERE / "credits.json").read_text()) if (HERE / "credits.json").exists() else {}
R.TL = None
R.CITIES = {"ハッテラス岬": (-75.53, 35.25), "バミューダ": (-64.78, 32.30)}
SIDE = {"ハッテラス岬": "l", "バミューダ": "r"}

WHITE = (244, 244, 238); WALLS = [(236, 196, 176), (176, 206, 222), (238, 222, 160), (196, 222, 190)]
WATER = (110, 186, 240); SEA = (34, 86, 140); LIME = (214, 196, 156); SOIL = (120, 98, 72)


def L_dots(names, t0=0.2, stagger=0.4, color=AMBER, labels=True, size=40):
    return lambda img, p, t, d: R.dots(img, p, names, t0=t0, t=t, labels=labels, stagger=stagger, color=color, size=size, side=SIDE)


def L_arrow(a, b, t0=0.5, dur=1.6):
    def fn(img, p, t, d):
        k = seg(t, t0, t0 + dur)
        if k > 0:
            arrow(img, p(*R.CITIES[a])[:2], p(*R.CITIES[b])[:2], color=AMBER, width=8, prog=k, alpha=min(1, k * 3))
    return fn


def L_dist(a, b, t0=1.6):
    def fn(img, p, t, d):
        km = geo.gc_km(*R.CITIES[a], *R.CITIES[b])
        pa, pb = p(*R.CITIES[a]), p(*R.CITIES[b])
        text(img, ((pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2 + 60), f"直線で約{int(round(km, -1)):,}km", 44, anchor="mm", alpha=seg(t, t0, t0 + 0.6), fill=AMBER)
        R.note(img, "距離は2点の大円距離（計算値）", seg(t, t0, t0 + 0.6))
    return fn


def L_caption(s, t0=0.2):
    return lambda img, p, t, d: None   # caption boxes removed (社長 2026-11-12)


# ---------------------------------------------------------------- drawing helpers (Claude's diagrams)
def layer():
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    return L, ImageDraw.Draw(L)


def put(img, L, a):
    if a < 1:
        al = np.array(L); al[..., 3] = (al[..., 3] * max(0, a)).astype(np.uint8); L = Image.fromarray(al)
    img.alpha_composite(L)


def roof(dr, x0, x1, ybase, h, steps=7, col=WHITE):
    """Stepped hip roof seen from the side: a white triangle with horizontal step lines (limestone slabs)."""
    cx = (x0 + x1) / 2
    dr.polygon([(x0, ybase), (cx, ybase - h), (x1, ybase)], fill=col + (255,))
    for i in range(1, steps):
        y = ybase - h * i / steps
        hw = (x1 - x0) / 2 * (1 - i / steps)
        dr.line([(cx - hw, y), (cx + hw, y)], fill=(196, 198, 196, 255), width=3)
        dr.line([(cx - hw, y + 4), (cx + hw, y + 4)], fill=(255, 255, 255, 255), width=2)


def house(dr, x0, x1, yg, wall_h, roof_h, wall=WALLS[0]):
    dr.rectangle([x0, yg - wall_h, x1, yg], fill=wall + (255,))
    w = (x1 - x0)
    for k in range(2):
        wx = x0 + w * (0.22 + 0.4 * k)
        dr.rectangle([wx, yg - wall_h * 0.7, wx + w * 0.16, yg - wall_h * 0.3], fill=(60, 80, 100, 255))
    roof(dr, x0 - w * 0.06, x1 + w * 0.06, yg - wall_h, roof_h)


def rain(dr, t, x0, x1, y0, y1, n=60, a=1.0, seed=3):
    rng = np.random.default_rng(seed)
    xs = rng.uniform(x0, x1, n); ph = rng.uniform(0, 1, n)
    for x, p in zip(xs, ph):
        y = y0 + ((t * 0.9 + p) % 1.0) * (y1 - y0)
        dr.line([(x, y), (x - 6, y + 26)], fill=(170, 210, 255, int(200 * a)), width=3)


def label(img, xy, s, a, size=44, color=INK, anchor="mm"):
    if a > 0:
        text(img, xy, s, size, fill=color, anchor=anchor, alpha=a, stroke=5)


def diagram_note(img, s="図解（実際の写真ではありません）"):
    R.note(img, s)


# ---------------------------------------------------------------- diagrams
def d_roofs(img, t, d):
    """S01 fallback for the white-roof photo: a row of houses with white stepped roofs."""
    L, dr = layer()
    dr.rectangle([0, 760, W, H], fill=(70, 96, 70, 255))
    for i, x in enumerate(range(170, 1800, 410)):
        house(dr, x, x + 300, 760, 180, 150 + 20 * (i % 2), WALLS[i % 4])
    put(img, L, seg(t, 0.0, 0.5))
    diagram_note(img)


def d_section(stage):
    """House cross-section: roof → gutter → pipe → tank under the house. stage: how many labels to show."""
    def fn(img, t, d):
        L, dr = layer()
        yg = 540
        dr.rectangle([0, yg, W, H], fill=SOIL + (255,))
        dr.rectangle([620, yg, 1300, yg + 6], fill=(90, 74, 56, 255))
        house(dr, 660, 1260, yg, 220, 190, WALLS[1])
        # gutter + downpipe
        dr.rectangle([600, yg - 226, 650, yg - 206], fill=(200, 200, 196, 255))
        dr.rectangle([606, yg - 210, 626, yg + 110], fill=(200, 200, 196, 255))
        dr.rectangle([606, yg + 100, 760, yg + 120], fill=(200, 200, 196, 255))
        # tank (underground)
        tx0, ty0, tx1, ty1 = 740, yg + 70, 1220, yg + 290
        dr.rectangle([tx0, ty0, tx1, ty1], fill=(60, 60, 64, 255), outline=(170, 170, 170, 255), width=6)
        lvl = 0.25 + 0.55 * min(1.0, t / max(1.0, d))
        dr.rectangle([tx0 + 6, ty1 - 6 - (ty1 - ty0 - 12) * lvl, tx1 - 6, ty1 - 6], fill=WATER + (255,))
        rain(dr, t, 520, 1400, 120, yg - 230, 70, 0.9)
        put(img, L, seg(t, 0.0, 0.5))
        labs = [((960, 200), "屋根"), ((540, yg - 260), "雨どい"), ((1380, yg + 180), "タンク")]
        for i, (xy, s) in enumerate(labs[:stage]):
            label(img, xy, s, seg(t, 0.4 + i * 0.6, 1.0 + i * 0.6))
        diagram_note(img, "図解（家の大きさ・タンクの位置は模式的）")
    return fn


def d_lens(img, t, d):
    """S04: limestone island, rain soaking in, freshwater lens floating on seawater (schematic)."""
    L, dr = layer()
    ys = 560
    dr.rectangle([0, ys, W, H], fill=SEA + (255,))
    xs = np.linspace(300, 1620, 60)
    top = ys - 140 * np.sin(np.pi * (xs - 300) / 1320) ** 0.6
    dr.polygon(list(zip(xs, top)) + [(1620, 960), (300, 960)], fill=LIME + (255,))
    # lens: thicker in the middle
    k = seg(t, 1.0, 3.0)
    lx = np.linspace(380, 1540, 60)
    bot = ys + 8 + k * 120 * np.sin(np.pi * (lx - 380) / 1160)
    dr.polygon([(x, ys + 8) for x in lx] + list(zip(lx[::-1], bot[::-1])), fill=WATER + (230,))
    dr.rectangle([0, 960, W, H], fill=(22, 60, 104, 255))
    rain(dr, t, 340, 1580, 120, 440, 60, 0.9)
    put(img, L, seg(t, 0.0, 0.5))
    label(img, (960, 470), "石灰岩", seg(t, 0.4, 1.0))
    label(img, (960, ys + 60), "淡水", seg(t, 1.6, 2.2))
    label(img, (300, 760), "海水", seg(t, 2.0, 2.6))
    diagram_note(img, "模式図（縮尺・厚さは正確ではありません）")


def d_steps(img, t, d):
    """S05: close-up of the stepped roof — rain slows down on each step and runs to the gutter."""
    L, dr = layer()
    n = 7
    for i in range(n):
        x0, y0 = 260 + i * 190, 150 + i * 90
        dr.rectangle([x0, y0, 1700, y0 + 90], fill=WHITE + (255,))
        dr.rectangle([x0, y0 + 84, 1700, y0 + 92], fill=(186, 188, 186, 255))
    dr.rectangle([1500, 780, 1760, 820], fill=(200, 200, 196, 255))
    # water droplets running down the steps
    for j in range(14):
        p = (t * 0.35 + j / 14) % 1.0
        i = int(p * n); f = p * n - i
        x = 300 + i * 190 + f * 150; y = 140 + i * 90 + (f > 0.8) * (f - 0.8) * 450
        dr.ellipse([x - 9, y - 9, x + 9, y + 9], fill=WATER + (255,))
    rain(dr, t, 200, 1700, 20, 160, 50, 0.8)
    put(img, L, seg(t, 0.0, 0.5))
    label(img, (560, 300), "石灰岩の板を重ねた段", seg(t, 0.4, 1.0))
    label(img, (1630, 730), "雨どいへ", seg(t, 1.4, 2.0))
    diagram_note(img)


def d_old(img, t, d):
    """S06: older way — tank in a small stone building beside the house, joined by a stone gutter."""
    L, dr = layer()
    yg = 720
    dr.rectangle([0, yg, W, H], fill=(70, 96, 70, 255))
    house(dr, 420, 1020, yg, 220, 190, WALLS[2])
    dr.rectangle([1260, yg - 170, 1560, yg], fill=(196, 186, 168, 255))
    roof(dr, 1240, 1580, yg - 170, 90, 4)
    dr.line([(1060, yg - 230), (1250, yg - 160)], fill=(176, 166, 150, 255), width=18)
    put(img, L, seg(t, 0.0, 0.5))
    label(img, (720, 230), "家", seg(t, 0.3, 0.9))
    label(img, (1410, 440), "石造りの小屋（タンク）", seg(t, 0.8, 1.4))
    label(img, (1150, 600), "石の雨どい", seg(t, 1.3, 1.9), size=36)
    diagram_note(img)


def d_law(img, t, d):
    """S07: the law — every house keeps a rain tank; a bigger roof needs a bigger tank (no figures until the law is read)."""
    L, dr = layer()
    yg = 470
    dr.rectangle([0, yg, W, H], fill=SOIL + (255,))
    a1, a2 = seg(t, 0.3, 0.9), seg(t, 1.2, 1.8)
    L1, d1 = layer(); house(d1, 360, 720, yg, 160, 130, WALLS[0]); d1.rectangle([400, yg + 60, 680, yg + 160], fill=WATER + (255,), outline=(170, 170, 170, 255), width=5)
    L2, d2 = layer(); house(d2, 1060, 1640, yg, 200, 180, WALLS[3]); d2.rectangle([1100, yg + 60, 1600, yg + 250], fill=WATER + (255,), outline=(170, 170, 170, 255), width=5)
    put(img, L, 1.0); put(img, L1, a1); put(img, L2, a2)
    text(img, (W / 2, 120), "法律で決まっている：家に雨水をためるタンク", 54, anchor="mm", alpha=seg(t, 0.1, 0.7))
    label(img, (540, yg + 210), "屋根が小さい家", a1, 38, INK)
    label(img, (1350, yg + 310), "屋根が広い家ほど、大きなタンク", a2, 42)
    diagram_note(img, "図解（大きさの比は模式的）")


def d_tank(truck=False):
    """S08: tank level falls in a dry summer; then a water truck refills it."""
    def fn(img, t, d):
        L, dr = layer()
        yg = 500
        dr.rectangle([0, yg, W, H], fill=SOIL + (255,))
        house(dr, 260, 760, yg, 190, 160, WALLS[1])
        tx0, ty0, tx1, ty1 = 300, yg + 70, 720, yg + 290
        dr.rectangle([tx0, ty0, tx1, ty1], fill=(60, 60, 64, 255), outline=(170, 170, 170, 255), width=6)
        if truck:
            lvl = 0.08 + 0.6 * seg(t, 1.6, d)
        else:
            lvl = 0.75 - 0.67 * seg(t, 0.3, d * 0.9)
        dr.rectangle([tx0 + 6, ty1 - 6 - (ty1 - ty0 - 12) * lvl, tx1 - 6, ty1 - 6], fill=WATER + (255,))
        # sun
        dr.ellipse([1500, 120, 1660, 280], fill=(255, 210, 90, 255))
        if truck:
            k = ease(seg(t, 0.0, 1.4)); x = 1900 - 820 * k
            dr.rectangle([x, yg - 170, x + 380, yg - 30], fill=(214, 222, 230, 255))
            dr.rectangle([x - 130, yg - 130, x, yg - 30], fill=(190, 200, 210, 255))
            for wx in (x - 70, x + 110, x + 300):
                dr.ellipse([wx - 32, yg - 62, wx + 32, yg + 2], fill=(40, 40, 44, 255))
            if t > 1.5:
                dr.line([(x - 60, yg - 40), (760, yg + 40), (700, yg + 110)], fill=(30, 30, 30, 255), width=10)
        put(img, L, seg(t, 0.0, 0.5))
        label(img, (750, yg + 180), "家のタンク", seg(t, 0.2, 0.8), 40, anchor="lm")
        if truck:
            label(img, (1350, yg - 230), "給水トラック", seg(t, 1.0, 1.6))
        else:
            label(img, (1250, 360), "雨が少ない夏", seg(t, 0.3, 0.9))
        diagram_note(img)
    return fn


def d_big(num, sub, note=""):
    def fn(img, t, d):
        text(img, (W / 2, 440), num, 170, anchor="mm", fill=AMBER, alpha=seg(t, 0.1, 0.7), stroke=6)
        text(img, (W / 2, 630), sub, 48, anchor="mm", alpha=seg(t, 0.5, 1.1))
        if note:
            R.note(img, note, seg(t, 0.5, 1.1))
    return fn


def d_year(year, line1, line2=""):
    def fn(img, t, d):
        text(img, (W / 2, 420), year, 150, anchor="mm", fill=AMBER, alpha=seg(t, 0.1, 0.7), stroke=6)
        text(img, (W / 2, 600), line1, 52, anchor="mm", alpha=seg(t, 0.5, 1.1))
        if line2:
            text(img, (W / 2, 690), line2, 40, anchor="mm", fill=MUTED, alpha=seg(t, 0.9, 1.5), weight="500Medium")
    return fn


def d_flow(img, t, d):
    """S09: sea water → reverse-osmosis plant (Tynes Bay) → water truck → house tank."""
    items = [("海水", TEAL), ("逆浸透プラント", AMBER), ("給水トラック", INK), ("家のタンク", TEAL)]
    text(img, (W / 2, 200), "トラックの水の元の一つ", 56, anchor="mm", alpha=seg(t, 0.1, 0.6))
    for i, (s, col) in enumerate(items):
        a = seg(t, 0.3 + i * 0.8, 0.9 + i * 0.8)
        x = 270 + i * 460
        panel(img, (x - 190, 420, x + 190, 640), fill=(16, 28, 50), alpha=0.92 * a, outline=col)
        text(img, (x, 530), s, 44, anchor="mm", alpha=a, stroke=4)
        if i == 1:
            text(img, (x, 690), "タインズ・ベイ", 36, anchor="mm", fill=MUTED, alpha=a, weight="500Medium")
        if i > 0 and a > 0:
            arrow(img, (x - 460 + 200, 530), (x - 200, 530), color=AMBER, width=7, alpha=a, prog=a, head=20)
    text(img, (W / 2, 820), "政府の主な水源", 44, anchor="mm", fill=AMBER, alpha=seg(t, 2.0, 2.6))


def d_quote(img, t, d):
    a = seg(t, 0.2, 0.8)
    text(img, (W / 2, 250), "2025年の日照り　政府の呼びかけ（要旨）", 46, anchor="mm", fill=MUTED, alpha=a, weight="500Medium")
    panel(img, (300, 360, 1620, 700), fill=(16, 28, 50), alpha=0.92 * a, outline=TEAL)
    text(img, (W / 2, 470), "家のタンクの残りを確かめ", 70, anchor="mm", alpha=a, stroke=5)
    text(img, (W / 2, 590), "早めに節水を", 70, anchor="mm", alpha=seg(t, 0.6, 1.2), fill=AMBER, stroke=5)


def d_summary(img, t, d):
    text(img, (W / 2, 190), "バミューダの水", 60, anchor="mm", alpha=seg(t, 0.1, 0.6))
    a = seg(t, 0.3, 0.9)
    panel(img, (260, 300, 1660, 560), fill=(16, 28, 50), alpha=0.92 * a, outline=TEAL)
    text(img, (W / 2, 430), "一軒一軒の屋根とタンク＝島の水道", 64, anchor="mm", alpha=a, stroke=5)
    for i, s in enumerate(["海水からつくる水", "給水トラック"]):
        b = seg(t, 2.0 + i * 0.6, 2.6 + i * 0.6)
        x = W / 2 + (i - 0.5) * 680
        panel(img, (x - 300, 640, x + 300, 820), fill=(16, 28, 50), alpha=0.92 * b, outline=AMBER)
        text(img, (x, 730), s, 50, anchor="mm", alpha=b, stroke=4)
    text(img, (W / 2, 900), "足りない分を埋める", 40, anchor="mm", fill=MUTED, alpha=seg(t, 2.6, 3.2), weight="500Medium")


# ---------------------------------------------------------------- slots for Codex's images (06e_image_requests.md)
_IMG = {}


def load(path):
    if path not in _IMG:
        _IMG[path] = None
        if path.exists():
            im = Image.open(path).convert("RGB")
            s = max(W / im.width, H / im.height)
            im = im.resize((math.ceil(im.width * s), math.ceil(im.height * s)), Image.LANCZOS)
            x0, y0 = (im.width - W) // 2, (im.height - H) // 2
            _IMG[path] = im.crop((x0, y0, x0 + W, y0 + H)).convert("RGBA")
    return _IMG[path]


def slot_frame(s, t):
    P = s["P"]; sl = P.get("slot")
    if not sl:
        return None
    d = s["end"] - s["start"]; tt = t - s["start"]
    if "photo" in sl:
        if not (EP / "assets" / sl["photo"]).exists() and (EP / "incoming" / sl["photo"]).exists():
            (EP / "assets").mkdir(exist_ok=True)
            (EP / "assets" / sl["photo"]).write_bytes((EP / "incoming" / sl["photo"]).read_bytes())
        if (EP / "assets" / sl["photo"]).exists():
            return R.r_photo(tt, d, {"file": sl["photo"], "label": sl.get("label", "")})
        return None
    g = load(EP / "gen" / f"{sl['gen']}.jpg")
    if g is None:
        return None
    img = g.copy()
    for xy, txt, t0 in sl.get("labels", []):
        label(img, (xy[0] * W, xy[1] * H), txt, seg(tt, t0, t0 + 0.6))
    # no 「AI生成イメージ」 label on screen (社長 2026-11-12「残さないでください」); recorded in the ledger and description
    return img


# ---------------------------------------------------------------- the edit
ATL = dict(lon=-70.0, lat=34.0, kmpp=1.5)
ISL = dict(lon=-64.77, lat=32.32, kmpp=0.022)


def shots():
    S = []
    add = lambda sc, w, kind, **P: S.append((sc, w, kind, P))
    # S01
    add("S01", 5, "globe", lon=(-40, -64.8), lat=(20, 32.3), r=(360, 560), cy=560, why="地球儀から大西洋の島バミューダへ寄る")
    add("S01", 3, "diag", sent=1, fn=d_roofs, slot={"photo": "BM-S01.jpg", "label": "バミューダの家並み"}, why="白い階段の屋根（実写は Codex の素材待ち。届くまで図解）")
    add("S01", 7, "diag", fn=d_section(1), why="屋根の下に飲み水がある＝屋根から家の下のタンクへ")
    add("S01", 5, "card", sent=3, kicker="では", title="雨が降らないときは？", why="この動画の問い")
    # S02
    add("S02", 7, "map", **ATL, move=False, layers=[L_dots(["ハッテラス岬"], 0.2, 0, TEAL), L_dots(["バミューダ"], 0.6, 0, AMBER), L_arrow("ハッテラス岬", "バミューダ", 1.0), L_dist("ハッテラス岬", "バミューダ", 2.2)], why="北アメリカのハッテラス岬からの位置と距離")
    add("S02", 5, "map", sent=1, lon=(-65.2, -64.77), lat=(32.5, 32.32), kmpp=(0.12, 0.025), layers=[L_caption("面積　約53km²", 0.6)], why="島へ寄り、小ささを見せる")
    add("S02", 5, "diag", sent=2, fn=d_big("約6万4千人", "2016年の国勢調査"), why="人口を数字で示す")
    # S03
    add("S03", 7, "map", **ISL, move=False, layers=[L_caption("川も　淡水の湖もない", 0.2)], why="島の全体図。川の線がない（池の位置は確認前なので示さない）")
    # S04
    add("S04", 16, "diag", fn=d_lens, slot={"gen": "BM-S04", "labels": [((0.5, 0.42), "石灰岩", 0.4), ((0.5, 0.56), "淡水", 1.6), ((0.15, 0.75), "海水", 2.0)]}, why="雨が石灰岩にしみ込み、海水の上に淡水の層ができる仕組みを断面で示す")
    # S05
    add("S05", 2, "diag", fn=d_roofs, slot={"photo": "BM-S05a.jpg", "label": "白い階段状の屋根"}, why="「それが屋根です」（実写は Codex の素材待ち）")
    add("S05", 9, "diag", sent=1, fn=d_steps, slot={"gen": "BM-S05b", "labels": [((0.3, 0.15), "石灰岩の板を重ねた段", 0.4), ((0.85, 0.85), "雨どいへ", 1.4)]}, why="石灰岩の板の段が雨の勢いを弱め、雨どいへ導く")
    add("S05", 2, "diag", sent=3, fn=d_roofs, why="屋根は白く塗られている（目的は確認前なので語らない）")
    # S06
    add("S06", 7, "diag", fn=d_section(3), slot={"gen": "BM-S06a", "labels": [((0.5, 0.25), "屋根", 0.4), ((0.3, 0.42), "雨どい", 1.0), ((0.5, 0.8), "タンク", 1.6)]}, why="雨どいの先の家の下のタンク")
    add("S06", 6, "diag", sent=2, fn=d_old, why="昔の家の横の石造りのタンク")
    Y1809 = d_year("1809年", "水をためる施設の絵", "W. F. Wells のアクアチント（Wellcome Collection）")
    add("S06", 3, "diag", sent=3, fn=Y1809, slot={"photo": "BM-S06b.jpg", "label": "1809年の絵（W. F. Wells）"}, why="1809年の絵（届くまで年号カード）")
    add("S06", 2.5, "diag", fn=Y1809, why="1809年の絵の年号")
    # S07
    add("S07", 11, "diag", fn=d_law, why="法律でタンクを持つことが決まっている／屋根が広いほど大きなタンク（数字は根拠法令の確認後）")
    # S08
    add("S08", 6, "diag", fn=d_tank(False), why="夏にタンクの水が減る")
    add("S08", 4, "diag", sent=1, fn=d_tank(True), slot={"gen": "BM-S08"}, why="給水トラックから水を買う")
    add("S08", 6, "diag", sent=2, fn=d_big("約4万人", "日照りのとき給水トラックの水に頼る住民", "2018年の政府の説明"), why="2018年の政府の説明の数字")
    add("S08", 6, "diag", sent=3, fn=d_big("1〜2週間分", "給水トラックの業者の勧め　タンクに常に残す水"), why="業者の勧め")
    # S09
    add("S09", 8, "diag", fn=d_flow, why="海水→プラント→トラック→家のタンク（プラントの位置は確認前なので地図に置かない）")
    add("S09", 7, "diag", sent=2, fn=d_year("2025年2月", "プラントの取水設備が大きく故障", "給水トラック用の東部の出口が閉鎖"), why="2025年2月の故障")
    add("S09", 6, "diag", sent=3, fn=d_year("2026年5月", "東部に24時間使える新しい出口", "給水トラック用"), why="2026年5月の新しい出口")
    # S10
    add("S10", 8, "diag", fn=d_quote, why="2025年の政府の節水の呼びかけ（要旨）")
    # S11
    add("S11", 3, "map", **ISL, move=False, layers=[L_caption("川も湖もない島", 0.1)], why="島の地図に戻る")
    add("S11", 9, "diag", sent=1, fn=d_summary, why="結論：屋根とタンクが島の水道、足りない分を海水の水とトラックが埋める")
    add("S11", 5, "globe", sent=3, lon=(-64.8, -50), lat=(32.3, 25), r=(560, 360), cy=560, why="地球全体へ引いて締める")
    # S12
    add("S12", 10, "card", title="地球の事情", sub="地理・歴史・経済で、世界を読み解く", foot="音声：VOICEVOX:雀松朱司", why="締め")
    return S


R.HEAD = {"S01": "白い屋根の島", "S02": "島の場所", "S03": "川がない", "S04": "地下の淡水", "S05": "屋根で集める",
          "S06": "家の下のタンク", "S07": "法律で決まっている", "S08": "雨が足りないとき", "S09": "海水から水をつくる",
          "S10": "節水の呼びかけ", "S11": "島の水道", "S12": ""}
R.shots = shots
_orig_shot_frame = R.shot_frame


def shot_frame(s, t):
    img = slot_frame(s, t)
    return img if img is not None else _orig_shot_frame(s, t)


R.shot_frame = shot_frame


# 社長 2026-11-12「右上や左上の注釈は不要です」: no channel name / scene heading (top left), no source or
# diagram notes and no photo credits (top right), no caption boxes. Sources and credits go to the description.
R.note = lambda *a, **k: None
R.note_ne = lambda *a, **k: None
R.CREDITS = {}
R.L_caption = lambda *a, **k: (lambda img, p, t, d: None)


def frame(t):
    R.TL = R.TL or R.timeline()
    TL = R.TL
    s = ([x for x in TL if x["start"] <= t < x["end"]] or [TL[-1]])[0]
    img = R.drift(s, shot_frame(s, t), t)
    i = TL.index(s)
    if i + 1 < len(TL) and t > s["end"] - R.XF:
        nxt = R.drift(TL[i + 1], shot_frame(TL[i + 1], TL[i + 1]["start"]), TL[i + 1]["start"])
        img = Image.blend(img, nxt, ease((t - (s["end"] - R.XF)) / R.XF))
    img.alpha_composite(R._SUBBG)
    for a, b, lines in R.SUBS:
        if a - 0.05 <= t < b + 0.05:
            y = H - 62 - (len(lines) - 1) * 88
            for j, ln in enumerate(lines):
                text(img, (W / 2, y + j * 88), ln, 72, anchor="ms", stroke=6)
            break
    return np.array(img.convert("RGB"))


def render(t0, t1, path):
    n0, n1 = int(round(t0 * R.FPS)), int(round(t1 * R.FPS))
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(R.FPS),
                          "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", str(path)], stdin=subprocess.PIPE)
    for n in range(n0, n1):
        p.stdin.write(frame(n / R.FPS).tobytes())
    p.stdin.close(); p.wait()


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
            print(f"{s['start']:7.2f}–{s['end']:7.2f} {s['scene']} {s['kind']:6s} {(s['P'].get('slot') or {})} {s['P'].get('title') or ''}")
        return
    if a.shotlist:
        (EP / "shotlist.md").write_text("# カット表（render/render.py から自動生成）\n\n実写は1カット3秒以内・1素材1回。写真・生成画像は Codex の素材（`06e_image_requests.md`）が届くまで Claude の図解で代える。地図は地形の陰影図と Natural Earth（衛星画像ではない）。\n\n" + R.shotlist_md())
        return
    if a.still:
        for t in a.still:
            Image.fromarray(frame(t)).save(OUT / f"still_{t:07.2f}.jpg", quality=88)
        return
    if a.chunks:
        i, m = map(int, a.chunks.split("/"))
        n = int(math.ceil(R.TOTAL / 10.0))
        for c in range(i - 1, n, m):
            dst = OUT / f"c5v2_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"c5v2_{c:03d}.tmp.mp4"
            render(c * 10.0, min(R.TOTAL, (c + 1) * 10.0), tmp)
            tmp.rename(dst)
        return
    if a.mux:
        parts = sorted(OUT.glob("c5v2_[0-9][0-9][0-9].mp4"))
        assert len(parts) == int(math.ceil(R.TOTAL / 10.0)), len(parts)
        (OUT / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts.txt"),
                        "-i", str(OUT / "mix.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-15:TP=-1.5:LRA=11",
                        "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT / "chizu-005-bermuda-roof-water_full_v2.mp4")], check=True)


if __name__ == "__main__":
    main()
