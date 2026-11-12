# 長尺化リサーチ A：地理・地質・気候・歴史（chizu-005-bermuda-roof-water）

- 目的：3分版を20〜30分に広げるための素材（このパートで約8〜10分ぶん）。既存の `01_research.md` の記号（BMU_*）とは別に、このファイルの記号は A_* で振る
- 調査日：2026-11-12（Claude）。費用ゼロ（Web 検索の抜粋のみ）。**コミットしていない**
- 状態の記号：📄＝ページ本文を自分で読んだ／✅＝独立した2件以上の検索抜粋・二次資料で一致／⚠＝単独の資料、または資料どうしで食い違う
- **今回も 📄 は0件**。WebFetch を試した次のホストはすべて名前解決できず失敗（この環境の許可ドメイン外）：www.frontiersin.org、oceanexplorer.noaa.gov、www.weather.bm、hoopermuseum.carleton.ca、en.wikipedia.org。ツールの案内に従い、5件目の失敗後は WebFetch をやめ、Web 検索の抜粋だけで照合した（`01_research.md` で失敗済みの www.gov.bm・planning.gov.bm・www.bermudalaws.bm・faolex.fao.org・mdgs.un.org も同じ扱い）
- CLAUDE.md のルールどおり、台本で使えるのは ✅（📄があればそれも）だけ。⚠ は台本で言い切らない（使わない、または ✅ の範囲までぼかさずに削る）

---

## 1. 場所・気候・ハリケーン

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_LAT | バミューダは北緯約32度の北大西洋にある。この緯度にしては暖かく、亜熱帯の気候で、その理由として暖かいメキシコ湾流（Gulf Stream）が挙げられている | World Travel Guide https://www.worldtravelguide.net/guides/caribbean/bermuda/weather-climate-geography 、Frommer's https://www.frommers.com/destinations/bermuda/in-depth/the-natural-landscape 、bermuda.com https://www.bermuda.com/?p=7825 | ✅（旅行ガイド系で一致。学術資料ではない。台本は「北緯32度なのに亜熱帯。暖かいメキシコ湾流のおかげ」まで） |
| A_LAT_BAH | 気候を左右するもう一つの要素として「バミューダ・アゾレス高気圧」も挙げられる | 検索抜粋（World Travel Guide 系の要約） | ⚠ |
| A_DIST | 最寄りの陸地は北米ノースカロライナ州のハッテラス岬で、約1,030〜1,035km（既存 BMU_LOC） | `01_research.md` BMU_LOC | ✅ |
| A_TEMP_RAIN | 年平均気温22℃・年降水量約1,500mm | 旅行ガイドの要約（出典名なし） | ⚠（`01_research.md` BMU_RAIN と同じく資料で1,200〜1,680mmに割れる） |
| A_RAIN_OCT | 気象局（Bermuda Weather Service）は「10月が通常いちばん雨の多い月で、6インチ（約150mm）強」と説明（Royal Gazette の記事内の引用）。気象局の1991〜2020年平年値を使ったとする旅行ガイドも10月・約160mm | Royal Gazette https://www.royalgazette.com/?p=445666 （または ?p=442719／?p=489392、抜粋）、honeymoonguide https://www.honeymoonguide.com.au/caribbean/bermuda-weather.html | ⚠（weather-and-climate.com は9月を最多月とする。気象局の平年値表そのものは weather.bm に接続できず未読） |
| A_RAIN_APR | 4月（と5月）がいちばん雨が少ない（4月 約91mm） | weather-and-climate.com https://weather-and-climate.com/average-monthly-precipitation-Rainfall,hamilton-bm,Bermuda ほか旅行サイト | ⚠（モデル・非公式データ） |
| A_RAIN_SEASON | 31日間の平均降水量が最大になるのは2月中旬（約4.7インチ）、最小は7月上旬（約2.4インチ） | WeatherSpark https://weatherspark.com/y/150205/Average-Weather-in-Bermuda-Year-Round | ⚠（単独・再解析データ。「夏は雨が少なく、水の消費が増える」の構図は ✅ の BMU_TRUCK などで語る） |
| A_DRY_JULY | 「ほぼ40年ぶりに乾いた7月」という報道がある | Caribbean National Weekly https://www.caribbeannationalweekly.com/posts/bermuda-experiences-driest-july-in-almost-40-years | ⚠（年が抜粋で未確認） |
| A_FABIAN | 2003年9月5日、ハリケーン・ファビアンがカテゴリー3の強さでバミューダを直撃。島内の死者は4人、被害額は約3億ドル | 米国立ハリケーンセンター（NHC）年報 https://www.nhc.noaa.gov/data/mwreview/2003.pdf 、NHC 報告書（アーカイブ） https://webarchive.library.unt.edu/eot2008/20080916073504/http:/www.nhc.noaa.gov/2003fabian.shtml 、Royal Gazette https://www.royalgazette.com/?p=28039 、bernews https://bernews.com/2016/09/hurricane-victims-remembered-13-years-later | ✅ |
| A_FABIAN_RANK | ファビアンは「1926年以来最悪」「1963年のアーリーン以来最強」「50年で最悪」と資料で表現が割れる | 2003年シーズン要約（Wikipedia 系）、Wikipedia「Hurricane Fabian」、Royal Gazette | ⚠（台本は「何十年ぶりの大型」などぼかさず、比較表現ごと使わない） |
| A_FABIAN_ROOF | ファビアンで伝統的な石灰岩の屋根の建物の「かなりの割合」が屋根の一部を失った（RMS の調査）。一方で屋根が丸ごと飛んだ例は少なかった（AIR の調査） | RMS（AMS 論文 PDF） https://ams.confex.com/ams/pdfpapers/108950.pdf 、PropertyCasualty360 https://www.propertycasualty360.com/amp/2003/09/16/bermuda-offers-lesson-in-hurricane-preparedness/ | ⚠（評価が資料で違う） |
| A_CODE_WIND | 建築基準は、持続風速110マイル毎時（約177km/h）・瞬間風速150マイル毎時（約241km/h）に耐える家を求めている（2003年時点の報道） | Claims Journal https://amp.claimsjournal.com/news/international/2003/09/08/32062.htm 、Insurance Journal https://www.insurancejournal.com/news/international/2003/09/08/32027.htm 、PropertyCasualty360（同上） | ✅（2003年時点。現行値は未確認なので台本は「2003年当時の基準で」と年を付ける） |
| A_ROOF_HEAVY | 石灰岩の屋根は重く、その重さがハリケーンの風に耐える理由の一つとして挙げられている | Royal Gazette（検索抜粋「heavy enough not to be moved by hurricanes」）、This Old House「This roof resists hurricanes, collects water」 https://www.thisoldhouse.com/this-old-house/season-25/bermuda-house/this-roof-resists-hurricanes-collects-water | ✅（「重さで風に耐える」まで。何kg/m²かは数字が見つからず使わない） |
| A_NICOLE | 2016年10月13日、大型（メジャー）ハリケーン・ニコールの目がバミューダの真上を通過。記録が始まって約150年で、大型ハリケーンの直撃は2度目と報じられた | NASA Earth Observatory「Rare Hurricane Hits Bermuda」 https://earthobservatory.nasa.gov/images/88918/rare-hurricane-hits-bermuda 、FOX9 https://www.fox9.com/news/bermuda-takes-direct-hit-by-major-hurricane-nicole 、RMS ブログ https://rms.com/blog/2016/11/16/shrugging-off-a-hurricane-a-three-hundred-year-old-culture-of-disaster-resilience | ✅（直撃・日付）／⚠（「約150年で2度目」は報道1件。台本では使わない） |
| A_GONZALO | 2014年10月17日、ハリケーン・ゴンサロが風速110マイル毎時で襲来、島はハリケーン級の風に約6時間さらされた | hurricanecity https://www.hurricanecity.com/city/bermuda.htm | ⚠（単独。ゴンサロの襲来自体は Wikipedia「List of Bermuda hurricanes」とも一致） |
| A_PAULETTE | 2020年9月14日、ハリケーン・ポーレットの目が島の真上を通過 | hurricanecity（同上）、Wikipedia「List of Bermuda hurricanes」 https://en.wikipedia.org/wiki/List_of_Bermuda_hurricanes | ✅（日付・目の通過）／⚠（「約2万5千戸が停電」は単独） |
| A_ERNESTO | 2024年8月17日朝、ハリケーン・アーネスト（カテゴリー1、最大風速85マイル毎時＝約140km/h）がバミューダに上陸。前日夕方の時点で電力会社の顧客3万6千のうち5,400が停電、空港と公共交通は止められた | NPR https://www.npr.org/2024/08/17/g-s1-17461/hurricane-ernesto-lashes-bermuda 、Al Jazeera https://www.aljazeera.com/amp/news/2024/8/17/hurricane-ernesto-makes-landfall-in-bermuda-as-residents-hunker-down 、WUSF https://www.wusf.org/2024-08-17/hurricane-ernesto-lashes-bermuda-as-wealthy-british-territory-closes-down | ✅（同じ AP 配信の可能性あり。数字は1つの通信社由来として扱う） |
| A_LANDFALL_RATE | 1850年以降、島の160km以内に来た熱帯低気圧130個のうち上陸は11個 | Fox Weather https://foxweather.com/learn/bermuda-hurricane-threat-tropical-weather （抜粋） | ⚠（単独） |

## 2. 地質：火山の上の石灰岩の島

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_SEAMOUNT | バミューダの島々は、浸食で頭を削られた古い海底火山（海山）の上に乗っている。地表の岩は火山岩ではなく石灰岩 | NOAA Ocean Explorer「Origin of Bermuda and Its Caves」 https://oceanexplorer.noaa.gov/explorations/09bermuda/background/bermudaorigin/bermudaorigin.html 、カールトン大学 Hooper 博物館 https://hoopermuseum.carleton.ca/Bermuda/Geology/BERM5-1.HTML 、bernews「NOAA On The Volcanic Origins Of Bermuda」 https://bernews.com/2013/04/noaa-on-the-volcanic-origins-of-bermuda/ 、Vogt ほか（Durham, MantlePlumes） https://mantleplumes.awh.durham.ac.uk/WebpagePDFs/Bermuda.pdf | ✅ |
| A_SEAMOUNT_AGE | 火山ができた時期：約4,700万〜3,300万年前（始新世〜漸新世）とする説と、約1億1千万年前とする説がある | Vogt（Durham, 47〜40Ma）、NOAA 系要約（約3,300万年前）、Hooper 博物館（約1億1千万年前） | ⚠（年代は割れる。台本は「数千万年前の火山」なら全説と矛盾しない ✅） |
| A_SEAMOUNT_H | 海山は大西洋の海底から約4,000m立ち上がっている | Hooper 博物館（抜粋） | ⚠（単独） |
| A_CAP | 火山の上にのる石灰岩（サンゴ礁とその砂からできた炭酸塩岩）の層の厚さは約15〜100m。火山岩は海面下平均約75mで出てくる | Vogt（Durham：15-100 m thick, 665 km² cap）、NOAA Ocean Explorer（同じ15〜100m・75m） | ✅（厚さ15〜100m）／⚠（75m・665km²は単独） |
| A_AEOLIANITE | 島の石灰岩の多くは、浜の砂（サンゴや貝の破片）が風で吹き寄せられて砂丘になり、それが固まった「風成石灰岩（エオリアナイト）」 | NOAA Ocean Explorer、Hooper 博物館 BERM5-2 https://hoopermuseum.carleton.ca/Bermuda/Geology/BERM5-2.HTML 、brainbound https://brainbound.blog/bermuda-geography-volcanic-coral | ✅ |
| A_CAP_AGE | 石灰岩がたまり始めたのは更新世の初め（約180万年前）から | 検索抜粋（NOAA 系） | ⚠ |
| A_NO_RUNOFF | 石灰岩は水を通しやすく、雨は地面にしみ込む。川も淡水の湖もない（既存 BMU_NOSURFACE）。石灰岩の土地（カルスト）は一般に地表を流れる川や厚い土の層がない | `01_research.md` BMU_NOSURFACE、Frontiers in Marine Science 2024（抜粋） https://frontiersin.org/articles/10.3389/fmars.2024.1441113/full 、Cambrian Foundation「Karst Terrain」 https://cambrianfoundation.org/?p=2235 | ✅ |
| A_AREA | 面積は約53km²（53.2〜54km²） | `01_research.md` BMU_AREA、Wikipedia 系「Geography of Bermuda」（53.3km²） | ✅ |
| A_COAST | 海岸線は約103km | Wikipedia 系「Geography of Bermuda」の表 | ⚠（単独） |
| A_ISLANDS | 島の数は約180〜181（大小の島・小島を含む）。「100を超える」とする資料もある | Geography Worlds https://geographyworlds.com/blog/bermuda-island-guide/ （181）、World Travel Guide（約180）、Moon https://www.moon.com/?p=577182 （100以上） | ⚠（数え方で変わる。台本は「100を超える島々」なら全資料と矛盾しない ✅） |
| A_TOWNHILL | 最高地点はスミス教区のタウン・ヒル（Town Hill） | Wikipedia「Town Hill, Bermuda」 https://en.wikipedia.org/wiki/Town_Hill,_Bermuda 、Hooper 博物館系の抜粋、Flagpedia | ✅（名前と場所）／⚠（高さは79m（259ft）と76m（249ft）で割れる） |

## 3. 淡水レンズ（地下の淡水）

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_GH | 海水は淡水より重い（比重 約1.025 対 1.000）。そのため島の地下では淡水が海水の上に浮き、凸レンズ形の層になる。地下水面が海面より1フィート高いと、淡水は海面下に約40フィートまで届く（ガイベン・ヘルツベルグの関係） | 米地質調査所（USGS）「Long Island Fresh and Saltwater Relations/Interactions」 https://www.usgs.gov/centers/new-york-water-science-center/science/long-island-fresh-and-saltwater-relationsinteractions 、全米地下水協会（NGWA） https://www.ngwa.org/what-is-groundwater/About-groundwater/relation-of-salt-water-to-fresh-water-in-aquifers 、Darrel Dunn（水文地質） https://sites.google.com/a/dunnhydrogeo.com/darrel-dunn---hydrogeologist/home/saltwater-intrusion-nt | ✅ |
| A_GH_PUMP | 逆に、くみ上げで地下水面が1フィート下がると、淡水の層は下から約40フィート縮み、重い海水が入り込む（塩水化） | USGS（同上） | ✅（USGS の本文の抜粋。NGWA も同じ密度の原理） |
| A_GH_LIMIT | 40倍は単純化した目安で、実際は計算より浅いところから塩分が増えることが多い | Custodio「Myths about seawater intrusion in coastal aquifers」 https://agua.org.mx/wp-content/uploads/2017/12/Myths-about-seawater-intrusion-in-coastal-aquifers.pdf 、Darrel Dunn（「40 は近似」） | ✅（台本では「およそ40倍」と言い、目安であることは画面の注に置く） |
| A_LENS_MAIN | いちばん大きいのはデヴォンシャー・レンズ（中央の教区の下にあるので「セントラル・レンズ」とも呼ぶ）。くみ上げる地下水の大半がここから出る | Frontiers in Marine Science 2024（Zhang ほか） https://frontiersin.org/articles/10.3389/fmars.2024.1441113/full 、NSF 公開版 https://par.nsf.gov/servlets/purl/10549427 、Vacher & Ayers「Sea Water Intrusion in Coral Reef Islands: Devonshire Lens, Bermuda」 https://digitalcommons.usf.edu/geo_facpub/1880 | ✅ |
| A_LENS_AREA | デヴォンシャー・レンズの広さは約7.2km²（2024年論文）。1970年代の調査では「中央の教区の1,660エーカー（約6.7km²）の下に淡水がある」 | Frontiers 2024（7.2km²）、国連統計部向けバミューダ政府発表 2019「Session 3.1.3 Bermuda – Fresh water」 https://unstats.un.org/unsd/envstats/meetings/2019-Caricom%20Region/documents/Session%203.1.3%20Bermuda%20-%20Fresh%20water.pdf （1,660エーカー、抜粋） | ✅（「約7km²＝島の面積の8分の1ほど」は自前の比較：7÷53≒0.13）。数字は2資料で近い |
| A_LENS_THICK | デヴォンシャー・レンズの最大の厚さは約10m | Frontiers 2024（抜粋） | ⚠（単独） |
| A_LENS_SMALL | ほかにサマセット・レンズ（ポート・ロイヤル・レンズ）とセント・ジョージズ・レンズがあり、それぞれ約0.5〜0.7km² | Frontiers 2024（抜粋） | ⚠（単独。厚さは見つからない） |
| A_LENS_ASYM | レンズは島の北側と南側で形が違う。北寄りの「ラングトン帯水層」は水を通しにくく（約30〜120m/日）、南寄りの「ブライトン帯水層」は通しやすい（約1,000m/日）。通しにくい側の方が淡水の層が厚く、塩水との境は約2倍深い（Vacher 1978 の研究がもと） | Frontiers 2024（Vacher 1978、Rowe 1984、Vacher & Rowe 1997 を引用）、Vacher 1978 の要旨（USF Digital Commons） https://digitalcommons.usf.edu/geo_facpub/1868 | ✅（「透水性の違いで南北の厚さが違う」）／⚠（30〜120・1,000m/日・約2倍は論文1本の抜粋） |
| A_LENS_VOL | デヴォンシャー・レンズには約22億ガロンの淡水がある | Royal Gazette https://www.royalgazette.com/?p=30866 （抜粋） | ⚠（単独・英米ガロン不明） |
| A_LENS_WELLS | 島の多くの場所では淡水の井戸が掘れない。デヴォンシャーは地質の条件がよく、艦隊に水を補給する井戸が掘られた | Royal Gazette（抜粋） | ⚠（単独・年代不明） |
| A_LENS_1970S | 1972〜74年の水文地質の調査でデヴォンシャー・レンズが確認され、1975年に水資源法（Water Resources Act 1975）ができた | 国連統計部向け政府発表 2019（抜粋）、Bermuda Laws「Water Resources Act 1975」 https://www.bermudalaws.bm/Laws/Consolidated%20Law/1975/Water%20Resources%20Act%201975 | ✅（法律の名前と年）／⚠（1972〜74年の調査は単独） |
| A_WRPA | 地下水のレンズは「水資源保護区域（WRPA）」に指定され、くみ上げの上限は水資源法のもとで環境当局が管理する | 国連統計部向け政府発表 2019（抜粋）、gov.bm ミニステリアル・ステートメント（2024年の法改正） https://www.gov.bm/news/tabling-amendments-water-resources-act-1975 | ✅ |
| A_WATER_RIGHTS | 環境・天然資源局は5年ごとに約3,142件の「水利権」を発行し、井戸からの地下水利用を管理している。2024年に水資源法が改正され、汚染の基準と取り締まりが強化された | gov.bm（印刷版 https://www.gov.bm/print/html/node/1210351 ）、bernews 2024-07「Minister On Water Resources Act Amendments」 https://bernews.com/2024/07/minister-on-water-resources-act-amendments | ✅ |
| A_WATLINGTON | 民間の水道会社ワトリントン水道（現 Bermuda Waterworks）は1932年、ヘンリー・ワトリントン卿が観光業を支えるために創業 | Royal Gazette（抜粋） | ⚠（単独。「1924年に議会が地下水の試験計画を否決」「1979年の改修から飲用可」も単独で ⚠） |
| A_WATLINGTON_2025 | ワトリントン水道は2025年にサウサンプトン教区で300万ガロンの新しい貯水池・浄水施設を完成させた | Royal Gazette「New reservoir to give island 3m gallon back-up supply of water」 https://www.royalgazette.com/?p=434317 、Royal Gazette（会社業績記事 ?p=467830） | ⚠（完成年は抜粋の要約のみ。B パートの現代編と照合する） |

## 4. 水の歴史

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_SEAVENTURE | 1609年7月28日、ジェームズタウン（バージニア）へ向かっていた英国船シー・ヴェンチャー号が嵐でバミューダの岩礁に乗り上げた。乗っていた人々は全員岸にたどり着いた | Wikipedia「Sea Venture」 https://en.wikipedia.org/wiki/Sea_Venture 、イースト・カロライナ大学 https://sites.ecu.edu/bermuda-museum-artifact-research/?p=35 、Smithsonian Magazine https://www.smithsonianmag.com/history/hidden-history-bermuda-reshaping-way-think-colonial-america-180985439/ 、HistoryNet https://historynet.com/the-hurricane-that-saved-jamestown/ | ✅（日付・全員上陸）／⚠（人数は約150人と資料で割れる。台本は「全員」まで） |
| A_STRACHEY | 遭難者の一人ウィリアム・ストレイチーの手記（1610年、通称「True Reportory」、1625年出版）に、島の「淡水の池と井戸」の近くで船を造ったことが書かれている | Encyclopedia Virginia（一次資料の抜粋） https://encyclopediavirginia.org/primary-documents/thedeliverance-and-the-patience-an-excerpt-from-a-true-reportory-of-the-wracke-and-redemption-of-sir-thomas-gates-knight-by-william-strachey-1625/ 、Wikipedia「True Reportory」（成立・出版年） | ⚠（本文の該当語は抜粋の言い換えで確認。原文の引用を読むまで台本で使わない。手記の存在・1610年執筆・1625年出版は ✅） |
| A_DELIVERANCE | 遭難者は船の残骸と島の木で2隻（デリバランス号・ペイシェンス号）を造り、1610年にジェームズタウンへ着いた | Wikipedia「Sea Venture」、HistoryNet、Encyclopedia Virginia | ✅ |
| A_1612 | 1612年7月、プラウ号で約50〜60人の入植者が総督リチャード・ムーアとともに到着。最初はスミス島に住み、その後セント・ジョージズへ移った。セント・ジョージズは1612年に町が作られた | Royal Gazette「The Plough settles Bermuda」 https://www.royalgazette.com/?p=66076 、The Bermudian https://www.thebermudian.com/history/history-history/the-history-of-smiths-island-bermudas-first-colony/ 、Wikipedia「Sea Venture」「History of Bermuda」 | ✅（1612年・プラウ号・ムーア・スミス島→セント・ジョージズ）／⚠（人数50か60か） |
| A_1612_WATER | セント・ジョージズへ移った理由の一つは「淡水を集めやすかった」こと | Royal Gazette（2本の記事：?p=442637、?p=66074 の抜粋） | ⚠（同じ新聞の2記事のみ） |
| A_MOORE_WELL | ムーア総督はセント・ジョージズに井戸を掘った | Wikipedia「History of Bermuda」（抜粋が途中で切れている） | ⚠ |
| A_EARLY_ROOF | 最初の家の屋根はヤシ（パルメット）の葉ぶき。17世紀の終わりまでに石の屋根に替わった | The Bermudian、Royal Gazette（抜粋の要約） | ⚠（年代の根拠未確認） |
| A_QUARRY | 石の切り出しは17世紀に始まった。石切場では長さ12〜15フィート（約4〜4.5m）の大きな塊をノミと8フィートののこぎりで切り出し、1つの塊から屋根用の板（スレート）約1,000枚がとれた。1つの石切場で30〜40人が働いた | バミューダ国立博物館（National Museum of Bermuda）「Limestone: The Building Blocks of Bermuda」（Amani Simons） https://nmb.bm/history/limestone-the-building-blocks-of-bermuda/ （同 ?p=19172） | ⚠（博物館1件。信頼度は高いが単独。台本で使うなら公開前に本文を読む） |
| A_SLATE | 屋根は地元で切り出した石灰岩の板（slate と呼ぶ）を木の垂木の上に重ねて並べ、セメントで上塗りする | This Old House、The Bermudian（Peter Backeberg、repeatingislands.com 転載） https://repeatingislands.com/2022/07/14/the-bermuda-roof/ 、バミューダ国立博物館 | ✅（既存 BMU_ROOF_BUILD と同じ内容） |
| A_LIMEWASH | 階段状の石灰岩の屋根は、地元の石灰窯（ライム・キルン）で焼いた石灰の白い漆喰（ライムウォッシュ）で塗られた | バミューダ国立博物館（同上）、bernews 掲載「Lime Kiln Q&A」 https://cloudfront.bernews.com/wp-content/uploads/2020/10/Lime-Kiln-QA.pdf | ✅（白い石灰で塗ったという事実）／**目的（殺菌・水質・遮熱）は依然 ⚠**：公式・学術の資料なし。保健省の現行指針は「承認された集水用塗料」を求めるだけで、石灰や目的には触れていない |
| A_CONCRETE | 1950年代から、建材は石灰岩からコンクリートブロックに大きく替わった。石灰岩は希少で高価になった | バミューダ国立博物館（同上） | ⚠（単独） |
| A_350Y | 屋根の雨水が350年以上にわたり島の主な飲み水だった | Frontiers 2024（抜粋） | ⚠（「400年」とする BBC 報道（`01_research.md` BMU_HIST）と幅がある。台本は「数百年」） |
| A_OLD_TANK | 昔のタンクは地下ではなく家の横の石造りの建物にあり、石の雨どいでつながれていた | Wikipedia「Architecture of Bermuda」、Royal Gazette、amusingplanet | ✅（既存 BMU_TANK と同じ） |
| A_REG1951 | 1951年の公衆衛生（貯水）規則（Public Health (Water Storage) Regulations 1951）は、人が住む建物に、屋根面積の5分の4以上を雨どい付きの集水面（または地上の集水面）にすることを求める（FAOLEX に載る1989年改訂版の文） | FAOLEX https://faolex.fao.org/docs/pdf/ber49598.pdf （抜粋）、This Old House（80％） | ✅（5分の4）／⚠（タンク容量は「集水面10平方フィートにつき100ガロン」と「1平方フィートにつき8英ガロン」で資料が割れる。`01_research.md` BMU_ROOF_LAW の未解決点のまま） |
| A_TANK_6Y | 政府の水道・配管検査プログラムは「タンクは少なくとも6年に1回掃除（法律上の上限）」「屋根は2年ごとに掃除または塗り直し」と案内している | gov.bm「Water & Plumbing Inspection Programme」 https://www.gov.bm/water-plumbing-inspection-programme （印刷版 https://www.gov.bm/print/html/node/61016 ）、保健省「Safe Water 2017」 https://www.gov.bm/sites/default/files/Safe%20Water%20-%202017.pdf 、planning.gov.bm「Proper Maintenance of Tank Water Systems」 https://planning.gov.bm/index.php/proper-maintenance-of-tank-water-systems/ | ✅（政府ページ2〜3件の抜粋で一致。`01_research.md` の BMU_PAINT（2年ごと）を ✅ に上げられる根拠） |
| A_PAINT_LIST | 屋根は高圧洗浄やワイヤーブラシで古い塗料とカビを落とし、漂白剤と水を半々にした液で洗ってから、政府の承認リストにある「集水用の屋根塗料」を塗る。塗料が乾き、最初の雨が降るまでタンクへの管はふさいでおく | 保健省「Safe Water 2017」、政府「Approved Paints & Coverings 2017-2018」 https://www.gov.bm/sites/default/files/2017%20-2018%20APPROVED%20PAINTS%20%20%20COVERINGS%20%28%20Sept%202017%29a.pdf | ✅（2017年版の指針。現行版は未確認） |
| A_NO_PROSECUTION | タンク掃除を怠って起訴された人はこれまでいない | Royal Gazette https://www.royalgazette.com/?p=277196 （抜粋） | ⚠（単独・記事年不明） |
| A_CODE1972 | 1972年建築基準は、汚水・排水などの管が規定のタンクの上や中を通ることを禁じている | Bermuda Laws「Building Code 1972」（検索抜粋） | ⚠（単独・本文未読） |
| A_HIST_IMG | 1809年のアクアチント「Watering tank at Tobacco Bay, Bermuda」（W. F. Wells）（既存 BMU_HIST_IMG） | `01_research.md` | ✅ |
| A_VERDMONT | 1710年ごろ建てられた歴史的な家ヴァードモント（スミス教区）は、バミューダ・ナショナル・トラストが博物館として運営している | Wikipedia 系ミラー「Verdmont」 | ⚠（ナショナル・トラスト本体の資料は見つからない。古いタンクの記述もない） |

## 5. 人口・住宅

| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| A_DWELL | 2016年国勢調査で、人が住んでいる住宅は28,192戸 | gov.bm「2016 Census Report」 https://www.gov.bm/sites/default/files/2016%20Census%20Report.pdf （抜粋） | ⚠（公式だが抜粋1件） |
| A_HH_SIZE | 2016年の1世帯あたりの人数は平均2.26人 | gov.bm「Average Household Size by Census District 2016」 https://www.gov.bm/sites/default/files/Average-Household-Size-by-Census-District--2016.pdf | ⚠（公式だが抜粋1件。28,192×2.26≒6.4万で BMU_POP と整合する＝自前の検算） |
| A_DENSITY | 2016年の人口密度は1平方マイルあたり3,086人（＝1km²あたり約1,190人、自前の換算）。別資料は2016年国勢調査の人口と面積から1km²あたり約1,206人 | gov.bm「2016 Census Preliminary Report」 https://www.gov.bm/sites/default/files/2016-Census-Preliminary-Report.pdf 、geo-ref.net https://geo-ref.net/en/bmu.htm | ✅（台本は「1km²あたり約1,200人」） |
| A_DENSITY_RANK | 世界の国・地域で人口密度が何番目かは資料で9〜11位などと割れる（「3位」は根拠が弱い） | statisticsoftheworld、IndexMundi、bermuda-online | ⚠（台本で順位を言わない） |
| A_HOUSE_TYPE | 住宅の種類別の世帯数は、政府の環境統計集2018の表1.2「Number of Households by Type of Dwelling, 2010 and 2016」にある | gov.bm「Environmental Statistics Compendium 2018v2」 https://www.gov.bm/sites/default/files/Environmental-Statistics-Compendium-2018v2.pdf | ⚠（表の題名だけ確認。数値は gov.bm に接続できず未読） |
| A_BELCO | 電力会社の顧客は約3万6千（2024年の報道） | A_ERNESTO と同じ | ✅（A_ERNESTO と同じ配信元） |

---

## 台本に使えるエピソード（✅ のみで組める流れ）

1. **「緯度は九州と同じくらいなのに亜熱帯」**：北緯約32度。暖かいメキシコ湾流が島を温める（A_LAT）。※「九州と同じくらい」は台本に入れる場合、九州南部の緯度（鹿児島 約31.6度）を別途出典付きで確かめる
2. **「島の正体は、海に沈んだ火山の頭にのった石灰岩の帽子」**：数千万年前の火山が削られ、その上にサンゴや貝の砂が積もった。厚さは15〜100m。地表の岩の多くは、浜の砂が風で砂丘になって固まった石（A_SEAMOUNT・A_CAP・A_AEOLIANITE）
3. **「雨は川にならない」**：石灰岩は水を通すので雨は地面に消える。だから川も淡水の湖もない（A_NO_RUNOFF）
4. **「地下に浮かぶ見えない湖」**：海水は淡水より少し重い。だから島の地下では淡水が海水の上に浮く。地下水面が海面より1フィート高ければ、淡水は海面下およそ40フィートまで届く。逆にくみ上げで1フィート下がると、淡水は約40フィートぶん薄くなり、海水が入り込む（A_GH・A_GH_PUMP・A_GH_LIMIT）→ 図解の見せ場
5. **「最大のレンズは島の真ん中、約7km²」**：デヴォンシャー（セントラル）・レンズがくみ上げる地下水の大半を担う。島の北と南で岩の水の通しやすさが違い、レンズの厚さも違う（A_LENS_MAIN・A_LENS_AREA・A_LENS_ASYM の ✅ 部分）
6. **「地下水は法律で守られている」**：1975年の水資源法、水資源保護区域、5年ごとに約3,142件の水利権（A_LENS_1970S の ✅ 部分・A_WRPA・A_WATER_RIGHTS）
7. **「1609年、嵐が人を島へ運んだ」**：シー・ヴェンチャー号が座礁、全員上陸。残骸から2隻を造り、1610年にジェームズタウンへ（A_SEAVENTURE・A_DELIVERANCE）
8. **「1612年、本格的な入植」**：プラウ号とムーア総督、スミス島からセント・ジョージズへ（A_1612）
9. **「石を切り、屋根にする」**：地元の石灰岩を板に切り、階段状に重ね、石灰窯で焼いた石灰で白く塗った。昔のタンクは家の横の石の小屋（A_SLATE・A_LIMEWASH・A_OLD_TANK）。1809年の絵（A_HIST_IMG）
10. **「屋根の5分の4は雨を集める面」**：1951年の規則（A_REG1951 の ✅ 部分）。今も政府は「タンクは6年に1回以上掃除、屋根は2年ごとに掃除か塗り直し」「塗るのは承認された集水用塗料」と案内している（A_TANK_6Y・A_PAINT_LIST）
11. **「ハリケーンの通り道で、重い石の屋根」**：2003年ファビアン（カテゴリー3、島内で4人死亡）、2016年ニコール（目が真上を通過）、2020年ポーレット、2024年アーネスト。石の屋根は重さで風に耐える。2003年当時の基準は持続風速110マイル毎時・瞬間150マイル毎時に耐える家（A_FABIAN・A_NICOLE・A_PAULETTE・A_ERNESTO・A_ROOF_HEAVY・A_CODE_WIND）
12. **「53km²に約6万4千人」**：1km²あたり約1,200人。この密度で、雨と地下水と海水で暮らしを回している（A_DENSITY・BMU_POP）

## 未確認点・ブロッカー

1. **接続不可（今回 WebFetch 失敗）**：www.frontiersin.org、oceanexplorer.noaa.gov、www.weather.bm、hoopermuseum.carleton.ca、en.wikipedia.org。既存の www.gov.bm・planning.gov.bm・www.bermudalaws.bm・faolex.fao.org・mdgs.un.org も未解決。セッションのネットワーク設定でこれらを許可しない限り 📄 にできない
2. **月別降水量**：気象局 weather.bm の1991〜2020年平年値表が読めない。最多月（10月か9月か）・最少月・年降水量はすべて ⚠。台本では月別グラフを出さない
3. **タンク容量の数字**：「10平方フィートにつき100ガロン」と「1平方フィートにつき8英ガロン」が両方「政府の数字」として出てくる。1951年規則・1972年建築基準・1991年規則の本文を読むまで使わない（`01_research.md` の未解決点2と同じ）
4. **白い石灰の目的**：今回も公式・学術資料なし。「白い石灰で塗った」事実（A_LIMEWASH）と「今は承認塗料を塗る」（A_PAINT_LIST）だけ使う
5. **レンズの数字**：最大厚さ10m・小レンズ0.5〜0.7km²・透水係数・22億ガロンは論文1本／記事1本。Vacher（1978）、Vacher & Rowe（1997）、Vacher & Ayers（1987, UNESCO）の本文で確かめる
6. **ワトリントン水道の創業1932年、1924年の議会否決、1979年の飲用化**：Royal Gazette 1件のみ
7. **ストレイチーの手記の「淡水の池と井戸」**：原文（Encyclopedia Virginia／Jamestown の転記）を読んで引用を確定する。「潮の満ち引きで水位が変わる井戸」の話は今回見つからない
8. **初期の屋根（ヤシ葺き→石）・ムーア総督の井戸・セント・ジョージズ移転の理由**：単独または抜粋が途中で切れている
9. **歴史的建物の古いタンク**：バミューダ・ナショナル・トラストの資料が検索に出てこない（ヴァードモント・カーター・ハウスとも、タンクの記述なし）
10. **タウン・ヒルの高さ**（79m か76m）、**島の数**（約181か）、**海岸線**（103km）は資料で割れる／単独
11. **ファビアンの順位表現**（1926年以来／1963年以来／50年ぶり）、**屋根被害の程度**は資料で食い違う
12. **住宅の種類別の数**：環境統計集2018の表1.2の数値が未読
13. 現行の建築基準の風速値（2003年以降の改定）未確認
