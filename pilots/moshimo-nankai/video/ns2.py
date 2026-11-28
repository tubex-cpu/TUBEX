"""カット：SCENE 12〜21（章11〜20）：東京のすぐそばの海／動けない駅／揺れたのは半分だけ／歩いて帰る東京／家に残る町／32時間後／暗闇の坂道／もう一度揺れる焼津／届かない映像／土砂のダム"""
from ns1 import *
from nk import _obj, _font


# ---------------- SCENE 12 東京のすぐそばの海（章11） ----------------
def nKantoMap(n):  # 津波は、東京のすぐそばにも、やってくる（地図：相模湾・東京湾・伊豆諸島）
    japan_map(name='nk_map_k', labels=MAP_LABELS + [('鎌倉', 139.55, 35.32)])
    map_text('相模湾', 139.35, 34.95, size=2.0, rgb=(0.7, 0.85, 1.0))
    map_text('東京湾', 139.85, 35.35, size=2.0, rgb=(0.7, 0.85, 1.0))
    map_text('伊豆諸島', 139.75, 34.3, size=2.0, rgb=(0.7, 0.85, 1.0))
    pulse_rings(MP(138.6, 34.0), n, 6, period=26, r1=5, a=0.2)
    map_cam(n, (139.0, 34.5, 40), (139.2, 34.7, 34))
    return NB('silent')


SHONAN_Y = 0.0


def beach(n, wave=None, flood_z=None, seed=111, people=True):
    """湘南のような砂浜と町（模式）。海は +y、砂浜は y=0〜40、町は y<0。実在の店名なし"""
    day_light('#a7bccd', 0.45)
    plane((0, 20, 0.0), (800, 40), hexc('#d9cba4'), name='sand')
    plane((0, -200, 0.0), (800, 400), hexc('#a9a294'), name='land')
    plane((0, 300, -0.4), (800, 520), hexc('#4a7a9c'), name='sea')
    mbox([(x, 44, -0.2, 30, 1.0, 0.1) for x in range(-300, 301, 34)], FOAM, 'surf')
    plane((0, -4, 0.02), (800, 7), ASPH)
    pine_row(-200, 200, -10, k=60, seed=seed)
    rnd = random.Random(seed)
    for i in range(-12, 13):
        for j in range(3):
            if rnd.random() < 0.3:
                tower((i * 14 + rnd.uniform(-2, 2), -28 - j * 16, 0), 10, 9, rnd.choice([9.6, 12.8]), rnd.choice(WALLS))
            else:
                j_house((i * 14 + rnd.uniform(-2, 2), -26 - j * 14, 0), rnd=rnd, name=f'bh{i}_{j}')
    far_hills(y=-320)
    if people:
        for i in range(10):
            x = rnd.uniform(-30, 30); y = rnd.uniform(8, 30)
            p = crowd_person((x, y, 0), rnd, name=f'bp{i}')
            run_to(p, [(x, y, 0), (x + rnd.uniform(-4, 4), -2, 0), (x, -40, 0)], 1 + rnd.randint(0, 20), speed=rnd.uniform(2.6, 3.4))
    if wave:
        f0, f1, y0, y1, h = wave
        w = wave_wall(-400, 400, y0, h, c=hexc('#58798e'))
        move_y(w, [(1, y0), (max(2, f0), y0), (f1, y1)])
        linear(w, 'location')
    if flood_z:
        f0, f1, z0, z1 = flood_z
        flood((0, 0, 0), (800, 800), z0, z1, f0, f1, c=hexc('#5d6a66'))
        flow_streaks(n, -80, 80, -60, 40, z1, dirv=(0, -1), speed=4, c=hexc('#8a8676'))
        debris_field(n, -60, 60, -40, 30, z1 - 0.05, speed=4, k=80)


def nBeach40(n):  # 地震から、およそ四十分。神奈川の相模湾の海岸に、津波が届く
    beach(n, wave=(int(n * 0.1), n, 260, 70, 7.0))
    cam = camera(30)
    cam_path(cam, [(0, (20, -4, 14), (0, 80, 2)), (1, (18, -2, 13), (0, 90, 3))], n)
    return NB('sea', roar=[(int(n * 0.3), n, 0.6)])


def nBeachOver(n):  # 鎌倉や湘南の砂浜を越えて、波が町の中へ入っていく
    beach(n, wave=(1, int(n * 0.45), 70, -6, 7.0), flood_z=(int(n * 0.35), n, -0.3, 4.0), people=False)
    cam = camera(30)
    cam_path(cam, [(0, (-60, -70, 30), (0, 0, 2)), (1, (-54, -66, 28), (0, -10, 2))], n)
    return NB('sea', roar=[(1, n, 1.0)])


def nThirdFloor(n):  # 高さは、場所によって、ビルの三階に届くほど
    day_light('#a7bccd', 0.45)
    ground(size=400, rgb=hexc('#a9a294'))
    b = tower((0, 0, 0), 12, 10, 12.8, hexc('#e6dccb'))
    for k in range(3):
        box((-6.05, 0, 1.6 + k * 3.2), (0.05, 9, 0.12), hexc('#8a857c'))
        text3d(f'{k + 1}階', (-6.3, -3.5, 1.3 + k * 3.2), 0.9, (0.2, 0.2, 0.22), rot=(math.pi / 2, 0, -math.pi / 2))
    rnd = random.Random(112)
    for k in range(4):
        j_house((-26 + k * 16 if k != 2 else 26, 14, 0), rnd=rnd, name=f'tf{k}')
    fl = flood((0, 0, 0), (400, 400), 0.0, 8.6, 1, int(n * 0.75), c=hexc('#5d6a66'))
    flow_streaks(n, -40, 40, -40, 40, 0.0, dirv=(0, -1), speed=4, c=hexc('#8a8676'))
    for o in [o for o in bpy.data.objects if o.name.startswith('streak')]:
        o.parent = fl
    cam = camera(30)
    cam_path(cam, [(0, (-30, -30, 16), (0, 0, 6)), (1, (-28, -28, 16), (0, 0, 6))], n)
    return NB('sea', roar=[(1, n, 0.8)])


def bay_city(n, river=True, seed=113):
    day_light('#a7b6c4', 0.45)
    ground(size=1600, rgb=hexc('#9a9690'))
    plane((0, 420, -1.0), (1600, 600), hexc('#4f7a96'), name='bay')
    box((0, 118, 0.0), (1600, 4, 2.4), CONC)
    if river:
        plane((0, 0, -1.2), (36, 240), hexc('#4f7a96'), name='river')
        for sx in (-1, 1):
            box((sx * 19, 0, 0.0), (2.4, 240, 2.6), CONC)
    def avoid(x, y):
        return abs(x) < 26
    rnd = random.Random(seed)
    items = {}
    for i in range(-8, 9):
        for j in range(-4, 3):
            x = i * 22 + rnd.uniform(-3, 3); y = j * 24 + rnd.uniform(-3, 3)
            if avoid(x, y):
                continue
            h = rnd.uniform(8, 40); c = rnd.choice(WALLS + [hexc('#b9c3cc')])
            items.setdefault(c, []).append((x, y, h / 2, 14, 14, h))
    for c, it in items.items():
        mbox(it, c, 'bc')
    skyline(n, cx=0, cy=-260, nx=8, ny=2, pitch=60, hr=(60, 200), seed=seed)


def nTokyoBay(n):  # 一時間たつと、波は、東京湾の奥にも入ってくる
    bay_city(n)
    water((0, 420, 0), (1600, 600), -1.0, 1.4, 1, n, c=hexc('#567a8e'), a=1.0)
    w = wave_wall(-800, 800, 700, 2.4, c=hexc('#567a8e'))
    move_y(w, [(1, 700), (n, 160)])
    linear(w, 'location')
    cam = camera(30)
    cam_path(cam, [(0, (-160, -60, 70), (0, 200, 0)), (1, (-150, -50, 66), (0, 220, 0))], n)
    return NB('sea', roar=[(1, n, 0.4)])


def nRiverBack(n):  # 東京の川を、海の水がさかのぼっていく
    bay_city(n, seed=114)
    water((0, 0, 0), (36, 240), -1.2, 0.8, 1, n, c=hexc('#567a8e'), a=1.0)
    flow_streaks(n, -16, 16, -120, 120, 0.4, dirv=(0, -1), speed=4.5, c=FOAM, k=120, L=3.0)
    rnd = random.Random(115)
    for k in range(3):
        b = fishing_boat((rnd.uniform(-10, 10), 60 + k * 18, 0.0), rot_z=math.pi / 2, s=0.6, name=f'rb{k}')
        drift(b, n, 1, (0, -30, 0), z=0.6, spin=rnd.uniform(-0.4, 0.4), seed=k)
    cam = camera(28)
    cam_path(cam, [(0, (40, -120, 26), (0, 20, 0)), (1, (34, -110, 24), (0, 10, 0))], n)
    return NB('sea', roar=[(1, n, 0.4)])


def nIzuIsland(n):  # 東京から南の海に浮かぶ島々には、十階建てのビルに迫る高さの津波が押し寄せる
    day_light('#8fa3b4', 0.4)
    plane((0, 0, -0.5), (3000, 3000), hexc('#3f6f94'), name='sea')
    msph([(0, 150, -10, 110, 1.0, 1.0, 0.45)], hexc('#6f8a5a'), 'island', sub=3, smooth=True)
    plane((0, -10, 0.3), (60, 14), CONC)
    rnd = random.Random(116)
    for k in range(10):
        j_house((-30 + k * 7, 4 + rnd.uniform(0, 6), 0.3), w=5, d=5, h=5, rnd=rnd, name=f'iz{k}')
    for k in range(3):
        bob_rock(fishing_boat((-20 + k * 14, -22, -0.3), s=0.8, name=f'ib{k}'), n, seed=k)
    w = wave_wall(-500, 500, -300, 26.0, c=hexc('#4f7088'))
    w.rotation_euler.z = math.pi
    w.location.y = -300
    w.keyframe_insert('location', index=1, frame=1)
    w.location.y = -40; w.keyframe_insert('location', index=1, frame=n)
    linear(w, 'location')
    cam = camera(26)
    cam_path(cam, [(0, (60, 36, 26), (0, -150, 10)), (1, (56, 34, 25), (0, -120, 10))], n)
    return NB('sea', roar=[(1, n, 0.9)])


# ---------------- SCENE 13 動けない駅（章12） ----------------
def draw_board(im, d):
    d.rectangle((0, 0, im.width, im.height), fill=(14, 18, 28))
    f = _font(64); fb = _font(52)
    d.text((40, 20), '発車案内', font=f, fill=(255, 200, 80))
    lines = ['各線　運転見合わせ', '運転再開の見込み　立っていません', '各線　運転見合わせ', '運転再開の見込み　立っていません']
    for i, t in enumerate(lines):
        d.text((40, 140 + i * 110), t, font=fb, fill=(255, 90, 70) if i % 2 == 0 else (240, 240, 240))


def station(n, seed=121, k=140, sit=0.3, phones=0.3, board=True, gates=True):
    """駅のコンコース：改札の列・案内板・人で埋まる。改札は y=0、駅の外は y<-14"""
    s = bpy.context.scene
    sky(hexc('#c8ccd0')); s.view_settings.exposure = 0.45; no_shadow()
    light_dir((0.2, -0.3, 0.9))
    box((0, 10, -0.1), (80, 60, 0.2), hexc('#cfc9bc'))
    box((0, 10, 8.2), (80, 60, 0.3), hexc('#e8e6e0'))
    box((0, 40, 4), (80, 0.3, 8), hexc('#e2ddd2'))
    for x in range(-36, 37, 12):
        box((x, 12, 4), (0.8, 0.8, 8), hexc('#d8d2c6'))
    mbox([(x, y, 7.95, 6, 0.6, 0.08) for x in range(-30, 31, 12) for y in (0, 12, 24)], hexc('#fffbea'), 'lights')
    if gates:
        mbox([(x, 0, 0.5, 0.25, 1.6, 1.0) for x in range(-12, 13, 1)], hexc('#9aa0a6'), 'gates')
        mbox([(x, 0, 1.02, 0.3, 1.6, 0.05) for x in range(-12, 13, 1)], hexc('#4a5a7a'), 'gtop')
    if board:
        tex_board('nk_board', draw_board, (0, -0.6, 5.2), 9, 3.4, size=(1600, 600))
        tex_board('nk_board', draw_board, (0, -0.5, 5.2), 9, 3.4, rot=(math.pi / 2, 0, math.pi), size=(1600, 600))
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        x = rnd.uniform(-30, 30); y = rnd.uniform(-14, 30)
        if abs(y) < 1.2 and abs(x) < 13:
            continue
        r = rnd.random()
        if r < sit:
            p = crowd_person((x, y, 0), rnd, rot_z=rnd.uniform(0, 6.28), pose='sit', name=f'sc{i}', act='phone' if rnd.random() < phones else None)
        else:
            p = crowd_person((x, y, 0), rnd, rot_z=rnd.uniform(-1, 1), name=f'sc{i}', act='phone' if rnd.random() < phones else None)
        out.append(p)
    return out


def nStationFull(n):  # 電車が止まった街では、駅に、人があふれる
    station(n)
    cam = camera(26)
    cam_path(cam, [(0, (-20, -12, 7), (0, 10, 1)), (1, (-18, -11, 6.5), (2, 12, 1))], n)
    return NB('city', speaker=[(int(n * 0.5), n)])


def nGates(n):  # 改札の前から、駅の外まで、人で埋まって、身動きがとれない
    station(n, seed=122, k=180, sit=0.1)
    cam = camera(28)
    cam_path(cam, [(0, (6, 10, 3.2), (-2, -6, 1.2)), (1, (5, 9, 3.0), (-3, -8, 1.2))], n)
    return NB('city')


def nSitFloor(n):  # 床に座り込む人
    station(n, seed=123, k=120, sit=0.7, board=False)
    cam = camera(32)
    cam_path(cam, [(0, (-6, 16, 1.4), (0, 22, 0.5)), (1, (-5, 15.5, 1.3), (1, 22, 0.5))], n)
    return NB('city')


def nCalls(n):  # 家族に連絡がつかず、何度も電話をかけ直す人
    station(n, seed=124, k=90, phones=0.9, sit=0.2)
    cam = camera(36)
    cam_path(cam, [(0, (4, 18, 1.7), (0, 26, 1.4)), (1, (3.5, 17.5, 1.7), (0.5, 26, 1.4))], n)
    return NB('city')


def nDeadPhone(n):  # スマホの電池が切れ、立ち尽くす人
    station(n, seed=125, k=60, board=False)
    rnd = random.Random(126)
    p = person((0, 6, 0), hexc('#3d5a80'), skin=SKIN[1], name='dead', act='phone')
    rig = O[p['rig']]
    link(box((0.2, -0.4, 1.25), (0.08, 0.02, 0.15), hexc('#101214')), rig)
    t = tilt_head(p); t.rotation_euler = (0.45, 0, 0)
    cam = camera(45)
    cam_path(cam, [(0, (1.6, 2.6, 1.6), (0, 6, 1.3)), (1, (1.3, 2.9, 1.55), (0, 6, 1.3))], n)
    return NB('city')


def nBoard(n):  # 構内の放送は、運転再開の見込みが立たないことを、繰り返し伝える
    station(n, seed=127, k=80)
    for x in (-8, 8):
        sp = box((x, -0.4, 7.4), (0.8, 0.5, 0.5), hexc('#f2f2ee'))
        sound_rings((x, -1.0, 7.2), n, 4 + (x > 0) * 9, period=18, r1=3.0, a=0.15)
    cam = camera(30)
    cam_path(cam, [(0, (2, -16, 2.4), (0, 0, 5.0)), (1, (1.5, -14, 2.4), (0, 0, 5.2))], n)
    return NB('city', speaker=[(1, n)])


def nMillions(n):  # 名古屋のあたりでは四百万人、大阪のあたりでは六百万人が、出かけた先から動けない
    japan_map(name='nk_map_t')
    rnd = random.Random(128)
    for (lo, la, k, f) in ((136.91, 35.17, 140, 4), (135.5, 34.69, 200, int(n * 0.45))):
        groups = []
        for g in range(5):
            items = []
            for _ in range(k // 5):
                r = abs(rnd.gauss(0, 0.28)); a = rnd.uniform(0, 6.28)
                items.append((*MP(lo + r * math.cos(a), la + r * math.sin(a) * 0.8, 0.5), 0.13))
            o = msph(items, (1.0, 0.82, 0.3), 'crowd', sub=0)
            appear(o, f + g * 6, grow=4)
    map_cam(n, (136.2, 34.4, 26), (136.2, 34.6, 22))
    return NB('silent')


def nTokyoGate(n):  # 東京駅でも、西の方へ帰りたい人が、改札の前で立ち尽くす
    station(n, seed=129, k=150, sit=0.15)
    exposure_keys([(1, 0.35)])
    cam = camera(30)
    cam_path(cam, [(0, (-3, 9, 2.4), (1, -4, 1.4)), (1, (-2, 8, 2.3), (2, -5, 1.4))], n)
    return NB('city', speaker=[(1, n)])


# ---------------- SCENE 14 揺れたのは、半分だけ（章13） ----------------
def nMapLater(n):  # 数時間後。揺れの正体が分かる
    japan_map()
    zone('all', rgb=(0.85, 0.85, 0.9), a=0.18)
    trough_line(rgb=hexc('#c8c8d0'))
    map_cam(n, (135.0, 32.9, 84), (135.0, 33.0, 78))
    return NB('silent')


def nEastHalf(n):  # 動いたのは、南海トラフの、東の半分だけだった
    japan_map()
    zone('west', rgb=(0.85, 0.85, 0.9), a=0.15)
    z = zone('east', a=0.6, f0=int(n * 0.15), grow_dur=20)
    map_text('東の半分', 137.4, 32.6, size=4.5, rgb=(1, 0.75, 0.7), f=int(n * 0.4))
    map_cam(n, (135.6, 33.0, 80), (136.2, 33.2, 72))
    return NB('silent')


def nWestQuiet(n):  # 西の半分は、まだ、動いていなかった
    japan_map()
    zone('east', a=0.5)
    zone('west', rgb=(0.9, 0.9, 1.0), a=0.22)
    map_text('西の半分', 133.4, 31.9, size=4.5, rgb=(0.9, 0.92, 1.0), f=int(n * 0.3))
    map_cam(n, (134.6, 32.9, 78), (133.8, 32.8, 70))
    return NB('silent')


def draw_news(title, sub, alert=True):
    def fn(im, d):
        W, H = im.size
        d.rectangle((0, 0, W, H), fill=(22, 34, 58))
        d.rectangle((0, 0, W, 150), fill=(200, 30, 30) if alert else (40, 60, 100))
        d.text((50, 22), title, font=_font(96), fill=(255, 255, 255))
        y = 240
        for t in sub:
            d.text((80, y), t, font=_font(70), fill=(240, 240, 240)); y += 120
        d.rectangle((0, H - 120, W, H), fill=(240, 240, 240))
        d.text((40, H - 100), '高い所へ　すぐに避難を', font=_font(64), fill=(200, 30, 30))
    return fn


def living_tv(n, tex_name, fn, people=2, night=False, seed=131, tv_w=2.6):
    s = bpy.context.scene
    sky(hexc('#c8ccd0')); s.view_settings.exposure = 0.4 if not night else 0.15; no_shadow()
    light_dir((0.2, -0.3, 0.9))
    interior_box(8, 7, 2.6, hexc('#b48a63'), hexc('#efe8dc'))
    scr = tex_board(tex_name, fn, (0, 0, 0), 1, 1)
    tv = tv_set((0, 3.2, 1.35), w=tv_w, tex=scr)
    box((0, 3.25, 0.3), (3.0, 0.5, 0.6), hexc('#6a5040'))
    sofa((0, -1.5, 0), rot_z=math.pi)
    rnd = random.Random(seed)
    ps = []
    for i in range(people):
        p = crowd_person((-0.5 + i * 1.0, -1.4, 0.15), rnd, rot_z=math.pi, pose='sit', name=f'lv{i}')
        ps.append(p)
    return ps


def nNewsAlert(n):  # 日本中に、「巨大地震警戒」が出る（架空のニュース画面）
    living_tv(n, 'nk_news_keikai', draw_news('巨大地震警戒', ['南海トラフの西の半分でも', '大きな地震に備えてください']))
    cam = camera(32)
    cam_path(cam, [(0, (1.4, -3.0, 1.6), (0, 3.2, 1.35)), (1, (1.0, -1.6, 1.5), (0, 3.2, 1.35))], n)
    return NB('room', alert=[4])


def nEvacCall(n):  # まだ揺れていない西の海沿いの町にも、逃げるよう、呼びかけが出る
    japan_map()
    zone('east', a=0.45)
    pts = [p for p in pacific_coast(131.3, 135.7, step=0.08)]
    rnd = random.Random(132)
    for g in range(6):
        o = msph([(*MP(lo, la, 0.5), 0.5) for lo, la in pts[g::6]], (1.0, 0.86, 0.3), 'call', sub=1)
        appear(o, 4 + g * 8, grow=3)
    map_cam(n, (133.6, 32.8, 62), (133.4, 33.0, 56))
    return NB('silent', speaker=[(1, n)])


# ---------------- SCENE 15 歩いて帰る東京（章14） ----------------
def night_avenue(n, walkers=90, seed=141, speed=1.2, lit=0.55):
    night_light('#0e1426', 0.05)
    ground(size=2000, rgb=hexc('#2a2c32'))
    plane((0, 0, 0.02), (24, 2000), hexc('#3a3c42'))
    for sx in (-1, 1):
        plane((sx * 16, 0, 0.05), (8, 2000), hexc('#55524c'))
        mbox([(sx * 12.2, y, 5.5, 0.3, 0.3, 11) for y in range(-400, 401, 30)], hexc('#5a5e64'), 'lpole')
        msph([(sx * 11.2, y, 10.8, 0.5) for y in range(-400, 401, 30)], (1.0, 0.85, 0.55), 'llamp', sub=1)
    for sx in (-1, 1):
        below(lambda: skyline(n, cx=sx * 60, cy=0, nx=1, ny=14, pitch=40, hr=(30, 120), seed=seed + sx, lit=lit, night=True), 0)
    rnd = random.Random(seed)
    ps = []
    for i in range(walkers):
        sx = rnd.choice([-1, 1]); x = sx * 16 + rnd.uniform(-3.2, 3.2); y = rnd.uniform(-60, 60)
        p = crowd_person((x, y, 0.05), rnd, name=f'wk{i}', act='phone' if rnd.random() < 0.15 else None)
        move(p, [(1, (x, y, 0.05)), (n, (x, y + speed * n / FPS * rnd.uniform(0.85, 1.1), 0.05))])
        ps.append(p)
    return ps


def nWalkHome(n):  # その夜、東京では、たくさんの人が、歩いて家に帰る
    night_avenue(n)
    cam = camera(30)
    cam_path(cam, [(0, (0, -40, 7), (16, 20, 1)), (1, (0, -34, 7), (16, 26, 1))], n)
    return NB('night')


def nWalkAerial(n):  # 東京の揺れが小さかった大震災の日にも、首都圏では、およそ五百万人が家に帰れなかった
    night_avenue(n, walkers=140, seed=142)
    cam = camera(26)
    cam_path(cam, [(0, (0, -80, 50), (0, 30, 0)), (1, (0, -72, 48), (0, 40, 0))], n)
    return NB('night')


def nSidewalk(n):  # 幹線道路の歩道に、何キロも、人の列が続く
    night_avenue(n, walkers=100, seed=143)
    cam = camera(34)
    cam_path(cam, [(0, (10, 10, 1.7), (16, 60, 1.4)), (1, (10, 12, 1.7), (16, 62, 1.4))], n)
    return NB('night')


def konbini(n, fill=0.08, seed=144, people=3, night=True):
    s = bpy.context.scene
    sky(hexc('#0e1426') if night else hexc('#c8ccd0')); s.view_settings.exposure = 0.55; no_shadow()
    light_dir((0.2, -0.3, 0.9))
    interior_box(14, 10, 3.0, hexc('#e2e0da'), hexc('#f4f4f2'))
    mbox([(x, y, 2.95, 3, 0.4, 0.05) for x in (-4, 0, 4) for y in (-2, 2)], hexc('#ffffff'), 'clights')
    for k in range(3):
        shelf_unit((-4 + k * 4, 0.5, 0), w=3.2, rot_z=0, fill=fill, seed=seed + k)
        shelf_unit((-4 + k * 4, 0.1, 0), w=3.2, rot_z=math.pi, fill=fill, seed=seed + 10 + k)
    shelf_unit((0, 4.6, 0), w=12, fill=fill * 0.5, seed=seed + 20, cols=[hexc('#9fd0f0'), hexc('#f2f2ee'), hexc('#e8c070')])
    rnd = random.Random(seed)
    for i in range(people):
        p = crowd_person((rnd.uniform(-5, 5), rnd.uniform(-3.5, -1.5), 0), rnd, rot_z=rnd.uniform(-1, 1), name=f'kb{i}')
        move(p, [(1, tuple(p.location)), (n, (p.location.x + rnd.uniform(-2, 2), p.location.y + rnd.uniform(-0.5, 0.5), 0))])


def nKonbiniEmpty(n):  # コンビニの棚から、水とおにぎりが消えている
    konbini(n, fill=0.06)
    cam = camera(28)
    cam_path(cam, [(0, (-6, -4.5, 1.9), (2, 4.6, 1.0)), (1, (-5, -4.0, 1.8), (3, 4.6, 1.0))], n)
    return NB('room')


def nTowerLit(n):  # 高いビルの上の階には、まだ、下りられない人が残っている
    night_light('#0e1426', 0.05)
    ground(size=2000, rgb=hexc('#2a2c32'))
    skyline(n, cx=0, cy=0, nx=5, ny=3, pitch=60, hr=(60, 200), seed=145, night=True)
    rnd = random.Random(146)
    items = []
    for k in range(5):
        x = -120 + k * 60
        for fl in range(rnd.randint(30, 44), 50):
            if rnd.random() < 0.5:
                items.append((x + rnd.uniform(-8, 8), -75, fl * 4, 2.0, 0.3, 1.4))
    mbox(items, hexc('#ffd98a'), 'upper')
    cam = camera(26)
    cam_path(cam, [(0, (0, -300, 8), (0, 0, 140)), (1, (0, -290, 8), (0, 0, 160))], n)
    return NB('night')


# ---------------- SCENE 16 家に残る町（章15） ----------------
HILL_Y = -52.0


def kochi(n, lit=0.6, seed=151, shake_f=None, out_f=None, people=True, dawn=False, tower=False):
    """高知のような海沿いの町（模式）の夜。港・家・後ろの高台（y<HILL_Y で上り坂）"""
    if dawn:
        night_light('#1a2436', 0.3)
    else:
        night_light('#0b1020', 0.25)
    H = harbor_town(n, seed=seed, lit=lit, sea_c=hexc('#1c2a3c'), shops=True, tower=tower, far=False)
    def hfn(x, y):
        return max(0.0, (HILL_Y - y)) * 0.45 + 0.0
    terrain((400, 200), 40, hfn, hexc('#2e3a2c'), 'hill', x0=-200, y0=HILL_Y - 200)
    mbox([(0, HILL_Y - 30 - k * 3, max(0, 30 + k * 3) * 0.45 * 0 + (30 + k * 3) * 0.45 + 0.05, 5, 3.2, 0.1) for k in range(0, 1)], ASPH, 'road0')
    # 坂道（x=0 を高台へ）
    road = mbar([((0, -44, 0.05), (0, HILL_Y - 80, 80 * 0.45 + 0.05), 2.5)], hexc('#4a4a4e'), 'slope', segs=4)
    msph([(0, -44 - k * 14, (max(0, HILL_Y - (-44 - k * 14))) * 0.45 + 4.5, 0.25) for k in range(7)], (1.0, 0.85, 0.55), 'slamp', sub=1)
    box((20, HILL_Y - 70, 70 * 0.45 + 2.5), (16, 10, 5), hexc('#d6d2c8'))  # 高台の避難所
    litw = [w for w in H['wins'] if w.data.materials and w.data.materials[0].diffuse_color[0] > 0.9]
    H['litw'] = litw
    if out_f is not None:
        for w in litw:
            vanish(w, out_f)
        for o in bpy.data.objects:
            if o.name.startswith('slamp'):
                vanish(o, out_f)
    return H


def slope_z(y):
    return max(0.0, (HILL_Y - y)) * 0.45


def nKochiNight(n):  # その夜。高知の海沿いの町は、まだ一度も揺れていない
    kochi(n)
    star_dome(n, k=120, seed=3, size=(0.8, 1.8))
    cam = camera(30)
    cam_path(cam, [(0, (40, 90, 22), (0, -10, 2)), (1, (34, 84, 20), (0, -14, 2))], n)
    return NB('night', insects=0.4)


def family_up(n, rnd, k=4, f0=1, y0=-36, speed=1.4, lights=True):
    out = []
    for i in range(k):
        s = 1.0 if i < 2 else 0.6
        p = crowd_person((rnd.uniform(-1.5, 1.5), y0 - i * 1.2, 0), rnd, s=s, name=f'fm{i}')
        y1 = y0 - speed * n / FPS
        move(p, [(f0, (p.location.x, y0 - i * 1.2, slope_z(y0 - i * 1.2))), (n, (p.location.x, y1 - i * 1.2, slope_z(y1 - i * 1.2)))])
        if lights and i < 2:
            flashlight(p, 1, beam=5, a=0.18)
        out.append(p)
    return out


def nFamilyHill(n):  # 高台へ向かう家族もいる
    kochi(n, seed=152)
    family_up(n, random.Random(153), k=4, y0=-46)
    cam = camera(30)
    cam_path(cam, [(0, (10, -46, 5), (0, -80, 12)), (1, (10, -52, 7), (0, -86, 14))], n)
    return NB('night', insects=0.4)


def nLightsStay(n):  # けれど、町の明かりの多くは、消えない
    kochi(n, lit=0.7, seed=154)
    cam = camera(32)
    cam_path(cam, [(0, (-30, HILL_Y - 60, 42), (0, -10, 0)), (1, (-24, HILL_Y - 56, 40), (0, -6, 0))], n)
    return NB('night', insects=0.5)


def night_room(n, seed=161, lamp=True):
    s = bpy.context.scene
    sky(hexc('#0b1020')); s.view_settings.exposure = 0.2; no_shadow()
    light_dir((0.2, -0.3, 0.9))
    interior_box(7, 6, 2.5, hexc('#b48a63'), hexc('#efe4cf'))
    box((-3.45, 0.5, 1.5), (0.05, 1.8, 1.2), hexc('#101828'))  # 夜の窓
    if lamp:
        ball((2.6, 2.4, 1.9), 0.25, (1.0, 0.86, 0.55), seg=12, name='lamp')
    return random.Random(seed)


def nWorkPrep(n):  # 明日も仕事がある人（夜、翌日の支度をする）
    rnd = night_room(n)
    table((0, 1.2, 0), w=1.6, d=0.8)
    box((0.3, 1.2, 0.85), (0.5, 0.3, 0.25), hexc('#3a3a3a'))  # かばん
    box((-0.4, 1.2, 0.76), (0.45, 0.35, 0.03), hexc('#f2f2ee'))  # シャツ
    p = person((0, 0.5, 0), hexc('#e8e2d6'), skin=SKIN[1], name='worker', act='type', rot_z=0)
    cam = camera(32)
    cam_path(cam, [(0, (-2.6, -2.4, 1.7), (0, 0.9, 0.9)), (1, (-2.2, -2.0, 1.6), (0, 0.9, 0.9))], n)
    return NB('room')


def nCareBed(n):  # 寝たきりの家族を、動かせない人
    rnd = night_room(n, seed=162)
    hosp_bed((0.8, 1.0, 0), rot_z=0, patient=hexc('#c8d8e8'))
    p = person((-0.6, 0.6, 0), hexc('#7a5a8a'), skin=SKIN[0], pose='sit', rot_z=-math.pi / 2, name='carer')
    box((-0.6, 0.6, 0.22), (0.5, 0.5, 0.44), hexc('#6a5040'))
    cam = camera(32)
    cam_path(cam, [(0, (-2.6, -2.2, 1.7), (0.3, 1.0, 0.6)), (1, (-2.3, -1.9, 1.6), (0.3, 1.0, 0.6))], n)
    return NB('room')


def draw_tv_far():
    return draw_news('ニュース', ['東の半分で大きな地震', '各地の被害の状況'], alert=False)


def nTVCalm(n):  # 揺れたのは、自分の町ではないと思う人
    ps = living_tv(n, 'nk_news_far', draw_tv_far(), people=2, night=True, seed=163)
    for o in bpy.data.objects:
        if o.name.startswith('box') and False:
            pass
    cam = camera(30)
    cam_path(cam, [(0, (-2.6, -3.0, 1.5), (0, 0.8, 1.0)), (1, (-2.2, -2.6, 1.45), (0, 0.8, 1.0))], n)
    return NB('room')


def nHousesLit(n):  # 多くの人が、家に残る
    kochi(n, lit=0.75, seed=164)
    cam = camera(30)
    cam_path(cam, [(0, (-60, -10, 18), (10, -20, 2)), (1, (-54, -12, 17), (14, -22, 2))], n)
    return NB('night', insects=0.5)


def nCalmSea(n):  # 海は、静か
    night_light('#0b1020', -0.05)
    plane((0, 0, 0), (4000, 4000), hexc('#14202e'), name='sea')
    star_dome(n, k=200, seed=5, size=(0.8, 1.8))
    ball((0, 900, 160), 18, (0.95, 0.93, 0.85), seg=24, name='moon')
    rnd = random.Random(165)
    items = [(rnd.gauss(0, 6), rnd.uniform(40, 800), 0.03, rnd.uniform(1, 4), 0.3, 0.02) for _ in range(160)]
    o = mbox(items, (0.6, 0.62, 0.6), 'glint')
    bob(o, n, amp=0.05, period=50)
    cam = camera(32)
    cam_path(cam, [(0, (0, -20, 4), (0, 300, 20)), (1, (0, -10, 4), (0, 300, 20))], n)
    return NB('sea')


def nEerie(n):  # まるで、これから大変なことが起こる前兆のような、不気味な静けさ
    kochi(n, lit=0.6, seed=166)
    star_dome(n, k=120, seed=3, size=(0.8, 1.8))
    cam = camera(26)
    cam_path(cam, [(0, (0, 160, 5), (0, -10, 4)), (1, (0, 120, 5), (0, -10, 4))], n)
    return NB('sea')


# ---------------- SCENE 17 32時間後（章16） ----------------
def nPreDawn(n):  # 最初の地震から、三十二時間後。夜明け前
    kochi(n, lit=0.12, seed=171, dawn=True)
    cam = camera(30)
    cam_path(cam, [(0, (40, 80, 20), (0, -12, 2)), (1, (36, 76, 19), (0, -14, 2))], n)
    return NB('night')


def nMapWest(n):  # 西の半分のプレートが、動く。二回目の、巨大地震
    japan_map()
    zone('east', rgb=(0.6, 0.3, 0.3), a=0.3)
    zone('west', a=0.65, f0=int(n * 0.1), grow_dur=24)
    pulse_rings(MP(133.5, 32.6), n, int(n * 0.2), period=24, r1=14, a=0.2)
    cam = map_cam(n, (133.8, 32.6, 74), (133.6, 32.8, 66))
    shake(cam, int(n * 0.2), n, amp=0.2, rot=0.004, seed=4)
    return NB('silent', rumble=[(int(n * 0.2), n, 0.6)])


def nQuake2(n):  # 二回目の巨大地震（暗い町が揺れる）
    H = kochi(n, lit=0.12, seed=172, dawn=True)
    for r in H['houses'][::4]:
        jitter(r, 1, n, amp=0.08, rot=0.02, seed=int(r.location.x))
    cam = camera(28)
    cam_path(cam, [(0, (20, -2, 4), (-10, -14, 3)), (1, (18, -2, 4), (-12, -14, 3))], n)
    shake(cam, 2, n, amp=0.3, rot=0.03, seed=8, ramp=3)
    return NB('night', rumble=[(1, n, 1.0)], crash=[(2, 1.0)])


def nWakeUp(n):  # 家で眠っていた人たちが、暗闇の中で、飛び起きる
    rnd = night_room(n, seed=173, lamp=False)
    exposure_keys([(1, -0.3)])
    box((0.5, 1.0, 0.08), (1.6, 2.2, 0.16), hexc('#e9e4da'))  # 布団
    f = int(n * 0.2)
    ly = person((0.5, 1.4, 0.15), hexc('#8fa3b8'), pose='lie', rot_z=math.pi, name='sleeper')
    lie_fix(ly)
    visible(ly, None, f)
    st = person((0.5, 0.7, 0.1), hexc('#8fa3b8'), pose='sit', rot_z=0, name='woke')
    visible(st, f, None)
    hand_chest(st, 1)
    ph = phone_glow((0.9, 0.2, 0.2), r=0.06, f=f + 6)
    cam = camera(30)
    cam_path(cam, [(0, (-2.4, -2.0, 1.4), (0.5, 1.0, 0.4)), (1, (-2.2, -1.8, 1.4), (0.5, 1.0, 0.5))], n)
    shake(cam, f - 6, n, amp=0.06, rot=0.02, seed=9, ramp=3)
    return NB('room', rumble=[(f - 6, n, 1.0)])


def nLightsOut2(n):  # 町の明かりが、一斉に消える
    kochi(n, lit=0.5, seed=174, dawn=True, out_f=int(n * 0.3))
    cam = camera(30)
    cam_path(cam, [(0, (-30, HILL_Y - 60, 42), (0, -10, 0)), (1, (-28, HILL_Y - 58, 41), (0, -8, 0))], n)
    shake(cam, 1, n, amp=0.25, rot=0.01, seed=10, ramp=2)
    return NB('night', rumble=[(1, n, 0.8)])


def nPhoneGlow(n):  # スマホが、もう一度、一斉に鳴り出す（暗い町にスマホの光）
    H = kochi(n, lit=0.0, seed=175, dawn=True)
    exposure_keys([(1, 0.0)])
    rnd = random.Random(176)
    for i in range(70):
        phone_glow((rnd.uniform(-60, 60), rnd.uniform(-42, -2), rnd.uniform(0.5, 4.5)), r=0.35, f=rnd.randint(2, int(n * 0.4)))
    cam = camera(30)
    cam_path(cam, [(0, (-30, HILL_Y - 60, 42), (0, -14, 0)), (1, (-26, HILL_Y - 56, 40), (0, -14, 0))], n)
    return NB('night', alert=[3])


# ---------------- SCENE 18 暗闇の坂道（章17） ----------------
def kochi_wave(n, f0, f1, y0=500, y1=60, h=30.0, flood_z=None, seed=181, out=True, **kw):
    H = kochi(n, lit=0.0, seed=seed, dawn=True, **kw)
    w = wave_wall(-500, 500, y0, h, c=hexc('#3a4a56'))
    move_y(w, [(1, y0), (max(2, f0), y0), (f1, y1)])
    linear(w, 'location')
    if flood_z:
        ff0, ff1, z0, z1 = flood_z
        flood((0, 0, 0), (1000, 1000), z0, z1, ff0, ff1, c=hexc('#2e3330'))
    return H


def nOffshoreWall(n):  # 沖から、波が来る
    kochi_wave(n, 1, n, y0=900, y1=420, h=30)
    cam = camera(50)
    cam_path(cam, [(0, (0, -30, 26), (0, 500, 14)), (1, (0, -30, 26), (0, 480, 16))], n)
    return NB('sea', roar=[(1, n, 0.5)])


def nWave34(n):  # 高知の海岸に来る波は、高い所で、三十四メートル。十階建てのビルより高い波（比べる模型）
    s = bpy.context.scene
    sky(hexc('#2a3444')); s.view_settings.exposure = 0.35; no_shadow()
    plane((0, 0, 0), (600, 600), hexc('#4a4e52'))
    b = tower((-14, 0, 0), 14, 12, 30.0, hexc('#d6d2c8'), lit=0.0)
    text3d('10階建て', (-14, -7, 31.5), 2.4, (1, 1, 1))
    j_house((-34, 0, 0), name='ref')
    w = wave_wall(0, 30, 0, 34.0, c=hexc('#4a6070'), depth=14)
    w.location = (0, 0, 0)
    w.scale = (1, 1, 0.01); w.keyframe_insert('scale', frame=1); w.keyframe_insert('scale', frame=max(2, int(n * 0.1)))
    w.scale = (1, 1, 1); w.keyframe_insert('scale', frame=int(n * 0.55))
    mbar([((14, -8, 34), (22, -8, 34), 0.12)], (1, 0.4, 0.35), 'mark')
    text3d('34m', (26, -8, 33), 3.0, (1, 0.5, 0.45))
    cam = camera(30)
    cam_path(cam, [(0, (0, -90, 18), (0, 0, 17)), (1, (0, -84, 18), (0, 0, 17))], n)
    return NB('sea', roar=[(int(n * 0.1), n, 0.6)])


def flash_crowd(n, rnd, k=24, y0=(-44, -30), speed=(2.6, 3.4), f0=1, lights=0.6):
    out = []
    for i in range(k):
        x = rnd.uniform(-3, 3); y = rnd.uniform(*y0)
        p = crowd_person((x, y, slope_z(y)), rnd, name=f'fc{i}')
        sp = rnd.uniform(*speed)
        y1 = y - sp * n / FPS
        pts = [(x, y, slope_z(y))]
        for k_ in range(1, 7):
            yy = y + (y1 - y) * k_ / 6
            pts.append((x, yy, slope_z(yy)))
        run_to(p, pts, f0 + rnd.randint(0, 8), speed=sp)
        if rnd.random() < lights:
            flashlight(p, 1, beam=6, a=0.16)
        out.append(p)
    return out


def nFlashSlope(n):  # 真っ暗な町で、人々は、懐中電灯の光を頼りに、坂道を駆け上がる
    kochi(n, lit=0.0, seed=182, dawn=True)
    exposure_keys([(1, 0.1)])
    flash_crowd(n, random.Random(183), k=22, y0=(-60, -40))
    cam = camera(28)
    cam_path(cam, [(0, (5, -30, 8), (0, -70, 10)), (1, (5, -42, 13), (0, -84, 16))], n)
    return NB('night', roar=[(1, n, 0.4)])


def nWaveBehind(n):  # 背中で、波の音が、大きくなっていく（坂の上から：光の列と、迫る白い線）
    kochi_wave(n, 1, n, y0=420, y1=120, h=30, seed=184)
    flash_crowd(n, random.Random(185), k=26, y0=(-64, -42))
    cam = camera(28)
    cam_path(cam, [(0, (14, HILL_Y - 90, 70), (0, 20, 0)), (1, (12, HILL_Y - 86, 66), (0, 30, 0))], n)
    return NB('night', roar=[(1, n, 0.8)])


def hilltop_people(n, rnd, k=18, y=HILL_Y - 62):
    out = []
    for i in range(k):
        x = rnd.uniform(-12, 12); yy = y + rnd.uniform(-4, 4)
        p = crowd_person((x, yy, slope_z(yy)), rnd, rot_z=math.pi + rnd.uniform(-0.4, 0.4), name=f'ht{i}')
        if i % 5 == 0:
            hand_chest(p, 1)
        out.append(p)
    return out


def nHilltopLook(n):  # 高台にたどり着いた人たちは、振り返って、町が波にのまれていくのを、呆然と見るしかない
    kochi_wave(n, 1, int(n * 0.5), y0=140, y1=-30, h=22, flood_z=(int(n * 0.35), n, -0.5, 12.0), seed=186)
    hilltop_people(n, random.Random(187))
    y = HILL_Y - 62
    cam = camera(28)
    cam_path(cam, [(0, (6, y - 8, slope_z(y - 8) + 3.0), (0, 0, 2)), (1, (4, y - 7, slope_z(y - 7) + 3.0), (0, 0, 4))], n)
    return NB('night', roar=[(1, n, 1.0)])


def nTownEngulf(n):  # 自分の家や故郷が、一瞬で、津波に飲み込まれる（人のいない家と町）
    kochi_wave(n, 1, int(n * 0.35), y0=120, y1=-40, h=24, flood_z=(int(n * 0.2), int(n * 0.8), -0.5, 14.0), seed=188)
    flow_streaks(n, -80, 80, -60, 40, 0.0, dirv=(0, -1), speed=6, c=hexc('#6a6e68'))
    cam = camera(30)
    cam_path(cam, [(0, (-50, HILL_Y - 40, 40), (0, -10, 0)), (1, (-46, HILL_Y - 36, 38), (0, -14, 0))], n)
    return NB('sea', roar=[(1, n, 1.0)])


def nEarlyEvac(n):  # 一回目の知らせで、逃げていた人（高台の避難所）
    kochi(n, lit=0.0, seed=189, dawn=True)
    rnd = random.Random(190)
    y = HILL_Y - 70
    for i in range(14):
        p = crowd_person((20 + rnd.uniform(-8, 8), y - 7 + rnd.uniform(-2, 1), slope_z(y - 7)), rnd, rot_z=rnd.uniform(-1, 1) + math.pi, pose=rnd.choice(['stand', 'sit']), name=f'ev{i}')
    msph([(20 + k * 3 - 6, y - 5.1, slope_z(y) + 3.8, 0.3) for k in range(5)], (1.0, 0.86, 0.55), 'evlamp', sub=1)
    cam = camera(30)
    cam_path(cam, [(0, (6, y - 24, slope_z(y - 24) + 4), (20, y, slope_z(y) + 2)), (1, (8, y - 22, slope_z(y - 22) + 4), (20, y, slope_z(y) + 2))], n)
    return NB('night')


def nStayedHouses(n):  # 家に、残った人（明かりの消えた家並みに、水が上がる）
    H = kochi(n, lit=0.0, seed=191, dawn=True)
    flood((0, 0, 0), (1000, 1000), 0.0, 6.5, 1, n, c=hexc('#2e3330'))
    flow_streaks(n, -60, 60, -50, 20, 0.0, dirv=(0, -1), speed=5, c=hexc('#5a5e58'))
    for o in [o for o in bpy.data.objects if o.name.startswith('streak')]:
        pass
    cam = camera(30)
    cam_path(cam, [(0, (-24, -10, 9), (0, -26, 3)), (1, (-22, -12, 9), (2, -28, 3))], n)
    return NB('sea', roar=[(1, n, 0.8)])


def nDawnWater(n):  # 津波は、容赦なく、人の命と街を奪っていく（夜明け、水に沈んだ町）
    s = bpy.context.scene
    H = kochi(n, lit=0.0, seed=192, dawn=True)
    sky_keys([(1, hexc('#1a2436')), (n, hexc('#5a6a80'))])
    exposure_keys([(1, 0.0), (n, 0.25)])
    flood((0, 0, 0), (1000, 1000), 9.0, 9.0, 1, n, c=hexc('#3a3e3a'))
    debris_field(n, -80, 80, -50, 30, 9.05, dirv=(0.3, 1), speed=0.8, k=140)
    hilltop_people(n, random.Random(193), k=10)
    cam = camera(28)
    cam_path(cam, [(0, (-30, HILL_Y - 66, 44), (0, 10, 4)), (1, (-24, HILL_Y - 64, 46), (0, 20, 4))], n)
    return NB('sea')


# ---------------- SCENE 19 もう一度揺れる焼津（章18） ----------------
def yaizu_damaged(n, seed=201, ff=True, dawn=True):
    if dawn:
        day_light('#8fa0b4', 0.3)
    else:
        day_light('#a9b8c8', 0.4)
    plane((0, 0, 0), (600, 600), hexc('#8a8270'), name='ground')
    rnd = random.Random(seed)
    hs = []
    for i in range(-5, 6):
        for j in range(3):
            if (i, j) == (0, 0):
                continue
            r, _ = j_house((i * 11 + rnd.uniform(-1, 1), 10 + j * 12, 0), rnd=rnd, name=f'yd{i}_{j}')
            r.rotation_euler = (rnd.uniform(-0.05, 0.05), rnd.uniform(-0.06, 0.06), rnd.uniform(-0.1, 0.1))
            hs.append(r)
    for k in range(6):
        rubble((rnd.uniform(-50, 50), rnd.uniform(2, 30), 0), k=30, spread=(3, 2), seed=k)
    plane((0, 0, 0.02), (600, 6), ASPH)
    return hs


def nYaizuShake2(n):  # 一回目の地震で揺れた焼津の町も、もう一度、激しく揺れる
    hs = yaizu_damaged(n)
    for r in hs[::2]:
        jitter(r, 1, n, amp=0.1, rot=0.02, seed=int(r.location.x * 3))
    cam = camera(30)
    cam_path(cam, [(0, (-24, -26, 10), (0, 10, 2)), (1, (-20, -24, 9), (0, 12, 2))], n)
    shake(cam, 1, n, amp=0.3, rot=0.02, seed=11, ramp=2)
    return NB('city', rumble=[(1, n, 1.0)])


def nHouseFall2(n):  # 傾いていた家が、二回目の揺れで、音を立てて崩れ落ちる
    yaizu_damaged(n, seed=202)
    r, up, g = old_house((0, 10, 0))
    r.rotation_euler.y = 0.1
    f2 = int(n * 0.35)
    jitter(r, 1, f2, amp=0.1, rot=0.02, seed=3)
    g.keyframe_insert('scale', frame=1); g.keyframe_insert('scale', frame=f2)
    g.scale = (1.0, 1.0, 0.1); g.keyframe_insert('scale', frame=f2 + 8)
    up.keyframe_insert('location', frame=1); up.keyframe_insert('location', frame=f2)
    up.location.z = 0.4; up.keyframe_insert('location', frame=f2 + 8)
    up.keyframe_insert('rotation_euler', frame=f2)
    up.rotation_euler = (0.08, -0.16, 0.05); up.keyframe_insert('rotation_euler', frame=f2 + 8)
    dust(n, (0, 8, 0.5), f2 + 4, k=14, r=(0.4, 0.9), a=0.3, seed=4)
    cam = camera(30)
    cam_path(cam, [(0, (-10, -12, 3.5), (0, 10, 3)), (1, (-8, -10, 3.2), (0, 10, 2.5))], n)
    shake(cam, 1, n, amp=0.15, rot=0.012, seed=12, ramp=2)
    return NB('city', rumble=[(1, n, 0.9)], crash=[(f2, 1.0)])


def rescue_site(n, f_back=None, seed=203, wait=False):
    hs = yaizu_damaged(n, seed=seed)
    r, up, g = old_house((0, 10, 0))
    g.scale = (1, 1, 0.12); up.location.z = 0.45; up.rotation_euler = (0.05, -0.12, 0.03)
    rubble((0, 4, 0), k=40, spread=(4, 2), seed=seed)
    rnd = random.Random(seed)
    ps = []
    for i in range(6):
        x = -5 + i * 2.0; y = 2.0 + rnd.uniform(-0.5, 0.5)
        p = firefighter((x, y, 0), rnd, rot_z=math.pi if not wait else math.pi + rnd.uniform(-0.3, 0.3), name=f'ff{i}')
        if f_back is not None:
            move(p, [(1, (x, y, 0)), (f_back + i * 3, (x, y, 0)), (f_back + i * 3 + 40, (x + rnd.uniform(-1, 1), y - 7, 0))])
        elif wait:
            p.location.y -= 7
        ps.append(p)
    return ps


def nFireBack(n):  # がれきの下から人を助け出そうとしていた消防の人たちは、崩れかけた建物から離れるしかない
    rescue_site(n, f_back=int(n * 0.25))
    cam = camera(30)
    cam_path(cam, [(0, (12, -14, 4), (0, 4, 1.5)), (1, (10, -12, 3.8), (0, 2, 1.5))], n)
    shake(cam, int(n * 0.15), int(n * 0.6), amp=0.12, rot=0.01, seed=13)
    return NB('city', rumble=[(int(n * 0.15), int(n * 0.6), 0.6)])


def nWaitRubble(n):  # 余震が続くあいだ、がれきの前で、ただ待つことしかできない
    rescue_site(n, wait=True, seed=204)
    cam = camera(32)
    cam_path(cam, [(0, (-3, -12, 2.0), (0, 6, 1.6)), (1, (-2, -11, 2.0), (0, 6, 1.6))], n)
    shake(cam, int(n * 0.5), int(n * 0.7), amp=0.06, rot=0.006, seed=14)
    return NB('city', rumble=[(int(n * 0.5), int(n * 0.7), 0.3)])


# ---------------- SCENE 20 届かない映像（章19） ----------------
TOWNS = ['しおかぜ町', 'みさき町', 'はまなす村', 'うらなみ町', 'あさひ浜町', 'こなぎ村', 'いそべ町', 'ひがた町', 'つばき浦町', 'なぎさ村']


def draw_disaster(im, d):
    W, H = im.size
    d.rectangle((0, 0, W, H), fill=(22, 34, 58))
    d.rectangle((0, 0, W, 150), fill=(40, 60, 100))
    d.text((50, 26), '災害情報', font=_font(96), fill=(255, 255, 255))
    for k in range(3):
        x = 80 + k * 600
        d.rectangle((x, 230, x + 540, 560), fill=(50, 54, 62))
        d.text((x + 150, 360), '映像なし', font=_font(64), fill=(170, 175, 185))
    d.text((80, 640), '被害の大きい地域から、映像が届いていません', font=_font(62), fill=(240, 240, 240))


def draw_town_list(im, d):
    W, H = im.size
    d.rectangle((0, 0, W, H), fill=(22, 34, 58))
    d.rectangle((0, 0, W, 150), fill=(200, 30, 30))
    d.text((50, 26), '連絡が取れない市町村', font=_font(90), fill=(255, 255, 255))
    for i, t in enumerate(TOWNS):
        d.text((120 + (i // 5) * 860, 220 + (i % 5) * 150), t, font=_font(80), fill=(240, 240, 240))
    d.text((60, H - 90), '※ 架空の表示', font=_font(40), fill=(160, 165, 175))


def nTVDisaster(n):  # 東京では、テレビが一日中、災害情報を伝える
    living_tv(n, 'nk_disaster', draw_disaster, people=2, seed=211)
    cam = camera(30)
    cam_path(cam, [(0, (-1.8, -3.2, 1.6), (0, 3.2, 1.3)), (1, (-1.4, -2.8, 1.55), (0, 3.2, 1.3))], n)
    return NB('room')


def nNoFootage(n):  # けれど、被害が一番大きい町ほど、映像が届かない
    living_tv(n, 'nk_disaster', draw_disaster, people=0, seed=212)
    cam = camera(40)
    cam_path(cam, [(0, (0, 0.6, 1.35), (0, 3.2, 1.35)), (1, (0, 1.0, 1.35), (0, 3.2, 1.35))], n)
    return NB('room')


def nNoSignal(n):  # 電話も、ネットも、つながらない（明かりの消えた携帯の基地局と、つながらないスマホ）
    night_light('#141a26', 0.1)
    plane((0, 0, 0), (600, 600), hexc('#3a3c36'))
    root = empty((0, 20, 0), 'mast')
    link(box((0, 0, 15), (1.2, 1.2, 30), hexc('#8a8a86')), root)
    for a in (0, 2.1, 4.2):
        link(box((math.sin(a) * 1.2, -math.cos(a) * 1.2, 28), (0.4, 0.2, 2.4), hexc('#d8d8d4'), rot=(0, 0, a)), root)
    lamp = ball((0, 20, 30.6), 0.4, (1.0, 0.2, 0.15), seg=10, name='mlamp'); vanish(lamp, int(n * 0.2))
    rubble((0, 10, 0), k=30, spread=(6, 3), seed=5)
    yaizu_damaged.__call__  # noqa
    cam = camera(30)
    cam_path(cam, [(0, (8, -14, 3), (0, 20, 18)), (1, (6, -12, 3), (0, 20, 20))], n)
    return NB('night')


def nTownList(n):  # 画面には、連絡が取れない町の名前が、並び続ける（架空の表示）
    living_tv(n, 'nk_townlist', draw_town_list, people=0, seed=213)
    cam = camera(40)
    cam_path(cam, [(0, (0, 0.4, 1.35), (0, 3.2, 1.35)), (1, (0, 0.8, 1.35), (0, 3.2, 1.35))], n)
    return NB('room')


def nHeliGround(n):  # 夜は暗く、ヘリコプターも、飛べない
    night_light('#0b1020', 0.05)
    plane((0, 0, 0), (600, 600), hexc('#2e3034'))
    plane((0, 0, 0.02), (80, 50), hexc('#45474c'))
    rnd = random.Random(214)
    for k, x in enumerate((-20, 0, 20)):
        cyl((x, 0, 0.03), 7, 0.02, hexc('#e8e2d0'), verts=32)
        h, rot = helicopter((x, 0, 0), rot_z=rnd.uniform(-0.3, 0.3), name=f'hl{k}')
        rot.rotation_euler.z = rnd.uniform(0, 1.5)
    for i in range(3):
        p = worker((-10 + i * 8, -12, 0), rnd, rot_z=math.pi + rnd.uniform(-0.5, 0.5), name=f'hw{i}')
    box((0, 40, 6), (60, 10, 12), hexc('#4a4e56'))
    cam = camera(30)
    cam_path(cam, [(0, (-26, -40, 10), (0, 0, 2)), (1, (-22, -38, 9), (0, 0, 2))], n)
    return NB('night', wind=1)


# ---------------- SCENE 21 土砂のダム（章20） ----------------
def valley_h(x, y):
    return min(60.0, 0.0045 * x * x * (1 + 0.15 * math.sin(y * 0.03)) + 0.12 * y + 6)


def kii_valley(n, slide_f=None, dam=False, lake=None, village=True, seed=221):
    day_light('#a9bdd0', 0.42)
    terrain((360, 400), 72, valley_h, hexc('#5f7a48'), 'valley', x0=-180, y0=-200)
    rnd = random.Random(seed)
    pts = [(rnd.uniform(-170, 170), rnd.uniform(-190, 190)) for _ in range(220)]
    ever_trees([(x, y, valley_h(x, y)) for x, y in pts if abs(x) > 14], seed=seed, s=(1.6, 2.6))
    # 川（谷底 x=0）
    rv = box((0, 0, 0), (8, 400, 0.4), hexc('#5f8fb0'))
    rv.rotation_euler.x = math.atan(0.12)
    rv.location.z = 6.3
    out = {}
    if slide_f is not None or dam:
        # 崩れる斜面のかたまり（x>0 の斜面、y=40）
        blob = msph([(30, 40, valley_h(30, 40) + 2, 22, 1.0, 1.2, 0.45)], hexc('#8a6a48'), 'slide', sub=2, smooth=True)
        if dam:
            blob.location = (-30, 0, -valley_h(30, 40) + valley_h(0, 40) + 2)
            blob.scale = (1.3, 1.0, 1.1)
        else:
            blob.keyframe_insert('location', frame=1); blob.keyframe_insert('location', frame=max(2, slide_f))
            blob.location = (-30, 0, -valley_h(30, 40) + valley_h(0, 40) + 2); blob.keyframe_insert('location', frame=slide_f + 30)
            blob.keyframe_insert('scale', frame=slide_f)
            blob.scale = (1.3, 1.0, 1.1); blob.keyframe_insert('scale', frame=slide_f + 30)
            dust(n, (10, 40, valley_h(10, 40) + 4), slide_f + 6, k=16, r=(3, 6), seed=6, c=hexc('#a8987c'))
        out['blob'] = blob
    if lake:
        f0, f1, z0, z1 = lake
        L = water((0, 120, 0), (120, 150), z0, z1, f0, f1, c=hexc('#6a7e7a'), a=0.95)
        out['lake'] = L
    if village:
        for k in range(8):
            x = rnd.uniform(-30, 30); y = rnd.uniform(-170, -120)
            if abs(x) < 6:
                x += 10
            j_house((x, y, valley_h(x, y) - 0.5), rnd=rnd, name=f'kv{k}')
    return out


def nKiiMount(n):  # 被害は、海沿いだけではない（紀伊半島の山あい）
    kii_valley(n)
    cam = camera(30)
    cam_path(cam, [(0, (-60, -200, 70), (0, 40, 10)), (1, (-50, -190, 66), (0, 50, 10))], n)
    return NB('wind')


def nSlopeFall(n):  # 紀伊半島の山あいでは、山の斜面が、丸ごと崩れ落ちる
    kii_valley(n, slide_f=int(n * 0.2), village=False)
    cam = camera(30)
    cam_path(cam, [(0, (-90, -50, 75), (10, 40, 16)), (1, (-86, -46, 72), (6, 40, 14))], n)
    shake(cam, int(n * 0.2), int(n * 0.5), amp=0.3, rot=0.006, seed=15)
    return NB('wind', rumble=[(int(n * 0.2), int(n * 0.6), 0.8)], crash=[(int(n * 0.25), 0.8)])


def nDamForm(n):  # 崩れた土砂は、谷を流れる川をせき止め、大きなダムのようになる
    kii_valley(n, dam=True, lake=(1, n, 6, 14), village=False)
    cam = camera(30)
    cam_path(cam, [(0, (-60, -10, 50), (0, 70, 10)), (1, (-54, -4, 48), (0, 80, 10))], n)
    return NB('wind')


def nLakeRise(n):  # せき止められた水は、一日ごとに、水位を上げていく（早回し）
    kii_valley(n, dam=True, lake=(1, n, 12, 26), village=False)
    k = 4
    sky_keys([(1 + int(i * n / k), hexc('#a9bdd0') if i % 2 == 0 else hexc('#2a3448')) for i in range(k + 1)])
    exposure_keys([(1 + int(i * n / k), 0.42 if i % 2 == 0 else -0.1) for i in range(k + 1)])
    cam = camera(30)
    cam_path(cam, [(0, (60, 20, 50), (0, 100, 14)), (1, (58, 24, 48), (0, 104, 16))], n)
    return NB('wind')


def nDownstream(n):  # このダムが切れれば、たまった水は、土砂と一緒に、下流の村へ一気に押し寄せる
    kii_valley(n, dam=True, lake=(1, n, 22, 24))
    arrow = mcone([(0, -40, valley_h(0, -40) + 3, 3, 10, math.pi / 2, 0)], (1.0, 0.3, 0.25), 'arrow')
    mbar([((0, 20, valley_h(0, 20) + 3), (0, -36, valley_h(0, -36) + 3), 1.2)], (1.0, 0.3, 0.25), 'arrowbar')
    cam = camera(28)
    cam_path(cam, [(0, (-90, 60, 110), (0, -80, 0)), (1, (-86, 56, 104), (0, -90, 0))], n)
    return NB('wind')


def nVillageLeave(n):  # いつ切れるか分からない土砂のダムの下で、下流の村の人たちは、家を離れる
    kii_valley(n, dam=True, lake=(1, n, 24, 24))
    rnd = random.Random(222)
    for k in range(4):
        y = -130 - k * 9
        c = car_s((0, y, valley_h(0, y)), rot_z=math.pi, name=f'vc{k}')
        y1 = y - 60
        move(c, [(1 + k * 10, (0, y, valley_h(0, y))), (n, (0, y1, valley_h(0, y1)))])
    for i in range(6):
        x = rnd.uniform(-12, 12); y = rnd.uniform(-150, -125)
        p = crowd_person((x, y, valley_h(x, y)), rnd, name=f'vl{i}')
        y1 = y - 1.3 * n / FPS
        move(p, [(1, (x, y, valley_h(x, y))), (n, (x * 0.5, y1, valley_h(x * 0.5, y1)))])
    cam = camera(30)
    cam_path(cam, [(0, (30, -200, 40), (0, -130, 14)), (1, (26, -206, 38), (0, -140, 14))], n)
    return NB('wind')
