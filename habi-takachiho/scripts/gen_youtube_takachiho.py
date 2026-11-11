"""高千穂判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_takachiho.py"""
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
CHAP = ['年に一度、33番すべてを舞う2日間', 'ハビ判事、開廷', '夜神楽はショー？', '800年の歴史', '天岩戸はどこにある？', '本殿のない神社', '二つの高千穂', '太陽が消えた日', '天照大神と卑弥呼', 'アメノウズメの舞', '舞い手たちのいま', '神楽とユネスコ', '天岩戸の本当の物語', '残された謎', '10の判決', '閉廷']
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
(ROOT / '台本_高千穂判決.txt').write_text(f'ハビ判事 台本：高千穂判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
credits_full = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
(ROOT / '写真クレジット一覧.md').write_text('# 高千穂判決：写真・資料のクレジット（登場順・すべて Wikimedia Commons ほか）\n\n' + credits_full + '\n')

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
PD_WORKS = ('浮世絵・古典籍・古写真（春斎年昌、歌川国貞、北渓、歌川国芳、鈴木春信、真福寺本古事記 ほか）')
by = collections.defaultdict(list)
pd = []
for i in ids:
    v = cj[i]
    lic = v['license']
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

md = f'''# YouTube 投稿用テキスト：高千穂判決

## タイトル案

- 天岩戸は本当に高千穂にある？ 年に一度、33番すべてを舞う夜神楽の謎（推奨）
- 天照大神は卑弥呼だったのか？ 天岩戸神話と「卑弥呼の日食」をハビ判事が検証
- 太陽が消えた日――高千穂の夜神楽が伝える天岩戸神話の正体

## 概要欄

2026年11月22日・23日。宮崎県高千穂町の高千穂神社で、年に一度だけ、2日間をかけて夜神楽の33番がすべて舞われます。
太陽の神・天照大神が岩屋に隠れた天岩戸神話。その岩戸を御神体とする神社がある一方で、古事記と日本書紀はこの出来事を高千穂の話としては書いていません。天岩戸は本当に高千穂にあるのか。太陽が隠れた神話は、卑弥呼の時代の日食の記憶なのか。
国立天文台の研究者による古代の日食の計算、2025年にユネスコ無形文化遺産の提案候補に選ばれた「神楽」の最新の動き、担い手不足の中で舞を受け継ぐ人々まで、資料と報道をもとに、10の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。

▼チャプター
{chap}

▼参考資料
・高千穂の夜神楽（観光庁 多言語解説文データベース）https://www.mlit.go.jp/tagengo-db/R1-01021.html
・令和8年度 高千穂の夜神楽日程表（高千穂町）https://www.town-takachiho.jp/top/soshiki/kikakukanko/2/5/1596.html
・夜神楽について（高千穂町）https://www.town-takachiho.jp/top/kanko_bunka/yokagura/804.html
・天岩戸神社 公式サイト https://amanoiwato-jinja.jp/
・谷川清隆・相馬充「七世紀以前の日食記録と地球の自転」ほか（日本天文学会 2010年秋季年会）https://stg.asj.or.jp/nenkai/archive/2010a/pdf/L18a.pdf
・谷川清隆・相馬充（国立天文台報、2012年）https://www.nao.ac.jp/contents/about/reports/report-naoj/14-34-1.pdf
・無形文化遺産の新規提案候補「神楽」（文化庁、2025年11月）https://www.bunka.go.jp/koho_hodo_oshirase/pdf/94306301_01.pdf
・神楽継承・振興知事連合（宮崎県）https://www.pref.miyazaki.lg.jp/miyazaki-bunkashinko/kanko/bunka/20250327155045.html
・子ども伝承の集い（UMKテレビ宮崎、2026年2月）https://www.umk.co.jp/news/?date=20260223&id=31769

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
地図：Mapzen Terrain Tiles（SRTM ほか）の標高データをもとに作成
写真・資料（Wikimedia Commons ほか）
{credits}
写真ごとの出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-takachiho/写真クレジット一覧.md

#高千穂 #夜神楽 #天岩戸 #天照大神 #卑弥呼 #神話 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
