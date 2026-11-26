import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, svgGothic, svgMincho} from './Cinema';
import {Canvas, H, W, type Tone} from './IzumoKit';

// 卑弥呼の鏡判決：図解の「型」（中身を変えて、場面ごとに別の図解として使う）

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 邪馬台国の天秤（左＝奈良、右＝九州）。from→to に傾く。重りを積み、揺らぐ重りは点線で示す。
export type Weight = {readonly text: string; readonly shaky?: boolean; readonly fresh?: boolean; readonly gone?: boolean};
export const Balance: React.FC<{
	readonly from: number; // -1 = 奈良に大きく傾く ／ +1 = 九州に大きく傾く
	readonly to: number;
	readonly left: readonly Weight[];
	readonly right: readonly Weight[];
	readonly note?: string;
	readonly tone?: Tone;
}> = ({from, to, left, right, note, tone = 'night'}) => {
	const frame = useCurrentFrame();
	const tilt = interpolate(frame, [30, 110], [from, to], easeInOut);
	const wobble = Math.sin(frame / 9) * 1.2 * interpolate(frame, [100, 170], [1, 0], clamp);
	const deg = tilt * 14 + wobble;
	const cx = W / 2;
	const py = 400; // 支点
	const arm = 560;
	const rad = (deg * Math.PI) / 180;
	const lx = cx - arm * Math.cos(rad);
	const ly = py - arm * Math.sin(rad);
	const rx = cx + arm * Math.cos(rad);
	const ry = py + arm * Math.sin(rad);
	const pan = (x: number, y: number, label: string, ws: readonly Weight[], side: 'l' | 'r') => {
		const top = y + 190;
		return (
			<g>
				<line x1={x} y1={y} x2={x - 230} y2={top} stroke={colors.goldSoft} strokeWidth={4} opacity={0.8} />
				<line x1={x} y1={y} x2={x + 230} y2={top} stroke={colors.goldSoft} strokeWidth={4} opacity={0.8} />
				<path d={`M ${x - 270} ${top} Q ${x} ${top + 90} ${x + 270} ${top}`} fill="rgba(200,160,80,0.25)" stroke={colors.gold} strokeWidth={6} />
				<text x={x} y={top + 125} textAnchor="middle" {...svgMincho(80, side === 'l' ? '#ffd9a0' : '#a8e0ff')}>
					{label}
				</text>
				{ws.map((w, i) => {
					const at = 20 + i * 14;
					const o = interpolate(frame, [at, at + 16], [0, 1], clamp) * (w.gone ? interpolate(frame, [90, 130], [1, 0.25], clamp) : 1);
					const by = top - 70 - (ws.length - 1 - i) * 74;
					const fresh = w.fresh ? interpolate(frame, [40, 70], [-120, 0], easeOut) : 0;
					return (
						<g key={i} opacity={o} transform={`translate(0 ${fresh})`}>
							<rect x={x - 250} y={by} width={500} height={62} rx={10} fill={w.fresh ? 'rgba(190,40,30,0.85)' : 'rgba(10,16,28,0.88)'} stroke={w.shaky ? '#e7c27a' : colors.gold} strokeWidth={3} strokeDasharray={w.shaky ? '10 8' : undefined} />
							<text x={x} y={by + 44} textAnchor="middle" {...svgGothic(w.text.length > 14 ? 28 : 32, '#fbf6ea', 900)}>
								{w.text}
							</text>
						</g>
					);
				})}
			</g>
		);
	};
	return (
		<Canvas tone={tone}>
			<polygon points={`${cx - 60},${H - 250} ${cx + 60},${H - 250} ${cx + 16},${py} ${cx - 16},${py}`} fill="#3a2a14" stroke={colors.gold} strokeWidth={4} />
			<rect x={cx - 200} y={H - 260} width={400} height={30} rx={8} fill="#4a3518" stroke={colors.gold} strokeWidth={3} />
			<line x1={lx} y1={ly} x2={rx} y2={ry} stroke={colors.gold} strokeWidth={16} strokeLinecap="round" />
			<circle cx={cx} cy={py} r={26} fill={colors.gold} />
			{pan(lx, ly, '奈良', left, 'l')}
			{pan(rx, ry, '九州', right, 'r')}
			{note ? (
				<text x={cx} y={250} textAnchor="middle" {...svgGothic(40, '#efe6d2', 900)} opacity={interpolate(frame, [70, 90], [0, 1], clamp)}>
					{note}
				</text>
			) : null}
		</Canvas>
	);
};

// 数の食い違い：魏志倭人伝の100枚と、見つかった枚数を棒で比べる
export type Bar = {readonly label: string; readonly value: number; readonly accent?: boolean; readonly sub?: string};
export const CountBars: React.FC<{readonly bars: readonly Bar[]; readonly unit?: string; readonly max?: number; readonly tone?: Tone}> = ({bars, unit = '枚', max, tone = 'ink'}) => {
	const frame = useCurrentFrame();
	const m = max ?? Math.max(...bars.map((b) => b.value));
	const x0 = 520;
	const wmax = W - x0 - 220;
	const step = Math.min(170, 760 / bars.length);
	const y0 = (H - step * bars.length) / 2 + 30;
	return (
		<Canvas tone={tone}>
			{bars.map((b, i) => {
				const at = 12 + i * 28;
				const g = interpolate(frame, [at, at + 50], [0, 1], easeOut);
				const y = y0 + i * step;
				const w = (b.value / m) * wmax * g;
				return (
					<g key={i} opacity={interpolate(frame, [at, at + 12], [0, 1], clamp)}>
						<text x={x0 - 40} y={y + 62} textAnchor="end" {...svgGothic(46, '#efe6d2', 900)}>
							{b.label}
						</text>
						{b.sub ? (
							<text x={x0 - 40} y={y + 104} textAnchor="end" {...svgGothic(28, '#9fb0c8', 700)}>
								{b.sub}
							</text>
						) : null}
						<rect x={x0} y={y + 14} width={w} height={84} rx={8} fill={b.accent ? '#c0392b' : colors.goldSoft} />
						<text x={x0 + w + 24} y={y + 76} {...svgMincho(64, b.accent ? '#ff8f80' : '#fbf6ea')}>
							{Math.round(b.value * g)}
							{unit}
						</text>
					</g>
				);
			})}
		</Canvas>
	);
};

// 鏡の断面と背面（三角縁・神獣）の模式図。縁を三角に描き、背面の文様帯を順に光らせる
export const MirrorAnatomy: React.FC<{readonly tone?: Tone}> = ({tone = 'bronze'}) => {
	const frame = useCurrentFrame();
	const cx = 720;
	const cy = 600;
	const R = 320;
	const glow = (at: number) => interpolate(frame, [at, at + 20], [0.15, 1], clamp);
	const labels = [
		{at: 20, text: '三角にとがった縁', y: 340},
		{at: 60, text: '銘文の帯', y: 480},
		{at: 100, text: '神と霊獣', y: 620},
		{at: 140, text: 'つまみ（鈕）', y: 760},
	];
	return (
		<Canvas tone={tone}>
			<circle cx={cx} cy={cy} r={R} fill="#3c4a3e" stroke="#c9a65a" strokeWidth={30} opacity={glow(20)} />
			<circle cx={cx} cy={cy} r={R - 60} fill="none" stroke="#d9c28a" strokeWidth={22} strokeDasharray="6 10" opacity={glow(60)} />
			{Array.from({length: 6}, (_, i) => {
				const a = (i / 6) * Math.PI * 2 + 0.3;
				return <circle key={i} cx={cx + Math.cos(a) * 160} cy={cy + Math.sin(a) * 160} r={48} fill="#7d8f6e" stroke="#d9c28a" strokeWidth={4} opacity={glow(100)} />;
			})}
			<circle cx={cx} cy={cy} r={60} fill="#b9975a" opacity={glow(140)} />
			{labels.map((l, i) => (
				<g key={i} opacity={interpolate(frame, [l.at, l.at + 16], [0, 1], clamp)}>
					<line x1={1180} y1={l.y - 14} x2={1260} y2={l.y - 14} stroke={colors.gold} strokeWidth={4} />
					<text x={1290} y={l.y} {...svgGothic(48, '#efe6d2', 900)}>
						{l.text}
					</text>
				</g>
			))}
		</Canvas>
	);
};
