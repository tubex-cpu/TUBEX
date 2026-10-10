"""Generate narration + BGM for an episode, fully local and free.

Usage: python3 video/scripts/make_audio.py <episode-id>

- Narration: Open JTalk (apt: open-jtalk open-jtalk-mecab-naist-jdic hts-voice-nitech-jp-atr503-m001).
  Voice license CC BY 3.0 (Nagoya Institute of Technology) -> credit is shown in the outro scene.
- BGM: synthesized here with numpy (no third-party music, no license issues).
- Writes video/public/episodes/<id>/*.mp3 and updates script.json (scene.seconds, scene.audio, bgm)
  so captions, narration and duration stay in sync.
"""
import json
import math
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
DIC = "/var/lib/mecab/dic/open-jtalk/naist-jdic"
VOICE = "/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice"
SR = 48000
LEAD_IN = 0.4  # seconds of silence before narration starts in each scene (matches Episode.tsx)
TAIL = 1.0  # seconds after narration ends before the scene cuts


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        check=True, capture_output=True, text=True,
    )
    return float(out.stdout.strip())


def to_mp3(src: Path, dst: Path) -> None:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-codec:a", "libmp3lame", "-b:a", "128k", str(dst)], check=True)


def tts(text: str, dst: Path) -> float:
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "n.wav"
        subprocess.run(
            ["open_jtalk", "-x", DIC, "-m", VOICE, "-r", "1.05", "-ow", str(wav)],
            input=text, text=True, check=True,
        )
        to_mp3(wav, dst)
    return duration(dst)


def write_wav(path: Path, stereo: np.ndarray) -> None:
    pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def bgm(seconds: float, dst: Path) -> None:
    """Quiet night-time pad + sparse music-box notes. Deterministic (fixed seed)."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    rng = np.random.default_rng(1)
    hz = lambda midi: 440.0 * 2 ** ((midi - 69) / 12)
    chords = [[48, 55, 59, 64], [45, 52, 55, 60], [41, 48, 52, 57], [43, 50, 53, 59]]  # Cmaj7 Am7 Fmaj7 G7sus-ish
    bar = 6.0
    for i in range(int(math.ceil(seconds / bar))):
        start = int(i * bar * SR)
        length = min(int((bar + 2.0) * SR), n - start)
        if length <= 0:
            break
        tt = np.arange(length) / SR
        env = np.minimum(1, tt / 1.8) * np.minimum(1, np.maximum(0, (bar + 2.0 - tt) / 2.0))
        for k, m in enumerate(chords[i % 4]):
            f = hz(m)
            for detune, pan in ((-0.6, 0.3), (0.6, 0.7)):
                wave_ = np.sin(2 * np.pi * (f + detune) * tt + k) * env * 0.035
                out[start:start + length, 0] += wave_ * (1 - pan)
                out[start:start + length, 1] += wave_ * pan
    scale = [72, 74, 76, 79, 81, 84]
    note_t = 1.0
    while note_t < seconds - 2:
        start = int(note_t * SR)
        length = min(int(2.5 * SR), n - start)
        tt = np.arange(length) / SR
        f = hz(scale[rng.integers(len(scale))])
        tone = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 2.2) * 0.05
        pan = rng.uniform(0.25, 0.75)
        out[start:start + length, 0] += tone * (1 - pan)
        out[start:start + length, 1] += tone * pan
        note_t += rng.choice([1.5, 2.0, 3.0])
    fade = int(2.0 * SR)
    out[:fade] *= np.linspace(0, 1, fade)[:, None]
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    out /= max(1e-9, np.abs(out).max()) / 0.5
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "bgm.wav"
        write_wav(wav, out)
        to_mp3(wav, dst)


def main() -> None:
    episode = sys.argv[1]
    script_path = ROOT / "episodes" / episode / "script.json"
    data = json.loads(script_path.read_text(encoding="utf-8"))
    out_dir = ROOT / "video" / "public" / "episodes" / episode
    out_dir.mkdir(parents=True, exist_ok=True)
    total = 0.0
    for scene in data["scenes"]:
        dst = out_dir / f"{scene['id']}.mp3"
        d = tts(scene["narration"], dst)
        scene["seconds"] = max(5.0, math.ceil((LEAD_IN + d + TAIL) * 2) / 2)
        scene["audio"] = f"episodes/{episode}/{dst.name}"
        total += scene["seconds"]
        print(f"{scene['id']:12s} narration {d:5.2f}s -> scene {scene['seconds']:.1f}s")
    bgm(total, out_dir / "bgm.mp3")
    data["bgm"] = f"episodes/{episode}/bgm.mp3"
    script_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"total {total:.1f}s")


if __name__ == "__main__":
    main()
