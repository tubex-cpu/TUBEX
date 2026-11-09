"""マチュピチュ判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_machu.py"""
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
CHAP = ['密林の下に、日本のレーザー', 'ハビ判事、開廷', '壁に残された1902年の名前', '本当の名前は？', '要塞か、離宮か', '骨が示した年代', '太陽の処女の伝説', '遺伝子が語る住人たち', 'スペイン人は知っていた？', '地面の下の秘密', '福島とマチュピチュの縁', '密林の下の「候補」', '天空の都市の本当の物語', '残された謎', '10の判決', '閉廷']
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
(ROOT / '台本_マチュピチュ判決.txt').write_text(f'ハビ判事 台本：マチュピチュ判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
credits_full = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
(ROOT / '写真クレジット一覧.md').write_text('# マチュピチュ判決：写真・資料のクレジット（登場順・すべて Wikimedia Commons ほか）\n\n' + credits_full + '\n')

# 概要欄は5000字までなので、写真のクレジットはライセンスごとに撮影者・作者名をまとめる
import json, collections
cj = json.loads((ROOT / 'public/photos/credits.json').read_text())
NAME = {
    'Nankou Oronain (as36…': 'Nankou Oronain', 'ja:User:Sanjo': 'Sanjo',
    'そらみみ (Soramimi)': 'そらみみ', 'Gary Todd from Xinzheng, China': 'Gary Todd', 'Gary Lee Todd, Ph.D.': 'Gary Todd',
    'Hot cake syrup (talk)': 'Hot cake syrup', 'Original file is made by Ksiom, modified by Pekachu.': 'Ksiom, Pekachu',
    'Korea.net / Korean Culture and Information Service (Jeon Han)': 'Korea.net（Jeon Han）',
    'ウィキ太郎 (Wiki Taro)': 'ウィキ太郎', 'MODIS Land Rapid Response Team, NASA GSFC': 'NASA',
}
PD_WORKS = ('ハイラム・ビンガムの1911〜1912年の調査写真、グアマン・ポマの絵、ナショナル ジオグラフィック1913年4月号 ほか')
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

md = f'''# YouTube 投稿用テキスト：マチュピチュ判決

## タイトル案

- マチュピチュは何のための都市だった？ 日本のレーザーが密林の下に見つけた"もう一つの姿"（推奨）
- マチュピチュの「発見者」はビンガムではない？ 10の通説をハビ判事が検証
- マチュピチュの本当の名前と住人――骨と遺伝子、そして福島の会社のレーザーが語ること

## 概要欄

南米ペルー、標高およそ2430mの尾根に眠る石の都市・マチュピチュ。1911年にアメリカの探検家ハイラム・ビンガムが「発見した」とされてきたこの遺跡は、本当に失われた都市だったのか。
ビンガムより前に壁に残されていた「1902年」の名前。インカ時代の本当の名前は「ワイナピチュ」だった可能性。骨の放射性炭素年代が示した1420年ごろという年代。そして2023年の遺伝子の研究が明らかにした、帝国中から集められた住人たち。
さらに2026年3月、福島県の測量会社ふたばとJICA、ペルー文化省が、ドローンに積んだレーザーで密林の下を調べ、段々畑の全体像と、いくつもの「遺構の候補」を見つけました。なぜ福島の会社だったのか――その裏には、マチュピチュ村の初代村長となった福島出身の日本人、野内与吉との縁がありました。
論文と公式発表をもとに、10の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。「分かったこと」と「まだ候補の段階のこと」を分けて判定します。

▼チャプター
{chap}

▼参考資料
・マチュピチュ遺跡でUAV-LiDAR調査、遺構候補を確認（JICA、2026年3月30日）https://prtimes.jp/main/html/rd/p/000000040.000151049.html
・マチュピチュの周辺で2.5km以上のインカ道を確認（ペルー文化省／Andina、2026年8月）https://andina.pe/ingles/noticia-peru-25-km-of-inca-trail-identified-in-machu-picchu-archaeological-park-1086970.aspx
・Burger, Salazar, Nesbitt ほか「New AMS dates for Machu Picchu」Antiquity（2021年）https://doi.org/10.15184/aqy.2021.99
・Salazar ほか「Insights into the genetic histories and lifeways of Machu Picchu's occupants」Science Advances（2023年）https://pmc.ncbi.nlm.nih.gov/articles/PMC11318671
・Amado Gonzales & Bauer「The Ancient Inca Town Named Huayna Picchu」Ñawpa Pacha（2022年）https://indigo.uic.edu/articles/journal_contribution/The_Ancient_Inca_Town_Named_Huayna_Picchu/22577419
・Rowe「Machu-Picchu a la luz de documentos del siglo XVI」Histórica（1990年）https://revistas.pucp.edu.pe/index.php/historica/article/view/8813
・Machu Picchu older than expected（Yale News、2021年）https://news.yale.edu/2021/08/04/machu-picchu-older-expected-study-reveals
・ビンガムが撮影したリサラガの書き込み（Andina）https://andina.pe/agencia/noticia-fotografia-hiram-bingham-evidencia-escrito-agustin-lizarraga-1902-machu-picchu-370573.aspx
・Kenneth Wright へのインタビュー（PBS NOVA）https://www.pbs.org/wgbh/nova/machupicchu/wright.html
・野内与吉（東京大学総合研究博物館）https://www.um.u-tokyo.ac.jp/web_museum/ouroboros/v19n3/v19n3_nouchi.html
・マチュピチュ村との友好都市（福島県）https://www.pref.fukushima.lg.jp/sec/11055c/ootamavillhost.html

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
地図：Mapzen Terrain Tiles（SRTM ほか）の標高データをもとに作成
写真・資料（Wikimedia Commons ほか）
{credits}
写真ごとの出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-machu/写真クレジット一覧.md

#マチュピチュ #インカ帝国 #ペルー #世界遺産 #考古学 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
