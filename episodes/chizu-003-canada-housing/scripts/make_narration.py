"""Narration for chizu-003-canada-housing from 05_script.md (copied from chizu-005 make_narration.py). Free and local.

Voice: VOICEVOX ENGINE 0.26.0 (docker, mirror.gcr.io/voicevox/voicevox_engine:cpu-latest) at 127.0.0.1:50021,
「VOICEVOX:雀松朱司」ノーマル (style 52). Engine terms: commercial and non-commercial use OK with that credit.

Usage: python3 scripts/make_narration.py [--speed 1.05] [--only S01,S02]
Writes audio/scenes/Sxx.wav, audio/narration.wav (48 kHz mono), audio/narration.m4a, audio/timings.json,
audio/readings.md (the engine's katakana reading of every sentence, for the reading check).
"""
import argparse, json, os, re, subprocess, tempfile, urllib.parse, urllib.request, wave
from pathlib import Path
import numpy as np

EP = Path(__file__).resolve().parents[1]
VV, SPEAKER, SR = "http://127.0.0.1:50021", 52, 48000
SENT_GAP = float(os.environ.get("NAR_SENT_GAP", "0.35")); SCENE_GAP = float(os.environ.get("NAR_SCENE_GAP", "0.9"))

# Display text → text for the engine (numbers and words the engine misreads). The script file is not changed.
READ = [
]
READ2 = [
    ("四・二人", "ヨンテンニニン"), ("五・一人", "ごてんいちにん"), ("約六百二十万人", "ヤク、ロッピャクニジュウマンニン"),
    ("約四百六十万ヘクタール", "ヤク、ヨンヒャクロクジュウマンヘクタール"), ("百五十万戸", "ヒャクゴジュウマンコ"), ("ライス湖", "ライスこ"),
]


_D = "〇一二三四五六七八九"


def _kanji_num(n):
    out = ""
    for v, u in ((1000, "千"), (100, "百"), (10, "十")):
        q, n = divmod(n, v)
        if q:
            out += ("" if q == 1 else _D[q]) + u
    return out + (_D[n] if n else "")


def years(t):
    """一六〇九年 → 千六百九年 (digit-by-digit kanji years are read as numbers)."""
    return re.sub(r"([〇一二三四五六七八九]{4})年", lambda m: _kanji_num(int("".join(str(_D.index(c)) for c in m.group(1)))) + "年", t)


def scenes():
    t = (EP / os.environ.get("NAR_SCRIPT", "05_script.md")).read_text()
    out = []
    for m in re.finditer(r"\n## (S\d\d) ([^\n]+)\n([^\n]+)\n", t):
        out.append((m.group(1), m.group(2), m.group(3).strip()))
    return out


def post(path, data=None, ctype=None):
    req = urllib.request.Request(VV + path, data=data, method="POST", headers={"Content-Type": ctype} if ctype else {})
    return urllib.request.urlopen(req, timeout=120).read()


def tts(text, speed):
    q = json.loads(post(f"/audio_query?speaker={SPEAKER}&text={urllib.parse.quote(text)}"))
    q.update({"speedScale": speed, "prePhonemeLength": 0.05, "postPhonemeLength": 0.1, "outputSamplingRate": SR,
              "outputStereo": False, "intonationScale": 1.05})
    wav = post(f"/synthesis?speaker={SPEAKER}", json.dumps(q).encode(), "application/json")
    with tempfile.TemporaryDirectory() as d:
        raw, out = Path(d) / "r.wav", Path(d) / "o.wav"
        raw.write_bytes(wav)
        af = ("silenceremove=start_periods=1:start_threshold=-50dB,areverse,"
              "silenceremove=start_periods=1:start_threshold=-50dB,areverse,highpass=f=60")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", af, "-ar", str(SR), "-ac", "1", str(out)], check=True)
        with wave.open(str(out)) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float64) / 32768
    return x, q["kana"]


def write(p, x):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--speed", type=float, default=1.05)
    ap.add_argument("--only")
    a = ap.parse_args()
    out = EP / os.environ.get("NAR_OUT", "audio"); (out / "scenes").mkdir(parents=True, exist_ok=True)
    timings, readings, full, t0 = [], ["# 読みの確認（エンジンのカタカナ読み）\n"], [], 0.0
    for sid, title, text in scenes():
        if a.only and sid not in a.only.split(","):
            continue
        spoken = text
        for k, v in READ:
            spoken = spoken.replace(k, v)
        spoken = years(spoken)
        for k, v in READ2:
            spoken = spoken.replace(k, v)
        sents = [s + "。" for s in spoken.split("。") if s.strip()]
        disp = [s + "。" for s in text.split("。") if s.strip()]
        parts, st = [], []
        readings.append(f"\n## {sid} {title}\n")
        for i, s in enumerate(sents):
            x, kana = tts(s, a.speed)
            st.append({"text": disp[i] if i < len(disp) else s, "start": round(t0 + sum(len(p) for p in parts) / SR, 3),
                       "end": round(t0 + (sum(len(p) for p in parts) + len(x)) / SR, 3)})
            parts += [x, np.zeros(int(SENT_GAP * SR))]
            readings.append(f"- {disp[i] if i < len(disp) else s}\n  - {kana}\n")
        y = np.concatenate(parts[:-1])
        write(out / "scenes" / f"{sid}.wav", y)
        timings.append({"scene": sid, "title": title, "start": round(t0, 3), "end": round(t0 + len(y) / SR, 3), "sentences": st})
        full += [y, np.zeros(int(SCENE_GAP * SR))]
        t0 += len(y) / SR + SCENE_GAP
        print(f"{sid} {timings[-1]['start']:7.2f}–{timings[-1]['end']:7.2f}  {title}", flush=True)
    if a.only:
        return
    y = np.concatenate(full[:-1]); y = y / max(1e-9, np.abs(y).max()) * 0.89
    write(out / "narration.wav", y)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out / "narration.wav"), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                    "-ar", str(SR), "-c:a", "aac", "-b:a", "96k", str(out / "narration.m4a")], check=True)
    (out / "timings.json").write_text(json.dumps({"voice": "VOICEVOX:雀松朱司", "speed": a.speed, "scenes": timings}, ensure_ascii=False, indent=1))
    (out / "readings.md").write_text("".join(readings))
    print(f"total {t0 - SCENE_GAP:.1f}s")


if __name__ == "__main__":
    main()
