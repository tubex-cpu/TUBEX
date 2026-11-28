"""1カットを描画する。使い方: python render_shot.py <shot_name> [--test] [--res W H]
出力: OUT/frames/<shot>/0001.png...（ghost があれば OUT/frames/<shot>_ghost/）と OUT/meta/<shot>.json"""
import sys, json, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('NEKO_OUT', '/home/user/work_neko/out')
import kit
from kit import *
if os.environ.get('NEKO_SHOTS'):  # 別企画のカット表（NEKO_PROJECT_DIR にあるモジュール名）
    import importlib
    sys.path.insert(0, os.environ['NEKO_PROJECT_DIR'])
    S = importlib.import_module(os.environ['NEKO_SHOTS'])
elif os.environ.get('NEKO_VER') == 'v5':
    import shots_v5 as S  # 改稿（2026-11-21）のカット表
else:
    import shots as S

def shot_table():
    tl = json.load(open(f'{OUT}/timeline.json'))
    rows = []
    for ch in tl['chapters']:
        for li, fn in S.SHOTS[ch['no']]:
            st = ch['start'] if li < 0 else ch['lines'][li]['start'] - 0.35
            rows.append([fn.__name__, ch['no'], st])
    for i, r in enumerate(rows):
        end = rows[i + 1][2] if i + 1 < len(rows) else tl['duration']
        r.append(end)
    out = []
    for name, ch, st, en in rows:
        f0 = round(st * FPS); f1 = round(en * FPS)
        out.append({'shot': name, 'chapter': ch, 'start': st, 'end': en, 'f0': f0, 'n': f1 - f0})
    return out

def main():
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    name = args[0]; test = '--test' in args
    res = (1280, 720)
    if '--res' in args:
        i = args.index('--res'); res = (int(args[i + 1]), int(args[i + 2]))
    row = [r for r in shot_table() if r['shot'] == name][0]
    n = row['n']
    reset(res)
    meta = getattr(S, name)(n)
    if '--still' not in args:
        animate_life(n, seed=sum(map(ord, name)))
    meta.update(row)
    os.makedirs(f'{OUT}/meta', exist_ok=True)
    json.dump(meta, open(f'{OUT}/meta/{name}.json', 'w'), ensure_ascii=False)
    s = bpy.context.scene
    ghosts = [o for o in bpy.data.objects if o.get('ghost')]
    for o in ghosts:
        o.hide_render = True
    t = time.time()
    if test:
        for k, f in enumerate([1, n // 2, n]):
            s.frame_set(f); s.render.filepath = f'{OUT}/test/{name}_{k}.png'
            bpy.ops.render.render(write_still=True)
        if ghosts:
            for o in bpy.data.objects:
                o.hide_render = not o.get('ghost')
            s.render.film_transparent = True
            s.frame_set(n // 2); s.render.filepath = f'{OUT}/test/{name}_g.png'
            bpy.ops.render.render(write_still=True)
    else:
        render_frames(f'{OUT}/frames/{name}', 1, n)
        if ghosts:
            for o in bpy.data.objects:
                if o.type in ('MESH', 'FONT'):
                    o.hide_render = not o.get('ghost')
            s.render.film_transparent = True
            render_frames(f'{OUT}/frames/{name}_ghost', 1, n)
    print('DONE', name, n, 'frames', round(time.time() - t, 1), 's')

if __name__ == '__main__':
    main()
