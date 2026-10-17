import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {BaseMap, Boat, clamp, ease, fadeIn, mincho, Person, Pin, places, RouteLine, txt} from './YamataiMaps';

// ---- 第1の手がかり 卑弥呼は実在したか ----

// 三国時代：魏・呉・蜀
export const ThreeKingdoms: React.FC = () => {
	const frame = useCurrentFrame();
	const kingdoms = [
		{name: '魏', d: 'M330 80 L900 60 L980 230 L760 320 L420 330 L300 220 Z', color: '#c0583c', x: 640, y: 210},
		{name: '蜀', d: 'M300 220 L420 330 L470 520 L300 580 L160 470 L190 300 Z', color: '#5b8c4a', x: 320, y: 420},
		{name: '呉', d: 'M420 330 L760 320 L980 230 L1020 420 L860 560 L470 520 Z', color: '#3d6fa8', x: 740, y: 440},
	];
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#1a2238" />
			{kingdoms.map((k, i) => (
				<g key={k.name} opacity={fadeIn(frame, i * 14)}>
					<path d={k.d} fill={k.color} stroke="#f4ecdc" strokeWidth={4} />
					<text x={k.x} y={k.y + 40} textAnchor="middle" {...mincho(120, '#fff')}>
						{k.name}
					</text>
				</g>
			))}
			<g opacity={fadeIn(frame, 50)}>
				<path d="M1120 260 L1170 300 L1150 380 L1100 360 Z" fill="#bfa77c" />
				<text x={1140} y={230} textAnchor="middle" {...txt(40, colors.goldSoft)}>倭</text>
			</g>
			<text x={650} y={620} textAnchor="middle" {...txt(36, colors.muted)}>3世紀の中国</text>
		</svg>
	);
};

// およそ2000字の記録が巻物に書かれていく
export const ScrollCounter: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 90], [0, 2000], ease));
	const cols = 16;
	const shown = Math.floor(interpolate(frame, [0, 90], [0, cols], clamp));
	const glyphs = '倭人在帯方東南大海之中依山島為国邑旧百余国漢時有朝見者今使訳所通三十国';
	return (
		<svg width={1400} height={620} viewBox="0 0 1400 620">
			<rect x={100} y={40} width={1200} height={480} rx={12} fill="#efe2c4" />
			<rect x={80} y={30} width={30} height={500} rx={10} fill="#6b4423" />
			<rect x={1290} y={30} width={30} height={500} rx={10} fill="#6b4423" />
			{[...Array(shown)].map((_, c) =>
				[...Array(9)].map((__, r) => (
					<text key={`${c}-${r}`} x={1230 - c * 70} y={110 + r * 48} textAnchor="middle" {...mincho(38, '#2b2116')}>
						{glyphs[(c * 9 + r) % glyphs.length]}
					</text>
				)),
			)}
			<rect x={420} y={530} width={560} height={80} rx={16} fill="rgba(5,9,18,0.9)" />
			<text x={700} y={588} textAnchor="middle" {...txt(50, colors.goldSoft)}>
				およそ {n} 字
			</text>
		</svg>
	);
};

// ウシもウマもトラもいない国
export const NoAnimals: React.FC = () => {
	const frame = useCurrentFrame();
	const animals = ['ウシ', 'ウマ', 'トラ'];
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			{animals.map((a, i) => {
				const at = 10 + i * 18;
				return (
					<g key={a} transform={`translate(${250 + i * 450} 260)`} opacity={fadeIn(frame, at)}>
						<circle r={170} fill="rgba(244,236,220,0.1)" stroke="#f4ecdc" strokeWidth={5} />
						<text y={30} textAnchor="middle" {...txt(90)}>
							{a}
						</text>
						<g opacity={fadeIn(frame, at + 14, 6)}>
							<line x1={-120} y1={-120} x2={120} y2={120} stroke={colors.correct} strokeWidth={22} strokeLinecap="round" />
						</g>
					</g>
				);
			})}
			<text x={700} y={530} textAnchor="middle" {...txt(44, colors.muted)} opacity={fadeIn(frame, 80)}>
				そして人々は、100歳まで生きる者もいる
			</text>
		</svg>
	);
};

// 航海の無事を背負わされた男（持衰）
export const StormMan: React.FC = () => {
	const frame = useCurrentFrame();
	const storm = interpolate(frame, [40, 70], [0, 1], clamp);
	const rock = Math.sin(frame / 6) * (4 + 10 * storm);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill={storm > 0.5 ? '#0d1828' : '#2c4f78'} />
			{storm > 0
				? [...Array(30)].map((_, i) => (
						<line key={i} x1={(i * 97 + frame * 14) % 1300} y1={(i * 53 + frame * 30) % 600} x2={(i * 97 + frame * 14) % 1300 - 20} y2={((i * 53 + frame * 30) % 600) + 50} stroke="#8fb3d9" strokeWidth={3} opacity={storm} />
					))
				: null}
			{storm > 0.6 && frame % 50 < 4 ? <rect width={1300} height={600} fill="#fff" opacity={0.5} /> : null}
			<g transform={`translate(650 380) rotate(${rock})`}>
				<path d="M-280 0 L280 0 L220 70 L-220 70 Z" fill="#6b4423" />
				{[-180, -100, 100, 180].map((x) => (
					<Person key={x} x={x} y={0} s={0.8} color="#d9cbb0" />
				))}
				<Person x={0} y={0} s={1.1} color={colors.goldSoft} />
			</g>
			<path d={`M0 470 Q 160 ${430 - storm * 60} 325 470 T 650 470 T 975 470 T 1300 470 L1300 600 L0 600 Z`} fill="#1f4b75" />
			<text x={650} y={100} textAnchor="middle" {...txt(44, colors.goldSoft)}>髪もとかさず、体も洗わない男</text>
		</svg>
	);
};

// 争う国々が、ひとりの女性を王に立てる
export const QueenChosen: React.FC = () => {
	const frame = useCurrentFrame();
	const gather = interpolate(frame, [20, 80], [0, 1], ease);
	const n = 10;
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#1a1f33" />
			{[...Array(n)].map((_, i) => {
				const a = (i / n) * Math.PI * 2;
				const R = 520 - 270 * gather;
				const x = 650 + Math.cos(a) * R;
				const y = 330 + Math.sin(a) * R * 0.5;
				return (
					<g key={i}>
						<rect x={x - 26} y={y - 70} width={8} height={70} fill="#8d5a36" />
						<path d={`M${x - 18} ${y - 70} L${x + 30} ${y - 58} L${x - 18} ${y - 46} Z`} fill={i % 2 ? colors.wrong : colors.clay} />
						<Person x={x + 8} y={y} s={0.7} color="#cfc4ad" />
					</g>
				);
			})}
			<g opacity={fadeIn(frame, 70, 20)}>
				<circle cx={650} cy={300} r={90} fill={colors.gold} opacity={0.25} />
				<Person x={650} y={350} s={1.5} woman color={colors.goldSoft} />
			</g>
		</svg>
	);
};

// 千人の女性と、ただひとりの男
export const ThousandAttendants: React.FC = () => {
	const frame = useCurrentFrame();
	const count = Math.floor(interpolate(frame, [0, 70], [0, 120], clamp));
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#141a2b" />
			<rect x={520} y={60} width={260} height={180} fill="#5a3a24" stroke={colors.gold} strokeWidth={5} />
			<path d="M490 70 L650 0 L810 70 Z" fill="#3b2214" />
			<text x={650} y={170} textAnchor="middle" {...txt(44, colors.goldSoft)}>女王</text>
			{[...Array(count)].map((_, i) => (
				<Person key={i} x={120 + (i % 20) * 56} y={330 + Math.floor(i / 20) * 50} s={0.4} woman color="#b9a98c" />
			))}
			<g opacity={fadeIn(frame, 80)}>
				<line x1={650} y1={250} x2={650} y2={300} stroke={colors.goldSoft} strokeWidth={4} strokeDasharray="8 8" />
				<Person x={650} y={312} s={0.8} color={colors.correct} />
			</g>
			<text x={650} y={605} textAnchor="middle" {...txt(36, colors.muted)}>
				仕える女性 1000人 ・ 言葉を伝える男 1人
			</text>
		</svg>
	);
};

// 記録に書かれた細かい内容のチェックリスト
export const RecordChecklist: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['使いの名前', '贈り物の中身', '年号'];
	return (
		<svg width={1200} height={560} viewBox="0 0 1200 560">
			<rect x={150} y={20} width={900} height={520} rx={20} fill="#efe2c4" />
			{items.map((it, i) => (
				<g key={it} opacity={fadeIn(frame, 10 + i * 20)}>
					<rect x={250} y={100 + i * 140} width={80} height={80} rx={10} fill="none" stroke="#2b2116" strokeWidth={6} />
					<path d={`M262 ${140 + i * 140} l22 26 l38 -52`} stroke={colors.correct} strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${interpolate(frame, [20 + i * 20, 30 + i * 20], [0, 1], clamp)} 1`} />
					<text x={380} y={160 + i * 140} {...mincho(64, '#2b2116')}>
						{it}
					</text>
				</g>
			))}
		</svg>
	);
};

// 239年、使いが魏の都・洛陽へ
export const EnvoyVoyage: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const path = 'M1100 420 C 950 380 800 330 700 300 C 560 260 420 230 260 180';
	const pts = [
		[1100, 420],
		[700, 300],
		[260, 180],
	];
	const x = interpolate(p, [0, 0.5, 1], [pts[0][0], pts[1][0], pts[2][0]]);
	const y = interpolate(p, [0, 0.5, 1], [pts[0][1], pts[1][1], pts[2][1]]);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#12304d" />
			<path d="M0 0 L620 0 L640 160 L560 340 L380 420 L0 460 Z" fill="#bfa77c" />
			<path d="M640 120 L760 100 L780 300 L700 340 Z" fill="#bfa77c" />
			<path d="M1080 360 L1180 340 L1220 470 L1120 520 Z" fill="#bfa77c" />
			<RouteLine d={path} p={p} />
			<Boat x={x} y={y - 10} scale={1.3} />
			<Pin at={[260, 180]} label="魏の都・洛陽" color={colors.correct} dy={-30} />
			<Pin at={[700, 300]} label="帯方郡" dy={-30} size={30} />
			<Pin at={[1140, 430]} label="倭" dy={80} />
			<text x={1250} y={70} textAnchor="end" {...txt(48, colors.goldSoft)}>西暦239年ごろ</text>
		</svg>
	);
};

// 卑弥呼からの贈り物と、皇帝からの贈り物
export const GiftCompare: React.FC = () => {
	const frame = useCurrentFrame();
	const gifts = ['「親魏倭王」の称号', '金の印', '銅の鏡 100枚', '色とりどりの絹', '金', '5尺の刀 2本', '真珠・赤い顔料'];
	return (
		<svg width={1400} height={640} viewBox="0 0 1400 640">
			<rect width={1400} height={640} rx={30} fill="rgba(5,9,18,0.75)" />
			<text x={260} y={90} textAnchor="middle" {...txt(44, colors.muted)}>卑弥呼から</text>
			<rect x={110} y={140} width={300} height={170} rx={16} fill="#2b3550" />
			<text x={260} y={210} textAnchor="middle" {...txt(40)}>男女10人</text>
			<text x={260} y={270} textAnchor="middle" {...txt(40)}>布</text>
			<text x={930} y={90} textAnchor="middle" {...txt(44, colors.goldSoft)}>魏の皇帝から</text>
			{gifts.map((g, i) => (
				<g key={g} opacity={fadeIn(frame, 15 + i * 9)}>
					<rect x={560 + (i % 2) * 380} y={130 + Math.floor(i / 2) * 120} width={350} height={96} rx={16} fill={i < 3 ? '#6b4e1c' : '#3d3322'} stroke={colors.gold} strokeWidth={3} />
					<text x={735 + (i % 2) * 380} y={192 + Math.floor(i / 2) * 120} textAnchor="middle" {...txt(36)}>
						{g}
					</text>
				</g>
			))}
		</svg>
	);
};

// 晩年、南の狗奴国との争い
export const KunaWar: React.FC = () => {
	const frame = useCurrentFrame();
	const clash = interpolate(frame, [20, 60], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#1a1f33" />
			<circle cx={650} cy={200} r={130} fill={colors.clay} opacity={0.8} />
			<text x={650} y={220} textAnchor="middle" {...mincho(56, '#fff')}>女王の国</text>
			<circle cx={650} cy={520 - 40 * clash} r={110} fill="#5b4a8a" opacity={0.85} />
			<text x={650} y={540 - 40 * clash} textAnchor="middle" {...mincho(56, '#fff')}>狗奴国</text>
			<text x={850} y={540} {...txt(36, colors.muted)}>（南）</text>
			{clash > 0.6 ? <path d="M600 345 L640 365 L620 385 L680 410 L650 380 L690 370 Z" fill={colors.correct} /> : null}
			<g opacity={fadeIn(frame, 70)}>
				<Boat x={180} y={200} scale={1.4} />
				<text x={180} y={270} textAnchor="middle" {...txt(36, colors.goldSoft)}>魏の使い 張政</text>
				<line x1={250} y1={200} x2={500} y2={200} stroke={colors.goldSoft} strokeWidth={5} strokeDasharray="12 10" />
			</g>
		</svg>
	);
};

// 日本には、この時代の文字の記録がない
export const NoRecordsJapan: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			<g opacity={fadeIn(frame, 0)}>
				<rect x={100} y={60} width={460} height={380} rx={16} fill="#efe2c4" />
				{[...Array(8)].map((_, i) => (
					<line key={i} x1={500 - i * 50} y1={100} x2={500 - i * 50} y2={400} stroke="#2b2116" strokeWidth={8} strokeDasharray="22 10" />
				))}
				<text x={330} y={510} textAnchor="middle" {...txt(44)}>中国の記録</text>
			</g>
			<g opacity={fadeIn(frame, 20)}>
				<rect x={740} y={60} width={460} height={380} rx={16} fill="#efe2c4" opacity={0.25} stroke="#efe2c4" strokeWidth={4} strokeDasharray="16 12" />
				<text x={970} y={290} textAnchor="middle" {...mincho(140, colors.muted)}>0</text>
				<text x={970} y={510} textAnchor="middle" {...txt(44)}>日本の記録</text>
			</g>
		</svg>
	);
};

// ---- 第2の手がかり 魏志倭人伝の道のり ----

// 帯方郡から対馬・壱岐を通って九州の北の岸へ
export const RouteNorth: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 130], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<BaseMap>
			<RouteLine d="M210 120 L240 250 L300 300 L370 330 L425 410 L455 452" p={p} />
			<Pin at={places.taiho} label="帯方郡" show={fadeIn(frame, 0)} />
			<Pin at={places.tsushima} label="対馬" show={fadeIn(frame, 60)} dx={-70} dy={10} />
			<Pin at={places.iki} label="壱岐" show={fadeIn(frame, 95)} dx={-70} dy={10} />
			<Pin at={places.matsura} label="九州の北の岸" show={fadeIn(frame, 125)} dx={150} dy={-40} />
		</BaseMap>
	);
};

// 女王の国まで1万2000里あまり
export const DistanceCounter: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 70], [0, 12000], ease));
	return (
		<svg width={1300} height={520} viewBox="0 0 1300 520">
			<rect width={1300} height={520} rx={30} fill="rgba(5,9,18,0.75)" />
			<text x={200} y={130} {...txt(44, colors.muted)}>帯方郡 → 女王の国</text>
			<text x={650} y={340} textAnchor="middle" {...mincho(200, colors.goldSoft)}>
				{n.toLocaleString('ja-JP')}
			</text>
			<text x={650} y={450} textAnchor="middle" {...txt(64)}>里あまり</text>
		</svg>
	);
};

// 「1000里」を実際の距離から逆算すると、1里は数十メートル
export const LiRuler: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 60], [0, 1], ease);
	const shrink = interpolate(frame, [80, 120], [1, 0.15], ease);
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<text x={150} y={110} {...txt(44)}>朝鮮半島 → 対馬：記録では「1000里あまり」</text>
			<rect x={150} y={180} width={1100 * p} height={50} rx={10} fill={colors.gold} />
			<text x={700} y={300} textAnchor="middle" {...txt(40, colors.muted)} opacity={fadeIn(frame, 50)}>
				実際の距離は、およそ数十キロ
			</text>
			<g opacity={fadeIn(frame, 75)}>
				<text x={150} y={420} {...txt(44)}>1里 ＝</text>
				<rect x={330} y={380} width={500 * shrink} height={50} rx={10} fill={colors.correct} />
				<text x={360 + 500 * shrink} y={420} {...txt(52, colors.goldSoft)}>
					わずか数十メートル？
				</text>
			</g>
		</svg>
	);
};

// 書かれたとおりに南へ進むと、太平洋の上へ
export const RouteToPacific: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [20, 150], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<BaseMap>
			<Pin at={places.ito} label="伊都国" dy={-30} />
			<RouteLine d="M500 440 L560 520 L620 640 L660 760 L690 815" p={p} color={colors.correct} width={9} />
			<text x={720} y={600} {...txt(40, '#fff')} opacity={fadeIn(frame, 40)} stroke="#000" strokeWidth={6} paintOrder="stroke">
				南へ 船で20日
			</text>
			<text x={720} y={680} {...txt(40, '#fff')} opacity={fadeIn(frame, 90)} stroke="#000" strokeWidth={6} paintOrder="stroke">
				さらに船で10日、歩いて1か月
			</text>
			<text x={720} y={780} {...txt(52, colors.goldSoft)} opacity={fadeIn(frame, 145)} stroke="#000" strokeWidth={6} paintOrder="stroke">
				→ 太平洋の上？
			</text>
		</BaseMap>
	);
};

// 記録のどこかに、ひび
export const RecordCrack: React.FC = () => {
	const frame = useCurrentFrame();
	const crack = interpolate(frame, [20, 45], [0, 1], clamp);
	return (
		<svg width={1200} height={560} viewBox="0 0 1200 560">
			<rect x={150} y={40} width={900} height={460} rx={14} fill="#efe2c4" />
			{['南至投馬国水行二十日', '南至邪馬台国', '水行十日陸行一月'].map((s, i) => (
				<text key={s} x={900 - i * 260} y={90} {...mincho(48, '#2b2116')} style={{writingMode: 'vertical-rl'}}>
					{s}
				</text>
			))}
			<path d="M600 40 L560 150 L640 230 L570 330 L630 420 L590 500" fill="none" stroke={colors.correct} strokeWidth={10} pathLength={1} strokeDasharray={`${crack} 1`} />
		</svg>
	);
};

// 研究者の道が、ふたつに分かれる
export const TwoRoads: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 50], [0, 1], ease);
	return (
		<svg width={1300} height={580} viewBox="0 0 1300 580">
			<RouteLine d="M650 560 L650 330" p={p} width={30} color="#8d7a5a" />
			<RouteLine d="M650 330 C 600 230 420 170 260 130" p={interpolate(frame, [40, 80], [0, 1], ease)} width={30} color="#8d7a5a" />
			<RouteLine d="M650 330 C 700 230 880 170 1040 130" p={interpolate(frame, [40, 80], [0, 1], ease)} width={30} color="#8d7a5a" />
			<g opacity={fadeIn(frame, 80)}>
				<rect x={110} y={20} width={300} height={90} rx={14} fill={colors.wrong} />
				<text x={260} y={82} textAnchor="middle" {...txt(48)}>方角？</text>
				<rect x={890} y={20} width={300} height={90} rx={14} fill={colors.clay} />
				<text x={1040} y={82} textAnchor="middle" {...txt(48)}>距離？</text>
			</g>
		</svg>
	);
};

// 「南」を「東」と読みかえると、瀬戸内海を通って奈良へ
export const SouthToEast: React.FC = () => {
	const frame = useCurrentFrame();
	const turn = interpolate(frame, [10, 40], [0, -90], ease);
	const p = interpolate(frame, [45, 150], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<BaseMap>
			<g transform={`translate(260 640) rotate(${turn})`}>
				<circle r={80} fill="rgba(5,9,18,0.85)" stroke={colors.gold} strokeWidth={4} />
				<path d="M0 60 L18 0 L0 -10 L-18 0 Z" fill={colors.correct} transform="rotate(0)" />
			</g>
			<text x={260} y={770} textAnchor="middle" {...txt(36, '#fff')}>{frame < 30 ? '南' : '東'}</text>
			<RouteLine d="M545 438 C 640 470 700 500 780 505 C 880 510 960 512 1040 520 L1090 515" p={p} color={colors.correct} width={9} />
			<Pin at={places.nara} label="奈良（畿内説）" color={colors.correct} show={fadeIn(frame, 145)} dy={-36} />
		</BaseMap>
	);
};

// 伊都国を中心に、放射状に読む
export const RadialReading: React.FC = () => {
	const frame = useCurrentFrame();
	const spokes = [
		[0, -1],
		[0.9, 0.3],
		[-0.6, 0.8],
		[0.4, 0.95],
	];
	return (
		<BaseMap>
			{spokes.map(([dx, dy], i) => (
				<RouteLine key={i} d={`M500 440 L${500 + dx * 140} ${440 + dy * 140}`} p={interpolate(frame, [10 + i * 12, 40 + i * 12], [0, 1], ease)} color={colors.wrong} width={8} />
			))}
			<Pin at={places.ito} label="伊都国" color={colors.wrong} dy={-40} />
			<g opacity={fadeIn(frame, 80)}>
				<circle cx={540} cy={560} r={150} fill="none" stroke={colors.goldSoft} strokeWidth={5} strokeDasharray="16 12" />
				<text x={760} y={700} {...txt(44, '#fff')} stroke="#000" strokeWidth={6} paintOrder="stroke">
					九州の中に収まる（九州説）
				</text>
			</g>
		</BaseMap>
	);
};

// どちらの読み方も、記録の一部を読みかえる
export const BothRewrite: React.FC = () => {
	const frame = useCurrentFrame();
	const card = (x: number, title: string, fix: string, color: string, at: number) => (
		<g opacity={fadeIn(frame, at)}>
			<rect x={x} y={60} width={480} height={420} rx={20} fill="#efe2c4" />
			<rect x={x} y={60} width={480} height={90} rx={20} fill={color} />
			<text x={x + 240} y={122} textAnchor="middle" {...txt(48)}>
				{title}
			</text>
			<text x={x + 240} y={290} textAnchor="middle" {...mincho(60, '#2b2116')}>
				{fix}
			</text>
			<text x={x + 240} y={400} textAnchor="middle" {...txt(36, colors.correct)} opacity={fadeIn(frame, at + 30)}>
				記録を読みかえる
			</text>
		</g>
	);
	return (
		<svg width={1200} height={540} viewBox="0 0 1200 540">
			{card(60, '畿内説', '南 → 東', colors.correct, 0)}
			{card(660, '九州説', '一本道 → 放射', colors.wrong, 20)}
		</svg>
	);
};

// 「台」と「壹」
export const GlyphSwap: React.FC = () => {
	const frame = useCurrentFrame();
	const flip = interpolate(frame, [40, 60], [0, 1], ease);
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			<text x={420} y={340} textAnchor="middle" {...mincho(200)}>
				邪馬
			</text>
			<g transform={`translate(860 270) scale(${Math.abs(1 - 2 * flip)} 1)`}>
				<rect x={-150} y={-160} width={300} height={300} rx={20} fill={flip < 0.5 ? colors.wrong : colors.correct} />
				<text y={90} textAnchor="middle" {...mincho(230, '#fff')}>
					{flip < 0.5 ? '台' : '壹'}
				</text>
			</g>
			<text x={650} y={520} textAnchor="middle" {...txt(48, colors.goldSoft)}>
				{flip < 0.5 ? 'やまたい' : 'やまいち'}
			</text>
		</svg>
	);
};

// 「やまと」はふたつある：奈良の大和、筑後の山門
export const YamatoNames: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<BaseMap>
			<Pin at={places.nara} label="大和（やまと）" color={colors.correct} pulse show={fadeIn(frame, 10)} dy={-36} size={40} />
			<Pin at={places.chikugo} label="山門（やまと）" color={colors.wrong} pulse show={fadeIn(frame, 40)} dx={20} dy={90} size={40} />
		</BaseMap>
	);
};

// 名乗りを上げた候補地、50か所以上
export const FiftyPins: React.FC = () => {
	const frame = useCurrentFrame();
	const pts: [number, number][] = [];
	for (let i = 0; i < 50; i++) {
		const t = (i * 0.618) % 1;
		const zone = i % 5;
		if (zone === 0 || zone === 1) pts.push([460 + ((i * 37) % 170), 450 + ((i * 53) % 270)]);
		else if (zone === 2) pts.push([980 + ((i * 41) % 200), 380 + ((i * 29) % 180)]);
		else if (zone === 3) pts.push([780 + ((i * 31) % 200), 545 + ((i * 7) % 60)]);
		else pts.push([700 + 600 * t, 330 + ((i * 17) % 140)]);
	}
	return (
		<BaseMap>
			{pts.map((p, i) => (
				<Pin key={i} at={p} color={i % 3 ? colors.gold : colors.correct} show={fadeIn(frame, i * 2, 6)} />
			))}
			<g opacity={fadeIn(frame, 100)}>
				<Pin at={[120, 760]} label="海の向こう" color={colors.half} dx={140} dy={12} />
			</g>
			<rect x={980} y={660} width={380} height={110} rx={18} fill="rgba(5,9,18,0.85)" />
			<text x={1170} y={735} textAnchor="middle" {...txt(56, colors.goldSoft)}>
				{Math.min(50, Math.floor(frame / 2))} か所
			</text>
		</BaseMap>
	);
};

// 道のりではなく、モノで決められるか？ 光る印
export const SealTeaser: React.FC = () => {
	const frame = useCurrentFrame();
	const glow = interpolate(Math.sin(frame / 10), [-1, 1], [0.3, 0.9]);
	return (
		<svg width={1200} height={560} viewBox="0 0 1200 560">
			<circle cx={600} cy={280} r={230} fill={colors.gold} opacity={glow * 0.25} />
			<rect x={470} y={250} width={260} height={180} rx={12} fill="#d9a53a" stroke="#8a6a2a" strokeWidth={6} />
			{/* ヘビの形の持ち手 */}
			<path d="M520 250 C 520 170 600 200 600 160 C 600 120 680 140 680 200 L680 250" fill="none" stroke="#e8bd52" strokeWidth={34} strokeLinecap="round" />
			<circle cx={600} cy={150} r={26} fill="#e8bd52" />
			<text x={600} y={370} textAnchor="middle" {...mincho(90, '#6b4e1c')}>？</text>
		</svg>
	);
};

