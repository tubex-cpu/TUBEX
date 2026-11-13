# Codex向け指示書：「最新AI」版サムネイル（高千穂・伊勢）

リポジトリ `tubex-cpu/TUBEX`、ブランチ `claude/nice-wright-du0dch`。分担：画像はCodex、コピー・タイトル・本編との整合はClaude（すでに確定済み）。

## 作るもの（各1枚。合計2枚）
| フォルダ | 保存先 | コピー（上／中／下） | 背景（本編のAI再現イラスト） |
|---|---|---|---|
| habi-takachiho | `サムネ/thumbnail-ai.jpg` | 最新AIでよみがえる／卑弥呼が死んだころの日食／天岩戸はこの日？ | `public/photos/gen-ancient-eclipse.jpg`（右下に `gen-himiko.jpg` を小さく重ねてもよい） |
| habi-ise | `サムネ/thumbnail-ai.jpg` | 最新AIでよみがえる／箱に手をかけた神職たち／草薙剣を見た者がいた？ | `public/photos/gen-peek.jpg` |

詳しい理由と本編との整合は、各フォルダの `サムネ案.md` の「★2026-11-13 最新AI版」にある。

## デザイン
- 3段：上＝白・大（約96px）、中＝白・小（約56px）、下＝赤・特大（約120〜140px、白い縁取り）。どの段にも太い黒の縁取りをつけ、スマホの小さな表示でも読めるようにする。
- 背景は暗めにする。文字は左側に寄せる。
- 参考：既存の `habi-takachiho/src/thumbnails/Thumbnails.tsx` の Three（文字の配置）。
- 1280×720、JPEG、2MB未満。

## 守ること
- 文言は1字も変えない（本編の判決と合わせてあるため）。変えたいときは理由を完了報告に書く。
- 背景は上の表のファイルだけを使う。新しい生成画像、ネットの画像、競合のサムネは使わない。
- 「解明」「判明」「正体」「描く」、○・△・× の記号は入れない。
- 人物の顔に文字を重ねない。
- コミットして同じブランチにプッシュする：`git add habi-takachiho/サムネ habi-ise/サムネ && git commit -m "高千穂・伊勢：最新AI版サムネ" && git push origin claude/nice-wright-du0dch`

## 完了報告に書くこと
- 2枚のファイル名と、それぞれのコミット。
