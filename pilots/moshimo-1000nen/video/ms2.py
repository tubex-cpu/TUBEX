"""カット：SCENE 06〜10（章5〜9）：道路から木が生える／竹／シカとイノシシ／カラス／百年前に設計された森"""
from ms1 import *


# ---------------- SCENE 06 道路から、木が生える（章5） ----------------
def kCross10(n):  # 十年後。交差点のアスファルトの割れ目から、草が伸びている
    crossing(n, 10)
    cam = camera(30)
    cam_path(cam, [(0, (4, -36, 9), (0, 2, 0)), (1, (3, -31, 7.5), (0, 3, 0))], n)
    return MB('day', insects=0.4)


def kYoungTree(n):  # 草の間で、若い木が、人の背ほどに育っている。倒れた自転車につる
    crossing(n, 10)
    for o in [o for o in bpy.data.objects if o.name.startswith('ytree')]:
        sway_tree(o, n, amp=0.04, period=60, seed=int(o.location.x * 10))
    cam = camera(35, dof=8.0, fstop=4)
    cam_path(cam, [(0, (-12.5, -1.0, 1.4), (-6.5, 3.2, 1.3)), (1, (-11.5, -0.2, 1.5), (-6.5, 3.2, 1.4))], n)
    return MB('day', insects=0.5)


def paddy_field(n, f0, f1, seed=4):
    """田んぼ（水を張った区画とあぜ）が、草と若い木の野原になっていく"""
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.38
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(size=600, rgb=hexc('#8aa060'))
    rnd = random.Random(seed)
    plots = []
    for i in range(-3, 4):
        for j in range(-2, 4):
            x, y = i * 16, j * 12
            w = plane((x, y, 0.03), (15, 11), hexc('#7a8a7a')); plots.append(w)
            box((x, y + 5.9, 0.15), (16, 0.8, 0.3), hexc('#8a7a5a'))
            box((x + 7.9, y, 0.15), (0.8, 12, 0.3), hexc('#8a7a5a'))
    # 遠くの家と山
    for k in range(8):
        house((-60 + k * 16, 70 + rnd.uniform(0, 10), 0), w=7, d=6, h=6)
    mountain((0, 160, 0), 120, 40, hexc('#6a8a50'))
    # 草が広がる（区画ごとに順に）
    order = list(range(len(plots))); rnd.shuffle(order)
    for k, idx in enumerate(order):
        x, y = plots[idx].location.x, plots[idx].location.y
        f = int(f0 + (f1 - f0) * k / len(order))
        pts = [(x + rnd.uniform(-7, 7), y + rnd.uniform(-5, 5)) for _ in range(40)]
        gs = grass_tufts(pts, seed=k, h=(0.4, 1.1), per=3, name='pg')
        cover = plane((x, y, 0.05), (15, 11), rnd.choice([hexc('#7a9a50'), hexc('#8aa858'), hexc('#6a8a48')]))
        for o in gs + [cover]:
            grow(o, f, f + 30, axis='z' if o is not cover else None)
        if rnd.random() < 0.55:
            t = young_tree((x + rnd.uniform(-5, 5), y + rnd.uniform(-4, 4), 0), s=rnd.uniform(0.9, 1.5), seed=k)
            grow(t, f + 20, f + 70)


def kPaddy(n):  # 町はずれの田んぼは、もう、田んぼに見えない
    paddy_field(n, 2, int(n * 0.55))
    cam = camera(30)
    cam_path(cam, [(0, (-30, -55, 14), (0, 10, 0)), (1, (-20, -50, 12), (5, 10, 0))], n)
    return MB('day', insects=0.6)


def kFieldTrees(n):  # 放っておかれた畑は、数年で草に覆われ、やがて木が入ってくる
    paddy_field(n, -600, 2, seed=5)
    rnd = random.Random(9)
    pts = [(rnd.uniform(-50, 50), rnd.uniform(-30, 40)) for _ in range(60)]
    for k, (x, y) in enumerate(pts):
        t = young_tree((x, y, 0), s=rnd.uniform(1.2, 2.2), seed=k)
        grow(t, int(n * 0.1 + k * (n * 0.7 / len(pts))), int(n * 0.1 + k * (n * 0.7 / len(pts))) + 40)
    cam = camera(30)
    cam_path(cam, [(0, (10, -50, 9), (0, 10, 2)), (1, (0, -46, 8), (0, 12, 2))], n)
    return MB('day', insects=0.6)


def kTokyoGreen(n):  # 東京に、林が、戻り始める（交差点を高い所から）
    crossing(n, 10)
    cam = camera(28)
    cam_path(cam, [(0, (5, -70, 40), (0, 0, 0)), (1, (-5, -80, 50), (0, 0, 0))], n)
    return MB('day', insects=0.5)


# ---------------- SCENE 07 竹が、森をのみ込む（章6） ----------------
def satoyama(n, f0, f1, front_from=(-60, 0), seed=3, dense=1.0):
    """里山の斜面：雑木林に、竹が端から広がる（f0〜f1）。広がる前の木は消える"""
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.35
    light_dir((0.4, -0.5, 0.7)); s.display.shading.shadow_intensity = 0.45
    terrain(240, 60, hill_h, hexc('#6a7a48'), x0=-120, y0=-40)
    rnd = random.Random(seed)
    pts = [(rnd.uniform(-100, 100), rnd.uniform(-20, 140)) for _ in range(int(520 * dense))]
    fx, fy = front_from
    dist = lambda p: math.hypot(p[0] - fx, p[1] - fy)
    D = max(dist(p) for p in pts)
    groups = 14
    for g in range(groups):
        lo, hi = D * g / groups, D * (g + 1) / groups
        gp = [p for p in pts if lo <= dist(p) < hi]
        if not gp:
            continue
        f = int(f0 + (f1 - f0) * g / groups)
        half = len(gp) // 2
        trees = broadleaf(gp[:half], seed=g, z_of=hill_h, name='bl')
        for o in trees:
            if f > 2:
                vanish(o, f + 10)
            else:
                o.scale = (0, 0, 0)
        bam = bamboo_grove(gp, seed=g, z_of=hill_h, name='bam')
        for o in bam:
            if f > 2:
                grow(o, f, f + 18, axis=None)
    # 手前の田んぼと家
    plane((0, -30, 0.02), (240, 20), hexc('#8aa060'))
    for k in range(5):
        house((-50 + k * 25, -36, 0), w=7, d=6, h=6)


def kBambooHill(n):  # 二十年後。町の外れの山では、竹が、広がっている
    satoyama(n, int(n * 0.05), int(n * 0.95))
    cam = camera(30)
    cam_path(cam, [(0, (0, -120, 40), (0, 40, 8)), (1, (10, -112, 38), (5, 40, 8))], n)
    return MB('wind')


def kBambooRoots(n):  # 竹は、毎年、周りの林へ、根を伸ばしていく（地面の下の根：模式）
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.35
    light_dir((0.4, -0.6, 0.6))
    # 地面の断面（手前の切り口）
    box((0, 0, -1.5), (40, 10, 3), hexc('#8a6a48'))
    box((0, 0, 0.05), (40, 10, 0.1), hexc('#6a8a40'))
    rnd = random.Random(5)
    # 根（地下茎）が左から右へ伸び、節から新しい竹が出る
    segs = []
    x = -18.0
    k = 0
    while x < 16:
        nx_ = x + 2.2
        o = mbar([((x, -5.05, -0.6 - rnd.uniform(0, 0.3)), (nx_, -5.05, -0.6 - rnd.uniform(0, 0.3)), 0.12)], hexc('#d8c890'), 'rhizome')
        f = int(n * 0.05 + k * n * 0.05)
        grow(o, f, f + 10)
        b = bamboo_grove([(nx_, rnd.uniform(-2, 3))], seed=k, h=(7, 10))
        for oo in b:
            grow(oo, f + 8, f + 30, axis='z')
        x = nx_; k += 1
    # 右側の雑木林
    broadleaf([(rnd.uniform(6, 19), rnd.uniform(-2, 4)) for _ in range(8)], seed=3)
    cam = camera(30)
    cam_path(cam, [(0, (0, -30, 4), (0, 0, 3)), (1, (2, -28, 4), (2, 0, 3))], n)
    return MB('wind')


def kBambooPush(n):  # 切る人がいなくなると、竹は、ほかの木を追い出していく
    satoyama(n, int(n * 0.05), int(n * 0.9), front_from=(-100, 20), seed=4)
    cam = camera(34)
    cam_path(cam, [(0, (-40, -40, 22), (-10, 50, 14)), (1, (-30, -38, 22), (0, 50, 14))], n)
    return MB('wind')


def kBambooDark(n):  # 竹の林の下は、昼でも、薄暗いまま
    s = bpy.context.scene
    sky(hexc('#4a5a3a')); s.view_settings.exposure = -0.25
    light_dir((0.1, -0.2, 0.95)); s.display.shading.shadow_intensity = 0.7
    ground(size=200, rgb=hexc('#4a4632'))
    rnd = random.Random(7)
    pts = [(rnd.uniform(-30, 30), rnd.uniform(-10, 50)) for _ in range(420)]
    pts = [p for p in pts if math.hypot(p[0], p[1] + 8) > 3]
    bamboo_grove(pts, seed=7, h=(12, 16))
    # 天井のように重なる葉
    msph([(rnd.uniform(-30, 30), rnd.uniform(-10, 50), rnd.uniform(11, 15), rnd.uniform(2, 4), 1.4, 1.4, 0.4) for _ in range(160)], hexc('#5a7a3a'), 'canopy')
    # 落ち葉と、育たない若木（枯れた細い木）
    msph([(rnd.uniform(-20, 20), rnd.uniform(-10, 30), 0.0, rnd.uniform(0.6, 1.6), 1, 1, 0.05) for _ in range(80)], hexc('#8a7a4a'), 'leaves')
    mbar([((x, y, 0), (x, y, rnd.uniform(0.3, 0.8)), 0.02) for x, y in [(rnd.uniform(-6, 6), rnd.uniform(0, 12)) for _ in range(12)]], hexc('#6a5a3a'), 'sapling')
    # 細い光の筋
    light_shafts(k=5, seed=3, h=14)
    cam = camera(28)
    cam_path(cam, [(0, (0, -10, 1.6), (0, 20, 3.5)), (1, (0.8, -6, 1.6), (0.5, 20, 5.5))], n)
    return MB('wind')


def kBambooWide(n):  # 戻ってきた緑は、昔の森と同じではない
    satoyama(n, -400, 1, front_from=(-100, 0), seed=5)
    cam = camera(26)
    cam_path(cam, [(0, (60, -100, 50), (0, 50, 10)), (1, (40, -110, 56), (0, 50, 10))], n)
    return MB('wind')


# ---------------- SCENE 08 シカと、イノシシの町（章7） ----------------
def residential(n, seed=8, overgrown=True):
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.38
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(size=400, rgb=hexc('#8aa060'))
    town_grid(0, 0, nx=5, ny=5, pitch=14, seed=seed)
    if overgrown:
        rnd = random.Random(seed)
        pts = [(rnd.uniform(-35, 35), rnd.uniform(-35, 35)) for _ in range(500)]
        grass_tufts(pts, seed=seed, h=(0.3, 1.0), per=3)
        for k in range(40):
            bush((rnd.uniform(-35, 35), rnd.uniform(-35, 35), 0.4), rnd.uniform(0.5, 1.0))
        ever_trees([(rnd.uniform(-40, 40), rnd.uniform(-40, 40)) for _ in range(30)], seed=seed, s=(0.8, 1.2),
                   cols=[hexc('#6f8f4e'), hexc('#7d9a55'), hexc('#5f7f45')])


def deer_herd(n, path, k=6, seed=1, speed=1.0, graze_k=0):
    """シカの群れが path(u) に沿って歩く。graze_k 頭は止まって草を食べる"""
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        off = (rnd.uniform(-1.2, 1.2), rnd.uniform(-2.5, 2.5))
        kind = 'fawn' if i % 4 == 3 else 'deer'
        p0 = path(0); p1 = path(1)
        a = animal((p0[0] + off[0], p0[1] + off[1] - i * 2.2, 0), kind, name=f'deer{i}', pose='walk')
        if i < graze_k:
            graze(a, n, f0=rnd.randint(5, 40), down=0.8, seed=i)
        else:
            st = (p0[0] + off[0], p0[1] + off[1] - i * 2.2)
            en = (p1[0] + off[0], p1[1] + off[1] - i * 2.2)
            a.location = (*st, 0); a.keyframe_insert('location', frame=1)
            a.location = (st[0] + (en[0] - st[0]) * speed, st[1] + (en[1] - st[1]) * speed, 0); a.keyframe_insert('location', frame=n)
            linear(a, 'location')
        out.append(a)
    return out


def kDeerStreet(n):  # 三十年後。住宅地の道を、シカの群れが歩いている
    residential(n)
    deer_herd(n, lambda u: (7.0, -18 + 26 * u), k=6, seed=1)
    cam = camera(32)
    cam_path(cam, [(0, (2.0, 14, 2.4), (7.0, -6, 0.8)), (1, (1.0, 12, 2.2), (7.0, 0, 0.8))], n)
    return MB('day')


def kDeerGraze(n):  # シカは、森の下草を、根元まで食べてしまう
    meadow(rgb=hexc('#7a7a4a'))
    rnd = random.Random(3)
    ever_trees([(rnd.uniform(-30, 30), rnd.uniform(4, 50)) for _ in range(40)], seed=3, s=(1.0, 1.6),
               cols=[hexc('#5f7f45'), hexc('#6f8f4e'), hexc('#4f6f3a')])
    # 下草は、食べられて短くなっていく
    gs = grass_tufts([(rnd.uniform(-10, 10), rnd.uniform(-4, 10)) for _ in range(160)], seed=4, h=(0.3, 0.7), per=3)
    for o in gs:
        o.keyframe_insert('scale', frame=1); o.scale = (1, 1, 0.15); o.keyframe_insert('scale', frame=n)
    herd = []
    for i in range(5):
        a = animal((-4 + i * 2.0, rnd.uniform(0, 6), 0), 'deer' if i != 2 else 'fawn', rot_z=rnd.uniform(-1, 1), pose='walk', name=f'gd{i}')
        graze(a, n, f0=rnd.randint(3, 30), down=0.85, seed=i)
    cam = camera(35)
    cam_path(cam, [(0, (-3, -9, 1.6), (0, 3, 0.6)), (1, (-1, -8, 1.5), (0, 3, 0.6))], n)
    return MB('day')


def kBareSlope(n):  # 下草のなくなった山では、雨のたびに、土が流れていく
    s = bpy.context.scene
    sky(hexc('#8c98a4')); s.view_settings.exposure = 0.25
    light_dir((0.3, -0.4, 0.8))
    slope = lambda x, y: 0.42 * y + 0.6 * math.sin(x * 0.4) * math.cos(y * 0.3)
    terrain(80, 50, slope, hexc('#8a6a48'), x0=-40, y0=-10)
    rnd = random.Random(4)
    pts = [(rnd.uniform(-30, 30), rnd.uniform(0, 40)) for _ in range(30)]
    ever_trees([(x, y, slope(x, y)) for x, y in pts], seed=4, s=(1.0, 1.5), cols=[hexc('#5f7f45'), hexc('#4f6f3a')])
    # むき出しの根と石
    msph([(x, y, slope(x, y), rnd.uniform(0.2, 0.5), 1.4, 1, 0.6) for x, y in [(rnd.uniform(-20, 20), rnd.uniform(-5, 25)) for _ in range(40)]], hexc('#7a7670'), 'rk')
    rain(n, (-20, 20), (-10, 30), top=30, k=1200, L=1.2, period=10)
    # 流れる泥水（茶色の粒が斜面を下る）
    starts = []; ends = []
    for k in range(70):
        x = rnd.uniform(-12, 12); y = rnd.uniform(12, 30)
        starts.append((x, y, slope(x, y) + 0.08)); ends.append((x + rnd.uniform(-1, 1), -4, slope(x, -4) + 0.08))
    particles_flow(n, starts, ends, rgb=hexc('#6a4a2a'), size=0.12, period=48, seed=2, a=1.0)
    a = animal((4, 6, slope(4, 6)), 'deer', rot_z=0.6, pose='walk', name='sd')
    graze(a, n, f0=10, down=0.9)
    cam = camera(30)
    cam_path(cam, [(0, (-6, -16, 6), (2, 14, 6)), (1, (-4, -14, 6.5), (2, 14, 6))], n)
    return MB('wind')


def station_plaza(n, seed=9):
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.38
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(size=400, rgb=hexc('#a8a49a'))
    box((0, 22, 6), (44, 12, 12), hexc('#d8d2c4'))  # 駅舎（文字なし）
    box((0, 15.95, 9.5), (14, 0.1, 2.0), hexc('#5a7a9a'))
    for x in (-12, -4, 4, 12):
        box((x, 15.95, 2.0), (5, 0.1, 3.6), hexc('#6f8296'))
    cyl((0, 0, 0.15), 8, 0.3, hexc('#9a958d'), verts=40)  # ロータリーの島
    cyl((0, 0, 0.32), 7.4, 0.06, hexc('#7a9a50'), verts=40)
    for k in range(4):
        cyl((-14 + k * 9, -10, 1.5), 0.08, 3.0, hexc('#8c8e90'))  # 標識の柱（文字なし）
    rnd = random.Random(seed)
    cracks(50, (-25, 25), (-20, 14), seed=seed)
    grass_tufts([(rnd.uniform(-25, 25), rnd.uniform(-20, 14)) for _ in range(160)], seed=seed, h=(0.3, 0.9), per=4)
    tree((-6, 0, 0.3), s=1.4); tree((5, 2, 0.3), s=1.2)


def dig_spots(n, pts, f0, seed=3):
    """掘り返された土が増える"""
    rnd = random.Random(seed)
    for i, (x, y) in enumerate(pts):
        o = msph([(x + rnd.uniform(-0.4, 0.4), y + rnd.uniform(-0.4, 0.4), 0.0, rnd.uniform(0.15, 0.4), 1.3, 1, 0.4) for _ in range(5)], hexc('#5a4030'), 'dirt')
        grow(o, f0 + i * 12, f0 + i * 12 + 24)


def boar_dig(a, n, seed=1):
    """鼻で地面を掘る（首を下げて小刻みに）"""
    nk = O[a['neck']]
    rnd = random.Random(seed)
    base = nk.rotation_euler.x
    f = rnd.randint(1, 10)
    while f < n:
        for k in range(4):
            nk.rotation_euler.x = base + 0.75; nk.keyframe_insert('rotation_euler', index=0, frame=f + k * 6)
            nk.rotation_euler.x = base + 0.45; nk.keyframe_insert('rotation_euler', index=0, frame=f + k * 6 + 3)
        nk.rotation_euler.x = base; nk.keyframe_insert('rotation_euler', index=0, frame=f + 34)
        f += 34 + rnd.randint(10, 30)
    nk.rotation_euler.x = base


def kBoarPlaza(n):  # 駅前では、イノシシが、地面を掘り返している
    station_plaza(n)
    b = boar((2, -4, 0), rot_z=0.4, name='boar0'); boar_dig(b, n, 1)
    for k in range(3):
        u = boar((4 + k * 0.9, -6 + (k % 2) * 0.8, 0), baby=True, rot_z=0.2 + k * 0.4, name=f'uribo{k}'); boar_dig(u, n, 5 + k)
    dig_spots(n, [(2.5, -5.5), (4.5, -7), (1, -3.5), (5.5, -5), (3, -8)], 5)
    cam = camera(35)
    cam_path(cam, [(0, (-6, -14, 2.2), (3, -5, 0.4)), (1, (-4, -13, 2.0), (3, -5, 0.4))], n)
    return MB('day')


def kBoarTown(n):  # 人がいなくなった町には、イノシシが、広がっていく
    residential(n, seed=12)
    rnd = random.Random(12)
    for k in range(7):
        x0 = rnd.choice([-21, -7, 7, 21]) ; y0 = rnd.uniform(-30, 10)
        b = boar((x0, y0, 0), baby=(k % 3 == 2), rot_z=math.pi, name=f'bt{k}')
        b.keyframe_insert('location', frame=1); b.location.y += rnd.uniform(6, 12); b.keyframe_insert('location', frame=n)
        linear(b, 'location')
    cam = camera(28)
    cam_path(cam, [(0, (-30, -40, 22), (0, 0, 0)), (1, (-26, -36, 20), (0, 2, 0))], n)
    return MB('day')


# ---------------- SCENE 09 カラスが、いなくなる（章8） ----------------
def wire_scene(n, k=14, leave=None, seed=3, morning=True):
    """電線のカラス。leave=(f0, f1) で少しずつ飛び去り、最後は数羽"""
    s = bpy.context.scene
    sky(hexc('#c8d8e8')); s.view_settings.exposure = 0.4
    light_dir((0.4, -0.5, 0.6))
    ground(size=300, rgb=hexc('#9a9a8a'))
    for k_ in range(6):
        house((-30 + k_ * 12, 14, 0), w=8, d=7, h=6)
    pole_wires(-14, 14, 4, h=7.0)
    rnd = random.Random(seed)
    crows = []
    xs = sorted(rnd.uniform(-12, 12) for _ in range(k))
    for i, x in enumerate(xs):
        z = 7.0 - (0.4 if i % 2 else 0.9)
        c = crow((x, 4, z + 0.0), rot_z=rnd.uniform(-0.4, 0.4) + math.pi, name=f'crow{i}')
        crows.append(c)
        f_peck = rnd.randint(10, 60)
        # 首を振る（向きを少し変える）
        c.keyframe_insert('rotation_euler', frame=1)
        for f in range(f_peck, n, rnd.randint(40, 70)):
            c.rotation_euler.z = math.pi + rnd.uniform(-0.6, 0.6); c.keyframe_insert('rotation_euler', frame=f)
    caws = []
    if leave:
        f0, f1 = leave
        go = list(range(len(crows))); rnd.shuffle(go)
        go = go[:len(crows) - 2]
        for j, i in enumerate(go):
            c = crows[i]
            f = int(f0 + (f1 - f0) * j / max(1, len(go) - 1))
            c.keyframe_insert('location', frame=f)
            c.location = (c.location.x + rnd.uniform(-20, 20), 40, c.location.z + 14); c.keyframe_insert('location', frame=f + 30)
            flap(c, f, f + 30)
            vanish(c, f + 30)
            caws.append((f, 0.6))
    for f in caw_times(n, every=(40, 80), rnd=rnd):
        caws.append((f, 0.8 if not leave else max(0.2, 1 - f / n)))
    return crows, caws


def kCrowWire(n):  # 東京では、カラスが、減っていく
    cr, caws = wire_scene(n, k=12)
    cam = camera(35)
    cam_path(cam, [(0, (-3, -10, 4.0), (0, 4, 6.3)), (1, (-1, -10, 4.2), (0, 4, 6.3))], n)
    return MB('day', crows=caws)


def garbage_point(loc, empty_=True):
    x, y = loc
    box((x, y, 0.04), (3.0, 1.8, 0.08), hexc('#b8b4aa'))
    box((x, y + 0.9, 0.7), (3.0, 0.1, 1.4), hexc('#c8c4ba'))  # 後ろの塀
    box((x - 1.45, y + 0.2, 0.55), (0.08, 1.4, 1.1), hexc('#c8c4ba'))
    # たたまれた緑のネット（下には何もない）
    o = box((x + 0.6, y + 0.65, 0.12), (1.6, 0.35, 0.08), hexc('#3f7a5a'))
    box((x + 1.2, y + 0.88, 1.15), (0.6, 0.03, 0.4), hexc('#e8e8e0'))  # 何も書いていない札


def kGarbage(n):  # 都会のカラスは、人の出す生ごみを食べて暮らしていた。ごみ集積所には、もう、何も出てこない
    s = bpy.context.scene
    sky(hexc('#d8e0e8')); s.view_settings.exposure = 0.45
    light_dir((0.4, -0.5, 0.6))
    ground(size=200, rgb=hexc('#8a8a84'))
    garbage_point((0, 1))
    for k in range(4):
        house((-14 + k * 9.5, 7, 0), w=8, d=6, h=6)
    rnd = random.Random(5)
    grass_tufts([(rnd.uniform(-6, 6), rnd.uniform(-2, 2)) for _ in range(40)], seed=5, h=(0.2, 0.5), per=3)
    c = crow((-1.0, 0.4, 0.08), rot_z=0.6, name='gcrow')
    peck(c, n, rnd)
    pole_wires(-10, 10, 3, h=6.5)
    cam = camera(35)
    cam_path(cam, [(0, (-3.5, -7, 2.4), (0, 1, 0.5)), (1, (-2.5, -6.2, 2.2), (0, 1, 0.5))], n)
    return MB('day', crows=[(f, 0.6) for f in caw_times(n, every=(50, 90))])


def kCrowFewer(n):  # 電線のカラスは、年ごとに、少なくなる
    cr, caws = wire_scene(n, k=16, leave=(int(n * 0.1), int(n * 0.85)), seed=4)
    cam = camera(30)
    cam_path(cam, [(0, (0, -14, 4.0), (0, 4, 6.0)), (1, (0, -14, 4.0), (0, 4, 6.0))], n)
    return MB('day', crows=caws)


def kTanuki(n):  # 林の中では、タヌキが、木の実を探している
    s = bpy.context.scene
    sky(hexc('#8aa878')); s.view_settings.exposure = 0.3
    light_dir((0.3, -0.4, 0.8)); s.display.shading.shadow_intensity = 0.55
    ground(size=200, rgb=hexc('#6a5a3a'))
    rnd = random.Random(6)
    ever_trees([(rnd.uniform(-20, 20), rnd.uniform(2, 30)) for _ in range(30)], seed=6, s=(1.0, 1.6),
               cols=[hexc('#5f7f45'), hexc('#6f8f4e'), hexc('#7a8a40')])
    msph([(rnd.uniform(-8, 8), rnd.uniform(-3, 8), 0.0, rnd.uniform(0.5, 1.2), 1, 1, 0.05) for _ in range(40)], hexc('#8a6a3a'), 'leaves')
    for k in range(30):
        acorn((rnd.uniform(-3, 3), rnd.uniform(-1.5, 3), 0.0), s=1.4)
    t1 = tanuki((-2.5, 0.5, 0), rot_z=-1.2, name='tanuki1')
    t1.keyframe_insert('location', frame=1); t1.location = (1.5, 1.4, 0); t1.keyframe_insert('location', frame=int(n * 0.6))
    graze(t1, n, f0=int(n * 0.62), down=0.6, seed=2)
    t2 = tanuki((1.8, 3.0, 0), rot_z=2.4, pose='walk', name='tanuki2', s=1.2)
    graze(t2, n, f0=5, down=0.6, seed=3)
    cam = camera(35)
    cam_path(cam, [(0, (-1, -6, 1.2), (0, 1.5, 0.3)), (1, (0.2, -5.2, 1.1), (0.5, 1.5, 0.3))], n)
    return MB('garden', insects=0.4)


# ---------------- SCENE 10 百年前に設計された森（章9） ----------------
def forest_city(n, spread=None, seed=31):
    """上から：西側に深い森、東側にビルの街。spread=(f0, f1) で森の木が街へ広がる"""
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.35
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(size=1400, rgb=hexc('#7a8060'))
    city_blocks(nx=10, ny=12, pitch=26, seed=seed, lit=0.0, night=False, cx=120, cy=0, hr=(12, 50), dark_win=hexc('#5a6a72'))
    rnd = random.Random(seed)
    # 深い森（西側の大きな区画）
    pts = [(rnd.uniform(-220, -10), rnd.uniform(-160, 160)) for _ in range(900)]
    ever_trees(pts, seed=seed, s=(1.8, 2.8), trunk=False)
    if spread:
        f0, f1 = spread
        pts = []
        for i in range(900):
            x = rnd.uniform(-5, 260); y = rnd.uniform(-160, 160)
            pts.append((x, y))
        rings = 12
        for r in range(rings):
            gp = [p for p in pts if r * 260 / rings <= p[0] + 5 < (r + 1) * 260 / rings]
            objs = ever_trees(gp, seed=r, s=(1.4, 2.4), trunk=False, name='spread')
            f = int(f0 + (f1 - f0) * r / rings)
            for o in objs:
                grow(o, f, f + 30)


def kShibuyaForest(n):  # 百年後。渋谷のすぐ隣に、深い森がある
    forest_city(n)
    cam = camera(28)
    cam_path(cam, [(0, (160, -330, 260), (40, 0, 0)), (1, (120, -320, 240), (20, 0, 0))], n)
    return MB('day')


def kMeijiForest(n):  # 明治神宮の森。人の手を借りずに続いていく森として、設計された
    s = bpy.context.scene
    sky(hexc('#7a9a70')); s.view_settings.exposure = 0.22
    light_dir((0.2, -0.3, 0.9)); s.display.shading.shadow_intensity = 0.65
    ground(size=300, rgb=hexc('#4a4a30'))
    rnd = random.Random(8)
    pts = [(rnd.uniform(-40, 40), rnd.uniform(-10, 60)) for _ in range(130)]
    pts = [p for p in pts if abs(p[0]) > 4.0]
    ever_trees(pts, seed=8, s=(2.0, 3.2))
    ever_trees([(rnd.uniform(-30, 30), rnd.uniform(-5, 40)) for _ in range(60)], seed=9, s=(0.6, 1.0))  # 低い木
    box((0, 20, 0.02), (6, 80, 0.04), hexc('#c8bea8'))  # 参道の砂利
    msph([(rnd.uniform(-30, 30), rnd.uniform(-5, 40), 0.0, rnd.uniform(0.8, 2.0), 1, 1, 0.05) for _ in range(80)], hexc('#6a5a3a'), 'leaves')
    light_shafts(k=6, seed=4, h=24)
    cam = camera(28)
    cam_path(cam, [(0, (0, -8, 1.7), (0, 30, 6)), (1, (0, -2, 1.7), (0, 30, 9))], n)
    return MB('garden')


def kPlanting(n):  # 全国から木が運ばれ、人が植えた森（昔の場面）
    meadow(rgb=hexc('#a89a70'), sky_c=hexc('#c8d8e0'), exp=0.42)
    rnd = random.Random(10)
    saps = []
    for k in range(40):
        x, y = rnd.uniform(-14, 14), rnd.uniform(-2, 20)
        saps.append((x, y))
        young_tree((x, y, 0), s=rnd.uniform(0.5, 0.9), seed=k, c=rnd.choice(EVERGREEN))
    # 運ばれてきた苗木の荷車
    box((-6, -3, 0.7), (2.4, 1.4, 0.3), hexc('#8a6a48'))
    for sx in (-1, 1):
        cyl((-6 + sx * 0.9, -3.75, 0.45), 0.45, 0.1, hexc('#5a4030'), rot=(math.pi / 2, 0, 0))
    for k in range(6):
        young_tree((-6.8 + k * 0.3, -3 + (k % 2) * 0.3, 0.85), s=0.35, seed=50 + k, c=EVERGREEN[k % 4])
    ppl = []
    for k in range(8):
        x, y = rnd.uniform(-10, 10), rnd.uniform(0, 10)
        p = person((x, y, 0), rnd.choice([hexc('#d8d0c0'), hexc('#5a6a7a'), hexc('#8a7a5a')]), pants=hexc('#4a4a48'),
                   skin=rnd.choice(SKIN[:3]), rot_z=rnd.uniform(-2, 2), act='type', name=f'pl{k}')
        cyl((x + 0.3, y - 0.3, 0.6), 0.025, 1.2, hexc('#8a6a48'), rot=(0.3, 0, 0))  # すき
        ppl.append(p)
    w = person((-12, 2, 0), hexc('#5a6a7a'), act=None, name='carry')
    w.keyframe_insert('location', frame=1); w.location = (-5, 4, 0); w.keyframe_insert('location', frame=n)
    cam = camera(32)
    cam_path(cam, [(0, (-12, -16, 4), (0, 6, 1)), (1, (-8, -16, 4), (2, 6, 1))], n)
    return MB('day')


def kForestSpread(n):  # その森の木が、まわりの街へ、広がっていく（上から・早回し）
    forest_city(n, spread=(int(n * 0.05), int(n * 0.92)))
    cam = camera(28)
    cam_path(cam, [(0, (100, -330, 300), (90, -10, 0)), (1, (110, -300, 280), (110, -10, 0))], n)
    return MB('day')


def kCross100(n):  # 東京の真ん中で、百年前に人が描いた森が、街を包んでいく（交差点）
    crossing(n, 100)
    cam = camera(28)
    cam_path(cam, [(0, (3, -58, 26), (0, 0, 2)), (1, (-3, -70, 36), (0, 2, 2))], n)
    return MB('garden')
