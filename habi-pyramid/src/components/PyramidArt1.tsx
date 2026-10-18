import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {clamp, ease, fadeIn, mincho, Pin, PyramidSection, Timeline, txt} from './PyramidKit';

// ---- 冒頭 ----

// 4500年前？ それとも2万年以上前？
export const AgeCounter: React.FC = () => {
	const frame = useCurrentFrame();
	const v = Math.round(interpolate(frame, [20, 80], [4500, 20000], {...clamp, easing: Easing.in(Easing.quad)}));
	return (
		<svg width={1300} height={520} viewBox="0 0 1300 520">
			<rect width={1300} height={520} rx={30} fill="rgba(5,9,18,0.75)" />
			<text x={650} y={110} textAnchor="middle" {...txt(44, colors.muted)}>
				大ピラミッドができたのは
			</text>
			<text x={650} y={330} textAnchor="middle" {...mincho(190, frame > 80 ? colors.correct : colors.goldSoft)}>
				{v.toLocaleString('ja-JP')}
				<tspan {...txt(80)}>年前</tspan>
			</text>
			<text x={650} y={450} textAnchor="middle" {...txt(60, colors.correct)} opacity={fadeIn(frame, 85)}>
				以上？
			</text>
		</svg>
	);
};

// 地下2キロに眠るもの？
export const UndergroundTeaser: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 80], [0, 1], ease);
	return (
		<svg width={1300} height={660} viewBox="0 0 1300 660">
			<rect width={1300} height={660} rx={30} fill="#3d2f22" />
			<rect width={1300} height={130} fill="#1f3354" />
			<path d="M500 130 L650 20 L800 130 Z" fill="#c9a96e" />
			{[-90, -30, 30, 90].map((dx, i) => (
				<line key={i} x1={650 + dx} y1={130} x2={650 + dx} y2={130 + 360 * p} stroke="#e8d9b0" strokeWidth={8} strokeDasharray="18 10" />
			))}
			<rect x={520} y={500} width={260} height={110} fill="none" stroke={colors.correct} strokeWidth={8} opacity={fadeIn(frame, 70)} />
			<text x={650} y={580} textAnchor="middle" {...mincho(90, colors.correct)} opacity={fadeIn(frame, 80)}>
				？
			</text>
			<text x={1000} y={560} {...txt(48, '#fff')} opacity={fadeIn(frame, 70)}>
				地下 約2km
			</text>
		</svg>
	);
};

// 論文に押される「撤回」
export const RetractionStamp: React.FC = () => {
	const frame = useCurrentFrame();
	const s = interpolate(frame, [30, 40], [2.2, 1], {...clamp, easing: Easing.out(Easing.back(2))});
	return (
		<svg width={1100} height={600} viewBox="0 0 1100 600">
			<rect x={300} y={30} width={500} height={540} rx={10} fill="#f4f1ea" />
			<rect x={340} y={70} width={420} height={30} fill="#2b2116" />
			{[...Array(12)].map((_, i) => (
				<rect key={i} x={340} y={130 + i * 34} width={i % 4 === 3 ? 260 : 420} height={14} fill="#b9b2a5" />
			))}
			<g transform={`translate(550 330) rotate(-14) scale(${s})`} opacity={fadeIn(frame, 30, 4)}>
				<rect x={-220} y={-80} width={440} height={160} rx={14} fill="none" stroke={colors.correct} strokeWidth={14} />
				<text y={45} textAnchor="middle" {...mincho(120, colors.correct)}>
					撤回
				</text>
			</g>
		</svg>
	);
};

// 2026年のカレンダー：予告された発表はまだ
export const Countdown2026: React.FC = () => {
	const frame = useCurrentFrame();
	const months = Math.min(10, Math.floor(interpolate(frame, [0, 60], [0, 10], clamp)));
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<text x={700} y={70} textAnchor="middle" {...txt(48, colors.goldSoft)}>
				2026年
			</text>
			{[...Array(12)].map((_, i) => {
				const x = 100 + (i % 6) * 205;
				const y = 110 + Math.floor(i / 6) * 210;
				const done = i < months;
				const now = i === 9 && months >= 10;
				return (
					<g key={i}>
						<rect x={x} y={y} width={180} height={180} rx={18} fill={now ? colors.correct : done ? '#3a4156' : '#f4ecdc'} />
						<text x={x + 90} y={y + 115} textAnchor="middle" {...mincho(72, done || now ? '#fff' : colors.ink)}>
							{i + 1}月
						</text>
					</g>
				);
			})}
			<text x={700} y={545} textAnchor="middle" {...txt(44, '#fff')} opacity={fadeIn(frame, 65)}>
				「歴史を書きかえる発見」の発表は……
			</text>
		</svg>
	);
};

// ---- 第1の手がかり ----

// カイロとギザの位置
export const GizaMap: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={660} viewBox="0 0 1300 660">
			<rect width={1300} height={660} rx={30} fill="#d8c08a" />
			<path d="M760 0 C 740 150 780 260 740 380 C 710 470 760 560 740 660" stroke="#3d7bb0" strokeWidth={36} fill="none" />
			<rect x={780} y={200} width={300} height={220} fill="#b9a27a" opacity={fadeIn(frame, 0)} />
			<Pin at={[900, 300]} label="カイロ" color={colors.wrong} show={fadeIn(frame, 0)} />
			{[
				[420, 330, 70],
				[520, 380, 62],
				[600, 430, 40],
			].map(([x, y, s], i) => (
				<path key={i} d={`M${x - s} ${y} L${x} ${y - s * 1.1} L${x + s} ${y} Z`} fill="#c9a96e" stroke="#7a5a2a" strokeWidth={4} opacity={fadeIn(frame, 25 + i * 10)} />
			))}
			<text x={500} y={520} textAnchor="middle" {...txt(52, colors.ink)} opacity={fadeIn(frame, 50)}>
				ギザの台地
			</text>
			<text x={760} y={60} {...txt(40, '#123b63')}>
				ナイル川
			</text>
		</svg>
	);
};

// 大ピラミッドの大きさ
export const PyramidSpecs: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 40], [0, 1], ease);
	return (
		<svg width={1400} height={640} viewBox="0 0 1400 640">
			<path d={`M150 560 L450 ${560 - 380 * p} L750 560 Z`} fill="#c9a96e" stroke="#8a6d3f" strokeWidth={5} />
			<line x1={150} y1={600} x2={750} y2={600} stroke="#fff" strokeWidth={4} opacity={p} />
			<text x={450} y={640} textAnchor="middle" {...txt(36)} opacity={p}>
				底の一辺 約230m
			</text>
			<line x1={800} y1={180} x2={800} y2={560} stroke="#fff" strokeWidth={4} opacity={p} />
			<text x={820} y={390} {...txt(36)} opacity={p}>
				高さ 約146m
			</text>
			{[
				['積まれた石', '約230万個'],
				['石1個の重さ', '平均 2トン超'],
			].map(([k, v], i) => (
				<g key={k} opacity={fadeIn(frame, 40 + i * 20)}>
					<text x={1000} y={240 + i * 170} {...txt(40, colors.muted)}>
						{k}
					</text>
					<text x={1000} y={310 + i * 170} {...txt(60, colors.goldSoft)}>
						{v}
					</text>
				</g>
			))}
		</svg>
	);
};

// クフ王の顔は？
export const KhufuFace: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1100} height={600} viewBox="0 0 1100 600">
			<circle cx={550} cy={290} r={240} fill="rgba(244,236,220,0.08)" stroke={colors.gold} strokeWidth={5} />
			<path d="M430 520 L430 300 C 430 180 670 180 670 300 L670 520 Z" fill="#2b3550" />
			<path d="M400 280 L550 150 L700 280 L700 360 L400 360 Z" fill="#3a4a6a" opacity={0.7} />
			<text x={550} y={380} textAnchor="middle" {...mincho(200, colors.goldSoft)} opacity={fadeIn(frame, 15, 20)}>
				？
			</text>
		</svg>
	);
};

// 石のすり減り方から年代を逆算する
export const ErosionMethod: React.FC = () => {
	const frame = useCurrentFrame();
	const wear = interpolate(frame, [20, 90], [0, 1], clamp);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect x={200} y={150} width={400} height={320} fill="#d9c8a0" />
			<rect x={200} y={150} width={400} height={70} fill="#f4f1ea" />
			<text x={400} y={130} textAnchor="middle" {...txt(36)}>
				化粧石に守られていた面
			</text>
			<path d={`M700 150 L1100 150 L1100 470 L700 470 Z`} fill="#c9b080" />
			<path d={`M700 150 Q 900 ${150 + 70 * wear} 1100 150`} fill="#16233d" />
			<text x={900} y={130} textAnchor="middle" {...txt(36)}>
				風にさらされた面
			</text>
			<g opacity={fadeIn(frame, 80)}>
				<line x1={1150} y1={150} x2={1150} y2={220} stroke={colors.correct} strokeWidth={6} />
				<text x={1150} y={540} textAnchor="middle" {...txt(44, colors.goldSoft)}>
					すり減りの差 → 年代？
				</text>
			</g>
		</svg>
	);
};

// もっと古い建物を受け継いだ？
export const InheritedBuilding: React.FC = () => {
	const frame = useCurrentFrame();
	const top = interpolate(frame, [30, 70], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<path d="M350 560 L520 340 L780 340 L950 560 Z" fill="#8a7a62" />
			<text x={650} y={480} textAnchor="middle" {...txt(44, '#fff')}>
				もっと古い時代の建物？
			</text>
			<path d={`M520 340 L650 ${340 - 230 * top} L780 340 Z`} fill="#c9a96e" />
			<text x={650} y={120} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				クフ王は、修理しただけ？
			</text>
		</svg>
	);
};

// 12か所の年代のばらつき
export const ScatterAges: React.FC = () => {
	const frame = useCurrentFrame();
	const ages = [5700, 8200, 11000, 14500, 17000, 21000, 24000, 27500, 31000, 38000, 44000, 52000];
	const x = (a: number) => 140 + (Math.log(a) - Math.log(4000)) / (Math.log(60000) - Math.log(4000)) * 1100;
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<rect width={1400} height={560} rx={30} fill="rgba(5,9,18,0.75)" />
			<line x1={120} y1={400} x2={1280} y2={400} stroke="#fff" strokeWidth={4} />
			{[5000, 10000, 20000, 50000].map((t) => (
				<text key={t} x={x(t)} y={460} textAnchor="middle" {...txt(36, colors.muted)}>
					{(t / 10000).toString().replace('0.5', '5千')}
					{t >= 10000 ? '万年前' : '年前'}
				</text>
			))}
			{ages.map((a, i) => (
				<circle key={a} cx={x(a)} cy={330 - (i % 3) * 70} r={20} fill={colors.correct} opacity={fadeIn(frame, i * 5)} />
			))}
			<text x={700} y={90} textAnchor="middle" {...txt(44)}>
				測った場所 12か所 → 年代がばらばら
			</text>
		</svg>
	);
};

// しっくいの炭の年代：4500〜4800年前
export const MortarDating: React.FC = () => (
	<Timeline
		from={6000}
		to={3000}
		ticks={[
			{at: 5500, label: '5500年前'},
			{at: 4500, label: '4500年前'},
			{at: 3500, label: '3500年前'},
		]}
		bars={[
			{start: 4800, end: 4500, label: 'しっくいの炭の年代', color: colors.gold, row: 0.4, at: 0},
			{start: 4560, end: 4540, label: 'クフ王の時代', color: colors.correct, row: 1.7, at: 30},
		]}
	/>
);

// 王の間の上の部屋に残る「クフ王の友」の落書き
export const FriendsGraffiti: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#1a1612" />
			{[...Array(3)].map((_, r) =>
				[...Array(4)].map((__, c) => <rect key={`${r}-${c}`} x={80 + c * 290 + (r % 2) * 140} y={60 + r * 180} width={270} height={165} fill="#9a8a72" stroke="#5a4a36" strokeWidth={6} />),
			)}
			<g opacity={fadeIn(frame, 15, 20)}>
				<ellipse cx={650} cy={300} rx={180} ry={70} fill="none" stroke="#b8412e" strokeWidth={10} />
				<text x={650} y={322} textAnchor="middle" {...mincho(64, '#b8412e')}>
					クフ王の友
				</text>
			</g>
			<path d="M840 300 L1060 300" stroke="#b8412e" strokeWidth={8} strokeDasharray="14 10" opacity={fadeIn(frame, 45)} />
			<text x={1040} y={420} textAnchor="middle" {...txt(36, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				石のすき間の奥まで
			</text>
		</svg>
	);
};

// ---- 第2の手がかり ----

// 主張された地下の構造：8本の縦穴と巨大な部屋
export const UndergroundClaim: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 90], [0, 1], ease);
	return (
		<svg width={1300} height={660} viewBox="0 0 1300 660">
			<rect width={1300} height={660} rx={30} fill="#3d2f22" />
			<rect width={1300} height={110} fill="#1f3354" />
			<path d="M520 110 L650 10 L780 110 Z" fill="#c9a96e" />
			{[...Array(8)].map((_, i) => (
				<rect key={i} x={520 + i * 34} y={110} width={14} height={300 * p} fill="#e8d9b0" opacity={0.85} />
			))}
			<text x={240} y={300} textAnchor="middle" {...txt(40, '#fff')} opacity={fadeIn(frame, 40)}>
				縦穴 8本・600m以上
			</text>
			<g opacity={fadeIn(frame, 80)}>
				<rect x={480} y={470} width={340} height={150} fill="none" stroke={colors.correct} strokeWidth={8} />
				<text x={1050} y={560} textAnchor="middle" {...txt(40, '#fff')}>
					一辺80mの部屋？
				</text>
				<text x={1050} y={610} textAnchor="middle" {...txt(36, colors.muted)}>
					（地下 約2km）
				</text>
			</g>
		</svg>
	);
};

// 人工衛星のレーダーが見えるのは、ごく浅いところ
export const RadarDepth: React.FC = () => {
	const frame = useCurrentFrame();
	const wave = interpolate(frame, [0, 50], [0, 1], ease);
	return (
		<svg width={1300} height={660} viewBox="0 0 1300 660">
			<rect width={1300} height={660} rx={30} fill="#3d2f22" />
			<rect width={1300} height={200} fill="#0b1222" />
			<g transform="translate(650 70)">
				<rect x={-60} y={-24} width={120} height={48} fill="#9aa0a8" />
				<rect x={-200} y={-12} width={130} height={24} fill="#3d6fa8" />
				<rect x={70} y={-12} width={130} height={24} fill="#3d6fa8" />
			</g>
			<path d={`M650 100 L${650 - 200 * wave} ${200 + 40 * wave} L${650 + 200 * wave} ${200 + 40 * wave} Z`} fill={colors.goldSoft} opacity={0.4} />
			<rect x={0} y={200} width={1300} height={40 * wave} fill={colors.goldSoft} opacity={0.5} />
			<text x={1260} y={232} textAnchor="end" {...txt(36, '#fff')} opacity={fadeIn(frame, 40)}>
				レーダーが届くのは、ここまで
			</text>
			<line x1={80} y1={250} x2={80} y2={620} stroke="#fff" strokeWidth={4} strokeDasharray="12 10" opacity={fadeIn(frame, 60)} />
			<text x={110} y={610} {...txt(44, colors.correct)} opacity={fadeIn(frame, 60)}>
				地下2km は？
			</text>
		</svg>
	);
};

// 大ピラミッドの地下にある、未完成の部屋
export const SubterraneanChamber: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<PyramidSection>
			<g opacity={fadeIn(frame, 15)}>
				<rect x={590} y={600} width={110} height={50} fill="none" stroke={colors.correct} strokeWidth={8} />
				<text x={760} y={640} {...txt(40, '#fff')}>
					地下の部屋（未完成）
				</text>
			</g>
		</PyramidSection>
	);
};

// 2026年8月、論文が撤回された理由
export const RetractionReasons: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			<rect x={100} y={40} width={1100} height={480} rx={20} fill="#f4f1ea" />
			<text x={160} y={120} {...txt(44, colors.ink)}>
				2022年の論文（大ピラミッドの内部構造）
			</text>
			{['重大な方法の欠陥', '統計の誤り'].map((r, i) => (
				<g key={r} opacity={fadeIn(frame, 20 + i * 20)}>
					<rect x={160} y={180 + i * 130} width={80} height={80} rx={10} fill={colors.correct} />
					<text x={200} y={238 + i * 130} textAnchor="middle" {...txt(56)}>
						!
					</text>
					<text x={280} y={240 + i * 130} {...mincho(64, colors.ink)}>
						{r}
					</text>
				</g>
			))}
			<text x={1140} y={480} textAnchor="end" {...txt(48, colors.correct)} opacity={fadeIn(frame, 70)}>
				→ 学術誌が撤回
			</text>
		</svg>
	);
};

