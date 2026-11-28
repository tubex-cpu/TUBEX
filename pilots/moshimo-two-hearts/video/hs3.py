"""カット：SCENE 17〜23（章16〜22）とエンドカード（章23）"""
from hs2 import *
from shots import _font, _tl


# ---------------- SCENE 17 運動会の、同じ順位（章16） ----------------
def schoolyard():
    sky(hexc('#9cc3e3')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.5
    ground(rgb=hexc('#c8a878'))
    for k in range(5):
        box((0, k * 1.0, 0.005), (40, 0.05, 0.01), (1, 1, 1))
    box((14, 2.0, 0.006), (0.15, 5.0, 0.01), (1, 1, 1))  # ゴール線
    box((0, 16, 4), (30, 8, 8), hexc('#e8e2d6'))  # 校舎
    for x in range(-12, 13, 3):
        for fl in range(2):
            box((x, 11.95, 2.5 + fl * 3), (1.8, 0.1, 1.4), hexc('#9fb6c8'))
    for k in range(12):  # 万国旗の代わりの小旗
        cone((-12 + k * 2.2, 6, 5.0), 0.25, 0.4, random.Random(k).choice([hexc('#d04a3a'), hexc('#3a7ad0'), hexc('#f2d24b'), hexc('#3aa05a')]), rot=(math.pi, 0, 0), verts=3)
    cyl((0, 6, 5.2), 0.01, 26.4, hexc('#444444'), rot=(0, math.pi / 2, 0))


KIDS = [hexc('#f2f2f2')]


def runners(n, x0, x1, f_go, f_end, seed=100, k=4, finish_hold=True):
    rnd = random.Random(seed); out = []
    for i in range(k):
        y = 0.5 + i * 1.0
        p = person((x0, y, 0), hexc('#f2f2f2'), pants=hexc('#2a3a8a'), skin=rnd.choice(SKIN[:3]), rot_z=-math.pi / 2, s=0.7, name=f'r{i}')
        link(cyl((0, 0.02, 0.1), 0.13, 0.05, [hexc('#d04a3a'), hexc('#f2f2f2')][i % 2]), O[p['head']])  # 紅白帽
        fe = f_end + i * 6
        move(p, [(1, (x0, y, 0)), (f_go, (x0, y, 0)), (fe, (x1, y, 0)), (n, (x1 + 0.3, y, 0))])
        hearts(p, n, bpm=(70, 62), size=1.7)
        out.append(p)
    return out


def hSportsStart(n):  # 二週間後。小学校の運動会。いつもより長く、全力で走れる
    schoolyard()
    runners(n, -10, 14, int(n * 0.12), int(n * 0.95))
    rnd = random.Random(101)
    for i in range(10):
        crowd_person((-12 + i * 2.6, 6.5, 0), rnd, rot_z=0, name=f'aud{i}')
    cam = camera(32)
    cam_path(cam, [(0, (-11, -5, 2.0), (-8, 2, 0.6)), (1, (8, -5, 2.0), (12, 2, 0.6))], n)
    return MB(0.6, amb='day')


def hFinishBreath(n):  # でも、息は、ちゃんと切れる
    schoolyard()
    rnd = random.Random(102)
    for i in range(4):
        p = person((15 + i * 0.3, 0.6 + i * 1.0, 0), hexc('#f2f2f2'), pants=hexc('#2a3a8a'), skin=rnd.choice(SKIN[:3]), rot_z=0.15, s=0.7, name=f'r{i}')
        link(cyl((0, 0.02, 0.1), 0.13, 0.05, [hexc('#d04a3a'), hexc('#f2f2f2')][i % 2]), O[p['head']])
        hearts(p, n, bpm=(62, 56), size=1.7)
        body = O[p['body']]
        for f in range(1 + i * 5, n, 16):  # 肩で息をする
            body.scale.z = 1.0; body.keyframe_insert('scale', index=2, frame=f)
            body.scale.z = 1.08; body.keyframe_insert('scale', index=2, frame=f + 8)
        mouth = Vector((15 + i * 0.3, 0.6 + i * 1.0 - 0.15, 1.12))
        starts = [tuple(mouth)] * 3; ends = [tuple(mouth + Vector((rnd.uniform(-0.1, 0.1), -0.35, 0.15))) for _ in range(3)]
        particles_flow(n, starts, ends, rgb=(1, 1, 1), size=0.04, period=16, seed=i, a=0.6)
    cam = camera(40)
    cam_path(cam, [(0, (18.5, -2.6, 1.3), (15.4, 2.0, 0.75)), (1, (18.0, -2.2, 1.2), (15.4, 2.0, 0.75))], n)
    return MB(0.9, amb='day')


def hLungsBody(n):  # 心臓がいくつあっても、空気を吸うのは、二つの肺だけ
    sky(hexc('#1e2430')); s = bpy.context.scene; s.view_settings.exposure = 0.3
    s.display.shading.show_shadows = False
    p = person((0, 0, 0), hexc('#ffffff'), rot_z=0, name='ghost', s=1.3)
    ghost_body(p, rgb=(0.7, 0.82, 1.0), a=0.2)
    body = O[p['body']]; rig = body.parent; c = body_center(body)
    for sx in (-1, 1):
        lg = ball(c + Vector((sx * 0.1, 0, 0.08)), 0.1, (0.55, 0.8, 1.0), a=0.6, seg=16, parent=rig, name='lung')
        lg.scale = (0.8, 0.7, 1.6)
        for f in range(1, n + 48, 48):
            lg.scale = (0.8, 0.7, 1.6); lg.keyframe_insert('scale', frame=f)
            lg.scale = (0.95, 0.8, 1.75); lg.keyframe_insert('scale', frame=f + 24)
    for k, side in enumerate((1, -1)):
        loc = c + Vector((side * 0.04, -0.12, 0.05))
        h = heart3d(loc, s=0.07, parent=rig); beat_scale(h, n, bpm=60 - k * 6, amp=0.18, offset=k * 0.4)
    cam = camera(45)
    cam_path(cam, [(0, (0.3, -3.0, 1.55), (0, 0, 1.45)), (1, (-0.2, -2.7, 1.5), (0, 0, 1.45))], n)
    return MB(0.8, amb='silent')


def draw_rank(title):
    def f(im, d):
        d.rectangle((0, 0, 1080, 1080), fill=(250, 248, 240))
        d.text((60, 40), title, font=_font(110), fill=(60, 64, 80))
        cols = [(230, 190, 60), (190, 196, 206), (200, 140, 90)]
        for i, (h, c) in enumerate(((620, cols[0]), (480, cols[1]), (380, cols[2]))):
            x = [390, 90, 690][i]
            d.rectangle((x, 1040 - h, x + 300, 1040), fill=c)
            d.text((x + 110, 1040 - h + 30), str(i + 1), font=_font(130), fill=(255, 255, 255))
            d.ellipse((x + 90, 1040 - h - 220, x + 210, 1040 - h - 100), fill=[(240, 120, 90), (90, 140, 220), (110, 180, 110)][i])
    return f


def hRankFlags(n):  # ゴールの順番は、去年と同じ。速い子は、速いまま
    schoolyard()
    tex_plane('h_rank_a', draw_rank('去年'), (11.0, 3.0, 1.6), 2.0, 2.0, size=(1080, 1080))
    tex_plane('h_rank_b', draw_rank('今年'), (13.6, 3.0, 1.6), 2.0, 2.0, size=(1080, 1080))
    for i, (x, h) in enumerate(((12.3, 0.9), (11.6, 0.6), (13.0, 0.45))):
        pass
    rnd = random.Random(103)
    for i in range(3):
        p = person((11.4 + i * 0.9, 1.6, 0), hexc('#f2f2f2'), pants=hexc('#2a3a8a'), skin=rnd.choice(SKIN[:3]), rot_z=0, s=0.7, name=f'k{i}')
        cyl((11.4 + i * 0.9 + 0.2, 1.4, 0.6), 0.01, 1.2, hexc('#8a6a48'))
        box((11.4 + i * 0.9 + 0.38, 1.4, 1.05), (0.35, 0.02, 0.25), [hexc('#e6be3c'), hexc('#c0c4c8'), hexc('#c88c5a')][i])
        hearts(p, n, size=1.7)
    cam = camera(35)
    cam_path(cam, [(0, (12.0, -3.2, 1.6), (12.3, 2.5, 1.3)), (1, (12.6, -2.8, 1.5), (12.3, 2.5, 1.3))], n)
    return MB(0.6, amb='day')


def hStadium(n):  # 世界の陸上の大会で、記録が少しずつ伸びる。表彰台に立つ顔ぶれは、変わらない
    sky(hexc('#16203a')); s = bpy.context.scene; s.view_settings.exposure = 0.2
    light_dir((0.3, -0.5, 0.8))
    ground(rgb=hexc('#3a7a4a'))
    box((0, 4, 0.005), (40, 8, 0.01), hexc('#b8503a'))
    for k in range(6):
        box((0, 0.5 + k * 1.2, 0.012), (40, 0.04, 0.01), (1, 1, 1))
    for k in range(5):
        box((0, 14 + k * 2, 0.8 + k * 1.2), (40, 2, 0.5), hexc('#5a6070'))
    a = tex_plane('h_rec_a', draw_card('記録', ['━━ . ━━'], bg=(16, 20, 30), fg=(255, 220, 90), accent=(255, 255, 255)), (0, 13, 6), 6, 3.4)
    b = tex_plane('h_rec_b', draw_card('記録', ['━━ . ━━　↑'], bg=(16, 20, 30), fg=(255, 220, 90), accent=(255, 255, 255)), (0, 12.99, 6), 6, 3.4)
    swap_seq([a, b], [int(n * 0.35)])
    for i, (x, h) in enumerate(((0, 0.9), (-1.3, 0.6), (1.3, 0.45))):
        box((x, 3, h / 2), (1.2, 1.0, h), (1, 1, 1))
        p = person((x, 3, h), hexc(['#3a7ad0', '#d04a3a', '#3aa05a'][i]), rot_z=0, name=f'ath{i}')
        hearts(p, n, bpm=(48, 44), size=1.4)
        arm_up(p, 1)
    cam = camera(32)
    cam_path(cam, [(0, (2.0, -6.0, 2.0), (0, 6, 3.0)), (1, (-1.0, -5.0, 1.8), (0, 4, 2.0))], n)
    return MB(0.6, amb='city')


def hWalkHome(n):  # 運動会の帰り道。おなかがすいた
    street_env(corner=False)
    sky(hexc('#e8a070')); bpy.context.scene.view_settings.exposure = 0.25
    rnd = random.Random(104)
    for i in range(3):
        k = person((-0.6 + i * 0.6, -6, 0), hexc('#f2f2f2'), pants=hexc('#2a3a8a'), skin=rnd.choice(SKIN[:3]), rot_z=math.pi, s=0.7, name=f'k{i}')
        link(cyl((0, 0.02, 0.1), 0.13, 0.05, hexc('#d04a3a')), O[k['head']])
        move(k, [(1, (-0.6 + i * 0.6, -6, 0)), (n, (-0.6 + i * 0.6, 1.5, 0))])
        hearts(k, n, size=1.7)
        rings((0, 0, 0), [int(n * 0.4) + i * 20], rgb=(1, 0.8, 0.3), size=0.2)
    par = crowd_person((1.0, -7, 0), rnd, rot_z=math.pi, name='parent')
    move(par, [(1, (1.0, -7, 0)), (n, (1.0, 0.5, 0))])
    hearts(par, n, size=1.5)
    cam = camera(32)
    cam_path(cam, [(0, (0.3, 4.0, 1.4), (0, -5, 0.8)), (1, (0.3, 6.0, 1.4), (0, 0, 0.8))], n)
    return MB(0.5, amb='day')


# ---------------- SCENE 18 牛も、豚も、鶏も（章17） ----------------
def farm():
    meadow(rgb=hexc('#9ab86a'))
    barn((-8, 10, 0))
    fence_line(-12, 12, -2.5)
    fence_line(-12, 12, 8.0)
    for i in range(5):
        tree((10 + i * 2.5, 14, 0), s=1.0)


def hay(loc, s=1.0):
    return cyl(loc, 0.6 * s, 0.5 * s, hexc('#d8c070'), rot=(0, math.pi / 2, 0), verts=16)


def hCowsHay(n):  # 三週間後。牧場では、牛がいつもより長く、草を食べている
    farm()
    for i, (x, y, r) in enumerate(((-2, 2, 0.4), (1, 3.5, -0.3), (4, 1.5, 0.8), (-5, 4, 0.1))):
        c = animal((x, y, 0), 'cow', rot_z=r, name=f'cow{i}')
        O[c['neck']].rotation_euler.x = 0.5  # 頭を下げて食べる
        hay((x + 0.6 * math.sin(r), y - 1.2, 0.3), s=0.6)
        hearts(c, n, bpm=(50, 44), size=1.6)
    cam = camera(32)
    cam_path(cam, [(0, (6, -7, 2.4), (0, 2.5, 0.8)), (1, (3, -7.5, 2.2), (-1, 2.5, 0.8))], n)
    return MB(0.6, amb='day')


def hPigsChickens(n):  # 牛にも、豚にも、鶏にも、心臓が二つ
    meadow(rgb=hexc('#a89a70'))
    box((0, 3, 1.2), (12, 0.2, 2.4), hexc('#c8b898'))
    fence_line(-5, 5, -1.0, h=0.8)
    rnd = random.Random(110)
    for i in range(3):
        pg = animal((-3 + i * 1.5, 1.0 + (i % 2) * 0.6, 0), 'pig', rot_z=rnd.uniform(-0.5, 0.5), name=f'pig{i}')
        hearts(pg, n, bpm=(70, 62), size=1.6)
    box((-1.5, -0.2, 0.15), (3.0, 0.4, 0.3), hexc('#8a6a48'))  # えさ箱
    for i in range(6):
        ch = chicken((1.6 + (i % 3) * 0.7, 0.4 + (i // 3) * 0.8, 0), rot_z=rnd.uniform(-2, 2), name=f'ch{i}')
        peck(ch, n, rnd)
        hearts(birdbody(ch), n, bpm=(130, 115), size=1.5)
    cam = camera(32)
    cam_path(cam, [(0, (-2, -6, 2.2), (0, 1, 0.5)), (1, (2, -6, 2.2), (0.5, 1, 0.5))], n)
    return MB(0.6, amb='day')


def hFeedTruck(n):  # えさを運ぶトラックが、前より頻繁にやって来る
    farm()
    t = truck((12, -5, 0), rot_z=math.pi / 2)
    t.keyframe_insert('location', frame=1)
    t.location = (-4, -5, 0); t.keyframe_insert('location', frame=int(n * 0.75)); t.keyframe_insert('location', frame=n)
    road((0, -5, 0.01), 60, width=4, rot_z=math.pi / 2)
    for i in range(3):
        c = animal((-2 + i * 3, 3, 0), 'cow', rot_z=0.3 * i, name=f'cow{i}')
        hearts(c, n, bpm=(50, 44), size=1.6)
    cam = camera(30)
    cam_path(cam, [(0, (2, -14, 3.5), (2, -4, 1.2)), (1, (-2, -14, 3.5), (-3, -4, 1.2))], n)
    return MB(0.4, amb='day')


def hMilkEggs(n):  # 牛乳の量も、卵の数も、牛の体も、変わらない。増えたのは、えさだけ
    sky(hexc('#e8dfcf')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(8, 6, 2.7, floor=hexc('#c8c4bc'), wall=hexc('#f4f2f0'), window=True)
    cyl((-2.2, 1.5, 0.8), 0.6, 1.6, hexc('#d8dce0'))
    label3d('牛乳', (-2.2, 0.88, 1.1), 0.25, hexc('#3a6aa0'))
    for r in range(2):
        for k in range(5):
            box((-0.2 + k * 0.18, 1.2 + r * 0.18, 0.8), (0.16, 0.16, 0.06), hexc('#c8b898'))
            sphere((-0.2 + k * 0.18, 1.2 + r * 0.18, 0.86), 0.05, hexc('#f4ecd8'), scale=(1, 1, 1.25))
    table((0.2, 1.3, 0), 1.4, 0.8, 0.76)
    bags = []
    for k in range(6):
        b = boxc((1.8 + (k % 3) * 0.55, 1.6 - (k // 3) * 0.6, 0.3), (0.5, 0.35, 0.6), hexc('#d8c08a'))
        appear(b, int(n * 0.15) + k * int(n * 0.1))
    label3d('えさ', (2.35, 0.9, 1.2), 0.25, hexc('#8a5a2a'))
    cam = camera(32)
    cam_path(cam, [(0, (0.0, -3.0, 1.8), (0.0, 1.4, 0.8)), (1, (0.6, -2.6, 1.7), (0.4, 1.4, 0.8))], n)
    return MB(0.3, amb='room')


def draw_tag(old=True):
    def f(im, d):
        d.rectangle((0, 0, 800, 400), fill=(255, 250, 210) if old else (255, 220, 200))
        d.text((60, 60), 'ねだん', font=_font(110), fill=(60, 40, 30))
        d.rectangle((60, 230, 740, 260), fill=(120, 90, 70) if old else (210, 50, 50))
        if not old:
            d.text((560, 60), '新', font=_font(130), fill=(210, 50, 50))
    return f


def hPriceTags(n):  # スーパーでは、肉と卵の値札が、少しずつ書き換えられていく
    sky(hexc('#e6e6e2')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    room(10, 7, 3.0, floor=hexc('#e2e2de'), wall=hexc('#f4f4f2'), window=False)
    box((0, 2.9, 0.5), (6, 1.0, 1.0), hexc('#d8dcde'))
    rnd = random.Random(120)
    for k in range(12):
        box((-2.7 + k * 0.5, 2.8, 1.05), (0.38, 0.28, 0.08), rnd.choice([hexc('#d86a6a'), hexc('#e89a8a'), hexc('#f4ecd8')]))
    for k in range(6):
        x = -2.5 + k * 1.0
        a = tex_plane(f'h_tag_o', draw_tag(True), (x, 2.37, 0.85), 0.32, 0.16, size=(800, 400))
        b = tex_plane(f'h_tag_n', draw_tag(False), (x, 2.365, 0.85), 0.32, 0.16, size=(800, 400))
        swap_seq([a, b], [int(n * 0.1) + k * int(n * 0.13)])
    clerk = person((-3.0, 1.9, 0), hexc('#3a8a5a'), rot_z=math.pi, name='clerk')
    move(clerk, [(1, (-3.0, 1.9, 0)), (n, (2.6, 1.9, 0))])
    hearts(clerk, n, size=1.5)
    cam = camera(32)
    cam_path(cam, [(0, (-2.5, -1.4, 1.5), (-0.5, 2.4, 0.9)), (1, (0.5, -1.4, 1.5), (1.5, 2.4, 0.9))], n)
    return MB(0.4, amb='room')


def hEatAll(n):  # 人も、家畜も、ペットも、二つ目の心臓の分を、食べている
    meadow(rgb=hexc('#9ab86a'))
    p = person((-2.0, 0.6, 0), hexc('#c7d3e0'), pose='sit', rot_z=0.2, name='you')
    table((-2.0, 0.0, 0), 0.8, 0.6, 0.72)
    rice_bowl((-2.0, 0.0, 0.745), fill=0.5, s=1.3)
    hearts(p, n, size=1.5)
    c = animal((0.4, 0.8, 0), 'cow', rot_z=0.3, name='cow'); O[c['neck']].rotation_euler.x = 0.5
    hay((0.6, -0.4, 0.3), s=0.6); hearts(c, n, bpm=(50, 44), size=1.6)
    ct = cat((2.4, 0.2, 0), 'tora', s=0.75, rot_z=0.2, pose='crouch', name='cat'); bowl((2.4, -0.2, 0.03))
    hearts(ct, n, bpm=(110, 96), size=2.2, up=0.9, out=2.2)
    cam = camera(32)
    cam_path(cam, [(0, (-1.5, -5.5, 1.8), (0.2, 0.4, 0.7)), (1, (1.0, -5.5, 1.8), (0.4, 0.4, 0.7))], n)
    return MB(0.6, amb='day')


# ---------------- SCENE 19 柿の木まで、下りてくるクマ（章18） ----------------
def autumn_mountain():
    meadow(rgb=hexc('#a8884a'), sky_c=hexc('#b8cde0'))
    mountain((0, 60, 0), 40, 28, hexc('#b07a3a'))
    mountain((-40, 70, 0), 35, 22, hexc('#9a6a3a'))
    pine_forest(60, (-25, 25), (2, 40), seed=130, autumn=True)


def hBearAcorns(n):  # 一か月後。秋の山。クマは冬眠の前に、どんぐりやブナの実をたくさん食べる
    autumn_mountain()
    b = animal((0, 4, 0), 'bear', rot_z=0.4, name='bear')
    O[b['neck']].rotation_euler.x = 0.45
    hearts(b, n, bpm=(60, 52), size=1.4)
    rnd = random.Random(131)
    for i in range(30):
        acorn((rnd.uniform(-2, 2), rnd.uniform(2.5, 5.5), 0), s=2.0)
    cam = camera(40)
    cam_path(cam, [(0, (4, -3, 1.6), (0, 4, 0.6)), (1, (3, -2.4, 1.4), (0, 4, 0.6))], n)
    return MB(0.6, amb='wind')


def hBearDen(n):  # 冬の間は、ためた脂肪で眠り続ける。二つの心臓が打ち続ける。脂肪がもっと要る
    sky(hexc('#1e2430')); s = bpy.context.scene; s.view_settings.exposure = 0.2
    light_dir((0.2, -0.4, 0.9))
    box((0, 2.0, -1.0), (8, 4.8, 2.0), hexc('#4a3a2a'))  # 土の断面
    box((0, -0.6, -2.2), (3.4, 1.6, 0.4), hexc('#4a3a2a'))  # 穴の床
    sphere((0, -0.3, -1.45), 1.0, hexc('#1e1610'), scale=(1.5, 0.25, 0.75), seg=20)  # 穴の奥
    box((0, 1.5, 0.03), (8, 6, 0.06), (0.95, 0.97, 1.0))  # 雪
    b = animal((0, -0.75, -2.0), 'bear', pose='crouch', rot_z=math.pi / 2, name='bear')
    hearts(b, n, bpm=(14, 12), size=2.0, up=0.9, out=2.2)
    fat = ball((0, -0.75, -1.75), 0.45, (1.0, 0.85, 0.45), a=0.35, seg=18, name='fat')
    fat.keyframe_insert('scale', frame=1)
    fat.scale = (0.4, 0.4, 0.4); fat.keyframe_insert('scale', frame=n)
    cam = camera(40)
    cam_path(cam, [(0, (0.0, -4.6, -1.2), (0, -0.6, -1.7)), (1, (0.4, -4.2, -1.3), (0, -0.6, -1.75))], n)
    return MB(0.8, amb='night')


def village(n, bare_from=None):
    meadow(rgb=hexc('#a89a60'), sky_c=hexc('#b8cde0'))
    mountain((0, 50, 0), 35, 22, hexc('#9a6a3a'))
    pine_forest(30, (-25, 25), (14, 40), seed=132, autumn=True)
    for (x, y) in ((-9, -2), (10, 8)):
        house((x, y, 0), 7, 6, 5.0)
    kaki_tree((0, 4, 0), s=1.2, bare_from=bare_from)


def hBearKaki(n):  # 山の実だけでは足りない。クマは、村の柿の木まで下りてくる
    village(n)
    b = animal((-3, 12, 0), 'bear', rot_z=math.pi, name='bear')
    move(b, [(1, (-3, 12, 0)), (int(n * 0.7), (-0.6, 5.3, 0)), (n, (-0.6, 5.3, 0))])
    hearts(b, n, bpm=(60, 52), size=1.4)
    cam = camera(32)
    cam_path(cam, [(0, (3, -9, 2.5), (-1, 6, 1.5)), (1, (2, -9.5, 2.4), (-1, 5, 1.5))], n)
    return MB(0.6, amb='wind')


def hKakiHarvest(n):  # 村の人たちは、柿の実を、早めに全部もぎ取る
    village(n, bare_from=int(n * 0.1))
    rnd = random.Random(133)
    for i in range(3):
        p = crowd_person((-1.6 + i * 1.6, 2.4, 0), rnd, rot_z=math.pi * 0.9, name=f'v{i}')
        arm_up(p, 1)
        hearts(p, n, size=1.5)
        basket = cyl((-1.6 + i * 1.6 + 0.5, 2.1, 0.2), 0.25, 0.4, hexc('#a07a40'), r2=0.3)
        for k in range(5):
            o = sphere((-1.6 + i * 1.6 + 0.5 + rnd.uniform(-0.15, 0.15), 2.1 + rnd.uniform(-0.15, 0.15), 0.42), 0.09, hexc('#f07a20'), seg=10)
            appear(o, int(n * 0.15) + k * int(n * 0.15))
    cam = camera(32)
    cam_path(cam, [(0, (3, -5, 2.4), (0, 3.5, 2.0)), (1, (1.5, -5.5, 2.2), (0, 3.5, 1.8))], n)
    return MB(0.5, amb='day')


def hBorder(n):  # 山と村の境目で、食べ物の取り合いが始まる
    village(n, bare_from=1)
    b = animal((-6, 14, 0), 'bear', rot_z=math.pi * 0.8, name='bear')
    hearts(b, n, bpm=(60, 52), size=1.6)
    cam = camera(30)
    cam_path(cam, [(0, (14, -18, 9), (0, 12, 2)), (1, (6, -22, 12), (0, 14, 2))], n)
    return MB(0.5, amb='wind')


# ---------------- SCENE 20 終わらない追いかけっこ（章19） ----------------
def savanna():
    meadow(rgb=hexc('#d8c080'), sky_c=hexc('#a8d0ec'), exp=0.45)
    rnd = random.Random(140)
    for i in range(10):
        x = rnd.uniform(-40, 40); y = rnd.uniform(15, 50)
        cyl((x, y, 1.5), 0.2, 3.0, hexc('#6a5040'))
        sphere((x, y, 3.2), 2.4, hexc('#7a9a4a'), scale=(1.4, 1.4, 0.35), seg=12)
    grass(150, (-20, 20), (-6, 12), seed=141, h=(0.2, 0.5))


def hSavanna(n):  # 二か月後。アフリカの草原。チーターが、ガゼルを追いかける
    savanna()
    g = animal((-6, 2, 0), 'gazelle', rot_z=-math.pi / 2, name='gaz')
    c = animal((-10, 2.5, 0), 'cheetah', rot_z=-math.pi / 2, name='chee')
    move(g, [(1, (-6, 2, 0)), (n, (14, 3, 0))])
    move(c, [(1, (-10, 2.5, 0)), (n, (11, 3.2, 0))])
    hearts(g, n, bpm=(120, 108), size=1.4); hearts(c, n, bpm=(120, 108), size=1.4)
    cam = camera(32)
    cam_path(cam, [(0, (-8, -8, 2.0), (-7, 2, 0.8)), (1, (11, -8, 2.0), (12, 3, 0.8))], n)
    return MB(0.8, amb='wind')


def hChase(n):  # 追う方も、逃げる方も、前より長く走れる。追いかけっこは、前より長く続く
    savanna()
    g = animal((0, 0, 0), 'gazelle', name='gaz'); c = animal((0, 0, 0), 'cheetah', name='chee')
    gk, ck = [], []
    for f in range(1, n + 1, 6):
        t = f / n
        gk.append((f, (-8 + 18 * t, 3 * math.sin(t * 9), 0)))
        ck.append((f, (-11 + 18 * t, 3 * math.sin(t * 9 - 0.6), 0)))
    move(g, gk); move(c, ck)
    hearts(g, n, bpm=(120, 108), size=1.4); hearts(c, n, bpm=(120, 108), size=1.4)
    cam = camera(30)
    cam_path(cam, [(0, (-10, -12, 3.0), (-8, 0, 0.8)), (1, (8, -12, 3.0), (8, 0, 0.8))], n)
    return MB(0.9, amb='wind')


def draw_catch(im, d):
    d.rectangle((0, 0, 1920, 1080), fill=(250, 246, 236))
    d.text((90, 60), 'つかまる数', font=_font(100), fill=(60, 64, 80))
    for r, lab in enumerate(('前', '今')):
        y = 330 + r * 330
        d.text((110, y), lab, font=_font(150), fill=(60, 64, 80))
        for k in range(3):
            d.ellipse((450 + k * 300, y + 10, 650 + k * 300, y + 210), fill=(220, 170, 80))
        d.rounded_rectangle((1450, y + 40, 1820, y + 180), 30, fill=(200, 205, 215))
    d.text((1490, 380), '＝', font=_font(140), fill=(60, 64, 80))


def hCatchCard(n):  # そして、つかまる数は、前と変わらない
    savanna()
    tex_plane('h_catch', draw_catch, (0, 2, 2.0), 3.6, 2.0)
    c = animal((-2.6, 1.2, 0), 'cheetah', pose='sit', rot_z=0.4, name='chee'); hearts(c, n, bpm=(80, 70), size=1.4)
    cam = camera(35)
    cam_path(cam, [(0, (0.4, -4.4, 1.8), (0, 2, 1.8)), (1, (-0.2, -4.0, 1.8), (-0.2, 2, 1.7))], n)
    return MB(0.6, amb='wind')


def hCheetahRest(n):  # 変わったのは、走ったあとの空腹。ガゼルも前より多くの草を食べる
    savanna()
    c = animal((-1.0, 1.6, 0), 'cheetah', pose='crouch', rot_z=0.5, name='chee')
    hearts(c, n, bpm=(80, 70), size=2.0, up=0.9, out=2.2)
    rnd = random.Random(142)
    for i in range(6):
        g = animal((2 + rnd.uniform(-2, 3), 5 + rnd.uniform(-1, 3), 0), 'gazelle', rot_z=rnd.uniform(-3, 3), name=f'g{i}')
        O[g['neck']].rotation_euler.x = 0.6
        hearts(g, n, bpm=(90, 80), size=1.4)
    cam = camera(35)
    cam_path(cam, [(0, (-3.0, -3.6, 1.2), (0.5, 3, 0.5)), (1, (-2.4, -3.2, 1.1), (1.0, 3, 0.5))], n)
    return MB(0.6, amb='wind')


def hGrassTop(n):  # 草原の草は、前と同じだけしか生えない（上から見た図）
    savanna()
    rnd = random.Random(143)
    for i in range(14):
        g = animal((rnd.uniform(-10, 10), rnd.uniform(-6, 10), 0), 'gazelle', rot_z=rnd.uniform(-3, 3), name=f'g{i}')
        O[g['neck']].rotation_euler.x = 0.6
        hearts(g, n, bpm=(90, 80), size=2.4)
    cam = camera(35)
    cam_path(cam, [(0, (0, -6, 19), (0, 2, 0)), (1, (0, -4, 17), (0, 2, 0))], n)
    return MB(0.5, amb='wind')


# ---------------- SCENE 21 森で生まれる、子ジカの数（章20） ----------------
def spring_forest():
    meadow(rgb=hexc('#88b060'), sky_c=hexc('#b8dcef'))
    pine_forest(70, (-25, 25), (2, 40), seed=150, spring=True)
    grass(200, (-6, 6), (-3, 6), seed=151, h=(0.15, 0.4))


def hSpringForest(n):  # 半年後。春の森。子ジカが生まれる季節。母ジカは二つの心臓の分も、おなかの子の分も
    spring_forest()
    d = animal((0, 2, 0), 'deer', rot_z=0.4, name='deer')
    O[d['neck']].rotation_euler.x = 0.55
    hearts(d, n, bpm=(70, 62), size=1.5)
    bd = O[d['body']]
    pulse(body_center(bd) + Vector((0, 0.05, -0.08)), n, bpm=110, r=0.03, parent=bd.parent, col_on=(1.0, 0.7, 0.75))
    cam = camera(40)
    cam_path(cam, [(0, (5.0, -3.5, 1.7), (0, 2, 0.9)), (1, (4.2, -3.0, 1.6), (0, 2, 0.9))], n)
    return MB(0.6, amb='garden')


def hForestGrain(n):  # 森の草と木の芽は、去年と同じだけしかない
    spring_forest()
    rnd = random.Random(152)
    for i in range(120):
        ball((rnd.uniform(-6, 6), rnd.uniform(-2, 10), rnd.uniform(0.1, 0.4)), 0.09, (1.0, 0.9, 0.35), a=0.9, seg=8)
    cam = camera(32)
    cam_path(cam, [(0, (0, -7, 3.0), (0, 4, 0.2)), (1, (1.5, -6.5, 2.8), (0, 4, 0.2))], n)
    return MB(0.4, amb='garden')


def hFawnsCompare(n):  # この春に生まれる子ジカは、去年より少なくなる
    spring_forest()
    box((0, 2, 0.01), (0.1, 10, 0.02), (1, 1, 1))
    label3d('去年', (-3, 0.0, 1.6), 1.1, (1, 1, 1)); label3d('今年', (3, 0.0, 1.6), 1.1, (1, 1, 1))
    rnd = random.Random(153)
    for side, k in ((-1, 6), (1, 3)):
        for i in range(k):
            f = animal((side * (1.5 + (i % 3) * 1.2), 1 + (i // 3) * 1.6, 0), 'fawn', rot_z=rnd.uniform(-1, 1), name=f'f{side}{i}')
            hearts(f, n, bpm=(110, 96), size=1.6)
    cam = camera(32)
    cam_path(cam, [(0, (0, -8, 3.0), (0, 2, 0.6)), (1, (0, -7, 2.6), (0, 2, 0.6))], n)
    return MB(0.6, amb='garden')


def hHerdsShrink(n):  # クマも、チーターも、ワシも、同じ。同じ森で生きられる数は、減っていく
    meadow(rgb=hexc('#88b060'), sky_c=hexc('#b8dcef'))
    groups = [('bear', -6), ('cheetah', 0), ('deer', 6)]
    for kind, x in groups:
        for i in range(4):
            a = animal((x + (i % 2) * 1.6 - 0.8, 2 + (i // 2) * 2.0, 0), kind, rot_z=-0.3, name=f'{kind}{i}')
            hearts(a, n, size=1.4)
            if i >= 2:
                vanish(a, int(n * 0.45) + i * 20)
    for i in range(4):
        e = eagle((-3 + i * 2.0, 6, 4.2 + 0.6 * (i % 2)), rot_z=-1.2, name=f'e{i}')
        flap(e, 1, n, period=8)
        hearts(birdbody(e), n, size=1.6)
        if i >= 2:
            vanish(e, int(n * 0.5) + i * 20)
    cam = camera(30)
    cam_path(cam, [(0, (0, -13, 4.0), (0, 3, 2.0)), (1, (0, -11, 3.6), (0, 3, 2.0))], n)
    return MB(0.6, amb='garden')


def hForestWide(n):  # 森は、静かに、新しいつり合いを探し始める
    spring_forest()
    for i in range(2):
        d = animal((-2 + i * 3, 6 + i, 0), 'deer', rot_z=0.3, name=f'd{i}')
        hearts(d, n, size=1.6)
    f = animal((0.3, 5.5, 0), 'fawn', rot_z=0.3, name='fawn'); hearts(f, n, bpm=(110, 96), size=1.6)
    cam = camera(28)
    cam_path(cam, [(0, (0, -6, 2.0), (0, 8, 2.0)), (1, (0, -12, 5.0), (0, 10, 2.0))], n)
    return MB(0.5, amb='garden')


# ---------------- SCENE 22 数を決めていたもの（章21） ----------------
def hGlobeLife(n, end=False):  # 一年後。倒れにくくなったのに、生き物の数は減っている
    space_globe()
    pts = land_points(-170, 180, -45, 68, 700, seed=7)
    rnd = random.Random(160)
    for i, (lon, lat) in enumerate(pts):
        o = sphere(P(lon, lat, 6.02), 0.055, (1.0, 0.45, 0.5), seg=6)
        if rnd.random() < 0.25 and not end:
            vanish(o, rnd.randint(int(n * 0.2), int(n * 0.9)))
        elif end and rnd.random() < 0.25:
            o.scale = (0, 0, 0)
    cam = camera(50)
    if end:
        cam_path(cam, [(0, P(130, 30, 22), (0, 0, 0)), (1, P(150, 32, 24), (0, 0, 0))], n)
    else:
        cam_path(cam, [(0, P(20, 20, 24), (0, 0, 0)), (1, P(80, 25, 22), (0, 0, 0))], n)
    return MB(0.4, amb='space')


def hGlobeEnd(n):  # 長生きになって、数が減る
    return hGlobeLife(n, end=True)


def hBalance(n):  # 数を決めていたのは、食べ物の量。一つ一つが多く食べれば、森が養える数は減る
    sky(hexc('#e8dfcf')); s = bpy.context.scene; s.view_settings.exposure = 0.4
    light_dir((0.3, -0.5, 0.8))
    ground(rgb=hexc('#c8b898'))
    cyl((0, 0, 1.0), 0.08, 2.0, hexc('#8a6a48'))
    beam = empty((0, 0, 2.0), 'beam')
    link(box((0, 0, 0), (4.0, 0.12, 0.12), hexc('#8a6a48')), beam)
    pans = []
    for sx in (-1, 1):
        pe = empty((sx * 1.9, 0, 0), 'pan'); link(pe, beam)
        link(cyl((0, 0, -0.6), 0.01, 1.2, hexc('#444444')), pe)
        link(cyl((0, 0, -1.2), 0.7, 0.06, hexc('#c0c4c8')), pe)
        pans.append(pe)
    # 左：森の草と実
    for i in range(14):
        rr = random.Random(i)
        link(sphere((rr.uniform(-0.45, 0.45), rr.uniform(-0.45, 0.45), -1.1 + rr.uniform(0, 0.2)), 0.13, rr.choice([hexc('#6a9a3a'), hexc('#8aba4a'), hexc('#c8a040')]), seg=10), pans[0])
    # 右：生き物（一頭の食べる量が増えると、数が減ってつり合う）
    anims = []
    for i in range(6):
        a = animal((0, 0, 0), 'deer', s=0.9, rot_z=0.5, name=f'd{i}')
        a.parent = pans[1]; a.location = (-0.4 + (i % 3) * 0.4, -0.2 + (i // 3) * 0.4, -1.17)
        anims.append(a)
    f1, f2 = int(n * 0.3), int(n * 0.65)
    for a in anims:  # 一頭が大きく食べる＝体の上に光る食べ物の玉
        ball((0, -0.05, 0.75), 0.08, (1.0, 0.8, 0.3), a=0.9, seg=8, parent=a, name='food')
    for a in anims[3:]:
        vanish(a, f2)
    beam.rotation_euler.y = 0.0; beam.keyframe_insert('rotation_euler', index=1, frame=1); beam.keyframe_insert('rotation_euler', index=1, frame=f1)
    beam.rotation_euler.y = -0.18; beam.keyframe_insert('rotation_euler', index=1, frame=f1 + 20); beam.keyframe_insert('rotation_euler', index=1, frame=f2)
    beam.rotation_euler.y = 0.0; beam.keyframe_insert('rotation_euler', index=1, frame=f2 + 24)
    for pe in pans:  # 皿は水平のまま
        pe.rotation_euler.y = 0; pe.keyframe_insert('rotation_euler', index=1, frame=1)
        pe.rotation_euler.y = 0.18; pe.keyframe_insert('rotation_euler', index=1, frame=f1 + 20); pe.keyframe_insert('rotation_euler', index=1, frame=f2)
        pe.rotation_euler.y = 0.0; pe.keyframe_insert('rotation_euler', index=1, frame=f2 + 24)
    cam = camera(30)
    cam_path(cam, [(0, (0.4, -6.4, 1.6), (0, 0, 1.3)), (1, (-0.3, -6.0, 1.5), (0, 0, 1.3))], n)
    return MB(0.4, amb='silent')


def hFieldsShip(n):  # 人は、畑を広げ、えさを運び、お金を払って、二つ目の心臓の分をまかなう
    sky(hexc('#a9cbe4')); s = bpy.context.scene; s.view_settings.exposure = 0.45
    light_dir((0.6, -0.3, 0.6))
    box((0, 40, -0.05), (400, 120, 0.1), hexc('#3d6f9c'))
    ground_ = box((0, -40, 0.0), (400, 80, 0.2), hexc('#9ab86a'))
    rnd = random.Random(170)
    for i in range(12):
        f = box((-30 + (i % 6) * 10, -10 - (i // 6) * 10, 0.12), (9, 9, 0.04), rnd.choice([hexc('#c8b050'), hexc('#7aa04a'), hexc('#a8c060')]))
        appear(f, 1 + i * int(n * 0.05))
    box((10, 0.5, 0.3), (30, 3, 0.6), hexc('#9a958d'))  # 岸壁
    ship = empty((10, 6, 0), 'ship')
    link(box((0, 0, 0.8), (14, 4, 1.6), hexc('#c84a3a')), ship)
    link(box((4, 0, 2.4), (3, 3.4, 1.6), (1, 1, 1)), ship)
    for k in range(4):
        link(box((-4 + k * 2.2, 0, 2.0), (2, 3, 0.8), hexc('#d8c08a')), ship)
    ship.keyframe_insert('location', frame=1); ship.location = (40, 14, 0); ship.keyframe_insert('location', frame=n)
    cam = camera(30)
    cam_path(cam, [(0, (-10, -30, 14), (6, 2, 0)), (1, (0, -32, 16), (14, 6, 0))], n)
    return MB(0.3, amb='sea')


# ---------------- SCENE 23 一年後の、同じ電車（章22） ----------------
def hWindowOut(n):  # 窓の外：遠回りの散歩道を歩く犬、地面をつつく駅前の鳩
    station_front()
    d = animal((-4, 0.5, 0), 'shiba', pose='walk', rot_z=-math.pi / 2, name='dog')
    o = person((-5, 1.0, 0), hexc('#c46a4a'), rot_z=-math.pi / 2, name='owner')
    move(d, [(1, (-4, 0.5, 0)), (n, (3, 0.5, 0))]); move(o, [(1, (-5, 1.0, 0)), (n, (2, 1.0, 0))])
    hearts(d, n, bpm=(80, 70), size=1.6); hearts(o, n, size=1.4)
    rnd = random.Random(180)
    for i in range(6):
        b = pigeon((1 + rnd.uniform(-1.5, 1.5), -1.0 + rnd.uniform(-0.6, 0.6), 0), rot_z=rnd.uniform(-2, 2))
        peck(b, n, rnd, period=(8, 12))
        hearts(birdbody(b), n, bpm=(120, 105), size=1.5)
    # 電車の窓枠（手前）
    for z in (0.0, 3.0):
        box((0, -6.0, z), (8, 0.2, 1.2), hexc('#e6e8e4'))
    for x in (-3.4, 3.4):
        box((x, -6.0, 1.5), (1.2, 0.2, 3.0), hexc('#e6e8e4'))
    cam = camera(30)
    cam_path(cam, [(0, (-1.0, -7.5, 1.6), (-1.0, 1, 0.6)), (1, (1.0, -7.5, 1.6), (1.0, 1, 0.6))], n)
    return MB(0.6, amb='city')


def hWatchQuiet(n):  # 腕時計は、もう震えない（設定画面に「心臓 2つ」）
    train_car(n, stand=6, sit=10, seed=23, avoid=lambda x, y: -1.5 < x < 1.5 and y < 0.4)
    watch_arm((0.0, -0.2, 1.25), n, [('h_w_time2', draw_watch(['8:00'])), ('h_w_two', draw_watch(['心臓', '2つ'], red=True))],
              swap_at=(int(n * 0.35),), rot_z=0.15)
    cam = camera(55, dof=0.42, fstop=2.0)
    cam_path(cam, [(0, (-0.12, -0.42, 1.62), (-0.2, -0.2, 1.27)), (1, (-0.1, -0.38, 1.58), (-0.2, -0.2, 1.27))], n)
    return MB(0.5, amb='city')


def hTrainTummy(n):  # 車内で、誰かのおなかが鳴る。誰も、振り向かない
    st, si, _ = train_car(n, stand=8, sit=14, seed=24, bpm=(50, 44), avoid=lambda x, y: x < -6.5)
    p = si[3] if len(si) > 3 else st[0]
    rings(tuple(p.matrix_world.translation + Vector((0, 0, 0.7))), [int(n * 0.3), int(n * 0.36)], rgb=(1.0, 0.75, 0.3), size=0.2)
    cam = camera(28)
    cam_path(cam, [(0, (-8.2, 0.1, 1.65), (2.0, -0.3, 1.2)), (1, (-7.4, -0.1, 1.6), (3.0, 0.3, 1.15))], n)
    return MB(0.7, amb='city')


def hOnigiriBag(n):  # あなたの二つの鼓動を支えているのは、今朝の、ごはん
    train_car(n, stand=5, sit=8, seed=25, avoid=lambda x, y: -1.6 < x < 1.6 and y < 0.4)
    bag = boxc((0, -0.3, 0.95), (0.42, 0.18, 0.32), hexc('#5a4a3a'))
    inner = boxc((0, -0.3, 1.1), (0.38, 0.14, 0.02), hexc('#3a2e24'))
    oni = onigiri((0.05, -0.3, 1.08), s=1.4, rot_z=0.1)
    oni.keyframe_insert('location', frame=1)
    oni.location.z = 1.16; oni.keyframe_insert('location', frame=int(n * 0.5))
    h1 = heart3d((-0.12, -0.32, 1.3), s=0.045); h2 = heart3d((0.12, -0.32, 1.3), s=0.045)
    beat_scale(h1, n, bpm=50, amp=0.2); beat_scale(h2, n, bpm=44, amp=0.2, offset=0.4)
    cam = camera(45, dof=0.7, fstop=2.0)
    cam_path(cam, [(0, (0.3, -1.0, 1.5), (0, -0.3, 1.15)), (1, (0.2, -0.85, 1.45), (0, -0.3, 1.18))], n)
    return MB(0.6, amb='city')


# ---------------- エンドカード（章23） ----------------
def hEnd(n):  # 朝の電車がまた走っていく
    return hTrainCity(n)
