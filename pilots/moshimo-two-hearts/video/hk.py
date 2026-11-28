"""「もしも全生物の心臓が2つになったら？」用の部品（猫の動画の kit.py / shots.py / shots_v5.py の上に足す）。
- hearts()：胸に光る二つの鼓動（左胸・右胸の小さな光の玉が少しずれて明滅し、淡い光の輪が広がる）
- 動物：cat() を土台に作り替える（animate_life が呼吸・首・まばたき・しっぽ・歩きを付けるので止まらない）
- 電車の車内、病院、心電図モニター（tex_plane）、腕時計、タコ・クラゲ・アリ・ミミズ など
"""
import math, random
from mathutils import Vector
from shots_v5 import *
from shots import _font, _tl, make_tex
from kit import COATS

RH = random.Random(42)


# ---------------- キーの補間（Blender 5 の層つきアクションにも対応） ----------------
def fcurves_of(idb):
    ad = getattr(idb, 'animation_data', None)
    if ad is None or ad.action is None:
        return []
    act = ad.action
    if hasattr(act, 'fcurves'):
        return list(act.fcurves)
    out = []
    for L in act.layers:
        for st in L.strips:
            for cb in st.channelbags:
                out.extend(cb.fcurves)
    return out


def set_interp(idb, kind='CONSTANT', path=None, frames=None):
    for fc in fcurves_of(idb):
        if path and fc.data_path != path:
            continue
        for k in fc.keyframe_points:
            if frames is None or int(round(k.co.x)) in frames:
                k.interpolation = kind


def appear(o, f, grow=6):
    """f フレームで、ぽんと出す"""
    s0 = o.scale.copy()
    o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=1)
    o.scale = s0; o.keyframe_insert('scale', frame=max(2, f))
    set_interp(o, 'CONSTANT', 'scale', {1})


def vanish(o, f):
    """f フレームで消す"""
    s0 = o.scale.copy()
    o.keyframe_insert('scale', frame=1)
    o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=max(2, f))
    o.scale = s0
    set_interp(o, 'CONSTANT', 'scale')


def blink(o, n, period, phase=0):
    for f in range(1, n + 1, period):
        o.scale = (1, 1, 1) if (f // period + phase) % 2 == 0 else (0, 0, 0)
        o.keyframe_insert('scale', frame=f)
    set_interp(o, 'CONSTANT', 'scale')


def linear(o, path=None):
    set_interp(o, 'LINEAR', path)

class _Objs:
    """bpy.data.objects を毎回引く（reset() のあとで古い参照を使わない）"""
    def __getitem__(self, k):
        return bpy.data.objects[k]


O = _Objs()

# ---------------- 二つの鼓動 ----------------
HB_ON = (1.0, 0.30, 0.40)
HB_DIM = (0.42, 0.03, 0.07)
HB_HALO = (1.0, 0.45, 0.55)


def gmat(rgb, a=1.0, name='glow'):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*rgb, a)
    if a < 1.0:
        try:
            m.blend_method = 'BLEND'
        except Exception:
            pass
    return m


def ball(loc, r, rgb, a=1.0, seg=16, parent=None, name='glow'):
    o = sphere(loc, r, (1, 1, 1), seg=seg, name=name)
    o.data.materials.clear(); o.data.materials.append(gmat(rgb, a, name))
    if parent is not None:
        link(o, parent)
    return o


def body_center(body):
    """体の中心（親の座標）。box() は位置をメッシュに焼き込むので、外接箱の中心から求める"""
    c = sum((Vector(v) for v in body.bound_box), Vector()) / 8
    return body.matrix_basis @ c


def local_semi(body):
    """体の半径（親の座標）。dimensions は親の拡大を含むことがあるので、外接箱×自分の scale で求める"""
    bb = [Vector(v) for v in body.bound_box]
    return Vector(((max(v[i] for v in bb) - min(v[i] for v in bb)) / 2 * body.scale[i] for i in range(3)))


def chest_point(body, side, up=0.25, out=0.42):
    semi = local_semi(body)
    d = Vector((side * out, -1.0, up)).normalized()
    return body_center(body) + Vector((semi.x * d.x, semi.y * d.y, semi.z * d.z))


def _bodyof(t):
    if hasattr(t, 'get') and t.get('body'):
        return O[t['body']]
    return t


def pulse(loc, n, bpm=72, r=0.03, mode='on', f_start=1, offset=0.0, parent=None, halo=True, col_on=None):
    """光る鼓動の玉1つ。bpm は数か (始め, 終わり)。offset は1拍の何割ずらすか"""
    md = mode
    core = ball(loc, r, HB_DIM, parent=parent, name='hb')
    hal = ball(loc, r * 2.0, HB_HALO, a=0.26, seg=12, parent=parent, name='hbh') if halo else None
    cm = core.data.materials[0]; hm = hal.data.materials[0] if hal else None
    on = col_on or HB_ON
    b0, b1 = (bpm if isinstance(bpm, (tuple, list)) else (bpm, bpm))
    f_app = None
    if isinstance(md, tuple) and md[0] == 'appear':
        f_start = md[1]; md = 'on'; f_app = f_start
    f = f_start + offset * FPS * 60 / b0
    cm.keyframe_insert('diffuse_color', frame=1)
    if hm:
        hm.keyframe_insert('diffuse_color', frame=1)
    while f < n + 2:
        fi = int(f); u = fi / max(1, n)
        bpm_f = b0 + (b1 - b0) * u
        per = FPS * 60 / bpm_f
        if md == 'flicker':
            amp, col, ha, per = 0.22, (0.55, 0.08, 0.12), 0.1, 3
        elif md == 'weak':
            amp, col, ha = 0.25, (0.6, 0.1, 0.16), 0.12
        elif md == 'grow':
            amp = 0.25 + 0.45 * u; ha = 0.12 + 0.16 * u
            col = tuple((1 - u) * c0 + u * c1 for c0, c1 in zip((0.6, 0.1, 0.16), on))
        else:
            amp, col, ha = 0.65, on, 0.28
        if fi >= 1:
            rise, fall = (1, 2) if md == 'flicker' else (2, 7)
            core.scale = (1, 1, 1); core.keyframe_insert('scale', frame=fi)
            core.scale = (1 + amp,) * 3; core.keyframe_insert('scale', frame=fi + rise)
            core.scale = (1, 1, 1); core.keyframe_insert('scale', frame=fi + rise + fall)
            cm.diffuse_color = (*HB_DIM, 1); cm.keyframe_insert('diffuse_color', frame=fi)
            cm.diffuse_color = (*col, 1); cm.keyframe_insert('diffuse_color', frame=fi + rise)
            cm.diffuse_color = (*HB_DIM, 1); cm.keyframe_insert('diffuse_color', frame=fi + rise + fall + 2)
            if hal:
                hal.scale = (0.55,) * 3; hal.keyframe_insert('scale', frame=fi)
                hal.scale = (0.75 + amp * 0.6,) * 3; hal.keyframe_insert('scale', frame=fi + rise + 1)
                hal.scale = (0.55,) * 3; hal.keyframe_insert('scale', frame=fi + rise + fall + 3)
                hm.diffuse_color = (*HB_HALO, 0.06); hm.keyframe_insert('diffuse_color', frame=fi)
                hm.diffuse_color = (*HB_HALO, ha); hm.keyframe_insert('diffuse_color', frame=fi + rise + 1)
                hm.diffuse_color = (*HB_HALO, 0.06); hm.keyframe_insert('diffuse_color', frame=fi + rise + fall + 3)
        f += max(3, per)
    if f_app:
        for o in (core, hal):
            if o:
                s0 = o.scale.copy()
                o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=1); o.keyframe_insert('scale', frame=max(2, f_app - 1))
                o.scale = s0
                set_interp(o, 'CONSTANT', 'scale', {1, max(2, f_app - 1)})
    return core


def hearts(target, n, bpm=(72, 63), size=1.0, mode=('on', 'on'), t0=1, halo=True, up=0.25, out=0.42, r=None, depth=1.0):
    """target の胸に二つの光る鼓動を付ける。bpm=(左, 右)、各要素は数か (始め, 終わり)。
    mode：'on' / 'weak' / 'flicker' / 'grow' / ('appear', f) / 'off'。depth<1 で体の内側（透けた体の模式用）"""
    bpy.context.view_layer.update()  # 外接箱を最新にする（作った直後は古いことがある）
    body = _bodyof(target)
    par = body.parent
    semi = local_semi(body)
    rs = target.scale.x if hasattr(target, 'get') and target.get('kind') else 1.0
    if rs < 1.0:
        size *= rs  # 小さな猫・子どもは、見た目の大きさをそろえる
    is_person = hasattr(target, 'get') and target.get('kind') == 'person'
    if not is_person:
        size *= 2.0  # 動物・鳥・魚は体が小さいので、光を大きめに
    rr = r if r is not None else 0.14 * min(semi.x, semi.y) * size
    outs = []
    for k, side in enumerate((1, -1)):
        if mode[k] == 'off':
            continue
        p = chest_point(body, side, up, out)
        if hasattr(target, 'get') and target.get('pose') == 'lie':  # 仰向け：胸の上
            p = body_center(body) + Vector((side * 0.09, -0.06, semi.z + 0.005))
        if depth != 1.0:
            p = body_center(body) + (p - body_center(body)) * depth
        outs.append(pulse(p, n, bpm[k], rr, mode[k], t0, 0.38 * k, parent=par, halo=halo))
    return outs


def ghost_body(root, rgb=(0.75, 0.85, 1.0), a=0.22):
    """体を淡く透かす（模式図）"""
    m = gmat(rgb, a, 'ghostbody')
    def rec(o):
        for c in o.children:
            if c.type == 'MESH' and not c.name.startswith('hb'):
                c.data.materials.clear(); c.data.materials.append(m)
            rec(c)
    rec(root)


def arm_to(p, k, target, f=None):
    """腕 k の手先を target（人のローカル座標）へ。f を渡すとそのフレームまでに動かす。腕は animate_life から外す"""
    j = O[p['arms'][k]]
    d = Vector(target) - Vector(j.location)
    e = Vector((0, 0, -1)).rotation_difference(d).to_euler(); sc = (1, 1, d.length / 0.6)
    if f is None:
        j.rotation_euler = e; j.scale = sc
    else:
        j.keyframe_insert('rotation_euler', frame=1); j.keyframe_insert('scale', frame=1)
        j.keyframe_insert('rotation_euler', frame=f); j.keyframe_insert('scale', frame=f)
        j.rotation_euler = e; j.scale = sc
        j.keyframe_insert('rotation_euler', frame=f + 10); j.keyframe_insert('scale', frame=f + 10)
    arms = list(p['arms']); arms.remove(j.name); p['arms'] = arms
    return j


def heart3d(loc, s=1.0, rgb=HB_ON, a=1.0, parent=None):
    """ハートの形（球2つ＋円すい）。-y を向く"""
    root = empty(loc, 'heart'); root.scale = (s, s, s)
    m = gmat(rgb, a, 'heart3d')
    for sx in (-1, 1):
        o = sphere((sx * 0.21, 0, 0.1), 0.3, (1, 1, 1), seg=20); o.data.materials.clear(); o.data.materials.append(m); link(o, root)
        o.scale = (1, 0.75, 1)
    o = cone((0, 0, -0.2), 0.47, 0.72, (1, 1, 1), rot=(math.pi, 0, 0), verts=24); o.data.materials.clear(); o.data.materials.append(m); link(o, root)
    o.scale = (1, 0.5, 1)
    if parent is not None:
        root.parent = parent
    return root


def beat_scale(o, n, bpm=60, amp=0.12, offset=0.0):
    per = FPS * 60 / bpm
    s0 = Vector(o.scale)
    f = 1 + offset * per
    while f < n + 2:
        fi = int(f)
        o.scale = s0; o.keyframe_insert('scale', frame=max(1, fi))
        o.scale = s0 * (1 + amp); o.keyframe_insert('scale', frame=fi + 3)
        o.scale = s0; o.keyframe_insert('scale', frame=fi + 9)
        f += per
    o.scale = s0


def hand_chest(p, k=1, f=None, n=None):
    """人の腕 k（0=右手側 -x、1=左手側 +x）を胸に当てる。f を渡すとそのフレームで手を上げる。
    animate_life に腕を揺らされないよう、その腕は p['arms'] から外す"""
    j = O[p['arms'][k]]
    sit = p['pose'] == 'sit'
    cz = 0.92 if sit else 1.30
    target = Vector((-0.02 if k else 0.02, -0.26, cz))
    d = target - Vector(j.location)
    L = 0.6
    e_chest = Vector((0, 0, -1)).rotation_difference(d).to_euler()
    s_chest = (1, 1, d.length / L)
    if f is None:
        j.rotation_euler = e_chest; j.scale = s_chest
    else:
        j.keyframe_insert('rotation_euler', frame=1); j.keyframe_insert('scale', frame=1)
        j.keyframe_insert('rotation_euler', frame=f); j.keyframe_insert('scale', frame=f)
        j.rotation_euler = e_chest; j.scale = s_chest
        j.keyframe_insert('rotation_euler', frame=f + 10); j.keyframe_insert('scale', frame=f + 10)
    arms = list(p['arms']); arms.remove(j.name); p['arms'] = arms
    return j


def arm_up(p, k=1):
    """つり革を持つ腕（真上へ）"""
    j = O[p['arms'][k]]
    j.rotation_euler = (math.pi * 0.93, 0, 0)
    arms = list(p['arms']); arms.remove(j.name); p['arms'] = arms
    return j


def cheeks(p, f0=1, f1=None, grow=True, rgb=(1.0, 0.35, 0.42)):
    """頬がほんのり赤くなる（grow=False なら赤みが引く）"""
    h = O[p['head']]
    out = []
    for sx in (-1, 1):
        o = ball((sx * 0.07, -0.108, -0.03), 0.028, rgb, a=0.6, seg=10, parent=h, name='cheek')
        o.scale = (1.0, 0.35, 0.6)
        s_on = (1.0, 0.35, 0.6); s_off = (0.0, 0.0, 0.0)
        o.scale = s_off if grow else s_on; o.keyframe_insert('scale', frame=f0)
        o.scale = s_on if grow else s_off; o.keyframe_insert('scale', frame=f1 or f0 + 60)
        out.append(o)
    return out


def people_colors(rnd):
    return rnd.choice([hexc('#3d5a80'), hexc('#c46a4a'), hexc('#4a6b4a'), hexc('#8a8a8a'), hexc('#d9b26a'), hexc('#2f3440'),
                       hexc('#7a5a8a'), hexc('#e8e2d6'), hexc('#5a7a9a')])


def crowd_person(loc, rnd, rot_z=0.0, pose='stand', s=1.0, name='p', act=None):
    return person(loc, people_colors(rnd), pants=rnd.choice([hexc('#3b4252'), hexc('#2a2a2a'), hexc('#5a5048')]),
                  skin=rnd.choice(SKIN[:3]), hair=rnd.choice([hexc('#2b2420'), hexc('#4a3a2a'), hexc('#1a1a1a'), hexc('#8a8a88')]),
                  rot_z=rot_z, pose=pose, s=s, name=name, act=act)


# ---------------- 動物（cat() を作り替える） ----------------
COATS['bear'] = {'base': hexc('#4a3426'), 'belly': hexc('#6a4e3a'), 'stripe': hexc('#4a3426')}
COATS['cow'] = {'base': hexc('#f2efe8'), 'belly': hexc('#f6c9c0'), 'stripe': hexc('#f2efe8')}
COATS['pig'] = {'base': hexc('#f2b8b0'), 'belly': hexc('#f7cfc8'), 'stripe': hexc('#f2b8b0')}
COATS['deer'] = {'base': hexc('#b07a48'), 'belly': hexc('#efe0c8'), 'stripe': hexc('#b07a48')}
COATS['fawn'] = {'base': hexc('#c08850'), 'belly': hexc('#f5e8d0'), 'stripe': hexc('#c08850')}
COATS['cheetah'] = {'base': hexc('#e0b458'), 'belly': hexc('#f5ead2'), 'stripe': hexc('#e0b458')}
COATS['gazelle'] = {'base': hexc('#c89058'), 'belly': hexc('#f6efe2'), 'stripe': hexc('#c89058')}
COATS['hamster'] = {'base': hexc('#e2a860'), 'belly': hexc('#fbf1e0'), 'stripe': hexc('#e2a860')}
COATS['dog_shiba'] = {'base': hexc('#c97a3a'), 'belly': hexc('#f6ead6'), 'stripe': hexc('#c97a3a')}


def _hide_cat_ears(root):
    head = O[root['head']]
    for ch in list(head.children):
        if ch.name.startswith('cone'):
            ch.scale = (0, 0, 0)


def _legs_len(root, k):
    """脚を k 倍に伸ばし、体を持ち上げる"""
    if k == 1.0:
        return
    rig = O[root['rig']]
    L = 0.0
    for jn in root['legs']:
        j = O[jn]
        j.scale = (1, 1, k)
        L = max(L, j.location.z)
    if root['pose'] == 'walk':
        rig.location.z += 0.18 * (k - 1)
    elif root['pose'] == 'sit':
        rig.location.z += 0.0


def animal(loc, kind, s=None, rot_z=0.0, pose='walk', name=None):
    name = name or kind
    spec = {
        'bear': dict(s=3.6, legs=1.1, coat='bear'), 'cow': dict(s=3.8, legs=1.7, coat='cow'), 'pig': dict(s=2.6, legs=0.75, coat='pig'),
        'deer': dict(s=3.0, legs=2.3, coat='deer'), 'fawn': dict(s=1.9, legs=2.2, coat='fawn'), 'cheetah': dict(s=2.9, legs=2.0, coat='cheetah'),
        'gazelle': dict(s=2.5, legs=2.4, coat='gazelle'), 'hamster': dict(s=0.28, legs=0.5, coat='hamster'),
        'shiba': dict(s=1.15, legs=1.25, coat='dog_shiba'),
    }[kind]
    s = s or spec['s']
    root = cat(loc, spec['coat'], s=s, rot_z=rot_z, pose=pose, name=name)
    root['animal'] = kind
    head = O[root['head']]; rig = O[root['rig']]; body = O[root['body']]
    C = COATS[spec['coat']]
    if pose == 'walk':
        _legs_len(root, spec['legs'])
    if kind in ('bear', 'cow', 'pig', 'deer', 'fawn', 'gazelle', 'hamster', 'cheetah', 'shiba'):
        _hide_cat_ears(root)
        for ch in list(head.children):  # 猫の鼻
            if ch.name.startswith('sph') and abs(ch.location.y + 0.122) < 0.01:
                ch.scale = (0, 0, 0)
    if kind == 'bear':
        for sx in (-1, 1):
            link(sphere((sx * 0.08, 0.01, 0.08), 0.035, C['base']), head)
        link(sphere((0, -0.11, -0.03), 0.045, hexc('#8a6a50'), scale=(1, 1.2, 0.8)), head)
        link(sphere((0, -0.16, -0.015), 0.018, hexc('#1a1a1a')), head)
        body.scale = (body.scale.x * 1.25, body.scale.y, body.scale.z * 1.25)
        O[root['tail']].scale = (0.3, 0.3, 0.3)
    elif kind == 'cow':
        for sx in (-1, 1):
            link(cone((sx * 0.07, 0.0, 0.1), 0.014, 0.06, hexc('#e8e0c8'), rot=(0, sx * 0.6, 0)), head)
            link(sphere((sx * 0.11, 0.02, 0.03), 0.03, C['base'], scale=(1.6, 0.6, 0.8)), head)
        link(sphere((0, -0.1, -0.04), 0.06, hexc('#f0b8b0'), scale=(1.1, 1.0, 0.8)), head)
        for (x, y, z, r) in ((0.08, 0.05, 0.25, 0.06), (-0.07, -0.08, 0.22, 0.055), (0.05, 0.15, 0.2, 0.05)):
            link(sphere((x, y, z), r, hexc('#2a2a2a'), scale=(0.9, 1.3, 0.7)), rig)
        O[root['tail']].scale = (0.6, 0.6, 0.9)
    elif kind == 'pig':
        link(cyl((0, -0.12, -0.02), 0.04, 0.04, hexc('#e89a92'), rot=(math.pi / 2, 0, 0)), head)
        for sx in (-1, 1):
            link(cone((sx * 0.07, 0.0, 0.08), 0.03, 0.05, C['base'], rot=(0.5, 0, 0)), head)
        body.scale = (body.scale.x * 1.3, body.scale.y * 1.05, body.scale.z * 1.3)
        O[root['tail']].scale = (0.4, 0.4, 0.3)
    elif kind in ('deer', 'fawn', 'gazelle'):
        for sx in (-1, 1):
            link(sphere((sx * 0.085, 0.02, 0.06), 0.028, C['base'], scale=(1.6, 0.5, 0.9)), head)
        link(sphere((0, -0.1, -0.03), 0.045, C['belly'], scale=(1.0, 1.4, 0.8)), head)
        link(sphere((0, -0.16, -0.02), 0.014, hexc('#1a1a1a')), head)
        if kind == 'gazelle':
            for sx in (-1, 1):
                link(cone((sx * 0.03, 0.02, 0.15), 0.012, 0.14, hexc('#3a3028'), rot=(-0.35, 0, 0)), head)
        if kind == 'fawn':
            for (x, y) in ((0.05, -0.05), (-0.05, 0.02), (0.04, 0.09), (-0.03, -0.12)):
                link(sphere((x, y, 0.3), 0.012, hexc('#fbf3e6')), rig)
        O[root['tail']].scale = (0.4, 0.4, 0.25)
        neck = O[root['neck']]; neck.location.z += 0.06; neck.location.y -= 0.02
    elif kind == 'cheetah':
        rnd = random.Random(5)
        for i in range(14):
            link(sphere((rnd.uniform(-0.09, 0.09), rnd.uniform(-0.2, 0.2), 0.3 + rnd.uniform(-0.02, 0.02)), 0.014,
                        hexc('#2a2218')), rig)
        for sx in (-1, 1):
            link(sphere((sx * 0.07, 0.01, 0.08), 0.025, C['base']), head)
            link(box((sx * 0.035, -0.095, -0.0), (0.006, 0.004, 0.05), hexc('#2a2218'), rot=(0, 0, 0)), head)
        link(sphere((0, -0.125, -0.01), 0.012, hexc('#1a1a1a')), head)
        body.scale = (body.scale.x * 0.85, body.scale.y * 1.1, body.scale.z * 0.95)
    elif kind == 'hamster':
        for sx in (-1, 1):
            link(sphere((sx * 0.07, 0.01, 0.07), 0.032, hexc('#f0b8a8')), head)
        link(sphere((0, -0.12, -0.0), 0.014, hexc('#e08a8a')), head)
        body.scale = (body.scale.x * 1.4, body.scale.y * 0.9, body.scale.z * 1.4)
        O[root['tail']].scale = (0, 0, 0)
    elif kind == 'shiba':
        for sx in (-1, 1):
            link(cone((sx * 0.065, 0.0, 0.1), 0.032, 0.06, C['base'], rot=(0, sx * 0.2, 0), verts=4), head)
        link(sphere((0, -0.12, -0.035), 0.055, C['belly'], scale=(1.0, 1.4, 0.8)), head)
        link(sphere((0, -0.2, -0.02), 0.02, hexc('#1a1a1a')), head)
        tail = O[root['tail']]; tail.rotation_euler = (0.4, 0, 0)
    return root


def birdbody(b):
    """bird() の胴（いちばん大きい球）"""
    sph = [c for c in b.children if c.type == 'MESH' and c.name.startswith('sph')]
    return max(sph, key=lambda o: o.dimensions.y)


def chicken(loc, s=3.2, rot_z=0, name='chicken'):
    b = bird(loc, c=hexc('#f4f1ea'), s=s, rot_z=rot_z, name=name)
    link(sphere((0, -0.05, 0.135), 0.012, hexc('#d83a2a'), scale=(0.6, 1.4, 1.2)), b)
    link(sphere((0, -0.075, 0.08), 0.009, hexc('#d83a2a'), scale=(0.6, 1, 1.4)), b)
    return b


def eagle(loc, s=6.0, rot_z=0, name='eagle'):
    b = bird(loc, c=hexc('#5a4030'), s=s, rot_z=rot_z, name=name)
    link(sphere((0, -0.05, 0.11), 0.034, hexc('#f4f1ea')), b)
    for w in [c for c in b.children if c.name.startswith('box')]:
        w.scale = (1, 2.2, 1.2)
    return b


def fish(loc, s=1.0, rot_z=0, c=None, name='fish'):
    c = c or hexc('#f08a3a')
    root = empty(loc, name); root.scale = (s, s, s); root.rotation_euler = (0, 0, rot_z)
    body = link(sphere((0, 0, 0), 0.05, c, scale=(0.55, 1.2, 0.85)), root)
    tail = link(cone((0, 0.075, 0), 0.04, 0.05, c, rot=(math.pi / 2, 0, 0), verts=8), root)
    tail.scale = (0.25, 1, 1)
    for sx in (-1, 1):
        link(sphere((sx * 0.02, -0.035, 0.012), 0.008, hexc('#111111')), root)
    root['fbody'] = body.name; root['ftail'] = tail.name
    return root


def wiggle(o, n, idx=2, amp=0.25, period=10, f0=1):
    """しっぽ・ひれなどの往復"""
    base = o.rotation_euler[idx]
    for f in range(f0, n + period, period // 2):
        v = list(o.rotation_euler); v[idx] = base + (amp if (f // (period // 2)) % 2 else -amp)
        o.rotation_euler = v; o.keyframe_insert('rotation_euler', index=idx, frame=f)


def circle_path(o, n, center, r, laps=1.0, z=None, f0=1, phase=0.0, face=True):
    """円を回る（向きも進行方向へ）"""
    cx, cy, cz = center
    for f in range(f0, n + 1, 2):
        a = phase + 2 * math.pi * laps * (f - f0) / max(1, n - f0)
        o.location = (cx + r * math.cos(a), cy + r * math.sin(a), z if z is not None else cz)
        o.keyframe_insert('location', frame=f)
        if face:
            o.rotation_euler.z = a + math.pi  # 前は -y：接線方向へ
            o.keyframe_insert('rotation_euler', index=2, frame=f)


def bob(o, n, amp=0.05, period=30, idx=2):
    _b = o.location[idx]
    for f in range(1, n + period, period // 2):
        v = list(o.location); v[idx] = _b + (amp if (f // (period // 2)) % 2 else -amp)
        o.location = v; o.keyframe_insert('location', index=idx, frame=f)


# ---------------- 絵（PIL）：心電図・腕時計・図 ----------------
def ecg_y(x, w, base, amp, period, shift=0.0):
    t = ((x / w) * (w / period) + shift) % 1.0
    if 0.40 < t < 0.44:
        return base - amp * (t - 0.40) / 0.04
    if 0.44 <= t < 0.48:
        return base - amp + amp * 1.4 * (t - 0.44) / 0.04
    if 0.48 <= t < 0.51:
        return base + amp * 0.4 - amp * 0.4 * (t - 0.48) / 0.03
    if 0.62 < t < 0.75:
        return base - amp * 0.18 * math.sin(math.pi * (t - 0.62) / 0.13)
    if 0.25 < t < 0.33:
        return base - amp * 0.1 * math.sin(math.pi * (t - 0.25) / 0.08)
    return base


def draw_ecg(two=True, blank=False, title=True):
    def f(im, d):
        d.rectangle((0, 0, 1920, 1080), fill=(6, 12, 10))
        for x in range(0, 1920, 96):
            d.line((x, 0, x, 1080), fill=(14, 34, 26), width=2)
        for y in range(0, 1080, 96):
            d.line((0, y, 1920, y), fill=(14, 34, 26), width=2)
        if blank:
            return
        rows = [(380, 300, 380.0, 0.0, (80, 255, 120)), (800, 280, 430.0, 0.37, (120, 255, 160))] if two else [(560, 320, 380.0, 0.0, (80, 255, 120))]
        for base, amp, per, sh, col in rows:
            pts = [(x, ecg_y(x, 1920, base, amp, per, sh)) for x in range(0, 1920, 3)]
            d.line(pts, fill=col, width=12, joint='curve')
        d.ellipse((1800, 40, 1870, 110), fill=(255, 70, 70))
    return f


def ecg_screen(name, loc, w, h, n, rot=(math.pi / 2, 0, 0), two=True, sweep=True, period=72):
    """心電図の画面：絵を貼った板の上を、黒い帯が左から右へ動いて描き直す"""
    scr = tex_plane(name + ('2' if two else '1'), draw_ecg(two), loc, w, h, rot=rot)
    if sweep:
        bar = boxc((0, 0, 0), (0.16, 1.96, 0.002), hexc('#060c0a'))
        bar.parent = scr
        for f in range(1, n + period, period):
            bar.location = (-1.0, 0.0, 0.004); bar.keyframe_insert('location', frame=f)
            bar.location = (1.0, 0.0, 0.004); bar.keyframe_insert('location', frame=f + period - 1)
        linear(bar, 'location')
    return scr


def monitor(loc, n, rot_z=0.0, two=True, s=1.0, name='mon', stand=True):
    """心電図モニター（台つき）。画面は -y 向き（rot_z で回す）"""
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    link(box((0, 0.03, 0.0), (0.62, 0.08, 0.42), hexc('#3a3e44'), bevel=0.02), root)
    scr = ecg_screen(name, (0, -0.012, 0.0), 0.54, 0.34, n, two=two)
    link(scr, root)
    lamp = link(box((0.26, -0.015, 0.25), (0.06, 0.03, 0.04), hexc('#ff4a3d')), root)
    if stand:
        link(cyl((0, 0.03, -0.55), 0.02, 0.7, hexc('#9aa0a6')), root)
    root['lamp'] = lamp.name
    return root


def draw_watch(lines, bg=(10, 12, 16), fg=(255, 255, 255), red=False):
    def f(im, d):
        d.rectangle((0, 0, 1024, 1024), fill=bg)
        if red:
            d.ellipse((380, 80, 640, 300), fill=(255, 70, 90))
            d.ellipse((440, 120, 580, 260), fill=bg)
        y = 360 if red else 300
        for i, l in enumerate(lines):
            fs = 380 if (len(l) <= 3 and all(ch in '0123456789:' for ch in l)) else (150 if len(l) <= 4 else (110 if len(l) <= 6 else 88))
            tw = d.textlength(l, font=_font(fs))
            d.text(((1024 - tw) / 2, y), l, font=_font(fs), fill=fg if i == 0 else (180, 190, 200))
            y += fs + 50
    return f


def watch_arm(loc, n, screens, swap_at=(), vibrate=(), rot_z=0.0, sleeve=hexc('#3d5a80'), skin=None, name='wrist'):
    """手首のアップ：腕（横向き）と腕時計。screens は [(名前, 描く関数), ...]、swap_at で順に切り替える"""
    skin = skin or SKIN[0]
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    link(cyl((-0.25, 0, 0), 0.045, 0.5, skin, rot=(0, math.pi / 2, 0), verts=20), root)
    link(cyl((-0.62, 0, 0), 0.062, 0.3, sleeve, rot=(0, math.pi / 2, 0), verts=20), root)
    link(sphere((0.04, 0, -0.005), 0.055, skin, scale=(1.1, 0.8, 0.45)), root)  # 手の甲
    for k in range(4):
        link(cyl((0.115, -0.03 + k * 0.02, -0.012), 0.011, 0.07, skin, rot=(0, math.pi / 2, 0)), root)
    link(box((-0.2, 0, 0.0), (0.035, 0.1, 0.098), hexc('#2a2a2e')), root)  # ベルト
    case = link(box((-0.2, 0, 0.05), (0.06, 0.055, 0.016), hexc('#1c1c20'), bevel=0.006), root)
    planes = []
    for nm, fn in screens:
        p = tex_plane(nm, fn, (-0.2, 0, 0.0595), 0.05, 0.05, rot=(0, 0, 0), size=(1024, 1024))
        link(p, root); planes.append(p)
    if len(planes) > 1:
        swap_seq(planes, swap_at)
    if vibrate:
        a, b = vibrate
        root.keyframe_insert('location', frame=1)
        base = root.location.copy()
        for f in range(a, b, 2):
            root.location = base + Vector((0.004 * (1 if f % 4 else -1), 0.003 * (1 if f % 6 else -1), 0))
            root.keyframe_insert('location', frame=f)
        root.location = base; root.keyframe_insert('location', frame=b)
    return root


def _swap_more(a, b, f):
    pr = bpy.context.preferences.edit; old = pr.keyframe_new_interpolation_type
    pr.keyframe_new_interpolation_type = 'CONSTANT'
    b_s = Vector((1, 1, 1))
    a.scale = Vector((1, 1, 1)); a.keyframe_insert('scale', frame=f - 1)
    a.scale = (0, 0, 0); a.keyframe_insert('scale', frame=f)
    b.scale = (0, 0, 0); b.keyframe_insert('scale', frame=1); b.keyframe_insert('scale', frame=f - 1)
    b.scale = b_s; b.keyframe_insert('scale', frame=f)
    pr.keyframe_new_interpolation_type = old


def swap_seq(planes, frames):
    """板を順に切り替える（frames[i] で planes[i] → planes[i+1]）"""
    on = [Vector(p.scale) for p in planes]
    big = 10 ** 6
    bounds = [1] + list(frames) + [big]
    for i, p in enumerate(planes):
        if bounds[i] > 1:
            p.scale = (0, 0, 0); p.keyframe_insert('scale', frame=1)
        p.scale = on[i]; p.keyframe_insert('scale', frame=bounds[i])
        if bounds[i + 1] < big:
            p.scale = (0, 0, 0); p.keyframe_insert('scale', frame=bounds[i + 1])
        set_interp(p, 'CONSTANT', 'scale')


def draw_card(title, lines, bg=(250, 247, 240), fg=(40, 44, 60), accent=(200, 60, 70), size=(1920, 1080)):
    """やわらかい説明の紙（数字は台本にあるものだけ）"""
    def f(im, d):
        W, H = size
        d.rectangle((0, 0, W, H), fill=bg)
        d.rounded_rectangle((40, 40, W - 40, H - 40), 40, outline=(220, 214, 200), width=8)
        y = 90
        if title:
            d.text((110, y), title, font=_font(96), fill=accent); y += 190
        for l in lines:
            d.text((110, y), l, font=_font(104), fill=fg); y += 175
    return f


def heart_shape(d, cx, cy, r, fill):
    d.ellipse((cx - r, cy - r, cx + r * 0.05, cy + r * 0.8), fill=fill)
    d.ellipse((cx - r * 0.05, cy - r, cx + r, cy + r * 0.8), fill=fill)
    d.polygon([(cx - r * 0.97, cy + 0.05 * r), (cx + r * 0.97, cy + 0.05 * r), (cx, cy + r * 1.45)], fill=fill)


# ---------------- 電車 ----------------
def city_strip(n, speed=7.0, side=1, seed=3, night=False):
    """窓の外を流れる街（y=side*(6..40) に建物が並び、x 方向へ流れる）"""
    rnd = random.Random(seed)
    par = empty((0, 0, 0), 'city')
    span = speed * n / FPS + 60
    x = -40.0
    while x < span:
        w = rnd.uniform(4, 9); d = rnd.uniform(5, 10); h = rnd.uniform(5, 22)
        y = side * rnd.uniform(9, 22)
        c = rnd.choice(WALLS + [hexc('#b9c3cc'), hexc('#c9b8a0')])
        link(box((x, y, h / 2 - 2.0), (w, d, h), c), par)
        if h > 8:
            for fl in range(int(h / 3)):
                link(box((x, y - side * (d / 2 + 0.02), fl * 3 + 0.5), (w * 0.85, 0.05, 0.9),
                         hexc('#ffd98a') if night and rnd.random() < 0.4 else hexc('#8aa3b8')), par)
        if rnd.random() < 0.3:
            link(sphere((x + w * 0.7, side * 7.5, 1.0), 1.6, rnd.choice([hexc('#6f8f4e'), hexc('#7d9a55')]), seg=10), par)
        x += w + rnd.uniform(1.5, 5)
    # 線路わきの柵と電柱（速さが分かる）
    for k in range(int(span / 12) + 6):
        xx = -40 + k * 12
        link(cyl((xx, side * 5.5, 1.5), 0.08, 6.5, hexc('#8c8a86')), par)
    link(box((span / 2 - 20, side * 6.5, -1.2), (span + 60, 0.1, 1.0), hexc('#9a958d')), par)
    par.location.x = 0; par.keyframe_insert('location', frame=1)
    par.location.x = -speed * n / FPS; par.keyframe_insert('location', frame=n + 1)
    linear(par, 'location')
    return par


DOOR_X = (-4.5, 4.5)


def _segs(x0, x1, gaps, half):
    """[x0, x1] から gaps（中心±half）を抜いた区間"""
    out = []; cur = x0
    for g in sorted(gaps):
        if g - half > cur:
            out.append((cur, g - half))
        cur = max(cur, g + half)
    if cur < x1:
        out.append((cur, x1))
    return out


def train_car(n, moving=True, stand=10, sit=12, seed=1, night=False, doors_open=None, glow=True, bpm=(72, 63), avoid=None, ground_on=True):
    """満員電車の車内。車両は x 方向（-9〜9）、幅 y=±1.45、ドアは x=±4.5（両側）。窓の外は city_strip（止まっていればホーム）。
    avoid(x, y) が真の場所には人を置かない。戻り値：(立っている人, 座っている人, ドアの板)"""
    s = bpy.context.scene
    sky(hexc('#16203a') if night else hexc('#bcd6ee')); s.view_settings.exposure = 0.3 if not night else -0.1
    s.display.shading.show_shadows = False
    light_dir((0.2, -0.3, 0.9))
    Lx = 18.0; Wd = 2.9; Hh = 2.3
    box((0, 0, -0.055), (Lx, Wd, 0.12), hexc('#8a8478'))  # 床
    box((0, 0, Hh + 0.05), (Lx, Wd, 0.1), hexc('#eef0ee'))  # 天井
    for x in (-Lx / 2, Lx / 2):
        box((x, 0, Hh / 2), (0.08, Wd, Hh), hexc('#dfe2de'))  # 妻面
        box((x * 0.995, 0, 1.2), (0.05, 0.8, 1.6), hexc('#b9c3cc'))  # 貫通扉
    wall = hexc('#e6e8e4')
    leaves = []
    for side in (1, -1):
        y = side * Wd / 2
        for a_, b_ in _segs(-Lx / 2, Lx / 2, DOOR_X, 0.7):
            box(((a_ + b_) / 2, y, 0.45), (b_ - a_, 0.08, 0.9), wall)
        box((0, y, Hh - 0.2), (Lx, 0.08, 0.4), wall)
        for k in range(9):
            x = -Lx / 2 + 0.2 + k * (Lx - 0.4) / 8
            if all(abs(x - d) > 1.0 for d in DOOR_X):
                box((x, y, 1.4), (0.36, 0.08, 1.0), wall)
        for d in DOOR_X:
            for sx in (-1, 1):
                box((d + sx * 0.95, y, 1.05), (0.5, 0.1, 2.1), wall)  # 戸袋
                lf = boxc((d + sx * 0.33, y * 0.985, 1.0), (0.64, 0.05, 2.0), hexc('#c8ccd0'))
                w_ = boxc((0, -side * 0.03, 0.35), (0.4, 0.01, 0.7), hexc('#9fb6c8')); w_.parent = lf
                leaves.append((lf, sx, d))
        # 長いす
        for a_, b_ in _segs(-Lx / 2 + 0.6, Lx / 2 - 0.6, DOOR_X, 0.9):
            box(((a_ + b_) / 2, side * 1.18, 0.22), (b_ - a_, 0.5, 0.44), hexc('#3a5a8a'))
            box(((a_ + b_) / 2, side * 1.37, 0.66), (b_ - a_, 0.1, 0.45), hexc('#3a5a8a'))
        # 網棚とつり革
        box((0, side * 1.15, 1.95), (Lx - 1, 0.35, 0.03), hexc('#b9bcc0'))
        cyl((0, side * 0.62, 2.0), 0.018, Lx - 1, hexc('#b9bcc0'), rot=(0, math.pi / 2, 0))
        for k in range(22):
            x = -8 + k * 0.75
            box((x, side * 0.62, 1.88), (0.03, 0.012, 0.2), hexc('#f0f0f0'))
            bpy.ops.mesh.primitive_torus_add(location=(x, side * 0.62, 1.74), major_radius=0.065, minor_radius=0.012, rotation=(math.pi / 2, 0, math.pi / 2))
            setmat(bpy.context.object, hexc('#f4f4f2'))
    for x in (-7, -2, 2, 7):
        cyl((x, 0.95, Hh / 2), 0.02, Hh, hexc('#c8ccd0'))
        cyl((x, -0.95, Hh / 2), 0.02, Hh, hexc('#c8ccd0'))
    if doors_open is not None:
        for lf, sx, d in leaves:
            lf.keyframe_insert('location', frame=1); lf.keyframe_insert('location', frame=doors_open)
            lf.location.x = d + sx * 0.98; lf.keyframe_insert('location', frame=doors_open + 14)
    if moving:
        city_strip(n, 9.0, side=1, seed=seed, night=night)
        city_strip(n, 9.0, side=-1, seed=seed + 7, night=night)
    else:
        for side in (1, -1):
            box((0, side * 4.2, 0.0), (60, 5, 0.1), hexc('#c9c4ba'))  # ホーム
            box((0, side * 1.95, 0.0), (60, 0.25, 0.11), hexc('#f2d24b'))
            box((0, side * 8.0, 2), (60, 0.2, 4), hexc('#d8d2c4'))
            for x in (-12, -4, 4, 12):
                cyl((x, side * 5.5, 1.6), 0.1, 3.2, hexc('#8c8a86'))
    if ground_on:
        ground(rgb=hexc('#262a33') if night else hexc('#a9a294'))
    rnd = random.Random(seed)
    standing, sitting = [], []
    xs = sorted(rnd.uniform(-7.5, 7.5) for _ in range(stand))
    for i, x in enumerate(xs):
        y = rnd.choice([-0.5, 0.5]) + rnd.uniform(-0.1, 0.1)
        if avoid and avoid(x, y):
            continue
        p = crowd_person((x, y, 0), rnd, rot_z=(math.pi if y < 0 else 0) + rnd.uniform(-0.3, 0.3), name=f'st{i}')
        if rnd.random() < 0.7:
            arm_up(p, 0 if y < 0 else 1)
        standing.append(p)
    seats = [x for a_, b_ in _segs(-8.1, 8.1, DOOR_X, 1.0) for x in [a_ + 0.3 + k * 0.62 for k in range(int((b_ - a_) / 0.62))]]
    for side in (1, -1):
        for x in seats:
            if rnd.random() < 0.25 or (avoid and avoid(x, side * 1.05)):
                continue
            p = crowd_person((x + rnd.uniform(-0.05, 0.05), side * 1.08, 0), rnd, pose='sit', rot_z=0 if side > 0 else math.pi, name=f'si{len(sitting)}')
            sitting.append(p)
            if len(sitting) >= sit:
                break
    if glow:
        for p in standing + sitting:
            hearts(p, n, bpm=(bpm[0] + rnd.uniform(-6, 6), bpm[1] + rnd.uniform(-6, 6)), size=0.9)
    return standing, sitting, leaves


def pov_hand(loc, shoulder=(-0.05, -0.3, 1.3), skin=None):
    """主観の手（つり革を持つ）。肩から手へ袖が伸びる"""
    skin = skin or SKIN[0]
    root = empty(loc, 'myhand')
    link(sphere((0, 0, 0), 0.05, skin, scale=(1, 0.9, 1.3)), root)
    d = Vector(shoulder) - Vector(loc)
    sl = cyl(tuple(d * 0.5 + Vector((0, 0, 0))), 0.05, d.length, hexc('#2f3440'))
    sl.rotation_euler = Vector((0, 0, 1)).rotation_difference(d).to_euler(); link(sl, root)
    sl.location = d * 0.55
    return root


# ---------------- 病院 ----------------
def hosp_room(w=8, d=6, h=2.7, window=True, night=False):
    sky(hexc('#1b2236') if night else hexc('#d6d1c8')); s = bpy.context.scene
    s.view_settings.exposure = 0.05 if night else 0.45
    light_dir((0.2, -0.3, 0.9))
    room(w, d, h, floor=hexc('#d9d6cf'), wall=hexc('#eef1f0'), window=window, night=night)


def hosp_bed(loc, rot_z=0.0, patient=None, rnd=None, sit_up=False, name='pt'):
    """病院のベッド（頭は +y 側）。patient の色を渡すと寝ている人を置く"""
    root = empty(loc, 'hbed'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0.35), (1.0, 2.0, 0.12), hexc('#c8ccd0')), root)
    link(box((0, 0, 0.47), (0.96, 1.96, 0.12), hexc('#f4f4f2')), root)
    link(box((0, 0.98, 0.7), (1.0, 0.06, 0.6), hexc('#a9b4bc')), root)
    for sx in (-0.45, 0.45):
        for sy in (-0.9, 0.9):
            link(cyl((sx, sy, 0.17), 0.025, 0.34, hexc('#9aa0a6')), root)
    p = None
    if patient is not None:
        if sit_up:
            p = person((0, 0.55, 0.12), patient, pose='sit', rot_z=0, name=name)
        else:
            p = person((0, 0.25, 0.48), patient, pose='lie', rot_z=math.pi, name=name)
        p.parent = root
        if sit_up:
            link(box((0, -0.25, 0.6), (0.92, 1.0, 0.08), hexc('#b8cde0'), bevel=0.03), root)  # 掛け布団
        else:
            link(box((0, -0.3, 0.76), (0.94, 1.4, 0.06), hexc('#b8cde0'), bevel=0.03), root)
    return root, p


def stethoscope(loc, rot_z=0.0):
    root = empty(loc, 'steth'); root.rotation_euler = (0, 0, rot_z)
    link(cyl((0, 0, 0), 0.028, 0.012, hexc('#c0c4c8'), rot=(math.pi / 2, 0, 0)), root)
    link(cyl((0, 0.12, 0.12), 0.006, 0.3, hexc('#2a2a2a'), rot=(-0.8, 0, 0)), root)
    return root


def doctor(loc, rot_z=0.0, name='doc', act=None, pose='stand'):
    p = person(loc, hexc('#ffffff'), pants=hexc('#6a8fb0'), rot_z=rot_z, name=name, act=act, pose=pose)
    return p


def nurse(loc, rot_z=0.0, name='nurse', act=None):
    return person(loc, hexc('#9ccbd8'), pants=hexc('#9ccbd8'), rot_z=rot_z, name=name, act=act)


def iv_pole(loc, parent=None):
    root = empty(loc, 'iv')
    link(cyl((0, 0, 0.9), 0.015, 1.8, hexc('#c0c4c8')), root)
    link(box((0, 0, 1.75), (0.12, 0.04, 0.2), hexc('#e8f0f4')), root)
    for a in range(4):
        link(cyl((0.12 * math.cos(a * math.pi / 2), 0.12 * math.sin(a * math.pi / 2), 0.05), 0.03, 0.03, hexc('#3a3a3a')), root)
    if parent is not None:
        root.parent = parent
    return root


# ---------------- 自然 ----------------
def pebbles(k, xr, yr, seed=1, rgb=None, r=(0.05, 0.2)):
    rnd = random.Random(seed)
    for i in range(k):
        sphere((rnd.uniform(*xr), rnd.uniform(*yr), 0.0), rnd.uniform(*r), rgb or rnd.choice([hexc('#8a8478'), hexc('#7a746a'), hexc('#9a958d')]),
               scale=(1, 1, 0.55), seg=8)


def ant(loc, s=1.0, rot_z=0.0, name='ant', c=None):
    c = c or hexc('#2a1a14')
    root = empty(loc, name); root.scale = (s, s, s); root.rotation_euler = (0, 0, rot_z)
    for (y, r) in ((-0.03, 0.012), (0.0, 0.01), (0.035, 0.016)):
        link(sphere((0, y, 0.012), r, c, scale=(0.9, 1.2, 0.85), seg=10), root)
    for k in range(3):
        for sx in (-1, 1):
            link(cyl((sx * 0.014, -0.012 + k * 0.012, 0.006), 0.0018, 0.03, c, rot=(0, sx * 1.2, 0), verts=5), root)
    for sx in (-1, 1):
        link(cyl((sx * 0.006, -0.048, 0.022), 0.0015, 0.025, c, rot=(0.8, sx * 0.4, 0), verts=5), root)
    return root


def march(objs, n, path_fn, speed=0.002, f_step=2):
    """道に沿って歩く（path_fn(u) -> (x, y)）"""
    for i, o in enumerate(objs):
        u0 = i * 0.06
        prev = None
        for f in range(1, n + 1, f_step):
            u = u0 + speed * f
            x, y = path_fn(u)
            o.location = (x, y, o.location.z); o.keyframe_insert('location', frame=f)
            if prev is not None:
                dx, dy = x - prev[0], y - prev[1]
                o.rotation_euler.z = math.atan2(dx, -dy); o.keyframe_insert('rotation_euler', index=2, frame=f)
            prev = (x, y)


def grasshopper(loc, s=1.0, rot_z=0.0, name='hopper'):
    root = empty(loc, name); root.scale = (s, s, s); root.rotation_euler = (0, 0, rot_z)
    c = hexc('#6a9a3a')
    link(sphere((0, 0, 0.02), 0.012, c, scale=(0.8, 3.2, 0.9)), root)
    link(sphere((0, -0.042, 0.026), 0.01, c), root)
    for sx in (-1, 1):
        link(cyl((sx * 0.012, 0.018, 0.03), 0.003, 0.06, hexc('#5a8a30'), rot=(0.9, sx * 0.3, 0), verts=5), root)
        link(cyl((sx * 0.004, -0.06, 0.04), 0.0012, 0.04, c, rot=(1.1, sx * 0.3, 0), verts=4), root)
    return root


def mosquito(loc, name='mosq'):
    root = empty(loc, name); root.scale = (2, 2, 2)
    link(sphere((0, 0, 0), 0.004, hexc('#2a2a2a'), scale=(0.7, 2.6, 0.7)), root)
    wings = []
    for sx in (-1, 1):
        w = link(box((sx * 0.006, 0, 0.002), (0.012, 0.004, 0.0005), hexc('#c8d0d8')), root); wings.append(w)
    root['wings'] = [w.name for w in wings]
    return root


def buzz(o, n, center, r=0.15, seed=1):
    rnd = random.Random(seed)
    cx, cy, cz = center
    for f in range(1, n + 12, 12):
        o.location = (cx + rnd.uniform(-r, r), cy + rnd.uniform(-r, r), cz + rnd.uniform(-r * 0.5, r * 0.5))
        o.keyframe_insert('location', frame=f)
    for wn in o['wings']:
        w = O[wn]
        for f in range(1, n + 1, 1):
            w.rotation_euler.y = 0.9 if f % 2 else -0.9
            w.keyframe_insert('rotation_euler', index=1, frame=f)


def worm(loc, k=10, r=0.025, rot_z=0.0, name='worm', c=None):
    c = c or hexc('#c87a7a')
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z)
    segs = []
    for i in range(k):
        o = link(sphere((0, -i * r * 1.5, 0), r * (1.0 if i < k - 2 else 0.8), c, scale=(1, 1.1, 1), seg=10), root)
        segs.append(o)
    root['segs'] = [o.name for o in segs]
    return root


def crawl(wm, n, period=24, amp=0.012):
    for i, sn in enumerate(wm['segs']):
        o = O[sn]
        bx = o.location.x
        for f in range(1, n + period, period // 4):
            ph = (f / period + i * 0.12) * 2 * math.pi
            o.location.x = bx + amp * math.sin(ph); o.keyframe_insert('location', index=0, frame=f)


# ---------------- 海 ----------------
def underwater(deep=False):
    s = bpy.context.scene
    sky(hexc('#1d5a86') if not deep else hexc('#123a5a')); s.view_settings.exposure = 0.25
    light_dir((0.1, -0.2, 0.95)); s.display.shading.shadow_intensity = 0.3
    ground(rgb=hexc('#c8b890'))
    pebbles(40, (-12, 12), (-4, 18), seed=4, rgb=None, r=(0.2, 0.7))


def light_shafts(k=6, seed=3, h=14):
    rnd = random.Random(seed)
    for i in range(k):
        x = rnd.uniform(-8, 8); y = rnd.uniform(2, 14)
        o = cyl((x, y, h / 2), rnd.uniform(0.4, 0.9), h, (1, 1, 1), rot=(rnd.uniform(-0.15, 0.15), rnd.uniform(-0.15, 0.15), 0), verts=12)
        o.data.materials.clear(); o.data.materials.append(gmat((0.85, 0.95, 1.0), 0.09, 'shaft'))


def jellyfish(loc, s=1.0, c=(0.9, 0.85, 1.0), name='jelly', n=240, seed=1, rise=0.6):
    root = empty(loc, name); root.scale = (s, s, s)
    bell = ball((0, 0, 0), 0.3, c, a=0.45, seg=20, parent=root, name='bell')
    bell.scale = (1, 1, 0.6)
    ball((0, 0, 0.02), 0.14, (1.0, 0.75, 0.9), a=0.5, seg=12, parent=root, name='gonad')
    rnd = random.Random(seed)
    tents = []
    for k in range(8):
        a = k * math.pi / 4
        t = empty((0.2 * math.cos(a), 0.2 * math.sin(a), -0.08), 'tent'); link(t, root)
        o = cyl((0, 0, -0.35), 0.008, 0.7, (1, 1, 1), verts=5)
        o.data.materials.clear(); o.data.materials.append(gmat(c, 0.55, 'tent')); link(o, t)
        tents.append(t)
    # 傘の脈動と、触手のゆらぎ
    for f in range(1, n + 40, 20):
        bell.scale = (1.0, 1.0, 0.6); bell.keyframe_insert('scale', frame=f)
        bell.scale = (0.82, 0.82, 0.72); bell.keyframe_insert('scale', frame=f + 10)
    for i, t in enumerate(tents):
        wiggle(t, n, idx=0, amp=0.18, period=40 + i * 2)
    root.keyframe_insert('location', frame=1)
    root.location.z += rise * s * rnd.uniform(0.6, 1.0); root.location.x += rnd.uniform(-0.3, 0.3)
    root.keyframe_insert('location', frame=n)
    return root


def anemone(loc, s=1.0, c=None, n=240, seed=1):
    c = c or random.Random(seed).choice([hexc('#e87a8a'), hexc('#f2a050'), hexc('#c86ad0')])
    root = empty(loc, 'anem'); root.scale = (s, s, s)
    link(cyl((0, 0, 0.12), 0.1, 0.24, c, verts=14, r2=0.12), root)
    for k in range(14):
        a = k * 2 * math.pi / 14
        t = empty((0.09 * math.cos(a), 0.09 * math.sin(a), 0.24), 'at'); link(t, root)
        t.rotation_euler = (0.5 * math.sin(a), -0.5 * math.cos(a), 0)
        link(cyl((0, 0, 0.09), 0.014, 0.18, c, verts=6, r2=0.006), t)
        wiggle(t, n, idx=0, amp=0.2, period=50 + k * 3)
    return root


def coral(loc, s=1.0, c=None, seed=1):
    rnd = random.Random(seed)
    c = c or rnd.choice([hexc('#f08a6a'), hexc('#f2c070'), hexc('#e86a9a'), hexc('#9a7ad0')])
    root = empty(loc, 'coral'); root.scale = (s, s, s)
    def branch(p, d, L, depth):
        e = p + d * L
        o = cyl(tuple((p + e) / 2), 0.05 * (0.7 ** (3 - depth)) + 0.02, L, c, verts=8)
        o.rotation_euler = Vector((0, 0, 1)).rotation_difference(d).to_euler(); link(o, root)
        link(sphere(tuple(e), 0.05 * (0.7 ** (3 - depth)) + 0.02, c, seg=8), root)
        if depth > 0:
            for _ in range(2):
                nd = (d + Vector((rnd.uniform(-0.7, 0.7), rnd.uniform(-0.7, 0.7), 0.3))).normalized()
                branch(e, nd, L * 0.75, depth - 1)
    branch(Vector((0, 0, 0)), Vector((0, 0, 1)), 0.35, 3)
    return root


def sponge(loc, s=1.0, c=hexc('#e2b04a')):
    root = empty(loc, 'sponge'); root.scale = (s, s, s)
    link(cyl((0, 0, 0.35), 0.28, 0.7, c, verts=18, r2=0.34), root)
    link(cyl((0, 0, 0.66), 0.17, 0.1, hexc('#5a4020'), verts=16), root)  # 上の大きな穴
    rnd = random.Random(2)
    for k in range(40):
        a = rnd.uniform(0, 2 * math.pi); z = rnd.uniform(0.08, 0.62); r = 0.28 + (0.06 * z / 0.7)
        link(sphere((r * math.cos(a), r * math.sin(a), z), 0.022, hexc('#7a5a2a'), seg=6), root)
    return root


def particles_flow(n, starts, ends, rgb=(0.85, 0.95, 1.0), size=0.025, period=60, seed=1, a=0.9):
    """小さな光の粒が starts から ends へ流れる（くり返し）"""
    rnd = random.Random(seed)
    out = []
    for i, (p0, p1) in enumerate(zip(starts, ends)):
        o = ball(p0, size, rgb, a=a, seg=8, name='pt')
        off = rnd.randint(0, period)
        for f in range(1 - off, n + period, period):
            o.location = p0; o.keyframe_insert('location', frame=max(1, f))
            if f + period - 1 >= 1:
                o.location = p1; o.keyframe_insert('location', frame=max(2, f + period - 1))
        out.append(o)
    return out


def octopus(loc, s=1.0, c=hexc('#d8604a'), name='octo', n=240, swim=False):
    """タコ：頭（外套）＋8本の腕。swim=True なら腕をそろえて後ろへ流す"""
    root = empty(loc, name); root.scale = (s, s, s)
    body = link(sphere((0, 0.12, 0.3), 0.22, c, scale=(0.9, 1.25, 1.0)), root)
    link(sphere((0, -0.06, 0.18), 0.15, c), root)
    for sx in (-1, 1):
        link(sphere((sx * 0.1, -0.15, 0.22), 0.035, hexc('#f4efe6')), root)
        link(sphere((sx * 0.1, -0.175, 0.22), 0.018, hexc('#151515')), root)
    arms = []
    for k in range(8):
        a = k * 2 * math.pi / 8 + math.pi / 8
        j = empty((0.09 * math.cos(a), -0.06 + 0.09 * math.sin(a), 0.1), 'oarm'); link(j, root)
        j.rotation_euler = (math.pi / 2 - 0.6, 0, a - math.pi / 2) if not swim else (-1.3, 0.3 * math.sin(a), 0.3 * math.cos(a))
        segp = j
        for q in range(4):
            sj = empty((0, 0, -0.1 if q else 0), 'oseg'); link(sj, segp)
            link(cyl((0, 0, -0.06), 0.035 * (0.8 ** q), 0.13, c, verts=8, r2=0.035 * (0.8 ** (q + 1))), sj)
            sj.rotation_euler = (-0.25 if not swim else 0.05, 0, 0)
            wiggle(sj, n, idx=0, amp=0.18 if not swim else 0.08, period=(36 if not swim else 18) + k * 2)
            segp = sj
        arms.append(j)
    root['body'] = body.name
    return root


def rope(p0, p1, r=0.008, c=hexc('#c03a3a')):
    p0 = Vector(p0); p1 = Vector(p1); d = p1 - p0
    o = cyl(tuple((p0 + p1) / 2), r, d.length, c, verts=6)
    o.rotation_euler = Vector((0, 0, 1)).rotation_difference(d).to_euler()
    return o


def ghost_parts(root, rgb, a, names=('sph',)):
    m = gmat(rgb, a, 'ghostpart')
    for c in root.children:
        if c.type == 'MESH' and any(c.name.startswith(k) for k in names):
            c.data.materials.clear(); c.data.materials.append(m)


def rock(loc, r=1.0, c=hexc('#6a6a6a'), seed=1):
    rnd = random.Random(seed)
    return sphere(loc, r, c, scale=(rnd.uniform(1.0, 1.6), rnd.uniform(0.9, 1.3), rnd.uniform(0.5, 0.8)), seg=10)


# ---------------- 屋外の環境 ----------------
def meadow(rgb=hexc('#8fb06a'), sky_c=hexc('#9cc3e3'), exp=0.4):
    sky(sky_c); s = bpy.context.scene; s.view_settings.exposure = exp
    light_dir((0.5, -0.4, 0.7)); s.display.shading.shadow_intensity = 0.5
    ground(rgb=rgb)


def fence_line(x0, x1, y, h=1.1, c=hexc('#e8e2d6')):
    box(((x0 + x1) / 2, y, h * 0.85), (abs(x1 - x0), 0.08, 0.08), c)
    box(((x0 + x1) / 2, y, h * 0.45), (abs(x1 - x0), 0.08, 0.08), c)
    x = min(x0, x1)
    while x <= max(x0, x1):
        box((x, y, h / 2), (0.12, 0.12, h), c); x += 2.0


def barn(loc, rot_z=0.0, c=hexc('#a84432')):
    root = empty(loc, 'barn'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 2.2), (8, 10, 4.4), c), root)
    link(roof((0, 0, 4.4), 8.8, 10.6, 2.8, hexc('#4a4a4a'), rot_z=0), root)
    link(box((0, -5.03, 1.6), (3.0, 0.08, 3.2), hexc('#f2ece0')), root)
    return root


def truck(loc, rot_z=0.0, c=hexc('#f2f2ee'), cargo=hexc('#d9c08a')):
    root = empty(loc, 'truck'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, -1.9, 1.1), (2.0, 1.4, 1.8), hexc('#3a6aa0'), bevel=0.08), root)
    link(box((0, -2.58, 1.45), (1.8, 0.04, 0.7), hexc('#4d5d6b')), root)
    link(box((0, 1.0, 1.4), (2.2, 4.2, 2.2), c, bevel=0.04), root)
    for sx in (-1.0, 1.0):
        for sy in (-1.9, 0.0, 2.2):
            link(cyl((sx, sy, 0.45), 0.45, 0.3, hexc('#1e1e1e'), rot=(0, math.pi / 2, 0)), root)
    for k in range(3):
        link(box((0, 0.0 + k * 1.2, 2.7), (1.6, 0.9, 0.4), cargo), root)
    return root


def acorn(loc, s=1.0):
    root = empty(loc, 'acorn'); root.scale = (s, s, s)
    link(sphere((0, 0, 0.05), 0.04, hexc('#9a6a30'), scale=(0.9, 0.9, 1.2), seg=10), root)
    link(sphere((0, 0, 0.085), 0.042, hexc('#6a4a2a'), scale=(1, 1, 0.5), seg=10), root)
    return root


def kaki_tree(loc, s=1.0, fruits=24, seed=1, bare_from=None):
    """柿の木（実は橙の球）。bare_from を渡すとそのフレームから実が順に消える（もぎ取る）"""
    rnd = random.Random(seed)
    root = empty(loc, 'kaki'); root.scale = (s, s, s)
    link(cyl((0, 0, 1.0), 0.16, 2.0, hexc('#5a4030'), verts=10), root)
    for (x, y, z, r) in ((0, 0, 2.6, 1.3), (0.8, 0.2, 2.2, 0.9), (-0.8, -0.1, 2.3, 0.9)):
        link(sphere((x, y, z), r, hexc('#8a7a3a'), seg=12, scale=(1, 1, 0.8)), root)
    fr = []
    for k in range(fruits):
        a = rnd.uniform(0, 2 * math.pi); z = rnd.uniform(1.8, 3.2)
        rr = 1.15 + rnd.uniform(-0.15, 0.1)
        o = link(sphere((rr * math.cos(a), rr * math.sin(a), z), 0.12, hexc('#f07a20'), seg=10), root)
        fr.append(o)
    if bare_from is not None:
        for i, o in enumerate(fr):
            vanish(o, bare_from + i * 6)
    return root


def pine_forest(k=40, xr=(-20, 20), yr=(4, 40), seed=1, autumn=False, spring=False):
    rnd = random.Random(seed)
    for i in range(k):
        x = rnd.uniform(*xr); y = rnd.uniform(*yr); s = rnd.uniform(0.7, 1.4)
        if autumn:
            c = rnd.choice([hexc('#d0802a'), hexc('#c0502a'), hexc('#e0b040'), hexc('#8a7a3a')])
        elif spring:
            c = rnd.choice([hexc('#9ac860'), hexc('#7ab050'), hexc('#b8d880')])
        else:
            c = rnd.choice([hexc('#6f8f4e'), hexc('#5f7f45'), hexc('#7d9a55')])
        tree((x, y, 0), s=s, c=c)


def mountain(loc, r, h, c=hexc('#7a8a50')):
    return cone(loc, r, h, c, verts=24)
