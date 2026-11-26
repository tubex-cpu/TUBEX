#!/bin/sh
# 分割ファイルをつないで habi-kagami-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-kagami-1080p.mp4.part1 habi-kagami-1080p.mp4.part2 habi-kagami-1080p.mp4.part3 habi-kagami-1080p.mp4.part4 habi-kagami-1080p.mp4.part5 > habi-kagami-1080p.mp4
sha256sum -c habi-kagami-1080p.mp4.sha256
