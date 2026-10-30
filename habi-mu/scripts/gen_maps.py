#!/usr/bin/env python3
"""実際の地形データから、地図の下絵（陸・海底の深さ）を作る。

データ：Natural Earth（パブリックドメイン）の 10m 陸地・小さな島・海底の深さ（0〜10000m の12段階）。
初回は GitHub の natural-earth-vector から geojson を取り、リポジトリの外（~/.cache/habi-geo）に置く。
出力：public/maps/<名前>.jpg（2560×1440）と src/data/mapViews.ts（各地図の範囲）。

  python3 habi-mu/scripts/gen_maps.py habi-mu        # すべて
  python3 habi-mu/scripts/gen_maps.py habi-mu pacific # 1枚だけ
"""
import json
import math
import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
ONLY = set(sys.argv[2:])
CACHE = Path.home() / '.cache/habi-geo'
BASE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
DEPTHS = [('L', 0), ('K', 200), ('J', 1000), ('I', 2000), ('H', 3000), ('G', 4000), ('F', 5000), ('E', 6000), ('D', 7000), ('C', 8000), ('B', 9000), ('A', 10000)]

# 画面（16:9）に映す範囲：中心の経度・緯度と、横に映す経度の幅
VIEWS = {
	'pacific': (195, -8, 200),
	'world': (0, 0, 320),
	'micronesia': (150, 17.7, 96),
	'ryukyu': (124.5, 25, 11),
	'genkai': (130.5, 34, 7),
	'andaman': (92.45, 11.45, 1.7),
	'coral': (162, -20.5, 16),
	'zealandia': (168, -33, 66),
	'easter': (266, -26, 50),
	'hokulea': (207, -4.6, 124),
	'southamerica': (262, -20.6, 65),
	'japan': (132, 33, 94),
	'atlantic': (-30, 20, 150),
	'indian': (62, -5.8, 137),
	'northsea': (3, 53.8, 26),
}
OUT_W, OUT_H = 2560, 1440
SS = 2  # なめらかにするため、2倍で描いてから縮める

# 海の色：浅い（明るい青緑）→ 深い（夜の藍）
SEA = ['#2a6f87', '#21607c', '#1a5674', '#154866', '#113c58', '#0d314b', '#0a283f', '#082033', '#06192a', '#051422', '#04101c', '#030c16']


def hexrgb(h):
	return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def load(name):
	CACHE.mkdir(parents=True, exist_ok=True)
	p = CACHE / f'{name}.geojson'
	if not p.exists():
		print('  取得', name)
		urllib.request.urlretrieve(BASE + f'{name}.geojson', p)
	return json.loads(p.read_text())


def polys(gj):
	for f in gj['features']:
		g = f['geometry']
		if not g:
			continue
		if g['type'] == 'Polygon':
			yield g['coordinates']
		elif g['type'] == 'MultiPolygon':
			yield from g['coordinates']


def extent(view):
	cx, cy, span = VIEWS[view]
	spanY = span * math.cos(math.radians(cy)) * 9 / 16 if abs(cy) > 1 else span * 9 / 16
	return cx - span / 2, cx + span / 2, cy + spanY / 2, cy - spanY / 2


def draw_layer(img_w, img_h, ext, rings_list, value=255):
	"""多角形（穴あき）を白黒のマスクに描く"""
	lon0, lon1, lat0, lat1 = ext
	sx = img_w / (lon1 - lon0)
	sy = img_h / (lat0 - lat1)
	mask = Image.new('L', (img_w, img_h), 0)
	d = ImageDraw.Draw(mask)
	for rings in rings_list:
		xs = [c[0] for c in rings[0]]
		ys = [c[1] for c in rings[0]]
		if max(ys) < lat1 or min(ys) > lat0:
			continue
		for shift in (-360, 0, 360):
			if max(xs) + shift < lon0 or min(xs) + shift > lon1:
				continue
			for k, ring in enumerate(rings):
				pts = [((x + shift - lon0) * sx, (lat0 - y) * sy) for x, y in ring]
				if len(pts) >= 3:
					d.polygon(pts, fill=value if k == 0 else 0)
	return mask


def hillshade(z, az=315, alt=40, strength=1.0):
	gy, gx = np.gradient(z)
	slope = np.pi / 2 - np.arctan(strength * np.hypot(gx, gy))
	aspect = np.arctan2(-gx, gy)
	a, b = math.radians(az), math.radians(alt)
	hs = np.sin(b) * np.sin(slope) + np.cos(b) * np.cos(slope) * np.cos(a - aspect)
	return np.clip(hs, 0, 1)


def render(view, data):
	ext = extent(view)
	zoom = max(1.0, (200 / VIEWS[view][2]) ** 0.5)
	w, h = OUT_W * SS, OUT_H * SS
	# 深さの段（0〜11）を重ねて、海底の高さの場を作る
	depth = np.zeros((h, w), np.float32)
	for i, (_, _) in enumerate(DEPTHS):
		m = np.asarray(draw_layer(w, h, ext, data['bathy'][i]), np.float32) / 255
		depth = np.maximum(depth, m * (i + 1))
	land = draw_layer(w, h, ext, data['land'])
	land = Image.fromarray(np.maximum(np.asarray(land), np.asarray(draw_layer(w, h, ext, data['minor'])))).convert('L')
	small = (OUT_W, OUT_H)
	depth_img = Image.fromarray((depth * 20).astype(np.uint8)).resize(small, Image.BILINEAR)
	# 段差をなめらかにして、本物の海底のような起伏に見せる
	z = np.asarray(depth_img.filter(ImageFilter.GaussianBlur(OUT_W / 900 * zoom)), np.float32) / 20
	zs = np.asarray(depth_img.filter(ImageFilter.GaussianBlur(OUT_W / 260 * zoom)), np.float32) / 20
	zz = 0.55 * z + 0.45 * zs
	pal = np.array([hexrgb(c) for c in SEA], np.float32)
	idx = np.clip(zz - 1, 0, len(SEA) - 1)
	lo = np.floor(idx).astype(int)
	hi = np.minimum(lo + 1, len(SEA) - 1)
	f = (idx - lo)[..., None]
	sea = pal[lo] * (1 - f) + pal[hi] * f
	hs = hillshade(-zz * (OUT_W / 260 / zoom), strength=1.0)
	sea *= (0.62 + 0.55 * hs)[..., None]
	# 陸：くすんだ緑と土の色に、細かいむらをのせる
	landm = np.asarray(land.resize(small, Image.LANCZOS), np.float32) / 255
	rng = np.random.default_rng(7)
	noise = Image.fromarray((rng.random((OUT_H // 4, OUT_W // 4)) * 255).astype(np.uint8)).resize(small, Image.BICUBIC)
	nz = np.asarray(noise.filter(ImageFilter.GaussianBlur(3)), np.float32) / 255
	inner = np.asarray(land.resize(small, Image.LANCZOS).filter(ImageFilter.GaussianBlur(OUT_W / 300)), np.float32) / 255
	g1, g2 = np.array(hexrgb('#353f2c'), np.float32), np.array(hexrgb('#4d4834'), np.float32)
	landc = g1 * (1 - nz[..., None]) + g2 * nz[..., None]
	landc *= (0.72 + 0.38 * inner)[..., None]
	# 海岸線：陸のふちを細く明るく
	edge = np.asarray(land.resize(small, Image.LANCZOS).filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255
	img = sea * (1 - landm[..., None]) + landc * landm[..., None]
	img += np.clip(edge * 2.4, 0, 1)[..., None] * np.array([215, 205, 165], np.float32) * 0.42
	# 経緯線（10度ごと、地図の範囲が狭いときは細かく）
	out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
	d = ImageDraw.Draw(out, 'RGBA')
	lon0, lon1, lat0, lat1 = ext
	step = 30 if lon1 - lon0 > 150 else 10 if lon1 - lon0 > 40 else 5 if lon1 - lon0 > 15 else 1
	for L in range(int(math.floor(lon0 / step) * step), int(lon1) + 1, step):
		x = (L - lon0) / (lon1 - lon0) * OUT_W
		d.line([(x, 0), (x, OUT_H)], fill=(255, 255, 255, 18), width=2)
	for B in range(int(math.floor(lat1 / step) * step), int(lat0) + 1, step):
		y = (lat0 - B) / (lat0 - lat1) * OUT_H
		d.line([(0, y), (OUT_W, y)], fill=(255, 255, 255, 18), width=2)
	return out, ext


def zealandia_overlay(data):
	"""ジーランディア：ニュージーランドのまわりで、水深2000mより浅い海底（大陸の地殻）"""
	ext = extent('zealandia')
	w, h = OUT_W, OUT_H
	deep = np.asarray(draw_layer(w, h, ext, data['bathy'][3]), np.float32) / 255
	lon0, lon1, lat0, lat1 = ext
	lasso = [(155.5, -17.5), (163, -17.5), (171, -24), (176, -28), (178.5, -33), (186, -42), (182, -49), (172, -55), (160, -52), (158, -44), (152, -33), (152.5, -26)]
	lm = Image.new('L', (w, h), 0)
	ImageDraw.Draw(lm).polygon([((x - lon0) / (lon1 - lon0) * w, (lat0 - y) / (lat0 - lat1) * h) for x, y in lasso], fill=255)
	area = (1 - deep) * (np.asarray(lm, np.float32) / 255)
	a = Image.fromarray((area * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
	edge = a.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.5))
	rgba = np.zeros((h, w, 4), np.uint8)
	A = np.asarray(a, np.float32) / 255
	E = np.clip(np.asarray(edge, np.float32) / 255 * 4, 0, 1)
	rgba[..., 0] = 120
	rgba[..., 1] = 220
	rgba[..., 2] = 210
	rgba[..., 3] = np.clip(A * 95 + E * 255, 0, 255).astype(np.uint8)
	Image.fromarray(rgba, 'RGBA').save(ROOT / 'public/maps/zealandia-crust.png', optimize=True)


def main():
	data = {
		'land': list(polys(load('ne_10m_land'))),
		'minor': list(polys(load('ne_10m_minor_islands'))),
		'bathy': [list(polys(load(f'ne_10m_bathymetry_{k}_{v}'))) for k, v in DEPTHS],
	}
	(ROOT / 'public/maps').mkdir(parents=True, exist_ok=True)
	exts = {}
	for v in VIEWS:
		exts[v] = extent(v)
		if ONLY and v not in ONLY:
			continue
		print('地図', v)
		img, _ = render(v, data)
		img.save(ROOT / f'public/maps/{v}.jpg', quality=90)
	if not ONLY or 'zealandia' in ONLY:
		zealandia_overlay(data)
	lines = ['// 地図の下絵（public/maps/*.jpg）が映している範囲。scripts/gen_maps.py が作る', 'export const mapViews = {']
	for v, (a, b, c, d) in exts.items():
		lines.append(f"\t{v}: {{lon0: {a:.4f}, lon1: {b:.4f}, lat0: {c:.4f}, lat1: {d:.4f}}},")
	lines += ['} as const;', '', 'export type MapView = keyof typeof mapViews;', '']
	(ROOT / 'src/data/mapViews.ts').write_text('\n'.join(lines))


main()
