"""音声はそのままで、画面下の字幕（1行ずつ）だけを作り直す。
字幕の1行の文字数（build-voice.py の LINE_MAX）を変えたときに使う。VOICEVOX（読み上げの長さの予測）が必要。
  python3 scripts/resplit-subs.py"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / 'scripts/build-voice.py').read_text(encoding='utf-8')
exec(src[:src.index('\nscenes = []')])  # 設定・split_line・predicted_length だけを読み込む

caps_ts = (ROOT / 'src/data/captions.ts').read_text(encoding='utf-8')
blocks = re.findall(r'export const (\w+)Captions: Caption\[\] = (\[.*?\]);\n', caps_ts, re.S)
tl = (ROOT / 'src/data/timeline.ts').read_text(encoding='utf-8')
durations = dict(re.findall(r'\t(\w+): (\d+),', tl))
trans = int(re.search(r'TRANSITION_FRAMES = (\d+)', tl).group(1))

def fmt(ms):
    ms = int(ms)
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'

ts_subs = '// scripts/build-voice.py で自動生成。画面下の字幕（1行ずつ）\nimport type {Caption} from \'@remotion/captions\';\n\nexport const subtitles: Record<string, Caption[]> = {\n'
srt, srt_i, offset_ms = [], 1, 0.0
for name, arr in blocks:
    sid = name[0].upper() + name[1:]
    subs = []
    for c in json.loads(arr):
        parts = split_line(c['text'])
        weights = [predicted_length(p) for p in parts]
        t0 = c['startMs']
        for part, wgt in zip(parts, weights):
            t1 = t0 + (c['endMs'] - c['startMs']) * wgt / sum(weights)
            subs.append({'text': part, 'startMs': round(t0), 'endMs': round(t1), 'timestampMs': None, 'confidence': None})
            t0 = t1
    ts_subs += f"\t{sid}: {json.dumps(subs, ensure_ascii=False)},\n"
    for c in subs:
        srt.append(f"{srt_i}\n{fmt(offset_ms + c['startMs'])} --> {fmt(offset_ms + c['endMs'])}\n{c['text']}\n")
        srt_i += 1
    offset_ms += (int(durations[sid]) - trans) / FPS * 1000
    print(sid, len(subs))
(ROOT / 'src/data/subtitles.ts').write_text(ts_subs + '};\n', encoding='utf-8')
(ROOT / 'public/narration.srt').write_text('\n'.join(srt), encoding='utf-8')
