"""カット：SCENE 11〜15（章10〜14）と エンドカード（章15）：
灰の降る東京／千年の寺／残るのは土と石と焼き物／目を覚ます／天の川の下で"""
from ms2 import *


# ---------------- SCENE 11 灰の降る東京（章10） ----------------
def forest_tokyo(n, ash=None, seed=41, ruins=True):
    """森になった東京（ところどころにビルが残る）。ash=(f0, f1) で木の葉が灰色になる"""
    s = bpy.context.scene
    sky(hexc('#a8c0d8')); s.view_settings.exposure = 0.32
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(size=2400, rgb=hexc('#4f6a3a'))
    rnd = random.Random(seed)
    pts = [(rnd.uniform(-300, 300), rnd.uniform(-200, 400)) for _ in range(1100)]
    trees = ever_trees(pts, seed=seed, s=(1.8, 2.8), trunk=False)
    if ash:
        f0, f1 = ash
        for o in trees:
            c0 = o.data.materials[0].diffuse_color[:3]
            grey = tuple(0.55 * c + 0.45 * g for c, g in zip(c0, hexc('#9a9a96')))
            color_ramp(o, [(1, c0), (f0, c0), (f1, grey)])
    if ruins:
        for k in range(18):
            x, y = rnd.uniform(-160, 160), rnd.uniform(-60, 300)
            h = rnd.uniform(16, 45)
            box((x, y, h / 2), (rnd.uniform(8, 14), rnd.uniform(8, 14), h), rnd.choice([hexc('#a8a49c'), hexc('#9a968e')]))
    return trees


def kFujiFar(n):  # 三百年後。西の空に、灰色の煙が上がる
    forest_tokyo(n)
    top = volcano((0, 900, 0), R=320, H=170)
    plume(n, top, k=70, f0=int(n * 0.15), rise=160, drift=(120, -60), period=60, r0=10, r1=60)
    cam = camera(32)
    cam_path(cam, [(0, (0, -120, 40), (0, 900, 120)), (1, (0, -110, 42), (0, 900, 150))], n)
    return MB('wind')


def kFujiErupt(n):  # 富士山。これまでの千年で、富士山は、何度も火を噴いてきた
    s = bpy.context.scene
    sky(hexc('#a8b8c8')); s.view_settings.exposure = 0.32
    light_dir((0.5, -0.4, 0.7))
    ground(size=1600, rgb=hexc('#4f6a3a'))
    top = volcano((0, 0, 0), R=150, H=80)
    plume(n, top, k=90, f0=1, rise=110, drift=(90, -30), period=40, r0=6, r1=34)
    rnd = random.Random(5)
    ever_trees([(rnd.uniform(-300, 300), rnd.uniform(-300, -120)) for _ in range(300)], seed=5, s=(1.5, 2.5), trunk=False)
    cam = camera(30)
    cam_path(cam, [(0, (-60, -360, 30), (0, 0, 70)), (1, (-40, -340, 34), (10, 0, 80))], n)
    return MB('wind')


def kAshForest(n):  # 東京の森に、灰が降り積もる
    forest_tokyo(n, ash=(int(n * 0.1), int(n * 0.9)), ruins=True)
    falling_bits(n, (-40, 40), (-40, 60), top=40, k=1600, r=0.12, period=120)
    s = bpy.context.scene
    sky_keys([(1, hexc('#a8c0d8')), (n, hexc('#a8a6a0'))])
    cam = camera(30)
    cam_path(cam, [(0, (-10, -80, 60), (0, 60, 10)), (1, (-6, -74, 56), (0, 60, 10))], n)
    return MB('wind')


def rebar_closeup(n, swell=None, crack=None, spall=None):
    """柱の断面（模式）：コンクリートの中の鉄筋が錆びて膨らみ、外側を割る"""
    s = bpy.context.scene
    sky(hexc('#c8ccd0')); s.view_settings.exposure = 0.38
    light_dir((0.4, -0.6, 0.6)); s.display.shading.shadow_intensity = 0.4
    ground(size=60, rgb=hexc('#6a7a50'))
    # 柱（手前の外壁を少しはがして中を見せる）
    box((0, 0.3, 3.0), (2.4, 1.8, 6.0), hexc('#a8a49c'))
    bars = []
    for x in (-0.8, -0.27, 0.27, 0.8):
        o = cyl((x, -0.62, 3.0), 0.07, 6.0, hexc('#5a5a5c'), verts=10)
        bars.append(o)
    # 外側の皮（手前）：小さな板に分けて、はがれ落ちる
    pieces = []
    rnd = random.Random(3)
    for i in range(4):
        for j in range(8):
            o = boxc((-0.9 + i * 0.6, -0.78, 0.4 + j * 0.72), (0.58, 0.18, 0.7), rnd.choice([hexc('#b0aca4'), hexc('#a8a49c'), hexc('#b8b4aa')]))
            pieces.append(o)
    if swell:
        f0, f1 = swell
        for o in bars:
            color_ramp(o, [(1, hexc('#5a5a5c')), (f0, hexc('#5a5a5c')), (f1, hexc('#9a4a20'))])
            o.keyframe_insert('scale', frame=f0); o.scale = (1.9, 1.9, 1.0); o.keyframe_insert('scale', frame=f1)
    if crack:
        f0, f1 = crack
        for k in range(14):
            o = boxc((rnd.uniform(-1.0, 1.0), -0.875, rnd.uniform(0.6, 5.4)), (rnd.uniform(0.03, 0.06), 0.02, rnd.uniform(0.5, 1.4)), hexc('#2a2622'),
                     rot=(0, rnd.uniform(-0.7, 0.7), 0))
            appear(o, int(f0 + (f1 - f0) * k / 14))
    if spall:
        f0, f1 = spall
        rnd.shuffle(pieces)
        for k, o in enumerate(pieces[:22]):
            f = int(f0 + (f1 - f0) * k / 22)
            o.keyframe_insert('location', frame=f); o.keyframe_insert('rotation_euler', frame=f)
            o.location = (o.location.x + rnd.uniform(-0.6, 0.6), o.location.y - rnd.uniform(0.8, 1.6), 0.1)
            o.rotation_euler = (rnd.uniform(-1.4, 1.4), rnd.uniform(-1, 1), rnd.uniform(-1, 1))
            o.keyframe_insert('location', frame=f + 10 + int(o.location.z)); o.keyframe_insert('rotation_euler', frame=f + 12)
    rnd2 = random.Random(5)
    ever_trees([(rnd2.uniform(-12, 12), rnd2.uniform(4, 20)) for _ in range(14)], seed=5, s=(0.8, 1.2))
    return bars, pieces


def kRebar(n):  # コンクリートのビルの中で、鉄の骨が錆びて、膨らんでいく（模式）
    rebar_closeup(n, swell=(int(n * 0.1), int(n * 0.9)))
    for o in [o for o in bpy.data.objects if o.name.startswith('box') and abs(o.location.y + 0.78) < 0.01]:
        pass
    # 手前の皮の一部を外して、中の鉄筋を見せる
    for o in [o for o in bpy.data.objects if abs(o.location.y + 0.78) < 0.01 and o.location.x < 0.2 and o.location.z > 2.0]:
        o.scale = (0, 0, 0)
    cam = camera(40)
    cam_path(cam, [(0, (1.5, -5.0, 3.6), (0, 0, 3.2)), (1, (1.0, -4.2, 3.4), (0, 0, 3.2))], n)
    return MB('wind')


def kWallCrack(n):  # 膨らんだ鉄が、壁を、内側から割っていく
    rebar_closeup(n, swell=(1, 2), crack=(int(n * 0.05), int(n * 0.6)), spall=(int(n * 0.55), int(n * 0.95)))
    for o in bpy.data.objects:
        if o.name.startswith('cyl') and abs(o.location.y + 0.62) < 0.01:
            o.scale = (1.9, 1.9, 1.0)
    cam = camera(40)
    cam_path(cam, [(0, (-1.5, -6.0, 3.0), (0, 0, 3.0)), (1, (-1.0, -5.4, 3.0), (0, 0, 3.0))], n)
    return MB('wind')


def kCollapse(n):  # ビルが、一棟ずつ、崩れていく（人はいない）
    s = bpy.context.scene
    sky(hexc('#b8bcc0')); s.view_settings.exposure = 0.32
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(size=600, rgb=hexc('#5a6a40'))
    rnd = random.Random(7)
    ever_trees([p for p in [(rnd.uniform(-90, 90), rnd.uniform(-30, 120)) for _ in range(300)] if not (abs(p[0]) < 50 and p[1] < 48)], seed=7, s=(1.4, 2.2), trunk=False,
               cols=[hexc('#5a6a50'), hexc('#6a7a5a'), hexc('#4f5f48')])
    for k, (x, y, h) in enumerate([(-30, 20, 26), (0, 36, 32), (28, 18, 24)]):
        f = int(n * (0.08 + 0.3 * k))
        ruin_building((x, y), w=11, d=9, h=h, seed=k, f_fall=f, n=n)
        dust_cloud((x, y - 4, 2), n, f + 12, seed=k, r=7)
    falling_bits(n, (-60, 60), (-20, 80), top=40, k=800, r=0.12, period=120)
    cam = camera(30)
    cam_path(cam, [(0, (0, -60, 14), (0, 30, 14)), (1, (0, -54, 14), (0, 30, 14))], n)
    return MB('wind')


# ---------------- SCENE 12 千年の寺の秘密（章11） ----------------
def temple_forest(n, seed=51, moss=0.0, people=False):
    s = bpy.context.scene
    sky(hexc('#b0c8dc')); s.view_settings.exposure = 0.36
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.5
    ground(size=600, rgb=hexc('#6a7a48'))
    box((0, 0, 0.01), (30, 30, 0.02), hexc('#d8d0bc'))  # 境内の砂
    rnd = random.Random(seed)
    pts = [(rnd.uniform(-90, 90), rnd.uniform(-60, 120)) for _ in range(380)]
    pts = [p for p in pts if max(abs(p[0]), abs(p[1])) > 40]
    ever_trees(pts, seed=seed, s=(1.2, 2.0))
    root, tiers = pagoda((0, 4, 0), moss=moss)
    return root, tiers


def kPagoda(n):  # 五百年後。奈良の森の中に、古い五重塔がある
    temple_forest(n, moss=0.5)
    cam = camera(28)
    cam_path(cam, [(0, (-22, -34, 16), (0, 4, 14)), (1, (-18, -30, 12), (0, 4, 14))], n)
    return MB('garden', insects=0.3)


def kPagodaClose(n):  # 法隆寺。世界で一番古い、木の建物
    temple_forest(n, moss=0.5)
    cam = camera(35)
    cam_path(cam, [(0, (-8, -16, 2.0), (0, 4, 12)), (1, (-6, -15, 2.2), (0, 4, 16))], n)
    return MB('garden', insects=0.3)


def scaffold(cx, cy, w, h, c=hexc('#b8a078')):
    items = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            for k in range(-2, 3):
                items.append(((cx + sx * w / 2 + k * 0.0, cy + sy * w / 2 + k * w / 5, 0), (cx + sx * w / 2, cy + sy * w / 2 + k * w / 5, h), 0.08))
    for z in range(2, int(h), 3):
        for sx in (-1, 1):
            items.append(((cx + sx * w / 2, cy - w / 2, z), (cx + sx * w / 2, cy + w / 2, z), 0.06))
            items.append(((cx - w / 2, cy + sx * w / 2, z), (cx + w / 2, cy + sx * w / 2, z), 0.06))
    return mbar(items, c, 'scaffold')


def kRepair(n):  # この寺は、何百年かごとに、人が解体して、組み直してきた（昔の場面・模式）
    root, tiers = temple_forest(n)
    scaffold(0, 4, 13, 26)
    # 上の層から順に外し、横に下ろしてから、また組み直す
    f_up = int(n * 0.08); f_back = int(n * 0.6)
    for k, t in enumerate(reversed(tiers[2:])):
        z0 = t.location.z
        t.keyframe_insert('location', frame=1)
        fa = f_up + k * 8
        t.keyframe_insert('location', frame=fa)
        t.location = (12 + k * 1.5, -6 + k * 3.0, 0.2 * k); t.keyframe_insert('location', frame=fa + 30)
        t.keyframe_insert('location', frame=f_back + (3 - k) * 8)
        t.location = (0, 0, z0); t.keyframe_insert('location', frame=f_back + (3 - k) * 8 + 30)
    rnd = random.Random(4)
    for k in range(7):
        p = person((rnd.uniform(-9, 9), rnd.uniform(-10, -5), 0), rnd.choice([hexc('#3a4a6a'), hexc('#e8e2d6'), hexc('#5a4a3a')]),
                   pants=hexc('#3a3a44'), rot_z=rnd.uniform(-0.6, 0.6) + math.pi * (k % 2), act='talk' if k % 2 else 'type', name=f'mc{k}')
        if k < 3:
            p.keyframe_insert('location', frame=1)
            p.location.x += rnd.choice([-5, 5]); p.keyframe_insert('location', frame=n)
            beam = box((0, -0.3, 1.5), (0.2, 2.6, 0.2), hexc('#c8a070'))
            link(beam, p)
    cam = camera(30)
    cam_path(cam, [(0, (-22, -34, 12), (2, 2, 10)), (1, (-18, -32, 11), (2, 2, 10))], n)
    return MB('garden', insects=0.2)


def ise_plots(n, f_build=None):
    s = bpy.context.scene
    sky(hexc('#b8d0e0')); s.view_settings.exposure = 0.4
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(size=400, rgb=hexc('#5a7a40'))
    for x in (-8, 8):
        box((x, 0, 0.05), (13, 12, 0.1), hexc('#e8e4dc'))  # 白い石の敷地
        mbox([(x + sx * 6.5, y, 0.6, 0.15, 0.15, 1.2) for sx in (-1, 1) for y in range(-6, 7, 2)] +
             [(x + xx, sy * 6, 0.6, 0.15, 0.15, 1.2) for sy in (-1, 1) for xx in range(-6, 7, 2)], hexc('#c8b890'), 'fence')
    rnd = random.Random(6)
    ever_trees([(rnd.uniform(-60, 60), rnd.uniform(10, 60)) for _ in range(160)], seed=6, s=(1.8, 2.8))
    shrine((-8, 0, 0.1))
    if f_build:
        shrine((8, 0, 0.1), parts_at=(f_build, int(n * 0.16)))
    return


def kIse(n):  # 伊勢神宮は、二十年ごとに、隣の土地に、同じ社を建て直してきた（模式）
    ise_plots(n, f_build=int(n * 0.08))
    rnd = random.Random(8)
    for k in range(5):
        p = person((rnd.uniform(3, 13), rnd.uniform(-7.5, -6.5), 0.1), rnd.choice([hexc('#e8e2d6'), hexc('#d8d0c0')]), pants=hexc('#5a5048'),
                   rot_z=math.pi * 0.0 + rnd.uniform(-0.4, 0.4) + math.pi, act='type', name=f'ise{k}')
    cam = camera(30)
    cam_path(cam, [(0, (0, -34, 12), (0, 0, 3)), (1, (2, -30, 11), (0, 0, 3))], n)
    return MB('garden')


def kRepairCycle(n):  # 千年もつ建物は、千年、人が直し続けてきた建物（足場が組まれては外れる）
    root, tiers = temple_forest(n, moss=0.2)
    for k in range(4):
        sc = scaffold(0, 4, 13, 26, c=hexc('#c8b088'))
        f_in = int(n * (0.08 + 0.22 * k)); f_out = f_in + int(n * 0.12)
        visible(sc, f_in, f_out)
    cam = camera(26)
    cam_path(cam, [(0, (26, -30, 16), (0, 4, 13)), (1, (22, -34, 14), (0, 4, 13))], n)
    return MB('garden')


def kPagodaQuiet(n):  # 直す人は、今、眠っている（苔むした塔、誰もいない境内）
    temple_forest(n, moss=0.7)
    rnd = random.Random(12)
    grass_tufts([(rnd.uniform(-14, 14), rnd.uniform(-14, 14)) for _ in range(220)], seed=12, h=(0.4, 1.2), per=4)
    for k in range(10):
        young_tree((rnd.uniform(-12, 12), rnd.uniform(-12, -4), 0), s=rnd.uniform(1.0, 1.8), seed=k)
    cam = camera(30)
    cam_path(cam, [(0, (6, -34, 6), (0, 4, 12)), (1, (4, -40, 7), (0, 4, 12))], n)
    return MB('garden', insects=0.4)


# ---------------- SCENE 13 残るのは、土と石と、焼き物（章12） ----------------
def kMound(n):  # 千年後。森の中に、木に覆われた、大きな丘がある（古墳）
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.35
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(size=1200, rgb=hexc('#4f6a3a'))
    keyhole_mound((0, 0, 0))
    rnd = random.Random(3)
    pts = [(rnd.uniform(-300, 300), rnd.uniform(-300, 300)) for _ in range(900)]
    pts = [p for p in pts if not (abs(p[0]) < 75 and -80 < p[1] < 100)]
    ever_trees(pts, seed=3, s=(1.6, 2.4), trunk=False)
    cam = camera(30)
    cam_path(cam, [(0, (-120, -200, 130), (0, 10, 0)), (1, (-90, -190, 115), (0, 10, 0))], n)
    return MB('garden')


def kMoundSide(n):  # 人が土を盛って造った、古墳です（横から：盛り土の形）
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.35
    light_dir((0.5, -0.4, 0.7))
    ground(size=1200, rgb=hexc('#4f6a3a'))
    keyhole_mound((0, 0, 0))
    cam = camera(30)
    cam_path(cam, [(0, (-90, -60, 8), (0, 10, 6)), (1, (-80, -72, 9), (0, 10, 6))], n)
    return MB('garden')


def kStoneWall(n):  # 江戸城の石垣も、苔に覆われて、残っている
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.35
    light_dir((0.4, -0.6, 0.6)); s.display.shading.shadow_intensity = 0.5
    ground(size=400, rgb=hexc('#5a7a40'))
    plane((0, -12, 0.08), (120, 16), hexc('#4f7f90'), name='moat')  # 堀
    stone_wall(n, -25, 25, H=10, seed=4)
    rnd = random.Random(4)
    grass_tufts([(rnd.uniform(-25, 25), rnd.uniform(-3.5, -1.0)) for _ in range(120)], seed=4, h=(0.3, 0.9), per=3)
    cam = camera(32)
    cam_path(cam, [(0, (-16, -26, 3), (0, 3, 5)), (1, (-10, -24, 3.2), (2, 3, 5.5))], n)
    return MB('garden', insects=0.3)


def soil_scene(n, rise=True):
    s = bpy.context.scene
    sky(hexc('#7a8a6a')); s.view_settings.exposure = 0.3
    light_dir((0.3, -0.5, 0.8)); s.display.shading.shadow_intensity = 0.55
    ground(size=60, rgb=hexc('#5a4630'))
    rnd = random.Random(6)
    msph([(rnd.uniform(-1.2, 1.2), rnd.uniform(-0.8, 1.5), 0.0, rnd.uniform(0.04, 0.1), 1.2, 1, 0.4) for _ in range(120)], hexc('#4a3a28'), 'crumb')
    msph([(rnd.uniform(-1.5, 1.5), rnd.uniform(-1, 2), 0.005, rnd.uniform(0.05, 0.12), 1.6, 1, 0.08) for _ in range(60)], hexc('#8a6a3a'), 'leaf')
    grass_tufts([(rnd.uniform(-1.6, 1.6), rnd.uniform(0.3, 2.0)) for _ in range(30)], seed=6, h=(0.08, 0.25), per=3)
    msph([(rnd.uniform(-1.6, 1.6), rnd.uniform(0.6, 2.2), 0.02, rnd.uniform(0.05, 0.2), 1.3, 1, 0.5) for _ in range(20)], hexc('#5f8a3a'), 'moss')
    f0, f1 = (int(n * 0.05), int(n * 0.7)) if rise else (1, 2)
    b = rice_bowl((-0.18, 0.0, -0.02), s=1.2, rise=(f0, f1, -0.2))
    b.rotation_euler = (0.25, 0.1, 0)
    g = glass_bottle((0.22, 0.12, 0.05), s=1.0, rot=(0, 1.3, 0.4), rise=(f0 + 10, f1 + 10, -0.08))
    return b, g


def kBowlBottle(n):  # 森の土の中から、茶わんと、ガラスの瓶が、顔を出す
    soil_scene(n)
    cam = camera(45, dof=0.9, fstop=2.4)
    cam_path(cam, [(0, (-0.2, -0.85, 0.45), (0.0, 0.05, 0.05)), (1, (-0.05, -0.75, 0.38), (0.0, 0.05, 0.05))], n)
    return MB('garden', insects=0.3)


def kNoCity(n):  # 鉄とコンクリートの街は、消えた（森と苔むした石の山）
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.35
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.45
    ground(size=1200, rgb=hexc('#4f6a3a'))
    rnd = random.Random(9)
    for k in range(16):
        x, y = rnd.uniform(-80, 80), rnd.uniform(-10, 160)
        moss_stones([(x + rnd.uniform(-6, 6), y + rnd.uniform(-6, 6)) for _ in range(10)], seed=k, r=(1.0, 2.6))
    pts = [(rnd.uniform(-200, 200), rnd.uniform(-40, 300)) for _ in range(450)]
    ever_trees(pts, seed=9, s=(1.0, 1.8))
    cam = camera(30)
    cam_path(cam, [(0, (0, -70, 50), (0, 60, 0)), (1, (10, -60, 42), (0, 60, 0))], n)
    return MB('garden')


def kRemains(n):  # 千年残ったのは、土と、石と、焼き物（茶わんのそばに石、奥に盛り土の丘）
    b, g = soil_scene(n, rise=False)
    rnd = random.Random(2)
    msph([(0.65, 0.5, 0.05, 0.22, 1.3, 1, 0.7), (-0.75, 0.6, 0.04, 0.18, 1.2, 1, 0.7)], hexc('#7a7670'), 'st')
    cam = camera(32, dof=1.6, fstop=2.8)
    cam_path(cam, [(0, (0.0, -1.3, 0.35), (0.0, 0.3, 0.1)), (1, (0.0, -1.7, 0.55), (0.0, 0.3, 0.1))], n)
    return MB('garden', insects=0.3)


# ---------------- SCENE 14 目を覚ます（章13） ----------------
def dusk(n, exp=0.15):
    s = bpy.context.scene
    sky(hexc('#e0a888')); s.view_settings.exposure = exp
    light_dir((-0.7, -0.3, 0.4)); s.display.shading.shadow_intensity = 0.5


def wake_people(n, f_sit, f_stand, idx=None, seed=4, stand=True, dt=10):
    """眠っていた人が、一人、また一人と起き上がる（寝る→座る→立つ）"""
    rnd = random.Random(seed)
    idx = idx if idx is not None else range(len(WALKERS))
    out = []
    for k, i in enumerate(idx):
        w = WALKERS[i]
        f1 = f_sit + k * dt + rnd.randint(0, 6)
        f2 = (f_stand + k * dt + rnd.randint(0, 8)) if stand else None
        li = sleeper(w, name=f'wl{i}'); visible(li, None, f1)
        si = person_of(w, 'sit', f'ws{i}', rot=w['lie_rot'] + math.pi)  # 頭の側を向いて座る
        visible(si, f1, f2)
        st = None
        if stand:
            st = person_of(w, 'stand', f'wt{i}', rot=w['lie_rot'] + math.pi + rnd.uniform(-0.8, 0.8))
            visible(st, f2, None)
        out.append((li, si, st))
    return out


def kForestCross(n):  # そして、千年後の夕方。（森になった交差点で、人々が眠っている）
    crossing(n, 1000)
    dusk(n)
    cam = camera(30)
    cam_path(cam, [(0, (4, -34, 10), (0, 0, 1)), (1, (3, -28, 7), (0, 0, 1))], n)
    return MB('garden', insects=0.5)


def kEyeOpen(n):  # 森の中で、誰かが、目を開ける
    crossing(n, 1000, skip_sleep=(9,))
    dusk(n, 0.2)
    w = WALKERS[9]
    p = sleeper(w, name='eyeman')
    eyes = add_eyes(p, closed=True)
    open_eyes(eyes, int(n * 0.45))
    bpy.context.view_layer.update()
    h = O[p['head']].matrix_world.translation
    cam = camera(50, dof=0.75, fstop=2.0)
    d = Vector((math.sin(w['lie_rot']), -math.cos(w['lie_rot']), 0))
    cam_path(cam, [(0, tuple(h + d * 0.3 + Vector((0, 0, 0.6))), tuple(h)), (1, tuple(h + d * 0.25 + Vector((0, 0, 0.5))), tuple(h))], n)
    return MB('garden', insects=0.4)


def kWakeUp(n):  # 一人、また一人と、起き上がる
    crossing(n, 1000, sleepers=False)
    dusk(n)
    wake_people(n, int(n * 0.05), int(n * 0.3), dt=2)
    cam = camera(30)
    cam_path(cam, [(0, (-16, -24, 6), (0, 2, 1)), (1, (-14, -22, 5.5), (0, 2, 1))], n)
    return MB('garden', insects=0.4)


def stood_people(n, seed=7, look=None):
    """みんな立っている（見回す）。look=f なら f から空を見上げる"""
    rnd = random.Random(seed)
    ppl = []
    for i, w in enumerate(WALKERS):
        p = person_of(w, 'stand', f'st{i}', rot=w['lie_rot'] + math.pi + rnd.uniform(-1.2, 1.2))
        if look is not None:
            t = tilt_head(p)
            f = look + rnd.randint(0, 30)
            look_keys(t, [(1, (0, 0, 0)), (f, (0, 0, 0)), (f + 14, (-0.75, 0, rnd.uniform(-0.2, 0.2)))])
        ppl.append(p)
    return ppl


def kLookAround(n):  # そこは、千年前に眠った、交差点です
    crossing(n, 1000, sleepers=False)
    dusk(n)
    stood_people(n)
    cam = camera(26)
    cam_path(cam, [(0, (2, -6, 1.7), (-8, 14, 3.0)), (1, (2, -6, 1.7), (10, 14, 3.0))], n)
    return MB('garden', insects=0.4)


def kNoBuildings(n):  # ビルも、信号も、道路もない
    crossing(n, 1000, sleepers=False)
    dusk(n)
    stood_people(n, seed=8)
    cam = camera(28)
    cam_path(cam, [(0, (-30, -40, 22), (0, 0, 4)), (1, (-36, -46, 30), (0, 0, 6))], n)
    return MB('garden', insects=0.4)


def kMossStones(n):  # 苔に覆われた石と、高い木々が、並んでいる。足元に、落としたスマホの跡
    crossing(n, 1000, sleepers=False)
    dusk(n, 0.22)
    stood_people(n, seed=9)
    w = WALKERS[9]
    x, y = w['stop'][0] + 0.6, w['stop'][1] - 0.8
    ph = phone((x, y, 0.01), rot_z=0.7, lit=False)
    setmat(ph, hexc('#3a4030'))
    msph([(x + 0.04, y + 0.02, 0.015, 0.05, 1.2, 1, 0.4), (x - 0.03, y - 0.05, 0.015, 0.04, 1, 1, 0.4)], hexc('#5f8a3a'), 'pmoss')
    cam = camera(40, dof=1.2, fstop=2.4)
    cam_path(cam, [(0, (x - 0.9, y - 0.9, 0.9), (x, y, 0.0)), (1, (x - 1.5, y - 3.0, 2.8), (x + 3, y + 8, 2.6))], n)
    return MB('garden', insects=0.4)


# ---------------- SCENE 15 天の川の下で（章14） ----------------
def night_forest_cross(n, f_dark=None, look=None, stars_f=None):
    crossing(n, 1000, sleepers=False)
    s = bpy.context.scene
    light_dir((0.1, -0.3, 0.9)); s.display.shading.shadow_intensity = 0.25
    if f_dark:
        f0, f1 = f_dark
        sky_keys([(1, hexc('#e0a888')), (f0, hexc('#c88878')), ((f0 + f1) // 2, hexc('#3a3a5a')), (f1, hexc('#0a0e1e'))])
        exposure_keys([(1, 0.15), (f0, 0.05), (f1, -0.6)])
        sun = sun_disc(math.radians(200), 0.03, R=900, r=36)
        sun.keyframe_insert('location', frame=1); sun.location.z -= 70; sun.keyframe_insert('location', frame=f1)
    else:
        sky(hexc('#0a0e1e')); s.view_settings.exposure = -0.6
    if stars_f:
        star_dome(n, k=3000, seed=11, f0=stars_f[0], f1=stars_f[1], groups=10, size=(0.7, 2.1), band=(0.5, 1.05), band_k=1700)
        milky_way(az0=0.5, tilt=1.05, f0=stars_f[1])
    else:
        star_dome(n, k=3000, seed=11, size=(0.7, 2.1), band=(0.5, 1.05), band_k=1700)
        milky_way(az0=0.5, tilt=1.05)
    return stood_people(n, seed=10, look=look)


def kSunset(n):  # 日が沈みます。空が、暗くなっていく
    night_forest_cross(n, f_dark=(int(n * 0.1), int(n * 0.95)), stars_f=(int(n * 0.7), int(n * 0.98)))
    cam = camera(26)
    cam_path(cam, [(0, (6, 22, 3.0), (-60, -100, 25)), (1, (6, 22, 3.0), (-60, -100, 40))], n)
    return MB('dawn', insects=0.6)


def kMilkyWay(n):  # 渋谷の空に、天の川が、かかっている。千年前、この街から天の川は見えなかった
    night_forest_cross(n)
    cam = camera(22)
    cam_path(cam, [(0, (0, -30, 2.0), (0, 60, 40)), (1, (0, -30, 2.0), (10, 60, 70))], n)
    return MB('night', insects=0.6)


def kLookUp(n):  # 人々は、空を見上げます
    night_forest_cross(n, look=int(n * 0.1))
    cam = camera(30)
    cam_path(cam, [(0, (-3, -9, 1.1), (0, 2, 3.0)), (1, (-2.5, -8, 1.0), (0, 2, 4.0))], n)
    return MB('night', insects=0.6)


def kPickStone(n):  # 一人が、足元の石を、拾い上げる。千年ぶりに、人が、何かを造り始める
    crossing(n, 1000, sleepers=False)
    s = bpy.context.scene
    sky(hexc('#0a0e1e')); s.view_settings.exposure = -0.45
    light_dir((0.1, -0.3, 0.9)); s.display.shading.shadow_intensity = 0.25
    star_dome(n, k=3000, seed=11, size=(0.7, 2.1), band=(0.5, 1.05), band_k=1700)
    milky_way(az0=0.5, tilt=1.05)
    w = WALKERS[9]
    x, y = w['stop']
    p = person((x, y, 0), w['shirt'], pants=w['pants'], skin=w['skin'], hair=w['hair'], rot_z=0.0, name='picker')
    f = int(n * 0.25)
    # かがんで拾う：体を前に倒し、腕を下へ、石を持ち上げる
    rig = O[p['rig']]
    rig.keyframe_insert('rotation_euler', frame=1); rig.keyframe_insert('rotation_euler', frame=f)
    rig.rotation_euler.x = 0.55; rig.keyframe_insert('rotation_euler', frame=f + 18)
    rig.keyframe_insert('rotation_euler', frame=f + 34)
    rig.rotation_euler.x = 0.0; rig.keyframe_insert('rotation_euler', frame=f + 54)
    arm = arm_to(p, 1, (-0.05, -0.45, 0.75), f=f + 4)
    st = sphere((x - 0.05, y - 0.62, 0.07), 0.09, hexc('#8a857c'), scale=(1.3, 1, 0.8), seg=12, name='stone')
    st.keyframe_insert('location', frame=1); st.keyframe_insert('location', frame=f + 30)
    st.location = (x - 0.08, y - 0.5, 1.15); st.keyframe_insert('location', frame=f + 56)
    others = []
    rnd = random.Random(3)
    for i in (4, 15, 22, 30):
        o = person_of(WALKERS[i], 'stand', f'po{i}', rot=rnd.uniform(-3, 3))
        t = tilt_head(o); t.rotation_euler = (-0.6, 0, 0)
    cam = camera(35)
    cam_path(cam, [(0, (x + 1.8, y - 3.6, 1.4), (x, y - 0.3, 0.8)), (1, (x + 1.4, y - 3.0, 1.3), (x, y - 0.3, 0.9))], n)
    return MB('night', insects=0.6)


def kEnd(n):  # エンドカード：天の川と、森の交差点
    night_forest_cross(n, look=1)
    cam = camera(24)
    cam_path(cam, [(0, (-8, -24, 2.0), (-8, 60, 40)), (1, (-8, -26, 2.0), (-8, 60, 52))], n)
    return MB('night', insects=0.5)
