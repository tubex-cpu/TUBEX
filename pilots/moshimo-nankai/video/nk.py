"""「もしも南海トラフ巨大地震が起きたら」用の部品。千年眠る動画の mk.py（その下に心臓の hk.py・猫の kit.py）の上に足す。
- 揺れ：カメラの揺れ shake()、物の揺れ jitter()、倒れる・落ちる・崩れる（支点の空 pivot に付けて回す）
- 地図（模式）：earth.png の陸地から描いた日本地図の板＋震源域の帯・震度7の海岸・東西の半分・由比で切れる線・3つの湾・櫛の歯の道
- 港町（焼津の模式。実在の店名は出さない）、避難タワー、津波（白い盛り上がり・黒い水・流される車と家）
- 乗り物：漁船・車・新幹線・飛行機・ヘリ・重機・自衛隊の車・貨物列車・コンテナ船・帆船（江戸の外国の軍艦）
- 室内：高層ビルのオフィス・エレベーター・階段・新幹線の車内・機内・駅・スーパー・体育館・役場・病院・テレビの画面
方針：遺体・犠牲者は映さない（人が波にのまれる場面は作らない）。火事の炎は出さない（稲むらの火だけは小さな目印の灯として）。
"""
import os, sys, math, random
MK = '/home/user/TUBEX/pilots/moshimo-1000nen/video'
if MK not in sys.path:
    sys.path.insert(0, MK)
from mk import *
from mk import _obj, _mtx
from shots import _font
import bmesh
from mathutils import Matrix, Vector, Euler

ASSETS = '/home/user/work_neko/assets'
TEXDIR = ASSETS + '/nankai'
os.makedirs(TEXDIR, exist_ok=True)


# ======================================================================
# 音のメタ・光
# ======================================================================
def NB(amb='city', **kw):
    """音のメタ（audio.py が読む）。rumble/roar=[(f0, f1, 強さ)]、alert=[f]（架空の警報音）、crash=[(f, 強さ)]、speaker=[(f0, f1)]"""
    return MB(amb, **kw)


def day_light(sky_c='#a9c8e4', exp=0.5, ld=(0.55, -0.35, 0.76), shadow=0.42):
    s = bpy.context.scene
    sky(hexc(sky_c)); s.view_settings.exposure = exp
    light_dir(ld); s.display.shading.shadow_intensity = shadow


def night_light(sky_c='#0b1020', exp=-0.05, ld=(0.2, -0.4, 0.8)):
    s = bpy.context.scene
    sky(hexc(sky_c)); s.view_settings.exposure = exp
    light_dir(ld); s.display.shading.shadow_intensity = 0.18


def no_shadow():
    bpy.context.scene.display.shading.show_shadows = False


SEPIA = (0.72, 0.6, 0.44)


def tint_all(kind='gray', amt=0.75):
    """回想：材質と空の色をまとめて褪せた色に（gray＝色を落とす／washi＝和紙のような黄土色）"""
    def conv(c):
        l = 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]
        if kind == 'washi':
            t = (l * SEPIA[0] * 1.25 + 0.04, l * SEPIA[1] * 1.25 + 0.035, l * SEPIA[2] * 1.25 + 0.02)
        else:
            t = (l * 0.98, l * 0.98, l * 1.02)
        return tuple(c[i] * (1 - amt) + t[i] * amt for i in range(3))
    for m in bpy.data.materials:
        if m.name.startswith(('glow', 'beam', 'phglow')):
            continue
        if m.use_nodes and m.node_tree and any(nd.type == 'TEX_IMAGE' for nd in m.node_tree.nodes):
            continue
        c = m.diffuse_color
        m.diffuse_color = (*conv(c[:3]), c[3])
        fcs = fcurves_of(m)
        if fcs:  # 色のキーも褪せさせる
            for i in range(3):
                pass
    w = bpy.context.scene.world
    w.color = conv(w.color)


# ======================================================================
# 揺れ・倒れる・落ちる
# ======================================================================
def _noise(seed, f0, f1, step):
    rnd = random.Random(seed)
    pts = {f: rnd.uniform(-1, 1) for f in range(f0 - step, f1 + 2 * step, step)}
    def g(f):
        a = f0 - step + ((f - (f0 - step)) // step) * step
        u = (f - a) / step
        return pts.get(a, 0) * (1 - u) + pts.get(a + step, 0) * u
    return g


def shake(o, f0, f1, amp=0.12, rot=0.012, seed=1, step=2, ramp=10, decay=None):
    """キーのある物（カメラなど）の位置と向きに揺れを足す。f0〜f1、ramp で強まり・弱まる"""
    gs = [_noise(seed * 7 + i, f0, f1, step) for i in range(6)]
    for fc in fcurves_of(o):
        if fc.data_path not in ('location', 'rotation_euler'):
            continue
        a = amp if fc.data_path == 'location' else rot
        if a <= 0:
            continue
        g = gs[fc.array_index + (3 if fc.data_path == 'rotation_euler' else 0)]
        for k in fc.keyframe_points:
            f = k.co.x
            if f0 <= f <= f1:
                env = min(1.0, (f - f0) / ramp, (f1 - f) / ramp)
                if decay:
                    env *= max(0.25, 1 - (f - f0) / decay)
                d = g(f) * a * env
                k.co.y += d; k.handle_left.y += d; k.handle_right.y += d


def jitter(o, f0, f1, amp=0.05, rot=0.0, seed=1, step=2, ramp=8):
    """キーのない物を揺らす（位置・z 回転）"""
    base = o.location.copy(); r0 = o.rotation_euler.copy()
    gs = [_noise(seed * 11 + i, f0, f1, step) for i in range(4)]
    o.keyframe_insert('location', frame=max(1, f0 - 1))
    if rot:
        o.keyframe_insert('rotation_euler', frame=max(1, f0 - 1))
    for f in range(f0, f1 + 1, step):
        env = min(1.0, (f - f0) / ramp, (f1 - f) / ramp)
        o.location = base + Vector((gs[0](f), gs[1](f), gs[2](f) * 0.4)) * amp * env
        o.keyframe_insert('location', frame=f)
        if rot:
            o.rotation_euler = (r0.x + gs[3](f) * rot * env * 0.5, r0.y, r0.z + gs[3](f) * rot * env)
            o.keyframe_insert('rotation_euler', frame=f)
    o.location = base; o.keyframe_insert('location', frame=f1 + 1)
    if rot:
        o.rotation_euler = r0; o.keyframe_insert('rotation_euler', frame=f1 + 1)


def pivot(loc, rot_z=0.0, name='pv'):
    p = empty(loc, name); p.rotation_euler = (0, 0, rot_z)
    return p


def lbox(parent, loc, size, rgb, rot=(0, 0, 0), name='box'):
    """親のローカル座標に箱（親と一緒に動く）"""
    return link(box(loc, size, rgb, rot=rot, name=name), parent)


def tip(p, f, axis=0, ang=math.pi / 2, dur=10, hold0=True):
    """支点 p を f から dur フレームで ang だけ倒す（倒れる塀・家）。重力で加速するように"""
    r0 = p.rotation_euler.copy()
    if hold0:
        p.keyframe_insert('rotation_euler', frame=1)
    p.keyframe_insert('rotation_euler', frame=max(2, f))
    for k in range(1, 5):
        u = k / 4
        r = list(r0); r[axis] += ang * u * u
        p.rotation_euler = r; p.keyframe_insert('rotation_euler', frame=f + dur * u)
    p.rotation_euler = r0
    p.rotation_euler[axis] += ang


def drop(o, f, z1, dur=8, spin=(0.0, 0.0, 0.0)):
    """o（キーのない物）を f から落とす"""
    z0 = o.location.z
    o.keyframe_insert('location', frame=1); o.keyframe_insert('location', frame=max(2, f))
    o.keyframe_insert('rotation_euler', frame=max(2, f))
    for k in range(1, 5):
        u = k / 4
        o.location.z = z0 + (z1 - z0) * u * u; o.keyframe_insert('location', frame=f + dur * u)
    r = o.rotation_euler
    o.rotation_euler = (r.x + spin[0], r.y + spin[1], r.z + spin[2]); o.keyframe_insert('rotation_euler', frame=f + dur)


def shards(n, center, f, k=24, spread=(2.0, 3.0), c=hexc('#cfe6f2'), seed=1, size=0.06, outward=(0, -1, 0)):
    """窓ガラスのかけら：f に飛び散って落ちる"""
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        o = box(center, (size * rnd.uniform(0.6, 1.6), 0.01, size * rnd.uniform(0.6, 1.6)), c, name='shard')
        o.data.materials.clear(); o.data.materials.append(gmat(c, 0.85, 'glass'))
        # bake 済みの位置なので、移動は location の差分で
        vx = rnd.uniform(-1, 1) * spread[0] + outward[0] * spread[1]
        vy = rnd.uniform(-0.3, 1) * outward[1] * spread[1] + rnd.uniform(-0.5, 0.5)
        vz = rnd.uniform(0.5, 2.5)
        appear(o, f, grow=1)
        T = rnd.randint(14, 24)
        for j in range(0, T + 1, 2):
            t = j / 24.0
            o.location = (vx * t, vy * t, vz * t - 4.9 * t * t * 2.2)
            if center[2] + o.location.z < 0.02:
                o.location.z = 0.02 - center[2]
            o.keyframe_insert('location', frame=f + j)
            o.rotation_euler = (rnd.uniform(0, 6), rnd.uniform(0, 6), 0) if j else (0, 0, 0)
            o.keyframe_insert('rotation_euler', frame=f + j)
        out.append(o)
    return out


def dust(n, center, f, k=14, r=(0.6, 1.4), c=hexc('#b9b1a3'), a=0.45, rise=2.5, seed=2, life=48):
    """崩れた所から上がる土ぼこり（半透明の玉が広がって薄れる）"""
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        p = (center[0] + rnd.uniform(-1.5, 1.5), center[1] + rnd.uniform(-1.5, 1.5), center[2] + rnd.uniform(0, 1))
        o = ball(p, rnd.uniform(*r), c, a=a, seg=10, name='dust')
        s0 = o.scale.copy()
        f0 = f + rnd.randint(0, 8)
        o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=f0)
        o.scale = s0 * 1.0; o.keyframe_insert('scale', frame=f0 + 6)
        o.scale = s0 * 2.4; o.keyframe_insert('scale', frame=f0 + life)
        o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=f0 + life + 1)
        o.keyframe_insert('location', frame=f0)
        o.location.z += rise; o.keyframe_insert('location', frame=f0 + life)
        out.append(o)
    return out


def bend_tower(loc, w, d, h, wall, win, segs=12, name='bt', lit=None, seed=1):
    """しなる高層ビル：縦に積んだ節（空の鎖）に壁と窓。戻り値：節の空のリスト（sway_tower で揺らす）"""
    rnd = random.Random(seed)
    root = empty(loc, name)
    joints = []
    par = root; hs = h / segs
    for i in range(segs):
        j = empty((0, 0, hs if i else 0), f'{name}_j'); link(j, par)
        link(box((0, 0, hs / 2), (w, d, hs * 1.002), wall), j)
        fl = max(1, int(hs / 3.6))
        for k in range(fl):
            z = (k + 0.5) * hs / fl
            c = win
            if lit is not None and rnd.random() < lit:
                c = hexc('#ffd98a')
            link(box((0, -d / 2 - 0.03, z), (w * 0.9, 0.06, hs / fl * 0.55), c), j)
            link(box((-w / 2 - 0.03, 0, z), (0.06, d * 0.9, hs / fl * 0.55), c), j)
            link(box((w / 2 + 0.03, 0, z), (0.06, d * 0.9, hs / fl * 0.55), c), j)
        joints.append(j); par = j
    return root, joints


def sway_tower(joints, n, f0, f1, amp=0.012, period=96, axis=1, phase=0.0, ramp=48):
    """節ごとに少しずつ曲げる（上ほど大きく動く）。period フレームでゆっくり往復"""
    for i, j in enumerate(joints):
        for f in range(1, n + 2, 4):
            env = 0.0 if f < f0 or f > f1 else min(1.0, (f - f0) / ramp, (f1 - f) / ramp + 1.0)
            v = amp * env * math.sin(2 * math.pi * (f - f0) / period + phase)
            r = [0, 0, 0]; r[axis] = v
            j.rotation_euler = r; j.keyframe_insert('rotation_euler', frame=f)


# ======================================================================
# 地図（模式）
# ======================================================================
MAP_R = (128.3, 142.2, 29.6, 37.9)   # 経度・緯度の範囲
MAP_K = 8.0
COSL = math.cos(math.radians(34.0))


def MP(lon, lat, z=0.0, R=None, K=None):
    R = R or MAP_R; K = K or MAP_K
    cx = (R[0] + R[1]) / 2; cy = (R[2] + R[3]) / 2
    return ((lon - cx) * COSL * K, (lat - cy) * K, z)


def map_size(R=None, K=None):
    R = R or MAP_R; K = K or MAP_K
    return ((R[1] - R[0]) * COSL * K, (R[3] - R[2]) * K)


_LANDHI = {}


def land_mask(R, W, H):
    """earth.png の陸地（緑）を、R の範囲で W×H に拡大してなめらかにした 0/255 の画像"""
    from PIL import Image, ImageFilter
    k = (R, W, H)
    if k in _LANDHI:
        return _LANDHI[k]
    im = Image.open(ASSETS + '/earth.png').convert('RGB')
    EW, EH = im.size
    x0 = (R[0] + 180) / 360 * EW; x1 = (R[1] + 180) / 360 * EW
    y0 = (90 - R[3]) / 180 * EH; y1 = (90 - R[2]) / 180 * EH
    import numpy as np
    a = np.asarray(im).astype(np.int32)
    land = ((a[..., 1] > a[..., 2] + 5) | ((a[..., 0] > 150) & (a[..., 1] > 140) & (a[..., 2] < 140))).astype(np.uint8) * 255
    L = Image.fromarray(land, 'L').crop((int(x0) - 2, int(y0) - 2, int(x1) + 3, int(y1) + 3))
    sx = W / (x1 - x0); sy = H / (y1 - y0)
    L = L.resize((int(L.width * sx), int(L.height * sy)), Image.BICUBIC).filter(ImageFilter.GaussianBlur(sx * 0.45))
    off = (int((x0 - (int(x0) - 2)) * sx), int((y0 - (int(y0) - 2)) * sy))
    L = L.crop((off[0], off[1], off[0] + W, off[1] + H)).point(lambda v: 255 if v > 118 else 0)
    _LANDHI[k] = L
    return L


def _save_atomic(im, path):
    tmp = f'{path}.{os.getpid()}.tmp.png'
    im.save(tmp); os.replace(tmp, path)


MAP_LABELS = [('東京', 139.69, 35.69), ('名古屋', 136.91, 35.18), ('大阪', 135.5, 34.69), ('静岡', 138.38, 34.98),
              ('高知', 133.53, 33.56), ('宮崎', 131.42, 31.91)]


def map_tex(name='nk_map', R=None, W=2048, labels=MAP_LABELS, sea=(18, 36, 60), land=(206, 196, 170), coast=(240, 234, 216), sea_labels=()):
    """地図の絵（PNG）。同じ名前があれば作り直さない（並列描画で同じ絵を書き合わない）"""
    from PIL import Image, ImageDraw, ImageFilter
    R = R or MAP_R
    path = f'{TEXDIR}/{name}.png'
    if os.path.exists(path):
        return path
    Wm, Hm = map_size(R)
    H = int(W * Hm / Wm)
    L = land_mask(R, W, H)
    im = Image.new('RGB', (W, H), sea)
    # 海の明暗（沖ほど濃く）
    g = Image.linear_gradient('L').resize((W, H)).point(lambda v: int(v * 0.25))
    im = Image.composite(Image.new('RGB', (W, H), (10, 22, 40)), im, g)
    edge = L.filter(ImageFilter.MaxFilter(5))
    im.paste(coast, mask=edge)
    im.paste(land, mask=L)
    d = ImageDraw.Draw(im)
    f = _font(int(W * 0.022))
    for t, lo, la in labels:
        x = (lo - R[0]) / (R[1] - R[0]) * W; y = (R[3] - la) / (R[3] - R[2]) * H
        d.ellipse((x - 9, y - 9, x + 9, y + 9), fill=(40, 44, 52), outline=(255, 255, 255), width=3)
        d.text((x + 16, y - 30), t, font=f, fill=(34, 38, 46), stroke_width=4, stroke_fill=(250, 248, 240))
    fs = _font(int(W * 0.02))
    for t, lo, la in sea_labels:
        x = (lo - R[0]) / (R[1] - R[0]) * W; y = (R[3] - la) / (R[3] - R[2]) * H
        d.text((x, y), t, font=fs, fill=(170, 196, 222))
    _save_atomic(im, path)
    return path


def img_plane(path, loc, w, h, rot=(0, 0, 0), name='img'):
    """PNG を貼った板（データ API で作る）"""
    m = bpy.data.materials.new('tx_' + name); m.use_nodes = True
    t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path, check_existing=True)
    m.node_tree.links.new(t.outputs['Color'], m.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    uv = bm.loops.layers.uv.new()
    for fc in bm.faces:
        for lp in fc.loops:
            co = lp.vert.co
            lp[uv].uv = (co.x + 0.5, co.y + 0.5)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o)
    o.location = loc; o.rotation_euler = rot; o.scale = (w, h, 1)
    o.data.materials.append(m)
    return o


def tex_board(name, fn, loc, w, h, rot=(math.pi / 2, 0, 0), size=(1920, 1080), cache=True):
    """PIL で描いた絵（fn(im, d)）の板。cache=True なら一度描いた絵を使い回す"""
    from PIL import Image, ImageDraw
    path = f'{TEXDIR}/{name}.png'
    if not (cache and os.path.exists(path)):
        im = Image.new('RGB', size, (240, 240, 240)); d = ImageDraw.Draw(im)
        fn(im, d)
        _save_atomic(im, path)
    return img_plane(path, loc, w, h, rot=rot, name=name)


def japan_map(name='nk_map', R=None, z=0.0, sea_labels=(), labels=MAP_LABELS):
    """地図の板（xy 平面、z=0）。周りは海の色で広げる"""
    R = R or MAP_R
    Wm, Hm = map_size(R)
    path = map_tex(name, R, labels=labels, sea_labels=sea_labels)
    o = img_plane(path, (0, 0, z), Wm, Hm, name='map')
    plane((0, 0, z - 0.05), (Wm * 6, Hm * 6), (0.006, 0.016, 0.04), name='mapsea')
    s = bpy.context.scene
    sky(hexc('#0c1626')); s.view_settings.exposure = 0.35
    no_shadow()
    return o


# 南海トラフの震源域（模式）：陸側のふちと、溝（トラフ）の線
ZONE_UP = [(138.95, 35.25), (138.2, 35.05), (137.4, 34.95), (136.8, 34.55), (136.2, 34.25), (135.6, 34.05), (134.8, 33.95),
           (134.0, 33.75), (133.3, 33.45), (132.6, 33.05), (132.0, 32.6), (131.6, 32.0), (131.45, 31.5)]
TROUGH = [(138.75, 34.95), (138.6, 34.3), (138.15, 33.85), (137.4, 33.6), (136.6, 33.3), (135.9, 33.0), (135.0, 32.75),
          (134.2, 32.55), (133.4, 32.2), (132.8, 31.85), (132.4, 31.45), (132.0, 31.0), (131.8, 30.7)]
SPLIT_LON = 135.75   # 東の半分・西の半分の境（紀伊半島の先：模式）


def _strip_mesh(up, lo, z, rgb, a, name):
    bm = bmesh.new()
    vu = [bm.verts.new(MP(lo_, la_, z)) for lo_, la_ in up]
    vl = [bm.verts.new(MP(lo_, la_, z)) for lo_, la_ in lo]
    for i in range(len(up) - 1):
        bm.faces.new((vl[i], vl[i + 1], vu[i + 1], vu[i]))
    return _obj(bm, rgb, name, a)


def _split(pts, lon, east=True):
    out = []
    for i, p in enumerate(pts):
        if (p[0] >= lon) == east:
            out.append(p)
    # 境の点を足す
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        if (a[0] - lon) * (b[0] - lon) < 0:
            u = (lon - a[0]) / (b[0] - a[0]); q = (lon, a[1] + (b[1] - a[1]) * u)
            if east:
                out.append(q)
            else:
                out.insert(0, q)
    return sorted(out, key=lambda p: -p[0])


def zone(part='all', z=0.3, rgb=(1.0, 0.25, 0.2), a=0.72, f0=None, grow_dur=36, name='zone'):
    """震源域の赤い帯。part='all'/'east'/'west'。f0 を渡すと東から西へ伸びて出る"""
    def resample(pts, t0, t1, N=28):
        d = [0.0]
        for i in range(len(pts) - 1):
            d.append(d[-1] + math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]))
        L = d[-1]
        def at(t):
            x = t * L
            for i in range(len(pts) - 1):
                if d[i] <= x <= d[i + 1] + 1e-9:
                    u = (x - d[i]) / max(1e-9, d[i + 1] - d[i])
                    return (pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u)
            return pts[-1]
        return [at(t0 + (t1 - t0) * k / (N - 1)) for k in range(N)]
    def tsplit(pts):
        best = 0.5
        for k in range(1001):
            t = k / 1000
            if resample(pts, t, t, 2)[0][0] <= SPLIT_LON:
                return t
        return best
    if part == 'all':
        up = resample(ZONE_UP, 0, 1); lo = resample(TROUGH, 0, 1)
    elif part == 'east':
        up = resample(ZONE_UP, 0, tsplit(ZONE_UP)); lo = resample(TROUGH, 0, tsplit(TROUGH))
    else:
        up = resample(ZONE_UP, tsplit(ZONE_UP), 1); lo = resample(TROUGH, tsplit(TROUGH), 1)
    o = _strip_mesh(up, lo, z, rgb, a, name)
    if f0 is not None:
        # 東の端を支点に x 方向へ伸ばす
        x0 = MP(up[0][0], 0)[0]
        p = empty((x0, 0, 0), name + '_pv'); o.parent = p; o.location = (-x0, 0, 0)
        p.scale = (0.001, 1, 1); p.keyframe_insert('scale', frame=1); p.keyframe_insert('scale', frame=max(2, f0))
        p.scale = (1, 1, 1); p.keyframe_insert('scale', frame=f0 + grow_dur)
    return o


def trough_line(z=0.35, rgb=hexc('#ff5040'), r=0.18, f0=None, dur=40):
    items = []
    for i in range(len(TROUGH) - 1):
        items.append((MP(*TROUGH[i], z), MP(*TROUGH[i + 1], z), r))
    o = mbar(items, rgb, 'trough', segs=6)
    if f0 is not None:
        x0 = MP(TROUGH[0][0], 0)[0]
        p = empty((x0, 0, 0), 'tr_pv'); o.parent = p; o.location = (-x0, 0, 0)
        p.scale = (0.001, 1, 1); p.keyframe_insert('scale', frame=1); p.keyframe_insert('scale', frame=max(2, f0))
        p.scale = (1, 1, 1); p.keyframe_insert('scale', frame=f0 + dur)
    return o


def pulse_rings(center, n, f0, period=30, r1=12.0, rgb=(1.0, 0.3, 0.25), k=None, z=0.4, a=0.5):
    """震源から広がる輪（薄い円柱の縁）"""
    out = []
    k = k or max(1, (n - f0) // period + 1)
    for i in range(k):
        o = cyl((center[0], center[1], z), 1.0, 0.05, rgb, verts=48)
        o.data.materials.clear(); o.data.materials.append(gmat(rgb, a, 'ring'))
        f = f0 + i * period
        o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=max(2, f))
        o.scale = (r1, r1, 1); o.keyframe_insert('scale', frame=f + period * 2)
        o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=f + period * 2 + 1)
        linear(o, 'scale')
        set_interp(o, 'CONSTANT', 'scale', {1, f + period * 2})
        out.append(o)
    return out


def pacific_coast(lon0=131.3, lon1=138.95, step=0.06, R=None):
    """太平洋側の海岸の点（南から見て最初の陸）"""
    R = R or MAP_R
    W = 2048; Wm, Hm = map_size(R); H = int(W * Hm / Wm)
    L = land_mask(R, W, H)
    out = []
    lo = lon0
    while lo <= lon1:
        x = int((lo - R[0]) / (R[1] - R[0]) * W)
        for la10 in range(int(30.8 * 100), int(35.3 * 100), 3):
            la = la10 / 100
            y = int((R[3] - la) / (R[3] - R[2]) * H)
            if 0 <= x < W and 0 <= y < H and L.getpixel((x, y)) > 0:
                out.append((lo, la)); break
        lo += step
    return out


def shindo_coast(f0=None, z=0.32, rgb=(1.0, 0.18, 0.15), r=0.55, dur=30, lon0=131.3, lon1=138.95, name='shindo'):
    """震度7の海沿い（赤い点の列）。f0 を渡すと東から順に灯る"""
    pts = pacific_coast(lon0, lon1)
    pts.sort(key=lambda p: -p[0])
    G = 6
    objs = []
    for g in range(G):
        items = [(*MP(lo, la, z), r) for lo, la in pts[g::G]]
        if not items:
            continue
        o = msph(items, rgb, f'{name}{g}', sub=1)
        objs.append(o)
    if f0 is not None:
        # 東から西へ順に（点の x で区切る）
        for o in objs:
            pass
        allp = pts
        objs2 = []
        for o in objs:
            bpy.data.objects.remove(o)
        chunks = 8
        for c in range(chunks):
            sub = allp[c * len(allp) // chunks:(c + 1) * len(allp) // chunks]
            o = msph([(*MP(lo, la, z), r) for lo, la in sub], rgb, f'{name}c{c}', sub=1)
            appear(o, f0 + int(dur * c / chunks), grow=3)
            objs2.append(o)
        return objs2
    return objs


def map_text(s, lon, lat, size=2.2, rgb=(1, 1, 1), z=0.6, f=None):
    o = text3d(s, MP(lon, lat, z), size, rgb, rot=(0, 0, 0))
    if f is not None:
        appear(o, f, grow=4)
    return o


def route_line(pts, z=0.45, r=0.28, rgb=hexc('#ffd060'), name='route'):
    items = [(MP(*pts[i], z), MP(*pts[i + 1], z), r) for i in range(len(pts) - 1)]
    return mbar(items, rgb, name, segs=6)


TOKAIDO = [(139.7, 35.68), (139.3, 35.33), (139.0, 35.25), (138.7, 35.12), (138.55, 35.1), (138.4, 34.98), (138.0, 34.75),
           (137.7, 34.71), (137.2, 34.8), (136.9, 35.17), (136.6, 35.3), (136.2, 35.3), (135.8, 35.0), (135.5, 34.7)]
YUI = (138.56, 35.1)


def map_cam(n, a=(137.0, 33.6, 70), b=(136.6, 33.2, 62), tilt=0.42, lens=35):
    """地図を斜め上から見るカメラ。a, b = (経度, 緯度, 高さ)"""
    cam = camera(lens)
    def key(p):
        x, y, _ = MP(p[0], p[1]); h = p[2]
        return (x, y - h * tilt, h), (x, y, 0)
    pa, ta = key(a); pb, tb = key(b)
    cam_path(cam, [(0, pa, ta), (1, pb, tb)], n)
    cam.data.clip_end = 4000
    return cam


# ======================================================================
# 港町（焼津の模式）
# ======================================================================
TILE = hexc('#4a4e56'); TILE2 = hexc('#5b5048')
SEA = hexc('#3f6f94'); SEA_DEEP = hexc('#2c5677')
CONC = hexc('#b9b5ab'); ASPH = hexc('#6a6a6e')
BLACKW = hexc('#3b3a33'); FOAM = hexc('#eef2f2')
SEA_Z = -1.2


def far_hills(y=-300, x=(-500, 500), k=9, seed=3, c=hexc('#8a9a86'), h=(50, 110)):
    """遠くの山並み（つぶした玉を重ねる。かすんだ色）"""
    rnd = random.Random(seed)
    items = [(x[0] + (x[1] - x[0]) * i / (k - 1) + rnd.uniform(-30, 30), y + rnd.uniform(-40, 40), 0, rnd.uniform(70, 130), 1.0, 0.8,
              rnd.uniform(*h) / 100) for i in range(k)]
    return msph(items, c, 'hills', sub=2, smooth=True)


def j_house(loc, w=7.0, d=6.5, h=5.6, rot_z=0.0, wall=None, roofc=None, rnd=None, lit=None, parent=None, name='jh'):
    """2階建ての家（切妻の瓦屋根・窓）。root は足元の中心。戻り値：(root, 窓のリスト)"""
    rnd = rnd or RK
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    if parent is not None:
        link(root, parent)
    wall = wall or rnd.choice(WALLS)
    roofc = roofc or rnd.choice([TILE, TILE2, hexc('#3c4652'), hexc('#6a5a4a')])
    link(box((0, 0, h / 2), (w, d, h), wall), root)
    r = roof((0, 0, h), w + 0.9, d + 0.7, 1.9, roofc, rot_z=math.pi / 2); link(r, root)
    wins = []
    for fl in range(2):
        z = 1.5 + fl * h / 2
        for k in range(2):
            x = -w / 4 + k * w / 2
            c = hexc('#8fa8bc')
            if lit is not None and rnd.random() < lit:
                c = hexc('#ffd27a')
            wins.append(link(box((x, -d / 2 - 0.04, z), (1.6, 0.08, 1.15), c), root))
    link(box((w / 2 - 1.2, -d / 2 - 0.05, 1.0), (1.0, 0.08, 2.0), hexc('#6b4f3a')), root)
    return root, wins


def shop(loc, w=6.0, d=7.0, h=6.0, rot_z=0.0, rnd=None, name='shop'):
    """商店街の店：1階に日よけと看板（文字なし）。戻り値：(root, 看板, 窓)"""
    rnd = rnd or RK
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, h / 2), (w, d, h), rnd.choice(WALLS)), root)
    link(box((0, -d / 2 - 0.05, 1.3), (w * 0.86, 0.08, 2.2), hexc('#9fb8c8')), root)  # ガラス戸
    aw = rnd.choice([hexc('#c0503e'), hexc('#3e6e9a'), hexc('#4f8a5a'), hexc('#d9a441'), hexc('#7a5a8a')])
    link(box((0, -d / 2 - 0.7, 2.75), (w * 0.95, 1.4, 0.12), aw, rot=(0.25, 0, 0)), root)
    # 看板（上の壁から突き出す、文字なし）：支点は付け根
    sg = empty((w / 2 - 0.4, -d / 2 - 0.1, h - 1.2), 'signpv'); link(sg, root)
    link(box((0, -0.5, 0), (0.18, 1.0, 1.8), rnd.choice([hexc('#e8e2d0'), hexc('#f0c040'), hexc('#d9534f'), hexc('#ffffff')])), sg)
    link(box((0, -0.5, 0), (0.22, 0.86, 0.12), aw), sg)
    win = link(box((0, -d / 2 - 0.04, h - 1.3), (w * 0.5, 0.08, 1.0), hexc('#8fa8bc')), root)
    return root, sg, win


def block_wall(loc, length, rot_z=0.0, h=1.4, rgb=hexc('#a9a49a'), name='bw'):
    """ブロック塀：支点（下の縁）に付ける。tip(p, f, axis=0) で道へ倒れる"""
    p = pivot(loc, rot_z, name)
    link(box((0, 0, h / 2), (length, 0.15, h), rgb), p)
    for k in range(int(length / 0.4)):
        link(box((-length / 2 + 0.2 + k * 0.4, -0.08, h * 0.5), (0.02, 0.02, h), hexc('#8a857c')), p)
    return p


def utility_poles(xs, y, h=9.0, c=hexc('#8f8b84'), wire=True):
    items = [(x, y, h / 2, 0.28, 0.28, h) for x in xs]
    o = mbox(items, c, 'pole')
    if wire and len(xs) > 1:
        w = []
        for k in range(len(xs) - 1):
            for dz in (0, -0.6):
                w.append(((xs[k], y, h - 0.4 + dz), (xs[k + 1], y, h - 0.4 + dz), 0.02))
        mbar(w, hexc('#2a2a2a'), 'wire', segs=4)
    return o


def fishing_boat(loc, rot_z=0.0, s=1.0, hull=None, name='boat'):
    """漁船（前は +x）。root は喫水"""
    hull = hull or random.Random(int(loc[0] * 7 + loc[1] * 3)).choice([hexc('#f2f2ee'), hexc('#e9e4d6'), hexc('#d8e4ec')])
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    link(box((0, 0, 0.4), (9.0, 2.8, 1.6), hull), root)
    link(box((4.9, 0, 0.6), (1.4, 1.9, 1.4), hull, rot=(0, -0.35, 0)), root)
    link(box((0, 0, -0.35), (8.6, 2.6, 0.3), hexc('#b03a32')), root)  # 船底の赤
    link(box((-1.2, 0, 1.9), (2.6, 2.0, 1.6), hexc('#f6f4ee')), root)
    link(box((-1.2, -1.01, 2.1), (2.2, 0.04, 0.6), hexc('#4d6272')), root)
    link(box((-1.2, 1.01, 2.1), (2.2, 0.04, 0.6), hexc('#4d6272')), root)
    link(cyl((0.8, 0, 3.6), 0.07, 4.2, hexc('#d0d0cc')), root)
    link(box((2.8, 0, 1.3), (0.1, 2.6, 0.3), hexc('#2f6aa0')), root)
    return root


def bob_rock(o, n, amp=0.12, rot=0.05, period=60, seed=1):
    """船の上下と揺れ"""
    rnd = random.Random(seed)
    ph = rnd.uniform(0, 6.28)
    z0 = o.location.z; r0 = o.rotation_euler.copy()
    for f in range(1, n + 2, 6):
        t = 2 * math.pi * f / period + ph
        o.location.z = z0 + amp * math.sin(t); o.keyframe_insert('location', index=2, frame=f)
        o.rotation_euler = (r0.x + rot * math.sin(t * 0.8), r0.y + rot * 0.6 * math.cos(t * 0.7), r0.z)
        o.keyframe_insert('rotation_euler', frame=f)


def harbor_town(n, seed=1, people=True, quay_people=True, lit=None, damaged=False, sea_c=SEA, boats=True, shops=True, tower=True, far=True):
    """焼津のような港町（模式）。海は +y（y>QY）、岸壁 y=QY、商店街は y=0 を x 方向に走る。
    戻り値 dict：signs（看板の支点）, walls（塀の支点）, wins（窓）, houses（家の root）, boats, people"""
    QY = 26.0
    rnd = random.Random(seed)
    H = dict(signs=[], walls=[], wins=[], houses=[], boats=[], people=[], shops=[], QY=QY)
    plane((0, (QY - 300) / 2, 0), (600, 300 + QY), hexc('#bdb6a6'), name='ground')
    plane((0, QY + 200, SEA_Z), (800, 400), sea_c, name='sea')
    plane((0, QY - 3, 0.02), (300, 6), CONC, name='quay')
    box((0, QY, -0.75), (300, 0.6, 1.5), hexc('#9f9b92'))  # 岸壁の縁
    plane((0, 0, 0.015), (300, 7), ASPH, name='street')
    plane((0, -30, 0.016), (300, 6), ASPH, name='street2')
    for x in range(-120, 121, 40):
        plane((x, -15, 0.017), (6, 60), ASPH, name='sidest')
    # 岸壁の上：倉庫（市場）と係留柱
    mbox([(x, QY - 9, 3.5, 22, 9, 7) for x in (-60, -30, 30, 60)], hexc('#d9d4c6'), 'market')
    mbox([(x, QY - 9, 7.1, 22.6, 9.6, 0.3) for x in (-60, -30, 30, 60)], hexc('#7b8a96'), 'mroof')
    msph([(x, QY - 0.6, 0.3, 0.25) for x in range(-80, 81, 9)], hexc('#55585e'), 'bollard')
    if boats:
        for k, x in enumerate((-36, -18, 4, 20, 40, -54)):
            b = fishing_boat((x, QY + 3.2 + (k % 2) * 3.4, SEA_Z + 0.3), rot_z=0.0, s=1.0, name=f'boat{k}')
            bob_rock(b, n, amp=0.06, rot=0.02, seed=k)
            H['boats'].append(b)
    # 商店街（両側）
    if shops:
        for side in (-1, 1):
            x = -70.0
            k = 0
            while x < 70:
                w = rnd.uniform(5.5, 7.5)
                if tower and side < 0 and abs(x + w / 2) < 6:
                    x += w; continue
                r, sg, win = shop((x + w / 2, side * 7.2, 0), w=w - 0.3, d=7, h=rnd.uniform(5.5, 7.5),
                                  rot_z=0 if side > 0 else math.pi, rnd=rnd, name=f'shop{side}_{k}')
                H['signs'].append(sg); H['wins'].append(win); H['shops'].append(r)
                x += w; k += 1
    # 奥の住宅（y<-14）
    for i in range(-6, 7):
        for j in range(3):
            x = i * 11 + rnd.uniform(-1.5, 1.5); y = -18 - j * 12 + rnd.uniform(-1, 1)
            if abs(x) < 8 and j == 0:
                continue
            if tower and abs(x) < 15 and y > -44:
                continue
            r, wins = j_house((x, y, 0), w=rnd.uniform(6.5, 8), d=rnd.uniform(6, 7), rot_z=rnd.choice([0, math.pi]), rnd=rnd, lit=lit, name=f'h{i}_{j}')
            H['houses'].append(r); H['wins'] += wins
            if j == 0:
                H['walls'].append(block_wall((x, y + 4.6, 0), 6.0, rot_z=0.0, name=f'bw{i}'))
    utility_poles([x for x in range(-66, 67, 22)], -4.2)
    if far:
        far_hills(y=-300)
    if damaged:
        for r in H['houses'][::3]:
            r.rotation_euler.x += rnd.uniform(-0.06, 0.06); r.rotation_euler.y += rnd.uniform(-0.05, 0.05)
        rubble((rnd.uniform(-40, 40), -10, 0), k=40, seed=seed)
    return H


def rubble(center, k=60, spread=(5, 3), seed=3, cols=None):
    rnd = random.Random(seed)
    cols = cols or [hexc('#8a7a64'), hexc('#a89a84'), hexc('#5a4a3a'), hexc('#4a4e56'), hexc('#c9c1b0')]
    items = {c: [] for c in range(len(cols))}
    for i in range(k):
        c = rnd.randrange(len(cols))
        items[c].append((center[0] + rnd.gauss(0, spread[0]), center[1] + rnd.gauss(0, spread[1]), center[2] + rnd.uniform(0, 0.6),
                         rnd.uniform(0.3, 1.6), rnd.uniform(0.1, 0.5), rnd.uniform(0.1, 0.5), rnd.uniform(0, 3)))
    return [mbox(v, cols[c], 'rubble') for c, v in items.items() if v]


def lunch_people(H, n, rnd, k=14, eat=True):
    """岸壁で弁当を広げる人（座る）と、道を歩く人"""
    QY = H['QY']; out = []
    for i in range(k):
        x = -26 + i * 3.7 + rnd.uniform(-0.6, 0.6); y = QY - 2.2 + rnd.uniform(-0.6, 0.4)
        p = crowd_person((x, y, 0.02), rnd, rot_z=math.pi + rnd.uniform(-0.6, 0.6), pose='sit', name=f'lp{i}')
        box((x + 0.05 * (i % 2), y - 0.35, 0.62), (0.34, 0.22, 0.07), hexc('#e8d6b0'))  # 弁当
        out.append(p)
    return out


def street_walkers(n, rnd, k=12, y=(-2.5, 2.5), x=(-40, 40), speed=1.3, name='sw'):
    out = []
    for i in range(k):
        x0 = rnd.uniform(*x); yy = rnd.uniform(*y); d = rnd.choice([-1, 1])
        p = crowd_person((x0, yy, 0), rnd, rot_z=0, name=f'{name}{i}')
        move(p, [(1, (x0, yy, 0)), (n, (x0 + d * speed * n / FPS, yy, 0))])
        out.append(p)
    return out


def crouch_person(loc, rnd, rot_z=0.0, name='cr', shirt=None):
    """地面にはいつくばる人（座った形を前へ倒す）。animate_life が呼吸と首を付ける"""
    p = crowd_person(loc, rnd, rot_z=rot_z, pose='sit', name=name) if shirt is None else \
        person(loc, shirt, rot_z=rot_z, pose='sit', name=name)
    rig = O[p['rig']]
    rig.rotation_euler.x = 0.75; rig.location.z = -0.25; rig.location.y = 0.1
    for a in p['arms']:
        O[a].rotation_euler.x = -1.2
    return p


def run_to(p, pts, f0, speed=3.2):
    """人を pts の順に走らせる（f0 に出発、速さ speed m/秒）"""
    f = f0
    p.location = (*pts[0][:2], pts[0][2] if len(pts[0]) > 2 else 0)
    p.keyframe_insert('location', frame=1); p.keyframe_insert('location', frame=max(1, f0))
    for i in range(1, len(pts)):
        a = Vector(pts[i - 1] if len(pts[i - 1]) > 2 else (*pts[i - 1], 0)); b = Vector(pts[i] if len(pts[i]) > 2 else (*pts[i], 0))
        f += max(2, int((b - a).length / speed * FPS))
        p.location = b; p.keyframe_insert('location', frame=f)
    linear(p, 'location')
    return f


# ======================================================================
# 津波
# ======================================================================
def wave_wall(x0, x1, y, h, c=hexc('#4f7f9e'), foam=True, depth=6.0, name='wave', a=1.0):
    """波の壁（x0〜x1、正面は -y 側）。断面は前が丸くせり上がる形。root は y の位置（動かす）"""
    root = empty((0, y, 0), name)
    bm = bmesh.new()
    prof = [(depth, 0), (depth, h * 0.85), (depth * 0.4, h), (0.0, h * 0.92), (-0.6, h * 0.55), (-0.2, 0.0)]
    vs0 = [bm.verts.new((x0, py, pz)) for py, pz in prof]
    vs1 = [bm.verts.new((x1, py, pz)) for py, pz in prof]
    for i in range(len(prof)):
        j = (i + 1) % len(prof)
        bm.faces.new((vs0[i], vs0[j], vs1[j], vs1[i]))
    bm.faces.new(vs0[::-1]); bm.faces.new(vs1)
    o = _obj(bm, c, name + '_body', a); link(o, root)
    if foam:
        f = mbox([(x, -0.4 + RK.uniform(-0.3, 0.3), h * 0.9 + RK.uniform(-0.2, 0.3), RK.uniform(1.5, 4), 1.6, RK.uniform(0.4, 1.0))
                  for x in [x0 + (x1 - x0) * k / 60 for k in range(61)]], FOAM, name + '_foam')
        link(f, root)
    return root


def move_y(o, keys):
    """keys=[(f, y)]"""
    for f, y in keys:
        o.location.y = y; o.keyframe_insert('location', index=1, frame=f)


def flood(loc, size, z0, z1, f0, f1, c=BLACKW, a=0.96, name='flood'):
    o = water(loc, size, z0, z1, f0, f1, c=c, a=a, name=name)
    return o


def surge_mesh(x0, x1, y0, y1, z, c=BLACKW, a=0.97, name='surge', front_h=1.6):
    """前へ進む水のかたまり（上面＋前の丸い縁）。root の y を動かす。前は +y の端…ではなく -y 側へ進む"""
    root = empty((0, 0, 0), name)
    o = box(((x0 + x1) / 2, (y0 + y1) / 2, z / 2), (x1 - x0, y1 - y0, z), c, name=name + '_b')
    o.data.materials.clear(); o.data.materials.append(gmat(c, a, name))
    link(o, root)
    fr = mbox([(x, y0 + RK.uniform(-0.4, 0.4), z + RK.uniform(-0.1, 0.3), RK.uniform(1.5, 3.5), 1.4, front_h * RK.uniform(0.3, 0.7))
               for x in [x0 + (x1 - x0) * k / 50 for k in range(51)]], hexc('#6b6656'), name + '_edge')
    link(fr, root)
    return root


def flow_streaks(n, x0, x1, y0, y1, z, dirv=(0, -1), speed=6.0, k=160, c=hexc('#5a564a'), seed=3, L=2.2, period=None):
    """水面を流れる筋（泥の筋・泡）。dirv の向きに speed m/秒"""
    rnd = random.Random(seed)
    span = abs(y1 - y0) if dirv[1] else abs(x1 - x0)
    period = period or max(12, int(span / speed * FPS / 2))
    out = []
    for layer in range(2):
        items = []
        for i in range(k // 2):
            x = rnd.uniform(x0, x1); y = rnd.uniform(y0, y1)
            ang = math.atan2(dirv[1], dirv[0])
            items.append((x, y, z + 0.03, L, rnd.uniform(0.1, 0.3), 0.04, ang))
        o = mbox(items, c, f'streak{layer}')
        idx = 1 if dirv[1] else 0
        dist = (speed * period / FPS) * (1 if (dirv[1] if idx else dirv[0]) > 0 else -1)
        saw(o, n, idx, 0.0, dist, period, phase=layer * period // 2)
        out.append(o)
    return out


def debris_field(n, x0, x1, y0, y1, z, dirv=(0, -1), speed=5.0, k=90, seed=5):
    """黒い水に浮かぶ家の破片（板・柱）。全体を流れの向きへ動かす"""
    rnd = random.Random(seed)
    cols = [hexc('#8a6a48'), hexc('#6a5a4a'), hexc('#c9c1b0'), hexc('#4a4e56'), hexc('#a08060')]
    objs = []
    for ci, c in enumerate(cols):
        items = [(rnd.uniform(x0, x1), rnd.uniform(y0, y1), z + 0.1, rnd.uniform(0.6, 3.0), rnd.uniform(0.15, 0.8), rnd.uniform(0.08, 0.3), rnd.uniform(0, 3.14))
                 for _ in range(k // len(cols))]
        o = mbox(items, c, 'debris')
        d = Vector((dirv[0], dirv[1], 0)) * speed * n / FPS
        o.keyframe_insert('location', frame=1)
        o.location = d; o.keyframe_insert('location', frame=n + 1)
        linear(o, 'location')
        objs.append(o)
    return objs


def drift(o, n, f0, d, z=None, spin=0.6, bob_amp=0.15, seed=1, ease_in=24):
    """o を f0 から流す（d = 全体の移動ベクトル、z は浮く高さ）"""
    rnd = random.Random(seed)
    p0 = o.location.copy(); r0 = o.rotation_euler.copy()
    o.keyframe_insert('location', frame=1); o.keyframe_insert('rotation_euler', frame=1)
    o.keyframe_insert('location', frame=max(2, f0)); o.keyframe_insert('rotation_euler', frame=max(2, f0))
    T = max(4, n - f0)
    for k in range(1, 9):
        u = k / 8; f = f0 + int(T * u)
        uu = u if T * u > ease_in else u * (T * u / ease_in)
        p = p0 + Vector(d) * uu
        if z is not None:
            p.z = p0.z + (z - p0.z) * min(1, (f - f0) / 18) + bob_amp * math.sin(f * 0.25 + seed)
        o.location = p; o.keyframe_insert('location', frame=f)
        o.rotation_euler = (r0.x + rnd.uniform(-0.15, 0.15), r0.y + rnd.uniform(-0.15, 0.15), r0.z + spin * u)
        o.keyframe_insert('rotation_euler', frame=f)


def roof_only(loc, w=7.5, d=6.5, rot_z=0.0, roofc=None, name='rf'):
    """屋根だけ見える家（水の上に出た屋根）"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, -1.0), (w, d, 2.0), RK.choice(WALLS)), root)
    link(roof((0, 0, 0), w + 0.9, d + 0.7, 1.9, roofc or TILE, rot_z=math.pi / 2), root)
    return root


# ======================================================================
# 避難タワー
# ======================================================================
def evac_tower(loc, h=10.0, w=8.0, d=6.0, rot_z=0.0, name='tower'):
    """鉄骨の避難タワー：4本の柱、上の床と手すり、横に折り返しの階段。戻り値：(root, 階段の点列（下から上、ローカル）)"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    col = hexc('#c9ced2'); rail = hexc('#e9ecee')
    for sx in (-1, 1):
        for sy in (-1, 1):
            link(box((sx * w / 2, sy * d / 2, h / 2), (0.45, 0.45, h), col), root)
    for z in (h * 0.35, h * 0.7):
        link(box((0, -d / 2, z), (w, 0.25, 0.25), col), root); link(box((0, d / 2, z), (w, 0.25, 0.25), col), root)
    link(box((0, 0, h), (w + 1.0, d + 1.0, 0.4), hexc('#d7d9d6')), root)
    for sy in (-1, 1):
        link(box((0, sy * (d / 2 + 0.5), h + 0.6), (w + 1.0, 0.08, 1.2), rail), root)
    for sx in (-1, 1):
        link(box((sx * (w / 2 + 0.5), 0, h + 0.6), (0.08, d + 1.0, 1.2), rail), root)
    # 階段（タワーの -x 側、y 方向に折り返す 3 段）
    pts = []
    flights = 3; fh = h / flights
    for k in range(flights):
        z0 = k * fh; ys = (-d / 2 - 4, d / 2) if k % 2 == 0 else (d / 2, -d / 2 - 4)
        x = -w / 2 - 1.4
        L = abs(ys[1] - ys[0]); ang = math.atan2(fh, L)
        cy = (ys[0] + ys[1]) / 2
        link(box((x, cy, z0 + fh / 2), (1.8, math.hypot(L, fh), 0.25), hexc('#b8bcc0'), rot=(ang if ys[1] > ys[0] else -ang, 0, 0)), root)
        link(box((x - 0.9, cy, z0 + fh / 2 + 0.9), (0.06, math.hypot(L, fh), 0.06), rail, rot=(ang if ys[1] > ys[0] else -ang, 0, 0)), root)
        pts.append((x, ys[0], z0)); pts.append((x, ys[1], z0 + fh))
        link(box((x, ys[1], z0 + fh), (1.8, 1.6, 0.25), hexc('#b8bcc0')), root)
    pts.append((-w / 2 + 0.6, 0, h + 0.2))
    return root, pts


# ======================================================================
# 乗り物
# ======================================================================
def car_s(loc, rot_z=0.0, c=None, name='car'):
    """乗用車（前は -y、長さ 4.4）"""
    c = c or RK.choice([hexc('#c9c9c9'), hexc('#2f4a6b'), hexc('#8a2e2e'), hexc('#f0f0ec'), hexc('#3a3a3a'), hexc('#d9c07a')])
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0.65), (1.75, 4.3, 0.75), c), root)
    link(box((0, 0.3, 1.25), (1.6, 2.2, 0.6), c), root)
    link(box((0, -0.82, 1.25), (1.5, 0.05, 0.5), hexc('#4d5d6b'), rot=(0.45, 0, 0)), root)
    link(box((0.81, 0.3, 1.25), (0.04, 2.0, 0.45), hexc('#4d5d6b')), root)
    link(box((-0.81, 0.3, 1.25), (0.04, 2.0, 0.45), hexc('#4d5d6b')), root)
    for sx in (-0.8, 0.8):
        for sy in (-1.35, 1.35):
            link(cyl((sx, sy, 0.34), 0.34, 0.24, hexc('#1e1e1e'), rot=(0, math.pi / 2, 0), verts=12), root)
    return root


def bullet_train(loc, cars=6, rot_z=0.0, lit=True, name='shk'):
    """新幹線（白い車体に青い帯、前は +x）。戻り値：(root, 窓のリスト)"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    L = 25.0; wins = []
    body = hexc('#f4f4f2'); blue = hexc('#1f4fa0')
    for k in range(cars):
        x = -k * (L + 0.4)
        link(box((x, 0, 2.0), (L, 3.4, 3.2), body), root)
        link(box((x, -1.71, 1.2), (L, 0.04, 0.35), blue), root); link(box((x, 1.71, 1.2), (L, 0.04, 0.35), blue), root)
        c = hexc('#ffe6a8') if lit else hexc('#2a2f36')
        wins.append(link(box((x, -1.72, 2.55), (L * 0.9, 0.04, 0.6), c), root))
        wins.append(link(box((x, 1.72, 2.55), (L * 0.9, 0.04, 0.6), c), root))
    # 先頭の鼻（長い流線形）
    nose = cone((L / 2 + 5.0, 0, 1.9), 1.75, 10.0, body, rot=(0, math.pi / 2, 0), verts=20)
    nose.scale = (0.9, 1.0, 1.0); link(nose, root); nose.location = (L / 2 + 5.0, 0, 1.9)
    link(box((L / 2 + 2.5, 0, 3.0), (3.0, 1.6, 0.5), hexc('#2a3440'), rot=(0, 0.25, 0)), root)
    return root, wins


def airliner(loc, rot_z=0.0, s=1.0, c=hexc('#f4f4f2'), tail=hexc('#4a6a9a'), name='plane'):
    """旅客機（前は +x、模式。会社のロゴなし）"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    link(cyl((0, 0, 0), 1.9, 36, c, rot=(0, math.pi / 2, 0), verts=20), root)
    link(cone((19.5, 0, 0), 1.9, 4.0, c, rot=(0, math.pi / 2, 0), verts=20), root)
    link(cone((-20.5, 0, 0.3), 1.9, 6.0, c, rot=(0, -math.pi / 2, 0), verts=20), root)
    link(box((1, 0, -0.6), (6, 34, 0.4), c, rot=(0, 0, 0)), root)
    link(box((-19, 0, 0.6), (3, 12, 0.3), c), root)
    link(box((-19.5, 0, 3.6), (4.5, 0.4, 6.0), tail, rot=(0, -0.35, 0)), root)
    for sy in (-6, 6):
        link(cyl((2.5, sy, -1.6), 0.9, 3.5, hexc('#c8ccd0'), rot=(0, math.pi / 2, 0), verts=14), root)
    link(box((0, -1.88, 0.6), (30, 0.05, 0.3), hexc('#3a4652')), root); link(box((0, 1.88, 0.6), (30, 0.05, 0.3), hexc('#3a4652')), root)
    return root


def helicopter(loc, rot_z=0.0, c=hexc('#d8dce0'), stripe=hexc('#c0392b'), name='heli'):
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(sphere((0, 0, 1.8), 1.6, c, scale=(1.8, 1.0, 1.0), seg=16), root)
    link(box((-4.2, 0, 2.2), (5.5, 0.4, 0.5), c), root)
    link(box((-6.8, 0, 3.0), (0.8, 0.15, 1.8), stripe), root)
    link(box((1.6, 0, 1.9), (1.2, 2.2, 1.0), hexc('#3a4652')), root)
    for sy in (-1.1, 1.1):
        link(box((0, sy, 0.15), (4.0, 0.12, 0.12), hexc('#5a5e64')), root)
    rot = empty((0, 0, 3.6), 'rotor'); link(rot, root)
    link(box((0, 0, 0), (13, 0.35, 0.06), hexc('#3a3e44')), rot); link(box((0, 0, 0), (0.35, 13, 0.06), hexc('#3a3e44')), rot)
    link(cyl((0, 0, 3.3), 0.25, 0.6, hexc('#5a5e64')), root)
    return root, rot


def excavator(loc, rot_z=0.0, c=hexc('#e0a92a'), name='exc'):
    """油圧ショベル（前は -y）。戻り値：(root, 上の旋回部, ブーム, アーム)"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    for sx in (-1.3, 1.3):
        link(box((sx, 0, 0.5), (0.9, 4.4, 1.0), hexc('#2a2a2a')), root)
    up = empty((0, 0, 1.1), 'upper'); link(up, root)
    link(box((0, 0.6, 0.8), (2.8, 3.2, 1.4), c), up)
    link(box((-0.7, -0.6, 1.4), (1.2, 1.4, 1.6), c), up)
    link(box((-0.7, -1.31, 1.6), (1.0, 0.04, 0.9), hexc('#3a4652')), up)
    boom = empty((0.5, -0.8, 1.2), 'boom'); link(boom, up)
    link(box((0, -2.2, 0.0), (0.5, 4.6, 0.6), c), boom)
    boom.rotation_euler.x = -0.55
    arm = empty((0, -4.4, 0), 'arm'); link(arm, boom)
    link(box((0, -1.4, 0), (0.4, 3.0, 0.45), c), arm)
    link(box((0, -2.9, -0.2), (1.0, 0.8, 0.9), hexc('#4a4a4a')), arm)
    arm.rotation_euler.x = 1.3
    return root, up, boom, arm


def dig_cycle(up, boom, arm, n, period=72, seed=1, f0=1):
    """ショベルの掘る・すくう・回す動き"""
    rnd = random.Random(seed)
    ph = rnd.randint(0, period)
    for f in range(f0, n + period, period // 4):
        k = ((f + ph) // (period // 4)) % 4
        boom.rotation_euler.x = [-0.25, -0.75, -0.75, -0.4][k]; boom.keyframe_insert('rotation_euler', index=0, frame=f)
        arm.rotation_euler.x = [1.7, 1.0, 1.4, 1.9][k]; arm.keyframe_insert('rotation_euler', index=0, frame=f)
        up.rotation_euler.z = [0.0, 0.0, 0.9, 0.9][k]; up.keyframe_insert('rotation_euler', index=2, frame=f)


def dump_truck(loc, rot_z=0.0, c=hexc('#e8e4d8'), bed=hexc('#8a8a80'), name='dump'):
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, -2.6, 1.4), (2.3, 1.8, 2.0), c), root)
    link(box((0, -3.51, 1.8), (2.0, 0.04, 0.8), hexc('#3a4652')), root)
    link(box((0, 1.0, 1.6), (2.4, 5.0, 1.6), bed), root)
    link(box((0, 1.0, 2.3), (2.1, 4.6, 0.5), hexc('#6a5236')), root)
    for sx in (-1.1, 1.1):
        for sy in (-2.6, 0.2, 2.4):
            link(cyl((sx, sy, 0.55), 0.55, 0.4, hexc('#1e1e1e'), rot=(0, math.pi / 2, 0), verts=12), root)
    return root


OLIVE = hexc('#5b6340')


def sdf_truck(loc, rot_z=0.0, name='sdf'):
    """自衛隊の車（模式：くすんだ緑の大型トラック、幌）"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, -2.4, 1.5), (2.4, 2.0, 2.2), OLIVE), root)
    link(box((0, -3.41, 1.9), (2.0, 0.04, 0.8), hexc('#2f3328')), root)
    link(box((0, 1.4, 1.9), (2.5, 5.2, 2.6), hexc('#646b4a')), root)
    for sx in (-1.15, 1.15):
        for sy in (-2.4, 0.6, 2.8):
            link(cyl((sx, sy, 0.6), 0.6, 0.45, hexc('#1e1e1e'), rot=(0, math.pi / 2, 0), verts=12), root)
    return root


def bulldozer(loc, rot_z=0.0, c=OLIVE, name='dozer'):
    """排土板のついた車（前は -y）"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    for sx in (-1.2, 1.2):
        link(box((sx, 0, 0.55), (0.8, 4.0, 1.1), hexc('#2a2a2a')), root)
    link(box((0, 0.3, 1.5), (2.4, 3.0, 1.2), c), root)
    link(box((0, 0.6, 2.6), (1.6, 1.6, 1.2), c), root)
    link(box((0, -0.21, 2.6), (1.4, 0.04, 0.8), hexc('#2f3328')), root)
    link(box((0, -2.6, 0.8), (3.6, 0.3, 1.5), hexc('#4a5034'), rot=(0.15, 0, 0)), root)
    return root


CONT_C = [hexc(h) for h in ['#b8473a', '#2f6aa0', '#d9a441', '#4f8a5a', '#8a8a8a', '#7a4a8a', '#c86a3a', '#3a7a8a']]


def freight_train(loc, wagons=10, rot_z=0.0, seed=1, loco=hexc('#3a6ab0'), name='frt'):
    """貨物列車（前は +x）：機関車とコンテナ車。コンテナに文字はない"""
    rnd = random.Random(seed)
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 2.2), (18, 3.0, 3.4), loco), root)
    link(box((8.8, 0, 2.8), (0.4, 2.6, 1.0), hexc('#2a3440')), root)
    link(box((0, 0, 0.7), (17, 2.4, 0.8), hexc('#2a2a2a')), root)
    for k in range(wagons):
        x = -18.5 - k * 20.4
        link(box((x, 0, 1.0), (20, 2.4, 0.4), hexc('#4a4a4a')), root)
        for j in range(3):
            c = rnd.choice(CONT_C)
            link(box((x - 6.4 + j * 6.4, 0, 2.5), (6.0, 2.5, 2.6), c), root)
            link(box((x - 6.4 + j * 6.4, -1.26, 2.5), (5.6, 0.02, 2.2), tuple(v * 0.85 for v in c)), root)
    return root


def rails(x0, x1, y, k=2, gap=4.4, c=hexc('#7a7068')):
    items = []; sl = []
    for t in range(k):
        yy = y + t * gap
        items += [((x0, yy - 0.75, 0.25), (x1, yy - 0.75, 0.25), 0.07), ((x0, yy + 0.75, 0.25), (x1, yy + 0.75, 0.25), 0.07)]
        sl += [(x, yy, 0.1, 0.25, 2.6, 0.15) for x in range(int(x0), int(x1), 2)]
    mbar(items, hexc('#9a9a9a'), 'rail', segs=4)
    mbox(sl, c, 'sleeper')
    mbox([((x0 + x1) / 2, y + (k - 1) * gap / 2, 0.02, x1 - x0, k * gap + 2, 0.1)], hexc('#8c8378'), 'ballast')


def container_ship(loc, rot_z=0.0, L=180.0, seed=2, name='cship'):
    rnd = random.Random(seed)
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 3), (L, 28, 12), hexc('#2f3a48')), root)
    link(box((0, 0, -2.5), (L * 0.98, 27, 2), hexc('#a8403a')), root)
    link(cone((L / 2 + 6, 0, 3), 14, 12, hexc('#2f3a48'), rot=(0, math.pi / 2, 0), verts=4), root)
    link(box((-L / 2 + 12, 0, 18), (14, 26, 18), hexc('#f2f2ee')), root)
    items = []
    for i in range(int((L - 40) / 13)):
        for j in range(4):
            for k in range(rnd.randint(2, 5)):
                items.append((-L / 2 + 28 + i * 13, -10.5 + j * 7, 10.5 + k * 2.6, 12.4, 6.6, 2.5))
    rnd.shuffle(items)
    G = len(CONT_C)
    for g in range(G):
        o = mbox(items[g::G], CONT_C[g], 'cont'); link(o, root)
    return root


def tanker(loc, rot_z=0.0, L=160, name='tanker'):
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 3), (L, 26, 10), hexc('#3a3e44')), root)
    link(box((0, 0, -2), (L * 0.98, 25, 2), hexc('#8a2e2e')), root)
    link(box((0, 0, 8.3), (L * 0.8, 20, 0.6), hexc('#7a8a6a')), root)
    link(box((-L / 2 + 10, 0, 15), (12, 22, 14), hexc('#f2f2ee')), root)
    return root


def gantry_crane(loc, rot_z=0.0, c=hexc('#c0392b'), name='crane'):
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    for sx in (-8, 8):
        for sy in (-6, 6):
            link(box((sx, sy, 15), (1.2, 1.2, 30), c), root)
    link(box((0, 0, 31), (18, 14, 2.5), c), root)
    link(box((0, 25, 33), (3, 60, 2.2), c), root)
    link(box((0, -10, 36), (3, 3, 8), c), root)
    return root


def frigate(loc, rot_z=0.0, s=1.0, name='frigate'):
    """江戸時代の終わりの外国の軍艦（模式：黒い船体の三本マストの帆船。旗・紋章なし）。前は +x"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    hull = hexc('#2b2622'); band = hexc('#d8cfb0')
    link(box((0, 0, 1.5), (42, 10, 6), hull), root)
    link(cone((24, 0, 2.2), 5.0, 9, hull, rot=(0, math.pi / 2, 0), verts=4), root)
    link(box((0, -5.02, 2.6), (40, 0.05, 0.8), band), root); link(box((0, 5.02, 2.6), (40, 0.05, 0.8), band), root)
    link(box((-18, 0, 5.3), (8, 9.6, 2.2), hull), root)
    for x, h in ((14, 30), (0, 34), (-13, 27)):
        link(cyl((x, 0, 4.5 + h / 2), 0.45, h, hexc('#5a4632')), root)
        for k, z in enumerate((h * 0.4, h * 0.65, h * 0.85)):
            wd = 16 - k * 4
            link(box((x, 0, 4.5 + z), (0.3, wd, 0.3), hexc('#5a4632')), root)
            link(box((x + 0.4, 0, 4.5 + z - 2.6), (0.15, wd * 0.95, 5.0), hexc('#efe6cf')), root)
    link(cyl((29, 0, 6), 0.3, 14, hexc('#5a4632'), rot=(0, 1.2, 0)), root)
    return root


# ======================================================================
# 街・地形
# ======================================================================
def skyline(n, cx=0, cy=0, nx=6, ny=6, pitch=40.0, hr=(40, 200), seed=4, lit=None, wall=None, night=False):
    """高層ビルの街（新宿のような）。窓の帯をまとめたメッシュ"""
    rnd = random.Random(seed)
    walls = {}
    wins = []; litw = []
    for i in range(nx):
        for j in range(ny):
            x = cx + (i - (nx - 1) / 2) * pitch + rnd.uniform(-5, 5); y = cy + (j - (ny - 1) / 2) * pitch + rnd.uniform(-5, 5)
            w = rnd.uniform(18, 30); d = rnd.uniform(18, 30); h = rnd.uniform(*hr)
            c = wall or rnd.choice([hexc('#c9ced3'), hexc('#aeb8c2'), hexc('#d8d4cc'), hexc('#8d99a6'), hexc('#b8c2c8')])
            walls.setdefault(c, []).append((x, y, h / 2, w, d, h))
            for fl in range(int(h / 4)):
                z = 2 + fl * 4
                tgt = litw if (lit is not None and rnd.random() < lit) else wins
                tgt.append((x, y - d / 2 - 0.05, z, w * 0.9, 0.1, 1.6))
                tgt.append((x - w / 2 - 0.05, y, z, 0.1, d * 0.9, 1.6))
    for c, it in walls.items():
        mbox(it, c, 'sky')
    mbox(wins, hexc('#33414f') if night else hexc('#7f97ab'), 'skywin')
    if litw:
        return mbox(litw, hexc('#ffd98a'), 'skylit')
    return None


def hill_terrain(size, res, fn, rgb, name='hill', x0=None, y0=None):
    return terrain(size, res, fn, rgb, name, x0=x0, y0=y0)


def pine_row(x0, x1, y, k=30, seed=3):
    rnd = random.Random(seed)
    items = []; tr = []
    for i in range(k):
        x = x0 + (x1 - x0) * i / (k - 1) + rnd.uniform(-1, 1); yy = y + rnd.uniform(-2, 2); h = rnd.uniform(6, 9)
        tr.append(((x, yy, 0), (x, yy, h * 0.7), 0.18))
        items.append((x, yy, h * 0.75, rnd.uniform(1.8, 2.6), 0.9, 0.9, 0.55))
    mbar(tr, hexc('#5a4632'), 'ptrunk', segs=5)
    msph([(x, y, z, r, a, b, c) for x, y, z, r, a, b, c in items], hexc('#2f5a3a'), 'pine', sub=1)


def thatched(loc, w=8, d=6, rot_z=0.0, name='minka'):
    """江戸の村の家（茅葺きの屋根・板壁）"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 1.4), (w, d, 2.8), hexc('#8a6a4a')), root)
    link(roof((0, 0, 2.8), w + 1.6, d + 1.6, 3.4, hexc('#9a8a5a'), rot_z=math.pi / 2), root)
    link(box((0, -d / 2 - 0.05, 1.2), (1.6, 0.08, 2.0), hexc('#3a2a1a')), root)
    return root


def flat_house(loc, w=7, d=6, rot_z=0.0, name='crushed'):
    """つぶれた家（屋根が地面近くまで落ちた形）"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(roof((0, 0, 0.6), w + 1.4, d + 1.2, 1.4, hexc('#7a6a4a'), rot_z=math.pi / 2), root)
    root.rotation_euler.x = 0.12
    rubble((loc[0], loc[1], 0), k=10, spread=(2.5, 2), seed=int(loc[0] * 3) % 97, cols=[hexc('#8a6a4a'), hexc('#5a4632')])
    return root


# ======================================================================
# 室内
# ======================================================================
def office_floor(n, w=24, d=16, h=3.2, night=False, seed=1, desks=True, people=True, window_c=None):
    """高層ビルのオフィス（窓は -y 側の全面ガラス）。家具は床の空 floor に付ける。戻り値 dict"""
    rnd = random.Random(seed)
    s = bpy.context.scene
    sky(hexc('#b8cfe4')); s.view_settings.exposure = 0.45
    light_dir((0.3, -0.6, 0.7)); no_shadow()
    fl = empty((0, 0, 0), 'floor')
    link(box((0, 0, -0.1), (w, d, 0.2), hexc('#8c9096')), fl)
    link(box((0, 0, h + 0.1), (w, d, 0.2), hexc('#eef0f0')), fl)
    link(box((0, d / 2, h / 2), (w, 0.2, h), hexc('#e8e6e0')), fl)
    link(box((-w / 2, 0, h / 2), (0.2, d, h), hexc('#e8e6e0')), fl)
    link(box((w / 2, 0, h / 2), (0.2, d, h), hexc('#e8e6e0')), fl)
    for x in range(-int(w / 2), int(w / 2) + 1, 4):
        link(box((x, -d / 2, h / 2), (0.25, 0.25, h), hexc('#d0d2d4')), fl)
    # 天井の照明
    for x in (-8, 0, 8):
        for y in (-4, 2):
            link(box((x, y, h - 0.02), (3, 0.5, 0.04), hexc('#fbfaf2')), fl)
    H = dict(floor=fl, chairs=[], shelves=[], copier=None, people=[])
    if desks:
        for i in range(4):
            for j in range(2):
                x = -9 + i * 6; y = -2 + j * 5
                link(box((x, y, 0.72), (4.2, 1.6, 0.06), hexc('#d9d2c2')), fl)
                for sx in (-1.9, 1.9):
                    link(box((x + sx, y, 0.36), (0.06, 1.4, 0.72), hexc('#9a9a96')), fl)
                for k in (-1, 1):
                    link(box((x + k * 1.0, y + 0.3, 0.95), (0.55, 0.05, 0.38), hexc('#2a2e34')), fl)
                    ch = empty((x + k * 1.0, y - 1.2, 0), 'chair'); link(ch, fl)
                    link(box((0, 0, 0.48), (0.55, 0.55, 0.08), hexc('#3a4a6a')), ch)
                    link(box((0, 0.27, 0.85), (0.5, 0.06, 0.65), hexc('#3a4a6a')), ch)
                    link(cyl((0, 0, 0.24), 0.04, 0.44, hexc('#5a5a5a')), ch)
                    link(box((0, 0, 0.04), (0.6, 0.6, 0.05), hexc('#2a2a2a')), ch)
                    H['chairs'].append(ch)
    # 棚（奥の壁ぎわ）：支点は下の縁
    for k in range(3):
        p = pivot((-8 + k * 3.2, d / 2 - 0.5, 0), 0, 'shelf'); link(p, fl)
        link(box((0, 0, 0.9), (2.6, 0.45, 1.8), hexc('#9aa0a6')), p)
        for z in (0.5, 1.0, 1.5):
            link(box((0, -0.05, z), (2.4, 0.38, 0.32), rnd.choice([hexc('#e2d8c4'), hexc('#5a7a9a'), hexc('#c46a4a')])), p)
        H['shelves'].append(p)
    cp = empty((8, d / 2 - 1.4, 0), 'copier'); link(cp, fl)
    link(box((0, 0, 0.55), (1.2, 0.8, 1.1), hexc('#dcdcd6')), cp)
    link(box((0, 0, 1.15), (1.1, 0.7, 0.12), hexc('#bfc2c4')), cp)
    link(box((-0.4, -0.41, 0.9), (0.3, 0.02, 0.15), hexc('#3a8a5a')), cp)
    H['copier'] = cp
    return H


def slide(o, n, f0, keys_xy, period=96):
    """家具が揺れに合わせて床を滑る（往復しながらずれていく）"""
    p0 = o.location.copy()
    o.keyframe_insert('location', frame=1); o.keyframe_insert('location', frame=max(2, f0))
    for i, (df, dx, dy) in enumerate(keys_xy):
        o.location = p0 + Vector((dx, dy, 0)); o.keyframe_insert('location', frame=f0 + df)


def sway_floor(fl, n, f0, f1, amp=0.35, period=120, axis=0, ramp=48):
    """床（空）をゆっくり左右に動かす（船のような揺れ）"""
    b = fl.location.copy()
    for f in range(1, n + 2, 3):
        env = 0.0 if f < f0 else min(1.0, (f - f0) / ramp)
        if f > f1:
            env *= max(0, 1 - (f - f1) / ramp)
        v = list(b); v[axis] += amp * env * math.sin(2 * math.pi * (f - f0) / period)
        fl.location = v; fl.keyframe_insert('location', frame=f)
        fl.rotation_euler = (0, amp * env * 0.012 * math.sin(2 * math.pi * (f - f0) / period - 0.6), 0)
        fl.keyframe_insert('rotation_euler', frame=f)


def interior_box(w, d, h, floor_c, wall_c, ceil=True, front=False, name='rm'):
    box((0, 0, -0.1), (w, d, 0.2), floor_c, name=name)
    box((0, d / 2, h / 2), (w, 0.2, h), wall_c)
    box((-w / 2, 0, h / 2), (0.2, d, h), wall_c)
    box((w / 2, 0, h / 2), (0.2, d, h), wall_c)
    if ceil:
        box((0, 0, h + 0.1), (w, d, 0.2), hexc('#f2f2ee'))
    if front:
        box((0, -d / 2, h / 2), (w, 0.2, h), wall_c)


def tv_set(loc, w=2.4, tex=None, rot_z=0.0, stand=True, name='tv'):
    """薄型テレビ（画面は tex の板）。戻り値：root"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    h = w * 9 / 16
    link(box((0, 0.06, 0), (w + 0.12, 0.08, h + 0.12), hexc('#1a1a1c')), root)
    if stand:
        link(box((0, 0.1, -h / 2 - 0.35), (0.3, 0.2, 0.6), hexc('#2a2a2c')), root)
    if tex is not None:
        link(tex, root); tex.location = (0, 0.0, 0); tex.rotation_euler = (math.pi / 2, 0, 0); tex.scale = (w, h, 1)
    return root


def shelf_unit(loc, w=6.0, levels=5, rot_z=0.0, fill=0.0, seed=1, cols=None, name='shelf', items_out=None):
    """店の棚（前は -y）。fill=0〜1 で商品の量。items_out にリストを渡すと商品の物（段ごと）を返す"""
    rnd = random.Random(seed)
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0.3, 1.0), (w, 0.08, 2.0), hexc('#e6e6e2')), root)
    for k in range(levels):
        z = 0.15 + k * 0.42
        link(box((0, 0, z), (w, 0.62, 0.03), hexc('#c8ccd0')), root)
    cols = cols or [hexc('#e8c070'), hexc('#d9534f'), hexc('#5a8ac0'), hexc('#f2f2ee'), hexc('#6aa86a'), hexc('#e88a3a')]
    groups = {}
    for k in range(levels):
        z = 0.15 + k * 0.42
        x = -w / 2 + 0.2
        while x < w / 2 - 0.2:
            if rnd.random() < fill:
                c = rnd.randrange(len(cols))
                groups.setdefault(c, []).append((x, -0.05, z + 0.16, 0.22, 0.4, 0.3))
            x += 0.26
    out = []
    for c, it in groups.items():
        o = mbox(it, cols[c], 'goods'); link(o, root)
        out.append(o)
    if items_out is not None:
        items_out += out
    return root


def paper_notice(loc, rot=(math.pi / 2, 0, 0), w=0.42, h=0.3, text='入荷のめどが\n立っていません', name='notice'):
    def fn(im, d):
        d.rectangle((0, 0, im.width, im.height), fill=(252, 250, 240))
        d.rectangle((12, 12, im.width - 12, im.height - 12), outline=(200, 60, 60), width=8)
        f = _font(int(im.height * 0.2))
        y = int(im.height * 0.22)
        for line in text.split('\n'):
            tw = d.textlength(line, font=f)
            d.text(((im.width - tw) / 2, y), line, font=f, fill=(40, 40, 40)); y += int(im.height * 0.3)
    import zlib
    return tex_board('notice_' + str(zlib.crc32(text.encode()) % 100000), fn, loc, w, h, rot=rot, size=(600, 430))


def cardboard_bed(loc, rot_z=0.0, c=hexc('#c9a26a'), name='cb'):
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0.18), (0.9, 2.0, 0.36), c), root)
    link(box((0, 0, 0.38), (0.86, 1.9, 0.05), hexc('#5a7aa8')), root)
    return root


def flashlight(p, k=1, beam=6.0, a=0.22, rgb=(1.0, 0.95, 0.75)):
    """人の手に懐中電灯（前へ光の円すい）。腕 k を前へ出す"""
    j = arm_to(p, k, (0.2 if k else -0.2, -0.5, 1.15))
    hand = empty((0, 0, -0.6), 'hand'); link(hand, j)
    link(cyl((0, 0, 0), 0.04, 0.2, hexc('#2a2a2a'), rot=(math.pi / 2, 0, 0)), hand)
    b = cone((0, 0, 0), beam * 0.28, beam, rgb, verts=16)
    b.data.materials.clear(); b.data.materials.append(gmat(rgb, a, 'beam'))
    link(b, O[p['rig']])
    b.location = (0.2 if k else -0.2, -0.6 - beam / 2, 1.0); b.rotation_euler = (-math.pi / 2 + 0.25, 0, 0)
    return b


def phone_glow(loc, rgb=(0.75, 0.88, 1.0), r=0.12, f=None):
    o = ball(loc, r, rgb, a=0.95, seg=8, name='phglow')
    if f is not None:
        appear(o, f, grow=2)
    return o


def lamp_post(loc, h=5.0, lit=True):
    cyl((loc[0], loc[1], h / 2), 0.08, h, hexc('#5a5e64'))
    return ball((loc[0], loc[1], h), 0.25, (1.0, 0.86, 0.55) if lit else (0.25, 0.25, 0.25), seg=10, name='lamp')


def firefighter(loc, rnd, rot_z=0.0, name='ff'):
    """消防の人（紺の服・ヘルメット）"""
    p = person(loc, hexc('#2a3550'), pants=hexc('#2a3550'), skin=rnd.choice(SKIN[:3]), hair=hexc('#c8a030'), rot_z=rot_z, name=name)
    h = O[p['head']]
    link(sphere((0, 0.01, 0.07), 0.155, hexc('#d8d8d0'), scale=(1, 1.05, 0.7), seg=12), h)
    link(box((0, 0, 1.15), (0.44, 0.05, 0.08), hexc('#e0c040')), O[p['rig']])
    return p


def worker(loc, rnd, rot_z=0.0, name='wk', vest=hexc('#f08a2a'), pose='stand'):
    p = person(loc, vest, pants=hexc('#4a5060'), skin=rnd.choice(SKIN[:3]), hair=hexc('#f2f2ee'), rot_z=rot_z, name=name, pose=pose)
    h = O[p['head']]
    link(sphere((0, 0.01, 0.07), 0.15, hexc('#f2f2ee'), scale=(1, 1.05, 0.7), seg=12), h)
    return p


def soldier(loc, rnd, rot_z=0.0, name='sd'):
    p = person(loc, OLIVE, pants=OLIVE, skin=rnd.choice(SKIN[:3]), hair=OLIVE, rot_z=rot_z, name=name)
    link(sphere((0, 0.01, 0.07), 0.155, hexc('#4a5034'), scale=(1, 1.05, 0.7), seg=12), O[p['head']])
    return p


def shovel_arms(p, n, period=36, seed=1):
    """泥をかき出す：両腕を前で上下させ、体を少し前へ倒す"""
    rnd = random.Random(seed)
    js = [O[a] for a in p['arms']]
    for k, j in enumerate(js):
        ph = rnd.randint(0, period)
        for f in range(1, n + period, period // 2):
            up_ = ((f + ph) // (period // 2)) % 2
            j.rotation_euler = (-0.6 - 0.7 * up_, 0, 0); j.keyframe_insert('rotation_euler', frame=f)
    p['arms'] = []
    rig = O[p['rig']]; rig.rotation_euler.x = 0.25
    sh = empty((0, -0.55, 0.85), 'shovel'); link(sh, O[p['rig']])
    link(cyl((0, 0, 0), 0.025, 1.2, hexc('#8a6a48'), rot=(0.9, 0, 0)), sh)
    link(box((0, -0.45, -0.38), (0.26, 0.04, 0.3), hexc('#6a6e74'), rot=(0.9, 0, 0)), sh)
    return p


def wave_hand(p, n, k=1, period=14):
    """手を大きく振る（助けを求める）"""
    j = O[p['arms'][k]]
    for f in range(1, n + period, period // 2):
        up_ = (f // (period // 2)) % 2
        j.rotation_euler = (math.pi * 0.92, 0, (0.45 if up_ else -0.25) * (1 if k else -1)); j.keyframe_insert('rotation_euler', frame=f)
    arms = list(p['arms']); arms.remove(j.name); p['arms'] = arms
    return j


def V(name, fn, **kw):
    """カットの変種（同じ場面を、別の名前・設定で）。呼び出し側のモジュールに登録する"""
    import inspect
    def f(n):
        return fn(n, **kw)
    f.__name__ = name
    inspect.currentframe().f_back.f_globals[name] = f
    return f


def below(fn, dz):
    """fn() で新しく作った物を、まとめて dz だけ下げる（高い階から見下ろす街）"""
    before = set(o.name for o in bpy.data.objects)
    r = fn()
    for o in bpy.data.objects:
        if o.name not in before and o.parent is None:
            o.location.z += dz
    return r
