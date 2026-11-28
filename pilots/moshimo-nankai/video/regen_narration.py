"""台本の一部の章だけナレーションを作り直す（ほかの章の音声はそのまま使う）。
使い方: NEKO_VER=v5 python regen_narration.py <out_dir> <章番号> [<章番号> ...]
narration.py（猫回の仕組み）の parse / tts を使い、timeline.json と narration.wav を作り直す。
変えない章は、前の timeline.json の同じ文の wav を使う（文が変わっていればその文だけ作り直す）。"""
import json, os, sys, wave
from pathlib import Path
import numpy as np
HERE = Path(__file__).resolve().parent
os.environ.setdefault('NEKO_VER', 'v5')
os.environ['NEKO_SCRIPT'] = str(HERE.parent / '03_script.md')
sys.path.insert(0, '/home/user/TUBEX/pilots/moshimo-neko-meow/video')
import narration as N

OUT = Path(sys.argv[1]); REGEN = {int(x) for x in sys.argv[2:]}
N.OUT = OUT
old = json.load(open(OUT / 'timeline.json'))
oldwav = {}
for c in old['chapters']:
    for l in c['lines']:
        oldwav[(c['no'], l['text'])] = l['wav']


def dur(p):
    with wave.open(str(p)) as f:
        return f.getnframes() / N.SR


chs = N.parse()
t = 0.0
tl = {'sr': N.SR, 'chapters': []}
made = 0
for c in chs:
    start = t
    t += N.LEAD.get(c['no'], N.LEAD_DEFAULT)
    lines = []; pend = 0.0
    for i, s in enumerate(c['lines']):
        if s == '':
            pend = N.GAP_PARA; continue
        t += pend
        key = (c['no'], s)
        if c['no'] not in REGEN and key in oldwav and Path(oldwav[key]).exists():
            w = Path(oldwav[key]); d = dur(w)
        else:
            w = OUT / 'nar' / f"{c['no']:02d}_{i:02d}_r.wav"
            d = N.tts(s, w); made += 1
        lines.append({'text': s, 'start': round(t, 3), 'end': round(t + d, 3), 'wav': str(w)})
        t += d; pend = N.GAP_LINE
    t += N.TAIL_DEFAULT + c.get('pause', 0.0)
    label = c['label'] if 'label' in c else ''
    tl['chapters'].append({'no': c['no'], 'title': c['title'], 'label': label, 'start': round(start, 3), 'end': round(t, 3), 'lines': lines})
tl['duration'] = round(t + 4.0, 3)
n = int(tl['duration'] * N.SR) + N.SR
mix = np.zeros(n, np.float32)
for c in tl['chapters']:
    for l in c['lines']:
        with wave.open(l['wav']) as f:
            a = np.frombuffer(f.readframes(f.getnframes()), '<i2').astype(np.float32) / 32768
        s0 = int(l['start'] * N.SR); mix[s0:s0 + len(a)] += a
mix = mix / (np.abs(mix).max() or 1) * 0.89
os.replace(OUT / 'timeline.json', OUT / 'timeline_before_regen.json')
with wave.open(str(OUT / 'narration.wav'), 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(N.SR); f.writeframes((mix * 32767).astype('<i2').tobytes())
(OUT / 'timeline.json').write_text(json.dumps(tl, ensure_ascii=False, indent=1))
print('made', made, 'duration', tl['duration'])
for c in tl['chapters']:
    print(f"{c['no']:02d} {c['start']:7.1f}-{c['end']:7.1f} {c['end'] - c['start']:5.1f}s {len(c['lines'])} {c['title']}")
