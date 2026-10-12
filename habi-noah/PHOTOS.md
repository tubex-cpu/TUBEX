# 実写真の差し替え手順と候補リスト

動画には14か所の「写真の枠」があり、今は図解を表示しています。写真を用意すると、その場面が実写真（ゆっくりズーム＋出典表示つき）に置き換わります。

## 手順
1. 下の候補から、Wikimedia Commons でパブリックドメイン（PD）か CC BY / CC BY-SA の写真を選んでダウンロードする
2. `public/photos/` に置く（例：`public/photos/ararat.jpg`）
3. `src/data/photos.ts` に登録する
   ```ts
   export const photos: Record<string, PhotoEntry> = {
     ararat: {file: 'ararat.jpg', credit: '撮影：○○ / CC BY-SA 4.0 / Wikimedia Commons'},
   };
   ```
4. 書き出し直す。概要欄のクレジットにも同じ出典を追記する

## 写真の枠（ID）と候補
| ID | 場面 | Commonsでの探し方 |
| --- | --- | --- |
| ararat | アララト山 | https://commons.wikimedia.org/w/index.php?search=Mount+Ararat&title=Special:MediaSearch&type=image |
| durupinar | 船の形の地形（ドゥルピナル） | https://commons.wikimedia.org/w/index.php?search=Durupinar&title=Special:MediaSearch&type=image |
| deluge-art | 大洪水の絵画（ドレ「大洪水」など、PDの古典作品） | https://commons.wikimedia.org/w/index.php?search=Gustave+Dore+The+Deluge&title=Special:MediaSearch&type=image |
| noah-art | ノアの方舟の絵画（エドワード・ヒックス「ノアの方舟」1846 など） | https://commons.wikimedia.org/w/index.php?search=Edward+Hicks+Noah%27s+Ark&title=Special:MediaSearch&type=image |
| george-smith | ジョージ・スミスの肖像（19世紀・PD） | https://commons.wikimedia.org/w/index.php?search=George+Smith+Assyriologist&title=Special:MediaSearch&type=image |
| flood-tablet | 大英博物館の洪水書版（ギルガメシュ叙事詩 第11書版） | https://commons.wikimedia.org/w/index.php?search=Flood+tablet+Gilgamesh+British+Museum&title=Special:MediaSearch&type=image |
| ark-tablet | 方舟の作り方を書いた粘土板（Ark Tablet） | https://commons.wikimedia.org/w/index.php?search=Ark+Tablet+British+Museum&title=Special:MediaSearch&type=image |
| quffa | メソポタミアの丸い小舟（クッファ） | https://commons.wikimedia.org/w/index.php?search=quffa+boat&title=Special:MediaSearch&type=image |
| ur-ziggurat | ウルのジッグラト | https://commons.wikimedia.org/w/index.php?search=Ziggurat+of+Ur&title=Special:MediaSearch&type=image |
| woolley-dig | ウルの発掘現場（1920年代） | https://commons.wikimedia.org/w/index.php?search=Woolley+Ur+excavation&title=Special:MediaSearch&type=image |
| black-sea | 黒海の衛星写真（NASA・PD） | https://commons.wikimedia.org/w/index.php?search=Black+Sea+satellite+NASA&title=Special:MediaSearch&type=image |
| ark-encounter | ケンタッキー州の実物大の方舟 | https://commons.wikimedia.org/w/index.php?search=Ark+Encounter&title=Special:MediaSearch&type=image |
| glacier | 氷河・氷床（氷河期のイメージ） | https://commons.wikimedia.org/w/index.php?search=ice+sheet+glacier&title=Special:MediaSearch&type=image |
| kaizuka | 貝塚（加曽利貝塚・水子貝塚など） | https://commons.wikimedia.org/w/index.php?search=%E8%B2%9D%E5%A1%9A&title=Special:MediaSearch&type=image |

※ ライセンス欄が「All rights reserved」「Fair use」のもの、報道写真は使わないでください。
