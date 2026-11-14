#!/bin/bash
# Starts the free VOICEVOX ENGINE (official Docker image) on 127.0.0.1:50021 and the music tools for bgm.py.
# Safe to run again; handles a stale docker.pid after a container restart. No paid service, no API key.
set -u
LOG=${TMPDIR:-/tmp}/dockerd.log
if ! docker info >/dev/null 2>&1; then
  rm -f /var/run/docker.pid
  (nohup dockerd >"$LOG" 2>&1 &)
  for i in $(seq 1 30); do docker info >/dev/null 2>&1 && break; sleep 2; done
fi
docker start vv >/dev/null 2>&1 || docker run -d --name vv -p 50021:50021 mirror.gcr.io/voicevox/voicevox_engine:cpu-latest >/dev/null
for i in $(seq 1 40); do curl -s -m 2 127.0.0.1:50021/version && echo " VOICEVOX ready" && break; sleep 3; done
# BGM: FluidSynth + FluidR3_GM (MIT licence, Frank Wen) and the Python helpers
which fluidsynth >/dev/null 2>&1 || apt-get install -y -q fluidsynth fluid-soundfont-gm >/dev/null 2>&1 || (apt-get update -q >/dev/null 2>&1 && apt-get install -y -q fluidsynth fluid-soundfont-gm >/dev/null 2>&1)
python3 -c "import mido, pedalboard" 2>/dev/null || pip install -q mido pedalboard scipy
ls /usr/share/sounds/sf2/FluidR3_GM.sf2 >/dev/null && echo "BGM tools ready"
