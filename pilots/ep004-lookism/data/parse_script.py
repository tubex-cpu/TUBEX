"""Parses channels/iq-chinou/drafts/ep004-lookism/05_script.md (台本 v1・Googleドキュメントと同じ) into
data/blocks.json: one block per [映像] instruction with the narration lines that follow it."""
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
md = (ROOT / "channels/iq-chinou/drafts/ep004-lookism/05_script.md").read_text(encoding="utf-8")
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
# scene ids stay as in v1 (chapter order before the owner moved 「今、日本で起きていること」 to chapter 2, 2026-11-11)
ORIG = ["オープニング", "あなたで試す", "顔を見ただけで", "先生も", "10分のSNS", "加工するほど", "見られている意識", "ルッキズムは、うつる", "今、日本で起きている", "子どものころ", "「いい見た目」", "今日からできること", "まとめ"]
def rank(t):
    t = t.split(". ", 1)[1]
    return next(i for i, k in enumerate(ORIG) if t.startswith(k))
order = sorted(range(len(blocks)), key=lambda i: (rank(blocks[i]["ch"]), i))
for n, i in enumerate(order):
    blocks[i]["id"] = f"s{n:02d}"
(Path(__file__).parent / "blocks.json").write_text(json.dumps(blocks, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(blocks), "blocks", sum(len(b["lines"]) for b in blocks), "lines", sum(len("".join(b["lines"]).replace(" ", "")) for b in blocks), "chars")
