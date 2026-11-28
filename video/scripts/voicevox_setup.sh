#!/usr/bin/env bash
# VOICEVOX エンジン（無料・公式配布・CPU版）をリポジトリ外にダウンロードして起動する。追加費用なし。
# 使い方: bash video/scripts/voicevox_setup.sh  → 127.0.0.1:50021 で待ち受け（make_audio.py が使う）
set -euo pipefail
VER=0.25.0
DIR=/root/voicevox
if [ ! -x "$DIR/linux-cpu-x64/run" ]; then
  mkdir -p "$DIR" && cd "$DIR"
  curl -fL -o eng.7z.001 "https://github.com/VOICEVOX/voicevox_engine/releases/download/$VER/voicevox_engine-linux-cpu-x64-$VER.7z.001"
  7z x -y eng.7z.001 >/dev/null && rm eng.7z.001
  chmod +x linux-cpu-x64/run
fi
if ! curl -s 127.0.0.1:50021/version >/dev/null; then
  (cd "$DIR/linux-cpu-x64" && nohup ./run --host 127.0.0.1 --port 50021 > "$DIR/engine.log" 2>&1 &)
  for _ in $(seq 1 60); do curl -s 127.0.0.1:50021/version && break; sleep 2; done
fi
echo
