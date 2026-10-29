import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {BigLine, PacificMap, Panel, SeaSection, Versus, Years, clamp, ease, fadeIn, mincho, places, txt} from './MuKit';

// ---- 第16の手がかり レムリア ----

export const LemurPuzzle: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#0e2b45">
			<path d="M180 120 Q 420 80 560 200 Q 620 380 470 540 L180 540 Z" fill="#5f7a4e" />
			<path d="M640 330 Q 700 300 720 380 Q 700 480 650 470 Q 620 420 640 330 Z" fill="#5f7a4e" />
			<path d="M980 120 Q 1160 120 1180 260 Q 1120 420 1040 420 Q 960 300 980 120 Z" fill="#5f7a4e" />
			<text x={350} y={330} textAnchor="middle" {...txt(44)}>
				アフリカ
			</text>
			<text x={680} y={530} textAnchor="middle" {...txt(36)}>
				マダガスカル
			</text>
			<text x={1080} y={460} textAnchor="middle" {...txt(44)}>
				インド
			</text>
			<g opacity={fadeIn(frame, 20)}>
				<circle cx={680} cy={390} r={18} fill={colors.goldSoft} />
				<circle cx={1080} cy={260} r={18} fill={colors.goldSoft} />
			</g>
			<text x={350} y={420} textAnchor="middle" {...txt(44, '#e94b3c')} opacity={fadeIn(frame, 40)}>
				化石なし
			</text>
			<path d="M700 380 Q 880 260 1060 270" stroke={colors.goldSoft} strokeWidth={6} fill="none" strokeDasharray="16 12" opacity={fadeIn(frame, 60)} />
			<text x={880} y={230} textAnchor="middle" {...mincho(48, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				沈んだ陸の橋？
			</text>
		</Panel>
	);
};

export const LemuriaBridge: React.FC = () => {
	const frame = useCurrentFrame();
	const sink = interpolate(frame, [40, 120], [0, 1], clamp);
	return (
		<Panel fill="#0e2b45">
			<path d="M640 330 Q 700 300 720 380 Q 700 480 650 470 Q 620 420 640 330 Z" fill="#5f7a4e" />
			<path d="M980 120 Q 1160 120 1180 260 Q 1120 420 1040 420 Q 960 300 980 120 Z" fill="#5f7a4e" />
			<path d="M700 360 Q 850 280 1000 260 L1010 320 Q 860 340 720 420 Z" fill="#8a6e3f" opacity={1 - sink * 0.8} transform={`translate(0 ${sink * 30})`} />
			<text x={860} y={200} textAnchor="middle" {...mincho(70, colors.goldSoft)}>
				レムリア
			</text>
			<text x={700} y={580} textAnchor="middle" {...txt(40, colors.muted)}>
				1864年、スクレーターの考えた「沈んだ陸の橋」
			</text>
		</Panel>
	);
};

export const FixedContinents: React.FC = () => <BigLine main="大陸の形は、昔から変わらない" sub="19世紀の科学者たちの前提" size={92} />;

export const DriftApart: React.FC = () => {
	const frame = useCurrentFrame();
	const d = interpolate(frame, [10, 140], [0, 1], ease);
	return (
		<Panel fill="#0e2b45">
			<g transform={`translate(${-d * 200} ${d * 40})`}>
				<path d="M430 240 Q 490 210 510 290 Q 490 390 440 380 Q 410 330 430 240 Z" fill="#5f7a4e" />
				<text x={470} y={450} textAnchor="middle" {...txt(36)}>
					マダガスカル
				</text>
			</g>
			<g transform={`translate(${d * 260} ${-d * 120})`}>
				<path d="M520 220 Q 640 200 660 300 Q 620 400 560 400 Q 510 320 520 220 Z" fill="#86a06e" />
				<text x={590} y={460} textAnchor="middle" {...txt(36)}>
					インド
				</text>
			</g>
			<text x={700} y={90} textAnchor="middle" {...mincho(56, colors.goldSoft)}>
				大陸そのものが、動いている
			</text>
			<text x={700} y={580} textAnchor="middle" {...txt(40, colors.muted)}>
				1912年 ヴェーゲナー
			</text>
		</Panel>
	);
};

export const PlateAccepted: React.FC = () => (
	<Years
		from={1850}
		to={2000}
		ticks={[
			{at: 1850, label: '1850'},
			{at: 1900, label: '1900'},
			{at: 1950, label: '1950'},
			{at: 2000, label: '2000'},
		]}
		marks={[
			{at: 1864, label: 'レムリア', color: colors.muted, t0: 0},
			{at: 1912, label: '大陸移動説', color: colors.goldSoft, t0: 20, row: 1},
		]}
		bands={[{start: 1960, end: 1975, label: 'プレートテクトニクス', color: '#3d7a5a', t0: 40}]}
	/>
);

// ---- 第17の手がかり 海の底 ----

export const GraniteMu: React.FC = () => <BigLine main="ムーの地面は、花こう岩" sub="チャーチワード自身の記述" size={110} />;

export const CrustSection: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<SeaSection seaY={150}>
			<rect y={520} width={1400} height={100} fill="#6b2a1a" />
			<g opacity={fadeIn(frame, 0)}>
				<path d="M0 120 L520 120 L560 170 L560 520 L0 520 Z" fill="#c9a77a" />
				<text x={260} y={340} textAnchor="middle" {...mincho(56, '#3a2a1a')}>
					大陸の地殻
				</text>
				<text x={260} y={410} textAnchor="middle" {...txt(36, '#3a2a1a')}>
					軽い・厚い（30km以上）
				</text>
			</g>
			<g opacity={fadeIn(frame, 25)}>
				<rect x={560} y={420} width={840} height={100} fill="#3a3f4c" />
				<text x={980} y={480} textAnchor="middle" {...txt(36)}>
					海の地殻：玄武岩・重い・うすい（7km ほど）
				</text>
			</g>
		</SeaSection>
	);
};

export const WoodAndStone: React.FC = () => {
	const frame = useCurrentFrame();
	const fall = interpolate(frame, [20, 80], [0, 1], ease);
	return (
		<Panel>
			<rect x={250} y={200} width={900} height={330} rx={20} fill="#1f5f86" opacity={0.7} />
			<rect x={420} y={180} width={200} height={50} rx={10} fill="#b08a5a" />
			<text x={520} y={150} textAnchor="middle" {...txt(40)}>
				木＝大陸
			</text>
			<rect x={800} y={200 + fall * 270} width={110} height={60} rx={12} fill="#3a3f4c" />
			<text x={855} y={150} textAnchor="middle" {...txt(40)}>
				石＝海の地殻
			</text>
		</Panel>
	);
};

export const NoSunkenCrust: React.FC = () => <BigLine main="太平洋の深い海底は、玄武岩" sub="大陸がまるごと沈んだ跡は、見つかっていない" size={90} />;

export const EchoSounder: React.FC = () => {
	const frame = useCurrentFrame();
	const ping = (frame % 45) / 45;
	return (
		<SeaSection seaY={130}>
			<path d="M560 130 L840 130 L800 92 L600 92 Z" fill="#7a8a9a" />
			<rect x={660} y={60} width={60} height={34} fill="#7a8a9a" />
			<circle cx={700} cy={150} r={30 + ping * 350} fill="none" stroke="#9fd3e8" strokeWidth={4} opacity={1 - ping} />
			<path d="M300 620 L520 360 L880 360 L1100 620 Z" fill="#3e4b55" />
			<text x={700} y={600} textAnchor="middle" {...txt(40, colors.goldSoft)}>
				音で深さを測ると、頂上が平らな山が
			</text>
		</SeaSection>
	);
};

export const GuyotStory: React.FC = () => {
	const frame = useCurrentFrame();
	const stage = interpolate(frame, [0, 60, 120, 180], [0, 1, 2, 3], clamp);
	const top = stage < 1 ? 160 : stage < 2 ? 220 : 220;
	const sink = Math.max(0, stage - 2) * 180;
	return (
		<SeaSection seaY={230}>
			<g transform={`translate(0 ${sink})`}>
				{stage < 1.5 ? (
					<path d={`M380 620 L620 ${top} Q700 ${top - 60} 780 ${top} L1020 620 Z`} fill="#6b5a3f" />
				) : (
					<path d="M380 620 L620 230 L780 230 L1020 620 Z" fill="#5b4a35" />
				)}
				<rect x={620} y={222} width={160} height={14} fill="#d9a7a0" opacity={Math.min(1, Math.max(0, stage - 1.6))} />
			</g>
			<text x={700} y={100} textAnchor="middle" {...txt(44)}>
				{stage < 1 ? '火山の島' : stage < 2 ? '波に削られて平らに' : '何百万年もかけて沈む'}
			</text>
		</SeaSection>
	);
};

export const CoralOnTop: React.FC = () => <BigLine main="頂上から、浅い海のサンゴの化石" sub="深い海底の山は、昔、浅い海にあった" size={86} />;

// ---- 第18の手がかり 日本 ----

export const RingOfFire: React.FC = () => {
	const frame = useCurrentFrame();
	const pts: [number, number][] = [[-71, -40], [-78, -5], [-90, 13], [-110, 25], [-125, 45], [-150, 58], [170, 52], [145, 40], [140, 30], [125, 10], [120, -5], [150, -8], [170, -18], [178, -38]];
	return (
		<PacificMap pins={[{at: places.japan, label: '日本', color: colors.japan}]}>
			{pts.map(([lo, la], i) => {
				const L = lo < 0 ? lo + 360 : lo;
				const x = ((L - 100) / 200) * 1400;
				const y = ((55 - la) / 110) * 620;
				return <circle key={i} cx={x} cy={y} r={14} fill="#e94b3c" opacity={0.4 + 0.5 * Math.abs(Math.sin(frame / 15 + i))} />;
			})}
		</PacificMap>
	);
};

export const Subduction: React.FC = () => {
	const frame = useCurrentFrame();
	const slide = (frame / 3) % 60;
	return (
		<SeaSection seaY={150}>
			<path d="M700 170 L1400 170 L1400 620 L900 620 Z" fill="#c9a77a" />
			<text x={1120} y={300} textAnchor="middle" {...mincho(50, '#3a2a1a')}>
				陸のプレート
			</text>
			<path d="M0 360 L640 360 L1000 620 L0 620 Z" fill="#3a3f4c" />
			{[...Array(6)].map((_, i) => (
				<path key={i} d={`M${100 + i * 110 + slide} 400 l 40 0 l -10 -10 M${140 + i * 110 + slide} 400 l -10 10`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />
			))}
			<text x={320} y={520} textAnchor="middle" {...mincho(50)}>
				海のプレート
			</text>
			<text x={760} y={120} textAnchor="middle" {...txt(40, colors.goldSoft)}>
				もぐりこむときのひずみ → 地震
			</text>
		</SeaSection>
	);
};

export const NotGasCollapse: React.FC = () => (
	<Versus
		left={{title: '本に書かれた仕組み', lines: ['地下のガスが爆発', '大陸がまるごと落ちる'], color: colors.muted}}
		right={{title: '日本列島で起きること', lines: ['プレートのひずみ', '地震・火山・津波'], color: colors.japan}}
	/>
);

export const PrepareReal: React.FC = () => <BigLine main="備えるのは、本当の地震と津波" sub="ハザードマップと避難の場所を、一度確かめよう" size={90} />;

export const NoMuNoRoots: React.FC = () => <BigLine main="ないものは、ルーツにならない" size={104} />;

export const JapanAncestors: React.FC = () => (
	<PacificMap
		pins={[{at: places.japan, label: '日本列島', color: colors.japan, at0: 50}]}
		routes={[
			{from: [125, 50], to: [141, 43], at0: 0, color: colors.japan},
			{from: [120, 36], to: [131, 34], at0: 15, color: colors.japan},
			{from: [121, 24], to: [129, 29], at0: 30, color: colors.japan, bend: 20},
		]}
	>
		<text x={300} y={560} textAnchor="middle" {...txt(40, colors.goldSoft)} stroke="#000" strokeWidth={6} paintOrder="stroke">
			いくつもの道で、何万年もかけて
		</text>
	</PacificMap>
);

export const EighteenDone: React.FC = () => <BigLine main="18の手がかり、ムー大陸はどこにもなかった" size={74} />;

// ---- 本当に沈んでいた大陸 ----

export const ZealandiaMap: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<PacificMap zealandia={interpolate(frame, [10, 60], [0, 1], clamp)} pins={[{at: places.nz, label: 'ニュージーランド', at0: 0, dy: 60}, {at: places.newcal, label: 'ニューカレドニア', at0: 20}]} />
	);
};

export const Zealandia94: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 70], [0, 94], ease);
	return (
		<SeaSection seaY={200}>
			<path d="M150 620 L300 260 Q 700 230 1100 260 L1250 620 Z" fill="#5f7d6a" opacity={0.85} />
			<path d="M560 200 L620 140 L660 200 Z M780 200 L840 120 L880 200 Z" fill="#6b8a4e" />
			<text x={700} y={460} textAnchor="middle" {...mincho(150, colors.goldSoft)}>
				{Math.round(p)}%
			</text>
			<text x={700} y={560} textAnchor="middle" {...txt(44)}>
				が海の下（約490万km²）
			</text>
		</SeaSection>
	);
};

export const GondwanaStretch: React.FC = () => {
	const frame = useCurrentFrame();
	const s = interpolate(frame, [10, 120], [1, 1.7], ease);
	const thin = interpolate(frame, [10, 120], [160, 60], ease);
	return (
		<SeaSection seaY={180}>
			<g transform={`translate(700 0) scale(${s} 1) translate(-700 0)`}>
				<rect x={450} y={240 + (160 - thin)} width={500} height={thin} fill="#c9a77a" />
			</g>
			<text x={700} y={110} textAnchor="middle" {...txt(42)}>
				ゴンドワナから分かれるとき、引きのばされてうすくなった
			</text>
			<text x={700} y={560} textAnchor="middle" {...txt(40, colors.goldSoft)}>
				うすい地殻は低く沈み、海の下へ（何千万年もかけて）
			</text>
		</SeaSection>
	);
};

export const Doggerland: React.FC = () => {
	const frame = useCurrentFrame();
	const sea = interpolate(frame, [20, 160], [0, 1], clamp);
	return (
		<Panel fill="#0e2b45">
			<path d="M200 100 Q 330 80 380 200 Q 400 330 330 470 Q 260 520 220 420 Q 160 300 200 100 Z" fill="#5f7a4e" />
			<path d="M960 220 Q 1100 200 1260 260 L1260 520 L980 520 Q 920 400 960 220 Z" fill="#5f7a4e" />
			<path d="M380 260 Q 650 200 960 260 L960 470 Q 650 520 330 470 Z" fill="#7a8a4e" opacity={1 - sea * 0.85} />
			<text x={290} y={560} textAnchor="middle" {...txt(36)}>
				イギリス
			</text>
			<text x={1110} y={570} textAnchor="middle" {...txt(36)}>
				オランダ
			</text>
			<text x={660} y={380} textAnchor="middle" {...mincho(56, colors.goldSoft)}>
				ドッガーランド
			</text>
			<text x={700} y={80} textAnchor="middle" {...txt(40, colors.muted)}>
				人が暮らした陸が、海面の上昇で北海の底に
			</text>
		</Panel>
	);
};

export const RealStories: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['石の都を築いた人々', '星を読んで海を渡った人々', '石像を歩かせた人々', '海の下に眠る本物の大陸'];
	return (
		<Panel>
			{items.map((t, i) => (
				<text key={t} x={700} y={150 + i * 115} textAnchor="middle" {...mincho(58, i === 3 ? colors.goldSoft : colors.text)} opacity={fadeIn(frame, i * 20)}>
					{t}
				</text>
			))}
		</Panel>
	);
};

// ---- まだ解けていない謎 ----

export const RongorongoGlyphs: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#2a1d12">
			<rect x={150} y={150} width={1100} height={320} rx={80} fill="#6b4a2f" />
			{[...Array(4)].map((_, r) => (
				<g key={r} opacity={0.5 + 0.5 * Math.abs(Math.sin(frame / 20 + r))}>
					{[...Array(16)].map((__, c) => {
						const x = 220 + c * 62;
						const y = 190 + r * 70;
						const k = (r * 16 + c) % 4;
						return k === 0 ? (
							<path key={c} d={`M${x} ${y + 40} l 14 -40 l 14 40 M${x + 14} ${y} v -10`} stroke="#e8dcc0" strokeWidth={4} fill="none" />
						) : k === 1 ? (
							<path key={c} d={`M${x} ${y + 20} q 16 -24 30 0 q -14 20 -30 0`} stroke="#e8dcc0" strokeWidth={4} fill="none" />
						) : k === 2 ? (
							<circle key={c} cx={x + 15} cy={y + 20} r={14} stroke="#e8dcc0" strokeWidth={4} fill="none" />
						) : (
							<path key={c} d={`M${x} ${y} l 30 40 M${x + 30} ${y} l -30 40`} stroke="#e8dcc0" strokeWidth={4} />
						);
					})}
				</g>
			))}
		</Panel>
	);
};

export const UnderThirty: React.FC = () => (
	<Panel>
		<text x={700} y={220} textAnchor="middle" {...txt(46, colors.muted)}>
			残っているロンゴロンゴ
		</text>
		<text x={700} y={400} textAnchor="middle" {...mincho(170, colors.goldSoft)}>
			30点未満
		</text>
		<text x={700} y={500} textAnchor="middle" {...txt(48)}>
			そして、誰にも読めない
		</text>
	</Panel>
);

export const IndusClaim: React.FC = () => (
	<Versus
		left={{title: '1930年代の主張', lines: ['ロンゴロンゴと', 'インダス文字は', 'そっくり']}}
		right={{title: '今の研究', lines: ['写し方が不正確', '似ているのは', '単純な形だけ'], color: colors.muted}}
	/>
);

export const RomeTablets: React.FC = () => {
	const frame = useCurrentFrame();
	const labels = ['18〜19世紀', '18〜19世紀', '18〜19世紀', '1493〜1509年'];
	return (
		<Panel>
			{labels.map((l, i) => (
				<g key={i} opacity={fadeIn(frame, i * 14)}>
					<rect x={140 + i * 300} y={170} width={240} height={180} rx={50} fill={i === 3 ? '#8a5a2f' : '#6b4a2f'} stroke={i === 3 ? colors.goldSoft : 'none'} strokeWidth={6} />
					<text x={260 + i * 300} y={420} textAnchor="middle" {...txt(38, i === 3 ? colors.goldSoft : colors.muted)}>
						{l}
					</text>
				</g>
			))}
			<text x={700} y={530} textAnchor="middle" {...txt(42)} opacity={fadeIn(frame, 60)}>
				ローマの4枚の板の、木が切られた年代（2024年）
			</text>
		</Panel>
	);
};

export const BeforeEuropeans: React.FC = () => (
	<Years
		from={1450}
		to={1800}
		ticks={[
			{at: 1500, label: '1500'},
			{at: 1600, label: '1600'},
			{at: 1700, label: '1700'},
			{at: 1800, label: '1800'},
		]}
		marks={[
			{at: 1501, label: '最も古い板の木', color: colors.goldSoft, t0: 0},
			{at: 1722, label: 'ヨーロッパの船', color: colors.muted, t0: 25, row: 1},
		]}
		bands={[{start: 1501, end: 1722, label: '200年以上前', color: '#3d5f8a', t0: 45}]}
	/>
);

export const ScriptInventions: React.FC = () => (
	<PacificMap
		pins={[
			{at: places.easter, label: 'イースター島？', color: colors.goldSoft, at0: 50},
			{at: [-90, 17], label: 'マヤ', at0: 30},
			{at: [113, 34], label: '中国', at0: 15},
		]}
	>
		<text x={230} y={560} textAnchor="middle" {...txt(36, colors.muted)} stroke="#000" strokeWidth={6} paintOrder="stroke">
			メソポタミア・エジプト（地図の外）
		</text>
	</PacificMap>
);

export const WhenCarved: React.FC = () => <BigLine main="木が切られた年代は、わかった" sub="文字が刻まれたのは、いつ？" size={96} />;

export const SeaOfMystery: React.FC = () => {
	const frame = useCurrentFrame();
	return <PacificMap pins={[{at: places.easter, label: '？', at0: 0}]} sea={frame % 2 === 0 ? '#0e2b45' : '#0e2b45'} />;
};
