#!/bin/sh
# Fetch free map data and fonts from the npm registry into render/vendor (not committed).
#  - world-atlas 2.0.2: Natural Earth 1:10m land/countries (public domain), ISC code
#  - sane-topojson 4.0.0: Natural Earth 1:50m incl. admin-1 subunits (public domain), MIT code
#  - @expo-google-fonts/noto-sans-jp 0.4.4: Noto Sans JP (SIL Open Font License 1.1)
set -e
cd "$(dirname "$0")"; mkdir -p vendor; cd vendor
for p in world-atlas@2.0.2 sane-topojson@4.0.0 @expo-google-fonts/noto-sans-jp@0.4.4; do
  f=$(npm pack "$p" 2>/dev/null | tail -1); d=${f%.tgz}; mkdir -p "$d"; tar xzf "$f" -C "$d"; rm "$f"
done
pip install -q opencv-python-headless
