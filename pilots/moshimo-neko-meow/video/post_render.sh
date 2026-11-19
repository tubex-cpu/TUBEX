#!/bin/bash
# 全カットの描画が終わったら、s15b（腕の修正前に描画）を描き直し、字幕などを重ねて完成版を書き出す
OUT=/home/user/work_neko/out
V=/home/user/TUBEX/pilots/moshimo-neko-meow/video
PY=/home/user/work_neko/venv/bin/python
while ! grep -q ALLDONE $OUT/render_all.log; do sleep 60; done
echo "render done $(date +%T)"
rm -rf $OUT/frames/s15b
$PY $V/render_shot.py s15b > $OUT/logs/s15b_redo.log 2>&1; grep -h DONE $OUT/logs/s15b_redo.log
cd $V
$PY - <<'P' > $OUT/seglist.txt
import sys; sys.path.insert(0, '/home/user/TUBEX/pilots/moshimo-neko-meow/video')
import render_shot as R
for r in R.shot_table(): print(r['shot'])
P
cat $OUT/seglist.txt | xargs -P 3 -n 1 $PY compose.py seg > $OUT/logs/compose.log 2>&1
echo "segs $(ls $OUT/seg/*.mp4 | grep -v _test | wc -l) $(date +%T)"
$PY compose.py final >> $OUT/logs/compose.log 2>&1
echo "POSTDONE $(date +%T)"
