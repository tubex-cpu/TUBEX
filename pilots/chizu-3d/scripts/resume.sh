#!/bin/bash
# Resume after a container restart: JSON and mixes already exist, so go straight to the composite chunks → mux.
cd "$(dirname "$0")/.."
for e in ca bm; do
  for i in 1 2 3 4; do python3 scripts/comp3d.py $e --chunks $i/4 >> logs/comp_${e}_$i.txt 2>&1 & done
  wait
  python3 scripts/comp3d.py $e --mux && echo "MUXED $e"
done
echo PIPELINE DONE
