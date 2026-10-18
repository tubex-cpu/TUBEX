import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {clamp, ease, fadeIn, mincho, Person, PyramidSection, txt} from './PyramidKit';

// ---- 第3の手がかり 地震に強い？ ----

// 37か所に置いた揺れの計測器
export const SensorMap: React.FC = () => {
	const frame = useCurrentFrame();
	const pts: [number, number][] = [];
	for (let i = 0; i < 37; i++) {
		if (i < 12) pts.push([520 + (i % 4) * 70, 300 + Math.floor(i / 4) * 80]);
		else if (i < 26) pts.push([120 + ((i - 12) % 7) * 170, i < 19 ? 545 : 600]);
		else pts.push([200 + (i - 26) * 90, 650]);
	}
	return (
		<PyramidSection passages={false}>
			{pts.map((p, i) => (
				<g key={i} opacity={fadeIn(frame, i * 2, 6)}>
					<circle cx={p[0]} cy={p[1]} r={12} fill={colors.wrong} stroke="#fff" strokeWidth={3} />
				</g>
			))}
			<rect x={950} y={90} width={300} height={90} rx={16} fill="rgba(5,9,18,0.85)" />
			<text x={1100} y={150} textAnchor="middle" {...txt(48, colors.goldSoft)}>
				{Math.min(37, Math.floor(frame / 2))} か所
			</text>
		</PyramidSection>
	);
};

// ピラミッドと地面の揺れ方のちがい
export const ResonanceCompare: React.FC = () => {
	const frame = useCurrentFrame();
	const wave = (y: number, f: number, a: number, color: string) => (
		<path
			d={[...Array(120)].map((_, i) => `${i === 0 ? 'M' : 'L'}${150 + i * 9} ${y + Math.sin(i * f + frame / 4) * a}`).join(' ')}
			stroke={color}
			strokeWidth={8}
			fill="none"
		/>
	);
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<rect width={1400} height={560} rx={30} fill="rgba(5,9,18,0.75)" />
			<text x={150} y={90} {...txt(40, colors.goldSoft)}>
				ピラミッドの揺れ方
			</text>
			{wave(170, 0.35, 45, colors.gold)}
			<text x={150} y={330} {...txt(40, colors.muted)}>
				地面の揺れ方
			</text>
			{wave(420, 0.12, 45, colors.wrong)}
		</svg>
	);
};

// 王の間で揺れが強まり、上のすきまの部屋で弱まる
export const ChamberAmplify: React.FC = () => {
	const frame = useCurrentFrame();
	const shake = (amp: number) => Math.sin(frame / 2) * amp;
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#1a1612" />
			{[...Array(5)].map((_, i) => (
				<g key={i} transform={`translate(${shake(2)} 0)`} opacity={fadeIn(frame, 40 + i * 5)}>
					<rect x={380} y={80 + i * 60} width={400} height={18} fill="#8a8f99" />
					<rect x={380} y={98 + i * 60} width={400} height={42} fill="#2b2420" />
				</g>
			))}
			<g transform={`translate(${shake(10)} 0)`}>
				<rect x={360} y={400} width={440} height={170} fill="#3b2a16" stroke="#c9a96e" strokeWidth={6} />
				<text x={580} y={500} textAnchor="middle" {...txt(48)}>
					王の間
				</text>
			</g>
			<g opacity={fadeIn(frame, 10)}>
				<rect x={860} y={420} width={330} height={130} rx={16} fill={colors.correct} />
				<text x={1025} y={505} textAnchor="middle" {...txt(54)}>
					揺れ 約4倍
				</text>
			</g>
			<g opacity={fadeIn(frame, 60)}>
				<rect x={860} y={140} width={330} height={130} rx={16} fill={colors.wrong} />
				<text x={1025} y={225} textAnchor="middle" {...txt(54)}>
					約3倍に低下
				</text>
				<text x={180} y={230} textAnchor="middle" {...txt(36, colors.goldSoft)}>
					すきまの
				</text>
				<text x={180} y={275} textAnchor="middle" {...txt(36, colors.goldSoft)}>
					部屋 5段
				</text>
			</g>
		</svg>
	);
};

// 倒れにくい形の理由
export const StableShape: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['広い土台', '低い重心', 'かたい岩盤', '左右対称'];
	return (
		<PyramidSection passages={false}>
			<circle cx={650} cy={430} r={20} fill={colors.correct} opacity={fadeIn(frame, 20)} />
			<text x={690} y={440} {...txt(36, '#fff')} opacity={fadeIn(frame, 20)}>
				重心
			</text>
			{items.map((it, i) => (
				<g key={it} opacity={fadeIn(frame, 30 + i * 15)}>
					<rect x={i < 2 ? 40 : 1060} y={140 + (i % 2) * 130} width={210} height={90} rx={14} fill="rgba(5,9,18,0.9)" stroke={colors.gold} strokeWidth={3} />
					<text x={(i < 2 ? 40 : 1060) + 105} y={200 + (i % 2) * 130} textAnchor="middle" {...txt(36, colors.goldSoft)}>
						{it}
					</text>
				</g>
			))}
		</PyramidSection>
	);
};

// ---- 第4の手がかり 重りと滑車？ ----

// 20年で230万個 → 数分に1個
export const BlockRate: React.FC = () => {
	const frame = useCurrentFrame();
	const blocks = Math.floor(interpolate(frame, [0, 120], [0, 60], clamp));
	const hand = (frame * 6) % 360;
	return (
		<svg width={1300} height={580} viewBox="0 0 1300 580">
			<rect width={1300} height={580} rx={30} fill="rgba(5,9,18,0.75)" />
			<g transform="translate(260 290)">
				<circle r={170} fill="#f4ecdc" />
				{[...Array(12)].map((_, i) => (
					<line key={i} x1={0} y1={-150} x2={0} y2={-130} stroke={colors.ink} strokeWidth={6} transform={`rotate(${i * 30})`} />
				))}
				<line x1={0} y1={0} x2={0} y2={-130} stroke={colors.correct} strokeWidth={8} transform={`rotate(${hand})`} />
			</g>
			{[...Array(blocks)].map((_, i) => (
				<rect key={i} x={560 + (i % 12) * 56} y={460 - Math.floor(i / 12) * 44} width={50} height={38} fill="#c9a96e" stroke="#8a6d3f" strokeWidth={2} />
			))}
			<text x={900} y={110} textAnchor="middle" {...txt(48, colors.goldSoft)}>
				約20年で、約230万個
			</text>
		</svg>
	);
};

// これまでの有力説：坂道とそり
export const RampTheory: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [20, 110], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const bx = 120 + 520 * p;
	const by = 560 - 300 * p;
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#1f3354" />
			<rect y={560} width={1300} height={80} fill="#a88c5a" />
			<path d="M700 560 L960 200 L1220 560 Z" fill="#c9a96e" opacity={0.6} />
			<path d="M80 560 L700 240 L700 560 Z" fill="#b39462" />
			<g transform={`translate(${bx} ${by}) rotate(-27)`}>
				<rect x={-50} y={-60} width={100} height={60} fill="#d9c8a0" stroke="#8a6d3f" strokeWidth={4} />
				<rect x={-60} y={0} width={120} height={10} fill="#5a3a24" />
			</g>
			{[0, 1, 2, 3].map((i) => (
				<Person key={i} x={bx + 110 + i * 50} y={by - 50 - i * 25} s={0.6} color="#3b2a16" />
			))}
		</svg>
	);
};

// 砂に水をかけると、引く力は約半分
export const WetSand: React.FC = () => {
	const frame = useCurrentFrame();
	const wet = interpolate(frame, [40, 70], [0, 1], clamp);
	const force = 100 - 50 * wet;
	return (
		<svg width={1300} height={580} viewBox="0 0 1300 580">
			<rect width={1300} height={580} rx={30} fill="#1f3354" />
			<rect y={400} width={1300} height={180} fill={wet > 0.5 ? '#a88049' : '#dcc48e'} />
			<rect x={250} y={260} width={240} height={130} fill="#d9c8a0" stroke="#8a6d3f" strokeWidth={4} />
			<rect x={230} y={390} width={280} height={14} fill="#5a3a24" />
			<Person x={620} y={400} s={1} color="#3b2a16" />
			{wet > 0
				? [...Array(10)].map((_, i) => <circle key={i} cx={560 + (i % 5) * 14} cy={360 + ((frame * 4 + i * 20) % 40)} r={5} fill="#7fb0d9" opacity={wet} />)
				: null}
			<g transform="translate(900 200)">
				<rect x={0} y={0} width={300} height={40} rx={20} fill="#2b3550" />
				<rect x={0} y={0} width={3 * force} height={40} rx={20} fill={colors.correct} />
				<text x={150} y={110} textAnchor="middle" {...txt(44)}>
					引く力 {Math.round(force)}%
				</text>
			</g>
		</svg>
	);
};

// 内側から外へ積み上げる
export const InsideOut: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 120], [0.3, 1], clamp);
	return (
		<PyramidSection passages={false} dim>
			<path d={`M${650 - 400 * p} 560 L650 ${560 - 500 * p} L${650 + 400 * p} 560 Z`} fill="#e0c389" stroke="#8a6d3f" strokeWidth={4} />
			<path d="M470 515 L650 300" stroke="#3b2a16" strokeWidth={22} />
			{[[-1, 1], [1, 1]].map(([d], i) => (
				<path key={i} d={`M650 ${560 - 500 * p + 60} l${d * 160} ${120}`} stroke={colors.goldSoft} strokeWidth={6} strokeDasharray="14 10" fill="none" />
			))}
		</PyramidSection>
	);
};

// 大回廊を重りがすべり、外の石を引き上げる
export const CounterweightGallery: React.FC = () => {
	const frame = useCurrentFrame();
	const t = interpolate(frame % 120, [0, 100], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const wx = 650 - 90 * t;
	const wy = 300 + 110 * t;
	return (
		<PyramidSection>
			<rect x={wx - 26} y={wy - 20} width={52} height={36} fill={colors.correct} transform={`rotate(-50 ${wx} ${wy})`} />
			<circle cx={700} cy={250} r={22} fill="none" stroke={colors.goldSoft} strokeWidth={6} />
			<path d={`M${wx} ${wy} L700 250 L${880 - 0} ${440 - 160 * t}`} stroke={colors.goldSoft} strokeWidth={4} fill="none" />
			<rect x={860} y={420 - 160 * t} width={50} height={36} fill="#e8d9b0" stroke="#8a6d3f" strokeWidth={3} />
			<text x={250} y={160} {...txt(36, colors.goldSoft)}>
				重り（大回廊を下る）
			</text>
			<text x={930} y={300} {...txt(36, '#fff')}>
				石が上がる
			</text>
		</PyramidSection>
	);
};

// 外側のふちに坂道を組みこむ方法を、コンピューターで確かめる
export const EdgeRamp: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 120], [0, 1], ease);
	const levels = 10;
	const shown = Math.floor(p * levels);
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#0b1222" />
			{[...Array(shown)].map((_, i) => {
				const w = 800 - i * 76;
				return <rect key={i} x={650 - w / 2} y={560 - (i + 1) * 46} width={w} height={46} fill="none" stroke={colors.wrong} strokeWidth={3} />;
			})}
			<path d={[...Array(shown)].map((_, i) => `${i === 0 ? 'M' : 'L'}${650 - (800 - i * 76) / 2 + 10} ${560 - i * 46}`).join(' ')} stroke={colors.goldSoft} strokeWidth={8} fill="none" />
			<text x={650} y={80} textAnchor="middle" {...mincho(48, colors.goldSoft)}>
				シミュレーション
			</text>
		</svg>
	);
};

