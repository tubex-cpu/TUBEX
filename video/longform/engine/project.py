"""プロジェクト（1本の動画）と章の設定を読み、時刻を割り付け、ルールを検査する。

projects/<name>/project.json   全体設定（解像度・fps・フォント・声・素材の置き場所・章の順番）
projects/<name>/assets.json    素材の台帳（ID → ファイル・種類・出典・ライセンス）
projects/<name>/chapters/*.json 章ごとの台本・カット割り・音

章の timing
  fixed : shots[].dur（秒）で並べる。音は audio.mix の完成ミックスを使う（承認済み60秒版）
  voice : segments[] ごとに、narration（文の配列）を VOICEVOX で読み上げた長さを
          その segment の shots に均等（weight があれば比例）に割り付ける。
          1カットが3秒を超えると lint でエラーになる → カットを増やす。
"""
import hashlib
import json
from pathlib import Path

from PIL import Image

MAX_SHOT_SEC = 3.0


class Assets:
    def __init__(self, root, registry):
        self.root = Path(root)
        self.registry = registry
        self._images = {}

    def path(self, asset_id):
        return self.root / self.registry[asset_id]['file']

    def image(self, asset_id):
        if asset_id not in self._images:
            self._images[asset_id] = Image.open(self.path(asset_id)).convert('RGBA')
        return self._images[asset_id]

    # Style.pic_src 用（pictures[id] で画像を返す）
    def __getitem__(self, asset_id):
        return self.image(asset_id)

    def missing(self):
        return [k for k, v in self.registry.items() if not (self.root / v['file']).exists()]


class Project:
    def __init__(self, folder):
        self.dir = Path(folder).resolve()
        self.cfg = json.loads((self.dir / 'project.json').read_text())
        self.registry = json.loads((self.dir / 'assets.json').read_text())
        self.fps = self.cfg['fps']
        self.assets = Assets((self.dir / self.cfg['assets_dir']).resolve(), self.registry)
        self.build = (self.dir / self.cfg.get('build_dir', 'build')).resolve()

    def chapter_ids(self):
        return list(self.cfg['chapters'])

    def chapter(self, cid):
        ch = json.loads((self.dir / 'chapters' / f'{cid}.json').read_text())
        ch['id'] = cid
        return ch


def main_asset(shot):
    """カットの主素材 ID。図解は asset に図の ID を書く。"""
    if 'asset' in shot:
        return shot['asset']
    bg = shot['bg']
    if bg['type'] == 'photo':
        return bg['asset']
    if bg['type'] == 'tiles':
        return '+'.join(bg['assets'])
    raise ValueError('shot needs "asset": ' + json.dumps(shot, ensure_ascii=False)[:120])


def assets_used(shot):
    bg = shot['bg']
    if bg['type'] == 'photo':
        return [bg['asset']]
    if bg['type'] == 'tiles':
        return list(bg['assets'])
    if bg['type'] == 'character':
        return ['scene', 'blink', 'salmon', 'tuna', 'egg', 'ikura', 'shrimp']
    return []


def timeline(project, ch, voice=None):
    """章のカットと文に、フレーム単位の開始・終了を割り付ける。

    戻り値 {"frames": 章の総フレーム, "shots": [{index, start, end(フレーム), shot}], "sentences": [{text, start, end(秒), wav}]}
    """
    fps = project.fps
    shots = []
    sentences = []
    if ch['timing'] == 'fixed':
        f = 0
        for i, s in enumerate(ch['shots']):
            n = int(round(s['dur'] * fps))
            shots.append({'index': i, 'start': f, 'end': f + n, 'shot': s})
            f += n
        return {'frames': f, 'shots': shots, 'sentences': []}
    if ch['timing'] != 'voice':
        raise ValueError('timing must be fixed or voice')
    from .audio import read_wav
    pace = ch.get('pace', {})
    head = pace.get('head', .5)
    gap = pace.get('gap', .45)
    tail = pace.get('tail', .8)
    sec = head
    seg_bounds = []
    for seg in ch['segments']:
        start = sec
        for text in seg.get('narration', []):
            if voice is None:
                # 音声なしの見積もり（plan 用）：1分あたり chars_per_min 字
                dur = len(text) / project.cfg.get('voice', {}).get('chars_per_min', 320) * 60
                wav = None
            else:
                wav = voice.sentence(text)
                data, sr = read_wav(wav)
                dur = len(data) / sr
            sentences.append({'text': text, 'start': round(sec, 4), 'end': round(sec + dur, 4), 'wav': str(wav) if wav else None})
            sec += dur + gap
        sec += seg.get('hold', 0)
        if not seg.get('narration'):
            sec += seg['duration']
        seg_bounds.append((start, sec))
    total = sec - gap + tail if sentences else sec
    # segment の境界をフレームに直す（最初は0、最後は章末）
    edges = [0] + [int(round(b * fps)) for _, b in seg_bounds[:-1]] + [int(round(total * fps))]
    i = 0
    for k, seg in enumerate(ch['segments']):
        a, b = edges[k], edges[k + 1]
        weights = [s.get('weight', 1) for s in seg['shots']]
        acc = 0
        for s, w in zip(seg['shots'], weights):
            s0 = a + int(round((b - a) * acc / sum(weights)))
            acc += w
            s1 = a + int(round((b - a) * acc / sum(weights)))
            shots.append({'index': i, 'start': s0, 'end': s1, 'shot': s})
            i += 1
    return {'frames': edges[-1], 'shots': shots, 'sentences': sentences}


def lint(project, ch, tl):
    """承認済み60秒版の基準を、章の設定で守れているか確かめる。errors は書き出し前に直す。"""
    errors, warnings = [], []
    fps = project.fps
    reg = project.registry
    prev = None
    seen = {}
    giants = 0
    for item in tl['shots']:
        s = item['shot']
        label = f"{ch['id']} #{item['index']:03d} ({item['start'] / fps:.1f}s)"
        n = item['end'] - item['start']
        if n <= 0:
            errors.append(f'{label}: 長さが0（segment のカットが多すぎる）')
        if n > MAX_SHOT_SEC * fps + 0.5:
            errors.append(f'{label}: {n / fps:.2f}秒。3秒以内ごとに別の主素材へ切り替える（この segment のカットを増やす）')
        try:
            main = main_asset(s)
        except ValueError as e:
            errors.append(f'{label}: {e}')
            continue
        if main == prev:
            errors.append(f'{label}: 直前と同じ主素材 {main}（拡大率だけ変えてカットを埋めない）')
        if main in seen and not s.get('revisit'):
            errors.append(f'{label}: 主素材 {main} は {seen[main]} で使用済み。再訪するなら場所・視点・説明対象を変えて "revisit" に理由を書く')
        seen.setdefault(main, label)
        prev = main
        texts = ' '.join(L.get('text', '') for L in s.get('layers', []))
        for a in assets_used(s):
            if a not in reg:
                errors.append(f'{label}: 素材 {a} が assets.json にない')
                continue
            kind = reg[a]['kind']
            if kind == 'photo' and '実写' not in texts:
                errors.append(f'{label}: 実写 {a} に「実写：場所 ／ 作者・ライセンス」の表記がない')
            if kind == 'photo' and not all(reg[a].get(k) for k in ['source', 'license', 'author']):
                errors.append(f'{label}: 実写 {a} の出典・作者・ライセンスが assets.json にない')
            if kind == 'ai' and 'イメージ' not in texts:
                errors.append(f'{label}: AI再現画像 {a} に「再現イメージ」等の表記がない（実写と混同させない）')
        giants += sum(1 for L in s.get('layers', []) if L['type'] == 'giant')
    minutes = tl['frames'] / fps / 60
    limit = ch.get('giant_max', max(1, int(minutes / project.cfg.get('giant_every_min', 2))))
    if giants > limit:
        errors.append(f"{ch['id']}: 特大数字が{giants}回（上限{limit}回）。重要な数字だけに絞る")
    if not tl['shots']:
        errors.append(f"{ch['id']}: カットがない")
    return errors, warnings


def shot_key(project, ch, item, engine_hash, fonts):
    """カットの描画結果を決める入力のハッシュ。変わっていなければ再描画しない（再開・部分修正用）。"""
    data = {'shot': item['shot'], 'start': item['start'], 'end': item['end'], 'fps': project.fps,
            'engine': engine_hash, 'fonts': fonts,
            'assets': {a: _file_sig(project.assets.path(a)) for a in assets_used(item['shot']) if a in project.registry}}
    return hashlib.sha256(json.dumps(data, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def _file_sig(p):
    p = Path(p)
    if not p.exists():
        return None
    st = p.stat()
    return [st.st_size, int(st.st_mtime)]
