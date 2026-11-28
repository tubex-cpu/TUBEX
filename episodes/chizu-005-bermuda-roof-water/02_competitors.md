# 競合調査（企画段階）：chizu-005-bermuda-roof-water

- 取得日：2026-11-11（YouTube Data API v3、`pipeline/scripts/yt_research.py --max 6 --days 3650`）。検索語：「バミューダ 屋根 雨水」「バミューダ諸島 水」「雨水 飲み水 島」「Bermuda roofs rainwater」。社長が挙げた2本（Geography By Geoff・ジオグラ）は検索に出なかったので、動画IDで再生数・長さを別に取得した
- 動画の中身は見ていない（youtube.com にこの環境から接続できない）。タイトル・再生数・長さ・サムネで判断
- サムネはリポジトリ外（スクラッチパッドの `comp_bermuda/`、`thumb_sheet.py` で一覧化）に保存して Claude が実見した。**競合画像はリポジトリに入れていない**

## 主な既存動画（テーマが近い順。長さは API の contentDetails）
| 再生数 | タイトル | チャンネル | 長さ | 公開日 | URL |
|---|---|---|---|---|---|
| 7,770,373 | Why 60,000 People Live on a Rock with Zero Resources | Geography By Geoff | 15:01 | 2026-05-19 | https://www.youtube.com/watch?v=0NVb5M7m9xg |
| 1,234,655 | Every Roof Is A Well | Terrifying Myths | 2:25 | 2026-10-20 | https://www.youtube.com/watch?v=6vmqKyPmPLc |
| 390,283 | There's No Fresh Water in Bermuda! This is How They Get Water | Nicole（旅行クリエイター） | 1:02 | 2026-06-17 | https://www.youtube.com/watch?v=JYW48yn6UEI |
| 290,439 | なぜ水源のない島で何千人も暮らせる？意外な方法で飲み水を確保する島7選【ゆっくり解説】 | ゆっくり地理の雑学大百科 | 15:56 | 2026-09-15 | https://www.youtube.com/watch?v=qyUpFj48Yw4 |
| 260,487 | The Roof That Keeps Bermuda Alive | Rare Earth | 6:28 | 2020-03-28 | https://www.youtube.com/watch?v=YF7wKayTq8o |
| 244,630 | Почему 60 000 человек живут на этой скале БЕЗ РЕСУРСОВ | ORIUS（ロシア語） | 28:04 | 2026-09-12 | https://www.youtube.com/watch?v=8P9o5P-tiOQ |
| 234,613 | なぜ約5000人も暮らせる？与論島で飲み水を確保する意外な方法【ゆっくり解説】 | ゆっくり地理の雑学大百科 | 14:57 | 2026-10-09 | https://www.youtube.com/watch?v=DQ-f4gANgqc |
| 157,454 | 川も湖もない島に6万人　雨を集めるのは白い屋根 | 建物の不思議・世界の建築 | 2:08（縦型） | 2026-09-19 | https://www.youtube.com/watch?v=qfeyWLJ2OkE |
| 88,321 | なぜこんな場所が世界有数の金持ち島になったのか？｜バミューダ諸島【ゆっくり解説】 | ジオグラ【ゆっくり雑学】 | 19:37 | 2026-06-26 | https://www.youtube.com/watch?v=0_2MU8E5PNk |
| 34,092 | Bermuda's White Roofs: 400 Years of Drinking the Sky | Terrifying Myths | 0:11 | 2025-08-30 | https://www.youtube.com/watch?v=_d2hQRhKcQ4 |
| 3,620 | Cleaning a Bermuda Water Tank (From the roof to the tank) | TK4L Productions | — | 2021-07-19 | https://www.youtube.com/watch?v=uq0-UYf9NdQ |
| 495 | Life in Bermuda: Where Every Roof Is Part of the Water Supply ｜ Documentary | Borderless travel | 19:51 | 2026-10-02 | https://www.youtube.com/watch?v=eH2njsBuBqc |
- 周辺（雨水・飲み水一般）：雨水を濾過して飲んでみた結果（水ラーメン、3,686,272回）、Rain Roof - Rainwater Harvesting Project（homesteadonomics、7,705,210回）、How to HARVEST RAINWATER from your roof（Andrew Millison、1,119,089回）、FREE Water From Your Own Roof. Why Is This Illegal in 12 States?（Lost Build Archives、117,226回）
- 検索に混ざった無関係の動画（沈没船ダイビング・バミューダトライアングル等）は除いた

## 判断
- **テーマは日本語にもある**：①「川も湖もない島に6万人　雨を集めるのは白い屋根」（2分の縦型、157,454回）＝屋根の仕組みそのもの ②ゆっくり地理の雑学大百科の「島7選」（15分、290,439回。バミューダを含むかは未確認）③ジオグラの長尺（「金持ち島」の切り口、88,321回）。英語では Geography By Geoff の「Zero Resources」（777万回）が圧倒的
- 短尺は「屋根で雨を集める」で終わり、長尺は「資源ゼロ・金持ち島」の切り口。**「屋根→タンク→法律→日照り→トラック→海水の淡水化」と、1滴の水の行き先を最後まで追う日本語の動画は見つからなかった**
- 差別化：
  1. 「資源ゼロ／お金持ちの島」の切り口を使わず、**1軒の家の水の流れ**を断面図で追う（屋根の段→雨どい→地下タンク）
  2. **法律が決めるタンクの大きさを自前の換算（屋根1m²あたり約390L ※根拠法令の確認後）で図にする**。短尺は数字まで出していない
  3. **「雨が降らないと何が起きるか」**＝給水トラック・海水の淡水化プラント・政府の節水呼びかけ（2025〜2026年）まで地図で示す。屋根の美談で終わらせない
  4. 島の地図（Natural Earth＋自作）で、北米からの距離・島の小ささ・淡水化プラントと給水トラックの出口の位置を示す

## 競合サムネ分析（Claude が実見した 12 本。`thumb_sheet.py` の一覧で確認）
| # | 動画（再生数） | 文言・字数 | 書体・フチ | 配色 | 構図 | 訴求の型 |
|---|---|---|---|---|---|---|
| 1 | Geoff「Zero Resources」(7.77M) | WHY? ／60,000 PEOPLE LIVE HERE（2行） | 極太サンセリフ白字・黒帯 | 黄色の陸地×濃紺の海 | 北大西洋の地図、島を赤丸と矢印で示す | 地図で「ここに？」＋人数 |
| 2 | Terrifying Myths「Every Roof Is A Well」(1.23M) | EVERY HOUSE IN BERMUDA DRINKS FROM ITS OWN ROOF | 黄色の極太コンデンス・黒フチ | ターコイズの海×白い屋根 | 縦型。白い階段屋根から水が丸いタンクへ流れ落ちる（生成画像風） | 仕組みの「見える化」＋意外な事実 |
| 3 | ゆっくり地理「島7選」(290K) | 川も湖もない ／水はどこから？ | 白字黒フチ（上）・黄色の極太＋黒フチ（下） | 青い海×緑の島の空撮 | 島を真上から斜めに見た空撮、上下に文字 | 「ない」の提示＋疑問形 |
| 4 | Rare Earth「The Roof That Keeps Bermuda Alive」(260K) | RARE EARTH（チャンネル名のみ） | 白の極太・影 | 白い屋根×青い入り江 | 階段屋根の実写アップ | 主役の実写の質感だけで勝負 |
| 5 | ORIUS（ロシア語）(245K) | 文字なし・赤い矢印 | — | 荒れた海×岩の島（生成画像風） | 断崖の島に赤矢印 | 「こんな場所に人が？」 |
| 6 | ゆっくり地理「与論島」(235K) | 山も川もない ／水はどこから？ | #3 と同じ | 同上 | 同上（シリーズ型） | 「ない」＋疑問形の型を量産 |
| 7 | 建物の不思議「白い屋根」(157K) | 川も湖もない島（縦書き風2行）／白い屋根が雨を集める | 細めの白字・小さい | 白い家並み×緑 | 縦型、家並みの実写 | 説明型（答えを先に言う） |
| 8 | Lost Build Archives「Illegal in 12 States?」(117K) | 文字なし | — | 嵐の夜・暗い青×光る水 | 家の断面：屋根→パイプ→地下の光る水槽 | 断面図で「地下に水」を見せる |
| 9 | ジオグラ「金持ち島」(88K) | 世界一物価が高い島 ／バミューダ | 明朝系の白字・黒フチ | 暗い宇宙×青い地球 | 地球儀に赤丸＋矢印 | 地球儀で場所＋最上級 |
| 10 | Terrifying Myths「400 Years」(34K) | 長文の説明（字幕） | 細い白字・黒帯 | 白い教会×緑 | 縦型、白い階段屋根の建物 | 説明文で事実を見せる |
| 11 | InfinityFeel「Did you know…」(6K) | Over 400 years ago, they introduced white-stepped roofs to houses | 細い白字・黒帯 | 白い屋根×緑の煙突×海 | 縦型、屋根のアップ | 雑学の説明型 |
| 12 | Borderless travel「Documentary」(495) | 文字なし・赤い矢印 | — | 衛星地図の青×実写の白い家 | 左に地図の丸印、右に白い家の写真 | 地図→実写の対比 |
- 参考（周辺）：水ラーメン「雨水を濾過して飲んでみた」(3.69M) は顔なし・手元の実写＋白字の短い文、GENKI LABO (726K) は6分割の写真＋黄色の極太文字

### 共通の勝ちパターン
1. **「ない」を先に言い、疑問で閉じる**：「川も湖もない」「水はどこから？」（#3・#6・#7）。答えを書かない方（#3・#6）が再生数が多い
2. **地図で場所を示し、意外性を足す**：北大西洋の地図や地球儀に赤丸・矢印（#1・#9・#12）。最大の #1 は地図＋人数
3. **主役は白い階段屋根の質感**：実写のアップ（#4）や、屋根→タンクに水が流れる見える化（#2）。白×青の高コントラスト
4. **断面で「地下に水」を見せる**：家の下に光る水槽（#8）、屋根から丸いタンク（#2）
5. 文字は極太＋黒フチ、黄色か白（#1・#2・#3）。説明文が長いもの（#7・#10・#11）は伸びていない

### 差別化の余地
1. **屋根→地下タンクを1枚の断面で見せ、問いは「屋根から飲み水？」の5字＋α** にする。日本語の競合は「川も湖もない／水はどこから？」の型で、**屋根そのものを飲み水と結びつける疑問形**はない
2. 「資源ゼロ」「金持ち」「6万人」を使わない（#1・#5・#9 と重ならない）
3. 生成画像風の派手な島（#2・#5）ではなく、**実写の白い屋根＋自作の断面図**で「地球の事情」の学術的なトーンにする（入口は神秘的・学術的、CLAUDE.md のサムネ基準）
4. 縦型短尺（#2・#7）が答えを言ってしまう一方、本作は答え（タンク・法律・日照り）を本編で回収する
