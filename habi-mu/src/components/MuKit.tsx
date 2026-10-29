import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {clamp, ease, fadeIn, mincho, txt} from './Maps';

// ムー大陸判決：図解の共通部品（地図・パネル・文字カード）

export const W = 1400;
export const H = 620;

export const Panel: React.FC<{readonly w?: number; readonly h?: number; readonly fill?: string; readonly children: React.ReactNode}> = ({w = W, h = H, fill = '#121c2c', children}) => (
	<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
		<rect width={w} height={h} rx={30} fill={fill} />
		{children}
	</svg>
);

// 太平洋を中心にした地図（経度100°E〜60°W、緯度55°N〜55°S の正距円筒図法）
const LON0 = 100;
const LON1 = 300;
const LAT0 = 55;
const LAT1 = -55;
export const ll = (lon: number, lat: number): [number, number] => {
	const L = lon < 0 ? lon + 360 : lon;
	return [((L - LON0) / (LON1 - LON0)) * W, ((LAT0 - lat) / (LAT0 - LAT1)) * H];
};
const poly = (pts: readonly (readonly [number, number])[]) => pts.map(([a, b]) => ll(a, b).join(',')).join(' ');

const ASIA = [[100, 55], [142, 55], [140, 50], [135, 44], [131, 43], [129, 40], [128, 35], [126, 35], [126, 38], [124, 39], [121, 40], [119, 38], [122, 36], [120, 34], [122, 30], [120, 26], [117, 23], [110, 21], [108, 18], [109, 12], [105, 9], [103, 11], [100, 13]] as const;
const JAPAN = [[130, 31], [131, 33.5], [133, 34], [135, 34], [137, 34.6], [140, 35], [141, 38], [142, 40], [141.5, 41.5], [143, 42.5], [145.5, 43.3], [143, 44.5], [141.7, 45.4], [140, 42.5], [140, 40.5], [139.5, 38], [137, 37], [136, 36], [133, 35.5], [130.5, 34]] as const;
const TAIWAN = [[120.1, 23], [121, 22], [122, 25], [121.5, 25.3]] as const;
const PHIL = [[120, 18.5], [122.5, 18.5], [124, 13], [126, 9], [125.5, 6], [122, 7], [121, 12], [119.5, 16]] as const;
const BORNEO = [[109, 2], [113, 4], [117, 7], [119, 5], [118, 1], [116, -4], [111, -3], [110, -1]] as const;
const SUMATRA_JAVA = [[100, -1], [104, -6], [106, -6.8], [114, -8.5], [114, -7], [106, -5.8], [104, -2], [100, 2]] as const;
const NEWGUINEA = [[131, -1], [135, -3], [141, -2.6], [146, -6], [150.5, -10.5], [147, -10], [142, -9], [138, -8.3], [134.5, -4]] as const;
const AUSTRALIA = [[114, -22], [113.5, -26], [115, -34], [118, -35], [123, -34], [129, -31.5], [131, -31.5], [137, -33], [140, -38], [145, -38.5], [150, -37.5], [153.5, -28], [153, -25], [146, -19], [145.3, -15], [142.5, -10.7], [141.5, -13], [140, -17.5], [136, -12], [130, -12], [126, -14], [122, -18]] as const;
const NZ_N = [[172.7, -34.4], [175.5, -37], [178.5, -37.7], [176.8, -39.6], [175.2, -41.6], [174.5, -39.5], [173.8, -38.3]] as const;
const NZ_S = [[172.6, -40.5], [174.3, -41.7], [172.5, -43.8], [171, -45], [168.3, -46.6], [166.5, -46], [167, -45], [170.5, -42.8]] as const;
const AMERICAS = [[228, 55], [235.5, 48], [236, 40], [239, 36], [242.5, 34], [244, 31], [245.5, 23], [250, 24], [254.5, 20], [262, 16], [268, 15], [273, 12.5], [277, 8.5], [281, 7.5], [280, 1.5], [279, -2.5], [281, -6], [284, -14], [289, -18.5], [288.5, -30], [286.5, -40], [285, -50], [290, -55], [300, -55], [300, 55]] as const;
const NCAL = [[164, -20.2], [167, -22.3], [167.2, -22.6], [164.2, -20.7]] as const;
export const ZEALANDIA = [[158.5, -18], [165, -18.5], [170, -24], [174, -29], [179, -34], [180, -40], [178, -47], [172, -52], [165, -51.5], [162, -46], [160, -38], [157, -30], [156.5, -22]] as const;
// チャーチワードの本の地図をもとにした、ムー大陸のおおよその範囲（説明用）
export const MU = [[146, 16], [160, 24], [180, 30], [200, 25], [215, 12], [238, 0], [252, -22], [246, -30], [225, -28], [205, -22], [185, -20], [168, -12], [152, -5], [143, 5]] as const;

export const places = {
	japan: [138, 36],
	yonaguni: [123, 24.45],
	okinoshima: [130.1, 34.2],
	pohnpei: [158.2, 6.9],
	mariana: [145.7, 15.2],
	hawaii: [-157, 20.5],
	tahiti: [-149.4, -17.6],
	easter: [-109.4, -27.1],
	chile: [-71.5, -33],
	sandy: [159.9, -19.2],
	newcal: [165.5, -21.5],
	nz: [174, -41],
	fiji: [178, -18],
	sentinel: [92.2, 11.5],
} as const;

export type MapPin = {readonly at: readonly [number, number]; readonly label?: string; readonly color?: string; readonly at0?: number; readonly dy?: number; readonly dx?: number};
export type MapRoute = {readonly from: readonly [number, number]; readonly to: readonly [number, number]; readonly at0?: number; readonly len?: number; readonly color?: string; readonly bend?: number};

export const PacificMap: React.FC<{
	readonly pins?: readonly MapPin[];
	readonly routes?: readonly MapRoute[];
	readonly mu?: number; // ムー大陸の不透明度
	readonly muSink?: number; // 0〜1 で沈む
	readonly zealandia?: number;
	readonly children?: React.ReactNode;
	readonly sea?: string;
}> = ({pins = [], routes = [], mu = 0, muSink = 0, zealandia = 0, children, sea = '#0e2b45'}) => {
	const frame = useCurrentFrame();
	const land = '#5f7a4e';
	return (
		<Panel fill={sea}>
			<defs>
				<clipPath id="pacClip">
					<rect width={W} height={H} rx={30} />
				</clipPath>
			</defs>
			<g clipPath="url(#pacClip)">
				{[...Array(11)].map((_, i) => (
					<line key={`la${i}`} x1={0} x2={W} y1={(i * H) / 10} y2={(i * H) / 10} stroke="#ffffff" strokeOpacity={0.05} />
				))}
				{[...Array(11)].map((_, i) => (
					<line key={`lo${i}`} y1={0} y2={H} x1={(i * W) / 10} x2={(i * W) / 10} stroke="#ffffff" strokeOpacity={0.05} />
				))}
				{zealandia > 0 ? <polygon points={poly(ZEALANDIA)} fill="#3d6f8a" stroke="#9fd3e8" strokeWidth={4} strokeDasharray="14 10" opacity={zealandia} /> : null}
				{mu > 0 ? (
					<g opacity={mu * (1 - muSink * 0.85)} transform={`translate(0 ${muSink * 30})`}>
						<polygon points={poly(MU)} fill="#8a6e3f" stroke={colors.goldSoft} strokeWidth={4} />
					</g>
				) : null}
				{[ASIA, JAPAN, TAIWAN, PHIL, BORNEO, SUMATRA_JAVA, NEWGUINEA, AUSTRALIA, NZ_N, NZ_S, AMERICAS, NCAL].map((p, i) => (
					<polygon key={i} points={poly(p)} fill={land} stroke="#2b3b25" strokeWidth={2} />
				))}
				{routes.map((r, i) => {
					const [x1, y1] = ll(r.from[0], r.from[1]);
					const [x2, y2] = ll(r.to[0], r.to[1]);
					const p = interpolate(frame, [r.at0 ?? 0, (r.at0 ?? 0) + (r.len ?? 45)], [0, 1], ease);
					const mx = (x1 + x2) / 2;
					const my = (y1 + y2) / 2 - (r.bend ?? 60);
					return (
						<path
							key={i}
							d={`M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
							fill="none"
							stroke={r.color ?? colors.goldSoft}
							strokeWidth={6}
							strokeLinecap="round"
							strokeDasharray="16 12"
							pathLength={1}
							style={{strokeDasharray: `${p} 1`}}
						/>
					);
				})}
				{children}
				{pins.map((p, i) => {
					const [x, y] = ll(p.at[0], p.at[1]);
					const o = fadeIn(frame, p.at0 ?? 0);
					const t = ((frame + i * 9) % 40) / 40;
					return (
						<g key={i} opacity={o}>
							<circle cx={x} cy={y} r={20 + 12 * t} fill="none" stroke={p.color ?? colors.gold} strokeWidth={4} opacity={1 - t} />
							<circle cx={x} cy={y} r={10} fill={p.color ?? colors.gold} stroke="#000" strokeWidth={3} />
							{p.label ? (
								<text x={x + (p.dx ?? 0)} y={y + (p.dy ?? -26)} textAnchor="middle" {...txt(36, '#fff')} stroke="#000" strokeWidth={7} paintOrder="stroke">
									{p.label}
								</text>
							) : null}
						</g>
					);
				})}
			</g>
		</Panel>
	);
};

// 大きな明朝の一文（問い・強調）と小さな補足
export const BigLine: React.FC<{readonly main: string; readonly sub?: string; readonly color?: string; readonly size?: number; readonly fill?: string}> = ({main, sub, color = colors.goldSoft, size = 104, fill}) => {
	const frame = useCurrentFrame();
	const s = interpolate(frame, [0, 30], [0.94, 1], ease);
	return (
		<Panel fill={fill}>
			<g transform={`translate(700 ${sub ? 290 : 330}) scale(${s})`} opacity={fadeIn(frame, 0, 18)}>
				<text textAnchor="middle" {...mincho(size, color)}>
					{main}
				</text>
			</g>
			{sub ? (
				<text x={700} y={430} textAnchor="middle" {...txt(44, colors.muted, 700)} opacity={fadeIn(frame, 16, 18)}>
					{sub}
				</text>
			) : null}
		</Panel>
	);
};

// 左右の比較カード
export const Versus: React.FC<{
	readonly left: {readonly title: string; readonly lines: readonly string[]; readonly color?: string};
	readonly right: {readonly title: string; readonly lines: readonly string[]; readonly color?: string};
	readonly mid?: string;
}> = ({left, right, mid = 'VS'}) => {
	const frame = useCurrentFrame();
	const card = (c: typeof left, x: number, at: number) => (
		<g opacity={fadeIn(frame, at)} transform={`translate(${x} ${interpolate(frame, [at, at + 20], [30, 0], ease)})`}>
			<rect width={560} height={500} rx={24} fill="rgba(244,236,220,0.07)" stroke={c.color ?? colors.gold} strokeWidth={4} />
			<text x={280} y={90} textAnchor="middle" {...mincho(58, c.color ?? colors.goldSoft)}>
				{c.title}
			</text>
			{c.lines.map((l, i) => (
				<text key={i} x={280} y={190 + i * 76} textAnchor="middle" {...txt(42)}>
					{l}
				</text>
			))}
		</g>
	);
	return (
		<Panel>
			{card(left, 60, 0)}
			{card(right, 780, 20)}
			<text x={700} y={330} textAnchor="middle" {...mincho(64, colors.muted)} opacity={fadeIn(frame, 10)}>
				{mid}
			</text>
		</Panel>
	);
};

// 年表：区間の帯と点
export const Years: React.FC<{
	readonly from: number;
	readonly to: number;
	readonly ticks: readonly {readonly at: number; readonly label: string}[];
	readonly marks: readonly {readonly at: number; readonly label: string; readonly color?: string; readonly row?: number; readonly t0?: number}[];
	readonly bands?: readonly {readonly start: number; readonly end: number; readonly label: string; readonly color: string; readonly t0?: number}[];
}> = ({from, to, ticks, marks, bands = []}) => {
	const frame = useCurrentFrame();
	const x = (v: number) => 110 + ((v - from) / (to - from)) * 1180;
	return (
		<Panel>
			<line x1={90} y1={430} x2={1310} y2={430} stroke="#fff" strokeWidth={4} />
			{ticks.map((t) => (
				<g key={t.label}>
					<line x1={x(t.at)} y1={418} x2={x(t.at)} y2={442} stroke="#fff" strokeWidth={4} />
					<text x={x(t.at)} y={492} textAnchor="middle" {...txt(36, colors.muted)}>
						{t.label}
					</text>
				</g>
			))}
			{bands.map((b) => {
				const p = interpolate(frame, [b.t0 ?? 0, (b.t0 ?? 0) + 30], [0, 1], ease);
				return (
					<g key={b.label} opacity={fadeIn(frame, b.t0 ?? 0)}>
						<rect x={x(b.start)} y={330} width={Math.max(16, (x(b.end) - x(b.start)) * p)} height={60} rx={12} fill={b.color} />
						<text x={(x(b.start) + x(b.end)) / 2} y={312} textAnchor="middle" {...txt(38)}>
							{b.label}
						</text>
					</g>
				);
			})}
			{marks.map((m) => {
				const row = m.row ?? 0;
				const y = 250 - row * 110;
				return (
					<g key={m.label} opacity={fadeIn(frame, m.t0 ?? 0)}>
						<line x1={x(m.at)} y1={y + 18} x2={x(m.at)} y2={430} stroke={m.color ?? colors.gold} strokeWidth={4} strokeDasharray="8 8" />
						<circle cx={x(m.at)} cy={430} r={14} fill={m.color ?? colors.gold} stroke="#000" strokeWidth={3} />
						<text x={x(m.at)} y={y} textAnchor="middle" {...txt(42, m.color ?? colors.goldSoft)}>
							{m.label}
						</text>
					</g>
				);
			})}
		</Panel>
	);
};

// 横棒の比べ合い
export const Bars: React.FC<{readonly rows: readonly {readonly label: string; readonly value: number; readonly unit: string; readonly color?: string}[]; readonly max?: number; readonly title?: string}> = ({rows, max, title}) => {
	const frame = useCurrentFrame();
	const m = max ?? Math.max(...rows.map((r) => r.value));
	return (
		<Panel>
			{title ? (
				<text x={700} y={80} textAnchor="middle" {...txt(44, colors.muted)}>
					{title}
				</text>
			) : null}
			{rows.map((r, i) => {
				const p = interpolate(frame, [i * 14, i * 14 + 36], [0, 1], ease);
				const y = 140 + i * (420 / rows.length);
				return (
					<g key={r.label}>
						<text x={330} y={y + 46} textAnchor="end" {...txt(40)}>
							{r.label}
						</text>
						<rect x={360} y={y} width={Math.max(8, (r.value / m) * 800 * p)} height={66} rx={10} fill={r.color ?? colors.gold} />
						<text x={370 + (r.value / m) * 800 * p} y={y + 48} {...txt(40, colors.goldSoft)} opacity={p}>
							{` ${r.value.toLocaleString('ja-JP')}${r.unit}`}
						</text>
					</g>
				);
			})}
		</Panel>
	);
};

// 断面（海・海底）の基本
export const SeaSection: React.FC<{readonly children?: React.ReactNode; readonly seaY?: number}> = ({children, seaY = 120}) => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#0a1626">
			<defs>
				<linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#1f5f86" />
					<stop offset="100%" stopColor="#071a2b" />
				</linearGradient>
				<clipPath id="secClip">
					<rect width={W} height={H} rx={30} />
				</clipPath>
			</defs>
			<g clipPath="url(#secClip)">
				<rect y={seaY} width={W} height={H - seaY} fill="url(#seaGrad)" />
				<path d={`M0 ${seaY} ${[...Array(15)].map((_, i) => `Q ${i * 100 + 50} ${seaY + Math.sin(frame / 14 + i) * 6 - 6} ${(i + 1) * 100} ${seaY}`).join(' ')}`} stroke="#9fd3e8" strokeWidth={4} fill="none" opacity={0.7} />
				{children}
			</g>
		</Panel>
	);
};

export {clamp, ease, fadeIn, mincho, txt};
