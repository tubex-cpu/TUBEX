# バナー v1（社長確認・Claude監査待ち）

制作日：2026-10-17。採用アイコンの方向を継承したバナー案。公開・チャンネルへの設定は未実施。

## ファイルと仕様
- life-banner-v1.png：いのちの輪郭、2560×1440、5,892,809 bytes。
- night-banner-v1.png：ナイトオンザプラネット、2560×1440、4,890,505 bytes。
- 各 -mobile.png は中央1540×420を幅390pxに縮小。-desktop.png は中央2560×420を幅1280pxに縮小。-tv.png は全体を幅960pxに縮小。
- 公式仕様：https://support.google.com/youtube/answer/10456525?hl=ja （2026-10-17確認）推奨2560×1440、最小2048×1152、最小サイズ時の文字安全範囲1235×338、6MB以下。
- 本制作は中央1540×420を文字安全範囲として使用。デバイス画像は想定クロップのシミュレーション。実機やYouTube Studioのアップロードプレビューは未確認。

## 自己確認
- 幅390pxの中央切り抜きで両チャンネル名・コピーが欠けず読める。
- 生物の眼球の外縁は端に接するが、横長瞳孔と琥珀色の虹彩を識別できる。宇宙は青い地平線と朝日が残る。
- TVは上下の背景を含む。文字は中央に集約。実在種・実写観測画像を表すものではないブランド用生成画。
- コピーは生物「見慣れた生きものを、もう一歩深く。」宇宙「いつものことを、遠い星で。」

## 制作・費用
Codex内蔵 image_gen で生成し、自ら生成した採用アイコンを参照。第三者の画像は入力していない。有料API・APIキー・追加クレジット購入・有料素材は使用していない。追加購入なしのアプリ内画像生成経路のみ使用（契約の請求画面を独立監査したという意味ではない）。Sharpで寸法調整・PNG保存・確認用切り抜きのみ実施。

## 生物・生成プロンプト全文
Create full 16:9 YouTube banner canvas 2560x1440, NOT a panoramic strip. Use the supplied original generated animal eye as identity reference. Dark forest-green and warm bronze naturalistic macro art, elegant quiet documentary look. VERY IMPORTANT typography and subject are compact in the middle of tall canvas, with empty atmospheric background above and below. Put a luminous amber animal eye center at x750 y720, iris diameter 260px, surrounding dark brown fur fading seamlessly into green near-black shadows. Do not make a giant eye filling the height. On its right place exact title "いのちの輪郭" on one line from x1000 to1850 at y650..735, clean large ivory Japanese type. Below at y780 exact tagline "見慣れた生きものを、もう一歩深く。" in legible ivory text about 42px, total width less than1000px. ALL important content must fit x540..1980 y560..880 of 2560x1440. Top 500px and bottom500px are dark soft forest atmosphere and subdued fur/organic texture, NO TEXT there. No extra elements, animals, anatomical lines, ornament, border, frame, watermark or fake scientific diagram. Preserve natural warmth, amber sparkle, not scary. The center horizontal strip should look finished if everything above y509 and below y931 is cropped away. Full bleed 16:9 image, accurate Japanese, do not make extra-wide aspect ratio.

## 生物・配置修正プロンプト全文
Edit this banner preserving the exact full 16:9 canvas, animal eye, forest background, colors, textures and Japanese wording. ONLY reduce both typography lines horizontally and proportionally in size by 22%, keeping their left starting position at about 44% canvas width. The title must end before 77% canvas width, not 85%. Exact title いのちの輪郭 and exact tagline 見慣れた生きものを、もう一歩深く。 Keep title centered vertically around 48% canvas height, tagline at58%. Both lines must fit within x44%..78% and y43%..61%. Crucial: no text outside this area because mobile crops the sides. Do not enlarge or move the eye. Maintain beautiful refined ivory Japanese typography and generous dark negative space right of text. No other changes.

## 宇宙・生成プロンプト全文
Create a finished Japanese YouTube channel banner canvas LANDSCAPE 16:9 exactly 2560x1440, NOT an extra-wide strip. Use this own generated planetary dawn icon as style reference. Entire full canvas is deep navy space with a sweeping blue atmospheric planetary horizon through lower half, copper-charcoal terrain toward bottom right. One bright white dawn near x1750 y830. The CENTRAL HORIZONTAL BAND ONLY carries typography: exact title "ナイトオンザプラネット" in large refined clean ivory Japanese typography, ONE line centered x1280 y675, total title width maximum 1250px and height 95px. Exact smaller tagline "いつものことを、遠い星で。" centered x1280 y785 about 46px tall. Text must remain between x620 and1940, y590 and830, on 2560x1440 canvas. Keep behind text dark and uncluttered, no glare over text. Top 500px are almost empty atmospheric navy space and bottom 500px extend planet surface, these are TV-only expendable areas; do not enlarge the central typography to fill the canvas. Full bleed photo-realistic matte cinematic depth, no borders, no device mockups, no guide lines, no stars scattered, no spacecraft, people, lens flare streaks, numbers, other text, logo, watermark. Calm majestic science aesthetic, not SF game. Composition MUST work when cropped to center 1540x420 region. This is a full 16:9 banner asset not a picture of a banner.

