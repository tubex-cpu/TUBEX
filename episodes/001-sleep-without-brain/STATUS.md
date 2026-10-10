# 001-sleep-without-brain 進行状況

役割：サムネ以外は Claude 実施 → Codex 監査 ／ サムネは Codex 実施 → Claude 監査

| # | 工程 | 実施 | 監査 | 状態 |
|---|---|---|---|---|
| 1 | リサーチ | ✅ Claude | ⬜ Codex | 監査待ち |
| 2 | 競合調査 | ✅ Claude | ⬜ Codex | 監査待ち |
| 3 | 企画立案 | ✅ Claude | ⬜ Codex | 監査待ち |
| – | ゲートA：社長が企画を承認 | | | 承認待ち ※初回のため完成品まで一括作成済み |
| 4 | タイトル | ✅ Claude | ⬜ Codex | 監査待ち |
| 5 | 台本 | ✅ Claude | ⬜ Codex | 監査待ち |
| 6 | サムネ | ⬜ Codex（指示書 `06_thumbnail.md` 作成済み） | ⬜ Claude | Codex の作成待ち（現行 `thumbnail.png` は Claude の仮版） |
| 7 | 動画制作 | ✅ Claude | ⬜ Codex | 監査待ち |
| – | ゲートB：社長が完成品を承認 → 投稿 | | | 未 |

PR：https://github.com/tubex-cpu/TUBEX/pull/1（2026-10-10 Codex に監査・サムネ作成を依頼済み）

差し戻し回数：0（同一成果物で3回に達したら停止して社長に確認）

## 未対応・次の一手
- ナレーション音声なし（テロップのみ）。無料の VOICEVOX（ローカル）で `script.json` の narration を読み上げて追加可能。
- BGM なし。YouTube オーディオライブラリ（無料）から選んで追加可能。
