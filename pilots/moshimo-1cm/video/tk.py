"""「もしも全人類が1cmになったら」用の部品。猫の動画の kit.py / shots.py / shots_v5.py と、心臓の動画の hk.py の上に足す。
縮尺：人は s=1（身長 1.7）のまま。まわりの世界を K=170 倍にして作る（1cm の人の目線で、ふつうの大きさの世界）。
  - giant()：この中で kit の部品（メートル単位）を作ると、出口で原点を中心に K 倍される
  - 実寸の物はメートルで考え、K を掛けた値で置く（ベッドの高さ 0.5m → 85）
"""
import os, sys, math, random
HEARTS = '/home/user/TUBEX/pilots/moshimo-two-hearts/video'
if HEARTS not in sys.path:
    sys.path.insert(0, HEARTS)
from hk import *
from shots import _font, _tl
from kit import COATS, _osc

K = 170.0
RT = random.Random(170)


def MB(amb='room', meows=None, bed=0.0, purr=0.0, **kw):
    """音のメタ（audio.py が読む）。心臓の音はこの動画では使わない（beats=0）"""
    m = M(meows or [], bed, amb=amb)
    m['beats'] = 0
    if purr:
        m['purr'] = purr
    m.update(kw)
    return m


class giant:
    """with giant(): の中で作った（親のない）物を、原点を中心に K 倍する"""
    def __init__(self, k=K):
        self.k = k

    def __enter__(self):
        self.before = set(o.name for o in bpy.data.objects)
        return self

    def __exit__(self, *a):
        for o in bpy.data.objects:
            if o.name not in self.before and o.parent is None:
                o.location = o.location * self.k
                o.scale = o.scale * self.k


def cam1(lens=30, clip=(0.05, 40000)):
    c = camera(lens)
    c.data.clip_start, c.data.clip_end = clip
    return c


def follow(cam, n, pts, off, tgt_off=(0, 0, 0), k=8):
    """動く点の列 pts(t) -> (x,y,z) を、off だけずらした位置から追う"""
    keys = []
    for i in range(k + 1):
        t = i / k; p = Vector(pts(t))
        keys.append((t, tuple(p + Vector(off)), tuple(p + Vector(tgt_off))))
    cam_path(cam, keys, n)


def setup_light(sky_c, exp=0.45, ld=(0.5, -0.4, 0.7), shadow=0.45, ao=None):
    sky(sky_c); s = bpy.context.scene; s.view_settings.exposure = exp
    light_dir(ld); s.display.shading.shadow_intensity = shadow
    if ao is not None:
        s.display.matcap_ssao_distance = ao
    return s


# ---------------- 人（あなたと家族） ----------------
YOU = dict(shirt=hexc('#e07a5f'), pants=hexc('#3d5a80'), skin=SKIN[0], hair=hexc('#2b2420'))
FAMILY = [dict(shirt=hexc('#81b29a'), pants=hexc('#4a4f5c'), skin=SKIN[1], hair=hexc('#3a2a20')),
          dict(shirt=hexc('#f2cc8f'), pants=hexc('#5a5048'), skin=SKIN[0], hair=hexc('#1a1a1a')),
          dict(shirt=hexc('#9a8ac0'), pants=hexc('#3b4252'), skin=SKIN[1], hair=hexc('#4a3a2a'))]


def you(loc, rot_z=0.0, pose='stand', name='you', act=None):
    return person(loc, YOU['shirt'], pants=YOU['pants'], skin=YOU['skin'], hair=YOU['hair'], rot_z=rot_z, pose=pose, name=name, act=act)


def family(loc, k, rot_z=0.0, pose='stand', s=1.0, name=None):
    F = FAMILY[k % len(FAMILY)]
    return person(loc, F['shirt'], pants=F['pants'], skin=F['skin'], hair=F['hair'], rot_z=rot_z, pose=pose, s=s,
                  name=name or f'fam{k}')


def crowd(loc, rnd, rot_z=0.0, pose='stand', name='p'):
    return crowd_person(loc, rnd, rot_z=rot_z, pose=pose, name=name)


def lie_fix(p):
    """寝た人の頭を仰向けに（hs2.night_bedroom と同じ直し方）"""
    nk = O[p['neck']]
    nk.location.y += 0.04; nk.location.z += 0.02
    nk.rotation_euler = (-math.pi / 2, 0, 0)


def carrier_of(p):
    """人を空の親に乗せる（親を動かすと、歩く足どりを付けずに運べる：落ちる・跳ぶ・震える）"""
    e = empty(tuple(p.location), 'carry')
    p.location = (0, 0, 0); p.parent = e
    return e


def shake(o, n, amp=0.03, period=3, idx=0, f0=1, f1=None):
    b = o.location[idx]; f1 = f1 or n
    for f in range(f0, f1 + 1, period):
        v = list(o.location); v[idx] = b + (amp if (f // period) % 2 else -amp)
        o.location = v; o.keyframe_insert('location', index=idx, frame=f)
    v = list(o.location); v[idx] = b; o.location = v; o.keyframe_insert('location', index=idx, frame=f1 + period)


def arms_hug(p):
    """両腕で自分の肩を抱く（寒い）"""
    for k, sx in ((0, 1), (1, -1)):
        pass
    arm_to(p, 1, (-0.16, -0.2, 1.34))
    arm_to(p, 0, (0.16, -0.2, 1.36))


def arms_front(p, z=1.05, y=-0.32, w=0.12):
    """両腕を前へ（物を抱える）"""
    arm_to(p, 1, (w, y, z))
    arm_to(p, 0, (-w, y, z))


# ---------------- 家の猫（茶トラ）：金色の目・白いひげ ----------------
GOLD = hexc('#e3a81e')
CAT_S = 105.0  # 実寸の猫（kit の猫 s=0.62）× K


def tora(loc, s=CAT_S, rot_z=0.0, pose='sit', name='tora', slit=None, whisk=True):
    """家の茶トラ猫。kit の cat() に、大きめの金色の目（細かい球）、黒い瞳、目の光、白いひげを足す。
    slit=(f0, f1, a, b)：f0〜f1 で瞳の幅を a → b に（細くなる）"""
    root = cat(loc, 'tora', s=s, rot_z=rot_z, pose=pose, name=name)
    head = O[root['head']]
    for en in root['eyes']:
        O[en].scale = (0, 0, 0)
    eyes = []
    pupils = []
    for sx in (-1, 1):
        rim = link(sphere((sx * 0.042, -0.084, 0.024), 0.0215, hexc('#3a2410'), scale=(1, 0.55, 1.05), seg=40), head)
        ir = link(sphere((sx * 0.042, -0.088, 0.024), 0.0195, GOLD, scale=(1, 0.55, 1.05), seg=48), head)
        pu = link(sphere((sx * 0.042, -0.0975, 0.024), 0.0105, hexc('#0b0b0b'), scale=(0.9, 0.3, 1.45), seg=32), head)
        hl = link(sphere((sx * 0.042 + 0.006, -0.0985, 0.033), 0.0032, (1, 1, 1), seg=12), head)
        eyes += [rim, ir, pu, hl]; pupils.append(pu)
    root['eyes'] = [o.name for o in eyes]
    root['pupils'] = [o.name for o in pupils]
    if slit:
        f0, f1, a, b = slit
        for pu in pupils:
            pu.scale.x = 0.9 * a; pu.keyframe_insert('scale', index=0, frame=1); pu.keyframe_insert('scale', index=0, frame=f0)
            pu.scale.x = 0.9 * b; pu.keyframe_insert('scale', index=0, frame=f1)
    if whisk:
        ws = []
        for sx in (-1, 1):
            j = joint((sx * 0.03, -0.11, -0.035), head, 'jnt_whisk')
            for k, (dz, ang) in enumerate(((0.006, 0.12), (0.0, 0.0), (-0.006, -0.12))):
                w = cyl((sx * 0.07, 0, dz), 0.0011, 0.14, hexc('#fbfaf6'), rot=(0, math.pi / 2, 0), verts=6)
                w.rotation_euler = (0, math.pi / 2 + sx * ang, sx * 0.25)
                link(w, j)
            ws.append(j)
        root['whisk'] = [j.name for j in ws]
    return root


def whisker_sway(root, n, amp=0.12, period=30, seed=3):
    rnd = random.Random(seed)
    for jn in root.get('whisk', []):
        j = O[jn]
        _osc(j, 'rotation_euler', 2, j.rotation_euler.z, amp, period, n, rnd)
        _osc(j, 'rotation_euler', 1, j.rotation_euler.y, amp * 0.6, int(period * 1.3), n, rnd)


def cat_world(root, local):
    """猫の頭のローカル座標 -> 世界座標"""
    bpy.context.view_layer.update()
    return O[root['head']].matrix_world @ Vector(local)


def eye_world(root, side=1):
    return cat_world(root, (side * 0.042, -0.098, 0.024))


def head_tilt(root, f0, f1, roll=0.35):
    """首をかしげる（首の関節を傾ける）。animate_life の首振りと重なってよい"""
    h = O[root['head']]
    h.keyframe_insert('rotation_euler', frame=1); h.keyframe_insert('rotation_euler', frame=f0)
    h.rotation_euler.y = roll; h.keyframe_insert('rotation_euler', frame=f1)


def close_eyes(root, f=None, k=0.08):
    """目を閉じる（f フレームで。None なら最初から）"""
    for en in root['eyes']:
        o = O[en]; s0 = o.scale.copy()
        if f is None:
            o.scale = (s0.x, s0.y, s0.z * k)
        else:
            o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=f)
            o.scale = (s0.x, s0.y, s0.z * k); o.keyframe_insert('scale', frame=f + 12)
    if f is None:
        root['eyes'] = []  # まばたきを付けない


def paw_lift(root, k, f0, f1, up=0.9, f2=None):
    """前足 k を持ち上げる（座った猫）。f2 で下ろす"""
    j = O[root['legs'][k]]
    j.keyframe_insert('rotation_euler', frame=1); j.keyframe_insert('rotation_euler', frame=f0)
    j.rotation_euler.x = j.rotation_euler.x - up; j.keyframe_insert('rotation_euler', frame=f1)
    if f2:
        j.keyframe_insert('rotation_euler', frame=f2 - 14)
        j.rotation_euler.x = j.rotation_euler.x + up; j.keyframe_insert('rotation_euler', frame=f2)
    legs = list(root['legs']); legs.remove(j.name); root['legs'] = legs
    return j


# ---------------- 小さな物（実寸×K） ----------------
def rice(loc, rot_z=0.0, s=1.0, bite=False):
    """ご飯粒（長さ約5mm）。bite=True なら端が欠けている"""
    o = sphere(loc, 0.425 * s, hexc('#f6f2e6'), scale=(1, 0.6, 0.5), seg=24)
    o.rotation_euler.z = rot_z
    return o


def raw_rice(loc, rot_z=0.0, s=1.0):
    o = sphere(loc, 0.6 * s, hexc('#ece4cf'), scale=(1, 0.55, 0.45), seg=16)
    o.rotation_euler = (0, 0, rot_z)
    return o


def dustball(loc, r=1.0, seed=1, c=hexc('#b9b4ac')):
    rnd = random.Random(seed)
    root = empty(loc, 'dust')
    for i in range(9):
        d = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-0.6, 0.6))) * r * 0.55
        link(sphere(tuple(d), r * rnd.uniform(0.35, 0.6), c, seg=8), root)
    for i in range(6):
        a = rnd.uniform(0, 6.28)
        link(cyl((0, 0, 0), r * 0.03, r * 2.4, hexc('#cfcac2'), rot=(rnd.uniform(0, 3), a, rnd.uniform(0, 3)), verts=4), root)
    return root


def yarn(loc, L=8.0, c=hexc('#c0504d'), rot_z=0.0, r=0.35):
    o = cyl(loc, r, L, c, rot=(0, math.pi / 2, rot_z), verts=8)
    return o


def drop(loc, r=0.26):
    """雨粒（直径3mm）：うすい水色の半透明"""
    o = ball(loc, r, (0.72, 0.86, 1.0), a=0.6, seg=16, name='drop')
    return o


def leaf(loc, L=16.0, rot=(0, 0, 0), c=hexc('#5f9a45'), name='leaf'):
    root = empty(loc, name); root.rotation_euler = rot
    link(sphere((0, 0, 0), L / 2, c, scale=(0.55, 1.0, 0.03), seg=24), root)
    link(cyl((0, 0, L * 0.02), L * 0.012, L * 0.95, hexc('#8ab86a'), rot=(math.pi / 2, 0, 0), verts=6), root)
    return root


def pot(loc, r=17.0, h=30.0, c=hexc('#b8643a')):
    root = empty(loc, 'pot')
    link(cyl((0, 0, h / 2), r * 0.78, h, c, r2=r, verts=32), root)
    link(cyl((0, 0, h - 1.5), r * 1.06, 3.0, hexc('#a8582f'), verts=32), root)
    link(cyl((0, 0, h - 1.2), r * 0.95, 1.0, hexc('#4a3424'), verts=32), root)
    for k in range(5):
        link(sphere((RT.uniform(-6, 6), RT.uniform(-6, 6), h + 3 + k * 4), 7, hexc('#6a9a4a'), scale=(1, 1, 0.8), seg=12), root)
    return root


def button(loc, r=1.6, c=hexc('#d84a4a')):
    root = empty(loc, 'button')
    link(cyl((0, 0, 0.2), r, 0.4, c, verts=24), root)
    for dx, dy in ((-0.35, -0.35), (0.35, -0.35), (-0.35, 0.35), (0.35, 0.35)):
        link(cyl((dx * r * 0.6, dy * r * 0.6, 0.38), r * 0.1, 0.1, hexc('#5a1a1a'), verts=8), root)
    return root


def hanky(loc, w=8.0, d=10.0, c=hexc('#7fb3d5'), c2=hexc('#f2f2f2')):
    root = empty(loc, 'hanky')
    link(box((0, 0, 0.15), (w, d, 0.3), c, bevel=0.1), root)
    for k in range(3):
        link(box((0, -d / 2 + (k + 1) * d / 4, 0.32), (w, 0.35, 0.05), c2), root)
        link(box((-w / 2 + (k + 1) * w / 4, 0, 0.32), (0.35, d, 0.05), c2), root)
    return root


def onigiri(loc, s=1.0, rot_z=0.0):
    root = empty(loc, 'onigiri'); root.scale = (s, s, s); root.rotation_euler = (0, 0, rot_z)
    link(cyl((0, 0, 0.045), 0.055, 0.035, hexc('#f7f5ee'), rot=(math.pi / 2, 0, 0), verts=3), root).rotation_euler = (math.pi / 2, 0, math.pi / 2)
    link(box((0, 0, 0.018), (0.034, 0.037, 0.036), hexc('#1f2a22')), root)
    return root


# ---------------- 生き物 ----------------
def ant_k(loc, rot_z=0.0, name='ant'):
    """クロオオアリ（約1cm＝人と同じくらい）"""
    return ant(loc, s=18.0, rot_z=rot_z, name=name)


def ant_walk(objs, n, p0, p1, speed=1.0, spacing=2.6, z=0.0, wobble=0.25, seed=1):
    """p0 から p1 へ列で歩く（人と同じ速さくらい）。脚と触角の小刻みな動きも付ける"""
    rnd = random.Random(seed)
    p0 = Vector(p0); p1 = Vector(p1); d = (p1 - p0).normalized(); L = (p1 - p0).length
    side = Vector((-d.y, d.x, 0))
    for i, o in enumerate(objs):
        ph = rnd.uniform(0, 6.28)
        for f in range(1, n + 1, 3):
            u = (i * spacing + speed * f / FPS * 1.7) % L
            q = p0 + d * u + side * (wobble * math.sin(f * 0.15 + ph))
            o.location = (q.x, q.y, z); o.keyframe_insert('location', frame=f)
            o.rotation_euler.z = math.atan2(d.x, -d.y) + 0.15 * math.sin(f * 0.15 + ph)
            o.keyframe_insert('rotation_euler', index=2, frame=f)
        set_interp(o, 'LINEAR', 'location')
        legs = [c for c in o.children if c.name.startswith('cyl')]
        for k, l in enumerate(legs):
            b = l.rotation_euler.copy()
            for f in range(1, n + 1, 3):
                l.rotation_euler = (b.x + (0.35 if (f // 3 + k) % 2 else -0.35), b.y, b.z); l.keyframe_insert('rotation_euler', frame=f)


def ant_idle(o, n, seed=1):
    """止まっているアリ：触角と脚、体の向きが小さく動く"""
    rnd = random.Random(seed)
    _osc(o, 'rotation_euler', 2, o.rotation_euler.z, 0.25, rnd.randint(30, 50), n, rnd)
    legs = [c for c in o.children if c.name.startswith('cyl')]
    for k, l in enumerate(legs):
        _osc(l, 'rotation_euler', 0, l.rotation_euler.x, 0.2, rnd.randint(10, 20), n, rnd)


def bar(p0, p1, r, c, parent=None, verts=6):
    """p0 から p1 へ伸びる円柱（parent のローカル座標）"""
    p0 = Vector(p0); p1 = Vector(p1); d = p1 - p0
    o = cyl(tuple((p0 + p1) / 2), r, d.length, c, verts=verts)
    o.rotation_euler = Vector((0, 0, 1)).rotation_difference(d).to_euler()
    if parent is not None:
        link(o, parent)
    return o


def spider(loc, span=22.0, rot_z=0.0, name='spider', c=hexc('#6a4e36')):
    """アシダカグモ：脚を広げた幅 span（左右の足先の間）。脚は付け根の関節ごとに動かす"""
    s = span / 2.1
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    body = empty((0, 0, 0.16), 'spbody'); link(body, root)
    link(sphere((0, -0.06, 0), 0.085, c, scale=(1, 1.15, 0.6), seg=20), body)
    link(sphere((0, 0.14, 0.01), 0.11, hexc('#5a412c'), scale=(0.85, 1.25, 0.7), seg=20), body)
    for sx in (-1, 1):
        link(sphere((sx * 0.022, -0.155, 0.035), 0.013, hexc('#111111'), seg=8), body)
        link(sphere((sx * 0.04, -0.15, 0.03), 0.009, hexc('#111111'), seg=8), body)
    legs = []
    c2 = hexc('#5a412c')
    for sx in (-1, 1):
        for k, ang in enumerate((-0.95, -0.35, 0.3, 0.85)):
            phi = ang if sx > 0 else math.pi - ang
            hip = joint((sx * 0.05, -0.08 + k * 0.03, 0), body, 'sphip', rot=(0, 0, phi - math.pi / 2))
            L = 1.0 - 0.08 * abs(k - 1.5)
            bar((0, 0, 0), (0, 0.5 * L, 0.2), 0.017, c, hip)
            link(sphere((0, 0.5 * L, 0.2), 0.022, c, seg=8), hip)
            bar((0, 0.5 * L, 0.2), (0, 0.98 * L, -0.16), 0.012, c2, hip)
            hip['phase'] = (k % 2) * 0.5 + (0.25 if sx > 0 else 0)
            legs.append(hip)
    root['legs'] = [l.name for l in legs]; root['body'] = body.name
    return root


def spider_live(sp, n, walk=None, seed=2):
    """脚を交互に動かし、体を上下させる。walk=(f0, f1, p1) で p1 へ歩く"""
    rnd = random.Random(seed)
    body = O[sp['body']]
    _osc(body, 'location', 2, body.location.z, 0.01, 40, n, rnd)
    for ln in sp['legs']:
        l = O[ln]; b = l.rotation_euler.copy(); ph = l['phase']
        for f in range(1, n + 1, 3):
            l.rotation_euler = (b.x + 0.12 * math.sin(f * 0.35 + ph * 6.28), b.y, b.z + 0.12 * math.sin(f * 0.35 + ph * 6.28 + 1.2))
            l.keyframe_insert('rotation_euler', frame=f)
    if walk:
        f0, f1, p1 = walk
        sp.keyframe_insert('location', frame=1); sp.keyframe_insert('location', frame=f0)
        sp.location = p1; sp.keyframe_insert('location', frame=f1)


def rat(loc, s=150.0, rot_z=0.0, name='rat', c=hexc('#6a6058')):
    """ドブネズミ：make_rat に目・耳を足し、体・頭・しっぽを動かせるようにする"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    body = link(sphere((0, 0, 0.05), 0.05, c, scale=(0.8, 1.6, 0.8), seg=20), root)
    hj = joint((0, -0.075, 0.06), root, 'rathead')
    link(sphere((0, -0.015, 0), 0.032, c, scale=(0.9, 1.4, 0.85), seg=16), hj)
    link(sphere((0, -0.062, -0.004), 0.008, hexc('#c98a8a'), seg=8), hj)
    for sx in (-1, 1):
        link(sphere((sx * 0.022, 0.005, 0.03), 0.015, hexc('#b08a8a'), scale=(1, 0.4, 1), seg=10), hj)
        link(sphere((sx * 0.017, -0.035, 0.012), 0.0055, hexc('#0a0a0a'), seg=8), hj)
        for k in (-1, 1):
            w = cyl((sx * 0.025, -0.055, 0.0), 0.0006, 0.05, hexc('#e8e4dc'), rot=(0, math.pi / 2, sx * 0.2 * k), verts=4); link(w, hj)
    tj = joint((0, 0.075, 0.035), root, 'rattail')
    link(cyl((0, 0.1, -0.01), 0.006, 0.2, hexc('#b08a8a'), rot=(math.pi / 2 + 0.1, 0, 0), verts=6), tj)
    for sx in (-1, 1):
        for sy in (-0.05, 0.05):
            link(sphere((sx * 0.03, sy, 0.012), 0.012, hexc('#c09a90'), scale=(1, 1.4, 0.6), seg=8), root)
    root['rbody'] = body.name; root['rhead'] = hj.name; root['rtail'] = tj.name
    return root


def rat_live(r, n, seed=4, sniff=True):
    rnd = random.Random(seed)
    b = O[r['rbody']]; _osc(b, 'scale', 2, b.scale.z, b.scale.z * 0.05, 14, n, rnd)
    h = O[r['rhead']]
    if sniff:
        _osc(h, 'rotation_euler', 0, 0.0, 0.12, 8, n, rnd)
        _osc(h, 'rotation_euler', 2, 0.0, 0.35, 50, n, rnd)
    t = O[r['rtail']]; _osc(t, 'rotation_euler', 2, 0.0, 0.4, 30, n, rnd)


def shrew(loc, s=1.0, rot_z=0.0, name='shrew'):
    """トガリネズミの仲間：とがった鼻先"""
    r = rat(loc, s=s, rot_z=rot_z, name=name, c=hexc('#5a4a40'))
    h = O[r['rhead']]
    link(cone((0, -0.06, -0.006), 0.012, 0.05, hexc('#7a6458'), rot=(math.pi / 2, 0, 0), verts=10), h)
    b = O[r['rbody']]; b.scale = (0.9, 1.3, 0.85)
    O[r['rtail']].scale = (1, 0.45, 1)
    return r


def bug(loc, s=1.0, c=hexc('#3a5a2a'), rot_z=0.0):
    root = empty(loc, 'bug'); root.scale = (s, s, s); root.rotation_euler = (0, 0, rot_z)
    link(sphere((0, 0, 0.01), 0.012, c, scale=(0.8, 1.5, 0.6), seg=10), root)
    for sx in (-1, 1):
        for k in range(3):
            link(cyl((sx * 0.01, -0.008 + k * 0.008, 0.004), 0.0012, 0.016, c, rot=(0, sx * 1.2, 0), verts=4), root)
    return root


def sparrow_k(loc, s=165.0, rot_z=0.0, name='sparrow'):
    """スズメ（全長約14cm）：bird() に尾と目、のどの黒い模様を足す"""
    b = sparrow(loc, s=s, rot_z=rot_z, name=name)
    link(box((0, 0.075, 0.07), (0.035, 0.06, 0.008), hexc('#6a4a32'), rot=(-0.35, 0, 0)), b)
    link(sphere((0, -0.072, 0.09), 0.012, hexc('#222222'), scale=(1, 0.6, 1)), b)
    for sx in (-1, 1):
        link(sphere((sx * 0.026, -0.06, 0.11), 0.0055, hexc('#111111')), b)
        link(sphere((sx * 0.03, -0.045, 0.1), 0.012, hexc('#f0ebe0'), scale=(0.3, 1, 0.8)), b)
        link(cyl((sx * 0.012, 0.0, 0.012), 0.002, 0.03, hexc('#c0a080'), verts=5), b)
    link(sphere((0, -0.04, 0.122), 0.022, hexc('#7a4a2a'), scale=(1, 1, 0.6)), b)
    return b


def crow_k(loc, s=640.0, rot_z=0.0, name='crow'):
    b = crow(loc, s=s, rot_z=rot_z, name=name)
    link(box((0, 0.085, 0.065), (0.03, 0.07, 0.008), hexc('#1b1c20'), rot=(-0.3, 0, 0)), b)
    for sx in (-1, 1):
        link(sphere((sx * 0.026, -0.065, 0.11), 0.0045, hexc('#4a4a50')), b)
    return b


def bird_live(b, n, rnd, peck_=True, f1=None):
    if peck_:
        peck(b, f1 or n, rnd)
    else:
        _osc(b, 'rotation_euler', 2, b.rotation_euler.z, 0.25, rnd.randint(40, 70), n, rnd)
        _osc(b, 'rotation_euler', 0, b.rotation_euler.x, 0.08, rnd.randint(30, 50), n, rnd)


# ---------------- 場所（K 倍の世界） ----------------
QUILT = hexc('#f4f1ea')
RUN_Y = 0.8 * K  # 布団の上であなたが走る谷


def bedroom(night=False, wall=hexc('#efe6d6'), haze=True, sun=True):
    """寝室：ベッドの上（掛け布団の上面 z=Q）、枕、遠くの壁、窓。
    ベッドは x=-0.6..0.6m, y=-1.05..1.05m（枕は -y 側）。床は z=0"""
    if night:
        setup_light(hexc('#141a2c'), exp=-0.1, ld=(0.2, 0.6, 0.7), shadow=0.3)
    else:
        setup_light(hexc('#f2e6d0'), exp=0.5, ld=(-0.55, 0.45, 0.62), shadow=0.5)
    with giant():
        room(4.4, 4.4, 2.5, floor=hexc('#b48a63'), wall=wall, window=True, night=night)
        box((0, -2.2, 1.25), (4.4, 0.1, 2.5), wall)          # 手前の壁（振り返る画のため）
        box((2.2, 0, 1.25), (0.1, 4.4, 2.5), hexc('#e8dfcf'))
        box((-1.2, -2.12, 1.0), (0.85, 0.05, 2.0), hexc('#9a7a5a'))  # ドア
        bed((0.6, 0.6, 0), quilt=QUILT, c=hexc('#ece6da'))
        box((1.85, 1.9, 0.4), (0.5, 0.4, 0.8), hexc('#a77d55'))  # 棚
        box((-1.6, 1.95, 0.6), (0.9, 0.4, 1.2), hexc('#c8b090'))  # たんす
        cyl((-1.0, -1.2, 0.006), 0.7, 0.012, hexc('#d9c9a8'), verts=40)  # 敷物
    # ベッドの位置（K 倍後）。掛け布団：x 0.02..1.18m, y 0.15..1.55m 付近、上面 0.57m
    Q = 0.57 * K
    rnd = random.Random(11)
    # 布団のしわ（谷と丘）。あなたが走る谷 y=RUN_Y を空けて、x 方向に平行に並べる
    for i, dy in enumerate((-118, -96, -76, -57, -40, -24, -11, 11, 25, 41, 58, 78, 98)):
        y = RUN_Y + dy
        if not (0.17 * K < y < 1.53 * K):
            continue
        r = rnd.uniform(5, 9) if abs(dy) > 15 else rnd.uniform(3.5, 5)
        L = rnd.uniform(70, 150); x = rnd.uniform(0.1, 1.1) * K
        x = min(max(x, L / 2 + 4), 1.17 * K - L / 2) if L < 1.1 * K else 0.6 * K
        o = cyl((x, y, Q - r * 0.25), r, L, QUILT, verts=24)
        o.rotation_euler = (0, math.pi / 2, rnd.uniform(-0.06, 0.06))
        bpy.ops.object.shade_smooth()
        o.scale = (0.55, 1, 1)
    if haze and not night:
        # 部屋の向こうはかすむ（うすい霞の板）
        for k, (y, a) in enumerate(((1.9 * K, 0.35), (-1.6 * K, 0.3))):
            pl = plane((0, y, 1.2 * K), (5 * K, 2.6 * K), (1, 1, 1), rot=(math.pi / 2, 0, 0))
            pl.data.materials.clear(); pl.data.materials.append(gmat((0.97, 0.94, 0.88), a, 'haze'))
    if sun and not night:
        pl = plane((0.6 * K, 2.13 * K, 1.45 * K), (1.7 * K, 1.1 * K), (1, 1, 1), rot=(math.pi / 2, 0, 0))
        pl.data.materials.clear(); pl.data.materials.append(gmat((1.0, 0.97, 0.86), 1.0, 'sunwin'))
    return Q


BED = dict(x0=0.0, x1=1.2 * K, y0=-0.45 * K, y1=1.65 * K)  # ベッドの外形（K 倍後, 位置は bed((0.6,0.6)) 基準）


def bed_xy():
    return 0.6 * K, 0.6 * K


def quilt_edge_x():
    """掛け布団の +x 側の端（崖）"""
    return (0.6 + 0.58) * K


def stairs_set(steps=8, riser=0.2, tread=0.25, width=0.85):
    """階段（上から下へ +y 方向に下りる）。上の床の高さ steps*riser*K。返り値：(上の床の z, 各段の (y0, z))"""
    setup_light(hexc('#e9dfcf'), exp=0.45, ld=(0.45, -0.3, 0.8), shadow=0.5)
    R, T, W = riser * K, tread * K, width * K
    top = steps * R
    wood = hexc('#b98a5a'); wood2 = hexc('#a8794a')
    box((0, -2.0 * K / 2, top - 0.05 * K / 2), (W + 0.4 * K, 2.0 * K, 0.05 * K), hexc('#c49a6a'))  # 2階の廊下
    rows = []
    for i in range(steps):
        z = top - (i + 1) * R
        y0 = i * T
        box((0, y0 + T / 2, z / 2 + 0.0), (W, T, z if z > 0 else 0.5), wood if i % 2 else wood2)
        box((0, y0 + T - 0.6, z + 0.25), (W, 1.2, 0.5), hexc('#8a6a42'))  # 段の鼻
        rows.append((y0, z))
    box((0, steps * T + 3 * K / 2, -0.5), (W + 2 * K, 3 * K + 2 * T, 1.0), hexc('#b48a63'))  # 1階の床
    for sx in (-1, 1):
        box((sx * (W / 2 + 4), steps * T / 2, top / 2 + 0.6 * K), (8, steps * T + 3 * K, top + 1.2 * K), hexc('#efe6d6'))
    box((0, steps * T + 2.6 * K, 1.2 * K), (W + 2 * K, 10, 2.4 * K), hexc('#e8dfcf'))
    return top, rows


def kitchen(night=False):
    """台所の床：タイル、流し台の下の戸棚、遠くの冷蔵庫"""
    if night:
        setup_light(hexc('#0e1424'), exp=-0.15, ld=(0.6, 0.5, 0.35), shadow=0.6)
    else:
        setup_light(hexc('#f0e8da'), exp=0.5, ld=(0.4, -0.5, 0.7), shadow=0.45)
    t = 0.3 * K
    c1 = hexc('#e6dfd2') if not night else hexc('#8a8a96'); c2 = hexc('#d4cbbb') if not night else hexc('#767684')
    for i in range(-6, 7):
        for j in range(-4, 9):
            plane((i * t, j * t, 0.0), (t - 0.6, t - 0.6), c1 if (i + j) % 2 else c2)
    box((0, -4.5 * t, -0.3), (14 * t, 14 * t, 0.6), hexc('#9a958a'))  # 目地
    with giant():
        box((0, 1.0, 0.43), (3.6, 0.6, 0.86), hexc('#eae4d8') if not night else hexc('#5a5a66'))  # 戸棚
        box((0, 0.69, 0.05), (3.6, 0.02, 0.1), hexc('#4a4a52'))  # 幅木
        for x in (-1.2, -0.4, 0.4, 1.2):
            box((x, 0.695, 0.5), (0.76, 0.01, 0.7), hexc('#dcd4c6') if not night else hexc('#50505c'))
            box((x + 0.3, 0.685, 0.72), (0.03, 0.02, 0.12), hexc('#9a9a9a'))
        box((-2.4, 0.9, 0.9), (0.7, 0.7, 1.8), hexc('#f4f4f2') if not night else hexc('#5f6270'))  # 冷蔵庫
        box((0, 1.3, 1.6), (6, 0.1, 3.2), hexc('#e8e0d0') if not night else hexc('#3a3e4c'))
    return 0.69 * K  # 戸棚の前面の y


def garden(rainy=False, wet=False):
    """庭の地面：土、草、ブロック塀の暗がり"""
    if rainy:
        setup_light(hexc('#9aa6b0'), exp=0.25, ld=(0.3, -0.4, 0.85), shadow=0.35)
    else:
        setup_light(hexc('#a8cbe8'), exp=0.45, ld=(0.5, -0.4, 0.7), shadow=0.5)
    g = plane((0, 0, 0), (60 * K, 60 * K), hexc('#7a6248') if not wet else hexc('#5e4a36'))
    rnd = random.Random(3)
    for i in range(180):
        x = rnd.uniform(-160, 160); y = rnd.uniform(-60, 260)
        if abs(x) < 14 and -30 < y < 30:
            continue
        h = rnd.uniform(10, 40)
        o = cone((x, y, h / 2), rnd.uniform(0.6, 1.4), h, rnd.choice([hexc('#5f8a3e'), hexc('#6d9a48'), hexc('#4f7a34')]), verts=4)
        o.rotation_euler = (rnd.uniform(-0.25, 0.25), rnd.uniform(-0.25, 0.25), rnd.uniform(0, 3))
    for i in range(60):
        sphere((rnd.uniform(-120, 120), rnd.uniform(-40, 200), 0), rnd.uniform(0.6, 3.0), rnd.choice([hexc('#8a8478'), hexc('#9a958d'), hexc('#6a5a4a')]),
               scale=(1, 1, 0.5), seg=8)
    return g


def block_wall(y, x0=-400, x1=400, h=1.2 * K, c=hexc('#a9a49a')):
    box(((x0 + x1) / 2, y, h / 2), (x1 - x0, 0.15 * K, h), c)
    for i in range(int((x1 - x0) / (0.4 * K)) + 1):
        box((x0 + i * 0.4 * K, y - 0.075 * K - 0.2, h / 2), (0.6, 0.6, h), hexc('#8a857c'))
    for j in range(1, 6):
        box(((x0 + x1) / 2, y - 0.075 * K - 0.2, j * 0.2 * K), (x1 - x0, 0.6, 0.6), hexc('#8a857c'))


def shelf_set(night=False):
    """食器棚・本棚の上（木の板 z=S）。下の床に猫が眠る"""
    if night:
        setup_light(hexc('#1a2030'), exp=0.0, ld=(0.3, -0.5, 0.8))
    else:
        setup_light(hexc('#f2e6d0'), exp=0.5, ld=(-0.4, -0.5, 0.7), shadow=0.45)
    S = 0.9 * K
    with giant():
        box((0, 0, -0.05), (5, 5, 0.1), hexc('#b48a63'))
        box((0, 1.2, 1.3), (5, 0.1, 2.6), hexc('#efe6d6'))
        box((0, 0.95, 0.45), (1.4, 0.4, 0.9), hexc('#a77d55'))       # 棚の箱
        box((0, 0.95, 0.9), (1.44, 0.44, 0.02), hexc('#8a6440'))     # 天板
        box((0, 1.05, 1.5), (1.4, 0.25, 0.02), hexc('#8a6440'))      # 上の段
        box((-0.71, 1.05, 1.2), (0.02, 0.25, 0.6), hexc('#8a6440'))
        box((0.71, 1.05, 1.2), (0.02, 0.25, 0.6), hexc('#8a6440'))
        for k in range(6):
            box((-0.55 + k * 0.08, 1.08, 1.12), (0.06, 0.18, 0.22 + 0.03 * (k % 3)), [hexc('#7a8aa0'), hexc('#c06a50'), hexc('#5a7a5a')][k % 3])
        box((1.6, 0.3, 1.45), (0.04, 1.4, 1.1), hexc('#bcd3e6'))      # 窓
    return S


# ---------------- ふつうの縮尺の場所（人は見えない・見せない画） ----------------
def still_street(n):
    """止まったままの車が並ぶ大通り（ふつうの縮尺。人の姿はない）"""
    sky(hexc('#b7d0e6')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    light_dir((0.4, -0.5, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(400, rgb=hexc('#c2bcb0'))
    plane((0, 0, 0.01), (400, 12), hexc('#7d7a76'))
    for x in range(-60, 61, 6):
        plane((x, 0, 0.02), (3, 0.18), hexc('#f0f0ea'))
    box((0, -7.0, 0.08), (400, 2.0, 0.16), hexc('#d8d2c6')); box((0, 7.0, 0.08), (400, 2.0, 0.16), hexc('#d8d2c6'))
    rnd = random.Random(4)
    for i in range(14):
        for lane, rz in ((-3.0, math.pi / 2), (3.0, -math.pi / 2)):
            x = -50 + i * 7.5 + rnd.uniform(-1.5, 1.5)
            car((x, lane, 0), rot_z=rz)
    for k in range(10):
        x = -60 + k * 13
        tower((x, 16 + rnd.uniform(0, 6), 0), rnd.uniform(8, 11), 8, rnd.uniform(14, 36), rnd.choice(WALLS))
        tower((x + 5, -17 - rnd.uniform(0, 6), 0), rnd.uniform(8, 11), 8, rnd.uniform(14, 30), rnd.choice(WALLS))
    for x in range(-60, 61, 12):
        tree((x, 7.5, 0), s=0.7);
    return s


def still_station(n):
    """ホームに止まったままの電車（人の姿はない）"""
    sky(hexc('#b7d0e6')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    light_dir((0.4, -0.5, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(400, rgb=hexc('#a9a49a'))
    box((0, 3.2, 0.55), (120, 4.5, 1.1), hexc('#cfc9bd'))   # ホーム
    box((0, 1.05, 1.11), (120, 0.3, 0.01), hexc('#f2d24a'))  # 黄色い線
    for x in range(-50, 51, 10):
        cyl((x, 4.5, 2.6), 0.12, 3.0, hexc('#8a8a8a'))
    box((0, 4.5, 4.15), (120, 3.0, 0.15), hexc('#6a6e74'))   # 屋根
    for k in range(4):
        cx = -30 + k * 20.4
        box((cx, -0.6, 2.0), (20, 2.9, 3.2), hexc('#eef0ee'), bevel=0.1)
        box((cx, 0.86, 2.2), (18, 0.04, 0.9), hexc('#4d6a8a'))
        box((cx, 0.87, 1.3), (20, 0.03, 0.2), hexc('#2f8a4a'))
        for d in (-6, 0, 6):
            box((cx + d, 0.88, 1.7), (1.3, 0.03, 2.0), hexc('#c8ccd0'))
    for sx in (-0.75, 0.75):
        box((0, -0.6 + sx, 0.12), (140, 0.1, 0.12), hexc('#6a6a6a'))
    return s
