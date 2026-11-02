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
    return ma.read_wav(f), kf.read_text()


def ensure_dict():
    words = json.loads(urllib.request.urlopen(f"{VV}/user_dict").read())
    if not any(w.get("surface") in ("背側前帯状皮質", "背側前帯状皮質") for w in words.values()):
        q = f"surface={urllib.parse.quote('背側前帯状皮質')}&pronunciation={urllib.parse.quote('ハイソクゼンタイジョウヒシツ')}&accent_type=7&word_type=PROPER_NOUN"
        urllib.request.urlopen(urllib.request.Request(f"{VV}/user_dict_word?{q}", method="POST")).read()


def build():
    ensure_dict()
    lines = []
    t = 0.0
    for part in (P1, P2, REST):
        for lid, text, ex in part:
            chunks = [c for c in text.split("｜") if c]
            start = ex.get("at", t + ex.get("pre", 0.0))
            if "at" in ex and start < t - 0.01:
                print(f"!! {lid}: anchor {start:.2f} < previous end {t:.2f}")
                start = t
            cs = []
            c0 = start
            for c in chunks:
                x, kana = synth(c)
                d = len(x) / SR
                cs.append({"sub": c, "start": round(c0, 3), "end": round(c0 + d, 3), "kana": kana, "_x": x})
                c0 += d + 0.14
            end = cs[-1]["end"]
            lines.append({"id": lid, "start": round(start, 3), "end": end, "scene": ex.get("scene"), "chunks": cs})
            t = end + ex.get("gap", 0.45)
    return lines, t


def main():
    lines, total = build()
    DUR = round(total + 2.6, 2)  # room for the power-off at the end
    print("lines", len(lines), "chunks", sum(len(l["chunks"]) for l in lines), "duration", DUR)
    scenes = [{"id": l["scene"], "start": l["start"]} for l in lines if l["scene"]]
    tl = {"duration": DUR, "lines": [{**l, "chunks": [{k: v for k, v in c.items() if k != "_x"} for c in l["chunks"]]} for l in lines], "scenes": scenes}
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
        ma.place(sfx, x, at, g, p)
    for k in range(10):
        ma.place(sfx, click() * 0.3, 24.2 + k * 0.55, 0.45, 0.45 + 0.1 * (k % 2))
    O = 60.0
    for at, x, g, p in [(5.1, ma.sfx_chime(784, 1.2), 0.45, 0.35), (14.5, ma.sfx_chime(880, 1.2), 0.45, 0.5), (19.8, ma.sfx_chime(988, 1.2), 0.45, 0.65),
                        (29.9, ma.sfx_soft_whoosh(), 0.35, 0.5), (38.9, ma.sfx_soft_whoosh(), 0.35, 0.5), (45.7, ma.sfx_noise_swell(0.6), 0.6, 0.65), (46.0, ma.sfx_tick(), 0.8, 0.65),
                        (64.5, ma.sfx_soft_whoosh(0.5), 0.4, 0.4), (75.4, ma.sfx_soft_whoosh(0.5), 0.4, 0.5), (83.8, ma.sfx_soft_whoosh(0.5), 0.4, 0.6),
                        (94.9, ma.sfx_soft_whoosh(0.7), 0.4, 0.5), (98.6, hit(0.9), 0.7, 0.5)]:
        ma.place(sfx, x, O + at, g, p)
    for start in (73.5, 81.9, 92.8):
        for k in range(4):
            ma.place(sfx, ma.sfx_tick(), O + start + k * 0.55, 0.5, 0.5 + 0.1 * (k % 2))
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

    music = ma.bgm2(DUR)
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
        ma.subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(a_), "-af", "highpass=f=110:poles=2,highpass=f=110:poles=2", str(b_)], check=True)
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
