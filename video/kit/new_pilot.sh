#!/bin/bash
# Makes a new video project with the ルール改変ニッポン quality kit (3D + cinematic finish, composed BGM, voice finishing,
# ヒト図鑑-style subtitles, restart-safe segment render). Copies, never links: each channel keeps its own look.
# Usage: video/kit/new_pilot.sh <episode-id>      e.g. video/kit/new_pilot.sh chizu-007-xxx
#   expects the script at episodes/<episode-id>/05_script.md (format: "# 第N章 title（約M分）", "## Sxx title", one narration line per paragraph)
set -eu
cd "$(dirname "$0")/../.."
ID=${1:?episode id}
SRC=pilots/kaihen-001-equal-pay
DST=pilots/$ID
[ -e "$DST" ] && { echo "$DST already exists (not overwritten)"; exit 1; }
mkdir -p $DST/{data,scripts,src/full,src/three,public,docs,out}
cp $SRC/{package.json,package-lock.json,tsconfig.json,.gitignore} $DST/
sed -i "s/\"name\": \"kaihen-001-equal-pay\"/\"name\": \"$ID\"/" $DST/package.json
cp -r $SRC/public/grain $DST/public/
cp $SRC/scripts/{render_subs.mjs,subs_track.py,assemble_full.sh,render_segments.mjs,render_sheet.mjs,make_audio.py,make_audio_full.py} $DST/scripts/
cp video/kit/audio/{bgm.py,voice_polish.py} $DST/scripts/
sed "s#episodes/kaihen-001-equal-pay/05_script.md#episodes/$ID/05_script.md#; s#kaihen-001-equal-pay#$ID#g" $SRC/data/build_script.py > $DST/data/build_script.py
cp $SRC/src/{index.ts,Root.tsx,theme.ts} $DST/src/
cp $SRC/src/full/{Full.tsx,kit.tsx} $DST/src/full/
cp video/kit/three/* $DST/src/three/
cat > $DST/src/full/Opening3D.tsx <<'TSX'
// opening scenes of this episode (see pilots/kaihen-001-equal-pay/src/full/Opening3D.tsx for a full example)
import {SceneProps} from './kit';
export const SCENES_OPEN3D: Record<string, React.FC<SceneProps>> = {};
TSX
cat > $DST/src/full/ScenesMain.tsx <<'TSX'
// main scenes of this episode: one component per scene id (s04, s05, ...). Missing ids render as a red placeholder.
import {SceneProps} from './kit';
export const SCENES_MAIN: Record<string, React.FC<SceneProps>> = {};
TSX
cat > $DST/docs/notes.md <<MD
# $ID 制作メモ
- 作成：video/kit/new_pilot.sh（ルール改変ニッポンの品質キットを複製）
- 直すこと：src/theme.ts の色（チャンネルの見た目に合わせる）、scripts/make_audio_full.py の READ（読み）・RED/YEL（字幕の強調語）・効果音の位置・BGM の区間、VV_SPEAKER（声）
MD
(cd $DST && npm ci --no-audit --no-fund >/dev/null 2>&1 && echo "npm ok") || echo "npm ci failed: run it in $DST"
echo "created $DST"
