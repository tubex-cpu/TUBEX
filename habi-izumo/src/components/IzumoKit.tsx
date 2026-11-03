import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, svgGothic, svgMincho} from './Cinema';

// 出雲判決：図解の「型」（中身を変えて、場面ごとに別の図解として使う）

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const W = 1920;
export const H = 1080;

export const rand = (i: number) => {
	const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};

// 背景つきの全画面SVG（tone で色味を変える）
const TONES = {
	night: ['#12233a', '#02050a'],
	ember: ['#2c1a10', '#050302'],
	sea: ['#0f3448', '#02080e'],
	ink: ['#1d1d22', '#040405'],
	moss: ['#1b2a1f', '#030604'],
	shrine: ['#2a1214', '#060203'],
	bronze: ['#1d2a26', '#030605'],
} as const;
export type Tone = keyof typeof TONES;

export const Canvas: React.FC<{readonly tone?: Tone; readonly children: React.ReactNode}> = ({tone = 'night', children}) => {
	const [a, b] = TONES[tone];
	const id = `cv-${tone}`;
	return (
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
			<defs>
				<radialGradient id={id} cx="50%" cy="50%" r="72%">
					<stop offset="0%" stopColor={a} />
					<stop offset="100%" stopColor={b} />
				</radialGradient>
			</defs>
			<rect width={W} height={H} fill={`url(#${id})`} />
			{children}
		</svg>
	);
};

const appear = (frame: number, at: number) => ({
	opacity: interpolate(frame, [at, at + 16], [0, 1], clamp),
	dy: interpolate(frame, [at, at + 30], [24, 0], easeOut),
});

// カードを並べる（記録の比較、理由の列挙、人物の言葉など）
export type Card = {readonly head?: string; readonly body: string; readonly tone?: 'paper' | 'dark' | 'red' | 'gold'};
export const Cards: React.FC<{readonly cards: readonly Card[]; readonly tone?: Tone; readonly top?: number; readonly height?: number; readonly step?: number; readonly size?: number}> = ({
	cards,
	tone = 'night',
	top = 330,
	height = 470,
	step = 26,
	size = 48,
}) => {
	const frame = useCurrentFrame();
	const n = cards.length;
	const gap = 36;
	const w = Math.min(560, (W - 200 - gap * (n - 1)) / n);
	const x0 = (W - (w * n + gap * (n - 1))) / 2;
	return (
		<Canvas tone={tone}>
			{cards.map((c, i) => {
				const {opacity, dy} = appear(frame, 8 + i * step);
				const fill = c.tone === 'dark' ? '#0b1422' : c.tone === 'red' ? '#3a1210' : c.tone === 'gold' ? '#2e2410' : colors.paper;
				const ink = c.tone && c.tone !== 'paper' ? '#f6eedb' : colors.ink;
				const headInk = c.tone === 'red' ? '#ff9b8f' : c.tone && c.tone !== 'paper' ? colors.goldSoft : colors.clayDark;
				const lines = c.body.split('\n');
				return (
					<g key={i} opacity={opacity} transform={`translate(${x0 + i * (w + gap)} ${top + dy})`}>
						<rect width={w} height={height} rx={18} fill={fill} stroke={c.tone && c.tone !== 'paper' ? colors.gold : '#8a7348'} strokeWidth={3} />
						{c.head ? (
							<text x={w / 2} y={78} textAnchor="middle" {...svgGothic(36, headInk, 900)}>
								{c.head}
							</text>
						) : null}
						{lines.map((ln, k) => (
							<text key={k} x={w / 2} y={(c.head ? 170 : 120) + k * (size + 22)} textAnchor="middle" {...svgMincho(size, ink)}>
								{ln}
							</text>
						))}
					</g>
				);
			})}
		</Canvas>
	);
};

// 年表（ノードを等間隔に並べ、線が伸びていく）
export type Stop = {readonly label: string; readonly sub?: string; readonly accent?: boolean};
export const TimeBar: React.FC<{readonly stops: readonly Stop[]; readonly tone?: Tone; readonly y?: number; readonly note?: string}> = ({stops, tone = 'night', y = 560, note}) => {
	const frame = useCurrentFrame();
	const x0 = 230;
	const x1 = W - 230;
	const n = stops.length;
	const px = (i: number) => (n === 1 ? W / 2 : x0 + (i / (n - 1)) * (x1 - x0));
	const p = interpolate(frame, [6, 20 + n * 18], [0, 1], easeInOut);
	return (
		<Canvas tone={tone}>
			<line x1={x0} y1={y} x2={x1} y2={y} stroke="#33445e" strokeWidth={6} strokeLinecap="round" />
			<line x1={x0} y1={y} x2={x0 + (x1 - x0) * p} y2={y} stroke={colors.gold} strokeWidth={6} strokeLinecap="round" />
			{stops.map((s, i) => {
				const {opacity, dy} = appear(frame, 10 + i * 18);
				const c = s.accent ? '#ff8f80' : colors.goldSoft;
				return (
					<g key={i} opacity={opacity} transform={`translate(0 ${dy})`}>
						<circle cx={px(i)} cy={y} r={s.accent ? 20 : 15} fill={s.accent ? '#e94b3c' : colors.gold} />
						<text x={px(i)} y={y - 46} textAnchor="middle" {...svgMincho(n > 5 ? 52 : 66, c)}>
							{s.label}
						</text>
						{(s.sub ?? '').split('\n').map((ln, k) => (
							<text key={k} x={px(i)} y={y + 76 + k * 48} textAnchor="middle" {...svgGothic(n > 5 ? 32 : 38, '#efe6d2', 900)}>
								{ln}
							</text>
						))}
					</g>
				);
			})}
			{note ? (
				<text x={W / 2} y={880} textAnchor="middle" {...svgGothic(30, '#8ea2bd', 700)} opacity={interpolate(frame, [60, 80], [0, 1], clamp)}>
					{note}
				</text>
			) : null}
		</Canvas>
	);
};

// 大きな数字（数えあがる）を並べる
export type Fig = {readonly value: string; readonly label: string; readonly accent?: boolean; readonly small?: string};
export const Figures: React.FC<{readonly figs: readonly Fig[]; readonly tone?: Tone; readonly mid?: string; readonly note?: string}> = ({figs, tone = 'night', mid, note}) => {
	const frame = useCurrentFrame();
	const n = figs.length;
	const cw = (W - 200) / n;
	return (
		<Canvas tone={tone}>
			{figs.map((f, i) => {
				const at = 10 + i * 30;
				const {opacity, dy} = appear(frame, at);
				const m = f.value.match(/^([\d.]+)(.*)$/);
				let shown = f.value;
				if (m && !f.value.includes('?')) {
					const target = parseFloat(m[1]);
					const v = interpolate(frame, [at, at + 40], [0, target], easeOut);
					shown = (Number.isInteger(target) ? Math.round(v).toString() : v.toFixed(1)) + m[2];
				}
				const cx = 100 + cw * (i + 0.5);
				return (
					<g key={i} opacity={opacity} transform={`translate(0 ${dy})`}>
						<text x={cx} y={560} textAnchor="middle" {...svgMincho(f.value.length > 6 ? 120 : 160, f.accent ? '#ff8f80' : colors.goldSoft)}>
							{shown}
						</text>
						<text x={cx} y={660} textAnchor="middle" {...svgGothic(44, '#efe6d2', 900)}>
							{f.label}
						</text>
						{f.small ? (
							<text x={cx} y={720} textAnchor="middle" {...svgGothic(30, '#9fb0c8', 700)}>
								{f.small}
							</text>
						) : null}
					</g>
				);
			})}
			{mid && n === 2 ? (
				<text x={W / 2} y={540} textAnchor="middle" {...svgMincho(80, '#7f8ea8')} opacity={interpolate(frame, [30, 45], [0, 1], clamp)}>
					{mid}
				</text>
			) : null}
			{note ? (
				<text x={W / 2} y={860} textAnchor="middle" {...svgGothic(30, '#8ea2bd', 700)} opacity={interpolate(frame, [60, 80], [0, 1], clamp)}>
					{note}
				</text>
			) : null}
		</Canvas>
	);
};
