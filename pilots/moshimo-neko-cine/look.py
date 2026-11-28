"""シネマ調（社長の参考画像 2026-11-22：ローポリの面のある猫、夕焼け、街灯、濡れた路面の映り込み）に寄せる共通処理。
kit.py / shots.py の部品で組んだ場面を、EEVEE 用の材質・光に置き換える。"""
import bpy, math, os
from mathutils import Vector

ASSET = '/home/user/work_neko/assets'


def sunset_tex():
    from PIL import Image
    p = f'{ASSET}/sunset_grad.png'
    if os.path.exists(p):
        return p
    W, H = 512, 1024
    im = Image.new('RGB', (W, H))
    stops = [(0.0, (44, 40, 92)), (0.35, (120, 70, 140)), (0.6, (235, 120, 110)), (0.8, (255, 170, 90)), (0.92, (255, 205, 130)), (1.0, (200, 120, 90))]
    for y in range(H):
        t = y / (H - 1)
        for i in range(len(stops) - 1):
            a, b = stops[i], stops[i + 1]
            if a[0] <= t <= b[0]:
                u = (t - a[0]) / (b[0] - a[0]); c = tuple(int(a[1][k] + (b[1][k] - a[1][k]) * u) for k in range(3)); break
        for x in range(W):
            im.putpixel((x, y), c)
    im.save(p)
    return p


def to_eevee(res=(1280, 720), samples=16, wet=True):
    s = bpy.context.scene
    s.render.engine = 'BLENDER_EEVEE'
    s.render.resolution_x, s.render.resolution_y = res
    e = s.eevee
    e.taa_render_samples = samples
    for k in ('use_raytracing', 'use_shadows', 'use_gtao'):
        if hasattr(e, k):
            setattr(e, k, True)
    s.view_settings.view_transform = 'AgX'
    s.view_settings.look = 'AgX - Punchy' if 'AgX - Punchy' in [i.identifier for i in s.view_settings.bl_rna.properties['look'].enum_items] else 'None'
    s.view_settings.exposure = 0.0
    # 材質：Workbench の色を Principled に
    for m in bpy.data.materials:
        c = m.diffuse_color
        m.use_nodes = True
        nt = m.node_tree
        bsdf = nt.nodes.get('Principled BSDF')
        if bsdf is None:
            continue
        if not any(l.to_socket == bsdf.inputs['Base Color'] for l in nt.links):
            bsdf.inputs['Base Color'].default_value = (c[0], c[1], c[2], 1)
        bsdf.inputs['Roughness'].default_value = 0.7
        lum = 0.3 * c[0] + 0.6 * c[1] + 0.1 * c[2]
        # 窓の明かり・街灯（黄色く明るい色）は光らせる
        if c[0] > 0.8 and c[1] > 0.5 and c[2] < 0.35:
            bsdf.inputs['Emission Color'].default_value = (c[0], c[1] * 0.85, c[2] * 0.6, 1)
            bsdf.inputs['Emission Strength'].default_value = 6.0
    # 面のある（ローポリの）見た目：丸い部品を間引いて平らに塗る
    for o in bpy.data.objects:
        if o.type == 'MESH' and len(o.data.polygons) > 60:
            d = o.modifiers.new('lowpoly', 'DECIMATE'); d.ratio = 0.22
            for p in o.data.polygons:
                p.use_smooth = False
    # 濡れた路面：灰色の平らな大きい面を映り込むように
    if wet:
        for o in bpy.data.objects:
            if o.type == 'MESH' and o.dimensions.z < 0.05 and o.dimensions.x * o.dimensions.y > 20:
                m = bpy.data.materials.new('wet'); m.use_nodes = True
                b = m.node_tree.nodes['Principled BSDF']
                b.inputs['Base Color'].default_value = (0.05, 0.05, 0.06, 1); b.inputs['Roughness'].default_value = 0.12
                o.data.materials.clear(); o.data.materials.append(m)


def sunset_world(strength=0.6):
    w = bpy.context.scene.world; w.use_nodes = True
    nt = w.node_tree; bg = nt.nodes.get('Background')
    bg.inputs['Color'].default_value = (0.55, 0.32, 0.36, 1); bg.inputs['Strength'].default_value = strength


def backdrop(loc, w, h, rot=(math.pi / 2, 0, 0)):
    """道の先の夕焼け空（光る板）"""
    bpy.ops.mesh.primitive_plane_add(location=loc, rotation=rot)
    o = bpy.context.object; o.scale = (w / 2, h / 2, 1)
    m = bpy.data.materials.new('sky'); m.use_nodes = True; nt = m.node_tree
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(sunset_tex())
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Strength'].default_value = 1.6
    out = nt.nodes['Material Output']
    nt.links.new(t.outputs['Color'], em.inputs['Color']); nt.links.new(em.outputs['Emission'], out.inputs['Surface'])
    o.data.materials.append(m)
    return o


def sun(direction=(-0.2, 1.0, 0.18), energy=3.0, color=(1.0, 0.62, 0.38)):
    d = bpy.data.lights.new('sun', 'SUN'); d.energy = energy; d.color = color; d.angle = 0.05
    o = bpy.data.objects.new('sun', d); bpy.context.collection.objects.link(o)
    o.rotation_euler = Vector(direction).to_track_quat('Z', 'Y').to_euler()
    return o


def lamp(loc, energy=60, color=(1.0, 0.75, 0.45), r=0.1):
    d = bpy.data.lights.new('lamp', 'POINT'); d.energy = energy; d.color = color; d.shadow_soft_size = r
    o = bpy.data.objects.new('lamp', d); bpy.context.collection.objects.link(o); o.location = loc
    return o


def sky_gradient(strength=1.0, night=False):
    """空のグラデーション（上＝紫、地平線＝橙）。どの向きのカメラでも夕焼けになる"""
    w = bpy.context.scene.world; w.use_nodes = True; nt = w.node_tree
    bg = nt.nodes.get('Background')
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); ramp = nt.nodes.new('ShaderNodeValToRGB')
    nt.links.new(tc.outputs['Generated'], sep.inputs['Vector']); nt.links.new(sep.outputs['Z'], ramp.inputs['Fac'])
    cr = ramp.color_ramp
    # Generated の Z は -1〜1。0（地平線）から上へ：橙 → 桃 → 紫 → 深い紺
    cols = [(0.0, (1.0, 0.45, 0.20)), (0.08, (1.0, 0.38, 0.30)), (0.22, (0.70, 0.25, 0.45)), (0.5, (0.22, 0.12, 0.38)), (1.0, (0.04, 0.04, 0.14))]
    if night:
        cols = [(0.0, (0.02, 0.02, 0.04)), (0.5, (0.10, 0.08, 0.16)), (1.0, (0.02, 0.03, 0.08))]
    cr.elements[0].position, cr.elements[0].color = cols[0][0], (*cols[0][1], 1)
    cr.elements[1].position, cr.elements[1].color = cols[-1][0], (*cols[-1][1], 1)
    for p, c in cols[1:-1]:
        el = cr.elements.new(p); el.color = (*c, 1)
    nt.links.new(ramp.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = strength


def cat_details():
    """猫の顔を参考画像に寄せる：大きな目と光、ピンクの耳の内側、ひげ、牙"""
    import kit
    for r in [o for o in bpy.data.objects if o.get('kind') == 'cat']:
        head = bpy.data.objects[r['head']]
        for ch in list(head.children):
            if ch.name.startswith('cone') and ch.scale.length > 0:
                inner = kit.cone((0, 0, 0), 0.026, 0.05, kit.hexc('#f2a0a8'), verts=4)
                inner.parent = ch; inner.location = (0, -0.012, -0.008); inner.rotation_euler = (0, 0, 0)
        for e in r['eyes']:
            o = bpy.data.objects[e]
            o.scale = (o.scale.x * 1.35, o.scale.y, o.scale.z * 1.35)
            if o.dimensions.x > 0.03:  # 白目側＝虹彩を金色に
                m = bpy.data.materials.new('iris'); m.use_nodes = True
                m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.95, 0.62, 0.08, 1)
                m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.15
                o.data.materials.clear(); o.data.materials.append(m)
        for sx in (-1, 1):
            hl = kit.sphere((sx * 0.048, -0.104, 0.034), 0.005, (1, 1, 1), seg=8); hl.parent = head
            for k, dz in enumerate((-0.01, -0.025)):
                w = kit.cyl((sx * 0.1, -0.1, -0.03 + dz), 0.0018, 0.11, (0.95, 0.95, 0.95), rot=(0, math.pi / 2, sx * 0.12 * (k + 1)), verts=4)
                w.parent = head
        for sx in (-1, 1):
            t = kit.cone((sx * 0.016, -0.112, -0.035), 0.005, 0.016, (1, 1, 1), rot=(math.pi, 0, 0), verts=4); t.parent = head
