"""Gemini のサムネ（文字入り）の文字を消し、猫の回のサムネと同じ書体（M PLUS Rounded 1c Black、白／黄に黒の極太フチと影）で入れ直す。"""
import sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
F = '/home/user/work_neko/fonts/MPLUSRounded1c-Black-merged.ttf'
YELLOW = (255, 214, 48, 255); WHITE = (255, 255, 255, 255); INK = (16, 16, 16, 255)
def erase(im, boxes):
    W, H = im.size; a = np.asarray(im).astype(int)
    sel = (a.min(axis=2) > 200) | ((a[:, :, 0] > 190) & (a[:, :, 1] > 150) & (a[:, :, 2] < 120)) | (a.max(axis=2) < 60)
    m = np.zeros((H, W), np.uint8)
    for x0, y0, x1, y1 in boxes: m[y0:y1, x0:x1] = (sel[y0:y1, x0:x1] * 255).astype(np.uint8)
    m = cv2.dilate(m, np.ones((15, 15), np.uint8))
    c = cv2.inpaint(cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR), m, 15, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(c, cv2.COLOR_BGR2RGB)).convert('RGBA')
def fit(text, w, h):
    s = 600
    while s > 20:
        f = ImageFont.truetype(F, s); l, t, r, b = f.getbbox(text); sw = max(8, s // 11)
        if r - l + 2 * sw <= w and b - t + 2 * sw <= h: return f
        s -= 2
def put(base, parts, box, align='left', size=None):
    """parts: [(文字, 色)]。box の中に収まる最大の大きさで1行"""
    text = ''.join(p for p, _ in parts); x0, y0, x1, y1 = box; W, H = base.size
    f = ImageFont.truetype(F, size) if size else fit(text, x1 - x0, y1 - y0)
    l, t, r, b = f.getbbox(text); sw = max(8, f.size // 11)
    x = {'left': x0 + sw - l, 'right': x1 - sw - (r - l) - l, 'center': (x0 + x1 - (r - l)) // 2 - l}[align]
    y = y0 + sw - t
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((x + 7, y + 10), text, font=f, fill=(0, 0, 0, 170), stroke_width=sw, stroke_fill=(0, 0, 0, 170))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
    d = ImageDraw.Draw(base); cx = x
    d.text((x, y), text, font=f, fill=WHITE, stroke_width=sw, stroke_fill=INK)
    for p, c in parts:
        d.text((cx, y), p, font=f, fill=c, stroke_width=sw, stroke_fill=INK); cx += f.getlength(p)
    print(text, f.size, 'box', x - sw + l, y - sw + t, x + (r - l) + sw, y + (b - t) + sw)
    return f.size
def save(base, out):
    img = base.convert('RGB').resize((1280, 720), Image.LANCZOS); img.save(out)
    img.resize((320, 180), Image.LANCZOS).save(out.replace('.png', '_320.png'))

