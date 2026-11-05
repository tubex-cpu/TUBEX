#!/bin/bash
# Joins the picture segments (out/seg/*.mp4), overlays the frame-exact subtitle track and adds out/full.wav (-16 LUFS).
# Usage: scripts/assemble_full.sh <out.mp4> [seconds]   (seconds: only the first N seconds, for a check)
set -eu
cd "$(dirname "$0")/.."
OUT=${1:-out/ep002-dopagaki-full_v1.mp4}
DUR=${2:-}
python3 scripts/subs_track.py
ls out/seg/seg[0-9][0-9][0-9].mp4 | sed "s#^#file '$PWD/#;s#\$#'#" > out/seg/list.txt
T=(); [ -n "$DUR" ] && T=(-t "$DUR")
ffmpeg -v error -y -f concat -safe 0 -i out/seg/list.txt -framerate 30 -i out/subtrack/%05d.png -i out/full.wav \
  -filter_complex "[1:v]format=rgba[s];[0:v][s]overlay=0:0:format=auto,format=yuv420p[v]" -map "[v]" -map 2:a "${T[@]}" \
  -c:v libx264 -preset medium -crf 18 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$OUT"
echo "ASSEMBLED $(date -u +%H:%M:%S) $OUT"
