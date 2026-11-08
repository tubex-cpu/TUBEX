"""BGM (synthesized here with numpy — no third-party audio) + narration mix → out/mix.wav."""
import wave
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent
SR = 48000


def read(p):
    with wave.open(str(p)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float64) / 32768


def pad(dur):
    t = np.arange(int(dur * SR)) / SR
    # slow chord progression (Am – F – C – G), soft sine/triangle pads with long fades
    chords = [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [196.0, 261.63, 329.63], [196.0, 246.94, 293.66]]
    seg = 8.0
    out = np.zeros_like(t)
    for i in range(int(dur // seg) + 1):
        a, b = i * seg, i * seg + seg + 2.0
        m = (t >= a) & (t < b)
        tt = t[m] - a
        env = np.clip(tt / 2.5, 0, 1) * np.clip((b - a - tt) / 2.5, 0, 1)
        for f in chords[i % 4]:
            out[m] += env * (0.6 * np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f / 2 * tt))
    lfo = 0.85 + 0.15 * np.sin(2 * np.pi * t / 23)
    out *= lfo
    # gentle low-pass by moving average
    k = 24
    out = np.convolve(out, np.ones(k) / k, mode="same")
    return out / np.abs(out).max()


import os
NAR = os.environ.get("MIX_AUDIO_DIR", "audio")      # v2.3: MIX_AUDIO_DIR=audio_v2_3 MIX_OUT=mix_v2_3.wav
MIX_OUT = os.environ.get("MIX_OUT", "mix.wav")


def main():
    nar = read(HERE.parent / NAR / "narration.wav")
    dur = len(nar) / SR + 2.5
    bgm = pad(dur) * 10 ** (-27 / 20)
    n = np.zeros(int(dur * SR)); n[:len(nar)] = nar
    # duck BGM a little under speech
    env = np.convolve(np.abs(n), np.ones(SR // 5) / (SR // 5), mode="same")
    duck = 1 - 0.35 * np.clip(env / 0.05, 0, 1)
    fade = np.clip((dur - np.arange(len(n)) / SR) / 2.5, 0, 1) * np.clip(np.arange(len(n)) / SR / 1.5, 0, 1)
    y = n + bgm * duck * fade
    y = y / max(1e-9, np.abs(y).max()) * 0.89
    st = np.stack([y, y], 1)
    with wave.open(str(HERE / "out" / MIX_OUT), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype("<i2").tobytes())


if __name__ == "__main__":
    main()
