import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, gothicFamily, minchoFamily} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)} as const;
export const txt = (size: number, color: string = colors.text, weight = 900) => ({fontFamily: gothicFamily, fontWeight: weight, fontSize: size, fill: color});
export const mincho = (size: number, color: string = colors.text) => ({fontFamily: minchoFamily, fontWeight: 800, fontSize: size, fill: color});
export const fadeIn = (frame: number, at: number, len = 12) => interpolate(frame, [at, at + len], [0, 1], clamp);

// 西日本の簡単な地図（朝鮮半島〜九州〜近畿）。座標は 1400×820
export const places = {
	taiho: [210, 120],
	tsushima: [370, 330],
	iki: [425, 410],
	matsura: [455, 452],
	ito: [500, 440],
	na: [545, 438],
	shikanoshima: [552, 418],
	yoshinogari: [505, 490],
	chikugo: [545, 525],
	nara: [1090, 515],
	izumo: [840, 372],
	kibi: [900, 455],
} as const;

const SEA = '#12304d';
const LAND = '#bfa77c';
const LAND_EDGE = '#7d6646';

export const BaseMap: React.FC<{
	readonly children?: React.ReactNode;
	readonly width?: number;
	readonly dim?: boolean;
}> = ({children, width = 1300, dim = false}) => (
	<svg width={width} height={(width * 820) / 1400} viewBox="0 0 1400 820">
		<defs>
			<clipPath id="mapClip">
				<rect width={1400} height={820} rx={30} />
			</clipPath>
		</defs>
		<g clipPath="url(#mapClip)">
			<rect width={1400} height={820} fill={SEA} />
			{[...Array(9)].map((_, i) => (
				<path key={i} d={`M0 ${90 + i * 90} Q 350 ${70 + i * 90} 700 ${90 + i * 90} T 1400 ${90 + i * 90}`} stroke="#1c4266" strokeWidth={2} fill="none" />
			))}
			<g fill={LAND} stroke={LAND_EDGE} strokeWidth={4} opacity={dim ? 0.55 : 1}>
				{/* 朝鮮半島 */}
				<path d="M100 0 L340 0 L352 110 L330 210 L305 290 L250 325 L190 312 L148 262 L156 180 L112 96 Z" />
				{/* 対馬・壱岐 */}
				<ellipse cx={370} cy={330} rx={13} ry={42} transform="rotate(25 370 330)" />
				<circle cx={425} cy={410} r={14} />
				{/* 九州 */}
				<path d="M440 445 L520 425 L600 428 L640 468 L652 540 L632 620 L602 700 L562 742 L522 722 L502 662 L472 642 L452 582 L422 542 L432 492 Z" />
				{/* 四国 */}
				<path d="M760 562 L850 532 L962 526 L1002 560 L962 612 L882 602 L822 622 L772 602 Z" />
				{/* 本州（西半分） */}
				<path d="M622 418 L700 378 L800 348 L900 330 L1000 300 L1100 270 L1200 240 L1300 218 L1400 200 L1400 430 L1300 472 L1200 522 L1150 562 L1100 594 L1062 562 L1040 522 L980 502 L900 492 L820 482 L740 472 L662 462 Z" />
			</g>
			{children}
		</g>
	</svg>
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
}> = ({at, label, color = colors.gold, show = 1, pulse = false, dx = 0, dy = -30, size = 46}) => {
	const frame = useCurrentFrame();
	const r = pulse ? 14 + 10 * ((frame % 40) / 40) : 0;
	return (
		<g opacity={show}>
			{pulse ? <circle cx={at[0]} cy={at[1]} r={r + 10} fill="none" stroke={color} strokeWidth={4} opacity={1 - (frame % 40) / 40} /> : null}
			<circle cx={at[0]} cy={at[1]} r={11} fill={color} stroke="#000" strokeWidth={3} />
			{label ? (
				<text x={at[0] + dx} y={at[1] + dy} textAnchor="middle" {...txt(size, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
					{label}
				</text>
			) : null}
		</g>
	);
};

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

// ---- 冒頭 ----

// 2026年2月、ふたつの候補地で2日続けて発表
export const TwoCandidatesMap: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<BaseMap>
			<Pin at={places.nara} label="奈良・箸墓古墳" color={colors.correct} pulse show={fadeIn(frame, 5)} dy={-34} size={40} />
			<Pin at={places.yoshinogari} label="佐賀・吉野ヶ里" color={colors.wrong} pulse show={fadeIn(frame, 30)} dx={-10} dy={70} size={40} />
			<g opacity={fadeIn(frame, 10)}>
				<rect x={930} y={600} width={330} height={90} rx={16} fill="rgba(5,9,18,0.85)" />
				<text x={1095} y={660} textAnchor="middle" {...txt(44, colors.goldSoft)}>2月19日</text>
			</g>
			<g opacity={fadeIn(frame, 35)}>
				<rect x={200} y={600} width={330} height={90} rx={16} fill="rgba(5,9,18,0.85)" />
				<text x={365} y={660} textAnchor="middle" {...txt(44, colors.goldSoft)}>2月20日</text>
			</g>
			<text x={700} y={110} textAnchor="middle" {...txt(56)} opacity={fadeIn(frame, 55)} stroke="#000" strokeWidth={8} paintOrder="stroke">
				2日続けて、新しい発表
			</text>
		</BaseMap>
	);
};

// 300年以上の論争と、50か所の候補地
export const DebateCounter: React.FC = () => {
	const frame = useCurrentFrame();
	const years = Math.round(interpolate(frame, [0, 50], [0, 300], ease));
	const places50 = Math.round(interpolate(frame, [60, 110], [0, 50], ease));
	return (
		<svg width={1400} height={600} viewBox="0 0 1400 600">
			<rect width={1400} height={600} rx={30} fill="rgba(5,9,18,0.7)" />
			<text x={380} y={150} textAnchor="middle" {...txt(48, colors.muted)}>論争が続いた年月</text>
			<text x={380} y={360} textAnchor="middle" {...mincho(200, colors.goldSoft)}>{years}</text>
			<text x={380} y={460} textAnchor="middle" {...txt(56)}>年以上</text>
			<line x1={700} y1={110} x2={700} y2={500} stroke="#ffffff33" strokeWidth={4} />
			<g opacity={fadeIn(frame, 55)}>
				<text x={1030} y={150} textAnchor="middle" {...txt(48, colors.muted)}>名乗りを上げた場所</text>
				<text x={1030} y={360} textAnchor="middle" {...mincho(200, colors.correct)}>{places50}</text>
				<text x={1030} y={460} textAnchor="middle" {...txt(56)}>か所以上</text>
			</g>
		</svg>
	);
};

// 記録どおりに進むと、海の上へ
export const SailOffSouth: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<svg width={1400} height={640} viewBox="0 0 1400 640">
			<defs>
				<linearGradient id="sailSea" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#25496e" />
					<stop offset="100%" stopColor="#081a2d" />
				</linearGradient>
			</defs>
			<rect width={1400} height={640} rx={30} fill="url(#sailSea)" />
			<path d="M0 0 L420 0 L380 120 L300 170 L180 160 L0 220 Z" fill="#bfa77c" stroke="#7d6646" strokeWidth={4} />
			<text x={170} y={90} {...txt(40, '#3b2a16')}>九州</text>
			{[...Array(7)].map((_, i) => (
				<path key={i} d={`M${(i * 230 + frame * 2) % 1600 - 200} ${330 + (i % 3) * 90} q 40 -20 80 0 t 80 0`} stroke="#5d86b0" strokeWidth={4} fill="none" />
			))}
			<RouteLine d="M300 170 C 420 300 700 380 1250 560" p={p} />
			<Boat x={300 + 950 * p} y={170 + 390 * p} scale={1.6} />
			<text x={1240} y={470} textAnchor="end" {...txt(52, colors.goldSoft)} opacity={fadeIn(frame, 100)}>
				ここは、海の上？
			</text>
		</svg>
	);
};
