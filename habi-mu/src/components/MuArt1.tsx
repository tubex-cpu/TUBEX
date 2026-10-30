import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {BigLine, Panel, Versus, Years, clamp, ease, fadeIn, mincho, places, txt} from './MuKit';
import {GeoMap, MapNote} from './MuMap';

// ---- 謎の先出し ----

// 1万2000年前の太平洋に、巨大な大陸が浮かび上がる
export const MuRises: React.FC = () => {
	const frame = useCurrentFrame();
	return <GeoMap view="pacific" focus={[195, 0]} zoom={1.1} mu={interpolate(frame, [10, 70], [0, 1], clamp)} />;
};


// 7つの大都市と6400万人
export const MuCities: React.FC = () => {
	const frame = useCurrentFrame();
	const cities: [number, number][] = [[165, 10], [185, 18], [205, 8], [222, 0], [180, -5], [200, -15], [235, -18]];
	const n = Math.round(interpolate(frame, [20, 90], [0, 6400], ease));
	return (
		<GeoMap view="pacific" focus={[200, 0]} zoom={1.12} mu={1}>
			{(p) => (
				<>
					{cities.map(([lo, la], i) => {
						const [x, y] = p(lo, la);
						return (
							<g key={i} opacity={fadeIn(frame, i * 8)}>
								<circle cx={x} cy={y} r={30} fill={colors.goldSoft} opacity={0.25} />
								<circle cx={x} cy={y} r={13} fill={colors.goldSoft} stroke="#000" strokeWidth={3} />
							</g>
						);
					})}
					<text x={960} y={600} textAnchor="middle" {...mincho(140, colors.goldSoft)} stroke="#000" strokeWidth={12} strokeOpacity={0.85} paintOrder="stroke">
						{n.toLocaleString('ja-JP')}
						<tspan {...txt(84)}>万人</tspan>
					</text>
				</>
			)}
		</GeoMap>
	);
};


// ひと晩で海に呑まれる
export const MuSinking: React.FC = () => {
	const frame = useCurrentFrame();
	const sink = interpolate(frame, [20, 150], [0, 1], clamp);
	const flash = frame % 24 < 3 && frame < 120 ? 0.22 : 0;
	return (
		<GeoMap view="pacific" focus={[200, -2]} zoom={1.16} mu={1} muSink={sink}>
			{() => <rect width={1920} height={1080} fill="#ff7a3a" opacity={flash} />}
		</GeoMap>
	);
};


export const MuNameReveal: React.FC = () => <BigLine main="ムー" sub="太平洋に沈んだとされる大陸" size={220} />;

// 生き残りが島々へ
export const SurvivorsFlee: React.FC = () => (
	<GeoMap
		view="pacific"
		mu={0.25}
		pins={[
			{at: places.pohnpei, label: 'ポンペイ', at0: 20},
			{at: places.easter, label: 'イースター島', at0: 35},
			{at: places.hawaii, label: 'ハワイ', at0: 50},
		]}
		routes={[
			{from: [190, 0], to: places.pohnpei, at0: 10},
			{from: [215, -10], to: places.easter, at0: 25, bend: -40},
			{from: [200, 10], to: places.hawaii, at0: 40},
		]}
	/>
);


// 日本人のルーツは、ムー？
export const JapanRootsClaim: React.FC = () => (
	<GeoMap
		view="pacific"
		focus={[150, 30]}
		zoom={1.18}
		mu={0.6}
		pins={[{at: places.japan, label: '日本', color: colors.japan, at0: 10, dy: 60}]}
		routes={[{from: [175, 15], to: places.japan, at0: 20, color: colors.japan}]}
	/>
);


export const LastFragment: React.FC = () => <BigLine main="沈んだ大陸の、最後のかけら？" size={84} />;

// 記録が見つからない
export const NoOldRecord: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			{[0, 1, 2, 3, 4].map((i) => (
				<g key={i} transform={`translate(${160 + i * 230} 170)`} opacity={fadeIn(frame, i * 8)}>
					<rect width={170} height={230} rx={10} fill="#3a2c1c" stroke="#6b5235" strokeWidth={4} />
					<line x1={30} x2={140} y1={60} y2={60} stroke="#6b5235" strokeWidth={6} />
					<line x1={30} x2={120} y1={100} y2={100} stroke="#6b5235" strokeWidth={6} />
					<text x={85} y={185} textAnchor="middle" {...mincho(90, '#e94b3c')} opacity={fadeIn(frame, 40 + i * 8)}>
						？
					</text>
				</g>
			))}
			<text x={700} y={520} textAnchor="middle" {...txt(50, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				ムーを書き残した古い記録は、どこに？
			</text>
		</Panel>
	);
};

export const WhoCounted: React.FC = () => <BigLine main="6400万人を、誰が数えた？" size={92} />;

export const WalkingStatueTease: React.FC = () => {
	const frame = useCurrentFrame();
	const sway = Math.sin(frame / 8) * 8;
	return (
		<Panel>
			<g transform={`translate(700 520) rotate(${sway}) translate(-700 -520)`}>
				<path d="M640 520 L650 250 Q652 170 700 165 Q748 170 750 250 L760 520 Z" fill="#7d776b" />
				<rect x={662} y={215} width={76} height={18} fill="#5f5a50" />
				<path d="M700 260 L714 330 L692 334" stroke="#4f4a42" strokeWidth={8} fill="none" />
				<line x1={676} y1={372} x2={724} y2={372} stroke="#4f4a42" strokeWidth={8} />
			</g>
			<path d={`M700 200 Q 420 ${180 + sway * 3} 220 240`} stroke={colors.goldSoft} strokeWidth={5} fill="none" />
			<path d={`M700 200 Q 980 ${180 - sway * 3} 1180 240`} stroke={colors.goldSoft} strokeWidth={5} fill="none" />
			<text x={700} y={590} textAnchor="middle" {...txt(46, colors.goldSoft)} opacity={fadeIn(frame, 20)}>
				2025年秋の研究
			</text>
		</Panel>
	);
};

// 最新の科学：3つの技術が、謎に光を当てる
export const ScienceNow: React.FC = () => {
	const frame = useCurrentFrame();
	const items = [
		{title: '人工知能', sub: '衛星写真を読む', c: '#7fd6e8'},
		{title: '遺伝子', sub: '古い骨を調べる', c: colors.goldSoft},
		{title: 'レーザー', sub: '空から地形を測る', c: '#a6e07f'},
	];
	return (
		<Panel>
			{items.map((it, i) => {
				const x = 250 + i * 450;
				const o = fadeIn(frame, 8 + i * 16);
				const r = 120 + 8 * Math.sin(frame / 12 + i);
				return (
					<g key={it.title} opacity={o} transform={`translate(0 ${interpolate(frame, [8 + i * 16, 38 + i * 16], [30, 0], ease)})`}>
						<circle cx={x} cy={260} r={r + 30} fill={it.c} opacity={0.08} />
						<circle cx={x} cy={260} r={r} fill="rgba(4,10,22,0.9)" stroke={it.c} strokeWidth={4} />
						{i === 0 ? (
							<g stroke={it.c} strokeWidth={4} fill="none">
								{[...Array(4)].map((_, k) => (
									<rect key={k} x={x - 70 + (k % 2) * 74} y={190 + Math.floor(k / 2) * 74} width={66} height={66} opacity={((frame / 6 + k) % 4) < 2 ? 1 : 0.35} />
								))}
							</g>
						) : i === 1 ? (
							<g stroke={it.c} strokeWidth={5} fill="none">
								{[...Array(9)].map((_, k) => {
									const y = 180 + k * 20;
									const a = Math.sin(frame / 10 + k * 0.7) * 55;
									return <line key={k} x1={x - a} y1={y} x2={x + a} y2={y} opacity={0.8} />;
								})}
							</g>
						) : (
							<g stroke={it.c} strokeWidth={4} fill="none">
								{[...Array(6)].map((_, k) => (
									<line key={k} x1={x} y1={170} x2={x - 75 + k * 30} y2={340} opacity={0.5 + 0.5 * Math.abs(Math.sin(frame / 9 + k))} />
								))}
								<path d={`M${x - 90} 345 Q ${x - 45} 320 ${x} 340 T ${x + 90} 335`} strokeWidth={6} />
							</g>
						)}
						<text x={x} y={480} textAnchor="middle" {...mincho(58, it.c)}>
							{it.title}
						</text>
						<text x={x} y={545} textAnchor="middle" {...txt(38, colors.muted, 700)}>
							{it.sub}
						</text>
					</g>
				);
			})}
		</Panel>
	);
};

// 人工知能が、衛星写真を1マスずつ読んでいく（しくみの説明図）
export const AiSatellite: React.FC = () => {
	const frame = useCurrentFrame();
	const cols = 16;
	const rows = 7;
	const scan = interpolate(frame, [10, 150], [-1, cols + 1], clamp);
	return (
		<Panel fill="#05101a">
			{[...Array(cols * rows)].map((_, i) => {
				const c = i % cols;
				const r = Math.floor(i / cols);
				const shade = 40 + ((c * 37 + r * 53) % 30);
				const done = c < scan;
				return (
					<g key={i}>
						<rect x={60 + c * 80} y={40 + r * 72} width={76} height={68} fill={`rgb(${shade + 30},${shade + 26},${shade})`} />
						<rect x={60 + c * 80} y={40 + r * 72} width={76} height={68} fill="none" stroke="#7fd6e8" strokeWidth={2} opacity={done ? 0.55 : 0} />
					</g>
				);
			})}
			<rect x={60 + scan * 80 - 6} y={30} width={12} height={524} fill="#7fd6e8" opacity={0.85} />
			<rect x={60 + scan * 80 - 60} y={30} width={60} height={524} fill="#7fd6e8" opacity={0.12} />
			<text x={700} y={600} textAnchor="middle" {...txt(40, '#bfeef7')} opacity={fadeIn(frame, 30)}>
				島じゅうの衛星写真を、1マスずつ判定する
			</text>
		</Panel>
	);
};

// 古い骨に残った遺伝子（二重らせん）
export const AncientGenome: React.FC = () => {
	const frame = useCurrentFrame();
	const n = 26;
	return (
		<Panel>
			{[...Array(n)].map((_, i) => {
				const x = 170 + i * 42;
				const ph = frame / 14 + i * 0.5;
				const y1 = 300 + Math.sin(ph) * 120;
				const y2 = 300 - Math.sin(ph) * 120;
				const front = Math.cos(ph) > 0;
				return (
					<g key={i} opacity={fadeIn(frame, i * 2)}>
						<line x1={x} y1={y1} x2={x} y2={y2} stroke={colors.muted} strokeWidth={4} opacity={0.5} />
						<circle cx={x} cy={y1} r={front ? 13 : 9} fill={colors.goldSoft} opacity={front ? 1 : 0.55} />
						<circle cx={x} cy={y2} r={front ? 9 : 13} fill="#7fd6e8" opacity={front ? 0.55 : 1} />
					</g>
				);
			})}
			<text x={700} y={590} textAnchor="middle" {...txt(42, colors.goldSoft)} opacity={fadeIn(frame, 40)}>
				遺伝子には、人の数の移り変わりが残る
			</text>
		</Panel>
	);
};

// 空からのレーザーが、森の下の地面を浮かび上がらせる
export const LaserTerrain: React.FC = () => {
	const frame = useCurrentFrame();
	const peel = interpolate(frame, [40, 130], [0, 1], ease);
	return (
		<Panel fill="#06120c">
			{[...Array(9)].map((_, k) => (
				<path key={k} d={`M80 ${250 + k * 38} C 400 ${232 + k * 38}, 900 ${272 + k * 38}, 1320 ${246 + k * 38}`} stroke="#c8e6a0" strokeWidth={3} fill="none" opacity={0.25 + 0.6 * peel} />
			))}
			<g opacity={1 - peel * 0.92}>
				{[...Array(30)].map((_, i) => (
					<circle key={i} cx={100 + ((i * 97) % 1220)} cy={290 + ((i * 53) % 230)} r={46 + (i % 4) * 12} fill={i % 2 ? '#1f4a2a' : '#2a5c33'} />
				))}
			</g>
			<g>
				<path d="M640 60 L760 60 L720 84 L680 84 Z" fill="#d8dde3" />
				{[...Array(7)].map((_, k) => (
					<line key={k} x1={700} y1={84} x2={300 + k * 133} y2={560} stroke="#ff6b5a" strokeWidth={2} opacity={0.35 + 0.4 * Math.abs(Math.sin(frame / 7 + k))} />
				))}
			</g>
			<text x={700} y={600} textAnchor="middle" {...txt(40, '#c8e6a0')} opacity={fadeIn(frame, 90)}>
				木の下の地面の形だけを取り出す
			</text>
		</Panel>
	);
};

// ---- 第1の手がかり ----

export const MuuEmpire: React.FC = () => <BigLine main="「ムウ帝国」" sub="1963年 東宝の特撮映画『海底軍艦』" size={140} />;

export const AncientLegend: React.FC = () => <BigLine main="何千年も前からの、言い伝え？" size={82} />;

export const Back160: React.FC = () => (
	<Years
		from={1840}
		to={2030}
		ticks={[
			{at: 1850, label: '1850'},
			{at: 1900, label: '1900'},
			{at: 1950, label: '1950'},
			{at: 2000, label: '2000'},
		]}
		marks={[
			{at: 2026, label: '今', t0: 0},
			{at: 1863, label: '1860年代', color: colors.japan, t0: 30, row: 1},
		]}
		bands={[{start: 1863, end: 2026, label: 'およそ160年', color: '#3d5f8a', t0: 50}]}
	/>
);

export const UnreadGlyphs: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			{[...Array(12)].map((_, i) => {
				const x = 190 + (i % 6) * 180;
				const y = 140 + Math.floor(i / 6) * 220;
				return (
					<g key={i} transform={`translate(${x} ${y})`} opacity={fadeIn(frame, i * 4)}>
						<rect width={130} height={130} rx={34} fill="#c9a56a" stroke="#6b4a2a" strokeWidth={5} />
						<circle cx={45} cy={50} r={14} fill="#6b4a2a" />
						<path d={`M30 95 Q65 ${70 + (i % 3) * 10} 100 95`} stroke="#6b4a2a" strokeWidth={8} fill="none" />
						<rect x={78} y={30} width={24} height={36} rx={8} fill="#6b4a2a" />
					</g>
				);
			})}
			<text x={700} y={580} textAnchor="middle" {...txt(48, colors.goldSoft)} opacity={fadeIn(frame, 50)}>
				当時は、誰にも読めなかった
			</text>
		</Panel>
	);
};

export const KeyFound: React.FC = () => <BigLine main="これで、マヤの文字が読める" sub="ブラッスールが手にした「鍵」" size={86} />;

// 「ムー」と読んだ
export const ReadAsMu: React.FC = () => {
	const frame = useCurrentFrame();
	const glow = interpolate(frame, [30, 60], [0, 1], clamp);
	return (
		<Panel>
			<rect x={200} y={90} width={460} height={440} rx={20} fill="#d8c79c" />
			{[...Array(8)].map((_, i) => (
				<rect key={i} x={240 + (i % 3) * 140} y={130 + Math.floor(i / 3) * 130} width={100} height={100} rx={26} fill="#8c3b2a" opacity={0.55} />
			))}
			<rect x={520} y={390} width={100} height={100} rx={26} fill="#8c3b2a" stroke={colors.goldSoft} strokeWidth={8 * glow} />
			<path d={`M630 440 L${interpolate(frame, [40, 70], [630, 860], ease)} 330`} stroke={colors.goldSoft} strokeWidth={6} />
			<text x={1000} y={340} textAnchor="middle" {...mincho(200, colors.goldSoft)} opacity={glow}>
				ムー
			</text>
			<text x={1000} y={450} textAnchor="middle" {...txt(42, colors.muted)} opacity={fadeIn(frame, 70)}>
				＝ 海に沈んだ土地？
			</text>
		</Panel>
	);
};

export const NameBirth: React.FC = () => <BigLine main="ムーは、19世紀に生まれた名前" sub="1860年代 フランスの神父が、マヤの絵文書から読み取った" size={78} />;

// ---- 第2の手がかり ----

export const NotAlphabet: React.FC = () => (
	<Versus
		left={{title: 'アルファベット', lines: ['1つの文字＝1つの音', 'A・B・C…'], color: colors.muted}}
		right={{title: 'マヤ文字', lines: ['言葉そのものを表す字', '音のかたまりを表す字', 'を組み合わせる']}}
	/>
);

export const KanjiKana: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<text x={700} y={260} textAnchor="middle" {...mincho(170, colors.text)}>
				<tspan fill={colors.goldSoft}>道</tspan>
				<tspan>を</tspan>
				<tspan fill={colors.goldSoft}>歩</tspan>
				<tspan>く</tspan>
			</text>
			<text x={520} y={360} textAnchor="middle" {...txt(40, colors.goldSoft)} opacity={fadeIn(frame, 20)}>
				言葉を表す字
			</text>
			<text x={880} y={360} textAnchor="middle" {...txt(40, colors.muted)} opacity={fadeIn(frame, 35)}>
				音を表す字
			</text>
			<text x={700} y={500} textAnchor="middle" {...txt(48)} opacity={fadeIn(frame, 50)}>
				マヤ文字も、この組み合わせに近い
			</text>
		</Panel>
	);
};

export const WrongKey: React.FC = () => {
	const frame = useCurrentFrame();
	const shake = frame > 30 && frame < 60 ? Math.sin(frame * 2) * 10 : 0;
	return (
		<Panel>
			<g transform={`translate(${440 + shake} 230)`}>
				<circle cx={0} cy={80} r={70} fill="none" stroke={colors.gold} strokeWidth={22} />
				<rect x={60} y={68} width={300} height={24} fill={colors.gold} />
				<rect x={300} y={92} width={22} height={50} fill={colors.gold} />
				<rect x={250} y={92} width={22} height={34} fill={colors.gold} />
			</g>
			<rect x={860} y={200} width={200} height={260} rx={20} fill="#3a2c1c" stroke="#6b5235" strokeWidth={6} />
			<text x={960} y={350} textAnchor="middle" {...mincho(60, '#e94b3c')} opacity={fadeIn(frame, 50)}>
				開かない
			</text>
			<text x={700} y={560} textAnchor="middle" {...txt(48, colors.goldSoft)} opacity={fadeIn(frame, 60)}>
				A・B・C の鍵では、開かない
			</text>
		</Panel>
	);
};

// 質問と答えのすれ違い
export const CrossedAnswers: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<g opacity={fadeIn(frame, 0)}>
				<rect x={120} y={130} width={500} height={180} rx={30} fill="rgba(244,236,220,0.1)" stroke={colors.muted} strokeWidth={4} />
				<text x={370} y={205} textAnchor="middle" {...txt(44, colors.muted)}>
					ランダ
				</text>
				<text x={370} y={275} textAnchor="middle" {...mincho(60)}>
					「B」はどう書く？
				</text>
			</g>
			<g opacity={fadeIn(frame, 30)}>
				<rect x={780} y={300} width={500} height={200} rx={30} fill="rgba(226,187,99,0.12)" stroke={colors.gold} strokeWidth={4} />
				<text x={1030} y={375} textAnchor="middle" {...txt(44, colors.goldSoft)}>
					マヤの書き手
				</text>
				<text x={1030} y={450} textAnchor="middle" {...mincho(60, colors.goldSoft)}>
					「べ」の字を書く
				</text>
			</g>
			<path d={`M620 230 Q 720 260 ${interpolate(frame, [20, 50], [640, 780], ease)} 380`} stroke={colors.goldSoft} strokeWidth={6} fill="none" opacity={fadeIn(frame, 20)} />
		</Panel>
	);
};

export const Knorozov1952: React.FC = () => (
	<Years
		from={1850}
		to={2030}
		ticks={[
			{at: 1850, label: '1850'},
			{at: 1900, label: '1900'},
			{at: 1950, label: '1950'},
			{at: 2000, label: '2000'},
		]}
		marks={[
			{at: 1863, label: 'ブラッスール', color: colors.muted, t0: 0},
			{at: 1952, label: 'クノロゾフ', color: colors.goldSoft, t0: 25, row: 1},
		]}
		bands={[{start: 1952, end: 2026, label: '解読が進む', color: '#3d7a5a', t0: 45}]}
	/>
);

export const BeRoad: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<text x={330} y={330} textAnchor="middle" {...mincho(190, colors.muted)}>
				B
			</text>
			<path d={`M470 280 L${interpolate(frame, [10, 40], [470, 610], ease)} 280`} stroke={colors.goldSoft} strokeWidth={8} />
			<text x={780} y={330} textAnchor="middle" {...mincho(170, colors.goldSoft)} opacity={fadeIn(frame, 30)}>
				べ
			</text>
			<text x={1080} y={300} textAnchor="middle" {...txt(56)} opacity={fadeIn(frame, 55)}>
				＝「道」
			</text>
			<text x={700} y={520} textAnchor="middle" {...txt(44, colors.muted)} opacity={fadeIn(frame, 70)}>
				アルファベットではなく、音のかたまりの表だった
			</text>
		</Panel>
	);
};

export const MayaReadable: React.FC = () => (
	<Versus
		left={{title: '読めるようになったこと', lines: ['王の名前', '即位の日付', '戦いの記録']}}
		right={{title: '書かれていないこと', lines: ['海に沈んだ大陸', 'ムーの滅亡'], color: colors.muted}}
		mid=""
	/>
);

export const KeyReborn: React.FC = () => <BigLine main="まちがいだらけの表が、解読の鍵に" size={80} />;

// ---- 第3の手がかり ----

export const MayaEgyptOlder: React.FC = () => (
	<Versus
		left={{title: 'ル・プロンジョンの主張', lines: ['マヤの文明は', 'ギリシャやエジプトより', '古い']}}
		right={{title: '女王ムーの物語', lines: ['兄弟の争いに敗れ', '海を渡ってエジプトへ', '女神イシスに']}}
		mid="→"
	/>
);

export const QueenRoute: React.FC = () => (
	<GeoMap
		view="atlantic"
		focus={[-30, 25]}
		pins={[
			{at: [-89, 20.5], label: 'マヤ', at0: 0, dy: 60},
			{at: [31.2, 29.9], label: 'エジプト', at0: 50, dy: 60},
		]}
		routes={[{from: [-89, 20.5], to: [31.2, 29.9], at0: 10, len: 70, bend: 160}]}
	/>
);


export const NoContact: React.FC = () => <BigLine main="マヤとエジプトをつなぐ遺物は、ない" size={80} />;

export const MayaEgyptGap: React.FC = () => (
	<Years
		from={-3000}
		to={1000}
		ticks={[
			{at: -3000, label: '前3000年'},
			{at: -2000, label: '前2000年'},
			{at: -1000, label: '前1000年'},
			{at: 0, label: '紀元'},
			{at: 1000, label: '1000年'},
		]}
		marks={[{at: -2560, label: 'ギザの大ピラミッド', color: '#d9b070', t0: 0}]}
		bands={[{start: 250, end: 900, label: 'マヤの都市が栄える', color: '#3d7a5a', t0: 30}]}
	/>
);

export const PhotosRemain: React.FC = () => <BigLine main="物語はまちがい。でも、写真は残った" size={80} />;

// ---- 第4の手がかり ----

export const MuBook1926: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			<g transform={`translate(520 70) rotate(${interpolate(frame, [0, 30], [-6, -2], ease)})`}>
				<rect width={360} height={480} rx={10} fill="#3d2a1a" stroke={colors.gold} strokeWidth={6} />
				<text x={180} y={150} textAnchor="middle" {...mincho(46, colors.goldSoft)}>
					THE LOST
				</text>
				<text x={180} y={210} textAnchor="middle" {...mincho(46, colors.goldSoft)}>
					CONTINENT
				</text>
				<text x={180} y={270} textAnchor="middle" {...mincho(46, colors.goldSoft)}>
					OF MU
				</text>
				<text x={180} y={400} textAnchor="middle" {...txt(38, colors.muted)}>
					1926
				</text>
			</g>
		</Panel>
	);
};

export const MuExtent: React.FC = () => (
	<GeoMap
		view="pacific"
		mu={1}
		pins={[
			{at: places.hawaii, label: 'ハワイ', at0: 10, dx: 100, dy: 15},
			{at: places.easter, label: 'イースター島', at0: 25},
			{at: places.mariana, label: 'マリアナ諸島', at0: 40, dy: 60},
		]}
	>
		{() => (
			<MapNote x={960} y={175} at0={50} size={44}>
				東西およそ8000キロ・南北およそ5000キロ（本に書かれた大きさ）
			</MapNote>
		)}
	</GeoMap>
);


export const SuperiorCiv: React.FC = () => <BigLine main="今よりすぐれた文明？" sub="世界中に植民地を築いていた、と本は書く" size={100} />;

// 地下のガスが爆発して沈む（チャーチワードの説明）
export const GasChambers: React.FC = () => {
	const frame = useCurrentFrame();
	const boom = interpolate(frame, [50, 70], [0, 1], clamp);
	const drop = interpolate(frame, [70, 140], [0, 120], ease);
	return (
		<Panel fill="#0a1626">
			<rect x={-1000} y={150} width={3400} height={470 + 500} fill="#123a56" />
			<g transform={`translate(0 ${drop})`}>
				<rect x={250} y={110} width={900} height={90} fill="#8a6e3f" />
				<rect x={250} y={200} width={900} height={170} fill="#5b4730" />
				{[340, 560, 780, 1000].map((x, i) => (
					<ellipse key={x} cx={x} cy={285} rx={80} ry={45} fill="#2a1c10" stroke={boom > 0 ? '#ff8a3a' : '#7a5a3a'} strokeWidth={4 + boom * 6} opacity={fadeIn(frame, i * 8)} />
				))}
			</g>
			<rect x={-1000} y={-600} width={3400} height={1820} fill="#ff8a3a" opacity={boom * (1 - boom) * 1.2} />
			<text x={700} y={570} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 20)}>
				地下の空洞のガスが爆発し、大陸が落ちた（本の説明）
			</text>
		</Panel>
	);
};

export const MuSeries: React.FC = () => {
	const frame = useCurrentFrame();
	const books = [
		['失われたムー大陸', '1926'],
		['ムーの子孫', '1931'],
		['ムーの象徴', '1933'],
		['ムーの宇宙の力', '1934'],
	];
	return (
		<Panel>
			{books.map(([t, y], i) => (
				<g key={t} transform={`translate(${130 + i * 300} 120)`} opacity={fadeIn(frame, i * 10)}>
					<rect width={240} height={340} rx={10} fill={['#3d2a1a', '#2a3550', '#4a2a2a', '#2a4a3a'][i]} stroke={colors.gold} strokeWidth={4} />
					<text x={120} y={150} textAnchor="middle" {...mincho(Math.min(34, Math.floor(210 / t.length)), colors.goldSoft)}>
						{t}
					</text>
					<text x={120} y={300} textAnchor="middle" {...txt(34, colors.muted)}>
						{y}
					</text>
				</g>
			))}
		</Panel>
	);
};

export const MuInJapan: React.FC = () => (
	<Years
		from={1920}
		to={1990}
		ticks={[
			{at: 1920, label: '1920'},
			{at: 1940, label: '1940'},
			{at: 1960, label: '1960'},
			{at: 1980, label: '1980'},
		]}
		marks={[
			{at: 1926, label: '原書（アメリカ）', color: colors.muted, t0: 0},
			{at: 1963, label: '『海底軍艦』', color: colors.japan, t0: 20, row: 1},
			{at: 1968, label: '日本語訳', color: colors.goldSoft, t0: 40},
		]}
	/>
);

export const WhereFrom: React.FC = () => <BigLine main="人口も、年代も、どこから？" size={96} />;

export const OneManReading: React.FC = () => {
	const frame = useCurrentFrame();
	const items = ['大きさ', '人口', '年代', '沈んだ仕組み'];
	return (
		<Panel>
			{items.map((t, i) => (
				<g key={t} opacity={fadeIn(frame, i * 10)}>
					<rect x={110 + i * 300} y={110} width={260} height={110} rx={18} fill="rgba(244,236,220,0.08)" stroke={colors.gold} strokeWidth={4} />
					<text x={240 + i * 300} y={185} textAnchor="middle" {...txt(Math.min(48, Math.floor(230 / t.length)))}>
						{t}
					</text>
					<line x1={240 + i * 300} y1={220} x2={700} y2={380} stroke={colors.goldSoft} strokeWidth={4} opacity={fadeIn(frame, 40)} />
				</g>
			))}
			<g opacity={fadeIn(frame, 50)}>
				<rect x={320} y={380} width={760} height={140} rx={24} fill="#3d2a1a" stroke={colors.goldSoft} strokeWidth={5} />
				<text x={700} y={470} textAnchor="middle" {...mincho(56, colors.goldSoft)}>
					チャーチワードの読み解き
				</text>
			</g>
		</Panel>
	);
};

// ---- 第5の手がかり ----

export const TwoRecords: React.FC = () => (
	<Versus
		left={{title: 'インドの粘土板', lines: ['ナーカル碑文', '寺院の僧が見せた', 'と本は書く']}}
		right={{title: 'メキシコの石の板', lines: ['ニーヴンが発掘', '1921〜1932年', '2600枚ほど']}}
		mid="＋"
	/>
);

export const OnlyThreeReaders: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel>
			{[0, 1, 2].map((i) => (
				<g key={i} transform={`translate(${430 + i * 270} 300)`} opacity={fadeIn(frame, i * 14)}>
					<circle cy={-90} r={50} fill={i === 2 ? colors.goldSoft : '#cfc6b4'} />
					<rect x={-55} y={-30} width={110} height={160} rx={30} fill={i === 2 ? colors.goldSoft : '#cfc6b4'} />
				</g>
			))}
			<text x={700} y={560} textAnchor="middle" {...txt(46, colors.goldSoft)} opacity={fadeIn(frame, 40)}>
				読めるのは、インドでほかに2人だけ（本の記述）
			</text>
		</Panel>
	);
};

export const WhereNow: React.FC = () => <BigLine main="その記録は、今どこに？" size={110} />;

export const MissingEvidence: React.FC = () => {
	const frame = useCurrentFrame();
	const rows = ['粘土板の写真', '置かれている寺院', 'ほかの研究者の確認', '見せた僧の名前'];
	return (
		<Panel>
			{rows.map((r, i) => (
				<g key={r} opacity={fadeIn(frame, i * 14)}>
					<text x={420} y={150 + i * 115} {...txt(54)}>
						{r}
					</text>
					<text x={1020} y={150 + i * 115} textAnchor="middle" {...txt(54, '#e94b3c')}>
						なし
					</text>
				</g>
			))}
		</Panel>
	);
};

export const ReburiedTablets: React.FC = () => {
	const frame = useCurrentFrame();
	const bury = interpolate(frame, [30, 90], [0, 1], ease);
	return (
		<Panel fill="#1a1510">
			<rect x={-1000} y={380} width={3400} height={240 + 500} fill="#5b4730" />
			{[...Array(5)].map((_, i) => (
				<rect key={i} x={360 + i * 150} y={260 + bury * 200} width={110} height={130} rx={10} fill="#9a8a70" stroke="#5a4a30" strokeWidth={4} opacity={1 - bury * 0.7} />
			))}
			<rect x={200} y={90} width={300} height={200} rx={10} fill="#e8dcc0" opacity={fadeIn(frame, 60)} />
			<text x={350} y={200} textAnchor="middle" {...txt(36, '#3a2a1a')} opacity={fadeIn(frame, 60)}>
				残ったのは絵だけ
			</text>
		</Panel>
	);
};

export const FakeSuspicion: React.FC = () => <BigLine main="本物か、偽物か" sub="確かめる手段は、もう残っていない" size={120} />;

export const TwoPillars: React.FC = () => {
	const frame = useCurrentFrame();
	const crack = interpolate(frame, [40, 80], [0, 1], clamp);
	return (
		<Panel>
			<path d="M200 200 L700 80 L1200 200 Z" fill="#8a6e3f" transform={`rotate(${crack * 4} 700 200)`} />
			<text x={700} y={175} textAnchor="middle" {...mincho(44, '#1b1712')}>
				6400万人の大陸
			</text>
			{[420, 980].map((x, i) => (
				<g key={x}>
					<rect x={x - 70} y={210} width={140} height={300} fill={i ? '#6b6a64' : '#a07a50'} opacity={1 - crack * 0.5} />
					<text x={x} y={560} textAnchor="middle" {...txt(40)}>
						{i ? '行方不明の石の板' : '確かめられない粘土板'}
					</text>
				</g>
			))}
		</Panel>
	);
};

// インドの寺院で見せられたという粘土板（本の記述を絵にしたもの）
export const TempleTablet: React.FC = () => {
	const frame = useCurrentFrame();
	const glow = 0.5 + 0.5 * Math.sin(frame / 12);
	return (
		<Panel fill="#120d08">
			<path d="M400 560 L400 250 L700 110 L1000 250 L1000 560 Z" fill="#2a1f14" stroke="#5a4028" strokeWidth={6} />
			<rect x={600} y={330} width={200} height={230} fill="#0a0704" />
			<rect x={640} y={400} width={120} height={90} rx={8} fill="#a07a50" opacity={0.6 + glow * 0.4} />
			<text x={700} y={80} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 20)}>
				インドの寺院の奥で見せられた、と本は書く
			</text>
		</Panel>
	);
};

// ニーヴンが掘り出した石の板
export const NivenSlabs: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Panel fill="#1a1510">
			<rect x={-1000} y={420} width={3400} height={200 + 500} fill="#5b4730" />
			{[...Array(9)].map((_, i) => (
				<g key={i} transform={`translate(${170 + i * 125} ${300 - (i % 2) * 30})`} opacity={fadeIn(frame, i * 5)}>
					<rect width={100} height={130} rx={10} fill="#9a8a70" stroke="#5a4a30" strokeWidth={4} />
					<circle cx={50} cy={45} r={16} fill="none" stroke="#5a4a30" strokeWidth={5} />
					<path d="M25 95 L75 95 M50 70 L50 115" stroke="#5a4a30" strokeWidth={5} />
				</g>
			))}
			<text x={700} y={120} textAnchor="middle" {...txt(46, colors.goldSoft)} opacity={fadeIn(frame, 40)}>
				メキシコの谷で掘り出された、約2600枚の石の板
			</text>
		</Panel>
	);
};

export const AnswerInBook: React.FC = () => <BigLine main="答えは、本の中に書いてある" sub="チャーチワード自身が、根拠を明記している" size={90} />;
