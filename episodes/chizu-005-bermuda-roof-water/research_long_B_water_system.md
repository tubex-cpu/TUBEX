# 長尺化リサーチ B：いまの水の仕組み（chizu-005-bermuda-roof-water）

- 作成 2026-11-12（Claude、調査のみ・コミットなし）。対象：3分版 → 20〜30分版のうち「水の仕組み」パート（約8〜10分ぶん）
- 記号：📄＝本文を自分で読んだ（WebFetch 成功）／✅＝2つ以上の独立した抜粋・二次資料が一致／⚠＝単独の資料・資料間で食い違い・日付不明
- **今回も 📄 はゼロ**。WebFetch を faolex.fao.org・planning.gov.bm・www.gov.bm に各1回試し、3つとも名前解決できず失敗（許可ドメイン外）。ツールの指示に従い、それ以上のサイトへの取得は試していない。以下はすべて Web 検索の抜粋による
- 単位：バミューダの「ガロン」は資料上**英ガロン（imperial gallon＝4.546 L）**。1平方フィート＝0.0929 m²。換算は自前の計算（「計算」と明記）
- 台本ルール：⚠ は台本の語りで使わない。✅ は出典を資料表・概要欄に置き、語りでは言い切る

## 1. 屋根で集めてタンクにためる（家の設備）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_ROOF_STEP | 階段状の段は、強い雨の流れを遅くし、屋根の下端の雨どいで受け止められるようにするためのもの | This Old House https://www.thisoldhouse.com/this-old-house/season-25/bermuda-house/this-roof-resists-hurricanes-collects-water ／ The Bermudian（repeatingislands 転載）https://repeatingislands.com/2022/07/14/the-bermuda-roof/ ／ Atlas Obscura https://atlasobscura.com/articles/bermuda-roofs-water | ✅ |
| B_ROOF_PIPE | 雨どいに集まった水は、縦の管（downpipe／downspout）で家の下（または横）のタンクに落ちる | This Old House（同上）／ 99% Invisible https://99percentinvisible.org/?p=38083 ／ Wikipedia「Architecture of Bermuda」https://en.wikipedia.org/wiki/Architecture_of_Bermuda | ✅ |
| B_GLIDES | 屋根の「glides」（斜めの導水の畝）という呼び名 | 検索で該当語を含む資料が1件も見つからない | ⚠（**台本で使わない**） |
| B_SLOPE | 屋根の勾配（角度）・石板の厚さ | バミューダ固有の資料が見つからない（一般のスレート屋根の数値のみ） | ⚠（使わない） |
| B_FIRSTFLUSH | 初期雨水の排除装置（first flush）がバミューダで義務・標準か | バミューダの資料が見つからない（米国の一般論のみ） | ⚠（使わない） |
| B_OVERFLOW | 保健当局の指針：タンクのオーバーフロー管は地面から約4インチ上に出し、細かい金網でふさぐ。タンクのふたは隙間なく閉める | 保健省「Safe Water」2017 https://www.gov.bm/sites/default/files/Safe%20Water%20-%202017.pdf ／ 計画局「Proper Maintenance of Tank Water Systems」https://planning.gov.bm/index.php/proper-maintenance-of-tank-water-systems/ （いずれも抜粋） | ✅ |
| B_MOSQUITO | 環境衛生局の蚊対策（Vector Control）は一年中島内を調べ、夏は検査を強める。タンクのオーバーフロー管に網を付けるよう呼びかけている。公衆衛生法の蚊防除規則で、所有者は敷地で蚊を発生させない義務を負う | gov.bm「Mosquito control」https://www.gov.bm/mosquito-control ／ Royal Gazette https://www.royalgazette.com/?p=224450 （抜粋） | ✅ |
| B_TANK_CALC | 保健当局が示すタンク容量の求め方：タンクの縦×横×深さ（フィート）×6.25＝ガロン | 計画局「Proper Maintenance…」／保健省「Safe Water」2017（抜粋） | ✅（1立方フィート≒6.23英ガロンと一致＝計算） |
| B_TANK_SIZE | 一般的な家のタンクの大きさ（ガロン） | 掲示板の個人の書き込み「約3万ガロン」のみ | ⚠（使わない。法定容量から計算で示すのは可＝B_LAW_CALC） |

## 2. 手入れと水質（保健当局の指針）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_ROOF_CLEAN | 保健当局は「屋根を清潔に保ち、塗装しておく」よう指導。塗り直しの前に屋根をワイヤーブラシで古い塗料やカビを落とし、漂白剤と水を半々にした液で洗う。作業中は雨水の縦管をふさぎ、汚れがタンクに入らないようにする | 保健省「Safe Water」2017 ／ 計画局「Proper Maintenance…」（抜粋） | ✅ |
| B_PAINT_FREQ | 屋根の塗り直しは「政府が2年ごとを勧める」 | The Bermudian https://www.thebermudian.com/?p=13218 （1件）。RG 誌は「3〜5年もつ」 | ⚠（保健当局の文書に年数なし。使わない） |
| B_TANK_CLEAN | タンク清掃の間隔：「法律上6年ごと」（Royal Gazette）／「5年ごと」（別資料）／保健省は「沈殿物がたまらないよう必要なだけ」 | Royal Gazette https://royalgazette.com/?p=282812 ／ bermudayp https://www.bermudayp.com/waterconservation ／ 保健省 2017 | ⚠（資料で割れる。1951年規則の清掃条項は未読） |
| B_BLEACH | 保健当局は、飲み水・調理に使うタンク水の消毒を強く勧める。量の目安は1,000ガロンあたり家庭用漂白剤約4オンス（2017年指針。水が澄み、沈殿が少ない場合） | 保健省「Safe Water」2017 ／ 計画局「Proper Maintenance…」（2〜4オンス・3か月ごと）（抜粋） | ✅（「消毒を勧める」）／⚠（量は資料で 2〜4オンス、1/4カップ、1/2カップと割れる。台本で量を言わない） |
| B_ECOLI | 保健省 2017 年の指針は「バミューダの家庭のタンク水の約66％に大腸菌がいる」と書く | 保健省「Safe Water」2017（抜粋） | ⚠（出典の研究名が不明。単独） |
| B_STUDY2008 | 2008年の論文（Lévesque ほか、Canadian Journal of Microbiology 54巻6号）：選挙人名簿から無作為に選んだ102世帯のタンク水を調査。前の年にタンクを清掃した家は汚染が少なかった。著者は「微生物汚染が多く、質の高い飲み水とはみなせない」と結論 | PubMed https://www.pubmed.gov/18535637/ ／ sciencegate（DOI 10.1139/w08-038）https://next.sciencegate.app/document/10.1139/w08-038 | ✅（抄録の内容）／⚠（大腸菌の割合は抄録で未確認） |
| B_BOIL | 煮沸の指示 | 見つからない | ⚠（使わない） |
| B_TEST | 消毒後に細菌検査で効果を確かめられる。保健当局は水の検査結果の読み方の資料「Understanding Your Water Results」（2017）を出している | 保健省 2017 ／ gov.bm https://www.gov.bm/sites/default/files/Understanding%20Your%20Water%20Results%202017.pdf （抜粋） | ✅（存在と趣旨のみ） |

## 3. 法律：屋根とタンクの決まり（8ガロンと10ガロンの食い違いの解消）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_LAW_1951 | 「Public Health (Water Storage) Regulations 1951」（公衆衛生（貯水）規則）：集水面は建物の屋根の総面積の**5分の4以上**。タンク容量は**規定の集水面10平方フィートあたり100ガロン以上**。規則には集水面・タンクの構造・タンク清掃の条項がある | FAOLEX（1989年改訂版）https://faolex.fao.org/docs/pdf/ber49598.pdf ／ 国連統計部 2019 年カリコム会合「Session 3.1.3 Bermuda – Fresh water」（保健局の表）https://unstats.un.org/unsd/envstats/meetings/2019-Caricom%20Region/documents/Session%203.1.3%20Bermuda%20-%20Fresh%20water.pdf ／ Royal Gazette https://royalgazette.com/?p=256782 | ✅（3資料一致。条文本文は未読） |
| B_LAW_RESOLVE | **食い違いの解消（計算）**：集水面1平方フィートあたり10ガロン × 集水面は屋根の5分の4 ＝ **屋根全体1平方フィートあたり8ガロン**。「8ガロン/平方フィート（屋根）」と「100ガロン/10平方フィート（集水面）」は同じ規則の言い換えで、矛盾しない。Atlas Obscura の「屋根10平方フィートあたり100ガロン」は「集水面」を「屋根」と書いた不正確な要約 | B_LAW_1951 の数字から計算。8ガロン説：This Old House・The Bermudian・archdaily | ✅（計算として。台本では「屋根1平方フィートあたり8ガロン」で言い切れる） |
| B_LAW_CALC | 換算：8英ガロン/平方フィート ≒ **屋根1m²あたり約390リットル**（8×4.546÷0.0929）。集水面基準では1m²あたり約490リットル。例：屋根100m²の家なら約39トンのタンク | 計算 | ✅（計算） |
| B_LAW_RAIN | 国連会合の保健局資料：この容量規定は「バミューダの年平均降水量55.5インチ」を科学的根拠にしている | Session 3.1.3（抜粋）／検索要約 | ⚠（単独。1951年当時の平年値と思われるが未確認） |
| B_LAW_RAIN_CALC | 計算：55.5インチの雨が1平方フィートに降ると約28.8英ガロン。集水面1平方フィートあたり10ガロンのタンクは、年間雨量の約3分の1をためられる大きさ | 計算（B_LAW_RAIN が⚠なので台本では使わない） | ⚠ |
| B_LAW_BC1972 | 建築基準「Building Code 1972」の貯水の条項は「すべての貯水設備は Public Health (Water Storage) Regulations 1951 に従う」と定める。この Code は1991年の建築基準規則（BR 40/1991）で第75・76・77条を除いて廃止された | bermudalaws.bm「Building Code 1972」https://www.bermudalaws.bm/Laws/Consolidated%20Law/1972/Building%20Code%201972 ／「Building Code Regulations 1991」https://www.bermudalaws.bm/Laws/Consolidated%20Law/1991/Building%20Code%20Regulations%201991 （抜粋） | ⚠（抜粋どうしで「75〜77条が廃止」と「75〜77条以外が廃止」の読みが割れる。条文未読） |
| B_LAW_2014 | 現在の住宅は、計画局の「Bermuda Residential Building Code 2014」が適用される（Bermuda Building Code 2014 が採用） | planning.gov.bm「Plans & Policy」https://planning.gov.bm/index.php/building-codes-2026/ （抜粋） | ⚠（タンク条項は未読。集合住宅・商業ビルの規定も未確認） |
| B_LAW_STATUS | 結論：「屋根の5分の4を集水面に・集水面10平方フィートあたり100ガロン」という1951年規則の数字は✅。**いまも有効な根拠法令がどれか**は未確定 | 上記 | ⚠ → 台本は「法律で、屋根の広さに応じたタンクの大きさが決まっている。屋根1平方フィートあたり8ガロン」まで。法令名・年は言わない |

## 4. 公共の水と民間の水
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_TYNES_PHASE | タインズ・ベイ海水処理施設（デヴォンシャー教区 North Shore Road 56番地）は2段階で建設。第1期は2009年4月に完成し日量50万英ガロン。第2期で日量100万英ガロンに拡張（2系統で、一緒にも別々にも運転できる） | gov.bm 入札資料「volume 3 service information」https://www.gov.bm/sites/default/files/volume_3___service_information.pdf ／ gov.bm 入札資料「instructions to tenderers」https://www.gov.bm/sites/default/files/instructions_to_tenderers_0.pdf （抜粋） | ✅（政府入札資料2件）／⚠（別の調達告知は「日量68万英ガロン」と書き食い違う。台本は「日量最大100万ガロン級」とせず、下の実績値を使う） |
| B_TYNES_2007 | 2007年、Consolidated Water 社が政府とタインズ・ベイ逆浸透プラントの供給契約を結んだ（日量2,271m³＝0.6百万米ガロン） | Desalination 誌 https://www.desalination.com/articles/desalination-project-updates ／ cwco.com https://cwco.com/?p=1588 | ⚠（業界誌1件＋会社サイト。台本では使わない） |
| B_TYNES_2021 | 2021年7月23日の大臣声明：タインズ・ベイの逆浸透プラントは1日約75万ガロンの真水をつくり、ほぼ最大能力で運転。中央の配水はフォート・プロスペクト浄水場の生産で補っている | gov.bm「Summer Water Shortage」https://www.gov.bm/news/summer-water-shortage ／ parliament.bm 大臣声明 PDF https://www.parliament.bm/admin/uploads/ministerials/419cbafb4ccb7a4aaa349cb4fc25c8b2.pdf （抜粋） | ✅ |
| B_TYNES_WELL | 2018年6月15日、大臣（David Burch）は議会で、タインズ・ベイに3本目の取水井戸を設け、生産を日量100万ガロンに上げる計画を説明した | bernews 2018-06 https://bernews.com/2018/06/minister-david-burch-on-summer-water-plans ／ parliament.bm https://www.parliament.bm/admin/uploads/ministerials/be42de31457ef0ef556dce2bdef95722.pdf ／ Royal Gazette https://www.royalgazette.com/?p=269477 | ✅ |
| B_GOV_2018 | 2018年の大臣声明：政府の水道は約2,000の世帯・事業所と、病院（King Edward VII Memorial Hospital）、Mid-Atlantic Wellness Institute に水道管で給水し、**全世帯の3分の2にとっての安全網**（給水トラック経由）。日照りのときは約4万人の住民が給水トラックに頼る | bernews 2018-06 ／ gov.bm「Summer Water Shortage」（2021 年版も同じ数字）／ parliament.bm 声明 PDF（抜粋） | ✅ |
| B_GOV_SALES | 給水トラック業者への政府の卸売り：5月の1か月で152万英ガロン（前年同月136万英ガロン） | gov.bm「Summer Water Shortage」（抜粋） | ⚠（年が2021年か未確定） |
| B_GOV_PROD | 政府の水道は年に約2億ガロンを生産する | gov.bm「Bermuda water and sewage」https://www.gov.bm/bermuda-water-and-sewage ／ gov.bm node/13441（抜粋） | ⚠（ページの年が不明） |
| B_UN2018 | 2018年の数字（国連会合の資料）：4つの浄水プラントで年約2億6千万英ガロン、公共事業省の井戸から年約5億英ガロン、Watlington Waterworks が年約2億英ガロン | Session 3.1.3（抜粋） | ⚠（スライドの文字化けで数字の対応が不確か。単独） |
| B_LENS_DEV | 1972〜74年の地下水調査で、中央の教区の約1,660エーカーの下に大きな淡水の層「デヴォンシャー・レンズ」があると分かった | Session 3.1.3（抜粋） | ⚠（単独） |
| B_TARIFF | 政府の料金（2023年4月1日以降）：水道管・トラック業者用出口の水は**1,000英ガロンあたり29ドル**、水道は別に月15ドルの維持費 | gov.bm「Bermuda water and sewage」（抜粋・2件の検索で同じ） | ⚠（政府ページ1件。2025〜26年の改定は未確認） |
| B_BWW | 民間の Watlington Waterworks Ltd（子会社 Bermuda Waterworks Ltd、バミューダ証券取引所に上場）が水の生産・配水をする。地下水の井戸からの取水が環境当局の定める上限に達したため、海水の逆浸透プラントも運転している | BSX 監査済み財務諸表 https://bsx.com/CompanyDocuments/112/2024.12.31%20-%20Watlington%20Waterworks%20Limited%20-%20Audited%20Financial%20Statements.pdf ／ Session 3.1.3 ／ Royal Gazette https://royalgazette.com/?p=370788 | ✅ |
| B_BWW_AREA | Bermuda Waterworks の配水はデヴォンシャーから西の端（サマセット）まで、政府は東を配水（同社の担当者の説明）。顧客は約3,200 | rgmags.com https://rgmags.com/?p=15365 | ⚠（単独・年不明） |
| B_BWW_HOTEL | Watlington はバミューダのホテルの75％に給水し、残りはハミルトンの事務所と約1,000戸の住宅 | Royal Gazette https://www.royalgazette.com/?p=30866 | ⚠（単独・古い可能性） |
| B_PATCHWORK | バミューダの給水は「つぎはぎ」：民間の Bermuda Waterworks と公共事業省などが分担。政府は規制の仕組みの見直しのため2021年にコンサル（Castalia）を雇い、2022・2023年に意見募集をした | Royal Gazette 2022-09-29 https://royalgazette.com/environment/news/article/20220929/independent-regulator-for-islands-water-supply-mooted ／ 意見募集文書 2022 https://cloudfront.bernews.com/wp-content/uploads/2022/09/Bermuda-water-and-wastewater-regulatory-structure-Consultation-document.pdf ／ 同 2023 https://cloudfront.bernews.com/wp-content/uploads/2023/05/Bermuda-Water-and-Wastewater-Regulatory-Framework-Public-Consultation-Document.pdf | ✅ |
| B_BRACKISH | 多くの家が敷地に汽水の井戸を掘り、洗濯やトイレに使う | Royal Gazette（Watlington 関連記事、検索要約） | ⚠（単独） |
| B_SOUTHSIDE_RO | 東部（サウスサイド）の整備：日量20万ガロンの逆浸透プラント、新しい水道本管、セント・ジョージズの町とホテルへの下水接続、新しい下水処理施設。予算3,000万ドルのうち2,700万ドルを支出 | gov.bm 大臣声明「Commissioning of East End Water Facilities」https://www.gov.bm/news/commissioning-east-end-water-facilities ／ 印刷版 https://www.gov.bm/print/html/node/1194771 ／ Royal Gazette https://www.royalgazette.com/?p=426734 | ✅（内容）／⚠（声明の日付・稼働開始日は未確認） |

## 5. 給水トラック
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_TRUCK_120 | 2022年、バミューダ給水トラック協会（Bermuda Water Truckers Association）は1回分（1台分）の配達料を120ドルに上げると発表（2022年6月から） | bernews 2022-05 https://bernews.com/2022/05/cost-for-load-of-water-to-increase-to-120 ／ Royal Gazette https://royalgazette.com/?p=479437 （「平均約120ドル」） | ✅ |
| B_TRUCK_DEPOT | 業者が政府の出口で払う卸値は1,000ガロンあたり約25ドル | Royal Gazette https://royalgazette.com/?p=479437 （記事の日付不明） | ⚠（政府の料金表 B_TARIFF の29ドルと時期がずれる） |
| B_TRUCK_LOAD | 1台で運ぶ量（ガロン） | 見つからない | ⚠（「1,000ガロンあたりの家庭向け価格」は計算できない） |
| B_TRUCK_NUM | 業者数：協会会長 John Stovell は約52の免許と説明／別記事は「50余りの業者」 | Royal Gazette https://royalgazette.com/?p=117620 ／ https://www.royalgazette.com/?p=348559 | ⚠（どちらも日付不明・古い） |
| B_TRUCK_2WEEKS | 給水トラック協会は、タンクに常に最低1〜2週間分を残すよう勧めた（2025年2月12日） | Royal Gazette 2025-02-12 https://royalgazette.com/general/news/article/20250212/water-truckers-urge-public-to-monitor-tanks ／ bernews 2025-02 | ✅ |
| B_WAIT_2026 | 夏の日照りで、東部の住民向けの給水トラックの順番待ちが10日を超えたと業者が話した | BBC Bermuda https://bbc.bm/?p=19048 （ページ見出しの日付 2026-08-17） | ⚠（日付はサイトの表示で記事の公開日か未確定・単独） |
| B_WAIT_OLD | 過去の日照りでは、待ちが最大5日、東部の家が4〜5日水なしになったと報じられた | Royal Gazette「Residents facing lengthy delays for water」https://www.royalgazette.com/?p=348563 | ⚠（年不明） |

## 6. 2025〜2026年の出来事
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_2025_JAN | 2025年1月12日、公共事業省はタインズ・ベイに海水を送る設備の重大な故障を発表。中央の配水系の水道と給水トラック出口への供給をすぐに制限し、病院などの重要な利用者を守った | gov.bm プレスリリース https://www.gov.bm/news/water-supply-restrictions-effect-following-system-failure-tynesbay-seawater-treatment ／ 印刷版 https://www.gov.bm/print/html/node/1217161 ／ bernews 2025-01 https://bernews.com/2025/01/ministry-water-supply-restrictions-effect | ✅ |
| B_2025_FEB | 2025年2月：雨量は平年より2.52インチ少なかった。省は政府の水道利用者に、復旧まで給水トラックに注文するよう求めた。東部の業者用出口は閉鎖、タインズ・ベイも時間を大きく制限・断続的に閉鎖。民間の Bermuda Water Works が病院など重要な利用者を助けた | bernews 2025-02 https://bernews.com/2025/02/ministry-works-resolve-water-issues ／ Royal Gazette https://royalgazette.com/?p=495267 ／ Royal Gazette 2025-02-12（業者協会） | ✅ |
| B_2025_JUL | 2025年7月、公共事業・環境省（大臣 Jaché Adams）が家のタンクの残量を確かめ、空になる前に注文し、節水するよう呼びかけた | bernews 2025-07 https://bernews.com/2025/07/ministry-urges-residents-conserve-water ／ gov.bm https://www.gov.bm/news/ministry-encourages-water-conservation-and-advanced-planning-amid-dry-conditions | ✅ |
| B_2026_OUTLET | 2026年5月4日（月）午前9時、カーターズ・ベイ・ロードのサウスサイドに給水トラック用の新しい出口が開いた。24時間運用、2台同時に給水でき、日量最大2万英ガロンを出す計画。登録業者はキー（フォブ）で使う。セント・ジョージズの業者はハミルトン教区の政府採石場（Government Quarry）まで卸の水を買いに行かずに済む。大臣 Adams は「運用上の必要に直接応える常識的な投資」と述べた | bernews 2026-05 https://bernews.com/2026/05/southside-water-outlet-opens-truckers/ ／ gov.bm https://www.gov.bm/news/new-southside-water-truck-outlet-improve-service-st-georges-area ／ 印刷版 https://www.gov.bm/print/html/node/1238486 ／ Royal Gazette 2026-05-05 https://www.royalgazette.com/general/news/article/20260505/east-end-water-truckers-outlet-boosts-efficiency/ | ✅ |
| B_2022_RES | 2022年2月、300万ガロンの予備の貯水池を新設すると報じられた | Royal Gazette 2022-02-03 https://royalgazette.com/general/news/article/20220203/new-reservoir-to-give-island-3m-gallon-back-up-supply-of-water | ⚠（見出しのみ） |
| B_2026_RAIN | 2026年の雨量・公式の節水発表 | 見つからない | ⚠（公開直前に再検索） |

## 7. 1人あたりの水の使用量（比較）
| 記号 | 事実（日本語） | 出典URL（複数） | 状態 |
|---|---|---|---|
| B_USE_BMU | 1人1日の使用量は1968年の水準から下がり、2002年に約30英ガロン（約136リットル＝計算）。その後は横ばい | 政府の意見募集文書 2022 https://cloudfront.bernews.com/wp-content/uploads/2022/09/Bermuda-water-and-wastewater-regulatory-structure-Consultation-document.pdf ／ Royal Gazette https://www.royalgazette.com/?p=224348 （「1967年は7ガロン、今は約30ガロン」） | ⚠（2資料で「1967〜68年より減った」と「増えた」が逆。30ガロンだけは一致。台本は「1人1日約30ガロン＝約136リットル」も保留） |
| B_USE_TOTAL | 島民は年15.8億ガロンを使い、タンクで集めるのは約10億ガロン | 検索要約（政府系とされる資料） | ⚠（年・出典不明） |
| B_USE_US | 米国：1人1日の家庭での使用は平均88米ガロン（約333リットル） | 米環境保護庁 WaterSense https://www.epa.gov/watersense/statistics-and-facts | ⚠（単独・版で数字が変わる） |
| B_USE_JP | 日本：家庭内で1日に使う水を1人あたりに直すと約230リットル | 厚生労働省資料 https://www.mhlw.go.jp/content/11130500/001076282.pdf （抜粋） | ⚠（単独。国交省「日本の水資源の現況」で確認する） |

## 台本に使えるエピソード（✅ のみ）
1. **「8ガロン」と「10ガロン」は同じ決まり**（B_LAW_1951・B_LAW_RESOLVE・B_LAW_CALC）：屋根の5分の4を集水面にし、集水面10平方フィートごとに100ガロンのタンク。屋根全体で割ると1平方フィートあたり8ガロン＝1m²あたり約390リットル。屋根100m²の家なら約39トンの水槽を家の下に抱える計算
2. **雨の通り道を順に追う**（B_ROOF_STEP・B_ROOF_PIPE・B_OVERFLOW・B_MOSQUITO）：段で雨を遅くする → 雨どい → 縦の管 → 家の下のタンク → あふれた水は金網をかぶせた管から外へ。蚊を入れないため、政府の検査員が一年中、夏は特に念入りに見て回る
3. **屋根は「水道の取水口」なので手入れも衛生の仕事**（B_ROOF_CLEAN・B_BLEACH・B_STUDY2008）：保健当局は屋根を清潔に塗装しておき、塗り替えの前には漂白剤で洗い、そのあいだは縦管をふさげと指導。飲み水のタンク水の消毒を強く勧める。2008年の研究は無作為の102世帯を調べ、前年にタンクを掃除した家ほど汚染が少なかった
4. **公共の水は「安全網」**（B_GOV_2018・B_TYNES_2021・B_TYNES_WELL）：2018年、政府の水道管につながるのは約2,000の世帯・事業所だけ。それでも全世帯の3分の2の安全網で、日照りには約4万人がトラックの水に頼る。その元は海水を真水に変えるタインズ・ベイで、2021年にはほぼ最大能力の1日約75万ガロン
5. **2025年1〜2月の綱渡り**（B_2025_JAN・B_2025_FEB・B_TRUCK_2WEEKS）：海水を送る設備が壊れ、水道もトラック出口も制限。雨は平年より2.52インチ少なく、東部の出口は閉鎖。業者の協会は「タンクに常に1〜2週間分を」と呼びかけた
6. **2026年5月4日、東の端に新しい蛇口**（B_2026_OUTLET・B_SOUTHSIDE_RO）：24時間、2台同時、日量最大2万ガロン。セント・ジョージズの業者は島の中央の採石場まで往復せずに済むようになった
7. **トラック1台120ドル**（B_TRUCK_120）：2022年6月から、協会が1回の配達を120ドルに

## 未確認点・ブロッカー
1. **一次資料に接続できない**：faolex.fao.org・planning.gov.bm・www.gov.bm（今回 WebFetch 各1回、名前解決失敗）。前回の 01_research.md の記録どおり www.bermudalaws.bm・unstats.un.org も不可と考えられる。これらをセッションのネットワーク設定で許可するか、社長側で本文を確認する必要がある
2. **現行の根拠法令**（B_LAW_STATUS）：1951年規則が今も有効か、Building Code 1972 の第75〜77条の扱い、Residential Building Code 2014 のタンク条項、集合住宅・商業ビルの規定。数字（5分の4・10平方フィートあたり100ガロン）は一致しているので、台本は法令名を言わずに数字だけ使える
3. **「glides」・屋根の勾配・石板の厚さ・first flush**：バミューダの資料が見つからない。台本で使わない
4. **タンク清掃の間隔・塗装の間隔・漂白剤の量**：資料で割れる。保健当局の現行ページ（gov.bm／planning.gov.bm）を読むまで数字を言わない
5. **タインズ・ベイの公称能力**：100万英ガロン（入札資料2件）と68万英ガロン（別の調達告知）が食い違う。開業は第1期2009年4月まで確認、全体の完成年は未確認
6. **1人あたり使用量・比較**：バミューダの約30ガロン（2002年）は確認できるが変化の向きが資料で逆。日本・米国の数字は単独資料。比較に使うなら国交省「日本の水資源の現況」と EPA 本文を読む
7. **給水トラック**：1台の積載量、家庭向けの1,000ガロンあたり価格、現在の業者数、2026年夏の待ち日数（BBC Bermuda の日付）が未確定
8. **2026年の雨量と最新の節水発表**：見つからない。公開直前に再検索する
9. **水道管が通る地域**（ハミルトン市・ドックヤードなど）と、全世帯に占める水道管接続の割合：数字が見つからない（2018年の「約2,000世帯・事業所」のみ）。国勢調査・「2022 Environmental Statistics Compendium」https://www.gov.bm/sites/default/files/2022%20Environmental%20Statistics%20Compendium.pdf が候補（接続不可）
