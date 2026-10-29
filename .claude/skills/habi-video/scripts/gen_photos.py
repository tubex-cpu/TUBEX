# テンプレート（仁徳天皇陵判決のもの）。新しい動画では habi-<題材>/scripts/ にコピーし、場面・素材・文言を書き換えて使う。
# 使い方: python3 gen_photos.py habi-<題材>
# credits.json から photos.ts を作る（仁徳天皇陵）
import json, re, sys
root = sys.argv[1]
cr = json.load(open(f'{root}/public/photos/credits.json'))
desc = {
 'okinoshima-view':'沖ノ島',
 'sue-jar':'古墳時代の須恵器の壺（クリーブランド美術館）',
 'sue-jar-2':'須恵器の貯蔵用の壺（クリーブランド美術館）',
 'suemura-tg61':'陶邑窯跡群 TG61号窯跡',
 'suemura-tk73':'陶邑窯跡群 TK73号窯跡',
 'suemura-cup':'陶邑窯跡群出土の須恵器（坏身）',
 'suemura-pot':'陶邑窯跡群出土の須恵器（甑）',
 'suemura-spout':'陶邑窯跡群出土の須恵器（異形注口土器）',
 'kiln-site':'七曲古窯の窯跡',
 'haniwa-woman':'正装した女性の埴輪',
 'haniwa-woman-2':'ひざまずく女性の埴輪',
 'haniwa-young':'若い女性の埴輪',
 'haniwa-shield':'盾形埴輪と円筒埴輪（塚堂古墳）',
 'haniwa-shieldman':'盾持人の埴輪（小墓古墳）',
 'saki-misasagi':'日葉酢媛命陵（佐紀陵山古墳）',
 'saki-haisho':'佐紀陵山古墳の拝所',
 'tsukamawari':'塚廻古墳（堺市）',
 'nagayama':'永山古墳（堺市）',
 'magatama':'古墳時代の勾玉・管玉など（ギメ美術館）',
 'tadeiyama':'反正天皇陵古墳（田出井山古墳）',
 'izumi-zue':'『和泉名所図会』の挿絵',
 'toda':'戸田忠至（宇都宮藩）',
 'goguryeo':'高句麗の古墳壁画',
 'silla-crown':'新羅の金冠',
 'baekje-burner':'百済の金銅大香炉',
 'liu-yu':'宋の武帝・劉裕',
 'qin-portrait':'秦の始皇帝',
 'terracotta':'兵馬俑',
 'silla-jar-bm':'大英博物館の新羅の土器',
 'mint':'明治時代の造幣局（大阪）',
 'alps':'日本アルプス',
 'kokugakuin':'國學院大學',
 'masuda':'益田孝',
 'itasuke':'いたすけ古墳',
 'itasuke-2026':'いたすけ古墳（2026年）',
 'itasuke-2':'いたすけ古墳',
 'tanuki':'タヌキ',
 'city-hall':'堺市役所',
 'city-hall-view':'堺市役所の展望ロビーからの眺め',
 'tsukuriyama':'造山古墳（岡山市）',
 'iron-swords':'古墳時代の鉄の刀',
 'bell-mirror':'古墳時代の鈴鏡（メトロポリタン美術館）',
 'utsunomiya':'宇都宮城',
 'gosashi-mound':'五社神古墳の墳丘',
 'nagatsuka':'長塚古墳（堺市）',
 'otsukayama-armor':'大塚山古墳（堺市）出土の短甲',
 'otsukayama-beads':'大塚山古墳（堺市）出土の玉類',
 'sumo':'歌川国貞による相撲の錦絵',
 'muroto':'室戸台風の被害（1934年）',
 'shoryobu':'宮内庁書陵部',
 'gobyoyama-balloon':'気球から見た御廟山古墳',
 'mozu-gobyo':'御廟山古墳（堺市）',
 'maruhoyama-moat':'丸保山古墳の濠',
 'maruhoyama-moat-2':'丸保山古墳の濠',
 'maruhoyama-moat-3':'丸保山古墳の濠',
 'maruhoyama':'丸保山古墳',
 'komoyamazuka':'菰山塚古墳',
 'magodayu':'孫太夫山古墳',
 'magodayu-2':'孫太夫山古墳',
 'magodayu-3':'孫太夫山古墳',
 'magodayu-4':'孫太夫山古墳',
 'osamezuka':'収塚古墳',
 'osamezuka-2':'収塚古墳',
 'osamezuka-3':'収塚古墳',
 'osamezuka-4':'収塚古墳',
 'osamezuka-5':'収塚古墳',
 'omotezuka':'御廟表塚古墳の濠',
 'omotezuka-2':'御廟表塚古墳',
 'omotezuka-moat':'御廟表塚古墳の濠',
 'omotezuka-moat-2':'御廟表塚古墳の濠',
 'mozu-hachiman':'百舌鳥八幡宮',
 'kusunoki':'百舌鳥八幡宮のクスノキ',
 'kusunoki-2':'百舌鳥八幡宮のクスノキ',
 'furuichi':'高尾山から見た古市古墳群',
 'wh-monument':'百舌鳥・古市古墳群の世界遺産記念碑',
 'wh-monument-2':'百舌鳥・古市古墳群の世界遺産記念碑',
 'wh-flag':'世界遺産登録を祝う旗（百舌鳥駅）',
 'konda-haisho':'応神天皇陵古墳の拝所',
 'konda-haisho-2':'応神天皇陵古墳の拝所',
 'daisen-b1':'気球から見た仁徳天皇陵古墳','daisen-b2':'気球から見た仁徳天皇陵古墳','daisen-b3':'気球から見た仁徳天皇陵古墳','daisen-b4':'気球から見た仁徳天皇陵古墳','daisen-b5':'気球から見た仁徳天皇陵古墳','daisen-b6':'気球から見た仁徳天皇陵古墳','daisen-b7':'気球から見た仁徳天皇陵古墳',
 'daisen-z1':'仁徳天皇陵古墳の全景','daisen-z2':'仁徳天皇陵古墳の全景','daisen-h1':'仁徳天皇陵古墳の拝所','daisen-h2':'仁徳天皇陵古墳の拝所','daisen-h3':'仁徳天皇陵古墳の拝所','daisen-h4':'仁徳天皇陵古墳の拝所','daisen-h5':'仁徳天皇陵古墳の拝所','daisen-2024':'仁徳天皇陵古墳（2024年）',
 'moat-1':'百舌鳥古墳群めぐりの道','moat-2':'百舌鳥古墳群めぐりの道','moat-3':'百舌鳥古墳群めぐりの道','moat-4':'百舌鳥古墳群めぐりの道','moat-5':'百舌鳥古墳群めぐりの道','moat-6':'百舌鳥古墳群めぐりの道',
 'mozu-aster':'衛星から見た百舌鳥古墳群（ASTER）','sakai-city':'堺市の街並み','sakai-museum':'堺市博物館','kamiishizu':'履中天皇陵古墳（上石津ミサンザイ古墳）','kamiishizu-h':'履中天皇陵古墳の拝所','konda':'空から見た応神天皇陵古墳（誉田御廟山古墳）','nisanzai':'土師ニサンザイ古墳',
 'goshiki-1':'五色塚古墳（神戸市）','goshiki-2':'五色塚古墳の葺石と埴輪','goshiki-3':'五色塚古墳','pyramid':'クフ王のピラミッド','pyramid-2':'クフ王のピラミッド','qin':'秦の始皇帝陵',
 'haniwa-early':'古墳時代の円筒埴輪（東京国立博物館）','haniwa-inari':'円筒埴輪（稲荷古墳）','haniwa-takara':'円筒埴輪（宝塚2号墳）','haniwa-warrior':'挂甲の武人の埴輪','haniwa-horse':'馬の埴輪（東京国立博物館）','haniwa-house':'子持家形埴輪（西都原古墳群）',
 'helmet-met':'古墳時代の冑（メトロポリタン美術館）','helmet-ise':'古墳時代の冑（伊勢国出土）','cuirass':'古墳時代の短甲（江田船山古墳出土・東京国立博物館）','sarcophagus':'長持形石棺（お富士山古墳・復元）',
 'mirror-1':'古墳時代の鏡（東京国立博物館）','mirror-2':'古墳時代の鏡（東京国立博物館）','glass-bowl':'伝安閑天皇陵出土のガラス碗（東京国立博物館）',
 'nintoku-gekko':'尾形月耕「仁徳天皇」','nintoku-chikanobu':'楊洲周延「東錦昼夜競 仁徳天皇」','nintoku-matsuoka':'松岡寿「仁徳天皇」','kozu-1910':'1910年ごろの高津宮','kozu':'高津宮（大阪市）',
 'nihonshoki':'日本書紀（田中本）','songshu':'宋書','shrike':'モズ（堺市）','deer':'ニホンジカ','mfa':'ボストン美術館','mfa-2':'ボストン美術館','boston':'ボストンの街並み','tenshin-en':'ボストン美術館の日本庭園「天心園」','okakura':'岡倉天心','book-of-tea':'『茶の本』（1906年）の扉','iha':'宮内庁','gosashi':'五社神古墳（神功皇后陵）','meiji-drawing':'仁徳天皇陵古墳 石室・石棺図（複製）','nintoku-02':'仁徳天皇陵古墳の世界遺産の表示','kisaragi-1':'仁徳天皇陵古墳の拝所と濠','kisaragi-2':'仁徳天皇陵古墳の濠','moat-7':'百舌鳥古墳群めぐりの道','daisen-park':'大仙公園','daisen-park-2':'大仙公園の日本庭園','moat-8':'百舌鳥古墳群の案内板','moat-9':'百舌鳥古墳群めぐりの道','moat-10':'仁徳天皇陵古墳の濠','moat-11':'百舌鳥古墳群めぐりの道','moat-12':'百舌鳥古墳群めぐりの道','moat-13':'百舌鳥古墳群の案内板','park-3':'大仙公園','park-4':'大仙公園','kisaragi-3':'仁徳天皇陵古墳の濠','kisaragi-4':'仁徳天皇陵古墳の濠',
}
bottom = {'toda','liu-yu','qin-portrait','masuda','haniwa-woman','haniwa-woman-2','haniwa-young','haniwa-shieldman','tanuki','book-of-tea','nintoku-gekko','nintoku-chikanobu','nintoku-matsuoka','okakura','haniwa-warrior','deer'}
contain = {'sue-jar','sue-jar-2','suemura-cup','suemura-pot','suemura-spout','haniwa-woman','haniwa-woman-2','haniwa-young','haniwa-shield','haniwa-shieldman','magatama','izumi-zue','toda','goguryeo','silla-crown','baekje-burner','liu-yu','qin-portrait','silla-jar-bm','masuda','iron-swords','bell-mirror','otsukayama-armor','otsukayama-beads','sumo','muroto','mint','moat-8','meiji-drawing','nintoku-gekko','nintoku-chikanobu','nintoku-matsuoka','okakura','book-of-tea','nihonshoki','songshu','mozu-aster','haniwa-inari','haniwa-takara','haniwa-warrior','haniwa-horse','helmet-met','helmet-ise','cuirass','mirror-1','mirror-2','glass-bowl','goshiki-3','kozu-1910'}
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
