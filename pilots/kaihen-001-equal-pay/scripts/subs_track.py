"""Writes out/subtrack/00000.png ... (one symlink per video frame -> the subtitle PNG shown on that frame, or blank).
Frame-exact: an earlier ffmpeg concat list (one entry per line with a duration) drifted ~3 s late by the end of the video."""
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
N = round(tl["duration"] * F) + 1
show = [blank] * N
for i, c in enumerate(ch):
    s = max(0.0, c["start"] - 0.05)
    nxt = ch[i + 1]["start"] - 0.03 if i + 1 < len(ch) else 1e9
    e = min(c["end"] + 0.25, nxt)
    for k in range(round(s * F), min(N, round(e * F))):
        show[k] = R / f"out/subs/s{i:04d}.png"
out = R / "out/subtrack"
out.mkdir(exist_ok=True)
for f in out.glob("*.png"):
    f.unlink()
for k, p in enumerate(show):
    (out / f"{k:05d}.png").symlink_to(p)
print("frames", N, "with text", sum(1 for p in show if p != blank))
