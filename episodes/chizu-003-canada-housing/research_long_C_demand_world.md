# 長尺版リサーチ C：不足の表れ方・需要・世界との比較（chizu-003-canada-housing）

- 作成 2026-11-13 Claude（長尺化 20〜30分のうち、「足りないとどうなるか・誰が住みたいか・世界ではどうしたか・この先」のパート約6〜8分ぶんの材料）。commit なし
- 状態の記号：📄＝ページ本文を自分で読んだ／✅＝2つ以上の独立した資料が一致（検索結果の抜粋で確認）／⚠＝単独の資料・資料で食い違い・数字の版（ヴィンテージ）で値が変わる
- **今回も 📄 は0件**。方法：Web 検索（standard）の抜粋を複数照合。WebFetch は2回だけ試し、`www.crea.ca`・`www.pewtrusts.org` とも名前解決できず失敗（この環境の許可ドメイン外）。`01_research.md` と同じく `cmhc-schl.gc.ca`・`assets.cmhc-schl.gc.ca`・`statcan.gc.ca`（www / www150 / www12）・`publications.gc.ca`・`canada.ca` 系・Wikipedia は試していない（ブロック済みと指示あり）
- 社長ルール：⚠ は台本の語りで使わない。✅ も 📄 で読むまでは「丸めて言い切れる範囲」にとどめる。語調は中立。誰の責任かは語らない。移民・一時滞在者は数字の事実だけを置き、良し悪しを評価しない
- 既存の `01_research.md` の記号（CAN_GROW23・CMHC_GAP25・CMHC_GAP26 など）と重なる事実は、関係を「備考」に書いた

## 1. 家の値段（いつから、どれだけ）

| 記号 | 事実（日本語） | 出典URL | 状態 |
|---|---|---|---|
| C_PRICE_REAL2005 | CMHC（2026年10月公表の国際比較）：**物価の上昇を差し引いた実質の住宅価格**は、2005年から2025年に **101%上昇（約2倍）**。比べた19か国（カナダ＋18か国）で最大。オーストラリア79%、ニュージーランド77%、アメリカ30% | CMHC Housing Observer「Canada house prices vs peer countries: why we stand apart」https://www.cmhc-schl.gc.ca/observer/2026/canada-house-prices-vs-peer-countries-why-we-stand-apart-ri ／mpamag https://www.mpamag.com/ca/mortgage-industry/market-updates/canadas-house-prices-doubled-since-2005-and-supply-fell-short/594266 ／BNN Bloomberg 2026-10-21 https://www.bnnbloomberg.ca/business/real-estate/2026/10/21/canadas-house-prices-outpaced-other-nations-in-last-two-decades-heres-why/ ／CTV https://www.ctvnews.ca/business/real-estate/article/canadas-house-prices-outpaced-other-nations-in-last-two-decades-heres-why/ | ✅（101%・最大。オーストラリア79%は2資料。NZ 77%・米30%は mpamag 系のみ ⚠） |
| C_PRICE_REAL_WHY | 同じ CMHC の分析：人口の伸び・所得の伸び・低い借入金利で需要が膨らみ、供給の伸びは比較的一定だった。2010年代後半から需要が供給を上回ってきた。実質価格は2022年に頂点、その後は下がっている | 同上（mpamag 2件、BNN Bloomberg、nowtoronto https://nowtoronto.com/news/canada-housing-prices-outpace-other-countries-cmhc/ ） | ✅（「誰のせい」ではなく需要と供給の差として使う） |
| C_PRICE_REAL_IDX | 同分析の指数：2005年＝100 → 2022年 243.59（頂点）→ 2025年 201.02 | mpamag（CMHC の図の数字として） | ⚠（1資料。グラフ化するなら本文で確認） |
| C_HPI_PEAK | CREA の全国 MLS® 住宅価格指数（HPI）の標準価格（ベンチマーク価格）は**2022年3月が頂点**（約84万カナダドル）。2026年3月は 664,400ドルで、頂点から約2割（21%）低い | The Deep Dive https://thedeepdive.ca/canadian-home-prices-are-down-21-from-their-2022-peak/ ／RBC（頂点から約20%） https://www.rbc.com/en/economics/?p=9621 ／CMHC ブログ 2022 https://www.cmhc-schl.gc.ca/observer/2022/have-house-prices-dropped-as-much-as-we-believe-this-year | ✅（「2022年春が頂点、そこから約2割下げた」まで）。頂点の金額は 841,300ドル と 840,400ドル で割れる → 金額は ⚠ |
| C_AVG_2026SEP | CREA：2026年9月の全国平均価格（季節調整なし）は 666,538ドル、前年同月比 −1.6%。HPI は前年比 −3.4% | CREA 月次発表（検索要約）https://creastats.crea.ca/en-CA/ ／ratehub・mpamag・wealthprofessional の月次記事（上記検索の一覧） | ⚠（月次の数字は CREA 本文で確認。**2026-11-17 に次の発表**があるので、使うなら最新月に差し替え） |
| C_AVG_2025DEC | CREA：2025年12月の全国平均価格は 673,335ドル（前年同月比 −0.1%） | CREA「Home Sales in Canada End 2025 Quietly」https://www.crea.ca/media-hub/news/home-sales-in-canada-end-2025-quietly/ （抜粋） | ⚠（1資料） |
| C_AVG_2005 | 全国平均価格の記録上の最低は2005年1月の約23.7万ドル（CREA の系列） | Trading Economics https://tradingeconomics.com/canada/average-house-prices ／eulerpool | ⚠（集計サイトのみ。**名目の「2005年→今で約2.8倍」は台本で言わない**。2005年比は C_PRICE_REAL2005 の「実質で約2倍」を使う） |
| C_AVG_DEF | 注意：CREA 自身が「平均価格は傾向を見るのに使えるが、地域の実際の価格は示さない」と断っている。平均価格と HPI の標準価格は別物 | CREA 月次発表の注記（検索要約） | ✅（定義の注意として） |

## 2. 手の届きやすさ（所得に対する住宅費）※2つの独立した指標が同じ向きを示す範囲だけ

| 記号 | 事実（日本語） | 出典URL | 状態 |
|---|---|---|---|
| C_AFF_RBC | RBC（ロイヤル銀行）の指標：中央値の所得の世帯が平均的な家を持つ費用は、**2023年第4四半期に所得の約64%**で過去最高。2025年第4四半期は 52.4% まで下がった（8四半期連続で改善） | RBC「Ownership cost dip…」https://www.rbc.com/en/economics/canadian-analysis/canadian-housing/housing-affordability/ownership-cost-dip-a-turning-point-for-housing-affordability/ ／RBC 2026年3月 PDF https://www.rbc.com/en/economics/wp-content/uploads/sites/23/2026/03/Affordability-gains-become-weaker-and-sparser-in-Canada-.pdf ／betterdwelling https://betterdwelling.com/buying-a-house-in-canada-has-never-been-harder-years-to-correct-rbc/ | ✅（「2023年末が最悪、所得の6割超」）。頂点の値は 63.5%（初報）・63.7%・63.8%（改訂）で割れる → 小数は言わない |
| C_AFF_NBC | ナショナル銀行（NBC）の指標（住宅ローン返済額÷所得）：2025年第1四半期 55.4%、2026年第2四半期 51.1%（約4年ぶりの低さ）。長期平均は約40%台前半 | NBC Housing Affordability Monitor https://www.nbc.ca/content/dam/bnc/taux-analyses/analyse-eco/logement/housing-affordability.pdf ／storeys https://storeys.com/housing-affordability-improving-not-fast-enough/ ／mpamag https://www.mpamag.com/ca/mortgage-industry/market-updates/home-prices-fuel-record-affordability-gains-but-relief-remains-elusive/586404 ／Stockwatch（51.6%・長期平均40.5%） | ⚠（四半期ごとの数字が資料で割れる：51.1% と 51.6%、長期平均 40.5% と 40.7%） |
| C_AFF_BOTH | **2つの銀行の指標が一致する点**：①2023年末前後が最も手が届きにくかった ②その後は改善が続いている ③それでも住宅費は所得の半分を超え、長期平均（4割前後）より高い | C_AFF_RBC・C_AFF_NBC の出典 | ✅（台本は「今も所得の半分以上が家の費用に消える計算」まで。銀行名と指標名を資料表に置く） |
| C_AFF_OECD | OECD の「住宅価格÷所得」指数（2015年＝100）：カナダは2022年第2四半期に 148.16 で G7 最高 | CTV 2022 https://www.ctvnews.ca/business/how-canada-has-taken-on-more-mortgage-debt-than-any-other-g7-nation-explained-in-5-charts-1.6149517 ／whichmortgage（指数の定義） https://www.whichmortgage.ca/mortgage-guide/canadas-homepricetoincome-ratio-ranks-no--1-worldwide/257854 ／Statista（2022年 Q2 が頂点） https://statista.com/statistics/591782 | ⚠（G7最高は2022年の値で、最新四半期は未確認。「年収の○倍」ではなく**2015年比の伸び**である点も誤解されやすい → 台本で使わない） |

## 3. 家賃と空室率

| 記号 | 事実（日本語） | 出典URL | 状態 |
|---|---|---|---|
| C_VAC23 | CMHC：2023年の全国の賃貸専用住宅（purpose-built）の空室率は **1.5%**。CMHC が全国の空室率を取り始めた1988年以来の最低 | CMHC ブログ「Canada's rental landscape 2023…」https://www.cmhc-schl.gc.ca/blog/2024/canadas-rental-landscape-2023-show-record-low-vacancies-affordability-concerns ／CMHC 2024年報告の前年比較（下の C_VAC24 の各資料） ／blogTO https://media.blogto.com/city/2024/02/canadas-rental-vacancy-rate-toronto | ✅ |
| C_VAC24 | 2024年は **2.2%** に上昇（10年平均 2.7% より低い）。賃貸専用の住戸が 4.1% 増え、30年余りで最大の増加 | CMHC ニュースリリース https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2024/historic-rental-supply-growth-raises-canada-vacancy-rate ／Fall 2024 Rental Market Report PDF https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/housing-markets-data-and-research/market-reports/rental-market-report/fall-2024/rental-market-report-fall-2024-en.pdf ／link2build https://www.link2build.ca/news/articles/2024/december/cmhc-purpose-built-rentals-up-by-4-over-last-12-months ／mpamag https://www.mpamag.com/ca/mortgage-industry/market-updates/canadas-rental-supply-surges-to-decade-high-levels/518609 | ✅ |
| C_VAC25 | 2025年は **3.1%** に上昇し、10年平均を上回った | CTV https://www.ctvnews.ca/business/article/rent-growth-slowed-in-2025-as-national-vacancy-rate-continued-to-rise-cmhc/ ／advisor.ca https://advisor.ca/economy/economic-indicators/rent-growth-slowed-in-2025-as-national-vacancy-rate-continued-to-rise-cmhc/ ／BNN Bloomberg https://www.bnnbloomberg.ca/business/2025/12/11/rent-growth-slowed-in-2025-as-national-vacancy-rate-continued-to-rise-cmhc/ | ✅ |
| C_RENT2BR | CMHC：全国の2LDK相当（2ベッドルーム）の賃貸専用住宅の平均家賃は 2023年 2,049ドル → 2024年 2,173ドル | Fall 2024 Rental Market Report（検索要約）／connectcre https://www.connectcre.ca/stories/canadian-apartment-rent-growth-falls-to-5-4-in-2024-cmhc/ | ⚠（抜粋1系統。使うなら本文確認） |
| C_RENT_TOR_VAN25 | CMHC 2025年：トロント都市圏の賃貸専用2ベッドルームの平均家賃 2,034ドル（+3.5%）・空室率 3%。バンクーバー都市圏 2,363ドル（+2.2%）・空室率 3.7%（1988年以来の高さ）。分譲マンションの賃貸はトロント 2,904ドル、バンクーバー約2,900ドルと、ずっと高い | blogTO https://www.blogto.com/real-estate-toronto/2025/12/ontario-major-rental-markets-2025/ ／dailyhive https://dailyhive.com/vancouver/metro-vancouver-rental-housing-vacancy-rate-2025-record-high ／CMHC 主要都市ページ https://www.cmhc-schl.gc.ca/en/professionals/housing-markets-data-and-research/market-reports/rental-market-reports-major-centres | ⚠（都市別は各1資料。「賃貸専用」と「分譲の賃貸」を混ぜやすい） |
| C_ASKRENT | Rentals.ca／Urbanation：2026年10月の全国平均の募集家賃は 2,036ドル（前年比 −3.2%）。前年割れは約2年続く。バンクーバーは 2,754ドル（前年比 +0.6%、約3年ぶりの上昇） | CTV https://www.ctvnews.ca/business/real-estate/article/average-asking-rents-fall-32-in-october-but-prices-rising-in-toronto-vancouver/ ／CP24 https://www.cp24.com/news/money/2026/11/05/average-asking-rents-fall-32-in-october-but-prices-rising-in-toronto-vancouver/ ／advisor.ca https://www.advisor.ca/economy/economic-indicators/average-asking-rents-fall-3-2-in-october/ ／dailyhive | ✅（全国 2,036ドル・−3.2%）／都市別の金額は ⚠ |
| C_RENT_DEF | 注意：CMHC の家賃は「今住んでいる人も含む平均」、Rentals.ca は「新しく募集中の物件の平均」。数字の意味が違うので並べない | 両機関の定義（上記資料） | ✅（定義の注意） |

## 4. 需要：人口の伸びと世帯

| 記号 | 事実（日本語） | 出典URL | 状態 |
|---|---|---|---|
| C_POP23 | 2024年1月1日の人口 40,769,890人。2023年の1年間で **1,271,872人増**、増加率 3.2%（初報）で1957年（3.3%）以来の高さ。増加の 97.6% が国外からの移動。一時滞在者（非永住者）が 804,901人増、永住の移民が 471,771人 | Statistics Canada The Daily 2024-03-27 https://www150.statcan.gc.ca/n1/daily-quotidien/240327/dq240327c-eng.htm ／CBC https://www.cbc.ca/lite/story/1.7157233 ／National Observer https://nationalobserver.com/2024/03/28/news/canadas-2023-population-growth-rate-highest-1957 ／Global News https://globalnews.ca/news/10386750/canada-41-million-population | ✅（`01_research.md` の CAN_GROW23 と同じ）。**後の改訂で2023年は 3.1% とされる**（下の C_POP24）→ 台本は「1年で約127万人増、1957年以来の伸び」とし、小数の率は言わない |
| C_POP24 | 2024年の1年間の増加は 744,324人（+1.8%）。2022年 +2.5%、2023年 +3.1%（改訂値）より低い | Statistics Canada「Canada's population estimates, fourth quarter 2024」https://www.statcan.gc.ca/o1/en/app/7924-canadas-population-estimates-fourth-quarter-2024 ／The Daily 2025-03-19 https://www.statcan.gc.ca/daily-quotidien/250319/dq250319a-eng.htm ／地方紙配信（検索一覧） | ✅（暫定値。将来改訂あり） |
| C_POP_JUL24 | 2023年7月1日〜2024年7月1日の1年で 1,205,115人（+3.0%）増え、2024年7月1日の人口は 41,288,599人 | Statistics Canada 年次人口推計 2024 https://www150.statcan.gc.ca/n1/pub/91-215-x/91-215-x2024001-eng.htm ／The Daily 2024-09-25 https://www150.statcan.gc.ca/n1/daily-quotidien/240925/dq240925a-eng.htm ／ckpgtoday（41,288,599） | ✅ |
| C_POP25 | 2025年は人口が減った：7〜9月期 −76,068人（−0.2%）、10〜12月期 −103,504人（暫定）。主因は一時滞在者の減少（7〜9月期 −176,479人で1971年以来最大の四半期減少）。統計局の担当者は「2025年は、推計上、連邦成立以来初めて人口が減った暦年」 | The Daily 2025-12-17 https://www150.statcan.gc.ca/n1/daily-quotidien/251217/dq251217b-eng.htm ／CIC News https://www.cicnews.com/2025/12/canadas-population-shrinks-for-the-first-time-in-2025-driven-by-tightened-immigration-policy-1263630.html ／advisor.ca https://advisor.ca/economy/economic-indicators/population-dropped-in-closing-months-of-2025-due-to-immigration-slowdown/ ／blogTO https://www.blogto.com/travel/2026/03/canada-first-population-drop-80-years/ | ✅（7〜9月期の減少・一時滞在者の減少）。「連邦成立以来初」は blogTO 経由の発言1件 → ⚠。10〜12月期は暫定値 |
| C_NPR_SHARE | 一時滞在者（非永住者）が人口に占める割合の頂点は2024年10月1日。値は統計の版で 7.4%（2025年3月版）→ 7.6%（2025年9月版）→ 7.2%（方法改訂後）と変わる。2026年7月1日は 6.7% | The Daily 2025-03-19（7.4%）／The Daily 2025-09-24 https://www150.statcan.gc.ca/n1/daily-quotidien/250924/dq250924a-eng.pdf （7.6%）／ユーコン準州統計局の要約 https://yukon.ca/sites/default/files/2025-12/fin-non-permanent-residents-october-1-2025.pdf ／Western Standard | ⚠（版で数字が動く。台本では割合を言わない） |
| C_LEVELS25 | 移民受け入れ計画 2025–2027（2024年10月24日発表）：永住者の目標を 2025年 39.5万人、2026年 38万人、2027年 36.5万人に下げた（前の計画は年50万人規模）。一時滞在者を初めて計画に入れ、2026年末までに人口の5%に下げる目標 | IRCC「Government of Canada reduces immigration」https://www.canada.ca/en/immigration-refugees-citizenship/news/2024/10/government-of-canada-reduces-immigration.html ／IRCC 補足情報 https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/supplementary-immigration-levels-2025-2027.html ／Fragomen https://www.fragomen.com/insights/canada-2025-2027-immigration-levels-plan-announced.html ／hrreporter https://hrreporter.com/focus-areas/compensation-and-benefits/canada-lowers-immigration-levels/389329 | ✅ |
| C_LEVELS26 | 移民受け入れ計画 2026–2028（2025年11月発表）：永住者は年38万人で横ばい。一時滞在者の新規到着は 2026年 38.5万人（2025年目標 67.3万人から約43%減）。一時滞在者の割合を2027年末までに5%未満にする目標 | CTV https://www.ctvnews.ca/politics/article/immigration-plan-slashes-student-visas-prioritizes-economic-newcomers/ ／law360 https://www.law360.com/articles/2407765 ／JD Supra https://www.jdsupra.com/legalnews/canada-releases-2026-2028-immigration-6794500/ ／CIC News | ✅（永住38万人・5%目標の年が2027年末へ）。一時滞在者の年別の数は CIC News の表だけ違う → 年別の数は ⚠ |
| C_HH21 | 2021年国勢調査：世帯数 14,978,940、平均世帯人員 **2.4人**（過去最低）。単身世帯 4,396,015（**29.3%**）で最も多い世帯の型。ルームシェア世帯は最も伸びた型（4%） | Statistics Canada Census Profile 2021 https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/index.cfm ／The Daily 2022-07-13 https://www150.statcan.gc.ca/daily-quotidien/220713/dq220713a-eng.htm ／CBC https://www.cbc.ca/lite/story/1.6519440 ／storeys https://storeys.com/canadians-live-alone-record-statcan/ | ✅ |
| C_HH_HIST | 平均世帯人員は 1861年 6.3人 → 1941年 4.3人 → 2021年 2.4人 | Business Council of Alberta（統計局データ）https://businesscouncilab.com/?p=17555 | ⚠（1資料。グラフに使うなら統計局の系列で確認） |

## 5. 世界との比較

### 5a. 人口あたりの住宅の数（G7）
| 記号 | 事実（日本語） | 出典URL | 状態 |
|---|---|---|---|
| C_STOCK_G7 | スコシアバンク（2021年5月）：2020年のカナダの住宅数は **人口1,000人あたり424戸で G7 最少**（2016年は427戸で、減っている）。G7 平均は 471戸 | Scotiabank Housing Note 2021-05-12 https://www.scotiabank.com/ca/en/about/economics/economics-publications/post.other-publications.housing.housing-note.housing-note--may-12-2021-.html ／dailyhive https://dailyhive.com/toronto/canada-new-housing-population-statistics ／canadianrealestatemagazine https://www.canadianrealestatemagazine.ca/news/canada-has-lowest-housing-units-per-capita-in-g7/ ／The Hub https://thehub.ca/2021/05/20/canadas-housing-shortage-is-a-long-term-problem-thats-only-getting-worse/ | ✅（「2020年、G7で最少」）。ただし出どころはスコシアバンク1社の計算で、報道はその引用 |
| C_STOCK_G7_22 | 同行の2022年1月の更新：比べ方で値が動く（424→ 1,000人あたり 425〜447、G7 平均 480） | Scotiabank Housing Note 2022-01-12 https://scotiabank.com/ca/en/about/economics/economics-publications/post.other-publications.housing.housing-note.housing-note--january-12-2022-.html | ⚠（数字は言わず「G7で最少」だけ使う） |
| C_STOCK_OECD | OECD の住宅統計（HM1.1）：2022年の OECD 平均は1,000人あたり約468戸。イタリア・フランスなどは550戸超。カナダは約426戸（Statista の図の読み取り） | OECD HM1.1 https://oecd.org/els/family/hm1-1-housing-stock-and-construction.pdf ／Statista https://statista.com/statistics/1498553/housing-stock-per-capita-worldwide-by-country ／オーストラリア住宅データ https://www.housingdata.gov.au/visualisations/housing-market/housing-stock-and-construction-oecd | ⚠（カナダ・日本の値を OECD 表で直接確認できていない。**日本の値は未取得**） |
| C_STOCK_CAVEAT | 反対の見方：カナダは世帯人員が多めなので、「人口あたり」で少なくても「世帯あたり」で少ないとは限らない（National Post のコラム） | National Post 2021-07-28 https://www.pressreader.com/canada/national-post-latest-edition/20210728/282119229576115 | ⚠（1資料。台本で使うなら「数え方で変わる」程度の注意） |

### 5b. 日本・東京
| 記号 | 事実（日本語） | 出典URL | 状態 |
|---|---|---|---|
| C_JP_ZONES | 日本の用途地域は**都市計画法で全国共通の13種類**（住居系8・商業系2・工業系3）。2018年4月1日に「田園住居地域」が加わり12→13種類。どの種類をどこに指定するかは自治体が決める | at home 解説 https://www.athome.co.jp/contents/words/term_430/ ／三井住友トラスト基礎研究所 用語集 https://smtrc.jp/useful/glossary/print/n/430 ／船橋市 https://www.city.funabashi.lg.jp/machi/juutaku/008/p002585.html ／宅建解説 https://takken-success.info/horeiseigen/d-5/ | ✅（国交省の本文は未確認） |
| C_JP_INCLUSIVE | 日本の用途地域は「排他的」ではなく「包括的」：住宅はほとんどの用途地域で建てられる。種類の中身は国の法律で決まるので、国会が全国の規制を一度に変えられる | Sightline 2021 https://sightline.org/2021/03/25/yes-other-countries-do-housing-better-case-1-japan ／Urbanomics https://urbanomics.substack.com/p/thoughts-on-affordable-housing-iv ／Marginal Revolution 2016 https://marginalrevolution.com/marginalrevolution/2016/08/laissez-faire-in-tokyo.html | ✅（「工業専用地域」は住宅不可なので「ほとんど」と言う） |
| C_TOKYO_STARTS23 | 東京都の新設住宅着工は **2023年（令和5年）128,330戸**（前年比 4.5%減）。全国は 819,623戸で、東京都は全国の 15.7% | 東京都 報道発表 2024-02 https://www.metro.tokyo.lg.jp/information/press/2024/02/2024020714 ／東京都都市整備局 審議会年報 https://www.toshiseibi.metro.tokyo.lg.jp/documents/d/toshiseibi/pdf_keikaku_chousa_singikai_nenpo_2024_2-2 | ✅（同じ都の2資料なので独立性は弱い。国交省の住宅着工統計で確認したい） |
| C_TOKYO_VS_CAN | 自前の比較：東京都1都の2023年の着工 128,330戸は、カナダ全国の2023年の着工 240,267戸の約半分（128,330÷240,267≒0.53） | C_TOKYO_STARTS23 と C_STARTS24 の前年値から計算 | ✅（計算。人口は東京都約1,400万人・カナダ約4,000万人と規模が違う点を添える。東京都人口は本調査で未取得 ⚠） |
| C_TOKYO_2014 | 2014年の東京都の着工 142,417戸は、イングランド全体（137,010戸）より多い（FT の記事が出どころ） | Marginal Revolution https://marginalrevolution.com/marginalrevolution/2016/08/laissez-faire-in-tokyo.html ／Urbanomics ／FEE https://fee.org/articles/why-isnt-rent-in-tokyo-out-of-control/ | ⚠（すべて FT 記事の孫引き。FT 本文未確認） |
| C_TOKYO_PRICE | **「東京は価格が安定」とは言い切れない**：不動産経済研究所によると2023年の東京23区の新築マンション平均は 1億1,483万円（前年比 +39.4%）で、初めて1億円を超えた | nippon.com https://www.nippon.com/ja/japan-data/h01896/ ／ビジネスジャーナル https://biz-journal.jp/money/post_359540.html ／プレジデント https://president.jp/articles/-/75215 | ✅（事実として）。→ 東京の「家賃が長く横ばい」は論説・ブログのみ（Daily Economy・Rethink Tokyo）で ⚠。東京の値上がりの理由が「規制」か「バブル崩壊後の経済」かも論者で割れる（harlo.substack） |

### 5c. オークランド（ニュージーランド）2016年の一斉の規制緩和
| 記号 | 事実（日本語） | 出典URL | 状態 |
|---|---|---|---|
| C_AKL_PLAN | オークランドは2016年の「統合計画（Auckland Unitary Plan）」で、**住宅用地の約4分の3**の建てられる量を増やした（主に交通の便がよい地域） | オークランド大学ワーキングペーパー https://cdn.auckland.ac.nz/assets/business/about/our-research/research-institutes-and-centres/Economic-Policy-Centre--EPC-/012WP.pdf ／オークランド大学ニュース 2025-11-05 https://www.auckland.ac.nz/en/news/2025/11/05/who-benefits-from-upzoning--.html..html | ✅ |
| C_AKL_SUPPLY | 研究（Greenaway-McGrevy と Phillips、Journal of Urban Economics 2023年）：2016〜2021年に許可された住宅のうち約2万2千戸がこの計画によって増えた分。市の主席エコノミストの説明では、計画がなければ 43,900戸のところ実際は 65,700戸（約5割増） | RNZ 2024-04-01 https://www.rnz.co.nz/news/top/513134/auckland-unitary-plan-improving-housing-affordability-research-shows ／Auckland Council OurAuckland https://ourauckland.aucklandcouncil.govt.nz/news/2024/03/auckland-upzoning-sparks-more-homes-and-improved-affordability/ ／NZ Herald ／サウサンプトン大学 eprints https://eprints.soton.ac.uk/476826/ | ✅（約2万2千戸・約5割増。別記事で 21,800戸） |
| C_AKL_RENT | 同じ研究系列：6年後の3ベッドルームの家賃は、計画がなかった場合より低い。幅は資料で割れる（22〜35%・26〜33%・約28%） | オークランド大学 WP016 https://cdn.auckland.ac.nz/assets/business/about/our-research/research-institutes-and-centres/Economic-Policy-Centre--EPC-/WP016.pdf ／Motu https://motu-www.motu.org.nz/wpapers/24_07.pdf ／Auckland Council（26〜33%） ／CA YIMBY https://cayimby.org/on-sale-rental-housing-25-to-50-percent-off-some-upzoning-required/ | ✅（「家賃の伸びが抑えられた」という向き）／**数字は ⚠**（推計の版で違う。「研究者の推計」として資料表に置くだけ） |
| C_AKL_CAVEAT | 研究者自身・論評とも「規制緩和だけで万能ではない」とする。誰が得をしたかの追加研究が進行中 | Royal Society Te Apārangi https://www.royalsociety.org.nz/research/will-upzoning-deliver-housing-affordability-for-everyone-evidence-from-auckland ／Motu https://motu.nz/about-us/news/marsden-funded-study-housing-upzoning | ✅（中立の締めに使える） |

### 5d. ミネアポリス（アメリカ）2040計画
| 記号 | 事実（日本語） | 出典URL | 状態 |
|---|---|---|---|
| C_MPLS_PLAN | ミネアポリス市議会は2018年12月に「2040総合計画」を可決し、一戸建て専用の区域でも**3世帯住宅（トリプレックス）まで**建てられるようにした。区域の変更は2020年1月1日に施行。報道は「一戸建て専用の区域をやめた最初のアメリカの大都市」とした | Planetizen 2019-11 https://planetizen.com/news/2019/11/107139-minneapolis-officially-ends-single-family-zoning-change-take-effect-january-1 ／Strong Towns https://www.strongtowns.org/journal/2018/12/12/three-cheers-for-minneapolis-the-3-is-for-triplex ／Brookings https://www.brookings.edu/articles/minneapolis-2040-the-most-wonderful-plan-of-the-year/ ／CBS Minnesota https://www.cbsnews.com/minnesota/news/minneapolis-city-council-passes-2040-plan-measure-on-duplexes-triplexes/ | ✅（採決の票数は 12-1 と 10-1 で割れる → 言わない） |
| C_MPLS_PEW | ピュー慈善信託（2024年1月）：2017〜2022年にミネアポリスの住宅数は **12%増**、家賃は **1%増**。同じ期間、州のほかの地域は住宅4%増・家賃14%増 | Pew https://pew.org/3S76oXJ ／Route Fifty 2024-01 https://route-fifty.com/management/2024/01/do-land-use-reforms-spur-housing-development-you-betcha/393154 ／Axios 2024-01-08 https://www.axios.com/local/twin-cities/2024/01/08/minneapolis-housing-policies-blueprint-affordability ／Smart Cities Dive https://www.smartcitiesdive.com/news/archive-acc-report-smart-land-use-policies-have-increased-housing-supply-and-kept-rent-low-in-minnea/755649/ | ✅ |
| C_MPLS_SIZE | 同じ Pew の分析：増えた住宅の約87%は20戸以上の大きな建物。2〜4戸の建物は約1%で、トリプレックス解禁の効果は小さい | Pew（同上）／ミネソタ州議会資料 https://www.lrl.mn.gov/archive/minutes/senate/2024/housing/20240307/housing_20240307_SF3964-Materials-Pew.pdf | ✅（Pew 自身＋州議会提出資料。独立性は弱い）。「トリプレックスで家が増えた」と言わない根拠 |
| C_MPLS_FED | ミネアポリス連銀（2026年）：家賃は安定しているが開発は停滞。2040計画の効果を市場の上下から切り分けるのは難しい | Minneapolis Fed https://www.minneapolisfed.org/article/2026/minneapolis-2040-plan-indicators-point-to-stable-rents-stalled-development | ⚠（1資料。慎重な見方の例として資料表に） |

## 6. この先（予測と目標）

| 記号 | 事実（日本語） | 出典URL | 状態 |
|---|---|---|---|
| C_STARTS24 | CMHC：住宅着工は 2023年 240,267戸 → 2024年 245,120戸（約2%増。後に 245,367戸へ改訂） | CMHC ニュースリリース 2025 https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2025/housing-starts-up-2-per-cent-2024-from-2023 ／CBC https://www.cbc.ca/lite/story/1.7433141 ／advisor.ca https://advisor.ca/economy/economic-indicators/total-housing-starts-rose-2-last-year-from-2023/ | ✅ |
| C_STARTS25 | 2025年の着工は 259,028戸（前年比 5.6%増、過去5番目の多さ）。賃貸住宅の着工は2年続けて過去最多で、都市部の着工の半分強 | BNN Bloomberg 2026-01-16 https://www.bnnbloomberg.ca/business/2026/01/16/cmhc-says-housing-starts-totalled-259028-in-2025-up-56-per-cent-from-2024 ／wealthprofessional https://www.wealthprofessional.ca/investments/alternative-investments/cmhc-reveals-which-cities-are-leading-lagging-on-housing-starts/391368 | ✅ |
| C_HMO26 | CMHC 住宅市場見通し（2026年7月22日の年央更新）：2026年は住宅価格が下がり、2027〜28年は小幅な上昇に戻る。着工は2026年 241,400戸に減る見込み（分譲マンションの着工が特にオンタリオ州・BC州で歴史的に少ない） | CTV https://www.ctvnews.ca/business/real-estate/article/cmhc-now-sees-home-sales-prices-declining-in-2026-amid-weaker-market-activity/ ／BNN Bloomberg 2026-07-22 https://www.bnnbloomberg.ca/business/real-estate/2026/07/22/cmhc-now-sees-home-sales-prices-declining-in-2026-amid-weaker-market-activity/ ／mpamag https://www.mpamag.com/ca/mortgage-industry/market-updates/cmhc-cuts-housing-forecast-as-sales-and-prices-set-to-slide/583339 ／CMHC Observer https://www.cmhc-schl.gc.ca/observer/2026/summer-update-2026-housing-market-outlook | ✅（「2026年は価格が下がる見込み」）／着工 241,400戸 は別資料で約24.7万戸 → 数は ⚠ |
| C_GAP_FALL26 | CMHC 住宅供給報告（2026年秋、9月10日ごろ）：2019年並みの手ごろさに**2036年までに**戻すには年 41.7万〜46.9万戸が必要。今のペースは年約23.1万戸で、必要量の**約半分**。不足の大きさは2025年版とほぼ同じ。トロント・カルガリーは差が縮み、オタワ・モントリオールは広がった。着工の約6割が賃貸専用住宅（10年前は2割未満） | BNN Bloomberg 2026-09-10 https://www.bnnbloomberg.ca/business/real-estate/2026/09/10/canada-needs-up-to-469-million-new-homes-by-2036-but-construction-could-slow-cmhc/ ／CTV https://www.ctvnews.ca/business/real-estate/article/canada-needs-up-to-469-million-new-homes-by-2036-but-construction-could-slow-cmhc/ ／advisor.ca https://www.advisor.ca/economy/economic-indicators/canada-needs-up-to-4-7m-new-homes-by-2036-cmhc/ ／C.D. Howe https://cdhowe.org/publication/prices-ease-a-little-but-the-housing-supply-gap-widens/ ／CMHC ニュースリリース https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2026/slowing-home-construction-threatens-recent-affordability-gains | ✅（年41.7万〜46.9万戸・2036年・今の約半分）。→ `01_research.md` の **CMHC_GAP26 は ✅ に上げられる**（発表日 2026-09-10 ごろ）。都市別の戸数は ⚠ |
| C_BCH | 連邦政府は2025年9月14日に新しい住宅機関「ビルド・カナダ・ホームズ（Build Canada Homes）」を発表。目標は**住宅建設のペースを2倍にすること**。2025年予算（11月4日）で5年間130億ドル。最初は連邦の土地6か所で約4,000戸 | CTV https://www.ctvnews.ca/politics/article/carney-government-launches-build-canada-homes-with-13b-initial-investment/ ／Mondaq https://www.mondaq.com/canada/real-estate/1690392/build-canada-homes-a-federal-reset-on-affordable-housing-delivery ／BLG 2026-08 https://www.blg.com/en/insights/2026/08/build-canada-homes-first-moves-4000-direct-build-units-and-a-controversial-bc-condo-conversion-push ／Habitat for Humanity https://habitat.ca/en/news/habitat-for-humanity-canada-applauds-the-launch-of-build-canada-homes ／canada.ca 2026-01 https://www.canada.ca/en/housing-infrastructure-communities/news/2026/01/build-canada-homes-thousands-of-homes-in-the-pipeline.html | ✅（「2倍」「130億ドル」）。**「年50万戸」という数字の出典は見つからない → 言わない**。PBO が「達成の全体計画が出ていない」と指摘（aole.org 経由）は ⚠ |
| C_ONT150 | オンタリオ州の目標「2031年までに150万戸」：2025年の実績は 86,760戸（州の数え方で、目標は年15万戸）。州の財務監視機関（FAO）は着工が2009年以来の低さと指摘 | Global News https://globalnews.ca/news/12051237/ontario-housing-target-progress-2025/ ／CBC https://www.cbc.ca/lite/story/1.7558645 ／CBC https://www.cbc.ca/lite/story/1.7536883 ／CHCH | ✅（目標に届いていないこと）／86,760戸は Global News の内部資料報道のみ → 数は ⚠。州の「戸数」は地下室の住戸・介護施設のベッドなども含む定義 |

## 台本の語りで使える強い事実（候補10）
1. 物価を差し引いた家の値段は、2005年から2025年に約2倍。比べた19か国で最大（C_PRICE_REAL2005）
2. 全国の標準価格は2022年春が頂点で、そこから約2割下げた（C_HPI_PEAK）
3. 2つの銀行の指標で、2023年末が最も手が届きにくく、今も家の費用は中央値の所得の半分を超える（C_AFF_BOTH）
4. 2023年の賃貸空室率は1.5%で、1988年以来の最低。2024年2.2%、2025年3.1%と上がった（C_VAC23・C_VAC24・C_VAC25）
5. 2023年の1年で人口が約127万人増え、1957年以来の伸び（C_POP23）。2025年は一時滞在者が減って人口が減る四半期が続いた（C_POP25）
6. 政府は永住者の目標を年39.5万人（2025年）→38万人（2026年）に下げ、一時滞在者を人口の5%に下げる目標を立てた（C_LEVELS25・C_LEVELS26）
7. 2021年、1世帯の平均は2.4人で過去最低。単身世帯が29.3%で最も多い型（C_HH21）→ 人が同じでも世帯が増えれば家は多く要る
8. 2020年、人口1,000人あたりの住宅は424戸で G7 最少（C_STOCK_G7）
9. 日本の用途地域は全国共通の13種類で、住宅はほとんどの地域で建てられる。東京都だけで2023年に約12.8万戸が着工、カナダ全国の約半分（C_JP_ZONES・C_JP_INCLUSIVE・C_TOKYO_STARTS23・C_TOKYO_VS_CAN）
10. オークランドは2016年に住宅用地の約4分の3で建てられる量を増やし、研究では5年で約2万2千戸が上乗せ（C_AKL_PLAN・C_AKL_SUPPLY）。ミネアポリスは2017〜22年に住宅12%増・家賃1%増（C_MPLS_PEW）
- 未来：CMHC は2036年までに年41.7万〜46.9万戸が必要、今のペースはその約半分（C_GAP_FALL26）。連邦は建設ペース2倍を目標に新機関を作った（C_BCH）

## 台本で使わないこと
- 「家の値段が2005年の約2.8倍」（名目・集計サイトのみ。2005年比は「実質で約2倍」だけ）
- HPI の頂点の金額（84.1万か84.0万で割れる）、平均価格の月次の細かい数字（毎月更新。使うなら公開直前に CREA で差し替え）
- 「年収の○倍」「G7で一番買いにくい」（OECD 指数は2015年比の伸びで、最新の順位も未確認）
- 手ごろさ指標の小数（63.5/63.7/63.8%、51.1/51.6%）
- 一時滞在者の人口割合（7.2/7.4/7.6% と版で変わる）、2026–2028年計画の一時滞在者の年別人数
- 2023年の人口増加率の小数（初報3.2%・改訂3.1%）。「約127万人増、1957年以来の伸び」と言う
- 「移民が住宅不足の原因」「政府の失敗」など、原因や責任を一つに決める言い方。人口・受け入れ計画は数字の事実として置くだけ
- 「東京は家の値段が安定している」（2023年の23区の新築マンションは平均1億円超。言えるのは「たくさん建てている」まで）
- 「東京の家賃は30年横ばい」（論説・ブログのみ）
- オークランドの家賃の下げ幅の数字（22〜35%・26〜33%・28%で割れる）
- 「トリプレックス解禁でミネアポリスの家が増えた」（増えた分の大半は20戸以上の建物。Pew 自身が解禁の効果は小さいとする）
- 「年50万戸の政府目標」（出典なし）
- 日本の人口1,000人あたり住宅数（未取得）

## 未確認点・ブロッカー
1. **一次資料の本文に1件も届いていない（📄 0件）**。`www.crea.ca`・`www.pewtrusts.org` は WebFetch で名前解決できず失敗。CMHC・統計局・IRCC（canada.ca）・OECD・国交省は試していない。台本前にこれらのホストの許可が必要
2. CREA の最新月（2026年10月分は 2026-11-17 公表予定）で価格を差し替えるか
3. OECD HM1.1 の表（HM1.1.A1）でカナダ・日本の「1,000人あたり住宅数」を直接確認したい。日本の値は未取得
4. 東京都の人口（比較の分母）と、国交省「住宅着工統計」による東京都2023年の値の確認（今は都の資料2件のみ）
5. CMHC 2024年・2025年の都市別家賃・空室率（トロント・バンクーバー）は報道1件ずつ。CMHC の表で確認したい
6. CMHC 2026年秋の供給報告の本文（都市別の戸数・「今のペース23.1万戸」の定義）
7. 2026年見通しの着工数（241,400戸か約24.7万戸か）は版の違いと思われるが未確認
8. 「2025年は連邦成立以来初の人口減の年」は統計局担当者の発言の報道のみ。The Daily 本文で確認したい
9. NBC 指標の長期平均（40.5% か 40.7%）
10. ミネアポリス連銀（2026年）の記事本文と、Pew の分析期間・比較対象の定義
