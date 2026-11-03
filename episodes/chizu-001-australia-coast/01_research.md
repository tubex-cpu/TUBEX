# 出典表：chizu-001-australia-coast

- 起点は v1 の出典リスト（社長のドライブ「既存台本と出典.json」の `sources`）。v1 の出典は「検証済み」とは扱わない（HANDOFF）
- 2026-11-03 の確認方法：このクラウド環境からは豪州政府系サイト（abs.gov.au、bom.gov.au、nca.gov.au、mhnsw.au、ngv.vic.gov.au、agriculture.gov.au など）に**直接つながらない**（ネットワーク設定で拒否された）。そのため **Web 検索の結果に出た、公式ページの抜粋**で照合した。公式ページの本文を開いて確かめたものではない
- 状態：✅＝検索結果の抜粋で数値・内容が一致 / ⚠＝二次資料でしか確認できていない / ⏳＝未確認（公開前に公式ページで確認する）

| 記号 | 出典 | URL | 台本で使う事実 | 状態 |
|---|---|---|---|---|
| ABS | Australian Bureau of Statistics「Regional population 2024–25」 | https://www.abs.gov.au/statistics/people/population/regional-population/latest-release | 2025年6月30日の推計人口（GCCSA）：シドニー 5,638,830、メルボルン 5,435,590、ブリスベン 2,833,524、パース 2,452,765、アデレード 1,491,015 | ✅ 5都市すべて一致 |
| ABS_GCCSA | 同上（id.com.au の解説による補足） | https://www.id.com.au/insights/articles/top-50-largest-cities-and-towns-in-australia/ | シドニー都市圏（GCCSA）はセントラルコーストを含む | ⚠ ABS の GCCSA の定義ページで要確認 |
| GA_AREA | Geoscience Australia「Australia's size compared」 | https://www.ga.gov.au/scientific-topics/national-location-information/dimensions/australias-size-compared | 面積 7,688,287 km²、世界6位 | ✅ |
| GSI_AREA | 国土地理院「全国都道府県市区町村別面積調」 | https://www.gsi.go.jp/KOKUJYOHO/MENCHO-title.htm | 日本の面積（約37.8万km²）→ 豪州の約20倍 | ⏳ 最新版の値を確認する |
| BOM_RIDGE | Bureau of Meteorology「Subtropical ridge」 | https://www.bom.gov.au/resources/learn-and-explore/climate-knowledge-centre/climate-factors/subtropical-ridge | 下降する乾いた空気と高気圧の帯が、中央部の乾燥に強く影響する | ⚠ BOM を引用したニュース記事で一致。BOM 本文は未確認 |
| BOM_CLIMATE | Bureau of Meteorology「Australian climate zones」 | https://www.bom.gov.au/resources/learn-and-explore/climate-knowledge-centre/australian-climate-zones | 北の熱帯・中央の乾燥・南の温帯、海と山地の影響 | ⏳ |
| TANK | Museums of History NSW「Tank Stream – before and after 1788」 | https://mhnsw.au/learning/tank-stream-before-and-after-1788/ | フィリップは、ボタニー湾には安全な停泊地も頼れる真水もないと判断。シドニー・コーブには両方があり、淡水の小川がのちのタンク・ストリーム | ✅（検索結果の抜粋） |
| SYDNEY_WATER | Sydney Water「Tank Stream heritage fact sheet」 | https://www.sydneywater.com.au/content/dam/sydneywater/documents/tank-streamheritage-fact-sheet.pdf | 1788年1月、フィリップの条件の一つが頼れる真水だった | ✅（同上） |
| NGV | National Gallery of Victoria「Colony: Australia 1770–1861」 | https://www.ngv.vic.gov.au/exhibition/colony-australia-1770-1861/ | 1788年の移動、植民地の拡大による先住民の土地の喪失 | ⏳ |
| NMA | National Museum of Australia「Evidence of first peoples」 | https://www.nma.gov.au/defining-moments/resources/evidence-of-first-peoples | 植民地化よりはるか前からの先住民の暮らし（年代の数字は語りに入れない） | ⏳ |
| TREASURY | Australian Treasury（Andrew Leigh 議員の講演、2025年10月30日） | https://ministers.treasury.gov.au/ministers/andrew-leigh-2025/speeches/address-committee-capital-cities-event-future-cities-ambition | 都市への集積による専門化・知識の共有・設備の共有、住宅費や交通の制約 | ⏳ |
| NCA | National Capital Authority「The Siting and Naming of Canberra」 | https://www.nca.gov.au/education/canberras-history/siting-and-naming-canberra | 首都は NSW 州内、シドニーから100マイル以上。1908年に議会が決定 | ✅（検索結果の抜粋と、下の2つで一致） |
| CONST_125 | オーストラリア憲法 第125条（連邦議会） | https://www.aph.gov.au/About_Parliament/Senate/Practice_and_Procedure/Constitution/chapter7 | 首都は NSW 州内、シドニーから100マイル以上、面積は100平方マイル以上 | ✅（同上） |
| PEO_1908 | Parliamentary Education Office「Seat of Government Act 1908」 | https://peo.gov.au/understand-our-parliament/history-of-parliament/history-milestones/australian-parliament-history-timeline/events/seat-of-government-act-1908/ | 1908年の法律で、首都の場所をヤス・キャンベラに決定 | ✅（同上） |
| DAFF | ABARES「Land use of Australia 2020–21」 | https://www.agriculture.gov.au/abares/aclump/land-use | 土地利用の区分に、放牧・自然保護などが含まれる | ⏳ |
| MAP | Natural Earth（パブリックドメイン）／NASA Blue Marble Next Generation（2004年1月の合成画像） | https://www.naturalearthdata.com/about/terms-of-use/ ／ https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/ | 地図の素材 | v1 のクレジットのまま |

## 公開前に必ずすること
- ⚠ と ⏳ の行を、公式ページの本文で確認する。環境のネットワーク設定で上の公式サイトを許可するか、Codex 側で確認してもらう
- 確認できなかった事実は、その文を台本から外す（言い切れない話はぼかして残さない）
