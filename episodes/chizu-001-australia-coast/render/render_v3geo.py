"""chizu-001-australia-coast v3（地図の演出を作り直した改訂版。1920x1080, 30 fps）。無料・ローカル（numpy / OpenCV / Pillow / ffmpeg）。

社長 2026-11-15「『地球の事情』のオーストラリア動画の制作を再開してください」。Codex の映像部品（geo-video-kit の
render.py / demo.json、北海道の参考動画の代表場面の分析）の表現を、この回の実際のナレーションに合わせて取り入れる：
  - 地形図（陰影図を明るい地図帳の配色に）の滑らかなズームと移動
  - 注目地域の色分け・輪郭の発光・周辺の減光（オーストラリア、ニューサウスウェールズ州）
  - 説明に合わせた地名の順次表示、大きな問い・数値のカード、矢印、同じ範囲の地図の左右比較
変えないもの：v2.3 のナレーション（audio_v2_3）・字幕（subtitles_v2_3.json）・カットの時刻の決め方・実写と資料・図解の中身。
v1〜v2.3（render.py, render_v2.py, render_v22.py, render_v23.py）とその書き出しは上書きしない。

見た目は「地球の事情」の現行ルール（channels/chizu/CHANNEL.md）：明るい背景、丸ゴシック極太の白字幕に柔らかい影、
左上のチャンネル名・見出し・説明の枠、右上の出典・注記・クレジットは画面に出さない（出典は概要欄・06c_assets.md）。

地図の座標：地形の陰影（shadedrelief.jpg）・陸地の形（Natural Earth 1:10m）・境界・地名は、すべて同じ正積方位図法
（Lambert 正積方位、各カットの中心で）の同じ式で描くので、ズームしてもずれない。面積の比較（日本との比較）も正積図法。

Usage: python3 render_v3geo.py --still SEC ... | --part a b OUT | --chunks i/m [--to SEC] | --mux [--to SEC] | --shotlist
"""
import argparse, json, math, subprocess, sys
from pathlib import Path
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render_v23 as R
import draw, base, geo
import terrain

EP = HERE.parent
W, H, FPS = R.W, R.H, R.FPS
OUT = HERE / "out" / "v3geo"; OUT.mkdir(parents=True, exist_ok=True)
EPN = "chizu-001-australia-coast"
ease, seg = draw.ease, draw.seg

# ---------------------------------------------------------------- look: font, palette, text, panels (as chizu-005 v4)
FONTS = HERE / "vendor/expo-google-fonts-m-plus-rounded-1c-0.4.1/package"
WMAP = {"700Bold": "800ExtraBold", "500Medium": "700Bold", "900Black": "900Black", "800ExtraBold": "800ExtraBold"}
_F = {}


def font(size, weight="700Bold"):
    w = WMAP.get(weight, weight)
    k = (int(size), w)
    if k not in _F:
        _F[k] = ImageFont.truetype(str(FONTS / w / f"MPLUSRounded1c_{w}.ttf"), int(size))
    return _F[k]


draw.font = font
R.font = font
OLD = {"INK": draw.INK, "MUTED": draw.MUTED, "AMBER": draw.AMBER, "TEAL": draw.TEAL, "RED": draw.RED}
NEW = {"INK": (38, 42, 50), "MUTED": (98, 104, 114), "AMBER": (214, 118, 0), "TEAL": (0, 132, 122), "RED": (206, 60, 48)}
CMAP = {OLD[k]: NEW[k] for k in OLD}
CMAP[(150, 170, 255)] = (70, 96, 200)
CMAP[(255, 170, 170)] = (200, 60, 60)
for m in (draw, R):
    for k, v in NEW.items():
        setattr(m, k, v)
INK, MUTED, AMBER, TEAL, RED = NEW["INK"], NEW["MUTED"], NEW["AMBER"], NEW["TEAL"], NEW["RED"]
GLOW = (255, 238, 170)


def remap(c):
    if c is None:
        return c
    rgb = tuple(c[:3])
    return CMAP[rgb] + tuple(c[3:]) if rgb in CMAP else c


_text0 = draw.text


def text(img, xy, s, size=40, fill=None, weight="700Bold", anchor="la", stroke=4, stroke_fill=(0, 0, 0), alpha=1.0, shadow=True):
    fill = remap(fill) if fill is not None else INK
    if sum(fill[:3]) > 600:
        fill = INK
    _text0(img, xy, s, size, fill=tuple(fill[:3]), weight=weight, anchor=anchor, stroke=max(2, stroke // 2),
           stroke_fill=(252, 252, 250), alpha=alpha, shadow=False)


_panel0 = draw.panel


def panel(img, box, fill=(8, 14, 28), alpha=0.72, radius=18, outline=None):
    if sum(fill[:3]) < 200:
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
        x0, y0, x1, y1 = box
        ImageDraw.Draw(sh).rounded_rectangle((x0 + 4, y0 + 8, x1 + 4, y1 + 8), radius=radius, fill=(0, 0, 0, int(60 * min(1, alpha))))
        img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
        fill = (255, 255, 255)
    _panel0(img, box, fill=remap(fill), alpha=alpha, radius=radius, outline=remap(outline))


R.text = draw.text = text
R.panel = draw.panel = panel

_BG = {}


def space(w, h):
    if (w, h) not in _BG:
        y = np.linspace(0, 1, h)[:, None, None]
        top, mid, bot = np.array([247, 246, 242]), np.array([236, 234, 229]), np.array([200, 195, 188])
        c = np.where(y < 0.66, top + (mid - top) * (y / 0.66), mid + (bot - mid) * ((y - 0.66) / 0.34) ** 1.2)
        _BG[(w, h)] = np.broadcast_to(c, (h, w, 3)).astype(np.float32).copy()
    return _BG[(w, h)]


R.NAVY = (236, 234, 229)
R._VIG = Image.fromarray(np.zeros((H, W, 4), np.uint8))
_yy = np.linspace(0, 1, H)[:, None]
_s = np.zeros((H, W, 4), np.uint8)
_s[..., 3] = (np.clip((_yy - 0.80) / 0.20, 0, 1) ** 1.4 * 70).astype(np.uint8)
SUBBG = Image.fromarray(_s)

# 社長 2026-11-12「右上や左上の注釈は不要です」: no notes, credits or caption boxes on screen.
R.note = lambda *a, **k: None
R.note_ne = lambda *a, **k: None
R.CREDITS = {}


# ---------------------------------------------------------------- base map: atlas-coloured relief, crisp coastline
_REL = HERE / "vendor" / "shadedrelief.jpg"
assert _REL.exists(), "copy shadedrelief.jpg (chizu-002 render/setup.sh) to render/vendor/"
_RGB = None


def relief_rgb():
    """The relief image itself (natural colours + hill shading), with a little extra local contrast so ranges read on screen."""
    global _RGB
    if _RGB is None:
        im = cv2.cvtColor(cv2.imread(str(_REL)), cv2.COLOR_BGR2RGB).astype(np.float32)
        blur = cv2.GaussianBlur(im, (0, 0), 6)
        _RGB = np.clip(im + 0.6 * (im - blur), 0, 255)
    return _RGB


def sample_rgb(lon, lat):
    t = relief_rgb()
    h, w = t.shape[:2]
    u = (((lon + 180) % 360) / 360 * w).astype(np.float32)
    v = ((90 - lat) / 180 * h).astype(np.float32)
    return cv2.remap(t, u, v, cv2.INTER_CUBIC, borderMode=cv2.BORDER_WRAP)


SEA_NEAR = np.array([176, 208, 226], np.float32)


_LANDPOLY = None


def land_polys():
    global _LANDPOLY
    if _LANDPOLY is None:
        out = []
        for _, _, polys in R.land():
            for poly in polys:
                r = poly[0]
                out.append((r[:, 0].min(), r[:, 0].max(), r[:, 1].min(), r[:, 1].max(), poly))
        _LANDPOLY = out
    return _LANDPOLY


def land_mask(lon0, lat0, kmpp, w=W, h=H, ss=2):
    span_lon = w * kmpp / 111.0 / max(0.2, math.cos(math.radians(lat0))) * 0.8 + 6
    span_lat = h * kmpp / 111.0 * 0.8 + 6
    im = Image.new("L", (w * ss, h * ss), 0); d = ImageDraw.Draw(im)
    for x0, x1, y0, y1, poly in land_polys():
        if x1 < lon0 - span_lon or x0 > lon0 + span_lon or y1 < lat0 - span_lat or y0 > lat0 + span_lat:
            continue
        for k, ring in enumerate(poly):
            x, y = geo.laea(ring[:, 0], ring[:, 1], lon0, lat0)
            X, Y = (w / 2 + x / kmpp) * ss, (h / 2 - y / kmpp) * ss
            if len(X) > 2:
                d.polygon(list(zip(X, Y)), fill=0 if k else 255)
    return np.asarray(im.resize((w, h), Image.LANCZOS), np.float32) / 255.0


TINT = [(-1e9, (150, 186, 140)), (0, (150, 186, 140)), (150, (176, 196, 150)), (400, (204, 200, 160)),
        (800, (214, 192, 152)), (1400, (206, 184, 162)), (3000, (230, 226, 222))]


def tint(z):
    zs = np.array([a for a, _ in TINT[1:]], np.float32); cs = np.array([c for _, c in TINT[1:]], np.float32)
    zc = np.clip(z, zs[0], zs[-1])
    return np.stack([np.interp(zc, zs, cs[:, k]) for k in range(3)], -1)


def dem_shade(lon, lat, kmpp, m):
    """Hypsometric tint × hill shading from the terrain tiles, computed on the output grid (so it follows the projection).
    Close views (< 0.5 km/px): the coastline is also taken from the terrain (land = above 0.5 m), because the 1:10m
    coastline leaves out harbours and bays such as Port Jackson; the two masks are blended by zoom."""
    z = terrain.elevation(lon.astype(np.float32), lat.astype(np.float32))
    ok = ~np.isnan(z)
    z = np.nan_to_num(z, nan=0.0)
    wz = float(np.clip((0.5 - kmpp) / 0.2, 0, 1))
    if wz > 0:
        zm = cv2.GaussianBlur((z > 0.5).astype(np.float32), (0, 0), 0.7)[..., None]
        zm = np.where(ok[..., None], zm, m)
        m = m * (1 - wz) + zm * wz
    z = cv2.GaussianBlur(z, (0, 0), 0.8)
    px = kmpp * 1000.0
    ex = 2.2 if kmpp > 0.4 else 1.6                      # vertical exaggeration for readability
    gx = cv2.Sobel(z, cv2.CV_32F, 1, 0, ksize=3) / (8 * px) * ex
    gy = cv2.Sobel(z, cv2.CV_32F, 0, 1, ksize=3) / (8 * px) * ex
    az, alt = math.radians(315), math.radians(42)        # light from the upper left
    slope = np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
    hs = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect)
    hs = np.clip(hs / math.sin(alt), 0.45, 1.25)
    land = tint(z) * hs[..., None]
    return land * m + SEA_NEAR * (1 - m), m


_AMC = {}
_VIEW = [None]


def atlas_map(lon0, lat0, kmpp, w=W, h=H):
    key = (round(lon0, 6), round(lat0, 6), round(kmpp, 6), w, h)
    if key not in _AMC:
        if len(_AMC) > 3:
            _AMC.pop(next(iter(_AMC)))
        _AMC[key] = _atlas_map(lon0, lat0, kmpp, w, h)
    return _AMC[key].copy()


def _atlas_map(lon0, lat0, kmpp, w=W, h=H):
    """Relief map in the episode's equal-area projection. The coastline comes from the 1:10m vector data at every zoom:
    wide views use the relief colours and draw the coast on top; close views (< 1.2 km/px, finer than the relief image)
    fill land and sea from the vector mask and keep only the relief's local colour, so the coast stays sharp."""
    xs = (np.arange(w, dtype=np.float32) - w / 2) * kmpp
    ys = (h / 2 - np.arange(h, dtype=np.float32)) * kmpp
    X, Y = np.meshgrid(xs, ys)
    lon, lat = geo.laea_inv(X, Y, lon0, lat0)
    rgb = sample_rgb(lon.astype(np.float32), lat.astype(np.float32))
    m = land_mask(lon0, lat0, kmpp, w, h)[..., None]
    rgb = rgb * (0.85 + 0.15 * m) + SEA_NEAR * 0.15 * (1 - m)
    wdem = float(np.clip((1.7 - kmpp) / 0.5, 0, 1))
    on_land = m[..., 0] > 0.5
    cov = False
    if wdem > 0 and on_land.any():
        ll, la_ = lon[on_land], lat[on_land]
        cov = terrain.covered(float(ll.min()), float(ll.max()), float(la_.min()), float(la_.max()))
    if cov:
        shaded, m = dem_shade(lon, lat, kmpp, m)
        rgb = rgb * (1 - wdem) + shaded * wdem
    elif kmpp < 1.2:          # outside the terrain areas: flat tint rather than an over-stretched relief image
        land = cv2.GaussianBlur(rgb, (0, 0), max(3, 3.7 / kmpp))
        rgb = land * m + SEA_NEAR * (1 - m)
    img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert("RGBA")
    edge = cv2.Canny((m[..., 0] * 255).astype(np.uint8), 60, 160)
    e = Image.fromarray(edge).filter(ImageFilter.GaussianBlur(0.8))
    line = Image.new("RGBA", img.size, (96, 110, 100, 0)); line.putalpha(e.point(lambda v: int(v * 0.55)))
    img.alpha_composite(line)
    return img


# globe: same palette, equirectangular texture with the 1:10m land mask
_GTEX = None


def globe_texture(w=8192):
    global _GTEX
    if _GTEX is None:
        p = HERE / "cache" / f"v3geo_atlas_{w}.png"
        if p.exists():
            _GTEX = cv2.cvtColor(cv2.imread(str(p)), cv2.COLOR_BGR2RGB)
        else:
            h = w // 2
            m = Image.new("L", (w, h), 0); d = ImageDraw.Draw(m)
            X = lambda lon: (lon + 180) / 360 * w
            Y = lambda lat: (90 - lat) / 180 * h
            for _, _, polys in R.land():
                for poly in polys:
                    for k, ring in enumerate(poly):
                        lon = np.degrees(np.unwrap(np.radians(ring[:, 0]))); lat = ring[:, 1]
                        if lon.max() - lon.min() > 350:
                            lon = np.concatenate([lon, [lon[-1], lon[0]]]); lat = np.concatenate([lat, [-90, -90]])
                        for off in (-360, 0, 360):
                            d.polygon(list(zip(X(lon + off), Y(lat))), fill=0 if k else 255)
            rgb = cv2.resize(relief_rgb(), (w, h), interpolation=cv2.INTER_AREA)
            mm = (np.asarray(m, np.float32) / 255.0)[..., None]
            rgb = rgb * (0.85 + 0.15 * mm) + SEA_NEAR * 0.15 * (1 - mm)
            _GTEX = np.clip(rgb, 0, 255).astype(np.uint8)
            cv2.imwrite(str(p), cv2.cvtColor(_GTEX, cv2.COLOR_RGB2BGR))
    return _GTEX


base.TEX_SRC = Path("/nonexistent/v3geo")
base._TEX = None
base.texture = globe_texture
base.TEX_LABEL = "v3geo_atlas"


def _space_dark(w, h):
    """Background around the globe: light, as the rest of the episode (no star field)."""
    return space(w, h)


base.space = _space_dark

# ---------------------------------------------------------------- regions: fill, glow, dim outside (Codex's spotlight)
_REG = {}


def region(key):
    if key not in _REG:
        if key == "AUS":
            polys = [p for p in R.country("Australia") if len(p[0]) > 40 and p[0][:, 1].mean() > -45]
        elif key == "NSW":
            polys = R.nsw()
        else:
            raise KeyError(key)
        _REG[key] = polys
    return _REG[key]


_RMC = {}


def region_mask(p, key, size=(W, H)):
    ck = (key, _VIEW[0], size)
    if _VIEW[0] is not None and ck in _RMC:
        return _RMC[ck]
    m = Image.new("L", size, 0); d = ImageDraw.Draw(m)
    for poly in region(key):
        for k, ring in enumerate(poly):
            x, y = p(ring[:, 0], ring[:, 1])[:2]
            if len(x) > 2:
                d.polygon(list(zip(x, y)), fill=0 if k else 255)
    if _VIEW[0] is not None:
        if len(_RMC) > 6:
            _RMC.pop(next(iter(_RMC)))
        _RMC[ck] = m
    return m


_EDC = {}


def spotlight(img, p, key, a, dim=0.42, fill=(232, 190, 92), fill_a=0.16, glow=True):
    if a <= 0:
        return
    m = region_mask(p, key, img.size)
    ma = np.asarray(m, np.float32) / 255.0
    arr = np.asarray(img).astype(np.float32)
    shade = np.array([28, 44, 56], np.float32)
    k = (dim * a) * (1 - ma)[..., None]
    arr[..., :3] = arr[..., :3] * (1 - k) + shade * k
    kf = (fill_a * a) * ma[..., None]
    arr[..., :3] = arr[..., :3] * (1 - kf) + np.array(fill, np.float32) * kf
    out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    if glow:
        ek = id(m)
        if ek not in _EDC:
            if len(_EDC) > 6:
                _EDC.pop(next(iter(_EDC)))
            mm = np.asarray(m)
            k7 = np.ones((7, 7), np.uint8)
            edge = cv2.dilate(mm, k7).astype(np.float32) - cv2.erode(mm, k7).astype(np.float32)
            _EDC[ek] = (m, edge, Image.fromarray(np.clip(edge, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9)))
        _, edge, e = _EDC[ek]
        gl = Image.new("RGBA", img.size, GLOW + (0,))
        gl.putalpha(e.point(lambda v: int(min(255, v * 1.6 * a))))
        out.alpha_composite(gl)
        line = Image.new("RGBA", img.size, (255, 248, 222, 0))
        line.putalpha(Image.fromarray(np.clip(edge, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1)).point(lambda v: int(v * 0.9 * a)))
        out.alpha_composite(line)
    img.paste(out)


def L_spot(key, t0=0.3, dim=0.42, fill_a=0.16, dur=0.8, glow=True):
    return lambda img, p, t, d: spotlight(img, p, key, seg(t, t0, t0 + dur), dim=dim, fill_a=fill_a, glow=glow)


def soft_spot(img, centers, a, dim=0.42, rad=260):
    """Soft round spotlights (no boundary line): dims everything except the given screen points."""
    if a <= 0:
        return
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    keep = np.zeros((H, W), np.float32)
    for (cx, cy) in centers:
        dd = np.hypot(xx - cx, yy - cy) / rad
        keep = np.maximum(keep, np.clip(1.4 - dd, 0, 1))
    arr = np.asarray(img).astype(np.float32)
    k = (dim * a) * (1 - keep)[..., None]
    arr[..., :3] = arr[..., :3] * (1 - k) + np.array([28, 44, 56], np.float32) * k
    img.paste(Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)))


# ---------------------------------------------------------------- labels (place names, shown in narration order)
def pill(img, xy, s, a, size=40, anchor="lm", fg=INK, bg=(250, 246, 234), accent=None):
    if a <= 0:
        return
    f = font(size)
    b = f.getbbox(s)
    tw, th = b[2] - b[0], size
    x, y = xy
    if anchor == "lm":
        box = (x, y - th / 2 - 12, x + tw + 32, y + th / 2 + 14)
    elif anchor == "rm":
        box = (x - tw - 32, y - th / 2 - 12, x, y + th / 2 + 14)
    else:   # "mm"
        box = (x - tw / 2 - 16, y - th / 2 - 12, x + tw / 2 + 16, y + th / 2 + 14)
    L = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((box[0] + 2, box[1] + 5, box[2] + 2, box[3] + 5), radius=10, fill=(0, 0, 0, 70))
    L.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    d.rounded_rectangle(box, radius=10, fill=bg + (240,))
    if accent:
        d.rounded_rectangle((box[0], box[1], box[0] + 8, box[3]), radius=4, fill=accent + (255,))
    d.text(((box[0] + box[2]) / 2 + (4 if accent else 0), (box[1] + box[3]) / 2 + 1), s, font=f, fill=fg + (255,), anchor="mm")
    if a < 1:
        arr = np.array(L); arr[..., 3] = (arr[..., 3] * a).astype(np.uint8); L = Image.fromarray(arr)
    img.alpha_composite(L)


SIDE = {"パース": "l", "アデレード": "l", "メルボルン": "r", "シドニー": "r", "ブリスベン": "r", "キャンベラ": "l"}


def dots(img, p, names, t0=0.0, t=1.0, labels=True, color=None, r=12, stagger=0.25, size=38, side=None, only=None):
    color = remap(color) if color else AMBER
    side = side or SIDE
    d = ImageDraw.Draw(img)
    for i, n in enumerate(names):
        a = seg(t, t0 + i * stagger, t0 + i * stagger + 0.45)
        if a <= 0:
            continue
        res = p(*R.CITIES[n])
        x, y = res[0], res[1]
        if len(res) == 3 and not res[2]:
            continue
        rr = r * (0.5 + 0.5 * a)
        ring = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(ring).ellipse((x - rr * 2.6, y - rr * 2.6, x + rr * 2.6, y + rr * 2.6), fill=(255, 250, 230, int(110 * a)))
        img.alpha_composite(ring.filter(ImageFilter.GaussianBlur(4)))
        d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=color + (255,), outline=(255, 255, 255, 255), width=3)
        if labels:
            s = side.get(n, "r")
            off = rr + 16
            if s == "l":
                pill(img, (x - off, y), n, a, size, anchor="rm")
            else:
                pill(img, (x + off, y), n, a, size, anchor="lm")


R.dots = dots


def points(items, t0=0.3, stagger=0.8):
    """items: (lon, lat, label, side) — a pin with a label pill, shown one after another"""
    def fn(img, p, t, d):
        dd = ImageDraw.Draw(img)
        for i, (lon, lat, s, side) in enumerate(items):
            a = seg(t, t0 + i * stagger, t0 + i * stagger + 0.5)
            if a <= 0:
                continue
            x, y = p(lon, lat)[:2]
            dd.ellipse((x - 13, y - 13, x + 13, y + 13), fill=AMBER + (int(255 * a),), outline=(255, 255, 255, int(255 * a)), width=3)
            if side == "l":
                pill(img, (x - 30, y), s, a, 42, anchor="rm")
            elif side == "t":
                pill(img, (x, y - 50), s, a, 42, anchor="mm")
            else:
                pill(img, (x + 30, y), s, a, 42, anchor="lm")
    return fn


R.L_points = points


# ---------------------------------------------------------------- cards: question, message, number
def scrim(img, a, strength=0.38):
    if a > 0:
        img.alpha_composite(Image.new("RGBA", img.size, (24, 38, 50, int(255 * strength * a))))


def q_card(s, t0=0.3, dim=True):
    """Big question on the map (Codex 'なぜ、この場所に？' style)."""
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 0.6)
        if a <= 0:
            return
        if dim:
            scrim(img, a)
        f = font(92 if len(s) <= 12 else 76, "800ExtraBold")
        L = Image.new("RGBA", img.size, (0, 0, 0, 0)); dl = ImageDraw.Draw(L)
        y = H * 0.42 + (1 - a) * 20
        dl.text((W / 2 + 4, y + 6), s, font=f, fill=(10, 20, 30, 150), anchor="mm")
        L = L.filter(ImageFilter.GaussianBlur(6))
        ImageDraw.Draw(L).text((W / 2, y), s, font=f, fill=(255, 251, 240, 255), anchor="mm", stroke_width=3, stroke_fill=(60, 70, 80, 255))
        if a < 1:
            arr = np.array(L); arr[..., 3] = (arr[..., 3] * a).astype(np.uint8); L = Image.fromarray(arr)
        img.alpha_composite(L)
    return fn


def m_card(s, t0=0.3, y=150, accent=None, size=50):
    """Short message card at the top centre (white card with an accent bar)."""
    def fn(img, p, t, d):
        pill(img, (W / 2, y), s, seg(t, t0, t0 + 0.6), size, anchor="mm", accent=accent or RED)
    return fn


def n_card(num, sub, t0=0.4, pos=(W / 2, 300)):
    """Number card: big number + one line (Codex 'card' on the map)."""
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 0.6)
        if a <= 0:
            return
        fn_ = font(124, "800ExtraBold"); fs = font(40, "700Bold")
        bw = max(fn_.getbbox(num)[2], fs.getbbox(sub)[2]) + 110
        x, y = pos
        box = (x - bw / 2, y - 110, x + bw / 2, y + 112)
        L = Image.new("RGBA", img.size, (0, 0, 0, 0)); dl = ImageDraw.Draw(L)
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle((box[0] + 4, box[1] + 10, box[2] + 4, box[3] + 10), radius=18, fill=(0, 0, 0, 80))
        L.alpha_composite(sh.filter(ImageFilter.GaussianBlur(12)))
        dl.rounded_rectangle(box, radius=18, fill=(252, 249, 240, 245))
        dl.rounded_rectangle((box[0], box[1], box[0] + 12, box[3]), radius=6, fill=RED + (255,))
        dl.text((x, y - 28), num, font=fn_, fill=RED + (255,), anchor="mm")
        dl.text((x, y + 66), sub, font=fs, fill=INK + (255,), anchor="mm")
        if a < 1:
            arr = np.array(L); arr[..., 3] = (arr[..., 3] * a).astype(np.uint8); L = Image.fromarray(arr)
        img.alpha_composite(L)
    return fn


def L_caption(s, t0=0.3, y=170, color=None):
    """v2.3 caption boxes → a question card when the line asks, otherwise a short message card at the top centre."""
    if s.endswith("？"):
        return q_card(s, t0)
    return m_card(s, t0)


R.L_caption = L_caption


def caption_box(img, s, a=1.0, y=170, size=46, x=80, color=None):
    pill(img, (W / 2, 150), s, a, 50, anchor="mm", accent=RED)


R.caption_box = caption_box


# ---------------------------------------------------------------- shot renderers
def r_map(t, d, P):
    k = ease(t / d) if P.get("move", True) else 0
    lv = lambda key: P[key][0] + (P[key][1] - P[key][0]) * k if isinstance(P[key], (list, tuple)) else P[key]
    lon0, lat0, kmpp = lv("lon"), lv("lat"), lv("kmpp")
    R._KMPP[0] = kmpp
    _VIEW[0] = (round(lon0, 6), round(lat0, 6), round(kmpp, 6))
    img = atlas_map(lon0, lat0, kmpp)
    if P.get("dim"):
        img.alpha_composite(Image.new("RGBA", img.size, (28, 44, 56, int(255 * P["dim"]))))
    p = base.map_proj(W, H, lon0, lat0, kmpp)
    for fn in P.get("layers", []):
        fn(img, p, t, d)
    return img


R.r_map = r_map


def r_compare(t, d, P):
    """Two panels of the same map range and scale, side by side (Codex 'compare')."""
    img = Image.fromarray(space(W, H).astype(np.uint8)).convert("RGBA")
    pw, ph = 900, 640
    for i, pan in enumerate(P["panels"]):
        x0, y0 = 50 + i * 920, 230
        lon0, lat0, kmpp = P["lon"], P["lat"], P["kmpp"]
        m = atlas_map(lon0, lat0, kmpp, pw, ph)
        pp = base.map_proj(pw, ph, lon0, lat0, kmpp)
        a = seg(t, pan.get("t0", 0.4), pan.get("t0", 0.4) + 0.8)
        if a > 0:
            centers = [pp(*c)[:2] for c in pan["spots"]]
            big = Image.new("RGBA", (W, H)); big.paste(m, (0, 0))
            arr = np.asarray(m).astype(np.float32)
            yy, xx = np.mgrid[0:ph, 0:pw].astype(np.float32)
            keep = np.zeros((ph, pw), np.float32)
            for cx, cy in centers:
                keep = np.maximum(keep, np.clip(1.4 - np.hypot(xx - cx, yy - cy) / 190, 0, 1))
            kk = (0.45 * a) * (1 - keep)[..., None]
            arr[..., :3] = arr[..., :3] * (1 - kk) + np.array([28, 44, 56], np.float32) * kk
            m = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle((x0 + 4, y0 + 10, x0 + pw + 4, y0 + ph + 10), radius=14, fill=(0, 0, 0, 70))
        img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
        mask = Image.new("L", (pw, ph), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, pw, ph), radius=14, fill=255)
        img.paste(m, (x0, y0), mask)
        for (lon, lat, s) in pan.get("labels", []):
            x, y = pp(lon, lat)[:2]
            pill(img, (x0 + x, y0 + y), s, a, 46, anchor="mm", accent=pan.get("accent"))
        pill(img, (x0 + pw / 2, 175), pan["name"], seg(t, 0.1, 0.6), 46, anchor="mm", accent=pan.get("accent"))
    text(img, (W / 2, 95), "左右は同じ範囲・同じ縮尺", 32, fill=MUTED, anchor="mm", alpha=seg(t, 0.6, 1.2), weight="500Medium")
    return img


_shot_frame0 = R.shot_frame


def shot_frame(s, t):
    if s["kind"] == "compare":
        return r_compare(t - s["start"], s["end"] - s["start"], s["P"])
    return _shot_frame0(s, t)


R.shot_frame = shot_frame


def r_photo(t, d, P):
    """Photo: slow push-in, no credit text on screen. A short place tag (top centre) says where the photo was taken."""
    P2 = dict(P); lab = P2.pop("label", None)
    img = _r_photo0(t, d, P2)
    if lab:
        pill(img, (W / 2, 120), lab, seg(t, 0.2, 0.7), 42, anchor="mm", accent=TEAL)
    return img


_r_photo0 = R.r_photo
R.r_photo = r_photo


# ---------------------------------------------------------------- layers rewritten for the new look
def L_japan(t0=0.6):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.2)
        jp = R.country("Japan")
        jx, jy = 137.5, 36.5
        cx, cy = p(*R.AUS)
        kmpp = R._KMPP[0]
        for poly in jp:
            r = poly[0]
            if len(r) < 30:
                continue
            x, y = geo.laea(r[:, 0], r[:, 1], jx, jy)
            R.polyline(img, list(zip(cx + x / kmpp, cy - y / kmpp)), (200, 50, 50), 3, a, closed=True, fill=(220, 70, 60, 190))
        pill(img, (cx + 230, cy + 70), "日本（同じ縮尺）", a, 40, anchor="lm", accent=RED)
    return fn


def L_nsw(t0=0.3):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.0)
        spotlight(img, p, "NSW", a, dim=0.45, fill=(120, 200, 190), fill_a=0.22)
        x, y = p(146.5, -32.0)
        pill(img, (x, y), "ニューサウスウェールズ州", a, 44, anchor="mm", accent=TEAL)
    return fn


def L_circle(t0=0.5):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 2.0)
        lon, lat = R.CITIES["シドニー"]
        bs = np.linspace(0, 360 * a, max(3, int(240 * a)))
        pts = [p(*geo.dest(lon, lat, b, 160.9)) for b in bs]
        if len(pts) > 1:
            R.polyline(img, pts, RED, 6, 1.0)
        dots(img, p, ["シドニー", "キャンベラ"], t0=0, t=10, size=42)
    return fn


def L_regions(names, t0=0.3):
    pos = {"北部": (133.5, -17.0), "南部": (141.0, -35.0)}
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 0.6)
        for i, n in enumerate(names):
            x, y = p(*pos[n])
            pill(img, (x, y), n, seg(t, t0 + i * 0.7, t0 + i * 0.7 + 0.6), 60, anchor="mm", accent=TEAL)
    return fn


def L_coast_glow(t0=0.5):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 1.0)
        if a <= 0:
            return
        L = Image.new("RGBA", img.size, (0, 0, 0, 0)); dl = ImageDraw.Draw(L)
        for _, _, polys in R.land():
            for poly in polys:
                r = poly[0]
                if 110 < r[:, 0].mean() < 155 and -45 < r[:, 1].mean() < -10 and len(r) > 400:
                    x, y = p(r[:, 0], r[:, 1])[:2]
                    dl.line(list(zip(x, y)) + [(x[0], y[0])], fill=GLOW + (int(255 * a),), width=14, joint="curve")
        img.alpha_composite(L.filter(ImageFilter.GaussianBlur(6)))
        L2 = Image.new("RGBA", img.size, (0, 0, 0, 0)); d2 = ImageDraw.Draw(L2)
        for _, _, polys in R.land():
            for poly in polys:
                r = poly[0]
                if 110 < r[:, 0].mean() < 155 and -45 < r[:, 1].mean() < -10 and len(r) > 400:
                    x, y = p(r[:, 0], r[:, 1])[:2]
                    d2.line(list(zip(x, y)) + [(x[0], y[0])], fill=AMBER + (int(230 * a),), width=5, joint="curve")
        img.alpha_composite(L2)
    return fn


def L_layers(t0=0.4):
    def fn(img, p, t, d):
        cols = [TEAL, AMBER, (70, 96, 200)]
        labs = ["水と気候", "港", "仕事"]
        for i in range(3):
            st = t0 + (0.0, 2.0, 3.9)[i]
            a = seg(t, st, st + 0.8)
            pill(img, (W / 2 - 420 + i * 420, 150), ("× " if i else "") + labs[i], a, 50, anchor="mm", accent=cols[i])
            if a <= 0:
                continue
            for n in R.FIVE:
                x, y = p(*R.CITIES[n])
                rr = 54 + i * 24
                layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
                ImageDraw.Draw(layer).ellipse((x - rr, y - rr, x + rr, y + rr), outline=cols[i] + (int(230 * a),), width=6)
                img.alpha_composite(layer)
    return fn


def L_bay_arrow(t0=1.0):
    def fn(img, p, t, d):
        a = seg(t, t0, t0 + 2.0)
        R.arrow(img, p(151.20, -34.00), p(151.24, -33.86), color=RED, width=9, prog=a, alpha=min(1, a * 3))
    return fn


L_dots = R.L_dots
MAPV, AUS, FIVE = R.MAPV, R.AUS, R.FIVE
AUSV = MAPV(AUS[0], -29.5, 4.0)
d_bars, d_three, d_water, d_hadley, d_coast_section = R.d_bars, R.d_three, R.d_water, R.d_hadley, R.d_coast_section
d_needs, d_timeline, d_cycle, d_network, d_year, d_summary = R.d_needs, R.d_timeline, R.d_cycle, R.d_network, R.d_year, R.d_summary


def shots():
    """v3 edit. Same scene order, sentence anchors and weights as v2.3 (timing logic unchanged); the map shots get the
    new layers. "why" = what the shot shows and why (written to shotlist_v3geo.md)."""
    S = []
    add = lambda sc, w, kind, **P: S.append((sc, w, kind, P))
    SP = L_spot("AUS", 0.0, dur=0.01)          # Australia already highlighted when the shot starts
    # S01 地図に見える疑問
    add("S01", 6, "globe", lon=(60, 134), lat=(5, -26), r=(300, 470), cy=560, why="地球からオーストラリアへ寄る")
    add("S01", 5, "map", sent=1, lon=AUS[0], lat=-28.0, kmpp=(4.6, 3.7), layers=[L_spot("AUS", 0.0, dur=1.2), L_dots(FIVE, 0.4, 0.55)],
        why="大陸を浮かび上がらせ（周辺を減光・輪郭を発光）、読み上げる順に5都市を置く")
    add("S01", 3, "photo", sent=3, file="real_00a_sydney_cbd.jpg", label="シドニー")
    add("S01", 3, "map", **AUSV, move=False, layers=[SP, L_dots(FIVE, 0, 0), q_card("真ん中には、ない", 0.2, dim=False)],
        why="「真ん中には一つもない」を地図の上の大きな文字で")
    add("S01", 6, "map", sent=5, lon=AUS[0], lat=-28.0, kmpp=3.7, move=False, layers=[SP, L_japan(0.3), n_card("約20倍", "面積は日本のおよそ20倍", 1.6, (W / 2, 250))],
        why="日本を同じ縮尺（正積図法）で重ね、数値カードで「約20倍」")
    # S02 「砂漠だから」で終わらない
    add("S02", 6, "map", lon=(134.0, 133.5), lat=(-28.0, -24.5), kmpp=(3.7, 1.6), layers=[q_card("内陸が砂漠だから？", 0.4)],
        why="内陸へ寄りながら、最初の問い")
    add("S02", 5, "map", sent=2, **AUSV, move=False, layers=[SP, L_coast_glow(0.3), q_card("海沿いなら、どこでも？", 0.9, dim=False)],
        why="海岸線を光らせ「海沿いならどこでも」")
    add("S02", 3, "photo", sent=3, file="real_00b_canberra_parliament.jpg", label="首都キャンベラ")
    add("S02", 2, "map", **AUSV, move=False, layers=[SP, L_dots(["シドニー", "キャンベラ"], 0, 0), m_card("首都は、海から離れている", 0.1)],
        why="キャンベラが海から離れている位置")
    add("S02", 7, "diag", sent=4, fn=d_three, why="三つの理由（水・港・仕事）を順に出す")
    # S03 数字で見る偏り①
    add("S03", 8, "diag", fn=d_bars((0, 1)), why="シドニーの数字をグラフで")
    add("S03", 3, "photo", sent=2, file="real_01_melbourne.jpg", label="メルボルン")
    add("S03", 1, "diag", fn=d_bars((1, 2), grow=0.7), why="メルボルンの数字を足す")
    add("S03", 13, "map", sent=3, lon=(151.2, 151.1), lat=(-33.87, -33.6), kmpp=(0.45, 0.3),
        layers=[points([(151.21, -33.87, "シドニー中心部", "r"), (151.34, -33.43, "セントラルコースト", "r")], 0.5, 1.6),
                m_card("「市」ではなく、周りまで含めた「都市圏」", 0.3)], why="都市圏が北のセントラルコーストまで広がる（3文）")
    # S04 数字で見る偏り②
    add("S04", 3, "photo", file="real_02_brisbane.jpg", label="ブリスベン")
    add("S04", 1, "diag", fn=d_bars((2, 3), grow=0.7), why="ブリスベンの数字を足す")
    add("S04", 3, "photo", sent=1, file="real_03_perth.jpg", label="パース")
    add("S04", 3, "map", sent=2, lon=(138.9, 138.45), lat=(-34.6, -34.9), kmpp=(1.4, 0.9),
        layers=[points([(138.60, -34.93, "アデレード", "r"), (137.95, -34.75, "セントビンセント湾", "t")], 0.1, 0.7)],
        why="アデレードが南の湾に面した位置（寄りながら地名を順に）")
    add("S04", 6, "diag", sent=3, fn=d_bars((5, 5)), why="5都市の規模を並べる")
    add("S04", 4, "map", sent=5, **AUSV, move=False, layers=[SP, L_coast_glow(0.2), L_dots(FIVE, 0.0, 0.1), m_card("5都市すべてが、海の近く", 0.4)],
        why="5都市が海に面している")
    # S05 理由1 水
    add("S05", 4, "card", kicker="理由1", title="水と気候", why="章の扉")
    add("S05", 9, "diag", sent=1, fn=d_water, why="飲み水・畑と牧場・工場")
    add("S05", 3, "photo", sent=4, file="real_04_warragamba_dam.jpg", label="ワラガンバ・ダム（シドニーの水がめ）")
    add("S05", 4, "diag", sent=5, fn=d_water, t_off=8.0, why="「広い土地と大勢の暮らしは別」")
    add("S05", 4, "map", sent=6, lon=(AUS[0], 133.5), lat=(-29.5, -25.0), kmpp=(4.0, 2.6), layers=[q_card("なぜ、内陸は乾く？", 0.3)],
        why="次の問い（内陸の乾燥）")
    # S06 空気が下がると、雨が減る
    add("S06", 14, "diag", fn=d_hadley, why="空気の上昇・移動・下降と高気圧（4文）")
    add("S06", 11, "globe", sent=4, lon=(134, 134), lat=(-20, -26), r=(470, 520), cy=560, band=[(-24, -36)], why="亜熱帯高圧帯が大陸の中央にかかる")
    # S07 国全体が同じ気候ではない
    add("S07", 8, "compare", lon=AUS[0], lat=-28.0, kmpp=5.6,
        panels=[{"name": "北部", "spots": [(133.0, -14.5)], "labels": [(133.0, -14.5, "熱帯")], "accent": TEAL, "t0": 0.6},
                {"name": "南部", "spots": [(144.0, -37.0)], "labels": [(144.0, -37.0, "温帯")], "accent": AMBER, "t0": 1.6}],
        why="同じ範囲・同じ縮尺の地図を左右に並べ、北部と南部を比べる（気候区分の境界は描かない）")
    add("S07", 3, "photo", sent=1, file="real_05_tropical_wetland.jpg", label="北部の熱帯（フォッグ・ダム保護区）")
    add("S07", 3, "photo", sent=2, file="real_06_temperate_farmland.jpg", label="南部の温帯（ビクトリア州）")
    add("S07", 1, "map", **AUSV, move=False, layers=[SP, L_regions(("南部",), -5)], why="南部の位置に戻る")
    add("S07", 9, "diag", sent=3, fn=d_coast_section, why="海からの湿った空気と山地（断面図）")
    # S08 理由2 港
    add("S08", 4, "card", kicker="理由2", title="港から始まった街", why="章の扉")
    add("S08", 9, "map", lon=(AUS[0], 148.0), lat=(-28.0, -32.0), kmpp=(3.7, 1.6), layers=[SP, L_coast_glow(0.2), q_card("どの海岸に、大都市が？", 0.6, dim=False)],
        why="「どの海岸に」の問いから南東の海岸へ寄る")
    add("S08", 6, "diag", sent=3, fn=d_needs, why="船団に必要だった二つ（湾と真水）")
    # S09 1788年
    add("S09", 7, "map", lon=(151.2, 151.2), lat=(-33.6, -33.93), kmpp=(0.6, 0.04),
        layers=[points([(151.19, -34.00, "ボタニー湾", "r")], 1.0), n_card("1788年1月", "船団が着いたのはボタニー湾", 2.2, (W / 2, 280))],
        why="ボタニー湾へ寄り、年号を数値カードで")
    add("S09", 3, "photo", sent=2, file="real_07_botany_bay.jpg", label="今のボタニー湾")
    add("S09", 3, "map", lon=151.2, lat=-33.95, kmpp=0.04, move=False,
        layers=[points([(151.19, -34.00, "ボタニー湾", "r")], 0.0), m_card("停泊地も真水も足りない", 0.2)], why="足りなかったもの")
    add("S09", 3, "photo", sent=3, file="real_21_port_jackson_aerial.jpg", label="ポートジャクソン（シドニー湾）")
    add("S09", 3, "map", lon=151.2, lat=-33.93, kmpp=0.045, move=False,
        layers=[points([(151.19, -34.00, "ボタニー湾", "r"), (151.21, -33.86, "シドニー・コーブ", "r")], 0.0, 0.0), L_bay_arrow(0.0)],
        why="ボタニー湾から北のシドニー・コーブへ（矢印）")
    add("S09", 7, "doc", sent=4, file="real_08_sydney_cove_1788.jpg", label="1788年のシドニー・コーブ（当時の水彩画）", zoom=(1.0, 1.06),
        why="入り江と小川を描いた当時の資料（2文）")
    add("S09", 3, "photo", sent=6, file="real_09_circular_quay.jpg", label="今のシドニー・コーブ")
    # S10 それ以前から続く暮らし
    add("S10", 10, "diag", fn=d_timeline, why="植民地化よりはるか前からの暮らし（年表）")
    add("S10", 3, "map", sent=2, lon=(151.2, 151.22), lat=(-33.86, -33.85), kmpp=(0.05, 0.028),
        layers=[points([(151.235, -33.852, "シドニー湾（ポートジャクソン）", "t")], 0.2)], why="シドニー湾のまわり（特定の遺跡は示さない）")
    add("S10", 8, "map", sent=3, **AUSV, move=False, layers=[L_spot("AUS", 0.2, dim=0.5, fill_a=0.06), m_card("土地を奪われていった歴史", 0.5)],
        why="大陸全体で、植民地の拡大と土地の喪失（2文）")
    # S11 理由3 人と仕事
    add("S11", 6, "map", **AUSV, move=False, layers=[SP, L_dots(FIVE, 0, 0), q_card("なぜ、大きいままなのか？", 0.4, dim=False)],
        why="問い（船の時代のあとも大きいまま）")
    add("S11", 3, "card", sent=1, kicker="理由3", title="人と仕事", why="章の扉")
    add("S11", 12, "diag", sent=2, fn=d_cycle, why="人と企業が引き寄せ合う循環（3文）")
    # S12 近くに集まることの強み
    add("S12", 10, "diag", fn=d_network, why="専門の人・取引先・大学のつながり（3文）")
    add("S12", 2, "photo", sent=3, file="real_17_sydney_airport.jpg", label="空港（シドニー）")
    add("S12", 2, "photo", file="real_18_train.jpg", label="鉄道（メルボルン）")
    add("S12", 5, "diag", sent=4, fn=d_network, t_off=10.0, why="「近さの強み」")
    add("S12", 3, "photo", sent=5, file="real_11_suburbs.jpg", label="シドニー西部の住宅地")
    add("S12", 2, "map", lon=151.1, lat=-33.84, kmpp=0.12, move=False,
        layers=[points([(151.21, -33.87, "シドニー中心部", "r"), (151.00, -33.81, "パラマタ", "l")], 0.0, 0.0), m_card("集まりが大きいほど、負担も大きい", 0.2)],
        why="写真の撮影地（パラマタ方面）と中心部")
    # S13 水・港・仕事が重なる
    add("S13", 4, "map", **AUSV, move=False, layers=[SP, L_dots(FIVE, 0.0, 0.0)], why="最初の地図に戻る")
    add("S13", 14, "map", sent=1, **AUSV, move=False, layers=[SP, L_dots(FIVE, 0.0, 0.0, labels=False), L_layers(0.0)], why="水と気候・港・仕事を順に重ねる（5文）")
    # S14 では、キャンベラは？
    add("S14", 6, "map", lon=(AUS[0], 148.5), lat=(-28.0, -34.5), kmpp=(3.7, 1.0), layers=[SP, L_dots(["シドニー", "キャンベラ"], 0.2, 0.6), q_card("では、キャンベラは？", 1.0, dim=False)],
        why="内陸のキャンベラへ寄る（2文）")
    add("S14", 3, "map", sent=2, lon=146.0, lat=-35.0, kmpp=1.6, move=False, layers=[L_dots(["シドニー", "メルボルン", "キャンベラ"], 0, 0.35), m_card("新しい連邦の首都を、どこに置くか", 0.2)],
        why="候補になりえた2大都市と首都")
    add("S14", 9, "diag", sent=3, fn=d_year, why="1908年の議会の決定（年号カード）")
    # S15 人の決断
    add("S15", 8, "map", lon=(147.0, 148.0), lat=(-32.0, -33.0), kmpp=(1.6, 1.25), layers=[L_nsw(0.2)],
        why="憲法の条件（州の中）を、州を浮かび上がらせて示す")
    add("S15", 6, "map", sent=2, lon=150.0, lat=-34.4, kmpp=0.55, move=False, layers=[L_circle(0.3), n_card("100マイル", "シドニーから約160km以上", 2.4, (W / 2 - 360, 300))],
        why="シドニーから100マイルの円を縮尺どおりに描き、数値カード")
    add("S15", 3, "photo", sent=3, file="real_13_canberra_lake.jpg", label="キャンベラ")
    add("S15", 2, "map", lon=148.5, lat=-34.5, kmpp=1.0, move=False, layers=[L_dots(["シドニー", "キャンベラ"], 0, 0), m_card("条件に合わせて選ばれた場所", 0.1)],
        why="条件に合う位置にキャンベラ")
    add("S15", 5, "doc", sent=4, file="real_12_griffin_plan.jpg", label="首都の設計案（グリフィン、1911〜12年）", zoom=(1.0, 1.05),
        why="計画して造った首都の設計図（2文）")
    # S16 内陸にも続く暮らし
    add("S16", 6, "map", **AUSV, move=False, layers=[SP, m_card("大都市がない ≠ 何もない", 0.3)], why="内陸の見方（2文）")
    add("S16", 3, "photo", sent=2, file="real_14_cattle_station.jpg", label="放牧地（クイーンズランド州）")
    add("S16", 3, "photo", file="real_15_inland_park.jpg", label="カリジニ国立公園（西オーストラリア州）")
    add("S16", 4, "map", lon=(134.0, 133.5), lat=(-28.0, -25.0), kmpp=(3.7, 2.4), layers=[m_card("町があり、人々が暮らし続ける土地がある", 0.2)],
        why="内陸全体（特定の地点は示さない）")
    add("S16", 5, "map", sent=3, **AUSV, move=False, layers=[SP, m_card("土地の役割は、人口の多さだけでは測れない", 0.3)], why="結論")
    # S17 最初の地図をもう一度
    add("S17", 7, "map", **AUSV, move=False, layers=[SP, L_dots(FIVE, 0.0, 0.0), m_card("「砂漠だから」だけではない", 0.3)], why="最初の地図に戻る（2文）")
    add("S17", 12, "diag", sent=2, fn=d_summary, why="三つの理由を並べる（3文）")
    add("S17", 7, "globe", sent=5, lon=(134, 120), lat=(-27, -10), r=(500, 330), cy=560, dots=FIVE, dots_t=-1, labels=False, why="5都市から地球全体へ引いて締める")
    # S18
    add("S18", 10, "card", title="地球の事情", sub="地理・歴史・経済で、世界を読み解く", foot="音声：VOICEVOX:雀松朱司", why="締め（チャンネル名）")
    return S


R.shots = shots
R.TL = None


# ---------------------------------------------------------------- frame / subtitles (v4 look)
def subtitle(img, lines):
    f = font(72, "800ExtraBold")
    y0 = H - 62 - (len(lines) - 1) * 88
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
    for j, ln in enumerate(lines):
        ds.text((W / 2, y0 + j * 88 + 5), ln, font=f, fill=(30, 30, 34, 200), anchor="ms", stroke_width=6, stroke_fill=(30, 30, 34, 200))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(7)))
    fg = Image.new("RGBA", img.size, (0, 0, 0, 0)); df = ImageDraw.Draw(fg)
    for j, ln in enumerate(lines):
        df.text((W / 2, y0 + j * 88), ln, font=f, fill=(255, 255, 255, 255), anchor="ms", stroke_width=2, stroke_fill=(120, 120, 124, 255))
    img.alpha_composite(fg)


def frame(t):
    R.TL = R.TL or R.timeline()
    TL = R.TL
    s = ([x for x in TL if x["start"] <= t < x["end"]] or [TL[-1]])[0]
    img = R.drift(s, R.shot_frame(s, t), t)
    i = TL.index(s)
    if i + 1 < len(TL) and t > s["end"] - R.XF:
        nxt = R.drift(TL[i + 1], R.shot_frame(TL[i + 1], TL[i + 1]["start"]), TL[i + 1]["start"])
        img = Image.blend(img, nxt, ease((t - (s["end"] - R.XF)) / R.XF))
    img.alpha_composite(SUBBG)
    for a, b, lines in R.SUBS:
        if a - 0.05 <= t < b + 0.05:
            subtitle(img, lines)
            break
    return np.array(img.convert("RGB"))


def render(t0, t1, path, crf="20"):
    n0, n1 = int(round(t0 * FPS)), int(round(t1 * FPS))
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                          "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", crf, "-pix_fmt", "yuv420p", str(path)], stdin=subprocess.PIPE)
    for n in range(n0, n1):
        p.stdin.write(frame(n / FPS).tobytes())
        if n % 300 == 0:
            print(f"{path.name} {n / FPS:7.1f}s", flush=True)
    p.stdin.close(); p.wait()


def script_scenes():
    """Narration and source line of each scene, from the v2.3 script (the narration is unchanged in v3geo)."""
    out, cur = {}, None
    for ln in (EP / "05_script_v2_3.md").read_text().splitlines():
        if ln.startswith("## S"):
            cur = ln[3:6]; out[cur] = {"title": ln[3:].strip(), "text": "", "src": ""}
        elif cur and ln.startswith("- 出典"):
            out[cur]["src"] = ln.split("：", 1)[-1].strip()
        elif cur and ln.strip() and not ln.startswith(("-", "#", "|")) and not out[cur]["text"]:
            out[cur]["text"] = ln.strip()
    return out


def shotlist_md():
    SS = script_scenes()
    kinds = {"photo": "実写", "doc": "資料（当時の絵・設計図）", "map": "地図", "globe": "地球儀", "diag": "図解", "card": "章の扉", "compare": "地図の左右比較"}
    sents = [(se["start"], se["end"], se["text"], sc["scene"]) for sc in R.TIM["scenes"] for se in sc["sentences"]]
    rows = ["| 場面 | 時刻 | 長さ | 種類 | 素材・地図の範囲 | 重なる読み上げ（冒頭） | 演出・理由 | 出典（台本の出典欄） |", "|---|---|---|---|---|---|---|---|"]
    for s in R.timeline():
        d = s["end"] - s["start"]; P = s["P"]
        if s["kind"] in ("map", "compare"):
            f = lambda v: f"{v[0]}→{v[1]}" if isinstance(v, (list, tuple)) else f"{v}"
            what = f"中心 経度{f(P['lon'])}・緯度{f(P['lat'])}、{f(P['kmpp'])} km/画素"
        elif s["kind"] == "globe":
            what = f"地球儀 中心 経度{P['lon'][0]}→{P['lon'][1]}"
        elif s["kind"] == "diag":
            what = P["fn"].__name__ if hasattr(P["fn"], "__name__") else "図解"
        else:
            what = P.get("file") or P.get("title") or ""
        over = [x for x in sents if x[0] < s["end"] and x[1] > s["start"]]
        nar = " / ".join(x[2][:14] for x in over)
        m, sec = divmod(s["start"], 60)
        src = "06c_assets.md" if s["kind"] in ("photo", "doc") else SS.get(s["scene"], {}).get("src", "")
        rows.append(f"| {s['scene']} | {int(m)}:{sec:05.2f} | {d:.1f}秒 | {kinds[s['kind']]} | {what} | {nar} | {'' if s['kind'] == 'photo' else P.get('why', '')} | {src} |")
    return "\n".join(rows) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--still", type=float, nargs="*")
    ap.add_argument("--chunks")
    ap.add_argument("--to", type=float)
    ap.add_argument("--mux", action="store_true")
    ap.add_argument("--shotlist", action="store_true")
    a = ap.parse_args()
    total = a.to or R.TOTAL
    if a.shotlist:
        (EP / "shotlist_v3geo.md").write_text("# 全編絵コンテ v3geo（render_v3geo.py から自動生成）\n\n"
            "- 時刻・長さはナレーション（audio_v2_3/timings.json）の実測に合わせた値。地図の範囲は「中心の経度・緯度、1画素あたりのkm」（→は動き）\n"
            "- 地図：地形は shadedrelief.jpg（広い範囲）と AWS Terrain Tiles（寄りの範囲。オーストラリアは Geoscience Australia の DEM、CC BY 4.0）、陸地の形は Natural Earth 1:10m。地名・境界・ピンは地図と同じ図法・同じ式で描く\n"
            "- 実写・資料の作者・ライセンスは `06c_assets.md`、数字の出典は `01_research.md`\n\n" + shotlist_md())
        print("shotlist written"); return
    if a.still:
        for t in a.still:
            Image.fromarray(frame(t)).save(OUT / f"still_{t:07.2f}.jpg", quality=90)
            print("still", t, flush=True)
        return
    if a.chunks:
        i, m = map(int, a.chunks.split("/"))
        n = int(math.ceil(total / 10.0))
        for c in range(i - 1, n, m):
            dst = OUT / f"c_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"c_{c:03d}.tmp.mp4"
            render(c * 10.0, min(total, (c + 1) * 10.0), tmp)
            tmp.rename(dst)
        return
    if a.mux:
        n = int(math.ceil(total / 10.0))
        parts = [OUT / f"c_{c:03d}.mp4" for c in range(n)]
        assert all(p.exists() for p in parts), [p.name for p in parts if not p.exists()]
        (OUT / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        name = f"{EPN}_full_v3geo.mp4" if not a.to else f"{EPN}_opening_v3geo_{int(total)}s.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts.txt"),
                        "-i", str(HERE / "out" / "mix_v2_3.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-af", "loudnorm=I=-15:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
                        "-t", f"{total:.3f}", str(OUT / name)], check=True)
        print("muxed", OUT / name); return


if __name__ == "__main__":
    main()
