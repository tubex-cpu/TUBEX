import type React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {reliefViews, type ReliefView} from '../data/reliefViews';
import {colors} from '../theme';
import {easeInOut, easeOut, svgGothic, svgMincho, useBeatLength} from './Cinema';
import {rand} from './IzumoKit';

// 実際の標高データ（Mapzen Terrain Tiles）から作った地形図を画面いっぱいに映し、地名・道すじ・範囲を重ねる。
// 下絵は scripts/gen_relief.py が作る public/maps/<view>.jpg（ウェブメルカトル）。

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type LL = readonly [number, number];

// 地名（経度・緯度）
export const P = {
	taisha: [132.6855, 35.4019],
	inasa: [132.6768, 35.3982],
	kojindani: [132.8608, 35.3735],
	kamo: [132.8813, 35.3466],
	nishidani: [132.7752, 35.3517],
	kambara: [132.8865, 35.3349],
	yamashiro: [133.1045, 35.4519],
	daienji: [132.7586, 35.3658],
	sada: [133.0072, 35.4977],
	matsue: [133.0505, 35.4681],
	sanbe: [132.6211, 35.1404],
	daisenMt: [133.5461, 35.3711],
	miho: [133.3165, 35.5627],
	yumigahama: [133.28, 35.48],
	sono: [132.66, 35.35],
	hiikawa: [132.83, 35.31],
	kasen: [133.0123, 35.4064],
	okuizumo: [133.05, 35.18],
	imasaya: [132.53, 34.88],
	yamamochi: [132.73, 35.39],
	manaii: [132.6872, 35.4048],
	kamiari: [132.6812, 35.3956],
	yamato: [135.81, 34.54],
	kibi: [133.77, 34.67],
	hokuriku: [137.2, 36.7],
	tsunagi: [135.0, 35.6],
	kitakyushu: [130.5, 33.6],
	kinki: [135.6, 34.75],
	rakuro: [125.75, 39.0],
	kaya: [128.5, 35.2],
	suwa: [138.08, 36.05],
	kashima: [140.63, 35.97],
	awaji: [134.78, 34.27],
	tajima: [134.83, 35.58],
	osaka: [135.45, 34.45],
	wakayama: [135.4, 34.0],
	tokushima: [134.4, 34.0],
	tottori: [134.24, 35.5],
	fukui: [136.2, 36.0],
	nara: [135.84, 34.69],
	kyoto: [135.76, 35.02],
	ise: [136.73, 34.45],
	toyama: [137.21, 36.69],
	miyoshi: [132.85, 34.8],
	kyushu: [130.7, 32.8],
	shiragi: [129.2, 35.85],
	koshi: [137.0, 37.0],
	tomio: [135.7375, 34.6958],
	tenriSankokan: [135.8436, 34.5975],
	heijo: [135.7958, 34.6914],
	uda: [135.95, 34.53],
	ebino: [130.81, 32.05],
	saitobaru: [131.39, 32.12],
	daisen: [135.4875, 34.5639],
	kashikoken: [135.79, 34.49],
	ujibashi: [136.7253, 34.4555],
	sunriseDir: [136.7448, 34.4468],
	naiku: [136.7264, 34.4550],
	geku: [136.7032, 34.4877],
	kasanui: [135.8565, 34.5303],
	omi: [136.1, 35.0],
	mino: [136.62, 35.3],
	atsuta: [136.9085, 35.1283],
	kokyo: [139.7528, 35.6852],
	dannoura: [130.9617, 33.9634],
	agematsu: [137.6935, 35.7831],
	nakatsugawa: [137.5, 35.49],
	kuwana: [136.6836, 35.0656],
	seki: [136.39, 34.85],
	machu: [-72.545, -13.1631],
	cusco: [-71.9675, -13.532],
	vilcabamba: [-73.207, -12.914],
	ollantay: [-72.263, -13.258],
	aguas: [-72.5254, -13.1547],
	mandor: [-72.512, -13.148],
	lima: [-77.043, -12.046],
	quito: [-78.47, -0.18],
	titicaca: [-69.4, -15.85],
	coast: [-79.6, -7.2],
	amazon: [-69.5, -9.5],
	highland: [-76.5, -10.5],
	otama: [140.358, 37.546],
	tsuruoka: [139.826, 38.727],
	yudono: [139.983, 38.534],
	honmyoji: [139.78, 38.62],
	yonezawa: [140.116, 37.922],
	murakami: [139.48, 38.224],
	asakawa: [140.413, 37.08],
	sakuragawa: [140.09, 36.327],
	anan: [137.814, 35.323],
	inagi: [139.505, 35.638],
	shirataka: [140.1, 38.18],
	sojiji: [139.681, 35.503],
	saishoji: [138.83, 37.65],
	tsuka: [139.7631, 35.687],
	kandaMyojin: [139.7679, 35.702],
	narita: [140.3184, 35.786],
	iwai: [139.92, 36.05],
	hitachi: [140.27, 36.19],
	shimotsuke: [139.73, 36.38],
	kozuke: [139.03, 36.39],
	ogaki: [136.58, 35.38],
	dazaifu: [130.535, 33.521],
	shiramine: [133.92, 34.33],
	nagaoka: [135.69, 34.93],
	sanuki: [133.9, 34.25],
	seta: [135.91, 34.97],
	tomioka: [141.006, 37.344],
} as const satisfies Record<string, LL>;

const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
export type Proj = (p: LL) => [number, number];
export const proj = (view: ReliefView): Proj => {
	const v = reliefViews[view];
	const a = mercY(v.lat0);
	const b = mercY(v.lat1);
	return ([lon, lat]) => [((lon - v.lon0) / (v.lon1 - v.lon0)) * 1920, ((a - mercY(lat)) / (a - b)) * 1080];
};

export type Pin = {readonly at: LL; readonly name: string; readonly t?: number; readonly dx?: number; readonly dy?: number; readonly big?: boolean; readonly color?: string; readonly sub?: string};
export type Line = {readonly pts: readonly LL[]; readonly t?: number; readonly len?: number; readonly color?: string; readonly dash?: boolean; readonly width?: number; readonly arrow?: boolean; readonly bend?: number; readonly label?: string};
export type Area = {readonly at: LL; readonly r: number; readonly t?: number; readonly color?: string; readonly label?: string; readonly dy?: number};

const curve = (pts: [number, number][], bend = 0.18) => {
	if (pts.length === 2) {
		const [[x0, y0], [x1, y1]] = pts;
		const mx = (x0 + x1) / 2 - (y1 - y0) * bend;
		const my = (y0 + y1) / 2 + (x1 - x0) * bend;
		return `M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`;
	}
	return 'M ' + pts.map(([x, y]) => `${x} ${y}`).join(' L ');
};

export const ReliefMap: React.FC<{
	readonly view: ReliefView;
	readonly pins?: readonly Pin[];
	readonly lines?: readonly Line[];
	readonly areas?: readonly Area[];
	readonly focus?: LL;
	readonly zoom?: number;
	readonly overlay?: {readonly src: string; readonly t?: number; readonly opacity?: number};
	readonly gather?: {readonly to: LL; readonly n?: number; readonly t?: number; readonly spread?: number};
	readonly measure?: {readonly a: LL; readonly b: LL; readonly label: string; readonly t?: number};
	readonly children?: (p: Proj, z: number, frame: number) => React.ReactNode;
}> = ({view, pins = [], lines = [], areas = [], focus, zoom = 1.12, overlay, gather, measure, children}) => {
	const frame = useCurrentFrame();
	const length = useBeatLength();
	const p = proj(view);
	const t = interpolate(frame, [0, Math.max(120, length)], [0, 1], easeInOut);
	const [fx, fy] = focus ? p(focus) : [960, 560];
	const s = 1.02 + (zoom - 1.02) * t;
	const k = 1 / s;
	return (
		<AbsoluteFill style={{background: '#061827', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: `${fx}px ${fy}px`, scale: String(s)}}>
				<Img src={staticFile(`maps/${view}.jpg`)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080}} />
				{overlay ? (
					<Img
						src={staticFile(overlay.src)}
						style={{position: 'absolute', inset: 0, width: 1920, height: 1080, opacity: (overlay.opacity ?? 0.85) * interpolate(frame, [overlay.t ?? 20, (overlay.t ?? 20) + 40], [0, 1], clamp)}}
					/>
				) : null}
				<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)'}} />
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					<defs>
						<filter id="mglow" x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation="8" />
						</filter>
						<marker id="marrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
							<path d="M 0 0 L 10 5 L 0 10 Z" fill={colors.goldSoft} />
						</marker>
					</defs>
					{areas.map((a, i) => {
						const [x, y] = p(a.at);
						const o = interpolate(frame, [a.t ?? 10, (a.t ?? 10) + 25], [0, 1], clamp);
						const c = a.color ?? '#e9a13b';
						return (
							<g key={`a${i}`} opacity={o}>
								<circle cx={x} cy={y} r={a.r} fill={c} opacity={0.2} />
								<circle cx={x} cy={y} r={a.r} fill="none" stroke={c} strokeWidth={4 * k} strokeDasharray={`${14 * k} ${9 * k}`} />
								{a.label ? (
									<text x={x} y={y + (a.dy ?? 0)} textAnchor="middle" {...svgMincho(50 * k, '#fff3d6')} stroke="rgba(0,0,0,0.85)" strokeWidth={9 * k} paintOrder="stroke">
										{a.label}
									</text>
								) : null}
							</g>
						);
					})}
					{lines.map((l, i) => {
						const at = l.t ?? 15 + i * 20;
						const pr = interpolate(frame, [at, at + (l.len ?? 45)], [0, 1], easeInOut);
						const pts = l.pts.map((q) => p(q));
						const c = l.color ?? colors.goldSoft;
						const d = curve(pts, l.bend);
						return (
							<g key={`l${i}`} opacity={pr > 0 ? 1 : 0}>
								<path d={d} stroke={c} strokeWidth={14 * k} fill="none" opacity={0.25} filter="url(#mglow)" pathLength={1} strokeDasharray={`${pr} 1`} />
								<path
									d={d}
									stroke={c}
									strokeWidth={(l.width ?? 5) * k}
									fill="none"
									strokeLinecap="round"
									pathLength={1}
									strokeDasharray={l.dash ? undefined : `${pr} 1`}
									style={l.dash ? {strokeDasharray: `${0.012} ${0.008}`, opacity: pr} : undefined}
									markerEnd={l.arrow && pr > 0.98 ? 'url(#marrow)' : undefined}
								/>
								{l.label && pr > 0.6 ? (
									<text
										x={(pts[0][0] + pts[pts.length - 1][0]) / 2}
										y={(pts[0][1] + pts[pts.length - 1][1]) / 2 - 18 * k}
										textAnchor="middle"
										{...svgGothic(34 * k, '#fff3d6', 900)}
										stroke="rgba(0,0,0,0.85)"
										strokeWidth={8 * k}
										paintOrder="stroke"
										opacity={interpolate(pr, [0.6, 1], [0, 1])}
									>
										{l.label}
									</text>
								) : null}
							</g>
						);
					})}
					{measure
						? (() => {
								const [x0, y0] = p(measure.a);
								const [x1, y1] = p(measure.b);
								const at = measure.t ?? 40;
								const pr = interpolate(frame, [at, at + 40], [0, 1], easeInOut);
								return (
									<g>
										<line x1={x0} y1={y0} x2={x0 + (x1 - x0) * pr} y2={y0 + (y1 - y0) * pr} stroke="#fff3d6" strokeWidth={5 * k} strokeDasharray={`${16 * k} ${10 * k}`} />
										<text
											x={(x0 + x1) / 2 + 30 * k}
											y={(y0 + y1) / 2}
											{...svgMincho(70 * k, colors.goldSoft)}
											stroke="rgba(0,0,0,0.85)"
											strokeWidth={10 * k}
											paintOrder="stroke"
											opacity={interpolate(pr, [0.7, 1], [0, 1])}
										>
											{measure.label}
										</text>
									</g>
								);
							})()
						: null}
					{gather
						? [...Array(gather.n ?? 60)].map((_, i) => {
								const [tx, ty] = p(gather.to);
								const a = rand(i) * Math.PI * 2;
								const r0 = (gather.spread ?? 900) * (0.45 + rand(i + 3) * 0.55);
								const st = (gather.t ?? 10) + rand(i + 7) * 60;
								const q = interpolate(frame, [st, st + 90], [0, 1], easeInOut);
								const x = tx + Math.cos(a) * r0 * (1 - q);
								const y = ty + Math.sin(a) * r0 * 0.6 * (1 - q);
								return <circle key={`g${i}`} cx={x} cy={y} r={(5 + rand(i + 5) * 5) * k} fill="#ffe2a0" opacity={interpolate(frame, [st, st + 12], [0, 0.95], clamp) * (1 - q * 0.6)} filter={i % 3 ? undefined : 'url(#mglow)'} />;
							})
						: null}
					{children ? children(p, k, frame) : null}
					{pins.map((q, i) => {
						const [x, y] = p(q.at);
						const at = q.t ?? 10 + i * 12;
						const o = interpolate(frame, [at, at + 14], [0, 1], clamp);
						const pop = interpolate(frame, [at, at + 20], [0.4, 1], easeOut);
						const c = q.color ?? (q.big ? '#ff6b52' : colors.gold);
						const fs = (q.big ? 58 : 44) * k;
						const tx = x + (q.dx ?? 0) * k;
						const ty = y + (q.dy ?? -34) * k;
						return (
							<g key={`p${i}`} opacity={o}>
								<circle cx={x} cy={y} r={(q.big ? 30 : 20) * k * pop} fill={c} opacity={0.3} filter="url(#mglow)" />
								<circle cx={x} cy={y} r={(q.big ? 13 : 10) * k * pop} fill={c} stroke="#fff8e6" strokeWidth={3 * k} />
								<text x={tx} y={ty} textAnchor="middle" {...svgMincho(fs, '#fff8e6')} stroke="rgba(0,0,0,0.9)" strokeWidth={10 * k} paintOrder="stroke">
									{q.name}
								</text>
								{q.sub ? (
									<text x={tx} y={ty + 46 * k} textAnchor="middle" {...svgGothic(30 * k, colors.goldSoft, 900)} stroke="rgba(0,0,0,0.9)" strokeWidth={7 * k} paintOrder="stroke">
										{q.sub}
									</text>
								) : null}
							</g>
						);
					})}
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
