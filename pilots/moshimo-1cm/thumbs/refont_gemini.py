"""Gemini のサムネ（文字入り。1cm の2枚と1000年の1枚）の文字を消し、猫の回のサムネと同じ書体（M PLUS Rounded 1c Black、白／黄に黒の極太フチと影）で入れ直す。
作業場所 /home/user/work_neko/thumbs/g1/ で実行（元画像・完成画像は git 外）。社長（2026-11-27）「初投稿した猫の動画のサムネにフォントを合わせて」
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

# 1000年②：千年眠った／後の世界（右上。天の川をさえぎらない）
b = erase(Image.open('sen_night.jpg').convert('RGB'), [(750, 25, 1330, 305)])
s = put(b, [('千年', YELLOW), ('眠った', WHITE)], (772, 36, 1370, 226), 'right')
put(b, [('後の世界', WHITE)], (772, 154, 1370, 330), 'right')
save(b, 'sen_night_neko.png')
# 1cm②：全人類1cmの世界（上部1行。猫の耳と茶わんに重ねない）
b = erase(Image.open('cm_table.jpg').convert('RGB'), [(230, 25, 1145, 160)])
put(b, [('全人類', WHITE), ('1cm', YELLOW), ('の世界', WHITE)], (40, 4, 1336, 158), 'center')
save(b, 'cm_table_neko.png')
# 1cm①：超小人／の世界（左。猫の顔・前足と小さな人に重ねない）
b = erase(Image.open('cm_cat.jpg').convert('RGB'), [(25, 30, 625, 425)])
s = put(b, [('超小人', YELLOW)], (16, 14, 640, 236))
put(b, [('の世界', WHITE)], (16, 226, 640, 448), size=s)
save(b, 'cm_cat_neko.png')
