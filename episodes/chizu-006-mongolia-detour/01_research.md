# 出典表（企画段階）：chizu-006-mongolia-detour

- 確認日 2026-11-11。社長は 2026-11-11 に**企画まで**進めることを承認した（ゲートA は `03_plan.md` で別に必要）
- この環境では公式サイトの本文を開けない。WebFetch は openjicareport.jica.go.jp・en.wikipedia.org・montsame.mn・documents1.worldbank.org のどれも名前解決に失敗し、curl は proxy に CONNECT 403 で拒否された。そのため下の表は**Web 検索の抜粋**で照合した
- 状態の記号：📄＝公式の本文を自分で読んだ ／ ✅＝抜粋・二次資料のみで確認 ／ ⚠＝未確認・資料で食い違いあり ／ ⏳＝ブロッカーで確認できていない
- 今回 📄 は**0件**。✅ は台本の前に公式本文で読み直す。⚠・⏳ は台本で言い切らない（社長ルール「言い切れない話は外す」）

## 1. 人口・行政区分
| 記号 | 台本で使う予定の事実 | 出典（URL） | 状態 |
|---|---|---|---|
| POP_2020 | 2020年の国勢調査でモンゴルの人口は 3,296,866人。人口の46%が首都ウランバートルに住む | Montsame「Mongolia's population totals 3,296,866, latest census shows」https://montsame.mn/en/read/228310 （抜粋） | ✅（本文未読。台本は「2020年の国勢調査で46%」とだけ言う） |
| POP_UN | ウランバートル 1,682,636人、全人口の 47.31%（国連の世界人口推計 2024年版にもとづく推計） | World Population Review https://worldpopulationreview.com/countries/mongolia （抜粋） | ⚠（推計・二次資料。台本には使わない） |
| POP_NAT_2024 | モンゴルの人口は 2024年12月時点で約350万人 | CEIC https://www.ceicdata.com/en/indicator/mongolia/population 、Trading Economics https://tradingeconomics.com/mongolia/population （抜粋） | ✅（二次資料。統計局 1212.mn は未確認） |
| POP_UB_2024 | ウランバートルの人口は 2024年に170万人に達した | news.mn https://news.mn/en/?p=800786 （抜粋） | ⚠（統計局の数値は未確認。2024年の「首都の割合」は**言い切らない**） |
| KHOROO | ウランバートルは9つの区（düüreg）に分かれ、区の下に 204 のホローがある | news.mn（2024）https://news.mn/en/?p=800786 、Wikipedia「Districts of Ulaanbaatar」が引く Montsame「The capital city has 204 khoroos」（2021）https://en.wikipedia.org/wiki/Districts_of_Ulaanbaatar （抜粋） | ✅（区ごとのホロー数は資料で食い違うので使わない） |

## 2. ゲル地区
| 記号 | 事実 | 出典 | 状態 |
|---|---|---|---|
| GER_SHARE | ゲル地区に約80万人、市の人口の約60% | The Asia Foundation https://asiafoundation.org/?p=50048 、ADB の文書（抜粋） | ⚠（年が不明。別の ADB 資料は「半分」、UN-Habitat https://unhabitat.org/mongolia は「基本サービスが不十分なゲル地区に54.4%」。資料により50〜66%と幅がある。台本は確定するまで「市民の半分以上」とも言わない） |
| GER_DEF | 「ゲル地区」は住宅地の種類の名前で、住民全員がゲル（移動式住居）に住むわけではない（木造の家も多い） | Wikipedia「Ger district」https://en.wikipedia.org/wiki/Ger_district （抜粋。2009年の数字にもとづく「ゲルに住むのは約43%」） | ⚠（定義の説明だけに使う。43%は古いので使わない） |
| GER_PAVED | ゲル地区の道路で舗装されているのは10%だけ | The Asia Foundation https://asiafoundation.org/?p=50048 （抜粋） | ⚠（1資料のみ・年不明。世界銀行の文書での裏付けは見つからない） |
| GER_UNSURF | ゲル地区には舗装道路と街灯が普通はない。交通量が少なく建設費が高いので、舗装は費用に見合わないとされる | ADB の文書 https://www.adb.org/sites/default/files/linked-documents/41192-01-mon-ssa.pdf （抜粋） | ✅（抜粋。本文の該当ページは未確認） |
| GER_BUS | バスは国道の基準でつくられた道路しか走らないことが多く、ゲル地区にはその道路が少ないので、バスの便がとても限られる | Sustainability 誌 2021「Social Sustainability and Ulaanbaatar's 'Ger Districts': Access and Mobility Issues and Opportunities」https://doi.org/10.3390/su132011470 （抜粋） | ✅ |

## 3. 道路網・車の数
| 記号 | 事実 | 出典 | 状態 |
|---|---|---|---|
| ROAD_1100 | ウランバートルの道路網は約1,100km。まばらで、つながっておらず、幹線・補助線のはっきりした階層がない | 世界銀行「Ulaanbaatar Sustainable Urban Transport Project (P174007)」Project Information Document（2021）https://documents1.worldbank.org/curated/en/708891618997774951/pdf/Project-Information-Document-Ulaanbaatar-Sustainable-Urban-Transport-Project-P174007.pdf 、世界銀行プレスリリース 2021-06-23 https://www.worldbank.org/en/news/press-release/2021/06/23/world-bank-to-support-sustainable-urban-transport-in-ulaanbaatar （抜粋） | ✅（1,100km がすべて舗装道路かは GFDRR の記事と表現が違うので言わない） |
| VEH_GROWTH | 2000年から2019年に、車の登録台数は13.4倍になったが、市街の道路網は2.5倍しか伸びなかった | ADB 55245-001 の文書 https://ewsdata.rightsindevelopment.org/files/documents/01/ADB-55245-001.pdf （抜粋） | ✅（1資料のみ。台本の前に本文で年と定義を確かめる） |
| MOTOR_2019 | 2019年時点で人口1,000人あたり392台 | 世界銀行の文書（抜粋。どの文書か特定できていない） | ⚠（使わない） |
| MP_1975 | 道路網は1975年の基本計画でつくられ、その後35年ほど改良が少なかった | JICA の地下鉄構想の調査（抜粋。報告書番号を特定できていない） | ⚠（使わない） |

## 4. 渋滞と対策
| 記号 | 事実 | 出典 | 状態 |
|---|---|---|---|
| CONG_LAW | モンゴルの法律は、渋滞を「幹線道路の平均速度が時速20kmを下回り、車列が伸びる状態が続くこと」と定めている。ナンバーの上限は車の増加・道路網の密度・渋滞を考えて決める | legalinfo.mn（2024-07-10 の非公式英訳）https://legalinfo.mn/en/edtl/17333370591751 （抜粋） | ✅（法律名・条番号は本文で確認する） |
| PLATE_CAP | 2024年2月8日、ウランバートル市議会が決議第18号で、市のナンバーの登録台数の上限を73万台とした。上限はすでに超えており、2024年11月8日から、輸入した車に市のナンバーを新しく出さなくなった | ikon.mn https://ikon.mn/n/39m0 、The UB Post https://theubposts.com/a/13121 、Mongolia Weekly https://www.mongoliaweekly.org/post/will-license-plate-limits-solve-ulaanbaatar-s-traffic-congestion （抜粋） | ✅（上限を超えた台数は 78.5万／80万超と資料で違うので、台本は「上限を超えた」まで） |
| PLATE_10Y | 2025年6月1日から、製造から10年を超えた車には市のナンバーを出さない | ikon.mn https://ikon.mn/n/3bx6 、Asia News Network https://asianews.network/?p=202626 （抜粋） | ✅ |
| PLATE_WEEKLY | 平日は、ナンバーの末尾の数字ごとに週1日、市の中心部を走れない日がある（ふだんの週ごとの規制） | The UB Post https://www.ubpost.mn/a/13574 （2025-09）（抜粋） | ✅（曜日と数字の対応・時間帯（8〜20時／7〜21時）は資料で違うので言わない） |
| ODD_EVEN_2025 | 2025年8月下旬〜9月中旬、新学期の前に、ナンバー末尾の奇数・偶数で走れる日を分ける規制を行った（8時〜20時） | GOGO Mongolia https://mongolia.gogo.mn/r/xm5eo 、The UB Post https://www.ubpost.mn/a/13555 ・https://www.ubpost.mn/a/13574 （抜粋） | ✅（開始・終了日は 8/27〜9/16 と 8/28〜9/20 で記事により違う。台本は「2025年8月下旬から9月中旬」） |
| PLAN_2LEVEL | 市は2024〜2028年に二層の道路を段階的に建設し、信号のない環状道路の実現可能性調査を2025年に行う | 在トルコ・モンゴル大使館のニュース https://www.mongolianembassy.com.tr/hbr_975_mayor-nyambaatar-all-future-construction-in-ulaanbaatar-will-prioritize-alleviating-traffic-congestion （抜粋） | ⚠（計画の現況は未確認。使うなら公開前に最新を確認） |

## 5. 実例の図（JICA 2022）
| 記号 | 事実 | 出典 | 状態 |
|---|---|---|---|
| JICA_FIG324 | 報告書 p.3-15（PDF 111ページ）の Figure 3.24 に、近い目的地へ車が遠回りしなければならない実例がある（社長側の情報） | JICA https://openjicareport.jica.go.jp/pdf/12367579.pdf | ⏳（**開けなかった**。図の中身・場所・距離は一切書かない） |
| JICA_ID | 同じ時期の JICA 報告書 12367587 は「Data Collection Study on Transportation Infrastructure Development in Ulaanbaatar, Mongolia: Final Report」（2022年3月、株式会社アルメック・CTI エンジニアリング・インターナショナル） | https://openjicareport.jica.go.jp/700/700/700_115_12367587.html （検索の抜粋） | ⚠（12367579 と同じ調査の別冊かは未確認。12367579.pdf の URL は検索結果に出るので、ファイル自体は存在する） |

## 地図・素材の見込み
- 街区レベルの地図には OpenStreetMap のデータが要る（ODbL。動画内と概要欄に「© OpenStreetMap contributors」を表示する）。**この環境からは取得できない**（下のブロッカー）
- 国全体の地図：Natural Earth（chizu-001 以来の方針）。衛星画像は使わない
- 実写：Wikimedia Commons のゲル地区・渋滞・市街の写真（PD／CC0／CC BY のみ。CC BY-SA は使わない＝チャンネルの方針）。作者・ライセンスは台本の後に `06c` 系の資料で確認する

## 未確認点・ブロッカー
1. **JICA Figure 3.24 が読めない**：`curl -sS -L -o <scratchpad>/jica/jica.pdf https://openjicareport.jica.go.jp/pdf/12367579.pdf` は proxy が CONNECT 403 で拒否。WebFetch は `getaddrinfo ENOTFOUND openjicareport.jica.go.jp`（セッションの許可ドメイン外）。Web 検索でも「Figure 3.24」の本文抜粋は見つからない。→ 図の場所・遠回りの経路・距離・図の題名はすべて**未確認**。解決には ①環境の許可ホストに openjicareport.jica.go.jp を追加する、または ②社長が PDF を Drive に置く、のどちらか
2. **遠回りが今も必要か（未確認）**：2022年の報告書の図は 2022年時点の状況。その後に道路・出入口ができた可能性を否定できない。現在の状況を示す出典はない
3. **最短の合法ルート・距離・所要時間（未確認）**：一方通行・右左折禁止・私有地（集合住宅の敷地の門）を含めた最短の合法ルートは確かめていない。距離・時間は**一切書かない**。書くときは「OpenStreetMap のデータ（取得日○年○月○日）から当チャンネルが計算」と明記する
4. **OpenStreetMap 系が使えない**：2026-11-11 に overpass-api.de・tile.openstreetmap.org・api.openstreetmap.org・router.project-osrm.org をすべて試し、どれも proxy が CONNECT 403 で拒否した。経路の計算も地図の作成もこの環境では不可。解決には環境の許可ホストに overpass-api.de（データ）と、必要なら経路計算用のホストを追加する。OSRM の公開デモサーバーは利用規約上、大量・商用の利用を想定していないので、計算は Overpass で取ったデータを手元で解析する方式を推す
5. 2024年以降のウランバートルの人口の割合（統計局の公式値）は見つからない。台本は 2020年の国勢調査（46%）で言う
6. ゲル地区の人口の割合は資料で 50〜66% と幅がある。年と定義をそろえた一次資料で確かめるまで台本に入れない
7. 公式本文（世界銀行・ADB・legalinfo.mn・Montsame）はどれも開けていない。✅ はすべて抜粋による
