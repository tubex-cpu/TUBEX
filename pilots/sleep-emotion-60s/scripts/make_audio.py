"""Narration + SFX + BGM for the 60s pilot. Fully local and free.

Usage: python3 scripts/make_audio.py [--measure]
- Narration: Open JTalk + HTS voice "tohoku-f01 (neutral)"
  (c) 2015 Intelligent Communication Network (Ito-Nose) Laboratory, Tohoku University, CC BY 4.0.
  Extracted from the npm package @nmemonica/voice-ja@0.1.14 (see docs/credits.md, scripts/extract_voice.py).
- SFX and BGM are synthesized here with numpy (deterministic, no third-party audio).
Writes public/audio/mix.wav and data/timings.json (exact narration start/end for subtitles).
"""
import json, subprocess, sys, tempfile, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
DIC = "/var/lib/mecab/dic/open-jtalk/naist-jdic"
VOICE = ROOT / "voice/tohoku-f01-neutral.htsvoice"
SR = 48000
DUR = 60.0


def read_wav(p):
    with wave.open(str(p)) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float64) / 32768
        assert w.getframerate() == SR
    return x


def tts(text, rate):
    with tempfile.TemporaryDirectory() as t:
        raw, out = Path(t) / "r.wav", Path(t) / "o.wav"
        subprocess.run(["open_jtalk", "-x", DIC, "-m", str(VOICE), "-r", str(rate), "-ow", str(raw)],
                       input=text, text=True, check=True, stderr=subprocess.DEVNULL)
        af = ("silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
              "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
              "highpass=f=70,equalizer=f=3200:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", af, "-ar", str(SR), "-ac", "1", str(out)], check=True)
        return read_wav(out)


def env_ar(n, a, r):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / r)


def place(buf, x, at, gain=1.0, pan=0.5):
    i = int(at * SR)
    x = x[: max(0, len(buf) - i)]
    buf[i:i + len(x), 0] += x * gain * np.sqrt(1 - pan)
    buf[i:i + len(x), 1] += x * gain * np.sqrt(pan)


rng = np.random.default_rng(7)


def sfx_buzz(d=0.9):
    n = int(d * SR); t = np.arange(n) / SR
    gate = ((t % 0.45) < 0.3).astype(float)
    x = np.sign(np.sin(2 * np.pi * 150 * t)) * 0.35 + np.sin(2 * np.pi * 300 * t) * 0.3
    x = np.convolve(x, np.ones(24) / 24, "same")
    return x * gate * 0.5


def sfx_tick():
    n = int(0.05 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2400 * t) * np.exp(-t / 0.008) * 0.25


def sfx_soft_whoosh(d=0.7):
    n = int(d * SR)
    x = rng.standard_normal(n)
    x = np.convolve(x, np.ones(60) / 60, "same")
    e = np.sin(np.pi * np.arange(n) / n) ** 2
    return x * e * 0.25


def sfx_chime(f=880, d=1.6):
    n = int(d * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.5 for k in (1, 2, 3))
    return x * env_ar(n, 0.005, 0.45) * 0.18


def sfx_mri(d):
    n = int(d * SR); t = np.arange(n) / SR
    pulses = ((t * 2.6) % 1 < 0.22).astype(float)
    x = (np.sin(2 * np.pi * 820 * t) * 0.5 + np.sin(2 * np.pi * 410 * t) * 0.3) * pulses
    hum = np.sin(2 * np.pi * 60 * t) * 0.15
    fade = np.minimum(1, np.minimum(t / 0.4, (d - t) / 0.6))
    return (x * 0.18 + hum) * fade


def sfx_noise_swell(d=0.8):
    # soft "static" when the observer appears (no harsh flicker)
    n = int(d * SR)
    x = rng.standard_normal(n)
    x = x - np.convolve(x, np.ones(8) / 8, "same")  # brighter grain
    e = np.sin(np.pi * np.arange(n) / n) ** 1.5
    return x * e * 0.07


def bgm(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros((n, 2))
    hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)
    chords = [[45, 52, 57, 60, 64], [41, 48, 53, 57, 64], [43, 50, 55, 59, 62], [40, 47, 52, 55, 59]]
    bar = 5.0
    for i in range(int(np.ceil(dur / bar))):
        s = int(i * bar * SR); L = min(int((bar + 2.5) * SR), n - s)
        if L <= 0:
            break
        tt = np.arange(L) / SR
        e = np.minimum(1, tt / 2.0) * np.clip((bar + 2.5 - tt) / 2.5, 0, 1)
        for k, m in enumerate(chords[i % 4]):
            for det, pan in ((-0.7, 0.25), (0.7, 0.75)):
                w = np.sin(2 * np.pi * (hz(m) + det) * tt + k) + 0.25 * np.sin(4 * np.pi * (hz(m) + det) * tt)
                out[s:s + L, 0] += w * e * 0.012 * np.sqrt(1 - pan)
                out[s:s + L, 1] += w * e * 0.012 * np.sqrt(pan)
    # sparse soft piano-like notes
    notes = [69, 72, 76, 74, 72, 69, 67, 64]
    for j, at in enumerate(np.arange(1.0, dur - 2, 2.5)):
        L = int(2.2 * SR); s = int(at * SR); tt = np.arange(L) / SR
        f = hz(notes[j % len(notes)] + 12)
        w = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * env_ar(L, 0.004, 0.6) * 0.03
        place(out, w, at, 1.0, 0.35 + 0.3 * (j % 2))
    return out


def main():
    cfg = json.loads((ROOT / "data/narration.json").read_text())
    rate = cfg["rate"]
    voice = np.zeros((int(DUR * SR), 2))
    timings, prev_end = [], 0.0
    for ln in cfg["lines"]:
        x = tts(ln["tts"], rate)
        d = len(x) / SR
        start, end = ln["at"], ln["at"] + d
        warn = " <-- OVERLAP" if start < prev_end + 0.25 else ""
        warn += " <-- PAST END" if end > DUR - 0.3 else ""
        print(f'{ln["id"]} {start:6.2f} -> {end:6.2f} ({d:.2f}s){warn}')
        place(voice, x, start, 0.95)
        timings.append({"id": ln["id"], "start": round(start, 3), "end": round(end, 3), "sub": ln["sub"]})
        prev_end = end
    (ROOT / "data/timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=1))
    if "--measure" in sys.argv:
        return

    sfx = np.zeros_like(voice)
    for at, x, g, p in [
        (2.3, sfx_buzz(), 0.8, 0.65), (3.4, sfx_buzz(), 0.6, 0.65),
        (6.3, sfx_noise_swell(), 1.0, 0.5),
        (10.6, sfx_soft_whoosh(), 0.8, 0.5), (17.0, sfx_soft_whoosh(), 0.7, 0.5),
        (26.9, sfx_soft_whoosh(), 0.7, 0.5), (34.0, sfx_soft_whoosh(), 0.7, 0.5),
        (36.6, sfx_chime(660), 1.0, 0.5), (42.0, sfx_soft_whoosh(), 0.7, 0.5),
        (48.4, sfx_soft_whoosh(), 0.7, 0.5), (54.6, sfx_soft_whoosh(), 0.7, 0.5),
        (40.0, sfx_noise_swell(0.6), 0.8, 0.6), (54.8, sfx_noise_swell(), 0.9, 0.5),
        (57.3, sfx_chime(880), 0.9, 0.5),
    ]:
        place(sfx, x, at, g, p)
    place(sfx, sfx_mri(6.4), 27.2, 0.55, 0.5)
    for k in range(10):  # typing ticks for the observer's log lines
        place(sfx, sfx_tick(), 7.2 + k * 0.09, 0.5, 0.55)
        place(sfx, sfx_tick(), 57.0 + k * 0.08, 0.5, 0.55)

    music = bgm(DUR)
    # duck music under narration
    duck = np.ones(len(voice))
    for tm in timings:
        a, b = int((tm["start"] - 0.3) * SR), int((tm["end"] + 0.3) * SR)
        duck[max(0, a):b] = 0.45
    duck = np.convolve(duck, np.ones(SR // 5) / (SR // 5), "same")
    fade = np.minimum(1, np.minimum(np.arange(len(duck)) / SR / 1.0, (DUR - np.arange(len(duck)) / SR) / 1.5))
    mix = voice + sfx + music * (duck * fade)[:, None]
    peak = np.abs(mix).max()
    mix = mix / max(peak, 1e-9) * 0.89
    out = ROOT / "public/audio/mix.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes())
    print("wrote", out, "peak-normalized from", round(float(peak), 3))


main()
