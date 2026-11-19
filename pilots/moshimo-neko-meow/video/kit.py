"""Blender（bpy）用の部品キット：猫・人・家・街・部屋などを手続き的に作る。描画は Workbench（ミニチュア風）。"""
import bpy, math, random
from mathutils import Vector, Euler

FPS = 24

# ---------- 基本 ----------
def reset(res=(1280, 720)):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene
    s.render.engine = 'BLENDER_WORKBENCH'
    s.render.resolution_x, s.render.resolution_y = res
    s.render.fps = FPS
    s.display.shading.light = 'STUDIO'
    s.display.shading.studio_light = 'outdoor.sl'
    s.display.shading.color_type = 'TEXTURE'
    s.display.shading.show_shadows = True
    s.display.shading.shadow_intensity = 0.42
    s.display.shading.show_cavity = True
    s.display.shading.cavity_type = 'BOTH'
    s.display.shading.cavity_ridge_factor = 0.6
    s.display.shading.cavity_valley_factor = 1.0
    s.display.shading.curvature_ridge_factor = 0.4
    s.display.shading.curvature_valley_factor = 0.6
    s.display.shading.show_specular_highlight = False
    s.display.shading.background_type = 'WORLD'
    s.display.light_direction = (0.55, -0.35, 0.76)
    s.display.shadow_shift = 0.1
    s.display.shadow_focus = 0.25
    s.display.render_aa = '8'
    s.view_settings.view_transform = 'Standard'
    s.view_settings.exposure = 0.55
    s.view_settings.gamma = 1.05
    w = bpy.data.worlds.new('w'); s.world = w
    w.color = (0.62, 0.74, 0.86)
    random.seed(7)
    return s

def sky(color):
    bpy.context.scene.world.color = color

def light_dir(v):
    bpy.context.scene.display.light_direction = v

_mats = {}
def mat(rgb, name=None):
    key = name or tuple(round(c, 3) for c in rgb)
    if key in _mats and _mats[key].name in bpy.data.materials:
        return _mats[key]
    m = bpy.data.materials.new(str(key))
    m.diffuse_color = (*rgb, 1)
    _mats[key] = m
    return m

def hexc(h):
    h = h.lstrip('#')
    c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)

def setmat(o, rgb):
    o.data.materials.clear(); o.data.materials.append(mat(rgb)); return o

def link(o, parent):
    o.parent = parent; return o

def box(loc, size, rgb, rot=(0, 0, 0), name='box', bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.object; o.name = name
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        m = o.modifiers.new('b', 'BEVEL'); m.width = bevel; m.segments = 2
    return setmat(o, rgb)

def sphere(loc, r, rgb, scale=(1, 1, 1), seg=24, name='sph'):
    bpy.ops.mesh.primitive_uv_sphere_add(location=loc, radius=r, segments=seg, ring_count=max(8, seg // 2))
    o = bpy.context.object; o.name = name; o.scale = scale
    bpy.ops.object.shade_smooth()
    return setmat(o, rgb)

def cyl(loc, r, h, rgb, rot=(0, 0, 0), verts=16, name='cyl', r2=None):
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(location=loc, radius=r, depth=h, rotation=rot, vertices=verts)
    else:
        bpy.ops.mesh.primitive_cone_add(location=loc, radius1=r, radius2=r2, depth=h, rotation=rot, vertices=verts)
    o = bpy.context.object; o.name = name
    return setmat(o, rgb)

def cone(loc, r, h, rgb, rot=(0, 0, 0), verts=12, name='cone'):
    bpy.ops.mesh.primitive_cone_add(location=loc, radius1=r, depth=h, rotation=rot, vertices=verts)
    o = bpy.context.object; o.name = name
    return setmat(o, rgb)

def plane(loc, size, rgb, rot=(0, 0, 0), name='plane'):
    bpy.ops.mesh.primitive_plane_add(location=loc, rotation=rot)
    o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, 1)
    bpy.ops.object.transform_apply(scale=True)
    return setmat(o, rgb)

def empty(loc=(0, 0, 0), name='e'):
    o = bpy.data.objects.new(name, None); bpy.context.collection.objects.link(o); o.location = loc
    return o

def roof(loc, w, d, h, rgb, rot_z=0):
    """切妻屋根（三角柱）"""
    import bmesh
    me = bpy.data.meshes.new('roof'); bm = bmesh.new()
    x, y = w / 2, d / 2
    vs = [bm.verts.new(v) for v in [(-x, -y, 0), (x, -y, 0), (0, -y, h), (-x, y, 0), (x, y, 0), (0, y, h)]]
    for f in [(0, 1, 2), (3, 5, 4), (0, 3, 4, 1), (1, 4, 5, 2), (0, 2, 5, 3)]:
        bm.faces.new([vs[i] for i in f])
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('roof', me); bpy.context.collection.objects.link(o)
    o.location = loc; o.rotation_euler = (0, 0, rot_z)
    return setmat(o, rgb)

def text3d(s, loc, size, rgb, rot=(math.pi / 2, 0, 0), font='/home/user/work_neko/fonts/NotoSansJP-Bold.otf', extrude=0.0, align='CENTER'):
    cu = bpy.data.curves.new('t', 'FONT'); cu.body = s; cu.size = size; cu.align_x = align; cu.extrude = extrude
    try:
        cu.font = bpy.data.fonts.load(font, check_existing=True)
    except Exception:
        pass
    o = bpy.data.objects.new('txt', cu); bpy.context.collection.objects.link(o)
    o.location = loc; o.rotation_euler = rot
    o.data.materials.append(mat(rgb))
    return o

# ---------- カメラ ----------
def camera(lens=35, dof=None, fstop=4.0):
    cd = bpy.data.cameras.new('cam'); cd.lens = lens; cd.clip_end = 2000; cd.clip_start = 0.05
    c = bpy.data.objects.new('cam', cd); bpy.context.collection.objects.link(c)
    bpy.context.scene.camera = c
    if dof is not None:
        cd.dof.use_dof = True; cd.dof.focus_distance = dof; cd.dof.aperture_fstop = fstop
    return c

def look(cam, pos, target):
    cam.location = Vector(pos)
    d = Vector(target) - Vector(pos)
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()

def ease(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)

def cam_path(cam, keys, nframes, lens_keys=None):
    """keys: [(t0..1, pos, target), ...] をなめらかにつないでフレームごとにキーを打つ"""
    keys = sorted(keys, key=lambda k: k[0])
    for f in range(nframes + 1):
        t = f / max(1, nframes)
        for i in range(len(keys) - 1):
            if keys[i][0] <= t <= keys[i + 1][0]:
                a, b = keys[i], keys[i + 1]
                u = ease((t - a[0]) / max(1e-6, b[0] - a[0]))
                pos = Vector(a[1]).lerp(Vector(b[1]), u); tg = Vector(a[2]).lerp(Vector(b[2]), u)
                break
        else:
            pos, tg = Vector(keys[-1][1]), Vector(keys[-1][2])
        look(cam, pos, tg)
        cam.keyframe_insert('location', frame=f + 1); cam.keyframe_insert('rotation_euler', frame=f + 1)
        if lens_keys:
            for i in range(len(lens_keys) - 1):
                if lens_keys[i][0] <= t <= lens_keys[i + 1][0]:
                    a, b = lens_keys[i], lens_keys[i + 1]
                    u = ease((t - a[0]) / max(1e-6, b[0] - a[0]))
                    cam.data.lens = a[1] + (b[1] - a[1]) * u
                    cam.data.keyframe_insert('lens', frame=f + 1)

# ---------- 猫 ----------
COATS = {
    'tora':  {'base': hexc('#d98b3a'), 'belly': hexc('#f3e2c8'), 'stripe': hexc('#a85a22')},
    'kuro':  {'base': hexc('#2a2a2e'), 'belly': hexc('#3a3a40'), 'stripe': hexc('#1d1d20')},
    'shiro': {'base': hexc('#f2efe8'), 'belly': hexc('#ffffff'), 'stripe': hexc('#e6e1d6')},
    'mike':  {'base': hexc('#f2efe8'), 'belly': hexc('#ffffff'), 'stripe': hexc('#d98b3a'), 'patch2': hexc('#2a2a2e')},
    'saba':  {'base': hexc('#8d8d88'), 'belly': hexc('#e9e5dc'), 'stripe': hexc('#4c4c4a')},
    'hachi': {'base': hexc('#2a2a2e'), 'belly': hexc('#f2efe8'), 'stripe': hexc('#1d1d20')},
}

def cat(loc, coat='tora', s=1.0, rot_z=0.0, pose='sit', name='cat'):
    """座り/伏せの猫。root（床に接地）> head > mouth。鳴くときは head を少し上げ mouth を開く。"""
    C = COATS[coat]
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    parts = []
    if pose == 'sit':
        body = sphere((0, -0.02, 0.16), 0.14, C['base'], scale=(0.95, 1.1, 1.25)); parts.append(body)
        chest = sphere((0, -0.11, 0.17), 0.085, C['belly'], scale=(1, 0.7, 1.3)); parts.append(chest)
        for sx in (-0.06, 0.06):
            parts.append(cyl((sx, -0.12, 0.07), 0.028, 0.15, C['belly'] if coat in ('hachi', 'shiro', 'mike') else C['base']))
            parts.append(sphere((sx, -0.135, 0.008), 0.032, C['belly'], scale=(1, 1.3, 0.55)))
        hy, hz = -0.07, 0.36
        tail = cyl((0.12, 0.08, 0.04), 0.022, 0.26, C['stripe'] if coat == 'tora' else C['base'], rot=(math.pi / 2, 0, -0.6)); parts.append(tail)
    else:  # crouch / lie
        body = sphere((0, 0.02, 0.1), 0.13, C['base'], scale=(0.9, 1.75, 0.75)); parts.append(body)
        for sx in (-0.06, 0.06):
            parts.append(sphere((sx, -0.2, 0.025), 0.03, C['belly'], scale=(1, 1.4, 0.6)))
        hy, hz = -0.22, 0.2
        tail = cyl((0.0, 0.3, 0.04), 0.022, 0.3, C['base'], rot=(math.pi / 2, 0, 0.2)); parts.append(tail)
    for p in parts:
        link(p, root)
    if coat == 'mike':
        link(sphere((0.06, 0.02, 0.24), 0.07, C['stripe'], scale=(1, 1, 0.8)), root)
        link(sphere((-0.07, 0.06, 0.18), 0.06, C['patch2'], scale=(1, 1, 0.8)), root)
    if coat == 'tora':
        for k in range(3):
            st = box((0, 0.0 + k * 0.05, 0.31 if pose == 'sit' else 0.17), (0.2, 0.018, 0.02), C['stripe']); link(st, root)
    head = empty((0, hy, hz), 'head'); link(head, root)
    hd = sphere((0, 0, 0), 0.105, C['base'], scale=(1.1, 0.95, 0.92)); link(hd, head)
    muz = sphere((0, -0.08, -0.03), 0.05, C['belly'], scale=(1.15, 0.8, 0.75)); link(muz, head)
    if coat == 'mike':
        link(sphere((0.05, -0.02, 0.05), 0.06, C['stripe'], scale=(1, 0.9, 0.7)), head)
    for sx in (-1, 1):
        e = cone((sx * 0.062, 0.0, 0.088), 0.042, 0.075, C['base'], rot=(0, sx * 0.25, 0), verts=4); e.rotation_euler = (0.1, sx * 0.3, math.pi / 4); link(e, head)
        eye = sphere((sx * 0.042, -0.09, 0.022), 0.017, hexc('#c9b23a') if coat in ('kuro', 'hachi') else hexc('#5b7a3a'), scale=(1, 0.5, 1.1)); link(eye, head)
        pu = sphere((sx * 0.042, -0.099, 0.022), 0.008, hexc('#111111'), scale=(0.6, 0.4, 1.4)); link(pu, head)
    nose = sphere((0, -0.122, -0.005), 0.011, hexc('#d98a8a'), scale=(1.2, 0.7, 0.8)); link(nose, head)
    mouth = sphere((0, -0.112, -0.05), 0.024, hexc('#7a2c2c'), scale=(1.1, 0.5, 0.15)); mouth.name = 'mouth'; link(mouth, head)
    root['head'] = head.name; root['mouth'] = mouth.name
    return root

def meow(root, frames, dur=14, lift=0.18, turn=None):
    """frames: 鳴き始めフレームの列。head を持ち上げ、mouth を開閉。"""
    head = bpy.data.objects[root['head']]; mouth = bpy.data.objects[root['mouth']]
    base_r = head.rotation_euler.copy(); base_s = mouth.scale.copy()
    head.keyframe_insert('rotation_euler', frame=1); mouth.keyframe_insert('scale', frame=1)
    for f0 in frames:
        for df, a in [(0, 0), (4, 1), (dur - 4, 0.9), (dur, 0)]:
            f = f0 + df
            head.rotation_euler = (base_r.x - lift * a, base_r.y, base_r.z + (turn or 0) * a)
            mouth.scale = (base_s.x * (1 + 0.2 * a), base_s.y, base_s.z * (1 + 5.0 * a))
            head.keyframe_insert('rotation_euler', frame=f); mouth.keyframe_insert('scale', frame=f)

def meow_times(nframes, every=(40, 70), start=(1, 30), rng=None):
    rng = rng or random
    f = rng.randint(*start); out = []
    while f < nframes - 10:
        out.append(f); f += rng.randint(*every)
    return out

def rings(loc, frames, rgb=(1, 1, 1), size=0.35, n=2):
    """鳴き声の輪（細いトーラスが広がって消える）"""
    objs = []
    for k in range(n):
        bpy.ops.mesh.primitive_torus_add(location=loc, major_radius=size, minor_radius=0.006 * size / 0.35 * 2, rotation=(math.pi / 2, 0, 0))
        o = bpy.context.object; setmat(o, rgb); o.scale = (0, 0, 0)
        o.keyframe_insert('scale', frame=1)
        for f0 in frames:
            a = f0 + k * 5
            o.scale = (0.2, 0.2, 0.2); o.keyframe_insert('scale', frame=a)
            o.scale = (1.4, 1.4, 1.4); o.keyframe_insert('scale', frame=a + 16)
            o.scale = (0, 0, 0); o.keyframe_insert('scale', frame=a + 17)
        objs.append(o)
    return objs

# ---------- 人 ----------
SKIN = [hexc('#e9c3a0'), hexc('#d8a982'), hexc('#b98563'), hexc('#8a5a3c')]
def person(loc, shirt, pants=None, skin=None, hair=None, rot_z=0, pose='stand', s=1.0, name='p'):
    """簡略人体。root は足元（接地）。pose: stand / sit / lie"""
    skin = skin or SKIN[0]; pants = pants or hexc('#3b4252'); hair = hair or hexc('#2b2420')
    root = empty(loc, name); root.rotation_euler = (0, 0, rot_z); root.scale = (s, s, s)
    P = []
    if pose == 'stand':
        for sx in (-0.09, 0.09):
            P.append(cyl((sx, 0, 0.42), 0.065, 0.84, pants, verts=12))
            P.append(box((sx, -0.04, 0.03), (0.1, 0.24, 0.06), hexc('#222222')))
        P.append(cyl((0, 0, 1.12), 0.2, 0.6, shirt, verts=16, r2=0.17))
        hz = 1.58
        for sx in (-0.25, 0.25):
            P.append(cyl((sx, 0, 1.13), 0.055, 0.56, shirt, verts=10, rot=(0, sx * 0.12, 0)))
            P.append(sphere((sx * 1.06, 0, 0.82), 0.05, skin, seg=10))
    elif pose == 'sit':
        for sx in (-0.09, 0.09):
            P.append(cyl((sx, -0.22, 0.45), 0.068, 0.42, pants, verts=12, rot=(math.pi / 2, 0, 0)))
            P.append(cyl((sx, -0.43, 0.22), 0.06, 0.44, pants, verts=12))
        P.append(cyl((0, 0, 0.75), 0.2, 0.6, shirt, verts=16, r2=0.17))
        hz = 1.2
        for sx in (-0.24, 0.24):
            P.append(cyl((sx, -0.08, 0.8), 0.055, 0.42, shirt, verts=10, rot=(0.45, 0, 0)))
            P.append(sphere((sx * 0.9, -0.22, 0.6), 0.05, skin, seg=10))
    else:  # lie（仰向け、頭は -y）
        P.append(box((0, 0.35, 0.14), (0.42, 1.2, 0.22), pants))
        P.append(box((0, -0.4, 0.15), (0.44, 0.5, 0.24), shirt))
        hz = None
    for p in P:
        link(p, root)
    head = empty((0, 0, hz) if hz else (0, -0.78, 0.2), 'phead'); link(head, root)
    link(sphere((0, 0, 0), 0.13, skin, scale=(0.9, 1, 1.05)), head)
    link(sphere((0, 0.03, 0.05), 0.135, hair, scale=(0.95, 1.0, 0.85)), head)
    root['head'] = head.name
    return root

# ---------- 建物・街 ----------
WALLS = [hexc(h) for h in ['#efe6d6', '#e6dccb', '#d9d2c5', '#f4efe6', '#cfd6d8', '#e8d9c2', '#d6c7b0', '#f1e4d0']]
ROOFS = [hexc(h) for h in ['#4a5563', '#5b4a42', '#6b3b33', '#39424f', '#7a6a5a', '#44505e']]

def window_strip(o_loc, w, h, z0, floors, facing_y, color=hexc('#9fb6c8')):
    pass

def house(loc, w=8.0, d=7.0, h=6.0, rot_z=0.0, wall=None, roofc=None, floors=2):
    root = empty(loc, 'house'); root.rotation_euler = (0, 0, rot_z)
    wall = wall or random.choice(WALLS); roofc = roofc or random.choice(ROOFS)
    b = box((0, 0, h / 2), (w, d, h), wall); link(b, root)
    r = roof((0, 0, h), w + 0.8, d + 0.6, 2.2, roofc, rot_z=math.pi / 2); link(r, root)
    win = hexc('#8aa3b8')
    for fl in range(floors):
        z = 1.6 + fl * (h / floors)
        for k in range(2):
            x = -w / 4 + k * w / 2
            link(box((x, -d / 2 - 0.03, z), (1.5, 0.08, 1.2), win), root)
            link(box((-d / 2 * 0 + w / 2 + 0.03, x * 0.8, z), (0.08, 1.4, 1.2), win), root)
    link(box((w / 2 - 1.3, -d / 2 - 0.04, 1.05), (1.0, 0.08, 2.1), hexc('#6b4f3a')), root)
    return root

def tower(loc, w, d, h, wall, win=hexc('#7f97ab'), rot_z=0.0, floors=None, lit=None):
    root = empty(loc, 'tower'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, h / 2), (w, d, h), wall), root)
    floors = floors or max(2, int(h / 0.32))
    for fl in range(floors):
        z = 0.2 + fl * (h - 0.3) / floors
        c = win
        if lit is not None and random.random() < lit:
            c = hexc('#ffd98a')
        link(box((0, -d / 2 - 0.004, z), (w * 0.86, 0.012, 0.12), c), root)
        link(box((-w / 2 - 0.004, 0, z), (0.012, d * 0.86, 0.12), c), root)
    return root

def tree(loc, s=1.0, c=None):
    s = s * 4.0
    root = empty(loc, 'tree')
    link(cyl((0, 0, 0.3 * s), 0.05 * s, 0.6 * s, hexc('#6d5440')), root)
    link(sphere((0, 0, 0.8 * s), 0.38 * s, c or random.choice([hexc('#6f8f4e'), hexc('#7d9a55'), hexc('#5f7f45')]), seg=10), root)
    return root

def ground(size=200, rgb=hexc('#cfc4ad')):
    return plane((0, 0, 0), (size, size), rgb, name='ground')

def road(loc, length, width=1.6, rot_z=0.0, rgb=hexc('#8b8680')):
    return plane((loc[0], loc[1], 0.004), (width, length), rgb, rot=(0, 0, rot_z), name='road')

def wall_fence(loc, length, rot_z=0.0, h=1.3, rgb=hexc('#c7bfb0')):
    return box((loc[0], loc[1], h / 2), (length, 0.15, h), rgb, rot=(0, 0, rot_z))

def car(loc, rot_z=0.0, c=None, hood_open=0.0):
    root = empty(loc, 'car'); root.rotation_euler = (0, 0, rot_z); root.scale = (2.0, 2.2, 2.0)
    c = c or random.choice([hexc('#c9c9c9'), hexc('#2f4a6b'), hexc('#8a2e2e'), hexc('#f0f0ec'), hexc('#3a3a3a')])
    link(box((0, 0, 0.32), (0.9, 2.0, 0.36), c, bevel=0.06), root)
    link(box((0, 0.15, 0.62), (0.8, 1.0, 0.3), c, bevel=0.06), root)
    link(box((0, -0.36, 0.63), (0.74, 0.04, 0.24), hexc('#4d5d6b'), rot=(0.5, 0, 0)), root)
    for sx in (-0.42, 0.42):
        for sy in (-0.62, 0.62):
            link(cyl((sx, sy, 0.17), 0.17, 0.12, hexc('#1e1e1e'), rot=(0, math.pi / 2, 0)), root)
    hinge = empty((0, -0.42, 0.5), 'hinge'); link(hinge, root)
    hood = box((0, -0.28, 0.0), (0.88, 0.58, 0.04), c); link(hood, hinge)
    hinge.rotation_euler = (-hood_open, 0, 0)
    root['hinge'] = hinge.name
    return root

def scatter_houses(xr, yr, n, avoid=None, seed=3):
    rnd = random.Random(seed); out = []
    for i in range(n):
        x = rnd.uniform(*xr); y = rnd.uniform(*yr)
        if avoid and avoid(x, y):
            continue
        out.append(house((x, y, 0), w=rnd.uniform(1.3, 1.9), d=rnd.uniform(1.2, 1.6), h=rnd.uniform(1.0, 1.5), rot_z=rnd.choice([0, math.pi / 2, math.pi])))
    return out

def town_grid(cx=0, cy=0, nx=6, ny=6, pitch=14.0, seed=5, skip=None, lot=hexc('#c9c3b2'), green=hexc('#9caf7e')):
    """住宅街：区画（塀と庭）＋家＋道路。pitch は区画の間隔（m）"""
    rnd = random.Random(seed)
    for i in range(nx):
        for j in range(ny):
            x = cx + (i - (nx - 1) / 2) * pitch; y = cy + (j - (ny - 1) / 2) * pitch
            if skip and skip(x, y):
                continue
            plane((x, y, 0.01), (pitch - 4.2, pitch - 4.2), lot)
            plane((x + 2.5, y + 2.6, 0.02), (4.0, 3.2), green)
            house((x - 0.8, y - 0.6, 0), w=rnd.uniform(7, 9), d=rnd.uniform(6, 7.5), h=rnd.uniform(5.5, 6.5), rot_z=rnd.choice([0, math.pi]))
            if rnd.random() < 0.5:
                tree((x + 3.5, y + 3.5, 0), s=rnd.uniform(0.8, 1.2))
            wall_fence((x, y - (pitch - 4.2) / 2, 0), pitch - 4.2, h=1.1)
    for i in range(nx + 1):
        plane((cx + (i - nx / 2) * pitch, cy, 0.005), (4.2, ny * pitch + 30), hexc('#9a958d'))
    for j in range(ny + 1):
        plane((cx, cy + (j - ny / 2) * pitch, 0.006), (nx * pitch + 30, 4.2), hexc('#9a958d'))

# ---------- 室内 ----------
def room(w=6, d=5, h=2.6, floor=hexc('#b48a63'), wall=hexc('#efe8dc'), window=True, night=False):
    root = empty((0, 0, 0), 'room')
    link(box((0, 0, -0.05), (w, d, 0.1), floor), root)
    link(box((0, d / 2, h / 2), (w, 0.1, h), wall), root)
    link(box((-w / 2, 0, h / 2), (0.1, d, h), wall), root)
    if window:
        glass = hexc('#1d2a44') if night else hexc('#bcd3e6')
        link(box((0.6, d / 2 - 0.06, 1.45), (1.8, 0.04, 1.2), glass), root)
        link(box((0.6, d / 2 - 0.08, 1.45), (1.9, 0.02, 0.05), hexc('#f7f3ea')), root)
    return root

def sofa(loc, rot_z=0, c=hexc('#7b8a9a')):
    root = empty(loc, 'sofa'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0.22), (2.0, 0.85, 0.44), c, bevel=0.05), root)
    link(box((0, 0.35, 0.6), (2.0, 0.22, 0.6), c, bevel=0.05), root)
    for sx in (-0.95, 0.95):
        link(box((sx, 0, 0.42), (0.18, 0.85, 0.42), c, bevel=0.05), root)
    return root

def table(loc, w=1.2, d=0.7, h=0.72, c=hexc('#a77d55'), rot_z=0):
    root = empty(loc, 'table'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, h), (w, d, 0.05), c), root)
    for sx in (-w / 2 + 0.06, w / 2 - 0.06):
        for sy in (-d / 2 + 0.06, d / 2 - 0.06):
            link(box((sx, sy, h / 2), (0.05, 0.05, h), c), root)
    return root

def bed(loc, rot_z=0, c=hexc('#e9e4da'), quilt=hexc('#8fa3b8')):
    root = empty(loc, 'bed'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0.18), (1.2, 2.1, 0.36), hexc('#8c6a4c')), root)
    link(box((0, 0, 0.42), (1.12, 2.0, 0.14), c), root)
    link(box((0, 0.25, 0.52), (1.16, 1.4, 0.1), quilt, bevel=0.03), root)
    link(box((0, -0.78, 0.55), (0.6, 0.3, 0.14), hexc('#f5f2ec'), bevel=0.04), root)
    return root

def laptop(loc, rot_z=0, screen=hexc('#9cc3e0')):
    root = empty(loc, 'laptop'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0.01), (0.36, 0.25, 0.02), hexc('#b9bcc0')), root)
    link(box((0, 0.13, 0.13), (0.36, 0.02, 0.24), hexc('#b9bcc0'), rot=(-0.25, 0, 0)), root)
    link(box((0, 0.118, 0.13), (0.32, 0.005, 0.2), screen, rot=(-0.25, 0, 0)), root)
    return root

def bowl(loc, c=hexc('#d9534f')):
    return cyl(loc, 0.09, 0.05, c, r2=0.11)

def carrier(loc, rot_z=0, c=None):
    c = c or random.choice([hexc('#d4c4a8'), hexc('#9fb3c8'), hexc('#c89f9f'), hexc('#a8c4a0')])
    root = empty(loc, 'carrier'); root.rotation_euler = (0, 0, rot_z)
    link(box((0, 0, 0.2), (0.4, 0.55, 0.38), c, bevel=0.05), root)
    link(box((0, -0.28, 0.2), (0.3, 0.02, 0.26), hexc('#3a3a3a')), root)
    link(box((0, 0, 0.42), (0.22, 0.05, 0.06), hexc('#555555')), root)
    return root

# ---------- 地球 ----------
def globe(loc=(0, 0, 0), r=1.0, tex='/home/user/work_neko/assets/earth.png', name='globe'):
    bpy.ops.mesh.primitive_uv_sphere_add(location=loc, radius=r, segments=96, ring_count=48)
    o = bpy.context.object; o.name = name; bpy.ops.object.shade_smooth()
    m = bpy.data.materials.new('earth'); m.use_nodes = True
    nt = m.node_tree; bsdf = nt.nodes.get('Principled BSDF')
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(tex)
    nt.links.new(t.outputs['Color'], bsdf.inputs['Base Color'])
    o.data.materials.append(m)
    return o

def render_frames(outdir, f0, f1, threads=None):
    s = bpy.context.scene
    s.frame_start, s.frame_end = f0, f1
    s.render.image_settings.file_format = 'PNG'
    s.render.filepath = outdir.rstrip('/') + '/'
    bpy.ops.render.render(animation=True)
