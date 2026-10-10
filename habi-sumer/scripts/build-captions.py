"""台本テキスト(script.txt)からシーン別の字幕データ(Caption型)を生成する。
ナレーション速度は台本どおり 300字/分(=5字/秒)で換算する。"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
CHARS_PER_SEC = 5.0
GAP_MS = 300          # 文と文の間
MIN_MS = 1500
TAIL_MS = 1000        # シーン末尾の余白（トランジション分）

IDS = ["Intro", "JudgeEntrance", "Clue1Rock", "Clue2Words", "Clue3Chrysanthemum",
       "Clue4AI", "Clue5DNA", "RootsStory", "UnsolvedMystery", "Summary", "Closing"]

text = (ROOT / "scripts/script.txt").read_text(encoding="utf-8").splitlines()
scenes = []
for line in text:
    line = line.strip()
    m = re.match(r"^(\d+:\d\d)\s+(.+)$", line)
    if m:
        scenes.append({"time": m.group(1), "title": m.group(2), "lines": []})
    elif scenes and line:
        scenes[-1]["lines"].append(line)

assert len(scenes) == len(IDS), len(scenes)
out = []
srt = []
global_ms = 0
srt_i = 1
for sid, sc in zip(IDS, scenes):
    t = 400
    caps = []
    for l in sc["lines"]:
        n = len(re.sub(r"[「」、。…・\s]", "", l))
        dur = max(MIN_MS, round(n / CHARS_PER_SEC * 1000))
        caps.append({"text": l, "startMs": t, "endMs": t + dur, "timestampMs": None, "confidence": None})
        t += dur + GAP_MS
    total_ms = t + TAIL_MS
    frames = round(total_ms / 1000 * FPS)
    out.append({"id": sid, "time": sc["time"], "title": sc["title"], "durationInFrames": frames, "captions": caps})
    for c in caps:
        def f(ms):
            ms = int(ms); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
            return f"{h:02}:{m:02}:{s:02},{ms:03}"
        srt.append(f"{srt_i}\n{f(global_ms + c['startMs'])} --> {f(global_ms + c['endMs'])}\n{c['text']}\n")
        srt_i += 1
    global_ms += frames / FPS * 1000 - 20 / FPS * 1000  # 20フレームのフェードで重なる

ts = "// scripts/build-captions.py で自動生成。手で編集しないこと。\nimport type {Caption} from '@remotion/captions';\n\n"
for s in out:
    ts += f"// {s['time']} {s['title']}（{s['durationInFrames']}フレーム）\n"
    ts += f"export const {s['id'][0].lower() + s['id'][1:]}Captions: Caption[] = {json.dumps(s['captions'], ensure_ascii=False, indent=2)};\n\n"
(ROOT / "src/data/captions.ts").write_text(ts, encoding="utf-8")
(ROOT / "public/narration.srt").write_text("\n".join(srt), encoding="utf-8")
for s in out:
    print(s["id"], s["durationInFrames"], len(s["captions"]))
print("TOTAL", sum(s["durationInFrames"] for s in out) - 20 * (len(out) - 1))
