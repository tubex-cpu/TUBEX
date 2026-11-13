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

IDS = ['Intro', 'JudgeEntrance', 'Clue1Count', 'Clue2Yudono', 'Clue3Goshintai', 'Clue4Haguro', 'Clue5Gyonin', 'Clue6Mokujiki', 'Clue7Urushi', 'Clue8Kane', 'Clue9Unburied', 'Clue10Honmyokai', 'Clue11Shinnyokai', 'Clue12Eye', 'Clue13Tetsumonkai', 'Clue14Ikeda', 'Clue15Tetsuryukai', 'Clue16Chukai', 'Clue17Enmyokai', 'Clue18Fly', 'Clue19Processed', 'Clue20Kouchi', 'Clue21Yutei', 'Clue22Fingerprint', 'Clue23Meiji', 'Clue24Bukkai', 'Clue25Excavation', 'Clue26Dochu', 'Clue27Shitou', 'Clue28Zhanggong', 'Clue29Thailand', 'Clue30Lost', 'Clue31Myokai', 'Clue32Koromo', 'Clue33Fame', 'RootsStory', 'UnsolvedMystery', 'Summary', 'Closing']

# 読み上げ用の置き換え（字幕はそのまま）。長いものから先に置き換える
READING = [('○', ''), ('△', ''), ('×', ''), ('日本ミイラ研究グループ', 'ニホンミイラケンキュウグループ'), ('福建省高級人民法院', 'フッケンショウコウキュウジンミンホウイン'), ('大淀三千風', 'オオヨドミチカゼ'), ('松ぼっくり', 'マツボックリ'), ('即身成仏', 'ソクシンジョウブツ'), ('土中入定', 'ドチュウニュウジョウ'), ('一世行人', 'イッセイギョウニン'), ('出羽三山', 'デワサンザン'), ('明海上人', 'ミョウカイショウニン'), ('弘智法印', 'コウチホウイン'), ('宥貞法印', 'ユウテイホウイン'), ('池田玄斎', 'イケダゲンサイ'), ('安藤更生', 'アンドウコウセイ'), ('岩鼻通明', 'イワハナミチアキ'), ('内藤正敏', 'ナイトウマサトシ'), ('坂上和弘', 'サカウエカズヒロ'), ('中村安宏', 'ナカムラヤスヒロ'), ('酒井忠当', 'サカイタダマサ'), ('石頭希遷', 'セキトウキセン'), ('章公祖師', 'ショウコウソシ'), ('鈴木牧之', 'スズキボクシ'), ('北越雪譜', 'ホクエツセップ'), ('辛亥革命', 'シンガイカクメイ'), ('結跏趺坐', 'ケッカフザ'), ('弥勒菩薩', 'ミロクボサツ'), ('即身仏', 'ソクシンブツ'), ('肉身仏', 'ニクシンブツ'), ('入定塚', 'ニュウジョウヅカ'), ('木食行', 'モクジキギョウ'), ('行人様', 'ギョウニンサマ'), ('仙人沢', 'センニンザワ'), ('湯殿山', 'ユドノサン'), ('羽黒山', 'ハグロサン'), ('注連寺', 'チュウレンジ'), ('大日坊', 'ダイニチボウ'), ('海向寺', 'カイコウジ'), ('本明寺', 'ホンミョウジ'), ('南岳寺', 'ナンガクジ'), ('西生寺', 'サイショウジ'), ('貫秀寺', 'カンシュウジ'), ('妙法寺', 'ミョウホウジ'), ('總持寺', 'ソウジジ'), ('西楽寺', 'サイラクジ'), ('仁和寺', 'ニンナジ'), ('寛永寺', 'カンエイジ'), ('本明海', 'ホンミョウカイ'), ('真如海', 'シンニョカイ'), ('鉄門海', 'テツモンカイ'), ('鉄竜海', 'テツリュウカイ'), ('円明海', 'エンミョウカイ'), ('光明海', 'コウミョウカイ'), ('恵眼院', 'エゲンイン'), ('亀鏡志', 'キキョウシ'), ('弘采録', 'コウサイロク'), ('小片保', 'オガタタモツ'), ('松本昭', 'マツモトアキラ'), ('阿賀町', 'アガマチ'), ('阿南町', 'アナンチョウ'), ('浅川町', 'アサカワマチ'), ('桜川市', 'サクラガワシ'), ('白鷹町', 'シラタカマチ'), ('稲城市', 'イナギシ'), ('鶴見区', 'ツルミク'), ('東岩本', 'ヒガシイワモト'), ('三明市', 'サンメイシ'), ('大田県', 'ダイデンケン'), ('福建省', 'フッケンショウ'), ('語らば', 'カタラバ'), ('出開帳', 'デガイチョウ'), ('日本', 'ニホン'), ('入定', 'ニュウジョウ'), ('木食', 'モクジキ'), ('月山', 'ガッサン'), ('忠海', 'チュウカイ'), ('仏海', 'ブッカイ'), ('全海', 'ゼンカイ'), ('舜義', 'シュンギ'), ('淳海', 'ジュンカイ'), ('清海', 'セイカイ'), ('宥貞', 'ユウテイ'), ('上人', 'ショウニン'), ('法印', 'ホウイン'), ('天宥', 'テンユウ'), ('萬蔵', 'マンゾウ'), ('五穀', 'ゴコク'), ('十穀', 'ジッコク'), ('置賜', 'オキタマ'), ('庄内', 'ショウナイ'), ('大網', 'オオアミ'), ('丑年', 'ウシドシ'), ('未年', 'ヒツジドシ'), ('子年', 'ネドシ'), ('別当', 'ベットウ'), ('山内', 'サンナイ'), ('燻製', 'クンセイ'), ('柿渋', 'カキシブ'), ('湯灌', 'ユカン'), ('開帳', 'カイチョウ'), ('天明', 'テンメイ'), ('天和', 'テンナ'), ('鉦', 'カネ'), ('袂', 'タモト')]

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
