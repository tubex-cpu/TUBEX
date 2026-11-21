# サムネ素材記録 — 2026-11-15

対象：PR #20、ラフ R1/R2/R3。完成版・公開承認ではありません。

## 主役画像
- 種別：新規AI生成（実在の人物・実写の事件や研究の記録ではない）。
- ツール：このチャットの組み込み image_gen。外部の画像生成API・APIキー・有料素材・追加クレジット購入は使っていない。既存チャット内の生成機能のみを使用し、追加購入0。契約プランの請求明細自体は確認していない。
- R1：架空の5職種と同一の金色封筒。R2：職業の小物と同一封筒4枚。R3：無人の病院と封筒。
- 他者の写真・キャラクター・ロゴ・紙幣図柄は不使用。

## 文字組み・加工
- Noto Sans JP、weight 900（Black）、SIL Open Font License 1.1。
- 公式フォント：https://github.com/google/fonts/tree/main/ofl/notosansjp
- ライセンス：https://github.com/google/fonts/blob/main/ofl/notosansjp/OFL.txt
- 取得日：2026-11-15。フォントの追加購入不要。
- 生成背景と文字を別工程で合成。1280×720へリサイズ、白の「全員同じ給料」、朱の「誰が働く？」、濃紺の太フチ、朱の「改」印を自作。右下に重要な文字は置いていない。
- 指示書のコピー固定を優先し、3案のコピーは共通。構図と主役表現を変えた。
- 元画像1672×941のため、1280×720への微小な縦横比調整あり。
- Pillowで文字・自作印を組版。生成画像の内容を写真加工して実写と偽る処理はしていない。

## 生成プロンプト

### R1
Use case ads-marketing. Create a premium cinematic photorealistic YouTube thumbnail BACKGROUND, 16:9 landscape 1280x720. Japanese speculative social documentary about everyone earning identical salaries. R1: five fictional Japanese adult workers standing in a horizontal row on a predawn Tokyo street: doctor in white coat, construction worker hardhat, convenience store clerk plain apron, office worker suit, security guard plain navy uniform. Each holds an IDENTICAL large matte golden ochre salary envelope at waist level, facing camera. Doctor left looks down troubled at envelope; others look forward uncertain. Subjects waist-up, occupy lower 65%, strongly lit faces and envelopes, dark navy city defocused background, realistic skin and fabric, dramatic warm rim light, restrained vermilion accents. Upper 35% clean very dark navy negative space for separate typography. No lettering, no text, no numbers, no logos, no money bills, no flags, no cartoon, no recognizable people. Bottom right 15% has no important detail. Five people and five identical envelopes clear even small. No collage frame.

### R2
Use case ads-marketing. Cinematic photorealistic still life background for Japanese YouTube thumbnail about everyone earning identical pay. 16:9 landscape. R2 concept: dark navy desk, four identical large matte golden ochre salary envelopes arranged in a striking diagonal row across LOWER TWO THIRDS, each equal size clearly visible, different job props: stethoscope on left envelope, yellow construction hardhat behind second, plain blank employee ID badge third, black security baton beside fourth. Envelopes clearly broad blank front surface for a red stamp added later. Low oblique overhead camera, close detailed paper fibers and metallic stethoscope, strong warm spotlight making gold envelopes luminous against very dark blue shadows. Upper 38% clean empty navy background for typography. Distinct readable silhouettes at tiny size, simple composition. No people, no money bills, no logos, no letters, no text, no flags, no cartoon. Leave bottom right unobtrusive and free of important objects. Premium dramatic advertising photograph.

### R3
Use case ads-marketing. Premium cinematic photorealistic 16:9 YouTube thumbnail background. R3 Empty workstation, Japanese hospital nursing station at night, absolutely no people. Large matte golden ochre salary envelope prominently alone on counter in lower left-center foreground, with a stethoscope next to it. Foreground envelope very large clear focal point, warm focused light, believable paper texture. Behind it empty desk chairs, unoccupied reception and recognizable hospital corridor, cool navy blue lighting, quiet unsettling absence, no horror or gore. Camera low counter-height perspective with corridor vanishing to the right. Upper left 40% dark uncluttered navy space for separate title typography, hospital architecture mostly right and below. No text, no letters, no logos, no flags, no banknotes, no cartoon. Bottom right no important detail. Professionally art-directed realistic film still, high contrast gold subject versus deep blue scene.

## 納品
- `thumbnail_rough/R1_20261115_v1.png`：5人の職業差と同一封筒。主案。
- `thumbnail_rough/R2_20261115_v1.png`：物撮り、職業小物で比較。
- `thumbnail_rough/R3_20261115_v1.png`：無人の病院、働き手が不足する道を示唆。
- 各 `*_320.png`：320×180縮小確認用。
- `comparison_320.png`：縮小版比較。
- 3案とも指定コピーの文字欠け・はみ出しなし、縮小視認性を確認。Claude監査前。
- この案件は `script.json` 不使用のため、PRの個別指示どおり画像と記録で提出。本編や既存サムネは変更していない。
