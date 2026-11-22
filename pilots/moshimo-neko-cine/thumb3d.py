"""3D風サムネの主役素材（文字なし）。本編と同じ部品を、シネマ調（EEVEE：夕焼けの空、街灯、濡れた路面、面のある猫）で描く。
社長（2026-11-22）「猫のサムネを3D風のサムネも制作したい」「この動画の切り抜き風の背景画像のクオリティに納得していない」。
使い方: python thumb3d.py <A|B|C> <out.png> [W H spp]
  A：夕暮れの路地を埋める猫の群れ、右手前に大きく鳴く茶トラ（文字は左上の空）
  B：見下ろすと足元の猫が全員こちらを見上げて鳴く（文字は上の空き）
  C：路地の奥まで続く猫の列を低い位置から（文字は左上）"""
import sys, os, math, random, time
HERE = os.path.dirname(os.path.abspath(__file__))
os.environ['NEKO_VER'] = 'v5'; os.environ['NEKO_OUT'] = '/home/user/work_neko/out_cine'
sys.path.insert(0, os.path.join(HERE, '..', 'moshimo-neko-meow', 'video')); sys.path.insert(0, HERE)
from kit import *
import shots_v5 as S
import look as L

COATS_MIX = ['tora', 'tora', 'mike', 'shiro', 'saba', 'kuro', 'hachi']


def lanterns(ys, xs=(-2.0, 2.0)):
    for y in ys:
        for x in xs:
            cyl((x, y, 1.4), 0.05, 2.8, hexc('#2a2a2a'))
            sphere((x * 0.9, y, 2.85), 0.16, hexc('#ffd070'))
            L.lamp((x * 0.9, y, 2.6), 120, (1.0, 0.68, 0.38), r=0.15)


def hydrangeas(x, ys, rnd):
    for y in ys:
        for k in range(6):
            sphere((x + rnd.uniform(-0.15, 0.15), y + rnd.uniform(-0.4, 0.4), 1.35 + rnd.uniform(0, 0.3)), 0.17,
                   rnd.choice([hexc('#6a7ad8'), hexc('#8a6ad0'), hexc('#5a8ae0')]))


def crowd(rnd, n, y0, dy, xr=(-1.3, 1.3), face=0.0):
    for i in range(n):
        y = y0 + (i // 6) * dy + rnd.uniform(-0.2, 0.2); x = rnd.uniform(*xr)
        c = cat((x, y, 0), rnd.choice(COATS_MIX), s=0.62, rot_z=face + rnd.uniform(-0.35, 0.35))
        meow(c, [1], dur=30, lift=0.35)


def darken_walls():
    for m in bpy.data.materials:
        if m.node_tree and 'Principled BSDF' in m.node_tree.nodes and m.name not in ('wet', 'sky', 'iris'):
            b = m.node_tree.nodes['Principled BSDF']
            if b.inputs['Emission Strength'].default_value == 0:
                c = b.inputs['Base Color'].default_value
                if c[0] > 0.45 and c[1] > 0.4 and c[2] > 0.35 and abs(c[0] - c[2]) < 0.2:
                    b.inputs['Base Color'].default_value = (c[0] * 0.5, c[1] * 0.48, c[2] * 0.52, 1)


def finish(res, spp):
    L.cat_details()
    L.to_eevee(res, spp)
    darken_walls()
    L.sky_gradient(0.9)
    L.sun((0.05, -1.0, 0.1), 4.5, (1.0, 0.55, 0.32))


def scene_A(res, spp):
    S.street_env(corner=False)
    rnd = random.Random(5)
    crowd(rnd, 96, -11.0, 0.75)
    front = cat((0.62, -12.75, 0), 'tora', s=0.62, rot_z=0.35, name='front'); meow(front, [1], dur=30, lift=0.45)
    lanterns((-12, -6, 0, 6, 12)); hydrangeas(2.0, (-12.5, -9, -5, -1), rnd)
    finish(res, spp)
    L.backdrop((0, 30, 5), 30, 14)
    cam = camera(30, dof=0.85, fstop=1.4)
    look(cam, (1.05, -13.55, 0.28), (-0.35, -6.0, 1.05))


def scene_B(res, spp):
    S.street_env(corner=False)
    rnd = random.Random(8)
    for i in range(46):
        a = rnd.uniform(0, 2 * math.pi); r = 0.55 + rnd.uniform(0, 2.6)
        x, y = r * math.cos(a) * 0.7, r * math.sin(a) + 0.4
        if abs(x) > 1.4:
            continue
        c = cat((x, y, 0), rnd.choice(COATS_MIX), s=0.62, rot_z=-math.atan2(x, y + 0.9))
        meow(c, [1], dur=30, lift=0.6)
    front = cat((0.45, -0.25, 0), 'tora', s=0.62, rot_z=-0.4, name='front'); meow(front, [1], dur=30, lift=0.7)
    lanterns((-2, 4), xs=(2.0,)); hydrangeas(2.0, (1, 3), rnd)
    finish(res, spp)
    cam = camera(26, dof=1.5, fstop=2.0)
    look(cam, (0.0, -1.35, 1.55), (0.1, 0.55, 0.05))


def scene_C(res, spp):
    S.street_env(corner=False)
    rnd = random.Random(11)
    for i in range(70):
        side = -1 if i % 2 else 1
        y = -11.5 + (i // 2) * 0.55
        c = cat((side * rnd.uniform(0.45, 1.25), y, 0), rnd.choice(COATS_MIX), s=0.62, rot_z=rnd.uniform(-0.25, 0.25))
        meow(c, [1], dur=30, lift=0.4)
    front = cat((0.9, -12.6, 0), 'tora', s=0.62, rot_z=0.15, name='front'); meow(front, [1], dur=30, lift=0.4)
    lanterns((-12, -7, -2, 3, 8, 13)); hydrangeas(2.0, (-12, -8, -4), rnd)
    finish(res, spp)
    L.backdrop((0, 30, 4), 30, 12)
    cam = camera(24, dof=1.4, fstop=2.0)
    look(cam, (0.25, -14.2, 0.45), (0.0, -2.0, 1.2))


if __name__ == '__main__':
    which, out = sys.argv[1], sys.argv[2]
    res = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (1600, 900)
    spp = int(sys.argv[5]) if len(sys.argv) > 5 else 32
    reset(res)
    {'A': scene_A, 'B': scene_B, 'C': scene_C}[which](res, spp)
    s = bpy.context.scene; s.frame_set(8); s.render.filepath = out
    t = time.time(); bpy.ops.render.render(write_still=True); print('TIME', which, round(time.time() - t, 1))
