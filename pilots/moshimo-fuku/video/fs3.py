"""カット：SCENE 11〜14（章10〜13）とエンドカード（章14）。人はいつも布・タオルのガウン・縫った服で体が隠れている"""
from fs2 import *
from kit import _osc

GOWN_C = TOWELS_C


# ---------------- SCENE 11 タオルの町が、服を縫う（章10） ----------------
def factory_floor(w=22, d=14, h=5.0, c='#e8e6e0'):
    setup('#e6e4de', 0.5, (0.3, -0.3, 0.9), 0.3)
    box((0, 0, -0.05), (w, d, 0.1), hexc('#b8b4aa'))
    box((0, d / 2, h / 2), (w, 0.2, h), hexc(c)); box((-w / 2, 0, h / 2), (0.2, d, h), hexc(c))
    for k in range(-int(w / 2) + 2, int(w / 2), 4):
        box((k, 0, h - 0.1), (0.3, d, 0.2), hexc('#c8c4bc'))
        box((k, d / 2 - 0.12, h * 0.65), (2.4, 0.04, 1.2), hexc('#dfe8ec'))


def loom(loc, n, cloth=TOWELS_C[0], seed=1):
    """タオルの織機：枠・縦糸・前後に動く筬（おさ）・巻き取られていくタオル地"""
    root = empty(loc, 'loom')
    G = hexc('#5a7a6a')
    for sx in (-1, 1):
        link(box((sx * 0.95, 0, 0.8), (0.12, 1.6, 1.6), G), root)
    link(box((0, 0.7, 1.55), (2.0, 0.2, 0.15), G), root)
    link(box((0, -0.7, 0.55), (2.0, 0.2, 0.15), G), root)
    warp = link(box((0, 0.35, 1.05), (1.7, 0.7, 0.01), hexc('#f4f2ec'), rot=(0.45, 0, 0)), root)  # 縦糸の面
    for k in range(18):
        link(box((-0.82 + k * 0.096, 0.35, 1.06), (0.006, 0.72, 0.006), hexc('#d8d4cc'), rot=(0.45, 0, 0)), root)
    reed = boxc((0, 0.0, 0.95), (1.8, 0.06, 0.22), hexc('#8a8a86')); reed.parent = root
    rnd = random.Random(seed)
    per = rnd.randint(9, 12)
    for f in range(1, n + per, per):
        reed.location.y = 0.0; reed.keyframe_insert('location', index=1, frame=f)
        reed.location.y = -0.18; reed.keyframe_insert('location', index=1, frame=f + per // 2)
    sh = boxc((-0.85, 0.05, 0.98), (0.2, 0.05, 0.05), hexc('#c8a040')); sh.parent = root   # 横糸を通す杼
    for f in range(1, n + per * 2, per * 2):
        sh.location.x = -0.85; sh.keyframe_insert('location', index=0, frame=f)
        sh.location.x = 0.85; sh.keyframe_insert('location', index=0, frame=f + per)
    linear(sh, 'location')
    # 織り上がったタオル地：手前へ流れて、巻き取りの棒に巻かれる
    tm = cloth_mat(*cloth)
    sheet = setcloth(boxc((0, -0.3, 0.82), (1.7, 0.7, 0.012), (1, 1, 1)), tm); sheet.parent = root
    sheet.rotation_euler.x = -0.3
    roll = setcloth(cyl((0, -0.72, 0.38), 0.18, 1.7, (1, 1, 1), rot=(0, math.pi / 2, 0), verts=20), tm); link(roll, root)
    roll.scale = (1, 1, 1); roll.keyframe_insert('scale', frame=1)
    roll.scale = (1.35, 1.35, 1); roll.keyframe_insert('scale', frame=n)
    _osc(roll, 'rotation_euler', 0, 0, 0.0, 30, n, rnd)
    for f in range(1, n + 2, 6):
        roll.rotation_euler.x = -f * 0.05; roll.keyframe_insert('rotation_euler', index=0, frame=f)
    linear(roll, 'rotation_euler')
    return root


def fLooms(n):  # 愛媛県の今治で、織機が、休みなく動いている
    factory_floor()
    for i in range(4):
        for j in range(2):
            loom((-6 + i * 3.2, -1.5 + j * 3.4, 0), n, cloth=GOWN_C[(i + j) % 5], seed=i * 3 + j)
    p = wrapped_person((-2.9, -3.2, 0), style='towel', rot_z=-0.5, name='w1', n=n, seed=101)
    p2 = wrapped_person((3.6, 0.6, 0), style='towel', cloth=GOWN_C[1], rot_z=0.8, name='w2', n=n, seed=102)
    cam = camera(30)
    cam_path(cam, [(0, (-8.5, -7.5, 2.4), (-2, 0, 0.9)), (1, (-4.5, -7.8, 2.2), (2, 0, 0.9))], n)
    return MB('room')


def sawtooth(loc, w=12, d=10, k=4, c='#d8d4cc', roofc='#8a9aa8'):
    root = empty(loc, 'fact')
    link(box((0, 0, 2.2), (w, d, 4.4), hexc(c)), root)
    for i in range(k):
        x = -w / 2 + (i + 0.5) * w / k
        r = link(roof((x, 0, 4.4), w / k, d, 1.6, hexc(roofc)), root)
    link(cyl((w / 2 - 1.0, d / 2 - 1.0, 6.5), 0.4, 13, hexc('#c8c4bc')), root)
    return root


def fImabari(n):  # 日本で作られるタオルの半分以上を、この町で織ってきた
    setup('#a9cbe4', 0.45, (0.6, -0.3, 0.6), 0.45)
    sea('#4a7aa6')
    box((0, 30, 0.02), (300, 60, 0.4), hexc('#a8b48a'))
    rnd = random.Random(21)
    for i in range(7):
        for j in range(3):
            sawtooth((-48 + i * 15 + rnd.uniform(-2, 2), 10 + j * 14, 0), w=rnd.uniform(9, 13), d=rnd.uniform(7, 10), k=rnd.randint(3, 5))
    for i in range(30):
        house((rnd.uniform(-70, 70), rnd.uniform(52, 70), 0), w=6, d=6, h=5)
    for i in range(6):
        mountain((-90 + i * 36, 110, 0), rnd.uniform(25, 40), rnd.uniform(18, 30), c=hexc('#7a9a5a'))
    for i in range(8):  # 煙突の湯気
        breath_puffs(n, [((-48 + i * 15 + 5, 14.5, 13), (0.3, 0, 1))], every=30, seed=i, size=1.2)
    cam = camera(30)
    cam_path(cam, [(0, (-20, -62, 26), (0, 20, 2)), (1, (6, -60, 24), (10, 22, 2))], n)
    return MB('wind')


def fTowelStacks(n):  # タオルは、消えていない
    factory_floor(c='#ece8e0')
    rnd = random.Random(22)
    for r in range(2):
        for k in range(6):
            x = -5 + k * 2.0; y = 3.5 - r * 2.2
            box((x, y, 0.06), (1.6, 1.0, 0.12), hexc('#b89a70'))
            for l in range(rnd.randint(8, 14)):
                cl = GOWN_C[(k + r + l // 3) % 5]
                setcloth(box((x + rnd.uniform(-0.03, 0.03), y, 0.16 + l * 0.11), (1.4, 0.8, 0.1), (1, 1, 1), bevel=0.03), cloth_mat(*cl))
    p = wrapped_person((-0.9, 1.0, 0), style='towel', cloth=GOWN_C[3], rot_z=math.pi * 0.85, name='w1', n=n, seed=103)
    arm_to(p, 1, (0.15, -0.5, 1.1), f=int(n * 0.4))
    cam = camera(30)
    cam_path(cam, [(0, (-3.5, -4.0, 2.2), (-0.5, 2.6, 0.8)), (1, (-1.8, -4.2, 2.0), (0.5, 2.6, 0.8))], n)
    return MB('room')


def sew_station(loc, n, cloth, worker_cloth=None, style='towel', seed=1, rot_z=0.0, fabric_kind=None):
    """作業台・ミシン・縫う人（台の向こうに座る）"""
    root = empty(loc, 'station'); root.rotation_euler = (0, 0, rot_z)
    t = table((0, 0, 0), w=1.3, d=0.75, c=hexc('#c8b08a')); t.parent = root
    m_, nd = sewing_machine((0.2, 0.05, 0.75), n=n, run=(1, None), c='#f2f0ea' if fabric_kind != 'black' else '#d8dcdc')
    m_.parent = root
    fab = setcloth(boxc((-0.15, -0.05, 0.76), (0.6, 0.5, 0.012), (1, 1, 1)), cloth_mat(*cloth)); fab.parent = root
    fabric_slide(fab, n, axis=0, dist=0.12, period=60)
    chair = box((0, 0.65, 0.22), (0.45, 0.45, 0.44), hexc('#6a6a70')); chair.parent = root
    wp = wrapped_person((0, 0.68, 0.0), cloth=worker_cloth, style=style, pose='sit', rot_z=0, name=f'sw{seed}', n=n, seed=seed)
    wp.parent = root
    arm_to(wp, 0, (-0.15, -0.45, 0.82)); arm_to(wp, 0, (0.15, -0.45, 0.82))
    h = O[wp['head']]; h.rotation_euler = (0.35, 0, 0)
    return root, wp


def fSewGown(n):  # 織り上がったタオル地を、袖のついたガウンの形に、縫っていく
    factory_floor()
    for i in range(3):
        for j in range(2):
            sew_station((-3 + i * 2.2, -0.5 + j * 2.0, 0), n, GOWN_C[(i + j) % 5], worker_cloth=GOWN_C[(i + j + 2) % 5], seed=200 + i * 2 + j, rot_z=math.pi)
    # 縫い上がったガウンが、ラックに一枚ずつ掛かっていく
    cyl((4.4, 0.5, 1.9), 0.025, 4.0, hexc('#b8bcc0'), rot=(math.pi / 2, 0, 0))
    for yy in (-1.5, 2.5):
        cyl((4.4, yy, 0.95), 0.025, 1.9, hexc('#b8bcc0'))
    for k in range(8):
        hg = hanger((4.4, -1.2 + k * 0.5, 1.9), rot_z=math.pi / 2, name='hg')
        garment('gown', hg, cloth=GOWN_C[k % 5])
        appear(hg, int(n * 0.15) + k * int(n * 0.09))
        swing(hg, n, 0.06, seed=k, f0=int(n * 0.15) + k * int(n * 0.09), decay=int(n * 0.15) + k * int(n * 0.09) + 50)
    cam = camera(30)
    cam_path(cam, [(0, (-1.5, -5.0, 2.6), (0.5, 0.5, 0.9)), (1, (0.5, -5.2, 2.4), (2.2, 0.5, 1.0))], n)
    return MB('room')


def cardboard(loc, s=0.5):
    o = boxc(loc, (s, s * 0.8, s * 0.6), hexc('#c8a878'))
    link(box((0, 0, s * 0.3), (s * 1.0, 0.06, 0.005), hexc('#d8c8a0')), o)
    return o


def fGownTruck(n):  # タオルの町が、日本で最初の、服の工場になった（箱に詰めてトラックで運ぶ）
    setup('#a9cbe4', 0.45, (0.6, -0.3, 0.6), 0.45)
    ground(rgb=hexc('#b8b4aa'))
    sawtooth((0, 10, 0), w=16, d=10, k=5)
    box((-3, 4.98, 1.6), (4, 0.06, 3.2), hexc('#5a6470'))
    tr = truck((4.0, 1.0, 0), rot_z=math.pi / 2)
    f_go = int(n * 0.62)
    tr.keyframe_insert('location', frame=f_go); tr.location.x = 26; tr.keyframe_insert('location', frame=n)
    # 箱を運ぶ人（タオルのガウン）と、荷台へ積まれる箱
    rnd = random.Random(23)
    for i in range(3):
        p = wrapped_person((-2.0 + i * 1.1, 2.6 - i * 0.4, 0), style='gown', rot_z=-math.pi / 2, name=f'g{i}', n=n, seed=230 + i)
        arm_to(p, 0, (-0.12, -0.38, 1.1)); arm_to(p, 0, (0.12, -0.38, 1.1))
        bx = cardboard((0, -0.45, 1.15), 0.42); bx.parent = O[p['rig']]
        p.keyframe_insert('location', frame=1)
        p.location.x += 2.2; p.keyframe_insert('location', frame=int(n * 0.5))
        vanish(bx, int(n * 0.5) - 2 + i * 3)
    for i in range(6):
        o = cardboard((0, 0, 0), 0.6)
        o.parent = tr; o.location = (-0.5 + (i % 2) * 0.6 if False else 0, 0.2 + (i % 3) * 0.7, 1.0 + (i // 3) * 0.5)
        o.location = ((i % 2) * 0.62 - 0.31, 0.6 + (i // 2) * 0.5, 0.72)
    cam = camera(30)
    cam_path(cam, [(0, (-6, -8, 2.6), (2, 2, 1.0)), (1, (-2, -9, 2.4), (6, 1.5, 1.0))], n)
    return MB('city')


# ---------------- SCENE 12 学生服の町（章11） ----------------
BLACK = ('plain', '#1c1e24', '#1c1e24', 1)


def fKojimaLine(n):  # 岡山県の児島では、学生服を縫っている（黒い布、並んだミシン）
    factory_floor(c='#ece8e0')
    for i in range(4):
        for j in range(2):
            sew_station((-4.5 + i * 2.2, -1.2 + j * 2.4, 0), n, BLACK, worker_cloth=GOWN_C[(i * 2 + j) % 5], style='gown',
                        seed=300 + i * 2 + j, rot_z=math.pi, fabric_kind='black')
    cam = camera(28)
    cam_path(cam, [(0, (-7.5, -5.5, 2.4), (-2, 0, 0.9)), (1, (-4.0, -6.0, 2.2), (1.5, 0.2, 0.9))], n)
    return MB('room')


def fGakuranRack(n):  # 日本で作られる学生服の七割が、この町で縫われてきた（縫い上がった学生服がハンガーに並ぶ）
    factory_floor(c='#ece8e0')
    for r in range(3):
        y = -1.0 + r * 1.6
        cyl((0, y, 1.9), 0.025, 8.0, hexc('#b8bcc0'), rot=(0, math.pi / 2, 0))
        for xx in (-4, 4):
            cyl((xx, y, 0.95), 0.025, 1.9, hexc('#b8bcc0'))
        for k in range(14):
            hg = hanger((-3.6 + k * 0.55, y, 1.9), name='hg')
            garment('gakuran', hg)
            f = 1 + int((k + r * 3) * n * 0.03)
            appear(hg, f)
            swing(hg, n, 0.05, seed=r * 20 + k, f0=f, decay=f + 40)
    cam = camera(30)
    cam_path(cam, [(0, (-5.5, -4.5, 1.8), (-1.5, 0.5, 1.4)), (1, (-1.5, -4.6, 1.8), (2.5, 0.5, 1.4))], n)
    return MB('room')


def fThread(n):  # 布と、糸と、ミシンが、残っている
    setup('#efe6d6', 0.5, (0.3, -0.4, 0.85), 0.35)
    room(5, 4, 2.6, floor=hexc('#c8b090'), wall=hexc('#f4efe6'), window=False)
    table((0, 0.5, 0), w=1.6, d=0.9)
    rnd = random.Random(31)
    for k in range(9):  # 糸巻き
        c = rnd.choice(['#1c1e24', '#d84a4a', '#f2f0ea', '#3a6aa0', '#e8b04a', '#5a8a5a'])
        cyl((-0.65 + k * 0.08, 0.8, 0.8), 0.03, 0.07, hexc(c), verts=14)
        cyl((-0.65 + k * 0.08, 0.8, 0.8), 0.036, 0.012, hexc('#c8a878'), verts=14)
    for k in range(3):  # 布地の巻き
        setcloth(cyl((0.45, 0.85 - k * 0.0, 0.8 + 0.1 + k * 0.17), 0.08, 0.7, (1, 1, 1), rot=(0, math.pi / 2, 0), verts=16),
                 cloth_mat(*[BLACK, CLOTHS[0], TOWELS_C[0]][k]))
    m_, nd = sewing_machine((0.0, 0.35, 0.745), n=n, s=1.2)
    fab = setcloth(boxc((-0.2, 0.32, 0.755), (0.5, 0.4, 0.01), (1, 1, 1)), cloth_mat(*BLACK))
    fabric_slide(fab, n, axis=0, dist=0.1, period=60)
    cam = camera(45, dof=0.9, fstop=2.6)
    cam_path(cam, [(0, (0.4, -0.7, 1.25), (-0.1, 0.5, 0.85)), (1, (-0.2, -0.6, 1.2), (0.0, 0.5, 0.85))], n)
    return MB('room')


def fOshiire(n):  # 家の押し入れからも、古いミシンが出てくる
    setup('#f2e6d0', 0.5, (0.4, -0.5, 0.75), 0.4)
    wa_room(5.0, 4.6, 2.5, floor='#cdbf94', wall='#efe6d6', window=False)
    # 押し入れ（上下2段、ふすまが開く）
    box((0.2, 2.2, 1.2), (2.0, 0.1, 2.4), hexc('#e2d8c6'))
    box((0.2, 1.95, 1.0), (1.9, 0.5, 0.04), hexc('#d8ccb4'))
    for sx in (-1, 1):
        box((0.2 + sx * 1.0, 1.95, 1.2), (0.06, 0.6, 2.4), hexc('#c8b898'))
    box((-0.25, 1.95, 1.25), (0.8, 0.45, 0.45), hexc('#e8e0d0'), bevel=0.04)   # 布団（上の段）
    fs = boxc((0.68, 1.62, 1.2), (0.92, 0.04, 2.3), hexc('#f2ecdf')); fs.keyframe_insert('location', frame=1)
    fs.keyframe_insert('location', frame=int(n * 0.1)); fs.location.x = -0.25; fs.keyframe_insert('location', frame=int(n * 0.1) + 14)
    box((-0.28, 1.6, 1.2), (0.92, 0.04, 2.3), hexc('#f2ecdf'))
    case = empty((0.6, 1.95, 0.0), 'case')
    link(box((0, 0, 0.2), (0.55, 0.32, 0.36), hexc('#7a5a3a'), bevel=0.03), case)
    link(box((0, 0, 0.41), (0.16, 0.04, 0.05), hexc('#3a2a20')), case)
    f = int(n * 0.35)
    case.keyframe_insert('location', frame=f); case.location = (0.75, 0.9, 0.0); case.keyframe_insert('location', frame=f + 30)
    p = wrapped_person((1.35, 0.5, -0.3), style='gown', pose='sit', rot_z=math.pi * 0.72, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'), seed=4)
    cam = camera(30)
    cam_path(cam, [(0, (-1.2, -1.8, 1.5), (0.4, 1.6, 0.6)), (1, (-0.8, -1.4, 1.45), (0.5, 1.4, 0.5))], n)
    return MB('room')


def fCurtainJacket(n):  # カーテンの布が、上着になっていく
    setup('#f2e6d0', 0.5, (0.4, -0.5, 0.75), 0.4)
    wa_room(5.0, 4.6, 2.5, floor='#cdbf94', wall='#efe6d6', window=True)
    cl = ('stripe', '#5b8fb9', '#eef3f7', 4)
    t = table((0, 0.4, 0), w=1.1, d=0.7, h=0.42, c=hexc('#a77d55'))
    m_, nd = sewing_machine((0.15, 0.45, 0.445), n=n, run=(1, int(n * 0.6)), s=1.0)
    fab = setcloth(boxc((-0.15, 0.4, 0.455), (0.5, 0.45, 0.012), (1, 1, 1)), cloth_mat(*cl))
    fabric_slide(fab, int(n * 0.6), axis=0, dist=0.12, period=50)
    vanish(fab, int(n * 0.6))
    p = wrapped_person((0, 1.05, -0.42), style='gown', cloth=GOWN_C[2], pose='sit', rot_z=math.pi, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'), seed=4)
    # 縫い上がった上着が、壁のハンガーに掛かる
    hg = hanger((-1.4, 2.15, 2.0), name='hg')
    garment('jacket', hg, cloth=cl)
    appear(hg, int(n * 0.6) + 4)
    swing(hg, n, 0.08, seed=3, f0=int(n * 0.6), decay=int(n * 0.6) + 50)
    cam = camera(30)
    cam_path(cam, [(0, (0.8, -1.9, 1.3), (-0.2, 0.7, 0.7)), (1, (0.3, -1.7, 1.3), (-0.6, 1.2, 1.0))], n)
    return MB('room')


# ---------------- SCENE 13 学校が、また始まる（章12） ----------------
def school_road(morning=True):
    setup('#cfe2f2', 0.5, (0.6, -0.4, 0.55), 0.5)
    ground(rgb=hexc('#a8b48a'))
    box((0, 0, 0.01), (90, 4.0, 0.02), hexc('#8b8680'))
    box((0, -2.6, 0.06), (90, 1.4, 0.12), hexc('#c8c4bc'))
    box((0, 2.6, 0.06), (90, 1.4, 0.12), hexc('#c8c4bc'))
    fence_line(-40, 40, 3.5, h=1.0)
    street_houses(6, seed=51, y=8.0, curtains=True, x0=-18)
    for x in range(-28, 30, 9):
        tree((x, -4.0, 0), s=0.9)


def adult(loc, i, n, seed=0, rot_z=0.0, band=None, bag=True):
    rnd = random.Random(seed * 31 + i)
    jacket = rnd.choice(CLOTHS[:5] + [None, None])
    return wrapped_person(loc, style='gown', cloth=rnd.choice(GOWN_C), jacket=jacket, rot_z=rot_z, name=f'ad{seed}_{i}', n=n,
                          seed=seed * 10 + i, band=band, bag=bag)


def fSchoolRoute(n):  # 一か月後。朝の通学路に、学生服の子どもたちが戻ってくる
    school_road()
    kids = []
    for i in range(8):
        k = school_kid((-6 - i * 1.3, 2.4 + (i % 2) * 0.5, 0.12), rot_z=-math.pi / 2, name=f'kid{i}', kind='gakuran' if i % 3 else 'sailor', bag=True, seed=i)
        kids.append(k)
    for k in kids:
        k.keyframe_insert('location', frame=1); k.location.x += 1.0 * n / FPS; k.keyframe_insert('location', frame=n)
        linear(k, 'location')
    g = adult((-3.5, 1.2, 0.12), 0, n, seed=5, rot_z=-0.4, band='blue')
    cam = camera(32)
    cam_path(cam, [(0, (1.0, -1.2, 1.25), (-5, 2.6, 0.85)), (1, (2.5, -1.0, 1.2), (-1, 2.6, 0.85))], n)
    return MB('morning')


def fAdultsWalk(n):  # 大人たちは、タオルのガウンと、カーテンの上着
    school_road()
    ppl = [adult((0, 0, 0.12), i, n, seed=6, bag=False) for i in range(7)]
    rnd = random.Random(6)
    for i, p in enumerate(ppl):
        d = 1 if i % 2 else -1
        x0 = rnd.uniform(-8, 8); y = -2.5 + (0.0 if d > 0 else 0.6) + rnd.uniform(-0.2, 0.2)
        p.location = (x0, y, 0.12); p.keyframe_insert('location', frame=1)
        p.location.x += d * 1.1 * n / FPS; p.keyframe_insert('location', frame=n)
        linear(p, 'location')
    cam = camera(30)
    cam_path(cam, [(0, (3.5, -9.0, 1.6), (4, -2.2, 1.0)), (1, (5.5, -9.0, 1.6), (6, -2.2, 1.0))], n)
    return MB('morning')


def fBandsWalk(n):  # 腕には、仕事の色の布
    school_road()
    for i, b in enumerate(['blue', 'white', 'red', 'white', 'blue']):
        p = adult((-3.0 + i * 1.6, -2.4, 0.12), i, n, seed=7, rot_z=math.pi / 2, band=b, bag=False)
        p.keyframe_insert('location', frame=1)
        p.location.x -= 0.9 * n / FPS; p.keyframe_insert('location', frame=n)
        linear(p, 'location')
    cam = camera(40)
    cam_path(cam, [(0, (-1.5, -5.2, 1.3), (-1.5, -2.4, 1.15)), (1, (-3.5, -5.2, 1.3), (-3.5, -2.4, 1.15))], n)
    return MB('morning')


def fBagsWalk(n):  # 肩には、斜めにかけた袋
    school_road()
    for i in range(5):
        p = adult((3.0 - i * 1.5, -2.6, 0.12), i, n, seed=8, rot_z=-math.pi / 2, bag=True, band=random.Random(i).choice(['blue', 'white', 'red', None]))
        p.keyframe_insert('location', frame=1)
        p.location.x += 0.9 * n / FPS; p.keyframe_insert('location', frame=n)
        linear(p, 'location')
    cam = camera(40)
    cam_path(cam, [(0, (1.5, -5.4, 1.4), (1.5, -2.6, 1.15)), (1, (3.5, -5.4, 1.4), (3.5, -2.6, 1.15))], n)
    return MB('morning')


def fStationBusy(n):  # 駅前に、人の流れが戻ってくる
    setup('#b7d0e6', 0.45, (0.4, -0.5, 0.7), 0.45)
    ground(rgb=hexc('#c2bcb0'))
    station_building(clock=False)
    rnd = random.Random(61)
    for i in range(22):
        if i % 4 == 0:
            p = school_kid((rnd.uniform(-8, 8), rnd.uniform(-4, 2.5), 0), name=f'k{i}', kind=rnd.choice(['gakuran', 'sailor']), bag=True, seed=i)
        else:
            p = adult((rnd.uniform(-8, 8), rnd.uniform(-4, 2.5), 0), i, n, seed=9, band=rnd.choice(['blue', 'white', 'red', None, None, None]))
        tgt = (rnd.uniform(-4, 4), 3.6, 0) if rnd.random() < 0.6 else (rnd.uniform(-10, 10), -8, 0)
        p.keyframe_insert('location', frame=1)
        v = Vector(tgt) - Vector(p.location); L = v.length
        p.location = tuple(Vector(p.location) + v.normalized() * min(L, 1.1 * n / FPS)); p.keyframe_insert('location', frame=n)
        linear(p, 'location')
    for i in range(4):
        b = pigeon((rnd.uniform(-6, 6), rnd.uniform(-6, -3), 0), rot_z=rnd.uniform(-1, 1))
        peck(b, n, rnd)
    cam = camera(30)
    cam_path(cam, [(0, (-3, -14, 3.2), (0, 2, 1.2)), (1, (2, -12.5, 2.8), (0, 2, 1.2))], n)
    return MB('city')


# ---------------- SCENE 14 もう一度、服を着る（章13）・エンドカード（章14） ----------------
SHIRT = ('plain', '#cfe0ee', '#cfe0ee', 1)


def dusk_room(n, window=True):
    setup('#f0a868', 0.3, (0.8, -0.2, 0.35), 0.5)
    wa_room(5.0, 4.6, 2.5, floor='#c8b48a', wall='#f0dcc0', window=False)
    if window:
        box((0.6, 2.24, 1.4), (1.8, 0.02, 1.3), hexc('#f4a060'))   # 夕焼けの窓
        box((0.6, 2.23, 1.05), (1.8, 0.02, 0.4), hexc('#e88050'))
        box((0.6, 2.22, 0.85), (1.8, 0.02, 0.15), hexc('#6a5a7a'))   # 遠くの家並み
        for sx in (-1, 1):
            setcloth(box((0.6 + sx * 1.05, 2.16, 1.4), (0.35, 0.05, 1.45), (1, 1, 1)), cloth_mat('lace', '#efe8d8', '#c8bca4', 3))


def you_sewing(n, run_to=None):
    t = table((0.6, 1.5, 0), w=1.0, d=0.6, h=0.42, c=hexc('#a77d55'))
    m_, nd = sewing_machine((0.75, 1.5, 0.445), n=n, run=(1, run_to or n))
    fab = setcloth(boxc((0.45, 1.45, 0.455), (0.45, 0.4, 0.012), (1, 1, 1)), cloth_mat(*SHIRT))
    p = wrapped_person((0.6, 0.85, -0.42), style='gown', cloth=GOWN_C[0], pose='sit', rot_z=math.pi, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'), seed=4)
    arm_to(p, 0, (-0.15, -0.45, 0.85)); arm_to(p, 0, (0.15, -0.45, 0.85))
    h = O[p['head']]; h.rotation_euler = (0.3, 0, 0)
    return p, fab


def fSewDusk(n):  # 夕方。あなたは、ミシンの前に座っている
    dusk_room(n)
    p, fab = you_sewing(n)
    fabric_slide(fab, n, axis=0, dist=0.1, period=60)
    cam = camera(30)
    cam_path(cam, [(0, (-1.4, -1.0, 1.4), (0.6, 1.4, 0.8)), (1, (-1.0, -0.7, 1.3), (0.6, 1.4, 0.8))], n)
    return MB('room')


def fShirtUp(n):  # 一枚のシャツを、縫い上げる（広げて見る）
    dusk_room(n)
    t = table((0.6, 1.5, 0), w=1.0, d=0.6, h=0.42, c=hexc('#a77d55'))
    sewing_machine((0.75, 1.5, 0.445), n=n, run=(1, 2))
    p = wrapped_person((0.6, 0.7, 0), style='gown', cloth=GOWN_C[0], rot_z=0.0, name='you', n=n, skin=SKIN[0], hair=hexc('#2b2420'), seed=4)
    f = int(n * 0.25)
    arm_to(p, 0, (-0.25, -0.45, 1.5), f=f); arm_to(p, 0, (0.25, -0.45, 1.5), f=f)
    hold = empty((0, -0.5, 1.55), 'hold'); link(hold, O[p['rig']])
    sh = garment('shirt', hold, cloth=SHIRT, z=0.0)
    hold.keyframe_insert('location', frame=1); hold.location.z = 1.0; hold.keyframe_insert('location', frame=1)
    hold.location.z = 1.0; hold.keyframe_insert('location', frame=f); hold.location.z = 1.58; hold.keyframe_insert('location', frame=f + 10)
    _osc(hold, 'rotation_euler', 2, 0, 0.06, 40, n, random.Random(3))
    cam = camera(35)
    cam_path(cam, [(0, (-0.4, -2.4, 1.5), (0.6, 0.4, 1.2)), (1, (-0.1, -2.0, 1.5), (0.6, 0.4, 1.25))], n)
    return MB('room')


def fShirtOn(n):  # 袖を通すと、体のまわりに、暖かい空気がたまる（ガウンの上からシャツ）
    dusk_room(n)
    f = int(n * 0.22)
    p = wrapped_person((0.6, 0.7, 0), style='gown', cloth=GOWN_C[0], jacket=SHIRT, jacket_at=f, rot_z=0.0, name='you', n=n,
                       skin=SKIN[0], hair=hexc('#2b2420'), seed=4)
    rnd = random.Random(7)
    for i in range(22):
        b = ball((0, 0, 0), rnd.uniform(0.02, 0.032), (1.0, 0.62, 0.3), a=0.8, seg=8, name='warm')
        circle_path(b, n, (0.6, 0.7, 1.0 + rnd.uniform(-0.3, 0.4)), rnd.uniform(0.34, 0.42), laps=rnd.uniform(0.6, 1.0) * rnd.choice([-1, 1]),
                    phase=rnd.uniform(0, 6.28), face=False)
        appear(b, f + 10 + rnd.randint(0, 30))
    h = O[p['head']]
    h.keyframe_insert('rotation_euler', frame=f + 10)
    h.rotation_euler = (0.3, 0, 0); h.keyframe_insert('rotation_euler', frame=f + 22)
    h.keyframe_insert('rotation_euler', frame=f + 50)
    h.rotation_euler = (-0.1, 0, 0.5); h.keyframe_insert('rotation_euler', frame=f + 66)
    cam = camera(35)
    cam_path(cam, [(0, (0.0, -2.2, 1.55), (0.6, 0.7, 1.15)), (1, (0.3, -1.8, 1.5), (0.6, 0.7, 1.2))], n)
    return MB('room')


def fAncient(n):  # 人が服を着始めたのは、何万年も前のこと（毛皮にくるまって火を囲む）
    setup('#1a1a2e', 0.15, (0.3, -0.5, 0.7), 0.3)
    ground(rgb=hexc('#5a5040'))
    for i in range(5):
        rock((-6 + i * 3, 6 + (i % 2), 0.5), r=2.4, c=hexc('#6a6258'), seed=i)
    mountain((0, 30, 0), 18, 12, c=hexc('#3a3a4a'))
    fire = empty((0, 0, 0), 'fire')
    for k in range(5):
        a = k * 2 * math.pi / 5
        bar((0.3 * math.cos(a), 0.3 * math.sin(a), 0.02), (0, 0, 0.12), 0.04, hexc('#5a4030'), parent=fire)
    fl = []
    for k, (c, r, h) in enumerate(((1.0, 0.25, 0.6), (1.0, 0.16, 0.45))):
        o = cone((0, 0, 0.1 + h / 2), r, h, (1, 1, 1), verts=10); o.data.materials.clear()
        o.data.materials.append(gmat((1.0, 0.55 + 0.25 * k, 0.15), 0.9, 'flame'))
        _osc(o, 'scale', 2, 1.0, 0.25, 8 + k * 3, n, random.Random(k))
        _osc(o, 'scale', 0, 1.0, 0.12, 10 + k * 2, n, random.Random(k + 5))
    FUR = [('plain', '#6a4a30', '#6a4a30', 1), ('dots', '#8a6a48', '#5a4030', 5), ('plain', '#9a7a58', '#9a7a58', 1)]
    for i, a in enumerate((0.6, 2.2, 3.8)):
        x, y = 1.3 * math.cos(a), 1.3 * math.sin(a)
        p = wrapped_person((x, y, -0.42), cloth=FUR[i], style='wrap', pose='sit', pin='', rot_z=math.atan2(x, -y) + math.pi,
                           name=f'an{i}', n=n, seed=400 + i, hair=hexc('#2a2018'))
    for i in range(12):  # 火の粉
        b = ball((random.Random(i).uniform(-0.2, 0.2), random.Random(i + 9).uniform(-0.2, 0.2), 0.5), 0.02, (1.0, 0.7, 0.3), seg=6, name='spark')
        f0 = random.Random(i).randint(1, max(2, n - 40))
        b.keyframe_insert('location', frame=f0); b.location.z = 2.0; b.keyframe_insert('location', frame=f0 + 40)
        appear(b, f0); vanish(b, f0 + 40)
    cam = camera(30)
    cam_path(cam, [(0, (2.5, -4.6, 1.6), (0, 0.2, 0.6)), (1, (1.2, -4.2, 1.5), (0, 0.2, 0.6))], n)
    return MB('night')


def fClosetShirt(n):  # 空っぽだったクローゼットに、ハンガーが一つかかる
    dusk_room(n, window=False)
    box((-2.45, 0.2, 1.5), (0.04, 1.2, 1.1), hexc('#f4a060'))
    closet((0.2, 1.9, 0), n, w=2.2, garments=(None, None, None, None), shirt_one=int(n * 0.3) if n > 150 else int(n * 0.15), seed=5)
    cam = camera(32)
    cam_path(cam, [(0, (1.2, -1.4, 1.5), (0.2, 1.9, 1.5)), (1, (0.7, -0.6, 1.6), (0.15, 1.9, 1.55))], n)
    return MB('room')


def fDuskTown(n):  # 人は、もう一度、服を着始めた（夕方の道を歩く人たち）
    school_road()
    setup('#f0a868', 0.35, (0.8, -0.2, 0.3), 0.5)
    rnd = random.Random(71)
    for i in range(10):
        if i % 3 == 0:
            p = school_kid((rnd.uniform(-8, 8), rnd.choice([-2.6, 2.6]), 0.12), name=f'k{i}', kind=rnd.choice(['gakuran', 'sailor']), bag=True, seed=i)
        else:
            p = adult((rnd.uniform(-8, 8), rnd.choice([-2.6, 2.6]), 0.12), i, n, seed=12, band=rnd.choice(['blue', 'white', 'red', None, None]))
        d = rnd.choice([-1, 1])
        p.keyframe_insert('location', frame=1); p.location.x += d * 1.0 * n / FPS; p.keyframe_insert('location', frame=n)
        linear(p, 'location')
    cam = camera(30)
    cam_path(cam, [(0, (-6.0, -1.8, 2.8), (2, 1.5, 1.0)), (1, (-4.0, -1.8, 2.6), (4, 1.5, 1.0))], n)
    return MB('day')
