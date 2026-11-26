"""カット：SCENE 01〜05（章0〜4）：交差点で眠る／明かりの消えた夜／地下の駅／海より低い町／錆びる鉄塔"""
from mk import *


def _cam_cross_high(cam, n, a=(0.0, 1.0)):
    cam_path(cam, [(0, (-34, -46, 30), (0, 0, 0)), (1, (-26, -50, 26), (2, 2, 0))], n)


# ---------------- SCENE 01 交差点で、全員が眠る（章0） ----------------
def kCrossWalk(n):  # 夕方の交差点。信号が青になり、人の波が一斉に渡り始める
    f_go = int(n * 0.38)
    crossing(n, 0, sleepers=False, sig=('r2g', f_go))
    for i, w in enumerate(WALKERS):
        p = person_of(w, 'stand', f'w{i}', loc=(w['start'][0], w['start'][1], 0))
        sx, sy = w['start']; ex, ey = w['stop']
        # 青になったら歩き出す（このカットでは途中まで）
        mid = (sx + (ex - sx) * 0.55, sy + (ey - sy) * 0.55)
        walk_keys(p, (sx, sy), mid, f_go + (i % 7) * 3, n + 30, n, decel=1)
    cam = camera(30)
    cam_path(cam, [(0, (6, -46, 14), (0, 0, 1)), (1, (4, -40, 12), (0, 0, 1))], n)
    return MB('city')


def kCrossStop(n):  # その途中で、全員が足を止める。そのまま座り込み、横になる
    f_stop = int(n * 0.22); f_sit = int(n * 0.45); f_lie = int(n * 0.62)
    crossing(n, 0, sleepers=False, sig='green')
    rnd = random.Random(3)
    for i, w in enumerate(WALKERS):
        sx, sy = w['start']; ex, ey = w['stop']
        a = (sx + (ex - sx) * 0.55, sy + (ey - sy) * 0.55)
        st = person_of(w, 'stand', f'w{i}', loc=(a[0], a[1], 0))
        fs = f_stop + rnd.randint(-4, 4)
        walk_keys(st, a, (ex, ey), 1, fs, n, decel=10)
        f1 = f_sit + rnd.randint(-6, 6); f2 = f_lie + rnd.randint(-6, 6)
        visible(st, None, f1)
        si = person_of(w, 'sit', f's{i}', loc=(ex, ey, 0)); visible(si, f1, f2)
        li = sleeper(w, name=f'sl{i}'); visible(li, f2, None)
        if i % 9 == 0:  # スマホが手から落ちる
            ph = phone((ex + 0.25, ey - 0.1, 1.05), rot_z=rnd.uniform(0, 3))
            ph.keyframe_insert('location', frame=1); ph.keyframe_insert('location', frame=f1 - 2)
            ph.location.z = 0.02; ph.keyframe_insert('location', frame=f1 + 4)
            ph.keyframe_insert('rotation_euler', frame=f1 - 2); ph.rotation_euler.x = 0.0
    cam = camera(32)
    cam_path(cam, [(0, (5, -33, 7), (0, 3, 0.5)), (1, (3, -28, 6), (0, 4, 0.4))], n)
    return MB('city')


def kSleepClose(n):  # 誰も、起きない。足元にスマホ
    crossing(n, 0, sig='green')
    w = WALKERS[9]
    ph = phone((w['stop'][0] + 0.35, w['stop'][1] - 0.2, 0.02), rot_z=0.4)
    cam = camera(40, dof=4.0, fstop=2.8)
    x, y = w['stop']
    cam_path(cam, [(0, (x - 3.2, y - 3.4, 1.4), (x + 0.6, y + 0.6, 0.2)), (1, (x - 2.6, y - 2.8, 1.2), (x + 0.6, y + 0.6, 0.2))], n)
    return MB('city')


def kDriver(n):  # 車も止まる。運転席の人も眠っている
    crossing(n, 0, sig='green')
    car = car2((-8, -40, 0), rot_z=math.pi, c=hexc('#f0f0ec'))
    d = person((0, 0, 0), hexc('#3d5a80'), skin=SKIN[1], hair=hexc('#2b2420'), pose='sit', s=0.9, name='driver')
    link(d, car); d.location = (-0.4, 0.15, 0.35)
    t = tilt_head(d)
    t.rotation_euler = (0.7, 0.0, 0.5)
    cam = camera(35)
    cam_path(cam, [(0, (-10.5, -37.0, 1.7), (-8.2, -40.2, 1.25)), (1, (-10.1, -37.6, 1.6), (-8.2, -40.2, 1.2))], n)
    return MB('city')


def kCrossHigh(n):  # この瞬間、世界中の人が眠った。次に目を覚ますのは千年後
    crossing(n, 0, sig='green')
    cam = camera(28)
    cam_path(cam, [(0, (0, -62, 40), (0, 0, 0)), (1, (0, -74, 56), (0, 4, 0))], n)
    return MB('city')


def kSignalRed(n):  # 信号だけが、青から、赤に変わる
    f = int(n * 0.35)
    crossing(n, 0, sig=('g2r', f))
    cam = camera(45)
    x, y = SQ + 1.2, SQ + 1.2
    cam_path(cam, [(0, (x - 6, y - 9, 2.2), (x - 0.3, y, 2.9)), (1, (x - 6.4, y - 9.6, 2.0), (x - 0.3, y, 2.8))], n)
    return MB('silent')


# ---------------- SCENE 02 明かりが消えた夜（章1） ----------------
def night_city(n, lit=0.55, seed=11):
    s = bpy.context.scene
    sky(hexc('#0b1022')); s.view_settings.exposure = -0.1
    light_dir((0.2, -0.4, 0.8)); s.display.shading.shadow_intensity = 0.2
    ground(size=1200, rgb=hexc('#22252c'))
    bl = city_blocks(nx=11, ny=11, pitch=26, seed=seed, lit=lit, night=True)
    # 街灯の並び（道路）
    items = []
    for k in range(-6, 7):
        for m in range(-6, 7):
            items.append((k * 26 + 13, m * 26, 6.0, 0.5, 0.5, 0.3))
    L = mbox(items, hexc('#ffe0a0'), 'streetlamp')
    return bl, L


def kNightCity(n):  # 数日後。発電所を動かす人も、眠っている
    bl, L = night_city(n)
    star_dome(n, k=40, seed=3, size=(1.0, 1.8))
    cam = camera(30)
    cam_path(cam, [(0, (-150, -190, 120), (0, 0, 10)), (1, (-130, -175, 110), (0, 0, 10))], n)
    return MB('night')


def kLightsOut(n):  # 東京の明かりが、一区画ずつ、消えていく
    bl, L = night_city(n, lit=0.6, seed=12)
    lights_out(bl, int(n * 0.1), int(n * 0.92))
    vanish(L, int(n * 0.5))
    star_dome(n, k=40, seed=3, size=(1.0, 1.8))
    cam = camera(32)
    cam_path(cam, [(0, (-170, -120, 95), (0, 10, 0)), (1, (-150, -100, 88), (10, 10, 0))], n)
    return MB('night')


def kStarsAppear(n):  # 最後の窓が暗くなると、空に、星が増えていく
    bl, L = night_city(n, lit=0.12, seed=13)
    vanish(L, 2)
    lights_out(bl, 2, int(n * 0.25), order='random')
    star_dome(n, k=40, seed=3, size=(1.0, 1.8))
    star_dome(n, k=900, seed=4, f0=int(n * 0.3), f1=int(n * 0.95), groups=10, size=(0.8, 2.0))
    cam = camera(26)
    cam_path(cam, [(0, (-120, -160, 40), (0, 0, 40)), (1, (-120, -160, 42), (0, 0, 120))], n)
    return MB('night')


def kFewStars(n):  # 都会の夜空に見える星は、それまで、数十個ほど
    bl, L = night_city(n, lit=0.6, seed=14)
    star_dome(n, k=45, seed=5, size=(1.2, 2.2))
    cam = camera(24)
    cam_path(cam, [(0, (0, -215, 22), (0, 200, 250)), (1, (6, -215, 22), (0, 200, 270))], n)
    return MB('night')


def kManyStars(n):  # この夜、東京の空には、その百倍の星が出る
    bl, L = night_city(n, lit=0.0, seed=14)
    vanish(L, 2)
    star_dome(n, k=45, seed=5, size=(1.2, 2.2))
    star_dome(n, k=2600, seed=6, f0=2, f1=int(n * 0.35), groups=6, size=(0.7, 2.0), band=(0.4, 1.0), band_k=1400)
    milky_way(az0=0.4, tilt=1.0, f0=int(n * 0.35))
    cam = camera(24)
    cam_path(cam, [(0, (0, -215, 22), (0, 200, 270)), (1, (-6, -215, 22), (0, 200, 290))], n)
    return MB('night')


def kNobodyLooks(n):  # 見上げる人は、誰もいない（暗い交差点で眠る人々と、星）
    crossing(n, 'night')
    star_dome(n, k=2200, seed=6, size=(0.7, 2.0), band=(0.4, 1.0), band_k=1200)
    milky_way(az0=0.4, tilt=1.0)
    cam = camera(26)
    cam_path(cam, [(0, (-6, -22, 4.5), (2, 6, 1.0)), (1, (-6, -22, 5.0), (2, 8, 9.0))], n)
    return MB('night')


# ---------------- SCENE 03 水がたまる地下の駅（章2） ----------------
def kPlatformSeep(n):  # 一週間後。地下鉄の駅の壁から、水がしみ出している
    platform(n, seed=1)
    cam = camera(28)
    cam_path(cam, [(0, (-12, 4.5, 1.7), (6, -4.2, 1.4)), (1, (-9, 4.0, 1.6), (8, -4.4, 1.3))], n)
    return MB('room')


def kSeepWall(n):  # 大きな街の地下には、晴れた日でも、毎日、水がしみ出している
    platform(n, seed=2, wet0=0.2)
    cam = camera(45, dof=4.0, fstop=3.0)
    cam_path(cam, [(0, (-7, 0.5, 1.7), (2, -5.2, 1.2)), (1, (-5, 0.3, 1.6), (4, -5.2, 1.1))], n)
    return MB('room')


def kPumpRoom(n):  # それを汲み出していたポンプは、もう動かない
    pump_room(n)
    cam = camera(30)
    cam_path(cam, [(0, (5, -6.5, 2.6), (-1, 2, 1.0)), (1, (3.5, -6.0, 2.4), (-1.5, 2, 1.0))], n)
    return MB('room')


def kTrackFlood(n):  # 線路に、水がたまっていく
    platform(n, water_f0=1, water_f1=n, wz0=-1.3, wz1=-0.75, seed=3, wet0=0.9)
    cam = camera(26)
    cam_path(cam, [(0, (-14, 1.0, 0.8), (10, -3.0, -1.1)), (1, (-12, 0.8, 0.6), (10, -3.0, -1.0))], n)
    return MB('room')


def section_view(n, water_rise=None):
    """地下深いホームの断面（模式）：土の層、ホームの空間、床下に並ぶ重り"""
    s = bpy.context.scene
    sky(hexc('#dfe6ec')); s.view_settings.exposure = 0.4
    light_dir((0.3, -0.8, 0.5)); s.display.shading.shadow_intensity = 0.3
    # 地上
    box((0, 0, 0.5), (90, 6, 1.0), hexc('#9aa88a'))
    for x in (-30, -12, 8, 26):
        box((x, 1, 1.0 + 5), (8, 4, 10), hexc('#c8c4ba'))
    # 土の層（手前の切り口）
    layers = [(-6, hexc('#a88a64')), (-14, hexc('#9a7a58')), (-24, hexc('#8a6e50')), (-36, hexc('#7a6448')), (-70, hexc('#6a5640'))]
    top = 0.0
    for z, c in layers:
        box((0, 0, (top + z) / 2), (90, 6, top - z), c)
        top = z
    # ホームの空間（えぐった箱）
    box((0, -2.6, -27), (40, 1.0, 8), hexc('#e8e4dc'))
    box((0, -3.0, -27), (38, 0.2, 7.4), hexc('#f4f0e8'))
    box((0, -3.2, -30.2), (38, 0.4, 1.0), hexc('#b8b4aa'))  # 床
    # 床下の重り（箱が並ぶ）
    items = [(-17 + k * 2.6, -3.2, -32.0, 2.2, 0.6, 2.2) for k in range(14)]
    mbox(items, hexc('#6a6c70'), 'weights')
    # 地上からの階段の線


def kUenoSection(n):  # 地下深くのホームは、床の下に重りを並べている（断面・模式）
    section_view(n)
    cam = camera(35)
    cam_path(cam, [(0, (0, -75, -12), (0, 0, -16)), (1, (-4, -62, -20), (-2, 0, -26))], n)
    return MB('room')


def water_wall(n, z0, z1, f0, f1):
    """断面図の水：手前の板の上端が z0 から z1 へ上がる"""
    o = box((0, 0, 0.5), (60, 0.3, 1.0), (1, 1, 1))
    o.data.materials.clear(); o.data.materials.append(gmat(hexc('#3f7fb0'), 0.55, 'gw'))
    o.location = (0, -3.6, -36)
    o.scale = (1, 1, z0 - (-36)); o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=f0)
    o.scale = (1, 1, z1 - (-36)); o.keyframe_insert('scale', frame=f1)
    return o


def kWaterRise(n):  # その重りの上まで、水が、上がってくる
    section_view(n)
    water_wall(n, -34.5, -29.8, int(n * 0.1), int(n * 0.85))
    cam = camera(40)
    cam_path(cam, [(0, (-4, -44, -28), (-2, 0, -31)), (1, (-2, -40, -29), (-2, 0, -31))], n)
    return MB('room')


# ---------------- SCENE 04 海より低い町（章3） ----------------
def town_low_env(n, rainy=True, wet=False):
    s = bpy.context.scene
    sky(hexc('#7c8a98')); s.view_settings.exposure = 0.2
    light_dir((0.3, -0.4, 0.8)); s.display.shading.shadow_intensity = 0.25
    ground(size=600, rgb=hexc('#8a8a80'))
    low_town(nx=9, ny=7, pitch=11, seed=3, cx=0, cy=0)
    # 川（東側）と堤防
    plane((80, 0, 4.5), (36, 400), hexc('#5a7a90'), name='river')
    levee(60, -200, 200, w=12, h=7)
    levee(100, -200, 200, w=12, h=7)
    if rainy:
        rain(n, (-60, 60), (-50, 50), top=30, k=1400, L=1.4, period=10)


def kLowTownRain(n):  # 一か月後。東京の東の下町に、大雨が降る
    town_low_env(n)
    cam = camera(30)
    cam_path(cam, [(0, (-60, -80, 45), (10, 0, 0)), (1, (-52, -74, 40), (14, 0, 0))], n)
    return MB('wind')


def kBelowSea(n):  # この町の広い範囲は、海より低い土地（高さを色で：模式）
    town_low_env(n, rainy=False)
    # 海面の高さに、半透明の青い板。町はその下、川は堤防の上の高さ
    lvl = plane((0, 0, 0), (1, 1), (1, 1, 1)); lvl.data.materials.clear(); lvl.data.materials.append(gmat(hexc('#3a7ac8'), 0.38, 'sealvl'))
    lvl.location = (-10, 0, 3.0); lvl.scale = (120, 110, 1)
    appear(lvl, int(n * 0.25))
    cam = camera(30)
    cam_path(cam, [(0, (-30, -110, 20), (20, 0, 2)), (1, (-20, -104, 16), (24, 0, 2))], n)
    return MB('wind')


def kLevee(n):  # 地面が、大人の背の二倍以上、沈んだ場所もある（堤防の外の川の方が高い）
    town_low_env(n, rainy=False)
    cam = camera(32)
    cam_path(cam, [(0, (52, -62, 1.7), (58, 30, 5.0)), (1, (52, -56, 1.7), (60, 30, 5.5))], n)
    return MB('wind')


def pump_station(loc):
    x, y = loc
    box((x, y, 4), (12, 10, 8), hexc('#c8c4b8'))
    roof((x, y, 8), 12.8, 10.6, 2, hexc('#5a6470'))
    for k in range(3):
        mbar([((x + 6, y - 3 + k * 3, 2.5), (x + 13, y - 3 + k * 3, 8.5), 0.6)], hexc('#6a7a8a'), 'dpipe')
    for k in range(3):
        box((x + 15, y - 3 + k * 3, 3.0), (1.8, 2.2, 2.6), hexc('#4a5460'))  # 吐き出し口（水は出ていない）


def kPumpStation(n):  # 雨の水を、川へ汲み出していたポンプは、止まったまま
    town_low_env(n)
    pump_station((30, -50))
    cam = camera(32)
    cam_path(cam, [(0, (6, -80, 12), (36, -48, 4)), (1, (10, -78, 12), (38, -46, 4))], n)
    return MB('wind')


def kStreetFlood(n):  # 道路に、水が広がっていく（家の一階が水に沈む）
    town_low_env(n)
    water((0, 0), (300, 300), 0.02, 2.4, int(n * 0.05), n, c=hexc('#5f7f88'), a=0.82)
    cam = camera(30)
    cam_path(cam, [(0, (-42, 5.5, 3.4), (30, 5.5, 1.6)), (1, (-38, 5.5, 3.6), (30, 5.5, 1.6))], n)
    return MB('wind')


def kShallowLake(n):  # 百五十万人が暮らしていた町が、浅い湖になっていく
    town_low_env(n)
    water((0, 0), (300, 300), 1.6, 3.6, 1, n, c=hexc('#6a8aa0'), a=0.86)
    cam = camera(28)
    cam_path(cam, [(0, (-40, -70, 60), (0, 0, 0)), (1, (-50, -90, 80), (0, 0, 0))], n)
    return MB('wind')


# ---------------- SCENE 05 錆びていく鉄塔（章4） ----------------
def tower_env(n, rust=0, f0=1, f1=None, sea=True, rust_z=None):
    s = bpy.context.scene
    sky(hexc('#a8c8e4')); s.view_settings.exposure = 0.35
    light_dir((0.6, -0.4, 0.6)); s.display.shading.shadow_intensity = 0.45
    ground(size=900, rgb=hexc('#8a9a78'))
    city_blocks(nx=11, ny=11, pitch=26, seed=21, lit=0.0, night=False, hr=(10, 30), skip=lambda x, y: abs(x) < 45 and abs(y) < 45)
    plane((0, 0, 0.03), (80, 80), hexc('#7a9a5a'))
    if sea:
        bay(y0=120)
    before = set(bpy.data.objects.keys())
    t = lattice_tower(H=60, rust_k=rust, rust_f0=f0, rust_f1=f1 or n, rust_z=rust_z)
    box((0, 0, 0.5), (16, 16, 1), hexc('#a8a49a'))
    # 塔の部品をまとめて2倍にする（高さ120）
    par = empty((0, 0, 0), 'twr'); par.scale = (2, 2, 2)
    for k in set(bpy.data.objects.keys()) - before:
        o = bpy.data.objects[k]
        if o.parent is None and o is not par:
            o.parent = par
    clouds_ = clouds(k=10, R=700, el=(0.08, 0.3), seed=5, c=(1, 1, 1), a=0.8)
    for c in clouds_:
        c.keyframe_insert('location', frame=1); c.location.x += 40; c.keyframe_insert('location', frame=n)
        linear(c, 'location')
    return t


def kTowerWide(n):  # 一年後。（鉄塔）
    tower_env(n)
    cam = camera(30)
    cam_path(cam, [(0, (-70, -160, 62), (0, 0, 62)), (1, (-56, -150, 58), (0, 0, 66))], n)
    return MB('wind')


def kRustStreaks(n):  # 赤い鉄骨に、茶色い筋が浮かぶ。錆
    tower_env(n, rust=90, f0=int(n * 0.12), f1=int(n * 0.8), rust_z=(2, 22))
    cam = camera(45)
    cam_path(cam, [(0, (-16, -26, 12), (0, 0, 24)), (1, (-13, -22, 14), (0, 0, 26))], n)
    return MB('wind')


def kSeaWind(n):  # 海からの風が、鉄を錆びさせる
    t = tower_env(n, rust=30, f0=2, f1=3)
    # 風の筋：海から塔へ流れる白い粒
    rnd = random.Random(4)
    starts = [(rnd.uniform(-30, 30), 120 + rnd.uniform(0, 40), rnd.uniform(5, 50)) for _ in range(60)]
    ends = [(x + rnd.uniform(-5, 5), -40, z + rnd.uniform(-3, 3)) for (x, y, z) in starts]
    starts = [(x * 2, y, z * 2) for (x, y, z) in starts]; ends = [(x * 2, y, z * 2) for (x, y, z) in ends]
    particles_flow(n, starts, ends, rgb=(0.95, 0.97, 1.0), size=0.18, period=72, seed=4, a=0.7)
    cam = camera(26)
    cam_path(cam, [(0, (60, -110, 34), (0, 60, 55)), (1, (66, -104, 36), (0, 70, 55))], n)
    return MB('wind')


def kPainters(n):  # このタワーは、五年ごとに、一年かけて、すべてを塗り直してきた
    tower_env(n)
    # 足場の板と、塗る人（過去の場面）
    z = 30.0
    box((0, -7.6, z), (8, 1.4, 0.15), hexc('#d8c8a0'))
    mbar([((-4, -8.25, z + 1.1), (4, -8.25, z + 1.1), 0.04)], hexc('#d8c8a0'), 'rail')
    for k in range(3):
        p = person((-2 + k * 2, -7.5, z + 0.08), hexc('#e8e2d6'), pants=hexc('#5a6a8a'), rot_z=math.pi, act='talk', s=1.0, name=f'pt{k}')
        link(sphere((0, 0.01, 0.07), 0.145, hexc('#f2f2ee'), scale=(1, 1.05, 0.75)), O[p['head']])  # ヘルメット
    cam = camera(40)
    cam_path(cam, [(0, (-3, -19, 31.4), (0, -7, 31)), (1, (2, -19, 31.8), (0, -7, 31))], n)
    return MB('wind')


def kEmptyGondola(n):  # 塗り直す人は、眠っている（足場には誰もいない）
    tower_env(n)
    z = 30.0
    box((0, -7.6, z), (8, 1.4, 0.15), hexc('#d8c8a0'))
    mbar([((-4, -8.25, z + 1.1), (4, -8.25, z + 1.1), 0.04)], hexc('#d8c8a0'), 'rail')
    for k in range(2):
        cyl((-1.5 + k * 3, -7.3, z + 0.35), 0.18, 0.5, hexc('#c8c4bc'))  # ペンキの缶
    cam = camera(40)
    cam_path(cam, [(0, (-3, -19, 31.4), (0, -7, 31)), (1, (-5, -20, 32), (0, -7, 31))], n)
    return MB('wind')


def kRustSpread(n):  # 錆の筋は、毎年、広がっていく
    tower_env(n, rust=220, f0=int(n * 0.05), f1=int(n * 0.9))
    cam = camera(32)
    cam_path(cam, [(0, (-36, -42, 24), (0, 0, 66)), (1, (-34, -40, 28), (0, 0, 74))], n)
    return MB('wind')
