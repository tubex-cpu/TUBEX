#!/bin/bash
# 1) subtitle track: one PNG per video frame (symlinks), so each line is shown exactly while it is spoken
# 2) picture frames + subtitle track + full audio (-16 LUFS)
set -eu
cd "$(dirname "$0")/.."
python3 scripts/subs_track.py
ffmpeg -v error -y -framerate 30 -i out/frames/f%05d.jpg -framerate 30 -i out/subtrack/%05d.png -i out/full.wav \
  -filter_complex "[1:v]format=rgba[s];[0:v][s]overlay=0:0:format=auto,format=yuv420p[v]" -map "[v]" -map 2:a \
  -c:v libx264 -preset medium -crf 18 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/ep001-frenemy-full_v3.mp4
echo "ASSEMBLED $(date -u +%H:%M:%S)"
