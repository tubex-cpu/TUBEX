# 001-sleep-without-brain 進行状況

役割：サムネ以外は Claude 実施 → Codex 監査 ／ サムネは Codex 実施 → Claude 監査

| # | 工程 | 実施 | 監査 | 状態 |
|---|---|---|---|---|
| 1 | リサーチ | ✅ Claude | 🔁 Codex | 差し戻し→修正済み・再監査待ち |
| 2 | 競合調査 | ✅ Claude | 🔁 Codex | 差し戻し→修正済み・再監査待ち |
| 3 | 企画立案 | ✅ Claude | ⬜ Codex | 監査待ち |
| – | ゲートA：社長が企画を承認 | | | 承認待ち ※初回のため完成品まで一括作成済み |
| 4 | タイトル | ✅ Claude | ⬜ Codex | 監査待ち |
| 5 | 台本 | ✅ Claude | 🔁 Codex | 差し戻し→修正済み・再監査待ち |
| 6 | サムネ | ⬜ Codex（指示書 `06_thumbnail.md` 作成済み） | ⬜ Claude | Codex の作成待ち（現行 `thumbnail.png` は Claude の仮版） |
| 7 | 動画制作 | ✅ Claude | 🔁 Codex | 差し戻し→修正済み（音声・BGM追加）・再監査待ち |
| – | ゲートB：社長が完成品を承認 → 投稿 | | | 未 |

PR：https://github.com/tubex-cpu/TUBEX/pull/1（2026-10-10 Codex に監査・サムネ作成を依頼済み）

差し戻し回数：1（Codex 監査 1回目 2026-10-10：音声/BGM・文字数・断定表現・一次資料・APIキー記述の5点 → 全件修正して再提出）
同一成果物で3回に達したら停止して社長に確認

## メモ
- ナレーション：Open JTalk（無料・ローカル）。BGM：自作合成。`python3 video/scripts/make_audio.py 001-sleep-without-brain` で再生成。
- 公開時、概要欄に音声クレジット（CC BY 3.0）を記載すること。
