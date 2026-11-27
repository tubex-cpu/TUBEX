# 資料表・制作メモ：もしも史上最大の隕石が東京に落ちたら

- 調査日：2026-11-27。調査担当：Claude Code（チャンネル：世界をズラす／3D「もしも」動画、11〜15分）
- 企画の前提（承認済みコピー）：D1「東京駅に／隕石が落ちたら」（もしも東京駅に隕石が落ちたら？ 落ちた瞬間から1日後まで）、D2'「東京駅に隕石／23区はどうなる」、D3「史上最大の隕石が／東京に」。「史上最大」＝記録に残る最大の天体衝突である **1908年のツングースカ大爆発**を、そのまま東京駅の上空に置く「もしも」。
- **確認の状態**
  - 「確認済み（ウィキペディア上の記述）」：en.wikipedia.org／ja.wikipedia.org の本文（`action=raw` で取得した原文）を開いて読んだもの。引用は原文のまま。ウィキペディアが引いている原論文・NASA の原文は開いていない。画面に数字を出す前に、可能なら原資料で確かめる。
  - 「計算」：確認済みの数字（座標・面積・音速）から Claude が計算したもの。出典の数字ではない。
  - 「検索結果のみ」：検索エンジンの抜粋・要約しか見ていないもの。原文は開いていない。確認済みとして扱わない。
- **開けなかったホスト（名前解決できず＝この環境のネットワークで許可されていない）**：science.nasa.gov、www.nasa.gov、ntrs.nasa.gov、cneos.jpl.nasa.gov、www.jpl.nasa.gov、earthobservatory.nasa.gov、solarsystem.nasa.gov、www.esa.int、neo.ssa.esa.int、www.nature.com、www.science.org、arxiv.org、www.sciencedirect.com、phys.org、meetingorganizer.copernicus.org、impact.ese.ic.ac.uk（Imperial College / Purdue「Impact: Earth!」）、www.purdue.edu、www.sandia.gov・newsreleases.sandia.gov、www.rmg.co.uk、www.britannica.com、www.space.com、www.reuters.com、www.bbc.com、www.nhk.or.jp、www.jaxa.jp、www.spaceguard.or.jp、www.nao.ac.jp、www.gsi.go.jp（国土地理院）、www.stat.go.jp、www.metro.tokyo.lg.jp（東京都）、www.data.jma.go.jp、www.nationalacademies.org ほか。ネットワークの設定は変えていない。
- **開けたホスト**：en.wikipedia.org、ja.wikipedia.org（ほかに www.mlit.go.jp・www.nippon.com は開けるが今回の内容はない）。
- **主な資料（開いて読んだもの）**
  - 「Tunguska event」https://en.wikipedia.org/wiki/Tunguska_event （以下「英W-ツングースカ」）
  - 「ツングースカ大爆発」https://ja.wikipedia.org/wiki/ツングースカ大爆発 （以下「日W-ツングースカ」）
  - 「Chelyabinsk meteor」https://en.wikipedia.org/wiki/Chelyabinsk_meteor （以下「英W-チェリャビンスク」）
  - 「2013年チェリャビンスク州の隕石落下」https://ja.wikipedia.org/wiki/2013年チェリャビンスク州の隕石落下 （以下「日W-チェリャビンスク」）
  - 「東京都区部」「東京都」「Template:自治体面積/東京都」「東京駅」ほか各駅の記事（ja.wikipedia.org）、「Speed of sound」「2008 TC3」「2023 CX1」「2024 BX1」「2024 RW1」「2024 XA1」「2024 YR4」「Double Asteroid Redirection Test」「Near-Earth object」（en.wikipedia.org）
- **記号**：【F◯】出典のある事実／【C◯】確認済みの数字からの計算／【R◯】推論。推論は語りで事実として言い切らない。使うときは `03_plan.md` の「もしもの仮定」として扱う。
- **「もしも」の性質**：東京で同じことが起きた場合の被害・経過を出典で示した資料は見つけていない（下の 1-7）。東京の場面はすべて「ツングースカで実際に起きたこと（F）」と「チェリャビンスクで都市に実際に起きたこと（F）」を、東京の距離（C）に重ねた仮定（R）。死傷者の数は作らない・出さない。

---

## 1. 資料表

### 1-1. ツングースカ大爆発（1908年）：いつ・何が

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F1 | 1908年6月30日（当時のロシアのユリウス暦では6月17日）の朝、現地時間7時14分頃（世界時0時14分）、中央シベリアで起きた大爆発 | 英W-ツングースカ 冒頭「occurred on the morning of 30 June 1908, at around 7:14 KRAT (0:14 UT) in Central Siberia」、脚注「the event was thus dated to 17 June 1908」 | 確認済み（ウィキペディア上の記述） | 企画書のみ（台本で日付は言わない＝ルール⑧） |
| F2 | 日本語版は時刻を「7時2分（現地時間）頃」と書く（英語版の7時14分と食い違う） | 日W-ツングースカ「1908年6月30日7時2分（現地時間）頃」 | 確認済み（ウィキペディア上の記述） | 時刻は使わない（「朝」までにする） |
| F3 | 人のまばらなタイガ（針葉樹林）の奥で起きた | 英W-ツングースカ「The cataclysm occurred in a remote and sparsely populated region of the taiga」 | 確認済み（ウィキペディア上の記述） | 「なぜ記録が少ないか」の一言 |
| F4 | 現代に記録された地球最大の天体衝突で、記録上最も強い爆発の一つ | 英W-ツングースカ「The Tunguska event thus constitutes both the most violent impact event on Earth recorded in modern times and one of the most powerful explosions ever documented.」 | 確認済み（ウィキペディア上の記述） | D3「史上最大」の根拠（「記録に残る中で最大」） |
| F5 | 地面に落ちる前に空中で爆発した（空中爆発）。破片は正式には見つかっていない。正体が小惑星か彗星かは議論が続く | 英W-ツングースカ「The scientific consensus thus attributes this event to a meteor air burst … although no fragment has been formally identified.」「whether it was an asteroid or a comet—is still debated.」 | 確認済み（ウィキペディア上の記述） | 冒頭の「落ちる」の中身（地面に当たらない） |

### 1-2. 大きさ・エネルギー・高さ

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F6 | 直径50〜60mの天体が南東から高速で来て、高度5〜10kmで爆発。エネルギーはTNT換算で10〜15メガトンとされることが多く、大都市をまるごと壊せる規模 | 英W-ツングースカ「researchers favor the hypothesis of a 50–60 m diameter meteoroid moving at high speed from the south-east. The object would have exploded between 5–10 km in altitude, releasing an energy often estimated between 10 and 15 megatons of TNT, which is enough to destroy an entire major city.」 | 確認済み（ウィキペディア上の記述） | 冒頭（大きさ・高さ） |
| F7 | エネルギーの推定は3〜30メガトンの幅。運動量を入れた計算では3〜5メガトン、2019年の論文は20〜30メガトン | 英W-ツングースカ「Estimates of its energy have ranged from 3–30 megatons of TNT.」「estimate that the air burst had an energy range of 3–5 Mt」「A 2019 paper suggests the explosive power of the Tunguska event may have been around 20–30 Mt.」 | 確認済み（ウィキペディア上の記述） | 企画書のみ（語りで推計の幅に触れない＝ルール②） |
| F8 | 日本語版：直径50〜60m。破壊力は3〜30メガトンと考えられていたが、後に5メガトン程度と特定。別の記述では質量約10万トン・直径50〜100mの天体が地表から6〜8km上空で爆発 | 日W-ツングースカ「直径50 - 60メートルの隕石が大気中で爆発して」「破壊力はTNT換算で3 - 30メガトンの範囲と考えられていたが、後に5メガトン程度と特定された」「質量約10万トン・直径50 - 100メートルの天体が地表から6 - 8キロメートル上空で爆発」 | 確認済み（ウィキペディア上の記述） | 企画書のみ |
| F9 | NASA エイムズ研究センターの2018年のワークショップ（2019年公表）：チェリャビンスクのような石質の小惑星なら直径およそ50〜80m、エネルギーは10〜20メガトン、高度約10kmで空中爆発 | 検索結果（https://ntrs.nasa.gov/citations/20190002302 ・ https://www.nasa.gov/solar-system/tunguska-revisited-111-year-old-mystery-impact-inspires-new-more-optimistic-asteroid-predictions/ 、抜粋「the diameter was roughly 50-80m」「an energy of 10-20 Megatons, released in an airburst at a height of about 10 km」） | 検索結果のみ（ホストに接続できず） | 使わない（確認後なら企画書の「大きさ」） |
| F10 | 15メガトンの推定は、トリニティ核実験の約1,000倍、1954年のキャッスル・ブラボー（15.2メガトン）とほぼ同じ | 英W-ツングースカ「The 15-megaton (Mt) estimate represents an energy about 1,000 times greater than that of the Trinity nuclear test, and roughly equal to that of the United States' Castle Bravo nuclear test in 1954 (which measured 15.2 Mt)」 | 確認済み（ウィキペディア上の記述） | **使わない**（核兵器の比較は避ける。下の配慮4） |

### 1-3. 爆発の瞬間〜数分（ツングースカで実際に起きたこと）

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F11 | 太陽より明るく大きく見える火球が、少なくとも1,000kmにわたって大気を横切った。南東から北西へ細く白い尾を引き、600〜1,500km離れた場所からも見えた（その日は快晴） | 英W-ツングースカ「a bolide, described by several witnesses as having a brightness and apparent size greater than that of the Sun, traversed Earth's atmosphere over a distance of at least 1000 km」「the object was seen across Central Siberia from a distance of up to 600 to 1500 km」 | 確認済み（ウィキペディア上の記述） | 0秒の直前（空を横切る光） |
| F12 | 耳をつんざく爆発音。赤い強い光、火の柱、数十kmの高さまで上る煙の雲 | 英W-ツングースカ「a powerful and deafening explosion was heard」「accompanied by an intense reddish glow … while generating a column of fire and a cloud of smoke rising tens of kilometers into the air」 | 確認済み（ウィキペディア上の記述） | 0秒（火の柱・煙） |
| F13 | 日本語版：キノコ雲は数百km離れた場所からも見えた | 日W-ツングースカ「爆発によって生じたキノコ雲は数百キロメートル離れた場所からも目撃され」 | 確認済み（ウィキペディア上の記述） | 0秒〜数分 |
| F14 | 2,150km²を超える範囲で数百万本の木がなぎ倒された | 英W-ツングースカ「flattening several million trees over an area of more than 2150 km2」 | 確認済み（ウィキペディア上の記述） | 東京の比較（C1） |
| F15 | なぎ倒された範囲の面積は「東京都とほぼ同じ面積」（日本語版の記述） | 日W-ツングースカ「約2,150平方キロメートル（東京都とほぼ同じ面積）の範囲の樹木がなぎ倒された」 | 確認済み（ウィキペディア上の記述） | D3 の核（東京都がまるごと） |
| F16 | 木は放射状に倒れ、中心のまわりに2枚の「蝶の羽」の形を作った。羽を広げた蝶の形で「翼幅」70km・「胴の長さ」55km（1960年代の調査） | 英W-ツングースカ「the trees were felled in a radial pattern forming the characteristic shape of two "butterfly wings" around the central area」「its shape resembling a gigantic spread-eagled butterfly with a "wingspan" of 70 km and a "body length" of 55 km」 | 確認済み（ウィキペディア上の記述） | 1日後の上空からの景色 |
| F17 | 爆心の真下の木は枝をはぎ取られたが立ったまま残った（約8kmの範囲）。外側の木は焦げて、中心から外向きに倒れた | 英W-ツングースカ「At the epicenter itself, the blast stripped the trees of their branches but left them standing」「a zone, roughly 8 km across, where the trees were scorched and devoid of branches, but still standing upright. Trees farther from the centre had been partly scorched and knocked down away from the centre」 | 確認済み（ウィキペディア上の記述） | 意外性の核（真下だけ立っている）。※「電信柱の森」という呼び名は今回の資料に見当たらない |
| F18 | 最初の熱の波で山火事がところどころ起き、熱は爆心から約80km先でも感じられた | 英W-ツングースカ「The initial thermal pulse simultaneously ignited several sporadic fires, with its heat felt up to about 80 km from the epicenter.」 | 確認済み（ウィキペディア上の記述） | 0秒（熱の距離・C3） |
| F19 | 日本語版：爆心から半径約30〜50kmの森林が炎上 | 日W-ツングースカ「爆心地から半径約30 - 50キロメートルの森林が炎上」 | 確認済み（ウィキペディア上の記述） | 数分〜数時間（燃える範囲・C3） |
| F20 | 衝撃波は800km以上先でも感じられ、半径200km近くまで窓ガラスを割った。同じくらいの距離で揺れが人を地面に倒した | 英W-ツングースカ「Perceived over 800 km away, the shock wave spread over hundreds of kilometers and shattered windows within a radius of nearly 200 km. At similar distances, the tremors knocked people down or threw them to the ground.」 | 確認済み（ウィキペディア上の記述） | 数分（窓が割れる距離・C4） |
| F21 | 日本語版は「1,000キロメートル離れた家の窓ガラスも割れた」と書く（英語版の約200kmと食い違う） | 日W-ツングースカ「1,000キロメートル離れた家の窓ガラスも割れた。」 | 確認済み（ウィキペディア上の記述） | **使わない**（食い違い。英語版の200kmを使う） |
| F22 | 爆心から約60km南の村ヴァナヴァラの交易所。セミョーノフの証言（1930年の手紙）：朝食の時間にポーチに座って北を見ていた。北の空が二つに裂け、森の上の北の空一面が火に覆われたように見えた。「その瞬間、シャツに火がついたような強い熱を感じた」。シャツを脱ごうとした瞬間に空で破裂音がして、約3サージェン（約6m）ポーチから地面へ投げ飛ばされ、一瞬気を失った。石が空から降るような音、大砲のような熱い風。あとで多くの窓ガラスが吹き飛び、納屋の扉の鉄の留め金が壊れていた | 英W-ツングースカ「Vanavara, located about 60 km south of the epicenter」、証言「I was sitting in the porch of the house at the trading station of Vanovara at breakfast time and looking towards the north.」「the sky was split in two, and high above the forest the whole northern part of the sky appeared to be covered with fire. At that moment I felt great heat as if my shirt had caught fire」「I was thrown on to the ground about three sajenes [around six meters] away from the porch and for a moment I lost consciousness.」「a hot wind, as from a cannon, blew past the huts from the north」「many panes in the windows had been blown out, and the iron hasp in the door of the barn had been broken.」 | 確認済み（ウィキペディア上の記述。証言の訳は Claude） | 熱→音→風の順番（C2）の具体場面。※依頼メモの「椅子から投げ出された」は原文では「ポーチから地面へ」 |
| F23 | 爆心近くのエヴェンキの証言（チュチャン、1926年の記録）：テントの中で何かに押され、口笛のような音と強い風。木が倒れ、針葉・枯れ木・トナカイゴケが燃え、「とても熱かった」。快晴の朝に「二つ目の太陽」が現れたように光り、雷のような音が何度も続いた | 英W-ツングースカ「We heard a whistling sound and felt a strong wind.」「trees were falling, their needles were burning, dry wood on the ground was burning, reindeer moss was burning.」「as if a second sun appeared」 | 確認済み（ウィキペディア上の記述） | 0秒（二つ目の太陽）。犠牲の描写は使わない |
| F24 | 少なくとも3人が亡くなり、多くのトナカイ・犬も死んだ。爆心周辺は人がまばらだったが、けが人の数は分からない。窓ガラスは数百km先まで割れたが、ガラスによるけがの報告はない | 英W-ツングースカ「killed at least three people as well as numerous animals」「the event caused an unknown number of injuries」「no injuries caused by shattered glass were reported, despite windows being broken hundreds of kilometers from the epicenter.」 | 確認済み（ウィキペディア上の記述） | 企画書のみ（語りで死者数は言わない） |

### 1-4. 同じ日〜数日後（遠くで起きたこと）

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F25 | 地震計：ロシア帝国のイルクーツク・タシケント・ティフリスと、ドイツのイエナで記録。揺れはマグニチュード5近くに相当（後年の推定） | 英W-ツングースカ「recorded by seismological stations in three cities in the Russian Empire—Irkutsk, Tashkent, and Tiflis—as well as by a station in Jena」「equivalent to a seismic magnitude near 5」 | 確認済み（ウィキペディア上の記述） | 数分〜1時間（遠くの針が揺れる） |
| F26 | 気圧計：大気の波が世界中の気圧計で記録された。ベルリン・ポツダム、ロンドン、ザグレブなど。バタヴィア（今のインドネシア）やワシントンD.C.でも気圧の変化（1908年との結び付けは1930年代） | 英W-ツングースカ「Atmospheric waves generated by the blast were also detected by barographs across the world」「as well as in London, England, and Zagreb, Croatia」「as far as Batavia … and Washington, D.C.」 | 確認済み（ウィキペディア上の記述） | 数時間（地球を回る空気の波）。到達時刻の出典はない |
| F27 | 6月30日の夜から7月3日まで、西ユーラシアの約1,200万km²で異常に明るい夜。真夜中に明かりなしで新聞が読め、記念碑を撮影できた。空は白・桃色・赤・金色・緑など。南はボルドー・タシケント、北はアバディーン・ストックホルムまで | 英W-ツングースカ「From 30 June to 3 July, intense bright nights were observed across western Eurasia over an area of about 12000000 km2」「it became possible to read a newspaper or photograph monuments around midnight without artificial lighting」 | 確認済み（ウィキペディア上の記述） | その夜（明るい夜）。※依頼メモの「アジアも」は日本語版の「アジアからヨーロッパにかけて」 |
| F28 | 日本語版：ロンドンでは真夜中に明かりなしで新聞を読めるほどだった。爆発した物質が巨大な夜光雲を作り、アジアからヨーロッパの広い範囲で数夜にわたり夜空が明るくなった | 日W-ツングースカ「ロンドンでは真夜中に人工灯火なしに新聞を読めるほどであった」「巨大な夜光雲を形成したため、アジアからヨーロッパにかけての広い範囲で爆発から数夜に」 | 確認済み（ウィキペディア上の記述） | その夜 |
| F29 | 明るい夜は2〜3日で薄れ、光の輪（ハロ）はさらに約10日続き、夕焼けの異常は1908年の夏の終わりまで見えた。天文学者が空が明るすぎて観測をやめた（英国ブリストル） | 英W-ツングースカ「While the bright nights faded in two or three days, luminous halos persisted for about ten days longer」「reported having to abandon their astronomical observations due to the unusual brightness of the sky」 | 確認済み（ウィキペディア上の記述） | 1日後〜の空（エンディングの余韻） |

### 1-5. その後の調査（クレーターがない）

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F30 | 最初の調査は1921年、クーリックが率いた（中心には行けなかった）。1927年の調査で爆心を見つけた | 英W-ツングースカ「it was not until 1921 that a first scientific expedition was organized under the direction of Leonid Kulik, who discovered the site of the epicenter only in 1927.」、日W-ツングースカ「1927年 - 助手G・P・ギューリッヒとともに、大規模な倒木地帯の中心を発見する。」 | 確認済み（ウィキペディア上の記述） | 企画書（台本では年を言わない） |
| F31 | 1927年、クレーターを予想して中心へ行ったが、爆心にクレーターはなかった | 英W-ツングースカ「where they expected to find an impact crater. To their surprise, there was no crater at ground zero.」、日W-ツングースカ「4回の探検ではクレーター（隕石孔）や隕石の破片など隕石落下説を裏付ける証拠は発見できなかった。」 | 確認済み（ウィキペディア上の記述） | 1日後（穴がない東京駅）＝意外性 |
| F32 | 「8,000万本の木」という広く知られた数字は、エネルギーと天体の大きさを過大に見積もった根拠の弱い数字 | 英W-ツングースカ（「80 million」を扱う節。1982年の論文が起点） | 確認済み（ウィキペディア上の記述） | **使わない**（本数は「数百万本」F14 まで） |

### 1-6. チェリャビンスク（2013年）：都市の上で実際に起きたこと

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F33 | 2013年2月15日、現地時間9時20分頃。直径約18m・約9,100トンの小惑星が、浅い18度の角度、秒速約19.2kmで大気に入った（NASA の推定は直径17〜20m） | 英W-チェリャビンスク 冒頭「on 15 February 2013 at about 09:20 YEKT」「an approximately 18 m, 9100 t near-Earth asteroid that entered the atmosphere at a shallow 18‐degree angle with a speed relative to Earth of about 19.16 km/s」、英W-ツングースカ「an asteroid that measured about 17–20 m across」 | 確認済み（ウィキペディア上の記述） | 比較（小さくても都市に何が起きるか） |
| F34 | 光は一時的に太陽より明るく、100km先からも見えた。強い熱を感じた人がいた | 英W-チェリャビンスク「The light from the meteor was briefly brighter than the Sun … visible as far as 100 km away.」「Some eyewitnesses also reported feeling intense heat from the fireball.」 | 確認済み（ウィキペディア上の記述） | 0秒（朝なのに影ができる） |
| F35 | 日本語版：一時的に太陽より明るくなり、朝の地上に影を作るほど輝いた。ドライブレコーダーに写った | 日W-チェリャビンスク「物体は一時的に太陽より明るくなり、朝の地上に影を作り出すほどに輝いていた。」 | 確認済み（ウィキペディア上の記述） | 0秒 |
| F36 | 高度約30kmで空中爆発。エネルギーはTNT換算400〜500キロトン（広島の原爆の約30倍） | 英W-チェリャビンスク「at a height of about 30 kilometres」「equivalent to the blast yield of 400–500 kilotons of TNT」 | 確認済み（ウィキペディア上の記述） | 比較。広島との比較は使わない（配慮4） |
| F37 | NASA の発表（ウィキペディアの引用）：最も明るくなった瞬間（9時20分33秒）は高度23.3km、秒速約18.6km＝音速のほぼ60倍 | 英W-チェリャビンスク「at peak brightness (at 09:20:33 local time), the meteor was 23.3 km high … travelling at about 18.6 km/s – almost 60 times the speed of sound.」 | 確認済み（ウィキペディア上の記述。NASA 原文は未確認） | 物理（音速の60倍） |
| F38 | 明るい閃光は約5秒 | 英W-チェリャビンスク「lasted about five seconds」 | 確認済み（ウィキペディア上の記述） | 0〜5秒 |
| F39 | 衝撃波は閃光の数分後に来た。チェリャビンスク周辺には2分23秒未満（要出典の記述）〜2分57秒後に到達 | 英W-チェリャビンスク「when the shock wave arrived, minutes after the superbolide's flash」「first reached Chelyabinsk and environs between less than 2 minutes 23 seconds[citation needed] and 2 minutes 57 seconds later.」 | 確認済み（ウィキペディア上の記述。2分23秒は要出典） | 「光ってから音が来るまで」 |
| F40 | 日本語版：南ウラル大学では閃光から2分25秒後に衝撃波が到達 | 日W-チェリャビンスク「たとえば南ウラル大学では、閃光から2分25秒後に衝撃波が到達している。」 | 確認済み（ウィキペディア上の記述） | 同上（具体の地点） |
| F41 | 1,491人が治療を求めるほどのけが。すべて間接的な原因で、主に衝撃波で内側に吹き込んだ窓ガラス。6都市の約7,200棟が損傷。死者の報告はない | 英W-チェリャビンスク「1,491 people were injured seriously enough to seek medical treatment. All of the injuries were due to indirect effects … mainly from broken glass from windows that were blown in when the shock wave arrived」「Around 7,200 buildings in six cities」「No deaths were reported.」 | 確認済み（ウィキペディア上の記述） | 企画書のみ（語りでけが人の数は言わない）。建物の数はテロップ可 |
| F42 | 光に驚いて何が起きたか見ようと窓に集まった人が多く、そこでガラスで切った（非常事態省の報道官。AP 記事のウィキペディア引用） | 英W-チェリャビンスク 脚注の引用「Emergency Situations Ministry spokesman Vladimir Purgin said many of the injured were cut as they flocked to windows to see what caused the intense flash of light, which was momentarily brighter than the sun.」 | 確認済み（ウィキペディア上の記述。AP 原文は未確認） | 意外性の核（光ってから数分、人は窓へ行く） |
| F43 | 教師カルビシェワは、光の正体が分からないまま生徒44人を窓から離し、机の下に伏せさせてから外へ出した | 英W-チェリャビンスク「saving 44 children from imploding window glass cuts」「ordering her students to stay away from the room's windows and to perform a duck and cover manoeuvre」 | 確認済み（ウィキペディア上の記述） | 参考（実在の個人。描くなら名前を出さない） |
| F44 | ガラスが割れた範囲は経路に直角な南北に広く、南北180km・東西80km。合計4,474棟で窓ガラスやドアの被害（集合住宅3,724棟、教育施設631） | 日W-チェリャビンスク「南北180 km、東西80 km に及んだ」「合計4474棟の建物の窓ガラスが割れたりドアが吹き飛ぶなどの被害」 | 確認済み（ウィキペディア上の記述。英語版の7,200棟とは数え方が違う） | 数分後（割れる範囲の形） |
| F45 | その後：−15℃前後の寒さの中、割れた窓を手近なもので塞いだ。学校・幼稚園は休校。携帯電話が一時使えなくなった。段ボールやシートで穴を塞いだ家もある | 英W-チェリャビンスク「quickly sought to cover the openings with anything available, to protect themselves against temperatures of -15 °C」、日W-チェリャビンスク「休校措置がとられた」「一時的に携帯電話が使用できなくなった」「段ボールやシートで穴をふさぐ応急処置」 | 確認済み（ウィキペディア上の記述） | 1日後（街の景色） |
| F46 | 大気に入る前には見つかっていなかった（来た方向が太陽に近かったことが一因） | 英W-チェリャビンスク「The object approached Earth undetected before its atmospheric entry, in part because its radiant (source direction) was close to the Sun.」 | 確認済み（ウィキペディア上の記述） | 冒頭（誰も知らなかった） |
| F47 | 最大の破片はチェバルクリ湖の底から引き上げた654kg | 英W-チェリャビンスク「With a total mass of 654 kg, this is the largest found fragment of the Chelyabinsk meteorite.」 | 確認済み（ウィキペディア上の記述） | 参考 |
| F48 | 現代の観測機器で観測された最大の小惑星の空中爆発は、2013年のチェリャビンスク（500キロトン） | 英W-ツングースカ「The largest asteroid air burst observed with modern instrumentation was the 500 kt Chelyabinsk meteor in 2013」 | 確認済み（ウィキペディア上の記述） | 比較 |

### 1-7. 物理（語りに使える量）

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F49 | 宇宙から大気に入る流星体は、少なくとも秒速11km（地球の脱出速度）で動く | 英W-ツングースカ「travelling at a speed of at least 11 km/s … the escape velocity of the Earth」 | 確認済み（ウィキペディア上の記述） | 物理 |
| F50 | 20℃の空気中の音速は約343m/s（1kmを2.92秒） | https://en.wikipedia.org/wiki/Speed_of_sound 「At 20 °C, the speed of sound in air is about 343 m/s … or 1 km in 2.92 s」 | 確認済み（ウィキペディア上の記述） | C2 の計算の元 |
| F51 | チェリャビンスクでは、大気に入り始めた時刻（9時20分21秒）と最も明るくなった時刻（9時20分33秒）が記事に出る | 英W-チェリャビンスク「began at 09:20:21」（本文）、「at peak brightness (at 09:20:33 local time)」 | 確認済み（ウィキペディア上の記述） | C5 の計算の元 |

### 1-8. 東京の地理（比較の元）

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F52 | 東京都区部（23区）の面積は627.51km²（2025年7月1日時点） | https://ja.wikipedia.org/wiki/東京都区部 「東京都区部（東京23区）の面積は627.51km2（2025年7月1日時点）。」 | 確認済み（ウィキペディア上の記述。国土地理院の原表は未確認） | D2' 23区 |
| F53 | 東京都の面積は2,199.94km²（ウィキペディアのテンプレートの値。本文は国土地理院の面積調によると書く） | https://ja.wikipedia.org/wiki/Template:自治体面積/東京都 「東京都 = 2199.94」、https://ja.wikipedia.org/wiki/東京都 「国土地理院の全国都道府県市区町村別面積調によると」 | 確認済み（ウィキペディア上の記述。国土地理院の原表は未確認） | D3（東京都とほぼ同じ） |
| F54 | 座標（各記事の値）：東京駅（JR東日本）北緯35°40′52″・東経139°46′00″、新宿駅 35°41′27″・139°42′01″、横浜駅 35°27′56.8″・139°37′20.3″、大宮駅 35°54′22.6″・139°37′25.8″、千葉駅 35°36′47″・140°06′50″ ほか（品川・池袋・渋谷・上野・立川・八王子・熊谷・小田原・高崎・前橋・水戸・甲府・筑波山・東京スカイツリー・東京都庁舎・成田国際空港・富士山） | ja.wikipedia.org の各記事の座標（富士山・成田は en.wikipedia.org） | 確認済み（ウィキペディア上の記述） | C1〜C4 の計算の元 |

### 1-9. 宇宙からの見張り（背景）

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F55 | 2008 TC3：直径4.1m・約80トン。衝突の20時間前にカタリナ・スカイサーベイで発見。大気に入る前に衝突が予測された初めての例 | https://en.wikipedia.org/wiki/2008_TC3 「was an 80 t, 4.1 m diameter asteroid」「on October 6, 06:39:51 UTC, 20 hours before the impact」「It was the first time that an asteroid impact had been predicted before its entry」 | 確認済み（ウィキペディア上の記述） | 「見つかるのは数時間前」 |
| F56 | 2023 CX1：1m級。衝突の7時間足らず前に発見（フランス・ノルマンディー沖） | https://en.wikipedia.org/wiki/2023_CX1 「It was discovered less than seven hours before impact」 | 確認済み（ウィキペディア上の記述） | 同上 |
| F57 | 2024 BX1：約0.4m。衝突の3時間足らず前に発見、ベルリン上空で流星になった | https://en.wikipedia.org/wiki/2024_BX1 「It was discovered less than three hours before impact」 | 確認済み（ウィキペディア上の記述） | 同上 |
| F58 | 2024 RW1：1m級。2024年9月にフィリピン付近の西太平洋上で燃え尽きた。衝突が予測された9例目 | https://en.wikipedia.org/wiki/2024_RW1 「is the ninth impact event that was successfully predicted」 | 確認済み（ウィキペディア上の記述） | 同上 |
| F59 | 2024 XA1：2024年12月3日、ツングースカの約1,000km東、シベリアのオリョークミンスク付近に落下。発見から衝突まで約12時間。予測された11例目で、2024年で4例目 | https://en.wikipedia.org/wiki/2024_XA1 「around 1000 km east of the Tunguska event impact location」「The time between discovery and impact was around 12 hours」「the eleventh impact event ever that was successfully predicted, and the fourth in 2024」 | 確認済み（ウィキペディア上の記述） | 同上（ツングースカとつながる） |
| F60 | 2024 YR4：直径53〜67m（JWST で約60m±7m）＝ツングースカの天体とほぼ同じ大きさ。2024年12月に見つかり、追加観測で2032年の地球衝突は事実上否定された | https://en.wikipedia.org/wiki/2024_YR4 「an estimated diameter of 53 to 67 m」「This makes 2024 YR4 around the same size as the asteroid that caused the 1908 Tunguska event」「By 23 February, additional observations effectively ruled out 2024 YR4 impacting Earth in 2032」 | 確認済み（ウィキペディア上の記述） | 企画書のみ（確率は語らない） |
| F61 | DART：NASA の惑星防衛の試験。2022年9月26日、610kgの探査機を小惑星ディモルフォス（約160m）にぶつけ、公転周期を32分短くした（成功の基準は73秒） | https://en.wikipedia.org/wiki/Double_Asteroid_Redirection_Test 「The collision shortened Dimorphos's orbit around Didymos by 32 minutes, greatly in excess of the pre-defined success threshold of 73 seconds.」、「a mass of 610 kg」 | 確認済み（ウィキペディア上の記述） | 参考（エンディングに使うなら） |
| F62 | 直径140m以上の地球接近天体は、2022年末までに推定の約44％しか見つかっていない（2023年の研究） | https://en.wikipedia.org/wiki/Near-Earth_object 「only about 44% of the estimated 35,000 total larger than that have been discovered by the end of 2022」 | 確認済み（ウィキペディア上の記述） | 背景のみ |
| F63 | 直径約30m級の地球接近天体は1％未満しか見つかっていない（JPL の古い発表）。直径約50mの天体は約50万個と推定（2010年の全米アカデミー報告） | 検索結果（https://www.jpl.nasa.gov/news/ten-thousandth-near-earth-object-unearthed-in-space/ 、https://www.nationalacademies.org/read/12842/chapter/5 ） | 検索結果のみ（ホストに接続できず） | 使わない（確認後なら背景） |

### 1-10. 背景のみ（語り・テロップに使わない）

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F64 | ツングースカ級（5〜15メガトン）の頻度：シューメーカーは約300年に1回、より新しい推定は約1,000年に1回 | 英W-ツングースカ「Tunguska-sized events occur about once every 300 years. More recent estimates place Tunguska-sized events at about once every thousand years」 | 確認済み（ウィキペディア上の記述） | **使わない**（確率・予測は語らない） |
| F65 | ツングースカ級が都市の上で起きた場合の試算：ロンドン中心ならM25（環状道路）の内側が壊れる（英国王立博物館群グリニッジのブログ）、保険のモデル会社RMSがマンハッタンに被害範囲を重ねた（Risk & Insurance）、など | 検索結果（https://www.rmg.co.uk/stories/space-astronomy/tunguska-event 、https://riskandinsurance.com/raining-down-destruction/ ） | 検索結果のみ（ホストに接続できず） | **使わない**（死者数の推計を含む。原文未確認） |
| F66 | 東京を対象にした Imperial College / Purdue「Impact: Earth!」の出力を引いた報道・資料 | 見つからず（ホストに接続できず） | 未確認 | 使わない |

---

## 2. 計算（確認済みの数字から Claude が計算。出典の数字ではない）

| 番号 | 内容 | 元 |
|---|---|---|
| C1 | **倒れた森の広さ 2,150km² ＝ 東京都 2,199.94km² の約98％、23区 627.51km² の約3.4倍**。同じ面積の円なら半径約26km（23区と同じ面積の円は半径約14km） | F14・F52・F53 |
| C2 | **東京駅からの直線距離**（球面上の距離、地球半径6,371km）：上野3.8km、東京スカイツリー5.1km、新宿6.1km、品川6.4km、渋谷6.4km、都庁6.8km、池袋7.4km、横浜27.3km、大宮28.2km、立川31.9km、千葉32.3km、八王子38.3km、成田空港56.6km、熊谷61.2km、筑波山67.8km、小田原72.8km、高崎98.4km、水戸99.8km、前橋99.9km、富士山100.6km、甲府108.2km | F54 |
| C3 | 距離をツングースカの実際の範囲に重ねると：森林が燃えた半径30〜50km（F19）の内側に横浜・大宮・千葉・立川・八王子が入る。熱を感じた約80km（F18）の内側に成田・熊谷・筑波山・小田原が入る。ヴァナヴァラ（約60km、F22）と同じ距離はおよそ成田空港〜熊谷 | F18・F19・F22・C2 |
| C4 | 窓が割れた半径約200km（F20）は、前橋・水戸・甲府（約100〜108km）のさらに外まで届く。チェリャビンスクのガラスの範囲（南北180km×東西80km、F44）も同じ規模 | F20・F44・C2 |
| C5 | **音（衝撃波）の到着の目安**（音速343m/sで計算。爆心近くの衝撃波は音より速いので、近い場所ほど実際は早い）：真下の高度5〜10km（F6）まで約15〜29秒、新宿6.1kmまで約18秒、横浜・大宮（約28km）まで約80秒、千葉32kmまで約94秒、60km（成田〜熊谷）まで約3分。チェリャビンスクの実測は閃光から2分25秒〜2分57秒（F39・F40） | F6・F39・F40・F50・C2 |
| C6 | チェリャビンスクの大気に入り始め（9時20分21秒）から最も明るい瞬間（9時20分33秒）まで約12秒。速さは秒速約19km（F33）＝1秒で東京駅から新宿の3倍以上進む | F33・F37・F51・C2 |

---

## 3. 推論（「もしも」の仮定。語りで事実として言い切らない）

- **R1（落ちても穴はあかない）**：F5・F17・F31 から、ツングースカ級は地面に当たらず空で爆発し、真下には穴がなく、真下の木だけが立ったまま残った。東京駅の真上で同じことが起きれば「穴はない。真下だけ建物の骨組みが立ったまま、外側が外向きに倒れる」景色が組める。ただし建物で同じことが起きるかの出典はない（木の事実を街に置き換えた仮定）。
- **R2（光→熱→音→風の順番に時間差がある）**：F22（シャツが燃える熱のあとに破裂音、そして熱い風）と F39・F40（閃光の2分25秒〜2分57秒後に衝撃波）と C5 から、東京駅から離れるほど「光ってから音が来るまで」が長くなる。新宿は十数秒、横浜・大宮は1分あまり、成田は3分ほど、という時間差の場面は、計算（C5）に基づく仮定。
- **R3（人は窓へ行く）**：F42 から、閃光から衝撃波までの数十秒〜数分の間に、人が何が起きたかを見に窓へ集まる。東京の高層ビルの窓辺に人が集まる場面は、チェリャビンスクで実際に起きた行動をなぞる仮定。
- **R4（東京都がまるごと蝶の形に倒れる）**：F15・F16・C1 から、倒れた範囲は東京都とほぼ同じ面積で、形は円ではなく翼幅70km・胴55kmの蝶形。どちら向きに置くかは F6（南東から来た）を手がかりにした仮定。23区（C1：約3.4倍）はすっぽり内側に入る。
- **R5（その夜、遠くの街が明るい）**：F27〜F29 から、1日後までの間に、遠く離れた土地で真夜中に新聞が読めるほど空が明るくなる。日本の上空で同じことが起きる場所・明るさの出典はない（ヨーロッパの事実を置き換えた仮定）。
- **R6（誰も知らなかった）**：F46 と F55〜F59 から、見つかった例でも数時間〜20時間前、チェリャビンスクは見つからないまま来た。「警報がないまま朝が来る」は事実に沿うが、ツングースカ級が今来た場合に何時間前に見つかるかの出典はない（F63 は未確認）。予言にしない。

## 4. 「落ちた瞬間から1日後まで」の時間軸（事実の番号つき）

| 時点（目安） | 景色 | 根拠 |
|---|---|---|
| −10秒前後 | 朝の空を、太陽より明るい光が白い尾を引いて横切る。秒速十数〜20km | F11・F33・F34・F49・C6 |
| 0秒 | 東京駅の上空5〜10kmで爆発。二つ目の太陽のような閃光（約5秒）。朝なのに影ができる。火の柱と煙が数十kmの高さへ | F6・F12・F23・F35・F38 |
| 0〜数秒 | 熱：60km先でも「シャツに火がついたような」熱。80km先まで熱が届く。森（街）のところどころで火が出る | F18・F19・F22・C3 |
| 約15〜30秒 | 真下に衝撃波。真下は枝（屋根）をはがれて立ったまま、外側は外向きに倒れる | F17・C5・R1 |
| 十数秒〜1分半 | 新宿（約18秒）→横浜・大宮・千葉（約80〜94秒）の順に、音と風が届く。光の間に窓へ寄る人 | C5・F42・R2・R3 |
| 約2〜3分 | 60km先（成田〜熊谷）に破裂音と熱い風。人が投げ飛ばされ、窓ガラスと扉の留め金が壊れる | F22・F39・F40・C3 |
| 数分 | 半径約200kmまで窓ガラスが割れる。800km先でも衝撃が感じられる | F20・C4・F44 |
| 数分〜1時間 | 遠くの地震計が揺れる（マグニチュード5近く相当） | F25 |
| 数時間 | 空気の波が地球を回り、遠い国の気圧計に記録される（到達時刻の出典なし） | F26 |
| その夜 | 遠くの街で真夜中に明かりなしで新聞が読めるほど空が明るい。白・桃色・金・緑の空 | F27・F28・R5 |
| 1日後 | 上空から見ると、蝶の形に倒れた範囲が東京都とほぼ同じ広さ。真下に穴はない。割れた窓を段ボールで塞ぐ街、休校、携帯がつながりにくい | F15・F16・F31・F45・C1・R4 |
| （1日後以降・参考） | 明るい夜は2〜3日、光の輪は約10日続く | F29 |

---

## 5. 台本に使う前の注意（配慮のガイドライン）

1. **死傷者の数を語らない・作らない**：ツングースカの死者（F24）、チェリャビンスクのけが人（F41）の数は語りでもテロップでも出さない。東京で何人が、という推計（F65 など）は使わない・作らない。被害は景色（立ったまま残る骨組み、倒れる街路樹、割れて内側へ落ちるガラス、段ボールで塞いだ窓、明るすぎる夜空）で見せる。犠牲者・負傷者・遺体・助けを求める人の映像は作らない。
2. **予言・確率・日付を出さない**：頻度（F64）、2024 YR4 の衝突確率（F60）は語らない。「いつか必ず来る」「次は東京」などあおる言い回しも使わない。台本で具体の日付・年を言わない（ルール⑧）。
3. **核兵器との比較は使わない**：F10（トリニティ・キャッスル・ブラボー）や「広島の原爆の30倍」（F36）は被爆の記憶に触れるため、語りでもテロップでも使わない。量は身近なものに例える（ルール④）。
4. **推計の幅に語りで触れない**（ルール②）：大きさ（50〜60m／50〜80m／50〜100m）・エネルギー（3〜30メガトン）・高さ（5〜10km）は企画書で扱い、台本では「ビルほどの岩が、富士山より高い空で」のように言い切れる範囲だけ使う。テロップに数字を出すなら英W-ツングースカ冒頭の値（50〜60m・5〜10km）に限る。
5. **食い違いは使わない側に倒す**：時刻（7時14分／7時2分：F1・F2）、窓が割れた距離（200km／1,000km：F20・F21）、建物数（7,200棟／4,474棟：F41・F44）は数え方・版が違う。時刻は言わない、窓は英語版の約200km、建物は使うなら「約7,200棟」と出典を一致させる。
6. **「史上最大」の言い方**：F4 は「現代に記録された中で最大の天体衝突」。恐竜を絶滅させた衝突など先史の衝突の方が大きいので、タイトル D3 の「史上」は「記録に残る中で」の意味で使い、本編で「人類が記録した中で最大」と回収する。
7. **「落ちる」と「穴」**：空中爆発（F5）なので、東京駅に巨大な穴があく描写は事実と違う。穴がないこと（F31）を意外性として回収する。
8. **実在の場所の扱い**：東京駅・新宿・横浜などは距離の目盛り。特定の街が「消える」「全滅する」とは描かない。東京で何が壊れるかは R1〜R5 の仮定で、出典はない。
9. **実在の個人**：セミョーノフ（F22）・チュチャン（F23）の証言は景色の参考にとどめる。チェリャビンスクの教師（F43）など実在の個人は、名前を出さずに描くか使わない。
10. **防災上の誤解を生まない**：「光ったら窓から離れる」は F42・F43 の事実から言える行動だが、防災機関の公式の呼びかけは今回確認していない。防災のすすめとして言い切らない。
11. **ウィキペディア上の記述の扱い**：この資料の事実はすべてウィキペディアの本文（原論文・NASA・報道の原文は未確認）。NASA（science.nasa.gov・www.nasa.gov・cneos.jpl.nasa.gov）、ESA、国土地理院、東京都のホストが許可されれば原資料で確かめる。特に F9（NASA 2019）・F37（NASA の数値）・F42（AP の引用）・F52〜F53（面積の原表）。
12. **未確認のまま使わない**：F9・F63・F65・F66 は検索結果のみ／見つからず。「電信柱の森」という呼び名、「椅子から投げ出された」という描写、チェリャビンスクの「数十秒で大気を横切った」の正確な秒数は、今回の資料で確認できていない（C6 の約12秒は計算）。
