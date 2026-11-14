"""Plates for the 3D re-make of 地球の事情 (社長 2026-11-14「if動画ジャンル参入の動画制作のクオリティを真似して…制作し直して」).
Renders every shot of an approved episode's 2D edit as its own clip WITHOUT subtitles, drift or crossfades
(the 3D compositor in src/ does camera, depth of field, light, transitions and subtitles), and writes
timeline3d.json: shots (start, end, kind, globe params) + where the city dots sit on each plate (for 3D pins).
The narration, subtitles and shot timing are the approved ones (社長「今の尺のままで進めて」).
Usage: python3 scripts/plates.py <ca|bm> [--json] [--shots i/m] [--until SEC]
"""
import importlib.util, json, math, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
EPS = {
    "ca": ("chizu-003-canada-housing", "render.py"),
    "bm": ("chizu-005-bermuda-roof-water", "render_v4.py"),
}
key = sys.argv[1]
EPN, FILE = EPS[key]
RD = ROOT / "episodes" / EPN / "render"
sys.path.insert(0, str(ROOT / "episodes/chizu-005-bermuda-roof-water/render"))
sys.path.insert(0, str(RD))
sys.argv = [sys.argv[0]] + sys.argv[2:]
spec = importlib.util.spec_from_file_location("ep_render", RD / FILE)
E = importlib.util.module_from_spec(spec)
spec.loader.exec_module(E)
R, B = E.R, E.B
W, H, FPS, XF = 1920, 1080, 30, 0.4
OUT = RD / "out/plates"
OUT.mkdir(parents=True, exist_ok=True)

# ---- log where city dots are drawn (shot-relative time -> pixel), for 3D pins
LOG = {}
CUR = {"i": -1, "t": 0.0}
_dots = R.dots


def dots_log(img, p, names, t0=0.0, t=1.0, labels=True, color=None, r=13, stagger=0.25, size=38, side=None, only=None, **k):
    for i, n in enumerate(names):
        res = p(*R.CITIES[n])
        vis = len(res) < 3 or bool(res[2])
        rec = LOG.setdefault(CUR["i"], {}).setdefault(n, {"a0": t0 + i * stagger, "xy": []})
        if vis and (not rec["xy"] or abs(rec["xy"][-1][0] - CUR["t"]) >= 0.2):
            rec["xy"].append([round(CUR["t"], 3), round(float(res[0]), 1), round(float(res[1]), 1)])
    kw = dict(t0=t0, t=t, labels=labels, r=r, stagger=stagger, size=size, side=side, only=only, **k)
    if color is not None:
        kw["color"] = color
    return _dots(img, p, names, **kw)


R.dots = dots_log
if hasattr(E, "L_years"):
    _ly = E.L_years

    def L_years(items, t0=0.3, stagger=0.7, size=40):
        f = _ly(items, t0, stagger, size)

        def fn(img, p, t, d):
            for i, (c, _) in enumerate(items):
                x, y = p(*R.CITIES[c])[:2]
                rec = LOG.setdefault(CUR["i"], {}).setdefault(c, {"a0": t0 + i * stagger, "xy": []})
                if not rec["xy"] or abs(rec["xy"][-1][0] - CUR["t"]) >= 0.2:
                    rec["xy"].append([round(CUR["t"], 3), round(float(x), 1), round(float(y), 1)])
            return f(img, p, t, d)
        return fn
    E.L_years = L_years

# remember the arguments of the big-number diagrams (the 3D version shows them as a raised number block)
V3 = getattr(E, "V3", None) or sys.modules.get("render_v3")
for mod in {E, V3} - {None}:
    if hasattr(mod, "d_big"):
        _db = mod.d_big

        def d_big(*a, _db=_db, **k):
            fn = _db(*a, **k)
            try:
                fn._big = [str(x) for x in a]
            except AttributeError:
                pass
            return fn
        mod.d_big = d_big

TL = R.timeline()
R.TL = TL


def clean(P):
    out = {}
    for k in ("lon", "lat", "r", "cy", "kmpp", "move", "why", "title", "kicker", "scene"):
        if k in P and isinstance(P[k], (int, float, str, bool, list, tuple)):
            out[k] = P[k]
    return out


def render_shot(i, s):
    import numpy as np
    from PIL import Image
    dst = OUT / f"shot_{i:03d}.mp4"
    if dst.exists():
        return
    tmp = OUT / f"shot_{i:03d}.tmp.mp4"
    n = int(math.ceil((s["end"] - s["start"] + XF) * FPS))
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", "-g", "15", str(tmp)], stdin=subprocess.PIPE)
    for k in range(n):
        tt = k / FPS
        CUR["i"], CUR["t"] = i, tt
        img = B.shot_frame(s, s["start"] + tt)
        p.stdin.write(np.array(img.convert("RGB")).tobytes())
    p.stdin.close(); p.wait()
    tmp.rename(dst)
    (OUT / f"pins_{i:03d}.json").write_text(json.dumps(LOG.get(i, {}), ensure_ascii=False))


if "--json" in sys.argv:
    shots = []
    for i, s in enumerate(TL):
        pf = OUT / f"pins_{i:03d}.json"
        fn = s["P"].get("fn")
        shots.append({"i": i, "scene": s["scene"], "kind": s["kind"], "start": round(s["start"], 3), "end": round(s["end"], 3),
                      "P": clean(s["P"]), "big": getattr(fn, "_big", None), "pins": json.loads(pf.read_text()) if pf.exists() else {}})
    subs = json.loads((R.EP / ("subtitles.json" if key == "ca" else "subtitles_v3.json")).read_text())
    tim = R.TIM
    doc = {"episode": EPN, "total": R.TOTAL, "fps": FPS, "xf": XF, "shots": shots,
           "cities": {k: list(v) for k, v in R.CITIES.items()},
           "subs": [{"start": c["start"], "end": c["end"], "lines": c["lines"]} for c in subs],
           "scenes": [{"scene": s["scene"], "start": s["start"], "end": s["end"], "title": s.get("title", "")} for s in tim["scenes"]]}
    (OUT / "timeline3d.json").write_text(json.dumps(doc, ensure_ascii=False, indent=0))
    print("json", len(shots), "shots", R.TOTAL)
    sys.exit()

i_m = next((a.split("=")[1] for a in sys.argv if a.startswith("--shots=")), "1/1")
until = float(next((a.split("=")[1] for a in sys.argv if a.startswith("--until=")), "1e9"))
wi, wm = map(int, i_m.split("/"))
for i, s in enumerate(TL):
    # globes and big numbers are drawn fresh by comp3d.py: no plate needed
    if s["kind"] == "globe" or getattr(s["P"].get("fn"), "_big", None):
        continue
    if (i % wm) == wi - 1 and s["start"] < until:
        render_shot(i, s)
        print(f"{EPN} shot {i}/{len(TL) - 1} done", flush=True)
