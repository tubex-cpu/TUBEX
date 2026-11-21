import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, svgGothic, svgMincho} from './Cinema';
import {Canvas, type Tone} from './IzumoKit';

// 日本三大怨霊判決：図解（写真では見せられない、時代の流れ・関係・しくみ）

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fade = (f: number, at: number, len = 16) => interpolate(f, [at, at + len], [0, 1], clamp);
const lines = (s: string) => s.split('\n');

// 出来事の年と、その話が初めて書かれた年のあいだの「空白」を示す年表
export type GapMark = {readonly year: number; readonly label: string; readonly sub?: string; readonly story?: boolean};
export const LegendGap: React.FC<{readonly from: number; readonly to: number; readonly marks: readonly GapMark[]; readonly gapLabel: string; readonly tone?: Tone}> = ({from, to, marks, gapLabel, tone = 'night'}) => {
	const frame = useCurrentFrame();
	const x = (y: number) => 180 + ((y - from) / (to - from)) * 1560;
	const first = marks[0];
	const last = marks[marks.length - 1];
	const grow = interpolate(frame, [40, 40 + marks.length * 24], [0, 1], easeInOut);
	return (
		<Canvas tone={tone}>
			<line x1={150} x2={1770} y1={560} y2={560} stroke="rgba(239,230,210,0.35)" strokeWidth={4} />
			<rect x={x(first.year)} y={548} width={(x(last.year) - x(first.year)) * grow} height={24} fill="rgba(200,60,50,0.55)" />
			<text x={(x(first.year) + x(last.year)) / 2} y={660} textAnchor="middle" {...svgMincho(56, '#ffd0c0')} opacity={fade(frame, 40 + marks.length * 24)}>
				{gapLabel}
			</text>
			{marks.map((m, i) => {
				const at = 8 + i * 24;
				const up = i % 2 === 0;
				const mx = x(m.year);
				return (
					<g key={m.label} opacity={fade(frame, at)}>
						<circle cx={mx} cy={560} r={16} fill={m.story ? '#e0604f' : colors.gold} stroke="#0b0806" strokeWidth={4} />
						<line x1={mx} x2={mx} y1={up ? 540 : 580} y2={up ? 430 : 690} stroke={m.story ? '#e0604f' : colors.gold} strokeWidth={3} />
						<text x={mx} y={up ? 345 : 740} textAnchor="middle" {...svgGothic(50, m.story ? '#ffb3a6' : colors.goldSoft, 900)}>
							{m.year}年
						</text>
						{lines(m.label).map((ln, k) => (
							<text key={k} x={mx} y={(up ? 398 : 792) + k * 46} textAnchor="middle" {...svgGothic(38, '#efe6d2', 800)}>
								{ln}
							</text>
						))}
						{m.sub ? (
							<text x={mx} y={(up ? 398 : 792) + lines(m.label).length * 46} textAnchor="middle" {...svgGothic(30, 'rgba(239,230,210,0.7)', 700)}>
								{m.sub}
							</text>
						) : null}
					</g>
				);
			})}
		</Canvas>
	);
};

// 人物の関係図（家系・敵味方）。点の位置は画面座標
export type PNode = {readonly id: string; readonly x: number; readonly y: number; readonly name: string; readonly sub?: string; readonly hot?: boolean; readonly at?: number};
export type PEdge = {readonly a: string; readonly b: string; readonly label?: string; readonly dash?: boolean; readonly red?: boolean; readonly at?: number};
export const Relations: React.FC<{readonly nodes: readonly PNode[]; readonly edges: readonly PEdge[]; readonly heads?: readonly {readonly x: number; readonly text: string; readonly red?: boolean}[]; readonly note?: string; readonly tone?: Tone}> = ({nodes, edges, heads = [], note, tone = 'night'}) => {
	const frame = useCurrentFrame();
	const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
	return (
		<Canvas tone={tone}>
			{heads.map((h) => (
				<text key={h.text} x={h.x} y={350} textAnchor="middle" {...svgMincho(54, h.red ? '#ff9b8c' : colors.goldSoft)} opacity={fade(frame, 4)}>
					{h.text}
				</text>
			))}
			{edges.map((e, i) => {
				const a = byId[e.a];
				const b = byId[e.b];
				const at = e.at ?? 20 + i * 10;
				const p = interpolate(frame, [at, at + 24], [0, 1], easeOut);
				const len = Math.hypot(b.x - a.x, b.y - a.y);
				const col = e.red ? '#e0604f' : 'rgba(239,230,210,0.6)';
				return (
					<g key={`${e.a}-${e.b}`}>
						<line x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p} stroke={col} strokeWidth={5} strokeDasharray={e.dash ? '16 12' : undefined} />
						{e.label ? (
							<g opacity={fade(frame, at + 18)}>
								<rect x={(a.x + b.x) / 2 - e.label.length * 17 - 14} y={(a.y + b.y) / 2 - 30} width={e.label.length * 34 + 28} height={52} rx={10} fill="#120c09" stroke={col} strokeWidth={2} />
								<text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 + 9} textAnchor="middle" {...svgGothic(32, e.red ? '#ffb3a6' : '#efe6d2', 800)}>
									{e.label}
								</text>
							</g>
						) : null}
						{len > 0 ? null : null}
					</g>
				);
			})}
			{nodes.map((n, i) => {
				const at = n.at ?? 4 + i * 6;
				return (
					<g key={n.id} opacity={fade(frame, at)}>
						<rect x={n.x - 150} y={n.y - 56} width={300} height={n.sub ? 120 : 96} rx={16} fill={n.hot ? '#3a1210' : '#14100c'} stroke={n.hot ? '#e0604f' : colors.gold} strokeWidth={4} />
						<text x={n.x} y={n.y + 4} textAnchor="middle" {...svgMincho(46, n.hot ? '#ffd0c8' : '#fbf6ea')}>
							{n.name}
						</text>
						{n.sub ? (
							<text x={n.x} y={n.y + 48} textAnchor="middle" {...svgGothic(28, 'rgba(239,230,210,0.75)', 700)}>
								{n.sub}
							</text>
						) : null}
					</g>
				);
			})}
			{note ? (
				<text x={960} y={930} textAnchor="middle" {...svgMincho(46, '#ffe2a8')} opacity={fade(frame, 90)}>
					{note}
				</text>
			) : null}
		</Canvas>
	);
};

// 手続きや移り変わりを左から右へたどる流れ図
export type FlowStep = {readonly head: string; readonly body?: string; readonly hot?: boolean; readonly dim?: boolean};
export const Flow: React.FC<{readonly steps: readonly FlowStep[]; readonly note?: string; readonly tone?: Tone}> = ({steps, note, tone = 'night'}) => {
	const frame = useCurrentFrame();
	const n = steps.length;
	const w = Math.min(380, 1600 / n - 50);
	const gap = (1720 - w * n) / Math.max(1, n - 1);
	return (
		<Canvas tone={tone}>
			{steps.map((s, i) => {
				const x = 100 + i * (w + gap);
				const at = 6 + i * 22;
				return (
					<g key={s.head} opacity={fade(frame, at) * (s.dim ? 0.55 : 1)}>
						<rect x={x} y={380} width={w} height={300} rx={18} fill={s.hot ? '#3a1210' : '#14100c'} stroke={s.hot ? '#e0604f' : colors.gold} strokeWidth={4} strokeDasharray={s.dim ? '14 10' : undefined} />
						{lines(s.head).map((ln, k) => (
							<text key={k} x={x + w / 2} y={470 + k * 58} textAnchor="middle" {...svgMincho(50, s.hot ? '#ffd0c8' : colors.goldSoft)}>
								{ln}
							</text>
						))}
						{s.body
							? lines(s.body).map((ln, k) => (
									<text key={k} x={x + w / 2} y={590 + k * 44} textAnchor="middle" {...svgGothic(32, '#efe6d2', 800)}>
										{ln}
									</text>
								))
							: null}
						{i < n - 1 ? <path d={`M ${x + w + 14} 530 L ${x + w + gap - 14} 530`} stroke={colors.gold} strokeWidth={6} markerEnd="url(#fl-arrow)" /> : null}
					</g>
				);
			})}
			<defs>
				<marker id="fl-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
					<path d="M 0 0 L 10 5 L 0 10 z" fill={colors.gold} />
				</marker>
			</defs>
			{note ? (
				<text x={960} y={800} textAnchor="middle" {...svgMincho(48, '#ffe2a8')} opacity={fade(frame, 6 + n * 22 + 20)}>
					{note}
				</text>
			) : null}
		</Canvas>
	);
};

// 古い書物の言葉を、縦書きの紙に一行ずつ浮かべる
export const Scroll: React.FC<{readonly text: string; readonly source: string; readonly tone?: Tone}> = ({text, source, tone = 'ember'}) => {
	const frame = useCurrentFrame();
	const cols = lines(text);
	const colW = 84;
	const step = 58;
	const paperW = cols.length * colW + 200;
	const x0 = 960 + ((cols.length - 1) * colW) / 2;
	return (
		<Canvas tone={tone}>
			<rect x={960 - paperW / 2} y={250} width={paperW} height={690} rx={6} fill="#e9dcc0" opacity={0.95} />
			<rect x={960 - paperW / 2 + 20} y={268} width={paperW - 40} height={654} fill="none" stroke="#8a6a40" strokeWidth={2} />
			{cols.map((c, i) => (
				<g key={i} opacity={fade(frame, 10 + i * 26, 30)}>
					{[...c].map((ch, k) => (
						<text key={k} x={x0 - i * colW} y={330 + k * step} textAnchor="middle" {...svgMincho(52, '#2a1a10')}>
							{ch === 'ー' ? '｜' : ch}
						</text>
					))}
				</g>
			))}
			<text x={960 - paperW / 2 + 40} y={912} {...svgGothic(28, '#6a4a2a', 800)} opacity={fade(frame, 10 + cols.length * 26)}>
				{source}
			</text>
		</Canvas>
	);
};

// 荒ぶる魂が、祀られて守りの魂に変わる
export const SoulTurn: React.FC = () => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [60, 150], [0, 1], easeInOut);
	const flick = 0.85 + 0.15 * Math.sin(frame / 3);
	return (
		<Canvas tone="shrine">
			<defs>
				<radialGradient id="st-ara" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#ffb070" />
					<stop offset="60%" stopColor="#c0302a" />
					<stop offset="100%" stopColor="rgba(80,10,10,0)" />
				</radialGradient>
				<radialGradient id="st-nigi" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="#fffbe6" />
					<stop offset="55%" stopColor="#e8c060" />
					<stop offset="100%" stopColor="rgba(120,90,20,0)" />
				</radialGradient>
			</defs>
			<circle cx={520} cy={530} r={190 * flick} fill="url(#st-ara)" opacity={fade(frame, 4)} />
			<text x={520} y={810} textAnchor="middle" {...svgMincho(64, '#ffb3a6')} opacity={fade(frame, 10)}>
				荒ぶる魂
			</text>
			<text x={520} y={870} textAnchor="middle" {...svgGothic(34, 'rgba(239,230,210,0.8)', 800)} opacity={fade(frame, 10)}>
				祟り・疫病・雷
			</text>
			<path d={`M 760 530 L ${760 + 400 * t} 530`} stroke={colors.gold} strokeWidth={8} />
			<text x={960} y={490} textAnchor="middle" {...svgMincho(52, colors.goldSoft)} opacity={fade(frame, 70)}>
				神として祀る
			</text>
			<circle cx={1400} cy={530} r={190} fill="url(#st-nigi)" opacity={t} />
			<text x={1400} y={810} textAnchor="middle" {...svgMincho(64, '#ffe9b0')} opacity={t}>
				和やかな魂
			</text>
			<text x={1400} y={870} textAnchor="middle" {...svgGothic(34, 'rgba(239,230,210,0.8)', 800)} opacity={t}>
				守り神
			</text>
		</Canvas>
	);
};

// 表（だれが、いつ、だれを「三大怨霊」に選んだか など）
export const Table: React.FC<{readonly head: readonly string[]; readonly rows: readonly (readonly string[])[]; readonly hot?: number; readonly tone?: Tone; readonly widths?: readonly number[]}> = ({head, rows, hot, tone = 'ink', widths}) => {
	const frame = useCurrentFrame();
	const ws = widths ?? head.map(() => 1600 / head.length);
	const xs = ws.map((_, i) => 160 + ws.slice(0, i).reduce((a, b) => a + b, 0));
	const rowH = Math.min(110, 500 / rows.length);
	return (
		<Canvas tone={tone}>
			{head.map((h, i) => (
				<text key={h} x={xs[i] + 20} y={372} {...svgGothic(36, colors.goldSoft, 900)} opacity={fade(frame, 2)}>
					{h}
				</text>
			))}
			<line x1={160} x2={1760} y1={397} y2={397} stroke={colors.gold} strokeWidth={3} opacity={fade(frame, 2)} />
			{rows.map((r, j) => (
				<g key={j} opacity={fade(frame, 12 + j * 18)}>
					{hot === j ? <rect x={150} y={410 + j * rowH} width={1620} height={rowH - 10} rx={10} fill="rgba(200,60,50,0.28)" stroke="#e0604f" strokeWidth={3} /> : null}
					{r.map((c, i) => (
						<text key={i} x={xs[i] + 20} y={410 + j * rowH + rowH * 0.62} {...(i === 0 ? svgGothic(40, '#ffe2a8', 900) : svgMincho(44, '#fbf6ea'))}>
							{c}
						</text>
					))}
				</g>
			))}
		</Canvas>
	);
};

// 数字を大きく見せる（年数・回数）
export const BigYears: React.FC<{readonly value: number; readonly unit: string; readonly caption: string; readonly tone?: Tone}> = ({value, unit, caption, tone = 'night'}) => {
	const frame = useCurrentFrame();
	const v = Math.round(interpolate(frame, [6, 70], [0, value], easeOut));
	return (
		<Canvas tone={tone}>
			<text x={960} y={600} textAnchor="middle" {...svgGothic(260, colors.goldSoft, 900)}>
				{v}
				<tspan {...svgMincho(110, '#fbf6ea')}>{unit}</tspan>
			</text>
			<text x={960} y={760} textAnchor="middle" {...svgMincho(60, '#efe6d2')} opacity={fade(frame, 60)}>
				{caption}
			</text>
		</Canvas>
	);
};
