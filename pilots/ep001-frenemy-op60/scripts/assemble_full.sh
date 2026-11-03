#!/bin/bash
# 1) subtitle track: one PNG per line shown exactly while it is spoken (transparent in between)
# 2) picture frames + subtitle track + full audio (-16 LUFS)
set -eu
cd "$(dirname "$0")/.."
python3 scripts/subs_track.py
ffmpeg -v error -y -framerate 30 -i out/frames/f%05d.jpg -f concat -safe 0 -i out/subs/track.txt -i out/full.wav \
  -filter_complex "[1:v]fps=30,format=rgba[s];[0:v][s]overlay=0:0:format=auto,format=yuv420p[v]" -map "[v]" -map 2:a \
  -c:v libx264 -preset medium -crf 18 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/ep001-frenemy-full_v2.mp4
echo "ASSEMBLED $(date -u +%H:%M:%S)"
