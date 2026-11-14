"""chizu-005-bermuda-roof-water v4 (long, bright; 社長 2026-11-12「フォントはこのイメージで、動画の色調が暗いので明るくして下さい」).
Same shots, narration and subtitles as v3 (render_v3.py, unchanged). Only the look changes:
 - font: M PLUS Rounded 1c (SIL OFL 1.1, npm @expo-google-fonts/m-plus-rounded-1c 0.4.1, in chizu-001 render/vendor)
 - background: light warm gray instead of the dark navy star field; no dark vignette
 - diagram text: dark on the light background, panels white; accent colors darkened to keep contrast
 - subtitles: white rounded extra-bold with a soft dark shadow (as in the reference image the 社長 sent)
Usage: python3 render_v4.py --still SEC ... | --chunks i/m | --mux
"""
import argparse, math, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render_v3 as V3
from render_v3 import B, R, W, H
import draw, base

OUT = HERE / "out"
FONTS = HERE.parents[1] / "chizu-001-australia-coast/render/vendor/expo-google-fonts-m-plus-rounded-1c-0.4.1/package"
WMAP = {"700Bold": "800ExtraBold", "500Medium": "700Bold", "900Black": "900Black", "800ExtraBold": "800ExtraBold"}
_F = {}


def font(size, weight="700Bold"):
    w = WMAP.get(weight, weight)
    k = (size, w)
    if k not in _F:
        _F[k] = ImageFont.truetype(str(FONTS / w / f"MPLUSRounded1c_{w}.ttf"), size)
    return _F[k]


draw.font = font
for _m in (R, B, V3):
    if hasattr(_m, "font"):
        _m.font = font

# ---------------------------------------------------------------- palette
OLD = {"INK": draw.INK, "MUTED": draw.MUTED, "AMBER": draw.AMBER, "TEAL": draw.TEAL, "RED": draw.RED}
NEW = {"INK": (38, 42, 50), "MUTED": (98, 104, 114), "AMBER": (214, 118, 0), "TEAL": (0, 132, 122), "RED": (206, 60, 48)}
CMAP = {OLD[k]: NEW[k] for k in OLD}
for m in (draw, R, B, V3):
    for k, v in NEW.items():
        if hasattr(m, k):
            setattr(m, k, v)


def remap(c):
    if c is None:
        return c
    rgb = tuple(c[:3])
    if rgb in CMAP:
        return CMAP[rgb] + tuple(c[3:])
    return c


_text0 = draw.text


def text(img, xy, s, size=40, fill=None, weight="700Bold", anchor="la", stroke=4, stroke_fill=(0, 0, 0), alpha=1.0, shadow=True):
    fill = remap(fill) if fill is not None else NEW["INK"]
    if sum(fill[:3]) > 600:            # white text from v3 → dark text on the light background
        fill = NEW["INK"]
    _text0(img, xy, s, size, fill=tuple(fill[:3]), weight=weight, anchor=anchor, stroke=max(2, stroke // 2),
           stroke_fill=(252, 252, 250), alpha=alpha, shadow=False)


_panel0 = draw.panel


def panel(img, box, fill=(8, 14, 28), alpha=0.72, radius=18, outline=None):
    if sum(fill[:3]) < 200:            # dark card → white card with a soft shadow
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
        x0, y0, x1, y1 = box
        ImageDraw.Draw(sh).rounded_rectangle((x0 + 4, y0 + 8, x1 + 4, y1 + 8), radius=radius, fill=(0, 0, 0, int(60 * min(1, alpha))))
        img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
        fill = (255, 255, 255)
    _panel0(img, box, fill=remap(fill), alpha=alpha, radius=radius, outline=remap(outline))


for m in (R, B, V3):
    m.text = text
    m.panel = panel
draw.text = text
draw.panel = panel

# white roofs need an edge on the light background
_roof0 = B.roof


def roof(dr, x0, x1, ybase, h, steps=7, col=B.WHITE):
    _roof0(dr, x0, x1, ybase, h, steps, col)
    cx = (x0 + x1) / 2
    dr.line([(x0, ybase), (cx, ybase - h), (x1, ybase)], fill=(150, 152, 156, 255), width=3, joint="curve")


B.roof = roof
V3.roof = roof

EDGE = (150, 152, 156, 255)


def d_slate(img, t, d):
    """v3 d_slate with an edge on each block (the white lime layer is visible on the light background)."""
    L, dr = B.layer()
    steps = [(B.seg(t, 0.2, 0.8), "木の垂木", (120, 86, 52)), (B.seg(t, 1.0, 1.6), "石灰岩の板", (200, 196, 186)),
             (B.seg(t, 1.8, 2.4), "セメント", (160, 160, 156)), (B.seg(t, 2.6, 3.2), "白い石灰", B.WHITE)]
    for i, (a, s, col) in enumerate(steps):
        if a <= 0:
            continue
        y0 = 720 - i * 90
        for j in range(8 - i):
            x0 = 360 + i * 60 + j * 150
            dr.rectangle([x0, y0 - 70, x0 + 140, y0], fill=col + (int(255 * a),), outline=EDGE[:3] + (int(255 * a),), width=3)
        B.label(img, (1640, y0 - 35), s, a, 44, anchor="lm")
    B.put(img, L, 1.0)
    B.label(img, (960, 170), "白い屋根のつくり", B.seg(t, 0.1, 0.6), 54)


def d_steps(img, t, d):
    """render.py d_steps with an edge on each white slab."""
    L, dr = B.layer()
    n = 7
    for i in range(n):
        x0, y0 = 260 + i * 190, 150 + i * 90
        dr.rectangle([x0, y0, 1700, y0 + 90], fill=B.WHITE + (255,), outline=EDGE, width=3)
        dr.rectangle([x0, y0 + 84, 1700, y0 + 92], fill=(170, 172, 170, 255))
    dr.rectangle([1500, 780, 1760, 820], fill=(200, 200, 196, 255), outline=EDGE, width=3)
    for j in range(14):
        p = (t * 0.35 + j / 14) % 1.0
        i = int(p * n); f = p * n - i
        x = 300 + i * 190 + f * 150; y = 140 + i * 90 + (f > 0.8) * (f - 0.8) * 450
        dr.ellipse([x - 9, y - 9, x + 9, y + 9], fill=B.WATER + (255,))
    B.rain(dr, t, 200, 1700, 20, 160, 50, 0.8)
    B.put(img, L, B.seg(t, 0.0, 0.5))
    B.label(img, (560, 300), "石灰岩の板を重ねた段", B.seg(t, 0.4, 1.0))
    B.label(img, (1630, 730), "雨どいへ", B.seg(t, 1.4, 2.0))


def rain(dr, t, x0, x1, y0, y1, n=60, a=1.0, seed=3):
    """render.py rain in a deeper blue so it shows on the light background."""
    rng = np.random.default_rng(seed)
    xs = rng.uniform(x0, x1, n); ph = rng.uniform(0, 1, n)
    for x, p in zip(xs, ph):
        y = y0 + ((t * 0.9 + p) % 1.0) * (y1 - y0)
        dr.line([(x, y), (x - 6, y + 26)], fill=(84, 146, 214, int(210 * a)), width=3)


B.rain = rain
V3.rain = rain
for _m in (B, V3):
    _m.d_slate = d_slate
    _m.d_steps = d_steps

def d_bars(head, rows, unit=""):
    """v3 d_bars with the label column sized to the longest label (the rounded font is wider; no label runs off the left edge)."""
    lx = max(560, 140 + max(draw.text_w(k, 44) for k, _ in rows))
    x0 = lx + 40
    span = min(900, W - 260 - x0)

    def fn(img, t, d):
        V3.title(img, head, t, y=170)
        mx = max(v for _, v in rows)
        for i, (k, v) in enumerate(rows):
            a = B.seg(t, 0.4 + i * 0.7, 1.4 + i * 0.7)
            y = 320 + i * 130
            text(img, (lx, y), k, 44, anchor="rm", alpha=min(1, a * 2))
            panel(img, (x0, y - 38, x0 + span * v / mx * a, y + 38), fill=NEW["TEAL"] if i else NEW["AMBER"], alpha=0.9, radius=8)
            if a > 0.05:
                text(img, (x0 + 20 + span * v / mx * a, y), f"{v:g}{unit}", 44, anchor="lm", alpha=min(1, a * 2))
    return fn


V3.d_bars = d_bars

# ---------------------------------------------------------------- background
_BG = {}


def space(w, h):
    if (w, h) not in _BG:
        y = np.linspace(0, 1, h)[:, None, None]
        top, mid, bot = np.array([247, 246, 242]), np.array([236, 234, 229]), np.array([200, 195, 188])
        c = np.where(y < 0.66, top + (mid - top) * (y / 0.66), mid + (bot - mid) * ((y - 0.66) / 0.34) ** 1.2)
        _BG[(w, h)] = np.broadcast_to(c, (h, w, 3)).astype(np.float32).copy()
    return _BG[(w, h)]


base.space = space
R.NAVY = (236, 234, 229)
_z = np.zeros((H, W, 4), np.uint8)
R._VIG = Image.fromarray(_z)
yy = np.linspace(0, 1, H)[:, None]
_s = np.zeros((H, W, 4), np.uint8)
_s[..., 3] = (np.clip((yy - 0.80) / 0.20, 0, 1) ** 1.4 * 70).astype(np.uint8)
R._SUBBG = Image.fromarray(_s)


# ---------------------------------------------------------------- subtitles
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
    img = R.drift(s, B.shot_frame(s, t), t)
    i = TL.index(s)
    if i + 1 < len(TL) and t > s["end"] - R.XF:
        nxt = R.drift(TL[i + 1], B.shot_frame(TL[i + 1], TL[i + 1]["start"]), TL[i + 1]["start"])
        img = Image.blend(img, nxt, B.ease((t - (s["end"] - R.XF)) / R.XF))
    img.alpha_composite(R._SUBBG)
    for a, b, lines in R.SUBS:
        if a - 0.05 <= t < b + 0.05:
            subtitle(img, lines)
            break
    return np.array(img.convert("RGB"))


B.frame = frame


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
    a = ap.parse_args()
    if a.still:
        for t in a.still:
            Image.fromarray(frame(t)).save(OUT / f"v4still_{t:07.2f}.jpg", quality=88)
        return
    n = int(math.ceil(R.TOTAL / 10.0))
    if a.chunks:
        i, m = map(int, a.chunks.split("/"))
        for c in range(i - 1, n, m):
            dst = OUT / f"c5v4_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"c5v4_{c:03d}.tmp.mp4"
            render(c * 10.0, min(R.TOTAL, (c + 1) * 10.0), tmp)
            tmp.rename(dst)
        return
    if a.mux:
        parts = sorted(OUT.glob("c5v4_[0-9][0-9][0-9].mp4"))
        assert len(parts) == n, len(parts)
        (OUT / "parts_v4.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts_v4.txt"),
                        "-i", str(OUT / "mix_v3.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-15:TP=-1.5:LRA=11",
                        "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT / "chizu-005-bermuda-roof-water_full_v4_bright.mp4")], check=True)


if __name__ == "__main__":
    main()
