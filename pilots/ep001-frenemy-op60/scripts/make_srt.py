"""Write docs/subtitles.srt from data/timings.json (same timing rule as src/ui/Overlay.tsx)."""
import json
from pathlib import Path
R = Path(__file__).resolve().parents[1]
t = json.loads((R / "data/timings.json").read_text())
ts = lambda s: f"{int(s//3600):02}:{int(s%3600//60):02}:{int(s%60):02},{int(round(s%1*1000)):03}"
out = []
for i, x in enumerate(t):
    end = min(x["end"] + 0.35, t[i + 1]["start"] - 0.05) if i + 1 < len(t) else x["end"] + 0.35
    out.append(f"{i+1}\n{ts(max(0, x['start'] - 0.08))} --> {ts(end)}\n{x['sub']}\n")
(R / "docs/subtitles.srt").write_text("\n".join(out), encoding="utf-8")
print("ok", len(out))
