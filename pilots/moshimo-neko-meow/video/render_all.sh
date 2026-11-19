#!/bin/bash
# 全カットを3並列で描く（途中から再開できる：枚数がそろったカットは飛ばす）
PY=/home/user/work_neko/venv/bin/python
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=${NEKO_OUT:-/home/user/work_neko/out}
mkdir -p "$OUT/logs"
$PY - <<'P' > "$OUT/shotlist.txt"
import sys; sys.path.insert(0, '/home/user/TUBEX/pilots/moshimo-neko-meow/video')
import render_shot as R
for r in sorted(R.shot_table(), key=lambda r: -r['n']): print(r['shot'], r['n'])
P
run() {
  name=$1; n=$2
  have=$(ls "$OUT/frames/$name" 2>/dev/null | wc -l)
  if [ "$have" -ge "$n" ]; then echo "skip $name"; return; fi
  $PY "$HERE/render_shot.py" "$name" > "$OUT/logs/$name.log" 2>&1
  grep -h DONE "$OUT/logs/$name.log"
}
export -f run; export PY HERE OUT
cat "$OUT/shotlist.txt" | xargs -P ${JOBS:-3} -n 2 bash -c 'run "$0" "$1"'
echo ALLDONE
