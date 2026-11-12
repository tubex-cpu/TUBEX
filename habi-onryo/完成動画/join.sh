#!/bin/sh
# 分割ファイルをつないで habi-onryo-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-onryo-1080p.mp4.part01 habi-onryo-1080p.mp4.part02 habi-onryo-1080p.mp4.part03 habi-onryo-1080p.mp4.part04 habi-onryo-1080p.mp4.part05 habi-onryo-1080p.mp4.part06 habi-onryo-1080p.mp4.part07 habi-onryo-1080p.mp4.part08 habi-onryo-1080p.mp4.part09 habi-onryo-1080p.mp4.part10 habi-onryo-1080p.mp4.part11 > habi-onryo-1080p.mp4
sha256sum -c habi-onryo-1080p.mp4.sha256
