# Codex向け指示書：仁徳天皇陵判決の完成動画（1080p）をダウンロードして1本に戻す

完成動画（1080p・59分29秒・約578MB）は、GitHubの1ファイル100MB制限のため、6つに分割して置いてある。
分割は `split` でバイト単位に切っただけなので、`cat` でつなげば元のファイルとまったく同じになる（再圧縮なし・画質劣化なし）。

- リポジトリ：`tubex-cpu/TUBEX`
- ブランチ：`claude/nice-wright-du0dch`
- フォルダ：`habi-nintoku/完成動画/`
  - `habi-nintoku-1080p.mp4.part1` 〜 `part6`（part1〜5 は各97,000,000バイト、part6 は92,641,056バイト）
  - `habi-nintoku-1080p.mp4.sha256`（元のファイルのSHA-256）
  - `join.sh`（つないで確かめるスクリプト）

## 手順

### 1. ダウンロード（必要なフォルダだけ取る）
```sh
git clone --depth 1 --branch claude/nice-wright-du0dch --filter=blob:none --sparse https://github.com/tubex-cpu/TUBEX.git
cd TUBEX
git sparse-checkout set habi-nintoku/完成動画
```
すでにクローン済みなら：
```sh
git fetch origin claude/nice-wright-du0dch && git checkout claude/nice-wright-du0dch && git pull
```

### 2. つないで確かめる
```sh
sh habi-nintoku/完成動画/join.sh
```
最後に `habi-nintoku-1080p.mp4: OK` と出れば成功。`habi-nintoku/完成動画/habi-nintoku-1080p.mp4` ができる。

`join.sh` を使わずに手でやる場合：
```sh
cd habi-nintoku/完成動画
cat habi-nintoku-1080p.mp4.part1 habi-nintoku-1080p.mp4.part2 habi-nintoku-1080p.mp4.part3 \
    habi-nintoku-1080p.mp4.part4 habi-nintoku-1080p.mp4.part5 habi-nintoku-1080p.mp4.part6 > habi-nintoku-1080p.mp4
sha256sum -c habi-nintoku-1080p.mp4.sha256      # macOS は: shasum -a 256 -c habi-nintoku-1080p.mp4.sha256
```
Windows（PowerShell）の場合：
```powershell
cd habi-nintoku\完成動画
cmd /c copy /b habi-nintoku-1080p.mp4.part1+habi-nintoku-1080p.mp4.part2+habi-nintoku-1080p.mp4.part3+habi-nintoku-1080p.mp4.part4+habi-nintoku-1080p.mp4.part5+habi-nintoku-1080p.mp4.part6 habi-nintoku-1080p.mp4
Get-FileHash habi-nintoku-1080p.mp4 -Algorithm SHA256   # habi-nintoku-1080p.mp4.sha256 の値と同じならOK
```

## 守ること
- つないだ `habi-nintoku-1080p.mp4`（578MB）はコミットしない、プッシュしない（GitHubの100MB制限を超える）。
- 分割ファイルの順番を変えない（part1→part6の順）。
- SHA-256が一致しないときは、ダウンロードし直す。

## 完了報告
できあがったファイルの場所・サイズ（577,641,056バイト）・SHA-256の確認結果（OK）を書く。
