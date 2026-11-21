# 出典表（企画段階）：chizu-005-bermuda-roof-water

- 確認日 2026-11-11。社長の承認（2026-11-11）は**企画まで**。台本の前にゲートA（`03_plan.md`）が必要
- 状態の記号：📄＝公式本文を自分で読んだ（WebFetch 成功）／✅＝検索結果の抜粋・二次資料で確認（複数一致）／⚠＝未確認・資料で食い違い・単独の二次資料
- **今回は 📄 が1件もない**。この環境から www.gov.bm・planning.gov.bm・www.bermudalaws.bm・faolex.fao.org・mdgs.un.org がすべて名前解決できず（WebFetch 各1回、すべて失敗）、Web 検索の抜粋で照合した。台本に進む前に、下の「未確認点・ブロッカー」の一次資料を読む
- 言い切れない話は台本に入れない（社長ルール）。⚠ の事実は台本で使わない

## 基本データ
| 記号 | 台本で使う予定の事実 | 出典（抜粋で確認） | 状態 |
|---|---|---|---|
| BMU_AREA | バミューダの面積は約53km²（資料により 53.2〜54km²） | Wikipedia「Bermuda」（53.2km²）、New World Encyclopedia、geo-ref.net（53.3km²）、WorldAtlas（54km²） https://en.wikipedia.org/wiki/Bermuda | ✅（台本は「約53km²」。政府統計の値で最終確認する） |
| BMU_POP | 2016年の国勢調査で人口 63,779人（民間・非施設の人口。法的人口は 63,917人） | 政府「2016 Census Preliminary Report」 https://www.gov.bm/sites/default/files/2016-Census-Preliminary-Report.pdf （抜粋）、Wikipedia | ✅（台本は「約6万4千人（2016年国勢調査）」。最新の推計値は未確認） |
| BMU_LOC | 北米のハッテラス岬（ノースカロライナ州）から東南東に約1,030〜1,035km の大西洋上にある | Wikipedia「Bermuda」（1,035km / 643mi）、New World Encyclopedia（1,030km / 640mi） | ✅（台本は「約1,000km」。WorldAtlas の 918km は他と合わないので採らない） |
| BMU_RAIN | 年間降水量 | climate-data.org 1,384mm（Flatts）、bermuda.com 49インチ、Bermuda Weather Service 由来とする旅行ガイド 約1,500mm、KKday 約1,680mm | ⚠（資料で 1,200〜1,680mm と割れる。気象局 weather.bm の 1991〜2020年平年値を読むまで台本で数字を使わない） |

## 水の仕組み
| 記号 | 台本で使う予定の事実 | 出典（抜粋で確認） | 状態 |
|---|---|---|---|
| BMU_NOSURFACE | 川も淡水の湖もない（池・湖は塩分を含む汽水） | Wikipedia「Architecture of Bermuda」 https://en.wikipedia.org/wiki/Architecture_of_Bermuda 、Florida Trend「Rain on the roof」 https://www.floridatrend.com/article/8867/rain-on-the-roof/ 、Island Innovation https://www.islandinnovation.co/content/news/no-rivers-no-lakes-discover-how-bermuda-built-a-400-year-old-water-system-that-still-functions | ✅ |
| BMU_LENS | 雨水は島の石灰岩にしみ込み、地下で海水の上に浮く淡水の層（淡水レンズ）になる。政府はこの地下水もくみ上げている | Florida Trend（同上） | ✅（仕組み）／⚠（「1920〜30年代に発見」は1資料のみ。台本では使わない） |
| BMU_ROOF_BUILD | 屋根は地元の石灰岩の板（slate と呼ぶ）をモルタルで重ねた階段状の形。段が雨の勢いを弱め、雨どいへ導く | This Old House「This roof resists hurricanes, collects water」 https://www.thisoldhouse.com/this-old-house/season-25/bermuda-house/this-roof-resists-hurricanes-collects-water 、The Bermudian（Peter Backeberg、repeatingislands.com 転載 https://repeatingislands.com/2022/07/14/the-bermuda-roof/ ） | ✅ |
| BMU_TANK | 雨は家の下（地下）のタンクにためる。昔のタンクは家の横の石造りの小屋に置き、石の雨どいでつないでいた | Wikipedia「Architecture of Bermuda」、enterbermuda.com https://www.enterbermuda.com/blog/how-bermuda-gets-its-water | ✅ |
| BMU_ROOF_LAW | 法律で、屋根の約80％（5分の4）を集水面にし、屋根1平方フィートあたり8ガロン（英ガロン）のタンク容量を持つことが決まっている | This Old House（80％・8ガロン）、archdaily https://www.archdaily.com/802423/how-the-white-stepped-roofs-of-bermuda-allowed-residents-to-live-without-fresh-water-sources 、FAO 法令DB の「Public Health (Water Storage) Regulations」（1951年、抜粋：「four-fifths of the total area of the roof」） https://faolex.fao.org/docs/pdf/ber49598.pdf 、Building Code 1972 / Building Code Regulations 1991（bermudalaws.bm、抜粋） | ✅（「法律で決まっている」「80％」「8ガロン」は複数一致）／⚠（**現在どの法令が根拠か**未確定：1951年規則／1972年建築基準の第75〜77条／1991年規則で何が残ったか。Atlas Obscura は「10平方フィートあたり100ガロン」と書いており食い違う） |
| BMU_ROOF_CALC | 8英ガロン/平方フィート ≒ 屋根1m²あたり約390リットル（8×4.546L÷0.0929m²＝391L）。自前の換算 | BMU_ROOF_LAW から計算 | ✅（元の数字が確定したら再計算） |
| BMU_WHITE | 白い塗装（石灰＝ライム、今はペイントも）の目的：雨水をきれいに保つ（石灰が溶けて水の pH を上げる／抗菌）・日差しを跳ね返して家を涼しく保つ | Earthwise Radio、slashgear、superscout、This Old House など二次資料のみ。保健当局の資料は見つからない | ⚠（**台本で目的を言い切らない**。保健局・計画局の公式資料を読むまで「白く塗る」という事実だけ使う） |
| BMU_PAINT | 政府は屋根の塗り直しを2年ごとに勧めている | 二次資料（検索要約）のみ | ⚠ |
| BMU_HIST | 階段状の白い屋根は17世紀の入植者から続く。1640年の Carter House の屋根が残る。BBC は「導入から400年」と報じた | superscout.co（1640年）、bernews「BBC Highlight Bermuda's Roof Water System」 https://bernews.com/2016/12/bbc-highlight-bermudas-roof-water-system | ⚠（1640年は1資料のみ。台本は「数百年前から」まで、または使わない） |
| BMU_HIST_IMG | 1809年のアクアチント「Watering tank at Tobacco Bay, Bermuda」（W. F. Wells）。19世紀初めに水をためる施設があった絵の記録 | Wellcome Collection（Commons、CC BY 4.0） https://commons.wikimedia.org/wiki/File:Watering_tank_at_Tobacco_Bay,_Bermuda._Aquatint_by_Wells,_18_Wellcome_V0020194.jpg | ✅（絵の存在と題名。何の用途の施設かは題名以上に言わない） |

## 日照り・公共の水
| 記号 | 台本で使う予定の事実 | 出典（抜粋で確認） | 状態 |
|---|---|---|---|
| BMU_TRUCK | 日照りのとき、約4万人の住民が給水トラックで水を買う | 政府ミニステリアル・ステートメント「Summer Water Shortage」 https://www.gov.bm/news/summer-water-shortage （抜粋）、bernews 2018-06「Minister Burch On Summer Water Supply Plans」 https://bernews.com/2018/06/minister-david-burch-on-summer-water-plans | ✅（数字は2018年の声明。台本は「2018年の政府の説明では約4万人」） |
| BMU_TYNES | 政府の主な水源は、海水を淡水に変えるタインズ・ベイ（Tynes Bay）の逆浸透（RO）プラント。中央の教区へ給水し、ほぼ最大能力で動いている（2018年時点） | 同上（bernews 2018-06、gov.bm） | ✅ |
| BMU_GOV_2025 | 長い日照りで、公共事業・環境省が住民に「家のタンクの残量を確かめ、早めに節水を」と呼びかけた。理由の一つは給水トラックへの負担を減らすこと（大臣 Jache Adams） | 政府プレスリリース「Ministry Encourages Water Conservation and Advanced Planning Amid Dry Conditions」 https://www.gov.bm/news/ministry-encourages-water-conservation-and-advanced-planning-amid-dry-conditions （印刷版 https://www.gov.bm/print/html/node/1225626 、抜粋）、bernews 2025-07「Ministry Urges Residents To Conserve Water」 https://bernews.com/2025/07/ministry-urges-residents-conserve-water | ✅（内容）／⚠（政府ページの発表日は未読。bernews は2025年7月） |
| BMU_2025_FAIL | 2025年2月、タインズ・ベイの取水設備が「重大なシステム故障」。雨不足・貯水池の漏れも重なり、給水トラック用の東部の出口が閉鎖、民間の Bermuda Water Works が医療施設などへ追加供給 | bernews 2025-02「Ministry Works To Resolve Water Issues」 https://bernews.com/2025/02/ministry-works-resolve-water-issues 、Royal Gazette https://royalgazette.com/?p=495267 、bernews 2025-01「Ministry: Water Supply Restrictions In Effect」 | ✅ |
| BMU_2026 | 2026年5月、セント・ジョージズなど東部向けに、給水トラック用の24時間の新しい出口（Southside）が開いた | bernews 2026-05「New Southside Water Outlet Opens For Truckers」 https://bernews.com/2026/05/southside-water-outlet-opens-truckers/ 、gov.bm 印刷版 node/1238486、Royal Gazette 2026-05-05 | ✅ |
| BMU_2026_WAIT | 夏の日照りで東部の給水トラックの待ちが10日を超えた | BBC Bermuda（bbc.bm/?p=19048、ページの日付表示 2026-08-17） | ⚠（記事の日付が未確定） |
| BMU_TRUCKERS | 給水トラック業者の団体は、タンクに常に1〜2週間分を残すよう勧めている | Royal Gazette 2025-02-12「Water truckers urge public to monitor tanks」 https://royalgazette.com/general/news/article/20250212/water-truckers-urge-public-to-monitor-tanks | ✅（抜粋1件＋見出し一致） |
| BMU_BWW | 民間の Bermuda Waterworks（旧 Watlington Waterworks）が水道管でタンクに補給：1,000ガロン 34.31ドル、トラックは約120ドル | rgmags.com https://rgmags.com/?p=15365 | ⚠（年が不明。台本では使わない） |
| BMU_SHARE | 島の淡水のうち雨水が50〜70％／住民の飲み水の90％が雨水・地下水・輸入ボトル水 | RG Construction 誌、Florida Trend（古い記事） | ⚠（資料が古く割れる。台本で割合を言わない） |

## 未確認点・ブロッカー
1. **公式サイトに接続できない**：www.gov.bm・planning.gov.bm・www.bermudalaws.bm・faolex.fao.org・mdgs.un.org（unstats.un.org も同じ資料）は、この環境の許可ドメイン外で名前解決できない。セッションのネットワーク設定でこれらを許可するか、社長側で本文を確認する必要がある
2. **タンク規定の根拠法令**（BMU_ROOF_LAW）：1951年 Public Health (Water Storage) Regulations／Building Code 1972 第75〜77条／Building Code Regulations 1991 のどれが現行か。「8ガロン/平方フィート」と「80％」の条文を読む。Atlas Obscura の「10ガロン/平方フィート」との違いを解消する
3. **白い塗装の目的**（BMU_WHITE）：保健局（Department of Health / Environmental Health）または計画局の公式資料で確認するまで、目的を台本で言わない
4. **年間降水量**（BMU_RAIN）：気象局 https://www.weather.bm/climate.asp の平年値（1991〜2020年）を読む
5. **政府の節水呼びかけの発表日**（BMU_GOV_2025）：gov.bm 本文で日付を確認する。公開直前に最新の発表（2026年）も確認する
6. **「約4万人がトラックに頼る」の年**（BMU_TRUCK）：2018年の声明と同じ数字。最新の数字があれば差し替える
7. 歴史（1640年の屋根・入植時期）は二次資料1件のみ。Bermuda National Trust などの資料で確かめるまで年号を言わない
8. 給水の割合（雨水・地下水・淡水化）の全島の数字は見つからない（2019年の国連向け資料 Session 3.1.3 が候補。接続不可）
- 台本で使わないこと：「豊かな島・資源ゼロ」の切り口（既存動画と重なる）、バミューダ・トライアングル、屋根の白さで「暑さを防ぐ」「殺菌する」の断定（⚠のため）
