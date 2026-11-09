# 06c 実写素材（Wikimedia Commons）

- 対象：chizu-002「首都をゼロから造った国々」の実写写真。
- 取得日：2026-11-09。取得方法：Commons API（action=query, prop=imageinfo, iiprop=extmetadata ほか）でライセンス・作者・説明・カテゴリ・ファイル履歴を確認した。
- 画像は upload.wikimedia.org の /thumb/ 版（幅 1920px）を取得した。9 だけは標準サイズの都合で 1280px 版を使った。保存時に ffmpeg で幅 1920px 以内・JPEG 画質 q=3（約 85 相当）に変換した。
- 保存先：`episodes/chizu-002-new-capitals/assets/`。この場所は `.gitignore`（`episodes/chizu-*/assets/`）の対象で、git には入らない。
- 受け入れ基準：パブリックドメイン（米国連邦政府の著作物を含む）、CC0、CC BY のみ。CC BY-SA・GFDL・NC・ND・不明は使っていない。
- 「パノラマの自由の表示」は、Commons のファイルページに FoP／NoFoP 系テンプレートが付いているかを API の templates 一覧で調べた結果だけを書いた。

## 素材一覧

| 番号 | ファイル名 | 写っているもの（場所） | 作者 | 撮影・制作年 | ライセンス（＋ライセンスURL） | 元ページURL | 版（使った版と改変者。thumb を使った場合は元の大きさ） | パノラマの自由の表示 | 目視確認 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | photo_01_us_capitol.jpg | アメリカ合衆国議会議事堂の西側正面（ワシントンD.C.）。カテゴリ「Exterior of the United States Capitol」 | Architect of the Capitol（米国議会議事堂建築監）。出典 aoc.gov | 1997 | パブリックドメイン（米国連邦政府機関の作品）。URL なし | https://commons.wikimedia.org/wiki/File:United_States_Capitol_-_west_front.jpg | 版は 1 つだけ（2009-08-11 APK が登録）。改変なし。thumb 1920×996 を使用。元は 3000×1556 | テンプレートなし | 済。建物の全景。透かし・文字の重ねなし。人物は遠くに小さく写るだけ |
| 2 | photo_02_philadelphia.jpg | 独立記念館（Independence Hall）と西棟（フィラデルフィア、チェスナット通り）。カテゴリ「Independence Hall, Philadelphia」「West Wing of Independence Hall」 | NPS photo（米国国立公園局）。出典 NPGallery | 2009-05-22 | パブリックドメイン（PD US NPS＝米国国立公園局の作品）。URL なし | https://commons.wikimedia.org/wiki/File:Independence_Hall_with_reconstructed_clock.JPG_(cb918502-896a-44b4-85e8-a67b4f922832).JPG | 版は 1 つだけ（2022-01-16 BMacZeroBot が一括登録）。改変なし。thumb 1920×1286 を使用。元は 3872×2592 | テンプレートなし | 済。建物の外観。透かし・文字の重ねなし。人物なし。依頼の「Congress Hall」ではなく独立記念館（1790〜1800年の連邦議会は隣の Congress Hall で開かれた） |
| 3 | photo_03_brasilia_congress.jpg | ブラジル国民会議議事堂（ブラジリア）。2棟のタワーとドーム・お椀形の議場。カテゴリ「Towers of Palácio do Congresso Nacional (Brasília)」 | Marinelson Almeida（Flickr「Traveling through Brazil」） | 2015-05-24 | CC BY 2.0 https://creativecommons.org/licenses/by/2.0 | https://commons.wikimedia.org/wiki/File:Congresso_Nacional_-_Brasilia_(17954109049).jpg | 版は 1 つだけ（2019-10-30 A1Cafel が Flickr から転載）。改変なし。thumb 1920×1280 を使用。元は 5184×3456 | テンプレートなし（ファイルページに FoP-Brazil の表示はない） | 済。建物の全景。透かし・文字の重ねなし。人物は遠くに小さく写るだけ。右端に駐車場の標識（写真の一部） |
| 4 | photo_04_rio.jpg | リオデジャネイロの高層住宅街を上から見た景色。奥に湖と大西洋側の砂浜と外海が写る。カテゴリ「Guanabara Bay」「Rio de Janeiro」「Rio from above」 | Wilfredor（自作） | 2024-06-22 | CC0 http://creativecommons.org/publicdomain/zero/1.0/deed.en | https://commons.wikimedia.org/wiki/File:Rio_de_Janeiro_cityscape_across_Guanabara_Bay,_Brazil.jpg | 版は 1 つだけ（2024-07-18 Wilfredor が登録）。改変なし。thumb 1920×962 を使用。元は 16848×8439 | テンプレートなし | 済。透かし・文字の重ねなし。人物なし。題名は「グアナバラ湾越し」だが、写っているのは湾ではなく大西洋側の海岸に見える（地名は Commons に記載がないので台本で特定しない） |
| 5 | photo_05_lagos.jpg | ラゴス・マリーナ地区の高層ビル群と、手前の水路に並ぶ船（ナイジェリア）。説明「Skyline of Marina, Lagos city」 | kopee15（Flickr）。Commons への登録は B Enkay 45 | 2024-01-27（Commons の記載） | パブリックドメイン（作者が Flickr で Public Domain Mark を付けたもの：PD-author-FlickrPDM）。URL なし | https://commons.wikimedia.org/wiki/File:Lagos_skyline_with_marina.jpg | 版は 1 つだけ（2024-01-27 B Enkay 45 が登録）。改変なし。thumb 1920×512 を使用。元は 3648×972（横長のパノラマ） | テンプレートなし | 済。透かし・文字の重ねなし。人物なし。かなり横長なので 16:9 では上下に余白か切り取りが要る。ビルの看板やロゴは写真の一部 |
| 6 | photo_06_abuja.jpg | アブジャの街並み。奥にアソ・ロック、左に国立モスクの尖塔、中央に「NATIONAL PLANNING COMMISSION」の建物。カテゴリ「Aso Rock」「Buildings in Abuja」 | Bryn Pinzgauer（Flickr）。Commons への登録は Bantekas | 2012-09-05 | CC BY 2.0 https://creativecommons.org/licenses/by/2.0 | https://commons.wikimedia.org/wiki/File:Abuja,_Federal_Capital_Territory.jpg | 版は 1 つだけ（2014-07-14 Bantekas が登録）。改変なし。thumb 1920×1440 を使用。元は 3648×2736 | テンプレートなし（ファイルページに FoP-Nigeria 系の表示はない） | 済。透かし・文字の重ねなし。人物なし。建物の看板（Oando ほか）は写真の一部 |
| 7 | photo_07_jakarta_traffic.jpg | ジャカルタ南部のガトット・スブロト通りと高層ビル群。遠景がかすんでいる。カテゴリ「Jalan Gatot Subroto」「Skylines in Jakarta」 | Alviansyah Kuswidyatama（Flickr） | 2018-06-27 | CC BY 2.0 https://creativecommons.org/licenses/by/2.0 | https://commons.wikimedia.org/wiki/File:Gatot_Subroto_(Gatsu)_-_Jakarta.jpg | 最新版（2023-09-26 Beao が CropTool で縦を 5% 切り取り。元の登録は 2022-07-17 Brm12）。この最新版を使用。thumb 1920×1370 を使用。元は 3264×2329 | NoFoP-Indonesia の表示あり（インドネシアにはパノラマの自由がない、という Commons の注意書き） | 済。透かし・文字の重ねなし。人物なし。車は流れており「渋滞」の写真ではない。「かすんだ高層ビル群」として使う |
| 8 | photo_08_jakarta_flood.jpg | 北ジャカルタの海沿いのコンクリート護岸と消波ブロック、釣りをする人たち。カテゴリ「North Jakarta」。説明は「Mancing」（釣り）だけ | Romli mohamad（Panoramio） | 2011-02-13 | CC BY 3.0 https://creativecommons.org/licenses/by/3.0 | https://commons.wikimedia.org/wiki/File:Mancing_-_panoramio.jpg | 版は 1 つだけ（2016-11-13 Panoramio upload bot が登録）。改変なし。thumb 1920×1440 を使用。元は 2048×1536 | テンプレートなし | 済。透かし・文字の重ねなし。ただし釣り人が数人はっきり写る（顔は小さいか横向き）。浸水の様子は写っていない。「海岸の護岸」の写真として使う |
| 9 | photo_09_nusantara.jpg | ヌサンタラ（IKN）のガルーダ宮殿（大統領宮殿）と、手前の工事中の敷地。カテゴリ「Garuda Palace」 | Dianrana（自作として登録） | 2025-06-10（Commons の記載） | CC0 http://creativecommons.org/publicdomain/zero/1.0/deed.en | https://commons.wikimedia.org/wiki/File:Istana_Garuda_IKN.png | 版は 1 つだけ（2025-06-10 Dianrana が登録）。改変なし。thumb 1280×716（PNG）を使用し JPEG に変換。元は 1655×926。元画像は HTTP 429 で取得できず、1600px は標準サイズ外で拒否された | テンプレートなし（ファイルページに NoFoP-Indonesia の表示はない。7 と同じくインドネシアの建物） | 済。透かし・文字の重ねなし。人物なし。工事現場の看板は写真の一部。幅 1280px なので 1920px より小さい |
| 10 | photo_10_washington.jpg | ワシントンD.C. 中心部の空撮。ホワイトハウス、ワシントン記念塔、ジェファーソン記念館、リンカーン記念堂、奥にポトマック川。カテゴリ「Potomac River in Washington, D.C.」 | Carol M. Highsmith。出典 Library of Congress（LCCN 2011634330） | 1980〜2006 年の間（Commons の記載） | パブリックドメイン（PD-Highsmith：撮影者が著作権を放棄）。URL なし | https://commons.wikimedia.org/wiki/File:Aerial_view_of_Washington,_D.C.,_looking_south_at_the_Washington_Monument,_Lincoln_Memorial_(to_the_right),_and_the_Potomac_River_in_the_distance_LCCN2011634330.tif | 版は 1 つだけ（2016-10-08 Fæ が登録）。改変なし。TIFF の thumb 1920×1474（JPEG）を使用。元は 6425×4934 | テンプレートなし | 済。透かし・文字の重ねなし。人物なし |

## 依頼どおりにならなかった点

- 2：依頼は Congress Hall か独立記念館。Congress Hall は PD の写真（HABS、1975年、Jack Boucher）が見つかった。しかしフィルムの黒枠があり、歩行者も写っていた。そのため独立記念館（NPS、2009年）にした。予備：https://commons.wikimedia.org/wiki/File:VIEW_OF_NORTH_AND_PART_OF_WEST_ELEVATIONS_FROM_NORTHWEST_CORNER_OF_SIXTH_AND_CHESTNUT_STREETS_WITH_INDEPENDENCE_HALL_AND_OLD_CITY_HALL_IN_THE_BACKGROUND_-_Congress_Hall,_HABS_PA,51-PHILA,6A-26_(CT).tif
- 7：渋滞の写真は条件に合うものが見つからなかった。検索に出た写真は CC BY-SA か小さすぎた。代わりに「かすんだ高層ビル群」の写真にした。
- 8：北ジャカルタの海岸の浸水・地盤沈下の写真は見つからなかった。許可されたライセンスで、場所が確かめられるものがなかった。そのため北ジャカルタの護岸の写真にした（人物あり）。浸水そのものの写真の予備は次のとおり。VOA（米国政府の作品、パブリックドメイン）の 2013-01-17 撮影で、場所はジャカルタ中心部。海岸の浸水ではなく、豪雨による冠水。https://commons.wikimedia.org/wiki/File:VOA_A_car_tries_to_drive_through_Jakarta%27s_flooded_streets.jpg
- 9：大統領府の公式写真（PD Indonesian Government）には工事現場の写真が多くある。しかしジョコ大統領が大きく写っているので使わなかった。
- 見送った写真：Commons の検索で多く出た CC BY-SA のラゴス・ジャカルタ・ブラジリアの写真は、ライセンス条件に合わないので使っていない。

## 使うときの注意

- CC BY の写真（3・6・7・8）は、動画の概要欄などに作者名・ライセンス名・元ページURLを書く。
- 4 の題名は「グアナバラ湾越し」だが、写っているのは大西洋側の海岸に見える。台本で「グアナバラ湾」と言い切る場面には使わない。

## 書き出しでの使用（2026-11-09、Claude）
- **使う（8点）**：01 議事堂、02 独立記念館、03 ブラジリアの国会、04 リオ、05 ラゴス、06 アブジャ、11 キャンベラ（第1作の素材13：Orion Kahza、CC0 https://commons.wikimedia.org/wiki/File:Canberra_from_Mount_Ainslie_Lookout.jpg）。各1回・1カット3秒以内。画面の右上にクレジット（`render/credits.json`）
- **使わない**
  - 07 ジャカルタの通り、09 ヌサンタラのガルーダ宮殿：インドネシアにはパノラマの自由がない（07 のページに NoFoP-Indonesia の表示）。建物が主役の写真を収益化する動画に使うのは避け、地図と図解で見せる
  - 08 ジャカルタ北部の護岸：釣りをする人が大きく写り、「街の一部は沈んでいる」の語りと重なると、写っている人や場所が沈んでいるように見えるため
  - 10 ワシントンの空撮：使う場面がなかった（素材としては残す）
- 02 は議会が開かれた Congress Hall ではなく、隣の独立記念館。画面の説明は「フィラデルフィアの独立記念館」とし、議会の建物とは言わない
- 05（1920×512 のパノラマ）と 11 は拡大して使うため、細部はやや甘い
