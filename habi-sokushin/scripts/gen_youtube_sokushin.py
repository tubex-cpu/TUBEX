"""即身仏判決：youtube.md（タイトル案・概要欄・チャプター・参考資料・クレジット）と時刻入り台本を作る。
  python3 scripts/gen_youtube_sokushin.py"""
import json
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
CHAP = ['1961年、掘り起こされた墓', 'ハビ判事、開廷', '即身仏は何体ある？', '湯殿山の行者たち', '語ってはいけない御神体', '湯殿山と羽黒山の争い', '一世行人とは', '木の実と草の修行', '漆を飲んだ？', '鉦の音が止まるまで', '土に埋めなかった行者', '本明海上人と藩主', '真如海上人と大飢饉', '鉄門海上人の左目', '弟子の記録帳', '藩士の日記のひと言', '鉄竜海上人の体', '忠海上人と燻製', '円明海上人と柿渋', '体の中の虫の殻', '亡くなったあとの手当て', '最古の弘智法印', '宥貞法印の石の棺', '指紋が語ること', '明治の刑法', '最後の即身仏・仏海', '58年後の発掘', '土中入定と即身仏', '海を渡った僧のミイラ', '仏像の中の僧', 'タイの僧', '失われた即身仏', '個人が守る即身仏', '衣替えと信仰', '有名になったのはいつ？', '即身仏の本当の物語', '残された謎', '33の判決', '閉廷']
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
(ROOT / '台本_即身仏判決.txt').write_text(f'ハビ判事 台本：即身仏判決\n（ナレーション：VOICEVOX 玄野武宏／動画の長さ {dur}。見出しの時刻は完成動画の実際の位置）\n\n' + '\n'.join(out).lstrip('\n') + '\n')

# 写真の登場順クレジット
ids = []
for sc in order:
    for x in re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{sc}.tsx').read_text()):
        if x not in ids:
            ids.append(x)
ph = (ROOT / 'src/data/photos.ts').read_text()
cred = {m.group(1): m.group(2) for m in re.finditer(r"\t'([\w-]+)': \{file: '[^']+', credit: '([^']+)'", ph)}
# 写真ごとの出典一覧：Commons の記載（scripts/commons-meta.json。2026-11-18 に API で取得）をもとに、
# 作者・ライセンスとその URL・出典ページ・改変の有無を1件ずつ書く
import html as _html
meta = json.loads((ROOT / 'scripts/commons-meta.json').read_text())['meta'] if (ROOT / 'scripts/commons-meta.json').exists() else {}
cj0 = json.loads((ROOT / 'public/photos/credits.json').read_text())
desc0 = json.loads((ROOT / 'scripts/photo-desc.json').read_text())
LIC_URL = {
    'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/', 'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
    'CC BY-SA 2.5': 'https://creativecommons.org/licenses/by-sa/2.5/', 'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
    'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/', 'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/',
    'CC BY 2.5': 'https://creativecommons.org/licenses/by/2.5/', 'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
    'CC0': 'https://creativecommons.org/publicdomain/zero/1.0/',
}


def plain(x):
    x = re.sub(r'<[^>]+>', ' ', x or '')
    return re.sub(r'\s+', ' ', _html.unescape(x)).strip()


# Commons に作者名がなく、所蔵館が出典・表示先になっているもの（説明ページの Credit／Attribution による）
OVR = {'walnut-wellcome': 'Wellcome Collection', 'kukai-patriarch': 'ColBase（国立博物館所蔵品統合検索システム）・奈良国立博物館'}


def author(pid):
    if pid in OVR:
        return OVR[pid]
    m = meta.get(pid, {})
    a = plain(m.get('Attribution')) or plain(m.get('Artist')) or cj0[pid]['artist']
    a = re.sub(r'^No machine-readable author provided\. (.+?)(~commonswiki)? assumed.*$', r'\1', a)
    a = re.sub(r'^(User:|ja:User:)', '', a).replace('Unknown authorUnknown author', '作者不明').replace('Unknown author', '作者不明')
    a = re.sub(r'^Creator:', '', a).replace('Unknown author Unknown author', '作者不明')
    a = re.sub(r'^\s*\(WT-shared\) (\S+) at wts wikivoyage.*$', r'\1', a)
    a = re.sub(r'^User: ?', '', a).replace('作者不明 作者不明', '作者不明').replace('著： ', '著：').replace(' （', '（')
    a = re.sub(r'\s*:$', '', a).replace(' , ', ', ')
    a = {'Japanese': '作者不明（日本）', '不明': '作者不明'}.get(a, a)
    return a.strip() or '作者不明'


rows = []
for n, pid in enumerate(ids, 1):
    v = cj0[pid]
    m = meta.get(pid, {})
    lic = plain(m.get('LicenseShortName')) or v['license']
    licn = {'Public domain': 'パブリックドメイン', 'PD': 'パブリックドメイン', 'No restrictions': '既知の著作権の制限なし（No known copyright restrictions）'}.get(lic, lic)
    lurl = plain(m.get('LicenseUrl')) or LIC_URL.get(lic, '')
    d = desc0.get(pid) or desc0.get(re.sub(r'-w$', '', pid)) or v['title']
    page = m.get('page') or v['page']
    needs = lic.startswith('CC BY')
    r = [f'{n}. {d}', f'   - 作者：{author(pid)}', f'   - ライセンス：{licn}' + (f'（{lurl}）' if lurl else ''), f'   - 出典：{page}']
    r.append('   - 改変：あり（上の「改変について」のとおり）' if needs else '   - 改変：あり（パブリックドメイン／CC0 のため表示義務なし）')
    if needs and lic.startswith('CC BY-SA'):
        r.append('   - 条件：表示（作者・ライセンス・出典）、改変の明示、継承（改変した素材は同じライセンス）')
    elif needs:
        r.append('   - 条件：表示（作者・ライセンス・出典）、改変の明示')
    rows.append('\n'.join(r))
HEAD = """# 即身仏判決：写真・資料のクレジット（登場順）

動画「即身仏判決」で使った写真・資料 {n} 点の、作者・ライセンス・出典の一覧です。作者名・ライセンスは、Wikimedia Commons ほか各ファイルの説明ページの記載（2026年11月18日に確認）によります。

## 改変について
動画では、すべての写真・資料に次の改変を加えています。
- 縮小、画面の比率に合わせたトリミング（縦長の資料は左右にぼかした同じ画像を敷いて全体を表示）
- 色調の調整（コントラスト・彩度・明るさ）
- ゆっくりしたズーム・パン、画面の上下を暗くするグラデーション、字幕・テロップの重ね合わせ

CC BY-SA の素材を改変したものは、元と同じライセンス（CC BY-SA の各版）で提供します。
地図：Mapzen Terrain Tiles（SRTM ほか）の標高データをもとに作成。

## 一覧
"""
(ROOT / '写真クレジット一覧.md').write_text(HEAD.format(n=len(ids)) + '\n'.join(rows) + '\n')

# 概要欄は5000字までなので、写真のクレジットはライセンスごとに撮影者・作者名をまとめる
import json, collections
cj = json.loads((ROOT / 'public/photos/credits.json').read_text())
NAME = {
    'Göhring, Herman ; Mondejar, [?]': 'Herman Göhring', 'Scott Umstattd scott_umstattd': 'Scott Umstattd', 'John Kutcher jmkutcher': 'John Kutcher', 'Preben Nilsen (@prebz22) on Unsplash': 'Preben Nilsen', 'Felipe Guamán Poma de Ayala (1616)': 'Felipe Guamán Poma de Ayala', 'David Berkowitz from New York, NY, USA': 'David Berkowitz', 'Jorge Láscar from Australia': 'Jorge Láscar', 'McKay Savage from London, UK': 'McKay Savage',
    'Nankou Oronain (as36…': 'Nankou Oronain', 'ja:User:Sanjo': 'Sanjo',
    'そらみみ (Soramimi)': 'そらみみ', 'Gary Todd from Xinzheng, China': 'Gary Todd', 'Gary Lee Todd, Ph.D.': 'Gary Todd',
    'Hot cake syrup (talk)': 'Hot cake syrup', 'Original file is made by Ksiom, modified by Pekachu.': 'Ksiom, Pekachu',
    'Korea.net / Korean Culture and Information Service (Jeon Han)': 'Korea.net（Jeon Han）',
    'ウィキ太郎 (Wiki Taro)': 'ウィキ太郎', 'MODIS Land Rapid Response Team, NASA GSFC': 'NASA', 'Raita Futo from Tokyo, Japan': 'Raita Futo',
}
PD_WORKS = ('浮世絵・古典籍・美術品（鈴木牧之『北越雪譜』、歌川広重、勝川春章、小林清親、与謝蕪村、杉山杉風、『江戸名所図会』、メトロポリタン美術館・ブルックリン美術館 ほか）')
by = collections.defaultdict(list)
pd = []
for i in ids:
    v = cj[i]
    lic = v['license']
    if lic == 'オリジナル':
        continue
    if i in OVR:
        if OVR[i] not in by[lic]:
            by[lic].append(OVR[i])
        continue
    if lic in ('Public domain', 'CC0', 'No restrictions'):
        if lic == 'CC0' and v['artist'] != '作者不明':
            a = re.sub(r'^Creator:', '', NAME.get(v['artist'], v['artist']))
            if a != 'Japanese':
                pd.append(a)
        continue
    n = NAME.get(v['artist'], v['artist'])
    n = re.sub(r'^No machine-readable author provided\. (.+?)(~commonswiki)? assumed.*$', r'\1', n)
    n = re.sub(r'^(User:|ja:User:)', '', n)
    n = n.replace('Unknown authorUnknown author', '作者不明（所蔵館の公開画像）').replace('内閣府 (防災担当) , Cabinet Office of Japan, disaster prevention charge.', '内閣府（防災担当）')
    n = re.sub(r'^\s*\(WT-shared\) (\S+) at wts wikivoyage.*$', r'\1', n)
    if n == '作者不明':
        n = '作者不明（所蔵館の公開画像）'
    if n not in by[lic]:
        by[lic].append(n)
ORDER = ['CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY-SA 2.0', 'CC BY 4.0', 'CC BY 3.0', 'CC BY 2.5', 'CC BY 2.0']
assert not set(by) - set(ORDER), set(by) - set(ORDER)
lines = [f'{l}：' + '、'.join(by[l]) for l in ORDER if by[l]]
lines.append('パブリックドメイン・CC0：' + PD_WORKS + ('、写真：' + '、'.join(dict.fromkeys(pd)) if pd else ''))
credits = '\n'.join(lines)

md = f'''# YouTube 投稿用テキスト：即身仏判決

## タイトル案

- 【即身仏】生きたまま土に入った僧の伝説 残された記録が語ること（推奨）
- 【即身仏】僧はなぜミイラになったのか 伝説の裏に残された記録
- 【即身仏】鉦の音が止まるまで…土に入った僧の伝説は本当か

（サムネ「死後58年、土の中にいた僧／伝説では「生きたまま入った」／本当に生きて入った？」と役割を分ける。「ハビ判事が検証」は入れない）

## 概要欄

1961年、新潟県村上市。58年前に亡くなった一人の僧の墓が掘り起こされました。最後の即身仏とされる、仏海上人です。
即身仏は、厳しい修行の末に自らの体を仏として残したと伝わる、僧侶のミイラ。行者は生きたまま土の中に入り、鉦を鳴らしながら経を唱え続けた――そう語り継がれてきました。
本当に、生きたまま土に入ったのか。
1962年の学術調査の報告、即身仏の体の中から見つかった虫の殻、江戸時代の藩士が日記に残したひと言、弟子の記録帳、国立科学博物館の調査、そしていまも続く寺の衣替え。伝承と記録を分けながら、山形・新潟などに伝わる即身仏の33の手がかりを、閉園後の法廷でハビ判事がひとつずつ裁きます。

▼チャプター
{chap}

▼参考資料
・小片保「新潟県及びその周辺にある我国僧侶のミイラに就て」『民族衛生』28巻6号（1962年）
・Kazuhiro Sakaue, "Inventory of the human mummy specimens stored in Japan," Bull. Natl. Mus. Nat. Sci., Ser. D, 48（2022年）
・科学研究費 19K06869「我が国に存在する『ミイラ』の現状把握と非破壊分析」（国立科学博物館）
・中村安宏・鹿野朱里「鉄門海の思想」「鉄門海の『亀鏡志』翻刻」（岩手大学）
・岩鼻通明「即身仏：厳しい修行の果てに涅槃を目指したミイラ仏」nippon.com（2021年）
・日本ミイラ研究グループ編『日本ミイラの研究』（平凡社、1969年）
・注連寺・大日坊・西生寺の公式サイト、にいがた観光ナビ
・中国新聞網「“章公祖师”肉身坐佛追索案终审判决」（2022年7月19日）

▼ハビ判事とは
信じるのは、話の面白さではなく証拠だけ。
閉園後の動物園の法廷で、ネットや歴史の“あの説”に判決を下すハシビロコウの裁判官です。

▼クレジット
ナレーション：VOICEVOX:玄野武宏
BGM・効果音：オリジナル
地図：Mapzen Terrain Tiles（SRTM ほか）の標高データをもとに作成
写真・資料（Wikimedia Commons ほか）
{credits}
写真はいずれも縮小・トリミング・色調の調整・ズームなどの改変を加えて使用しています。
写真ごとの作者・ライセンス・出典の一覧：https://github.com/tubex-cpu/TUBEX/blob/claude/nice-wright-du0dch/habi-sokushin/写真クレジット一覧.md

#即身仏 #湯殿山 #出羽三山 #ミイラ #鉄門海 #仏海上人 #ハビ判事
'''
(ROOT / 'youtube.md').write_text(md)
print(chap)
print(len(ids), dur)
d = md[md.index('## 概要欄') + 7:]
print('概要欄', len(d), '字')
assert len(d) <= 5000
