import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, svgGothic, svgMincho} from './Cinema';
import {Canvas} from './IzumoKit';

// 伊勢判決：図解

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fade = (f: number, at: number, len = 16) => interpolate(f, [at, at + len], [0, 1], clamp);

// 神明鳥居（シルエット）
const Torii: React.FC<{readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly color?: string}> = ({x, y, w, h, color = '#0d0a08'}) => (
	<g fill={color}>
		<rect x={x - w / 2 - w * 0.08} y={y - h} width={w * 1.16} height={h * 0.07} rx={4} />
		<rect x={x - w / 2} y={y - h * 0.8} width={w} height={h * 0.05} />
		<rect x={x - w / 2 + w * 0.08} y={y - h * 0.95} width={w * 0.06} height={h * 0.95} />
		<rect x={x + w / 2 - w * 0.14} y={y - h * 0.95} width={w * 0.06} height={h * 0.95} />
	</g>
);

// 第1の手がかり：冬至の朝。山の向こうから、鳥居の真ん中へ朝日が昇る
export const SolsticeSun: React.FC = () => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [20, 140], [0, 1], easeInOut);
	const sunY = 760 - t * 300;
	const sky = t;
	return (
		<Canvas tone="night">
			<rect width={1920} height={1080} fill={`rgba(240,140,70,${0.45 * sky})`} />
			<circle cx={960} cy={sunY} r={70} fill="#ffd36b" opacity={0.95} />
			<circle cx={960} cy={sunY} r={150} fill="#ffd36b" opacity={0.18} />
			{/* 島路山 */}
			<path d="M 0 700 Q 400 560 760 600 Q 960 520 1180 600 Q 1500 650 1920 620 L 1920 1080 L 0 1080 Z" fill="#141018" />
			{/* 宇治橋と大鳥居 */}
			<rect x={300} y={900} width={1320} height={26} fill="#0d0a08" />
			<Torii x={960} y={900} w={560} h={430} />
			<g opacity={fade(frame, 10)}>
				<text x={160} y={380} {...svgGothic(34, '#c9d3e3', 900)}>
					5時50分
				</text>
				<text x={160} y={430} {...svgGothic(28, '#8ea2bd', 700)}>
					冬至の瞬間
				</text>
			</g>
			<g opacity={fade(frame, 50)}>
				<text x={160} y={510} {...svgGothic(34, '#efe6d2', 900)}>
					7時前
				</text>
				<text x={160} y={560} {...svgGothic(28, '#8ea2bd', 700)}>
					伊勢の日の出
				</text>
			</g>
			<g opacity={fade(frame, 110)}>
				<text x={1560} y={460} {...svgMincho(56, '#ffe2a8')}>
					7時半ごろ
				</text>
				<text x={1560} y={510} {...svgGothic(28, '#ffe2a8', 700)}>
					山の向こうから
				</text>
			</g>
		</Canvas>
	);
};

// 第1の手がかり：正殿の柱が、鳥居になり、さらに別の鳥居になる
export const ToriiRecycle: React.FC = () => {
	const frame = useCurrentFrame();
	const steps = [
		{t: '正殿の柱', s: '20年、神殿の\n屋根を支える', at: 6},
		{t: '宇治橋の大鳥居', s: '次の20年、\n参拝者を迎える', at: 40},
		{t: '桑名・関の鳥居', s: '七里の渡しと\n関の追分へ', at: 74},
	];
	return (
		<Canvas tone="ink">
			{steps.map((s, i) => {
				const x = 360 + i * 600;
				return (
					<g key={s.t} opacity={fade(frame, s.at)}>
						{i === 0 ? (
							<g>
								<path d={`M ${x - 160} 600 L ${x} 420 L ${x + 160} 600 Z`} fill="#4a3a28" />
								<rect x={x - 12} y={420} width={24} height={300} fill="#c9a06a" />
								<rect x={x - 150} y={600} width={300} height={120} fill="#3a2c1e" />
							</g>
						) : (
							<Torii x={x} y={720} w={260} h={300} color={i === 1 ? '#c9a06a' : '#9a8060'} />
						)}
						<text x={x} y={800} textAnchor="middle" {...svgMincho(46, colors.goldSoft)}>
							{s.t}
						</text>
						{s.s.split('\n').map((ln, k) => (
							<text key={k} x={x} y={860 + k * 44} textAnchor="middle" {...svgGothic(30, '#efe6d2', 900)}>
								{ln}
							</text>
						))}
						{i < 2 ? <path d={`M ${x + 190} 580 L ${x + 410} 580`} stroke={colors.gold} strokeWidth={6} opacity={fade(frame, s.at + 20)} /> : null}
						{i < 2 ? <path d={`M ${x + 410} 580 l -24 -14 l 0 28 Z`} fill={colors.gold} opacity={fade(frame, s.at + 20)} /> : null}
					</g>
				);
			})}
		</Canvas>
	);
};

// 第4の手がかり：鏡を納める器（御樋代）と、それを納める器（御船代）。器の内側の大きさと、平原遺跡の大鏡
export const MirrorVessel: React.FC = () => {
	const frame = useCurrentFrame();
	const s = 7; // 1cm = 7ピクセル
	return (
		<Canvas tone="ember">
			{/* 御船代（船の形の器） */}
			<g opacity={fade(frame, 6)}>
				<path d="M 220 760 Q 600 860 980 760 L 940 470 Q 600 430 260 470 Z" fill="#3a2414" stroke="#c9a06a" strokeWidth={4} />
				<text x={600} y={420} textAnchor="middle" {...svgMincho(44, colors.goldSoft)}>
					御船代（船の形の器）
				</text>
			</g>
			{/* 御樋代 */}
			<g opacity={fade(frame, 36)}>
				<circle cx={600} cy={620} r={(49 / 2) * s + 18} fill="#5a3a20" stroke="#e6c88a" strokeWidth={4} />
				<circle cx={600} cy={620} r={(49 / 2) * s} fill="#1a0f08" stroke="#e6c88a" strokeWidth={2} strokeDasharray="8 6" />
				<text x={600} y={630} textAnchor="middle" {...svgGothic(34, '#e6c88a', 900)}>
					御樋代
				</text>
			</g>
			<g opacity={fade(frame, 66)}>
				<line x1={600 - (49 / 2) * s} y1={860} x2={600 + (49 / 2) * s} y2={860} stroke="#ffcf7a" strokeWidth={4} />
				<text x={600} y={910} textAnchor="middle" {...svgGothic(32, '#ffe2a8', 900)}>
					器の内側 約49cm（延喜式など）
				</text>
			</g>
			{/* 平原遺跡の大鏡 */}
			<g opacity={fade(frame, 96)}>
				<circle cx={1440} cy={620} r={(46.5 / 2) * s} fill="#6f7d70" stroke="#c9d6c4" strokeWidth={4} />
				{Array.from({length: 8}, (_, i) => {
					const a = (i / 8) * Math.PI * 2;
					return <path key={i} d={`M ${1440 + Math.cos(a) * 60} ${620 + Math.sin(a) * 60} A 70 70 0 0 1 ${1440 + Math.cos(a + Math.PI / 4) * 60} ${620 + Math.sin(a + Math.PI / 4) * 60}`} stroke="#c9d6c4" strokeWidth={3} fill="none" />;
				})}
				<circle cx={1440} cy={620} r={22} fill="#c9d6c4" />
				<text x={1440} y={420} textAnchor="middle" {...svgMincho(44, '#cfe8dc')}>
					平原遺跡の大鏡
				</text>
				<text x={1440} y={910} textAnchor="middle" {...svgGothic(32, '#cfe8dc', 900)}>
					直径46.5cm
				</text>
			</g>
			<text x={960} y={980} textAnchor="middle" {...svgGothic(26, '#8ea2bd', 700)} opacity={fade(frame, 110)}>
				大きさは同じ縮尺。器の形はイメージ
			</text>
		</Canvas>
	);
};

// 第5の手がかり：「伝聞の伝聞」をたどる
export const RumorChain: React.FC = () => {
	const frame = useCurrentFrame();
	const nodes = [
		{t: '都市伝説', s: '鏡の裏に\nヘブライ文字', at: 6},
		{t: '1948年の随筆', s: 'ある牧師が\n雑誌に書いた', at: 30},
		{t: 'ある博士', s: '文字を\n読み解いたという', at: 54},
		{t: '鏡を見た人', s: '記録は\nひとつもない', at: 78, bad: true},
	];
	return (
		<Canvas tone="night">
			{nodes.map((n, i) => {
				const x = 260 + i * 466;
				return (
					<g key={n.t} opacity={fade(frame, n.at)}>
						<rect x={x - 200} y={400} width={400} height={300} rx={18} fill={n.bad ? '#3a1210' : '#0f1a2c'} stroke={n.bad ? '#ff8f80' : colors.gold} strokeWidth={4} strokeDasharray={n.bad ? '14 10' : undefined} />
						<text x={x} y={480} textAnchor="middle" {...svgMincho(44, n.bad ? '#ffd0c8' : colors.goldSoft)}>
							{n.t}
						</text>
						{n.s.split('\n').map((ln, k) => (
							<text key={k} x={x} y={570 + k * 52} textAnchor="middle" {...svgGothic(36, '#efe6d2', 900)}>
								{ln}
							</text>
						))}
						{i < 3 ? <path d={`M ${x + 210} 550 L ${x + 256} 550`} stroke={colors.gold} strokeWidth={6} /> : null}
					</g>
				);
			})}
			<text x={960} y={820} textAnchor="middle" {...svgMincho(48, '#ffe2a8')} opacity={fade(frame, 110)}>
				たどっても、鏡を見た人に行き着かない
			</text>
		</Canvas>
	);
};
