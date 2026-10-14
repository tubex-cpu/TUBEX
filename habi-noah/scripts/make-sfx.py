"""効果音（小槌の打撃音・判決のハンコ音）を生成する。
  python3 scripts/make-sfx.py
"""
import subprocess, wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
rng = np.random.default_rng(3)
out = ROOT / 'public/sfx'
out.mkdir(parents=True, exist_ok=True)


def save(name, s):
    s = s / np.max(np.abs(s)) * 0.9
    wav = out / f'{name}.wav'
    with wave.open(str(wav), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((s * 32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-b:a', '128k', str(wav.with_suffix('.mp3'))], check=True)
    wav.unlink()


t = np.arange(int(0.9 * SR)) / SR
# 小槌：木の「コン！」＋法廷に響く低い余韻
body = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) * a for f, d, a in ((180, 18, 1.0), (420, 30, 0.6), (980, 45, 0.35), (1730, 60, 0.2)))
click = lfilter([1, -0.6], [1], rng.standard_normal(len(t))) * np.exp(-t * 220) * 0.8
room = lfilter([1], [1, -0.9], rng.standard_normal(len(t))) * np.exp(-t * 7) * 0.02
save('gavel', body + click + room)

# ハンコ：「ドン」と押す低音
t = np.arange(int(0.5 * SR)) / SR
f = 60 + 90 * np.exp(-t * 25)
thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10)
noise = lfilter([0.2], [1, -0.8], rng.standard_normal(len(t))) * np.exp(-t * 60)
save('stamp', thump + noise)

# 扉：重い木の扉がきしみながら開く音＋低い響き
t = np.arange(int(2.2 * SR)) / SR
pitch = 210 + 60 * np.sin(2 * np.pi * 0.7 * t) + 30 * rng.standard_normal(len(t)).cumsum() / SR
saw = 2 * ((np.cumsum(pitch) / SR) % 1) - 1
creak = lfilter([1], [1, -0.92], saw * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 11 * t)))) * 0.05
creak *= np.clip(t / 0.15, 0, 1) * np.clip((1.8 - t) / 0.5, 0, 1)
boom_t = np.clip(t - 1.6, 0, None)
boom = np.sin(2 * np.pi * 55 * boom_t) * np.exp(-boom_t * 6) * (t > 1.6) * 0.8
air = lfilter([1], [1, -0.97], rng.standard_normal(len(t))) * 0.004 * np.exp(-t * 0.8)
save('door', creak + boom + air)
