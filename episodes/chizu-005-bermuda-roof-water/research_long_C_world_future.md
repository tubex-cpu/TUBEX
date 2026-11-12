# 長尺版リサーチ C：世界の「屋根の水」と未来（chizu-005-bermuda-roof-water）

- 作成 2026-11-12 Claude（長尺化 20〜30分のうち、世界と未来のパート約6〜8分ぶんの材料）。commit なし
- 状態の記号：📄＝ページ本文を自分で読んだ／✅＝2つ以上の独立した資料が一致（検索結果の抜粋で確認）／⚠＝単独の資料・資料で食い違い・数字の年が古い
- **今回も 📄 は0件**。WebFetch を試した law.justia.com・www.aquagib.gi・www.abs.gov.au・www.rnz.co.nz・www.frontiersin.org・www.ipcc.ch は、すべて名前解決できず失敗（この環境の許可ドメイン外）。以下はすべて Web 検索の抜粋で照合した
- 社長ルール：⚠ は台本の語りで使わない。✅ も一次資料（📄）で読むまでは「数字を丸めて言い切れる範囲」にとどめる
- 座標は地図に点を置くための概略値（経度, 緯度・10進）。地名の位置として自分で付けたもの。出典の事実ではない

## 1. 世界の「雨を集める」場所（候補と強さ）

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 | 座標 (lon, lat) |
|---|---|---|---|---|
| USVI_LAW | 米領ヴァージン諸島の法律（V.I. Code 第29編 §308）は、住宅・アパート・ホテルに、屋根1平方フィートあたり **平屋10ガロン、2階建て以上15ガロン** の使える容量を持つ貯水槽（シスターン）を求める。その他の建物は4.5ガロン（教会・倉庫は除外）、店舗併用住宅は10ガロン | Justia「2019 US Virgin Islands Code §308」 https://law.justia.com/codes/virgin-islands/2019/title-29/chapter-5/subchapter-viii/308 ／USVI 計画・天然資源局（DPNR）「USVI Rainwater Catchment Systems Comprehensive Guide」（2024-08、§308 を引用） https://dpnr.vi.gov/wp-content/uploads/2025/01/USVI-Rainwater-Catchment-Systems-Comprehensive-Guide_Aug-23-2024.pdf ／NOAA 文書 https://repository.library.noaa.gov/view/noaa/849/noaa_849_DS1.pdf ／ProTradeCraft（セント・クロイ） | ✅（条文の数字は3資料一致）／⚠（2019年版の条文。2024年の建築基準改正法案 Bill 35-0172 後も同じかは未確認） | セント・トーマス島シャーロット・アマリー (-64.93, 18.34) |
| USVI_CALC | 自前の換算：10米ガロン/平方フィート ≒ 屋根1m²あたり約410リットル（10×3.785L÷0.0929m²＝407L）、15ガロンなら約610リットル | USVI_LAW から計算 | ✅（計算） | ― |
| GIB_CATCH | ジブラルタルでは、ザ・ロック（岩山）東側の砂の斜面に、木の杭を打って枠を組み、**波形の亜鉛めっき鉄板**を張って雨を集めた。1903年に約10エーカーで始まり、1911〜14年に24エーカー、1961年に最大の34エーカー（約14ヘクタール）に広がった | Wikipedia「Great Gibraltar Sand Dune」 https://en.wikipedia.org/wiki/Great_Gibraltar_Sand_Dune ／Wikipedia「Water supply and sanitation in Gibraltar」 https://en.wikipedia.org/wiki/Water_supply_and_sanitation_in_Gibraltar ／Essex & Suffolk Water（ジブラルタル史） https://essexwatersupply.com/gibraltar/ ／AquaGib「History」 https://www.aquagib.gi/history/ （抜粋） | ✅（年と面積は複数一致。「34ヘクタール」と書く資料は誤りとみて採らない） | 東側集水面（サンディ・ベイ上） (-5.343, 36.136) |
| GIB_RES | 集めた水は、岩山の中をくりぬいた貯水池（Willis's Road Reservoirs）にためた。最初の4つは1898〜1900年に掘られ、1961年までに12に増えた | 同上（Wikipedia 2件、Essex & Suffolk Water、ジブラルタル遺産省の石灰窯の解説 https://www.ministryforheritage.gi/heritage-and-antiquities/old-lime-kiln-1069 ） | ✅（4つ・1898〜1900年）／⚠（12という数は1資料） | 同上 |
| GIB_END | 集水面は1993年10月に水源としての運用を終えた。海水淡水化プラントの登場で不要になり、1990年代に撤去されて砂丘の自然に戻された。今の主な水源は海辺の淡水化プラント | AquaGib History（1993年10月）、Wikipedia「Great Gibraltar Sand Dune」（1991年に不要と判断、1990年代に撤去）、Britannica Q&A https://britannica.com/question/What-is-the-source-of-freshwater-in-Gibraltar 、Visit Gibraltar https://visitgibraltar.gi/see-and-do/the-great-east-side-sand-slopes-and-former-water-catchments | ✅（「淡水化で役目を終え、撤去」）／⚠（撤去の正確な年） | 同上 |
| MAJ_RUNWAY | マーシャル諸島の首都マジュロでは、**空港の滑走路**が雨の受け皿。滑走路の雨を処理して貯水池へ送る。日照りが長引くと、ラウラ地区の地下の淡水レンズからくみ上げて補う | AWA「Water challenges in the Marshall Islands」（2017） https://www.awa.asn.au/resources/latest-news/environment/natural-environment/water-challenges-in-the-marshall-islands ／UNFCCC Momentum for Change https://unfccc.int/climate-action/momentum-for-change/activity-database/momentum-for-change-application-of-modern-technologies-to-improve-water-security-in-rmi ／米内務省 https://www.doi.gov/oia/Interior-Provides-%24667%2C000-to-RMI-to-Bolster-Water-Supplies ／Noema「Perishing Of Thirst In A Pacific Paradise」 https://www.noemamag.com/perishing-of-thirst-in-a-pacific-paradise | ✅（滑走路→貯水池、日照り時はラウラのレンズ） | マジュロ空港 (171.27, 7.07) |
| MAJ_NUM | 滑走路の集水面は約26.3万m²、貯水池の容量は3,650万ガロン。年間の集水量は資料で1.4億〜2.23億ガロンと割れる | RMI 水道公社の発表資料 https://pacificwater.org/userfiles/file/Micronesia%20summit/Day%201b%20RMI%20Water%20Utilities.pdf ほか | ⚠（数字は資料ごとに違い、年も古い。台本では使わない） | 同上 |
| MAJ_HOME | 2016年の水道公社（MWSC）の調査で、住民の52％が自分か隣家の雨水タンクの水を飲み水にしている | AWA 2017（同上） | ⚠（1資料） | 同上 |
| MAJ_JP | 日本がマジュロの貯水池の改良に約1,670万ドルを出す | RNZ「Japan to expand water supply in Marshall Islands capital」 https://www.rnz.co.nz/international/pacific-news/426882/japan-to-expand-water-supply-in-marshall-islands-capital | ⚠（1資料。日本向けの話題として有力なので一次資料を探す） | 同上 |
| TUV_RAIN | ツバルの首都フナフティには川も湖もなく、真水は雨水だけに頼る（家庭と共同のタンク） | GCCA+SUPA 概念書（SPC） https://ccprojects.gsd.spc.int/wp-content/uploads/2020/05/TUVALU_Concept-Note_GCCA-SUPA-23.04.20.pdf ／PACC の費用便益分析草案 https://mail.globalsupportprogramme.org/sites/default/files/downloads/tuvalu_pacc_cba_final_draft.pdf ／下痢症流行の調査論文（PMC5361530） https://pmc.ncbi.nlm.nih.gov/articles/PMC5361530 | ✅ | フナフティ (179.19, -8.52) |
| TUV_2011 | 2011年、6か月ほど雨がほとんど降らず、ツバル政府は2011年9月28日に国家非常事態を宣言。ニュージーランドが10月3日から水と物資を空輸し、赤十字の淡水化装置が動いた | Al Jazeera 2011-10-03 https://www.aljazeera.com/news/2011/10/3/tuvalu-faces-drinking-water-emergency ／RNZ 2011-10-06・10-10 ／AP（Washington Times 2011-10-27） https://m.washingtontimes.com/news/2011/oct/27/tuvalus-fresh-water-crisis-deepens/ ／GEF（UNDP） https://www.thegef.org/news/adapting-climate-change-tuvalu | ✅（非常事態・NZ の空輸）／⚠（宣言日 9/28 は抜粋1件） | 同上 |
| TUV_RATION | 配給量：「1世帯1日バケツ2杯（40リットル）」と「1世帯1日20リットル」で資料が割れる | RNZ 2011-10-06（40L）、UNDP 系 PDF（20L） | ⚠（台本で数字を言わない） | 同上 |
| TUV_TAP | 日照りのとき、住民はタンクをたたいて音で残りの水の量を確かめる（ふだんからの習慣で、日照りのときに特に多い） | PMC5361530（2011年の日照り時の下痢症流行の調査） | ⚠（1論文。エピソードとして強いので本文で確認したい） | 同上 |
| TUV_DESAL | ツバル側の担当者も費用便益分析も、淡水化は高くつき、日照りの主な水源にはならないとする | 費用便益分析ポスター（terranova.org.au）、Yale e360 https://e360.yale.edu/digest/desalination_equipment_rushed_to_drought-stricken_pacific_nation | ⚠ | 同上 |
| AUS_TANK | オーストラリア統計局（ABS）の調査で、2013年に雨水タンクを水源に使う世帯は約26％（230万世帯超）。州別では南オーストラリア州46％が最多、クイーンズランド34％、ビクトリア29％、北部準州5％。2004年17％→2007年19％から増えた | ABS 4602.0.55.003「Environmental Issues: Water use and Conservation, Mar 2013」 https://www.abs.gov.au/AUSSTATS/abs@.nsf/7d12b0f6763c78caca257061001cc588/1c249b2737e66ccdca257c1300117bc0!OpenDocument ／architectureanddesign.com.au https://architectureanddesign.com.au/news/industry-news/more-australians-use-rainwater-tanks ／alkatuff（「A third of Aussie homes…」） | ✅（26％・SA46％）／⚠（**2013年が最新**。これより新しい ABS 調査は見つからない。台本では「2013年の統計で」と年を言う） | アデレード (138.60, -34.93) |
| HI_CATCH | ハワイ州では3万〜6万人が雨水タンクの水に頼って暮らす。多くはハワイ島のプナ、カウ、ハマクア地区 | ハワイ大学 CTAHR「Guidelines on Rainwater Catchment Systems for Hawai‘i」（2020改訂） https://www.ctahr.hawaii.edu/oc/freepubs/pdf/RM-12_rev.2020-web.pdf ／CTAHR 自然資源ページ（約6万人） | ⚠（大学1機関の推計で幅が大きく、年も古い） | プナ (-154.95, 19.50) |
| MALTA_RO | マルタでは水道水の約3分の2が海水淡水化（逆浸透）。地下水の割合は2010年56％→2021年41％に下がった | MaltaToday「Nearly two-thirds of your tap water comes from the sea」 https://www.maltatoday.com.mt/news/national/123510/nearly_twothirds_of_your_tap_water_comes_from_the_sea ／UHM 記事（2024年、ペンブロークのプラントが3分の1） https://weekly.uhm.org.mt/en/article/fl-2024-l-impjant-ta-pembroke-pproduca-bizzejjed-ilma-biex-jimla-10200-pixxina-olimpika/ | ✅（約3分の2）／⚠（年ごとの数字） | ペンブローク (14.48, 35.93) |
| GRD_DRAFT | グレナダは新築の建物に雨水タンクを求める「雨水利用規則」を準備中（2025年11月に草案、2026年2月に意見への回答）。昔から雨水でまかなってきたカリアク島・プティット・マルティニーク島は適用除外 | グレナダ政府 climateresilience.gov.gd 草案 https://climateresilience.gov.gd/wp-content/uploads/2025/11/Rain-Water-Harvesting-Regulations-Draft.pdf ／意見への回答 https://climateresilience.gov.gd/wp-content/uploads/2026/02/Article-Response-to-comments-on-Rainwater-Harvesting-Regulations-.pdf ／NOW Grenada 2025-12 https://nowgrenada.com/2025/12/building-climate-resilience-through-rainwater-harvesting-regulations/ | ⚠（**施行されたか未確認**。台本で使うなら公開直前に確認） | カリアク島 (-61.45, 12.48) |
| JP_SUMIDA | 両国国技館（1985年完成）は、約8,400m²の大屋根の雨を地下の約1,000トンのタンクにため、トイレの洗浄水と防災用水に使う。墨田区はこれをきっかけに雨水利用を進め、1988年に路地の雨水タンク「路地尊（ろじそん）」、1995年にタンク設置の助成、2008年に条例化 | 墨田区「雨水利用ガイド」 https://www.city.sumida.lg.jp/kurashi/kankyou_hozen/amamizu/riyou/gaido.files/gaidoR5.pdf ／日本水フォーラム（笹川、2018） https://www.waterforum.jp/wp/wp-content/uploads/2018/04/Sasagawa_WWD2018.pdf ／Newsweek 日本版 https://www.newsweekjapan.jp/articles/-/52786 ／国交省 https://www.mlit.go.jp/tochimizushigen/mizsei/mizusato/shichoson/kantou/sumidaku.htm | ✅（国技館の 8,400m²・1,000トン・1985年）／⚠（年表は日本水フォーラム資料が中心） | 両国国技館 (139.793, 35.697) |
| JP_SUMIDA_NOW | 2025年1月時点で墨田区には小型タンク「天水尊」320か所、路地尊20か所。公共施設の大型タンクを含め約800か所・約2万7千トン | 墨田区の資料（検索抜粋） | ⚠（1資料。路地尊の数は資料で21/20と割れる） | 同上 |
| JP_LAW | 「雨水の利用の推進に関する法律」（平成26年法律第17号）は2014年5月1日施行。第10条にもとづき、国・独立行政法人が建てる建物に雨水利用施設を付ける目標を2015年3月10日に閣議決定。2018年度は対象11棟すべてに設置（達成率100％） | 国土交通省 https://www.mlit.go.jp/mizukokudo/mizsei/mizukokudo_mizsei_tk1_000068.html ／国交省 PDF https://www.mlit.go.jp/common/001320762.pdf ／参議院 議案情報 https://www.sangiin.go.jp/japanese/joho1/kousei/gian/186/meisai/m186100186004.htm | ✅（法律番号・施行日・閣議決定）／⚠（11棟・100％は抜粋1件） | ― |
| JP_LAW_SCOPE | 日本の法律は、民間の家に雨水タンクを義務づけていない（義務の対象は国などの建物の「目標」）。バミューダや米領ヴァージン諸島のように一般の家に容量を求める規定は見つからない | 上の JP_LAW の資料 | ⚠（「義務がない」の確認は条文を読むまで言い切らない） | ― |

**強さの順（台本で使うなら）**：①ジブラルタル（作った→淡水化で撤去、という対比）②米領ヴァージン諸島（法律で容量、バミューダより大きい数字）③マジュロの滑走路（絵になる）④ツバル2011年（日照りの怖さ）⑤オーストラリア（約4軒に1軒）⑥両国国技館（日本とのつながり）。マルタは淡水化の例として 2 節で使う。

## 2. 世界の海水淡水化（短く）

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| DESAL_WORLD | 世界で稼働中の淡水化プラントは約1万5,906か所、真水の生産は1日約9,500万m³。うち48％が中東・北アフリカ | Jones ほか「The state of desalination and brine production: A global outlook」Science of the Total Environment 657巻（2019） https://www.pubmed.gov/30677901/ ／国連大学 https://collections.unu.edu/view/UNU:6695 ／IDA 資料 https://backup1.idadesal.org/wp-content/uploads/2019/04/The-state-of-desalination-2019.pdf | ✅（論文1本だが国連大学・PubMed・複数の紹介で一致。数字は2018年時点の推計） |
| DESAL_BRINE | 淡水化で出る濃い塩水（ブライン）は1日約1億4,200万m³。サウジアラビア・UAE・クウェート・カタールで世界の55％ | 同上 | ✅（同論文） |
| DESAL_GROW | 世界の淡水化能力は2020年から2025年末までに40％増えた（IDRA による） | Aquatech https://www.aquatechtrade.com/news/desalination/energy-efficient-desalination-continues-to-drive-water-security-strategies | ⚠（1資料） |
| DESAL_ENERGY | 淡水化のエネルギー量（kWh/m³）・島の何割が淡水化に頼るか | 出典の数字を見つけられず | ⚠（**台本で使わない**） |

## 3. 小さな島の真水の未来

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| IPCC_INTRUSION | IPCC 第6次評価報告書（第1作業部会・小島嶼のファクトシート）：海面上昇が高潮・波と重なり、沿岸の浸水を悪化させ、帯水層（地下水）への海水の侵入を増やす（確信度：高い） | IPCC AR6 WGI Regional Fact Sheet Small Islands https://www.ipcc.ch/report/ar6/wg1/downloads/factsheets/IPCC_AR6_WGI_Regional_Fact_Sheet_Small_Islands.pdf ／ANU 要約 https://iceds.anu.edu.au/files/Water%20%26%20Sanitation%20Factsheet%20-%20IPCC%20WGII%20_0.pdf ／国連カリブ事務所 https://caribbean.un.org/en/node/173533 | ✅ |
| IPCC_ARID | IPCC AR6 第2作業部会 第15章：乾燥化の予測により、多くの小島嶼、特に小島嶼開発途上国で真水が不足する（確信度：高い）。小島嶼の淡水系は地球で最も脅かされたものの一つ | IPCC AR6 WGII Chapter 15 https://ipcc.ch/report/ar6/wg2/chapter/chapter-15 ／SPREP 掲載のファクトシート https://library.sprep.org/sites/default/files/2022-03/IPCC-AR6-WGII-FactSheet-SmallIslands.pdf | ✅ |
| IPCC_MALDIVES | 同第15章：モルディブの小さな環礁の島では、海面上昇で淡水レンズが約11〜36％縮む見積もり | IPCC AR6 WGII 第15章（検索抜粋） | ⚠（抜粋1件・確信度の表記を未確認） |
| SROCC_ATOLL | IPCC 海洋・雪氷圏特別報告書（SROCC, 2019）：海面上昇で波が島を越える浸水が増え、土と淡水レンズを傷めるため、一部の環礁の島は21世紀半ばより前に住めなくなると見積もる研究がある（マーシャル諸島ロイ・ナムル島、Storlazzi ほか 2018） | IPCC SROCC 本文 https://www.ipcc.ch/srocc/?p=5516 ／USGS 発表 https://www.usgs.gov/news/national-news-release/many-low-lying-atoll-islands-will-be-uninhabitable-mid-21st-century | ✅（「研究がある」という形で。IPCC の結論として「住めなくなる」と言い切らない） |
| BMU_STUDY | バミューダ政府は英国政府の資金で、Smith Warner International に気候変動の調査「Bermuda and Climate Change: Impacts from Sea Level Rise and Changing Storm Activity」を依頼（2022年3月に開始、報告書は2024年3月付、2024年11月に公表）。2022年の開始時の大臣声明は、リスクの一つに「淡水レンズへの海水の侵入」を挙げた | gov.bm 気候変動ページ https://www.gov.bm/climatechange ／大臣声明 https://www.gov.bm/news/bermuda-and-climate-change-study-determine-impacts-sea-level-rise-and-changing-storm ／Royal Gazette 2022-03-04 https://royalgazette.com/environment/news/article/20220304/government-launches-200000-climate-change-study ／bernews 2024-11-29「Minister Roban On Climate Change Report」 https://bernews.com/2024/11/minister-roban-on-climate-change-report | ✅（調査の存在・淡水レンズへの言及）／⚠（報告書の中の淡水レンズの結論は未読） |
| BMU_BLDG | 同調査で、島の建物の6％にあたる2,130棟が何らかのリスクにさらされ、最大326棟が高リスク | gov.bm プレスリリース「Climate Change and Its Impact on Bermuda Study Released」 https://www.gov.bm/news/climate-change-and-its-impact-bermuda-study-released ／Island Innovation https://islandinnovation.co/news/climate-risks-to-island-detailed-in-newly-released-study | ✅ |
| BMU_RAIN_FUT | 同調査の要約報告：2040〜2060年の年間降水量の変化は＋4〜11％と予測。今世紀末に向けた明確な傾向は出ていない | Executive Report（2024-03-25） https://www.gov.bm/sites/default/files/2024-11/Executive%20Report%20-%2025%20March%202024.pdf | ⚠（抜粋1件。「雨が増える」予測なので、日照りの話と矛盾しないよう本文で確認してから使う） |
| BIOS_LENS | バミューダ海洋科学研究所（BIOS）の報告「Climate Change and Bermuda」第2部（2023年2月）：海面上昇で淡水レンズの水質は徐々に下がる。異常な高潮は最高水位から6時間足らずでレンズの塩分を上げる。地下水の水質に響く高い潮位は、2050年までに少なくとも11倍に増える | BIOS 報告 PDF https://live-bios.ws.asu.edu/wp-content/uploads/Climate_Change_and_Bermuda_PARTII.pdf ／BIOS 発表 https://www.bios.asu.edu/currents/bios-releases-part-ii-climate-change-report ／Royal Gazette https://www.royalgazette.com/?p=452282 ／bernews 2023-02 https://bernews.com/2023/02/bios-releases-part-ii-of-climate-change-report | ✅（BIOS 報告と Royal Gazette が一致） |
| BIOS_SLR | 同第1部（2022年7月）：バミューダの海面は2050年までにさらに0.24〜0.26m上がる見込み | BIOS 第1部 https://bios.asu.edu/currents/bermuda-climate-change-report-part-i ／bernews 2022-07 | ⚠（抜粋1件） |
| BMU_DEVONSHIRE | くみ上げる地下水の大半は中央の「デヴォンシャー・レンズ（セントラル・レンズ）」から。面積約7.2km²、最も厚いところで約10m | Frontiers in Marine Science（2024） https://frontiersin.org/articles/10.3389/fmars.2024.1441113/full ／NSF PAR https://par.nsf.gov/biblio/10549427 | ⚠（同じ論文の転載。地図に描くなら本文で範囲を確認） |
| BMU_REG | バミューダの水道規制の意見募集資料：レンズの水の塩分が上がれば処理が増え、使える真水と備えが減る | 規制の意見募集資料（bernews 掲載 PDF、2022） https://cloudfront.bernews.com/wp-content/uploads/2022/09/Bermuda-water-and-wastewater-regulatory-structure-Consultation-document.pdf | ⚠（1資料） |
| BMU_FABIAN | 2003年のハリケーン・ファビアンで、伝統的な石灰岩スレート屋根の建物のかなりの数が屋根の一部を失った。国立ハリケーンセンターは、風当たりの強い場所の家で屋根の被害が大きかったと報告 | NHC「Tropical Cyclone Report Hurricane Fabian」 https://www.nhc.noaa.gov/data/tcr/AL102003_Fabian.pdf ／AMS 論文 https://ams.confex.com/ams/pdfpapers/108950.pdf ／Verisk の要約 | ✅（屋根の被害）／⚠（**雨水タンクへの影響は資料なし**。「タンクが海水で汚れた」は言わない） |

## 4. 締めの材料（世界はバミューダから何を学べるか）

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| END_GUARDIAN | 英ガーディアン紙の気象コラム「Weatherwatch」（2019年4月）は、英国が水不足を避けるにはバミューダの屋根に学べると論じた。背景に、イングランドは25年以内に慢性的な水不足に陥りうるという環境庁の警告 | bernews 2019-04「Guardian Highlight Bermuda Roof Water System」 https://bernews.com/2019/04/guardian-highlight-bermuda-roof-water-system ／inkl 転載 https://www.inkl.com/news/weatherwatch-uk-could-learn-from-bermuda-to-avoid-water-shortages | ✅（コラムの存在と論旨）／⚠（本文は未読） |
| END_UK_BUTT | 英国の研究：210リットルの雨水タンク（ウォーターバット）で、家庭の年間使用水量の平均15％をまかなえる（南東部は9％、最も乾く月は4％） | The Conversation https://theconversation.com/if-more-houses-had-water-butts-it-could-help-with-drought-flooding-and-water-pollution-191469 ／PreventionWeb・Smart Water Magazine 転載 | ⚠（同じ記事の転載。研究本体は未確認） |
| END_SMITH | バミューダ政府サイトにある論文（Tarik Smith）は、屋根の集水を島の水管理の土台と位置づけ、住民への教育の大切さを書く | gov.bm PDF https://www.gov.bm/sites/default/files/20170410_RCarticle_BDAFeature_vf.pdf | ⚠（未読） |
| END_GIB_CONTRAST | 対比の材料：ジブラルタルは淡水化の登場で集水面を撤去した（GIB_END）。バミューダは淡水化プラント（タインズ・ベイ）を持ちながら、家の屋根とタンクを今も法律で残している（01_research BMU_ROOF_LAW・BMU_TYNES） | 上の各記号 | ✅（ただし BMU_ROOF_LAW の根拠法令は ⚠ のまま） |

**締めの案（出典のある事実だけで組む）**：
- 「同じように雨を集めたジブラルタルは、海水から水をつくれるようになると、集水面を取り外しました。バミューダは、海水から水をつくる工場を持ちながら、今も一軒一軒の屋根で雨を集めています。」（GIB_END＋END_GIB_CONTRAST）
- 「海面が上がると、島の地下の淡水に海水が入り込みます。バミューダの研究所は、地下水を傷める高い潮が、2050年までに少なくとも11倍に増えると見積もっています。地下ではなく屋根の上で受け止める雨は、その影響の外にあります。」→ **最後の一文は自分の推論**。言い切るなら出典が必要。使うなら「屋根の雨は、地下の水とは別の水源です」までにとどめる（BIOS_LENS）
- 「英国の新聞は、水不足を避ける手本としてバミューダの屋根を挙げました。」（END_GUARDIAN）

## 台本に使えるエピソード
1. **ジブラルタルの「鉄板の砂丘」**：岩山の斜面一面に鉄板を張り、雨を岩の中の貯水池へ。1903年の約10エーカーから1961年に34エーカーへ広がり、1993年10月に役目を終えて撤去。航空写真・古い写真の対比が地図ネタになる（GIB_CATCH・GIB_RES・GIB_END）
2. **滑走路が水道になる首都**：マジュロでは空港の滑走路で雨を受け、貯水池へ送る（MAJ_RUNWAY）。地図で滑走路と貯水池を並べて見せられる
3. **バミューダより大きなタンクを求める法律**：米領ヴァージン諸島は屋根1平方フィートあたり10〜15ガロン（1m²あたり約410〜610リットル）（USVI_LAW・USVI_CALC）。※バミューダの 8ガロンは 01_research で ⚠ のため、「比べるとバミューダより大きい」と言うには BMU_ROOF_LAW の確定が先
4. **雨が止まった国**：ツバルは2011年、日照りで国家非常事態。ニュージーランドが水を空輸（TUV_RAIN・TUV_2011）。「タンクをたたいて音で残りを知る」は本文確認後に使う（TUV_TAP）
5. **4軒に1軒がタンクを持つ国**：オーストラリアは2013年の統計で約26％の世帯が雨水タンクを使い、南オーストラリア州は46％（AUS_TANK）
6. **日本の屋根の水**：両国国技館は8,400m²の屋根の雨を1,000トンのタンクにため、トイレと防災に使う。2014年には雨水利用の推進の法律ができた（JP_SUMIDA・JP_LAW）
7. **未来の脅威は地下から**：IPCC は小さな島の地下水に海水が入り込むと評価（確信度：高い）。バミューダの研究所は、地下水を傷める高い潮位が2050年までに11倍以上と見積もる（IPCC_INTRUSION・BIOS_LENS）

## 未確認点・ブロッカー
1. **一次資料に1件も届いていない**：law.justia.com・www.aquagib.gi・www.abs.gov.au・www.rnz.co.nz・www.frontiersin.org・www.ipcc.ch は、この環境で名前解決できず WebFetch 失敗（各1回）。01_research と同じく、セッションのネットワーク設定でこれらを許可するか、社長側で本文確認が必要
2. **米領ヴァージン諸島の現行条文**：2019年版 §308 の数字。2024年の建築基準改正（Bill 35-0172）後も同じか、DPNR の2025年版ガイドで確認
3. **ABS の雨水タンク統計は2013年が最新**。新しい全国調査があるか未確認
4. **ツバルの配給量**（40L か 20L か）と「タンクをたたく」習慣は本文未確認
5. **マジュロの数字**（集水面・容量・年間量）は資料で割れる。日本の支援額も1資料
6. **バミューダ政府の気候変動調査（Smith Warner）の淡水レンズの章**の結論・2100年の海面の数字は未読。Modelling Report https://www.gov.bm/sites/default/files/2024-11/Modelling%20Report%C2%A0%20-%2015%20March%202024.pdf を読む必要あり（gov.bm は 01_research でも接続不可）
7. **淡水化のエネルギー量・島の淡水化依存の割合**は出典が見つからず、台本で使わない
8. **ハリケーンで雨水タンクが汚れた**という資料は見つからない。言わない
9. グレナダの雨水利用規則は施行されたか未確認
10. 日本の法律で民間の家に義務がないこと（JP_LAW_SCOPE）は条文で確認していない
11. 座標は自分で付けた概略値。地図制作時に地名の位置を地図データで確かめる
