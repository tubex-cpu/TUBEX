import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, Reveal, svgGothic, svgMincho} from './Cinema';
import {Bell, Sword} from './IzumoArt1';
import {Canvas, rand} from './IzumoKit';

// 出雲判決：第8〜第14の手がかりの図解

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BRONZE = '#5f8f7c';

// 銅矛1本（縦向き。x,y は下の端）
const Hoko: React.FC<{readonly x: number; readonly y: number; readonly h: number}> = ({x, y, h}) => (
	<g transform={`translate(${x} ${y})`}>
		<rect x={-h * 0.03} y={-h * 0.35} width={h * 0.06} height={h * 0.35} fill={BRONZE} />
		<path d={`M ${-h * 0.07} ${-h * 0.35} L 0 ${-h} L ${h * 0.07} ${-h * 0.35} Z`} fill={BRONZE} />
	</g>
);

// 第8の手がかり：銅剣の穴と、7m離れた銅鐸・銅矛の穴
export const PitLayout: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Canvas tone="moss">
			<Reveal at={6}>
				<rect x={180} y={360} width={760} height={460} rx={24} fill="#2c2116" stroke="#6b5434" strokeWidth={5} />
				{[...Array(4)].map((_, r) => (
					<g key={r}>
						{[...Array(30)].map((_, i) => (
							<line key={i} x1={230 + i * 22} y1={410 + r * 100} x2={230 + i * 22} y2={480 + r * 100} stroke={BRONZE} strokeWidth={6} />
						))}
					</g>
				))}
				<text x={560} y={880} textAnchor="middle" {...svgMincho(52, colors.goldSoft)}>
					銅剣 358本
				</text>
			</Reveal>
			<g opacity={interpolate(frame, [30, 50], [0, 1], clamp)}>
				<line x1={960} y1={590} x2={1220} y2={590} stroke="#fff3d6" strokeWidth={5} strokeDasharray="16 10" />
				<text x={1090} y={560} textAnchor="middle" {...svgMincho(60, '#fff3d6')}>
					約7m
				</text>
			</g>
			<Reveal at={55}>
				<rect x={1240} y={420} width={520} height={340} rx={24} fill="#2c2116" stroke="#6b5434" strokeWidth={5} />
				{[...Array(6)].map((_, i) => (
					<Bell key={i} x={1310 + (i % 3) * 90} y={i < 3 ? 560 : 680} h={100} />
				))}
				{[...Array(16)].map((_, i) => (
					<Hoko key={i} x={1580 + (i % 8) * 20} y={i < 8 ? 580 : 720} h={130} />
				))}
				<text x={1500} y={830} textAnchor="middle" {...svgMincho(48, colors.goldSoft)}>
					銅鐸6個・銅矛16本
				</text>
			</Reveal>
		</Canvas>
	);
};

// 第9の手がかり：入れ子の銅鐸（横に倒し、ひれを上下に立てて、大きな銅鐸の中に小さな銅鐸）
export const NestBells: React.FC = () => {
	const frame = useCurrentFrame();
	const slide = interpolate(frame, [30, 100], [0, 1], easeInOut);
	return (
		<Canvas tone="bronze">
			<line x1={300} y1={760} x2={1620} y2={760} stroke="#3c5a4e" strokeWidth={6} />
			<g transform="translate(1100 600) rotate(-90)">
				<Bell x={0} y={0} h={420} opacity={0.55} />
				<g transform={`translate(0 ${-110 - 700 * (1 - slide)})`}>
					<Bell x={0} y={0} h={260} color="#8fc2aa" />
				</g>
			</g>
			<g opacity={interpolate(frame, [100, 120], [0, 1], clamp)}>
				<text x={960} y={870} textAnchor="middle" {...svgMincho(52, colors.goldSoft)}>
					横に倒して、大きな銅鐸の中に小さな銅鐸
				</text>
			</g>
		</Canvas>
	);
};

// 第10の手がかり：39個の銅鐸のうち、14個にバツの印
export const MarkGrid: React.FC = () => {
	const frame = useCurrentFrame();
	const marked = new Set([1, 4, 6, 9, 12, 15, 17, 20, 23, 26, 29, 31, 34, 37]);
	return (
		<Canvas tone="bronze">
			{[...Array(39)].map((_, i) => {
				const col = i % 13;
				const row = Math.floor(i / 13);
				const x = 190 + col * 128;
				const y = 470 + row * 160;
				const lit = marked.has(i) && frame > 60 + [...marked].indexOf(i) * 5;
				return (
					<g key={i} opacity={interpolate(frame, [4 + i, 14 + i], [0, 1], clamp)}>
						<Bell x={x} y={y} h={120} mark={lit} opacity={lit ? 1 : 0.55} />
					</g>
				);
			})}
			<g opacity={interpolate(frame, [140, 160], [0, 1], clamp)}>
				<text x={960} y={880} textAnchor="middle" {...svgMincho(70, '#ffcf7a')}>
					39個のうち、14個
				</text>
			</g>
		</Canvas>
	);
};

// 第10の手がかり：淡路の松帆銅鐸を間にはさんだつながり
export const LinkChain: React.FC = () => {
	const frame = useCurrentFrame();
	const nodes = [
		{x: 380, label: '荒神谷', sub: '銅剣・銅鐸・銅矛'},
		{x: 960, label: '松帆銅鐸', sub: '淡路島・2015年'},
		{x: 1540, label: '加茂岩倉', sub: '銅鐸39個'},
	];
	return (
		<Canvas tone="night">
			{nodes.map((n, i) => (
				<Reveal key={n.label} at={8 + i * 24}>
					<circle cx={n.x} cy={600} r={150} fill="#13233a" stroke={i === 1 ? '#ffcf7a' : colors.gold} strokeWidth={6} />
					<text x={n.x} y={610} textAnchor="middle" {...svgMincho(54, '#fbf6ea')}>
						{n.label}
					</text>
					<text x={n.x} y={820} textAnchor="middle" {...svgGothic(34, '#c9d3e3', 900)}>
						{n.sub}
					</text>
				</Reveal>
			))}
			{[0, 1].map((i) => {
				const p = interpolate(frame, [70 + i * 25, 100 + i * 25], [0, 1], easeOut);
				return <line key={i} x1={530 + i * 580} y1={600} x2={530 + i * 580 + 280 * p} y2={600} stroke="#ffcf7a" strokeWidth={8} strokeDasharray="22 14" />;
			})}
			<text x={1250} y={540} textAnchor="middle" {...svgGothic(32, '#ffcf7a', 900)} opacity={interpolate(frame, [100, 115], [0, 1], clamp)}>
				同じ鋳型
			</text>
		</Canvas>
	);
};

// 第11の手がかり：出雲では早く終わった青銅器の祭り、近畿では大きくなり続けた銅鐸
export const BellGrowth: React.FC = () => {
	const frame = useCurrentFrame();
	const sizes = [130, 170, 230, 310, 400];
	return (
		<Canvas tone="ink">
			<text x={140} y={430} {...svgMincho(52, '#9fd6c0')}>
				出雲
			</text>
			<text x={140} y={800} {...svgMincho(52, colors.goldSoft)}>
				近畿
			</text>
			{sizes.map((h, i) => {
				const at = 10 + i * 18;
				const x = 520 + i * 300;
				const izumo = i < 3;
				return (
					<g key={i} opacity={interpolate(frame, [at, at + 14], [0, 1], clamp)}>
						{izumo ? <Bell x={x} y={480} h={Math.min(h, 200)} /> : <text x={x} y={430} textAnchor="middle" {...svgMincho(56, '#56708a')}>…</text>}
						<Bell x={x} y={880} h={h * 0.95} color="#8a7a4a" />
					</g>
				);
			})}
			<g opacity={interpolate(frame, [110, 130], [0, 1], clamp)}>
				<line x1={1280} y1={300} x2={1280} y2={520} stroke="#ff8f80" strokeWidth={5} strokeDasharray="14 10" />
				<text x={1300} y={340} {...svgGothic(34, '#ff8f80', 900)}>
					早く終わった
				</text>
			</g>
		</Canvas>
	);
};

// 第12の手がかり：四隅突出型墳丘墓（斜めから見た姿）
export const YosumiTomb: React.FC = () => {
	const frame = useCurrentFrame();
	const rise = interpolate(frame, [10, 70], [0, 1], easeOut);
	// 等角投影
	const iso = (x: number, y: number, z = 0): [number, number] => [960 + (x - y) * 11, 640 + (x + y) * 5.6 - z * 9 * rise];
	const pt = (x: number, y: number, z = 0) => iso(x, y, z).join(' ');
	const top = [
		[-20, -15],
		[-26, -21],
		[-14, -15],
		[14, -15],
		[26, -21],
		[20, -15],
		[20, 15],
		[26, 21],
		[14, 15],
		[-14, 15],
		[-26, 21],
		[-20, 15],
	];
	return (
		<Canvas tone="moss">
			<path d={`M ${top.map(([x, y]) => pt(x * 1.25, y * 1.25, 0)).join(' L ')} Z`} fill="#2d3a24" opacity={0.7} />
			<path d={`M ${top.map(([x, y]) => pt(x, y, 4)).join(' L ')} Z`} fill="#8b8a72" stroke="#c9c6a8" strokeWidth={3} />
			<path d={`M ${pt(-17, -12, 4.2)} L ${pt(17, -12, 4.2)} L ${pt(17, 12, 4.2)} L ${pt(-17, 12, 4.2)} Z`} fill="#6b7a4a" />
			<g opacity={interpolate(frame, [60, 80], [0, 1], clamp)}>
				<text x={960} y={360} textAnchor="middle" {...svgMincho(58, colors.goldSoft)}>
					四隅が、ヒトデの足のように
				</text>
				<text x={500} y={860} {...svgGothic(40, '#efe6d2', 900)}>
					{'四角い部分　40m × 30m'}
				</text>
				<text x={1080} y={860} {...svgGothic(40, '#ffcf7a', 900)}>
					{'足まで含めると　50m超'}
				</text>
			</g>
		</Canvas>
	);
};

// 第12の手がかり：墓の中の断面（木の棺と木の部屋、赤い朱、4本の柱）
export const TombSection: React.FC = () => {
	return (
		<Canvas tone="ember">
			<path d="M 160 720 L 500 450 L 1420 450 L 1760 720 Z" fill="#5a4630" />
			<path d="M 160 720 L 1760 720 L 1760 1080 L 160 1080 Z" fill="#3e2f20" />
			<Reveal at={10}>
				<rect x={700} y={500} width={520} height={200} fill="#6b4a2e" stroke="#a07a4a" strokeWidth={6} />
				<text x={960} y={490} textAnchor="middle" {...svgGothic(32, '#efe6d2', 900)}>
					木の部屋
				</text>
			</Reveal>
			<Reveal at={30}>
				<rect x={760} y={560} width={400} height={100} fill="#8a6440" />
				<rect x={780} y={575} width={360} height={70} fill="#c0392b" opacity={0.9} />
				<text x={960} y={625} textAnchor="middle" {...svgGothic(34, '#fff', 900)}>
					棺と、赤い水銀朱
				</text>
			</Reveal>
			<Reveal at={55}>
				{[[860, 0], [920, 1], [1000, 2], [1060, 3]].map(([x, k]) => (
					<circle key={k} cx={x} cy={610} r={9} fill={k % 2 ? '#7fd0ff' : '#9be3a8'} />
				))}
				<text x={1300} y={800} {...svgGothic(32, '#cfe8ff', 900)}>
					ガラスの勾玉・管玉、鉄の剣
				</text>
			</Reveal>
			<Reveal at={80}>
				{[740, 860, 1060, 1180].map((x) => (
					<rect key={x} x={x - 18} y={240} width={36} height={210} fill="#a07a4a" />
				))}
				<text x={960} y={330} textAnchor="middle" {...svgMincho(46, colors.goldSoft)}>
					埋めたあと、4本の柱
				</text>
			</Reveal>
		</Canvas>
	);
};

// 第13の手がかり：葬式の土器の、およそ3分の1がよその土地のもの
export const PotteryShare: React.FC = () => {
	const frame = useCurrentFrame();
	const n = 30;
	return (
		<Canvas tone="ember">
			{[...Array(n)].map((_, i) => {
				const col = i % 10;
				const row = Math.floor(i / 10);
				const x = 330 + col * 140;
				const y = 470 + row * 140;
				const out = i % 3 === 0;
				const lit = frame > 70;
				const color = !lit || !out ? '#9a7a56' : i % 2 ? '#d98a4a' : '#7fb0d0';
				return (
					<g key={i} opacity={interpolate(frame, [4 + i * 1.5, 14 + i * 1.5], [0, 1], clamp)} transform={`translate(${x} ${y})`}>
						<path d="M -30 0 Q -50 -50 -20 -80 L -16 -100 L 16 -100 L 20 -80 Q 50 -50 30 0 Z" fill={color} />
					</g>
				);
			})}
			<g opacity={interpolate(frame, [80, 100], [0, 1], clamp)}>
				<rect x={560} y={790} width={800} height={90} rx={14} fill="rgba(3,6,14,0.8)" />
				<text x={760} y={850} textAnchor="middle" {...svgMincho(46, '#ffb07a')}>
					吉備の土器
				</text>
				<text x={1160} y={850} textAnchor="middle" {...svgMincho(46, '#9fd0ee')}>
					北陸の土器
				</text>
			</g>
		</Canvas>
	);
};

// 第13の手がかり：花仙山のめのうと、勾玉づくり
export const MagatamaMaking: React.FC = () => {
	const frame = useCurrentFrame();
	const steps = ['石を割る', '形を整える', '穴をあける', '磨く'];
	return (
		<Canvas tone="moss">
			{steps.map((s, i) => {
				const x = 330 + i * 420;
				const at = 8 + i * 22;
				const shape =
					i === 0 ? (
						<path d="M -70 30 L -40 -60 L 50 -50 L 80 40 L 0 70 Z" fill="#c0563a" />
					) : (
						<g>
							<path d="M 30 -60 A 60 60 0 1 0 50 40 Q 0 30 0 -10 Q 0 -50 30 -60 Z" fill={i === 3 ? '#e2683a' : '#b04a30'} />
							{i >= 2 ? <circle cx={20} cy={-30} r={12} fill="#1b2a1f" /> : null}
							{i === 3 ? <path d="M -40 -30 Q -50 0 -30 30" stroke="#fff" strokeWidth={6} opacity={0.5} fill="none" /> : null}
						</g>
					);
				return (
					<g key={s} opacity={interpolate(frame, [at, at + 14], [0, 1], clamp)}>
						<g transform={`translate(${x} 600) scale(1.6)`}>{shape}</g>
						<text x={x} y={820} textAnchor="middle" {...svgMincho(48, colors.goldSoft)}>
							{s}
						</text>
					</g>
				);
			})}
		</Canvas>
	);
};

export {Hoko, rand, Sword};
