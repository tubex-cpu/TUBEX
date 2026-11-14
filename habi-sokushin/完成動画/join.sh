#!/bin/sh
# 分割ファイルをつないで habi-sokushin-1080p.mp4 に戻し、元のファイルと同じか確かめる
set -e
cd "$(dirname "$0")"
cat habi-sokushin-1080p.mp4.part01 habi-sokushin-1080p.mp4.part02 habi-sokushin-1080p.mp4.part03 habi-sokushin-1080p.mp4.part04 habi-sokushin-1080p.mp4.part05 habi-sokushin-1080p.mp4.part06 habi-sokushin-1080p.mp4.part07 habi-sokushin-1080p.mp4.part08 habi-sokushin-1080p.mp4.part09 habi-sokushin-1080p.mp4.part10 > habi-sokushin-1080p.mp4
sha256sum -c habi-sokushin-1080p.mp4.sha256
