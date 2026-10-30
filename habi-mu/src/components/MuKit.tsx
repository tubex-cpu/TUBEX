import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {clamp, ease, fadeIn, mincho, txt} from './Maps';

// ムー大陸判決：図解の共通部品（地図・パネル・文字カード）

export const W = 1400;
export const H = 620;

// 図解の画用紙。色を指定したときは、画面の端まで色を広げる（枠のカードにしない）
export const Panel: React.FC<{readonly w?: number; readonly h?: number; readonly fill?: string; readonly children: React.ReactNode}> = ({w = W, h = H, fill, children}) => (
	<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible'}}>
		{fill ? <rect x={-1000} y={-600} width={w + 2000} height={h + 1200} fill={fill} /> : null}
		{children}
	</svg>
);

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
			<text x={280} y={90} textAnchor="middle" {...mincho(Math.min(58, Math.floor(520 / c.title.length)), c.color ?? colors.goldSoft)}>
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
					<stop offset="60%" stopColor="#071a2b" />
					<stop offset="100%" stopColor="#030a12" />
				</linearGradient>
				<clipPath id="secClip">
					<rect x={-1000} y={-600} width={W + 2000} height={H + 1200} />
				</clipPath>
			</defs>
			<g clipPath="url(#secClip)">
				<rect x={-1000} y={seaY} width={W + 2000} height={H - seaY + 600} fill="url(#seaGrad)" />
				<path d={`M-1000 ${seaY} ${[...Array(34)].map((_, i) => `Q ${i * 100 - 950} ${seaY + Math.sin(frame / 14 + i) * 6 - 6} ${(i + 1) * 100 - 1000} ${seaY}`).join(' ')}`} stroke="#9fd3e8" strokeWidth={4} fill="none" opacity={0.7} />
				{children}
			</g>
		</Panel>
	);
};

export {clamp, ease, fadeIn, mincho, txt};
