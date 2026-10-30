#!/bin/bash
# ハビ判事の完成動画を書き出す（1時間ものでもメモリ不足にならないよう、10分ずつ分けて書き出してからまとめる）
#   bash .claude/skills/habi-video/scripts/render.sh habi-<題材> <1080pのコンポジションID>
# 時間がかかる（1時間の動画で約3〜4時間）ので、切り離して動かす：
#   setsid nohup bash .claude/skills/habi-video/scripts/render.sh habi-nintoku HabiNintoku > render.log 2>&1 < /dev/null & disown
# 出力
#   habi-<題材>/完成動画/<名前>-1080p.mp4.part1〜   投稿用1080p（97MBずつにバイト分割。cat でつなぐと元の1本に戻る）
#   habi-<題材>/完成動画/<名前>-1080p.mp4.sha256    元のファイルのSHA-256
#   habi-<題材>/完成動画/join.sh                    つないで確かめるスクリプト
#   habi-<題材>/out/<名前>-preview.mp4             チャット用の確認版（360p・30MB以下）
set -e
P=$(cd "$1" && pwd); COMP=$2
NAME=$(basename "$P")
BR=${BR:-$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)}
export NODE_OPTIONS=--max-old-space-size=8192
cd "$P"
C=out/c1080; mkdir -p $C
TOTAL=$(grep -o 'TOTAL_FRAMES = [0-9]*' src/data/timeline.ts | grep -o '[0-9]*$')
CH=18000; N=$(( (TOTAL + CH - 1) / CH ))
# CRF：書き出し途中の画質（大きいほど軽い）。VB：投稿用1080pの映像ビットレート（フィルムの粒子があるときは高めに）
CRF=${CRF:-17}; VB=${VB:-1150}
: > $C/list.txt; : > $C/alist.txt

# 1. 映像を10分ずつ（無音で）書き出す。できている区間はとばすので、止まっても再実行で続きから
for ((i=0; i<N; i++)); do s=$((i*CH)); e=$((s+CH-1)); [ $e -ge $TOTAL ] && e=$((TOTAL-1)); n=$(printf %02d $i)
  if [ ! -s $C/v$n.mp4 ]; then echo "chunk $i $s-$e $(date +%T)"
    npx remotion render $COMP $C/v$n.mp4 --frames=$s-$e --muted --crf=$CRF --browser-executable=$BR --log=error --concurrency=4; fi
  echo "file 'v$n.mp4'" >> $C/list.txt
done
# 2. 音声も10分ずつ（1時間を一度に書き出すとブラウザが落ちる）
for ((i=0; i<N; i++)); do s=$((i*CH)); e=$((s+CH-1)); [ $e -ge $TOTAL ] && e=$((TOTAL-1)); n=$(printf %02d $i)
  if [ ! -s $C/a$n.wav ]; then echo "audio $i $(date +%T)"
    npx remotion render $COMP $C/a$n.wav --codec=wav --frames=$s-$e --browser-executable=$BR --log=error --concurrency=4; fi
  echo "file 'a$n.wav'" >> $C/alist.txt
done
echo "encode $(date +%T)"
ffmpeg -loglevel error -y -f concat -safe 0 -i $C/alist.txt -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 $C/audio.wav

# 3. 1本の1080pにまとめる（映像 VB kbps・音声128kbps。1150kbpsなら1時間で約580MB）
F=out/$NAME-1080p.mp4
ffmpeg -loglevel error -y -f concat -safe 0 -i $C/list.txt -c:v libx264 -preset slow -tune stillimage -b:v ${VB}k -pass 1 -passlogfile out/pass1080 -an -f mp4 /dev/null
ffmpeg -loglevel error -y -f concat -safe 0 -i $C/list.txt -i $C/audio.wav -map 0:v -map 1:a -c:v libx264 -preset slow -tune stillimage -b:v ${VB}k -pass 2 -passlogfile out/pass1080 -c:a aac -b:a 128k -shortest -movflags +faststart $F
echo "full $(du -m $F | cut -f1)MB $(date +%T)"

# 4. GitHubの100MB制限に合わせて97MBずつに分割し、つなぎ方と確認用の値を添える
D=完成動画; mkdir -p $D
find $D -maxdepth 1 -name "$NAME-1080p*" -delete
split -b 97000000 -d -a 1 --numeric-suffixes=1 $F $D/$NAME-1080p.mp4.part
(cd out && sha256sum $NAME-1080p.mp4) > $D/$NAME-1080p.mp4.sha256
PARTS=$(cd $D && ls $NAME-1080p.mp4.part* | sort -V | tr '\n' ' ')
cat > $D/join.sh <<EOS
#!/bin/sh
# 分割ファイルをつないで $NAME-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "\$(dirname "\$0")"
cat $PARTS> $NAME-1080p.mp4
sha256sum -c $NAME-1080p.mp4.sha256
EOS
chmod +x $D/join.sh

# 5. チャット用の確認版（360p・30MB以下）
DUR=$(python3 -c "print($TOTAL/30)")
PB=$(python3 -c "print(int((27*8*1000/ $DUR) - 18))")
ffmpeg -loglevel error -y -f concat -safe 0 -i $C/list.txt -vf scale=640:360 -c:v libx264 -preset slow -tune stillimage -b:v ${PB}k -pass 1 -passlogfile out/pass360 -an -f mp4 /dev/null
ffmpeg -loglevel error -y -f concat -safe 0 -i $C/list.txt -i $C/audio.wav -map 0:v -map 1:a -vf scale=640:360 -c:v libx264 -preset slow -tune stillimage -b:v ${PB}k -pass 2 -passlogfile out/pass360 -c:a aac -b:a 16k -ac 1 -ar 22050 -shortest -movflags +faststart out/$NAME-preview.mp4
echo "DONE $DUR $(date +%T)"; ls -la $D out/$NAME-preview.mp4
