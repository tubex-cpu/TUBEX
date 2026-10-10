# ハビ判事：日本人とシュメール判決（Remotion）

Googleドキュメントの台本「ハビ判事_台本_日本人とシュメール判定_ストーリー構成版」を、
Remotion で約25分（1920×1080 / 30fps）の動画にしたプロジェクトです。

## 構成

| ファイル | 内容 |
| --- | --- |
| `scripts/script.txt` | 台本本文（Googleドキュメントから取り込み） |
| `scripts/build-captions.py` | 台本 → シーン別字幕データ（`src/data/captions.ts`）と `public/narration.srt` を生成。300字/分で尺を計算 |
| `scripts/subset-fonts.py` | 使用文字だけに絞ったフォント（`public/fonts/*.woff2`）を生成 |
| `src/HabiSumerVideo.tsx` | 本編。11シーンを `TransitionSeries`（フェード）でつなぐ |
| `src/scenes/*.tsx` | 各シーン（Studioで単体プレビューできるよう `Scenes` フォルダにも登録） |
| `src/components/` | ハビ判事のキャラクター、判決ハンコ、字幕、図解イラストなど |

各シーンの中のビジュアル（`<Beat>`）は「何番目の字幕から何番目まで」で指定しているので、
ナレーションの尺が変わっても自動で追従します。

## 使い方

```bash
npm i
npx remotion studio          # プレビュー
npx remotion render HabiSumer out/habi-sumer.mp4
```

## 台本を直したとき

1. `scripts/script.txt` を編集
2. `python3 scripts/build-captions.py` を実行（各シーンのフレーム数と合計が表示される）
3. 表示されたフレーム数を `src/HabiSumerVideo.tsx` と `src/Root.tsx` の `durationInFrames` に反映
4. 新しい漢字を使ったら `pip install fonttools brotli && python3 scripts/subset-fonts.py`

## ナレーション音声について

現在の動画は字幕のみ（音声なし）です。`public/narration.srt` は本編のタイムラインに合わせた字幕なので、
ナレーション収録のガイドや、YouTubeの字幕ファイルとして使えます。
収録した音声を入れる場合は `public/` に置き、`HabiSumerVideo.tsx` に `@remotion/media` の `<Audio>` を追加してください。

フォント：Shippori Mincho B1 / Zen Kaku Gothic New（SIL Open Font License）
