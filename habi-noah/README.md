# ハビ判事：ノアの方舟判決（Remotion）

台本（`scripts/script.txt`）を、
Remotion で約20分半（1920×1080 / 30fps）の動画にしたプロジェクトです。実写真の差し替えは `PHOTOS.md` を参照。

## 素材

| 素材 | 内容 |
| --- | --- |
| ナレーション | VOICEVOX:玄野武宏（`scripts/build-voice.py` で生成 → `public/voice/`） |
| BGM | オリジナル3曲（`scripts/make-bgm.py` で生成 → `public/bgm/`）。前半「閉園後の法廷」、中盤「調査」、後半「足元にあった物語」 |
| 効果音 | 小槌・ハンコ（`scripts/make-sfx.py` → `public/sfx/`） |
| ハビ判事 | 承認済みイラスト（`public/habi/`）。左下の話すハビ判事（表情4種×口パク）と、法廷の一枚絵・小槌の4コマ |
| フォント | Shippori Mincho B1 / Zen Kaku Gothic New（SIL OFL） |

YouTubeの概要欄には「VOICEVOX:玄野武宏」のクレジットを記載してください。

## 構成

| ファイル | 内容 |
| --- | --- |
| `scripts/script.txt` | 台本本文（Googleドキュメントから取り込み） |
| `scripts/build-voice.py` | 台本 → ナレーション音声・1行ずつに分けた字幕（`src/data/subtitles.ts`）・文ごとの字幕（`src/data/captions.ts`）・尺（`src/data/timeline.ts`）・口パク（`src/data/mouth.ts`）・`public/narration.srt` |
| `scripts/subset-fonts.py` | 使用文字だけに絞ったフォント（`public/fonts/*.woff2`）を生成 |
| `src/HabiNoahVideo.tsx` | 本編。11シーンを `TransitionSeries`（フェード）でつなぐ |
| `src/scenes/*.tsx` | 各シーン（Studioで単体プレビューできるよう `Scenes` フォルダにも登録） |
| `src/components/` | ハビ判事のキャラクター、判決ハンコ、字幕、図解イラストなど |

各シーンの中のビジュアル（`<Beat>`）は「何番目の字幕から何番目まで」で指定しているので、
ナレーションの尺が変わっても自動で追従します。

## 使い方

```bash
npm i
npx remotion studio          # プレビュー
npx remotion render HabiNoah out/habi-noah.mp4
```

## 台本を直したとき

1. `scripts/script.txt` を編集
2. VOICEVOXエンジンを起動：`docker run -d --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest`
3. `python3 scripts/build-voice.py`（音声・字幕・尺・口パクがすべて更新され、動画の尺も自動で追従）
4. 読み間違いがあれば `build-voice.py` の `READING` に置き換えを追加
5. 新しい漢字を使ったら `pip install fonttools brotli && python3 scripts/subset-fonts.py`

