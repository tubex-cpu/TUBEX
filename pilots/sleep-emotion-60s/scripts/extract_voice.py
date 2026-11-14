"""Re-create voice/tohoku-f01-neutral.htsvoice from the npm package @nmemonica/voice-ja@0.1.14.

The package ships the four tohoku-f01 HTS voices (CC BY 4.0, Tohoku University) inside a wasm file.
wasm data segments omit zero runs, so linear memory is rebuilt from the data section first.
Usage: npm pack @nmemonica/voice-ja@0.1.14 && tar xzf nmemonica-voice-ja-0.1.14.tgz
       python3 -I scripts/extract_voice.py package/voice_ja_bg.wasm voice/
Order inside the wasm (verified by pitch statistics): 0 angry, 1 happy, 2 neutral, 3 sad.
"""
import re, sys
from pathlib import Path


def leb(b, i, signed=False):
    r = s = 0
    while True:
        x = b[i]; i += 1; r |= (x & 0x7f) << s; s += 7
        if x < 0x80:
            if signed and x & 0x40:
                r -= 1 << s
            return r, i


d = Path(sys.argv[1]).read_bytes()
out = Path(sys.argv[2]); out.mkdir(exist_ok=True)
i, mem = 8, bytearray()
while i < len(d):
    sid = d[i]; i += 1
    size, i = leb(d, i); end = i + size
    if sid == 11:
        n, i = leb(d, i)
        for _ in range(n):
            flag, i = leb(d, i); assert flag == 0 and d[i] == 0x41; i += 1
            off, i = leb(d, i, True); assert d[i] == 0x0b; i += 1
            ln, i = leb(d, i)
            if len(mem) < off + ln:
                mem.extend(b"\0" * (off + ln - len(mem)))
            mem[off:off + ln] = d[i:i + ln]; i += ln
    i = end
names = ["angry", "happy", "neutral", "sad"]
for k, s in enumerate(m.start() for m in re.finditer(rb"\[GLOBAL\]\nHTS", mem)):
    di = mem.find(b"[DATA]", s) + 7
    ends = [int(b) for _, b in re.findall(r"(\d+)-(\d+)", mem[s:di].decode().split("[POSITION]")[1])]
    (out / f"tohoku-f01-{names[k]}.htsvoice").write_bytes(mem[s:di + max(ends) + 1])
    print("wrote", names[k])
