#!/bin/bash
# Encodes out/frames/*.jpg (30 fps) and adds the full audio (loudness -16 LUFS).
set -eu
cd "$(dirname "$0")/.."
ffmpeg -v error -y -framerate 30 -i out/frames/f%05d.jpg -i out/full.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/ep001-frenemy-full_v1.mp4
echo "ASSEMBLED $(date -u +%H:%M:%S)"
