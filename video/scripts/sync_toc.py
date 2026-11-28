"""Sync the chapter timestamps in episodes/<id>/07_description.md with script.json.

Usage: python3 video/scripts/sync_toc.py <episode-id>
Run after make_audio.py (which sets each scene's real seconds). A table-of-contents line looks like
"1:17 7:00 朝ごはん…" or "3:04 10歳：…": the time is replaced by the start of the first scene whose
`chapter` equals the word right after the time.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def main() -> None:
    ep = ROOT / "episodes" / sys.argv[1]
    data = json.loads((ep / "script.json").read_text(encoding="utf-8"))
    starts: dict[str, float] = {}
    t = 0.0
    for scene in data["scenes"]:
        ch = scene.get("chapter")
        if ch and ch not in starts:
            starts[ch] = t
        t += scene["seconds"]
    desc = ep / "07_description.md"
    lines = desc.read_text(encoding="utf-8").splitlines()
    pat = re.compile(r"^(\d{1,2}:\d{2}) (\S+?)(?=[：\s]|$)")
    for i, line in enumerate(lines):
        m = pat.match(line)
        if not m:
            continue
        ch = m.group(2)
        if ch not in starts:
            continue
        s = starts[ch]
        lines[i] = f"{int(s // 60)}:{int(s % 60):02d}" + line[len(m.group(1)):]
        print(lines[i])
    desc.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"total {int(t // 60)}:{int(t % 60):02d}")


if __name__ == "__main__":
    main()
