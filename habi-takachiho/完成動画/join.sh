#!/bin/sh
# 分割ファイルをつないで habi-takachiho-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-takachiho-1080p.mp4.part1 habi-takachiho-1080p.mp4.part2 habi-takachiho-1080p.mp4.part3 habi-takachiho-1080p.mp4.part4 > habi-takachiho-1080p.mp4
sha256sum -c habi-takachiho-1080p.mp4.sha256
