# 長尺化リサーチ B：供給側（建てる量・規制・承認・費用・人手・インフラ・国の計画）（chizu-003-canada-housing）

- 作成 2026-11-13（Claude、調査のみ・コミットなし）。対象：20〜30分版のうち「供給側」パート（約8〜10分ぶん）。問い『こんなに広いのに 家が足りない？』
- 記号：📄＝本文を自分で読んだ（WebFetch 成功）／✅＝2つ以上の独立した抜粋・二次資料が一致（公式発表＋独立した報道の一致を含む）／⚠＝単独の資料・資料間で食い違い・定義や日付が未確認
- **今回も 📄 はゼロ**。方法：Web 検索（standard）の抜粋のみ。WebFetch は2回だけ試し、`www.pbo-dpb.ca`・`www.fraserinstitute.org` とも名前解決できず失敗（許可ドメイン外）。前回の 01_research.md の記録どおり `www.cmhc-schl.gc.ca`・`assets.cmhc-schl.gc.ca`・`www150.statcan.gc.ca`・`www.statcan.gc.ca`・`publications.gc.ca`・`www.toronto.ca` も不可（指示によりそれ以上は試していない）。`.gc.ca`・`canada.ca`・`vancouver.ca`・`www2.gov.bc.ca`・`ola.org`・`buildforce.ca`・`economics.td.com`・`fcm.ca` も本文未読
- 通貨はすべてカナダドル。「着工（housing starts）」は工事が始まった住宅の戸数（完成数ではない）。CMHC の年次合計には **「全地域（all areas）」** と **「人口1万人以上の都市部（centres 10,000+）」** の2系列があり、数字が違う。台本で並べるときは同じ系列にそろえる
- 既存コード（01_research.md の CMHC_GAP23・CMHC_GAP25・CMHC_DELAY23・TOR_YELLOW・INFRA_FCM・INFRA_CHIF・DC_CMHC26・CONST_COST）の確認・拡張は B_ コードで書き、元コードを「関連」に書く
- 台本ルール：⚠ は台本の語りで使わない。✅ は出典を資料表・概要欄に置き、語りでは言い切る。中立に事実を並べ、政策の良し悪しは判断しない

## 1. 着工数の歴史（1970年代 → 2025年）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_START1976 | カナダの年間着工数の過去最多は **1976年の273,203戸** | 統計局の過去表（抜粋）https://www150.statcan.gc.ca/n1/pub/11-210-x/00007/t_html/5213752-eng.htm ／ Fraser Institute「The Crisis in Housing Affordability: Population Growth and Housing Starts 1972–2024」(2025年4月) https://www.fraserinstitute.org/studies/crisis-in-housing-affordability-population-growth-and-housing-starts-1972-2024 ／ Ontario Construction Report https://ontarioconstructionreport.com/?p=14397 | ✅ |
| B_START1973 | 1973年は268,529戸 | 統計局の過去表（抜粋）のみ（同上） | ⚠（単独） |
| B_START7279 | 1972〜1979年の着工は年平均239,458戸。そのときの人口増は年平均279,975人 | Fraser Institute（同上）／ Ontario Construction Report（同上）／ link2build https://link2build.ca/news/articles/2025/april/new-housing-construction-falling-far-behind-population-growth-rates-fraser-institute-report | ✅（Fraser の集計として） |
| B_RATIO | Fraser Institute の計算：1972〜2024年の平均は「着工1戸あたり人口増1.9人」。**2023年は5.1人で期間中最高**、2024年は3.9人 | Fraser Institute（同上）／ newswire.ca https://newswire.ca/news-releases/fraser-institute-news-release-housing-starts-unchanged-since-1970s-while-canadian-population-growth-has-more-than-tripled-836378028.html ／ todayville https://www.todayville.com/edmonton/housing-starts-unchanged-since-1970s-while-canadian-population-growth-has-more-than-tripled | ✅（Fraser の集計として。語りでは「ある研究所の計算」と出典名を資料表へ。基準期間が 1972–2019 の論評記事は平均1.8人なので混ぜない） |
| B_PERCAP | 人口1,000人あたりの着工は1972年ごろに約12戸で最高、2022年は約6.7戸、2025年は約6.2戸 | TD Economics「The Regional Divide in Canadian Homebuilding」(2026年1月29日) https://economics.td.com/ca-regional-divide-in-homebuilding （グラフの読み取りを要約した抜粋） | ⚠（単独・グラフの読み取り。台本は「1970年代初めの人口あたりの着工は今の約2倍」も言わない。使うなら統計局の着工数÷人口で自分で計算し、計算と明記） |
| B_START2021 | 2021年（全地域）は271,198戸で、1976年に次ぐ水準 | Fraser Institute（同上）／ storeys https://storeys.com/2025-housing-starts-cmhc/ （年次一覧） | ✅ |
| B_START2022 | 2022年（全地域）は261,849戸 | storeys の年次一覧のみ | ⚠（単独） |
| B_START2023 | 2023年（全地域）は240,267戸 | CMHC Housing Observer「What is Canada's potential capacity for housing construction?」(2024) https://www.cmhc-schl.gc.ca/observer/2024/what-canada-potential-capacity-housing-construction （抜粋）／ mpamag https://mpamag.com/ca/mortgage-industry/industry-trends/how-many-homes-can-canada-build/489663 ／ storeys 年次一覧 | ✅ |
| B_START2023_URB | 2023年（人口1万人以上の都市部）は223,513戸で、2022年の240,590戸から7%減。一戸建ての着工が25%減ったことが主因 | CMHC ニュースリリース「Housing starts down 7% in 2023 from 2022」(2024年1月16日) https://cmhc-schl.gc.ca/media-newsroom/news-releases/2024/housing-starts-down-2023-from-2022 ／ ontario 建築家協会 https://oaa.on.ca/whats-on/news-and-insights/news-and-insights-detail/national-housing-starts-down-7-percent-in-2023 ／ insauga https://insauga.com/223513-homes-started-in-2023-down-7-from-2022-in-canada ／ thedeepdive（一戸建て25%減） | ✅（系列が「都市部」。全地域の B_START2023 と並べない） |
| B_START2024 | 2024年（全地域）は245,367戸（改定値。最初の発表は245,120戸）で前年比2%増。6大都市圏の合計は約3%減、アルバータ・ケベック・大西洋州は増加 | CMHC「Housing starts up 2 per cent in 2024 from 2023」(2025) https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2025/housing-starts-up-2-per-cent-2024-from-2023 ／ CBC https://www.cbc.ca/lite/story/1.7433141 ／ investmentexecutive https://www.investmentexecutive.com/news/research-and-markets/cmhc-says-total-housing-starts-in-2024-up-2-from-2023/ ／ mpamag | ✅（語りは「約24万5千戸」） |
| B_START2025 | 2025年（全地域）は259,028戸、前年比5.6%増、**統計上5番目に多い年** | CMHC「Housing starts December 2025」(2026年1月16日) https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2026/housing-starts-december-2025 ／ BNN Bloomberg https://www.bnnbloomberg.ca/business/2026/01/16/cmhc-says-housing-starts-totalled-259028-in-2025-up-56-per-cent-from-2024 ／ storeys ／ Kitco（CP配信） | ✅ |
| B_RENT2025 | 2025年は2年連続で賃貸住宅の着工が過去最多。都市部の着工の半分強が賃貸。9月以降は着工の傾向値が下がり続けた | 同上（CMHC・BNN Bloomberg・mpamag https://www.mpamag.com/ca/mortgage-industry/market-updates/housing-starts-rose-in-2025-but-cmhc-warns-construction-momentum-has-faded/562250 ） | ✅ |
| B_CAPACITY | CMHC（2024年5月）：今の建設の人手・資源で、カナダは**年40万戸を超える**住宅を建てる潜在能力がある。2023年の実績（240,267戸）を大きく上回る。到達には短期を超える構造的な変化が必要。1999〜2004年は住宅建設の労働生産性がずっと高かったことを根拠にする | CMHC Housing Observer（B_START2023 と同じ）／ mpamag（同上）／ obj.ca https://obj.ca/fragmented-construction-sector-back-housing-starts-cmhc ／ The Logic | ✅（「潜在能力」は推計であり実績ではないと明示） |
| B_ONT_TARGET | オンタリオ州は2022年に「2031年までに150万戸」を掲げた（年平均15万戸が必要）。州の財政監視機関（FAO）によると2025年1〜3月の着工は12,700戸で2009年以来の低さ | CBC https://www.cbc.ca/lite/story/1.7558645 ／ Global News https://globalnews.ca/news/11235997/ontario-housing-start-fao ／ Pique https://www.piquenewsmagazine.com/the-mix/ontario-housing-starts-at-lowest-level-since-2009-financial-watchdog-says-10794259 | ✅ |

## 2. どれだけ足りないか（CMHC 供給ギャップの追加確認）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_GAP26 | CMHC「2026年秋の住宅供給報告」（2026年9月10日）：2019年（パンデミック前）の手ごろさを2036年までに取り戻すには、着工を**年41.7万〜46.9万戸**に引き上げる必要。今の見込みは年約23.1万戸で、必要なペースの約半分。年あたりの差は約18.7万〜23.8万戸で、2025年の推計とほぼ同じ。トロント・カルガリーで差は縮み、バンクーバーは横ばい、オタワ・モントリオールで拡大。エドモントンは大都市で唯一差がない。（関連：01 の CMHC_GAP26 ⚠ → **✅に更新可**） | CMHC「Slowing home construction threatens recent affordability gains」(2026) https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2026/slowing-home-construction-threatens-recent-affordability-gains ／ CTV https://www.ctvnews.ca/business/real-estate/article/canada-needs-up-to-469-million-new-homes-by-2036-but-construction-could-slow-cmhc/ ／ BNN Bloomberg https://www.bnnbloomberg.ca/business/real-estate/2026/09/10/canada-needs-up-to-469-million-new-homes-by-2036-but-construction-could-slow-cmhc/ ／ advisor.ca https://www.advisor.ca/economy/economic-indicators/canada-needs-up-to-4-7m-new-homes-by-2036-cmhc/ ／ ATB | ✅（**台本の最新値はこちらを推奨**。幅は「価格が下がったとき人がどれだけ反応するか」の仮定の違い） |
| B_GAP23_BASE | 2023年の推計（CMHC_GAP23）の前提：2030年までに合計**580万戸**が必要で、これまでのペースで見込める230万戸との差が350万戸。目標は2004年の手ごろさ | FCM 背景資料（CMHC の推計を引用）https://fcm.ca/en/news-media/news-release/new-research-canadas-housing-challenge-also-infrastructure-challenge/backgrounder ／ CBC https://www.cbc.ca/lite/story/1.6965250 ／ CMHC 2023 リリース（01 参照） | ✅（580万＝230万＋350万） |
| B_PLAN24 | 連邦の住宅計画「Solving the Housing Crisis: Canada's Housing Plan」（2024年4月12日）：**2031年までに387万戸**。内訳は CMHC がすでに建つと見込む187万戸＋上乗せの200万戸以上 | 首相府 https://www.pm.gc.ca/en/news/news-releases/2024/04/12/canadas-housing-plan ／ 2024年度予算 第1章 https://budget.canada.ca/2024/report-rapport/chap1-en.html ／ Chronicle Herald（PressReader）／ askross.ca | ✅ |
| B_PLAN24_FED | 上乗せ200万戸のうち、連邦の施策で少なくとも120万戸、残り80万戸以上は州・自治体などに求める | 首相府リリース・2024年度予算（抜粋） | ⚠（政府資料の抜粋のみ。使わない） |

## 3. 用途地域（ゾーニング）と規制の改革
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_YELLOW_TERM | 「イエローベルト（yellowbelt）」は、トロントの公式計画図で黄色に塗られた「住宅地（Neighbourhoods）」のうち、ほぼ一戸建てしか建てられない区域を指す呼び名。都市計画家ギル・メスリン（Gil Meslin）の造語とされる | urbaneer https://www.urbaneer.com/blog/toronto_real_estate_yellowbelt_zoning_and_the_missing_middle_part_one ／ brandondonnelly.com https://brandondonnelly.com/2016/11/01/the-yellowbelt/ ／ moreneighbours（2019）https://www.moreneighbours.ca/news/reports/housing-matters-re-thinking-the-yellowbelt | ✅（呼び名の意味。造語者は ✅ 寄りだが2016年という年は ⚠） |
| B_YELLOW_SHARE | 割合は分母で変わる：「住宅地指定の約7割が一戸建てのみ許可」（市の職員資料）／「市の全面積の32%」（2019年の市民団体）／「約2万ha」（2017年 Toronto Star） | トロント市 backgroundfile-148582（2020）https://www.toronto.ca/legdocs/mmis/2020/ph/bgrd/backgroundfile-148582.pdf ／ moreneighbours ／ Toronto Star（PressReader）https://www.pressreader.com/canada/toronto-star/20170923/281797104179972 | ⚠（分母が違う。**台本は01の TOR_YELLOW（住宅地の約7割）だけを使う**） |
| B_TOR_MPLEX | トロント市議会は**2023年5月10日**、市内全域の住宅地で**4戸までの集合住宅（マルチプレックス）を個別の用途変更なしで（as-of-right）認める**公式計画・ゾーニング改正を可決。投票は18対7。建物の大きさは従来の許可とほぼ同じ範囲で戸数を増やす方式 | トロント市「Multiplex study 2–4 units」https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/multiplex-study-2-4-units/ ／ Spacing（2023年5月11日）https://spacing.ca/toronto/2023/05/11/lorinc-fourplex-on-the-council-floor/ ／ Globe and Mail ／ urbaneer https://urbaneer.com/blog/all-residential-properties-in-toronto-can-now-become-four-units-as-of-right ／ storeys | ✅（日付・4戸。投票数は2資料一致） |
| B_TOR_6PLEX | トロントはその後、北スカボロー地区で6戸まで広げた（市全域ではない） | トロント市「Expanding multiplex permissions: sixplexes citywide study」（抜粋）／ TRREB | ⚠（時期・範囲が未確認。使わない） |
| B_VAN_MPLEX | バンクーバー市議会は**2023年9月14日の公聴会を経て（9月14〜15日）**、一戸建て・二戸建て専用だった区域で、敷地の広さに応じて**3〜6戸（分譲）、広い敷地の賃貸なら最大8戸**を認めることを全会一致で可決。高さは3階まで。低密度の9区分（RS）を新区分 R1-1 に統合。申請受付は2023年12月から | バンクーバー市 ニュースリリース（2023年9月15日）https://vancouver.ca/files/cov/2023-09-15-missing-middle-news-release-september-15-2023.pdf ／ 市のページ https://vancouver.ca/news-calendar/vancouver-reforms-sf-neighbourhoods.aspx ／ CBC https://www.cbc.ca/lite/story/1.6967977 ／ BIV https://biv.com/article/2023/09/vancouver-approves-missing-middle-motion-despite-mixed-reviews-public ／ GVR https://www.gvrealtors.ca/news-archive/vancouver-allows-up-to-eight-units-on-single-family-lots.html | ✅（戸数・高さ・時期） |
| B_VAN_LOTS | 対象は約6万5千区画 | 市職員の推計（BIV 等の抜粋1件） | ⚠（単独。使わない） |
| B_BC44 | BC州「Bill 44（Housing Statutes (Residential Development) Amendment Act, 2023）」は**2023年11月30日**に成立。都市の区域内の一戸建て・二戸建て用地で、**280m²以下の敷地は3戸以上、280m²を超える敷地は4戸以上**、頻繁に走るバス停から約400m以内の280m²超の敷地は**6戸以上**を認めるよう自治体に義務づけ。自治体はゾーニングを**2024年6月30日まで**に改める（延長の例外あり） | BC州「Small-scale, multi-unit housing」https://www2.gov.bc.ca/gov/content/housing-tenancy/local-governments-and-housing/housing-initiatives/smale-scale-multi-unit-housing ／ BC州 FAQ PDF https://www2.gov.bc.ca/assets/gov/housing-and-tenancy/tools-for-government/local-governments-and-housing/faqs_small-scale_multi-unit_housing.pdf ／ UBCM https://www.ubcm.ca/node/79251 ／ Mondaq https://www.mondaq.com/canada/real-estate/1391822/bill-44-housing-statutes-residential-development-amendment-act-2023 ／ ポートムーディ市 https://www.portmoody.ca/ssmuh ／ CHBA BC PDF | ✅（「280m²以下」か「未満」かは資料で表現が割れる。語りは「小さい敷地で3戸、大きい敷地で4戸、バス停の近くは6戸」とし、数値は資料表のみ） |
| B_BC44_POP | 6戸の規定は人口5,000人以上の自治体が対象。都市の区域（urban containment boundary）の外では、二次住戸（地下室や離れ）1戸までの義務にとどまる | BC州のページ・FAQ（抜粋） | ⚠（州資料の抜粋のみ。2025年の Bill 25 で運用が変わった可能性。使わない） |
| B_ONT23 | オンタリオ州「Bill 23（More Homes Built Faster Act, 2022）」は**2022年11月28日**に可決・成立（同日に国王裁可）。州の「10年で150万戸」の目標に合わせた法律。上下水道が通る都市の住宅地で、**1区画に3戸まで**（母屋＋地下や離れなど）を個別の用途変更なしで認める | オンタリオ州議会 https://www.ola.org/en/legislative-business/bills/parliament-43/session-1/bill-23/status ／ BLG https://www.blg.com/en/insights/2022/12/bill-23-in-ontario-the-more-homes-built-faster-act-2022-receives-royal-assent ／ Bennett Jones https://www.bennettjones.com/Blogs-Section/What-You-Need-to-Know-About-the-More-Homes-Built-Faster-Act-2022 ／ Mondaq ／ mpamag https://www.mpamag.com/ca/news/general/ontario-passes-more-homes-built-faster-act/428899 | ✅ |
| B_ONT23_DC | Bill 23 で、この3戸までの小規模な住宅には開発負担金・公園用地の負担をかけない | BLG（抜粋）・Bennett Jones（抜粋） | ⚠（法文未確認。使わない） |
| B_ONT23_CRIT | Bill 23 は自治体や環境団体から強い批判を受けて可決された | The Narwhal https://thenarwhal.ca/tag/bill-23 ／ mpamag | ✅（ただし政治的評価なので台本では扱わない） |

## 4. 連邦の資金・機関（住宅建設促進基金・ビルド・カナダ・ホームズ）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_HAF | 連邦の「住宅建設促進基金（Housing Accelerator Fund, HAF）」は**2023年3月**に始まった**40億ドル**の制度。自治体が規則・手続きを変えて住宅を増やすことと引き換えに資金を出す。当初の目標は10万戸以上を早めること | PBO ブログ（2025）https://www.pbo-dpb.ca/en/additional-analyses--analyses-complementaires/BLOG-2526-005--an-update-housing-accelerator-fund--point-fonds-accelerer-construction-logements ／ CIC News https://www.cicnews.com/2023/12/housing-accelerator-fund-new-housing-in-10-canadian-cities-1241552.html ／ Global News ／ CMHC 各地リリース（ミシサガ 2023）https://cmhc-schl.gc.ca/media-newsroom/news-releases/2023/helping-build-more-homes-faster-mississauga | ✅ |
| B_HAF_PBO | 議会予算官（PBO、2025年7月）：CMHC は230の州以下の政府と協定を結び、総額43.7億ドル。目標は「2028年までに11.2万戸」に変わった。2024年度予算で4億ドル追加 | PBO ブログ（抜粋）のみ | ⚠（単独・本文未読。使わない） |
| B_HAF_CITY | 個別の協定：カルガリー2.28億ドル（2023年11月）、バンクーバー1.15億ドル（2023年12月）、トロント**4.71億ドル**（2023年12月、当時で最大。市は1万1,780戸の上乗せを見込む） | トロント市リリース https://www.toronto.ca/news/city-of-toronto-receives-471-million-from-the-government-of-canada-to-create-11780-new-homes-in-toronto/ ／ CBC https://amp.cbc.ca/lite/story/1.7066297 ／ CTV ／ TVO ／ Daily Hive（バンクーバー）https://dailyhive.com/vancouver/vancouver-housing-accelerator-fund-federal ／ opencouncil.ca https://opencouncil.ca/housing-accelerator-fund/ | ✅（金額と月。戸数は CBC「約1.2万戸」と市「11,780戸」で丸めが違う） |
| B_BCH | 「ビルド・カナダ・ホームズ（Build Canada Homes）」は**2025年9月14日**に発足。最初の資本は**130億ドル**。当初は住宅・インフラ・地域省の中の特別事業機関で、のちに独立の連邦機関にする方針。初代 CEO はアナ・バイロン（Ana Bailão、元トロント市議）。最初の事業は連邦所有地6か所で約4,000戸、将来は最大4万5千戸まで広げる | CBC https://www.cbc.ca/lite/story/1.7632981 ／ Global News https://globalnews.ca/news/11424334/build-canada-homes-federal-land-carney ／ カナダ政府（住宅・インフラ・地域省）https://www.canada.ca/en/housing-infrastructure-communities/news/2025/09/secretary-of-state-sarai-highlights-the-launch-of-build-canada-homes-to-supercharge-homebuilding-across-the-country.html ／ Mondaq ／ Squamish Reporter | ✅ |
| B_BCH_FUNDS | 発足時の内訳：最初の4事業に計35億ドル、移行住宅に10億ドル、賃貸保護基金15億ドル | 二次資料（kelownarealestate・housingrightscanada） | ⚠（使わない） |

## 5. 承認にかかる時間（CMHC_DELAY23 の拡張）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_DELAY_SURVEY | 根拠の調査は CMHC と統計局が共同で行った「2022年 自治体の土地利用・規制調査（Survey of Canadian Municipal Land Use and Regulation 2022）」。結果は「月数」ではなく**指数**（トロント都市圏＝100 を基準）で示される | CMHC Housing Observer「Approval delays linked with lower housing affordability」(2023) https://www.cmhc-schl.gc.ca/observer/2023/approval-delays-linked-lower-housing-affordability ／ 統計局 調査票ページ https://www.statcan.gc.ca/en/statistical-programs/instrument/5382_Q1_V1 ／ Western Investor https://westerninvestor.com/british-columbia/greater-land-use-regulations-less-housing-affordability-cmhc-7279412 ／ BIV https://biv.com/article/2023/07/more-land-use-regulations-bc-mean-less-housing-affordability-cmhc | ✅（調査名と指数方式） |
| B_DELAY_INDEX | 承認遅延指数：トロント都市圏100、バンクーバー都市圏101 | CMHC Housing Observer の表（抜粋）のみ | ⚠（単独。使わない。語りは CMHC_DELAY23 の「約4倍」で足りる） |
| B_DELAY_CHBA | 別の調査（カナダ住宅建設業者協会 CHBA／Altus Group「Municipal Benchmarking Study」2022年版）：開発承認にかかる平均期間は**トロント32か月**（2020年の21か月から約5割増）、バンクーバー市15か月、最短はシャーロットタウンの3か月 | CHBA 2022 報告 PDF https://static1.squarespace.com/static/5a171b1fbe42d6a948635e33/t/64da14d5ba4f0a3990eaa160/1692013784402/2022-CHBA-Municipal-Benchmarking-Study-web.pdf ／ Daily Hive https://dailyhive.com/calgary/canada-municipal-government-housing-approval-timelines-statistics ／ RENX https://renx.ca/edmonton-tops-toronto-least-development-friendly-city-chba-report | ✅（業界団体の調査として。CMHC の指数とは別物で並べて計算しない。2024年版（第3版）の数字は未取得） |

## 6. 開発負担金（Development charges）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_DC_TOR25 | CMHC の2025年の集計：トロント市の一戸建て1戸あたりの開発負担金は約18万600ドル（トロント都市圏で最も高い。最も低いピッカリングは約12万5千ドル）。トロント市のマンション1戸は約13万200ドル | CMHC Housing Observer「We built this city on… Development charges」(2025) https://www.cmhc-schl.gc.ca/observer/2025/we-built-this-city-development-charges ／ link2build（2025年12月）https://link2build.ca/news/articles/2025/december/we-built-this-city-on-development-charges-and-it-s-been-rock-and-roll | ✅（ただし CMHC 集計とその紹介記事の一致。**下の別資料とは金額が合わない**ので、語りで使うなら「2025年の CMHC の集計で」と年と出所を資料表に固定） |
| B_DC_OTHERS | 別の資料では金額が違う：CHBA 2024年版でトロント19万5,300ドル（住宅の種類不明）／Desjardins（2026年6月）で「トロントの一戸建ては13万7千ドル超」 | CHBA 2024（二次の引用）／ Desjardins https://www.desjardins.com/content/dam/pdf/en/personal/savings-investment/economic-studies/canada-development-fees-18-june-2026.pdf | ⚠（資料間で食い違い。含める負担金の範囲・年が違う） |
| B_DC_GROW | トロント都市圏の一戸建ての開発負担金は2011〜2023年に平均176%上昇（CHBA 2024年版の二次要約）／2009〜2021年に平均156%上昇（Altus Group が BILD のために行った調査） | CHBA 2024（二次）／ BILD・Altus https://www.bildgta.ca/wp-content/uploads/2022/06/New-Homeowner-Money-Unspent-Municipal-Reserves.pdf | ⚠（期間・数字がそれぞれ単独。語りは「十数年で2倍以上」も言わない） |
| B_DC_CMHC26 | CMHC（2026年6月）：開発負担金を下げるだけでは手ごろさの問題は解決しない（チーフエコノミストの発言）。（関連：01 の DC_CMHC26） | CMHC Housing Observer「Development charges: not all cities are created equally」(2026) https://www.cmhc-schl.gc.ca/observer/2026/development-charges-not-all-cities-are-created-equally ／ BNN Bloomberg https://www.bnnbloomberg.ca/business/economics/2026/06/03/slashing-development-fees-is-not-a-cure-all-for-housing-affordability-cmhc/ ／ CTV https://www.ctvnews.ca/business/article/slashing-development-fees-is-not-a-cure-all-for-housing-affordability-cmhc/ ／ CP24 | ✅（主旨のみ。01 の「マーカム15.7%」は引き続き ⚠） |

## 7. 建設の人手
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_LAB_RETIRE | BuildForce Canada の2025〜2034年見通し：今後10年で約**27万人**の経験ある建設労働者が退職する（2024年の建設労働力の約15%） | link2build https://www.link2build.ca/news/posts/buildforce-canada-outlook-projects-shortfall-of-52-000-workers-in-ontario-by-2034/ ／ Deloitte「Builders, baby, builders: the half a million worker question」https://www.deloitte.com/ca/en/our-thinking/future-of-canada-center/builders-baby-builders-the-half-a-million-worker-question.html ／ BuildForce 講演資料（Supply Chain Canada 2025）https://www.supplychaincanada.com/img/2025-conference/sessions/Bill%20Ferriera.pdf | ✅（「約15%」は Deloitte のみ ⚠） |
| B_LAB_RES | 同見通しの内訳：住宅部門の退職は約13万5,800人、住宅部門は2034年までに約6万7,600人不足 | BuildForce 講演資料のみ | ⚠（単独。使わない） |
| B_LAB_ONT | オンタリオ州は2034年までに最大約5万2千人不足 | BuildForce オンタリオ州リリース https://www.buildforce.ca/en/press-release/employment-demands-in-ontario-are-elevated-to-2034-as-growth-in-the-residential-sector-leads-the-way/ ／ link2build（同上） | ✅ |
| B_LAB_BC | BC州は期間中に4万3,800人（今の建設労働力の23%）が退職 | BuildForce BC州リリース https://www.buildforce.ca/en/press-release/construction-demands-show-signs-of-slowing-in-british-columbia-after-years-of-strong-activity/ | ⚠（単独） |

## 8. 建設費（統計局 建築工事価格指数 BCPI）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_BCPI_DEF | 統計局の建築工事価格指数（BCPI）は、業者が新しい建物を建てるときの価格の変化を四半期ごとに測る。**土地代は含まない** | 統計局 調査ページ https://www.statcan.gc.ca/en/survey/business/2317 ／ 技術ガイド 2023 https://www150.statcan.gc.ca/n1/en/catalogue/62F0014M2025001 ／ ICBA https://icba.ca/economics-blog/blog-digging-into-steeply-rising-canadian-construction-costs | ✅ |
| B_BCPI_2025Q4 | 2025年10〜12月期の住宅の建築費は、15都市圏の合計で前年同期比**3.0%上昇**（非住宅は4.1%） | 統計局 The Daily（2026年1月27日）https://www150.statcan.gc.ca/n1/daily-quotidien/260127/dq260127c-eng.htm ／ ノバスコシア州 統計ニュース https://novascotia.ca/finance/statistics/news.asp?id=21693 ／ link2build https://link2build.ca/news/articles/2026/january/building-construction-costs-rise-again-in-q4 | ✅ |
| B_BCPI_2025 | 2025年1〜3月期は前年比3.4%、4〜6月期は4.2% | 統計局 2025年第1四半期 https://www.statcan.gc.ca/o1/en/app/8032-building-construction-price-indexes-first-quarter-2025 ／ link2build（第2四半期）https://link2build.ca/news/articles/2025/july/tariffs-skilled-labour-shortages-raise-q2-construction-costs | ⚠（各期1資料ずつ） |
| B_BCPI_2021 | 2020年10〜12月期→2021年10〜12月期で、住宅の建築費は11都市圏合計で21.7%上昇 | 統計局 The Daily 2022年2月 表（抜粋）のみ | ⚠（単独） |
| B_BCPI_CUM | 2019年以降、住宅の建築価格は3分の2以上上昇（ICBA）／パンデミック開始以来51%上昇（出所不明のスライド）。（関連：01 の CONST_COST） | ICBA https://icba.ca/economics-blog/icba-economics-the-rising-cost-of-building-construction-in-canada ／ slideshare | ⚠（**引き続き使わない**。統計局表 18-10-0289/0276 で2019年→最新を自分で計算するまで） |

## 9. インフラ（上下水道など）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_FCM23 | カナダ自治体連合（FCM）は**2023年11月**、CMHC が必要とする580万戸を支える自治体インフラの費用を推計し、**最大約6,000億ドル**、1戸あたり平均約10万7千ドルとした。（関連：01 の INFRA_FCM ⚠ → **金額・年は ✅**） | FCM ニュースリリース https://www.fcm.ca/en/news-media/news-release/new-research-canadas-housing-challenge-also-infrastructure-challenge ／ FCM 背景資料（同上 /backgrounder）／ link2build（2023年11月）https://www.link2build.ca/news/articles/2023/november/fcm-study-finds-that-the-cost-to-build-infrastructure-to-support-new-housing-could-be-as-high-as-600b ／ mpamag https://mpamag.com/ca/mortgage-industry/market-updates/around-600bn-in-additional-housing-investment-needed-say-municipalities/467804 ／ ReNew Canada | ✅（「最大」「約」を付ける。1戸あたり額は自治体所有インフラの再調達価格を戸数で割った単純計算で、住宅の種類や地域差は考慮しないと FCM 自身が書く） |
| B_FCM_DEFICIT | FCM（2025年）：これとは別に、国全体の自治体インフラの不足額を約2,700億ドルと推計 | FCM リリース https://fcm.ca/en/news-media/news-release/canada-risks-stalling-nation-building-without-strong-local-infrastructure （抜粋） | ⚠（単独。B_FCM23 と混ぜない） |
| B_CHIF | 連邦の「住宅インフラ基金（Canada Housing Infrastructure Fund, CHIF）」：2024年度予算で**10年間60億ドル**。自治体などへの直接配分枠10億ドル（8年）と州・準州経由の50億ドル（10年）。住宅のための上水・下水・雨水・廃棄物の施設を早める。直接枠の募集は2024年秋に始まり2025年3月31日に締切。（関連：01 の INFRA_CHIF ⚠ → **✅**） | プリンスエドワードアイランド州 https://www.princeedwardisland.ca/en/information/transportation-infrastructure-and-energy/canada-housing-infrastructure-fund ／ storeys https://storeys.com/canada-housing-infrastructure-fund-launch/ ／ カナダ水ネットワーク https://cwn-rce.ca/2024/12/06/canada-housing-infrastructure-fund-is-accepting-applications-under-the-direct-delivery-stream/ ／ FCM「FCM welcomes new $6 billion fund…」https://fcm.ca/en/news-media/news-release/fcm-welcomes-new-6-billion-fund-address-housing-and-urgent-municipality-infrastructure-needs ／ BC 州 気候資金ページ | ✅ |
| B_CHIF_2025 | 2025年3月22日に直接枠の25事業を発表。2025年度予算で新しい「Build Communities Strong Fund」に組み込まれる | 抜粋のみ（資料間で金額がそろわない） | ⚠（使わない） |

## 台本で使える流れ（案。⚠ は含めない）
1. **50年前のほうが建てていた**（B_START1976・B_START7279・B_START2025）：着工の最多は1976年の約27万3千戸。2025年は約25万9千戸で「5番目に多い年」——それでも1970年代とほぼ同じ量。1970年代は人口増が年約28万人、2023年は着工1戸あたり5.1人増えた（B_RATIO）
2. **必要な量の約半分**（B_GAP26・B_CAPACITY）：CMHC は2036年までに年41.7万〜46.9万戸が必要、見込みは年約23万戸。一方で CMHC は「今の資源でも年40万戸超を建てる潜在能力がある」とも推計
3. **黄色い地図**（TOR_YELLOW・B_YELLOW_TERM・B_TOR_MPLEX）：トロントの住宅地の約7割は一戸建て（＋二戸建て）だけ。2023年5月、市全域で4戸まで認めた
4. **西海岸も同じ年に**（B_VAN_MPLEX・B_BC44）：バンクーバーは2023年9月に3〜6戸（賃貸8戸）、BC州は同年11月に州法で3〜4戸・バス停の近くは6戸を義務化。オンタリオ州は2022年に1区画3戸（B_ONT23）
5. **お金で背中を押す**（B_HAF・B_HAF_CITY・B_PLAN24・B_BCH）：2023年に40億ドルの基金、トロントに4.71億ドル。2024年の国の計画は2031年までに387万戸。2025年9月、130億ドルの新機関ビルド・カナダ・ホームズ
6. **建てるまでの壁**（CMHC_DELAY23・B_DELAY_CHBA・B_DC_TOR25・B_LAB_RETIRE・B_FCM23・B_CHIF）：トロントの承認は平均32か月（2022年、業界団体調査）。一戸建ての負担金は約18万ドル（2025年 CMHC 集計）。10年で約27万人の建設労働者が退職。インフラは最大約6,000億ドル、国は60億ドルの基金

## 台本で使わないこと
- 人口あたり着工の「1970年代の約2倍」などの比較（B_PERCAP は TD のグラフ読み取りのみ）
- 2022年の着工数（B_START2022）、1973年の数字（B_START1973）
- 全地域（240,267）と都市部（223,513）の2023年の数字を同じグラフに並べること
- HAF の協定数・総額の更新値（B_HAF_PBO）、ビルド・カナダ・ホームズの内訳（B_BCH_FUNDS）
- トロントの6戸許可（B_TOR_6PLEX）、バンクーバーの対象区画数（B_VAN_LOTS）、BC の人口5,000人要件（B_BC44_POP）、Bill 23 の負担金免除（B_ONT23_DC）
- 開発負担金の「CHBA 19.5万ドル」「Desjardins 13.7万ドル」、上昇率176%・156%（B_DC_OTHERS・B_DC_GROW）
- 建設費の累積上昇（3分の2・51%。B_BCPI_CUM）と各四半期の単独値
- 建設労働者の住宅部門の不足6万7,600人（B_LAB_RES）、FCM の2,700億ドル（B_FCM_DEFICIT）
- 「規制のせい」「政府のせい」「移民のせい」などの原因の断定、政策の良し悪しの評価（Bill 23 への批判も扱わない）。CMHC 自身が地理・規制・人口構成など複数の要因を挙げている

## 未確認点・ブロッカー
1. **📄 ゼロ**：今回 WebFetch を `www.pbo-dpb.ca`・`www.fraserinstitute.org` に各1回試し、いずれも名前解決できず失敗。CMHC・統計局・トロント市・publications.gc.ca も前回から不可。これらのホスト（加えて `www2.gov.bc.ca`・`vancouver.ca`・`www.ola.org`・`budget.canada.ca`・`www.canada.ca`・`fcm.ca`・`www.buildforce.ca`・`economics.td.com`）を許可すると、✅ の多くを 📄 にできる
2. **着工数の長期系列**：統計局／CMHC の表（例：統計局表 34-10-0135 系、CMHC Housing Market Information Portal）で1955〜2025年の全地域の年次値を自分でそろえ、人口（統計局表 17-10-0005）で割った「人口1,000人あたり」を計算すれば B_PERCAP を置き換えられる
3. **2023年の系列**：全地域240,267戸と都市部223,513戸の両方が公式。グラフは全地域にそろえる（2024・2025年も全地域値）
4. **建設費の累積**：BCPI の表で2019年（または2020年1〜3月期）→最新期の住宅の変化率を計算するまで数字なし
5. **開発負担金**：資料によりトロントの一戸建てで約13.7万〜19.5万ドルと割れる。使うなら CMHC 2025年の表を本文で確認し、年・住宅の種類・自治体（市のみか地域分を含むか）を固定する
6. **承認期間**：CHBA 2024年版（第3版、2025年3月公表）の最新の月数が未取得。2022年版の32か月を使うなら「2022年の調査で」と年を明記
7. **BC Bill 44 の境界（280m²「以下」か「未満」か）と、2025年の Bill 25 による変更**、トロントの6戸許可の範囲、バンクーバーのその後の改正は未確認
8. **HAF の成果（実際に増えた戸数）**：PBO 2025年の評価本文が未読。成果の評価は台本で扱わない
9. **CMHC 2026年秋の報告**（B_GAP26）は01の CMHC_GAP25 より新しい。台本の S04 を差し替えるかは企画側で判断（2035→2036、43万〜48万→41.7万〜46.9万、見込み24.5万→23.1万）
