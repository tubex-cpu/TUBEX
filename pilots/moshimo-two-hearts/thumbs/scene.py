"""サムネの主役素材（文字なし）：人・クマ・犬・猫・ハトが並び、どの胸にもハートが二つ光る。
社長（2026-11-25）「イラストは人やくま、他の生物の心臓が2個になっているのがわかる様子にしたい」。
コピー「全生物の心臓が二つ？」は compose.py で上に入れる（絵と重ねない）。
使い方: python scene.py <out.png> [W H spp]"""
import sys, os, math, time
HERE = os.path.dirname(os.path.abspath(__file__))
os.environ['NEKO_VER'] = 'v5'; os.environ.setdefault('NEKO_OUT', '/home/user/work_neko/out_hearts')
V = os.path.join(HERE, '..', '..', 'moshimo-neko-meow', 'video')
sys.path.insert(0, V); sys.path.insert(0, os.path.join(HERE, '..', 'video'))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'moshimo-neko-cine'))
from kit import *
from hk import O, animal, heart3d, chest_point, _bodyof, body_center, local_semi, birdbody
from shots_v5 import pigeon
import look as L

from mathutils import Vector, Matrix

HEART_SIZE = 0.22


def two_hearts(root, s=1.0, up=0.25, out=0.5, fwd=0.06):
    bpy.context.view_layer.update()
    body = _bodyof(root)
    for side in (1, -1):
        p = chest_point(body, side, up, out)
        w = body.parent.matrix_world @ p if body.parent else p
        heart3d(w + Vector((0, -fwd, 0)), s=HEART_SIZE * s)


def side_hearts(root, s=1.0, along=0.3, fwd=0.05, dz=0.1):
    """横向きの動物：体の手前側（カメラ側）の胸のあたりに、体の向きに沿って二つ並べる"""
    bpy.context.view_layer.update()
    body = _bodyof(root); semi = local_semi(body)
    mw = body.parent.matrix_world if body.parent else Matrix()
    c = mw @ body_center(body)
    head = O[root['head']].matrix_world.translation
    fdir = Vector((head.x - c.x, 0, 0)).normalized()
    sc = body.parent.matrix_world.to_scale().x if body.parent else 1.0
    base = c + fdir * semi.y * sc * 0.35 + Vector((0, -semi.x * sc - fwd, dz))
    for k in (-1, 1):
        heart3d(base + fdir * k * along * 0.5, s=HEART_SIZE * s)


def dark_eyes(root):
    """猫の緑の目を、クマ・シカ・犬では黒に"""
    head = O[root['head']]
    black = mat(hexc('#2a1a10'))
    for o in list(bpy.data.objects):
        q = o.parent
        while q is not None and q is not head:
            q = q.parent
        if q is head and o.type == 'MESH' and len(o.material_slots):
            m = o.material_slots[0].material
            dc = m.diffuse_color if m is not None else None
            if dc is not None and dc[1] > dc[0] * 1.5 and dc[1] > dc[2] * 2.5:
                o.material_slots[0].material = black


def build():
    sky(hexc('#0e1426'))
    floor = plane((0, 4, 0), (60, 60), hexc('#0a0e1a'))
    # 並び（左から）：シカ（横向き）・人・クマ／手前に犬と猫、ハト
    you = person((-0.45, 0.5, 0), hexc('#3d6ea8'), pants=hexc('#2a3348'), rot_z=0.0, name='you')
    bear = animal((1.35, 0.8, 0), 'bear', rot_z=-0.4, pose='sit', name='bear')
    dog = animal((-2.0, 0.2, 0), 'shiba', s=1.7, rot_z=0.35, pose='sit', name='dog')
    c = cat((-1.05, -0.4, 0), 'tora', s=1.15, rot_z=-0.25, name='cat')
    pg = pigeon((0.6, -0.45, 0), s=4.2, rot_z=-0.5, name='pg')
    print("A", flush=True)
    for r in (bear, dog):
        dark_eyes(r)
    print("B", flush=True)
    two_hearts(you, 0.8, up=0.35, out=0.75)
    two_hearts(bear, 1.3, up=0.2, out=0.55, fwd=0.1)
    two_hearts(dog, 0.9, up=0.2, out=0.6)
    two_hearts(c, 0.7, up=0.2, out=0.6)
    two_hearts(birdbody(pg), 0.6, up=0.1, out=0.7, fwd=0.04)
    return floor


def finish(res, spp):
    L.to_eevee(res, spp, wet=False)
    for m in bpy.data.materials:
        if m.name.startswith('heart3d'):
            b = m.node_tree.nodes['Principled BSDF']
            b.inputs['Base Color'].default_value = (0.9, 0.0, 0.03, 1)
            b.inputs['Emission Color'].default_value = (1.0, 0.0, 0.04, 1)
            b.inputs['Emission Strength'].default_value = 0.7
    w = bpy.context.scene.world; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.02, 0.03, 0.07, 1)
    # 主役に上から当てる光と、後ろの輪郭光（暗い背景から浮かせる）
    for loc, e, col in (((0, -2.5, 4.5), 420, (1.0, 0.92, 0.85)), ((-3, 3.5, 3), 500, (0.5, 0.65, 1.0)), ((3, 3.5, 3), 500, (0.5, 0.65, 1.0))):
        d = bpy.data.lights.new('spot', 'AREA'); d.energy = e; d.color = col; d.size = 2.5
        o = bpy.data.objects.new('spot', d); bpy.context.collection.objects.link(o); o.location = loc
        o.rotation_euler = (Vector((0, 0.4, 0.6)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    # 背景の淡い光のにじみ
    L.lamp((0, 6, 1.2), 300, (0.35, 0.45, 0.9), r=2.0)


if __name__ == '__main__':
    out = sys.argv[1]
    res = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1600, 900)
    spp = int(sys.argv[4]) if len(sys.argv) > 4 else 32
    reset(res)
    build()
    print("C", flush=True); finish(res, spp); print("D", flush=True)
    cam = camera(34)
    look(cam, (-0.3, -4.6, 0.75), (-0.3, 0.2, 1.3))
    s = bpy.context.scene; s.frame_set(1); s.render.filepath = out
    t = time.time(); bpy.ops.render.render(write_still=True); print('TIME', round(time.time() - t, 1))
