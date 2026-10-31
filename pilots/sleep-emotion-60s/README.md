# sleep-emotion-60s — 脳科学・心理学チャンネル 60秒パイロット

Yoo et al. (2007) の睡眠不足と扁桃体反応の研究を、CG再現VTR・研究図解・グラフ・顔のないCRTノイズのAIキャラクターで見せる60秒版。

- 完成MP4：`out/sleep-emotion-60s_v3.mp4`（git には入れない。軽量版 `preview.mp4` をコミット）
- 台本：`docs/script.md` ／ 字幕：`docs/subtitles.srt` ／ 出典・事実確認：`docs/sources.md` ／ 素材ライセンス：`docs/credits.md` ／ 確認記録：`docs/qa.md` ／ 競合の確認：`docs/competitors.md`

## 作り直し手順（Linux・すべて無料）
```bash
sudo apt-get install -y open-jtalk open-jtalk-mecab-naist-jdic fonts-noto-cjk ffmpeg
npm install
python3 scripts/make_audio.py        # ナレーション・効果音・BGM → public/audio/mix.wav, data/timings.json
python3 scripts/make_srt.py          # 字幕SRT
node scripts/render.mjs --still Main 400 out/frame400.png   # 代表フレーム
node scripts/render.mjs Main out/sleep-emotion-60s_v3.mp4 --concurrency=1
```
- 描画は Chromium headless shell ＋ `gl: swangle`（ソフトウェア WebGL）。GPU なしで動く。`REMOTION_GL=angle` などで切替可。
- 乱数は使わず、ノイズ・呼吸・動作はすべてフレーム番号から計算するので、どのフレームも同じ絵が再現できる。

## 構成
- `src/Main.tsx`：シーン表（フレーム）とクロスフェード、字幕、音声
- `src/scenes/Scenes.tsx`：各シーン（カメラ・動作のキー）
- `src/three/`：`Brain3D.tsx`（自作の3D脳）・`noise.ts`（決定的ノイズ）・`Mascot.tsx`（キャラ）・`noiseMaterial.ts`（形状に沿うCRTノイズ材質）・`Bedroom.tsx`（寝室・呼吸する掛け布団）・`Desk.tsx`・`MRI.tsx`・`Human.tsx`
- `src/ui/`：字幕・タグ・観察ログ（`Overlay.tsx`）、図解（`Diagrams.tsx`）
