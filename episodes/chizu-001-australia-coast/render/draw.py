"""Drawing helpers: fonts, text with outline, basic shapes on RGBA PIL images."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

V = Path(__file__).resolve().parent / "vendor/expo-google-fonts-noto-sans-jp-0.4.4/package"
_F = {}
W, H = 1920, 1080
NAVY = (9, 18, 34)
INK = (240, 244, 250)
AMBER = (255, 184, 76)
TEAL = (90, 214, 200)
RED = (240, 96, 84)
MUTED = (170, 184, 204)


def font(size, weight="700Bold"):
    k = (size, weight)
    if k not in _F:
        name = weight[weight.index(next(c for c in weight if c.isalpha())):]
        _F[k] = ImageFont.truetype(str(V / weight / f"NotoSansJP_{weight}.ttf"), size)
    return _F[k]


def text(img, xy, s, size=40, fill=INK, weight="700Bold", anchor="la", stroke=4, stroke_fill=(0, 0, 0), alpha=1.0, shadow=True):
    if alpha <= 0:
        return
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = font(size, weight)
    if shadow:
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(sh).text((xy[0] + 3, xy[1] + 4), s, font=f, fill=(0, 0, 0, 160), anchor=anchor,
                                stroke_width=stroke + 2, stroke_fill=(0, 0, 0, 160))
        layer.alpha_composite(sh.filter(ImageFilter.GaussianBlur(4)))
    d.text(xy, s, font=f, fill=fill + (255,), anchor=anchor, stroke_width=stroke, stroke_fill=stroke_fill + (255,))
    if alpha < 1:
        a = np.array(layer); a[..., 3] = (a[..., 3] * alpha).astype(np.uint8); layer = Image.fromarray(a)
    img.alpha_composite(layer)


def text_w(s, size, weight="700Bold"):
    b = font(size, weight).getbbox(s)
    return b[2] - b[0]


def wrap(s, size, maxw, weight="700Bold"):
    """Split into balanced lines, preferring breaks after 、 then after particles."""
    if text_w(s, size, weight) <= maxw:
        return [s]
    best = None
    for prefs in ("、", "はがをにでともへの", None):
        for k in range(2, len(s) - 2):
            if prefs and s[k - 1] not in prefs:
                continue
            if s[k] in "、。」）ー" or (prefs is None and False):
                continue
            a, b = s[:k], s[k:]
            wa, wb = text_w(a, size, weight), text_w(b, size, weight)
            score = max(wa, wb)
            if wa <= maxw and best is None or (wa <= maxw and score < best[0]):
                best = (score, a, b)
        if best and best[0] <= maxw:
            break
        if best and prefs != "、":
            break
    if not best:
        k = len(s) // 2; best = (0, s[:k], s[k:])
    _, a, b = best
    return [a] + wrap(b, size, maxw, weight) if text_w(b, size, weight) > maxw else [a, b]


def panel(img, box, fill=(8, 14, 28), alpha=0.72, radius=18, outline=None):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(box, radius=radius, fill=fill + (int(255 * alpha),),
                                            outline=(outline + (220,)) if outline else None, width=3 if outline else 0)
    img.alpha_composite(layer)


def ease(t):
    t = min(1.0, max(0.0, t))
    return t * t * (3 - 2 * t)


def seg(t, a, b):
    """Progress of t within [a, b], eased."""
    return ease((t - a) / max(1e-6, b - a))
