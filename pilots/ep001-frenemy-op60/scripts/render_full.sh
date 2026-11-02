#!/bin/bash
# Renders the Full composition in 900-frame chunks (resumable), then joins them and adds the full audio.
# Usage: bash scripts/render_full.sh            (render missing chunks + assemble)
set -u
cd "$(dirname "$0")/.."
TOTAL=$(node -e "const t=require('./data/timeline_full.json'); console.log(Math.ceil(t.duration*30))")
CH=900
mkdir -p out/chunks
i=0
while [ $((i*CH)) -lt "$TOTAL" ]; do
  a=$((i*CH)); b=$(( (i+1)*CH-1 )); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  f=$(printf "out/chunks/c%03d.mp4" $i)
  if [ ! -s "$f" ]; then
    echo "chunk $i: frames $a-$b  $(date -u +%H:%M:%S)"
    node scripts/render.mjs Full "$f.tmp.mp4" --frames=$a-$b --concurrency=1 --muted > "out/chunks/c$i.log" 2>&1 && mv "$f.tmp.mp4" "$f" || echo "FAILED chunk $i"
  fi
  i=$((i+1))
done
ls out/chunks/c*.mp4 | grep -v tmp | sed "s#^out/chunks/#file '#; s#\$#'#" > out/chunks/list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/chunks/list.txt -c copy out/full_video.mp4
ffmpeg -v error -y -i out/full_video.mp4 -i out/full.wav -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest out/ep001-frenemy-full_v1.mp4
echo "ASSEMBLED $(date -u +%H:%M:%S)"
