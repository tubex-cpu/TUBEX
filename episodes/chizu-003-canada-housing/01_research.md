# 出典表（企画段階）：chizu-003-canada-housing

- 確認日 2026-11-11。記号：📄＝公式本文を自分で読んだ（WebFetch 成功）／✅＝検索結果の抜粋・二次資料で確認（複数一致、または公式ページの抜粋）／⚠＝未確認・単一の二次資料のみ・資料により食い違い
- **今回 📄 は 0 件**。この環境から次のホストに接続できない（名前解決エラー＝ネットワーク設定の許可外）：`www.cmhc-schl.gc.ca`・`assets.cmhc-schl.gc.ca`・`www150.statcan.gc.ca`・`www.statcan.gc.ca`・`publications.gc.ca`・`www.toronto.ca`。以下はすべて Web 検索の抜粋による
- 言い切れない話は台本に入れない（社長ルール）。⚠ は台本の前に一次資料で確かめるか、外す
- 本作の筋：**地理は「人が住める場所」を説明するが、住宅不足は「人がいる場所でどれだけ建てられるか」の問題**。地理だけで住宅不足を説明しない

## 1. 国の広さと人の分布（ズームの起点）
| 記号 | 台本で使う予定の事実 | 出典（抜粋で確認） | 状態 |
|---|---|---|---|
| CAN_AREA | カナダの総面積は 9,984,670 km²（うち淡水 891,163 km²）。総面積で世界2位 | Statistics Canada「Canada Year Book 2012 – Geography / International perspective」https://www150.statcan.gc.ca/n1/pub/11-402-x/2012000/chap/geo/geo01-eng.htm 、CIA World Factbook（同じ総面積） | ✅ |
| CAN_LANDRANK | 陸地面積だけで比べると世界4位（淡水湖の割合が大きいため） | Wikipedia「Geography of Canada」 | ⚠（二次資料のみ。台本で使うなら一次で確認） |
| JPN_AREA | 日本の国土面積は 377,980.29 km²（2025年7月1日時点）。→ カナダの総面積は日本の約26倍（9,984,670 ÷ 377,980 ≒ 26.4） | 国土地理院「令和7年7月1日時点の全国都道府県市区町村別面積を公表」https://www.gsi.go.jp/kihonjohochousa/kihonjohochousa61016.html | ✅（比率は自分で計算） |
| CAN_POP21 | 2021年国勢調査の人口 36,991,981 人、陸地面積 8,788,702.80 km²、人口密度 1 km² あたり 4.2 人 | Statistics Canada「Census Profile, 2021 Census of Population」https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/index.cfm | ✅ |
| CAN_BORDER100 | 2021年、カナダ人の3人に2人（66%）が、アメリカとの南の国境から 100 km 以内に住んでいた（アラスカとの国境は含まない） | Statistics Canada「Canada and the United States: by the numbers」https://www.statcan.gc.ca/o1/en/plus/3250-canada-and-united-states-numbers-unique-relationship （抜粋）、Press Herald のファクトチェック https://www.pressherald.com/?p=7719566 。2016年国勢調査の公表（The Daily 2017-02-08）https://www150.statcan.gc.ca/n1/daily-quotidien/170208/dq170208a-eng.htm も同じ66%とする二次資料あり | ✅（台本は「2021年、3人に2人が南の国境から100km以内」） |
| CAN_BORDER4PCT | その 100 km の帯は国土の約4%にあたる | 2016年の The Daily の文言とする引用のみ。抜粋では見つからない | ⚠（**使わない**。一次で確認できたら追加） |
| CAN_BORDER160 | 100マイル（約161km）で数えると76%（アラスカとの国境も含む） | Statistics Canada 広報担当がメールで回答（Press Herald） | ⚠（定義が違うので66%と混ぜない。台本では使わない） |
| CAN_90PCT | 「90%が国境から100マイル以内」という俗説 | GeoCurrents が「根拠が疑わしい」と指摘 | ⚠（**誤り扱い。使わない**） |
| CAN_GROW23 | 2023年の人口増加率は 3.2%で、1957年以来の高さ。増加の多くは一時滞在者（非永住者）による | CBC「Statistics Canada says population growth rate in 2023 was highest since 1957」https://www.cbc.ca/lite/story/1.7157233 、Statistics Canada The Daily 2024-03-27 https://www150.statcan.gc.ca/daily-quotidien/240327/dq240327c-eng.htm （抜粋） | ✅ |

## 2. どれだけ足りないか（CMHC の住宅供給ギャップ推計）
| 記号 | 台本で使う予定の事実 | 出典（抜粋で確認） | 状態 |
|---|---|---|---|
| CMHC_GAP23 | 2023年9月の更新：手ごろな価格を取り戻すには、2030年までに、すでに建つ見込みの分とは別に約350万戸が必要 | CMHC ニュースリリース「Update on Canada's housing supply shortages」(2023) https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2023/update-canada-housing-supply-shortages 、CBC https://www.cbc.ca/lite/story/1.6965250 、CTV | ✅ |
| CMHC_GAP25 | 2025年6月の報告：2019年の手ごろさに戻すには、2035年まで毎年 43万〜48万戸の新築が必要（10年で最大約480万戸）。今のペースの見込みは年約24.5万戸 → **建設のペースを約2倍にする必要** | CMHC ニュースリリース「CMHC releases latest housing supply gaps report」(2025) https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2025/cmhc-releases-latest-housing-supply-gaps-report 、CBC https://www.cbc.ca/lite/story/1.7565525 、BNN Bloomberg、Global News | ✅ |
| CMHC_GAP25_EFFECT | 同報告：それが実現すれば、2035年の住宅価格は何もしない場合より約4分の1低く、家賃は約5%低い | 同上（BNN Bloomberg、advisor.ca の抜粋） | ✅ |
| CMHC_GAP25_2030 | 2030年という目標は、用途地域の承認や建設に時間がかかるため非現実的として、10年先を見る方式に切り替えた | 同上（抜粋） | ✅ |
| CMHC_GAP26 | 最新の更新では年 41.7万〜46.9万戸、期限は2036年に移った | investmentexecutive.com の見出しと抜粋のみ | ⚠（発表日・本文が未確認。**台本は CMHC_GAP25 を使う**。公開前に最新版を確認） |
| PBO_GAP | 議会予算官（PBO）は別の方法で、2035年までに純増320万戸が必要と推計 | mpamag.com | ⚠（使うなら一次で確認。数字の定義が CMHC と違うので並べない） |

## 3. 地理は「どこに住めるか」を決める（ただし原因の一部）
| 記号 | 台本で使う予定の事実 | 出典（抜粋で確認） | 状態 |
|---|---|---|---|
| CMHC_US26 | 2026年5月の CMHC の分析：2006〜2024年にカナダの住宅供給がアメリカ並みに需要へ反応していたら、住宅価格は約10%低かった。原因として**地理・用途地域の規制・人口構成**を挙げ、地理の例として「バンクーバーやモントリオールは山や水辺が建設を制約する」 | CMHC Housing Observer「Supplying smarter: learning to make housing supply more responsive」(2026) https://www.cmhc-schl.gc.ca/observer/2026/supplying-smarter-learning-to-make-housing-supply-more-responsive 、mpamag.com、law360.ca、Canadian Press 配信記事 | ✅（10%と原因の3つ） |
| CMHC_US26_30 | 同分析：建つ家は約30%多かった | 同上 | ⚠（「着工数」か「住宅ストック」か、記事で表現が割れる。一次で確認するまで**数字は使わない**） |

## 4. 人がいる場所で、建ててよい量を決めるもの（規制・承認）
| 記号 | 台本で使う予定の事実 | 出典（抜粋で確認） | 状態 |
|---|---|---|---|
| CMHC_REG | CMHC の研究「Breaking ground, breaking barriers: Land use regulations and the impact on housing in Canada」：①土地利用の規制が厳しい都市ほど住宅が手ごろでない（都市の規模・成長・密度・所得を考慮しても）②規制は住宅供給の伸びを遅くする ③建て増し（用途地域の変更）の需要がいちばん強い地域ほど、承認率が低い（とくに高い市場） | CMHC 研究ページ https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/housing-research/research-reports/accelerate-supply/land-use-regulations-impact-housing-canada 、PDF https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/housing-markets-data-and-research/housing-research/research-reports/2026/land-use-regulations-impact-housing-canada-en.pdf （いずれも抜粋）、mpamag.com「Regulatory red tape drives up Canadian home prices」 | ✅（3点の要旨。**本文は未読＝📄ではない**） |
| CMHC_REG_DATE | 同研究の公開は2026年2月 | mpamag.com・検索要約（2月11日とするものあり） | ⚠（日付は台本に入れない。「2026年」まで） |
| CMHC_REG_14 | 規制が10%厳しくなると住宅価格が約14%上がる | mpamag.com のみ | ⚠（一次で確認するまで使わない） |
| CMHC_REG_47 | バンクーバーとトロントの用途地域変更の承認率は47% | mpamag.com のみ | ⚠（同上） |
| CMHC_DELAY23 | 2022年の自治体土地利用・規制調査（CMHC と統計局）：承認にかかる時間が、地域ごとの住宅の手ごろさの差をいちばんよく説明する。トロントとバンクーバーの承認期間は、住宅が手ごろな地域の約4倍 | CMHC Housing Observer「Approval delays linked with lower housing affordability」(2023) https://www.cmhc-schl.gc.ca/observer/2023/approval-delays-linked-lower-housing-affordability 、Western Investor、BIV | ✅（CMHC 自身が「予備的な分析」としている点に注意） |
| TOR_YELLOW | トロント市の2021年の資料：市の「Neighbourhoods（住宅地）」指定の土地のうち、一戸建て専用の区域が65.0%、一戸建て＋二戸建てまでが69.3%。市全体の土地で見ると、一戸建て専用は31.5% | トロント市 都市計画・住宅委員会の背景資料 backgroundfile-173165 https://www.toronto.ca/legdocs/mmis/2021/ph/bgrd/backgroundfile-173165.pdf （抜粋）、トロント都市大学（TMU）2023年の記事「住宅用地の約7割が一戸建て・二戸建てに限られる」 | ✅（**「住宅地の約7割」と言い、「市の7割」とは言わない**。日付・表番号は一次で再確認） |
| ONT_GREENBELT | オンタリオ州のグリーンベルト：2005年に設定、トロント周辺（ゴールデン・ホースシュー）の農地・湿地・森林 200万エーカー超を開発から守る。2022年末に州が住宅用として約7,400エーカーを外したが、2023年9月21日にフォード州首相が「誤りだった」と撤回し、2023年12月6日に戻す法律が成立 | National Observer、Global News、CottageLife、Mondaq（抜粋） | ✅ |
| BC_ALR | ブリティッシュコロンビア州の農地保全区域（ALR）：1973年に設定、約460万ha、州の土地の約5% | BC 州 農地委員会（ALC）「50 Years of the Provincial Agricultural Land Commission」https://www.alc.gov.bc.ca/50-years-of-the-provincial-agricultural-land-commission 、Wikipedia「Agricultural Land Reserve」 | ✅ |
| BC_ALR_SOUTH | バンクーバーを含む南部沿岸地域は ALR の3%（148,207ha） | Wikipedia 系の抜粋のみ | ⚠（使わない） |

## 5. 建てる費用・インフラ（上下水道など）
| 記号 | 台本で使う予定の事実 | 出典（抜粋で確認） | 状態 |
|---|---|---|---|
| INFRA_FCM | カナダ自治体連合（FCM）：住宅の課題はインフラの課題でもある。580万戸を建てるのに必要な自治体インフラ（上下水道などが大きな項目）を推計 | FCM「New research: Canada's housing challenge is also an infrastructure challenge」https://fcm.ca/en/news-media/news-release/new-research-canadas-housing-challenge-also-infrastructure-challenge/backgrounder 、トロント市 backgroundfile-241443 | ⚠（金額・年が抜粋で取れていない。**台本は「家を建てるには先に水道・下水を通す必要がある」という一般的な説明だけにし、数字は一次確認後**） |
| INFRA_CHIF | 連邦の「住宅インフラ基金（Canada Housing Infrastructure Fund）」60億ドル：住宅のための上下水道・雨水などの整備を早める | ブログ（brandondonnelly.com）のみ | ⚠（公式ページで確認するまで使わない） |
| DC_CMHC26 | 開発負担金（自治体が新築にかける費用）：CMHC の2026年6月の資料で、マーカム市の2LDKマンションでは新築平均価格の約15.7%。CMHC のチーフエコノミストは「負担金をなくすだけでは危機は解決しない」 | mpamag.com、investmentexecutive.com | ⚠（二次のみ。数字は使わず、使うなら一次確認） |
| CONST_COST | 住宅の建設価格指数は2019年から3分の2以上上昇（土地代を含まない） | ICBA（建設業団体）のブログが統計局の指数を引用 | ⚠（統計局の表で確認するまで数字は使わない） |

## 6. 参考動画（題材の出どころ）
| 記号 | 内容 | 出典 | 状態 |
|---|---|---|---|
| SRC_GEOFF | Geography By Geoff「Why The World's Second Largest Country is Out of Room」2026-10-27 公開、716,171回（2026-11-11 取得）。概要欄に「使える土地はスペインやフランスに近い」 | https://www.youtube.com/watch?v=-z1Cc8vH0Go （YouTube Data API） | ✅（再生数・公開日）／「使える土地＝スペイン・フランス並み」は Geoff の主張で出典不明 ⚠ → **使わない** |

## 台本で使わないこと（現時点）
- 「国土の4%」「90%が100マイル以内」「人口の70%がこの線より南」などの数字（一次で確認できていない／誤り）
- 「家の値段が年収の○年分」（今回は出典を取っていない）
- 寒さ・移民だけで住宅不足を説明すること。移民の増加は需要側の事実（CAN_GROW23）として1回だけ出し、原因の断定はしない
- 「カナダは満員」という言い方（競合と重なるうえ、CMHC の分析は規制・承認の要因を挙げている）

## 未確認点・ブロッカー
1. **公式本文を1件も読めていない（📄 0件）**。`cmhc-schl.gc.ca`・`assets.cmhc-schl.gc.ca`・`statcan.gc.ca`（www150 / www / www12）・`publications.gc.ca`・`toronto.ca` がこのセッションのネットワーク設定で許可されていない。台本に進む前に、これらのホストを許可して CMHC_REG・CMHC_GAP25・CMHC_US26・CAN_BORDER100・TOR_YELLOW の本文を確認したい
2. CMHC_REG の具体的な数字（10%→14%、承認率47%）と公開日は二次資料のみ
3. インフラ（上下水道）の章の数字が1つも確定していない（INFRA_FCM・INFRA_CHIF）。この章は一次確認ができるまで数字なしの説明にとどめる
4. 建設費（CONST_COST）・開発負担金（DC_CMHC26）も数字未確定
5. 最新の CMHC 供給ギャップ（CMHC_GAP26、2036年まで）の発表日と本文。公開直前に最新版へ差し替えるか判断する
6. 地図素材の範囲（Natural Earth の国境・州境、トロントの用途地域図を自作する場合はトロント市オープンデータのライセンス確認）は台本の後
