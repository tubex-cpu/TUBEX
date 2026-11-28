"""Parses channels/iq-chinou/drafts/ep006-sins/05_script.md (台本 v1.5) into
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
# 場面のIDは v1.2 と同じに保つ（v1.3 で旧1章を削除し s03〜s05 は欠番。v1.5 で章の並びをサムネの順に変えたため、
# IDは並び順ではなく章の中身（見出しの語）で決める）
BASE = {"オープニング": 0, "1,600年前": 6, "暴食": 10, "色欲": 16, "強欲": 20, "悲嘆": 25, "憤怒": 30, "怠惰": 35, "虚栄": 41, "傲慢": 45, "八つの考えに負けない": 50, "まとめ": 54}
seen = {}
for b in blocks:
    key = [k for k in BASE if b["ch"].split(".", 1)[1].strip().startswith(k)]
    assert len(key) == 1, b["ch"]
    k = seen.get(key[0], 0); seen[key[0]] = k + 1
    b["id"] = f"s{BASE[key[0]] + k:02d}"
(Path(__file__).parent / "blocks.json").write_text(json.dumps(blocks, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(blocks), "blocks", sum(len(b["lines"]) for b in blocks), "lines", sum(len("".join(b["lines"]).replace(" ", "")) for b in blocks), "chars")
