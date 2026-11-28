#!/bin/bash
# 改稿（03_script_v5.md、2026-11-21）の通し制作。カットごとに 描画 → 字幕・テロップの合成 → コマの削除 を3並列で行い、
# 最後に音（効果音・BGM・ミックス）と書き出し。作業ディスクが小さいため、コマは合成が済んだカットから消す。
# 使い方: bash run_v5.sh   （ナレーションは先に NEKO_VER=v5 python narration.py $NEKO_OUT）
export NEKO_VER=v5
export NEKO_OUT=${NEKO_OUT:-/home/user/work_neko/out_v5}
V=$(cd "$(dirname "$0")" && pwd)
PY=/home/user/work_neko/venv/bin/python
cd $V
mkdir -p $NEKO_OUT/logs $NEKO_OUT/seg
$PY - <<'P' > $NEKO_OUT/shotlist.txt
import render_shot as R
t = R.shot_table()
first = [r for r in t if r['shot'] in ('v01a',)]
rest = sorted([r for r in t if r not in first], key=lambda r: -r['n'])
for r in first + rest: print(r['shot'], r['n'])
P
one() {
  name=$1; n=$2
  if [ -s "$NEKO_OUT/seg/$name.mp4" ]; then echo "skip $name"; return; fi
  have=$(ls "$NEKO_OUT/frames/$name" 2>/dev/null | wc -l)
  if [ "$have" -lt "$n" ]; then
    $PY render_shot.py "$name" > "$NEKO_OUT/logs/$name.log" 2>&1 || { echo "RENDER FAIL $name"; return; }
  fi
  $PY compose.py seg "$name" >> "$NEKO_OUT/logs/$name.log" 2>&1 || { echo "SEG FAIL $name"; return; }
  rm -rf "$NEKO_OUT/frames/$name" "$NEKO_OUT/frames/${name}_ghost"
  echo "ok $name $n $(date +%T)"
}
export -f one; export PY
cat $NEKO_OUT/shotlist.txt | xargs -P ${JOBS:-3} -n 2 bash -c 'one "$0" "$1"'
echo "SEGS $(ls $NEKO_OUT/seg/*.mp4 | grep -v _test | wc -l) $(date +%T)"
$PY audio.py $NEKO_OUT > $NEKO_OUT/logs/audio.log 2>&1 || { echo "AUDIO FAIL"; exit 1; }
$PY compose.py final >> $NEKO_OUT/logs/compose.log 2>&1 || { echo "FINAL FAIL"; exit 1; }
echo "ALLDONE $(date +%T)"
