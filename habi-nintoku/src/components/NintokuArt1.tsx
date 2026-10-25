import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {clamp, ease, fadeIn, mincho, txt} from './Maps';

// 上から見た前方後円墳（仁徳天皇陵の比率：全長486、後円部径249、前方部幅307）。
// x, y は後円部の中心、s は 1メートルあたりの大きさ
export const Keyhole: React.FC<{
	readonly x: number;
	readonly y: number;
	readonly s: number;
	readonly fill: string;
	readonly stroke?: string;
	readonly strokeWidth?: number;
	readonly opacity?: number;
}> = ({x, y, s, fill, stroke, strokeWidth = 0, opacity = 1}) => {
	const r = 124.5 * s;
	const front = 361 * s;
	const half = 153 * s;
	const neck = 95 * s;
	const pts = `${x - 40 * s},${y - neck} ${x - front},${y - half} ${x - front},${y + half} ${x - 40 * s},${y + neck}`;
	const st = stroke ?? fill;
	return (
		<g opacity={opacity}>
			<polygon points={pts} fill={fill} stroke={st} strokeWidth={strokeWidth} strokeLinejoin="round" />
			<circle cx={x} cy={y} r={r} fill={fill} stroke={st} strokeWidth={strokeWidth} />
		</g>
	);
};

// 三重の濠に囲まれた古墳（上から）
export const MoatedKofun: React.FC<{readonly x: number; readonly y: number; readonly s: number; readonly show?: number}> = ({x, y, s, show = 1}) => (
	<g>
		<g opacity={show}>
			<Keyhole x={x} y={y} s={s} fill="#2f6f8f" strokeWidth={150 * s} />
			<Keyhole x={x} y={y} s={s} fill="#4d7a3a" strokeWidth={110 * s} />
			<Keyhole x={x} y={y} s={s} fill="#2f6f8f" strokeWidth={80 * s} />
			<Keyhole x={x} y={y} s={s} fill="#4d7a3a" strokeWidth={45 * s} />
			<Keyhole x={x} y={y} s={s} fill="#2f6f8f" strokeWidth={28 * s} />
		</g>
		<Keyhole x={x} y={y} s={s} fill="#3f6b2e" stroke="#2a4a1e" strokeWidth={4} />
	</g>
);

const Panel: React.FC<{readonly w?: number; readonly h?: number; readonly fill?: string; readonly children: React.ReactNode}> = ({w = 1400, h = 620, fill = '#16202f', children}) => (
	<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
		<rect width={w} height={h} rx={30} fill={fill} />
		{children}
	</svg>
);

// ---- 謎の先出し ----

// 赤色立体図のように浮かび上がる古墳と、前方部の「四角い土壇」
export const RedReliefTease: React.FC = () => {
	const frame = useCurrentFrame();
	const scan = interpolate(frame, [0, 70], [0, 1400], clamp);
	const box = fadeIn(frame, 70, 20);
	return (
		<Panel fill="#2a0d0a">
			<defs>
				<clipPath id="scanClip">
					<rect width={scan} height={620} />
				</clipPath>
			</defs>
			<g clipPath="url(#scanClip)">
				<Keyhole x={880} y={310} s={1.25} fill="#7a1d12" stroke="#f1b08a" strokeWidth={10} />
				<Keyhole x={880} y={310} s={1.0} fill="#a8321f" />
				<Keyhole x={880} y={310} s={0.7} fill="#e07a4f" />
			</g>
			<line x1={scan} y1={0} x2={scan} y2={620} stroke="#ffd2a0" strokeWidth={4} opacity={scan < 1400 ? 1 : 0} />
			<g opacity={box}>
				<rect x={455} y={250} width={110} height={120} fill="none" stroke={colors.goldSoft} strokeWidth={8} strokeDasharray="18 10" />
				<text x={510} y={225} textAnchor="middle" {...txt(44, colors.goldSoft)} stroke="#000" strokeWidth={6} paintOrder="stroke">
					？
				</text>
			</g>
		</Panel>
	);
};

// 断面：前方部の土壇の下に、もうひとつの埋葬？
export const HiddenBurial: React.FC = () => {
	const frame = useCurrentFrame();
	const q = fadeIn(frame, 40, 20);
	return (
		<Panel fill="#1b140f">
			<path d="M80 470 L330 340 L640 330 L760 300 Q 980 120 1200 300 L1320 470 Z" fill="#5c7a3a" />
			<path d="M80 470 L1320 470 L1320 620 L80 620 Z" fill="#3a2a1c" />
			<rect x={430} y={300} width={140} height={40} fill="#7d6040" />
			<g opacity={q}>
				<rect x={440} y={360} width={120} height={60} rx={8} fill="none" stroke={colors.goldSoft} strokeWidth={6} strokeDasharray="14 8" />
				<text x={500} y={403} textAnchor="middle" {...mincho(44, colors.goldSoft)}>
					？
				</text>
			</g>
			<text x={340} y={560} textAnchor="middle" {...txt(36, colors.muted)}>
				前方部
			</text>
			<text x={1000} y={560} textAnchor="middle" {...txt(36, colors.muted)}>
				後円部
			</text>
		</Panel>
	);
};

// ---- 第1の手がかり 世界最大の墓？ ----

// 鍵穴の形：前方部と後円部
export const KeyholeParts: React.FC = () => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [0, 40], [0, 1], ease);
	return (
		<Panel>
			<g opacity={draw}>
				<Keyhole x={850} y={300} s={1.05} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={6} />
			</g>
			<g opacity={fadeIn(frame, 40)}>
				<text x={590} y={310} textAnchor="middle" {...txt(54, '#fff')} stroke="#000" strokeWidth={8} paintOrder="stroke">
					前方部
				</text>
				<text x={850} y={310} textAnchor="middle" {...txt(54, '#fff')} stroke="#000" strokeWidth={8} paintOrder="stroke">
					後円部
				</text>
			</g>
			<text x={700} y={590} textAnchor="middle" {...txt(38, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				四角と丸をつないだ「前方後円墳」
			</text>
		</Panel>
	);
};

// 前方後円墳が造られた時代
export const KofunEra: React.FC = () => {
	const frame = useCurrentFrame();
	const x = (c: number) => 150 + (c - 1) * 220;
	const p = interpolate(frame, [10, 60], [0, 1], ease);
	return (
		<Panel h={460}>
			<line x1={120} y1={300} x2={1300} y2={300} stroke="#fff" strokeWidth={4} />
			{[1, 2, 3, 4, 5, 6].map((c) => (
				<g key={c}>
					<line x1={x(c)} y1={290} x2={x(c)} y2={310} stroke="#fff" strokeWidth={4} />
					<text x={x(c)} y={360} textAnchor="middle" {...txt(36, colors.muted)}>
						{c}世紀
					</text>
				</g>
			))}
			<rect x={x(3.5)} y={200} width={(x(6.6) - x(3.5)) * p} height={70} rx={14} fill={colors.gold} />
			<text x={(x(3.5) + x(6.6)) / 2} y={175} textAnchor="middle" {...txt(44)} opacity={fadeIn(frame, 40)}>
				前方後円墳が造られた時代
			</text>
			<g opacity={fadeIn(frame, 70)}>
				<circle cx={x(5.5)} cy={235} r={20} fill={colors.correct} stroke="#fff" strokeWidth={4} />
				<text x={x(5.5)} y={430} textAnchor="middle" {...txt(40, colors.goldSoft)}>
					仁徳天皇陵（5世紀）
				</text>
			</g>
		</Panel>
	);
};

// 墳丘486m・高さ36m・濠を含めて840m
export const KofunDimensions: React.FC = () => {
	const frame = useCurrentFrame();
	const moat = fadeIn(frame, 50, 20);
	return (
		<Panel h={640}>
			<MoatedKofun x={930} y={320} s={1.05} show={moat} />
			<g opacity={fadeIn(frame, 10)}>
				<line x1={551} y1={110} x2={1061} y2={110} stroke={colors.goldSoft} strokeWidth={5} />
				<text x={806} y={90} textAnchor="middle" {...txt(44, colors.goldSoft)}>
					墳丘 およそ486m
				</text>
			</g>
			<g opacity={moat}>
				<text x={806} y={600} textAnchor="middle" {...txt(44, '#9cd0f0')}>
					三重の濠まで含めて およそ840m
				</text>
			</g>
			<g opacity={fadeIn(frame, 30)}>
				<rect x={60} y={230} width={250} height={160} rx={18} fill="rgba(5,9,18,0.8)" />
				<text x={185} y={290} textAnchor="middle" {...txt(34, colors.muted)}>
					後円部の高さ
				</text>
				<text x={185} y={360} textAnchor="middle" {...mincho(64, '#fff')}>
					約36m
				</text>
			</g>
		</Panel>
	);
};

// 日本の古墳 大きさベスト3（墳丘の長さ）
export const TopThree: React.FC = () => {
	const frame = useCurrentFrame();
	const rows = [
		{name: '仁徳天皇陵（堺市）', m: 486, c: colors.gold},
		{name: '応神天皇陵（羽曳野市）', m: 425, c: colors.goldSoft},
		{name: '履中天皇陵（堺市）', m: 365, c: '#d8c49a'},
	];
	return (
		<Panel h={520}>
			<text x={700} y={80} textAnchor="middle" {...txt(44, '#fff')}>
				日本の古墳 墳丘の長さ ベスト3
			</text>
			{rows.map((r, i) => {
				const p = interpolate(frame, [10 + i * 15, 50 + i * 15], [0, 1], ease);
				return (
					<g key={r.name} transform={`translate(0 ${150 + i * 120})`}>
						<text x={90} y={52} {...txt(44, colors.goldSoft)}>
							{i + 1}位
						</text>
						<rect x={200} y={0} width={(r.m / 486) * 760 * p} height={74} rx={12} fill={r.c} />
						<text x={215} y={50} {...txt(34, colors.ink)} opacity={p}>
							{r.name}
						</text>
						<text x={200 + (r.m / 486) * 760 * p + 20} y={52} {...txt(44)} opacity={p}>
							{r.m}m
						</text>
					</g>
				);
			})}
		</Panel>
	);
};

// 墓の大きさを比べる4つのものさし
export const FourRulers: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['長さ', '面積', '高さ', '体積'];
	return (
		<svg width={1400} height={360} viewBox="0 0 1400 360">
			{items.map((t, i) => (
				<g key={t} transform={`translate(${40 + i * 340} 40)`} opacity={fadeIn(frame, i * 12)}>
					<rect width={300} height={260} rx={24} fill={colors.paper} />
					<text x={150} y={170} textAnchor="middle" {...mincho(84, colors.ink)}>
						{t}
					</text>
				</g>
			))}
		</svg>
	);
};

// 長さの比較：上から見たピラミッド（底辺230m）と仁徳天皇陵（486m）
export const LengthCompare: React.FC = () => {
	const frame = useCurrentFrame();
	const s = 2.1;
	const p = fadeIn(frame, 30, 20);
	return (
		<Panel>
			<g opacity={fadeIn(frame, 0)}>
				<rect x={110} y={310 - 115 * s * 0.5 - 60} width={230 * s * 0.5} height={230 * s * 0.5} fill="#d9b876" stroke="#8a6a32" strokeWidth={4} />
				<line x1={110} y1={310 - 120 * s * 0.5 - 70} x2={110 + 230 * s * 0.5} y2={310 - 120 * s * 0.5 - 70} stroke="#fff" strokeWidth={4} />
				<text x={110 + 115 * s * 0.5} y={150} textAnchor="middle" {...txt(36)}>
					230m
				</text>
				<text x={110 + 115 * s * 0.5} y={470} textAnchor="middle" {...txt(36, colors.muted)}>
					クフ王のピラミッド
				</text>
			</g>
			<g opacity={p}>
				<Keyhole x={500 + 361 * s * 0.5 + 40} y={300} s={s * 0.5} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={5} />
				<line x1={540} y1={150} x2={540 + 486 * s * 0.5} y2={150} stroke={colors.goldSoft} strokeWidth={4} />
				<text x={540 + 243 * s * 0.5} y={130} textAnchor="middle" {...txt(40, colors.goldSoft)}>
					486m
				</text>
				<text x={540 + 243 * s * 0.5} y={490} textAnchor="middle" {...txt(36, colors.muted)}>
					仁徳天皇陵
				</text>
			</g>
			<text x={700} y={585} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				長さは2倍以上
			</text>
		</Panel>
	);
};

// 高さの比較：横から見たピラミッド（約138m）と古墳（約36m）
export const HeightCompare: React.FC = () => {
	const frame = useCurrentFrame();
	const h1 = interpolate(frame, [0, 40], [0, 1], ease);
	const h2 = interpolate(frame, [30, 70], [0, 1], ease);
	const ground = 520;
	const k = 3.1;
	return (
		<Panel>
			<line x1={60} y1={ground} x2={1340} y2={ground} stroke="#fff" strokeWidth={4} />
			<path d={`M150 ${ground} L${390} ${ground - 138 * k * h1} L${630} ${ground} Z`} fill="#d9b876" />
			<text x={390} y={ground - 138 * k * h1 - 20} textAnchor="middle" {...txt(44)}>
				約138m
			</text>
			<path d={`M760 ${ground} Q 1000 ${ground - 36 * k * 2 * h2} 1260 ${ground} Z`} fill="#3f6b2e" />
			<text x={1010} y={ground - 36 * k * h2 - 40} textAnchor="middle" {...txt(44)} opacity={h2}>
				約36m
			</text>
			<text x={390} y={575} textAnchor="middle" {...txt(34, colors.muted)}>
				クフ王のピラミッド
			</text>
			<text x={1010} y={575} textAnchor="middle" {...txt(34, colors.muted)}>
				仁徳天皇陵（後円部）
			</text>
		</Panel>
	);
};

// 体積の比較（ある資料による）
export const VolumeCompare: React.FC = () => {
	const frame = useCurrentFrame();
	const rows = [
		{name: '仁徳天皇陵', v: 140, c: '#6f9a4c'},
		{name: 'クフ王のピラミッド', v: 260, c: '#d9b876'},
		{name: '秦の始皇帝陵', v: 300, c: '#b9826a'},
	];
	return (
		<Panel h={560}>
			<text x={700} y={80} textAnchor="middle" {...txt(42, '#fff')}>
				体積（万立方メートル・ある資料による）
			</text>
			{rows.map((r, i) => {
				const p = interpolate(frame, [10 + i * 18, 50 + i * 18], [0, 1], ease);
				return (
					<g key={r.name} transform={`translate(0 ${150 + i * 120})`}>
						<text x={430} y={52} textAnchor="end" {...txt(40)}>
							{r.name}
						</text>
						<rect x={460} y={0} width={(r.v / 300) * 700 * p} height={74} rx={12} fill={r.c} />
						<text x={460 + (r.v / 300) * 700 * p + 20} y={52} {...txt(44, colors.goldSoft)} opacity={p}>
							{r.v}万
						</text>
					</g>
				);
			})}
		</Panel>
	);
};

// 数字は資料によって変わる
export const NumbersVary: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel h={460}>
			<g opacity={fadeIn(frame, 0)}>
				<rect x={120} y={110} width={500} height={220} rx={20} fill={colors.paper} />
				<text x={370} y={190} textAnchor="middle" {...txt(36, colors.clayDark)}>
					資料A
				</text>
				<text x={370} y={280} textAnchor="middle" {...mincho(64, colors.ink)}>
					約140万㎥
				</text>
			</g>
			<g opacity={fadeIn(frame, 25)}>
				<rect x={780} y={110} width={500} height={220} rx={20} fill={colors.paper} />
				<text x={1030} y={190} textAnchor="middle" {...txt(36, colors.clayDark)}>
					資料B
				</text>
				<text x={1030} y={280} textAnchor="middle" {...mincho(64, colors.ink)}>
					300万㎥以上
				</text>
			</g>
			<text x={700} y={410} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				どこまでを「墓」に含める？
			</text>
		</Panel>
	);
};

// ---- 第2の手がかり 15年以上かかった？ ----

// 造り方：形を描く → 濠を掘る → 土を盛る
export const BuildSteps: React.FC = () => {
	const frame = useCurrentFrame();
	const steps = ['形を描く', '濠を掘る', '土を盛る'];
	const mound = interpolate(frame, [70, 120], [0, 1], ease);
	return (
		<Panel>
			{steps.map((t, i) => (
				<g key={t} opacity={fadeIn(frame, i * 35)}>
					<rect x={80 + i * 430} y={40} width={380} height={80} rx={16} fill={colors.paper} />
					<text x={270 + i * 430} y={95} textAnchor="middle" {...txt(42, colors.ink)}>
						{i + 1}. {t}
					</text>
				</g>
			))}
			<g transform="translate(0 40)">
				<Keyhole x={900} y={330} s={0.9} fill="none" stroke="#f3dc9c" strokeWidth={4} opacity={fadeIn(frame, 0)} />
				<Keyhole x={900} y={330} s={0.9} fill="#2f6f8f" strokeWidth={60} opacity={fadeIn(frame, 35)} />
				<Keyhole x={900} y={330} s={0.9} fill="#8a6a42" opacity={fadeIn(frame, 35)} />
				<Keyhole x={900} y={330} s={0.9 * mound} fill="#6b8f45" opacity={mound} />
			</g>
		</Panel>
	);
};

// 大林組の試算（1985年）：工期15年8か月
export const ConstructionPeriod: React.FC = () => {
	const frame = useCurrentFrame();
	const months = Math.round(interpolate(frame, [0, 70], [0, 188], ease));
	return (
		<Panel h={480}>
			<text x={700} y={100} textAnchor="middle" {...txt(42, colors.muted)}>
				古代の方法で造ったら（1985年の試算）
			</text>
			<text x={700} y={320} textAnchor="middle" {...mincho(180, colors.goldSoft)}>
				{Math.floor(months / 12)}
				<tspan {...txt(80)}>年</tspan>
				{months % 12}
				<tspan {...txt(80)}>か月</tspan>
			</text>
			<text x={700} y={430} textAnchor="middle" {...txt(36, colors.muted)}>
				大林組の試算
			</text>
		</Panel>
	);
};

// 人と費用：1日最大2000人、のべ680万7000人、約796億円
export const WorkerStats: React.FC = () => {
	const frame = useCurrentFrame();
	const items = [
		{t: '1日の最大', v: '2000人'},
		{t: 'のべ人数', v: '680万7000人'},
		{t: '費用（当時）', v: '約796億円'},
	];
	return (
		<svg width={1400} height={440} viewBox="0 0 1400 440">
			{items.map((it, i) => (
				<g key={it.t} transform={`translate(${30 + i * 460} 40)`} opacity={fadeIn(frame, i * 20)}>
					<rect width={420} height={330} rx={24} fill="rgba(5,9,18,0.85)" stroke={colors.gold} strokeWidth={4} />
					<text x={210} y={90} textAnchor="middle" {...txt(40, colors.muted)}>
						{it.t}
					</text>
					<text x={210} y={220} textAnchor="middle" {...mincho(it.v.length > 6 ? 56 : 80, colors.goldSoft)}>
						{it.v}
					</text>
				</g>
			))}
		</svg>
	);
};

// 現場の人々：3000人ほどが常にいた
export const Crowd: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 60], [0, 120], ease));
	return (
		<Panel h={520} fill="#2b2418">
			{[...Array(n)].map((_, i) => {
				const x = 80 + (i % 20) * 62;
				const y = 120 + Math.floor(i / 20) * 62;
				return (
					<g key={i} transform={`translate(${x} ${y})`}>
						<circle r={12} cy={-14} fill="#f4ecdc" />
						<rect x={-11} y={0} width={22} height={28} rx={6} fill="#c98b5a" />
					</g>
				);
			})}
			<text x={700} y={500} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				いつも現場に、3000人ほど
			</text>
		</Panel>
	);
};

// 古代と現代の工期
export const AncientVsModern: React.FC = () => {
	const frame = useCurrentFrame();
	const a = interpolate(frame, [10, 60], [0, 1], ease);
	const m = interpolate(frame, [40, 70], [0, 1], ease);
	return (
		<Panel h={480}>
			<text x={330} y={170} textAnchor="end" {...txt(44)}>
				古代の方法
			</text>
			<rect x={360} y={120} width={900 * a} height={80} rx={14} fill={colors.gold} />
			<text x={380} y={175} {...txt(40, colors.ink)} opacity={a}>
				15年8か月
			</text>
			<text x={330} y={330} textAnchor="end" {...txt(44)}>
				現代の機械
			</text>
			<rect x={360} y={280} width={(2.5 / 15.67) * 900 * m} height={80} rx={14} fill="#9cd0f0" />
			<text x={380 + (2.5 / 15.67) * 900 * m} y={335} {...txt(40, '#fff')} opacity={m}>
				2年半
			</text>
			<text x={700} y={440} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 80)}>
				6倍以上の時間
			</text>
		</Panel>
	);
};

// 計算に入っていない埴輪づくり
export const HaniwaUncounted: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel h={480} fill="#2b2418">
			{[...Array(9)].map((_, i) => (
				<g key={i} transform={`translate(${170 + i * 130} 300)`} opacity={fadeIn(frame, i * 5)}>
					<rect x={-40} y={-120} width={80} height={160} rx={10} fill="#c9864f" />
					<line x1={-40} y1={-60} x2={40} y2={-60} stroke="#8d5a36" strokeWidth={6} />
					<line x1={-40} y1={-10} x2={40} y2={-10} stroke="#8d5a36" strokeWidth={6} />
				</g>
			))}
			<g opacity={fadeIn(frame, 50)}>
				<rect x={350} y={60} width={700} height={90} rx={18} fill="rgba(5,9,18,0.9)" />
				<text x={700} y={122} textAnchor="middle" {...txt(44, colors.goldSoft)}>
					計算には入っていない
				</text>
			</g>
			<text x={700} y={440} textAnchor="middle" {...mincho(56, '#fff')} opacity={fadeIn(frame, 70)}>
				？
			</text>
		</Panel>
	);
};

// 斜面に敷き詰められた葺石と、並ぶ円筒埴輪（断面）
export const StonesAndHaniwa: React.FC = () => {
	const frame = useCurrentFrame();
	const stones = interpolate(frame, [0, 50], [0, 1], ease);
	const row = Math.round(interpolate(frame, [40, 100], [0, 14], clamp));
	return (
		<Panel fill="#1d2a3a">
			<path d="M100 520 L450 300 L950 300 L1300 520 Z" fill="#6b5a40" />
			<path d={`M100 520 L${100 + 350 * stones} ${520 - 220 * stones}`} stroke="#cfc6b4" strokeWidth={26} strokeDasharray="10 6" />
			<path d={`M1300 520 L${1300 - 350 * stones} ${520 - 220 * stones}`} stroke="#cfc6b4" strokeWidth={26} strokeDasharray="10 6" />
			{[...Array(row)].map((_, i) => (
				<rect key={i} x={470 + i * 34} y={250} width={26} height={50} rx={4} fill="#c9864f" />
			))}
			<text x={260} y={380} textAnchor="middle" {...txt(40, '#fff')} opacity={stones}>
				葺石
			</text>
			<text x={700} y={220} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				円筒埴輪
			</text>
			<text x={700} y={590} textAnchor="middle" {...txt(36, colors.muted)} opacity={fadeIn(frame, 90)}>
				3万本近く並んでいたと言われる
			</text>
		</Panel>
	);
};

// 海から見た、輝く人工の山
export const ShipView: React.FC = () => {
	const frame = useCurrentFrame();
	const glow = interpolate(frame, [0, 60], [0.2, 1], ease);
	const boat = interpolate(frame, [0, 200], [1150, 850], clamp);
	return (
		<Panel fill="#1a2c45">
			<rect y={380} width={1400} height={240} fill="#173a5c" />
			<path d="M200 380 Q 420 200 640 380 Z" fill="#d8d2c2" opacity={glow} />
			<path d="M120 380 L 280 300 L 420 300 L 560 380 Z" fill="#cfc6b4" opacity={glow * 0.9} />
			<g transform={`translate(${boat} 420)`}>
				<path d="M-70 0 L70 0 L50 30 L-50 30 Z" fill="#5a3a24" />
				<line x1={0} y1={0} x2={0} y2={-90} stroke="#5a3a24" strokeWidth={6} />
				<path d="M4 -86 L60 -40 L4 -30 Z" fill="#f4ecdc" />
			</g>
			<text x={700} y={590} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 40)}>
				大阪湾の船からも見えた？
			</text>
		</Panel>
	);
};

// ---- 第3の手がかり 仁徳天皇？ ----

// 民のかまど：煙の上がらない家々 → 3年後
export const KamadoSmoke: React.FC = () => {
	const frame = useCurrentFrame();
	const smoke = fadeIn(frame, 70, 30);
	return (
		<Panel fill="#1f2a3d">
			{[...Array(7)].map((_, i) => {
				const x = 140 + i * 180;
				return (
					<g key={i}>
						<path d={`M${x - 60} 460 L${x - 60} 380 L${x} 330 L${x + 60} 380 L${x + 60} 460 Z`} fill="#6b5236" />
						<path d={`M${x - 70} 385 L${x} 320 L${x + 70} 385`} stroke="#3f2f1e" strokeWidth={12} fill="none" />
						<path d={`M${x + 20} 320 q -20 -40 0 -80 q 20 -40 0 -80`} stroke="#ddd" strokeWidth={14} fill="none" strokeLinecap="round" opacity={smoke * 0.7} />
					</g>
				);
			})}
			<text x={700} y={560} textAnchor="middle" {...txt(44, colors.goldSoft)}>
				{smoke > 0.5 ? '3年後、煙が上がった' : 'かまどの煙が、上がっていない'}
			</text>
		</Panel>
	);
};

// 築造の順番が合わない
export const BuildOrder: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<g opacity={fadeIn(frame, 0)}>
				<Keyhole x={500} y={250} s={0.55} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={4} />
				<text x={400} y={420} textAnchor="middle" {...txt(40)}>
					父・仁徳天皇の墓
				</text>
			</g>
			<g opacity={fadeIn(frame, 20)}>
				<Keyhole x={1100} y={250} s={0.42} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={4} />
				<text x={1020} y={420} textAnchor="middle" {...txt(40)}>
					息子・履中天皇の墓
				</text>
			</g>
			<g opacity={fadeIn(frame, 50)}>
				<rect x={860} y={460} width={320} height={80} rx={16} fill={colors.correct} />
				<text x={1020} y={515} textAnchor="middle" {...txt(40, '#fff')}>
					こちらが先？
				</text>
				<rect x={240} y={460} width={320} height={80} rx={16} fill="#555" />
				<text x={400} y={515} textAnchor="middle" {...txt(40, '#fff')}>
					こちらが後？
				</text>
			</g>
		</Panel>
	);
};

// 名前が書かれたものは、見つかっていない
export const NoNameTag: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel h={480} fill="#1b140f">
			<g opacity={fadeIn(frame, 0)}>
				<rect x={450} y={80} width={500} height={300} rx={14} fill={colors.paper} />
				<text x={700} y={160} textAnchor="middle" {...txt(40, colors.clayDark)}>
					ここに眠るのは
				</text>
				<text x={700} y={300} textAnchor="middle" {...mincho(130, colors.ink)}>
					？
				</text>
			</g>
			<text x={700} y={450} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 30)}>
				名前を記したものは、見つかっていない
			</text>
		</Panel>
	);
};

// 『宋書』に記された5人の倭の王
export const FiveKings: React.FC = () => {
	const frame = useCurrentFrame();
	const kings = ['讃', '珍', '済', '興', '武'];
	return (
		<svg width={1400} height={460} viewBox="0 0 1400 460">
			{kings.map((k, i) => (
				<g key={k} transform={`translate(${60 + i * 262} 60)`} opacity={fadeIn(frame, i * 10)}>
					<rect width={230} height={260} rx={20} fill={colors.paper} />
					<text x={115} y={185} textAnchor="middle" {...mincho(140, colors.ink)}>
						{k}
					</text>
				</g>
			))}
			<g opacity={fadeIn(frame, 70)}>
				<text x={175} y={400} textAnchor="middle" {...txt(30, colors.goldSoft)}>
					応神？ 仁徳？ 履中？
				</text>
			</g>
			<text x={760} y={400} textAnchor="middle" {...txt(32, colors.muted)} opacity={fadeIn(frame, 55)}>
				5世紀、中国へ使いを送った倭の王
			</text>
		</svg>
	);
};

// 中国の記録と日本の記録が重ならない
export const TwoChronicles: React.FC = () => {
	const frame = useCurrentFrame();
	const slide = interpolate(frame, [0, 50], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<Panel h={480}>
			<g transform={`translate(${-140 * slide} 0)`}>
				<rect x={330} y={100} width={360} height={260} rx={16} fill="#e9dcc0" />
				<text x={510} y={250} textAnchor="middle" {...mincho(64, colors.ink)}>
					宋書
				</text>
			</g>
			<g transform={`translate(${140 * slide} 0)`}>
				<rect x={710} y={100} width={360} height={260} rx={16} fill="#e9dcc0" />
				<text x={890} y={250} textAnchor="middle" {...mincho(64, colors.ink)}>
					日本書紀
				</text>
			</g>
			<text x={700} y={250} textAnchor="middle" {...mincho(90, colors.correct)} opacity={fadeIn(frame, 50)}>
				≠
			</text>
			<text x={700} y={440} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				重ねても、たどり着けない
			</text>
		</Panel>
	);
};
