"""5-minute trial of chizu-001 (2026-11-10, 社長「まずは5分の試作版から素材Codexに作ってもらって制作してみて」).
v2.3 from 0:00 to the start of S14 (4:58.38), with
- the relief base map (basemap-data 2.0.0 shadedrelief.jpg, same as chizu-002 v2) instead of the flat Natural Earth fill,
- Codex-made explanatory images (../gen_trial/G01..G09.jpg, ledger ../06d_generated_assets_trial.md) behind the
  diagram / chapter-card shots, labelled 「AI生成イメージ」. A missing image falls back to the v2.3 diagram.
Narration, subtitles, photos and shot timing are v2.3 unchanged. render_v23.py and its outputs are not modified.
Usage: python3 render_trial5.py --list | --still SEC ... | --chunks i/m | --mux
"""
import argparse, math, subprocess, sys
from pathlib import Path
import numpy as np, cv2
from PIL import Image, ImageDraw
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render_v23 as R
from render_v23 import W, H, AMBER, TEAL, INK, MUTED, text, seg, ease, panel, arrow
import base, geo

EP = HERE.parent
_REL = HERE / "vendor" / "shadedrelief.jpg"
if not _REL.exists():
    _REL = EP.parent / "chizu-002-new-capitals" / "render" / "vendor" / "shadedrelief.jpg"
assert _REL.exists(), "run ../../chizu-002-new-capitals/render/setup.sh"
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
    R.note(out, "地図：Natural Earth（1:1000万・海岸線は簡略化され、湾の細かい形は省略）")
    return out


R.vector_map = vector_map

_note_ne = R.note_ne


def note_ne(img, s, a=1.0):
    """Shot-specific notes written for the Natural Earth base (v2.3) now sit on the relief map."""
    _note_ne(img, s.replace("地図：Natural Earth", "地図：地形の陰影図（shadedrelief.com／basemap-data）"), a)


R.note_ne = note_ne

END = R.SC["S14"]["start"]          # 298.383: the trial stops before the Canberra part
FADE = 1.2
R.TOTAL = TOTAL = END + FADE
OUT = HERE / "out" / "trial5"; OUT.mkdir(parents=True, exist_ok=True)
GEN = EP / "gen_trial"

# ---------------------------------------------------------------- generated backgrounds
_G = {}


def gen_img(key):
    if key not in _G:
        p = GEN / f"{key}.jpg"
        if not p.exists():
            p = GEN / f"{key}.png"
        _G[key] = None
        if p.exists():
            im = Image.open(p).convert("RGB")
            s = max(W / im.width, H / im.height)
            im = im.resize((math.ceil(im.width * s), math.ceil(im.height * s)), Image.LANCZOS)
            x0, y0 = (im.width - W) // 2, (im.height - H) // 2
            _G[key] = im.crop((x0, y0, x0 + W, y0 + H)).convert("RGBA")
    return _G[key]


def ai_label(img):
    text(img, (W - 40, 40), "AI生成イメージ", 28, fill=(235, 238, 244), anchor="ra", weight="700Bold", stroke=4, shadow=False)


def label(img, xy, s, a, size=56, color=INK):
    if a > 0:
        text(img, xy, s, size, fill=color, anchor="mm", alpha=a, stroke=6)


# overlays per generated image: fn(img, t, d). Positions are fractions of the frame; tuned after the images arrive.
OVER = {}


def ov_labels(items, dim=0.15):
    def fn(img, t, d):
        if dim:
            img.alpha_composite(Image.new("RGBA", img.size, (0, 0, 0, int(255 * dim))))
        for i, (fx, fy, s) in enumerate(items):
            label(img, (fx * W, fy * H), s, seg(t, 0.3 + i * 0.5, 0.9 + i * 0.5))
    return fn


OVER["G01"] = ov_labels([(0.2, 0.2, "水"), (0.5, 0.2, "港"), (0.8, 0.2, "仕事")])
OVER["G03"] = ov_labels([(0.2, 0.2, "飲み水"), (0.5, 0.2, "畑と牧場"), (0.8, 0.2, "工場")])
OVER["G04"] = ov_labels([(0.5, 0.18, "赤道"), (0.5, 0.55, "亜熱帯高圧帯")])
OVER["G05"] = ov_labels([(0.85, 0.25, "海"), (0.5, 0.2, "山脈"), (0.15, 0.25, "内陸")])
OVER["G07"] = ov_labels([(0.3, 0.2, "湾"), (0.7, 0.2, "真水")])
OVER["G09"] = ov_labels([(0.5, 0.15, "人と仕事が呼び合う")])

CARD_GEN = {"水と気候": "G02", "港から始まった街": "G06", "人と仕事": "G08"}
DIAG_GEN = {"d_three": "G01", "d_water": "G03", "d_hadley": "G04", "d_coast_section": "G05", "d_needs": "G07",
            "d_cycle": "G09", "d_network": "G09"}


def gen_key(s):
    if s["kind"] == "card":
        return CARD_GEN.get(s["P"].get("title"))
    if s["kind"] == "diag":
        return DIAG_GEN.get(getattr(s["P"].get("fn"), "__name__", ""))
    return None


_shot_frame = R.shot_frame


def shot_frame(s, t):
    key = gen_key(s)
    g = gen_img(key) if key else None
    if g is None:
        return _shot_frame(s, t)
    d = s["end"] - s["start"]; tt = t - s["start"]
    img = g.copy()
    if s["kind"] == "card":
        img.alpha_composite(Image.new("RGBA", img.size, (0, 0, 0, 70)))
        a = seg(tt, 0.1, 0.7)
        text(img, (W / 2, H / 2 - 120), s["P"]["title"], 92, anchor="mm", alpha=a, stroke=6)
    elif key in OVER:
        OVER[key](img, tt, d)
    ai_label(img)
    return img


R.shot_frame = shot_frame


_frame = R.frame


AFADE = R.SC["S13"]["end"] + 0.1     # audio fades out before S14's first word (298.38)


def frame(t):
    a = _frame(min(t, END - R.XF - 0.1))   # hold the last S13 frame before the crossfade into S14; S14 subtitle never shows
    if t > END:
        k = ease(min(1.0, (t - END) / FADE))
        a = (a.astype(np.float32) * (1 - k)).astype(np.uint8)
    return a


def render(t0, t1, path):
    n0, n1 = int(round(t0 * R.FPS)), int(round(t1 * R.FPS))
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(R.FPS),
                          "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", str(path)],
                         stdin=subprocess.PIPE)
    for n in range(n0, n1):
        p.stdin.write(frame(n / R.FPS).tobytes())
        if n % 240 == 0:
            print(f"{path.name} {n / R.FPS:7.1f}s", flush=True)
    p.stdin.close(); p.wait()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--still", type=float, nargs="*")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--chunks")
    ap.add_argument("--mux", action="store_true")
    a = ap.parse_args()
    if a.list:
        for s in R.timeline():
            if s["start"] < END:
                print(f"{s['start']:7.2f}–{s['end']:7.2f} {s['scene']} {s['kind']:6s} {gen_key(s) or ''} {s['P'].get('file') or s['P'].get('title') or ''}")
        return
    if a.still:
        for t in a.still:
            Image.fromarray(frame(t)).save(OUT / f"still_{t:07.2f}.jpg", quality=88)
        return
    if a.chunks:
        i, m = map(int, a.chunks.split("/"))
        n = int(math.ceil(TOTAL / R.CHUNK))
        for c in range(i - 1, n, m):
            dst = OUT / f"t5_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"t5_{c:03d}.tmp.mp4"
            render(c * R.CHUNK, min(TOTAL, (c + 1) * R.CHUNK), tmp)
            tmp.rename(dst)
        return
    if a.mux:
        parts = sorted(OUT.glob("t5_[0-9][0-9][0-9].mp4"))
        assert len(parts) == int(math.ceil(TOTAL / R.CHUNK)), len(parts)
        (OUT / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        mix = HERE / "out" / "mix_v2_3.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts.txt"),
                        "-i", str(mix), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-af", f"atrim=0:{TOTAL:.3f},afade=t=out:st={AFADE:.3f}:d={END - AFADE - 0.05:.3f},loudnorm=I=-15:TP=-1.5:LRA=11",
                        "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest",
                        str(OUT / "chizu-001-australia-coast_trial5_relief.mp4")], check=True)


if __name__ == "__main__":
    main()
