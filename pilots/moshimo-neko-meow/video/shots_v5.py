"""改稿（03_script_v5.md、社長コメント 2026-11-21）のカット。
既存のカット（shots.py）を使い回し、21場面に足りないもの（公園の鳩・スズメ、カラス、犬、虫、駅・教室・スタジオ・式場、
船、夜間の動物病院など）をここで足す。使い方は shots.py と同じ（render_shot.py が NEKO_VER=v5 のときに読む）。"""
import math, random
from shots import *
from shots import _tl, _font
from kit import COATS

R5 = random.Random(21)

# ---------------- 共通の部品 ----------------
COATS['dog_brown'] = {'base': hexc('#b07a48'), 'belly': hexc('#ecd8b8'), 'stripe': hexc('#b07a48')}
COATS['dog_white'] = {'base': hexc('#f1ece2'), 'belly': hexc('#ffffff'), 'stripe': hexc('#f1ece2')}
COATS['dog_black'] = {'base': hexc('#2d2a28'), 'belly': hexc('#c9b8a0'), 'stripe': hexc('#2d2a28')}


def dog(loc, coat='dog_brown', s=1.0, rot_z=0.0, pose='sit', name='dog'):
    """犬：猫の体を大きくし、立ち耳をたれ耳に、鼻先を長くする（動きは animate_life が付ける）"""
    root = cat(loc, coat, s=s, rot_z=rot_z, pose=pose, name=name)
    head = bpy.data.objects[root['head']]
    C = COATS[coat]
    for ch in list(head.children):
        if ch.name.startswith('cone'):
            ch.scale = (0, 0, 0)
        elif ch.name.startswith('sph') and abs(ch.location.y + 0.122) < 0.01:
            ch.scale = (0, 0, 0)  # 猫の鼻
    ears = []
    for sx in (-1, 1):
        e = sphere((sx * 0.105, 0.0, 0.02), 0.05, hexc('#6a4a30') if coat == 'dog_brown' else C['base'], scale=(0.45, 0.8, 1.5))
        link(e, head); ears.append(e)
    link(sphere((0, -0.13, -0.04), 0.06, C['belly'], scale=(1.0, 1.5, 0.8)), head)
    link(sphere((0, -0.215, -0.02), 0.022, hexc('#1a1a1a')), head)
    mouth = bpy.data.objects[root['mouth']]
    mouth.location = (0, -0.19, -0.075)
    root['ears'] = [e.name for e in ears]
    return root


def boxc(loc, size, rgb, rot=(0, 0, 0), bevel=0.0):
    """原点が中心にある箱（box() は位置をメッシュに焼き込むため、動かす箱はこちら）"""
    o = box((0, 0, 0), size, rgb, rot=rot, bevel=bevel)
    o.location = loc
    return o


def crow(loc, s=2.3, rot_z=0, name='crow'):
    b = bird(loc, c=hexc('#1b1c20'), s=s, rot_z=rot_z, name=name)
    for ch in b.children:
        if ch.name.startswith('cone'):
            setmat(ch, hexc('#2a2a2e'))
    return b


def pigeon(loc, s=1.7, rot_z=0, name='pigeon'):
    return bird(loc, c=R5.choice([hexc('#8d939c'), hexc('#7b818a'), hexc('#a2a6ad')]), s=s, rot_z=rot_z, name=name)


def sparrow(loc, s=1.0, rot_z=0, name='sparrow'):
    return bird(loc, c=R5.choice([hexc('#8a6a4a'), hexc('#7a5a3c')]), s=s, rot_z=rot_z, name=name)


def peck(b, n, rnd, up_windows=(), period=(10, 18)):
    """鳥が地面をつつく（前に傾く）。up_windows の間は顔を上げたまま"""
    f = rnd.randint(1, 10)
    b.rotation_euler.x = 0; b.keyframe_insert('rotation_euler', frame=1)
    while f < n:
        if any(a <= f <= z for a, z in up_windows):
            b.rotation_euler.x = -0.15; b.keyframe_insert('rotation_euler', frame=f)
            f += 6; continue
        b.rotation_euler.x = 0.0; b.keyframe_insert('rotation_euler', frame=f)
        b.rotation_euler.x = 0.75; b.keyframe_insert('rotation_euler', frame=f + 3)
        b.rotation_euler.x = 0.0; b.keyframe_insert('rotation_euler', frame=f + 6)
        f += rnd.randint(*period)


def flap(b, f0, f1, period=4):
    """翼をはばたかせる（翼の箱を上下に）"""
    wings = [c for c in b.children if c.name.startswith('box')]
    for w in wings:
        w.keyframe_insert('rotation_euler', frame=f0)
        for f in range(f0, f1, period):
            w.rotation_euler = (0, (0.9 if (f // period) % 2 else -0.4) * (1 if w.location.x > 0 else -1), 0)
            w.keyframe_insert('rotation_euler', frame=f)
        w.rotation_euler = (0, 0, 0); w.keyframe_insert('rotation_euler', frame=f1)


def caw_times(n, every=(30, 60), rnd=None, start=5):
    rnd = rnd or R5
    f = start; out = []
    while f < n - 8:
        out.append(f); f += rnd.randint(*every)
    return out


def bush(loc, r=0.7, c=None):
    c = c or hexc('#5f8a4a')
    sphere(loc, r, c, scale=(1.3, 1.0, 0.75))
    sphere((loc[0] + r * 0.6, loc[1] + 0.1, loc[2]), r * 0.7, hexc('#6d9654'), scale=(1.2, 1.0, 0.8))


def pole_wires(x0, x1, y, h=6.0):
    for x in (x0, x1):
        cyl((x, y, h / 2), 0.13, h, hexc('#8c8a86'))
        box((x, y, h - 0.4), (1.4, 0.12, 0.12), hexc('#6a6864'))
    for k, dz in enumerate((-0.4, -0.9)):
        box(((x0 + x1) / 2, y, h + dz), (abs(x1 - x0), 0.025, 0.025), hexc('#2a2a2a'))


def park(night=False):
    sky(hexc('#9cc3e3')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.5
    ground(rgb=hexc('#93b36f'))
    box((0, 0, 0.005), (4, 60, 0.01), hexc('#d8c9a8'))  # 小道
    for i in range(7):
        tree((-9 + i * 3.2, 9 + (i % 2) * 1.5, 0), s=0.8)
    for x in (-5, 5):
        box((x, 3, 0.25), (1.6, 0.45, 0.05), hexc('#8a6a48'))  # ベンチ
        box((x, 3.2, 0.45), (1.6, 0.05, 0.35), hexc('#8a6a48'))


def label3d(s, loc, size, rgb=None, rot=(math.pi / 2, 0, 0)):
    return text3d(s, loc, size, rgb or hexc('#ffffff'), rot=rot)


def swap_planes(a, b, f):
    """f フレームで板 a を消して板 b を出す"""
    pr = bpy.context.preferences.edit; old = pr.keyframe_new_interpolation_type
    pr.keyframe_new_interpolation_type = 'CONSTANT'
    b_s = b.scale.copy(); a_s = a.scale.copy()
    b.scale = (0, 0, 0); b.keyframe_insert('scale', frame=1)
    a.keyframe_insert('scale', frame=1)
    a.scale = (0, 0, 0); a.keyframe_insert('scale', frame=f)
    b.scale = b_s; b.keyframe_insert('scale', frame=f)
    pr.keyframe_new_interpolation_type = old


def appear(o, f, grow=6):
    """f フレームで、ぽんと出す"""
    pr = bpy.context.preferences.edit; old = pr.keyframe_new_interpolation_type
    pr.keyframe_new_interpolation_type = 'CONSTANT'
    s0 = o.scale.copy()
    o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=1)
    o.scale = s0; o.keyframe_insert('scale', frame=max(2, f))
    pr.keyframe_new_interpolation_type = old


def screen_scene():
    sky(hexc('#2a2f3a')); s = bpy.context.scene; s.view_settings.exposure = 0.2
    s.display.shading.light = 'FLAT'; s.display.shading.show_shadows = False; s.display.shading.show_cavity = False


def tex(name, draw, size=(1920, 1080)):
    return name, draw, size


# ---------------- SCENE 01 窓を開けた瞬間 ----------------
def window_room(n, pane_open=None, pane_close=None, month=False):
    """窓のある部屋（主観）。窓の外に家並みと猫。pane_open / pane_close：ガラス戸を開ける／閉めるフレーム"""
    sky(hexc('#a9c7e2')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    light_dir((0.4, -0.5, 0.7))
    W, D, H = 6, 5, 2.6
    box((0, 0, -0.05), (W, D, 0.1), hexc('#b48a63'))
    wall = hexc('#efe7da')
    # 奥の壁（窓の穴を残す）
    box((-1.95, D / 2, H / 2), (2.1, 0.12, H), wall); box((1.95, D / 2, H / 2), (2.1, 0.12, H), wall)
    box((0, D / 2, 0.4), (1.8, 0.12, 0.8), wall); box((0, D / 2, 2.35), (1.8, 0.12, 0.5), wall)
    box((-W / 2, 0, H / 2), (0.1, D, H), wall)
    for x in (-0.92, 0.92):
        box((x, D / 2 - 0.02, 1.4), (0.06, 0.16, 1.3), hexc('#f7f3ea'))
    pane = boxc((0.45, D / 2 - 0.05, 1.42), (0.9, 0.03, 1.2), hexc('#bcd3e6'))
    box((-0.45, D / 2 - 0.08, 1.42), (0.9, 0.03, 1.2), hexc('#bcd3e6'))  # 動かない側のガラス
    # 開いている位置：右のガラスを左へ重ねる
    if pane_open is not None:
        pane.keyframe_insert('location', frame=1); pane.keyframe_insert('location', frame=pane_open)
        pane.location.x = -0.45; pane.keyframe_insert('location', frame=pane_open + 14)
    elif pane_close is not None:
        pane.location.x = -0.45; pane.keyframe_insert('location', frame=1); pane.keyframe_insert('location', frame=pane_close)
        pane.location.x = 0.45; pane.keyframe_insert('location', frame=pane_close + 14)
    else:
        pane.location.x = -0.45
    # 外
    ground(rgb=hexc('#b9b2a2'))
    house((-4, 10, 0), 6, 5, 5.5); house((5, 12, 0), 7, 6, 6.0, floors=2); house((-1, 22, 0), 8, 6, 7)
    wall_fence((0, 6.5, 0), 14)
    road((0, 7.8, 0.01), 30, width=2.2, rot_z=math.pi / 2)
    outs = [cat((0.5, 6.5, 1.3), 'kuro', s=0.62, rot_z=math.pi), cat((2.4, 9.0, 0), 'mike', s=0.62, rot_z=2.6),
            cat((1.2, 15.0, 0), 'saba', s=0.62, rot_z=3.4)]
    feet = cat((0.5, 0.9, 0), 'tora', s=0.62, rot_z=math.pi * 0.95, name='basecat')
    if month:
        table((-2.4, 0.4, 0), 0.6, 1.2, 0.72, rot_z=0); laptop((-2.4, 0.4, 0.75), rot_z=-math.pi / 2)
    return outs, feet


def nWinOpen(n):
    f = 10
    outs, feet = window_room(n, pane_open=f)
    rnd = random.Random(1); ev = []
    for i, c in enumerate(outs):
        fr = meow_times(n, every=(35, 60), start=(f + 6 + i * 8, f + 20 + i * 8), rng=rnd); meow(c, fr)
        ev += [(x, 0.5 - i * 0.1, rnd.uniform(0.9, 1.25)) for x in fr]
    fr = meow_times(n, every=(45, 70), start=(30, 40), rng=rnd); meow(feet, fr)
    ev += [(x, 1.0, 1.0) for x in fr]
    cam = camera(30)
    cam_path(cam, [(0, (0.45, -1.6, 1.55), (0.45, 6, 1.4)), (0.25, (0.45, 0.8, 1.5), (0.6, 8, 1.1)),
                   (0.6, (0.45, 1.6, 1.45), (1.6, 9.0, 0.8)), (1, (0.4, 0.0, 1.2), (0.5, 0.9, 0.2))], n)
    return M(ev, bed=1.0, amb='city', silent_until=f + 4)


def nWinClose(n):
    f = int(n * 0.3)
    outs, feet = window_room(n, pane_close=f)
    rnd = random.Random(2); ev = []
    for i, c in enumerate(outs):
        fr = [x for x in meow_times(n, every=(35, 60), rng=rnd) if x < f + 10]; meow(c, fr)
        ev += [(x, 0.45, rnd.uniform(0.9, 1.25)) for x in fr]
    fr = meow_times(n, every=(40, 65), rng=rnd); meow(feet, fr); ev += [(x, 1.0, 1.0) for x in fr]
    p = person((0.3, 1.6, 0), hexc('#c7d3e0'), rot_z=0, name='you')
    cam = camera(28)
    cam_path(cam, [(0, (2.2, -1.6, 1.5), (0.2, 2.3, 1.2)), (1, (1.8, -1.2, 1.2), (0.4, 1.4, 0.5))], n)
    return M(ev, bed=0.15, amb='room')


def nWinMonth(n):
    f = 10
    outs, feet = window_room(n, pane_open=f, month=True)
    rnd = random.Random(3); ev = []
    for i, c in enumerate(outs):
        fr = meow_times(n, every=(40, 70), start=(f + 6, f + 30), rng=rnd); meow(c, fr)
        ev += [(x, 0.4, rnd.uniform(0.9, 1.25)) for x in fr]
    cam = camera(30)
    cam_path(cam, [(0, (0.45, -1.6, 1.55), (0.45, 6, 1.4)), (0.4, (0.45, 0.8, 1.5), (0.8, 8, 1.1)), (1, (0.4, -1.0, 1.6), (-2.2, 0.5, 0.7))], n)
    return M(ev, bed=0.8, amb='city', silent_until=f + 4)


def nPigeonUp(n):  # 公園の鳩が一斉に顔を上げる
    park()
    bush((-2.5, 1.5, 0.45), 0.8)
    c = cat((-2.3, 0.9, 0), 'saba', s=0.62, rot_z=0.3, pose='crouch')
    fr = [int(n * 0.35), int(n * 0.35) + 60]; meow(c, fr)
    rnd = random.Random(5)
    for i in range(9):
        b = pigeon((rnd.uniform(-0.5, 2.5), rnd.uniform(-1.5, 1.5), 0), rot_z=rnd.uniform(-3, 3))
        peck(b, n, rnd, up_windows=[(fr[0], n)])
        b.rotation_euler.z += 0.0
    cam = camera(40, dof=4.0, fstop=2.8)
    cam_path(cam, [(0, (3.4, -3.6, 0.5), (0.4, 0.4, 0.2)), (1, (2.8, -3.0, 0.45), (0.0, 0.6, 0.2))], n)
    return M([(x, 0.6, 1.0) for x in fr], bed=0.7, amb='day')


def crow_wire_scene(n, watch=False):
    sky(hexc('#b7d0e6')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    light_dir((0.4, -0.5, 0.7))
    ground(rgb=hexc('#b9b2a2'))
    house((-6, 7, 0), 7, 6, 5.5); house((6, 8, 0), 7, 6, 6.2)
    pole_wires(-6, 6, 2.0, h=6.0)
    wall_fence((0, 0.5, 0), 16)
    c = cat((1.2, 0.5, 1.3), 'kuro', s=0.62, rot_z=math.pi)
    fr = meow_times(n, every=(45, 70)); meow(c, fr)
    rnd = random.Random(8); crows = []; caws = []
    for i, x in enumerate((-3.5, -1.8, 0.4, 2.6)):
        b = crow((x, 2.0, 5.6), s=3.6, rot_z=rnd.uniform(-0.3, 0.3) + math.pi)
        crows.append(b)
        # 声のする方へ首をかしげる（体ごと向きを変える）
        f0 = fr[0] + 4 + i * 3
        b.keyframe_insert('rotation_euler', frame=1); b.keyframe_insert('rotation_euler', frame=f0)
        b.rotation_euler = (0.35, 0.25 * (1 if x < 1.2 else -1), math.atan2(1.2 - x, 2.0 - 0.5) + math.pi * 0 + math.pi)
        b.keyframe_insert('rotation_euler', frame=f0 + 8)
        if watch and i % 2 == 0:
            caws += [(x_, 0.7) for x_ in caw_times(n, (40, 80), rnd, start=f0 + 20)]
    cam = camera(40)
    cam_path(cam, [(0, (0.5, -5.0, 2.4), (-0.5, 2, 5.0)), (1, (-0.3, -4.0, 2.2), (-0.3, 2, 4.6))], n)
    m = M([(x, 0.6, 1.0) for x in fr], bed=0.6, amb='day'); m['crows'] = caws
    return m


def nCrowWire(n):
    return crow_wire_scene(n)


def nCrowWatch(n):
    return crow_wire_scene(n, watch=True)


def dog_room(n, mode='bark'):
    living_room()
    sofa((0.0, 1.7, 0), rot_z=0)
    if mode == 'bark':
        d = dog((0.0, 1.5, 0.45), 'dog_white', s=1.0, rot_z=math.pi, pose='sit', name='dog')
        fr = meow_times(n, every=(14, 24)); meow(d, fr, dur=8, lift=0.12)
        return M([], bed=0.6, amb='room') | {'barks': [(x, 0.8) for x in fr]}
    d = dog((0.0, 1.5, 0.45), 'dog_white', s=1.0, rot_z=math.pi, pose='crouch', name='dog')
    # 耳だけを声の方へ
    for en in d['ears']:
        e = bpy.data.objects[en]
        for f in range(1, n, 36):
            e.rotation_euler = (0, 0, 0); e.keyframe_insert('rotation_euler', frame=f)
            e.rotation_euler = (-0.5, 0, 0); e.keyframe_insert('rotation_euler', frame=f + 6)
    return M([], bed=0.6, amb='room')


def nDogBark(n):  # 窓に向かって吠える犬（SCENE 01）
    m = dog_room(n, 'bark')
    cam = camera(35, dof=2.6, fstop=2.4)
    cam_path(cam, [(0, (1.7, 2.3, 1.1), (0, 1.5, 0.75)), (1, (1.4, 2.1, 1.0), (0, 1.5, 0.75))], n)
    return m


def nDogBark2(n):  # 最初の一日、吠え続ける（SCENE 10）
    m = dog_room(n, 'bark')
    cam = camera(30, dof=3.0, fstop=2.4)
    cam_path(cam, [(0, (-1.8, -1.6, 1.3), (0, 1.6, 0.8)), (1, (-1.2, -1.0, 1.1), (0, 1.6, 0.8))], n)
    return m


def nDogQuiet(n):  # 三日後、同じ構図で吠えない
    m = dog_room(n, 'quiet')
    cam = camera(30, dof=3.0, fstop=2.4)
    cam_path(cam, [(0, (-1.8, -1.6, 1.3), (0, 1.6, 0.8)), (1, (-1.2, -1.0, 1.1), (0, 1.6, 0.8))], n)
    return m


def street_env(night=False, corner=True):
    """一本道の住宅街（道は y 方向、幅3m。x=±2 に塀、その外に家）"""
    if night:
        sky(hexc('#0e1a33')); s = bpy.context.scene; s.view_settings.exposure = -0.3
        light_dir((0.2, -0.6, 0.5)); s.display.shading.shadow_intensity = 0.25
        ground(rgb=hexc('#262a33'))
    else:
        sky(hexc('#b7d0e6')); s = bpy.context.scene; s.view_settings.exposure = 0.35
        ground(rgb=hexc('#b9b2a2'))
    road((0, 0, 0.01), 60, width=3.0, rot_z=math.pi / 2)
    for y in (-18, -6, 6, 18):
        if corner and y == 6:
            continue
        wall_fence((-2.2, y, 0), 10, rot_z=math.pi / 2); wall_fence((2.2, y, 0), 10, rot_z=math.pi / 2)
        house((-7, y, 0), 7, 8, 5.5, rot_z=0); house((7, y, 0), 7, 8, 6.0, rot_z=0)
    if corner:
        road((0, 6, 0.012), 30, width=3.0)  # 曲がり角
        house((-7, 6, 0), 7, 6, 5.5); house((8.5, 9.5, 0), 6, 4, 5.5)
    if night:
        for y in (-12, 0, 12):
            cyl((2.0, y, 2.2), 0.06, 4.4, hexc('#6a6864')); sphere((1.7, y, 4.3), 0.18, hexc('#ffe9a8'))


def nStreetLook(n):  # 道を歩く人が足を止め、あたりを見回す
    street_env(corner=False)
    rnd = random.Random(4)
    ps = []
    for i in range(5):
        x = rnd.uniform(-1.2, 1.2); y0 = -4 - i * 2.2
        p = person((x, y0, 0), rnd.choice([hexc('#3d5a80'), hexc('#c46a4a'), hexc('#4a6b4a'), hexc('#8a8a8a'), hexc('#d9b26a')]),
                   rot_z=math.pi * (1 if i % 2 else 0), name=f'walker{i}')
        stop = int(n * rnd.uniform(0.25, 0.4))
        dy = 2.4 if i % 2 == 0 else -2.4
        move(p, [(1, (x, y0, 0)), (stop, (x, y0 + dy, 0)), (n, (x, y0 + dy, 0))])
        h = bpy.data.objects[p['head']]
        for f, a in ((stop, 0), (stop + 14, 0.8), (stop + 40, -0.8), (stop + 60, 0.3)):
            h.rotation_euler = (0, 0, a); h.keyframe_insert('rotation_euler', frame=min(f, n))
        ps.append(p)
    cam = camera(30)
    cam_path(cam, [(0, (1.0, -18, 2.0), (0, -6, 1.2)), (1, (0.6, -16, 1.9), (0, -6, 1.2))], n)
    return M([], bed=1.0, amb='city')


def nNoCatRoom(n):  # 猫を飼っていない人の部屋（昼）
    sky(hexc('#d9d2c4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(4.5, 4, 2.5, floor=hexc('#a88b6c'), wall=hexc('#e9e4da'))
    bed((-1.4, 0.6, 0)); table((1.0, 1.4, 0), 1.0, 0.6, 0.72); laptop((1.0, 1.45, 0.75), rot_z=math.pi)
    p = person((0.6, 0.3, 0), hexc('#6a7a9a'), rot_z=math.pi * 0.95, name='neighbor')
    h = bpy.data.objects[p['head']]
    for f, a in ((1, 0), (int(n * 0.3), 0.6), (int(n * 0.6), -0.4), (n, 0.2)):
        h.rotation_euler = (0, 0, a); h.keyframe_insert('rotation_euler', frame=f)
    cam = camera(30, dof=2.6, fstop=2.4)
    cam_path(cam, [(0, (1.8, -1.8, 1.6), (0.2, 1.5, 1.2)), (1, (1.3, -1.2, 1.5), (0.4, 1.5, 1.3))], n)
    return M([], bed=0.8, amb='room')


# ---------------- SCENE 02 足元の一匹 ----------------
def nPhone(n):  # スマホの通話、足元で鳴く猫
    living_room()
    p = person((-0.3, 1.2, 0), hexc('#c7d3e0'), rot_z=math.pi * 0.9, act='phone', name='you')
    c = cat((0.2, 0.6, 0), 'tora', s=0.62, rot_z=math.pi * 0.85, name='basecat')
    ev = add_meows([c], n, every=(30, 50))
    cam = camera(40, dof=2.2, fstop=2.0)
    cam_path(cam, [(0, (2.0, -1.8, 1.3), (-0.2, 1.0, 0.9)), (1, (1.6, -1.3, 1.1), (-0.1, 0.9, 0.6))], n)
    return M(ev, bed=0.3, amb='room')


def draw_tv(vol):
    def f(im, d):
        d.rectangle((0, 0, 1920, 1080), fill=(70, 110, 150))
        d.rectangle((0, 700, 1920, 1080), fill=(90, 140, 90))
        d.ellipse((1300, 120, 1560, 380), fill=(250, 220, 120))
        d.rounded_rectangle((120, 860, 1000, 1000), 30, fill=(20, 24, 30))
        d.text((170, 885), '音量', font=_font(70), fill=(255, 255, 255))
        for k in range(10):
            col = (120, 220, 140) if k < vol else (80, 86, 96)
            d.rectangle((400 + k * 56, 900, 440 + k * 56, 965), fill=col)
    return f


def nTV(n):  # テレビの音量を二つ上げる
    living_room()
    sofa((-1.2, -0.2, 0), rot_z=math.pi)
    p = person((-1.2, -0.25, 0.1), hexc('#c7d3e0'), pose='sit', rot_z=0, name='you')
    c = cat((-0.2, 0.6, 0), 'tora', s=0.62, rot_z=math.pi * 0.2, name='basecat')
    ev = add_meows([c], n, every=(40, 65))
    a = tex_plane('tv_lo', draw_tv(4), (2.4, 2.48, 1.3), 1.15, 0.65)
    b = tex_plane('tv_hi', draw_tv(6), (2.4, 2.48, 1.3), 1.15, 0.65)
    swap_planes(a, b, int(n * 0.3))
    cam = camera(35)
    cam_path(cam, [(0, (-2.6, -2.2, 1.5), (1.8, 2.4, 1.1)), (1, (-2.2, -1.7, 1.4), (2.2, 2.4, 1.2))], n)
    return M(ev, bed=0.4, amb='room')


# ---------------- SCENE 04 6億匹の合唱 ----------------
_LAND = None
def land_points(lon0, lon1, lat0, lat1, k, seed=1):
    global _LAND
    from PIL import Image
    if _LAND is None:
        _LAND = Image.open('/home/user/work_neko/assets/earth.png').convert('RGB').resize((1024, 512))
    W, H = _LAND.size
    rnd = random.Random(seed); out = []
    tries = 0
    while len(out) < k and tries < k * 200:
        tries += 1
        lon = rnd.uniform(lon0, lon1); lat = rnd.uniform(lat0, lat1)
        px = int((lon + 180) / 360 * (W - 1)); py = int((90 - lat) / 180 * (H - 1))
        r, g, b = _LAND.getpixel((px, py))
        if g > b + 5 or (r > 150 and g > 140 and b < 140):
            out.append((lon, lat))
    return out


def P(lon, lat, r):
    a = math.radians(lon); b = math.radians(lat)
    return (r * math.cos(b) * math.cos(a), r * math.cos(b) * math.sin(a), r * math.sin(b))


def space_globe():
    sky(hexc('#03050c')); s = bpy.context.scene; s.view_settings.exposure = 0.25
    s.display.shading.show_shadows = False; s.display.shading.show_cavity = False
    s.display.shading.light = 'FLAT'
    g = globe((0, 0, 0), 6.0, tex='/home/user/work_neko/assets/earth.png')
    rnd = random.Random(3)
    for i in range(200):
        th = rnd.uniform(0, 2 * math.pi); ph = rnd.uniform(-1, 1)
        r = 120; x = r * math.cos(th) * math.sqrt(1 - ph * ph); y = r * math.sin(th) * math.sqrt(1 - ph * ph)
        sphere((x, y, r * ph), rnd.uniform(0.08, 0.22), (0.9, 0.9, 1.0), seg=6)
    return g


def dots(pts, f0, f1, size=0.05, rgb=None, seed=2):
    rnd = random.Random(seed); out = []
    rgb = rgb or hexc('#ffcf5a')
    for lon, lat in pts:
        o = sphere(P(lon, lat, 6.02), size, rgb, seg=6)
        appear(o, rnd.randint(f0, max(f0 + 1, f1)), grow=4)
        out.append(o)
    return out


def nDotsJapan(n):  # 日本地図に飼い猫の点が灯る
    space_globe()
    dots(land_points(129, 146, 30.5, 45.5, 260, seed=1), 10, int(n * 0.8), size=0.03)
    cam = camera(50)
    cam_path(cam, [(0, P(137, 37, 13.5), P(137, 37, 0)), (1, P(137, 36, 11.5), P(137, 36, 0))], n)
    return M([], bed=0.5, amb='space')


def nDotsWorld(n):  # 地球全体に点が広がる
    space_globe()
    dots(land_points(-170, 180, -45, 68, 700, seed=2), 1, int(n * 0.7), size=0.06)
    cam = camera(50)
    cam_path(cam, [(0, P(140, 30, 20), (0, 0, 0)), (1, P(60, 25, 26), (0, 0, 0))], n)
    return M([], bed=0.5, amb='space')


def nDotsSpread(n):  # 点が世界中に散らばった本当の姿。あなたの周りだけが光る
    space_globe()
    for lon, lat in land_points(-170, 180, -45, 68, 700, seed=2):
        sphere(P(lon, lat, 6.02), 0.05, hexc('#8a7a50'), seg=6)
    near = [sphere(P(139.7 + R5.uniform(-0.6, 0.6), 35.7 + R5.uniform(-0.5, 0.5), 6.03), 0.06, hexc('#ffe27a'), seg=8) for _ in range(5)]
    cam = camera(50)
    cam_path(cam, [(0, P(60, 25, 26), (0, 0, 0)), (0.6, P(130, 33, 18), P(139.7, 35.7, 0)), (1, P(139.7, 35.7, 8.0), P(139.7, 35.7, 0))], n)
    return M([], bed=0.4, amb='space')


def nPile(n):  # 6億匹を1か所に集めた想像の図：救急車のサイレンと、その上へ
    sky(hexc('#1c2230')); s = bpy.context.scene; s.view_settings.exposure = 0.3
    light_dir((0.4, -0.6, 0.7))
    box((0, 0, -0.05), (30, 30, 0.1), hexc('#3a4050'))
    # 救急車（すぐ横）
    car((-5.5, 0, 0), rot_z=0, c=hexc('#f4f4f2'))
    light = sphere((-5.5, 0, 1.75), 0.18, hexc('#ff3b3b'))
    blink(light, n, 6)
    # 音の大きさの柱
    hs = 3.2; hc = 7.5
    sb = box((-2.2, 0, 0), (1.4, 1.4, 0.02), hexc('#e05a4a'))
    cb = box((2.6, 0, 0), (1.4, 1.4, 0.02), hexc('#f2b84b'))
    for o, h, f0 in ((sb, hs, int(n * 0.1)), (cb, hc, int(n * 0.35))):
        o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=f0)
        o.scale = (1, 1, h / 0.02); o.location.z = h / 2
        o.keyframe_insert('scale', frame=f0 + 36); o.keyframe_insert('location', frame=f0 + 36)
        o.location.z = 0; o.keyframe_insert('location', frame=f0)
    t1 = label3d('すぐ横の救急車', (-2.2, -0.9, hs + 0.5), 0.42, rot=(math.pi / 2, 0, 0)); appear(t1, int(n * 0.1) + 30)
    t2 = label3d('6億匹の猫', (2.6, -0.9, hc + 0.5), 0.5, hexc('#ffe2a0')); appear(t2, int(n * 0.35) + 36)
    # 足元に集まった猫の山
    rnd = random.Random(6)
    cols = [COATS[k]['base'] for k in ('tora', 'kuro', 'shiro', 'saba', 'mike')]
    for i in range(240):
        a = rnd.uniform(0, 2 * math.pi); r = rnd.uniform(0, 2.2) ** 1.0
        z = max(0.1, 1.4 * (1 - (r / 2.3) ** 2)) * rnd.uniform(0.5, 1.0)
        sphere((6.8 + r * math.cos(a), 1.5 + r * math.sin(a), z), 0.18, rnd.choice(cols), seg=8)
    cam = camera(32)
    cam_path(cam, [(0, (0.5, -15, 3.5), (0.5, 0, 2.5)), (1, (1.5, -17, 6.5), (1.5, 0, 5.0))], n)
    return M([], bed=0.6, amb='space')


def nNoiseMap(n):  # 猫の多い路地ほどうるさい。静かな場所とうるさい場所の線
    env_town(seed=7)
    rnd = random.Random(7)
    for i in range(7):
        x, y = rnd.uniform(-35, 35), rnd.uniform(-35, 35)
        d = cyl((x, y, 6.5), 7.0, 0.05, hexc('#e8604a')); appear(d, int(n * 0.1) + i * 10, grow=18)
        c = cat((x, y, 0), rnd.choice(['tora', 'kuro', 'saba']), s=0.62)
        fr = meow_times(n, every=(40, 70), rng=rnd); meow(c, fr)
        rings((x, y, 0.4), fr, rgb=(1, 0.85, 0.6), size=4.0, n=1)
    for i in range(4):
        x, y = rnd.uniform(-35, 35), rnd.uniform(-35, 35)
        d = cyl((x, y, 6.4), 6.0, 0.05, hexc('#5a8ad0')); appear(d, int(n * 0.45) + i * 10, grow=18)
    t1 = label3d('うるさい', (-10, -42, 6), 3.0, hexc('#ffb09a'), rot=(math.pi / 3, 0, 0)); appear(t1, int(n * 0.3))
    t2 = label3d('静か', (14, -42, 6), 3.0, hexc('#a9c8ff'), rot=(math.pi / 3, 0, 0)); appear(t2, int(n * 0.6))
    cam = camera(30)
    cam_path(cam, [(0, (0, -95, 95), (0, -5, 0)), (1, (0, -80, 82), (0, -8, 0))], n)
    return M([], bed=0.8, amb='city')


# ---------------- SCENE 05 鳩とスズメ ----------------
def nPigeonPeck(n):  # 鳩が餌をつつく → 植え込みの声 → 顔を上げる、の繰り返し
    park()
    bush((-2.0, 1.8, 0.45), 0.9)
    c = cat((-1.8, 1.2, 0), 'tora', s=0.62, rot_z=0.2, pose='crouch')
    fr = meow_times(n, every=(60, 90), start=(20, 30)); meow(c, fr)
    ups = [(f, f + 34) for f in fr]
    rnd = random.Random(9)
    for i in range(10):
        b = pigeon((rnd.uniform(-0.2, 2.6), rnd.uniform(-1.6, 1.2), 0), rot_z=rnd.uniform(-3, 3))
        peck(b, n, rnd, up_windows=ups)
    for i in range(30):
        sphere((rnd.uniform(-0.2, 2.6), rnd.uniform(-1.6, 1.2), 0.01), 0.015, hexc('#e9d9a0'), seg=6)
    cam = camera(45, dof=3.0, fstop=2.4)
    cam_path(cam, [(0, (2.8, -3.2, 0.35), (0.8, 0.0, 0.15)), (1, (2.2, -2.6, 0.32), (0.6, 0.2, 0.15))], n)
    return M([(f, 0.6, 1.0) for f in fr], bed=0.5, amb='day')


def sparrow_scene(n, seed=10, far=False):
    park()
    bush((-3.0, 1.0, 0.45), 0.9)
    c = cat((-2.8, 0.4, 0), 'kuro', s=0.62, rot_z=0.4, pose='crouch')
    fr = meow_times(n, every=(50, 80)); meow(c, fr)
    pole_wires(1.5, 9.5, 2.5, h=5.0)
    rnd = random.Random(seed)
    for i in range(8):
        b = sparrow((rnd.uniform(-2.2, -0.8), rnd.uniform(-0.8, 0.8), 0), rot_z=rnd.uniform(-3, 3))
        dst = (rnd.uniform(3.5, 7.5), rnd.uniform(1.8, 3.2), 0)
        f0 = int(n * 0.15) + i * 6
        if far:
            b.location = dst; peck(b, n, rnd)
            continue
        b.keyframe_insert('location', frame=f0)
        mid = ((b.location.x + dst[0]) / 2, (b.location.y + dst[1]) / 2, 1.2)
        b.location = mid; b.keyframe_insert('location', frame=f0 + 14)
        b.location = dst; b.keyframe_insert('location', frame=f0 + 30)
        flap(b, f0, f0 + 30)
    cam = camera(35, dof=3.5, fstop=2.8)
    if far:
        cam_path(cam, [(0, (3.5, -1.8, 0.6), (5.5, 2.5, 0.2)), (1, (4.2, -1.2, 0.6), (5.5, 2.5, 0.2))], n)
    else:
        cam_path(cam, [(0, (-0.6, -3.2, 0.7), (0.5, 1.0, 0.3)), (1, (1.2, -3.0, 0.8), (4.0, 2.2, 0.4))], n)
    return M([(f, 0.4, 1.0) for f in fr], bed=0.4, amb='day')


def nSparrow(n):
    return sparrow_scene(n)


def nSparrowNew(n):  # 1か月後：電線の下の新しい餌場
    return sparrow_scene(n, seed=11, far=True)


def nParkTop(n):  # 上空からの図：猫の声のする場所を中心に、鳥のいない輪が広がる
    park()
    rnd = random.Random(12)
    spots = [(-4, 2), (5, -3)]
    for x, y in spots:
        bush((x, y, 0.45), 0.9)
        c = cat((x + 0.3, y - 0.5, 0), 'tora', s=0.62, pose='crouch')
        fr = meow_times(n, every=(40, 60)); meow(c, fr)
        rings((x, y, 0.6), fr, rgb=(1, 0.9, 0.6), size=3.5, n=2)
        d = cyl((x, y, 0.02), 0.5, 0.02, hexc('#d9e9c0'))
        d.keyframe_insert('scale', frame=1); d.scale = (8, 8, 1); d.keyframe_insert('scale', frame=int(n * 0.7))
    for i in range(36):
        x, y = rnd.uniform(-10, 10), rnd.uniform(-8, 8)
        b = pigeon((x, y, 0), s=1.6, rot_z=rnd.uniform(-3, 3))
        dmin = min(math.hypot(x - a, y - b_) for a, b_ in spots)
        if dmin < 4.0:
            sx, sy = [(x - a, y - b_) for a, b_ in spots if math.hypot(x - a, y - b_) == dmin][0]
            k = 4.6 / max(0.3, dmin)
            f0 = int(n * rnd.uniform(0.15, 0.55))
            b.keyframe_insert('location', frame=f0)
            b.location = (x + sx * (k - 1), y + sy * (k - 1), 0); b.keyframe_insert('location', frame=f0 + 30)
    cam = camera(35)
    cam_path(cam, [(0, (0, -6, 26), (0, 0, 0)), (1, (0, -4, 22), (0, 0, 0))], n)
    return M([], bed=0.5, amb='day')


# ---------------- SCENE 06 声で分かる、猫の居場所 ----------------
def nDuskMarks(n):  # 夕方の住宅街を上から。声のする場所に猫の印
    env_town(seed=5)
    s = bpy.context.scene; sky(hexc('#e6a878')); s.view_settings.exposure = 0.15; light_dir((0.8, -0.2, 0.35))
    rnd = random.Random(13)
    for i in range(10):
        x, y = rnd.uniform(-30, 30), rnd.uniform(-30, 30)
        c = cat((x, y, 0), rnd.choice(['tora', 'kuro', 'saba', 'shiro']), s=0.62, pose='crouch')
        fr = meow_times(n, every=(45, 75), rng=rnd); meow(c, fr)
        pin = cone((x, y, 7.0), 2.0, 3.6, hexc('#f2b84b'), rot=(math.pi, 0, 0))
        top = sphere((x, y, 9.2), 2.0, hexc('#f2b84b'))
        f = int(n * 0.08) + i * int(n * 0.06)
        appear(pin, f); appear(top, f)
    cam = camera(30)
    cam_path(cam, [(0, (0, -80, 80), (0, -5, 0)), (1, (10, -65, 62), (0, -2, 0))], n)
    return M([], bed=0.8, amb='city')


# ---------------- SCENE 08 最初の夜 ----------------
def nEarplugSleep(n):  # 耳栓をして眠る人
    c = env_bedroom(n)
    p = [o for o in bpy.data.objects if o.get('kind') == 'person'][0]
    h = bpy.data.objects[p['head']]
    for sx in (-0.14, 0.14):
        link(sphere((sx, 0, 0), 0.035, hexc('#f2c84b')), h)
    ev = add_meows([c], n, every=(50, 80), gain=0.5)
    cam = camera(50, dof=1.4, fstop=1.8)
    cam_path(cam, [(0, (1.0, -1.2, 1.4), (0, -0.05, 0.7)), (1, (0.8, -0.9, 1.25), (0, -0.05, 0.7))], n)
    return M(ev, bed=0.2, amb='night')


# ---------------- SCENE 09 カラスが覚える ----------------
def garbage_station(loc):
    x, y = loc
    box((x, y + 0.6, 0.6), (2.4, 0.08, 1.2), hexc('#9aa39a'))
    rnd = random.Random(4)
    for i in range(9):
        sphere((x + rnd.uniform(-1.0, 1.0), y + rnd.uniform(-0.2, 0.4), 0.22), 0.28, rnd.choice([hexc('#e8eef0'), hexc('#cfd8dc'), hexc('#3a3a3a')]), scale=(1, 0.9, 0.8))


def nCrowGarbage(n):  # ゴミ置き場で猫とカラスがにらみ合う
    sky(hexc('#c9d6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    ground(rgb=hexc('#b0aba0'))
    house((0, 6, 0), 8, 5, 5.5)
    garbage_station((0, 0))
    c = cat((-0.6, -1.3, 0), 'saba', s=0.62, rot_z=0.6, pose='crouch')
    fr = meow_times(n, every=(35, 55)); meow(c, fr)
    rnd = random.Random(14); caws = []
    for i, (x, y, z) in enumerate([(0.9, -0.6, 0), (1.5, -1.2, 0), (0.2, 0.6, 1.25), (-1.1, 0.6, 1.25)]):
        b = crow((x, y, z), s=2.4, rot_z=math.atan2(-1.3 - y, -0.6 - x) - math.pi / 2)
        ct = caw_times(n, (20, 45), rnd, start=rnd.randint(5, 20))
        for f in ct:
            flap(b, f, f + 10)
        caws += [(f, 0.8) for f in ct]
    cam = camera(35, dof=3.5, fstop=2.4)
    cam_path(cam, [(0, (3.2, -4.0, 1.2), (0, -0.4, 0.4)), (1, (2.4, -3.2, 1.0), (0.1, -0.4, 0.4))], n)
    m = M([(f, 0.8, 1.0) for f in fr], bed=0.5, amb='day'); m['crows'] = caws
    return m


def band_scene(n, other, other_rgb):
    screen_scene()
    box((0, 0.2, 0), (14, 0.05, 7.6), hexc('#1a1f2a'))
    t_axis = label3d('音の高さ', (-6.0, 0, 3.2), 0.35, hexc('#8a93a5'))
    ob = box((0.5, 0, 0.9), (11, 0.05, 0.55), other_rgb)
    lb = label3d(other, (0.5, -0.03, 0.78), 0.42, hexc('#0e1220'))
    cb = boxc((0.5, -0.04, 0.6), (11, 0.05, 0.3), hexc('#f2b84b'))
    f = int(n * 0.35)
    cb.keyframe_insert('scale', frame=1); cb.keyframe_insert('scale', frame=f); cb.keyframe_insert('location', frame=f)
    cb.scale = (1, 1, 8); cb.location.z = 0.85; cb.keyframe_insert('scale', frame=f + 30); cb.keyframe_insert('location', frame=f + 30)
    t = label3d('猫の声', (0.5, -0.1, 1.5), 0.6, hexc('#2a1a00')); appear(t, f + 30)
    cam = camera(35)
    cam_path(cam, [(0, (0, -12, 1.4), (0, 0, 1.4)), (1, (0, -11, 1.4), (0, 0, 1.4))], n)
    return f


def nBandCrow(n):  # カラスどうしの呼び声が、猫の声にかき消される
    f = band_scene(n, 'カラスどうしの呼び声', hexc('#6fa0c8'))
    m = M([(x, 0.6, 1.0) for x in range(f, n, 30)], bed=0.4, amb='day'); m['crows'] = [(x, 0.7) for x in range(8, n, 26)]
    return m


def nBandInsect(n):  # 虫の声の帯に、猫の声の帯がかぶさる
    f = band_scene(n, '虫の声', hexc('#8fc87a'))
    m = M([(x, 0.6, 1.0) for x in range(f, n, 28)], bed=0.3, amb='night'); m['insects'] = 1.0
    return m


def nCrowsTown(n):  # 朝の住宅街に猫の声とカラスの声が重なる
    env_town(seed=6)
    rnd = random.Random(15); caws = []
    for i in range(7):
        x0, y0 = rnd.uniform(-30, 10), rnd.uniform(-30, 10)
        b = crow((x0 * 0.4 + 5, y0 * 0.4 - 20, rnd.uniform(9, 13)), s=12.0, rot_z=-0.8)
        b.keyframe_insert('location', frame=1)
        b.location = (b.location.x + 14, b.location.y + 9, b.location.z + rnd.uniform(-1, 1)); b.keyframe_insert('location', frame=n)
        flap(b, 1, n, period=5)
        caws += [(f, 0.6) for f in caw_times(n, (30, 60), rnd, start=rnd.randint(5, 40))]
    cam = camera(30)
    cam_path(cam, [(0, (35, -70, 42), (0, -18, 0)), (1, (45, -80, 52), (0, -10, 0))], n)
    m = M([], bed=1.0, amb='city'); m['crows'] = caws
    return m


def nTrashStreet(n):  # 猫のいない通りに、散らかったゴミ置き場
    sky(hexc('#c9d6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    ground(rgb=hexc('#b0aba0'))
    house((0, 6, 0), 8, 5, 5.5); house((-9, 6, 0), 7, 5, 6)
    garbage_station((0, 0))
    rnd = random.Random(16)
    for i in range(26):
        box((rnd.uniform(-2.5, 2.5), rnd.uniform(-2.5, 0.2), 0.02), (rnd.uniform(0.1, 0.3), rnd.uniform(0.1, 0.3), 0.03),
            rnd.choice([hexc('#f2f2f2'), hexc('#e0c080'), hexc('#c04a3a'), hexc('#7aa0c8')]), rot=(0, 0, rnd.uniform(0, 3)))
    caws = []
    for i in range(4):
        b = crow((rnd.uniform(-1.5, 1.5), rnd.uniform(-2.0, -0.3), 0), s=2.4, rot_z=rnd.uniform(-3, 3))
        peck(b, n, rnd, period=(14, 24))
        caws += [(f, 0.5) for f in caw_times(n, (50, 90), rnd, start=rnd.randint(10, 50))]
    cam = camera(35)
    cam_path(cam, [(0, (3.5, -5.5, 1.6), (0, -0.8, 0.3)), (1, (2.4, -4.5, 1.4), (0, -0.8, 0.3))], n)
    m = M([], bed=0.2, amb='day'); m['crows'] = caws
    return m


# ---------------- SCENE 10 犬 ----------------
def nDogSofa(n):  # 音が苦手な犬は、ソファの下から出てこない
    living_room()
    root = empty((0, 1.6, 0), 'sofa2')
    for sx in (-0.9, 0.9):
        for sy in (-0.35, 0.35):
            link(box((sx, sy, 0.2), (0.08, 0.08, 0.4), hexc('#5a4632')), root)
    link(box((0, 0, 0.5), (2.0, 0.85, 0.2), hexc('#7b8a9a'), bevel=0.04), root)
    link(box((0, 0.35, 0.85), (2.0, 0.22, 0.6), hexc('#7b8a9a'), bevel=0.04), root)
    d = dog((0.2, 1.55, 0), 'dog_brown', s=0.85, rot_z=math.pi, pose='crouch', name='dog')
    c = cat((1.6, 0.4, 0), 'tora', s=0.62, rot_z=2.4)
    ev = add_meows([c], n, every=(40, 60))
    cam = camera(45, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (0.4, -0.9, 0.3), (0.2, 1.4, 0.2)), (1, (0.3, -0.5, 0.25), (0.2, 1.4, 0.2))], n)
    return M(ev, bed=0.3, amb='room')


def walk_scene(n, stop=True, seed=17):
    street_env(corner=True)
    c = cat((3.6, 6.8, 0), 'kuro', s=0.62, rot_z=math.pi / 2)
    fr = meow_times(n, every=(40, 60)); meow(c, fr)
    p = person((0.3, -4, 0), hexc('#5a7a9a'), rot_z=math.pi, name='owner')
    d = dog((-0.3, -3.2, 0), 'dog_brown', s=0.9, rot_z=math.pi, pose='walk', name='dog')
    leash = box((0, 0.4, 0.55), (0.02, 0.9, 0.02), hexc('#c04a3a'), rot=(0.55, 0, 0)); link(leash, d)
    if stop:
        f1 = int(n * 0.45); f2 = int(n * 0.65)
        move(p, [(1, (0.3, -4, 0)), (f1, (0.3, 4.5, 0)), (f2, (0.3, 4.5, 0)), (n, (0.3, -1.5, 0))])
        move(d, [(1, (-0.3, -3.2, 0)), (f1 - 6, (-0.3, 5.6, 0)), (f2, (-0.3, 5.4, 0)), (n, (-0.3, -0.5, 0))])
        for o in (p, d):
            o.keyframe_insert('rotation_euler', frame=f2); o.rotation_euler.z = 0; o.keyframe_insert('rotation_euler', frame=f2 + 12)
    else:
        move(p, [(1, (0.3, -4, 0)), (n, (0.3, 4, 0))]); move(d, [(1, (-0.3, -3.2, 0)), (n, (-0.3, 4.8, 0))])
    cam = camera(30)
    cam_path(cam, [(0, (1.2, -10, 1.8), (0, 2, 0.6)), (1, (1.0, -7, 1.7), (0, 4, 0.6))], n)
    return M([(f, 0.5, 1.0) for f in fr], bed=0.6, amb='day')


def nDogWalk(n):
    return walk_scene(n, stop=True)


def nDogWalkMonth(n):  # 1か月後：遠回りの散歩道を覚えた
    return walk_scene(n, stop=False, seed=18)


def nBirdcage(n):  # 窓辺の鳥かごが、家の奥へ運ばれる
    living_room()
    shelf = box((-2.6, 1.0, 0.5), (0.5, 1.2, 1.0), hexc('#8c6a4c'))
    cage = empty((0.6, 2.2, 1.0), 'cage')
    link(cyl((0, 0, 0.25), 0.25, 0.5, hexc('#d9d2b0'), verts=12), cage)
    link(cone((0, 0, 0.62), 0.27, 0.25, hexc('#c9b98a')), cage)
    b = sparrow((0, 0, 0.12), s=1.2); link(b, cage)
    box((0.6, 2.2, 0.48), (0.7, 0.4, 0.96), hexc('#a77d55'))
    p = person((1.4, 1.6, 0), hexc('#c98f7a'), pants=hexc('#4a4f5c'), rot_z=math.pi * 0.5, name='you')
    f1 = int(n * 0.3); f2 = int(n * 0.75)
    move(p, [(1, (1.4, 1.6, 0)), (f1, (0.9, 1.6, 0)), (f2, (-2.0, 1.0, 0)), (n, (-2.0, 1.0, 0))])
    cage.keyframe_insert('location', frame=f1)
    cage.location = (0.6, 1.9, 0.95); cage.keyframe_insert('location', frame=f1 + 10)
    cage.location = (-2.6, 1.0, 1.0); cage.keyframe_insert('location', frame=f2)
    c = cat((1.2, 0.2, 0), 'tora', s=0.62, rot_z=2.6)
    ev = add_meows([c], n, every=(40, 65))
    cam = camera(30)
    cam_path(cam, [(0, (1.8, -2.4, 1.7), (0.2, 1.8, 1.0)), (1, (0.6, -2.2, 1.6), (-1.2, 1.4, 1.0))], n)
    return M(ev, bed=0.5, amb='room')


def nDogCat(n):  # 犬と猫が一緒に暮らす家：鳴き続ける猫の横で、犬が伏せて見守る
    living_room()
    c = cat((-0.2, 0.8, 0), 'shiro', s=0.62, rot_z=math.pi * 0.9)
    ev = add_meows([c], n, every=(40, 65))
    d = dog((0.55, 0.85, 0), 'dog_black', s=0.95, rot_z=math.pi * 0.6, pose='crouch', name='dog')
    cam = camera(40, dof=2.2, fstop=2.0)
    cam_path(cam, [(0, (1.4, -1.4, 0.7), (0.1, 0.8, 0.25)), (1, (0.9, -1.0, 0.6), (0.1, 0.8, 0.25))], n)
    return M(ev, bed=0.3, amb='room')


# ---------------- SCENE 11 「もう一度」が増える一日 ----------------
def draw_board(lines, title=None, bg=(20, 24, 32), fg=(255, 210, 90)):
    def f(im, d):
        d.rectangle((0, 0, 1920, 1080), fill=bg)
        y = 120
        if title:
            d.text((90, 60), title, font=_font(80), fill=(200, 205, 215)); y = 250
        for l in lines:
            d.text((90, y), l, font=_font(120), fill=fg); y += 200
    return f


def nStation(n):  # 朝の駅のホーム。アナウンスが途切れる
    sky(hexc('#c9d6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    light_dir((0.3, -0.5, 0.8))
    box((0, 0, -0.5), (60, 40, 1), hexc('#5a5650'))
    box((0, 2.5, 0.5), (60, 5, 1.0), hexc('#c9c4ba'))  # ホーム
    box((0, 0.05, 1.01), (60, 0.25, 0.01), hexc('#f2d24b'))  # 点字ブロック
    for x in (-8, 0, 8):
        cyl((x, 4.2, 2.5), 0.12, 3.0, hexc('#8c8a86'))
    box((0, 4.2, 4.1), (24, 1.6, 0.15), hexc('#6a6864'))  # 屋根
    tex_plane('st_board', draw_board(['8:12　各駅停車', '■番線に■■りま■'], '次の電車'), (0, 4.0, 3.4), 2.6, 1.46)
    rnd = random.Random(19)
    for i in range(9):
        x = -6 + i * 1.5 + rnd.uniform(-0.3, 0.3)
        p = person((x, 1.6 + rnd.uniform(-0.3, 0.6), 1.0), rnd.choice([hexc('#3a3f4a'), hexc('#5a6a8a'), hexc('#8a8a8a'), hexc('#c46a4a')]),
                   rot_z=math.pi + rnd.uniform(-0.4, 0.4), name=f'pas{i}')
    for i in range(2):
        c = cat((rnd.uniform(-8, 8), 6.5, 0), 'tora', s=0.62)
    cam = camera(30)
    cam_path(cam, [(0, (-9, -6, 2.6), (0, 3, 2.4)), (1, (-6, -5, 2.4), (2, 3, 2.6))], n)
    return M([], bed=0.8, amb='city')


def office(n):
    sky(hexc('#d9d2c4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(8, 6, 2.7, floor=hexc('#9aa0a6'), wall=hexc('#eef0f2'))


def nCallDesk(n):  # 電話の窓口：住所を一文字ずつ聞き返す
    office(n)
    rnd = random.Random(20)
    for k in range(3):
        x = -2.4 + k * 2.4
        table((x, 0.8, 0), 1.6, 0.8, 0.72); laptop((x, 0.95, 0.75), rot_z=math.pi)
        p = person((x, 0.2, 0), rnd.choice([hexc('#5a7a9a'), hexc('#c98f7a'), hexc('#7aa07a')]), pose='sit', rot_z=math.pi, act='phone', name=f'op{k}')
    memo = tex_plane('memo_addr', draw_board(['とう・きょう・と', 'さ・く・ら・ちょう', '1 - 2 - 3'], None, bg=(250, 248, 240), fg=(40, 44, 60)),
                     (0.35, 0.6, 0.76), 0.5, 0.28, rot=(0, 0, 0))
    c = cat((3.4, 2.0, 0), 'tora', s=0.62, rot_z=2.6)
    cam = camera(40, dof=1.6, fstop=2.0)
    cam_path(cam, [(0, (1.6, -1.6, 1.8), (0.0, 0.7, 0.9)), (1, (1.0, -0.8, 1.6), (0.3, 0.6, 0.76))], n)
    return M([], bed=0.6, amb='room')


def nClass(n):  # 窓際の教室：先生が話すのをやめ、黒板に書き始める
    sky(hexc('#d9d2c4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(9, 8, 3.0, floor=hexc('#b48a63'), wall=hexc('#f0ece2'))
    box((-1.8, 3.93, 1.6), (3.6, 0.04, 1.3), hexc('#2f4a3a'))  # 黒板
    lines = ['きょうは', '書いて伝えます']
    for i, l in enumerate(lines):
        t = label3d(l, (-1.8, 3.88, 2.0 - i * 0.5), 0.32, hexc('#f4f4ea')); appear(t, int(n * 0.3) + i * 40, grow=20)
    notice = box((2.6, 3.92, 1.6), (0.9, 0.03, 0.6), hexc('#fafafa'))
    label3d('リスニング', (2.6, 3.88, 1.72), 0.15, hexc('#c03a3a')); label3d('テスト中止', (2.6, 3.88, 1.48), 0.15, hexc('#c03a3a'))
    t = person((-1.0, 3.2, 0), hexc('#6a7a5a'), rot_z=math.pi * 0.0, act='talk', name='teacher')
    rnd = random.Random(21)
    for r in range(3):
        for k in range(4):
            x = -3 + k * 1.6; y = 1.4 - r * 1.4
            table((x, y, 0), 0.7, 0.5, 0.62)
            person((x, y - 0.45, 0), rnd.choice([hexc('#2a3a5a'), hexc('#f2f2f2')]), pose='sit', rot_z=math.pi, s=0.85, name=f'st{r}{k}')
    cam = camera(30)
    cam_path(cam, [(0, (3.6, -3.4, 2.0), (-1.2, 3.4, 1.4)), (1, (2.6, -2.6, 1.9), (-1.6, 3.6, 1.6))], n)
    return M([], bed=0.8, amb='room')


def nCafePoint(n):  # 屋外の席のカフェ：メニューの指さしで注文
    sky(hexc('#b7d0e6')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    ground(rgb=hexc('#c8bca8'))
    house((0, 5, 0), 9, 5, 5)
    box((0, 2.4, 2.4), (6, 0.8, 0.08), hexc('#c04a3a'))  # ひさし
    table((0, 0, 0), 0.8, 0.8, 0.72, c=hexc('#f0ece2'))
    customer = person((0, -0.6, 0), hexc('#5a7a9a'), pose='sit', rot_z=0, act='talk', name='guest')
    staff = person((0.7, 0.5, 0), hexc('#2a2a2a'), rot_z=math.pi * 0.75, name='staff')
    tex_plane('menu', draw_board(['コーヒー', 'ケーキ'], 'MENU', bg=(250, 246, 236), fg=(60, 40, 30)), (0.0, 0.05, 0.76), 0.5, 0.32, rot=(0, 0, 0))
    c = cat((2.6, 1.6, 0), 'saba', s=0.62, rot_z=2.4)
    ev = add_meows([c], n, every=(35, 60), gain=0.6)
    cam = camera(40, dof=2.4, fstop=2.2)
    cam_path(cam, [(0, (2.6, -2.6, 1.7), (0.2, 0.0, 0.9)), (1, (2.0, -2.0, 1.6), (0.0, 0.1, 0.8))], n)
    return M(ev, bed=0.6, amb='day')


def nHospNum(n):  # 病院の受付：名前を呼ぶかわりに番号が画面に出る
    sky(hexc('#d6d1c8')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(9, 7, 2.8, floor=hexc('#d9d6cf'), wall=hexc('#f1f1ee'), window=False)
    a = tex_plane('num_a', draw_board(['受付番号　23'], 'お呼び出し', bg=(16, 40, 70), fg=(255, 255, 255)), (0, 3.42, 2.0), 2.2, 1.24)
    b = tex_plane('num_b', draw_board(['受付番号　24'], 'お呼び出し', bg=(16, 40, 70), fg=(255, 255, 255)), (0, 3.42, 2.0), 2.2, 1.24)
    swap_planes(a, b, int(n * 0.5))
    rnd = random.Random(22)
    for k in range(4):
        box((-2.8 + k * 1.8, 1.0, 0.45), (1.4, 0.5, 0.06), hexc('#7d93a3'))
        person((-2.8 + k * 1.8, 1.0, 0), rnd.choice([hexc('#3d5a80'), hexc('#c46a4a'), hexc('#8a8a8a')]), pose='sit', rot_z=math.pi, name=f'pt{k}')
    cam = camera(30)
    cam_path(cam, [(0, (2.6, -3.0, 1.6), (0, 3.0, 1.6)), (1, (1.6, -2.4, 1.6), (0, 3.0, 1.8))], n)
    return M([], bed=0.6, amb='room')


# ---------------- SCENE 12 動物病院 ----------------
def nOldCat(n):  # 年をとった猫が夜に鳴き続ける
    living_room(night=True)
    c = cat((-0.3, 0.6, 0), 'saba', s=0.6, rot_z=math.pi * 0.85, pose='crouch')
    fr = meow_times(n, every=(40, 60)); meow(c, fr, lift=0.1)
    cam = camera(45, dof=1.6, fstop=1.8)
    cam_path(cam, [(0, (0.6, -0.7, 0.5), (-0.3, 0.6, 0.2)), (1, (0.4, -0.4, 0.4), (-0.3, 0.6, 0.2))], n)
    return M([(f, 0.7, 0.85) for f in fr], bed=0.3, amb='night')


# ---------------- SCENE 13 60匹の部屋 ----------------
def nShelterDoor(n):  # 施設の入口に、猫を抱えた人が立つ
    sky(hexc('#c9d6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    ground(rgb=hexc('#b0aba0'))
    box((0, 3, 2.0), (8, 4, 4), hexc('#e9e4da'))
    box((0, 0.98, 1.1), (1.6, 0.06, 2.2), hexc('#9fb6c8'))  # ガラス戸
    box((0, 0.95, 2.6), (2.6, 0.08, 0.5), hexc('#5a7a5a'))
    label3d('保護施設', (0, 0.9, 2.5), 0.3, hexc('#ffffff'))
    p = person((0, -0.6, 0), hexc('#7a6a8a'), rot_z=0, name='visitor')
    carrier((0.35, -0.75, 0), rot_z=0.2)
    staff = person((0, 1.4, 0), hexc('#7aa07a'), rot_z=math.pi, name='staff')
    h = bpy.data.objects[staff['head']]
    for f in range(int(n * 0.5), n, 12):
        h.rotation_euler = (0, 0, 0.35 if (f // 12) % 2 else -0.35); h.keyframe_insert('rotation_euler', frame=f)
    ev = [(f, 0.5, 1.1) for f in range(10, n, 25)]
    cam = camera(32)
    cam_path(cam, [(0, (2.6, -4.0, 1.6), (0, 0.4, 1.2)), (1, (1.6, -3.2, 1.5), (0, 0.4, 1.2))], n)
    return M(ev, bed=0.8, amb='day')


# ---------------- SCENE 14 声を届ける仕事 ----------------
def nRadio(n):  # ラジオの生放送：マイクのメーターが猫の声で振れる
    sky(hexc('#2a2f3a')); s = bpy.context.scene; s.view_settings.exposure = 0.25
    room(5, 4.5, 2.6, floor=hexc('#4a4a52'), wall=hexc('#6a6a7a'), window=False)
    table((0, 0.6, 0), 1.8, 0.9, 0.75, c=hexc('#3a3a42'))
    cyl((0.0, 0.4, 0.95), 0.012, 0.4, hexc('#888888')); sphere((0.0, 0.35, 1.18), 0.06, hexc('#2a2a2a'))
    p = person((0, 1.2, 0), hexc('#c46a4a'), pose='sit', rot_z=math.pi, act='talk', name='dj')
    h = bpy.data.objects[p['head']]
    for sx in (-0.15, 0.15):
        link(sphere((sx, 0, 0), 0.07, hexc('#2a2a2a'), scale=(0.5, 1, 1)), h)
    sign = box((-1.4, 2.18, 2.0), (1.0, 0.05, 0.35), hexc('#d03030')); label3d('ON AIR', (-1.4, 2.12, 1.92), 0.2)
    c = cat((0.5, 0.2, 0), 'mike', s=0.62, rot_z=math.pi * 1.1)
    fr = meow_times(n, every=(30, 50)); meow(c, fr)
    meter = boxc((0.7, 0.35, 0.86), (0.06, 0.02, 0.02), hexc('#f2b84b'))
    meter.keyframe_insert('scale', frame=1)
    for f in fr:
        meter.scale = (1, 1, 1); meter.keyframe_insert('scale', frame=f)
        meter.scale = (1, 1, 14); meter.keyframe_insert('scale', frame=f + 3)
        meter.scale = (1, 1, 1); meter.keyframe_insert('scale', frame=f + 14)
    cam = camera(35, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (1.6, -1.6, 1.3), (0, 0.7, 0.9)), (1, (1.1, -1.1, 1.2), (0.2, 0.5, 0.7))], n)
    return M([(f, 0.8, 1.0) for f in fr], bed=0.2, amb='room')


def nRecStudio(n):  # 録音スタジオ：赤いランプが何度も消える
    sky(hexc('#2a2f3a')); s = bpy.context.scene; s.view_settings.exposure = 0.2
    room(5, 4.5, 2.6, floor=hexc('#4a3a32'), wall=hexc('#5a5048'), window=False)
    cyl((0, 0.5, 0.8), 0.015, 1.6, hexc('#888888')); sphere((0, 0.45, 1.55), 0.07, hexc('#2a2a2a'))
    p = person((0, 1.0, 0), hexc('#3a4a6a'), rot_z=math.pi, act='talk', name='singer')
    lamp = sphere((-1.2, 2.18, 2.1), 0.12, hexc('#ff3030'))
    label3d('録音中', (-0.75, 2.18, 2.05), 0.16, hexc('#ff6a6a'))
    pr = bpy.context.preferences.edit; old = pr.keyframe_new_interpolation_type; pr.keyframe_new_interpolation_type = 'CONSTANT'
    rnd = random.Random(23); f = 1; on = True
    while f < n:
        lamp.scale = (1, 1, 1) if on else (0, 0, 0); lamp.keyframe_insert('scale', frame=f)
        f += rnd.randint(30, 60) if on else rnd.randint(12, 20); on = not on
    pr.keyframe_new_interpolation_type = old
    cam = camera(35, dof=2.4, fstop=2.2)
    cam_path(cam, [(0, (1.5, -1.8, 1.5), (0, 1.0, 1.3)), (1, (1.0, -1.3, 1.5), (-0.4, 1.4, 1.5))], n)
    return M([(f, 0.5, 1.0) for f in range(30, n, 45)], bed=0.4, amb='room')


def draw_speech(im, d):
    d.rectangle((0, 0, 1920, 1080), fill=(250, 246, 238))
    d.text((120, 120), 'おふたりへ', font=_font(110), fill=(120, 80, 60))
    for i, l in enumerate(['いつも笑顔のふたりに、', '心からおめでとう。', 'これからも、ずっと。']):
        d.text((120, 380 + i * 180), l, font=_font(96), fill=(50, 44, 40))


def draw_couple(im, d):
    d.rectangle((0, 0, 1920, 1080), fill=(230, 214, 200))
    for cx, col in ((760, (60, 60, 70)), (1160, (250, 250, 250))):
        d.ellipse((cx - 110, 260, cx + 110, 480), fill=(232, 196, 160))
        d.rounded_rectangle((cx - 190, 500, cx + 190, 1080), 90, fill=col)


def nWedding(n):  # 結婚式：スピーチが画面の文字に切り替わる
    sky(hexc('#e9dcc8')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    room(12, 9, 3.2, floor=hexc('#b08a70'), wall=hexc('#f4ede2'), window=False)
    a = tex_plane('wed_a', draw_couple, (0, 4.42, 2.0), 3.2, 1.8)
    b = tex_plane('wed_b', draw_speech, (0, 4.42, 2.0), 3.2, 1.8)
    swap_planes(a, b, int(n * 0.45))
    box((-2.8, 3.6, 0.55), (0.6, 0.5, 1.1), hexc('#8a5a3a')); cyl((-2.8, 3.4, 1.25), 0.012, 0.3, hexc('#888888'))
    sp = person((-2.8, 4.0, 0), hexc('#2a2a2a'), rot_z=math.pi, act='talk', name='speaker')
    rnd = random.Random(24)
    for tx, ty in ((-3, 0.5), (0, 0), (3, 0.5), (-1.5, -2.5), (1.5, -2.5)):
        cyl((tx, ty, 0.72), 0.75, 0.04, hexc('#ffffff')); cyl((tx, ty, 0.36), 0.08, 0.72, hexc('#ddd8d0'))
        for k in range(4):
            a_ = k * math.pi / 2 + 0.4
            person((tx + 1.0 * math.cos(a_), ty + 1.0 * math.sin(a_), 0), rnd.choice([hexc('#2a2a2a'), hexc('#7a4a6a'), hexc('#4a6a8a')]),
                   pose='sit', rot_z=a_ + math.pi / 2, name=f'g{tx}{k}')
    cam = camera(28)
    cam_path(cam, [(0, (4.5, -6.0, 2.6), (0, 3, 1.6)), (1, (3.0, -5.0, 2.4), (-0.5, 3.4, 1.8))], n)
    return M([(f, 0.35, 1.0) for f in range(20, n, 40)], bed=0.7, amb='room')


def draw_stream(im, d):
    d.rectangle((0, 0, 1920, 1080), fill=(18, 18, 24))
    d.rectangle((40, 40, 1300, 1040), fill=(60, 70, 90))
    cx, cy = 560, 640; col = (217, 139, 58)
    d.ellipse((cx - 140, cy - 40, cx + 140, cy + 260), fill=col); d.ellipse((cx - 110, cy - 220, cx + 110, cy - 10), fill=col)
    d.polygon([(cx - 100, cy - 160), (cx - 80, cy - 290), (cx - 20, cy - 200)], fill=col); d.polygon([(cx + 100, cy - 160), (cx + 80, cy - 290), (cx + 20, cy - 200)], fill=col)
    d.ellipse((cx - 26, cy - 100, cx + 26, cy - 60), fill=(120, 40, 40))
    d.ellipse((880, 300, 1080, 500), fill=(232, 196, 160)); d.rounded_rectangle((820, 520, 1140, 1040), 80, fill=(90, 120, 180))
    d.text((80, 80), '● LIVE　猫といっしょに歌う', font=_font(56), fill=(255, 90, 90))
    for i in range(5):
        x = 1050 + i * 40; y = 260 - i * 40
        d.text((x, y), '♪', font=_font(70), fill=(255, 230, 140))
    d.rectangle((1340, 40, 1880, 1040), fill=(30, 32, 42))


def draw_comments(im, d):
    d.rectangle((0, 0, 1080, 3840), fill=(30, 32, 42))
    cm = ['かわいい', 'ハモってる', '世界中から見てる', 'うちの猫も歌ってる', 'Good harmony!', 'もう一回！', '癒やされる', 'tebrikler!', '名コンビ',
          'リズム完璧', '和声になってる', 'これは新ジャンル', 'わかる', '最高', '朝から見てる']
    rnd = random.Random(25)
    for i in range(36):
        y = 40 + i * 104
        d.ellipse((40, y, 100, y + 60), fill=rnd.choice([(217, 139, 58), (90, 160, 220), (160, 200, 120), (220, 120, 160)]))
        d.text((130, y + 4), cm[i % len(cm)], font=_font(48), fill=(235, 238, 245))


def nStream(n):  # 猫の鳴き声に合わせて歌う配信。コメントが流れる
    screen_scene()
    tex_plane('stream', draw_stream, (0, 0, 0), 16, 9)
    c = tex_plane('comments', draw_comments, (5.5, -0.02, -4.5), 4.5, 16, size=(1080, 3840))
    c.keyframe_insert('location', frame=1); c.location.z = 4.5; c.keyframe_insert('location', frame=n)
    box((5.5, -0.06, 6.0), (5.0, 0.05, 3.0), hexc('#121218'))   # 上のふた
    box((5.5, -0.06, -6.0), (5.0, 0.05, 3.0), hexc('#121218'))  # 下のふた
    cam = camera(50)
    cam_path(cam, [(0, (0, -21, 0), (0, 0, 0)), (1, (0.3, -19, 0), (0.3, 0, 0))], n)
    return M([(f, 0.7, 1.0) for f in range(10, n, 36)], bed=0.2, amb='room')


# ---------------- SCENE 15 草むらの虫 ----------------
def grass(n_blades, xr, yr, seed=1, h=(0.25, 0.6)):
    rnd = random.Random(seed)
    for i in range(n_blades):
        cone((rnd.uniform(*xr), rnd.uniform(*yr), 0), 0.03, rnd.uniform(*h), rnd.choice([hexc('#3f6a35'), hexc('#4f7a3c'), hexc('#2f5a2a')]),
             rot=(rnd.uniform(-0.25, 0.25), rnd.uniform(-0.25, 0.25), 0), verts=4)


def night_ground():
    sky(hexc('#0b1020')); s = bpy.context.scene; s.view_settings.exposure = -0.1
    light_dir((0.2, -0.5, 0.6)); s.display.shading.shadow_intensity = 0.3
    ground(rgb=hexc('#2a3328'))


def nGrassWalk(n):  # 夜の植え込みの横を歩く足元
    night_ground()
    box((0, 0, 0.005), (1.6, 40, 0.01), hexc('#4a4a50'))
    for y in range(-6, 14, 2):
        bush((-1.6, y, 0.35), 0.6, hexc('#2f4a2a'))
    grass(160, (-2.5, -0.9), (-6, 14), seed=2)
    c = cat((-1.2, 4.0, 0), 'kuro', s=0.62, rot_z=-1.8)
    fr = meow_times(n, every=(35, 55)); meow(c, fr)
    p = person((0.2, -3, 0), hexc('#3a4a6a'), rot_z=math.pi, name='walker')
    move(p, [(1, (0.2, -3, 0)), (n, (0.2, 6, 0))])
    cam = camera(30)
    cam_path(cam, [(0, (1.6, -5.5, 0.5), (0, -2, 0.3)), (1, (1.6, 3.0, 0.5), (0, 6.5, 0.3))], n)
    return M([(f, 0.8, 1.0) for f in fr], bed=0.5, amb='night')


def nCricket(n):  # 草むらの虫が羽を震わせて鳴いている。そこへ猫の声
    night_ground()
    grass(120, (-1.2, 1.2), (-0.4, 1.6), seed=3, h=(0.3, 0.8))
    root = empty((0.0, 0.0, 0.18), 'cricket')
    link(sphere((0, 0, 0), 0.03, hexc('#3a2a1a'), scale=(0.8, 1.8, 0.7)), root)
    link(sphere((0, -0.05, 0.01), 0.018, hexc('#2a1a10')), root)
    wings = [link(box((sx * 0.012, 0.02, 0.022), (0.025, 0.07, 0.004), hexc('#6a5030'), rot=(0, sx * 0.2, 0)), root) for sx in (-1, 1)]
    for w in wings:
        for f in range(1, n, 2):
            w.rotation_euler.y = (0.45 if (f // 2) % 2 else 0.05) * (1 if w.location.x > 0 else -1)
            w.keyframe_insert('rotation_euler', frame=f)
    box((0, 0, 0.09), (0.04, 0.3, 0.18), hexc('#4f7a3c'), rot=(0.3, 0, 0))  # 止まっている葉
    f0 = int(n * 0.4)
    cam = camera(85, dof=0.45, fstop=1.4)
    cam_path(cam, [(0, (0.35, -0.4, 0.3), (0, 0, 0.18)), (1, (0.28, -0.3, 0.27), (0, 0, 0.18))], n)
    m = M([(f, 0.9, 1.0) for f in range(f0, n, 26)], bed=0.0, amb='night'); m['insects'] = 1.2
    return m


def nRiver(n):  # 猫から離れた河原では、虫の声が聞こえる。人が聞きに来る
    night_ground()
    box((0, 6, -0.04), (60, 6, 0.05), hexc('#1d2a44'))  # 川
    grass(260, (-10, 10), (-3, 2.8), seed=4)
    sphere((14, 40, 18), 1.6, hexc('#fff2c0'))  # 月
    rnd = random.Random(26)
    for i in range(4):
        person((-3 + i * 1.8 + rnd.uniform(-0.2, 0.2), 1.0, 0), rnd.choice([hexc('#5a6a8a'), hexc('#8a6a5a'), hexc('#4a5a4a')]),
               pose='sit', rot_z=math.pi + rnd.uniform(-0.3, 0.3), name=f'listener{i}')
    cam = camera(30)
    cam_path(cam, [(0, (5, -6, 1.6), (0, 3, 0.6)), (1, (3, -4.5, 1.4), (-1, 3, 0.6))], n)
    m = M([], bed=0.03, amb='night'); m['insects'] = 1.4
    return m


def draw_zukan(im, d):
    d.rectangle((0, 0, 1920, 1080), fill=(250, 248, 240))
    d.text((90, 70), 'むしの こえ', font=_font(100), fill=(60, 90, 60))
    d.ellipse((260, 420, 760, 640), fill=(90, 70, 40)); d.ellipse((700, 450, 820, 560), fill=(70, 50, 30))
    d.rounded_rectangle((1000, 420, 1700, 620), 60, fill=(80, 140, 200))
    d.polygon([(1290, 460), (1290, 580), (1400, 520)], fill=(255, 255, 255))
    d.text((1000, 680), '▶ 音を聞く', font=_font(80), fill=(60, 80, 120))


def nKidBook(n):  # 子どもたちは虫の声を図鑑の音声でしか知らなくなる
    living_room()
    table((-0.2, 0.9, 0), 1.2, 0.7, 0.72)
    kid = person((-0.2, 0.35, 0), hexc('#e8a33d'), pants=hexc('#4a6aa0'), pose='sit', rot_z=math.pi, s=0.7, name='kid')
    tex_plane('zukan', draw_zukan, (-0.2, 0.95, 0.76), 0.6, 0.34, rot=(0, 0, 0))
    c = cat((1.0, 1.8, 0), 'tora', s=0.62, rot_z=2.6)
    ev = add_meows([c], n, every=(40, 65), gain=0.6)
    cam = camera(40, dof=1.6, fstop=2.0)
    cam_path(cam, [(0, (0.6, -0.4, 1.4), (-0.2, 0.9, 0.76)), (1, (0.4, -0.1, 1.3), (-0.2, 0.95, 0.76))], n)
    m = M(ev, bed=0.4, amb='room'); m['insects'] = 0.35
    return m


# ---------------- SCENE 16 静けさの値段 ----------------
def nShelf(n):  # ドラッグストアの空の棚
    sky(hexc('#e6e6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(10, 8, 3.0, floor=hexc('#d9d6cf'), wall=hexc('#f4f4f2'), window=False)
    rnd = random.Random(27)
    for row, x in enumerate((-2.0, 2.0)):
        box((x, 0, 0.9), (0.5, 6.0, 1.8), hexc('#e2e2de'))
        for lvl in range(4):
            box((x - 0.27, 0, 0.3 + lvl * 0.45), (0.06, 6.0, 0.03), hexc('#c8c8c2'))
            if row == 1:
                for k in range(10):
                    if rnd.random() < 0.7:
                        box((x - 0.4, -2.7 + k * 0.6, 0.42 + lvl * 0.45), (0.2, 0.25, 0.22), rnd.choice([hexc('#d04a3a'), hexc('#4a8ad0'), hexc('#f2d24b')]))
    for i, (lab, y) in enumerate((('耳栓', -2.0), ('防音カーテン', 0.0), ('ヘッドホン', 2.0))):
        label3d(lab, (-2.3, y, 1.95), 0.18, hexc('#2a2a2a'), rot=(math.pi / 2, 0, -math.pi / 2))
        box((-2.3, y, 1.2), (0.02, 0.9, 0.25), hexc('#f2d24b'))
        label3d('品切れ', (-2.32, y, 1.15), 0.16, hexc('#c02020'), rot=(math.pi / 2, 0, -math.pi / 2))
    p = person((0, -1.0, 0), hexc('#6a7a9a'), rot_z=math.pi * 0.55, name='shopper')
    move(p, [(1, (0.2, -3.0, 0)), (n, (0.0, 1.0, 0))])
    cam = camera(28)
    cam_path(cam, [(0, (0.4, -3.0, 1.6), (-2.3, -0.5, 1.3)), (1, (0.2, -1.6, 1.6), (-2.3, 1.0, 1.3))], n)
    return M([], bed=0.6, amb='room')


def nBooth(n):  # 駅前の防音の個室に、仕事をする人の列
    sky(hexc('#c9d6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    ground(rgb=hexc('#b0aba0'))
    tower((0, 10, 0), 16, 6, 14, hexc('#d9d2c5'))
    for k in range(4):
        x = -3 + k * 2.0
        box((x, 2.0, 1.15), (1.6, 1.4, 2.3), hexc('#f0f0ee'), bevel=0.05)
        box((x, 1.28, 1.1), (0.9, 0.03, 1.9), hexc('#4a5a6a'))
    label3d('個室ブース', (0, 1.2, 2.6), 0.35, hexc('#2a3a5a'))
    rnd = random.Random(28)
    for i in range(7):
        person((3.6 + i * 0.0 + rnd.uniform(-0.1, 0.1), 0.6 - i * 0.75, 0), rnd.choice([hexc('#3a3f4a'), hexc('#5a6a8a'), hexc('#8a8a8a')]),
               rot_z=0.0, act='phone' if i % 3 == 0 else None, name=f'q{i}')
    cam = camera(30)
    cam_path(cam, [(0, (9, -6, 2.0), (1, 0, 1.2)), (1, (7, -5, 1.9), (0.5, 0.5, 1.2))], n)
    return M([], bed=0.8, amb='city')


def nOneRoom(n):  # 夜勤明け：昼間のワンルームで耳をふさぐ
    sky(hexc('#d9d2c4')); s = bpy.context.scene; s.view_settings.exposure = 0.5
    room(4, 3.6, 2.5, floor=hexc('#a88b6c'), wall=hexc('#e9e4da'))
    bed((-0.8, 0.5, 0))
    p = person((-0.8, 0.65, 0.5), hexc('#8fa3b8'), pants=hexc('#8fa3b8'), pose='lie', rot_z=math.pi, name='nightworker')
    pil = box((-0.8, -0.12, 0.78), (0.6, 0.32, 0.12), hexc('#f5f2ec'), bevel=0.04)
    cam = camera(30, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (1.3, -1.6, 1.8), (-0.8, 0.3, 0.6)), (1, (0.9, -1.2, 1.6), (-0.8, 0.1, 0.6))], n)
    return M([], bed=0.9, amb='city')


def nNotice(n):  # 集合住宅の掲示板に、貼り紙が増える
    sky(hexc('#d6d1c8')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(6, 4, 2.6, floor=hexc('#bdb6aa'), wall=hexc('#e6e0d4'), window=False)
    box((0, 1.93, 1.5), (2.4, 0.05, 1.3), hexc('#8a6a48'))
    msgs = ['夜は窓を閉めてください', '猫の声について', '夜は窓を閉めてください', 'お互いさまで']
    for i, msg in enumerate(msgs):
        x = -0.7 + (i % 2) * 1.2; z = 1.8 - (i // 2) * 0.6
        pap = boxc((x, 1.89, z), (0.95, 0.02, 0.5), hexc('#fafafa'))
        t = label3d(msg, (x, 1.87, z), 0.085, hexc('#2a2a2a'))
        f = int(n * 0.1) + i * int(n * 0.2)
        appear(pap, f, grow=4); appear(t, f, grow=4)
    for k in range(6):
        box((-2.4 + (k % 3) * 0.4, 1.8, 0.9 + (k // 3) * 0.35), (0.36, 0.3, 0.3), hexc('#9aa39a'))
    p = person((1.6, 0.4, 0), hexc('#7a6a8a'), rot_z=math.pi * 0.85, name='resident')
    cam = camera(32)
    cam_path(cam, [(0, (0.8, -0.6, 1.6), (0, 1.9, 1.5)), (1, (0.3, 0.0, 1.55), (0, 1.9, 1.5))], n)
    return M([(f, 0.35, 1.0) for f in range(30, n, 55)], bed=0.4, amb='room')


# ---------------- SCENE 17 静かな場所へ逃げる人 ----------------
def draw_inns(im, d):
    d.rectangle((0, 0, 1080, 1920), fill=(246, 246, 248))
    d.rectangle((0, 0, 1080, 160), fill=(60, 90, 70))
    d.text((60, 45), '静かな宿をさがす', font=_font(60), fill=(255, 255, 255))
    names = ['山あいの宿', '谷の湯', '森の宿', '湖畔の宿', '峠の宿', '川辺の宿', '高原の宿', '里山の宿', '奥の湯', '星の宿', '霧の宿']
    for i, nm in enumerate(names):
        y = 210 + i * 150
        d.rounded_rectangle((40, y, 1040, y + 120), 18, fill=(255, 255, 255), outline=(220, 220, 226), width=2)
        d.text((80, y + 30), nm, font=_font(54), fill=(40, 44, 52))
        d.rounded_rectangle((820, y + 26, 1010, y + 96), 14, fill=(200, 50, 50))
        d.text((865, y + 32), '満室', font=_font(44), fill=(255, 255, 255))


def nInn(n):
    screen_scene()
    tex_plane('inns', draw_inns, (0, 0, 0), 4.5, 8, size=(1080, 1920))
    cam = camera(50)
    cam_path(cam, [(0, (0, -9.5, 2.2), (0, 0, 2.0)), (1, (0, -8.5, -1.8), (0, 0, -1.6))], n)
    return M([], bed=0.3, amb='room')


def nShip(n):  # 猫の少ない島へ向かう船。耳栓を外して深呼吸
    sky(hexc('#a9cbe4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    light_dir((0.6, -0.3, 0.6))
    box((0, 0, -0.05), (400, 400, 0.1), hexc('#3d6f9c'))
    ship = empty((0, 0, 0), 'ship')
    link(box((0, 0, 0.6), (4, 12, 1.2), hexc('#f2f2f0')), ship)
    link(box((0, 1.5, 1.9), (3, 4, 1.4), hexc('#e2e6ea')), ship)
    link(box((0, -5.8, 1.6), (4, 0.06, 0.8), hexc('#c8ccd0')), ship)
    p = person((0.4, -5.2, 1.2), hexc('#5a7a9a'), rot_z=0, name='traveler')
    link(p, ship)
    h = bpy.data.objects[p['head']]
    h.rotation_euler = (0, 0, 0); h.keyframe_insert('rotation_euler', frame=1)
    h.rotation_euler = (-0.35, 0, 0); h.keyframe_insert('rotation_euler', frame=int(n * 0.5)); h.keyframe_insert('rotation_euler', frame=int(n * 0.8))
    h.rotation_euler = (0, 0, 0); h.keyframe_insert('rotation_euler', frame=n)
    cone((-30, -140, 0), 30, 14, hexc('#5f8a4a'), verts=24)
    ship.keyframe_insert('location', frame=1); ship.location.y = -14; ship.keyframe_insert('location', frame=n)
    for fc in []:
        pass
    cam = camera(32)
    cam_path(cam, [(0, (5, -2, 3.2), (0, -12, 2.0)), (1, (5, -16, 3.2), (-3, -30, 2.0))], n)
    return M([], bed=0.0, amb='sea')


def nPetHotel(n):  # ペットホテルの受付に「満室」の札。預けられない猫を抱えて立ち尽くす飼い主
    sky(hexc('#d6d1c8')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(7, 5, 2.7, floor=hexc('#d9d6cf'), wall=hexc('#f1efea'), window=False)
    box((0, 1.5, 0.55), (3.0, 0.7, 1.1), hexc('#b9875c'))
    box((0, 1.5, 1.12), (3.1, 0.75, 0.05), hexc('#f4f4f2'))
    box((0, 2.43, 1.9), (1.6, 0.04, 0.6), hexc('#c03030'))
    label3d('本日 満室', (0, 2.39, 1.82), 0.24)
    staff = person((0, 2.1, 0), hexc('#7aa07a'), rot_z=math.pi, name='staff')
    p = person((0.2, 0.2, 0), hexc('#7a6a8a'), rot_z=0, name='owner')
    carrier((0.55, 0.05, 0), rot_z=0.1)
    ev = [(f, 0.8, 1.0) for f in range(15, n, 30)]
    cam = camera(32)
    cam_path(cam, [(0, (2.6, -2.8, 1.6), (0, 1.4, 1.2)), (1, (1.8, -2.1, 1.5), (0.2, 1.2, 1.1))], n)
    return M(ev, bed=0.4, amb='room')


# ---------------- SCENE 18 静かな猫が、心配な猫 ----------------
def nHoarse(n):  # 声がかすれて小さい。飼い主が手を止めてのぞき込む
    living_room(night=True)
    c = cat((-0.3, 0.6, 0), 'tora', s=0.62, rot_z=math.pi * 0.85, pose='crouch', name='basecat')
    fr = meow_times(n, every=(50, 80)); meow(c, fr, lift=0.06, dur=10)
    p = person((-1.2, 2.0, 0.0), hexc('#c7d3e0'), pose='sit', rot_z=math.pi, act='type', name='owner')
    f = int(n * 0.35)
    move(p, [(1, (-1.2, 2.0, 0.0)), (f, (-1.2, 2.0, 0.0)), (f + 30, (-0.5, 1.2, 0.0))])
    cam = camera(40, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (0.9, -0.8, 0.9), (-0.6, 1.2, 0.5)), (1, (0.5, -0.4, 0.6), (-0.3, 0.7, 0.3))], n)
    return M([(x, 0.3, 0.8) for x in fr], bed=0.2, amb='night')


def nNightVet(n):  # 夜間の動物病院の入口に、キャリーを抱えて駆け込む
    street_env(night=True, corner=False)
    box((4.2, 0, 1.6), (2.0, 5, 3.2), hexc('#e9e4da'))
    box((3.15, 0, 2.8), (0.08, 3.0, 0.6), hexc('#2a6a9a'))
    label3d('夜間診療', (3.08, 0, 2.7), 0.35, rot=(math.pi / 2, 0, -math.pi / 2))
    box((3.17, 0, 1.1), (0.05, 1.4, 2.2), hexc('#ffe9a8'))
    p = person((0.0, -12.0, 0), hexc('#7a6a8a'), rot_z=math.pi, name='owner')
    ca = carrier((0.35, -0.2, 0.55)); link(ca, p)
    move(p, [(1, (0.0, -12.0, 0)), (int(n * 0.8), (2.4, -0.4, 0)), (n, (2.8, 0, 0))])
    cam = camera(30)
    cam_path(cam, [(0, (-1.2, -18.0, 2.0), (1.0, -4, 1.2)), (1, (-1.0, -11, 1.9), (2.4, 0, 1.3))], n)
    return M([], bed=0.5, amb='night')


def nVetWater(n):  # 診察台：水を飲ませ、体重計に乗せる
    env_clinic()
    box((0, 1.0, 0.45), (1.6, 0.8, 0.9), hexc('#c8ccd0'))
    box((0.2, 1.0, 0.93), (0.6, 0.5, 0.04), hexc('#e8e8e8'))  # 体重計
    c = cat((0.2, 1.0, 0.95), 'tora', s=0.62, rot_z=math.pi * 0.6, pose='crouch', name='basecat')
    bowl((-0.4, 0.9, 0.93), c=hexc('#4a8ad0'))
    vet = person((0, 1.8, 0), hexc('#f2f2f2'), rot_z=math.pi, name='vet')
    own = person((-1.2, 0.2, 0), hexc('#7a6a8a'), rot_z=-0.6, name='owner')
    h = bpy.data.objects[c['head']]
    f = int(n * 0.3)
    h.keyframe_insert('rotation_euler', frame=f); h.rotation_euler.x += 0.4; h.rotation_euler.z += 0.6
    h.keyframe_insert('rotation_euler', frame=f + 15); h.keyframe_insert('rotation_euler', frame=f + 70)
    cam = camera(35, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (1.6, -1.2, 1.6), (0, 1.0, 1.0)), (1, (1.1, -0.7, 1.45), (0, 1.0, 1.0))], n)
    return M([], bed=0.3, amb='room')


def nWalkHome(n):  # 帰り道、キャリーの中から、かすれた声が一度だけ
    street_env(night=True, corner=False)
    p = person((0.4, -10, 0), hexc('#7a6a8a'), rot_z=0, name='owner')
    ca = carrier((0.35, -0.2, 0.55)); link(ca, p)
    f = int(n * 0.55)
    move(p, [(1, (0.4, -6, 0)), (f, (0.4, -10, 0)), (f + 30, (0.4, -10, 0)), (n, (0.4, -11.5, 0))])
    h = bpy.data.objects[p['head']]
    h.keyframe_insert('rotation_euler', frame=f); h.rotation_euler.x = 0.35; h.keyframe_insert('rotation_euler', frame=f + 10)
    h.keyframe_insert('rotation_euler', frame=f + 40); h.rotation_euler.x = 0.0; h.keyframe_insert('rotation_euler', frame=f + 55)
    cam = camera(32)
    cam_path(cam, [(0, (1.2, -17, 1.6), (0.4, -7, 1.0)), (1, (1.0, -15.5, 1.5), (0.4, -10, 1.0))], n)
    return M([(f, 0.35, 0.8)], bed=0.25, amb='night')


# ---------------- SCENE 19 猫は、誰を呼んでいるのか ----------------
def nTwoCats(n):  # 2匹の猫が向かい合う。どちらも人のいる方を向いて鳴く
    living_room()
    a = cat((-0.45, 0.9, 0), 'tora', s=0.62, rot_z=-math.pi / 2, name='catA')
    b = cat((0.45, 0.9, 0), 'kuro', s=0.62, rot_z=math.pi / 2, name='catB')
    p = person((0.0, -1.2, 0), hexc('#c7d3e0'), rot_z=math.pi, name='you')
    move(p, [(1, (2.5, -1.6, 0)), (int(n * 0.3), (0.0, -0.8, 0))])
    f = int(n * 0.3)
    for c in (a, b):
        c.keyframe_insert('rotation_euler', frame=f)
        c.rotation_euler.z = math.pi * 0.0; c.keyframe_insert('rotation_euler', frame=f + 16)
    rnd = random.Random(30); ev = []
    for c in (a, b):
        fr = meow_times(n - f, every=(40, 60), rng=rnd); fr = [x + f + 16 for x in fr if x + f + 16 < n - 10]
        meow(c, fr); ev += [(x, 0.8, rnd.uniform(0.9, 1.2)) for x in fr]
    cam = camera(35, dof=2.2, fstop=2.0)
    cam_path(cam, [(0, (1.8, 2.6, 0.8), (0, 0.9, 0.3)), (1, (1.3, 2.2, 0.7), (0, 0.6, 0.3))], n)
    return M(ev, bed=0.2, amb='room')


def nReply(n):  # 飼い主が猫の前にしゃがみ、名前を呼ぶ。そばに座ったまま動かない
    living_room()
    c = cat((-0.2, 0.7, 0), 'tora', s=0.62, rot_z=math.pi * 0.05, name='basecat')
    ev = add_meows([c], n, every=(45, 70))
    p = person((-0.2, 1.5, 0), hexc('#c98f7a'), pants=hexc('#4a4f5c'), rot_z=math.pi, name='owner')
    f = int(n * 0.2)
    move(p, [(1, (1.6, 1.8, 0)), (f, (-0.2, 1.5, 0))])
    sit = person((-0.2, 1.45, 0), hexc('#c98f7a'), pants=hexc('#4a4f5c'), pose='sit', rot_z=math.pi, act='talk', name='owner_sit')
    sit.scale = (0, 0, 0); sit.keyframe_insert('scale', frame=1); sit.keyframe_insert('scale', frame=f + 8)
    sit.scale = (1, 1, 1); sit.keyframe_insert('scale', frame=f + 9)
    p.keyframe_insert('scale', frame=f + 8); p.scale = (0, 0, 0); p.keyframe_insert('scale', frame=f + 9)
    cam = camera(40, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (1.3, -1.0, 0.8), (-0.2, 1.0, 0.45)), (1, (0.9, -0.6, 0.7), (-0.2, 1.0, 0.45))], n)
    return M(ev, bed=0.2, amb='room')


# ---------------- SCENE 20 声の違いが、分かってくる ----------------
def nVoiceBowl(n):  # 短く高い声＝ごはん
    living_room()
    box((1.6, 2.2, 0.45), (2.0, 0.6, 0.9), hexc('#d9cbb5'))  # 台所の台
    bowl((0.4, 0.9, 0.03)); bowl((0.7, 0.95, 0.03), c=hexc('#4a8ad0'))
    c = cat((0.55, 0.45, 0), 'tora', s=0.62, rot_z=math.pi * 0.95, name='basecat')
    fr = list(range(20, n - 10, 34)); meow(c, fr, dur=7, lift=0.22)
    p = person((1.4, 1.5, 0), hexc('#c98f7a'), pants=hexc('#4a4f5c'), rot_z=math.pi * 0.7, name='owner')
    cam = camera(40, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (1.6, -1.0, 0.8), (0.5, 0.7, 0.3)), (1, (1.2, -0.6, 0.7), (0.5, 0.7, 0.3))], n)
    return M([(f, 0.9, 1.35) for f in fr], bed=0.2, amb='room')


def nVoiceDoor(n):  # 長く伸ばす声＝ドアを開けて
    genkan(n, who=False)
    for o in bpy.data.objects:
        if o.get('kind') == 'cat':
            o.scale = (0, 0, 0)
    c = cat((0.1, -1.0, 0), 'tora', s=0.62, rot_z=0.0, name='doorcat')
    fr = list(range(15, n - 30, 60)); meow(c, fr, dur=26, lift=0.25)
    cam = camera(30, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (0.5, 1.6, 1.2), (0.0, -1.6, 0.6)), (1, (0.4, 1.0, 1.0), (0.0, -1.6, 0.5))], n)
    return M([(f, 0.9, 0.95) for f in fr], bed=0.2, amb='room')


def nVoiceLap(n):  # 低くくり返す声＝そばにいて
    living_room()
    p = person((-1.2, 2.0, 0.0), hexc('#c98f7a'), pants=hexc('#4a4f5c'), pose='sit', rot_z=math.pi, name='owner')
    c = cat((-1.0, 1.25, 0), 'tora', s=0.62, rot_z=math.pi * 0.9, name='basecat')
    fr = list(range(12, n - 10, 22)); meow(c, fr, dur=10, lift=0.1)
    cam = camera(40, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (0.6, -0.3, 0.6), (-1.1, 1.4, 0.45)), (1, (0.3, 0.1, 0.55), (-1.1, 1.4, 0.4))], n)
    return M([(f, 0.75, 0.8) for f in fr], bed=0.2, amb='room')


def draw_fridge_memo(im, d):
    d.rectangle((0, 0, 1080, 1440), fill=(252, 250, 240))
    d.text((70, 60), 'ねこの声', font=_font(110), fill=(160, 70, 40))
    for i, (a, b) in enumerate((('短く 高い', 'ごはん'), ('長く のばす', 'ドア'), ('低く くり返す', 'そばにいて'))):
        y = 330 + i * 330
        d.text((70, y), a, font=_font(80), fill=(40, 44, 60))
        d.text((170, y + 120), '→ ' + b, font=_font(88), fill=(40, 100, 160))


def nFridge(n):  # 冷蔵庫に、聞き分け方の紙が貼られる
    living_room()
    box((1.8, 2.2, 0.95), (0.8, 0.7, 1.9), hexc('#f4f4f2'), bevel=0.03)
    memo = tex_plane('fmemo', draw_fridge_memo, (1.8, 1.84, 1.35), 0.45, 0.6, size=(1080, 1440))
    appear(memo, int(n * 0.15), grow=8)
    sphere((1.8, 1.83, 1.68), 0.03, hexc('#d04a3a'))
    c = cat((1.2, 1.3, 0), 'tora', s=0.62, rot_z=math.pi * 0.8, name='basecat')
    ev = add_meows([c], n, every=(45, 70))
    cam = camera(40)
    cam_path(cam, [(0, (0.6, -0.6, 1.4), (1.8, 1.9, 1.3)), (1, (1.5, 0.6, 1.4), (1.8, 1.9, 1.35))], n)
    return M(ev, bed=0.2, amb='room')


# ---------------- SCENE 21 1か月後 ----------------
def nPigeonFar(n):  # 鳩は猫の声から少し離れた場所で餌を探す
    park()
    bush((-3.0, 1.8, 0.45), 0.9)
    c = cat((-2.8, 1.2, 0), 'tora', s=0.62, rot_z=0.2, pose='crouch')
    fr = meow_times(n, every=(55, 85)); meow(c, fr)
    rnd = random.Random(31)
    for i in range(9):
        b = pigeon((rnd.uniform(2.5, 5.0), rnd.uniform(-1.5, 1.5), 0), rot_z=rnd.uniform(-3, 3))
        peck(b, n, rnd)
    cam = camera(32, dof=5.0, fstop=3.0)
    cam_path(cam, [(0, (1.0, -6.0, 0.8), (0.5, 0.4, 0.3)), (1, (1.8, -5.0, 0.8), (1.5, 0.4, 0.3))], n)
    return M([(f, 0.5, 1.0) for f in fr], bed=0.5, amb='day')


def nFinal(n):  # 机は窓から離れた壁際へ。足元で猫が鳴き、あなたが返事をする
    living_room()
    table((-3.0, 0.6, 0), 0.7, 1.3, 0.72, rot_z=0); laptop((-3.0, 0.6, 0.75), rot_z=-math.pi / 2)
    p = person((-2.4, 0.6, 0), hexc('#c7d3e0'), pose='sit', rot_z=-math.pi / 2, act='type', name='you')
    c = cat((-2.0, 0.05, 0), 'tora', s=0.62, rot_z=-math.pi * 0.75, name='basecat')
    fr = meow_times(n, every=(55, 80), start=(20, 30)); meow(c, fr)
    f = fr[0] + 10 if fr else int(n * 0.3)
    p.keyframe_insert('rotation_euler', frame=f); p.rotation_euler.z = -math.pi * 0.85; p.keyframe_insert('rotation_euler', frame=f + 14)
    h = bpy.data.objects[p['head']]
    h.keyframe_insert('rotation_euler', frame=f); h.rotation_euler.x = 0.45; h.keyframe_insert('rotation_euler', frame=f + 14)
    cam = camera(35, dof=2.0, fstop=2.0)
    cam_path(cam, [(0, (0.4, -1.6, 1.3), (-2.4, 0.4, 0.6)), (1, (-0.4, -1.4, 1.0), (-2.2, 0.2, 0.45))], n)
    return M([(x, 0.9, 1.0) for x in fr], bed=0.25, amb='room')


# ---------------- 使い回し（名前を変えて別カットにする） ----------------
def A(fn, name, **ov):
    def f(n):
        m = fn(n); m.update(ov); m['silent_until'] = None; m['silent_from'] = None
        return m
    f.__name__ = name
    globals()[name] = f
    return f


# カット表：章（SCENE 01＝章0 … SCENE 21＝章20、章21＝エンドカード）-> [(その章で何行目から, 関数)]
SHOTS = {
    0: [(-1, nWinOpen), (1, A(s00b, 'v00b')), (2, A(s00a, 'v00a')), (3, A(s02b, 'v00c')), (4, A(s00d, 'v00d')),
        (5, nPigeonUp), (6, nCrowWire), (7, nDogBark), (8, nStreetLook), (10, nNoCatRoom), (11, A(s00c, 'v00g'))],
    1: [(-1, A(s00f, 'v01a')), (2, nPhone), (7, nWinClose), (9, A(x04d, 'v01d')), (11, nTV)],
    2: [(-1, A(s01a, 'v02g')), (1, A(s01f, 'v02l')), (3, A(s01g, 'v02n')), (4, A(x01h, 'v02k')), (5, A(s01d, 'v02i')),
        (6, A(s09b, 'v02s')), (8, A(s05c, 'v02z'))],
    3: [(-1, nDotsJapan), (1, nDotsWorld), (2, nPile), (6, nDotsSpread), (8, A(s04c, 'v03c')), (10, nNoiseMap)],
    4: [(-1, nPigeonPeck), (4, nSparrow), (6, nParkTop), (8, A(s10a, 'v04a')), (10, A(s10b, 'v04b'))],
    5: [(-1, nDuskMarks), (4, A(x09b, 'v05s')), (8, A(s08a, 'v05c')), (10, A(s08b, 'v05p'))],
    6: [(-1, A(s12a, 'v06a')), (3, A(s12b, 'v06b')), (4, A(x11w, 'v06w')), (5, A(s00e, 'v06e')), (6, A(s12c, 'v06c'))],
    7: [(-1, A(s05a, 'v07a')), (1, A(s05d, 'v07d')), (3, A(x05b, 'v07k')), (5, A(x06n, 'v07n')), (8, nEarplugSleep),
        (9, A(x05e, 'v07e')), (11, A(x05f, 'v07f')), (12, A(x08a, 'v07s'))],
    8: [(-1, nCrowWatch), (3, nCrowGarbage), (5, nBandCrow), (7, nCrowsTown), (8, nTrashStreet)],
    9: [(-1, nDogBark2), (3, nDogQuiet), (5, nDogSofa), (6, nDogWalk), (9, nBirdcage), (11, nDogCat)],
    10: [(-1, nStation), (1, A(s07b, 'v10m')), (3, nCallDesk), (5, nClass), (9, nCafePoint), (10, nHospNum), (11, A(x02b, 'v10z'))],
    11: [(-1, A(s03b, 'v11b')), (3, nOldCat), (6, A(s03c, 'v11c')), (7, A(x12c, 'v11x')), (8, A(x03w, 'v11w')), (9, A(s03a, 'v11q')),
         (10, A(s13a, 'v11h'))],
    12: [(-1, A(s11b, 'v12s')), (2, A(x10s, 'v12b')), (4, A(s06b, 'v12p')), (6, A(x10a, 'v12c')), (8, A(x10c, 'v12k')), (10, nShelterDoor)],
    13: [(-1, nRadio), (2, nRecStudio), (4, nWedding), (5, nStream)],
    14: [(-1, nGrassWalk), (2, nCricket), (3, nBandInsect), (6, nRiver), (10, nKidBook)],
    15: [(-1, nShelf), (3, nBooth), (5, A(x04d, 'v15d')), (7, nOneRoom), (9, nNotice), (11, A(s06c, 'v15e'))],
    16: [(-1, nInn), (2, nShip), (5, nPetHotel), (8, A(x02c, 'v16g'))],
    17: [(-1, nHoarse), (4, nNightVet), (5, nVetWater), (7, nWalkHome)],
    18: [(-1, nTwoCats), (4, A(nDotsWorld, 'v18d')), (5, nReply), (10, A(s14e, 'v18t', bed=0.4))],
    19: [(-1, nVoiceBowl), (3, nVoiceDoor), (4, nVoiceLap), (6, nFridge)],
    20: [(-1, nWinMonth), (2, nPigeonFar), (3, nSparrowNew), (4, nDogWalkMonth), (5, A(nGrassWalk, 'v20g')),
         (6, A(nCallDesk, 'v20c')), (8, A(s00a, 'v20a')), (9, nFinal)],
    21: [(-1, A(x14a, 'v21e', bed=0.15))],
}
