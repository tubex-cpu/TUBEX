#!/bin/sh
# 分割ファイルをつないで habi-jomon-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-jomon-1080p.mp4.part1 habi-jomon-1080p.mp4.part2 habi-jomon-1080p.mp4.part3 > habi-jomon-1080p.mp4
sha256sum -c habi-jomon-1080p.mp4.sha256
