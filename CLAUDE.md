# TUBEX – Claude Code 向け指示

雑学 YouTube チャンネルの制作を自動で進めるリポジトリ。工程・担当・費用ルールは `pipeline/README.md` が正。

## 必ず守ること
- **追加費用ゼロ**：API キーの利用・有料素材・有料 TTS・GitHub Actions は使わない。利用上限に達したらその回は終了する。
- 事実は **出典付き** でしか書かない。確認できない数字は使わない（`01_research.md` に出典 URL を残す）。
- 社長の確認が必要なのはゲートA（企画）とゲートB（完成動画）のみ。それ以外で止まって質問しない。
- 映像の元データは `episodes/<id>/script.json` のみ。表示文言を変えるときはここを直してから再レンダリングする。

## Routine で起動されたときの手順
1. `pipeline/queue.md` と各 `episodes/*/STATUS.md` を読み、未完了の最初の工程を特定する。
2. ゲート待ちで、PR が未承認なら何もせず終了する。
3. 工程を実行し `STATUS.md` を更新、`claude/<id>` ブランチに commit・push、PR を作成/更新する。
4. 台本・企画を更新した PR には `@codex review` とコメントし、Codex の指摘は次回反映する。
5. 動画は `cd video && npm run render -- <id>`。mp4 は git に入れず、PR 本文で確認方法を案内する。
