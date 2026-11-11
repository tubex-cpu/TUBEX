"""public/photos/credits.json から src/data/photos.ts を作る（伊勢判決）。
  python3 scripts/gen_photos.py
説明（desc）は写真リストを作ったときの表（scripts/photo-desc.json）を使う。"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
cr = json.loads((ROOT / 'public/photos/credits.json').read_text())
desc = json.loads((ROOT / 'scripts/photo-desc.json').read_text())
# 縦長・極端な横長・地図は全体を見せる（contain）。人物の顔がある写真と地図は、テロップを下に置く
CONTAIN = {'mirror-hirabaru-drawing', 'shinpo-tachi'}
# 明るい地図は、夜の画面に合うよう色を反転させる
FILTER = {}
FACE = {'kenji-2019', 'iwato-kunisada-w', 'antoku-portrait', 'genpei-byobu-w', 'amaterasu-kyosai', 'orochi-chikanobu-w', 'takeru-gekko', 'takeru-yoshitoshi', 'iwato-toshimasa-w', 'orochi-yoshitoshi-w', 'antoku-engi', 'dannoura-sadahide-w', 'sengyo-kuniyoshi', 'tenson-korin', 'meiji-kami-w', 'enthronement-2019'}
lines = []
for pid, c in cr.items():
    w, h = c.get('size', [1, 1])
    d = desc.get(pid) or desc.get(re.sub(r'-w$', '', pid)) or c['title']
    lic = c['license'] or 'ライセンス不明'
    artist = re.sub(r'\s+', ' ', c['artist'])[:60]
    credit = f"{d} {artist} / {lic} / Wikimedia Commons".replace("'", '’')
    extra = ''
    if pid in CONTAIN or h > w * 1.05:
        extra += ", fit: 'contain'"
    if pid in FILTER:
        extra += f", filter: '{FILTER[pid]}'"
    if pid in FACE:
        extra += ', labelBottom: true'
    lines.append(f"\t'{pid}': {{file: '{c['file']}', credit: '{credit}'{extra}}},")
ts = '''// 写真の一覧（scripts/gen_photos.py が credits.json から作る）
export type PhotoInfo = {
	readonly file: string;
	readonly credit: string;
	readonly position?: string;
	readonly fit?: 'cover' | 'contain';
	// 人物の顔が上にある写真は、テロップを下に置く
	readonly labelBottom?: boolean;
	// 色の調整（明るい地図を夜の色にするなど）
	readonly filter?: string;
};

export const photos: Record<string, PhotoInfo> = {
''' + '\n'.join(lines) + '\n};\n'
(ROOT / 'src/data/photos.ts').write_text(ts)
print(len(lines))
