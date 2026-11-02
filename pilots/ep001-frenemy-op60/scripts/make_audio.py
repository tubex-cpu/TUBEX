"""Narration + SFX + BGM for the 60s pilot. Fully local and free.

Usage: python3 scripts/make_audio.py [--measure]
- Narration: VOICEVOX engine 0.26 (docker), voice ナースロボ＿タイプＴ ノーマル — credit "VOICEVOX:ナースロボ＿タイプＴ".
  (old: Open JTalk + HTS voice "tohoku-f01 (neutral)"
  (c) 2015 Intelligent Communication Network (Ito-Nose) Laboratory, Tohoku University, CC BY 4.0.
  Extracted from the npm package @nmemonica/voice-ja@0.1.14 (see docs/credits.md, scripts/extract_voice.py).
- SFX and BGM are synthesized here with numpy (deterministic, no third-party audio).
Writes public/audio/mix.wav and data/timings.json (exact narration start/end for subtitles).
"""
import json, os, subprocess, sys, tempfile, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
DIC = "/var/lib/mecab/dic/open-jtalk/naist-jdic"
VOICE = ROOT / "voice/tohoku-f01-neutral.htsvoice"
SR = 48000
DUR = float(os.environ.get("DUR", "30"))


def read_wav(p):
    with wave.open(str(p)) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float64) / 32768
        assert w.getframerate() == SR
    return x


VV = "http://127.0.0.1:50021"
import os
SPEAKER = int(os.environ.get("VV_SPEAKER", "29"))  # 29 = VOICEVOX: No.7（ノーマル）／47 = ナースロボ＿タイプＴ（ノーマル）


def tts(text, rate):
    """VOICEVOX engine (local docker container). Credit: VOICEVOX:ナースロボ＿タイプＴ"""
    import urllib.parse, urllib.request
    q = urllib.request.urlopen(urllib.request.Request(f"{VV}/audio_query?speaker={SPEAKER}&text={urllib.parse.quote(text)}", method="POST")).read()
    query = json.loads(q)
    query.update({"speedScale": rate, "prePhonemeLength": 0.0, "postPhonemeLength": 0.05, "outputSamplingRate": SR, "outputStereo": False, "volumeScale": 1.0, "intonationScale": 1.1})
    wavb = urllib.request.urlopen(urllib.request.Request(f"{VV}/synthesis?speaker={SPEAKER}", data=json.dumps(query).encode(), headers={"Content-Type": "application/json"}, method="POST")).read()
    with tempfile.TemporaryDirectory() as t:
        raw, out = Path(t) / "r.wav", Path(t) / "o.wav"
        raw.write_bytes(wavb)
        af = ("silenceremove=start_periods=1:start_threshold=-50dB,areverse,"
              "silenceremove=start_periods=1:start_threshold=-50dB,areverse,"
              "highpass=f=70,acompressor=threshold=-20dB:ratio=2:attack=8:release=120")
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
    chords = [[45, 52, 57, 60, 64], [44, 51, 56, 59, 63], [41, 48, 53, 56, 60], [40, 47, 52, 55, 59]]
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
    notes = [69, 72, 71, 68, 69, 64, 65, 64]
    for j, at in enumerate(np.arange(1.0, dur - 2, 2.5)):
        L = int(2.2 * SR); s = int(at * SR); tt = np.arange(L) / SR
        f = hz(notes[j % len(notes)] + 12)
        w = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * env_ar(L, 0.004, 0.6) * 0.03
        place(out, w, at, 1.0, 0.35 + 0.3 * (j % 2))
    return out


def piano(f, d=2.2, vel=1.0):
    n = int(d * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(1, 9):
        fk = f * k * (1 + 0.0004 * k * k)  # slight inharmonicity
        if fk > 9000:
            break
        x += np.sin(2 * np.pi * fk * t + k) * (0.9 ** k) / k * np.exp(-t * (1.2 + 0.9 * k))
    att = np.minimum(1, t / 0.004)
    return x * att * vel * 0.22


def strings(freqs, d, att=1.6, rel=1.6):
    n = int(d * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for det in (-0.25, 0.0, 0.3):
            ph = 2 * np.pi * (f * (1 + det / 100)) * t
            # band-limited saw (first 6 partials) -> soft string tone
            x += sum(np.sin(ph * k) / k for k in range(1, 7)) * (1 + 0.1 * np.sin(2 * np.pi * 5.2 * t))
    env = np.minimum(1, t / att) * np.clip((d - t) / rel, 0, 1)
    return x * env * 0.012


def bgm2(dur):
    n = int(dur * SR)
    out = np.zeros((n, 2))
    hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)
    beat = 60 / 76
    # Am - F - Dm - E, 2 bars each (4/4)
    prog = [(57, [57, 60, 64, 69, 72, 69, 64, 60]), (53, [53, 57, 60, 65, 69, 65, 60, 57]),
            (50, [50, 53, 57, 62, 65, 62, 57, 53]), (52, [52, 56, 59, 64, 68, 64, 59, 56])]
    t0 = 2.3
    bar = 0
    while True:
        at = t0 + bar * 4 * beat
        if at > dur:
            break
        root, arp = prog[(bar // 2) % 4]
        for i in range(8):  # eighth notes
            tt = at + i * beat / 2
            if tt > dur - 0.4:
                break
            v = 0.8 if i % 4 == 0 else 0.55
            place(out, piano(hz(arp[i] + 12), 2.0, v), tt, 1.0, 0.4 + 0.2 * (i % 2))
        if bar % 2 == 0:
            chord = [hz(m + 12) for m in arp[:3]]
            place(out, strings(chord, min(8 * beat + 1.2, dur - at)), at, 1.0, 0.5)
        bar += 1
    # faint clock tick from the "frenemy" moment on (tension)
    for k in range(int((dur - 16.2) / beat)):
        tt = 16.2 + k * beat
        m = int(0.03 * SR); t = np.arange(m) / SR
        tick = np.sin(2 * np.pi * 3200 * t) * np.exp(-t / 0.004) * 0.05
        place(out, tick, tt, 1.0, 0.65)
    return out


def main():
    cfg = json.loads((ROOT / "data/narration.json").read_text())
    rate = cfg["rate"]
    voice = np.zeros((int(DUR * SR), 2))
    timings, prev_end = [], 0.0
    for ln in [l for l in cfg["lines"] if l["at"] < DUR - 0.5]:
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
    def click():
        n = int(0.06 * SR); t = np.arange(n) / SR
        return (np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.004) + rng.standard_normal(n) * np.exp(-t / 0.01) * 0.3) * 0.4
    def boom(d=2.2):
        n = int(d * SR); t = np.arange(n) / SR
        f = 55 * np.exp(-t * 0.6)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.9) * 0.55
    def pulse(d=0.5):  # low heartbeat-like thump
        n = int(d * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * 48 * t) * np.exp(-t / 0.12) * 0.5
    def ambience(d, lp=200, g=0.05):
        n = int(d * SR)
        x = rng.standard_normal(n)
        x = np.convolve(x, np.ones(lp) / lp, "same") * g * 18
        fade = np.minimum(1, np.minimum(np.arange(n) / SR / 0.5, (d - np.arange(n) / SR) / 0.5))
        return x * fade
    def murmur(d):  # cafe room tone: soft band-limited babble-like noise (synthetic)
        n = int(d * SR); t = np.arange(n) / SR
        x = rng.standard_normal(n)
        x = np.convolve(x, np.ones(40) / 40, "same") - np.convolve(x, np.ones(400) / 400, "same")
        env = 0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t) * np.sin(2 * np.pi * 0.23 * t)
        fade = np.minimum(1, np.minimum(t / 0.4, (d - t) / 0.4))
        return x * env * fade * 0.12
    def hit(d=0.9):  # soft tension hit (mid range, no sub-bass)
        n = int(d * SR); t = np.arange(n) / SR
        return (np.sin(2 * np.pi * 220 * t) * 0.5 + np.sin(2 * np.pi * 330 * t) * 0.3 + np.sin(2 * np.pi * 440 * t) * 0.15) * np.exp(-t / 0.35) * 0.35
    for at, x, gn, p in [
        (0.25, click(), 0.6, 0.5),                     # pendant lamp switches on
        (7.6, sfx_soft_whoosh(), 0.35, 0.5), (10.6, sfx_soft_whoosh(), 0.35, 0.5), (13.65, sfx_soft_whoosh(), 0.35, 0.5),
        (16.2, hit(), 1.0, 0.5),                       # "フレネミーじゃないですか" freeze
        (16.25, sfx_noise_swell(0.7), 0.6, 0.6),      # observer appears
        (18.15, sfx_soft_whoosh(), 0.35, 0.5),
        (20.3, sfx_chime(1046, 0.8), 0.45, 0.5),      # "おめでとう"
        (22.5, hit(0.7), 0.6, 0.5),                    # "でも"
        (23.85, sfx_soft_whoosh(), 0.35, 0.5),
    ]:
        place(sfx, x, at, gn, p)
    for k in range(10):  # footsteps on the walk home
        place(sfx, click() * 0.3, 24.2 + k * 0.55, 0.45, 0.45 + 0.1 * (k % 2))

    music = bgm2(DUR)
    # duck music under narration
    duck = np.ones(len(voice))
    for tm in timings:
        a, b = int((tm["start"] - 0.3) * SR), int((tm["end"] + 0.3) * SR)
        duck[max(0, a):b] = 0.5
    duck = np.convolve(duck, np.ones(SR // 5) / (SR // 5), "same")
    fade = np.minimum(1, np.minimum(np.arange(len(duck)) / SR / 1.0, (DUR - np.arange(len(duck)) / SR) / 1.5))
    bed = sfx + music * (duck * fade)[:, None]
    with tempfile.TemporaryDirectory() as td:
        a_, b_ = Path(td) / "a.wav", Path(td) / "b.wav"
        with wave.open(str(a_), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(bed / max(1e-9, np.abs(bed).max()) * 0.9, -1, 1) * 32767).astype("<i2").tobytes())
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(a_), "-af", "highpass=f=110:poles=2,highpass=f=110:poles=2", str(b_)], check=True)
        with wave.open(str(b_)) as w:
            bedh = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float64).reshape(-1, 2) / 32768
        bedh = bedh[: len(voice)] * (np.abs(bed).max() / 0.9)
    fadeout = np.clip((DUR - np.arange(len(voice)) / SR) / 0.8, 0, 1)
    mix = (voice + bedh * 0.9) * fadeout[:, None]
    peak = np.abs(mix).max()
    mix = mix / max(peak, 1e-9) * 0.89
    out = ROOT / "public/audio/mix.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes())
    print("wrote", out, "peak-normalized from", round(float(peak), 3))


main()
