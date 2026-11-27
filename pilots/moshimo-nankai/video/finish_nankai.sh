#!/bin/bash
# run_nankai.sh の完了（ALLDONE）を待って、完成版を outputs/ に書き出す（mp4 は git に入れない）。
# 使い方: nohup setsid bash finish_nankai.sh > $NEKO_OUT/finish.log 2>&1 &
O=${NEKO_OUT:-/home/user/work_neko/out_nankai}
D=$(cd "$(dirname "$0")/.." && pwd)/outputs
mkdir -p $D
until grep -q "ALLDONE" $O/run.log; do
  if grep -q "FAIL\|INCOMPLETE" $O/run.log; then echo "run_nankai.sh が失敗：$O/run.log を見る"; exit 1; fi
  sleep 60
done
# エンドカードの読み上げ（narration.py は読まない）を音声と字幕で足す
cd /home/user/TUBEX/pilots/moshimo-neko-meow/video && NEKO_OUT=$O /home/user/work_neko/venv/bin/python /home/user/TUBEX/pilots/moshimo-nankai/video/endcard_voice.py $O/neko_full.mp4 $D/nankai_v1_full_1080p.mp4 || { echo "endcard_voice 失敗：素のまま書き出す"; cp $O/neko_full.mp4 $D/nankai_v1_full_1080p.mp4; }
ffmpeg -v error -y -i $D/nankai_v1_full_1080p.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart $D/nankai_v1_preview_720p.mp4
echo "duration $(ffprobe -v error -show_entries format=duration -of csv=p=0 $D/nankai_v1_full_1080p.mp4)"
ffmpeg -nostats -i $D/nankai_v1_full_1080p.mp4 -af ebur128 -f null - 2>&1 | grep -A3 "Integrated loudness" | grep " I:"
ls -la $D
echo "FINISHED $(date -u +%T)"
