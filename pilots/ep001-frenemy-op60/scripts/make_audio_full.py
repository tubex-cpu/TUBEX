"""Full-length narration + SFX + BGM for ep001 (VOICEVOX ナースロボ＿タイプＴ).

Usage: python3 scripts/make_audio_full.py [--measure]
- One TTS call per subtitle line (chunk) -> subtitles show one line at a time, exactly while it is spoken.
- 「正体」: VOICEVOX makes the last mora イ short and falling (heard as「しょうた」); it is lengthened/held here.
- Writes data/timeline_full.json and public/audio/full.wav. TTS chunks are cached in public/audio/cache/.
"""
import hashlib, importlib.util, json, os, re, sys, urllib.parse, urllib.request, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("ma", ROOT / "scripts/make_audio.py")
ma = importlib.util.module_from_spec(spec); spec.loader.exec_module(ma)
sys.path.insert(0, str(ROOT / "data"))
from script_full import P1, P2, REST  # noqa: E402

SR = ma.SR
VV = "http://127.0.0.1:50021"
SPK = 47
RATE = 1.12
CACHE = ROOT / "tts_cache"; CACHE.mkdir(parents=True, exist_ok=True)
READ = [("妬み", "ねたみ"), ("妬んで", "ねたんで"), ("腹側線条体", "ふくそくせんじょうたい"), ("線条体", "せんじょうたい"),
        ("蜜", "みつ"), ("102人", "ひゃくににん"), ("107人", "ひゃくななにん"), ("136人", "ひゃくさんじゅうろくにん"),
        ("3日間", "みっかかん"), ("0から10", "ゼロからじゅう"), ("1年", "いちねん"), ("ステップ1", "ステップワン"),
        ("ステップ2", "ステップツー"), ("ステップ3", "ステップスリー"), ("MRI", "エムアールアイ"), ("何十億円", "なんじゅうおくえん"),
        ("下げる", "さげる"), ("出来の評価", "できのひょうか"), ("自己評価維持モデル", "じこひょうかいじモデル")]


def tts_text(s):
    s = s.replace("「", "").replace("」", "").replace("｜", "")
    for a, b in READ:
        s = s.replace(a, b)
    return s


def fix_shoutai(q):
    for ap in q["accent_phrases"]:
        m = ap["moras"]
        for i in range(len(m) - 3):
            if [x["text"] for x in m[i:i + 4]] == ["ショ", "オ", "タ", "イ"]:
                ta, i_ = m[i + 2], m[i + 3]
                i_["vowel_length"] = max(i_["vowel_length"] * 1.7, 0.14)
                if i_["pitch"] > 0 and ta["pitch"] > 0:
                    i_["pitch"] = max(i_["pitch"], ta["pitch"] - 0.04)
    return q


def synth(text):
    t = tts_text(text)
    key = hashlib.sha1(f"{SPK}|{RATE}|v3|{t}".encode()).hexdigest()[:16]
    f = CACHE / f"{key}.wav"
    kf = CACHE / f"{key}.kana"
    if not f.exists():
        q = json.loads(urllib.request.urlopen(urllib.request.Request(f"{VV}/audio_query?speaker={SPK}&text={urllib.parse.quote(t)}", method="POST")).read())
        q = fix_shoutai(q)
        q.update({"speedScale": RATE, "prePhonemeLength": 0.0, "postPhonemeLength": 0.05, "outputSamplingRate": SR, "outputStereo": False, "intonationScale": 1.1})
        w = urllib.request.urlopen(urllib.request.Request(f"{VV}/synthesis?speaker={SPK}", data=json.dumps(q).encode(), headers={"Content-Type": "application/json"}, method="POST")).read()
        raw = CACHE / f"{key}.raw.wav"; raw.write_bytes(w)
        af = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,highpass=f=70,acompressor=threshold=-20dB:ratio=2:attack=8:release=120"
        ma.subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", af, "-ar", str(SR), "-ac", "1", str(f)], check=True)
        raw.unlink()
        kf.write_text(q["kana"])
    x = ma.read_wav(f)
    # even out loudness between lines: scale so the RMS of the voiced part hits a fixed target
    fr = 1024
    n = len(x) // fr
    if n > 0:
        r = np.sqrt((x[: n * fr].reshape(n, fr) ** 2).mean(1))
        act = r[r > r.max() * 0.15]
        rms = float(np.sqrt((act ** 2).mean())) if len(act) else float(r.mean())
        g = min(4.0, 0.12 / max(rms, 1e-6))
        x = x * g
        pk = np.abs(x).max()
        if pk > 0.95:
            x = np.tanh(x / pk * 1.2) / np.tanh(1.2) * 0.95
    return x, kf.read_text()


INSERT_AT = 18.3  # the new line (L4b) goes here; everything anchored after it moves by SHIFT
SHIFT = 0.0


def ensure_dict():
    words = json.loads(urllib.request.urlopen(f"{VV}/user_dict").read())
    if not any(w.get("surface") in ("背側前帯状皮質", "背側前帯状皮質") for w in words.values()):
        q = f"surface={urllib.parse.quote('背側前帯状皮質')}&pronunciation={urllib.parse.quote('ハイソクゼンタイジョウヒシツ')}&accent_type=7&word_type=PROPER_NOUN"
        urllib.request.urlopen(urllib.request.Request(f"{VV}/user_dict_word?{q}", method="POST")).read()


RED = ["フレネミー", "痛み", "妬み", "でもさ", "でも」", "比較", "不幸", "敵", "削られ続け", "水を差", "すり替え", "トゲ", "ヤバい", "恐ろしい", "半分", "身構え", "テロメアが", "短い"]
YEL = ["正体", "反映", "本当の味方", "いい知らせテスト", "報酬", "自己評価維持モデル", "背側前帯状皮質", "腹側線条体", "同じ道", "近さ", "近い", "思考実験", "ほっとする", "ごほうび", "蜜", "どんな仕事するの", "どうなったの", "積極的で、建設的", "積極的で建設的", "親密さ", "分野"]


def segments(sub):
    # mark at most 3 words per line: red = danger / pain, yellow = key idea
    hits = []
    for words, c in ((RED, "r"), (YEL, "y")):
        for w in words:
            i = sub.find(w)
            while i >= 0:
                if not any(a < i + len(w) and i < b for a, b, _ in hits):
                    hits.append((i, i + len(w), c))
                i = sub.find(w, i + len(w))
    hits = sorted(hits)[:3]
    out, pos = [], 0
    for a, b, c in hits:
        if a > pos:
            out.append({"t": sub[pos:a], "c": "w"})
        out.append({"t": sub[a:b], "c": c})
        pos = b
    if pos < len(sub):
        out.append({"t": sub[pos:], "c": "w"})
    return out


CHAPTER_STARTS = {"c2_mri": "第2章", "c3_step4": "第3章", "c4_icons": "第4章", "c5_chat": "第5章", "c6_axes": "第6章", "c6b_year": "第6章", "c7_title": "第7章", "c8_phone": "第8章", "c9_cards": "第9章"}


def build():
    ensure_dict()
    lines = []
    t = 0.0
    global SHIFT
    for part in (P1, P2, REST):
        for lid, text, ex in part:
            chunks = [c for c in text.split("｜") if c]
            at = ex.get("at")
            if at is not None and at >= INSERT_AT:
                at += SHIFT
            start = at if at is not None else t + ex.get("pre", 0.0)
            if at is not None and start < t - 0.01:
                print(f"!! {lid}: anchor {start:.2f} < previous end {t:.2f}")
                start = t
            cs = []
            c0 = start
            for c in chunks:
                x, kana = synth(c)
                d = len(x) / SR
                cs.append({"sub": c, "seg": segments(c), "start": round(c0, 3), "end": round(c0 + d, 3), "kana": kana, "_x": x})
                c0 += d + 0.14
            end = cs[-1]["end"]
            lines.append({"id": lid, "start": round(start, 3), "end": end, "scene": ex.get("scene"), "chunks": cs})
            t = end + ex.get("gap", 0.45)
            if lid == "L4b":
                SHIFT = round(max(0.0, t - INSERT_AT), 3)
    return lines, t


def _note(f, d, kind="pluck", vel=1.0):
    m = int(d * SR); tt = np.arange(m) / SR
    if kind == "pluck":
        x = sum(np.sin(2 * np.pi * f * k * tt) / k ** 1.3 * np.exp(-tt * (4 + 2 * k)) for k in range(1, 6))
    elif kind == "marimba":
        x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 5) + 0.35 * np.sin(2 * np.pi * f * 4 * tt) * np.exp(-tt * 18)
    elif kind == "bell":
        x = sum(np.sin(2 * np.pi * f * r * tt) * a * np.exp(-tt * dcy) for r, a, dcy in ((1, 1, 1.2), (2.76, 0.4, 3), (5.4, 0.2, 6)))
    else:
        x = ma.piano(f, d, 1.0) / 0.22
    return x * np.minimum(1, tt / 0.003) * vel


def _pad(freqs, d, amp=0.010):
    return ma.strings(freqs, d, att=1.2, rel=1.2) * (amp / 0.012)


def _hat(d=0.05):
    m = int(d * SR); tt = np.arange(m) / SR
    x = np.random.default_rng(int(d * 1e6)).standard_normal(m)
    x = x - np.convolve(x, np.ones(3) / 3, "same")
    return x * np.exp(-tt / 0.012) * 0.05


hz = lambda m_: 440.0 * 2 ** ((m_ - 69) / 12)


def _track(dur, bpm, prog, kind, pattern, pad_oct=12, hats=False, vel=0.55):
    out = np.zeros((int(dur * SR), 2))
    beat = 60 / bpm
    bar = 0
    while bar * 4 * beat < dur:
        at = bar * 4 * beat
        chord = prog[bar % len(prog)]
        for i, k in enumerate(pattern):
            tt = at + i * beat / 2
            if k is None or tt > dur - 0.3:
                continue
            ma.place(out, _note(hz(chord[k % len(chord)] + 12 * (k // len(chord)) + 12), 1.6, kind, vel * (1.0 if i % 4 == 0 else 0.7)), tt, 1.0, 0.35 + 0.3 * ((i * 3) % 2))
            if hats and i % 2 == 1:
                ma.place(out, _hat(), tt, 1.0, 0.7)
        if bar % 2 == 0:
            ma.place(out, _pad([hz(c + pad_oct) for c in chord[:3]], min(8 * beat + 1.0, dur - at + 0.01)), at, 1.0, 0.5)
        bar += 1
    return out


def track_mystery(dur):   # D minor, pulsing plucks + ticking hats (curiosity, experiments)
    return _track(dur, 92, [[50, 53, 57, 60], [46, 50, 53, 57], [48, 52, 55, 58], [45, 49, 52, 57]], "pluck", [0, 2, 1, 3, 0, 2, 4, 2], hats=True, vel=0.5)


def track_explain(dur):   # C major / A minor marimba, brighter (theory, explanation)
    return _track(dur, 100, [[48, 52, 55, 59], [45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 53]], "marimba", [0, 2, 1, 2, 3, 2, 1, 2], vel=0.5)


def track_warm(dur):      # F major, slow piano + bells (the test, the ending)
    return _track(dur, 72, [[41, 45, 48, 52], [46, 50, 53, 57], [45, 48, 52, 55], [43, 46, 50, 53]], "bell", [0, None, 2, None, 1, None, 3, None], vel=0.45)


def mix_tracks(dur, parts, xf=2.5):
    n = int(dur * SR)
    out = np.zeros((n, 2))
    for a, b, fn in parts:
        a0, b1 = max(0.0, a - xf / 2), min(dur, b + xf / 2)
        seg = fn(b1 - a0)
        tt = np.arange(len(seg)) / SR + a0
        env = np.clip((tt - (a - xf / 2)) / xf, 0, 1) * np.clip(((b + xf / 2) - tt) / xf, 0, 1)
        if a <= 0:
            env = np.clip(((b + xf / 2) - tt) / xf, 0, 1)
        i0 = int(a0 * SR)
        m = min(len(seg), n - i0)
        out[i0:i0 + m] += seg[:m] * env[:m, None]
    return out


def main():
    lines, total = build()
    DUR = round(total + 2.6, 2)  # room for the power-off at the end
    print("lines", len(lines), "chunks", sum(len(l["chunks"]) for l in lines), "duration", DUR)
    scenes = [{"id": l["scene"], "start": l["start"]} for l in lines if l["scene"]]
    tl = {"shift": SHIFT, "insert_at": INSERT_AT, "duration": DUR, "lines": [{**l, "chunks": [{k: v for k, v in c.items() if k != "_x"} for c in l["chunks"]]} for l in lines], "scenes": scenes}
    (ROOT / "data/timeline_full.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    if "--measure" in sys.argv:
        return
    n = int(DUR * SR)
    voice = np.zeros((n, 2))
    for l in lines:
        for c in l["chunks"]:
            ma.place(voice, c["_x"], c["start"], 0.95)
    sfx = np.zeros_like(voice)
    rng = np.random.default_rng(11)
    sh = lambda t: t + SHIFT if t >= INSERT_AT else t
    _place = ma.place

    def place_sh(buf, x, at, g=1.0, p=0.5):
        _place(buf, x, sh(at), g, p)

    def click():
        m = int(0.06 * SR); tt = np.arange(m) / SR
        return (np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt / 0.004) + rng.standard_normal(m) * np.exp(-tt / 0.01) * 0.3) * 0.4

    def hit(d=0.9):
        m = int(d * SR); tt = np.arange(m) / SR
        return (np.sin(2 * np.pi * 220 * tt) * 0.5 + np.sin(2 * np.pi * 330 * tt) * 0.3 + np.sin(2 * np.pi * 440 * tt) * 0.15) * np.exp(-tt / 0.35) * 0.35

    def pop():
        m = int(0.09 * SR); tt = np.arange(m) / SR
        return np.sin(2 * np.pi * (900 + 900 * tt / 0.09) * tt) * np.exp(-tt / 0.03) * 0.25

    def type_tick():
        m = int(0.025 * SR); tt = np.arange(m) / SR
        return rng.standard_normal(m) * np.exp(-tt / 0.004) * 0.12

    def power_off():
        m = int(1.2 * SR); tt = np.arange(m) / SR
        clk = np.sin(2 * np.pi * 1500 * tt) * np.exp(-tt / 0.006) * 0.6
        whine = np.sin(2 * np.pi * np.cumsum(4200 * np.exp(-tt * 3.5)) / SR) * np.exp(-tt / 0.35) * 0.12
        return clk + whine

    # opening (0–60) and part 2 (60–172): same effects as the approved versions
    for at, x, g, p in [(0.25, click(), 0.6, 0.5), (7.6, ma.sfx_soft_whoosh(), 0.35, 0.5), (10.6, ma.sfx_soft_whoosh(), 0.35, 0.5), (13.65, ma.sfx_soft_whoosh(), 0.35, 0.5),
                        (16.2, hit(), 1.0, 0.5), (16.25, ma.sfx_noise_swell(0.7), 0.6, 0.6), (18.15, ma.sfx_soft_whoosh(), 0.35, 0.5), (20.3, ma.sfx_chime(1046, 0.8), 0.45, 0.5),
                        (22.5, hit(0.7), 0.6, 0.5), (23.85, ma.sfx_soft_whoosh(), 0.35, 0.5), (30.65, ma.sfx_soft_whoosh(0.9), 0.4, 0.5), (30.9, ma.sfx_noise_swell(0.8), 0.5, 0.5),
                        (39.4, hit(0.8), 0.7, 0.5), (40.8, hit(1.4), 1.0, 0.5), (40.8, ma.sfx_chime(523, 1.6), 0.5, 0.5), (46.75, ma.sfx_soft_whoosh(0.9), 0.4, 0.5),
                        (58.75, ma.sfx_noise_swell(0.6), 0.6, 0.6), (58.95, ma.sfx_tick(), 0.8, 0.6)]:
        place_sh(sfx, x, at, g, p)
    for k in range(10):
        place_sh(sfx, click() * 0.3, 24.2 + k * 0.55, 0.45, 0.45 + 0.1 * (k % 2))
    O = 60.0
    for at, x, g, p in [(5.1, ma.sfx_chime(784, 1.2), 0.45, 0.35), (14.5, ma.sfx_chime(880, 1.2), 0.45, 0.5), (19.8, ma.sfx_chime(988, 1.2), 0.45, 0.65),
                        (29.9, ma.sfx_soft_whoosh(), 0.35, 0.5), (38.9, ma.sfx_soft_whoosh(), 0.35, 0.5), (45.7, ma.sfx_noise_swell(0.6), 0.6, 0.65), (46.0, ma.sfx_tick(), 0.8, 0.65),
                        (64.5, ma.sfx_soft_whoosh(0.5), 0.4, 0.4), (75.4, ma.sfx_soft_whoosh(0.5), 0.4, 0.5), (83.8, ma.sfx_soft_whoosh(0.5), 0.4, 0.6),
                        (94.9, ma.sfx_soft_whoosh(0.7), 0.4, 0.5), (98.6, hit(0.9), 0.7, 0.5)]:
        place_sh(sfx, x, O + at, g, p)
    for start in (73.5, 81.9, 92.8):
        for k in range(4):
            place_sh(sfx, ma.sfx_tick(), O + start + k * 0.55, 0.5, 0.5 + 0.1 * (k % 2))
    # chapters 2–9: a soft whoosh on every scene change, accents on key reveals
    accents = {"c2_result": hit(0.8), "c2_brain": ma.sfx_chime(659, 1.4), "c3_brain": ma.sfx_chime(784, 1.4), "c3_quote": hit(1.2), "c5_formula": hit(1.0),
               "c7_title": ma.sfx_chime(880, 1.4), "c7_bang": ma.sfx_chime(1046, 1.0)}
    for sc in scenes:
        if sc["start"] < 172:
            continue
        ma.place(sfx, ma.sfx_soft_whoosh(0.6), sc["start"] - 0.5, 0.35, 0.5)
        if sc["id"] in accents:
            ma.place(sfx, accents[sc["id"]], sc["start"] - 0.05, 0.8, 0.5)
        if sc["id"] in ("c3_phone", "c4b_phone", "c5_chat", "c7_phone4", "c7_phone2", "c8_phone"):
            for k in range(4):
                ma.place(sfx, pop(), sc["start"] - 1.2 + k * 0.6 if sc["id"] != "c5_chat" else sc["start"] - 8.0 + k * 2.6, 0.6, 0.55)
        if sc["id"] in ("c6_bp", "c6_lab"):
            for k in range(3):
                ma.place(sfx, ma.sfx_tick(), sc["start"] + 0.4 + k * 0.4, 0.5, 0.5)
    # subtitle-linked accents: red words get a short low-mid hit, yellow words a soft sparkle (not on every line)
    def sparkle():
        m = int(0.5 * SR); tt = np.arange(m) / SR
        return sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.12) for f in (2093, 2637, 3136)) * 0.05
    last_acc = -9.0
    for l in lines:
        for c in l["chunks"]:
            kinds = {s_["c"] for s_ in c["seg"]}
            if c["start"] - last_acc < 4.0 or c["start"] < 2.0:
                continue
            if "r" in kinds:
                ma.place(sfx, hit(0.5), c["start"] - 0.02, 0.45, 0.5); last_acc = c["start"]
            elif "y" in kinds:
                ma.place(sfx, sparkle(), c["start"] - 0.02, 0.8, 0.6); last_acc = c["start"]
    # chapter bumpers (big title at the start of each chapter): riser + impact
    def riser(d=1.0):
        m = int(d * SR); tt = np.arange(m) / SR
        x = rng.standard_normal(m)
        x = x - np.convolve(x, np.ones(6) / 6, "same")
        return x * (tt / d) ** 2 * 0.12
    for sc in scenes:
        if sc["id"] in CHAPTER_STARTS:
            ma.place(sfx, riser(), sc["start"] - 1.3, 1.0, 0.5)
            ma.place(sfx, hit(1.2), sc["start"] - 0.3, 1.0, 0.5)
            ma.place(sfx, ma.sfx_chime(392, 1.6), sc["start"] - 0.3, 0.6, 0.5)
    l4b = next(l for l in lines if l["id"] == "L4b")
    ma.place(sfx, hit(0.9), l4b["chunks"][1]["start"] - 0.05, 0.9, 0.5)
    # chapter 8: typing "でもさ、" then deleting and retyping
    c8 = next(l for l in lines if l["id"] == "C8_6")
    for k in range(4):
        ma.place(sfx, type_tick(), c8["end"] - 0.2 + k * 0.18, 0.8, 0.55)
    for k in range(4):
        ma.place(sfx, type_tick(), c8["end"] + 1.3 + k * 0.08, 0.7, 0.55)
    for k in range(14):
        ma.place(sfx, type_tick(), c8["end"] + 2.0 + k * 0.13, 0.8, 0.55)
    ma.place(sfx, pop(), c8["end"] + 4.1, 0.8, 0.55)
    ma.place(sfx, pop(), c8["end"] + 4.8, 0.8, 0.45)
    # the ending: monitor switches off
    off_at = DUR - 2.2
    ma.place(sfx, power_off(), off_at, 1.0, 0.5)
    tl["off_at"] = round(off_at, 3)
    (ROOT / "data/timeline_full.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))

    sc_at = {x["id"]: x["start"] for x in scenes}
    b1 = sh(60.0)                       # opening -> part 2
    b2 = sc_at["c4_icons"] - 1.0        # thought experiment & brain -> theory
    b3 = sc_at["c7_title"] - 2.0        # theory & body -> the test & ending
    music = mix_tracks(DUR, [(0, b1, ma.bgm2), (b1, b2, track_mystery), (b2, b3, track_explain), (b3, DUR, track_warm)])
    tl["bgm"] = [round(b1, 2), round(b2, 2), round(b3, 2)]
    duck = np.ones(n)
    for l in lines:
        a, b = int((l["start"] - 0.3) * SR), int((l["end"] + 0.3) * SR)
        duck[max(0, a):b] = 0.35
    duck = np.convolve(duck, np.ones(SR // 5) / (SR // 5), "same")
    t_ = np.arange(n) / SR
    fade = np.minimum(1, np.minimum(t_ / 1.0, np.clip((off_at - t_) / 0.15, 0, 1)))
    bed = sfx + music * 0.33 * (duck * fade)[:, None]
    import tempfile
    with tempfile.TemporaryDirectory() as td:
        a_, b_ = Path(td) / "a.wav", Path(td) / "b.wav"
        peak = max(1e-9, np.abs(bed).max())
        with wave.open(str(a_), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(bed / peak * 0.9, -1, 1) * 32767).astype("<i2").tobytes())
        ma.subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(a_), "-af", "highpass=f=95:poles=2,highpass=f=95:poles=2", str(b_)], check=True)
        with wave.open(str(b_)) as w:
            bedh = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float64).reshape(-1, 2) / 32768
        bedh = bedh[:n] * (peak / 0.9)
    mix = voice + bedh * 0.9
    mix = mix / max(np.abs(mix).max(), 1e-9) * 0.89
    out = ROOT / "out/full.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes())
    print("wrote", out)


if __name__ == "__main__":
    main()
