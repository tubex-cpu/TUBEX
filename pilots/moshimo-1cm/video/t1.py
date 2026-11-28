"""カット：SCENE 01〜08（章0〜7）。縮尺は tk.py（人 s=1、世界 K=170 倍）"""
from tk import *
from kit import _osc, _blinks


# ---------------- 共通：朝のベッドの上 ----------------
CAT_XY = (100.0, 162.0)
YOU_XY = (100.0, 134.0)


def cat_still(root, n, seed=1, head_amp=0.025):
    """寄りの画の猫：animate_life の大きな首振りを外し、呼吸・まばたき・小さな首の揺れ・ひげだけを付ける"""
    rnd = random.Random(seed)
    root['kind'] = 'cat_macro'
    body = O[root['body']]
    _osc(body, 'scale', 2, body.scale.z, body.scale.z * 0.02, 52, n, rnd)
    nk = O[root['neck']]
    _osc(nk, 'rotation_euler', 2, nk.rotation_euler.z, head_amp, 90, n, rnd)
    _osc(nk, 'rotation_euler', 0, nk.rotation_euler.x, head_amp * 0.6, 70, n, rnd)
    if root['eyes']:
        from kit import _blinks
        _blinks([O[x] for x in root['eyes']], n, rnd)
    whisker_sway(root, n, amp=0.1, period=34, seed=seed)
    tail = O[root['tail']]
    _osc(tail, 'rotation_euler', 2, tail.rotation_euler.z, 0.35, 50, n, rnd)


def morning_bed(n, pitch=0.62, slit=None, you_pose='stand', you_rot=math.pi, night=False, haze=True):
    Q = bedroom(night=night, haze=haze)
    c = tora((CAT_XY[0], CAT_XY[1], Q), pose='sit', slit=slit)
    O[c['neck']].rotation_euler.x = pitch
    y = you((YOU_XY[0], YOU_XY[1], Q), rot_z=you_rot, pose=you_pose)
    return Q, c, y


def look_up(p, a=-0.45):
    O[p['neck']].rotation_euler.x = a


# ---------------- SCENE 01 巨大な目（章0） ----------------
def tEye(n):  # 画面いっぱいに金色の目。黒い瞳が細くなり、白いひげが揺れる。ゆっくり引く
    f_slit = 8.3 * FPS
    Q, c, y = morning_bed(n, slit=(int(f_slit), int(f_slit + 30), 1.0, 0.28))
    look_up(y, -0.5)
    cat_still(c, n, seed=3, head_amp=0.012)
    e = eye_world(c, 1); e2 = eye_world(c, -1)
    mid = (e + e2) / 2
    fwd = (cat_world(c, (0, -1.0, 0)) - cat_world(c, (0, 0, 0))).normalized()
    cam = cam1(40)
    p0 = e + fwd * 6.5 + Vector((0.3, 0, -0.4))
    p1 = e + fwd * 12 + Vector((-1.5, 0, -2.0))
    p2 = mid + fwd * 26 + Vector((0, 0, -7))
    cam_path(cam, [(0, tuple(p0), tuple(e)), (0.45, tuple(p1), tuple(e + Vector((-0.6, 0, -0.5)))),
                   (1, tuple(p2), tuple(mid + Vector((0, 0, -4.5))))], n)
    return MB(amb='room')


def tCatLook(n):  # カメラが引くと、布団の上の小さなあなた。のぞき込む家の茶トラ猫が首をかしげる
    Q, c, y = morning_bed(n, pitch=0.6)
    look_up(y, -0.55)
    head_tilt(c, int(n * 0.45), int(n * 0.62), roll=0.32)
    cat_still(c, n, seed=4, head_amp=0.03)
    cam = cam1(15)
    face = cat_world(c, (0, -0.06, 0.0)); yh = (100, 134, Q + 1.0)
    p0 = (103, 122, Q + 22); p1 = (102.6, 126.0, Q + 0.9)
    cam_path(cam, [(0, p0, aim(p0, yh, face, 0.7)), (1, p1, aim(p1, yh, face, 0.5))], n)
    return MB(amb='room')


def tNose(n):  # あなたの体は、猫の鼻先より小さい：肩ごしに見上げる猫の顔
    Q, c, y = morning_bed(n, pitch=0.78)
    look_up(y, -0.6)
    cat_still(c, n, seed=5, head_amp=0.03)
    nose = cat_world(c, (0, -0.125, -0.005))
    cam = cam1(16)
    yh = (100, 134, Q + 1.0)
    p0 = (103.2, 123.0, Q + 0.9); p1 = (102.6, 125.0, Q + 0.8)
    cam_path(cam, [(0, p0, aim(p0, yh, nose, 0.6)), (1, p1, aim(p1, yh, nose, 0.55))], n)
    return MB(amb='room')


def tRoomWide(n):  # この朝、世界中の人が身長1cmに：部屋の高いところから。ベッドの上の猫と、点のようなあなた
    Q, c, y = morning_bed(n, pitch=0.7, haze=False)
    look_up(y)
    cam = cam1(35)
    cam_path(cam, [(0, (-300, -330, 330), (90, 130, Q)), (1, (-130, -150, 230), (98, 138, Q + 8))], n)
    return MB(amb='room')


def tPawUp(n):  # 猫の前足が、ゆっくり持ち上がる（見上げるあなた）
    Q, c, y = morning_bed(n, pitch=0.7)
    look_up(y, -0.55)
    paw_lift(c, 1, 8, int(n * 0.55), up=1.15)
    cat_still(c, n, seed=6, head_amp=0.03)
    cam = cam1(15)
    yh = (100, 134, Q + 1.2); face = cat_world(c, (0, -0.06, 0.0))
    p0 = (97.5, 124.0, Q + 0.9); p1 = (97.0, 123.0, Q + 0.8)
    cam_path(cam, [(0, p0, aim(p0, yh, face, 0.5)), (1, p1, aim(p1, yh, face, 0.55))], n)
    return MB(amb='room')


# ---------------- SCENE 02 布団の山（章1） ----------------
def run_path(x0, x1, y0=RUN_Y):
    return lambda t: (x0 + (x1 - x0) * t, y0, 0)


def tRun(n):  # 走り出す。足元は白い布の丘、布団のしわが谷のように続く
    Q = bedroom()
    p = you((40, RUN_Y, Q), rot_z=math.pi / 2)
    x0, x1 = 40.0, 40.0 + 3.6 * n / FPS
    move(p, [(1, (x0, RUN_Y, Q)), (n, (x1, RUN_Y, Q))]); set_interp(p, 'LINEAR', 'location')
    cam = cam1(30)
    keys = []
    for i in range(7):
        t = i / 6; x = x0 + (x1 - x0) * t
        keys.append((t, (x - 6.5 + 2.5 * t, RUN_Y - 4.2 + 2.0 * t, Q + 2.0 + 0.6 * t), (x + 6, RUN_Y + 1.0, Q + 1.0)))
    cam_path(cam, keys, n)
    return MB(amb='room')


def tPillow(n):  # 振り返ると、枕が山のようにそびえ、部屋の向こうの壁は遠くかすむ
    Q = bedroom()
    y0 = 0.2 * K
    p = you((92, y0, Q), rot_z=math.pi)
    p.keyframe_insert('rotation_euler', index=2, frame=1)
    p.rotation_euler.z = math.pi * 0.05; p.keyframe_insert('rotation_euler', index=2, frame=int(n * 0.25))
    look_up(p, -0.3)
    cam = cam1(22)
    cam_path(cam, [(0, (94.5, y0 + 7.0, Q + 1.4), (104, -20, Q + 9)), (1, (95.5, y0 + 8.5, Q + 1.8), (106, -40, Q + 14))], n)
    return MB(amb='room')


def tEdge(n):  # 布団の端まで走る。その先は床まで続く崖
    Q = bedroom()
    xe = quilt_edge_x()
    p = you((xe - 26, RUN_Y, Q), rot_z=math.pi / 2)
    f1 = int(n * 0.55)
    move(p, [(1, (xe - 26, RUN_Y, Q)), (f1, (xe - 2.2, RUN_Y, Q))])
    O[p['neck']].keyframe_insert('rotation_euler', frame=f1)
    O[p['neck']].rotation_euler.x = 0.55; O[p['neck']].keyframe_insert('rotation_euler', frame=f1 + 14)
    floor_bits()
    cam = cam1(22)
    cam_path(cam, [(0, (xe - 34, RUN_Y - 4, Q + 3.0), (xe - 18, RUN_Y, Q + 0.8)),
                   (0.55, (xe - 9, RUN_Y - 3.0, Q + 3.5), (xe + 20, RUN_Y + 2, Q - 8)),
                   (1, (xe - 7, RUN_Y - 2.5, Q + 5.0), (xe + 30, RUN_Y + 4, Q - 28))], n)
    return MB(amb='room')


def floor_bits():
    """ベッドの横の床：綿ぼこり、糸くず、毛"""
    xe = quilt_edge_x()
    for k, (dx, dy, r) in enumerate(((22, -6, 3.0), (40, 20, 4.5), (15, 30, 2.2), (55, -18, 3.6))):
        dustball((xe + dx, RUN_Y + dy, r * 0.6), r=r, seed=k)
    yarn((xe + 30, RUN_Y - 4, 0.35), L=22, c=hexc('#d98b3a'), rot_z=0.6, r=0.2)
    yarn((xe + 12, RUN_Y + 12, 0.35), L=16, c=hexc('#c9b8a0'), rot_z=-0.4, r=0.15)


# ---------------- SCENE 03 高いビルから、飛び降りる（章2） ----------------
def tCatBehind(n):  # 後ろで猫の足音。あなたは布団の端から飛び降りる
    Q = bedroom()
    xe = quilt_edge_x()
    c = tora((30, RUN_Y + 10, Q), pose='walk', rot_z=-math.pi / 2)
    move(c, [(1, (30, RUN_Y + 10, Q)), (n, (120, RUN_Y + 6, Q))])
    p = you((xe - 2.0, RUN_Y, Q), rot_z=-math.pi / 2)
    look_up(p, -0.2)
    car_ = carrier_of(p)
    fj = int(n * 0.62)
    car_.keyframe_insert('location', frame=fj)
    car_.location = (xe + 2.5, RUN_Y, Q + 1.2); car_.keyframe_insert('location', frame=fj + 6)
    car_.location = (xe + 5.0, RUN_Y, Q - 8); car_.keyframe_insert('location', frame=fj + 24)
    car_.location = (xe + 6.0, RUN_Y, Q - 40); car_.keyframe_insert('location', frame=n + 30)
    cam = cam1(30)
    cam_path(cam, [(0, (xe + 10, RUN_Y - 3, Q + 2.5), (xe - 40, RUN_Y + 6, Q + 10)), (0.62, (xe + 11, RUN_Y - 3.5, Q + 2.5), (xe - 30, RUN_Y + 4, Q + 6)),
                   (1, (xe + 12, RUN_Y - 4, Q + 1.5), (xe - 10, RUN_Y + 1, Q - 10))], n)
    return MB(amb='room')


def tDropView(n):  # 床までの高さは、高いビルの屋上と同じ：端から見下ろす
    Q = bedroom()
    xe = quilt_edge_x()
    p = you((xe - 1.5, RUN_Y, Q), rot_z=math.pi / 2)
    O[p['neck']].rotation_euler.x = 0.6
    floor_bits()
    cam = cam1(30)
    cam_path(cam, [(0, (xe + 4, RUN_Y - 7, Q + 4), (xe - 2, RUN_Y + 1, Q - 30)), (1, (xe + 5, RUN_Y - 8, Q + 2), (xe - 1, RUN_Y + 1, Q - 50))], n)
    return MB(amb='room')


def tFall(n):  # 体がふわりと浮き、綿ぼこりと並んでゆっくり落ちていく
    Q = bedroom()
    xe = quilt_edge_x()
    p = you((0, 0, 0), rot_z=-math.pi / 2)
    car_ = carrier_of(p)
    x = xe + 7
    z0, z1 = Q - 6, 14.0
    car_.location = (x, RUN_Y, z0); car_.keyframe_insert('location', frame=1)
    car_.location = (x + 3, RUN_Y, z1); car_.keyframe_insert('location', frame=n)
    set_interp(car_, 'LINEAR', 'location')
    car_.rotation_euler = (0.25, 0.1, 0); car_.keyframe_insert('rotation_euler', frame=1)
    car_.rotation_euler = (-0.2, -0.15, 0.6); car_.keyframe_insert('rotation_euler', frame=n)
    arm_to(p, 1, (0.7, 0.0, 1.6)); arm_to(p, 0, (-0.7, 0.0, 1.6))
    O[p['neck']].rotation_euler.x = 0.3
    rnd = random.Random(8)
    for k in range(6):
        d = dustball((x + rnd.uniform(-8, 8), RUN_Y + rnd.uniform(4, 14), z0 + rnd.uniform(-6, 10)), r=rnd.uniform(0.8, 2.0), seed=k)
        d.keyframe_insert('location', frame=1)
        d.location.z -= (z0 - z1) * rnd.uniform(0.9, 1.05); d.location.x += rnd.uniform(-2, 2); d.keyframe_insert('location', frame=n)
        set_interp(d, 'LINEAR', 'location')
        d.rotation_euler = (0, 0, 0); d.keyframe_insert('rotation_euler', frame=1)
        d.rotation_euler = (rnd.uniform(-2, 2), rnd.uniform(-2, 2), rnd.uniform(-2, 2)); d.keyframe_insert('rotation_euler', frame=n)
    floor_bits()
    cam = cam1(32)
    keys = []
    for i in range(5):
        t = i / 4; z = z0 + (z1 - z0) * t
        keys.append((t, (x + 1.5 * t + 3.5, RUN_Y - 10 + 2 * t, z + 3.5 - 1.0 * t), (x + 3 * t, RUN_Y + 2, z - 1.0)))
    cam_path(cam, keys, n)
    return MB(amb='wind')


def tLanded(n):  # 床に着く。立ち上がり、手足を見る。どこも痛くない
    Q = bedroom()
    xe = quilt_edge_x()
    x = xe + 10
    p = you((x, RUN_Y, 0), rot_z=math.pi * 0.35)
    car_ = carrier_of(p)
    car_.location = (x, RUN_Y, 6); car_.keyframe_insert('location', frame=1)
    car_.location = (x, RUN_Y, 0); car_.keyframe_insert('location', frame=10)
    arm_to(p, 1, (0.15, -0.38, 1.1), f=int(n * 0.3)); arm_to(p, 0, (-0.15, -0.38, 1.1), f=int(n * 0.3))
    nk = O[p['neck']]
    nk.keyframe_insert('rotation_euler', frame=int(n * 0.3)); nk.rotation_euler.x = 0.5; nk.keyframe_insert('rotation_euler', frame=int(n * 0.3) + 12)
    floor_bits()
    cam = cam1(30)
    cam_path(cam, [(0, (x + 6.5, RUN_Y - 6.5, 1.6), (x, RUN_Y, 1.0)), (1, (x + 2.0, RUN_Y - 8.0, 2.4), (x - 0.5, RUN_Y, 2.5))], n)
    return MB(amb='room')


def tAntDrop(n):  # アリと同じ：となりに落ちてきたアリも、そのまま歩いていく
    Q = bedroom()
    xe = quilt_edge_x()
    x = xe + 10
    p = you((x, RUN_Y, 0), rot_z=-math.pi * 0.25)
    a = ant_k((x - 3.5, RUN_Y + 1.0, 0), rot_z=math.pi * 0.6)
    a.location.z = 30; a.keyframe_insert('location', frame=1)
    a.location.z = 0; a.keyframe_insert('location', frame=14)
    a.keyframe_insert('location', frame=24)
    a.location = (x + 4, RUN_Y + 10, 0); a.keyframe_insert('location', frame=n)
    ant_idle(a, n, seed=3)
    O[p['neck']].rotation_euler.z = 0.6
    floor_bits()
    cam = cam1(30)
    cam_path(cam, [(0, (x + 3.5, RUN_Y - 6.0, 1.4), (x - 2, RUN_Y + 1, 0.8)), (1, (x + 5.0, RUN_Y - 5.5, 1.6), (x + 2, RUN_Y + 5, 0.6))], n)
    return MB(amb='room')


# ---------------- SCENE 04 下りられるのに、上れない（章3） ----------------
def tStairTop(n):  # 廊下の先に階段。一段の高さは、背の二十倍以上
    top, rows = stairs_set()
    p = you((10, -24, top), rot_z=0.0)
    move(p, [(1, (10, -24, top)), (int(n * 0.45), (10, -2.0, top))])
    nk = O[p['neck']]
    nk.keyframe_insert('rotation_euler', frame=int(n * 0.45)); nk.rotation_euler.x = 0.5; nk.keyframe_insert('rotation_euler', frame=int(n * 0.45) + 12)
    cam = cam1(26)
    cam_path(cam, [(0, (22, -42, top + 3), (10, -10, top + 0.5)), (0.35, (36, -12, top + 4), (8, 10, top - 8)),
                   (1, (230, 110, top - 20), (0, 90, top - 70))], n)
    return MB(amb='room')


def tFamilyBelow(n):  # 下の階から小さな声。家族も、同じ大きさになっている
    top, rows = stairs_set()
    y0 = rows[-1][0] + 42.5 + 18
    ps = [family((x, y0 + dy, 0), k, rot_z=math.pi) for k, (x, dy) in enumerate(((-4, 0), (0, 1.5), (4, -0.5)))]
    for q in ps:
        look_up(q, -0.5)
    arm_up(ps[1], 1); arm_up(ps[0], 0)
    cam = cam1(22)
    cam_path(cam, [(0, (8, y0 + 9, 2.4), (0, y0 - 10, 4)), (1, (12, y0 + 11, 2.0), (0, y0 - 60, 60))], n)
    return MB(amb='room')


def tStairJump(n):  # 一段ずつ、飛び降りていく。落ちるのは、もう怖くない（横から）
    top, rows = stairs_set()
    T = 42.5
    p = you((0, 0, 0), rot_z=0.0)
    car_ = carrier_of(p)
    car_.rotation_euler.z = math.pi  # 前（-y）を +y へ
    seq = []
    f = 1
    per = max(40, (n - 10) // 3)
    for i in range(3):
        y0, z = rows[i]
        ye = y0 + T - 1.5
        seq.append((f, (ye - 10, z)))
        f += int(per * 0.4); seq.append((f, (ye, z)))
        f += int(per * 0.15); seq.append((f, (ye + 4.5, z + 2)))
        f += int(per * 0.45); seq.append((f, (ye + 6.0, rows[i + 1][1])))
    for fr, (yy, zz) in seq:
        car_.location = (20, yy, zz); car_.keyframe_insert('location', frame=min(fr, n + 20))
    arm_to(p, 1, (0.5, -0.1, 1.5)); arm_to(p, 0, (-0.5, -0.1, 1.5))
    cam = cam1(26)
    keys = []
    for k in range(9):  # 下の段の前から、跳んでくるあなたを見上げる
        fr = 1 + (n - 1) * k / 8
        j = max(i for i in range(len(seq)) if seq[i][0] <= fr or i == 0)
        yy, zz = seq[j][1]
        keys.append((k / 8, (34, yy + 30, zz + 3), (20, yy, zz + 1)))
    cam_path(cam, keys, n)
    return MB(amb='room')


def tStairWall(n):  # 下りきって振り返ると、二階へ戻る道はもう、ない
    top, rows = stairs_set()
    y0 = rows[-1][0] + 42.5 + 8
    p = you((20, y0, 0), rot_z=math.pi)
    look_up(p, -0.55)
    cam = cam1(20)
    cam_path(cam, [(0, (24, y0 + 7, 1.4), (10, y0 - 60, 60)), (1, (26, y0 + 9, 1.0), (8, y0 - 90, 120))], n)
    return MB(amb='room')


# ---------------- SCENE 05 アリの行列のような人の列（章4） ----------------
def tTownStill(n):  # 同じ朝。道路の車は止まったまま、動かない（ふつうの縮尺）
    still_street(n)
    cam = cam1(35, clip=(0.1, 3000))
    cam_path(cam, [(0, (-62, -1.0, 9), (10, 0, 1)), (1, (-46, 0.5, 7.5), (20, 1, 1))], n)
    return MB(amb='wind')


def tStationStill(n):  # 駅の電車も、ホームに止まったまま（ふつうの縮尺）
    still_station(n)
    cam = cam1(32, clip=(0.1, 3000))
    cam_path(cam, [(0, (-52, 6.5, 2.6), (0, -0.5, 2.0)), (1, (-46, 7.5, 2.8), (10, -0.5, 1.8))], n)
    return MB(amb='wind')


def curb_set():
    """歩道の端（K 倍）：車道 z=0（y<0）、縁石の上の歩道 z=CURB（y>0）。止まった車のタイヤ"""
    setup_light(hexc('#b7d0e6'), exp=0.45, ld=(0.4, -0.5, 0.7), shadow=0.5)
    CURB = 0.15 * K
    plane((0, -6 * K, 0), (40 * K, 12 * K), hexc('#77736e'))
    box((0, 6 * K, CURB / 2), (40 * K, 12 * K, CURB), hexc('#cfc8ba'))
    box((0, 0.1 * K, CURB / 2 + 0.02), (40 * K, 0.2 * K, CURB + 0.04), hexc('#bdb6a8'))  # 縁石
    for i in range(-30, 31):
        box((i * 0.3 * K, 6 * K, CURB + 0.05), (0.8, 12 * K, 0.2), hexc('#b0a99c'))  # 歩道の目地
    rnd = random.Random(2)
    for i in range(90):
        sphere((rnd.uniform(-300, 300), rnd.uniform(-200, -2), 0), rnd.uniform(0.2, 1.0), hexc('#5e5a56'), scale=(1, 1, 0.5), seg=6)
    with giant():
        car((1.2, -1.3, 0), rot_z=math.pi / 2, c=hexc('#2f4a6b'))
        car((-4.5, -1.3, 0), rot_z=math.pi / 2, c=hexc('#c9c9c9'))
        tree((3.0, 1.2, 0.15), s=0.9)
        for k in range(6):
            tower((-14 + k * 6, 9.5, 0), 5.5, 4, 8 + 4 * (k % 3), WALLS[k % len(WALLS)], floors=6)
    return CURB


def people_line(n, y, z, x0, x1, k=10, seed=3, speed=2.2, spacing=3.2):
    rnd = random.Random(seed); ps = []
    for i in range(k):
        p = crowd((x0 + i * spacing, y, z), rnd, rot_z=-math.pi / 2, name=f'line{i}')
        xs = x0 + i * spacing
        move(p, [(1, (xs, y + rnd.uniform(-0.3, 0.3), z)), (n, (xs + speed * n / FPS, y + rnd.uniform(-0.3, 0.3), z))])
        set_interp(p, 'LINEAR', 'location')
        ps.append(p)
    return ps


def tCurbDown(n):  # 歩道の端を、よく見ると：上から寄っていくと、小さな人の列が歩いている
    CURB = curb_set()
    people_line(n, 10, CURB, -40, 0, k=11)
    ants = [ant_k((0, 0, CURB), name=f'a{i}') for i in range(12)]
    ant_walk(ants, n, (-42, 6.0, CURB), (60, 6.0, CURB), speed=1.4, spacing=3.4, z=CURB)
    cam = cam1(32)
    cam_path(cam, [(0, (-10, 150, 300), (-6, 6, CURB)), (0.75, (-4, 26, CURB + 14), (2, 7, CURB)), (1, (-1, 18, CURB + 6), (4, 8, CURB + 0.5))], n)
    return MB(amb='wind')


def tAntsPeople(n):  # 人の列と、アリの列は、同じ大きさ
    CURB = curb_set()
    people_line(n, 9.0, CURB, -40, 0, k=12, seed=4)
    ants = [ant_k((0, 0, CURB), name=f'a{i}') for i in range(14)]
    ant_walk(ants, n, (-48, 5.5, CURB), (80, 5.5, CURB), speed=1.4, spacing=3.4, z=CURB, seed=2)
    cam = cam1(30)
    cam_path(cam, [(0, (-26, 1.5, CURB + 1.4), (-14, 7.5, CURB + 0.6)), (1, (-4, 2.0, CURB + 1.6), (10, 7.5, CURB + 0.6))], n)
    return MB(amb='wind')


# ---------------- SCENE 06 米一粒の朝ごはん（章5） ----------------
def tKitchenFloor(n):  # 台所の床に、ご飯粒が一つ。白い岩のよう
    yf = kitchen()
    g = rice((0, 80, 0.2), rot_z=0.4)
    p = you((-2, 64, 0), rot_z=0)
    move(p, [(1, (-2, 64, 0)), (int(n * 0.7), (-0.6, 78.4, 0))])
    cam = cam1(30)
    cam_path(cam, [(0, (-4.5, 58, 1.6), (0, 80, 0.6)), (1, (-2.2, 74.8, 1.0), (0.2, 80, 0.5))], n)
    return MB(amb='room')


def tBite(n):  # 両手で抱えて、少しかじると、おなかがいっぱい
    yf = kitchen()
    p = you((0, 80, 0), rot_z=0)
    g = rice((0, 79.62, 1.05), rot_z=0.0, s=0.9); g.rotation_euler = (0.0, 1.3, 1.57)
    g.parent = p; g.location = (0, -0.38, 1.05)
    arms_front(p, z=1.12, y=-0.3, w=0.2)
    nk = O[p['neck']]
    for k, f in enumerate(range(10, int(n * 0.55), 22)):
        nk.keyframe_insert('rotation_euler', frame=f); nk.rotation_euler.x = 0.35; nk.keyframe_insert('rotation_euler', frame=f + 6)
        nk.rotation_euler.x = 0.0; nk.keyframe_insert('rotation_euler', frame=f + 14)
    f2 = int(n * 0.62)
    j = O[p['arms'][0]] if p['arms'] else None
    cam = cam1(40)
    cam_path(cam, [(0, (2.6, 76.0, 1.4), (0, 80, 1.15)), (1, (-2.2, 76.2, 1.3), (0, 80, 1.1))], n)
    return MB(amb='room')


def tFamilyGrain(n):  # ご飯粒の横で、家族が並んで食べる
    yf = kitchen()
    rice((0, 80, 0.2), rot_z=0.4)
    rice((6, 84, 0.2), rot_z=-0.8)
    ps = [floor_sit(you((-0.2, 78.4, 0), rot_z=-0.3, pose='sit'))]
    for k, (x, y, rz) in enumerate(((1.3, 78.9, 0.9), (-1.4, 80.9, -2.2), (1.2, 81.3, 2.4))):
        ps.append(floor_sit(family((x, y, 0), k, rot_z=rz, pose='sit')))
    for q in ps:
        arm_to(q, 1, (0.08, -0.36, 0.55))
    rnd = random.Random(5)
    for q in ps:
        nk = O[q['neck']]
        f = rnd.randint(5, 25)
        while f < n - 20:
            nk.keyframe_insert('rotation_euler', frame=f); nk.rotation_euler.x = 0.3; nk.keyframe_insert('rotation_euler', frame=f + 6)
            nk.rotation_euler.x = 0.0; nk.keyframe_insert('rotation_euler', frame=f + 12); f += rnd.randint(30, 60)
    cam = cam1(30)
    cam_path(cam, [(0, (4.5, 75.0, 2.0), (0, 80, 0.4)), (1, (-3.5, 74.8, 2.3), (0, 80, 0.4))], n)
    return MB(amb='room')


# ---------------- SCENE 07 すぐに冷える体（章6） ----------------
def cold_floor():
    yf = kitchen()
    s = bpy.context.scene; sky(hexc('#c8d4e0')); s.view_settings.exposure = 0.3
    return yf


def breath(p, n, period=40):
    """白い息（口から出て、ふわっと消える小さな玉）"""
    h = O[p['head']]
    bpy.context.view_layer.update()
    m0 = h.matrix_world @ Vector((0, -0.14, -0.04))
    m1 = h.matrix_world @ Vector((0, -0.42, 0.06))
    rnd = random.Random(3)
    starts = [tuple(m0 + Vector((rnd.uniform(-0.03, 0.03), 0, rnd.uniform(-0.02, 0.02)))) for _ in range(8)]
    ends = [tuple(m1 + Vector((rnd.uniform(-0.1, 0.1), rnd.uniform(-0.1, 0.1), rnd.uniform(0, 0.15)))) for _ in range(8)]
    particles_flow(n, starts, ends, rgb=(0.95, 0.97, 1.0), size=0.035, period=period, a=0.55)


def tShiver(n):  # 朝ごはんのあと、すぐに寒くなる。肩を抱いて震える
    cold_floor()
    rice((3, 82, 0.2), rot_z=0.4)
    p = you((0, 80, 0), rot_z=0.3)
    arms_hug(p)
    car_ = carrier_of(p)
    shake(car_, n, amp=0.012, period=2)
    breath(p, n)
    cam = cam1(38)
    cam_path(cam, [(0, (1.6, 76.2, 1.5), (0, 80, 1.3)), (1, (0.4, 75.8, 1.6), (0, 80, 1.35))], n)
    return MB(amb='wind')


def tLint(n):  # 綿ぼこりや毛糸のくずに、家族が潜り込む
    cold_floor()
    dustball((0, 82, 2.2), r=3.6, seed=4)
    dustball((7, 85, 1.6), r=2.6, seed=5)
    yarn((-4, 80, 0.4), L=14, c=hexc('#c0504d'), rot_z=0.3, r=0.4)
    yarn((-3, 81.5, 0.4), L=12, c=hexc('#e8c86a'), rot_z=-0.2, r=0.35)
    ps = [floor_sit(family((-1.4, 79.6, 0), 0, rot_z=0.4, pose='sit')), floor_sit(family((1.6, 79.4, 0), 1, rot_z=-0.5, pose='sit')),
          floor_sit(you((-4.0, 78.6, 0.0), rot_z=0.2, pose='sit'))]
    for q in ps:
        arm_to(q, 0, (0.16, -0.18, 0.98)); arm_to(q, 0, (-0.16, -0.18, 0.98))
    p2 = family((3.0, 77.0, 0), 2, rot_z=0.3)
    move(p2, [(1, (3.0, 74.0, 0)), (int(n * 0.6), (2.0, 79.2, 0))])
    cam = cam1(32)
    cam_path(cam, [(0, (3.5, 71.0, 2.6), (0, 81, 1.2)), (1, (-2.5, 71.5, 2.2), (0, 81, 1.2))], n)
    return MB(amb='wind')


def tShrew(n):  # とても小さなトガリネズミの仲間は、休みなく虫を食べる（比べるための映像・ふつうの縮尺）
    setup_light(hexc('#a8c0a0'), exp=0.4, ld=(0.4, -0.5, 0.75), shadow=0.5, ao=0.01)
    plane((0, 0, 0), (4, 4), hexc('#6a5236'))
    rnd = random.Random(6)
    for i in range(70):
        leaf((rnd.uniform(-0.5, 0.5), rnd.uniform(-0.4, 0.6), 0.002 + i * 0.0002), L=rnd.uniform(0.05, 0.09),
             rot=(rnd.uniform(-0.1, 0.1), rnd.uniform(-0.1, 0.1), rnd.uniform(0, 6.28)), c=rnd.choice([hexc('#9a6a3a'), hexc('#b0803a'), hexc('#7a5a30'), hexc('#a8582f')]))
    sh = shrew((0, 0.02, 0.012), s=0.28, rot_z=0.3)
    rat_live(sh, n, seed=2)
    bugs = []
    for k in range(6):
        b = bug((rnd.uniform(-0.03, 0.03), -0.035 - k * 0.01, 0.014), s=0.35, rot_z=rnd.uniform(0, 6))
        vanish(b, int(n * (0.15 + 0.13 * k)))
        bugs.append(b)
    sh.keyframe_insert('location', frame=1)
    sh.location = (0.0, -0.05, 0.012); sh.keyframe_insert('location', frame=n)
    cam = cam1(40, clip=(0.002, 50))
    cam_path(cam, [(0, (0.16, -0.12, 0.07), (0, -0.01, 0.02)), (1, (0.12, -0.16, 0.06), (0, -0.04, 0.02))], n)
    return MB(amb='garden')


def tNibble(n):  # 少しずつ、何度も食べる。一日中、ご飯粒のそばを離れない
    cold_floor()
    rice((0.9, 80.0, 0.2), rot_z=1.2)
    p = you((-0.4, 79.4, 0), rot_z=-1.2, pose='sit')
    j = arm_to(p, 1, (0.08, -0.32, 0.98))
    rnd = random.Random(2)
    f = 8
    while f < n - 20:
        j.keyframe_insert('rotation_euler', frame=f)
        b = j.rotation_euler.copy(); j.rotation_euler = (b.x - 0.5, b.y, b.z); j.keyframe_insert('rotation_euler', frame=f + 8)
        j.rotation_euler = b; j.keyframe_insert('rotation_euler', frame=f + 16)
        f += rnd.randint(34, 50)
    dustball((-3.0, 82.0, 1.2), r=2.0, seed=7)
    cam = cam1(34)
    cam_path(cam, [(0, (-2.4, 75.6, 1.5), (0.2, 79.8, 0.6)), (1, (2.5, 75.8, 1.8), (0.2, 79.8, 0.6))], n)
    return MB(amb='room')


# ---------------- SCENE 08 自分と同じ重さの雨粒（章7） ----------------
def genkan_set():
    setup_light(hexc('#d8dfe6'), exp=0.4, ld=(0.3, -0.6, 0.7), shadow=0.5)
    t = 0.3 * K
    for i in range(-4, 5):
        for j in range(-3, 1):
            plane((i * t, j * t - t / 2, 0.0), (t - 0.8, t - 0.8), hexc('#8a8478') if (i + j) % 2 else hexc('#968f82'))
    box((0, -2 * t, -0.3), (10 * t, 5 * t, 0.6), hexc('#4a463e'))
    GAP = 2.8
    door_y = 0.0
    with giant():
        box((0, 0.025, 1.0 + GAP / K), (0.9, 0.05, 2.0), hexc('#7a5a3a'))   # ドア（下にすき間）
        box((0.47, 0.025, 1.05), (0.04, 0.08, 2.1), hexc('#5a4430'))
        box((-0.47, 0.025, 1.05), (0.04, 0.08, 2.1), hexc('#5a4430'))
        box((0, -0.7, 1.25), (4, 0.05, 2.5), hexc('#e6dccb'))
    # 外：雨にぬれたコンクリートと土
    plane((0, 3 * K, -0.2), (12 * K, 6 * K), hexc('#8d8a84'))
    return GAP


def tDoorGap(n):  # 玄関のドアの下の、すき間をくぐって、外へ出る
    GAP = genkan_set()
    p = you((-2, -30, 0), rot_z=0)
    move(p, [(1, (-2, -30, 0)), (n, (-0.5, 12, 0))]); set_interp(p, 'LINEAR', 'location')
    cam = cam1(28)
    cam_path(cam, [(0, (-6, -40, 2.4), (0, -10, 1.6)), (0.6, (-4, -14, 1.6), (0, 4, 1.3)), (1, (-2.5, -6, 1.2), (0, 14, 1.0))], n)
    return MB(amb='room')


def rain_streaks(n, k, xr, yr, z0, seed=1, f_every=(8, 24), speed=9.0, splash=True, ground=0.0, start=1):
    """雨粒：細長く流れて落ち、地面ではじける"""
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        x = rnd.uniform(*xr); y = rnd.uniform(*yr)
        o = ball((x, y, z0), 0.26, (0.75, 0.88, 1.0), a=0.55, seg=10, name='drop')
        o.scale = (1, 1, 5)
        f = start + rnd.randint(0, 30)
        keys = []
        while f < n + 10:
            dur = int((z0 - ground) / speed)
            o.location = (x, y, z0); o.keyframe_insert('location', frame=f)
            o.location = (x, y, ground + 1.0); o.keyframe_insert('location', frame=f + dur)
            keys.append(f + dur)
            f += dur + rnd.randint(*f_every)
        set_interp(o, 'LINEAR', 'location')
        if splash and keys:
            parts = []
            for k2 in range(4):
                sp = ball((x, y, ground + 0.1), 0.09, (0.8, 0.9, 1.0), a=0.6, seg=6, name='spl')
                sp.scale = (0, 0, 0); sp.keyframe_insert('scale', frame=1)
                parts.append(sp)
            for fh in keys:
                for k2, sp in enumerate(parts):
                    a_ = k2 / 4 * 6.28 + rnd.random()
                    sp.scale = (0, 0, 0); sp.keyframe_insert('scale', frame=fh)
                    sp.scale = (1, 1, 1); sp.keyframe_insert('scale', frame=fh + 1)
                    sp.location = (x, y, ground + 0.1); sp.keyframe_insert('location', frame=fh + 1)
                    sp.location = (x + math.cos(a_) * 1.4, y + math.sin(a_) * 1.4, ground + 0.6); sp.keyframe_insert('location', frame=fh + 5)
                    sp.scale = (0, 0, 0); sp.keyframe_insert('scale', frame=fh + 8)
            for sp in parts:
                set_interp(sp, 'CONSTANT', 'scale')
        out.append(o)
    return out


def tRain(n):  # 雨粒一つが、あなたの体と同じ重さ。自転車を思いきりこぐほどの速さで落ちてくる
    garden(rainy=True, wet=True)
    p = you((0, 0, 0), rot_z=0.4)
    look_up(p, -0.5)
    rain_streaks(n, 40, (-30, 30), (-10, 60), 60, seed=2, speed=10.0)
    # あなたのすぐそばで、はじける一粒
    rain_streaks(n, 1, (2.2, 2.2), (2.0, 2.0), 40, seed=9, speed=6.0, f_every=(30, 40), start=int(n * 0.35))
    cam = cam1(28)
    cam_path(cam, [(0, (3.5, -6.0, 1.6), (1.0, 2.0, 3.5)), (1, (5.0, -5.0, 1.2), (1.0, 2.0, 2.0))], n)
    return MB(amb='sea')


def leaf_plant(loc, s=1.0):
    """葉っぱ（地面から立つ茎の先で、ひさしのように広がる）"""
    x, y, z = loc
    bar((x, y, 0), (x, y, 6.0 * s), 0.25 * s, hexc('#4f7a34'))
    lf = leaf((x, y - 3 * s, 5.8 * s), L=18 * s, rot=(0.12, 0, 0), name='bigleaf')
    return lf


def tLeafShelter(n):  # 葉っぱの下に駆け込む。雨粒が当たるたびに、葉っぱが大きく揺れる
    garden(rainy=True, wet=True)
    lf = leaf_plant((0, 4, 0))
    rnd = random.Random(3)
    lf.keyframe_insert('rotation_euler', frame=1)
    hits = list(range(int(n * 0.25), n, 26))
    for f in hits:
        lf.keyframe_insert('rotation_euler', frame=f)
        lf.rotation_euler = (0.12 + rnd.uniform(0.25, 0.4), rnd.uniform(-0.1, 0.1), 0); lf.keyframe_insert('rotation_euler', frame=f + 3)
        lf.rotation_euler = (0.12, 0, 0); lf.keyframe_insert('rotation_euler', frame=f + 14)
    p = you((-8, -6, 0), rot_z=0)
    move(p, [(1, (-8, -6, 0)), (int(n * 0.35), (0.3, 1.2, 0))])
    rain_streaks(n, 34, (-30, 30), (-10, 40), 60, seed=5, speed=10.0)
    cam = cam1(26)
    cam_path(cam, [(0, (6, -10, 2.0), (0, 1, 2.5)), (1, (4.5, -8.0, 1.4), (0, 1.5, 2.6))], n)
    return MB(amb='sea')
