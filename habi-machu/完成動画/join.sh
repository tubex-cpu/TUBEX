#!/bin/sh
# 分割ファイルをつないで habi-machu-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-machu-1080p.mp4.part1 habi-machu-1080p.mp4.part2 habi-machu-1080p.mp4.part3 habi-machu-1080p.mp4.part4 habi-machu-1080p.mp4.part5 > habi-machu-1080p.mp4
sha256sum -c habi-machu-1080p.mp4.sha256
