"""カット：SCENE 09〜16（章8〜15）"""
from hs1 import *
from shots import _font, _tl


# ---------------- SCENE 09 虫だけは、変わらない（章8） ----------------
def grass_ground(dusk=True):
    sky(hexc('#e8b888') if dusk else hexc('#9cc3e3')); s = bpy.context.scene; s.view_settings.exposure = 0.3
    light_dir((0.6, -0.5, 0.45)); s.display.shading.shadow_intensity = 0.45
    ground(rgb=hexc('#7a6a4a'))


def hAntLine(n):  # 公園の草むら：アリは、いつもの道を歩いている
    grass_ground()
    grass(260, (-0.9, 0.9), (-0.3, 1.6), seed=31, h=(0.12, 0.4))
    pebbles(30, (-0.8, 0.8), (-0.4, 1.4), seed=31, r=(0.01, 0.04))
    ants = [ant((0, 0, 0), s=1.0, name=f'ant{i}') for i in range(16)]
    march(ants, n, lambda u: (-0.5 + (u % 1.0), 0.02 + 0.05 * math.sin(u * 9)), speed=0.0022)
    cam = camera(60, dof=0.35, fstop=2.0)
    cam_path(cam, [(0, (0.25, -0.55, 0.12), (-0.05, 0.0, 0.0)), (1, (0.2, -0.45, 0.1), (-0.05, 0.15, 0.0))], n)
    m = MB(0.0, amb='garden'); m['insects'] = 0.6
    return m


def hMosquito(n):  # 蚊は、いつもの高さを飛んでいる
    grass_ground()
    grass(200, (-1.2, 1.2), (0, 2.0), seed=32, h=(0.2, 0.6))
    for i in range(6):
        mq = mosquito((0, 0, 0), name=f'mq{i}')
        buzz(mq, n, (random.Random(i).uniform(-0.3, 0.3), 0.6 + random.Random(i + 3).uniform(-0.2, 0.2), 0.55), r=0.12, seed=i)
    cam = camera(55, dof=0.75, fstop=2.0)
    cam_path(cam, [(0, (0.1, -0.2, 0.55), (0, 0.6, 0.55)), (1, (-0.05, -0.15, 0.56), (0, 0.6, 0.55))], n)
    m = MB(0.0, amb='garden'); m['insects'] = 0.7
    return m


def hAntBody(n):  # 虫の心臓：背中に沿った細長い管が、二本になる。酸素は体の横の穴から管で直接
    sky(hexc('#2a2f3a')); s = bpy.context.scene; s.view_settings.exposure = 0.3
    s.display.shading.show_shadows = False
    a = ant((0, 0, 0.0), s=22, name='bigant', c=hexc('#6a4a3a'))
    for c in a.children:
        if c.type == 'MESH':
            c.data.materials.clear(); c.data.materials.append(gmat((0.85, 0.75, 0.65), 0.28, 'antghost'))
    f2 = int(n * 0.35)
    # 背中の管（1本 → 2本）。ゆっくり脈打つ
    t1 = cyl((0, 0.15, 0.48), 0.035, 1.5, (1, 1, 1), rot=(math.pi / 2, 0, 0)); t1.data.materials.clear(); t1.data.materials.append(gmat(HB_ON, 1.0, 'tube'))
    t2 = cyl((0.09, 0.15, 0.47), 0.035, 1.5, (1, 1, 1), rot=(math.pi / 2, 0, 0)); t2.data.materials.clear(); t2.data.materials.append(gmat(HB_ON, 1.0, 'tube'))
    appear(t2, f2)
    # 体の横の穴（気門）から枝分かれする管と、流れこむ空気の粒
    starts, ends = [], []
    for k in range(5):
        y = -0.6 + k * 0.42
        for sx in (-1, 1):
            hole = (sx * 0.27, y, 0.22)
            ball(hole, 0.03, (0.4, 0.8, 1.0), a=1.0, seg=8)
            for b in range(2):
                e = (sx * 0.08, y + (b - 0.5) * 0.18, 0.28 + 0.05 * b)
                rope(hole, e, r=0.008, c=(0.5, 0.85, 1.0))
                starts.append(hole); ends.append(e)
    particles_flow(n, starts, ends, rgb=(0.7, 0.95, 1.0), size=0.018, period=36, a=0.9)
    cam = camera(40)
    cam_path(cam, [(0, (1.8, -2.2, 1.4), (0, 0.1, 0.3)), (1, (2.2, -1.2, 1.5), (0, 0.1, 0.3))], n)
    return MB(0.0, amb='silent')


def soil_section(n, rain=True):
    sky(hexc('#aab4bc')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    light_dir((0.3, -0.6, 0.7))
    box((0, 0.6, -0.6), (3.0, 1.2, 1.2), hexc('#5a4030'))  # 土（手前が断面）
    for i in range(30):
        rnd = random.Random(i)
        sphere((rnd.uniform(-1.4, 1.4), -0.001, rnd.uniform(-1.15, -0.05)), rnd.uniform(0.02, 0.06), hexc('#7a6a5a'), scale=(1, 0.2, 1), seg=8)
    box((0, 0.6, 0.01), (3.0, 1.2, 0.02), hexc('#6a5a3a'))
    grass(80, (-1.4, 1.4), (0.1, 1.1), seed=33, h=(0.08, 0.25))
    for k in range(3):
        cyl((-0.8 + k * 0.8, 0.4, 0.025), 0.18, 0.01, hexc('#8aa0b0'))  # 水たまり
    if rain:
        drops = []
        rnd = random.Random(34)
        for i in range(30):
            d = cyl((rnd.uniform(-1.4, 1.4), rnd.uniform(0.0, 1.2), 1.5), 0.004, 0.08, hexc('#c8d8e8'))
            z0 = rnd.uniform(0.2, 2.0)
            for f in range(1, n + 24, 24):
                d.location.z = 2.0; d.keyframe_insert('location', index=2, frame=f)
                d.location.z = 0.02; d.keyframe_insert('location', index=2, frame=f + 23)


def hWormSoil(n):  # 雨上がりの土の中では、ミミズが動いている
    soil_section(n, rain=False)
    wm = worm((-0.6, -0.01, -0.45), k=14, r=0.03, rot_z=math.pi / 2, name='worm')
    crawl(wm, n, period=30, amp=0.015)
    wm.keyframe_insert('location', frame=1); wm.location.x = 0.4; wm.keyframe_insert('location', frame=n)
    cam = camera(40, dof=1.2, fstop=2.4)
    cam_path(cam, [(0, (0.2, -1.6, 0.0), (0, 0.3, -0.35)), (1, (0.0, -1.4, -0.05), (0.1, 0.3, -0.4))], n)
    m = MB(0.0, amb='garden'); m['insects'] = 0.3
    return m


def hWormRings(n):  # ミミズの心臓の役目をする管が、五対 → 十対
    sky(hexc('#2a2f3a')); s = bpy.context.scene; s.view_settings.exposure = 0.3
    s.display.shading.show_shadows = False
    wm = worm((-0.9, 0, 0.3), k=16, r=0.09, rot_z=math.pi / 2, name='bigworm')
    for sn in wm['segs']:
        o = O[sn]; o.data.materials.clear(); o.data.materials.append(gmat((0.95, 0.6, 0.6), 0.3, 'wormghost'))
    crawl(wm, n, period=40, amp=0.02)
    f2 = int(n * 0.4)
    for k in range(10):
        x = -0.75 + k * 0.135
        bpy.ops.mesh.primitive_torus_add(location=(x * 1.0 + 0.0, 0, 0.3), major_radius=0.07, minor_radius=0.012, rotation=(0, math.pi / 2, 0))
        t = bpy.context.object; t.data.materials.clear(); t.data.materials.append(gmat(HB_ON, 1.0, 'ring'))
        if k >= 5:
            appear(t, f2 + (k - 5) * 8)
        beat_scale(t, n, bpm=40, amp=0.12, offset=k * 0.1)
    cam = camera(40)
    cam_path(cam, [(0, (0.6, -3.0, 1.0), (0.2, 0, 0.3)), (1, (0.3, -2.7, 0.9), (0.2, 0, 0.3))], n)
    return MB(0.0, amb='silent')


def hBugsNormal(n):  # 心臓が二つになった世界で、虫は、いつもどおり
    grass_ground()
    grass(320, (-1.0, 1.0), (-0.3, 1.8), seed=35, h=(0.12, 0.45))
    ants = [ant((0, 0, 0), s=1.0, name=f'ant{i}') for i in range(12)]
    march(ants, n, lambda u: (-0.5 + (u % 1.4), 0.2 + 0.2 * math.sin(u * 3)), speed=0.003)
    hp = grasshopper((0.25, 0.9, 0.16), s=2.0, rot_z=0.6)
    box((0.25, 0.9, 0.07), (0.03, 0.2, 0.14), hexc('#4f7a3c'), rot=(0.4, 0, 0.6))
    bob(hp, n, amp=0.005, period=40)
    cam = camera(50, dof=0.6, fstop=2.0)
    cam_path(cam, [(0, (-0.3, -0.5, 0.25), (0.1, 0.4, 0.08)), (1, (0.3, -0.5, 0.28), (0.1, 0.4, 0.1))], n)
    m = MB(0.0, amb='garden'); m['insects'] = 0.7
    return m


# ---------------- SCENE 10 心臓を持たない海（章9） ----------------
def sea_floor(seed=40):
    underwater()
    light_shafts(7, seed=seed)
    rnd = random.Random(seed)
    for i in range(6):
        rock((rnd.uniform(-5, 5), rnd.uniform(2, 9), 0.1), r=rnd.uniform(0.4, 1.0), c=rnd.choice([hexc('#6a6a64'), hexc('#5a6a6a')]), seed=i)
    for i in range(8):
        coral((rnd.uniform(-5, 5), rnd.uniform(3, 10), 0), s=rnd.uniform(1.0, 2.0), seed=i + 10)


def hSeaJelly(n):  # 同じ夕方。海の中でも、何も変わっていない
    sea_floor()
    for i in range(5):
        rnd = random.Random(i)
        jellyfish((rnd.uniform(-2.5, 2.5), rnd.uniform(1.0, 5.0), rnd.uniform(1.2, 2.8)), s=rnd.uniform(0.8, 1.3), n=n, seed=i)
    for i in range(4):
        anemone((-1.5 + i * 1.0, 2.5 + (i % 2) * 0.6, 0.0), s=1.6, n=n, seed=i)
    cam = camera(32)
    cam_path(cam, [(0, (0.0, -4.0, 1.6), (0, 3, 1.6)), (1, (0.6, -3.4, 1.8), (0.2, 3, 1.8))], n)
    return MB(0.0, amb='sea')


def hJellyClose(n):  # 薄い体の表面から、海の水の酸素が、そのまましみ込む
    underwater(deep=True)
    j = jellyfish((0, 0, 1.4), s=2.2, n=n, seed=7, rise=0.12)
    rnd = random.Random(41)
    starts, ends = [], []
    for i in range(36):
        th = rnd.uniform(0, 2 * math.pi); ph = rnd.uniform(0.1, 1.3)
        d = Vector((math.cos(th) * math.sin(ph), math.sin(th) * math.sin(ph), math.cos(ph) * 0.6))
        c = Vector((0, 0, 1.4 + 0.25))
        starts.append(tuple(c + d * 1.4)); ends.append(tuple(c + d * 0.6))
    particles_flow(n, starts, ends, rgb=(0.75, 0.95, 1.0), size=0.025, period=50, a=0.85)
    cam = camera(40)
    cam_path(cam, [(0, (0.0, -3.6, 1.8), (0, 0, 1.5)), (1, (0.6, -3.2, 1.7), (0, 0, 1.5))], n)
    return MB(0.0, amb='sea')


def hAnemone(n):  # イソギンチャクも、サンゴも、心臓を持っていない
    underwater()
    light_shafts(5, seed=42)
    rock((0, 0.8, 0.0), r=0.55, c=hexc('#6a6a64'), seed=3)
    for i in range(5):
        rnd = random.Random(i + 20)
        anemone((rnd.uniform(-0.9, 0.9), rnd.uniform(0.2, 1.3), 0.0), s=1.4, n=n, seed=i)
    for i in range(6):
        coral((-2.0 + i * 0.8, 2.0 + (i % 2), 0), s=1.6, seed=i + 30)
    cam = camera(40, dof=2.6, fstop=2.8)
    cam_path(cam, [(0, (1.4, -1.8, 1.1), (0, 0.8, 0.6)), (1, (0.6, -2.0, 1.0), (0, 0.8, 0.6))], n)
    return MB(0.0, amb='sea')


def hSponge(n):  # カイメンは、体じゅうの小さな穴に水を通して、息をして、食べている
    underwater()
    rock((0, 0.3, -0.2), r=0.9, c=hexc('#6a6a64'), seed=5)
    sponge((0, 0.3, 0.35), s=1.6)
    rnd = random.Random(43)
    starts, ends = [], []
    for i in range(24):
        a = rnd.uniform(0, 2 * math.pi); z = rnd.uniform(0.5, 1.3)
        starts.append((1.0 * math.cos(a), 0.3 + 1.0 * math.sin(a), z)); ends.append((0.4 * math.cos(a), 0.3 + 0.4 * math.sin(a), z))
    for i in range(10):
        starts.append((rnd.uniform(-0.1, 0.1), 0.3 + rnd.uniform(-0.1, 0.1), 1.4)); ends.append((rnd.uniform(-0.3, 0.3), 0.3 + rnd.uniform(-0.3, 0.3), 2.6))
    particles_flow(n, starts, ends, rgb=(0.8, 0.95, 1.0), size=0.025, period=45, a=0.85)
    cam = camera(40)
    cam_path(cam, [(0, (1.2, -2.6, 1.6), (0, 0.3, 1.1)), (1, (0.4, -2.8, 1.5), (0, 0.3, 1.1))], n)
    return MB(0.0, amb='sea')


def planaria(loc, s=1.0, rot_z=0.0, name='plan'):
    root = empty(loc, name); root.scale = (s, s, s); root.rotation_euler = (0, 0, rot_z)
    link(sphere((0, 0, 0.005), 0.05, hexc('#6a5a4a'), scale=(0.45, 1.3, 0.1), seg=14), root)
    link(sphere((0, -0.055, 0.006), 0.03, hexc('#6a5a4a'), scale=(0.9, 0.7, 0.12), seg=12), root)
    for sx in (-1, 1):
        link(sphere((sx * 0.011, -0.055, 0.009), 0.005, hexc('#f4efe6'), seg=8), root)
        link(sphere((sx * 0.011, -0.057, 0.011), 0.0025, hexc('#111111'), seg=6), root)
    return root


def hPlanaria(n):  # 川底の石の裏の、平たいプラナリア
    sky(hexc('#4a7a6a')); s = bpy.context.scene; s.view_settings.exposure = 0.25
    light_dir((0.2, -0.3, 0.9))
    ground(rgb=hexc('#8a7a5a'))
    pebbles(60, (-0.6, 0.6), (-0.4, 0.8), seed=44, r=(0.02, 0.07))
    st = rock((0.05, 0.25, 0.12), r=0.22, c=hexc('#5a5a54'), seed=8)
    st.rotation_euler = (0.3, 0, 0)
    w = box((0, 0.3, 0.35), (2.0, 2.0, 0.7), (1, 1, 1)); w.data.materials.clear(); w.data.materials.append(gmat((0.5, 0.75, 0.7), 0.12, 'water'))
    for i in range(3):
        p = planaria((-0.12 + i * 0.1, 0.05 - i * 0.03, 0.002), s=1.2, rot_z=0.3 - i * 0.4, name=f'pl{i}')
        p.keyframe_insert('location', frame=1)
        p.location.y += 0.08 + i * 0.02; p.keyframe_insert('location', frame=n)
    cam = camera(60, dof=0.45, fstop=2.0)
    cam_path(cam, [(0, (0.0, -0.45, 0.2), (0, 0.05, 0.0)), (1, (0.1, -0.4, 0.18), (0, 0.08, 0.0))], n)
    return MB(0.0, amb='sea')


def hSeaWide(n):  # 心臓がなくても、生き物は、ちゃんと生きている
    sea_floor(seed=45)
    for i in range(8):
        rnd = random.Random(i + 50)
        jellyfish((rnd.uniform(-5, 5), rnd.uniform(2.0, 9.0), rnd.uniform(1.5, 4.0)), s=rnd.uniform(0.8, 1.4), n=n, seed=i + 50)
    for i in range(6):
        anemone((-3 + i * 1.2, 3.0 + (i % 3) * 0.8, 0.0), s=1.6, n=n, seed=i + 5)
    cam = camera(28)
    cam_path(cam, [(0, (0.0, -6.0, 1.2), (0, 4, 2.2)), (1, (0.0, -4.6, 1.0), (0, 4, 2.8))], n)
    return MB(0.0, amb='sea')


# ---------------- SCENE 11 胸に耳を当てる夜（章10） ----------------
def night_bedroom(n, kid_asleep_at=None, seed=50):
    sky(hexc('#141a2c')); s = bpy.context.scene; s.view_settings.exposure = -0.05
    light_dir((0.2, 0.6, 0.7)); s.display.shading.shadow_intensity = 0.3
    room(5, 4.5, 2.5, floor=hexc('#7a6650'), wall=hexc('#c8c4d0'), window=True, night=True)
    bed((0, 0.6, 0), quilt=hexc('#6a7aa0'))
    you = person((-0.15, 0.85, 0.5), hexc('#8a9ab8'), pose='lie', rot_z=0, name='you')
    kid = person((0.28, 0.75, 0.52), hexc('#e8a33d'), pants=hexc('#4a6aa0'), pose='lie', rot_z=0.35, s=0.6, name='kid')
    box((0.0, 1.15, 0.57), (1.14, 1.0, 0.07), hexc('#6a7aa0'), bevel=0.03)  # 掛け布団
    hearts(you, n, bpm=(48, 42), size=1.4, up=4.0, out=1.2)
    hearts(kid, n, bpm=(70, 62), size=1.4, up=4.0, out=1.2)
    wall_clock((-1.4, 2.19, 1.8), n, 22.0, 22.0 + n / FPS / 3600.0)
    return you, kid


def hBedChild(n):  # 夜。子どもが、あなたの胸に、耳を当てる
    you, kid = night_bedroom(n)
    cam = camera(35, dof=1.6, fstop=2.2)
    cam_path(cam, [(0, (1.6, -0.9, 1.5), (0.05, 0.3, 0.6)), (1, (1.2, -0.6, 1.35), (0.05, 0.3, 0.6))], n)
    return MB(1.0, amb='night')


def hKidCount(n):  # 右と、左。どっちが速いかな（指を折って数える）
    you, kid = night_bedroom(n, seed=51)
    hand = empty((0.55, 0.42, 0.74), 'kh'); hand.rotation_euler = (0, 0, 0.4)
    link(sphere((0, 0, 0), 0.035, SKIN[0], scale=(1, 0.8, 0.5)), hand)
    for k in range(5):
        j = empty((-0.024 + k * 0.012, -0.03, 0.0), 'kf'); link(j, hand)
        link(cyl((0, -0.02, 0), 0.006, 0.04, SKIN[0], rot=(math.pi / 2, 0, 0), verts=8), j)
        j.keyframe_insert('rotation_euler', frame=1)
        f = int(n * 0.15) + k * int(n * 0.12)
        j.keyframe_insert('rotation_euler', frame=f)
        j.rotation_euler.x = 1.3; j.keyframe_insert('rotation_euler', frame=f + 6)
    cam = camera(45, dof=0.8, fstop=2.0)
    cam_path(cam, [(0, (0.9, -0.4, 1.1), (0.3, 0.35, 0.65)), (1, (0.75, -0.25, 1.05), (0.3, 0.35, 0.65))], n)
    return MB(1.0, amb='night')


def hKidAsleep(n):  # 数えているうちに、子どもは眠ってしまう
    you, kid = night_bedroom(n, seed=52)
    cam = camera(30)
    cam_path(cam, [(0, (-1.3, -1.6, 1.9), (0.1, 0.5, 0.5)), (1, (-1.0, -1.3, 1.8), (0.1, 0.5, 0.5))], n)
    return MB(0.9, amb='night')


def hCeiling(n):  # 布団の中で、自分の胸の音を聞く。ゆっくりの音が、二つ
    you, kid = night_bedroom(n, seed=53)
    cam = camera(30)
    cam_path(cam, [(0, (0.0, 0.2, 2.35), (-0.1, 0.4, 0.5)), (1, (0.0, 0.5, 2.3), (-0.12, 0.6, 0.5))], n)
    return MB(1.0, amb='night')


def hNightTown(n):  # 窓の外の街も、今夜は二つの鼓動で眠っている
    env_town(night=True, nx=5, ny=5, seed=8)
    rnd = random.Random(54)
    pole_wires(-8, 8, -7.0, h=6.0)
    for i in range(6):
        b = bird((-6 + i * 2.3, -7.0, 5.62), c=hexc('#5a5a60'), s=3.0, rot_z=math.pi)
        hearts(birdbody(b), n, bpm=(70, 62), size=1.6)
    for k in range(3):
        x = -14 + k * 14
        box((x + 3.5, -10.5, 0.45), (0.9, 0.8, 0.9), hexc('#a07050'))  # 犬小屋
        roof((x + 3.5, -10.5, 0.9), 1.1, 1.0, 0.5, hexc('#6a3a2a'))
        d = animal((x + 3.5, -11.3, 0), 'shiba', pose='sit', s=1.3, rot_z=0.2, name=f'd{k}')
        hearts(d, n, bpm=(70, 62), size=1.6)
    for k in range(10):
        pulse((rnd.uniform(-30, 30), rnd.uniform(-25, 25), rnd.uniform(1.5, 5.0)), n, bpm=rnd.uniform(45, 60), r=0.12, offset=rnd.random())
    cam = camera(32)
    cam_path(cam, [(0, (7.0, -13.0, 8.5), (-1, -7, 5.4)), (0.35, (7.0, -17, 9.5), (-1, -7, 5.0)), (1, (14, -48, 26), (0, 0, 0))], n)
    return MB(0.8, amb='night')


# ---------------- SCENE 12 ホームで倒れた人が、座り直す（章11） ----------------
def platform(seed=60):
    sky(hexc('#c9d6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    light_dir((0.3, -0.5, 0.8)); s.display.shading.shadow_intensity = 0.4
    box((0, 0, -0.5), (60, 40, 1), hexc('#5a5650'))
    box((0, 2.5, 0.5), (60, 5, 1.0), hexc('#c9c4ba'))
    box((0, 0.05, 1.01), (60, 0.25, 0.01), hexc('#f2d24b'))
    for x in (-8, 0, 8):
        cyl((x, 4.2, 2.5), 0.12, 3.0, hexc('#8c8a86'))
    box((0, 4.2, 4.1), (24, 1.6, 0.15), hexc('#6a6864'))
    box((0, 4.9, 2.0), (60, 0.2, 3.0), hexc('#d8d2c4'))
    for x in (-1.2, 2.5):
        box((x, 3.6, 1.45), (1.6, 0.45, 0.06), hexc('#4a7ab0'))  # ベンチ
        box((x, 3.82, 1.7), (1.6, 0.06, 0.45), hexc('#4a7ab0'))
    # AED の箱
    box((4.6, 4.78, 2.2), (0.5, 0.06, 0.6), hexc('#f2f2ee'))
    box((4.6, 4.74, 2.35), (0.4, 0.02, 0.18), hexc('#2a9a4a'))
    label3d('AED', (4.6, 4.73, 2.12), 0.14, hexc('#c02020'))


def crouch_man(loc, rot_z=0.0, name='man'):
    p = person((loc[0], loc[1], loc[2] - 0.22), hexc('#3a4a6a'), pose='sit', rot_z=rot_z, name=name)
    arm_to(p, 1, (-0.02, -0.26, 0.92))
    return p


def hPlatformCrouch(n):  # 二日目の朝。駅のホームで、一人の男性がしゃがみこむ
    platform()
    man = crouch_man((-1.2, 3.0, 1.0), rot_z=0.2, name='man')
    hearts(man, n, bpm=(70, 64), mode=('flicker', 'on'), size=1.5)
    rnd = random.Random(61)
    for i in range(6):
        p = crowd_person((-5 + i * 1.8 + rnd.uniform(-0.3, 0.3), 1.6 + rnd.uniform(-0.3, 0.5), 1.0), rnd, rot_z=rnd.uniform(-0.6, 0.6) + math.pi * 0.0, name=f'pa{i}')
        hearts(p, n, size=1.4)
    cam = camera(32)
    cam_path(cam, [(0, (2.0, -2.8, 2.4), (-1.0, 3.0, 1.4)), (1, (1.0, -2.2, 2.2), (-1.2, 3.0, 1.4))], n)
    return MB(0.7, amb='city')


def hAEDRun(n):  # 駅員が、壁の箱から、AEDを持って走ってくる
    platform()
    man = crouch_man((-1.2, 3.0, 1.0), rot_z=0.2, name='man')
    hearts(man, n, bpm=(70, 64), mode=('flicker', 'on'), size=1.5)
    staff = person((4.6, 4.2, 1.0), hexc('#2a3a5a'), pants=hexc('#2a3a5a'), rot_z=math.pi / 2, name='staff')
    link(cyl((0, 0.02, 0.17), 0.14, 0.05, hexc('#2a3a5a')), O[staff['head']])  # 帽子
    aed = boxc((0.0, -0.32, 0.9), (0.32, 0.12, 0.26), hexc('#f2a030')); aed.parent = staff
    move(staff, [(1, (4.6, 4.2, 1.0)), (int(n * 0.15), (4.6, 4.0, 1.0)), (int(n * 0.85), (-0.2, 3.0, 1.0)), (n, (-0.3, 3.0, 1.0))])
    hearts(staff, n, size=1.4)
    rnd = random.Random(62)
    for i in range(4):
        x = 0.5 + i * 1.0
        p = crowd_person((x, 2.6, 1.0), rnd, rot_z=math.pi * 0.5, name=f'by{i}')
        move(p, [(1, (x, 2.6, 1.0)), (int(n * 0.3) + i * 8, (x, 2.6, 1.0)), (int(n * 0.5) + i * 8, (x, 1.3, 1.0)), (n, (x, 1.3, 1.0))])
    cam = camera(30)
    cam_path(cam, [(0, (6.0, -2.0, 2.4), (3.0, 3.4, 1.6)), (1, (2.0, -2.4, 2.4), (0.0, 3.2, 1.5))], n)
    return MB(0.6, amb='city')


def hFlicker(n):  # 心臓の一つは震えるだけ。でも、もう一つの心臓は打ち続ける
    platform()
    man = crouch_man((-1.2, 3.0, 1.0), rot_z=0.0, name='man')
    hearts(man, n, bpm=(70, 64), mode=('flicker', 'on'), size=1.6)
    cam = camera(50, dof=1.2, fstop=2.0)
    cam_path(cam, [(0, (-0.95, 1.85, 1.95), (-1.2, 3.0, 1.75)), (1, (-1.05, 1.95, 1.9), (-1.2, 3.0, 1.72))], n)
    return MB(1.0, amb='city')


def hSitBack(n):  # 男性は、ベンチに座り直す。大丈夫です、と手を上げる
    platform()
    man = person((-1.2, 3.55, 1.0), hexc('#3a4a6a'), pose='sit', rot_z=0.0, name='man')
    j = O[man['arms'][1]]
    j.keyframe_insert('rotation_euler', frame=1); j.keyframe_insert('rotation_euler', frame=int(n * 0.4))
    j.rotation_euler = (math.pi * 0.85, 0, -0.2); j.keyframe_insert('rotation_euler', frame=int(n * 0.4) + 10)
    man['arms'] = [man['arms'][0]]
    hearts(man, n, bpm=(70, 64), mode=('weak', 'on'), size=1.5)
    st = person((0.5, 3.0, 1.0), hexc('#2a3a5a'), pants=hexc('#2a3a5a'), rot_z=math.pi * 0.6, name='staff')
    boxc((-0.55, 3.2, 1.06), (0.32, 0.26, 0.12), hexc('#f2a030'))
    hearts(st, n, size=1.4)
    cam = camera(35)
    cam_path(cam, [(0, (0.6, 0.6, 2.0), (-1.0, 3.4, 1.7)), (1, (0.3, 0.9, 1.9), (-1.1, 3.4, 1.7))], n)
    return MB(0.9, amb='city')


def ambulance(loc, rot_z=0.0, lights=True, n=240):
    root = empty(loc, 'amb'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 1.3), (2.1, 5.2, 2.2), hexc('#f4f4f2'), bevel=0.1), root)
    link(box((0, -2.75, 0.85), (2.0, 0.5, 1.2), hexc('#f4f4f2'), bevel=0.08), root)
    link(box((0, -2.98, 1.25), (1.8, 0.05, 0.5), hexc('#4d5d6b')), root)
    link(box((1.06, 0, 1.2), (0.02, 5.0, 0.25), hexc('#d83a3a')), root)
    link(box((-1.06, 0, 1.2), (0.02, 5.0, 0.25), hexc('#d83a3a')), root)
    for sx in (-0.95, 0.95):
        for sy in (-1.9, 1.6):
            link(cyl((sx, sy, 0.38), 0.38, 0.28, hexc('#1e1e1e'), rot=(0, math.pi / 2, 0)), root)
    for sx in (-0.6, 0.6):
        l = link(box((sx, -1.9, 2.45), (0.4, 0.3, 0.12), hexc('#ff3a3a')), root)
        if lights:
            blink(l, n, 8, 0 if sx < 0 else 1)
    return root


def hAmbulance(n):  # 救急車が着く。男性は、救急隊員と話しながら、自分の足で乗り込む
    station_front()
    amb = ambulance((-2.5, 1.5, 0), rot_z=math.pi / 2, n=n)
    amb.keyframe_insert('location', frame=1)
    amb.location = (2.0, 1.5, 0); amb.keyframe_insert('location', frame=int(n * 0.25))
    amb.location = (2.5, 1.5, 0); amb.keyframe_insert('location', frame=int(n * 0.3))
    man = person((0.5, -1.0, 0), hexc('#3a4a6a'), rot_z=0, name='man')
    move(man, [(1, (0.5, -1.0, 0)), (int(n * 0.35), (0.5, -1.0, 0)), (int(n * 0.85), (4.6, 1.0, 0)), (n, (5.2, 1.3, 0))])
    hearts(man, n, bpm=(70, 64), mode=('weak', 'on'), size=1.5)
    for i in range(2):
        e = person((1.2 + i * 0.6, -0.8 - i * 0.3, 0), hexc('#3a6aa0'), pants=hexc('#3a6aa0'), rot_z=math.pi * 0.6, name=f'emt{i}')
        move(e, [(1, (1.2 + i * 0.6, -0.8 - i * 0.3, 0)), (int(n * 0.35), (1.2 + i * 0.6, -0.8 - i * 0.3, 0)), (int(n * 0.85), (4.0 + i * 0.6, 0.5 - i * 0.4, 0)), (n, (4.4 + i * 0.6, 0.7, 0))])
        hearts(e, n, size=1.4)
    cam = camera(30)
    cam_path(cam, [(0, (-2.0, -7.0, 2.0), (1.5, 0.5, 1.0)), (1, (0.5, -7.0, 2.0), (3.5, 0.8, 1.0))], n)
    return MB(0.6, amb='city')


# ---------------- SCENE 13 救急の夜が、静かになる（章12） ----------------
def er_room(night=True):
    hosp_room(10, 7, 2.8, window=False, night=False)
    s = bpy.context.scene; sky(hexc('#c8ccd4')); s.view_settings.exposure = 0.25
    box((2.8, 2.6, 0.55), (3.0, 0.7, 1.1), hexc('#9fb7c4'))
    box((2.8, 2.6, 1.12), (3.1, 0.75, 0.05), hexc('#f4f4f2'))
    label3d('救急外来', (2.8, 3.38, 2.2), 0.3, hexc('#c02020'))
    box((2.8, 3.42, 2.2), (2.0, 0.04, 0.5), hexc('#f4f4f2'))
    for k in range(2):
        st = box((-3.0 + k * 1.4, 1.5, 0.45), (0.7, 2.0, 0.12), hexc('#e8eef0'))
        for sx in (-0.3, 0.3):
            cyl((-3.0 + k * 1.4 + sx, 1.5, 0.22), 0.02, 0.44, hexc('#9aa0a6'))


def hERNight(n):  # 三日目の夜。救急の受付が、いつもより静か
    er_room()
    dc = doctor((1.2, 1.4, 0), rot_z=math.pi * 0.8, name='doc')
    cup = cyl((0, 0, 0), 0.04, 0.1, hexc('#f4f4f2')); cup.parent = dc; cup.location = (0.14, -0.4, 1.4)
    arm_to(dc, 1, (0.14, -0.4, 1.38))
    hearts(dc, n, size=1.4)
    nu = nurse((2.8, 3.1, 0), rot_z=math.pi, name='nurse', act='type')
    hearts(nu, n, size=1.4)
    wall_clock((-1.0, 3.42, 2.1), n, 23.0, 23.0 + n / FPS / 3600.0)
    cam = camera(30)
    cam_path(cam, [(0, (-3.6, -3.0, 1.9), (1.0, 2.0, 1.1)), (1, (-2.8, -3.2, 1.8), (1.5, 2.0, 1.1))], n)
    return MB(0.4, amb='room')


def draw_causes(im, d):
    d.rectangle((0, 0, 1920, 1080), fill=(250, 247, 240))
    d.text((110, 80), '日本の死因', font=_font(110), fill=(60, 64, 80))
    rows = [('1', 'がん', (150, 160, 175), 1500), ('2', '心臓の病気', (215, 70, 85), 1100)]
    y = 330
    for num, lab, col, w in rows:
        d.ellipse((110, y, 260, y + 150), fill=col)
        d.text((158, y + 12), num, font=_font(110), fill=(255, 255, 255))
        d.rounded_rectangle((320, y + 20, 320 + w, y + 130), 30, fill=col)
        d.text((360, y + 18), lab, font=_font(96), fill=(255, 255, 255))
        y += 260


def hCauseCard(n):  # 日本で、がんの次に多い死因は、心臓の病気
    sky(hexc('#2a2f3a')); s = bpy.context.scene; s.view_settings.exposure = 0.35
    s.display.shading.show_shadows = False
    tex_plane('h_causes', draw_causes, (0, 0, 1.0), 3.2, 1.8)
    h = heart3d((1.15, -0.3, 0.55), s=0.18); beat_scale(h, n, bpm=60, amp=0.12)
    cam = camera(40)
    cam_path(cam, [(0, (-0.3, -4.2, 1.1), (0, 0, 1.0)), (1, (0.2, -3.8, 1.05), (0, 0, 1.0))], n)
    return MB(0.6, amb='silent')


def hQuietStreet(n):  # 夜の街に響く救急車の音も、少なくなる
    street_env(night=True, corner=False)
    amb = ambulance((1.0, 4.0, 0), rot_z=0.0, lights=False, n=n)
    box((1.0, 4.0, 0.002), (3.0, 6.0, 0.01), hexc('#2e323a'))
    rnd = random.Random(70)
    p = crowd_person((-0.6, -4, 0), rnd, rot_z=math.pi, name='walker')
    move(p, [(1, (-0.6, -4, 0)), (n, (-0.6, 2, 0))])
    hearts(p, n, size=1.5)
    cam = camera(30)
    cam_path(cam, [(0, (-1.0, -12, 2.2), (0.5, 3, 1.2)), (1, (-0.6, -10, 2.0), (0.5, 3, 1.2))], n)
    return MB(0.4, amb='night')


def hDocWaves(n):  # どちらの心臓が弱っているのかを、見つける。二本の波を、一本ずつ読む
    hosp_room(7, 6, 2.7, window=False)
    _, pt = hosp_bed((-0.6, 1.2, 0), rot_z=0, patient=hexc('#a9c4d8'), sit_up=True, name='pt')
    hearts(pt, n, bpm=(66, 60), mode=('weak', 'on'), size=1.3)
    m = monitor((0.8, 2.2, 1.5), n, s=2.0, name='mon', stand=False)
    dc = doctor((1.9, 1.3, 0), rot_z=-2.6, name='doc')
    j = arm_to(dc, 1, (0.05, -0.75, 1.5))
    # 指先が波をなぞる
    tip = ball((0, 0, 0), 0.03, SKIN[0], name='tip')
    for f, (x, z) in ((1, (0.35, 1.6)), (int(n * 0.35), (1.25, 1.6)), (int(n * 0.5), (0.35, 1.42)), (int(n * 0.85), (1.25, 1.42))):
        tip.location = (x, 2.12, z); tip.keyframe_insert('location', frame=f)
    cam = camera(35)
    cam_path(cam, [(0, (0.9, -1.6, 1.7), (0.6, 1.8, 1.35)), (1, (0.6, -1.3, 1.65), (0.7, 1.9, 1.4))], n)
    return MB(0.7, amb='room')


def hWeakHeal(n):  # 弱った方の心臓を、ゆっくり治す。その間、もう一つの心臓が体を支える
    hosp_room(7, 6, 2.7, window=True, night=True)
    _, pt = hosp_bed((0, 1.0, 0), rot_z=0, patient=hexc('#a9c4d8'), name='pt')
    iv_pole((0.75, 0.3, 0))
    rope((0.75, 0.3, 1.7), (0.25, 0.4, 0.75), r=0.004, c=hexc('#e8f0f4'))
    hearts(pt, n, bpm=(58, 54), mode=('grow', 'on'), size=1.8, up=4.0, out=1.2)
    cam = camera(40, dof=1.6, fstop=2.2)
    cam_path(cam, [(0, (1.4, -0.9, 1.7), (0, 0.7, 0.65)), (1, (1.1, -0.6, 1.6), (0, 0.7, 0.65))], n)
    return MB(0.9, amb='night')


# ---------------- SCENE 14 献血ルームの行列（章13） ----------------
def hBloodQueue(n):  # 四日目。駅前の献血ルームに、行列ができている
    station_front()
    box((-6.0, 4.9, 2.4), (5.0, 0.12, 0.7), hexc('#d83a4a'))
    label3d('献血ルーム', (-6.0, 4.82, 2.22), 0.42, (1, 1, 1))
    box((-6.0, 4.95, 1.1), (1.6, 0.1, 2.2), hexc('#a9c7d9'))
    rnd = random.Random(80)
    for i in range(12):
        x = -6.0 + i * 0.85; y = 3.6 - (i % 2) * 0.15
        p = crowd_person((x, y, 0), rnd, rot_z=-math.pi / 2, name=f'q{i}')
        hearts(p, n, size=1.5)
    cam = camera(32)
    cam_path(cam, [(0, (-9.0, -0.2, 1.7), (-3.0, 3.6, 1.2)), (1, (-8.4, 0.4, 1.7), (-2.0, 3.6, 1.2))], n)
    return MB(0.5, amb='city')


def hBloodBody(n):  # 血をつくるのは、心臓ではなく、骨の中。ポンプが二つでも、流れる血は一人分
    sky(hexc('#1e2430')); s = bpy.context.scene; s.view_settings.exposure = 0.3
    s.display.shading.show_shadows = False
    p = person((0, 0, 0), hexc('#ffffff'), rot_z=0, name='ghost', s=1.3)
    ghost_body(p, rgb=(0.7, 0.82, 1.0), a=0.22)
    body = O[p['body']]
    for k, side in enumerate((1, -1)):
        loc = chest_point(body, side, 0.3, 0.6); loc = body_center(body) + (loc - body_center(body)) * 0.5
        h = heart3d(loc, s=0.08, parent=body.parent); beat_scale(h, n, bpm=55 - k * 6, amp=0.18, offset=k * 0.4)
    # 骨の中で血がつくられる淡い光（脚・腕・腰）
    rig = body.parent
    for (x, z, L) in ((-0.09, 0.42, 0.7), (0.09, 0.42, 0.7), (0, 0.85, 0.12)):
        o = cyl((x, -0.0, z), 0.03, L, (1, 1, 1)); o.data.materials.clear(); o.data.materials.append(gmat((1.0, 0.85, 0.55), 0.55, 'marrow')); link(o, rig)
    # 流れる血の粒（同じ数がぐるぐる回る）
    for i in range(14):
        b = ball((0, 0, 0), 0.025, (0.95, 0.2, 0.3), a=0.95, seg=8, name='rbc')
        b.parent = rig
        circle_path(b, n, (0, 0, 1.0), 0.16, laps=1.5, phase=i * 2 * math.pi / 14, face=False)
        for f in range(1, n + 1, 2):
            b.location.z = 1.0 + 0.35 * math.sin(i * 0.8 + f * 0.05)
            b.keyframe_insert('location', index=2, frame=f)
    cam = camera(45)
    cam_path(cam, [(0, (0.3, -3.6, 1.6), (0, 0, 1.35)), (1, (-0.2, -3.3, 1.55), (0, 0, 1.35))], n)
    return MB(0.8, amb='silent')


def blood_room():
    sky(hexc('#e6e6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(9, 7, 2.8, floor=hexc('#e2e2de'), wall=hexc('#f4f2f0'), window=True)
    box((2.6, 2.6, 0.55), (2.8, 0.7, 1.1), hexc('#f2c8c8'))
    box((2.6, 2.6, 1.12), (2.9, 0.75, 0.05), hexc('#f4f4f2'))


def blood_bag(loc, fill_from=None, fill_to=None, n=240, parent=None):
    root = empty(loc, 'bag')
    b = link(box((0, 0, 0), (0.16, 0.03, 0.22), (1, 1, 1)), root)
    b.data.materials.clear(); b.data.materials.append(gmat((0.95, 0.95, 1.0), 0.45, 'bag'))
    r = boxc((0, 0, -0.1), (0.14, 0.025, 0.2), hexc('#b8222e')); r.parent = root
    r.location = (0, 0, -0.1)
    if fill_from is not None:
        r.scale = (1, 1, 0.05); r.location.z = -0.105; r.keyframe_insert('scale', frame=fill_from); r.keyframe_insert('location', frame=fill_from)
        r.scale = (1, 1, 1); r.location.z = -0.01; r.keyframe_insert('scale', frame=fill_to); r.keyframe_insert('location', frame=fill_to)
    if parent is not None:
        root.parent = parent
    return root


def hBagShow(n):  # 受付の人が、いつもと同じ袋を見せる
    blood_room()
    st = person((2.6, 3.1, 0), hexc('#f2f2f2'), pants=hexc('#d87a8a'), rot_z=math.pi, name='staff')
    arm_to(st, 1, (-0.05, -0.45, 1.35))
    bag = blood_bag((0, 0, 0)); bag.parent = st; bag.location = (-0.05, -0.5, 1.62)
    bag.scale = (1.6, 1.6, 1.6)
    hearts(st, n, size=1.4)
    rnd = random.Random(81)
    for i in range(3):
        p = crowd_person((-0.4 + i * 0.8, 1.6, 0), rnd, rot_z=math.pi * 0.8, name=f'v{i}')
        hearts(p, n, size=1.4)
    cam = camera(35, dof=2.4, fstop=2.4)
    cam_path(cam, [(0, (3.6, 0.3, 1.6), (2.5, 2.7, 1.35)), (1, (3.3, 0.6, 1.55), (2.5, 2.7, 1.4))], n)
    return MB(0.5, amb='room')


def hBagsFill(n):  # 行列の人たちは帰らない。いつもと同じ量を、いつもどおりに差し出す
    blood_room()
    rnd = random.Random(82)
    for k in range(4):
        x = -3.0 + k * 1.6
        box((x, 1.2, 0.35), (0.7, 1.5, 0.12), hexc('#d87a8a'), rot=(0.25, 0, 0))  # 寝いす
        box((x, 1.9, 0.7), (0.7, 0.15, 0.6), hexc('#d87a8a'), rot=(0.5, 0, 0))
        p = crowd_person((x, 1.5, 0.0), rnd, pose='sit', rot_z=0, name=f'd{k}')
        hearts(p, n, size=1.5)
        cyl((x + 0.5, 1.3, 0.7), 0.015, 1.4, hexc('#c0c4c8'))
        blood_bag((x + 0.5, 1.3, 1.3), fill_from=10 + k * 15, fill_to=int(n * 0.9), n=n)
    for i in range(3):
        p = crowd_person((3.2, -0.5 + i * 0.7, 0), rnd, rot_z=-math.pi / 2, name=f'w{i}')
        hearts(p, n, size=1.5)
    cam = camera(32)
    cam_path(cam, [(0, (-3.6, -2.4, 1.8), (-0.5, 1.4, 0.9)), (1, (-2.6, -2.6, 1.7), (0.5, 1.4, 0.9))], n)
    return MB(0.6, amb='room')


# ---------------- SCENE 15 待っていた人の、新しい鼓動（章14） ----------------
def draw_calendar(marks=28, discharge=False):
    def f(im, d):
        d.rectangle((0, 0, 1080, 1080), fill=(252, 250, 244))
        d.rectangle((0, 0, 1080, 160), fill=(200, 70, 80))
        d.text((60, 30), 'カレンダー', font=_font(90), fill=(255, 255, 255))
        k = 0
        for r in range(5):
            for c in range(7):
                x = 40 + c * 145; y = 200 + r * 170
                d.rectangle((x, y, x + 130, y + 150), outline=(200, 196, 186), width=4)
                if k < marks:
                    d.line((x + 20, y + 20, x + 110, y + 130), fill=(90, 100, 120), width=12)
                    d.line((x + 110, y + 20, x + 20, y + 130), fill=(90, 100, 120), width=12)
                if discharge and k == 34:
                    d.ellipse((x - 10, y - 10, x + 140, y + 160), outline=(220, 40, 50), width=16)
                    d.text((x + 8, y + 40), '退院', font=_font(56), fill=(220, 40, 50))
                k += 1
    return f


def private_room(n, cal=True, discharge_at=None, pt_mode=('weak', ('appear', 1))):
    hosp_room(6, 5, 2.7, window=True)
    _, pt = hosp_bed((-0.4, 0.9, 0), rot_z=0, patient=hexc('#a9c4d8'), name='pt')
    mach = box((0.6, 1.4, 0.55), (0.45, 0.4, 1.1), hexc('#d8dde2'), bevel=0.03)  # 心臓を助ける機械
    ecg_screen('h_mach', (0.6, 1.19, 0.85), 0.34, 0.22, n, two=False)
    rope((0.45, 1.25, 0.6), (-0.15, 0.6, 0.58), r=0.01, c=hexc('#c8ccd0'))
    if cal:
        a = tex_plane('h_cal_a', draw_calendar(33), (-1.6, 2.44, 1.6), 0.8, 0.8, size=(1080, 1080))
        if discharge_at is not None:
            b = tex_plane('h_cal_b', draw_calendar(33, discharge=True), (-1.6, 2.435, 1.6), 0.8, 0.8, size=(1080, 1080))
            swap_seq([a, b], [discharge_at])
    return pt


def hWaitRoom(n):  # 一週間後。心臓の移植を待っている人。カレンダーには待った日の印
    pt = private_room(n)
    hearts(pt, n, bpm=(62, 60), mode=('weak', 'off'), size=1.8, up=4.0, out=1.2)
    cam = camera(32)
    cam_path(cam, [(0, (1.8, -1.6, 1.7), (-0.6, 1.4, 1.0)), (1, (1.4, -1.3, 1.65), (-1.0, 1.8, 1.2))], n)
    return MB(0.5, amb='room')


def hNewHeart(n):  # その胸に、元気な心臓が、一つ増えた。医師がうなずく
    pt = private_room(n)
    hearts(pt, n, bpm=(62, 58), mode=('weak', ('appear', int(n * 0.25))), size=1.8, up=4.0, out=1.2)
    dc = doctor((0.45, 2.0, 0), rot_z=-math.pi / 2, name='doc')
    hearts(dc, n, size=1.4)
    cam = camera(40, dof=1.4, fstop=2.2)
    cam_path(cam, [(0, (0.7, 0.2, 1.6), (-0.4, 1.45, 0.75)), (1, (0.55, 0.45, 1.5), (-0.4, 1.5, 0.75))], n)
    return MB(0.9, amb='room')


def hCorridor(n):  # 患者は、病室の外の廊下を、端まで歩く。次の日は、往復する
    sky(hexc('#d6d1c8')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    box((0, 0, -0.05), (3, 30, 0.1), hexc('#d9d6cf'))
    for sx in (-1.5, 1.5):
        box((sx, 0, 1.35), (0.1, 30, 2.7), hexc('#eef1f0'))
        for k in range(6):
            box((sx * 0.97, -10 + k * 4, 1.0), (0.04, 1.0, 2.0), hexc('#c8b898'))
        box((sx * 0.95, 0, 0.9), (0.06, 30, 0.06), hexc('#b8bcc0'))
    box((0, 15, 1.35), (3, 0.1, 2.7), hexc('#bcd3e6'))
    for f_ in (0,):
        pass
    p = person((0.3, -6, 0), hexc('#a9c4d8'), rot_z=math.pi, name='pt')
    iv = iv_pole((0.0, 0.0, 0)); iv.parent = p; iv.location = (-0.35, -0.2, 0)
    move(p, [(1, (0.3, -6, 0)), (n, (0.3, 6, 0))])
    hearts(p, n, bpm=(62, 66), mode=('on', 'on'), size=1.5)
    cam = camera(32)
    cam_path(cam, [(0, (-0.6, -10, 1.6), (0.3, -4, 1.2)), (1, (-0.5, -0.5, 1.6), (0.3, 7, 1.2))], n)
    return MB(0.6, amb='room')


def draw_list(done=0):
    def f(im, d):
        d.rectangle((0, 0, 1920, 1080), fill=(236, 242, 248))
        d.rectangle((0, 0, 1920, 150), fill=(40, 80, 130))
        d.text((60, 25), '移植を待つ人の名簿', font=_font(90), fill=(255, 255, 255))
        for i in range(6):
            y = 200 + i * 145
            d.rounded_rectangle((60, y, 1860, y + 120), 20, fill=(255, 255, 255))
            d.text((100, y + 18), f'No.{i + 1:03d}', font=_font(76), fill=(60, 70, 90))
            d.rectangle((460, y + 45, 1100, y + 75), fill=(200, 205, 215))
            if i < done:
                d.rounded_rectangle((1300, y + 14, 1820, y + 106), 30, fill=(60, 170, 110))
                d.text((1350, y + 18), '待機終了', font=_font(70), fill=(255, 255, 255))
            else:
                d.text((1350, y + 18), '待機中', font=_font(70), fill=(150, 156, 170))
    return f


def hListScreen(n):  # 移植を待つ人の名簿から、名前が、一人、また一人と外れていく
    office_desks(n, seed=84, bpm=(60, 54))
    planes = [tex_plane(f'h_list{k}', draw_list(k), (0, 3.8, 1.6), 3.2, 1.8) for k in range(5)]
    swap_seq(planes, [int(n * (0.15 + 0.18 * k)) for k in range(4)])
    cam = camera(35)
    cam_path(cam, [(0, (0.8, -1.2, 1.6), (0, 3.9, 1.6)), (1, (0.3, -0.4, 1.6), (0, 3.9, 1.6))], n)
    return MB(0.5, amb='room')


def hCalMarks(n):  # カレンダーには、待った日の印が、びっしり
    pt = private_room(n)
    hearts(pt, n, bpm=(62, 60), mode=('weak', 'off'), size=1.8, up=4.0, out=1.2)
    cam = camera(45)
    cam_path(cam, [(0, (-1.0, 0.7, 1.65), (-1.6, 2.44, 1.6)), (1, (-1.2, 1.0, 1.62), (-1.6, 2.44, 1.6))], n)
    return MB(0.4, amb='room')


def hCalendar(n):  # 病室のカレンダーに、新しい印。退院の日の、印
    pt = private_room(n, discharge_at=int(n * 0.35))
    hearts(pt, n, bpm=(62, 66), size=1.8, up=4.0, out=1.2)
    cam = camera(45)
    cam_path(cam, [(0, (-0.9, 0.6, 1.65), (-1.6, 2.44, 1.6)), (1, (-1.1, 0.9, 1.62), (-1.6, 2.44, 1.6))], n)
    return MB(0.6, amb='room')


# ---------------- SCENE 16 保険の計算が、やり直しになる（章15） ----------------
def draw_table_paper(im, d):
    d.rectangle((0, 0, 1920, 1080), fill=(250, 248, 240))
    d.text((80, 40), '年齢ごとの表', font=_font(90), fill=(60, 64, 80))
    for r in range(8):
        y = 200 + r * 105
        d.line((60, y, 1860, y), fill=(200, 196, 186), width=4)
        for c in range(6):
            x = 120 + c * 290
            d.rectangle((x, y + 30, x + 160 + (r * 37 + c * 53) % 80, y + 60), fill=(120, 126, 140))


def hLifeTable(n):  # 十日後。保険の会社では、分厚い表が、書き直されている
    office_desks(n, seed=90, bpm=(60, 54))
    for k in range(3):
        x = -3 + k * 3
        stack = boxc((x + 0.4, 1.7, 0.85), (0.35, 0.25, 0.2), hexc('#f2efe6'))
        tex_plane(f'h_tbl{k}', draw_table_paper, (x - 0.2, 1.55, 0.752), 0.42, 0.24, rot=(0, 0, 0))
    planes = []
    cam = camera(35)
    cam_path(cam, [(0, (2.6, 3.2, 1.6), (-1.0, 0.6, 0.8)), (1, (1.6, 3.2, 1.5), (-2.0, 0.8, 0.8))], n)
    return MB(0.4, amb='room')


def draw_graph(stage):
    def f(im, d):
        d.rectangle((0, 0, 1920, 1080), fill=(18, 26, 40))
        d.line((160, 900, 1800, 900), fill=(150, 160, 175), width=6)
        d.line((160, 900, 160, 120), fill=(150, 160, 175), width=6)
        d.text((1500, 930), '年齢 →', font=_font(64), fill=(170, 180, 195))
        def curve(xmax, col, w):
            pts = []
            for x in range(160, xmax, 10):
                u = (x - 160) / 1400
                y = 180 + 700 * (u ** 4)
                pts.append((x, min(900, y)))
            d.line(pts, fill=col, width=w)
        curve(1500, (120, 130, 150), 10)
        if stage > 0:
            xm = 1500 + stage * 120
            pts = []
            for x in range(160, xm, 10):
                u = (x - 160) / (1400 + stage * 120)
                pts.append((x, min(900, 180 + 700 * (u ** 4))))
            d.line(pts, fill=(255, 200, 80), width=14)
    return f


def hGraphLine(n):  # 心臓の病気で倒れる人が減れば、表の数字が、全部変わる。命の長さの表を、作り直す
    office_desks(n, seed=91, bpm=(60, 54))
    planes = [tex_plane(f'h_graph{k}', draw_graph(k), (0, 3.8, 1.6), 3.2, 1.8) for k in range(3)]
    swap_seq(planes, [int(n * 0.3), int(n * 0.6)])
    cam = camera(32)
    cam_path(cam, [(0, (1.6, -1.0, 1.7), (0, 3.9, 1.6)), (1, (0.6, -0.4, 1.65), (0, 3.9, 1.6))], n)
    return MB(0.4, amb='room')


def draw_pamph(new=True):
    def f(im, d):
        d.rectangle((0, 0, 1080, 1440), fill=(250, 250, 252))
        d.rectangle((0, 0, 1080, 420), fill=(60, 120, 180) if new else (150, 160, 170))
        d.text((70, 120), '生命保険', font=_font(150), fill=(255, 255, 255))
        d.text((70, 540), 'ご案内', font=_font(120), fill=(60, 70, 90))
        if new:
            d.rounded_rectangle((70, 900, 600, 1040), 30, fill=(230, 80, 90))
            d.text((110, 915), '新しい版', font=_font(100), fill=(255, 255, 255))
    return f


def hPamphlet(n):  # 保険のパンフレットが、刷り直される
    sky(hexc('#e6e6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(8, 6, 2.7, floor=hexc('#c8c4bc'), wall=hexc('#f4f2f0'))
    table((0, 1.2, 0), 2.0, 0.8, 0.72, c=hexc('#e8e4dc'))
    st = person((0, 1.85, 0), hexc('#2a3a5a'), pose='sit', rot_z=0, act='talk', name='staff')
    rnd = random.Random(92)
    fam = [crowd_person((-0.5 + i * 0.6, 0.45, 0), rnd, pose='sit', rot_z=math.pi, name=f'f{i}') for i in range(2)]
    kid = crowd_person((0.75, 0.4, 0), rnd, pose='sit', rot_z=math.pi, s=0.7, name='kid')
    for p in [st] + fam + [kid]:
        hearts(p, n, size=1.4)
    for k in range(3):
        tex_plane(f'h_pam{k % 2}', draw_pamph(new=k != 2), (-0.5 + k * 0.45, 1.15, 0.752), 0.27, 0.36, rot=(0, 0, 0.1 * k), size=(1080, 1440))
    box((2.4, 2.6, 0.7), (1.0, 0.4, 1.4), hexc('#d8d4cc'))
    for k in range(4):
        tex_plane('h_pam1', draw_pamph(True), (2.15 + (k % 2) * 0.5, 2.39, 0.9 + (k // 2) * 0.42), 0.3, 0.4, size=(1080, 1440))
    cam = camera(35)
    cam_path(cam, [(0, (1.8, -1.0, 1.8), (0, 1.3, 0.8)), (1, (1.3, -0.8, 1.7), (0.2, 1.3, 0.8))], n)
    return MB(0.4, amb='room')


def hPension(n):  # 年金の窓口にも、計算を見直しています、の貼り紙
    sky(hexc('#e6e6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(10, 7, 2.8, floor=hexc('#c8c4bc'), wall=hexc('#f4f2f0'), window=False)
    box((0, 2.6, 0.55), (6, 0.7, 1.1), hexc('#b8c8d4'))
    box((0, 2.6, 1.12), (6.1, 0.75, 0.05), hexc('#f4f4f2'))
    box((0, 3.44, 2.25), (3.0, 0.04, 0.5), hexc('#3a6aa0'))
    label3d('年金の窓口', (0, 3.4, 2.12), 0.28, (1, 1, 1))
    tex_plane('h_notice', draw_card('お知らせ', ['計算を', '見直しています'], accent=(200, 60, 70)), (1.9, 3.43, 1.6), 1.2, 0.68)
    rnd = random.Random(93)
    for k in range(3):
        st = person((-2 + k * 2, 3.1, 0), hexc('#f2f2f2'), pants=hexc('#3a4a5a'), rot_z=math.pi, act='type', name=f'cl{k}')
        hearts(st, n, size=1.4)
    for i in range(4):
        p = crowd_person((-2.4 + i * 1.4, 0.8 + (i % 2) * 0.4, 0), rnd, rot_z=math.pi, name=f'c{i}')
        hearts(p, n, size=1.4)
    cam = camera(32)
    cam_path(cam, [(0, (-1.8, -2.8, 1.8), (1.0, 3.0, 1.5)), (1, (-0.6, -2.6, 1.7), (1.6, 3.0, 1.6))], n)
    return MB(0.4, amb='room')
