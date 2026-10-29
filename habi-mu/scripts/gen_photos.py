# テンプレート（仁徳天皇陵判決のもの）。新しい動画では habi-<題材>/scripts/ にコピーし、場面・素材・文言を書き換えて使う。
# 使い方: python3 gen_photos.py habi-<題材>
# credits.json から photos.ts を作る（ムー大陸判決）
import json, re, sys
root = sys.argv[1]
cr = json.load(open(f'{root}/public/photos/credits.json'))
desc = {
 'nanmadol-a':'ナン・マドール（ポンペイ島）','nanmadol-b':'ナン・マドールの玄武岩の壁','nanmadol-c':'ナン・マドールとその周り','nanmadol-d':'ナン・マドールの遺跡',
 'nanmadol-e':'ナン・マドール','nanmadol-f':'ナン・マドールの巨石遺跡','nanmadol-g':'ナン・マドールの遺跡','nanmadol-h':'ナン・マドールの巨石遺跡',
 'nanmadol-i':'ナン・マドールの遺跡','nanmadol-j':'ナン・マドールの巨石遺跡','nanmadol-k':'ナン・マドールの巨石遺跡','nanmadol-l':'ナン・マドールの石積み',
 'nanmadol-m':'ナン・マドールの巨石遺跡','nanmadol-n':'ナン・マドールの巨石遺跡','nanmadol-last':'ナン・マドールの遺跡',
 'madrid-a':'マドリード絵文書（複製）アメリカ博物館','madrid-b':'マドリード絵文書 アメリカ博物館','madrid-c':'マドリード絵文書（複製）','madrid-museum':'アメリカ博物館（マドリード）',
 'codex-calendar':'マドリード絵文書（複製）','landa-alphabet-2':'マドリード絵文書（複製）','landa':'ディエゴ・デ・ランダ','landa-alphabet':'ランダの記録にある「マヤのアルファベット」',
 'brasseur':'ブラッスール・ド・ブールブール','leplongeon':'オーギュスト・ル・プロンジョン','lp-chichen':'チチェン・イッツァのル・プロンジョン（1875年）','alice':'アリス・ル・プロンジョン',
 'queenmoo-naga':'『女王ムーとエジプトのスフィンクス』（1896年）の図版','queenmoo-wings':'『女王ムーとエジプトのスフィンクス』（1896年）の図版','queenmoo-rain':'『女王ムーとエジプトのスフィンクス』（1896年）の図版',
 'lp-monjas':'ル・プロンジョンの発掘跡 チチェン・イッツァ（1924年）','sphinx':'ギザの大スフィンクス','sphinx-1839':'デイヴィッド・ロバーツ「ギザのスフィンクス」（1839年）',
 'churchward':'ジェームズ・チャーチワード（1926年）','churchward-map':'『失われたムー大陸』（1926年）の地図','churchward-mapbook':'ムー大陸の地図（新聞の切り抜き）',
 'niven':'ウィリアム・ニーヴン','ponape-1899':'ポンペイ島（1899〜1900年）','knorozov':'ユーリー・クノロゾフの記念像（メリダ）','copan-stela':'コパンの石碑22','stela-catherwood':'キャザウッド「コパンの石碑」',
 'palenque':'パレンケ 碑文の神殿','tongariki-a':'アフ・トンガリキ','tongariki-b':'アフ・トンガリキ','tongariki-c':'アフ・トンガリキ','tongariki-d':'アフ・トンガリキ','tongariki-e':'アフ・トンガリキの15体のモアイ',
 'tongariki-f':'イースター島のアフ','moai-stars':'星空とアフ・トンガリキのモアイ','moai-traveling':'「旅するモアイ」とアフ・トンガリキ','moai-nau':'アフ・ナウナウ','moai-akahanga':'アフ・アカハンガ近くのモアイ',
 'akivi':'アフ・アキビ','raraku-south':'ラノ・ララク','raraku-moai':'ラノ・ララクのモアイ','raraku-volcano':'ラノ・ララクの石切り場','rapanui-land':'イースター島の風景','rapanui-hills':'イースター島の風景',
 'manavai':'マナバイ（石で囲んだ畑）','rongo-b':'ロンゴロンゴの板（ホノルル）','rongo-c':'ロンゴロンゴの板C「ママリ」','rongo-aruku':'ロンゴロンゴの板B「アルク・クレンガ」','rongo-staff':'ロンゴロンゴの板C（スミソニアン協会年報 1889年）',
 'indus-seal':'インダス文明の印章（ハラッパー）','hokulea':'ホクレア号（1976年）','hokulea-2':'ホクレア号の帰港','mau':'マウ・ピアイルグ',
 'yonaguni-a':'与那国島海底地形「メインテラス」','yonaguni-b':'与那国島海底地形','yonaguni-c':'与那国島海底地形のテラス','yonaguni-island':'与那国島（国際宇宙ステーションから）',
 'okinoshima-sea':'沖ノ島','okitsumiya':'宗像大社沖津宮','coralsea':'タスマン海とサンゴ海（国際宇宙ステーションから）','southern-surveyor':'研究船サザン・サーベイヤー号','sclater':'フィリップ・スクレーター',
 'lemur':'ワオキツネザル（マダガスカル）','madagascar':'ワオキツネザル（マダガスカル）','wegener':'アルフレート・ヴェーゲナー','granite':'花こう岩の岩場','pillow-basalt':'太平洋の海底の枕状溶岩（玄武岩）',
 'guyot-map':'ヘス・ギヨーなどの海底地形図','guyot-map-2':'ミクロネシアの海底地形図','nz-alps':'ニュージーランドのサザンアルプス','nz-coast':'ニュージーランドのサザンアルプス','newcaledonia':'ニューカレドニア（国際宇宙ステーションから）',
 'northsea':'クレメント・リードによるドッガーバンクの地図（1913年）','zealandia-topo':'ジーランディアの地形図','tsunami-sign':'津波避難の案内（鎌倉）','sentinel':'北センチネル島','star-compass':'星の羅針盤',
 'pacific-night':'月夜の海','pacific-sea':'太平洋の夕暮れ','pacific-wave':'太平洋の夕暮れ','rapanui-coast':'イースター島の海岸','rapanui-land-2':'イースター島（国際宇宙ステーションから）','rapanui-people':'ハンガロア（イースター島）',
 'tongariki-dawn':'夜明けのアフ・トンガリキ','tongariki-night':'夜明けのアフ・トンガリキ','japan-space':'国際宇宙ステーションから見た富士山','japan-coast':'日本列島の地形図','pacific-earth':'地球（ブルーマーブル）','pacific-sunset':'太平洋の夕日（マウイ島）',
}
bottom = {'alice','brasseur','churchward','landa','leplongeon','niven','sclater','wegener','mau','knorozov'}
contain = {'alice','brasseur','churchward-map','churchward-mapbook','copan-stela','indus-seal','landa-alphabet','landa','leplongeon','niven','queenmoo-naga','queenmoo-wings','queenmoo-rain','rongo-b','rongo-c','rongo-aruku','rongo-staff','guyot-map','guyot-map-2','zealandia-topo','northsea','japan-coast','star-compass','sclater','wegener','sphinx-1839','stela-catherwood','knorozov'}
def artist(a):
    a = re.sub(r'Unknown author.*', '', a).strip(); a = re.sub(r' from .*', '', a).strip()
    return '' if a in ('', '作者不明') or 'ファイル' in a or '投稿者' in a else a
def lic(l): return 'パブリックドメイン' if l.lower().startswith('public domain') else l
lines = []
for k, v in cr.items():
    a = artist(v['artist']); credit = f"{desc.get(k, k)}{' ' + a if a and len(a) < 40 else ''} / {lic(v['license'])} / Wikimedia Commons"
    credit = credit.replace("'", "’")
    extra = (", fit: 'contain'" if k in contain else '') + (', labelBottom: true' if k in bottom else '')
    key = k if re.fullmatch(r'[a-z]+', k) else f"'{k}'"
    lines.append(f"\t{key}: {{file: '{k}.jpg', credit: '{credit}'{extra}}},")
p = f'{root}/src/data/photos.ts'
s = open(p).read()
s = s[:s.index('export const photos')] + 'export const photos: Record<string, PhotoEntry> = {\n' + '\n'.join(lines) + '\n};\n'
open(p, 'w').write(s)
print(len(lines), [k for k in cr if k not in desc])
