"""台本から VOICEVOX（玄野武宏）でナレーション音声を作り、字幕・尺・口パクのデータを書き出す。

  docker run -d --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest
  python3 scripts/build-voice.py

出力
  public/voice/<シーン>.mp3   シーンごとのナレーション（字幕と同じタイミング）
  src/data/captions.ts        シーン別の文（Caption型、ビジュアル切り替えの基準）
  src/data/subtitles.ts       画面下の字幕（1行に収まる長さに分割したもの）
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
SPEED = 0.97
RATE = 48000
FPS = 30
TRANSITION = 20
HEAD_MS = 500
GAP_MS = 480
TAIL_MS = 1200

IDS = ['Intro', 'JudgeEntrance', 'Clue1Size', 'Clue2Build', 'Clue3Craft', 'Clue4Haniwa', 'Clue5Baicho', 'Clue6Nintoku', 'Clue7Juryo', 'Clue8Kings', 'Clue9Name',
       'Clue10Inside', 'Clue11Boston', 'Clue12Treasure', 'Clue13Entry', 'Clue14Lost', 'Clue15Heritage', 'Clue16Now', 'RootsStory', 'UnsolvedMystery', 'Summary', 'Closing']

# 読み上げ用の置き換え（字幕はそのまま）
READING = [('○', ''), ('△', ''), ('×', ''), ('日本', 'ニホン'),
           ('百舌鳥耳原中陵', 'モズノミミハラノナカノミササギ'), ('百舌鳥耳原', 'モズノミミハラ'),
           ('秦の', 'しんの'), ('難波の高津宮', 'ナニワノタカツノミヤ'),
           ('宋書', 'そうじょ'), ('讃、珍、済、興、武', 'さん、ちん、せい、こう、ぶ'),
           ('石室', 'せきしつ'), ('金銅', 'こんどう'), ('甲と冑', 'よろいとかぶと'), ('甲は', 'よろいは'),
           ('石棺并石郭図', 'せっかんならびにせっかくず'), ('三環鈴', 'サンカンレイ'), ('赤色立体図', 'せきしょく立体図'),
           ('宮内省', 'くないしょう'), ('三重の濠', 'さんじゅうのほり'), ('伝・', 'でん、'), ('主', 'あるじ'), ('石棺', 'せっかん'), ('棺', 'ひつぎ'),
           ('日葉酢媛命', 'ヒバスヒメノミコト'), ('土師ニサンザイ', 'ハゼニサンザイ'), ('特殊器台', 'トクシュキダイ'), ('塚廻', 'ツカマワリ'), ('管玉', 'くだたま'),
           ('八町', 'はっちょう'), ('1町', 'いっちょう'), ('元治元年', 'げんじがんねん'), ('寿陵', 'じゅりょう'), ('河内の石津原', 'かわちのいしづはら'),
           ('王、済は', '王、せいは'), ('王、興は', '王、こうは'), ('王、武。', '王、ぶ。'), ('武は、', 'ぶは、'), ('倭国王', 'わこくおう'),
           ('仁徳帝御陵出ル所', 'にんとくていごりょういずるところ'), ('仁徳天皇大仙陵石郭之中ヨリ出シ甲冑之図', 'にんとくてんのうだいせんりょう、せっかくのなかよりいだしかっちゅうのず'),
           ('五社神古墳', 'ごさしこふん'), ('吾呂茂塚', 'ゴロモヅカ')]

# 字幕1行の最大文字数（字幕の幅と文字サイズに合わせる）
LINE_MAX = 25

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


def spoken_text(text: str) -> str:
    for a, b in READING:
        text = text.replace(a, b)
    return text


def predicted_length(text: str) -> float:
    """VOICEVOXが読むときの長さ（秒）の予測。分割した字幕の表示時間の配分に使う。"""
    if not re.search(r'[^\s、。「」…・！？]', text):
        return 0.05
    key = hashlib.sha1(f'len:{SPEAKER}:{text}'.encode()).hexdigest()
    path = CACHE / f'{key}.txt'
    if not path.exists():
        q = urllib.request.Request(f'{ENGINE}/audio_query?' + urllib.parse.urlencode({'text': spoken_text(text), 'speaker': SPEAKER}), method='POST')
        query = json.load(urllib.request.urlopen(q))
        sec = 0.0
        for ap in query['accent_phrases']:
            for m in ap['moras']:
                sec += (m['consonant_length'] or 0) + m['vowel_length']
            if ap['pause_mora']:
                sec += ap['pause_mora']['vowel_length']
        path.write_text(str(sec))
    return float(path.read_text())


SMALL = set('ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮー')


def split_line(text: str) -> list[str]:
    """1文を、1行に収まる長さの字幕に分ける（句読点 → 文節の切れ目の順に優先）。"""
    if len(text) <= LINE_MAX:
        return [text]
    # 切れ目の候補と、そこで切るコスト（小さいほど自然）
    cost = {}
    for i in range(1, len(text)):
        prev, nxt = text[i - 1], text[i]
        if nxt in '、。」…！？' or nxt in SMALL or prev in '「':
            continue
        if prev in '。！？':
            cost[i] = 0
        elif prev in '、」…':
            cost[i] = 3
        elif re.match(r'[ぁ-ん]', prev) and not re.match(r'[ぁ-ん]', nxt):
            cost[i] = 9
        elif prev in 'はがをにでともへや' and re.match(r'[ぁ-ん]', nxt):
            cost[i] = 14
        else:
            cost[i] = 40
    # 動的計画法：1行に収まり、切れ目のコスト＋行数＋短すぎる行の罰点が最小になる分け方
    n = len(text)
    best = [(0.0, -1)] + [(float('inf'), -1)] * n
    for j in list(cost) + [n]:
        for i in [0] + [k for k in cost if k < j]:
            seg = j - i
            if seg > LINE_MAX or best[i][0] == float('inf'):
                continue
            c = best[i][0] + 6 + (cost[j] if j < n else 0) + (8 if seg < 6 else 0)
            if c < best[j][0]:
                best[j] = (c, i)
    cuts, j = [], n
    while j > 0:
        cuts.append(j)
        j = best[j][1]
    cuts = [0] + cuts[::-1]
    return [text[cuts[k]:cuts[k + 1]] for k in range(len(cuts) - 1)]


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
ts_subs = "// scripts/build-voice.py で自動生成。画面下の字幕（1行ずつ）\nimport type {Caption} from '@remotion/captions';\n\nexport const subtitles: Record<string, Caption[]> = {\n"
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
    # 1行ずつの字幕：文の音声の長さを、各部分の読み上げ予測の比で配分する
    subs = []
    for c in caps:
        parts = split_line(c['text'])
        weights = [predicted_length(p) for p in parts]
        total_w = sum(weights)
        t0 = c['startMs']
        for part, wgt in zip(parts, weights):
            t1 = t0 + (c['endMs'] - c['startMs']) * wgt / total_w
            subs.append({'text': part, 'startMs': round(t0), 'endMs': round(t1), 'timestampMs': None, 'confidence': None})
            t0 = t1
    ts_subs += f"\t{sid}: {json.dumps(subs, ensure_ascii=False)},\n"
    for c in subs:
        srt.append(f"{srt_i}\n{fmt(offset_ms + c['startMs'])} --> {fmt(offset_ms + c['endMs'])}\n{c['text']}\n")
        srt_i += 1
    offset_ms += (frames - TRANSITION) / FPS * 1000
    print(sid, frames, f'{frames / FPS:.1f}s')

total = sum(durations.values()) - TRANSITION * (len(IDS) - 1)
(ROOT / 'src/data/captions.ts').write_text(ts_caps, encoding='utf-8')
(ROOT / 'src/data/mouth.ts').write_text(ts_mouth, encoding='utf-8')
(ROOT / 'src/data/subtitles.ts').write_text(ts_subs + '};\n', encoding='utf-8')
(ROOT / 'public/narration.srt').write_text('\n'.join(srt), encoding='utf-8')
tl = '// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）\n'
tl += f'export const TRANSITION_FRAMES = {TRANSITION};\n\nexport const sceneDurations = {{\n'
tl += ''.join(f'\t{k}: {v},\n' for k, v in durations.items())
tl += f'}} as const;\n\nexport const TOTAL_FRAMES = {total};\n'
(ROOT / 'src/data/timeline.ts').write_text(tl, encoding='utf-8')
print('TOTAL', total, f'{total / FPS / 60:.1f}min')
