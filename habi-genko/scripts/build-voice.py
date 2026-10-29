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

IDS = ['Intro', 'JudgeEntrance', 'Clue1Letter', 'Clue2Islands', 'Clue3Samurai', 'Clue4Tetsuhau', 'Clue5Ekotoba', 'Clue6Storm', 'Clue7Envoys',
       'Clue8Wall', 'Clue9Fleet', 'Clue10Kamikaze', 'Clue11Survivors', 'Clue12Wrecks', 'Clue13Search', 'Clue14Ships', 'Clue15Board',
       'Clue16Arrows', 'Clue17Games', 'Clue18Bakufu', 'Clue19Shinkoku', 'RootsStory', 'UnsolvedMystery', 'Summary', 'Closing']

# 読み上げ用の置き換え（字幕はそのまま）。長いものから先に置き換える
READING = [('○', ''), ('△', ''), ('×', ''), ('日本', 'ニホン'), ('地元', 'ジモト'), ('次元', 'ジゲン'), ('復元', 'フクゲン'), ('元から', 'ゲンカラ'), ('対馬', 'ツシマ'), ('天草', 'アマクサ'), ('南宋', 'ナンソウ'), ('てつはう', 'テツハウ'), ('札', 'フダ'),
           ('蒙古襲来絵詞', 'モウコシュウライエコトバ'), ('大蒙古国皇帝、書を日本国王に奉る', 'ダイモウコクコウテイ、ショヲニホンコクオウニタテマツル'),
           ('官軍整わず、また矢尽き、ただ四境を虜掠して帰る', 'カングントトノワズ、マタヤツキ、タダシキョウヲリョリャクシテカエル'),
           ('八幡愚童訓', 'ハチマングドウクン'), ('立正安国論', 'リッショウアンコクロン'), ('異国警固番役', 'イコクケイゴバンヤク'),
           ('管軍総把印', 'カングンソウハイン'), ('鷹島神崎遺跡', 'タカシマコウザキイセキ'), ('神崎', 'コウザキ'),
           ('竹崎季長', 'タケザキスエナガ'), ('季長', 'スエナガ'), ('宗資国', 'ソウノスケクニ'), ('資国', 'スケクニ'),
           ('平景隆', 'タイラノカゲタカ'), ('景隆', 'カゲタカ'), ('少弐景資', 'ショウニカゲスケ'), ('安達泰盛', 'アダチヤスモリ'), ('泰盛', 'ヤスモリ'),
           ('北条時宗', 'ホウジョウトキムネ'), ('時宗', 'トキムネ'), ('杜世忠', 'トセイチュウ'), ('周福', 'シュウフク'), ('范文虎', 'ハンブンコ'),
           ('池田榮史', 'イケダヨシフミ'), ('舩田善之', 'フナダヨシユキ'), ('舩田', 'フナダ'), ('国武貞克', 'クニタケサダカツ'), ('荒川秀俊', 'アラカワヒデトシ'),
           ('服部英雄', 'ハットリヒデオ'), ('佐藤鉄太郎', 'サトウテツタロウ'), ('中山平次郎', 'ナカヤマヘイジロウ'), ('トーマス・コンラン', 'トーマス、コンラン'),
           ('小茂田浜神社', 'コモダハマジンジャ'), ('小茂田浜', 'コモダハマ'), ('新城神社', 'シンジョウジンジャ'), ('百道原', 'モモチバル'), ('祖原', 'ソハラ'),
           ('早良区', 'サワラク'), ('生の松原', 'イキノマツバラ'), ('今津', 'イマヅ'), ('香椎', 'カシイ'), ('西新', 'ニシジン'), ('箱崎', 'ハコザキ'),
           ('志賀島', 'シカノシマ'), ('海の中道', 'ウミノナカミチ'), ('鷹島', 'タカシマ'), ('伊万里湾', 'イマリワン'), ('筥崎宮', 'ハコザキグウ'),
           ('龍ノ口', 'タツノクチ'), ('龍口寺', 'リュウコウジ'), ('常立寺', 'ジョウリュウジ'), ('元使塚', 'ゲンシヅカ'), ('石築地', 'イシツイジ'),
           ('元寇防塁', 'ゲンコウボウルイ'), ('防塁', 'ボウルイ'), ('合浦', 'ガッポ'), ('東路軍', 'トウログン'), ('江南軍', 'コウナングン'), ('江南', 'コウナン'),
           ('慶元', 'ケイゲン'), ('寧波', 'ニンポー'), ('至元十二年', 'シゲンジュウニネン'), ('至元十三年', 'シゲンジュウサンネン'),
           ('高麗史', 'コウライシ'), ('勘仲記', 'カンチュウキ'), ('元史', 'ゲンシ'), ('骨牌', 'コッパイ'), ('矢筈', 'ヤハズ'), ('碇石', 'イカリイシ'),
           ('竜骨', 'リュウコツ'), ('海東郷', 'カイトウゴウ'), ('永仁の徳政令', 'エイニンノトクセイレイ'), ('霜月騒動', 'シモツキソウドウ'),
           ('敵国降伏', 'テキコクコウフク'), ('亀山上皇', 'カメヤマジョウコウ'), ('大矢野家', 'オオヤノケ'), ('三の丸尚蔵館', 'サンノマルショウゾウカン'),
           ('閏7月', 'ウルウシチガツ'), ('文永', 'ブンエイ'), ('弘安', 'コウアン'), ('執権', 'シッケン'), ('御家人', 'ゴケニン'),
           ('元寇', 'ゲンコウ'), ('元軍', 'ゲングン'), ('元の', 'ゲンノ'), ('元に', 'ゲンニ'), ('元が', 'ゲンガ'), ('元は', 'ゲンハ'), ('元を', 'ゲンヲ'),
           ('元や', 'ゲンヤ'), ('元と', 'ゲント'), ('元」', 'ゲン」'), ('主', 'アルジ'), ('塚', 'ツカ')]

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
