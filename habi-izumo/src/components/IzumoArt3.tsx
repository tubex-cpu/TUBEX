import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, Reveal, svgGothic, svgMincho} from './Cinema';
import {Canvas, rand} from './IzumoKit';

// 出雲判決：第15の手がかり〜本当の物語の図解

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const WOOD = '#b9895c';

// 第15の手がかり：波の上に逆さに突き立てた剣
export const SwordOnWave: React.FC = () => {
	const frame = useCurrentFrame();
	const drop = interpolate(frame, [10, 50], [-500, 0], easeOut);
	const glow = 0.6 + 0.4 * Math.sin(frame / 8);
	return (
		<Canvas tone="night">
			{[...Array(6)].map((_, k) => (
				<path
					key={k}
					d={`M 0 ${760 + k * 50} ${[...Array(13)].map((_, i) => `Q ${i * 160 + 80} ${740 + k * 50 + Math.sin(frame / 12 + i + k) * 18} ${(i + 1) * 160} ${760 + k * 50}`).join(' ')}`}
					stroke="#3a7a96"
					strokeWidth={6}
					fill="none"
					opacity={0.8 - k * 0.1}
				/>
			))}
			<g transform={`translate(960 ${740 + drop})`}>
				<circle cx={0} cy={-330} r={120} fill="#ffe2a0" opacity={0.12 * glow} />
				<path d="M -26 -40 L 0 40 L 26 -40 L 22 -470 L -22 -470 Z" fill="#cfd8e0" />
				<rect x={-90} y={-500} width={180} height={34} rx={8} fill="#b08a4a" />
				<rect x={-16} y={-640} width={32} height={140} fill="#6b4a2e" />
			</g>
			<text x={960} y={330} textAnchor="middle" {...svgMincho(52, colors.goldSoft)} opacity={interpolate(frame, [60, 80], [0, 1], clamp)}>
				切っ先を上に、波の上に
			</text>
		</Canvas>
	);
};

// 第15の手がかり：6世紀の東西の大きな古墳（前方後方墳と前方後円墳）
export const TwoKofun: React.FC = () => {
	const frame = useCurrentFrame();
	const k = 4.4;
	const square = (len: number) => {
		const a = len * 0.45;
		return `M ${-a} ${-a * 0.9} L ${a * 0.2} ${-a * 0.9} L ${a * 0.2} ${-a * 0.4} L ${len - a} ${-a * 0.7} L ${len - a} ${a * 0.7} L ${a * 0.2} ${a * 0.4} L ${a * 0.2} ${a * 0.9} L ${-a} ${a * 0.9} Z`;
	};
	const round = (len: number) => {
		const r = len * 0.45;
		return `M 0 ${-r} A ${r} ${r} 0 1 0 0 ${r} L ${len - r} ${r * 0.8} L ${len - r} ${-r * 0.8} Z`;
	};
	return (
		<Canvas tone="moss">
			<Reveal at={8}>
				<g transform={`translate(400 560) scale(${k})`}>
					<path d={square(94)} fill="#4b6a3a" stroke="#a8c48a" strokeWidth={0.6} />
				</g>
				<text x={560} y={790} textAnchor="middle" {...svgMincho(50, colors.goldSoft)}>
					山代二子塚古墳
				</text>
				<text x={560} y={845} textAnchor="middle" {...svgGothic(34, '#e6efd8', 900)}>
					前方後方墳・約94m（東）
				</text>
			</Reveal>
			<Reveal at={40}>
				<g transform={`translate(1330 560) scale(${k})`}>
					<path d={round(92)} fill="#4b6a3a" stroke="#a8c48a" strokeWidth={0.6} />
				</g>
				<text x={1430} y={790} textAnchor="middle" {...svgMincho(50, colors.goldSoft)}>
					今市大念寺古墳
				</text>
				<text x={1430} y={845} textAnchor="middle" {...svgGothic(34, '#e6efd8', 900)}>
					前方後円墳・約92m（西）
				</text>
			</Reveal>
			<text x={960} y={620} textAnchor="middle" {...svgMincho(60, '#c9d3e3')} opacity={interpolate(frame, [70, 90], [0, 1], clamp)}>
				東と西
			</text>
		</Canvas>
	);
};

// 第15の手がかり：地中レーダーで、掘らずに石室を探す
export const GprScan: React.FC = () => {
	const frame = useCurrentFrame();
	const sweep = interpolate(frame, [10, 120], [260, 1660], easeInOut);
	const found = interpolate(frame, [80, 110], [0, 1], clamp);
	return (
		<Canvas tone="ink">
			<path d="M 120 520 Q 960 300 1800 520 L 1800 1080 L 120 1080 Z" fill="#2c2418" />
			<path d="M 120 520 Q 960 300 1800 520" stroke="#7aa05a" strokeWidth={10} fill="none" />
			{[...Array(40)].map((_, i) => (
				<line key={i} x1={160 + i * 42} y1={560 + rand(i) * 40} x2={160 + i * 42} y2={1040} stroke="#3a3024" strokeWidth={2} opacity={sweep > 160 + i * 42 ? 0.9 : 0} />
			))}
			<g opacity={found}>
				<rect x={780} y={620} width={460} height={180} fill="none" stroke="#ffcf7a" strokeWidth={6} strokeDasharray="20 12" />
				<text x={1010} y={725} textAnchor="middle" {...svgMincho(44, '#ffcf7a')}>
					石室？
				</text>
				<text x={1010} y={860} textAnchor="middle" {...svgGothic(34, '#efe6d2', 900)}>
					長さ11.5m・幅4.5m（可能性）
				</text>
			</g>
			<g transform={`translate(${sweep} 400)`}>
				<rect x={-60} y={-40} width={120} height={60} rx={10} fill="#d8dee6" />
				<circle cx={-36} cy={30} r={14} fill="#333" />
				<circle cx={36} cy={30} r={14} fill="#333" />
				{[0, 1, 2].map((r) => (
					<path key={r} d={`M ${-40 - r * 40} ${60 + r * 30} Q 0 ${120 + r * 60} ${40 + r * 40} ${60 + r * 30}`} stroke="#9fd6ff" strokeWidth={4} fill="none" opacity={0.6 - r * 0.15} />
				))}
			</g>
		</Canvas>
	);
};

// 第16の手がかり：雲太・和二・京三（大きい順の表彰台）
export const Podium: React.FC = () => {
	const frame = useCurrentFrame();
	const items = [
		{x: 960, h: 360, rank: '雲太', name: '出雲大社', at: 70},
		{x: 520, h: 250, rank: '和二', name: '東大寺 大仏殿', at: 40},
		{x: 1400, h: 170, rank: '京三', name: '平安京 大極殿', at: 10},
	];
	return (
		<Canvas tone="shrine">
			{items.map((it) => {
				const g = interpolate(frame, [it.at, it.at + 30], [0, 1], easeOut);
				return (
					<g key={it.rank} opacity={interpolate(frame, [it.at, it.at + 10], [0, 1], clamp)}>
						<rect x={it.x - 190} y={960 - it.h * g} width={380} height={it.h * g} fill={it.rank === '雲太' ? '#7a2a1e' : '#3b2a22'} stroke={colors.gold} strokeWidth={4} />
						<text x={it.x} y={960 - it.h * g - 110} textAnchor="middle" {...svgMincho(100, it.rank === '雲太' ? colors.goldSoft : '#e6d8c2')}>
							{it.rank}
						</text>
						<text x={it.x} y={960 - it.h * g - 40} textAnchor="middle" {...svgGothic(36, '#efe6d2', 900)}>
							{it.name}
						</text>
					</g>
				);
			})}
		</Canvas>
	);
};

// 第16の手がかり：言い伝えの高さ（96m・48m・24m）と、45mの大仏殿
export const HeightCompare: React.FC = () => {
	const frame = useCurrentFrame();
	const ground = 990;
	const m = 5.8;
	const bars = [
		{x: 360, h: 96, label: '大昔', sub: '32丈', at: 10, faint: true},
		{x: 760, h: 48, label: '平安時代', sub: '16丈', at: 30},
		{x: 1160, h: 24, label: '今', sub: '8丈', at: 50},
		{x: 1560, h: 45, label: '大仏殿', sub: '15丈', at: 70, other: true},
	];
	return (
		<Canvas tone="night">
			<line x1={120} y1={ground} x2={1800} y2={ground} stroke="#4a5a72" strokeWidth={4} />
			{bars.map((b) => {
				const g = interpolate(frame, [b.at, b.at + 40], [0, 1], easeOut);
				const hh = b.h * m * g;
				const c = b.other ? '#56708a' : b.faint ? '#6b4a3a' : WOOD;
				return (
					<g key={b.label} opacity={interpolate(frame, [b.at, b.at + 10], [0, 1], clamp)}>
						{[-50, 0, 50].map((dx) => (
							<rect key={dx} x={b.x + dx - 7} y={ground - hh + 70} width={14} height={Math.max(0, hh - 70)} fill={c} opacity={b.faint ? 0.6 : 1} />
						))}
						<path d={`M ${b.x - 110} ${ground - hh + 70} L ${b.x} ${ground - hh} L ${b.x + 110} ${ground - hh + 70} Z`} fill={c} opacity={b.faint ? 0.6 : 1} />
						<text x={b.x} y={ground - hh - 70} textAnchor="middle" {...svgMincho(64, b.faint ? '#c9a58a' : colors.goldSoft)}>
							{b.h}m
						</text>
						<text x={b.x} y={ground - hh - 20} textAnchor="middle" {...svgGothic(30, '#c9d3e3', 900)}>
							{b.label}・{b.sub}
						</text>
					</g>
				);
			})}
		</Canvas>
	);
};

// 第16の手がかり：杉3本を束ねた柱（断面）
export const PillarBundle: React.FC = () => {
	const frame = useCurrentFrame();
	const r = 115;
	const ring = interpolate(frame, [70, 110], [0, 1], easeInOut);
	const centers = [
		[0, -r * 1.05],
		[-r * 0.95, r * 0.6],
		[r * 0.95, r * 0.6],
	];
	return (
		<Canvas tone="ember">
			<g transform="translate(960 580)">
				{centers.map(([x, y], i) => (
					<Reveal key={i} at={8 + i * 18}>
						<circle cx={x} cy={y} r={r} fill="#a0703e" stroke="#5a3a1e" strokeWidth={8} />
						{[0.8, 0.6, 0.4, 0.2].map((k) => (
							<circle key={k} cx={x} cy={y} r={r * k} fill="none" stroke="#7a522a" strokeWidth={3} />
						))}
					</Reveal>
				))}
				<circle r={r * 2.25} fill="none" stroke="#c9ccd4" strokeWidth={14} pathLength={1} strokeDasharray={`${ring} 1`} transform="rotate(-90)" />
				<g opacity={interpolate(frame, [40, 60], [0, 1], clamp)}>
					<line x1={-r} y1={-r * 1.05} x2={r} y2={-r * 1.05} stroke="#fff3d6" strokeWidth={4} />
					<text x={r + 20} y={-r * 1.05 + 14} {...svgGothic(40, '#fff3d6', 900)}>
						1本 約1.3m
					</text>
				</g>
			</g>
			<text x={960} y={900} textAnchor="middle" {...svgMincho(60, colors.goldSoft)} opacity={interpolate(frame, [100, 120], [0, 1], clamp)}>
				束ねると、直径 約3m
			</text>
		</Canvas>
	);
};

// 第16の手がかり：放射性炭素の時計（切られた年代）
export const CarbonClock: React.FC = () => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [10, 90], [0, 1], easeInOut);
	const pts = [...Array(60)].map((_, i) => {
		const x = 260 + i * 24;
		const y = 380 + (1 - Math.exp(-i / 22)) * 420;
		return `${x} ${y}`;
	});
	return (
		<Canvas tone="ink">
			<line x1={260} y1={820} x2={1720} y2={820} stroke="#4c5a70" strokeWidth={4} />
			<line x1={260} y1={360} x2={260} y2={820} stroke="#4c5a70" strokeWidth={4} />
			<text x={240} y={400} textAnchor="end" {...svgGothic(30, '#9fb0c8', 900)}>
				多い
			</text>
			<text x={980} y={880} textAnchor="middle" {...svgGothic(32, '#9fb0c8', 900)}>
				木が切られてからの年月 →
			</text>
			<path d={`M ${pts.join(' L ')}`} stroke="#9fd6c0" strokeWidth={8} fill="none" pathLength={1} strokeDasharray={`${draw} 1`} />
			<g opacity={interpolate(frame, [90, 110], [0, 1], clamp)}>
				<rect x={1120} y={360} width={600} height={170} rx={16} fill="rgba(3,6,14,0.85)" stroke={colors.gold} strokeWidth={3} />
				<text x={1420} y={430} textAnchor="middle" {...svgGothic(34, '#efe6d2', 900)}>
					柱の木が切られたのは
				</text>
				<text x={1420} y={500} textAnchor="middle" {...svgMincho(56, colors.goldSoft)}>
					1215〜1240年ごろ
				</text>
			</g>
		</Canvas>
	);
};

// 第16の手がかり：9本の柱と、長さ一町（約109m）の階段（横から）
export const NinePillars: React.FC = () => {
	const frame = useCurrentFrame();
	const stair = interpolate(frame, [50, 110], [0, 1], easeInOut);
	return (
		<Canvas tone="shrine">
			<Reveal at={6}>
				<g transform="translate(330 560)">
					{[0, 1, 2].map((r) =>
						[0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={c * 110} cy={r * 110} r={r === 1 && c === 1 ? 44 : 36} fill={WOOD} stroke="#ffcf7a" strokeWidth={r === 1 && c === 1 ? 6 : 2} />),
					)}
					<text x={110} y={330} textAnchor="middle" {...svgGothic(34, '#efe6d2', 900)}>
						9本の柱
					</text>
				</g>
			</Reveal>
			<g transform="translate(760 960)">
				{[0, 70, 140].map((dx) => (
					<rect key={dx} x={dx} y={-470} width={16} height={470} fill={WOOD} />
				))}
				<rect x={-20} y={-520} width={196} height={60} fill="#c9a06a" />
				<path d="M -40 -515 L 88 -590 L 216 -515 Z" fill="#6b4a2e" />
				<path d={`M 170 -480 L ${170 + 860 * stair} ${-480 + 480 * stair}`} stroke="#e6c48e" strokeWidth={12} />
				<text x={620} y={-200} textAnchor="middle" {...svgMincho(58, colors.goldSoft)} opacity={stair}>
					階段 一町（約109m）
				</text>
			</g>
		</Canvas>
	);
};

// 第17の手がかり：本殿が倒れた記録（およそ200年に、7回とも。1031年以外の印は数を示すだけで、年代の位置ではない）
export const CollapseMarks: React.FC = () => {
	const frame = useCurrentFrame();
	const x = (yr: number) => 220 + ((yr - 950) / (1270 - 950)) * 1480;
	const marks = [1031, 1061, 1109, 1141, 1172, 1201, 1235];
	return (
		<Canvas tone="ink">
			<line x1={x(950)} y1={640} x2={x(1270)} y2={640} stroke="#4c5a70" strokeWidth={6} />
			<text x={x(1000)} y={710} textAnchor="middle" {...svgGothic(32, '#9fb0c8', 900)}>
				平安時代のなかごろ
			</text>
			<text x={x(1235)} y={710} textAnchor="middle" {...svgGothic(32, '#9fb0c8', 900)}>
				鎌倉時代の初め
			</text>
			{marks.map((yr, i) => {
				const at = 10 + i * 14;
				const first = i === 0;
				return (
					<g key={yr} opacity={interpolate(frame, [at, at + 10], [0, 1], clamp)}>
						<path d={`M ${x(yr) - 22} 560 L ${x(yr) + 22} 600 M ${x(yr) + 22} 560 L ${x(yr) - 22} 600`} stroke={first ? '#ff8f80' : '#c98b5a'} strokeWidth={8} strokeLinecap="round" />
						{first ? (
							<text x={x(yr)} y={500} textAnchor="middle" {...svgMincho(52, '#ffd0c8')}>
								1031年
							</text>
						) : null}
					</g>
				);
			})}
			<text x={960} y={860} textAnchor="middle" {...svgMincho(70, colors.goldSoft)} opacity={interpolate(frame, [110, 130], [0, 1], clamp)}>
				およそ200年に、7回とも
			</text>
		</Canvas>
	);
};

// 第17の手がかり：高い柱の上の本殿が、ゆっくり傾く
export const ShrineFall: React.FC = () => {
	const frame = useCurrentFrame();
	const tilt = interpolate(frame, [40, 130], [0, 18], {...clamp, easing: (t) => t * t});
	return (
		<Canvas tone="night">
			<line x1={200} y1={980} x2={1720} y2={980} stroke="#4a5a72" strokeWidth={4} />
			<g transform={`translate(960 980) rotate(${tilt})`}>
				{[-110, 0, 110].map((dx) => (
					<rect key={dx} x={dx - 12} y={-500} width={24} height={500} fill={WOOD} />
				))}
				<rect x={-180} y={-580} width={360} height={90} fill="#c9a06a" />
				<path d="M -220 -575 L 0 -660 L 220 -575 Z" fill="#6b4a2e" />
			</g>
			<text x={420} y={520} textAnchor="middle" {...svgMincho(56, '#ffd0c8')} opacity={interpolate(frame, [20, 40], [0, 1], clamp)}>
				地震も、強い風も
			</text>
			<text x={420} y={590} textAnchor="middle" {...svgMincho(56, '#ffd0c8')} opacity={interpolate(frame, [30, 50], [0, 1], clamp)}>
				記録にないのに？
			</text>
		</Canvas>
	);
};

// 第18の手がかり：国造の家の系譜（神話から記録へ）
export const Lineage: React.FC = () => {
	const nodes = [
		{y: 360, label: 'アメノホヒ', sub: '神話の神（日本書紀）', myth: true},
		{y: 540, label: '出雲臣果安', sub: '716年 記録に残る国造'},
		{y: 720, label: '1340年ごろ', sub: '2つの家に分かれる'},
	];
	return (
		<Canvas tone="shrine">
			{nodes.map((n, i) => (
				<Reveal key={n.label} at={8 + i * 26}>
					<rect x={560} y={n.y - 60} width={800} height={110} rx={18} fill={n.myth ? 'rgba(80,60,120,0.35)' : '#2a1a14'} stroke={n.myth ? '#a89ad8' : colors.gold} strokeWidth={4} strokeDasharray={n.myth ? '16 10' : undefined} />
					<text x={700} y={n.y + 14} {...svgMincho(50, n.myth ? '#d8d0f0' : colors.goldSoft)}>
						{n.label}
					</text>
					<text x={1340} y={n.y + 12} textAnchor="end" {...svgGothic(30, '#e9d8c2', 900)}>
						{n.sub}
					</text>
					{i < 2 ? <line x1={960} y1={n.y + 50} x2={960} y2={n.y + 120} stroke="#8a6a4a" strokeWidth={4} strokeDasharray={i === 0 ? '10 8' : undefined} /> : null}
				</Reveal>
			))}
			<Reveal at={90}>
				<line x1={960} y1={770} x2={700} y2={850} stroke="#8a6a4a" strokeWidth={4} />
				<line x1={960} y1={770} x2={1220} y2={850} stroke="#8a6a4a" strokeWidth={4} />
				<text x={700} y={910} textAnchor="middle" {...svgMincho(56, '#fbf6ea')}>
					千家家
				</text>
				<text x={1220} y={910} textAnchor="middle" {...svgMincho(56, '#fbf6ea')}>
					北島家
				</text>
			</Reveal>
		</Canvas>
	);
};

// 第19の手がかり：神在祭の流れ（2026年）
export const KamiFlow: React.FC = () => {
	const frame = useCurrentFrame();
	const steps = [
		{date: '11月18日', title: '神迎え', sub: '稲佐の浜'},
		{date: '滞在中', title: '十九社', sub: '神々の宿'},
		{date: '会議', title: '神議り', sub: '上宮'},
		{date: '11月25日', title: '神等去出祭', sub: '神々を送る'},
	];
	return (
		<Canvas tone="night">
			{steps.map((s, i) => {
				const x = 300 + i * 440;
				const at = 8 + i * 24;
				return (
					<g key={s.title} opacity={interpolate(frame, [at, at + 14], [0, 1], clamp)}>
						<circle cx={x} cy={600} r={150} fill="#14223a" stroke={i === 0 || i === 3 ? '#ffcf7a' : colors.gold} strokeWidth={5} />
						<text x={x} y={540} textAnchor="middle" {...svgGothic(32, '#9fb0c8', 900)}>
							{s.date}
						</text>
						<text x={x} y={615} textAnchor="middle" {...svgMincho(s.title.length > 4 ? 44 : 56, '#fbf6ea')}>
							{s.title}
						</text>
						<text x={x} y={670} textAnchor="middle" {...svgGothic(30, colors.goldSoft, 900)}>
							{s.sub}
						</text>
						{i < 3 ? <path d={`M ${x + 160} 600 L ${x + 280} 600`} stroke={colors.gold} strokeWidth={5} opacity={interpolate(frame, [at + 14, at + 24], [0, 1], clamp)} /> : null}
					</g>
				);
			})}
		</Canvas>
	);
};

// 本当の物語：2000年の流れ
export const LongRoad: React.FC = () => {
	const frame = useCurrentFrame();
	const stops = [
		{label: '弥生', sub: '銅剣・銅鐸\n王の墓'},
		{label: '古墳', sub: 'ヤマトの\n仕組みの中へ'},
		{label: '奈良', sub: '古事記\n神賀詞'},
		{label: '平安', sub: '雲太\n奥義抄'},
		{label: '江戸', sub: '御師\n縁結び'},
		{label: '2026', sub: '同じ印\n神迎え', accent: true},
	];
	const p = interpolate(frame, [6, 130], [0, 1], easeInOut);
	return (
		<Canvas tone="shrine">
			<line x1={200} y1={560} x2={200 + 1520 * p} y2={560} stroke={colors.gold} strokeWidth={6} />
			{stops.map((s, i) => {
				const x = 200 + (i / 5) * 1520;
				const at = 8 + i * 22;
				return (
					<g key={s.label} opacity={interpolate(frame, [at, at + 14], [0, 1], clamp)}>
						<circle cx={x} cy={560} r={s.accent ? 22 : 16} fill={s.accent ? '#e94b3c' : colors.gold} />
						<text x={x} y={500} textAnchor="middle" {...svgMincho(60, s.accent ? '#ff9b8f' : colors.goldSoft)}>
							{s.label}
						</text>
						{s.sub.split('\n').map((ln, k) => (
							<text key={k} x={x} y={640 + k * 46} textAnchor="middle" {...svgGothic(34, '#efe6d2', 900)}>
								{ln}
							</text>
						))}
					</g>
				);
			})}
		</Canvas>
	);
};

export {easeOut};
