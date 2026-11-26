"""「もしも全人類が1000年眠ったら」用の部品。猫の動画の kit.py / shots.py / shots_v5.py と、心臓の動画の hk.py の上に足す。
- 交差点（渋谷のような、ロゴ・看板の文字なし）：crossing(stage)。stage = 0（夕方）/ 'night' / 10 / 100 / 1000 年後
- 眠る人（SLEEPERS：毎回同じ場所に同じ服の人が眠る）、起き上がる人
- まとめて作る部品（一つのメッシュ）：mbox / msph / mbar / mcone（数百個の木・星・窓・草を軽く作る）
- 星空と天の川、雨、水面、錆びる鉄塔、竹、五重塔、社、古墳、石垣、茶わん・ガラス瓶、火山と噴煙、崩れるビル、動物（シカ・イノシシ・タヌキ）
"""
import os, sys, math, random
import bpy
HEARTS = '/home/user/TUBEX/pilots/moshimo-two-hearts/video'
if HEARTS not in sys.path:
    sys.path.insert(0, HEARTS)
from hk import *
from shots import _font, _tl
from kit import COATS, _osc
import bmesh
from mathutils import Matrix, Vector, Euler

RK = random.Random(1000)


# ---------------- 速い基本形（bpy.ops を使わない） ----------------
# bpy.ops の基本形は、場面の物が増えるほど1回ごとに遅くなる（人を数百人置くと数分かかる）。
# 同じ形・同じ置き方を bmesh とデータ API で作り、kit / shots / shots_v5 / hk の関数を、この動画の処理の中だけ差し替える。
import kit as _kit, shots as _shots, shots_v5 as _shots5, hk as _hk


def _new_obj(bm, name):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o)
    return o


def f_box(loc, size, rgb, rot=(0, 0, 0), name='box', bevel=0.0):
    bm = bmesh.new()
    # bpy.ops 版と同じく、位置・回転・大きさをメッシュに焼き込む（物体は原点）
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(loc) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((size[0], size[1], size[2], 1)))
    o = _new_obj(bm, name)
    if bevel:
        m = o.modifiers.new('b', 'BEVEL'); m.width = bevel; m.segments = 2
    return setmat(o, rgb)


def f_sphere(loc, r, rgb, scale=(1, 1, 1), seg=24, name='sph'):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=max(8, seg // 2), radius=r)
    o = _new_obj(bm, name)
    for p_ in o.data.polygons:
        p_.use_smooth = True
    o.location = loc; o.scale = scale
    return setmat(o, rgb)


def f_cyl(loc, r, h, rgb, rot=(0, 0, 0), verts=16, name='cyl', r2=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=verts, radius1=r, radius2=(r if r2 is None else r2), depth=h)
    o = _new_obj(bm, name); o.location = loc; o.rotation_euler = rot
    return setmat(o, rgb)


def f_cone(loc, r, h, rgb, rot=(0, 0, 0), verts=12, name='cone'):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=True, segments=verts, radius1=r, radius2=0.0, depth=h)
    o = _new_obj(bm, name); o.location = loc; o.rotation_euler = rot
    return setmat(o, rgb)


def f_plane(loc, size, rgb, rot=(0, 0, 0), name='plane'):
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5, matrix=Matrix.Translation(loc) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((size[0], size[1], 1, 1)))
    o = _new_obj(bm, name)
    return setmat(o, rgb)


for _m in (_kit, _shots, _shots5, _hk):
    for _nm, _fn in (('box', f_box), ('sphere', f_sphere), ('cyl', f_cyl), ('cone', f_cone), ('plane', f_plane)):
        if hasattr(_m, _nm):
            setattr(_m, _nm, _fn)
box, sphere, cyl, cone, plane = f_box, f_sphere, f_cyl, f_cone, f_plane


def MB(amb='city', **kw):
    """音のメタ（audio.py が読む）。心臓の音は使わない（beats=0）"""
    m = M([], 0.0, amb=amb)
    m['beats'] = 0
    m.update(kw)
    shadow_budget()
    return m


SHADOW_POLYS = 12000


def shadow_budget():
    """Workbench の影（シャドウボリューム）は CPU 描画で三角形の数に比例して重い（10万面で1コマ25秒）。
    面の多い場面では影を切る（切ると1コマ3秒ほど）"""
    s = bpy.context.scene
    polys = sum(len(o.data.polygons) for o in bpy.data.objects if o.type == 'MESH')
    if polys > SHADOW_POLYS:
        s.display.shading.show_shadows = False


# ---------------- まとめて作る（一つのメッシュ） ----------------
def _obj(bm, rgb, name, a=1.0, smooth=False):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o)
    o.data.materials.append(mat(rgb) if a >= 1.0 else gmat(rgb, a, name))
    return o


def _mtx(c, s=(1, 1, 1), rz=0.0, rot=None):
    R = rot.to_matrix().to_4x4() if rot is not None else Matrix.Rotation(rz, 4, 'Z')
    return Matrix.Translation(Vector(c)) @ R @ Matrix.Diagonal((s[0], s[1], s[2], 1))


def mbox(items, rgb, name='mbox', a=1.0):
    """items: (cx, cy, cz, sx, sy, sz[, rz]) の箱をまとめて1つのメッシュに"""
    bm = bmesh.new()
    for it in items:
        rz = it[6] if len(it) > 6 else 0.0
        bmesh.ops.create_cube(bm, size=1.0, matrix=_mtx(it[:3], it[3:6], rz))
    return _obj(bm, rgb, name, a)


def msph(items, rgb, name='msph', a=1.0, sub=1, smooth=False):
    """items: (cx, cy, cz, r[, sx, sy, sz]) の球（低ポリ）"""
    bm = bmesh.new()
    for it in items:
        r = it[3]; sc = it[4:7] if len(it) >= 7 else (1, 1, 1)
        bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0, matrix=_mtx(it[:3], (r * sc[0], r * sc[1], r * sc[2])))
    return _obj(bm, rgb, name, a, smooth)


def mbar(items, rgb, name='mbar', segs=6, a=1.0):
    """items: (p0, p1, r[, r2]) の棒"""
    bm = bmesh.new()
    for it in items:
        p0, p1, r = Vector(it[0]), Vector(it[1]), it[2]; r2 = it[3] if len(it) > 3 else r
        d = p1 - p0
        if d.length < 1e-6:
            continue
        q = Vector((0, 0, 1)).rotation_difference(d)
        M_ = Matrix.Translation((p0 + p1) / 2) @ q.to_matrix().to_4x4()
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r, radius2=r2, depth=d.length, matrix=M_)
    return _obj(bm, rgb, name, a)


def mcone(items, rgb, name='mcone', segs=5):
    """items: (x, y, z, r, h[, tx, ty]) の円すい（草・竹の葉・針葉樹）。tx, ty は傾き"""
    bm = bmesh.new()
    for it in items:
        x, y, z, r, h = it[:5]; tx = it[5] if len(it) > 5 else 0.0; ty = it[6] if len(it) > 6 else 0.0
        R = Euler((tx, ty, 0)).to_matrix().to_4x4()
        M_ = Matrix.Translation((x, y, z)) @ R @ Matrix.Translation((0, 0, h / 2))
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r, radius2=0.0, depth=h, matrix=M_)
    return _obj(bm, rgb, name)


def terrain(size, res, hfn, rgb, name='terrain', x0=None, y0=None, a=1.0):
    """高さ hfn(x, y) の地面（格子）"""
    sx, sy = (size, size) if not isinstance(size, (tuple, list)) else size
    x0 = -sx / 2 if x0 is None else x0; y0 = -sy / 2 if y0 is None else y0
    nx = ny = res
    bm = bmesh.new()
    vs = [[bm.verts.new((x0 + sx * i / nx, y0 + sy * j / ny, hfn(x0 + sx * i / nx, y0 + sy * j / ny))) for j in range(ny + 1)] for i in range(nx + 1)]
    for i in range(nx):
        for j in range(ny):
            bm.faces.new((vs[i][j], vs[i + 1][j], vs[i + 1][j + 1], vs[i][j + 1]))
    return _obj(bm, rgb, name, a)


# ---------------- アニメーションの小道具 ----------------
def grow(o, f0, f1, axis=None):
    """f0 から f1 で、0 から元の大きさへ（axis='z' なら高さだけ）"""
    s0 = o.scale.copy()
    if axis == 'z':
        o.scale = (s0.x, s0.y, 0.0)
    else:
        o.scale = (0, 0, 0)
    o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=max(1, f0))
    o.scale = s0; o.keyframe_insert('scale', frame=max(f0 + 1, f1))
    set_interp(o, 'LINEAR', 'scale')
    if f0 > 1:
        set_interp(o, 'CONSTANT', 'scale', {1})


def key_color(m, f, rgb, a=1.0):
    m.diffuse_color = (*rgb, a); m.keyframe_insert('diffuse_color', frame=f)


def color_ramp(o, keys):
    """o の材質（専用に作り直す）の色を keys=[(f, rgb), ...] で変える"""
    m = gmat(keys[0][1], 1.0, 'ramp')
    o.data.materials.clear(); o.data.materials.append(m)
    for f, c in keys:
        key_color(m, f, c)
    return m


def sky_keys(keys):
    """背景の色 keys=[(f, rgb), ...]"""
    w = bpy.context.scene.world
    for f, c in keys:
        w.color = c; w.keyframe_insert('color', frame=f)


def exposure_keys(keys):
    vs = bpy.context.scene.view_settings
    for f, e in keys:
        vs.exposure = e; vs.keyframe_insert('exposure', frame=f)


def saw(o, n, idx, a, b, period, phase=0):
    """o.location[idx] を a から b へ、period ごとにくり返す（雨・灰・しずく）"""
    f = 1 - phase
    while f < n + period:
        v = list(o.location); v[idx] = a; o.location = v; o.keyframe_insert('location', index=idx, frame=f)
        v[idx] = b; o.location = v; o.keyframe_insert('location', index=idx, frame=f + period - 0.01)
        f += period
    linear(o, 'location')


def rain(n, xr, yr, top=14.0, k=900, seed=1, c=(0.78, 0.84, 0.9), L=0.9, period=12, a=0.55, tilt=0.12):
    """雨：細い棒の層を2枚、上から下へくり返し動かす"""
    rnd = random.Random(seed)
    out = []
    for layer in range(2):
        items = []
        for i in range(k // 2):
            items.append((rnd.uniform(*xr), rnd.uniform(*yr), rnd.uniform(0, top * 2), 0.018, 0.018, L, 0))
        o = mbox(items, c, f'rain{layer}', a=a)
        o.rotation_euler = (tilt, 0, 0)
        saw(o, n, 2, 0.0, -top, period, phase=layer * period // 2)
        out.append(o)
    return out


def falling_bits(n, xr, yr, top=12.0, k=500, seed=2, c=hexc('#b8b6b0'), r=0.05, period=90):
    """灰の粒：ゆっくり降る"""
    rnd = random.Random(seed)
    out = []
    for layer in range(2):
        items = [(rnd.uniform(*xr), rnd.uniform(*yr), rnd.uniform(0, top * 2), r) for _ in range(k // 2)]
        o = msph(items, c, f'ash{layer}', sub=0)
        saw(o, n, 2, 0.0, -top, period, phase=layer * period // 2)
        out.append(o)
    return out


def water(loc, size, z0, z1, f0, f1, c=hexc('#5f8fb0'), a=0.78, name='water'):
    """水面：f0 から f1 で z0 から z1 へ上がる"""
    o = plane((0, 0, 0), size, c, name=name)
    o.data.materials.clear(); o.data.materials.append(gmat(c, a, name))
    o.location = (loc[0], loc[1], z0); o.keyframe_insert('location', index=2, frame=1)
    o.keyframe_insert('location', index=2, frame=max(1, f0))
    o.location.z = z1; o.keyframe_insert('location', index=2, frame=max(f0 + 1, f1))
    return o


def ripple(o, n, amp=0.015, period=40):
    """水面の小さな上下"""
    base = o.location.z
    for f in range(1, n + period, period // 2):
        o.location.z = base + (amp if (f // (period // 2)) % 2 else -amp); o.keyframe_insert('location', index=2, frame=f)
    o.location.z = base
    return o


# ---------------- 空：星・天の川・夕日 ----------------
def star_dome(n, k=300, R=900.0, seed=7, f0=None, f1=None, size=(1.0, 2.4), min_el=0.08, groups=8, c=(1.0, 1.0, 0.96),
              band=None, band_k=0, center=(0, 0, 0)):
    """空いっぱいの星。f0〜f1 で groups 回に分けて順に出す（f0=None なら最初から全部）。
    band=(方位, 傾き) を渡すと、天の川の帯に band_k 個の小さな星を集める"""
    rnd = random.Random(seed)
    pts = []
    for i in range(k):
        az = rnd.uniform(0, 2 * math.pi); el = math.asin(rnd.uniform(math.sin(min_el), 0.98))
        pts.append((az, el, rnd.uniform(*size)))
    if band:
        az0, tilt = band
        for i in range(band_k):
            u = rnd.uniform(0, math.pi)
            # 大円を傾けて置き、少しばらす
            v = Vector((math.cos(u), math.sin(u), 0))
            v = Matrix.Rotation(tilt, 3, 'X') @ v
            v = Matrix.Rotation(az0, 3, 'Z') @ v
            v += Vector((rnd.gauss(0, 0.07), rnd.gauss(0, 0.07), rnd.gauss(0, 0.07)))
            if v.z < math.sin(min_el):
                continue
            v.normalize()
            pts.append((math.atan2(v.y, v.x), math.asin(v.z), rnd.uniform(0.9, 1.8)))
    rnd.shuffle(pts)
    objs = []
    G = groups if f0 is not None else 1
    for g in range(G):
        items = []
        for az, el, s in pts[g::G]:
            items.append((center[0] + R * math.cos(el) * math.cos(az), center[1] + R * math.cos(el) * math.sin(az), center[2] + R * math.sin(el), s))
        if not items:
            continue
        o = msph(items, c, f'stars{g}', sub=0)
        if f0 is not None:
            appear(o, int(f0 + (f1 - f0) * g / max(1, G - 1)))
        objs.append(o)
    return objs


def milky_way(az0=0.6, tilt=1.1, R=880.0, seed=8, a=0.07, center=(0, 0, 0), f0=None):
    """天の川：帯に集めた小さな星（星の数で見せる。半透明の楕円は使わない）"""
    return star_dome(1, k=0, seed=seed + 100, size=(0.5, 1.0), band=(az0, tilt), band_k=2600, R=R * 1.01, center=center,
                     c=(0.85, 0.88, 1.0), f0=f0, f1=(f0 + 24) if f0 is not None else None, groups=3)
    rnd = random.Random(seed)
    out = []
    for i in range(48):
        u = math.pi * (i + 0.5) / 48
        v = Vector((math.cos(u), math.sin(u), 0))
        v = Matrix.Rotation(tilt, 3, 'X') @ v
        v = Matrix.Rotation(az0, 3, 'Z') @ v
        if v.z < 0.03:
            continue
        p = Vector(center) + v * R
        o = ball(tuple(p), 1.0, (0.78, 0.8, 0.95), a=a * rnd.uniform(0.6, 1.2), seg=12, name='mw')
        tdir = (Matrix.Rotation(az0, 3, 'Z') @ (Matrix.Rotation(tilt, 3, 'X') @ Vector((-math.sin(u), math.cos(u), 0))))
        q = Vector((1, 0, 0)).rotation_difference(tdir)
        o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = q
        o.scale = (R * 0.07, R * rnd.uniform(0.045, 0.075), R * 0.006)
        if f0 is not None:
            appear(o, f0 + i)
        out.append(o)
    return out


def sun_disc(az, el, R=900.0, r=40.0, c=(1.0, 0.62, 0.3), center=(0, 0, 0)):
    p = (center[0] + R * math.cos(el) * math.cos(az), center[1] + R * math.cos(el) * math.sin(az), center[2] + R * math.sin(el))
    return ball(p, r, c, seg=24, name='sun')


def clouds(k=8, R=700.0, el=(0.05, 0.25), seed=3, c=(1.0, 0.8, 0.7), a=0.7, az=(0, 2 * math.pi), center=(0, 0, 0)):
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        A_ = rnd.uniform(*az); E = rnd.uniform(*el)
        p = (center[0] + R * math.cos(E) * math.cos(A_), center[1] + R * math.cos(E) * math.sin(A_), center[2] + R * math.sin(E))
        o = ball(p, 1.0, c, a=a, seg=12, name='cloud')
        o.scale = (rnd.uniform(60, 130), rnd.uniform(60, 130), rnd.uniform(8, 16))
        o.rotation_euler = (0, 0, A_)
        out.append(o)
    return out


# ---------------- 人 ----------------
def lie_fix(p):
    """寝た人の頭を仰向けに（hs2.night_bedroom と同じ直し方）"""
    nk = O[p['neck']]
    nk.location.y += 0.04; nk.location.z += 0.02
    nk.rotation_euler = (-math.pi / 2, 0, 0)


def add_eyes(p, closed=True):
    """顔に目を付ける（寄りのカット用）。scale z を小さくすると閉じた目"""
    h = O[p['head']]
    eyes = []
    for sx in (-1, 1):
        e = sphere((sx * 0.045, -0.115, 0.0), 0.022, hexc('#1a1414'), scale=(1.0, 0.5, 0.12 if closed else 1.0), seg=10, name='eye')
        link(e, h); eyes.append(e)
    return eyes


def open_eyes(eyes, f):
    for e in eyes:
        e.keyframe_insert('scale', frame=1); e.keyframe_insert('scale', frame=f)
        e.scale = (1.0, 0.5, 1.0); e.keyframe_insert('scale', frame=f + 5)


def tilt_head(p):
    """首と頭の間に「傾き」の空を入れる（animate_life の首振りとは別に、見上げる・うつむくを付ける）"""
    nk = O[p['neck']]; h = O[p['head']]
    # 回す軸を頭の中心から首の付け根へずらす（頭の中心で回すと、玉が回るだけで傾いて見えない）
    off = Vector((0, 0, -0.15)) if p.get('kind') == 'person' else Vector((0, 0.12, -0.06))
    t = empty(tuple(h.location + off), 'tilt'); link(t, nk)
    h.parent = t; h.location = -off
    return t


def look_keys(t, keys):
    """keys=[(f, (rx, ry, rz)), ...]"""
    for f, r in keys:
        t.rotation_euler = r; t.keyframe_insert('rotation_euler', frame=f)


# 千年前と同じ服：眠る人の服の色（席ごとに固定）
SHIRTS = [hexc(h) for h in ['#3d5a80', '#c46a4a', '#4a6b4a', '#8a8a8a', '#d9b26a', '#2f3440', '#7a5a8a', '#e8e2d6', '#5a7a9a',
                            '#b04a5a', '#e0c8a8', '#2a4a6a', '#9ab0c0', '#6a4a3a']]
PANTS = [hexc('#3b4252'), hexc('#2a2a2a'), hexc('#5a5048'), hexc('#4a5a7a')]
HAIRS = [hexc('#2b2420'), hexc('#4a3a2a'), hexc('#1a1a1a'), hexc('#8a8a88')]

SQ = 11.0     # 交差点の四角（|x|, |y| < SQ）
CW0, CW1 = 12.0, 16.0  # 横断歩道の帯（四角の外側）


def _walkers():
    """交差点を渡る人：(出発点, 止まる点, 向き, 色の種)。止まる点が眠る場所（SLEEPERS）"""
    rnd = random.Random(2026)
    out = []
    # 四方の横断歩道：北（y=12..16、x 方向に歩く）・南・東・西
    for side in ('N', 'S', 'E', 'W'):
        for lane in range(4):
            off = CW0 + 0.6 + lane * 0.95
            dirn = 1 if lane < 2 else -1
            k = 4 if lane in (0, 3) else 3
            for j in range(k):
                along = -9.0 + j * (18.0 / k) + rnd.uniform(0, 1.6) + (1.0 if dirn < 0 else 0.0)
                along *= dirn
                start = -dirn * 13.5 - dirn * rnd.uniform(0, 2.5)
                if side in ('N', 'S'):
                    y = off if side == 'N' else -off
                    out.append(((start, y), (along, y), (dirn, 0)))
                else:
                    x = off if side == 'E' else -off
                    out.append(((x, start), (x, along), (0, dirn)))
    # 対角線
    for d in ((1, 1), (1, -1)):
        for lane in (-1, 1):
            u = Vector((d[0], d[1], 0)).normalized(); w = Vector((-u.y, u.x, 0)) * lane * 0.7
            dirn = lane
            for j in range(3):
                t = (-11 + j * 7.2 + rnd.uniform(-0.5, 0.5))
                if abs(t) < 3.0:
                    t += 3.5
                t *= dirn
                p = u * t + w; s0 = u * (-dirn * 16.5) + w
                out.append(((s0.x, s0.y), (p.x, p.y), (u.x * dirn, u.y * dirn)))
    res = []
    for i, (a, b, dv) in enumerate(out):
        h = math.atan2(dv[0], -dv[1])
        res.append(dict(start=a, stop=b, dir=dv, heading=h, lie_rot=h + rnd.uniform(-0.15, 0.15), seed=i,
                        shirt=SHIRTS[i % len(SHIRTS)], pants=PANTS[(i * 3) % 4], hair=HAIRS[(i * 7) % 4], skin=SKIN[(i * 5) % 3]))
    return res


WALKERS = _walkers()


def person_of(w, pose, name, loc=None, rot=None):
    return person(tuple(loc) if loc else (w['stop'][0], w['stop'][1], 0), w['shirt'], pants=w['pants'], skin=w['skin'], hair=w['hair'],
                  rot_z=w['heading'] if rot is None else rot, pose=pose, name=name)


def lie_limbs(p, shirt, skin):
    """寝た人に腕と靴を足す（kit の寝姿勢は胴と脚だけ）"""
    rig = O[p['rig']]
    for sx in (-1, 1):
        link(cyl((sx * 0.28, -0.36, 0.11), 0.055, 0.56, shirt, rot=(math.pi / 2, 0, 0), verts=10), rig)
        link(sphere((sx * 0.28, -0.05, 0.1), 0.05, skin, seg=10), rig)
        link(box((sx * 0.1, 0.98, 0.16), (0.11, 0.08, 0.2), hexc('#222222')), rig)


def sleeper(w, name='sl', z=0.0):
    p = person_of(w, 'lie', name, loc=(w['stop'][0], w['stop'][1], z), rot=w['lie_rot'])
    lie_fix(p)
    lie_limbs(p, w['shirt'], w['skin'])
    return p


def sleep_footprint(x, y, pad=0.5):
    """眠る人の体の上に物を置かない"""
    for w in WALKERS:
        c, s = math.cos(w['lie_rot']), math.sin(w['lie_rot'])
        dx, dy = x - w['stop'][0], y - w['stop'][1]
        lx = c * dx + s * dy; ly = -s * dx + c * dy
        if abs(lx) < 0.3 + pad and -0.95 - pad < ly < 0.95 + pad:
            return True
    return False


def walk_keys(root, p0, p1, f_go, f_stop, n, decel=14):
    """p0 から p1 へ歩く（f_go に出て、f_stop に止まる。最後の decel フレームで減速）"""
    p0 = Vector((p0[0], p0[1], 0)); p1 = Vector((p1[0], p1[1], 0))
    T = max(2, f_stop - f_go)
    dec = min(decel, T // 2)
    # 速さ v で T-dec 進み、減速の間に v*dec/2 進む
    v = 1.0 / ((T - dec) + dec / 2)
    def u(f):
        t = f - f_go
        if t <= 0:
            return 0.0
        if t <= T - dec:
            return v * t
        if t <= T:
            tt = t - (T - dec)
            return v * (T - dec) + v * (tt - tt * tt / (2 * dec))
        return 1.0
    for f in list(range(1, n + 1, 3)) + [n]:
        root.location = p0.lerp(p1, min(1.0, u(f))); root.keyframe_insert('location', frame=f)
    linear(root, 'location')


def visible(o, f_in=None, f_out=None):
    """f_in から f_out の手前まで見せる（それ以外は大きさ 0）。瞬時に切り替える"""
    s0 = o.scale.copy()
    o.scale = s0 if (f_in is None or f_in <= 1) else Vector((0, 0, 0)); o.keyframe_insert('scale', frame=1)
    if f_in is not None and f_in > 1:
        o.scale = s0; o.keyframe_insert('scale', frame=f_in)
    if f_out is not None:
        o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=max(2, f_out))
    o.scale = s0
    set_interp(o, 'CONSTANT', 'scale')


# ---------------- 交差点 ----------------
ASPHALT = hexc('#5d5d62')
WALK_C = hexc('#ecebe6')


def phone(loc, rot_z=0.0, lit=True):
    o = boxc(loc, (0.075, 0.15, 0.012), hexc('#202226'), rot=(0, 0, rot_z))
    if lit:
        sc = box((0, 0, 0.007), (0.064, 0.13, 0.003), hexc('#a8d0f0')); link(sc, o)
    return o


def signal_head(loc, rot_z, n, state='red', s=1.0):
    """歩行者用の信号（赤・青の2灯、縦）。state：'off' / 'red' / 'green' / ('g2r', f)（f で青→赤）/ ('r2g', f)"""
    root = empty(loc, 'sig'); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    link(box((0, 0, 0), (0.5, 0.25, 0.95), hexc('#3a3c40')), root)
    lamps = {}
    for nm, z, on, off in (('red', 0.22, (1.0, 0.12, 0.08), hexc('#4a2a2a')), ('green', -0.22, (0.15, 1.0, 0.65), hexc('#2a4a3a'))):
        link(cyl((0, -0.13, z), 0.17, 0.02, off, rot=(math.pi / 2, 0, 0), verts=20), root)
        o_on = link(cyl((0, -0.135, z), 0.17, 0.02, (1, 1, 1), rot=(math.pi / 2, 0, 0), verts=20), root)
        o_on.data.materials.clear(); o_on.data.materials.append(gmat(on, 1.0, 'lamp'))
        lamps[nm] = o_on
        link(box((0, -0.2, z + 0.18), (0.42, 0.14, 0.03), hexc('#3a3c40')), root)  # ひさし
    g, r = lamps['green'], lamps['red']
    if state == 'off':
        g.scale = (0, 0, 0); r.scale = (0, 0, 0)
    elif state == 'red':
        g.scale = (0, 0, 0)
    elif state == 'green':
        r.scale = (0, 0, 0)
    elif state[0] == 'g2r':
        visible(g, None, state[1]); visible(r, state[1], None)
    else:
        visible(r, None, state[1]); visible(g, state[1], None)
    return root


def car_signal(loc, rot_z, n, green_until=None):
    """車用の信号（横3灯）。green_until=None なら消灯"""
    root = empty(loc, 'csig'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0), (1.3, 0.3, 0.45), hexc('#3a3c40')), root)
    cols = [((0.15, 1.0, 0.6), hexc('#2a4a3a')), ((1.0, 0.75, 0.1), hexc('#4a4228')), ((1.0, 0.12, 0.08), hexc('#4a2a2a'))]
    ons = []
    for k, (on, off) in enumerate(cols):
        x = -0.4 + k * 0.4
        link(cyl((x, -0.16, 0), 0.15, 0.02, off, rot=(math.pi / 2, 0, 0), verts=20), root)
        o = link(cyl((x, -0.165, 0), 0.15, 0.02, (1, 1, 1), rot=(math.pi / 2, 0, 0), verts=20), root)
        o.data.materials.clear(); o.data.materials.append(gmat(on, 1.0, 'lamp'))
        ons.append(o)
    # 歩行者が青のあいだ、車は赤
    ons[0].scale = (0, 0, 0); ons[1].scale = (0, 0, 0)
    if green_until is None:
        ons[2].scale = (0, 0, 0)
    return root


def sig_pole(x, y, n, state='red', rust=False):
    pc = hexc('#7a5a42') if rust else hexc('#8c8e90')
    cyl((x, y, 2.6), 0.09, 5.2, pc, verts=10)
    out = []
    # 向かいの角を向く2つの歩行者用信号
    sx, sy = (1 if x > 0 else -1), (1 if y > 0 else -1)
    out.append(signal_head((x - sx * 0.35, y, 3.0), -sx * math.pi / 2, n, state))
    out.append(signal_head((x, y - sy * 0.35, 3.0), 0 if sy > 0 else math.pi, n, state))
    # 車用：腕を道路側へ
    box((x - sx * 2.0, y, 5.0), (4.0, 0.12, 0.12), pc)
    car_signal((x - sx * 3.6, y, 5.0), 0 if sy > 0 else math.pi, n, None if state == 'off' else 1)
    return out


def crosswalks(c=WALK_C, fade=0.0, seed=4):
    """横断歩道（四方＋対角線）。fade>0 で欠けて薄くなる"""
    rnd = random.Random(seed)
    items = []
    def keep():
        return rnd.random() > fade * 0.8
    for side in ('N', 'S', 'E', 'W'):
        k = 0
        x = -SQ + 0.6
        while x < SQ - 0.3:
            if keep():
                L = (CW1 - CW0) * (1 - fade * rnd.uniform(0, 0.6))
                mid = (CW0 + CW1) / 2 + rnd.uniform(-0.2, 0.2) * fade
                if side == 'N':
                    items.append((x, mid, 0.012, 0.45, L, 0.01))
                elif side == 'S':
                    items.append((x, -mid, 0.012, 0.45, L, 0.01))
                elif side == 'E':
                    items.append((mid, x, 0.012, L, 0.45, 0.01))
                else:
                    items.append((-mid, x, 0.012, L, 0.45, 0.01))
            x += 0.9
    for d in ((1, 1), (1, -1)):
        u = Vector((d[0], d[1], 0)).normalized()
        t = -SQ * 1.35
        while t < SQ * 1.35:
            if keep() and abs(t) > 0.2:
                p = u * t
                ang = math.atan2(u.y, u.x)
                items.append((p.x, p.y, 0.013, 0.45, 4.0 * (1 - fade * rnd.uniform(0, 0.5)), 0.01, ang))
            t += 0.9
    col = c if fade == 0 else tuple(c[i] * (1 - fade * 0.45) + ASPHALT[i] * fade * 0.45 for i in range(3))
    return mbox(items, col, 'zebra')


def corner_blocks(c=hexc('#b8b2a6')):
    for sx in (-1, 1):
        for sy in (-1, 1):
            box((sx * (SQ + 30), sy * (SQ + 30), 0.03), (60, 60, 0.06), c)
    # 車道の中央線
    for sx in (-1, 1):
        box((sx * 50, 0, 0.011), (64, 0.18, 0.01), hexc('#e8c050'))
        box((0, sx * 50, 0.011), (0.18, 64, 0.01), hexc('#e8c050'))


BLDG = [  # (x, y, w, d, h, 壁) ：角を囲むビル（看板の文字なし）
    (22, 22, 14, 12, 34, '#c9c4ba'), (36, 18, 10, 12, 52, '#9fa8b0'), (19, 38, 12, 12, 28, '#d8d0c0'),
    (-22, 22, 14, 14, 44, '#a8acb4'), (-37, 19, 12, 10, 30, '#d0c6b4'), (-20, 40, 12, 14, 58, '#b4bcc4'),
    (-22, -22, 14, 12, 26, '#d6cec0'), (-36, -20, 10, 12, 40, '#b8b0a4'), (-20, -38, 12, 12, 36, '#c4ccd2'),
    (22, -22, 14, 14, 38, '#bcb6ae'), (37, -19, 10, 12, 30, '#cfc8bc'), (20, -40, 12, 12, 64, '#a4aeb8'),
    (52, 30, 14, 14, 46, '#b0b6bc'), (30, 54, 14, 12, 40, '#c8c0b4'), (-52, 32, 14, 12, 36, '#bcc0c6'), (-30, 56, 12, 14, 50, '#ccc4b6'),
    (-52, -30, 14, 14, 42, '#c6beb2'), (-30, -55, 14, 12, 30, '#b6bec6'), (52, -32, 12, 12, 54, '#c0bab0'), (32, -56, 14, 12, 38, '#a8b2ba'),
]


def bldg_block(x, y, w, d, h, wall, lit=0.0, seed=1, rot=0.0, dark_win=None, screen=False, stage=0):
    """ビル1棟：窓の帯を1つのメッシュに。lit>0 なら明かりの点いた窓（別メッシュ、戻り値）"""
    rnd = random.Random(seed)
    wallc = hexc(wall)
    if stage == 'ruin':
        return None
    box((x, y, h / 2), (w, d, h), wallc)
    winc = dark_win or hexc('#6f8296')
    items = []; lit_items = []
    fl = int(h / 3.4)
    for k in range(fl):
        z = 2.2 + k * 3.4
        for (fx, fy, fw, fd) in ((x, y - d / 2 - 0.03, w * 0.86, 0.06), (x, y + d / 2 + 0.03, w * 0.86, 0.06),
                                 (x - w / 2 - 0.03, y, 0.06, d * 0.86), (x + w / 2 + 0.03, y, 0.06, d * 0.86)):
            # 窓を4〜6区画に分ける
            parts = 5
            for pk in range(parts):
                if fw > fd:
                    px = fx - fw / 2 + fw * (pk + 0.5) / parts; py = fy; sx, sy = fw / parts * 0.86, fd
                else:
                    px = fx; py = fy - fd / 2 + fd * (pk + 0.5) / parts; sx, sy = fw, fd / parts * 0.86
                if lit > 0 and rnd.random() < lit:
                    lit_items.append((px, py, z, sx + 0.01, sy + 0.01, 1.5))
                else:
                    items.append((px, py, z, sx, sy, 1.5))
    if items:
        mbox(items, winc, 'win')
    # 屋上の設備
    box((x + w * 0.2, y + d * 0.1, h + 0.8), (w * 0.3, d * 0.3, 1.6), hexc('#9a9a98'))
    if screen:
        # 交差点を向く大きな画面（何も映っていない／文字なし）
        sx_ = -1 if x > 0 else 1; sy_ = -1 if y > 0 else 1
        box((x + sx_ * (w / 2 + 0.25), y, h * 0.62), (0.3, d * 0.8, h * 0.32), hexc('#2a3038'))
        if lit > 0:
            o = box((x + sx_ * (w / 2 + 0.42), y, h * 0.62), (0.05, d * 0.74, h * 0.28), (1, 1, 1))
            o.data.materials.clear(); o.data.materials.append(gmat(hexc('#7ab8e8'), 1.0, 'screen'))
            lit_items_obj = o
        else:
            lit_items_obj = None
    else:
        lit_items_obj = None
    L = mbox(lit_items, hexc('#ffd98a'), 'litwin') if lit_items else None
    return L, lit_items_obj


def bike(loc, rot_z=0.0, down=True, c=hexc('#3a6a9a'), vines=0, seed=1):
    """自転車（倒れている）。vines>0 でつるが絡む"""
    root = empty(loc, 'bike'); root.rotation_euler = (math.pi / 2 if down else 0, 0, rot_z)
    for sx in (-0.55, 0.55):
        link(cyl((sx, 0, 0.34), 0.33, 0.04, hexc('#222222'), rot=(math.pi / 2, 0, 0), verts=20), root)
        link(cyl((sx, 0, 0.34), 0.27, 0.05, hexc('#8a8a8a') if not vines else hexc('#7a6a5a'), rot=(math.pi / 2, 0, 0), verts=20), root)
    for p0, p1 in (((-0.55, 0, 0.34), (0.0, 0, 0.36)), ((0.0, 0, 0.36), (0.45, 0, 0.75)), ((-0.25, 0, 0.75), (0.45, 0, 0.75)),
                   ((-0.55, 0, 0.34), (-0.25, 0, 0.75)), ((0.55, 0, 0.34), (0.45, 0, 0.75)), ((-0.25, 0, 0.75), (0.0, 0, 0.36))):
        link(mbar([(p0, p1, 0.025)], c, 'bf'), root)
    link(box((-0.28, 0, 0.82), (0.22, 0.09, 0.05), hexc('#222222')), root)
    link(box((0.48, 0, 0.9), (0.05, 0.5, 0.04), hexc('#555555')), root)
    if vines:
        rnd = random.Random(seed)
        items = [(rnd.uniform(-0.8, 0.8), rnd.uniform(-0.1, 0.1), rnd.uniform(0.0, 0.85), rnd.uniform(0.05, 0.11)) for _ in range(vines)]
        link(msph(items, hexc('#4f7f3c'), 'vine', sub=1), root)
    return root


def car2(loc, rot_z=0.0, c=None, glass_a=0.28, dusty=0.0, moss=0):
    """ガラス越しに中が見える車（前は -y）"""
    c = c or RK.choice([hexc('#c9c9c9'), hexc('#2f4a6b'), hexc('#8a2e2e'), hexc('#f0f0ec'), hexc('#3a3a3a')])
    if dusty:
        c = tuple(c[i] * (1 - dusty) + hexc('#8a7a62')[i] * dusty for i in range(3))
    root = empty(loc, 'car'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0.55), (1.8, 4.3, 0.7), c, bevel=0.08), root)
    link(box((0, 0.35, 1.64), (1.6, 2.0, 0.08), c, bevel=0.03), root)  # 屋根
    for sx in (-0.78, 0.78):
        for sy in (-0.6, 1.3):
            link(box((sx, sy, 1.25), (0.08, 0.08, 0.76), c), root)
    g = box((0, 0.35, 1.25), (1.56, 1.96, 0.74), (1, 1, 1)); g.data.materials.clear(); g.data.materials.append(gmat(hexc('#9ab4c8'), glass_a, 'glass'))
    link(g, root)
    for sx in (-0.82, 0.82):
        for sy in (-1.35, 1.35):
            link(cyl((sx, sy, 0.34), 0.34, 0.24, hexc('#1e1e1e'), rot=(0, math.pi / 2, 0)), root)
    for sx in (-0.6, 0.6):
        link(box((sx, -2.16, 0.68), (0.32, 0.04, 0.14), hexc('#f4f0e0')), root)  # ライト
    link(box((-0.4, 0.1, 0.62), (0.55, 0.6, 0.15), hexc('#4a4a50')), root)  # 運転席
    link(box((-0.4, 0.38, 0.95), (0.55, 0.12, 0.65), hexc('#4a4a50')), root)
    if moss:
        rnd = random.Random(int(loc[0] * 10 + loc[1]))
        items = [(rnd.uniform(-0.8, 0.8), rnd.uniform(-2.0, 2.0), rnd.uniform(1.0, 1.7), rnd.uniform(0.15, 0.4), 1, 1, 0.45) for _ in range(moss)]
        link(msph(items, hexc('#5a7a3a'), 'moss'), root)
    return root


def cracks(k=60, xr=(-30, 30), yr=(-30, 30), seed=5, c=hexc('#2e2e30'), avoid=None):
    rnd = random.Random(seed)
    items = []
    pts = []
    for i in range(k):
        x, y = rnd.uniform(*xr), rnd.uniform(*yr)
        if avoid and avoid(x, y):
            continue
        a = rnd.uniform(0, math.pi)
        for s in range(rnd.randint(3, 7)):
            L = rnd.uniform(0.6, 1.8)
            nx, ny = x + L * math.cos(a), y + L * math.sin(a)
            if avoid and avoid(nx, ny):
                break
            items.append(((x + nx) / 2, (y + ny) / 2, 0.014, L, rnd.uniform(0.05, 0.12), 0.01, a))
            pts.append((x, y))
            x, y = nx, ny; a += rnd.uniform(-0.7, 0.7)
    mbox(items, c, 'crack')
    return pts


def grass_tufts(pts, seed=6, h=(0.25, 0.7), per=5, cols=None, name='grass'):
    """pts の各点に草の株（円すいの束）"""
    rnd = random.Random(seed)
    cols = cols or [hexc('#4f7a3c'), hexc('#6a9a48'), hexc('#3f6a35')]
    groups = [[] for _ in cols]
    for (x, y) in pts:
        for k in range(per):
            groups[rnd.randrange(len(cols))].append((x + rnd.uniform(-0.25, 0.25), y + rnd.uniform(-0.25, 0.25), 0.0, rnd.uniform(0.03, 0.06),
                                                     rnd.uniform(*h), rnd.uniform(-0.35, 0.35), rnd.uniform(-0.35, 0.35)))
    return [mcone(g, c, name) for g, c in zip(groups, cols) if g]


def young_tree(loc, s=1.0, c=None, seed=1):
    rnd = random.Random(seed)
    root = empty(loc, 'ytree'); root.scale = (s, s, s)
    link(cyl((0, 0, 0.7), 0.04, 1.4, hexc('#6d5440'), verts=8), root)
    c = c or rnd.choice([hexc('#6f9a4e'), hexc('#7daa55'), hexc('#5f8f45')])
    link(msph([(0, 0, 1.55, 0.45), (0.25, 0.1, 1.3, 0.3), (-0.2, -0.1, 1.35, 0.32)], c, 'ycrown', sub=1), root)
    return root


def sway_tree(o, n, amp=0.03, period=70, seed=1):
    """木の小さな揺れ（風）"""
    rnd = random.Random(seed)
    _osc(o, 'rotation_euler', 0, o.rotation_euler.x, amp, period, n, rnd)
    _osc(o, 'rotation_euler', 1, o.rotation_euler.y, amp * 0.7, int(period * 1.3), n, rnd)


EVERGREEN = [hexc('#2f5a32'), hexc('#3a6a3a'), hexc('#28502c'), hexc('#456f3e')]


def ever_trees(pts, seed=3, s=(0.8, 1.3), name='etree', cols=None, trunk=True, moss=False):
    """常緑の広葉樹（クスノキ・シイ・カシのような、丸く重なった樹冠）をまとめて作る。pts: (x, y[, z]) と大きさの係数 s"""
    rnd = random.Random(seed)
    cols = cols or EVERGREEN
    crowns = [[] for _ in cols]; trunks = []
    for p in pts:
        x, y = p[0], p[1]; z = p[2] if len(p) > 2 else 0.0
        k = rnd.uniform(*s) * 4.0
        if trunk:
            trunks.append(((x, y, z), (x, y, z + 1.6 * k), 0.09 * k, 0.06 * k))
        ci = rnd.randrange(len(cols))
        crowns[ci].append((x, y, z + 1.7 * k, 0.75 * k, 1, 1, 0.8))
        crowns[(ci + 1) % len(cols)].append((x + 0.4 * k, y + 0.2 * k, z + 1.35 * k, 0.55 * k, 1, 1, 0.8))
        crowns[(ci + 2) % len(cols)].append((x - 0.35 * k, y - 0.3 * k, z + 1.45 * k, 0.5 * k, 1, 1, 0.85))
    out = []
    if trunk and trunks:
        out.append(mbar(trunks, hexc('#4a3a2c'), name + '_t', segs=6))
    for g, c in zip(crowns, cols):
        if g:
            out.append(msph(g, c, name, sub=1))
    return out


def big_tree(loc, s=1.0, seed=1, moss=True):
    """千年の巨木：太い幹・張り出した根・重なる大きな樹冠"""
    rnd = random.Random(seed)
    x, y = loc[0], loc[1]
    root = empty((x, y, 0), 'bigtree'); root.scale = (s, s, s)
    link(cyl((0, 0, 4.0), 0.9, 8.0, hexc('#4a3a2c'), verts=12, r2=0.6), root)
    for k in range(6):
        a = k * math.pi / 3 + rnd.uniform(-0.3, 0.3)
        link(mbar([((0, 0, 0.9), (2.4 * math.cos(a), 2.4 * math.sin(a), 0.0), 0.32, 0.08)], hexc('#4a3a2c'), 'root', segs=6), root)
    if moss:
        link(msph([(rnd.uniform(-0.6, 0.6), rnd.uniform(-0.6, 0.6), rnd.uniform(0.3, 3.0), rnd.uniform(0.25, 0.45), 1, 1, 0.6) for _ in range(6)],
                  hexc('#5f8a3a'), 'tmoss'), root)
    for (bx, by, bz, r) in ((0, 0, 9.5, 4.6), (3.0, 1.0, 8.2, 3.4), (-2.8, -1.2, 8.6, 3.4), (0.5, -3.0, 8.0, 3.0), (-0.8, 3.0, 8.4, 3.2)):
        link(msph([(bx, by, bz, r, 1, 1, 0.75)], rnd.choice(EVERGREEN), 'bcrown'), root)
        if bz < 9:
            link(mbar([((0, 0, 6.5), (bx * 0.7, by * 0.7, bz - 0.5), 0.25, 0.15)], hexc('#4a3a2c'), 'branch'), root)
    return root


def moss_stones(pts, seed=9, r=(0.4, 1.2)):
    """苔に覆われた石（崩れたビルの跡）"""
    rnd = random.Random(seed)
    st, ms = [], []
    for (x, y) in pts:
        rr = rnd.uniform(*r)
        st.append((x, y, rr * 0.3, rr, rnd.uniform(1.0, 1.5), rnd.uniform(0.8, 1.2), rnd.uniform(0.5, 0.8)))
        ms.append((x + rnd.uniform(-0.2, 0.2), y + rnd.uniform(-0.2, 0.2), rr * 0.55, rr * 0.85, rnd.uniform(1.0, 1.4), rnd.uniform(0.8, 1.1), 0.45))
    a = msph(st, hexc('#7a7670'), 'stone', sub=1)
    b = msph(ms, hexc('#5f8a3a'), 'moss', sub=1)
    return a, b


def crossing(n, stage=0, lit=0.45, sleepers=True, sig='green', seed=1, skip_sleep=()):
    """渋谷のような交差点。stage：0（夕方）/ 'night'（明かりの消えた夜）/ 10 / 100 / 1000（年後）。
    戻り値：dict（lit：明かりの窓のメッシュ一覧、sleepers：眠る人）"""
    s = bpy.context.scene
    out = {'lit': [], 'sleepers': [], 'screens': []}
    year = 0 if stage in (0, 'night') else stage
    if stage == 0:
        sky(hexc('#e8b48c')); s.view_settings.exposure = 0.3
        light_dir((-0.7, -0.3, 0.45)); s.display.shading.shadow_intensity = 0.5
    elif stage == 'night':
        sky(hexc('#0a0e1c')); s.view_settings.exposure = -0.55
        light_dir((0.2, -0.4, 0.8)); s.display.shading.shadow_intensity = 0.2
    else:
        sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.35
        light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.5
    # 地面
    if year < 1000:
        g = ground(size=400, rgb=ASPHALT if year < 100 else hexc('#5a6a4a'))
        corner_blocks(hexc('#b8b2a6') if year < 100 else hexc('#7a8060'))
        if year < 100:
            crosswalks(fade=0.0 if year == 0 else 0.55)
        else:
            crosswalks(c=hexc('#a8a89a'), fade=0.95)
    else:
        ground(size=400, rgb=hexc('#4e6a3a'))
        # 落ち葉と土のまだら
        rnd = random.Random(31)
        msph([(rnd.uniform(-60, 60), rnd.uniform(-60, 60), 0.0, rnd.uniform(1.5, 4.0), 1, 1, 0.04) for _ in range(120)], hexc('#6a5a3a'), 'litter')
    # ビル
    for i, (x, y, w, d, h, c) in enumerate(BLDG):
        if year >= 1000:
            continue
        L = bldg_block(x, y, w, d, h, c if stage != 'night' else '#3a3e46', lit=lit if stage == 0 else 0.0, seed=i, screen=(i % 3 == 0),
                       dark_win=hexc('#2a3038') if stage == 'night' else (hexc('#5a6a72') if year >= 10 else None))
        if L and L[0]:
            out['lit'].append(L[0])
        if L and L[1]:
            out['screens'].append(L[1])
        if year >= 10:
            # 壁のつる・苔（下から）
            rnd = random.Random(100 + i)
            hh = 3 + (year / 100) * 9
            items = [(x + rnd.uniform(-w / 2, w / 2) * 1.02, y + rnd.choice([-1, 1]) * (d / 2 + 0.1), rnd.uniform(0, hh), rnd.uniform(0.4, 1.0), 0.3, rnd.uniform(0.6, 1.6))
                     for _ in range(int(20 + year / 2))]
            mbox(items, hexc('#4f7a3c'), 'ivy')
    # 信号
    for sx in (-1, 1):
        for sy in (-1, 1):
            if year < 1000:
                sig_pole(sx * (SQ + 1.2), sy * (SQ + 1.2), n, sig if stage == 0 else 'off', rust=year >= 10)
    # 車（止まったまま）
    if year < 1000:
        rnd = random.Random(7)
        for k, (x, y, r) in enumerate([(-21, 3.0, math.pi / 2), (-28, 3.0, math.pi / 2), (-36, 3.2, math.pi / 2), (21, -3.0, -math.pi / 2),
                                       (29, -3.0, -math.pi / 2), (-3.0, -22, math.pi), (-3.2, -30, math.pi), (3.0, 22, 0), (3.0, 30, 0)]):
            car2((x, y, 0), rot_z=r, dusty=0.0 if year == 0 else min(0.8, 0.4 + year / 200), moss=0 if year < 100 else 10)
    # 眠る人
    if sleepers:
        for i, w in enumerate(WALKERS):
            if i in skip_sleep:
                continue
            out['sleepers'].append(sleeper(w, name=f'sl{i}'))
    # 年月の変化
    av = lambda x, y: sleep_footprint(x, y, 0.35)
    if year >= 10:
        pts = cracks(110, (-40, 40), (-40, 40), seed=5, avoid=av)
        rnd = random.Random(12)
        tufts = [p for p in pts if rnd.random() < 0.5]
        tufts += [(rnd.uniform(-45, 45), rnd.uniform(-45, 45)) for _ in range(160)]
        tufts = [p for p in tufts if not av(*p)]
        grass_tufts(tufts, seed=7, h=(0.3, 0.9) if year < 100 else (0.4, 1.2), per=4)
        if year == 10:
            for k, (x, y) in enumerate([(-6.5, 3.2), (7.2, -5.5), (-2.5, -8.5), (9.5, 7.5), (-9.0, -4.0), (4.0, 9.5), (14, -7), (-14, 6), (2.0, -14), (-5, 14)]):
                if not av(x, y):
                    young_tree((x, y, 0), s=rnd.uniform(0.95, 1.25), seed=k)
            for k, (x, y, r) in enumerate([(-15.5, 9.5, 0.4), (15.8, -10.5, 2.0), (9.8, 15.4, 1.0)]):
                bike((x, y, 0.05), rot_z=r, vines=40, seed=k)
    if year >= 100 and year < 1000:
        rnd = random.Random(44)
        pts = []
        for i in range(260):
            x, y = rnd.uniform(-70, 70), rnd.uniform(-70, 70)
            if max(abs(x), abs(y)) < 7.5 or av(x, y):
                continue
            if any(abs(x - bx) < bw / 2 + 1.5 and abs(y - by) < bd / 2 + 1.5 for (bx, by, bw, bd, _, _) in BLDG):
                continue
            pts.append((x, y))
        ever_trees(pts, seed=45, s=(0.9, 1.6))
    if year >= 1000:
        rnd = random.Random(55)
        # 崩れたビルの跡：苔むした石の山
        for i, (x, y, w, d, h, c) in enumerate(BLDG):
            pts = [(x + rnd.uniform(-w / 2, w / 2), y + rnd.uniform(-d / 2, d / 2)) for _ in range(9)]
            moss_stones(pts, seed=i, r=(0.8, 2.2))
        # 交差点の上にも、苔むした石（信号や縁石の跡）
        pts = [(rnd.uniform(-20, 20), rnd.uniform(-20, 20)) for _ in range(40)]
        pts = [p for p in pts if not sleep_footprint(*p, 0.8)]
        moss_stones(pts, seed=77, r=(0.2, 0.6))
        trees = []
        for (x, y) in [(-7, 4), (6.5, -2.5), (-3, -6.5), (4, 7), (-13, -10), (13, 11), (-12, 13), (12, -13), (0.5, 0.5), (-18, 2), (18, -1),
                       (1, -18), (-1, 18), (-25, -15), (25, 18), (-24, 22), (22, -24), (-30, 5), (30, -6), (6, 28), (-6, -28)]:
            if not sleep_footprint(x, y, 2.6):
                trees.append(big_tree((x, y, 0), s=rnd.uniform(0.9, 1.3), seed=int(x * 7 + y)))
        out['bigtrees'] = trees
        tufts = [(rnd.uniform(-35, 35), rnd.uniform(-35, 35)) for _ in range(260)]
        tufts = [p for p in tufts if not sleep_footprint(*p, 0.3)]
        grass_tufts(tufts, seed=8, h=(0.2, 0.6), per=4, cols=[hexc('#4f7a3c'), hexc('#3f6a35'), hexc('#6a8a40')])
        # 遠くの森
        pts = [(rnd.uniform(-160, 160), rnd.uniform(-160, 160)) for _ in range(420)]
        pts = [p for p in pts if max(abs(p[0]), abs(p[1])) > 36]
        ever_trees(pts, seed=56, s=(1.6, 2.6), trunk=False)
    return out


# ---------------- 夜の街（上から） ----------------
def city_blocks(nx=9, ny=9, pitch=26.0, seed=11, lit=0.6, night=True, cx=0, cy=0, hr=(14, 60), skip=None, dark_win=None):
    """碁盤の目の街。区画ごとに明かりの窓を1メッシュにまとめて返す（消灯の順に使う）"""
    rnd = random.Random(seed)
    blocks = []
    for i in range(nx):
        for j in range(ny):
            x = cx + (i - (nx - 1) / 2) * pitch; y = cy + (j - (ny - 1) / 2) * pitch
            if skip and skip(x, y):
                continue
            plane((x, y, 0.02), (pitch - 6, pitch - 6), hexc('#3a3c40') if night else hexc('#b8b2a6'))
            lit_items = []; dark_items = []; walls = []
            for q in range(rnd.randint(2, 4)):
                bx = x + rnd.uniform(-pitch / 2 + 6, pitch / 2 - 6); by = y + rnd.uniform(-pitch / 2 + 6, pitch / 2 - 6)
                w = rnd.uniform(5, 9); d = rnd.uniform(5, 9); h = rnd.uniform(*hr) * (1.4 if rnd.random() < 0.15 else 1.0)
                walls.append((bx, by, h / 2, w, d, h))
                for k in range(int(h / 3.4)):
                    z = 2 + k * 3.4
                    for (fx, fy, fw, fd) in ((bx, by - d / 2 - 0.05, w * 0.85, 0.08), (bx, by + d / 2 + 0.05, w * 0.85, 0.08),
                                             (bx - w / 2 - 0.05, by, 0.08, d * 0.85), (bx + w / 2 + 0.05, by, 0.08, d * 0.85)):
                        (lit_items if rnd.random() < lit else dark_items).append((fx, fy, z, fw, fd, 1.4))
            mbox(walls, hexc('#2e3238') if night else hexc(rnd.choice(['#c9c4ba', '#b4bcc4', '#d6cec0'])), 'bw')
            if dark_items:
                mbox(dark_items, dark_win or (hexc('#1c2028') if night else hexc('#6f8296')), 'dw')
            L = mbox(lit_items, hexc('#ffd98a'), 'lw') if lit_items else None
            blocks.append(((x, y), L))
    # 道路の街灯
    return blocks


def lights_out(blocks, f0, f1, order='sweep', seed=3, axis=(1, 0.3)):
    """区画ごとに明かりを消す（f0〜f1 のあいだ、端から順に）"""
    rnd = random.Random(seed)
    ks = [b for b in blocks if b[1] is not None]
    if order == 'sweep':
        ks.sort(key=lambda b: b[0][0] * axis[0] + b[0][1] * axis[1] + rnd.uniform(-8, 8))
    else:
        rnd.shuffle(ks)
    for i, (c, L) in enumerate(ks):
        vanish(L, int(f0 + (f1 - f0) * i / max(1, len(ks) - 1)))


# ---------------- 地下の駅 ----------------
def streak(loc_top, w, L, rgb, a=1.0, name='streak', axis_y=False):
    """上端を原点にした細い帯（下へ伸びる：scale z を動かす）"""
    o = box((0, 0, -L / 2), (w, 0.02, L) if not axis_y else (0.02, w, L), rgb)
    if a < 1:
        o.data.materials.clear(); o.data.materials.append(gmat(rgb, a, name))
    o.location = loc_top
    return o


def drips(n, pts, z0, z1, period=30, seed=4, r=0.03, c=hexc('#9ac0d8')):
    rnd = random.Random(seed)
    out = []
    for (x, y) in pts:
        o = ball((x, y, z0), r, c, a=0.9, seg=8, name='drip')
        saw(o, n, 2, z0, z1, period + rnd.randint(-6, 10), phase=rnd.randint(0, period))
        out.append(o)
    return out


def platform(n, water_f0=None, water_f1=None, wz0=-1.2, wz1=-0.45, seep=True, seed=1, wet0=0.4):
    """地下鉄の駅のホーム（人はいない）。線路は y<0 の側。ホームは y=0..6、床 z=0。線路の底 z=-1.3"""
    s = bpy.context.scene
    sky(hexc('#101418')); s.view_settings.exposure = 0.1
    light_dir((0.1, -0.3, 0.95)); s.display.shading.shadow_intensity = 0.35
    L = 80
    box((0, 3.0, -0.6), (L, 6.0, 1.2), hexc('#b8b4aa'))  # ホーム
    box((0, 0.15, 0.005), (L, 0.3, 0.01), hexc('#e8c040'))  # 点字ブロックの帯（黄色）
    box((0, -2.6, -1.35), (L, 5.4, 0.1), hexc('#4a4640'))  # 線路の底
    for y in (-1.8, -3.3):
        box((0, y, -1.22), (L, 0.12, 0.16), hexc('#8a8a8c'))  # レール
    for x in range(-40, 41, 2):
        box((x, -2.55, -1.28), (0.35, 2.6, 0.08), hexc('#5a5248'))  # まくら木
    box((0, -5.4, 1.2), (L, 0.3, 5.2), hexc('#c8c4b8'))  # 線路側の壁
    box((0, 6.2, 1.5), (L, 0.3, 4.2), hexc('#d8d4c8'))  # 奥の壁
    box((0, 0.4, 3.65), (L, 12.0, 0.2), hexc('#c0bcb0'))  # 天井
    for x in range(-36, 37, 8):
        box((x, 3.0, 1.8), (0.7, 0.7, 3.6), hexc('#d8d2c4'))  # 柱
    # 天井の照明（消えている）
    mbox([(x, 2.5, 3.5, 3.0, 0.3, 0.08) for x in range(-38, 39, 6)], hexc('#5a5c60'), 'lamp_off')
    # 非常灯だけ、ところどころ
    mbox([(x, 6.0, 3.0, 0.5, 0.1, 0.2) for x in range(-36, 37, 18)], hexc('#3aa870'), 'exit_lamp')
    # 壁のしみ・水すじ
    rnd = random.Random(seed)
    sts = []
    if seep:
        for k in range(26):
            x = rnd.uniform(-30, 30); wall = rnd.random() < 0.55
            y = -5.24 if wall else 6.04
            ztop = rnd.uniform(2.4, 3.4) if wall else rnd.uniform(2.8, 3.5)
            Lh = ztop + (1.3 if wall else 0.0)
            o = streak((x, y, ztop), rnd.uniform(0.6, 1.6), Lh, hexc('#3e4448'), a=0.9, name='wet')
            f0 = 1 + rnd.randint(0, int(n * 0.3))
            o.scale = (1, 1, wet0); o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=f0)
            o.scale = (1, 1, 1); o.keyframe_insert('scale', frame=min(n, f0 + int(n * 0.6)))
            sts.append((x, y + (0.08 if wall else -0.08)))
        drips(n, [(x, y) for (x, y) in sts[:14]], 3.0, -1.2, period=28, seed=seed, r=0.06)
    w = None
    if water_f0 is not None:
        w = water((0, -2.6), (L, 5.3), wz0, wz1, water_f0, water_f1, c=hexc('#4f7f90'), a=0.72)
    return w


def pump_room(n):
    s = bpy.context.scene
    sky(hexc('#141a1e')); s.view_settings.exposure = 0.05
    light_dir((0.3, -0.5, 0.8)); s.display.shading.shadow_intensity = 0.4
    box((0, 0, -0.05), (14, 10, 0.1), hexc('#6a6c6a'))
    box((0, 5, 2), (14, 0.2, 4), hexc('#9a9890'))
    box((-7, 0, 2), (0.2, 10, 4), hexc('#a4a298'))
    pumps = []
    for k, x in enumerate((-3.5, 0.0, 3.5)):
        root = empty((x, 1.5, 0), 'pump')
        link(box((0, 0, 0.3), (1.6, 1.2, 0.6), hexc('#4a5a6a')), root)
        link(cyl((0, 0, 1.0), 0.45, 0.9, hexc('#3a6a9a'), verts=16), root)
        link(cyl((0, 0, 1.7), 0.3, 0.5, hexc('#3a6a9a'), verts=16), root)
        link(mbar([((0, 0, 1.9), (0, 0, 3.8), 0.16)], hexc('#8a8a8a'), 'pipe'), root)
        link(mbar([((0.5, 0, 0.9), (0.5, 3.4, 0.9), 0.14)], hexc('#8a8a8a'), 'pipe'), root)
        # 止まった表示灯（消えている）
        link(cyl((0.81, -0.0, 0.4), 0.06, 0.02, hexc('#3a2a2a'), rot=(0, math.pi / 2, 0)), root)
        pumps.append(root)
    box((0, 4.9, 3.6), (14, 0.2, 0.3), hexc('#8a8a8a'))
    # 床の水たまり（少しずつ広がる）
    w = plane((0, 0, 0.01), (1, 1), hexc('#4f7f90')); w.data.materials.clear(); w.data.materials.append(gmat(hexc('#4f7f90'), 0.7, 'pud'))
    w.location = (1.0, -1.5, 0.012); w.scale = (2, 1.5, 1); w.keyframe_insert('scale', frame=1)
    w.scale = (9, 5, 1); w.keyframe_insert('scale', frame=n)
    return pumps


# ---------------- 鉄塔（赤と白の格子の塔。特定の塔のロゴ・形の再現はしない） ----------------
TWR_R = hexc('#e2552c'); TWR_W = hexc('#f2efe8'); RUST = hexc('#7a4a2a')


def lattice_tower(H=60.0, W0=9.0, W1=0.9, bands=10, rust_f0=None, rust_f1=None, rust_k=0, seed=3, rust_z=None):
    """格子の鉄塔（赤と白の帯）。rust_k>0 で茶色い錆の筋が rust_f0〜rust_f1 に順に浮かぶ"""
    def half(z):
        u = z / H
        return W0 / 2 * (1 - u) ** 1.6 + W1 / 2 * u
    red, white = [], []
    for b in range(bands):
        z0 = H * b / bands; z1 = H * (b + 1) / bands
        tgt = red if b % 2 == 0 else white
        h0, h1 = half(z0), half(z1)
        for sx in (-1, 1):
            for sy in (-1, 1):
                tgt.append(((sx * h0, sy * h0, z0), (sx * h1, sy * h1, z1), 0.32 * (1 - z0 / H) + 0.08))
        # 横材とX材
        for face in range(4):
            def P(sgn, hh, z):
                if face == 0: return (sgn * hh, -hh, z)
                if face == 1: return (sgn * hh, hh, z)
                if face == 2: return (-hh, sgn * hh, z)
                return (hh, sgn * hh, z)
            tgt.append((P(-1, h1, z1), P(1, h1, z1), 0.1))
            tgt.append((P(-1, h0, z0), P(1, h1, z1), 0.07))
            tgt.append((P(1, h0, z0), P(-1, h1, z1), 0.07))
            # 細かい格子
            zm = (z0 + z1) / 2; hm = half(zm)
            tgt.append((P(-1, hm, zm), P(1, hm, zm), 0.05))
    a = mbar(red, TWR_R, 'twr_r', segs=6)
    b = mbar(white, TWR_W, 'twr_w', segs=6)
    # 展望台（2段）とアンテナ
    for z, w in ((H * 0.42, half(H * 0.42) * 2 + 2.0), (H * 0.72, half(H * 0.72) * 2 + 1.2)):
        box((0, 0, z), (w, w, 2.2), hexc('#d8dce0'))
        box((0, 0, z), (w + 0.05, w + 0.05, 1.0), hexc('#6a8aa8'))
    mbar([((0, 0, H), (0, 0, H * 1.18), 0.25, 0.08)], TWR_W, 'ant')
    mbar([((0, 0, H * 1.05), (0, 0, H * 1.1), 0.27)], TWR_R, 'ant2')
    rust = []
    if rust_k:
        rnd = random.Random(seed)
        for i in range(rust_k):
            z = rnd.uniform(*(rust_z or (1, H * 0.95))); hh = half(z)
            sx, sy = rnd.choice([-1, 1]), rnd.choice([-1, 1])
            L = rnd.uniform(2.0, 6.0)
            rr = 0.32 * (1 - z / H) + 0.08
            o = streak((sx * (hh + rr * 0.72), sy * (hh + rr * 0.72), z), rnd.uniform(0.18, 0.4), L, RUST if rnd.random() < 0.7 else hexc('#6a3a1e'), name='rust',
                       axis_y=rnd.random() < 0.5)
            f = int(rust_f0 + (rust_f1 - rust_f0) * i / max(1, rust_k - 1))
            o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=max(1, f))
            o.scale = (1, 1, 0.3); o.keyframe_insert('scale', frame=f + 1)
            o.scale = (1, 1, 1); o.keyframe_insert('scale', frame=f + 60)
            set_interp(o, 'CONSTANT', 'scale', {1})
            rust.append(o)
    return a, b, rust


def bay(y0=60, c=hexc('#4f7fa8')):
    plane((0, y0 + 300, 0.05), (1200, 600), c, name='sea')


# ---------------- 里山・竹 ----------------
def hill_h(x, y):
    return 0.06 * (y + 30) + 3.0 * math.sin(x * 0.05) * math.cos(y * 0.04)


def bamboo_items(pts, rnd, h=(9, 14), r=0.07, z_of=None):
    culms, leaves, nodes = [], [], []
    for (x, y) in pts:
        z = z_of(x, y) if z_of else 0.0
        H = rnd.uniform(*h); lean = (rnd.uniform(-0.08, 0.08), rnd.uniform(-0.08, 0.08))
        top = (x + lean[0] * H, y + lean[1] * H, z + H)
        culms.append(((x, y, z), top, r * rnd.uniform(0.8, 1.2), r * 0.6))
        for k in range(9):
            u = rnd.uniform(0.45, 1.0)
            leaves.append((x + lean[0] * H * u + rnd.uniform(-0.7, 0.7), y + lean[1] * H * u + rnd.uniform(-0.7, 0.7), z + H * u,
                           rnd.uniform(0.3, 0.55), rnd.uniform(0.8, 1.8), rnd.uniform(0.8, 1.8), 0.6))
        for k in range(1, int(H / 1.2)):
            u = k * 1.2 / H
            nodes.append(((x + lean[0] * H * u, y + lean[1] * H * u, z + H * u - 0.03), (x + lean[0] * H * u, y + lean[1] * H * u, z + H * u + 0.03), r * 1.25))

    return culms, leaves, nodes


def bamboo_grove(pts, seed=1, h=(9, 14), z_of=None, name='bamboo'):
    rnd = random.Random(seed)
    culms, leaves, nodes = bamboo_items(pts, rnd, h, z_of=z_of)
    out = [mbar(culms, hexc('#7aa24a'), name + '_c', segs=6)]
    if nodes:
        out.append(mbar(nodes, hexc('#5f8a3a'), name + '_n', segs=6))
    out.append(msph(leaves, hexc('#8ab85a'), name + '_l', sub=1))
    return out


def broadleaf(pts, seed=2, z_of=None, s=(0.8, 1.2), cols=None, name='bl'):
    """雑木林（落葉樹の明るい緑）"""
    cols = cols or [hexc('#7a9a4a'), hexc('#8aa858'), hexc('#6a8a40')]
    pp = [(x, y, z_of(x, y) if z_of else 0.0) for (x, y) in pts]
    return ever_trees(pp, seed=seed, s=s, cols=cols, name=name)


# ---------------- 動物 ----------------
COATS['boar'] = {'base': hexc('#4a3a2e'), 'belly': hexc('#5a4a3c'), 'stripe': hexc('#4a3a2e')}
COATS['uribo'] = {'base': hexc('#8a6a48'), 'belly': hexc('#a88a68'), 'stripe': hexc('#8a6a48')}
COATS['tanuki'] = {'base': hexc('#7a6a58'), 'belly': hexc('#4a3e34'), 'stripe': hexc('#7a6a58')}


def boar(loc, s=2.6, rot_z=0.0, name='boar', baby=False):
    a = animal(loc, 'pig', s=(1.5 if baby else s), rot_z=rot_z, name=name)
    # 色を猪に
    C = COATS['uribo' if baby else 'boar']
    def rec(o):
        for c in o.children:
            if c.type == 'MESH':
                col = c.data.materials[0].diffuse_color[:3] if c.data.materials else None
                if col and abs(col[0] - COATS['pig']['base'][0]) < 0.05 and abs(col[1] - COATS['pig']['base'][1]) < 0.05:
                    setmat(c, C['base'])
                elif col and abs(col[0] - COATS['pig']['belly'][0]) < 0.05:
                    setmat(c, C['belly'])
                elif col and abs(col[0] - hexc('#e89a92')[0]) < 0.05 and abs(col[1] - hexc('#e89a92')[1]) < 0.05:
                    setmat(c, hexc('#3a2a24'))
            rec(c)
    rec(a)
    rig = O[a['rig']]
    if baby:
        for k in range(3):
            link(box((0.0 + (k - 1) * 0.05, 0.0, 0.27), (0.025, 0.36, 0.02), hexc('#c8b090')), rig)
    else:
        # たてがみ
        link(box((0, 0.02, 0.3), (0.04, 0.36, 0.06), hexc('#2a2220')), rig)
    return a


def tanuki(loc, s=1.3, rot_z=0.0, pose='walk', name='tanuki'):
    t = cat(loc, 'tanuki', s=s, rot_z=rot_z, pose=pose, name=name)
    head = O[t['head']]
    for ch in list(head.children):
        if ch.name.startswith('cone'):
            ch.scale = (0.6, 0.6, 0.45)
    for sx in (-1, 1):
        link(sphere((sx * 0.045, -0.085, 0.015), 0.03, hexc('#2a2420'), scale=(1.2, 0.6, 0.9)), head)  # 目のまわりの黒
    link(sphere((0, -0.11, -0.02), 0.04, hexc('#e8e0d0'), scale=(1.1, 0.8, 0.6)), head)  # 鼻先の白
    tail = O[t['tail']]
    for c in tail.children:
        c.scale = (2.2, 2.2, 1.0)
    body = O[t['body']]; body.scale = (body.scale.x * 1.15, body.scale.y, body.scale.z * 1.1)
    return t


def graze(a, n, f0=1, down=0.9, seed=1):
    """首を下げて草を食べる（ときどき顔を上げる）。animate_life の首振りとぶつからないよう、頭の間の空を動かす"""
    nk = tilt_head(a)
    rnd = random.Random(seed)
    base = nk.rotation_euler.x
    f = f0
    nk.keyframe_insert('rotation_euler', index=0, frame=1)
    while f < n:
        nk.rotation_euler.x = base + down; nk.keyframe_insert('rotation_euler', index=0, frame=f)
        nk.rotation_euler.x = base + down + 0.12; nk.keyframe_insert('rotation_euler', index=0, frame=f + 8)
        nk.rotation_euler.x = base + down; nk.keyframe_insert('rotation_euler', index=0, frame=f + 16)
        f2 = f + rnd.randint(70, 110)
        nk.rotation_euler.x = base + down; nk.keyframe_insert('rotation_euler', index=0, frame=f2)
        nk.rotation_euler.x = base; nk.keyframe_insert('rotation_euler', index=0, frame=f2 + 10)
        f = f2 + rnd.randint(16, 26)
    nk.rotation_euler.x = base


# ---------------- 五重塔・社 ----------------
WOOD = hexc('#7a3a26'); PLASTER = hexc('#efe8da'); TILE = hexc('#4a4c50')


def pagoda(loc, s=1.0, name='pagoda', moss=0.0, tiers_root=False):
    """五重塔（一般的な形）。戻り値：root と、各層の空（組み直しで動かす）"""
    root = empty(loc, name); root.scale = (s, s, s)
    link(box((0, 0, 0.6), (10, 10, 1.2), hexc('#9a9488')), root)  # 基壇
    tiers = []
    z = 1.2
    for k in range(5):
        w = 7.0 - k * 0.75; hgt = 3.0 - k * 0.12
        t = empty((0, 0, z), f'tier{k}'); link(t, root)
        link(box((0, 0, hgt / 2), (w, w, hgt), WOOD), t)
        for sx in (-1, 1):
            link(box((sx * (w / 2 + 0.02), 0, hgt * 0.55), (0.04, w * 0.6, hgt * 0.5), PLASTER), t)
            link(box((0, sx * (w / 2 + 0.02), hgt * 0.55), (w * 0.6, 0.04, hgt * 0.5), PLASTER), t)
        rw = w + 4.2
        link(box((0, 0, hgt + 0.25), (rw * 0.85, rw * 0.85, 0.5), WOOD), t)  # 組物
        rc = TILE if moss <= 0 else tuple(TILE[i] * (1 - moss) + hexc('#5a7a3a')[i] * moss for i in range(3))
        link(cone((0, 0, hgt + 0.85), rw / 2 * 1.414, 1.1, rc, verts=4, rot=(0, 0, math.pi / 4)), t)
        tiers.append(t)
        z += hgt + 1.0
    sp = empty((0, 0, z), 'sorin'); link(sp, root)
    link(cyl((0, 0, 4.0), 0.14, 8.0, hexc('#8a7a50'), verts=10), sp)
    for k in range(9):
        link(cyl((0, 0, 1.4 + k * 0.6), 0.45 - k * 0.02, 0.12, hexc('#8a7a50'), verts=14), sp)
    tiers.append(sp)
    return root, tiers


def shrine(loc, rot_z=0.0, name='shrine', s=1.0, parts_at=None):
    """切妻・茅葺きの社（一般的な形）。parts_at=(f0, step) なら、柱→床→壁→屋根の順に建っていく"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    parts = []
    posts = []
    for sx in (-1, 0, 1):
        for sy in (-1, 1):
            posts.append(link(cyl((sx * 2.2, sy * 1.6, 1.4), 0.16, 2.8, hexc('#d8c8a8'), verts=10), root))
    parts.append(posts)
    parts.append([link(box((0, 0, 1.4), (5.2, 4.0, 0.2), hexc('#d8c8a8')), root)])
    walls = [link(box((0, 1.55, 2.4), (4.6, 0.12, 1.9), hexc('#e2d4b4')), root), link(box((0, -1.55, 2.4), (4.6, 0.12, 1.9), hexc('#e2d4b4')), root),
             link(box((2.15, 0, 2.4), (0.12, 3.0, 1.9), hexc('#e2d4b4')), root), link(box((-2.15, 0, 2.4), (0.12, 3.0, 1.9), hexc('#e2d4b4')), root)]
    parts.append(walls)
    rf = [link(roof((0, 0, 3.3), 4.6, 6.6, 2.2, hexc('#9a8050'), rot_z=math.pi / 2), root)]
    rf[0].scale = (1.0, 1.0, 1.0)
    for sx in (-1, 1):  # 千木（屋根の両端で交差する板）
        rf.append(link(box((sx * 3.1, 0, 5.8), (0.1, 0.25, 1.6), hexc('#d8c8a8'), rot=(0, sx * 0.5, 0)), root))
        rf.append(link(box((sx * 3.1, 0, 5.8), (0.1, 0.25, 1.6), hexc('#d8c8a8'), rot=(0, -sx * 0.5, 0)), root))
    for k in range(5):  # 鰹木
        rf.append(link(cyl((-1.6 + k * 0.8, 0, 5.55), 0.13, 0.9, hexc('#c8a860'), rot=(math.pi / 2, 0, 0), verts=10), root))
    parts.append(rf)
    if parts_at:
        f0, step = parts_at
        for i, grp in enumerate(parts):
            for j, o in enumerate(grp):
                appear(o, int(f0 + i * step + j * 4))
    return root


# ---------------- 古墳・石垣・焼き物 ----------------
def keyhole_mound(loc=(0, 0, 0), s=1.0, seed=3):
    """前方後円墳の形の、木に覆われた丘と周りの堀（模式）"""
    x0, y0 = loc[0], loc[1]
    plane((x0, y0 + 10, 0.06), (120, 150), hexc('#4f7fa0'), name='moat')
    o1 = sphere((x0, y0 + 30 * s, 0.0), 30 * s, hexc('#4f7a3c'), scale=(1, 1, 0.32), seg=32)
    o2 = box((x0, y0 - 8 * s, 4.5 * s), (56 * s, 40 * s, 9 * s), hexc('#4f7a3c'))
    # 台形にする（手前を広く）
    cy2, cz2 = y0 - 8 * s, 4.5 * s
    for v in o2.data.vertices:  # 位置は焼き込み済み：中心からの距離で台形にする
        if v.co.y > cy2:
            v.co.x = x0 + (v.co.x - x0) * 0.62
        if v.co.z > cz2:
            v.co.x = x0 + (v.co.x - x0) * 0.85; v.co.y = cy2 + (v.co.y - cy2) * 0.92
    rnd = random.Random(seed)
    pts = []
    for i in range(380):
        x = rnd.uniform(-30, 30) * s; y = rnd.uniform(-28, 60) * s
        r_ = math.hypot(x, y - 30 * s)
        if r_ < 28 * s:
            z = 9.6 * s * math.sqrt(max(0, 1 - (r_ / (30 * s)) ** 2))
        elif -27 * s < y < 12 * s and abs(x) < (28 * s - (y + 27 * s) / (39) * 8 * s) * 0.85:
            z = 8.8 * s
        else:
            continue
        pts.append((x0 + x, y0 + y, z - 0.6))
    ever_trees(pts, seed=seed, s=(0.7, 1.1), trunk=False)
    # 堀の外の岸
    for (cx, cy, w, d) in ((x0, y0 - 66, 140, 12), (x0, y0 + 86, 140, 12), (x0 - 66, y0 + 10, 12, 160), (x0 + 66, y0 + 10, 12, 160)):
        box((cx, cy, 0.4), (w, d, 0.8), hexc('#5a7a3a'))


def stone_wall(n, x0=-20, x1=20, H=9.0, slope=0.45, seed=4, moss=0.45):
    """石垣（反りのある斜面に石を積む）。y=0 の線から奥へ傾く"""
    rnd = random.Random(seed)
    stones, mosses = [], []
    rows = int(H / 0.9)
    for r in range(rows):
        z = 0.45 + r * 0.9
        u = z / H
        y = (u ** 1.4) * H * slope  # 上ほど奥へ（反り）
        x = x0 + rnd.uniform(0, 0.8)
        while x < x1:
            w = rnd.uniform(1.0, 1.9)
            c = rnd.choice([hexc('#8a857c'), hexc('#7a766e'), hexc('#9a958a'), hexc('#6e6a62')])
            stones.append((x + w / 2, y, z, w - 0.1, 1.2, 0.82, rnd.uniform(-0.04, 0.04), c))
            if rnd.random() < moss:
                mosses.append((x + w / 2 + rnd.uniform(-0.3, 0.3), y - 0.55, z + rnd.uniform(-0.2, 0.3), rnd.uniform(0.35, 0.7), 1.3, 0.35, 0.7))
            x += w
    by = {}
    for st in stones:
        by.setdefault(st[7], []).append(st[:7])
    for c, its in by.items():
        mbox(its, c, 'stone')
    msph(mosses, hexc('#5f8a3a'), 'moss')
    # 上の木
    ever_trees([(rnd.uniform(x0, x1), H * slope + rnd.uniform(2, 8)) for _ in range(14)], seed=seed + 1, s=(1.0, 1.5))
    for t in [o for o in bpy.data.objects if o.name.startswith('etree')]:
        t.location.z += H
    box(((x0 + x1) / 2, H * slope + 6, H / 2), (x1 - x0 + 4, 12, H), hexc('#4f6a3a'))  # 石垣の上の土


def rice_bowl(loc, s=1.0, rise=None):
    """茶わん（白地に藍の帯）。rise=(f0, f1, z0) なら土の中から顔を出す"""
    root = empty(loc, 'bowl'); root.scale = (s, s, s)
    link(cyl((0, 0, 0.035), 0.06, 0.03, hexc('#e8e4da'), verts=24, r2=0.05), root)  # 高台
    o = link(cyl((0, 0, 0.11), 0.07, 0.13, hexc('#f0ece2'), verts=28, r2=0.125), root)
    link(cyl((0, 0, 0.12), 0.1, 0.03, hexc('#3a5a8a'), verts=28, r2=0.108), root)  # 藍の帯
    link(cyl((0, 0, 0.18), 0.117, 0.006, hexc('#4a4038'), verts=28), root)  # 中の土
    if rise:
        f0, f1, z0 = rise
        root.location.z = z0; root.keyframe_insert('location', index=2, frame=1); root.keyframe_insert('location', index=2, frame=f0)
        root.location.z = loc[2]; root.keyframe_insert('location', index=2, frame=f1)
    return root


def glass_bottle(loc, s=1.0, rot=(0, 0, 0), rise=None, c=hexc('#5aa070')):
    root = empty(loc, 'bottle'); root.scale = (s, s, s); root.rotation_euler = rot
    m = gmat(c, 0.55, 'bottle')
    for o in (cyl((0, 0, 0.12), 0.06, 0.24, c, verts=20), cyl((0, 0, 0.27), 0.06, 0.06, c, verts=20, r2=0.025), cyl((0, 0, 0.33), 0.022, 0.08, c, verts=14)):
        o.data.materials.clear(); o.data.materials.append(m); link(o, root)
    if rise:
        f0, f1, z0 = rise
        root.location.z = z0; root.keyframe_insert('location', index=2, frame=1); root.keyframe_insert('location', index=2, frame=f0)
        root.location.z = loc[2]; root.keyframe_insert('location', index=2, frame=f1)
    return root


# ---------------- 火山と噴煙 ----------------
def volcano(loc=(0, 0, 0), R=60.0, H=30.0, snow=True):
    x, y, z = loc
    # 裾の広い山（円すいを2つ重ねて、ゆるい反りを出す）
    cone((x, y, z + H * 0.3), R, H * 0.6, hexc('#5a6a7a'), verts=48)
    cone((x, y, z + H * 0.62), R * 0.52, H * 0.66, hexc('#5f6e80'), verts=48)
    if snow:
        cone((x, y, z + H * 0.86), R * 0.23, H * 0.3, hexc('#eef2f6'), verts=48)
    return (x, y, z + H * 0.98)


def plume(n, top, k=70, f0=1, rise=40.0, drift=(30.0, 0.0), seed=3, c=hexc('#8a8a8c'), period=80, r0=2.0, r1=14.0):
    """噴煙：灰色の球が火口から湧き上がり、ふくらみながら流れる"""
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        st = f0 + int(i * (period / 6)) - period
        o = sphere(top, 1.0, rnd.choice([c, hexc('#7a7a7e'), hexc('#9a9a9c'), hexc('#6a6a6e')]), seg=12, name='puff')
        o.scale = (0, 0, 0)
        o.keyframe_insert('scale', frame=1)
        T = period * rnd.uniform(1.6, 2.6)
        end = (top[0] + drift[0] * rnd.uniform(0.6, 1.4) + rnd.uniform(-6, 6), top[1] + drift[1] + rnd.uniform(-6, 6), top[2] + rise * rnd.uniform(0.7, 1.3))
        fa = max(1, st); fb = st + T
        if fb < 2:
            continue
        u0 = (fa - st) / T
        p0 = Vector(top).lerp(Vector(end), u0)
        o.location = p0; o.keyframe_insert('location', frame=fa)
        o.scale = (r0 + (r1 - r0) * u0,) * 3 if fa > st else (r0,) * 3
        if fa > 1:
            o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=fa - 1)
            o.scale = (r0,) * 3
        o.keyframe_insert('scale', frame=fa)
        o.location = end; o.keyframe_insert('location', frame=fb)
        o.scale = (r1 * rnd.uniform(0.8, 1.2),) * 3; o.keyframe_insert('scale', frame=fb)
        linear(o, 'location'); linear(o, 'scale')
        set_interp(o, 'CONSTANT', 'scale', {1, fa - 1})
        out.append(o)
    return out


# ---------------- 崩れるビル（人はいない） ----------------
def ruin_building(loc, w=10, d=8, h=24, seed=1, f_fall=None, n=240, crack_f=None, moss=True):
    """コンクリートのビル。外壁を小さな板に分け、f_fall から順に崩す。crack_f で割れ目が走る"""
    rnd = random.Random(seed)
    x0, y0 = loc[0], loc[1]
    panels = []
    floors = int(h / 3.0)
    for k in range(floors):
        z = 1.5 + k * 3.0
        for side in range(4):
            cols = 4
            for c in range(cols):
                if side in (0, 1):
                    px = x0 - w / 2 + w * (c + 0.5) / cols; py = y0 + (d / 2 if side else -d / 2); sz = (w / cols - 0.05, 0.4, 2.95)
                else:
                    px = x0 + (w / 2 if side == 3 else -w / 2); py = y0 - d / 2 + d * (c + 0.5) / cols; sz = (0.4, d / cols - 0.05, 2.95)
                col = rnd.choice([hexc('#a8a49c'), hexc('#9a968e'), hexc('#b4b0a6')])
                o = boxc((px, py, z), sz, col)
                link(box((0, -0.21 if side == 0 else (0.21 if side == 1 else 0), 0.2), (sz[0] * 0.6 if side < 2 else 0.02, 0.02 if side < 2 else sz[1] * 0.6, 1.1),
                         hexc('#3a3e44')), o)  # 窓（割れて暗い）
                panels.append((o, k, side))
    core = boxc((x0, y0, h / 2), (w - 0.8, d - 0.8, h), hexc('#5a5650'))  # 中身（暗い）
    if f_fall is not None:
        core.keyframe_insert('scale', frame=f_fall + 8); core.keyframe_insert('location', frame=f_fall + 8)
        core.scale = (1.15, 1.15, 0.08); core.location.z = h * 0.04
        core.keyframe_insert('scale', frame=f_fall + 40); core.keyframe_insert('location', frame=f_fall + 40)
    if moss:
        mbox([(x0 + rnd.uniform(-w / 2, w / 2), y0 + rnd.choice([-1, 1]) * (d / 2 + 0.25), rnd.uniform(0, h * 0.5), rnd.uniform(0.5, 1.5), 0.2, rnd.uniform(1, 3))
              for _ in range(30)], hexc('#5f8a3a'), 'ivy')
    if crack_f:
        cr = []
        for i in range(10):
            z = rnd.uniform(2, h - 2); x = x0 + rnd.uniform(-w / 2 + 1, w / 2 - 1)
            o = boxc((x, y0 - d / 2 - 0.22, z), (rnd.uniform(0.06, 0.12), 0.03, rnd.uniform(2, 5)), hexc('#2a2622'), rot=(0, rnd.uniform(-0.5, 0.5), 0))
            appear(o, crack_f + i * 6)
    if f_fall is not None:
        order = sorted(panels, key=lambda p: (-p[1], rnd.random()))
        for i, (o, k, side) in enumerate(order):
            fa = int(f_fall + (k * -1 + floors) * 4 + rnd.uniform(0, 14))
            if fa >= n:
                continue
            p0 = o.location.copy()
            o.keyframe_insert('location', frame=fa); o.keyframe_insert('rotation_euler', frame=fa)
            T = int(10 + p0.z ** 0.5 * 4)
            dirx = (o.location.x - x0) * 0.25; diry = (o.location.y - y0) * 0.25
            o.location = (p0.x + dirx + rnd.uniform(-1, 1), p0.y + diry + rnd.uniform(-1, 1), 0.3)
            o.rotation_euler = (rnd.uniform(-1.5, 1.5), rnd.uniform(-1.5, 1.5), rnd.uniform(-1, 1))
            o.keyframe_insert('location', frame=fa + T); o.keyframe_insert('rotation_euler', frame=fa + T)
            set_interp(o, 'LINEAR', 'location')
    return panels


def dust_cloud(loc, n, f0, k=14, seed=5, c=hexc('#9a9284'), r=6.0):
    rnd = random.Random(seed)
    for i in range(k):
        o = sphere(loc, 1.0, c, seg=10, name='dust')
        o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=f0 + i)
        end = (loc[0] + rnd.uniform(-r, r) * 2, loc[1] + rnd.uniform(-r, r), loc[2] + rnd.uniform(0, r))
        o.scale = (r * 0.15,) * 3; o.keyframe_insert('scale', frame=f0 + i + 1)
        o.keyframe_insert('location', frame=f0 + i + 1)
        o.location = end; o.scale = (r * rnd.uniform(0.3, 0.5),) * 3
        o.keyframe_insert('location', frame=f0 + i + 60); o.keyframe_insert('scale', frame=f0 + i + 60)
        set_interp(o, 'CONSTANT', 'scale', {1, f0 + i})


# ---------------- 住宅地・下町 ----------------
def low_town(nx=8, ny=8, pitch=11.0, seed=3, cx=0, cy=0, skip=None, wall_k=None):
    """下町の家並み（小さめの家がぎっしり）"""
    rnd = random.Random(seed)
    for i in range(nx):
        for j in range(ny):
            x = cx + (i - (nx - 1) / 2) * pitch; y = cy + (j - (ny - 1) / 2) * pitch
            if skip and skip(x, y):
                continue
            for q in range(2):
                hx = x + (q - 0.5) * pitch * 0.48
                house((hx, y, 0), w=rnd.uniform(4.0, 4.8), d=rnd.uniform(5.0, 6.0), h=rnd.uniform(5.0, 6.2), rot_z=rnd.choice([0, math.pi]))
    for i in range(nx + 1):
        plane((cx + (i - nx / 2) * pitch, cy, 0.005), (1.2, ny * pitch + 30), hexc('#8a857c'))
    for j in range(ny + 1):
        plane((cx, cy + (j - ny / 2) * pitch, 0.006), (nx * pitch + 30, 2.4), hexc('#8a857c'))


def levee(x, y0, y1, w=10, h=7.0, c=hexc('#7a9a5a')):
    """堤防（台形）"""
    o = box((x, (y0 + y1) / 2, h / 2), (w, abs(y1 - y0), h), c)
    for v in o.data.vertices:  # box() は位置をメッシュに焼き込むので、中心からの距離で細める
        if v.co.z > h / 2:
            v.co.x = x + (v.co.x - x) * 0.4
    return o
