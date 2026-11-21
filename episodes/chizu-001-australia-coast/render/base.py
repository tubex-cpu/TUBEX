"""Satellite/vector base imagery for globe and map shots."""
from pathlib import Path
import numpy as np, cv2
from PIL import Image, ImageDraw
import geo

HERE = Path(__file__).resolve().parent
CACHE = HERE / "cache"; CACHE.mkdir(exist_ok=True)
TEX_SRC = HERE / "vendor" / "bluemarble.jpg"   # NASA Blue Marble (equirectangular), if downloaded


def vector_texture(w=8192):
    p = CACHE / f"vector_tex_{w}.png"
    if p.exists():
        return cv2.cvtColor(cv2.imread(str(p)), cv2.COLOR_BGR2RGB)
    h = w // 2
    im = Image.new("RGB", (w, h), (14, 40, 74))
    d = ImageDraw.Draw(im)
    for _, _, polys in geo.land10():
        for poly in polys:
            for k, ring in enumerate(poly):
                pts = [((lon + 180) / 360 * w, (90 - lat) / 180 * h) for lon, lat in ring]
                d.polygon(pts, fill=(14, 40, 74) if k else (150, 124, 88))
    im.save(p)
    return np.array(im)


_TEX = None


def texture():
    global _TEX
    if _TEX is None:
        if TEX_SRC.exists():
            t = cv2.cvtColor(cv2.imread(str(TEX_SRC)), cv2.COLOR_BGR2RGB)
        else:
            t = vector_texture()
        _TEX = t
    return _TEX


def sample(lon, lat):
    t = texture()
    h, w = t.shape[:2]
    u = ((lon + 180) % 360) / 360 * w
    v = (90 - lat) / 180 * h
    return cv2.remap(t, u.astype(np.float32), v.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)


def globe(W, H, lon0, lat0, r, cx, cy):
    xs = (np.arange(W, dtype=np.float32) - cx) / r
    ys = (cy - np.arange(H, dtype=np.float32)) / r
    X, Y = np.meshgrid(xs, ys)
    lon, lat, inside = geo.ortho_inv(X, Y, lon0, lat0)
    img = sample(lon, lat).astype(np.float32)
    rho = np.hypot(X, Y)
    shade = np.clip(np.sqrt(np.clip(1 - rho ** 2, 0, 1)), 0, 1) ** 0.35
    img *= shade[..., None]
    bg = space(W, H)
    glow = np.clip(1 - np.abs(rho - 1) / 0.06, 0, 1) * (rho > 1)
    out = np.where(inside[..., None], img, bg)
    out = out + glow[..., None] * np.array([70, 130, 230], np.float32) * 0.8
    return np.clip(out, 0, 255).astype(np.uint8)


_SPACE = {}


def space(W, H):
    if (W, H) not in _SPACE:
        rng = np.random.default_rng(7)
        s = np.zeros((H, W, 3), np.float32)
        s[:] = (4, 8, 18)
        n = 900
        ys, xs = rng.integers(0, H, n), rng.integers(0, W, n)
        b = rng.uniform(60, 200, n)
        s[ys, xs] = b[:, None]
        _SPACE[(W, H)] = cv2.GaussianBlur(s, (0, 0), 0.6)
    return _SPACE[(W, H)]


def flatmap(W, H, lon0, lat0, kmpp, dx=0, dy=0):
    """LAEA map centred on lon0/lat0, kmpp = km per pixel."""
    xs = (np.arange(W, dtype=np.float32) - W / 2 - dx) * kmpp
    ys = (H / 2 + dy - np.arange(H, dtype=np.float32)) * kmpp
    X, Y = np.meshgrid(xs, ys)
    lon, lat = geo.laea_inv(X, Y, lon0, lat0)
    return sample(lon, lat)


def map_proj(W, H, lon0, lat0, kmpp, dx=0, dy=0):
    def p(lon, lat):
        x, y = geo.laea(np.asarray(lon, float), np.asarray(lat, float), lon0, lat0)
        return W / 2 + dx + x / kmpp, H / 2 + dy - y / kmpp
    return p


def globe_proj(lon0, lat0, r, cx, cy):
    def p(lon, lat):
        x, y, vis = geo.ortho(np.asarray(lon, float), np.asarray(lat, float), lon0, lat0)
        return cx + x * r, cy - y * r, vis
    return p
