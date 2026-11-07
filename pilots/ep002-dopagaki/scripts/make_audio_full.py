"""Full-length narration + SFX + BGM for ep002 ドパガキ (VOICEVOX ナースロボ＿タイプＴ). Same method as ep001.

Usage: python3 scripts/make_audio_full.py [--measure]
- One TTS call per subtitle line (chunk) -> subtitles show one line at a time, exactly while it is spoken.
- Writes data/timeline_full.json and out/full.wav. TTS chunks are cached in tts_cache/.
"""
import hashlib, importlib.util, json, os, re, sys, urllib.parse, urllib.request, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("ma", ROOT / "scripts/make_audio.py")
ma = importlib.util.module_from_spec(spec); spec.loader.exec_module(ma)
sys.path.insert(0, str(ROOT / "data"))
from script_full import LINES, CHAPTERS  # noqa: E402

SR = ma.SR
VV = "http://127.0.0.1:50021"
SPK = 47
RATE = 1.12
CACHE = ROOT / "tts_cache"; CACHE.mkdir(parents=True, exist_ok=True)
(ROOT / "out").mkdir(exist_ok=True)
# readings (longest first where one contains another)
READ = [("腹側線条体", "ふくそくせんじょうたい"), ("線条体", "せんじょうたい"), ("眼窩前頭皮質", "がんかぜんとうひしつ"), ("前帯状皮質", "ぜんたいじょうひしつ"),
        ("島皮質", "とうひしつ"), ("灰白質", "かいはくしつ"), ("白質", "はくしつ"), ("側頭葉の下側", "そくとうようのしたがわ"), ("海馬", "かいば"),
        ("展望記憶", "てんぼうきおく"), ("受け皿", "うけざら"), ("快楽物質", "かいらくぶっしつ"), ("人ごと", "ひとごと"),
        ("TikTok", "ティックトック"), ("Twitter", "ツイッター"), ("YouTube", "ユーチューブ"), ("SNS", "エスエヌエス"), ("MRI", "エムアールアイ"),
        ("18人中12人", "ジュウハチニンチュウ、ジュウニニン"), ("24人中6人", "ニジュウヨニンチュウ、ロクニン"),
        ("44の国", "よんじゅうよんのくに"), ("11歳から15歳", "じゅういっさいからじゅうごさい"), ("約28万人", "ヤク、ニジュウハチマンニン"),
        ("4年間", "よねんかん"), ("7％から11％", "ななパーセントからじゅういちパーセント"), ("22人", "にじゅうににん"), ("26人", "にじゅうろくにん"),
        ("5歳から18歳", "ごさいからじゅうはっさい"), ("3年間", "さんねんかん"), ("3年後", "さんねんご"), ("3年", "さんねん"), ("60人", "ろくじゅうにん"),
        ("12万5千人", "じゅうにまんごせんにん"), ("およそ2倍", "およそにばい"), ("1.5倍", "イッテンゴバイ"), ("2.7倍", "ニテンナナバイ"),
        ("44本", "よんじゅうよんほん"), ("23本", "にじゅうさんほん"), ("467人", "よんひゃくろくじゅうななにん"), ("2週間", "にしゅうかん"),
        ("10歳", "じゅっさい"), ("10日以上", "とおかいじょう"), ("一日中", "いちにちじゅう"), ("一日", "いちにち"), ("一章", "いっしょう"),
        ("1本", "いっぽん"), ("1時間", "いちじかん"), ("15分", "じゅうごふん"), ("5分", "ごふん"), ("数十秒", "すうじゅうびょう"),
        ("一つひとつ", "ひとつひとつ"), ("前借り", "まえがり"), ("怠けて", "なまけて"), ("下へ", "したへ"), ("前と後", "まえとあと"), ("4%", "よんパーセント"), ("ドM", "ドエム"), ("横動画", "よこどうが"), ("実年齢", "じつねんれい"), ("（カプセルトイ）", ""), ("あと一回", "あといっかい")]


def tts_text(s):
    s = s.replace("「", "").replace("」", "").replace("｜", "")
    for a, b in READ:
        s = s.replace(a, b)
    return s


def fix_shoutai(q):
    return q


def chunk(text, limit=24):
    """split a line into one-line subtitle chunks: by hand with ｜, otherwise at the 、 nearest the middle"""
    out = []
    for part in [p for p in text.split("｜") if p]:
        stack = [part]
        while stack:
            p = stack.pop(0)
            if len(p) <= limit:
                out.append(p); continue
            cuts = [i + 1 for i, ch in enumerate(p) if ch in "、" and 4 <= i + 1 <= len(p) - 4]
            if not cuts:
                out.append(p); continue
            k = min(cuts, key=lambda i: abs(i - len(p) / 2))
            stack[0:0] = [p[:k], p[k:]]
    return out


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


RED = ["ドパガキ", "電気ショック", "無気力", "慢性疲労", "現実逃避", "中毒", "ヤバい", "やめられない", "少なかった", "小さかった", "下がっていました", "下がった", "抜け落ち", "溶けて", "痛み", "二度と戻りません", "深刻", "イライラ", "落ち込み", "疲れている", "沈み", "押し出され", "眠い"]
YEL = ["ドーパミン", "受け皿", "線条体", "灰白質", "前帯状皮質", "眼窩前頭皮質", "島皮質", "展望記憶", "2週間", "15分", "寝室", "仕組み", "集中力", "心の健康", "ごほうび", "もっと", "思っていたより良かった", "一つの輪", "地味", "ドーパミン断食", "3年", "10歳若い", "見られない場所", "今日"]


def segments(sub):
    # mark at most 3 words per line: red = danger / pain, yellow = key idea
    hits = []
    for words, c in ((RED, "r"), (YEL, "y")):
        for w in words:
            i = sub.find(w)
            while i >= 0:
                # skip a match that is the tail of a longer word (e.g. 近い inside 最近いい)
                inside = i > 0 and "\u4e00" <= sub[i - 1] <= "\u9fff"
                if not inside and not any(a < i + len(w) and i < b for a, b, _ in hits):
                    hits.append((i, i + len(w), c))
                i = sub.find(w, i + len(w))
    hits = sorted(hits)[:3]
    col = ["w"] * len(sub)
    for a, b, c in hits:
        col[a:b] = [c] * (b - a)
    out = []
    for ch, c in zip(sub, col):
        if out and out[-1]["c"] == c:
            out[-1]["t"] += ch
        else:
            out.append({"t": ch, "c": c})
    return out



def quote_colors(chunks):
    """「…」: the brackets and everything inside take one color, also when a quote runs over two subtitle lines
    (owner 2026-11-07). Red wins when both red and yellow words are inside."""
    text = "".join(c["sub"] for c in chunks)
    col = [s_["c"] for c in chunks for s_ in c["seg"] for _ in s_["t"]]
    for m in re.finditer(r"「[^「」]*」", text):
        inner = [c for c in col[m.start() + 1:m.end() - 1] if c != "w"]
        c = "r" if "r" in inner else ("y" if inner else "w")
        col[m.start():m.end()] = [c] * (m.end() - m.start())
    pos = 0
    for c in chunks:
        segs = []
        for ch, k in zip(c["sub"], col[pos:pos + len(c["sub"])]):
            if segs and segs[-1]["c"] == k:
                segs[-1]["t"] += ch
            else:
                segs.append({"t": ch, "c": k})
        c["seg"] = segs
        pos += len(c["sub"])
    return chunks


def build():
    lines = []
    t = 0.6
    for lid, text, ex in LINES:
        start = t + ex.get("pre", 0.0)
        cs = []
        c0 = start
        for c in chunk(text):
            x, kana = synth(c)
            d = len(x) / SR
            cs.append({"sub": c, "seg": segments(c), "start": round(c0, 3), "end": round(c0 + d, 3), "kana": kana, "_x": x})
            c0 += d + 0.14
        quote_colors(cs)
        end = cs[-1]["end"]
        lines.append({"id": lid, "start": round(start, 3), "end": end, "scene": ex.get("scene"), "chunks": cs})
        t = end + ex.get("gap", 0.45)
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



# ---------- quiet drum beds (owner 2026-11-07: three quiet tracks built on a soft snare feel) ----------
_drng = np.random.default_rng(7)


def _noise(m):
    return _drng.standard_normal(m)


def _bp(x, lo, hi):
    # crude band-pass: difference of two moving averages
    a = max(1, int(SR / hi)); b = max(a + 1, int(SR / lo))
    return np.convolve(x, np.ones(a) / a, "same") - np.convolve(x, np.ones(b) / b, "same")


def d_snare(vel=1.0, d=0.22):
    m = int(d * SR); tt = np.arange(m) / SR
    body = np.sin(2 * np.pi * 185 * tt) * np.exp(-tt / 0.035) * 0.5
    rattle = _bp(_noise(m), 1500, 7000) * np.exp(-tt / 0.07) * 1.6
    return (body + rattle) * np.minimum(1, tt / 0.002) * 0.22 * vel


def d_brush(vel=1.0, d=0.38):
    m = int(d * SR); tt = np.arange(m) / SR
    env = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 1.5
    return _bp(_noise(m), 2500, 9000) * env * 0.10 * vel


def d_rim(vel=1.0):
    m = int(0.05 * SR); tt = np.arange(m) / SR
    return (np.sin(2 * np.pi * 1700 * tt) * np.exp(-tt / 0.006) + _bp(_noise(m), 2000, 8000) * np.exp(-tt / 0.004)) * 0.09 * vel


def d_kick(vel=1.0):
    m = int(0.35 * SR); tt = np.arange(m) / SR
    f = 95 + 70 * np.exp(-tt / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.16) * 0.10 * vel


def d_hat(vel=1.0):
    m = int(0.04 * SR); tt = np.arange(m) / SR
    return _bp(_noise(m), 6000, 14000) * np.exp(-tt / 0.01) * 0.05 * vel


def _drum_track(dur, bpm, bar, pad=None, pad_amp=0.004, roll_every=0):
    """bar: list of (step in 16ths, kind, vel) for one 4/4 bar"""
    out = np.zeros((int(dur * SR), 2))

    def place_(buf, x, t, g, p):
        if 0 <= t < dur - 0.05:
            x = x[: max(0, int((dur - t) * SR) - 2)]
            if len(x):
                ma.place(buf, x, t, g, p)
    st = 60 / bpm / 4
    fn = {"s": d_snare, "b": d_brush, "r": d_rim, "k": d_kick, "h": d_hat}
    pan = {"s": 0.5, "b": 0.42, "r": 0.6, "k": 0.5, "h": 0.66}
    n = 0
    while n * 16 * st < dur - 0.5:
        at = n * 16 * st
        hum = lambda i: (_drng.random() - 0.5) * 0.012
        for step, kind, vel in bar:
            v = vel * (0.85 + 0.3 * _drng.random())
            place_(out, fn[kind](v), at + step * st + hum(step), 1.0, pan[kind])
        if roll_every and n % roll_every == roll_every - 1:  # a soft snare roll into the next phrase
            for i in range(8):
                place_(out, d_snare(0.25 + 0.6 * i / 7, 0.12), at + (8 + i) * st / 2 + 8 * st, 1.0, 0.5)
        if pad is not None and n % 2 == 0:
            place_(out, _pad([hz(c) for c in pad[(n // 2) % len(pad)]], min(32 * st + 1.0, dur - at + 0.01), pad_amp), at, 1.0, 0.5)
        n += 1
    return out


def drum_tension(dur):   # 76 bpm: no kick (owner 2026-11-07); brushed snare on 3, rim ghosts, quiet hats; faint D-minor drone
    bar = [(8, "s", 0.9), (8, "b", 0.6), (6, "r", 0.35), (14, "r", 0.3)] + [(i, "h", 0.5 if i % 4 else 0.8) for i in range(0, 16, 2)]
    return _drum_track(dur, 76, bar, pad=[[50, 57, 62], [46, 53, 58]], pad_amp=0.0035, roll_every=8)


def drum_pulse(dur):     # 90 bpm: soft snare on 2 and 4 (no kick), 16th hats (explanation, brain chapters)
    bar = [(4, "s", 0.8), (12, "s", 0.85)] + [(i, "h", 0.35 + 0.35 * (i % 4 == 0)) for i in range(16)] + [(7, "r", 0.25)]
    return _drum_track(dur, 90, bar, pad=None, roll_every=0)


def drum_brush(dur):     # 70 bpm: brush sweeps on every beat, soft snare on 4 (no kick); faint warm F-major pad (way out, ending)
    bar = [(12, "s", 0.7)] + [(i, "b", 0.8 if i % 8 == 0 else 0.55) for i in (0, 4, 8, 12)] + [(i, "h", 0.3) for i in (2, 6, 10, 14)]
    return _drum_track(dur, 70, bar, pad=[[53, 57, 60, 64], [46, 50, 53, 57]], pad_amp=0.004, roll_every=0)


def main():
    lines, total = build()
    DUR = round(total + 2.6, 2)  # room for the power-off at the end
    print("lines", len(lines), "chunks", sum(len(l["chunks"]) for l in lines), "duration", DUR)
    scenes = []
    for l in lines:
        if l["scene"]:
            pre = next(ex.get("pre", 0.0) for lid, _, ex in LINES if lid == l["id"])
            scenes.append({"id": l["scene"], "start": round(l["start"] - pre - (0.0 if pre else 0.3), 3), "line": l["id"]})
    scenes[0]["start"] = 0.0
    chapters = [{"line": lid, "num": num, "title": title, "at": round(next(l["start"] for l in lines if l["id"] == lid) - 0.3, 3)} for lid, num, title in CHAPTERS]
    tl = {"duration": DUR, "lines": [{**l, "chunks": [{k: v for k, v in c.items() if k != "_x"} for c in l["chunks"]]} for l in lines], "scenes": scenes, "chapters": chapters}
    (ROOT / "data/timeline_full.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    if "--measure" in sys.argv:
        return
    n = int(DUR * SR)
    voice = np.zeros((n, 2))
    for l in lines:
        for c in l["chunks"]:
            ma.place(voice, c["_x"], c["start"], 0.95)
    sfx = np.zeros_like(voice)
    rng = np.random.default_rng(12)
    L = {l["id"]: l for l in lines}

    def click():
        m = int(0.06 * SR); tt = np.arange(m) / SR
        return (np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt / 0.004) + rng.standard_normal(m) * np.exp(-tt / 0.01) * 0.3) * 0.4

    def hit(d=0.9):
        m = int(d * SR); tt = np.arange(m) / SR
        return (np.sin(2 * np.pi * 220 * tt) * 0.5 + np.sin(2 * np.pi * 330 * tt) * 0.3 + np.sin(2 * np.pi * 440 * tt) * 0.15) * np.exp(-tt / 0.35) * 0.35

    def pop():
        m = int(0.09 * SR); tt = np.arange(m) / SR
        return np.sin(2 * np.pi * (900 + 900 * tt / 0.09) * tt) * np.exp(-tt / 0.03) * 0.25

    def swipe():
        m = int(0.16 * SR); tt = np.arange(m) / SR
        x = rng.standard_normal(m)
        x = np.convolve(x, np.ones(8) / 8, "same")
        return x * np.sin(np.pi * tt / 0.16) * 0.10

    def zap(d=0.35):
        m = int(d * SR); tt = np.arange(m) / SR
        buzz = np.sign(np.sin(2 * np.pi * 120 * tt)) * 0.5 + rng.standard_normal(m) * 0.5
        return buzz * np.exp(-tt / 0.12) * 0.16

    def power_off():
        m = int(1.2 * SR); tt = np.arange(m) / SR
        clk = np.sin(2 * np.pi * 1500 * tt) * np.exp(-tt / 0.006) * 0.6
        whine = np.sin(2 * np.pi * np.cumsum(4200 * np.exp(-tt * 3.5)) / SR) * np.exp(-tt / 0.35) * 0.12
        return clk + whine

    def sparkle():
        m = int(0.5 * SR); tt = np.arange(m) / SR
        return sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.12) for f in (2093, 2637, 3136)) * 0.05

    def riser(d=1.0):
        m = int(d * SR); tt = np.arange(m) / SR
        x = rng.standard_normal(m)
        x = x - np.convolve(x, np.ones(6) / 6, "same")
        return x * (tt / d) ** 2 * 0.12

    # opening: screen click, swipes while the thumb flicks, whooshes on each everyday cut
    ma.place(sfx, click(), 0.3, 0.6, 0.5)
    for k in range(9):
        ma.place(sfx, swipe(), 0.9 + k * 0.42, 0.9, 0.45 + 0.1 * (k % 2))
    ma.place(sfx, hit(1.2), L["N1"]["chunks"][2]["start"] - 0.05, 0.9, 0.5)
    ma.place(sfx, hit(1.0), L["O1"]["chunks"][1]["start"] - 0.05, 0.8, 0.5)
    for k in range(10):  # capsule-toy handle ratchet
        ma.place(sfx, click() * 0.5, L["N4"]["start"] + 0.2 + k * 0.32, 0.6, 0.45 + 0.1 * (k % 2))
    for lid in ("N3", "N4", "N5", "N6"):
        ma.place(sfx, ma.sfx_soft_whoosh(0.6), L[lid]["start"] - 0.45, 0.35, 0.5)
    # every scene change: soft whoosh; "result" scenes and reveals get an accent
    accents = {"k2_result": hit(0.9), "k3_result": ma.sfx_chime(659, 1.4), "k3b_wave": ma.sfx_chime(784, 1.4), "k4_compare": hit(0.9), "k5_gray": hit(0.9),
               "k5_growth": hit(0.9), "k6_bars": ma.sfx_chime(880, 1.2), "k7_bars": hit(0.9), "k8_escape": hit(1.2), "k9_graphs": ma.sfx_chime(1046, 1.4), "k10_question": ma.sfx_chime(523, 1.6)}
    for sc in scenes[1:]:
        ma.place(sfx, ma.sfx_soft_whoosh(0.6), sc["start"] - 0.4, 0.35, 0.5)
        if sc["id"] in accents:
            ma.place(sfx, accents[sc["id"]], sc["start"] + 0.25, 0.8, 0.5)
        if sc["id"] in ("k3_feed", "k3b_feed", "k7_night", "k8_cuts"):
            for k in range(6):
                ma.place(sfx, swipe(), sc["start"] + 0.5 + k * 0.9, 0.8, 0.45 + 0.1 * (k % 2))
        if sc["id"] in ("k6_bars", "k7_bars", "k9_graphs", "k2_result"):
            for k in range(3):
                ma.place(sfx, ma.sfx_tick(), sc["start"] + 1.2 + k * 0.45, 0.5, 0.5)
    # cards in chapter 1 flip with a pop
    for lid in ("A3", "A4", "A5", "A6", "A7"):
        ma.place(sfx, pop(), L[lid]["start"] - 0.1, 0.8, 0.5)
    # the timer (15 min) ticks; the button in the shock experiment buzzes
    for k in range(6):
        ma.place(sfx, ma.sfx_tick(), L["A13"]["start"] + 0.2 + k * 0.5, 0.45, 0.55)
    ma.place(sfx, click(), L["B11"]["start"] + 0.6, 0.7, 0.5)
    ma.place(sfx, zap(), L["B15"]["chunks"][1]["start"] - 0.2, 1.0, 0.5)
    # emphasis: red words a short low-mid hit, yellow words a soft sparkle (>= 4 s apart)
    last_acc = -9.0
    for l in lines:
        for c in l["chunks"]:
            kinds = {s_["c"] for s_ in c["seg"]}
            if c["start"] - last_acc < 4.0 or c["start"] < 6.0:
                continue
            if "r" in kinds:
                ma.place(sfx, hit(0.5), c["start"] - 0.02, 0.45, 0.5); last_acc = c["start"]
            elif "y" in kinds:
                ma.place(sfx, sparkle(), c["start"] - 0.02, 0.8, 0.6); last_acc = c["start"]
    # chapter title cards: riser + impact
    for ch in chapters:
        ma.place(sfx, riser(), ch["at"] - 1.0, 1.0, 0.5)
        ma.place(sfx, hit(1.2), ch["at"], 1.0, 0.5)
        ma.place(sfx, ma.sfx_chime(392, 1.6), ch["at"], 0.6, 0.5)
    off_at = DUR - 2.2
    ma.place(sfx, power_off(), off_at, 1.0, 0.5)
    tl["off_at"] = round(off_at, 3)

    sc_at = {x["id"]: x["start"] for x in scenes}
    # three quiet drum beds (owner 2026-11-07): opening–chapter 3 / chapters 4–7 / chapter 8–end
    b1 = sc_at["k4_receptor"] - 1.0
    b2 = sc_at["k8_msg"] - 1.0
    music = mix_tracks(DUR, [(0, b1, drum_tension), (b1, b2, drum_pulse), (b2, DUR, drum_brush)])
    tl["bgm"] = [round(b1, 2), round(b2, 2)]
    (ROOT / "data/timeline_full.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
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
