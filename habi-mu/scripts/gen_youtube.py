# テンプレート（仁徳天皇陵判決のもの）。新しい動画では habi-<題材>/scripts/ にコピーし、場面・素材・文言を書き換えて使う。
# 使い方: python3 gen_youtube.py habi-<題材>
# ムー大陸判決：youtube.md と 時刻入り台本を作る
import re, sys
root = sys.argv[1]
src0 = open(f'{root}/scripts/build-voice.py').read()
order = eval(src0[src0.index('IDS = ') + 6:src0.index(']', src0.index('IDS = ')) + 1])
tl = open(f'{root}/src/data/timeline.ts').read()
T = int(re.search(r'TRANSITION_FRAMES = (\d+)', tl).group(1))
d = {k: int(v) for k, v in re.findall(r'\t(\w+): (\d+),', tl)}
total = int(re.search(r'TOTAL_FRAMES = (\d+)', tl).group(1))
starts, t = [], 0
for k in order:
    starts.append(t); t += d[k] - T
def mmss(f):
    s = int(f / 30); return f'{s // 60}:{s % 60:02d}'
lines = open(f'{root}/scripts/script.txt').read().splitlines()
titles = [l[5:] for l in lines if l.startswith('0:00 ')]
# チャプター名：短く、答えを言わずに引っかかる言い方にする（場面の並びは IDS と同じ）
CHAP = ['6400万人が消えた夜', 'ハビ判事、開廷', '「ムー」はいつ生まれた？', 'マヤの本に書かれていたこと', '女王ムーの航海', '6400万人の大陸', '誰も見ていない粘土板',
        '海の上の石の都', '墓を暴いた男', '海底のプラチナの棺', 'モアイが見ているもの', 'モアイは歩いた', '海を渡ってきた人々', '島は自ら滅んだのか',
        '海底の階段', '上陸禁止の島', '地図から消された島', '科学者が信じた大陸', '海の底をのぞく', '次に沈むのは日本？', '本当に沈んでいた大陸', '誰にも読めない文字', '18の判決', '閉廷']
assert len(CHAP) == len(starts)
chap = '\n'.join(f'{mmss(s)} {ti}' for s, ti in zip(starts, CHAP))
# 時刻入り台本
out, i = [], 0
for l in lines:
    if l.startswith('0:00 '):
        out.append(f'\n■ {mmss(starts[i])} {l[5:]}'); i += 1
    else:
        out.append(l)
dur = mmss(total)
open(f'{root}/台本_ムー大陸判決.txt', 'w').write(f'ハビ判事 台本：ムー大陸判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur.replace(":", "分")}秒。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', open(f'{root}/src/scenes/{sc}.tsx').read()):
        if x not in ids: ids.append(x)
ph = open(f'{root}/src/data/photos.ts').read()
cred = {m.group(1).strip("'"): m.group(2) for m in re.finditer(r"\t('?[\w-]+'?): \{file: '[\w-]+\.jpg', credit: '([^']+)'", ph)}
credits = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
md = f'''# YouTube 投稿用テキスト：ムー大陸判決

## タイトル案

- 【1時間】ムー大陸は本当に沈んだのか？ 6400万人が消えた大陸の証拠を、ひとつずつ裁く（推奨・サムネ①「上陸禁止の魔境／呪われた幻の大陸／『ムー大陸』の真実」と対）
- ムー大陸の「証拠」を全部確かめたら、出てきたのは本当に沈んでいた別の大陸だった【1時間】
- 呪われた石の都、歩くモアイ、海底の階段。ムー大陸の謎を証拠だけで裁く【1時間】

## 概要欄

1万2000年前、太平洋のまんなかで、6400万人が暮らす大陸が一夜で海に沈んだ。
映画や雑誌で語り継がれてきた「ムー大陸」。でも、その名前が生まれたのは、たった160年前のことでした。

ムーの都とされた南の海の石の都、墓を暴いた男の死、海底に眠るというプラチナの棺、海に背を向けるモアイ、沖縄の海の底の階段、上陸禁止の島、地図から消された島。
2025年に発表された「モアイは歩いた」という研究など、最新の調査をもとに、18の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。

そして、証拠を追いかけた先には、本当に海の下に眠る大陸がありました。

▼チャプター
{chap}

▼参考資料
・Churchward, J. "The Lost Continent of Mu, the Motherland of Man"（1926年）
・Mu (mythical lost continent)（Wikipedia）https://en.wikipedia.org/wiki/Mu_(mythical_lost_continent)
・De Landa alphabet（Wikipedia）https://en.wikipedia.org/wiki/De_Landa_alphabet
・Yuri V. Knorozov（ノースカロライナ大学図書館 展示）https://exhibits.lib.unc.edu/exhibits/show/maya/decipherment/sistema-pisma-drevnikh-maiia
・McCoy, M. D. ほか（2016）ナン・マドールの年代測定（Quaternary Research／ScienceDaily）https://www.sciencedaily.com/releases/2016/10/161018132620.htm
・Nan Madol: Ceremonial Centre of Eastern Micronesia（UNESCO 世界遺産）https://whc.unesco.org/en/list/1503
・Lipo, C. P. & Hunt, T. L.（2025）The walking moai hypothesis（Journal of Archaeological Science 183）https://experts.arizona.edu/en/publications/the-walking-moai-hypothesis-archaeological-evidence-experimental-/
・Hunt, T. L. & Lipo, C. P.（2006）ラパ・ヌイの移住年代（Science／ハワイ大学）https://www.hawaii.edu/news/article.php?aId=1364
・Polynesian Voyaging Society（ホクレア号 1976年の航海）https://archive.hokulea.com/holokai/1976/ben_finney.html
・与那国島海底地形（琉球新報）https://ryukyushimpo.jp/news/entry-5207408.html
・「神宿る島」宗像・沖ノ島と関連遺産群 https://www.crossroadfukuoka.jp/spot/10242
・Sandy Island（NPR, 2013）https://www.npr.org/sections/krulwich/2013/03/13/174203234/pacific-island-bigger-than-manhattan-vanishes
・Lemuria（Wikipedia）https://en.wikipedia.org/wiki/Lemuria
・Mortimer, N. ほか（2017）Zealandia: Earth's Hidden Continent（GSA Today 27(3)）https://rock.geosociety.org/gsatoday/archive/27/3/abstract/GSATG321A.1.htm
・Walker, J. ほか（2020）ストレッガ津波とドッガーランド（Antiquity／ブラッドフォード大学）https://www.bradford.ac.uk/news/archive/2020/doggerland-tsunami.php
・Ferrara, S. ほか（2024）ロンゴロンゴの年代測定（Scientific Reports）https://doaj.org/article/05029bdd384945ef8acb67bd5593e39f
・庄子大亮『アトランティス＝ムーの系譜学』（講談社、2022年）
・地震調査研究推進本部（長期評価）https://www.jishin.go.jp/

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
写真・資料（Wikimedia Commons。登場順）
{credits}

#ムー大陸 #都市伝説 #ミステリー #モアイ #ナンマドール #ハビ判事
'''
open(f'{root}/youtube.md', 'w').write(md)
print(chap); print(len(ids), dur)
