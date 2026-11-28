#!/bin/bash
# 試し描画：bash test_cuts.sh <cut> [<cut> ...]  → 640x360 で 3 コマずつ描き、$NEKO_OUT/test/sheet_<名前>.png に並べる
export NEKO_VER=v5
export NEKO_OUT=${NEKO_OUT:-/home/user/work_neko/out_nankai}
export NEKO_PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)
export NEKO_SHOTS=shots_nankai NEKO_TELOPS=telops_nankai
V=/home/user/TUBEX/pilots/moshimo-neko-meow/video
PY=/home/user/work_neko/venv/bin/python
cd $V; mkdir -p $NEKO_OUT/test $NEKO_OUT/logs
SHEET=${SHEET:-sheet}
printf '%s\n' "$@" | xargs -P ${JOBS:-3} -I{} bash -c "$PY render_shot.py {} --test --res 640 360 > $NEKO_OUT/logs/test_{}.log 2>&1 || echo FAIL {}"
$PY - "$NEKO_OUT" "$SHEET" "$@" <<'PYEOF'
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, sheet, cuts = sys.argv[1], sys.argv[2], sys.argv[3:]
W, H = 320, 180
im = Image.new('RGB', (W * 3 + 160, H * len(cuts)), (30, 30, 30)); d = ImageDraw.Draw(im)
for r, c in enumerate(cuts):
    d.text((4, r * H + 4), c, fill=(255, 255, 255))
    for k in range(3):
        p = f'{out}/test/{c}_{k}.png'
        if os.path.exists(p):
            im.paste(Image.open(p).convert('RGB').resize((W, H)), (160 + k * W, r * H))
im.save(f'{out}/test/{sheet}.png'); print(f'{out}/test/{sheet}.png')
PYEOF
