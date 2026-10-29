# テンプレート（仁徳天皇陵判決のもの）。新しい動画では habi-<題材>/scripts/ にコピーし、場面・素材・文言を書き換えて使う。
# 使い方: python3 gen_youtube.py habi-<題材>
# 仁徳天皇陵：youtube.md と 時刻入り台本を作る
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
CHAP = ['誰も確かめていない墓', 'ハビ判事、開廷', '「世界最大の墓」は本当か', 'のべ680万人の大工事', '古代の堺は工業地帯？',
        '埴輪は、いけにえの身代わり？', '周りの古墳に眠るのは家来？', '眠るのは、仁徳天皇か', '生きているうちに造った墓？',
        '倭の王は、皇帝の家来？', '天皇陵の名前は、誰が決めた？', '明治、一度だけ開いた墓', '宝は、なぜアメリカに？',
        '150年、行方不明の宝', '立入禁止の墓に入った日', '消えた古墳たち', '世界遺産で、発掘は進んだ？', '1500年前の本当の姿',
        'ついに動いた国の調査', '残された3つの謎', '16の判決', '閉廷']
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
open(f'{root}/台本_仁徳天皇陵判決.txt', 'w').write(f'ハビ判事 台本：仁徳天皇陵判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur.replace(":", "分")}秒。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', open(f'{root}/src/scenes/{sc}.tsx').read()):
        if x not in ids: ids.append(x)
ph = open(f'{root}/src/data/photos.ts').read()
cred = {m.group(1).strip("'"): m.group(2) for m in re.finditer(r"\t('?[\w-]+'?): \{file: '[\w-]+\.jpg', credit: '([^']+)'", ph)}
credits = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
md = f'''# YouTube 投稿用テキスト：仁徳天皇陵判決

## タイトル案

- 【立入禁止】仁徳天皇陵に眠るのは誰か？ ついに動いた国の調査【1時間】（推奨・決定サムネと対）
- 仁徳天皇陵に、仁徳天皇は眠っていない？ 1500年閉ざされた墓と2026年の新調査【1時間】
- 立入禁止の巨大古墳、本当の主は誰だ。仁徳天皇陵の謎を証拠だけで裁く【1時間】

## 概要欄

教科書で誰もが見た、日本最大の古墳・仁徳天皇陵（大仙古墳）。
でも、ここに仁徳天皇が眠っていることを確かめた人は、一人もいません。古墳の主が眠る場所は一度も調べられたことがなく、すぐ南の「息子の墓」とされる古墳のほうが先に造られたとみられています。

ここに眠るのは誰なのか。本当の仁徳天皇は、どこに眠っているのか。
そして2026年5月、ついに国の調査が動きました。宮内庁が作った地形の立体図に、人の手で土を盛ったとみられる「土壇」が浮かび上がったのです。この墓には、まだ誰も知らない埋葬が眠っているのかもしれません。

明治に一度だけ口を開けた石棺、150年以上行方がわからなかった宝、2025年に初めて実現した研究者の立ち入り。最新の調査をもとに、16の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。

▼チャプター
{chap}

▼参考資料
・【独自】仁徳陵に未知の土盛りか 「土壇」地形、宮内庁（共同通信／秋田魁新報、2026年5月17日）https://www.sakigake.jp/news/article/20260517CO0096/
・仁徳陵で発掘調査始まる 宮内庁と堺市、共同で初（日本経済新聞、2018年10月）https://www.nikkei.com/article/DGXMZO36813430T21C18A0CR8000/
・「仁徳陵」は520メートル超 宮内庁測量、古代の威容判明（日本経済新聞、2018年）https://www.nikkei.com/article/DGXMZO29292020S8A410C1CR0000/
・「明治の盗掘説」真相は 仁徳陵の謎を探る(3)（日本経済新聞）https://www.nikkei.com/article/DGXLASIH16H03_W6A610C1AA2P00/
・ピラミッドに比肩する？ 大山古墳（仁徳天皇陵）のプロフィール（nippon.com）https://www.nippon.com/ja/features/h00316/
・現代技術と古代技術による仁徳天皇陵の建設（大林組「季刊大林」）https://www.obayashi.co.jp/kikan_obayashi/detail/kikan_20_idea.html
・仁徳天皇陵古墳（大山古墳）（堺市）https://www.city.sakai.lg.jp/kanko/rekishi/dkofun/database/nintokutenno.html
・百舌鳥・古市古墳群の世界遺産登録（文化庁）https://www.bunka.go.jp/koho_hodo_oshirase/hodohappyo/1418407.html
・仁徳天皇陵古墳の副葬品の実物を確認（堺市・國學院大學、2025年6月19日発表）https://www.city.sakai.lg.jp/shisei/koho/hodo/hodoteikyoshiryo/kakohodo/r7/r706/070619_03.files/0619_03.pdf\n・仁徳陵に初の立ち入り観察、17学協会（日本経済新聞、2025年3月）https://www.nikkei.com/article/DGXZQOUF07A7B0X00C25A3000000/\n・枚方市 茄子作遺跡で初期須恵器の窯跡（共同通信／秋田魁新報、2025年10月29日）https://www.sakigake.jp/news/article/20251029CO0149/\n・堺市「市民の声」大屋根リングの移設提案への回答（2026年2月）https://www.city.sakai.lg.jp/shisei/koho/kocho/shiminnokoe/R07/r080213/4.html\n・陶邑窯跡群（堺市）https://www.city.sakai.lg.jp/kanko/rekishi/bunkazai/bunkazai/isekishokai/suemurakamaato.html\n・いたすけ古墳（堺市）https://www.city.sakai.lg.jp/kanko/rekishi/bunkazai/bunkazai/shokai/bunya/shiseki/mozukofungun/itasuke.html\n・倭の五王（コトバンク）https://kotobank.jp/word/%E5%80%AD%E3%81%AE%E4%BA%94%E7%8E%8B-154280\n・大仙陵古墳（Wikipedia）https://ja.wikipedia.org/wiki/%E5%A4%A7%E4%BB%99%E9%99%B5%E5%8F%A4%E5%A2%B3

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
写真・資料（Wikimedia Commons。登場順）
{credits}

#仁徳天皇陵 #大仙古墳 #古墳 #百舌鳥古墳群 #世界遺産 #ハビ判事
'''
open(f'{root}/youtube.md', 'w').write(md)
print(chap); print(len(ids), dur)
