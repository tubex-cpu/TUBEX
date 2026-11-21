#!/bin/bash
# 全カットを描いたあと、音（効果音・BGM・ミックス）→ 字幕・テロップの合成 → 完成版の書き出しまで行う
# 使い方: NEKO_OUT=/home/user/work_neko/out_v4 bash render_all.sh && NEKO_OUT=... bash post_render.sh
OUT=${NEKO_OUT:-/home/user/work_neko/out}
V=$(cd "$(dirname "$0")" && pwd)
PY=/home/user/work_neko/venv/bin/python
export NEKO_OUT=$OUT
cd $V
$PY audio.py $OUT > $OUT/logs/audio.log 2>&1 || { echo "AUDIO FAIL"; exit 1; }
echo "audio done $(date +%T)"
$PY - <<'Q' > $OUT/seglist.txt
import render_shot as R
for r in R.shot_table(): print(r['shot'])
Q
cat $OUT/seglist.txt | xargs -P 3 -n 1 $PY compose.py seg > $OUT/logs/compose.log 2>&1
echo "segs $(ls $OUT/seg/*.mp4 | grep -v _test | wc -l) $(date +%T)"
$PY compose.py final >> $OUT/logs/compose.log 2>&1
echo "POSTDONE $(date +%T)"
