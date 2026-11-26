#!/bin/bash
# 「もしも全人類が1000年眠ったら」の通し制作。猫回の仕組み（pilots/moshimo-neko-meow/video）を環境変数で切り替えて使う。
# カットごとに 描画 → 字幕・テロップの合成 → コマの削除 を3並列で行い、最後に音（効果音・環境音・BGM・ミックス）と書き出し。
# 使い方: bash run_1000.sh   （ナレーションは生成済み：$NEKO_OUT/timeline.json・narration.wav）
export NEKO_VER=v5
export NEKO_OUT=${NEKO_OUT:-/home/user/work_neko/out_1000}
export NEKO_PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)
export NEKO_SHOTS=shots_1000 NEKO_TELOPS=telops_1000
V=/home/user/TUBEX/pilots/moshimo-neko-meow/video
PY=/home/user/work_neko/venv/bin/python
cd $V
mkdir -p $NEKO_OUT/logs $NEKO_OUT/seg
$PY -c "
import render_shot as R
for r in sorted(R.shot_table(), key=lambda r: -r['n']): print(r['shot'], r['n'])" > $NEKO_OUT/shotlist.txt
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
