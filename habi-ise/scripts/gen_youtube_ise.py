"""伊勢判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_ise.py"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / 'scripts/build-voice.py').read_text()
order = eval(src[src.index('IDS = ') + 6:src.index(']', src.index('IDS = ')) + 1])
tl = (ROOT / 'src/data/timeline.ts').read_text()
T = int(re.search(r'TRANSITION_FRAMES = (\d+)', tl).group(1))
d = {k: int(v) for k, v in re.findall(r'\t(\w+): (\d+),', tl)}
total = int(re.search(r'TOTAL_FRAMES = (\d+)', tl).group(1))
starts, t = [], 0
for k in order:
    starts.append(t)
    t += d[k] - T


def hms(f):
    s = int(f / 30)
    return f'{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}' if s >= 3600 else f'{s // 60}:{s % 60:02d}'


# チャプター名：短く、答えを言わずに引っかかる言い方
CHAP = ['冬至の朝、大鳥居から昇る太陽', 'ハビ判事、開廷', '宇治橋と冬至の朝日', '倭姫命の旅', '三種の神器はどこに', '見えない八咫鏡', 'ヘブライ文字の噂', '草薙剣の祟り', '壇ノ浦に沈んだ剣', '草薙剣を見た人', '木曽から伊勢へ', '三種の神器の本当の物語', '残された謎', '9の判決', '閉廷']
assert len(CHAP) == len(order)
chap = '\n'.join(f'{hms(s)} {c}' for s, c in zip(starts, CHAP))

lines = (ROOT / 'scripts/script.txt').read_text().splitlines()
out, i = [], 0
for ln in lines:
    if ln.startswith('0:00 '):
        out.append(f'\n■ {hms(starts[i])} {ln[5:]}')
        i += 1
    else:
        out.append(ln)
dur = hms(total)
(ROOT / '台本_伊勢判決.txt').write_text(f'ハビ判事 台本：伊勢判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
credits_full = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
(ROOT / '写真クレジット一覧.md').write_text('# 伊勢判決：写真・資料のクレジット（登場順・すべて Wikimedia Commons ほか）\n\n' + credits_full + '\n')

# 概要欄は5000字までなので、写真のクレジットはライセンスごとに撮影者・作者名をまとめる
import json, collections
cj = json.loads((ROOT / 'public/photos/credits.json').read_text())
NAME = {
    'Göhring, Herman ; Mondejar, [?]': 'Herman Göhring', 'Scott Umstattd scott_umstattd': 'Scott Umstattd', 'John Kutcher jmkutcher': 'John Kutcher', 'Preben Nilsen (@prebz22) on Unsplash': 'Preben Nilsen', 'Felipe Guamán Poma de Ayala (1616)': 'Felipe Guamán Poma de Ayala', 'David Berkowitz from New York, NY, USA': 'David Berkowitz', 'Jorge Láscar from Australia': 'Jorge Láscar', 'McKay Savage from London, UK': 'McKay Savage',
    'Nankou Oronain (as36…': 'Nankou Oronain', 'ja:User:Sanjo': 'Sanjo',
    'そらみみ (Soramimi)': 'そらみみ', 'Gary Todd from Xinzheng, China': 'Gary Todd', 'Gary Lee Todd, Ph.D.': 'Gary Todd',
    'Hot cake syrup (talk)': 'Hot cake syrup', 'Original file is made by Ksiom, modified by Pekachu.': 'Ksiom, Pekachu',
    'Korea.net / Korean Culture and Information Service (Jeon Han)': 'Korea.net（Jeon Han）',
    'ウィキ太郎 (Wiki Taro)': 'ウィキ太郎', 'MODIS Land Rapid Response Team, NASA GSFC': 'NASA',
}
PD_WORKS = ('浮世絵・古典籍（春斎年昌、三代豊国、月岡芳年、豊原周延、歌川国芳、歌川貞秀、源平合戦図屏風、日本書紀 田中本・弘安本 ほか）')
by = collections.defaultdict(list)
pd = []
for i in ids:
    v = cj[i]
    lic = v['license']
    if lic == 'オリジナル':
        continue
    if lic in ('Public domain', 'CC0'):
        if lic == 'CC0' and v['artist'] != '作者不明':
            pd.append(NAME.get(v['artist'], v['artist']))
        continue
    n = NAME.get(v['artist'], v['artist'])
    if n not in by[lic]:
        by[lic].append(n)
ORDER = ['CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY-SA 2.0', 'CC BY 4.0', 'CC BY 3.0', 'CC BY 2.0']
lines = [f'{l}：' + '、'.join(by[l]) for l in ORDER if by[l]]
lines.append('パブリックドメイン・CC0：' + PD_WORKS + ('、写真：' + '、'.join(dict.fromkeys(pd)) if pd else ''))
credits = '\n'.join(lines)

md = f'''# YouTube 投稿用テキスト：伊勢判決

## タイトル案

- 天皇でさえ見られない？ 三種の神器はいまどこに――冬至の伊勢神宮と八咫鏡の謎（推奨）
- 草薙剣は壇ノ浦に沈んだのか？ 三種の神器の「本当の居場所」をハビ判事が検証
- 冬至の朝、伊勢で太陽が鳥居をくぐる――八咫鏡を守る1300年の秘密

## 概要欄

2026年12月22日、冬至。朝7時半ごろ、伊勢神宮・内宮の宇治橋の大鳥居の真ん中から、太陽が昇ります。
内宮の御神体とされる八咫鏡は、天皇でさえ見られないと言われる三種の神器のひとつ。草薙剣には、天皇の病の原因として占われたという日本書紀の記録が残り、壇ノ浦の海に沈んだとも語られてきました。
三種の神器は、いま、どこにあるのか。2025年に木曽で伐り出された「八咫鏡を納める器」のヒノキ、2026年のお木曳など、第63回式年遷宮の最新の動きと、日本書紀などの記録をもとに、9の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。

▼チャプター
{chap}

▼参考資料
・令和8年暦要項（国立天文台）https://eco.mtk.nao.ac.jp/koyomi/yoko/2026/rekiyou262.html
・冬至の宇治橋（観光三重）https://www.kankomie.or.jp/topic/1261
・第63回神宮式年遷宮 行事の資料（伊勢御遷宮委員会）https://isesengu.jp/upload/20250507-190156.pdf
・御杣始祭・御用材伐採（林野庁 中部森林管理局）https://www.rinya.maff.go.jp/chubu/koho/koho_si/kakutitayori/attach/pdf/070917-1.pdf
・御木曳行事 2026（観光三重）https://www.kankomie.or.jp/topic/1223
・剣璽等承継の儀（政府広報オンライン）https://www.gov-online.go.jp/eng/publicity/book/hlj/html/201904/201904_06A_jp.html
・熱田神宮の由緒（あいち観光ナビ）https://aichinow.pref.aichi.jp/spots/detail/10/
・熱田と草薙剣（名古屋市 歴史の里）https://www.city.nagoya.jp/kankobunkakoryu/cmsfiles/contents/0000172/172684/rekimachi_2_2.pdf

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
再現イラスト：オリジナル（ハビ判事チャンネル制作）
地図：Mapzen Terrain Tiles（SRTM ほか）の標高データをもとに作成
写真・資料（Wikimedia Commons ほか）
{credits}
写真ごとの出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-ise/写真クレジット一覧.md

#伊勢神宮 #三種の神器 #八咫鏡 #草薙剣 #冬至 #式年遷宮 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
