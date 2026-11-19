"""描画した 720p のコマに字幕・章の見出しなどを重ね、1920x1080 の動画にする。
使い方:
  python compose.py seg <shot>    … カットごとの mp4（映像のみ）を作る
  python compose.py final         … 全カットをつなぎ、音（mix.wav）を合わせて完成版を書き出す
"""
import json, os, subprocess, sys, glob
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
OUT = os.environ.get('NEKO_OUT', '/home/user/work_neko/out')
FONTS = '/home/user/work_neko/fonts'
W, H, FPS = 1920, 1080, 24

CITY = {'s01b': ('東京', '午後3時'), 's01c': ('北京', '午後2時'), 's01d': ('イスタンブール', '午前9時'),
        's01e': ('モスクワ', '午前9時'), 's01f': ('ロンドン', '午前6時'), 's01g': ('ニューヨーク', '午前1時')}

_fc = {}
def font(size, w='Bold'):
    k = (size, w)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(f'{FONTS}/NotoSerifJP-{w}.otf', size)
    return _fc[k]


def wrap(text, maxc=22):
    if len(text) <= maxc:
        return [text]
    best, bi = 1e9, len(text) // 2
    for i, ch in enumerate(text):
        if ch in '、。，」' and 4 < i < len(text) - 3:
            sc = abs(i + 1 - len(text) / 2)
            if sc < best:
                best, bi = sc, i + 1
    return [text[:bi], text[bi:]]


_cache = {}
def text_layer(lines, size, fill=(255, 255, 255), stroke=5, shadow=True, w='Bold'):
    """文字だけの RGBA 画像（縁取り・影つき）をキャッシュして返す"""
    k = (tuple(lines), size, fill, stroke, shadow, w)
    if k in _cache:
        return _cache[k]
    f = font(size, w)
    pad = 30
    widths = [int(ImageDraw.Draw(Image.new('L', (1, 1))).textlength(l, font=f)) for l in lines]
    lh = int(size * 1.35)
    im = Image.new('RGBA', (max(widths) + pad * 2, lh * len(lines) + pad * 2), (0, 0, 0, 0))
    if shadow:
        sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(sh)
        for i, l in enumerate(lines):
            x = (im.width - widths[i]) // 2
            d.text((x + 3, pad + i * lh + 4), l, font=f, fill=(0, 0, 0, 170), stroke_width=stroke + 2, stroke_fill=(0, 0, 0, 170))
        sh = sh.filter(ImageFilter.GaussianBlur(6)); im.alpha_composite(sh)
    d = ImageDraw.Draw(im)
    for i, l in enumerate(lines):
        x = (im.width - widths[i]) // 2
        d.text((x, pad + i * lh), l, font=f, fill=fill + (255,), stroke_width=stroke, stroke_fill=(20, 22, 28, 235))
    _cache[k] = im
    return im


def paste(base, layer, cx, cy, alpha=1.0, anchor='c'):
    if alpha <= 0:
        return
    lay = layer
    if alpha < 1:
        lay = layer.copy(); a = lay.getchannel('A').point(lambda v: int(v * alpha)); lay.putalpha(a)
    if anchor == 'c':
        x, y = int(cx - lay.width / 2), int(cy - lay.height / 2)
    else:  # 左上
        x, y = int(cx), int(cy)
    base.alpha_composite(lay, (x, y))


def vignette():
    yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    v = 1 - 0.22 * np.clip(r - 0.55, 0, 1) ** 1.5
    return v[..., None].astype(np.float32)


def tl_info():
    tl = json.load(open(f'{OUT}/timeline.json'))
    import render_shot as R
    return tl, R.shot_table()


def seg(name):
    tl, table = tl_info()
    row = [r for r in table if r['shot'] == name][0]
    ch = [c for c in tl['chapters'] if c['no'] == row['chapter']][0]
    f0, n = row['f0'], row['n']
    frames = sorted(glob.glob(f'{OUT}/frames/{name}/*.png'))
    ghosts = sorted(glob.glob(f'{OUT}/frames/{name}_ghost/*.png'))
    assert len(frames) >= n, (name, len(frames), n)
    os.makedirs(f'{OUT}/seg', exist_ok=True)
    vig = vignette()
    # この章の字幕（全編の時刻）
    subs = []
    for c in tl['chapters']:
        for l in c['lines']:
            subs.append((l['start'] - 0.1, l['end'] + 0.25, l['text']))
    first_line = ch['lines'][0]['start'] if ch['lines'] else ch['start'] + 3
    is_first_shot = abs(row['start'] - ch['start']) < 1e-6
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', f'{OUT}/seg/{name}.mp4'], stdin=subprocess.PIPE)
    for i in range(n):
        t = (f0 + i) / FPS
        img = cv2.imread(frames[i], cv2.IMREAD_COLOR)[:, :, ::-1]
        if ghosts:
            g = cv2.imread(ghosts[i], cv2.IMREAD_UNCHANGED)
            a = (g[:, :, 3:4].astype(np.float32) / 255) * 0.42
            gc = g[:, :, 2::-1].astype(np.float32) * 0.6 + np.array([90, 110, 140], np.float32) * 0.4
            img = (img.astype(np.float32) * (1 - a) + gc * a).astype(np.uint8)
        big = cv2.resize(img, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32) * vig
        # 章の頭は黒からフェードイン
        if is_first_shot and i < 12:
            big *= (i + 1) / 12
        if i >= n - 8 and row['end'] >= ch['end'] - 1e-6:
            big *= (n - i) / 9
        base = Image.fromarray(np.clip(big, 0, 255).astype(np.uint8)).convert('RGBA')
        # 章の見出し（頭の数秒）
        if ch['no'] > 0:
            label = ch['label'] or ('終章' if ch['no'] == 15 else '')
            sub = ch['title'].split(' ― ')[-1]
            t0, t1 = ch['start'] + 0.4, first_line - 0.2
            if t0 <= t <= t1 + 0.6:
                a = min(1, (t - t0) / 0.6, (t1 + 0.6 - t) / 0.6)
                paste(base, text_layer([label], 120, stroke=6), W / 2, H / 2 - 50, a)
                paste(base, text_layer([sub], 54, stroke=4, w='Regular'), W / 2, H / 2 + 70, a)
            elif t > t1:
                a = min(1, (t - t1 - 0.6) / 0.6) * 0.85
                paste(base, text_layer([label], 40, stroke=3, w='Regular'), 60, 40, a, anchor='tl')
        # 冒頭・30日後の時計
        if ch['no'] in (0, 14) and is_first_shot:
            base_t = 14 * 3600 + 59 * 60 + 57
            tt = base_t + (t - ch['start'])
            if t - ch['start'] < 6.5:
                hh, mm, ss = int(tt // 3600) % 24, int(tt // 60) % 60, int(tt) % 60
                a = min(1, (t - ch['start']) / 0.5, (6.5 - (t - ch['start'])) / 0.6)
                paste(base, text_layer([f'{hh:02d}:{mm:02d}:{ss:02d}'], 64, stroke=4, w='Regular'), W - 330, 60, a, anchor='tl')
        # 都市名
        if name in CITY:
            city, tm = CITY[name]
            a = min(1, i / 12, (n - i) / 12)
            paste(base, text_layer([f'{city}　{tm}'], 50, stroke=4), 60, 110, a, anchor='tl')
        # 字幕
        for s0, s1, txt in subs:
            if s0 <= t < s1:
                a = min(1, (t - s0) / 0.15, (s1 - t) / 0.15)
                paste(base, text_layer(wrap(txt), 56, stroke=5), W / 2, H - 150 if len(wrap(txt)) == 1 else H - 185, a)
        ff.stdin.write(np.asarray(base.convert('RGB')).tobytes())
    ff.stdin.close(); ff.wait()
    print('seg', name, n)


def final():
    tl, table = tl_info()
    lst = f'{OUT}/seg/list.txt'
    with open(lst, 'w') as f:
        for r in table:
            f.write(f"file '{OUT}/seg/{r['shot']}.mp4'\n")
    os.makedirs('/home/user/TUBEX/pilots/moshimo-neko-meow/outputs', exist_ok=True)
    dst = f'{OUT}/neko_full.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', f'{OUT}/mix.wav',
                    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', dst], check=True)
    print('final', dst)


if __name__ == '__main__':
    if sys.argv[1] == 'seg':
        for nm in sys.argv[2:]:
            seg(nm)
    else:
        final()
