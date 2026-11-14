"""Static textures for the 3D compositor (all from Natural Earth, public domain):
globe.jpg  : equirectangular shaded relief (Natural Earth SR), 4096x2048, slightly brightened (v4 bright look)
hl_ca.png  : equirectangular overlay, Canada outline + light fill (for the globe)"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "episodes/chizu-001-australia-coast/render"))
OUT = Path(__file__).resolve().parents[1] / "public"
Image.MAX_IMAGE_PIXELS = None
im = Image.open(ROOT / "episodes/chizu-005-bermuda-roof-water/render/vendor/shadedrelief.jpg").convert("RGB").resize((4096, 2048), Image.LANCZOS)
im = ImageEnhance.Brightness(im).enhance(1.08)
im.save(OUT / "globe.jpg", quality=90)
import render_v23 as R
W, H = 4096, 2048
ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
for poly in R.country("Canada"):
    for k, ring in enumerate(poly):
        pts = [((x + 180) / 360 * W, (90 - y) / 180 * H) for x, y in ring]
        if len(pts) > 2:
            d.polygon(pts, fill=(214, 118, 0, 70) if k == 0 else (0, 0, 0, 0))
            d.line(pts + [pts[0]], fill=(214, 118, 0, 255), width=4)
ov.save(OUT / "hl_ca.png")
print("ok")
