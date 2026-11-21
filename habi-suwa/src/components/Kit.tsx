import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, gothicFamily, minchoFamily} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)} as const;
export const txt = (size: number, color: string = colors.text, weight = 900) => ({fontFamily: gothicFamily, fontWeight: weight, fontSize: size, fill: color});
export const mincho = (size: number, color: string = colors.text) => ({fontFamily: minchoFamily, fontWeight: 800, fontSize: size, fill: color});
export const fadeIn = (frame: number, at: number, len = 12) => interpolate(frame, [at, at + len], [0, 1], clamp);

// 点線の道のり（p: 0〜1で伸びる）
export const RouteLine: React.FC<{readonly d: string; readonly p: number; readonly color?: string; readonly width?: number}> = ({d, p, color = colors.goldSoft, width = 7}) => (
	<path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
);

// 船の小さなアイコン
export const Boat: React.FC<{readonly x: number; readonly y: number; readonly scale?: number; readonly color?: string}> = ({x, y, scale = 1, color = '#f4ecdc'}) => (
	<g transform={`translate(${x} ${y}) scale(${scale})`}>
		<path d="M-30 0 L30 0 L20 14 L-20 14 Z" fill="#6b4423" />
		<line x1={0} y1={0} x2={0} y2={-40} stroke="#3b2214" strokeWidth={4} />
		<path d="M2 -38 L26 -8 L2 -8 Z" fill={color} />
	</g>
);

// 人のシルエット
export const Person: React.FC<{readonly x: number; readonly y: number; readonly s?: number; readonly color?: string; readonly woman?: boolean}> = ({x, y, s = 1, color = '#f4ecdc', woman = false}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
		<circle cy={-62} r={14} />
		{woman ? <path d="M-18 -46 L18 -46 L28 0 L-28 0 Z" /> : <rect x={-13} y={-46} width={26} height={46} rx={8} />}
	</g>
);

export const Pin: React.FC<{
	readonly at: readonly [number, number];
	readonly label?: string;
	readonly color?: string;
	readonly show?: number;
	readonly pulse?: boolean;
	readonly dx?: number;
	readonly dy?: number;
	readonly size?: number;
}> = ({at, label, color = colors.gold, show = 1, pulse = false, dx = 0, dy = -30, size = 44}) => {
	const frame = useCurrentFrame();
	const t = (frame % 40) / 40;
	return (
		<g opacity={show}>
			{pulse ? <circle cx={at[0]} cy={at[1]} r={24 + 10 * t} fill="none" stroke={color} strokeWidth={4} opacity={1 - t} /> : null}
			<circle cx={at[0]} cy={at[1]} r={11} fill={color} stroke="#000" strokeWidth={3} />
			{label ? (
				<text x={at[0] + dx} y={at[1] + dy} textAnchor="middle" {...txt(size, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
					{label}
				</text>
			) : null}
		</g>
	);
};

// 大ピラミッドの断面（北から見て左が北面）。座標は 1300×700、地面は y=560
export const PY = {apex: [650, 60], left: [250, 560], right: [1050, 560], ground: 560} as const;

export const PyramidSection: React.FC<{
	readonly children?: React.ReactNode;
	readonly passages?: boolean;
	readonly dim?: boolean;
	readonly sky?: string;
}> = ({children, passages = true, dim = false, sky = '#16233d'}) => (
	<svg width={1300} height={700} viewBox="0 0 1300 700">
		<rect width={1300} height={700} rx={30} fill={sky} />
		<rect y={560} width={1300} height={140} fill="#5b4a36" />
		<path d="M250 560 L650 60 L1050 560 Z" fill="#c9a96e" stroke="#8a6d3f" strokeWidth={5} opacity={dim ? 0.6 : 1} />
		{[...Array(9)].map((_, i) => {
			const y = 110 + i * 50;
			const half = ((y - 60) / 500) * 400;
			return <line key={i} x1={650 - half} y1={y} x2={650 + half} y2={y} stroke="#b08f58" strokeWidth={2} opacity={0.6} />;
		})}
		{passages ? (
			<g stroke="#3b2a16" strokeWidth={8} fill="none" strokeLinecap="round">
				{/* 下降通路と地下の部屋 */}
				<path d="M362 420 L600 625" />
				<rect x={600} y={610} width={90} height={30} fill="#3b2a16" />
				{/* 上昇通路・大回廊・王の間 */}
				<path d="M470 515 L560 410" />
				<path d="M560 410 L650 300" strokeWidth={22} />
				<rect x={655} y={280} width={80} height={32} fill="#3b2a16" />
				{/* 女王の間 */}
				<path d="M560 410 L640 410" />
				<rect x={640} y={398} width={44} height={26} fill="#3b2a16" />
			</g>
		) : null}
		{children}
	</svg>
);

// 年表の帯
export const Timeline: React.FC<{
	readonly from: number;
	readonly to: number;
	readonly bars: readonly {start: number; end: number; label: string; color: string; row: number; at: number}[];
	readonly ticks: readonly {at: number; label: string}[];
}> = ({from, to, bars, ticks}) => {
	const frame = useCurrentFrame();
	const x = (y: number) => 120 + ((y - from) / (to - from)) * 1160;
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<rect width={1400} height={560} rx={30} fill="rgba(5,9,18,0.75)" />
			<line x1={100} y1={440} x2={1300} y2={440} stroke="#fff" strokeWidth={4} />
			{ticks.map((t) => (
				<g key={t.label}>
					<line x1={x(t.at)} y1={430} x2={x(t.at)} y2={450} stroke="#fff" strokeWidth={4} />
					<text x={x(t.at)} y={500} textAnchor="middle" {...txt(38, colors.muted)}>
						{t.label}
					</text>
				</g>
			))}
			{bars.map((b) => {
				const p = interpolate(frame, [b.at, b.at + 30], [0, 1], ease);
				const w = Math.max(14, x(b.end) - x(b.start));
				return (
					<g key={b.label} opacity={fadeIn(frame, b.at)}>
						<rect x={x(b.start)} y={80 + b.row * 120} width={w * p} height={70} rx={12} fill={b.color} />
						<text x={Math.min(1250, Math.max(160, x(b.start) + w / 2))} y={80 + b.row * 120 - 14} textAnchor="middle" {...txt(42)}>
							{b.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
};

// 大きな数字のカウンター
export const BigCounter: React.FC<{
	readonly to: number;
	readonly unit: string;
	readonly caption: string;
	readonly color?: string;
	readonly decimals?: number;
}> = ({to, unit, caption, color = colors.goldSoft, decimals = 0}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [0, 60], [0, to], ease);
	return (
		<svg width={1300} height={480} viewBox="0 0 1300 480">
			<rect width={1300} height={480} rx={30} fill="rgba(5,9,18,0.75)" />
			<text x={650} y={110} textAnchor="middle" {...txt(44, colors.muted)}>
				{caption}
			</text>
			<text x={650} y={330} textAnchor="middle" {...mincho(190, color)}>
				{decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('ja-JP')}
				<tspan {...txt(80)}>{unit}</tspan>
			</text>
		</svg>
	);
};
