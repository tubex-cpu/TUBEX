"""v2.2 base map: Natural Earth only (public domain). Replaces the Blue Marble texture of unknown origin.
- Land: Natural Earth 1:10m land (npm world-atlas 2.0.2). Ocean: one colour. Faint 10-degree graticule.
- Cache: cache/v22_ne_tex_16384.png (v2.2 only; never the old caches).
Call install() before rendering: it points base.TEX_SRC at a path that does not exist and sets the texture,
so the old image cannot be read by accident (base.texture() would otherwise fall back to it)."""
from pathlib import Path
import numpy as np, cv2
from PIL import Image, ImageDraw
import geo, base

OCEAN, LAND, GRID = (24, 58, 98), (182, 168, 132), (60, 90, 130)
TEX_PATH = base.CACHE / "v22_ne_tex_16384.png"
LABEL = "natural_earth_v22"


def build(w=16384):
    if TEX_PATH.exists():
        return cv2.cvtColor(cv2.imread(str(TEX_PATH)), cv2.COLOR_BGR2RGB)
    h = w // 2
    im = Image.new("RGB", (w, h), OCEAN)
    d = ImageDraw.Draw(im)
    X = lambda lon: (lon + 180) / 360 * w
    Y = lambda lat: (90 - lat) / 180 * h
    for _, _, polys in geo.land10():
        for poly in polys:
            for k, ring in enumerate(poly):
                lon = np.degrees(np.unwrap(np.radians(ring[:, 0])))
                lat = ring[:, 1]
                if lon.max() - lon.min() > 350:   # ring around the pole (Antarctica)
                    lon = np.concatenate([lon, [lon[-1], lon[0]]]); lat = np.concatenate([lat, [-90, -90]])
                for off in (-360, 0, 360):
                    d.polygon(list(zip(X(lon + off), Y(lat))), fill=OCEAN if k else LAND)
    for lat in range(-80, 90, 10):
        d.line([(0, Y(lat)), (w, Y(lat))], fill=GRID, width=1)
    for lon in range(-180, 180, 10):
        d.line([(X(lon), 0), (X(lon), h)], fill=GRID, width=1)
    im.save(TEX_PATH)
    return np.array(im)


def install():
    base.TEX_SRC = Path("/nonexistent/v22-no-bluemarble.jpg")
    base._TEX = build()
    base.TEX_LABEL = LABEL
    return base._TEX
