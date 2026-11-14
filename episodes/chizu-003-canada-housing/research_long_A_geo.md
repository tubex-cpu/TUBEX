# 長尺化リサーチ A：地理・気候・入植の歴史・都市の地形（chizu-003-canada-housing）

- 目的：約5分の企画（`03_plan.md`）を20〜30分に広げるための素材。このパートで約8〜10分ぶん。既存の `01_research.md` の記号（CAN_* / CMHC_* / TOR_* / ONT_* / BC_* など）とは別に、このファイルの記号は **A_** で振る。既存記号と同じ事実は再掲せず、新しい事実だけを足す
- 調査日：**2026-11-13**（Claude）。費用ゼロ（Web 検索の抜粋のみ。有料サービス・API キーは使っていない）。**コミットしていない**
- 方法：WebSearch（standard モード）の抜粋を突き合わせた。比率・倍率は、✅ の元の数字から自分で計算したものに「（自分で計算）」と書く
- 状態の記号：📄＝ページ本文を自分で読んだ／✅＝独立した2件以上の資料（検索抜粋）で一致／⚠＝単独の資料、または資料どうしで食い違う
- **今回も 📄 は0件**。WebFetch を2回試し、どちらも名前解決できず失敗（この環境の許可ドメイン外）：`www.thecanadianencyclopedia.ca`、`www.cbc.ca`。ツールの案内に従い2件目の失敗後は WebFetch をやめた。`01_research.md` で失敗済みの `www.cmhc-schl.gc.ca`・`assets.cmhc-schl.gc.ca`・`www150.statcan.gc.ca`・`www.statcan.gc.ca`・`www12.statcan.gc.ca`・`publications.gc.ca`・`www.toronto.ca`、Bermuda 調査で失敗済みの `en.wikipedia.org` も同じ扱い（試していない）
- CLAUDE.md のルールどおり、台本で使えるのは ✅（📄があればそれも）だけ。⚠ は台本で言い切らない（使わないか、✅ の範囲まで削る）
- 本作の筋（`01_research.md` と同じ）：**地理は「人が住める場所」を説明するが、住宅不足は「人がいる場所でどれだけ建てられるか」の問題**。このパートの素材は「なぜ人は南の細い帯の、さらに一部の都市に集まったのか」までを語るためのもの。地理で住宅不足そのものを説明しない

---

## 1. 国土の中身：農地・盾状地・永久凍土・北方林・北極圏

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_FARM21 | 2021年農業センサスの農場の総面積は約6,220万ha（1億5,370万エーカー）。2001年の約6,800万haから約8%減 | Statistics Canada 農業センサス2021 主題図 https://www150.statcan.gc.ca/n1/pub/95-634-x/2021001/article/00001-eng.htm 、CBC「What's happening to Canada's farmland?」 https://www.cbc.ca/lite/story/1.6877661 、farms.com https://m.farms.com/news/stats-canada-releases-2021-census-of-agriculture-data-179653.aspx | ✅（CBC は「農家の自己申告による」と注意書き） |
| A_FARM_SHARE | 農場の面積は国の陸地面積（CAN_POP21：8,788,702.80 km²＝約8億7,900万ha）の約7%（6,220万 ÷ 8億7,890万 ≒ 7.1%） | A_FARM21・CAN_POP21 から | ✅（自分で計算。台本は「農場は陸地の約7%」。牧草地も含む「農場」の面積で、「耕せる土地」とは別） |
| A_ARABLE | 世界銀行（FAO のデータ）の「耕地（arable land）」はカナダの陸地の約4.3〜4.4%（2021年 約3,826万ha、2023年 4.34%） | Trading Economics（世界銀行データ） https://tradingeconomics.com/canada/arable-land-percent-of-land-area-wb-data.html 、TheGlobalEconomy https://www.theglobaleconomy.com/Canada/arable_land_percent/ 、Macrotrends https://macrotrends.net/global-metrics/countries/can/canada/arable-land 、IndexMundi（2018年 4.32%） https://www.indexmundi.com/facts/canada/arable-land | ✅（いずれも同じ世界銀行／FAO 系列の転載。NationMaster は 5.02% と食い違う＝年不明。台本は「耕地は陸地の4%あまり（世界銀行）」） |
| A_CLI_13 | 土地の農業適性の全国調査（Canada Land Inventory、1963年開始）で、農業に安定して使える第1〜3等級は国土の約5%、約3,800万ha | カナダ百科事典「Arable Land in Canada」 https://thecanadianencyclopedia.ca/en/article/arable-land-in-canada | ⚠（単独。A_ARABLE と定義が違うので並べない） |
| A_CLI_1 | いちばん良い第1等級の土地は国土の0.5%未満で、その半分以上がオンタリオ州南部にある | カナダ百科事典（同上）、Statistics Canada The Daily 2005-01-31 https://www150.statcan.gc.ca/n1/daily-quotidien/050131/dq050131c-eng.htm | ✅（台本は「最良の農地は国土の0.5%もなく、その半分以上がオンタリオ州南部＝トロントのまわり」） |
| A_CLI_URBAN | 2001年、カナダの第1等級の農地の7%超を、すでに町や都市が占めていた | Statistics Canada The Daily 2005-01-31（同上。Rural and Small Town Canada Analysis Bulletin Vol.6 No.1）、カナダ百科事典「Canada Land Inventory」 https://thecanadianencyclopedia.ca/en/article/canada-land-inventory | ✅（**2001年の数字**と年を付ける） |
| A_CLI_URBAN_ON | オンタリオ州では第1等級の農地の11%超を町・都市が占めていた（2001年） | Statistics Canada The Daily 2005-01-31。2001年の別の統計局報告は「18%超」 https://publications.gc.ca/Collection/Statcan/21-006-X/21-006-XIE2001002.pdf | ⚠（方法の違いで11%と18%に割れる。使わない） |
| A_SHIELD | カナダ盾状地（Canadian Shield）は約500万km²、カナダの陸地（淡水湖と北極の島を含む）の約48%。岩盤が露出し土が薄い | カナダ百科事典「Physiographic Regions」 https://thecanadianencyclopedia.ca/en/article/physiographic-regions 、ArcGIS StoryMap「Canada's Landform Regions」 https://storymaps.arcgis.com/stories/3c373c961cc04a69a4e70149ffa57c33 | ✅（台本は「国のほぼ半分は、土の薄い岩盤の大地」。Wikipedia 系の「約800万km²」はアメリカ側を含む別の範囲。「半分以上」とする Wikiwand もあるので「ほぼ半分」と言う） |
| A_PERMA | カナダの陸地の約半分の下に永久凍土がある（北は連続、南は不連続） | カナダ天然資源省（NRCan）の永久凍土データ（政府オープンデータ） https://open.canada.ca/data/en/dataset/ab0c22c6-bbc2-5838-9b6e-7d83c61ba91d 、ウォータールー大学 https://arktikos.uwaterloo.ca/node/75 ・ https://arktikos.uwaterloo.ca/ccw/permafrost | ✅（資料により「半分強」「半分弱」。台本は「約半分」） |
| A_BOREAL | カナダの北方帯（ボレアル・ゾーン）は5億5,200万ha、世界の北方帯の28% | カナダ天然資源省「8 facts about Canada's boreal forest」 https://natural-resources.canada.ca/forest-forestry/sustainable-forest-management/8-facts-about-canada-s-boreal-forest 、同「Boreal forest」 https://natural-resources.canada.ca/forest-forestry/sustainable-forest-management/boreal-forest 、仏語版 https://ressources-naturelles.canada.ca/forets-foresterie/amenagement-forestier-durable/8-faits-foret-boreale-canada | ⚠（同じ省の複数ページで、独立した2件ではない。「北方林」だけなら2億7,000万haと別の数字もある。使うなら「世界の北方帯の約3割がカナダ」まで、出典は NRCan と明記。陸地の何割かは言わない） |
| A_TUNDRA | 北極のツンドラ（岩の荒れ地を含む）はカナダ北部の約250万km² | Statistics Canada「Accounting for ecosystem change in Canada」 https://www150.statcan.gc.ca/n1/pub/16-201-x/2021001/sec-2-eng.htm | ⚠（単独。「国土の4分の1」は自分の割り算で、出典の文言ではない） |
| A_TERR_LAND | 3つの準州（ユーコン・ノースウエスト・ヌナブト）でカナダの陸地の約4割 | Wikipedia「Provinces and territories of Canada」 https://en.wikipedia.org/wiki/Provinces_and_territories_of_Canada 、カナダ枢密院事務局のアーカイブ https://epe.lac-bac.gc.ca/100/205/301/pco-bcp/website/09-06-29/www.pco-bcp.gc.ca/aia/index.asp@lang=eng&page=provterr&sub=difference&doc=difference-eng.htm | ✅（「3分の1強」とする資料もある。台本は「約4割」より「国の4割近く」が安全） |
| A_TERR_POP | 2021年国勢調査で、3準州の人口はユーコン 40,232・ノースウエスト 41,070・ヌナブト 36,858、合計約11.8万人＝全国の約0.3% | Statistics Canada 2021 主要指標 https://www12.statcan.gc.ca/census-recensement/stats/statind2021.cfm 、CBC North「Census 2021: A snapshot of the North」 https://www.cbc.ca/lite/story/1.6345016 、RCI Eye on the Arctic https://www.rcinet.ca/eye-on-the-arctic/2022/02/10/census-2021-a-snapshot-of-arctic-canadas-population-and-dwelling-data/ | ✅（合計と0.3%は自分で計算） |
| A_NUNAVUT | ヌナブト準州の陸地は約183.7万km²、人口密度は1km²あたり約0.02人（2021年） | Wikipedia 系（encycloreader・wikiwand）、カナダ地理教育 https://cangeoeducation.ca/en/resources/nunavut-infographic | ⚠（統計局の表を直接見ていない。陸地面積に別の値もある。台本は日本との比較（A_JPN_AREA_CMP）だけにとどめる） |

## 2. 気候の限界

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_LAT_TOR | トロントは北緯約43.6〜43.7度で、カナダの大都市でいちばん南 | The Weather Network「Canada's parallel cities around the world」 https://www.theweathernetwork.com/en/news/science/earth-science/these-are-canadas-parallel-cities-around-the-world 、answers.com 等 | ✅（緯度の値。「いちばん南の大都市」は Weather Network のみ⚠） |
| A_LAT_SAP | 札幌は北緯43度03〜04分 | 北海道データブック（北海道庁） https://www.pref.hokkaido.lg.jp/ss/tkk/databook/2020/0103.html 、同2014年版 https://www.pref.hokkaido.lg.jp/ss/tkk/databook/2014/0103.html 、観測所情報 https://weather.time-j.net/stations/jp/sapporo/ | ✅（→ **トロントは札幌とほぼ同じ緯度、わずかに北**。台本で日本の視聴者向けに使える） |
| A_LAT_MTL | モントリオールは北緯約45.5度 | The Weather Network（同上） | ⚠（単独の抜粋。使うなら地図で示すだけ） |
| A_JAN_TEMP | 1月の平均気温（1971〜2000年平年値）：トロント約−6.3℃、ウィニペグ約−17.8℃、イカルイト約−26.6℃ | Statistics Canada「Average daily temperatures by month… 1971 to 2000」 https://www150.statcan.gc.ca/n1/pub/16-201-x/2007000/5212509-eng.htm | ⚠（単独・古い平年値。1991〜2020年の新しい平年値は気象局 climate.weather.gc.ca で未確認。台本で数字は使わない） |
| A_FROST_ON | オンタリオ州南西端（エセックス郡など）の無霜期間は170〜190日、州全体の平均は約126日 | オンタリオ州「Climate zones and planting dates for vegetables in Ontario」 https://www.ontario.ca/page/climate-zones-and-planting-dates-vegetables-ontario 、ヨーク大学 https://lamps.math.yorku.ca/WorldClimate/OntarioClimate/FFS | ⚠（期間・定義が資料ごとに違う。「南ほど作物を育てられる期間が長い」という説明だけにする） |

## 3. 入植の歴史：なぜ南の川・湖・鉄道沿いに住んだのか

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_QC1608 | 1608年、シャンプランがセントローレンス川の川幅が狭まる場所にケベック（現ケベック・シティ）を建てた。「ケベック」は先住民アルゴンキン系の言葉で「川が狭まるところ」 | アロプロフ（ケベックの教育サイト） https://www.alloprof.qc.ca/en/students/vl/history/early-colonization-in-new-france-h1515 、Canada History https://canadahistory.ca/sections/eras/new%20france/Champlain.html 、カナダ歴史博物館 https://historymuseum.ca/history-hall/governing-new-france | ✅ |
| A_LONGLOT | ヌーベルフランスの領主制では、できるだけ多くの入植者が川岸に土地を持てるよう、川に面した細長い短冊形の区画に分けた（1634年にボープレで最初に試されたとする資料あり） | アロプロフ「The Seigneurial System in New France」 https://www.alloprof.qc.ca/en/students/vl/history/the-seigneurial-system-in-new-france-h1372 、カナダ百科事典「Rang」 https://thecanadianencyclopedia.ca/en/article/rang-canadien 、ラヴァル大学 CIEQ 歴史地図 https://atlas.cieq.ca/historical-atlas/interactif/the-formation-of-the-laurentian-base.html | ✅（細長い区画と川岸の理由。1634年・1854年廃止は⚠） |
| A_MTL1642 | 1642年、ヴィル＝マリー（現モントリオール）が建てられた。場所は、大西洋から川をさかのぼる船がそれ以上進めなくなる地点（ラシーヌの急流の手前） | 旧モントリオールの説明板 https://vieux.montreal.qc.ca/plaque/horizon/eng/ruptura.htm 、アロプロフ（同上）、ブリタニカ https://www.Britannica.com/place/Montreal/History 、カナダ百科事典「Montréal」 https://thecanadianencyclopedia.ca/en/article/montreal | ✅（毛皮交易の中心になった点も複数一致。ラシーヌ運河1825年は⚠） |
| A_YORK1793 | 1793年、シムコーがオンタリオ湖岸にヨーク（現トロント）を建てた。砂州（いまのトロント諸島）に守られた天然の港があり、入口が1つで守りやすかった | Wikipedia「York, Upper Canada」 https://en.wikipedia.org/wiki/York,_Upper_Canada 、トロント公共図書館デジタルアーカイブ（1793年の港の測量図） https://digitalarchive.tpl.ca/objects/330537 、Museum of Toronto 年表 https://museumoftoronto.com/timeline/ 、TCLF https://www.tclf.org/places/view-city-and-regional-guides/toronto/torontos-landscape-legacy | ✅（建設年と「砂州に守られた港」。日付8月27日は⚠） |
| A_BC1871 | 1871年、ブリティッシュ・コロンビアは、東部とつなぐ大陸横断鉄道を約束されてカナダに加わった | カナダ歴史博物館「The Rail from Sea to Sea」 https://historymuseum.ca/history-hall/the-rail-from-sea-to-sea 、カナダ図書館・公文書館 https://www.canada.ca/en/library-archives/collection/engage-learn/podcasts/treasures-revealed/episode-016.html 、カナダ土木学会（CSCE） https://legacy.csce.ca/en/historic-site/canadian-pacific-railway/ | ✅ |
| A_CPR1885 | 1885年11月7日、BC州クレイゲラキーでカナダ太平洋鉄道（CPR）の「最後の犬釘」が打たれた | Wikipedia「Last spike」 https://en.wikipedia.org/wiki/Last_spike_(Canadian_Pacific_Railway) 、カナダ図書館・公文書館（同上）、CSCE https://cscehistory.ca/national/canadian-pacific-railway-craigellachie-british-columbia-2/ | ✅ |
| A_CPR_ROUTE | 1881年、CPR は測量技師フレミングが勧めた北寄りのイエローヘッド峠ではなく、南寄りのキッキング・ホース峠を通る経路に決めた | カナダ百科事典「Canadian Pacific Railway」 https://www.thecanadianencyclopedia.ca/en/article/canadian-pacific-railway 、CSCE（同上）、BC Open Textbook「The Railway」 https://opentextbc.ca/postconfederation/chapter/2-9-the-railway/ | ✅（経路と年） |
| A_CPR_WHY | 南寄りにした理由：距離が短い、アメリカの鉄道の進出を防ぎやすい、など | BC Open Textbook（米国境に近く米国の鉄道を防ぎやすい）、CSCE（直線的で競合線を防ぐ） | ⚠（理由は複数あり、資料で重みが違う。「アメリカに対抗するため」と1つに言い切らない） |
| A_DLA1872 | 1872年の自治領土地法：10ドルの手数料で160エーカー（約65ha）の土地を与え、3年ほどで開墾・定住すれば所有を認めた。プレーリー（大平原）への入植を進め、アメリカに取られるのを防ぐ狙い | Wikipedia「Dominion Lands Act」 https://en.wikipedia.org/wiki/Dominion_Lands_Act 、サスカチュワン州公文書館 https://saskarchives.com/node/82 、マニトバ州 https://www.gov.mb.ca/rearview/averill/homesteads.html 、カナダ百科事典「Homesteading」 https://thecanadianencyclopedia.ca/article/homesteading | ✅（160エーカー・10ドル・目的。申請年齢・開墾面積の細部は資料で割れる⚠） |
| A_CGY1875 | 1875年、北西騎馬警察がボウ川とエルボー川の合流点に砦（のちのフォート・カルガリー）を置いた。1883年8月に CPR が到達し、1884年に町になった | ブリタニカ https://www.britannica.com/place/Calgary 、カナダ百科事典「Calgary」 https://www.thecanadianencyclopedia.ca/en/article/calgary 、アルバータ州資料アーカイブ https://wayback.archive-it.org/2217/20101208183501/http:/www.albertasource.ca/realestate/regions/calgary/ftcalgary.html | ✅ |
| A_VAN1886 | 1886年4月6日、グランビルが「バンクーバー」として市になった（名前は CPR 側が選んだ）。1887年5月23日、大陸横断の旅客列車が初めて到着し、バンクーバーは CPR の西の終点になった | vancouverhistory.ca https://vancouverhistory.ca/cpr-comes-to-vancouver/ 、ロイヤルBC博物館 https://www.royalbcmuseum.bc.ca/node/4228 、KnowBC https://knowbc.com/content/view/full/1555 、bcanuntoldhistory https://bcanuntoldhistory.knowledge.ca/1880/cpr-ends-in-vancouver | ✅（命名者が誰かは資料で割れる⚠） |

## 4. 人はどこに住むか：都市への集中（2021年国勢調査）

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_CMA737 | 2021年、カナダ人の73.7%（約2,730万人、ほぼ4人に3人）が、人口10万人以上の41の大都市圏（CMA）に住んでいた（2016年は73.2%、35圏） | Statistics Canada The Daily 2022-02-09 https://www150.statcan.gc.ca/n1/daily-quotidien/220209/dq220209b-eng.htm 、Statistics Canada「Canada's large urban centres continue to grow and spread」 https://www.statcan.gc.ca/o1/en/plus/334-canadas-large-urban-centres-continue-grow-and-spread 、CBC https://www.cbc.ca/news/politics/census-2021-release-population-cities-1.6344179 | ✅ |
| A_RURAL | 2021年、農村部（人口1,000人以上の「人口集中地」の外）に住む人は17.8%（2016年は18.7%）。農村の割合は9回続けて下がった | Statistics Canada Census in Brief https://www12.statcan.gc.ca/census-recensement/2021/as-sa/98-200-x/2021002/98-200-x2021002-eng.cfm 、Canadian Press 配信 https://cfjctoday.com/?p=900022 、CHEK News https://www.cheknews.ca/one-in-10-canadians-lived-in-smaller-urban-centres-in-2021-statcan-952110/ | ✅（定義が違う14.8%・85.2%と混ぜない） |
| A_CMA_TOP | 2021年の大都市圏（CMA）の人口：トロント 6,202,225／モントリオール 4,291,732／バンクーバー 2,642,825／オタワ＝ガティノー 1,488,307／カルガリー 1,481,806／エドモントン 1,418,118 | Statistics Canada The Daily 2022-02-09（表 t002a） https://www150.statcan.gc.ca/n1/daily-quotidien/220209/t002a-eng.htm 、Environics Analytics https://environicsanalytics.com/en-ca/resources/blogs/ea-blog/2022/02/09/census-2021-five-year-population-growth-despite-the-pandemic 、Wikipedia CMA 一覧 https://en.wikipedia.org/wiki/List_of_census_metropolitan_areas_and_agglomerations_in_Canada | ✅（国勢調査の値。7月1日推計値とは別） |
| A_TOP3_SHARE | 上位3つの大都市圏（トロント・モントリオール・バンクーバー）で約1,314万人＝全国の約35.5%（約3人に1人） | A_CMA_TOP・CAN_POP21 から | ✅（自分で計算） |
| A_ONQC | 2021年の州人口：オンタリオ 14,223,942、ケベック 8,501,833、BC 5,000,879、アルバータ 4,262,635。オンタリオとケベックの2州で全国の約61% | Statistics Canada 2021 主要指標 https://www12.statcan.gc.ca/census-recensement/stats/statind2021.cfm 、Wikipedia「2021 Canadian census」 https://en.wikipedia.com/wiki/Canada_2021_Census 、todocanada https://www.todocanada.ca/population-in-canada-2021-census/ | ✅（61%は自分で計算） |
| A_CORRIDOR | ケベック・シティ〜ウィンザーの回廊（約1,150km）にカナダの人口の約半分が住む | Wikipedia「Quebec City–Windsor Corridor」 https://en.wikipedia.org/wiki/Quebec_City%E2%80%93Windsor_Corridor とその転載のみ | ⚠（統計局の公式の回廊人口が見つからない。**使わない**。代わりに A_ONQC か CAN_BORDER100 を使う） |
| A_TOR_SUBURB | 2016〜2021年のトロント大都市圏の人口増加のうち77.1%は郊外・その外側、トロント市内は22.9% | newgeography（Demographia 系）ほか検索要約 https://newgeography.com/content/007344-canada-suburbs-dominate-growth-2021-census | ⚠（統計局の数字でなく民間分析。使わない） |
| A_DISTANT | トロント・モントリオール・バンクーバーの大都市圏では、中心から車で30分以上の「遠い郊外」の伸びが大きかった（2016〜2021年） | Statistics Canada The Daily 2022-02-09（dq220209b）、Environics Analytics（同上） | ✅ |

## 5. 4都市の地形と土地の制約

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_TOR_CITY | トロント市（市域）：2021年人口 2,794,356、陸地面積 約631km²、人口密度 4,427.8人/km² | Statistics Canada 国勢調査プロファイル（postalcodeinfo 経由の転載） https://postalcodeinfo.ca/on/toronto/census-data-statistics/ 、トロント市 2021年国勢調査資料 https://www.toronto.ca/wp-content/uploads/2022/02/92e3-City-Planning-2021-Census-Backgrounder-Population-Dwellings-Backgrounder.pdf （抜粋）、Wikipedia「Demographics of Toronto」 | ✅（面積は630〜631km²と丸めが違う） |
| A_GREENBELT_GEO | オンタリオのグリーンベルトは80万ha超で、東のライス湖近くから西のナイアガラ川まで約325km。中心はナイアガラ断崖とオーク・リッジズ・モレーン（氷河が残した丘の帯）で、トロントとハミルトンの都市部を外側から囲む | グリーンベルト財団 https://www.greenbelt.ca/learn 、オンタリオ州「Ontario's Greenbelt」 https://www.ontario.ca/page/ontarios-greenbelt 、グリーンベルト計画2017 https://files.ontario.ca/greenbelt-plan-2017-en.pdf 、The Narwhal https://thenarwhal.ca/ontario-greenbelt-explainer/ | ✅（80万ha＝既存 ONT_GREENBELT の「200万エーカー超」と同じ規模。325km はグリーンベルト財団のみ⚠） |
| A_ORM | オーク・リッジズ・モレーンは長さ約160km、オンタリオ湖の北およそ60kmを湖と平行に走る | カナダ百科事典「Oak Ridges Moraine」 https://thecanadianencyclopedia.ca/en/article/oak-ridges-moraine 、グリーンベルト財団（同上） | ⚠（距離の数字は1資料。地図で見せるだけにする） |
| A_TOR_LAKE | トロントは南をオンタリオ湖に面し、市街地は湖の北岸から内陸へ広がる | A_YORK1793 の各資料、グリーンベルト計画2017 | ✅（地図の説明として） |
| A_MTL_ISLAND | モントリオール島は、オタワ川とセントローレンス川の合流点にできたオシュラガ諸島でいちばん大きな島。面積は約472〜483km² | Wikipedia「Island of Montreal」 https://en.wikipedia.org/wiki/Island_of_Montreal 、同「Hochelaga Archipelago」 https://en.wikipedia.org/wiki/Hochelaga_Archipelago 、カナダ百科事典「Hochelaga Archipelago」 https://www.thecanadianencyclopedia.ca/en/article/hochelaga-archipelago | ✅（「川に囲まれた島の都市」と最大の島である点）／⚠（面積は472.55と約483で割れる。台本は「約470〜480km²」か数字なし） |
| A_VAN_PENIN | バンクーバー市は、北をバラード入江、南をフレーザー川、西をジョージア海峡に囲まれた半島にあり、入江の向こうにノースショアの山々が迫る | EBSCO Research Starters「Vancouver」 https://www.ebsco.com/research-starters/geography-and-cartography/vancouver 、Frommer's「The Lay of the Land in Vancouver」 https://www.frommers.com/destinations/vancouver/in-depth/the-lay-of-the-land 、KnowBC https://www.knowbc.com/content/view/full/4563 、Wikipedia「Burrard Inlet」 | ✅ |
| A_VAN_DELTA | バンクーバー南側の低地（リッチモンド・デルタなど）は、フレーザー川が運んだ土砂でできた三角州。氷河期の後、約1万年前から海を埋めて広がった | カナダ百科事典「Delta (landform)」 https://thecanadianencyclopedia.ca/en/article/delta-landform 、Williams & Roberts (1990) Géographie physique et Quaternaire https://www.erudit.org/en/journals/gpq/1990-v44-n1-gpq1933/032795ar.pdf 、CSCE 2017 論文 https://legacy.csce.ca/elf/apps/CONFERENCEVIEWER/conferences/2017/pdfs/HYD/FinalPaper_722.pdf | ✅（「フレーザー川の三角州」）／⚠（年代は9,000〜11,000年前と資料で幅。「約1万年前」より「氷河期の後」と言う） |
| A_VAN_CITY | バンクーバー市（市域）：2021年人口 662,248、陸地面積 約115km²、人口密度 約5,750人/km²（統計局の「人口密度の高い自治体」表に掲載） | Statistics Canada The Daily 2022-02-09 表 t004a https://www150.statcan.gc.ca/n1/daily-quotidien/220209/t004a-eng.htm 、バンクーバー市の国勢調査メモ https://vancouver.ca/files/cov/2022-02-28-2021-census-population-dwelling-counts-and-metro-van-growth.pdf 、Wikipedia「Vancouver」 | ✅ |
| A_VAN_SQUEEZE | メトロバンクーバーは北と東を山、西を海、南をアメリカ国境に挟まれ、これが住宅需要に追いつく力を制約する、と指摘されている | フレーザー研究所 https://www.fraserinstitute.org/commentary/local-regulations-limit-metro-vancouver-housing-supply-stifle-affordability 、Daily Hive「Our tiny region」 https://dailyhive.com/vancouver/metro-vancouver-land-size-affordability-issue 、Western Investor https://www.westerninvestor.com/opinion/constrained-geography-stokes-tensions-on-metro-vancouvers-home-front-3832026 、既存 CMHC_US26 | ✅（地形の囲まれ方）。同じフレーザー研究所は**規制・承認の遅れ・低密度の用途地域**も原因に挙げる → 台本は「地形に加えて規制も」と並べる |
| A_MV_LAND | メトロバンクーバーの陸地は約2,870km²。そのうち都市開発に使える区域は約837km²（約29%＝3分の1未満）、農地保全区域（ALR）が約554km² | Daily Hive（Metro Vancouver のデータ、2016年時点） https://dailyhive.com/vancouver/metro-vancouver-land-size-affordability-issue 、Viewpoint Vancouver（2020） https://viewpointvancouver.ca/2020/01/21/the-coupland-primer-some-of-the-basics/ | ⚠（2件とも同じ元データの可能性。2016年の古い値で、Metro 2050 の公式表は未確認） |
| A_MV_ALR | メトロバンクーバーの土地のうち ALR の割合は資料により約16%・約19%・約22%、面積は約5.4万〜6万ha | フレーザー研究所（22%） https://fraserinstitute.org/taxonomy/term/16999 、BIV（Metro 2050 により約6万ha） https://biv.com/article/2023/03/development-demands-place-pressure-alr-land 、Daily Hive（554km²） 、Western Investor 等（53,760ha・16%） | ⚠（割合が割れる。台本は数字を言わず「都市圏の中にも、家を建てられない農地保全区域が大きく広がる」と地図で見せる） |
| A_MV_GU | Metro 2050 の「一般都市」区域は約69,627ha、そのうち未開発の緑地（グリーンフィールド）は約4,015ha（5.8%、2022年） | Metro Vancouver「Greenfield lands」 https://metrovancouver.org/services/regional-planning/metro-2050-performance-monitoring/goal-1/urban-containment/greenfield-lands | ⚠（単独。公式だが抜粋のみ） |
| A_CGY_CITY | カルガリー市（市域）：2021年人口 1,306,784、陸地面積 約820.6km²、人口密度 約1,592人/km² | 検索要約（Wikipedia 系・careerbeacon） https://www.careerbeacon.com/en/canada/alberta/calgary 、Livewire Calgary https://livewirecalgary.com/2022/02/16/data-2021-census-calgary-population-growth/ | ⚠（統計局の表を直接見ていない。使うなら確認後に「トロント市より広い市域に、半分以下の人口」） |

## 6. 日本と比べる数字（日本の視聴者向け）

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_JPN_TOKYOKEN | 2020年国勢調査で、東京圏（東京都・神奈川県・埼玉県・千葉県）の人口は3,691万4千人（全国の29.3%） | 総務省統計局「令和2年国勢調査 人口等基本集計 結果の要約」 https://www.stat.go.jp/data/kokusei/2020/kekka/pdf/summary_01.pdf 、内閣府 防災白書（令和5年版） https://www.bousai.go.jp/kaigirep/hakusho/r05/honbun/t1_2s_03_01.html 、厚生労働省資料 https://www.mhlw.go.jp/content/12601000/000954797.pdf | ✅ |
| A_CAN_EQ_TOKYO | → **カナダ全体の人口（2021年 36,991,981人）は、東京圏（2020年 約3,691万人）とほぼ同じ**。日本の26倍の国に、東京圏ぶんの人しかいない | CAN_POP21・A_JPN_TOKYOKEN・JPN_AREA から | ✅（自分で比較。調査年が1年違う点は概要欄に注記） |
| A_JPN_POP20 | 2020年国勢調査の日本の人口は1億2,614万6千人 | 総務省統計局（同上）、統計局「統計Today」 https://www.stat.go.jp/info/today/pdf/174.pdf | ✅ |
| A_DENSITY_CMP | 日本の人口密度は約334〜338人/km²で、カナダ（4.2人/km²）の約80倍 | A_JPN_POP20 ÷ JPN_AREA ≒ 334（自分で計算）。統計局の公表値 338.2 は抜粋で未確認 | ✅（「約80倍」は自分で計算。どちらの値でも約80倍。日本の公表密度の数字そのものは言わない） |
| A_JPN_23KU | 東京23区（区部）の面積は約627.5km²、人口は約970万人（2020年国勢調査 9,733,276） | 東京都統計 https://www.toukei.metro.tokyo.lg.jp/kokutyo/2020/kt20tf0004.pdf 、豊島区資料 https://www.city.toshima.lg.jp/documents/56063/1-4-r7.pdf 、All About https://news.allabout.co.jp/articles/o/30122/ | ✅（面積と「約970万人」）／⚠（9,733,276 は東京都資料の抜粋のみ） |
| A_TOR_EQ_23KU | → **トロント市（約631km²）は東京23区（約627.5km²）とほぼ同じ広さ。人口は約279万人で23区の約3割、人口密度は約4,400人/km²で23区（約1万5,500人/km²）の3割未満** | A_TOR_CITY・A_JPN_23KU から | ✅（自分で計算。比べるのは市域と区部どうし） |
| A_MTL_EQ_23KU | → モントリオール島（約470〜480km²）は東京23区の約4分の3の広さ | A_MTL_ISLAND・A_JPN_23KU から | ⚠（島の面積が割れるので「4分の3ほど」までなら全説と矛盾しない。使うなら地図の重ね合わせで） |
| A_JPN_FARM | 日本の耕地面積は2023年に429.7万ha（田233.5万ha・畑196.2万ha、7月15日時点） | 農林水産省「耕地及び作付面積統計」 https://www.maff.go.jp/j/tokei/kouhyou/sakumotu/menseki/index.html 、農林水産省 統計指標 https://www.maff.go.jp/j/tokei/sihyo/data/10.html 、食料・農業・農村白書 https://www.maff.go.jp/j/wpaper/w_maff/r6/r6_h/trend/part1/chap3/c3_2_00.html | ✅ |
| A_FARM_CMP | → カナダの耕地（世界銀行、2021年 約3,826万ha）は日本の耕地の約9倍。カナダの国土は日本の約26倍なので、**国の広さほどには耕せる土地は多くない** | A_ARABLE・A_JPN_FARM・JPN_AREA から | ⚠（「耕地」の定義が FAO と日本の統計で違う＝日本は樹園地を含む。台本で使うなら「ざっと9倍」と言わず、A_ARABLE の「陸地の4%あまり」だけにする方が安全） |
| A_LAT_CMP | → トロント（北緯約43.65度）は札幌（北緯43度03〜04分）とほぼ同じ緯度 | A_LAT_TOR・A_LAT_SAP | ✅（地図で示す） |
| A_JPN_AREA_CMP | → ヌナブト準州だけで日本の国土の約5倍の広さに、約3.7万人 | A_NUNAVUT・JPN_AREA・A_TERR_POP | ⚠（ヌナブトの面積が⚠のため。「約5倍」は 1,836,994 ÷ 377,980 ≒ 4.9 で自分の計算。統計局の値を確認したら✅に上げられる） |

---

## 台本で使わないこと
- 「回廊（ケベック・シティ〜ウィンザー）に人口の半分」（A_CORRIDOR）：Wikipedia だけ。代わりに「オンタリオとケベックの2州で約6割」（A_ONQC）か、既存 CAN_BORDER100 を使う
- 「国土の4%に住む」「90%が国境から160km以内」（既存の ⚠・誤り扱いを継続）
- 北方林・ツンドラ・準州の「国土の○割」を言い切ること（A_BOREAL・A_TUNDRA は ⚠。A_TERR_LAND は「4割近く」まで）
- 1月の平均気温・無霜期間の具体的な数字（A_JAN_TEMP・A_FROST_ON は単独・古い平年値）
- CPR の経路を「アメリカに対抗するためだった」と1つの理由に言い切ること（A_CPR_WHY）
- メトロバンクーバーの「使える土地は29%」「ALR は○%」の数字（A_MV_LAND・A_MV_ALR は資料で割れる／古い）
- オンタリオの第1等級農地の都市化率（11%と18%で割れる、A_CLI_URBAN_ON）
- 「地形のせいで家が足りない」という言い切り。地理は「人がどこに集まったか」までを語り、住宅不足の原因は `01_research.md` の CMHC_US26（地理・規制・人口構成）・CMHC_REG・CMHC_DELAY23 で語る
- Geoff の「使える土地はスペイン・フランス並み」（既存 SRC_GEOFF の ⚠ を継続）

## 未確認点・残る課題
1. **📄 は0件**。今回の WebFetch 失敗ホスト：`www.thecanadianencyclopedia.ca`・`www.cbc.ca`（加えて既知の statcan.gc.ca 各ホスト・cmhc-schl.gc.ca・publications.gc.ca・toronto.ca・en.wikipedia.org）。統計局の国勢調査表（CMA 人口・市域面積）を本文で確認したい
2. カルガリー市域（A_CGY_CITY）とヌナブト（A_NUNAVUT）の面積・密度を統計局の表で確認できれば、日本との比較（A_JPN_AREA_CMP）を ✅ に上げられる
3. メトロバンクーバーの土地区分（A_MV_LAND・A_MV_ALR）は Metro 2050 の公式表（metrovancouver.org の「Land use designations」）で最新値を取りたい。ALR の地域内比率が16〜22%で割れている
4. 1991〜2020年の気候平年値（気象局 climate.weather.gc.ca）で、トロント・ウィニペグ・イカルイトの1月平均を取り直せば A_JAN_TEMP を使える
5. A_CLI_13（第1〜3等級＝国土の約5%）の一次資料（農業・農産食品省の CLI 集計）が見つかっていない
6. 北方帯（A_BOREAL）の「カナダの陸地に占める割合」を示す公式の文言が見つからない（観光サイトの「60%」は使わない）
7. 東京圏との比較（A_CAN_EQ_TOKYO）は調査年が違う（カナダ2021年5月・日本2020年10月）。2025年国勢調査の東京圏は3,697万5千人（総務省の速報要約）なので、どちらの年でも「ほぼ同じ」は崩れないが、概要欄に年を書く
