import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, svgGothic, svgMincho} from './Cinema';
import {Canvas, rand} from './IzumoKit';

// マチュピチュ判決：図解

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fade = (f: number, at: number, len = 16) => interpolate(f, [at, at + len], [0, 1], clamp);
const STONE = '#b9ad94';
const STONE_DARK = '#6f6656';

// 人のシルエット（身長 h ピクセル。woman で裾の広い形）
const Figure: React.FC<{readonly x: number; readonly y: number; readonly h: number; readonly color?: string; readonly woman?: boolean; readonly child?: boolean}> = ({x, y, h, color = '#9fb0c8', woman = false, child = false}) => (
	<g transform={`translate(${x} ${y}) scale(${(child ? h * 0.65 : h) / 170})`} fill={color}>
		<circle cx={0} cy={-156} r={14} />
		{woman ? (
			<path d="M -14 -140 L 14 -140 L 34 -40 L 10 -40 L 9 0 L 2 0 L 0 -40 L -2 0 L -9 0 L -10 -40 L -34 -40 Z" />
		) : (
			<path d="M -16 -140 L 16 -140 L 22 -80 L 12 -80 L 10 0 L 2 0 L 0 -70 L -2 0 L -10 0 L -12 -80 L -22 -80 Z" />
		)}
	</g>
);

// 第2の手がかり：ふたつの峰と、そのあいだの都市
export const NamePeaks: React.FC = () => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [4, 50], [0, 1], easeInOut);
	const ridge = 'M 0 900 L 180 860 L 420 520 L 520 470 L 640 560 L 860 640 L 1060 650 L 1220 600 L 1330 330 L 1400 300 L 1470 360 L 1600 700 L 1920 860';
	return (
		<Canvas tone="moss">
			<path d={`${ridge} L 1920 1080 L 0 1080 Z`} fill="#1f2b20" opacity={draw} />
			<path d={ridge} stroke="#c9d7b8" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${draw} 1`} />
			{/* 尾根の上の都市 */}
			<g opacity={fade(frame, 40)}>
				{[0, 1, 2, 3, 4, 5, 6].map((i) => (
					<rect key={i} x={880 + i * 38} y={608 - (i % 3) * 8} width={30} height={26 + (i % 3) * 8} fill={STONE} stroke={STONE_DARK} strokeWidth={2} />
				))}
				<text x={1010} y={720} textAnchor="middle" {...svgMincho(46, '#fbf6ea')}>
					石の都市
				</text>
			</g>
			<g opacity={fade(frame, 60)}>
				<text x={470} y={420} textAnchor="middle" {...svgMincho(64, colors.goldSoft)}>
					マチュピチュ
				</text>
				<text x={470} y={360} textAnchor="middle" {...svgGothic(34, '#e6dcc4', 900)}>
					「年老いた峰」
				</text>
			</g>
			<g opacity={fade(frame, 80)}>
				<text x={1400} y={250} textAnchor="middle" {...svgMincho(64, colors.goldSoft)}>
					ワイナピチュ
				</text>
				<text x={1400} y={190} textAnchor="middle" {...svgGothic(34, '#e6dcc4', 900)}>
					「若い峰」
				</text>
			</g>
			<g opacity={fade(frame, 120)}>
				<rect x={700} y={770} width={620} height={100} rx={14} fill="rgba(10,14,10,0.8)" stroke={colors.gold} strokeWidth={3} />
				<text x={1010} y={836} textAnchor="middle" {...svgMincho(42, '#ffe2a8')}>
					都市の名は「ワイナピチュ」？
				</text>
			</g>
		</Canvas>
	);
};

// 第4の手がかり：文書の年代と、骨の年代
export const DateShift: React.FC = () => {
	const frame = useCurrentFrame();
	const x = (yr: number) => 200 + ((yr - 1400) / (1560 - 1400)) * 1520;
	const p1 = interpolate(frame, [10, 40], [0, 1], easeInOut);
	const p2 = interpolate(frame, [60, 100], [0, 1], easeInOut);
	return (
		<Canvas tone="ink">
			<line x1={x(1400)} y1={760} x2={x(1560)} y2={760} stroke="#4c5a70" strokeWidth={6} />
			{[1400, 1420, 1440, 1460, 1480, 1500, 1520, 1540, 1560].map((y) => (
				<g key={y}>
					<line x1={x(y)} y1={750} x2={x(y)} y2={770} stroke="#4c5a70" strokeWidth={4} />
					<text x={x(y)} y={812} textAnchor="middle" {...svgGothic(28, '#8ea2bd', 700)}>
						{y}
					</text>
				</g>
			))}
			<g opacity={fade(frame, 6)}>
				<text x={x(1400)} y={360} {...svgGothic(34, '#c9d3e3', 900)}>
					文書が伝える年代
				</text>
				<rect x={x(1440)} y={390} width={(x(1532) - x(1440)) * p1} height={56} rx={10} fill="#6b7a92" />
				<line x1={x(1438)} y1={380} x2={x(1438)} y2={740} stroke="#9fb0c8" strokeWidth={3} strokeDasharray="10 8" />
				<text x={x(1438) - 14} y={430} textAnchor="end" {...svgGothic(30, '#c9d3e3', 900)}>
					即位 1438年
				</text>
			</g>
			<g opacity={fade(frame, 56)}>
				<text x={x(1400)} y={540} {...svgGothic(34, '#ffd0a8', 900)}>
					骨の放射性炭素年代（26人）
				</text>
				<rect x={x(1420)} y={570} width={(x(1530) - x(1420)) * p2} height={56} rx={10} fill="#d08a4a" />
				<text x={x(1420)} y={680} textAnchor="middle" {...svgMincho(44, '#ffd0a8')} opacity={fade(frame, 90)}>
					1420年ごろ
				</text>
				<text x={x(1530)} y={680} textAnchor="middle" {...svgMincho(44, '#ffd0a8')} opacity={fade(frame, 100)}>
					1530年ごろ
				</text>
			</g>
			<g opacity={fade(frame, 120)}>
				<path d={`M ${x(1438)} 650 L ${x(1420)} 650`} stroke="#ff8f80" strokeWidth={6} markerEnd="" />
				<text x={(x(1420) + x(1440)) / 2 + 30} y={730} textAnchor="middle" {...svgGothic(32, '#ff8f80', 900)}>
					20年近く早い
				</text>
			</g>
		</Canvas>
	);
};

// 第5の手がかり：骨の判定（1916年の判定と、のちの再調査）
export const SexRatio: React.FC = () => {
	const frame = useCurrentFrame();
	const n = 20;
	const row = (y: number, women: number, children: number, at: number, label: string, sub: string, color: string) => (
		<g opacity={fade(frame, at)}>
			<text x={200} y={y - 150} {...svgMincho(48, color)}>
				{label}
			</text>
			<text x={200 + label.length * 52} y={y - 150} {...svgGothic(30, '#c9d3e3', 900)}>
				{sub}
			</text>
			{Array.from({length: n}, (_, i) => {
				const isW = i < women;
				const isC = i >= n - children;
				return <Figure key={i} x={230 + i * 76} y={y} h={110} woman={isW} child={isC} color={isW ? '#f0a6b8' : '#8fb4e0'} />;
			})}
		</g>
	);
	return (
		<Canvas tone="night">
			{row(470, 16, 0, 8, '1916年の判定', '　大半が女性', '#f0c3cf')}
			{row(800, 9, 3, 70, 'のちの再調査', '　男女ほぼ半々・子どもも', colors.goldSoft)}
			<g opacity={fade(frame, 40)}>
				<Figure x={1580} y={180} h={50} woman color="#f0a6b8" />
				<text x={1610} y={176} {...svgGothic(28, '#f0c3cf', 900)}>
					女性
				</text>
				<Figure x={1710} y={180} h={50} color="#8fb4e0" />
				<text x={1740} y={176} {...svgGothic(28, '#bcd3f0', 900)}>
					男性
				</text>
			</g>
			<text x={960} y={890} textAnchor="middle" {...svgGothic(28, '#8ea2bd', 700)} opacity={fade(frame, 100)}>
				割合を示すイメージ
			</text>
		</Canvas>
	);
};

// 第6の手がかり：34人の中で、血のつながりは母と娘の1組だけ
export const Kinship: React.FC = () => {
	const frame = useCurrentFrame();
	const cols = 17;
	const origin = ['#d8b26a', '#9fb0c8', '#6fbf8a'];
	const pos = (i: number) => [250 + (i % cols) * 89, 470 + Math.floor(i / cols) * 250] as const;
	const a = 5;
	const b = 26;
	const [ax, ay] = pos(a);
	const [bx, by] = pos(b);
	return (
		<Canvas tone="moss">
			{Array.from({length: 34}, (_, i) => {
				const [x, y] = pos(i);
				const o = fade(frame, 4 + i * 1.5, 10);
				const c = origin[Math.floor(rand(i + 3) * 3)];
				return <Figure key={i} x={x} y={y} h={150} woman={rand(i + 11) > 0.5 || i === a || i === b} color={c} />;
			})}
			<g opacity={fade(frame, 70)}>
				<path d={`M ${ax} ${ay - 175} C ${ax} ${ay - 230}, ${bx} ${by - 300}, ${bx} ${by - 175}`} stroke="#ffcf7a" strokeWidth={6} fill="none" />
				<circle cx={ax} cy={ay - 80} r={92} fill="none" stroke="#ffcf7a" strokeWidth={5} />
				<circle cx={bx} cy={by - 80} r={92} fill="none" stroke="#ffcf7a" strokeWidth={5} />
			</g>
			<g opacity={fade(frame, 40)}>
				{['海岸', '高地', 'アマゾン'].map((t, i) => (
					<g key={t}>
						<circle cx={600 + i * 300} cy={230} r={16} fill={origin[i === 0 ? 0 : i === 1 ? 1 : 2]} />
						<text x={630 + i * 300} y={242} {...svgGothic(34, '#efe6d2', 900)}>
							{t}
						</text>
					</g>
				))}
			</g>
			<text x={960} y={880} textAnchor="middle" {...svgMincho(44, '#ffe2a8')} opacity={fade(frame, 90)}>
				血のつながりは、母と娘の1組だけ
			</text>
		</Canvas>
	);
};

// 第8の手がかり：台形の出入口と、内側に傾いた壁
export const Doorway: React.FC = () => {
	const frame = useCurrentFrame();
	const rows = 9;
	const g = 860;
	const lean = 26;
	const blocks = [];
	for (let r = 0; r < rows; r++) {
		const y = g - (r + 1) * 64;
		const shift = (lean * (r + 1)) / rows;
		let x = 420 + shift;
		let k = 0;
		const right = 1500 - shift;
		while (x < right - 10) {
			const w = Math.min(90 + rand(r * 31 + k) * 90, right - x);
			// 出入口の部分は空ける（下が広く、上がせまい台形）
			const half = 120 - r * 7;
			const doorL = 960 - half;
			const doorR = 960 + half;
			const top = r >= 7;
			if (!top && x + w > doorL && x < doorR) {
				if (x < doorL) blocks.push({x, y, w: doorL - x, r, k});
				x = doorR;
				k++;
				continue;
			}
			blocks.push({x, y, w, r, k});
			x += w;
			k++;
		}
	}
	return (
		<Canvas tone="ink">
			<line x1={300} y1={g} x2={1620} y2={g} stroke="#5a4a3a" strokeWidth={4} />
			{blocks.map((b, i) => (
				<rect key={i} x={b.x + 2} y={b.y + 2} width={b.w - 4} height={60} rx={8} fill={STONE} stroke={STONE_DARK} strokeWidth={3} opacity={fade(frame, 2 + b.r * 6, 10)} />
			))}
			<g opacity={fade(frame, 70)}>
				<path d={`M 840 ${g} L 891 ${g - 7 * 64} L 1029 ${g - 7 * 64} L 1080 ${g}`} stroke="#ffcf7a" strokeWidth={6} fill="none" strokeDasharray="16 10" />
				<text x={960} y={g - 7 * 64 - 30} textAnchor="middle" {...svgMincho(44, '#ffe2a8')}>
					下が広く、上がせまい
				</text>
			</g>
			<g opacity={fade(frame, 100)}>
				<line x1={400} y1={g} x2={400 + lean} y2={g - rows * 64} stroke="#9fd6e6" strokeWidth={5} />
				<line x1={400} y1={g} x2={400} y2={g - rows * 64} stroke="#9fd6e6" strokeWidth={2} strokeDasharray="8 8" />
				<text x={380} y={g - rows * 64 - 24} textAnchor="end" {...svgGothic(32, '#bfe6f0', 900)}>
					壁は内側へ傾く
				</text>
				<text x={1540} y={g - rows * 64 - 24} {...svgGothic(32, '#efe6d2', 900)}>
					モルタルなし
				</text>
			</g>
		</Canvas>
	);
};

// 第8の手がかり：広場の地下の排水の層と、雨
export const Drainage: React.FC = () => {
	const frame = useCurrentFrame();
	const top = 430;
	const layers = [
		{label: '表面の土', h: 70, c: '#5b4a32'},
		{label: '砂利', h: 120, c: '#8a826e'},
		{label: '砕いた石', h: 170, c: '#a59b86'},
	];
	let y = top;
	return (
		<Canvas tone="night">
			{/* 雨 */}
			{Array.from({length: 60}, (_, i) => {
				const x = 120 + rand(i) * 1300;
				const yy = ((frame * 14 + rand(i + 50) * 400) % 320) + 40;
				return <line key={i} x1={x} y1={yy} x2={x - 8} y2={yy + 34} stroke="#9fc8e8" strokeWidth={3} opacity={0.6} />;
			})}
			<rect x={100} y={top - 18} width={1340} height={18} fill="#6b8a4a" />
			{layers.map((l, i) => {
				const yy = y;
				y += l.h;
				return (
					<g key={l.label} opacity={fade(frame, 10 + i * 16)}>
						<rect x={100} y={yy} width={1340} height={l.h} fill={l.c} />
						{Array.from({length: i === 0 ? 0 : 50}, (_, k) => (
							<circle key={k} cx={110 + rand(k + i * 100) * 1320} cy={yy + 10 + rand(k + i * 200) * (l.h - 20)} r={i === 1 ? 7 : 14} fill="rgba(0,0,0,0.18)" />
						))}
						<text x={1470} y={yy + l.h / 2 + 14} {...svgMincho(42, '#efe6d2')}>
							{l.label}
						</text>
					</g>
				);
			})}
			{/* しみこむ水 */}
			{Array.from({length: 7}, (_, i) => {
				const x = 220 + i * 180;
				const p = ((frame - 50 + i * 9) % 70) / 70;
				return frame > 50 ? <circle key={i} cx={x} cy={top + p * 340} r={11} fill="#5fb0e8" opacity={0.85} /> : null;
			})}
			<g opacity={fade(frame, 90)}>
				<rect x={100} y={800} width={1340} height={80} rx={12} fill="rgba(5,10,20,0.85)" stroke={colors.gold} strokeWidth={3} />
				<text x={770} y={855} textAnchor="middle" {...svgMincho(42, '#ffe2a8')}>
					建設の労力の50〜60％は、地面の下へ
				</text>
			</g>
		</Canvas>
	);
};

// 第10の手がかり：森の上からレーザーを当て、木を取り除くと地表が見える
export const LidarScan: React.FC = () => {
	const frame = useCurrentFrame();
	const sweep = interpolate(frame, [20, 110], [150, 1770], easeInOut);
	const strip = interpolate(frame, [120, 170], [0, 1], clamp);
	// 段々畑の地面（階段状）
	const ground: string[] = ['M 100 900'];
	for (let i = 0; i < 12; i++) {
		const x = 100 + i * 145;
		const yy = 860 - i * 38;
		ground.push(`L ${x} ${yy} L ${x + 145} ${yy}`);
	}
	ground.push('L 1840 404 L 1840 1080 L 100 1080 Z');
	const drone = sweep;
	return (
		<Canvas tone="night">
			<path d={ground.join(' ')} fill="#4b3f2c" stroke="#e8c98a" strokeWidth={interpolate(strip, [0, 1], [0, 5])} />
			{/* 木々 */}
			<g opacity={1 - strip}>
				{Array.from({length: 46}, (_, i) => {
					const x = 120 + i * 37 + rand(i) * 20;
					const base = 860 - Math.floor((x - 100) / 145) * 38;
					const h = 90 + rand(i + 9) * 70;
					return (
						<g key={i}>
							<rect x={x - 4} y={base - h * 0.4} width={8} height={h * 0.4} fill="#2a2015" />
							<circle cx={x} cy={base - h * 0.55} r={34 + rand(i + 4) * 14} fill="#1f4a2a" stroke="#2f6a3a" strokeWidth={3} />
						</g>
					);
				})}
			</g>
			{/* ドローンとレーザー */}
			<g opacity={interpolate(frame, [5, 15, 115, 125], [0, 1, 1, 0], clamp)}>
				<rect x={drone - 50} y={170} width={100} height={22} rx={8} fill="#d9e2ee" />
				<line x1={drone - 70} y1={165} x2={drone + 70} y2={165} stroke="#d9e2ee" strokeWidth={6} />
				{Array.from({length: 9}, (_, k) => {
					const tx = drone - 160 + k * 40;
					const ty = 860 - Math.max(0, Math.floor((tx - 100) / 145)) * 38;
					return <line key={k} x1={drone} y1={194} x2={tx} y2={ty} stroke="#ff5a5a" strokeWidth={2} opacity={0.55} />;
				})}
			</g>
			{/* 取れた点 */}
			{Array.from({length: 120}, (_, i) => {
				const x = 110 + (i / 120) * 1720;
				const yy = 860 - Math.max(0, Math.floor((x - 100) / 145)) * 38 - 4;
				return x < sweep ? <circle key={i} cx={x} cy={yy} r={4} fill="#ffcf7a" opacity={0.9} /> : null;
			})}
			<text x={960} y={120} textAnchor="middle" {...svgMincho(46, '#ffe2a8')} opacity={fade(frame, 125)}>
				木を取り除くと、段々畑が現れる
			</text>
		</Canvas>
	);
};

// 第10の手がかり：見つかった「遺構の候補」（L字型の壁・三段の段々畑・四角い石材）
export const Candidates: React.FC = () => {
	const frame = useCurrentFrame();
	const g = 820;
	const s = 110; // 1m = 110ピクセル
	return (
		<Canvas tone="moss">
			<line x1={80} y1={g} x2={1840} y2={g} stroke="#5a4a3a" strokeWidth={4} />
			{/* L字型の壁（高さ2.7m） */}
			<g opacity={fade(frame, 6)}>
				<path d={`M 150 ${g} L 150 ${g - 2.7 * s} L 216 ${g - 2.7 * s} L 216 ${g - 40} L 520 ${g - 40} L 520 ${g} Z`} fill={STONE} stroke={STONE_DARK} strokeWidth={4} />
				<Figure x={300} y={g - 40} h={1.7 * s} color="#9fb0c8" />
				<line x1={120} y1={g} x2={120} y2={g - 2.7 * s} stroke="#ffcf7a" strokeWidth={4} />
				<text x={110} y={g - 1.35 * s} textAnchor="end" {...svgGothic(30, '#ffe2a8', 900)}>
					2.7m
				</text>
				<text x={335} y={g + 64} textAnchor="middle" {...svgMincho(40, '#efe6d2')}>
					L字型の壁
				</text>
			</g>
			{/* 左右対称の三段 */}
			<g opacity={fade(frame, 40)}>
				{[0, 1, 2].map((i) => (
					<rect key={i} x={680 + i * 70} y={g - (i + 1) * 70} width={560 - i * 140} height={70} fill="#7a6a4a" stroke="#c9b48a" strokeWidth={3} />
				))}
				<text x={960} y={g + 64} textAnchor="middle" {...svgMincho(40, '#efe6d2')}>
					左右対称の3段
				</text>
			</g>
			{/* 四角い石材と裏の空洞 */}
			<g opacity={fade(frame, 75)}>
				<rect x={1380} y={g - 0.9 * s} width={2 * s} height={0.9 * s} fill={STONE} stroke={STONE_DARK} strokeWidth={4} />
				<rect x={1400} y={g - 0.9 * s - 90} width={180} height={80} rx={30} fill="#0b120c" stroke="#9fd6e6" strokeWidth={3} strokeDasharray="10 8" opacity={fade(frame, 100)} />
				<text x={1490} y={g - 0.9 * s - 110} textAnchor="middle" {...svgGothic(28, '#bfe6f0', 900)} opacity={fade(frame, 100)}>
					裏に空洞
				</text>
				<text x={1490} y={g - 0.9 * s / 2 + 12} textAnchor="middle" {...svgGothic(30, '#3a3020', 900)}>
					約2m
				</text>
				<text x={1490} y={g + 64} textAnchor="middle" {...svgMincho(40, '#efe6d2')}>
					四角い石材
				</text>
			</g>
			<text x={960} y={250} textAnchor="middle" {...svgMincho(54, '#ffe2a8')} opacity={fade(frame, 120)}>
				どれも、まだ「候補」
			</text>
		</Canvas>
	);
};

// 第9の手がかり：野内与吉から、ふたばの調査までのつながり
export const JapanChain: React.FC = () => {
	const frame = useCurrentFrame();
	const nodes = [
		{x: 330, y: 380, t: '野内与吉', s: '大玉村の生まれ\nマチュピチュ村の初代村長', at: 6},
		{x: 960, y: 380, t: '大玉村', s: '2015年\nマチュピチュ村と友好都市', at: 34},
		{x: 1590, y: 380, t: '富岡町', s: '2011年 原発事故\n大玉村が町民を受け入れ', at: 62},
		{x: 1590, y: 720, t: 'ふたば', s: '富岡町の測量会社\n「恩返しを」', at: 90},
		{x: 960, y: 720, t: 'マチュピチュ', s: '2019年 JICAの事業に採択\n3次元測量の調査へ', at: 118},
	];
	const links: [number, number][] = [
		[0, 1],
		[2, 1],
		[2, 3],
		[3, 4],
	];
	return (
		<Canvas tone="night">
			{links.map(([a, b], i) => {
				const A = nodes[a];
				const B = nodes[b];
				const at = Math.max(A.at, B.at) + 6;
				const p = interpolate(frame, [at, at + 20], [0, 1], easeInOut);
				return <line key={i} x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p} stroke={colors.gold} strokeWidth={6} opacity={0.8} />;
			})}
			{nodes.map((n) => (
				<g key={n.t} opacity={fade(frame, n.at)}>
					<rect x={n.x - 270} y={n.y - 120} width={540} height={240} rx={18} fill="#0f1a2c" stroke={colors.gold} strokeWidth={3} />
					<text x={n.x} y={n.y - 40} textAnchor="middle" {...svgMincho(56, colors.goldSoft)}>
						{n.t}
					</text>
					{n.s.split('\n').map((ln, k) => (
						<text key={k} x={n.x} y={n.y + 30 + k * 46} textAnchor="middle" {...svgGothic(32, '#efe6d2', 900)}>
							{ln}
						</text>
					))}
				</g>
			))}
		</Canvas>
	);
};
