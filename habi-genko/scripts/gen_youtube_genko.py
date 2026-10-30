"""元寇判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_genko.py"""
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
CHAP = ['神風の物語が、崩れ始めた', 'ハビ判事、開廷', '一通の脅しの手紙', '最初に狙われた島', '一騎打ちの真実', 'てつはうの中身', '描き足された3人？',
        '1度目の嵐は吹いたのか', '斬られた使者', '20キロの石の壁', '14万人の大艦隊？', '嵐の前の2か月', '全滅しなかった元軍', '海の底の沈没船',
        '濁った海の探し方', '手抜きの船だったのか', '板に残された年号', '敵の国の矢', '船の中のサイコロ', '勝っても報われない', '「神風」という言葉',
        '海の底が語りはじめた', '残された3つの謎', '19の判決', '閉廷']
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
(ROOT / '台本_元寇判決.txt').write_text(f'ハビ判事 台本：元寇判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
credits_full = '\n'.join('・' + cred[i].replace(' / Wikimedia Commons', '') for i in ids)
(ROOT / '写真クレジット一覧.md').write_text('# 元寇判決：写真・資料のクレジット（登場順・すべて Wikimedia Commons ほか）\n\n' + credits_full + '\n')

# 概要欄は5000字までなので、写真のクレジットはライセンスごとに撮影者・作者名をまとめる
import json, collections
cj = json.loads((ROOT / 'public/photos/credits.json').read_text())
NAME = {
    'そらみみ (Soramimi)': 'そらみみ', 'Gary Todd from Xinzheng, China': 'Gary Todd', 'Gary Lee Todd, Ph.D.': 'Gary Todd',
    'Hot cake syrup (talk)': 'Hot cake syrup', 'Original file is made by Ksiom, modified by Pekachu.': 'Ksiom, Pekachu',
    'Korea.net / Korean Culture and Information Service (Jeon Han)': 'Korea.net（Jeon Han）',
    'ウィキ太郎 (Wiki Taro)': 'ウィキ太郎', 'MODIS Land Rapid Response Team, NASA GSFC': 'NASA',
}
PD_WORKS = ('竹崎季長『蒙古襲来絵詞』と土佐長隆らの模本、福田太華・菊池容斎の模本（東京国立博物館）、河鍋暁斎、歌川貞秀（メトロポリタン美術館）、'
            '葛飾為斎、二代川島甚兵衛、藤原為信、元朝皇帝像、クビライの国書の写し（東大寺）、NASAの衛星写真、アムステルダム国立美術館 ほか')
by = collections.defaultdict(list)
pd = []
for i in ids:
    v = cj[i]
    lic = v['license']
    if lic in ('Public domain', 'CC0'):
        if lic == 'CC0' and v['artist'] not in ('Rijksmuseum', 'Utagawa Sadahide'):
            pd.append(NAME.get(v['artist'], v['artist']))
        continue
    n = NAME.get(v['artist'], v['artist'])
    if n not in by[lic]:
        by[lic].append(n)
ORDER = ['CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY-SA 2.0', 'CC BY 4.0', 'CC BY 3.0', 'CC BY 2.0']
lines = [f'{l}：' + '、'.join(by[l]) for l in ORDER if by[l]]
lines.append('パブリックドメイン・CC0：' + PD_WORKS + ('、写真：' + '、'.join(dict.fromkeys(pd)) if pd else ''))
credits = '\n'.join(lines)

md = f'''# YouTube 投稿用テキスト：元寇判決

## タイトル案

- 【速報】元寇の沈没船からサイコロと札。神風の物語が、海の底から崩れ始めた【1時間】（推奨）
- 神風は本当に吹いたのか？ 海底に眠る元軍の船が語る、元寇の真実【1時間】
- 【教科書が変わる】元寇の名場面は描き足しだった？ 最新の調査で裁く蒙古襲来【1時間】

## 概要欄

750年前、日本は国が滅びるかもしれない最大の危機に立たされていました。モンゴル帝国の大軍が、2度にわたって九州に押し寄せた元寇（蒙古襲来）です。
日本は2度とも「神風」に救われた――私たちはそう教わってきました。

でも2026年、その物語が海の底から崩れ始めています。
長崎県松浦市・鷹島の沖に沈む元軍の船から、4月には元の年号が書かれた木の板、8月には元に滅ぼされた南宋の矢、そして10月には兵士たちが遊んでいたとみられるサイコロと札が見つかりました。

1度目の戦いは、今の暦で11月。台風の季節ではありません。鎌倉武士は本当に一騎打ちで負けたのか。教科書に載るあの絵の3人の兵士は、本当にそこにいたのか。14万人の大艦隊は、嵐だけで沈んだのか。
X線CT、赤外線、音波の探査。最新の技術と研究者たちの地道な調査が導き出した証拠をもとに、19の手がかりを閉園後の法廷でハビ判事がひとつずつ裁きます。

▼チャプター
{chap}

▼参考資料
・元寇沈没船に墨書きの木板 乗員向け掲示の可能性「画期的」（共同通信／秋田魁新報、2026年4月30日）https://www.sakigake.jp/news/article/20260430CO0088/
・元寇の矢、長崎の沈没船から発見 南宋から接収し日本戦に転用か（共同通信／秋田魁新報、2026年8月20日）https://www.sakigake.jp/news/article/20260820CO0152/
・元寇沈没船 進む水中遺跡の調査 実態解明へ国際連携（NHK、2026年10月19日）https://news.web.nhk/newsweb/na/nd-20261019de61415
・鷹島沖の元寇船の調査でサイコロ・骨牌を確認（日本経済新聞の報道、2026年10月28日）https://www.nikkei.com/article/DGXZQOUF28AMC0Y6A021C2000000/
・同上（毎日新聞の報道、2026年10月28日）https://news.infoseek.co.jp/article/mainichi_20261028k0000m040327000c/
・社説：水中遺跡調査 保存、活用へ国と連携を（秋田魁新報、2026年3月17日）https://www.sakigake.jp/news/article/20260317AK0003/
・蒙古襲来750年の特集（nippon.com）https://www.nippon.com/ja/japan-topics/c13704/
・鷹島海底遺跡に関する資料（長崎県）https://www.pref.nagasaki.jp/shared/uploads/2024/01/1704766427.pdf
・相瀬海底遺跡発見いかり石（長崎県教育庁、2025年）https://www.pref.nagasaki.jp/shared/uploads/2026/01/1767753493.pdf
・文化審議会 議事要旨（鷹島神崎遺跡の史跡指定）https://www.bunka.go.jp/seisaku/bunkashingikai/bunkazai/11/gijiyoshi_123.html
・てつはうのX線CT調査（文化庁 水中遺跡調査検討委員会 資料）https://www.bunka.go.jp/seisaku/bunkashingikai/kondankaito/suichu_iseki/h26_05/pdf/shiryo_4-2.pdf
・松浦市『鷹島海底遺跡 平成27年度発掘調査概報』https://sitereports.nabunken.go.jp/files/attach/34/34009/46695_1_%E6%9D%BE%E6%B5%A6%E5%B8%82%E9%B7%B9%E5%B3%B6%E6%B5%B7%E5%BA%95%E9%81%BA%E8%B7%A1.pdf
・荒川秀俊「文永の役の終末を告げたのは台風ではない」（天気、1958年）https://www.metsoc.jp/tenki/pdf/1958/1958_09_0300.pdf
・服部英雄『蒙古襲来と神風』（中公新書、2017年）https://www.chuko.co.jp/shinsho/2017/11/102461.html
・佐藤鉄太郎『蒙古襲来絵詞と竹崎季長の研究』（錦正社、2005年）https://kinseisha.jp/book/0317-2/
・橋本雄「蒙古襲来絵詞を読みとく」https://www.aisf.or.jp/sgra/wp-content/uploads/2017/03/%EF%BC%BBJ%EF%BC%BDKokushi2_Fullpaper_HashimotoYu%EF%BC%88%E6%A9%8B%E6%9C%AC%E9%9B%84%EF%BC%89ed2.pdf
・元寇防塁（福岡市の文化財）https://bunkazai.city.fukuoka.lg.jp/maibun/files/download/information_blocks/41b276fa-0d5a-4657-8ae1-a81a2938cb01/value01/value02
・九州大学箱崎キャンパスの元寇防塁 https://www.kyushu-u.ac.jp/f/33080/18_4_24_4.pdf
・Thomas Conlan, In Little Need of Divine Intervention https://deremilitari.org/?p=1565

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
地図：East China Sea location map（© OpenStreetMap contributors, Peka / ODbL / Wikimedia Commons）
写真・資料（Wikimedia Commons ほか）
{credits}
写真ごとの出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-genko/写真クレジット一覧.md

#元寇 #蒙古襲来 #神風 #鷹島 #鎌倉時代 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
