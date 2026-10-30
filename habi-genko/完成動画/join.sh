#!/bin/sh
# 分割ファイルをつないで habi-genko-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-genko-1080p.mp4.part01 habi-genko-1080p.mp4.part02 habi-genko-1080p.mp4.part03 habi-genko-1080p.mp4.part04 habi-genko-1080p.mp4.part05 habi-genko-1080p.mp4.part06 habi-genko-1080p.mp4.part07 habi-genko-1080p.mp4.part08 habi-genko-1080p.mp4.part09 habi-genko-1080p.mp4.part10 habi-genko-1080p.mp4.part11 habi-genko-1080p.mp4.part12 habi-genko-1080p.mp4.part13 > habi-genko-1080p.mp4
sha256sum -c habi-genko-1080p.mp4.sha256
