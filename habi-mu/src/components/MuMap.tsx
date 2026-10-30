import type React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {mapViews, type MapView} from '../data/mapViews';
import {colors} from '../theme';
import {easeInOut, useBeatLength} from './Cinema';
import {clamp, ease, fadeIn, txt} from './Maps';

// 実際の地形データ（Natural Earth の陸地と海底の深さ）から作った地図を、画面いっぱいに映す。
// 下絵は scripts/gen_maps.py が作る public/maps/<view>.jpg。ピン・航路・範囲はこの上に重ねる。

export type Proj = (lon: number, lat: number) => [number, number];

export const makeProj = (view: MapView): Proj => {
	const v = mapViews[view];
	return (lon, lat) => {
		let L = lon;
		if (L < v.lon0) L += 360;
		if (L > v.lon1) L -= 360;
		return [((L - v.lon0) / (v.lon1 - v.lon0)) * 1920, ((v.lat0 - lat) / (v.lat0 - v.lat1)) * 1080];
	};
};

export type GeoPin = {readonly at: readonly [number, number]; readonly label?: string; readonly color?: string; readonly at0?: number; readonly dy?: number; readonly dx?: number; readonly size?: number};
export type GeoRoute = {readonly from: readonly [number, number]; readonly to: readonly [number, number]; readonly at0?: number; readonly len?: number; readonly color?: string; readonly bend?: number};
export type GeoArea = {readonly pts: readonly (readonly [number, number])[]; readonly fill?: string; readonly stroke?: string; readonly opacity?: number; readonly dash?: boolean; readonly dy?: number};

// チャーチワードの本の地図をもとにした、ムー大陸のおおよその範囲（説明用）
export const MU: readonly (readonly [number, number])[] = [[146, 16], [160, 24], [180, 30], [200, 25], [215, 12], [238, 0], [252, -22], [246, -30], [225, -28], [205, -22], [185, -20], [168, -12], [152, -5], [143, 5]];

const areaPath = (p: Proj, pts: readonly (readonly [number, number])[]) => {
	const xy = pts.map(([a, b]) => p(a, b));
	// 角を丸めて、手描きの範囲らしく見せる
	const n = xy.length;
	let d = '';
	for (let i = 0; i < n; i++) {
		const [x0, y0] = xy[i];
		const [x1, y1] = xy[(i + 1) % n];
		const mx = (x0 + x1) / 2;
		const my = (y0 + y1) / 2;
		d += i === 0 ? `M${mx} ${my}` : ` Q ${x0} ${y0} ${mx} ${my}`;
	}
	const [fx, fy] = xy[0];
	const [lx, ly] = xy[1];
	return `${d} Q ${fx} ${fy} ${(fx + lx) / 2} ${(fy + ly) / 2} Z`;
};

export const GeoMap: React.FC<{
	readonly view: MapView;
	readonly pins?: readonly GeoPin[];
	readonly routes?: readonly GeoRoute[];
	readonly areas?: readonly GeoArea[];
	// カメラがゆっくり寄っていく先（経度・緯度）と、最後の倍率
	readonly focus?: readonly [number, number];
	readonly zoom?: number;
	readonly mu?: number; // ムー大陸の範囲の不透明度
	readonly muSink?: number; // 0〜1 で沈む
	readonly zealandia?: number; // ジーランディア（水深2000mより浅い大陸の地殻）の不透明度
	readonly children?: (p: Proj, frame: number) => React.ReactNode;
}> = ({view, pins = [], routes = [], areas = [], focus, zoom = 1.08, mu = 0, muSink = 0, zealandia = 0, children}) => {
	const frame = useCurrentFrame();
	const length = useBeatLength();
	const p = makeProj(view);
	const t = interpolate(frame, [0, Math.max(90, length)], [0, 1], easeInOut);
	const [fx, fy] = focus ? p(focus[0], focus[1]) : [960, 540];
	const s = 1.02 + (zoom - 1.02) * t;
	return (
		<AbsoluteFill style={{background: '#030c16', overflow: 'hidden'}}>
			<AbsoluteFill style={{transformOrigin: `${fx}px ${fy}px`, scale: String(s)}}>
				<Img src={staticFile(`maps/${view}.jpg`)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080}} />
				{zealandia > 0 && view === 'zealandia' ? <Img src={staticFile('maps/zealandia-crust.png')} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, opacity: zealandia}} /> : null}
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					<defs>
						<filter id="geoGlow" x="-20%" y="-20%" width="140%" height="140%">
							<feGaussianBlur stdDeviation="10" />
						</filter>
					</defs>
					{mu > 0 ? (
						<g opacity={mu * (1 - muSink * 0.85)} transform={`translate(0 ${muSink * 40})`}>
							<path d={areaPath(p, MU)} fill="#c9a25a" opacity={0.35} filter="url(#geoGlow)" />
							<path d={areaPath(p, MU)} fill="rgba(201,162,90,0.42)" stroke={colors.goldSoft} strokeWidth={4} />
						</g>
					) : null}
					{areas.map((a, i) => (
						<g key={`a${i}`} opacity={a.opacity ?? 1} transform={a.dy ? `translate(0 ${a.dy})` : undefined}>
							<path d={areaPath(p, a.pts)} fill={a.fill ?? 'rgba(201,162,90,0.4)'} stroke={a.stroke ?? colors.goldSoft} strokeWidth={4} strokeDasharray={a.dash ? '16 12' : undefined} />
						</g>
					))}
					{routes.map((r, i) => {
						const [x1, y1] = p(r.from[0], r.from[1]);
						const [x2, y2] = p(r.to[0], r.to[1]);
						const q = interpolate(frame, [r.at0 ?? 0, (r.at0 ?? 0) + (r.len ?? 45)], [0, 1], ease);
						const mx = (x1 + x2) / 2;
						const my = (y1 + y2) / 2 - (r.bend ?? 60);
						const d = `M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
						return (
							<g key={`r${i}`}>
								<path d={d} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={12} strokeLinecap="round" pathLength={1} style={{strokeDasharray: `${q} 1`}} />
								<path d={d} fill="none" stroke={r.color ?? colors.goldSoft} strokeWidth={6} strokeLinecap="round" pathLength={1} style={{strokeDasharray: `${q} 1`}} />
							</g>
						);
					})}
					{children ? children(p, frame) : null}
					{pins.map((pin, i) => {
						const [x, y] = p(pin.at[0], pin.at[1]);
						const o = fadeIn(frame, pin.at0 ?? 0);
						const k = ((frame + i * 9) % 50) / 50;
						const c = pin.color ?? colors.gold;
						return (
							<g key={`p${i}`} opacity={o}>
								<circle cx={x} cy={y} r={14 + 30 * k} fill="none" stroke={c} strokeWidth={3} opacity={1 - k} />
								<circle cx={x} cy={y} r={11} fill={c} stroke="#000" strokeWidth={3} />
								{pin.label ? (
									<text x={x + (pin.dx ?? 0)} y={y + (pin.dy ?? -30)} textAnchor="middle" {...txt(pin.size ?? 44, '#fff')} stroke="#000" strokeWidth={9} strokeOpacity={0.85} paintOrder="stroke">
										{pin.label}
									</text>
								) : null}
							</g>
						);
					})}
				</svg>
			</AbsoluteFill>
			{/* 上下を少し沈ませて、テロップと字幕を読みやすくする */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,6,14,0.55) 0%, rgba(2,6,14,0) 22%, rgba(2,6,14,0) 62%, rgba(2,6,14,0.75) 100%)'}} />
		</AbsoluteFill>
	);
};

// 地図の上の数字・ことば（黒いふちで読みやすく）
export const MapNote: React.FC<{readonly x: number; readonly y: number; readonly children: React.ReactNode; readonly size?: number; readonly color?: string; readonly at0?: number; readonly anchor?: 'start' | 'middle' | 'end'}> = ({x, y, children, size = 46, color = colors.goldSoft, at0 = 0, anchor = 'middle'}) => {
	const frame = useCurrentFrame();
	return (
		<text x={x} y={y} textAnchor={anchor} {...txt(size, color)} stroke="#000" strokeWidth={9} strokeOpacity={0.85} paintOrder="stroke" opacity={interpolate(frame, [at0, at0 + 18], [0, 1], clamp)}>
			{children}
		</text>
	);
};
