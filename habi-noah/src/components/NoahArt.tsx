import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, gothicFamily, minchoFamily} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)} as const;
const txt = (size: number, color: string = colors.text, weight = 900) => ({fontFamily: gothicFamily, fontWeight: weight, fontSize: size, fill: color});
const sky = (id: string, top: string, bottom: string) => (
	<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
		<stop offset="0%" stopColor={top} />
		<stop offset="100%" stopColor={bottom} />
	</linearGradient>
);

// アララト山：雪をかぶった大きな山と、ふもとの船の形の地形
export const AraratMountain: React.FC<{readonly showBoat?: boolean}> = ({showBoat = true}) => {
	const frame = useCurrentFrame();
	const glow = interpolate(Math.sin(frame / 12), [-1, 1], [0.4, 1]);
	return (
		<svg width={1400} height={640} viewBox="0 0 1400 640">
			<defs>
				{sky('araSky', '#3a5f8f', '#c9dcea')}
				<clipPath id="araClip">
					<rect width={1400} height={640} rx={30} />
				</clipPath>
			</defs>
			<g clipPath="url(#araClip)">
				<rect width={1400} height={640} fill="url(#araSky)" />
				<path d="M150 560 L620 110 L760 210 L1050 470 L1400 560 Z" fill="#7a6a5c" />
				<path d="M540 190 L620 110 L700 170 L660 200 L620 175 L585 215 Z" fill="#f4f7fb" />
				<path d="M900 560 L1080 360 L1260 560 Z" fill="#8a7a6a" />
				<path d="M1050 395 L1080 360 L1110 395 L1080 385 Z" fill="#f4f7fb" />
				<rect y={540} width={1400} height={100} fill="#9c8a6a" />
				{showBoat ? (
					<g opacity={interpolate(frame, [20, 40], [0, 1], clamp)}>
						<ellipse cx={360} cy={575} rx={95} ry={22} fill="#6b5a44" stroke={colors.goldSoft} strokeWidth={4} opacity={glow} />
						<text x={360} y={530} textAnchor="middle" {...txt(36, '#fff6d8')}>船の形の地形</text>
					</g>
				) : null}
				<text x={640} y={80} textAnchor="middle" {...txt(44, '#fff')}>アララト山（標高5137m）</text>
			</g>
		</svg>
	);
};

// 上空から見た船の形の地形（ドゥルピナル）
export const BoatFormation: React.FC<{readonly natural?: boolean}> = ({natural = false}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 60], [0, 1], ease);
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#8c7d63" />
			{[...Array(30)].map((_, i) => (
				<circle key={i} cx={(i * 211) % 1300} cy={(i * 137) % 640} r={8 + (i % 4) * 4} fill="#7a6b52" />
			))}
			<path d="M330 320 C 420 230 820 210 1010 300 C 960 360 940 380 1010 340 C 820 430 420 410 330 320 Z" fill="#a8946f" stroke="#5e4e36" strokeWidth={6} />
			<path d="M330 320 C 420 230 820 210 1010 300 C 960 360 940 380 1010 340 C 820 430 420 410 330 320 Z" fill="none" stroke={colors.goldSoft} strokeWidth={5} strokeDasharray="20 14" pathLength={1} style={{strokeDasharray: `${p} 1`}} />
			{natural
				? [...Array(6)].map((_, i) => (
						<path key={i} d={`M${360 + i * 20} ${320 - i * 8} C ${460} ${240 + i * 12} ${800} ${225 + i * 12} ${990 - i * 20} ${305 + i * 3}`} stroke="#6b5a3e" strokeWidth={4} fill="none" opacity={interpolate(frame, [30 + i * 6, 40 + i * 6], [0, 0.9], clamp)} />
					))
				: null}
			<line x1={330} y1={470} x2={1010} y2={470} stroke="#fff" strokeWidth={4} />
			<line x1={330} y1={455} x2={330} y2={485} stroke="#fff" strokeWidth={4} />
			<line x1={1010} y1={455} x2={1010} y2={485} stroke="#fff" strokeWidth={4} />
			<text x={670} y={530} textAnchor="middle" {...txt(44, '#fff')}>約160m</text>
			<text x={80} y={80} {...txt(40, '#fff')}>上空から見た「ドゥルピナル」</text>
			{natural ? <text x={670} y={170} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={interpolate(frame, [60, 75], [0, 1], clamp)}>折れ曲がった地層の筋</text> : null}
		</svg>
	);
};

// ドリルで掘る：硬い層でドリルの先が砕ける
export const DrillRig: React.FC = () => {
	const frame = useCurrentFrame();
	const depth = interpolate(frame, [0, 80], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const broken = frame > 82;
	const shake = broken && frame < 95 ? Math.sin(frame * 3) * 6 : 0;
	return (
		<svg width={1100} height={640} viewBox="0 0 1100 640">
			<rect width={1100} height={170} fill="#5c7fa8" />
			<rect y={170} width={1100} height={130} fill="#8c7d63" />
			<rect y={300} width={1100} height={120} fill="#7a6a52" />
			<rect y={420} width={1100} height={60} fill="#4c4c58" />
			<rect y={480} width={1100} height={160} fill="#6b5a44" />
			<text x={1080} y={455} textAnchor="end" {...txt(30, '#e8e8f0')}>地下4〜5m：とても硬い層</text>
			<g transform={`translate(${550 + shake} 0)`}>
				<path d="M-120 170 L-20 20 L20 20 L120 170 Z" fill="none" stroke="#e2bb63" strokeWidth={10} />
				<rect x={-60} y={20} width={120} height={50} fill="#c0392b" />
				<rect x={-8} y={70} width={16} height={100 + depth * 250} fill="#bbb" />
				<path d={`M-16 ${170 + depth * 250} L16 ${170 + depth * 250} L0 ${200 + depth * 250} Z`} fill={broken ? 'none' : '#999'} />
			</g>
			{broken
				? [...Array(10)].map((_, i) => (
						<path
							key={i}
							d="M0 0 l12 -6 l6 12 z"
							fill="#ddd"
							transform={`translate(${550 + Math.cos(i) * (frame - 82) * 3} ${425 - Math.abs(Math.sin(i * 2)) * (frame - 82) * 2}) rotate(${frame * 9 + i * 40})`}
							opacity={interpolate(frame, [82, 120], [1, 0], clamp)}
						/>
					))
				: null}
			{broken ? (
				<text x={550} y={600} textAnchor="middle" {...txt(56, colors.correct)} opacity={interpolate(frame, [86, 96], [0, 1], clamp)}>
					ドリルの先が砕けた
				</text>
			) : null}
		</svg>
	);
};

// 聖書の方舟の大きさ：長さ300キュビト＝約135m
export const ArkDimensions: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [0, 50], [0, 1], ease);
	return (
		<svg width={1500} height={600} viewBox="0 0 1500 600">
			<path d={`M150 320 L${150 + 1200 * p} 320 L${150 + 1180 * p} 420 L170 420 Z`} fill="#8a5a32" />
			<rect x={150} y={250} width={1200 * p} height={70} fill="#a8703f" />
			<rect x={150 + 400 * p} y={200} width={400 * p} height={50} fill="#7d4f2a" />
			{[...Array(10)].map((_, i) => (
				<line key={i} x1={150} y1={270 + i * 15} x2={150 + 1200 * p} y2={270 + i * 15} stroke="#6b4423" strokeWidth={2} opacity={0.5} />
			))}
			<g opacity={interpolate(frame, [40, 60], [0, 1], clamp)}>
				<line x1={150} y1={480} x2={1350} y2={480} stroke="#fff" strokeWidth={4} />
				<text x={750} y={540} textAnchor="middle" {...txt(48)}>長さ 300キュビト ＝ 約135m</text>
				<text x={1420} y={330} textAnchor="middle" {...txt(32, colors.muted)}>高さ</text>
				<text x={1420} y={370} textAnchor="middle" {...txt(32, colors.muted)}>30</text>
				<text x={750} y={150} textAnchor="middle" {...txt(36, colors.muted)}>幅 50キュビト</text>
			</g>
			<g transform="translate(130 420)" opacity={interpolate(frame, [55, 70], [0, 1], clamp)}>
				<circle cy={-58} r={9} fill="#fff" />
				<rect x={-6} y={-48} width={12} height={48} fill="#fff" />
				<text y={40} textAnchor="middle" {...txt(22, '#fff')}>人</text>
			</g>
		</svg>
	);
};

// 降り続く雨と、のぼってくる水
export const FloodRain: React.FC = () => {
	const frame = useCurrentFrame();
	const level = interpolate(frame, [0, 200], [560, 200], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<svg width={1400} height={640} viewBox="0 0 1400 640">
			<defs>{sky('rainSky', '#20283a', '#4a5568')}</defs>
			<rect width={1400} height={640} rx={30} fill="url(#rainSky)" />
			<path d="M0 560 L250 300 L420 460 L700 180 L980 450 L1150 330 L1400 560 Z" fill="#3c4a3a" />
			{[...Array(80)].map((_, i) => {
				const x = (i * 97 + frame * 4) % 1400;
				const y = (i * 53 + frame * 22) % 640;
				return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 30} stroke="#9fb4d0" strokeWidth={2} opacity={0.6} />;
			})}
			<path d={`M0 ${level} Q 350 ${level - 12 + Math.sin(frame / 8) * 8} 700 ${level} T 1400 ${level} L1400 640 L0 640 Z`} fill="#2f5f8f" opacity={0.85} />
			<g transform={`translate(700 ${level - 30})`}>
				<path d="M-120 0 L120 0 L100 40 L-100 40 Z" fill="#8a5a32" />
				<rect x={-60} y={-30} width={120} height={30} fill="#a8703f" />
			</g>
		</svg>
	);
};

// 「アララトの山々」：ひとつの山ではなく、ウラルトゥという広い地方
export const UrartuMap: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 50], [0, 1], ease);
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#c9b58e" />
			<path d="M0 0 L1300 0 L1300 120 Q 900 160 600 110 Q 300 70 0 140 Z" fill="#3d6f9a" />
			<text x={650} y={70} textAnchor="middle" {...txt(36, '#e0eefa')}>黒海</text>
			<path d="M1150 260 Q 1230 300 1250 420 Q 1260 520 1180 560 Q 1130 480 1150 380 Z" fill="#3d6f9a" />
			<text x={1210} y={600} textAnchor="middle" {...txt(30, '#1f3d5c')}>カスピ海</text>
			<ellipse cx={700} cy={330} rx={330 * p} ry={190 * p} fill={colors.half} opacity={0.35} stroke={colors.half} strokeWidth={4} />
			<text x={700} y={250} textAnchor="middle" {...txt(54, '#5a3a10')} opacity={p}>ウラルトゥ地方</text>
			<path d="M690 350 L720 300 L750 350 Z" fill="#fff" stroke="#5a4a3a" strokeWidth={3} />
			<text x={720} y={395} textAnchor="middle" {...txt(32, '#3a2a1a')}>アララト山</text>
			<text x={250} y={520} textAnchor="middle" {...txt(36, '#3a2a1a')}>今のトルコ</text>
			<text x={980} y={520} textAnchor="middle" {...txt(32, '#3a2a1a')}>アルメニア・イラン</text>
		</svg>
	);
};

// 1960年の調査：掘っても出てきたのは土と石だけ
export const DigResult: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1200} height={600} viewBox="0 0 1200 600">
			<rect y={200} width={1200} height={400} fill="#8c7d63" />
			<path d="M350 200 L420 480 L780 480 L850 200 Z" fill="#5c4e3a" />
			{[...Array(14)].map((_, i) => (
				<ellipse key={i} cx={430 + ((i * 67) % 340)} cy={300 + ((i * 41) % 160)} rx={22 + (i % 3) * 8} ry={14 + (i % 2) * 6} fill="#9a9488" opacity={interpolate(frame, [i * 4, i * 4 + 10], [0, 1], clamp)} />
			))}
			<g transform={`translate(${900 + Math.sin(frame / 6) * 10} 120) rotate(${-20 + Math.sin(frame / 6) * 15})`}>
				<rect x={-6} y={-120} width={12} height={150} fill={colors.woodLight} />
				<path d="M-34 30 L34 30 L24 100 L-24 100 Z" fill="#aaa" />
			</g>
			<text x={600} y={560} textAnchor="middle" {...txt(48, '#fff')} opacity={interpolate(frame, [50, 65], [0, 1], clamp)}>出てきたのは、土と石だけ</text>
		</svg>
	);
};

// 地層の折れ曲がり（向斜）が削られて、船の形が残る
export const FoldedStrata: React.FC = () => {
	const frame = useCurrentFrame();
	const erode = interpolate(frame, [20, 110], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const colorsL = ['#b59a72', '#8c7354', '#c9b08a', '#7a6248', '#a88e68'];
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			{colorsL.map((c, i) => (
				<path key={i} d={`M0 ${120 + i * 70} Q 650 ${330 + i * 70} 1300 ${120 + i * 70} L1300 ${190 + i * 70} Q 650 ${400 + i * 70} 0 ${190 + i * 70} Z`} fill={c} />
			))}
			<rect width={1300} height={120 + erode * 210} fill="#22304a" />
			<text x={650} y={70} textAnchor="middle" {...txt(44)}>地層がU字に折れ曲がる → まわりが削られる</text>
			<text x={650} y={570} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={interpolate(frame, [100, 120], [0, 1], clamp)}>上から見ると、細長い「船の形」が残る</text>
		</svg>
	);
};

// 土の年代と、船の年代はちがう
export const SoilVsShip: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1400} height={560} viewBox="0 0 1400 560">
			<g transform="translate(350 280)">
				<path d="M-120 -140 L120 -140 L100 160 L-100 160 Z" fill="none" stroke="#ccc" strokeWidth={6} />
				<rect x={-96} y={0} width={192} height={150} fill="#8c7d63" />
				<text y={-170} textAnchor="middle" {...txt(48, colors.goldSoft)}>土の年代</text>
				<text y={240} textAnchor="middle" {...txt(36)}>約3500〜5000年前</text>
			</g>
			<text x={700} y={300} textAnchor="middle" style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 130, fill: colors.correct}} opacity={interpolate(frame, [20, 35], [0, 1], clamp)}>≠</text>
			<g transform="translate(1050 300)" opacity={interpolate(frame, [10, 25], [0, 1], clamp)}>
				<path d="M-170 0 L170 0 L140 70 L-140 70 Z" fill="#8a5a32" />
				<rect x={-90} y={-50} width={180} height={50} fill="#a8703f" />
				<text y={-120} textAnchor="middle" {...txt(48, colors.goldSoft)}>船の年代</text>
				<text y={180} textAnchor="middle" {...txt(36)}>？（まだわからない）</text>
			</g>
		</svg>
	);
};

// 博物館の棚に眠る粘土板
export const MuseumShelves: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#2a2018" />
			{[0, 1, 2, 3].map((r) => (
				<g key={r}>
					<rect x={60} y={130 + r * 130} width={1180} height={14} fill="#6b4a2a" />
					{[...Array(14)].map((_, i) => (
						<rect key={i} x={80 + i * 82} y={70 + r * 130} width={60} height={58} rx={10} fill={r === 2 && i === 9 ? colors.gold : '#b7865a'} opacity={r === 2 && i === 9 ? interpolate(Math.sin(frame / 8), [-1, 1], [0.6, 1]) : 0.85} />
					))}
				</g>
			))}
			<text x={650} y={50} textAnchor="middle" {...txt(36, '#e8d8b8')}>大英博物館の収蔵庫（イメージ）</text>
		</svg>
	);
};

// 鳥を放つ：鳩・ツバメ・カラス
export const BirdsRelease: React.FC<{readonly bible?: boolean}> = ({bible = false}) => {
	const frame = useCurrentFrame();
	const birds = bible
		? [{n: 'カラス', c: '#222', back: false}, {n: '鳩', c: '#eee', back: true}, {n: '鳩（オリーブの葉）', c: '#eee', back: true}]
		: [{n: '鳩', c: '#eee', back: true}, {n: 'ツバメ', c: '#3a4a6a', back: true}, {n: 'カラス', c: '#222', back: false}];
	return (
		<svg width={1400} height={620} viewBox="0 0 1400 620">
			<defs>{sky('birdSky', '#8fb4d8', '#dce9f2')}</defs>
			<rect width={1400} height={620} rx={30} fill="url(#birdSky)" />
			<path d="M0 520 Q 700 470 1400 520 L1400 620 L0 620 Z" fill="#4a7fae" />
			<path d="M520 470 L640 380 L760 470 Z" fill="#7a6a5c" />
			<path d="M580 470 L820 470 L790 510 L610 510 Z" fill="#8a5a32" />
			{birds.map((b, i) => {
				const t0 = i * 60;
				const t = interpolate(frame, [t0, t0 + 55], [0, 1], clamp);
				const out = Math.sin(t * Math.PI);
				const x = 700 + (b.back ? out : t) * (i % 2 ? -480 : 480);
				const y = 450 - (b.back ? out : t) * 300;
				return (
					<g key={b.n} opacity={frame >= t0 ? 1 : 0}>
						<path d={`M${x - 30} ${y} Q ${x - 10} ${y - 20 - Math.sin(frame) * 10} ${x} ${y} Q ${x + 10} ${y - 20 - Math.sin(frame) * 10} ${x + 30} ${y}`} stroke={b.c} strokeWidth={8} fill="none" />
						<text x={250 + i * 450} y={80} textAnchor="middle" {...txt(40, '#1d2a40')}>{`${i + 1}. ${b.n}`}</text>
						<text x={250 + i * 450} y={130} textAnchor="middle" {...txt(32, b.back ? colors.wrong : colors.correct)} opacity={frame > t0 + 40 ? 1 : 0}>
							{b.back ? '戻ってきた' : '戻らなかった'}
						</text>
					</g>
				);
			})}
		</svg>
	);
};

// 丸い方舟（縄で編み、アスファルトで固めた巨大なかご）
export const RoundArk: React.FC<{readonly withSize?: boolean}> = ({withSize = true}) => {
	const frame = useCurrentFrame();
	const coil = interpolate(frame, [0, 90], [0, 1], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<ellipse cx={650} cy={470} rx={560} ry={60} fill="#2f5f8f" opacity={0.7} />
			<path d="M190 330 Q 650 600 1110 330 L1110 300 L190 300 Z" fill="#3a2a1a" />
			{[...Array(12)].map((_, i) => (
				<path key={i} d={`M${200 + i * 4} ${310 + i * 12} Q 650 ${560 + i * 2} ${1100 - i * 4} ${310 + i * 12}`} stroke="#c9a46a" strokeWidth={6} fill="none" opacity={i / 12 < coil ? 0.9 : 0} />
			))}
			<ellipse cx={650} cy={300} rx={460} ry={70} fill="#5a4026" stroke="#c9a46a" strokeWidth={8} />
			<ellipse cx={650} cy={300} rx={400} ry={52} fill="#4a3420" />
			{withSize ? (
				<g opacity={interpolate(frame, [60, 80], [0, 1], clamp)}>
					<line x1={190} y1={170} x2={1110} y2={170} stroke="#fff" strokeWidth={4} />
					<text x={650} y={140} textAnchor="middle" {...txt(48)}>直径 約70m</text>
				</g>
			) : null}
		</svg>
	);
};

// ウルの発掘：町の層 → 3m以上のきれいな泥の層 → また町の層
export const FloodLayerDig: React.FC = () => {
	const frame = useCurrentFrame();
	const p = (a: number) => interpolate(frame, [a, a + 20], [0, 1], clamp);
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#5c4a36" />
			<g opacity={p(0)}>
				<rect x={250} y={40} width={700} height={150} fill="#8c6f4e" />
				{[...Array(10)].map((_, i) => (
					<path key={i} d={`M${290 + i * 65} ${90 + (i % 3) * 30} l20 -8 l10 18 z`} fill="#c98b5a" />
				))}
				<text x={970} y={125} {...txt(28, '#f4e3c8')}>町の跡（土器のかけら）</text>
			</g>
			<g opacity={p(30)}>
				<rect x={250} y={190} width={700} height={260} fill="#c9b48e" />
				<text x={600} y={330} textAnchor="middle" {...txt(48, '#5a4026')}>きれいな泥の層</text>
				<line x1={220} y1={190} x2={220} y2={450} stroke="#fff" strokeWidth={4} />
				<text x={200} y={330} textAnchor="end" {...txt(36, '#fff')}>3m以上</text>
			</g>
			<g opacity={p(60)}>
				<rect x={250} y={450} width={700} height={150} fill="#7a5f42" />
				{[...Array(10)].map((_, i) => (
					<path key={i} d={`M${290 + i * 65} ${500 + (i % 3) * 30} l20 -8 l10 18 z`} fill="#c98b5a" />
				))}
				<text x={970} y={535} {...txt(28, '#f4e3c8')}>さらに古い町の跡</text>
			</g>
		</svg>
	);
};

// 町ごとに時代がばらばらな洪水の層
export const CityFloodDates: React.FC = () => {
	const frame = useCurrentFrame();
	const cities = [
		{n: 'ウル', from: 0.18, to: 0.32},
		{n: 'シュルッパク', from: 0.55, to: 0.62},
		{n: 'キシュ', from: 0.66, to: 0.78},
		{n: 'エリドゥ', from: -1, to: -1},
	];
	return (
		<svg width={1500} height={560} viewBox="0 0 1500 560">
			<line x1={300} y1={470} x2={1400} y2={470} stroke={colors.muted} strokeWidth={4} />
			<text x={300} y={520} textAnchor="middle" {...txt(30, colors.muted)}>古い</text>
			<text x={1400} y={520} textAnchor="middle" {...txt(30, colors.muted)}>新しい</text>
			{cities.map((c, i) => (
				<g key={c.n} opacity={interpolate(frame, [i * 15, i * 15 + 12], [0, 1], clamp)}>
					<text x={270} y={90 + i * 100} textAnchor="end" {...txt(44)}>{c.n}</text>
					{c.from < 0 ? (
						<text x={320} y={90 + i * 100} {...txt(40, colors.correct)}>洪水の層が見つからない</text>
					) : (
						<rect x={300 + c.from * 1100} y={55 + i * 100} width={(c.to - c.from) * 1100} height={50} rx={10} fill={colors.wrong} />
					)}
				</g>
			))}
		</svg>
	);
};

// 黒海：淡水の湖に地中海の水がなだれこむ
export const BlackSeaFill: React.FC = () => {
	const frame = useCurrentFrame();
	const fill = interpolate(frame, [40, 200], [0.55, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<svg width={1400} height={640} viewBox="0 0 1400 640">
			<rect width={1400} height={640} rx={30} fill="#b9a57e" />
			<path d="M0 640 L0 520 Q 200 470 330 520 L360 560 Q 300 600 360 640 Z" fill="#3d6f9a" />
			<text x={130} y={600} {...txt(32, '#e0eefa')}>地中海</text>
			<g transform={`translate(800 260) scale(${fill})`}>
				<path d="M-420 0 Q -400 -170 -100 -190 Q 250 -200 420 -90 Q 470 40 300 130 Q 0 200 -280 140 Q -440 90 -420 0 Z" fill={fill > 0.9 ? '#2f5f8f' : '#6fa3c8'} />
			</g>
			<path d="M360 560 Q 380 470 420 420" stroke="#3d6f9a" strokeWidth={14} fill="none" />
			{[...Array(6)].map((_, i) => (
				<circle key={i} cx={360 + ((frame * 3 + i * 20) % 80) * 0.75} cy={560 - ((frame * 3 + i * 20) % 80) * 1.7} r={6} fill="#cfe6f7" opacity={frame > 40 ? 0.9 : 0} />
			))}
			<text x={430} y={470} {...txt(30, '#1f3d5c')}>ボスポラス海峡</text>
			<text x={800} y={280} textAnchor="middle" {...txt(48, '#fff')}>{fill > 0.9 ? '黒海（海）' : '淡水の湖'}</text>
			<text x={1300} y={80} textAnchor="end" {...txt(36, '#3a2a1a')}>約7600年前？</text>
		</svg>
	);
};

// 実物大の方舟（ケンタッキー州）と人の大きさ
export const ArkBuilding: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1400} height={600} viewBox="0 0 1400 600">
			<defs>{sky('kySky', '#9cc3e6', '#e4f0f8')}</defs>
			<rect width={1400} height={600} rx={30} fill="url(#kySky)" />
			<rect y={480} width={1400} height={120} fill="#6f9a4f" />
			<g transform={`translate(0 ${interpolate(frame, [0, 40], [30, 0], ease)})`}>
				<path d="M120 240 L1280 240 L1240 470 L160 470 Z" fill="#8a5a32" />
				{[...Array(14)].map((_, i) => (
					<line key={i} x1={130} y1={255 + i * 16} x2={1270} y2={255 + i * 16} stroke="#6b4423" strokeWidth={3} />
				))}
				<rect x={120} y={200} width={1160} height={40} fill="#6b4423" />
			</g>
			{[...Array(12)].map((_, i) => (
				<g key={i} transform={`translate(${200 + i * 90} 480)`}>
					<circle cy={-22} r={5} fill="#333" />
					<rect x={-3} y={-17} width={6} height={17} fill="#333" />
				</g>
			))}
			<text x={700} y={120} textAnchor="middle" {...txt(48, '#1d2a40')}>長さ約155m・2016年完成</text>
		</svg>
	);
};

// 動物の数：3万種 → 6万匹以上
export const AnimalCount: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 70], [0, 60000], ease));
	const icons = ['🐘', '🦒', '🐍', '🦅', '🐊', '🐻', '🦁', '🐸', '🦓', '🐢', '🦜', '🐪'];
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{display: 'flex', flexWrap: 'wrap', width: 1300, justifyContent: 'center', gap: 8}}>
				{[...Array(96)].map((_, i) => (
					<div key={i} style={{fontSize: 52, opacity: interpolate(frame, [i * 0.6, i * 0.6 + 6], [0, 1], clamp)}}>
						{icons[i % icons.length]}
					</div>
				))}
			</div>
			<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 120, color: colors.gold, marginTop: 20}}>{n.toLocaleString()}匹以上</div>
		</div>
	);
};

// 足りない水：エベレストまで沈める水はない
export const EverestWater: React.FC = () => {
	const frame = useCurrentFrame();
	const level = interpolate(frame, [0, 90], [560, 470], ease);
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<defs>{sky('evSky', '#3a5f8f', '#a9c6e0')}</defs>
			<rect width={1300} height={620} rx={30} fill="url(#evSky)" />
			<path d="M100 600 L560 90 L700 230 L1200 600 Z" fill="#6a6a78" />
			<path d="M500 160 L560 90 L620 150 L580 170 Z" fill="#fff" />
			<text x={560} y={60} textAnchor="middle" {...txt(36, '#fff')}>エベレスト 8848m</text>
			<rect y={level} width={1300} height={620 - level} fill="#2f5f8f" opacity={0.85} />
			<line x1={0} y1={90} x2={1300} y2={90} stroke={colors.correct} strokeWidth={4} strokeDasharray="16 12" />
			<text x={1260} y={140} textAnchor="end" {...txt(36, '#fff')}>ここまで沈める水は、地球のどこにもない</text>
		</svg>
	);
};

// 海面の変化：2万年前は今より120m以上低かった
export const SeaLevelChart: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const pts = [[0, 120], [0.2, 118], [0.35, 100], [0.55, 60], [0.7, 25], [0.8, 8], [0.88, -2.5], [1, 0]];
	const toX = (t: number) => 160 + t * 1100;
	const toY = (m: number) => 110 + m * 3.6;
	const d = pts.map(([t, m], i) => `${i ? 'L' : 'M'}${toX(t)} ${toY(m)}`).join(' ');
	return (
		<svg width={1400} height={620} viewBox="0 0 1400 620">
			<line x1={160} y1={toY(0)} x2={1260} y2={toY(0)} stroke={colors.muted} strokeWidth={3} strokeDasharray="12 10" />
			<text x={1270} y={toY(0) + 10} {...txt(30, colors.muted)}>今の海面</text>
			<path d={`${d} L1260 ${toY(130)} L160 ${toY(130)} Z`} fill="#2f5f8f" opacity={0.35 * p} />
			<path d={d} stroke="#6fb4e8" strokeWidth={8} fill="none" pathLength={1} style={{strokeDasharray: `${p} 1`}} />
			<text x={toX(0)} y={toY(120) + 60} textAnchor="middle" {...txt(36)}>2万年前</text>
			<text x={toX(0) + 20} y={toY(120) - 20} {...txt(40, '#6fb4e8')}>−120m以上</text>
			<text x={toX(0.88)} y={toY(-2.5) - 30} textAnchor="middle" {...txt(32, colors.goldSoft)} opacity={p > 0.85 ? 1 : 0}>縄文海進（+2〜3m）</text>
			<text x={toX(1)} y={toY(120) + 60} textAnchor="end" {...txt(36)}>今</text>
		</svg>
	);
};

// 縄文海進：海が関東平野の奥まで入りこみ、内陸に貝塚が並ぶ
export const JomonSeaMap: React.FC = () => {
	const frame = useCurrentFrame();
	const sea = interpolate(frame, [10, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const shells = [[560, 230], [600, 300], [520, 330], [640, 380], [470, 280], [690, 300], [610, 200], [540, 410]];
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#7d9a5f" />
			<path d="M520 640 Q 560 560 600 520 Q 660 480 700 520 Q 760 580 800 640 Z" fill="#3d6f9a" />
			<path d={`M520 640 Q ${560 - 40 * sea} ${560 - 300 * sea} ${600 - 30 * sea} ${520 - 360 * sea} Q ${640} ${480 - 340 * sea} ${700 + 20 * sea} ${520 - 300 * sea} Q 760 580 800 640 Z`} fill="#3d6f9a" opacity={0.85} />
			<text x={660} y={600} textAnchor="middle" {...txt(32, '#e0eefa')}>今の東京湾</text>
			{shells.map(([x, y], i) => (
				<g key={i} opacity={interpolate(frame, [110 + i * 6, 120 + i * 6], [0, 1], clamp)}>
					<circle cx={x} cy={y} r={12} fill="#f4ecdc" stroke="#8a5a32" strokeWidth={3} />
				</g>
			))}
			<text x={560} y={130} textAnchor="middle" {...txt(36, '#1f2a14')}>栃木県</text>
			<text x={330} y={330} textAnchor="middle" {...txt(36, '#1f2a14')}>埼玉県</text>
			<text x={1000} y={400} textAnchor="middle" {...txt(36, '#1f2a14')}>茨城県・千葉県</text>
			<text x={1240} y={70} textAnchor="end" {...txt(36, '#fff')}>約6000年前の海（奥東京湾）</text>
			<g transform="translate(980 560)" opacity={interpolate(frame, [110, 125], [0, 1], clamp)}>
				<circle cx={0} cy={0} r={12} fill="#f4ecdc" stroke="#8a5a32" strokeWidth={3} />
				<text x={24} y={12} {...txt(30, '#fff')}>＝ 貝塚</text>
			</g>
		</svg>
	);
};

// 世界中の洪水神話
export const FloodMythWorld: React.FC = () => {
	const frame = useCurrentFrame();
	const spots = [
		{n: 'メソポタミア', x: 760, y: 280},
		{n: 'ギリシャ', x: 660, y: 240},
		{n: 'インド', x: 900, y: 320},
		{n: '中国', x: 1060, y: 270},
		{n: '北アメリカ', x: 300, y: 230},
		{n: '南アメリカ', x: 420, y: 430},
		{n: 'オーストラリア', x: 1160, y: 470},
	];
	return (
		<svg width={1400} height={600} viewBox="0 0 1400 600">
			<rect width={1400} height={600} rx={30} fill="#1d3354" />
			<path d="M180 150 Q 300 100 420 160 Q 430 260 340 300 Q 260 300 200 240 Z M380 330 Q 460 330 470 420 Q 440 520 400 540 Q 370 450 380 330 Z M600 150 Q 800 100 1150 150 Q 1200 260 1050 330 Q 900 360 800 320 Q 700 300 640 250 Q 590 200 600 150 Z M640 300 Q 720 320 730 420 Q 700 500 650 470 Q 620 380 640 300 Z M1090 430 Q 1200 410 1230 480 Q 1180 530 1100 510 Z" fill="#3d5a3a" />
			{spots.map((s, i) => {
				const o = interpolate(frame, [i * 10, i * 10 + 10], [0, 1], clamp);
				const pulse = ((frame - i * 10) % 50) / 50;
				return (
					<g key={s.n} opacity={o}>
						<circle cx={s.x} cy={s.y} r={14} fill="#6fb4e8" />
						<circle cx={s.x} cy={s.y} r={14 + pulse * 30} fill="none" stroke="#6fb4e8" strokeWidth={3} opacity={1 - pulse} />
						<text x={s.x} y={s.y - 26} textAnchor="middle" {...txt(28, '#fff')}>{s.n}</text>
					</g>
				);
			})}
		</svg>
	);
};

// ジョージ・スミス（肖像の代わりのシルエット）と「服を脱いだ」逸話
export const SmithExcited: React.FC = () => {
	const frame = useCurrentFrame();
	const bounce = Math.abs(Math.sin(frame / 5)) * 30;
	return (
		<svg width={1100} height={600} viewBox="0 0 1100 600">
			<rect width={1100} height={600} rx={30} fill="#2a2018" />
			<g transform={`translate(550 ${470 - bounce})`}>
				<circle cy={-260} r={50} fill="#c9b796" />
				<path d="M-90 0 Q -90 -190 0 -200 Q 90 -190 90 0 Z" fill="#3a3a48" />
				<path d={`M-80 -150 L${-170} ${-260 + Math.sin(frame / 3) * 30}`} stroke="#3a3a48" strokeWidth={30} strokeLinecap="round" />
				<path d={`M80 -150 L${170} ${-260 - Math.sin(frame / 3) * 30}`} stroke="#3a3a48" strokeWidth={30} strokeLinecap="round" />
			</g>
			<g transform={`translate(${200 + Math.sin(frame / 7) * 20} ${150 + (frame % 60) * 3}) rotate(${frame * 4})`} opacity={interpolate(frame, [20, 30], [0, 1], clamp)}>
				<path d="M-40 -30 L40 -30 L50 40 L-50 40 Z" fill="#5a4a3a" />
			</g>
			<text x={550} y={80} textAnchor="middle" {...txt(44, colors.goldSoft)}>「読めた！」</text>
		</svg>
	);
};

// ラボで分析を待つ試料
export const LabWaiting: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1200} height={600} viewBox="0 0 1200 600">
			<rect width={1200} height={600} rx={30} fill="#1e2b45" />
			{[...Array(6)].map((_, i) => (
				<g key={i} transform={`translate(${200 + i * 160} 330)`}>
					<rect x={-40} y={-120} width={80} height={200} rx={20} fill="none" stroke="#9fb4d0" strokeWidth={6} />
					<rect x={-34} y={0} width={68} height={74} rx={14} fill={i === 3 ? '#4c4c58' : '#8c7d63'} />
				</g>
			))}
			<text x={600} y={130} textAnchor="middle" {...txt(48)}>分析結果：この冬</text>
			<text x={600} y={540} textAnchor="middle" {...txt(120, colors.goldSoft)} opacity={interpolate(Math.sin(frame / 10), [-1, 1], [0.3, 1])}>？</text>
		</svg>
	);
};

// 5つの手がかりのタイルに、判決の印が次々に押される
export const VerdictTiles: React.FC = () => {
	const frame = useCurrentFrame();
	const tiles: {t: string; mark: string; color: string; el: React.ReactNode}[] = [
		{t: '船の形', mark: 'まちがい', color: colors.wrong, el: <AraratMountain />},
		{t: '古い洪水物語', mark: '正しい', color: colors.correct, el: <RoundArk />},
		{t: '洪水の地層', mark: '半分正しい', color: '#d98a12', el: <FloodLayerDig />},
		{t: '黒海大洪水', mark: '半分正しい', color: '#d98a12', el: <BlackSeaFill />},
		{t: '全ての動物', mark: 'まちがい', color: colors.wrong, el: <ArkBuilding />},
	];
	return (
		<div style={{position: 'absolute', left: 60, right: 60, top: 260, display: 'flex', gap: 24, justifyContent: 'center'}}>
			{tiles.map((tl, i) => {
				const at = 12 + i * 12;
				return (
					<div key={tl.t} style={{position: 'relative', width: 320, opacity: interpolate(frame, [i * 5, i * 5 + 10], [0, 1], clamp)}}>
						<div style={{height: 300, background: colors.night, borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${colors.paper}`}}>
							<div style={{zoom: 0.24}}>{tl.el}</div>
						</div>
						<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 40, color: colors.text, textAlign: 'center', marginTop: 12}}>{tl.t}</div>
						<div
							style={{
								position: 'absolute',
								left: 20,
								right: 20,
								top: 110,
								textAlign: 'center',
								fontFamily: gothicFamily,
								fontWeight: 900,
								fontSize: 44,
								padding: '10px 0',
								borderRadius: 12,
								rotate: '-6deg',
								color: '#fff',
								background: tl.color,
								border: '4px solid #fff',
								whiteSpace: 'nowrap',
								opacity: interpolate(frame, [at, at + 4], [0, 1], clamp),
								scale: String(interpolate(frame, [at, at + 8], [1.8, 1], ease)),
							}}
						>
							{tl.mark}
						</div>
					</div>
				);
			})}
		</div>
	);
};
