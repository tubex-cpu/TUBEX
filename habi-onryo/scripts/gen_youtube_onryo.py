"""日本三大怨霊判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_onryo.py"""
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
CHAP = ['将門塚、2026年夏の夜', 'ハビ判事、開廷', '反逆者か、英雄か', '新皇と道真の霊', '俵藤太と将門の最期', '笑う首', '空を飛ぶ首', '大手町の祟り', 'GHQのブルドーザー', '2026年の書類送検', '神田明神と将門', '成田山の言い伝え', '遣唐使と道真', '道真は無実だったか', '時平の死', '清涼殿の落雷', '国宝の絵巻の地獄', '学問の神の誕生', '動かない牛', '飛梅と124年ぶりの改修', '叔父子の噂', '保元の乱', '血で書いた呪い？', '讃岐での最期', '西行の旅', '天狗になった上皇', '怨霊の始まり', '明治天皇と白峯神宮', '東京五輪の慰霊？', 'スポーツの神の秘密', '三大怨霊は昔から？', '御霊信仰', '祇園祭のはじまり', '怨霊の本当の物語', '残された謎', '31の判決', '閉廷']
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
(ROOT / '台本_日本三大怨霊判決.txt').write_text(f'ハビ判事 台本：日本三大怨霊判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
credits_full = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
(ROOT / '写真クレジット一覧.md').write_text('# 日本三大怨霊判決：写真・資料のクレジット（登場順・すべて Wikimedia Commons ほか）\n\n' + credits_full + '\n')

# 概要欄は5000字までなので、写真のクレジットはライセンスごとに撮影者・作者名をまとめる
import json, collections
cj = json.loads((ROOT / 'public/photos/credits.json').read_text())
NAME = {
    'myself': 'Ryuch', 'Ismoon (talk) 16:56, 12 May 2021 (UTC)': 'Ismoon',
    'Göhring, Herman ; Mondejar, [?]': 'Herman Göhring', 'Scott Umstattd scott_umstattd': 'Scott Umstattd', 'John Kutcher jmkutcher': 'John Kutcher', 'Preben Nilsen (@prebz22) on Unsplash': 'Preben Nilsen', 'Felipe Guamán Poma de Ayala (1616)': 'Felipe Guamán Poma de Ayala', 'David Berkowitz from New York, NY, USA': 'David Berkowitz', 'Jorge Láscar from Australia': 'Jorge Láscar', 'McKay Savage from London, UK': 'McKay Savage',
    'Nankou Oronain (as36…': 'Nankou Oronain', 'ja:User:Sanjo': 'Sanjo',
    'そらみみ (Soramimi)': 'そらみみ', 'Gary Todd from Xinzheng, China': 'Gary Todd', 'Gary Lee Todd, Ph.D.': 'Gary Todd',
    'Hot cake syrup (talk)': 'Hot cake syrup', 'Original file is made by Ksiom, modified by Pekachu.': 'Ksiom, Pekachu',
    'Korea.net / Korean Culture and Information Service (Jeon Han)': 'Korea.net（Jeon Han）',
    'ウィキ太郎 (Wiki Taro)': 'ウィキ太郎', 'MODIS Land Rapid Response Team, NASA GSFC': 'NASA',
}
PD_WORKS = ('浮世絵・絵巻・古写真（月岡芳年、歌川国貞、歌川国芳、歌川広重、楊洲周延、北野天神縁起絵巻、保元平治合戦図屏風、年中行事絵巻、土佐光起、俵屋宗達、鳥居龍蔵 ほか）')
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

md = f'''# YouTube 投稿用テキスト：日本三大怨霊判決

## タイトル案

- 【日本三大怨霊】その祟りは本当にあったのか？ 古い記録に残された意外な事実（推奨）
- 【日本三大怨霊】首が飛び、雷が落ちた…祟りの話は本当なのか
- 【日本三大怨霊】祟りは本当にあったのか？ 残された記録が語ること

（サムネ「なぜ敗者を神にした？」と役割を分ける。タイトルは答えや判決を書かず、「伝説の裏の記録」で続きを見たくさせる。「ハビ判事が検証」は入れない）

## 概要欄

戦いで討たれた平将門。大宰府へ左遷された菅原道真。讃岐へ流された崇徳上皇。
争いに敗れた3人は「怨霊」と恐れられ、首が空を飛んだ、雷となって天皇の住まいを襲った、血で呪いの言葉を書いた――と語り継がれてきました。
それなのに日本人は、恐れたはずの3人を、神田明神、北野天満宮・太宰府天満宮、白峯神宮の神として手厚く祀ってきました。なぜ敗者は神になったのか。
平安時代の貴族の日記、2026年に初めて全巻が公開された国宝『北野天神縁起絵巻』、124年ぶりの大改修を終えた太宰府天満宮、そして史料を読み直してきた研究者の成果をもとに、伝説と記録を分けながら、31の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。

▼チャプター
{chap}

▼参考資料
・山田雄司『怨霊とは何か 菅原道真・平将門・崇徳院』（中公新書、2014年）
・山田雄司『崇徳院怨霊の研究』（思文閣出版、2001年）
・史蹟将門塚保存会・神田明神の由緒
・国税庁ホームページ「将門塚」の紹介
・京都国立博物館 特別展「北野天神」（2026年）https://www.kyohaku.go.jp/jp/exhibitions/special/2026_kitano/
・太宰府天満宮 御本殿の参拝再開（TNC、2026年9月）https://news.tnc.co.jp/news/articles/NID2026092132138
・白峯神宮の由緒
・『将門記』『太平記』『日本紀略』『保元物語』『古事談』『雨月物語』ほか

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
地図：Mapzen Terrain Tiles（SRTM ほか）の標高データをもとに作成
写真・資料（Wikimedia Commons ほか）
{credits}
写真ごとの出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-onryo/写真クレジット一覧.md

#日本三大怨霊 #平将門 #菅原道真 #崇徳上皇 #将門塚 #怨霊 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
