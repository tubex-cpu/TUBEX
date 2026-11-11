"""実際の標高データから、地図の下絵（陰影つきの地形図）を作る。
データ：Mapzen Terrain Tiles（AWS Open Data。SRTM・GMTED・ETOPO1 などから作られた標高）。リポジトリの外（~/.cache/habi-terrain）に置く。
図法はウェブメルカトル。出力：public/maps/<名前>.jpg（2560×1440）と src/data/reliefViews.ts（各地図の範囲）。
  python3 scripts/gen_relief.py            # すべて
  python3 scripts/gen_relief.py izumo      # 1枚だけ
"""
import io, math, sys, urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path.home() / '.cache/habi-terrain'
CACHE.mkdir(parents=True, exist_ok=True)
URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
OUT_W, OUT_H = 2560, 1440
# 名前: (中心の経度, 中心の緯度, 横に映す経度の幅, タイルのズーム)
VIEWS = {
	'kinki': (136.3, 34.95, 3.6, 9),
	'honshu': (135.4, 34.9, 11.0, 7),
}
ONLY = set(sys.argv[1:])
# 海より高い湖：(経度, 緯度, 湖面の標高m)
LAKES = [(136.08, 35.25, 81.5)]


def merc_y(lat):
	return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def inv_merc(y):
	return math.degrees(2 * math.atan(math.exp(y)) - math.pi / 2)


def extent(v):
	lon, lat, wdeg = VIEWS[v][:3]
	lon0, lon1 = lon - wdeg / 2, lon + wdeg / 2
	hy = math.radians(wdeg) * OUT_H / OUT_W / 2
	y0 = merc_y(lat)
	return lon0, lon1, inv_merc(y0 + hy), inv_merc(y0 - hy)


def tile(z, x, y):
	p = CACHE / f'{z}-{x}-{y}.png'
	if not p.exists():
		p.write_bytes(urllib.request.urlopen(URL.format(z=z, x=x, y=y), timeout=60).read())
	a = np.asarray(Image.open(p).convert('RGB'), np.float32)
	return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768


def gx(lon, z):
	return (lon + 180) / 360 * 2 ** z * 256


def gy(lat, z):
	return (1 - merc_y(lat) / math.pi) / 2 * 2 ** z * 256


def hexrgb(h):
	return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32)


def render(v):
	lon0, lon1, lat0, lat1 = extent(v)
	z = VIEWS[v][3]
	x0, x1, y0, y1 = gx(lon0, z), gx(lon1, z), gy(lat0, z), gy(lat1, z)
	tx0, tx1, ty0, ty1 = int(x0 // 256), int(x1 // 256), int(y0 // 256), int(y1 // 256)
	rows = []
	for ty in range(ty0, ty1 + 1):
		rows.append(np.concatenate([tile(z, tx, ty) for tx in range(tx0, tx1 + 1)], 1))
	dem = np.concatenate(rows, 0)
	crop = dem[int(y0 - ty0 * 256):int(y1 - ty0 * 256), int(x0 - tx0 * 256):int(x1 - tx0 * 256)]
	e = np.asarray(Image.fromarray(crop).resize((OUT_W, OUT_H), Image.BICUBIC), np.float32)
	# 1ピクセルあたりの距離（m）で傾きを出して陰影をつける
	mpp = (lon1 - lon0) / OUT_W * 111320 * math.cos(math.radians((lat0 + lat1) / 2))
	ex = 1.6 if VIEWS[v][2] > 3 else (0.5 if VIEWS[v][2] < 0.3 else 0.9)
	dzdx = np.gradient(e, axis=1) / mpp * ex
	dzdy = np.gradient(e, axis=0) / mpp * ex
	slope = np.arctan(np.hypot(dzdx, dzdy))
	aspect = np.arctan2(-dzdx, dzdy)
	az, alt = math.radians(315), math.radians(42)
	hs = np.clip(math.sin(alt) * np.cos(slope) + math.cos(alt) * np.sin(slope) * np.cos(az - aspect), 0, 1)
	# 水面：標高1m以下。標高データのむら（湖の中の点状の陸、低い田んぼの小さな水たまり）は、小さなかたまりを消して整える
	water = np.asarray(Image.fromarray(((e <= 1.0) * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5))) > 127
	small = OUT_W * OUT_H * 0.0008
	lab, n = ndimage.label(water)
	size = ndimage.sum(water, lab, range(1, n + 1))
	water &= np.isin(lab, np.nonzero(size >= small)[0] + 1)
	if VIEWS[v][2] < 0.2:
		# 狭い範囲の地図では、画面の端につながる海だけを水面にする（低い田んぼを湖と見まちがえないため）
		edge_ids = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
		water &= np.isin(lab, list(edge_ids))
	# 海より高い湖（琵琶湖など）：湖面の標高に近い、種の点につながる範囲を水面にする
	for (llon, llat, h) in LAKES:
		if not (lon0 < llon < lon1 and lat1 < llat < lat0):
			continue
		sx = int((llon - lon0) / (lon1 - lon0) * OUT_W)
		sy = int((merc_y(lat0) - merc_y(llat)) / (merc_y(lat0) - merc_y(lat1)) * OUT_H)
		band = np.abs(e - h) <= 2.0
		band = np.asarray(Image.fromarray((band * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5))) > 127
		lb, _ = ndimage.label(band)
		if lb[sy, sx]:
			water |= lb == lb[sy, sx]
	lab, n = ndimage.label(~water)
	size = ndimage.sum(~water, lab, range(1, n + 1))
	water |= np.isin(lab, np.nonzero(size < small * 0.25)[0] + 1)
	wm = np.asarray(Image.fromarray((water * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0)), np.float32) / 255
	# 陸：低地はくすんだ緑、山は土色から明るい灰へ
	stops = [(0, '#2f3b26'), (60, '#3b4630'), (250, '#4d4a33'), (700, '#625a43'), (1300, '#7a7466'), (2500, '#9a968e'), (4200, '#b4afa5'), (5600, '#e4e2dc')]
	land = np.zeros(e.shape + (3,), np.float32)
	el = np.clip(e - (VIEWS[v][4] if len(VIEWS[v]) > 4 else 0), 0, None)
	for (a, ca), (b, cb) in zip(stops, stops[1:]):
		m = (el >= a) & (el < b)
		f = ((el - a) / (b - a))[m][:, None]
		land[m] = hexrgb(ca) * (1 - f) + hexrgb(cb) * f
	land[el >= stops[-1][0]] = hexrgb(stops[-1][1])
	land *= (0.45 + 0.85 * hs)[..., None]
	# 海・湖：浅いところは明るい青緑、深いところは夜の藍
	d = np.clip(-e, 0, 4000)
	t = (np.log1p(d) / np.log1p(4000))[..., None]
	sea = hexrgb('#2c6c80') * (1 - t) + hexrgb('#061827') * t
	sea *= (0.82 + 0.3 * hs)[..., None]
	img = sea * wm[..., None] + land * (1 - wm[..., None])
	edge = np.asarray(Image.fromarray((wm * 255).astype(np.uint8)).filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.1)), np.float32) / 255
	img += np.clip(edge * 2.2, 0, 1)[..., None] * np.array([215, 205, 165], np.float32) * 0.38
	Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(ROOT / f'public/maps/{v}.jpg', quality=90)
	if False:
		# 縄文時代の海（およその範囲）：いまの標高8m以下の低地を、海の色で重ねる
		low = (e <= 8) & ~water
		lm = np.asarray(Image.fromarray((low * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(7)).filter(ImageFilter.GaussianBlur(2)), np.float32) / 255
		rgba = np.zeros((OUT_H, OUT_W, 4), np.uint8)
		rgba[..., :3] = hexrgb('#3a86a0').astype(np.uint8)
		rgba[..., 3] = (lm * 215).astype(np.uint8)
		Image.fromarray(rgba, 'RGBA').save(ROOT / 'public/maps/izumo-jomon.png', optimize=True)


exts = {}
for v in VIEWS:
	exts[v] = extent(v)
	if ONLY and v not in ONLY:
		continue
	print('地図', v, flush=True)
	render(v)
ts = '// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る\nexport const reliefViews = {\n'
for v, (a, b, c, d) in exts.items():
	ts += f'\t{v}: {{lon0: {a:.5f}, lon1: {b:.5f}, lat0: {c:.5f}, lat1: {d:.5f}}},\n'
ts += '} as const;\n\nexport type ReliefView = keyof typeof reliefViews;\n'
(ROOT / 'src/data/reliefViews.ts').write_text(ts)
