"""縄文1万年判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_jomon.py"""
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
CHAP = ['吹雪の夜の竪穴住居', 'ハビ判事、開廷', '1万6000年前の土器のかけら', '世界最古の土器はどこに', '1万年、同じ暮らし？', '縄文は文明か', '狩りの民？', '同じ場所に住み続けた人々', 'クリの花粉', 'フラスコ形の穴', '1万2600年前の漆', '8000年前の女性の遺伝子', '氷河期の祖先の体', '鬼界カルデラの大噴火', '骨に残る争いの跡', '平和主義という言葉', 'ヒスイと黒曜石の道', '堀と柵の村', '遮光器土偶の目', '壊れた土偶', '抜かれた前歯', 'ストーンサークルと夏至の太陽', '減っていく人の数', '4200年前の寒さ', '長崎の弥生人の遺伝子', 'いまの日本人の中の縄文', '縄文1万年の本当の物語', '残された謎', '24の判決', '閉廷']
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
(ROOT / '台本_縄文1万年判決.txt').write_text(f'ハビ判事 台本：縄文1万年判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
credits_full = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
(ROOT / '写真クレジット一覧.md').write_text('# 縄文1万年判決：写真・資料のクレジット（登場順・すべて Wikimedia Commons ほか）\n\n' + credits_full + '\n')

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
    'Ismoon (talk) (merci Gaspard !)': 'Ismoon', 'Ismoon (talk) (merci Gaspard)': 'Ismoon', 'Ismoon (talk)': 'Ismoon', 'harum.koh from Kobe city, Japan': 'harum.koh', 'Kuru man from Japan': 'Kuru man', 'Raita Futo from Tokyo, Japan': 'Raita Futo',
    'photo: Qurren (talk) Taken with Canon IXY 10S (Digital IXUS 210)': 'Qurren', 'Original uploader was Nnn at ja.wikipedia': 'Nnn', 'Creative Tools from Halmdstad, Sweden': 'Creative Tools', 'nobu3withfoxy from Iga,Mie, Japan': 'nobu3withfoxy', 'Stiller Beobachter from Ansbach, Germany': 'Stiller Beobachter',
}
PD_WORKS = ('古い学術図・記録写真（東木龍七の縄文海進の図 1926年、吉胡貝塚の大正期の発掘写真 ほか）')
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

md = f'''# YouTube 投稿用テキスト：縄文1万年判決

## タイトル案

- 【縄文の謎】1万年続いた縄文の暮らしはなぜ終わったのか 最新DNAが語る（決定）
- 【縄文人】争いの跡はわずか1.8% 1万年続いた暮らしはなぜ終わったのか
- 【縄文時代】縄文人は消えたのか 2026年の遺伝子研究が語る1万年の暮らし

（決定サムネ ①「1万年続いた縄文文化／消滅させたのは何？」②「平和主義の縄文人／1万年もの間／なぜ争わなかった？」③「速報 縄文人のDNA／遺伝子が語る／1万年も生き延びた理由」と役割を分ける。「ハビ判事が検証」「最新AI」は入れない）

## 概要欄

電気もガスもない。米も、鉄も、文字もない。それでも縄文の人々は、1万年以上も暮らし続けました。全国の縄文人の骨を調べると、争って亡くなった跡は驚くほど少ない。
ところが、およそ3000年前、縄文の人々の数は大きく減っていきます。1万年続いた暮らしは、なぜ終わったのか。寒さか、飢えか、それとも海を渡ってきた人々か。そして縄文人は、本当に消えてしまったのか。
2026年、8000年以上前の縄文の女性の遺伝子（金沢大学など）、縄文人42人の遺伝子（東京大学など）、鬼界カルデラの大噴火を生き延びた人々の記録（九州大学など）が相次いで発表されました。最新の研究をもとに、24の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。

▼チャプター
{chap}

▼参考資料
・Ishiya ほか「縄文早期と弥生の高精度ゲノム」PNAS 2026年（金沢大学など）https://pmc.ncbi.nlm.nih.gov/articles/PMC13416418/
・縄文人42人のゲノムと寒さへの適応 Science Advances 2026年（東京大学など）https://pmc.ncbi.nlm.nih.gov/articles/PMC13464473/
・Crema ほか 鬼界アカホヤ噴火と縄文の人口 Science Advances 2026年 https://pmc.ncbi.nlm.nih.gov/articles/PMC13665937/
・長崎県の弥生人4人のゲノム Scientific Reports 2026年 https://pmc.ncbi.nlm.nih.gov/articles/PMC12873284/
・Watanabe ほか Y染色体からみた縄文の人口 Scientific Reports 2019年 https://doi.org/10.1038/s41598-019-44473-z
・Liu ほか 現代日本人の祖先の割合 Science Advances 2024年 https://pmc.ncbi.nlm.nih.gov/articles/PMC11023554/
・Nakao ほか 縄文時代の暴力の跡 Biology Letters 2016年 https://doi.org/10.1098/rsbl.2016.0028
・Crema ほか 縄文の人口の増減 PLOS ONE 2016年 https://pmc.ncbi.nlm.nih.gov/articles/PMC4851332/
・吉川昌伸「クリ花粉の散布と三内丸山遺跡周辺のクリ林」植生史研究 2011年 https://doi.org/10.34596/hisbot.18.2_65

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
写真ごとの出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-jomon/写真クレジット一覧.md

#縄文時代 #縄文人 #土偶 #三内丸山遺跡 #DNA #日本の歴史 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
