import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, Reveal, svgGothic, svgMincho} from './Cinema';
import {Canvas, H, rand, W} from './GenkoKit';

// 元寇判決：第2〜第10の手がかりのイラスト

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 騎馬武者のシルエット
const Rider: React.FC<{readonly x: number; readonly y: number; readonly s?: number; readonly color?: string; readonly flip?: boolean}> = ({x, y, s = 1, color = '#e9dcc0', flip}) => (
	<g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill={color}>
		<path d="M -60 0 Q -70 -40 -40 -55 L 30 -60 Q 55 -80 70 -70 L 75 -55 Q 60 -50 55 -40 L 50 0 L 40 0 L 38 -30 L -30 -30 L -40 0 L -50 0 Z" />
		<path d="M -10 -60 L -5 -105 Q 0 -120 12 -112 L 18 -70 Z" />
		<circle cx={4} cy={-125} r={13} />
		<path d="M 18 -110 L 70 -150" stroke={color} strokeWidth={5} />
	</g>
);

// 歩兵（盾と弓）
const Foot: React.FC<{readonly x: number; readonly y: number; readonly s?: number; readonly color?: string}> = ({x, y, s = 1, color = '#c9d3e3'}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
		<circle cx={0} cy={-62} r={10} />
		<path d="M -12 -50 L 12 -50 L 14 -12 L 8 0 L 3 -10 L -3 -10 L -8 0 L -14 -12 Z" />
		<rect x={-26} y={-48} width={14} height={34} rx={4} opacity={0.8} />
	</g>
);

// 一騎打ちの武士と、太鼓の合図で動く集団（よく語られる話）
export const SoloVsGroup: React.FC = () => {
	const frame = useCurrentFrame();
	const beat = Math.floor(frame / 15) % 2;
	return (
		<Canvas tone="ember">
			<Reveal at={6}>
				<Rider x={420} y={720} s={2.1} />
				<text x={420} y={830} textAnchor="middle" {...svgMincho(48, colors.goldSoft)}>
					名乗りを上げて、一騎ずつ？
				</text>
			</Reveal>
			<Reveal at={30}>
				{[...Array(15)].map((_, i) => (
					<Foot key={i} x={1180 + (i % 5) * 90 + (Math.floor(i / 5) % 2) * 45} y={560 + Math.floor(i / 5) * 90} s={1.5} />
				))}
				<circle cx={1700} cy={500} r={46 + beat * 6} fill="none" stroke="#ff8f80" strokeWidth={6} />
				<text x={1700} y={515} textAnchor="middle" {...svgGothic(36, '#ff8f80', 900)}>
					太鼓
				</text>
				<text x={1380} y={890} textAnchor="middle" {...svgMincho(48, '#c9d3e3')}>
					合図で、一斉に？
				</text>
			</Reveal>
		</Canvas>
	);
};

// てつはうの仕組み：陶器の玉、火薬、口
export const TetsuhauCut: React.FC = () => {
	const frame = useCurrentFrame();
	const flame = 0.7 + 0.3 * Math.sin(frame / 3);
	return (
		<Canvas tone="ember">
			<g transform="translate(960 560)">
				<Reveal at={6}>
					<circle r={250} fill="#8b6a4a" />
					<circle r={250} fill="none" stroke="#5a4129" strokeWidth={16} />
				</Reveal>
				<Reveal at={30}>
					<circle r={205} fill="#2a1d14" />
					{[...Array(120)].map((_, i) => (
						<circle key={i} cx={(rand(i) - 0.5) * 360} cy={(rand(i + 7) - 0.5) * 360} r={4} fill="#4b3a2a" opacity={Math.hypot(rand(i) - 0.5, rand(i + 7) - 0.5) < 0.5 ? 0.9 : 0} />
					))}
					<text x={0} y={20} textAnchor="middle" {...svgMincho(64, '#e9dcc0')}>
						火薬
					</text>
				</Reveal>
				<Reveal at={55}>
					<rect x={-26} y={-300} width={52} height={70} rx={10} fill="#5a4129" />
					<path d="M 0 -300 Q 30 -350 10 -390" stroke="#d9b47a" strokeWidth={6} fill="none" />
					<circle cx={10} cy={-392} r={16} fill="#ffb35c" opacity={flame} />
					<text x={80} y={-330} {...svgGothic(36, colors.goldSoft, 900)}>
						火をつける口
					</text>
				</Reveal>
				<Reveal at={75}>
					<text x={300} y={160} {...svgGothic(36, '#e9dcc0', 900)}>
						陶器の玉
					</text>
				</Reveal>
			</g>
		</Canvas>
	);
};

// X線CTの断面：中に鉄の破片と陶器のかけら
export const CTSlice: React.FC = () => {
	const frame = useCurrentFrame();
	const scan = interpolate(frame, [10, 90], [-260, 260], easeInOut);
	return (
		<Canvas tone="sea">
			<g transform="translate(960 560)">
				<circle r={260} fill="#0b1b2b" stroke="#7fc8ff" strokeWidth={6} />
				<circle r={215} fill="#122c46" />
				<clipPath id="ctClip">
					<rect x={-280} y={-280} width={scan + 280} height={560} />
				</clipPath>
				<g clipPath="url(#ctClip)">
					{[...Array(26)].map((_, i) => (
						<rect key={i} x={(rand(i) - 0.5) * 300} y={(rand(i + 30) - 0.5) * 300} width={18 + rand(i + 4) * 40} height={8} rx={3} fill="#eaf6ff" transform={`rotate(${rand(i + 9) * 180} ${(rand(i) - 0.5) * 300} ${(rand(i + 30) - 0.5) * 300})`} />
					))}
					{[...Array(10)].map((_, i) => (
						<path key={i} d={`M ${(rand(i + 60) - 0.5) * 280} ${(rand(i + 70) - 0.5) * 280} l 22 -8 l 10 20 l -26 6 Z`} fill="#9fc0d8" />
					))}
				</g>
				<line x1={scan} y1={-300} x2={scan} y2={300} stroke="#7fc8ff" strokeWidth={4} />
			</g>
			<Reveal at={90}>
				<text x={1380} y={420} {...svgGothic(40, '#eaf6ff', 900)}>
					細長い鉄の破片
				</text>
				<text x={1380} y={700} {...svgGothic(40, '#9fc0d8', 900)}>
					陶器のかけら
				</text>
			</Reveal>
		</Canvas>
	);
};

// 爆発すると、破片が四方に飛び散る
export const Shrapnel: React.FC = () => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [20, 60], [0, 1], easeOut);
	const flash = interpolate(frame, [18, 24, 50], [0, 1, 0], clamp);
	return (
		<Canvas tone="ink">
			<circle cx={960} cy={540} r={60 + t * 500} fill="#ffb35c" opacity={flash * 0.35} />
			{t < 0.05 ? <circle cx={960} cy={540} r={60} fill="#8b6a4a" /> : null}
			{[...Array(48)].map((_, i) => {
				const a = (i / 48) * Math.PI * 2 + rand(i) * 0.2;
				const d = t * (240 + rand(i + 3) * 380);
				return <rect key={i} x={960 + Math.cos(a) * d} y={540 + Math.sin(a) * d} width={22} height={7} rx={2} fill="#dfe6ee" transform={`rotate(${(a * 180) / Math.PI} ${960 + Math.cos(a) * d} ${540 + Math.sin(a) * d})`} opacity={1 - t * 0.3} />;
			})}
			<Reveal at={70}>
				<text x={960} y={860} textAnchor="middle" {...svgMincho(56, colors.goldSoft)}>
					音だけでなく、人を傷つける
				</text>
			</Reveal>
		</Canvas>
	);
};

// 教科書の場面の構図：騎馬の季長、てつはう、そして3人の兵士
export const ThreeSoldiers: React.FC = () => {
	const frame = useCurrentFrame();
	const glow = 0.5 + 0.5 * Math.sin(frame / 8);
	return (
		<Canvas tone="ember">
			<rect x={160} y={300} width={1600} height={560} fill="#d9c9a4" opacity={0.92} />
			<Rider x={520} y={760} s={2} color="#5a3a24" />
			<circle cx={860} cy={560} r={46} fill="#2a1d14" />
			<circle cx={860} cy={560} r={70 + 6 * Math.sin(frame / 4)} fill="#e8662b" opacity={0.5} />
			{[0, 1, 2].map((k) => (
				<Foot key={k} x={1180 + k * 150} y={760} s={2.4} color="#3b4a5e" />
			))}
			<Reveal at={40}>
				<rect x={1060} y={540} width={480} height={260} fill="none" stroke="#ff5d5d" strokeWidth={6} strokeDasharray="20 12" opacity={0.6 + 0.4 * glow} />
				<text x={1300} y={520} textAnchor="middle" {...svgMincho(50, '#ff8f80')}>
					この3人
				</text>
			</Reveal>
			<text x={520} y={900} textAnchor="middle" {...svgGothic(34, '#e9dcc0', 900)}>
				竹崎季長
			</text>
			<text x={860} y={680} textAnchor="middle" {...svgGothic(34, '#5a3a24', 900)}>
				てつはう
			</text>
		</Canvas>
	);
};

// 紙のつなぎ目：紙は上下にずれているのに、絵はずれていない
export const PaperSeam: React.FC = () => {
	const frame = useCurrentFrame();
	const shift = interpolate(frame, [20, 50], [0, 34], easeOut);
	return (
		<Canvas tone="ink">
			<rect x={300} y={300} width={660} height={480} fill="#d9c9a4" />
			<rect x={960} y={300 + shift} width={660} height={480} fill="#cfbe98" />
			<line x1={960} y1={280} x2={960} y2={820} stroke="#7a6440" strokeWidth={3} strokeDasharray="10 8" />
			{/* つなぎ目をまたぐ兵士（ずれていない） */}
			<Foot x={940} y={680} s={3.2} color="#3b4a5e" />
			<Foot x={1060} y={680} s={3.2} color="#3b4a5e" />
			<Reveal at={60}>
				<text x={630} y={250} textAnchor="middle" {...svgGothic(36, '#e9dcc0', 900)}>
					左の紙
				</text>
				<text x={1290} y={250} textAnchor="middle" {...svgGothic(36, '#e9dcc0', 900)}>
					右の紙は、下にずれている
				</text>
			</Reveal>
			<Reveal at={90}>
				<text x={960} y={900} textAnchor="middle" {...svgMincho(54, colors.goldSoft)}>
					なのに、兵士の絵は、ずれていない
				</text>
			</Reveal>
		</Canvas>
	);
};

// 夜のうちに船へ引き揚げ、翌朝には消えていた
export const NightRetreat: React.FC = () => {
	const frame = useCurrentFrame();
	const dawn = interpolate(frame, [60, 120], [0, 1], easeInOut);
	const shipsGone = interpolate(frame, [30, 100], [0, 1], easeInOut);
	return (
		<Canvas tone="night">
			<defs>
				<linearGradient id="nrDawn" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#1b2a44" />
					<stop offset="70%" stopColor="#d98c5f" />
					<stop offset="100%" stopColor="#f2c48d" />
				</linearGradient>
			</defs>
			<rect width={W} height={600} fill="url(#nrDawn)" opacity={dawn * 0.75} />
			<rect y={600} width={W} height={480} fill="#0a1626" />
			{[...Array(40)].map((_, i) => {
				const x = 120 + rand(i) * 1700;
				const y = 620 + rand(i + 3) * 300;
				return (
					<g key={i} opacity={1 - shipsGone} transform={`translate(${x - shipsGone * 600} ${y}) scale(${0.4 + rand(i + 5) * 0.5})`}>
						<path d="M -70 0 Q 0 30 80 -6 L -70 -6 Z" fill="#05070b" />
						<path d="M -10 -6 L -10 -110 L 40 -96 L 40 -20 Z" fill="#0c1018" />
					</g>
				);
			})}
			<Reveal at={100}>
				<text x={W / 2} y={400} textAnchor="middle" {...svgMincho(72, '#fbf6ea')}>
					翌朝、海には何もなかった
				</text>
			</Reveal>
		</Canvas>
	);
};

// 季節の輪：台風の多い時期と、2度の戦い
export const SeasonDial: React.FC = () => {
	const frame = useCurrentFrame();
	const cx = 960;
	const cy = 620;
	const R = 260;
	const ang = (m: number) => ((m - 1) / 12) * Math.PI * 2 - Math.PI / 2;
	const arc = (m0: number, m1: number) => {
		const a0 = ang(m0);
		const a1 = ang(m1);
		return `M ${cx + Math.cos(a0) * R} ${cy + Math.sin(a0) * R} A ${R} ${R} 0 0 1 ${cx + Math.cos(a1) * R} ${cy + Math.sin(a1) * R}`;
	};
	const hand = (m: number, c: string, at: number, label: string) => {
		const p = interpolate(frame, [at, at + 30], [0, 1], easeOut);
		const a = ang(m);
		return (
			<g opacity={p}>
				<line x1={cx} y1={cy} x2={cx + Math.cos(a) * (R - 40) * p} y2={cy + Math.sin(a) * (R - 40) * p} stroke={c} strokeWidth={8} strokeLinecap="round" />
				<text x={cx + Math.cos(a) * (R + 150)} y={cy + Math.sin(a) * (R + 60) + 14} textAnchor="middle" {...svgMincho(44, c)}>
					{label}
				</text>
			</g>
		);
	};
	return (
		<Canvas tone="night">
			<circle cx={cx} cy={cy} r={R} fill="none" stroke="#2f4058" strokeWidth={34} />
			<path d={arc(7, 10)} stroke="#4f8fc8" strokeWidth={34} fill="none" opacity={interpolate(frame, [8, 30], [0, 1], clamp)} />
			{[...Array(12)].map((_, i) => {
				const a = ang(i + 1);
				return (
					<text key={i} x={cx + Math.cos(a) * (R - 70)} y={cy + Math.sin(a) * (R - 70) + 12} textAnchor="middle" {...svgGothic(30, '#aebbd0', 900)}>
						{i + 1}月
					</text>
				);
			})}
			<text x={cx - 620} y={cy + 300} {...svgGothic(34, '#9fd0ff', 900)} opacity={interpolate(frame, [20, 40], [0, 1], clamp)}>
				台風の多い季節
			</text>
			{hand(8.7, colors.goldSoft, 40, '弘安の役')}
			{hand(11.8, '#ff8f80', 70, '文永の役')}
		</Canvas>
	);
};

// 5人の使い、海を越えて
export const EnvoyBoat: React.FC = () => {
	const frame = useCurrentFrame();
	const x = interpolate(frame, [0, 150], [300, 1300], easeInOut);
	return (
		<Canvas tone="sea">
			<rect y={640} width={W} height={440} fill="#0a2333" />
			{[...Array(6)].map((_, k) => (
				<path key={k} d={`M 0 ${660 + k * 60} Q 480 ${650 + k * 60 + Math.sin(frame / 20 + k) * 8} 960 ${660 + k * 60} T 1920 ${660 + k * 60}`} stroke="#3c6b86" strokeWidth={2} fill="none" opacity={0.5} />
			))}
			<g transform={`translate(${x} ${650 + Math.sin(frame / 14) * 6})`}>
				<path d="M -260 0 Q -200 70 0 74 Q 200 70 270 -20 L 220 -14 L -220 -14 Z" fill="#1a120a" />
				<path d="M -20 -14 L -20 -300 L 120 -270 L 120 -40 Z" fill="#2b2016" />
				{[0, 1, 2, 3, 4].map((k) => (
					<g key={k} transform={`translate(${-180 + k * 70} -20)`}>
						<circle cy={-50} r={14} fill="#e9dcc0" />
						<rect x={-14} y={-36} width={28} height={36} rx={6} fill="#e9dcc0" />
					</g>
				))}
			</g>
			<Reveal at={60}>
				<text x={W / 2} y={260} textAnchor="middle" {...svgMincho(80, colors.goldSoft)}>
					5人の使い
				</text>
			</Reveal>
		</Canvas>
	);
};

// 防塁の断面：海側は垂直、陸側はなだらかな坂
export const WallSection: React.FC = () => {
	const frame = useCurrentFrame();
	const build = interpolate(frame, [10, 70], [0, 1], easeOut);
	const s = 200; // 1m = 200px
	const baseY = 820;
	const x0 = 760;
	return (
		<Canvas tone="moss">
			<rect y={baseY} width={W} height={H - baseY} fill="#6b5a3c" />
			<rect width={x0 - 40} height={baseY} fill="#0f3448" opacity={0.6} />
			<text x={300} y={600} textAnchor="middle" {...svgMincho(50, '#9fd0e6')}>
				海側
			</text>
			<text x={1620} y={600} textAnchor="middle" {...svgMincho(50, '#d9c79f')}>
				陸側
			</text>
			<g>
				<path d={`M ${x0} ${baseY} L ${x0} ${baseY - 1.8 * s * build} L ${x0 + 1.5 * s} ${baseY - 1.8 * s * build} L ${x0 + 1.5 * s + 1.2 * s} ${baseY} Z`} fill="#8e8a80" stroke="#5b574f" strokeWidth={4} />
				{[...Array(8)].map((_, r) =>
					[...Array(3)].map((__, c) => (
						<rect key={`${r}-${c}`} x={x0 + 6 + c * 96} y={baseY - (r + 1) * 44} width={90} height={40} rx={8} fill="#a39e92" opacity={build > (r + 1) / 8 ? 0.9 : 0} />
					)),
				)}
			</g>
			<Reveal at={70}>
				<line x1={x0 - 60} y1={baseY} x2={x0 - 60} y2={baseY - 1.8 * s} stroke="#fbf6ea" strokeWidth={3} />
				<text x={x0 - 80} y={baseY - 0.9 * s} textAnchor="end" {...svgGothic(44, '#fbf6ea', 900)}>
					高さ 約1.8m
				</text>
				<line x1={x0} y1={baseY + 50} x2={x0 + 1.5 * s} y2={baseY + 50} stroke="#fbf6ea" strokeWidth={3} />
				<text x={x0 + 0.75 * s} y={baseY + 110} textAnchor="middle" {...svgGothic(40, '#fbf6ea', 900)}>
					幅 約1〜1.5m
				</text>
			</Reveal>
			<Reveal at={100}>
				<Rider x={x0 + 120} y={baseY - 1.8 * s - 4} s={0.9} color="#e9dcc0" />
				<text x={1300} y={420} {...svgGothic(36, colors.goldSoft, 900)}>
					上から矢を射る
				</text>
			</Reveal>
		</Canvas>
	);
};

// 夜の海に、小船で漕ぎ出す武士たち
export const NightRaid: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Canvas tone="night">
			<rect y={560} width={W} height={520} fill="#06111d" />
			{[...Array(8)].map((_, i) => (
				<g key={i} transform={`translate(${1250 + (i % 4) * 160} ${540 + Math.floor(i / 4) * 70}) scale(${0.9 + (i % 3) * 0.2})`}>
					<path d="M -110 0 Q 0 40 120 -10 L -110 -10 Z" fill="#020407" />
					<path d="M -10 -10 L -10 -170 L 60 -150 L 60 -30 Z" fill="#0a0e15" />
					{rand(i) > 0.4 ? <circle cx={100} cy={-20} r={5} fill="#ffb35c" /> : null}
				</g>
			))}
			{[...Array(6)].map((_, i) => {
				const x = interpolate(frame, [0, 160], [150 + i * 60, 900 + i * 50], easeInOut);
				return (
					<g key={i} transform={`translate(${x} ${720 + (i % 3) * 70 + Math.sin(frame / 10 + i) * 4})`}>
						<path d="M -50 0 Q 0 18 55 -4 L -50 -4 Z" fill="#1a120a" />
						{[0, 1, 2].map((k) => (
							<circle key={k} cx={-25 + k * 25} cy={-18} r={8} fill="#c9a26a" />
						))}
						<line x1={-40} y1={-6} x2={-70} y2={20} stroke="#c9a26a" strokeWidth={3} />
					</g>
				);
			})}
			<Reveal at={60}>
				<text x={W / 2} y={400} textAnchor="middle" {...svgMincho(70, colors.goldSoft)}>
					夜の海から、攻めかかる
				</text>
			</Reveal>
		</Canvas>
	);
};

// 台風：渦が鷹島の船団を飲み込む
export const TyphoonStrike: React.FC = () => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [0, 120], [0, 1], easeInOut);
	return (
		<Canvas tone="night">
			<g transform={`translate(${1400 - t * 440} 520) rotate(${-frame * 2})`} opacity={0.9}>
				{[...Array(5)].map((_, k) => (
					<path key={k} d="M 0 0 Q 160 -260 520 -120" stroke="#cfe6ff" strokeWidth={36 - k * 4} fill="none" opacity={0.15 + k * 0.05} transform={`rotate(${k * 72})`} />
				))}
				<circle r={40} fill="#0b1626" />
			</g>
			{[...Array(70)].map((_, i) => {
				const x = 600 + rand(i) * 800;
				const y = 460 + rand(i + 4) * 200;
				const hit = t > 0.6 ? (t - 0.6) / 0.4 : 0;
				return <path key={i} d="M -16 0 L 18 0 L 10 7 L -10 7 Z" fill="#ffd48a" transform={`translate(${x + Math.sin(i + frame / 6) * 30 * hit} ${y + hit * rand(i + 8) * 200}) rotate(${hit * (rand(i) - 0.5) * 140})`} opacity={1 - hit * 0.7} />;
			})}
			{[...Array(80)].map((_, i) => (
				<line key={i} x1={(rand(i) * W + frame * 24) % W} y1={(rand(i + 2) * H + frame * 40) % H} x2={(rand(i) * W + frame * 24) % W - 20} y2={(rand(i + 2) * H + frame * 40) % H + 50} stroke="#9fc2ff" strokeWidth={2} opacity={0.35} />
			))}
			<Reveal at={90}>
				<text x={W / 2} y={900} textAnchor="middle" {...svgMincho(60, '#fbf6ea')}>
					閏7月1日、鷹島の海
				</text>
			</Reveal>
		</Canvas>
	);
};
