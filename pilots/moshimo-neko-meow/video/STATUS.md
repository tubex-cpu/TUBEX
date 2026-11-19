# 動画制作の状況（もしも世界中の猫が一斉に鳴き始めたら？ 第3稿）

## 作り方（再現手順）
環境：Python 3.13 の venv に `bpy`（Blender 5.3 のモジュール）・numpy・pillow・opencv-python-headless・fonttools・mido。apt で open-jtalk（＋naist-jdic・nitech m001 音声）・fluidsynth・fluid-soundfont-gm・fonts-noto-cjk。npm で world-atlas（Natural Earth の陸地）。

1. `narration.py <out>`：台本 `../03_script.md` のナレーションを Open JTalk で読み上げ、`timeline.json`（章・行・時刻）と `narration.wav` を作る
2. `render_all.sh`：`shots.py` の全53カットを Blender Workbench で 1280×720・24fps に描く（3並列、再開可）。各カットの鳴くタイミングを `meta/*.json` に書く
3. `audio.py <out>`：猫の鳴き声（numpy 合成）・遠くの鳴き声の層・環境音・BGM（mido → FluidSynth、FluidR3_GM）を作り、ナレーションとミックス（−16 LUFS）
4. `compose.py seg <shot...>` → `compose.py final`：字幕（Noto Serif CJK JP）・章の見出し・時計・都市名を重ね、1920×1080 の mp4 にして音と合わせる

素材の権利：映像はすべて手続き生成。地球の陸地は Natural Earth（パブリックドメイン）。フォントは Noto（SIL OFL）。音声合成は Open JTalk（nitech_jp_atr503_m001、CC BY 3.0 名古屋工業大学）。音源は FluidR3_GM（MIT）。猫の鳴き声は合成で、録音素材は使っていない。

## 決めたこと
- このセッションには Mac のフォルダー（第4版の Blender 素材）がつながらなかったため、クラウドの環境で新規に作った。EEVEE はこの環境で1コマ約50秒のため使えず、Workbench（ミニチュア風の陰影）で描く
- 3D は 1280×720 で描き、合成時に 1920×1080 へ拡大。字幕は 1080p で直接描く
- ナレーション 185 行、全体 16分34秒（エンドカード込み）
