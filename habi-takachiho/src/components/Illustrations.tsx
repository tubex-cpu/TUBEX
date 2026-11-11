import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, gothicFamily, minchoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Center: React.FC<{readonly children: React.ReactNode; readonly top?: number}> = ({children, top = 110}) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			top,
			bottom: 290,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 80,
		}}
	>
		{children}
	</div>
);

const Label: React.FC<{readonly children: React.ReactNode; readonly color?: string; readonly size?: number}> = ({
	children,
	color = colors.text,
	size = 44,
}) => (
	<div
		style={{
			fontFamily: gothicFamily,
			fontWeight: 900,
			fontSize: Math.max(size, 54),
			color,
			textAlign: 'center',
			marginTop: 18,
			padding: '10px 34px',
			borderRadius: 14,
			background: 'rgba(5, 9, 18, 0.88)',
			border: `3px solid ${colors.gold}`,
			textShadow: '0 2px 4px rgba(0,0,0,0.8)',
		}}
	>
		{children}
	</div>
);

// くさびの形（1本分）
const Wedge: React.FC<{readonly x: number; readonly y: number; readonly r: number; readonly o: number}> = ({x, y, r, o}) => (
	<g transform={`translate(${x} ${y}) rotate(${r})`} opacity={o}>
		<path d="M0 0 L28 -9 L28 9 Z" fill={colors.clayDark} />
		<path d="M28 -2 L90 0 L28 2 Z" fill={colors.clayDark} />
	</g>
);

// 粘土板：くさび形文字が一つずつ押されていく
export const ClayTablet: React.FC<{readonly width?: number}> = ({width = 560}) => {
	const frame = useCurrentFrame();
	const wedges: [number, number, number][] = [];
	for (let row = 0; row < 5; row++) {
		for (let col = 0; col < 4; col++) {
			wedges.push([70 + col * 105, 90 + row * 80, (row * 4 + col) % 3 === 0 ? 90 : (row + col) % 2 ? 0 : 35]);
		}
	}
	return (
		<svg width={width} height={width * 1.12} viewBox="0 0 500 560">
			<rect x={20} y={20} width={460} height={520} rx={60} fill={colors.clay} />
			<rect x={20} y={20} width={460} height={520} rx={60} fill="url(#clayShade)" />
			<defs>
				<radialGradient id="clayShade" cx="40%" cy="35%" r="80%">
					<stop offset="0%" stopColor="#fff" stopOpacity={0.18} />
					<stop offset="100%" stopColor="#000" stopOpacity={0.3} />
				</radialGradient>
			</defs>
			{wedges.map(([x, y, r], i) => (
				<Wedge key={i} x={x} y={y} r={r} o={interpolate(frame, [i * 4, i * 4 + 6], [0, 1], clamp)} />
			))}
		</svg>
	);
};

// ふたつの土地：メソポタミアと日本列島を結ぶ点線
export const TwoLands: React.FC<{readonly showLine?: boolean; readonly broken?: boolean}> = ({showLine = true, broken = false}) => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame, [20, 110], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	return (
		<Center>
			<svg width={1500} height={620} viewBox="0 0 1500 620">
				{/* ユーラシア大陸のシルエット（簡略） */}
				<path
					d="M60 260 C 200 120 420 90 640 110 C 860 70 1080 90 1230 150 C 1300 190 1310 260 1260 320 C 1200 380 1180 430 1100 470 C 980 520 860 470 760 500 C 640 540 560 470 470 450 C 380 430 300 470 220 430 C 120 390 30 340 60 260 Z"
					fill={colors.nightLight}
					stroke="#2d3e63"
					strokeWidth={3}
				/>
				{/* 日本列島（簡略） */}
				<path d="M1330 210 C 1360 230 1375 270 1365 320 C 1350 370 1325 400 1300 430 L 1290 420 C 1315 380 1340 340 1345 300 C 1350 260 1335 230 1320 215 Z" fill={colors.japan} />
				<path d="M1270 440 C 1285 450 1290 470 1275 485 L 1262 478 C 1270 465 1268 452 1262 445 Z" fill={colors.japan} />
				{/* メソポタミア */}
				<circle cx={470} cy={330} r={22} fill={colors.sumer} />
				<circle cx={470} cy={330} r={22 + (frame % 60) / 2} fill="none" stroke={colors.sumer} strokeWidth={3} opacity={1 - (frame % 60) / 60} />
				<circle cx={1325} cy={330} r={14} fill={colors.japan} />
				<text x={470} y={400} fill={colors.sumer} fontFamily={gothicFamily} fontWeight={900} fontSize={42} textAnchor="middle">シュメール</text>
				<text x={1325} y={540} fill={colors.japan} fontFamily={gothicFamily} fontWeight={900} fontSize={42} textAnchor="middle">日本列島（縄文）</text>
				{showLine ? (
					<path
						d="M470 330 Q 900 60 1320 320"
						fill="none"
						stroke={colors.goldSoft}
						strokeWidth={5}
						strokeDasharray="18 14"
						pathLength={1}
						style={{strokeDasharray: `${broken ? progress * 0.45 : progress} 1`}}
					/>
				) : null}
				{broken ? (
					<text x={900} y={170} textAnchor="middle" fill={colors.correct} fontFamily={gothicFamily} fontWeight={900} fontSize={120} opacity={interpolate(frame, [90, 105], [0, 1], clamp)}>×</text>
				) : null}
				<text x={900} y={150} fill={colors.muted} fontFamily={gothicFamily} fontWeight={700} fontSize={34} textAnchor="middle" opacity={broken ? 0 : progress}>約7,000 km</text>
			</svg>
		</Center>
	);
};

// 彦島杉田の岩：丸・三角・四角・人の形
export const PetroglyphRock: React.FC<{readonly highlight?: boolean}> = ({highlight = false}) => {
	const frame = useCurrentFrame();
	const glow = highlight ? interpolate(Math.sin(frame / 10), [-1, 1], [0.5, 1]) : 1;
	const stroke = highlight ? colors.goldSoft : '#3b3128';
	return (
		<svg width={900} height={600} viewBox="0 0 900 600">
			<path d="M80 520 C 40 380 90 200 220 120 C 360 40 600 50 720 130 C 840 210 870 380 820 520 Z" fill="#7b6c5c" />
			<path d="M80 520 C 40 380 90 200 220 120 C 360 40 600 50 720 130 C 840 210 870 380 820 520 Z" fill="url(#rockShade)" />
			<defs>
				<radialGradient id="rockShade" cx="35%" cy="30%" r="80%">
					<stop offset="0%" stopColor="#fff" stopOpacity={0.15} />
					<stop offset="100%" stopColor="#000" stopOpacity={0.45} />
				</radialGradient>
			</defs>
			<g stroke={stroke} strokeWidth={10} fill="none" strokeLinecap="round" opacity={glow}>
				<circle cx={260} cy={260} r={55} />
				<circle cx={260} cy={260} r={18} />
				<path d="M420 200 L490 320 L350 320 Z" />
				<rect x={560} y={200} width={110} height={110} />
				<circle cx={420} cy={400} r={22} />
				<path d="M420 422 L420 480 M380 445 L460 445 M420 480 L390 520 M420 480 L450 520" />
				<path d="M600 400 C 640 360 690 400 660 440 C 630 480 580 450 600 400" />
			</g>
			{[...Array(40)].map((_, i) => (
				<circle key={i} cx={120 + ((i * 97) % 680)} cy={150 + ((i * 53) % 360)} r={3} fill="#5b4f43" opacity={0.6} />
			))}
		</svg>
	);
};

// 葦のペンで粘土に押す
export const ReedPress: React.FC = () => {
	const frame = useCurrentFrame();
	const cycle = frame % 50;
	const down = interpolate(cycle, [0, 12, 18, 30], [-200, 0, 0, -200], clamp);
	const marks = Math.min(6, Math.floor(frame / 50) + 1);
	const penX = 140 + (marks - 1) * 90;
	return (
		<svg width={760} height={560} viewBox="0 0 760 560">
			<rect x={80} y={340} width={600} height={200} rx={40} fill={colors.clay} />
			{[...Array(marks)].map((_, i) => (
				<Wedge key={i} x={140 + i * 90} y={380} r={90} o={i < marks - 1 || cycle > 12 ? 1 : 0} />
			))}
			<g transform={`translate(${penX} ${380 + down}) rotate(-20)`}>
				<rect x={-14} y={-320} width={28} height={300} rx={10} fill={colors.reed} />
				<path d="M-14 -20 L14 -20 L0 0 Z" fill="#5c7a3c" />
				{[80, 160, 240].map((y) => (
					<rect key={y} x={-16} y={-y} width={32} height={8} fill="#5c7a3c" />
				))}
			</g>
		</svg>
	);
};

// 比較カード（左右に並べる）
export const CompareCards: React.FC<{
	readonly left: React.ReactNode;
	readonly right: React.ReactNode;
	readonly leftLabel: string;
	readonly rightLabel: string;
	readonly leftColor?: string;
	readonly rightColor?: string;
	readonly vs?: string;
}> = ({left, right, leftLabel, rightLabel, leftColor = colors.japan, rightColor = colors.sumer, vs = 'VS'}) => {
	const frame = useCurrentFrame();
	return (
		<Center>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', translate: interpolate(frame, [0, 20], ['-60px 0px', '0px 0px'], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)})}}>
				{left}
				<Label color={leftColor}>{leftLabel}</Label>
			</div>
			<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 80, color: colors.gold, opacity: interpolate(frame, [15, 30], [0, 1], clamp)}}>{vs}</div>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', translate: interpolate(frame, [0, 20], ['60px 0px', '0px 0px'], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)})}}>
				{right}
				<Label color={rightColor}>{rightLabel}</Label>
			</div>
		</Center>
	);
};

// 16弁の菊
export const Chrysanthemum: React.FC<{readonly size?: number}> = ({size = 460}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={size} viewBox="-120 -120 240 240">
			{[...Array(16)].map((_, i) => (
				<g key={i} transform={`rotate(${i * 22.5})`} opacity={interpolate(frame, [i * 2, i * 2 + 8], [0, 1], clamp)}>
					<path d="M0 -26 C 14 -40 16 -80 10 -104 C 6 -112 -6 -112 -10 -104 C -16 -80 -14 -40 0 -26 Z" fill={colors.gold} stroke="#9a7a2c" strokeWidth={2} />
				</g>
			))}
			{[...Array(16)].map((_, i) => (
				<circle key={i} cx={Math.sin((i * 22.5 + 11.25) * (Math.PI / 180)) * 104} cy={-Math.cos((i * 22.5 + 11.25) * (Math.PI / 180)) * 104} r={6} fill={colors.gold} opacity={interpolate(frame, [36, 44], [0, 1], clamp)} />
			))}
			<circle r={26} fill={colors.gold} stroke="#9a7a2c" strokeWidth={3} />
		</svg>
	);
};

// メソポタミアのロゼット文様（ウルの金の花飾り）
export const Rosette: React.FC<{readonly size?: number; readonly petals?: number; readonly color?: string}> = ({
	size = 460,
	petals = 12,
	color = '#f2c95a',
}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={size} viewBox="-120 -120 240 240">
			<circle r={116} fill={colors.wrong} opacity={0.25} />
			{[...Array(petals)].map((_, i) => (
				<g key={i} transform={`rotate(${(i * 360) / petals})`} opacity={interpolate(frame, [i * 2, i * 2 + 8], [0, 1], clamp)}>
					<ellipse cx={0} cy={-62} rx={18} ry={44} fill={color} stroke="#a7802a" strokeWidth={2} />
				</g>
			))}
			<circle r={24} fill="#fff1c2" stroke="#a7802a" strokeWidth={3} />
			<circle r={10} fill={color} />
		</svg>
	);
};

// 年表：ウル王墓（前2600年ごろ）→ 後鳥羽上皇（1200年ごろ）
export const GapTimeline: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 90], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	const toX = (year: number) => 160 + ((year + 2800) / 4900) * 1280;
	return (
		<Center>
			<svg width={1600} height={500} viewBox="0 0 1600 500">
				<line x1={160} y1={250} x2={1440} y2={250} stroke={colors.muted} strokeWidth={8} />
				{[-2500, -2000, -1500, -1000, -500, 0, 500, 1000, 1500, 2000].map((y) => (
					<g key={y}>
						<line x1={toX(y)} y1={234} x2={toX(y)} y2={266} stroke={colors.muted} strokeWidth={3} />
						<text x={toX(y)} y={310} fill={colors.muted} fontFamily={gothicFamily} fontSize={30} textAnchor="middle">
							{y < 0 ? `前${-y}` : y === 0 ? '0' : `${y}`}
						</text>
					</g>
				))}
				<rect x={toX(-2600)} y={226} width={(toX(1200) - toX(-2600)) * p} height={48} fill={colors.half} opacity={0.35} />
				<circle cx={toX(-2600)} cy={250} r={20} fill={colors.sumer} />
				<text x={toX(-2600)} y={180} fill={colors.sumer} fontFamily={gothicFamily} fontWeight={900} fontSize={44} textAnchor="middle">ウルの王墓</text>
				<g opacity={interpolate(frame, [80, 95], [0, 1], clamp)}>
					<circle cx={toX(1200)} cy={250} r={20} fill={colors.japan} />
					<text x={toX(1200)} y={180} fill={colors.japan} fontFamily={gothicFamily} fontWeight={900} fontSize={44} textAnchor="middle">鎌倉・後鳥羽上皇</text>
				</g>
				<text x={(toX(-2600) + toX(1200)) / 2} y={400} fill={colors.goldSoft} fontFamily={minchoFamily} fontWeight={800} fontSize={72} textAnchor="middle" opacity={interpolate(frame, [90, 110], [0, 1], clamp)}>
					3000年以上の空白
				</text>
				<text x={(toX(-2600) + toX(1200)) / 2} y={140} fill={colors.text} fontFamily={minchoFamily} fontWeight={800} fontSize={80} textAnchor="middle" opacity={interpolate(frame, [95, 115], [0, 1], clamp)}>
					？
				</text>
			</svg>
		</Center>
	);
};

// 割れた粘土板のかけらがつながる
export const PuzzleFragments: React.FC<{readonly assemble?: boolean}> = ({assemble = true}) => {
	const frame = useCurrentFrame();
	const p = assemble ? interpolate(frame, [20, 120], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)}) : 0;
	const pieces = [
		{d: 'M0 0 L180 0 L160 120 L90 150 L0 110 Z', x: 0, y: 0, sx: -420, sy: -160, r: -30},
		{d: 'M180 0 L400 0 L400 130 L250 160 L160 120 Z', x: 0, y: 0, sx: 380, sy: -200, r: 40},
		{d: 'M0 110 L90 150 L160 120 L250 160 L220 300 L0 300 Z', x: 0, y: 0, sx: -360, sy: 220, r: 25},
		{d: 'M250 160 L400 130 L400 300 L220 300 Z', x: 0, y: 0, sx: 420, sy: 180, r: -45},
	];
	return (
		<svg width={1100} height={640} viewBox="-350 -170 1100 640">
			{pieces.map((pc, i) => (
				<g key={i} transform={`translate(${pc.sx * (1 - p)} ${pc.sy * (1 - p)}) rotate(${pc.r * (1 - p)} 200 150)`}>
					<path d={pc.d} fill={colors.clay} stroke={colors.clayDark} strokeWidth={4} />
					{[...Array(6)].map((_, k) => (
						<path key={k} d={`M${30 + ((k * 61 + i * 97) % 340)} ${30 + ((k * 43 + i * 71) % 240)} l18 -6 l0 12 z`} fill={colors.clayDark} />
					))}
				</g>
			))}
			<text x={200} y={420} fill={colors.goldSoft} fontFamily={gothicFamily} fontWeight={900} fontSize={44} textAnchor="middle" opacity={p}>
				AIがかけら同士を照合
			</text>
		</svg>
	);
};

// 数字のカウントアップ
export const CountUp: React.FC<{readonly to: number; readonly suffix: string; readonly caption: string}> = ({to, suffix, caption}) => {
	const frame = useCurrentFrame();
	const v = Math.round(interpolate(frame, [0, 60], [0, to], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)}));
	return (
		<Center>
			<div style={{textAlign: 'center'}}>
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 200, color: colors.gold}}>
					{v.toLocaleString()}
					<span style={{fontSize: 90}}>{suffix}</span>
				</div>
				<Label size={50}>{caption}</Label>
			</div>
		</Center>
	);
};

// AIの通知表：10点満点で4点
export const ScoreMeter: React.FC = () => {
	const frame = useCurrentFrame();
	const filled = interpolate(frame, [10, 60], [0, 4], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
	return (
		<Center>
			<div style={{textAlign: 'center'}}>
				<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 52, color: colors.text, marginBottom: 30}}>
					AI翻訳（アッカド語→英語）の通知表
				</div>
				<div style={{display: 'flex', gap: 16, justifyContent: 'center'}}>
					{[...Array(10)].map((_, i) => (
						<div
							key={i}
							style={{
								width: 100,
								height: 140,
								borderRadius: 14,
								border: `4px solid ${colors.muted}`,
								background: i < filled ? colors.half : 'transparent',
								opacity: i < filled ? interpolate(filled - i, [0, 1], [0.3, 1], clamp) : 0.6,
							}}
						/>
					))}
				</div>
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 140, color: colors.half, marginTop: 20}}>
					{Math.round(filled)}
					<span style={{fontSize: 60, color: colors.muted}}> / 10点</span>
				</div>
			</div>
		</Center>
	);
};

// Y染色体の家系図：D と J は遠い枝
export const HaploTree: React.FC<{readonly emphasize?: 'D' | 'J' | 'both'}> = ({emphasize = 'both'}) => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [0, 60], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	const dOn = emphasize !== 'J';
	const jOn = emphasize !== 'D';
	return (
		<Center>
			<svg width={1500} height={620} viewBox="0 0 1500 620">
				<g fill="none" strokeWidth={10} strokeLinecap="round" pathLength={1}>
					<path d="M750 590 L750 470" stroke={colors.muted} pathLength={1} style={{strokeDasharray: `${draw} 1`}} />
					<path d="M750 470 C 750 400 420 400 420 300" stroke={dOn ? colors.japan : colors.muted} pathLength={1} style={{strokeDasharray: `${draw} 1`}} />
					<path d="M750 470 C 750 400 1080 400 1080 300" stroke={jOn ? colors.sumer : colors.muted} pathLength={1} style={{strokeDasharray: `${draw} 1`}} />
					<path d="M420 300 C 420 220 260 220 260 140" stroke={dOn ? colors.japan : colors.muted} pathLength={1} style={{strokeDasharray: `${draw} 1`}} />
					<path d="M420 300 C 420 220 580 220 580 140" stroke={colors.muted} pathLength={1} style={{strokeDasharray: `${draw} 1`}} />
					<path d="M1080 300 C 1080 220 920 220 920 140" stroke={colors.muted} pathLength={1} style={{strokeDasharray: `${draw} 1`}} />
					<path d="M1080 300 C 1080 220 1240 220 1240 140" stroke={jOn ? colors.sumer : colors.muted} pathLength={1} style={{strokeDasharray: `${draw} 1`}} />
				</g>
				<g fontFamily={gothicFamily} fontWeight={900} textAnchor="middle" opacity={interpolate(frame, [40, 60], [0, 1], clamp)}>
					<text x={750} y={460} fontSize={38} fill={colors.muted} dx={110}>人類の祖先（アフリカ）</text>
					<text x={420} y={330} fontSize={38} fill={colors.muted} dx={-90}>YAP</text>
					<text x={260} y={110} fontSize={84} fill={colors.japan}>D</text>
					<text x={260} y={40} fontSize={38} fill={colors.text}>日本・チベット・アンダマン</text>
					<text x={580} y={110} fontSize={64} fill={colors.muted}>E</text>
					<text x={920} y={110} fontSize={64} fill={colors.muted}>…</text>
					<text x={1240} y={110} fontSize={84} fill={colors.sumer}>J</text>
					<text x={1240} y={40} fontSize={38} fill={colors.text}>イラク南部の湿地・中東</text>
					<text x={420} y={420} fontSize={38} fill={colors.japan} dx={-60}>約7万年前に分岐</text>
				</g>
			</svg>
		</Center>
	);
};

// 葦の原（イラク南部の湿地）
export const ReedMarsh: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}} preserveAspectRatio="xMidYMid slice">
			<defs>
				<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#2b2d5a" />
					<stop offset="60%" stopColor="#d9895a" />
					<stop offset="100%" stopColor="#f2c27a" />
				</linearGradient>
			</defs>
			<rect width={1920} height={1080} fill="url(#dusk)" />
			<circle cx={1400} cy={620} r={90} fill="#ffe2a6" opacity={0.9} />
			<rect y={700} width={1920} height={380} fill="#3a4a5a" opacity={0.85} />
			{[...Array(70)].map((_, i) => {
				const x = (i * 29) % 1920;
				const h = 260 + ((i * 53) % 220);
				const sway = Math.sin(frame / 30 + i) * 12;
				return (
					<g key={i}>
						<path d={`M${x} 1080 Q ${x + sway / 2} ${1080 - h / 2} ${x + sway} ${1080 - h}`} stroke="#2e3a22" strokeWidth={6} fill="none" />
						<ellipse cx={x + sway} cy={1080 - h - 20} rx={8} ry={28} fill="#4a3a22" />
					</g>
				);
			})}
			{/* 葦の家（ムディーフ） */}
			<path d="M520 720 Q 700 520 880 720 Z" fill="#a8844f" />
			{[560, 620, 680, 740, 800, 840].map((x) => (
				<line key={x} x1={x} y1={720} x2={x} y2={640} stroke="#7a5d33" strokeWidth={4} />
			))}
		</svg>
	);
};

// 日本列島と群馬の岩陰遺跡
export const JapanGunma: React.FC = () => {
	const frame = useCurrentFrame();
	const pulse = (frame % 50) / 50;
	return (
		<Center>
			<svg width={900} height={640} viewBox="0 0 900 640">
				<path
					d="M620 40 C 700 60 760 120 720 170 C 690 200 640 190 610 160 C 590 130 590 80 620 40 Z M560 220 C 620 230 640 300 600 370 C 560 440 480 480 380 500 C 330 510 300 490 320 470 C 380 450 440 410 480 360 C 520 310 520 250 560 220 Z M290 500 C 320 510 320 550 290 570 C 260 590 220 580 230 555 C 240 530 260 505 290 500 Z M330 520 C 370 520 390 540 360 560 L 340 560 Z"
					fill={colors.japan}
					opacity={0.85}
				/>
				<circle cx={520} cy={330} r={14} fill={colors.goldSoft} />
				<circle cx={520} cy={330} r={14 + pulse * 40} fill="none" stroke={colors.goldSoft} strokeWidth={4} opacity={1 - pulse} />
				<text x={600} y={320} fill={colors.goldSoft} fontFamily={gothicFamily} fontWeight={900} fontSize={44}>群馬・岩かげ</text>
				<text x={600} y={380} fill={colors.text} fontFamily={gothicFamily} fontWeight={700} fontSize={36}>約8300年前の縄文女性</text>
			</svg>
		</Center>
	);
};

// ふたつの流れが合わさる（縄文＋渡来）
export const TwoStreams: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 90], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	return (
		<Center>
			<svg width={1400} height={600} viewBox="0 0 1400 600">
				<path d="M100 120 C 400 120 500 300 800 300" stroke={colors.japan} strokeWidth={40} fill="none" strokeLinecap="round" pathLength={1} style={{strokeDasharray: `${p} 1`}} />
				<path d="M100 480 C 400 480 500 300 800 300" stroke={colors.wrong} strokeWidth={40} fill="none" strokeLinecap="round" pathLength={1} style={{strokeDasharray: `${p} 1`}} />
				<path d="M800 300 L 1300 300" stroke={colors.gold} strokeWidth={70} fill="none" strokeLinecap="round" pathLength={1} style={{strokeDasharray: `${interpolate(frame, [80, 140], [0, 1], clamp)} 1`}} />
				<g fontFamily={gothicFamily} fontWeight={900} fontSize={42}>
					<text x={100} y={70} fill={colors.japan}>縄文人の流れ</text>
					<text x={100} y={560} fill={colors.wrong}>海を渡ってきた人々の流れ</text>
					<text x={1300} y={230} fill={colors.gold} textAnchor="end" opacity={interpolate(frame, [120, 150], [0, 1], clamp)}>今の日本人</text>
				</g>
			</svg>
		</Center>
	);
};

// 原エラム文字の粘土板：誰にも読めない文字
export const UnreadTablet: React.FC<{readonly fading?: boolean}> = ({fading = false}) => {
	const frame = useCurrentFrame();
	const glyphs = ['⟟', '⊕', '⋔', '⌖', '⊞', '⋈', '⟐', '⊗', '⌘', '⋇', '⊓', '⟡', '⊡', '⋒', '⟠', '⌬'];
	return (
		<svg width={600} height={640} viewBox="0 0 600 640">
			<rect x={40} y={30} width={520} height={580} rx={50} fill="#b7865a" />
			{glyphs.map((g, i) => (
				<text
					key={i}
					x={120 + (i % 4) * 120}
					y={150 + Math.floor(i / 4) * 130}
					fontSize={80}
					fill="#5d3d22"
					textAnchor="middle"
					opacity={fading ? interpolate(frame, [i * 6, i * 6 + 40], [1, 0.08], clamp) : interpolate(frame, [i * 3, i * 3 + 10], [0, 1], clamp)}
				>
					{g}
				</text>
			))}
		</svg>
	);
};

// 文の組み立てブロック：「王は／神殿を／建てた」
export const GrammarBlocks: React.FC = () => {
	const frame = useCurrentFrame();
	const rows = [
		{lang: '日本語', parts: ['王は', '神殿を', '建てた'], color: colors.japan},
		{lang: 'シュメール語', parts: ['lugal-e', 'e₂', 'mu-un-du₃'], color: colors.sumer},
	];
	return (
		<Center>
			<div style={{display: 'flex', flexDirection: 'column', gap: 60}}>
				{rows.map((r, ri) => (
					<div key={r.lang} style={{display: 'flex', alignItems: 'center', gap: 24}}>
						<div style={{width: 300, fontFamily: gothicFamily, fontWeight: 900, fontSize: 44, color: r.color, textAlign: 'right'}}>{r.lang}</div>
						{r.parts.map((p, i) => (
							<div
								key={p}
								style={{
									fontFamily: gothicFamily,
									fontWeight: 900,
									fontSize: 60,
									color: colors.night,
									background: i === 2 ? colors.goldSoft : colors.paper,
									borderRadius: 14,
									padding: '18px 34px',
									opacity: interpolate(frame, [ri * 20 + i * 10, ri * 20 + i * 10 + 10], [0, 1], clamp),
									translate: interpolate(frame, [ri * 20 + i * 10, ri * 20 + i * 10 + 14], ['0px -30px', '0px 0px'], clamp),
								}}
							>
								{p}
							</div>
						))}
					</div>
				))}
				<div style={{fontFamily: gothicFamily, fontWeight: 700, fontSize: 40, color: colors.muted, textAlign: 'center', opacity: interpolate(frame, [60, 80], [0, 1], clamp)}}>
					主語 → 目的語 → 動詞（動詞が最後）
				</div>
			</div>
		</Center>
	);
};

// 円グラフ：動詞が最後に来る言語は世界の約4割
export const SovPie: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 50], [0, 0.41], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
	const r = 200;
	const c = 2 * Math.PI * r;
	return (
		<Center>
			<svg width={560} height={560} viewBox="-280 -280 560 560">
				<circle r={r} fill="none" stroke={colors.nightLight} strokeWidth={120} />
				<circle r={r} fill="none" stroke={colors.half} strokeWidth={120} strokeDasharray={`${c * p} ${c}`} transform="rotate(-90)" />
				<text y={30} textAnchor="middle" fill={colors.text} fontFamily={minchoFamily} fontWeight={800} fontSize={110}>約4割</text>
			</svg>
			<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 52, color: colors.text, lineHeight: 1.6}}>
				動詞が最後に来る言葉
				<div style={{fontSize: 40, color: colors.muted, fontWeight: 700}}>トルコ語・韓国語・モンゴル語……</div>
			</div>
		</Center>
	);
};

// 名札：シュメール（他称）とケンギル（自称）
export const NameTags: React.FC = () => {
	const frame = useCurrentFrame();
	const tag = (title: string, sub: string, color: string, delay: number, strike = false) => (
		<div
			style={{
				background: colors.paper,
				borderRadius: 20,
				padding: '40px 70px',
				textAlign: 'center',
				borderTop: `16px solid ${color}`,
				opacity: interpolate(frame, [delay, delay + 12], [0, 1], clamp),
				translate: interpolate(frame, [delay, delay + 18], ['0px 40px', '0px 0px'], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)}),
			}}
		>
			<div style={{fontFamily: gothicFamily, fontWeight: 700, fontSize: 36, color: '#6b5f4c'}}>{sub}</div>
			<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 110, color: colors.ink, textDecoration: strike ? 'line-through' : undefined}}>{title}</div>
		</div>
	);
	return (
		<Center>
			{tag('シュメール', 'アッカド人がつけた呼び名（他称）', colors.half, 0)}
			{tag('ケンギル', '本人たちの呼び名（自称）', colors.correct, 40)}
		</Center>
	);
};

export {Center, Label};
