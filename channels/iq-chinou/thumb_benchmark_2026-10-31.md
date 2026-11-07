# 競合3チャンネルのサムネ分析（2026-10-31・Claude が全枚実見）

社長指定の3チャンネル（考えすぎる葦・深淵回廊・脳内研究室）の直近の投稿（最大50本）について、サムネ107枚をすべて実見した。
- 取得：`python3 pipeline/scripts/yt_channel.py <3チャンネル> --max 50 --thumbs-dir <リポジトリ外>` → `python3 pipeline/scripts/thumb_sheet.py <保存先>`。画像はリポジトリに入れていない。
- 数字はすべて YouTube Data API v3（取得日 2026-10-31）。全動画の表は末尾の「付録：取得データ」。
- 「当たり」は 再生数÷登録者数 で比べた（チャンネルの規模の差をならすため）。ショート動画は分けて扱う。
- 限界：CTR・インプレッション数は公開されておらず不明。再生数はテーマ・タイトル・公開からの日数の影響も受けるため、下の勝ちパターンは「サムネだけの効果」ではなく傾向。

## 1. チャンネル別

### 考えすぎる葦（@kangaesugiruashi）登録者150,000・2026-01開設・長尺のみ（16〜26分）
| | 当たり（再生数/登録者 1.3以上） | 外れ（0.3以下） |
|---|---|---|
| 例 | 色気とは何か？ 535,699（3.57）／ユーモアは何と相関するか？ 346,307／ノブレス・オブリージュ 271,838／センスとは何か？ 256,242／反出生主義／回避型人間／怪物の4類型／オープンマリッジ | 脳の大きさ≠知性？ 25,175（0.17）／ラブレターは誰のための道具か？ 25,094／聖地巡礼のパラドックス 23,626（0.16）／うんこのパラドックス 32,888／寝てない自慢は損？ 35,797 |
| 文字 | **概念を1語だけ**大きく（3〜9字）。上に小さく「教養としての」「〜とは何か？」 | 「〜のパラドックス」の決まった型、文章になった問い |
| 書体・配色 | 極太の明朝体、フチなし〜薄い影。黒・生成り（オフホワイト）・深紅の3色、または紺と赤 | ドット絵・ポップな黄色や水色、実写の人の顔 |
| 主役 | シルエット・ピクトグラム・彫刻風の人形。記号的で静か | 漫画調・実写・ごちゃついた背景 |
- 当たりのテーマは恋愛・性・結婚・道徳のタブー（色気／モテ／オープンマリッジ／性欲／プラトニック）。**知能（脳の大きさ≠知性？）はこのチャンネルで最下位クラス**。
- 「〜のパラドックス」型は5本中5本が 0.4 以下（58,189／43,882／40,494／32,888／23,626）。

### 深淵回廊（@深淵回廊）登録者112,000・2026-07開設・総再生17,211,827
| | 当たり | 外れ |
|---|---|---|
| 例 | IQごと視えてる世界（IQ70/100/130/160）2,772,401（24.75）／7段階の思考レベル「あなたはどの階層ですか？」1,147,666（10.25）／言語化の正体 740,062／3つの世代 視えてる世界 724,395／夢と深層心理／パラドックス／相性の正体 | 統合失調症 視えてる世界 17,682（0.16）／絶対に謝らない人の正体 25,579／男女は分かり合えないのか？ 35,056／父親の威厳 43,970／心理学のズルい裏技（企業ロゴ5つ）45,785 |
| 文字 | 下の帯に**極太ゴシック＋太い黒フチ**、黄・白・赤。「〜の正体」「視えてる世界」「あなたはどの〇〇？」 | 型は当たりと同じ（文字だけでは差がつかない） |
| 構図 | **人を横に並べて段階・比較を見せる**（IQ70→160の4人＋光る脳、色の違う頭7つ、通常の人と言語化がうまい人の左右比較） | 叫ぶ顔・怯える顔のアップ、ブランドロゴの並び、年代の比較 |
| 主役 | リアル寄りの人物（画像生成風）＋光る脳 | 病気・障害を怖く見せる顔 |
- ショートの最高は「IQ低い人に視えてる世界」3,323,361（29.67）。長尺でも1位は IQ。**IQの「段階を並べる」型が最強**。
- 一方、病気・障害の当事者を怖く描くサムネは最下位に集中（統合失調症・自己愛・発達障害）。

### 脳内研究室（@脳内研究室）登録者14,000・2026-10-05開設・長尺7本のみ
| 再生数（再生数/登録者） | サムネ |
|---|---|
| 1,222,547（87.32） | 頭の中に映像が／見える人 見えない人／決定的違い（左右比較） |
| 881,239（62.95） | あなたはどのタイプ？ 2色型・3色型・4色型（3人並び）／4色型色覚の世界 |
| 138,399（9.89） | 何度も読む人／すぐ覚える人／記憶力の正体 |
| 92,325（6.59） | この中に1つ、おとりがある。S/M/L の値段／あなたはどれ？ |
| 17,710／6,667／4,713 | ショート動画を見続けると…／なぜシャワーでひらめく？／恋すると脳はこうなる |
- 見た目は**深淵回廊の型とほぼ同じ**（漫画とリアルの中間の男性イラスト、左右比較、下の黒帯に黄色の極太文字）。当たりと外れで見た目の差はほとんどない。
- 差は題材：当たり2本は「**人によって見えている世界が本当に違う**（頭の中の映像・色の見え方）＋自分はどっち？」。外れ3本は誰にでも起きる一般論（シャワー・恋・ショート動画）。開設1か月で登録者14,000。

## 2. 3チャンネル共通の勝ちパターン（5本以上で確認）
1. **「人によって見えている世界が違う」を、人を並べて見せる**：IQ70〜160／7段階／3世代／2〜4色型／見える人・見えない人。サムネだけで「違い」が一瞬で分かる。
2. **「あなたはどれ？」で視聴者を自分の診断に巻き込む**：どの階層ですか？／どのタイプ？／あなたはどれ？。答え（自分の位置）は本編を見ないと分からない。
3. **主文言は短い1語〜1句を一番大きく**：深淵・脳内は下の帯に極太ゴシック、葦は中央に極太の明朝。どちらも320px幅で一瞬で読める。
4. **〜の正体／〜とは何か？**：言葉の定義を問い直す型（言語化の正体・相性の正体・記憶力の正体／色気とは何か？・センスとは何か？）。

## 3. 外れに共通すること
- 決まった型の繰り返し（葦の「〜のパラドックス」）。
- 病気・障害の当事者を怖く描く（深淵の統合失調症・自己愛）。視聴者が自分を重ねられない。
- 誰にでも起きる一般論（脳内のシャワー・恋）。「自分はどっち？」が起きない。
- 見た目を変えても題材が弱いと伸びない（脳内研究室は全7本ほぼ同じ見た目で、再生数は4,713〜1,222,547）。

## 4. IQ・知能チャンネルへの示唆（差別化の候補。決定ではない・社長のゲート0判断の材料）
1. **見た目で差別化できる余地**：深淵回廊と脳内研究室は同じ「派手な漫画調＋黄色の極太文字」で、すでに埋まっている。葦の「暗い・静か・明朝」は教養寄りで知能テーマでは弱い。**暗い背景と局所光、学術的な質感で「段階を並べる」型を見せる**のは、どちらとも違う並びになる（`CLAUDE.md` のサムネのトーン「神秘的・学術的」と一致）。
2. **見下さない比較**：IQ70を下に見る描き方には、競合のコメントで抵抗が出ている（`channels/iq-chinou/00_concept.md`「## 5. 視聴者の声」77行目）。外れの傾向（当事者を怖く描く）とも重なる。**「違い」を優劣でなく“見え方の違い”として並べる**と、勝ちパターン1・2を使いつつ差別化できる。
3. 題材は「自分はどっち？」と確かめたくなる、**人によって違う知覚・認知**（脳内研究室の当たり2本の型）。具体的な題材は出典の確認が必要なので、企画工程で `01_research.md` を作ってから決める。

## 付録：取得データ（2026-10-31・YouTube Data API v3）
### 考えすぎる葦（@kangaesugiruashi）

登録者 150,000／総再生 13,991,916／動画数 133／開設 2026-01-28／https://www.youtube.com/channel/UCwkAl3Fxd69mDEcQjX7NZsQ

| 再生数 | 再生数/登録者 | タイトル | 公開日 | 尺 | サムネURL | 動画URL |
|---|---|---|---|---|---|---|
| 535,699 | 3.57 | なぜ「ミステリアスな人」に惹かれるのか【欲望の科学×日本美学】 | 2026-10-22 | 21分 | https://i.ytimg.com/vi/m1rR5HtY5vY/maxresdefault.jpg | https://www.youtube.com/watch?v=m1rR5HtY5vY |
| 346,307 | 2.31 | なぜ面白い人は、イケメンでなくてもモテるのか【進化心理学】 | 2026-07-09 | 19分 | https://i.ytimg.com/vi/ZhRXsEiuBns/maxresdefault.jpg | https://www.youtube.com/watch?v=ZhRXsEiuBns |
| 271,838 | 1.81 | なぜ「目上の者」は奢らなければならないのか【文化人類学】 | 2026-10-10 | 21分 | https://i.ytimg.com/vi/-XGqx0wjrHM/maxresdefault.jpg | https://www.youtube.com/watch?v=-XGqx0wjrHM |
| 256,242 | 1.71 | なぜセンスは「才能」ではないのか【認知心理学】 | 2026-08-06 | 20分 | https://i.ytimg.com/vi/GWTYPkjjwJU/maxresdefault.jpg | https://www.youtube.com/watch?v=GWTYPkjjwJU |
| 254,323 | 1.70 | なぜ「子を残さない思想」は滅びないのか【進化生物学】 | 2026-08-11 | 22分 | https://i.ytimg.com/vi/LEzJKwC8e6Q/maxresdefault.jpg | https://www.youtube.com/watch?v=LEzJKwC8e6Q |
| 214,945 | 1.43 | なぜ「愛されること」が苦痛になる人がいるのか【愛着理論×比較生理学】 | 2026-08-29 | 22分 | https://i.ytimg.com/vi/RRYRFjIPpTA/maxresdefault.jpg | https://www.youtube.com/watch?v=RRYRFjIPpTA |
| 207,652 | 1.38 | なぜ世界中の怪物は「同じ見た目」なのか【認知科学×比較神話学】 | 2026-09-03 | 21分 | https://i.ytimg.com/vi/b-1ikaXMKbA/maxresdefault.jpg | https://www.youtube.com/watch?v=b-1ikaXMKbA |
| 200,246 | 1.33 | なぜ結婚相手は「一人」でなければならないのか【進化人類学】 | 2026-09-08 | 20分 | https://i.ytimg.com/vi/cx6sLlAIXyI/maxresdefault.jpg | https://www.youtube.com/watch?v=cx6sLlAIXyI |
| 192,717 | 1.28 | なぜ「命に不要な性欲」が、人を破滅させるのか【生理学】 | 2026-09-15 | 22分 | https://i.ytimg.com/vi/QyvHTHI8L0U/maxresdefault.jpg | https://www.youtube.com/watch?v=QyvHTHI8L0U |
| 177,411 | 1.18 | なぜ差別をなくすほど「社会は分断」されるのか【社会心理学】 | 2026-10-03 | 23分 | https://i.ytimg.com/vi/Kf7teK5iHY8/maxresdefault.jpg | https://www.youtube.com/watch?v=Kf7teK5iHY8 |
| 168,576 | 1.12 | なぜ「好き」と「抱きたい」は別物なのか【性愛の脳科学】 | 2026-10-24 | 23分 | https://i.ytimg.com/vi/a1kNwzQVpkw/maxresdefault.jpg | https://www.youtube.com/watch?v=a1kNwzQVpkw |
| 126,118 | 0.84 | なぜ東京にヤンキーはいないのか？【行動生態学】 | 2026-08-13 | 21分 | https://i.ytimg.com/vi/zbPMYJzyyJE/maxresdefault.jpg | https://www.youtube.com/watch?v=zbPMYJzyyJE |
| 124,840 | 0.83 | なぜ人類は「老い」を克服してはいけないのか【進化生物学】 | 2026-08-15 | 21分 | https://i.ytimg.com/vi/9LNeBkw3RXo/maxresdefault.jpg | https://www.youtube.com/watch?v=9LNeBkw3RXo |
| 116,926 | 0.78 | なぜ「牛の解体ショー」は存在しないのか【民俗学】 | 2026-10-13 | 19分 | https://i.ytimg.com/vi/BKyP-wyM7-k/maxresdefault.jpg | https://www.youtube.com/watch?v=BKyP-wyM7-k |
| 115,300 | 0.77 | なぜ港区女子はモテるのに結婚できないのか【進化心理学×情報経済学】 | 2026-07-19 | 22分 | https://i.ytimg.com/vi/qp4oFj4C8jo/maxresdefault.jpg | https://www.youtube.com/watch?v=qp4oFj4C8jo |
| 112,372 | 0.75 | なぜ人類は「役に立たない動物」を愛するのか【進化心理学】 | 2026-08-27 | 22分 | https://i.ytimg.com/vi/uCt2JDxyII8/maxresdefault.jpg | https://www.youtube.com/watch?v=uCt2JDxyII8 |
| 107,629 | 0.72 | なぜ「清潔」と「清潔感」は違うのか【法科学×進化心理学】 | 2026-10-20 | 22分 | https://i.ytimg.com/vi/GdkCN7H3G1s/maxresdefault.jpg | https://www.youtube.com/watch?v=GdkCN7H3G1s |
| 104,144 | 0.69 | なぜモテない男は、「女のせい」にするのか【魔女裁判史×社会心理学】 | 2026-08-25 | 22分 | https://i.ytimg.com/vi/73PfuJI2I3k/maxresdefault.jpg | https://www.youtube.com/watch?v=73PfuJI2I3k |
| 94,548 | 0.63 | なぜ識字率が上がると国が滅びるのか【政治学×脳科学】 | 2026-07-26 | 23分 | https://i.ytimg.com/vi/syE-bnCbBvE/maxresdefault.jpg | https://www.youtube.com/watch?v=syE-bnCbBvE |
| 86,266 | 0.58 | 異分野のデータが暴いた「1位」と「2位」の不都合な格差【スーパースター経済学】 | 2026-10-08 | 20分 | https://i.ytimg.com/vi/irBD6OF8d2Q/maxresdefault.jpg | https://www.youtube.com/watch?v=irBD6OF8d2Q |
| 85,718 | 0.57 | なぜ「いいね」の価値は暴落したのか【恋愛市場のハイパーインフレ】 | 2026-08-22 | 22分 | https://i.ytimg.com/vi/DEh1NkMkVtc/maxresdefault.jpg | https://www.youtube.com/watch?v=DEh1NkMkVtc |
| 76,983 | 0.51 | なぜ「神童」は大人になると消えるのか【教育経済学×社会心理学】 | 2026-09-22 | 21分 | https://i.ytimg.com/vi/0_Ib3vhtGj8/maxresdefault.jpg | https://www.youtube.com/watch?v=0_Ib3vhtGj8 |
| 76,743 | 0.51 | なぜ「古参」は「にわか」を嫌うのか【推し活の心理学】 | 2026-10-17 | 21分 | https://i.ytimg.com/vi/J4c7pBjbYko/maxresdefault.jpg | https://www.youtube.com/watch?v=J4c7pBjbYko |
| 75,739 | 0.50 | なぜ現代人は異世界転生に心惹かれるのか【進化心理学】 | 2026-07-24 | 19分 | https://i.ytimg.com/vi/MaMWTHW532k/maxresdefault.jpg | https://www.youtube.com/watch?v=MaMWTHW532k |
| 71,689 | 0.48 | なぜ人は「スカッとする話」を求めてしまうのか【感情心理学】 | 2026-09-12 | 18分 | https://i.ytimg.com/vi/h89MHXbpCiM/maxresdefault.jpg | https://www.youtube.com/watch?v=h89MHXbpCiM |
| 71,521 | 0.48 | タピオカブームと新興宗教の「構造的共通点」｜宗教社会学 | 2026-09-29 | 22分 | https://i.ytimg.com/vi/Gokx4jhP9_A/maxresdefault.jpg | https://www.youtube.com/watch?v=Gokx4jhP9_A |
| 70,373 | 0.47 | なぜ人は「診断系コンテンツ」が大好きなのか【自己欺瞞の心理学】 | 2026-10-15 | 18分 | https://i.ytimg.com/vi/Zz_CTI-ahIQ/maxresdefault.jpg | https://www.youtube.com/watch?v=Zz_CTI-ahIQ |
| 70,316 | 0.47 | 人類はいつから「赤の他人」に命を預けるようになったのか【社会心理学】 | 2026-09-17 | 22分 | https://i.ytimg.com/vi/N-9Wm8mnbPE/maxresdefault.jpg | https://www.youtube.com/watch?v=N-9Wm8mnbPE |
| 68,582 | 0.46 | なぜ人は「好きなもの」を最後まで残すのか【消費心理学】 | 2026-09-10 | 18分 | https://i.ytimg.com/vi/emdZYeTJrEc/maxresdefault.jpg | https://www.youtube.com/watch?v=emdZYeTJrEc |
| 68,537 | 0.46 | なぜ不倫で「炎上する人／しない人」がいるのか？【一貫性の罠】 | 2026-09-05 | 24分 | https://i.ytimg.com/vi/trfxwXY2gqw/maxresdefault.jpg | https://www.youtube.com/watch?v=trfxwXY2gqw |
| 62,194 | 0.41 | なぜ人類は「不安商品」に大金を払い続けるのか【進化心理学×行動経済学】 | 2026-08-08 | 25分 | https://i.ytimg.com/vi/pjj6INSUcfQ/maxresdefault.jpg | https://www.youtube.com/watch?v=pjj6INSUcfQ |
| 61,842 | 0.41 | なぜ人は、歳を取るほど丸くなるのか【自己家畜化】 | 2026-07-07 | 21分 | https://i.ytimg.com/vi/BaFdZmNIKdA/maxresdefault.jpg | https://www.youtube.com/watch?v=BaFdZmNIKdA |
| 58,189 | 0.39 | なぜ人類は「忘れる」必要があったのか｜記憶科学 | 2026-10-01 | 22分 | https://i.ytimg.com/vi/x3JGHqYnQuc/maxresdefault.jpg | https://www.youtube.com/watch?v=x3JGHqYnQuc |
| 56,516 | 0.38 | なぜ誰しも「本当の敵」を見誤るのか【生態学×労働経済学】 | 2026-09-01 | 26分 | https://i.ytimg.com/vi/8m_KObEOGgA/maxresdefault.jpg | https://www.youtube.com/watch?v=8m_KObEOGgA |
| 56,249 | 0.37 | サウナ愛好家は「マゾヒスト」なのか？【ゲーム哲学×行動心理学】 | 2026-09-19 | 21分 | https://i.ytimg.com/vi/RV4oeBQCJsw/maxresdefault.jpg | https://www.youtube.com/watch?v=RV4oeBQCJsw |
| 56,189 | 0.37 | なぜ人類は「飼い慣らされた自然」しか愛せないのか【景観心理学】 | 2026-08-18 | 24分 | https://i.ytimg.com/vi/JiH_998Jg0g/maxresdefault.jpg | https://www.youtube.com/watch?v=JiH_998Jg0g |
| 55,684 | 0.37 | なぜ人は「サイコパス」に憧れるのか【臨床心理学】 | 2026-08-20 | 22分 | https://i.ytimg.com/vi/6qUif5KtQLw/maxresdefault.jpg | https://www.youtube.com/watch?v=6qUif5KtQLw |
| 50,740 | 0.34 | なぜあなたの名字は、必ず絶滅するのか【数理統計学】 | 2026-10-06 | 16分 | https://i.ytimg.com/vi/Qs7dWLvB5fY/maxresdefault.jpg | https://www.youtube.com/watch?v=Qs7dWLvB5fY |
| 50,640 | 0.34 | なぜ月は「スマホで撮る」と小さくなるのか？【知覚心理学】 | 2026-09-24 | 20分 | https://i.ytimg.com/vi/GtACODHJ6M4/maxresdefault.jpg | https://www.youtube.com/watch?v=GtACODHJ6M4 |
| 48,782 | 0.33 | なぜ好きな人に「ちょっかい」を出すのか【霊長類学】 | 2026-09-26 | 17分 | https://i.ytimg.com/vi/mP-xSI-GgVI/maxresdefault.jpg | https://www.youtube.com/watch?v=mP-xSI-GgVI |
| 48,490 | 0.32 | ヒト1人が一生で奪う命の数【統計シミュレーション】 | 2026-10-27 | 24分 | https://i.ytimg.com/vi/ZFMiRf2aEHs/maxresdefault.jpg | https://www.youtube.com/watch?v=ZFMiRf2aEHs |
| 45,198 | 0.30 | なぜ都会の孤独は“故郷のしがらみ”よりも甘美なのか【環境心理学×進化生物学】 | 2026-07-22 | 22分 | https://i.ytimg.com/vi/18TFMl33w8I/maxresdefault.jpg | https://www.youtube.com/watch?v=18TFMl33w8I |
| 43,882 | 0.29 | なぜ「厳罰化」は必ずしも犯罪を抑止できないのか【ジキルとハイドの心理学】 | 2026-10-29 | 22分 | https://i.ytimg.com/vi/7nF3AZCp6EU/maxresdefault.jpg | https://www.youtube.com/watch?v=7nF3AZCp6EU |
| 41,519 | 0.28 | 翻訳AIは、語学を不要にするのか？【言語学×認知科学】 | 2026-08-01 | 23分 | https://i.ytimg.com/vi/bt0-Bdngjko/maxresdefault.jpg | https://www.youtube.com/watch?v=bt0-Bdngjko |
| 40,494 | 0.27 | なぜ自然淘汰は、パンダを消せなかったのか【進化生物学×メディア論】 | 2026-07-12 | 23分 | https://i.ytimg.com/vi/uJQ5bS-PX3U/maxresdefault.jpg | https://www.youtube.com/watch?v=uJQ5bS-PX3U |
| 35,797 | 0.24 | なぜ「忙しい人」ほど、無能に見えてしまうのか【情報経済学】 | 2026-07-30 | 21分 | https://i.ytimg.com/vi/JhH7RQ2nlio/maxresdefault.jpg | https://www.youtube.com/watch?v=JhH7RQ2nlio |
| 32,888 | 0.22 | 【教養】なぜ「うんこ」だけは汚いのに愛されるのか｜文化人類学×発達心理学 | 2026-07-28 | 22分 | https://i.ytimg.com/vi/7UwCMUsgQws/maxresdefault.jpg | https://www.youtube.com/watch?v=7UwCMUsgQws |
| 25,175 | 0.17 | 「頭がデカい奴ほど賢い」は本当なのか？【進化生物学×脳科学】 | 2026-07-16 | 19分 | https://i.ytimg.com/vi/IUCM_nWWm1s/maxresdefault.jpg | https://www.youtube.com/watch?v=IUCM_nWWm1s |
| 25,094 | 0.17 | なぜ人はラブレターを書くのか？【社会心理学×記号論】 | 2026-08-03 | 22分 | https://i.ytimg.com/vi/MZS3WhG1iKw/maxresdefault.jpg | https://www.youtube.com/watch?v=MZS3WhG1iKw |
| 23,626 | 0.16 | 神不在の聖地を巡る人々は愚かなのか？【進化心理学×宗教社会学】 | 2026-07-14 | 20分 | https://i.ytimg.com/vi/d0g06xeZOYs/maxresdefault.jpg | https://www.youtube.com/watch?v=d0g06xeZOYs |

### 深淵回廊@人間の脳と心の仕組み（@深淵回廊）

登録者 112,000／総再生 17,211,827／動画数 63／開設 2026-07-16／https://www.youtube.com/channel/UCV8Jcbou4ei7HhtuffgvUYg

| 再生数 | 再生数/登録者 | タイトル | 公開日 | 尺 | サムネURL | 動画URL |
|---|---|---|---|---|---|---|
| 3,323,361 | 29.67 | IQ低い人に視えてる世界 #心理学 #雑学 #人間関係 #IQ | 2026-08-06 | ショート | https://i.ytimg.com/vi/XRsKaGi0w2s/maxresdefault.jpg | https://www.youtube.com/watch?v=XRsKaGi0w2s |
| 2,772,401 | 24.75 | 【IQ70とIQ160】IQが高いと見える世界はどう違うのか？ | 2026-10-01 | 15分 | https://i.ytimg.com/vi/Zy5opWj81lw/maxresdefault.jpg | https://www.youtube.com/watch?v=Zy5opWj81lw |
| 1,147,666 | 10.25 | 【思考心理学】本当に頭が良い人は何を考えているのか? | 2026-08-08 | 14分 | https://i.ytimg.com/vi/4cCFqBsXZ2E/maxresdefault.jpg | https://www.youtube.com/watch?v=4cCFqBsXZ2E |
| 740,062 | 6.61 | 【心理言語学】『言語化』が上手い人の脳内の仕組みとは？ | 2026-10-03 | 13分 | https://i.ytimg.com/vi/9V-4WaTXQZ8/maxresdefault.jpg | https://www.youtube.com/watch?v=9V-4WaTXQZ8 |
| 724,395 | 6.47 | 【社会心理学】世代ごとに視えてる世界はどう違う?【Z世代】 | 2026-10-09 | 19分 | https://i.ytimg.com/vi/dACDLI4a-NQ/maxresdefault.jpg | https://www.youtube.com/watch?v=dACDLI4a-NQ |
| 566,164 | 5.06 | あなたの職場にも「プライド高い無能」がいませんか...? #ダーク心理学 #雑学 #心理学 | 2026-08-09 | ショート | https://i.ytimg.com/vi/s0waeuZUxgY/maxresdefault.jpg | https://www.youtube.com/watch?v=s0waeuZUxgY |
| 449,279 | 4.01 | 【悪夢の正体】深層心理から見る夢とあなたの状態について | 2026-09-27 | 28分 | https://i.ytimg.com/vi/vhn7pRF6DfY/maxresdefault.jpg | https://www.youtube.com/watch?v=vhn7pRF6DfY |
| 439,628 | 3.93 | 【思考心理学】この答えがわかったら超天才です。 | 2026-09-02 | 14分 | https://i.ytimg.com/vi/wcFQmjUf7s8/maxresdefault.jpg | https://www.youtube.com/watch?v=wcFQmjUf7s8 |
| 429,205 | 3.83 | 【社会心理学】「なぜか魅力的に見える人」の5つの秘密 | 2026-09-20 | 18分 | https://i.ytimg.com/vi/6CVp2JIb7Hg/maxresdefault.jpg | https://www.youtube.com/watch?v=6CVp2JIb7Hg |
| 370,518 | 3.31 | 【社会心理学】本当に『相性の良い相手』の“5つのサイン” | 2026-09-16 | 20分 | https://i.ytimg.com/vi/hEVpNUwQSwI/maxresdefault.jpg | https://www.youtube.com/watch?v=hEVpNUwQSwI |
| 366,663 | 3.27 | 【認知心理学】スマホができて人間の脳は退化した?あなたは大丈夫ですか? | 2026-09-07 | 15分 | https://i.ytimg.com/vi/8y5rpn0NF88/maxresdefault.jpg | https://www.youtube.com/watch?v=8y5rpn0NF88 |
| 328,817 | 2.94 | 【組織心理学】会社員の"8類型"「忠犬型」が一番危険な理由 | 2026-09-13 | 22分 | https://i.ytimg.com/vi/2_LYLXEwa6g/maxresdefault.jpg | https://www.youtube.com/watch?v=2_LYLXEwa6g |
| 273,527 | 2.44 | 誰もが無意識にやられる心理トリック | 2026-09-04 | 13分 | https://i.ytimg.com/vi/_AlMoob26vY/maxresdefault.jpg | https://www.youtube.com/watch?v=_AlMoob26vY |
| 236,468 | 2.11 | 人生が辛いあなたへ。30分だけ時間をください。 | 2026-09-06 | 32分 | https://i.ytimg.com/vi/y4JKb8RSh1g/maxresdefault.jpg | https://www.youtube.com/watch?v=y4JKb8RSh1g |
| 214,544 | 1.92 | 【認知心理学】あなたにはこの問題が解けますか?※実際に出題された入社試験 | 2026-08-16 | 17分 | https://i.ytimg.com/vi/ca92_SPol9c/maxresdefault.jpg | https://www.youtube.com/watch?v=ca92_SPol9c |
| 209,460 | 1.87 | 【思考実験】あなたにはこの答えが分かりますか...? | 2026-08-22 | 16分 | https://i.ytimg.com/vi/0iUqqlenA5o/maxresdefault.jpg | https://www.youtube.com/watch?v=0iUqqlenA5o |
| 194,247 | 1.73 | 【社会心理学】今すぐ会社を辞めるべき7つのサイン | 2026-09-29 | 15分 | https://i.ytimg.com/vi/hhjtUw_YXYk/maxresdefault.jpg | https://www.youtube.com/watch?v=hhjtUw_YXYk |
| 189,495 | 1.69 | 【社会心理学】“人たらし”になれる雑談力が身につく動画 | 2026-08-17 | 18分 | https://i.ytimg.com/vi/1iqCUJNXrG8/maxresdefault.jpg | https://www.youtube.com/watch?v=1iqCUJNXrG8 |
| 176,824 | 1.58 | 【認知心理学】ミスしない人がやっている5つの習慣 | 2026-10-14 | 23分 | https://i.ytimg.com/vi/xoCREiH0xwk/maxresdefault.jpg | https://www.youtube.com/watch?v=xoCREiH0xwk |
| 173,414 | 1.55 | 【警告】“あなたの心”は本当に大丈夫ですか?〜人の心が壊れるまで〜 | 2026-10-25 | 23分 | https://i.ytimg.com/vi/EBi88jglxZ8/maxresdefault.jpg | https://www.youtube.com/watch?v=EBi88jglxZ8 |
| 170,084 | 1.52 | 【社会心理学】能力は同じなのに「話しかけたくなる人」は何が違うのか？ | 2026-10-10 | 19分 | https://i.ytimg.com/vi/XlGrMSznUPU/maxresdefault.jpg | https://www.youtube.com/watch?v=XlGrMSznUPU |
| 166,144 | 1.48 | 【ダーク心理学】サイコパス・ソシオパス・ダークエンパスの視えてる世界 | 2026-10-19 | 19分 | https://i.ytimg.com/vi/l8auQfbSl1o/maxresdefault.jpg | https://www.youtube.com/watch?v=l8auQfbSl1o |
| 163,580 | 1.46 | 【健康心理学】休んでも疲れが取れない本当の理由——勝手に身体と心が休まる休日の過ごし方 | 2026-10-17 | 17分 | https://i.ytimg.com/vi/f21csDhNyGE/maxresdefault.jpg | https://www.youtube.com/watch?v=f21csDhNyGE |
| 158,385 | 1.41 | 【時間心理学】2020年から『時間の流れ』が早く感じる理由 | 2026-10-05 | 20分 | https://i.ytimg.com/vi/hUvUSbGnyIY/maxresdefault.jpg | https://www.youtube.com/watch?v=hUvUSbGnyIY |
| 157,338 | 1.40 | 【社会心理学】あなたの周りにもいる"関わってはいけない人"7類型 | 2026-09-22 | 17分 | https://i.ytimg.com/vi/YRVc3rplcVU/maxresdefault.jpg | https://www.youtube.com/watch?v=YRVc3rplcVU |
| 155,221 | 1.39 | IQ・EQ・SQ・BKQ・NQ：人生を支配する4つの知能 | 2026-08-24 | 15分 | https://i.ytimg.com/vi/TQOZPs8EA9g/maxresdefault.jpg | https://www.youtube.com/watch?v=TQOZPs8EA9g |
| 153,082 | 1.37 | 【繊細さん】「人の視線が怖い」HSPに人の見えてる世界と処方箋 | 2026-09-26 | 29分 | https://i.ytimg.com/vi/lsXz-16PPKg/maxresdefault.jpg | https://www.youtube.com/watch?v=lsXz-16PPKg |
| 142,063 | 1.27 | 【家族心理学】アダルトチルドレン診断：あなたは「いい子」を演じ続けていませんか？ | 2026-08-15 | 13分 | https://i.ytimg.com/vi/dEd0z8P_bpY/maxresdefault.jpg | https://www.youtube.com/watch?v=dEd0z8P_bpY |
| 123,861 | 1.11 | あなたの人生のピークはいつですか?統計から見る『本当のピーク』について | 2026-09-24 | 18分 | https://i.ytimg.com/vi/PQKFf2WbfL8/maxresdefault.jpg | https://www.youtube.com/watch?v=PQKFf2WbfL8 |
| 119,782 | 1.07 | 【認知心理学】あなたの「言語化」は5段階のどこで止まっているか？ | 2026-10-12 | 16分 | https://i.ytimg.com/vi/Zkm1h36XkeM/maxresdefault.jpg | https://www.youtube.com/watch?v=Zkm1h36XkeM |
| 107,070 | 0.96 | 【発達障害】なぜ人の気持ちがわからない?ASDの「見えている世界」について | 2026-08-26 | 15分 | https://i.ytimg.com/vi/7z2Pp2arLhA/maxresdefault.jpg | https://www.youtube.com/watch?v=7z2Pp2arLhA |
| 101,915 | 0.91 | IQの限界を突破する：科学が証明した「賢い脳」を作る5つの方法 | 2026-08-28 | 15分 | https://i.ytimg.com/vi/X2aSoEF159g/maxresdefault.jpg | https://www.youtube.com/watch?v=X2aSoEF159g |
| 93,346 | 0.83 | 【進化心理学】男女が感じる“魅力”の違い、考えてみた。 | 2026-10-07 | 16分 | https://i.ytimg.com/vi/G74doWBSXK0/maxresdefault.jpg | https://www.youtube.com/watch?v=G74doWBSXK0 |
| 85,670 | 0.76 | 【社会心理学】芸術作品はなぜ"意味不明"なのか——バナナ1本が9億円で売れる本当の理由 | 2026-10-16 | 18分 | https://i.ytimg.com/vi/s4kw9bd7n0I/maxresdefault.jpg | https://www.youtube.com/watch?v=s4kw9bd7n0I |
| 83,718 | 0.75 | 【認知心理学】本当に“必要な教養”をあなたは知っていますか? | 2026-08-20 | 15分 | https://i.ytimg.com/vi/P6wH-TAJeUc/maxresdefault.jpg | https://www.youtube.com/watch?v=P6wH-TAJeUc |
| 80,635 | 0.72 | IQが高いと損をする理由 #心理学 #雑学 #IQ | 2026-08-12 | 1分 | https://i.ytimg.com/vi/W-Q2K1M79yg/maxresdefault.jpg | https://www.youtube.com/watch?v=W-Q2K1M79yg |
| 75,769 | 0.68 | なぜか毎日が辛いあなたへ。その生きづらさは、あなたのせいではありません | 2026-08-11 | 15分 | https://i.ytimg.com/vi/3Z-2vFjjwFM/maxresdefault.jpg | https://www.youtube.com/watch?v=3Z-2vFjjwFM |
| 74,653 | 0.67 | 『金縛り』はなぜ起こる?脳の“異常”の正体 | 2026-09-18 | 20分 | https://i.ytimg.com/vi/SIdYJv0-llk/maxresdefault.jpg | https://www.youtube.com/watch?v=SIdYJv0-llk |
| 68,819 | 0.61 | 【洗脳】なぜ”無性に”マクドナルドが食べたくなるのか? | 2026-09-12 | 13分 | https://i.ytimg.com/vi/JIvFqDn4iTk/maxresdefault.jpg | https://www.youtube.com/watch?v=JIvFqDn4iTk |
| 65,363 | 0.58 | 【アドラー心理学】なぜ『嫌われる勇気』は日本人の心を掴んだのか? | 2026-09-10 | 15分 | https://i.ytimg.com/vi/CjhJ8qLDwx4/maxresdefault.jpg | https://www.youtube.com/watch?v=CjhJ8qLDwx4 |
| 62,930 | 0.56 | 本当に頭がいい人が会議中に考えてること #心理学 #雑学#ダーク心理学 | 2026-08-10 | ショート | https://i.ytimg.com/vi/scx-75LFLtM/maxresdefault.jpg | https://www.youtube.com/watch?v=scx-75LFLtM |
| 56,451 | 0.50 | 愛情不足で育った大人の後遺症 #心理学 #雑学 #アダルトチルドレン | 2026-08-13 | ショート | https://i.ytimg.com/vi/j7MJ4m5ROTU/maxresdefault.jpg | https://www.youtube.com/watch?v=j7MJ4m5ROTU |
| 50,832 | 0.45 | 【社会心理学】流行に乗る人・乗らない人の決定的な違いを知っていますか? | 2026-10-21 | 16分 | https://i.ytimg.com/vi/-uXBQva36A4/maxresdefault.jpg | https://www.youtube.com/watch?v=-uXBQva36A4 |
| 45,995 | 0.41 | 【心理学】新しい挑戦も継続できる本当に簡単な方法 | 2026-08-31 | 15分 | https://i.ytimg.com/vi/p6PFoanaWj4/maxresdefault.jpg | https://www.youtube.com/watch?v=p6PFoanaWj4 |
| 45,795 | 0.41 | 【心理学】発達障害と診断される子供が急増している本当の理由 | 2026-08-06 | 14分 | https://i.ytimg.com/vi/4lS5fyryQcU/maxresdefault.jpg | https://www.youtube.com/watch?v=4lS5fyryQcU |
| 45,785 | 0.41 | 【悪用厳禁】人の心は“なぜ動く?”心理学を利用して大復活を遂げた企業５選 | 2026-10-30 | 20分 | https://i.ytimg.com/vi/bWS2a-ttGQo/maxresdefault.jpg | https://www.youtube.com/watch?v=bWS2a-ttGQo |
| 43,970 | 0.39 | 【家庭心理学】昭和・平成・令和、本当に父親の威厳は無くなったのか!? | 2026-10-23 | 15分 | https://i.ytimg.com/vi/JPNAq1ZlI5g/maxresdefault.jpg | https://www.youtube.com/watch?v=JPNAq1ZlI5g |
| 35,056 | 0.31 | 【社会心理学】男性脳・女性脳は何が違う?違いについて徹底考察してみた | 2026-10-27 | 15分 | https://i.ytimg.com/vi/dBN5iTED9_I/maxresdefault.jpg | https://www.youtube.com/watch?v=dBN5iTED9_I |
| 25,579 | 0.23 | 謝らない人の心理｜自己愛性パーソナリティ障害の特徴と職場での対処法 | 2026-08-14 | 18分 | https://i.ytimg.com/vi/iJbC24jwfxY/maxresdefault.jpg | https://www.youtube.com/watch?v=iJbC24jwfxY |
| 17,682 | 0.16 | 「世界中が“敵”に見える」統合失調症について知っていますか? | 2026-08-05 | 17分 | https://i.ytimg.com/vi/VSjXxUbNX6E/maxresdefault.jpg | https://www.youtube.com/watch?v=VSjXxUbNX6E |

### 脳内研究室（@脳内研究室）

登録者 14,000／総再生 2,254,442／動画数 7／開設 2026-10-05／https://www.youtube.com/channel/UClCED1AmqS5c2S8IhNh_bpA

| 再生数 | 再生数/登録者 | タイトル | 公開日 | 尺 | サムネURL | 動画URL |
|---|---|---|---|---|---|---|
| 1,222,547 | 87.32 | 【脳科学】頭の中に映像が見える人と、何も見えない人の違い | 2026-10-18 | 15分 | https://i.ytimg.com/vi/pY5x_MrbFbM/maxresdefault.jpg | https://www.youtube.com/watch?v=pY5x_MrbFbM |
| 881,239 | 62.95 | 【脳科学】ごく一部の人にしか見えない色がある。「4色型色覚」、あなたの目は何色型？ | 2026-10-27 | 17分 | https://i.ytimg.com/vi/0w940kRqv9U/maxresdefault.jpg | https://www.youtube.com/watch?v=0w940kRqv9U |
| 138,399 | 9.89 | 【認知心理学】何度読んでも忘れる人と、すぐ覚える人は何が違うのか？ | 2026-10-07 | 10分 | https://i.ytimg.com/vi/IsvwgEND-qk/maxresdefault.jpg | https://www.youtube.com/watch?v=IsvwgEND-qk |
| 92,325 | 6.59 | 【行動経済学】なぜ、誰も選ばない選択肢がメニューにあるのか？「おとり効果」の正体 | 2026-10-25 | 11分 | https://i.ytimg.com/vi/fP0DzahDHZ4/maxresdefault.jpg | https://www.youtube.com/watch?v=fP0DzahDHZ4 |
| 17,710 | 1.26 | 【脳科学】ショート動画を見続けた脳では、何が起きているのか？ | 2026-10-21 | 10分 | https://i.ytimg.com/vi/Z8xcJwkweRs/maxresdefault.jpg | https://www.youtube.com/watch?v=Z8xcJwkweRs |
| 6,667 | 0.48 | 【脳科学】なぜ、いいアイデアはシャワー中に降りてくるのか？ | 2026-10-16 | 12分 | https://i.ytimg.com/vi/cbnxyyNP4FA/maxresdefault.jpg | https://www.youtube.com/watch?v=cbnxyyNP4FA |
| 4,713 | 0.34 | 恋に落ちた時、脳では何が起きているのか？【脳科学】 | 2026-10-17 | 11分 | https://i.ytimg.com/vi/gpv-nGbEPP8/maxresdefault.jpg | https://www.youtube.com/watch?v=gpv-nGbEPP8 |

