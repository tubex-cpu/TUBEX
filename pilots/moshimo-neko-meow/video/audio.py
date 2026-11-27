"""音：猫の鳴き声（numpy で合成）、遠くの鳴き声の層、環境音、BGM（FluidSynth で作曲）、ミックス。
録音素材は使わない（権利の問題なし）。音源は FluidR3_GM（MIT）。
使い方: python audio.py <out_dir>
"""
import json, math, os, subprocess, sys, wave, glob
import numpy as np

OUT = sys.argv[1] if len(sys.argv) > 1 else '/home/user/work_neko/out'
SR = 48000
FPS = 24
VER = os.environ.get('NEKO_VER', 'v3')
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


def caw():
    """カラスのかすれた一声（倍音の多い低めの声＋ノイズ）"""
    d = rng.uniform(0.28, 0.42); t = np.arange(int(d * SR)) / SR
    f = rng.uniform(520, 640) * (1 - 0.18 * t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sign(np.sin(k * ph)) / k for k in (1, 2, 3)) * 0.5 + rng.standard_normal(len(t)) * 0.35
    x = np.convolve(x, np.ones(6) / 6, mode='same')
    env = np.minimum(1, t / 0.03) * np.exp(-2.2 * t / d)
    return (x * env).astype(np.float32)


def bark():
    """犬の短い一声"""
    d = rng.uniform(0.16, 0.22); t = np.arange(int(d * SR)) / SR
    f = rng.uniform(330, 420) * (1 + 0.5 * np.exp(-t / 0.03))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph) + rng.standard_normal(len(t)) * 0.4
    env = np.minimum(1, t / 0.008) * np.exp(-t / (d * 0.45))
    return (x * env * 0.8).astype(np.float32)


def insects(n):
    """草むらの虫（高い音の細かい震え）"""
    t = np.arange(n) / SR
    out = np.zeros(n, np.float32)
    for k in range(3):
        fc = 4200 + 500 * k; rate = 28 + 6 * k
        gate = (np.sin(2 * np.pi * rate * t + k) > 0.3).astype(np.float32)
        slow = (np.sin(2 * np.pi * (0.5 + 0.2 * k) * t + 2 * k) > -0.2).astype(np.float32)
        out += np.sin(2 * np.pi * fc * t).astype(np.float32) * gate * slow
    return out / 3


def purr(n):
    """猫ののどのゴロゴロ（低いうなりを 25 回/秒ほどで震わせ、息に合わせて強弱）。別企画が meta に 'purr' を入れたときだけ使う"""
    t = np.arange(n) / SR
    w = rng.standard_normal(n).astype(np.float32)
    w = np.convolve(w, np.ones(160) / 160, mode='same') * 6.0
    am = (0.5 + 0.5 * np.sin(2 * np.pi * 24.0 * t)) ** 2
    br = 0.55 + 0.45 * np.sin(2 * np.pi * 0.42 * t)
    return (w * am * br).astype(np.float32)


def _project_telops():
    if not os.environ.get('NEKO_TELOPS'):
        return None
    import importlib
    sys.path.insert(0, os.environ['NEKO_PROJECT_DIR'])
    return importlib.import_module(os.environ['NEKO_TELOPS'])


def heartbeats(n, bpm1=72.0, bpm2=63.0):
    """二つの心臓の鼓動（ドクン・トクン）を少しずらして重ねる。左右に分けて返す"""
    t = np.arange(n) / SR
    def beat(bpm, f0):
        out = np.zeros(n, np.float32); period = 60.0 / bpm
        k = np.arange(int(0.18 * SR)) / SR
        lub = (np.sin(2 * np.pi * f0 * k) * np.exp(-k / 0.045)).astype(np.float32)
        dub = (np.sin(2 * np.pi * (f0 * 1.25) * k) * np.exp(-k / 0.035) * 0.7).astype(np.float32)
        x = 0.0
        while x < n / SR:
            for off, w in ((0.0, lub), (0.28, dub)):
                a = int((x + off) * SR); e = min(n, a + len(w))
                if a < n:
                    out[a:e] += w[:e - a]
            x += period
        return out
    return beat(bpm1, 55.0), beat(bpm2, 48.0)


def _lp(x, k):
    return np.convolve(x, np.ones(k, np.float32) / k, mode='same').astype(np.float32)


def quake_rumble(n):
    """地鳴り：低くこもったノイズと、30〜40Hz のうなり（強弱がゆっくり変わる）"""
    t = np.arange(n) / SR
    w = _lp(_lp(rng.standard_normal(n).astype(np.float32), 300), 300) * 9.0
    hum = np.sin(2 * np.pi * 34 * t) * 0.35 + np.sin(2 * np.pi * 47 * t + 1) * 0.2
    env = (0.65 + 0.35 * np.sin(2 * np.pi * 0.7 * t) * np.sin(2 * np.pi * 0.23 * t + 2)).astype(np.float32)
    fade = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.4 * SR)).astype(np.float32)
    return ((w + hum.astype(np.float32)) * env * fade * 0.5).astype(np.float32)


def water_roar(n):
    """水の轟音：中低域のノイズを波のようにうねらせる"""
    t = np.arange(n) / SR
    w = rng.standard_normal(n).astype(np.float32)
    b = (_lp(w, 25) - _lp(w, 180)) * 2.5 + _lp(w, 120) * 1.5
    env = (0.7 + 0.3 * np.sin(2 * np.pi * 0.31 * t) * np.sin(2 * np.pi * 0.11 * t + 1)).astype(np.float32)
    fade = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.6 * SR)).astype(np.float32)
    return (b * env * fade * 0.35).astype(np.float32)


def crash_hit():
    """物が崩れ落ちる音（短い低いノイズの塊）"""
    d = 1.2; n = int(d * SR); t = np.arange(n) / SR
    w = _lp(rng.standard_normal(n).astype(np.float32), 40) * 3.0
    env = np.exp(-t / 0.35) * np.minimum(1, t / 0.01)
    return (w * env * 0.6).astype(np.float32)


def alert_tone():
    """スマホの警報（架空の音）：二つの高さを交互に短く鳴らす"""
    d = 2.4; n = int(d * SR); t = np.arange(n) / SR
    f = np.where((t * 4).astype(int) % 2 == 0, 880.0, 1175.0)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.25 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5
    gate = ((t * 8).astype(int) % 2 == 0).astype(np.float32)
    env = np.minimum(1, (d - t) / 0.2)
    return (x * gate * env * 0.22).astype(np.float32)


def pa_chime(n):
    """防災無線・構内放送（遠くの音）：四秒ごとの低いチャイムを残響で遠くに"""
    out = np.zeros(n, np.float32)
    k = np.arange(int(1.6 * SR)) / SR
    tone = lambda f: (np.sin(2 * np.pi * f * k) * np.exp(-k / 0.5)).astype(np.float32)
    seq = [(0.0, 659.0), (0.5, 523.0), (1.0, 587.0), (1.5, 392.0)]
    p = 0.3
    while p < n / SR:
        for off, f in seq:
            a = int((p + off) * SR); e = min(n, a + len(k))
            if a < n:
                out[a:e] += tone(f)[:e - a]
        p += 6.0
    out = reverb(_lp(out, 6), 0.6, 0.12)
    return out * 0.08


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
    metas = sorted(glob.glob(f'{OUT}/meta/*.json'))  # 第4稿までは s* だけを読んでいた（x・r のカットの鳴き声が入っていなかった）
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
        # 改稿で足した生き物の音（合成）：カラス・犬・虫
        for key, fn, gain in (('crows', caw, 0.30), ('barks', bark, 0.32)):
            for f, g in m.get(key, []):
                pos = s0 + int((f - 1) / FPS * SR)
                if pos >= N:
                    continue
                v = reverb(fn(), 0.2, 0.05) * gain * g
                pan = rng.uniform(-0.5, 0.5); e = min(N, pos + len(v)); v = v[:e - pos]
                L[pos:e] += v * (1 - pan) * 0.7; Rr[pos:e] += v * (1 + pan) * 0.7
        hb = m.get('beats', 0)  # 心臓が2つ：二つの鼓動
        if hb > 0:
            b1, b2 = heartbeats(n)
            L[s0:s1] += b1 * 0.35 * hb; Rr[s0:s1] += b2 * 0.35 * hb
        pr = m.get('purr', 0)  # 猫ののどの音（無い企画では何もしない）
        if pr > 0:
            b = purr(n) * 0.5 * pr
            fade = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.4 * SR)).astype(np.float32)
            L[s0:s1] += b * fade; Rr[s0:s1] += b * fade
        ins = m.get('insects', 0)
        if ins > 0:
            b = insects(n) * 0.05 * ins
            L[s0:s1] += b; Rr[s0:s1] += np.roll(b, 331)
        # 地震・津波の音（別企画が meta に入れたときだけ。南海トラフの動画）
        for key, fn in (('rumble', quake_rumble), ('roar', water_roar)):
            for f0, f1, g in m.get(key, []):
                a = s0 + int((f0 - 1) / FPS * SR); b = min(s1, s0 + int((f1 - 1) / FPS * SR))
                if b - a > SR // 10:
                    x = fn(b - a) * g
                    L[a:b] += x; Rr[a:b] += np.roll(x, 211)
        for f, g in m.get('crash', []):
            pos = s0 + int((f - 1) / FPS * SR); v = crash_hit() * g
            e = min(N, pos + len(v)); L[pos:e] += v[:e - pos]; Rr[pos:e] += v[:e - pos] * 0.9
        for f in m.get('alert', []):
            pos = s0 + int((f - 1) / FPS * SR); v = alert_tone()
            e = min(N, pos + len(v)); L[pos:e] += v[:e - pos]; Rr[pos:e] += v[:e - pos]
        for f0, f1 in m.get('speaker', []):
            a = s0 + int((f0 - 1) / FPS * SR); b = min(s1, s0 + int((f1 - 1) / FPS * SR))
            if b - a > SR // 2:
                x = pa_chime(b - a)
                L[a:b] += x; Rr[a:b] += np.roll(x, 1500)
        # 環境音
        amb = m.get('amb', 'day'); g = AMB_GAIN.get(amb, 0.03)
        if g > 0:
            b = noise_bed(n, amb) * g
            fade = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.3 * SR)).astype(np.float32)
            L[s0:s1] += b * fade; Rr[s0:s1] += np.roll(b, 997) * fade
    st = np.stack([L, Rr], 1)
    write(f'{OUT}/sfx.wav', st.reshape(-1) * 0.9, ch=2)
    print('sfx ok', np.abs(st).max())


def stop_time(tl):
    """一斉に鳴きやむ時刻：silent_from を持つカットのメタから"""
    import glob
    for p in glob.glob(f'{OUT}/meta/*.json'):
        m = json.load(open(p))
        if m.get('silent_from'):
            return m['start'] + m['silent_from'] / FPS
    if VER == 'v5' or os.environ.get('NEKO_TELOPS'):
        return None  # 改稿・別企画は鳴きやむ場面がない
    raise SystemExit('silent_from のカットがない')


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
            6: ('night', 'A'), 7: ('light', 'C'), 8: ('tense', 'F'), 9: ('warm', 'D'), 10: ('sad', 'G'), 11: ('wide', 'C'),
            12: ('sad', 'E'), 13: ('silence', 'D'), 14: ('warm', 'D')}
    if VER == 'v5':
        # 改稿：鳴きやまない。ピアノは SCENE 19（章18）で初めて入る（台本の【音・間】）
        MOOD = {0: ('myst', 'D'), 1: ('light', 'G'), 2: ('wide', 'D'), 3: ('tense', 'E'), 4: ('light', 'G'), 5: ('wide', 'C'),
                6: ('night', 'A'), 7: ('night', 'A'), 8: ('tense', 'F'), 9: ('light', 'C'), 10: ('light', 'G'), 11: ('tense', 'E'),
                12: ('sad', 'G'), 13: ('wide', 'C'), 14: ('night', 'A'), 15: ('tense', 'F'), 16: ('wide', 'D'), 17: ('sad', 'E'),
                18: ('warm', 'D'), 19: ('warm', 'G'), 20: ('warm', 'D'), 21: ('warm', 'D')}
    PIANO_FROM = 18 if VER == 'v5' else 0
    PT = _project_telops()
    if PT is not None and hasattr(PT, 'MOOD'):  # 別企画：章ごとの雰囲気とピアノの入り
        MOOD = PT.MOOD; PIANO_FROM = getattr(PT, 'PIANO_FROM', 0)
    # 区間ごとに楽器・弾き方を変える（別企画の SECTIONS。社長 2026-11-25「動画全体をおおよそ３分割してBGMをそれぞれ変更して」）
    SECTIONS = getattr(PT, 'SECTIONS', None) if PT is not None else None
    def section(no):
        if not SECTIONS:
            return None
        cur = SECTIONS[0]
        for sc in SECTIONS:
            if no >= sc['from']:
                cur = sc
        return cur
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
    t_stop = stop_time(tl)
    cur_sec = None
    for c in tl['chapters']:
        mood, key = MOOD[c['no']]; root = ROOT[key]
        t = c['start']; end = c['end']
        bar = 4 * spb * (1.5 if mood in ('night', 'sad', 'silence') else 1.0)
        sc = section(c['no'])
        if sc is not None:
            bar *= sc.get('bar', 1.0)
            if sc is not cur_sec:
                cur_sec = sc
                for name, pg in sc['programs'].items():
                    tracks[name][2].append((sec2tick(t), -1, pg, 0))
        i = 0
        while t < end - 0.5:
            deg, q = PROG[mood][i % 4]
            chord = [root + deg, root + deg + (3 if q == 'm' else 4), root + deg + 7]
            d = min(bar, end - t)
            if mood == 'silence' and t_stop is not None and t < t_stop + 9:
                t += d; i += 1; continue
            for p in chord:
                note('pad', t, d, p + 12, 34 if mood != 'tense' else 40)
            note('bass', t, d, root + deg - 12, 40)
            # ピアノの分散和音
            step = bar / 8
            arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 24, chord[2] + 12, chord[1] + 12, chord[0] + 24, chord[2] + 12]
            if sc is not None and sc.get('arp'):
                arp = [chord[j % 3] + 12 * (1 + j // 3) for j in sc['arp']]
                step = bar / len(arp)
            piano_ok = c['no'] >= PIANO_FROM
            if piano_ok and mood in ('light', 'warm', 'wide', 'myst', 'sad', 'night', 'tense'):
                pv = sc.get('piano_vel', (38, 52)) if sc is not None else (38, 52)
                for k in range(len(arp)):
                    if mood in ('night', 'sad') and k % 2:
                        continue
                    note('piano', t + k * step, step * 1.6, arp[k], int(r.integers(*pv)))
            if sc is not None and sc.get('bell'):
                # 区間ごとの短い旋律（和音の音を上がって下りる）
                mel = [chord[2] + 24, chord[1] + 24, chord[0] + 24, chord[1] + 24] if i % 2 else [chord[0] + 24, chord[1] + 24, chord[2] + 24, chord[0] + 36]
                for k, pch in enumerate(mel):
                    note('cel', t + k * bar / 4, bar / 4 * 0.9, pch, sc['bell'])
            elif mood in ('light', 'wide') and i % 2 == 0:
                note('cel', t + bar * 0.75, step * 2, chord[2] + 24, 36)
            t += d; i += 1
    for name, (tr, ch, ev) in tracks.items():
        ev.sort(key=lambda e: (e[0], e[1]))
        last = 0
        for tick, on, p, v in ev:
            if on == -1:
                tr.append(mido.Message('program_change', program=int(p), channel=ch, time=tick - last))
            else:
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
    def movavg(x, k):
        c = np.cumsum(np.concatenate([np.zeros(k // 2 + 1), x, np.zeros(k // 2)]).astype(np.float64))
        return ((c[k:] - c[:-k]) / k)[:len(x)].astype(np.float32)
    k = int(0.25 * SR)
    env = movavg(np.abs(nar), k)
    duck = 1 - 0.55 * np.clip(env / 0.05, 0, 1)
    duck = movavg(duck, k)
    bg = b * 0.8 * duck[:, None]
    sduck = (1 - 0.4 * np.clip(env / 0.05, 0, 1))[:, None]
    # 鳴きやむ瞬間（30日後の午後3時）以降しばらくは BGM も切る
    t_stop = stop_time(tl)
    if t_stop is not None:
        a, z = int(t_stop * SR), int((t_stop + 9.0) * SR)
        g = np.ones(N, np.float32); g[a:z] = 0
        fade = int(3 * SR); g[z:z + fade] = np.linspace(0, 1, fade)[:max(0, min(fade, N - z))]
        bg *= g[:, None]
    out = nar[:, None] * 1.0 + sfx_ * 0.36 * sduck + bg
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
