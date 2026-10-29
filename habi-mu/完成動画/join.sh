#!/bin/sh
# 分割ファイルをつないで habi-mu-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-mu-1080p.mp4.part1 habi-mu-1080p.mp4.part2 habi-mu-1080p.mp4.part3 habi-mu-1080p.mp4.part4 habi-mu-1080p.mp4.part5 habi-mu-1080p.mp4.part6 > habi-mu-1080p.mp4
sha256sum -c habi-mu-1080p.mp4.sha256
