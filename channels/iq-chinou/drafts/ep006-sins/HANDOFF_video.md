# ep006 八つの枢要罪 — 動画制作の引き継ぎ（2026-11-11）

社長指示（2026-11-11）：「８つの枢要罪の動画を制作条件は保ったまま正確に引き継いで別チャットで制作して」。
このファイルは、ep002〜ep004 の制作で決まった条件をそのまま ep006 に引き継ぐためのもの。**ここに書いた条件は変えない**。迷ったら `docs/チャンネル方針.md` の最新の行と、前回の制作記録 `pilots/ep003-yofukashi/docs/notes.md` を優先する。

## 0. 作業場所
- ブランチ：`codex/weekly-operations-20261025`（ここに commit・push。push が拒否されたら `git fetch origin codex/weekly-operations-20261025` → merge → push。`docs/チャンネル方針.md` の衝突は両方の行を残す）。PR は作らない
- 台本：`channels/iq-chinou/drafts/ep006-sins/05_script.md`（**v1.2**。Google ドキュメント v1.2 https://docs.google.com/document/d/1keCxwiM_sVwJSMabNr-T5L9UlAPFeQLRUtkQI8l4Qi0/edit ）。制作前に Google ドキュメントを読み、`## 0.`〜`## 制作メモ` の本文を `05_script.md` と突き合わせる。**社長がドキュメントを直接直していたら、その文をそのまま使い**、`05_script.md` に反映してから作る
- 新しい動画プロジェクト：`pilots/ep006-sins/`。`pilots/ep004-lookism/` を丸ごと複製して作る（`node_modules`・`out/`・`tts_cache` は除く）。`src/full/ScenesL1.tsx`・`ScenesL2.tsx` は ep006 用の新しい場面ファイルに置き換える（共通部品 `kit.tsx`・`ui.tsx`・`three/` はそのまま使う）
- 先にやっていた別チャット（ep004 ルッキズムの仕上げ）は `pilots/ep004-lookism/` を使っている。**ep004・ep003 のファイルは触らない**

## 1. 社長の決定（台本 ep006 固有）
- 八つの名前（社長指定 2026-11-11）：1. 暴食（ぼうしょく）2. 色欲（しきよく）3. 強欲（ごうよく）4. 憂鬱（ゆううつ）5. 憤怒（ふんぬ）6. 怠惰（たいだ）7. 虚飾（きょしょく）8. 傲慢（ごうまん）。語り・カード・章名はこの名前で統一（「悲嘆」「虚栄」は使わない）
- 「消された2つ」＝「虚飾」と「怠惰」（社長決定 2026-11-11）。2章の流れ：虚飾は傲慢へ、怠惰は憂鬱へまとめられ、嫉妬が加わった → 怠惰はのちに憂鬱と入れ替わって七つの大罪に戻る
- タイトル・サムネは**未決定**（`00_title_thumb.md` の Claude案。社長が選ぶ）。動画の画面にタイトル・サムネ案の文言を勝手に入れない
- 未決定の確認事項（`00_title_thumb.md`・`05_script.md` 制作メモ）：4章 色欲で使う研究（R9）を使うか、修道士・教皇の名前を語りで言うか、6章「心がさまようから悲しくなる」の言い方。**台本 v1.2 の文のまま作り**、報告で「未決定のまま」と書く

## 2. 全チャンネル共通の決まり（`CLAUDE.md`・`docs/社長の前提.md`）
- 追加費用ゼロ。API キー・有料素材・有料 TTS・新サービスは使わない。認証情報・API キーの入力・取得・表示・記録をしない
- 言い切りで語る（「〜と言われています」「〜かもしれません」「〜と思います」などを使わない）。事実は出典付きのみ（出典は語りでなく `01_research.md`・概要欄）
- 実在の人物の画像・顔は出さない（写真風の人物は顔のないシルエット・ぼかし。歴史上の修道士・教皇も肖像を使わない）
- 宗教を説教・揶揄しない（思想の歴史として扱う）

## 3. 映像の決まり（ヒト図鑑・ep002〜ep004 で社長が決めたもの）
- 1920×1080・30fps。Remotion 4（ヘッドレス Chromium、`gl: 'swangle'`）
- 登場キャラ：顔のない白黒ノイズの人型（`MascotOverlay`）。名前なし。傍観者として要所だけ。語らない
- **スマホの画面を指ではじいてフィードを流す映像は使わない**（ep002 ドパガキと重複・社長が禁止。以後の回でも再利用しない）。止まった画面は可
- 画面に「再現」「注記」「概念図」などの説明ラベルを出さない
- やせた体・体重の数字・体型を比べる映像を出さない
- 図解は字幕の帯（画面下）に入れない（`Board` の上 84% に置く）
- 研究に数値がない比較は棒グラフにしない（カードで示す）。架空のデータを本物に見せない
- 章タイトルのカード＋効果音（`Full.tsx` の章カードの仕組みをそのまま使う）
- 「VOICEVOX:ナースロボ＿タイプＴ」のクレジットは概要欄に載せる（ep003・ep004 の本編には表記を入れていない。同じにする）

## 4. 字幕の決まり（`src/full/Full.tsx` の字幕部分をそのまま使う）
- 句読点「、」「。」は出さない（「？」「！」「」」は残す）
- 黒フチなし。明るい場面だけ薄い影（`LIGHT` に場面 ID を登録。ep006 の白い部屋・明るい背景の場面を入れ直す）
- 強調は赤と黄（`scripts/make_audio_full.py` の `RED`・`YEL` を ep006 用に作り直す。八つの名前・結果の数字など）。「」は中の強調語と同じ色
- 1行は最長30字。長い文は句点・読点・」・助詞の順で分ける（`make_audio_full.py` の分割処理をそのまま使う）

## 5. 音声・BGM・効果音
- ナレーション：**VOICEVOX ナースロボ＿タイプＴ（ノーマル, style 47）**、速度 1.12、抑揚 1.1（`make_audio_full.py` の設定そのまま）。エンジンは公式 Docker イメージ `mirror.gcr.io/voicevox/voicevox_engine:cpu-latest` を 127.0.0.1:50021 で動かす（例：`(pgrep dockerd || nohup dockerd >/tmp/dockerd.log 2>&1 &)` → `docker run -d --name vv -p 50021:50021 mirror.gcr.io/voicevox/voicevox_engine:cpu-latest`。終わったら `docker stop vv`）
- 読み：`READ` を ep006 用に作り直す。**「憤怒＝ふんぬ」「虚飾＝きょしょく」「色欲＝しきよく」「傲慢＝ごうまん」**、数字・単位・年代（1,600年 など）を固定。全行のかなを出力して読み間違いを確認する（ep004 では「同じ子たち」「心地いい人」が誤読だった）
- BGM：静かなスネア系ドラム3曲・**キックなし**（冒頭〜前半・中盤・後半〜最後の3区間。`tl["bgm"]` の境目を ep006 の章に合わせて決める）
- 効果音：オープニングの whoosh、章カード、カードめくり（8枚のカード）、チェックカードのポップ、ハンコ等。**スワイプ音は使わない**
- 最終音量 −16 LUFS（`assemble_full.sh` が正規化）

## 6. 作り方（ep004 と同じ手順）
1. `data/parse_script.py` のパスを `channels/iq-chinou/drafts/ep006-sins/05_script.md` に変えて `blocks.json` → `data/make_script.py` で `script_full.py`
2. `npm ci`（または `npm install`）で `node_modules` を用意（ep004 は ep001 の node_modules へのシンボリックリンクだった。新しい環境では自分で入れる）
3. VOICEVOX を起動 → `python3 scripts/make_audio_full.py`（`out/full.wav`・`data/timeline_full.json`）。長いのでバックグラウンドで
4. 場面ファイルを作る → `npx tsc --noEmit` → `node scripts/render_sheet.mjs FullNoGrain <frames>` で静止画を見て、文字の重なり・はみ出し・字幕帯への侵入を直す
5. `node scripts/render_subs.mjs` → `scripts/subs_track.py`（字幕カード）
6. `node scripts/render_segments.mjs <w> 3`（3ワーカー・1800フレーム単位。止まったら再起動すれば続きから）
7. `bash scripts/assemble_full.sh out/ep006-sins-full_v1.mp4`（20〜40分。長いタイムアウトで）
8. 確認：ffprobe のフレーム数＝音声尺×30、ebur128 で −16 LUFS、分割のつなぎ目、15秒ごとの静止画を目視
9. 軽量版：`ffmpeg -i out/ep006-sins-full_v1.mp4 -vf scale=960:-2 -c:v libx264 -crf 30 -preset veryfast -c:a aac -b:a 96k preview_full.mp4`
10. `pilots/ep006-sins/docs/notes.md` に「## フル尺 v1（日付）」を ep003 の notes と同じ形式で書く
11. フル画質 mp4 は git に入れない（`.gitignore`）。**フル画質は SendUserFile でチャットに添付**して渡す。preview_full.mp4・ソースは commit・push
- ディスクは限られている。不要になった `out/seg`・古い mp4 は消す

## 7. 報告の決まり
- 日本語・社長向けの平易な言葉。**毎回、書いた場所を示す**：ファイルのパス・節の見出しと行番号・ブランチ名・GitHub のコミットリンク（https://github.com/tubex-cpu/TUBEX/commit/<hash>）
- 社長の指示・決定は `docs/チャンネル方針.md` の末尾に日付付きで1行追記して commit
- 報告に入れること：尺・フレーム数・LUFS、確認した内容（耳で聞いていないなら「音声は耳で聞いていない」）、未決定のまま残した点、出典 R1〜R22 が要原典照合のままであること、概要欄に「VOICEVOX:ナースロボ＿タイプＴ」のクレジットが必要なこと
