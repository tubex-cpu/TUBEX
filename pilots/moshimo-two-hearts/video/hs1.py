"""カット：SCENE 01〜08（章0〜7）"""
from hk import *
from shots import _font, _tl


def MB(beats=0.0, amb='room', meows=None, bed=0.0, **kw):
    m = M(meows or [], bed, amb=amb)
    m['beats'] = beats
    m.update(kw)
    return m


def sway(cam, n, keys, amp=0.012):
    """電車の揺れ：keys のカメラ道筋に小さな揺れを足す"""
    cam_path(cam, keys, n)
    rnd = random.Random(3)
    for f in range(1, n + 1, 9):
        cam.location.z += 0  # 位置は cam_path のまま
    fc_src = None
    return cam


# ---------------- SCENE 01 二つの鼓動（章0） ----------------
def hTrainPOV(n, night=False):  # 朝の満員電車：主観。つり革を持つ手、窓の外を街が流れる
    st, si, _ = train_car(n, stand=9, sit=14, seed=1, avoid=lambda x, y: -1.4 < x < 1.6 and y < 0.3)
    hand = pov_hand((0.25, 0.62, 1.74), shoulder=(0.05, -0.25, 1.32))
    cam = camera(26)
    cam_path(cam, [(0, (-0.1, -0.45, 1.62), (1.3, 1.45, 1.28)), (0.5, (-0.08, -0.42, 1.63), (1.6, 1.45, 1.25)),
                   (1, (-0.1, -0.44, 1.61), (1.9, 1.45, 1.3))], n)
    for f in range(1, n + 1, 14):  # 揺れ
        cam.location.z = 1.62 + 0.008 * math.sin(f * 0.45); cam.keyframe_insert('location', index=2, frame=f)
    bob(hand, n, amp=0.01, period=28)
    return MB(0.45, amb='city')


def you_in_train(n, f_hand=None, bpm=(72, 63), close=False, seed=2, cheek=False):
    """車内のあなた（正面から）。片手はつり革、片手は胸へ"""
    st, si, _ = train_car(n, stand=7, sit=10, seed=seed, avoid=lambda x, y: -1.6 < x < 2.2 and y < 0.2)
    you = person((0.3, -0.35, 0), hexc('#2f3440'), skin=SKIN[0], hair=hexc('#2b2420'), rot_z=0.0, name='you')
    arm_up(you, 0)
    j = arm_to(you, 0, (0.03, -0.27, 1.34), f=f_hand)
    hearts(you, n, bpm=bpm, size=1.15)
    if cheek:
        cheeks(you, 1, int(n * 0.6))
    return you


def hChestYou(n):  # 胸の奥でドクン、トクン。胸に手を当てる
    you_in_train(n, f_hand=int(n * 0.45))
    cam = camera(35, dof=1.3, fstop=2.4)
    cam_path(cam, [(0, (0.8, -1.65, 1.55), (0.3, -0.35, 1.38)), (1, (0.6, -1.45, 1.45), (0.3, -0.35, 1.3))], n)
    return MB(1.0, amb='city')


def hChestTwo(n):  # 左の胸と右の胸：二つの音はそろっていない
    you_in_train(n, f_hand=None, bpm=(74, 58))
    cam = camera(50, dof=1.1, fstop=2.0)
    cam_path(cam, [(0, (0.1, -1.4, 1.32), (0.3, -0.35, 1.25)), (1, (0.5, -1.35, 1.3), (0.3, -0.35, 1.25))], n)
    return MB(1.0, amb='city')


def hWatch(n):  # 腕時計が一斉に震える：画面に「不規則な心拍」
    train_car(n, stand=6, sit=10, seed=3, avoid=lambda x, y: -1.5 < x < 1.5 and y < 0.4)
    f = int(n * 0.2)
    watch_arm((0.0, -0.2, 1.25), n, [('h_w_time', draw_watch(['8:00'])), ('h_w_irr', draw_watch(['不規則な', '心拍'], red=True))],
              swap_at=(f,), vibrate=(f, n), rot_z=0.15)
    cam = camera(55, dof=0.42, fstop=2.0)
    cam_path(cam, [(0, (-0.12, -0.42, 1.62), (-0.2, -0.2, 1.27)), (1, (-0.1, -0.38, 1.58), (-0.2, -0.2, 1.27))], n)
    return MB(0.6, amb='city')


def hTrainCrowd(n):  # 隣の人も、向かいの人も、胸に手を当てている
    st, si, _ = train_car(n, stand=10, sit=14, seed=4, avoid=lambda x, y: x < -6.5)
    rnd = random.Random(4)
    for i, p in enumerate(st):
        if len(p['arms']) == 2:
            arm_to(p, 1, (-0.02, -0.27, 1.32), f=int(n * 0.1) + i * 9)
        elif len(p['arms']) == 1:
            arm_to(p, 0, (0.02, -0.27, 1.32), f=int(n * 0.1) + i * 9)
    for i, p in enumerate(si[:8]):
        arm_to(p, 1, (-0.02, -0.27, 0.95), f=int(n * 0.2) + i * 11)
    cam = camera(28)
    cam_path(cam, [(0, (-8.2, 0.1, 1.65), (2.0, -0.3, 1.2)), (1, (-7.2, -0.1, 1.6), (3.0, 0.3, 1.15))], n)
    return MB(0.8, amb='city')


def station_front(night=False):
    sky(hexc('#b7d0e6')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    light_dir((0.4, -0.5, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(rgb=hexc('#c2bcb0'))
    box((0, 9, 3.5), (26, 8, 7), hexc('#e2ddd2'))
    box((0, 4.96, 5.6), (8, 0.1, 1.0), hexc('#3a6aa0'))
    label3d('えき', (0, 4.9, 5.4), 0.7, (1, 1, 1))
    for x in (-8, -4, 4, 8):
        box((x, 4.95, 1.4), (2.6, 0.1, 2.8), hexc('#9fb6c8'))
    for x in (-10, 10):
        tree((x, 2, 0), s=0.9)


def hLineup(n):  # 人も、犬も、猫も、鳥も、魚も：胸に二つの光
    station_front()
    rnd = random.Random(5)
    p = crowd_person((-3.0, 1.0, 0), rnd, rot_z=0.2, name='walker')
    hearts(p, n, size=1.2)
    d = animal((-1.6, 0.6, 0), 'shiba', rot_z=0.3, pose='sit', name='dog')
    hearts(d, n, bpm=(90, 80), size=1.6)
    c = cat((-0.4, 0.5, 0.9), 'mike', s=0.7, rot_z=-0.2, name='cat')
    box((-0.4, 0.55, 0.45), (0.9, 0.6, 0.9), hexc('#a77d55'))  # 台
    hearts(c, n, bpm=(110, 95), size=1.7)
    for i in range(4):
        b = pigeon((0.6 + i * 0.45, 0.2 + rnd.uniform(-0.3, 0.3), 0), rot_z=rnd.uniform(-1, 1))
        peck(b, n, rnd)
        hearts(birdbody(b), n, bpm=(130, 115), size=1.6, halo=True)
    # 水槽の金魚
    box((2.9, 0.7, 0.4), (1.0, 0.6, 0.8), hexc('#8c6a4c'))
    tank = box((2.9, 0.7, 1.08), (0.8, 0.45, 0.55), (1, 1, 1)); tank.data.materials.clear(); tank.data.materials.append(gmat((0.6, 0.85, 1.0), 0.3, 'glass'))
    for k in range(2):
        f = fish((2.9, 0.7, 1.05), s=1.4, name=f'gf{k}')
        circle_path(f, n, (2.9, 0.7, 1.0 + k * 0.12), 0.22, laps=2.0, phase=k * 2)
        wiggle(O[f['ftail']], n, idx=2, amp=0.4, period=8)
        hearts(O[f['fbody']], n, bpm=(80, 70), size=2.4, halo=True, out=0.9, up=0.0)
    cam = camera(40)
    cam_path(cam, [(0, (-2.8, -2.6, 1.3), (-1.6, 0.6, 0.7)), (1, (2.2, -2.7, 1.3), (2.0, 0.6, 0.8))], n)
    return MB(0.8, amb='city')


def train_exterior(n, cars=4, x0=-90.0, x1=50.0, z=6.0, y=0.0, night=False, lit=True):
    """高架を走る電車（外から）。窓に胸の光が点々と灯る"""
    track = empty((0, 0, 0), 'track')
    box((0, y, z - 0.4), (300, 3.2, 0.5), hexc('#9a958d'))
    for x in range(-150, 150, 12):
        box((x, y, (z - 0.6) / 2), (0.8, 0.8, z - 0.6), hexc('#b0aba0'))
    tr = empty((x0, y, z), 'train')
    rnd = random.Random(7)
    for k in range(cars):
        cx = -k * 18.6
        link(box((cx, 0, 1.6), (18, 2.9, 3.2), hexc('#eef0ee'), bevel=0.1), tr)
        link(box((cx, -1.46, 1.75), (17, 0.04, 0.9), hexc('#4d6a8a')), tr)
        link(box((cx, 1.46, 1.75), (17, 0.04, 0.9), hexc('#4d6a8a')), tr)
        link(box((cx, -1.47, 0.95), (18, 0.03, 0.18), hexc('#2f8a4a')), tr)
        for j in range(10):
            g = pulse((cx - 8 + j * 1.75 + rnd.uniform(-0.3, 0.3), -1.5, 1.75), n, bpm=rnd.uniform(60, 80), r=0.09, offset=rnd.random(), parent=tr)
    tr.keyframe_insert('location', frame=1)
    tr.location.x = x1; tr.keyframe_insert('location', frame=n)
    linear(tr, 'location')
    return tr


def hTrainCity(n, night=False):  # 心臓を持つすべての生き物に、心臓がもう一つ
    env_town(night=night, nx=7, ny=5, seed=3, skip=lambda x, y: abs(y) < 8)
    train_exterior(n, x0=-60, x1=70, z=6.0)
    rnd = random.Random(9)
    # 道を歩く人と犬にも胸の光
    for i in range(6):
        p = crowd_person((rnd.uniform(-14, 14), -4.5 + rnd.uniform(-0.6, 0.6), 0), rnd, rot_z=math.pi / 2 * rnd.choice([1, -1]), name=f'w{i}')
        x = p.location.x; dx = 6 * (1 if p.rotation_euler.z < 0 else -1)
        move(p, [(1, (x, p.location.y, 0)), (n, (x + dx, p.location.y, 0))])
        hearts(p, n, size=1.6)
    cam = camera(30)
    cam_path(cam, [(0, (-16, -7.5, 2.4), (6, 0, 5.0)), (1, (-6, -7.5, 2.6), (16, 0, 5.5))], n)  # 線路沿いの空き地から見上げる（手前の家が画面をふさがない）
    return MB(0.7, amb='city')


# ---------------- SCENE 02 頬が、赤くなる（章1） ----------------
def hCheeks(n):  # 向かいの人の頬が、ほんのり赤くなる
    train_car(n, stand=4, sit=12, seed=5, avoid=lambda x, y: (-1.0 < x < 1.0 and y > 0.8) or (-1.5 < x < 1.5 and -0.8 < y < 0.8))
    rnd = random.Random(5)
    a = crowd_person((0.0, 1.08, 0), rnd, pose='sit', rot_z=0, name='opp')
    b = crowd_person((0.62, 1.08, 0), rnd, pose='sit', rot_z=0, name='opp2')
    for p in (a, b):
        cheeks(p, int(n * 0.1), int(n * 0.7))
        hearts(p, n, size=1.0)
    cam = camera(40, dof=1.6, fstop=2.2)
    cam_path(cam, [(0, (0.3, -0.6, 1.3), (0.3, 1.08, 0.95)), (1, (0.3, -0.4, 1.25), (0.3, 1.08, 1.0))], n)
    return MB(0.65, amb='city')


def palm(loc, rot=(0, 0, 0), skin=None, name='palm'):
    """手のひら（上向き）"""
    skin = skin or SKIN[0]
    root = empty(loc, name); root.rotation_euler = rot
    link(sphere((0, 0, 0), 0.07, skin, scale=(1.0, 1.15, 0.35)), root)
    for k in range(4):
        link(cyl((-0.045 + k * 0.03, -0.11, 0.005), 0.013, 0.08, skin, rot=(math.pi / 2, 0, 0)), root)
    link(cyl((0.075, -0.02, 0.0), 0.015, 0.07, skin, rot=(math.pi / 2, 0, -0.9)), root)
    link(cyl((0, 0.16, -0.01), 0.04, 0.2, skin, rot=(math.pi / 2, 0, 0)), root)
    link(cyl((0, 0.32, -0.01), 0.055, 0.14, hexc('#2f3440'), rot=(math.pi / 2, 0, 0)), root)
    return root


def hPalm(n):  # 手のひらが、じんわり温かい（湯気のような淡い光）
    train_car(n, stand=4, sit=10, seed=6, avoid=lambda x, y: -1.5 < x < 1.5 and y < 0.4)
    h = palm((0.0, -0.3, 1.15), rot=(0.25, 0, 0.2))
    rnd = random.Random(6)
    starts = [(rnd.uniform(-0.05, 0.05), -0.3 + rnd.uniform(-0.06, 0.06), 1.17) for _ in range(14)]
    ends = [(x + rnd.uniform(-0.03, 0.03), y, z + rnd.uniform(0.18, 0.3)) for x, y, z in starts]
    particles_flow(n, starts, ends, rgb=(1.0, 0.8, 0.75), size=0.007, period=48, a=0.4)
    glow = ball((0.0, -0.3, 1.16), 0.075, (1.0, 0.6, 0.55), a=0.0, name='warm')
    gm = glow.data.materials[0]
    gm.diffuse_color = (1.0, 0.6, 0.55, 0.0); gm.keyframe_insert('diffuse_color', frame=1)
    gm.diffuse_color = (1.0, 0.6, 0.55, 0.16); gm.keyframe_insert('diffuse_color', frame=int(n * 0.6))
    cam = camera(55, dof=0.45, fstop=2.0)
    cam_path(cam, [(0, (0.2, -0.85, 1.5), (0, -0.3, 1.15)), (1, (0.12, -0.78, 1.46), (0, -0.3, 1.18))], n)
    return MB(0.65, amb='city')


def hPulse(n):  # 手首で脈を数える：速い脈と遅い脈が重なる
    train_car(n, stand=4, sit=10, seed=7, avoid=lambda x, y: -1.5 < x < 1.5 and y < 0.4)
    root = empty((0, -0.25, 1.15), 'wr'); root.rotation_euler = (0, 0, 0.2)
    link(cyl((0, 0.05, 0), 0.042, 0.4, SKIN[0], rot=(math.pi / 2, 0, 0), verts=20), root)
    link(sphere((0, -0.2, 0), 0.06, SKIN[0], scale=(1.0, 1.1, 0.4)), root)
    link(cyl((0, 0.32, 0), 0.058, 0.2, hexc('#2f3440'), rot=(math.pi / 2, 0, 0)), root)
    # もう一方の手の2本の指
    fing = empty((0.02, -0.08, 0.045), 'fing'); link(fing, root)
    for k in range(2):
        link(cyl((-0.012 + k * 0.026, 0, 0.0), 0.012, 0.09, SKIN[0], rot=(0, math.pi / 2, 0.2)), fing)
    link(sphere((0.07, 0.0, 0.0), 0.04, SKIN[0], scale=(1, 1, 0.5)), fing)
    pulse((-0.012, -0.1, 0.035), n, bpm=96, r=0.012, parent=root)
    pulse((0.014, -0.05, 0.035), n, bpm=61, r=0.012, offset=0.3, parent=root)
    bob(fing, n, amp=0.002, period=12)
    cam = camera(60, dof=0.4, fstop=2.0)
    cam_path(cam, [(0, (0.25, -0.6, 1.42), (0, -0.25, 1.15)), (1, (0.2, -0.55, 1.4), (0, -0.2, 1.15))], n)
    return MB(0.8, amb='city')


def hJacket(n):  # 車内が急に暑くなる：上着を脱ぐ、扇子であおぐ
    st, si, _ = train_car(n, stand=6, sit=12, seed=8, avoid=lambda x, y: -2 < x < 2.2 and y < 0.8)
    rnd = random.Random(8)
    a = crowd_person((-0.5, 0.0, 0), rnd, rot_z=0.3, name='jacket')
    jk = boxc((0, 0, 1.15), (0.5, 0.46, 0.62), hexc('#5a4a3a'))
    jk.parent = a
    jk.keyframe_insert('location', frame=1); jk.keyframe_insert('location', frame=int(n * 0.3))
    jk.location = (0.32, -0.25, 0.75); jk.keyframe_insert('location', frame=int(n * 0.5))
    jk.keyframe_insert('scale', frame=int(n * 0.3)); jk.scale = (0.5, 0.6, 1.0); jk.keyframe_insert('scale', frame=int(n * 0.5))
    b = crowd_person((0.9, 0.2, 0), rnd, rot_z=-0.4, name='fan')
    fan = empty((0, 0, 0), 'fanj')
    j = arm_to(b, 1, (0.12, -0.32, 1.45))
    f = cone((0.12, -0.34, 1.58), 0.16, 0.02, hexc('#f2e0b0'), rot=(math.pi / 2, 0, 0), verts=3); f.parent = b
    wiggle(f, n, idx=2, amp=0.35, period=8)
    cheeks(a, 1, 10); cheeks(b, 1, 10)
    hearts(a, n); hearts(b, n)
    cam = camera(35)
    cam_path(cam, [(0, (0.4, -1.3, 1.5), (0.2, 0.2, 1.25)), (1, (0.0, -1.25, 1.5), (0.2, 0.2, 1.25))], n)
    return MB(0.65, amb='city')


def hDoorOpen(n):  # 次の駅でドアが開き、乗客がいっせいに息を吸う
    f = int(n * 0.25)
    st, si, leaves = train_car(n, moving=False, stand=8, sit=10, seed=9, doors_open=f, avoid=lambda x, y: 3.6 < x < 5.4)
    rnd = random.Random(9)
    for i in range(4):
        p = crowd_person((4.5 + rnd.uniform(-0.4, 0.4), -0.3 + i * 0.3, 0), rnd, rot_z=0, name=f'out{i}')
        x, y = p.location.x, p.location.y
        move(p, [(1, (x, y, 0)), (f + 10 + i * 12, (x, y, 0)), (f + 60 + i * 12, (x + rnd.uniform(-0.6, 0.6), -2.6 - i * 0.3, 0)), (n, (x + rnd.uniform(-1, 1), -3.5 - i * 0.4, 0))])
        hearts(p, n)
    cam = camera(28)
    cam_path(cam, [(0, (1.0, 0.9, 1.7), (4.5, -1.6, 1.1)), (1, (1.6, 1.0, 1.7), (4.5, -2.4, 1.0))], n)
    return MB(0.5, amb='city')


# ---------------- SCENE 03 病院のモニター（章2） ----------------
def nurse_station(n, lamps_off=None, seed=10):
    hosp_room(10, 7, 2.8, window=False)
    box((0, 1.6, 0.55), (6.0, 0.8, 1.1), hexc('#cfdde4'))
    box((0, 1.6, 1.12), (6.1, 0.85, 0.05), hexc('#f4f4f2'))
    mons = []
    for k in range(5):
        x = -2.4 + k * 1.2
        m = monitor((x, 2.6, 1.85), n, s=1.4, name=f'mon{k}', stand=False)
        box((x, 2.75, 1.4), (0.2, 0.2, 0.2), hexc('#c8ccd0'))
        lamp = O[m['lamp']]
        if lamps_off is not None:
            blink(lamp, min(n, lamps_off + k * int(n * 0.12)), 10, k % 2)
            lamp.keyframe_insert('scale', frame=lamps_off + k * int(n * 0.12))
            lamp.scale = (0, 0, 0); lamp.keyframe_insert('scale', frame=lamps_off + k * int(n * 0.12) + 1)
        else:
            blink(lamp, n, 10, k % 2)
        mons.append(m)
    return mons


def hNurseStation(n):  # 五分後、病院：どの画面にも緑の波が二本
    nurse_station(n)
    rnd = random.Random(10)
    for i in range(3):
        nu = nurse((-3 + i * 2.5, 0.6, 0), rot_z=math.pi, name=f'nurse{i}')
        x = nu.location.x
        move(nu, [(1, (x, 0.6, 0)), (n, (x + 1.6, 0.9, 0))])
        hearts(nu, n, size=1.1)
    cam = camera(30)
    cam_path(cam, [(0, (-3.2, -3.0, 1.8), (0, 2.6, 1.7)), (1, (-1.0, -2.6, 1.7), (0.6, 2.6, 1.8))], n)
    return MB(0.4, amb='room')


def exam_room():
    hosp_room(7, 6, 2.7, window=True)
    box((2.2, 2.2, 0.38), (1.8, 0.8, 0.76), hexc('#d6e2e8'))  # 寝台
    table((-2.0, 2.2, 0), 1.2, 0.7, 0.72, c=hexc('#e8e4dc'))
    laptop((-2.0, 2.25, 0.75), rot_z=math.pi)


def hStetho(n):  # 医師が聴診器を、左で一つ、右でもう一つ
    exam_room()
    pt = person((0.0, 0.6, 0), hexc('#c7d3e0'), pose='sit', rot_z=math.pi * 0.5, name='patient')  # 前は +x
    box((0.0, 0.6, 0.22), (0.45, 0.45, 0.44), hexc('#8a8a8a'))
    hearts(pt, n, size=1.1)
    dc = doctor((0.8, 0.45, 0), rot_z=-math.pi * 0.5, name='doc')
    j = arm_to(dc, 1, (0.0, -0.62, 1.12))
    st = stethoscope((0, 0, 0))
    # 患者の胸の前（ローカル -y が胸の向き → 世界では -x 側）
    p1 = (0.235, 0.67, 0.9); p2 = (0.235, 0.53, 0.9)
    st.location = p1; st.rotation_euler = (0, 0, math.pi / 2); st.keyframe_insert('location', frame=1); st.keyframe_insert('location', frame=int(n * 0.45))
    st.location = p2; st.keyframe_insert('location', frame=int(n * 0.55))
    cam = camera(38, dof=2.0, fstop=2.4)
    cam_path(cam, [(0, (-0.3, -1.6, 1.4), (0.35, 0.55, 0.95)), (1, (-0.1, -1.4, 1.35), (0.35, 0.55, 0.95))], n)
    return MB(0.9, amb='room')


def hReboot(n):  # 機械の電源を入れ直す：波は、二本のまま
    hosp_room(6, 5, 2.7, window=False)
    root = empty((0, 2.0, 1.4), 'monr'); root.scale = (2.4, 2.4, 2.4)
    link(box((0, 0.03, 0.0), (0.62, 0.08, 0.42), hexc('#3a3e44'), bevel=0.02), root)
    a = ecg_screen('h_ecgA', (0, -0.012, 0), 0.54, 0.34, n, two=True); link(a, root)
    b = tex_plane('h_ecg_blank', draw_ecg(blank=True), (0, -0.013, 0), 0.54, 0.34); link(b, root)
    c = ecg_screen('h_ecgC', (0, -0.014, 0), 0.54, 0.34, n, two=True); link(c, root)
    f1, f2 = int(n * 0.3), int(n * 0.5)
    swap_seq([a, b, c], [f1, f2])
    btn = link(cyl((0.26, -0.02, -0.17), 0.012, 0.01, hexc('#3ac860'), rot=(math.pi / 2, 0, 0)), root)
    finger = cyl((0.0, 0, 0), 0.025, 0.25, SKIN[0], rot=(math.pi / 2, 0, 0))
    finger.location = (0.75, 1.3, 0.95); finger.keyframe_insert('location', frame=1); finger.keyframe_insert('location', frame=f1 - 12)
    finger.location = (0.63, 1.82, 0.99); finger.keyframe_insert('location', frame=f1 - 2)
    finger.location = (0.75, 1.3, 0.95); finger.keyframe_insert('location', frame=f1 + 12)
    finger.keyframe_insert('location', frame=f2 - 14)
    finger.location = (0.63, 1.82, 0.99); finger.keyframe_insert('location', frame=f2 - 2)
    finger.location = (0.75, 1.2, 0.9); finger.keyframe_insert('location', frame=f2 + 14)
    cam = camera(40)
    cam_path(cam, [(0, (0.4, -0.6, 1.5), (0, 2.0, 1.4)), (1, (0.2, 0.0, 1.45), (0, 2.0, 1.4))], n)
    return MB(0.7, amb='room')


def hDocSelf(n):  # 医師は、自分の胸に聴診器を当てる
    exam_room()
    dc = doctor((0.0, 0.8, 0), rot_z=0.15, name='doc')
    f = int(n * 0.25)
    arm_to(dc, 1, (-0.02, -0.25, 1.28), f=f)
    st = stethoscope((0, 0, 0)); st.parent = dc
    st.location = (0.3, -0.1, 0.9); st.keyframe_insert('location', frame=1); st.keyframe_insert('location', frame=f)
    st.location = (-0.02, -0.235, 1.3); st.rotation_euler = (0, 0, 0); st.keyframe_insert('location', frame=f + 10)
    hearts(dc, n, size=1.2, mode=(('appear', f + 14), ('appear', f + 22)))
    cam = camera(45, dof=1.6, fstop=2.2)
    cam_path(cam, [(0, (0.6, -1.2, 1.55), (0.0, 0.8, 1.35)), (1, (0.4, -0.9, 1.5), (0.0, 0.8, 1.3))], n)
    return MB(0.95, amb='room')


def hAlarmsOff(n):  # 看護師が、アラームを一つずつ止めていく
    nurse_station(n, lamps_off=int(n * 0.15))
    nu = nurse((-2.6, 2.0, 0), rot_z=math.pi, name='nurseA')
    move(nu, [(1, (-2.6, 2.0, 0)), (n, (2.6, 2.0, 0))])
    hearts(nu, n, size=1.1)
    cam = camera(35)
    cam_path(cam, [(0, (-1.5, -1.8, 1.7), (-1.0, 2.5, 1.6)), (1, (1.5, -1.8, 1.7), (1.4, 2.5, 1.6))], n)
    return MB(0.4, amb='room')


# ---------------- SCENE 04 驚かない人たち（章3） ----------------
def ward(n, two=False, seed=11):
    hosp_room(8, 6, 2.7, window=True)
    rnd = random.Random(seed)
    elder_bed, elder = hosp_bed((-0.9, 1.4, 0), rot_z=0, patient=hexc('#a9c4d8'), sit_up=True, name='elder')
    monitor((-1.9, 2.4, 1.55), n, s=1.2, name='mon_e', stand=False)
    hearts(elder, n, bpm=(64, 58), size=1.15)
    young = None
    if two:
        _, young = hosp_bed((1.3, 1.4, 0), rot_z=0, patient=hexc('#e8d0a8'), sit_up=True, name='young')
        monitor((2.3, 2.4, 1.55), n, s=1.2, name='mon_y', stand=False)
    return elder, young


def hElderBed(n):  # 新聞を読む年配の患者：モニターには、もともと二本の波
    elder, _ = ward(n)
    paper = tex_plane('h_paper', draw_card('', ['しんぶん', '━━━━ ━━', '━━ ━━━━━']), (0, 0, 0), 0.5, 0.34, rot=(math.pi / 2 - 0.3, 0, 0))
    paper.parent = elder; paper.location = (0, -0.42, 1.0)
    arm_to(elder, 0, (-0.2, -0.38, 0.98)); arm_to(elder, 0, (0.2, -0.38, 0.98))
    cam = camera(35, dof=2.4, fstop=2.4)
    cam_path(cam, [(0, (0.8, -1.4, 1.5), (-1.2, 1.6, 1.3)), (1, (0.4, -1.0, 1.45), (-1.3, 1.8, 1.4))], n)
    return MB(0.6, amb='room')


def hTwoHeartsBody(n):  # 自分の心臓を残したまま、もう一つの心臓をつないだ人（模式）
    sky(hexc('#c9b89a')); s = bpy.context.scene; s.view_settings.exposure = 0.15
    s.display.shading.show_shadows = False
    p = person((0, 0, 0), hexc('#ffffff'), rot_z=0, name='ghost', s=1.3)
    ghost_body(p, rgb=(0.7, 0.82, 1.0), a=0.3)
    body = O[p['body']]
    for k, (side, b) in enumerate(((1, 66), (-1, 58))):
        loc = chest_point(body, side, 0.3, 0.6); loc = body_center(body) + (loc - body_center(body)) * 0.5
        h = heart3d(loc, s=0.085, rgb=(1.0, 0.4, 0.45), parent=body.parent)
        beat_scale(h, n, bpm=b, amp=0.18, offset=k * 0.4)
    for i in range(30):
        rnd = random.Random(i)
        ball((rnd.uniform(-1.4, 1.4), rnd.uniform(0.5, 2.0), rnd.uniform(0.2, 2.6)), 0.03, (1, 0.9, 0.8), a=0.4, seg=8)
    cam = camera(45)
    cam_path(cam, [(0, (0.3, -2.5, 1.75), (0, 0, 1.45)), (1, (-0.2, -2.1, 1.7), (0, 0, 1.45))], n)
    return MB(0.7, amb='silent')


def hNeighborBed(n, close=False):  # 隣のベッドの人が不安そうに胸を押さえる。二つの鼓動を知っている人が笑う
    elder, young = ward(n, two=True)
    arm_to(young, 1, (-0.02, -0.25, 0.95)); arm_to(young, 0, (0.03, -0.25, 0.9))
    hearts(young, n, bpm=(80, 70), size=1.15)
    arm_to(elder, 1, (-0.04, -0.27, 0.98), f=int(n * 0.3))
    if close:
        cam = camera(50, dof=1.8, fstop=2.2)
        cam_path(cam, [(0, (-0.4, -0.6, 1.4), (-0.9, 1.4, 1.15)), (1, (-0.5, -0.4, 1.35), (-0.9, 1.4, 1.15))], n)
    else:
        cam = camera(32)
        cam_path(cam, [(0, (0.2, -2.2, 1.6), (0.2, 1.5, 1.0)), (1, (0.3, -1.8, 1.55), (0.2, 1.5, 1.0))], n)
    return MB(0.6, amb='room')


def hElderSmile(n):
    return hNeighborBed(n, close=True)


# ---------------- SCENE 05 鼓動が、ゆっくりになる（章4） ----------------
def office_desks(n, seed=12, fade=False, bpm=(70, 62)):
    sky(hexc('#d9d2c4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(10, 8, 2.7, floor=hexc('#9aa0a6'), wall=hexc('#eef0f2'))
    rnd = random.Random(seed)
    ps = []
    for r in range(2):
        for k in range(3):
            x = -3 + k * 3; y = 1.6 - r * 2.2
            table((x, y, 0), 1.4, 0.7, 0.72, c=hexc('#e8e4dc')); laptop((x, y + 0.05, 0.75), rot_z=math.pi)
            p = crowd_person((x, y - 0.55, 0), rnd, pose='sit', rot_z=0 if False else math.pi, act='type', name=f'of{r}{k}')
            ps.append(p)
            if fade:
                cheeks(p, 1, int(n * 0.7), grow=False)
            hearts(p, n, bpm=bpm, size=1.7)
    return ps


def hOffice(n):  # 一時間後、会社：頬の赤みが、すっと引いていく
    office_desks(n, fade=True, bpm=((70, 55), (62, 50)))
    cam = camera(35)
    cam_path(cam, [(0, (3.2, 3.3, 1.8), (-1.0, -0.6, 0.9)), (1, (2.2, 3.2, 1.7), (-1.6, -0.8, 0.9))], n)
    return MB(0.6, amb='room')


def you_desk(n, bpm=((60, 40), (55, 37)), seed=13):
    office_desks(n, seed=seed, bpm=(55, 48))
    you = person((0.0, -2.8, 0), hexc('#2f3440'), pose='sit', rot_z=0, name='you')
    hearts(you, n, bpm=bpm, size=1.2)
    return you


def hChestSlow(n):  # 二つの心臓が、それぞれ、ゆっくり打つようになる
    you_desk(n)
    cam = camera(45, dof=1.6, fstop=2.0)
    cam_path(cam, [(0, (0.4, -4.4, 1.15), (0.0, -2.8, 0.95)), (1, (0.2, -4.2, 1.1), (0.0, -2.8, 0.92))], n)
    return MB(0.9, amb='room')


def hWatchDrop(n):  # 腕時計の数字が下がっていく：七十、五十、四十
    office_desks(n, seed=14, bpm=(50, 44))
    f1, f2 = int(n * 0.36), int(n * 0.62)
    watch_arm((0.0, -2.0, 0.78), n, [('h_w70', draw_watch(['70'], red=True)), ('h_w50', draw_watch(['50'], red=True)), ('h_w40', draw_watch(['40'], red=True))],
              swap_at=(f1, f2), rot_z=0.1)
    table((0.0, -2.0, 0), 1.2, 0.7, 0.72, c=hexc('#e8e4dc'))
    cam = camera(55, dof=0.42, fstop=2.0)
    cam_path(cam, [(0, (-0.12, -2.24, 1.15), (-0.2, -2.0, 0.8)), (1, (-0.1, -2.2, 1.12), (-0.2, -2.0, 0.8))], n)
    return MB(0.8, amb='room')


def hShareWork(n):  # 一日に、およそ十万回。その仕事を、二つの心臓で分け合う
    sky(hexc('#1a2030')); s = bpy.context.scene; s.view_settings.exposure = 0.3
    s.display.shading.show_shadows = False
    a = heart3d((-0.55, 0, 0), s=0.6); b = heart3d((0.55, 0, 0), s=0.6)
    beat_scale(a, n, bpm=48, amp=0.14); beat_scale(b, n, bpm=42, amp=0.14, offset=0.45)
    for h in (a, b):
        hal = ball(h.location, 0.62, HB_HALO, a=0.07, seg=20)
    rnd = random.Random(15)
    for i in range(60):
        o = ball((rnd.uniform(-3, 3), rnd.uniform(1, 4), rnd.uniform(-1.8, 1.8)), rnd.uniform(0.01, 0.03), (1, 0.8, 0.8), a=0.6, seg=6)
    cam = camera(40)
    cam_path(cam, [(0, (0, -4.2, 0.2), (0, 0, 0)), (1, (0.3, -3.6, 0.25), (0, 0, 0))], n)
    return MB(1.0, amb='silent')


def hStairs(n):  # 階段を駆け上がる：息は上がるが、胸はドキドキしない
    sky(hexc('#d9d2c4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(6, 8, 6, floor=hexc('#9aa0a6'), wall=hexc('#eef0f2'), window=False)
    for k in range(16):
        box((0.6, -2.2 + k * 0.3, k * 0.18 + 0.09), (1.4, 0.3, 0.18), hexc('#c8c4bc'))
    box((1.35, 0.2, 1.8), (0.06, 5.0, 0.06), hexc('#8a8a8a'), rot=(0.54, 0, 0))
    p = person((0.6, -2.8, 0), hexc('#c7d3e0'), pants=hexc('#3b4252'), rot_z=math.pi, name='runner')
    keys = [(1, (0.6, -2.8, 0))]
    for k in range(17):
        keys.append((int(10 + k * (n - 20) / 17), (0.6, -2.2 + k * 0.3, min(k, 16) * 0.18)))
    move(p, keys)
    hearts(p, n, bpm=(46, 40), size=1.2)
    cam = camera(30)
    cam_path(cam, [(0, (-2.3, -4.0, 1.6), (0.6, -1.5, 1.2)), (1, (-2.4, -0.5, 3.0), (0.6, 2.2, 3.0))], n)
    return MB(0.8, amb='room')


# ---------------- SCENE 06 茶わん半分の空腹（章5） ----------------
def rice_bowl(loc, fill=0.5, s=1.0, parent=None):
    root = empty(loc, 'bowl'); root.scale = (s, s, s)
    link(cyl((0, 0, 0.035), 0.06, 0.07, hexc('#f2efe8'), r2=0.085, verts=24), root)
    link(cyl((0, 0, 0.004), 0.045, 0.012, hexc('#e2ddd2'), verts=20), root)
    if fill > 0:
        link(sphere((0, 0, 0.055 + 0.02 * fill), 0.078, hexc('#fbfaf6'), scale=(1, 1, 0.25 + 0.35 * fill), seg=16), root)
    # 青い線
    link(cyl((0, 0, 0.06), 0.079, 0.006, hexc('#3a5a9a'), verts=24), root)
    if parent is not None:
        root.parent = parent
    return root


def onigiri(loc, s=1.0, rot_z=0.0):
    root = empty(loc, 'oni'); root.scale = (s, s, s); root.rotation_euler = (0, 0, rot_z)
    o = cyl((0, 0, 0.0), 0.07, 0.04, hexc('#fbfaf6'), verts=3)
    o.rotation_euler = (math.pi / 2, 0, 0); o.location = (0, 0, 0.035); link(o, root)
    link(box((0, -0.002, 0.018), (0.05, 0.045, 0.036), hexc('#1e2a1e')), root)
    return root


def meeting_room(seed=16):
    sky(hexc('#d9d2c4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(8, 6, 2.7, floor=hexc('#9aa0a6'), wall=hexc('#eef0f2'))
    table((0, 0.8, 0), 3.2, 1.2, 0.72, c=hexc('#e8e4dc'))
    rnd = random.Random(seed); ps = []
    for k in range(3):
        for side in (1, -1):
            x = -1.0 + k * 1.0
            p = crowd_person((x, 0.8 + side * 0.95, 0), rnd, pose='sit', rot_z=0 if side > 0 else math.pi, act='talk' if k == 1 else None, name=f'mt{k}{side}')
            ps.append(p)
    return ps


def hMeetingTummy(n):  # 昼。いつもより早く、おなかが鳴る
    ps = meeting_room()
    rnd = random.Random(16)
    for i, p in enumerate(ps):
        hearts(p, n, bpm=(50, 44), size=1.0)
        lx = p.location.x; ly = p.location.y - (0.2 if p.rotation_euler.z == 0 else -0.2)
        rings((lx, ly, 0.8), [int(n * 0.15) + i * 23, int(n * 0.6) + i * 17], rgb=(1.0, 0.75, 0.3), size=0.22, n=2)
    cam = camera(32)
    cam_path(cam, [(0, (2.8, -2.4, 2.0), (0, 0.8, 0.8)), (1, (2.2, -2.0, 1.9), (-0.3, 0.8, 0.8))], n)
    return MB(0.4, amb='room')


def hBowlHalf(n):  # 二つ目の心臓の分：ごはん茶わん半分ほど
    sky(hexc('#e8dfcf')); s = bpy.context.scene; s.view_settings.exposure = 0.5
    room(6, 5, 2.6, floor=hexc('#b48a63'), wall=hexc('#efe7da'))
    table((0, 0.6, 0), 1.2, 0.8, 0.72, c=hexc('#c89a6a'))
    you = person((0, 1.25, 0), hexc('#c7d3e0'), pose='sit', rot_z=0, name='you')
    hearts(you, n, bpm=(50, 44), size=1.25)
    rice_bowl((0.25, 0.55, 0.745), fill=0.5, s=1.3)
    # 胸の二つ目の光の横に浮かぶ、半分の茶わん
    fb = rice_bowl((-0.26, 0.92, 1.05), fill=0.5, s=1.1)
    appear(fb, int(n * 0.3))
    bob(fb, n, amp=0.015, period=40)
    cam = camera(45, dof=1.3, fstop=2.2)
    cam_path(cam, [(0, (0.4, -0.6, 1.25), (0, 1.0, 0.95)), (1, (0.2, -0.4, 1.2), (-0.05, 1.0, 0.95))], n)
    return MB(0.8, amb='room')


def hOnigiriCompare(n):  # 一人あたり毎日捨てられている食べ物、おにぎり一個分より少ない
    sky(hexc('#e8dfcf')); s = bpy.context.scene; s.view_settings.exposure = 0.5
    box((0, 0, 0.35), (2.0, 1.2, 0.7), hexc('#c89a6a'))
    onigiri((0.22, 0.0, 0.7), s=1.6, rot_z=0.2)
    rice_bowl((-0.22, 0.0, 0.7), fill=0.5, s=1.4)
    a = heart3d((-0.22, 0.05, 0.9), s=0.06); beat_scale(a, n, bpm=50, amp=0.2)
    cam = camera(50, dof=0.8, fstop=2.4)
    cam_path(cam, [(0, (-0.5, -0.9, 1.15), (0, 0, 0.78)), (1, (0.5, -0.85, 1.1), (0, 0, 0.78))], n)
    return MB(0.5, amb='room')


def hJapanBowls(n):  # 日本じゅうの人に、一度に起きている
    space_globe()
    dots(land_points(129, 146, 30.5, 45.5, 300, seed=3), 6, int(n * 0.7), size=0.032, rgb=(1.0, 0.35, 0.45))
    cam = camera(50)
    cam_path(cam, [(0, P(137, 37, 13.5), P(137, 37, 0)), (1, P(137, 36, 11.5), P(137, 36, 0))], n)
    return MB(0.6, amb='space')


def hKonbini(n):  # コンビニのおにぎりの棚が、昼前に空になる
    sky(hexc('#e6e6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(10, 7, 3.0, floor=hexc('#e2e2de'), wall=hexc('#f4f4f2'), window=False)
    box((-1.0, 3.15, 0.95), (4.2, 0.1, 1.9), hexc('#d8dcde'))
    box((-1.0, 2.85, 0.1), (4.2, 0.6, 0.2), hexc('#c8ccd0'))
    rnd = random.Random(17)
    items = []
    for lvl in range(4):
        box((-1.0, 2.85, 0.35 + lvl * 0.4), (4.0, 0.6, 0.03), hexc('#c8c8c2'))
        for k in range(14):
            o = onigiri((-2.85 + k * 0.28, 2.75, 0.37 + lvl * 0.4), s=1.0, rot_z=0)
            items.append(o)
    label3d('おにぎり', (-1.0, 2.58, 1.95), 0.18, hexc('#c03a3a'))
    rnd.shuffle(items)
    for i, o in enumerate(items):
        vanish(o, int(5 + i * (n * 0.75) / len(items)))
    for i in range(3):
        p = crowd_person((1.6 + i * 0.9, 1.3 + i * 0.3, 0), rnd, rot_z=math.pi * 0.7, name=f'cust{i}')
        hearts(p, n, bpm=(50, 44))
    clerk = person((4.0, 1.0, 0), hexc('#3a8a5a'), rot_z=math.pi / 2, name='clerk')
    bx = boxc((0, -0.35, 1.1), (0.5, 0.35, 0.3), hexc('#c8a878')); bx.parent = clerk
    move(clerk, [(1, (4.0, 1.0, 0)), (int(n * 0.8), (1.2, 1.9, 0)), (n, (1.0, 2.0, 0))])
    hearts(clerk, n, bpm=(52, 46))
    cam = camera(30)
    cam_path(cam, [(0, (1.2, 0.6, 1.6), (-1.4, 2.75, 1.0)), (1, (0.6, 0.9, 1.5), (-1.6, 2.75, 1.0))], n)
    return MB(0.4, amb='room')


def hKyushoku(n):  # 給食：おかわりの列が、教室の後ろまで伸びる
    sky(hexc('#d9d2c4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(9, 8, 3.0, floor=hexc('#b48a63'), wall=hexc('#f0ece2'))
    box((-1.8, 3.93, 1.6), (3.6, 0.04, 1.3), hexc('#2f4a3a'))
    box((2.4, 3.2, 0.45), (1.8, 0.7, 0.9), hexc('#e8e4dc'))  # 配膳台
    cyl((2.1, 3.2, 1.05), 0.22, 0.3, hexc('#b8bcc0'))
    cyl((2.7, 3.2, 1.02), 0.18, 0.24, hexc('#d8a050'))
    rnd = random.Random(18)
    for r in range(2):
        for k in range(4):
            x = -3.2 + k * 1.4; y = 1.2 - r * 1.6
            table((x, y, 0), 0.7, 0.5, 0.62)
            rice_bowl((x, y, 0.645), fill=0.0, s=1.0)
            kd = crowd_person((x, y - 0.45, 0), rnd, pose='sit', rot_z=math.pi, s=0.75, name=f'k{r}{k}')
            hearts(kd, n, bpm=(60, 52), size=1.1)
    # おかわりの列（配膳台から後ろへ）
    for i in range(8):
        y = 2.5 - i * 0.55
        kd = crowd_person((3.6, y, 0), rnd, rot_z=0.0, s=0.72, name=f'q{i}')
        tray = boxc((0, -0.32, 0.95), (0.4, 0.3, 0.03), hexc('#d8c8a8')); tray.parent = kd
        move(kd, [(1, (3.6, y, 0)), (int(n * 0.5), (3.6, y, 0)), (int(n * 0.5) + 24, (3.6, y + 0.55 if i else y, 0)), (n, (3.6, y + 0.55 if i else y, 0))])
        hearts(kd, n, bpm=(60, 52), size=1.1)
    cam = camera(28)
    cam_path(cam, [(0, (-1.6, -2.6, 2.0), (2.8, 1.4, 0.8)), (1, (-1.0, -2.8, 1.9), (3.2, 1.0, 0.8))], n)
    return MB(0.4, amb='room')


def hNotGreedy(n):  # 誰も大食いになったわけではない：二つ目の心臓の分を食べているだけ
    ps = meeting_room(seed=19)
    for p in ps:
        hearts(p, n, bpm=(50, 44))
        x, y = p.location.x, p.location.y
        rice_bowl((x, 0.8 + (0.32 if y > 0.8 else -0.32), 0.745), fill=0.5, s=1.1)
    cam = camera(35)
    cam_path(cam, [(0, (-2.6, -2.2, 1.9), (0, 0.8, 0.8)), (1, (-2.0, -1.8, 1.8), (0.2, 0.8, 0.8))], n)
    return MB(0.6, amb='room')


# ---------------- SCENE 07 ひざの上の、二つの音（章6） ----------------
def hLapCat(n):  # ひざの上で丸くなって眠る猫：背中に手を置くと、小さな鼓動が二つ
    living_room()
    you = person((-1.2, 1.95, 0), hexc('#c7d3e0'), pose='sit', rot_z=0, name='you')
    c = cat((-1.2, 1.66, 0.5), 'tora', s=0.62, rot_z=math.pi / 2, pose='crouch', name='lapcat')
    arm_to(you, 1, (0.02, -0.33, 0.66))
    hearts(c, n, bpm=(110, 96), size=2.2, up=0.9, out=2.2)
    hearts(you, n, bpm=(50, 44), size=1.0)
    cam = camera(45, dof=1.3, fstop=2.0)
    cam_path(cam, [(0, (-0.4, 0.6, 1.0), (-1.2, 1.66, 0.6)), (1, (-0.55, 0.75, 0.95), (-1.2, 1.66, 0.6))], n)
    return MB(0.7, amb='room', meows=[], bed=0.0)


def hDogMore(n):  # 犬は散歩の帰り道で、まだ歩きたがる
    street_env(corner=True)
    d = animal((0.3, 4.6, 0), 'shiba', s=1.45, pose='sit', rot_z=math.pi * 0.95, name='dog')
    hearts(d, n, bpm=(95, 84), size=1.4)
    you = person((-0.4, 3.0, 0), hexc('#c46a4a'), rot_z=math.pi * 0.85, name='owner')
    hearts(you, n, size=1.1)
    arm_to(you, 0, (0.15, -0.45, 0.85))
    rope((-0.2, 3.38, 0.85), (0.3, 4.48, 0.42))
    cam = camera(35)
    cam_path(cam, [(0, (2.0, 2.2, 1.1), (-0.1, 4.2, 0.6)), (1, (1.7, 2.6, 1.0), (0.0, 5.0, 0.6))], n)
    return MB(0.6, amb='day')


def hHamster(n):  # ハムスターは回し車を、いつもより長く回す
    sky(hexc('#e8dfcf')); s = bpy.context.scene; s.view_settings.exposure = 0.5
    box((0, 0, 0.35), (2.0, 1.2, 0.7), hexc('#c89a6a'))
    box((0, 0, 0.72), (0.9, 0.55, 0.04), hexc('#f0e6c8'))
    for x in (-0.45, 0.45):
        for y in (-0.27, 0.27):
            cyl((x, y, 0.95), 0.005, 0.5, hexc('#c0c4c8'))
    wheel = empty((0.1, 0.0, 0.92), 'wheel')
    bpy.ops.mesh.primitive_torus_add(location=(0, 0, 0), major_radius=0.16, minor_radius=0.006, rotation=(0, math.pi / 2, 0))
    t = bpy.context.object; setmat(t, hexc('#3a8ad0')); link(t, wheel)
    bpy.ops.mesh.primitive_torus_add(location=(0.05, 0, 0), major_radius=0.16, minor_radius=0.006, rotation=(0, math.pi / 2, 0))
    t2 = bpy.context.object; setmat(t2, hexc('#3a8ad0')); link(t2, wheel)
    for k in range(16):
        a = k * 2 * math.pi / 16
        link(cyl((0.025, 0.16 * math.cos(a), 0.16 * math.sin(a)), 0.003, 0.05, hexc('#3a8ad0'), rot=(0, math.pi / 2, 0)), wheel)
    cyl((0.1, 0.0, 0.84), 0.01, 0.2, hexc('#3a8ad0'))
    wheel.keyframe_insert('rotation_euler', frame=1)
    wheel.rotation_euler.x = -2 * math.pi * n / 18; wheel.keyframe_insert('rotation_euler', frame=n)
    linear(wheel)
    h = animal((0.125, 0.0, 0.775), 'hamster', pose='walk', rot_z=math.pi / 2, name='hamster')
    # その場で走る足どり（root を小さく前後させて animate_life に歩きと判定させる）
    for f in range(1, n + 1, 2):
        h.location.y = 0.004 * (1 if (f // 2) % 2 else -1); h.keyframe_insert('location', index=1, frame=f)
    h.rotation_euler.z = math.pi / 2
    hearts(h, n, bpm=(220, 200), size=2.4, up=0.4, out=0.9)
    cam = camera(55, dof=0.75, fstop=2.2)
    cam_path(cam, [(0, (0.75, -0.45, 1.05), (0.1, 0, 0.88)), (1, (0.68, -0.32, 1.02), (0.1, 0, 0.88))], n)
    return MB(0.6, amb='room')


def hGoldfish(n):  # 金魚は、水槽の中を、いつもより速く回る
    sky(hexc('#e8dfcf')); s = bpy.context.scene; s.view_settings.exposure = 0.5
    room(5, 4, 2.6, floor=hexc('#b48a63'), wall=hexc('#efe7da'))
    box((0, 0, 0.35), (1.6, 0.8, 0.7), hexc('#8c6a4c'))
    w = box((0, 0, 0.98), (0.9, 0.5, 0.52), (1, 1, 1)); w.data.materials.clear(); w.data.materials.append(gmat((0.55, 0.8, 0.95), 0.25, 'water'))
    box((0, 0, 0.74), (0.88, 0.48, 0.04), hexc('#d8c8a0'))
    for k in range(5):
        cone((-0.3 + k * 0.15, 0.12, 0.76), 0.012, 0.18 + 0.05 * (k % 2), hexc('#3a8a3a'), verts=4)
    for k in range(2):
        f = fish((0, 0, 1.0), s=1.6, name=f'gf{k}', c=hexc('#f07a2a') if k == 0 else hexc('#f2f2ea'))
        circle_path(f, n, (0, 0, 0.95 + k * 0.1), 0.26 - 0.05 * k, laps=4.0, phase=k * 2.5)
        wiggle(O[f['ftail']], n, idx=2, amp=0.5, period=6)
        hearts(O[f['fbody']], n, bpm=(90, 80), size=1.8, out=0.9, up=0.0)
    cam = camera(40, dof=1.6, fstop=2.4)
    cam_path(cam, [(0, (0.3, -1.7, 1.25), (0, 0, 0.95)), (1, (-0.2, -1.6, 1.2), (0, 0, 0.95))], n)
    return MB(0.6, amb='room')


def hParakeet(n):  # 鳥かごのインコは、朝から晩まで、止まり木を飛び移る
    sky(hexc('#e8dfcf')); s = bpy.context.scene; s.view_settings.exposure = 0.5
    room(5, 4, 2.6, floor=hexc('#b48a63'), wall=hexc('#efe7da'))
    box((0, 0, 0.35), (1.6, 0.8, 0.7), hexc('#a77d55'))
    box((0, 0, 0.72), (0.6, 0.5, 0.03), hexc('#e8e4dc'))
    for k in range(18):
        a = k * 2 * math.pi / 18
        cyl((0.28 * math.cos(a), 0.22 * math.sin(a), 1.02), 0.004, 0.6, hexc('#d8d8d0'))
    sphere((0, 0, 1.32), 0.29, hexc('#d8d8d0'), scale=(1, 0.8, 0.35), seg=18)
    for (x, z) in ((-0.15, 0.95), (0.15, 1.12)):
        cyl((x, 0, z), 0.01, 0.4, hexc('#a07040'), rot=(math.pi / 2, 0, 0))
    b = bird((-0.15, 0, 0.96), c=hexc('#6ac04a'), s=1.6, rot_z=-0.4, name='inko')
    link(sphere((0, -0.05, 0.12), 0.03, hexc('#f2e04a')), b)
    per = 40
    for f in range(1, n + per, per):
        left = (f // per) % 2 == 0
        a = (-0.15, 0, 0.96) if left else (0.15, 0, 1.13); c = (0.15, 0, 1.13) if left else (-0.15, 0, 0.96)
        b.location = a; b.keyframe_insert('location', frame=f); b.keyframe_insert('location', frame=f + 22)
        b.location = ((a[0] + c[0]) / 2, 0, max(a[2], c[2]) + 0.12); b.keyframe_insert('location', frame=f + 30)
        b.location = c; b.keyframe_insert('location', frame=f + per - 2)
        flap(b, f + 23, f + per - 2, period=2)
    hearts(birdbody(b), n, bpm=(200, 180), size=1.7, halo=True)
    cam = camera(40, dof=1.6, fstop=2.4)
    cam_path(cam, [(0, (0.25, -1.6, 1.2), (0, 0, 1.06)), (1, (-0.1, -1.5, 1.18), (0, 0, 1.06))], n)
    return MB(0.6, amb='room')


def hBowls3(n):  # どの子も、ごはんの器を早く空にして、こちらを見上げる
    living_room()
    c = cat((-0.45, 0.6, 0), 'tora', s=0.62, rot_z=0.15, name='c')
    d = animal((0.15, 0.7, 0), 'shiba', pose='sit', rot_z=0.0, name='dog')
    h = animal((0.75, 0.55, 0.02), 'hamster', pose='sit', s=0.45, rot_z=-0.15, name='ham')
    for (x, y, sc) in ((-0.45, 0.25, 1.0), (0.15, 0.3, 1.3), (0.75, 0.3, 0.6)):
        bowl((x, y, 0.03 * sc)).scale = (sc, sc, sc)
    for o in (c, d, h):
        neck = O[o['neck']]; neck.rotation_euler.x = -0.45
    hearts(c, n, bpm=(110, 96), size=1.8); hearts(d, n, bpm=(95, 84), size=1.2); hearts(h, n, bpm=(200, 180), size=2.0)
    cam = camera(40, dof=1.4, fstop=2.2)
    cam_path(cam, [(0, (0.15, -0.6, 1.25), (0.15, 0.6, 0.25)), (1, (0.15, -0.45, 1.2), (0.15, 0.6, 0.3))], n)
    return MB(0.6, amb='room')


def hFoodBag(n):  # ペットフードの袋が、いつもより早く、軽くなっていく
    sky(hexc('#e8dfcf')); s = bpy.context.scene; s.view_settings.exposure = 0.5
    room(4, 3, 2.6, floor=hexc('#b48a63'), wall=hexc('#efe7da'), window=False)
    box((0, 1.45, 0.9), (1.6, 0.1, 1.8), hexc('#c8a878'))
    for sx in (-0.8, 0.8):
        box((sx, 1.15, 0.9), (0.05, 0.6, 1.8), hexc('#b89868'))
    box((0, 1.15, 0.9), (1.6, 0.6, 0.04), hexc('#b89868'))
    bags = []
    for k, (x, c, t) in enumerate(((-0.4, hexc('#d04a3a'), 'ねこ'), (0.35, hexc('#3a7ad0'), 'いぬ'))):
        bg = boxc((x, 1.1, 0.25), (0.45, 0.25, 0.5), c)
        lab = text3d(t, (0, -0.13, 0.05), 0.1, (1, 1, 1)); lab.parent = bg
        bg.keyframe_insert('scale', frame=1)
        bg.scale = (1.0, 0.55, 0.3); bg.keyframe_insert('scale', frame=n)
        bg.keyframe_insert('location', frame=1)
        bg.location.z = 0.075; bg.keyframe_insert('location', frame=n)
    c = cat((0.9, 0.3, 0), 'tora', s=0.62, rot_z=0.5, name='c')
    hearts(c, n, bpm=(110, 96), size=1.8)
    cam = camera(35)
    cam_path(cam, [(0, (0.5, -1.6, 1.0), (0, 1.0, 0.35)), (1, (0.3, -1.3, 0.9), (0, 1.0, 0.3))], n)
    return MB(0.5, amb='room')


# ---------------- SCENE 08 タコが、泳ぎ続ける（章7） ----------------
def aquarium(n, kids=True, keeper=False, seed=20):
    sky(hexc('#0e1a2a')); s = bpy.context.scene; s.view_settings.exposure = 0.2
    light_dir((0.1, -0.3, 0.9)); s.display.shading.shadow_intensity = 0.3
    box((0, 0, -0.05), (30, 20, 0.1), hexc('#2a2e36'))
    # 大水槽（x=-5〜5、y=1〜4、高さ 0〜3）
    box((0, 2.5, 0.05), (10, 3, 0.1), hexc('#d8c8a0'))
    w = box((0, 2.5, 1.55), (10, 3, 3.0), (1, 1, 1)); w.data.materials.clear(); w.data.materials.append(gmat((0.25, 0.55, 0.8), 0.22, 'water'))
    box((0, 4.05, 1.5), (10.2, 0.1, 3.1), hexc('#1d4a6a'))
    rnd = random.Random(seed)
    for i in range(9):
        rock((rnd.uniform(-4.5, 4.5), rnd.uniform(2.6, 3.8), 0.2), r=rnd.uniform(0.3, 0.7), c=rnd.choice([hexc('#6a6a64'), hexc('#7a7468')]), seed=i)
    for i in range(6):
        coral((rnd.uniform(-4.5, 4.5), rnd.uniform(3.0, 3.8), 0.1), s=rnd.uniform(1.0, 1.6), seed=i)
    ps = []
    if kids:
        for i in range(5):
            k = crowd_person((-2.4 + i * 1.1, 0.5, 0), rnd, rot_z=math.pi, s=0.7, name=f'kid{i}')
            hearts(k, n, bpm=(65, 58), size=1.1)
            ps.append(k)
    if keeper:
        kp = person((3.4, 0.3, 0), hexc('#3a6a9a'), pants=hexc('#2a3a4a'), rot_z=math.pi * 0.85, name='keeper')
        b = boxc((0, -0.3, 0.55), (0.25, 0.25, 0.3), hexc('#d8d8d0')); b.parent = kp
        ps.append(kp)
    return ps


def hAquaKeeper(n):  # 夕方、水族館：飼育員が水槽の前で立ち止まる
    aquarium(n, kids=False, keeper=True)
    o = octopus((-1.0, 2.6, 1.4), s=1.6, name='octo', n=n, swim=True)
    o.keyframe_insert('location', frame=1); o.location.x = 1.5; o.keyframe_insert('location', frame=n)
    cam = camera(30)
    cam_path(cam, [(0, (5.5, -3.0, 1.8), (1.0, 2.5, 1.3)), (1, (5.0, -2.4, 1.7), (0.5, 2.5, 1.4))], n)
    return MB(0.3, amb='sea')


def hOctoSwim(n):  # タコが、泳いでいる
    aquarium(n, kids=False)
    o = octopus((-3.0, 2.6, 1.2), s=1.6, name='octo', n=n, swim=True)
    o.rotation_euler = (0, 0, -math.pi / 2)
    o.keyframe_insert('location', frame=1); o.location = (3.0, 2.8, 1.6); o.keyframe_insert('location', frame=n)
    cam = camera(35)
    cam_path(cam, [(0, (-1.5, -1.6, 1.5), (-2.0, 2.6, 1.3)), (1, (1.5, -1.6, 1.6), (2.4, 2.7, 1.5))], n)
    return MB(0.3, amb='sea')


def hOctoHearts(n):  # タコには、もともと心臓が三つ：体に送る心臓が、二つになる
    underwater()
    o = octopus((0, 0, 0.35), s=2.0, name='octo', n=n, swim=False)
    bob(o, n, amp=0.04, period=60)
    body = O[o['body']]
    # えらへ送る心臓（2つ）と、体へ送る心臓（1つ → 2つ）
    base = Vector((0, 0.05, 0.28))
    pulse(base + Vector((0.16, 0.05, -0.02)), n, bpm=50, r=0.03, parent=o, col_on=(0.4, 0.7, 1.0))
    pulse(base + Vector((-0.16, 0.05, -0.02)), n, bpm=50, r=0.03, offset=0.2, parent=o, col_on=(0.4, 0.7, 1.0))
    pulse(base + Vector((0.05, -0.2, 0.05)), n, bpm=45, r=0.04, parent=o)
    pulse(base + Vector((-0.05, -0.2, 0.05)), n, bpm=40, r=0.04, mode=('appear', int(n * 0.55)), offset=0.4, parent=o)
    ghost_parts(o, (0.95, 0.5, 0.42), 0.45)
    cam = camera(40)
    cam_path(cam, [(0, (0.0, -3.4, 1.5), (0, 0, 0.75)), (1, (0.5, -3.0, 1.4), (0, 0, 0.75))], n)
    return MB(0.7, amb='sea')


def hOctoLaps(n):  # 水槽の端から端まで泳ぎきり、向きを変えてまた泳ぐ。子どもたちがガラスに張りつく
    kids = aquarium(n, kids=True)
    o = octopus((-3.8, 2.5, 1.5), s=1.5, name='octo', n=n, swim=True)
    h = n // 2
    o.rotation_euler = (0, 0, -math.pi / 2); o.keyframe_insert('rotation_euler', frame=1); o.keyframe_insert('location', frame=1)
    o.location = (3.8, 2.7, 1.8); o.keyframe_insert('location', frame=h - 8); o.keyframe_insert('rotation_euler', frame=h - 14)
    o.rotation_euler = (0, 0, math.pi / 2); o.keyframe_insert('rotation_euler', frame=h + 4)
    o.location = (-3.8, 2.4, 1.3); o.keyframe_insert('location', frame=n)
    for i, k in enumerate(kids):
        arm_to(k, 1, (0.1, -0.42, 1.55))
    cam = camera(28)
    cam_path(cam, [(0, (-0.5, -3.0, 1.4), (0, 2.5, 1.3)), (1, (0.5, -2.7, 1.4), (0, 2.5, 1.4))], n)
    return MB(0.4, amb='sea')


def hOctoFly(n):  # 海の底を歩いていた生き物が、水の中を飛ぶように進む
    underwater()
    light_shafts(8)
    for i in range(5):
        coral((random.Random(i).uniform(-6, 6), random.Random(i + 9).uniform(2, 10), 0), s=1.6, seed=i)
    o = octopus((-6, 3, 2.0), s=2.0, name='octo', n=n, swim=True)
    o.rotation_euler = (0, 0, -math.pi / 2)
    o.keyframe_insert('location', frame=1); o.location = (6, 4, 3.0); o.keyframe_insert('location', frame=n)
    hearts_par = empty((0, 0, 0), 'hp'); hearts_par.parent = o
    pulse((0.05, 0.05, 0.25), n, bpm=45, r=0.035, parent=o)
    pulse((-0.05, 0.05, 0.25), n, bpm=40, r=0.035, offset=0.4, parent=o)
    cam = camera(32)
    cam_path(cam, [(0, (-7, -3.5, 2.2), (-5.5, 3, 2.0)), (1, (5, -3.0, 3.0), (6.2, 4, 3.0))], n)
    return MB(0.5, amb='sea')
