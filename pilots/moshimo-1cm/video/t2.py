"""カット：SCENE 09〜15（章8〜14）とエンドカード（章15）"""
from t1 import *
from kit import _osc, _blinks


# ---------------- SCENE 09 葉っぱの下の先客（章8） ----------------
def under_leaf(n, rainy=True):
    garden(rainy=rainy, wet=rainy)
    lf = leaf_plant((0, 4, 0))
    rnd = random.Random(4)
    _osc(lf, 'rotation_euler', 0, lf.rotation_euler.x, 0.06, 40, n, rnd)
    return lf


def tAntGuest(n):  # 葉っぱの下に、先客。アリは、あなたとほとんど同じ大きさ
    under_leaf(n)
    p = you((0.4, 1.2, 0), rot_z=-0.9)
    a = ant_k((-1.9, 2.0, 0), rot_z=-math.pi / 2 - 0.3)
    ant_idle(a, n, seed=5)
    rain_streaks(n, 24, (-30, 30), (-8, 40), 60, seed=7, speed=10.0)
    cam = cam1(32)
    cam_path(cam, [(0, (-0.5, -4.5, 1.2), (-0.7, 1.6, 0.8)), (1, (0.8, -4.0, 1.0), (-0.7, 1.6, 0.8))], n)
    return MB(amb='sea')


def wall_dark(y=34.0):
    block_wall(y, -300, 300, c=hexc('#8d8a82'))
    sh = plane((0, y - 18, 0.05), (600, 36), (1, 1, 1))
    sh.data.materials.clear(); sh.data.materials.append(gmat((0.05, 0.05, 0.08), 0.45, 'dark'))
    sh.visible_shadow = False


def tSpider(n):  # 塀の暗がりで、大きなクモの脚が動く。広げた脚は、背の十倍以上
    garden(rainy=True, wet=True)
    wall_dark(34.0)
    sp = spider((4, 24, 0), span=22.0, rot_z=math.pi + 0.3)
    spider_live(sp, n, walk=(int(n * 0.2), n, (2, 17, 0)))
    p = you((-3.5, 4.5, 0), rot_z=math.pi * 0.9)
    look_up(p, -0.2)
    a = ant_k((-6.0, 4.0, 0), rot_z=math.pi * 0.8); ant_idle(a, n)
    cam = cam1(26)
    cam_path(cam, [(0, (-6.5, -3.0, 1.6), (2, 20, 3.0)), (1, (-5.5, -1.5, 1.8), (2, 17, 3.5))], n)
    return MB(amb='sea')


def tAntLeaves(n):  # アリが、すっと離れていく。あなたも後ずさる
    under_leaf(n)
    wall_dark(40.0)
    sp = spider((2, 24, 0), span=22.0, rot_z=math.pi + 0.2); spider_live(sp, n)
    a = ant_k((-1.5, 2.5, 0), rot_z=0); ants = [a]
    ant_walk(ants, n, (-1.5, 2.5, 0), (-40, -10, 0), speed=2.5)
    p = you((0.6, 1.4, 0), rot_z=math.pi)
    car_ = carrier_of(p)
    car_.keyframe_insert('location', frame=int(n * 0.2))
    car_.location = (0.9, -1.6, 0); car_.keyframe_insert('location', frame=int(n * 0.8))
    cam = cam1(28)
    cam_path(cam, [(0, (3.5, -6.0, 1.4), (0, 4, 2.0)), (1, (2.5, -7.0, 1.6), (0, 6, 2.5))], n)
    return MB(amb='sea')


# ---------------- SCENE 10 空を横切る影（章9） ----------------
def bird_shadow(n, y=0.0, z=0.08, x0=-260, x1=260, f0=1, f1=None):
    root = empty((x0, y, z), 'bshadow')
    m = gmat((0.05, 0.05, 0.06), 0.42, 'bshadow')
    for loc, r, sc in (((0, 0, 0), 1, (6, 14, 0.01)), ((0, -2, 0), 1, (28, 5, 0.01)), ((0, 12, 0), 1, (4, 6, 0.01))):
        o = sphere(loc, r, (1, 1, 1), scale=sc, seg=16); o.data.materials.clear(); o.data.materials.append(m)
        o.visible_shadow = False; link(o, root)
    root.rotation_euler.z = -math.pi / 2
    root.keyframe_insert('location', frame=f0)
    root.location.x = x1; root.keyframe_insert('location', frame=f1 or n)
    set_interp(root, 'LINEAR', 'location')
    return root


def tShadowPass(n):  # 雨が上がる。庭の上を、大きな影が横切る
    garden()
    lf = leaf_plant((0, 4, 0))
    p = you((0.8, -1.5, 0), rot_z=0.2)
    nk = O[p['neck']]
    f0 = int(n * 0.4)
    bird_shadow(n, y=-1.0, f0=f0, f1=f0 + 30)
    nk.keyframe_insert('rotation_euler', frame=f0 + 10); nk.rotation_euler.x = -0.7; nk.keyframe_insert('rotation_euler', frame=f0 + 20)
    b = sparrow_k((-220, 30, 90), rot_z=-math.pi / 2)
    b.keyframe_insert('location', frame=f0)
    b.location = (240, 30, 70); b.keyframe_insert('location', frame=f0 + 32)
    flap(b, 1, n)
    cam = cam1(24)
    cam_path(cam, [(0, (5, -9, 1.4), (0, 2, 2.0)), (1, (6.5, -10, 1.6), (0, 6, 6.0))], n)
    return MB(amb='garden', crows=[])


def tSparrow(n):  # スズメが地面に降りて、虫をついばむ。体は背の十倍以上
    garden()
    b = sparrow_k((2, 34, 0), rot_z=math.pi * 0.42)
    peck(b, n, random.Random(4))
    for k in range(4):
        bug((2 + RT.uniform(-6, 6), 26 + RT.uniform(-4, 4), 0), s=60, rot_z=RT.uniform(0, 6))
    p = you((-0.5, 6.0, 0), rot_z=math.pi)
    look_up(p, -0.3)
    q = family((1.5, 5.0, 0), 0, rot_z=math.pi * 1.1)
    cam = cam1(26)
    cam_path(cam, [(0, (-3.5, -3.0, 1.2), (1, 30, 9)), (1, (-1.5, -4.0, 1.0), (1.5, 30, 11))], n)
    return MB(amb='garden')


def tCrowWire(n):  # 電線にカラス。見上げると、ビルのような高さ
    setup_light(hexc('#a8cbe8'), exp=0.45, ld=(0.5, -0.4, 0.7), shadow=0.5)
    plane((0, 0, 0), (60 * K, 60 * K), hexc('#7a6248'))
    H = 6.0 * K
    cyl((-0.9 * K, 0.4 * K, H / 2), 0.14 * K, H + 0.4 * K, hexc('#8c8a86'), verts=24)
    box((-0.9 * K, 0.4 * K, H + 0.1 * K), (1.4 * K, 0.1 * K, 0.1 * K), hexc('#6a6864'))
    for dz in (0, -0.45 * K):
        box((0, 0.4 * K, H + dz), (40 * K, 2.5, 2.5), hexc('#2a2a2a'))
    c = crow_k((0.6 * K, 0.4 * K, H + 1.0), rot_z=math.pi * 0.85)
    bird_live(c, n, random.Random(2), peck_=False)
    p = you((0, 0, 0), rot_z=math.pi)
    look_up(p, -0.9)
    for k in range(40):
        cone((RT.uniform(-60, 60), RT.uniform(-60, 60), 6), 1.0, 12, hexc('#5f8a3e'), verts=4)
    cam = cam1(24)
    cam_path(cam, [(0, (1.5, -4.5, 1.2), (0, 2, 2.0)), (0.35, (1.5, -4.5, 1.2), (0, 2, 2.0)), (1, (1.0, -5.0, 1.0), (0.6 * K * 0.98, 0.4 * K, H + 40))], n,
             lens_keys=[(0, 24), (0.35, 24), (1, 60)])
    m = MB(amb='garden'); m['crows'] = [(int(n * 0.6), 0.9), (int(n * 0.85), 0.7)]
    return m


def tPotHide(n):  # 植木鉢の陰に、隠れる
    garden()
    pot((0, 24, 0))
    b = sparrow_k((-40, 70, 0), rot_z=math.pi * 0.7)
    peck(b, n, random.Random(6))
    ps = [you((10, -6, 0), rot_z=0), family((13, -8, 0), 0), family((7, -9, 0), 1)]
    for k, q in enumerate(ps):
        x, y = q.location.x, q.location.y
        move(q, [(1, (x, y, 0)), (int(n * 0.6) + k * 6, (6 + k * 2.0, 44 + k * 1.5, 0))])
    cam = cam1(26)
    cam_path(cam, [(0, (26, -14, 3.0), (6, 20, 4)), (1, (30, -4, 3.5), (2, 34, 5))], n)
    return MB(amb='garden')


# ---------------- SCENE 11 減らないおにぎり（章10） ----------------
def tJapanDots(n):  # 一週間後。日本中の人の一日の食事を、合わせる：日本地図に小さな光の点が広がる
    space_globe()
    pts = [(lo, la) for lo, la in land_points(129, 146, 30.5, 45.5, 600, seed=3) if not (la > 41.6 and lo < 139.6) and not (lo < 130.6 and la > 33.6)][:320]
    dots(pts, 10, int(n * 0.7), size=0.025)
    cam = cam1(50, clip=(0.1, 3000))
    cam_path(cam, [(0, P(137, 37, 13.5), P(137, 37, 0)), (1, P(137, 36, 11.0), P(137, 36, 0))], n)
    return MB(amb='space')


def tVillage(n):  # ふつうの大きさの人の、村ひとつ分のごはんで足りる（ふつうの縮尺）
    meadow(rgb=hexc('#9cb46a'), exp=0.42)
    rnd = random.Random(12)
    for i in range(14):
        a = i / 14 * 6.28 + rnd.uniform(-0.2, 0.2); r = rnd.uniform(14, 30)
        house((math.cos(a) * r, math.sin(a) * r, 0), w=rnd.uniform(6, 8), d=rnd.uniform(5, 7), h=rnd.uniform(4.5, 6), rot_z=a + math.pi / 2)
    for i in range(5):
        plane((rnd.uniform(-50, 50), rnd.uniform(35, 60), 0.02), (rnd.uniform(14, 24), rnd.uniform(10, 16)), hexc('#c8b45a'))
    for i in range(16):
        tree((rnd.uniform(-60, 60), rnd.uniform(-60, 60), 0), s=rnd.uniform(0.8, 1.3))
    for i in range(12):
        p = crowd((rnd.uniform(-8, 8), rnd.uniform(-8, 8), 0), rnd, name=f'v{i}')
        x, y = p.location.x, p.location.y; a = rnd.uniform(0, 6.28)
        move(p, [(1, (x, y, 0)), (n, (x + math.cos(a) * 6, y + math.sin(a) * 6, 0))])
    cam = cam1(32, clip=(0.1, 3000))
    cam_path(cam, [(0, (-42, -48, 26), (0, 0, 0)), (1, (-20, -55, 20), (4, 2, 0))], n)
    return MB(amb='day')


def tOnigiriShelf(n):  # コンビニのおにぎりの棚は、ほとんど減らない（ふつうの縮尺）
    setup_light(hexc('#f4f6f8'), exp=0.6, ld=(0.2, -0.4, 0.9), shadow=0.35)
    plane((0, 0, 0), (40, 40), hexc('#e8e6e0'))
    box((0, 0.5, 1.3), (6, 0.1, 2.6), hexc('#f2f2ee'))
    for k, z in enumerate((0.35, 0.75, 1.15, 1.55)):
        box((0, 0.2, z - 0.02), (5.0, 0.6, 0.03), hexc('#c8ccd0'))
        box((0, -0.1, z + 0.02), (5.0, 0.02, 0.06), hexc('#e2564a') if k % 2 else hexc('#4a8ad0'))
        for i in range(36):
            for j in range(2):
                onigiri((-2.35 + i * 0.134, 0.0 + j * 0.16, z), s=1.0, rot_z=0.0)
    box((0, 0.2, 1.95), (5.0, 0.6, 0.06), hexc('#f8f8f4'))
    cam = cam1(30, clip=(0.02, 500))
    cam_path(cam, [(0, (-2.4, -1.6, 1.3), (-0.6, 0.2, 0.9)), (1, (1.0, -1.5, 1.25), (2.0, 0.2, 0.9))], n)
    return MB(amb='room')


def rice_plant(loc, rnd):
    x, y = loc
    root = empty((x, y, 0), 'ine')
    for k in range(3):
        a = rnd.uniform(0, 6.28)
        top = Vector((x + math.cos(a) * 0.05, y + math.sin(a) * 0.05, 0.85 + rnd.uniform(-0.08, 0.06)))
        bar((x, y, 0), tuple(top), 0.006, hexc('#b8a24a'))
        tip = top + Vector((math.cos(a) * 0.12, math.sin(a) * 0.12, -0.14))
        bar(tuple(top), tuple(tip), 0.014, hexc('#e0b84a'))
    return root


def tRiceField(n):  # 刈る人のいない田んぼで、稲が実っていく。余った食べ物の匂いに、集まってくるもの
    meadow(rgb=hexc('#8a7a4a'), sky_c=hexc('#cfe0ee'), exp=0.45)
    rnd = random.Random(3)
    for i in range(16):
        for j in range(9):
            rice_plant((-5 + i * 0.6 + rnd.uniform(-0.04, 0.04), 1 + j * 0.55 + rnd.uniform(-0.04, 0.04)), rnd)
    plane((0, 0.3, 0.005), (30, 0.7), hexc('#9a8a6a'))
    for k in range(6):
        tree((-12 + k * 5, 14, 0), s=1.1)
    r = rat((-0.6, 0.2, 0), s=1.0, rot_z=0.4)
    rat_live(r, n)
    peek(r, n, int(n * 0.6))
    cam = cam1(30, clip=(0.02, 800))
    cam_path(cam, [(0, (-4.0, -3.5, 1.4), (0, 4, 0.6)), (1, (-2.0, -3.2, 0.9), (-0.4, 1.5, 0.3))], n)
    return MB(amb='garden')


# ---------------- SCENE 12 ネズミの夜（章11） ----------------
def rice_bag(loc=(0, 70, 0)):
    x, y, z = loc
    root = empty(loc, 'bag')
    link(box((0, 0, 30), (44, 26, 60), hexc('#d8c8a0'), bevel=2.0), root)
    link(box((0, -13.2, 34), (30, 0.4, 16), hexc('#c0503a')), root)
    link(box((0, 0, 61), (40, 22, 3), hexc('#c8b890'), bevel=1.0), root)
    link(sphere((6, -13.0, 5), 1.0, hexc('#1a1410'), scale=(5, 0.6, 4)), root)  # かじられた穴
    rnd = random.Random(9)
    for i in range(160):
        a = rnd.uniform(-1.4, 1.4); r = rnd.uniform(0, 22) ** 1.0
        raw_rice((x + 6 + math.sin(a) * r, y - 14 - math.cos(a) * r * 0.9, 0.25), rot_z=rnd.uniform(0, 6.28), s=0.75)
    return root


def tRiceBag(n):  # 十日後の夜の台所。米の袋がかじられ、床に米粒がこぼれている
    kitchen(night=True)
    rice_bag()
    cam = cam1(28)
    cam_path(cam, [(0, (-30, 18, 3.0), (4, 60, 6)), (1, (-14, 22, 2.0), (6, 58, 4))], n)
    return MB(amb='night')


def tRatShadow(n):  # 壁に大きな影が伸びる。ネズミ
    kitchen(night=True)
    light_dir((0.15, -0.75, 0.4))
    rice_bag()
    r = rat((40, 30, 0), s=200, rot_z=math.pi * 0.75)
    move(r, [(1, (60, 20, 0)), (int(n * 0.6), (14, 52, 0))])
    rat_live(r, n, seed=5)
    ps = [floor_sit(family((-8 - k * 2.5, 18, 0), k, pose='sit', rot_z=math.pi * 0.8 + k * 0.2)) for k in range(2)]
    cam = cam1(24)
    cam_path(cam, [(0, (-18, -20, 4), (20, 60, 25)), (1, (-12, -14, 3), (16, 60, 20))], n)
    return MB(amb='night')


def tAlleyRats(n):  # 食べ物が余った街で、ネズミが増えていく（ふつうの縮尺）
    env_alley()
    rnd = random.Random(4)
    for i in range(9):
        x = rnd.uniform(-1.5, 1.5); y0 = rnd.uniform(0, 12)
        r = rat((x, y0, 0), s=1.0, rot_z=math.pi)
        move(r, [(1, (x, y0, 0)), (n, (x + rnd.uniform(-0.6, 0.6), y0 - rnd.uniform(3, 7), 0))])
        rat_live(r, n, seed=i)
    cam = cam1(30, clip=(0.02, 500))
    cam_path(cam, [(0, (0.4, -4.0, 0.7), (0, 6, 0.2)), (1, (-0.2, -3.2, 0.5), (0, 6, 0.15))], n)
    return MB(amb='night')


def tHolding(n):  # 物陰で、小さな人たちが、息を止める
    kitchen(night=True)
    light_dir((0.15, -0.75, 0.4))
    rice_bag()
    cyl((-14, 20, 8.5), 7.0, 17, hexc('#e8e4dc'), verts=32)  # 落ちた湯のみの陰
    ps = [floor_sit(you((-16.0, 12.6, 0), rot_z=math.pi * 0.85, pose='sit')), floor_sit(family((-13.8, 12.4, 0), 0, rot_z=math.pi * 1.1, pose='sit')),
          floor_sit(family((-18.0, 13.2, 0), 1, rot_z=math.pi * 0.7, pose='sit'))]
    for q in ps:
        arm_to(q, 1, (0.02, -0.2, 1.12)); arm_to(q, 0, (-0.02, -0.2, 1.12))  # 口を押さえる
    r = rat((18, 44, 0), s=200, rot_z=math.pi * 0.9)
    rat_live(r, n, seed=8)
    cam = cam1(30)
    cam_path(cam, [(0, (-15.5, 7.5, 1.2), (-15.5, 14, 0.9)), (1, (-17.5, 8.0, 1.1), (-15.5, 14, 0.9))], n)
    return MB(amb='night')


# ---------------- SCENE 13 金色の目が光る（章12） ----------------
def glow_eyes(c, a=0.35):
    for sx in (-1, 1):
        ball((sx * 0.042, -0.09, 0.024), 0.026, (1.0, 0.85, 0.3), a=0.22, seg=16, parent=O[c['head']], name='eglow').visible_shadow = False


def night_cat(loc, pose='crouch', rot_z=0.0, name='tora'):
    c = tora(loc, pose=pose, rot_z=rot_z, name=name)
    glow_eyes(c)
    return c


def tGoldEyes(n):  # 暗がりで、金色の目が二つ光る。家の猫
    kitchen(night=True)
    sky(hexc('#06080e')); bpy.context.scene.view_settings.exposure = -0.6
    rice_bag()
    c = night_cat((-40, 120, 0), pose='crouch', rot_z=0.15)
    cat_still(c, n, seed=7, head_amp=0.02)
    e = eye_world(c, 1)
    cam = cam1(40)
    cam_path(cam, [(0, (-30, 40, 8), tuple(e)), (1, (-34, 60, 10), tuple(e))], n)
    return MB(amb='night')


def tCatCrouch(n):  # 猫は、低くかがむ
    kitchen(night=True)
    sky(hexc('#06080e')); bpy.context.scene.view_settings.exposure = -0.35
    rice_bag()
    c = night_cat((-60, 110, 0), pose='crouch', rot_z=0.89)
    r = rat((14, 50, 0), s=200, rot_z=math.pi * 0.9); rat_live(r, n, seed=2)
    cam = cam1(26)
    cam_path(cam, [(0, (-90, 40, 6), (-40, 100, 14)), (1, (-80, 50, 5), (-30, 95, 12))], n)
    return MB(amb='night')


def tPounce(n):  # 一瞬で、ネズミに飛びかかる。ネズミが台所から逃げていく
    kitchen(night=True)
    sky(hexc('#06080e')); bpy.context.scene.view_settings.exposure = -0.3
    rice_bag()
    fj = int(n * 0.22)
    c1 = night_cat((-60, 110, 0), pose='crouch', rot_z=0.89, name='tora_c')
    vanish(c1, fj)
    c2 = night_cat((-60, 110, 0), pose='walk', rot_z=0.89, name='tora_w')
    appear(c2, fj)
    c2.keyframe_insert('location', frame=fj)
    c2.location = (-30, 80, 40); c2.keyframe_insert('location', frame=fj + 6)
    c2.location = (4, 52, 0); c2.keyframe_insert('location', frame=fj + 14)
    c2.keyframe_insert('location', frame=n)
    r = rat((14, 48, 0), s=200, rot_z=math.pi * 0.9); rat_live(r, n, seed=3)
    r.keyframe_insert('location', frame=fj + 4)
    r.location = (140, -40, 0); r.keyframe_insert('location', frame=fj + 40)
    r.rotation_euler.z = -math.pi * 0.7; r.keyframe_insert('rotation_euler', index=2, frame=fj + 6)
    cam = cam1(22)
    cam_path(cam, [(0, (-40, -50, 12), (-20, 80, 10)), (1, (-20, -60, 10), (20, 50, 10))], n)
    return MB(amb='night')


def tPawFloor(n):  # 床に下りたのは、あの朝あなたを追いかけた、同じ前足
    kitchen(night=True)
    sky(hexc('#06080e')); bpy.context.scene.view_settings.exposure = -0.2
    c = night_cat((0, 40, 0), pose='walk', rot_z=math.pi * 0.5)
    j = O[c['legs'][0]]
    j.rotation_euler.x = -0.7; j.keyframe_insert('rotation_euler', frame=1)
    j.rotation_euler.x = 0.0; j.keyframe_insert('rotation_euler', frame=14)
    legs = list(c['legs']); legs.remove(j.name); c['legs'] = legs
    bpy.context.view_layer.update()
    paw = j.matrix_world @ Vector((0, -0.012, -0.178))
    ps = [you((paw.x - 9, paw.y - 10, 0), rot_z=-0.4), family((paw.x - 11, paw.y - 9, 0), 0, rot_z=-0.6)]
    for q in ps:
        look_up(q, -0.4)
    cam = cam1(22)
    cam_path(cam, [(0, (paw.x - 14, paw.y - 18, 1.5), (paw.x, paw.y, 4)), (1, (paw.x - 12, paw.y - 19, 1.2), (paw.x, paw.y, 6))], n)
    return MB(amb='night')


# ---------------- SCENE 14 猫のいる家（章13） ----------------
def shelf_life(S):
    """棚の上の暮らし：ハンカチの布団、ボタンのテーブル"""
    hanky((-40, 158, S), w=8, d=11)
    hanky((-28, 160, S), w=8, d=11, c=hexc('#f2b8a8'))
    lie = family((-40, 160, S + 0.32), 2, pose='lie', rot_z=math.pi)
    lie_fix(lie)
    ps = []
    for k, (bx, by, col) in enumerate(((-10, 156, hexc('#d84a4a')), (8, 158, hexc('#3a7ad0')), (24, 155, hexc('#e8c040')))):
        button((bx, by, S), r=1.8, c=col)
        for m in range(3):
            a = m / 3 * 6.28 + k
            pr = random.Random(k * 3 + m)
            loc = (bx + math.cos(a) * 2.7, by + math.sin(a) * 2.7, S)
            # 前（-y）をボタンの中心へ向ける
            rz = math.atan2(-(bx - loc[0]), (by - loc[1])) + math.pi
            q = you(loc, rot_z=rz, pose='sit') if (k == 0 and m == 0) else crowd(loc, pr, rot_z=rz, pose='sit', name=f's{k}{m}')
            floor_sit(q)
            ps.append(q)
    for k in range(4):
        q = crowd((40 + k * 3, 152, S), random.Random(40 + k), rot_z=math.pi * 0.5, name=f'w{k}')
        move(q, [(1, (40 + k * 3, 152, S)), (300, (16 + k * 3, 150, S))])
    cyl((52, 162, S + 6), 4.5, 12, hexc('#9ab0c8'), verts=24)  # コップ
    return ps


def tShelfLife(n):  # 一か月後。人々は、猫のいる家の棚の上で暮らしている
    S = shelf_set()
    shelf_life(S)
    cam = cam1(26)
    cam_path(cam, [(0, (-34, 141, S + 5), (-22, 157, S + 0.5)), (1, (14, 140, S + 5), (24, 156, S + 0.5))], n)
    return MB(amb='room')


def sleep_cat(loc, rot_z=0.0, name='tora'):
    c = tora(loc, pose='crouch', rot_z=rot_z, name=name)
    close_eyes(c)
    nk = O[c['neck']]; nk.rotation_euler.x = 0.35; nk.location.z -= 0.05
    tail = O[c['tail']]; tail.rotation_euler = (math.pi / 2, 0, -1.3)
    return c


def tCatSleep(n):  # 棚の下では、猫が丸くなって眠っている。猫が起きている家に、ネズミは近づかない
    S = shelf_set()
    shelf_life(S)
    c = sleep_cat((-20, 60, 0), rot_z=math.pi * 0.6)
    for k in range(3):
        q = floor_sit(family((-22 + k * 2.6, 125.8, S), k, rot_z=0, pose='sit')); look_up(q, 0.5)
    cam = cam1(24)
    cam_path(cam, [(0, (-48, 116, S + 6), (-20, 66, 10)), (1, (-44, 114, S + 8), (-20, 62, 8))], n)
    return MB(amb='room', purr=0.4)


def tWindowCats(n):  # 窓辺の猫が、外の通りを見張っている（ふつうの縮尺）
    sky(hexc('#b7d0e6')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    light_dir((0.4, -0.5, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(300, rgb=hexc('#c2bcb0'))
    plane((0, -6, 0.01), (200, 6), hexc('#8b8680'))
    rnd = random.Random(7)
    coats = ['tora', 'kuro', 'saba', 'shiro', 'mike', 'hachi']
    for i in range(7):
        x = -24 + i * 8
        house((x, 2, 0), w=7, d=6, h=6, rot_z=0, floors=2)
        for k, wx in enumerate((-1.75, 1.75)):
            if (i + k) % 2:
                continue
            box((x + wx, -1.15, 1.0), (1.7, 0.4, 0.06), hexc('#e8e2d6'))
            c = cat((x + wx, -1.2, 1.03), coats[(i + k) % 6], s=0.75, rot_z=rnd.uniform(-0.3, 0.3))
    cam = cam1(32, clip=(0.05, 2000))
    cam_path(cam, [(0, (-29, -4.2, 1.4), (-25.5, -1.2, 1.25)), (1, (-20, -4.6, 1.5), (-13, -1.2, 1.25))], n)
    return MB(amb='day')


def tNeighbor(n):  # 一番こわかった猫が、一番頼れる隣人になった
    S = shelf_set()
    shelf_life(S)
    c = tora((10, 90, 0), pose='crouch', rot_z=math.pi * 0.95)
    nk = O[c['neck']]; nk.rotation_euler.x = -0.35
    edge = [you((4 + k * 2.4, 124.6, S), rot_z=0, name=f'e{k}') if k == 1 else family((4 + k * 2.4, 124.6, S), k, rot_z=0) for k in range(3)]
    for q in edge:
        look_up(q, 0.6)
    arm_up(edge[1], 1)
    cam = cam1(30)
    cam_path(cam, [(0, (-12, 117, S + 5), (8, 95, S - 70)), (1, (-14, 116, S + 7), (8, 92, S - 80))], n)
    return MB(amb='room', purr=0.3)


# ---------------- SCENE 15 同じ朝（章14） ----------------
tEye2 = None  # shots_1cm.py で tEye を使い回す


def tEyeClose(n):  # 猫は前足を上げずに、そのまま目を閉じる。のどが大きく鳴る
    Q, c, y = morning_bed(n, slit=(1, 2, 0.28, 0.28))
    look_up(y, -0.5)
    close_eyes(c, int(n * 0.3))
    c['eyes'] = []
    cat_still(c, n, seed=9, head_amp=0.01)
    e = eye_world(c, 1); e2 = eye_world(c, -1); mid = (e + e2) / 2
    fwd = (cat_world(c, (0, -1.0, 0)) - cat_world(c, (0, 0, 0))).normalized()
    cam = cam1(40)
    cam_path(cam, [(0, tuple(mid + fwd * 20 + Vector((0, 0, -3))), tuple(mid + Vector((0, 0, -2)))), (1, tuple(mid + fwd * 28 + Vector((0, 0, -6))), tuple(mid + Vector((0, 0, -4))))], n)
    return MB(amb='room', purr=1.0)


def fur_bed(n):
    Q = bedroom()
    c = sleep_cat((100, 150, Q), rot_z=math.pi * 0.5)
    p = you((103, 134.0, Q + 0.2), pose='lie', rot_z=math.pi * 0.5)
    lie_fix(p)
    return Q, c, p


def tFurSleep(n):  # 温かい毛の中で、あなたは、もう一度、眠る（窓から朝の光）
    Q, c, p = fur_bed(n)
    cam = cam1(28)
    cam_path(cam, [(0, (112, 124, Q + 4), (102, 140, Q + 5)), (1, (150, 80, Q + 45), (100, 145, Q + 10))], n)
    return MB(amb='room', purr=0.9)


def tEnd(n):  # エンドカード：朝の光の部屋。ベッドの上で眠る猫
    Q, c, p = fur_bed(n)
    cam = cam1(32)
    cam_path(cam, [(0, (-150, -160, 260), (100, 140, Q)), (1, (-220, -240, 300), (100, 140, Q))], n)
    return MB(amb='room', purr=0.5)
