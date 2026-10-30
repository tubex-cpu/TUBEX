---
name: habi-video
description: ハビ判事チャンネルの動画（約1時間・Remotion・VOICEVOX）を、企画から納品まで同じ手順で作る。「次の企画」「動画を作って」「台本」「レンダリング」「完成動画」「タイトル・概要欄」「サムネ」など、ハビ判事の動画制作に関わる依頼で使う。
---

# ハビ判事 動画制作スキル

ルールは `CLAUDE.md` がすべての基準（企画・台本・素材・音声・テロップ・納品）。このスキルは、その通りに作るための**手順と道具**をまとめたもの。迷ったら `CLAUDE.md` を優先する。
画づくりの最新例は `habi-genko/`（元寇判決：テレビ向けの全画面図解・映画風の写真・章扉・出典は画面に出さない）。`src/components/Cinema.tsx`（FilmLook・Telop・Stage・ClueOpener）と `GenkoArt*.tsx` を下敷きにする。地図は `habi-mu/`（ムー大陸判決）の `scripts/gen_maps.py`（Natural Earth の陸地・海底の深さから下絵を作る）と `src/components/MuMap.tsx`（`GeoMap`：画面いっぱいの地図＋ピン・航路）を下敷きにする。図解の舞台は `habi-mu/src/components/Scenery.tsx` の `Visual`（画面いっぱい・上に問いの帯）。写真はWikimediaの標準サイズの縮小版で取る（`scripts/fetch-photos-local.py`。Actionsが混んでいるとき用）。

やりとりはすべて日本語。ユーザーは往復を少なくしたいので、決められることは決めて進め、要所だけ見せる。

## 0. 流れ（ユーザーに見せる区切り）

1. 企画 → **サムネのコピー3案（3段・速報／逆張り／恐怖）とタイトル案を出す**。決まるまで制作に入らない。
2. 台本（約22,000字・約1時間） → 見せる。
3. 素材・音声・場面づくり → 静止画で確認。
4. 書き出し（3〜4時間） → 完成したら納品物一式を渡す。

ユーザーはよく「完成したら教えて」と言う。そのときは進み具合（何区間目か・完成見込み時刻）を短く答えて待つ。

## 1. 企画
- 誰もが学校で習った日本の謎 × その年の最新の発掘・研究・ニュース。直前の企画と時代・遺跡の種類が似ないもの。マニアックすぎる題材は避ける。
- 最新ニュースは WebSearch で必ず裏を取る（日付・出典つき）。
- サムネは3段：上＝白・大（題材）、中＝白・小（ひとこと）、下＝赤・特大（フック）。答えを言わず疑問・矛盾で。事実を超えない（「発見」は事実どおりのときだけ、「誰も入れない」のような言い過ぎは避ける）。`サムネ案.md` に残す。
- サムネ画像の作り込みはCodexに頼む（`habi-nintoku/Codex指示書_サムネ.md` が雛形：競合分析→コピー・デザイン・画像のブラッシュアップ、使ってよい事実と画像の一覧、守ること）。

## 2. プロジェクトの用意
```sh
cp -r habi-nintoku habi-<題材>      # node_modules・out・完成動画・public/photos・public/voice は消して作り直す
cd habi-<題材> && ln -s ../habi-noah/node_modules node_modules   # 無ければ npm install
```
作るための道具（`gen_photos.py`・`gen_scenes.py`・`gen_video.py`・`gen_youtube.py`）は `.claude/skills/habi-video/scripts/` にある仁徳天皇陵版のテンプレート。`habi-<題材>/scripts/` にコピーし、場面・素材・文言・BGMの区切りを書き換えて使う（以下の `scripts/gen_*.py` はそのコピーのこと）。
`package.json` の名前、`src/Root.tsx` のコンポジションID（例 `HabiNintoku`）、`src/Habi*Video.tsx` を題材に合わせて変える。ハビ判事のイラストは `habi-sumer/public/habi/`（承認済み）を使う。

## 3. 台本 `scripts/script.txt`
- 場面の見出しは `0:00 見出し` の行。並びは「謎の先出し → ハビ判事登場 → 手がかり（判決つき・数は自由） → 本当の物語 → まだ解けていない謎 → まとめ → 締め」。
- 1行＝1文＝字幕1つ（場面の `from/to` はこの行番号で指定する）。
- **冒頭は没入感を最優先**（最後は「最新の研究・技術が導いた驚くべき発見」への期待で締める。「今夜は長い法廷になる」は使わない）：いちばん衝撃的な事実から入り、「本当に〜なのか」「なぜ今も解けないのか」「〜でないなら誰が」「ではどこに」のように問いを重ね、最後に今年の新事実で引き込む。冒頭で出した問いには本編で必ず答える。
- 判決は「正しい／半分正しい／まちがい」。挨拶・判決・まとめ・締めは前作の定型文（`habi-nintoku/scripts/script.txt`）を踏襲。前回の話・次回予告は入れない。
- 裏が取れない話は使わないか「〜と言われている／〜と考える研究者もいる」。

## 4. 音声 `scripts/build-voice.py`
```sh
# Docker が止まっていたら（このコンテナでは手で起こす）
(setsid nohup dockerd > /tmp/dockerd.log 2>&1 &); sleep 5
docker run -d --rm --name vv -p 50021:50021 voicevox/voicevox_engine:cpu-latest
python3 scripts/build-voice.py        # 変わった行だけ合成し直す（ハッシュでキャッシュ）
```
- `IDS` を場面の並びにする。`SPEED = 0.97`。
- 合成の前に、固有名詞・一字の漢字・数字＋単位を VOICEVOX の `audio_query` の `kana` で確かめ、まちがいは `READING` に足す（例：柵→さく、棺→ひつぎ、主→あるじ、宋書→そうじょ）。新しい行を足したら必ず確かめる。
- 出力：`public/voice/*.mp3`、`src/data/captions.ts`・`subtitles.ts`・`timeline.ts`。

## 5. 写真
- `scripts/photo-picks.json`（保存名 → Commonsのファイル名）をプッシュすると、GitHub Actions（`.github/workflows/fetch-photos.yml`）が写真と `credits.json` を同じブランチにコミットする。そのあと `git pull`。
- Commons検索は search API を使い、429が出たら間をあける。取れた写真は必ず目で見る（題名と中身が違う写真があった：気球の空撮のはずが地上の写真、記念碑の看板、360度写真など）。
- `scripts/gen_photos.py` で `credits.json` → `src/data/photos.ts`（日本語の説明 `desc` を題材に合わせて書く）。

## 6. 場面・図解
- 図解は `src/components/<題材>Art1〜N.tsx`（SVG＋Remotionのアニメ）。写真で見せられないもの（位置関係・年表・数字・説の対比）だけ図解にする。
- `scripts/gen_scenes.py` の `S` に場面ごとのビート `(from, to, 'p'写真/'a'図解/'v'判決, ID, テロップ, 動き)` を書き、`src/scenes/*.tsx` を作る。**同じ写真・図解の2回使用はエラーで止まる**（dup）。
- テロップは答えを言わない疑問形。人の顔に重ねない（顔が上なら `labelBottom`）。
- `scripts/gen_video.py` で `Habi*Video.tsx`（BGM前半・中盤・後半の区切り）と `Root.tsx`（720p用ラッパーも含む）を作る。
- 文字を変えたら `python3 scripts/subset-fonts.py`、最後に `npx tsc --noEmit`。
- 確認は静止画で：`npx remotion still <場面ID> out.png --frame=N --scale=0.5 --browser-executable=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell)`（ふつうの chromium は起動しない）。

## 7. BGM
`scripts/make-bgm.py`（合成・オリジナル）。前半・中盤・後半の3曲、それぞれ受け持つ区間より長い通し曲（ループしない）。

## 8. 書き出しと納品
```sh
setsid nohup bash .claude/skills/habi-video/scripts/render.sh habi-<題材> <1080pのコンポジションID> > /tmp/render.log 2>&1 < /dev/null & disown
```
- 10分ずつ書き出す（1時間を一度に書くと Node がメモリ不足、音声もブラウザが落ちる）。1080pは1区間約21分。全体で約3〜4時間。止まったら同じコマンドで続きから。
- 進み具合は Monitor で `tail -F render.log | grep -E --line-buffered "chunk|audio|encode|full|DONE|rror|Killed"`（30分で切れるので張り直す）。
- できたら：分割ファイル・`.sha256`・`join.sh` を `habi-<題材>/完成動画/` にコミットしてプッシュ（1回のプッシュが2分を超えることがある）。確認版 `out/<名前>-preview.mp4` は SendUserFile で送る。
- Codexにダウンロードしてもらうときは `habi-nintoku/Codex指示書_動画ダウンロード.md` を雛形に（sparse clone → `sh 完成動画/join.sh` → `OK` を確認）。
- `scripts/gen_youtube.py` で `youtube.md`（タイトル3案・概要欄・チャプター・参考資料・写真クレジット・「VOICEVOX:玄野武宏」）。**概要欄はYouTubeの上限5000字以内**（写真クレジットはライセンスごとに作者名をまとめ、写真ごとの一覧は `写真クレジット一覧.md` に置いてリンクする。例 `habi-genko/scripts/gen_youtube_genko.py`）と `台本_<題材>.txt`（見出しに実際の時刻）を作る。**チャプター名は短く、答えを言わないフックの言い方**（例「誰も確かめていない墓」「150年、行方不明の宝」「閉廷」）。

### 納品で渡すもの
完成動画のGitHubリンク（完成動画フォルダ）、確認版（チャット）、タイトル案、概要欄（チャプター付き）、時刻入り台本、サムネ案。

## 9. つまずいた所
- `pkill -f` や `pgrep -f "パターン"` は、そのパターンを含む自分のシェルまで殺す（終了コード144）。PIDを確かめて `kill` する。待ちループの `pgrep -f` も自分に当たって終わらなくなる。
- 長い処理は `setsid nohup … & disown` で切り離す（ツールの背景実行は2時間で止まる）。
- `--scale=0.6667` で720pにすると高さが720.036になり失敗する → 720p用のラッパーコンポジションを使う。
- `rm -f $変数/*` は安全確認で止められる。リテラルのパスで書く。
- 書き出し中に元のシェルスクリプトを書き換えると、動いている bash が壊れた行を読む。書き換えは止めてから。
- ディスクは割り当て制。足りなくなったら、終わった企画の `habi-*/out/` や古い `*.mbtree` を消す。
- 作業の途中でもコミットしていない変更があると止まれない（stop hook）。区切りごとにコミットしてプッシュする。
