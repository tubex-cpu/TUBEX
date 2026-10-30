import type React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Telop} from './Cinema';
import {colors, gothicFamily, minchoFamily} from '../theme';
import {Center} from './Illustrations';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)} as const;

// 図解の舞台：画面いっぱいの夜の背景に図解を大きく置き、問いのテロップを上の帯に出す（テレビでも大きく見える）
export const Visual: React.FC<{
	readonly children: React.ReactNode;
	readonly label?: string;
	readonly labelColor?: string;
}> = ({children, label}) => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 58%, #15243b 0%, #08101e 62%, #03060d 100%)', overflow: 'hidden'}}>
		<div style={{position: 'absolute', left: 0, right: 0, top: 250, height: 700, display: 'flex', justifyContent: 'center'}}>
			<div style={{zoom: 1.12}}>{children}</div>
		</div>
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,6,13,0.55) 0%, rgba(3,6,13,0) 20%, rgba(3,6,13,0) 82%, rgba(3,6,13,0.85) 100%)'}} />
		{label ? <Telop text={label} top={96} max={76} /> : null}
	</AbsoluteFill>
);

const svgText = (size: number, color: string = colors.text, weight = 900) => ({
	fontFamily: gothicFamily,
	fontWeight: weight,
	fontSize: size,
	fill: color,
});

// 5000年前のシュメールの町：ジッグラトと川、昇る太陽
export const SumerCity: React.FC = () => {
	const frame = useCurrentFrame();
	const sunY = interpolate(frame, [0, 90], [470, 250], ease);
	return (
		<svg width={1400} height={620} viewBox="0 0 1400 620">
			<defs>
				<linearGradient id="sumerSky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#1d2a52" />
					<stop offset="100%" stopColor="#e39a5c" />
				</linearGradient>
				<clipPath id="sumerClip">
					<rect width={1400} height={620} rx={30} />
				</clipPath>
			</defs>
			<g clipPath="url(#sumerClip)">
				<rect width={1400} height={620} fill="url(#sumerSky)" />
				<circle cx={1050} cy={sunY} r={70} fill="#ffd98a" />
				<rect y={500} width={1400} height={120} fill="#c79a62" />
				{/* ジッグラト */}
				<rect x={450} y={420} width={500} height={90} fill="#b07a48" />
				<rect x={520} y={340} width={360} height={80} fill="#bf8754" />
				<rect x={590} y={270} width={220} height={70} fill="#cc9460" />
				<rect x={650} y={220} width={100} height={50} fill="#d9a06b" />
				<path d="M680 510 L720 510 L715 270 L685 270 Z" fill="#8f5f36" />
				{[...Array(7)].map((_, i) => (
					<line key={i} x1={450} x2={950} y1={440 + i * 10} y2={440 + i * 10} stroke="#9a6a3e" strokeWidth={2} opacity={0.5} />
				))}
				{/* 家並み */}
				{[60, 170, 270, 1010, 1120, 1240].map((x, i) => (
					<g key={x}>
						<rect x={x} y={455 - (i % 2) * 20} width={90} height={60 + (i % 2) * 20} fill="#a8794a" />
						<rect x={x + 30} y={480} width={22} height={34} fill="#5e3f22" />
					</g>
				))}
				{/* ヤシ */}
				{[380, 990].map((x) => (
					<g key={x}>
						<path d={`M${x} 520 Q ${x + 10} 440 ${x} 380`} stroke="#4b3a22" strokeWidth={10} fill="none" />
						{[-60, -20, 20, 60].map((r) => (
							<ellipse key={r} cx={x} cy={380} rx={60} ry={12} fill="#3f5a2b" transform={`rotate(${r} ${x} 380) translate(30 0)`} />
						))}
					</g>
				))}
				{/* 川 */}
				<path
					d={`M0 575 Q 350 ${545 + Math.sin(frame / 20) * 6} 700 575 T 1400 575 L1400 620 L0 620 Z`}
					fill="#3d6f9a"
				/>
			</g>
		</svg>
	);
};

// 地平線に現れては消えていく人々
export const VanishingPeople: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<path d="M0 430 Q 350 380 700 420 T 1400 410 L1400 560 L0 560 Z" fill="#3a2f22" />
			{[...Array(7)].map((_, i) => {
				const x = 220 + i * 160;
				const o = interpolate(frame, [i * 10, i * 10 + 15, 80 + i * 10, 110 + i * 10], [0, 1, 1, 0.08], clamp);
				return (
					<g key={i} opacity={o}>
						<circle cx={x} cy={300} r={24} fill="#d8c3a0" />
						<path d={`M${x - 34} 410 Q ${x - 30} 335 ${x} 330 Q ${x + 30} 335 ${x + 34} 410 Z`} fill="#d8c3a0" />
					</g>
				);
			})}
			{[0, 1, 2].map((i) => (
				<text key={i} x={400 + i * 300} y={200} textAnchor="middle" {...svgText(110, colors.gold)} opacity={interpolate(frame, [100 + i * 12, 115 + i * 12], [0, 1], clamp)}>
					？
				</text>
			))}
		</svg>
	);
};

// シュメールの祈る人の像（大きな目、組んだ手）
export const SumerianStatue: React.FC<{readonly size?: number}> = ({size = 520}) => {
	const frame = useCurrentFrame();
	const glow = interpolate(Math.sin(frame / 15), [-1, 1], [0.4, 1]);
	return (
		<svg width={size * 0.7} height={size} viewBox="0 0 280 400">
			<path d="M70 250 L210 250 L235 390 L45 390 Z" fill="#b9a68a" />
			{[...Array(9)].map((_, i) => (
				<line key={i} x1={60 + i * 20} y1={300} x2={56 + i * 21} y2={390} stroke="#8e7c60" strokeWidth={3} />
			))}
			<path d="M85 150 Q 140 130 195 150 L210 255 L70 255 Z" fill="#c9b796" />
			<path d="M95 170 Q 140 230 185 170 L175 200 Q 140 225 105 200 Z" fill="#b5a281" />
			<ellipse cx={140} cy={195} rx={22} ry={18} fill="#a8946f" />
			<ellipse cx={140} cy={90} rx={52} ry={60} fill="#cdbb9a" />
			<path d="M88 80 Q 140 10 192 80 Q 180 40 140 36 Q 100 40 88 80 Z" fill="#3b3128" />
			<rect x={104} y={110} width={72} height={52} rx={10} fill="#3b3128" />
			{[0, 1, 2, 3].map((i) => (
				<path key={i} d={`M108 ${120 + i * 11} q 8 -5 16 0 t 16 0 t 16 0 t 16 0`} stroke="#5a4a3a" strokeWidth={3} fill="none" />
			))}
			{[118, 162].map((x) => (
				<g key={x}>
					<circle cx={x} cy={82} r={17} fill="#f4f0e6" />
					<circle cx={x} cy={82} r={10} fill="#141414" />
					<circle cx={x} cy={82} r={21} fill="none" stroke={colors.gold} strokeWidth={2} opacity={glow * 0.6} />
				</g>
			))}
		</svg>
	);
};

// 人のシルエット（体の中にDNAが光る）
export const PersonSilhouette: React.FC<{readonly color?: string; readonly dna?: boolean; readonly size?: number; readonly question?: boolean}> = ({
	color = colors.japan,
	dna = false,
	size = 520,
	question = false,
}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size * 0.7} height={size} viewBox="0 0 280 400">
			<circle cx={140} cy={90} r={58} fill={color} opacity={0.9} />
			<path d="M30 400 Q 30 175 140 170 Q 250 175 250 400 Z" fill={color} opacity={0.9} />
			{dna
				? [...Array(14)].map((_, i) => {
						const y = 190 + i * 14;
						const p = Math.sin(i * 0.8 + frame / 10) * 40;
						return (
							<g key={i} opacity={interpolate(frame, [i * 3, i * 3 + 10], [0, 1], clamp)}>
								<line x1={140 - p} y1={y} x2={140 + p} y2={y} stroke="#ffe3a3" strokeWidth={3} />
								<circle cx={140 - p} cy={y} r={6} fill="#fff1c2" />
								<circle cx={140 + p} cy={y} r={6} fill={colors.gold} />
							</g>
						);
					})
				: null}
			{question ? (
				<text x={140} y={115} textAnchor="middle" {...svgText(90, colors.night)}>
					？
				</text>
			) : null}
		</svg>
	);
};

// 天秤：日本とシュメールを量る
export const ScaleBalance: React.FC<{readonly undecided?: boolean}> = ({undecided = false}) => {
	const frame = useCurrentFrame();
	const angle = undecided ? Math.sin(frame / 18) * 8 : interpolate(frame, [0, 60], [-12, 0], ease) + Math.sin(frame / 25) * 2;
	const rad = (angle * Math.PI) / 180;
	const lx = 600 - Math.cos(rad) * 300;
	const ly = 170 - Math.sin(rad) * 300;
	const rx = 600 + Math.cos(rad) * 300;
	const ry = 170 + Math.sin(rad) * 300;
	const pan = (x: number, y: number, c: string, t: string) => (
		<g>
			<line x1={x} y1={y} x2={x - 90} y2={y + 170} stroke={colors.goldSoft} strokeWidth={4} />
			<line x1={x} y1={y} x2={x + 90} y2={y + 170} stroke={colors.goldSoft} strokeWidth={4} />
			<path d={`M${x - 120} ${y + 170} Q ${x} ${y + 240} ${x + 120} ${y + 170} Z`} fill={colors.gold} />
			<circle cx={x} cy={y + 140} r={40} fill={c} />
			<text x={x} y={y + 300} textAnchor="middle" {...svgText(44, c)}>
				{t}
			</text>
		</g>
	);
	return (
		<svg width={1200} height={640} viewBox="0 0 1200 640">
			<rect x={585} y={150} width={30} height={420} fill={colors.woodLight} />
			<path d="M480 600 L720 600 L680 560 L520 560 Z" fill={colors.wood} />
			<line x1={lx} y1={ly} x2={rx} y2={ry} stroke={colors.gold} strokeWidth={16} strokeLinecap="round" />
			<circle cx={600} cy={170} r={22} fill={colors.goldSoft} />
			{pan(lx, ly, colors.japan, '日本人')}
			{pan(rx, ry, colors.sumer, 'シュメール人')}
			{undecided ? (
				<text x={600} y={100} textAnchor="middle" {...svgText(110, colors.goldSoft)}>
					？
				</text>
			) : null}
		</svg>
	);
};

// 関門海峡と彦島
export const KanmonMap: React.FC = () => {
	const frame = useCurrentFrame();
	const pulse = (frame % 50) / 50;
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#16325a" />
			{[...Array(8)].map((_, i) => (
				<path key={i} d={`M${(i * 170 + frame) % 1400 - 100} ${80 + i * 70} q 20 -10 40 0 t 40 0`} stroke="#2c5687" strokeWidth={4} fill="none" />
			))}
			<path d="M560 0 L1300 0 L1300 640 L980 640 Q 900 520 820 420 Q 760 330 700 300 Q 630 260 600 180 Z" fill="#5f7d4a" />
			<path d="M0 360 Q 200 320 380 360 Q 480 380 540 400 Q 600 430 640 520 L700 640 L0 640 Z" fill="#6f8a52" />
			<ellipse cx={590} cy={350} rx={60} ry={34} fill="#7f9a5f" stroke={colors.goldSoft} strokeWidth={4} />
			<circle cx={590} cy={350} r={12} fill={colors.goldSoft} />
			<circle cx={590} cy={350} r={12 + pulse * 50} fill="none" stroke={colors.goldSoft} strokeWidth={4} opacity={1 - pulse} />
			<text x={1000} y={200} {...svgText(60)}>本州</text>
			<text x={180} y={520} {...svgText(60)}>九州</text>
			<text x={590} y={280} textAnchor="middle" {...svgText(48, colors.goldSoft)}>彦島</text>
			<text x={760} y={470} {...svgText(36, '#b9d4f0')}>関門海峡</text>
		</svg>
	);
};

// 人の目は見たいものを見つける：目と、世界中の文字の中の丸や三角
export const EyeShapes: React.FC = () => {
	const frame = useCurrentFrame();
	const scripts = [
		{name: 'シュメール', x: 820, y: 130},
		{name: 'エジプト', x: 1120, y: 130},
		{name: 'インダス', x: 820, y: 400},
		{name: 'マヤ', x: 1120, y: 400},
	];
	const look = Math.floor(frame / 30) % 4;
	const target = scripts[look];
	const eyeX = 330 + interpolate(target.x, [820, 1120], [-14, 14]);
	const eyeY = 300 + interpolate(target.y, [130, 400], [-10, 10]);
	return (
		<svg width={1400} height={620} viewBox="0 0 1400 620">
			<path d="M100 300 Q 330 100 560 300 Q 330 500 100 300 Z" fill={colors.paper} />
			<circle cx={eyeX} cy={eyeY} r={85} fill="#6b4b2a" />
			<circle cx={eyeX} cy={eyeY} r={42} fill="#111" />
			<circle cx={eyeX - 18} cy={eyeY - 20} r={12} fill="#fff" />
			{scripts.map((s, i) => (
				<g key={s.name} opacity={look === i ? 1 : 0.45}>
					<rect x={s.x - 120} y={s.y - 90} width={240} height={200} rx={20} fill="rgba(244,236,220,0.1)" stroke={look === i ? colors.gold : colors.muted} strokeWidth={4} />
					<g stroke={colors.goldSoft} strokeWidth={8} fill="none">
						<circle cx={s.x - 50} cy={s.y - 10} r={30} />
						<path d={`M${s.x + 20} ${s.y + 20} L${s.x + 50} ${s.y - 40} L${s.x + 80} ${s.y + 20} Z`} />
					</g>
					<text x={s.x} y={s.y + 85} textAnchor="middle" {...svgText(32)}>
						{s.name}
					</text>
				</g>
			))}
			<line x1={eyeX} y1={eyeY} x2={target.x - 120} y2={target.y + 10} stroke={colors.gold} strokeWidth={3} strokeDasharray="10 10" opacity={0.7} />
		</svg>
	);
};

// 海の道：朝鮮半島南部・有明海・彦島
export const SeaRoutes: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 90], [0, 1], ease);
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#16325a" />
			<path d="M80 0 L420 0 Q 440 120 400 220 Q 360 300 300 330 Q 220 350 180 300 Q 120 220 80 120 Z" fill="#6f8a52" />
			<path d="M620 300 Q 700 260 800 280 Q 860 300 870 380 Q 880 470 820 560 Q 760 620 680 600 Q 600 560 590 470 Q 580 380 620 300 Z" fill="#6f8a52" />
			<path d="M860 240 Q 1000 180 1300 160 L1300 300 Q 1100 300 940 290 Z" fill="#5f7d4a" />
			<ellipse cx={690} cy={470} rx={40} ry={60} fill="#16325a" />
			<circle cx={870} cy={265} r={14} fill={colors.goldSoft} />
			<path d="M320 320 Q 500 300 680 470" stroke={colors.gold} strokeWidth={8} fill="none" strokeDasharray="20 14" pathLength={1} style={{strokeDasharray: `${p} 1`}} />
			<path d="M330 300 Q 600 220 860 262" stroke={colors.gold} strokeWidth={8} fill="none" pathLength={1} style={{strokeDasharray: `${p} 1`}} />
			<g opacity={interpolate(frame, [40, 60], [0, 1], clamp)}>
				<text x={250} y={390} textAnchor="middle" {...svgText(40)}>朝鮮半島南部</text>
				<text x={560} y={600} textAnchor="middle" {...svgText(40)}>有明海</text>
				<text x={870} y={330} textAnchor="middle" {...svgText(40, colors.goldSoft)}>彦島</text>
			</g>
		</svg>
	);
};

// 古い本（100年前の説）
export const OldBook: React.FC<{readonly title: string; readonly year?: string}> = ({title, year}) => {
	const frame = useCurrentFrame();
	const open = interpolate(frame, [0, 30], [0, 1], ease);
	return (
		<svg width={1100} height={600} viewBox="0 0 1100 600">
			<ellipse cx={550} cy={560} rx={460} ry={26} fill="#000" opacity={0.3} />
			<path d={`M550 100 Q 330 ${60 + 40 * (1 - open)} 120 100 L120 520 Q 330 480 550 520 Z`} fill="#e9dcc0" stroke="#8a7350" strokeWidth={4} />
			<path d="M550 100 Q 770 60 980 100 L980 520 Q 770 480 550 520 Z" fill="#efe3c9" stroke="#8a7350" strokeWidth={4} />
			<line x1={550} y1={100} x2={550} y2={520} stroke="#8a7350" strokeWidth={6} />
			{[...Array(8)].map((_, i) => (
				<line key={i} x1={480 - i * 45} y1={150} x2={480 - i * 45} y2={470} stroke="#b8a685" strokeWidth={6} strokeDasharray="20 10" opacity={open} />
			))}
			<text x={765} y={300} textAnchor="middle" writingMode="vertical-rl" style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: Math.min(64, 340 / title.length), fill: '#3b2a18'}} opacity={open}>
				{title}
			</text>
			{year ? (
				<text x={900} y={500} textAnchor="middle" {...svgText(36, '#8a5a2a')} opacity={open}>
					{year}
				</text>
			) : null}
		</svg>
	);
};

// ひとりぼっちの言葉：言語の家族と、離れた一点
export const LoneLanguage: React.FC = () => {
	const frame = useCurrentFrame();
	const families = [
		{name: 'インド・ヨーロッパ', x: 260, y: 160},
		{name: 'テュルク', x: 620, y: 120},
		{name: 'シナ・チベット', x: 980, y: 170},
		{name: 'ウラル', x: 380, y: 420},
		{name: '日本語族', x: 860, y: 430},
	];
	const pulse = (frame % 50) / 50;
	return (
		<svg width={1650} height={730} viewBox="0 0 1400 620">
			{families.map((f, fi) => {
				const pts = [...Array(6)].map((_, i) => [f.x + Math.cos(i * 1.05 + fi) * 70, f.y + Math.sin(i * 1.05 + fi) * 50]);
				return (
					<g key={f.name} opacity={interpolate(frame, [fi * 8, fi * 8 + 15], [0, 1], clamp)}>
						{pts.map(([x, y], i) => (
							<line key={i} x1={f.x} y1={f.y} x2={x} y2={y} stroke={colors.muted} strokeWidth={3} />
						))}
						{pts.map(([x, y], i) => (
							<circle key={i} cx={x} cy={y} r={14} fill={colors.wrong} />
						))}
						<circle cx={f.x} cy={f.y} r={18} fill="#7fb4f0" />
						<text x={f.x} y={f.y + 100} textAnchor="middle" {...svgText(30, colors.muted)}>
							{f.name}
						</text>
					</g>
				);
			})}
			<circle cx={1250} cy={470} r={26} fill={colors.gold} />
			<circle cx={1250} cy={470} r={26 + pulse * 50} fill="none" stroke={colors.gold} strokeWidth={4} opacity={1 - pulse} />
			<text x={1250} y={560} textAnchor="middle" {...svgText(40, colors.gold)}>シュメール語</text>
		</svg>
	);
};

// 統べる：散らばった糸がひとつに束ねられる
export const Converge: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 70], [0, 1], ease);
	return (
		<svg width={1200} height={600} viewBox="0 0 1200 600">
			{[...Array(18)].map((_, i) => {
				const a = (i / 18) * Math.PI * 2;
				const sx = 600 + Math.cos(a) * 560;
				const sy = 300 + Math.sin(a) * 280;
				return <line key={i} x1={sx} y1={sy} x2={sx + (600 - sx) * p} y2={sy + (300 - sy) * p} stroke={i % 2 ? colors.japan : colors.goldSoft} strokeWidth={6} strokeLinecap="round" />;
			})}
			<circle cx={600} cy={300} r={20 + 50 * p} fill={colors.gold} />
			<text x={600} y={325} textAnchor="middle" style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 70, fill: colors.night}} opacity={p}>
				統
			</text>
		</svg>
	);
};

// 偶然：ふたつのサイコロが同じ目
export const Dice: React.FC = () => {
	const frame = useCurrentFrame();
	const die = (cx: number, delay: number) => {
		const t = interpolate(frame, [delay, delay + 40], [0, 1], ease);
		const rot = (1 - t) * 540;
		const y = 300 - Math.abs(Math.sin(t * Math.PI * 2)) * 120 * (1 - t);
		const pips = t > 0.9 ? [[-50, -50], [50, -50], [0, 0], [-50, 50], [50, 50]] : [[0, 0]];
		return (
			<g transform={`translate(${cx} ${y}) rotate(${rot})`}>
				<rect x={-110} y={-110} width={220} height={220} rx={36} fill={colors.paper} />
				{pips.map(([x, yy], i) => (
					<circle key={i} cx={x} cy={yy} r={20} fill={colors.correct} />
				))}
			</g>
		);
	};
	return (
		<svg width={1000} height={560} viewBox="0 0 1000 560">
			<ellipse cx={500} cy={470} rx={420} ry={30} fill="#000" opacity={0.3} />
			{die(330, 0)}
			{die(670, 10)}
		</svg>
	);
};

// 虫めがねで調べる
export const Magnifier: React.FC<{readonly children: React.ReactNode}> = ({children}) => {
	const frame = useCurrentFrame();
	const x = Math.cos(frame / 30) * 120;
	const y = Math.sin(frame / 24) * 80;
	return (
		<div style={{position: 'relative'}}>
			{children}
			<svg width={300} height={360} viewBox="0 0 300 360" style={{position: 'absolute', left: '50%', top: '50%', translate: `${x - 120}px ${y - 140}px`}}>
				<circle cx={120} cy={120} r={95} fill="rgba(255,255,255,0.12)" stroke={colors.goldSoft} strokeWidth={18} />
				<line x1={190} y1={190} x2={280} y2={330} stroke={colors.woodLight} strokeWidth={30} strokeLinecap="round" />
			</svg>
		</div>
	);
};

// スマホのニュースフィード
export const PhoneNews: React.FC<{readonly headlines: string[]}> = ({headlines}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={420} height={640} viewBox="0 0 420 640">
			<rect x={10} y={10} width={400} height={620} rx={50} fill="#111" stroke="#555" strokeWidth={6} />
			<rect x={30} y={60} width={360} height={540} rx={20} fill="#f4f4f6" />
			<rect x={160} y={28} width={100} height={14} rx={7} fill="#333" />
			{headlines.map((h, i) => {
				const y = interpolate(frame, [i * 20, i * 20 + 20], [640, 90 + i * 170], ease);
				return (
					<g key={h} transform={`translate(0 ${y - 90 - i * 170})`}>
						<rect x={45} y={90 + i * 170} width={330} height={150} rx={16} fill="#fff" stroke="#ddd" strokeWidth={2} />
						<rect x={60} y={105 + i * 170} width={80} height={24} rx={6} fill={colors.correct} />
						<text x={100} y={124 + i * 170} textAnchor="middle" {...svgText(18, '#fff')}>速報</text>
						<foreignObject x={60} y={135 + i * 170} width={300} height={100}>
							<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 30, lineHeight: 1.3, color: '#111'}}>{h}</div>
						</foreignObject>
					</g>
				);
			})}
		</svg>
	);
};

// AIが日本とシュメールをつないだ？（点滅する回路）
export const AiLink: React.FC = () => {
	const frame = useCurrentFrame();
	const flicker = Math.floor(frame / 6) % 3 === 0 ? 0.25 : 1;
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<path d="M260 300 L520 300" stroke={colors.sumer} strokeWidth={8} strokeDasharray="20 12" />
			<path d="M780 300 L1040 300" stroke={colors.japan} strokeWidth={8} strokeDasharray="20 12" opacity={flicker} />
			<circle cx={200} cy={300} r={60} fill={colors.sumer} />
			<circle cx={1100} cy={300} r={60} fill={colors.japan} />
			<text x={200} y={420} textAnchor="middle" {...svgText(44, colors.sumer)}>シュメール</text>
			<text x={1100} y={420} textAnchor="middle" {...svgText(44, colors.japan)}>日本</text>
			<rect x={520} y={170} width={260} height={260} rx={30} fill="#1e2b45" stroke={colors.goldSoft} strokeWidth={6} />
			{[...Array(5)].map((_, i) => (
				<g key={i}>
					<line x1={560 + i * 45} y1={130} x2={560 + i * 45} y2={170} stroke={colors.goldSoft} strokeWidth={6} />
					<line x1={560 + i * 45} y1={430} x2={560 + i * 45} y2={470} stroke={colors.goldSoft} strokeWidth={6} />
				</g>
			))}
			<text x={650} y={330} textAnchor="middle" {...svgText(110, colors.goldSoft)}>AI</text>
			<text x={650} y={560} textAnchor="middle" {...svgText(80, colors.correct)} opacity={interpolate(frame, [30, 45], [0, 1], clamp)}>？</text>
		</svg>
	);
};

// 2万点のかけら：AIがスキャンして一つを見つける
export const FragmentGrid: React.FC<{readonly found?: boolean; readonly count?: boolean}> = ({found = false, count = false}) => {
	const frame = useCurrentFrame();
	const scan = (frame * 12) % 1400;
	const cols = 22;
	const rows = 9;
	const hit = 7 * cols + 15;
	const n = Math.round(interpolate(frame, [0, 70], [0, 20000], ease));
	return (
		<svg width={1400} height={640} viewBox="0 0 1400 640">
			{[...Array(cols * rows)].map((_, i) => {
				const x = 40 + (i % cols) * 60;
				const y = 30 + Math.floor(i / cols) * 60;
				const isHit = found && i === hit;
				return (
					<path
						key={i}
						d={`M${x} ${y + 8} L${x + 20 + (i % 5) * 4} ${y} L${x + 44} ${y + 14 + (i % 3) * 4} L${x + 38} ${y + 44} L${x + 6} ${y + 40} Z`}
						fill={isHit ? colors.gold : colors.clay}
						opacity={isHit ? 1 : interpolate(frame, [(i % 40) * 1.2, (i % 40) * 1.2 + 10], [0, 0.75], clamp)}
						stroke={isHit ? '#fff' : colors.clayDark}
						strokeWidth={isHit ? 4 : 1}
					/>
				);
			})}
			<rect x={scan - 100} y={0} width={8} height={570} fill={colors.wrong} opacity={0.6} />
			{found ? (
				<text x={40 + 15 * 60 + 20} y={30 + 7 * 60 - 30} textAnchor="middle" {...svgText(40, colors.goldSoft)} opacity={interpolate(frame, [20, 35], [0, 1], clamp)}>
					ギルガメシュ叙事詩のかけら
				</text>
			) : null}
			{count ? (
				<g>
					<rect x={430} y={190} width={540} height={170} rx={24} fill="rgba(11,18,34,0.85)" />
					<text x={700} y={310} textAnchor="middle" style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 110, fill: colors.gold}}>
						{n.toLocaleString()}点超
					</text>
				</g>
			) : null}
		</svg>
	);
};

// よみがえった春のバビロン：青い城壁、川、芽吹く麦
export const SpringBabylon: React.FC = () => {
	const frame = useCurrentFrame();
	const grow = interpolate(frame, [20, 120], [0, 1], ease);
	return (
		<svg width={1400} height={640} viewBox="0 0 1400 640">
			<defs>
				<clipPath id="babClip">
					<rect width={1400} height={640} rx={30} />
				</clipPath>
			</defs>
			<g clipPath="url(#babClip)">
				<rect width={1400} height={640} fill="#bfe0f0" />
				<circle cx={1200} cy={110} r={60} fill="#fff3c4" />
				<rect x={0} y={150} width={1400} height={200} fill="#2f5f9e" />
				{[...Array(28)].map((_, i) => (
					<rect key={i} x={i * 50} y={150} width={50} height={200} fill="none" stroke="#24508a" strokeWidth={2} />
				))}
				{[...Array(7)].map((_, i) => (
					<g key={i} transform={`translate(${100 + i * 200} 200)`}>
						{[...Array(8)].map((__, k) => (
							<ellipse key={k} cx={0} cy={-18} rx={7} ry={16} fill="#f2e2a8" transform={`rotate(${k * 45})`} />
						))}
						<circle r={8} fill="#fff" />
					</g>
				))}
				<path d="M200 300 l 60 -10 l 40 20 l -20 30 l -80 0 z" fill="#e7c25a" />
				<path d="M900 300 l 60 -10 l 40 20 l -20 30 l -80 0 z" fill="#e7c25a" />
				<rect y={350} width={1400} height={290} fill="#86b45c" />
				<path d={`M0 470 Q 350 ${420 + Math.sin(frame / 20) * 8} 700 480 T 1400 460 L1400 530 Q 1050 560 700 540 T 0 540 Z`} fill="#4a8fc2" />
				{[...Array(40)].map((_, i) => {
					const x = 20 + i * 35;
					const y = i % 2 ? 620 : 600;
					return <path key={i} d={`M${x} ${y} q 6 ${-50 * grow} 0 ${-90 * grow}`} stroke="#d9c35a" strokeWidth={6} fill="none" />;
				})}
			</g>
		</svg>
	);
};

// 砂時計：30〜40年分の作業
export const Hourglass: React.FC = () => {
	const frame = useCurrentFrame();
	const t = (frame % 150) / 150;
	return (
		<svg width={520} height={620} viewBox="0 0 520 620">
			<rect x={100} y={30} width={320} height={30} rx={10} fill={colors.woodLight} />
			<rect x={100} y={560} width={320} height={30} rx={10} fill={colors.woodLight} />
			<path d="M140 60 Q 140 250 255 310 Q 140 370 140 560 L380 560 Q 380 370 265 310 Q 380 250 380 60 Z" fill="rgba(200,230,255,0.15)" stroke={colors.muted} strokeWidth={6} />
			<path d={`M${160 + 80 * t} ${80 + 200 * t} Q 260 ${290} ${360 - 80 * t} ${80 + 200 * t} Z`} fill="#e8c27a" />
			<path d={`M160 550 Q 260 ${550 - 200 * t} 360 550 Z`} fill="#e8c27a" />
			<line x1={260} y1={300} x2={260} y2={550} stroke="#e8c27a" strokeWidth={4} strokeDasharray="6 8" strokeDashoffset={-frame * 2} />
		</svg>
	);
};

// AIの現在地：探す → つなぐ → 読む
export const Roadmap: React.FC = () => {
	const frame = useCurrentFrame();
	const steps = [
		{t: '探す', x: 250, on: true},
		{t: 'つなぐ', x: 650, on: true},
		{t: '読む', x: 1150, on: false},
	];
	const bounce = Math.abs(Math.sin(frame / 10)) * 20;
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<line x1={250} y1={330} x2={650} y2={330} stroke={colors.gold} strokeWidth={14} />
			<line x1={650} y1={330} x2={1150} y2={330} stroke={colors.muted} strokeWidth={14} strokeDasharray="24 20" />
			{steps.map((s, i) => (
				<g key={s.t} opacity={interpolate(frame, [i * 12, i * 12 + 15], [0, 1], clamp)}>
					<circle cx={s.x} cy={330} r={70} fill={s.on ? colors.gold : colors.nightLight} stroke={s.on ? colors.goldSoft : colors.muted} strokeWidth={6} />
					<text x={s.x} y={460} textAnchor="middle" {...svgText(56, s.on ? colors.text : colors.muted)}>
						{s.t}
					</text>
				</g>
			))}
			<g transform={`translate(650 ${170 - bounce})`}>
				<path d="M0 80 L-40 20 A 48 48 0 1 1 40 20 Z" fill={colors.correct} />
				<circle cy={-8} r={20} fill="#fff" />
			</g>
			<text x={650} y={70} textAnchor="middle" {...svgText(40, colors.correct)}>今ここ</text>
		</svg>
	);
};

// 5つの手がかりのアイコン
export type ClueKind = 'rock' | 'words' | 'flower' | 'ai' | 'dna';
export const ClueIcon: React.FC<{readonly kind: ClueKind; readonly size?: number}> = ({kind, size = 200}) => (
	<svg width={size} height={size} viewBox="0 0 200 200">
		{kind === 'rock' ? (
			<g>
				<path d="M20 170 C 10 110 40 50 100 40 C 160 40 190 110 180 170 Z" fill="#7b6c5c" />
				<circle cx={75} cy={110} r={20} stroke={colors.goldSoft} strokeWidth={6} fill="none" />
				<path d="M115 125 L135 90 L155 125 Z" stroke={colors.goldSoft} strokeWidth={6} fill="none" />
			</g>
		) : null}
		{kind === 'words' ? (
			<g>
				<path d="M20 40 H180 V140 H90 L50 175 V140 H20 Z" fill={colors.paper} />
				<text x={100} y={115} textAnchor="middle" style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 44, fill: colors.ink}}>
					スメラ
				</text>
			</g>
		) : null}
		{kind === 'flower' ? (
			<g transform="translate(100 100)">
				{[...Array(16)].map((_, i) => (
					<ellipse key={i} cx={0} cy={-50} rx={10} ry={30} fill={colors.gold} transform={`rotate(${i * 22.5})`} />
				))}
				<circle r={22} fill={colors.goldSoft} />
			</g>
		) : null}
		{kind === 'ai' ? (
			<g>
				<rect x={45} y={45} width={110} height={110} rx={16} fill="#1e2b45" stroke={colors.goldSoft} strokeWidth={6} />
				{[0, 1, 2].map((i) => (
					<g key={i} stroke={colors.goldSoft} strokeWidth={6}>
						<line x1={70 + i * 30} y1={20} x2={70 + i * 30} y2={45} />
						<line x1={70 + i * 30} y1={155} x2={70 + i * 30} y2={180} />
						<line x1={20} y1={70 + i * 30} x2={45} y2={70 + i * 30} />
						<line x1={155} y1={70 + i * 30} x2={180} y2={70 + i * 30} />
					</g>
				))}
				<text x={100} y={122} textAnchor="middle" {...svgText(56, colors.goldSoft)}>AI</text>
			</g>
		) : null}
		{kind === 'dna' ? (
			<g>
				{[...Array(9)].map((_, i) => {
					const y = 20 + i * 20;
					const p = Math.sin(i * 0.8) * 50;
					return (
						<g key={i}>
							<line x1={100 - p} y1={y} x2={100 + p} y2={y} stroke={colors.muted} strokeWidth={4} />
							<circle cx={100 - p} cy={y} r={9} fill={colors.japan} />
							<circle cx={100 + p} cy={y} r={9} fill={colors.wrong} />
						</g>
					);
				})}
			</g>
		) : null}
	</svg>
);

// 5つの手がかりに次々×がつく
export const ClueIcons: React.FC<{readonly count?: number}> = ({count = 5}) => {
	const frame = useCurrentFrame();
	const kinds: ClueKind[] = ['rock', 'words', 'flower', 'ai', 'dna'];
	return (
		<Center>
			{kinds.slice(0, count).map((k, i) => {
				const at = 15 + i * 14;
				return (
					<div key={k} style={{position: 'relative', opacity: interpolate(frame, [i * 6, i * 6 + 10], [0, 1], clamp)}}>
						<ClueIcon kind={k} size={230} />
						<svg width={230} height={230} viewBox="0 0 200 200" style={{position: 'absolute', inset: 0, opacity: interpolate(frame, [at, at + 4], [0, 1], clamp), scale: interpolate(frame, [at, at + 8], [1.8, 1], ease)}}>
							<path d="M30 30 L170 170 M170 30 L30 170" stroke={colors.correct} strokeWidth={18} strokeLinecap="round" />
						</svg>
					</div>
				);
			})}
		</Center>
	);
};

// 血のしずく
export const BloodDrop: React.FC = () => {
	const frame = useCurrentFrame();
	const y = interpolate(frame, [0, 25], [-200, 260], {...clamp, easing: Easing.in(Easing.quad)});
	const ripple = interpolate(frame, [25, 70], [0, 1], clamp);
	return (
		<svg width={900} height={620} viewBox="0 0 900 620">
			<ellipse cx={450} cy={480} rx={60 + ripple * 360} ry={14 + ripple * 60} fill="none" stroke={colors.correct} strokeWidth={6} opacity={frame > 25 ? 1 - ripple : 0} />
			<ellipse cx={450} cy={480} rx={30 + ripple * 200} ry={8 + ripple * 30} fill="none" stroke={colors.correct} strokeWidth={4} opacity={frame > 25 ? 1 - ripple : 0} />
			<g transform={`translate(450 ${Math.min(y, 360)})`}>
				<path d="M0 -120 C 40 -50 80 0 80 50 A 80 80 0 0 1 -80 50 C -80 0 -40 -50 0 -120 Z" fill={colors.correct} />
				<ellipse cx={-28} cy={40} rx={14} ry={26} fill="#fff" opacity={0.4} />
			</g>
		</svg>
	);
};

// 回転するDNAの二重らせん（「神の遺伝子」用の後光つき）
export const DnaHelix: React.FC<{readonly halo?: boolean; readonly mark?: string}> = ({halo = false, mark}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			{halo ? (
				<g opacity={interpolate(Math.sin(frame / 12), [-1, 1], [0.4, 0.9])}>
					{[...Array(16)].map((_, i) => (
						<line key={i} x1={650} y1={280} x2={650 + Math.cos((i / 16) * Math.PI * 2) * 600} y2={280 + Math.sin((i / 16) * Math.PI * 2) * 300} stroke={colors.goldSoft} strokeWidth={6} opacity={0.35} />
					))}
					<ellipse cx={650} cy={280} rx={560} ry={200} fill={colors.gold} opacity={0.12} />
				</g>
			) : null}
			{[...Array(26)].map((_, i) => {
				const x = 100 + i * 44;
				const ph = i * 0.5 + frame / 12;
				const a = Math.sin(ph) * 140;
				const front = Math.cos(ph) > 0;
				const marked = mark && i >= 15 && i <= 18;
				return (
					<g key={i}>
						<line x1={x} y1={280 - a} x2={x} y2={280 + a} stroke={marked ? colors.japan : colors.muted} strokeWidth={marked ? 8 : 4} opacity={0.8} />
						<circle cx={x} cy={280 - a} r={front ? 16 : 10} fill={halo ? colors.gold : colors.japan} />
						<circle cx={x} cy={280 + a} r={front ? 10 : 16} fill={halo ? colors.goldSoft : colors.wrong} />
					</g>
				);
			})}
			{mark ? (
				<g>
					<rect x={100 + 15 * 44 - 30} y={60} width={4 * 44 + 60} height={440} rx={20} fill="none" stroke={colors.japan} strokeWidth={6} strokeDasharray="16 10" />
					<text x={100 + 16.5 * 44} y={45} textAnchor="middle" {...svgText(52, colors.japan)}>
						{mark}
					</text>
				</g>
			) : null}
		</svg>
	);
};

// 父から息子へ受け継がれるY染色体
export const FatherSon: React.FC = () => {
	const frame = useCurrentFrame();
	const people = [
		{x: 230, s: 1.15, t: '祖父'},
		{x: 650, s: 1.05, t: '父'},
		{x: 1070, s: 0.85, t: '息子'},
	];
	const p = (frame % 120) / 120;
	const yx = interpolate(p, [0, 0.4, 0.5, 0.9, 1], [230, 650, 650, 1070, 1070]);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			{people.map((pp) => (
				<g key={pp.t} transform={`translate(${pp.x} 470) scale(${pp.s})`}>
					<circle cy={-260} r={55} fill={colors.wrong} opacity={0.85} />
					<path d="M-110 0 Q -110 -190 0 -195 Q 110 -190 110 0 Z" fill={colors.wrong} opacity={0.85} />
					<text y={70} textAnchor="middle" {...svgText(44)}>
						{pp.t}
					</text>
				</g>
			))}
			<g transform={`translate(${yx} 300)`}>
				<circle r={50} fill={colors.gold} />
				<text y={22} textAnchor="middle" {...svgText(64, colors.night)}>
					Y
				</text>
			</g>
		</svg>
	);
};

// メソポタミア南部の地図（チグリス・ユーフラテスと湿地）
export const MesopotamiaMap: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 60], [0, 1], ease);
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#c9a66b" />
			<path d="M900 640 Q 1000 520 1300 470 L1300 640 Z" fill="#3d6f9a" />
			<path d="M200 0 Q 380 200 600 330 Q 760 420 900 560" stroke="#3d6f9a" strokeWidth={14} fill="none" pathLength={1} style={{strokeDasharray: `${p} 1`}} />
			<path d="M560 0 Q 640 180 760 300 Q 840 380 900 560" stroke="#3d6f9a" strokeWidth={14} fill="none" pathLength={1} style={{strokeDasharray: `${p} 1`}} />
			<ellipse cx={800} cy={460} rx={150} ry={80} fill="#6f9a4f" opacity={interpolate(Math.sin(frame / 15), [-1, 1], [0.6, 0.95])} />
			{[...Array(20)].map((_, i) => (
				<line key={i} x1={680 + (i % 10) * 25} y1={430 + Math.floor(i / 10) * 40} x2={684 + (i % 10) * 25} y2={405 + Math.floor(i / 10) * 40} stroke="#3c5a28" strokeWidth={4} />
			))}
			<g opacity={interpolate(frame, [40, 60], [0, 1], clamp)}>
				<text x={300} y={160} {...svgText(36, '#1f3d5c')}>ユーフラテス川</text>
				<text x={650} y={120} {...svgText(36, '#1f3d5c')}>チグリス川</text>
				<text x={800} y={580} textAnchor="middle" {...svgText(44, '#203414')}>湿地（イラク南部）</text>
				<text x={1150} y={610} textAnchor="middle" {...svgText(32, '#e0eefa')}>ペルシア湾</text>
			</g>
		</svg>
	);
};

// 暑さで骨の中のDNAが壊れる
export const HotBone: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1200} height={620} viewBox="0 0 1200 620">
			<circle cx={1000} cy={130} r={80} fill="#ffcf5a" />
			{[...Array(12)].map((_, i) => (
				<line key={i} x1={1000 + Math.cos(i / 1.9) * 100} y1={130 + Math.sin(i / 1.9) * 100} x2={1000 + Math.cos(i / 1.9) * 140} y2={130 + Math.sin(i / 1.9) * 140} stroke="#ffcf5a" strokeWidth={8} opacity={interpolate(Math.sin(frame / 8 + i), [-1, 1], [0.3, 1])} />
			))}
			{[0, 1, 2].map((i) => (
				<path key={i} d={`M${200 + i * 300} 600 q 20 -30 0 -60 t 0 -60`} stroke="#ffb35a" strokeWidth={5} fill="none" opacity={0.5} transform={`translate(0 ${-((frame + i * 20) % 60)})`} />
			))}
			<g transform="translate(560 380) rotate(-15)">
				<rect x={-260} y={-30} width={520} height={60} rx={30} fill="#efe6d2" />
				{[-260, 260].map((x) => (
					<g key={x}>
						<circle cx={x} cy={-35} r={45} fill="#efe6d2" />
						<circle cx={x} cy={35} r={45} fill="#efe6d2" />
					</g>
				))}
			</g>
			{[...Array(8)].map((_, i) => {
				const t = ((frame + i * 15) % 120) / 120;
				return (
					<g key={i} transform={`translate(${460 + i * 30 + t * (i - 4) * 60} ${330 - t * 220}) rotate(${t * 180})`} opacity={1 - t}>
						<line x1={-16} y1={0} x2={16} y2={0} stroke={colors.japan} strokeWidth={6} />
						<circle cx={-16} r={7} fill={colors.japan} />
						<circle cx={16} r={7} fill={colors.wrong} />
					</g>
				);
			})}
		</svg>
	);
};

// 古代エジプト人のゲノム：約5分の1がメソポタミア方面
export const EgyptGenome: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 60], [0, 0.2], ease);
	const r = 150;
	const c = 2 * Math.PI * r;
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect y={470} width={620} height={130} fill="#c9a66b" />
			<path d="M60 470 L300 150 L540 470 Z" fill="#d9b67a" />
			<path d="M300 150 L540 470 L420 470 Z" fill="#b8925a" />
			<circle cx={940} cy={300} r={r} fill="none" stroke={colors.nightLight} strokeWidth={110} />
			<circle cx={940} cy={300} r={r} fill="none" stroke={colors.sumer} strokeWidth={110} strokeDasharray={`${c * p} ${c}`} transform="rotate(-90 940 300)" />
			<text x={940} y={330} textAnchor="middle" style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 90, fill: colors.text}}>1/5</text>
			<text x={940} y={560} textAnchor="middle" {...svgText(36, colors.sumer)}>メソポタミア方面</text>
		</svg>
	);
};

// 足あと：祖先の旅の記録
export const Footprints: React.FC<{readonly sea?: boolean}> = ({sea = false}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={1400} height={600} viewBox="0 0 1400 600">
			{sea ? <rect x={480} y={0} width={420} height={600} fill="#2c5687" opacity={0.6} /> : null}
			{sea ? (
				[...Array(6)].map((_, i) => (
					<path key={i} d={`M${500 + ((i * 70 + frame) % 380)} ${80 + i * 90} q 15 -10 30 0 t 30 0`} stroke="#9cc3ea" strokeWidth={4} fill="none" />
				))
			) : null}
			{[...Array(16)].map((_, i) => {
				const x = 80 + i * 82;
				const y = 380 - Math.sin(i / 2.5) * 160 + (i % 2 ? 30 : -30);
				return (
					<g key={i} transform={`translate(${x} ${y}) rotate(${70 + Math.cos(i / 2.5) * 30})`} opacity={interpolate(frame, [i * 6, i * 6 + 8], [0, 1], clamp)}>
						<ellipse rx={30} ry={16} fill={colors.goldSoft} />
						{[...Array(4)].map((__, k) => (
							<circle key={k} cx={36} cy={-12 + k * 8} r={5} fill={colors.goldSoft} />
						))}
					</g>
				);
			})}
		</svg>
	);
};

// 群馬の山あいの岩かげ
export const RockShelter: React.FC = () => {
	const frame = useCurrentFrame();
	const flame = interpolate(Math.sin(frame / 3), [-1, 1], [0.85, 1.15]);
	return (
		<svg width={1400} height={620} viewBox="0 0 1400 620">
			<defs>
				<clipPath id="shelterClip">
					<rect width={1400} height={620} rx={30} />
				</clipPath>
			</defs>
			<g clipPath="url(#shelterClip)">
				<rect width={1400} height={620} fill="#1f2b40" />
				<path d="M0 380 L200 180 L380 330 L560 140 L760 340 L960 160 L1160 320 L1400 200 L1400 620 L0 620 Z" fill="#2d4a3a" />
				<path d="M0 470 L260 300 L520 440 L800 280 L1100 450 L1400 330 L1400 620 L0 620 Z" fill="#3b5e45" />
				<path d="M500 620 L500 360 Q 560 250 760 240 Q 980 240 1020 340 L1020 400 Q 900 360 760 380 Q 640 400 620 620 Z" fill="#6a5a4a" />
				<ellipse cx={810} cy={600} rx={190} ry={40} fill="#4a3c30" />
				<g transform={`translate(800 560) scale(1 ${flame})`}>
					<path d="M0 -70 C 30 -30 40 0 0 20 C -40 0 -30 -30 0 -70 Z" fill="#ffb347" />
					<path d="M0 -40 C 15 -20 20 0 0 12 C -20 0 -15 -20 0 -40 Z" fill="#fff0a0" />
				</g>
				<circle cx={800} cy={540} r={200} fill="#ffb347" opacity={0.08 * flame} />
			</g>
		</svg>
	);
};

// 鳴りやまない通知と、置かれるスマホ
export const PhoneNotifications: React.FC = () => {
	const frame = useCurrentFrame();
	const off = interpolate(frame, [100, 120], [0, 1], clamp);
	return (
		<svg width={700} height={640} viewBox="0 0 700 640">
			<rect x={150} y={20} width={400} height={600} rx={50} fill="#111" stroke="#555" strokeWidth={6} />
			<rect x={170} y={70} width={360} height={500} rx={20} fill="#2a3a5a" />
			{[...Array(5)].map((_, i) => (
				<g key={i} opacity={interpolate(frame, [i * 12, i * 12 + 6], [0, 1], clamp) * (1 - off)}>
					<rect x={185} y={90 + i * 92} width={330} height={78} rx={14} fill="#f4f4f6" />
					<circle cx={220} cy={129 + i * 92} r={20} fill={colors.correct} />
					<rect x={255} y={112 + i * 92} width={200} height={14} rx={7} fill="#bbb" />
					<rect x={255} y={136 + i * 92} width={140} height={14} rx={7} fill="#ddd" />
				</g>
			))}
			<rect x={170} y={70} width={360} height={500} rx={20} fill="#000" opacity={off * 0.95} />
			<g opacity={1 - off}>
				<circle cx={540} cy={40} r={40} fill={colors.correct} />
				<text x={540} y={56} textAnchor="middle" {...svgText(44, '#fff')}>
					{Math.min(99, Math.floor(frame / 3))}
				</text>
			</g>
		</svg>
	);
};

// 砂に埋もれていく粘土板
export const TabletBuried: React.FC = () => {
	const frame = useCurrentFrame();
	const sink = interpolate(frame, [0, 150], [0, 260], ease);
	return (
		<svg width={1200} height={620} viewBox="0 0 1200 620">
			<g transform={`translate(0 ${sink})`}>
				<rect x={450} y={60} width={300} height={360} rx={30} fill="#b7865a" />
				{[...Array(12)].map((_, i) => (
					<text key={i} x={500 + (i % 3) * 100} y={140 + Math.floor(i / 3) * 80} textAnchor="middle" fontSize={56} fill="#5d3d22">
						{['⟟', '⊕', '⋔', '⌖', '⊞', '⋈', '⟐', '⊗', '⌘', '⋇', '⊓', '⟡'][i]}
					</text>
				))}
			</g>
			<path d="M0 420 Q 300 380 600 420 T 1200 410 L1200 620 L0 620 Z" fill="#d6b27a" />
			<path d="M0 470 Q 300 440 600 480 T 1200 470 L1200 620 L0 620 Z" fill="#c49c62" />
		</svg>
	);
};

// ハンマー石で岩をたたいて刻む
export const PeckingRock: React.FC = () => {
	const frame = useCurrentFrame();
	const cycle = frame % 16;
	const lift = interpolate(cycle, [0, 4, 8, 16], [0, -60, 0, 0], clamp);
	const dots = Math.min(24, Math.floor(frame / 16));
	return (
		<svg width={1000} height={600} viewBox="0 0 1000 600">
			<path d="M80 560 C 40 400 100 200 260 130 C 420 60 700 70 820 150 C 940 230 960 420 920 560 Z" fill="#7b6c5c" />
			{[...Array(dots)].map((_, i) => {
				const a = (i / 24) * Math.PI * 2;
				return <circle key={i} cx={500 + Math.cos(a) * 110} cy={330 + Math.sin(a) * 110} r={9} fill="#3b3128" />;
			})}
			{cycle < 3 ? <circle cx={500 + Math.cos((dots / 24) * Math.PI * 2) * 110} cy={330 + Math.sin((dots / 24) * Math.PI * 2) * 110} r={30} fill="#fff" opacity={0.4} /> : null}
			<g transform={`translate(${500 + Math.cos((dots / 24) * Math.PI * 2) * 110} ${330 + Math.sin((dots / 24) * Math.PI * 2) * 110 + lift})`}>
				<path d="M-10 0 L10 0 L40 -90 L-30 -100 Z" fill="#b8b0a4" stroke="#6b645a" strokeWidth={4} />
				<path d="M-40 -90 Q 0 -160 60 -110 L 70 -60 Q 20 -80 -30 -60 Z" fill="#e2b48a" />
			</g>
		</svg>
	);
};

// 古い写真（セピア）と文化財の札
export const OldPhoto: React.FC<{readonly children: React.ReactNode}> = ({children}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 70}}>
			<div
				style={{
					background: '#f2ead8',
					padding: '24px 24px 70px',
					rotate: '-4deg',
					boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
					filter: 'sepia(0.9) contrast(0.95)',
					position: 'relative',
				}}
			>
				<div style={{width: 640, height: 420, overflow: 'hidden', background: '#9b8a70', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<div style={{scale: '0.75'}}>{children}</div>
				</div>
				<div style={{position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center', fontFamily: gothicFamily, fontWeight: 700, fontSize: 34, color: '#5a4a32'}}>約100年前の報告写真</div>
			</div>
			<div
				style={{
					width: 300,
					padding: '30px 0',
					background: '#2f3a2a',
					border: `6px solid ${colors.goldSoft}`,
					borderRadius: 12,
					textAlign: 'center',
					fontFamily: minchoFamily,
					fontWeight: 800,
					fontSize: 52,
					color: colors.goldSoft,
					lineHeight: 1.4,
					opacity: interpolate(frame, [20, 35], [0, 1], clamp),
					translate: interpolate(frame, [20, 40], ['0px 30px', '0px 0px'], ease),
				}}
			>
				下関市
				<br />
				文化財
			</div>
		</div>
	);
};

// 得意な文書と苦手な文書
export const StrengthWeak: React.FC = () => {
	const frame = useCurrentFrame();
	const doc = (x: number, label: string, ok: boolean, i: number, icon: React.ReactNode) => (
		<g key={label} transform={`translate(${x} 120)`} opacity={interpolate(frame, [i * 10, i * 10 + 12], [0, 1], clamp)}>
			<rect x={-90} y={0} width={180} height={240} rx={14} fill={colors.paper} />
			{icon}
			<circle cx={70} cy={10} r={42} fill={ok ? colors.reed : colors.correct} />
			<text x={70} y={30} textAnchor="middle" {...svgText(56, '#fff')}>
				{ok ? '✓' : '×'}
			</text>
			<text x={0} y={310} textAnchor="middle" {...svgText(38)}>
				{label}
			</text>
		</g>
	);
	const lines = [...Array(6)].map((_, k) => <line key={k} x1={-60} x2={60} y1={60 + k * 26} y2={60 + k * 26} stroke="#b8a685" strokeWidth={6} />);
	return (
		<svg width={1700} height={680} viewBox="0 0 1500 600">
			<text x={330} y={70} textAnchor="middle" {...svgText(56, colors.reed)}>得意</text>
			<text x={1080} y={70} textAnchor="middle" {...svgText(56, colors.correct)}>苦手</text>
			<line x1={710} y1={60} x2={710} y2={520} stroke={colors.muted} strokeWidth={3} strokeDasharray="12 10" />
			{doc(200, '役所の書類', true, 0, <g>{lines}<circle cx={40} cy={200} r={22} fill="none" stroke={colors.correct} strokeWidth={5} /></g>)}
			{doc(460, '王をたたえる文', true, 1, <g>{lines}<path d="M-30 40 L-20 15 L0 35 L20 15 L30 40 Z" fill={colors.gold} /></g>)}
			{doc(870, '神話', false, 2, <path d="M-50 180 Q -60 100 0 90 Q 60 80 50 40 M-20 60 L-10 50" stroke="#6b4b2a" strokeWidth={8} fill="none" />)}
			{doc(1090, '詩', false, 3, <g>{[0, 1, 2, 3].map((k) => <path key={k} d={`M-60 ${70 + k * 40} q 30 -20 60 0 t 60 0`} stroke="#b8a685" strokeWidth={6} fill="none" />)}</g>)}
			{doc(1310, '写真から直接読む', false, 4, <g><rect x={-60} y={50} width={120} height={140} rx={10} fill={colors.clay} /><circle cx={0} cy={120} r={30} fill="none" stroke="#333" strokeWidth={6} /></g>)}
		</svg>
	);
};
