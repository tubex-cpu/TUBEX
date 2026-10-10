# TUBEX 制作パイプライン（雑学チャンネル）

社長（オーナー）は **「承認」だけ** をする。それ以外の工程は Claude Code と ChatGPT Codex が自動で進める。

## 追加費用ゼロの原則（必ず守る）

| 項目 | ルール |
|---|---|
| Claude | Pro/Max **サブスク枠内のみ**。claude.ai の設定で「追加使用量（Extra usage）」を **OFF**。上限に達したら止まって待つ |
| ChatGPT Codex | Plus/Pro **プラン枠内のみ**。Codex のクレジット購入・自動チャージは **しない**。上限に達したら止まって待つ |
| API キー | **使わない・置かない**（Anthropic / OpenAI API は従量課金のため）。リポジトリにも環境変数にも入れない |
| GitHub Actions | **使わない**（無料枠超過のリスクを避ける）。自動実行は Claude Code の Routine（サブスク枠内）で行う |
| 素材 | 有料素材・有料 TTS・画像生成 API は使わない。図版は SVG で自作、フォントは OFL（Noto Sans JP / Dela Gothic One） |
| Remotion | 個人・3名以下の会社は無料ライセンス。人数が増えたら要確認 |

## 工程と担当

| # | 工程 | 担当 | 成果物（`episodes/<id>/`） | 社長の確認 |
|---|---|---|---|---|
| 1 | リサーチ | Claude | `01_research.md`（出典付きの事実のみ） | – |
| 2 | 競合調査 | Claude | `02_competitors.md` | – |
| 3 | 企画立案 | Claude | `03_plan.md` | **ゲートA：企画OK？** |
| 4 | ファクトチェック | Codex | PR レビューコメント | – |
| 5 | タイトル | Claude | `04_titles.md`（3案＋推奨） | – |
| 6 | サムネ | Claude（Remotion Still） | `thumbnail.png` | – |
| 7 | 台本 | Claude | `script.json`（映像とナレーションの唯一の元データ）＋ `05_script.md` | – |
| 8 | 台本レビュー | Codex | PR レビューコメント（事実誤り・言い回し） | – |
| 9 | 動画制作 | Claude（Remotion） | `video/out/<id>.mp4` | **ゲートB：公開OK？** |

社長が止めるのは **ゲートA（企画）とゲートB（完成品）の2回だけ**。それ以外は自動で次に進む。

## 自動で回る仕組み

```
[毎朝 Routine 起動 (Claude Code / サブスク枠)]
   └─ pipeline/queue.md を読む
       ├─ 次の工程を実行 → ブランチに commit → PR を作成/更新
       ├─ PR に「@codex review」→ Codex がファクトチェック（ChatGPT プラン枠）
       ├─ Codex の指摘を Claude が反映
       └─ ゲートに到達したら停止し、PR で社長に確認依頼
[社長] PR を見て Approve / マージ = 承認。修正指示は PR コメントで
[次の Routine] 承認済みなら次の工程へ
```

- 状態は各エピソードの `STATUS.md` のチェックボックスで管理する（どこまで進んだか一目で分かる）。
- 利用上限に当たった場合は何もせず終了し、次回の Routine で再開する（課金して続行はしない）。

## コマンド

```bash
cd video
npm install
npm run render -- 001-sleep-without-brain             # サムネ + 動画
npm run render -- 001-sleep-without-brain --thumb-only # サムネだけ
npm run studio                                         # ブラウザでプレビュー・微調整
```

## 新しい企画を始めるとき

1. `pipeline/queue.md` にテーマ候補を1行追加（空でも Claude が候補を出す）
2. 以降は Routine が自動で進める
