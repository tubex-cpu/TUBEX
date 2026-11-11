"""Parses channels/iq-chinou/drafts/ep006-sins/05_script.md (台本 v1.3) into
data/blocks.json: one block per [映像] instruction with the narration lines that follow it."""
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
md = (ROOT / "channels/iq-chinou/drafts/ep006-sins/05_script.md").read_text(encoding="utf-8")
body = md[md.index("## 0."):md.index("## 制作メモ")]
blocks, ch = [], None
mode = None
for raw in body.split("\n"):
    l = raw.strip()
    if not l or l == "---":
        continue
    if l.startswith("## "):
        ch = l[3:]
        mode = None
        continue
    if l.startswith("出典"):
        if blocks: blocks[-1]["src"] = l
        continue
    if l.startswith("[映像]"):
        blocks.append({"ch": ch, "vis": l[4:].strip(), "lines": [], "cards": []})
        mode = "vis"
        continue
    if l.startswith("[ナレーション]"):
        mode = "nar"
        rest = l[len("[ナレーション]"):].strip()
        if rest: blocks[-1]["lines"].append(rest)
        continue
    if l.startswith("- ") and mode == "vis":
        blocks[-1]["cards"].append(l[2:])
        continue
    if mode == "nar" or mode == "vis":
        if not blocks:
            continue
        blocks[-1]["lines"].append(l)
        mode = "nar"
# 台本 v1.3 で1章（あなたで試す・3ブロック）を削除。場面のIDは v1.2 と同じに保つため s03〜s05 を欠番にする
for i, b in enumerate(blocks):
    n = i if b["ch"].startswith("0.") else i + 3
    b["id"] = f"s{n:02d}"
(Path(__file__).parent / "blocks.json").write_text(json.dumps(blocks, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(blocks), "blocks", sum(len(b["lines"]) for b in blocks), "lines", sum(len("".join(b["lines"]).replace(" ", "")) for b in blocks), "chars")
