"""台本（03_script.md）からナレーション音声と全体の時間割（timeline.json）を作る。
Open JTalk（無料・ローカル）。音声: nitech_jp_atr503_m001（CC BY 3.0, 名古屋工業大学）。
使い方: python narration.py <out_dir>
"""
import json, re, subprocess, sys, wave, tempfile
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent
SCRIPT = HERE.parent / "03_script.md"
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/user/work_neko/out")
DIC = "/var/lib/mecab/dic/open-jtalk/naist-jdic"
VOICE = "/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice"
SR = 48000
RATE = "0.97"
GAP_LINE, GAP_PARA = 0.45, 0.85
# 読み替え（字幕は元の表記のまま）
READ = [("JAF", "ジャフ"), ("SNS", "エスエヌエス"), ("7,000万", "7000万"), ("9,500年", "きゅうせんごひゃくねん"),
        ("1LDK", "ワンエルディーケー"), ("「", ""), ("」", ""), ("…", "")]
# 章ごとの頭の間（秒）：時刻表示や映像だけを見せる
LEAD = {0: 3.2}
LEAD_DEFAULT = 3.0
TAIL_DEFAULT = 2.2


def parse():
    chs, cur = [], None
    for line in SCRIPT.read_text().splitlines():
        m = re.match(r"^## (\d\d) (.*?)（", line)
        if m:
            cur = {"no": int(m.group(1)), "title": m.group(2), "lines": []}
            chs.append(cur)
            continue
        if line.startswith("## "):
            cur = None
            continue
        if cur is not None and line.startswith(">"):
            t = re.sub(r"［[^］]*］", "", line[1:]).strip()
            cur["lines"].append(t)  # '' = 段落の区切り
    return chs


def tts(text, dst):
    r = text
    for a, b in READ:
        r = r.replace(a, b)
    with tempfile.TemporaryDirectory() as tmp:
        w = Path(tmp) / "a.wav"
        subprocess.run(["open_jtalk", "-x", DIC, "-m", VOICE, "-r", RATE, "-ow", str(w)], input=r, text=True, check=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(w), "-ar", str(SR), "-ac", "1", str(dst)], check=True)
    with wave.open(str(dst)) as f:
        return f.getnframes() / SR


def main():
    (OUT / "nar").mkdir(parents=True, exist_ok=True)
    chs = parse()
    t = 0.0
    timeline = {"sr": SR, "chapters": []}
    for c in chs:
        start = t
        t += LEAD.get(c["no"], LEAD_DEFAULT)
        lines = []
        pend = 0.0
        for i, s in enumerate(c["lines"]):
            if s == "":
                pend = GAP_PARA
                continue
            t += pend
            wav = OUT / "nar" / f"{c['no']:02d}_{i:02d}.wav"
            d = tts(s, wav)
            lines.append({"text": s, "start": round(t, 3), "end": round(t + d, 3), "wav": str(wav)})
            t += d
            pend = GAP_LINE
        t += TAIL_DEFAULT
        label = c["title"].split(" ― ")[0] if " ― " in c["title"] else ""
        timeline["chapters"].append({"no": c["no"], "title": c["title"], "label": label,
                                     "start": round(start, 3), "end": round(t, 3), "lines": lines})
    timeline["duration"] = round(t + 10.0, 3)  # エンドカード10秒
    # ナレーションを1本に
    n = int(timeline["duration"] * SR) + SR
    mix = np.zeros(n, np.float32)
    for c in timeline["chapters"]:
        for l in c["lines"]:
            with wave.open(l["wav"]) as f:
                a = np.frombuffer(f.readframes(f.getnframes()), "<i2").astype(np.float32) / 32768
            s = int(l["start"] * SR)
            mix[s:s + len(a)] += a
    pk = np.abs(mix).max() or 1
    mix = mix / pk * 0.89
    with wave.open(str(OUT / "narration.wav"), "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((mix * 32767).astype("<i2").tobytes())
    (OUT / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1))
    print("duration", timeline["duration"], "lines", sum(len(c["lines"]) for c in timeline["chapters"]))
    for c in timeline["chapters"]:
        print(f"{c['no']:02d} {c['start']:7.1f}-{c['end']:7.1f} {c['end']-c['start']:5.1f}s {c['title']}")


if __name__ == "__main__":
    main()
