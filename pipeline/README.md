# TUBEX 制作パイプライン（3チャンネル）

| チャンネル | 設定 | 本数・尺 |
|---|---|---|
| ① ハビ判事の都市伝説ジャッジ | `channels/habi-judge/CHANNEL.md` | 週2〜3本・20〜30分 |
| ② 届いた書類と通帳（退職・年金のお金。新規・社長の目標の対象） | `channels/tsucho/CHANNEL.md` | 週3本＋臨時・25〜35分 |
| ③ その体、設計できる？（生き物。新規・社長の目標の対象） | `channels/ikimono/CHANNEL.md` | 週3本・15〜20分＋月1本の総集編 |
| （保留）江戸の暮らし | `channels/edo-otsukai/CHANNEL.md` | 2026-10-13 保留 |

構成・口調・判決ルールなどチャンネル固有の決まりは `CHANNEL.md` が正。**ショート動画は作らない（長尺のみ。社長指示 2026-10-13）**。この README は全チャンネル共通の工程と費用ルール。

社長（オーナー）は **「承認」だけ** をする。それ以外の工程は Claude Code と ChatGPT Codex が自動で進める。

## 追加費用ゼロの原則（必ず守る）

| 項目 | ルール |
|---|---|
| Claude | Pro/Max **サブスク枠内のみ**。claude.ai の設定で「追加使用量（Extra usage）」を **OFF**。上限に達したら止まって待つ |
| ChatGPT Codex | Plus/Pro **プラン枠内のみ**。Codex のクレジット購入・自動チャージは **しない**。上限に達したら止まって待つ |
| API キー | 原則 **使わない**（Anthropic / OpenAI API などは従量課金のため）。**例外：YouTube Data API v3 のキーだけ可**（社長承認 2026-10-10）。条件：Google Cloud に支払い方法を登録しない／キーは YouTube Data API v3 のみに制限／Claude Code の環境設定にのみ保存し、リポジトリ・チャットに書かない／無料の1日上限で止まる（`pipeline/scripts/yt_research.py`） |
| GitHub Actions | **使わない**（無料枠超過のリスクを避ける）。自動実行は Claude Code の Routine（サブスク枠内）で行う |
| 素材 | 有料素材・有料 TTS・画像生成 API は使わない。図版は SVG で自作、フォントは OFL（Noto Sans JP / Dela Gothic One）。ナレーションは Open JTalk（音声 CC BY 3.0：概要欄と動画末尾にクレジット必須）、BGM は numpy で自作合成 |
| Remotion | 個人・3名以下の会社は無料ライセンス。人数が増えたら要確認 |

## 役割分担

| 担当 | サムネ以外の全工程 | サムネ |
|---|---|---|
| **Claude Code** | **実施役**（作る） | **監査役**（厳しくチェック） |
| **ChatGPT Codex** | **監査役**（厳しくチェック） | **実施役**（作る） |

- 監査は「合格 / 差し戻し」の2択で判定する。差し戻しは実施役が直して再提出し、合格するまで次の工程に進まない。
- 監査役は自分で直さない（指摘だけ）。直すのは必ず実施役。
- 判定基準は、Codex 側が `AGENTS.md`、Claude 側（サムネ監査）が `CLAUDE.md`。

## 工程

| # | 工程 | 実施 | 監査 | 成果物（`episodes/<id>/`） | 社長の確認 |
|---|---|---|---|---|---|
| 0 | チャンネル設計（新チャンネルのみ） | Claude | Codex | `channels/new-channels/00_genre_research.md`（ジャンル5案・実数値つき） | **ゲート0：ジャンルを選ぶ**（2026-10-13 済：案1〜3を選択 → 同日、②③の2つに絞り込み） |
| 1 | リサーチ | Claude | Codex | `01_research.md`（出典付きの事実のみ） | – |
| 2 | 競合調査 | Claude | Codex | `02_competitors.md` | – |
| 3 | 企画立案 | Claude | Codex | `03_plan.md` | **ゲートA：企画OK？** |
| 4 | タイトル | Claude | Codex | `04_titles.md`（3案＋推奨） | – |
| 5 | 台本 | Claude | Codex | `script.json`（映像の唯一の元データ）＋ `05_script.md` | – |
| 6 | サムネ | **Codex** | **Claude** | `06_thumbnail.md`（狙い・競合の探し方）→ `06b_thumbnail_benchmark.md`（競合サムネ5本以上の分析・採用パターン・差別化）→ `video/src/Thumbnail.tsx` ＋ `script.json` の `thumbnail` ＋ `thumbnail.png` | – |
| 7 | 動画制作 | Claude（Remotion） | Codex | `video/out/<id>.mp4` | **ゲートB：公開OK？** |

社長が止めるのは **ゲートA（企画）とゲートB（完成品）の2回だけ**（新チャンネルの立ち上げ時のみゲート0も）。それ以外は AI 同士の監査で進む。

台本（5）をサムネ（6）より先にするのは、サムネで約束する内容が台本で回収されているかを監査で確認できるようにするため。

## 自動で回る仕組み

```
[毎朝 Routine 起動 (Claude Code / サブスク枠)]
   └─ pipeline/queue.md と STATUS.md を読む
       ├─ 工程1〜5, 7：Claude が作成 → PR を作成/更新 → PR に「@codex review」
       │     └─ Codex が監査（ChatGPT プラン枠）→ 差し戻しなら次回 Claude が修正して再提出
       ├─ 工程6：Claude が PR に「@codex 06_thumbnail.md の指示でサムネを作成して」とコメント
       │     └─ Codex が作成（ChatGPT プラン枠）→ 次回 Claude が監査 → 差し戻しなら Codex に再依頼
       └─ ゲートに到達したら停止し、PR で社長に確認依頼
[社長] PR を見て Approve / マージ = 承認。修正指示は PR コメントで
[次の Routine] 承認済みなら次の工程へ
```

- 状態は各エピソードの `STATUS.md` のチェックボックスで管理する（どこまで進んだか一目で分かる）。
- 利用上限に当たった場合は何もせず終了し、次回の Routine で再開する（課金して続行はしない）。
- 同じ成果物で差し戻しが3回続いたら、AI 同士で堂々巡りしないよう停止して社長に判断を仰ぐ（例外的な停止）。
- 競合調査・競合サムネ集めは `YOUTUBE_API_KEY=... python3 pipeline/scripts/yt_research.py "検索語" ...` で実数値（再生数・公開日・サムネURL・取得日）を取得する。
- サムネは必ず競合サムネ5本以上を分析してから作る。勝ちパターンは取り入れ、差別化を2点以上入れる。丸パクリ（同じ構図＋配色＋文言、他者画像の使用・トレース）は禁止。
- サムネの主役は自作SVG・追加費用0の画像生成・商用利用可の無料写真のいずれか（素材記録は `06c_thumbnail_assets.md`）。ラフ3案を社長が選んでから完成版を作る。

## コマンド

```bash
# 初回のみ（無料・Ubuntu 公式パッケージ）：音声エンジン・音声変換・BGM合成に必要なもの
sudo apt-get install -y open-jtalk open-jtalk-mecab-naist-jdic hts-voice-nitech-jp-atr503-m001 ffmpeg python3-numpy

python3 video/scripts/make_audio.py 001-sleep-without-brain  # ナレーション＋BGM生成、尺を script.json に反映
cd video
npm install
npm run render -- 001-sleep-without-brain             # サムネ + 動画（監査用の軽量版 episodes/<id>/preview.mp4 も出力）
npm run render -- 001-sleep-without-brain --thumb-only # サムネだけ
npm run studio                                         # ブラウザでプレビュー・微調整
```

## 新しい企画を始めるとき

1. 思いついたネタ・気になった動画の URL は `pipeline/ideas.md`（ネタ帳）に1行で放り込む（スマホなら GitHub アプリから編集）
2. やると決めたテーマは `pipeline/queue.md` に1行追加（空でも Claude がネタ帳から候補を出す）
3. 以降は Routine が自動で進める

## 置き場所のルール

- **社長の判断・指示**：`docs/チャンネル方針.md` に日付付きで残す（チャットで伝えた内容はそのセッション限りで消える）。
- **1話＝1フォルダ**：`episodes/<id>/`（ID の付け方は `pipeline/queue.md` に従う）。中のファイルは上の「工程」表の連番名だけを使う。
- **git に入れないもの**：フル画質 mp4（`video/out/`）、競合サムネ画像、出典・ライセンス未確認の素材。リポジトリの外に置く。

社長の PC 側は次の形を推奨（`TUBEX/` 以外は Claude からは見えない）。`python3 pipeline/scripts/setup_desktop.py` で一括作成できる（既存フォルダは触らない）：

```
デスクトップ/
├─ TUBEX/                    ← git clone したもの。Claude と共有するのはここだけ
├─ TUBEX_素材/               ← git に入れないもの（番号は工程番号）
│   ├─ 00_受け取り/           とりあえず置き場。週1回仕分けて空にする
│   ├─ 01_リサーチ資料/       論文 PDF など（出典 URL は 01_research.md へ）
│   ├─ 02_競合サムネ/         yt_research.py --thumbs-dir の保存先
│   ├─ 06_サムネ素材/
│   │   ├─ 写真_フリー素材/   （出典・ライセンスは 06c_thumbnail_assets.md へ）
│   │   └─ 画像生成/
│   ├─ 07_完成mp4/            video/out/<id>.mp4 を移す
│   ├─ 08_公開済み/           公開した最終版
│   └─ 09_分析/               YouTube Studio のスクショ・CSV
└─ 個人/                     ← TUBEX と関係ないもの
```

デスクトップ直置きの「とりあえず」ファイル（`新規フォルダ(3)`、`最終_修正2.png` など）は週1回、上のどれかに仕分ける。
