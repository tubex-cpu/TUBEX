"""High-resolution terrain for the zoomed map shots of v3geo (Sydney, Adelaide, Canberra–Sydney).

Source: AWS Open Data "Terrain Tiles" (terrarium PNG, https://registry.opendata.aws/terrain-tiles/ ), free, no key.
For Australia the tiles are built from the Geoscience Australia DEM (© Commonwealth of Australia (Geoscience Australia),
CC BY 4.0); other inputs include SRTM (public domain), GMTED2010 and ETOPO1. Attribution goes in the description (the
channel shows no source notes on screen). Tiles are cached in render/cache/terrain/ (not in git).

elevation(lon, lat) → metres (float32 arrays), sampled from the best mosaic that covers the point; NaN outside.
"""
import math, urllib.request
from pathlib import Path
import numpy as np, cv2

HERE = Path(__file__).resolve().parent
CACHE = HERE / "cache" / "terrain"
URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
# (name, zoom, lon0, lon1, lat0, lat1)
AREAS = [
    ("sydcore", 12, 150.95, 151.40, -34.12, -33.72),
    ("sydney", 11, 150.55, 151.85, -34.35, -33.15),
    ("adelaide", 10, 137.3, 139.6, -35.6, -34.1),
    ("se", 8, 140.5, 154.5, -39.5, -28.5),
    ("aus6", 6, 108.0, 158.0, -46.0, -6.0),
    ("wide", 4, 70.0, 179.0, -60.0, 20.0),
]


def tile_xy(lon, lat, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return x, y


def fetch(z, x, y):
    p = CACHE / str(z) / str(x) / f"{y}.png"
    if not p.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(URL.format(z=z, x=x, y=y), timeout=60) as r:
            p.write_bytes(r.read())
    return p


_M = {}


def mosaic(name):
    if name in _M:
        return _M[name]
    _, z, lo0, lo1, la0, la1 = next(a for a in AREAS if a[0] == name)
    x0, y0 = tile_xy(lo0, la1, z); x1, y1 = tile_xy(lo1, la0, z)
    X0, Y0, X1, Y1 = int(x0), int(y0), int(x1), int(y1)
    rows = []
    for ty in range(Y0, Y1 + 1):
        row = []
        for tx in range(X0, X1 + 1):
            im = cv2.imread(str(fetch(z, tx, ty)), cv2.IMREAD_UNCHANGED)[..., :3][..., ::-1].astype(np.float32)
            row.append(im[..., 0] * 256 + im[..., 1] + im[..., 2] / 256 - 32768)
        rows.append(np.hstack(row))
    dem = np.vstack(rows).astype(np.float32)
    dem = cv2.medianBlur(np.clip(dem, -11000, 9000), 3)   # drop single-pixel tile spikes (sea depths kept for the sea tint)
    _M[name] = (z, X0, Y0, dem, (lo0, lo1, la0, la1))
    return _M[name]


def elevation(lon, lat, kmpp=None):
    """kmpp (km per screen pixel): mosaics more than 4x finer than the screen are skipped, so one view never mixes
    a fine and a coarse mosaic (that shows as a square seam)."""
    out = np.full(lon.shape, np.nan, np.float32)
    for name, zz, *_ in AREAS:        # finest first
        if kmpp is not None and 40075 * 0.83 / (256 * 2 ** zz) < kmpp / 4:
            continue
        z, X0, Y0, dem, (lo0, lo1, la0, la1) = mosaic(name)
        sel = np.isnan(out) & (lon >= lo0) & (lon <= lo1) & (lat >= la0) & (lat <= la1)
        if not sel.any():
            continue
        n = 2 ** z
        x = (lon[sel] + 180) / 360 * n
        lr = np.radians(lat[sel])
        y = (1 - np.log(np.tan(lr) + 1 / np.cos(lr)) / math.pi) / 2 * n
        u = ((x - X0) * 256).astype(np.float32); v = ((y - Y0) * 256).astype(np.float32)
        n_ = u.size; k = int(math.ceil(n_ / 4096)) * 4096          # remap needs < 32767 rows: sample as a 4096-wide block
        uu = np.full(k, -1, np.float32); vv = np.full(k, -1, np.float32); uu[:n_] = u; vv[:n_] = v
        val = cv2.remap(dem, uu.reshape(-1, 4096), vv.reshape(-1, 4096), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).ravel()
        out[sel] = val[:n_]
    return out


def covered(lon_min, lon_max, lat_min, lat_max):
    return any(lo0 <= lon_min and lon_max <= lo1 and la0 <= lat_min and lat_max <= la1 for _, _, lo0, lo1, la0, la1 in AREAS)


if __name__ == "__main__":
    for name, *_ in AREAS:
        z, X0, Y0, dem, b = mosaic(name)
        print(name, z, dem.shape, float(np.nanmin(dem)), float(np.nanmax(dem)))
