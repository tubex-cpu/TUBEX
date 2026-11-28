#!/bin/bash
# After the plates and hero clips are done: timeline JSON (with pins) → new score + mix → 3D composite chunks → mux.
cd "$(dirname "$0")/.."
while pgrep -f "scripts/plates.py" >/dev/null || pgrep -f "render_part.mjs" >/dev/null || pgrep -f "CA-H1" >/dev/null; do sleep 30; done
for e in ca bm; do python3 scripts/plates.py $e --json; python3 scripts/bgm_chizu.py $e; done
for e in ca bm; do
  for i in 1 2 3 4; do python3 scripts/comp3d.py $e --chunks $i/4 > logs/comp_${e}_$i.txt 2>&1 & done
  wait
  python3 scripts/comp3d.py $e --mux && echo "MUXED $e"
done
echo PIPELINE DONE
