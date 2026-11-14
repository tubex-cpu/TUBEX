"""BGM for ルール改変ニッポン — composed here as MIDI and played with FluidSynth + FluidR3_GM (MIT licence, Frank Wen).
Each section is its own short piece that starts exactly at a scene/beat moment; sections are crossfaded.
Usage (from make_audio_full.py): bgm.render(sections, dur, sr) -> np.ndarray (n, 2)
section = (start_s, end_s, kind)"""
import subprocess, tempfile, wave
from pathlib import Path
import mido
import numpy as np
from pedalboard import Pedalboard, Reverb, Compressor, HighpassFilter, LowShelfFilter, Gain

SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
TPB = 480
# GM programs (0-based) and drum notes
PIANO, EPIANO, MARIMBA, ORGAN, STRINGS, TREM, PIZZ, SLOWSTR, SYNTHPAD, BRASS, HIT, TIMP, SYNBASS, FINGBASS, CHOIR, CELESTA, HARP = 0, 4, 12, 19, 48, 44, 45, 49, 89, 61, 55, 47, 38, 33, 52, 8, 46
KICK, SNARE, RIM, CLAP, HH, OHH, CRASH, RIDE, SHAKER, TOM = 36, 38, 37, 39, 42, 46, 49, 51, 70, 45
N = {"C": 0, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "Gb": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}


def chord(root, kind="m", octave=4):
    r = 12 * (octave + 1) + N[root]
    iv = {"m": [0, 3, 7], "M": [0, 4, 7], "m7": [0, 3, 7, 10], "M7": [0, 4, 7, 11], "sus": [0, 5, 7], "add9": [0, 4, 7, 14], "m9": [0, 3, 7, 14]}[kind]
    return [r + i for i in iv]


class Song:
    def __init__(self, bpm):
        self.bpm = bpm
        self.ev = []  # (tick, msg)
        self.ch_prog = {}
        self.tr = 0  # transpose (semitones) applied to every channel but drums when saved

    def beat(self, b):
        return int(round(b * TPB))

    def prog(self, ch, program):
        self.ch_prog[ch] = program

    def note(self, ch, pitch, at, dur, vel=80):
        self.ev.append((self.beat(at), mido.Message("note_on", channel=ch, note=int(pitch), velocity=int(max(1, min(127, vel))))))
        self.ev.append((self.beat(at + dur) - 1, mido.Message("note_off", channel=ch, note=int(pitch), velocity=0)))

    def cc(self, ch, ctrl, val, at):
        self.ev.append((self.beat(at), mido.Message("control_change", channel=ch, control=ctrl, value=int(max(0, min(127, val))))))

    def ramp(self, ch, ctrl, a, b, at, dur, steps=24):
        for k in range(steps + 1):
            self.cc(ch, ctrl, a + (b - a) * k / steps, at + dur * k / steps)

    def save(self, path):
        mid = mido.MidiFile(ticks_per_beat=TPB)
        tr = mido.MidiTrack(); mid.tracks.append(tr)
        tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(self.bpm), time=0))
        for ch, p in self.ch_prog.items():
            tr.append(mido.Message("program_change", channel=ch, program=p, time=0))
            tr.append(mido.Message("control_change", channel=ch, control=91, value=40, time=0))  # reverb send
        last = 0
        for t, m in sorted(self.ev, key=lambda x: (x[0], x[1].type == "note_on")):
            if self.tr and m.type in ("note_on", "note_off") and m.channel != 9:
                m = m.copy(note=max(0, min(127, m.note + self.tr)))
            tr.append(m.copy(time=t - last)); last = t
        mid.save(path)


def play(song, seconds, sr):
    with tempfile.TemporaryDirectory() as td:
        m, w = Path(td) / "a.mid", Path(td) / "a.wav"
        song.save(m)
        subprocess.run(["fluidsynth", "-ni", "-q", "-g", "0.7", "-r", str(sr), "-o", "synth.reverb.active=1", "-o", "synth.chorus.active=0", "-F", str(w), SF2, str(m)], check=True, capture_output=True)
        with wave.open(str(w)) as f:
            x = np.frombuffer(f.readframes(f.getnframes()), "<i2").astype(np.float64).reshape(-1, 2) / 32768
    n = int(seconds * sr)
    out = np.zeros((n, 2)); out[:min(n, len(x))] = x[:n]
    return out


BPM = 96
BEATS = lambda s: s * BPM / 60


def intro(sec):
    """low strings + timpani roll rising into the seal impact (ends exactly at the impact)"""
    s = Song(BPM); s.prog(0, SLOWSTR); s.prog(1, TIMP); s.prog(2, CHOIR); s.prog(3, PIANO)
    b = BEATS(sec)
    for p in chord("D", "m", 2) + [50 + 12]:
        s.note(0, p, 0, b, 70)
    s.ramp(0, 11, 40, 120, 0, b)
    for p in chord("D", "m", 4):
        s.note(2, p, b * 0.35, b * 0.65, 50)
    s.ramp(2, 11, 20, 100, b * 0.35, b * 0.65)
    for k in range(int(b * 4)):  # 16th timpani roll, louder to the end
        s.note(1, 38, k / 4, 0.25, 25 + 90 * (k / (b * 4)) ** 2)
    for i, p in enumerate([74, 77, 81]):
        s.note(3, p, 0.5 + i * 1.5, 1.5, 55)
    return s, sec


def groove(sec, bright_at=None):
    """the main driving cue: impact hit, then piano 8ths + pizzicato + bass + kit. bright_at (s): switch to the major progression"""
    s = Song(BPM)
    s.prog(0, PIANO); s.prog(1, PIZZ); s.prog(2, FINGBASS); s.prog(3, STRINGS); s.prog(4, HIT); s.prog(5, TIMP); s.prog(6, CELESTA)
    bars = int(BEATS(sec) // 4) + 1
    dark = [("D", "m"), ("Bb", "M"), ("F", "M"), ("C", "M")]
    bright = [("F", "M"), ("C", "M"), ("D", "m"), ("Bb", "M")]
    bb = BEATS(bright_at) // 4 if bright_at else 999
    # impact
    for p in chord("D", "m", 3) + chord("D", "m", 4):
        s.note(4, p, 0, 1.5, 120)
    s.note(5, 38, 0, 2, 127); s.note(9, CRASH, 0, 3, 120); s.note(9, KICK, 0, 1, 127)
    for bar in range(bars):
        at = bar * 4
        prog = bright if bar >= bb else dark
        r, k = prog[bar % 4]
        c = chord(r, k, 4)
        intro_bar = bar == 0
        # piano: broken 8ths
        pat = [c[0], c[2], c[1] + 12, c[2], c[0] + 12, c[2], c[1] + 12, c[2]]
        for i, p in enumerate(pat):
            if intro_bar and i < 4:
                continue
            s.note(0, p, at + i / 2, 0.5, 62 + (8 if i % 4 == 0 else 0))
        # pizzicato answers on the off-beats
        if bar >= 1:
            for i in (1.5, 3.5):
                s.note(1, c[1] + 12, at + i, 0.5, 70)
        # bass
        root = 12 * 2 + N[r]
        for i, (o, d) in enumerate([(0, 1.5), (1.5, 0.5), (2, 1.5), (3.5, 0.5)]):
            s.note(2, root + (12 if i == 3 else 0), at + o, d, 92)
        # strings swell from the bright part
        if bar >= bb:
            for p in chord(r, k, 4):
                s.note(3, p, at, 4, 52)
            if bar >= bb:
                s.note(6, c[2] + 24, at, 1, 50)
        # kit (from bar 1)
        if bar >= 1:
            for i in range(8):
                s.note(9, HH, at + i / 2, 0.25, 50 if i % 2 else 70)
            s.note(9, KICK, at, 0.5, 105); s.note(9, KICK, at + 2, 0.5, 100); s.note(9, KICK, at + 2.75, 0.25, 70)
            s.note(9, CLAP, at + 1, 0.5, 80); s.note(9, CLAP, at + 3, 0.5, 85)
            if bar % 4 == 3:
                for i in range(4):
                    s.note(9, SNARE, at + 3 + i / 4, 0.25, 50 + i * 15)
    return s, sec


def question(sec):
    """drums out: tremolo strings + a low pulse, rising into the next scene"""
    s = Song(BPM); s.prog(0, TREM); s.prog(1, PIANO); s.prog(2, SYNTHPAD); s.prog(3, TIMP)
    b = BEATS(sec)
    for p in [46, 50, 53, 57, 62]:
        s.note(0, p, 0, b, 70)
    s.ramp(0, 11, 50, 115, 0, b)
    for p in chord("Bb", "M7", 3):
        s.note(2, p, 0, b, 55)
    for i, p in enumerate([74, 69, 74, 72]):
        s.note(1, p, i * 2, 2, 60)
    for k in range(int(b)):
        s.note(3, 38, k, 0.5, 45 + 4 * k)
    return s, sec


def cards(sec, hits=()):
    """the three prediction cards: light marimba + pizzicato groove, an accent on each card (hits = seconds from start)"""
    s = Song(BPM); s.prog(0, MARIMBA); s.prog(1, PIZZ); s.prog(2, FINGBASS); s.prog(3, CELESTA); s.prog(4, STRINGS)
    bars = int(BEATS(sec) // 4) + 1
    prog = [("F", "M"), ("A", "m"), ("Bb", "M"), ("C", "M")]
    for bar in range(bars):
        at = bar * 4
        r, k = prog[bar % 4]
        c = chord(r, k, 5)
        for i, p in enumerate([c[0], c[1], c[2], c[1], c[0] + 12, c[2], c[1], c[2]]):
            s.note(0, p, at + i / 2, 0.5, 58 + (10 if i % 4 == 0 else 0))
        s.note(1, c[0] - 12, at + 1, 0.5, 60); s.note(1, c[2] - 12, at + 3, 0.5, 60)
        root = 12 * 2 + N[r]
        s.note(2, root, at, 2, 80); s.note(2, root + 7, at + 2, 2, 72)
        for i in range(8):
            s.note(9, SHAKER, at + i / 2, 0.25, 45 if i % 2 else 60)
        s.note(9, KICK, at, 0.5, 80); s.note(9, RIM, at + 1, 0.25, 60); s.note(9, KICK, at + 2.5, 0.5, 70); s.note(9, RIM, at + 3, 0.25, 65)
    for h in hits:
        bt = BEATS(h)
        s.note(3, 84, bt, 1.5, 80); s.note(3, 91, bt + 0.02, 1.5, 70)
        for p in chord("F", "add9", 4):
            s.note(4, p, bt, 2, 55)
    return s, sec


def calm(sec):
    """the labels: clean piano over a soft pad, light rim pulse"""
    s = Song(BPM); s.prog(0, PIANO); s.prog(1, SYNTHPAD); s.prog(2, FINGBASS); s.prog(3, HARP)
    bars = int(BEATS(sec) // 4) + 1
    prog = [("Bb", "M7"), ("F", "M"), ("G", "m7"), ("C", "sus")]
    for bar in range(bars):
        at = bar * 4
        r, k = prog[bar % 4]
        c = chord(r, k, 4)
        for p in c:
            s.note(1, p, at, 4, 45)
        for i, p in enumerate([c[0] + 12, c[2], c[1] + 12, c[2] + 12]):
            s.note(0, p, at + i, 1, 55)
        s.note(2, 12 * 2 + N[r], at, 4, 70)
        s.note(9, RIM, at + 1, 0.25, 45); s.note(9, RIM, at + 3, 0.25, 50)
        for i in range(4):
            s.note(9, SHAKER, at + i + 0.5, 0.25, 35)
        if bar % 2 == 1:
            s.note(3, c[2] + 24, at + 3.5, 1, 50)
    return s, sec


KINDS = {"intro": intro, "groove": groove, "question": question, "cards": cards, "calm": calm}


def render(sections, dur, sr, xf=0.35):
    """sections: list of (start, end, kind, kwargs). Each piece starts exactly at start; a short crossfade at the joins."""
    n = int(dur * sr)
    out = np.zeros((n, 2))
    for i, (a, b, kind, kw) in enumerate(sections):
        tail = 2.5 if i + 1 < len(sections) else 0.0  # let the reverb ring under the next piece
        kw = dict(kw); trn = kw.pop("tr", 0)
        song, _ = KINDS[kind](b - a + tail, **kw)
        song.tr = trn
        x = play(song, b - a + tail, sr)
        tt = np.arange(len(x)) / sr
        env = np.ones(len(x))
        if i > 0:
            env *= np.clip(tt / 0.02, 0, 1)
        if tail:
            env *= np.clip(((b - a) + xf - tt) / (xf + tail * 0.4), 0, 1) ** 1.5
        i0 = int(a * sr)
        m = min(len(x), n - i0)
        out[i0:i0 + m] += x[:m] * env[:m, None]
    board = Pedalboard([HighpassFilter(45), LowShelfFilter(cutoff_frequency_hz=180, gain_db=1.5), Reverb(room_size=0.55, wet_level=0.16, dry_level=0.9, width=1.0), Compressor(threshold_db=-18, ratio=2.2, attack_ms=12, release_ms=180), Gain(0)])
    y = board(out.T.astype(np.float32), sr).T.astype(np.float64)
    return y / max(np.abs(y).max(), 1e-9) * 0.9
