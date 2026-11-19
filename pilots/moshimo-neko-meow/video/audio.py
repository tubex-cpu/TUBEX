"""音：猫の鳴き声（numpy で合成）、遠くの鳴き声の層、環境音、BGM（FluidSynth で作曲）、ミックス。
録音素材は使わない（権利の問題なし）。音源は FluidR3_GM（MIT）。
使い方: python audio.py <out_dir>
"""
import json, math, os, subprocess, sys, wave, glob
import numpy as np

OUT = sys.argv[1] if len(sys.argv) > 1 else '/home/user/work_neko/out'
SR = 48000
FPS = 24
rng = np.random.default_rng(7)


def meow(pitch=1.0, dur=None, seed=None):
    """ニャー：基本周波数が上がって下がる倍音列に、イ→ア→ウのフォルマントを時間変化でかける"""
    r = np.random.default_rng(seed)
    dur = dur or r.uniform(0.55, 0.95)
    n = int(dur * SR); t = np.arange(n) / SR; u = t / dur
    f0 = pitch * (420 + 380 * np.sin(np.pi * np.clip(u * 1.15, 0, 1)) ** 1.3 - 120 * u)
    f0 *= 1 + 0.012 * np.sin(2 * np.pi * 6.0 * t)
    ph = 2 * np.pi * np.cumsum(f0) / SR
    # フォルマント（倍音ごとの重み）
    F1 = np.interp(u, [0, 0.25, 0.6, 1], [450, 900, 850, 500]) * (0.95 + 0.1 * pitch)
    F2 = np.interp(u, [0, 0.25, 0.6, 1], [2300, 1500, 1200, 900]) * (0.95 + 0.1 * pitch)
    sig = np.zeros(n, np.float64)
    for k in range(1, 18):
        fk = f0 * k
        g = np.exp(-((fk - F1) / 260) ** 2) + 0.6 * np.exp(-((fk - F2) / 420) ** 2) + 0.05 / k
        g[fk > 16000] = 0
        sig += g * np.sin(k * ph + r.uniform(0, 6.28))
    sig += 0.02 * r.standard_normal(n)  # 息
    env = np.interp(u, [0, 0.06, 0.2, 0.75, 1], [0, 0.8, 1, 0.75, 0]) ** 1.2
    sig *= env
    sig /= np.abs(sig).max() + 1e-9
    return sig.astype(np.float32)


def reverb(x, amt=0.25, room=0.06):
    """簡易リバーブ（遅延の和）"""
    y = x.copy()
    for d, g in [(room * 0.37, 0.5), (room * 0.61, 0.4), (room, 0.32), (room * 1.7, 0.22), (room * 2.9, 0.12)]:
        k = int(d * SR)
        y[k:] += x[:-k] * g * amt / 0.5
    return y


def write(path, x, ch=1):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as f:
        f.setnchannels(ch); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((x * 32767).astype('<i2').tobytes())


def read(path):
    with wave.open(path) as f:
        a = np.frombuffer(f.readframes(f.getnframes()), '<i2').astype(np.float32) / 32768
        if f.getnchannels() == 2:
            a = a.reshape(-1, 2)
    return a


def bank(nv=24):
    """鳴き声の素材を前もって作る（高さ違い）"""
    out = []
    for i in range(nv):
        p = 0.8 + 0.5 * i / (nv - 1)
        out.append(meow(pitch=p, seed=100 + i))
    return out


def far(x):
    """遠くの鳴き声：高音を落として残響を足す"""
    y = np.convolve(x, np.ones(9) / 9, mode='same')
    return reverb(y, 0.5, 0.09)


def noise_bed(n, kind):
    w = rng.standard_normal(n).astype(np.float32)
    if kind in ('city', 'day', 'morning'):
        b = np.convolve(w, np.ones(60) / 60, mode='same') * 0.6
    elif kind in ('night', 'dawn', 'space', 'silent'):
        b = np.convolve(w, np.ones(200) / 200, mode='same') * 0.5
    elif kind in ('sea', 'wind'):
        env = 0.6 + 0.4 * np.sin(np.arange(n) / SR * 2 * np.pi * 0.12)
        b = np.convolve(w, np.ones(40) / 40, mode='same') * env.astype(np.float32)
    else:  # room, garden
        b = np.convolve(w, np.ones(120) / 120, mode='same') * 0.3
    return b.astype(np.float32)


AMB_GAIN = {'day': 0.05, 'city': 0.08, 'night': 0.03, 'dawn': 0.03, 'room': 0.02, 'space': 0.0, 'silent': 0.012,
            'garden': 0.03, 'sea': 0.09, 'wind': 0.07, 'morning': 0.04}


def sfx():
    tl = json.load(open(f'{OUT}/timeline.json'))
    N = int(tl['duration'] * SR) + SR
    L = np.zeros(N, np.float32); Rr = np.zeros(N, np.float32)
    B = bank()
    metas = sorted(glob.glob(f'{OUT}/meta/s*.json'))
    for mp in metas:
        m = json.load(open(mp))
        s0 = int(m['start'] * SR); s1 = int(m['end'] * SR)
        n = s1 - s0
        su = m.get('silent_until'); sf = m.get('silent_from')
        def ok(sample):
            if su is not None and sample < s0 + int(su / FPS * SR):
                return False
            if sf is not None and sample >= s0 + int(sf / FPS * SR):
                return False
            return True
        # 近くの猫（画面の猫）
        for f, g, p in m['meows']:
            pos = s0 + int((f - 1) / FPS * SR) + int(0.04 * SR)
            if not ok(pos):
                continue
            v = B[int(np.clip((p - 0.8) / 0.5 * (len(B) - 1), 0, len(B) - 1))]
            v = reverb(v, 0.18, 0.05) * 0.42 * g
            pan = rng.uniform(-0.4, 0.4)
            e = min(N, pos + len(v)); v = v[:e - pos]
            L[pos:e] += v * (1 - pan) * 0.7; Rr[pos:e] += v * (1 + pan) * 0.7
        # 遠くの鳴き声の層
        bed = m.get('bed', 0)
        if bed > 0:
            rate = 6.0 * bed  # 1秒あたり
            k = int(n / SR * rate)
            for _ in range(k):
                pos = s0 + int(rng.uniform(0, n))
                if not ok(pos):
                    continue
                v = far(B[rng.integers(len(B))]) * rng.uniform(0.04, 0.12) * bed
                e = min(N, pos + len(v)); v = v[:e - pos]
                pan = rng.uniform(-0.9, 0.9)
                L[pos:e] += v * (1 - pan) * 0.7; Rr[pos:e] += v * (1 + pan) * 0.7
        # 環境音
        amb = m.get('amb', 'day'); g = AMB_GAIN.get(amb, 0.03)
        if g > 0:
            b = noise_bed(n, amb) * g
            fade = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.3 * SR)).astype(np.float32)
            L[s0:s1] += b * fade; Rr[s0:s1] += np.roll(b, 997) * fade
    st = np.stack([L, Rr], 1)
    write(f'{OUT}/sfx.wav', st.reshape(-1) * 0.9, ch=2)
    print('sfx ok', np.abs(st).max())


# ---------------- BGM ----------------
def bgm():
    import mido
    tl = json.load(open(f'{OUT}/timeline.json'))
    mid = mido.MidiFile(ticks_per_beat=480)
    tempo = 72; spb = 60 / tempo
    def sec2tick(s):
        return int(s / spb * 480)
    # 章ごとの雰囲気
    MOOD = {0: ('myst', 'D'), 1: ('wide', 'D'), 2: ('light', 'G'), 3: ('tense', 'E'), 4: ('light', 'G'), 5: ('night', 'A'),
            6: ('night', 'A'), 7: ('light', 'C'), 8: ('warm', 'F'), 9: ('night', 'D'), 10: ('wide', 'G'), 11: ('light', 'C'),
            12: ('tense', 'E'), 13: ('sad', 'A'), 14: ('silence', 'D'), 15: ('warm', 'D')}
    ROOT = {'C': 48, 'D': 50, 'E': 52, 'F': 53, 'G': 55, 'A': 57}
    PROG = {'myst': [(0, 'm'), (8, 'M'), (5, 'M'), (10, 'M')], 'wide': [(0, 'M'), (7, 'M'), (9, 'm'), (5, 'M')],
            'light': [(0, 'M'), (5, 'M'), (7, 'M'), (0, 'M')], 'tense': [(0, 'm'), (5, 'm'), (8, 'M'), (7, 'M')],
            'night': [(0, 'm'), (8, 'M'), (3, 'M'), (10, 'M')], 'warm': [(0, 'M'), (9, 'm'), (5, 'M'), (7, 'M')],
            'sad': [(0, 'm'), (8, 'M'), (5, 'm'), (7, 'm')], 'silence': [(0, 'M'), (5, 'M'), (0, 'M'), (5, 'M')]}
    tracks = {}
    for name, prog, ch in [('pad', 89, 0), ('piano', 0, 1), ('cel', 8, 2), ('bass', 32, 3)]:
        tr = mido.MidiTrack(); mid.tracks.append(tr)
        tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(tempo), time=0))
        tr.append(mido.Message('program_change', program=prog, channel=ch, time=0))
        tracks[name] = (tr, ch, [])
    def note(name, start, dur, pitch, vel):
        tracks[name][2].append((sec2tick(start), 1, pitch, vel)); tracks[name][2].append((sec2tick(start + dur), 0, pitch, 0))
    r = np.random.default_rng(3)
    for c in tl['chapters']:
        mood, key = MOOD[c['no']]; root = ROOT[key]
        t = c['start']; end = c['end']
        bar = 4 * spb * (1.5 if mood in ('night', 'sad', 'silence') else 1.0)
        i = 0
        while t < end - 0.5:
            deg, q = PROG[mood][i % 4]
            chord = [root + deg, root + deg + (3 if q == 'm' else 4), root + deg + 7]
            d = min(bar, end - t)
            if mood == 'silence' and c['no'] == 14 and t < c['start'] + 12:
                t += d; i += 1; continue
            for p in chord:
                note('pad', t, d, p + 12, 34 if mood != 'tense' else 40)
            note('bass', t, d, root + deg - 12, 40)
            # ピアノの分散和音
            step = bar / 8
            arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 24, chord[2] + 12, chord[1] + 12, chord[0] + 24, chord[2] + 12]
            if mood in ('light', 'warm', 'wide', 'myst', 'sad', 'night', 'tense'):
                for k in range(8):
                    if mood in ('night', 'sad') and k % 2:
                        continue
                    note('piano', t + k * step, step * 1.6, arp[k], int(r.integers(38, 52)))
            if mood in ('light', 'wide') and i % 2 == 0:
                note('cel', t + bar * 0.75, step * 2, chord[2] + 24, 36)
            t += d; i += 1
    for name, (tr, ch, ev) in tracks.items():
        ev.sort(key=lambda e: (e[0], e[1]))
        last = 0
        for tick, on, p, v in ev:
            tr.append(mido.Message('note_on' if on else 'note_off', note=int(p), velocity=int(v), channel=ch, time=tick - last))
            last = tick
    mid.save(f'{OUT}/bgm.mid')
    subprocess.run(['fluidsynth', '-ni', '-g', '0.6', '-r', str(SR), '-F', f'{OUT}/bgm_raw.wav', '/usr/share/sounds/sf2/FluidR3_GM.sf2', f'{OUT}/bgm.mid'],
                   check=True, capture_output=True)
    print('bgm ok')


def mix():
    tl = json.load(open(f'{OUT}/timeline.json'))
    N = int(tl['duration'] * SR)
    nar = read(f'{OUT}/narration.wav')[:N]
    sfx_ = read(f'{OUT}/sfx.wav')[:N]
    b = read(f'{OUT}/bgm_raw.wav')
    if b.ndim == 1:
        b = np.stack([b, b], 1)
    b = b[:N]
    def fit(x):
        if len(x) < N:
            pad = np.zeros((N - len(x),) + x.shape[1:], np.float32); x = np.concatenate([x, pad])
        return x
    nar = fit(nar); sfx_ = fit(sfx_); b = fit(b)
    # ナレーション中は BGM を下げる
    env = np.abs(nar)
    k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, mode='same')
    duck = 1 - 0.55 * np.clip(env / 0.05, 0, 1)
    duck = np.convolve(duck, np.ones(k) / k, mode='same')
    bg = b * 0.55 * duck[:, None]
    # 鳴きやむ瞬間（14章 30日後の午後3時）以降しばらくは BGM も切る
    ch14 = [c for c in tl['chapters'] if c['no'] == 14][0]
    m14 = json.load(open(f'{OUT}/meta/s14a.json'))
    t_stop = m14['start'] + m14['silent_from'] / FPS
    a, z = int(t_stop * SR), int((t_stop + 9.0) * SR)
    g = np.ones(N, np.float32); g[a:z] = 0
    fade = int(3 * SR); g[z:z + fade] = np.linspace(0, 1, fade)[:max(0, min(fade, N - z))]
    bg *= g[:, None]
    out = nar[:, None] * 1.0 + sfx_ * 0.9 + bg
    write(f'{OUT}/mix_raw.wav', out.reshape(-1), ch=2)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}/mix_raw.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), f'{OUT}/mix.wav'], check=True)
    print('mix ok')


if __name__ == '__main__':
    what = sys.argv[2] if len(sys.argv) > 2 else 'all'
    if what in ('sfx', 'all'):
        sfx()
    if what in ('bgm', 'all'):
        bgm()
    if what in ('mix', 'all'):
        mix()
