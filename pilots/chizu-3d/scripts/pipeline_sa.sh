#!/bin/bash
# chizu-008 salmon 3D: wait for plates → timeline JSON → BGM + mix → 3D composite (4 parallel, resumable) → mux → preview.
# Safe to re-run after a container restart: plates and composite chunks that already exist are skipped.
cd "$(dirname "$0")/.."
for i in 1 2 3 4; do pgrep -f "plates.py sa --shots=$i/4" >/dev/null || python3 scripts/plates.py sa --shots=$i/4 > logs/plates_sa_p$i.txt 2>&1 & done
wait
while pgrep -f "scripts/plates.py sa" >/dev/null; do sleep 20; done
python3 scripts/plates.py sa --json || exit 1
[ -f out/sa/mix.wav ] || python3 scripts/bgm_chizu.py sa || exit 1
for i in 1 2 3 4; do CRF=22 python3 scripts/comp3d.py sa --chunks $i/4 > logs/comp_sa_$i.txt 2>&1 & done
wait
python3 scripts/comp3d.py sa --mux || exit 1
F=out/sa/chizu-008-salmon-ends_full_3d.mp4
ffmpeg -v error -y -i $F -vf scale=854:480 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 96k ../../episodes/chizu-008-salmon-ends/preview_3d.mp4
echo PIPELINE_SA_DONE
