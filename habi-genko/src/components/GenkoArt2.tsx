import type React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, Reveal, svgGothic, svgMincho, useBeatLength} from './Cinema';

// 元寇判決：地図と第1の手がかりの図解

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W = 1920;
const H = 1080;

// ---- 地図（East China Sea location map OSM eqc：正距円筒図法） ----
// 地図の端：北42.6° 南20.4° 西112.2° 東142.1°。画像は public/photos/map-ecs.jpg
const MAP = {n: 42.6, s: 20.4, w: 112.2, e: 142.1, pw: 2400, ph: 2118};
export const geo = (lon: number, lat: number): [number, number] => [((lon - MAP.w) / (MAP.e - MAP.w)) * MAP.pw, ((MAP.n - lat) / (MAP.n - MAP.s)) * MAP.ph];

export const PLACES = {
	daito: [116.4, 39.9],
	kaesong: [126.55, 37.97],
	gappo: [128.57, 35.2],
	tsushima: [129.3, 34.4],
	komoda: [129.22, 34.25],
	iki: [129.71, 33.79],
	hakata: [130.4, 33.6],
	dazaifu: [130.52, 33.52],
	takashima: [129.75, 33.43],
	hirado: [129.55, 33.37],
	keigen: [121.55, 29.87],
	kamakura: [139.55, 35.32],
	kyoto: [135.76, 35.01],
} as const;

type Cam = {lon: number; lat: number; zoom: number};

// 地図を全画面に敷き、カメラ（中心の経緯度と拡大率）を from → to へ動かす。children は地図の座標（geo）で描く
export const MapView: React.FC<{readonly from: Cam; readonly to?: Cam; readonly children?: React.ReactNode}> = ({from, to, children}) => {
	const frame = useCurrentFrame();
	const length = useBeatLength();
	const t = interpolate(frame, [0, Math.max(60, length * 0.8)], [0, 1], easeInOut);
	const b = to ?? from;
	const lon = from.lon + (b.lon - from.lon) * t;
	const lat = from.lat + (b.lat - from.lat) * t;
	const zoom = from.zoom + (b.zoom - from.zoom) * t;
	const [cx, cy] = geo(lon, lat);
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#030a14'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: MAP.pw, height: MAP.ph, transformOrigin: '0 0', transform: `translate(${W / 2 - cx * zoom}px, ${H / 2 - cy * zoom}px) scale(${zoom})`}}>
				{/* 明るい地図を、夜の海のような暗い色に変える */}
				<Img src={staticFile('photos/map-ecs.jpg')} style={{position: 'absolute', inset: 0, width: MAP.pw, height: MAP.ph, filter: 'invert(1) hue-rotate(180deg) saturate(0.5) brightness(0.62) contrast(1.25)'}} />
				<svg width={MAP.pw} height={MAP.ph} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					{children}
				</svg>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)'}} />
		</div>
	);
};

// 地図の上の地名（拡大率に合わせて文字の大きさを保つ）
export const Place: React.FC<{readonly at: readonly [number, number]; readonly name: string; readonly zoom: number; readonly color?: string; readonly dx?: number; readonly dy?: number; readonly show?: number; readonly big?: boolean}> = ({
	at,
	name,
	zoom,
	color = '#fbf6ea',
	dx = 18,
	dy = -14,
	show = 0,
	big = false,
}) => {
	const frame = useCurrentFrame();
	const [x, y] = geo(at[0], at[1]);
	const k = 1 / zoom;
	const o = interpolate(frame, [show, show + 14], [0, 1], clamp);
	return (
		<g opacity={o} transform={`translate(${x} ${y}) scale(${k})`}>
			<circle r={11} fill={color} />
			<circle r={26 + 8 * Math.sin(frame / 10)} fill="none" stroke={color} strokeWidth={3} opacity={0.5} />
			<text x={dx} y={dy} {...svgGothic(big ? 56 : 44, color, 900)} stroke="rgba(0,0,0,0.85)" strokeWidth={10} paintOrder="stroke">
				{name}
			</text>
		</g>
	);
};

// 地図の上の道すじ（点線が伸びていく）
export const Route: React.FC<{readonly pts: ReadonlyArray<readonly [number, number]>; readonly zoom: number; readonly at?: number; readonly len?: number; readonly color?: string; readonly width?: number}> = ({
	pts,
	zoom,
	at = 0,
	len = 60,
	color = colors.gold,
	width = 7,
}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [at, at + len], [0, 1], easeInOut);
	const xy = pts.map(([lo, la]) => geo(lo, la));
	let d = `M ${xy[0][0]} ${xy[0][1]}`;
	for (let i = 1; i < xy.length; i++) {
		const [x0, y0] = xy[i - 1];
		const [x1, y1] = xy[i];
		const mx = (x0 + x1) / 2 + (y1 - y0) * 0.12;
		const my = (y0 + y1) / 2 - (x1 - x0) * 0.12;
		d += ` Q ${mx} ${my} ${x1} ${y1}`;
	}
	return (
		<g>
			<path d={d} stroke={color} strokeWidth={(width * 3) / zoom} fill="none" opacity={0.15} pathLength={1} strokeDasharray={`${p} 1`} />
			<path d={d} stroke={color} strokeWidth={width / zoom} fill="none" pathLength={1} strokeDasharray={`${p} 1`} strokeLinecap="round" />
		</g>
	);
};

// 第1の手がかり：大都（北京）から高麗を経て、大宰府へ届いた一通の手紙
export const LetterRoute: React.FC = () => {
	const cam = {lon: 127.5, lat: 35.4, zoom: 0.5};
	const z = cam.zoom;
	return (
		<MapView from={{...cam, zoom: 0.44}} to={cam}>
			<Route pts={[PLACES.daito, PLACES.kaesong, PLACES.gappo, PLACES.dazaifu]} zoom={z} at={20} len={110} />
			<Place at={PLACES.daito} name="大都（今の北京）" zoom={z} show={10} big dx={-40} dy={70} />
			<Place at={PLACES.kaesong} name="高麗" zoom={z} show={50} />
			<Place at={PLACES.dazaifu} name="大宰府" zoom={z} show={120} color={colors.goldSoft} big dx={-230} dy={70} />
			<Place at={PLACES.kamakura} name="鎌倉" zoom={z} show={140} dx={-120} />
			<Place at={PLACES.kyoto} name="京都" zoom={z} show={150} dx={-30} dy={60} />
		</MapView>
	);
};

// 1206年から1279年へ：モンゴル帝国から元へ
export const YuanTimeline: React.FC = () => {
	const frame = useCurrentFrame();
	const items = [
		{y: 1206, t: 'チンギス・カンが\nモンゴルの王に'},
		{y: 1260, t: 'フビライが\n皇帝に'},
		{y: 1271, t: '国の名前を\n「元」に'},
		{y: 1279, t: '南宋を\n滅ぼす'},
	];
	const x0 = 260;
	const x1 = 1660;
	const px = (y: number) => x0 + (items.findIndex((it) => it.y === y) / (items.length - 1)) * (x1 - x0);
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			<defs>
				<radialGradient id="ytBg" cx="50%" cy="50%" r="70%">
					<stop offset="0%" stopColor="#2a1a12" />
					<stop offset="100%" stopColor="#050302" />
				</radialGradient>
			</defs>
			<rect width={W} height={H} fill="url(#ytBg)" />
			<line x1={x0} y1={560} x2={x0 + (x1 - x0) * interpolate(frame, [0, 60], [0, 1], easeOut)} y2={560} stroke={colors.gold} strokeWidth={4} />
			{items.map((it, i) => (
				<Reveal key={it.y} at={20 + i * 30}>
					<circle cx={px(it.y)} cy={560} r={16} fill={i === 3 ? '#e94b3c' : colors.gold} />
					<text x={px(it.y)} y={500} textAnchor="middle" {...svgMincho(76, i === 3 ? '#ff9b8f' : colors.goldSoft)}>
						{it.y}
					</text>
					{it.t.split('\n').map((ln, k) => (
						<text key={k} x={px(it.y)} y={640 + k * 52} textAnchor="middle" {...svgGothic(40, '#efe6d2', 900)}>
							{ln}
						</text>
					))}
				</Reveal>
			))}
		</svg>
	);
};

// 「兵を用いることを、誰が好むだろうか」：手紙の最後の一文を、縦書きで大きく
export const LetterQuote: React.FC = () => {
	const frame = useCurrentFrame();
	const chars = '兵を用いることを、誰が好むだろうか'.split('');
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			<defs>
				<linearGradient id="lqPaper" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#d9c9a4" />
					<stop offset="100%" stopColor="#a8916a" />
				</linearGradient>
			</defs>
			<rect width={W} height={H} fill="#0a0806" />
			<rect x={660} y={290} width={600} height={660} fill="url(#lqPaper)" opacity={0.95} />
			<rect x={660} y={290} width={600} height={660} fill="none" stroke="#5a4528" strokeWidth={6} />
			{chars.map((ch, i) => {
				const col = i < 9 ? 0 : 1;
				const row = col === 0 ? i : i - 9;
				const o = interpolate(frame, [10 + i * 4, 20 + i * 4], [0, 1], clamp);
				return (
					<text key={i} x={1060 - col * 180} y={370 + row * 64} textAnchor="middle" {...svgMincho(58, '#1a120a')} opacity={o}>
						{ch}
					</text>
				);
			})}
			<Reveal at={100}>
				<text x={760} y={930} textAnchor="middle" {...svgGothic(26, '#4a3a22', 700)}>
					（現代語訳）
				</text>
			</Reveal>
		</svg>
	);
};

// 何度も届く使い、返事はしない
export const EnvoysAgain: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			<rect width={W} height={H} fill="#060a12" />
			{[0, 1, 2, 3, 4].map((i) => {
				const at = 10 + i * 22;
				const x = interpolate(frame, [at, at + 40], [-300, 380 + i * 270], easeOut);
				const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
				return (
					<g key={i} transform={`translate(${x} ${420 + (i % 2) * 70}) rotate(${-6 + i * 3})`} opacity={o}>
						<rect x={-110} y={-70} width={220} height={140} rx={8} fill="#e8dcc0" />
						<path d="M -110 -70 L 0 10 L 110 -70" stroke="#a08a63" strokeWidth={5} fill="none" />
						<circle cx={0} cy={10} r={22} fill="#9b2f22" />
					</g>
				);
			})}
			<Reveal at={130}>
				<text x={W / 2} y={820} textAnchor="middle" {...svgMincho(78, colors.goldSoft)}>
					返事は、ない
				</text>
			</Reveal>
		</svg>
	);
};

// 最初の手紙から、6年あまり
export const SixYears: React.FC = () => {
	const frame = useCurrentFrame();
	const years = [1268, 1269, 1270, 1271, 1272, 1273, 1274];
	const x0 = 260;
	const step = 233;
	const p = interpolate(frame, [10, 120], [0, 1], easeInOut);
	return (
		<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
			<rect width={W} height={H} fill="#07090f" />
			<rect x={x0} y={520} width={step * 6 * p} height={14} rx={7} fill={colors.gold} />
			{years.map((y, i) => (
				<g key={y}>
					<line x1={x0 + i * step} y1={490} x2={x0 + i * step} y2={560} stroke="#58657d" strokeWidth={3} />
					<text x={x0 + i * step} y={620} textAnchor="middle" {...svgGothic(40, '#aebbd0', 900)}>
						{y}
					</text>
				</g>
			))}
			<Reveal at={10}>
				<text x={x0} y={440} textAnchor="middle" {...svgGothic(36, '#efe6d2', 900)}>
					最初の手紙
				</text>
			</Reveal>
			<Reveal at={30}>
				<text x={x0 + 3 * step} y={440} textAnchor="middle" {...svgGothic(36, '#efe6d2', 900)}>
					九州の守りを命じる
				</text>
			</Reveal>
			<Reveal at={120}>
				<text x={x0 + 6 * step} y={440} textAnchor="middle" {...svgMincho(54, '#ff9b8f')}>
					そして…
				</text>
			</Reveal>
		</svg>
	);
};
