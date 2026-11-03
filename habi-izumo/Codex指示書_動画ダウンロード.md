# Codex向け指示書：出雲判決の完成動画（1080p）をダウンロードして1本に戻す

完成動画（1080p・1時間0分49秒・約934MB）は、GitHubの1ファイル100MB制限のため、11個に分割して置いてある。
分割は `split` でバイト単位に切っただけなので、`cat` でつなげば元のファイルとまったく同じになる（再圧縮なし・画質劣化なし）。

- リポジトリ：`tubex-cpu/TUBEX`
- ブランチ：`claude/nice-wright-du0dch`
- フォルダ：`habi-izumo/完成動画/`
  - `habi-izumo-1080p.mp4.part01` 〜 `part11`（part01〜10 は各97,000,000バイト、part11 は8,655,793バイト）
  - `habi-izumo-1080p.mp4.sha256`（元のファイルのSHA-256）
  - `join.sh`（つないで確かめるスクリプト）

## 手順

### 1. ダウンロード（必要なフォルダだけ取る）
```sh
git clone --depth 1 --branch claude/nice-wright-du0dch --filter=blob:none --sparse https://github.com/tubex-cpu/TUBEX.git
cd TUBEX
git sparse-checkout set habi-izumo/完成動画
```
すでにクローン済みなら：
```sh
git fetch origin claude/nice-wright-du0dch && git checkout claude/nice-wright-du0dch && git pull
```

### 2. つないで確かめる
```sh
sh habi-izumo/完成動画/join.sh
```
最後に `habi-izumo-1080p.mp4: OK` と出れば成功。`habi-izumo/完成動画/habi-izumo-1080p.mp4` ができる。

`join.sh` を使わずに手でやる場合：
```sh
cd habi-izumo/完成動画
cat habi-izumo-1080p.mp4.part01 habi-izumo-1080p.mp4.part02 habi-izumo-1080p.mp4.part03 \
    habi-izumo-1080p.mp4.part04 habi-izumo-1080p.mp4.part05 habi-izumo-1080p.mp4.part06 \
    habi-izumo-1080p.mp4.part07 habi-izumo-1080p.mp4.part08 habi-izumo-1080p.mp4.part09 \
    habi-izumo-1080p.mp4.part10 habi-izumo-1080p.mp4.part11 > habi-izumo-1080p.mp4
sha256sum -c habi-izumo-1080p.mp4.sha256      # macOS は: shasum -a 256 -c habi-izumo-1080p.mp4.sha256
```
Windows（PowerShell）の場合：
```powershell
cd habi-izumo\完成動画
cmd /c copy /b habi-izumo-1080p.mp4.part01+habi-izumo-1080p.mp4.part02+habi-izumo-1080p.mp4.part03+habi-izumo-1080p.mp4.part04+habi-izumo-1080p.mp4.part05+habi-izumo-1080p.mp4.part06+habi-izumo-1080p.mp4.part07+habi-izumo-1080p.mp4.part08+habi-izumo-1080p.mp4.part09+habi-izumo-1080p.mp4.part10+habi-izumo-1080p.mp4.part11 habi-izumo-1080p.mp4
Get-FileHash habi-izumo-1080p.mp4 -Algorithm SHA256   # habi-izumo-1080p.mp4.sha256 の値と同じならOK
```

## 守ること
- つないだ `habi-izumo-1080p.mp4`（934MB）はコミットしない、プッシュしない（GitHubの100MB制限を超える）。
- 分割ファイルの順番を変えない（part01→part11の順）。
- SHA-256が一致しないときは、ダウンロードし直す。

## 完了報告
できあがったファイルの場所・サイズ（978655793バイト）・SHA-256の確認結果（OK）を書く。
