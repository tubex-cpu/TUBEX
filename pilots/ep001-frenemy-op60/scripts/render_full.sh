#!/bin/bash
# Renders the Full composition in short chunks (resumable; a container restart loses at most one chunk),
# then joins them and adds the full audio.
# Usage: bash scripts/render_full.sh
set -u
cd "$(dirname "$0")/.."
TOTAL=$(node -e "const t=require('./data/timeline_full.json'); console.log(Math.ceil(t.duration*30))")
CH=300
mkdir -p out/chunks
covered() {  # is frame $1 inside an already finished chunk?
  for f in out/chunks/f*.mp4; do
    [ -e "$f" ] || continue
    case "$f" in *tmp*) continue;; esac
    r=${f##*/f}; r=${r%.mp4}; a=$((10#${r%-*})); b=$((10#${r#*-}))
    [ "$1" -ge "$a" ] && [ "$1" -le "$b" ] && { echo "$b"; return 0; }
  done
  return 1
}
a=0
while [ "$a" -lt "$TOTAL" ]; do
  if end=$(covered "$a"); then a=$((end+1)); continue; fi
  b=$((a+CH-1)); [ "$b" -ge "$TOTAL" ] && b=$((TOTAL-1))
  f=$(printf "out/chunks/f%05d-%05d.mp4" "$a" "$b")
  echo "chunk $a-$b  $(date -u +%H:%M:%S)"
  if node scripts/render.mjs Full "$f.tmp.mp4" --frames=$a-$b --concurrency=1 --muted > "out/chunks/last.log" 2>&1; then
    mv "$f.tmp.mp4" "$f"
  else
    echo "FAILED chunk $a-$b"; exit 1
  fi
  a=$((b+1))
done
ls out/chunks/f*.mp4 | grep -v tmp | sort | sed "s#^out/chunks/#file '#; s#\$#'#" > out/chunks/list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/chunks/list.txt -c copy out/full_video.mp4
ffmpeg -v error -y -i out/full_video.mp4 -i out/full.wav -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 -shortest out/ep001-frenemy-full_v1.mp4
echo "ASSEMBLED $(date -u +%H:%M:%S)"
