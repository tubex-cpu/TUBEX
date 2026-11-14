#!/bin/bash
# Bermuda only, lighter encode (CRF 20) to fit the session's disk allowance.
cd "$(dirname "$0")/.."
rm -f out/bm/*.tmp.mp4
for i in 1 2 3 4; do CRF=20 python3 scripts/comp3d.py bm --chunks $i/4 >> logs/comp_bm_$i.txt 2>&1 & done
wait
python3 scripts/comp3d.py bm --mux && echo "MUXED bm"
echo BM DONE
