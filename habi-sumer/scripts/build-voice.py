"""台本から VOICEVOX（玄野武宏）でナレーション音声を作り、字幕・尺・口パクのデータを書き出す。

  docker run -d --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest
  python3 scripts/build-voice.py

出力
  public/voice/<シーン>.mp3   シーンごとのナレーション（字幕と同じタイミング）
  src/data/captions.ts        シーン別の字幕（Caption型）
  src/data/timeline.ts        シーンの長さ（フレーム）
  src/data/mouth.ts           口パク用（1フレーム1文字、1=口が開く）
  public/narration.srt        本編タイムラインの字幕
"""
import hashlib, json, re, subprocess, urllib.parse, urllib.request, wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
ENGINE = 'http://localhost:50021'
SPEAKER = 11  # 玄野武宏（ノーマル）
SPEED = 1.08
RATE = 48000
FPS = 30
TRANSITION = 20
HEAD_MS = 500
GAP_MS = 380
TAIL_MS = 1200

IDS = ['Intro', 'JudgeEntrance', 'Clue1Rock', 'Clue2Words', 'Clue3Chrysanthemum',
       'Clue4AI', 'Clue5DNA', 'RootsStory', 'UnsolvedMystery', 'Summary', 'Closing']

# 読み上げ用の置き換え（字幕はそのまま）
READING = [('○', ''), ('△', ''), ('×', ''), ('彦島', 'ひこしま'), ('YAP', 'ヤップ'), ('日本', 'ニホン')]

CACHE = ROOT / 'scripts/.voice-cache'
CACHE.mkdir(exist_ok=True)


def synth(text: str) -> np.ndarray:
    spoken = text
    for a, b in READING:
        spoken = spoken.replace(a, b)
    key = hashlib.sha1(f'{SPEAKER}:{SPEED}:{spoken}'.encode()).hexdigest()
    path = CACHE / f'{key}.wav'
    if not path.exists():
        q = urllib.request.Request(f'{ENGINE}/audio_query?' + urllib.parse.urlencode({'text': spoken, 'speaker': SPEAKER}), method='POST')
        query = json.load(urllib.request.urlopen(q))
        query.update(speedScale=SPEED, outputSamplingRate=RATE, prePhonemeLength=0.05, postPhonemeLength=0.1)
        s = urllib.request.Request(f'{ENGINE}/synthesis?speaker={SPEAKER}', data=json.dumps(query).encode(), headers={'Content-Type': 'application/json'})
        path.write_bytes(urllib.request.urlopen(s).read())
    with wave.open(str(path)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768


scenes = []
for line in (ROOT / 'scripts/script.txt').read_text(encoding='utf-8').splitlines():
    line = line.strip()
    m = re.match(r'^(\d+:\d\d)\s+(.+)$', line)
    if m:
        scenes.append({'time': m.group(1), 'title': m.group(2), 'lines': []})
    elif scenes and line:
        scenes[-1]['lines'].append(line)
assert len(scenes) == len(IDS)

(ROOT / 'public/voice').mkdir(parents=True, exist_ok=True)
ts_caps = "// scripts/build-voice.py で自動生成。手で編集しないこと。\nimport type {Caption} from '@remotion/captions';\n\n"
ts_mouth = '// scripts/build-voice.py で自動生成。1フレーム1文字、1=口が開く\n'
durations = {}
srt, srt_i, offset_ms = [], 1, 0.0


def fmt(ms):
    ms = int(ms)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'


for sid, sc in zip(IDS, scenes):
    t = HEAD_MS
    caps, chunks = [], []
    for text in sc['lines']:
        audio = synth(text)
        dur = len(audio) / RATE * 1000
        caps.append({'text': text, 'startMs': round(t), 'endMs': round(t + dur), 'timestampMs': None, 'confidence': None})
        chunks.append((t, audio))
        t += dur + GAP_MS
    total_ms = t - GAP_MS + TAIL_MS
    frames = int(np.ceil(total_ms / 1000 * FPS))
    durations[sid] = frames
    buf = np.zeros(int(frames / FPS * RATE), dtype=np.float32)
    for start, audio in chunks:
        i = int(start / 1000 * RATE)
        buf[i:i + len(audio)] += audio[: len(buf) - i]
    wav = ROOT / f'public/voice/{sid}.wav'
    with wave.open(str(wav), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-b:a', '128k', str(wav.with_suffix('.mp3'))], check=True)
    wav.unlink()
    # 口パク：フレームごとの音量で開閉
    spf = RATE // FPS
    rms = np.array([np.sqrt(np.mean(buf[k * spf:(k + 1) * spf] ** 2) + 1e-12) for k in range(frames)])
    mouth = ''.join('1' if (r > 0.04 and k % 6 < 4) else '0' for k, r in enumerate(rms))
    name = sid[0].lower() + sid[1:]
    ts_caps += f"// {sc['time']} {sc['title']}（{frames}フレーム）\nexport const {name}Captions: Caption[] = {json.dumps(caps, ensure_ascii=False, indent=2)};\n\n"
    ts_mouth += f"export const {name}Mouth = '{mouth}';\n"
    for c in caps:
        srt.append(f"{srt_i}\n{fmt(offset_ms + c['startMs'])} --> {fmt(offset_ms + c['endMs'])}\n{c['text']}\n")
        srt_i += 1
    offset_ms += (frames - TRANSITION) / FPS * 1000
    print(sid, frames, f'{frames / FPS:.1f}s')

total = sum(durations.values()) - TRANSITION * (len(IDS) - 1)
(ROOT / 'src/data/captions.ts').write_text(ts_caps, encoding='utf-8')
(ROOT / 'src/data/mouth.ts').write_text(ts_mouth, encoding='utf-8')
(ROOT / 'public/narration.srt').write_text('\n'.join(srt), encoding='utf-8')
tl = '// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）\n'
tl += f'export const TRANSITION_FRAMES = {TRANSITION};\n\nexport const sceneDurations = {{\n'
tl += ''.join(f'\t{k}: {v},\n' for k, v in durations.items())
tl += f'}} as const;\n\nexport const TOTAL_FRAMES = {total};\n'
(ROOT / 'src/data/timeline.ts').write_text(tl, encoding='utf-8')
print('TOTAL', total, f'{total / FPS / 60:.1f}min')
