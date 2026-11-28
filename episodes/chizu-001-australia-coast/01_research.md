# 出典表：chizu-001-australia-coast

- 起点は v1 の出典リスト（社長のドライブ「既存台本と出典.json」の `sources`）。v1 の出典は「検証済み」とは扱わない（HANDOFF）
- 2026-11-03 の確認方法：このクラウド環境からは豪州政府系サイト（abs.gov.au、bom.gov.au、nca.gov.au、mhnsw.au、ngv.vic.gov.au、agriculture.gov.au など）に**直接つながらない**（ネットワーク設定で拒否された）。そのため **Web 検索の結果に出た、公式ページの抜粋**で照合した。公式ページの本文を開いて確かめたものではない
- 状態：📄＝公式ページの本文で確認（2026-11-07、Fox（Codex側）が公式本文を確認した記録。社長本人の確認ではない。このクラウド環境からは今も豪州政府系サイトに接続できず、Claude 自身は本文を開いていない） / ✅＝検索結果の抜粋で数値・内容が一致 / ⚠＝二次資料でしか確認できていない / ⏳＝未確認（公開前に公式ページで確認する）

| 記号 | 出典 | URL | 台本で使う事実 | 状態 |
|---|---|---|---|---|
| ABS | Australian Bureau of Statistics「Regional population 2024–25」 | https://www.abs.gov.au/statistics/people/population/regional-population/latest-release | 2025年6月30日の推計人口（GCCSA）：シドニー 5,638,830、メルボルン 5,435,590、ブリスベン 2,833,524、パース 2,452,765、アデレード 1,491,015 | ✅ 5都市すべて一致／📄 公式本文で一致（2026-11-07、Fox（Codex側）による公式本文確認：5都市の数値） |
| ABS_GCCSA | 同上（id.com.au の解説による補足） | https://www.id.com.au/insights/articles/top-50-largest-cities-and-towns-in-australia/ | シドニー都市圏（GCCSA）はセントラルコーストを含む | ⚠ ABS の GCCSA の定義ページで要確認／⏳ 確認対象は人口推計が使う ASGS Edition 3（2021年境界）の Allocation files「Statistical Areas Level 4 – 2021」で SA4 102 Central Coast → GCCSA 1GSYD Greater Sydney の行（入口 https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs/edition-3-july-2021-june-2026/access-and-downloads/allocation-files ）。2026-11-07、この環境から abs.gov.au に接続できず未確認のまま（二次資料で確認済みにはしない）／📄 公式の GIS 公開データで確認（2026-11-07、独立点検＝Fox（Codex側）による確認。社長本人の確認ではない）：ABS「SA2_Regional_Population_2025」FeatureServer レイヤー3（2024–25 Regional population、ASGS Edition 3・2021年境界）https://geo.abs.gov.au/arcgis/rest/services/Hosted/SA2_Regional_Population_2025/FeatureServer/3 の照会（where=sa4_code_2021='102'、returnDistinctValues=true）で sa4_code_2021=102・sa4_name_2021=Central Coast・gccsa_code_2021=1GSYD・gccsa_name_2021=Greater Sydney（exceededTransferLimit=false）。Allocation files の xlsx 自体は未確認。Claude はこの環境から geo.abs.gov.au に接続できず（2026-11-07）、自分では照会していない |
| GA_AREA | Geoscience Australia「Australia's size compared」 | https://www.ga.gov.au/scientific-topics/national-location-information/geography/areas-of-australia | 面積 7,688,287 km²、世界6位 | ✅／📄 公式本文で一致（2026-11-07、Fox（Codex側）による公式本文確認：7,688,287 km²・本土と島を含む。URL は areas-of-australia のページ） |
| GSI_AREA | 国土地理院「全国都道府県市区町村別面積調」 | https://www.gsi.go.jp/KOKUJYOHO/MENCHO-title.htm | 日本の面積（約37.8万km²）→ 豪州の約20倍 | ⏳ 最新版の値を確認する／📄 公式本文で確認（2026-11-07、Fox（Codex側）による公式本文確認：2026年7月1日 377,973.68 km²。7,688,287 ÷ 377,973.68 ≒ 20.3 倍） |
| BOM_RIDGE | Bureau of Meteorology「Subtropical ridge」 | https://www.bom.gov.au/resources/learn-and-explore/climate-knowledge-centre/climate-factors/subtropical-ridge | 下降する乾いた空気と高気圧の帯が、中央部の乾燥に強く影響する | ⚠ BOM を引用したニュース記事で一致。BOM 本文は未確認／📄 公式本文で一致（2026-11-07、Fox（Codex側）による公式本文確認：下降する乾いた空気・中央部の乾燥・季節移動） |
| BOM_CLIMATE | Bureau of Meteorology「Australian climate zones」 | https://www.bom.gov.au/resources/learn-and-explore/climate-knowledge-centre/australian-climate-zones | 北部の熱帯、南部の温帯、東の海岸で海と山地が雨に関わること（台本 S07 の範囲）。BOM の気候区分は同じ緯度でも内陸の砂漠・東岸の亜熱帯・西岸の草原などを分けるもので、単純な「北・中央・南」の3つの帯ではない。v2.2 では気候区分の面塗りをやめ、地域の位置ラベルだけにした | ⏳／📄 公式本文で一致（2026-11-07、Fox（Codex側）による公式本文確認：北の熱帯・中央の乾燥・南の温帯・東岸の山地） |
| TANK | Museums of History NSW「Tank Stream – before and after 1788」 | https://mhnsw.au/learning/tank-stream-before-and-after-1788/ | フィリップは、ボタニー湾には安全な停泊地も頼れる真水もないと判断。シドニー・コーブには両方があり、淡水の小川がのちのタンク・ストリーム | ✅（検索結果の抜粋）／⏳ 2026-11-07 も本文を取得できず未確認（Fox（Codex側））。検索抜粋のみ／同じ事実は Sydney Water の公式PDF（SYDNEY_WATER の行）で確認済み。TANK の元ページは取得制限のため、回避や再試行はしない |
| SYDNEY_WATER | Sydney Water「Tank Stream heritage fact sheet」 | https://www.sydneywater.com.au/content/dam/sydneywater/documents/tank-streamheritage-fact-sheet.pdf | 1788年1月、フィリップの条件の一つが頼れる真水だった | ✅（同上）／📄 公式本文で確認（2026-11-07、Fox（Codex側）による公式本文確認：公式PDF「The Tank Stream」2ページ目＝1788年1月、フィリップが頼れる淡水を求めてシドニー湾の流れのそばに入植。1ページ目＝シドニー・コーブ周辺のガディガルの人々の記述） |
| NGV | National Gallery of Victoria「Colony: Australia 1770–1861」 | https://www.ngv.vic.gov.au/exhibition/colony-australia-1770-1861/ | 1788年の移動、植民地の拡大による先住民の土地の喪失 | ⏳／📄 公式本文で確認（2026-11-07、Fox（Codex側）による公式本文確認：展示解説の公式PDF https://www.ngv.vic.gov.au/wp-content/uploads/2018/01/Colony-Australia-1770-1861-Large-Print-Labels.pdf の63ページ目「Landing and settlement at Sydney Cove 1788」＝ボタニー湾から北のシドニー・コーブへ移動、安全な停泊地と真水、1790年代の入植拡大による先住民の土地の喪失。210ページ目「Sydney 1810s–50s」にも土地の喪失。本文は長く転載しない） |
| NMA | National Museum of Australia「Evidence of first peoples」 | https://www.nma.gov.au/defining-moments/resources/evidence-of-first-peoples | 植民地化よりはるか前からの先住民の暮らし（年代の数字は語りに入れない） | ⏳／📄 公式本文で一致（2026-11-07、Fox（Codex側）による公式本文確認：植民地化以前からの居住） |
| TREASURY | Australian Treasury（Andrew Leigh 議員の講演、2025年10月30日） | https://ministers.treasury.gov.au/ministers/andrew-leigh-2025/speeches/address-committee-capital-cities-event-future-cities-ambition | 都市への集積による専門化・知識の共有・設備の共有、住宅費や交通の制約 | ⏳／📄 公式本文で一致（2026-11-07、Fox（Codex側）による公式本文確認：集積による専門化・インフラ共有、住宅・交通の制約） |
| NCA | National Capital Authority「The Siting and Naming of Canberra」 | https://www.nca.gov.au/education/canberras-history/siting-and-naming-canberra | 首都は NSW 州内、シドニーから100マイル以上。1908年に議会が決定 | ✅（検索結果の抜粋と、下の2つで一致）／📄 公式本文で一致（2026-11-07、Fox（Codex側）による公式本文確認：シドニーから100マイルの憲法条件、ヤス・キャンベラは妥協案、1908年10月の議会可決） |
| CONST_125 | オーストラリア憲法 第125条（連邦議会） | https://www.aph.gov.au/About_Parliament/Senate/Practice_and_Procedure/Constitution/chapter7 | 首都は NSW 州内、シドニーから100マイル以上、面積は100平方マイル以上 | ✅（同上）／⏳ 2026-11-07 も憲法本文を取得できず未確認（Fox（Codex側））。検索抜粋と NCA 本文の記述のみ／📄 条文を公式本文で確認（2026-11-07、独立点検＝Fox（Codex側）による確認。社長本人の確認ではない）：PEO「The Australian Constitution online – Chapter VII」https://peo.gov.au/understand-our-parliament/how-parliament-works/the-australian-constitution/the-australian-constitution-online/chapter-vii の第125条「and shall be in the State of New South Wales, and be distant not less than one hundred miles from Sydney.」。台本の「州の中に置く」「少なくとも百マイル」と一致 |
| PEO_1908 | Parliamentary Education Office「Seat of Government Act 1908」 | https://peo.gov.au/understand-our-parliament/history-of-parliament/history-milestones/australian-parliament-history-timeline/events/seat-of-government-act-1908/ | 1908年の法律で、首都の場所をヤス・キャンベラに決定 | ✅（同上）／📄 公式本文で確認（2026-11-07、Fox（Codex側）による公式本文確認：1908年の法律でヤス・キャンベラを選定、NSW 州内・シドニーから100マイル以上の条件。憲法の条文そのものを読んだ確認ではない） |
| DAFF | ABARES「Land use of Australia 2020–21」 | https://www.agriculture.gov.au/abares/aclump/land-use | 土地利用の区分に、放牧・自然保護などが含まれる | ⏳／📄 公式本文で一致（2026-11-07、Fox（Codex側）による公式本文確認：2020–21 の区分に放牧・自然保護）。国全体の集計なので、特定の内陸地点の証明には使わない |
| MAP | Natural Earth（パブリックドメイン）／NASA Blue Marble Next Generation（2004年1月の合成画像） | https://www.naturalearthdata.com/about/terms-of-use/ ／ https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/ | 地図の素材 | v1 のクレジットのまま |

## 公開前に必ずすること
- ⚠ と ⏳ の行を、公式ページの本文で確認する。環境のネットワーク設定で上の公式サイトを許可するか、Codex 側で確認してもらう
- 確認できなかった事実は、その文を台本から外す（言い切れない話はぼかして残さない）

## 2026-11-07 の更新
- Fox（Codex側）が公式本文で確認した9件（社長本人の確認ではない）に 📄 を付け、確認日と URL を更新した（GA は areas-of-australia のページ）。検索抜粋だけの記録（✅）とは区別している
- 2026-11-07（2回目）：SYDNEY_WATER・NGV（別の公式PDF）・PEO_1908 の3件も Fox（Codex側）が公式本文で確認した
- **まだ公式本文で確認できていないもの**：TANK（Museums of History NSW の元ページ。Sydney Water の公式PDFで同じ事実は補強できたが、TANK のページ自体は未確認のまま）、CONST_125（憲法の条文そのもの）、ABS_GCCSA（シドニー都市圏がセントラルコーストを含むこと＝現行の ABS 境界の直接確認。今は二次資料の id.com.au のみ）
- 地図素材の版・権利（Natural Earth を同梱した npm パッケージの版、three-globe 同梱の Blue Marble 画像の撮影年・版）も未確認のまま。`06c_assets.md` 参照

## 2026-11-07（3回目）
- CONST_125：PEO の憲法の条文ページで第125条の原文を独立点検（Fox（Codex側））が確認。📄 に更新
- ABS_GCCSA：確認対象を「2026年現在の最新境界」ではなく、2024–25 の人口推計が使う ASGS Edition 3（2021年境界）の Allocation files に改めた。abs.gov.au にこの環境から接続できず、未確認のまま
- TANK：元ページは未確認のまま。同じ事実は Sydney Water の公式PDFで確認済み

## 2026-11-07（4回目）
- ABS_GCCSA：Fox（Codex側）が ABS の公式 GIS 公開データ（2024–25 Regional population のサービス、ASGS Edition 3）で SA4 102 Central Coast → GCCSA 1GSYD Greater Sydney を確認。📄 に更新。Allocation files の xlsx は未確認として区別する
- Claude の環境からの取得の試み（各1回、回避や再試行はしていない）：assets.science.nasa.gov と geo.abs.gov.au はどちらも、環境の外向き通信の中継で「CONNECT tunnel failed, response 403」（接続ポリシーによる拒否）。取得できたデータは0バイト
