#!/bin/bash
# chizu-010 pivot circles 3D: wait for plates → timeline JSON → BGM + mix → 3D composite (4 parallel, resumable) → mux → preview.
# Safe to re-run after a container restart: plates and composite chunks that already exist are skipped.
cd "$(dirname "$0")/.."
for i in 1 2 3 4; do pgrep -f "plates.py pc --shots=$i/4" >/dev/null || python3 scripts/plates.py pc --shots=$i/4 > logs/plates_pc_p$i.txt 2>&1 & done
wait
while pgrep -f "scripts/plates.py pc" >/dev/null; do sleep 20; done
python3 scripts/plates.py pc --json || exit 1
[ -f out/pc/mix.wav ] || python3 scripts/bgm_chizu.py pc || exit 1
for i in 1 2 3 4; do CRF=22 python3 scripts/comp3d.py pc --chunks $i/4 > logs/comp_pc_$i.txt 2>&1 & done
wait
python3 scripts/comp3d.py pc --mux || exit 1
F=out/pc/chizu-010-us-pivot-circles_full_3d.mp4
ffmpeg -v error -y -i $F -vf scale=854:480 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 96k ../../episodes/chizu-010-us-pivot-circles/preview_3d.mp4
echo PIPELINE_PC_DONE
