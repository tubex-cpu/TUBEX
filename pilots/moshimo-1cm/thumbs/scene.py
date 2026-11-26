"""1cm のサムネ（文字なし）。社長（2026-11-26）「サムネあなたが制作して」。
使い方: python scene.py <A|B|C> <out.png> [W H spp]
  A：布団の上の小さな人を、茶トラ猫の巨大な顔がのぞき込み、前足が真上に（コピー「全人類が／1cmになったら」）
  B：台所の床で、頭より大きなご飯粒を抱える小さな人（「米一粒で／何日も生きる」）
  C：玄関先で、自分と同じ重さの雨粒が落ちてくる（「雨粒が／自分と同じ重さ」）
人は s=1（身長1.7m）で作り、まわりを約170倍の大きさで作る（猫は s≈100、米粒は長さ約0.85m、雨粒は直径約0.5m）。"""
import sys, os, math, random, time
os.environ['NEKO_VER'] = 'v5'; os.environ.setdefault('NEKO_OUT', '/home/user/work_neko/out_1cm')
sys.path.insert(0, '/home/user/TUBEX/pilots/moshimo-neko-meow/video'); sys.path.insert(0, '/home/user/TUBEX/pilots/moshimo-two-hearts/video')
sys.path.insert(0, '/home/user/TUBEX/pilots/moshimo-neko-cine')
from kit import *
from hk import O
import look as L
from mathutils import Vector


def area(loc, target, e, col=(1, 1, 1), size=3.0):
    d = bpy.data.lights.new('a', 'AREA'); d.energy = e; d.color = col; d.size = size
    o = bpy.data.objects.new('a', d); bpy.context.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()


def afraid(p, look_up=0.5, arms=None):
    """見上げる顔（目と開いた口）。arms：腕を前に上げる角度（x 回転）"""
    nk = O[p['neck']]; nk.rotation_euler.x = look_up
    head = O[p['head']]
    for sx in (-1, 1):
        link(sphere((sx * 0.045, -0.115, 0.03), 0.022, hexc('#111111')), head)
        link(sphere((sx * 0.045, -0.105, 0.075), 0.03, hexc('#2b2420'), scale=(1.2, 0.4, 0.35)), head)  # 眉
    link(sphere((0, -0.118, -0.045), 0.03, hexc('#5a1a1a'), scale=(0.8, 0.4, 1.2)), head)  # 開いた口
    if arms is not None:
        for a, d in zip(p['arms'], (1, -1)):
            O[a].rotation_euler = (arms, d * 0.25, 0)


def head_only(root):
    """猫の頭（とその子）以外を描かない"""
    head = O[root['head']]
    keep = set([head.name] + [c.name for c in head.children_recursive])
    stack = [root]
    while stack:
        o = stack.pop(); stack.extend(o.children)
        if o.name not in keep and o.type == 'MESH':
            o.hide_render = True; o.hide_viewport = True


def scene_A():
    sky(hexc('#2a3040'))
    plane((0, 20, 0), (300, 300), hexc('#efe6d8'))  # 布団の表面
    rnd = random.Random(3)
    for i in range(6):  # 布団のしわ（丘）
        cyl((rnd.uniform(-20, 14), rnd.uniform(4, 40), -0.5), rnd.uniform(0.9, 1.6), 40, hexc('#ebe7df'), rot=(0, math.pi / 2, rnd.uniform(-0.4, 0.4)), verts=12)
    box((-30, 46, 5), (30, 16, 11), hexc('#e6e2da'), bevel=3.5)  # 枕（山）
    c = cat((7.0, 26.0, -28.5), 'tora', s=100, rot_z=0.3, name='cat')
    head_only(c)
    O[c['head']].rotation_euler.x = 0.25  # 少し見下ろす
    you = person((-1.2, 0.6, 0), hexc('#d04a3a'), pants=hexc('#2f4a7a'), rot_z=-0.35, pose='sit', name='you')
    afraid(you, -0.75, arms=-1.9)
    return (-0.4, -3.4, 0.55), (0.6, 6.0, 3.6), 18, 4.0


def scene_B():
    sky(hexc('#e9dcc6'))
    plane((0, 20, 0), (300, 300), hexc('#b88a5a'))  # 床
    for i in range(-12, 13):
        box((i * 7.0 + 1.5, 20, 0.01), (0.15, 300, 0.02), hexc('#8a6440'))
    grain = sphere((0.25, 0.9, 0.5), 0.62, hexc('#fbf8f0'), scale=(0.75, 1.5, 0.85))
    grain.rotation_euler = (0, 0, 0.9)
    for k in range(6):
        r = random.Random(k)
        sphere((r.uniform(-25, 25), r.uniform(12, 40), 0.5), 0.62, hexc('#fbf8f0'), scale=(0.75, 1.5, 0.85))
    cyl((-16, 45, 14), 24, 28, hexc('#2f3f60'), verts=32)  # 茶わん（奥）
    for dx in (14, 17):  # 箸
        cyl((dx, 40, 10), 0.9, 60, hexc('#6a3a22'), rot=(0.25, -1.2, 0.2), verts=8)
    you = person((-0.75, 0.55, 0), hexc('#e8a33d'), pants=hexc('#4a6aa0'), rot_z=-0.55, name='you')
    afraid(you, -0.1, arms=-1.15)
    return (-2.6, -3.6, 0.7), (0.0, 0.8, 1.45), 26, 4.2


def scene_C():
    sky(hexc('#8a929c'))
    plane((0, 20, 0), (300, 300), hexc('#5c5a56'))  # 濡れた地面
    box((4.2, 3.0, 3.0), (6.0, 4.0, 0.12), hexc('#3f8a3a'), rot=(0.3, 0.0, 0.35), bevel=0.05)  # 葉っぱ
    cyl((4.4, 3.5, 1.4), 0.08, 2.8, hexc('#2f6a2a'))
    box((-40, 70, 40), (30, 4, 80), hexc('#5a4a3a'))  # 玄関のドア（奥）
    cyl((30, 50, 14), 9, 28, hexc('#a0603a'), verts=24)  # 植木鉢
    sphere((-0.15, 0.55, 2.55), 0.45, hexc('#cfe6f5'), scale=(1, 1, 1.15))  # 頭上に落ちてくる雨粒
    for k in range(12):  # はじけた雨粒の王冠
        a = k / 12 * 2 * math.pi
        sphere((1.9 + 0.95 * math.cos(a), 2.2 + 0.95 * math.sin(a), 0.9 + 0.5 * (k % 2)), 0.14, hexc('#cfe6f5'))
    cyl((1.9, 2.2, 0.06), 1.1, 0.12, hexc('#cfe6f5'), verts=24)
    for k in range(18):
        r = random.Random(k)
        sphere((r.uniform(-14, 14), r.uniform(5, 40), r.uniform(2, 20)), 0.45, hexc('#cfe6f5'), scale=(1, 1, 1.15))
    you = person((0.0, 0.2, 0), hexc('#d0503a'), pants=hexc('#3a4a6a'), rot_z=-0.4, name='you')
    afraid(you, -0.75, arms=-2.6)
    return (-2.4, -4.0, 0.6), (0.3, 1.0, 2.6), 20, 4.4


def finish(res, spp, which):
    L.cat_details()
    L.to_eevee(res, spp, wet=(which == 'C'))
    for m in bpy.data.materials:
        b = m.node_tree.nodes.get('Principled BSDF') if m.node_tree else None
        if b is None:
            continue
        c = b.inputs['Base Color'].default_value
        if c[2] > 0.8 and c[1] > 0.75 and c[0] < 0.7 and c[0] > 0.5:  # 水（雨粒）：透明に
            b.inputs['Transmission Weight'].default_value = 0.9; b.inputs['Roughness'].default_value = 0.05; b.inputs['IOR'].default_value = 1.33
    # 猫の目：虹彩は金色、瞳は黒（大きな猫では look.cat_details の判定が両方に効くため直す）
    for r in [o for o in bpy.data.objects if o.get('kind') == 'cat']:
        es = r['eyes']
        for k, e in enumerate(es):
            o = O[e]; m = bpy.data.materials.new('eye'); m.use_nodes = True
            b = m.node_tree.nodes['Principled BSDF']
            b.inputs['Base Color'].default_value = (0.02, 0.02, 0.02, 1) if k % 2 else (0.95, 0.6, 0.06, 1)
            b.inputs['Roughness'].default_value = 0.1
            o.data.materials.clear(); o.data.materials.append(m)
    w = bpy.context.scene.world; w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    if which == 'A':
        bg.inputs['Color'].default_value = (0.22, 0.25, 0.33, 1); bg.inputs['Strength'].default_value = 0.6
        L.sun((0.55, -0.6, 0.55), 5.0, (1.0, 0.8, 0.58))
        area((-3, -3, 3), (-1, 0.6, 0.8), 150, (1.0, 0.92, 0.85), size=1.5)
        area((2, -4, 12), (6, 10, 8), 3000, (1.0, 0.85, 0.65), size=8)
    elif which == 'B':
        bg.inputs['Color'].default_value = (0.8, 0.7, 0.55, 1); bg.inputs['Strength'].default_value = 0.6
        L.sun((-0.6, 0.5, -0.6), 3.0, (1.0, 0.86, 0.66))
        area((-3, -3, 4), (0, 1, 0.5), 250)
    else:
        bg.inputs['Color'].default_value = (0.45, 0.5, 0.56, 1); bg.inputs['Strength'].default_value = 0.8
        area((-3, -2, 7), (0, 1, 1), 500, (0.85, 0.92, 1.0))


if __name__ == '__main__':
    which, out = sys.argv[1], sys.argv[2]
    res = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (1600, 900)
    spp = int(sys.argv[5]) if len(sys.argv) > 5 else 32
    reset(res)
    pos, tgt, lens, focus = {'A': scene_A, 'B': scene_B, 'C': scene_C}[which]()
    finish(res, spp, which)
    cam = camera(lens, dof=focus, fstop=1.4)
    look(cam, pos, tgt)
    cam.data.clip_start = 0.05; cam.data.clip_end = 2000
    s = bpy.context.scene; s.frame_set(1); s.render.filepath = out
    t = time.time(); bpy.ops.render.render(write_still=True); print('TIME', which, round(time.time() - t, 1))
