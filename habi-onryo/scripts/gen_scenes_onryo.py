"""富雄丸山古墳判決：冒頭〜まだ解けていない謎の場面ファイル（src/scenes/*.tsx）を作る。
  python3 scripts/gen_scenes_onryo.py
ビート： (from, to, 種類, ...)  to=None はその場面の最後まで
  ('p', 写真ID, テロップ, 動き)            写真
  ('a', 'JSXの図解', テロップ, 下に置くか)  図解（全画面）
  ('v', 'right'|'half'|'wrong')          判決（from は「この手がかりの判決。」の行）
同じ写真・同じ図解を2回使うと止まる。手書きの場面（判事登場・まとめ）で使った写真も重複チェックに含める。"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODS = {m: set(re.findall(r'^export const (\w+)', (ROOT / f'src/components/{m}.tsx').read_text(), re.M)) for m in ('OnryoArt', 'IzumoKit', 'IzumoMap')}

from onryo_spec import S

INTRO_PHOTOS = set()
for f in ('JudgeEntrance', 'Summary'):
    INTRO_PHOTOS |= set(re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{f}.tsx').read_text()))
known = set(re.findall(r"^\t'([\w-]+)':", (ROOT / 'src/data/photos.ts').read_text(), re.M))
caps = (ROOT / 'src/data/captions.ts').read_text()


def ncaps(var):
    a = caps.index(f'export const {var}')
    return caps[a:caps.index('];', a)].count('"startMs"')


used_p, used_a, errors = list(INTRO_PHOTOS), [], []
for scene, (label, title, beats) in S.items():
    var = scene[0].lower() + scene[1:] + 'Captions'
    n = ncaps(var)
    imps = {m: set() for m in MODS}
    body = []
    has_v = False
    for b in beats:
        fr, to, kind = b[0], b[1], b[2]
        if fr >= n or (to is not None and to >= n):
            errors.append(f'{scene}: 字幕番号が範囲外 {fr}-{to}（{n}文）')
        if kind == 'v':
            has_v = True
            body.append(f'\t\t\t<Beat name="判決" captions={{c}} from={{{fr}}} to={{{fr + 2}}}>\n\t\t\t\t<GavelVerdict verdict="{'correct' if b[3] == 'right' else b[3]}" strikeAt={{captionFrame(c, {fr}, {fr + 1}, fps)}} />\n\t\t\t</Beat>')
            continue
        rng = f'from={{{fr}}}' + (f' to={{{to}}}' if to is not None else '')
        if kind == 'p':
            pid, lab, mv = b[3], b[4], b[5]
            if pid not in known:
                errors.append(f'{scene}: 写真がない {pid}')
            if pid in used_p:
                errors.append(f'{scene}: 写真の重複 {pid}')
            used_p.append(pid)
            body.append(f'\t\t\t<Beat name="{lab}" captions={{c}} {rng}>\n\t\t\t\t<Photo id="{pid}" move="{mv}" label="{lab}" />\n\t\t\t</Beat>')
        else:
            jsx, lab, bottom = b[3], b[4], b[5]
            if jsx in used_a:
                errors.append(f'{scene}: 図解の重複 {jsx[:40]}')
            used_a.append(jsx)
            comp = re.match(r'<(\w+)', jsx).group(1)
            mod = next((m for m, ex in MODS.items() if comp in ex), None)
            if mod is None:
                errors.append(f'不明な図解 {comp}')
            else:
                imps[mod].add(comp)
            if re.search(r'\bP\.', jsx):
                imps['IzumoMap'].add('P')
            body.append(f'\t\t\t<Beat name="{lab}" captions={{c}} {rng}>\n\t\t\t\t<Stage label="{lab}"{" labelBottom" if bottom else ""}>\n\t\t\t\t\t{jsx}\n\t\t\t\t</Stage>\n\t\t\t</Beat>')
    imports = []
    if has_v:
        imports.append("import {useVideoConfig} from 'remotion';")
        imports.append("import {Beat, captionFrame} from '../components/Beat';")
    else:
        imports.append("import {Beat} from '../components/Beat';")
    if any(b[2] == 'a' for b in beats):
        imports.append("import {Stage} from '../components/Cinema';")
    for m in sorted(imps):
        if imps[m]:
            imports.append(f"import {{{', '.join(sorted(imps[m]))}}} from '../components/{m}';")
    if has_v:
        imports.append("import {GavelVerdict} from '../components/GavelVerdict';")
    imports.append("import {Photo} from '../components/Photo';")
    imports.append("import {SceneFrame} from '../components/SceneFrame';")
    imports.append(f"import {{{var} as c}} from '../data/captions';")
    head = f'label="{label}" title="{title}"' if label else ''
    fps = '\tconst {fps} = useVideoConfig();\n' if has_v else ''
    src = '\n'.join(imports) + f"\n\n// {title or scene}（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）\nexport const {scene} = () => {{\n{fps}\treturn (\n\t\t<SceneFrame captions={{c}} voice=\"{scene}\" {head}>\n" + '\n'.join(body) + '\n\t\t</SceneFrame>\n\t);\n};\n'
    (ROOT / f'src/scenes/{scene}.tsx').write_text(src)

if errors:
    print('\n'.join(errors))
    sys.exit(1)
unused = sorted(known - set(used_p))
print('写真', len(set(used_p)), '／未使用', len(unused), ' '.join(unused))
print('図解', len(used_a))
