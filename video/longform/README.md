# 長尺動画の章別制作（20〜30分・60分）

承認済みの「くら寿司・冒頭60秒 第6版」（Issue #17、ブランチ `codex/sushi-v6-reproduction-20261029`）のデザインをそのまま部品にして、長い本編を**章ごと**に作るための仕組み。

台本・音声・素材・カット割りを設定ファイル（JSON）で管理する。章ごとにプレビュー・書き出し・修正・再開ができ、最後に全章をつなぐ。

## 承認済み60秒版との一致（selftest）
- `ch00-opening.json` は、承認済み60秒版の20カットをそのまま設定に書き起こしたもの。
- `python build.py selftest kura-ramen` を実行すると、承認済みパッケージの `render.py` と全1440フレームを画素単位で比べる。2026-10-30 の結果は**1440フレームすべて一致**。
- BGM（`sound.py` の `score.wav`）も、サンプル単位で一致した。

## 準備
```sh
cd video/longform
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python build.py fetch-assets kura-ramen   # 承認済みパッケージ（Git の分割 ZIP）から素材を復元。SHA-256・CRC を照合
docker run -d --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest   # ナレーション（VOICEVOX・無料）
.venv/bin/python build.py check kura-ramen
```
- 素材は `.assets/`、書き出しは `.build/` に置く。どちらも git に入れない。
- 日本語フォントは macOS のヒラギノと Avenir を優先する。ない環境では Noto Sans/Serif CJK JP と Roboto Condensed（無料）を使う（`project.json` の `fonts`）。
- Linux で代わりのフォントを使うと、字形が少し変わる（数字の幅とカンマの形、和文の太さ）。

## 使い方
| コマンド | すること |
|---|---|
| `plan PROJECT [章] [--with-voice]` | 時刻の割り付け、カット数、最長カット、特大数字の回数、ルール違反を表示（声なしなら字数から見積もる） |
| `voice PROJECT 章` | 章の文を VOICEVOX で読み上げる。文ごとにキャッシュし、変えた文だけ作り直す |
| `preview PROJECT 章 [--shot N] [--at 秒]` | 章の全カット一覧（`storyboard.jpg`）、または1枚 |
| `render PROJECT 章 [--shot N ...]` | 章を書き出す。カットごとに入力のハッシュを残し、変わっていないカットは再利用する（中断後の再開・部分修正） |
| `status PROJECT` | 章ごとの進み具合 |
| `concat PROJECT` | 全章をつなぐ（映像は無劣化、音は PCM でつないでから1回だけ AAC にする）→ `.build/<project>/final.mp4` |
| `verify PROJECT [章]` | 1920×1080・24fps・尺・音声・全編デコードを確認 |
| `selftest PROJECT` | 承認済み60秒版と絵・音が一致するか確認 |

## 設定ファイル
```
projects/<name>/project.json        解像度・fps・フォント・声（話者・読み替え）・素材の置き場所・章の順番
projects/<name>/assets.json         素材の台帳：ID → ファイル・種類（photo / ai / character）・出典・作者・ライセンス
projects/<name>/chapters/<章>.json  章の台本・カット割り・音
```

### 章（timing が2種類）
- `fixed`：`shots[].dur`（秒）で並べ、`audio.mix` の完成ミックスを使う。承認済み冒頭がこれ。
- `voice`：`segments[]` が、台本の意味のまとまり1つに当たる。
  - `narration`：読む文の配列。
  - `shots`：その間に見せるカット。
  - 文を読み上げた長さを、`shots` に均等に割り付ける（`weight` があれば比例）。
  - 3秒を超えるカットが出たら lint がエラーにするので、その segment にカットを足す。
  - BGM はオリジナル合成（承認版と同じ作り）。カット境界に小さな転換音、`hit: true` のカットに低音が入る。

### カット
```json
{"note": "メモ", "asset": "diagram:bowls-23",
 "bg": {"type": "photo|tiles|dark|character", ...},
 "layers": [{"type": "eyebrow|title|credit|text|giant|metal|steam|timeline|tick_ring|bowl_grid|bowl_field|arcs|relation|radial", ...}],
 "flash": true, "hit": true, "revisit": "同じ店を別の視点で再訪する理由"}
```
- 写真は1.02倍からゆっくり拡大する。図解は数量アイコン・伸びる線・輪・遠近グリッド・粒子で見せる。
- 要素の種類と数値の意味は `engine/shots.py` の冒頭に書いてある。

## 自動で検査するルール（`check` / `plan` / `render`）
- **1カットは3秒以内**。超えたら、その segment のカットを増やす。
- **直前と同じ主素材は禁止**。同じ写真の拡大率だけを変えてカット数を埋めない。章の中での再使用は、`revisit` に理由（場所・視点・説明対象が違う）を書いたときだけ許す。
- **特大数字は重要な場面だけ**：章の長さ2分につき1回まで（`project.json` の `giant_every_min`）。承認済み冒頭は `giant_max: 4` を明示している。
- **実写と再現画像を混同させない**：
  - 実写には「実写：場所 ／ 作者・ライセンス」の表記と、`assets.json` の出典・作者・ライセンスが必要。
  - AI 再現画像には「再現イメージ」などの表記が必要。

自動で検査しないので、目で確かめること（DESIGN_SPEC と CLAUDE.md より）：
- 黒いキャラクターの目は白だけにする。黒い瞳とピンクの頬は付けない。
- 白い背景に小さい文字の説明スライドへ戻さない。
- 字幕を全文常に出さない。
- 架空の推移や実績の図を作らない。

## 長尺の作り方
1. 台本を確定する（出典付き・言い切り）。社長の承認を受ける。
2. 台本を章に分ける。`chapters/chNN-*.json` に、segment ごとの文とカットを書く。
   - 20分で最低400カット、30分で最低600カットが要る。
3. 実写の写真を集める。Wikimedia Commons などで、ライセンスと出典を確かめてから `assets.json` に登録する。
   - AI の再現画像が必要なカットは、リストにして Codex に依頼する。Claude Code は画像を生成しない。
4. 章ごとに `plan` → `voice` → `preview` → `render` → `verify` を回す。直したら同じ章の `render` を再実行する（変えたカットだけ描き直す）。
5. 全章ができたら `concat` → `verify`。

## 動作確認用のプロジェクト
`projects/systemtest` は仕組みの確認用で、本編ではない。

- 承認済み冒頭と、同じナレーションを VOICEVOX（玄野武宏）で読み直した章をつなげている。
- 声の割り付け・3秒ルール・BGM の生成・章の連結を確かめる。
- 実行すると `.build/systemtest/final.mp4` ができる（100.96秒）。
