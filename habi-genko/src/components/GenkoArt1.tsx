import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, Reveal, svgGothic, svgMincho} from './Cinema';

// 元寇判決：冒頭の図解（すべて1920×1080の全画面で描く）

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W = 1920;
const H = 1080;

// 毎回同じ並びになる疑似乱数
const rand = (i: number) => {
	const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};

const Full: React.FC<{readonly children: React.ReactNode}> = ({children}) => (
	<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
		{children}
	</svg>
);

// 海の波（奥ほど細かく、ゆっくり）
const Waves: React.FC<{readonly top: number; readonly color: string; readonly rows?: number}> = ({top, color, rows = 9}) => {
	const frame = useCurrentFrame();
	return (
		<g>
			{[...Array(rows)].map((_, r) => {
				const y = top + Math.pow(r / rows, 1.6) * (H - top);
				const amp = 3 + r * 2.2;
				const len = 120 + r * 60;
				const phase = frame * (0.6 + r * 0.25) + r * 40;
				let d = `M -200 ${y}`;
				for (let x = -200; x <= W + 200; x += len / 4) {
					d += ` Q ${x + len / 8} ${y - amp * Math.sin((x + phase) / len * Math.PI * 2)} ${x + len / 4} ${y}`;
				}
				return <path key={r} d={d} stroke={color} strokeWidth={1 + r * 0.5} fill="none" opacity={0.25 + r * 0.05} />;
			})}
		</g>
	);
};

// 2026 → 1281：時間をさかのぼるカウンター
export const YearRewind: React.FC = () => {
	const frame = useCurrentFrame();
	const year = Math.round(interpolate(frame, [10, 80], [2026, 1274], easeInOut));
	const glow = interpolate(frame, [80, 100], [0, 1], clamp);
	return (
		<Full>
			<defs>
				<radialGradient id="yrBg" cx="50%" cy="45%" r="70%">
					<stop offset="0%" stopColor="#1b2a44" />
					<stop offset="100%" stopColor="#020409" />
				</radialGradient>
			</defs>
			<rect width={W} height={H} fill="url(#yrBg)" />
			{[...Array(60)].map((_, i) => {
				const y = (i * 37) % H;
				const speed = 6 + rand(i) * 18;
				const x = (W - ((frame * speed + rand(i + 9) * W) % (W + 400))) + 200;
				return <rect key={i} x={x} y={y} width={120 + rand(i + 3) * 300} height={1.5} fill="#9fc2ff" opacity={0.08 + rand(i + 5) * 0.15 * (1 - glow)} />;
			})}
			<text x={W / 2} y={560} textAnchor="middle" {...svgMincho(260, '#fbf6ea')} style={{letterSpacing: '0.05em'}} opacity={interpolate(frame, [0, 12], [0, 1], clamp)}>
				{year}
			</text>
			<g opacity={glow}>
				<text x={W / 2} y={700} textAnchor="middle" {...svgMincho(72, colors.gold)} style={{letterSpacing: '0.4em'}}>
					七百五十年前
				</text>
			</g>
		</Full>
	);
};

// 夜の海を埋めつくす大艦隊（14万人、4400隻とも言われる）
export const Armada: React.FC = () => {
	const frame = useCurrentFrame();
	const horizon = 470;
	const ships = [...Array(220)].map((_, i) => {
		const depth = Math.pow(rand(i), 1.8); // 0=奥 1=手前
		return {i, depth, x: rand(i + 100) * (W + 400) - 200, y: horizon + 6 + depth * 520};
	}).sort((a, b) => a.depth - b.depth);
	const drift = frame * 0.4;
	return (
		<Full>
			<defs>
				<linearGradient id="arSky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#05080f" />
					<stop offset="70%" stopColor="#1a2235" />
					<stop offset="100%" stopColor="#3a3a44" />
				</linearGradient>
				<linearGradient id="arSea" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#1b2533" />
					<stop offset="100%" stopColor="#03060b" />
				</linearGradient>
			</defs>
			<rect width={W} height={horizon} fill="url(#arSky)" />
			<rect y={horizon} width={W} height={H - horizon} fill="url(#arSea)" />
			<ellipse cx={1500} cy={170} rx={70} ry={70} fill="#e9e3cf" opacity={0.85} />
			<ellipse cx={1500} cy={170} rx={180} ry={180} fill="#e9e3cf" opacity={0.06} />
			<Waves top={horizon} color="#6f86a6" rows={10} />
			{ships.map(({i, depth, x, y}) => {
				const s = 0.18 + depth * 1.3;
				const sx = x + drift * (0.3 + depth);
				const bob = Math.sin(frame / 18 + i) * 3 * depth;
				return (
					<g key={i} transform={`translate(${sx} ${y + bob}) scale(${s})`} opacity={interpolate(frame, [i * 0.25, i * 0.25 + 15], [0, 0.55 + depth * 0.45], clamp)}>
						<path d="M -70 0 Q -60 22 0 24 Q 60 22 78 -6 L 60 -4 L -60 -4 Z" fill="#05070b" />
						<path d="M -18 -4 L -18 -120 M 22 -4 L 22 -90" stroke="#05070b" strokeWidth={5} />
						<path d="M -18 -116 L 18 -108 L 20 -20 L -16 -28 Z" fill="#11151d" />
						<path d="M 22 -86 L 50 -80 L 52 -20 L 24 -26 Z" fill="#11151d" />
						{rand(i + 7) > 0.6 ? <circle cx={60} cy={-12} r={3} fill="#ffb35c" opacity={0.9} /> : null}
					</g>
				);
			})}
			<rect width={W} height={H} fill="#000" opacity={0.15} />
			<Reveal at={30}>
				<text x={W / 2} y={300} textAnchor="middle" {...svgMincho(150, '#fbf6ea')} style={{letterSpacing: '0.06em'}}>
					14万人
				</text>
			</Reveal>
			<Reveal at={55}>
				<text x={W / 2} y={440} textAnchor="middle" {...svgMincho(150, colors.gold)} style={{letterSpacing: '0.06em'}}>
					4400隻
				</text>
			</Reveal>
			<Reveal at={85}>
				<text x={W / 2} y={520} textAnchor="middle" {...svgGothic(40, '#c9d3e3', 700)}>
					とも言われる大艦隊
				</text>
			</Reveal>
		</Full>
	);
};

// 海の底へ：光の筋と漂う粒、泥の下に眠る船の影
export const SeabedDescent: React.FC = () => {
	const frame = useCurrentFrame();
	const depth = interpolate(frame, [0, 150], [0, 1], easeInOut);
	const camY = depth * 900;
	return (
		<Full>
			<defs>
				<linearGradient id="sdWater" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#2b6f86" />
					<stop offset="40%" stopColor="#0f3448" />
					<stop offset="100%" stopColor="#02080e" />
				</linearGradient>
				<linearGradient id="sdRay" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#bfe8ff" stopOpacity={0.35} />
					<stop offset="100%" stopColor="#bfe8ff" stopOpacity={0} />
				</linearGradient>
				<linearGradient id="sdMud" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#3b3328" />
					<stop offset="100%" stopColor="#120e0a" />
				</linearGradient>
			</defs>
			<g transform={`translate(0 ${-camY})`}>
				<rect width={W} height={H * 2} fill="url(#sdWater)" />
				{[...Array(7)].map((_, i) => {
					const x = 200 + i * 260 + Math.sin(frame / 40 + i) * 30;
					return <path key={i} d={`M ${x} -40 L ${x + 90} -40 L ${x + 260} 1500 L ${x - 120} 1500 Z`} fill="url(#sdRay)" opacity={0.5 + 0.3 * Math.sin(frame / 25 + i * 2)} />;
				})}
				{/* 海底と泥 */}
				<path d={`M 0 1620 Q 480 1580 960 1610 T 1920 1600 L 1920 2160 L 0 2160 Z`} fill="url(#sdMud)" />
				{/* 泥の下の船の影（竜骨と肋材） */}
				<g opacity={interpolate(frame, [110, 160], [0, 0.9], clamp)}>
					<path d="M 560 1800 Q 960 1860 1360 1800" stroke="#d9a35b" strokeWidth={10} fill="none" />
					{[...Array(11)].map((_, i) => {
						const x = 600 + i * 72;
						return <path key={i} d={`M ${x} ${1810 + Math.sin((i / 10) * Math.PI) * 24} q -10 -60 -4 -110`} stroke="#d9a35b" strokeWidth={6} fill="none" opacity={0.8} />;
					})}
					<path d="M 560 1800 Q 960 1860 1360 1800" stroke="#ffd48a" strokeWidth={30} fill="none" opacity={0.12} />
				</g>
			</g>
			{[...Array(90)].map((_, i) => {
				const x = (rand(i) * W + Math.sin(frame / 50 + i) * 20) % W;
				const y = (rand(i + 50) * H - frame * (0.3 + rand(i + 3) * 0.8) + 2000) % H;
				return <circle key={i} cx={x} cy={y} r={1 + rand(i + 8) * 2.5} fill="#d6f0ff" opacity={0.15 + rand(i + 2) * 0.3} />;
			})}
			{/* 深さの目盛り */}
			<g transform="translate(1760 180)">
				<line x1={0} y1={0} x2={0} y2={720} stroke="#9fd2ea" strokeWidth={2} opacity={0.6} />
				{[0, 5, 10, 15, 20, 25].map((m) => (
					<g key={m} transform={`translate(0 ${(m / 25) * 720})`}>
						<line x1={-14} y1={0} x2={0} y2={0} stroke="#9fd2ea" strokeWidth={2} />
						<text x={-24} y={8} textAnchor="end" {...svgGothic(24, '#bfe3f2', 700)}>
							{m}m
						</text>
					</g>
				))}
				<polygon points={`8,${depth * 720 - 12} 30,${depth * 720} 8,${depth * 720 + 12}`} fill={colors.gold} />
			</g>
		</Full>
	);
};

// サイコロ5個と札29枚（2026年10月の発表）
export const DiceAndCards: React.FC = () => {
	const frame = useCurrentFrame();
	const die = (cx: number, cy: number, n: number, at: number, key: number) => {
		const o = interpolate(frame, [at, at + 12], [0, 1], clamp);
		const s = 64;
		const pips: Record<number, number[][]> = {1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]]};
		return (
			<g key={key} opacity={o} transform={`translate(${cx} ${cy - (1 - o) * 30})`}>
				<path d={`M ${-s} ${-s * 0.5} L 0 ${-s} L ${s} ${-s * 0.5} L 0 0 Z`} fill="#e9dcc0" />
				<path d={`M ${-s} ${-s * 0.5} L 0 0 L 0 ${s} L ${-s} ${s * 0.5} Z`} fill="#c9b894" />
				<path d={`M ${s} ${-s * 0.5} L 0 0 L 0 ${s} L ${s} ${s * 0.5} Z`} fill="#b29f79" />
				{pips[n].map(([px, py], k) => (
					<ellipse key={k} cx={px * s * 0.32 + py * s * 0.0} cy={-s * 0.5 + py * s * 0.16 + px * s * 0.0} rx={7} ry={4} fill={n === 1 ? '#a23a2a' : '#2a1f16'} />
				))}
			</g>
		);
	};
	return (
		<Full>
			<defs>
				<radialGradient id="dcSpot" cx="50%" cy="48%" r="55%">
					<stop offset="0%" stopColor="#3a2c1e" />
					<stop offset="100%" stopColor="#050403" />
				</radialGradient>
			</defs>
			<rect width={W} height={H} fill="url(#dcSpot)" />
			{[1, 3, 5, 2, 4].map((n, i) => die(420 + i * 150, 430 + (i % 2) * 40, n, 10 + i * 10, i))}
			<Reveal at={70}>
				<text x={720} y={600} textAnchor="middle" {...svgMincho(64, colors.goldSoft)}>
					サイコロ　5個
				</text>
			</Reveal>
			{[...Array(29)].map((_, i) => {
				const col = i % 10;
				const row = Math.floor(i / 10);
				const at = 80 + i * 3;
				const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
				return (
					<g key={i} opacity={o} transform={`translate(${1210 + col * 52} ${330 + row * 110 + (1 - o) * 20})`}>
						<rect width={40} height={80} rx={4} fill="#d8c7a2" stroke="#6b5636" strokeWidth={2} />
						{[...Array(1 + (i % 4))].map((__, k) => (
							<circle key={k} cx={20} cy={16 + k * 16} r={4} fill={i % 3 === 0 ? '#9b2f22' : '#2a1f16'} />
						))}
					</g>
				);
			})}
			<Reveal at={160}>
				<text x={1440} y={720} textAnchor="middle" {...svgMincho(64, colors.goldSoft)}>
					札　29枚
				</text>
			</Reveal>
		</Full>
	);
};

// 全長およそ30メートル：これまで見つかった3隻の大きさ
export const ShipLength: React.FC = () => {
	const frame = useCurrentFrame();
	const scale = 44; // 1メートル＝44px
	const ship = (len: number, y: number, at: number, label: string, main: boolean) => {
		const w = len * scale * interpolate(frame, [at, at + 40], [0, 1], easeOut);
		const x0 = W / 2 - (len * scale) / 2;
		return (
			<g>
				<path
					d={`M ${x0} ${y} Q ${x0 + w * 0.08} ${y + 70} ${x0 + w * 0.5} ${y + 78} Q ${x0 + w * 0.92} ${y + 70} ${x0 + w} ${y - 10} Z`}
					fill={main ? '#c9934e' : 'none'}
					stroke={main ? '#ffd48a' : '#8aa3c2'}
					strokeWidth={main ? 4 : 3}
					strokeDasharray={main ? undefined : '14 10'}
					opacity={main ? 0.95 : 0.7}
				/>
				<text x={x0 + w + 24} y={y + 50} {...svgGothic(main ? 54 : 38, main ? colors.goldSoft : '#aebfd6', 900)} opacity={interpolate(frame, [at + 30, at + 45], [0, 1], clamp)}>
					{label}
				</text>
			</g>
		);
	};
	return (
		<Full>
			<rect width={W} height={H} fill="#060b14" />
			{[...Array(30)].map((_, i) => (
				<line key={i} x1={W / 2 - 15 * scale + i * scale} y1={240} x2={W / 2 - 15 * scale + i * scale} y2={900} stroke="#16243a" strokeWidth={1} />
			))}
			{ship(20, 300, 0, '2号船　約20m', false)}
			{ship(27, 480, 20, '1号船　約27m', false)}
			{ship(30, 690, 50, '3号船　約30m', true)}
			{/* 人の大きさ（身長1.7m） */}
			<g transform={`translate(${W / 2 - 15 * scale - 60} 690)`} opacity={interpolate(frame, [80, 95], [0, 1], clamp)}>
				<circle cx={0} cy={-62} r={10} fill="#e9e3cf" />
				<rect x={-8} y={-50} width={16} height={50} rx={6} fill="#e9e3cf" />
			</g>
			<text x={W / 2} y={960} textAnchor="middle" {...svgGothic(30, '#8ea2bd', 700)}>
				いずれも推定の全長
			</text>
		</Full>
	);
};

// 墨書きの木の板：赤外線でなぞると、最後の行に元の年号が浮かぶ
export const InkBoard: React.FC = () => {
	const frame = useCurrentFrame();
	const scan = interpolate(frame, [30, 110], [0, 1], easeInOut);
	const bx = 460;
	const by = 250;
	const bw = 1000;
	const bh = 480;
	return (
		<Full>
			<defs>
				<linearGradient id="ibWood" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="#5b4126" />
					<stop offset="50%" stopColor="#6f5233" />
					<stop offset="100%" stopColor="#4d3720" />
				</linearGradient>
				<clipPath id="ibClip">
					<rect x={bx} y={by} width={bw * scan} height={bh} />
				</clipPath>
			</defs>
			<rect width={W} height={H} fill="#07090d" />
			<rect x={bx} y={by} width={bw} height={bh} rx={10} fill="url(#ibWood)" />
			{[...Array(14)].map((_, i) => (
				<path key={i} d={`M ${bx} ${by + 20 + i * 33} Q ${bx + bw / 2} ${by + 10 + i * 33 + Math.sin(i) * 12} ${bx + bw} ${by + 24 + i * 33}`} stroke="#3e2b17" strokeWidth={2} fill="none" opacity={0.5} />
			))}
			{[bx + 300, bx + bw - 300].map((x) => (
				<circle key={x} cx={x} cy={by + 40} r={14} fill="#1b130b" />
			))}
			{/* 赤外線の画像（白黒で墨が浮かぶ） */}
			<g clipPath="url(#ibClip)">
				<rect x={bx} y={by} width={bw} height={bh} rx={10} fill="#bdbdb8" />
				{[...Array(6)].map((_, i) => (
					<g key={i} opacity={0.18 + (i === 5 ? 0 : 0.1)}>
						{[...Array(9)].map((__, k) => (
							<rect key={k} x={bx + bw - 120 - i * 130} y={by + 90 + k * 40} width={34 + rand(i * 10 + k) * 20} height={22} rx={6} fill="#2b2b2b" />
						))}
					</g>
				))}
				<text x={bx + 150} y={by + 110} {...svgMincho(52, '#151515')} style={{writingMode: 'vertical-rl'}}>
					至元十□年
				</text>
			</g>
			<line x1={bx + bw * scan} y1={by - 20} x2={bx + bw * scan} y2={by + bh + 20} stroke="#ff5d5d" strokeWidth={4} opacity={scan > 0 && scan < 1 ? 0.9 : 0} />
			<text x={W / 2} y={by - 50} textAnchor="middle" {...svgGothic(34, '#c8b89a', 700)}>
				縦12cm・横25cmほどの杉の板
			</text>
			<Reveal at={120}>
				<text x={W / 2} y={by + bh + 110} textAnchor="middle" {...svgMincho(60, colors.goldSoft)}>
					赤外線で、消えた墨が浮かぶ
				</text>
			</Reveal>
		</Full>
	);
};

// 矢の末端「矢筈」：ふつうの矢と、溝のない南宋の矢
export const ArrowNock: React.FC = () => {
	const frame = useCurrentFrame();
	const arrow = (y: number, kind: 'v' | 'dish', at: number, label: string, color: string) => {
		const o = interpolate(frame, [at, at + 18], [0, 1], clamp);
		const x = interpolate(frame, [at, at + 40], [-300, 0], easeOut);
		return (
			<g opacity={o} transform={`translate(${x} 0)`}>
				<rect x={360} y={y - 16} width={1000} height={32} rx={14} fill={kind === 'dish' ? '#141414' : '#b48a52'} />
				{kind === 'dish' ? <rect x={1340} y={y - 18} width={30} height={36} rx={8} fill="#a32b20" /> : null}
				{kind === 'v' ? (
					<path d={`M 1340 ${y - 22} L 1390 ${y - 22} L 1360 ${y} L 1390 ${y + 22} L 1340 ${y + 22} Z`} fill="#b48a52" />
				) : (
					<path d={`M 1366 ${y - 22} Q 1384 ${y} 1366 ${y + 22} L 1340 ${y + 22} L 1340 ${y - 22} Z`} fill="#141414" />
				)}
				{/* 羽根 */}
				<path d={`M 1180 ${y - 16} L 1300 ${y - 70} L 1320 ${y - 16} Z`} fill={kind === 'dish' ? '#6b5233' : '#e9e3cf'} opacity={0.9} />
				<path d={`M 1180 ${y + 16} L 1300 ${y + 70} L 1320 ${y + 16} Z`} fill={kind === 'dish' ? '#6b5233' : '#e9e3cf'} opacity={0.9} />
				<text x={360} y={y - 50} {...svgGothic(40, color, 900)}>
					{label}
				</text>
			</g>
		);
	};
	return (
		<Full>
			<rect width={W} height={H} fill="#0a0b0f" />
			{arrow(360, 'v', 0, 'ふつうの矢：矢筈に、弦をかける溝がある', '#d8cfbd')}
			{arrow(700, 'dish', 40, '鷹島の矢：溝がなく、皿のように浅い', colors.goldSoft)}
			<Reveal at={100}>
				<circle cx={1365} cy={700} r={90} fill="none" stroke={colors.gold} strokeWidth={4} />
				<text x={1365} y={860} textAnchor="middle" {...svgGothic(34, colors.gold, 900)}>
					長さ3cmほどの竹のかけら
				</text>
			</Reveal>
		</Full>
	);
};

// 台風の季節と、2度の戦い
export const StormSeason: React.FC = () => {
	const frame = useCurrentFrame();
	const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
	const x0 = 210;
	const cw = 125;
	return (
		<Full>
			<rect width={W} height={H} fill="#070c16" />
			<rect x={x0 + 6 * cw} y={300} width={3 * cw} height={420} fill="#2f5d86" opacity={interpolate(frame, [10, 40], [0, 0.55], clamp)} />
			<text x={x0 + 7.5 * cw} y={280} textAnchor="middle" {...svgGothic(36, '#9fd0ff', 900)} opacity={interpolate(frame, [20, 40], [0, 1], clamp)}>
				台風が多い季節
			</text>
			{months.map((m, i) => (
				<g key={m}>
					<line x1={x0 + i * cw} y1={720} x2={x0 + i * cw} y2={736} stroke="#4f627e" strokeWidth={2} />
					<text x={x0 + i * cw + cw / 2} y={780} textAnchor="middle" {...svgGothic(34, '#aebbd0', 700)}>
						{m}
					</text>
				</g>
			))}
			<line x1={x0} y1={720} x2={x0 + 12 * cw} y2={720} stroke="#4f627e" strokeWidth={3} />
			<Reveal at={50}>
				<line x1={x0 + 7.7 * cw} y1={380} x2={x0 + 7.7 * cw} y2={720} stroke={colors.gold} strokeWidth={5} />
				<text x={x0 + 7.7 * cw} y={360} textAnchor="middle" {...svgMincho(46, colors.goldSoft)}>
					2度目（弘安の役）
				</text>
			</Reveal>
			<Reveal at={80}>
				<line x1={x0 + 10.8 * cw} y1={460} x2={x0 + 10.8 * cw} y2={720} stroke="#ff7b6b" strokeWidth={5} />
				<text x={x0 + 10.8 * cw} y={440} textAnchor="middle" {...svgMincho(46, '#ffb3a8')}>
					1度目（文永の役）
				</text>
			</Reveal>
			<text x={W / 2} y={880} textAnchor="middle" {...svgGothic(30, '#7f8ea8', 700)}>
				今の暦に直したおよその時期
			</text>
		</Full>
	);
};

// 泥の断面：海、海底、泥の下およそ1メートルに眠る船
export const MudSection: React.FC = () => {
	const frame = useCurrentFrame();
	const glow = 0.5 + 0.5 * Math.sin(frame / 14);
	return (
		<Full>
			<defs>
				<linearGradient id="msSea" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#123b52" />
					<stop offset="100%" stopColor="#061722" />
				</linearGradient>
				<linearGradient id="msMud" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#4a3d2c" />
					<stop offset="100%" stopColor="#1c150d" />
				</linearGradient>
			</defs>
			<rect width={W} height={560} fill="url(#msSea)" />
			<rect y={560} width={W} height={520} fill="url(#msMud)" />
			{[...Array(40)].map((_, i) => (
				<circle key={i} cx={rand(i) * W} cy={600 + rand(i + 40) * 460} r={2 + rand(i + 3) * 4} fill="#6b5a42" opacity={0.5} />
			))}
			<Reveal at={20}>
				<g>
					<path d="M 560 830 Q 960 900 1360 830" stroke="#e0a75c" strokeWidth={14} fill="none" />
					{[...Array(12)].map((_, i) => (
						<path key={i} d={`M ${590 + i * 68} ${840 + Math.sin((i / 11) * Math.PI) * 30} q -6 -50 0 -90`} stroke="#e0a75c" strokeWidth={8} fill="none" />
					))}
					<path d="M 560 830 Q 960 900 1360 830" stroke="#ffd48a" strokeWidth={60} fill="none" opacity={0.12 * glow} />
				</g>
			</Reveal>
			<g transform="translate(1500 560)">
				<line x1={0} y1={0} x2={0} y2={250} stroke="#e9e3cf" strokeWidth={3} />
				<line x1={-14} y1={0} x2={14} y2={0} stroke="#e9e3cf" strokeWidth={3} />
				<line x1={-14} y1={250} x2={14} y2={250} stroke="#e9e3cf" strokeWidth={3} />
				<text x={30} y={140} {...svgGothic(40, '#e9e3cf', 900)}>
					泥の下 約1m
				</text>
			</g>
			<text x={120} y={530} {...svgGothic(36, '#9fd0e6', 700)}>
				海の底
			</text>
		</Full>
	);
};
