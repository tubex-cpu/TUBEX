"""卑弥呼の鏡判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_kagami.py"""
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
CHAP = ['棺を囲んだ33枚の鏡', 'ハビ判事、開廷', '銅鏡百枚の詔書', '238年か、239年か', '鏡を運んだのは誰か', '景初三年の鏡', '正始元年の鏡', 'この世にない年号', '数が合わない', '本場の中国からは', '鏡に刻まれた故郷', '鉛が語ること', '中国製か、日本製か', '黒塚古墳の石の部屋', '棺の中の1枚', '出どころの分からない鏡', '作られてから墓に入るまで', '光を当てると浮かぶ絵', '神としての鏡', '全国に散らばる兄弟の鏡', '鏡を配った王', '卑弥呼の墓の鏡', '箸墓古墳の年代', '纒向の大きな町', '日本最大の鏡', '吉野ヶ里の王の墓', '2026年 特別展「卑弥呼の鏡」', '鏡と邪馬台国の本当の物語', '残された謎', '25の判決', '閉廷']
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
(ROOT / '台本_卑弥呼の鏡判決.txt').write_text(f'ハビ判事 台本：卑弥呼の鏡判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
credits_full = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
(ROOT / '写真クレジット一覧.md').write_text('# 卑弥呼の鏡判決：写真・資料のクレジット（登場順・すべて Wikimedia Commons ほか）\n\n' + credits_full + '\n')

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
    'photo: Qurren (talk) Taken with Canon IXY 10S (Digital IXUS 210)': 'Qurren', 'Original uploader was Nnn at ja.wikipedia': 'Nnn', 'Creative Tools from Halmdstad, Sweden': 'Creative Tools', 'nobu3withfoxy from Iga,Mie, Japan': 'nobu3withfoxy', 'Stiller Beobachter from Ansbach, Germany': 'Stiller Beobachter',
}
PD_WORKS = ('古典籍・浮世絵（三国志 魏書 東夷伝 倭人条、日本書紀 田中本、魚屋北渓 ほか）')
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
ORDER = ['CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY-SA 2.0', 'CC BY 4.0', 'CC BY 3.0', 'CC BY 2.5', 'CC BY 2.0']
missing = {v['license'] for k, v in cj.items() if k in ids} - set(ORDER) - {'Public domain', 'CC0', 'オリジナル'}
assert not missing, missing
lines = [f'{l}：' + '、'.join(by[l]) for l in ORDER if by[l]]
lines.append('パブリックドメイン・CC0：' + PD_WORKS + ('、写真：' + '、'.join(dict.fromkeys(pd)) if pd else ''))
credits = '\n'.join(lines)

md = f'''# YouTube 投稿用テキスト：卑弥呼の鏡判決

## タイトル案

- 【邪馬台国】卑弥呼の鏡の数が合わない 女王の国は本当に奈良にあったのか（推奨）
- 【卑弥呼の鏡】100枚のはずが500枚以上 三角縁神獣鏡と邪馬台国の謎
- 【三角縁神獣鏡】この世にない年号が刻まれた鏡 卑弥呼の鏡は本物か

（確定サムネ「卑弥呼の鏡100枚→500枚？／本物なら／邪馬台国の場所が決まる？」と役割を分ける。サムネは数の食い違い、タイトルは邪馬台国の場所。「ハビ判事が検証」「最新AI」は入れない）

## 概要欄

魏志倭人伝によれば、邪馬台国の女王・卑弥呼は、魏の皇帝から「銅鏡百枚」を贈られました。
その鏡だと言われてきた三角縁神獣鏡は、日本の古墳から500枚以上見つかっています。百枚のはずが、500枚以上。しかも本場の中国からは確かな出土がなく、この世に存在しない年号「景初四年」を刻んだ鏡まであります。
三角縁神獣鏡は奈良を中心に見つかり、邪馬台国は奈良にあったという説の大きな根拠になってきました。もし卑弥呼の鏡でないとしたら、邪馬台国の場所はどうなるのか。
2026年秋の九州国立博物館の特別展「卑弥呼の鏡」、2026年1月の天理参考館と奈良市の発表、箸墓古墳の最新の調査などをもとに、25の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。

▼チャプター
{chap}

▼参考資料
・特別展「卑弥呼の鏡」（九州国立博物館）https://www.kyuhaku.jp/exhibition/exhibition_s78.html
・富雄丸山古墳の鏡の出土地の発表（天理参考館 2026年1月30日）https://sankokan.jp/topix/20260130press-release
・富雄丸山古墳 造出し埋葬施設の棺内の鏡（奈良市 2025年7月30日）https://www.city.nara.lg.jp/soshiki/3/244300.html
・富雄丸山古墳の発掘調査（奈良市）https://www.city.nara.lg.jp/soshiki/3/259122.html
・村上隆「『三角縁神獣鏡』にみる『魔鏡現象』」化学と教育 64巻5号（2016年）https://www.jstage.jst.go.jp/article/kakyoshi/64/5/64_242/_article/-char/ja/
・三角縁神獣鏡の研究（科学研究費助成事業 成果報告）https://kaken.nii.ac.jp/file/KAKENHI-PROJECT-25284161/25284161seika.pdf
・陳寿『三国志』魏書 東夷伝 倭人条（魏志倭人伝）

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
サムネイル：画像生成AI（OpenAI）で制作
地図：Mapzen Terrain Tiles（SRTM ほか）の標高データをもとに作成
写真・資料（Wikimedia Commons ほか）
{credits}
写真ごとの出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-kagami/写真クレジット一覧.md

#卑弥呼 #邪馬台国 #三角縁神獣鏡 #魏志倭人伝 #黒塚古墳 #箸墓古墳 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
