#!/bin/bash
# 「もしも南海トラフ巨大地震が起きたら」の通し制作。猫回の仕組み（pilots/moshimo-neko-meow/video）を環境変数で切り替えて使う。
# カットごとに 描画 → 字幕・テロップの合成 → コマの削除 を並列（JOBS、既定3）で行い、最後に音（効果音・環境音・BGM・ミックス）と書き出し。
# 途中で止まっても、もう一度実行すれば、できあがったカット（seg/*.mp4）は飛ばして続きから進む。
# 使い方: nohup setsid bash run_nankai.sh > $NEKO_OUT/run.log 2>&1 &   （ナレーションは生成済み：$NEKO_OUT/timeline.json・narration.wav）
export NEKO_VER=v5
export NEKO_OUT=${NEKO_OUT:-/home/user/work_neko/out_nankai}
export NEKO_PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)
export NEKO_SHOTS=shots_nankai NEKO_TELOPS=telops_nankai
V=/home/user/TUBEX/pilots/moshimo-neko-meow/video
PY=/home/user/work_neko/venv/bin/python
cd $V
mkdir -p $NEKO_OUT/logs $NEKO_OUT/seg
# 章の見出し（大きな文字）が画面に収まるよう、2つの章のラベルだけ短くする（台本の【】：「地図」「最初の地震から32時間後　夜明け前」）
$PY - <<'PYEOF'
import json, os
p = os.environ['NEKO_OUT'] + '/timeline.json'
t = json.load(open(p))
fix = {1: '南海トラフ', 16: '32時間後　夜明け前'}
ch = 0
for c in t['chapters']:
    if c['no'] in fix and c['label'] != fix[c['no']]:
        c['label'] = fix[c['no']]; ch += 1
if ch:
    json.dump(t, open(p, 'w'), ensure_ascii=False, indent=1)
PYEOF
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
  $PY compose.py seg "$name" >> "$NEKO_OUT/logs/$name.log" 2>&1 || { echo "SEG FAIL $name"; rm -f "$NEKO_OUT/seg/$name.mp4"; return; }
  rm -rf "$NEKO_OUT/frames/$name" "$NEKO_OUT/frames/${name}_ghost"
  echo "ok $name $n $(date +%T)"
}
export -f one; export PY
cat $NEKO_OUT/shotlist.txt | xargs -P ${JOBS:-3} -n 2 bash -c 'one "$0" "$1"'
NS=$(wc -l < $NEKO_OUT/shotlist.txt); NG=$(ls $NEKO_OUT/seg/*.mp4 2>/dev/null | grep -v _test | wc -l)
echo "SEGS $NG / $NS $(date +%T)"
if [ "$NG" -lt "$NS" ]; then echo "INCOMPLETE（もう一度 run_nankai.sh を実行すると、残りだけ描く）"; exit 1; fi
$PY audio.py $NEKO_OUT > $NEKO_OUT/logs/audio.log 2>&1 || { echo "AUDIO FAIL"; exit 1; }
$PY compose.py final >> $NEKO_OUT/logs/compose.log 2>&1 || { echo "FINAL FAIL"; exit 1; }
echo "ALLDONE $(date +%T)"
