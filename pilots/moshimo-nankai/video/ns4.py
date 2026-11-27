"""追加カット（台本の追記 2026-11-27：二回目の巨大地震の怖さ。SCENE 14・16・17・19 ＝ 章13・15・16・18）
けが・遺体・火は描かない。"""
from ns3 import *
from nk import _obj, _font


# ---------------- SCENE 14 の追記（章13）：1週間の避難の呼びかけ ----------------
WEST_PREF = [('和歌山', 135.17, 34.23), ('徳島', 134.56, 34.07), ('高知', 133.53, 33.56)]


def nEvacWeek(n):  # 和歌山、徳島、高知。一度も揺れていない海沿いの町に、一週間、高い所で過ごすよう呼びかけ（地図）
    japan_map(name='nk_map_w', labels=[])
    zone('east', a=0.45)
    pts = pacific_coast(132.4, 135.7, step=0.06)
    for g in range(6):
        o = msph([(*MP(lo, la, 0.5), 0.55) for lo, la in pts[g::6]], (1.0, 0.86, 0.3), 'week', sub=1)
        appear(o, 4 + g * 6, grow=3)
    for k, (t, lo, la) in enumerate(WEST_PREF):
        map_text(t, lo, la + 0.35, size=2.6, rgb=(1, 0.95, 0.7), f=6 + k * int(n * 0.15))
    map_cam(n, (134.2, 33.4, 62), (134.2, 33.6, 56))
    return NB('silent', speaker=[(1, n)])


def kochi_day(n, seed=401, shelter_people=0, **kw):
    """翌日の昼の高知（模式）：揺れていない町。高台の避難所"""
    H = kochi(n, lit=0.0, seed=seed, **kw)
    day_light('#b8cfe4', 0.5)
    return H


def nWeekWait(n):  # 二回目の巨大地震を待つ、一週間が始まる（昼の高知の海と町）
    kochi_day(n, seed=402)
    rnd = random.Random(403)
    street_walkers(n, rnd, k=8, x=(-30, 30), name='ww')
    cam = camera(30)
    cam_path(cam, [(0, (50, 110, 26), (0, -10, 2)), (1, (44, 104, 24), (0, -14, 2))], n)
    return NB('sea')


# ---------------- SCENE 16 の追記（章15）：その夜の焼津、翌日の昼の高知 ----------------
def floodlight(loc, aim, n=None):
    """投光器（三脚の上の明るい板）と、光の円すい"""
    x, y = loc
    mbar([((x + math.cos(a) * 0.6, y + math.sin(a) * 0.6, 0), (x, y, 3.4), 0.04) for a in (0, 2.1, 4.2)], hexc('#5a5e64'), 'fltri')
    ball((x, y, 3.6), 0.35, (1.0, 0.97, 0.85), seg=10, name='flamp')
    d = Vector((aim[0] - x, aim[1] - y, -3.0))
    c = cone((0, 0, 0), 3.0, d.length, (1.0, 0.97, 0.85), verts=16)
    c.data.materials.clear(); c.data.materials.append(gmat((1.0, 0.97, 0.85), 0.12, 'beam'))
    c.location = Vector((x, y, 3.6)) + d / 2
    c.rotation_euler = Vector((0, 0, -1)).rotation_difference(d).to_euler()


def yaizu_night(n, seed=411, diggers=6, dig=True):
    """停電した夜の焼津：投光器の明かりの下で、崩れた家のがれきを掘る消防の人（がれきの下の人は映さない）"""
    yaizu_damaged(n, seed=seed)
    night_light('#0b1020', 0.2)
    r, up, g = old_house((0, 10, 0))
    g.scale = (1, 1, 0.12); up.location.z = 0.45; up.rotation_euler = (0.05, -0.12, 0.03)
    rubble((0, 4, 0), k=50, spread=(4, 2), seed=seed)
    for x in (-7, 7):
        floodlight((x, -2), (0, 5))
    rnd = random.Random(seed)
    ps = []
    for i in range(diggers):
        x = -4 + i * 1.6; y = 2.6 + rnd.uniform(-0.4, 0.4)
        p = firefighter((x, y, 0), rnd, rot_z=math.pi + rnd.uniform(-0.3, 0.3), name=f'fd{i}')
        if dig and i % 2 == 0:
            shovel_arms(p, n, period=30, seed=i)
        ps.append(p)
    return ps


def nYaizuNight(n):  # その夜、焼津。停電した町で、消防の人たちが、投光器の明かりを頼りに、がれきを掘り続ける
    yaizu_night(n)
    cam = camera(28)
    cam_path(cam, [(0, (-16, -16, 7), (0, 5, 1)), (1, (-13, -14, 6.4), (0, 5, 1))], n)
    return NB('night')


def nVoiceRubble(n):  # がれきの下から、声が聞こえるから（耳を澄ます消防の人）
    ps = yaizu_night(n, seed=412, diggers=4, dig=False)
    p = ps[1]
    t = tilt_head(p); look_keys(t, [(1, (0.0, 0, 0)), (int(n * 0.3), (0.5, 0, 0.3)), (n, (0.55, 0, 0.3))])
    hand_chest(ps[2], 1)
    x, y = p.location.x, p.location.y
    cam = camera(38)
    cam_path(cam, [(0, (x + 2.2, y - 3.4, 1.8), (x, y, 1.3)), (1, (x + 1.8, y - 3.0, 1.7), (x, y, 1.3))], n)
    return NB('night')


def tilted_door_house(loc=(0, 6, 0), tilt=0.08, name='tdh'):
    """傾いた家（玄関のある面が手前 -y）。戻り値：(root, 玄関の位置)"""
    rnd = random.Random(7)
    r, wins = j_house(loc, w=8, d=7, rnd=rnd, name=name)
    r.rotation_euler = (tilt * 0.6, tilt, 0)
    for k in range(6):  # 壁のひび
        box((loc[0] - 2 + rnd.uniform(-1.5, 1.5), loc[1] - 3.55, rnd.uniform(0.5, 4.5)), (rnd.uniform(0.6, 1.6), 0.04, 0.06), hexc('#4a4a48'),
            rot=(0, rnd.uniform(-0.8, 0.8), 0))
    return r, (loc[0] + 2.8, loc[1] - 3.6)


def nBlanketHouse(n):  # 傾いた家の前で、住んでいた人が、毛布や薬を取りに、ひびの入った玄関をくぐる（けがは描かない）
    yaizu_damaged(n, seed=413)
    night_light('#0b1020', 0.25)
    r, door = tilted_door_house()
    rnd = random.Random(414)
    p = person((door[0] - 1.5, door[1] - 5, 0), hexc('#7a5a8a'), skin=SKIN[1], name='resident')
    move(p, [(1, (door[0] - 1.5, door[1] - 5, 0)), (int(n * 0.7), (door[0], door[1] - 0.3, 0)), (n, (door[0], door[1] + 0.4, 0))])
    flashlight(p, 1, beam=4, a=0.18)
    cam = camera(32)
    cam_path(cam, [(0, (door[0] - 6, door[1] - 9, 2.4), (door[0], door[1], 1.5)), (1, (door[0] - 5, door[1] - 8, 2.3), (door[0], door[1], 1.5))], n)
    return NB('night')


def nCrackedPillar(n):  # 一回目の揺れで、柱は、もう折れかけている
    s = bpy.context.scene
    sky(hexc('#0b1020')); s.view_settings.exposure = 0.15; no_shadow()
    interior_box(6, 5, 2.6, hexc('#8a6a4a'), hexc('#e6dcc6'))
    pv = pivot((0, 1.0, 0), 0, 'pillar')
    lbox(pv, (0, 0, 1.3), (0.24, 0.24, 2.6), hexc('#7a5a3a'))
    pv.rotation_euler = (0, 0.12, 0)
    mbox([(0.13, 0.88, 1.3 + k * 0.12, 0.04, 0.02, 0.3, 0) for k in range(-2, 3)], hexc('#2a2018'), 'crack')
    box((0, 0, 2.55), (6, 5, 0.1), hexc('#d8ccb4'), rot=(0, 0.04, 0.02))
    beam = cone((-2, -1.5, 1.6), 0.6, 3.0, (1.0, 0.95, 0.75), rot=(0, -1.2, 0.4), verts=16)
    beam.data.materials.clear(); beam.data.materials.append(gmat((1.0, 0.95, 0.75), 0.15, 'beam'))
    jitter(pv, int(n * 0.5), int(n * 0.65), amp=0.01, rot=0.01, seed=3)
    mbox([(RK.uniform(-2, 2), RK.uniform(-1, 2), 0.02, 0.2, 0.15, 0.03) for _ in range(30)], hexc('#cfc4ad'), 'plaster')
    cam = camera(30)
    cam_path(cam, [(0, (-1.6, -2.0, 1.4), (0, 1.0, 1.4)), (1, (-1.3, -1.7, 1.45), (0, 1.0, 1.5))], n)
    return NB('room', rumble=[(int(n * 0.5), int(n * 0.65), 0.2)])


def nKochiNoon(n):  # 翌日の昼。高知の町は、一日たっても、揺れない
    kochi_day(n, seed=421)
    rnd = random.Random(422)
    street_walkers(n, rnd, k=10, x=(-30, 30), name='kn')
    cam = camera(30)
    cam_path(cam, [(0, (-30, HILL_Y - 60, 42), (0, -10, 0)), (1, (-24, HILL_Y - 56, 40), (0, -6, 0))], n)
    return NB('day')


def nShelterLeave(n):  # 高台の避難所で、硬い床に一晩を過ごした人たちが、少しずつ、家へ戻り始める
    kochi_day(n, seed=423)
    rnd = random.Random(424)
    for i in range(14):
        y0 = HILL_Y - 66 + rnd.uniform(-2, 2) + i * 2.2; x = rnd.uniform(-2, 2)
        p = crowd_person((x, y0, slope_z(y0)), rnd, name=f'sl{i}')
        box((0.3, -0.1, 0.65), (0.3, 0.2, 0.4), rnd.choice([hexc('#4a5a7a'), hexc('#c9a26a')])).parent = O[p['rig']]
        y1 = y0 + 1.2 * n / FPS
        move(p, [(1, (x, y0, slope_z(y0))), (n, (x, y1, slope_z(y1)))])
    cam = camera(28)
    cam_path(cam, [(0, (6, HILL_Y - 48, slope_z(HILL_Y - 48) + 3), (0, HILL_Y - 64, slope_z(HILL_Y - 64) + 1)), (1, (6, HILL_Y - 44, slope_z(HILL_Y - 44) + 3), (0, HILL_Y - 58, slope_z(HILL_Y - 58) + 1))], n)
    return NB('day')


def nShutter(n):  # 店を開けなければならない人（シャッターを上げる）
    kochi_day(n, seed=425)
    sx, sy = 0.0, 3.6  # 北側の店の前（店は y=7.2、正面は y=3.7）
    box((sx, sy + 0.1, 1.6), (5.0, 0.2, 3.2), hexc('#3a3e44'))
    sh = box((0, 0, 0), (4.8, 0.08, 2.6), hexc('#b8bcc0'))
    pv = empty((sx, sy - 0.05, 1.3), 'shutter'); sh.parent = pv
    mbox([(0, -0.05, z - 1.3, 4.8, 0.02, 0.03) for z in [0.1 + k * 0.2 for k in range(13)]], hexc('#9aa0a6'), 'slats').parent = pv
    pv.keyframe_insert('location', frame=1); pv.keyframe_insert('location', frame=int(n * 0.3))
    pv.location.z = 3.0; pv.scale.z = 0.2; pv.keyframe_insert('location', frame=int(n * 0.75)); pv.keyframe_insert('scale', frame=int(n * 0.75))
    pv.scale.z = 1.0; pv.keyframe_insert('scale', frame=int(n * 0.3))
    rnd = random.Random(426)
    p = person((sx + 0.6, sy - 0.9, 0), hexc('#3a8a5a'), skin=SKIN[2], rot_z=math.pi, name='owner')
    arm_up(p, 1)
    cam = camera(32)
    cam_path(cam, [(0, (sx - 4, sy - 7, 1.8), (sx, sy, 1.5)), (1, (sx - 3.4, sy - 6.4, 1.8), (sx, sy, 1.6))], n)
    return NB('day')


def nDogHome(n):  # 家に置いてきた犬が、気になる人（玄関で待つ犬）
    s = bpy.context.scene
    sky(hexc('#c8ccd0')); s.view_settings.exposure = 0.45; no_shadow()
    interior_box(6, 5, 2.5, hexc('#b48a63'), hexc('#efe8dc'))
    box((0, 2.45, 1.0), (1.0, 0.08, 2.0), hexc('#6b4f3a'))
    d = dog((0.2, 1.5, 0.0), 'dog_brown', s=1.4, rot_z=math.pi, pose='sit', name='dog')
    bowl((1.0, 1.4, 0.0))
    f = int(n * 0.5)
    door = O['box'] if False else None
    p = person((0, 3.2, 0), hexc('#c46a4a'), skin=SKIN[1], rot_z=math.pi, name='back')
    move(p, [(1, (0, 3.2, 0)), (f, (0, 3.2, 0)), (n, (0.0, 2.2, 0))])
    cam = camera(30)
    cam_path(cam, [(0, (-1.8, -1.8, 1.0), (0.2, 1.6, 0.5)), (1, (-1.5, -1.5, 1.0), (0.2, 1.6, 0.6))], n)
    return NB('room')


def nTVKeikai(n):  # テレビは、「巨大地震警戒」の文字を、映し続けている（架空の画面）
    living_tv(n, 'nk_news_keikai', draw_news('巨大地震警戒', ['南海トラフの西の半分でも', '大きな地震に備えてください']), people=1, seed=427)
    cam = camera(40)
    cam_path(cam, [(0, (0.4, -0.2, 1.4), (0, 3.2, 1.35)), (1, (0.2, 0.4, 1.38), (0, 3.2, 1.35))], n)
    return NB('room')


def nSeaDay(n):  # けれど、海は、何も変わらないように見える
    day_light('#b8cfe4', 0.5)
    plane((0, 0, 0), (4000, 4000), hexc('#4a7a9c'), name='sea')
    plane((0, -60, 0.05), (4000, 80), hexc('#d9cba4'))
    rnd = random.Random(428)
    o = mbox([(rnd.uniform(-200, 200), rnd.uniform(-10, 600), 0.04, rnd.uniform(4, 12), 0.6, 0.03) for _ in range(120)], (0.85, 0.9, 0.92), 'glint')
    bob(o, n, amp=0.05, period=50)
    mbox([(x, -18, 0.06, 30, 1.2, 0.05) for x in range(-300, 301, 34)], FOAM, 'surf')
    cam = camera(30)
    cam_path(cam, [(0, (0, -60, 6), (0, 300, 10)), (1, (0, -50, 6), (0, 300, 10))], n)
    return NB('sea')


# ---------------- SCENE 17 の追記（章16）：あの音・真下の海・同じころの東京 ----------------
def nPhoneClose(n):  # 一日半前に、東の町で鳴った、あの音（暗い寝室で光るスマホ）
    night_room(n, seed=431, lamp=False)
    exposure_keys([(1, -0.2)])
    box((0.3, 0.8, 0.08), (1.6, 2.2, 0.16), hexc('#e9e4da'))
    ph = box((0.2, 0.3, 0.17), (0.08, 0.16, 0.012), hexc('#202226'))
    a = box((0.2, 0.3, 0.178), (0.07, 0.14, 0.004), (1.0, 0.15, 0.1)); b = box((0.2, 0.3, 0.179), (0.07, 0.14, 0.004), (1.0, 0.95, 0.9))
    blink(a, n, 6, 0); blink(b, n, 6, 1)
    p = person((0.3, 0.5, 0.1), hexc('#8fa3b8'), pose='sit', rot_z=0, name='woke2')
    arm_to(p, 1, (-0.1, -0.2, 0.1))
    cam = camera(40)
    cam_path(cam, [(0, (1.5, 0.1, 1.3), (0.2, 0.3, 0.2)), (1, (1.4, 0.15, 1.2), (0.2, 0.3, 0.2))], n)
    return NB('room', alert=[2])


def nMapBelow(n):  # 今度は、自分の町の、真下の海から、揺れが来る（地図：高知の沖）
    japan_map(name='nk_map_w', labels=[])
    zone('west', a=0.7)
    map_text('高知', 133.53, 33.9, size=2.4, rgb=(1, 0.95, 0.7))
    pulse_rings(MP(133.4, 32.9), n, 2, period=20, r1=6, a=0.2)
    cam = map_cam(n, (133.4, 33.1, 34), (133.5, 33.3, 28))
    shake(cam, 1, n, amp=0.15, rot=0.004, seed=21)
    return NB('silent', rumble=[(1, n, 0.6)])


def nShinjukuDawn(n):  # 同じころ、東京。新宿の高いビルが、もう一度、ゆっくりと、しなり始める
    shinjuku(n, sway=(int(n * 0.2), 0.006))
    sky_keys([(1, hexc('#2a3448'))])
    bpy.context.scene.view_settings.exposure = 0.2
    cam = camera(26)
    cam_path(cam, [(0, (-20, -120, 3), (10, 60, 120)), (1, (-14, -110, 3), (10, 60, 140))], n)
    return NB('city', rumble=[(int(n * 0.2), n, 0.3)])


def nOfficeCling(n):  # 帰れずに、会社に泊まり込んでいた人たちが、床に、しがみつく
    H = office_floor(n, seed=432)
    sky(hexc('#3a4458')); bpy.context.scene.view_settings.exposure = 0.25
    below(lambda: skyline(n, cx=0, cy=-420, nx=8, ny=4, pitch=70, hr=(40, 220), seed=433), -150)
    ground(size=2000, rgb=hexc('#5a5a58')).location.z = -150
    fl = H['floor']; rnd = random.Random(434)
    for i in range(8):
        x = rnd.uniform(-10, 10); y = rnd.uniform(-6, 6)
        p = crouch_person((x, y, 0), rnd, rot_z=rnd.uniform(0, 6.28), name=f'cl{i}')
        p.parent = fl
    for i in range(3):
        cardboard_bed((-6 + i * 4, 5.5, 0), rot_z=math.pi / 2).parent = fl
    sway_floor(fl, n, 1, n + 400, amp=0.35, period=110)
    for c in H['chairs']:
        slide(c, n, 1 + rnd.randint(0, 20), [(40, rnd.uniform(-2, 2), rnd.uniform(-1, 1)), (90, rnd.uniform(-2, 2), rnd.uniform(-1, 1)), (160, rnd.uniform(-3, 3), rnd.uniform(-1.5, 1.5))])
    office_cam(n, ((-11, 7, 2.2), (3, -4, 0.4)), ((-10, 6.5, 2.1), (3, -4, 0.4)))
    return NB('room', rumble=[(1, n, 0.35)])


def nElevAgain(n):  # 一回目のあと、やっと動き出したエレベーターが、また、止まる
    shafts_cut(n, stop_f=int(n * 0.55), seed=435)
    sky(hexc('#3a4458'))
    cam = camera(28)
    cam_path(cam, [(0, (24, -150, 50), (0, 0, 58)), (1, (18, -140, 52), (0, 0, 60))], n)
    return NB('silent', crash=[(int(n * 0.55), 0.4)])


# ---------------- SCENE 19 の追記（章18）：玄関から逃げ出す・続く余震・昔の例 ----------------
def nDoorEscape(n):  # 毛布や薬を取りに家へ戻っていた人が、崩れかけた玄関から、必死に外へ逃げ出す（けがは描かない）
    yaizu_damaged(n, seed=441)
    r, door = tilted_door_house(tilt=0.1)
    f = int(n * 0.35)
    jitter(r, 1, n, amp=0.08, rot=0.02, seed=2)
    r.keyframe_insert('rotation_euler', frame=f)
    r.rotation_euler = (0.12, 0.22, 0.02); r.keyframe_insert('rotation_euler', frame=f + 30)
    p = person((door[0], door[1] + 0.3, 0), hexc('#7a5a8a'), skin=SKIN[1], rot_z=0, name='escape')
    box((0.3, -0.1, 0.9), (0.5, 0.3, 0.4), hexc('#8a9ab8')).parent = O[p['rig']]  # 毛布
    run_to(p, [(door[0], door[1] + 0.3, 0), (door[0] - 1, door[1] - 4, 0), (door[0] - 3, door[1] - 10, 0)], int(n * 0.12), speed=3.4)
    dust(n, (door[0], door[1], 1.0), f + 10, k=10, r=(0.4, 0.9), a=0.3, seed=5)
    cam = camera(30)
    cam_path(cam, [(0, (door[0] - 7, door[1] - 11, 2.2), (door[0], door[1] - 2, 1.4)), (1, (door[0] - 6, door[1] - 10, 2.1), (door[0] - 1, door[1] - 4, 1.2))], n)
    shake(cam, 1, n, amp=0.12, rot=0.012, seed=22, ramp=2)
    return NB('city', rumble=[(1, n, 0.8)], crash=[(f + 8, 0.8)])


def nAftershocks(n):  # 二回目のあとも、大きな余震は、昼も夜も、町を揺らす（昼と夜が入れ替わる）
    hs = yaizu_damaged(n, seed=442, dawn=False)
    k = 4
    sky_keys([(1 + int(i * n / k), hexc('#a9b8c8') if i % 2 == 0 else hexc('#0b1020')) for i in range(k + 1)])
    exposure_keys([(1 + int(i * n / k), 0.4 if i % 2 == 0 else -0.2) for i in range(k + 1)])
    cam = camera(28)
    cam_path(cam, [(0, (-24, -26, 10), (0, 12, 2)), (1, (-20, -24, 9), (0, 14, 2))], n)
    for i in range(k):
        f0 = 1 + int(i * n / k) + int(n / k * 0.3)
        shake(cam, f0, f0 + int(n / k * 0.4), amp=0.25, rot=0.015, seed=30 + i, ramp=3)
        for r in hs[i::4]:
            jitter(r, f0, f0 + int(n / k * 0.4), amp=0.06, rot=0.01, seed=i * 13 + int(r.location.x))
    return NB('city', rumble=[(1 + int(i * n / k) + int(n / k * 0.3), 1 + int(i * n / k) + int(n / k * 0.7), 0.6) for i in range(k)])


def nTohokuMemory(n):  # 東日本大震災の時は、ひと月たってから、マグニチュード七を超える余震が来た（回想・地図）
    Wm, Hm = map_size(TOH_R, TOH_K)
    path = map_tex('nk_map_toh', TOH_R, labels=[('仙台', 140.87, 38.27), ('盛岡', 141.15, 39.70)])
    img_plane(path, (0, 0, 0), Wm, Hm, name='map')
    plane((0, 0, -0.05), (Wm * 6, Hm * 6), (0.006, 0.016, 0.04))
    s = bpy.context.scene; sky(hexc('#0c1626')); s.view_settings.exposure = 0.35; no_shadow()
    c = MP(141.6, 38.2, 0.4, R=TOH_R, K=TOH_K)
    pulse_rings(c, n, int(n * 0.25), period=24, r1=14, a=0.25)
    cam = camera(35)
    cam_path(cam, [(0, (0, -Hm * 0.55, Hm * 1.05), (0, 0, 0)), (1, (0, -Hm * 0.5, Hm * 0.98), (0, 2, 0))], n)
    tint_all('gray', 0.5)
    return NB('silent', rumble=[(int(n * 0.25), n, 0.4)])


def nShowaMap(n):  # 昭和の時代には、南海トラフの東と西が、二年の間をあけて、動いた（回想・地図）
    japan_map()
    zone('east', a=0.6, f0=4, grow_dur=18)
    zone('west', a=0.6, f0=int(n * 0.55), grow_dur=18)
    map_text('2年', 135.8, 32.3, size=4.0, rgb=(1, 0.9, 0.75), f=int(n * 0.4))
    tint_all('washi', 0.5)
    map_cam(n, (135.0, 32.9, 80), (135.0, 33.0, 76))
    return NB('silent')


def nNotOver(n):  # 一度揺れたら、終わり、ではない（夕暮れの焼津、また揺れる）
    hs = yaizu_damaged(n, seed=443, dawn=False)
    sky_keys([(1, hexc('#c89a80')), (n, hexc('#5a5070'))])
    cam = camera(26)
    cam_path(cam, [(0, (-40, -50, 26), (0, 12, 2)), (1, (-36, -46, 24), (0, 14, 2))], n)
    shake(cam, int(n * 0.6), n, amp=0.2, rot=0.01, seed=23, ramp=3)
    return NB('city', rumble=[(int(n * 0.6), n, 0.5)])
