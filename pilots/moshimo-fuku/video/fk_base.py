"""hk.py（pilots/moshimo-two-hearts/video）から、この企画で使う汎用部品だけを写したもの（キーの補間・出す/消す・腕・電車・病院・トラックなど）。
心臓の光（hearts）は使わない。元ファイルは編集しない。"""
import math, random
from mathutils import Vector
from shots_v5 import *
from shots import _font, _tl, make_tex
from kit import COATS

RH = random.Random(42)


# ---------------- キーの補間（Blender 5 の層つきアクションにも対応） ----------------
def fcurves_of(idb):
    ad = getattr(idb, 'animation_data', None)
    if ad is None or ad.action is None:
        return []
    act = ad.action
    if hasattr(act, 'fcurves'):
        return list(act.fcurves)
    out = []
    for L in act.layers:
        for st in L.strips:
            for cb in st.channelbags:
                out.extend(cb.fcurves)
    return out


def set_interp(idb, kind='CONSTANT', path=None, frames=None):
    for fc in fcurves_of(idb):
        if path and fc.data_path != path:
            continue
        for k in fc.keyframe_points:
            if frames is None or int(round(k.co.x)) in frames:
                k.interpolation = kind


def appear(o, f, grow=6):
    """f フレームで、ぽんと出す"""
    s0 = o.scale.copy()
    o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=1)
    o.scale = s0; o.keyframe_insert('scale', frame=max(2, f))
    set_interp(o, 'CONSTANT', 'scale', {1})


def vanish(o, f):
    """f フレームで消す"""
    s0 = o.scale.copy()
    o.keyframe_insert('scale', frame=1)
    o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=max(2, f))
    o.scale = s0
    set_interp(o, 'CONSTANT', 'scale')


def blink(o, n, period, phase=0):
    for f in range(1, n + 1, period):
        o.scale = (1, 1, 1) if (f // period + phase) % 2 == 0 else (0, 0, 0)
        o.keyframe_insert('scale', frame=f)
    set_interp(o, 'CONSTANT', 'scale')


def linear(o, path=None):
    set_interp(o, 'LINEAR', path)

class _Objs:
    """bpy.data.objects を毎回引く（reset() のあとで古い参照を使わない）"""
    def __getitem__(self, k):
        return bpy.data.objects[k]


O = _Objs()

def gmat(rgb, a=1.0, name='glow'):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*rgb, a)
    if a < 1.0:
        try:
            m.blend_method = 'BLEND'
        except Exception:
            pass
    return m


def ball(loc, r, rgb, a=1.0, seg=16, parent=None, name='glow'):
    o = sphere(loc, r, (1, 1, 1), seg=seg, name=name)
    o.data.materials.clear(); o.data.materials.append(gmat(rgb, a, name))
    if parent is not None:
        link(o, parent)
    return o


def arm_to(p, k, target, f=None):
    """腕 k の手先を target（人のローカル座標）へ。f を渡すとそのフレームまでに動かす。腕は animate_life から外す"""
    j = O[p['arms'][k]]
    d = Vector(target) - Vector(j.location)
    e = Vector((0, 0, -1)).rotation_difference(d).to_euler(); sc = (1, 1, d.length / 0.6)
    if f is None:
        j.rotation_euler = e; j.scale = sc
    else:
        j.keyframe_insert('rotation_euler', frame=1); j.keyframe_insert('scale', frame=1)
        j.keyframe_insert('rotation_euler', frame=f); j.keyframe_insert('scale', frame=f)
        j.rotation_euler = e; j.scale = sc
        j.keyframe_insert('rotation_euler', frame=f + 10); j.keyframe_insert('scale', frame=f + 10)
    arms = list(p['arms']); arms.remove(j.name); p['arms'] = arms
    return j


def people_colors(rnd):
    return rnd.choice([hexc('#3d5a80'), hexc('#c46a4a'), hexc('#4a6b4a'), hexc('#8a8a8a'), hexc('#d9b26a'), hexc('#2f3440'),
                       hexc('#7a5a8a'), hexc('#e8e2d6'), hexc('#5a7a9a')])


def crowd_person(loc, rnd, rot_z=0.0, pose='stand', s=1.0, name='p', act=None):
    return person(loc, people_colors(rnd), pants=rnd.choice([hexc('#3b4252'), hexc('#2a2a2a'), hexc('#5a5048')]),
                  skin=rnd.choice(SKIN[:3]), hair=rnd.choice([hexc('#2b2420'), hexc('#4a3a2a'), hexc('#1a1a1a'), hexc('#8a8a88')]),
                  rot_z=rot_z, pose=pose, s=s, name=name, act=act)



def wiggle(o, n, idx=2, amp=0.25, period=10, f0=1):
    """しっぽ・ひれなどの往復"""
    base = o.rotation_euler[idx]
    for f in range(f0, n + period, period // 2):
        v = list(o.rotation_euler); v[idx] = base + (amp if (f // (period // 2)) % 2 else -amp)
        o.rotation_euler = v; o.keyframe_insert('rotation_euler', index=idx, frame=f)


def circle_path(o, n, center, r, laps=1.0, z=None, f0=1, phase=0.0, face=True):
    """円を回る（向きも進行方向へ）"""
    cx, cy, cz = center
    for f in range(f0, n + 1, 2):
        a = phase + 2 * math.pi * laps * (f - f0) / max(1, n - f0)
        o.location = (cx + r * math.cos(a), cy + r * math.sin(a), z if z is not None else cz)
        o.keyframe_insert('location', frame=f)
        if face:
            o.rotation_euler.z = a + math.pi  # 前は -y：接線方向へ
            o.keyframe_insert('rotation_euler', index=2, frame=f)


def bob(o, n, amp=0.05, period=30, idx=2):
    _b = o.location[idx]
    for f in range(1, n + period, period // 2):
        v = list(o.location); v[idx] = _b + (amp if (f // (period // 2)) % 2 else -amp)
        o.location = v; o.keyframe_insert('location', index=idx, frame=f)



def _swap_more(a, b, f):
    pr = bpy.context.preferences.edit; old = pr.keyframe_new_interpolation_type
    pr.keyframe_new_interpolation_type = 'CONSTANT'
    b_s = Vector((1, 1, 1))
    a.scale = Vector((1, 1, 1)); a.keyframe_insert('scale', frame=f - 1)
    a.scale = (0, 0, 0); a.keyframe_insert('scale', frame=f)
    b.scale = (0, 0, 0); b.keyframe_insert('scale', frame=1); b.keyframe_insert('scale', frame=f - 1)
    b.scale = b_s; b.keyframe_insert('scale', frame=f)
    pr.keyframe_new_interpolation_type = old


def swap_seq(planes, frames):
    """板を順に切り替える（frames[i] で planes[i] → planes[i+1]）"""
    on = [Vector(p.scale) for p in planes]
    big = 10 ** 6
    bounds = [1] + list(frames) + [big]
    for i, p in enumerate(planes):
        if bounds[i] > 1:
            p.scale = (0, 0, 0); p.keyframe_insert('scale', frame=1)
        p.scale = on[i]; p.keyframe_insert('scale', frame=bounds[i])
        if bounds[i + 1] < big:
            p.scale = (0, 0, 0); p.keyframe_insert('scale', frame=bounds[i + 1])
        set_interp(p, 'CONSTANT', 'scale')


def draw_card(title, lines, bg=(250, 247, 240), fg=(40, 44, 60), accent=(200, 60, 70), size=(1920, 1080)):
    """やわらかい説明の紙（数字は台本にあるものだけ）"""
    def f(im, d):
        W, H = size
        d.rectangle((0, 0, W, H), fill=bg)
        d.rounded_rectangle((40, 40, W - 40, H - 40), 40, outline=(220, 214, 200), width=8)
        y = 90
        if title:
            d.text((110, y), title, font=_font(96), fill=accent); y += 190
        for l in lines:
            d.text((110, y), l, font=_font(104), fill=fg); y += 175
    return f


def city_strip(n, speed=7.0, side=1, seed=3, night=False):
    """窓の外を流れる街（y=side*(6..40) に建物が並び、x 方向へ流れる）"""
    rnd = random.Random(seed)
    par = empty((0, 0, 0), 'city')
    span = speed * n / FPS + 60
    x = -40.0
    while x < span:
        w = rnd.uniform(4, 9); d = rnd.uniform(5, 10); h = rnd.uniform(5, 22)
        y = side * rnd.uniform(9, 22)
        c = rnd.choice(WALLS + [hexc('#b9c3cc'), hexc('#c9b8a0')])
        link(box((x, y, h / 2 - 2.0), (w, d, h), c), par)
        if h > 8:
            for fl in range(int(h / 3)):
                link(box((x, y - side * (d / 2 + 0.02), fl * 3 + 0.5), (w * 0.85, 0.05, 0.9),
                         hexc('#ffd98a') if night and rnd.random() < 0.4 else hexc('#8aa3b8')), par)
        if rnd.random() < 0.3:
            link(sphere((x + w * 0.7, side * 7.5, 1.0), 1.6, rnd.choice([hexc('#6f8f4e'), hexc('#7d9a55')]), seg=10), par)
        x += w + rnd.uniform(1.5, 5)
    # 線路わきの柵と電柱（速さが分かる）
    for k in range(int(span / 12) + 6):
        xx = -40 + k * 12
        link(cyl((xx, side * 5.5, 1.5), 0.08, 6.5, hexc('#8c8a86')), par)
    link(box((span / 2 - 20, side * 6.5, -1.2), (span + 60, 0.1, 1.0), hexc('#9a958d')), par)
    par.location.x = 0; par.keyframe_insert('location', frame=1)
    par.location.x = -speed * n / FPS; par.keyframe_insert('location', frame=n + 1)
    linear(par, 'location')
    return par


DOOR_X = (-4.5, 4.5)


def _segs(x0, x1, gaps, half):
    """[x0, x1] から gaps（中心±half）を抜いた区間"""
    out = []; cur = x0
    for g in sorted(gaps):
        if g - half > cur:
            out.append((cur, g - half))
        cur = max(cur, g + half)
    if cur < x1:
        out.append((cur, x1))
    return out


def train_car(n, moving=True, stand=10, sit=12, seed=1, night=False, doors_open=None, glow=False, bpm=(72, 63), avoid=None, ground_on=True):
    """満員電車の車内。車両は x 方向（-9〜9）、幅 y=±1.45、ドアは x=±4.5（両側）。窓の外は city_strip（止まっていればホーム）。
    avoid(x, y) が真の場所には人を置かない。戻り値：(立っている人, 座っている人, ドアの板)"""
    s = bpy.context.scene
    sky(hexc('#16203a') if night else hexc('#bcd6ee')); s.view_settings.exposure = 0.3 if not night else -0.1
    s.display.shading.show_shadows = False
    light_dir((0.2, -0.3, 0.9))
    Lx = 18.0; Wd = 2.9; Hh = 2.3
    box((0, 0, -0.055), (Lx, Wd, 0.12), hexc('#8a8478'))  # 床
    box((0, 0, Hh + 0.05), (Lx, Wd, 0.1), hexc('#eef0ee'))  # 天井
    for x in (-Lx / 2, Lx / 2):
        box((x, 0, Hh / 2), (0.08, Wd, Hh), hexc('#dfe2de'))  # 妻面
        box((x * 0.995, 0, 1.2), (0.05, 0.8, 1.6), hexc('#b9c3cc'))  # 貫通扉
    wall = hexc('#e6e8e4')
    leaves = []
    for side in (1, -1):
        y = side * Wd / 2
        for a_, b_ in _segs(-Lx / 2, Lx / 2, DOOR_X, 0.7):
            box(((a_ + b_) / 2, y, 0.45), (b_ - a_, 0.08, 0.9), wall)
        box((0, y, Hh - 0.2), (Lx, 0.08, 0.4), wall)
        for k in range(9):
            x = -Lx / 2 + 0.2 + k * (Lx - 0.4) / 8
            if all(abs(x - d) > 1.0 for d in DOOR_X):
                box((x, y, 1.4), (0.36, 0.08, 1.0), wall)
        for d in DOOR_X:
            for sx in (-1, 1):
                box((d + sx * 0.95, y, 1.05), (0.5, 0.1, 2.1), wall)  # 戸袋
                lf = boxc((d + sx * 0.33, y * 0.985, 1.0), (0.64, 0.05, 2.0), hexc('#c8ccd0'))
                w_ = boxc((0, -side * 0.03, 0.35), (0.4, 0.01, 0.7), hexc('#9fb6c8')); w_.parent = lf
                leaves.append((lf, sx, d))
        # 長いす
        for a_, b_ in _segs(-Lx / 2 + 0.6, Lx / 2 - 0.6, DOOR_X, 0.9):
            box(((a_ + b_) / 2, side * 1.18, 0.22), (b_ - a_, 0.5, 0.44), hexc('#3a5a8a'))
            box(((a_ + b_) / 2, side * 1.37, 0.66), (b_ - a_, 0.1, 0.45), hexc('#3a5a8a'))
        # 網棚とつり革
        box((0, side * 1.15, 1.95), (Lx - 1, 0.35, 0.03), hexc('#b9bcc0'))
        cyl((0, side * 0.62, 2.0), 0.018, Lx - 1, hexc('#b9bcc0'), rot=(0, math.pi / 2, 0))
        for k in range(22):
            x = -8 + k * 0.75
            box((x, side * 0.62, 1.88), (0.03, 0.012, 0.2), hexc('#f0f0f0'))
            bpy.ops.mesh.primitive_torus_add(location=(x, side * 0.62, 1.74), major_radius=0.065, minor_radius=0.012, rotation=(math.pi / 2, 0, math.pi / 2))
            setmat(bpy.context.object, hexc('#f4f4f2'))
    for x in (-7, -2, 2, 7):
        cyl((x, 0.95, Hh / 2), 0.02, Hh, hexc('#c8ccd0'))
        cyl((x, -0.95, Hh / 2), 0.02, Hh, hexc('#c8ccd0'))
    if doors_open is not None:
        for lf, sx, d in leaves:
            lf.keyframe_insert('location', frame=1); lf.keyframe_insert('location', frame=doors_open)
            lf.location.x = d + sx * 0.98; lf.keyframe_insert('location', frame=doors_open + 14)
    if moving:
        city_strip(n, 9.0, side=1, seed=seed, night=night)
        city_strip(n, 9.0, side=-1, seed=seed + 7, night=night)
    else:
        for side in (1, -1):
            box((0, side * 4.2, 0.0), (60, 5, 0.1), hexc('#c9c4ba'))  # ホーム
            box((0, side * 1.95, 0.0), (60, 0.25, 0.11), hexc('#f2d24b'))
            box((0, side * 8.0, 2), (60, 0.2, 4), hexc('#d8d2c4'))
            for x in (-12, -4, 4, 12):
                cyl((x, side * 5.5, 1.6), 0.1, 3.2, hexc('#8c8a86'))
    if ground_on:
        ground(rgb=hexc('#262a33') if night else hexc('#a9a294'))
    rnd = random.Random(seed)
    standing, sitting = [], []
    xs = sorted(rnd.uniform(-7.5, 7.5) for _ in range(stand))
    for i, x in enumerate(xs):
        y = rnd.choice([-0.5, 0.5]) + rnd.uniform(-0.1, 0.1)
        if avoid and avoid(x, y):
            continue
        p = crowd_person((x, y, 0), rnd, rot_z=(math.pi if y < 0 else 0) + rnd.uniform(-0.3, 0.3), name=f'st{i}')
        if rnd.random() < 0.7:
            arm_up(p, 0 if y < 0 else 1)
        standing.append(p)
    seats = [x for a_, b_ in _segs(-8.1, 8.1, DOOR_X, 1.0) for x in [a_ + 0.3 + k * 0.62 for k in range(int((b_ - a_) / 0.62))]]
    for side in (1, -1):
        for x in seats:
            if rnd.random() < 0.25 or (avoid and avoid(x, side * 1.05)):
                continue
            p = crowd_person((x + rnd.uniform(-0.05, 0.05), side * 1.08, 0), rnd, pose='sit', rot_z=0 if side > 0 else math.pi, name=f'si{len(sitting)}')
            sitting.append(p)
            if len(sitting) >= sit:
                break
    if glow:
        for p in standing + sitting:
            hearts(p, n, bpm=(bpm[0] + rnd.uniform(-6, 6), bpm[1] + rnd.uniform(-6, 6)), size=0.9)
    return standing, sitting, leaves


def hosp_room(w=8, d=6, h=2.7, window=True, night=False):
    sky(hexc('#1b2236') if night else hexc('#d6d1c8')); s = bpy.context.scene
    s.view_settings.exposure = 0.05 if night else 0.45
    light_dir((0.2, -0.3, 0.9))
    room(w, d, h, floor=hexc('#d9d6cf'), wall=hexc('#eef1f0'), window=window, night=night)


def hosp_bed(loc, rot_z=0.0, patient=None, rnd=None, sit_up=False, name='pt'):
    """病院のベッド（頭は +y 側）。patient の色を渡すと寝ている人を置く"""
    root = empty(loc, 'hbed'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0.35), (1.0, 2.0, 0.12), hexc('#c8ccd0')), root)
    link(box((0, 0, 0.47), (0.96, 1.96, 0.12), hexc('#f4f4f2')), root)
    link(box((0, 0.98, 0.7), (1.0, 0.06, 0.6), hexc('#a9b4bc')), root)
    for sx in (-0.45, 0.45):
        for sy in (-0.9, 0.9):
            link(cyl((sx, sy, 0.17), 0.025, 0.34, hexc('#9aa0a6')), root)
    p = None
    if patient is not None:
        if sit_up:
            p = person((0, 0.55, 0.12), patient, pose='sit', rot_z=0, name=name)
        else:
            p = person((0, 0.25, 0.48), patient, pose='lie', rot_z=math.pi, name=name)
        p.parent = root
        if sit_up:
            link(box((0, -0.25, 0.6), (0.92, 1.0, 0.08), hexc('#b8cde0'), bevel=0.03), root)  # 掛け布団
        else:
            link(box((0, -0.3, 0.76), (0.94, 1.4, 0.06), hexc('#b8cde0'), bevel=0.03), root)
    return root, p


def stethoscope(loc, rot_z=0.0):
    root = empty(loc, 'steth'); root.rotation_euler = (0, 0, rot_z)
    link(cyl((0, 0, 0), 0.028, 0.012, hexc('#c0c4c8'), rot=(math.pi / 2, 0, 0)), root)
    link(cyl((0, 0.12, 0.12), 0.006, 0.3, hexc('#2a2a2a'), rot=(-0.8, 0, 0)), root)
    return root


def doctor(loc, rot_z=0.0, name='doc', act=None, pose='stand'):
    p = person(loc, hexc('#ffffff'), pants=hexc('#6a8fb0'), rot_z=rot_z, name=name, act=act, pose=pose)
    return p


def nurse(loc, rot_z=0.0, name='nurse', act=None):
    return person(loc, hexc('#9ccbd8'), pants=hexc('#9ccbd8'), rot_z=rot_z, name=name, act=act)


def iv_pole(loc, parent=None):
    root = empty(loc, 'iv')
    link(cyl((0, 0, 0.9), 0.015, 1.8, hexc('#c0c4c8')), root)
    link(box((0, 0, 1.75), (0.12, 0.04, 0.2), hexc('#e8f0f4')), root)
    for a in range(4):
        link(cyl((0.12 * math.cos(a * math.pi / 2), 0.12 * math.sin(a * math.pi / 2), 0.05), 0.03, 0.03, hexc('#3a3a3a')), root)
    if parent is not None:
        root.parent = parent
    return root



def particles_flow(n, starts, ends, rgb=(0.85, 0.95, 1.0), size=0.025, period=60, seed=1, a=0.9):
    """小さな光の粒が starts から ends へ流れる（くり返し）"""
    rnd = random.Random(seed)
    out = []
    for i, (p0, p1) in enumerate(zip(starts, ends)):
        o = ball(p0, size, rgb, a=a, seg=8, name='pt')
        off = rnd.randint(0, period)
        for f in range(1 - off, n + period, period):
            o.location = p0; o.keyframe_insert('location', frame=max(1, f))
            if f + period - 1 >= 1:
                o.location = p1; o.keyframe_insert('location', frame=max(2, f + period - 1))
        out.append(o)
    return out


def truck(loc, rot_z=0.0, c=hexc('#f2f2ee'), cargo=hexc('#d9c08a')):
    root = empty(loc, 'truck'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, -1.9, 1.1), (2.0, 1.4, 1.8), hexc('#3a6aa0'), bevel=0.08), root)
    link(box((0, -2.58, 1.45), (1.8, 0.04, 0.7), hexc('#4d5d6b')), root)
    link(box((0, 1.0, 1.4), (2.2, 4.2, 2.2), c, bevel=0.04), root)
    for sx in (-1.0, 1.0):
        for sy in (-1.9, 0.0, 2.2):
            link(cyl((sx, sy, 0.45), 0.45, 0.3, hexc('#1e1e1e'), rot=(0, math.pi / 2, 0)), root)
    for k in range(3):
        link(box((0, 0.0 + k * 1.2, 2.7), (1.6, 0.9, 0.4), cargo), root)
    return root


def rock(loc, r=1.0, c=hexc('#6a6a6a'), seed=1):
    rnd = random.Random(seed)
    return sphere(loc, r, c, scale=(rnd.uniform(1.0, 1.6), rnd.uniform(0.9, 1.3), rnd.uniform(0.5, 0.8)), seg=10)


# ---------------- 屋外の環境 ----------------
def meadow(rgb=hexc('#8fb06a'), sky_c=hexc('#9cc3e3'), exp=0.4):
    sky(sky_c); s = bpy.context.scene; s.view_settings.exposure = exp
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.5
    ground(rgb=rgb)


def fence_line(x0, x1, y, h=1.1, c=hexc('#e8e2d6')):
    box(((x0 + x1) / 2, y, h * 0.85), (abs(x1 - x0), 0.08, 0.08), c)
    box(((x0 + x1) / 2, y, h * 0.45), (abs(x1 - x0), 0.08, 0.08), c)
    x = min(x0, x1)
    while x <= max(x0, x1):
        box((x, y, h / 2), (0.12, 0.12, h), c); x += 2.0



def mountain(loc, r, h, c=hexc('#7a8a50')):
    return cone(loc, r, h, c, verts=24)
