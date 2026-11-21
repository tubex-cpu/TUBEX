"""New score + mix for the 3D re-make of 地球の事情 (the approved narration is unchanged).
Composed here as MIDI and played with FluidSynth + FluidR3_GM (Frank Wen, MIT licence) — the same method as
ルール改変ニッポン v2 (pilots/kaihen-001-equal-pay/scripts/bgm.py, whose Song/play helpers are reused).
Cues follow the edit: an opening swell into the first question card, a short swell on every chapter card, and between
cards a documentary cue that changes character by chapter (journey / history / tension / journey / resolve ...).
Sound effects (numpy, no third-party audio): a soft click when a map pin lands, a low thump when a big number rises.
Usage: python3 scripts/bgm_chizu.py <ca|bm>   → out/<ep>/mix.wav
"""
import json, sys, wave
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parents[1]
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "pilots/kaihen-001-equal-pay/scripts"))
import bgm as K  # noqa: E402
from bgm import Song, chord, N, PIANO, MARIMBA, STRINGS, TREM, PIZZ, SLOWSTR, SYNTHPAD, TIMP, FINGBASS, CHOIR, CELESTA, HARP, KICK, RIM, HH, SHAKER, CRASH  # noqa: E402
from pedalboard import Pedalboard, Reverb, Compressor, HighpassFilter, LowShelfFilter, Gain  # noqa: E402

KEY = sys.argv[1]
EPN = {"ca": "chizu-003-canada-housing", "bm": "chizu-005-bermuda-roof-water"}[KEY]
NAR = ROOT / "episodes" / EPN / ("audio/narration.wav" if KEY == "ca" else "audio_v3/narration.wav")
DATA = json.loads((ROOT / "episodes" / EPN / "render/out/plates/timeline3d.json").read_text())
SR = 48000
BPM = 84
B = lambda s: s * BPM / 60


def opening(sec):
    s = Song(BPM); s.prog(0, SLOWSTR); s.prog(1, HARP); s.prog(2, TIMP); s.prog(3, CHOIR); s.prog(4, PIANO)
    b = B(sec)
    for p in [38, 50] + chord("D", "M", 3):
        s.note(0, p, 0, b, 64)
    s.ramp(0, 11, 35, 115, 0, b)
    k = 0.0
    arp = chord("D", "add9", 4) + chord("D", "add9", 5)
    while k < b - 0.5:
        s.note(1, arp[int(k * 2) % len(arp)], k, 0.6, 52 + 30 * k / b)
        k += 0.5
    for p in chord("A", "sus", 4):
        s.note(3, p, b * 0.5, b * 0.5, 45)
    s.ramp(3, 11, 20, 90, b * 0.5, b * 0.5)
    for i in range(int(b * 2)):
        s.note(2, 38, i / 2, 0.5, 20 + 70 * (i / (b * 2)) ** 3)
    for i, p in enumerate([74, 76, 78, 81]):
        s.note(4, p, 1 + i * 2, 2, 50)
    return s


def card(sec):
    s = Song(BPM); s.prog(0, STRINGS); s.prog(1, CELESTA); s.prog(2, TIMP); s.prog(3, PIANO)
    b = B(sec)
    for p in chord("G", "M7", 3) + [43]:
        s.note(0, p, 0, b, 62)
    s.ramp(0, 11, 50, 105, 0, b * 0.7)
    s.note(2, 43, 0, 1.5, 95); s.note(9, CRASH, 0, 3, 70)
    for i, p in enumerate([83, 86, 90, 88]):
        s.note(1, p, 0.5 + i * 0.75, 1, 60)
    s.note(3, 67, 0, b, 55); s.note(3, 74, 0, b, 50)
    return s


def journey(sec, key=("D", "A", "B", "G"), kinds=("M", "M", "m", "M")):
    s = Song(BPM); s.prog(0, PIANO); s.prog(1, PIZZ); s.prog(2, FINGBASS); s.prog(3, STRINGS); s.prog(4, MARIMBA)
    bars = int(B(sec) // 4) + 1
    for bar in range(bars):
        at = bar * 4
        r, k = key[bar % 4], kinds[bar % 4]
        c = chord(r, k, 4)
        for i, p in enumerate([c[0], c[2], c[1] + 12, c[2], c[0] + 12, c[2], c[1] + 12, c[2]]):
            s.note(0, p, at + i / 2, 0.5, 50 + (8 if i % 4 == 0 else 0))
        if bar % 2:
            s.note(1, c[1] + 12, at + 1.5, 0.5, 58); s.note(1, c[2] + 12, at + 3.5, 0.5, 58)
        root = 12 * 2 + N[r]
        s.note(2, root, at, 2, 78); s.note(2, root + 7, at + 2, 2, 70)
        for p in chord(r, k, 4):
            s.note(3, p, at, 4, 38)
        if bar >= 2:
            for i in range(8):
                s.note(9, SHAKER, at + i / 2, 0.25, 30 if i % 2 else 42)
            s.note(9, KICK, at, 0.5, 62); s.note(9, RIM, at + 2, 0.25, 48)
        if bar % 4 == 3:
            s.note(4, c[2] + 12, at + 3, 1, 55)
    return s


def history(sec):
    s = Song(BPM); s.prog(0, SLOWSTR); s.prog(1, HARP); s.prog(2, FINGBASS); s.prog(3, CELESTA); s.prog(4, PIANO)
    prog = [("F", "M"), ("C", "M"), ("D", "m"), ("Bb", "M")]
    bars = int(B(sec) // 4) + 1
    for bar in range(bars):
        at = bar * 4
        r, k = prog[bar % 4]
        for p in chord(r, k, 4):
            s.note(0, p, at, 4, 52)
        arp = chord(r, k, 4) + [chord(r, k, 4)[0] + 12]
        for i in range(8):
            s.note(1, arp[i % 4] + (12 if i >= 4 else 0), at + i / 2, 0.5, 46)
        s.note(2, 12 * 2 + N[r], at, 4, 70)
        if bar % 2 == 0:
            s.note(4, chord(r, k, 5)[2], at + 1, 2, 46)
        if bar % 4 == 1:
            s.note(3, chord(r, k, 6)[0], at + 3.5, 0.5, 50)
    return s


def tension(sec):
    s = Song(BPM); s.prog(0, TREM); s.prog(1, PIANO); s.prog(2, SYNTHPAD); s.prog(3, TIMP); s.prog(4, FINGBASS)
    prog = [("D", "m"), ("Bb", "M"), ("G", "m"), ("A", "m")]
    bars = int(B(sec) // 4) + 1
    for bar in range(bars):
        at = bar * 4
        r, k = prog[bar % 4]
        for p in chord(r, k, 3):
            s.note(2, p, at, 4, 50)
        for p in [chord(r, k, 4)[0], chord(r, k, 4)[2]]:
            s.note(0, p, at, 4, 46)
        for i in range(4):
            s.note(1, chord(r, k, 3)[0] + (12 if i == 2 else 0), at + i, 0.9, 54)
        s.note(4, 12 * 2 + N[r], at, 4, 70)
        if bar % 2 == 1:
            s.note(3, 38, at + 3.5, 0.5, 58)
        for i in range(8):
            s.note(9, HH, at + i / 2, 0.25, 22 if i % 2 else 30)
    return s


def resolve(sec):
    return journey(sec, key=("G", "D", "E", "C"), kinds=("M", "M", "m", "M"))


def journey2(sec):
    return journey(sec, key=("A", "F#" if False else "Gb", "D", "E"), kinds=("M", "m", "M", "M"))


def explore(sec):
    """lighter: marimba + pizzicato, for maps and comparisons"""
    s = Song(BPM); s.prog(0, MARIMBA); s.prog(1, PIZZ); s.prog(2, FINGBASS); s.prog(3, CELESTA); s.prog(4, STRINGS)
    prog = [("C", "M"), ("A", "m"), ("F", "M"), ("G", "M")]
    bars = int(B(sec) // 4) + 1
    for bar in range(bars):
        at = bar * 4
        r, k = prog[bar % 4]
        c = chord(r, k, 5)
        for i, p in enumerate([c[0], c[1], c[2], c[1], c[0] + 12, c[2], c[1], c[2]]):
            s.note(0, p, at + i / 2, 0.5, 48 + (8 if i % 4 == 0 else 0))
        s.note(1, c[0] - 12, at + 1, 0.5, 52); s.note(1, c[2] - 12, at + 3, 0.5, 52)
        s.note(2, 12 * 2 + N[r], at, 2, 72); s.note(2, 12 * 2 + N[r] + 7, at + 2, 2, 64)
        for p in chord(r, k, 4):
            s.note(4, p, at, 4, 32)
        for i in range(8):
            s.note(9, SHAKER, at + i / 2, 0.25, 28 if i % 2 else 38)
        s.note(9, KICK, at, 0.5, 55); s.note(9, RIM, at + 3, 0.25, 45)
    return s


CUES = {"opening": opening, "card": card, "journey": journey, "history": history, "tension": tension, "resolve": resolve, "journey2": journey2, "explore": explore}


def sections():
    total = DATA["total"]
    cards = [s for s in DATA["shots"] if s["kind"] == "card"]
    out = []
    t = 0.0
    cycle = ["journey", "explore", "history", "tension", "journey2", "explore", "history", "tension"]
    scene_starts = sorted({sc["start"] for sc in DATA["scenes"]})
    q = 0

    def fill(a, b):
        nonlocal q
        # split long stretches at scene starts, about every 75 s, so the music keeps moving
        cuts = [a]
        for x in scene_starts:
            if x - cuts[-1] >= 70 and b - x >= 40:
                cuts.append(x)
        cuts.append(b)
        for x0, x1 in zip(cuts, cuts[1:]):
            out.append((x0, x1, cycle[q % len(cycle)])); q += 1
    for j, c in enumerate(cards):
        if c["start"] - t > 0.5:
            if j == 0:
                out.append((t, c["start"], "opening"))
            else:
                fill(t, c["start"])
        out.append((c["start"], c["end"], "card"))
        t = c["end"]
    if total - t > 0.5:
        out.append((t, total, "resolve"))
    return out


def render():
    secs = sections()
    n = int(DATA["total"] * SR) + SR
    out = np.zeros((n, 2))
    for i, (a, b, kind) in enumerate(secs):
        tail = 2.5 if i + 1 < len(secs) else 0.0
        x = K.play(CUES[kind](b - a + tail), b - a + tail, SR)
        tt = np.arange(len(x)) / SR
        env = np.clip(tt / 0.03, 0, 1) if i else np.ones(len(x))
        if tail:
            env = env * np.clip(((b - a) + 0.35 - tt) / (0.35 + tail * 0.4), 0, 1) ** 1.5
        i0 = int(a * SR); m = min(len(x), n - i0)
        out[i0:i0 + m] += x[:m] * env[:m, None]
    board = Pedalboard([HighpassFilter(45), LowShelfFilter(cutoff_frequency_hz=180, gain_db=1.0), Reverb(room_size=0.6, wet_level=0.18, dry_level=0.9, width=1.0),
                        Compressor(threshold_db=-18, ratio=2.2, attack_ms=12, release_ms=180), Gain(0)])
    y = board(out.T.astype(np.float32), SR).T.astype(np.float64)
    return y / max(np.abs(y).max(), 1e-9), secs


def sfx(n):
    out = np.zeros((n, 2))
    t = np.arange(int(0.12 * SR)) / SR
    click = (np.sin(2 * np.pi * (1800 - 6000 * t) * t) * np.exp(-t * 60))[:, None] * [0.9, 1.0]
    t2 = np.arange(int(0.5 * SR)) / SR
    thump = (np.sin(2 * np.pi * (70 - 30 * t2) * t2) * np.exp(-t2 * 9) + np.random.default_rng(1).normal(0, 0.15, len(t2)) * np.exp(-t2 * 30))[:, None] * [1.0, 1.0]
    for s in DATA["shots"]:
        if s["kind"] == "map":
            for p in s["pins"].values():
                at = s["start"] + p["a0"] + 0.05 + 0.32
                if at < s["end"]:
                    i0 = int(at * SR); out[i0:i0 + len(click)] += click[:max(0, n - i0)] * 0.12
        if s.get("big"):
            i0 = int((s["start"] + 0.45) * SR); out[i0:i0 + len(thump)] += thump[:max(0, n - i0)] * 0.22
    return out


def read(p):
    with wave.open(str(p)) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float64) / 32768
        if w.getnchannels() == 2:
            x = x.reshape(-1, 2).mean(1)
        sr = w.getframerate()
    if sr != SR:
        x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    return x


def main():
    bgm, secs = render()
    nar = read(NAR)
    n = int(DATA["total"] * SR)
    v = np.zeros(n); v[:min(n, len(nar))] = nar[:n]
    k = SR // 5
    c = np.concatenate([[0.0], np.cumsum(np.abs(v))])
    idx = np.arange(n)
    lo = np.clip(idx - k // 2, 0, n); hi = np.clip(idx - k // 2 + k, 0, n)
    env = (c[hi] - c[lo]) / k
    duck = 1 - 0.55 * np.clip(env / 0.04, 0, 1)
    fade = np.clip((DATA["total"] - idx / SR) / 2.5, 0, 1)
    y = v[:, None] * [1, 1] + bgm[:n] * (10 ** (-17 / 20)) * (duck * fade)[:, None] + sfx(n)
    y = y / max(1e-9, np.abs(y).max()) * 0.89
    out = HERE / "out" / KEY
    out.mkdir(parents=True, exist_ok=True)
    with wave.open(str(out / "mix.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y * 32767).astype("<i2").tobytes())
    (out / "cues.txt").write_text("\n".join(f"{a:8.2f} {b:8.2f} {k}" for a, b, k in secs))
    print("mix", out / "mix.wav", len(secs), "cues")


if __name__ == "__main__":
    main()
