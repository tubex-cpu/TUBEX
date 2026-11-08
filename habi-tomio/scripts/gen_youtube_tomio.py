"""富雄丸山古墳判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_tomio.py"""
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
CHAP = ['人の背丈を超える剣', 'ハビ判事、開廷', '日本最大の古墳？', '86mと思われていた古墳', '戦うための剣ではない？', '蛇行剣はどこで生まれた', '日本で初めての盾形の鏡', '1600年前の木の棺', '数百年前の中国の鏡', '墓の主は女性？', '天理の鏡の謎', '巨大な剣が語ること', '残された3つの謎', '9の判決', '閉廷']
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
(ROOT / '台本_富雄丸山古墳判決.txt').write_text(f'ハビ判事 台本：富雄丸山古墳判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
credits_full = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
(ROOT / '写真クレジット一覧.md').write_text('# 富雄丸山古墳判決：写真・資料のクレジット（登場順・すべて Wikimedia Commons ほか）\n\n' + credits_full + '\n')

# 概要欄は5000字までなので、写真のクレジットはライセンスごとに撮影者・作者名をまとめる
import json, collections
cj = json.loads((ROOT / 'public/photos/credits.json').read_text())
NAME = {
    'そらみみ (Soramimi)': 'そらみみ', 'Gary Todd from Xinzheng, China': 'Gary Todd', 'Gary Lee Todd, Ph.D.': 'Gary Todd',
    'Hot cake syrup (talk)': 'Hot cake syrup', 'Original file is made by Ksiom, modified by Pekachu.': 'Ksiom, Pekachu',
    'Korea.net / Korean Culture and Information Service (Jeon Han)': 'Korea.net（Jeon Han）',
    'ウィキ太郎 (Wiki Taro)': 'ウィキ太郎', 'MODIS Land Rapid Response Team, NASA GSFC': 'NASA',
}
PD_WORKS = ('東京国立博物館などの所蔵品の写真 ほか')
by = collections.defaultdict(list)
pd = []
for i in ids:
    v = cj[i]
    lic = v['license']
    if lic in ('Public domain', 'CC0'):
        if lic == 'CC0':
            pd.append(NAME.get(v['artist'], v['artist']))
        continue
    n = NAME.get(v['artist'], v['artist'])
    if n not in by[lic]:
        by[lic].append(n)
ORDER = ['CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY-SA 2.0', 'CC BY 4.0', 'CC BY 3.0', 'CC BY 2.0']
lines = [f'{l}：' + '、'.join(by[l]) for l in ORDER if by[l]]
lines.append('パブリックドメイン・CC0：' + PD_WORKS + ('、写真：' + '、'.join(dict.fromkeys(pd)) if pd else ''))
credits = '\n'.join(lines)

md = f'''# YouTube 投稿用テキスト：富雄丸山古墳判決

## タイトル案

- 巨大な剣は何のため？ 富雄丸山古墳の出土品をハビ判事が検証（推奨）
- 富雄丸山古墳は誰の墓？ 巨大蛇行剣と鏡から、どこまで分かるのか
- 富雄丸山古墳の謎――出土した事実と、まだ言えないこと

## 概要欄

奈良市の丘の上にある、直径109mの日本最大の円墳・富雄丸山古墳。2023年1月、この古墳から、鉄の部分だけで長さ2m37cm（鞘に納めると2m85cm）の巨大な蛇行剣と、日本で初めての盾形銅鏡が見つかりました。
人の背丈を超える剣は、何のために作られたのか。なぜ、墓の主の棺の中ではなく、棺を包む粘土の中に置かれていたのか。そして、棺の中に眠っていたのは誰なのか。
棺の中から見つかった3面の中国の鏡、2026年4月に始まった木の棺の保存と研究、2026年1月に発表された天理参考館の三角縁神獣鏡の調査まで、公式発表と研究者の見解をもとに、9の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。
「分かったこと」と「まだ言えないこと」を分けて判定します。

▼チャプター
{chap}

▼参考資料
・富雄丸山古墳から蛇行剣・鼉龍文盾形銅鏡が出土（奈良市、2023年1月25日）https://www.city.nara.lg.jp/soshiki/3/200017.html
・富雄丸山古墳出土蛇行剣の共同調査研究成果と特別公開（奈良県立橿原考古学研究所・奈良市教育委員会、2024年3月）https://www.kashikoken.jp/under_construction/wp-content/uploads/2024/03/dakouken_press.pdf
・富雄丸山古墳発掘調査（第7次調査）について（奈良市、2024年3月13日）https://www.city.nara.lg.jp/soshiki/3/200024.html
・富雄丸山古墳 第7次調査 第3報（奈良市、2025年1月27日）https://www.city.nara.lg.jp/soshiki/3/226878.html
・木棺内出土鏡の調査成果（奈良市、2025年7月30日）https://www.city.nara.lg.jp/soshiki/3/244300.html
・天理参考館所蔵「伝富雄丸山古墳出土」三角縁神獣鏡の調査（奈良市・天理参考館、2026年1月30日）https://www.city.nara.lg.jp/soshiki/3/259122.html
・富雄丸山古墳の木棺の保存処理と共同研究（日本経済新聞、2026年4月）https://www.nikkei.com/article/DGXZQOUF159ZZ0V10C26A4000000/
・大和富雄丸山古墳出土品（文化遺産オンライン）https://online.bunka.go.jp/heritages/detail/134894
・島内地下式横穴墓群出土品（文化遺産オンライン）https://online.bunka.go.jp/heritages/detail/223278
・富雄丸山古墳の驚きとひみつ（奈良県観光公式）https://yamatoji.nara-kankou.or.jp/page/page_62.html
・被葬者についての研究者の見解（TBS「報道特集」の記事、2025年）https://news.yahoo.co.jp/articles/f4058dd4d3f410bda091927833a6bed386f2b341

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
地図：Mapzen Terrain Tiles（SRTM ほか）の標高データをもとに作成
写真・資料（Wikimedia Commons ほか）
{credits}
写真ごとの出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-tomio/写真クレジット一覧.md

#富雄丸山古墳 #蛇行剣 #古墳 #奈良 #考古学 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
