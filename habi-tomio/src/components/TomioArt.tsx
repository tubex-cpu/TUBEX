import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, Reveal, svgGothic, svgMincho} from './Cinema';
import {Canvas} from './IzumoKit';

// 富雄丸山古墳判決：図解

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const IRON = '#8a5a3a';
const IRON_LIGHT = '#c08a5e';

// 6回くねる蛇行剣（左端が茎、右端が切っ先。len はピクセル）
const Dakoken: React.FC<{readonly x: number; readonly y: number; readonly len: number; readonly w?: number; readonly color?: string; readonly draw?: number}> = ({x, y, len, w = 16, color = IRON, draw = 1}) => {
	const tang = len * (21 / 237);
	const blade = len - tang;
	const pts: string[] = [];
	const n = 60;
	for (let i = 0; i <= n; i++) {
		const t = i / n;
		// 刃の中ほどに6回の曲がり（切っ先に近い側に集める）
		const k = t > 0.08 && t < 0.78 ? Math.sin(((t - 0.08) / 0.7) * Math.PI * 3) * w * 0.9 : 0;
		pts.push(`${tang + blade * t} ${k}`);
	}
	return (
		<g transform={`translate(${x} ${y})`}>
			<rect x={0} y={-w * 0.25} width={tang} height={w * 0.5} fill={color} opacity={0.85} />
			<path d={`M ${pts.join(' L ')}`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
			<path d={`M ${pts.join(' L ')}`} stroke={IRON_LIGHT} strokeWidth={w * 0.18} fill="none" opacity={0.5} pathLength={1} strokeDasharray={`${draw} 1`} />
		</g>
	);
};

// 人のシルエット（身長 h ピクセル）
const Person: React.FC<{readonly x: number; readonly y: number; readonly h: number; readonly color?: string}> = ({x, y, h, color = '#9fb0c8'}) => (
	<g transform={`translate(${x} ${y}) scale(${h / 170})`} fill={color}>
		<circle cx={0} cy={-158} r={12} />
		<path d="M -16 -142 L 16 -142 L 22 -80 L 12 -80 L 10 0 L 2 0 L 0 -70 L -2 0 L -10 0 L -12 -80 L -22 -80 Z" />
	</g>
);

// 冒頭・第3の手がかり：剣と人の背丈（1cm = s ピクセル）
export const SwordScale: React.FC<{readonly withOld?: boolean}> = ({withOld = true}) => {
	const frame = useCurrentFrame();
	const s = 5.4;
	const ground = 860;
	const draw = interpolate(frame, [10, 70], [0, 1], easeInOut);
	return (
		<Canvas tone="ember">
			<line x1={120} y1={ground} x2={1800} y2={ground} stroke="#5a4a3a" strokeWidth={4} />
			<Reveal at={4}>
				<Person x={220} y={ground} h={170 * s} />
				<text x={220} y={ground - 170 * s - 24} textAnchor="middle" {...svgGothic(34, '#c9d3e3', 900)}>
					身長170cm
				</text>
			</Reveal>
			{/* 鞘に納めた長さ285cmの帯 */}
			<g opacity={interpolate(frame, [70, 90], [0, 1], clamp)}>
				<rect x={380} y={ground - 150} width={285 * s} height={34} rx={8} fill="#3a2414" stroke="#c9a06a" strokeWidth={3} />
				<text x={380 + 285 * s + 20} y={ground - 122} {...svgMincho(50, colors.goldSoft)}>
					285cm
				</text>
				<text x={380 + 142 * s} y={ground - 170} textAnchor="middle" {...svgGothic(30, '#e6d2b0', 900)}>
					鞘に納めた長さ
				</text>
			</g>
			<Dakoken x={380} y={ground - 240} len={237 * s} w={18} draw={draw} />
			<text x={380 + 237 * s + 20} y={ground - 228} {...svgMincho(50, '#ffd0a8')} opacity={draw}>
				237cm
			</text>
			{withOld ? (
				<g opacity={interpolate(frame, [100, 120], [0, 1], clamp)}>
					<Dakoken x={380} y={ground - 360} len={84.6 * s} w={12} color="#6b6f7a" />
					<text x={380 + 84.6 * s + 20} y={ground - 350} {...svgGothic(34, '#c9d3e3', 900)}>
						これまでの最長 84.6cm（北原古墳）
					</text>
				</g>
			) : null}
		</Canvas>
	);
};

// 第3の手がかり：剣の各部の長さ（鉄身237・刃216・柄をつけて254・鞘に納めて285）
export const SwordParts: React.FC = () => {
	const frame = useCurrentFrame();
	const s = 5.6;
	const x0 = 220;
	const y = 560;
	const rows = [
		{label: '刃', len: 216, from: 21, at: 20, color: '#ffd0a8'},
		{label: '鉄の部分', len: 237, from: 0, at: 45, color: '#ffb07a'},
		{label: '柄をつけて', len: 254, from: -17, at: 70, color: colors.goldSoft},
		{label: '鞘に納めて', len: 285, from: -17, at: 95, color: '#9fd6e6'},
	];
	return (
		<Canvas tone="ink">
			<Dakoken x={x0} y={y} len={237 * s} w={22} draw={interpolate(frame, [4, 40], [0, 1], easeInOut)} />
			{rows.map((r, i) => {
				const o = interpolate(frame, [r.at, r.at + 16], [0, 1], clamp);
				const yy = y + 90 + i * 62;
				const a = x0 + r.from * s;
				return (
					<g key={r.label} opacity={o}>
						<line x1={a} y1={yy} x2={a + r.len * s} y2={yy} stroke={r.color} strokeWidth={6} />
						<line x1={a} y1={yy - 14} x2={a} y2={yy + 14} stroke={r.color} strokeWidth={4} />
						<line x1={a + r.len * s} y1={yy - 14} x2={a + r.len * s} y2={yy + 14} stroke={r.color} strokeWidth={4} />
						<text x={a + r.len * s + 18} y={yy + 12} {...svgGothic(34, r.color, 900)}>
							{r.label} {r.len}cm
						</text>
					</g>
				);
			})}
			<text x={x0 + 120 * s} y={y - 70} textAnchor="middle" {...svgMincho(46, '#efe6d2')} opacity={interpolate(frame, [30, 45], [0, 1], clamp)}>
				刃は、6回くねる
			</text>
		</Canvas>
	);
};

// 第1の手がかり：円墳と前方後円墳の大きさくらべ（同じ縮尺）
export const KofunCompare: React.FC = () => {
	const frame = useCurrentFrame();
	const m = 1.45; // 1mあたりのピクセル
	const cy = 610;
	const keyhole = (len: number) => {
		const r = len * 0.27;
		const neck = len * 0.16;
		const front = len * 0.32;
		return `M 0 ${-r} A ${r} ${r} 0 1 0 0 ${r} L ${len - 2 * r} ${neck} L ${len - r * 0.95} ${front} L ${len - r * 0.95} ${-front} L ${len - 2 * r} ${-neck} Z`;
	};
	return (
		<Canvas tone="moss">
			<Reveal at={6}>
				<circle cx={250} cy={cy} r={(109 / 2) * m} fill="#4b6a3a" stroke="#ffcf7a" strokeWidth={4} />
				<text x={250} y={cy + 150} textAnchor="middle" {...svgMincho(42, colors.goldSoft)}>
					富雄丸山古墳
				</text>
				<text x={250} y={cy + 200} textAnchor="middle" {...svgGothic(32, '#e6efd8', 900)}>
					円墳・直径109m
				</text>
			</Reveal>
			<Reveal at={26}>
				<circle cx={520} cy={cy} r={(105 / 2) * m} fill="#3e5631" stroke="#a8c48a" strokeWidth={3} />
				<text x={520} y={cy + 150} textAnchor="middle" {...svgMincho(38, '#e6efd8')}>
					丸墓山古墳
				</text>
				<text x={520} y={cy + 200} textAnchor="middle" {...svgGothic(30, '#c9d8b8', 900)}>
					円墳・直径105m
				</text>
			</Reveal>
			<g opacity={interpolate(frame, [50, 70], [0, 1], clamp)}>
				<g transform={`translate(${760 + 486 * 0.27 * m} ${cy}) scale(${m})`}>
					<path d={keyhole(486)} fill="#3e5631" stroke="#a8c48a" strokeWidth={2} />
				</g>
				<text x={760 + 243 * m} y={cy + 230} textAnchor="middle" {...svgMincho(38, '#e6efd8')}>
					大山古墳（仁徳天皇陵とされる）
				</text>
				<text x={760 + 243 * m} y={cy + 280} textAnchor="middle" {...svgGothic(30, '#c9d8b8', 900)}>
					前方後円墳・長さ486m
				</text>
			</g>
		</Canvas>
	);
};

// 第2の手がかり：86mと思われていた古墳が、109mに（航空レーザー測量）
export const DiameterUpdate: React.FC = () => {
	const frame = useCurrentFrame();
	const m = 3.4;
	const grow = interpolate(frame, [70, 110], [86, 109], easeInOut);
	const scan = interpolate(frame, [20, 70], [0, 1], easeInOut);
	return (
		<Canvas tone="night">
			{[...Array(26)].map((_, i) => (
				<line key={i} x1={300 + i * 52} y1={250} x2={300 + i * 52} y2={950} stroke="#3c8ac8" strokeWidth={2} opacity={scan > i / 26 ? 0.35 : 0} />
			))}
			<circle cx={960} cy={600} r={(86 / 2) * m} fill="none" stroke="#9fb0c8" strokeWidth={4} strokeDasharray="14 10" />
			<circle cx={960} cy={600} r={(grow / 2) * m} fill="rgba(75,106,58,0.55)" stroke="#ffcf7a" strokeWidth={5} />
			<text x={960} y={615} textAnchor="middle" {...svgMincho(90, '#fff3d6')}>
				{Math.round(grow)}m
			</text>
			<text x={420} y={330} {...svgGothic(34, '#c9d3e3', 900)}>
				1972年の報告　約86m
			</text>
			<text x={1500} y={330} textAnchor="end" {...svgGothic(34, colors.goldSoft, 900)} opacity={interpolate(frame, [100, 120], [0, 1], clamp)}>
				2018年度の発掘　109m
			</text>
		</Canvas>
	);
};

// 第3の手がかり：古墳の平面図（墳頂の埋葬と、造り出しの埋葬）
export const KofunPlan: React.FC = () => {
	const frame = useCurrentFrame();
	const cx = 900;
	const cy = 600;
	const r = 280;
	return (
		<Canvas tone="moss">
			<Reveal at={6}>
				<circle cx={cx} cy={cy} r={r} fill="#4b6a3a" stroke="#a8c48a" strokeWidth={4} />
				<circle cx={cx} cy={cy} r={r * 0.7} fill="#557a42" />
				<circle cx={cx} cy={cy} r={r * 0.4} fill="#628a4c" />
			</Reveal>
			<Reveal at={26}>
				<rect x={cx + r * 0.55} y={cy - r * 1.05} width={150} height={120} transform={`rotate(-40 ${cx + r * 0.55} ${cy - r * 1.05})`} fill="#628a4c" stroke="#a8c48a" strokeWidth={4} />
				<text x={cx + r + 80} y={cy - r - 10} {...svgMincho(46, colors.goldSoft)}>
					造り出し
				</text>
			</Reveal>
			<g opacity={interpolate(frame, [50, 66], [0, 1], clamp)}>
				<rect x={cx - 50} y={cy - 12} width={100} height={24} fill="#c9a06a" />
				<text x={cx} y={cy + 70} textAnchor="middle" {...svgGothic(32, '#fff3d6', 900)}>
					墳頂の埋葬（明治に盗掘）
				</text>
			</g>
			<g opacity={interpolate(frame, [76, 92], [0, 1], clamp)}>
				<circle cx={cx + r * 0.98} cy={cy - r * 0.95} r={16} fill="#ff6b52" stroke="#fff" strokeWidth={3} />
				<text x={cx + r + 80} y={cy - r + 46} {...svgGothic(32, '#ffd0c8', 900)}>
					粘土槨（剣と鏡）
				</text>
			</g>
			<text x={320} y={980} {...svgGothic(26, '#9fb0c8', 700)} opacity={interpolate(frame, [20, 40], [0, 1], clamp)}>
				図は位置関係の説明用（縮尺は正確ではない）
			</text>
		</Canvas>
	);
};

// 第3・5の手がかり：粘土槨の断面（棺を包む粘土の中に、剣と鏡）
export const ClayCasing: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Canvas tone="ember">
			<rect x={0} y={760} width={1920} height={320} fill="#3e2f20" />
			<Reveal at={6}>
				<path d="M 360 760 L 360 640 Q 960 380 1560 640 L 1560 760 Z" fill="#8a7458" />
				<text x={960} y={560} textAnchor="middle" {...svgGothic(34, '#efe6d2', 900)}>
					棺を包む粘土
				</text>
			</Reveal>
			<Reveal at={24}>
				<path d="M 520 760 L 520 700 Q 960 620 1400 700 L 1400 760 Z" fill="#6b4a2e" stroke="#a07a4a" strokeWidth={4} />
				<text x={960} y={735} textAnchor="middle" {...svgGothic(32, '#fff3d6', 900)}>
					木の棺
				</text>
			</Reveal>
			<g opacity={interpolate(frame, [50, 66], [0, 1], clamp)}>
				<Dakoken x={430} y={610} len={560} w={12} />
				<text x={700} y={590} textAnchor="middle" {...svgMincho(40, '#ffd0a8')}>
					蛇行剣
				</text>
			</g>
			<g opacity={interpolate(frame, [76, 92], [0, 1], clamp)}>
				<path d="M 500 690 L 560 640 L 640 640 L 660 700 Z" fill="#5f8f7c" stroke="#9cc7b1" strokeWidth={3} />
				<text x={380} y={860} {...svgMincho(40, '#9cc7b1')}>
					盾形銅鏡（斜めに立てかけ）
				</text>
			</g>
		</Canvas>
	);
};

// 第6・7の手がかり：3つの部屋に仕切られた木の棺（上から見た図）
export const CoffinRooms: React.FC = () => {
	const frame = useCurrentFrame();
	const rooms = [
		{x: 220, w: 360, title: '副室', sub: '鏡3面', at: 30, hot: true},
		{x: 600, w: 720, title: '主室', sub: '竪櫛9点・水銀朱', at: 50, hot: true},
		{x: 1340, w: 360, title: '副室', sub: '副葬品なし', at: 70},
	];
	return (
		<Canvas tone="ember">
			<Reveal at={6}>
				<rect x={200} y={420} width={1520} height={260} rx={130} fill="#6b4a2e" stroke="#a07a4a" strokeWidth={6} />
			</Reveal>
			{rooms.map((r) => (
				<g key={r.x} opacity={interpolate(frame, [r.at, r.at + 14], [0, 1], clamp)}>
					<rect x={r.x} y={450} width={r.w} height={200} fill={r.hot ? '#3b2414' : '#2a1d14'} />
					<text x={r.x + r.w / 2} y={530} textAnchor="middle" {...svgMincho(48, colors.goldSoft)}>
						{r.title}
					</text>
					<text x={r.x + r.w / 2} y={590} textAnchor="middle" {...svgGothic(32, '#efe6d2', 900)}>
						{r.sub}
					</text>
				</g>
			))}
			<g opacity={interpolate(frame, [20, 34], [0, 1], clamp)}>
				<rect x={584} y={440} width={12} height={220} fill="#c9a06a" />
				<rect x={1324} y={440} width={12} height={220} fill="#c9a06a" />
				<text x={960} y={760} textAnchor="middle" {...svgGothic(32, '#c9d3e3', 900)}>
					コウヤマキの割竹形木棺・仕切りはスギの板（本来の長さ 約5.86m）
				</text>
			</g>
		</Canvas>
	);
};

// 第6の手がかり：古い木の棺を残す保存処理
export const Preservation: React.FC = () => {
	const frame = useCurrentFrame();
	const steps = [
		{title: '薬の液に漬ける', sub: '木の中に染み込ませる'},
		{title: '真空で凍らせて乾かす', sub: '縮みやひび割れを防ぐ'},
		{title: '未来に残す', sub: '4機関の共同研究'},
	];
	return (
		<Canvas tone="night">
			{steps.map((s, i) => {
				const x = 360 + i * 600;
				const at = 8 + i * 26;
				return (
					<g key={s.title} opacity={interpolate(frame, [at, at + 14], [0, 1], clamp)}>
						<circle cx={x} cy={580} r={170} fill="#14223a" stroke={i === 2 ? '#ffcf7a' : colors.gold} strokeWidth={5} />
						<text x={x} y={575} textAnchor="middle" {...svgMincho(s.title.length > 7 ? 38 : 46, '#fbf6ea')}>
							{s.title}
						</text>
						<text x={x} y={630} textAnchor="middle" {...svgGothic(28, colors.goldSoft, 900)}>
							{s.sub}
						</text>
						{i < 2 ? <path d={`M ${x + 180} 580 L ${x + 420} 580`} stroke={colors.gold} strokeWidth={5} opacity={interpolate(frame, [at + 14, at + 24], [0, 1], clamp)} /> : null}
					</g>
				);
			})}
		</Canvas>
	);
};

// 第7の手がかり：鏡が作られた時代と、古墳が造られた時代
export const MirrorAges: React.FC = () => {
	const frame = useCurrentFrame();
	const x = (yr: number) => 200 + ((yr + 150) / (450 + 150)) * 1520;
	const items = [
		{a: -30, b: 20, label: '虺龍文鏡', sub: '前漢〜新', y: 0},
		{a: 180, b: 240, label: '画像鏡', sub: '後漢', y: 1},
		{a: 240, b: 260, label: '三角縁神獣鏡', sub: '魏', y: 2},
	];
	return (
		<Canvas tone="ink">
			<line x1={x(-150)} y1={760} x2={x(450)} y2={760} stroke="#4c5a70" strokeWidth={6} />
			{[-100, 0, 100, 200, 300, 400].map((y) => (
				<text key={y} x={x(y)} y={810} textAnchor="middle" {...svgGothic(26, '#7f8ea8', 700)}>
					{y < 0 ? `前${-y}年` : `${y}年`}
				</text>
			))}
			{items.map((it, i) => (
				<g key={it.label} opacity={interpolate(frame, [10 + i * 20, 24 + i * 20], [0, 1], clamp)}>
					<rect x={x(it.a)} y={420 + it.y * 100} width={Math.max(30, x(it.b) - x(it.a))} height={50} rx={10} fill="#5f8f7c" />
					<text x={x(it.a) - 16} y={456 + it.y * 100} textAnchor="end" {...svgMincho(40, '#cfe8dc')}>
						{it.label}
					</text>
				</g>
			))}
			<g opacity={interpolate(frame, [80, 96], [0, 1], clamp)}>
				<rect x={x(350)} y={400} width={x(400) - x(350)} height={340} fill="rgba(233,75,60,0.25)" stroke="#ff8f80" strokeWidth={3} />
				<text x={(x(350) + x(400)) / 2} y={380} textAnchor="middle" {...svgMincho(40, '#ffd0c8')}>
					古墳
				</text>
				<text x={(x(350) + x(400)) / 2} y={720} textAnchor="middle" {...svgGothic(26, '#ffd0c8', 900)}>
					4世紀後半
				</text>
			</g>
			<text x={960} y={910} textAnchor="middle" {...svgGothic(32, '#c9d3e3', 900)} opacity={interpolate(frame, [100, 116], [0, 1], clamp)}>
				年代はおおよその目安
			</text>
		</Canvas>
	);
};

// 第9の手がかり：顕微鏡で見比べた、3面の鏡の磨き跡と、勾玉形の跡と銅の板
export const MirrorMatch: React.FC = () => {
	const frame = useCurrentFrame();
	const fit = interpolate(frame, [80, 120], [0, 1], easeInOut);
	return (
		<Canvas tone="night">
			{[0, 1, 2].map((i) => (
				<Reveal key={i} at={8 + i * 14}>
					<circle cx={360 + i * 300} cy={520} r={120} fill="#2a3a36" stroke="#9cc7b1" strokeWidth={4} />
					{[...Array(9)].map((_, k) => (
						<line key={k} x1={290 + i * 300} y1={440 + k * 18} x2={430 + i * 300} y2={430 + k * 18} stroke="#c97a6a" strokeWidth={3} opacity={0.6} />
					))}
					<text x={360 + i * 300} y={690} textAnchor="middle" {...svgGothic(30, '#cfe8dc', 900)}>
						鏡{i + 1}
					</text>
				</Reveal>
			))}
			<text x={660} y={770} textAnchor="middle" {...svgMincho(40, colors.goldSoft)} opacity={interpolate(frame, [50, 66], [0, 1], clamp)}>
				磨いた跡が、3面とも よく似ている
			</text>
			<g transform="translate(1480 520)">
				<path d="M 0 -90 A 90 90 0 1 0 40 60 Q 0 40 -10 0 Q -20 -60 0 -90 Z" fill="none" stroke="#ffcf7a" strokeWidth={6} strokeDasharray="12 8" />
				<g transform={`translate(${(1 - fit) * 220} ${(1 - fit) * -160})`}>
					<path d="M 0 -90 A 90 90 0 1 0 40 60 Q 0 40 -10 0 Q -20 -60 0 -90 Z" fill="#b08a4a" opacity={0.75} />
				</g>
				<text x={0} y={170} textAnchor="middle" {...svgGothic(30, '#ffcf7a', 900)}>
					鏡の跡と、銅の板の形
				</text>
				<text x={0} y={215} textAnchor="middle" {...svgMincho(40, '#fff3d6')} opacity={fit}>
					ほぼ一致
				</text>
			</g>
		</Canvas>
	);
};

export {Dakoken, Person};
