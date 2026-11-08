#!/bin/sh
# 分割ファイルをつないで habi-tomio-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-tomio-1080p.mp4.part1 habi-tomio-1080p.mp4.part2 habi-tomio-1080p.mp4.part3 habi-tomio-1080p.mp4.part4 > habi-tomio-1080p.mp4
sha256sum -c habi-tomio-1080p.mp4.sha256
