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

IDS = ['Intro', 'JudgeEntrance', 'Clue1Kuniyuzuri', 'Clue2Shoki', 'Clue3Hoshi', 'Clue4Izumo', 'Clue5Honden', 'Clue6Senza', 'Clue7Moriya', 'Clue8Ohori', 'Clue9Moreya', 'Clue10Moriyake', 'Clue11Mishaguji', 'Clue12Jomon', 'Clue13Ontou', 'Clue14Fushigi', 'Clue15Okou', 'Clue16Kajikimen', 'Clue17Bushi', 'Clue18Genko', 'Clue19Bunsha', 'Clue20Hebi', 'Clue21Onbashira', 'Clue22Truck', 'Clue23Takato', 'Clue24Omiwatari', 'Clue25Kiroku', 'Clue26Akenoumi', 'Clue27Science', 'Clue28Lake', 'RootsStory', 'UnsolvedMystery', 'Summary', 'Closing']

# 読み上げ用の置き換え（字幕はそのまま）。長いものから先に置き換える
READING = [('御柱古道', 'オンバシラコドウ'), ('仏になれ', 'ホトケニナレ'), ('米と小豆', 'コメトアズキ'), ('重要文化財11棟', 'ジュウヨウブンカザイジュウイットウ'), ('神楽殿', 'カグラデン'), ('神体山', 'シンタイサン'), ('信毎賞', 'シンマイショウ'), ('鹿狩り', 'シカガリ'), ('お札', 'オフダ'), ('一柱', 'ヒトハシラ'), ('文書', 'モンジョ'), ('サイエンティフィック・リポーツ', 'サイエンティフィックリポーツ'), ('諏方南宮法性大明神', 'スワナングウホッショウダイミョウジン'), ('糸魚川・静岡構造線', 'イトイガワシズオカコウゾウセン'), ('神長官守矢史料館', 'ジンチョウカンモリヤシリョウカン'), ('式年造営御柱大祭', 'シキネンゾウエイオンバシラタイサイ'), ('諏訪大明神絵詞', 'スワダイミョウジンエコトバ'), ('南方刀美神社', 'ミナカタトミジンジャ'), ('本朝二十四孝', 'ホンチョウニジュウシコウ'), ('坂上田村麻呂', 'サカノウエノタムラマロ'), ('建御名方神', 'タケミナカタノカミ'), ('八坂刀売神', 'ヤサカトメノカミ'), ('御渡注進状', 'オワタリチュウシンジョウ'), ('当社神幸記', 'トウシャジンコウキ'), ('中央構造線', 'チュウオウコウゾウセン'), ('御座なく候', 'ゴザナクソウロウ'), ('諏訪の本地', 'スワノホンジ'), ('中ッ原遺跡', 'ナカッパライセキ'), ('建御雷神', 'タケミカヅチノカミ'), ('武甕槌神', 'タケミカヅチノカミ'), ('経津主神', 'フツヌシノカミ'), ('事代主神', 'コトシロヌシノカミ'), ('大国主神', 'オオクニヌシノカミ'), ('香香背男', 'カカセオ'), ('諏訪法性', 'スワホッショウ'), ('御神渡り', 'オミワタリ'), ('御渡り帳', 'オワタリチョウ'), ('明けの海', 'アケノウミ'), ('八剱神社', 'ヤツルギジンジャ'), ('葛井神社', 'クズイジンジャ'), ('御作田社', 'ミサクダシャ'), ('御小屋山', 'オコヤヤマ'), ('信府統記', 'シンプトウキ'), ('仮見立て', 'カリミタテ'), ('本見立て', 'ホンミタテ'), ('甲賀三郎', 'コウガサブロウ'), ('石神問答', 'イシガミモンドウ'), ('柳田國男', 'ヤナギタクニオ'), ('菅江真澄', 'スガエマスミ'), ('北村皆雄', 'キタムラミナオ'), ('藤森照信', 'フジモリテルノブ'), ('藤森孝俊', 'フジモリタカトシ'), ('守矢早苗', 'モリヤサナエ'), ('諏訪円忠', 'スワエンチュウ'), ('棚畑遺跡', 'タナバタケイセキ'), ('海戸遺跡', 'カイドイセキ'), ('顔面把手', 'ガンメンハシュ'), ('屈斜路湖', 'クッシャロコ'), ('トルネ川', 'トルネガワ'), ('すわの海', 'スワノウミ'), ('官幣大社', 'カンペイタイシャ'), ('持統天皇', 'ジトウテンノウ'), ('斉明天皇', 'サイメイテンノウ'), ('穂屋祭り', 'ホヤマツリ'), ('神長官', 'ジンチョウカン'), ('御神渡', 'オミワタリ'), ('御渡り', 'オワタリ'), ('御作田', 'ミサクダ'), ('御射山', 'ミサヤマ'), ('守屋山', 'モリヤサン'), ('諏方氏', 'スワシ'), ('御頭祭', 'オントウサイ'), ('御贄柱', 'オニエバシラ'), ('耳裂鹿', 'ミミサケジカ'), ('鹿食免', 'カジキメン'), ('御柱祭', 'オンバシラサイ'), ('建御柱', 'タテオンバシラ'), ('木落し', 'キオトシ'), ('川越し', 'カワコシ'), ('里曳き', 'サトビキ'), ('山出し', 'ヤマダシ'), ('冠落し', 'カンムリオトシ'), ('神道集', 'シントウシュウ'), ('社宮司', 'シャグウジ'), ('宮坂清', 'ミヤサカキヨシ'), ('星ヶ塔', 'ホシガトウ'), ('茅野市', 'チノシ'), ('鉄平石', 'テッペイセキ'), ('黒曜石', 'コクヨウセキ'), ('高遠町', 'タカトウマチ'), ('辰野町', 'タツノマチ'), ('上伊那', 'カミイナ'), ('摩周湖', 'マシュウコ'), ('七ッ釜', 'ナナツガマ'), ('延喜式', 'エンギシキ'), ('正一位', 'ショウイチイ'), ('翁と媼', 'オキナトオウナ'), ('遷座祭', 'センザサイ'), ('お舟祭', 'オフネマツリ'), ('蛙狩り', 'カエルガリ'), ('梶の葉', 'カジノハ'), ('依り代', 'ヨリシロ'), ('注進状', 'チュウシンジョウ'), ('拝観式', 'ハイカンシキ'), ('1万社', 'イチマンシャ'), ('遠州', 'エンシュウ'), ('御渡', 'オワタリ'), ('洩矢', 'モレヤ'), ('守矢', 'モリヤ'), ('大祝', 'オオホウリ'), ('御杖', 'オツエ'), ('御柱', 'オンバシラ'), ('曳行', 'エイコウ'), ('御室', 'ミムロ'), ('鉄鐸', 'テツタク'), ('釜穴', 'カマアナ'), ('科野', 'シナノ'), ('須波', 'スワ'), ('信濃', 'シナノ'), ('嘉吉', 'カキツ'), ('応永', 'オウエイ'), ('天明', 'テンメイ'), ('天保', 'テンポウ'), ('筒粥', 'ツツガユ'), ('氏子', 'ウジコ'), ('分霊', 'ブンレイ'), ('神人', 'ジニン'), ('神馬', 'シンメ'), ('上社', 'カミシャ'), ('下社', 'シモシャ'), ('本宮', 'ホンミヤ'), ('前宮', 'マエミヤ'), ('春宮', 'ハルミヤ'), ('秋宮', 'アキミヤ'), ('日本', 'ニホン'), ('○', ''), ('△', ''), ('×', '')]

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
