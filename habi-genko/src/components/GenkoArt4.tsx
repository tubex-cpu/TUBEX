import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, Reveal, svgGothic, svgMincho} from './Cinema';
import {Canvas, H, rand, W} from './GenkoKit';

// 元寇判決：第11の手がかり以降のイラスト

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 中国の船の横顔（竜骨と帆）
const Junk: React.FC<{readonly x: number; readonly y: number; readonly s?: number; readonly fill?: string; readonly sail?: string}> = ({x, y, s = 1, fill = '#1a120a', sail = '#2b2016'}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M -150 -18 Q -130 30 -20 34 Q 110 32 160 -30 L 120 -22 L -110 -22 Z" fill={fill} />
		<path d="M -60 -22 L -60 -200 L 10 -186 L 10 -40 Z" fill={sail} />
		<path d="M 30 -22 L 30 -250 L 110 -232 L 110 -40 Z" fill={sail} />
	</g>
);

// 嵐のあと：じょうぶな船だけが去っていく
export const Escape: React.FC = () => {
	const frame = useCurrentFrame();
	const x = interpolate(frame, [20, 150], [900, 1700], easeInOut);
	return (
		<Canvas tone="sea">
			<rect y={600} width={W} height={480} fill="#081a26" />
			{[...Array(14)].map((_, i) => (
				<g key={i} transform={`translate(${120 + i * 55} ${640 + (i % 3) * 60}) rotate(${(rand(i) - 0.5) * 50})`} opacity={0.7}>
					<path d="M -60 0 Q 0 20 60 -6 L -60 -6 Z" fill="#05090d" />
					<line x1={0} y1={-6} x2={(rand(i + 2) - 0.5) * 80} y2={-80} stroke="#05090d" strokeWidth={6} />
				</g>
			))}
			<Junk x={x} y={640} s={1.1} />
			<Reveal at={60}>
				<text x={1300} y={420} textAnchor="middle" {...svgMincho(60, colors.goldSoft)}>
					総大将は、船で
				</text>
				<text x={500} y={900} textAnchor="middle" {...svgMincho(48, '#c9d3e3')}>
					取り残された兵士たち
				</text>
			</Reveal>
		</Canvas>
	);
};

// 1号船の発見：水深23〜25m、泥の下1mの竜骨
export const Wreck1: React.FC = () => {
	const frame = useCurrentFrame();
	const k = interpolate(frame, [30, 90], [0, 1], easeOut);
	return (
		<Canvas tone="sea">
			<rect y={260} width={W} height={420} fill="#0f3448" opacity={0.5} />
			<rect y={680} width={W} height={400} fill="#3b3328" />
			<line x1={200} y1={260} x2={1720} y2={260} stroke="#9fd2ea" strokeWidth={3} />
			<text x={200} y={240} {...svgGothic(32, '#9fd2ea', 900)}>
				海面
			</text>
			<g transform="translate(260 260)">
				<line x1={0} y1={0} x2={0} y2={420} stroke="#e9e3cf" strokeWidth={3} />
				<text x={20} y={220} {...svgGothic(36, '#e9e3cf', 900)}>
					水深 約23〜25m
				</text>
			</g>
			<line x1={560} y1={790} x2={560 + 1000 * k} y2={790} stroke="#e0a75c" strokeWidth={18} strokeLinecap="round" />
			{[...Array(14)].map((_, i) => (
				<path key={i} d={`M ${600 + i * 70} 790 q -6 -50 0 -80`} stroke="#e0a75c" strokeWidth={8} fill="none" opacity={k > i / 14 ? 0.9 : 0} />
			))}
			<Reveal at={90}>
				<text x={1060} y={880} textAnchor="middle" {...svgGothic(40, '#ffd48a', 900)}>
					竜骨　幅約50cm・見つかった長さ約12m
				</text>
				<text x={1060} y={940} textAnchor="middle" {...svgGothic(34, '#e9dcc0', 700)}>
					推定の全長 約27m
				</text>
			</Reveal>
		</Canvas>
	);
};

// 鷹島のまわりで見つかった3隻（位置はおおよその模式図）
export const TakashimaWrecks: React.FC = () => {
	const frame = useCurrentFrame();
	const pins = [
		{x: 760, y: 760, t: '1号船（2011年）'},
		{x: 1080, y: 820, t: '2号船（2015年）'},
		{x: 1330, y: 700, t: '3号船（2023年）'},
	];
	return (
		<Canvas tone="sea">
			<path d="M 520 360 Q 760 230 1080 300 Q 1420 340 1460 520 Q 1480 640 1240 650 Q 1000 700 760 640 Q 520 600 500 480 Z" fill="#2f4a2c" stroke="#7fa35b" strokeWidth={4} />
			<text x={980} y={480} textAnchor="middle" {...svgMincho(70, '#e9e3cf')}>
				鷹島
			</text>
			{pins.map((p, i) => (
				<g key={i} opacity={interpolate(frame, [20 + i * 25, 35 + i * 25], [0, 1], clamp)}>
					<circle cx={p.x} cy={p.y} r={16} fill={colors.gold} />
					<circle cx={p.x} cy={p.y} r={34 + 8 * Math.sin(frame / 10 + i)} fill="none" stroke={colors.gold} strokeWidth={3} />
					<text x={p.x} y={p.y + 70} textAnchor="middle" {...svgGothic(34, colors.goldSoft, 900)}>
						{p.t}
					</text>
				</g>
			))}
			<text x={960} y={1000} textAnchor="middle" {...svgGothic(28, '#7f9ab0', 700)}>
				位置はおおよその模式図
			</text>
		</Canvas>
	);
};

// 濁った海：見通せるのは、よい日でも5mほど
export const MurkyDive: React.FC = () => {
	const frame = useCurrentFrame();
	const fog = interpolate(frame, [0, 90], [0, 0.75], easeOut);
	return (
		<Canvas tone="sea">
			<g transform={`translate(${760 + Math.sin(frame / 30) * 20} 540)`}>
				<ellipse cx={0} cy={0} rx={140} ry={44} fill="#0b0f14" />
				<circle cx={150} cy={-10} r={34} fill="#0b0f14" />
				<rect x={-80} y={-70} width={120} height={36} rx={14} fill="#4a5662" />
				<path d="M -140 0 L -260 -30 L -260 30 Z" fill="#0b0f14" />
				<circle cx={190} cy={-14} r={10} fill="#ffe7a8" />
			</g>
			<path d={`M 960 526 L 1700 300 L 1700 760 Z`} fill="#ffe7a8" opacity={0.12} />
			<rect width={W} height={H} fill="#24413f" opacity={fog} />
			{[...Array(160)].map((_, i) => (
				<circle key={i} cx={(rand(i) * W + frame * (0.3 + rand(i + 1))) % W} cy={rand(i + 5) * H} r={1 + rand(i + 2) * 3} fill="#c8d9c4" opacity={0.2 + rand(i + 3) * 0.3} />
			))}
			<Reveal at={60}>
				<text x={W / 2} y={880} textAnchor="middle" {...svgMincho(60, '#fbf6ea')}>
					見通せるのは、よい日でも5mほど
				</text>
			</Reveal>
		</Canvas>
	);
};

// 音波で海の底を探る：海底の地図と、泥の中の断面
export const SonarScan: React.FC = () => {
	const frame = useCurrentFrame();
	const x = interpolate(frame, [0, 150], [200, 1720], easeInOut);
	return (
		<Canvas tone="sea">
			<rect y={600} width={W} height={480} fill="#3b3328" />
			<g transform={`translate(${x} 260)`}>
				<path d="M -90 0 Q 0 30 100 -6 L -90 -6 Z" fill="#e9e3cf" />
				<path d="M 0 0 L -200 340 L 200 340 Z" fill="#7fe0c8" opacity={0.12} />
				{[0, 1, 2].map((k) => {
					const r = ((frame / 30 + k / 3) % 1) * 360;
					return <path key={k} d={`M ${-r * 0.55} ${r} Q 0 ${r + 30} ${r * 0.55} ${r}`} stroke="#7fe0c8" strokeWidth={4} fill="none" opacity={1 - ((frame / 30 + k / 3) % 1)} />;
				})}
			</g>
			{/* なぞった跡に浮かぶ、泥の中の形 */}
			<clipPath id="snClip">
				<rect x={0} y={600} width={x} height={480} />
			</clipPath>
			<g clipPath="url(#snClip)">
				{[...Array(30)].map((_, i) => (
					<line key={i} x1={0} y1={640 + i * 14} x2={W} y2={640 + i * 14 + Math.sin(i) * 6} stroke="#7a6a52" strokeWidth={2} opacity={0.6} />
				))}
				<path d="M 1100 760 Q 1300 800 1500 760" stroke="#7fe0c8" strokeWidth={12} fill="none" />
			</g>
			<Reveal at={110}>
				<text x={1300} y={880} textAnchor="middle" {...svgGothic(40, '#7fe0c8', 900)}>
					泥の下に、何かある
				</text>
			</Reveal>
		</Canvas>
	);
};

// 金属に反応する磁気の探査
export const Magnetometer: React.FC = () => {
	const frame = useCurrentFrame();
	const pts = [...Array(80)].map((_, i) => {
		const x = 200 + i * 19;
		const peak = Math.exp(-Math.pow((x - 1150) / 90, 2)) * 260 * interpolate(frame, [20, 80], [0, 1], easeOut);
		return `${x},${600 - peak - Math.sin(i * 1.7) * 6}`;
	});
	return (
		<Canvas tone="night">
			<line x1={200} y1={600} x2={1720} y2={600} stroke="#33445e" strokeWidth={3} />
			<polyline points={pts.join(' ')} fill="none" stroke="#ffd48a" strokeWidth={5} />
			<Reveal at={80}>
				<text x={1150} y={280} textAnchor="middle" {...svgMincho(54, colors.goldSoft)}>
					鉄に反応
				</text>
				<text x={W / 2} y={760} textAnchor="middle" {...svgGothic(36, '#c9d3e3', 900)}>
					武器や、船の鉄の釘があれば
				</text>
			</Reveal>
		</Canvas>
	);
};

// 潜水士が、ポンプで泥を少しずつ吸い取る
export const DiverDredge: React.FC = () => {
	const frame = useCurrentFrame();
	const dug = interpolate(frame, [0, 150], [0, 1], easeInOut);
	return (
		<Canvas tone="sea">
			<rect y={640} width={W} height={440} fill="#3b3328" />
			<path d={`M 700 640 Q 960 ${640 + 120 * dug} 1220 640 Z`} fill="#0f3448" />
			<path d="M 760 720 Q 960 770 1160 720" stroke="#e0a75c" strokeWidth={12} fill="none" opacity={dug} />
			<line x1={100} y1={280} x2={1820} y2={300} stroke="#e9e3cf" strokeWidth={3} strokeDasharray="14 10" />
			<text x={120} y={260} {...svgGothic(30, '#e9e3cf', 900)}>
				ガイドのロープ
			</text>
			<g transform="translate(980 520)">
				<ellipse rx={110} ry={34} fill="#0b0f14" />
				<circle cx={-120} cy={-6} r={28} fill="#0b0f14" />
				<path d="M -150 20 Q -200 120 -60 150" stroke="#9fb0c8" strokeWidth={14} fill="none" />
			</g>
			{[...Array(30)].map((_, i) => (
				<circle key={i} cx={920 + (rand(i) - 0.5) * 120} cy={680 - ((frame * 2 + i * 13) % 200)} r={3} fill="#a08a6a" opacity={0.6} />
			))}
		</Canvas>
	);
};

// たくさんの写真を組み合わせて、立体の姿を記録する
export const PhotoMosaic: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Canvas tone="ink">
			{[...Array(48)].map((_, i) => {
				const c = i % 8;
				const r = Math.floor(i / 8);
				const at = i * 2;
				const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
				return <rect key={i} x={420 + c * 135} y={240 + r * 100} width={125} height={90} fill="#3b4a5e" stroke="#9fb0c8" strokeWidth={2} opacity={o * 0.8} />;
			})}
			<Reveal at={110}>
				<path d="M 560 760 Q 960 840 1360 760" stroke="#ffd48a" strokeWidth={14} fill="none" />
				<text x={W / 2} y={860} textAnchor="middle" {...svgMincho(54, colors.goldSoft)}>
					およそ3000枚の写真から、3次元の姿を
				</text>
			</Reveal>
		</Canvas>
	);
};

// ケーブルでつないだ、小型の無人潜水機
export const TetheredROV: React.FC = () => {
	const frame = useCurrentFrame();
	const y = 560 + Math.sin(frame / 20) * 20;
	return (
		<Canvas tone="sea">
			<path d={`M 960 0 Q 900 300 ${980} ${y - 60}`} stroke="#ffd48a" strokeWidth={5} fill="none" />
			<g transform={`translate(980 ${y})`}>
				<rect x={-140} y={-60} width={280} height={120} rx={20} fill="#e9a23b" />
				<circle cx={140} cy={0} r={34} fill="#0b1626" stroke="#9fd2ea" strokeWidth={6} />
				<path d="M 170 0 L 600 -160 L 600 160 Z" fill="#ffe7a8" opacity={0.12} />
				<rect x={-180} y={-30} width={40} height={60} rx={8} fill="#5a6470" />
			</g>
			<rect y={820} width={W} height={260} fill="#3b3328" />
		</Canvas>
	);
};

// 船の断面：V字の船底と、船の中を仕切る板の壁（江南の船の特徴）
export const HullSection: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Canvas tone="ember">
			<Reveal at={6}>
				<path d="M 600 340 L 1320 340 L 1200 560 Q 960 700 720 560 Z" fill="#6f4f2c" stroke="#e0a75c" strokeWidth={6} />
				<text x={1420} y={460} textAnchor="start" {...svgMincho(50, colors.goldSoft)}>
					V字の船底
				</text>
			</Reveal>
			<Reveal at={50}>
				<g transform="translate(0 0)">
					<rect x={360} y={740} width={1200} height={80} rx={30} fill="#6f4f2c" stroke="#e0a75c" strokeWidth={4} />
					{[...Array(7)].map((_, i) => (
						<rect key={i} x={480 + i * 150} y={740} width={12} height={80} fill="#e0a75c" />
					))}
					<text x={960} y={880} textAnchor="middle" {...svgGothic(36, '#e9dcc0', 900)}>
						板の壁で、いくつもの部屋に仕切る
					</text>
				</g>
			</Reveal>
			<Reveal at={90}>
				<text x={960} y={480} textAnchor="middle" {...svgMincho(56, '#fbf6ea')} opacity={interpolate(frame, [90, 110], [0, 1], clamp)}>
					中国・江南の船
				</text>
			</Reveal>
		</Canvas>
	);
};

// 船底の二重の補強
export const DoublePlank: React.FC = () => (
	<Canvas tone="ember">
		<Reveal at={6}>
			{[0, 1].map((k) => (
				<g key={k}>
					{[...Array(10)].map((_, i) => (
						<rect key={i} x={380 + i * 118} y={440 + k * 110} width={110} height={90} rx={6} fill={k ? '#8a6436' : '#6f4f2c'} stroke="#e0a75c" strokeWidth={3} />
					))}
				</g>
			))}
		</Reveal>
		<Reveal at={40}>
			<text x={960} y={400} textAnchor="middle" {...svgMincho(56, colors.goldSoft)}>
				船の底を、二重に
			</text>
			<text x={960} y={760} textAnchor="middle" {...svgGothic(38, '#e9dcc0', 900)}>
				ていねいに組まれていた
			</text>
		</Reveal>
	</Canvas>
);

// 竜骨のつなぎ目：底に切り込みを入れ、補強の材をはめ込む
export const KeelJoint: React.FC = () => {
	const frame = useCurrentFrame();
	const slide = interpolate(frame, [40, 90], [-160, 0], easeOut);
	return (
		<Canvas tone="ember">
			<rect x={260} y={460} width={700} height={130} fill="#7a5530" stroke="#e0a75c" strokeWidth={4} />
			<rect x={960} y={460} width={700} height={130} fill="#6f4f2c" stroke="#e0a75c" strokeWidth={4} />
			<rect x={860} y={560} width={200} height={30} fill="#0b0805" />
			<rect x={860} y={590 - 30 + Math.max(0, -slide) * 0 + (slide < 0 ? -slide * 0.6 : 0)} width={200} height={30} fill="#d9b47a" stroke="#fbf6ea" strokeWidth={3} transform={`translate(0 ${-Math.min(0, slide) * 0.6})`} />
			<Reveal at={10}>
				<text x={960} y={400} textAnchor="middle" {...svgMincho(52, colors.goldSoft)}>
					竜骨と竜骨のつなぎ目
				</text>
			</Reveal>
			<Reveal at={90}>
				<text x={960} y={720} textAnchor="middle" {...svgGothic(38, '#e9dcc0', 900)}>
					底に切り込み → 補強の材をはめ込む
				</text>
			</Reveal>
		</Canvas>
	);
};

// 糖をしみ込ませて、木の形を保つ
export const SugarSoak: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Canvas tone="sea">
			<rect x={360} y={420} width={1200} height={420} rx={20} fill="#1c4a62" opacity={0.6} stroke="#9fd2ea" strokeWidth={4} />
			<rect x={520} y={560} width={880} height={110} rx={20} fill="#6f4f2c" />
			{[...Array(40)].map((_, i) => {
				const x = 400 + rand(i) * 1120;
				const y = 440 + ((rand(i + 3) * 380 + frame * 1.2) % 380);
				return <rect key={i} x={x} y={y} width={12} height={12} rx={3} fill="#f6efe0" opacity={0.6} transform={`rotate(45 ${x} ${y})`} />;
			})}
			<Reveal at={40}>
				<text x={960} y={360} textAnchor="middle" {...svgMincho(52, colors.goldSoft)}>
					トレハロース（糖の一種）にひたす
				</text>
			</Reveal>
		</Canvas>
	);
};

// 狭い湾に集まった船どうしが、ぶつかり合う
export const CrowdedBay: React.FC = () => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [20, 120], [0, 1], easeInOut);
	return (
		<Canvas tone="night">
			<path d="M 0 0 L 520 0 Q 420 400 600 1080 L 0 1080 Z" fill="#1b2a1f" />
			<path d="M 1920 0 L 1400 0 Q 1520 500 1340 1080 L 1920 1080 Z" fill="#1b2a1f" />
			{[...Array(36)].map((_, i) => {
				const x = 620 + (i % 6) * 120 + Math.sin(i + frame / 5) * 30 * t;
				const y = 220 + Math.floor(i / 6) * 130 + Math.cos(i + frame / 6) * 20 * t;
				return (
					<g key={i} transform={`translate(${x} ${y}) rotate(${(rand(i) - 0.5) * 70 * t})`}>
						<path d="M -46 0 Q 0 16 50 -4 L -46 -4 Z" fill="#ffd48a" opacity={0.85} />
					</g>
				);
			})}
		</Canvas>
	);
};

// 木の板の実物大：縦12cm・横25cm・厚さ1cm弱、上に穴が2つ
export const BoardActual: React.FC = () => {
	const s = 30; // 1cm = 30px
	const x0 = 960 - 12.6 * s;
	const y0 = 330;
	return (
		<Canvas tone="ink">
			<Reveal at={6}>
				<rect x={x0} y={y0} width={25.2 * s} height={12 * s} rx={8} fill="#7a5a36" />
				{[...Array(10)].map((_, i) => (
					<path key={i} d={`M ${x0} ${y0 + 20 + i * 34} Q ${960} ${y0 + 12 + i * 34} ${x0 + 25.2 * s} ${y0 + 24 + i * 34}`} stroke="#5a4126" strokeWidth={2} fill="none" />
				))}
				<circle cx={x0 + 7 * s} cy={y0 + 1.6 * s} r={12} fill="#120c06" />
				<circle cx={x0 + 18 * s} cy={y0 + 1.6 * s} r={12} fill="#120c06" />
			</Reveal>
			<Reveal at={40}>
				<line x1={x0} y1={y0 + 12 * s + 40} x2={x0 + 25.2 * s} y2={y0 + 12 * s + 40} stroke="#fbf6ea" strokeWidth={3} />
				<text x={960} y={y0 + 12 * s + 100} textAnchor="middle" {...svgGothic(40, '#fbf6ea', 900)}>
					横 25.2cm
				</text>
				<line x1={x0 - 40} y1={y0} x2={x0 - 40} y2={y0 + 12 * s} stroke="#fbf6ea" strokeWidth={3} />
				<text x={x0 - 60} y={y0 + 6 * s} textAnchor="end" {...svgGothic(40, '#fbf6ea', 900)}>
					縦12cm
				</text>
			</Reveal>
			<Reveal at={80}>
				<text x={x0 + 12.6 * s} y={y0 - 30} textAnchor="middle" {...svgGothic(34, colors.goldSoft, 900)}>
					釘を打ったとみられる穴が2つ
				</text>
			</Reveal>
		</Canvas>
	);
};

// 船の泥をすくい、細かくふるい分ける
export const SieveMud: React.FC = () => {
	const frame = useCurrentFrame();
	const found = interpolate(frame, [80, 100], [0, 1], clamp);
	return (
		<Canvas tone="ember">
			<ellipse cx={960} cy={560} rx={420} ry={140} fill="#2a2016" stroke="#a08a6a" strokeWidth={8} />
			{[...Array(18)].map((_, i) => (
				<line key={i} x1={560 + i * 46} y1={460} x2={560 + i * 46} y2={660} stroke="#5a4a36" strokeWidth={2} />
			))}
			{[...Array(80)].map((_, i) => (
				<circle key={i} cx={620 + rand(i) * 680} cy={500 + rand(i + 4) * 120 + ((frame * (1 + rand(i))) % 60)} r={3 + rand(i + 2) * 5} fill="#6b5a42" opacity={0.7} />
			))}
			<g opacity={found}>
				<rect x={930} y={540} width={60} height={18} rx={6} fill="#141414" />
				<rect x={982} y={540} width={14} height={18} rx={4} fill="#a32b20" />
				<circle cx={960} cy={549} r={70} fill="none" stroke={colors.gold} strokeWidth={4} />
			</g>
			<Reveal at={100}>
				<text x={960} y={820} textAnchor="middle" {...svgMincho(56, colors.goldSoft)}>
					長さ3cmほどの、竹のかけら
				</text>
			</Reveal>
		</Canvas>
	);
};

// 南宋の武器が、元の手に渡り、日本との戦いへ
export const ArmsFlow: React.FC = () => {
	const frame = useCurrentFrame();
	const steps = [
		{x: 420, t: '南宋', s: '武器を改良'},
		{x: 960, t: '元', s: '南宋を滅ぼし\n武器を取り上げる'},
		{x: 1500, t: '日本の海', s: '鷹島の沈没船'},
	];
	return (
		<Canvas tone="ember">
			{steps.map((st, i) => (
				<Reveal key={i} at={10 + i * 35}>
					<circle cx={st.x} cy={520} r={130} fill={i === 2 ? '#0f3448' : '#3a2412'} stroke={colors.gold} strokeWidth={4} />
					<text x={st.x} y={540} textAnchor="middle" {...svgMincho(62, colors.goldSoft)}>
						{st.t}
					</text>
					{st.s.split('\n').map((ln, k) => (
						<text key={k} x={st.x} y={720 + k * 48} textAnchor="middle" {...svgGothic(36, '#e9dcc0', 900)}>
							{ln}
						</text>
					))}
				</Reveal>
			))}
			{[0, 1].map((k) => (
				<path key={k} d={`M ${560 + k * 540} 520 L ${820 + k * 540} 520`} stroke={colors.gold} strokeWidth={6} pathLength={1} strokeDasharray={`${interpolate(frame, [40 + k * 35, 70 + k * 35], [0, 1], clamp)} 1`} markerEnd="" />
			))}
			<text x={960} y={920} textAnchor="middle" {...svgGothic(30, '#a08a6a', 700)}>
				矢の形から考えた推定
			</text>
		</Canvas>
	);
};

// 3号船：船尾を含む後ろ半分15m、全長およそ30m
export const SternHalf: React.FC = () => {
	const frame = useCurrentFrame();
	const s = 46;
	const x0 = 960 - 15 * s;
	const p = interpolate(frame, [50, 110], [0, 1], easeOut);
	return (
		<Canvas tone="sea">
			<path d={`M ${x0} 520 Q ${x0 + 30 * s * 0.1} 640 ${960} 650 Q ${x0 + 30 * s * 0.9} 640 ${x0 + 30 * s} 500 Z`} fill="none" stroke="#9fd2ea" strokeWidth={4} strokeDasharray="16 10" opacity={p} />
			<path d={`M ${960} 650 Q ${x0 + 30 * s * 0.9} 640 ${x0 + 30 * s} 500 L ${960} 520 Z`} fill="#c9934e" stroke="#ffd48a" strokeWidth={4} />
			<text x={1300} y={460} textAnchor="middle" {...svgGothic(40, colors.goldSoft, 900)}>
				見つかった後ろ半分 約15m
			</text>
			<Reveal at={100}>
				<text x={960} y={780} textAnchor="middle" {...svgMincho(56, '#fbf6ea')}>
					全長 およそ30m（推定）
				</text>
				<text x={960} y={850} textAnchor="middle" {...svgGothic(36, '#9fd2ea', 900)}>
					多くの船を率いる母船の可能性も
				</text>
			</Reveal>
		</Canvas>
	);
};

// サイコロ1cm、札3×1.5cm：ものさしと並べて
export const TinyPieces: React.FC = () => {
	const s = 60; // 1cm = 60px
	return (
		<Canvas tone="ember">
			<rect x={360} y={720} width={1200} height={70} fill="#d9c9a4" />
			{[...Array(21)].map((_, i) => (
				<line key={i} x1={360 + i * s} y1={720} x2={360 + i * s} y2={i % 5 === 0 ? 770 : 750} stroke="#3a2a18" strokeWidth={3} />
			))}
			<text x={1580} y={770} {...svgGothic(30, '#d9c9a4', 900)}>
				cm
			</text>
			<Reveal at={10}>
				{[0, 1, 2, 3, 4].map((k) => (
					<rect key={k} x={420 + k * 90} y={640} width={s} height={s} rx={8} fill="#e9dcc0" stroke="#6b5636" strokeWidth={3} />
				))}
				<text x={600} y={600} textAnchor="middle" {...svgGothic(36, colors.goldSoft, 900)}>
					約1cm四方
				</text>
			</Reveal>
			<Reveal at={50}>
				{[0, 1, 2, 3].map((k) => (
					<rect key={k} x={1000 + k * 110} y={520} width={1.5 * s} height={3 * s} rx={6} fill="#d8c7a2" stroke="#6b5636" strokeWidth={3} />
				))}
				<text x={1220} y={480} textAnchor="middle" {...svgGothic(36, colors.goldSoft, 900)}>
					縦3cm・横1.5cmほど
				</text>
			</Reveal>
			<Reveal at={90}>
				<text x={960} y={400} textAnchor="middle" {...svgMincho(56, '#fbf6ea')}>
					骨牌（こっぱい）と骰子（さいころ）
				</text>
			</Reveal>
		</Canvas>
	);
};

// 船の台所：器、包丁、そして札
export const Galley: React.FC = () => {
	const frame = useCurrentFrame();
	const flick = 0.75 + 0.25 * Math.sin(frame / 4);
	return (
		<Canvas tone="ember">
			<rect x={300} y={640} width={1320} height={40} fill="#5a3a24" />
			<circle cx={960} cy={300} r={260} fill="#ffb35c" opacity={0.08 * flick} />
			<path d="M 940 260 L 980 260 L 975 330 L 945 330 Z" fill="#c98b5a" />
			<circle cx={960} cy={240} r={14} fill="#ffb35c" opacity={flick} />
			<Reveal at={10}>
				<path d="M 420 640 Q 420 540 520 540 Q 620 540 620 640 Z" fill="#7a5a42" />
				<text x={520} y={740} textAnchor="middle" {...svgGothic(32, '#e9dcc0', 900)}>
					陶器
				</text>
			</Reveal>
			<Reveal at={35}>
				<path d="M 760 630 L 960 610 L 965 630 Z" fill="#9fb0c8" />
				<rect x={700} y={622} width={70} height={16} rx={4} fill="#5a3a24" />
				<text x={840} y={740} textAnchor="middle" {...svgGothic(32, '#e9dcc0', 900)}>
					包丁とみられる鉄の道具
				</text>
			</Reveal>
			<Reveal at={60}>
				{[0, 1, 2, 3, 4].map((k) => (
					<rect key={k} x={1180 + k * 50} y={600 - (k % 2) * 6} width={36} height={40} rx={4} fill="#d8c7a2" transform={`rotate(${(k - 2) * 8} ${1200 + k * 50} 620)`} />
				))}
				<text x={1300} y={740} textAnchor="middle" {...svgGothic(32, '#e9dcc0', 900)}>
					札
				</text>
			</Reveal>
		</Canvas>
	);
};

// 灯りの下で札を囲む兵士たち
export const LanternGame: React.FC = () => {
	const frame = useCurrentFrame();
	const flick = 0.8 + 0.2 * Math.sin(frame / 3 + Math.sin(frame / 7));
	return (
		<Canvas tone="ink">
			<circle cx={960} cy={420} r={420} fill="#ffb35c" opacity={0.12 * flick} />
			<circle cx={960} cy={300} r={22} fill="#ffcf7a" opacity={flick} />
			<rect x={760} y={600} width={400} height={30} rx={10} fill="#3a2414" />
			{[-1, 1].map((side) =>
				[0, 1].map((k) => (
					<g key={`${side}${k}`} transform={`translate(${960 + side * (330 + k * 140)} 640)`} fill="#0a0806">
						<circle cy={-170} r={42} />
						<path d="M -70 0 Q -60 -130 0 -130 Q 60 -130 70 0 Z" />
					</g>
				)),
			)}
			{[0, 1, 2].map((k) => (
				<rect key={k} x={900 + k * 40} y={570} width={28} height={36} rx={4} fill="#e9dcc0" />
			))}
			<Reveal at={60}>
				<text x={960} y={860} textAnchor="middle" {...svgMincho(54, colors.goldSoft)}>
					戦いの前の夜、故郷の話をしていたのかもしれない
				</text>
			</Reveal>
		</Canvas>
	);
};

// 守りの戦いでは、分け与える土地がない
export const NoNewLand: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Canvas tone="moss">
			<Reveal at={6}>
				<rect x={260} y={360} width={600} height={360} fill="#4a5a2c" stroke="#c9d3a0" strokeWidth={4} />
				<text x={560} y={560} textAnchor="middle" {...svgMincho(52, '#f0ead6')}>
					敵の土地を奪う
				</text>
				<text x={560} y={800} textAnchor="middle" {...svgGothic(36, '#c9d3a0', 900)}>
					ふつうの戦い → ほうびの土地
				</text>
			</Reveal>
			<Reveal at={45}>
				<rect x={1060} y={360} width={600} height={360} fill="#0f3448" stroke="#9fd2ea" strokeWidth={4} />
				<text x={1360} y={560} textAnchor="middle" {...svgMincho(52, '#f0ead6')}>
					追い払っただけ
				</text>
				<text x={1360} y={800} textAnchor="middle" {...svgGothic(36, '#ff9b8f', 900)}>
					元寇 → 分ける土地がない
				</text>
				<line x1={1100} y1={400} x2={1620} y2={680} stroke="#ff5d5d" strokeWidth={8} opacity={interpolate(frame, [80, 95], [0, 0.8], clamp)} />
			</Reveal>
		</Canvas>
	);
};

// 泥から出すと、フナクイムシに食べられる。銅の網で守る
export const CopperNet: React.FC = () => {
	const frame = useCurrentFrame();
	const net = interpolate(frame, [60, 110], [0, 1], easeOut);
	return (
		<Canvas tone="sea">
			<rect y={700} width={W} height={380} fill="#3b3328" />
			<rect x={560} y={600} width={800} height={110} rx={20} fill="#6f4f2c" />
			{[...Array(22)].map((_, i) => (
				<circle key={i} cx={600 + rand(i) * 720} cy={620 + rand(i + 5) * 70} r={6} fill="#1a120a" opacity={interpolate(frame, [i * 2, i * 2 + 10], [0, 0.9], clamp) * (1 - net)} />
			))}
			<g opacity={net}>
				{[...Array(20)].map((_, i) => (
					<line key={`a${i}`} x1={540 + i * 44} y1={580} x2={540 + i * 44 - 60} y2={730} stroke="#d9874a" strokeWidth={3} />
				))}
				{[...Array(20)].map((_, i) => (
					<line key={`b${i}`} x1={480 + i * 44} y1={580} x2={480 + i * 44 + 60} y2={730} stroke="#d9874a" strokeWidth={3} />
				))}
			</g>
			<Reveal at={10}>
				<text x={960} y={420} textAnchor="middle" {...svgMincho(52, '#fbf6ea')}>
					木を食べる貝、フナクイムシ
				</text>
			</Reveal>
			<Reveal at={100}>
				<text x={960} y={900} textAnchor="middle" {...svgGothic(40, colors.goldSoft, 900)}>
					銅の網をかぶせて、海の底で守る
				</text>
			</Reveal>
		</Canvas>
	);
};

// 3つの国の研究者が、同じ海の底へ
export const ThreeNations: React.FC = () => {
	const frame = useCurrentFrame();
	const items = [
		{x: 420, y: 360, t: 'モンゴル'},
		{x: 1500, y: 360, t: '韓国'},
		{x: 960, y: 820, t: '日本'},
	];
	return (
		<Canvas tone="night">
			{items.map((it, i) => (
				<g key={i}>
					<line x1={it.x} y1={it.y} x2={960} y2={560} stroke={colors.gold} strokeWidth={4} pathLength={1} strokeDasharray={`${interpolate(frame, [20 + i * 15, 60 + i * 15], [0, 1], clamp)} 1`} />
					<Reveal at={i * 15}>
						<circle cx={it.x} cy={it.y} r={80} fill="#10233a" stroke={colors.gold} strokeWidth={3} />
						<text x={it.x} y={it.y + 16} textAnchor="middle" {...svgMincho(44, colors.goldSoft)}>
							{it.t}
						</text>
					</Reveal>
				</g>
			))}
			<Reveal at={80}>
				<circle cx={960} cy={560} r={70} fill="#0f3448" stroke="#9fd2ea" strokeWidth={4} />
				<text x={960} y={576} textAnchor="middle" {...svgMincho(40, '#e9f6ff')}>
					鷹島
				</text>
			</Reveal>
		</Canvas>
	);
};

// まとめ：19の判決を並べる
export const VerdictBoard: React.FC<{readonly rows: readonly {q: string; v: 'right' | 'half' | 'wrong'}[]; readonly startAt: readonly number[]}> = ({rows, startAt}) => {
	const frame = useCurrentFrame();
	const col = (v: string) => (v === 'right' ? colors.correct : v === 'half' ? colors.half : colors.wrong);
	const word = (v: string) => (v === 'right' ? '正しい' : v === 'half' ? '半分正しい' : 'まちがい');
	const half = Math.ceil(rows.length / 2);
	return (
		<Canvas tone="night">
			{rows.map((r, i) => {
				const c = i < half ? 0 : 1;
				const k = i < half ? i : i - half;
				const x = 90 + c * 900;
				const y = 110 + k * 76;
				const lit = frame >= startAt[i];
				return (
					<g key={i} opacity={lit ? 1 : 0.35}>
						<text x={x} y={y + 44} {...svgGothic(30, '#9fb0c8', 900)}>
							{i + 1}
						</text>
						<text x={x + 56} y={y + 46} {...svgGothic(36, '#f6eedb', 900)}>
							{r.q}
						</text>
						{lit ? (
							<g>
								<rect x={x + 580} y={y + 4} width={210} height={56} rx={10} fill={col(r.v)} />
								<text x={x + 685} y={y + 44} textAnchor="middle" {...svgGothic(30, '#fff', 900)}>
									{word(r.v)}
								</text>
							</g>
						) : null}
					</g>
				);
			})}
		</Canvas>
	);
};
