# 06c 素材の権利台帳（chizu-001-australia-coast）

- 対象：`storyboard_v1.md` の「要確保」の場面と、社長指示（2026-11-04）で AI 画像から実写に代える場面。
- 置き場所：`episodes/chizu-001-australia-coast/assets/`。どれも横 1920px 以下に縮めた JPEG。
- 確認方法：Wikimedia Commons API（`prop=imageinfo&iiprop=url|extmetadata|size`）の LicenseShortName・Artist・Credit・DateTimeOriginal・ImageDescription と、カテゴリを読んだ。推測で埋めた欄はない。確認日 2026-11-04。
- 受け入れたライセンス：パブリックドメイン、CC0、CC BY（全版）、CC BY-SA（最後の手段。表で **BY-SA** と明記）。NC・ND・フェアユース・不明は使っていない。
- 表示義務：CC BY と CC BY-SA は、画面か概要欄に「作者名・ライセンス名・元ページ」を出す。BY-SA の素材を加工した場合、加工した画像そのものにも同じ BY-SA が及ぶ。
- 目視確認：Claude が縮小前後の画像を実際に見た。透かし・文字の重ねがないか、写っている場所が説明と合うかを見た。
- 時刻・場面は `storyboard_v1.md` の値（音声を作った後に合わせ直す）。

## 既存素材（v3 から引き継ぐもの）

| 番号 | 絵コンテの場面 | ファイル名 | 写っているもの（場所） | 作者 | 撮影・制作年 | ライセンス | 元ページURL | 加工（トリミング・ズーム・字幕） | 目視確認 |
|---|---|---|---|---|---|---|---|---|---|
| 00a | S01 0:12–0:17（シドニー）／S09 3:44–3:52 の最後 | real_00a_sydney_cbd.jpg | シドニー中心部とシドニー湾の空撮（ファーム・コーブ、オペラハウス） | Arran Bee | 2014-11-06 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Sydney_CBD_aerial.jpg | 横1920pxに縮小。ゆっくりズーム。字幕「シドニー」 | 済（透かしなし） |
| 00b | S02 0:35–0:41（首都キャンベラは内陸）／S14 | real_00b_canberra_parliament.jpg | キャンベラの国会議事堂を上空から（気球の影が写る） | Malcolm Tredinnick | 2005-04-21 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Parliament_House_Canberra_from_above.jpg | 横1920pxに縮小（元は1998px）。ズーム | 済（透かしなし） |
| AI-1 | （旧）S02 0:24–0:30、S17 6:37–6:44 | outback-generated.png | 架空の内陸の景色（AI生成） | ― | ― | ― | ― | ― | **不使用（社長指示 2026-11-04：AI画像は実写で代える）**。代わりは 20 |
| AI-2 | （旧）S08 3:01–3:08 | port-generated.png | 架空の港の景色（AI生成） | ― | ― | ― | ― | ― | **不使用（社長指示 2026-11-04：AI画像は実写で代える）**。代わりは 19 |

## 新しく確保した素材

| 番号 | 絵コンテの場面 | ファイル名 | 写っているもの（場所） | 作者 | 撮影・制作年 | ライセンス | 元ページURL | 加工（トリミング・ズーム・字幕） | 目視確認 |
|---|---|---|---|---|---|---|---|---|---|
| 01 | S03 0:56–1:03（メルボルン） | real_01_melbourne.jpg | メルボルン中心部とヤラ川の空撮（北東向き。水上飛行機から） | David Wallace | 2013-09-14 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Melbourne_skyline_on_14_September_2013.jpg | 上端の飛行機の翼を切り落とした（1920×1040）。ズーム。字幕「メルボルン」 | 済（翼は除去済み、透かしなし） |
| 02 | S04 1:23–1:28（ブリスベン） | real_02_brisbane.jpg | ブリスベン中心部とブリスベン川（手前はウィリアム・ジョリー橋） | -wuppertaler | 2023-03-11 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:AUS_Brisbane,_Central_Business_District,_Brisbane_River_007.jpg | 横1920pxに縮小（4:3）。16:9 に切るなら空を削る。字幕「ブリスベン」 | 済（曇り空。透かしなし） |
| 03 | S04 1:28–1:32（パース） | real_03_perth.jpg | パース中心部をスワン川の上から | JamesBromberger | 2024-09-07 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Perth_skyline_from_the_Swan_River,_August_2024.jpg | 横1920pxに縮小（16:9）。字幕「パース」 | 済（透かしなし） |
| 04 | S05 1:52–1:58（街の水がめ） | real_04_warragamba_dam.jpg | ワラガンバ・ダムとダム湖（バラゴラング湖）。ニューサウスウェールズ州 | Jonathan Pope from Vancouver, Canada | 2011-02-24 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Warragamba_Dam_NSW.jpg | 横長パノラマの右側（湖とダム）を16:9に切り出し、1920×1080 | 済（透かしなし）。同じダムの Goran Has の写真は左下に透かしがあり不採用 |
| 05 | S07 2:37–2:42（北部の熱帯） | real_05_tropical_wetland.jpg | フォッグ・ダム保護区（ノーザンテリトリー、アデレード川の氾濫原）の雨季の湿地 | Stephen Michael Barnett | 2008-01-12（雨季） | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Fogg_Dam_in_January_2008.jpg | 空を少し削って1920×1080 | 済（透かしなし）。場所はファイル名とカテゴリ「Fogg Dam Conservation Reserve」「January 2008 in the Northern Territory」で確認 |
| 06 | S07 2:42–2:48（南部の温帯） | real_06_temperate_farmland.jpg | ビクトリア州コールドストリーム（ヤラ・バレー）のぶどう畑と農地の空撮 | Bob Tan | 2023-03-20 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Aerial_panorama_of_Coldstream_with_the_St_Hubert_Vineyard_in_the_middle_of_the_frame._March_2023.jpg | パノラマの左側を切り出して1920×1080。ワイナリーの看板「ST HUBERTS」が入らない範囲にした | 済（透かしなし、看板なし） |
| 07 | S08 3:24–3:30（今のボタニー湾） | real_07_botany_bay.jpg | カマイ・ボタニー湾国立公園のインスクリプション・ポイントから見たボタニー湾（沖に貨物船） | Philip Terry Graham | 2015-06-07 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:View_across_Botany_Bay_from_Inscription_Point.jpg | 横1920pxに縮小（4:3） | 済（透かしなし） |
| 08 | S09 3:36–3:44（1788年のシドニー・コーブ） | real_08_sydney_cove_1788.jpg | 水彩画「Sydney Cove, Port Jackson 1788」（ウィリアム・ブラッドリー画）。所蔵はニューサウスウェールズ州立図書館ミッチェル図書館 | William Bradley | 描かれた情景は1788年（ファイル頁の日付欄 2019-10-07 はスキャンの日付） | パブリックドメイン（PD-Australia） | https://commons.wikimedia.org/wiki/File:Sydney_Cove_Port_Jackson_1788.jpg | 横1280px（元は1919px。サーバーの制限で1280pxの縮小版を取得）。「当時の絵」と呼び、「写真」と呼ばない | 済（紙のしみあり。文字の重ねなし） |
| 09 | S09 3:44–3:52（今のシドニー・コーブ） | real_09_circular_quay.jpg | 今のシドニー・コーブ（サーキュラー・キー）。東側の岸から高層ビル群とキャンベルズ・コーブを望む | Radosław Botev | 2026-07-26 | CC BY 3.0 pl | https://commons.wikimedia.org/wiki/File:Circular_Quay_(4).jpg | 下の歩道を削って1920×1080 | 済（透かしなし）。ビル屋上の「salesforce」の文字が小さく写る |
| 10 | S10 4:02–4:10（シドニー周辺の線刻画） | real_10_rock_engraving.jpg | 先住民の岩の線刻画（ガリガル国立公園の Engravings Track、シドニー北部） | Sardaka | 1985年ごろ（コダクロームのスライドを後年スキャン） | **CC BY-SA 4.0**（GFDL との二重ライセンス） | https://commons.wikimedia.org/wiki/File:(1)Engravings_Track008.jpg | 横1920pxに縮小。人は写っていない | 済（透かしなし）。**ファイル頁に文化的配慮の注意書きはない**（説明文・カテゴリ・本文を確認）。BY-SA なので最後の手段。同じ作者の 007 はスキャンの色ずれの帯があり不採用 |
| 11 | S12 4:57–5:07（住宅費・混雑） | real_11_suburbs.jpg | シドニー西部パラマッタ方面の住宅地と高速道路の空撮 | Beau Giles | 2010-12-08 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Looking_towards_Parramatta_aerial.jpg | 横1920pxに縮小 | 済（透かしなし）。家の密集度は中くらい |
| 12 | S14 5:31–5:38（首都の計画図） | real_12_griffin_plan.jpg | キャンベラ設計競技へのグリフィンの応募図。連邦政府が配った等高線の地図の上に描いたもの | Walter Burley Griffin（ファイル頁の作者欄は空欄。説明文に「Walter Burley Griffin の応募案」と記載。カテゴリに Charles Scrivener〔等高線測量〕） | 1911–1912 | パブリックドメイン（PD-Australia） | https://commons.wikimedia.org/wiki/File:Canberra_plan-WBG.jpg | 横1920pxに縮小（ほぼ正方形）。所蔵はオーストラリア国立公文書館（説明文による） | 済（図面の文字は原図のもの） |
| 13 | S15 6:02–6:10（キャンベラの街と湖） | real_13_canberra_lake.jpg | マウント・エインズリー展望台から見たキャンベラ。アンザック・パレード、バーリー・グリフィン湖、国会議事堂 | Orion Kahza | 2020-03-19 | CC0 | https://commons.wikimedia.org/wiki/File:Canberra_from_Mount_Ainslie_Lookout.jpg | 横1920pxに縮小 | 済（透かしなし） |
| 14 | S16 6:16–6:22（放牧地） | real_14_cattle_station.jpg | クイーンズランド州タルドラ（Taldora）の牛（赤土の放牧地） | Kerry Raymond | 2019-06-25 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Cattle,_Taldora,_Queensland,_June_2019.jpg | 横1280px（元は1920px。サーバーの制限で1280pxの縮小版を取得） | 済（透かしなし）。牧場名は記録にないので、画面には地名「タルドラ」までにとどめる |
| 15 | S16 6:22–6:28（自然保護区） | real_15_inland_park.jpg | 西オーストラリア州カリジニ国立公園の滝と赤い岩（デイルズ渓谷のフォーテスキュー滝と見られる。ファイル頁の記載は「Karijini National Park」のみ） | Phil Whitehouse from London, United Kingdom | 2004-05-26 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Karijini_National_Park_(2052476670).jpg | 横1920pxに縮小（元は2048px） | 済（透かしなし）。左上の岩の上に遠く小さく人が1人写る（顔は分からない）。ウルル／カタ・ジュタではない |
| 16 | S11 4:25–4:33（朝のオフィス街の人の流れ） | real_16_cbd_commuters.jpg | シドニー中心部ジョージ・ストリートの歩行者道（路面電車の線路） | Bengt Nyman from Vaxholm, Sweden | 2019-01-27 08:20（記録上の時刻） | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:George_Street,_Sydney_CBD_in_Feb_2019.jpg | 横1920pxに縮小 | **条件付き**。①写っているのは買い物客・観光客で、通勤者とは限らない（撮影日は日曜）。②店の看板（Superdry・McDonald's・UGG など）が目立つ。③左手前の数人は顔が分かる大きさ。使うなら、手前と看板を外す切り出しかぼかしが必要。より合う写真は見つからなかった |
| 17 | S12 4:50–4:57（空港） | real_17_sydney_airport.jpg | シドニー空港（キングスフォード・スミス）とボタニー湾の空撮。手前にポート・ボタニーのコンテナ埠頭 | Andrew Harvey | 2016-03-06 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Sydney_Airport_(Kingsford_Smith)_-_aerial_view.jpg | 左上の旅客機の翼を切り落とした（1920×1250） | 済（翼は除去済み、透かしなし） |
| 18 | S12 4:50–4:57（鉄道） | real_18_train.jpg | メルボルンの通勤電車（メトロ・トレインズ・メルボルンの X'Trapolis 100）。ユニオン駅1番線 | Esc.Trains | 2024-01-15 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Metro_Trains_Melbourne_X%27Trapolis_100_At_Union_Station_Platform_1.jpg | 横1920pxに縮小 | 済（透かしなし）。ホームに小さく数人（顔は分からない）。車両に運行会社の表示「PT」がある |
| 19 | S08 3:01–3:08（船を泊められる湾）／S12 4:50–4:57（港） | real_19_container_port.jpg | ポート・ボタニー（シドニー）のコンテナ埠頭とクレーンの空撮 | Andrew Harvey | 2016-03-06 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Sydney_Airport_(Kingsford_Smith)_-_aerial_view.jpg | 17 と同じ写真の埠頭部分を切り出して拡大（3840px版から2160×1215を切り出し、1920×1080に縮小）。少しぼやける | 済（透かしなし）。17 と同じ元写真なので、同じ場面で続けて使うときは注意 |
| 20 | S02 0:24–0:30、S17 6:37–6:44（内陸の赤い大地） | real_20_outback.jpg | ノーザンテリトリー、アリススプリングス近くのエミリー・ギャップとジェシー・ギャップ自然公園（イースト・マクドネル山脈）の赤い岩と木 | andrea castelli from Italy | 2010-10-03 | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:MacDonnell_Ranges_Orientali.jpg | 上下を少し削って1920×1080 | 済（透かしなし、人なし）。ファイル頁に文化的配慮の注意書きはない。ただし先住民の聖地を含む公園なので、使う前に公園の利用条件（ノーザンテリトリー公園局）を確認する。出典で確認していないので、画面で聖地とは言わない |

## 見つからなかったもの・見送ったもの

- **16 の通勤風景**：Commons で「朝の通勤」とはっきり書かれた、CC BY 以下の条件の写真が見つからなかった。いまの 16 は条件付き（上の表）。差し替え候補を探すなら「Wynyard」「Martin Place morning」などの語で再検索する。
- **10 の線刻画で CC BY 以下のもの**：シドニー周辺の線刻画の写真は Sardaka の BY-SA だけが見つかった。クーリンガイ・チェイス国立公園の写真は、条件に合うものが見つからなかった。
- **20 の候補「Stuart Highway (2050415762).jpg」**（Phil Whitehouse、CC BY 2.0、2003-08-19、赤土とキバタン）は見た目は合うが、ファイル頁に正確な場所の記載がないので不採用。
- 不採用にした主なもの：ワラガンバ・ダム（Goran Has）＝透かしあり。シドニー・コーブのヤシ並木の写真（Robert Linsdell）＝写っているのはファーム・コーブ側でシドニー・コーブではない。カカドゥのワニ・コウノトリの写真（BindiS）＝主役が動物で景色ではない。ポート・オブ・メルボルン（Tangerineduel）＝手前の木と鉄塔がじゃまで、19 はポート・ボタニーの空撮のほうが良い。

## 画面に出すクレジット（案）

- CC BY / CC BY-SA の素材は、表示中の画面の隅に「写真：作者名 / ライセンス名」を小さく出し、概要欄に元ページURLを並べる。
- 08 と 12 はパブリックドメインだが、所蔵館名（ミッチェル図書館／オーストラリア国立公文書館）を概要欄に書く。
- 13 は CC0 なので表示義務はないが、概要欄に作者と元ページを書く。

## 書き出しでの使用（2026-11-04、Claude）
- **使わなかったもの**
  - 16 `real_16_cbd_commuters.jpg`：日曜の買い物客で「働き手」ではなく、ブランドの看板と顔が大きく写っているため。S11 は 01 メルボルン中心部の空撮を寄りで使った
  - 20 `real_20_outback.jpg`：撮影地（エミリー・アンド・ジェシー・ギャップス）に先住民の聖地があり、北部準州の公園の利用条件を確認できていないため。S02 は衛星画像の地図で内陸に寄るカットに替えた
  - v3 の AI 画像2点（社長指示で実写に代えた）
- **同じ写真から切り出したもの**：17 空港と 19 港は同じ1枚から。S08 と S12 で離れた位置に置いた
- **CC BY-SA**：10 岩の線刻（CC BY-SA 4.0）。画面の隅にクレジットとライセンス名を出し、概要欄に元ページを書く
- **地図・衛星画像**
  - Natural Earth（1:1000万・1:5000万、パブリックドメイン）：npm パッケージ world-atlas 2.0.2・sane-topojson 4.0.0 に同梱のものを使用
  - NASA Blue Marble（衛星合成画像・NASA の著作物のためパブリックドメイン）：npm パッケージ three-globe 2.45.6 の example に同梱の `earth-blue-marble.jpg`（4096×2048）。**撮影年・版はこのファイルからは確認できていない**。v3 で使った Blue Marble Next Generation（2004年1月）の高解像度版は、Wikimedia Commons の利用制限で今回は取得できなかった
- **フォント**：Noto Sans JP（SIL Open Font License 1.1）
- **音声**：VOICEVOX:雀松朱司。BGM は書き出しプログラム（`render/mix.py`）で合成したもので、第三者の音源は使っていない
