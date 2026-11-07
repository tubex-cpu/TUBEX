"""Make contact sheets of competitor thumbnails so Claude can inspect many at once (no API, no cost).

Usage:
  python3 pipeline/scripts/thumb_sheet.py <thumbs-dir> [--out DIR] [--cols 4] [--per-sheet 12]

<thumbs-dir> is the folder written by `yt_research.py --thumbs-dir` (files named <views>_<videoId>.jpg),
or any folder of screenshots / images. Both the input and the output must be OUTSIDE the repository
(competitor images are never committed).

Writes, sorted by views (largest first):
  sheet_full_01.png ... : each thumbnail at 480x270 with a number and view count, for detailed analysis
  sheet_320_01.png  ... : the same thumbnails at 320x180 (YouTube smartphone size), for the glance test
  index.tsv             : number / views / videoId / file, to match the sheet numbers to the yt_research.py table
"""
import argparse
import os
import re
import sys

from PIL import Image, ImageDraw, ImageFont

EXTS = (".jpg", ".jpeg", ".png", ".webp")
FONT_CANDIDATES = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def font(size: int):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def outside_repo(path: str) -> bool:
    repo = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    p = os.path.abspath(path)
    return not (p == repo or p.startswith(repo + os.sep))


def parse(name: str) -> tuple[int | None, str]:
    m = re.match(r"^(\d+)_([\w-]{11})\.", name)
    return (int(m.group(1)), m.group(2)) if m else (None, "")


def sheet(items, w, h, cols, label_size, path):
    rows = (len(items) + cols - 1) // cols
    pad, bar = 8, label_size + 8
    img = Image.new("RGB", (cols * (w + pad) + pad, rows * (h + bar + pad) + pad), (24, 24, 24))
    draw, f = ImageDraw.Draw(img), font(label_size)
    for i, (num, views, _vid, src) in enumerate(items):
        x = pad + (i % cols) * (w + pad)
        y = pad + (i // cols) * (h + bar + pad)
        with Image.open(src) as t:
            img.paste(t.convert("RGB").resize((w, h), Image.LANCZOS), (x, y + bar))
        label = f"#{num}  {views:,} views" if views is not None else f"#{num}"
        draw.text((x + 2, y + 2), label, fill=(255, 255, 255), font=f)
    img.save(path)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("thumbs_dir")
    ap.add_argument("--out", help="output folder (default: <thumbs-dir>/_sheets)")
    ap.add_argument("--cols", type=int, default=4)
    ap.add_argument("--per-sheet", type=int, default=12)
    args = ap.parse_args()
    out = args.out or os.path.join(args.thumbs_dir, "_sheets")
    if not (outside_repo(args.thumbs_dir) and outside_repo(out)):
        sys.exit("入力・出力ともリポジトリの外を指定してください（競合画像はコミットしない）")
    files = [f for f in os.listdir(args.thumbs_dir) if f.lower().endswith(EXTS)]
    if not files:
        sys.exit(f"画像がありません: {args.thumbs_dir}")
    parsed = [(parse(f), f) for f in files]
    parsed.sort(key=lambda x: (x[0][0] is None, -(x[0][0] or 0), x[1]))
    items = [(n + 1, v, vid, os.path.join(args.thumbs_dir, f)) for n, ((v, vid), f) in enumerate(parsed)]

    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, "index.tsv"), "w", encoding="utf-8") as fp:
        fp.write("no\tviews\tvideoId\tfile\n")
        for num, v, vid, src in items:
            fp.write(f"{num}\t{'' if v is None else v}\t{vid}\t{os.path.basename(src)}\n")
    for s in range(0, len(items), args.per_sheet):
        chunk, k = items[s:s + args.per_sheet], s // args.per_sheet + 1
        sheet(chunk, 480, 270, args.cols, 22, os.path.join(out, f"sheet_full_{k:02d}.png"))
        sheet(chunk, 320, 180, args.cols, 16, os.path.join(out, f"sheet_320_{k:02d}.png"))
    print(f"{len(items)}枚 → {out}（sheet_full_*.png / sheet_320_*.png / index.tsv）")


if __name__ == "__main__":
    main()
