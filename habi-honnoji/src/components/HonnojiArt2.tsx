import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {Timeline} from './Kit';
import {BaseMap, clamp, ease, fadeIn, mincho, Person, Pin, places, RouteLine, txt} from './Maps';

// ---- 第3の手がかり 黒幕は秀吉？ ----

// 水攻め：堤で囲まれ、水に浮かぶ城
export const WaterSiege: React.FC = () => {
	const frame = useCurrentFrame();
	const water = interpolate(frame, [10, 90], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#5b7340" />
			<ellipse cx={650} cy={330} rx={520} ry={230} fill="none" stroke="#8a6d3f" strokeWidth={30} />
			<ellipse cx={650} cy={330} rx={490 * water} ry={205 * water} fill="#3d6fa8" opacity={0.85} />
			<rect x={600} y={270} width={100} height={70} fill="#3b2a1e" />
			<path d="M580 270 L650 220 L720 270 Z" fill="#2a1a10" />
			<text x={650} y={590} textAnchor="middle" {...txt(40, '#fff')}>
				備中高松城の水攻め
			</text>
		</svg>
	);
};

// 中国大返し：およそ200キロを10日ほどで
export const ReturnMarch: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 140], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const day = Math.min(10, Math.floor(p * 10) + 1);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#2d3b26" />
			<path d="M0 520 C 300 500 700 540 1300 480 L1300 620 L0 620 Z" fill="#12304d" />
			<text x={650} y={590} textAnchor="middle" {...txt(32, '#9cc3e0')}>
				瀬戸内海
			</text>
			<RouteLine d="M180 360 C 400 330 520 340 650 330 S 950 290 1120 260" p={p} color={colors.gold} width={12} />
			<Pin at={[180, 360]} label="備中高松" color={colors.gold} dy={70} />
			<Pin at={[650, 330]} label="姫路" color="#fff" show={fadeIn(frame, 60)} dy={70} />
			<Pin at={[1120, 260]} label="山崎" color={colors.correct} show={fadeIn(frame, 130)} dy={-36} />
			<rect x={940} y={40} width={320} height={100} rx={18} fill="rgba(5,9,18,0.85)" />
			<text x={1100} y={110} textAnchor="middle" {...txt(56, colors.goldSoft)}>
				{day}日目
			</text>
			<text x={60} y={90} {...txt(40, '#fff')}>
				およそ200キロ
			</text>
		</svg>
	);
};

// 黒幕として名前が挙がった人々
export const SuspectBoard: React.FC = () => {
	const frame = useCurrentFrame();
	const names = ['羽柴秀吉', '朝廷', '足利義昭', '宣教師たち', '徳川家康', '……'];
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#2a1f18" />
			{names.map((n, i) => (
				<g key={n} transform={`translate(${170 + (i % 3) * 480} ${150 + Math.floor(i / 3) * 250}) rotate(${(i % 2 ? 3 : -3)})`} opacity={fadeIn(frame, i * 10)}>
					<rect x={-180} y={-80} width={360} height={170} fill="#f4ecdc" />
					<circle cx={0} cy={-80} r={12} fill={colors.correct} />
					<text y={30} textAnchor="middle" {...mincho(56, colors.ink)}>
						{n}
					</text>
				</g>
			))}
			<text x={650} y={590} textAnchor="middle" {...txt(36, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				黒幕は、誰？
			</text>
		</svg>
	);
};

// 6月2日付の書状：「決戦をするしかない」
export const LetterJune2: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect x={80} y={60} width={360} height={420} rx={20} fill="#f4ecdc" />
			<rect x={80} y={60} width={360} height={100} rx={20} fill={colors.correct} />
			<text x={260} y={130} textAnchor="middle" {...txt(48)}>
				天正10年
			</text>
			<text x={260} y={330} textAnchor="middle" {...mincho(130, colors.ink)}>
				6/2
			</text>
			<text x={260} y={440} textAnchor="middle" {...txt(32, colors.clayDark)}>
				本能寺の変の当日
			</text>
			<g opacity={fadeIn(frame, 25)}>
				<rect x={560} y={60} width={660} height={420} rx={12} fill="#efe2c4" />
				{[...Array(6)].map((_, i) => (
					<path key={i} d={`M${1150 - i * 90} 100 q 8 150 0 300`} stroke="#5a4630" strokeWidth={6} fill="none" opacity={0.5} />
				))}
				<rect x={600} y={200} width={580} height={110} rx={10} fill="rgba(5,9,18,0.9)" />
				<text x={890} y={272} textAnchor="middle" {...txt(48, colors.goldSoft)}>
					決戦をするしかない
				</text>
				<text x={890} y={450} textAnchor="middle" {...txt(30, colors.clayDark)}>
					吉川元春の書状（意訳）
				</text>
			</g>
		</svg>
	);
};

// 道の途中の拠点と食料
export const SupplyBases: React.FC = () => {
	const frame = useCurrentFrame();
	const bases = [
		[200, 330],
		[460, 300],
		[720, 320],
		[980, 290],
	];
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			<rect width={1300} height={560} rx={30} fill="#2d3b26" />
			<path d="M80 330 C 300 260 500 360 720 320 S 1100 260 1240 300" stroke="#b39462" strokeWidth={30} fill="none" />
			{bases.map(([x, y], i) => (
				<g key={i} opacity={fadeIn(frame, 10 + i * 15)}>
					<rect x={x - 40} y={y - 110} width={80} height={60} fill="#8d5a36" />
					<path d={`M${x - 50} ${y - 110} L${x} ${y - 150} L${x + 50} ${y - 110} Z`} fill="#5a3a24" />
					{[0, 1, 2].map((k) => (
						<ellipse key={k} cx={x - 30 + k * 30} cy={y - 30} rx={14} ry={18} fill="#e8d9b0" stroke="#8a6d3f" strokeWidth={2} />
					))}
				</g>
			))}
			<text x={650} y={500} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				信長を迎えるための拠点と食料？
			</text>
		</svg>
	);
};

// ---- 第4の手がかり 四国 ----

// 光秀・利三・元親のつながり
export const TieDiagram: React.FC = () => {
	const frame = useCurrentFrame();
	const node = (x: number, y: number, name: string, sub: string, color: string, at: number) => (
		<g opacity={fadeIn(frame, at)}>
			<circle cx={x} cy={y} r={110} fill={color} stroke="#f4ecdc" strokeWidth={5} />
			<text x={x} y={y + 6} textAnchor="middle" {...mincho(46, '#fff')}>
				{name}
			</text>
			<text x={x} y={y + 160} textAnchor="middle" {...txt(32, colors.muted)}>
				{sub}
			</text>
		</g>
	);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<line x1={260} y1={250} x2={650} y2={250} stroke={colors.goldSoft} strokeWidth={6} opacity={fadeIn(frame, 30)} />
			<line x1={650} y1={250} x2={1040} y2={250} stroke={colors.goldSoft} strokeWidth={6} strokeDasharray="16 12" opacity={fadeIn(frame, 50)} />
			{node(260, 250, '光秀', '取りもち役', colors.clay, 0)}
			{node(650, 250, '斎藤利三', '光秀の重臣', '#5b6b8a', 15)}
			{node(1040, 250, '元親', '四国の大名', colors.wrong, 30)}
			<text x={845} y={220} textAnchor="middle" {...txt(30, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				身内が元親の妻に
			</text>
		</svg>
	);
};

// 信長の方針転換：四国は土佐と阿波の南半分だけ
export const ShikokuMap: React.FC = () => {
	const frame = useCurrentFrame();
	const cut = interpolate(frame, [50, 80], [0, 1], clamp);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#12304d" />
			{/* 四国の4つの国（簡略） */}
			<g stroke="#f4ecdc" strokeWidth={4}>
				<path d="M200 200 L520 170 L560 300 L320 340 L190 300 Z" fill={cut > 0.5 ? '#5b6b8a' : colors.wrong} />
				<path d="M520 170 L800 160 L840 280 L560 300 Z" fill={cut > 0.5 ? '#5b6b8a' : colors.wrong} />
				<path d="M800 160 L1100 200 L1120 320 L840 280 Z" fill={cut > 0.5 ? '#5b6b8a' : colors.wrong} />
				<path d="M840 280 L1120 320 L1080 420 L860 400 Z" fill={colors.wrong} />
				<path d="M190 300 L320 340 L560 300 L840 280 L860 400 L700 520 L400 520 L220 430 Z" fill={colors.wrong} />
			</g>
			<text x={360} y={270} textAnchor="middle" {...mincho(44, '#fff')}>
				伊予
			</text>
			<text x={680} y={240} textAnchor="middle" {...mincho(44, '#fff')}>
				讃岐
			</text>
			<text x={960} y={250} textAnchor="middle" {...mincho(36, '#fff')}>
				阿波（北）
			</text>
			<text x={980} y={380} textAnchor="middle" {...mincho(36, '#fff')}>
				阿波（南）
			</text>
			<text x={540} y={440} textAnchor="middle" {...mincho(56, '#fff')}>
				土佐
			</text>
			<text x={650} y={590} textAnchor="middle" {...txt(40, colors.goldSoft)}>
				{cut > 0.5 ? '残すのは、土佐と阿波の南半分だけ' : '切り取ったぶんだけ、自分のもの'}
			</text>
		</svg>
	);
};

// 5月21日の手紙 → 6月2日の変 → 四国攻めの渡海
export const ShikokuCountdown: React.FC = () => (
	<Timeline
		from={518}
		to={606}
		ticks={[
			{at: 521, label: '5月21日'},
			{at: 602, label: '6月2日'},
		]}
		bars={[
			{start: 521, end: 522, label: '元親の手紙', color: colors.wrong, row: 0, at: 0},
			{start: 602, end: 603, label: '本能寺の変', color: colors.correct, row: 1.2, at: 25},
			{start: 603, end: 604, label: '四国攻めの軍が渡海の直前', color: colors.gold, row: 2.4, at: 50},
		]}
	/>
);

// ---- 第5の手がかり 天海？ ----

// 山崎の戦いと天王山
export const YamazakiMap: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#56703f" />
			<path d="M0 360 C 400 380 800 330 1300 360" stroke="#3d7bb0" strokeWidth={60} fill="none" />
			<path d="M120 300 L300 90 L480 300 Z" fill="#3f5a2e" />
			<text x={300} y={260} textAnchor="middle" {...mincho(48, '#fff')}>
				天王山
			</text>
			<g opacity={fadeIn(frame, 10)}>
				{[...Array(8)].map((_, i) => (
					<rect key={i} x={560 + (i % 4) * 40} y={430 + Math.floor(i / 4) * 40} width={26} height={26} fill={colors.wrong} />
				))}
				<text x={630} y={560} textAnchor="middle" {...txt(36, '#fff')}>
					秀吉
				</text>
			</g>
			<g opacity={fadeIn(frame, 25)}>
				{[...Array(6)].map((_, i) => (
					<rect key={i} x={900 + (i % 3) * 40} y={430 + Math.floor(i / 3) * 40} width={26} height={26} fill={colors.clay} />
				))}
				<text x={940} y={560} textAnchor="middle" {...txt(36, '#fff')}>
					光秀
				</text>
			</g>
			<text x={1250} y={80} textAnchor="end" {...txt(44, colors.goldSoft)}>
				1582年6月13日
			</text>
		</svg>
	);
};

// 天海の没年と、光秀が同一人物だった場合の年齢
export const AgeCheck: React.FC = () => (
	<Timeline
		from={1520}
		to={1660}
		ticks={[
			{at: 1528, label: '1528年？'},
			{at: 1582, label: '1582年'},
			{at: 1643, label: '1643年'},
		]}
		bars={[
			{start: 1528, end: 1582, label: '光秀（生まれた年は諸説）', color: colors.clay, row: 0, at: 0},
			{start: 1590, end: 1643, label: '天海（記録に現れてから没年まで）', color: '#5b6b8a', row: 1.2, at: 25},
			{start: 1528, end: 1643, label: '同じ人なら、100歳をはるかに超える', color: colors.correct, row: 2.4, at: 50},
		]}
	/>
);

// 石灯籠に刻まれた名前と年号
export const LanternInscription: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1100} height={620} viewBox="0 0 1100 620">
			<rect x={420} y={520} width={260} height={50} fill="#8a8578" />
			<rect x={490} y={360} width={120} height={160} fill="#9e9a8c" />
			<rect x={430} y={300} width={240} height={70} fill="#8a8578" />
			<rect x={460} y={190} width={180} height={110} fill="#b8b2a4" />
			<path d="M400 190 L550 110 L700 190 Z" fill="#8a8578" />
			<g opacity={fadeIn(frame, 20)}>
				<text x={520} y={380} {...mincho(40, '#3e3a32')} style={{writingMode: 'vertical-rl'}}>
					光秀
				</text>
				<text x={760} y={260} {...txt(40, colors.goldSoft)}>
					光秀の死から
				</text>
				<text x={760} y={320} {...txt(40, colors.goldSoft)}>
					30年以上あとの年号
				</text>
			</g>
		</svg>
	);
};

// ---- 光秀の幻の城 ----

// 細川藤孝への手紙：「50日か100日のうちに」
export const HosokawaLetter: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1200} height={600} viewBox="0 0 1200 600">
			<rect x={150} y={40} width={900} height={500} rx={12} fill="#efe2c4" />
			{['思いがけないことを思い立った', '忠興たちを取り立てるため', '50日か100日のうちに', 'あとは任せて、身を引く'].map((l, i) => (
				<text key={l} x={950 - i * 200} y={90} {...mincho(44, '#2b2116')} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, i * 18, 15)}>
					{l}
				</text>
			))}
			<text x={600} y={580} textAnchor="middle" {...txt(30, colors.goldSoft)}>
				光秀から細川藤孝への手紙（意訳）
			</text>
		</svg>
	);
};

// 味方が来ない：孤立していく光秀
export const Isolation: React.FC = () => {
	const frame = useCurrentFrame();
	const away = interpolate(frame, [20, 90], [0, 1], ease);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#141a2b" />
			<Person x={650} y={400} s={1.6} color={colors.clay} />
			{[...Array(6)].map((_, i) => {
				const a = (i / 6) * Math.PI * 2;
				const r = 180 + 360 * away;
				return <Person key={i} x={650 + Math.cos(a) * r} y={380 + Math.sin(a) * r * 0.4} s={1} color="#5b6b8a" />;
			})}
			<text x={650} y={560} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				味方は、来なかった
			</text>
		</svg>
	);
};

// 渇水で湖の中から石垣が現れる
export const DroughtWall: React.FC = () => {
	const frame = useCurrentFrame();
	const drop = interpolate(frame, [10, 80], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#9cc3e0" />
			<rect y={200 + 140 * drop} width={1300} height={620} fill="#2c5d8a" />
			{[...Array(12)].map((_, i) => (
				<rect key={i} x={300 + i * 60} y={420 + (i % 2) * 6} width={56} height={40} rx={6} fill="#8a8578" stroke="#5e5a50" strokeWidth={3} />
			))}
			{[...Array(12)].map((_, i) => (
				<rect key={i} x={330 + i * 60} y={380 + (i % 2) * 6} width={56} height={40} rx={6} fill="#9e9a8c" stroke="#5e5a50" strokeWidth={3} />
			))}
			<text x={1250} y={80} textAnchor="end" {...txt(48, '#123b63')}>
				1994年 琵琶湖の渇水
			</text>
		</svg>
	);
};

// 2023年の発掘：長さ30メートルの石垣と堀
export const DigFind2023: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 70], [0, 1], ease);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#8a6a44" />
			<rect x={150} y={330} width={1000} height={90} fill="#2c4a6b" opacity={0.85} />
			{[...Array(Math.floor(p * 16))].map((_, i) => (
				<rect key={i} x={150 + i * 62} y={270} width={58} height={58} rx={6} fill="#a8a294" stroke="#5e5a50" strokeWidth={3} />
			))}
			<line x1={150} y1={470} x2={150 + 1000 * p} y2={470} stroke="#fff" strokeWidth={5} />
			<text x={650} y={530} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				長さ 約30メートルの石垣
			</text>
			<text x={1100} y={400} textAnchor="end" {...txt(32, '#cfe0f0')}>
				堀
			</text>
		</svg>
	);
};

// 2023 → 2025 → 2026：幻の城が姿を現す
export const CastleTimeline: React.FC = () => (
	<Timeline
		from={2022}
		to={2027}
		ticks={[
			{at: 2023, label: '2023年'},
			{at: 2025, label: '2025年'},
			{at: 2026, label: '2026年'},
		]}
		bars={[
			{start: 2023, end: 2023.3, label: '30mの石垣', color: colors.gold, row: 0, at: 0},
			{start: 2025, end: 2025.3, label: '国の史跡に', color: colors.wrong, row: 1.2, at: 20},
			{start: 2026, end: 2026.3, label: '本丸南側の石垣', color: colors.correct, row: 2.4, at: 40},
		]}
	/>
);

// ---- まだ解けていない謎 ----

// 焼け跡から見つからない遺体
export const AshesSearch: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#1a1410" />
			{[...Array(30)].map((_, i) => (
				<rect key={i} x={(i * 97) % 1200 + 50} y={300 + ((i * 53) % 220)} width={60 + (i % 3) * 20} height={14} fill="#3a2a1e" transform={`rotate(${(i % 5) * 12 - 24} ${(i * 97) % 1200 + 80} ${300 + ((i * 53) % 220)})`} />
			))}
			{[0, 1, 2].map((i) => (
				<Person key={i} x={300 + i * 350 + Math.sin(frame / 15 + i) * 20} y={300} s={1} color="#8a7a62" />
			))}
			<text x={650} y={150} textAnchor="middle" {...mincho(100, colors.goldSoft)} opacity={fadeIn(frame, 30)}>
				？
			</text>
		</svg>
	);
};

// 信長の遺骨・首の言い伝えが残る寺
export const LegendMap: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<BaseMap>
			<Pin at={places.kyoto} label="京都・阿弥陀寺" color={colors.gold} show={fadeIn(frame, 0)} dx={-60} dy={70} />
			<Pin at={[1330, 400]} label="静岡・西山本門寺" color={colors.correct} show={fadeIn(frame, 25)} dx={-170} dy={-50} />
		</BaseMap>
	);
};

// 光秀の感謝のことば（家中軍法の最後）
export const GratitudeQuote: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1200} height={600} viewBox="0 0 1200 600">
			<rect x={150} y={30} width={900} height={540} rx={12} fill="#efe2c4" />
			{['石ころのように', '落ちぶれていた自分を', '信長さまは', '拾い上げてくださった'].map((l, i) => (
				<text key={l} x={900 - i * 170} y={80} {...mincho(52, '#2b2116')} style={{writingMode: 'vertical-rl'}} opacity={fadeIn(frame, i * 20, 18)}>
					{l}
				</text>
			))}
			<text x={600} y={600} textAnchor="middle" {...txt(30, colors.goldSoft)}>
				光秀の軍の決まりごと（意訳）
			</text>
		</svg>
	);
};

// 5つの手がかりを全てたどった
export const FiveCluesDone: React.FC = () => {
	const frame = useCurrentFrame();
	const clues = ['敵は本能寺', '恨み', '秀吉黒幕', '四国', '天海'];
	return (
		<svg width={1500} height={420} viewBox="0 0 1500 420">
			{clues.map((c, i) => (
				<g key={c} transform={`translate(${30 + i * 294} 60)`} opacity={fadeIn(frame, i * 8)}>
					<rect width={264} height={280} rx={20} fill={colors.paper} />
					<text x={132} y={70} textAnchor="middle" {...txt(32, colors.clayDark)}>
						手がかり {i + 1}
					</text>
					<text x={132} y={180} textAnchor="middle" {...mincho(c.length > 4 ? 44 : 56, colors.ink)}>
						{c}
					</text>
					<path d="M90 230 l28 26 l56 -60" stroke={colors.correct} strokeWidth={12} fill="none" strokeLinecap="round" opacity={fadeIn(frame, 20 + i * 8)} />
				</g>
			))}
		</svg>
	);
};
