"""参考画像の雰囲気に寄せた1コマの試作：夕暮れの路地を埋める猫の群れ、手前で鳴く茶トラ、灯った街灯、濡れた路面"""
import sys, os, time, math, random
HERE = os.path.dirname(os.path.abspath(__file__))
os.environ['NEKO_VER'] = 'v5'; os.environ['NEKO_OUT'] = '/home/user/work_neko/out_cine'
sys.path.insert(0, os.path.join(HERE, '..', 'moshimo-neko-meow', 'video')); sys.path.insert(0, HERE)
from kit import *
import shots_v5 as S
import look as L
res = (int(sys.argv[1]), int(sys.argv[2])); spp = int(sys.argv[3]); out = sys.argv[4]
reset(res)
S.street_env(corner=False)
rnd = random.Random(5)
coats = ['tora', 'tora', 'mike', 'shiro', 'saba', 'kuro', 'hachi']
for i in range(90):
    y = -11.5 + (i // 6) * 0.75 + rnd.uniform(-0.2, 0.2); x = rnd.uniform(-1.3, 1.3)
    c = cat((x, y, 0), rnd.choice(coats), s=0.62, rot_z=rnd.uniform(-0.35, 0.35))
    meow(c, [1], dur=30, lift=0.35)
front = cat((0.55, -13.2, 0), 'tora', s=0.62, rot_z=0.25, name='front'); meow(front, [1], dur=30, lift=0.45)
# 街灯（灯る玉）
for y in (-12, -6, 0, 6, 12):
    for x in (-2.0, 2.0):
        cyl((x, y, 1.4), 0.05, 2.8, hexc('#2a2a2a'))
        sphere((x * 0.9, y, 2.85), 0.16, hexc('#ffd070'))
        L.lamp((x * 0.9, y, 2.6), 90, (1.0, 0.7, 0.4), r=0.15)
# 紫陽花
for y in (-12.5, -9, -5, -1):
    for k in range(5):
        sphere((2.0 + rnd.uniform(-0.15, 0.15), y + rnd.uniform(-0.4, 0.4), 1.4 + rnd.uniform(0, 0.3)), 0.16, rnd.choice([hexc('#6a7ad8'), hexc('#8a6ad0'), hexc('#5a8ae0')]))
L.cat_details()
L.to_eevee(res, spp)
for m in bpy.data.materials:   # 壁を落ち着いた色に（明暗差を出す）
    if m.node_tree and 'Principled BSDF' in m.node_tree.nodes and m.name not in ('wet', 'sky', 'iris'):
        b = m.node_tree.nodes['Principled BSDF']
        if b.inputs['Emission Strength'].default_value == 0:
            c = b.inputs['Base Color'].default_value
            if c[0] > 0.45 and c[1] > 0.4 and c[2] > 0.35 and abs(c[0] - c[2]) < 0.2:
                b.inputs['Base Color'].default_value = (c[0] * 0.45, c[1] * 0.45, c[2] * 0.5, 1)
L.sky_gradient(0.55)
L.sun((0.05, -1.0, 0.1), 4.0, (1.0, 0.55, 0.32))
cam = camera(28, dof=1.1, fstop=1.6)
look(cam, (0.95, -14.1, 0.32), (0.0, -6.0, 0.9))
s = bpy.context.scene; s.frame_set(8); s.render.filepath = out
t = time.time(); bpy.ops.render.render(write_still=True); print('TIME', round(time.time() - t, 1))
