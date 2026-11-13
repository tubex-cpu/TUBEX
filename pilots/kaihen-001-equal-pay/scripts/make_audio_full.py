"""Full-length narration + SFX + BGM for kaihen-001-equal-pay ルール改変ニッポン「全員同じ給料／誰が働く？」.
Voice: VOICEVOX 玄野武宏（ノーマル, style 11） — credit "VOICEVOX:玄野武宏". Same method as ヒト図鑑 ep006 (subtitle chunks / colors identical).
UPTO=<line id> limits the build to the lines up to and including that id (the opening check cut).

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
sys.path.insert(0, str(ROOT / "scripts"))
from script_full import LINES, CHAPTERS, TAGS  # noqa: E402
if os.environ.get('UPTO'):
    _k = [i for i, (lid, _, _) in enumerate(LINES) if lid == os.environ['UPTO']][0]
    LINES = LINES[:_k + 1]
    CHAPTERS = [c for c in CHAPTERS if any(lid == c[0] for lid, _, _ in LINES)]

SR = ma.SR
VV = "http://127.0.0.1:50021"
SPK = 11   # 玄野武宏 ノーマル
RATE = 1.0
CACHE = ROOT / "tts_cache"; CACHE.mkdir(parents=True, exist_ok=True)
(ROOT / "out").mkdir(exist_ok=True)
# readings (longest first where one contains another; replaced in this order). Check every line's kana in tts_cache/*.kana
READ = [("1年を通じて", "イチネンヲツウジテ"), ("478万円", "ヨンヒャクナナジュウハチマンエン"), ("1.10件", "イッテンイチゼロケン"), ("6.41件", "ロクテンヨンイチケン"), ("5.02件", "ゴテンゼロニケン"), ("2.73件", "ニテンナナサンケン"),
        ("0.57倍", "レイテンゴーナナバイ"), ("1.7倍", "イッテンナナバイ"), ("9.9%", "キュウテンキュウパーセント"), ("44%", "ヨンジュウヨンパーセント"), ("2,000人", "ニセンニン"), ("1,338万円", "センサンビャクサンジュウハチマンエン"),
        ("33万8,200円", "サンジュウサンマンハッセンニヒャクエン"), ("39万8,000円", "サンジュウキュウマンハッセンエン"), ("560ユーロ", "ゴヒャクロクジュウユーロ"), ("約25万人", "ヤクニジュウゴマンニン"),
        ("A、", "エー、"), ("B、", "ビー、"), ("C、", "シイ、"), ("Aと", "エート"), ("Bと", "ビート"), ("Cの", "シイノ"), ("Cを", "シイヲ"), ("Bに", "ビーニ"), ("予想のC", "ヨソウノシイ"),
        ("工事現場", "コウジゲンバ"), ("部長", "ブチョウ"), ("額", "ガク"), ("給料袋", "キュウリョウブクロ"), ("習いごと", "ナライゴト"), ("掛け持ち", "カケモチ"),
        ("20歳から24歳", "ハタチカラニジュウヨンサイ"), ("55歳から59歳", "ゴジュウゴサイカラゴジュウキュウサイ"), ("55歳", "ゴジュウゴサイ"), ("22歳", "ニジュウニサイ"), ("20代前半", "ニジュウダイゼンハン"), ("50代後半", "ゴジュウダイコウハン"),
        ("10年、20年先", "ジュウネン、ニジュウネンサキ"), ("1980年代", "センキュウヒャクハチジュウネンダイ"), ("1990年代", "センキュウヒャクキュウジュウネンダイ"), ("数百人", "スウヒャクニン"),
        ("2017年", "ニセンジュウナナネン"), ("2018年", "ニセンジュウハチネン"), ("2020年", "ニセンニジュウネン"), ("2021年", "ニセンニジュウイチネン"), ("2024年", "ニセンニジュウヨネン"), ("2025年度", "ニセンニジュウゴネンド"), ("2025年", "ニセンニジュウゴネン"),
        ("6年間", "ロクネンカン"), ("2年間", "ニネンカン"), ("2倍以上", "ニバイイジョウ"), ("3分の1", "サンブンノイチ"), ("約6日", "ヤクムイカ"), ("1年目", "イチネンメ"), ("2年目", "ニネンメ"),
        ("人事院", "ジンジイン"), ("医学部", "イガクブ"), ("配偶者", "ハイグウシャ"), ("安全網", "アンゼンモウ"), ("求人倍率", "キュウジンバイリツ"), ("ものさし", "モノサシ"), ("上乗せ", "ウワノセ")]


def tts_text(s):
    s = s.replace("「", "").replace("」", "").replace("｜", "")
    for a, b in READ:
        s = s.replace(a, b)
    s = re.sub(r"年(?=\d)", "ネン", s)  # 年478万円 = ネン (not トシ)
    return s


def fix_shoutai(q):
    return q


def chunk(text, limit=24):
    """split a line into one-line subtitle chunks: by hand with ｜, otherwise at 。 then 、 then after 」, then after a particle,
    always nearest the middle"""
    out = []
    for part in [p for p in text.split("｜") if p]:
        stack = [part]
        while stack:
            p = stack.pop(0)
            if len(p) <= limit:
                out.append(p); continue
            k = None
            for marks, after in (("。？！", True), ("、", True), ("」", True), ("をにがはでとも", True)):
                cuts = [i + 1 for i, ch in enumerate(p) if ch in marks and 5 <= i + 1 <= len(p) - 5]
                if marks == "をにがはでとも":
                    cuts = [c for c in cuts if p[c - 2] not in "「（" and p[c:c + 1] not in "、。」"]
                    # do not cut inside こと / あと / ひと / とき (ep006: 「別のこと|を」「見ていると|きの」)
                    cuts = [c for c in cuts if not (p[c - 1] == "と" and (p[c - 2] in "こあひもま" or p[c:c + 1] == "き"))]
                    # nor between と and して (v1.3: 「一つと|して書き残した」)
                    cuts = [c for c in cuts if not (p[c - 1] == "と" and p[c:c + 2] == "して")]
                if cuts:
                    k = min(cuts, key=lambda i: abs(i - len(p) / 2))
                    if abs(k - len(p) / 2) < len(p) * 0.35:
                        break
                    k = None
            if k is None:
                out.append(p); continue
            stack[0:0] = [p[:k], p[k:]]
    return out


def synth(text):
    t = tts_text(text)
    key = hashlib.sha1(f"{SPK}|{RATE}|k1|{t}".encode()).hexdigest()[:16]
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


RED = ["減ります", "減る側", "代償", "消えていく", "人が消える", "足りていません", "足りない", "閉店", "崩れる", "崩れます", "手薄", "出ていきやすかった", "減りました", "決まりません", "働かなくなる", "3分の1", "苦しく"]
YEL = ["全員同じ", "全員、同じ", "478万円", "同じ額", "増えます", "2倍以上", "事実", "前提", "推論", "キブツ", "セーフライト", "3つ", "一つ目", "1つ目", "2つ目", "3つ目", "安全網", "ものさし", "44%", "同一労働同一賃金", "フィンランド", "宝くじ", "ゼロ"]


def segments(sub):
    # mark at most 3 words per line: red = danger / pain, yellow = key idea
    hits = []
    for words, c in ((RED, "r"), (YEL, "y")):
        for w in words:
            i = sub.find(w)
            while i >= 0:
                # skip a match that is the tail of a longer word (e.g. 近い inside 最近いい)
                inside = i > 0 and ("\u4e00" <= sub[i - 1] <= "\u9fff" or sub[i - 1] in "0123456789.０１２３４５６７８９")
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
    tl = {"tags": TAGS, "duration": DUR, "lines": [{**l, "chunks": [{k: v for k, v in c.items() if k != "_x"} for c in l["chunks"]]} for l in lines], "scenes": scenes, "chapters": chapters}
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

    def flip():  # an old paper card turning over
        m = int(0.32 * SR); tt = np.arange(m) / SR
        x = rng.standard_normal(m)
        x = x - np.convolve(x, np.ones(4) / 4, "same")
        return x * np.sin(np.pi * np.clip(tt / 0.32, 0, 1)) ** 2 * 0.09

    def beep():  # the small study pager
        m = int(0.5 * SR); tt = np.arange(m) / SR
        g = ((tt % 0.18) < 0.09).astype(float)
        return np.sin(2 * np.pi * 2300 * tt) * g * np.exp(-tt / 0.6) * 0.08

    # scene changes: soft whoosh; the stamp (改) and the reveal lines get a hit
    for sc in scenes[1:]:
        ma.place(sfx, ma.sfx_soft_whoosh(0.6), sc["start"] - 0.4, 0.35, 0.5)
    IMPACT = 3.55  # the seal hits the road (Opening3D.tsx `impact`)
    if "s01_0" in L:
        ma.place(sfx, riser(0.75), IMPACT - 0.75, 0.9, 0.5)
        m_ = int(1.2 * SR); tt_ = np.arange(m_) / SR
        thud = np.sin(2 * np.pi * np.cumsum(55 + 60 * np.exp(-tt_ / 0.05)) / SR) * np.exp(-tt_ / 0.35) * 0.9
        ma.place(sfx, thud, IMPACT, 1.0, 0.5)
    for lid in ("s02_1", "s02_2", "s02_3"):  # the three prediction cards
        if lid in L:
            ma.place(sfx, flip(), L[lid]["start"] - 0.2, 1.0, 0.5)
    if "s01_1" in L:  # the five people of s01_1 step in (3 on the first subtitle line, 2 on the second; same timing as ScenesOpen.tsx)
        c0, c1 = L["s01_1"]["chunks"][0]["start"], L["s01_1"]["chunks"][1]["start"]
        for k, at in enumerate([c0 + 0.2 + i * 0.667 for i in range(3)] + [c1 + 0.13 + i * 0.667 for i in range(2)]):
            ma.place(sfx, pop(), at, 0.8, 0.3 + 0.1 * k)
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
    # BGM (owner 2026-11-13「BGMは大きく変えてほしい」): composed cues played with FluidSynth + FluidR3_GM (scripts/bgm.py)
    import bgm
    secs = []
    if "s01_0" in L:
        q = L["s01_3"]["start"] if "s01_3" in L else DUR
        secs += [(0.0, IMPACT, "intro", {}), (IMPACT, q, "groove", {"bright_at": (L["s01_2"]["start"] - IMPACT) if "s01_2" in L else None})]
        if "s02" in sc_at:
            secs.append((q, sc_at["s02"], "question", {}))
    if "s02" in sc_at:
        end = sc_at.get("s03", DUR)
        secs.append((sc_at["s02"], end, "cards", {"hits": tuple(L[k]["start"] - 0.25 - sc_at["s02"] for k in ("s02_1", "s02_2", "s02_3") if k in L)}))
    if "s03" in sc_at:
        secs.append((sc_at["s03"], sc_at.get("s04", DUR), "calm", {}))
    if not secs or secs[-1][1] < DUR - 0.5:
        secs.append((secs[-1][1] if secs else 0.0, DUR, "calm", {}))
    music = bgm.render(secs, DUR, SR)
    tl["bgm"] = [[round(a_, 2), k_] for a_, _, k_, _ in secs]
    (ROOT / "data/timeline_full.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    duck = np.ones(n)
    for l in lines:
        a, b = int((l["start"] - 0.3) * SR), int((l["end"] + 0.3) * SR)
        duck[max(0, a):b] = 0.32
    duck = np.convolve(duck, np.ones(SR // 5) / (SR // 5), "same")
    t_ = np.arange(n) / SR
    fade = np.minimum(1, np.minimum(t_ / 1.0, np.clip((off_at - t_) / 0.15, 0, 1)))
    bed = sfx + music * 0.45 * (duck * fade)[:, None]
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
    # narration polish: low cut, a little presence, gentle compression
    from pedalboard import Pedalboard, HighpassFilter, PeakFilter, Compressor, LowShelfFilter
    vb = Pedalboard([HighpassFilter(75), LowShelfFilter(cutoff_frequency_hz=160, gain_db=1.0), PeakFilter(cutoff_frequency_hz=3200, gain_db=2.5, q=0.9), PeakFilter(cutoff_frequency_hz=7000, gain_db=-1.5, q=1.2), Compressor(threshold_db=-20, ratio=2.5, attack_ms=6, release_ms=120)])
    voice = vb(voice.T.astype(np.float32), SR).T.astype(np.float64)
    mix = voice / max(np.abs(voice).max(), 1e-9) * 0.9 + bedh * 0.9
    mix = mix / max(np.abs(mix).max(), 1e-9) * 0.89
    out = ROOT / "out/full.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes())
    print("wrote", out)


if __name__ == "__main__":
    main()
