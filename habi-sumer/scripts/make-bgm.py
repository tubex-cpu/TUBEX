"""オリジナルBGM 3曲をシンセで生成する（著作権フリー・ループ可能）。
  python3 scripts/make-bgm.py
出力: public/bgm/bgm1-night-court.mp3（前半）, bgm2-investigation.mp3（中盤）, bgm3-roots.mp3（後半）
"""
import subprocess, wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
rng = np.random.default_rng(7)

NOTE = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}


def hz(n: str) -> float:
    name, octv = n[:-1], int(n[-1])
    return 440 * 2 ** ((NOTE[name] + 12 * (octv + 1) - 69) / 12)


def env(n, a, r):
    e = np.ones(n)
    ai = min(n, int(a * SR))
    ri = min(n - ai, int(r * SR))
    if ai:
        e[:ai] = np.linspace(0, 1, ai)
    if ri:
        e[n - ri:] *= np.linspace(1, 0, ri)
    return e


def pad(f, dur, amp=0.12):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros((len(t), 2))
    for ch, det in enumerate((-0.004, 0.004)):
        s = sum(np.sin(2 * np.pi * f * k * (1 + det) * t + k) / k ** 1.6 for k in range(1, 7))
        out[:, ch] = s
    lfo = 0.85 + 0.15 * np.sin(2 * np.pi * 0.2 * t)
    return out * (env(len(t), dur * 0.35, dur * 0.4) * lfo * amp)[:, None]


def bell(f, dur, amp=0.1, pan=0.0):
    t = np.arange(int(dur * SR)) / SR
    s = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6) + 0.15 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 10))
    s *= np.exp(-t * 2.5) * env(len(t), 0.003, 0.05) * amp
    return np.stack([s * (1 - pan) / 1.5, s * (1 + pan) / 1.5], 1)


def piano(f, dur, amp=0.12, pan=0.0):
    t = np.arange(int(dur * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.5 + k * 0.9)) / k ** 1.2 for k in range(1, 6))
    s *= env(len(t), 0.004, 0.2) * amp
    return np.stack([s * (1 - pan) / 1.5, s * (1 + pan) / 1.5], 1)


def bass(f, dur, amp=0.22):
    t = np.arange(int(dur * SR)) / SR
    s = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)) * env(len(t), 0.01, min(0.15, dur * 0.4)) * amp
    return np.stack([s, s], 1)


def pluck(f, dur, amp=0.09, pan=0.0):
    t = np.arange(int(dur * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (8 + 4 * k)) / k for k in range(1, 5)) * amp
    return np.stack([s * (1 - pan) / 1.5, s * (1 + pan) / 1.5], 1)


def hat(amp=0.03):
    n = int(0.05 * SR)
    s = np.diff(rng.standard_normal(n + 1)) * np.exp(-np.arange(n) / SR * 90) * amp
    return np.stack([s, s], 1)


def kick(amp=0.35):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 70 * np.exp(-t * 30)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * amp
    return np.stack([s, s], 1)


def tick(amp=0.05):
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 300) * amp
    return np.stack([s, s], 1)


def reverb(x, wet=0.3):
    out = np.zeros_like(x)
    for ch in range(2):
        acc = np.zeros(len(x))
        for d, g in ((1557, 0.84), (1617, 0.83), (1491, 0.85), (1422, 0.86)):
            d += ch * 23
            a = np.zeros(d + 1)
            a[0], a[d] = 1, -g
            acc += lfilter([1], a, x[:, ch])
        for d in (225, 556):
            b = np.zeros(d + 1)
            b[0], b[d] = -0.5, 1
            a = np.zeros(d + 1)
            a[0], a[d] = 1, -0.5
            acc = lfilter(b, a, acc)
        out[:, ch] = acc / 4
    lp = lfilter([0.25], [1, -0.75], out, axis=0)
    return x * (1 - wet) + lp * wet


class Track:
    def __init__(self, bpm, bars):
        self.beat = 60 / bpm
        self.len = int(bars * 4 * self.beat * SR)
        self.buf = np.zeros((self.len + SR * 8, 2))

    def add(self, beat_pos, sig):
        i = int(beat_pos * self.beat * SR)
        self.buf[i:i + len(sig)] += sig[: len(self.buf) - i]

    def render(self, path, wet=0.3):
        y = reverb(self.buf, wet)
        loop = y[: self.len].copy()
        tail = y[self.len:]
        loop[: len(tail)] += tail[: len(loop)]  # 余韻を頭に回してループの継ぎ目をなくす
        loop = lfilter([1, -1], [1, -0.995], loop, axis=0)  # DC除去
        loop *= 0.85 / np.max(np.abs(loop))
        wav = path.with_suffix('.wav')
        with wave.open(str(wav), 'wb') as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((loop * 32767).astype(np.int16).tobytes())
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-b:a', '160k', str(path)], check=True)
        wav.unlink()
        print(path.name, f'{self.len / SR:.1f}s')


out = ROOT / 'public/bgm'
out.mkdir(parents=True, exist_ok=True)

# 1. 前半「閉園後の法廷」：Dマイナー、ゆっくり、オルゴールのようなベルと時計の音
tr = Track(70, 32)
prog = [['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['G2', 'Bb2', 'D3'], ['A2', 'C#3', 'E3']]
for bar in range(32):
    ch = prog[(bar // 2) % 4]
    if bar % 2 == 0:
        for n in ch:
            tr.add(bar * 4, pad(hz(n), 8 * tr.beat, 0.07))
        tr.add(bar * 4, bass(hz(ch[0][:-1] + '2'), 7.5 * tr.beat, 0.12))
    for b in range(4):
        tr.add(bar * 4 + b, tick(0.025 if b else 0.04))
    if bar >= 4:
        arp = [ch[0], ch[1], ch[2], ch[1]]
        for k in range(8):
            if rng.random() < 0.55:
                n = arp[k % 4]
                f = hz(n) * (4 if k % 3 else 2)
                tr.add(bar * 4 + k * 0.5, bell(f, 2.5, 0.06, rng.uniform(-0.6, 0.6)))
tr.render(out / 'bgm1-night-court.mp3', 0.4)

# 2. 中盤「調査」：Aマイナー、刻むベースとピチカート、緊張感
tr = Track(92, 32)
prog = [['A2', 'C3', 'E3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'], ['E2', 'G#2', 'B2']]
for bar in range(32):
    ch = prog[bar % 4]
    for n in ch:
        tr.add(bar * 4, pad(hz(n) * 2, 4 * tr.beat, 0.05))
    for k in range(8):
        tr.add(bar * 4 + k * 0.5, bass(hz(ch[0]), 0.45 * tr.beat, 0.16 if k % 2 == 0 else 0.1))
    if bar >= 2:
        tr.add(bar * 4, kick(0.28))
        tr.add(bar * 4 + 2.5, kick(0.18))
        for k in range(8):
            tr.add(bar * 4 + k * 0.5 + 0.25, hat(0.018 if k % 2 else 0.028))
    if bar >= 8:
        pat = [ch[0], ch[2], ch[1], ch[2], ch[0], ch[2], ch[1], ch[2]]
        for k, n in enumerate(pat):
            tr.add(bar * 4 + k * 0.5, pluck(hz(n) * 4, 0.6, 0.05, 0.4 if k % 2 else -0.4))
tr.render(out / 'bgm2-investigation.mp3', 0.25)

# 3. 後半「足元にあった物語」：Cメジャー、温かいピアノとストリングス
tr = Track(76, 32)
prog = [['C3', 'E3', 'G3'], ['B2', 'D3', 'G3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'],
        ['F2', 'A2', 'C3'], ['C3', 'E3', 'G3'], ['D3', 'F3', 'A3'], ['G2', 'B2', 'D3']]
melody = ['E5', 'D5', 'C5', 'G4', 'A4', 'G4', 'E4', 'G4', 'F4', 'A4', 'C5', 'A4', 'G4', 'E4', 'D4', 'G4']
for bar in range(32):
    ch = prog[bar % 8]
    for n in ch:
        tr.add(bar * 4, pad(hz(n) * 2, 4 * tr.beat, 0.06))
    tr.add(bar * 4, bass(hz(ch[0]), 3.8 * tr.beat, 0.14))
    for k in range(4):
        n = [ch[0], ch[1], ch[2], ch[1]][k]
        tr.add(bar * 4 + k, piano(hz(n) * 2, 2.5, 0.06, -0.3))
    if bar >= 4:
        m1, m2 = melody[(bar * 2) % 16], melody[(bar * 2 + 1) % 16]
        tr.add(bar * 4, piano(hz(m1), 3.0, 0.09, 0.3))
        tr.add(bar * 4 + 2, piano(hz(m2), 3.0, 0.08, 0.3))
tr.render(out / 'bgm3-roots.mp3', 0.35)
