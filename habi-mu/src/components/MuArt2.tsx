import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {BigLine, Bars, PacificMap, Panel, Versus, Years, clamp, ease, fadeIn, mincho, places, txt} from './MuKit';

// ---- 第6の手がかり ナン・マドール ----

export const PohnpeiMap: React.FC = () => <PacificMap pins={[{at: places.pohnpei, label: 'ポンペイ島', at0: 10}, {at: places.japan, label: '日本', at0: 25, color: colors.japan}]} />;

// 約100の人工島と水路（上から見た図）
export const IsletGrid: React.FC = () => {
	const frame = useCurrentFrame();
	const islets: [number, number, number, number][] = [];
	for (let r = 0; r < 6; r++) {
		for (let c = 0; c < 12; c++) {
			if ((r * 7 + c * 3) % 5 === 0) continue;
			islets.push([140 + c * 95 + (r % 2) * 30, 110 + r * 72, 60 + ((r + c) % 3) * 12, 40 + ((r * c) % 3) * 8]);
		}
	}
	return (
		<Panel fill="#155a6b">
			{islets.map(([x, y, w, h], i) => (
				<rect key={i} x={x} y={y} width={w} height={h} rx={6} fill="#3a3f44" stroke="#22262a" strokeWidth={3} opacity={fadeIn(frame, (i % 20) * 3)} />
			))}
			<text x={700} y={590} textAnchor="middle" {...txt(44, colors.goldSoft)} stroke="#000" strokeWidth={6} paintOrder="stroke" opacity={fadeIn(frame, 40)}>
				およそ100の人工島と、網の目の水路
			</text>
		</Panel>
	);
};

// 井げたに積んだ玄武岩の柱（横から）
export const BasaltCrib: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#101820">
			{[...Array(9)].map((_, r) => (
				<g key={r} opacity={fadeIn(frame, r * 6)}>
					{r % 2 === 0 ? (
						[...Array(7)].map((__, c) => <ellipse key={c} cx={290 + c * 140} cy={520 - r * 46} rx={26} ry={22} fill="#2f353b" stroke="#4a525b" strokeWidth={3} />)
					) : (
						<rect x={250} y={500 - r * 46} width={900} height={40} rx={18} fill="#363d44" stroke="#4a525b" strokeWidth={3} />
					)}
				</g>
			))}
			<g opacity={fadeIn(frame, 60)}>
				<rect x={1180} y={130} width={14} height={400} fill={colors.goldSoft} />
				<text x={1230} y={340} {...txt(40, colors.goldSoft)}>
					人の背より
				</text>
				<text x={1230} y={390} {...txt(40, colors.goldSoft)}>
					ずっと高い
				</text>
			</g>
		</Panel>
	);
};

export const MuCapitalClaim: React.FC = () => <PacificMap mu={0.7} pins={[{at: places.pohnpei, label: 'ムーの都の跡？', at0: 10}]} />;

// サンゴのウラン・トリウム年代測定
export const UThClock: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 100], [0, 1], clamp);
	return (
		<Panel>
			<g transform="translate(330 320)">
				{[...Array(16)].map((_, i) => {
					const a = (i / 16) * Math.PI * 2;
					const th = i / 16 < p;
					return <circle key={i} cx={Math.cos(a) * 160} cy={Math.sin(a) * 160} r={22} fill={th ? '#5fb3a8' : '#e2bb63'} />;
				})}
				<text textAnchor="middle" y={20} {...mincho(60, colors.text)}>
					サンゴ
				</text>
			</g>
			<g transform="translate(720 200)">
				<circle cx={0} cy={0} r={20} fill="#e2bb63" />
				<text x={40} y={14} {...txt(44)}>
					ウラン
				</text>
				<circle cx={0} cy={100} r={20} fill="#5fb3a8" />
				<text x={40} y={114} {...txt(44)}>
					トリウム
				</text>
				<text x={0} y={240} {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
					少しずつ変わる → 年代がわかる
				</text>
			</g>
		</Panel>
	);
};

export const NanMadolDates: React.FC = () => (
	<Years
		from={900}
		to={1400}
		ticks={[
			{at: 900, label: '900年'},
			{at: 1000, label: '1000年'},
			{at: 1100, label: '1100年'},
			{at: 1200, label: '1200年'},
			{at: 1300, label: '1300年'},
		]}
		marks={[
			{at: 1050, label: '建設のピーク（台湾大の研究）', color: '#5fb3a8', t0: 30, row: 1},
			{at: 1190, label: '1180〜1200年ごろ（2016年の研究）', color: colors.goldSoft, t0: 0},
		]}
	/>
);

export const HeianKamakura: React.FC = () => (
	<Versus
		left={{title: 'ナン・マドール', lines: ['およそ800〜1000年前', '石の都が築かれる']}}
		right={{title: '同じころの日本', lines: ['平安時代の終わり', '〜鎌倉時代のはじめ'], color: colors.japan}}
		mid="＝"
	/>
);

export const Not12000: React.FC = () => (
	<Bars
		title="今から何年前？"
		rows={[
			{label: 'ムーが沈んだ（本）', value: 12000, unit: '年前', color: '#8a6e3f'},
			{label: 'ナン・マドール', value: 1000, unit: '年前', color: '#5fb3a8'},
		]}
	/>
);

export const SaudeleurRule: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<g opacity={fadeIn(frame, 0)}>
				<path d="M600 300 L700 120 L800 300 Z" fill={colors.gold} />
				<rect x={600} y={300} width={200} height={60} fill={colors.gold} />
				<text x={700} y={430} textAnchor="middle" {...mincho(60, colors.goldSoft)}>
					シャウテレウル王朝
				</text>
			</g>
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<g key={i} opacity={fadeIn(frame, 20 + i * 6)}>
					<circle cx={200 + i * 200} cy={540} r={22} fill="#cfc6b4" />
					<path d={`M${200 + i * 200} 515 Q ${(200 + i * 200 + 700) / 2} 420 700 370`} stroke={colors.goldSoft} strokeWidth={3} fill="none" strokeDasharray="8 8" />
				</g>
			))}
		</Panel>
	);
};

export const BasaltTons: React.FC = () => (
	<Panel>
		<text x={700} y={250} textAnchor="middle" {...txt(48, colors.muted)}>
			使われた玄武岩
		</text>
		<text x={700} y={420} textAnchor="middle" {...mincho(200, colors.goldSoft)}>
			75万<tspan {...txt(90)}>トン</tspan>
		</text>
	</Panel>
);

export const QuarryRoute: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 80], [0, 1], ease);
	return (
		<Panel fill="#0e3a4e">
			<path d="M300 140 Q 520 70 760 120 Q 1000 180 1020 330 Q 1000 480 760 520 Q 500 540 360 460 Q 230 380 300 140 Z" fill="#4f6b44" stroke="#2b3b25" strokeWidth={4} />
			<circle cx={370} cy={200} r={18} fill={colors.goldSoft} />
			<text x={370} y={160} textAnchor="middle" {...txt(36)}>
				石切り場
			</text>
			<rect x={1050} y={380} width={90} height={60} rx={6} fill="#2f353b" />
			<text x={1095} y={480} textAnchor="middle" {...txt(36)}>
				ナン・マドール
			</text>
			<path d="M370 200 Q 600 40 1000 120 Q 1200 240 1095 380" stroke={colors.goldSoft} strokeWidth={6} fill="none" strokeDasharray="16 12" pathLength={1} style={{strokeDasharray: `${p} 1`}} />
			<text x={700} y={590} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				島の反対側から運ばれた石（陸路なら40キロ以上）
			</text>
		</Panel>
	);
};

export const HowMoved: React.FC = () => (
	<Versus left={{title: 'いかだと潮', lines: ['満ち引きを使う？']}} right={{title: 'てこと人の力', lines: ['大勢で動かす？']}} mid="？" />
);

export const DangerList: React.FC = () => (
	<Years
		from={2010}
		to={2030}
		ticks={[
			{at: 2010, label: '2010'},
			{at: 2015, label: '2015'},
			{at: 2020, label: '2020'},
			{at: 2025, label: '2025'},
		]}
		marks={[{at: 2016, label: '世界遺産 ＋ 危機遺産', color: '#e94b3c', t0: 0}]}
		bands={[{start: 2016, end: 2026, label: '今も危機遺産の一覧に', color: '#7a2f2a', t0: 30}]}
	/>
);

// ---- 第7の手がかり 呪い ----

export const GermanColony: React.FC = () => (
	<Years
		from={1880}
		to={1950}
		ticks={[
			{at: 1880, label: '1880'},
			{at: 1900, label: '1900'},
			{at: 1920, label: '1920'},
			{at: 1940, label: '1940'},
		]}
		marks={[{at: 1907, label: '1907年 ベルクの死', color: '#e94b3c', t0: 40, row: 1}]}
		bands={[
			{start: 1899, end: 1914, label: 'ドイツ', color: '#5a5a6a', t0: 0},
			{start: 1914, end: 1945, label: '日本（南洋群島）', color: colors.japan, t0: 20},
		]}
	/>
);

export const KingTomb: React.FC = () => {
	const frame = useCurrentFrame();
	const glow = 0.5 + 0.5 * Math.sin(frame / 10);
	return (
		<Panel fill="#0a0e14">
			<rect x={300} y={120} width={800} height={400} fill="#262c33" />
			<rect x={420} y={200} width={560} height={260} fill="#14181d" />
			<rect x={560} y={300} width={280} height={110} rx={8} fill="#3a3f44" stroke={colors.gold} strokeWidth={3 + glow * 4} />
			<text x={700} y={575} textAnchor="middle" {...txt(44, colors.goldSoft)}>
				石の都の奥、王の墓
			</text>
		</Panel>
	);
};

export const NightOfCurse: React.FC = () => {
	const frame = useCurrentFrame();
	const flash = frame % 50 < 4 ? 0.5 : 0;
	return (
		<Panel fill="#05070b">
			<rect width={1400} height={620} rx={30} fill="#cfe0ff" opacity={flash} />
			<text x={700} y={330} textAnchor="middle" {...mincho(110, '#e94b3c')} opacity={fadeIn(frame, 10)}>
				墓の主の怒り？
			</text>
		</Panel>
	);
};

export const DeathRecord: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<rect x={380} y={70} width={640} height={480} rx={10} fill="#e8dcc0" />
			<text x={700} y={160} textAnchor="middle" {...mincho(48, '#3a2a1a')}>
				当時の公式の記録
			</text>
			<line x1={440} x2={960} y1={190} y2={190} stroke="#9a8a6a" strokeWidth={3} />
			<text x={700} y={280} textAnchor="middle" {...txt(44, '#3a2a1a')}>
				ヴィクトル・ベルク
			</text>
			<text x={700} y={350} textAnchor="middle" {...txt(40, '#3a2a1a')}>
				1907年4月 死去
			</text>
			<text x={700} y={460} textAnchor="middle" {...mincho(70, '#b03a2a')} opacity={fadeIn(frame, 30)}>
				死因：日射病と疲労
			</text>
		</Panel>
	);
};

export const SunAndStone: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#2a1f12">
			<circle cx={1100} cy={140} r={90 + Math.sin(frame / 8) * 6} fill="#ffcf5a" />
			{[...Array(12)].map((_, i) => {
				const a = (i / 12) * Math.PI * 2;
				return <line key={i} x1={1100 + Math.cos(a) * 110} y1={140 + Math.sin(a) * 110} x2={1100 + Math.cos(a) * 160} y2={140 + Math.sin(a) * 160} stroke="#ffcf5a" strokeWidth={8} />;
			})}
			<rect x={250} y={380} width={420} height={90} rx={30} fill="#2f353b" />
			<rect y={470} width={1400} height={150} fill="#5b4730" />
			<text x={460} y={300} textAnchor="middle" {...txt(48, colors.goldSoft)}>
				赤道に近い島の強い日差し
			</text>
		</Panel>
	);
};

export const NoChainDeaths: React.FC = () => <BigLine main="調べた人が次々に死んだ記録は、ない" size={76} />;

export const AncestorsPlace: React.FC = () => <BigLine main="祖先の王が眠る、大切な場所" sub="呪いの話が伝えるのは、島の人々の思い" size={90} />;

// ---- 第8の手がかり プラチナの棺 ----

export const PlatinumCoffin: React.FC = () => {
	const frame = useCurrentFrame();
	const shine = 0.5 + 0.5 * Math.sin(frame / 9);
	return (
		<Panel fill="#071826">
			<rect y={0} width={1400} height={620} fill="#0b2a40" />
			<rect x={480} y={330} width={440} height={140} rx={30} fill="#d8dde3" opacity={0.5 + shine * 0.4} />
			<rect x={480} y={330} width={440} height={30} rx={14} fill="#ffffff" opacity={shine * 0.5} />
			{[...Array(10)].map((_, i) => (
				<circle key={i} cx={300 + i * 90} cy={560 - ((frame * 1.5 + i * 50) % 500)} r={6 + (i % 3) * 3} fill="#9fd3e8" opacity={0.4} />
			))}
			<text x={700} y={560} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 20)}>
				海外の記事にくり返し出てくる「プラチナの棺」
			</text>
		</Panel>
	);
};

export const JapaneseDiverClaim: React.FC = () => (
	<Versus
		left={{title: '記事に書かれた話', lines: ['日本の潜水夫が見つけた', '海底のプラチナの棺', '記録は戦争で失われた']}}
		right={{title: '確かめられること', lines: ['日本の統治', '1914〜1945年'], color: colors.japan}}
		mid=""
	/>
);

export const NanyoMap: React.FC = () => (
	<PacificMap
		pins={[
			{at: places.pohnpei, label: 'ポンペイ', at0: 10},
			{at: places.mariana, label: 'マリアナ', at0: 20},
			{at: [134.5, 7.5], label: 'パラオ', at0: 30, dy: 50},
			{at: places.japan, label: '日本', at0: 0, color: colors.japan},
		]}
	>
		<rect x={420} y={150} width={420} height={170} rx={20} fill="none" stroke={colors.japan} strokeWidth={5} strokeDasharray="16 10" />
	</PacificMap>
);

export const NoEvidenceList: React.FC = () => {
	const frame = useCurrentFrame();
	const rows = ['棺の写真', '引き上げた記録', '潜水夫の名前'];
	return (
		<Panel>
			{rows.map((r, i) => (
				<g key={r} opacity={fadeIn(frame, i * 14)}>
					<text x={430} y={190 + i * 140} {...txt(60)}>
						{r}
					</text>
					<text x={1010} y={190 + i * 140} textAnchor="middle" {...txt(60, '#e94b3c')}>
						なし
					</text>
				</g>
			))}
		</Panel>
	);
};

export const LostInWar: React.FC = () => <BigLine main="「記録は戦争で失われた」" sub="この一言が、確かめる手段を最初から消している" size={92} />;

export const LidarFields: React.FC = () => {
	const frame = useCurrentFrame();
	const scan = interpolate(frame, [0, 90], [0, 1400], clamp);
	return (
		<Panel fill="#0c1a12">
			<defs>
				<clipPath id="lidarClip">
					<rect width={scan} height={620} />
				</clipPath>
			</defs>
			<rect width={1400} height={620} rx={30} fill="#1f3a22" />
			<g clipPath="url(#lidarClip)">
				{[...Array(10)].map((_, i) => (
					<path key={i} d={`M100 ${120 + i * 45} Q 700 ${90 + i * 45 + (i % 2) * 30} 1300 ${120 + i * 45}`} stroke="#c8e6a0" strokeWidth={4} fill="none" opacity={0.8} />
				))}
			</g>
			<line x1={scan} y1={0} x2={scan} y2={620} stroke="#c8e6a0" strokeWidth={3} />
			<text x={700} y={590} textAnchor="middle" {...txt(42, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				森の下に広がる、畑の跡（レーザー測量）
			</text>
		</Panel>
	);
};

// ---- 第9の手がかり モアイ ----

export const EasterMap: React.FC = () => (
	<PacificMap
		pins={[
			{at: places.easter, label: 'イースター島', at0: 0},
			{at: places.chile, label: 'チリ', at0: 15, dy: 50},
		]}
		routes={[{from: places.easter, to: places.chile, at0: 20, bend: 30}]}
	>
		<text x={1150} y={430} textAnchor="middle" {...txt(40, colors.goldSoft)} stroke="#000" strokeWidth={6} paintOrder="stroke">
			3500キロ以上
		</text>
	</PacificMap>
);

export const MountainTop: React.FC = () => {
	const frame = useCurrentFrame();
	const sea = interpolate(frame, [10, 90], [560, 330], ease);
	return (
		<Panel fill="#0a1626">
			<path d="M150 560 L520 260 L700 150 L880 260 L1250 560 Z" fill="#6b5a3f" />
			<rect y={sea} width={1400} height={620 - sea} fill="#1f5f86" opacity={0.92} />
			<text x={700} y={110} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				山の頂だけが島として残った？（チャーチワードの説）
			</text>
		</Panel>
	);
};

// 海に背を向けるモアイ（上から見た図）
export const FacingInland: React.FC<{readonly show?: 'claim' | 'truth'}> = ({show = 'claim'}) => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#0e3a4e">
			<path d="M300 620 L300 330 Q 700 250 1100 330 L1100 620 Z" fill="#5f7a4e" />
			{[...Array(7)].map((_, i) => (
				<g key={i} transform={`translate(${430 + i * 90} 345)`}>
					<rect x={-22} y={-16} width={44} height={32} rx={8} fill="#7d776b" />
					<path d="M0 16 L0 60" stroke={colors.goldSoft} strokeWidth={5} opacity={fadeIn(frame, 20)} />
					<path d="M-10 50 L0 66 L10 50" stroke={colors.goldSoft} strokeWidth={5} fill="none" opacity={fadeIn(frame, 20)} />
				</g>
			))}
			{show === 'truth' ? (
				<g opacity={fadeIn(frame, 40)}>
					{[520, 700, 880].map((x) => (
						<rect key={x} x={x - 40} y={480} width={80} height={60} fill="#c9a56a" />
					))}
					<text x={700} y={600} textAnchor="middle" {...txt(40, colors.goldSoft)}>
						村
					</text>
				</g>
			) : null}
			<text x={700} y={130} textAnchor="middle" {...txt(44)}>
				海
			</text>
		</Panel>
	);
};

export const FacingClaim: React.FC = () => <FacingInland show="claim" />;
export const FacingVillage: React.FC = () => <FacingInland show="truth" />;

export const WatchOrBarrier: React.FC = () => <BigLine main="見張り？ それとも、結界？" size={110} fill="#0a0e14" />;

export const AncestorGaze: React.FC = () => <BigLine main="見張るのではなく、見守る" sub="モアイは、一族の祖先の姿" size={110} />;

export const RanoRarakuSection: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#1a2430">
			<path d="M100 560 Q 400 150 700 140 Q 1000 150 1300 560 Z" fill="#6b5a3f" />
			{[...Array(9)].map((_, i) => (
				<g key={i} transform={`translate(${330 + i * 85} ${470 - Math.sin((i / 8) * Math.PI) * 180}) rotate(${-20 + i * 5})`} opacity={fadeIn(frame, i * 5)}>
					<path d="M-14 40 L-12 -20 Q -10 -40 0 -40 Q 10 -40 12 -20 L14 40 Z" fill="#8d8a80" />
				</g>
			))}
			<text x={700} y={600} textAnchor="middle" {...txt(42, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				ラノ・ララクの石切り場（火山灰が固まった岩）
			</text>
		</Panel>
	);
};

// ---- 第10の手がかり 歩くモアイ ----

export const MoaiSize: React.FC = () => (
	<Panel>
		<path d="M560 560 L575 200 Q580 110 650 105 Q720 110 725 200 L740 560 Z" fill="#7d776b" />
		<rect x={900} y={360} width={60} height={200} rx={30} fill="#cfc6b4" />
		<circle cx={930} cy={330} r={30} fill="#cfc6b4" />
		<line x1={480} y1={105} x2={480} y2={560} stroke={colors.goldSoft} strokeWidth={5} />
		<text x={460} y={340} textAnchor="end" {...txt(44, colors.goldSoft)}>
			10m近く
		</text>
		<text x={1100} y={300} {...txt(44)}>
			数十トン
		</text>
	</Panel>
);

export const SledgeTheory: React.FC = () => {
	const frame = useCurrentFrame();
	const x = interpolate(frame, [0, 150], [300, 520], clamp);
	return (
		<Panel>
			<rect y={480} width={1400} height={140} fill="#5b4730" />
			{[...Array(6)].map((_, i) => (
				<circle key={i} cx={x + i * 90} cy={470} r={16} fill="#7a5a3a" />
			))}
			<g transform={`translate(${x} 0)`}>
				<path d="M0 455 L400 455 Q 440 420 400 400 L60 400 Q 0 410 0 455 Z" fill="#7d776b" />
			</g>
			{[...Array(8)].map((_, i) => (
				<g key={i} transform={`translate(${x + 520 + i * 70} 430)`}>
					<circle cy={-50} r={14} fill="#cfc6b4" />
					<rect x={-12} y={-36} width={24} height={50} rx={8} fill="#cfc6b4" />
				</g>
			))}
			<line x1={x + 420} y1={420} x2={x + 1060} y2={400} stroke={colors.goldSoft} strokeWidth={4} />
			<text x={700} y={110} textAnchor="middle" {...txt(48, colors.muted)}>
				寝かせて、引きずった？
			</text>
		</Panel>
	);
};

export const WalkedLegend: React.FC = () => <BigLine main="「モアイは、歩いた」" sub="島に伝わる言い伝え" size={130} />;

export const RoadMoaiCount: React.FC = () => (
	<Bars
		title="2025年の研究で調べたモアイ"
		rows={[
			{label: '島のモアイ', value: 962, unit: '体', color: '#8d8a80'},
			{label: '道のモアイ', value: 62, unit: '体', color: colors.gold},
		]}
	/>
);

export const DBaseLean: React.FC = () => {
	const frame = useCurrentFrame();
	const lean = interpolate(frame, [20, 60], [0, 12], ease);
	return (
		<Panel>
			<g transform={`translate(420 520) rotate(${lean}) translate(-420 -520)`}>
				<path d="M350 520 L360 230 Q365 160 420 155 Q475 160 480 230 L490 520 Z" fill="#7d776b" />
			</g>
			<line x1={420} y1={520} x2={420} y2={140} stroke={colors.muted} strokeWidth={3} strokeDasharray="10 8" />
			<text x={560} y={220} {...txt(46, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				前に6〜15度かたむく
			</text>
			<path d="M900 300 Q 1000 210 1100 300 L1100 420 L900 420 Z" fill="#7d776b" opacity={fadeIn(frame, 10)} />
			<text x={1000} y={490} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 20)}>
				底はDの字の形
			</text>
		</Panel>
	);
};

export const RopeWalk: React.FC = () => {
	const frame = useCurrentFrame();
	const sway = Math.sin(frame / 10);
	const x = interpolate(frame, [0, 240], [460, 940], clamp);
	return (
		<Panel>
			<rect y={500} width={1400} height={120} fill="#5b4730" />
			<g transform={`translate(${x} 500) rotate(${sway * 7}) translate(${-x} -500)`}>
				<path d={`M${x - 70} 500 L${x - 60} 230 Q${x - 55} 160 ${x} 155 Q${x + 55} 160 ${x + 60} 230 L${x + 70} 500 Z`} fill="#7d776b" />
			</g>
			<path d={`M${x} 200 Q ${x - 200} ${240 + sway * 30} ${x - 380} 330`} stroke={colors.goldSoft} strokeWidth={5} fill="none" />
			<path d={`M${x} 200 Q ${x + 200} ${240 - sway * 30} ${x + 380} 330`} stroke={colors.goldSoft} strokeWidth={5} fill="none" />
			<text x={700} y={90} textAnchor="middle" {...txt(46)}>
				左右から交互にロープを引く
			</text>
		</Panel>
	);
};

export const EighteenPeople: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			{[...Array(18)].map((_, i) => (
				<g key={i} transform={`translate(${190 + (i % 9) * 125} ${200 + Math.floor(i / 9) * 150})`} opacity={fadeIn(frame, i * 3)}>
					<circle cy={-40} r={20} fill="#cfc6b4" />
					<rect x={-17} y={-20} width={34} height={60} rx={12} fill="#cfc6b4" />
				</g>
			))}
			<text x={700} y={560} textAnchor="middle" {...mincho(70, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				18人・100メートル・40分
			</text>
		</Panel>
	);
};

export const ConcaveRoad: React.FC = () => (
	<Panel>
		<path d="M200 300 L450 300 Q 700 420 950 300 L1200 300 L1200 520 L200 520 Z" fill="#6b5a3f" />
		<line x1={450} y1={250} x2={950} y2={250} stroke={colors.goldSoft} strokeWidth={5} />
		<text x={700} y={220} textAnchor="middle" {...txt(46, colors.goldSoft)}>
			幅およそ4.5メートル
		</text>
		<text x={700} y={480} textAnchor="middle" {...txt(42)}>
			まんなかが少しへこんだ道
		</text>
	</Panel>
);

export const ThreeAgree: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['島の言い伝え', '遺物の形', '実験の結果'];
	return (
		<Panel>
			{items.map((t, i) => (
				<g key={t} opacity={fadeIn(frame, i * 12)}>
					<circle cx={300 + i * 400} cy={250} r={130} fill="rgba(226,187,99,0.12)" stroke={colors.gold} strokeWidth={4} />
					<text x={300 + i * 400} y={265} textAnchor="middle" {...txt(44)}>
						{t}
					</text>
				</g>
			))}
			<text x={700} y={520} textAnchor="middle" {...mincho(64, colors.goldSoft)} opacity={fadeIn(frame, 45)}>
				3つが、同じ答えを指している
			</text>
		</Panel>
	);
};
