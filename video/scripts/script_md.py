"""Write episodes/<id>/05_script.md (readable script) from script.json.

Usage: python3 video/scripts/script_md.py <episode-id>
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LAB = {"title": "タイトル", "duo": "2人", "fact": "研究", "summary": "まとめ", "outro": "締め"}


def main() -> None:
    ep = ROOT / "episodes" / sys.argv[1]
    d = json.loads((ep / "script.json").read_text(encoding="utf-8"))
    out = [f"# 05 台本（script.json から生成）", "", f"**タイトル**：{d['title']}", ""]
    t, ch = 0.0, None
    for s in d["scenes"]:
        if s.get("chapter") != ch:
            ch = s.get("chapter")
            out += [f"## {int(t // 60)}:{int(t % 60):02d} {ch}", ""]
        bn = f"（{s['bigNumber']}）" if s.get("bigNumber") else ""
        out.append(f"- **【{LAB.get(s.get('layout'), '')}】{s['headline'].replace(chr(10), '　')}{bn}**（`{s['id']}` / {s['seconds']}秒）")
        out.append(f"  - {s['narration']}")
        if s.get("source"):
            out.append(f"  - 出典：{s['source']}")
        t += s["seconds"]
    out += ["", f"全{len(d['scenes'])}場面・ナレーション{sum(len(s['narration']) for s in d['scenes'])}字・{int(t // 60)}:{int(t % 60):02d}", ""]
    (ep / "05_script.md").write_text("\n".join(out), encoding="utf-8")


if __name__ == "__main__":
    main()
