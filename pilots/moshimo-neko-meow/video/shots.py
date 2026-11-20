"""カット定義。各関数は n フレームのシーンを組み立て、音のための情報（meta）を返す。
meta = {'meows': [(frame, gain, pitch)], 'bed': 0..1（遠くの鳴き声の量）, 'ghost': bool, 'amb': 'day'|'night'|'room'|...}
"""
import math, random
from kit import *

R = random.Random(11)

def blink(o, n, period, phase=0):
    pr = bpy.context.preferences.edit
    old = pr.keyframe_new_interpolation_type
    pr.keyframe_new_interpolation_type = 'CONSTANT'
    for f in range(1, n + 1, period):
        o.scale = (1, 1, 1) if (f // period + phase) % 2 == 0 else (0, 0, 0)
        o.keyframe_insert('scale', frame=f)
    pr.keyframe_new_interpolation_type = old

# ---------------- 共通の環境 ----------------
def env_town(night=False, nx=7, ny=7, seed=2, cx=0, cy=0, skip=None):
    if night:
        sky(hexc('#0e1a33')); light_dir((0.2, -0.6, 0.5))
        bpy.context.scene.view_settings.exposure = -0.4
        bpy.context.scene.display.shading.shadow_intensity = 0.25
    else:
        sky(hexc('#8fb6dc')); light_dir((0.55, -0.45, 0.62))
        bpy.context.scene.view_settings.exposure = 0.35
        bpy.context.scene.display.shading.shadow_intensity = 0.55
    ground(rgb=hexc('#262a33') if night else hexc('#b9b2a2'))
    town_grid(cx, cy, nx, ny, 14, seed=seed, skip=skip)
    if night:
        lit_windows(0.45)

def lit_windows(p, seed=4):
    rnd = random.Random(seed)
    lit = mat(hexc('#ffcf73'))
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.data.materials and o.data.materials[0].name == str(tuple(round(c, 3) for c in hexc('#8aa3b8'))):
            if rnd.random() < p:
                o.data = o.data.copy(); o.data.materials[0] = lit

def add_meows(cats, n, every=(55, 100), gain=1.0, seed=1, dur=14):
    rnd = random.Random(seed); ev = []
    for i, c in enumerate(cats):
        fr = meow_times(n, every=every, start=(1, 40), rng=rnd)
        meow(c, fr, dur=dur)
        g = gain[i] if isinstance(gain, (list, tuple)) else gain
        p = rnd.uniform(0.85, 1.25)
        ev += [(f, g, p) for f in fr]
    return ev

def M(meows=None, bed=0.0, ghost=False, amb='day', silent_until=None, silent_from=None):
    return {'meows': meows or [], 'bed': bed, 'ghost': ghost, 'amb': amb,
            'silent_until': silent_until, 'silent_from': silent_from}

def living_room(night=False, wall=hexc('#efe7da')):
    sky(hexc('#1b2236') if night else hexc('#d9d2c4'))
    s = bpy.context.scene
    s.view_settings.exposure = -0.2 if night else 0.45
    s.display.shading.shadow_intensity = 0.4
    light_dir((0.3, 0.7, 0.6))
    room(7, 6, 2.6, window=True, night=night, wall=wall)
    sofa((-1.2, 1.9, 0), rot_z=0)
    table((-1.2, 0.6, 0), 1.0, 0.6, 0.4)
    box((2.4, 2.6, 0.45), (1.6, 0.4, 0.9), hexc('#8c6a4c'))  # 棚
    box((2.4, 2.55, 1.3), (1.2, 0.08, 0.7), hexc('#20232a'))  # テレビ
    plane((-0.6, 0.4, 0.003), (3.2, 2.4), hexc('#c9b9a0'))  # ラグ

# ---------------- 00 冒頭 ----------------
def s00a(n):
    env_town()
    cats = [cat((-0.5, -35.0, 0), 'tora', s=0.62, rot_z=0.2),
            cat((0.6, -32.9, 1.1), 'kuro', s=0.62, rot_z=0.0),
            cat((-3, -35.6, 0), 'mike', s=0.62, rot_z=-0.4)]
    f0 = int(3.3 * FPS)
    for c in cats:
        meow(c, [f0, f0 + 70, f0 + 150, f0 + 230])
    cam = camera(32)
    cam_path(cam, [(0, (60, -95, 70), (0, -10, 0)), (1, (35, -70, 42), (0, -18, 0))], n)
    return M([(f0, 1.0, 1.0)], bed=1.0, silent_until=f0)

def s00b(n):
    env_town()
    cats = [cat((0.6, -32.9, 1.1), 'kuro', s=0.62, rot_z=0.1),
            cat((-1.4, -34.6, 0), 'tora', s=0.62, rot_z=-0.5),
            cat((1.9, -35.4, 0), 'mike', s=0.62, rot_z=0.5, pose='crouch'),
            cat((-3.6, -33.9, 0), 'shiro', s=0.62, rot_z=0.2)]
    ev = add_meows(cats, n, every=(40, 70), gain=[0.8, 1.0, 0.9, 0.6])
    cam = camera(26, dof=3.0, fstop=2.4)
    cam_path(cam, [(0, (1.0, -37.0, 0.45), (-0.8, -33.9, 0.4)), (1, (-1.2, -36.9, 0.6), (-0.4, -33.8, 0.45))], n)
    return M(ev, bed=0.9)

def s00c(n):
    env_town(nx=9, ny=9)
    cats = [cat((-0.5, -21.6, 0), 'tora', s=0.62, pose='walk')]
    move(cats[0], [(1, (-0.5, -21.6, 0)), (n, (-0.5, -19.6, 0))])
    ev = add_meows(cats, n, gain=0.5)
    cam = camera(28)
    cam_path(cam, [(0, (2, -30, 2.5), (0, -18, 2)), (1, (40, -110, 95), (0, 0, 0))], n)
    return M(ev, bed=1.0)

def s00d(n):  # 眠れない人・病院・ネズミの予告（夜の寝室）
    env_bedroom(n, ghost=False)
    cam = camera(35, dof=2.2, fstop=2.0)
    cam_path(cam, [(0, (1.8, -2.2, 1.6), (0, 0.4, 0.5)), (1, (1.2, -1.6, 1.3), (0, 0.4, 0.5))], n)
    c = bpy.data.objects['bedcat']
    ev = add_meows([c], n, every=(45, 70))
    return M(ev, bed=0.4, amb='night')

def s00e(n):  # 街から消える生き物：夜の路地、ネズミが顔を出して引っこむ
    env_alley()
    rat = make_rat((0.6, 1.2, 0), rot_z=math.pi)
    peek(rat, n, start=int(n * 0.25))
    c = cat((-2.5, 4.5, 0), 'saba', s=0.62, rot_z=-2.6)
    ev = add_meows([c], n, every=(50, 80), gain=0.5)
    cam = camera(30, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (1.1, 0.1, 0.25), (0.5, 1.25, 0.08)), (1, (0.95, 0.35, 0.22), (0.5, 1.25, 0.08))], n)
    return M(ev, bed=0.5, amb='night')

def s00f(n):  # 勘違い：リビングで猫が飼い主を見上げる
    living_room()
    p = person((-1.2, 2.0, 0.0), hexc('#c7d3e0'), pose='sit', rot_z=math.pi)
    c = cat((-0.4, 1.0, 0), 'tora', s=0.62, rot_z=math.pi * 0.85, name='basecat')
    ev = add_meows([c], n, every=(50, 80))
    cam = camera(40, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (0.9, -0.6, 0.5), (-0.6, 1.4, 0.45)), (1, (0.5, -0.3, 0.45), (-0.6, 1.4, 0.55))], n)
    return M(ev, bed=0.3, amb='room')

# ---------------- 01 世界 ----------------
def s01a(n):
    sky(hexc('#03050c')); s = bpy.context.scene; s.view_settings.exposure = 0.2
    s.display.shading.show_shadows = False; s.display.shading.show_cavity = False
    s.display.shading.light = 'FLAT'
    g = globe((0, 0, 0), 6.0, tex='/home/user/work_neko/assets/earth_dn.png')
    # 星
    rnd = random.Random(3)
    for i in range(260):
        th = rnd.uniform(0, 2 * math.pi); ph = rnd.uniform(-1, 1)
        r = 120; x = r * math.cos(th) * math.sqrt(1 - ph * ph); y = r * math.sin(th) * math.sqrt(1 - ph * ph); z = r * ph
        sphere((x, y, z), rnd.uniform(0.08, 0.22), (0.9, 0.9, 1.0), seg=6)
    # UV球の経度の向き：経度 lon を x 軸からの角度に合わせる（テクスチャ左端=-180）
    g.rotation_euler = (0, 0, 0)
    cam = camera(50)
    def P(lon, lat, r):
        a = math.radians(lon); b = math.radians(lat)
        return (r * math.cos(b) * math.cos(a), r * math.cos(b) * math.sin(a), r * math.sin(b))
    cam_path(cam, [(0, P(150, 32, 27), (0, 0, 0)), (0.55, P(80, 35, 25), (0, 0, 0)), (1, P(10, 40, 25), (0, 0, 0))], n)
    # 猫のいる場所の光の点（陸の上に点を散らす）：既存テクスチャの都市光で代用
    return M([], bed=0.6, amb='space')

def s01b(n):  # 東京：留守の玄関
    sky(hexc('#d8d0c2')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    light_dir((0.3, -0.4, 0.8))
    box((0, 0, -0.05), (4, 5, 0.1), hexc('#b9a88e'))  # 廊下
    box((0, -1.6, -0.2), (1.6, 1.0, 0.1), hexc('#8d8a84'))  # 土間
    box((0, -2.15, 1.1), (1.0, 0.08, 2.2), hexc('#5a4636'))  # ドア
    box((0.36, -2.08, 1.05), (0.05, 0.08, 0.05), hexc('#c0b080'))
    box((-0.95, 0, 1.3), (0.1, 5, 2.6), hexc('#efe8dc'))
    box((0.95, 0, 1.3), (0.1, 5, 2.6), hexc('#efe8dc'))
    box((0.7, -1.2, 0.5), (0.4, 0.6, 1.0), hexc('#a4825f'))  # 靴箱
    for k in range(3):
        box((-0.3 + k * 0.25, -1.75, -0.12), (0.12, 0.28, 0.08), hexc('#3a3a3a'))
    c = cat((0, -0.6, 0), 'saba', s=0.62, rot_z=0)
    ev = add_meows([c], n, every=(50, 75))
    cam = camera(32, dof=1.6, fstop=2.0)
    cam_path(cam, [(0, (0.35, 1.6, 0.35), (0, -0.8, 0.3)), (1, (0.2, 0.9, 0.3), (0, -0.8, 0.3))], n)
    return M(ev, bed=0.2, amb='room')

def s01c(n):  # 北京：高層住宅
    sky(hexc('#c6cfd6')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    light_dir((0.4, -0.5, 0.6))
    ground(rgb=hexc('#a9a69c'))
    rnd = random.Random(5)
    for i in range(6):
        for j in range(4):
            tower((i * 26 - 65, j * 30 - 20, 0), 16, 12, rnd.uniform(60, 95), rnd.choice([hexc('#d9d3c7'), hexc('#cfc7b8'), hexc('#e2ddd3')]), floors=28)
    # 手前のベランダ列と猫
    cats = []
    for k in range(4):
        z = 10 + k * 3.0
        box((-14, -27, z), (3.0, 1.2, 0.15), hexc('#bcb6aa'))
        for zz in (0.35, 0.7, 1.0):
            box((-14, -27.55, z + zz), (3.0, 0.05, 0.04), hexc('#a0a7ad'))
        cats.append(cat((-14 + (k % 2) * 0.8 - 0.4, -27.1, z + 0.08), R.choice(['tora', 'shiro', 'kuro', 'saba']), s=0.62, rot_z=0.2))
    ev = add_meows(cats, n, every=(40, 70), gain=0.8)
    cam = camera(38)
    cam_path(cam, [(0, (-12.3, -29.6, 11.5), (-14.2, -27.1, 10.3)), (0.45, (-12.0, -30.0, 14.5), (-14.2, -27.1, 13.3)), (1, (-2, -70, 22), (-14, -20, 30))], n)
    return M(ev, bed=1.0, amb='city')

def env_istanbul(night=False):
    if night:
        sky(hexc('#0c1530')); bpy.context.scene.view_settings.exposure = -0.35
        light_dir((0.1, -0.6, 0.5)); bpy.context.scene.display.shading.shadow_intensity = 0.2
    else:
        sky(hexc('#9cc0e0')); bpy.context.scene.view_settings.exposure = 0.4
        light_dir((0.6, -0.3, 0.55))
    plane((0, -60, -0.5), (400, 120), hexc('#2b4a66') if not night else hexc('#0d1a2b'))  # 海
    rnd = random.Random(8)
    # 坂の町：段々に家を置く
    for row in range(9):
        z = row * 2.2; y = row * 7
        box((0, y + 3, z / 2 - 0.5), (140, 7.5, z + 1), hexc('#b8a68a') if not night else hexc('#2a2a33'))
        for i in range(14):
            x = -60 + i * 9 + rnd.uniform(-1, 1)
            h = rnd.uniform(6, 11)
            col = rnd.choice([hexc(c) for c in ['#e8c9a0', '#d9a383', '#e6d3b0', '#c98f6b', '#f0e0c0', '#b7a089']])
            b = box((x, y + 3.5, z + h / 2), (7.5, 5.5, h), col)
            box((x, y + 0.7, z + h * 0.6), (6.5, 0.1, 0.9), hexc('#ffcf73') if (night and rnd.random() < 0.5) else hexc('#6f8aa0'))
            roof((x, y + 3.5, z + h), 7.9, 5.9, 1.4, hexc('#b5553a'), rot_z=math.pi / 2)
    # モスク（ドームとミナレット）
    mz = 9 * 2.2
    box((10, 70, mz + 5), (24, 18, 10), hexc('#e2dccf') if not night else hexc('#3a3a46'))
    sphere((10, 70, mz + 10), 8.5, hexc('#9aa3a8') if not night else hexc('#40465a'), scale=(1, 1, 0.75))
    for sx in (-14, 34):
        cyl((sx, 70, mz + 15), 0.9, 30, hexc('#e8e2d6') if not night else hexc('#4a4a58'))
        cone((sx, 70, mz + 31.5), 1.0, 4, hexc('#7d878c'))
    # 船着き場
    box((-20, -6, -0.2), (30, 6, 0.6), hexc('#8c8378'))
    ferry = box((-22, -14, 0.6), (16, 5, 2.2), hexc('#f2f2ee'))
    box((-22, -14, 2.4), (10, 4, 1.6), hexc('#e0e0da'))

def s01d(n):  # イスタンブール：朝の坂道
    env_istanbul()
    rnd = random.Random(2)
    cats = []
    for i in range(10):
        x = -30 + i * 6 + rnd.uniform(-1, 1)
        row = rnd.choice([0, 1, 2]); y = row * 7 + 0.5; z = row * 2.2
        cats.append(cat((x, y, z), rnd.choice(['tora', 'saba', 'kuro', 'shiro', 'mike', 'hachi']), s=0.62, rot_z=rnd.uniform(-0.6, 0.6)))
    for i in range(6):
        walker = i % 2 == 0
        c = cat((-28 + i * 3.2, -5.5, 0.1), rnd.choice(['tora', 'saba', 'shiro']), s=0.62, rot_z=rnd.uniform(-1, 1), pose='walk' if walker else 'sit')
        if walker:
            x0 = c.location.x; d = rnd.choice([-1, 1]) * rnd.uniform(4, 7)
            move(c, [(1, (x0, -5.5, 0.1)), (n, (x0 + d, -5.5 + rnd.uniform(-0.6, 0.6), 0.1))])
        cats.append(c)
    for i in range(5):
        pp = person((-26 + i * 4.5, -4.2, 0.1), rnd.choice([hexc('#3d5a80'), hexc('#7a4f3a'), hexc('#4a6b4a'), hexc('#8a8a8a')]), rot_z=rnd.uniform(-0.5, 0.5))
        x0 = pp.location.x; d = rnd.choice([-1, 1]) * rnd.uniform(12, 18)
        move(pp, [(1, (x0, -4.2 + rnd.uniform(-0.8, 0.8), 0.1)), (n, (x0 + d, -4.2 + rnd.uniform(-0.8, 0.8), 0.1))])
    ev = add_meows(cats, n, every=(35, 70), gain=0.6)
    cam = camera(35)
    cam_path(cam, [(0, (-40, -40, 22), (0, 25, 8)), (1, (-15, -30, 6), (-18, -2, 2))], n)
    return M(ev, bed=1.0, amb='city')

def s01e(n):  # モスクワ：雪の窓辺
    sky(hexc('#c9d2dc')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    light_dir((0.3, -0.6, 0.5))
    ground(rgb=hexc('#eef1f4'))
    rnd = random.Random(4)
    for i in range(5):
        tower((i * 40 - 80, 40 + rnd.uniform(0, 30), 0), 34, 12, 27, hexc('#d6d0c6'), floors=9)
    # 手前の窓（室内から外を見る猫）
    box((0, 0, 1.0), (3.0, 0.3, 0.12), hexc('#f2f2f2'))  # 窓台（雪）
    box((0, 0.2, 3.45), (3.0, 0.3, 0.2), hexc('#e7e1d6'))  # 窓枠（上）
    box((0, 0.2, 2.2), (0.08, 0.1, 2.4), hexc('#e7e1d6'))  # 窓の桟
    box((-1.6, 0.0, 1.8), (0.2, 0.4, 3.6), hexc('#e7e1d6'))
    box((1.6, 0.0, 1.8), (0.2, 0.4, 3.6), hexc('#e7e1d6'))
    c = cat((0.25, -0.05, 1.06), 'saba', s=0.62, rot_z=math.pi * 1.1)
    for i in range(60):
        sphere((rnd.uniform(-6, 6), rnd.uniform(2, 20), rnd.uniform(0, 8)), 0.05, (1, 1, 1), seg=6)
    ev = add_meows([c], n, every=(45, 70))
    cam = camera(32)
    cam_path(cam, [(0, (1.0, -2.4, 1.55), (0.0, 6, 2.2)), (1, (0.5, -1.8, 1.45), (0.1, 6, 2.0))], n)
    return M(ev, bed=0.3, amb='room')

def s01f(n):  # ロンドン：夜明け前の長屋
    sky(hexc('#3a4a6a')); s = bpy.context.scene; s.view_settings.exposure = 0.0
    light_dir((0.1, -0.7, 0.3)); s.display.shading.shadow_intensity = 0.3
    ground(rgb=hexc('#4a4a50'))
    rnd = random.Random(6)
    for i in range(14):
        x = i * 6.2 - 40
        tower((x, 8, 0), 6.0, 9, 10, rnd.choice([hexc('#8a5a45'), hexc('#9a6a52'), hexc('#7d5040')]), floors=3, lit=0.15)
        roof((x, 8, 10), 6.2, 9.4, 2.5, hexc('#3c3f48'), rot_z=0)
        box((x, 3.4, 0.25), (6.0, 0.2, 0.5), hexc('#2a2a2a'))
    cats = [cat((-10 + i * 7.5, 2.8, 0.5), rnd.choice(['tora', 'kuro', 'saba']), s=0.62, rot_z=math.pi * 0.0) for i in range(4)]
    ev = add_meows(cats, n, every=(45, 80), gain=0.6)
    lit_windows(0.0)
    cam = camera(35)
    cam_path(cam, [(0, (-30, -18, 4), (-10, 6, 4)), (1, (5, -16, 3), (12, 6, 4))], n)
    return M(ev, bed=0.6, amb='dawn')

def s01g(n):  # ニューヨーク：真夜中、窓に明かりが点いていく
    sky(hexc('#070b18')); s = bpy.context.scene; s.view_settings.exposure = -0.2
    light_dir((0.0, -0.4, 0.3)); s.display.shading.shadow_intensity = 0.1
    ground(rgb=hexc('#14161c'))
    rnd = random.Random(9)
    wins = []
    dark = hexc('#1d2433'); litc = hexc('#ffcf73')
    for i in range(10):
        x = i * 8 - 36; h = rnd.uniform(14, 18)
        box((x, 10, h / 2), (7.6, 12, h), rnd.choice([hexc('#4a3530'), hexc('#3d2e2a'), hexc('#55403a')]))
        for fl in range(4):
            for k in range(3):
                w = box((x - 2.4 + k * 2.4, 3.95, 2.5 + fl * 3.6), (1.3, 0.1, 1.9), dark)
                w.data = w.data.copy()
                wins.append(w)
    lm = mat(litc); dm = mat(dark)
    order = list(range(len(wins))); rnd.shuffle(order)
    for idx, wi in enumerate(order[:70]):
        w = wins[wi]
        f = int(n * 0.15 + idx * (n * 0.75 / 70))
        # 材質の差し替えでは補間できないので、少し手前に明るい板を出す
        b = box((w.location.x, w.location.y - 0.06, w.location.z), (1.2, 0.04, 1.8), litc)
        b.scale = (0, 0, 0); b.keyframe_insert('scale', frame=f - 1)
        b.scale = (1, 1, 1); b.keyframe_insert('scale', frame=f)
    cam = camera(30)
    cam_path(cam, [(0, (-6, -30, 4), (0, 10, 9)), (1, (6, -24, 5), (2, 10, 9))], n)
    return M([], bed=0.7, amb='night')

# ---------------- 02 何がほしいの ----------------
def s02a(n):  # 子どもが猫を撮る
    living_room()
    c = cat((0.3, 0.6, 0), 'tora', s=0.62, rot_z=math.pi, name='basecat')
    k1 = person((0.2, -0.5, 0), hexc('#e8a33d'), pants=hexc('#4a6aa0'), pose='sit', rot_z=0, s=0.62)
    k2 = person((-0.6, -0.4, 0), hexc('#7fb07a'), pants=hexc('#5a5a6a'), pose='sit', rot_z=0.3, s=0.6)
    ph = box((0.2, -0.05, 0.62), (0.08, 0.02, 0.15), hexc('#222222'))
    ev = add_meows([c], n, every=(45, 70))
    cam = camera(35, dof=2.0, fstop=2.2)
    cam_path(cam, [(0, (2.2, -1.6, 1.0), (0, 0.3, 0.5)), (1, (1.6, -1.0, 0.8), (0, 0.3, 0.5))], n)
    return M(ev, bed=0.3, amb='room')

def s02b(n):  # ごはん・水・ドア・抱き上げ
    sky(hexc('#d8d0c2')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    light_dir((0.3, -0.3, 0.8))
    room(6, 5, 2.6)
    box((1.8, 2.1, 0.45), (2.4, 0.6, 0.9), hexc('#e8e2d8'))  # キッチン
    box((1.8, 2.1, 0.92), (2.4, 0.62, 0.04), hexc('#9a9a9a'))
    b1 = bowl((0.2, 0.6, 0.02)); b2 = bowl((0.45, 0.6, 0.02), c=hexc('#4f86c6'))
    box((-2.0, 2.44, 1.05), (0.9, 0.06, 2.1), hexc('#a48663'))  # ドア
    p = person((0.4, 1.2, 0), hexc('#d6d9de'), rot_z=math.pi)
    move(p, [(1, (1.5, 1.55, 0)), (55, (0.4, 1.2, 0))])
    c = cat((0.3, 0.3, 0), 'tora', s=0.62, rot_z=math.pi * 0.9, name='basecat', pose='walk')
    move(c, [(1, (1.1, -0.5, 0)), (75, (0.3, 0.3, 0))])
    ev = add_meows([c], n, every=(40, 60))
    cam = camera(35, dof=2.0, fstop=2.4)
    cam_path(cam, [(0, (1.8, -1.6, 1.3), (0.3, 0.7, 0.6)), (0.5, (1.3, -1.4, 1.0), (0.2, 0.7, 0.5)),
                   (1, (0.4, -1.5, 1.2), (-0.8, 1.6, 0.8))], n)
    return M(ev, bed=0.3, amb='room')

def s02c(n):  # スマホの画面：同じ質問
    sky(hexc('#2a2f3a')); s = bpy.context.scene; s.view_settings.exposure = 0.2
    s.display.shading.light = 'FLAT'; s.display.shading.show_shadows = False
    tex = make_tex('qwall', draw_question_wall)
    m = bpy.data.materials.new('scr'); m.use_nodes = True
    t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(tex)
    m.node_tree.links.new(t.outputs['Color'], m.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
    bpy.ops.mesh.primitive_plane_add(location=(0, 0, 0), rotation=(math.pi / 2, 0, 0))
    o = bpy.context.object; o.scale = (8, 4.5, 1); o.data.materials.append(m)
    cam = camera(50)
    cam_path(cam, [(0, (0, -14, 0.5), (0, 0, 0.5)), (1, (0, -9, 0), (0, 0, 0))], n)
    return M([], bed=0.6, amb='room')

# ---------------- テクスチャ（PIL） ----------------
def make_tex(name, fn, size=(1920, 1080)):
    from PIL import Image, ImageDraw
    path = f'/home/user/work_neko/assets/{name}.png'
    im = Image.new('RGB', size, (240, 240, 240)); d = ImageDraw.Draw(im)
    fn(im, d)
    im.save(path)
    return path

def _font(sz, serif=False):
    from PIL import ImageFont
    return ImageFont.truetype('/home/user/work_neko/fonts/' + ('NotoSerifJP-Bold.otf' if serif else 'NotoSansJP-Bold.otf'), sz)

def draw_question_wall(im, d):
    rnd = random.Random(3)
    d.rectangle((0, 0, 1920, 1080), fill=(232, 236, 241))
    qs = ['うちの猫、何て言ってるの？', 'What is my cat saying?', '我家猫在说什么？', 'Kedim ne diyor?', 'Что говорит мой кот?',
          'Que dit mon chat ?', '우리 고양이 뭐라는 거야?', 'Was sagt meine Katze?', 'O que meu gato está dizendo?', '¿Qué dice mi gato?']
    for i in range(36):
        x = (i % 4) * 480 + 20 + rnd.randint(-10, 10); y = (i // 4) * 120 + 10
        q = qs[i % len(qs)]
        f = _font(30)
        try:
            w = d.textlength(q, font=f)
        except Exception:
            w = 400
        d.rounded_rectangle((x, y, x + min(450, w + 60), y + 96), 22, fill=(255, 255, 255), outline=(200, 205, 212), width=2)
        d.ellipse((x + 12, y + 28, x + 44, y + 60), fill=rnd.choice([(217, 139, 58), (60, 60, 64), (141, 141, 136), (240, 238, 232)]))
        d.text((x + 54, y + 30), q, font=f, fill=(40, 44, 52))

def draw_meeting(im, d):
    rnd = random.Random(5)
    d.rectangle((0, 0, 1920, 1080), fill=(28, 30, 36))
    names = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺']
    for i in range(6):
        x = (i % 3) * 640 + 10; y = (i // 3) * 540 + 10
        d.rounded_rectangle((x, y, x + 620, y + 520), 18, fill=rnd.choice([(196, 186, 170), (180, 190, 200), (200, 190, 180), (175, 185, 170)]))
        # 人
        d.ellipse((x + 230, y + 120, x + 390, y + 290), fill=(232, 196, 160)); d.chord((x + 222, y + 110, x + 398, y + 250), 180, 360, fill=(50, 40, 36))
        d.rounded_rectangle((x + 170, y + 300, x + 450, y + 520), 60, fill=rnd.choice([(60, 80, 120), (120, 60, 60), (70, 110, 80), (90, 90, 100)]))
        # 後ろの猫
        cx = x + rnd.choice([90, 520]); cy = y + 330
        col = rnd.choice([(217, 139, 58), (42, 42, 46), (240, 238, 232), (141, 141, 136)])
        d.ellipse((cx - 50, cy - 10, cx + 50, cy + 110), fill=col); d.ellipse((cx - 40, cy - 70, cx + 40, cy + 5), fill=col)
        d.polygon([(cx - 38, cy - 50), (cx - 30, cy - 95), (cx - 10, cy - 62)], fill=col); d.polygon([(cx + 38, cy - 50), (cx + 30, cy - 95), (cx + 10, cy - 62)], fill=col)
        d.ellipse((cx - 9, cy - 25, cx + 9, cy - 10), fill=(120, 40, 40))
        d.text((x + 20, y + 470), names[i], font=_font(30), fill=(255, 255, 255))

def draw_phone_answers(im, d):
    d.rectangle((0, 0, 1080, 1920), fill=(245, 245, 247))

# ---------------- 03 動物病院 ----------------
def env_clinic():
    sky(hexc('#d6d1c8')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    light_dir((0.2, -0.3, 0.9))
    room(9, 7, 2.8, floor=hexc('#d9d6cf'), wall=hexc('#f1f1ee'), window=False)
    box((2.5, 2.6, 0.55), (3.0, 0.7, 1.1), hexc('#9fb7c4'))  # 受付
    box((2.5, 2.6, 1.12), (3.1, 0.75, 0.05), hexc('#f4f4f2'))
    for k in range(4):
        box((-3.4 + k * 1.3, 2.9, 0.45), (1.1, 0.5, 0.06), hexc('#7d93a3'))  # 長いす
        box((-3.4 + k * 1.3, 3.1, 0.7), (1.1, 0.06, 0.5), hexc('#7d93a3'))

def s03a(n):  # 病院の入り口の外まで行列
    env_town(nx=4, ny=4, seed=7, skip=lambda x, y: abs(x + 7) < 1 and abs(y + 21) < 1)
    box((-7, -21.0, 2.0), (10, 6, 4), hexc('#f1f1ee'))
    box((-7, -24.05, 3.3), (6, 0.1, 0.9), hexc('#5b8fb0'))
    text3d('どうぶつ病院', (-7, -24.12, 3.12), 0.6, (1, 1, 1))
    box((-7, -24.05, 1.1), (1.8, 0.1, 2.2), hexc('#a9c7d9'))
    rnd = random.Random(3)
    for i in range(14):
        x = -6.2 + i * 0.85; y = -25.2 - (i % 2) * 0.2
        p = person((x, y, 0), rnd.choice([hexc('#3d5a80'), hexc('#c46a4a'), hexc('#4a6b4a'), hexc('#8a8a8a'), hexc('#d8c9a8')]), rot_z=-math.pi / 2)
        cr = carrier((x - 0.35, y - 0.3, 0.55), rot_z=math.pi / 2)
        # 数秒ごとに、前の人について少し進む
        keys_p, keys_c = [(1, (x, y, 0))], [(1, (x - 0.35, y - 0.3, 0.55))]
        step = 0
        for f0 in range(40 + i * 2, n - 20, 90):
            keys_p.append((f0, (x - step, y, 0))); keys_c.append((f0, (x - 0.35 - step, y - 0.3, 0.55)))
            step += 0.42
            keys_p.append((f0 + 22, (x - step, y, 0))); keys_c.append((f0 + 22, (x - 0.35 - step, y - 0.3, 0.55)))
        move(p, keys_p); move(cr, keys_c)
    cam = camera(35)
    cam_path(cam, [(0, (-14, -32, 2.5), (-5, -24.5, 1.3)), (1, (-2, -33, 3.0), (0, -25, 1.0))], n)
    ev = [(f, 0.35, R.uniform(0.9, 1.2)) for f in range(10, n, 23)]
    return M(ev, bed=0.8)

def s03b(n):  # 受付：電話が全部点滅、待合室はキャリーで埋まる
    env_clinic()
    rnd = random.Random(4)
    phones = []
    for k in range(4):
        box((1.4 + k * 0.75, 2.4, 1.18), (0.3, 0.22, 0.08), hexc('#2e2e32'))
        lamp = box((1.4 + k * 0.75, 2.27, 1.2), (0.06, 0.02, 0.04), hexc('#ff4a3d'))
        blink(lamp, n, 12, k)
    person((2.5, 3.1, 0), hexc('#ffffff'), pants=hexc('#7fa6c4'), rot_z=math.pi)
    for i in range(16):
        carrier((-4 + (i % 8) * 0.9, 1.2 - (i // 8) * 1.2, 0), rot_z=rnd.uniform(-0.4, 0.4))
    ev = [(f, 0.6, rnd.uniform(0.85, 1.3)) for f in range(5, n, 9)]
    cam = camera(28)
    cam_path(cam, [(0, (-4.0, -3.4, 2.4), (1.5, 2.2, 0.8)), (1, (0.5, -3.6, 2.0), (2.0, 2.4, 1.0))], n)
    return M(ev, bed=0.8, amb='room')

def s03c(n):  # 診察台：聴診器
    env_clinic()
    box((0, 0.5, 0.45), (1.4, 0.8, 0.9), hexc('#cfd7dc'))
    box((0, 0.5, 0.92), (1.45, 0.85, 0.04), hexc('#e9eef0'))
    c = cat((0, 0.45, 0.94), 'mike', s=0.62, rot_z=0.0)
    v = person((0, 1.25, 0), hexc('#ffffff'), pants=hexc('#7fa6c4'), rot_z=math.pi)
    cyl((0.0, 0.33, 1.13), 0.03, 0.012, hexc('#b8bcc0'), rot=(math.pi / 2, 0, 0))
    cyl((0.0, 0.7, 1.25), 0.006, 0.75, hexc('#3a3a3a'), rot=(1.0, 0, 0))
    ev = add_meows([c], n, every=(30, 45))
    cam = camera(45, dof=1.5, fstop=2.0)
    cam_path(cam, [(0, (0.8, -1.4, 1.4), (0, 0.5, 1.1)), (1, (0.35, -0.9, 1.2), (0, 0.5, 1.1))], n)
    return M(ev, bed=0.5, amb='room')

# ---------------- 04 うるささ ----------------
def ghost_person(loc, rot_z=0, pose='stand'):
    p = person(loc, hexc('#d8e6f5'), pants=hexc('#d8e6f5'), skin=hexc('#d8e6f5'), hair=hexc('#d8e6f5'), rot_z=rot_z, pose=pose, name='ghost')
    for o in [p] + list(p.children_recursive):
        o['ghost'] = 1
    return p

def s04a(n):
    living_room()
    c = cat((0.2, 1.0, 0), 'tora', s=0.62, rot_z=math.pi * 0.9, name='basecat')
    person((-1.2, 2.0, 0), hexc('#c7d3e0'), pose='sit', rot_z=math.pi)
    ghost_person((0.45, 1.05, 0), rot_z=math.pi * 0.9)
    ev = add_meows([c], n, every=(55, 80))
    cam = camera(32)
    cam_path(cam, [(0, (2.8, -2.6, 2.3), (-0.3, 1.2, 0.6)), (1, (2.0, -2.0, 1.7), (-0.3, 1.2, 0.6))], n)
    return M(ev, bed=0.2, ghost=True, amb='room')

def s04b(n):
    living_room()
    cats = [cat((0.2, 1.0, 0), 'tora', s=0.62, rot_z=math.pi), cat((-1.5, 0.3, 0), 'kuro', s=0.62, rot_z=-2.6), cat((1.3, -0.3, 0), 'shiro', s=0.62, rot_z=2.2)]
    for c in cats:
        ghost_person((c.location.x + 0.35, c.location.y + 0.1, 0), rot_z=c.rotation_euler.z)
    person((-1.2, 2.0, 0), hexc('#c7d3e0'), pose='sit', rot_z=math.pi)
    ev = add_meows(cats, n, every=(40, 70))
    cam = camera(28)
    cam_path(cam, [(0, (3.4, -3.8, 3.2), (-0.2, 0.6, 0.6)), (1, (2.6, -3.6, 2.6), (-0.2, 0.6, 0.6))], n)
    return M(ev, bed=0.2, ghost=True, amb='room')

def s04c(n):  # 断面の家：自分の猫の輪は大きく、窓の外の猫の輪は小さい
    env_town(nx=5, ny=5, seed=9)
    c = cat((-0.8, -0.6 + 7.0 * 0, 0.02), 'tora', s=0.62)
    fr = meow_times(n, every=(40, 60)); meow(c, fr)
    rings((-0.8, -0.6, 0.35), fr, rgb=(1, 1, 1), size=1.2, n=3)
    far = cat((14.5, -7.5, 0.02), 'kuro', s=0.62)
    fr2 = meow_times(n, every=(45, 70)); meow(far, fr2)
    rings((14.5, -7.5, 0.35), fr2, rgb=(0.85, 0.88, 0.95), size=0.5, n=1)
    cam = camera(35)
    cam_path(cam, [(0, (14, -26, 22), (2, -2, 0)), (1, (8, -18, 14), (0, -1, 0))], n)
    return M([(f, 1.0, 1.0) for f in fr] + [(f, 0.2, 1.2) for f in fr2], bed=0.3)

# ---------------- 05 夜 ----------------
def env_bedroom(n, ghost=False):
    sky(hexc('#0b1020')); s = bpy.context.scene; s.view_settings.exposure = -0.3
    s.display.shading.shadow_intensity = 0.35
    light_dir((-0.4, 0.6, 0.6))
    room(5, 5, 2.5, floor=hexc('#7a6650'), wall=hexc('#9aa3b5'), night=True)
    bed((0, 0.6, 0), rot_z=0)
    p = person((0, 0.75, 0.5), hexc('#8fa3b8'), pants=hexc('#8fa3b8'), pose='lie', rot_z=math.pi)
    c = cat((0.25, -0.2, 0.5), 'tora', s=0.62, rot_z=math.pi * 0.9, pose='crouch', name='bedcat')
    box((-1.6, -0.2, 0.3), (0.5, 0.4, 0.6), hexc('#5a4a3a'))  # サイドテーブル
    if ghost:
        ghost_person((0.55, -0.6, 0.0), rot_z=0.0)
    return c

def s05a(n):
    env_town(night=True, nx=7, ny=7)
    cam = camera(30)
    cam_path(cam, [(0, (50, -90, 60), (0, -5, 0)), (1, (35, -70, 40), (0, -10, 0))], n)
    # 窓の明かりを順に消す
    lit = [o for o in bpy.data.objects if o.type == 'MESH' and o.data.materials and o.data.materials[0].diffuse_color[0] > 0.9 and o.data.materials[0].diffuse_color[2] < 0.3]
    rnd = random.Random(2); rnd.shuffle(lit)
    for i, o in enumerate(lit[:int(len(lit) * 0.7)]):
        f = int(n * 0.1 + i * n * 0.8 / max(1, len(lit)))
        o.keyframe_insert('scale', frame=max(1, f - 1)); o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=f)
    return M([], bed=0.6, amb='night')

def s05b(n):
    c = env_bedroom(n, ghost=True)
    ev = add_meows([c], n, every=(45, 70))
    cam = camera(32, dof=2.4, fstop=2.0)
    cam_path(cam, [(0, (2.2, -2.3, 2.2), (0, 0.7, 0.6)), (1, (1.6, -1.8, 1.6), (0, 0.7, 0.6))], n)
    return M(ev, bed=0.3, ghost=True, amb='night')

def s05c(n):
    env_town(night=True, nx=7, ny=7, seed=3)
    cats = []
    rnd = random.Random(5)
    for i in range(12):
        x = rnd.choice([-1, 1]) * rnd.uniform(2, 40); y = rnd.uniform(-40, 40)
        c = cat((x, y, 0), 'kuro', s=0.62); fr = meow_times(n, every=(40, 80), rng=rnd); meow(c, fr)
        rings((x, y, 0.4), fr, rgb=(0.9, 0.85, 0.6), size=2.5, n=1)
    cam = camera(30)
    cam_path(cam, [(0, (40, -60, 55), (0, 0, 0)), (1, (20, -55, 45), (0, 0, 0))], n)
    return M([], bed=0.7, amb='night')

def s05d(n):
    c = env_bedroom(n)
    ev = add_meows([c], n, every=(50, 80))
    cam = camera(50, dof=1.2, fstop=1.8)
    cam_path(cam, [(0, (0.9, -1.3, 0.9), (0.2, -0.2, 0.6)), (0.55, (0.9, -1.3, 0.9), (0.2, -0.2, 0.6)), (1, (1.0, 0.6, 1.2), (0.0, 1.4, 0.7))], n)
    return M(ev, bed=0.3, amb='night')

# ---------------- 06 壁の向こう ----------------
def s06a(n):  # マンションの断面
    sky(hexc('#0b1020')); s = bpy.context.scene; s.view_settings.exposure = -0.1
    light_dir((0.3, -0.7, 0.6)); s.display.shading.shadow_intensity = 0.3
    rnd = random.Random(7)
    W, H, D = 5.0, 2.9, 5.0
    cats = []
    for fl in range(4):
        for k in range(4):
            x = (k - 1.5) * W; z = fl * H
            box((x, 0, z), (W, D, 0.2), hexc('#d9d3c7'))
            box((x, D / 2, z + H / 2), (W, 0.2, H), hexc('#cfc8ba'))
            box((x - W / 2, 0, z + H / 2), (0.2, D, H), hexc('#e6e0d4'))
            lit = rnd.random() < 0.8
            box((x, D / 2 - 0.15, z + 1.4), (1.6, 0.05, 1.1), hexc('#ffd98a') if lit else hexc('#2a3248'))
            has_cat = rnd.random() < 0.45
            if has_cat:
                c = cat((x + rnd.uniform(-1.2, 1.2), rnd.uniform(-1, 1), z + 0.1), rnd.choice(['tora', 'kuro', 'shiro', 'saba', 'mike']), s=0.62, rot_z=rnd.uniform(-1, 1))
                fr = meow_times(n, every=(40, 75), rng=rnd); meow(c, fr)
                rings((c.location.x, c.location.y, z + 0.45), fr, rgb=(1, 0.9, 0.6), size=0.9, n=1)
            else:
                bed((x + 1.0, 0.6, z + 0.1), rot_z=0)
                person((x + 1.0, 0.7, z + 0.6), rnd.choice([hexc('#c9d4e2'), hexc('#e2c9c9')]), pose='lie', rot_z=math.pi)
    box((0, 0, 4 * H), (4 * W + 0.2, D, 0.2), hexc('#bdb6a8'))
    box((2 * W, 0, 2 * H), (0.2, D, 4 * H), hexc('#e6e0d4'))
    cam = camera(35)
    cam_path(cam, [(0, (2, -20, 7), (0, 0, 5.5)), (1, (-1, -15, 6), (0, 0, 5.5))], n)
    return M([], bed=0.6, amb='night')

def s06b(n):  # 管理会社：苦情の電話
    sky(hexc('#d6d1c8')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(8, 6, 2.7, floor=hexc('#b9b3a6'), wall=hexc('#ecebe6'), window=True)
    rnd = random.Random(2)
    for i in range(3):
        for j in range(2):
            x = -2 + i * 2.0; y = j * 1.6
            table((x, y, 0), 1.4, 0.7, 0.72)
            person((x, y - 0.75, 0), rnd.choice([hexc('#ffffff'), hexc('#c9d4e2'), hexc('#e8e0cf')]), pose='sit', rot_z=0)
            box((x + 0.4, y, 0.78), (0.25, 0.2, 0.08), hexc('#2e2e32'))
            lamp = box((x + 0.4, y - 0.11, 0.8), (0.05, 0.02, 0.04), hexc('#ff4a3d'))
            blink(lamp, n, 10, i + j)
    cam = camera(30)
    cam_path(cam, [(0, (3.5, -3.5, 2.5), (0, 0.8, 0.8)), (1, (2.0, -3.8, 2.0), (0, 0.8, 0.8))], n)
    return M([], bed=0.3, amb='room')

def s06c(n):  # エレベーター
    sky(hexc('#c9c5bd')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    light_dir((0, 0, 1))
    box((0, 0, -0.05), (2.0, 1.8, 0.1), hexc('#8c8a86'))
    box((0, 0.9, 1.2), (2.0, 0.1, 2.4), hexc('#b8b5ae'))
    box((-1.0, 0, 1.2), (0.1, 1.8, 2.4), hexc('#c4c1ba'))
    box((1.0, 0, 1.2), (0.1, 1.8, 2.4), hexc('#c4c1ba'))
    box((0.85, -0.2, 1.2), (0.05, 0.2, 0.4), hexc('#d8d6d0'))
    p1 = person((-0.45, 0.2, 0), hexc('#d9c8b0'), rot_z=0.3)
    p2 = person((0.45, 0.25, 0), hexc('#7a8aa0'), rot_z=-0.2)
    h1 = bpy.data.objects[p1['head']]; h2 = bpy.data.objects[p2['head']]
    for h, sgn in ((h1, -1), (h2, 1)):
        h.keyframe_insert('rotation_euler', frame=1)
        h.rotation_euler = (0, 0, sgn * 0.6); h.keyframe_insert('rotation_euler', frame=int(n * 0.3))
        h.keyframe_insert('rotation_euler', frame=int(n * 0.45))
        h.rotation_euler = (0, 0, -sgn * 0.3); h.keyframe_insert('rotation_euler', frame=int(n * 0.6))
    cam = camera(28)
    cam_path(cam, [(0, (0, -2.3, 1.5), (0, 0.3, 1.3)), (1, (0, -1.9, 1.5), (0, 0.3, 1.35))], n)
    return M([], bed=0.15, amb='room')

# ---------------- 07 耳栓 ----------------
def s07a(n):
    sky(hexc('#e2e0da')); s = bpy.context.scene; s.view_settings.exposure = 0.5
    light_dir((0, -0.2, 1))
    box((0, 0, -0.05), (10, 8, 0.1), hexc('#dedbd4'))
    rnd = random.Random(3)
    for k in range(3):
        x = (k - 1) * 3.0
        box((x, 1.5, 1.0), (2.6, 0.5, 2.0), hexc('#f4f4f2'))
        for sh in range(4):
            box((x, 1.3, 0.25 + sh * 0.5), (2.6, 0.5, 0.03), hexc('#d0d0cc'))
            if k != 1:
                for i in range(8):
                    box((x - 1.1 + i * 0.3, 1.25, 0.37 + sh * 0.5), (0.18, 0.1, 0.2), rnd.choice([hexc('#e05a4f'), hexc('#4f86c6'), hexc('#5ab07a'), hexc('#e8c14f')]))
    box((0, 1.04, 1.55), (1.2, 0.02, 0.36), hexc('#fff6d6'))
    text3d('耳栓　入荷未定', (0, 1.02, 1.5), 0.17, hexc('#c0392b'))
    cam = camera(40)
    cam_path(cam, [(0, (0.8, -3.2, 1.3), (0, 1.2, 1.1)), (1, (0.2, -2.2, 1.4), (0, 1.2, 1.3))], n)
    return M([], bed=0.5, amb='city')

def s07b(n):  # オンライン会議
    sky(hexc('#d6d1c8')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    room(5, 4, 2.6)
    table((0, 0.6, 0), 1.4, 0.7, 0.72)
    tex = make_tex('meeting', draw_meeting)
    m = bpy.data.materials.new('mt'); m.use_nodes = True
    t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(tex)
    m.node_tree.links.new(t.outputs['Color'], m.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
    box((0, 0.85, 0.75), (0.62, 0.42, 0.02), hexc('#b9bcc0'))
    box((0, 0.98, 1.02), (0.62, 0.02, 0.4), hexc('#2a2a2a'), rot=(-0.2, 0, 0))
    bpy.ops.mesh.primitive_plane_add(location=(0, 0.965, 1.02), rotation=(math.pi / 2 - 0.2, 0, 0))
    o = bpy.context.object; o.scale = (0.29, 0.17, 1); o.data.materials.append(m)
    p = person((0, 0.0, 0), hexc('#8aa0b8'), pose='sit', rot_z=math.pi, act='type')
    c = cat((0.9, 0.3, 0), 'saba', s=0.62, rot_z=math.pi * 1.2)
    ev = add_meows([c], n, every=(45, 70), gain=0.7)
    cam = camera(40, dof=1.4, fstop=2.0)
    cam_path(cam, [(0, (0.5, -0.55, 1.35), (0, 0.97, 1.0)), (1, (0.15, -0.1, 1.2), (0, 0.97, 1.02))], n)
    return M(ev + [(f, 0.35, R.uniform(0.9, 1.3)) for f in range(20, n, 31)], bed=0.3, amb='room')

def s07c(n):  # スマホを猫に向ける人々（街の俯瞰の窓辺）
    living_room()
    c = cat((0.2, 1.0, 0), 'tora', s=0.62, rot_z=math.pi, name='basecat')
    p = person((-0.4, 0.2, 0), hexc('#c7d3e0'), rot_z=-0.6, act='phone')
    box((-0.15, 0.55, 1.2), (0.08, 0.015, 0.16), hexc('#1d1d1d'), rot=(0.4, 0, -0.6))
    ev = add_meows([c], n, every=(45, 70))
    cam = camera(35, dof=1.8, fstop=2.0)
    cam_path(cam, [(0, (1.8, -0.8, 1.4), (0.1, 0.8, 0.6)), (1, (1.4, -0.4, 1.2), (0.1, 0.8, 0.5))], n)
    return M(ev, bed=0.4, amb='room')

# ---------------- 08 見つかる猫 ----------------
def s08a(n):  # 朝の駐車場：ボンネットの中の子猫
    env_town(nx=4, ny=4, seed=12, skip=lambda x, y: abs(x + 7) < 1 and abs(y + 21) < 1)
    box((0, -30, 0.01), (14, 9, 0.02), hexc('#7d7a75'))
    for i in range(3):
        car((-4 + i * 4, -30, 0), rot_z=0)
    cr = car((4, -30, 0), rot_z=0, hood_open=0.0)
    hinge = bpy.data.objects[cr['hinge']]
    f_open = int(n * 0.55)
    hinge.rotation_euler = (0, 0, 0); hinge.keyframe_insert('rotation_euler', frame=f_open - 20)
    hinge.rotation_euler = (-1.1, 0, 0); hinge.keyframe_insert('rotation_euler', frame=f_open)
    kit = cat((4, -31.4, 0.62), 'tora', s=0.38, rot_z=0, pose='crouch')
    kit.scale = (0, 0, 0); kit.keyframe_insert('scale', frame=f_open - 15)
    kit.scale = (0.38, 0.38, 0.38); kit.keyframe_insert('scale', frame=f_open - 14)
    p = person((4.0, -33.6, 0), hexc('#3d5a80'), rot_z=-1.3)
    move(p, [(1, (8.5, -34.8, 0)), (f_open - 250, (8.5, -34.8, 0)), (f_open - 60, (4.1, -33.7, 0)), (f_open - 40, (4.0, -33.35, 0))])
    fr = meow_times(n, every=(30, 50)); meow(kit, fr)
    cam = camera(35, dof=4.5, fstop=2.4)
    cam_path(cam, [(0, (8, -38, 2.2), (4, -31, 1.0)), (1, (6, -35.5, 1.8), (4, -31.3, 0.8))], n)
    return M([(f, 0.5 if f < f_open else 0.9, 1.35) for f in fr], bed=0.4)

def s08b(n):  # 物置・迷子の張り紙
    env_town(nx=4, ny=4, seed=14, skip=lambda x, y: abs(x + 7) < 1 and abs(y + 21) < 1)
    box((-3, -26, 1.1), (2.2, 1.6, 2.2), hexc('#8a9a8a'))
    door = box((-3, -26.82, 0.95), (1.6, 0.05, 1.8), hexc('#7a8a7a'))
    c = cat((-3, -26.2, 0.02), 'kuro', s=0.62, rot_z=0)
    ev = add_meows([c], n, every=(40, 60), gain=0.8)
    # 電柱と張り紙
    cyl((3, -27, 4), 0.15, 8, hexc('#9a9690'))
    poster = box((3, -27.17, 1.6), (0.6, 0.02, 0.8), hexc('#fffef6'))
    text3d('迷子の猫を', (3, -27.19, 1.75), 0.11, hexc('#222222'))
    text3d('探しています', (3, -27.19, 1.6), 0.11, hexc('#222222'))
    f_peel = int(n * 0.8)
    for o in bpy.data.objects:
        if o.type == 'FONT' or o == poster:
            o.keyframe_insert('scale', frame=f_peel); o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=f_peel + 8)
    cam = camera(35)
    cam_path(cam, [(0, (-1, -32, 1.4), (-3, -26.5, 0.7)), (0.6, (1.2, -31, 1.5), (2.5, -27, 1.4)), (1, (2.4, -29.5, 1.6), (3, -27, 1.5))], n)
    return M(ev, bed=0.5)

# ---------------- 09 イスタンブールの夜 ----------------
def s09a(n):
    env_istanbul(night=True)
    rnd = random.Random(5); cats = []
    for i in range(14):
        row = rnd.choice([0, 1, 2, 3]); x = -40 + i * 6 + rnd.uniform(-1, 1)
        c = cat((x, row * 7 + 0.5, row * 2.2), rnd.choice(['tora', 'saba', 'kuro', 'shiro', 'mike']), s=0.62, rot_z=rnd.uniform(-1, 1))
        fr = meow_times(n, every=(35, 70), rng=rnd); meow(c, fr)
        rings((c.location.x, c.location.y, c.location.z + 0.4), fr, rgb=(1, 0.85, 0.55), size=1.6, n=1)
    cam = camera(32)
    cam_path(cam, [(0, (-50, -45, 30), (0, 25, 8)), (1, (-20, -40, 22), (5, 25, 10))], n)
    return M([], bed=1.0, amb='night')

def s09b(n):  # 夜明け、店主が餌を置く
    env_istanbul()
    sky(hexc('#e8b98e')); bpy.context.scene.view_settings.exposure = 0.2
    light_dir((0.9, -0.2, 0.2))
    box((-24, -1.5, 1.6), (6, 3, 3.2), hexc('#d9b48a'))
    box((-24, -3.05, 3.0), (6.4, 0.6, 0.1), hexc('#b5553a'))  # ひさし
    p = person((-23.2, -3.6, 0.1), hexc('#6a5040'), rot_z=0.3)
    move(p, [(1, (-21.6, -2.9, 0.1)), (70, (-23.2, -3.6, 0.1))])
    b = bowl((-24.3, -3.8, 0.12))
    c = cat((-24.3, -4.1, 0.1), 'tora', s=0.62, rot_z=0.2)
    c2 = cat((-25.4, -4.4, 0.1), 'saba', s=0.62, rot_z=-0.5, pose='walk')
    move(c2, [(1, (-27.6, -5.6, 0.1)), (110, (-25.0, -4.2, 0.1))])
    ev = add_meows([c, c2], n, every=(45, 75))
    cam = camera(40, dof=3.0, fstop=2.2)
    cam_path(cam, [(0, (-21.5, -7.5, 1.3), (-24, -3.8, 0.6)), (1, (-22.5, -6.6, 1.0), (-24.2, -3.9, 0.5))], n)
    return M(ev, bed=0.6)

# ---------------- 10 鳥 ----------------
def bird(loc, c=None, s=1.0, rot_z=0, name='bird'):
    c = c or random.choice([hexc('#8a6a4a'), hexc('#6a7a8a'), hexc('#c9a050')])
    root = empty(loc, name); root.scale = (s, s, s); root.rotation_euler = (0, 0, rot_z)
    link(sphere((0, 0, 0.06), 0.05, c, scale=(0.8, 1.2, 0.9)), root)
    link(sphere((0, -0.05, 0.1), 0.032, c), root)
    link(cone((0, -0.085, 0.1), 0.008, 0.025, hexc('#e0a020'), rot=(math.pi / 2, 0, 0)), root)
    for sx in (-1, 1):
        w = box((sx * 0.045, 0.01, 0.07), (0.01, 0.07, 0.03), c); link(w, root)
    return root

def s10a(n):  # 庭：忍び寄る猫と小鳥
    sky(hexc('#9cc3e3')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    light_dir((0.5, -0.4, 0.7))
    ground(rgb=hexc('#8fae6a'))
    house((0, 8, 0))
    for i in range(6):
        tree((-6 + i * 2.6, 4 + (i % 2), 0), s=0.5)
    cyl((0.5, 1.0, 0.6), 0.03, 1.2, hexc('#6d5440'))
    box((0.5, 1.0, 1.22), (0.5, 0.5, 0.03), hexc('#a77d55'))
    roof((0.5, 1.0, 1.45), 0.6, 0.6, 0.18, hexc('#6b3b33'))
    birds = [bird((0.35 + i * 0.12, 0.9 + (i % 2) * 0.12, 1.24), rot_z=R.uniform(-2, 2)) for i in range(3)]
    c = cat((-2.0, -0.8, 0), 'tora', s=0.62, pose='crouch', rot_z=-2.2)
    f_meow = int(n * 0.45)
    c.keyframe_insert('location', frame=1)
    c.location = (-0.7, 0.4, 0); c.keyframe_insert('location', frame=f_meow)
    meow(c, [f_meow, f_meow + 60])
    for i, b in enumerate(birds):
        b.keyframe_insert('location', frame=f_meow + 4 + i * 2)
        b.location = (b.location.x + 3 + i, b.location.y + 6, b.location.z + 4 + i)
        b.keyframe_insert('location', frame=f_meow + 40 + i * 2)
    cam = camera(50, dof=3.0, fstop=2.4)
    cam_path(cam, [(0, (1.6, -2.8, 0.9), (-0.5, 0.3, 0.5)), (0.5, (1.4, -2.6, 0.9), (-0.2, 0.5, 0.7)), (1, (1.2, -2.4, 1.2), (0.4, 1.0, 1.3))], n)
    return M([(f_meow, 1.0, 1.0), (f_meow + 60, 0.9, 1.0)], bed=0.4, amb='garden')

def s10b(n):  # 餌台に集まる小鳥
    sky(hexc('#9cc3e3')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    light_dir((0.5, -0.4, 0.7))
    ground(rgb=hexc('#8fae6a'))
    cyl((0, 0, 0.6), 0.03, 1.2, hexc('#6d5440'))
    box((0, 0, 1.22), (0.6, 0.6, 0.03), hexc('#a77d55'))
    rnd = random.Random(4)
    for i in range(9):
        b = bird((rnd.uniform(-0.25, 0.25), rnd.uniform(-0.25, 0.25), 1.24), rot_z=rnd.uniform(-3, 3))
        f = int(i * n * 0.08)
        b.location.z += 3; b.location.x += rnd.uniform(-3, 3); b.keyframe_insert('location', frame=max(1, f))
        b.location = (b.location.x, b.location.y, 1.24); b.keyframe_insert('location', frame=f + 30)
    c = cat((-3, 2.5, 0), 'kuro', s=0.62, rot_z=-2.3)
    ev = add_meows([c], n, every=(50, 80), gain=0.4)
    cam = camera(45, dof=2.5, fstop=2.4)
    cam_path(cam, [(0, (1.6, -2.0, 1.5), (0, 0, 1.25)), (1, (1.1, -1.6, 1.4), (0, 0, 1.25))], n)
    return M(ev, bed=0.3, amb='garden')

def s10c(n):  # 島：地面の巣と海鳥
    sky(hexc('#a9cbe4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    light_dir((0.6, -0.3, 0.6))
    plane((0, 0, -0.3), (400, 400), hexc('#3d7aa0'))
    sphere((0, 0, -6), 14, hexc('#c9b98f'), scale=(1.6, 1.0, 0.5))
    rnd = random.Random(2)
    for i in range(10):
        x = rnd.uniform(-6, 6); y = rnd.uniform(-4, 3)
        nest = cyl((x, y, 0.95), 0.25, 0.08, hexc('#8a7350'))
        b = bird((x, y, 0.99), c=hexc('#f2f2ee'), s=4.0, rot_z=rnd.uniform(-3, 3))
        head_up = b.location.z
        b.keyframe_insert('rotation_euler', frame=1)
        f = int(n * 0.5) + rnd.randint(0, 12)
        b.keyframe_insert('location', frame=f)
        b.location.z += 0.15; b.keyframe_insert('location', frame=f + 6)
    for i in range(5):
        sphere((rnd.uniform(-10, -6), rnd.uniform(2, 6), 1.0), rnd.uniform(0.6, 1.0), hexc('#5f7f45'), seg=10)
    c = cat((-8, 4.5, 0.9), 'saba', s=0.62, rot_z=-2.3, pose='crouch')
    fr = [int(n * 0.48), int(n * 0.75)]; meow(c, fr)
    cam = camera(35)
    cam_path(cam, [(0, (10, -14, 6), (-1, 0, 0.8)), (1, (6, -11, 4), (-2, 1, 0.8))], n)
    return M([(f, 0.6, 1.0) for f in fr], bed=0.1, amb='sea')

# ---------------- 11 猫カフェ ----------------
def s11a(n):
    env_town(nx=4, ny=4, seed=21, skip=lambda x, y: abs(x + 7) < 1 and abs(y + 21) < 1)
    X0, Y0 = -7, -24
    box((X0, Y0, -0.0), (8, 5, 0.1), hexc('#c9b69a'))
    box((X0, Y0 + 2.5, 2), (8, 0.2, 4), hexc('#f4ead8'))
    box((X0 - 4, Y0, 2), (0.2, 5, 4), hexc('#f4ead8')); box((X0 + 4, Y0, 2), (0.2, 5, 4), hexc('#f4ead8'))
    box((X0, Y0, 4.0), (8.2, 5.2, 0.2), hexc('#e2d6c2'))
    for k in range(3):
        box((X0 - 2.5 + k * 2.5, Y0 + 1.5, 0.4), (1.2, 0.8, 0.8), hexc('#b9875c'))
    box((-10.0, -26.55, 1.4), (0.15, 0.1, 2.8), hexc('#8a5a3a')); box((-4.0, -26.55, 1.4), (0.15, 0.1, 2.8), hexc('#8a5a3a'))
    box((-7, -26.55, 0.2), (6, 0.1, 0.4), hexc('#8a5a3a'))
    box((-7, -26.6, 3.4), (7, 0.1, 0.8), hexc('#8a5a3a'))
    text3d('ねこカフェ', (-7, -26.67, 3.22), 0.5, hexc('#fff3df'))
    box((-3.4, -26.62, 1.4), (0.8, 0.02, 0.5), hexc('#ffffff'))
    text3d('臨時休業', (-3.4, -26.65, 1.32), 0.17, hexc('#c0392b'))
    rnd = random.Random(6); cats = []
    for i in range(12):
        cats.append(cat((-9.6 + (i % 6) * 0.95, -25.6 + (i // 6) * 0.9, 0.02 + (i // 6) * 0.0), rnd.choice(['tora', 'kuro', 'shiro', 'mike', 'saba', 'hachi']), s=0.62, rot_z=math.pi + rnd.uniform(-0.5, 0.5)))
    ev = add_meows(cats, n, every=(30, 55), gain=0.45)
    cam = camera(35)
    cam_path(cam, [(0, (-3.5, -30.5, 1.6), (-7.0, -25.4, 0.7)), (1, (-6.0, -29.0, 1.2), (-7.4, -25.2, 0.5))], n)
    return M(ev, bed=0.6)

def s11b(n):  # 保護施設
    sky(hexc('#d6d1c8')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(8, 6, 2.7, floor=hexc('#cfcbc2'), wall=hexc('#f1efea'), window=False)
    rnd = random.Random(3); cats = []
    for i in range(10):
        x = -3.2 + (i % 5) * 1.3; z = 0.5 + (i // 5) * 0.9
        box((x, 2.6, z - 0.05), (1.1, 0.7, 0.05), hexc('#b0aca3'))
        cats.append(cat((x, 2.6, z), rnd.choice(['tora', 'kuro', 'shiro', 'mike', 'saba']), s=0.62, rot_z=math.pi))
    box((2.8, 1.0, 1.4), (0.05, 1.6, 1.0), hexc('#fafafa'), rot=(0, 0, 0))
    text3d('13時 ごはん', (2.75, 1.0, 1.6), 0.15, hexc('#2a5a9a'), rot=(math.pi / 2, 0, -math.pi / 2))
    text3d('Bケージ そうじ', (2.75, 1.0, 1.35), 0.15, hexc('#2a5a9a'), rot=(math.pi / 2, 0, -math.pi / 2))
    p = person((0.4, 0.5, 0), hexc('#7aa07a'), rot_z=math.pi * 0.95)
    h = bpy.data.objects[p['head']]
    for sx in (-0.15, 0.15):
        e = sphere((sx, 0, 0), 0.07, hexc('#2a2a2a'), scale=(0.5, 1, 1)); link(e, h)
    c = cat((0.35, 0.15, 1.05), 'tora', s=0.62, rot_z=math.pi)
    ev = add_meows(cats + [c], n, every=(35, 60), gain=0.4)
    cam = camera(30)
    cam_path(cam, [(0, (-1.5, -3.2, 1.8), (0.5, 1.2, 1.0)), (1, (0.5, -3.0, 1.6), (1.0, 1.2, 1.0))], n)
    return M(ev, bed=0.5, amb='room')

# ---------------- 12 ネズミ ----------------
def env_alley():
    sky(hexc('#0b1020')); s = bpy.context.scene; s.view_settings.exposure = -0.1
    light_dir((0.2, -0.3, 0.9)); s.display.shading.shadow_intensity = 0.4
    box((0, 0, -0.05), (6, 30, 0.1), hexc('#3a3a40'))
    box((-2.5, 0, 3), (1, 30, 6), hexc('#5a5048'))
    box((2.5, 0, 3), (1, 30, 6), hexc('#4a4650'))
    for i in range(3):
        box((-1.6, 2 + i * 3, 0.45), (0.8, 0.9, 0.9), hexc('#2f5a3a'))
    box((1.8, 3.0, 1.0), (0.1, 1.0, 2.0), hexc('#6a5a4a'))  # 裏口
    box((1.7, 3.0, 2.3), (0.3, 0.3, 0.2), hexc('#ffd98a'))

def make_rat(loc, rot_z=0, name='rat'):
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    c = hexc('#6a6058')
    link(sphere((0, 0, 0.05), 0.05, c, scale=(0.8, 1.6, 0.8)), root)
    link(sphere((0, -0.09, 0.06), 0.03, c, scale=(0.9, 1.3, 0.9)), root)
    for sx in (-1, 1):
        link(sphere((sx * 0.022, -0.08, 0.095), 0.016, hexc('#c9a0a0'), scale=(1, 0.4, 1)), root)
    link(cyl((0, 0.15, 0.02), 0.006, 0.18, hexc('#b08a8a'), rot=(math.pi / 2, 0, 0)), root)
    return root

def peek(rat, n, start):
    base = rat.location.copy()
    rat.location = (base.x + 0.25, base.y, base.z); rat.keyframe_insert('location', frame=1)
    rat.keyframe_insert('location', frame=start)
    rat.location = base; rat.keyframe_insert('location', frame=start + 12)
    rat.keyframe_insert('location', frame=start + 30)
    rat.location = (base.x + 0.4, base.y, base.z); rat.keyframe_insert('location', frame=start + 36)

def s12a(n):
    env_alley()
    rat = make_rat((-1.0, 1.4, 0), rot_z=math.pi * 0.5)
    peek(rat, n, int(n * 0.3))
    cats = [cat((0.3, 9, 0), 'saba', s=0.62, rot_z=math.pi, pose='walk'), cat((-0.8, 14, 0), 'kuro', s=0.62, rot_z=math.pi, pose='walk')]
    move(cats[0], [(1, (0.3, 9, 0)), (n, (0.0, 5.5, 0))]); move(cats[1], [(1, (-0.8, 14, 0)), (n, (-0.4, 10.5, 0))])
    ev = add_meows(cats, n, every=(40, 60), gain=0.5)
    cam = camera(32, dof=1.5, fstop=2.0)
    cam_path(cam, [(0, (0.6, -1.0, 0.3), (-1.0, 1.5, 0.1)), (1, (0.3, -0.6, 0.25), (-1.0, 1.5, 0.1))], n)
    return M(ev, bed=0.6, amb='night')

def s12b(n):  # 誰もいない夜の路地・裏口・線路
    env_alley()
    box((0, 18, 0.1), (6, 0.2, 0.2), hexc('#5a5a5a'))
    cats = [cat((0.6, 8, 0), 'tora', s=0.62, rot_z=math.pi, pose='walk')]
    move(cats[0], [(1, (0.6, 7, 0)), (n, (0.2, 13, 0))])
    ev = add_meows(cats, n, every=(50, 80), gain=0.6)
    cam = camera(26)
    cam_path(cam, [(0, (0, -4, 1.6), (0, 10, 1.0)), (1, (0, 2, 1.4), (0, 14, 1.0))], n)
    return M(ev, bed=0.8, amb='night')

def s12c(n):  # 店主がネズミ捕りを片づける
    env_alley()
    trap = box((1.4, 2.4, 0.03), (0.3, 0.2, 0.05), hexc('#c9b08a'))
    p = person((1.0, 2.0, 0), hexc('#f2f2f2'), rot_z=-math.pi / 2)
    f = int(n * 0.5)
    trap.keyframe_insert('location', frame=f)
    trap.location = (1.2, 2.2, 0.9); trap.keyframe_insert('location', frame=f + 18)
    cats = [cat((-0.5, 9, 0), 'saba', s=0.62, rot_z=math.pi)]
    ev = add_meows(cats, n, every=(50, 80), gain=0.4)
    cam = camera(35, dof=2.2, fstop=2.2)
    cam_path(cam, [(0, (-0.5, -0.8, 1.0), (1.3, 2.4, 0.4)), (1, (-0.2, -0.3, 0.9), (1.3, 2.4, 0.5))], n)
    return M(ev, bed=0.5, amb='night')

# ---------------- 13 返事をやめる ----------------
def s13a(n):
    living_room()
    table((0.5, 1.4, 0), 1.2, 0.6, 0.72)
    laptop((0.5, 1.45, 0.75), rot_z=math.pi)
    p = person((0.5, 0.75, 0), hexc('#8aa0b8'), pose='sit', rot_z=math.pi, act='type')
    h = bpy.data.objects[p['head']]
    for sx in (-0.14, 0.14):
        link(sphere((sx, 0, 0), 0.04, hexc('#f2f2f2')), h)
    c = cat((-0.4, 0.4, 0), 'tora', s=0.62, rot_z=-2.3, name='basecat', pose='walk')
    move(c, [(1, (-1.3, -0.4, 0)), (int(n * 0.35), (-0.3, 0.35, 0)), (int(n * 0.6), (-0.3, 0.35, 0)), (int(n * 0.6) + 40, (0.0, 0.25, 0))])
    ev = add_meows([c], n, every=(50, 75))
    cam = camera(35, dof=2.0, fstop=2.2)
    cam_path(cam, [(0, (-1.6, -1.2, 1.2), (0.2, 0.9, 0.7)), (1, (-1.0, -0.8, 1.0), (0.2, 0.9, 0.7))], n)
    return M(ev, bed=0.15, amb='room')

def s13b(n):  # キーボードに座る・ついて回る・見つめる
    living_room()
    table((0.5, 1.4, 0), 1.2, 0.6, 0.72)
    laptop((0.5, 1.45, 0.75), rot_z=math.pi)
    p = person((0.5, 0.75, 0), hexc('#8aa0b8'), pose='sit', rot_z=math.pi, act='type')
    h = bpy.data.objects[p['head']]
    for sx in (-0.14, 0.14):
        link(sphere((sx, 0, 0), 0.04, hexc('#f2f2f2')), h)
    c = cat((0.55, 1.4, 0.76), 'tora', s=0.62, rot_z=math.pi, name='basecat')
    ev = add_meows([c], n, every=(45, 65))
    cam = camera(40, dof=1.6, fstop=2.0)
    cam_path(cam, [(0, (1.7, 0.9, 1.35), (0.5, 1.4, 0.95)), (1, (1.3, 1.0, 1.2), (0.5, 1.4, 0.95))], n)
    return M(ev, bed=0.15, amb='room')

# ---------------- 14 30日後 ----------------
def s14a(n):
    env_town()
    cats = [cat((0.6, -32.9, 1.1), 'kuro', s=0.62, rot_z=0.1), cat((-1.4, -34.6, 0), 'tora', s=0.62, rot_z=-0.5),
            cat((1.9, -35.4, 0), 'mike', s=0.62, rot_z=0.5, pose='crouch')]
    f_stop = int(4.0 * FPS)
    ev = []
    for c in cats:
        fr = [f for f in meow_times(f_stop, every=(30, 50))]
        meow(c, fr); ev += [(f, 0.8, R.uniform(0.9, 1.2)) for f in fr]
    cam = camera(26)
    cam_path(cam, [(0, (1.0, -37.0, 0.45), (-0.8, -33.9, 0.4)), (0.45, (1.0, -37.0, 0.45), (-0.8, -33.9, 0.4)), (1, (25, -80, 35), (0, -25, 0))], n)
    return M(ev, bed=1.0, silent_from=f_stop)

def s14b(n):
    c = env_bedroom(n)
    p = [o for o in bpy.data.objects if o.name.startswith('p')][0]
    cam = camera(45, dof=1.6, fstop=2.0)
    cam_path(cam, [(0, (1.6, -1.6, 1.8), (0, 0.4, 0.6)), (1, (0.8, -1.0, 1.3), (0.1, 0.9, 0.6))], n)
    return M([], bed=0.0, amb='silent')

def s14c(n):  # 翌朝：ネズミが戻る、猫が鳥に忍び寄る
    env_alley()
    sky(hexc('#c9d6e2')); bpy.context.scene.view_settings.exposure = 0.3
    rat = make_rat((0.6, 1.6, 0), rot_z=math.pi * 0.5)
    rat.location = (2.0, 1.6, 0); rat.keyframe_insert('location', frame=1)
    rat.location = (0.0, 1.6, 0); rat.keyframe_insert('location', frame=int(n * 0.4))
    cam = camera(32, dof=1.5, fstop=2.0)
    cam_path(cam, [(0, (0.6, -1.0, 0.3), (0.3, 1.6, 0.1)), (1, (0.3, -0.6, 0.25), (0.2, 1.6, 0.1))], n)
    return M([], bed=0.0, amb='morning')

def s14d(n):
    sky(hexc('#9cc3e3')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    ground(rgb=hexc('#8fae6a'))
    cyl((0.5, 1.0, 0.6), 0.03, 1.2, hexc('#6d5440'))
    box((0.5, 1.0, 1.22), (0.5, 0.5, 0.03), hexc('#a77d55'))
    for i in range(3):
        bird((0.35 + i * 0.12, 0.9, 1.24))
    c = cat((-1.6, -0.6, 0), 'tora', s=0.62, pose='crouch', rot_z=-2.2)
    c.keyframe_insert('location', frame=1)
    c.location = (-0.9, -0.1, 0); c.keyframe_insert('location', frame=n)
    cam = camera(50, dof=2.2, fstop=2.4)
    cam_path(cam, [(0, (1.0, -2.6, 0.7), (-1.1, -0.3, 0.3)), (1, (0.9, -2.2, 0.7), (-0.7, 0.0, 0.35))], n)
    return M([], bed=0.0, amb='garden')

def s14e(n):  # 人が猫に話しかける
    living_room()
    p = person((-0.2, 1.2, 0), hexc('#c7d3e0'), pose='sit', rot_z=math.pi, act='talk')
    c = cat((0.1, 0.5, 0), 'tora', s=0.62, rot_z=math.pi * 0.0, name='basecat', pose='walk')
    move(c, [(1, (1.0, -0.3, 0)), (80, (0.1, 0.5, 0))])
    h = bpy.data.objects[p['head']]
    h.rotation_euler = (0.35, 0, 0); h.keyframe_insert('rotation_euler', frame=1)
    cam = camera(40, dof=1.8, fstop=2.0)
    cam_path(cam, [(0, (1.5, -0.9, 0.9), (-0.05, 0.8, 0.5)), (1, (1.0, -0.5, 0.75), (-0.05, 0.8, 0.5))], n)
    return M([], bed=0.0, amb='room')

# ---------------- 15 終章 ----------------
def s15a(n):  # 9,500年前のキプロス島
    sky(hexc('#e9b98a')); s = bpy.context.scene; s.view_settings.exposure = 0.2
    light_dir((0.9, -0.3, 0.25))
    ground(rgb=hexc('#c9ad86'))
    rnd = random.Random(9)
    for i in range(9):
        x = rnd.uniform(-14, 14); y = rnd.uniform(6, 20)
        cyl((x, y, 1.0), rnd.uniform(1.6, 2.4), 2.0, hexc('#b49c7a'), verts=10)
        cone((x, y, 2.4), 2.5, 0.8, hexc('#8a7556'), verts=10)
    plane((0, -40, 0.02), (300, 30), hexc('#4a7a9a'))
    box((0, 0, -0.05), (2.6, 1.6, 0.2), hexc('#8a7556'))  # 墓
    person((0, 0.1, 0.0), hexc('#b9a280'), pose='lie', rot_z=math.pi / 2, s=0.95)
    cat((0.0, -0.6, 0.02), 'saba', s=0.62, rot_z=math.pi / 2, pose='crouch')
    cam = camera(40)
    cam_path(cam, [(0, (5, -5, 3.5), (0, 0, 0.2)), (1, (3.2, -3.4, 2.2), (0, -0.1, 0.2))], n)
    return M([], bed=0.0, amb='wind')

def s15b(n):  # 冒頭の部屋：一度だけ鳴き、飼い主が振り向く
    living_room()
    p = person((-1.2, 2.0, 0.0), hexc('#c7d3e0'), pose='sit', rot_z=math.pi)
    c = cat((-0.4, 1.0, 0), 'tora', s=0.62, rot_z=math.pi * 0.85, name='basecat', pose='walk')
    move(c, [(1, (0.6, 0.0, 0)), (int(n * 0.35), (-0.4, 1.0, 0))])
    f = int(n * 0.55)
    meow(c, [f], dur=18)
    h = bpy.data.objects[p['head']]
    h.keyframe_insert('rotation_euler', frame=f + 6)
    h.rotation_euler = (0.25, 0, 0.5); h.keyframe_insert('rotation_euler', frame=f + 24)
    cam = camera(40, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (2.6, -2.2, 1.6), (-0.8, 1.4, 0.6)), (1, (1.2, -0.9, 0.9), (-0.8, 1.4, 0.6))], n)
    return M([(f, 0.9, 1.05)], bed=0.0, amb='room')


# カット表：章番号 -> [(その章で何行目から, 関数)]
SHOTS = {
    0: [(-1, s00a), (2, s00b), (3, s00c), (4, s00d), (5, s00e), (6, s00f)],
    1: [(-1, s01a), (2, s01b), (5, s01c), (8, s01d), (12, s01e), (14, s01f), (16, s01g)],
    2: [(-1, s02a), (4, s02b), (12, s02c)],
    3: [(-1, s03a), (2, s03b), (7, s03c)],
    4: [(-1, s04a), (5, s04b), (6, s04c)],
    5: [(-1, s05a), (1, s05b), (5, s05c), (7, s05d)],
    6: [(-1, s06a), (5, s06b), (9, s06c)],
    7: [(-1, s07a), (2, s07b), (7, s07c)],
    8: [(-1, s08a), (7, s08b)],
    9: [(-1, s09a), (5, s09b)],
    10: [(-1, s10a), (6, s10b), (7, s10c)],
    11: [(-1, s11a), (5, s11b)],
    12: [(-1, s12a), (4, s12b), (7, s12c)],
    13: [(-1, s13a), (7, s13b)],
    14: [(-1, s14a), (5, s14b), (10, s14c), (12, s14d), (14, s14e)],
    15: [(-1, s15a), (1, s15b)],
}
