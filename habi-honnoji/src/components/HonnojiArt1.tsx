import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {Timeline} from './Kit';
import {BaseMap, clamp, ease, fadeIn, mincho, Person, Pin, places, RouteLine, txt} from './Maps';

// 寺（本能寺）の簡単な形
const Temple: React.FC<{readonly x: number; readonly y: number; readonly s?: number; readonly fire?: number}> = ({x, y, s = 1, fire = 0}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M-150 -60 L0 -130 L150 -60 Z" fill="#3b2a1e" />
		<rect x={-120} y={-60} width={240} height={110} fill="#6b4a32" />
		<rect x={-30} y={-10} width={60} height={60} fill="#2a1a10" />
		{fire > 0
			? [...Array(7)].map((_, i) => (
					<path key={i} d={`M${-120 + i * 40} 50 q 20 ${-80 - (i % 3) * 30} 40 0 Z`} fill={i % 2 ? '#f0a830' : '#e94b3c'} opacity={fire} />
				))
			: null}
	</g>
);

// ---- 冒頭 ----

// 本能寺を取り囲む1万を超える軍勢
export const TroopsSurround: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.floor(interpolate(frame, [0, 70], [0, 160], clamp));
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#0b1222" />
			<Temple x={650} y={330} s={1.1} />
			{[...Array(n)].map((_, i) => {
				const a = (i / 160) * Math.PI * 2 * 3;
				const r = 260 + (i % 4) * 40;
				return <circle key={i} cx={650 + Math.cos(a) * r * 1.6} cy={320 + Math.sin(a) * r * 0.75} r={7} fill={colors.correct} opacity={0.9} />;
			})}
			<text x={650} y={600} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				1万を超える軍勢
			</text>
		</svg>
	);
};

// 兵士の頭の中：「家康を討つ？」
export const SoldierThought: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#141a2b" />
			{[...Array(9)].map((_, i) => (
				<Person key={i} x={150 + i * 120} y={560} s={1.1} color="#3a4156" />
			))}
			<Person x={630} y={560} s={1.3} color="#cfc4ad" />
			<g opacity={fadeIn(frame, 15)}>
				<circle cx={600} cy={420} r={10} fill="#f4ecdc" />
				<circle cx={580} cy={380} r={16} fill="#f4ecdc" />
				<ellipse cx={560} cy={230} rx={330} ry={130} fill="#f4ecdc" />
				<text x={560} y={210} textAnchor="middle" {...txt(44, colors.ink)}>
					討ちに行く相手は……
				</text>
				<text x={560} y={290} textAnchor="middle" {...mincho(84, colors.wrong)}>
					徳川家康？
				</text>
			</g>
		</svg>
	);
};

// ---- 第1の手がかり ----

// 天下統一まであと一歩：信長の勢力
export const TenkaMap: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<BaseMap>
			<ellipse cx={1150} cy={440} rx={240 * fadeIn(frame, 0, 40)} ry={140 * fadeIn(frame, 0, 40)} fill={colors.correct} opacity={0.35} />
			<Pin at={places.azuchi} label="安土（信長）" color={colors.correct} show={fadeIn(frame, 10)} dx={60} dy={-34} />
			<Pin at={places.takamatsu} label="秀吉 vs 毛利" color={colors.gold} show={fadeIn(frame, 40)} dx={-40} dy={60} />
			<Pin at={places.kyoto} label="本能寺" color="#fff" show={fadeIn(frame, 70)} dx={-20} dy={70} />
		</BaseMap>
	);
};

// 亀山城を出た軍勢が、西ではなく東の京都へ
export const MarchTurn: React.FC = () => {
	const frame = useCurrentFrame();
	const west = interpolate(frame, [10, 50], [0, 1], ease);
	const east = interpolate(frame, [60, 120], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#2d3b26" />
			<path d="M520 0 C 560 200 540 400 600 620" stroke="#3d7bb0" strokeWidth={26} fill="none" />
			<text x={610} y={120} {...txt(32, '#cfe0f0')}>
				桂川
			</text>
			<Pin at={[260, 330]} label="亀山城" color={colors.gold} dy={70} />
			<Pin at={[1050, 300]} label="京都・本能寺" color={colors.correct} pulse show={fadeIn(frame, 60)} />
			<RouteLine d="M260 330 L60 330" p={west} color="#ffffff88" width={10} />
			<text x={70} y={290} {...txt(34, '#fff')} opacity={west}>
				← 中国地方へ？
			</text>
			<RouteLine d="M260 330 C 450 330 650 320 1050 300" p={east} color={colors.correct} width={12} />
		</svg>
	);
};

// 事件と、「敵は本能寺にあり」が書かれた時代
export const QuoteTimeline: React.FC = () => (
	<Timeline
		from={1560}
		to={1720}
		ticks={[
			{at: 1582, label: '1582年'},
			{at: 1650, label: '1650年'},
			{at: 1700, label: '1700年'},
		]}
		bars={[
			{start: 1582, end: 1583, label: '本能寺の変', color: colors.correct, row: 0, at: 0},
			{start: 1688, end: 1704, label: '「敵は本能寺にあり」が登場', color: colors.gold, row: 1.6, at: 30},
		]}
	/>
);

// 兵士の覚え書き：「家康さまを討つと思っていた」
export const MemoirScroll: React.FC = () => {
	const frame = useCurrentFrame();
	const lines = ['自分たちは', '家康さまを', '討つのだと', 'ばかり', '思っていた'];
	return (
		<svg width={1200} height={600} viewBox="0 0 1200 600">
			<rect x={150} y={30} width={900} height={540} rx={12} fill="#efe2c4" />
			{lines.map((l, i) => (
				<text key={l} x={900 - i * 150} y={90} {...mincho(56, '#2b2116')} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, i * 12, 12)}>
					{l}
				</text>
			))}
			<rect x={862} y={70} width={80} height={330} fill="none" stroke={colors.correct} strokeWidth={6} opacity={fadeIn(frame, 70)} />
			<text x={600} y={550} textAnchor="middle" {...txt(36, colors.clayDark)} opacity={fadeIn(frame, 70)}>
				本城惣右衛門の覚え書き（意訳）
			</text>
		</svg>
	);
};

// 開いた門、誰もいない境内
export const EmptyGate: React.FC = () => {
	const frame = useCurrentFrame();
	const open = interpolate(frame, [0, 40], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#0b1222" />
			<rect x={300} y={160} width={700} height={420} fill="#1d2433" />
			<path d="M260 160 L650 60 L1040 160 Z" fill="#3b2a1e" />
			<rect x={420} y={200} width={460} height={380} fill="#2a3346" />
			<rect x={420} y={200} width={230 * (1 - open)} height={380} fill="#6b4a32" stroke="#3b2214" strokeWidth={4} />
			<rect x={880 - 230 * (1 - open)} y={200} width={230 * (1 - open)} height={380} fill="#6b4a32" stroke="#3b2214" strokeWidth={4} />
			<text x={650} y={420} textAnchor="middle" {...mincho(60, '#ffffff55')} opacity={fadeIn(frame, 40)}>
				人の姿は……
			</text>
		</svg>
	);
};

// 炎に包まれる本能寺
export const TempleFire: React.FC = () => {
	const frame = useCurrentFrame();
	const fire = interpolate(frame, [20, 70], [0, 1], clamp);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill={fire > 0.5 ? '#2a0f08' : '#0b1222'} />
			<Temple x={650} y={380} s={1.8} fire={fire} />
			{[...Array(18)].map((_, i) => (
				<circle key={i} cx={(i * 137 + frame * 3) % 1300} cy={500 - ((frame * 4 + i * 53) % 480)} r={4} fill="#f0a830" opacity={fire * 0.8} />
			))}
		</svg>
	);
};

// ---- 第2の手がかり ----

// 腐った魚の話は、どの記録に出てくる？
export const TwoRecords: React.FC = () => {
	const frame = useCurrentFrame();
	const book = (x: number, title: string, era: string, has: boolean, at: number) => (
		<g opacity={fadeIn(frame, at)}>
			<rect x={x} y={60} width={460} height={380} rx={16} fill="#efe2c4" />
			<text x={x + 230} y={150} textAnchor="middle" {...mincho(56, colors.ink)}>
				{title}
			</text>
			<text x={x + 230} y={210} textAnchor="middle" {...txt(32, colors.clayDark)}>
				{era}
			</text>
			<text x={x + 230} y={360} textAnchor="middle" {...txt(48, has ? colors.correct : colors.wrong)} opacity={fadeIn(frame, at + 30)}>
				{has ? '腐った魚の話：ある' : '腐った魚の話：ない'}
			</text>
		</g>
	);
	return (
		<svg width={1200} height={500} viewBox="0 0 1200 500">
			{book(70, '秀吉の伝記', '江戸時代の初め', true, 0)}
			{book(670, '信長公記', '信長の家臣が記録', false, 20)}
		</svg>
	);
};

// 光秀の前半生は空白
export const UnknownYears: React.FC = () => (
	<Timeline
		from={1520}
		to={1590}
		ticks={[
			{at: 1530, label: '1530年'},
			{at: 1568, label: '1568年'},
			{at: 1582, label: '1582年'},
		]}
		bars={[
			{start: 1528, end: 1566, label: '若いころの記録は、ほとんどない', color: '#3a4156', row: 0.4, at: 0},
			{start: 1566, end: 1582, label: '義昭・信長に仕える', color: colors.gold, row: 1.6, at: 30},
		]}
	/>
);

// 愛宕百韻の発句
export const PoemCard: React.FC = () => {
	const frame = useCurrentFrame();
	const hl = fadeIn(frame, 50, 15);
	return (
		<svg width={1200} height={600} viewBox="0 0 1200 600">
			<rect x={380} y={20} width={440} height={560} rx={12} fill="#f6efdc" stroke="#c9b48a" strokeWidth={6} />
			{['ときは今', 'あめが下しる', '五月かな'].map((l, i) => (
				<text key={l} x={720 - i * 120} y={80} {...mincho(64, '#2b2116')} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, i * 15, 15)}>
					{l}
				</text>
			))}
			<rect x={680} y={65} width={84} height={150} fill="none" stroke={colors.correct} strokeWidth={6} opacity={hl} />
			<text x={260} y={150} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={hl}>
				とき ＝ 土岐氏？
			</text>
			<rect x={560} y={65} width={84} height={300} fill="none" stroke={colors.correct} strokeWidth={6} opacity={fadeIn(frame, 75, 15)} />
			<text x={960} y={250} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 75, 15)}>
				天下を治める？
			</text>
		</svg>
	);
};

// 家中軍法：変のちょうど1年前
export const MilitaryCode: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			{[
				['天正9年6月2日', '光秀が軍の決まりごとを書く', colors.gold, 0],
				['天正10年6月2日', '本能寺の変', colors.correct, 30],
			].map(([d, t, c, at], i) => (
				<g key={String(d)} opacity={fadeIn(frame, Number(at))}>
					<rect x={120 + i * 560} y={120} width={500} height={250} rx={20} fill="#f4ecdc" />
					<rect x={120 + i * 560} y={120} width={500} height={80} rx={20} fill={String(c)} />
					<text x={370 + i * 560} y={176} textAnchor="middle" {...txt(44)}>
						{d}
					</text>
					<text x={370 + i * 560} y={300} textAnchor="middle" {...mincho(42, colors.ink)}>
						{t}
					</text>
				</g>
			))}
			<text x={650} y={470} textAnchor="middle" {...txt(48, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				ちょうど1年
			</text>
		</svg>
	);
};

// フロイスの記録：信長が光秀を足でけった
export const FroisNote: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1200} height={560} viewBox="0 0 1200 560">
			<rect x={250} y={40} width={700} height={480} rx={14} fill="#efe6d2" />
			{[...Array(8)].map((_, i) => (
				<path key={i} d={`M300 ${110 + i * 46} q 150 -8 300 0 t 300 0`} stroke="#8a7a62" strokeWidth={4} fill="none" opacity={0.6} />
			))}
			<g opacity={fadeIn(frame, 20)}>
				<rect x={290} y={300} width={620} height={90} rx={10} fill="rgba(233,75,60,0.15)" stroke={colors.correct} strokeWidth={5} />
				<text x={600} y={358} textAnchor="middle" {...txt(40, colors.correct)}>
					信長が、光秀を足でけった
				</text>
			</g>
			<text x={600} y={500} textAnchor="middle" {...txt(32, colors.clayDark)}>
				宣教師ルイス・フロイスの記録
			</text>
		</svg>
	);
};

