#!/bin/sh
# 分割ファイルをつないで habi-ise-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-ise-1080p.mp4.part1 habi-ise-1080p.mp4.part2 habi-ise-1080p.mp4.part3 habi-ise-1080p.mp4.part4 > habi-ise-1080p.mp4
sha256sum -c habi-ise-1080p.mp4.sha256
