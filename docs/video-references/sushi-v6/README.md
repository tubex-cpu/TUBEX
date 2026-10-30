# 承認済み60秒動画：Claude Code再現パッケージ

ユーザーが「めちゃくちゃ良くなりました」と評価した第6版の再現用素材・コード・音声・完成動画です。2026-10-30、ユーザーが100MB以下でのTUBEX保存とClaude Code向けIssue作成を明示的に承認しました。

## 復元

ZIP全体は **82,289,514 bytes（82.29 MB）**。接続APIで安定して転送するため10分割して保存しています。合計サイズは変わりません。次のスクリプトが全パートを取得し、SHA-256とZIP内部のCRCを照合して復元・展開します。Python標準ライブラリだけで動きます。

```sh
curl -fL 'https://raw.githubusercontent.com/tubex-cpu/TUBEX/codex/sushi-v6-reproduction-20261029/docs/video-references/sushi-v6/restore_package.py' -o restore_package.py
python3 restore_package.py --output ./sushi-reproduction
```

既存フォルダへの上書きはしません。出力先は未使用のフォルダを指定してください。リポジトリ全体のZIPをダウンロードする必要はありません。

復元先：`sushi-reproduction/claude-code-sushi-reproduction/`
最初に `CLAUDE.md`、`README.txt`、`PASTE_INTO_CLAUDE.txt`、`DESIGN_SPEC.txt` を読んでください。

## 再現するもの

- 60秒・1920×1080・24fps、20カット×3秒。各カットで別の主素材。
- 実在するくら寿司の写真8点、新規AI再現素材6点、数量・期間・関係の図解。
- 大きな金色の数字、奥行き、要所だけのテロップ、オリジナル合成音の音楽・効果音。
- 黒いキャラクター：白い目、黒い瞳なし、ピンクの頬なし。
- 同梱素材を使うため、再現のための画像生成APIや追加課金は不要。

## 検証済み事項と制約

元環境で20カット一覧と主要4画面が承認済み版にバイト単位で一致。元動画は60秒、1080p、24fps、音声付きで全編デコード済み。

macOSのHiragino/Avenirフォントを使用しています。フォントファイルは同梱していません。Linux等の代替フォントでは文字幅・見た目が変わります。写真・生成静止画に動きを付けた編集版で、調理動作を連続生成したAI動画ではありません。

**現在のコードは60秒専用です。** 20分・60分への展開基準は同梱されていますが、長尺対応システムや長尺本編が完成したという意味ではありません。

写真の作者・ライセンス・出典・撮影年はパッケージ内 `project/photo-credits.json` に記録。AI画像は再現表記付き。フォントの再配布はありません。

この資料はユーザー指定の参考パッケージの受け渡しです。既存の制作パイプラインや全チャンネルの規則を一括変更するものではありません。GitHub Actionsは追加しません。

## 完全性

SHA-256: `6ff1c29a0cad7d37f2ed3ec5e87d04e7139b3915caeaacef36b152e0dfd4f6c1`
各パートのハッシュは `package-manifest.json`。
