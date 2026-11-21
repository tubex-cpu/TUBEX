"""Trial (not the edit): Natural Earth only, no Blue Marble. Writes two stills to out/ne_alt_*.jpg.
Run: python3 ne_alt.py   (does not touch v2.1 files)"""
import os
os.environ["NE_ONLY"] = "1"
from pathlib import Path
import numpy as np, cv2
from PIL import Image, ImageDraw
import geo, base

CACHE = base.CACHE


def ne_texture(w=8192):
    p = CACHE / f"ne_tex_{w}.png"
    if p.exists():
        return cv2.cvtColor(cv2.imread(str(p)), cv2.COLOR_BGR2RGB)
    h = w // 2
    OCEAN, LAND = (24, 58, 98), (182, 168, 132)
    im = Image.new("RGB", (w, h), OCEAN)
    d = ImageDraw.Draw(im)
    X = lambda lon: (lon + 180) / 360 * w
    Y = lambda lat: (90 - lat) / 180 * h
    for _, _, polys in geo.land10():
        for poly in polys:
            for k, ring in enumerate(poly):
                lon = np.degrees(np.unwrap(np.radians(ring[:, 0])))   # no jump at the antimeridian
                lat = ring[:, 1]
                span = lon.max() - lon.min()
                if span > 350:   # ring around the pole (Antarctica): close it along the bottom edge
                    lon = np.concatenate([lon, [lon[-1], lon[0]]]); lat = np.concatenate([lat, [-90, -90]])
                for off in (-360, 0, 360):
                    pts = list(zip(X(lon + off), Y(lat)))
                    d.polygon(pts, fill=OCEAN if k else LAND)
    # 10-degree graticule, faint (shows it is a map, not a photo)
    for lat in range(-80, 90, 10):
        d.line([(0, Y(lat)), (w, Y(lat))], fill=(60, 90, 130), width=1)
    for lon in range(-180, 180, 10):
        d.line([(X(lon), 0), (X(lon), h)], fill=(60, 90, 130), width=1)
    im.save(p)
    return np.array(im)


base._TEX = ne_texture()

import render_v2 as R


def rivers():
    d, _ = geo._topo(geo.V / "sane-topojson-4.0.0/package/dist/world_50m.json")
    sc, tr = d["transform"]["scale"], d["transform"]["translate"]
    arcs = [np.cumsum(np.array(a, float), axis=0) * sc + tr for a in d["arcs"]]
    out = []
    for g in d["objects"]["rivers"]["geometries"]:
        lines = [g["arcs"]] if g["type"] == "LineString" else g["arcs"]
        for ids in lines:
            pts = np.concatenate([arcs[i] if i >= 0 else arcs[~i][::-1] for i in ids])
            if 110 < pts[:, 0].mean() < 156 and -45 < pts[:, 1].mean() < -9:
                out.append(pts)
    return out


RIV = rivers()


def L_rivers(t0=0.3):
    def fn(img, p, t, d):
        a = R.seg(t, t0, t0 + 1.0)
        for r in RIV:
            x, y = p(r[:, 0], r[:, 1])
            R.polyline(img, list(zip(x, y)), (90, 170, 255), 4, a)
        R.note(img, "地図：Natural Earth（1:1000万の陸地、1:5000万の主な川と湖の中心線）。衛星画像ではない", a)
    return fn


def still(t, shot_patch=None, name="x"):
    R.TL = R.timeline()
    for s in R.TL:
        if s["start"] <= t < s["end"] and shot_patch:
            shot_patch(s)
    Image.fromarray(R.frame(t)).save(R.OUT / f"ne_alt_{name}.jpg", quality=90)


def globe_patch(s):
    pass


def s02_patch(s):
    if s["scene"] == "S02" and s["kind"] == "map" and s["P"].get("layers") and len(s["P"]["layers"]) == 1:
        s["P"] = dict(s["P"]); s["P"]["layers"] = [L_rivers(0.2), R.L_caption("内陸が砂漠だから？", 0.3)]


if __name__ == "__main__":
    still(3.0, None, "globe_0003")
    still(26.0, s02_patch, "interior_0026")
    print("ok")
