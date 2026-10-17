import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {BaseMap, clamp, ease, fadeIn, mincho, Person, Pin, places, txt} from './YamataiMaps';

// 年表の帯（start〜end年を左右に並べる）
const Timeline: React.FC<{
	readonly from: number;
	readonly to: number;
	readonly bars: readonly {start: number; end: number; label: string; color: string; row: number; at: number}[];
	readonly ticks: readonly number[];
}> = ({from, to, bars, ticks}) => {
	const frame = useCurrentFrame();
	const x = (y: number) => 120 + ((y - from) / (to - from)) * 1160;
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<rect width={1400} height={560} rx={30} fill="rgba(5,9,18,0.75)" />
			<line x1={100} y1={440} x2={1300} y2={440} stroke="#fff" strokeWidth={4} />
			{ticks.map((t) => (
				<g key={t}>
					<line x1={x(t)} y1={430} x2={x(t)} y2={450} stroke="#fff" strokeWidth={4} />
					<text x={x(t)} y={500} textAnchor="middle" {...txt(40, colors.muted)}>
						{t}年
					</text>
				</g>
			))}
			{bars.map((b) => {
				const p = interpolate(frame, [b.at, b.at + 30], [0, 1], ease);
				const w = Math.max(14, x(b.end) - x(b.start));
				return (
					<g key={b.label} opacity={fadeIn(frame, b.at)}>
						<rect x={x(b.start)} y={80 + b.row * 120} width={w * p} height={70} rx={12} fill={b.color} />
						<text x={Math.min(1250, Math.max(150, x(b.start) + w / 2))} y={80 + b.row * 120 - 14} textAnchor="middle" {...txt(44)}>
							{b.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
};

// ---- 第3の手がかり 志賀島の金印 ----

// 純金、一辺2センチあまり、108グラム、ヘビの持ち手
export const SealSpec: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 40], [0, 1], ease);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<g transform={`translate(420 330) scale(${0.6 + 0.4 * p})`}>
				<rect x={-160} y={-20} width={320} height={190} rx={8} fill="#d9a53a" stroke="#8a6a2a" strokeWidth={6} />
				<path d="M-110 -20 C -110 -150 0 -110 0 -60 C 0 -20 110 -60 110 -140" fill="none" stroke="#e8bd52" strokeWidth={40} strokeLinecap="round" />
				<circle cx={110} cy={-150} r={30} fill="#e8bd52" />
			</g>
			{[
				['一辺', '2.3cm あまり'],
				['重さ', 'およそ 108g'],
				['持ち手', 'ヘビの形'],
			].map(([k, v], i) => (
				<g key={k} opacity={fadeIn(frame, 30 + i * 18)}>
					<text x={760} y={190 + i * 130} {...txt(40, colors.muted)}>
						{k}
					</text>
					<text x={760} y={245 + i * 130} {...txt(56, colors.goldSoft)}>
						{v}
					</text>
				</g>
			))}
		</svg>
	);
};

// 「漢」か「魏」か
export const HanVsWei: React.FC = () => {
	const frame = useCurrentFrame();
	const hl = fadeIn(frame, 40, 15);
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			<g>
				<rect x={150} y={60} width={420} height={420} rx={20} fill="#d9a53a" stroke={colors.correct} strokeWidth={hl * 14} />
				<text x={360} y={340} textAnchor="middle" {...mincho(230, '#6b4e1c')}>
					漢
				</text>
				<text x={360} y={540} textAnchor="middle" {...txt(44)}>
					金印に刻まれた字
				</text>
			</g>
			<g opacity={fadeIn(frame, 15)}>
				<rect x={730} y={60} width={420} height={420} rx={20} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="20 14" />
				<text x={940} y={340} textAnchor="middle" {...mincho(230, '#ffffff66')}>
					魏
				</text>
				<text x={940} y={540} textAnchor="middle" {...txt(44)}>
					卑弥呼の時代の国
				</text>
			</g>
			<text x={650} y={300} textAnchor="middle" {...txt(90, colors.correct)} opacity={hl}>
				≠
			</text>
		</svg>
	);
};

// 偽物の疑い
export const ForgeryDoubt: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1200} height={560} viewBox="0 0 1200 560">
			<rect x={420} y={180} width={360} height={220} rx={10} fill="#d9a53a" stroke="#8a6a2a" strokeWidth={6} />
			<text x={600} y={330} textAnchor="middle" {...mincho(110, '#6b4e1c')}>
				漢委
			</text>
			{[
				[250, 140, -12],
				[930, 200, 10],
				[300, 460, 8],
				[880, 470, -8],
			].map(([x, y, r], i) => (
				<g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${interpolate(frame, [10 + i * 12, 18 + i * 12], [1.6, 1], clamp)})`} opacity={fadeIn(frame, 10 + i * 12, 6)}>
					<rect x={-120} y={-50} width={240} height={100} rx={10} fill="none" stroke={colors.correct} strokeWidth={8} />
					<text y={22} textAnchor="middle" {...txt(56, colors.correct)}>
						偽物？
					</text>
				</g>
			))}
		</svg>
	);
};

// 一辺2.347センチ ＝ 漢の1寸
export const OneSun: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 60], [0, 1], ease);
	return (
		<svg width={1300} height={520} viewBox="0 0 1300 520">
			<rect x={200} y={120} width={900} height={110} fill="#e8d9b0" />
			{[...Array(11)].map((_, i) => (
				<line key={i} x1={200 + i * 90} y1={120} x2={200 + i * 90} y2={i % 5 === 0 ? 200 : 170} stroke="#2b2116" strokeWidth={4} />
			))}
			<text x={650} y={95} textAnchor="middle" {...txt(44)}>
				漢の物差し「1寸」
			</text>
			<rect x={200} y={270} width={900 * p} height={110} rx={6} fill="#d9a53a" />
			<text x={650} y={345} textAnchor="middle" {...txt(56, '#3b2a10')} opacity={fadeIn(frame, 50)}>
				金印の一辺 2.347cm
			</text>
			<text x={650} y={470} textAnchor="middle" {...txt(48, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				ほぼ、ぴったり
			</text>
		</svg>
	);
};

// 西暦57年と239年
export const Gap180: React.FC = () => (
	<Timeline
		from={0}
		to={300}
		ticks={[0, 57, 239, 300]}
		bars={[
			{start: 57, end: 57, label: '57年 奴国の金印', color: colors.gold, row: 0, at: 0},
			{start: 239, end: 239, label: '239年 卑弥呼の使い', color: colors.correct, row: 1, at: 20},
			{start: 57, end: 239, label: '180年以上', color: '#5b6b8a', row: 2, at: 45},
		]}
	/>
);

// 奴国は今の福岡市のあたり
export const NaKokuMap: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<BaseMap>
			<Pin at={places.shikanoshima} label="志賀島" color={colors.gold} pulse show={fadeIn(frame, 0)} dx={110} dy={-10} />
			<Pin at={places.na} label="奴国（福岡市のあたり）" color={colors.correct} show={fadeIn(frame, 25)} dx={210} dy={50} />
		</BaseMap>
	);
};

// 「親魏倭王」の金印は未発見
export const MissingSeal: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			<g opacity={0.5}>
				<rect x={180} y={180} width={320} height={260} rx={10} fill="#d9a53a" />
				<text x={340} y={500} textAnchor="middle" {...txt(36)}>
					志賀島の金印（漢）
				</text>
			</g>
			<g opacity={fadeIn(frame, 15)}>
				<rect x={780} y={180} width={320} height={260} rx={10} fill="none" stroke={colors.goldSoft} strokeWidth={6} strokeDasharray="18 12" />
				<text x={940} y={300} textAnchor="middle" {...mincho(72, colors.goldSoft)}>
					親魏
				</text>
				<text x={940} y={390} textAnchor="middle" {...mincho(72, colors.goldSoft)}>
					倭王
				</text>
				<text x={940} y={500} textAnchor="middle" {...txt(36)}>
					卑弥呼の金印（魏）
				</text>
			</g>
			<text x={940} y={130} textAnchor="middle" {...txt(48, colors.correct)} opacity={fadeIn(frame, 40)}>
				まだ、どこにもない
			</text>
		</svg>
	);
};

// 2026年2月19日と20日
export const TwoDates: React.FC = () => {
	const frame = useCurrentFrame();
	const day = (x: number, d: string, place: string, at: number) => (
		<g opacity={fadeIn(frame, at)}>
			<rect x={x} y={60} width={420} height={420} rx={24} fill="#f4ecdc" />
			<rect x={x} y={60} width={420} height={100} rx={24} fill={colors.correct} />
			<text x={x + 210} y={130} textAnchor="middle" {...txt(48)}>
				2026年2月
			</text>
			<text x={x + 210} y={340} textAnchor="middle" {...mincho(200, colors.ink)}>
				{d}
			</text>
			<text x={x + 210} y={440} textAnchor="middle" {...txt(44, colors.clayDark)}>
				{place}
			</text>
		</g>
	);
	return (
		<svg width={1200} height={540} viewBox="0 0 1200 540">
			{day(110, '19', '奈良', 0)}
			{day(670, '20', '佐賀', 20)}
		</svg>
	);
};

// ---- 第4の手がかり 吉野ヶ里の謎のエリア ----

// 二重の堀に囲まれたムラ
export const MoatVillage: React.FC = () => {
	const frame = useCurrentFrame();
	const p1 = interpolate(frame, [0, 50], [0, 1], ease);
	const p2 = interpolate(frame, [30, 80], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#56703f" />
			<path d="M260 310 C 260 120 1040 100 1050 300 C 1060 520 260 520 260 310 Z" fill="none" stroke="#2c4a6b" strokeWidth={26} pathLength={1} strokeDasharray={`${p1} 1`} />
			<path d="M360 310 C 380 190 920 180 940 300 C 950 430 360 440 360 310 Z" fill="none" stroke="#2c4a6b" strokeWidth={20} pathLength={1} strokeDasharray={`${p2} 1`} />
			{[...Array(14)].map((_, i) => (
				<g key={i} opacity={fadeIn(frame, 60 + i * 3)} transform={`translate(${430 + (i % 7) * 70} ${260 + Math.floor(i / 7) * 90})`}>
					<path d="M-26 0 L0 -32 L26 0 Z" fill="#8d6a3e" />
				</g>
			))}
			<g opacity={fadeIn(frame, 90)}>
				<rect x={890} y={150} width={20} height={110} fill="#5a3a24" />
				<rect x={870} y={130} width={60} height={30} fill="#3b2214" />
				<text x={900} y={110} textAnchor="middle" {...txt(32, '#fff')}>
					物見やぐら
				</text>
			</g>
		</svg>
	);
};

// 調べられなかった「謎のエリア」
export const MysteryArea: React.FC = () => {
	const frame = useCurrentFrame();
	const dug = interpolate(frame, [0, 60], [0, 1], clamp);
	const cells = [...Array(48)].map((_, i) => [i % 8, Math.floor(i / 8)] as const);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#3c4f2c" />
			{cells.map(([c, r]) => {
				const isMystery = c >= 5 && r <= 2;
				return (
					<rect
						key={`${c}-${r}`}
						x={180 + c * 120}
						y={60 + r * 85}
						width={112}
						height={78}
						fill={isMystery ? '#2b2b2b' : '#b08a58'}
						opacity={isMystery ? 1 : interpolate(dug, [(c + r) / 14, (c + r) / 14 + 0.1], [0.15, 1], clamp)}
					/>
				);
			})}
			<g opacity={fadeIn(frame, 60)}>
				<rect x={780} y={60} width={352} height={248} fill="none" stroke={colors.goldSoft} strokeWidth={8} strokeDasharray="20 12" />
				<path d="M910 150 L1000 150 L990 130 L920 130 Z" fill="#c0392b" />
				<rect x={925} y={150} width={60} height={50} fill="#7d3b2b" />
				<text x={956} y={270} textAnchor="middle" {...txt(44, colors.goldSoft)}>
					謎のエリア
				</text>
			</g>
		</svg>
	);
};

// ふたが閉じたままの石の棺
export const StoneCoffin: React.FC = () => {
	const frame = useCurrentFrame();
	const lift = interpolate(frame, [70, 110], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#6b5a44" />
			<rect x={250} y={260} width={800} height={200} rx={10} fill="#8a8578" />
			<g transform={`translate(${lift * 120} ${-lift * 120}) rotate(${lift * -6} 650 240)`}>
				<rect x={240} y={180} width={820} height={100} rx={12} fill="#9e9a8c" stroke="#5e5a50" strokeWidth={5} />
				{[0, 1, 2].map((i) => (
					<g key={i} opacity={fadeIn(frame, 20 + i * 12)}>
						<line x1={360 + i * 260} y1={195} x2={460 + i * 260} y2={265} stroke="#3e3a32" strokeWidth={6} />
						<line x1={460 + i * 260} y1={195} x2={360 + i * 260} y2={265} stroke="#3e3a32" strokeWidth={6} />
					</g>
				))}
			</g>
			<text x={650} y={540} textAnchor="middle" {...txt(44, '#fff')}>
				ふたに刻まれた、ばつ印のような線
			</text>
		</svg>
	);
};

// 棺の中：赤い顔料、副葬品なし
export const CoffinInside: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect x={200} y={80} width={900} height={320} rx={14} fill="#8a8578" />
			<rect x={240} y={115} width={820} height={250} rx={8} fill="#b8412e" opacity={fadeIn(frame, 0, 30)} />
			<g opacity={fadeIn(frame, 50)}>
				{[
					['鏡', 380],
					['剣', 650],
					['玉', 920],
				].map(([n, x]) => (
					<g key={n} transform={`translate(${x} 500)`}>
						<circle r={60} fill="rgba(244,236,220,0.15)" stroke="#f4ecdc" strokeWidth={4} />
						<text y={20} textAnchor="middle" {...txt(56)}>
							{n}
						</text>
						<line x1={-50} y1={-50} x2={50} y2={50} stroke={colors.wrong} strokeWidth={12} strokeLinecap="round" />
					</g>
				))}
			</g>
		</svg>
	);
};

// 四角い溝で囲まれた「方形周溝墓」
export const SquareDitch: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [20, 80], [0, 1], ease);
	return (
		<svg width={1200} height={620} viewBox="0 0 1200 620">
			<rect width={1200} height={620} rx={30} fill="#7a6247" />
			<rect x={330} y={110} width={540} height={400} fill="none" stroke="#3c2c1c" strokeWidth={50} pathLength={1} strokeDasharray={`${p} 1`} />
			<rect x={520} y={260} width={160} height={90} rx={6} fill="#9e9a8c" stroke="#5e5a50" strokeWidth={4} />
			<text x={600} y={580} textAnchor="middle" {...txt(48, colors.goldSoft)} opacity={fadeIn(frame, 80)}>
				方形周溝墓
			</text>
			<text x={600} y={235} textAnchor="middle" {...txt(30, '#fff')}>
				石の棺
			</text>
		</svg>
	);
};

// 同じような四角い溝が、もうひとつ
export const SecondDitch: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#7a6247" />
			<rect x={120} y={150} width={380} height={300} fill="none" stroke="#3c2c1c" strokeWidth={36} />
			<rect x={250} y={270} width={120} height={60} fill="#9e9a8c" />
			<rect x={600} y={150} width={380} height={300} fill="none" stroke="#3c2c1c" strokeWidth={36} opacity={fadeIn(frame, 15, 20)} />
			<text x={790} y={320} textAnchor="middle" {...mincho(120, colors.goldSoft)} opacity={fadeIn(frame, 35)}>
				？
			</text>
			<rect x={1050} y={150} width={200} height={300} fill="none" stroke="#3c2c1c" strokeWidth={10} strokeDasharray="20 16" opacity={fadeIn(frame, 60)} />
			<text x={1150} y={510} textAnchor="middle" {...txt(30, '#fff')} opacity={fadeIn(frame, 60)}>
				さらに並ぶ？
			</text>
		</svg>
	);
};

// 弥生時代の終わり〜古墳時代の初めと、卑弥呼の時代
export const EraOverlap: React.FC = () => (
	<Timeline
		from={100}
		to={350}
		ticks={[100, 200, 250, 300, 350]}
		bars={[
			{start: 100, end: 250, label: '弥生時代の終わり', color: '#7fa35b', row: 0, at: 0},
			{start: 250, end: 350, label: '古墳時代の初め', color: '#8d5a36', row: 0.95, at: 15},
			{start: 189, end: 248, label: '卑弥呼の時代', color: colors.correct, row: 2, at: 40},
		]}
	/>
);

// 特別公開の来場者数
export const VisitorCounter: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 70], [0, 1626], ease));
	return (
		<svg width={1300} height={520} viewBox="0 0 1300 520">
			<rect width={1300} height={520} rx={30} fill="rgba(5,9,18,0.75)" />
			{[...Array(Math.floor(n / 40))].map((_, i) => (
				<Person key={i} x={90 + (i % 20) * 58} y={130 + Math.floor(i / 20) * 70} s={0.45} color="#b9a98c" />
			))}
			<text x={650} y={400} textAnchor="middle" {...mincho(150, colors.goldSoft)}>
				{n.toLocaleString('ja-JP')}人
			</text>
			<text x={650} y={480} textAnchor="middle" {...txt(40, colors.muted)}>
				特別公開の3日間
			</text>
		</svg>
	);
};

// ---- 第5の手がかり 箸墓古墳 ----

// 卑弥呼の墓：直径「百余歩」、100人あまりが一緒に
export const HimikoTomb: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#1a1f33" />
			<ellipse cx={650} cy={330} rx={360} ry={140} fill="#5b7340" opacity={fadeIn(frame, 0, 20)} />
			<ellipse cx={650} cy={300} rx={300} ry={110} fill="#6f8a4c" opacity={fadeIn(frame, 0, 20)} />
			<text x={650} y={325} textAnchor="middle" {...mincho(80, '#fff')} opacity={fadeIn(frame, 20)}>
				径 百余歩
			</text>
			{[...Array(24)].map((_, i) => (
				<g key={i} opacity={fadeIn(frame, 40 + i * 2, 6)}>
					<Person x={300 + (i % 12) * 64} y={590 - Math.floor(i / 12) * 60} s={0.7} color="#b9a98c" />
				</g>
			))}
			<text x={650} y={120} textAnchor="middle" {...txt(48, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				100人あまりが、ともに葬られた
			</text>
		</svg>
	);
};

// 百余歩 ≒ およそ150メートル
export const PacesToMeters: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [20, 70], [0, 150], ease));
	return (
		<svg width={1300} height={520} viewBox="0 0 1300 520">
			<text x={330} y={290} textAnchor="middle" {...mincho(130, colors.text)}>
				百余歩
			</text>
			<text x={650} y={290} textAnchor="middle" {...txt(100, colors.gold)}>
				≒
			</text>
			<text x={980} y={290} textAnchor="middle" {...mincho(150, colors.goldSoft)}>
				{n}m
			</text>
			<text x={650} y={460} textAnchor="middle" {...txt(40, colors.muted)}>
				当時の長さに直すと
			</text>
		</svg>
	);
};

// 前方後円墳の丸い部分＝直径およそ150メートル
export const KeyholeOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	const ring = interpolate(frame, [30, 70], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#2c4a6b" />
			<path d="M380 310 m -180 0 a 180 180 0 1 0 360 0 a 180 180 0 1 0 -360 0 M540 230 L1110 150 L1110 470 L540 390 Z" fill="#4f6b3a" />
			<circle cx={380} cy={310} r={180} fill="none" stroke={colors.goldSoft} strokeWidth={10} pathLength={1} strokeDasharray={`${ring} 1`} />
			<line x1={200} y1={540} x2={560} y2={540} stroke="#fff" strokeWidth={5} opacity={ring} />
			<text x={380} y={600} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={ring}>
				直径 およそ150m
			</text>
			<line x1={200} y1={60} x2={1110} y2={60} stroke="#fff" strokeWidth={4} opacity={fadeIn(frame, 0)} />
			<text x={655} y={45} textAnchor="middle" {...txt(36)}>
				全長 およそ280m
			</text>
		</svg>
	);
};

// 2009年の年代測定：240〜260年ごろ
export const HashihakaDating: React.FC = () => (
	<Timeline
		from={180}
		to={320}
		ticks={[200, 240, 260, 300]}
		bars={[
			{start: 240, end: 260, label: '箸墓古墳がつくられた（2009年発表）', color: colors.gold, row: 0, at: 0},
			{start: 247, end: 250, label: '卑弥呼が亡くなる', color: colors.correct, row: 1.6, at: 35},
		]}
	/>
);

// 2800個近いモモの種と、その年代
export const PeachDating: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 60], [0, 2765], ease));
	return (
		<svg width={1300} height={580} viewBox="0 0 1300 580">
			<rect width={1300} height={580} rx={30} fill="rgba(5,9,18,0.75)" />
			{[...Array(Math.floor(n / 25))].map((_, i) => (
				<ellipse key={i} cx={80 + (i % 22) * 26} cy={100 + Math.floor(i / 22) * 30} rx={10} ry={13} fill="#a8703f" stroke="#5a3a24" strokeWidth={2} />
			))}
			<text x={950} y={170} textAnchor="middle" {...txt(44, colors.muted)}>
				モモの種
			</text>
			<text x={950} y={290} textAnchor="middle" {...mincho(110, colors.goldSoft)}>
				約{n.toLocaleString('ja-JP')}個
			</text>
			<g opacity={fadeIn(frame, 70)}>
				<rect x={700} y={380} width={500} height={110} rx={16} fill={colors.correct} />
				<text x={950} y={455} textAnchor="middle" {...txt(48)}>
					西暦135〜230年ごろ
				</text>
			</g>
		</svg>
	);
};

// 堀の中に見つかった「渡り土堤」
export const Watarido: React.FC = () => {
	const frame = useCurrentFrame();
	const show = fadeIn(frame, 30, 20);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#56703f" />
			<rect y={200} width={1300} height={220} fill="#2c4a6b" />
			<rect y={0} width={1300} height={200} fill="#4f6b3a" />
			<text x={650} y={110} textAnchor="middle" {...txt(44, '#fff')}>
				古墳
			</text>
			<text x={650} y={530} textAnchor="middle" {...txt(36, '#fff')}>
				外側
			</text>
			<g opacity={show}>
				<path d="M560 200 L740 200 L760 420 L540 420 Z" fill="#a8885a" stroke={colors.goldSoft} strokeWidth={6} />
				<text x={650} y={320} textAnchor="middle" {...txt(40, '#2b2116')}>
					渡り土堤
				</text>
				<line x1={540} y1={450} x2={760} y2={450} stroke="#fff" strokeWidth={4} />
				<text x={900} y={462} {...txt(40, colors.goldSoft)}>
					長さ 約6.4m
				</text>
			</g>
			<text x={200} y={320} textAnchor="middle" {...txt(40, '#cfe0f0')}>
				堀
			</text>
		</svg>
	);
};

// 水に囲まれた、海に浮かぶ島のような古墳
export const ImmortalIsland: React.FC = () => {
	const frame = useCurrentFrame();
	const water = interpolate(frame, [0, 60], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#1a2744" />
			<ellipse cx={650} cy={360} rx={560 * water} ry={220 * water} fill="#2c5d8a" />
			{[...Array(6)].map((_, i) => (
				<path key={i} d={`M${200 + i * 160} ${330 + (i % 2) * 120} q 30 -14 60 0 t 60 0`} stroke="#7fb0d9" strokeWidth={4} fill="none" opacity={water} />
			))}
			<path d="M520 360 m -110 0 a 110 80 0 1 0 220 0 a 110 80 0 1 0 -220 0 M610 320 L860 290 L860 430 L610 400 Z" fill="#4f6b3a" />
			<g opacity={fadeIn(frame, 60)}>
				{[...Array(3)].map((_, i) => (
					<ellipse key={i} cx={420 + i * 200} cy={120 - (i % 2) * 20} rx={120} ry={30} fill="#f4ecdc" opacity={0.25} />
				))}
				<text x={650} y={80} textAnchor="middle" {...txt(44, colors.goldSoft)}>
					仙人が住む、不老不死の島
				</text>
			</g>
		</svg>
	);
};

// 中国からは見つからない三角縁神獣鏡
export const NotInChina: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [10, 60], [0, 500], ease));
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			<rect x={100} y={60} width={500} height={380} rx={24} fill="#3a2a3a" />
			<text x={350} y={150} textAnchor="middle" {...txt(48)}>
				中国
			</text>
			<text x={350} y={340} textAnchor="middle" {...mincho(170, colors.wrong)} opacity={fadeIn(frame, 60)}>
				0枚
			</text>
			<rect x={700} y={60} width={500} height={380} rx={24} fill="#3a3322" />
			<text x={950} y={150} textAnchor="middle" {...txt(48)}>
				日本
			</text>
			<text x={950} y={340} textAnchor="middle" {...mincho(150, colors.goldSoft)}>
				{n}枚超
			</text>
			<text x={650} y={520} textAnchor="middle" {...txt(40, colors.muted)}>
				三角縁神獣鏡が見つかった数
			</text>
		</svg>
	);
};

// 昼は人がつくり、夜は神がつくった
export const DayNight: React.FC = () => {
	const frame = useCurrentFrame();
	const night = interpolate(frame, [50, 80], [0, 1], clamp);
	const mound = interpolate(frame, [0, 140], [0.3, 1], clamp);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill={night > 0.5 ? '#0b1222' : '#7fb0d9'} />
			{night > 0.5 ? <circle cx={1050} cy={130} r={60} fill="#f4ecdc" /> : <circle cx={1050} cy={130} r={70} fill="#ffd98a" />}
			<rect y={460} width={1300} height={140} fill={night > 0.5 ? '#1d2a1a' : '#6f8a4c'} />
			<ellipse cx={650} cy={460} rx={300} ry={160 * mound} fill={night > 0.5 ? '#2c3a22' : '#4f6b3a'} />
			{night > 0.5
				? [...Array(5)].map((_, i) => <circle key={i} cx={420 + i * 110} cy={300 - (i % 2) * 60} r={18} fill={colors.goldSoft} opacity={0.6 + 0.4 * Math.sin(frame / 5 + i)} />)
				: [...Array(6)].map((_, i) => <Person key={i} x={300 + i * 140} y={520} s={0.8} color="#3b2a16" />)}
			<text x={150} y={110} {...txt(56, night > 0.5 ? colors.goldSoft : '#1b1712')}>
				{night > 0.5 ? '夜は、神が' : '昼は、人が'}
			</text>
		</svg>
	);
};

// 「9割、畿内」のメーター
export const NinetyMeter: React.FC = () => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [10, 70], [0, 0.9], ease);
	const a = Math.PI * (1 - v);
	return (
		<svg width={1200} height={560} viewBox="0 0 1200 560">
			<path d="M200 460 A 400 400 0 0 1 1000 460" fill="none" stroke="#2b3550" strokeWidth={60} />
			<path d="M200 460 A 400 400 0 0 1 1000 460" fill="none" stroke={colors.correct} strokeWidth={60} pathLength={1} strokeDasharray={`${v} 1`} />
			<line x1={600} y1={460} x2={600 + Math.cos(a) * 330} y2={460 - Math.sin(a) * 330} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
			<circle cx={600} cy={460} r={24} fill="#fff" />
			<text x={600} y={380} textAnchor="middle" {...mincho(120, colors.goldSoft)}>
				{Math.round(v * 10)}割
			</text>
			<text x={160} y={530} {...txt(40, colors.muted)}>
				九州
			</text>
			<text x={1040} y={530} textAnchor="end" {...txt(40, colors.muted)}>
				畿内
			</text>
		</svg>
	);
};

// 中を掘ることができない
export const LockedTomb: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#1a1f33" />
			<ellipse cx={650} cy={420} rx={420} ry={170} fill="#4f6b3a" />
			{[...Array(15)].map((_, i) => (
				<rect key={i} x={160 + i * 70} y={430} width={14} height={110} fill="#c9c2b0" opacity={fadeIn(frame, i * 3, 8)} />
			))}
			<rect x={150} y={460} width={1000} height={14} fill="#c9c2b0" opacity={fadeIn(frame, 40)} />
			<g opacity={fadeIn(frame, 55)}>
				<rect x={430} y={90} width={440} height={130} rx={18} fill="rgba(5,9,18,0.9)" stroke={colors.correct} strokeWidth={6} />
				<text x={650} y={175} textAnchor="middle" {...txt(56, colors.correct)}>
					発掘できない
				</text>
			</g>
		</svg>
	);
};

// 年代はもっと新しい？ 帯が右へずれる
export const DatingDebate: React.FC = () => {
	const frame = useCurrentFrame();
	const shift = interpolate(frame, [30, 80], [0, 1], ease);
	const x = (y: number) => 120 + ((y - 200) / 150) * 1160;
	return (
		<svg width={1400} height={520} viewBox="0 0 1400 520">
			<rect width={1400} height={520} rx={30} fill="rgba(5,9,18,0.75)" />
			<line x1={100} y1={400} x2={1300} y2={400} stroke="#fff" strokeWidth={4} />
			{[200, 250, 300, 350].map((t) => (
				<text key={t} x={x(t)} y={460} textAnchor="middle" {...txt(34, colors.muted)}>
					{t}年
				</text>
			))}
			<rect x={x(240)} y={130} width={x(260) - x(240)} height={80} rx={12} fill={colors.gold} />
			<text x={x(250)} y={110} textAnchor="middle" {...txt(36)}>
				2009年の発表
			</text>
			<g opacity={fadeIn(frame, 25)}>
				<rect x={x(240) + shift * (x(290) - x(240))} y={260} width={x(260) - x(240) + 60} height={80} rx={12} fill="none" stroke={colors.goldSoft} strokeWidth={6} strokeDasharray="16 10" />
				<text x={x(275) + shift * 60} y={245} textAnchor="middle" {...txt(36, colors.goldSoft)}>
					もっと新しい？
				</text>
			</g>
		</svg>
	);
};

// 5つの手がかりを全てたどった
export const FiveCluesDone: React.FC = () => {
	const frame = useCurrentFrame();
	const clues = ['卑弥呼', '道のり', '金印', '吉野ヶ里', '箸墓'];
	return (
		<svg width={1500} height={420} viewBox="0 0 1500 420">
			{clues.map((c, i) => (
				<g key={c} transform={`translate(${30 + i * 294} 60)`} opacity={fadeIn(frame, i * 8)}>
					<rect width={264} height={280} rx={20} fill={colors.paper} />
					<text x={132} y={70} textAnchor="middle" {...txt(32, colors.clayDark)}>
						手がかり {i + 1}
					</text>
					<text x={132} y={180} textAnchor="middle" {...mincho(56, colors.ink)}>
						{c}
					</text>
					<path d="M90 230 l28 26 l56 -60" stroke={colors.correct} strokeWidth={12} fill="none" strokeLinecap="round" opacity={fadeIn(frame, 20 + i * 8)} />
				</g>
			))}
		</svg>
	);
};

// ---- 本当の物語 ----

// 日本書紀に書き写された魏志
export const ShokiQuote: React.FC = () => {
	const frame = useCurrentFrame();
	const lines = ['魏志云', '明帝景初三年六月', '倭女王遣大夫難斗米等'];
	return (
		<svg width={1200} height={600} viewBox="0 0 1200 600">
			<rect x={150} y={30} width={900} height={540} rx={12} fill="#efe2c4" />
			{lines.map((l, i) => (
				<text key={l} x={900 - i * 180} y={80} {...mincho(56, '#2b2116')} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, i * 25, 20)}>
					{l}
				</text>
			))}
			<rect x={850} y={60} width={110} height={220} fill="none" stroke={colors.correct} strokeWidth={6} opacity={fadeIn(frame, 80)} />
		</svg>
	);
};

// 1300年続く謎解き
export const Timeline1300: React.FC = () => (
	<Timeline
		from={200}
		to={2100}
		ticks={[239, 720, 1700, 2026]}
		bars={[
			{start: 239, end: 248, label: '卑弥呼', color: colors.correct, row: 0, at: 0},
			{start: 720, end: 2026, label: '謎解きが続く 1300年', color: colors.gold, row: 1.2, at: 20},
		]}
	/>
);

// 争いを終わらせた女王
export const PeaceQueen: React.FC = () => {
	const frame = useCurrentFrame();
	const calm = interpolate(frame, [40, 80], [0, 1], ease);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#1a1f33" />
			{[...Array(8)].map((_, i) => {
				const a = (i / 8) * Math.PI * 2;
				const shake = (1 - calm) * Math.sin(frame / 2 + i) * 10;
				return (
					<g key={i} transform={`translate(${650 + Math.cos(a) * 420 + shake} ${310 + Math.sin(a) * 200})`}>
						<line x1={-30} y1={-80} x2={30} y2={0} stroke="#999" strokeWidth={6} opacity={1 - calm} />
						<Person x={0} y={20} s={0.8} color={calm > 0.5 ? '#cfc4ad' : colors.correct} />
					</g>
				);
			})}
			<g opacity={calm}>
				<circle cx={650} cy={280} r={100} fill={colors.gold} opacity={0.25} />
				<Person x={650} y={340} s={1.5} woman color={colors.goldSoft} />
			</g>
		</svg>
	);
};

// 男の王が立つと争い、13歳の壱与で落ち着く
export const IyoStory: React.FC = () => {
	const frame = useCurrentFrame();
	const step = frame < 80 ? 0 : 1;
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill={step === 0 ? '#2a1414' : '#1a2744'} />
			{step === 0 ? (
				<g>
					<Person x={650} y={260} s={1.4} color="#cfc4ad" />
					<text x={650} y={100} textAnchor="middle" {...txt(48)}>
						男の王
					</text>
					{[...Array(20)].map((_, i) => (
						<line key={i} x1={120 + i * 55} y1={480} x2={150 + i * 55} y2={420} stroke={colors.correct} strokeWidth={6} opacity={fadeIn(frame, 20 + i * 2)} />
					))}
					<text x={650} y={560} textAnchor="middle" {...txt(44, colors.correct)} opacity={fadeIn(frame, 40)}>
						千人あまりが命を落とす
					</text>
				</g>
			) : (
				<g opacity={fadeIn(frame, 80)}>
					<circle cx={650} cy={230} r={110} fill={colors.gold} opacity={0.25} />
					<Person x={650} y={300} s={1.1} woman color={colors.goldSoft} />
					<text x={650} y={100} textAnchor="middle" {...txt(48)}>
						13歳の少女・壱与
					</text>
					<text x={650} y={480} textAnchor="middle" {...txt(48, colors.goldSoft)}>
						国は、ようやく落ち着いた
					</text>
				</g>
			)}
		</svg>
	);
};

// 中国の歴史書から消えた150年
export const MissingCentury: React.FC = () => (
	<Timeline
		from={230}
		to={450}
		ticks={[266, 300, 400, 413]}
		bars={[
			{start: 239, end: 266, label: '卑弥呼・壱与', color: colors.correct, row: 0, at: 0},
			{start: 266, end: 413, label: '記録が消える およそ150年', color: '#5b6b8a', row: 1.2, at: 20},
			{start: 300, end: 413, label: '大きな古墳が次々に', color: '#8d5a36', row: 2.4, at: 45},
		]}
	/>
);

// 長さ2メートル37センチの蛇行剣と、人の大きさ
export const DakoSword: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 60], [0, 1], ease);
	const pts = [...Array(9)].map((_, i) => `${120 + i * 125 * p} ${300 + (i % 2 ? -22 : 22) * p}`).join(' L');
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<path d={`M${pts}`} stroke="#8a8f99" strokeWidth={30} fill="none" strokeLinejoin="round" />
			<rect x={60} y={285} width={60} height={30} fill="#5a3a24" />
			<line x1={60} y1={400} x2={60 + 1060 * p} y2={400} stroke="#fff" strokeWidth={4} />
			<text x={600} y={460} textAnchor="middle" {...txt(48, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				2m37cm
			</text>
			<g opacity={fadeIn(frame, 70)}>
				<Person x={1260} y={430} s={3.2} color="#cfc4ad" />
				<text x={1260} y={500} textAnchor="middle" {...txt(32, colors.muted)}>
					身長170cm
				</text>
			</g>
		</svg>
	);
};

// みんなで立てた女王：夜明け
export const QueenSunrise: React.FC = () => {
	const frame = useCurrentFrame();
	const sun = interpolate(frame, [0, 150], [520, 260], ease);
	return (
		<svg width={1400} height={620} viewBox="0 0 1400 620">
			<defs>
				<linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#1d2a52" />
					<stop offset="100%" stopColor="#e39a5c" />
				</linearGradient>
			</defs>
			<rect width={1400} height={620} rx={30} fill="url(#dawnSky)" />
			<circle cx={700} cy={sun} r={90} fill="#ffd98a" />
			<path d="M0 460 Q 350 380 700 440 T 1400 420 L1400 620 L0 620 Z" fill="#2c3a22" />
			{[...Array(12)].map((_, i) => (
				<Person key={i} x={180 + i * 95} y={560} s={0.7} color="#1b1712" />
			))}
			<Person x={700} y={450} s={1} woman color="#1b1712" />
		</svg>
	);
};

// ---- まだ解けていない謎 ----

// 新しい溝の発掘は今年度も続く
export const DigContinues: React.FC = () => {
	const frame = useCurrentFrame();
	const dig = Math.sin(frame / 6) * 12;
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#7a6247" />
			<rect x={300} y={160} width={700} height={340} fill="none" stroke="#3c2c1c" strokeWidth={40} />
			<text x={650} y={380} textAnchor="middle" {...mincho(160, colors.goldSoft)}>
				？
			</text>
			<g transform={`translate(1080 250) rotate(${dig})`}>
				<line x1={0} y1={-120} x2={0} y2={60} stroke="#5a3a24" strokeWidth={14} />
				<path d="M-30 60 L30 60 L20 120 L-20 120 Z" fill="#9aa0a8" />
			</g>
			<Person x={1180} y={420} s={1.2} color="#d9cbb0" />
			<text x={650} y={90} textAnchor="middle" {...txt(44, '#fff')}>
				棺は？ 副葬品は？
			</text>
		</svg>
	);
};

// 土の中で眠る金印（地面の断面）
export const BuriedSeal: React.FC = () => {
	const frame = useCurrentFrame();
	const glow = interpolate(Math.sin(frame / 10), [-1, 1], [0.3, 1]);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={120} fill="#7fb0d9" />
			<rect y={120} width={1300} height={60} fill="#6f8a4c" />
			<rect y={180} width={1300} height={160} fill="#8c6a44" />
			<rect y={340} width={1300} height={260} fill="#6b4e30" />
			{[...Array(18)].map((_, i) => (
				<circle key={i} cx={(i * 173) % 1300} cy={220 + ((i * 97) % 340)} r={10 + (i % 3) * 6} fill="#5a3f26" />
			))}
			<circle cx={820} cy={470} r={70} fill={colors.gold} opacity={glow * 0.4} />
			<rect x={795} y={455} width={50} height={36} rx={4} fill="#d9a53a" />
			<text x={820} y={420} textAnchor="middle" {...txt(32, colors.goldSoft)} opacity={glow}>
				？
			</text>
			<g transform="translate(300 120)">
				<rect x={-8} y={-110} width={14} height={120} fill="#5a3a24" />
				<path d="M-24 10 L24 10 L14 50 L-14 50 Z" fill="#9aa0a8" />
			</g>
		</svg>
	);
};
