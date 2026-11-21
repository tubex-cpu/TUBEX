"""v2.3 narration: keep S01–S17 of the approved narration sample-for-sample, re-voice only S18 (channel name).
Reads audio/narration.wav + audio/timings.json (v2), writes audio_v2_3/narration.wav, narration.m4a, timings.json, readings_S18.md.
Same voice/settings as make_narration.py (VOICEVOX:雀松朱司, speed from timings.json)."""
import json, re, subprocess, wave, sys
from pathlib import Path
import numpy as np
EP = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(EP / "scripts"))
import make_narration as M

src = json.loads((EP / "audio/timings.json").read_text())
speed = src["speed"]
with wave.open(str(EP / "audio/narration.wav")) as w:
    old = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float64) / 32768
raw17 = M.read_wav(EP / "audio/scenes/S17.wav") if hasattr(M, "read_wav") else None
with wave.open(str(EP / "audio/scenes/S17.wav")) as w:
    raw17 = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float64) / 32768
s17 = [s for s in src["scenes"] if s["scene"] == "S17"][0]
seg = old[int(round(s17["start"] * M.SR)): int(round(s17["start"] * M.SR)) + len(raw17)]
gain = float(np.dot(seg, raw17) / np.dot(raw17, raw17))          # gain the v2 mix applied to the scene wavs

text = re.search(r"\n## S18 [^\n]+\n([^\n]+)\n", (EP / "05_script_v2_3.md").read_text()).group(1).strip()
spoken = text
for k, v in M.READ:
    spoken = spoken.replace(k, v)
sents = [s + "。" for s in spoken.split("。") if s.strip()]
disp = [s + "。" for s in text.split("。") if s.strip()]
s18 = [s for s in src["scenes"] if s["scene"] == "S18"][0]
t0 = s18["start"]
parts, st, kanas = [], [], []
for i, s in enumerate(sents):
    x, kana = M.tts(s, speed)
    a = t0 + sum(len(p) for p in parts) / M.SR
    st.append({"text": disp[i], "start": round(a, 3), "end": round(a + len(x) / M.SR, 3)})
    parts += [x, np.zeros(int(M.SENT_GAP * M.SR))]
    kanas.append(f"- {disp[i]}\n  - {kana}\n")
y18 = np.concatenate(parts[:-1]) * gain
new = np.concatenate([old[: int(round(t0 * M.SR))], y18])
out = EP / "audio_v2_3"; out.mkdir(exist_ok=True)
M.write(out / "narration.wav", np.clip(new, -1, 1))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out / "narration.wav"), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                "-ar", str(M.SR), "-c:a", "aac", "-b:a", "96k", str(out / "narration.m4a")], check=True)
s18n = dict(s18); s18n["sentences"] = st; s18n["end"] = round(t0 + len(y18) / M.SR, 3)
tim = dict(src); tim["scenes"] = [s if s["scene"] != "S18" else s18n for s in src["scenes"]]
tim["note"] = "v2.3: S01–S17 are the v2 narration unchanged; S18 re-voiced for the channel name 地球の事情"
(out / "timings.json").write_text(json.dumps(tim, ensure_ascii=False, indent=1))
(out / "readings_S18.md").write_text("# S18 読みの確認（v2.3）\n\n" + "".join(kanas))
same = np.array_equal(np.round(new[: int(round(t0 * M.SR))] * 32767), np.round(old[: int(round(t0 * M.SR))] * 32767))
print("gain", round(gain, 4), "S01–S17 identical:", same, "S18", st, "end", s18n["end"], "old end", s18["end"])
