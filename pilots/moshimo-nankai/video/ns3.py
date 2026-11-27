"""カット：SCENE 22〜31（章21〜30）とエンドカード（章31）：体育館／由比／貨物列車／港／役場と病院／スカスカの棚／前にもあった空っぽの棚／道を開く人たち／江戸時代の二回の津波／一か月後"""
from ns2 import *
from nk import _obj, _font


# ---------------- SCENE 22 体育館の三日目（章21） ----------------
def gym(n, seed=231, k=60, night=False, line=False, arrive=False):
    """小学校の体育館の避難所：段ボールの寝床とブルーシートで床が埋まる"""
    s = bpy.context.scene
    sky(hexc('#c8ccd0')); s.view_settings.exposure = 0.45 if not night else -0.05; no_shadow()
    light_dir((0.2, -0.3, 0.9))
    W, D, Hh = 40, 26, 9
    box((0, 0, -0.1), (W, D, 0.2), hexc('#c8a070'))
    mbox([(x, 0, 0.01, 0.06, D, 0.01) for x in (-12, 0, 12)] + [(0, y, 0.01, W, 0.06, 0.01) for y in (-8, 8)], hexc('#f2f2ee'), 'lines')
    for x in (-W / 2, W / 2):
        box((x, 0, Hh / 2), (0.3, D, Hh), hexc('#e2ddd2'))
    box((0, D / 2, Hh / 2), (W, 0.3, Hh), hexc('#e2ddd2'))
    box((0, D / 2 - 0.3, 1.2), (W, 0.3, 2.4), hexc('#b08a60'))
    mbox([(x, y, Hh - 1.2, 0.4, 0.2, 2.0) for x in (-16, -8, 0, 8, 16) for y in (-12.8, 12.8)], hexc('#d8dce0'), 'winsup')
    mbox([(x, D / 2 - 0.2, 6.5, 5, 0.1, 2.4) for x in (-14, -4, 6, 16)], hexc('#9fb8c8') if not night else hexc('#1a2030'), 'gwin')
    box((0, D / 2 - 1.0, 5.5), (1.8, 0.1, 1.2), hexc('#f2f2ee')); box((0, D / 2 - 1.4, 4.8), (0.5, 0.5, 0.05), hexc('#e05030'))
    mbox([(x, y, Hh - 0.3, 3, 0.6, 0.1) for x in (-12, 0, 12) for y in (-6, 6)], hexc('#fffbea') if not night else hexc('#4a4a40'), 'glights')
    rnd = random.Random(seed)
    sheets = []; cbs = []
    for i in range(-5, 6):
        for j in range(-3, 4):
            x = i * 3.4 + rnd.uniform(-0.3, 0.3); y = j * 3.2 + rnd.uniform(-0.3, 0.3)
            sheets.append((x, y, 0.02, 3.0, 2.8, 0.02, rnd.uniform(-0.1, 0.1)))
            cbs.append((x - 0.6, y, 0.18, 0.9, 2.0, 0.36)); cbs.append((x + 0.6, y, 0.18, 0.9, 2.0, 0.36))
            cbs.append((x, y + 1.4, 0.4, 3.0, 0.06, 0.8))
    mbox(sheets, hexc('#2f6ab0'), 'bluesheet')
    mbox(cbs, hexc('#c9a26a'), 'cardboard')
    mbox([(x - 0.6, y, 0.4, 0.8, 1.6, 0.08) for x, y, *_ in sheets[::2]], hexc('#8a9ab8'), 'blanket')
    ps = []
    for i in range(k):
        x = rnd.uniform(-18, 18); y = rnd.uniform(-10, 10)
        pose = rnd.choice(['sit', 'sit', 'lie', 'stand'])
        p = crowd_person((x, y, 0.4 if pose != 'stand' else 0.02), rnd, rot_z=rnd.uniform(0, 6.28), pose=pose, name=f'gy{i}')
        if pose == 'lie':
            lie_fix(p)
        ps.append(p)
    if arrive:
        for i in range(8):
            x = -18 + rnd.uniform(-1, 1); y = -10 + i * 0.9
            p = crowd_person((x, y, 0.02), rnd, name=f'ar{i}')
            box((0.3, -0.1, 0.7), (0.3, 0.2, 0.4), hexc('#4a5a7a')).parent = O[p['rig']]
            move(p, [(1, (x - 6, y, 0.02)), (n, (x + 6, y + rnd.uniform(-1, 1), 0.02))])
    return ps


def nGymWide(n):  # 三日目。小学校の体育館は、人でいっぱい
    gym(n)
    cam = camera(26)
    cam_path(cam, [(0, (-18, -14, 7), (2, 4, 0)), (1, (-15, -13, 6.6), (4, 4, 0))], n)
    return NB('room')


def nCardboard(n):  # 床には、段ボールとブルーシートが敷き詰められ、足の踏み場もない
    gym(n, seed=232)
    cam = camera(30)
    cam_path(cam, [(0, (-2, -12, 2.2), (3, 2, 0.2)), (1, (0, -12, 2.1), (5, 2, 0.2))], n)
    return NB('room')


def nArrive(n):  # 家にいた人たちが、ここへ移ってきた
    gym(n, seed=233, k=40, arrive=True)
    cam = camera(28)
    cam_path(cam, [(0, (-10, -16, 3.0), (-18, -4, 1)), (1, (-9, -15, 3.0), (-14, -4, 1))], n)
    return NB('room')


def nTapDry(n):  # 家の食べ物が尽き、水道から、水が出ない（台所の蛇口）
    night_room(n, seed=234)
    exposure_keys([(1, 0.4)]); sky(hexc('#c8ccd0'))
    box((0, 2.6, 0.45), (3.0, 0.7, 0.9), hexc('#e8e4dc'))
    box((0, 2.6, 0.92), (1.0, 0.5, 0.05), hexc('#b8bcc0'))
    cyl((0, 2.9, 1.15), 0.03, 0.4, hexc('#c0c4c8'))
    cyl((0, 2.75, 1.33), 0.025, 0.3, hexc('#c0c4c8'), rot=(math.pi / 2, 0, 0))
    p = person((0.2, 1.6, 0), hexc('#c46a4a'), skin=SKIN[1], name='tap', rot_z=math.pi)
    arm_to(p, 0, (-0.15, 0.55, 1.3))
    box((-0.9, 2.6, 0.98), (0.3, 0.3, 0.12), hexc('#f2f2ee'))
    cam = camera(34)
    cam_path(cam, [(0, (-1.8, -0.4, 1.8), (0, 2.6, 1.1)), (1, (-1.5, -0.2, 1.75), (0, 2.6, 1.1))], n)
    return NB('room')


def nWaterLine(n):  # 朝から、水の配給に、長い列ができる
    day_light('#c8d8e8', 0.5)
    ground(size=300, rgb=hexc('#b8a888'))
    box((0, 30, 5), (40, 20, 10), hexc('#e2ddd2'))
    rnd = random.Random(235)
    box((0, 10, 0.9), (6, 2.0, 0.2), hexc('#f2f2ee'))
    mbox([(x, 10.4, 1.15, 0.25, 0.25, 0.4) for x in [-2.6 + k * 0.4 for k in range(14)]], hexc('#9fd0f0'), 'bottles')
    mbox([(x, 14, 1.4, 1.6, 1.6, 2.8) for x in (-6, 6)], hexc('#3a6ab0'), 'tank')
    for i in range(2):
        worker((-1 + i * 2, 11.5, 0), rnd, rot_z=math.pi, name=f'wd{i}')
    for i in range(30):
        y = 8 - i * 1.0; x = rnd.uniform(-0.3, 0.3) + (0 if i < 15 else (i - 15) * 0.8)
        p = crowd_person((x, y, 0), rnd, rot_z=math.pi + rnd.uniform(-0.3, 0.3), name=f'wl{i}')
        box((0.3, -0.1, 0.6), (0.25, 0.25, 0.35), hexc('#f0c040')).parent = O[p['rig']]
        move(p, [(1, (x, y, 0)), (n, (x, y + 1.0, 0))])
    cam = camera(28)
    cam_path(cam, [(0, (14, -18, 5), (0, 0, 1)), (1, (12, -16, 4.6), (0, 2, 1))], n)
    return NB('day')


def nToilet(n):  # トイレは、水が流れず、使えなくなっている
    s = bpy.context.scene
    sky(hexc('#c8ccd0')); s.view_settings.exposure = 0.4; no_shadow()
    interior_box(6, 4, 2.6, hexc('#9aa6a8'), hexc('#e8ecec'))
    for k in range(3):
        x = -2 + k * 2
        box((x - 0.9, 1.25, 1.0), (0.05, 1.5, 2.0), hexc('#c8d0d4'))
        box((x, 1.87, 1.0), (1.8, 0.05, 2.0), hexc('#d8dee0'))
        paper_notice((x, 1.83, 1.3), w=0.5, h=0.36, text='使用禁止\n水が流れません')
    cam = camera(28)
    cam_path(cam, [(0, (-1.0, -1.9, 1.6), (0.5, 2, 1.2)), (1, (-0.6, -1.7, 1.6), (0.5, 2, 1.2))], n)
    return NB('room')


def nNightGym(n):  # 夜は、寒さと、余震と、人の声で、眠れない
    gym(n, seed=236, night=True)
    cam = camera(28)
    cam_path(cam, [(0, (14, -12, 4), (0, 2, 0.4)), (1, (12, -11, 3.8), (0, 2, 0.4))], n)
    shake(cam, int(n * 0.5), int(n * 0.65), amp=0.05, rot=0.005, seed=16)
    return NB('room', rumble=[(int(n * 0.5), int(n * 0.65), 0.3)])


# ---------------- SCENE 23 由比で切れる日本（章22） ----------------
def yui_h(x, y):
    return 0.0 if y < 34 else min(140.0, (y - 34) * 1.1 + 4 * math.sin(x * 0.03))


def yui(n, slide_f=None, buried=False, cleared=None, night=False, traffic=True, seed=241, trucks=False):
    """由比のような狭い土地（模式）：海（y<-16）・東名高速（高架 y=0）・国道1号（y=14）・東海道線（y=24）・急な山（y>34）"""
    if night:
        night_light('#0e1426', 0.1)
    else:
        day_light('#a7bccd', 0.45)
    plane((0, -200, -1.0), (1600, 380), hexc('#4a7a9c'), name='sea')
    box((0, -14, -0.5), (1600, 3, 2.0), CONC)
    plane((0, 10, 0.0), (1600, 48), hexc('#a8a294'))
    terrain((1600, 220), (90), yui_h, hexc('#5f7a48'), 'mount', x0=-800, y0=30)
    rnd = random.Random(seed)
    pts = [(rnd.uniform(-600, 600), rnd.uniform(40, 200)) for _ in range(260)]
    ever_trees([(x, y, yui_h(x, y)) for x, y in pts], seed=seed, s=(1.6, 2.6))
    # 東名（高架）
    box((0, 0, 7), (1600, 22, 0.8), hexc('#b8b4aa'))
    mbox([(x, 0, 3.3, 2.0, 14, 6.6) for x in range(-780, 781, 40)], hexc('#a8a49a'), 'piers')
    mbox([(0, y, 7.9, 1600, 0.4, 1.0) for y in (-11, 11)], hexc('#d0ccc2'), 'guard')
    mbox([(x, y, 7.45, 6, 0.15, 0.02) for x in range(-780, 781, 14) for y in (-5.5, 5.5)], hexc('#f2f2ee'), 'lanes')
    plane((0, 14, 0.03), (1600, 10), ASPH)
    rails(-800, 800, 22, k=2)
    out = dict(cars=[])
    if traffic:
        for k in range(24):
            x = rnd.uniform(-300, 300); lane = rnd.choice([-8, -3, 3, 8])
            c = car_s((x, lane, 7.45), rot_z=math.pi / 2 if lane < 0 else -math.pi / 2, name=f'yc{k}') if rnd.random() < 0.6 else \
                truck((x, lane, 7.45), rot_z=math.pi / 2 if lane < 0 else -math.pi / 2, c=rnd.choice(CONT_C + [hexc('#f2f2ee')]))
            out['cars'].append(c)
            if slide_f is None and not buried:
                d = (1 if lane > 0 else -1) * 22 * n / FPS
                move(c, [(1, (x, lane, 7.45)), (n, (x + d, lane, 7.45))])
            elif slide_f is not None:
                d = (1 if lane > 0 else -1) * 22
                move(c, [(1, (x, lane, 7.45)), (slide_f, (x + d * slide_f / FPS, lane, 7.45)), (slide_f + 24, (x + d * (slide_f + 12) / FPS, lane, 7.45))])
    if slide_f is not None or buried:
        blob = msph([(0, 20, 10, 70, 1.0, 0.45, 0.22), (-30, 26, 9, 40, 1.0, 0.5, 0.25), (35, 24, 9, 45, 1.0, 0.5, 0.25)],
                    hexc('#8a6a48'), 'landslide', sub=3, smooth=True)
        rubble((0, 10, 8), k=80, spread=(40, 8), seed=seed, cols=[hexc('#7a5a3a'), hexc('#6a5236'), hexc('#5f7a48')])
        if cleared is not None:
            blob.scale = (1, 1, cleared)
        if slide_f is not None:
            blob.location = (0, 60, 50); blob.keyframe_insert('location', frame=1); blob.keyframe_insert('location', frame=max(2, slide_f))
            blob.location = (0, 0, 0); blob.keyframe_insert('location', frame=slide_f + 36)
            dust(n, (0, 30, 20), slide_f + 10, k=20, r=(4, 9), seed=7, c=hexc('#a8987c'), life=70)
        out['blob'] = blob
    return out


def nYuiWide(n):  # 静岡に、由比という、山と海にはさまれた、細い場所がある
    yui(n)
    cam = camera(26)
    cam_path(cam, [(0, (-220, -260, 120), (0, 30, 10)), (1, (-200, -250, 110), (20, 30, 10))], n)
    return NB('sea')


def nYuiBundle(n):  # 東名高速、国道一号、そして東海道線が、束になって通っている
    yui(n, seed=242)
    tr = freight_train((-200, 22, 0.3), wagons=8, seed=3)
    move(tr, [(1, (-200, 22, 0.3)), (n, (-200 + 18 * n / FPS, 22, 0.3))])
    for k in range(6):
        c = car_s((-80 + k * 30, 12 if k % 2 else 16, 0.03), rot_z=math.pi / 2 if k % 2 else -math.pi / 2, name=f'r1c{k}')
        d = (-1 if k % 2 else 1) * 14 * n / FPS
        move(c, [(1, tuple(c.location)), (n, (c.location.x + d, c.location.y, 0.03))])
    cam = camera(30)
    cam_path(cam, [(0, (60, -60, 26), (-20, 14, 4)), (1, (50, -56, 24), (-30, 14, 4))], n)
    return NB('sea')


def nYuiArtery(n):  # 東京と、名古屋と、大阪を結ぶ、日本の大動脈（地図）
    japan_map(name='nk_map_t')
    route_line(TOKAIDO, rgb=hexc('#ffd060'), r=0.32)
    o = ball(MP(*YUI, 0.6), 0.9, (1.0, 0.3, 0.25), seg=16, name='yui')
    map_text('由比', YUI[0] + 0.1, YUI[1] - 0.45, size=1.6, rgb=(1, 0.6, 0.55))
    map_cam(n, (137.7, 34.4, 34), (137.8, 34.6, 30))
    return NB('silent')


def nYuiSlide(n):  # その山の斜面が、崩れる
    yui(n, slide_f=int(n * 0.25), seed=243)
    cam = camera(28)
    cam_path(cam, [(0, (-120, -140, 60), (0, 30, 20)), (1, (-110, -130, 56), (0, 20, 10))], n)
    shake(cam, int(n * 0.25), int(n * 0.6), amp=0.4, rot=0.006, seed=17)
    return NB('sea', rumble=[(int(n * 0.25), n, 0.8)], crash=[(int(n * 0.3), 1.0)])


def nYuiBuried(n):  # 土砂が、高速道路も、国道も、線路も、まとめて埋めてしまう
    out = yui(n, buried=True, traffic=False, seed=244)
    for k in range(8):
        car_s((-120 - k * 9, -3 if k % 2 else 3, 7.45), rot_z=-math.pi / 2, name=f'st{k}')
    cam = camera(28)
    cam_path(cam, [(0, (-160, -40, 30), (0, 10, 6)), (1, (-150, -36, 28), (0, 10, 6))], n)
    return NB('sea')


def nYuiMapCut(n):  # 日本の東と西が、ここで、切り離される（地図）
    japan_map(name='nk_map_t')
    i = 4
    east = TOKAIDO[:i] + [YUI]; west = [YUI] + TOKAIDO[i + 1:]
    route_line(east, rgb=hexc('#ffd060'), r=0.32, name='east')
    w = route_line(west, rgb=hexc('#ffd060'), r=0.32, name='west')
    gap = mbar([(MP(YUI[0] + 0.12, YUI[1] + 0.12, 0.8), MP(YUI[0] - 0.12, YUI[1] - 0.12, 0.8), 0.25),
                (MP(YUI[0] - 0.12, YUI[1] + 0.12, 0.8), MP(YUI[0] + 0.12, YUI[1] - 0.12, 0.8), 0.25)], (1.0, 0.2, 0.15), 'xmark', segs=6)
    appear(gap, int(n * 0.2), grow=6)
    pv = empty(MP(*YUI, 0), 'westpv'); w.parent = pv; w.location = tuple(-v for v in MP(*YUI, 0))
    pv.keyframe_insert('location', frame=int(n * 0.25))
    pv.location.x -= 1.5; pv.keyframe_insert('location', frame=int(n * 0.6))
    map_cam(n, (137.6, 34.5, 36), (137.6, 34.7, 32))
    return NB('silent')


# ---------------- SCENE 24 動かない貨物列車（章23） ----------------
def freight_yard(n, k=5, moving=None, seed=251):
    day_light('#b8c8d8', 0.45)
    ground(size=1600, rgb=hexc('#a8a294'))
    rnd = random.Random(seed)
    trs = []
    for t in range(k):
        y = -10 + t * 5.0
        rails(-500, 500, y, k=1)
        tr = freight_train((120 + rnd.uniform(-40, 40), y, 0.3), wagons=10, seed=seed + t)
        trs.append(tr)
    skyline(n, cx=0, cy=140, nx=8, ny=2, pitch=50, hr=(10, 40), seed=seed)
    return trs


def nFreightYard(n):  # 東海道線は、日本の鉄道で運ばれる荷物の、四割近くを運んでいる
    trs = freight_yard(n, k=3)
    for tr in trs:
        move(tr, [(1, tuple(tr.location)), (n, (tr.location.x + 14 * n / FPS, tr.location.y, 0.3))])
    cam = camera(30)
    cam_path(cam, [(0, (40, -50, 16), (60, 0, 2)), (1, (60, -50, 16), (90, 0, 2))], n)
    return NB('city')


def nFreightGoods(n):  # 食べ物も、日用品も、この線路を通っていた（コンテナの中：模式）
    day_light('#b8c8d8', 0.45)
    ground(size=400, rgb=hexc('#a8a294'))
    rails(-100, 100, 0, k=1)
    tr = freight_train((40, 0, 0.3), wagons=4, seed=7)
    rnd = random.Random(252)
    cont = box((-12, -6, 1.5), (6, 2.5, 2.6), hexc('#2f6aa0'))
    items = []
    for i in range(60):
        items.append((-12 + rnd.uniform(-2.6, 2.6), -6 + rnd.uniform(-1, 1), 0.4 + rnd.uniform(0, 2.2), 0.35))
    for g, c in enumerate([hexc('#e8c070'), hexc('#d9534f'), hexc('#f2f2ee'), hexc('#6aa86a')]):
        o = mbox([(x, y, z, r, r * 0.8, r) for x, y, z, r in items[g::4]], c, 'goods')
    cont.data.materials.clear(); cont.data.materials.append(gmat(hexc('#2f6aa0'), 0.25, 'cglass'))
    cam = camera(30)
    cam_path(cam, [(0, (-4, -20, 4), (-12, -6, 1.5)), (1, (-6, -19, 3.8), (-12, -6, 1.5))], n)
    return NB('city')


def nFreightStill(n):  # 貨物列車が、駅に並んだまま、動かない
    freight_yard(n, k=5, seed=253)
    cam = camera(26)
    cam_path(cam, [(0, (-60, -40, 22), (80, 4, 0)), (1, (-50, -40, 21), (90, 4, 0))], n)
    return NB('city')


def nTruckJam(n):  # トラックは、山を越える遠回りの道に集まり、長い渋滞ができる
    day_light('#b8c8d8', 0.45)
    def hfn(x, y):
        return 18 * math.sin(x * 0.012) + 10 * math.cos(y * 0.015) + 20
    terrain((900, 900), 60, hfn, hexc('#6f8a50'), 'mtn', x0=-450, y0=-450)
    rnd = random.Random(254)
    ever_trees([(x, y, hfn(x, y)) for x, y in [(rnd.uniform(-400, 400), rnd.uniform(-400, 400)) for _ in range(260)] if abs(y - 20 * math.sin(x * 0.02)) > 10], seed=254, s=(1.6, 2.4))
    pts = [(x, 20 * math.sin(x * 0.02)) for x in range(-400, 401, 10)]
    mbar([((pts[i][0], pts[i][1], hfn(*pts[i]) + 0.3), (pts[i + 1][0], pts[i + 1][1], hfn(*pts[i + 1]) + 0.3), 4.0) for i in range(len(pts) - 1)], hexc('#5a5a5e'), 'road', segs=4)
    for k in range(40):
        x = -250 + k * 12 + rnd.uniform(-1, 1); y = 20 * math.sin(x * 0.02)
        dy = 20 * 0.02 * math.cos(x * 0.02)
        t = truck((x, y - 1.6, hfn(x, y) + 0.2), rot_z=math.atan2(dy, 1) + math.pi / 2, c=rnd.choice(CONT_C + [hexc('#f2f2ee')]), cargo=hexc('#d9c08a'))
        if k % 3 == 0:
            x2 = x + 3; move(t, [(1, tuple(t.location)), (n, (x2, 20 * math.sin(x2 * 0.02) - 1.6, hfn(x2, 20 * math.sin(x2 * 0.02)) + 0.2))])
    cam = camera(28)
    cam_path(cam, [(0, (-200, -160, 130), (0, 0, 20)), (1, (-180, -150, 120), (20, 0, 20))], n)
    return NB('city')


# ---------------- SCENE 25 港に入れない船（章24） ----------------
def port(n, broken=False, ships=True, seed=261):
    day_light('#a9bccd', 0.45)
    plane((0, 300, -1.5), (2000, 600), hexc('#3f6f94'), name='sea')
    plane((0, -150, 0), (2000, 300), hexc('#a8a294'))
    rnd = random.Random(seed)
    if broken:
        for k in range(14):
            box((-260 + k * 40, 6, -0.4), (38, 12, 1.6), CONC, rot=(rnd.uniform(-0.12, 0.12), rnd.uniform(-0.06, 0.06), rnd.uniform(-0.04, 0.04)))
    else:
        box((0, 6, -0.4), (600, 12, 1.6), CONC)
    for k in range(5):
        c = gantry_crane((-160 + k * 80, 4, 0), rot_z=0)
        if broken and k % 2:
            c.rotation_euler = (0.15, 0.05, 0)
    items = {}
    for i in range(30):
        for j in range(6):
            for h in range(rnd.randint(1, 4)):
                c = rnd.choice(CONT_C)
                items.setdefault(c, []).append((-220 + i * 15, -20 - j * 7, 1.3 + h * 2.6, 12.2, 2.5, 2.5))
    for c, it in items.items():
        mbox(it, c, 'cstack')
    if broken:
        flood((0, -60, 0), (600, 60), 0.3, 0.3, 1, n, c=hexc('#6a6a5a'), a=0.8)
        rubble((0, -6, 0.5), k=60, spread=(80, 4), seed=seed)
    if ships:
        container_ship((-200, 420, -1.5), rot_z=0.1, seed=1)
        tanker((180, 520, -1.5), rot_z=-0.2)
        container_ship((380, 700, -1.5), rot_z=0.3, seed=3)


def nPortStop(n):  # 海から来る荷物も、止まる
    port(n, broken=True)
    cam = camera(26)
    cam_path(cam, [(0, (-200, -140, 60), (0, 60, 10)), (1, (-180, -130, 56), (20, 60, 10))], n)
    return NB('sea')


def nThreeBays(n):  # 東京湾と、伊勢湾と、大阪湾（地図）
    japan_map(name='nk_map_t')
    for k, (lo, la, t) in enumerate([(139.85, 35.45, '東京湾'), (136.78, 34.85, '伊勢湾'), (135.3, 34.5, '大阪湾')]):
        o = ball(MP(lo, la, 0.5), 1.6, (0.3, 0.75, 1.0), a=0.55, seg=20, name='bay')
        appear(o, 4 + k * int(n * 0.2), grow=6)
        map_text(t, lo, la - 0.55, size=1.8, rgb=(0.8, 0.92, 1.0), f=4 + k * int(n * 0.2))
    map_cam(n, (137.4, 34.6, 40), (137.5, 34.8, 36))
    return NB('silent')


def nContainers80(n):  # この三つの湾の港が、外国から届くコンテナの、八割を受け取っていた
    port(n, broken=False, ships=False, seed=262)
    s = container_ship((0, 60, -1.5), rot_z=0, seed=5)
    cam = camera(28)
    cam_path(cam, [(0, (-160, -60, 70), (0, 20, 5)), (1, (-150, -54, 66), (10, 20, 5))], n)
    return NB('sea')


def nPortBroken(n):  # そのうち、伊勢湾と大阪湾で、船が、港に入れない（壊れた岸壁、止まったクレーン）
    port(n, broken=True, seed=263)
    cam = camera(30)
    cam_path(cam, [(0, (30, -40, 14), (-40, 10, 6)), (1, (24, -36, 13), (-50, 10, 6))], n)
    return NB('sea')


def nShipsWait(n):  # 沖で、船が、待ち続ける
    day_light('#a9bccd', 0.45)
    plane((0, 0, -1.5), (6000, 6000), hexc('#3f6f94'), name='sea')
    rnd = random.Random(264)
    for k in range(7):
        x = -500 + k * 160 + rnd.uniform(-30, 30); y = rnd.uniform(200, 900)
        s = container_ship((x, y, -1.5), rot_z=rnd.uniform(-0.5, 0.5), seed=k) if k % 3 else tanker((x, y, -1.5), rot_z=rnd.uniform(-0.5, 0.5))
        bob(s, n, amp=0.3, period=90)
    far_hills(y=-400, c=hexc('#7a8a7a'))
    cam = camera(30)
    cam_path(cam, [(0, (0, -200, 30), (0, 500, 0)), (1, (20, -190, 30), (20, 500, 0))], n)
    return NB('sea')


# ---------------- SCENE 26 水につかった役場と病院（章25） ----------------
def nTownHall(n):  # 津波に襲われた町では、役場も、病院も、被害を受けている
    day_light('#a9b8c8', 0.4)
    plane((0, 0, 0), (600, 600), hexc('#8a8270'))
    b = tower((0, 0, 0), 30, 16, 12, hexc('#e6e2d8'))
    box((0, -8.06, 1.2), (30, 0.06, 2.4), hexc('#6a5a44'))  # 泥の跡
    box((0, -8.1, 5.5), (6, 0.1, 1.0), hexc('#f2f2ee'))
    for k in range(5):
        rubble((-40 + k * 20, -18, 0), k=20, spread=(5, 3), seed=k)
    for k in range(3):
        c = car_s((-20 + k * 14, -16, 0), rot_z=k * 1.3, name=f'th{k}')
        c.rotation_euler.x = 0.2 * (k - 1)
    rnd = random.Random(271)
    for i in range(4):
        worker((-8 + i * 4, -12, 0), rnd, rot_z=math.pi + rnd.uniform(-0.6, 0.6), name=f'tw{i}')
    cam = camera(30)
    cam_path(cam, [(0, (-30, -50, 8), (0, 0, 5)), (1, (-26, -46, 7.6), (0, 0, 5))], n)
    return NB('city')


def nHallInside(n):  # 役場の一階は水につかり、住民の記録も、パソコンも、使えない
    s = bpy.context.scene
    sky(hexc('#a0a8b0')); s.view_settings.exposure = 0.3; no_shadow()
    interior_box(14, 10, 3.0, hexc('#5a4e3c'), hexc('#d8d2c4'))
    box((0, 4.9, 0.6), (14, 0.05, 1.2), hexc('#6a5a44'))
    rnd = random.Random(272)
    for i in range(3):
        for j in range(2):
            x = -4 + i * 4; y = -1 + j * 3
            box((x, y, 0.72), (2.4, 1.2, 0.06), hexc('#b8b0a0'), rot=(0, 0, rnd.uniform(-0.2, 0.2)))
            box((x, y + 0.3, 0.95), (0.5, 0.05, 0.35), hexc('#2a2e34'), rot=(rnd.uniform(-0.4, 0.4), 0, 0))
    mbox([(rnd.uniform(-6, 6), rnd.uniform(-4, 4), 0.04, 0.3, 0.4, 0.005, rnd.uniform(0, 3)) for _ in range(80)], hexc('#eeeae0'), 'papers')
    mbox([(-6.8, y, 1.0, 0.4, 1.6, 2.0) for y in (-3, 0, 3)], hexc('#8a8e92'), 'cabinet')
    flood((0, 0, 0), (14, 10), 0.12, 0.12, 1, n, c=hexc('#5a503c'), a=0.85)
    p = worker((2, -3, 0), rnd, rot_z=math.pi * 0.8, name='hw')
    cam = camera(26)
    cam_path(cam, [(0, (-5, -4.5, 1.7), (3, 3, 0.6)), (1, (-4.5, -4.2, 1.7), (3, 3, 0.6))], n)
    return NB('room')


def nHospitalDark(n):  # 病院は、停電の中、非常用の電気で、けが人の手当てを続ける
    hosp_room(night=True)
    s = bpy.context.scene; s.view_settings.exposure = 0.1; no_shadow()
    rnd = random.Random(273)
    r, pt = hosp_bed((0, 1, 0), patient=hexc('#c8d8e8'))
    doctor((-1.0, 0.6, 0), rot_z=-math.pi / 2, act='talk', name='doc')
    nurse((1.0, 0.8, 0), rot_z=math.pi / 2, act='talk', name='nurse')
    iv_pole((1.4, 2.0, 0))
    lamp = ball((0, 0, 2.5), 0.2, (1.0, 0.85, 0.5), seg=10, name='elamp')
    for k in range(2):
        hosp_bed((-3 + k * 6, 3.5, 0), patient=hexc('#c8d8e8'))
    cam = camera(30)
    cam_path(cam, [(0, (-2.6, -3.0, 1.9), (0, 1, 0.8)), (1, (-2.2, -2.7, 1.85), (0, 1, 0.8))], n)
    return NB('room')


def nHelpWide(n):  # 助けを出すはずの場所が、助けを求めている（水に囲まれた役場の屋上に人）
    day_light('#a9b8c8', 0.4)
    plane((0, 0, 0), (800, 800), hexc('#8a8270'))
    flood((0, 0, 0), (800, 800), 1.2, 1.2, 1, n, c=hexc('#5a5a4c'), a=0.9)
    tower((0, 0, 0), 30, 16, 12, hexc('#e6e2d8'))
    tower((60, 30, 0), 40, 20, 16, hexc('#f2f2ee'))
    box((60, 30, 16.05), (8, 8, 0.05), hexc('#e8e8e2'))
    rnd = random.Random(274)
    for i in range(5):
        crowd_person((rnd.uniform(-10, 10), rnd.uniform(2, 6), 12.0), rnd, rot_z=rnd.uniform(0, 6.28), name=f'rf{i}')
    debris_field(n, -100, 100, -100, 100, 1.25, dirv=(0.3, 1), speed=0.3, k=80)
    cam = camera(28)
    cam_path(cam, [(0, (-28, -42, 32), (2, 0, 9)), (1, (-25, -39, 30), (2, 0, 9))], n)
    return NB('city')


# ---------------- SCENE 27 スカスカの棚（章26） ----------------
def supermarket(n, fill=0.12, seed=281, people=6, refill=None):
    s = bpy.context.scene
    sky(hexc('#c8ccd0')); s.view_settings.exposure = 0.55; no_shadow()
    light_dir((0.2, -0.3, 0.9))
    interior_box(24, 18, 3.6, hexc('#e2e0da'), hexc('#f4f4f2'))
    mbox([(x, y, 3.55, 4, 0.4, 0.05) for x in (-8, 0, 8) for y in (-5, 0, 5)], hexc('#ffffff'), 'clights')
    goods = []
    for k in range(4):
        y = -4 + k * 3.4
        shelf_unit((-5, y, 0), w=8, fill=fill, seed=seed + k, items_out=goods)
        shelf_unit((5, y, 0), w=8, fill=fill, seed=seed + 10 + k, items_out=goods)
    rnd = random.Random(seed)
    if refill:
        f0, f1 = refill
        for k in range(4):
            y = -4 + k * 3.4
            more = []
            shelf_unit((-5, y, 0), w=8, fill=0.6, seed=seed + 40 + k, items_out=more)
            for j, o in enumerate(more):
                appear(o, f0 + int((f1 - f0) * rnd.random()), grow=8)
                o.parent.location.z = 0
    for i in range(people):
        p = crowd_person((rnd.uniform(-10, 10), rnd.choice([-5.6, -2.3, 1.1, 4.5]), 0), rnd, rot_z=rnd.uniform(-1, 1), name=f'sm{i}')
        move(p, [(1, tuple(p.location)), (n, (p.location.x + rnd.uniform(-3, 3), p.location.y, 0))])
    return goods


def nSuperOutside(n):  # 一週間後、東京。スーパーの建物は、壊れていない。電気も、ついている
    day_light('#b8cfe4', 0.5)
    ground(size=600, rgb=hexc('#a8a294'))
    box((0, 10, 4), (40, 20, 8), hexc('#e8e4da'))
    box((0, -0.05, 1.6), (30, 0.1, 3.0), hexc('#fff4c8'))
    box((0, -0.1, 6), (20, 0.1, 1.6), hexc('#3a8a5a'))
    skyline(n, cx=0, cy=120, nx=6, ny=2, pitch=40, hr=(20, 60), seed=282)
    rnd = random.Random(283)
    for i in range(6):
        p = crowd_person((rnd.uniform(-14, 14), -6 + rnd.uniform(-2, 2), 0), rnd, name=f'so{i}')
        move(p, [(1, tuple(p.location)), (n, (p.location.x + rnd.uniform(-4, 4), p.location.y + rnd.uniform(-1, 3), 0))])
    for k in range(4):
        car_s((-24 + k * 6, -16, 0), rot_z=0, name=f'pk{k}')
    cam = camera(28)
    cam_path(cam, [(0, (-20, -36, 6), (0, 4, 3)), (1, (-16, -34, 5.6), (2, 4, 3))], n)
    return NB('city')


def nShelvesSparse(n):  # それでも、棚は、スカスカ
    supermarket(n)
    cam = camera(26)
    cam_path(cam, [(0, (-1.2, -9, 1.8), (-1, 8, 0.9)), (1, (-0.8, -8, 1.75), (-1, 8, 0.9))], n)
    return NB('room')


def nShelfItems(n):  # パン、牛乳、カップ麺、ペットボトルの水
    supermarket(n, fill=0.05, seed=284, people=1)
    cam = camera(36)
    cam_path(cam, [(0, (-7, -6.2, 1.2), (-2, -4, 0.8)), (1, (-2, -6.2, 1.2), (3, -4, 0.8))], n)
    return NB('room')


def nNotices(n):  # 入荷のめどが立っていないという貼り紙が、棚に並ぶ（架空の貼り紙）
    supermarket(n, fill=0.06, seed=285, people=2)
    for k in range(4):
        paper_notice((-7 + k * 2.2, -4.35, 1.1), w=0.6, h=0.42)
    cam = camera(34)
    cam_path(cam, [(0, (-5, -7.6, 1.4), (-4, -4, 1.0)), (1, (-4, -7.4, 1.4), (-3, -4, 1.0))], n)
    return NB('room')


def nTokyoStall(n):  # 揺れの小さかった東京が、止まり始める
    day_light('#b8c4cc', 0.42)
    ground(size=2000, rgb=hexc('#9a9690'))
    skyline(n, cx=0, cy=0, nx=8, ny=8, pitch=55, hr=(30, 160), seed=286)
    plane((0, 0, 0.02), (20, 2000), ASPH)
    rnd = random.Random(287)
    for k in range(12):
        car_s((rnd.choice([-5, -2, 2, 5]), rnd.uniform(-300, 100), 0.02), rot_z=0, name=f'tk{k}')
    cam = camera(26)
    cam_path(cam, [(0, (60, -340, 70), (0, 0, 20)), (1, (50, -320, 66), (0, 0, 20))], n)
    return NB('city')


# ---------------- SCENE 28 前にもあった空っぽの棚（章27） ----------------
def rice_shelf(n, empty_f=None, people=6, seed=291, tint=True):
    """米の棚（回想は色を落とす）。empty_f=(f0, f1) の間に米の袋が次々に消える"""
    s = bpy.context.scene
    sky(hexc('#c8ccd0')); s.view_settings.exposure = 0.55; no_shadow()
    interior_box(16, 12, 3.4, hexc('#e2e0da'), hexc('#f4f4f2'))
    root = empty((0, 2, 0), 'rshelf')
    link(box((0, 0.35, 1.0), (8, 0.08, 2.0), hexc('#e6e6e2')), root)
    rnd = random.Random(seed)
    bags = []
    for lv in range(4):
        z = 0.15 + lv * 0.48
        link(box((0, 0, z), (8, 0.7, 0.03), hexc('#c8ccd0')), root)
        for k in range(14):
            b = box((-3.7 + k * 0.56, -0.02, z + 0.2), (0.5, 0.55, 0.36), rnd.choice([hexc('#f2ecdc'), hexc('#e8dcc0'), hexc('#f6f0e4')]), name='rice')
            link(b, root)
            link(box((-3.7 + k * 0.56, -0.3, z + 0.22), (0.3, 0.02, 0.12), hexc('#c0503e')), b) if False else None
            bags.append(b)
    if empty_f:
        f0, f1 = empty_f
        rnd.shuffle(bags)
        for j, b in enumerate(bags):
            vanish(b, f0 + int((f1 - f0) * j / len(bags)))
    ps = []
    for i in range(people):
        x = -4 + i * 1.6 + rnd.uniform(-0.3, 0.3)
        p = crowd_person((x, 0.6, 0), rnd, rot_z=math.pi + rnd.uniform(-0.3, 0.3), name=f'rb{i}')
        cart = empty((x + 0.4, 0.0, 0), 'cart')
        link(box((0, 0, 0.75), (0.6, 0.8, 0.5), hexc('#b8bcc0')), cart)
        cart_bag = box((0, 0, 0.9), (0.45, 0.5, 0.3), hexc('#f2ecdc')); link(cart_bag, cart)
        if empty_f:
            appear(cart_bag, empty_f[0] + i * 10)
        ps.append(p)
    return bags


def draw_chui(im, d):
    W, H = im.size
    d.rectangle((0, 0, W, H), fill=(22, 34, 58))
    d.rectangle((0, 0, W, 150), fill=(220, 150, 30))
    d.text((50, 26), '巨大地震注意', font=_font(96), fill=(255, 255, 255))
    d.text((80, 260), '宮崎で大きな地震', font=_font(80), fill=(240, 240, 240))
    d.text((80, 420), '日ごろの備えの確認を', font=_font(70), fill=(240, 240, 240))
    d.rectangle((0, H - 120, W, H), fill=(240, 240, 240))
    d.text((40, H - 100), 'ニュース（架空の画面）', font=_font(56), fill=(60, 60, 60))


def nShelfMemory(n):  # 東京の人は、空っぽの棚を、前にも見ている
    rice_shelf(n, people=0)
    for o in bpy.data.objects:
        if o.name.startswith('rice'):
            o.scale = (0, 0, 0)
    cam = camera(30)
    cam_path(cam, [(0, (-2, -5, 1.6), (0, 2, 1.0)), (1, (-1.4, -4.4, 1.55), (0, 2, 1.0))], n)
    return NB('room')


def nNewsMiyazaki(n):  # ある夏、宮崎で大きな地震があり、国が初めて「巨大地震注意」を出した（回想）
    living_tv(n, 'nk_news_chui', draw_chui, people=2, seed=292)
    tint_all('gray', 0.85)
    cam = camera(32)
    cam_path(cam, [(0, (1.2, -3.0, 1.6), (0, 3.2, 1.35)), (1, (0.8, -1.8, 1.5), (0, 3.2, 1.35))], n)
    return NB('room')


def nNoQuake(n):  # 南海トラフの地震は、まだ起きていない（回想：いつもどおりの東京の通り）
    day_light('#c8d8e8', 0.55)
    ground(size=1200, rgb=hexc('#a8a294'))
    skyline(n, cx=0, cy=40, nx=8, ny=2, pitch=40, hr=(20, 80), seed=293)
    plane((0, 0, 0.02), (1200, 10), ASPH)
    rnd = random.Random(294)
    street_walkers(n, rnd, k=22, y=(-8, -6), x=(-30, 30), speed=1.3, name='nq')
    for k in range(6):
        c = car_s((-60 + k * 20, -2 if k % 2 else 2, 0.02), rot_z=math.pi / 2 if k % 2 else -math.pi / 2, name=f'nc{k}')
        d = (-1 if k % 2 else 1) * 10 * n / FPS
        move(c, [(1, tuple(c.location)), (n, (c.location.x + d, c.location.y, 0.02))])
    tint_all('gray', 0.85)
    cam = camera(30)
    cam_path(cam, [(0, (-20, -26, 5), (0, 10, 3)), (1, (-14, -26, 5), (6, 10, 3))], n)
    return NB('city')


def nRiceCarts(n):  # それでも、ニュースを見た人たちが、米を買い込んだ（回想）
    rice_shelf(n, empty_f=(int(n * 0.1), n), people=6)
    tint_all('gray', 0.85)
    cam = camera(30)
    cam_path(cam, [(0, (-3, -4, 1.9), (0, 2, 0.9)), (1, (-2.4, -3.6, 1.8), (0, 2, 0.9))], n)
    return NB('room')


def nRiceBuy(n):  # 米を買う量は、いつもの年より、二割から四割も増えた（回想）
    rice_shelf(n, empty_f=(1, int(n * 0.8)), people=8, seed=295)
    for o in bpy.data.objects:
        if o.name.startswith('rice') and random.Random(o.name).random() < 0.4:
            o.scale = (0, 0, 0)
    tint_all('gray', 0.85)
    cam = camera(26)
    cam_path(cam, [(0, (3, -3.6, 2.4), (-1, 2, 0.9)), (1, (2.4, -3.2, 2.3), (-1, 2, 0.9))], n)
    return NB('room')


def nRiceEmpty(n):  # スーパーの米の棚は、空になった（回想）
    rice_shelf(n, empty_f=(1, int(n * 0.4)), people=0, seed=296)
    tint_all('gray', 0.85)
    cam = camera(30)
    cam_path(cam, [(0, (0, -3.2, 1.3), (0, 2, 1.0)), (1, (0, -2.8, 1.3), (0, 2, 1.0))], n)
    return NB('room')


def nAnxiety(n):  # あの夏、棚を空にしたのは、地震ではなく、ニュースを見た人たちの不安だった
    supermarket(n, fill=0.05, seed=297, people=5)
    cam = camera(26)
    cam_path(cam, [(0, (9, -8, 2.6), (-4, 2, 0.8)), (1, (8, -7.4, 2.5), (-4, 2, 0.8))], n)
    return NB('room')


# ---------------- SCENE 29 道を開く人たち（章28） ----------------
def yui_work(n, night=False, seed=301, cleared=0.7, sandbags=False):
    out = yui(n, buried=True, traffic=False, night=night, cleared=cleared, seed=seed)
    rnd = random.Random(seed)
    for k in range(4):
        r, up, boom, arm = excavator((-40 + k * 22, -6, 0), rot_z=math.pi * 0.95 + rnd.uniform(-0.2, 0.2), name=f'ex{k}')
        dig_cycle(up, boom, arm, n, seed=k)
    for k in range(3):
        d = dump_truck((-60 + k * 30, -12, 0), rot_z=math.pi / 2, name=f'dt{k}')
        if k == 1:
            move(d, [(1, tuple(d.location)), (n, (d.location.x - 6 * n / FPS, -12, 0))])
    if night:
        for k in range(5):
            x = -60 + k * 30
            box((x, -14, 4), (0.3, 0.3, 8), hexc('#5a5e64'))
            ball((x, -13.5, 8.2), 0.7, (1.0, 0.95, 0.8), seg=10, name='flood_lamp')
            c = cone((x, -9, 4.5), 6, 9, (1.0, 0.95, 0.8), rot=(0.9, 0, 0), verts=16)
            c.data.materials.clear(); c.data.materials.append(gmat((1.0, 0.95, 0.8), 0.12, 'lbeam'))
    for i in range(6):
        worker((rnd.uniform(-60, 40), rnd.uniform(-10, -4), 0), rnd, rot_z=rnd.uniform(0, 6.28), name=f'yw{i}')
    if sandbags:
        bags = [(x, -9 + rnd.uniform(-0.2, 0.2), 0.3 + h * 0.36, 0.9, 0.55, 0.34) for x in [-30 + k * 0.95 for k in range(50)] for h in range(3)]
        o = mbox(bags, hexc('#c8b890'), 'sandbags')
        rd = plane((0, -6, 0.05), (1, 4.5, 0), ASPH)
        rd.scale = (40, 1, 1)
        pv = empty((-30, 0, 0), 'rdpv'); rd.parent = pv; rd.location = (30, 0, 0)
        pv.scale = (0.02, 1, 1); pv.keyframe_insert('scale', frame=1)
        pv.scale = (1.0, 1, 1); pv.keyframe_insert('scale', frame=n)
        for i in range(6):
            p = worker((-28 + i * 3, -11, 0), rnd, rot_z=0, name=f'sb{i}')
            shovel_arms(p, n, seed=i)
    return out


def nTwoWeeks(n):  # 二週間後。由比の崩れた斜面の前には、重機が並んでいる
    yui_work(n)
    cam = camera(28)
    cam_path(cam, [(0, (-120, -90, 40), (0, 10, 6)), (1, (-110, -84, 37), (0, 10, 6))], n)
    return NB('city')


def nNightWork(n):  # 夜も明かりをつけ、昼も夜も、土を運び出す
    yui_work(n, night=True, seed=302)
    cam = camera(28)
    cam_path(cam, [(0, (-30, -50, 12), (-10, 0, 4)), (1, (-26, -48, 11.5), (-10, 0, 4))], n)
    return NB('night')


def nSandbags(n):  # 崩れた斜面の下では、土のうを積み上げ、車が一台通れるだけの仮の道を、少しずつ延ばしていく
    yui_work(n, seed=303, sandbags=True)
    cam = camera(28)
    cam_path(cam, [(0, (-40, -26, 7), (-14, -8, 1)), (1, (-36, -25, 6.6), (-10, -8, 1))], n)
    return NB('city')


def nSDFClear(n):  # 津波に襲われた港町では、自衛隊の車が、がれきと流されてきた車を押しのけ、救援の車が通れる道を一本ずつ開いていく
    yaizu_damaged(n, seed=304, dawn=False)
    rnd = random.Random(305)
    pile = rubble((0, 0, 0), k=90, spread=(4, 2.5), seed=5)
    cars = []
    for k in range(3):
        c = car_s((rnd.uniform(-3, 3), rnd.uniform(-1, 1), 0.3), rot_z=rnd.uniform(0, 3), name=f'sc{k}')
        c.rotation_euler.x = rnd.uniform(-0.3, 0.3); cars.append(c)
    d = bulldozer((-14, 0, 0), rot_z=-math.pi / 2, name='dozer')
    move(d, [(1, (-14, 0, 0)), (n, (-2, 0, 0))])
    for o in pile + cars:
        o.keyframe_insert('location', frame=int(n * 0.35))
        o.location.x += 9; o.keyframe_insert('location', frame=n)
    for k in range(2):
        sdf_truck((-30 - k * 12, 0.5, 0), rot_z=-math.pi / 2, name=f'st{k}')
    for i in range(4):
        soldier((-20 + i * 2.5, -3.5, 0), rnd, rot_z=rnd.uniform(-1, 1), name=f'sd{i}')
    cam = camera(28)
    cam_path(cam, [(0, (-24, -20, 7), (-4, 2, 1)), (1, (-20, -19, 6.6), (0, 2, 1))], n)
    return NB('city')


TOH_R = (138.9, 142.7, 37.3, 40.9)
TOH_K = 22.0


def nCombMap(n):  # 東日本大震災の時も、内陸の高速道路から海沿いの町へ、櫛の歯のように道を開き、四日で十五本の道を通した（回想・地図）
    Wm, Hm = map_size(TOH_R, TOH_K)
    path = map_tex('nk_map_toh', TOH_R, labels=[('仙台', 140.87, 38.27), ('盛岡', 141.15, 39.70)])
    img_plane(path, (0, 0, 0), Wm, Hm, name='map')
    plane((0, 0, -0.05), (Wm * 6, Hm * 6), (0.006, 0.016, 0.04))
    s = bpy.context.scene; sky(hexc('#0c1626')); s.view_settings.exposure = 0.35; no_shadow()
    def P(lo, la, z=0.4):
        return MP(lo, la, z, R=TOH_R, K=TOH_K)
    hw = [(140.45, 37.4), (140.6, 37.9), (140.8, 38.3), (140.95, 38.75), (141.1, 39.2), (141.15, 39.7), (141.2, 40.2), (141.3, 40.6)]
    mbar([(P(*hw[i]), P(*hw[i + 1]), 0.35) for i in range(len(hw) - 1)], hexc('#ffd060'), 'hw', segs=6)
    # 海岸（東から見て最初の陸）
    W = 2048; H = int(W * Hm / Wm); L = land_mask(TOH_R, W, H)
    def coast(la):
        y = int((TOH_R[3] - la) / (TOH_R[3] - TOH_R[2]) * H)
        for x in range(W - 1, 0, -2):
            if L.getpixel((x, y)) > 0:
                return TOH_R[0] + x / W * (TOH_R[1] - TOH_R[0])
        return 141.5
    lats = [37.6 + k * (40.4 - 37.6) / 14 for k in range(15)]
    for k, la in enumerate(lats):
        # 高速道路の経度（緯度で内挿）
        for i in range(len(hw) - 1):
            if hw[i][1] <= la <= hw[i + 1][1]:
                u = (la - hw[i][1]) / (hw[i + 1][1] - hw[i][1]); lo0 = hw[i][0] + (hw[i + 1][0] - hw[i][0]) * u
                break
        else:
            lo0 = 141.0
        tooth = mbar([(P(lo0, la), P(coast(la) - 0.02, la), 0.25)], hexc('#ff8a50'), f'tooth{k}', segs=6)
        appear(tooth, 6 + int(k * n * 0.6 / 15), grow=6)
    cam = camera(35)
    cam_path(cam, [(0, (0, -Hm * 0.55, Hm * 1.05), (0, 0, 0)), (1, (0, -Hm * 0.5, Hm * 0.98), (0, 2, 0))], n)
    tint_all('gray', 0.5)
    return NB('silent')


def damage_dots(n, k, f1, rgb, seed, coast_bias=False):
    japan_map(name='nk_map_t')
    rnd = random.Random(seed)
    pts = land_points(131.0, 140.0, 31.2, 36.5, k, seed=seed)
    G = 8
    for g in range(G):
        o = msph([(*MP(lo, la, 0.5), 0.18) for lo, la in pts[g::G]], rgb, 'dmg', sub=0)
        appear(o, 4 + int(g * f1 / G), grow=4)


def nRoads43k(n):  # 傷んだ道路は、日本中で、四万か所を超える（地図：模式）
    damage_dots(n, 700, int(n * 0.6), (1.0, 0.55, 0.2), 306)
    map_cam(n, (135.6, 33.4, 70), (135.6, 33.6, 64))
    return NB('silent')


def nRails19k(n):  # 傷んだ線路は、一万九千か所（地図：模式）
    damage_dots(n, 400, int(n * 0.6), (0.4, 0.8, 1.0), 307)
    map_cam(n, (135.6, 33.6, 64), (135.6, 33.8, 60))
    return NB('silent')


def nMudVolunteers(n):  # 家の泥をかき出す人の列
    yaizu_damaged(n, seed=308, dawn=False)
    rnd = random.Random(309)
    r, _ = j_house((0, 6, 0), rnd=rnd, name='mudh')
    box((0, 2.7, 0.5), (7, 0.05, 1.0), hexc('#6a5a44'))
    plane((0, -2, 0.03), (16, 6), hexc('#6a5a44'))
    mbox([(-6 + k * 1.3, -5.5, 0.25, 0.7, 0.5, 0.5) for k in range(10)], hexc('#c8b890'), 'bags')
    for i in range(7):
        p = crowd_person((-5 + i * 1.6, -1 + rnd.uniform(-0.6, 0.6), 0), rnd, rot_z=math.pi + rnd.uniform(-0.4, 0.4), name=f'mv{i}')
        shovel_arms(p, n, seed=i)
    cam = camera(30)
    cam_path(cam, [(0, (8, -14, 3.2), (-1, 0, 1)), (1, (6, -13, 3.0), (-2, 0, 1))], n)
    return NB('city')


def nSoupKitchen(n):  # 発電機の明かりの下で、温かい汁物を配る人
    night_light('#141a28', 0.25)
    ground(size=300, rgb=hexc('#5a5650'))
    box((0, 4, 2.6), (10, 6, 0.15), hexc('#f2f2ee'))
    for sx in (-5, 5):
        for sy in (1, 7):
            cyl((sx, sy, 1.3), 0.06, 2.6, hexc('#9a9a96'))
    box((0, 2.6, 0.85), (6, 1.0, 0.1), hexc('#d8d2c4'))
    cyl((-1.5, 2.6, 1.15), 0.4, 0.5, hexc('#9aa0a6'))
    msph([(-1.5 + RK.uniform(-0.2, 0.2), 2.6, 1.6 + k * 0.25, 0.18) for k in range(4)], (0.95, 0.95, 0.95), 'steam', sub=1)
    box((6.5, 4, 0.5), (1.2, 0.8, 1.0), hexc('#d9a441'))
    ball((0, 4, 2.4), 0.3, (1.0, 0.92, 0.7), seg=10, name='lamp')
    rnd = random.Random(311)
    for i in range(3):
        p = person((-2 + i * 1.6, 3.4, 0), hexc('#f08a2a'), skin=rnd.choice(SKIN[:3]), rot_z=math.pi, act='talk', name=f'sk{i}')
    for i in range(12):
        p = crowd_person((rnd.uniform(-0.4, 0.4), 1.4 - i * 0.9, 0), rnd, rot_z=math.pi, name=f'sq{i}')
        move(p, [(1, tuple(p.location)), (n, (p.location.x, p.location.y + 0.8, 0))])
    cam = camera(30)
    cam_path(cam, [(0, (7, -6, 2.4), (0, 2.5, 1.2)), (1, (6, -5.4, 2.3), (0, 2.5, 1.2))], n)
    return NB('night')


def nTownRepair(n):  # 町は、ひとつずつ、直されていく
    yaizu_damaged(n, seed=312, dawn=False)
    rnd = random.Random(313)
    r, up, boom, arm = excavator((-10, -2, 0), rot_z=0.3, name='tex')
    dig_cycle(up, boom, arm, n)
    for k in range(2):
        d = dump_truck((10 + k * 10, -1, 0), rot_z=math.pi / 2)
    for i in range(6):
        p = worker((rnd.uniform(-20, 20), rnd.uniform(-4, 2), 0), rnd, rot_z=rnd.uniform(0, 6.28), name=f'tr{i}')
        move(p, [(1, tuple(p.location)), (n, (p.location.x + rnd.uniform(-3, 3), p.location.y, 0))])
    cam = camera(26)
    cam_path(cam, [(0, (-50, -50, 30), (0, 10, 2)), (1, (-46, -46, 28), (4, 10, 2))], n)
    return NB('city')


# ---------------- SCENE 30 江戸時代の二回の津波（章29） ----------------
def edo_village(n, seed=321, wave=None, flood_z=None, dusk=False, frigate_=False, boats=True, crushed=False):
    """江戸の終わりの海沿いの村（模式）：茅葺きの家、木の舟、松。和紙のような色に"""
    if dusk:
        day_light('#c89a70', 0.3)
    else:
        day_light('#c8d0cc', 0.45)
    plane((0, 150, -0.6), (1200, 300), hexc('#4a7090'), name='sea')
    plane((0, 6, 0.0), (1200, 12), hexc('#d6c8a0'), name='beach')
    def hfn(x, y):
        return 0.0 if y > 0 else min(40.0, (-y) ** 1.25 * 0.08)
    terrain((800, 260), 50, hfn, hexc('#7a8a5a'), 'land', x0=-400, y0=-260)
    rnd = random.Random(seed)
    pine_row(-150, 150, 2, k=36, seed=seed)
    for i in range(-6, 7):
        for j in range(2):
            x = i * 13 + rnd.uniform(-2, 2); y = -14 - j * 14
            if crushed:
                flat_house((x, y, hfn(x, y)), rot_z=rnd.uniform(-0.3, 0.3), name=f'cr{i}{j}')
            else:
                thatched((x, y, hfn(x, y)), rot_z=rnd.uniform(-0.2, 0.2), name=f'mk{i}{j}')
    if boats:
        for k in range(5):
            b = empty((-40 + k * 18, 8, 0.2), 'woodboat')
            link(box((0, 0, 0.3), (6, 1.6, 0.6), hexc('#7a5a3a')), b)
            link(cone((3.4, 0, 0.3), 0.8, 1.4, hexc('#7a5a3a'), rot=(0, math.pi / 2, 0), verts=4), b)
    if wave:
        f0, f1, y0, y1, h = wave
        w = wave_wall(-500, 500, y0, h, c=hexc('#4a6a80'))
        move_y(w, [(1, y0), (max(2, f0), y0), (f1, y1)])
        linear(w, 'location')
    if flood_z:
        f0, f1, z0, z1 = flood_z
        flood((0, 0, 0), (1200, 600), z0, z1, f0, f1, c=hexc('#4a5a5a'))
    return hfn


def nEdoIntro(n):  # 南海トラフが二回続けて動いたのは、初めてではない（回想：江戸の村）
    edo_village(n)
    rnd = random.Random(322)
    for i in range(8):
        p = person((rnd.uniform(-30, 30), rnd.uniform(-10, -4), 0), rnd.choice([hexc('#4a5a7a'), hexc('#7a6a4a'), hexc('#5a4a3a')]),
                   pants=hexc('#3a3a3a'), skin=rnd.choice(SKIN[:3]), hair=hexc('#1a1a1a'), name=f'ev{i}')
        move(p, [(1, tuple(p.location)), (n, (p.location.x + rnd.uniform(-4, 4), p.location.y, 0))])
    tint_all('washi', 0.8)
    cam = camera(28)
    cam_path(cam, [(0, (-40, 60, 18), (0, -10, 2)), (1, (-34, 56, 17), (4, -12, 2))], n)
    return NB('sea')


def nEdoMorning(n):  # 江戸時代の終わり、ある冬の朝
    edo_village(n, seed=323)
    sky_keys([(1, hexc('#e8c8a0'))])
    tint_all('washi', 0.8)
    cam = camera(30)
    cam_path(cam, [(0, (60, 120, 30), (0, 0, 4)), (1, (54, 112, 28), (0, -4, 4))], n)
    return NB('sea')


def nKumanoWave(n):  # 東の半分が動き、熊野灘の海岸には、高さ二十メートルを超える津波が押し寄せた
    edo_village(n, seed=324, wave=(1, int(n * 0.7), 260, 2, 20.0), flood_z=(int(n * 0.6), n, -0.6, 10.0))
    tint_all('washi', 0.8)
    cam = camera(28)
    cam_path(cam, [(0, (-80, -60, 50), (0, 40, 6)), (1, (-74, -56, 48), (0, 30, 6))], n)
    return NB('sea', roar=[(1, n, 1.0)])


def nShimodaShip(n):  # 伊豆の下田の港では、停泊していた外国の軍艦が、波にもまれて大きく壊れ、やがて沈んだ（模式）
    day_light('#b8c0c0', 0.4)
    plane((0, 0, -0.6), (2000, 2000), hexc('#4a6a80'), name='sea')
    msph([(-160, 120, -10, 90, 1, 1, 0.5), (160, 140, -10, 100, 1, 1, 0.45)], hexc('#6a7a50'), 'cape', sub=3, smooth=True)
    f = frigate((0, 0, -0.5), rot_z=0.4)
    for k in range(0, n + 1, 12):
        u = k / max(1, n)
        f.location = (math.sin(k * 0.21) * 3, 0, -0.5 + 1.6 * math.sin(k * 0.17) - 4.5 * u * u)
        f.rotation_euler = (0.25 * math.sin(k * 0.13) + 0.35 * u, 0.12 * math.sin(k * 0.19), 0.4 + 0.5 * u)
        f.keyframe_insert('location', frame=k + 1); f.keyframe_insert('rotation_euler', frame=k + 1)
    flow_streaks(n, -60, 60, -60, 60, -0.5, dirv=(1, 0.4), speed=5, c=FOAM, k=140)
    tint_all('washi', 0.8)
    cam = camera(30)
    cam_path(cam, [(0, (-70, -80, 18), (0, 0, 8)), (1, (-64, -74, 16), (0, 0, 6))], n)
    return NB('sea', roar=[(1, n, 0.7)])


def nEdoEvening(n):  # その三十二時間後の夕方
    edo_village(n, seed=325, dusk=True)
    sun_disc(1.9, 0.06, R=900, r=26, c=(1.0, 0.6, 0.3))
    tint_all('washi', 0.6)
    cam = camera(30)
    cam_path(cam, [(0, (40, 80, 20), (-20, -10, 4)), (1, (36, 76, 19), (-20, -14, 4))], n)
    return NB('sea')


def nEdoMapWest(n):  # 今度は、西の半分が動く（地図）
    japan_map()
    zone('east', rgb=(0.6, 0.35, 0.3), a=0.3)
    zone('west', a=0.7, f0=int(n * 0.1), grow_dur=24)
    tint_all('washi', 0.5)
    map_cam(n, (134.4, 32.8, 76), (134.2, 33.0, 70))
    return NB('silent', rumble=[(int(n * 0.1), n, 0.5)])


def nKiiVillageWave(n):  # 紀伊の海沿いの村では、十メートルを超える津波が来た
    edo_village(n, seed=326, dusk=True, wave=(1, int(n * 0.7), 200, 2, 11.0), flood_z=(int(n * 0.6), n, -0.6, 5.0))
    tint_all('washi', 0.7)
    cam = camera(28)
    cam_path(cam, [(0, (60, -70, 40), (0, 30, 4)), (1, (56, -66, 38), (0, 20, 4))], n)
    return NB('sea', roar=[(1, n, 0.9)])


def inamura(n, rnd, k=8, y=-120, x0=-12, f0=1, man=True, hfn=None):
    """高台の田んぼの稲の束（稲むら）。小さな灯（橙の玉）が順に灯る：炎は描かず、目印の灯として"""
    z = hfn(0, y) if hfn else 0
    plane((x0 + 12, y, z + 0.05), (40, 20), hexc('#a8984a'))
    lights = []
    for i in range(k):
        x = x0 + i * 3.4; yy = y + rnd.uniform(-3, 3)
        cone((x, yy, z + 1.0), 1.0, 2.0, hexc('#c8a050'), verts=10)
        g = ball((x, yy, z + 2.3), 0.55, (1.0, 0.62, 0.22), a=0.9, seg=10, name='glow')
        appear(g, f0 + i * 10, grow=6)
        for f in range(f0 + i * 10, n + 6, 6):
            g.scale = (1.0 + 0.15 * ((f // 6) % 2),) * 3; g.keyframe_insert('scale', frame=f)
        lights.append(g)
    return lights


def nRiceFire(n):  # 暗くなった村で、一人の男が、高台の田んぼの稲の束に、火をつけた（小さな目印の灯）
    hfn = edo_village(n, seed=327, dusk=True)
    exposure_keys([(1, 0.05)]); sky(hexc('#2a2430'))
    rnd = random.Random(328)
    y = -120
    inamura(n, rnd, f0=int(n * 0.2), hfn=hfn)
    man = person((-14, y - 1.5, hfn(-14, y)), hexc('#4a3a2a'), pants=hexc('#3a2a1a'), hair=hexc('#1a1a1a'), name='man', rot_z=0.5)
    move(man, [(1, (-14, y - 1.5, hfn(-14, y))), (n, (14, y - 1.5, hfn(14, y)))])
    flashlight(man, 1, beam=1.2, a=0.3, rgb=(1.0, 0.6, 0.25))
    tint_all('washi', 0.5)
    cam = camera(32)
    cam_path(cam, [(0, (-16, y + 16, hfn(0, y + 16) + 4), (0, y, hfn(0, y) + 1.5)), (1, (-12, y + 13, hfn(0, y + 13) + 3.5), (4, y, hfn(0, y) + 1.5))], n)
    return NB('night')


def nVillagersClimb(n):  # 村の人は、その火を目印に、高台へ上った
    hfn = edo_village(n, seed=329, dusk=True)
    exposure_keys([(1, 0.05)]); sky(hexc('#2a2430'))
    rnd = random.Random(330)
    inamura(n, rnd, f0=1, hfn=hfn)
    for i in range(20):
        x = rnd.uniform(-20, 20); y = rnd.uniform(-40, -20)
        p = person((x, y, hfn(x, y)), rnd.choice([hexc('#4a5a7a'), hexc('#7a6a4a'), hexc('#5a4a3a')]), pants=hexc('#3a3a3a'),
                   skin=rnd.choice(SKIN[:3]), hair=hexc('#1a1a1a'), name=f'vc{i}')
        pts = []
        for k in range(6):
            yy = y + (-110 - y) * k / 5; xx = x * (1 - k / 7)
            pts.append((xx, yy, hfn(xx, yy)))
        run_to(p, pts, 1 + rnd.randint(0, 20), speed=rnd.uniform(1.8, 2.6))
    tint_all('washi', 0.5)
    cam = camera(28)
    cam_path(cam, [(0, (12, -30, hfn(0, -30) + 5), (0, -90, hfn(0, -90) + 2)), (1, (10, -38, hfn(0, -38) + 5), (0, -96, hfn(0, -96) + 2))], n)
    return NB('night')


def nHoeiIntro(n):  # さらに百五十年ほど前の、江戸時代の半ば
    edo_village(n, seed=331)
    tint_all('washi', 0.9)
    cam = camera(26)
    cam_path(cam, [(0, (0, 140, 40), (0, -20, 0)), (1, (0, 130, 38), (0, -30, 0))], n)
    return NB('sea')


def nTosaWave(n):  # 土佐の海岸を、二十五メートルを超える波が駆け上がり、六万軒近くの家がつぶれた（人は描かない）
    edo_village(n, seed=332, wave=(1, int(n * 0.5), 200, -30, 25.0), flood_z=(int(n * 0.35), int(n * 0.6), -0.6, 14.0), crushed=False)
    hs = [o for o in bpy.data.objects if o.name.startswith('mk')]
    rnd = random.Random(333)
    for r in hs:
        f = int(n * 0.45) + rnd.randint(0, 20)
        r.keyframe_insert('scale', frame=f)
        r.scale = (1.1, 1.1, 0.25); r.keyframe_insert('scale', frame=f + 8)
    tint_all('washi', 0.85)
    cam = camera(26)
    cam_path(cam, [(0, (-90, -90, 60), (0, 20, 4)), (1, (-84, -86, 58), (0, 10, 4))], n)
    return NB('sea', roar=[(1, n, 1.0)])


def nHighGround(n):  # 高い所へ（今の高台の避難所の明かり）
    kochi(n, lit=0.0, seed=334, dawn=True)
    rnd = random.Random(335)
    y = HILL_Y - 70
    for i in range(10):
        crowd_person((20 + rnd.uniform(-8, 8), y - 7 + rnd.uniform(-2, 1), slope_z(y - 7)), rnd, rot_z=math.pi + rnd.uniform(-1, 1), name=f'hg{i}')
    msph([(20 + k * 3 - 6, y - 5.1, slope_z(y) + 3.8, 0.4) for k in range(5)], (1.0, 0.86, 0.55), 'evlamp', sub=1)
    cam = camera(28)
    cam_path(cam, [(0, (-10, y + 50, slope_z(y + 50) + 30), (20, y, slope_z(y) + 2)), (1, (-6, y + 44, slope_z(y + 44) + 28), (20, y, slope_z(y) + 2))], n)
    return NB('night')


def nSameWay(n):  # 逃げ方は、昔から、変わっていない（昔の村人と今の人が、同じ坂を上る）
    hfn = edo_village(n, seed=336, dusk=True)
    rnd = random.Random(337)
    for i in range(12):
        x = rnd.uniform(-10, 10); y = rnd.uniform(-30, -20)
        p = crowd_person((x, y, hfn(x, y)), rnd, name=f'sw{i}') if i % 2 else \
            person((x, y, hfn(x, y)), hexc('#5a4a3a'), pants=hexc('#3a3a3a'), hair=hexc('#1a1a1a'), name=f'sw{i}')
        pts = [(x, y, hfn(x, y))] + [(x, y - k * 8, hfn(x, y - k * 8)) for k in range(1, 6)]
        run_to(p, pts, 1 + rnd.randint(0, 10), speed=1.8)
    tint_all('washi', 0.35)
    cam = camera(28)
    cam_path(cam, [(0, (20, 0, 10), (0, -50, 10)), (1, (18, -6, 12), (0, -56, 12))], n)
    return NB('sea')


# ---------------- SCENE 31 一か月後（章30） ----------------
def nMonthLater(n):  # 一か月後
    yui(n, buried=True, traffic=False, cleared=0.2, seed=341)
    cam = camera(26)
    cam_path(cam, [(0, (-220, -260, 120), (0, 30, 10)), (1, (-200, -250, 110), (20, 30, 10))], n)
    return NB('sea')


def nTomeiOpen(n):  # 由比の土砂が取り除かれ、東名高速の一部の車線が、通れるようになる
    out = yui(n, buried=True, traffic=False, cleared=0.15, seed=342)
    mbox([(0, -8, 7.5, 400, 0.6, 1.0)], hexc('#f08a2a'), 'cones')
    rnd = random.Random(343)
    for i in range(3):
        worker((rnd.uniform(-20, 20), -9, 7.4), rnd, rot_z=rnd.uniform(0, 6.28), name=f'tw{i}')
    cam = camera(28)
    cam_path(cam, [(0, (-60, -40, 20), (0, 0, 7)), (1, (-54, -36, 19), (6, 0, 7))], n)
    return NB('city')


def nTrucksFirst(n):  # 最初に走るのは、水と食べ物を積んだ、トラックの列
    out = yui(n, buried=True, traffic=False, cleared=0.15, seed=344)
    for k in range(10):
        t = truck((-100 - k * 14, -8, 7.45), rot_z=-math.pi / 2, c=hexc('#f2f2ee'), cargo=hexc('#9fd0f0') if k % 2 else hexc('#e8c070'))
        move(t, [(1, tuple(t.location)), (n, (t.location.x + 12 * n / FPS, -8, 7.45))])
    cam = camera(30)
    cam_path(cam, [(0, (-40, -30, 12), (-90, -8, 8)), (1, (-20, -30, 12), (-60, -8, 8))], n)
    return NB('city')


def nFreightMoves(n):  # 止まっていた貨物列車も、ゆっくりと、動き出す
    trs = freight_yard(n, k=3, seed=345)
    tr = trs[1]
    x0 = tr.location.x
    tr.keyframe_insert('location', index=0, frame=1)
    for k in range(1, 9):
        u = k / 8
        tr.location.x = x0 + 30 * u * u; tr.keyframe_insert('location', index=0, frame=1 + int((n - 1) * u))
    cam = camera(30)
    cam_path(cam, [(0, (60, -30, 6), (140, -5, 2)), (1, (70, -30, 6), (160, -5, 2))], n)
    return NB('city')


def nShelvesRefill(n):  # 東京の棚に、少しずつ、荷物が戻ってくる
    supermarket(n, fill=0.08, seed=346, refill=(int(n * 0.1), int(n * 0.8)))
    rnd = random.Random(347)
    p = worker((-5, -2.4, 0), rnd, rot_z=math.pi, vest=hexc('#3a8a5a'), name='clerk')
    box((-5.6, -2.0, 0.5), (0.6, 0.8, 1.0), hexc('#c9a26a'))
    cam = camera(28)
    cam_path(cam, [(0, (-1, -8, 1.8), (-5, -2, 0.9)), (1, (-1.6, -7.4, 1.75), (-5, -2, 0.9))], n)
    return NB('room')


def nSurvey(n):  # 高台の空き地で、仮設住宅を建てるための測量が始まる
    day_light('#b8cfe4', 0.5)
    ground(size=600, rgb=hexc('#8aa060'))
    far_hills(y=-260, c=hexc('#7a9070'))
    rnd = random.Random(348)
    tri = empty((0, 0, 0), 'tripod')
    for a in (0, 2.1, 4.2):
        link(cyl((math.sin(a) * 0.25, math.cos(a) * 0.25, 0.7), 0.025, 1.45, hexc('#d0b060'), rot=(math.cos(a) * 0.18, -math.sin(a) * 0.18, 0)), tri)
    link(box((0, 0, 1.5), (0.22, 0.3, 0.22), hexc('#f2c14e')), tri)
    p = worker((0, -0.7, 0), rnd, rot_z=0, name='sv')
    q = worker((12, 18, 0), rnd, rot_z=math.pi * 0.8, name='pole')
    link(box((0.3, -0.1, 1.8), (0.06, 0.06, 3.0), hexc('#e8e8e2')), O[q['rig']])
    mbox([(x, y, 0.4, 0.05, 0.05, 0.8) for x in range(-12, 13, 6) for y in (6, 18)], hexc('#e05090'), 'stakes')
    mbar([((-12, 6, 0.6), (12, 6, 0.6), 0.015), ((-12, 18, 0.6), (12, 18, 0.6), 0.015)], hexc('#f2f2ee'), 'tape')
    cam = camera(30)
    cam_path(cam, [(0, (-8, -10, 3), (4, 10, 1)), (1, (-6, -10, 2.9), (6, 10, 1))], n)
    return NB('day')


def nFirstFamily(n):  # 体育館の避難所から、仮設住宅へ、最初の家族が移っていく
    day_light('#c8d8e8', 0.5)
    ground(size=400, rgb=hexc('#b8a888'))
    box((0, 20, 5), (40, 18, 10), hexc('#e2ddd2'))
    box((0, 10.95, 1.4), (3, 0.1, 2.8), hexc('#5a6a7a'))
    mbox([(x, -40 - j * 9, 1.4, 9, 5, 2.8) for x in range(-30, 31, 12) for j in range(2)], hexc('#e6e8ea'), 'kasetsu')
    mbox([(x, -40 - j * 9, 2.9, 9.4, 5.4, 0.2) for x in range(-30, 31, 12) for j in range(2)], hexc('#7a8a96'), 'kroof')
    rnd = random.Random(349)
    fam = []
    for i, (s, c) in enumerate(((1.0, hexc('#3d5a80')), (1.0, hexc('#c46a4a')), (0.6, hexc('#f0c040')), (0.5, hexc('#6aa86a')))):
        p = person((-1 + i * 0.8, 9, 0), c, skin=SKIN[1], s=s, name=f'fam{i}')
        if s == 1.0:
            box((0.3, -0.1, 0.6), (0.35, 0.25, 0.45), hexc('#4a5a7a')).parent = O[p['rig']]
        move(p, [(1, (-1 + i * 0.8, 9, 0)), (n, (-1 + i * 0.8 + 2, 9 - 1.2 * n / FPS, 0))])
        fam.append(p)
    for i in range(6):
        p = crowd_person((rnd.uniform(-6, 6), 12 + rnd.uniform(0, 2), 0), rnd, rot_z=rnd.uniform(-0.5, 0.5), name=f'see{i}')
        if i % 2:
            wave_hand(p, n, 1, period=20)
    cam = camera(28)
    cam_path(cam, [(0, (10, -6, 3), (0, 8, 1.2)), (1, (9, -8, 3), (0, 2, 1.2))], n)
    return NB('day')


# ---------------- エンドカード（章31） ----------------
def nEnd(n):  # 高台から見る、夕暮れの海沿いの町
    H = kochi(n, lit=0.3, seed=351)
    day_light('#e8a878', 0.3)
    sky_keys([(1, hexc('#e8a878')), (n, hexc('#a87890'))])
    sun_disc(1.57, 0.05, R=900, r=30, c=(1.0, 0.62, 0.3))
    y = HILL_Y - 70
    cam = camera(30)
    cam_path(cam, [(0, (0, y, slope_z(y) + 6), (0, 60, 0)), (1, (0, y + 4, slope_z(y + 4) + 6), (0, 70, 2))], n)
    return NB('sea')
