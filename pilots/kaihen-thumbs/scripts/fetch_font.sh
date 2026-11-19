#!/bin/bash
# OFL の Noto Serif JP（@fontsource/noto-serif-jp 5.3.1）を npm から取得して vendor/ に置く（git には入れない）
set -eu
cd "$(dirname "$0")/.."
mkdir -p vendor && cd vendor
npm pack @fontsource/noto-serif-jp@5.3.1 --silent
tar xzf fontsource-noto-serif-jp-5.3.1.tgz && rm -rf noto-serif-jp && mv package noto-serif-jp && rm -f fontsource-noto-serif-jp-5.3.1.tgz
ls -la noto-serif-jp/files/noto-serif-jp-japanese-900-normal.woff noto-serif-jp/LICENSE
