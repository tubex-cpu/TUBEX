"""Render only the first N chunks (10 s each) of the 3D edit, e.g. for an opening sample. Usage: sample.py <ca|bm> <i> <m> <N>"""
import sys
key, i, m, n = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
sys.argv = [sys.argv[0], key]
sys.path.insert(0, __file__.rsplit("/", 1)[0])
import comp3d as C
for c in range(i, n, m):
    dst = C.OUT / f"c_{c:03d}.mp4"
    if dst.exists():
        continue
    tmp = C.OUT / f"c_{c:03d}.tmp.mp4"
    C.render(int(round(c * 10 * C.FPS)), int(round(min(C.TOTAL, (c + 1) * 10) * C.FPS)), tmp)
    tmp.rename(dst)
    print(key, "chunk", c, flush=True)
