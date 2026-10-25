import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {Timeline} from './Kit';
import {clamp, ease, fadeIn, mincho, txt} from './Maps';
import {Keyhole} from './NintokuArt1';

const Panel: React.FC<{readonly w?: number; readonly h?: number; readonly fill?: string; readonly children: React.ReactNode}> = ({w = 1400, h = 620, fill = '#16202f', children}) => (
	<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
		<rect width={w} height={h} rx={30} fill={fill} />
		{children}
	</svg>
);

// 紙のカード（題字＋本文）
const Card: React.FC<{readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly head?: string; readonly body: string; readonly size?: number; readonly at?: number}> = ({x, y, w, h, head, body, size = 56, at = 0}) => {
	const frame = useCurrentFrame();
	return (
		<g opacity={fadeIn(frame, at)}>
			<rect x={x} y={y} width={w} height={h} rx={20} fill={colors.paper} />
			{head ? (
				<text x={x + w / 2} y={y + 60} textAnchor="middle" {...txt(32, colors.clayDark)}>
					{head}
				</text>
			) : null}
			<text x={x + w / 2} y={y + h / 2 + (head ? 30 : 18)} textAnchor="middle" {...mincho(size, colors.ink)}>
				{body}
			</text>
		</g>
	);
};

// 下に添える一文
const Note: React.FC<{readonly children: string; readonly y?: number; readonly at?: number; readonly color?: string}> = ({children, y = 585, at = 40, color = colors.goldSoft}) => {
	const frame = useCurrentFrame();
	return (
		<text x={700} y={y} textAnchor="middle" {...txt(40, color)} opacity={fadeIn(frame, at)}>
			{children}
		</text>
	);
};

// ---- 古墳の時代の堺：須恵器 ----

// 野焼きの土器と、窯で焼く須恵器
export const SueVsHaji: React.FC = () => {
	const frame = useCurrentFrame();
	const flame = 0.8 + 0.2 * Math.sin(frame / 4);
	return (
		<Panel>
			<g opacity={fadeIn(frame, 0)}>
				<path d="M260 380 q -90 -10 -90 -110 q 0 -70 90 -80 q 90 10 90 80 q 0 100 -90 110 Z" fill="#c9864f" />
				{[0, 1, 2, 3, 4].map((i) => (
					<path key={i} d={`M${160 + i * 50} 470 q 15 -50 0 -80 q 20 25 25 80 Z`} fill="#f0a830" opacity={flame} />
				))}
				<text x={260} y={545} textAnchor="middle" {...txt(36, '#fff')}>
					野原で焼く、やわらかい土器
				</text>
			</g>
			<g opacity={fadeIn(frame, 30)}>
				<path d="M800 470 L1300 260 L1300 470 Z" fill="#4a3a2a" />
				<path d="M860 455 Q 1050 360 1240 300" stroke="#e8662b" strokeWidth={46} fill="none" strokeLinecap="round" opacity={flame} />
				<path d="M1010 330 q -45 -5 -45 -55 q 0 -35 45 -40 q 45 5 45 40 q 0 50 -45 55 Z" fill="#6f7377" />
				<text x={1050} y={545} textAnchor="middle" {...txt(36, '#fff')}>
					窯で焼く、硬い須恵器
				</text>
			</g>
			<text x={1050} y={210} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				1000度を超える
			</text>
		</Panel>
	);
};

// 斜面に掘ったトンネルのような窯（断面）
export const KilnSection: React.FC = () => {
	const frame = useCurrentFrame();
	const fire = interpolate(frame, [0, 60], [0, 1], ease);
	return (
		<Panel fill="#1b140f">
			<path d="M0 560 L1400 160 L1400 620 L0 620 Z" fill="#5a4330" />
			<path d="M250 500 L1150 245" stroke="#2a1d12" strokeWidth={90} strokeLinecap="round" />
			<path d="M250 500 L1150 245" stroke="#e8662b" strokeWidth={60} strokeLinecap="round" opacity={fire * 0.85} strokeDasharray={`${1000 * fire} 2000`} />
			{[0, 1, 2, 3].map((i) => (
				<rect key={i} x={560 + i * 110} y={360 - i * 32} width={50} height={50} rx={10} fill="#6f7377" opacity={fadeIn(frame, 30 + i * 8)} />
			))}
			<text x={210} y={600} {...txt(34, '#fff')}>
				たき口
			</text>
			<text x={1180} y={210} {...txt(34, '#fff')}>
				煙出し
			</text>
			<Note y={110} at={50}>
				山の斜面に掘った「窯」
			</Note>
		</Panel>
	);
};

// 仁徳天皇陵の南に広がる陶邑の窯跡
export const SuemuraMap: React.FC = () => {
	const frame = useCurrentFrame();
	const dots = [...Array(60)].map((_, i) => [520 + Math.sin(i * 12.99) * 330, 400 + Math.cos(i * 78.23) * 120]);
	return (
		<Panel fill="#203320">
			<rect width={170} height={620} rx={30} fill="#173a5c" />
			<text x={85} y={320} textAnchor="middle" {...txt(30, '#9cd0f0')}>
				大阪湾
			</text>
			<Keyhole x={460} y={110} s={0.2} fill="#6b8f45" stroke="#fff" strokeWidth={3} />
			<text x={560} y={120} {...txt(36, '#fff')}>
				仁徳天皇陵
			</text>
			{dots.map(([x, y], i) => (
				<circle key={i} cx={x + 200} cy={y} r={9} fill="#e8662b" opacity={fadeIn(frame, 10 + i)} />
			))}
			<text x={720} y={590} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				陶邑窯跡群：500基を超える窯の跡
			</text>
		</Panel>
	);
};

// 5世紀から10世紀まで、およそ500年
export const KilnYears: React.FC = () => (
	<Timeline
		from={300}
		to={1100}
		ticks={[
			{at: 400, label: '5世紀'},
			{at: 600, label: '7世紀'},
			{at: 800, label: '9世紀'},
			{at: 1000, label: '11世紀'},
		]}
		bars={[
			{start: 380, end: 470, label: '仁徳天皇陵', color: colors.correct, row: 0, at: 0},
			{start: 400, end: 1000, label: '陶邑の窯が燃え続けた', color: colors.gold, row: 1, at: 20},
		]}
	/>
);

// 2025年、枚方市で見つかった窯（堺の陶邑と同じころ）
export const Hirakata2025: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#203320">
			<rect width={220} height={620} rx={30} fill="#173a5c" />
			<circle cx={760} cy={170} r={22} fill={colors.correct} opacity={fadeIn(frame, 10)} />
			<text x={800} y={180} {...txt(44, '#fff')} opacity={fadeIn(frame, 10)}>
				枚方市（2025年）
			</text>
			<circle cx={520} cy={470} r={22} fill={colors.gold} opacity={fadeIn(frame, 30)} />
			<text x={560} y={480} {...txt(44, '#fff')} opacity={fadeIn(frame, 30)}>
				堺市・陶邑
			</text>
			<Note at={60}>初期の須恵器の窯は、全国で十数か所だけ</Note>
		</Panel>
	);
};

// 古墳づくりを支えた人々
export const Workforce: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['土を盛る人', '埴輪を焼く人', '鉄の道具を作る人', '全体を設計する人'];
	return (
		<svg width={1400} height={420} viewBox="0 0 1400 420">
			{items.map((t, i) => (
				<g key={t} transform={`translate(${30 + i * 340} 40)`} opacity={fadeIn(frame, i * 14)}>
					<rect width={310} height={300} rx={24} fill="rgba(5,9,18,0.85)" stroke={colors.gold} strokeWidth={4} />
					<circle cx={155} cy={110} r={40} fill={colors.paper} />
					<rect x={115} y={160} width={80} height={60} rx={18} fill={colors.clay} />
					<text x={155} y={275} textAnchor="middle" {...txt(t.length > 6 ? 30 : 36, '#fff')}>
						{t}
					</text>
				</g>
			))}
		</svg>
	);
};

// ---- 埴輪は身代わり？ ----

// 『日本書紀』の物語
export const HaniwaLegend: React.FC = () => {
	const frame = useCurrentFrame();
	const lines = ['皇后が亡くなる', '殉死をやめたい', '野見宿禰の進言', '土で人や馬の形を'];
	return (
		<Panel fill="#1b140f">
			<rect x={250} y={50} width={900} height={440} rx={14} fill="#efe6d2" />
			{lines.map((l, i) => (
				<text key={l} x={1060 - i * 200} y={120} {...mincho(52, colors.ink)} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, i * 15)}>
					{l}
				</text>
			))}
			<Note y={570} at={70}>
				日本書紀の「埴輪の始まり」
			</Note>
		</Panel>
	);
};

// 埴輪が現れた順番
export const HaniwaOrder: React.FC = () => (
	<Timeline
		from={230}
		to={530}
		ticks={[
			{at: 250, label: '3世紀'},
			{at: 350, label: '4世紀'},
			{at: 450, label: '5世紀'},
		]}
		bars={[
			{start: 270, end: 520, label: '円筒埴輪', color: colors.gold, row: 0, at: 0},
			{start: 350, end: 520, label: '家・盾・よろいの埴輪', color: colors.goldSoft, row: 1, at: 25},
			{start: 430, end: 520, label: '人の形の埴輪', color: colors.correct, row: 2, at: 50},
		]}
	/>
);

// 特殊器台から円筒埴輪へ
export const KidaiToHaniwa: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<g opacity={fadeIn(frame, 0)}>
				<path d="M300 200 q -70 0 -70 -60 q 70 -40 140 0 q 0 60 -70 60 Z" fill="#b8693f" />
				<path d="M240 210 L360 210 L390 470 L210 470 Z" fill="#c9864f" />
				{[0, 1, 2].map((i) => (
					<line key={i} x1={225 + i * 0} y1={280 + i * 60} x2={375} y2={280 + i * 60} stroke="#8d5a36" strokeWidth={6} />
				))}
				<text x={300} y={540} textAnchor="middle" {...txt(36, '#fff')}>
					特殊器台（吉備・弥生時代）
				</text>
			</g>
			<text x={700} y={360} textAnchor="middle" {...mincho(90, colors.goldSoft)} opacity={fadeIn(frame, 25)}>
				→
			</text>
			<g opacity={fadeIn(frame, 40)}>
				<rect x={1000} y={200} width={140} height={270} rx={14} fill="#c9864f" />
				{[0, 1, 2].map((i) => (
					<line key={i} x1={1000} y1={270 + i * 65} x2={1140} y2={270 + i * 65} stroke="#8d5a36" strokeWidth={6} />
				))}
				<text x={1070} y={540} textAnchor="middle" {...txt(36, '#fff')}>
					円筒埴輪
				</text>
			</g>
		</Panel>
	);
};

// 聖なる場所を区切る垣根
export const HaniwaFence: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 70], [0, 48], clamp));
	return (
		<Panel fill="#1d2a3a">
			<ellipse cx={700} cy={320} rx={300} ry={190} fill="#4d7a3a" />
			{[...Array(n)].map((_, i) => {
				const a = (i / 48) * Math.PI * 2;
				return <rect key={i} x={700 + Math.cos(a) * 360 - 10} y={320 + Math.sin(a) * 240 - 22} width={20} height={44} rx={4} fill="#c9864f" />;
			})}
			<text x={700} y={335} textAnchor="middle" {...txt(40, '#fff')} opacity={fadeIn(frame, 60)}>
				王が眠る場所
			</text>
		</Panel>
	);
};

// 仁徳天皇陵から見つかった埴輪
export const NintokuHaniwa: React.FC = () => {
	const items = ['円筒', '女性の頭', '水鳥', '馬', '鹿', '家'];
	return (
		<svg width={1400} height={400} viewBox="0 0 1400 400">
			{items.map((t, i) => (
				<Card key={t} x={30 + i * 228} y={60} w={208} h={240} body={t} size={t.length > 3 ? 40 : 56} at={i * 10} />
			))}
		</svg>
	);
};

// ---- 陪塚 ----

// 巨大古墳のまわりの小さな古墳
export const BaichoMap: React.FC = () => {
	const frame = useCurrentFrame();
	const spots: [number, number, number][] = [
		[300, 140, 26], [260, 470, 22], [1130, 120, 28], [1180, 470, 24], [700, 560, 20], [520, 60, 18], [960, 560, 22], [180, 300, 20], [1240, 300, 24], [850, 60, 18], [400, 560, 20], [1060, 40, 16],
	];
	return (
		<Panel fill="#203320">
			<Keyhole x={840} y={310} s={0.8} fill="#2f6f8f" strokeWidth={70} />
			<Keyhole x={840} y={310} s={0.8} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={4} />
			{spots.map(([x, y, r], i) => (
				<circle key={i} cx={x} cy={y} r={r} fill="#6b8f45" stroke={colors.goldSoft} strokeWidth={4} opacity={fadeIn(frame, 10 + i * 5)} />
			))}
			<Note y={600} at={70}>
				宮内庁が管理する陪塚は、十数基
			</Note>
		</Panel>
	);
};

// 塚廻古墳の出土品
export const TsukamawariFinds: React.FC = () => (
	<svg width={1400} height={400} viewBox="0 0 1400 400">
		<Card x={40} y={50} w={420} h={260} head="舟の形の" body="木の棺" at={0} />
		<Card x={490} y={50} w={420} h={260} head="銅の鏡" body="2面" at={15} />
		<Card x={940} y={50} w={420} h={260} head="刀・剣と" body="たくさんの玉" size={48} at={30} />
	</svg>
);

// 永山古墳：王の墓より先に造られた「陪塚」？
export const NagayamaOrder: React.FC = () => (
	<Timeline
		from={400}
		to={480}
		ticks={[
			{at: 400, label: '400年'},
			{at: 440, label: '440年'},
			{at: 480, label: '480年'},
		]}
		bars={[
			{start: 415, end: 440, label: '永山古墳（先？）', color: colors.correct, row: 0, at: 0},
			{start: 435, end: 465, label: '仁徳天皇陵（推定）', color: colors.gold, row: 1, at: 25},
		]}
	/>
);

// ---- 寿陵 ----

// 『日本書紀』の仁徳67年から87年まで
export const ShokiTwentyYears: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [20, 90], [0, 1], ease);
	return (
		<Panel h={480}>
			<line x1={150} y1={250} x2={1250} y2={250} stroke="#fff" strokeWidth={4} />
			<circle cx={200} cy={250} r={18} fill={colors.gold} />
			<text x={200} y={200} textAnchor="middle" {...txt(36)}>
				67年：墓の場所を定める
			</text>
			<rect x={200} y={235} width={1000 * p} height={30} fill={colors.gold} opacity={0.6} />
			<circle cx={1200} cy={250} r={18} fill={colors.correct} opacity={p} />
			<text x={1200} y={320} textAnchor="middle" {...txt(36)} opacity={p}>
				87年：葬られる
			</text>
			<text x={700} y={420} textAnchor="middle" {...mincho(80, colors.goldSoft)} opacity={fadeIn(frame, 90)}>
				20年
			</text>
		</Panel>
	);
};

// 試算の15年8か月と、日本書紀の20年
export const FifteenVsTwenty: React.FC = () => {
	const frame = useCurrentFrame();
	const a = interpolate(frame, [10, 60], [0, 1], ease);
	const b = interpolate(frame, [30, 80], [0, 1], ease);
	return (
		<Panel h={460}>
			<text x={420} y={170} textAnchor="end" {...txt(40)}>
				大林組の試算
			</text>
			<rect x={450} y={120} width={(15.67 / 20) * 800 * a} height={80} rx={14} fill={colors.goldSoft} />
			<text x={470} y={175} {...txt(40, colors.ink)} opacity={a}>
				15年8か月
			</text>
			<text x={420} y={330} textAnchor="end" {...txt(40)}>
				日本書紀
			</text>
			<rect x={450} y={280} width={800 * b} height={80} rx={14} fill={colors.gold} />
			<text x={470} y={335} {...txt(40, colors.ink)} opacity={b}>
				20年
			</text>
		</Panel>
	);
};

// 在位87年？
export const Reign87: React.FC = () => {
	const frame = useCurrentFrame();
	const v = Math.round(interpolate(frame, [0, 60], [0, 87], ease));
	return (
		<Panel h={460}>
			<text x={700} y={120} textAnchor="middle" {...txt(40, colors.muted)}>
				日本書紀に書かれた在位
			</text>
			<text x={700} y={320} textAnchor="middle" {...mincho(200, colors.goldSoft)}>
				{v}
				<tspan {...txt(80)}>年</tspan>
			</text>
			<Note y={420} at={70}>
				そのまま事実とは考えにくい
			</Note>
		</Panel>
	);
};

// ---- 倭の五王 ----

// 5世紀の東アジア
export const EastAsia5th: React.FC = () => {
	const frame = useCurrentFrame();
	const pins: [number, number, string, number][] = [
		[300, 380, '宋（南京）', 0],
		[700, 120, '高句麗', 15],
		[650, 320, '百済', 25],
		[800, 300, '新羅', 30],
		[730, 400, '加羅', 35],
		[1050, 380, '倭', 45],
	];
	return (
		<Panel fill="#173a5c">
			<path d="M0 0 L520 0 L560 200 L480 620 L0 620 Z" fill="#a89a74" />
			<path d="M560 0 L860 0 L840 200 L800 420 L680 440 L620 300 L640 150 Z" fill="#a89a74" />
			<path d="M920 520 L1050 430 L1200 330 L1330 240 L1380 280 L1240 400 L1080 520 L960 580 Z" fill="#a89a74" />
			{pins.map(([x, y, l, at]) => (
				<g key={l} opacity={fadeIn(frame, at)}>
					<circle cx={x} cy={y} r={14} fill={l === '倭' ? colors.correct : colors.gold} stroke="#000" strokeWidth={3} />
					<text x={x} y={y - 26} textAnchor="middle" {...txt(40, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
						{l}
					</text>
				</g>
			))}
		</Panel>
	);
};

// 倭の五王の使い
export const KingsTimeline: React.FC = () => (
	<Timeline
		from={410}
		to={490}
		ticks={[
			{at: 421, label: '421'},
			{at: 438, label: '438'},
			{at: 451, label: '451'},
			{at: 462, label: '462'},
			{at: 478, label: '478'},
		]}
		bars={[
			{start: 421, end: 426, label: '讃', color: colors.gold, row: 0, at: 0},
			{start: 438, end: 440, label: '珍', color: colors.goldSoft, row: 1, at: 12},
			{start: 443, end: 452, label: '済', color: '#d8c49a', row: 2, at: 24},
			{start: 462, end: 464, label: '興', color: colors.goldSoft, row: 1, at: 36},
			{start: 478, end: 480, label: '武', color: colors.correct, row: 0, at: 48},
		]}
	/>
);

// 武の手紙
export const BuLetter: React.FC = () => {
	const frame = useCurrentFrame();
	const lines = ['東は五十五国', '西は六十六国', '海北は九十五国'];
	return (
		<Panel fill="#1b140f">
			<rect x={300} y={50} width={800} height={440} rx={14} fill="#efe6d2" />
			{lines.map((l, i) => (
				<text key={l} x={960 - i * 230} y={110} {...mincho(56, colors.ink)} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, 10 + i * 20)}>
					{l}
				</text>
			))}
			<Note y={570} at={70}>
				478年、倭王武の手紙
			</Note>
		</Panel>
	);
};

// 求めた位と、認められた位
export const TitleCompare: React.FC = () => (
	<svg width={1400} height={420} viewBox="0 0 1400 420">
		<Card x={60} y={50} w={600} h={280} head="武が名乗った" body="7つの国の将軍" size={52} at={0} />
		<Card x={740} y={50} w={600} h={280} head="宋が認めた" body="6つの国（百済なし）" size={44} at={25} />
	</svg>
);

// ---- 天皇陵の名前 ----

// 『延喜式』の記録
export const EngishikiCard: React.FC = () => {
	const frame = useCurrentFrame();
	const lines = ['百舌鳥耳原中陵', '兆域 東西八町', '南北八町', '陵戸 五烟'];
	return (
		<Panel fill="#1b140f">
			<rect x={300} y={40} width={800} height={460} rx={14} fill="#efe6d2" />
			{lines.map((l, i) => (
				<text key={l} x={1000 - i * 170} y={90} {...mincho(i === 0 ? 60 : 50, colors.ink)} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, i * 15)}>
					{l}
				</text>
			))}
			<Note y={575} at={70}>
				延喜式（927年完成）
			</Note>
		</Panel>
	);
};

// 八町四方（およそ900m四方）と古墳
export const EightChoSquare: React.FC = () => {
	const frame = useCurrentFrame();
	const sq = interpolate(frame, [20, 60], [0, 1], ease);
	return (
		<Panel fill="#203320">
			<rect x={700 - 260 * sq} y={310 - 260 * sq} width={520 * sq} height={520 * sq} fill="none" stroke={colors.goldSoft} strokeWidth={6} strokeDasharray="20 12" />
			<Keyhole x={790} y={310} s={0.5} fill="#2f6f8f" strokeWidth={40} />
			<Keyhole x={790} y={310} s={0.5} fill="#3f6b2e" />
			<text x={700} y={40} textAnchor="middle" {...txt(36, colors.goldSoft)} opacity={sq}>
				およそ900メートル四方
			</text>
		</Panel>
	);
};

// 北・中・南の三つの陵
export const NorthMidSouth: React.FC = () => {
	const frame = useCurrentFrame();
	const rows: [number, number, string, number][] = [
		[700, 120, '北：反正天皇陵', 0.25],
		[700, 320, '中：仁徳天皇陵', 0.5],
		[700, 520, '南：履中天皇陵', 0.38],
	];
	return (
		<Panel fill="#203320">
			{rows.map(([x, y, l, s], i) => (
				<g key={l} opacity={fadeIn(frame, i * 15)}>
					<Keyhole x={x - 150} y={y} s={s} fill={i === 1 ? '#6b8f45' : '#4d7a3a'} stroke="#a7c97f" strokeWidth={3} />
					<text x={x + 60} y={y + 14} {...txt(40, i === 1 ? colors.goldSoft : '#fff')}>
						{l}
					</text>
				</g>
			))}
		</Panel>
	);
};

// 天皇陵の調べ直しの歴史
export const RyoboSurveys: React.FC = () => (
	<Timeline
		from={1680}
		to={1880}
		ticks={[
			{at: 1700, label: '1700'},
			{at: 1750, label: '1750'},
			{at: 1800, label: '1800'},
			{at: 1850, label: '1850'},
		]}
		bars={[
			{start: 1696, end: 1700, label: '元禄の調査', color: colors.gold, row: 0, at: 0},
			{start: 1796, end: 1797, label: '和泉名所図会', color: colors.goldSoft, row: 1, at: 20},
			{start: 1862, end: 1866, label: '文久の修陵', color: colors.correct, row: 0, at: 40},
			{start: 1864, end: 1865, label: '拝所が築かれる', color: '#d8c49a', row: 2, at: 55},
		]}
	/>
);

// 宮内庁が管理する陵墓の数
export const RyoboCount: React.FC = () => (
	<svg width={1400} height={420} viewBox="0 0 1400 420">
		<Card x={40} y={50} w={420} h={280} head="天皇などの陵" body="188" size={110} at={0} />
		<Card x={490} y={50} w={420} h={280} head="陵墓などの合計" body="899" size={110} at={15} />
		<Card x={940} y={50} w={420} h={280} head="場所にすると" body="460か所" size={80} at={30} />
	</svg>
);

// ---- 明治5年 ----

// 発見のきっかけ：2つの説
export const TwoTheories: React.FC = () => (
	<svg width={1400} height={420} viewBox="0 0 1400 420">
		<Card x={60} y={50} w={600} h={280} head="説その1" body="雨風で斜面がくずれた" size={44} at={0} />
		<Card x={740} y={50} w={600} h={280} head="説その2" body="わざと掘った？" size={52} at={25} />
	</svg>
);

// 明治5年、同じ年に来日したガウランド
export const Gowland1872: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#0f2238">
			<path d="M120 320 C 500 120 900 120 1280 320" stroke={colors.gold} strokeWidth={8} fill="none" pathLength={1} strokeDasharray={`${interpolate(frame, [0, 60], [0, 1], ease)} 1`} />
			<text x={120} y={390} textAnchor="middle" {...txt(40)}>
				イギリス
			</text>
			<text x={1280} y={390} textAnchor="middle" {...txt(40)}>
				大阪
			</text>
			<Note y={540} at={50}>
				1872年、同じ年に
			</Note>
		</Panel>
	);
};

// ---- 明治の宝 ----

// 包み紙の墨書き
export const WrapperNote: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#1b140f">
			<g transform="rotate(-2 700 280)">
				<rect x={380} y={50} width={640} height={440} rx={8} fill="#e9dcc0" />
				<text x={860} y={100} {...mincho(64, colors.ink)} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, 10)}>
					明治五年九月
				</text>
				<text x={660} y={100} {...mincho(64, colors.ink)} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, 40)}>
					仁徳帝御陵出ル所
				</text>
			</g>
		</Panel>
	);
};

// 金銅装の小刀（長さ10.6cm）
export const KnifeDiagram: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<rect x={250} y={260} width={900} height={90} rx={40} fill="#c9a24a" stroke="#7d6232" strokeWidth={6} />
			{[0, 1, 2, 3, 4].map((i) => (
				<circle key={i} cx={360 + i * 170} cy={305} r={12} fill="#e8eef2" opacity={fadeIn(frame, 30 + i * 6)} />
			))}
			<line x1={250} y1={420} x2={1150} y2={420} stroke="#fff" strokeWidth={4} opacity={fadeIn(frame, 10)} />
			<text x={700} y={470} textAnchor="middle" {...txt(44)} opacity={fadeIn(frame, 10)}>
				長さ 10.6cm
			</text>
			<text x={330} y={220} {...txt(34, colors.goldSoft)} opacity={fadeIn(frame, 20)}>
				ヒノキのさやに金銅の板
			</text>
			<text x={850} y={220} {...txt(34, '#e8eef2')} opacity={fadeIn(frame, 40)}>
				銀のびょう
			</text>
		</Panel>
	);
};

// 宝がたどった道
export const TreasurePath: React.FC = () => {
	const frame = useCurrentFrame();
	const steps = ['1872 柏木貨一郎', '美術商', '2024 國學院大學', '2025 発表'];
	return (
		<svg width={1400} height={360} viewBox="0 0 1400 360">
			{steps.map((t, i) => (
				<g key={t} opacity={fadeIn(frame, i * 18)}>
					<rect x={30 + i * 345} y={100} width={300} height={140} rx={20} fill={i === 3 ? colors.correct : colors.paper} />
					<text x={180 + i * 345} y={185} textAnchor="middle" {...txt(32, i === 3 ? '#fff' : colors.ink)}>
						{t}
					</text>
					{i < 3 ? (
						<text x={345 + i * 345} y={190} textAnchor="middle" {...txt(44, colors.goldSoft)}>
							→
						</text>
					) : null}
				</g>
			))}
		</svg>
	);
};

// ---- 天皇陵への立ち入り ----

export const EntryTimeline: React.FC = () => (
	<Timeline
		from={2000}
		to={2030}
		ticks={[
			{at: 2008, label: '2008'},
			{at: 2011, label: '2011'},
			{at: 2025, label: '2025'},
		]}
		bars={[
			{start: 2008, end: 2009, label: '五社神古墳', color: colors.goldSoft, row: 0, at: 0},
			{start: 2011, end: 2012, label: '応神天皇陵とされる古墳', color: colors.gold, row: 1, at: 20},
			{start: 2025, end: 2026, label: '仁徳天皇陵', color: colors.correct, row: 2, at: 40},
		]}
	/>
);

// いちばん下の段まで
export const LowestTier: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#120d0a">
			<path d="M100 520 L1300 520 L1200 440 L200 440 Z" fill={colors.goldSoft} opacity={0.4 + 0.6 * fadeIn(frame, 20)} />
			<path d="M200 440 L1200 440 L1100 360 L300 360 Z" fill="#4d7a3a" />
			<path d="M300 360 L1100 360 L1000 280 L400 280 Z" fill="#3f6b2e" />
			<text x={700} y={500} textAnchor="middle" {...txt(36, colors.ink)} opacity={fadeIn(frame, 20)}>
				入れるのは、ここまで
			</text>
			<text x={700} y={240} textAnchor="middle" {...txt(36, colors.muted)}>
				頂上には登れない
			</text>
		</Panel>
	);
};

// ボートで濠を渡る（およそ70メートル）
export const BoatCrossing: React.FC = () => {
	const frame = useCurrentFrame();
	const x = interpolate(frame, [10, 120], [220, 1000], ease);
	return (
		<Panel fill="#203320">
			<rect x={200} y={180} width={900} height={260} fill="#2f6f8f" />
			<rect x={1100} y={120} width={200} height={380} fill="#3f6b2e" />
			<g transform={`translate(${x} 310)`}>
				<path d="M-70 0 L70 0 L50 30 L-50 30 Z" fill="#e8e1d0" />
				<circle cx={-20} cy={-14} r={12} fill="#f4ecdc" />
				<circle cx={20} cy={-14} r={12} fill="#f4ecdc" />
			</g>
			<text x={650} y={500} textAnchor="middle" {...txt(40, colors.goldSoft)}>
				濠の幅 およそ70メートル
			</text>
		</Panel>
	);
};

// ---- 消えた古墳 ----

// 100基以上 → 44基
export const KofunCount: React.FC = () => {
	const frame = useCurrentFrame();
	const gone = interpolate(frame, [40, 110], [0, 1], clamp);
	return (
		<Panel fill="#203320">
			{[...Array(100)].map((_, i) => {
				const lost = i >= 44 && (i - 44) / 56 < gone;
				return <circle key={i} cx={130 + (i % 20) * 60} cy={110 + Math.floor(i / 20) * 80} r={20} fill={lost ? 'none' : '#6b8f45'} stroke={lost ? '#555' : '#a7c97f'} strokeWidth={3} strokeDasharray={lost ? '6 6' : undefined} />;
			})}
			<text x={700} y={560} textAnchor="middle" {...txt(44, colors.goldSoft)}>
				{gone > 0.5 ? '残っているのは 44基' : 'もとは100基を超える古墳'}
			</text>
		</Panel>
	);
};

// 古墳が消えていった年表
export const LostTimeline: React.FC = () => (
	<Timeline
		from={1940}
		to={1995}
		ticks={[
			{at: 1945, label: '1945'},
			{at: 1956, label: '1956'},
			{at: 1987, label: '1987'},
		]}
		bars={[
			{start: 1946, end: 1954, label: '大塚山古墳が削られる', color: colors.wrong, row: 0, at: 0},
			{start: 1953, end: 1958, label: '多くの古墳が消える', color: colors.wrong, row: 1, at: 20},
			{start: 1956, end: 1957, label: 'いたすけ古墳が史跡に', color: colors.correct, row: 2, at: 40},
			{start: 1987, end: 1988, label: '一本松古墳', color: colors.wrong, row: 0, at: 60},
		]}
	/>
);

// 署名と募金
export const SaveCampaign: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 80], [0, 40], clamp));
	return (
		<Panel fill="#2a2418">
			{[...Array(n)].map((_, i) => (
				<g key={i} transform={`translate(${170 + (i % 10) * 110} ${130 + Math.floor(i / 10) * 95})`}>
					<rect x={-35} y={-40} width={70} height={80} rx={6} fill={colors.paper} />
					<line x1={-22} y1={-10} x2={22} y2={-10} stroke="#555" strokeWidth={4} />
					<line x1={-22} y1={10} x2={12} y2={10} stroke="#555" strokeWidth={4} />
				</g>
			))}
			<Note y={590} at={60}>
				古墳を守る会：署名と募金
			</Note>
		</Panel>
	);
};

// ---- 今の姿 ----

// 濠の水：25mプール約700杯分
export const MoatVolume: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 80], [0, 140], clamp));
	return (
		<Panel fill="#0f2238">
			{[...Array(n)].map((_, i) => (
				<rect key={i} x={110 + (i % 20) * 60} y={90 + Math.floor(i / 20) * 50} width={48} height={30} rx={4} fill="#4aa3d8" />
			))}
			<Note y={500} at={20}>
				およそ34万立方メートル
			</Note>
			<Note y={560} at={50} color="#9cd0f0">
				25メートルプール およそ700杯分（1つは5杯分）
			</Note>
		</Panel>
	);
};

// 水の下に続く墳丘と、たまった泥
export const UnderwaterSkirt: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#0f1a26">
			<rect x={0} y={260} width={1400} height={360} fill="#1f5a7a" opacity={0.8} />
			<path d="M200 620 L520 130 L1400 130 L1400 620 Z" fill="#5c7a3a" />
			<path d="M0 520 L1400 520 L1400 620 L0 620 Z" fill="#4a3a22" opacity={fadeIn(frame, 30)} />
			<path d="M200 620 L330 420" stroke={colors.goldSoft} strokeWidth={8} strokeDasharray="14 10" opacity={fadeIn(frame, 15)} />
			<text x={330} y={250} {...txt(36, '#fff')}>
				水面
			</text>
			<text x={120} y={500} {...txt(32, colors.goldSoft)} opacity={fadeIn(frame, 15)}>
				水の下にも続く墳丘
			</text>
			<text x={700} y={590} textAnchor="middle" {...txt(32, '#d8c49a')} opacity={fadeIn(frame, 40)}>
				たまった泥
			</text>
		</Panel>
	);
};

// 芦ヶ池から濠へ水を送る
export const WaterSupply: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 70], [0, 1], ease);
	return (
		<Panel fill="#203320">
			<ellipse cx={250} cy={320} rx={150} ry={90} fill="#2f6f8f" />
			<text x={250} y={450} textAnchor="middle" {...txt(36)}>
				芦ヶ池の井戸
			</text>
			<path d="M400 320 L800 320" stroke="#4aa3d8" strokeWidth={20} pathLength={1} strokeDasharray={`${p} 1`} />
			<Keyhole x={1110} y={320} s={0.5} fill="#2f6f8f" strokeWidth={40} />
			<Keyhole x={1110} y={320} s={0.5} fill="#3f6b2e" />
			<text x={1020} y={520} textAnchor="middle" {...txt(36)}>
				仁徳天皇陵の濠
			</text>
		</Panel>
	);
};

// ---- 本当の物語：2021年の調査 ----

export const Dig2021: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#1b140f">
			<rect x={100} y={250} width={1200} height={120} fill="#6b8f45" />
			{[...Array(10)].map((_, i) => (
				<rect key={i} x={140 + i * 115} y={270} width={60} height={80} fill={colors.correct} stroke="#fff" strokeWidth={3} opacity={fadeIn(frame, i * 5)} />
			))}
			<text x={700} y={200} textAnchor="middle" {...txt(36, '#9cd0f0')}>
				堤の内側にも、埴輪の列
			</text>
			<Note y={480} at={55}>
				2021年：堤の10か所を掘る
			</Note>
		</Panel>
	);
};

// ---- まだ解けていない謎 ----

// 明治の石室と、2026年の土壇は同じもの？
export const SameOrNot: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<Keyhole x={900} y={310} s={1.0} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={5} />
			<g opacity={fadeIn(frame, 0)}>
				<rect x={520} y={280} width={90} height={60} fill={colors.goldSoft} />
				<text x={565} y={260} textAnchor="middle" {...txt(32, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
					明治の石室
				</text>
			</g>
			<g opacity={fadeIn(frame, 25)}>
				<rect x={460} y={220} width={210} height={180} fill="none" stroke={colors.correct} strokeWidth={6} strokeDasharray="14 8" />
				<text x={565} y={440} textAnchor="middle" {...txt(32, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
					2026年の土壇
				</text>
			</g>
			<Note y={590} at={50}>
				同じもの？ それとも、別のもの？
			</Note>
		</Panel>
	);
};

// ボストンの宝は、どこの古墳から？
export const WhichTomb: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#203320">
			{[...Array(9)].map((_, i) => (
				<g key={i} opacity={fadeIn(frame, i * 6)}>
					<Keyhole x={260 + (i % 3) * 420} y={130 + Math.floor(i / 3) * 170} s={0.18} fill="#4d7a3a" stroke="#a7c97f" strokeWidth={3} />
					<text x={260 + (i % 3) * 420} y={150 + Math.floor(i / 3) * 170} textAnchor="middle" {...mincho(44, colors.goldSoft)}>
						？
					</text>
				</g>
			))}
		</Panel>
	);
};

// ---- 世界遺産 ----

// 緩衝地帯の高さの決まり（15m）と大屋根リング（約20m）
export const BufferZone: React.FC = () => {
	const frame = useCurrentFrame();
	const ring = interpolate(frame, [30, 80], [0, 1], ease);
	const ground = 500;
	const k = 14;
	return (
		<Panel fill="#1d2a3a">
			<line x1={80} y1={ground} x2={1320} y2={ground} stroke="#fff" strokeWidth={4} />
			<line x1={80} y1={ground - 15 * k} x2={1320} y2={ground - 15 * k} stroke={colors.goldSoft} strokeWidth={4} strokeDasharray="16 10" />
			<text x={100} y={ground - 15 * k - 16} {...txt(34, colors.goldSoft)}>
				建物は原則15メートル以内
			</text>
			<rect x={760} y={ground - 20 * k * ring} width={420} height={20 * k * ring} fill="#a0784a" stroke="#6b4b2a" strokeWidth={6} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<line key={i} x1={760 + i * 84} y1={ground} x2={760 + i * 84} y2={ground - 20 * k * ring} stroke="#6b4b2a" strokeWidth={6} />
			))}
			<text x={970} y={ground - 20 * k * ring - 20} textAnchor="middle" {...txt(36)} opacity={ring}>
				大屋根リング 最大およそ20メートル
			</text>
			<path d="M120 500 Q 330 330 540 500 Z" fill="#3f6b2e" />
			<text x={330} y={560} textAnchor="middle" {...txt(32, colors.muted)}>
				古墳
			</text>
		</Panel>
	);
};

// 須恵器の技術は、朝鮮半島から海を渡ってきた
export const TechRoute: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 80], [0, 1], ease);
	return (
		<Panel fill="#173a5c">
			<path d="M120 0 L460 0 L470 260 L380 420 L250 440 L180 300 Z" fill="#a89a74" />
			<path d="M640 600 L800 470 L1000 380 L1220 280 L1380 220 L1400 620 Z" fill="#a89a74" />
			<path d="M330 400 C 500 520 700 520 900 450" stroke={colors.gold} strokeWidth={12} fill="none" pathLength={1} strokeDasharray={`${p} 1`} />
			<text x={300} y={200} textAnchor="middle" {...txt(40, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
				朝鮮半島
			</text>
			<text x={980} y={530} textAnchor="middle" {...txt(40, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
				堺
			</text>
			<Note y={120} at={60}>
				5世紀のはじめごろ、海を越えて
			</Note>
		</Panel>
	);
};

// 2025年6月の発表
export const News2025: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#1b140f">
			<g opacity={fadeIn(frame, 0)}>
				<rect x={260} y={60} width={880} height={420} rx={10} fill="#efe6d2" />
				<rect x={260} y={60} width={880} height={90} rx={10} fill={colors.correct} />
				<text x={700} y={122} textAnchor="middle" {...txt(48, '#fff')}>
					2025年6月 発表
				</text>
				<text x={700} y={270} textAnchor="middle" {...mincho(60, colors.ink)} opacity={fadeIn(frame, 20)}>
					仁徳天皇陵の副葬品
				</text>
				<text x={700} y={380} textAnchor="middle" {...mincho(60, colors.correct)} opacity={fadeIn(frame, 40)}>
					実物を確認
				</text>
			</g>
		</Panel>
	);
};
