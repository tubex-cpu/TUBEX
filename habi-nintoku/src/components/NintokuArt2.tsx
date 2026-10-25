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

// ---- 第4の手がかり 中を見た人は？ ----

// 研究者が入れるのは、墳丘のすその通路まで
export const NoEntryLine: React.FC = () => {
	const frame = useCurrentFrame();
	const walk = interpolate(frame, [10, 90], [0, 1], clamp);
	return (
		<Panel>
			<Keyhole x={880} y={310} s={0.95} fill="#2f6f8f" strokeWidth={70} />
			<Keyhole x={880} y={310} s={0.95} fill="#3f6b2e" stroke="#e7d9a8" strokeWidth={10} />
			<g opacity={fadeIn(frame, 0)}>
				<circle cx={880 - 470 * walk} cy={310 - 150} r={14} fill={colors.goldSoft} />
			</g>
			<text x={700} y={580} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 40)}>
				入れるのは、すその通路まで
			</text>
			<g opacity={fadeIn(frame, 60)}>
				<text x={880} y={330} textAnchor="middle" {...txt(54, '#fff')} stroke="#000" strokeWidth={8} paintOrder="stroke">
					立入禁止
				</text>
			</g>
		</Panel>
	);
};

// 明治5年：前方部の中ほどから、石室と石棺が現れた
export const Meiji1872: React.FC = () => {
	const frame = useCurrentFrame();
	const open = interpolate(frame, [20, 70], [0, 1], ease);
	return (
		<Panel fill="#1b140f">
			<path d="M60 470 L300 330 L640 320 L760 300 Q 990 110 1220 300 L1340 470 Z" fill="#5c7a3a" />
			<rect x={60} y={470} width={1280} height={150} fill="#3a2a1c" />
			<g opacity={open}>
				<rect x={380} y={330} width={240} height={110} fill="#2a1d12" stroke="#bfa47a" strokeWidth={6} />
				<rect x={410} y={360} width={180} height={60} rx={10} fill="#a89474" />
			</g>
			<text x={500} y={290} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				明治5年（1872年）
			</text>
			<text x={340} y={560} textAnchor="middle" {...txt(36, colors.muted)}>
				前方部
			</text>
			<text x={1000} y={560} textAnchor="middle" {...txt(36, colors.muted)}>
				後円部
			</text>
		</Panel>
	);
};

// 竪穴式石室と長持形石棺、まわりの品々
export const ChamberFinds: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['甲と冑（金銅）', '刀', 'ガラスの壺', 'ガラスの皿'];
	return (
		<Panel>
			<g opacity={fadeIn(frame, 0)}>
				<rect x={120} y={140} width={560} height={300} fill="#2a1d12" stroke="#8a7350" strokeWidth={14} />
				<rect x={180} y={220} width={440} height={150} rx={18} fill="#b3a083" stroke="#6e5c43" strokeWidth={6} />
				<path d="M180 240 L620 240" stroke="#6e5c43" strokeWidth={6} />
				<text x={400} y={500} textAnchor="middle" {...txt(36, colors.muted)}>
					竪穴式石室と長持形石棺
				</text>
			</g>
			{items.map((t, i) => (
				<g key={t} transform={`translate(780 ${110 + i * 105})`} opacity={fadeIn(frame, 25 + i * 12)}>
					<rect width={520} height={84} rx={14} fill={colors.paper} />
					<text x={260} y={56} textAnchor="middle" {...txt(40, colors.ink)}>
						{t}
					</text>
				</g>
			))}
		</Panel>
	);
};

// ふたは開けられないまま、埋め戻された
export const LidReburied: React.FC = () => {
	const frame = useCurrentFrame();
	const soil = interpolate(frame, [30, 110], [0, 1], ease);
	return (
		<Panel fill="#1b140f">
			<rect x={330} y={240} width={740} height={220} rx={24} fill="#b3a083" stroke="#6e5c43" strokeWidth={8} />
			<rect x={310} y={210} width={780} height={60} rx={18} fill="#9b8a6e" stroke="#6e5c43" strokeWidth={8} />
			<g opacity={fadeIn(frame, 0)}>
				<text x={700} y={380} textAnchor="middle" {...mincho(90, colors.ink)}>
					？
				</text>
			</g>
			<rect x={0} y={620 - 620 * soil} width={1400} height={620 * soil} fill="#4a3522" />
			<text x={700} y={560} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={soil}>
				ふたは開けられないまま
			</text>
		</Panel>
	);
};

// 見つかったのは前方部。後円部は？
export const FrontAndBack: React.FC = () => {
	const frame = useCurrentFrame();
	const pulse = 0.6 + 0.4 * Math.sin(frame / 8);
	return (
		<Panel>
			<Keyhole x={880} y={310} s={1.05} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={6} />
			<g opacity={fadeIn(frame, 0)}>
				<rect x={480} y={270} width={110} height={80} rx={10} fill={colors.goldSoft} />
				<text x={535} y={240} textAnchor="middle" {...txt(36, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
					明治に見つかった
				</text>
			</g>
			<g opacity={fadeIn(frame, 40) * pulse}>
				<circle cx={880} cy={310} r={70} fill="none" stroke={colors.correct} strokeWidth={8} strokeDasharray="16 10" />
				<text x={880} y={335} textAnchor="middle" {...mincho(80, '#fff')}>
					？
				</text>
			</g>
			<text x={880} y={480} textAnchor="middle" {...txt(40, '#fff')} opacity={fadeIn(frame, 40)} stroke="#000" strokeWidth={6} paintOrder="stroke">
				後円部は、誰も見ていない
			</text>
		</Panel>
	);
};

// ---- 第5の手がかり ボストンへ？ ----

// 日本からボストンへ
export const ToBoston: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 90], [0, 1], ease);
	return (
		<Panel fill="#0f2238">
			<path d="M120 300 C 500 80 900 80 1280 300" stroke="#2c4d70" strokeWidth={6} fill="none" strokeDasharray="12 12" />
			<path d="M120 300 C 500 80 900 80 1280 300" stroke={colors.gold} strokeWidth={10} fill="none" pathLength={1} strokeDasharray={`${p} 1`} />
			<circle cx={120} cy={300} r={16} fill={colors.gold} />
			<circle cx={1280} cy={300} r={16} fill={colors.correct} opacity={p > 0.95 ? 1 : 0.3} />
			<text x={120} y={370} textAnchor="middle" {...txt(44)}>
				日本
			</text>
			<text x={1280} y={370} textAnchor="middle" {...txt(44)}>
				ボストン
			</text>
			<text x={700} y={520} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				なぜ、海の向こうに？
			</text>
		</Panel>
	);
};

// 「伝・仁徳天皇陵出土品」4つの品
export const BostonItems: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['銅の鏡', '刀の柄頭', '銅の鈴', '馬の飾り'];
	return (
		<svg width={1400} height={420} viewBox="0 0 1400 420">
			{items.map((t, i) => (
				<g key={t} transform={`translate(${40 + i * 340} 50)`} opacity={fadeIn(frame, i * 12)}>
					<rect width={300} height={240} rx={22} fill={colors.paper} />
					<text x={150} y={140} textAnchor="middle" {...mincho(t.length > 4 ? 48 : 58, colors.ink)}>
						{t}
					</text>
				</g>
			))}
			<text x={700} y={380} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 55)}>
				「伝・仁徳天皇陵出土品」
			</text>
		</svg>
	);
};

// 1938年の雑誌の紹介
export const Magazine1938: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel h={520} fill="#1b140f">
			<g transform="rotate(-3 700 260)" opacity={fadeIn(frame, 0)}>
				<rect x={430} y={60} width={540} height={400} rx={10} fill="#e9dcc0" />
				<text x={700} y={150} textAnchor="middle" {...mincho(56, colors.ink)}>
					考古学
				</text>
				<text x={700} y={220} textAnchor="middle" {...txt(32, colors.clayDark)}>
					1938年
				</text>
				<text x={700} y={330} textAnchor="middle" {...txt(32, colors.ink)} opacity={fadeIn(frame, 25)}>
					百舌鳥村から出土し
				</text>
				<text x={700} y={385} textAnchor="middle" {...txt(32, colors.ink)} opacity={fadeIn(frame, 35)}>
					ボストン美術館の所蔵に
				</text>
			</g>
		</Panel>
	);
};

// 噂：明治5年に誰かが持ち出した？
export const RumorCloud: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel h={480} fill="#211a2a">
			{[0, 1, 2].map((i) => (
				<ellipse key={i} cx={420 + i * 280} cy={230} rx={220} ry={130} fill="#3a3046" opacity={fadeIn(frame, i * 8) * 0.9} />
			))}
			<text x={700} y={250} textAnchor="middle" {...txt(46, '#fff')} opacity={fadeIn(frame, 20)}>
				明治5年に、誰かが持ち出した？
			</text>
			<text x={700} y={420} textAnchor="middle" {...txt(36, colors.muted)} opacity={fadeIn(frame, 40)}>
				広まった噂
			</text>
		</Panel>
	);
};

// 当時の記録：「古代の墓から出土」
export const PurchaseRecord: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel h={500} fill="#1b140f">
			<g opacity={fadeIn(frame, 0)}>
				<rect x={330} y={60} width={740} height={340} rx={10} fill="#efe6d2" />
				{[0, 1, 2, 3].map((i) => (
					<line key={i} x1={380} y1={130 + i * 70} x2={1020} y2={130 + i * 70} stroke="#c9bba0" strokeWidth={3} />
				))}
				<text x={700} y={250} textAnchor="middle" {...mincho(60, colors.ink)} opacity={fadeIn(frame, 20)}>
					「古代の墓から出土」
				</text>
			</g>
			<text x={700} y={460} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 45)}>
				仁徳天皇陵という名前は、ない？
			</text>
		</Panel>
	);
};

// 年表：明治5年 → 1906年 → 1938年 → 2010年
export const BostonTimeline: React.FC = () => (
	<Timeline
		from={1865}
		to={2020}
		ticks={[
			{at: 1872, label: '1872'},
			{at: 1906, label: '1906'},
			{at: 1938, label: '1938'},
			{at: 2010, label: '2010'},
		]}
		bars={[
			{start: 1872, end: 1873, label: '石室が現れる', color: colors.gold, row: 0, at: 0},
			{start: 1906, end: 1907, label: '天心が購入？', color: colors.goldSoft, row: 1, at: 20},
			{start: 1938, end: 1939, label: '雑誌で紹介', color: '#d8c49a', row: 2, at: 40},
			{start: 2010, end: 2011, label: '宮内庁が調査', color: colors.correct, row: 0, at: 60},
		]}
	/>
);

// 調査の結果：可能性は低い
export const LowChance: React.FC = () => {
	const frame = useCurrentFrame();
	const needle = interpolate(frame, [10, 60], [80, -60], ease);
	return (
		<Panel h={520}>
			<path d="M400 400 A 300 300 0 0 1 1000 400" stroke="#2c3a50" strokeWidth={60} fill="none" />
			<path d="M400 400 A 300 300 0 0 1 560 140" stroke={colors.wrong} strokeWidth={60} fill="none" />
			<g transform={`rotate(${needle} 700 400)`}>
				<line x1={700} y1={400} x2={700} y2={160} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
			</g>
			<circle cx={700} cy={400} r={20} fill="#fff" />
			<text x={700} y={490} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				仁徳天皇陵から出た可能性は？
			</text>
		</Panel>
	);
};

export const FiveCluesDone: React.FC = () => {
	const frame = useCurrentFrame();
	const clues = ['世界最大', '15年以上', '仁徳天皇', '中を見た人', 'ボストン'];
	return (
		<svg width={1500} height={420} viewBox="0 0 1500 420">
			{clues.map((c, i) => (
				<g key={c} transform={`translate(${30 + i * 294} 60)`} opacity={fadeIn(frame, i * 8)}>
					<rect width={264} height={280} rx={20} fill={colors.paper} />
					<text x={132} y={70} textAnchor="middle" {...txt(32, colors.clayDark)}>
						手がかり {i + 1}
					</text>
					<text x={132} y={180} textAnchor="middle" {...mincho(c.length > 4 ? 44 : 52, colors.ink)}>
						{c}
					</text>
					<path d="M90 230 l28 26 l56 -60" stroke={colors.correct} strokeWidth={12} fill="none" strokeLinecap="round" opacity={fadeIn(frame, 20 + i * 8)} />
				</g>
			))}
		</svg>
	);
};

// ---- 動き出した巨大古墳 ----

// 2018年：いちばん内側の堤を3か所掘った
export const Dig2018: React.FC = () => {
	const frame = useCurrentFrame();
	const spots: [number, number][] = [
		[450, 150],
		[1060, 230],
		[620, 505],
	];
	return (
		<Panel>
			<Keyhole x={880} y={320} s={1.0} fill="#2f6f8f" strokeWidth={90} />
			<Keyhole x={880} y={320} s={1.0} fill="#c9b27a" strokeWidth={50} />
			<Keyhole x={880} y={320} s={1.0} fill="#2f6f8f" strokeWidth={22} />
			<Keyhole x={880} y={320} s={1.0} fill="#3f6b2e" />
			{spots.map(([x, y], i) => (
				<g key={i} opacity={fadeIn(frame, 20 + i * 15)}>
					<rect x={x - 22} y={y - 14} width={44} height={28} fill={colors.correct} stroke="#fff" strokeWidth={4} />
				</g>
			))}
			<text x={700} y={600} textAnchor="middle" {...txt(36, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				いちばん内側の堤を、3か所
			</text>
		</Panel>
	);
};

// 地面の下20〜40cmに、並んだ円筒埴輪の根もと
export const HaniwaRowFound: React.FC = () => {
	const frame = useCurrentFrame();
	const dig = interpolate(frame, [0, 50], [0, 1], ease);
	return (
		<Panel fill="#1b140f">
			<rect x={60} y={150} width={1280} height={420} fill="#5a4330" />
			<rect x={60} y={150} width={1280} height={60} fill="#6b8f45" />
			<rect x={160} y={210} width={1080 * dig} height={240} fill="#3a2a1c" />
			{[...Array(5)].map((_, i) => (
				<g key={i} opacity={fadeIn(frame, 40 + i * 8)}>
					<rect x={330 + i * 160} y={330} width={120} height={120} rx={10} fill="#c9864f" stroke="#8d5a36" strokeWidth={6} />
				</g>
			))}
			<g opacity={fadeIn(frame, 30)}>
				<line x1={110} y1={210} x2={110} y2={330} stroke="#fff" strokeWidth={4} />
				<text x={110} y={120} textAnchor="middle" {...txt(32)}>
					20〜40cm
				</text>
			</g>
			<text x={700} y={530} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 80)}>
				すき間なく並んだ、埴輪の根もと
			</text>
		</Panel>
	);
};

// こぶし大の石の石敷き
export const StonePaving: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 60], [0, 60], clamp));
	return (
		<Panel h={520} fill="#3a2a1c">
			{[...Array(n)].map((_, i) => (
				<ellipse key={i} cx={140 + (i % 12) * 100 + ((Math.floor(i / 12) % 2) * 50)} cy={120 + Math.floor(i / 12) * 70} rx={42} ry={30} fill={['#bdb3a1', '#a99f8c', '#cfc6b4'][i % 3]} stroke="#6e6656" strokeWidth={3} />
			))}
			<text x={700} y={490} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				堤の上の、石敷き
			</text>
		</Panel>
	);
};

// 1973年の1本 → 2018年の列
export const OneToRow: React.FC = () => (
	<Timeline
		from={1960}
		to={2030}
		ticks={[
			{at: 1973, label: '1973'},
			{at: 2018, label: '2018'},
			{at: 2026, label: '2026'},
		]}
		bars={[
			{start: 1973, end: 1974, label: '埴輪が1本', color: colors.goldSoft, row: 0, at: 0},
			{start: 2018, end: 2019, label: '埴輪の列', color: colors.gold, row: 1, at: 25},
			{start: 2026, end: 2027, label: '土壇', color: colors.correct, row: 2, at: 50},
		]}
	/>
);

// 世界遺産：百舌鳥と古市の2つの地域、49基
export const HeritageAreas: React.FC = () => {
	const frame = useCurrentFrame();
	const dots = (cx: number, cy: number, n: number, at: number) =>
		[...Array(n)].map((_, i) => (
			<circle key={i} cx={cx + ((i * 53) % 220) - 110} cy={cy + ((i * 37) % 160) - 80} r={9} fill={colors.goldSoft} opacity={fadeIn(frame, at + i * 2)} />
		));
	return (
		<Panel fill="#203320">
			<rect x={0} y={0} width={260} height={620} fill="#173a5c" />
			<text x={130} y={330} textAnchor="middle" {...txt(36, '#9cd0f0')}>
				大阪湾
			</text>
			{dots(520, 330, 23, 0)}
			{dots(1030, 300, 26, 25)}
			<text x={520} y={480} textAnchor="middle" {...txt(48)}>
				百舌鳥
			</text>
			<text x={1030} y={450} textAnchor="middle" {...txt(48)}>
				古市
			</text>
			<text x={780} y={580} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 80)}>
				あわせて49基の古墳
			</text>
		</Panel>
	);
};

// 赤色立体図のしくみ：高い所は明るく、くぼみほど赤く暗い
export const ReliefMethod: React.FC = () => {
	const frame = useCurrentFrame();
	const scan = interpolate(frame, [0, 80], [0, 1], clamp);
	return (
		<Panel fill="#120a08">
			<defs>
				<linearGradient id="reliefGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#fff1dc" />
					<stop offset="100%" stopColor="#7a1208" />
				</linearGradient>
			</defs>
			<path d="M80 470 L300 300 L520 470 L740 220 L960 470 L1180 330 L1320 470 Z" fill="url(#reliefGrad)" />
			<line x1={80 + 1240 * scan} y1={150} x2={80 + 1240 * scan} y2={500} stroke="#9cd0f0" strokeWidth={4} />
			{[...Array(12)].map((_, i) => (
				<line key={i} x1={130 + i * 100} y1={60} x2={130 + i * 100} y2={140} stroke="#9cd0f0" strokeWidth={3} strokeDasharray="6 8" opacity={fadeIn(frame, i * 5)} />
			))}
			<text x={340} y={560} textAnchor="middle" {...txt(36, '#fff1dc')}>
				高い所は明るく
			</text>
			<text x={1060} y={560} textAnchor="middle" {...txt(36, '#ff8a6a')}>
				くぼむほど赤く暗く
			</text>
		</Panel>
	);
};

// 前方部の上に浮かび上がった、四角い土壇
export const DodanReveal: React.FC = () => {
	const frame = useCurrentFrame();
	const box = fadeIn(frame, 30, 20);
	return (
		<Panel fill="#2a0d0a">
			<Keyhole x={880} y={310} s={1.15} fill="#6e170e" stroke="#e8a07a" strokeWidth={8} />
			<Keyhole x={880} y={310} s={0.85} fill="#a8321f" />
			<Keyhole x={880} y={310} s={0.55} fill="#df7a50" />
			<g opacity={box}>
				<rect x={490} y={255} width={120} height={110} fill="#f5c79a" stroke="#fff" strokeWidth={6} />
				<text x={550} y={225} textAnchor="middle" {...txt(44, '#fff')} stroke="#000" strokeWidth={8} paintOrder="stroke">
					土壇？
				</text>
			</g>
			<text x={700} y={590} textAnchor="middle" {...txt(36, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				前方部の上に、四角い高まり
			</text>
		</Panel>
	);
};

// 前方部に土壇がある古墳では……
export const PrecedentCheck: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<g opacity={fadeIn(frame, 0)}>
				<Keyhole x={520} y={260} s={0.55} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={4} />
				<rect x={290} y={232} width={60} height={56} fill="#f5c79a" />
				<text x={430} y={460} textAnchor="middle" {...txt(36)}>
					土壇がある古墳
				</text>
			</g>
			<text x={700} y={290} textAnchor="middle" {...mincho(90, colors.goldSoft)} opacity={fadeIn(frame, 25)}>
				→
			</text>
			<g opacity={fadeIn(frame, 40)}>
				<rect x={860} y={170} width={420} height={200} rx={16} fill="#2a1d12" stroke="#bfa47a" strokeWidth={6} />
				<text x={1070} y={290} textAnchor="middle" {...txt(40, '#fff')}>
					別の埋葬施設
				</text>
				<text x={1070} y={460} textAnchor="middle" {...txt(36)}>
					が見つかった例も
				</text>
			</g>
		</Panel>
	);
};

// 応神天皇陵とされる古墳の前例
export const OjinPrecedent: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<Keyhole x={900} y={300} s={0.95} fill="#3f6b2e" stroke="#a7c97f" strokeWidth={6} />
			<g opacity={fadeIn(frame, 10)}>
				<rect x={530} y={255} width={100} height={90} fill="#f5c79a" />
			</g>
			<g opacity={fadeIn(frame, 40)}>
				<rect x={545} y={275} width={70} height={50} fill="#2a1d12" stroke="#fff" strokeWidth={4} />
				<text x={580} y={230} textAnchor="middle" {...txt(38, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
					竪穴式の石室
				</text>
			</g>
			<text x={700} y={590} textAnchor="middle" {...txt(38, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				応神天皇陵とされる古墳：昭和のはじめの調査記録
			</text>
		</Panel>
	);
};

// くずれた東西の端：土壇の正確な大きさは不明
export const ErodedEdges: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#1b140f">
			<path d="M200 460 L420 300 L980 300 L1200 460 Z" fill="#6b8f45" />
			<path d="M420 300 L470 250 L930 250 L980 300 Z" fill="#8a6a42" />
			<g opacity={fadeIn(frame, 20)}>
				<path d="M420 300 Q 430 340 380 360 L 340 360" stroke={colors.correct} strokeWidth={8} fill="none" strokeDasharray="12 8" />
				<path d="M980 300 Q 970 340 1020 360 L 1060 360" stroke={colors.correct} strokeWidth={8} fill="none" strokeDasharray="12 8" />
				<text x={300} y={420} textAnchor="middle" {...txt(36, '#fff')}>
					くずれた西側
				</text>
				<text x={1100} y={420} textAnchor="middle" {...txt(36, '#fff')}>
					くずれた東側
				</text>
			</g>
			<text x={700} y={560} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				正確な大きさは、わからない
			</text>
		</Panel>
	);
};

// ---- まだ解けていない謎 ----

// 後円部の断面：何があるのか、記録も絵もない
export const UnknownChamber: React.FC = () => {
	const frame = useCurrentFrame();
	const pulse = 0.6 + 0.4 * Math.sin(frame / 10);
	return (
		<Panel fill="#120d0a">
			<path d="M200 520 Q 700 40 1200 520 Z" fill="#3f5a2c" />
			<rect x={200} y={520} width={1000} height={100} fill="#2a1d12" />
			<g opacity={pulse}>
				<rect x={590} y={300} width={220} height={120} rx={12} fill="none" stroke={colors.goldSoft} strokeWidth={6} strokeDasharray="16 10" />
				<text x={700} y={385} textAnchor="middle" {...mincho(80, colors.goldSoft)}>
					？
				</text>
			</g>
			<text x={700} y={590} textAnchor="middle" {...txt(36, colors.muted)} opacity={fadeIn(frame, 30)}>
				後円部
			</text>
		</Panel>
	);
};

// 年代のずれ：古墳は5世紀中ごろ、前方部の石棺は5世紀後半
export const DateGap: React.FC = () => (
	<Timeline
		from={400}
		to={500}
		ticks={[
			{at: 400, label: '400年'},
			{at: 450, label: '450年'},
			{at: 500, label: '500年'},
		]}
		bars={[
			{start: 435, end: 465, label: '古墳が造られた（推定）', color: colors.gold, row: 0, at: 0},
			{start: 460, end: 495, label: '前方部の石棺（甲冑から）', color: colors.correct, row: 1, at: 30},
		]}
	/>
);
