"""冒頭1分（SCENE 01）のシネマ調版を描く。使い方: python render_cine.py <shot> [--test]
本編 v5 のカット（shots_v5.py）をそのまま組み、look.py で材質・光を EEVEE 用に置き換える。
出力: /home/user/work_neko/out_cine/frames/<shot>/ （640×360、合成で 1920×1080 に拡大）"""
import sys, os, json, time
HERE = os.path.dirname(os.path.abspath(__file__))
os.environ['NEKO_VER'] = 'v5'; os.environ['NEKO_OUT'] = '/home/user/work_neko/out_cine'
sys.path.insert(0, os.path.join(HERE, '..', 'moshimo-neko-meow', 'video'))
sys.path.insert(0, HERE)
import kit
from kit import *
import render_shot as RS
import shots_v5 as S
import look as L

RES = (640, 360); SAMPLES = 8
INDOOR = {'v00c', 'v00d', 'nDogBark', 'nNoCatRoom'}
NIGHT = {'v00d'}


def light(name):
    if name in INDOOR:
        L.sky_gradient(0.8, night=name in NIGHT)
        L.sun((0.3, -0.6, 0.35) if name not in NIGHT else (0.2, -0.5, 0.6), 2.0 if name not in NIGHT else 0.15, (1.0, 0.6, 0.38))
        L.lamp((0.5, 0.5, 2.2), 120 if name not in NIGHT else 25, (1.0, 0.72, 0.45), r=0.5)
    else:
        L.sky_gradient(1.2)
        L.sun((-0.35, -0.9, 0.16), 3.0)
        import random
        rnd = random.Random(3)
        for i in range(8):
            L.lamp((rnd.uniform(-30, 30), rnd.uniform(-40, 30), 3.2), 150)


def main():
    name = sys.argv[1]; test = '--test' in sys.argv
    row = [r for r in RS.shot_table() if r['shot'] == name][0]
    n = row['n']
    reset(RES)
    getattr(S, name)(n)
    animate_life(n, seed=sum(map(ord, name)))
    L.cat_details()
    L.to_eevee(RES, SAMPLES)
    light(name)
    s = bpy.context.scene
    if test:
        s.frame_set(n // 2); s.render.filepath = f'{os.environ["NEKO_OUT"]}/test/{name}.png'
        t = time.time(); bpy.ops.render.render(write_still=True); print('TEST', name, round(time.time() - t, 1))
    else:
        render_frames(f'{os.environ["NEKO_OUT"]}/frames/{name}', 1, n)
        print('DONE', name, n)


if __name__ == '__main__':
    main()
