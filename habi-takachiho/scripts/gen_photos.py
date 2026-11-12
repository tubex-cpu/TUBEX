"""public/photos/credits.json から src/data/photos.ts を作る（高千穂判決）。
  python3 scripts/gen_photos.py
説明（desc）は写真リストを作ったときの表（scripts/photo-desc.json）を使う。"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
cr = json.loads((ROOT / 'public/photos/credits.json').read_text())
desc = json.loads((ROOT / 'scripts/photo-desc.json').read_text())
# 縦長・極端な横長・地図は全体を見せる（contain）。人物の顔がある写真と地図は、テロップを下に置く
CONTAIN = {'kojiki-shinpukuji'}
# 明るい地図は、夜の画面に合うよう色を反転させる
FILTER = {k: 'sepia(0.55) brightness(0.82) contrast(1.1)' for k in ('real-shoki-iwato', 'real-shoki-open-cave', 'real-shoki-descent', 'real-kogo-sakaki', 'real-kogo-uzume', 'real-shoki-sujin', 'real-shoki-suinin', 'real-shoki-regalia', 'real-kogo-chinkon', 'real-shinki-sword-account')}
FACE = {'yk-shiiba', 'art-sarutahiko', 'gen-uzume-kagura', 'gen-kagura-future', 'gen-two-queens', 'gen-eclipse-calc', 'gen-kagura-dawn', 'gen-iwato-open', 'tj-carving', 'gen-kagura-children', 'real-shiratori-portrait', 'gen-ancient-eclipse', 'gen-ninigi-descent', 'yk-masks-shelf', 'gen-kagura-yado', 'iwato-tajikarao', 'yk-masked-actor', 'yk-iki', 'gen-rice-seeds', 'gen-higashi-hongu', 'iwato-uzume', 'yk-mask-kami-pair', 'art-uzume-rooster', 'gen-takamagahara', 'art-uzume-hokkei', 'yk-harunobu', 'yk-giant-uzume', 'yk-yutate', 'yk-ema', 'art-toyokuni-w', 'kunimi-ninigi', 'gen-iwato-cave', 'art-okame', 'gen-todori', 'gen-yohaisho', 'gen-uzume-dance', 'yk-1914', 'yk-iwami-orochi', 'yk-mask-demon', 'art-toshimasa', 'art-mikagura', 'yk-giant-tajikarao', 'gen-yokagura-night', 'gen-amanoyasu', 'yk-mask-oldwoman', 'yk-iwami-smoke', 'yk-iwami-shrine', 'art-tenson', 'real-iwato-loc', 'art-kunisada-w', 'yk-daidai', 'gen-himiko', 'gen-kagura-33', 'gen-sun-hidden', 'yk-tsunoyama', 'real-kagura-2023', 'art-tajikarao-hokkei'}
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
