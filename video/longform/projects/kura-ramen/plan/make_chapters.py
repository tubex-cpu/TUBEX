"""beats.py（絵コンテ）と台本の章データから chapters/*.json を作る。

  python plan/make_chapters.py          （video/longform/projects/kura-ramen で実行）

- 文ごとの長さは VOICEVOX の読み上げ（キャッシュ）で測り、1カット2.9秒以内になる数のカットを割り当てる。
- ビートが足りなければ章の fill から足す。同じ主素材は章の中で2回使わない。
- 写真のタグ → 素材ID は plan/photo_tags.json。実写には「実写：被写体 ／ 作者・ライセンス」、
  再現画像には「再現イメージ」の表記を自動で付ける。
"""
import hashlib
import json
import math
import sys
import wave
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJ = HERE.parent
sys.path.insert(0, str(PROJ.parent.parent))
sys.path.insert(0, str(HERE))

from beats import CH  # noqa: E402
from engine.audio import Voicevox  # noqa: E402

SCRIPT = PROJ.parents[3] / 'channels/shoku-karakuri/drafts/kara-001-sushi-ramen/script_v6_chapters.json'
MAX_SHOT = 2.9
FILM_CAP = 2       # 1枚の写真を全編で使う上限
FILM_CAP_KEY = 3   # くら寿司の実写・再現画像（要所の決めカット）の上限
USES = None
OVER = []


def cap(a):
    return FILM_CAP_KEY if not a.startswith('cm-') else FILM_CAP
MIN_SHOT = 1.3

PKG_CREDIT = {
    'real-01': '実写：くら寿司 中百舌鳥店 ／ Tokumeigakarinoaoshima・CC0',
    'real-03': '実写：くら寿司の店内 ／ Tamaki Sono・CC BY 2.0（2011年撮影）',
    'real-06': '実写：くら寿司 西新宿店 ／ 経済特区・CC0',
    'real-08': '実写：くら寿司 西新宿店 ／ 経済特区・CC0',
    'real-19': '実写：くら寿司 西新宿店 ／ 経済特区・CC0',
    'real-13': '実写：くら寿司 西新宿店の店内備品 ／ 経済特区・CC0',
    'real-15': '実写：くら寿司 西新宿店の店内備品 ／ 経済特区・CC0',
    'real-16': '実写：くら寿司 西新宿店の店内備品 ／ 経済特区・CC0',
    'ramenhero': '料理の再現イメージ',
    'sushimacro': '料理の再現イメージ',
    'broth': '調理の再現イメージ',
    'kitchen': '調理の再現イメージ',
    'conveyor': '寿司レーンの再現イメージ',
    'bowls': '数量のイメージ',
}
GRID = {'steps', 'bars', 'dots', 'sizes', 'ladder'}


def did(obj):
    return hashlib.sha1(json.dumps(obj, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:10]


class Chapter:
    def __init__(self, cid, spec, registry, tags):
        self.cid = cid
        self.spec = spec
        self.reg = registry
        self.tags = tags
        self.used = set()
        self.fill_i = 0
        self.giants = 0

    def photo_id(self, tag, slack=0):
        """タグの写真のうち、この章で未使用・全編での使用が上限未満のものから、使用回数の少ない順に選ぶ。"""
        cand = [a for a in self.tags.get(tag, []) if a not in self.used and a in self.reg
                and USES[a] < cap(a) + slack]
        return min(cand, key=lambda a: (USES[a], self.tags[tag].index(a))) if cand else None

    def credit(self, a):
        if a in PKG_CREDIT:
            return PKG_CREDIT[a]
        r = self.reg[a]
        lic = r.get('license', '')
        return f"実写：{r.get('subject', '')} ／ {r.get('author', '')}・{lic}"

    def photo_shot(self, a, title=None):
        layers = [{'type': 'credit', 'text': self.credit(a)}]
        if title:
            layers.append({'type': 'title', 'text': title, 'y': 760, 'n': 100 if len(title) <= 12 else 84})
        return {'asset': a, 'bg': {'type': 'photo', 'asset': a, 'scrim': 160}, 'layers': layers}

    def make(self, beat):
        """ビート1つ → カット（作れなければ None）。"""
        eb = {'type': 'eyebrow', 'text': self.spec['eyebrow']}
        if isinstance(beat, str):
            kind, _, rest = beat.partition(':')
            name, _, title = rest.partition('|')
            if kind == 'k':
                a = name
                if USES[a] >= cap(a):
                    return None
            else:
                a = self.photo_id(name)
                if a is None:
                    return None
            if a in self.used:
                return None
            s = self.photo_shot(a, title or None)
            s['note'] = (title or name)[:14]
            return s
        if 'd' in beat:
            L = {k: v for k, v in beat.items() if k != 'd'}
            L['type'] = beat['d']
            return {'asset': 'diagram:' + did(L), 'note': beat['d'],
                    'bg': {'type': 'dark', 'grid': beat['d'] in GRID}, 'layers': [eb, L]}
        if 't' in beat:
            L = {'type': 'title_card', 'text': beat['t']}
            if beat.get('sub'):
                L['sub'] = beat['sub']
            return {'asset': 'text:' + did(L), 'note': beat['t'][:14], 'bg': {'type': 'dark'}, 'layers': [eb, L]}
        if 'q' in beat:
            L = {'type': 'quote', 'text': beat['q'], 'by': beat.get('by', '')}
            return {'asset': 'quote:' + did(L), 'note': '引用', 'bg': {'type': 'dark'}, 'layers': [L]}
        if 'g' in beat:
            L = {'type': 'giant', 'value': beat['g'], 'unit': beat.get('unit', ''), 'y': beat.get('y', 300), 'n': beat.get('n', 400)}
            return {'asset': 'giant:' + did(L), 'note': '数字 ' + beat['g'], 'bg': {'type': 'dark', 'grid': True},
                    'layers': [eb, L], 'flash': True, 'hit': True}
        raise ValueError(beat)

    def take(self, beat):
        s = self.make(beat)
        if s is None or s['asset'] in self.used:
            return None
        self.used.add(s['asset'])
        if s['bg']['type'] == 'photo':
            USES[s['asset']] += 1
        return s

    def filler(self):
        fill = self.spec['fill']
        for _ in range(len(fill) * 3):
            b = fill[self.fill_i % len(fill)]
            self.fill_i += 1
            s = self.take(b)
            if s:
                return s
        # 章の fill が尽きたら、ラーメンに近い題材の順で
        for tag in ['ramen', 'misoramen', 'tonkotsu', 'tsukemen', 'noodles', 'noodlelift', 'kitchen', 'steam', 'ramenshop', 'shop',
                    'dashi', 'misosoup', 'sushi', 'conveyor', 'noren', 'queue', 'udon', 'fish', 'fishport']:
            if self.photo_id(tag):
                return self.take('p:' + tag)
        # それでも足りなければ上限を1つだけ緩める（使ったら報告に出す）
        for tag in list(self.tags):
            a = self.photo_id(tag, slack=1)
            if a:
                OVER.append((self.cid, a))
                self.used.add(a)
                USES[a] += 1
                return self.photo_shot(a)
        raise RuntimeError(f'{self.cid}: 素材が足りない（写真を増やすか fill を足す）')


def main():
    proj = json.loads((PROJ / 'project.json').read_text())
    reg = json.loads((PROJ / 'assets.json').read_text())
    tags = json.loads((HERE / 'photo_tags.json').read_text())
    script = {c['id']: c for c in json.loads(SCRIPT.read_text())}
    voice = Voicevox(proj['voice'], PROJ.parent.parent / '.build/kura-ramen/voice-cache')
    pace = proj.get('pace', {})
    gap = pace.get('gap', .45)
    global USES
    from collections import Counter
    USES = Counter()
    ids = ['ch00-opening']
    report = []
    for cid, spec in CH.items():
        sents = script[cid]['narration']
        assert len(sents) == len(spec['beats']), f"{cid}: 文 {len(sents)} とビート {len(spec['beats'])} の数が違う"
        ch = Chapter(cid, spec, reg, tags)
        segments = []
        for i, (text, beats) in enumerate(zip(sents, spec['beats'])):
            with wave.open(str(voice.sentence(text))) as w:
                dur = w.getnframes() / w.getframerate()
            seg = dur + gap + (pace.get('head', .5) if i == 0 else 0) + (pace.get('tail', .8) if i == len(sents) - 1 else 0)
            need = math.ceil(seg / MAX_SHOT)
            most = max(1, math.floor(seg / MIN_SHOT))
            shots = [s for s in (ch.take(b) for b in beats[:most]) if s]
            while len(shots) < need:
                shots.append(ch.filler())
            segments.append({'narration': [text], 'shots': shots})
        hits = [s for seg in segments for s in seg['shots'] if s.get('hit')]
        if segments[0]['shots']:
            segments[0]['shots'][0]['hit'] = True
        out = {'title': script[cid]['title'], 'source': 'script_v6_chapters.json（社長承認 2026-10-30）', 'timing': 'voice',
               'audio': {'fade_in': .6, 'fade_out': 1.2}, 'segments': segments}
        (PROJ / 'chapters' / f'{cid}.json').write_text(json.dumps(out, ensure_ascii=False, indent=1))
        n = sum(len(s['shots']) for s in segments)
        photos = sum(1 for s in segments for x in s['shots'] if x['bg']['type'] == 'photo')
        report.append(f'{cid}: カット{n}（写真{photos}・図解ほか{n - photos}）特大数字{len(hits)}')
        ids.append(cid)
    proj['chapters'] = ids
    (PROJ / 'project.json').write_text(json.dumps(proj, ensure_ascii=False, indent=2))
    print('\n'.join(report))
    print('写真の使用回数:', dict(sorted(Counter(USES.values()).items())), '上限超え:', OVER)


if __name__ == '__main__':
    main()
