"""「もしも世界中から服が消えたら」用の部品（猫の動画の kit.py / shots.py / shots_v5.py と、hk.py から写した fk_base.py の上に足す）。

絶対のルール：画面の人は、いつも布団・シーツ・カーテン・タオル・テーブルクロス・タオルのガウン・（SCENE 12 から）縫った服で
体が隠れていること。CG の裸は YouTube の広告の指針で広告が付かない扱いになる。顔・手・足だけは見えてよい。
- wrapped_person()：布にくるまった人（胴と脚は布の円すいの中。肩に布のたまり、洗濯ばさみ、腕の色の布、斜めがけの袋）
- futon_sleeper()：布団で眠る人（顔だけ見える）
- mannequin()：服を失った店のマネキン（白く、のっぺりした形だけ）
- hanger() / garment()：ハンガーと服（シャツ・コート・学生服・上着・ガウン）
"""
import math, random
from mathutils import Vector, Euler
from fk_base import *
from shots import _font, _tl, make_tex
from kit import _osc, _blinks

RF = random.Random(1103)

# ---------------- 光・空 ----------------
def setup(sky_hex, exp=0.45, ld=(0.5, -0.4, 0.7), shadow=0.45):
    sky(hexc(sky_hex)); s = bpy.context.scene; s.view_settings.exposure = exp
    light_dir(ld); s.display.shading.shadow_intensity = shadow
    return s


def nightset(exp=-0.05):
    return setup('#141a2c', exp, (0.2, 0.6, 0.7), 0.3)


# ---------------- 布の柄（PIL で描いた小さな絵を貼る） ----------------
_CM = {}


def _rgb255(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def shade_hex(h, k=0.8):
    r, g, b = _rgb255(h)
    return '#%02x%02x%02x' % (int(r * k), int(g * k), int(b * k))


def cloth_mat(kind='plain', c1='#d9534f', c2='#f4efe6', rep=4):
    """布の柄の材質。kind：plain / stripe / hstripe / check / dots / flower / terry（タオル地）/ quilt（布団）/ lace（レース）"""
    key = (kind, c1, c2, rep)
    if key in _CM and _CM[key].name in bpy.data.materials:
        return _CM[key]
    if kind == 'plain':
        m = bpy.data.materials.new('fk_pl_' + c1[1:]); m.diffuse_color = (*hexc(c1), 1)
        _CM[key] = m
        return m
    name = 'fk_cl_%s_%s_%s_%d' % (kind, c1[1:], c2[1:], rep)
    A = _rgb255(c1); B = _rgb255(c2)

    def fn(im, d):
        W = 256; s = W // rep
        d.rectangle((0, 0, W, W), fill=A)
        if kind == 'stripe':
            for i in range(rep):
                d.rectangle((i * s, 0, i * s + s // 2, W), fill=B)
        elif kind == 'hstripe':
            for i in range(rep):
                d.rectangle((0, i * s, W, i * s + s // 3), fill=B)
        elif kind == 'check':
            mid = tuple((a + b) // 2 for a, b in zip(A, B))
            for i in range(rep):
                d.rectangle((i * s, 0, i * s + s // 2, W), fill=mid)
            for j in range(rep):
                d.rectangle((0, j * s, W, j * s + s // 2), fill=mid)
            for i in range(rep):
                for j in range(rep):
                    d.rectangle((i * s, j * s, i * s + s // 2, j * s + s // 2), fill=B)
        elif kind == 'dots':
            for i in range(rep):
                for j in range(rep):
                    ox = s // 2 if j % 2 else 0
                    cx, cy = i * s + ox + s // 4, j * s + s // 2
                    d.ellipse((cx - s // 5, cy - s // 5, cx + s // 5, cy + s // 5), fill=B)
        elif kind == 'flower':
            for i in range(rep):
                for j in range(rep):
                    ox = s // 2 if j % 2 else 0
                    cx, cy = i * s + ox + s // 4, j * s + s // 2
                    r = s // 7
                    for a in range(5):
                        px = cx + int(r * 1.1 * math.cos(a * 2 * math.pi / 5)); py = cy + int(r * 1.1 * math.sin(a * 2 * math.pi / 5))
                        d.ellipse((px - r, py - r, px + r, py + r), fill=B)
                    d.ellipse((cx - r // 2, cy - r // 2, cx + r // 2, cy + r // 2), fill=(250, 220, 120))
        elif kind == 'terry':
            rr = random.Random(3)
            for _ in range(900):
                x, y = rr.randint(0, W), rr.randint(0, W)
                d.ellipse((x - 2, y - 2, x + 2, y + 2), fill=B)
            for j in range(rep):
                d.rectangle((0, j * s + s - 10, W, j * s + s - 4), fill=B)
        elif kind == 'quilt':
            for i in range(rep + 1):
                d.line((i * s, 0, i * s, W), fill=B, width=5)
                d.line((0, i * s, W, i * s), fill=B, width=5)
            for i in range(rep):
                for j in range(rep):
                    d.ellipse((i * s + s // 2 - 5, j * s + s // 2 - 5, i * s + s // 2 + 5, j * s + s // 2 + 5), fill=B)
        elif kind == 'lace':
            for i in range(rep):
                for j in range(rep):
                    cx, cy = i * s + s // 2, j * s + s // 2
                    d.ellipse((cx - s // 3, cy - s // 3, cx + s // 3, cy + s // 3), outline=B, width=4)
                    d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=B)
    path = make_tex(name, fn, (256, 256))
    m = bpy.data.materials.new(name); m.use_nodes = True
    t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path)
    m.node_tree.links.new(t.outputs['Color'], m.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
    m.diffuse_color = (*hexc(c1), 1)
    _CM[key] = m
    return m


def setcloth(o, m):
    o.data.materials.clear(); o.data.materials.append(m)
    return o


# 家族ごとに違う柄（カーテン・シーツ・バスタオル・テーブルクロス）
CLOTHS = [('stripe', '#5b8fb9', '#eef3f7', 4), ('check', '#d95f5f', '#f6efe6', 4), ('dots', '#e8b04a', '#fff6e0', 4),
          ('flower', '#7aa86a', '#f4efe2', 3), ('hstripe', '#8a6aa8', '#f2ecf6', 4), ('plain', '#e9e4da', '#e9e4da', 1),
          ('lace', '#efe8d8', '#c8bca4', 3), ('check', '#4a7a9a', '#e8eef2', 3), ('stripe', '#c88a4a', '#f6ead8', 3),
          ('dots', '#5aa0a0', '#eaf6f6', 3)]
SHEET = ('plain', '#f2f0ea', '#f2f0ea', 1)        # シーツ（白）
TOWEL = ('terry', '#f4efe4', '#e2dccd', 4)        # バスタオル・タオルのガウン
FUTON = ('quilt', '#7a8fb8', '#e8ecf4', 3)        # 掛け布団
TOWELS_C = [('terry', '#f4efe4', '#e2dccd', 4), ('terry', '#bcd8e8', '#a2c2d6', 4), ('terry', '#f2c8c0', '#dcb0a8', 4),
            ('terry', '#d8e6c0', '#c0d2a4', 4), ('terry', '#f4e2b0', '#e0cc94', 4)]
HAIRS = [hexc('#2b2420'), hexc('#4a3a2a'), hexc('#1a1a1a'), hexc('#8a8a88'), hexc('#5a4030')]
BAND = {'blue': hexc('#2f6fd0'), 'white': hexc('#ffffff'), 'red': hexc('#d83a3a')}
BAGS = [hexc('#c8a878'), hexc('#7a9a6a'), hexc('#d88a5a'), hexc('#6a8ab0'), hexc('#b0b0a8')]


def bar(p0, p1, r, rgb, parent=None, verts=8):
    """p0 から p1 への細い棒"""
    p0 = Vector(p0); p1 = Vector(p1); d = p1 - p0
    o = cyl(tuple((p0 + p1) / 2), r, d.length, rgb, verts=verts)
    o.rotation_euler = Vector((0, 0, 1)).rotation_difference(d).to_euler()
    if parent is not None:
        link(o, parent)
    return o


def add_eyes(p, closed=False):
    """顔に目（まばたきは blink_all が付ける）"""
    h = O[p['head']]
    out = []
    for sx in (-1, 1):
        e = sphere((sx * 0.042, -0.112, 0.015), 0.017, hexc('#1c1c22'), seg=10, name='fkeye')
        e.scale = (1.0, 0.55, 0.22 if closed else 1.25)
        link(e, h)
        if closed:
            e['closed'] = 1
        out.append(e)
    return out


def blink_all(n, seed=3):
    """場面の目すべてに、ばらばらのまばたきを付ける（閉じた目は除く）"""
    rnd = random.Random(seed)
    groups = {}
    for o in bpy.data.objects:
        if o.name.startswith('fkeye') and not o.get('closed') and o.parent is not None:
            groups.setdefault(o.parent.name, []).append(o)
    for objs in groups.values():
        _blinks(objs, n, rnd)


def breathe(o, n, amp=0.02, axes=(0, 1), seed=1, period=None):
    rnd = random.Random(seed)
    for ax in axes:
        _osc(o, 'scale', ax, o.scale[ax], o.scale[ax] * amp, period or rnd.randint(44, 62), n, rnd)


# ---------------- 布にくるまった人 ----------------
def wrapped_person(loc, cloth=None, style='wrap', pose='stand', rot_z=0.0, s=1.0, name='w', skin=None, hair=None,
                   pin=None, band=None, band_at=None, bag=None, bag_at=None, jacket=None, eyes=True, act=None, seed=None,
                   hood=None, n=240, jacket_at=None):
    """布にくるまった人。胴と脚は布の円すい（立つ）・布の山（座る）の中にあり、見えるのは顔・手・足だけ。
    style：wrap（カーテン・シーツ・テーブルクロスを巻く）/ futon（布団をかぶる。頭の後ろまで）/ towel（バスタオル）/ gown（タオルのガウン）
    cloth：(柄, 色1, 色2, くり返し)。band：'blue'/'white'/'red'（腕の色の布）、bag：True で斜めがけの袋。
    jacket：(柄…) を渡すと、上からカーテンの布の上着。pin：洗濯ばさみの色（None なら wrap と towel に付ける）"""
    rnd = random.Random(seed if seed is not None else sum(map(ord, name)))
    if cloth is None:
        cloth = {'futon': FUTON, 'towel': TOWEL, 'gown': rnd.choice(TOWELS_C)}.get(style) or rnd.choice(CLOTHS)
    m = cloth_mat(*cloth)
    skin = skin or rnd.choice(SKIN[:3]); hair = hair or rnd.choice(HAIRS)
    p = person(loc, hexc(cloth[1]), pants=hexc(cloth[1]), skin=skin, hair=hair, rot_z=rot_z, pose=pose, s=s, name=name, act=act)
    rig = O[p['rig']]; torso = O[p['body']]
    setcloth(torso, m)
    armm = cloth_mat(*jacket) if (jacket and not jacket_at) else m
    for an in p['arms']:
        for ch in O[an].children:
            if ch.name.startswith('cyl'):
                setcloth(ch, armm)
    big = style == 'futon'
    dark = cloth_mat('plain', shade_hex(cloth[1], 0.78))
    if pose == 'stand':
        for ln in p['legs']:
            for ch in O[ln].children:
                if ch.name.startswith('cyl'):
                    ch.hide_render = True       # 脚は布の中
                else:
                    setmat(ch, skin)            # 素足（靴も消えた）
                    ch.scale = (0.85, 0.8, 1.0)
        r0, r1 = (0.46, 0.33) if big else (0.31, 0.215)
        wrap = setcloth(link(cyl((0, 0, 0.73), r0, 1.40, (1, 1, 1), verts=28, r2=r1), rig), m)
        sh = setcloth(link(sphere((0, 0, 1.41), 0.27 if not big else 0.36, (1, 1, 1), scale=(1.0, 0.78, 0.36), seg=20), rig), m)
        z_sh = 1.41
        if style in ('wrap', 'towel'):
            # 布の端：肩から腰へ斜めに折り返した帯と、肩の布のたまり
            fo = setcloth(bar((0.2, -0.205, 1.36), (-0.24, -0.27, 0.52), 0.045, (1, 1, 1), parent=rig, verts=10), dark)
            fo.scale = (1.0, 0.45, 1.0)
            setcloth(link(sphere((0.16, -0.02, 1.43), 0.1, (1, 1, 1), scale=(1.3, 1.1, 0.7), seg=12), rig), dark)
            pc = pin if pin is not None else rnd.choice(['#f2a0b0', '#8ad0e0', '#f2d24b', '#a0d890'])
            if pc:
                for dz in (0.0, -0.32):
                    pn = link(box((0.13 - dz * 0.3, -0.24 + dz * 0.05, 1.2 + dz), (0.035, 0.03, 0.09), hexc(pc)), rig)
        elif style == 'gown':
            # タオルのガウン：前の合わせ・帯・えり
            setcloth(bar((0.03, -0.225, 1.4), (-0.05, -0.29, 0.1), 0.02, (1, 1, 1), parent=rig, verts=8), dark)
            belt = setcloth(link(cyl((0, 0, 0.98), 0.282, 0.07, (1, 1, 1), verts=28), rig), dark)
            for sx in (-1, 1):
                setcloth(bar((sx * 0.1, -0.12, 1.47), (sx * 0.01, -0.22, 1.27), 0.03, (1, 1, 1), parent=rig, verts=8), m)
        elif big:
            hz = 1.58
            hd = setcloth(link(sphere((0, 0.14, hz + 0.04), 0.21, (1, 1, 1), scale=(1.05, 0.85, 1.05), seg=20), rig), m)
            # 布団の前の合わせ目
            setcloth(bar((0.06, -0.33, 1.4), (0.1, -0.45, 0.1), 0.035, (1, 1, 1), parent=rig, verts=8), dark)
        if hood or (hood is None and style == 'towel' and rnd.random() < 0.0):
            setcloth(link(sphere((0, 0.06, 1.62), 0.17, (1, 1, 1), scale=(1.05, 1.0, 1.0), seg=16), rig), m)
        if jacket:
            jm = cloth_mat(*jacket)
            jp = [setcloth(link(cyl((0, 0, 1.13), 0.305, 0.62, (1, 1, 1), verts=28, r2=0.24), rig), jm),
                  setcloth(link(sphere((0, 0, 1.43), 0.285, (1, 1, 1), scale=(1.0, 0.8, 0.33), seg=20), rig), jm),
                  bar((0.0, -0.262, 1.4), (0.0, -0.295, 0.84), 0.012, hexc('#3a3a3a'), parent=rig, verts=6)]
            for k in range(3):
                jp.append(link(sphere((0.0, -0.285 + k * 0.0, 1.32 - k * 0.17), 0.016, hexc('#e8e2d0'), seg=8), rig))
            if jacket_at:
                for an in p['arms']:
                    jp.append(setcloth(link(cyl((0, 0, -0.26), 0.068, 0.5, (1, 1, 1), verts=12), O[an]), jm))
                for o in jp:
                    appear(o, jacket_at)
        wrap_obj = wrap
        bag_pts = ((0.19, 0.0, 1.5), (0.0, -0.27 if not big else -0.36, 1.18), (-0.3 if not big else -0.44, -0.12, 0.84))
        band_z = -0.16
    else:  # sit（いす・床）
        for ch in list(rig.children):
            if ch.name.startswith('cyl') and ch != torso:
                ch.hide_render = True
        k = 1.25 if big else 1.0
        wrap = setcloth(link(cyl((0, -0.03, 0.71), 0.29 * k, 0.64, (1, 1, 1), verts=28, r2=0.215 * k), rig), m)
        setcloth(link(sphere((0, 0, 0.98), 0.27 * k, (1, 1, 1), scale=(1.0, 0.78, 0.36), seg=20), rig), m)
        setcloth(link(box((0, -0.28, 0.45), (0.5 * k, 0.6, 0.24), (1, 1, 1), bevel=0.07), rig), m)   # ひざの上の布
        setcloth(link(box((0, -0.56, 0.24), (0.5 * k, 0.1, 0.48), (1, 1, 1), bevel=0.04), rig), m)    # すねの前に垂れる布
        for sx in (-0.08, 0.08):
            link(sphere((sx, -0.64, 0.035), 0.045, skin, scale=(1.0, 1.6, 0.6), seg=10), rig)
        if big:
            setcloth(link(sphere((0, 0.14, 1.24), 0.21, (1, 1, 1), scale=(1.05, 0.85, 1.05), seg=20), rig), m)
        elif style in ('wrap', 'towel'):
            pc = pin if pin is not None else rnd.choice(['#f2a0b0', '#8ad0e0', '#f2d24b', '#a0d890'])
            if pc:
                link(box((0.12, -0.235, 0.85), (0.035, 0.03, 0.09), hexc(pc)), rig)
        elif style == 'gown':
            setcloth(link(cyl((0, -0.03, 0.62), 0.29, 0.07, (1, 1, 1), verts=28), rig), dark)
        if jacket:
            jm = cloth_mat(*jacket)
            setcloth(link(cyl((0, -0.02, 0.76), 0.3, 0.55, (1, 1, 1), verts=28, r2=0.235), rig), jm)
        wrap_obj = wrap
        bag_pts = ((0.19, 0.0, 1.1), (0.0, -0.27, 0.8), (-0.3, -0.15, 0.55))
        band_z = -0.12
    p['wrap'] = wrap_obj.name
    breathe(wrap_obj, n, 0.015, seed=rnd.randint(0, 999))
    if band:
        j = O[p['arms'][0]]
        b = link(cyl((0, 0, band_z), 0.066, 0.1, BAND[band], verts=16), j)
        if band_at:
            appear(b, band_at)
        p['band'] = b.name
    if bag:
        bc = bag if isinstance(bag, tuple) else rnd.choice(BAGS)
        parts = [bar(bag_pts[0], bag_pts[1], 0.022, bc, parent=rig, verts=6), bar(bag_pts[1], bag_pts[2], 0.022, bc, parent=rig, verts=6)]
        bx = bag_pts[2]
        parts.append(link(box((bx[0] - 0.02, bx[1] - 0.04, bx[2] - 0.12), (0.12, 0.3, 0.3), bc, bevel=0.03), rig))
        if bag_at:
            for o in parts:
                appear(o, bag_at)
    if eyes:
        add_eyes(p)
    return p


def school_kid(loc, rot_z=0.0, s=0.74, name='kid', kind='gakuran', seed=None, bag=False):
    """真新しい学生服の子ども（黒い詰め襟。kind='sailor' はセーラー服）"""
    rnd = random.Random(seed if seed is not None else sum(map(ord, name)))
    if kind == 'gakuran':
        p = person(loc, hexc('#1c1e24'), pants=hexc('#1c1e24'), skin=rnd.choice(SKIN[:3]), hair=rnd.choice(HAIRS[:3]),
                   rot_z=rot_z, s=s, name=name)
        rig = O[p['rig']]
        link(cyl((0, 0, 1.45), 0.1, 0.09, hexc('#1c1e24'), verts=16), rig)   # 詰め襟
        link(box((0, -0.075, 1.47), (0.06, 0.04, 0.05), hexc('#f4f2ec')), rig)
        for k in range(5):
            link(sphere((0, -0.192 + k * 0.004, 1.36 - k * 0.11), 0.016, hexc('#d8b040'), seg=8), rig)
    else:
        p = person(loc, hexc('#22304a'), pants=hexc('#22304a'), skin=rnd.choice(SKIN[:3]), hair=rnd.choice(HAIRS[:3]),
                   rot_z=rot_z, s=s, name=name)
        rig = O[p['rig']]
        link(box((0, 0.14, 1.36), (0.36, 0.1, 0.16), hexc('#22304a')), rig)   # えり
        link(box((0, 0.195, 1.36), (0.34, 0.01, 0.02), hexc('#ffffff')), rig)
        link(cone((0, -0.17, 1.22), 0.05, 0.1, hexc('#c83a3a'), rot=(math.pi, 0, 0), verts=4), rig)  # スカーフ
        link(cyl((0, 0, 0.72), 0.2, 0.34, hexc('#22304a'), verts=20, r2=0.16), rig)  # スカート（下は濃い色のタイツ）
    if bag:
        link(box((0, 0.24, 1.15), (0.34, 0.16, 0.38), hexc('#3a3028'), bevel=0.03), rig)  # 背中のかばん
    add_eyes(p)
    return p


def futon_sleeper(loc, rot_z=0.0, cloth=FUTON, name='sl', skin=None, hair=None, n=240, closed=True, mattress=True):
    """敷き布団で眠る人。体は掛け布団の山の下。見えるのは顔だけ（頭は -y の枕の上）"""
    root = empty(loc, 'futon_' + name); root.rotation_euler = (0, 0, rot_z)
    if mattress:
        link(box((0, 0.1, 0.06), (1.0, 2.1, 0.12), hexc('#f2efe8'), bevel=0.03), root)
    link(box((0, -0.84, 0.17), (0.52, 0.3, 0.12), hexc('#fbf8f2'), bevel=0.05), root)
    p = person((0, 0.06, 0.12), hexc('#e8e4dc'), pose='lie', skin=skin or SKIN[0], hair=hair or hexc('#2b2420'), name=name)
    p.parent = root
    nk = O[p['neck']]
    nk.location.y += 0.04; nk.location.z += 0.02
    nk.rotation_euler = (-math.pi / 2, 0, 0)
    q = setcloth(boxc((0, 0.22, 0.27), (1.04, 1.7, 0.3), (1, 1, 1), bevel=0.1), cloth_mat(*cloth))
    q.parent = root
    breathe(q, n, 0.035, axes=(2,), seed=sum(map(ord, name)), period=60)
    add_eyes(p, closed=closed)
    p['quilt'] = q.name
    return root, p


def mannequin(loc, rot_z=0.0, s=1.0, arm=0.0, name='mq'):
    """服を失ったマネキン：白く、のっぺりした形（動かない）"""
    W = hexc('#f4f2ee')
    p = person(loc, W, pants=W, skin=W, hair=W, rot_z=rot_z, s=s, name=name)
    p['kind'] = 'mannequin'   # animate_life の対象から外す
    for ln in p['legs']:
        for ch in O[ln].children:
            if not ch.name.startswith('cyl'):
                ch.hide_render = True
    if arm:
        O[p['arms'][1]].rotation_euler = (arm, 0, 0)
    link(cyl((0, 0, 0.02), 0.22, 0.04, hexc('#9a9a96'), verts=20), p)
    link(cyl((0, 0.12, 0.4), 0.015, 0.8, hexc('#9a9a96')), p)
    return p


# ---------------- ハンガーと服 ----------------
def hanger(loc, parent=None, c=hexc('#c8ccd0'), rot_z=0.0, name='hanger'):
    """ハンガー：原点がフック。肩は x 方向（-y を向く）"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    if parent is not None:
        root.parent = parent
    bar((0, 0, 0.0), (0, 0, -0.07), 0.006, c, parent=root, verts=6)
    for sx in (-1, 1):
        bar((0, 0, -0.07), (sx * 0.21, 0, -0.17), 0.008, c, parent=root, verts=6)
    bar((-0.21, 0, -0.17), (0.21, 0, -0.17), 0.006, c, parent=root, verts=6)
    return root


def garment(kind, parent, cloth=None, z=-0.17):
    """ハンガーに掛かった服。kind：shirt / coat / gakuran / jacket / gown"""
    root = empty((0, 0, z), 'garment'); link(root, parent)
    if kind == 'shirt':
        m = cloth_mat(*(cloth or ('plain', '#dfe9f4', '#dfe9f4', 1))); L = 0.62; w = 0.44
    elif kind == 'coat':
        m = cloth_mat(*(cloth or ('plain', '#7a5a42', '#7a5a42', 1))); L = 0.95; w = 0.48
    elif kind == 'gakuran':
        m = cloth_mat('plain', '#1c1e24'); L = 0.62; w = 0.44
    elif kind == 'gown':
        m = cloth_mat(*(cloth or TOWEL)); L = 1.0; w = 0.48
    else:
        m = cloth_mat(*(cloth or CLOTHS[0])); L = 0.6; w = 0.46
    setcloth(link(box((0, 0, -L / 2), (w, 0.06, L), (1, 1, 1), bevel=0.015), root), m)
    for sx in (-1, 1):
        o = setcloth(link(box((sx * (w / 2 + 0.04), 0, -0.3), (0.09, 0.05, 0.52 if kind != 'coat' else 0.6), (1, 1, 1), rot=(0, sx * 0.12, 0)), root), m)
    if kind in ('shirt', 'jacket', 'coat'):
        for sx in (-1, 1):
            link(box((sx * 0.06, -0.035, -0.04), (0.1, 0.02, 0.07), hexc('#f6f4ee') if kind == 'shirt' else hexc(shade_hex('#7a5a42', 0.7)) if kind == 'coat' else hexc('#e8e2d0'), rot=(0, sx * 0.5, 0)), root)
        for k in range(4 if kind != 'coat' else 5):
            link(sphere((0.0, -0.035, -0.12 - k * 0.13), 0.012, hexc('#e8e4da') if kind != 'coat' else hexc('#2a2a2a'), seg=8), root)
    if kind == 'gakuran':
        link(box((0, -0.01, -0.02), (0.18, 0.08, 0.07), hexc('#1c1e24')), root)
        for k in range(5):
            link(sphere((0.0, -0.036, -0.1 - k * 0.1), 0.014, hexc('#d8b040'), seg=8), root)
    if kind == 'gown':
        link(box((0, -0.035, -0.45), (w + 0.02, 0.02, 0.06), hexc(shade_hex((cloth or TOWEL)[1], 0.8))), root)
    return root


def swing(o, n, amp=0.12, seed=1, f0=1, decay=None):
    """ハンガーの揺れ（前後と、少しのねじれ）。decay を渡すと、そのフレームまでに揺れがおさまる"""
    rnd = random.Random(seed)
    per = rnd.randint(26, 40); ph = rnd.random() * 6.28
    rz0 = o.rotation_euler.z
    for f in range(f0, n + 1, 3):
        k = 1.0 if decay is None else max(0.15, 1 - (f - f0) / max(1, decay - f0))
        o.rotation_euler.x = amp * k * math.sin(ph + 2 * math.pi * f / per)
        o.rotation_euler.z = rz0 + 0.6 * amp * k * math.sin(ph * 0.7 + 2 * math.pi * f / (per * 1.3))
        o.keyframe_insert('rotation_euler', frame=f)


# ---------------- 部屋・家具 ----------------
def closet(loc, n, w=2.0, d=0.65, h=2.3, garments=('shirt', 'coat', 'shirt', 'coat'), vanish_at=None, doors=None,
           shirt_one=None, door_c='#d8cbb4', seed=1, swing_amp=0.0, swing_from=1):
    """クローゼット（-y を向く）。doors=(f_open, 開き具合 0〜1) で引き戸が開く（None なら開いたまま）。
    garments を vanish_at フレームで消す。shirt_one=f でハンガーが一つ（シャツ付き）現れる。戻り値：ハンガーのリスト"""
    root = empty(loc, 'closet')
    C = hexc('#efe8dc'); Dk = hexc('#a08870')
    link(box((0, d / 2, h / 2), (w + 0.1, 0.05, h), hexc('#e2d8c6')), root)
    for sx in (-1, 1):
        link(box((sx * (w / 2 + 0.04), 0, h / 2), (0.06, d, h), C), root)
    link(box((0, 0, h + 0.02), (w + 0.14, d, 0.06), C), root)
    link(box((0, 0, 0.02), (w + 0.14, d, 0.05), Dk), root)
    link(box((0, 0.05, h - 0.32), (w, d - 0.1, 0.03), C), root)  # 上の棚
    link(cyl((0, 0.02, h - 0.45), 0.014, w, hexc('#b8bcc0'), rot=(0, math.pi / 2, 0)), root)
    hs = []
    k = len(garments)
    for i, g in enumerate(garments):
        x = -w / 2 + (i + 0.5) * w / max(1, k)
        hg = hanger((x, 0.02, h - 0.45), parent=root, name='hg')
        if g:
            gm = garment(g, hg, cloth=random.Random(seed + i).choice(CLOTHS[:5]) if g == 'jacket' else None)
            if vanish_at:
                vanish(gm, vanish_at + i * 2)
        hs.append(hg)
    if swing_amp:
        for i, hg in enumerate(hs):
            swing(hg, n, swing_amp, seed=seed + i, f0=swing_from)
    if shirt_one:
        hg = hanger((0.0, 0.02, h - 0.45), parent=root, name='hg1')
        garment('shirt', hg, cloth=('plain', '#cfe0ee', '#cfe0ee', 1))
        appear(hg, shirt_one)
        swing(hg, n, 0.08, seed=seed + 9, f0=shirt_one, decay=shirt_one + 70)
        hs.append(hg)
    # 引き戸（2枚）
    for sx in (-1, 1):
        dr = boxc((sx * w / 4, -d / 2 - 0.03, h / 2), (w / 2, 0.04, h - 0.1), hexc(door_c))
        dr.parent = root
        link(box((0, -0.025, 0), (0.03, 0.02, 0.2), hexc('#8a7a64')), dr)
        if doors is not None:
            f_open, amt = doors
            dr.keyframe_insert('location', frame=1); dr.keyframe_insert('location', frame=max(2, f_open))
            dr.location.x = sx * (w / 4 + w / 2 * amt * 0.92); dr.location.y -= 0.05 * (1 if sx > 0 else 0)
            dr.keyframe_insert('location', frame=f_open + 16)
        else:
            dr.location.x = sx * (w / 4 + w / 2 * 0.92)
    return hs


def wa_room(w=5.0, d=4.5, h=2.5, night=False, floor='#cdbf94', wall='#efe6d6', window=True, curtains=None):
    """和室：畳の床と壁。window=True で奥の壁に窓（curtains=(柄…) でカーテン）"""
    room(w, d, h, floor=hexc(floor), wall=hexc(wall), window=False, night=night)
    for i in range(int(w)):
        box((-w / 2 + 0.5 + i, 0, 0.003), (0.02, d, 0.006), hexc(shade_hex(floor, 0.85)))
    if window:
        glass = hexc('#1d2a44') if night else hexc('#bcd3e6')
        box((0.6, d / 2 - 0.06, 1.4), (1.8, 0.04, 1.3), glass)
        box((0.6, d / 2 - 0.09, 2.08), (2.0, 0.04, 0.06), hexc('#f7f3ea'))
        box((0.6, d / 2 - 0.09, 0.74), (2.0, 0.04, 0.06), hexc('#f7f3ea'))
        if curtains:
            for sx in (-1, 1):
                c = setcloth(box((0.6 + sx * 0.75, d / 2 - 0.16, 1.4), (0.5, 0.05, 1.45), (1, 1, 1)), cloth_mat(*curtains))


def alarm_clock(loc, n, ring=(1, 60)):
    root = empty(loc, 'alarm')
    link(cyl((0, 0, 0.09), 0.08, 0.05, hexc('#e05a4a'), rot=(math.pi / 2, 0, 0), verts=24), root)
    link(cyl((0, -0.027, 0.09), 0.066, 0.01, hexc('#fbf8f2'), rot=(math.pi / 2, 0, 0), verts=24), root)
    for sx in (-1, 1):
        link(sphere((sx * 0.05, 0, 0.17), 0.03, hexc('#e05a4a'), seg=10), root)
        link(cyl((sx * 0.05, 0, 0.025), 0.008, 0.05, hexc('#555555')), root)
    hds = empty((0, -0.034, 0.09), 'hands'); link(hds, root)
    link(box((0, 0, 0.022), (0.008, 0.004, 0.044), hexc('#222222')), hds)
    link(box((0.018, 0, 0.0), (0.036, 0.004, 0.007), hexc('#222222')), hds)
    a, b = ring
    root.keyframe_insert('rotation_euler', frame=1)
    for f in range(a, b, 2):
        root.rotation_euler.y = 0.12 if (f // 2) % 2 else -0.12
        root.keyframe_insert('rotation_euler', frame=f)
    root.rotation_euler.y = 0; root.keyframe_insert('rotation_euler', frame=b + 2)
    return root


def drawers(loc, n, f_open=None, rows=4, w=0.9, d=0.45, h=1.0, c='#b88a5a'):
    """たんす。f_open から上の段から順に引き出しが開く（中は空）"""
    root = empty(loc, 'tansu')
    link(box((0, 0, h / 2), (w, d, h), hexc(shade_hex(c, 0.8))), root)
    dh = (h - 0.08) / rows
    out = []
    for r in range(rows):
        z = 0.05 + dh * (r + 0.5)
        dr = empty((0, -0.02, z), 'drawer'); dr.parent = root
        ww, dd, hh = w - 0.06, d - 0.02, dh - 0.03
        link(box((0, -dd / 2 + 0.01, 0), (ww, 0.02, hh), hexc(c)), dr)               # 前板
        link(box((0, dd / 2 - 0.01, -0.01), (ww, 0.02, hh - 0.02), hexc(c)), dr)
        for sx in (-1, 1):
            link(box((sx * (ww / 2 - 0.01), 0, -0.01), (0.02, dd, hh - 0.02), hexc(c)), dr)
        link(box((0, 0, -hh / 2 + 0.01), (ww, dd, 0.02), hexc('#e8dcc4')), dr)       # 底（空）
        link(box((0, -(d - 0.02) / 2 - 0.012, 0), (0.18, 0.025, 0.035), hexc('#7a5a3a')), dr)
        # 上面を開けて中の空が見えるよう、ふたは付けない
        if f_open is not None:
            fo = f_open + (rows - 1 - r) * 14
            dr.keyframe_insert('location', frame=1); dr.keyframe_insert('location', frame=fo)
            dr.location.y -= d * 0.7; dr.keyframe_insert('location', frame=fo + 10)
        out.append(dr)
    return out


def breath_puffs(n, mouths, every=48, seed=1, size=0.07):
    """白い息：口の前に小さな白い玉がふくらんで薄れる（mouths は (位置, 前の向き) のリスト）"""
    rnd = random.Random(seed)
    out = []
    for (pos, fwd) in mouths:
        pos = Vector(pos); fwd = Vector(fwd).normalized()
        f = rnd.randint(1, every)
        while f < n:
            m = gmat((0.96, 0.97, 1.0), 0.0, 'breath')
            o = sphere(tuple(pos), size, (1, 1, 1), seg=10); o.data.materials.clear(); o.data.materials.append(m)
            o.scale = (0.3, 0.3, 0.3); o.keyframe_insert('scale', frame=max(1, f)); o.keyframe_insert('location', frame=max(1, f))
            o.scale = (1.4, 1.4, 1.1); o.location = tuple(pos + fwd * 0.28 + Vector((0, 0, 0.06))); o.keyframe_insert('scale', frame=f + 26)
            o.keyframe_insert('location', frame=f + 26)
            m.diffuse_color = (0.96, 0.97, 1.0, 0.0); m.keyframe_insert('diffuse_color', frame=max(1, f))
            m.diffuse_color = (0.96, 0.97, 1.0, 0.55); m.keyframe_insert('diffuse_color', frame=f + 6)
            m.diffuse_color = (0.96, 0.97, 1.0, 0.0); m.keyframe_insert('diffuse_color', frame=f + 28)
            out.append(o)
            f += every + rnd.randint(-8, 8)
    return out


def mouth_of(p, fwd=(0, -1, 0)):
    """人の口の前（ワールド座標）と前向き"""
    bpy.context.view_layer.update()
    h = O[p['head']]
    mw = h.matrix_world
    return (tuple(mw @ Vector((0, -0.15, -0.04))), tuple((mw.to_3x3() @ Vector((0, -1, 0))).normalized()))


def airflow(n, origin, direction, k=10, length=1.6, spread=0.5, seed=2, period=36):
    """エアコンの風：薄い白い筋が吹き出し口から流れる"""
    rnd = random.Random(seed)
    o0 = Vector(origin); d = Vector(direction).normalized()
    side = d.cross(Vector((0, 0, 1))).normalized()
    for i in range(k):
        m = gmat((0.85, 0.93, 1.0), 0.0, 'air')
        st = o0 + side * rnd.uniform(-spread, spread)
        o = boxc(tuple(st), (0.03, 0.42, 0.012), (1, 1, 1)); o.data.materials.clear(); o.data.materials.append(m)
        o.rotation_euler = Vector((0, 1, 0)).rotation_difference(d).to_euler()
        off = rnd.randint(0, period)
        for f in range(1 - off, n + period, period):
            o.location = tuple(st); o.keyframe_insert('location', frame=max(1, f))
            o.location = tuple(st + d * length); o.keyframe_insert('location', frame=max(2, f + period - 1))
            m.diffuse_color = (0.85, 0.93, 1.0, 0.0); m.keyframe_insert('diffuse_color', frame=max(1, f))
            m.diffuse_color = (0.85, 0.93, 1.0, 0.45); m.keyframe_insert('diffuse_color', frame=max(2, f + period // 3))
            m.diffuse_color = (0.85, 0.93, 1.0, 0.0); m.keyframe_insert('diffuse_color', frame=max(3, f + period - 1))


def aircon(loc, rot_z=0.0):
    root = empty(loc, 'ac'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0), (0.9, 0.24, 0.3), hexc('#f4f4f0'), bevel=0.03), root)
    link(box((0, -0.11, -0.1), (0.8, 0.04, 0.05), hexc('#c8ccd0')), root)
    link(box((0.36, -0.125, 0.08), (0.03, 0.01, 0.03), hexc('#6ad08a')), root)
    return root


def door(loc, rot_z=0.0, w=0.85, h=2.0, c='#7a5a42'):
    root = empty(loc, 'door'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, h / 2), (w + 0.12, 0.1, h + 0.08), hexc('#e8e0d2')), root)
    lf = boxc((0, -0.04, h / 2), (w, 0.06, h), hexc(c)); lf.parent = root
    link(sphere((w * 0.38, -0.05, 0.0), 0.03, hexc('#c8b070'), seg=10), lf)
    return root, lf


# ---------------- 街 ----------------
def glass(loc, size, a=0.16, rgb=(0.75, 0.85, 0.95)):
    o = box(loc, size, (1, 1, 1)); o.data.materials.clear(); o.data.materials.append(gmat(rgb, a, 'glass'))
    o.visible_shadow = False
    return o


def shop_street(night=True, k=5, side=1, seed=4, x0=-14.0, lit=True):
    """商店街：通りの片側（y=side*4.5 より奥）に、ガラス張りの店が並ぶ。
    ショーウィンドウは y=side*(4.5..5.8)、z=0..3。戻り値：各店のショーウィンドウの中心 (x, y)"""
    rnd = random.Random(seed)
    out = []
    for i in range(k):
        x = x0 + i * 7.0
        wall = rnd.choice(WALLS)
        box((x, side * 7.2, 3.0), (6.8, 2.8, 6.0), wall)                    # 店の奥
        box((x, side * 5.15, 4.5), (6.8, 1.3, 3.0), wall)                   # 2階の正面
        for sx in (-1, 1):
            box((x + sx * 3.2, side * 5.15, 1.5), (0.4, 1.3, 3.0), wall)    # 柱
        box((x, side * 5.15, 0.06), (6.0, 1.3, 0.12), hexc('#d8d2c4'))     # 飾り台
        box((x, side * 5.79, 1.5), (6.0, 0.02, 3.0), hexc('#f2e2b8') if (night and lit) else hexc('#e8e0d0'))  # 奥の明かり
        glass((x, side * 4.52, 1.5), (6.0, 0.04, 3.0))
        box((x, side * 4.4, 3.2), (6.6, 0.6, 0.12), rnd.choice([hexc('#c84a3a'), hexc('#3a6aa0'), hexc('#4a8a5a'), hexc('#d8a03a')]))
        box((x, side * 4.47, 3.75), (4.0, 0.06, 0.7), hexc('#f4efe6'))  # 看板（字なし）
        out.append((x, side * 5.15))
    box((x0 + (k - 1) * 3.5, 0, 0.0), (k * 7 + 10, 8.6, 0.1), hexc('#8c8a86'))
    ground(rgb=hexc('#3a3c44') if night else hexc('#b8b2a6'))
    for i in range(k + 1):
        x = x0 - 3.5 + i * 7.0
        cyl((x, side * 3.9, 2.2), 0.06, 4.4, hexc('#6a6a6a'))
        if night:
            ball((x, side * 3.6, 4.3), 0.18, (1.0, 0.86, 0.55), name='lamp')
    return out


def street_houses(n_houses=6, seed=7, y=7.0, bare=False, night=False, x0=-18.0, pitch=7.5, curtains=True, peek=False):
    """住宅の並び（-y を向く窓）。bare=True はカーテンを外した窓（中が見える）。戻り値：窓の中心のリスト"""
    rnd = random.Random(seed)
    wins = []
    for i in range(n_houses):
        x = x0 + i * pitch
        wall = rnd.choice(WALLS); roofc = rnd.choice(ROOFS)
        box((x, y, 3.0), (6.4, 6.0, 6.0), wall)
        roof((x, y, 6.0), 6.8, 6.4, 1.8, roofc)
        box((x + 1.8, y - 3.03, 1.0), (0.9, 0.06, 2.0), hexc('#6a5040'))
        for (wx, wz) in ((-1.3, 1.5), (-1.3, 4.3), (1.6, 4.3)):
            gl = hexc('#f2e2b8') if (bare and night) else (hexc('#dfe6ec') if bare else hexc('#8aa3b8'))
            box((x + wx, y - 3.02, wz), (1.6, 0.05, 1.2), gl)
            box((x + wx, y - 3.06, wz - 0.65), (1.8, 0.1, 0.08), hexc('#f7f3ea'))
            if curtains and not bare:
                cm = cloth_mat(*rnd.choice(CLOTHS))
                for sx in (-1, 1):
                    setcloth(box((x + wx + sx * 0.4, y - 3.06, wz), (0.78, 0.03, 1.16), (1, 1, 1)), cm)
            wins.append((x + wx, y - 3.0, wz))
    return wins


def station_building(clock=True, night=False):
    """駅前：駅舎・改札の列・時計（8:00）"""
    box((0, 9, 3.5), (26, 8, 7), hexc('#e2ddd2'))
    box((0, 4.96, 5.6), (8, 0.1, 1.0), hexc('#3a6aa0'))
    label3d('えき', (0, 4.9, 5.42), 0.7, (1, 1, 1))
    box((0, 4.97, 1.6), (12, 0.08, 3.2), hexc('#3a3e44'))   # 改札の奥（暗い）
    for k in range(7):
        x = -4.5 + k * 1.5
        box((x, 4.2, 0.5), (0.25, 1.6, 1.0), hexc('#c8ccd0'))
        box((x, 3.5, 1.02), (0.22, 0.2, 0.04), hexc('#3a7ad0'))
    for x in (-10, -7.5, 7.5, 10):
        box((x, 4.95, 1.4), (2.0, 0.1, 2.8), hexc('#9fb6c8'))
    if clock:
        cl = tex_plane('fk_clock8', draw_clock(8, 0), (-5.2, 4.88, 5.5), 1.3, 1.3, size=(512, 512))
    box((0, -2, -0.02), (60, 26, 0.04), hexc('#c2bcb0'))


def draw_clock(hh, mm):
    def f(im, d):
        W = 512
        d.rectangle((0, 0, W, W), fill=(60, 64, 70))
        d.ellipse((16, 16, W - 16, W - 16), fill=(250, 248, 242))
        for k in range(12):
            a = k * math.pi / 6
            x0 = W / 2 + 200 * math.sin(a); y0 = W / 2 - 200 * math.cos(a)
            x1 = W / 2 + 225 * math.sin(a); y1 = W / 2 - 225 * math.cos(a)
            d.line((x0, y0, x1, y1), fill=(40, 40, 40), width=10)
        ah = (hh % 12 + mm / 60) * math.pi / 6; am = mm * math.pi / 30
        d.line((W / 2, W / 2, W / 2 + 120 * math.sin(ah), W / 2 - 120 * math.cos(ah)), fill=(30, 30, 30), width=18)
        d.line((W / 2, W / 2, W / 2 + 185 * math.sin(am), W / 2 - 185 * math.cos(am)), fill=(30, 30, 30), width=11)
    return f


def signal(loc, rot_z=0.0, off=True):
    root = empty(loc, 'signal'); root.rotation_euler = (0, 0, rot_z)
    link(cyl((0, 0, 1.8), 0.07, 3.6, hexc('#8a8a86')), root)
    link(box((0.6, 0, 3.5), (1.3, 0.3, 0.42), hexc('#3a3e44')), root)
    for k, c in enumerate(('#2a5a3a', '#6a5a2a', '#6a2a2a') if off else ('#3ad06a', '#f0c030', '#e04a3a')):
        link(cyl((0.2 + k * 0.4, -0.16, 3.5), 0.13, 0.04, hexc(c), rot=(math.pi / 2, 0, 0)), root)
    return root


def crossing(seed=5):
    """交差点：十字の道路・横断歩道・信号（消えている）・角の建物"""
    ground(rgb=hexc('#b8b2a6'))
    box((0, 0, 0.01), (80, 9, 0.02), hexc('#5a5a5e'))
    box((0, 0, 0.012), (9, 80, 0.02), hexc('#5a5a5e'))
    for k in range(7):
        box((-3.6 + k * 1.2, -6.0, 0.03), (0.6, 2.4, 0.01), hexc('#f2f2ee'))
        box((-3.6 + k * 1.2, 6.0, 0.03), (0.6, 2.4, 0.01), hexc('#f2f2ee'))
        box((-6.0, -3.6 + k * 1.2, 0.03), (2.4, 0.6, 0.01), hexc('#f2f2ee'))
        box((6.0, -3.6 + k * 1.2, 0.03), (2.4, 0.6, 0.01), hexc('#f2f2ee'))
    for (x, y, rz) in ((-5.5, -5.5, 0), (5.5, 5.5, math.pi), (5.5, -5.5, math.pi / 2), (-5.5, 5.5, -math.pi / 2)):
        signal((x, y, 0), rot_z=rz)
    rnd = random.Random(seed)
    for (cx, cy) in ((-16, -16), (16, -16), (-16, 16), (16, 16)):
        tower((cx, cy, 0), 14, 14, rnd.uniform(10, 24), rnd.choice(WALLS))


def map_plane(loc, w, rot=(0, 0, 0)):
    """世界地図の板（earth.png を正距円筒図法のまま貼る）"""
    m = bpy.data.materials.new('fk_map'); m.use_nodes = True
    t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load('/home/user/work_neko/assets/earth.png')
    m.node_tree.links.new(t.outputs['Color'], m.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
    bpy.ops.mesh.primitive_plane_add(location=loc, rotation=rot)
    o = bpy.context.object; o.scale = (w / 2, w / 4, 1); o.data.materials.append(m)
    return o


def lonlat_xy(lon, lat, w, cx=0.0, cy=0.0):
    return (cx + lon / 360.0 * w, cy + lat / 180.0 * w / 2)


def arrow_curve(p0, p1, n, f0, f1, rgb, lift=1.0, r=0.06, k=16, name='arrow'):
    """p0 から p1 へ、弧を描いて伸びる矢印（f0〜f1 で伸び、先に三角の頭）"""
    p0 = Vector(p0); p1 = Vector(p1)
    segs = []
    pts = []
    for i in range(k + 1):
        t = i / k
        q = p0.lerp(p1, t); q.z += lift * 4 * t * (1 - t)
        pts.append(q)
    for i in range(k):
        o = bar(tuple(pts[i]), tuple(pts[i + 1]), r, rgb, verts=8)
        appear(o, int(f0 + (f1 - f0) * i / k))
        segs.append(o)
    d = (pts[-1] - pts[-2]).normalized()
    hd = cone(tuple(pts[-1]), r * 3.0, r * 6.0, rgb, verts=12)
    hd.rotation_euler = Vector((0, 0, 1)).rotation_difference(d).to_euler()
    appear(hd, f1)
    return segs, hd


def container_ship(loc, rot_z=0.0, s=1.0, seed=3):
    rnd = random.Random(seed)
    root = empty(loc, 'ship'); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    link(box((0, 0, 1.0), (30, 6, 2.6), hexc('#2f4a6a'), bevel=0.2), root)
    link(box((0, 0, -0.1), (29, 5.6, 0.6), hexc('#a83a2a')), root)
    link(cone((-15.5, 0, 1.0), 3.0, 0.1, hexc('#2f4a6a'), rot=(0, math.pi / 2, 0), verts=3), root)
    link(box((11.5, 0, 4.0), (3.5, 5.0, 4.0), hexc('#f2f2ee')), root)
    link(box((11.5, -2.52, 4.6), (3.0, 0.05, 0.5), hexc('#4d5d6b')), root)
    cols = [hexc('#c84a3a'), hexc('#3a6aa0'), hexc('#d8a03a'), hexc('#4a8a5a'), hexc('#8a8a86'), hexc('#c86a8a')]
    for i in range(8):
        for j in range(3):
            for l in range(rnd.randint(1, 3)):
                link(box((-12 + i * 2.8, -1.7 + j * 1.7, 2.95 + l * 1.2), (2.6, 1.6, 1.15), rnd.choice(cols)), root)
    return root


def sea(c='#3d6f9c'):
    box((0, 0, -0.06), (2000, 2000, 0.1), hexc(c))


def sewing_machine(loc, rot_z=0.0, c='#f2f0ea', s=1.0, n=240, run=(1, None), industrial=False):
    """ミシン。run=(f0, f1) の間、針が上下する。戻り値：(root, 針)"""
    root = empty(loc, 'mishin'); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    C = hexc(c)
    link(box((0, 0, 0.03), (0.42, 0.2, 0.06), C, bevel=0.01), root)
    link(box((0.15, 0, 0.17), (0.09, 0.16, 0.24), C, bevel=0.01), root)
    link(box((-0.01, 0, 0.27), (0.38, 0.13, 0.08), C, bevel=0.01), root)
    link(box((-0.17, 0, 0.2), (0.06, 0.1, 0.1), C, bevel=0.01), root)
    link(cyl((0.22, 0, 0.27), 0.05, 0.03, hexc('#888888'), rot=(0, math.pi / 2, 0)), root)
    link(cyl((0.05, 0.0, 0.33), 0.018, 0.05, hexc('#d84a4a')), root)  # 糸
    nd = empty((-0.17, -0.02, 0.15), 'needle'); link(nd, root)
    link(cyl((0, 0, 0), 0.004, 0.06, hexc('#cccccc')), nd)
    f0, f1 = run
    f1 = f1 or n
    for f in range(f0, f1, 2):
        nd.location.z = 0.15 if (f // 2) % 2 else 0.11
        nd.keyframe_insert('location', index=2, frame=f)
    return root, nd


def worktable(loc, w=1.4, d=0.7, h=0.74, c='#c8b08a', rot_z=0.0):
    return table(loc, w=w, d=d, h=h, c=hexc(c), rot_z=rot_z)


def fabric_slide(o, n, axis=0, dist=0.6, period=48):
    """布が少しずつ送られる（ミシンの下を流れる）"""
    b = o.location[axis]
    for f in range(1, n + period, period):
        v = list(o.location); v[axis] = b; o.location = v; o.keyframe_insert('location', index=axis, frame=f)
        v[axis] = b + dist; o.location = v; o.keyframe_insert('location', index=axis, frame=f + period - 1)
    linear(o, 'location')


def walk_line(people, n, p0, p1, speed=1.0, spacing=1.2, phase=0.0):
    """人を p0→p1 の線に沿って歩かせる（n フレームで speed m/s。列を spacing で空ける）"""
    p0 = Vector(p0); p1 = Vector(p1); L = (p1 - p0).length; d = (p1 - p0).normalized()
    for i, p in enumerate(people):
        s0 = -i * spacing + phase
        for f in (1, n):
            s_ = s0 + speed * (f - 1) / FPS
            q = p0 + d * s_
            p.location = (q.x, q.y, p.location.z); p.keyframe_insert('location', frame=f)
        linear(p, 'location')


def walk_to(p, n, dst, f0=1, f1=None):
    p.keyframe_insert('location', frame=f0)
    p.location = dst; p.keyframe_insert('location', frame=f1 or n)


def facade(n, k=3, mode='closed', seed=5, cloths=None, night=False, wall='#e6dccb', people=0, walk=False, house_w=None):
    """家の正面（-y を向く）。窓（幅1.6、高さ z=1.0..2.3）の奥に部屋が見える。
    mode：closed（カーテンを閉めた）/ peek（すき間）/ bare（カーテンなし）/ half（片側だけ残る）
    people：窓の奥に立つ人の数。戻り値：(窓の x のリスト, 人のリスト, カーテンの板のリスト)"""
    rnd = random.Random(seed)
    W = house_w or (k * 2.4 + 1.2)
    xs = [(-(k - 1) / 2 + i) * 2.4 for i in range(k)]
    wc = hexc(wall)
    box((0, 0, 0.5), (W, 0.2, 1.0), wc)
    box((0, 0, 2.85), (W, 0.2, 1.1), wc)
    edges = [-W / 2] + [e for x in xs for e in (x - 0.8, x + 0.8)] + [W / 2]
    for i in range(0, len(edges), 2):
        a, b = edges[i], edges[i + 1]
        if b - a > 0.01:
            box(((a + b) / 2, 0, 1.65), (b - a, 0.2, 1.3), wc)
    roof((0, 1.6, 3.4), W + 0.6, 3.8, 1.2, random.Random(seed).choice(ROOFS))
    box((0, 1.6, 3.35), (W, 3.2, 0.1), wc)
    for x in xs:
        glass((x, -0.08, 1.65), (1.6, 0.03, 1.3), a=0.12)
        box((x, -0.14, 0.97), (1.8, 0.16, 0.07), hexc('#f7f3ea'))
    inside = hexc('#f2e2b8') if night else hexc('#efe4d0')
    box((0, 3.2, 1.6), (W, 0.1, 3.2), inside)
    box((0, 1.6, 0.0), (W, 3.2, 0.1), hexc('#b48a63'))
    for sx in (-1, 1):
        box((sx * W / 2, 1.6, 1.6), (0.1, 3.2, 3.2), inside)
    box((0, 1.6, 3.2), (W, 3.2, 0.06), inside)
    panels = []
    cl = cloths or CLOTHS
    if mode != 'bare':
        for i, x in enumerate(xs):
            cm = cloth_mat(*cl[(i + seed) % len(cl)])
            gap = {'closed': 0.0, 'peek': 0.16, 'half': 0.0}[mode]
            sides = (-1, 1) if mode != 'half' else (-1,)
            for sx in sides:
                pw = 0.8 - gap / 2 + 0.02
                pnl = setcloth(boxc((x + sx * (gap / 2 + pw / 2), 0.16, 1.65), (pw, 0.03, 1.36), (1, 1, 1)), cm)
                panels.append(pnl)
            box((x, 0.16, 2.36), (1.9, 0.04, 0.04), hexc('#c8c4bc'))
    ppl = []
    for i in range(people):
        x = xs[i % k] + (rnd.uniform(-0.3, 0.3) if mode == 'bare' else 0.0)
        y = 0.55 + (i // k) * 0.6
        p = wrapped_person((x, y, 0.0), rot_z=rnd.uniform(-0.25, 0.25), name=f'in{i}', n=n, seed=seed * 10 + i)
        if walk:
            p.keyframe_insert('location', frame=1)
            p.location.x += rnd.choice([-1, 1]) * 0.7; p.keyframe_insert('location', frame=n)
        ppl.append(p)
    ground(rgb=hexc('#262a33') if night else hexc('#b9b2a2'))
    box((0, -2.2, 0.02), (40, 3.2, 0.04), hexc('#8c8a86'))
    return xs, ppl, panels
