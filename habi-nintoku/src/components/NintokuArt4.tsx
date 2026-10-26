import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {ease, fadeIn, mincho, txt} from './Maps';
import {Keyhole, MoatedKofun} from './NintokuArt1';

const Panel: React.FC<{readonly w?: number; readonly h?: number; readonly fill?: string; readonly children: React.ReactNode}> = ({w = 1400, h = 620, fill = '#16202f', children}) => (
	<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
		<rect width={w} height={h} rx={30} fill={fill} />
		{children}
	</svg>
);

// ---- 冒頭：閉ざされた墓 ----

// 濠と柵に囲まれ、立ち入れない森
export const KeepOut: React.FC = () => {
	const frame = useCurrentFrame();
	const fence = interpolate(frame, [10, 50], [0, 1], ease);
	return (
		<Panel fill="#0c1520">
			<g opacity={fadeIn(frame, 0)}>
				<MoatedKofun x={820} y={270} s={0.62} />
			</g>
			<g opacity={fence}>
				{Array.from({length: 23}, (_, i) => (
					<rect key={i} x={70 + i * 56} y={470} width={10} height={110} fill="#8a8f96" />
				))}
				<rect x={60} y={490} width={1290} height={10} fill="#8a8f96" />
				<rect x={60} y={545} width={1290} height={10} fill="#8a8f96" />
			</g>
			<g opacity={fadeIn(frame, 45)}>
				<rect x={490} y={420} width={420} height={110} rx={10} fill={colors.paper} stroke={colors.correct} strokeWidth={10} />
				<text x={700} y={497} textAnchor="middle" {...txt(64, colors.correct)}>
					立入禁止
				</text>
			</g>
		</Panel>
	);
};

// この墓の主は誰？ 名前の札は空白のまま
export const WhoSleeps: React.FC = () => {
	const frame = useCurrentFrame();
	const pulse = 1 + 0.06 * Math.sin(frame / 8);
	const cands = ['仁徳天皇？', '息子の世代の大王？', '倭の五王のひとり？'];
	return (
		<Panel fill="#120f1c">
			<g opacity={fadeIn(frame, 0)}>
				<Keyhole x={470} y={300} s={0.62} fill="#2b3a2a" stroke="#6f8f5a" strokeWidth={4} />
				<text x={470} y={300 + 45} textAnchor="middle" transform={`translate(470 ${300}) scale(${pulse}) translate(-470 -300)`} {...mincho(150, colors.goldSoft)}>
					？
				</text>
			</g>
			{cands.map((c, i) => (
				<g key={c} opacity={fadeIn(frame, 25 + i * 22)}>
					<rect x={860} y={110 + i * 150} width={480} height={110} rx={16} fill={colors.paper} />
					<text x={1100} y={182 + i * 150} textAnchor="middle" {...mincho(44, colors.ink)}>
						{c}
					</text>
				</g>
			))}
		</Panel>
	);
};

// 北の大仙古墳と、南の「息子の墓」とされる古墳。本当の仁徳天皇はどちらに？
export const WhereIsNintoku: React.FC = () => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [30, 150], [0, 1], ease);
	const qy = 180 + 260 * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
	return (
		<Panel fill="#10202a">
			<text x={120} y={80} {...txt(36, colors.muted)} opacity={fadeIn(frame, 0)}>
				北
			</text>
			<g opacity={fadeIn(frame, 0)}>
				<Keyhole x={560} y={180} s={0.38} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={4} />
				<text x={760} y={195} {...txt(38)}>
					仁徳天皇陵（大仙古墳）
				</text>
			</g>
			<g opacity={fadeIn(frame, 15)}>
				<Keyhole x={560} y={440} s={0.3} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={4} />
				<text x={760} y={430} {...txt(38)}>
					息子・履中天皇の墓とされる古墳
				</text>
				<text x={760} y={485} {...txt(32, colors.goldSoft)}>
					こちらが先に造られた？
				</text>
			</g>
			<text x={250} y={qy + 40} textAnchor="middle" {...mincho(120, colors.correct)} opacity={fadeIn(frame, 30)}>
				？
			</text>
		</Panel>
	);
};

// 明治に墓から出た宝。その実物は150年以上、行方がわからなかった
export const MissingTreasure: React.FC = () => {
	const frame = useCurrentFrame();
	const fade = interpolate(frame, [30, 90], [1, 0.12], ease);
	return (
		<Panel fill="#1b140f">
			<g opacity={fadeIn(frame, 0)}>
				<rect x={430} y={150} width={540} height={260} rx={20} fill="none" stroke={colors.gold} strokeWidth={6} strokeDasharray="22 14" />
				<g opacity={fade}>
					<rect x={500} y={255} width={400} height={50} rx={24} fill="#c9a24a" stroke="#7d6232" strokeWidth={5} />
					<rect x={880} y={262} width={60} height={36} rx={8} fill="#7d6232" />
				</g>
				<text x={700} y={300} textAnchor="middle" {...mincho(120, colors.goldSoft)} opacity={1 - fade}>
					？
				</text>
			</g>
			<text x={700} y={110} textAnchor="middle" {...txt(40)} opacity={fadeIn(frame, 10)}>
				明治5年、墓から出た宝
			</text>
			<text x={700} y={510} textAnchor="middle" {...txt(48, colors.correct)} opacity={fadeIn(frame, 70)}>
				150年以上、行方不明
			</text>
		</Panel>
	);
};

// 閉ざされた1500年と、動き出した最近の調査
export const SealedTimeline: React.FC = () => {
	const frame = useCurrentFrame();
	const items = [
		{x: 180, y: '5世紀', d: '巨大な墓が造られる'},
		{x: 560, y: '1872年', d: '一度だけ口を開ける'},
		{x: 900, y: '2025年', d: '研究者が初めて墳丘へ'},
		{x: 1230, y: '2026年', d: '謎の「土壇」'},
	];
	const line = interpolate(frame, [0, 80], [0, 1], ease);
	return (
		<Panel fill="#0f1a2a">
			<line x1={120} y1={300} x2={120 + 1160 * line} y2={300} stroke={colors.gold} strokeWidth={8} />
			{items.map((it, i) => (
				<g key={it.y} opacity={fadeIn(frame, 10 + i * 20)}>
					<circle cx={it.x} cy={300} r={18} fill={i === 3 ? colors.correct : colors.gold} />
					<text x={it.x} y={240} textAnchor="middle" {...txt(44, i === 3 ? colors.correct : colors.text)}>
						{it.y}
					</text>
					<text x={it.x} y={370} textAnchor="middle" {...txt(30, colors.goldSoft)}>
						{it.d}
					</text>
				</g>
			))}
			<text x={700} y={520} textAnchor="middle" {...mincho(54, colors.text)} opacity={fadeIn(frame, 100)}>
				閉ざされた墓が、動き出した
			</text>
		</Panel>
	);
};
