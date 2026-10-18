# Codex向け指示書：完成動画のダウンロードとサムネ制作

リポジトリ `tubex-cpu/TUBEX`、ブランチ `claude/nice-wright-du0dch` で作業する。
対象の動画フォルダ（例：`habi-yamatai`、`habi-pyramid`）は、依頼文で指定されたもの。指定がなければ `habi-*/完成動画/` にある全部。

## 1. 完成動画のダウンロード（Macで動くCodexのとき）
1. ブランチを最新にする：`git fetch origin claude/nice-wright-du0dch && git checkout claude/nice-wright-du0dch && git pull`
2. `<フォルダ>/完成動画/<フォルダ>.mp4` を `~/Desktop/ハビ判事/` にコピーする（フォルダが無ければ作る）。
3. 1920×1080・約20分・100MB未満の1ファイル。結合は不要。
4. クラウドで動いているときは、この手順は飛ばす（Macに保存できないため）。

## 2. サムネイル制作
1. `<フォルダ>/サムネ案.md` の推奨文言・素材・守ることに従って、YouTubeサムネイルを作る。
2. 仕様：1280×720、JPEG、2MB未満。
3. 素材は `サムネ案.md` に書かれたもの（承認済みのハビ判事イラストと、許可済みの写真）だけを使う。ほかの画像は使わない。
4. 保存先：`<フォルダ>/サムネ/thumbnail.jpg`。別案も作った場合は `thumbnail-2.jpg` などにする。
5. コミットして同じブランチにプッシュする：`git add <フォルダ>/サムネ && git commit -m "<フォルダ>：サムネイル" && git push origin claude/nice-wright-du0dch`

## 完了報告に書くこと
- 保存した動画の場所（ダウンロードした場合）
- 作ったサムネイルのファイル名と、使った文言・素材
- プッシュしたコミット
