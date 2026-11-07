"""Map data (Natural Earth via npm packages) and projections. Lon/lat in degrees."""
import json
from pathlib import Path
import numpy as np

V = Path(__file__).resolve().parent / "vendor"
R = 6371.0


def _topo(path):
    d = json.loads(Path(path).read_text())
    sc, tr = d["transform"]["scale"], d["transform"]["translate"]
    arcs = []
    for a in d["arcs"]:
        a = np.cumsum(np.array(a, float), axis=0)
        arcs.append(a * sc + tr)
    def arc(i):
        return arcs[i] if i >= 0 else arcs[~i][::-1]
    def ring(ids):
        return np.concatenate([arc(i) for i in ids])
    def geom(g):
        t = g["type"]
        if t == "Polygon":
            return [[ring(r) for r in g["arcs"]]]
        if t == "MultiPolygon":
            return [[ring(r) for r in p] for p in g["arcs"]]
        return []
    return d, geom


def load_layer(path, obj, pick=None):
    """Return list of (id, name, polygons) where polygons = [[ring, hole, ...], ...]."""
    d, geom = _topo(path)
    out = []
    for g in d["objects"][obj]["geometries"]:
        gid, name = g.get("id"), (g.get("properties") or {}).get("name")
        if pick and not pick(gid, name):
            continue
        out.append((gid, name, geom(g)))
    return out


def countries10():
    return load_layer(V / "world-atlas-2.0.2/package/countries-10m.json", "countries")


def land10():
    return load_layer(V / "world-atlas-2.0.2/package/land-10m.json", "land")


def subunits50():
    return load_layer(V / "sane-topojson-4.0.0/package/dist/world_50m.json", "subunits")


def laea(lon, lat, lon0, lat0):
    """Lambert azimuthal equal-area, returns km (x east, y north)."""
    l, p = np.radians(lon), np.radians(lat)
    l0, p0 = np.radians(lon0), np.radians(lat0)
    k = np.sqrt(2 / (1 + np.sin(p0) * np.sin(p) + np.cos(p0) * np.cos(p) * np.cos(l - l0)))
    x = R * k * np.cos(p) * np.sin(l - l0)
    y = R * k * (np.cos(p0) * np.sin(p) - np.sin(p0) * np.cos(p) * np.cos(l - l0))
    return x, y


def laea_inv(x, y, lon0, lat0):
    p0, l0 = np.radians(lat0), np.radians(lon0)
    rho = np.hypot(x, y) + 1e-9
    c = 2 * np.arcsin(np.clip(rho / (2 * R), -1, 1))
    lat = np.arcsin(np.cos(c) * np.sin(p0) + y * np.sin(c) * np.cos(p0) / rho)
    lon = l0 + np.arctan2(x * np.sin(c), rho * np.cos(p0) * np.cos(c) - y * np.sin(p0) * np.sin(c))
    return np.degrees(lon), np.degrees(lat)


def ortho(lon, lat, lon0, lat0):
    """Orthographic on unit sphere. Returns x, y (east, north) and visibility."""
    l, p = np.radians(lon), np.radians(lat)
    l0, p0 = np.radians(lon0), np.radians(lat0)
    x = np.cos(p) * np.sin(l - l0)
    y = np.cos(p0) * np.sin(p) - np.sin(p0) * np.cos(p) * np.cos(l - l0)
    vis = np.sin(p0) * np.sin(p) + np.cos(p0) * np.cos(p) * np.cos(l - l0) > 0
    return x, y, vis


def ortho_inv(x, y, lon0, lat0):
    p0, l0 = np.radians(lat0), np.radians(lon0)
    rho = np.hypot(x, y)
    inside = rho <= 1
    rho = np.clip(rho, 1e-9, 1)
    c = np.arcsin(rho)
    lat = np.arcsin(np.cos(c) * np.sin(p0) + y * np.sin(c) * np.cos(p0) / rho)
    lon = l0 + np.arctan2(x * np.sin(c), rho * np.cos(p0) * np.cos(c) - y * np.sin(p0) * np.sin(c))
    return np.degrees(lon), np.degrees(lat), inside


def dest(lon, lat, bearing_deg, dist_km):
    """Great-circle destination point."""
    p1, l1, b, d = np.radians(lat), np.radians(lon), np.radians(bearing_deg), dist_km / R
    p2 = np.arcsin(np.sin(p1) * np.cos(d) + np.cos(p1) * np.sin(d) * np.cos(b))
    l2 = l1 + np.arctan2(np.sin(b) * np.sin(d) * np.cos(p1), np.cos(d) - np.sin(p1) * np.sin(p2))
    return np.degrees(l2), np.degrees(p2)


def gc_km(lon1, lat1, lon2, lat2):
    p1, p2 = np.radians(lat1), np.radians(lat2)
    dl = np.radians(lon2 - lon1)
    return R * np.arccos(np.clip(np.sin(p1) * np.sin(p2) + np.cos(p1) * np.cos(p2) * np.cos(dl), -1, 1))
