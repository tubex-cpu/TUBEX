"""カット：SCENE 06〜10（章5〜9）。人はいつも布にくるまっている（fk.py の先頭の決まり）"""
from fs1 import *
from shots_v5 import space_globe, P
from kit import _osc


def day_street(seed=41, bare=True):
    setup('#a8c8e4', 0.45, (0.5, -0.5, 0.7), 0.45)
    ground(rgb=hexc('#b9b2a2'))
    box((0, 0, 0.01), (90, 6, 0.02), hexc('#8b8680'))
    street_houses(6, seed=seed, y=6.2, curtains=not bare, bare=bare, x0=-18)
    for x in (-21, -6, 9, 22):
        tree((x, -4.2, 0), s=0.8)


def crowd_wrapped(n, k, xr, yr, seed=1, walk=0.0, bag=False, band=None, styles=('wrap',), heading=None):
    """布にくるまった人たち（walk>0 なら x 方向へ歩く）"""
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        x = rnd.uniform(*xr); y = rnd.uniform(*yr)
        d = rnd.choice([-1, 1]) if heading is None else heading
        st = rnd.choice(styles)
        p = wrapped_person((x, y, 0), style=st, rot_z=(-math.pi / 2 if d > 0 else math.pi / 2) + rnd.uniform(-0.2, 0.2),
                           name=f'c{i}', n=n, seed=seed * 100 + i, bag=bag, band=band if band != 'mix' else rnd.choice(['blue', 'white', 'red', None, None]))
        if walk:
            p.keyframe_insert('location', frame=1)
            p.location.x += d * walk * n / FPS * rnd.uniform(0.8, 1.1); p.keyframe_insert('location', frame=n)
            linear(p, 'location')
        out.append(p)
    return out


# ---------------- SCENE 06 空っぽの布売り場（章5） ----------------
def fStepOut(n):  # 二日目。布を巻いた人たちが、少しずつ外に出てくる
    day_street(41, bare=True)
    rnd = random.Random(5)
    for i in range(5):
        x = -18 + i * 7.5 + 1.8
        p = wrapped_person((x, 3.0, 0), rot_z=rnd.uniform(-0.4, 0.4), name=f'o{i}', n=n, seed=50 + i)
        f = 1 + i * int(n * 0.12)
        p.keyframe_insert('location', frame=f)
        p.location = (x + rnd.uniform(-1.5, 1.5), 0.6 + rnd.uniform(-0.8, 0.8), 0); p.keyframe_insert('location', frame=f + int(n * 0.45))
        appear(p, f)
        h = O[p['head']]
        h.keyframe_insert('rotation_euler', frame=f + int(n * 0.45))
        h.rotation_euler = (0, 0, rnd.choice([-0.6, 0.6])); h.keyframe_insert('rotation_euler', frame=f + int(n * 0.45) + 12)
    cam = camera(30)
    cam_path(cam, [(0, (-7, -3.2, 2.0), (-3, 2.5, 1.1)), (1, (-2, -3.2, 1.9), (2, 2.5, 1.1))], n)
    return MB('day')


def home_center():
    """ホームセンターの外観（字のない看板）"""
    box((0, 12, 4), (36, 14, 8), hexc('#e8e4da'))
    box((0, 4.96, 7.0), (36, 0.08, 1.6), hexc('#e07a2a'))
    box((0, 4.9, 7.0), (10, 0.06, 1.0), hexc('#f4efe6'))
    glass((-6, 4.95, 1.6), (6, 0.08, 3.2), a=0.25, rgb=(0.4, 0.5, 0.6))
    box((-6, 5.3, 1.6), (6, 0.1, 3.2), hexc('#5a6470'))
    for x in range(-16, 18, 4):
        cyl((x, 3.2, 3.0), 0.12, 6.0, hexc('#c8c4bc'))
    box((0, 3.6, 6.05), (36, 3.4, 0.12), hexc('#d8d2c4'))


def fQueue(n):  # ホームセンターの前に、行列ができる
    setup('#a8c8e4', 0.45, (0.5, -0.5, 0.7), 0.45)
    ground(rgb=hexc('#b8b2a6'))
    home_center()
    rnd = random.Random(6)
    ppl = []
    for i in range(14):
        p = wrapped_person((-8.5 + i * 0.95, 3.6 if i < 9 else 3.6 - (i - 8) * 0.9, 0), rot_z=math.pi / 2 if i < 9 else 0.0,
                           name=f'q{i}', n=n, seed=60 + i)
        if i >= 9:
            p.location.x = -8.5 + 8 * 0.95 + 0.9
            p.rotation_euler.z = math.pi
        ppl.append(p)
    # 列が少しずつ進む
    for i, p in enumerate(ppl):
        p.keyframe_insert('location', frame=1)
        f = int(n * 0.45)
        p.keyframe_insert('location', frame=f)
        if i < 9:
            p.location.x -= 0.6
        else:
            p.location.y += 0.6
        p.keyframe_insert('location', frame=f + 30)
    cam = camera(30)
    cam_path(cam, [(0, (3.5, -4.5, 2.2), (-2.5, 3.6, 1.2)), (1, (1.5, -5.0, 2.0), (-3.5, 3.6, 1.2))], n)
    return MB('city')


def store_aisle(n, f0, f1, seed=7, people=3):
    """売り場の通路：左右の棚に布団・カーテン・バスタオル。f0〜f1 で布の物から順に棚が空になる"""
    setup('#e6e6e2', 0.5, (0.3, -0.3, 0.9), 0.3)
    box((0, 0, -0.05), (10, 24, 0.1), hexc('#d8d8d2'))
    box((0, 0, 4.0), (10, 24, 0.1), hexc('#f4f4f2'))
    for k in range(6):
        box((0, -9 + k * 4, 3.9), (3, 0.3, 0.06), hexc('#ffffff'))
    rnd = random.Random(seed)
    items = []
    for side in (-1, 1):
        x = side * 1.6
        box((x + side * 0.35, 0, 1.2), (0.06, 20, 2.4), hexc('#c8ccd0'))
        for lvl in range(4):
            box((x, 0, 0.12 + lvl * 0.55), (0.7, 20, 0.04), hexc('#c8ccd0'))
        for j in range(-9, 10):
            kind = ['futon', 'curtain', 'towel'][(j + 9) // 7 % 3] if side < 0 else ['towel', 'futon', 'curtain'][(j + 9) // 7 % 3]
            for lvl in range(4):
                z = 0.14 + lvl * 0.55
                if kind == 'futon':
                    cl = rnd.choice([FUTON, ('quilt', '#c87a7a', '#f6e8e8', 3), ('quilt', '#e8b04a', '#fff4d8', 3)])
                    o = setcloth(box((x, j * 1.0, z + 0.2), (0.6, 0.9, 0.4), (1, 1, 1), bevel=0.06), cloth_mat(*cl))
                elif kind == 'curtain':
                    o = setcloth(box((x, j * 1.0, z + 0.1), (0.5, 0.8, 0.2), (1, 1, 1), bevel=0.02), cloth_mat(*rnd.choice(CLOTHS)))
                else:
                    o = setcloth(box((x, j * 1.0, z + 0.15), (0.45, 0.6, 0.3), (1, 1, 1), bevel=0.03), cloth_mat(*rnd.choice(TOWELS_C)))
                items.append(o)
    rnd.shuffle(items)
    for i, o in enumerate(items):
        vanish(o, int(f0 + (f1 - f0) * i / len(items)))
    ppl = crowd_wrapped(n, people, (-0.6, 0.6), (-6, 4), seed=seed + 3)
    for p in ppl:
        p.keyframe_insert('location', frame=1)
        p.location.y += rnd.uniform(1.5, 3.0); p.keyframe_insert('location', frame=n)
        p.rotation_euler.z = math.pi
    return items


def fAisle(n):  # 布団、カーテン、バスタオル
    store_aisle(n, int(n * 0.3), n * 3)
    cam = camera(30)
    cam_path(cam, [(0, (-0.5, -10, 1.7), (0.0, 2, 1.0)), (1, (0.3, -8.5, 1.7), (0.0, 3, 1.0))], n)
    return MB('room')


def fShelvesEmpty(n):  # 布でできた物から、棚が空になっていく
    store_aisle(n, 1, int(n * 0.85), seed=8, people=2)
    cam = camera(26)
    cam_path(cam, [(0, (1.2, -9, 3.4), (-1.2, 2, 0.9)), (1, (0.8, -6.5, 3.2), (-1.2, 4, 0.9))], n)
    return MB('room')


def fFabricRolls(n):  # 手芸店の布地も、ひと巻き残らず、なくなる
    setup('#efe6d6', 0.5, (0.3, -0.4, 0.85), 0.35)
    room(6, 5, 2.8, floor=hexc('#c8b090'), wall=hexc('#f4efe6'), window=False)
    rnd = random.Random(9)
    rolls = []
    for lvl in range(3):
        box((0, 2.0, 0.4 + lvl * 0.6), (4.4, 0.7, 0.04), hexc('#a77d55'))
        for k in range(14):
            o = setcloth(cyl((-2.0 + k * 0.3, 2.0, 0.53 + lvl * 0.6), 0.12, 0.65, (1, 1, 1), rot=(math.pi / 2, 0, 0), verts=14),
                         cloth_mat(*rnd.choice(CLOTHS + TOWELS_C[:2])))
            rolls.append(o)
    box((0, 2.42, 1.0), (4.5, 0.1, 2.0), hexc('#8a6a4a'))
    order = list(range(len(rolls))); rnd.shuffle(order)
    for i, j in enumerate(order):
        vanish(rolls[j], 1 + int(n * 0.85 * i / len(rolls)))
    p = wrapped_person((1.9, 0.9, 0), rot_z=math.pi * 0.75, name='shop', n=n, seed=91)
    cam = camera(30)
    cam_path(cam, [(0, (-0.8, -2.2, 1.4), (0, 2.0, 0.9)), (1, (-0.4, -1.8, 1.35), (0, 2.0, 0.9))], n)
    return MB('room')


# ---------------- SCENE 07 誰が、警察官？（章6） ----------------
def cross_scene(n, raise_at=None, band_at=None, onlookers=True, seed=70, cars_go=None):
    setup('#a8c8e4', 0.45, (0.5, -0.5, 0.7), 0.5)
    crossing(seed=5)
    rnd = random.Random(seed)
    cars = []
    for (x, y, rz) in ((-9.5, -2.2, -math.pi / 2), (-14.5, -2.2, -math.pi / 2), (9.5, 2.2, math.pi / 2), (2.2, -10, 0.0), (-2.2, 10.0, math.pi)):
        c = car((x, y, 0), rot_z=rz, c=rnd.choice([hexc('#d84a3a'), hexc('#3a6aa0'), hexc('#f2f2ee'), hexc('#2a2a2a'), hexc('#e8c040')]))
        if cars_go:
            c.keyframe_insert('location', frame=cars_go)
            dx = -math.sin(rz) * -14 if False else 0
            v = Vector((0, -1, 0)); v.rotate(Euler((0, 0, rz)))
            c.location = tuple(Vector(c.location) + v * 16); c.keyframe_insert('location', frame=n)
        cars.append(c)
    cop = wrapped_person((0, 0, 0), cloth=('hstripe', '#7a8a9a', '#d8dee4', 3), rot_z=math.pi / 2 - 0.3, name='cop', n=n,
                         band='blue' if band_at else None, band_at=band_at, seed=7)
    if raise_at is not None:
        arm_to(cop, 1, (0.05, -0.05, 2.15), f=raise_at)
    ppl = []
    if onlookers:
        for i, (x, y) in enumerate(((-6.5, -7.0), (-7.4, -6.4), (6.6, -7.2), (7.3, -6.3), (-6.8, 6.8), (6.9, 7.1))):
            p = wrapped_person((x, y, 0), rot_z=math.atan2(x, -y) + math.pi, name=f'on{i}', n=n, seed=seed + i)
            ppl.append(p)
    return cop, ppl, cars


def tilt(p, f, roll=0.3, hold=40):
    h = O[p['head']]
    h.keyframe_insert('rotation_euler', frame=f)
    h.rotation_euler = (0.05, roll, 0); h.keyframe_insert('rotation_euler', frame=f + 10)
    h.keyframe_insert('rotation_euler', frame=f + 10 + hold)
    h.rotation_euler = (0, 0, 0); h.keyframe_insert('rotation_euler', frame=f + 20 + hold)


def fCrossStop(n):  # 交差点で、布を巻いた人が、手を挙げて、車を止めている
    cop, ppl, cars = cross_scene(n, raise_at=int(n * 0.15))
    cam = camera(32)
    cam_path(cam, [(0, (-4.5, -9.0, 3.2), (0, 0, 1.2)), (1, (-2.5, -8.0, 2.6), (0, 0, 1.3))], n)
    return MB('city')


def fPuzzled(n):  # その人が警察官なのかどうか、誰にも分からない（首をかしげる人々）
    cop, ppl, cars = cross_scene(n, raise_at=1)
    for i, p in enumerate(ppl):
        tilt(p, int(n * 0.15) + i * 9, roll=random.Random(i).choice([-0.35, 0.35]), hold=int(n * 0.45))
    cam = camera(35)
    cam_path(cam, [(0, (-2.0, -5.0, 1.6), (-6.9, -6.8, 1.35)), (1, (-2.4, -4.6, 1.6), (-6.9, -6.6, 1.35))], n)
    return MB('city')


HOSP = ('plain', '#b4c4c8', '#b4c4c8', 1)   # 病院の人たちの同じような布（白い腕の布が見えるよう、少し色のある布）


def corridor(L=22, night=False):
    setup('#e6e8e4', 0.5, (0.2, -0.3, 0.9), 0.3)
    box((0, 0, -0.05), (3.2, L, 0.1), hexc('#d9d6cf'))
    box((0, 0, 2.75), (3.2, L, 0.1), hexc('#f4f4f2'))
    for sx in (-1, 1):
        box((sx * 1.6, 0, 1.4), (0.1, L, 2.8), hexc('#eef1f0'))
        box((sx * 1.53, 0, 0.9), (0.05, L, 0.06), hexc('#b8a888'))   # 手すり
        for k in range(-int(L / 2) + 2, int(L / 2) - 1, 4):
            box((sx * 1.56, k, 1.05), (0.04, 1.1, 2.1), hexc('#c8d8e0'))
    for k in range(-int(L / 2) + 1, int(L / 2), 3):
        box((0, k, 2.68), (0.8, 0.3, 0.04), hexc('#ffffff'))
    box((0, L / 2, 1.4), (3.2, 0.1, 2.8), hexc('#dfe6e8'))


def fHospCorr(n, band_at=None):  # 病院では、誰が看護師なのか（同じような布を巻いた人たち）
    corridor()
    rnd = random.Random(80)
    ppl = []
    for i in range(6):
        y = -4 + i * 2.4 + rnd.uniform(-0.5, 0.5); x = rnd.choice([-0.6, 0.0, 0.6])
        d = rnd.choice([-1, 1])
        p = wrapped_person((x, y, 0), cloth=HOSP, rot_z=0 if d < 0 else math.pi, name=f'h{i}', n=n, seed=80 + i,
                           band='white' if (band_at and i == 1) else None, band_at=band_at)
        p.keyframe_insert('location', frame=1)
        p.location.y += d * rnd.uniform(1.5, 2.6); p.keyframe_insert('location', frame=n)
        linear(p, 'location')
        ppl.append(p)
    iv_pole((-0.9, 2.0, 0))
    cam = camera(30)
    cam_path(cam, [(0, (0.4, -9.5, 1.6), (0, 2, 1.3)), (1, (-0.2, -8.0, 1.6), (0, 3, 1.3))], n)
    return MB('room')


def platform_scene(n, band_at=None, seed=90):
    train_car(n, moving=False, stand=0, sit=0, seed=3, doors_open=None)
    rnd = random.Random(seed)
    ppl = []
    for i in range(6):
        x = -6 + i * 2.3 + rnd.uniform(-0.4, 0.4)
        p = wrapped_person((x, 3.0 + rnd.uniform(-0.3, 0.6), 0.05), cloth=('plain', '#c8c8c0', '#c8c8c0', 1),
                           rot_z=rnd.uniform(-0.6, 0.6) + (math.pi if rnd.random() < 0.3 else 0), name=f'pl{i}', n=n, seed=seed + i,
                           band='red' if (band_at and i == 2) else None, band_at=band_at)
        ppl.append(p)
    return ppl


def fPlatform(n):  # 駅では、誰が駅員なのか
    ppl = platform_scene(n)
    for i, p in enumerate(ppl[::2]):
        tilt(p, int(n * 0.2) + i * 10, roll=0.3, hold=30)
    cam = camera(28)
    cam_path(cam, [(0, (-9.0, 5.8, 1.7), (0, 2.5, 1.2)), (1, (-7.5, 6.0, 1.7), (2, 2.5, 1.2))], n)
    return MB('city')


def fUniforms(n):  # 制服は、着ている人の仕事をひと目で伝えるための服だった
    setup('#2a3248', 0.4, (0.3, -0.5, 0.8), 0.2)
    bpy.context.scene.display.shading.show_shadows = False
    specs = [('#22304a', '#22304a'), ('#f4f6f8', '#9ccbd8'), ('#2a3a5a', '#c83a3a')]
    for i, (c, cap) in enumerate(specs):
        hg = hanger((-1.3 + i * 1.3, 0, 2.2), name='hg')
        g = garment('jacket', hg, cloth=('plain', c, c, 1))
        cp = cyl((-1.3 + i * 1.3, 0, 2.42), 0.14, 0.12, hexc(cap), verts=20)
        cyl((-1.3 + i * 1.3, -0.04, 2.37), 0.16, 0.02, hexc(cap), verts=20)
        swing(hg, n, 0.05, seed=i)
        vanish(hg, int(n * 0.82) + i * 4)
        for o in [o for o in bpy.data.objects if o.name.startswith('cyl') and abs(o.location.x - (-1.3 + i * 1.3)) < 0.01 and o.location.z > 2.3]:
            vanish(o, int(n * 0.82) + i * 4)
    cam = camera(35)
    cam_path(cam, [(0, (0, -4.6, 1.9), (0, 0, 1.75)), (1, (0, -4.0, 1.85), (0, 0, 1.75))], n)
    return MB('silent')


def fSameWraps(n):  # 制服が消えて、町から仕事の目印が消えた
    day_street(43, bare=True)
    crowd_wrapped(n, 16, (-14, 14), (-2.4, 2.4), seed=9, walk=1.0)
    cam = camera(35)
    cam_path(cam, [(0, (-2, -10, 4.2), (0, 0, 0.9)), (1, (2, -9.5, 4.0), (3, 0, 0.9))], n)
    return MB('city')


# ---------------- SCENE 08 色の布を巻いた腕（章7） ----------------
def fBandBlue(n):  # 三日目。交差点の警察官が、腕に、青い布を巻く
    f = int(n * 0.3)
    cop, ppl, cars = cross_scene(n, raise_at=f + 30, band_at=f, onlookers=True, cars_go=int(n * 0.7))
    cam = camera(40)
    cam_path(cam, [(0, (-2.6, -3.6, 1.7), (0, 0, 1.45)), (0.6, (-2.2, -3.2, 1.6), (0, 0, 1.45)), (1, (-6, -9, 3.6), (0, 0, 1.0))], n)
    return MB('city')


def fBandWhite(n):  # 病院では、白い布
    fHospCorr(n, band_at=int(n * 0.12))
    cam = bpy.context.scene.camera
    cam.animation_data_clear()
    p = O['h1']
    y = p.location.y
    cam_path(cam, [(0, (0.9, -9.8, 1.7), (0.0, 0.0, 1.3)), (1, (0.6, -9.2, 1.7), (0.0, 0.5, 1.3))], n)
    return MB('room')


def fBandRed(n):  # 駅では、赤い布
    ppl = platform_scene(n, band_at=int(n * 0.12))
    p = ppl[2]
    p.rotation_euler.z = 2.4
    arm_to(p, 0, (-0.45, -0.4, 1.5), f=int(n * 0.35))
    x, y = p.location.x, p.location.y
    cam = camera(38)
    cam_path(cam, [(0, (x - 2.2, y + 3.0, 1.7), (x, y, 1.3)), (1, (x - 1.6, y + 2.6, 1.7), (x, y, 1.3))], n)
    return MB('city')


def fBandsLine(n):  # 一枚の布の色が、新しい制服になった
    setup('#dfe8f0', 0.5, (0.3, -0.5, 0.8), 0.3)
    ground(rgb=hexc('#d8d4cc'))
    box((0, 3, 1.5), (12, 0.2, 3), hexc('#eef0f2'))
    specs = [('blue', ('hstripe', '#7a8a9a', '#d8dee4', 3)), ('white', HOSP), ('red', ('plain', '#c8c8c0', '#c8c8c0', 1))]
    for i, (b, cl) in enumerate(specs):
        p = wrapped_person((-1.4 + i * 1.4, 0, 0), cloth=cl, band=b, rot_z=0.25, name=f'b{i}', n=n, seed=110 + i)
    cam = camera(35)
    cam_path(cam, [(0, (-2.4, -4.6, 1.7), (-0.3, 0, 1.3)), (1, (2.0, -4.6, 1.7), (0.3, 0, 1.3))], n)
    return MB('day')


# ---------------- SCENE 09 ポケットのない暮らし（章8） ----------------
def phone(loc, parent=None):
    o = box(loc, (0.075, 0.012, 0.15), hexc('#2a2a2e'), bevel=0.008)
    if parent is not None:
        link(o, parent)
    return o


def carry_items(p, f_drop=None):
    """両手にスマホ・財布・鍵（手が、ふさがる）"""
    arm_to(p, 0, (-0.12, -0.36, 1.08)); arm_to(p, 0, (0.12, -0.36, 1.08))
    rig = O[p['rig']]
    hold = empty((0, -0.42, 1.06), 'hold'); link(hold, rig)
    a = phone((-0.13, 0, 0.06), hold)
    b = link(box((0.13, 0, 0.03), (0.12, 0.03, 0.09), hexc('#8a4a2a'), bevel=0.01), hold)
    keys = empty((0.02, 0.0, 0.12), 'keys'); link(keys, hold)
    bpy.ops.mesh.primitive_torus_add(location=(0, 0, 0), major_radius=0.025, minor_radius=0.004, rotation=(math.pi / 2, 0, 0))
    t = bpy.context.object; setmat(t, hexc('#c8c8c0')); link(t, keys)
    for k in range(2):
        link(box((0.01 * k - 0.005, 0, -0.04), (0.01, 0.003, 0.04), hexc('#d8c070')), keys)
    return hold, [a, b, keys]


def fStreetOut(n):  # 外に出ると、困ることが、もう一つある
    day_street(44, bare=True)
    p = wrapped_person((-14.2, 3.2, 0), rot_z=0.0, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'), seed=3)
    p.keyframe_insert('location', frame=1)
    p.location = (-13.4, 0.4, 0); p.keyframe_insert('location', frame=int(n * 0.6))
    crowd_wrapped(n, 6, (-22, -4), (-2, 2), seed=12, walk=0.9)
    cam = camera(30)
    cam_path(cam, [(0, (-12.0, -6.0, 1.8), (-14, 2.2, 1.2)), (1, (-11.6, -5.0, 1.7), (-13.6, 1.0, 1.2))], n)
    return MB('city')


def fJuggle(n):  # ポケットがない。スマホと、財布と、鍵
    day_street(44, bare=True)
    p = wrapped_person((0, 0, 0), rot_z=0.0, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'), seed=3)
    h = O[p['head']]
    h.rotation_euler = (0.3, 0, 0)
    hold, items = carry_items(p)
    rnd = random.Random(4)
    for i, it in enumerate(items):  # 落としそうになって持ち直す
        it.keyframe_insert('location', frame=1)
        for f in range(10 + i * 11, n, 34):
            it.keyframe_insert('location', frame=f)
            it.location.z += 0.08; it.keyframe_insert('location', frame=f + 6)
            it.location.z -= 0.08; it.keyframe_insert('location', frame=f + 12)
    _osc(hold, 'rotation_euler', 1, 0, 0.08, 20, n, rnd)
    cam = camera(45)
    cam_path(cam, [(0, (0.6, -2.4, 1.5), (0, 0, 1.15)), (1, (0.3, -2.0, 1.45), (0, 0, 1.15))], n)
    return MB('city')


def fDoorStuck(n):  # 両手がふさがって、ドアが開けられない
    setup('#a8c8e4', 0.45, (0.5, -0.5, 0.7), 0.45)
    ground(rgb=hexc('#b9b2a2'))
    box((0, 1.0, 1.5), (6, 0.2, 3.0), hexc('#e6dccb'))
    d, lf = door((0, 0.9, 0), c='#6a5040')
    p = wrapped_person((0.15, -0.35, 0), rot_z=math.pi, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'), seed=3)
    hold, items = carry_items(p)
    # ひじでノブを押そうとして、何度も体を寄せる
    c = empty((0.15, -0.35, 0), 'carry'); p.location = (0, 0, 0); p.parent = c
    for f in range(1, n, 30):
        c.location.y = -0.35; c.keyframe_insert('location', index=1, frame=f)
        c.location.y = -0.2; c.keyframe_insert('location', index=1, frame=f + 10)
        c.rotation_euler.z = 0.0; c.keyframe_insert('rotation_euler', index=2, frame=f)
        c.rotation_euler.z = 0.35; c.keyframe_insert('rotation_euler', index=2, frame=f + 12)
        c.rotation_euler.z = 0.0; c.keyframe_insert('rotation_euler', index=2, frame=f + 26)
    cam = camera(32)
    cam_path(cam, [(0, (2.4, -0.3, 1.6), (0.0, 0.1, 1.1)), (1, (2.1, -0.6, 1.55), (0.0, 0.1, 1.1))], n)
    return MB('city')


def fBagOn(n):  # 誰かが、買い物袋を、肩から斜めにかける
    day_street(44, bare=True)
    f = int(n * 0.3)
    p = wrapped_person((0, 0, 0), rot_z=-0.2, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'), seed=3, bag=hexc('#c8a878'), bag_at=f)
    hold, items = carry_items(p)
    for i, it in enumerate(items):
        vanish(it, f + 20 + i * 10)
    crowd_wrapped(n, 3, (-6, 6), (1.6, 2.6), seed=13, walk=0.6)
    cam = camera(40)
    cam_path(cam, [(0, (0.5, -2.8, 1.55), (0, 0, 1.15)), (1, (0.8, -2.5, 1.5), (0, 0, 1.15))], n)
    return MB('city')


def fBagsTown(n):  # 次の日には、町中の人が、同じ格好をしている
    day_street(45, bare=True)
    crowd_wrapped(n, 18, (-14, 14), (-2.4, 2.4), seed=14, walk=1.0, bag=True)
    cam = camera(32)
    cam_path(cam, [(0, (-6, -10, 3.4), (0, 0, 1.0)), (1, (4, -10, 3.2), (6, 0, 1.0))], n)
    return MB('city')


# ---------------- SCENE 10 服は、どこで作られていたか（章9） ----------------
def clothing_store(n, f_vanish=None):
    setup('#f4f2ee', 0.55, (0.3, -0.3, 0.9), 0.3)
    room(10, 8, 3.0, floor=hexc('#d8d2c8'), wall=hexc('#f6f4f0'), window=False)
    rnd = random.Random(15)
    for r in range(3):
        y = -1.5 + r * 1.6
        for sx in (-1, 1):
            x = sx * 2.2
            for xx in (x - 0.9, x + 0.9):
                cyl((xx, y, 0.65), 0.02, 1.3, hexc('#b8bcc0'))
            cyl((x, y, 1.3), 0.02, 1.9, hexc('#b8bcc0'), rot=(0, math.pi / 2, 0))
            for k in range(6):
                hg = hanger((x - 0.75 + k * 0.3, y, 1.3), rot_z=math.pi / 2, name='hg')
                swing(hg, n, 0.03, seed=r * 20 + k)
                if f_vanish:
                    g = garment(rnd.choice(['shirt', 'jacket', 'coat']), hg, cloth=rnd.choice(CLOTHS))
                    vanish(g, f_vanish + rnd.randint(0, 20))
    for k in range(3):
        box((-4.0 + k * 0.01, 3.4, 0.4 + k * 0.6), (1.6, 0.6, 0.04), hexc('#c8b090'))
    for x in (-0.6, 0.6):
        mannequin((x, 3.0, 0), rot_z=0.0)


def fEmptyStore(n):  # 一週間後。服屋の棚は、空っぽのまま
    clothing_store(n)
    p = wrapped_person((1.7, -1.2, 0), rot_z=math.pi * 1.2, name='you', n=n, seed=3)
    cam = camera(28)
    cam_path(cam, [(0, (0.6, -3.8, 1.75), (0, 2, 1.1)), (1, (-0.2, -3.0, 1.7), (0, 2.5, 1.1))], n)
    return MB('room')


JAPAN = (138.5, 36.5)
SOURCES = [(116, 33), (108, 22), (90, 24), (104, 12), (96, 20), (110, -6), (101, 15), (78, 22), (122, 14), (12, 44), (32, 38)]


def fWorldArrows(n):  # 日本で売られていた服のほとんどは、海の向こうの工場で縫われていた（矢印は模式）
    setup('#0e1830', 0.45, (0.2, -0.2, 0.95), 0.0)
    s = bpy.context.scene; s.display.shading.light = 'FLAT'; s.display.shading.show_cavity = False
    Wm = 72.0
    map_plane((0, 0, 0), Wm)
    jx, jy = lonlat_xy(*JAPAN, Wm)
    ball((jx, jy, 0.15), 0.35, (1.0, 0.85, 0.3), seg=16, name='jp')
    for i, (lon, lat) in enumerate(SOURCES):
        x, y = lonlat_xy(lon, lat, Wm)
        sphere((x, y, 0.05), 0.18, hexc('#ffffff'), seg=10)
        f0 = int(n * 0.08) + i * int(n * 0.05)
        arrow_curve((x, y, 0.1), (jx - 0.2, jy - 0.1, 0.2), n, f0, f0 + 30, hexc('#f06a4a'), lift=1.2 + 0.08 * abs(x - jx), r=0.07)
    cam = camera(35)
    cx, cy = lonlat_xy(105, 25, Wm)
    cam_path(cam, [(0, (cx + 4, cy - 26, 22), (cx + 2, cy, 0)), (1, (cx + 6, cy - 22, 19), (cx + 4, cy + 1, 0))], n)
    return MB('silent')


def fFactoryEmpty(n):  # その工場の服も、倉庫の服も、消えている
    setup('#e8e6e0', 0.5, (0.3, -0.3, 0.9), 0.35)
    box((0, 0, -0.05), (20, 14, 0.1), hexc('#b8b4aa'))
    box((0, 7, 3), (20, 0.2, 6), hexc('#e6e2d8')); box((-10, 0, 3), (0.2, 14, 6), hexc('#e6e2d8'))
    rnd = random.Random(16)
    f = int(n * 0.3)
    for r in range(3):
        for k in range(4):
            x = -6 + k * 2.2; y = -2 + r * 1.8
            worktable((x, y, 0), w=1.4, d=0.7)
            sewing_machine((x, y, 0.75), n=n, run=(1, 2))
            if (r + k) % 3 == 0:
                o = setcloth(box((x - 0.35, y, 0.8), (0.5, 0.4, 0.06), (1, 1, 1)), cloth_mat(*rnd.choice(CLOTHS)))
                vanish(o, f + rnd.randint(0, 20))
    # 服のかかった長いラックと、倉庫の箱の中の服
    for r in range(2):
        y = 4.2 + r * 1.3
        cyl((3.5, y, 1.6), 0.025, 7, hexc('#b8bcc0'), rot=(0, math.pi / 2, 0))
        for xx in (0.1, 6.9):
            cyl((xx, y, 0.8), 0.025, 1.6, hexc('#b8bcc0'))
        for k in range(18):
            hg = hanger((0.4 + k * 0.36, y, 1.6), rot_z=math.pi / 2, name='hg')
            g = garment(rnd.choice(['shirt', 'jacket']), hg, cloth=rnd.choice(CLOTHS))
            vanish(g, f + rnd.randint(0, 30))
            swing(hg, n, 0.0 if True else 0.1, seed=k, f0=f)
    for k in range(5):
        for l in range(2):
            box((-8.8, -4 + k * 1.6, 0.5 + l * 0.95), (1.2, 1.2, 0.9), hexc('#c8a878'))
    p = wrapped_person((1.4, 2.6, 0), rot_z=math.pi * 0.9, name='w1', n=n, seed=17)
    p = wrapped_person((-0.6, 2.8, 0), rot_z=math.pi * 1.1, name='w2', n=n, seed=18)
    cam = camera(28)
    cam_path(cam, [(0, (-4, -7.5, 3.4), (2, 3, 1.0)), (1, (-1.5, -7, 3.0), (3, 3.5, 1.0))], n)
    return MB('room')


def fGlobeMorning(n):  # 世界中の人が、同じ朝に、服を一枚も持っていない
    space_globe()
    cam = camera(40)
    cam_path(cam, [(0, P(80, 15, 20), (0, 0, 0)), (1, P(150, 22, 19), (0, 0, 0))], n)
    return MB('silent')


def fShip(n):  # 新しい服を縫っても、船が日本に着くまで、何週間もかかる
    setup('#a9cbe4', 0.45, (0.6, -0.3, 0.6), 0.4)
    sea('#3d6f9c')
    sh = container_ship((0, 0, 0), rot_z=0.0)
    sh.keyframe_insert('location', frame=1); sh.location.x = -8; sh.keyframe_insert('location', frame=n)
    linear(sh, 'location')
    rnd = random.Random(19)
    for i in range(30):  # 波
        w = box((rnd.uniform(-80, 60), rnd.uniform(-60, 60), 0.0), (rnd.uniform(1.5, 4), 0.25, 0.04), hexc('#cfe0ee'))
    cam = camera(30)
    cam_path(cam, [(0, (22, -34, 9), (0, 0, 2.5)), (1, (10, -36, 8), (-8, 0, 2.5))], n)
    return MB('sea')
