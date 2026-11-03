"""Writes out/subs/track.txt (ffmpeg concat list): each subtitle PNG for exactly its spoken time, blank in between."""
import json, struct, zlib
from pathlib import Path
R = Path(__file__).resolve().parents[1]
tl = json.loads((R / "data/timeline_full.json").read_text())
ch = [c for l in tl["lines"] for c in l["chunks"]]
blank = R / "out/subs/blank.png"
def png(path, w, h):
    raw = b"".join(b"\x00" + b"\x00\x00\x00\x00" * w for _ in range(h))
    def chunk(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    path.write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))
png(blank, 1920, 1080)
F = 30
q = lambda s: round(s * F) / F
items, t = [], 0.0
for i, c in enumerate(ch):
    s = q(max(0.0, c["start"] - 0.05))
    nxt = ch[i + 1]["start"] - 0.03 if i + 1 < len(ch) else 1e9
    e = q(min(c["end"] + 0.25, nxt))
    if s > t:
        items.append((blank, s - t))
    items.append((R / f"out/subs/s{i:04d}.png", e - s))
    t = e
items.append((blank, max(0.1, tl["duration"] - t)))
with open(R / "out/subs/track.txt", "w") as f:
    for p, d in items:
        f.write(f"file '{p}'\nduration {d:.4f}\n")
    f.write(f"file '{blank}'\n")
print("items", len(items))
