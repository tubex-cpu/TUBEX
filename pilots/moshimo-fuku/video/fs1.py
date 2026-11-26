"""カット：SCENE 01〜05（章0〜4）。人はいつも布・布団にくるまっている（fk.py の先頭の決まり）"""
from fk import *
from shots import env_town
from kit import _osc


def MB(amb='room', **kw):
    """音のメタ（audio.py が読む）。この動画は心臓の音も鳴き声も使わない"""
    m = M([], 0.0, amb=amb)
    m['beats'] = 0
    m.update(kw)
    return m


# ---------------- SCENE 01 午前3時のクローゼット（章0） ----------------
def night_bedroom(n, vanish_at=None, swing_from=1, sleeper=True, garments=('shirt', 'coat', 'shirt', 'coat')):
    setup('#1a2340', 0.05, (0.3, -0.5, 0.8), 0.3)
    wa_room(5.0, 4.6, 2.5, night=True, floor='#a89870', wall='#c8c4d0', window=False)
    hs = closet((0.2, 1.9, 0), n, w=2.2, garments=garments, vanish_at=vanish_at, swing_amp=0.0, seed=3)
    for i, hg in enumerate(hs):
        swing(hg, n, 0.0 if vanish_at is None else 0.16, seed=10 + i, f0=swing_from, decay=None)
    if sleeper:
        futon_sleeper((-1.3, -0.4, 0), rot_z=math.pi / 2, name='you', n=n)
    # 窓の月明かり（左の壁）
    box((-2.45, 0.2, 1.5), (0.04, 1.2, 1.1), hexc('#3a4a78'))
    return hs


def fCloset(n):  # 午前三時。クローゼットの中で、ハンガーが小さく揺れる。シャツもコートも、ない
    f = int(4.3 * FPS)
    night_bedroom(n, vanish_at=f, swing_from=f)
    cam = camera(30)
    cam_path(cam, [(0, (1.4, -2.0, 1.45), (0.2, 1.8, 1.2)), (0.45, (0.9, -1.0, 1.55), (0.2, 1.9, 1.55)),
                   (1, (0.6, -0.2, 1.65), (0.2, 1.9, 1.7))], n)
    return MB('night')


def fMannequins(n):  # 商店街の服屋で、マネキンが白いまま立っている
    setup('#101a30', 0.35, (0.2, -0.6, 0.6), 0.25)
    shops = shop_street(night=True, k=5, side=1, seed=4)
    rnd = random.Random(8)
    for i, (x, y) in enumerate(shops):
        for k in range(2 if i % 2 == 0 else 3):
            mannequin((x - 1.6 + k * 1.5 + rnd.uniform(-0.2, 0.2), y + rnd.uniform(-0.1, 0.2), 0.12), rot_z=rnd.uniform(-0.4, 0.4),
                      arm=rnd.choice([0.0, 0.0, -0.4]), name=f'mq{i}{k}')
    cam = camera(32)
    cam_path(cam, [(0, (-12.5, -2.2, 1.6), (-9.0, 5.2, 1.3)), (1, (-2.5, -2.4, 1.7), (1.0, 5.2, 1.3))], n)
    return MB('night')


def fBalcony(n):  # ベランダの物干しざおに、空のハンガーだけが揺れる
    setup('#16203a', 0.25, (0.3, -0.6, 0.7), 0.3)
    box((0, 1.0, 2.0), (6, 0.2, 6), hexc('#d8d2c4'))   # 部屋の外壁
    box((0.4, 0.89, 1.7), (2.6, 0.03, 2.0), hexc('#2a3450'))  # 掃き出し窓
    box((0, 0, 0.0), (6, 2.0, 0.12), hexc('#b0aca4'))   # 床
    box((0, -1.0, 0.55), (6, 0.08, 1.1), hexc('#c8c4bc'))  # 手すりの壁
    for sx in (-1, 1):
        box((sx * 2.2, 0.3, 2.2), (0.06, 0.06, 0.5), hexc('#9a9a96'))
    cyl((0, 0.3, 1.95), 0.025, 5.0, hexc('#c0c4c8'), rot=(0, math.pi / 2, 0))
    rnd = random.Random(5)
    for i in range(6):
        hg = hanger((-1.9 + i * 0.75, 0.3, 1.95), c=hexc(rnd.choice(['#e8a0a8', '#9ad0e0', '#f2d24b', '#f4f4f0', '#a8d890'])), name='hg')
        swing(hg, n, 0.22, seed=20 + i)
    ground(rgb=hexc('#262a33'))
    for i in range(5):
        tower((-30 + i * 14, 40, -6), 10, 8, rnd.uniform(16, 30), rnd.choice(WALLS), floors=8, lit=0.25)
    cam = camera(35)
    cam_path(cam, [(0, (1.2, -3.0, 1.9), (0.0, 0.3, 1.75)), (1, (-0.5, -2.7, 1.95), (-0.3, 0.3, 1.8))], n)
    return MB('night')


def fNightTown(n):  # この夜、世界中から、服が消えた
    env_town(night=True, nx=7, ny=7, seed=3)
    bpy.context.scene.view_settings.exposure = -1.0
    cam = camera(35)
    cam_path(cam, [(0, (-40, -60, 38), (0, 0, 0)), (1, (-20, -66, 34), (4, 2, 0))], n)
    return MB('night')


def fSleeper(n):  # 着ていた服も、靴も、一枚残らず。布団の中で眠る人（顔だけ見える）
    night_bedroom(n, sleeper=False, garments=(None, None, None, None))
    futon_sleeper((-0.3, -0.4, 0), rot_z=math.pi / 2, name='you', n=n)
    cam = camera(40, dof=1.6, fstop=2.4)
    cam_path(cam, [(0, (1.25, -1.15, 1.45), (0.44, -0.4, 0.3)), (1, (1.05, -0.95, 1.2), (0.44, -0.4, 0.3))], n)
    return MB('night')


# ---------------- SCENE 02 布団から出られない朝（章1） ----------------
def morning_room(n, closet_doors=None, garments=(None, None, None, None)):
    setup('#f2e6d0', 0.5, (0.4, -0.5, 0.75), 0.4)
    wa_room(5.0, 4.6, 2.5, floor='#cdbf94', wall='#efe6d6', window=False)
    box((-2.45, 0.2, 1.5), (0.04, 1.2, 1.1), hexc('#bcd3e6'))
    hs = closet((0.2, 1.9, 0), n, w=2.2, garments=garments, doors=closet_doors, seed=4)
    return hs


def fAlarm(n):  # 朝。目覚まし時計が鳴る
    morning_room(n, closet_doors=(1, 0.0))
    root, p = futon_sleeper((-1.0, -0.2, 0), rot_z=math.pi / 2, name='you', n=n, closed=True)
    f = int(n * 0.38)
    alarm_clock((0.15, -0.85, 0.0), n, ring=(f, n))
    # 目を開ける：閉じた目が消え、開いた目が出る
    for e in [o for o in bpy.data.objects if o.name.startswith('fkeye')]:
        vanish(e, f + 20)
    for e in add_eyes(p):
        e['closed'] = 1  # まばたきは付けない（短いカット）
        appear(e, f + 20)
    cam = camera(32)
    cam_path(cam, [(0, (1.4, -2.6, 1.4), (-0.4, -0.3, 0.25)), (1, (1.1, -2.2, 1.1), (-0.4, -0.35, 0.25))], n)
    return MB('morning')


def fFutonSit(n):  # 布団から出ようとして、止まる。布団を体に巻いたまま
    morning_room(n, closet_doors=(1, 0.0))
    box((-1.0, -0.2, 0.06), (1.0, 2.1, 0.12), hexc('#f2efe8'), bevel=0.03)
    p = wrapped_person((-1.0, -0.6, -0.3), style='futon', pose='sit', rot_z=-0.2, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'))
    h = O[p['head']]
    f = int(n * 0.35)
    h.keyframe_insert('rotation_euler', frame=f)
    h.rotation_euler = (0.35, 0, 0); h.keyframe_insert('rotation_euler', frame=f + 12)  # 自分の体を見下ろす
    h.keyframe_insert('rotation_euler', frame=f + 40)
    h.rotation_euler = (0, 0, 0.3); h.keyframe_insert('rotation_euler', frame=f + 56)
    cam = camera(35)
    cam_path(cam, [(0, (0.3, -3.0, 1.25), (-1.0, -0.5, 0.75)), (1, (0.1, -2.6, 1.15), (-1.0, -0.5, 0.75))], n)
    return MB('morning')


def fClosetOpen(n):  # 布団を巻いたまま、クローゼットを開ける。空っぽ
    f = int(n * 0.22)
    morning_room(n, closet_doors=(f, 1.0))
    p = wrapped_person((-0.9, 0.7, 0), style='futon', rot_z=math.pi * 0.85, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'))
    arm_to(p, 0, (0.1, -0.5, 1.2), f=f - 8)
    cam = camera(30)
    cam_path(cam, [(0, (1.9, -1.9, 1.6), (-0.2, 1.4, 1.2)), (1, (1.5, -1.3, 1.6), (0.0, 1.6, 1.3))], n)
    return MB('morning')


def fDrawers(n):  # 引き出しの中にも、一枚もない
    setup('#f2e6d0', 0.5, (0.4, -0.5, 0.75), 0.4)
    wa_room(5.0, 4.6, 2.5, floor='#cdbf94', wall='#efe6d6', window=False)
    drawers((0.0, 1.9, 0), n, f_open=int(n * 0.12), rows=4, w=1.0, d=0.5, h=1.1)
    cam = camera(32)
    cam_path(cam, [(0, (0.5, -0.5, 2.3), (-0.2, 1.6, 0.6)), (1, (0.35, -0.1, 2.25), (-0.2, 1.6, 0.55))], n)
    return MB('morning')


def fGenkan(n):  # 玄関にも、靴が一足もない
    setup('#d8d0c2', 0.5, (0.3, -0.4, 0.8), 0.4)
    box((0, 0, -0.05), (4, 5, 0.1), hexc('#b9a88e'))           # 上がりかまち
    box((0, -1.7, -0.25), (1.8, 1.2, 0.1), hexc('#8d8a84'))     # たたき（靴はない）
    box((0, -2.35, 1.0), (1.0, 0.08, 2.2), hexc('#5a4636'))
    box((0.38, -2.3, 0.95), (0.05, 0.06, 0.05), hexc('#c0b080'))
    box((-0.98, 0, 1.3), (0.1, 5.5, 2.8), hexc('#efe8dc')); box((0.98, 0, 1.3), (0.1, 5.5, 2.8), hexc('#efe8dc'))
    # 下駄箱（扉は開いて、中は空）
    box((0.68, -1.6, 0.45), (0.5, 1.0, 1.1), hexc('#a4825f'))
    for k in range(3):
        box((0.62, -1.6, 0.1 + k * 0.33), (0.36, 0.9, 0.02), hexc('#e8dcc4'))
    box((0.4, -1.6, 0.45), (0.02, 0.94, 1.06), hexc('#5a3a2a'))  # 中の影
    dr = boxc((0.42, -2.08, 0.45), (0.04, 0.48, 1.0), hexc('#b8946a')); dr.rotation_euler.z = -1.2
    cam = camera(26)
    cam_path(cam, [(0, (0.2, 1.6, 1.7), (0.0, -1.8, 0.1)), (1, (0.1, 1.2, 1.65), (0.0, -1.9, 0.0))], n)
    return MB('room')


# ---------------- SCENE 03 誰も出てこない駅（章2） ----------------
def fStation(n):  # 朝八時の駅前。いつもなら人でいっぱいの改札に、誰もいない
    setup('#b7d0e6', 0.4, (0.4, -0.5, 0.7), 0.45)
    ground(rgb=hexc('#c2bcb0'))
    station_building()
    for x in (-12, 12):
        tree((x, 2, 0), s=1.0)
    rnd = random.Random(9)
    for i in range(5):
        b = pigeon((rnd.uniform(-4, 4), rnd.uniform(-1, 1.5), 0), rot_z=rnd.uniform(-1, 1))
        peck(b, n, rnd)
    cam = camera(30)
    cam_path(cam, [(0, (-2.5, -9.5, 2.4), (0, 4, 1.6)), (1, (1.5, -8.0, 2.1), (0, 4, 1.4))], n)
    return MB('city')


def fTrainDoors(n):  # 電車のドアが開いても、誰も降りてこない
    train_car(n, moving=False, stand=0, sit=0, seed=2, doors_open=int(n * 0.18))
    cam = camera(26)
    cam_path(cam, [(0, (1.6, 1.0, 1.55), (4.5, -1.6, 1.15)), (1, (2.2, 0.8, 1.5), (4.5, -1.8, 1.1))], n)
    return MB('city')


def fCurtainsShut(n):  # 家の外で体を見せると、法律に触れる。窓のカーテンは閉じたまま
    setup('#a8c8e4', 0.4, (0.5, -0.5, 0.7), 0.45)
    ground(rgb=hexc('#b9b2a2'))
    box((0, 0, 0.01), (80, 6, 0.02), hexc('#8b8680'))
    street_houses(6, seed=7, y=7.0, curtains=True)
    street_houses(6, seed=8, y=-7.0 - 6, curtains=True)
    for x in (-20, -8, 6, 18):
        tree((x, 3.6, 0), s=0.8)
    cam = camera(28)
    cam_path(cam, [(0, (-14, -2.0, 1.7), (2, 6, 2.6)), (1, (4, -2.0, 1.7), (16, 6, 2.6))], n)
    return MB('day')


def fPeek(n):  # 窓のカーテンのすき間から、いくつもの目が外をのぞく
    setup('#a8c8e4', 0.45, (0.4, -0.6, 0.7), 0.4)
    xs, ppl, panels = facade(n, k=3, mode='peek', seed=3, people=3)
    rnd = random.Random(4)
    for i, p in enumerate(ppl):
        p.location.y = 0.34
        p.location.x = xs[i] + 0.35
        p.keyframe_insert('location', frame=1)
        f = int(n * 0.1) + i * 14
        p.keyframe_insert('location', frame=f)
        p.location.x = xs[i] + 0.03; p.keyframe_insert('location', frame=f + 24)
        h = O[p['head']]
        h.keyframe_insert('rotation_euler', frame=f + 30)
        h.rotation_euler = (0, 0.15, rnd.uniform(-0.4, 0.4)); h.keyframe_insert('rotation_euler', frame=f + 48)
    for i, pn in enumerate(panels):  # カーテンが少し揺れる
        pn.keyframe_insert('location', frame=1)
        pn.location.x += (0.03 if i % 2 else -0.03); pn.keyframe_insert('location', frame=int(n * 0.1) + (i // 2) * 14 + 20)
    cam = camera(40)
    cam_path(cam, [(0, (-1.2, -3.6, 1.7), (-0.6, 0.2, 1.65)), (1, (0.9, -3.5, 1.7), (0.6, 0.2, 1.65))], n)
    return MB('day')


def fTownShut(n):  # 日本中が、家の中に閉じこもった
    env_town(night=False, nx=7, ny=7, seed=5)
    cam = camera(35)
    cam_path(cam, [(0, (30, -60, 36), (0, 0, 0)), (1, (10, -64, 40), (-4, 4, 0))], n)
    return MB('day')


# ---------------- SCENE 04 真夏の部屋の温度（章3） ----------------
def thermometer(loc, n, level0=0.25, level1=0.2, s=1.0, warm=False):
    """壁の温度計（数字は描かない）。赤い液の高さが level0→level1"""
    root = empty(loc, 'thermo'); root.scale = (s, s, s)
    link(box((0, 0, 0), (0.16, 0.03, 0.6), hexc('#f4f2ec'), bevel=0.02), root)
    for k in range(9):
        link(box((0.04, -0.016, -0.22 + k * 0.055), (0.03 if k % 2 else 0.045, 0.004, 0.006), hexc('#555555')), root)
    link(cyl((-0.02, -0.016, 0.0), 0.01, 0.5, hexc('#e8eef2')), root)
    link(sphere((-0.02, -0.018, -0.26), 0.026, hexc('#d83a3a'), seg=12), root)
    liq = empty((-0.02, -0.024, -0.25), 'liq'); link(liq, root)
    link(cyl((0, 0, 0.25), 0.011, 0.5, hexc('#d83a3a')), liq)
    liq.scale = (1, 1, level0); liq.keyframe_insert('scale', frame=1)
    liq.scale = (1, 1, level1); liq.keyframe_insert('scale', frame=n)
    return root


def cold_room(n, ac=True, night=False):
    setup('#cfd8e4', 0.4, (0.3, -0.5, 0.8), 0.35)
    wa_room(5.0, 4.6, 2.5, floor='#cdbf94', wall='#e6e8ee', window=False)
    box((-2.45, 0.2, 1.5), (0.04, 1.2, 1.1), hexc('#c8d8e8'))
    if ac:
        aircon((0.4, 2.15, 2.15))
        airflow(n, (0.4, 1.95, 2.0), (0, -0.6, -0.8), k=12, length=1.8, spread=0.4)


def huddle(n, seed=30, k=4):
    """布団にくるまった家族が、肩を寄せ合う（エアコンの風の下）"""
    ppl = []
    specs = [(-0.75, 0.55, 1.0, SKIN[0]), (-0.25, 0.65, 1.0, SKIN[1]), (0.25, 0.7, 0.72, SKIN[0]), (0.7, 0.62, 0.78, SKIN[1])][:k]
    cls = [FUTON, ('quilt', '#c87a7a', '#f6e8e8', 3), ('quilt', '#e8b04a', '#fff4d8', 3), ('quilt', '#7aa86a', '#eef6e8', 3)]
    for i, (x, y, s_, sk) in enumerate(specs):
        p = wrapped_person((x, y, -0.42 * s_), cloth=cls[i], style='futon', pose='sit', rot_z=(x * 0.25), s=s_, name=f'fam{i}', n=n, skin=sk)
        ppl.append(p)
    return ppl


def fThermo(n):  # 部屋の空気が、冷たく感じる（温度計の針が低いところ）
    cold_room(n, ac=False)
    thermometer((-1.2, 2.18, 1.5), n, 0.3, 0.22)
    huddle(n)
    cam = camera(40)
    cam_path(cam, [(0, (-0.9, 1.25, 1.5), (-1.2, 2.2, 1.45)), (0.35, (-0.9, 1.25, 1.5), (-1.2, 2.2, 1.45)),
                   (1, (1.2, -2.0, 1.5), (0.0, 0.7, 0.85))], n)
    return MB('room')


def fSummer(n):  # 何も着ないで体が楽に過ごせる気温は、真夏の部屋ほどの暖かさ
    setup('#fff2d0', 0.65, (0.6, -0.4, 0.7), 0.5)
    wa_room(5.0, 4.6, 2.5, floor='#d8c49a', wall='#f6ecd8', window=True)
    box((0.6, 2.19, 1.4), (1.8, 0.02, 1.3), hexc('#fff4c0'))  # 夏の日ざし
    thermometer((-1.2, 2.18, 1.5), n, 0.75, 0.78, warm=True)
    # 扇風機
    fan = empty((1.4, 0.8, 0), 'fan')
    link(cyl((0, 0, 0.02), 0.2, 0.04, hexc('#f4f4f0'), verts=20), fan)
    link(cyl((0, 0, 0.45), 0.025, 0.9, hexc('#f4f4f0')), fan)
    hd = empty((0, 0, 0.95), 'fanhead'); link(hd, fan)
    link(sphere((0, 0.05, 0), 0.09, hexc('#f4f4f0'), seg=12), hd)
    ori = empty((0, -0.1, 0), 'fanori'); link(ori, hd); ori.rotation_euler = (math.pi / 2, 0, 0)
    bl = empty((0, 0, 0), 'blades'); link(bl, ori)
    link(cyl((0, 0, 0), 0.25, 0.01, hexc('#dfe8ec'), verts=24), bl).scale = (1, 1, 1)
    for k in range(3):
        a = k * 2 * math.pi / 3
        link(box((0.12 * math.cos(a), 0.12 * math.sin(a), 0.01), (0.2, 0.09, 0.01), hexc('#9ad0e0'), rot=(0, 0, a)), bl)
    for f in range(1, n + 2, 2):
        bl.rotation_euler.z = f * 0.9; bl.keyframe_insert('rotation_euler', index=2, frame=f)
    linear(bl, 'rotation_euler')
    hd.rotation_euler.z = 2.6
    _osc(hd, 'rotation_euler', 2, 2.6, 0.5, 120, n, random.Random(2))
    # 風鈴
    fu = empty((0.6, 2.0, 2.1), 'furin')
    link(sphere((0, 0, 0), 0.06, hexc('#bfe4f0'), scale=(1, 1, 0.9), seg=12), fu)
    link(cyl((0, 0, -0.12), 0.003, 0.18, hexc('#888888')), fu)
    link(box((0, 0, -0.26), (0.06, 0.005, 0.12), hexc('#f4f0e0')), fu)
    wiggle(fu, n, idx=0, amp=0.18, period=40)
    cam = camera(32)
    cam_path(cam, [(0, (-0.8, -2.0, 1.3), (0.3, 1.6, 1.2)), (1, (-0.4, -1.6, 1.35), (0.4, 1.7, 1.25))], n)
    return MB('day')


def fTokyoCold(n):  # 十一月の東京の朝は、それよりずっと寒い
    setup('#c4d4e6', 0.35, (0.7, -0.3, 0.35), 0.5)
    ground(rgb=hexc('#a8aaa8'))
    rnd = random.Random(11)
    for i in range(8):
        for j in range(4):
            tower((-60 + i * 16, 20 + j * 18, 0), 12, 12, rnd.uniform(18, 60), rnd.choice(WALLS + [hexc('#b9c3cc')]), floors=10)
    box((0, 0, 0.01), (200, 10, 0.02), hexc('#8b8680'))
    for x in range(-40, 44, 8):
        t = empty((x, 6, 0), 'bare')
        link(cyl((0, 0, 1.6), 0.1, 3.2, hexc('#5a4636')), t)
        for k in range(4):
            bar((0, 0, 2.4 + k * 0.4), (rnd.uniform(-1, 1), rnd.uniform(-0.6, 0.6), 3.4 + k * 0.4), 0.04, hexc('#5a4636'), parent=t)
    # 落ち葉が舞う
    for i in range(30):
        lf = box((rnd.uniform(-30, 30), rnd.uniform(0, 8), rnd.uniform(1, 6)), (0.15, 0.1, 0.01), rnd.choice([hexc('#d0802a'), hexc('#c0502a'), hexc('#e0b040')]))
        lf.keyframe_insert('location', frame=1)
        lf.location.x += rnd.uniform(6, 12); lf.location.z = 0.05; lf.keyframe_insert('location', frame=n)
        lf.keyframe_insert('rotation_euler', frame=1); lf.rotation_euler = (rnd.uniform(3, 9), rnd.uniform(3, 9), 0); lf.keyframe_insert('rotation_euler', frame=n)
    cam = camera(30)
    cam_path(cam, [(0, (-20, -26, 6), (0, 20, 14)), (1, (-6, -28, 5), (10, 20, 14))], n)
    return MB('wind')


def fWarmAir(n):  # 服は、体のまわりに、暖かい空気をためていた（服だけの模式）
    setup('#2a3248', 0.35, (0.3, -0.5, 0.8), 0.2)
    s = bpy.context.scene; s.display.shading.show_shadows = False
    hg = hanger((0, 0, 2.2), name='hg')
    g = garment('shirt', hg, cloth=('plain', '#cfe0ee', '#cfe0ee', 1))
    swing(hg, n, 0.05, seed=4)
    rnd = random.Random(5)
    for i in range(36):
        b = ball((0, 0, 0), rnd.uniform(0.025, 0.04), (1.0, 0.62, 0.3), a=0.85, seg=8, name='warm')
        circle_path(b, n, (0, 0.0, 1.45 + rnd.uniform(-0.25, 0.25)), rnd.uniform(0.32, 0.42), laps=rnd.uniform(0.8, 1.4) * rnd.choice([-1, 1]),
                    phase=rnd.uniform(0, 6.28), face=False)
    for i in range(14):  # 外側は冷たい空気（青い粒がゆっくり流れる）
        b = ball((rnd.uniform(-2, 2), 1.0, rnd.uniform(0.5, 2.6)), 0.03, (0.6, 0.8, 1.0), a=0.6, seg=8, name='cold')
        b.keyframe_insert('location', frame=1); b.location.x += rnd.uniform(-1, 1); b.location.z -= 0.4; b.keyframe_insert('location', frame=n)
    cam = camera(35)
    cam_path(cam, [(0, (0.4, -3.4, 1.6), (0, 0, 1.55)), (1, (-0.4, -3.0, 1.55), (0, 0, 1.55))], n)
    return MB('silent')


def fHuddle(n):  # 家族が、布団にくるまって、肩を寄せ合う（エアコンの風・白い息）
    cold_room(n, ac=True)
    ppl = huddle(n)
    breath_puffs(n, [mouth_of(p) for p in ppl], every=52, seed=3)
    cam = camera(30)
    cam_path(cam, [(0, (0.4, -2.6, 1.2), (0.0, 0.7, 0.8)), (1, (-0.2, -2.2, 1.15), (0.0, 0.7, 0.8))], n)
    return MB('room')


def bathroom(n):
    setup('#d8e0e4', 0.45, (0.3, -0.5, 0.8), 0.35)
    box((0, 0, -0.05), (3.0, 3.0, 0.1), hexc('#c8d0d4'))
    for (x, y, sx, sy) in ((0, 1.5, 3.0, 0.1), (-1.5, 0, 0.1, 3.0), (1.5, 0, 0.1, 3.0)):
        box((x, y, 1.2), (sx, sy, 2.4), hexc('#e8eef0'))
    for k in range(10):
        box((-1.45, -1.4 + k * 0.3, 1.2), (0.01, 0.01, 2.4), hexc('#c8d0d4'))
    box((0.6, 0.9, 0.3), (1.5, 0.9, 0.6), hexc('#f4f4f2'), bevel=0.05)   # 湯船
    box((0.6, 0.9, 0.56), (1.3, 0.7, 0.04), hexc('#9ad0e0'))
    for i in range(6):  # 湯気
        breath_puffs(n, [((0.2 + i * 0.16, 0.9, 0.62), (0, 0, 1))], every=40, seed=40 + i, size=0.12)


def fBathTowel(n):  # 濡れた体は、もっと早く冷える（バスタオルにくるまって震える）
    bathroom(n)
    p = wrapped_person((-0.5, -0.2, 0), style='towel', name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'))
    c = empty(tuple(p.location), 'carry'); p.location = (0, 0, 0); p.parent = c
    for f in range(1, n, 2):
        c.location.x = -0.5 + (0.012 if (f // 2) % 2 else -0.012); c.keyframe_insert('location', index=0, frame=f)
    breath_puffs(n, [mouth_of(p)], every=40, seed=7)
    rnd = random.Random(3)
    for i in range(8):  # しずく
        d = sphere((-0.5 + rnd.uniform(-0.15, 0.15), -0.2 + rnd.uniform(-0.2, 0.0), 1.6), 0.015, hexc('#9ad0e0'), seg=8)
        f0 = rnd.randint(1, max(2, n - 30))
        d.keyframe_insert('location', frame=f0); d.location.z = 0.02; d.keyframe_insert('location', frame=f0 + 18)
        appear(d, f0)
    cam = camera(35)
    cam_path(cam, [(0, (0.6, -2.4, 1.6), (-0.5, -0.2, 1.3)), (1, (0.3, -2.0, 1.55), (-0.5, -0.2, 1.35))], n)
    return MB('room')


def fBathNight(n):  # この日、日本中で、お風呂上がりが一番こわい時間に
    setup('#0e1a33', -0.1, (0.2, -0.6, 0.5), 0.25)
    street_houses(7, seed=12, y=6.0, night=True, curtains=True, x0=-22)
    rnd = random.Random(12)
    mouths = []
    for i in range(7):
        x = -22 + i * 7.5 + 2.2
        box((x, 2.97, 2.6), (0.7, 0.05, 0.5), hexc('#f6e8c0'))  # 小さなお風呂の窓
        mouths.append(((x, 2.8, 2.9), (0, -0.2, 1)))
    breath_puffs(n, mouths, every=34, seed=8, size=0.18)
    ground(rgb=hexc('#262a33'))
    cam = camera(30)
    cam_path(cam, [(0, (-12, -12, 3.5), (0, 6, 2.6)), (1, (2, -12, 3.2), (12, 6, 2.6))], n)
    return MB('night')


# ---------------- SCENE 05 カーテンが、服になる（章4） ----------------
def living(n, curtains=('stripe', '#5b8fb9', '#eef3f7', 4)):
    setup('#f2ead8', 0.5, (0.4, -0.5, 0.75), 0.4)
    room(6, 5, 2.6, floor=hexc('#b48a63'), wall=hexc('#efe8dc'), window=False)
    box((0.6, 2.44, 1.45), (2.2, 0.04, 1.6), hexc('#bcd3e6'))
    box((0.6, 2.38, 2.3), (2.6, 0.06, 0.05), hexc('#c8c4bc'))   # カーテンレール
    table((-1.6, 0.6, 0), w=1.2, d=0.8)


def fCurtainsOff(n):  # 家じゅうのカーテンが、外されていく
    living(n)
    cm = cloth_mat('stripe', '#5b8fb9', '#eef3f7', 4)
    panels = []
    for k, sx in enumerate((-1, 1)):
        pnl = setcloth(boxc((0.6 + sx * 0.6, 2.3, 1.45), (1.2, 0.04, 1.75), (1, 1, 1)), cm)
        # カーテンがレールから外れて、下へ落ちて消える
        f = int(n * (0.3 + 0.3 * k))
        pnl.keyframe_insert('location', frame=f); pnl.keyframe_insert('rotation_euler', frame=f)
        pnl.location.z = 0.5; pnl.location.y = 1.9; pnl.keyframe_insert('location', frame=f + 14)
        pnl.rotation_euler.x = -0.6; pnl.keyframe_insert('rotation_euler', frame=f + 14)
        vanish(pnl, f + 16)
        panels.append(pnl)
    stool = box((0.6, 1.6, 0.22), (0.5, 0.4, 0.44), hexc('#a77d55'))
    p = wrapped_person((0.6, 1.6, 0.44), cloth=SHEET, rot_z=math.pi, name='mom', n=n)
    arm_to(p, 0, (-0.2, -0.45, 2.0)); arm_to(p, 0, (0.2, -0.45, 2.0))
    cam = camera(30)
    cam_path(cam, [(0, (-1.0, -2.0, 1.5), (0.6, 2.0, 1.6)), (1, (-0.6, -1.6, 1.45), (0.6, 2.0, 1.6))], n)
    return MB('room')


def fThreeCloths(n):  # シーツも、バスタオルも、テーブルクロスも
    living(n)
    specs = [(SHEET, 'wrap'), (TOWEL, 'towel'), (('check', '#d95f5f', '#f6efe6', 4), 'wrap')]
    for i, (cl, st) in enumerate(specs):
        p = wrapped_person((-1.2 + i * 1.2, 0.4, 0), cloth=cl, style=st, rot_z=random.Random(i).uniform(-0.3, 0.3), name=f'p{i}', n=n)
        appear(p, 1 + int(n * 0.28 * i))
    cam = camera(32)
    cam_path(cam, [(0, (-0.6, -3.2, 1.5), (-0.4, 0.4, 1.1)), (1, (0.4, -3.0, 1.5), (0.2, 0.4, 1.1))], n)
    return MB('room')


def fPins(n):  # 体に巻いて、洗濯ばさみで留める
    living(n)
    p = wrapped_person((0.0, 0.4, 0), cloth=('flower', '#7aa86a', '#f4efe2', 3), name='you', n=n, pin='', skin=SKIN[0])
    rig = O[p['rig']]
    for k, (x, z) in enumerate(((0.13, 1.22), (0.04, 1.02), (-0.05, 0.82))):
        pn = link(box((x, -0.245 + 0.01 * k, z), (0.04, 0.035, 0.1), hexc(['#f2a0b0', '#8ad0e0', '#f2d24b'][k])), rig)
        appear(pn, int(n * 0.2) + k * int(n * 0.2))
    arm_to(p, 1, (0.08, -0.3, 1.15), f=int(n * 0.15))
    h = O[p['head']]; h.rotation_euler = (0.35, 0, 0)
    cam = camera(45)
    cam_path(cam, [(0, (0.5, -1.9, 1.45), (0.0, 0.4, 1.15)), (1, (0.3, -1.6, 1.4), (0.0, 0.4, 1.15))], n)
    return MB('room')


def fBareWindows(n):  # カーテンを外した家の窓は、外から丸見え（中の人は布を巻いている）
    setup('#a8c8e4', 0.45, (0.4, -0.6, 0.7), 0.4)
    facade(n, k=3, mode='bare', seed=6, people=4, walk=True)
    for k, x0 in enumerate((-9.0, 9.0)):
        street_houses(1, seed=20 + k, y=3.0, x0=x0, curtains=False, bare=True)
    cam = camera(30)
    cam_path(cam, [(0, (-3.0, -5.2, 1.8), (-0.5, 1.0, 1.6)), (1, (2.4, -5.4, 1.8), (0.5, 1.0, 1.6))], n)
    return MB('day')


def fTwoCloths(n):  # 窓を隠す布と、体を隠す布
    setup('#a8c8e4', 0.45, (0.4, -0.6, 0.7), 0.4)
    cl = ('dots', '#e8b04a', '#fff6e0', 4)
    xs, ppl, panels = facade(n, k=1, mode='half', seed=0, cloths=[cl], people=0)
    p = wrapped_person((0.35, 0.6, 0), cloth=cl, rot_z=-0.4, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'))
    h = O[p['head']]
    f = int(n * 0.35)
    h.keyframe_insert('rotation_euler', frame=f)
    h.rotation_euler = (0.1, 0, 0.6); h.keyframe_insert('rotation_euler', frame=f + 14)  # 残ったカーテンを見る
    h.keyframe_insert('rotation_euler', frame=f + 40)
    h.rotation_euler = (0.3, 0, 0); h.keyframe_insert('rotation_euler', frame=f + 54)   # 自分の体の布を見る
    cam = camera(38)
    cam_path(cam, [(0, (0.6, -4.2, 1.7), (0.0, 0.3, 1.6)), (1, (0.1, -3.6, 1.7), (0.0, 0.3, 1.6))], n)
    return MB('day')


def fTug(n):  # 日本中で、布の取り合いが始まった
    setup('#a8c8e4', 0.45, (0.4, -0.6, 0.7), 0.45)
    ground(rgb=hexc('#b9b2a2'))
    box((0, 0, 0.01), (60, 5, 0.02), hexc('#8b8680'))
    street_houses(5, seed=31, y=6.5, curtains=False, bare=True, x0=-15)
    a = wrapped_person((-0.85, 0, 0), cloth=('stripe', '#c88a4a', '#f6ead8', 3), rot_z=-math.pi / 2, name='a', n=n)
    b = wrapped_person((0.85, 0, 0), cloth=('check', '#4a7a9a', '#e8eef2', 3), rot_z=math.pi / 2, name='b', n=n)
    for p in (a, b):
        arm_to(p, 0, (-0.05, -0.55, 1.05)); arm_to(p, 0, (0.05, -0.55, 1.05))
    sheet = setcloth(boxc((0, 0, 1.05), (1.0, 0.5, 0.02), (1, 1, 1)), cloth_mat(*SHEET))
    car_ = empty((0, 0, 0), 'tug')
    for o in (a, b, sheet):
        o.parent = car_
    for f in range(1, n + 20, 18):
        car_.location.x = 0.18 if (f // 18) % 2 else -0.18; car_.keyframe_insert('location', index=0, frame=f)
    sheet.keyframe_insert('rotation_euler', frame=1)
    _osc(sheet, 'rotation_euler', 1, 0, 0.12, 16, n, random.Random(4))
    cam = camera(32)
    cam_path(cam, [(0, (0.8, -4.4, 1.6), (0.0, 0.0, 1.1)), (1, (-0.6, -4.0, 1.5), (0.0, 0.0, 1.1))], n)
    return MB('day')
