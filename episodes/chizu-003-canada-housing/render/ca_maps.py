"""Map layers for chizu-003-canada-housing (Natural Earth via the npm packages in chizu-001 render/vendor; public domain).
 - lakes: Natural Earth 1:50m lakes (the relief texture and the 1:10m land layer have no lakes)
 - Canada outline, provinces (1:50m subunits), the land border with the USA (excluding Alaska) and a band within N km of it
All layers take (img, p, t, d) like render_v23 layers; p(lon, lat) -> pixel.
"""
import json
from pathlib import Path
import numpy as np
import cv2
from PIL import Image, ImageDraw

V = Path(__file__).resolve().parents[2] / "chizu-001-australia-coast/render/vendor"
NA50 = V / "sane-topojson-4.0.0/package/dist/north-america_50m.json"
_C = {}


def _layer(obj):
    if obj not in _C:
        import geo
        _C[obj] = geo.load_layer(NA50, obj)
    return _C[obj]


def lakes():
    return [polys for _, _, polys in _layer("lakes")]


def canada():
    import render_v23 as R
    return R.country("Canada")


def usa():
    import render_v23 as R
    return R.country("United States of America")


def provinces():
    if "prov" not in _C:
        import geo
        d = __import__("json").loads(NA50.read_text())
        ca = {g["id"] for g in d["objects"]["subunits"]["geometries"] if (g.get("properties") or {}).get("gu") == "CAN"}
        _C["prov"] = [(gid, n, ps) for gid, n, ps in _layer("subunits") if gid in ca]
    return _C["prov"]


def _is_ca(polys):
    r = polys[0][0]
    return r[:, 1].mean() > 41.5 and -142 < r[:, 0].mean() < -52


def _proj(p, ring):
    X, Y = p(ring[:, 0], ring[:, 1])[:2]
    return np.stack([X, Y], 1)


def fill_polys(img, p, polys_list, fill, outline=None, width=2, alpha=1.0, ss=1):
    L = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    for polys in polys_list:
        for poly in polys:
            for k, ring in enumerate(poly):
                pts = _proj(p, ring)
                if len(pts) < 3 or pts[:, 0].max() < -200 or pts[:, 0].min() > img.width + 200 or pts[:, 1].max() < -200 or pts[:, 1].min() > img.height + 200:
                    continue
                pts = [tuple(x) for x in pts]
                if fill:
                    d.polygon(pts, fill=fill + (int(255 * alpha),) if k == 0 else (0, 0, 0, 0))
                if outline:
                    d.line(pts + [pts[0]], fill=outline + (int(255 * alpha),), width=width, joint="curve")
    img.alpha_composite(L)


LAKE = (150, 196, 226)


def L_lakes(alpha=1.0):
    return lambda img, p, t, d: fill_polys(img, p, lakes(), LAKE, outline=(120, 168, 204), width=1, alpha=alpha)


def mask(img_size, p, polys):
    m = Image.new("L", img_size, 0); d = ImageDraw.Draw(m)
    for poly in polys:
        for k, ring in enumerate(poly):
            pts = [tuple(x) for x in _proj(p, ring)]
            if len(pts) >= 3:
                d.polygon(pts, fill=255 if k == 0 else 0)
    return np.array(m)


def border_points():
    """Canada–USA land border south of 50°N (the boundary the 'within 100 km of the border' figure uses; Alaska excluded)."""
    if "border" not in _C:
        us = {(round(x, 5), round(y, 5)) for poly in usa() for r in poly for x, y in r if y < 50.5}
        segs = []
        for poly in canada():
            r = poly[0]
            near = np.array([y < 50.5 and (round(x, 5), round(y, 5)) in us for x, y in r])
            # runs of consecutive border vertices
            i = 0
            while i < len(r):
                if near[i]:
                    j = i
                    while j < len(r) and near[j]:
                        j += 1
                    if j - i > 3:
                        segs.append(r[i:j])
                    i = j
                else:
                    i += 1
        _C["border"] = segs
    return _C["border"]


def L_band(km=100, t0=0.3, color=(214, 118, 0), kmpp=lambda: 4.0, label=None):
    """Band inside Canada within km of the southern land border; grows in over 1.2 s."""
    def fn(img, p, t, d):
        a = min(1.0, max(0.0, (t - t0) / 1.2))
        if a <= 0:
            return
        k = kmpp()
        m = np.zeros((img.height, img.width), np.uint8)
        for s in border_points():
            pts = _proj(p, s).astype(np.int32)
            cv2.polylines(m, [pts], False, 255, thickness=max(2, int(2 * km / k)), lineType=cv2.LINE_AA)
        m = np.minimum(m, mask(img.size, p, canada()))
        lay = np.zeros((img.height, img.width, 4), np.uint8)
        lay[..., :3] = color
        lay[..., 3] = (m.astype(np.float32) * 0.55 * a).astype(np.uint8)
        img.alpha_composite(Image.fromarray(lay))
        for s in border_points():
            pts = [tuple(x) for x in _proj(p, s)]
            ImageDraw.Draw(img).line(pts, fill=color + (int(255 * a),), width=4)
    return fn


def L_canada(t0=0.0, others=0.6, outline=(60, 70, 80), provinces_on=False):
    """Fade the land outside Canada and outline Canada (and optionally its provinces)."""
    def fn(img, p, t, d):
        a = min(1.0, max(0.0, (t - t0) / 0.8))
        m = mask(img.size, p, canada())
        lay = np.zeros((img.height, img.width, 4), np.uint8)
        lay[..., :3] = (236, 234, 229)
        lay[..., 3] = ((255 - m).astype(np.float32) * others * a).astype(np.uint8)
        img.alpha_composite(Image.fromarray(lay))
        if provinces_on:
            fill_polys(img, p, [pp for _, _, pp in provinces()], None, outline=(120, 128, 136), width=2, alpha=0.7 * a)
        fill_polys(img, p, [canada()], None, outline=outline, width=3, alpha=a)
    return fn
