"""カット：SCENE 01〜11（章0〜10）：焼津の正午／地図／高い所へ／2分後の海／黒い水／タワーの上／新宿四十階／エレベーター／新幹線／滑走路／名古屋の地下街"""
from nk import *
from nk import _obj, _font

QY = 26.0


def town_cam(n, a, b, lens=30):
    cam = camera(lens)
    cam_path(cam, [(0, a[0], a[1]), (1, b[0], b[1])], n)
    return cam


# ---------------- SCENE 01 焼津の港町、正午（章0） ----------------
def yaizu(n, seed=1, walkers=10, lunch=True, **kw):
    day_light('#a9c8e4', 0.5)
    H = harbor_town(n, seed=seed, **kw)
    rnd = random.Random(seed + 5)
    if lunch:
        H['people'] += lunch_people(H, n, rnd)
    if walkers:
        H['people'] += street_walkers(n, rnd, k=walkers, x=(-30, 30))
    return H


def nPortNoon(n):  # 平日の昼十二時。焼津の港町（海から港と商店街を見る）
    yaizu(n)
    town_cam(n, ((24, 82, 26), (0, 8, 2)), ((14, 70, 21), (0, 10, 2)), lens=32)
    return NB('sea')


def quay_close(n, phones=False, f_ring=None, seed=7):
    """岸壁で弁当を広げる人たち（寄り）。phones=True でスマホが赤く光る"""
    H = yaizu(n, walkers=4, lunch=False, boats=False)
    for k, x in enumerate((-40, 30)):
        bob_rock(fishing_boat((x, QY + 14, SEA_Z + 0.3), name=f'fb{k}'), n, amp=0.06, rot=0.02, seed=k)
    rnd = random.Random(seed)
    ps = []
    for i in range(6):
        x = -6 + i * 2.3 + rnd.uniform(-0.3, 0.3); y = QY - 2.3 + rnd.uniform(-0.3, 0.3)
        p = crowd_person((x, y, 0.02), rnd, rot_z=math.pi + rnd.uniform(-0.5, 0.5), pose='sit', name=f'q{i}',
                         act='phone' if phones else 'talk')
        rig = O[p['rig']]
        box((x, y - 0.4, 0.05), (0.36, 0.24, 0.08), hexc('#e8d6b0'))
        if phones:
            ph = link(box((0.16, -0.32, 0.98), (0.08, 0.02, 0.15), hexc('#202226')), rig)
            on = link(box((0.16, -0.335, 0.98), (0.07, 0.01, 0.13), (1.0, 0.15, 0.1)), rig)
            off = link(box((0.16, -0.334, 0.98), (0.07, 0.01, 0.13), (1.0, 0.95, 0.9)), rig)
            if f_ring:
                appear(on, f_ring + i, grow=1); appear(off, f_ring + i, grow=1)
            blink(on, n, 6, phase=0); blink(off, n, 6, phase=1)
        ps.append(p)
    return H, ps


def nBento(n):  # 漁港では、昼休みの人たちが弁当を広げている
    quay_close(n)
    cam = camera(38)
    cam_path(cam, [(0, (-1, QY + 5.5, 1.5), (1, QY - 2.4, 0.8)), (1, (1.5, QY + 4.6, 1.4), (1.5, QY - 2.4, 0.8))], n)
    return NB('sea')


def nPhones(n):  # その時、スマホが一斉に鳴り出す
    quay_close(n, phones=True, f_ring=6)
    cam = camera(45)
    cam_path(cam, [(0, (2.5, QY + 3.2, 1.4), (2.5, QY - 2.4, 0.95)), (1, (2.3, QY + 2.6, 1.3), (2.4, QY - 2.4, 0.95))], n)
    return NB('sea', alert=[6])


def street_quake(n, f_jolt=12, crouch_at=None, seed=3, k=14, signs_fall=None, walls_fall=None, windows=None, dust_at=None):
    """商店街の揺れ。crouch_at：立っている人が地面にはいつくばるフレーム"""
    H = yaizu(n, walkers=0, lunch=False, seed=seed)
    rnd = random.Random(seed)
    for i in range(k):
        x = rnd.uniform(-22, 22); y = rnd.uniform(-2.4, 2.4)
        st = crowd_person((x, y, 0), rnd, rot_z=rnd.uniform(-3, 3), name=f'st{i}')
        if crouch_at is not None:
            f = crouch_at + rnd.randint(-4, 10)
            if f > 1:
                jitter(st, f_jolt, f, amp=0.12, seed=i)
                visible(st, None, f)
                cr = crouch_person((x, y, 0), rnd, rot_z=rnd.uniform(-3, 3), name=f'cr{i}')
                visible(cr, f, None)
            else:
                visible(st, None, 2)
                crouch_person((x, y, 0), rnd, rot_z=rnd.uniform(-3, 3), name=f'cr{i}')
    if signs_fall is not None:
        for j, sg in enumerate(H['signs']):
            if rnd.random() < 0.55:
                drop(sg, signs_fall + rnd.randint(0, 40), 0.25, dur=9, spin=(1.45, rnd.uniform(-0.3, 0.3), rnd.uniform(-0.6, 0.6)))
    if walls_fall is not None:
        for j in range(3):
            x = -14 + j * 13
            p = block_wall((x, -3.3, 0), 5.5, rot_z=math.pi, name=f'bwf{j}')
            tip(p, walls_fall + j * 9, axis=0, ang=math.pi / 2 * 0.96, dur=10)
    if windows is not None:
        for j, wi in enumerate(H['wins'][:60]):
            if rnd.random() < 0.35:
                vanish(wi, windows + rnd.randint(0, 30))
    return H


def nJolt(n):  # 数秒後、地面が下から突き上げられる
    f = int(n * 0.18)
    street_quake(n, f_jolt=f, crouch_at=None, seed=3)
    cam = town_cam(n, ((-30, -1.5, 3.2), (0, 0.5, 2.2)), ((-27, -1.5, 3.0), (2, 0.5, 2.0)), lens=28)
    shake(cam, f, n + 1, amp=0.35, rot=0.03, seed=1, ramp=3)
    # 突き上げ：一瞬上へ
    return NB('city', rumble=[(f, n, 1.0)], crash=[(f, 1.0)])


def nCrawl(n):  # 立っていられない。人は地面にはいつくばる
    street_quake(n, f_jolt=1, crouch_at=int(n * 0.25), seed=4, k=12)
    cam = town_cam(n, ((7, -2.8, 1.6), (-4, 1, 0.5)), ((6, -2.6, 1.5), (-5, 1, 0.5)), lens=26)
    shake(cam, 1, n + 1, amp=0.25, rot=0.025, seed=2, ramp=2)
    return NB('city', rumble=[(1, n, 1.0)])


def nSignsFall(n):  # 商店街の看板が落ち、ブロック塀が道に倒れ込む
    street_quake(n, f_jolt=1, crouch_at=1, seed=5, k=8, signs_fall=8, walls_fall=int(n * 0.45))
    cam = town_cam(n, ((-24, -1, 7), (0, 0, 3.5)), ((-20, -1.5, 6.5), (2, -1, 3)), lens=26)
    shake(cam, 1, n + 1, amp=0.22, rot=0.02, seed=3, ramp=2)
    return NB('city', rumble=[(1, n, 1.0)], crash=[(int(n * 0.45), 0.8), (14, 0.5)])


def nGlass(n):  # 家の窓ガラスが割れて飛び散る
    day_light('#a9c8e4', 0.5)
    ground(size=300, rgb=hexc('#bdb6a6'))
    plane((0, -3, 0.015), (80, 6), ASPH)
    rnd = random.Random(8)
    hs = []
    for k in range(3):
        r, wins = j_house((-9 + k * 9, 4, 0), w=7.5, d=6.5, rot_z=0, rnd=rnd, name=f'gh{k}')
        hs.append(r)
        for j, wi in enumerate(wins):
            f = int(n * 0.15) + rnd.randint(0, int(n * 0.5))
            vanish(wi, f)
            # 窓の位置（家のローカル → 世界）
            c = Vector((-9 + k * 9, 4, 0)) + Vector((-7.5 / 4 + (j % 2) * 7.5 / 2, -3.3, 1.5 + (j // 2) * 2.8))
            shards(n, tuple(c), f, k=14, seed=j + k * 7, spread=(1.2, 3.0))
            box(tuple(c + Vector((0, 0.06, 0))), (1.6, 0.04, 1.15), hexc('#2a2e34'))
        jitter(r, 1, n, amp=0.06, rot=0.01, seed=k)
    cr = crouch_person((2, -3, 0), rnd, rot_z=0.3, name='gcr')
    cam = town_cam(n, ((3, -16, 3.2), (0, 3, 3)), ((2, -14, 3.0), (0, 3, 3)), lens=30)
    shake(cam, 1, n + 1, amp=0.18, rot=0.018, seed=4, ramp=2)
    return NB('city', rumble=[(1, n, 0.9)], crash=[(int(n * 0.15), 0.6), (int(n * 0.4), 0.5)])


def nShakeLong(n):  # 揺れは、一分たっても止まらない
    H = street_quake(n, f_jolt=1, crouch_at=1, seed=6, k=16)
    for k in range(4):
        dust(n, (-20 + k * 12, -3, 0), 4 + k * 10, k=6, seed=k)
    rubble((-10, -3.5, 0), k=20, spread=(3, 1), seed=2)
    cam = town_cam(n, ((40, -1, 13), (0, 0, 0)), ((36, -1, 12), (-2, 0, 0)), lens=30)
    shake(cam, 1, n + 1, amp=0.3, rot=0.012, seed=5, ramp=2)
    return NB('city', rumble=[(1, n, 0.9)])


# ---------------- SCENE 02 南海トラフ（章1） ----------------
def nMapQuake(n):  # 南海トラフで、巨大地震が起きた
    japan_map(sea_labels=[('駿河湾', 138.45, 34.55), ('日向灘', 131.75, 31.7)])
    zone('all', f0=int(n * 0.25), grow_dur=30)
    pulse_rings(MP(137.2, 33.7), n, int(n * 0.35), period=28, r1=16, a=0.22)
    map_cam(n, (135.4, 33.0, 80), (135.4, 33.3, 70))
    return NB('silent', rumble=[(int(n * 0.3), n, 0.5)])


def nMapTrough(n):  # 静岡の駿河湾から宮崎の沖まで、海の底に続く長い溝
    japan_map(sea_labels=[('駿河湾', 138.45, 34.55), ('日向灘', 131.75, 31.7)])
    trough_line(f0=int(n * 0.12), dur=int(n * 0.55))
    map_text('南海トラフ', 134.6, 31.9, size=4.5, rgb=(1, 0.55, 0.5), f=int(n * 0.65))
    map_cam(n, (135.2, 32.4, 80), (135.0, 32.6, 74))
    return NB('silent')


def nMapM91(n):  # マグニチュード9.1
    japan_map()
    zone('all')
    trough_line()
    pulse_rings(MP(137.2, 33.7), n, 4, period=22, r1=16, a=0.2)
    pulse_rings(MP(134.0, 33.0), n, 14, period=22, r1=16, a=0.2)
    cam = map_cam(n, (135.0, 32.6, 92), (135.0, 32.8, 86))
    shake(cam, 1, n, amp=0.25, rot=0.004, seed=2)
    return NB('silent', rumble=[(1, n, 0.6)])


def nMapShindo(n):  # 静岡から宮崎までの海沿いの町を、震度7の揺れが襲う
    japan_map()
    zone('all', a=0.3)
    shindo_coast(f0=int(n * 0.1), dur=int(n * 0.5))
    map_text('震度7', 134.6, 32.4, size=4.5, rgb=(1, 0.4, 0.35), f=int(n * 0.55))
    map_cam(n, (135.0, 33.1, 78), (135.0, 33.3, 72))
    return NB('silent', rumble=[(1, n, 0.4)])


def old_house(loc, name='oh', rot_z=0.0):
    """古い木の家（1階と2階・瓦屋根）：1階がつぶれる支点つき。戻り値：(root, 2階の空, 1階の空)"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    g = empty((0, 0, 0), 'g1'); link(g, root)
    wood = hexc('#6a4a32'); plaster = hexc('#e6dcc6')
    link(box((0, 0, 1.4), (8, 6.5, 2.8), plaster), g)
    for x in (-3.9, -1.3, 1.3, 3.9):
        link(box((x, -3.26, 1.4), (0.22, 0.08, 2.8), wood), g)
    link(box((0, -3.28, 1.2), (2.2, 0.06, 2.0), hexc('#4a3a2a')), g)
    up = empty((0, 0, 2.8), 'g2'); link(up, root)
    link(box((0, 0, 0.12), (8.8, 7.2, 0.24), TILE), up)
    link(box((0, 0.3, 1.4), (7.2, 5.6, 2.6), plaster), up)
    for x in (-3.5, 0, 3.5):
        link(box((x, -2.51, 1.4), (0.22, 0.08, 2.6), wood), up)
    link(box((-1.8, -2.52, 1.6), (1.6, 0.05, 1.0), hexc('#8a9aa6')), up)
    link(roof((0, 0.3, 2.7), 8.2, 6.6, 2.2, TILE, rot_z=math.pi / 2), up)
    return root, up, g


def nOldHouse(n):  # 古い木の家は、柱が折れ、傾き、崩れ落ちる（中の人は映さない）
    day_light('#b8cbe0', 0.45)
    ground(size=200, rgb=hexc('#b9b1a0'))
    plane((0, -6, 0.01), (60, 5), ASPH)
    rnd = random.Random(2)
    r, up, g = old_house((0, 0, 0))
    for k, x in enumerate((-13, 13)):
        j_house((x, 1, 0), rnd=rnd, name=f'nb{k}')
    f1 = int(n * 0.3); f2 = int(n * 0.55)
    jitter(r, 1, n, amp=0.08, rot=0.015, seed=1)
    # 傾く
    r.keyframe_insert('rotation_euler', frame=f1)
    r.rotation_euler.y = 0.12; r.keyframe_insert('rotation_euler', frame=f2)
    # 1階がつぶれる
    g.keyframe_insert('scale', frame=1); g.keyframe_insert('scale', frame=f2)
    g.scale = (1.0, 1.0, 0.12); g.keyframe_insert('scale', frame=f2 + 8)
    up.keyframe_insert('location', frame=1); up.keyframe_insert('location', frame=f2)
    up.location.z = 0.45; up.keyframe_insert('location', frame=f2 + 8)
    up.keyframe_insert('rotation_euler', frame=f2)
    up.rotation_euler = (0.05, -0.1, 0.03); up.keyframe_insert('rotation_euler', frame=f2 + 8)
    dust(n, (0, -2, 0.5), f2 + 4, k=12, r=(0.8, 1.8), seed=3)
    cam = town_cam(n, ((-9, -19, 3.5), (0, 0, 3)), ((-7, -17, 3.2), (0, 0, 2.6)), lens=30)
    shake(cam, 1, n + 1, amp=0.12, rot=0.01, seed=6, ramp=2)
    return NB('city', rumble=[(1, n, 0.8)], crash=[(f2, 1.0)])


# ---------------- SCENE 03 高い所へ（章2） ----------------
TWX, TWY = 0.0, -27.0  # 避難タワーの位置（商店街の奥・海から離れた側）


def yaizu_tower(n, seed=11, lit=None, **kw):
    H = yaizu(n, walkers=0, lunch=False, seed=seed, **kw)
    root, pts = evac_tower((TWX, TWY, 0), h=10, rot_z=0)
    H['tower'] = root; H['stairs'] = [tuple(Vector(p) + Vector((TWX, TWY, 0))) for p in pts]
    return H


def runners(n, rnd, k, area, target, f0=1, f1=None, speed=(2.8, 3.6), name='rn', elder=False):
    """area=(x0, x1, y0, y1) から target=(x, y) へ走る人"""
    out = []
    for i in range(k):
        x = rnd.uniform(area[0], area[1]); y = rnd.uniform(area[2], area[3])
        p = crowd_person((x, y, 0), rnd, rot_z=0, name=f'{name}{i}')
        tx = target[0] + rnd.uniform(-3, 3); ty = target[1] + rnd.uniform(-2, 2)
        run_to(p, [(x, y, 0), (tx, ty, 0)], f0 + rnd.randint(0, 10), speed=rnd.uniform(*speed))
        out.append(p)
    return out


def nRunOut(n):  # 揺れが弱まった瞬間、町の人が一斉に走り出す
    H = yaizu_tower(n)
    rnd = random.Random(21)
    for i in range(26):
        x = rnd.uniform(-26, 26); y = rnd.uniform(-3, 3)
        p = crowd_person((x, y, 0), rnd, name=f'rn{i}')
        run_to(p, [(x, y, 0), (rnd.uniform(-2, 2), -1.5, 0), (rnd.uniform(-8, 0), -16, 0)], int(n * 0.12) + rnd.randint(0, 12), speed=rnd.uniform(2.8, 3.6))
    for k in range(6):
        dust(n, (-20 + k * 8, -2, 0), 1, k=3, seed=k, life=60)
    rubble((-10, -3.5, 0), k=20, spread=(3, 1), seed=2)
    cam = town_cam(n, ((22, 2.5, 3.2), (0, -2, 1.5)), ((19, 2.5, 3.0), (0, -6, 1.5)), lens=26)
    shake(cam, 1, int(n * 0.25), amp=0.12, rot=0.01, seed=7, ramp=2)
    return NB('city', rumble=[(1, int(n * 0.25), 0.4)], speaker=[(int(n * 0.4), n)])


def speaker_pole(loc, h=11.0):
    root = empty(loc, 'spk')
    link(cyl((0, 0, h / 2), 0.2, h, hexc('#9a9a96')), root)
    for a in (0, 2.1, 4.2):
        hn = cone((0, 0, 0), 0.5, 1.1, hexc('#e8e8e2'), verts=14, rot=(math.pi / 2, 0, 0))
        link(hn, root); hn.location = (math.sin(a) * 0.6, -math.cos(a) * 0.6, h - 0.8); hn.rotation_euler = (math.pi / 2 + 0.2, 0, a)
    return root


def sound_rings(center, n, f0, period=18, r1=9.0, rgb=(1.0, 0.85, 0.4), a=0.35, rot=(math.pi / 2, 0, 0)):
    out = []
    for i in range((n - f0) // period + 1):
        o = cyl(center, 1.0, 0.04, rgb, verts=40, rot=rot)
        o.data.materials.clear(); o.data.materials.append(gmat(rgb, a, 'sring'))
        f = f0 + i * period
        o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=max(2, f))
        o.scale = (r1, r1, 1); o.keyframe_insert('scale', frame=f + period * 2)
        o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=f + period * 2 + 1)
        linear(o, 'scale')
        out.append(o)
    return out


def nSpeaker(n):  # 防災無線が、大津波警報を叫ぶように繰り返す。高い所へ、逃げてください
    H = yaizu_tower(n, seed=12)
    sp = speaker_pole((6, 3.0, 0))
    for a in (0, 2.1, 4.2):
        sound_rings((6 + math.sin(a) * 1.6, 3.0 - math.cos(a) * 1.6, 10.2), n, 4 + int(a * 3), period=20, r1=5, a=0.16, rot=(math.pi / 2, 0, a))
    rnd = random.Random(22)
    runners(n, rnd, 18, (-30, 20, -3, 3), (0, -1.5), f0=1)
    cam = town_cam(n, ((-8, -2.5, 1.6), (6, 3.0, 8)), ((-7, -2.5, 1.5), (6, 3.0, 9)), lens=26)
    return NB('city', speaker=[(1, n)])


def nElderHand(n):  # お年寄りの手を引く人
    yaizu_tower(n, seed=13)
    rnd = random.Random(23)
    y = -1.0
    a = person((-14, y, 0), hexc('#4a6b4a'), skin=SKIN[1], name='helper')
    e = person((-14.6, y + 0.7, 0), hexc('#b8a890'), pants=hexc('#5a5048'), hair=hexc('#d8d8d4'), skin=SKIN[0], s=0.92, name='elder')
    run_to(a, [(-14, y, 0), (16, y, 0)], 1, speed=1.7)
    run_to(e, [(-14.6, y + 0.7, 0), (15.4, y + 0.7, 0)], 1, speed=1.7)
    arm_to(a, 1, (0.45, 0.45, 0.9)); arm_to(e, 0, (-0.45, -0.3, 0.9))
    runners(n, rnd, 10, (-24, 0, -3, 3), (30, -2), f0=1, speed=(2.8, 3.4))
    cam = camera(34)
    xe = -14 + 1.7 * n / FPS
    cam_path(cam, [(0, (-12, 3.3, 1.8), (-13, y, 1.0)), (1, (xe + 2, 3.3, 1.8), (xe + 1, y, 1.0))], n)
    return NB('city', speaker=[(1, n)])


def nChildCarry(n):  # 子どもを抱えて走る人
    yaizu_tower(n, seed=14)
    rnd = random.Random(24)
    a = person((-10, 1.0, 0), hexc('#c46a4a'), skin=SKIN[2], name='parent')
    kid = person((0, 0, 0), hexc('#f0c040'), pants=hexc('#5a7aa8'), s=0.45, pose='sit', name='kid')
    kid.parent = O[a['rig']]; kid.location = (0, -0.3, 0.95); kid.rotation_euler = (0, 0, math.pi)
    arm_to(a, 0, (0.05, -0.35, 1.05)); arm_to(a, 0, (-0.05, -0.35, 1.2))
    run_to(a, [(-10, 1.0, 0), (24, 0.0, 0)], 1, speed=3.4)
    runners(n, rnd, 12, (-24, 0, -3, 3), (34, -2), f0=1)
    cam = camera(32)
    xe = min(24, -10 + 3.4 * n / FPS)
    cam_path(cam, [(0, (-6, -3.2, 1.5), (-8, 1, 1.1)), (1, (xe + 4, -3.2, 1.6), (xe + 2, 0.5, 1.1))], n)
    return NB('city', speaker=[(1, n)])


def tower_crowd(n, H, rnd, k=22, f0=1, top=8):
    """避難タワーの階段へ殺到する人。top 人は最初から上にいる"""
    S = H['stairs']
    out = []
    for i in range(k):
        x = TWX - 10 + rnd.uniform(-6, 2); y = TWY - 12 + rnd.uniform(-8, 3)
        p = crowd_person((x, y, 0), rnd, name=f'tc{i}')
        path = [(x, y, 0), S[0]] + S[1:]
        idx = min(len(path) - 1, 2 + i // 5)
        run_to(p, path[:idx + 1], f0 + i * 4, speed=rnd.uniform(1.6, 2.6))
        out.append(p)
    for i in range(top):
        p = crowd_person((TWX + rnd.uniform(-3.5, 3.5), TWY + rnd.uniform(-2.5, 2.5), 10.2), rnd, rot_z=rnd.uniform(0, 6.28), name=f'top{i}')
        out.append(p)
    return out


def nTowerRush(n):  # 避難タワーの階段に、人が殺到する
    H = yaizu_tower(n, seed=15)
    rnd = random.Random(25)
    tower_crowd(n, H, rnd, k=26)
    cam = town_cam(n, ((TWX - 9, TWY + 14, 4.5), (TWX - 3, TWY - 2, 5)), ((TWX - 8, TWY + 13, 5.5), (TWX - 2, TWY - 1, 6)), lens=26)
    return NB('city', speaker=[(1, n)])


def nNoTime(n):  # もう、時間がない（タワーの上から、海の方を見る）
    H = yaizu_tower(n, seed=16)
    rnd = random.Random(26)
    tower_crowd(n, H, rnd, k=14, top=12)
    cam = town_cam(n, ((TWX + 2, TWY - 6, 13.5), (0, 60, 0)), ((TWX + 2, TWY - 4, 13.2), (0, 70, 2)), lens=26)
    return NB('sea', speaker=[(1, n)])


# ---------------- SCENE 04 2分後の海（章3） ----------------
def tower_top_people(n, rnd, k=14, face=0.0, z=10.2):
    out = []
    for i in range(k):
        p = crowd_person((TWX + rnd.uniform(-3.8, 3.8), TWY + rnd.uniform(-1.0, 2.8), z), rnd, rot_z=math.pi + face + rnd.uniform(-0.4, 0.4), name=f'tt{i}')
        out.append(p)
    return out


def sea_view(n, wave=None, seed=31):
    """タワーの上から沖を見る。wave=(f0, f1, 高さ, 色) で白い盛り上がりが近づく"""
    H = yaizu_tower(n, seed=seed)
    rnd = random.Random(seed)
    tower_top_people(n, rnd)
    if wave:
        f0, f1, h, c = wave
        w = wave_wall(-300, 300, 300, h, c=c)
        move_y(w, [(1, 300), (max(2, f0), 300), (f1, 90)])
        linear(w, 'location')
    return H


def nSeaView(n):  # 地震から、二分（タワーの上の人たちが沖を見る）
    sea_view(n)
    town_cam(n, ((TWX + 1, TWY - 7, 12.6), (TWX, 60, 6)), ((TWX + 1, TWY - 6.5, 12.6), (TWX, 80, 6)), lens=30)
    return NB('sea', speaker=[(1, n)])


def nWhiteSwell(n):  # 沖の海面が、白く盛り上がって見える。津波です
    sea_view(n, wave=(int(n * 0.1), n, 6.0, hexc('#9cb8c8')))
    town_cam(n, ((TWX - 1, TWY + 3, 12.6), (0, 300, 2)), ((TWX - 1, TWY + 3, 12.6), (0, 260, 2)), lens=55)
    return NB('sea', roar=[(int(n * 0.3), n, 0.4)])


def nQuayOver(n):  # 最初の波が、港の岸壁を越える
    H = yaizu(n, walkers=0, lunch=False, seed=33)
    for b in H['boats']:
        b.animation_data_clear()
    f0 = int(n * 0.2)
    w = wave_wall(-200, 200, QY + 60, 3.5, c=hexc('#5f8aa6'))
    move_y(w, [(1, QY + 60), (f0, QY + 20), (int(n * 0.5), QY - 2)])
    linear(w, 'location')
    fl = flood((0, QY - 60, 0), (400, 120), -0.5, 1.6, int(n * 0.45), n, c=hexc('#56788f'), a=0.95)
    seaw = water((0, QY + 150, 0), (600, 300), 0.0, 2.6, f0, int(n * 0.5), c=hexc('#56788f'), a=1.0)
    for b in H['boats']:
        drift(b, n, int(n * 0.4), (0, -14, 0), z=2.2, spin=0.4, seed=int(b.location.x))
    flow_streaks(n, -60, 60, -40, QY + 10, 1.6, dirv=(0, -1), speed=4)
    cam = town_cam(n, ((TWX - 2, TWY + 3, 13.5), (0, QY + 8, 0)), ((TWX - 2, TWY + 3, 13.5), (0, QY, 0)), lens=32)
    return NB('sea', roar=[(f0, n, 0.7)])


def nBoatCarry(n):  # 漁船が波に持ち上げられ、町の中へ運ばれていく
    day_light('#a9c8e4', 0.5)
    H = harbor_town(n, seed=34, boats=False)
    b = fishing_boat((-2, QY + 4, 1.0), rot_z=0.2, name='cboat')
    b2 = fishing_boat((14, QY + 7, 1.0), rot_z=-0.3, name='cboat2')
    drift(b, n, 4, (6, -38, 0), z=3.0, spin=0.9, seed=1, ease_in=30)
    drift(b2, n, 10, (-4, -30, 0), z=3.0, spin=-0.7, seed=2, ease_in=30)
    flood((0, 0, 0), (400, 200), 1.0, 3.2, 1, n, c=hexc('#5d7d90'), a=0.96)
    flow_streaks(n, -40, 40, -30, QY + 20, 3.2, dirv=(0, -1), speed=5, c=hexc('#dfe8ea'))
    debris_field(n, -30, 30, -10, QY, 3.1, speed=4.5, k=60)
    cam = town_cam(n, ((-34, -16, 24), (0, 10, 0)), ((-30, -20, 22), (2, -4, 0)), lens=30)
    return NB('sea', roar=[(1, n, 0.8)])


# ---------------- SCENE 05 黒い水（章4） ----------------
def nWave2(n):  # 五分後。次の波は、もっと高く、もっと速く来る
    H = yaizu(n, walkers=0, lunch=False, seed=41, boats=False)
    flood((0, 0, 0), (600, 600), 0.6, 1.4, 1, n, c=hexc('#5d6a6a'), a=0.95)
    w = wave_wall(-300, 300, 200, 11.0, c=hexc('#4a5250'))
    move_y(w, [(1, 200), (n, 35)])
    linear(w, 'location')
    cam = town_cam(n, ((TWX - 1, TWY + 3, 13.0), (0, 200, 5)), ((TWX - 1, TWY + 3, 12.8), (0, 120, 6)), lens=30)
    return NB('sea', roar=[(1, n, 1.0)])


def levee_set(n, seed=42):
    day_light('#9aaab8', 0.4)
    ground(size=500, rgb=hexc('#b5ad9c'))
    box((0, 0, 3.0), (400, 4.0, 6.0), hexc('#b4b0a6'))  # 堤防（y=0、海は +y）
    plane((0, 150, 0.5), (500, 300), hexc('#4d5652'))
    rnd = random.Random(seed)
    hs = []
    for i in range(-5, 6):
        for j in range(2):
            r, w = j_house((i * 11 + rnd.uniform(-1, 1), -14 - j * 12, 0), rnd=rnd, name=f'lh{i}_{j}')
            hs.append(r)
    plane((0, -6, 0.02), (400, 5), ASPH)
    return hs


def nLeveeOver(n):  # 黒い水が、堤防を乗り越え、町に流れ込む
    hs = levee_set(n)
    f0 = int(n * 0.15)
    seaw = water((0, 150, 0), (500, 300), 0.5, 8.5, 1, f0 + 30, c=BLACKW, a=1.0)
    w = wave_wall(-200, 200, 30, 8.0, c=BLACKW)
    move_y(w, [(1, 30), (f0, 2)])
    linear(w, 'location')
    sg = surge_mesh(-200, 200, -2, 2, 7.0)
    sg.location.z = 0.0; sg.scale = (1, 1, 0)
    sg.keyframe_insert('scale', frame=1); sg.keyframe_insert('scale', frame=f0)
    sg.keyframe_insert('location', frame=f0)
    sg.scale = (1, 1, 1); sg.location.y = -40; sg.keyframe_insert('scale', frame=n); sg.keyframe_insert('location', frame=n)
    linear(sg)
    flood((0, -60, 0), (500, 120), 0.0, 4.0, f0, n, c=BLACKW)
    flow_streaks(n, -60, 60, -60, 0, 4.0, dirv=(0, -1), speed=7)
    cam = town_cam(n, ((-40, -48, 16), (0, 0, 4)), ((-34, -44, 15), (2, -4, 3)), lens=30)
    return NB('sea', roar=[(1, n, 1.0)])


def black_street(n, z=2.2, seed=43, cars=6, houses_drift=False):
    day_light('#8f9ba6', 0.38)
    H = harbor_town(n, seed=seed, boats=False)
    fl = flood((0, 0, 0), (600, 600), z, z + 0.3, 1, n, c=BLACKW)
    flow_streaks(n, -50, 50, -60, 30, z + 0.3, dirv=(1, 0), speed=6)
    debris_field(n, -40, 40, -30, 25, z + 0.25, dirv=(1, 0), speed=5, k=120)
    return H


def nBlackClose(n):  # 海の青い水ではない。泥と、壊れた家の破片を巻き込んだ黒い水
    black_street(n, z=1.5)
    cam = town_cam(n, ((-14, -0.5, 5.5), (4, 0, 1.4)), ((-12, -0.5, 5.2), (6, 0, 1.4)), lens=28)
    return NB('sea', roar=[(1, n, 1.0)])


def nCarsFloat(n):  # 車が、木の葉のように浮かび、流されていく
    black_street(n, z=1.7, seed=44)
    rnd = random.Random(45)
    for k in range(7):
        c = car_s((rnd.uniform(-30, 0), rnd.uniform(-2.5, 2.5), 0), rot_z=rnd.uniform(0, 6.28), name=f'fc{k}')
        drift(c, n, rnd.randint(1, 20), (rnd.uniform(18, 26), rnd.uniform(-0.8, 0.8), 0), z=1.1, spin=rnd.uniform(-2, 2), seed=k)
    cam = town_cam(n, ((28, -1, 9), (0, 0, 1)), ((26, -1, 8.5), (4, 0, 1)), lens=30)
    return NB('sea', roar=[(1, n, 1.0)])


def nHouseSwept(n):  # 家が、土台ごと押し流され、隣の家にぶつかって崩れる
    day_light('#8f9ba6', 0.38)
    ground(size=400, rgb=hexc('#b5ad9c'))
    rnd = random.Random(46)
    a, _ = j_house((-6, 8, 0), rnd=rnd, name='swept')
    b, _ = j_house((2, -8, 0), rnd=rnd, name='hit')
    for k in range(4):
        j_house((-24 + k * 16, -24, 0), rnd=rnd, name=f'bg{k}')
    flood((0, 0, 0), (400, 400), 2.0, 2.6, 1, n, c=BLACKW)
    flow_streaks(n, -40, 40, -40, 40, 2.6, dirv=(0, -1), speed=6)
    debris_field(n, -30, 30, -10, 30, 2.5, speed=5, k=80)
    fc = int(n * 0.45)
    a.keyframe_insert('location', frame=1)
    a.location = (-2, 0.5, 0.6); a.rotation_euler.z = 0.35; a.keyframe_insert('location', frame=fc); a.keyframe_insert('rotation_euler', frame=fc)
    a.location = (2, -3.0, 0.2); a.rotation_euler = (0.1, -0.08, 0.6); a.keyframe_insert('location', frame=n); a.keyframe_insert('rotation_euler', frame=n)
    a.rotation_euler = (0, 0, 0); a.keyframe_insert('rotation_euler', frame=1)
    b.keyframe_insert('rotation_euler', frame=fc)
    b.rotation_euler = (-0.35, 0.18, 0.1); b.keyframe_insert('rotation_euler', frame=fc + 14)
    b.keyframe_insert('location', frame=fc)
    b.location.z = -1.8; b.keyframe_insert('location', frame=fc + 16)
    dust(n, (0, -4, 2.5), fc, k=10, c=hexc('#8a8470'), seed=7)
    cam = town_cam(n, ((-22, -20, 10), (0, 0, 2)), ((-20, -22, 9.5), (1, -2, 2)), lens=30)
    return NB('sea', roar=[(1, n, 1.0)], crash=[(fc, 1.0)])


def nRoofsUnder(n):  # 水は、あっという間に、二階建ての家の屋根を越えていく
    day_light('#8f9ba6', 0.38)
    H = harbor_town(n, seed=47, boats=False, shops=False)
    fl = flood((0, 0, 0), (600, 600), 2.0, 9.0, 1, int(n * 0.8), c=BLACKW)
    flow_streaks(n, -80, 80, -80, 40, 0.3, dirv=(0, -1), speed=6)
    for o in [o for o in bpy.data.objects if o.name.startswith('streak')]:
        o.parent = fl
    debris_field(n, -60, 60, -60, 30, 0.3, speed=5, k=120)
    for o in [o for o in bpy.data.objects if o.name.startswith('debris')]:
        o.parent = fl
    root, pts = evac_tower((TWX, TWY, 0), h=10)
    tower_top_people(n, random.Random(4), k=12)
    cam = town_cam(n, ((-50, -80, 28), (0, -20, 4)), ((-44, -76, 26), (4, -24, 4)), lens=30)
    return NB('sea', roar=[(1, n, 0.9)])


# ---------------- SCENE 06 タワーの上（章5） ----------------
def flood_town(n, z=7.5, seed=51, roofs=24, drift_roofs=True):
    day_light('#8f9ba6', 0.36)
    ground(size=800, rgb=hexc('#6a6658'))
    fl = flood((0, 0, 0), (800, 800), z, z + 0.2, 1, n, c=BLACKW)
    flow_streaks(n, -80, 80, -120, 60, z + 0.2, dirv=(0.3, -1), speed=5)
    debris_field(n, -70, 70, -100, 40, z + 0.15, dirv=(0.3, -1), speed=4.5, k=140)
    rnd = random.Random(seed)
    rs = []
    for k in range(roofs):
        r = roof_only((rnd.uniform(-90, 90), rnd.uniform(-160, 40), z + 0.4), rot_z=rnd.uniform(0, 6.28), name=f'ro{k}')
        if drift_roofs:
            drift(r, n, 1, (rnd.uniform(4, 10), -rnd.uniform(14, 26), 0), z=z + 0.3, spin=rnd.uniform(-0.8, 0.8), seed=k)
        rs.append(r)
    root, pts = evac_tower((TWX, TWY, 0), h=10)
    return rs


def nTowerFlow(n):  # 避難タワーの足元を、ごうごうと音を立てて水が流れていく
    flood_town(n, z=7.2)
    tower_top_people(n, random.Random(5), k=12)
    cam = town_cam(n, ((TWX - 14, TWY - 12, 9.0), (TWX, TWY, 8)), ((TWX - 12, TWY - 13, 8.8), (TWX, TWY, 8.5)), lens=26)
    return NB('sea', roar=[(1, n, 1.0)])


def nTowerTop(n):  # タワーの上の人は、動けない
    flood_town(n, z=7.2)
    rnd = random.Random(6)
    ps = tower_top_people(n, rnd, k=16, face=0.4)
    for p in ps[::4]:
        hand_chest(p, 1)
    cam = town_cam(n, ((TWX - 3, TWY - 7, 12.4), (TWX + 1, TWY + 1, 11.0)), ((TWX - 2, TWY - 6.4, 12.2), (TWX + 1, TWY + 1, 11.0)), lens=30)
    return NB('sea', roar=[(1, n, 0.8)])


def nHomeDrift(n):  # 流されていく自分の家を、見ているしかない
    flood_town(n, z=7.2, roofs=30)
    rnd = random.Random(7)
    ps = tower_top_people(n, rnd, k=8, face=math.pi)
    cam = town_cam(n, ((TWX - 2, TWY + 4.5, 12.6), (TWX - 10, TWY - 60, 6)), ((TWX - 2, TWY + 4.5, 12.6), (TWX - 6, TWY - 70, 6)), lens=30)
    return NB('sea', roar=[(1, n, 0.8)])


def nRoofWaver(n):  # 遠くの家の屋根の上で、助けを求めて手を振る人
    flood_town(n, z=7.2, roofs=18, drift_roofs=False)
    r = roof_only((TWX - 30, TWY - 50, 7.6), rot_z=0.3, name='waveroof')
    p = person((TWX - 30, TWY - 50, 9.3), hexc('#c46a4a'), skin=SKIN[1], name='waver')
    wave_hand(p, n, 1); wave_hand(p, n, 0, period=16)
    cam = town_cam(n, ((TWX - 1, TWY - 4, 12.4), (TWX - 30, TWY - 50, 9)), ((TWX - 1, TWY - 4, 12.4), (TWX - 30, TWY - 50, 9.2)), lens=110)
    return NB('sea', roar=[(1, n, 0.7)])


def nNoReach(n):  # けれど、誰も、そこへは行けない
    flood_town(n, z=7.2, roofs=18, drift_roofs=False)
    rnd = random.Random(8)
    tower_top_people(n, rnd, k=12, face=2.5)
    r = roof_only((TWX - 30, TWY - 50, 7.6), rot_z=0.3, name='waveroof')
    p = person((TWX - 30, TWY - 50, 9.3), hexc('#c46a4a'), skin=SKIN[1], name='waver')
    wave_hand(p, n, 1)
    cam = town_cam(n, ((TWX + 24, TWY + 18, 22), (TWX - 14, TWY - 26, 6)), ((TWX + 20, TWY + 14, 20), (TWX - 14, TWY - 28, 6)), lens=28)
    return NB('sea', roar=[(1, n, 0.7)])


# ---------------- SCENE 07 新宿、四十階（章6） ----------------
def shinjuku(n, sway=None, seed=61):
    """新宿のような高層ビル群（地上から見上げる・遠景）。sway=(f0, amp) なら高い数棟がしなる"""
    day_light('#b7cfe6', 0.5)
    ground(size=1200, rgb=hexc('#9a9690'))
    rnd = random.Random(seed)
    js_all = []
    for k, (x, y, h) in enumerate([(-30, 40, 200), (10, 60, 230), (50, 30, 180), (-70, 80, 160), (90, 90, 210), (30, 120, 190)]):
        root, js = bend_tower((x, y, 0), 34, 34, h, rnd.choice([hexc('#c9ced3'), hexc('#aeb8c2'), hexc('#d8d4cc')]), hexc('#6f8aa0'), segs=10, seed=k)
        if sway:
            sway_tower(js, n, sway[0], n + 200, amp=sway[1], period=rnd.randint(110, 140), phase=k)
        js_all.append(js)
    skyline(n, cx=0, cy=320, nx=8, ny=3, pitch=60, hr=(30, 120), seed=seed)
    for i in range(-8, 9):
        tree((i * 12, -20, 0), s=1.3)
    return js_all


def nShinjuku(n):  # 同じころ、東京。新宿の高層ビル
    shinjuku(n)
    cam = camera(26)
    cam_path(cam, [(0, (-20, -120, 3), (10, 60, 120)), (1, (-14, -110, 3), (10, 60, 140))], n)
    return NB('city')


def office(n, sway_f0=None, amp=0.35, people=True, crouch=False, seed=62, chairs=False, shelves_fall=None, copier=None, neighbor=False):
    H = office_floor(n, seed=seed)
    rnd = random.Random(seed)
    fl = H['floor']
    # 窓の外：街と隣のビル
    below(lambda: skyline(n, cx=0, cy=-420, nx=8, ny=4, pitch=70, hr=(40, 220), seed=seed + 1), -150)
    ground(size=2000, rgb=hexc('#8a8a86')).location.z = -150
    if neighbor:
        root, js = bend_tower((10, -80, -150), 34, 34, 250, hexc('#aeb8c2'), hexc('#6f8aa0'), segs=12, seed=3)
        sway_tower(js, n, sway_f0 or 1, n + 300, amp=0.006, period=120)
    ps = []
    if people:
        for i in range(4):
            for j in range(2):
                for k in (-1, 1):
                    if rnd.random() < 0.55:
                        x = -9 + i * 6 + k * 1.0; y = -2 + j * 5 - 1.1
                        if crouch:
                            p = crouch_person((x + rnd.uniform(-0.3, 0.3), y + 1.6, 0), rnd, rot_z=rnd.uniform(0, 6.28), name=f'oc{i}{j}{k}')
                        else:
                            p = crowd_person((x, y, 0.0), rnd, rot_z=math.pi, pose='sit', name=f'ow{i}{j}{k}', act='type')
                        p.parent = fl
                        ps.append(p)
    if sway_f0 is not None:
        sway_floor(fl, n, sway_f0, n + 400, amp=amp, period=110)
    if chairs:
        for c in H['chairs']:
            dx = rnd.uniform(1.5, 3.2) * rnd.choice([-1, 1])
            slide(c, n, (sway_f0 or 1) + rnd.randint(0, 20), [(30, dx * 0.4, rnd.uniform(-0.6, 0.6)), (60, -dx * 0.2, rnd.uniform(-0.8, 0.8)), (100, dx, rnd.uniform(-1, 1)),
                                                              (150, dx * 0.3, rnd.uniform(-1.2, 1.2)), (200, dx * 1.3, rnd.uniform(-1.4, 1.4))])
            c.keyframe_insert('rotation_euler', frame=1); c.rotation_euler.z = rnd.uniform(-1.5, 1.5); c.keyframe_insert('rotation_euler', frame=200)
    if shelves_fall is not None:
        for k, p in enumerate(H['shelves']):
            tip(p, shelves_fall + k * 14, axis=0, ang=-1.45, dur=12)
    if copier is not None:
        slide(H['copier'], n, copier, [(40, -2.0, -1.2), (80, -0.8, -2.4), (120, -3.4, -3.6), (170, -1.6, -5.0)])
    return H


def office_cam(n, a, b, lens=26):
    cam = camera(lens)
    cam_path(cam, [(0, a[0], a[1]), (1, b[0], b[1])], n)
    cam.data.clip_end = 3000
    return cam


def nOffice40(n):  # 新宿の高層ビル、四十階のオフィス
    office(n)
    office_cam(n, ((-11, 7, 2.4), (3, -4, 1.0)), ((-10, 6, 2.3), (4, -4, 1.0)))
    return NB('room')


def nFloorSway(n):  # 床が、ゆっくりと、大きく、左右に動き始める
    office(n, sway_f0=int(n * 0.15), chairs=True)
    office_cam(n, ((-11, 7, 2.2), (3, -4, 0.9)), ((-11, 7, 2.2), (3, -4, 0.9)))
    return NB('room', rumble=[(int(n * 0.15), n, 0.35)])


def section_set(n, sway_f0=None, amp=0.03, focus='low'):
    """断面（模式）：地面（地層）・低い家・高層ビル。地面はほとんど動かず、上の階だけが大きく揺れる"""
    s = bpy.context.scene
    sky(hexc('#dfe6ec')); s.view_settings.exposure = 0.5; no_shadow()
    gnd = box((0, 0, -10), (400, 40, 20), hexc('#8a7a64'))
    box((0, 0, -0.2), (400, 40, 0.4), hexc('#9a9690'))
    for k in range(4):
        box((0, -20.1, -3 - k * 4), (400, 0.2, 0.3), hexc('#6a5a48'))
    root, js = bend_tower((10, 0, 0), 30, 30, 180, hexc('#c9ced3'), hexc('#6f8aa0'), segs=14)
    h1 = j_house((-60, 0, 0), w=10, d=8, h=7)[0]
    tower((-110, 0, 0), 20, 20, 30, hexc('#d8d4cc'))
    if sway_f0 is not None:
        sway_tower(js, n, sway_f0, n + 400, amp=amp, period=120)
        jitter(h1, sway_f0, n, amp=0.04, seed=3)
    return js


def nSectionGround(n):  # 震源から遠い東京の地面は、それほど揺れない（断面・模式）
    section_set(n, sway_f0=1, amp=0.004)
    cam = camera(30)
    cam_path(cam, [(0, (-40, -260, 40), (-30, 0, 30)), (1, (-40, -240, 30), (-40, 0, 20))], n)
    return NB('silent', rumble=[(1, n, 0.2)])


def nSectionSway(n):  # 高いビルの上の階だけが、船のように揺れ続ける（断面・模式）
    section_set(n, sway_f0=1, amp=0.03)
    cam = camera(30)
    cam_path(cam, [(0, (-30, -300, 90), (0, 0, 90)), (1, (-20, -320, 120), (10, 0, 120))], n)
    return NB('silent', rumble=[(1, n, 0.3)])


def nChairs(n):  # キャスター付きの椅子が、床を滑っていく
    office(n, sway_f0=1, chairs=True, seed=63, people=False)
    office_cam(n, ((-2, -5, 0.9), (-6, 2, 0.4)), ((-1, -5.5, 0.9), (-6, 3, 0.4)), lens=24)
    return NB('room', rumble=[(1, n, 0.35)])


def nCopier(n):  # 棚が倒れ、コピー機が床を走る
    office(n, sway_f0=1, shelves_fall=int(n * 0.12), copier=int(n * 0.2), seed=64, chairs=True, crouch=True)
    office_cam(n, ((-2, -2, 2.0), (3, 7, 0.8)), ((-1.5, -2.5, 1.9), (4, 6, 0.8)), lens=24)
    return NB('room', rumble=[(1, n, 0.35)], crash=[(int(n * 0.12) + 10, 0.6), (int(n * 0.12) + 24, 0.5)])


def nNeighbor(n):  # 窓の外では、隣のビルも、同じように、ゆっくりとしなっている
    office(n, sway_f0=1, amp=0.25, neighbor=True, people=False, seed=65)
    office_cam(n, ((-1, -5.5, 1.6), (10, -80, 0)), ((-1, -5.5, 1.6), (10, -80, 20)), lens=24)
    return NB('room', rumble=[(1, n, 0.3)])


def nSwayLong(n):  # 揺れは、五分たっても止まらない（机の下にかがむ人）
    office(n, sway_f0=1, crouch=True, chairs=True, shelves_fall=1, seed=66)
    office_cam(n, ((11, 7, 2.6), (-3, -4, 0.6)), ((10, 6.5, 2.5), (-3, -4, 0.6)))
    return NB('room', rumble=[(1, n, 0.3)])


# ---------------- SCENE 08 止まったエレベーター（章7） ----------------
def shafts_cut(n, stop_f=None, seed=71):
    """ビルの断面：エレベーターのかごが上下し、一斉に止まる（模式）"""
    s = bpy.context.scene
    sky(hexc('#7f8b98')); s.view_settings.exposure = 0.3; no_shadow()
    box((0, 0, -0.2), (200, 40, 0.4), hexc('#9a9690'))
    H = 120
    shell = box((0, 0, H / 2), (40, 20, H), hexc('#aeb8c2'), name='shell')
    shell.data.materials.clear(); shell.data.materials.append(gmat(hexc('#aeb8c2'), 0.18, 'shell'))
    mbox([(0, 10, fl, 40, 0.3, 0.15) for fl in range(0, int(H), 4)], hexc('#e8ecef'), 'flr')
    rnd = random.Random(seed)
    cars = []
    for k in range(6):
        x = -12.5 + k * 5
        box((x, 0, H / 2), (3.6, 3.6, H), hexc('#4a5260'))
        c = box((0, 0, 0), (3.0, 3.0, 3.2), hexc('#f2c14e'))
        o = empty((x, -1.9, rnd.uniform(10, 100)), f'el{k}'); c.parent = o
        z0 = o.location.z; v = rnd.choice([-1, 1]) * rnd.uniform(4, 7)
        o.keyframe_insert('location', index=2, frame=1)
        f_stop = stop_f + rnd.randint(-3, 3) if stop_f else n
        o.location.z = z0 + v * f_stop / FPS; o.keyframe_insert('location', index=2, frame=f_stop)
        linear(o, 'location')
        lamp = ball((x, -3.6, o.location.z + 2.0), 0.35, (1.0, 0.2, 0.15), seg=10, name='elamp')
        appear(lamp, f_stop + 2)
        blink(lamp, n, 8)
        cars.append(o)
    return cars


def nElevShafts(n):  # 東京の高いビルのエレベーターは、一斉に止まる
    shafts_cut(n, stop_f=int(n * 0.45))
    cam = camera(28)
    cam_path(cam, [(0, (-30, -150, 60), (0, 0, 58)), (1, (-24, -140, 62), (0, 0, 60))], n)
    return NB('silent', crash=[(int(n * 0.45), 0.4)])


def elevator_inside(n, seed=72, dim=False, press=False):
    s = bpy.context.scene
    sky(hexc('#101014')); s.view_settings.exposure = 0.1 if dim else 0.35; no_shadow()
    light_dir((0.1, -0.2, 0.95))
    box((0, 0, -0.1), (2.2, 2.0, 0.2), hexc('#6a645c'))
    box((0, 1.0, 1.3), (2.2, 0.08, 2.6), hexc('#b8b4aa'))
    box((-1.1, 0, 1.3), (0.08, 2.0, 2.6), hexc('#c8c4ba'))
    box((1.1, 0, 1.3), (0.08, 2.0, 2.6), hexc('#c8c4ba'))
    box((0, 0, 2.62), (2.2, 2.0, 0.08), hexc('#efe8d0') if not dim else hexc('#6a665a'))
    box((-0.45, -1.0, 1.15), (1.0, 0.06, 2.3), hexc('#9aa0a6')); box((0.55, -1.0, 1.15), (1.0, 0.06, 2.3), hexc('#9aa0a6'))
    box((1.04, -0.6, 1.2), (0.04, 0.3, 0.6), hexc('#2a2e34'))
    btn = ball((1.02, -0.6, 1.0), 0.04, (1.0, 0.2, 0.15), seg=10, name='btn')
    blink(btn, n, 10)
    rnd = random.Random(seed)
    ps = []
    for i, (x, y) in enumerate([(-0.55, 0.5), (0.2, 0.55), (-0.4, -0.25), (0.6, 0.0)]):
        p = crowd_person((x, y, 0), rnd, rot_z=rnd.uniform(-0.8, 0.8) + (math.pi * 0.0), name=f'ep{i}', act='phone' if i == 1 else None)
        ps.append(p)
    if press:
        p = ps[3]
        p.rotation_euler.z = -math.pi / 2
        arm_to(p, 1, (0.0, -0.55, 1.05))
    return ps


def nElevInside(n):  # 止まったエレベーターの中に、閉じ込められた人がいる
    elevator_inside(n, dim=True)
    cam = camera(20)
    cam_path(cam, [(0, (0.1, -0.85, 2.45), (-0.1, 0.6, 1.0)), (1, (0.1, -0.85, 2.45), (0.0, 0.6, 0.9))], n)
    return NB('room')


def nElevButton(n):  # 非常ボタンを押しても、なかなか助けは来ない
    elevator_inside(n, dim=True, press=True, seed=73)
    cam = camera(30)
    cam_path(cam, [(0, (-0.6, -0.8, 1.6), (1.0, -0.6, 1.0)), (1, (-0.5, -0.85, 1.55), (1.0, -0.6, 1.0))], n)
    return NB('room')


def nCityElev(n):  # 同じ時に、あちこちのビルで、同じことが起きている
    day_light('#b7cfe6', 0.45)
    ground(size=3000, rgb=hexc('#9a9690'))
    skyline(n, cx=0, cy=0, nx=9, ny=9, pitch=55, hr=(40, 200), seed=74)
    rnd = random.Random(75)
    for k in range(40):
        o = ball((rnd.uniform(-220, 220), rnd.uniform(-220, 220), rnd.uniform(60, 180)), 2.2, (1.0, 0.2, 0.15), seg=10, name='alarm')
        appear(o, rnd.randint(2, int(n * 0.6)))
    cam = camera(30)
    cam_path(cam, [(0, (-300, -420, 260), (0, 0, 40)), (1, (-260, -400, 240), (0, 0, 40))], n)
    return NB('city')


def stairwell(n, k=24, seed=76, crowd=False, floors=4):
    """非常階段（折り返し）を下りる人。手前の壁は外す"""
    s = bpy.context.scene
    sky(hexc('#d8d6d0')); s.view_settings.exposure = 0.4; no_shadow()
    fh = 3.6; L = 5.0
    box((0, 2.4, floors * fh / 2), (11, 0.2, floors * fh + 2), hexc('#d6d2c8'))
    for f in range(floors):
        z0 = f * fh
        for side, (ya, za, yb, zb) in enumerate([(-1.0, z0, -1.0, z0 + fh / 2), (1.0, z0 + fh / 2, 1.0, z0 + fh)]):
            x0, x1 = (-L / 2, L / 2) if side == 0 else (L / 2, -L / 2)
            ang = math.atan2(fh / 2, L)
            cx = 0; cz = (za + zb) / 2
            box((cx, ya, cz), (math.hypot(L, fh / 2), 1.8, 0.2), hexc('#a8a49a'), rot=(0, -ang if side == 0 else ang, 0))
            mbar([((x0, ya - 0.95, za + 0.9), (x1, ya - 0.95, zb + 0.9), 0.03)], hexc('#5a5e64'), 'rail')
        box((L / 2 + 1.2, 0, z0 + fh / 2), (2.4, 4.0, 0.2), hexc('#a8a49a'))
        box((-L / 2 - 1.2, 0, z0), (2.4, 4.0, 0.2), hexc('#a8a49a'))
    rnd = random.Random(seed)
    ps = []
    for i in range(k):
        f = rnd.randrange(floors)
        side = rnd.randrange(2); u = rnd.uniform(0, 1)
        z0 = f * fh + (fh / 2 if side else 0)
        x = (L / 2 - u * L) if side else (-L / 2 + u * L)
        y = 1.0 if side else -1.0
        z = z0 + (u * fh / 2 if not side else u * fh / 2)
        # 下りる：side 0（-L/2→L/2 で上る）なら x が減る向きへ
        p = crowd_person((x, y + rnd.uniform(-0.4, 0.4), z), rnd, name=f'sp{i}')
        sp = 0.5 if crowd else 1.0
        dx = (-1 if side == 0 else 1) * sp * n / FPS * 0.5
        dz = -abs(dx) * (fh / 2) / L
        move(p, [(1, (x, p.location.y, z)), (n, (x + dx, p.location.y, z + dz))])
        ps.append(p)
    return ps


def nStairs(n):  # 外に出るには、階段しかない
    stairwell(n, k=14, seed=77)
    cam = camera(24)
    cam_path(cam, [(0, (-1, -8, 9), (0, 0, 6)), (1, (0, -8, 7), (0, 0, 5))], n)
    return NB('room')


def nStairsCrowd(n):  # 四十階のオフィスから、高層マンションから、人が階段に押し寄せる
    stairwell(n, k=46, seed=78, crowd=True)
    cam = camera(26)
    cam_path(cam, [(0, (3, -6, 5.5), (-1, 0, 4)), (1, (2, -6.5, 5.0), (-1, 0, 3.4))], n)
    return NB('room')


def nLeftBehind(n):  # 階段を下りられないお年寄りや、赤ちゃんを抱えた家族は、上の階に取り残される
    s = bpy.context.scene
    sky(hexc('#b7cfe6')); s.view_settings.exposure = 0.45; no_shadow()
    wc = hexc('#c9ced3')  # 外壁（窓の外から見る）：二つの窓の穴をあけた形
    box((0, 0.2, 3.6), (14, 0.4, 4.8), wc); box((0, 0.2, -3.6), (14, 0.4, 4.8), wc)
    for x0, x1 in ((-7, -6.3), (-2.7, 2.7), (6.3, 7)):
        box(((x0 + x1) / 2, 0.2, 0), (x1 - x0, 0.4, 2.4), wc)
    for x in (-4.5, 4.5):
        g = box((x, 0.1, 0), (3.6, 0.04, 2.4), hexc('#9fb8c8')); g.data.materials.clear(); g.data.materials.append(gmat(hexc('#9fb8c8'), 0.25, 'glass'))
    interior = box((0, 4, -1.3), (14, 8, 0.2), hexc('#c8bca8'))
    box((0, 8, 0), (14, 0.2, 4), hexc('#efe8dc')); box((0, 4, 1.3), (14, 8, 0.2), hexc('#f2f2ee'))
    rnd = random.Random(79)
    e = person((-4.6, 1.2, -1.2), hexc('#b8a890'), pants=hexc('#5a5048'), hair=hexc('#d8d8d4'), s=0.92, name='old', rot_z=0)
    m = person((4.0, 1.2, -1.2), hexc('#7a5a8a'), skin=SKIN[0], name='mom', rot_z=0)
    baby = sphere((0, 0, 0), 0.16, hexc('#f2e6d8'), seg=12); baby.parent = O[m['rig']]; baby.location = (0, -0.25, 1.15)
    hand_chest(m, 0); hand_chest(m, 0)
    d = person((5.0, 1.6, -1.2), hexc('#3d5a80'), skin=SKIN[1], name='dad', rot_z=0.2)
    below(lambda: skyline(n, cx=0, cy=-300, nx=7, ny=3, pitch=60, hr=(40, 180), seed=80), -140)
    ground(size=2000, rgb=hexc('#8a8a86')).location.z = -140
    cam = camera(30)
    cam_path(cam, [(0, (0.5, -10, 0.5), (0, 1, -0.2)), (1, (0, -9, 0.4), (0, 1, -0.2))], n)
    return NB('city')


# ---------------- SCENE 09 トンネルの中の新幹線（章8） ----------------
def nShkStop(n):  # 東京と大阪を結ぶ新幹線は、すべて止まる
    day_light('#b7cfe6', 0.5)
    ground(size=2000, rgb=hexc('#8fa06a'))
    rails(-800, 400, 0, k=2)
    tr, wins = bullet_train((0, 0, 0), cars=8)
    x0 = -260
    tr.location.x = x0; tr.keyframe_insert('location', index=0, frame=1)
    f_stop = int(n * 0.6)
    for k in range(1, 9):
        u = k / 8
        tr.location.x = x0 + 260 * (1 - (1 - u) ** 2); tr.keyframe_insert('location', index=0, frame=1 + int((f_stop - 1) * u))
    for i in range(30):
        tree((RK.uniform(-500, 300), RK.choice([-1, 1]) * RK.uniform(14, 60), 0), s=RK.uniform(1.5, 2.5))
    mountain((0, 300, 0), 200, 120, c=hexc('#6f8250'))
    cam = camera(30)
    cam_path(cam, [(0, (25, -24, 5), (-30, 0, 2)), (1, (22, -22, 4.5), (-5, 0, 2))], n)
    return NB('day')


def tunnel(n, L=300, lamps=True, dark=False):
    s = bpy.context.scene
    sky(hexc('#050608')); s.view_settings.exposure = 0.3 if not dark else -0.4; no_shadow()
    light_dir((0.1, -0.2, 0.95))
    bm = bmesh.new()
    segs = 16; R = 5.5
    vs = []
    for xi, x in enumerate((-L / 2, L / 2)):
        row = []
        for k in range(segs + 1):
            a = math.pi * k / segs
            row.append(bm.verts.new((x, R * math.cos(a), R * math.sin(a))))
        vs.append(row)
    for k in range(segs):
        bm.faces.new((vs[0][k], vs[1][k], vs[1][k + 1], vs[0][k + 1]))
    _obj(bm, hexc('#4a4a48'), 'tunnel')
    box((0, 0, -0.05), (L, 11, 0.1), hexc('#3a3834'))
    rails(-L / 2, L / 2, 0, k=1)
    if lamps:
        msph([(x, 5.0, 3.2, 0.2) for x in range(int(-L / 2), int(L / 2), 12)], (1.0, 0.82, 0.5), 'tlamp')


def nTunnel(n):  # トンネルの中
    tunnel(n)
    tr, wins = bullet_train((40, 0, 0), cars=6, lit=True)
    cam = camera(26)
    cam_path(cam, [(0, (60, -3.8, 2.8), (0, 0.5, 2.2)), (1, (55, -3.6, 2.6), (0, 0.5, 2.2))], n)
    return NB('room')


def nBridge(n):  # 鉄橋の上
    day_light('#c4d4e2', 0.45)
    ground(size=2000, rgb=hexc('#8fa06a'))
    plane((0, 0, -6), (2000, 120), hexc('#5f8fb0'))
    box((0, 0, -1.0), (400, 9, 1.6), hexc('#8a8a86'))
    for x in range(-180, 181, 40):
        box((x, 0, -6), (4, 6, 10), hexc('#9a9690'))
    rails(-200, 200, 0, k=1)
    for x in range(-200, 201, 8):
        box((x, -4.4, 1.2), (0.3, 0.3, 2.4), hexc('#6a6e74')); box((x, 4.4, 1.2), (0.3, 0.3, 2.4), hexc('#6a6e74'))
    mbox([(0, s_ * 4.4, 2.4, 400, 0.3, 0.3) for s_ in (-1, 1)], hexc('#6a6e74'), 'truss')
    tr, wins = bullet_train((60, 0, 0), cars=8)
    for i in range(20):
        tree((RK.uniform(-400, 400), RK.choice([-1, 1]) * RK.uniform(70, 200), 0), s=RK.uniform(1.5, 2.5))
    cam = camera(28)
    cam_path(cam, [(0, (-20, -40, 6), (40, 0, 1)), (1, (-14, -38, 5.5), (40, 0, 1))], n)
    return NB('day')


def shk_interior(n, rows=12, seed=81, dark_f=None, standing=8, phones=False):
    """新幹線の車内（通路は x 方向、2列＋3列の座席）。dark_f で明かりが消える"""
    s = bpy.context.scene
    sky(hexc('#060708')); s.view_settings.exposure = 0.35; no_shadow()
    light_dir((0.1, -0.2, 0.95))
    Lx = rows * 1.05 + 4
    box((0, 0, -0.05), (Lx, 3.4, 0.1), hexc('#6a6e78'))
    ceil = box((0, 0, 2.35), (Lx, 3.4, 0.1), hexc('#f2f0e8'))
    lights = box((0, 0, 2.29), (Lx, 0.5, 0.04), hexc('#fffbea'))
    for sd in (-1, 1):
        box((0, sd * 1.7, 1.2), (Lx, 0.08, 2.4), hexc('#e6e4dc'))
        for k in range(rows):
            box((-Lx / 2 + 2 + k * 1.05, sd * 1.66, 1.25), (0.7, 0.04, 0.55), hexc('#1a1e24'))
    rnd = random.Random(seed)
    seat_c = hexc('#3a5a9a')
    seats = []
    for k in range(rows):
        x = -Lx / 2 + 2 + k * 1.05
        for y in (-1.3, -0.85, -0.4, 0.55, 1.0):  # 3列（-y）＋ 2列（+y）。通路は y=0.08
            seats.append((x + 0.05, y, 0.25, 0.5, 0.45, 0.5))
            seats.append((x + 0.3, y, 0.75, 0.1, 0.45, 0.9))
            if rnd.random() < 0.95:
                p = crowd_person((x - 0.05, y, 0.0), rnd, rot_z=-math.pi / 2, pose='sit', name=f'sp{k}{y}', act='phone' if (phones and rnd.random() < 0.6) else None)
                if phones and rnd.random() < 0.6:
                    phone_glow((x - 0.38, y, 0.95), r=0.05)
    mbox(seats, seat_c, 'seats')
    for i in range(standing):
        x = -Lx / 2 + 2 + rnd.uniform(0, rows * 1.05)
        crowd_person((x, 0.08, 0), rnd, rot_z=rnd.uniform(-0.6, 0.6) + math.pi / 2, name=f'st{i}')
    if dark_f:
        m = gmat(hexc('#fffbea'), 1.0, 'ltube'); lights.data.materials.clear(); lights.data.materials.append(m)
        key_color(m, 1, hexc('#fffbea')); key_color(m, dark_f, hexc('#fffbea')); key_color(m, dark_f + 2, hexc('#222222'))
        exposure_keys([(1, 0.35), (dark_f, 0.35), (dark_f + 3, -1.6)])
    return Lx


def nShkFull(n):  # 駅と駅の間で止まった車内は、乗客でいっぱい
    Lx = shk_interior(n)
    cam = camera(24)
    cam_path(cam, [(0, (-Lx / 2 + 0.5, 0.08, 1.7), (Lx / 2, 0.0, 1.1)), (1, (-Lx / 2 + 1.0, 0.08, 1.7), (Lx / 2, 0.0, 1.0))], n)
    return NB('room')


def nShk80k(n):  # 走っていた新幹線の乗客を合わせると、八万人（地図：東京〜大阪の線に止まった列車）
    japan_map(name='nk_map_t')
    route_line(TOKAIDO, rgb=hexc('#e8e2d0'), r=0.22)
    rnd = random.Random(82)
    for k in range(22):
        i = rnd.randrange(len(TOKAIDO) - 1); u = rnd.random()
        a, b = TOKAIDO[i], TOKAIDO[i + 1]
        p = MP(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 0.7)
        ang = math.atan2(MP(*b)[1] - MP(*a)[1], MP(*b)[0] - MP(*a)[0])
        o = box(p, (1.4, 0.45, 0.4), hexc('#ffffff'), rot=(0, 0, ang))
        appear(o, 3 + k * 2)
    map_cam(n, (137.6, 34.2, 32), (137.6, 34.4, 28))
    return NB('silent')


def stadium(loc, r=40, seed=1, fill_f=None):
    rnd = random.Random(seed)
    root = empty(loc, 'stadium')
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=False, segments=48, radius1=r * 0.62, radius2=r, depth=r * 0.35, matrix=Matrix.Translation((0, 0, r * 0.175)))
    o = _obj(bm, hexc('#c9c6be'), 'bowl'); link(o, root)
    link(cyl((0, 0, 0.05), r * 0.6, 0.1, hexc('#5a9a5a'), verts=48), root)
    cols = [hexc('#3d5a80'), hexc('#c46a4a'), hexc('#e8e2d6'), hexc('#4a6b4a'), hexc('#d9b26a')]
    for ci, c in enumerate(cols):
        items = []
        for i in range(500):
            a = rnd.uniform(0, 6.28); t = rnd.uniform(0.05, 0.95)
            rr = r * (0.62 + 0.38 * t) - 0.6; z = r * 0.35 * t + 0.4
            items.append((math.cos(a) * rr, math.sin(a) * rr, z, 0.45))
        m = msph(items, c, 'fans', sub=0); link(m, root)
        if fill_f is not None:
            appear(m, fill_f + ci * 6, grow=6)
    return root


def nStadiums(n):  # 満員の大きな球場が、二つ埋まるほど
    day_light('#b7cfe6', 0.5)
    ground(size=2000, rgb=hexc('#a7a296'))
    stadium((-48, 0, 0), seed=1, fill_f=4)
    stadium((48, 0, 0), seed=2, fill_f=int(n * 0.3))
    cam = camera(30)
    cam_path(cam, [(0, (0, -170, 110), (0, 0, 0)), (1, (0, -160, 100), (0, 0, 0))], n)
    return NB('city')


def nLightsOff(n):  # 車内の明かりが消え、窓の外はトンネルの暗闇
    Lx = shk_interior(n, dark_f=int(n * 0.3), seed=83)
    cam = camera(24)
    cam_path(cam, [(0, (-Lx / 2 + 1.0, 0.08, 1.7), (Lx / 2, 0.2, 1.1)), (1, (-Lx / 2 + 1.4, 0.08, 1.65), (Lx / 2, 0.2, 1.0))], n)
    return NB('room')


def nDarkWait(n):  # 誰も、いつ動くのか、分からない（暗い車内にスマホの光）
    Lx = shk_interior(n, seed=84, phones=True)
    exposure_keys([(1, -1.4)])
    cam = camera(26)
    cam_path(cam, [(0, (-Lx / 2 + 0.8, 0.08, 1.6), (Lx / 2, 0.0, 1.0)), (1, (-Lx / 2 + 1.3, 0.08, 1.6), (Lx / 2, 0.0, 1.0))], n)
    return NB('room')


# ---------------- SCENE 10 海になった滑走路（章9） ----------------
def airport(n, flood_f=None, z1=1.2, seed=91, parked=True):
    day_light('#9fb0c0', 0.42)
    ground(size=3000, rgb=hexc('#8f9a72'))
    plane((0, 700, -0.5), (3000, 1200), SEA_DEEP)
    plane((0, 0, 0.02), (900, 60), hexc('#5a5a5e'), name='runway')
    mbox([(x, 0, 0.04, 30, 1.0, 0.02) for x in range(-420, 421, 60)], hexc('#f2f2ee'), 'rwmark')
    plane((0, -90, 0.02), (700, 30), hexc('#66666a'))
    box((0, -170, 8), (300, 40, 16), hexc('#d8dce0'))
    box((0, -149.9, 10), (290, 0.2, 6), hexc('#6f8aa0'))
    box((160, -150, 22), (10, 10, 44), hexc('#e6e6e2')); box((160, -150, 46), (16, 16, 6), hexc('#4a6a8a'))
    if parked:
        for k in range(4):
            airliner((-120 + k * 80, -125, 4.0), rot_z=-math.pi / 2, s=1.0, name=f'pk{k}')
    if flood_f is not None:
        w = flood((0, 0, 0), (3000, 1300), -0.3, z1, flood_f, n, c=hexc('#5d6a6a'), a=0.92)
        flow_streaks(n, -400, 400, -100, 120, z1, dirv=(0, -1), speed=3, c=hexc('#7a7e78'))
    return


def nAirportWater(n):  # 海沿いの空港には、津波の水が、もう入ってきている
    airport(n, flood_f=1, z1=1.4)
    cam = camera(30)
    cam_path(cam, [(0, (-300, -300, 120), (0, 0, 0)), (1, (-260, -300, 110), (40, 0, 0))], n)
    return NB('sea', roar=[(1, n, 0.4)])


def nRunwaySea(n):  # 滑走路が、海になっている
    airport(n, flood_f=1, z1=1.6)
    airliner((60, 10, 2.6), rot_z=0.3, name='stuck')
    cam = camera(32)
    cam_path(cam, [(0, (-40, -70, 8), (60, 10, 2)), (1, (-30, -66, 7.5), (60, 10, 2))], n)
    return NB('sea', roar=[(1, n, 0.3)])


def sky_above(n, clouds_z=0.0, seed=92):
    s = bpy.context.scene
    sky(hexc('#8fb3d8')); s.view_settings.exposure = 0.45; no_shadow()
    rnd = random.Random(seed)
    for g in range(3):
        msph([(rnd.uniform(-900, 900), rnd.uniform(-900, 900), clouds_z + rnd.uniform(-10, 10), rnd.uniform(30, 70), 1, 1, 0.3) for _ in range(60)],
             (0.96, 0.97, 0.98), f'cloud{g}', sub=1, smooth=True)


def circling(k, n, center, r, z, seed=1, s=1.0, laps=0.3):
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        p = airliner((0, 0, 0), s=s, name=f'cp{i}')
        ph = rnd.uniform(0, 6.28); rr = r * rnd.uniform(0.6, 1.2)
        cx = center[0] + rnd.uniform(-r, r) * 0.5; cy = center[1] + rnd.uniform(-r, r) * 0.5
        for f in range(1, n + 2, 4):
            a = ph + 2 * math.pi * laps * f / n
            p.location = (cx + rr * math.cos(a), cy + rr * math.sin(a), z + rnd.uniform(-1, 1) * 0 + i * 8)
            p.keyframe_insert('location', frame=f)
            p.rotation_euler = (0.25, 0, a + math.pi / 2 * 0 + math.pi / 2)
            p.keyframe_insert('rotation_euler', frame=f)
        out.append(p)
    return out


def nPlanesSky(n):  # 空には、着陸できない飛行機が、何機も残っている
    sky_above(n, clouds_z=-60)
    circling(5, n, (0, 0), 150, 0, seed=1, laps=0.12)
    cam = camera(40)
    cam_path(cam, [(0, (-250, -260, 60), (0, 0, 10)), (1, (-240, -250, 60), (0, 0, 10))], n)
    return NB('wind')


def nPlanes200(n):  # 行き先を変えなければならない飛行機は、二百機を超える
    japan_map(name='nk_map_t')
    rnd = random.Random(93)
    for i in range(60):
        lo = rnd.uniform(130.5, 140.5); la = rnd.uniform(31.0, 36.8)
        c = MP(lo, la, 3.0); r = rnd.uniform(0.8, 1.6)
        o = box((0, 0, 0), (0.9, 0.25, 0.1), (1, 1, 1))
        pv = empty(c, 'hold'); o.parent = pv; o.location = (0, r, 0)
        pv.rotation_euler.z = rnd.uniform(0, 6.28); pv.keyframe_insert('rotation_euler', index=2, frame=1)
        pv.rotation_euler.z += 2 * math.pi * rnd.uniform(0.6, 1.0) * rnd.choice([-1, 1]); pv.keyframe_insert('rotation_euler', index=2, frame=n)
        linear(pv)
        appear(pv, 1 + int(i * n * 0.4 / 60))
    map_cam(n, (135.6, 33.6, 90), (135.6, 33.8, 84))
    return NB('silent')


def nHolding(n):  # 燃料が減っていく中、降りられる空港を探して、空を回り続ける
    sky_above(n, clouds_z=-40, seed=94)
    p = airliner((0, 0, 0), name='hold')
    circling(1, n, (0, 0), 200, 0, seed=3, laps=0.15)
    cam = camera(70)
    cam_path(cam, [(0, (-260, -260, 60), (0, 0, 0)), (1, (-240, -260, 50), (0, 0, 0))], n)
    track = [o for o in bpy.data.objects if o.name.startswith('cp0')][0]
    c = cam.constraints.new('TRACK_TO'); c.target = track; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    bpy.data.objects.remove(p)
    return NB('wind')


def nCabin(n):  # 安全なはずの空に取り残され、機内は騒然としている
    s = bpy.context.scene
    sky(hexc('#9fbfe0')); s.view_settings.exposure = 0.35; no_shadow()
    rows = 10
    box((0, 0, -0.05), (rows * 0.9 + 4, 4.0, 0.1), hexc('#5a6070'))
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=False, segments=24, radius1=2.3, radius2=2.3, depth=rows * 0.9 + 4, matrix=Matrix.Translation((0, 0, 1.0)) @ Matrix.Rotation(math.pi / 2, 4, 'Y'))
    o = _obj(bm, hexc('#eeeae2'), 'cabin')
    for sd in (-1, 1):
        for k in range(rows):
            box((-rows * 0.45 + k * 0.9, sd * 1.9, 1.35), (0.3, 0.1, 0.4), hexc('#9fc4e8'))
    rnd = random.Random(95)
    seats = []
    for k in range(rows):
        x = -rows * 0.45 + k * 0.9
        for y in (-1.35, -0.85, 0.85, 1.35):
            seats.append((x + 0.05, y, 0.25, 0.45, 0.45, 0.5)); seats.append((x + 0.28, y, 0.75, 0.1, 0.45, 0.9))
            p = crowd_person((x - 0.05, y, 0.0), rnd, rot_z=-math.pi / 2, pose='sit', name=f'cb{k}{y}', act=rnd.choice([None, 'phone', 'talk']))
    mbox(seats, hexc('#2f3f5f'), 'seats')
    for k in range(rows):
        sign = ball((-rows * 0.45 + k * 0.9, 0, 2.2), 0.06, (1.0, 0.75, 0.2), seg=8, name='sign')
        blink(sign, n, 18)
    cam = camera(24)
    cam_path(cam, [(0, (-rows * 0.45 - 1.0, 0.0, 1.7), (rows * 0.45, 0, 1.0)), (1, (-rows * 0.45 - 0.6, 0.0, 1.65), (rows * 0.45, 0, 1.0))], n)
    shake(cam, 1, n, amp=0.03, rot=0.006, seed=9, step=4)
    return NB('wind')


# ---------------- SCENE 11 名古屋の地下街（章10） ----------------
def low_city(n, z_flood=None, river=True, seed=101):
    day_light('#9aaab8', 0.42)
    ground(size=2000, rgb=hexc('#9a9690'))
    rnd = random.Random(seed)
    if river:
        plane((0, 80, -2.0), (2000, 40), hexc('#56788f'), name='river')
        box((0, 58, 1.0), (2000, 4, 2.0), CONC); box((0, 102, 1.0), (2000, 4, 2.0), CONC)
    skyline(n, cx=0, cy=-60, nx=7, ny=3, pitch=36, hr=(10, 40), seed=seed)
    for i in range(-10, 11):
        j_house((i * 12, 30 + rnd.uniform(-2, 2), 0), rnd=rnd, name=f'lc{i}')
    plane((0, 10, 0.02), (2000, 10), ASPH)
    if z_flood:
        f0, f1, z0, z1 = z_flood
        flood((0, 0, 0), (2000, 2000), z0, z1, f0, f1, c=hexc('#6a6a5a'), a=0.95)
        flow_streaks(n, -100, 100, -60, 90, z1, dirv=(0, -1), speed=3, c=hexc('#8a8676'))


def nNagoyaLow(n):  # 名古屋。海より低い土地が広がる街に、川をさかのぼってきた水があふれ出す
    low_city(n, z_flood=(int(n * 0.2), n, -1.5, 1.0))
    water((0, 80, 0), (2000, 40), -2.0, 2.4, 1, int(n * 0.4), c=hexc('#5d7a8a'), a=1.0)
    cam = camera(28)
    cam_path(cam, [(0, (-120, -120, 60), (0, 40, 0)), (1, (-110, -110, 55), (10, 40, 0))], n)
    return NB('city', roar=[(1, n, 0.5)])


def mall_entrance(n, flow=True, seed=102, people=0):
    """駅前の地下街の入り口（屋根つきの階段）。階段は y=0→y=14 で z=0→-6 へ下る"""
    day_light('#9aaab8', 0.42)
    gc = hexc('#9a9690')  # 地面（階段の穴をあける）
    plane((0, -150, 0), (600, 300), gc); plane((0, 164, 0), (600, 300), gc)
    plane((-151.2, 7, 0), (297.6, 14), gc); plane((151.2, 7, 0), (297.6, 14), gc)
    skyline(n, cx=0, cy=80, nx=6, ny=2, pitch=40, hr=(20, 60), seed=seed)
    # 階段の穴のまわり
    box((-2.4, 7, 0.6), (0.3, 14, 1.2), hexc('#c8c4ba')); box((2.4, 7, 0.6), (0.3, 14, 1.2), hexc('#c8c4ba'))
    box((0, -0.5, 3.2), (5.4, 2.0, 0.3), hexc('#6a7a8a'))
    for sx in (-2.4, 2.4):
        box((sx, -0.5, 1.6), (0.2, 0.2, 3.2), hexc('#6a7a8a'))
    steps = [(0, 0.5 + k * 0.6, -k * 0.27, 4.4, 0.6, 0.27) for k in range(22)]
    mbox(steps, hexc('#b8b4aa'), 'steps')
    wc = hexc('#d6d2c8')  # 階段の両側の壁と、下の地下通路
    mbox([(-2.6, 7, -3.2, 0.2, 14.4, 6.6), (2.6, 7, -3.2, 0.2, 14.4, 6.6)], wc, 'stairwall')
    mbox([(0, 20, -6.1, 14, 12, 0.2), (0, 20, -2.2, 14, 12, 0.2), (0, 26, -4, 14, 0.2, 4), (-7, 20, -4, 0.2, 12, 4), (7, 20, -4, 0.2, 12, 4),
          (-4.6, 14, -4, 4.4, 0.2, 4), (4.6, 14, -4, 4.4, 0.2, 4)], wc, 'corridor')
    mbox([(0, 20, -2.3, 2.4, 0.4, 0.06)], hexc('#fffbea'), 'clamp')
    mbar([((sx, 0.3, 1.0), (sx, 13.5, -5.0), 0.04) for sx in (-2.05, 2.05)], hexc('#d0d4d8'), 'hrail')
    plane((0, -20, 0.03), (80, 30), ASPH)
    if flow:
        fl = flood((0, -40, 0), (300, 70), 0.1, 0.5, 1, n, c=hexc('#6a6a5a'))
        flow_streaks(n, -30, 30, -60, -2, 0.5, dirv=(0, 1), speed=3, c=hexc('#8a8676'))
        # 階段の水（斜めの板と、流れ落ちる筋）
        sw = box((0, 7, -2.3), (4.4, 15.5, 0.25), hexc('#7a786a'), rot=(-math.atan2(6, 13.5), 0, 0))
        sw.data.materials.clear(); sw.data.materials.append(gmat(hexc('#7a786a'), 0.88, 'stairw'))
        rnd = random.Random(seed)
        for layer in range(3):
            items = [(rnd.uniform(-2, 2), rnd.uniform(0, 14), 0, 0.12, 1.2, 0.05) for _ in range(50)]
            items = [(x, y, 0.15, a, b, c) for x, y, _, a, b, c in items]
            o = mbox(items, FOAM if layer == 0 else hexc('#a8a698'), f'fall{layer}')
            pv = empty((0, 0, 0.3), 'fallpv'); pv.rotation_euler.x = -math.atan2(5.7, 12.6); o.parent = pv
            saw(o, n, 1, 0.0, 6.0, 12, phase=layer * 4)
    return


def nMallEntrance(n):  # 道路を伝ってきた水は、駅前の地下街の入り口から流れ込む
    mall_entrance(n)
    cam = camera(28)
    cam_path(cam, [(0, (-12, -20, 8), (0, 5, -1)), (1, (-10, -18, 7), (0, 6, -2))], n)
    return NB('city', roar=[(1, n, 0.6)])


def nStairsFall(n):  # 階段が、滝のようになる
    mall_entrance(n, seed=103)
    cam = camera(24)
    cam_path(cam, [(0, (0.6, 15.5, -4.0), (0, 0, 1.0)), (1, (0.4, 15.0, -4.2), (0, 0, 0.6))], n)
    return NB('city', roar=[(1, n, 1.0)])


def stair_people(n, rnd, k=5, grip=False, climb=True):
    out = []
    for i in range(k):
        u = 0.3 + i * 0.12
        y = 0.5 + u * 13; z = -u * 6
        x = -1.6 if i % 2 == 0 else 1.6
        p = crowd_person((x, y, z + 0.05), rnd, rot_z=math.pi, name=f'cl{i}')
        if grip:
            arm_to(p, 0 if x > 0 else 1, (-0.45 if x < 0 else 0.45, -0.1, 0.95))
            arm_to(p, 0, (-0.45 if x < 0 else 0.45, -0.35, 1.05))
        if climb:
            # 少し上ってはずり落ちる
            keys = []
            for f in range(1, n + 1, 24):
                du = 0.03 if (f // 24) % 2 == 0 else -0.02
                u = max(0.1, u - du)
                keys.append((f, (x, 0.5 + u * 13, -u * 6 + 0.05)))
            move(p, keys)
        out.append(p)
    return out


def nClimbUp(n):  # 地下に残っていた人が、流れに逆らって、階段を上ろうとする
    mall_entrance(n, seed=104)
    stair_people(n, random.Random(105), k=6)
    cam = camera(26)
    cam_path(cam, [(0, (0, -4, 3.2), (0, 9, -3.2)), (1, (0, -3, 2.8), (0, 9, -3.4))], n)
    return NB('city', roar=[(1, n, 1.0)])


def nRailGrip(n):  # 足をすくわれ、手すりにしがみつく人
    mall_entrance(n, seed=106)
    ps = stair_people(n, random.Random(107), k=3, grip=True, climb=False)
    cam = camera(34)
    p = ps[1]
    x, y, z = p.location
    cam_path(cam, [(0, (x - 2.2, y - 3.2, z + 2.0), (x, y, z + 1.0)), (1, (x - 1.8, y - 2.8, z + 1.8), (x, y, z + 1.0))], n)
    return NB('city', roar=[(1, n, 1.0)])


def mall_corridor(n, z0=0.2, z1=1.0, f0=1, f1=None, seed=108, people=8):
    """地下街の通路（店の並び、天井の明かり）。水位が z0→z1 に上がる"""
    s = bpy.context.scene
    sky(hexc('#1a1c20')); s.view_settings.exposure = 0.3; no_shadow()
    light_dir((0.1, -0.2, 0.95))
    L = 60
    box((0, 0, -0.1), (L, 10, 0.2), hexc('#c8c4ba'))
    box((0, 0, 3.6), (L, 10, 0.2), hexc('#e8e6e0'))
    mbox([(x, 0, 3.45, 2.4, 0.5, 0.08) for x in range(-28, 29, 6)], hexc('#fffbea'), 'clight')
    rnd = random.Random(seed)
    for sd in (-1, 1):
        x = -L / 2
        while x < L / 2:
            w = rnd.uniform(5, 8)
            box((x + w / 2, sd * 5.2, 1.8), (w - 0.3, 0.4, 3.6), rnd.choice(WALLS))
            box((x + w / 2, sd * 5.0, 1.3), (w * 0.7, 0.08, 2.2), hexc('#9fb8c8'))
            box((x + w / 2, sd * 4.95, 3.0), (w * 0.8, 0.1, 0.5), rnd.choice([hexc('#c0503e'), hexc('#3e6e9a'), hexc('#4f8a5a'), hexc('#d9a441')]))
            x += w
    fl = flood((0, 0, 0), (L, 10), z0, z1, f0, f1 or n, c=hexc('#6a6a5a'), a=0.9)
    flow_streaks(n, -28, 28, -4, 4, z1, dirv=(1, 0), speed=1.0, c=hexc('#8a8676'), k=60)
    for o in [o for o in bpy.data.objects if o.name.startswith('streak')]:
        o.parent = fl; o.location.z -= z1
    ps = []
    for i in range(people):
        p = crowd_person((rnd.uniform(-10, 10), rnd.uniform(-3.8, 3.8), 0), rnd, rot_z=rnd.uniform(0, 6.28), name=f'mc{i}')
        if rnd.random() < 0.5:
            hand_chest(p, 1)
        ps.append(p)
    return ps


def nKneeWaist(n):  # 水は、ひざから、腰へと上がってくる
    mall_corridor(n, z0=0.45, z1=1.0, f0=1, f1=n)
    cam = camera(26)
    cam_path(cam, [(0, (-16, -2.5, 1.9), (6, 0.5, 0.9)), (1, (-14, -2.2, 1.8), (6, 0.5, 0.9))], n)
    return NB('room', roar=[(1, n, 0.6)])


def nNoExit(n):  # 地下は、水が入ると、出ていく所がない（断面・模式）
    s = bpy.context.scene
    sky(hexc('#dfe6ec')); s.view_settings.exposure = 0.5; no_shadow()
    box((0, 0, -10), (200, 30, 20), hexc('#8a7a64'))
    cav = box((0, -14.9, -6), (90, 0.3, 6), hexc('#2a2c30'))
    box((0, -15.1, 0.2), (200, 0.2, 0.4), hexc('#9a9690'))
    skyline(n, cx=0, cy=20, nx=5, ny=1, pitch=36, hr=(20, 50), seed=109)
    w = box((0, -15.2, 0), (90, 0.1, 1), hexc('#6a7a8a'))
    w.data.materials.clear(); w.data.materials.append(gmat(hexc('#6a7a8a'), 0.9, 'fillw'))
    pv = empty((0, -15.2, -9), 'fill'); w.parent = pv; w.location = (0, 0, 0.5)
    pv.scale = (1, 1, 0.01); pv.keyframe_insert('scale', frame=1)
    pv.scale = (1, 1, 6.0); pv.keyframe_insert('scale', frame=int(n * 0.7))
    for x in (-30, 30):
        box((x, -15.1, -2.5), (4, 0.3, 5), hexc('#4a4e56'))
        o = mbox([(x + RK.uniform(-1.5, 1.5), -15.4, RK.uniform(-5, 0), 0.1, 0.05, 0.8) for _ in range(30)], FOAM, 'drop')
        saw(o, n, 2, 0.0, -3.0, 10)
    cam = camera(30)
    cam_path(cam, [(0, (0, -120, -3), (0, 0, -4)), (1, (0, -110, -3), (0, 0, -4))], n)
    return NB('silent', roar=[(1, n, 0.4)])


def nMallDays(n):  # 地下街の水は、何日も引かない（人のいない、水に沈んだ通路）
    mall_corridor(n, z0=1.6, z1=1.6, people=0, seed=110)
    exposure_keys([(1, -0.2)])
    cam = camera(26)
    cam_path(cam, [(0, (-20, 0, 2.6), (10, 0, 1.4)), (1, (-17, 0, 2.5), (10, 0, 1.4))], n)
    return NB('silent')
