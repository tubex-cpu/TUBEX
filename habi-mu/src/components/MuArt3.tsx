import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {BigLine, Bars, PacificMap, Panel, SeaSection, Versus, Years, clamp, ease, fadeIn, mincho, places, txt} from './MuKit';

// ---- 第11の手がかり 島の人々はどこから ----

export const SurvivorClaim: React.FC = () => <PacificMap mu={0.5} pins={[{at: places.easter, label: 'ムーの生き残り？', at0: 10}]} />;

export const SettleDate: React.FC = () => (
	<Bars
		title="島に人が住みはじめたのは、何年前？"
		rows={[
			{label: 'ムーの説', value: 12000, unit: '年前', color: '#8a6e3f'},
			{label: '2006年の研究', value: 800, unit: '年前', color: '#5fb3a8'},
		]}
	/>
);

export const CleanSamples: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			{[...Array(14)].map((_, i) => {
				const bad = i % 3 === 0;
				const out = bad ? interpolate(frame, [30, 60], [0, 1], clamp) : 0;
				return <circle key={i} cx={180 + i * 75} cy={300 - out * 200} r={26} fill={bad ? '#c86b4a' : '#5fb3a8'} opacity={1 - out} />;
			})}
			<text x={700} y={480} textAnchor="middle" {...txt(44)} opacity={fadeIn(frame, 50)}>
				古い年代が出やすい試料を取りのぞいて、計算し直す
			</text>
		</Panel>
	);
};

export const Again800: React.FC = () => <BigLine main="ここでも、800年前" size={130} />;

export const VoyagingSkills: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#081626">
			{[...Array(40)].map((_, i) => (
				<circle key={i} cx={(i * 137) % 1400} cy={(i * 59) % 300 + 20} r={2 + (i % 3)} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(frame / 20 + i))} />
			))}
			<rect y={420} width={1400} height={200} fill="#123a56" />
			{['星', '波', '風', '鳥'].map((t, i) => (
				<g key={t} opacity={fadeIn(frame, i * 10)}>
					<circle cx={250 + i * 300} cy={330} r={70} fill="rgba(226,187,99,0.15)" stroke={colors.gold} strokeWidth={4} />
					<text x={250 + i * 300} y={355} textAnchor="middle" {...mincho(70, colors.goldSoft)}>
						{t}
					</text>
				</g>
			))}
		</Panel>
	);
};

export const HokuleaRoute: React.FC = () => (
	<PacificMap
		pins={[
			{at: places.hawaii, label: 'ハワイ', at0: 0},
			{at: places.tahiti, label: 'タヒチ', at0: 50, dy: 50},
		]}
		routes={[{from: places.hawaii, to: places.tahiti, at0: 10, len: 60, bend: -40}]}
	>
		<text x={1000} y={330} {...txt(40, colors.goldSoft)} stroke="#000" strokeWidth={6} paintOrder="stroke">
			4000キロ以上
		</text>
	</PacificMap>
);

export const NoInstruments: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['羅針盤', '地図', '機械'];
	return (
		<Panel>
			{items.map((t, i) => (
				<g key={t} opacity={fadeIn(frame, i * 10)}>
					<rect x={160 + i * 380} y={180} width={320} height={200} rx={24} fill="rgba(244,236,220,0.08)" stroke={colors.muted} strokeWidth={4} />
					<text x={320 + i * 380} y={300} textAnchor="middle" {...txt(60)}>
						{t}
					</text>
					<line x1={190 + i * 380} y1={360} x2={450 + i * 380} y2={200} stroke="#e94b3c" strokeWidth={10} opacity={fadeIn(frame, 30 + i * 10)} />
				</g>
			))}
			<text x={700} y={520} textAnchor="middle" {...txt(48, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				使ったのは、昔から伝わる知恵だけ
			</text>
		</Panel>
	);
};

export const BeyondHorizon: React.FC = () => <BigLine main="自分たちの意思で、水平線の向こうへ" size={84} />;

// ---- 第12の手がかり 崩壊の物語 ----

export const ForestGone: React.FC = () => {
	const frame = useCurrentFrame();
	const gone = interpolate(frame, [20, 110], [0, 1], clamp);
	return (
		<Panel fill="#1a2430">
			<rect y={440} width={1400} height={180} fill="#6b7a4e" />
			{[...Array(16)].map((_, i) => (
				<g key={i} transform={`translate(${120 + i * 75} 440)`} opacity={1 - Math.min(1, gone * 1.6 - (i % 4) * 0.15)}>
					<line x1={0} y1={0} x2={0} y2={-150} stroke="#5a4028" strokeWidth={8} />
					{[-60, -20, 20, 60].map((r) => (
						<ellipse key={r} cx={0} cy={-150} rx={46} ry={10} fill="#3f6a2b" transform={`rotate(${r} 0 -150) translate(24 0)`} />
					))}
				</g>
			))}
			<text x={700} y={110} textAnchor="middle" {...txt(46, colors.goldSoft)}>
				昔はヤシの森におおわれていた
			</text>
		</Panel>
	);
};

export const CollapseStory: React.FC = () => {
	const frame = useCurrentFrame();
	const steps = ['木を切りつくす', 'カヌーも畑もだめに', '食べ物をめぐる争い', '人口が激減？'];
	return (
		<Panel>
			{steps.map((t, i) => (
				<g key={t} opacity={fadeIn(frame, i * 18)}>
					<rect x={80 + i * 330} y={230} width={290} height={150} rx={20} fill="rgba(233,75,60,0.12)" stroke="#e94b3c" strokeWidth={4} />
					<text x={225 + i * 330} y={320} textAnchor="middle" {...txt(38)}>
						{t}
					</text>
					{i < 3 ? (
						<text x={390 + i * 330} y={320} textAnchor="middle" {...txt(50, '#e94b3c')}>
							→
						</text>
					) : null}
				</g>
			))}
			<text x={700} y={520} textAnchor="middle" {...txt(44, colors.muted)} opacity={fadeIn(frame, 80)}>
				教科書や本で広く紹介されてきた「崩壊」の物語
			</text>
		</Panel>
	);
};

export const GenomeNoCrash: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 90], [0, 1], clamp);
	const pts = [...Array(30)].map((_, i) => {
		const x = 150 + i * 38;
		const y = 330 + Math.sin(i / 3) * 14;
		return `${x},${y}`;
	});
	return (
		<Panel>
			<line x1={130} y1={500} x2={1290} y2={500} stroke="#fff" strokeWidth={3} />
			<polyline points={pts.slice(0, Math.max(2, Math.round(p * pts.length))).join(' ')} fill="none" stroke="#5fb3a8" strokeWidth={8} />
			<path d="M150 330 L700 330 L760 470 L1290 470" fill="none" stroke="#e94b3c" strokeWidth={4} strokeDasharray="14 10" opacity={fadeIn(frame, 40) * 0.6} />
			<text x={1000} y={440} {...txt(36, '#e94b3c')} opacity={fadeIn(frame, 40)}>
				崩壊説なら、こう落ちる
			</text>
			<text x={700} y={110} textAnchor="middle" {...txt(46)}>
				15人の古代ゲノムに残る人口の変化（2024年）
			</text>
			<text x={420} y={290} textAnchor="middle" {...txt(40, '#5fb3a8')} opacity={fadeIn(frame, 70)}>
				急な落ちこみは、ない
			</text>
		</Panel>
	);
};

export const FarmCapacity: React.FC = () => (
	<Panel>
		<text x={700} y={220} textAnchor="middle" {...txt(46, colors.muted)}>
			島の畑で養える人数（2024年の研究）
		</text>
		<text x={700} y={400} textAnchor="middle" {...mincho(190, colors.goldSoft)}>
			4000<tspan {...txt(80)}>人ほど</tspan>
		</text>
	</Panel>
);

export const RockGarden: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#1a2430">
			<rect y={300} width={1400} height={320} fill="#6b5a3f" />
			{[...Array(60)].map((_, i) => (
				<ellipse key={i} cx={100 + (i % 15) * 85} cy={360 + Math.floor(i / 15) * 60} rx={30} ry={18} fill="#4a4a48" opacity={fadeIn(frame, (i % 15) * 2)} />
			))}
			{[...Array(6)].map((_, i) => (
				<path key={i} d={`M${200 + i * 190} 360 q 10 -60 0 -90 M${200 + i * 190} 330 q 30 -20 40 -50 M${200 + i * 190} 330 q -30 -20 -40 -50`} stroke="#6fa04a" strokeWidth={6} fill="none" opacity={fadeIn(frame, 30)} />
			))}
			<text x={700} y={110} textAnchor="middle" {...txt(46, colors.goldSoft)}>
				石を並べて、風と乾燥から作物を守る畑
			</text>
		</Panel>
	);
};

export const ToSouthAmerica: React.FC = () => (
	<PacificMap
		pins={[
			{at: places.easter, label: 'イースター島', at0: 0},
			{at: [-78, -8], label: '南アメリカ', at0: 40, dy: -30},
		]}
		routes={[{from: places.easter, to: [-78, -8], at0: 10, len: 50, bend: 60}]}
	>
		<text x={1060} y={300} textAnchor="middle" {...txt(40, colors.goldSoft)} stroke="#000" strokeWidth={6} paintOrder="stroke">
			1300年ごろ、遺伝子がまじる
		</text>
	</PacificMap>
);

export const RealDecline: React.FC = () => (
	<Versus
		left={{title: '18世紀〜', lines: ['外から持ちこまれた', '病気']}}
		right={{title: '19世紀', lines: ['島の人々を', '連れ去った奴隷狩り']}}
		mid="＋"
	/>
);

// ---- 第13の手がかり 与那国 ----

export const YonaguniMap: React.FC = () => (
	<PacificMap
		pins={[
			{at: places.yonaguni, label: '与那国島', at0: 0, color: colors.japan},
			{at: [121, 23.7], label: '台湾', at0: 20, dy: 50},
		]}
	/>
);

export const UnderwaterSteps: React.FC = () => (
	<SeaSection seaY={70}>
		{[0, 1, 2, 3, 4].map((i) => (
			<rect key={i} x={260 + i * 120} y={260 + i * 60} width={880 - i * 120} height={360 - i * 60} fill={i % 2 ? '#3f5560' : '#4c6470'} />
		))}
		<line x1={180} y1={70} x2={180} y2={260} stroke="#fff" strokeWidth={4} />
		<text x={200} y={180} {...txt(40)}>
			水深およそ25m
		</text>
	</SeaSection>
);

export const KimuraClaim: React.FC = () => (
	<Versus
		left={{title: '木村政昭さん', lines: ['人の手で造られた遺跡', '1万年ほど前か、それ以前', 'まだ陸だったころ']}}
		right={{title: '多くの地質学者', lines: ['砂岩の層と割れ目', '波と潮が削った', '自然の地形'], color: colors.muted}}
	/>
);

export const SandstoneJoints: React.FC = () => {
	const frame = useCurrentFrame();
	const cut = interpolate(frame, [30, 120], [0, 1], clamp);
	return (
		<Panel fill="#0a1626">
			{[...Array(6)].map((_, r) => (
				<rect key={r} x={250} y={150 + r * 60} width={900} height={56} fill={r % 2 ? '#8a7a5a' : '#9a8a68'} />
			))}
			{[...Array(5)].map((_, i) => (
				<line key={i} x1={380 + i * 170} y1={150} x2={380 + i * 170} y2={510} stroke="#3a2f20" strokeWidth={6} />
			))}
			<rect x={250} y={150} width={900 * cut * 0.4} height={120} fill="#0a1626" />
			<text x={700} y={580} textAnchor="middle" {...txt(42, colors.goldSoft)}>
				平らな層＋まっすぐな割れ目 → 階段のような形に
			</text>
		</Panel>
	);
};

export const Kuroshio: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<PacificMap pins={[{at: places.yonaguni, label: '与那国島', color: colors.japan}]}>
			{[...Array(5)].map((_, i) => (
				<path key={i} d={`M${120 + i * 6} ${330 - i * 8} Q 240 ${250 - i * 10} 340 ${160 - i * 6}`} stroke="#9fd3e8" strokeWidth={6} fill="none" strokeDasharray="20 16" strokeDashoffset={-frame * 2} opacity={0.8} />
			))}
			<text x={300} y={420} {...txt(44, '#9fd3e8')} stroke="#000" strokeWidth={6} paintOrder="stroke">
				黒潮
			</text>
		</PacificMap>
	);
};

export const SeaLevelRise: React.FC = () => {
	const frame = useCurrentFrame();
	const sea = interpolate(frame, [20, 150], [480, 260], ease);
	return (
		<Panel fill="#0a1626">
			<path d="M0 360 L200 330 L420 350 L650 300 L900 340 L1150 310 L1400 330 L1400 620 L0 620 Z" fill="#6b7a4e" />
			<rect y={sea} width={1400} height={620 - sea} fill="#1f5f86" opacity={0.9} />
			<line x1={1250} x2={1250} y1={480} y2={260} stroke={colors.goldSoft} strokeWidth={5} />
			<text x={1230} y={380} textAnchor="end" {...txt(42, colors.goldSoft)}>
				約120m
			</text>
			<text x={700} y={110} textAnchor="middle" {...txt(44)}>
				2万年前 → 今：氷がとけ、海面が上がった
			</text>
		</Panel>
	);
};

// ---- 第14の手がかり 上陸禁止の島 ----

export const ForbiddenRumor: React.FC = () => <BigLine main="上陸したら、最期" sub="「ムーの証拠が眠る、立ち入り禁止の島」" size={130} fill="#0a0e14" />;

export const OkinoshimaMap: React.FC = () => <PacificMap pins={[{at: places.okinoshima, label: '沖ノ島', color: colors.japan}]} />;

export const OkinoshimaRules: React.FC = () => {
	const frame = useCurrentFrame();
	const rules = ['一般の人は上陸できない', '一木一草一石も持ち出さない', '見聞きしたことを口外しない'];
	return (
		<Panel fill="#1a1410">
			<rect x={300} y={70} width={800} height={480} rx={12} fill="#e8dcc0" />
			<text x={700} y={150} textAnchor="middle" {...mincho(56, '#3a2a1a')}>
				沖ノ島の掟
			</text>
			{rules.map((r, i) => (
				<text key={r} x={700} y={270 + i * 100} textAnchor="middle" {...mincho(48, '#3a2a1a')} opacity={fadeIn(frame, 15 + i * 15)}>
					{r}
				</text>
			))}
		</Panel>
	);
};

export const EightyThousand: React.FC = () => (
	<Panel>
		<text x={700} y={200} textAnchor="middle" {...txt(46, colors.muted)}>
			4〜9世紀の祭りの品々、すべて国宝
		</text>
		<text x={700} y={390} textAnchor="middle" {...mincho(190, colors.goldSoft)}>
			約8万<tspan {...txt(80)}>点</tspan>
		</text>
		<text x={700} y={500} textAnchor="middle" {...txt(48)}>
			「海の正倉院」
		</text>
	</Panel>
);

export const SentinelMap: React.FC = () => (
	<Panel fill="#0e2b45">
		<path d="M300 100 Q 380 60 420 200 Q 440 400 380 560 L300 560 Z" fill="#5f7a4e" />
		<circle cx={760} cy={330} r={60} fill="#5f7a4e" />
		<circle cx={760} cy={330} r={150} fill="none" stroke="#e94b3c" strokeWidth={6} strokeDasharray="18 12" />
		<text x={760} y={150} textAnchor="middle" {...txt(44)}>
			北センチネル島
		</text>
		<text x={1060} y={340} {...txt(40, '#e94b3c')}>
			近づくことは禁止
		</text>
		<text x={360} y={600} textAnchor="middle" {...txt(34, colors.muted)}>
			インドのアンダマン諸島
		</text>
	</Panel>
);

export const ProtectReasons: React.FC = () => (
	<Versus
		left={{title: '沖ノ島', lines: ['古代から続く', '祭りの場所を守る'], color: colors.japan}}
		right={{title: '北センチネル島', lines: ['島に暮らす人々を', '病気から守る']}}
		mid=""
	/>
);

// ---- 第15の手がかり 地図から消えた島 ----

export const SandyMap: React.FC = () => (
	<PacificMap
		pins={[
			{at: places.sandy, label: 'サンディ島？', at0: 0},
			{at: places.newcal, label: 'ニューカレドニア', at0: 20, dy: 50},
		]}
	/>
);

export const ChartIsland: React.FC<{readonly erase?: boolean}> = ({erase = false}) => {
	const frame = useCurrentFrame();
	const gone = erase ? interpolate(frame, [30, 80], [1, 0], clamp) : 1;
	return (
		<Panel fill="#d9c7a0">
			{[...Array(9)].map((_, i) => (
				<line key={`v${i}`} x1={i * 175} x2={i * 175} y1={0} y2={620} stroke="#a48b5f" strokeWidth={2} />
			))}
			{[...Array(5)].map((_, i) => (
				<line key={`h${i}`} y1={i * 155} y2={i * 155} x1={0} x2={1400} stroke="#a48b5f" strokeWidth={2} />
			))}
			<path d="M640 200 C 680 180 720 230 715 300 C 708 380 680 420 660 400 C 640 360 630 260 640 200 Z" fill="#c2a46a" stroke="#3a2a1a" strokeWidth={4} opacity={gone} />
			<text x={760} y={310} {...mincho(48, '#3a2a1a')} opacity={gone}>
				Sandy I.
			</text>
			{erase ? (
				<text x={700} y={560} textAnchor="middle" {...txt(48, '#7a2f2a')} opacity={fadeIn(frame, 80)}>
					2012年、地図から消えた
				</text>
			) : null}
		</Panel>
	);
};

export const ChartWithIsland: React.FC = () => <ChartIsland />;
export const ChartErased: React.FC = () => <ChartIsland erase />;

export const DepthSounding: React.FC = () => {
	const frame = useCurrentFrame();
	const ping = (frame % 40) / 40;
	return (
		<SeaSection seaY={140}>
			<path d="M600 140 L760 140 L740 112 L620 112 Z" fill="#d8dde3" />
			<circle cx={680} cy={160} r={40 + ping * 380} fill="none" stroke="#9fd3e8" strokeWidth={4} opacity={1 - ping} />
			<rect y={560} width={1400} height={60} fill="#2a2620" />
			<line x1={1100} x2={1100} y1={150} y2={560} stroke={colors.goldSoft} strokeWidth={5} />
			<text x={1120} y={370} {...txt(44, colors.goldSoft)}>
				約1400m
			</text>
			<text x={300} y={350} {...txt(44)}>
				島どころか、浅瀬もない
			</text>
		</SeaSection>
	);
};

export const SandyTimeline: React.FC = () => (
	<Years
		from={1960}
		to={2020}
		ticks={[
			{at: 1960, label: '1960'},
			{at: 1980, label: '1980'},
			{at: 2000, label: '2000'},
			{at: 2020, label: '2020'},
		]}
		marks={[
			{at: 1974, label: 'フランスの海図から消える', color: colors.muted, t0: 0},
			{at: 2000, label: '無線愛好家が疑う', color: colors.goldSoft, t0: 20, row: 1},
			{at: 2012, label: '研究船が確認', color: '#e94b3c', t0: 40},
		]}
	/>
);

export const OnlyOnPaper: React.FC = () => <BigLine main="地図の上だけで、100年以上" sub="沈んだのでも、隠されたのでもない" size={96} />;
