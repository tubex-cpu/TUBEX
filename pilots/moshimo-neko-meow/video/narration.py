"""台本（03_script.md）からナレーション音声と全体の時間割（timeline.json）を作る。
VOICEVOX CORE（無料・ローカル）。音声: 玄野武宏 ノーマル（style 11）。クレジット「VOICEVOX:玄野武宏」が必要。
社長指示 2026-11-20「音声はボイスボックスの男性の誰かにして」。
使い方: python narration.py <out_dir>
"""
import json, re, subprocess, sys, wave, tempfile
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent
import os
VER = os.environ.get("NEKO_VER", "v3")
# v5：社長コメント 2026-11-21 を受けた改稿（言い切り・21場面）
SCRIPT = HERE.parent / ("03_script_v5.md" if VER == "v5" else "03_script.md")
if os.environ.get("NEKO_SCRIPT"):  # 別企画の台本（例：心臓が2つ）を同じ仕組みで読む
    SCRIPT = Path(os.environ["NEKO_SCRIPT"])
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/user/work_neko/out")
VV = Path("/home/user/voicevox")
ORT = VV / "dl/voicevox_onnxruntime-linux-x64-1.23.2/lib/libvoicevox_onnxruntime.so.1.23.2"
DIC = VV / "dl/open_jtalk_dic_utf_8-1.11"
VVM = VV / "vvm_repo/vvms/4.vvm"  # 玄野武宏・剣崎雌雄
STYLE = 11  # 玄野武宏 ノーマル
SPEED = 0.9
SR = 48000
_SYN = None
GAP_LINE, GAP_PARA = 0.6, 0.85
# 読み替え（字幕は元の表記のまま）
READ = [("日本時間", "にほんじかん"), ("ボンネットの下", "ボンネットのした"), ("録る人", "とる人"), ("録り直した", "とりなおした"),
        ("同じ行", "おなじぎょう"), ("一声", "ひとこえ"), ("同じ人", "おなじひと"), ("JAF", "ジャフ"), ("SNS", "エスエヌエス"), ("7,000万", "7000万"), ("9,500年", "きゅうせんごひゃくねん"),
        ("1LDK", "ワンエルディーケー"), ("河原", "かわら"), ("一部屋", "ひとへや"), ("十日後", "とおかご"), ("十二日後", "じゅうににちご"),
        ("一言", "ひとこと"), ("言って", "いって"), ("身体中", "からだじゅう"), ("下りきって", "おりきって"), ("日本中", "にほんじゅう"), ("十日後", "とおかご"), ("米の袋", "こめのふくろ"), ("AED", "エーイーディー"), ("100キロカロリー", "ひゃっキロカロリー"), ("子ジカ", "こじか"), ("一頭", "いっとう"), ("十対", "じっつい"), ("五対", "ごつい"), ("6億匹", "ろくおくひき"), ("900万匹", "きゅうひゃくまんびき"), ("60匹", "ろくじゅっぴき"), ("「", ""), ("」", ""), ("…", "")]
# 章ごとの頭の間（秒）：時刻表示や映像だけを見せる
LEAD = {0: 3.2}
LEAD_DEFAULT = 3.0
TAIL_DEFAULT = 2.2


def parse():
    chs, cur = [], None
    for line in SCRIPT.read_text().splitlines():
        m = re.match(r"^## (\d\d) (.*?)（", line)
        m5 = re.match(r"^## SCENE (\d\d)\u3000(.*?)\u3000【(.*?)】", line)
        if m5:
            cur = {"no": int(m5.group(1)) - 1, "title": m5.group(2), "label": m5.group(3), "lines": [], "pause": 0.0}
            chs.append(cur)
            continue
        if m:
            cur = {"no": int(m.group(1)), "title": m.group(2), "lines": []}
            chs.append(cur)
            continue
        if line.startswith("## "):
            cur = None
            continue
        if cur is not None and "【音・間】" in line:
            # v5：「映像の間N秒」を場面の終わりに足す
            cur["pause"] = sum(float(x) for x in re.findall(r"映像の間(\d+(?:\.\d+)?)秒", line))
        if cur is not None and line.startswith(">"):
            t = re.sub(r"［[^］]*］", "", line[1:]).strip()
            cur["lines"].append(t)  # '' = 段落の区切り
    if VER == "v5":
        chs.append({"no": chs[-1]["no"] + 1, "title": "エンドカード", "label": "", "lines": [], "pause": 3.0})
    return chs


def tts(text, dst):
    r = text
    for a, b in READ:
        r = r.replace(a, b)
    global _SYN
    if _SYN is None:
        from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
        _SYN = Synthesizer(Onnxruntime.load_once(filename=str(ORT)), OpenJtalk(str(DIC)))
        with VoiceModelFile.open(str(VVM)) as m:
            _SYN.load_voice_model(m)
    q = _SYN.create_audio_query(r, STYLE)
    q.speed_scale = SPEED
    q.pre_phoneme_length = 0.05
    q.post_phoneme_length = 0.05
    with tempfile.TemporaryDirectory() as tmp:
        w = Path(tmp) / "a.wav"
        w.write_bytes(_SYN.synthesis(q, STYLE))
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
        t += TAIL_DEFAULT + c.get("pause", 0.0)
        label = c["label"] if "label" in c else (c["title"].split(" ― ")[0] if " ― " in c["title"] else "")
        timeline["chapters"].append({"no": c["no"], "title": c["title"], "label": label,
                                     "start": round(start, 3), "end": round(t, 3), "lines": lines})
    timeline["duration"] = round(t + 4.0, 3)  # 最後の余韻
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
