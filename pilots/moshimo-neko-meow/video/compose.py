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
VER = os.environ.get('NEKO_VER', 'v3')

# 字幕：社長指示（2026-11-20）「字幕のフォントはかなり太字にしてほしい ただし文字も大きくしてつぶれて見えないようにして」
# → 明朝の極太（Noto Serif CJK JP Black, SIL OFL）を 76px・縁 7px・字間 +3px で1行に出す
SUB_FONT, SUB_SIZE, SUB_TRACK, SUB_MAXC = 'NotoSansCJKjp-Black.otf', 76, 3, 20  # 社長指示 2026-11-20：極太ゴシック、縁取り・影なし

_fc = {}
def _telops():
    if VER == 'v5':
        import telops_v5 as T
    else:
        import telops as T
    return T

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


ACCENT = (242, 184, 75)
SANS = f'{FONTS}/NotoSansJP-Bold.otf'
_sf = {}
def sfont(size):
    if size not in _sf:
        _sf[size] = ImageFont.truetype(SANS, size)
    return _sf[size]


def sub_layer(text):
    """字幕1行（極太ゴシック・字間を少し空ける。縁取りと影は付けない＝社長指示 2026-11-20）"""
    k = ('sub', text)
    if k in _cache:
        return _cache[k]
    f = ImageFont.truetype(f'{FONTS}/{SUB_FONT}', SUB_SIZE)
    adv = [f.getlength(c) for c in text]
    w = int(sum(adv) + SUB_TRACK * (len(text) - 1)) + 80; h = int(SUB_SIZE * 1.6)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    y0 = int(SUB_SIZE * 0.2)
    d = ImageDraw.Draw(im); x = 40
    for c, a in zip(text, adv):
        d.text((x, y0), c, font=f, fill=(255, 255, 255, 255)); x += a + SUB_TRACK
    _cache[k] = im
    return im


def split_sub(text, t0, t1, maxc=SUB_MAXC):
    """字幕は1行だけ。長い行は句読点で区切り、文字数に比例した時間で順に出す"""
    if len(text) <= maxc:
        return [(t0, t1, text)]
    pieces, cur = [], ''
    for ch in text:
        cur += ch
        if ch in '、。」？！':
            pieces.append(cur); cur = ''
    if cur:
        pieces.append(cur)
    chunks, cur = [], ''
    for pc in pieces:
        if cur and len(cur) + len(pc) > maxc:
            chunks.append(cur); cur = ''
        cur += pc
    if cur:
        chunks.append(cur)
    out = []
    for c in chunks:  # それでも長いものは半分に
        while len(c) > maxc:  # 句読点がない長い部分は、真ん中に近い助詞のあとで切る
            cand = [i + 1 for i, x in enumerate(c[:-2]) if x in 'てをにはがでへとも' and 4 <= i + 1 <= maxc]
            k = min(cand, key=lambda i: abs(i - len(c) / 2)) if cand else len(c) // 2
            out.append(c[:k]); c = c[k:]
        out.append(c)
    total = sum(len(c) for c in out); t = t0; res = []
    for c in out:
        d = (t1 - t0) * len(c) / total
        res.append((t, t + d, c)); t += d
    return res


def panel(lines, sizes, pad=(26, 16), accent=True, bg=(16, 20, 28, 165)):
    """角丸の半透明パネル（左に差し色の帯）"""
    k = ('panel', tuple(lines), tuple(sizes), accent)
    if k in _cache:
        return _cache[k]
    d0 = ImageDraw.Draw(Image.new('L', (1, 1)))
    ws = [int(d0.textlength(l, font=sfont(z))) for l, z in zip(lines, sizes)]
    hs = [int(z * 1.32) for z in sizes]
    w = max(ws) + pad[0] * 2 + (10 if accent else 0); h = sum(hs) + pad[1] * 2
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 14, fill=bg)
    if accent:
        d.rounded_rectangle((0, 0, 8, h - 1), 4, fill=ACCENT + (255,))
    y = pad[1]
    for i, (l, z) in enumerate(zip(lines, sizes)):
        col = ACCENT if (i == 0 and len(lines) > 1) else (255, 255, 255)
        d.text((pad[0] + (10 if accent else 0), y), l, font=sfont(z), fill=col + (255,))
        y += hs[i]
    _cache[k] = im
    return im


def point_card(text):
    k = ('card', text)
    if k in _cache:
        return _cache[k]
    f = sfont(60); d0 = ImageDraw.Draw(Image.new('L', (1, 1)))
    tw = int(d0.textlength(text, font=f)); w, h = tw + 90, 120
    im = Image.new('RGBA', (w, h + 20), (0, 0, 0, 0))
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle((6, 12, w - 1, h + 8), 18, fill=(0, 0, 0, 120))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 18, fill=(255, 250, 240, 238))
    d.rectangle((24, h - 14, w - 25, h - 8), fill=ACCENT + (255,))
    d.text((45, 18), text, font=f, fill=(28, 30, 38, 255))
    _cache[k] = im
    return im


def recap(ch_no):
    k = ('recap', ch_no)
    if k in _cache:
        return _cache[k]
    T = _telops()
    prev = [T.EVENTS[c] for c in range(max(1, ch_no - 4), ch_no)]
    lines = ['この世界で起きたこと'] + ['✓ ' + e for e in prev] + ['▶ ' + T.EVENTS[ch_no]]
    f = sfont(34); fh = sfont(28)
    d0 = ImageDraw.Draw(Image.new('L', (1, 1)))
    w = max(int(d0.textlength(l, font=f)) for l in lines) + 60; lh = 52
    h = lh * len(lines) + 30
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 16, fill=(16, 20, 28, 170))
    y = 16
    for i, l in enumerate(lines):
        if i == 0:
            d.text((26, y + 4), l, font=fh, fill=ACCENT + (255,))
        elif i == len(lines) - 1:
            d.text((26, y), l, font=f, fill=(255, 255, 255, 255))
        else:
            d.text((26, y), l, font=f, fill=(185, 190, 200, 255))
        y += lh
    _cache[k] = im
    return im


def progress(ch_no):
    """上部右の経過バー（1分後〜30日後）"""
    k = ('prog', ch_no)
    if k in _cache:
        return _cache[k]
    T = _telops()
    w, h = 700, 100; x0, x1, y = 40, w - 40, 30
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 14, fill=(16, 20, 28, 140))
    n = len(T.STEPS); xs = [x0 + (x1 - x0) * i / (n - 1) for i in range(n)]
    cur = ch_no - 1
    d.line((x0, y, x1, y), fill=(120, 126, 138, 255), width=4)
    d.line((x0, y, xs[cur], y), fill=ACCENT + (255,), width=6)
    for i, x in enumerate(xs):
        r = 5 if i != cur else 11
        d.ellipse((x - r, y - r, x + r, y + r), fill=(ACCENT if i <= cur else (150, 155, 165)) + (255,))
    f = sfont(28); lab = T.STEPS[cur]
    tw = d.textlength(lab, font=f); lx = min(max(xs[cur] - tw / 2, 6), w - tw - 6)
    d.text((lx, y + 18), lab, font=f, fill=(255, 255, 255, 255))
    if cur != 0:
        d.text((x0 - 10, y + 22), '0', font=sfont(18), fill=(160, 165, 175, 255))
    _cache[k] = im
    return im


def seg(name):
    T = _telops()
    tl, table = tl_info()
    row = [r for r in table if r['shot'] == name][0]
    ch = [c for c in tl['chapters'] if c['no'] == row['chapter']][0]
    f0, n = row['f0'], row['n']
    if os.environ.get('TEST_N'):
        n = int(os.environ['TEST_N'])
    frames = sorted(glob.glob(f'{OUT}/frames/{name}/*.png'))
    ghosts = sorted(glob.glob(f'{OUT}/frames/{name}_ghost/*.png'))
    assert len(frames) >= n, (name, len(frames), n)
    tag = '_test' if os.environ.get('TEST_N') else ''
    os.makedirs(f'{OUT}/seg', exist_ok=True)
    vig = vignette()
    # 字幕（全編の時刻・1行ずつ）
    subs = []
    for c in tl['chapters']:
        for l in c['lines']:
            subs += split_sub(l['text'], l['start'] - 0.1, l['end'] + 0.25)
    # 要点カード（全編の時刻）
    cards = []
    for cno, li, txt in T.POINTS:
        c = [c for c in tl['chapters'] if c['no'] == cno][0]
        l = c['lines'][li]
        cards.append([l['start'] - 0.05, l['end'] + 1.0, txt])
    cards.sort()
    for i in range(len(cards) - 1):
        cards[i][1] = min(cards[i][1], cards[i + 1][0] - 0.05)
    first_line = ch['lines'][0]['start'] if ch['lines'] else ch['start'] + 3
    is_first_shot = abs(row['start'] - ch['start']) < 1e-6
    label = ch['label']
    last_ch = max(c['no'] for c in tl['chapters'])  # エンドカード（見出し・パネルなし）
    titled = 0 < ch['no'] < last_ch
    t_title0, t_title1 = ch['start'] + 0.4, first_line - 0.2
    info = T.SHOT_INFO.get(name, '')
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', f'{OUT}/seg/{name}{tag}.mp4'], stdin=subprocess.PIPE)
    for i in range(n):
        t = (f0 + i) / FPS
        img = cv2.imread(frames[i], cv2.IMREAD_COLOR)[:, :, ::-1]
        if ghosts:
            g = cv2.imread(ghosts[i], cv2.IMREAD_UNCHANGED)
            a = (g[:, :, 3:4].astype(np.float32) / 255) * 0.42
            gc = g[:, :, 2::-1].astype(np.float32) * 0.6 + np.array([90, 110, 140], np.float32) * 0.4
            img = (img.astype(np.float32) * (1 - a) + gc * a).astype(np.uint8)
        # 要点カードの間は、少し寄る
        card = [c for c in cards if c[0] <= t < c[1]]
        z = 1.0
        if card:
            c0, c1, _ = card[0]
            z = 1 + 0.035 * min(1, (t - c0) / 0.5, max(0, (c1 - t) / 0.5))
        if z > 1.0005:
            hh, ww = img.shape[:2]; cw, chh = int(ww / z), int(hh / z)
            x0_, y0_ = (ww - cw) // 2, (hh - chh) // 2
            img = img[y0_:y0_ + chh, x0_:x0_ + cw]
        big = cv2.resize(img, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32) * vig
        if is_first_shot and i < 12:
            big *= (i + 1) / 12
        if i >= n - 8 and row['end'] >= ch['end'] - 1e-6:
            big *= (n - i) / 9
        base = Image.fromarray(np.clip(big, 0, 255).astype(np.uint8)).convert('RGBA')
        in_title = titled and t_title0 <= t <= t_title1 + 0.6
        # 章の見出し＋「この世界で起きたこと」
        if in_title:
            a = min(1, (t - t_title0) / 0.6, (t_title1 + 0.6 - t) / 0.6)
            sub = ch['title'].split(' ― ')[-1]
            if sub == label:
                sub = ''
            paste(base, text_layer([label], 120, stroke=6), W / 2, H / 2 - 50, a)
            paste(base, text_layer([sub], 54, stroke=4, w='Regular'), W / 2, H / 2 + 70, a)
            if 2 <= ch['no'] < last_ch:
                rc = recap(ch['no'])
                paste(base, rc, 70, H / 2 - rc.height / 2 - 20, a, anchor='tl')
        # 左上：いつ・どこで・何が
        # 時計：冒頭は章の頭から3秒で 15:00:00、30日後は「鳴き声が、止まります」の行で 15:00:00
        clock_t0 = ch['start'] + 3.0 if ch['no'] == 0 else (ch['lines'][2]['start'] if ch['no'] == last_ch - 1 and VER != 'v5' else None)
        clock_on = clock_t0 is not None and is_first_shot and t < clock_t0 + 3.5
        if not in_title and info:
            a = min(1, i / 10, (n - i) / 8) if not (titled and t < t_title1 + 1.2) else min(1, (t - t_title1 - 0.6) / 0.6, (n - i) / 8)
            when = label if ch['no'] > 0 else '日本時間　午後3時'
            paste(base, panel([when, info], [36, 46]), 50, 40, a, anchor='tl')
        # 右上：経過バー
        if titled and not in_title and not clock_on:
            a = min(1, (t - t_title1 - 0.6) / 0.6) if t < t_title1 + 1.2 else 1.0
            pg = progress(ch['no'])
            paste(base, pg, W - pg.width - 50, 40, a * 0.95, anchor='tl')
        # 冒頭・30日後の時計
        if clock_on:
            tt = 15 * 3600 + (t - clock_t0)
            hh_, mm, ss = int(tt // 3600) % 24, int(tt // 60) % 60, int(tt) % 60
            a = min(1, (t - ch['start']) / 0.5, (clock_t0 + 3.5 - t) / 0.6)
            paste(base, text_layer([f'{hh_:02d}:{mm:02d}:{ss:02d}'], 64, stroke=4, w='Regular'), W - 330, 50, a, anchor='tl')
        # 要点カード（ぽんと出る）
        if card and not in_title:
            c0, c1, txt = card[0]
            a = min(1, (t - c0) / 0.2, (c1 - t) / 0.25)
            lay = point_card(txt)
            sc = 0.86 + 0.14 * min(1, (t - c0) / 0.18)
            if sc < 0.999:
                lay = lay.resize((int(lay.width * sc), int(lay.height * sc)), Image.BILINEAR)
            paste(base, lay, W / 2, 250, a)
        # 字幕（1行）
        for s0, s1, txt in subs:
            if s0 <= t < s1:
                a = min(1, (t - s0) / 0.12, (s1 - t) / 0.12)
                paste(base, sub_layer(txt), W / 2, H - 135, a)
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
