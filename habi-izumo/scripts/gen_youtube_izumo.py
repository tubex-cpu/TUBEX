"""出雲判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_izumo.py"""
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
CHAP = ['358本の剣が眠る谷', 'ハビ判事、開廷', '神様がいない月？', '古い本に書いてある？', '神話の3分の1', '国を引き寄せた神', '八つの頭の正体', '谷から出てきた358本',
        '戦うための剣ではない？', '銅剣の国と銅鐸の国', '39個の銅鐸', '3キロ離れた同じ印', '埋めた本当の理由', '出雲の王の墓', '海の道の十字路', '鉄の国の始まり',
        '国譲りは本当にあったのか', '高さ48メートルの神殿', '何度も倒れた神殿', '神の子孫の家', '神々が集まる夜', '神々が出雲に集まる本当の理由', '残された3つの謎', '19の判決', '閉廷']
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
(ROOT / '台本_出雲判決.txt').write_text(f'ハビ判事 台本：出雲判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
credits_full = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
(ROOT / '写真クレジット一覧.md').write_text('# 出雲判決：写真・資料のクレジット（登場順・すべて Wikimedia Commons ほか）\n\n' + credits_full + '\n')

# 概要欄は5000字までなので、写真のクレジットはライセンスごとに撮影者・作者名をまとめる
import json, collections
cj = json.loads((ROOT / 'public/photos/credits.json').read_text())
NAME = {
    'そらみみ (Soramimi)': 'そらみみ', 'Gary Todd from Xinzheng, China': 'Gary Todd', 'Gary Lee Todd, Ph.D.': 'Gary Todd',
    'Hot cake syrup (talk)': 'Hot cake syrup', 'Original file is made by Ksiom, modified by Pekachu.': 'Ksiom, Pekachu',
    'Korea.net / Korean Culture and Information Service (Jeon Han)': 'Korea.net（Jeon Han）',
    'ウィキ太郎 (Wiki Taro)': 'ウィキ太郎', 'MODIS Land Rapid Response Team, NASA GSFC': 'NASA',
}
PD_WORKS = ('月岡芳年・豊原周延・歌川国貞・歌川広重・小林永濯・八島岳亭らの浮世絵、古事記（真福寺本）・日本書紀・延喜式などの古い本、'
            '千家尊福の肖像、東京国立博物館・大英博物館の所蔵品 ほか')
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

md = f'''# YouTube 投稿用テキスト：出雲判決

## タイトル案

- 【神在月】神々はなぜ出雲に集まるのか？ 358本の銅剣と48mの神殿が語る、消された王国【1時間】（推奨）
- 出雲神話は作り話だったのか？ 地中から現れた358本の銅剣と、天にそびえた神殿の謎【1時間】
- 【2026年最新】銅剣と銅鐸に刻まれた"同じ印"。出雲に神々が集まる本当の理由【1時間】

## 概要欄

毎年、旧暦の10月。日本中の神々が出雲に集まる――。だから全国では10月を「神無月」、出雲だけは「神在月」と呼ぶと言われています。2026年の神迎えは11月18日の夜です。
でも、その言い伝えは、古事記にも日本書紀にも書かれていません。では、いつ、どうやって生まれたのか。

1984年、島根県の荒神谷遺跡から、それまで全国で見つかっていた数を上回る358本の銅剣が出ました。1996年には、山を越えた加茂岩倉遺跡から39個の銅鐸。2000年には出雲大社の境内から、杉を3本束ねた直径約3メートルの巨大な柱が現れました。
そして2026年10月、荒神谷の銅剣に刻まれたバツの印が、加茂岩倉の銅鐸14個にもあるという研究が紹介されました。
出雲神話は作り話だったのか。358本の銅剣は、なぜ土に埋められたのか。高さ48メートルの神殿は本当にあったのか。柱の年代測定、地中レーダーの探査、青銅器の印を見比べる研究者たちの調査をもとに、19の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。

▼チャプター
{chap}

▼参考資料
・加茂岩倉遺跡の銅鐸39個、どこで作り誰が埋めた？ 出土30周年シンポジウム（山陰中央新報、2026年10月）https://www.sanin-chuo.co.jp/articles/-/1095410
・加茂岩倉遺跡銅鐸出土30周年記念シンポジウム（雲南市観光協会）https://www.unnan-kankou.jp/news/2026-10-10kamo-shinpojiumu/
・荒神谷博物館の企画展（山陰中央新報、2026年7月）https://www.sanin-chuo.co.jp/articles/-/1045780
・古代出雲歴史博物館がリニューアル開館（熊本日日新聞・共同通信）https://kumanichi.com/articles/2041634
・令和8年 神在祭のご案内（出雲大社）https://izumooyashiro.or.jp/r8_kamiari
・山代二子塚古墳の地中レーダー探査（島根県、2025年）https://www.pref.shimane.lg.jp/press_release/2025/u82vjt2bnf0j.html
・荒神谷遺跡（島根県）https://www.pref.shimane.lg.jp/life/bunka/bunkazai/shiseki/sanninshisekinwkaigi/shiseki-exploration/koujinndani.html
・加茂岩倉遺跡（文化遺産オンライン）https://online.bunka.go.jp/heritages/detail/211890
・西谷墳墓群（島根県）https://www.pref.shimane.lg.jp/life/bunka/bunkazai/shiseki/sanninshisekinwkaigi/shiseki-exploration/nisidanihunbogun.html
・石橋茂登「山陰地方の青銅器をめぐって」（千葉大学）https://opac.ll.chiba-u.jp/da/curator/900052174/jinshaken-19-15.pdf
・松帆銅鐸の調査報告（南あわじ市）https://www.city.minamiawaji.hyogo.jp/uploaded/attachment/300999.pdf
・景山真二・石原聡「出雲大社境内遺跡の発掘調査の成果」（日本考古学）https://www.jstage.jst.go.jp/article/nihonkokogaku1994/8/11/8_11_153/_article/-char/ja/
・古代出雲大社の本殿の復元（大林組）https://www.obayashi.co.jp/kikan_obayashi/detail/digest_kikan_27_idea.html
・神在月の起源（島根県古代文化センター）https://shimane-kodaibunka.jp/history/imadoki_001/
・大日方克己「出雲大社の転倒」（松江市史講座）https://www.city.matsue.lg.jp/material/files/group/34/kouza24-6obinata.pdf
・出雲国風土記と国引き神話（島根県）https://www.pref.shimane.lg.jp/life/bunka/bunkazai/izumo_fuudo/kunibiki/fudo03.html
・斐伊川（国土交通省）https://www.mlit.go.jp/river/toukei_chousa/kasen/jiten/nihon_kawa/0713_hiikawa/0713_hiikawa_01.html
・三浦佑之『出雲神話論』（講談社）https://www.kodansha.co.jp/titles/1000036018

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
地図：Mapzen Terrain Tiles（SRTM ほか）の標高データをもとに作成
写真・資料（Wikimedia Commons ほか）
{credits}
写真ごとの出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-izumo/写真クレジット一覧.md

#出雲 #出雲大社 #神在月 #荒神谷遺跡 #古事記 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
