import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {Boat, clamp, ease, fadeIn, mincho, Person, Pin, PyramidSection, RouteLine, txt} from './PyramidKit';

// ---- 第5の手がかり 奴隷が造った？ ----

// 「宇宙人が造った」という投稿
export const AlienClaim: React.FC = () => {
	const frame = useCurrentFrame();
	const y = 120 + Math.sin(frame / 10) * 12;
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#0b1222" />
			<path d="M400 560 L650 220 L900 560 Z" fill="#c9a96e" />
			<g transform={`translate(650 ${y})`} opacity={fadeIn(frame, 0, 20)}>
				<ellipse rx={150} ry={34} fill="#9aa0a8" />
				<ellipse cy={-24} rx={70} ry={36} fill="#cfe0f0" />
				<path d="M-60 30 L-160 360 L160 360 L60 30 Z" fill="#ffffff" opacity={0.12} />
			</g>
			<g opacity={fadeIn(frame, 30)}>
				<rect x={860} y={230} width={400} height={110} rx={20} fill="#f4ecdc" />
				<text x={1060} y={300} textAnchor="middle" {...txt(36, colors.ink)}>
					宇宙人が造った？
				</text>
			</g>
		</svg>
	);
};

// むちで打たれる奴隷、というイメージ
export const WhipImage: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#2a1a12" />
			<rect x={150} y={360} width={260} height={140} fill="#9a8a72" />
			{[0, 1, 2, 3, 4].map((i) => (
				<Person key={i} x={480 + i * 110} y={480} s={1} color="#6b5a44" />
			))}
			<Person x={1100} y={480} s={1.2} color="#3b2a16" />
			<path d={`M1080 380 Q ${980 + Math.sin(frame / 4) * 40} 300 900 360`} stroke="#3b2a16" strokeWidth={6} fill="none" />
			<text x={650} y={150} textAnchor="middle" {...mincho(120, colors.goldSoft)} opacity={fadeIn(frame, 20)}>
				？
			</text>
		</svg>
	);
};

// ヘロドトスの数字と、2000年の時差
export const HerodotusNumbers: React.FC = () => {
	const frame = useCurrentFrame();
	const items = [
		['10万人', '働いた人数'],
		['3か月交代', '働き方'],
		['20年', 'かかった年月'],
	];
	return (
		<svg width={1400} height={580} viewBox="0 0 1400 580">
			{items.map(([v, k], i) => (
				<g key={v} opacity={fadeIn(frame, i * 15)}>
					<rect x={80 + i * 430} y={60} width={380} height={240} rx={20} fill="#f4ecdc" />
					<text x={270 + i * 430} y={130} textAnchor="middle" {...txt(36, colors.clayDark)}>
						{k}
					</text>
					<text x={270 + i * 430} y={240} textAnchor="middle" {...mincho(80, colors.ink)}>
						{v}
					</text>
				</g>
			))}
			<g opacity={fadeIn(frame, 60)}>
				<rect x={280} y={380} width={840} height={130} rx={20} fill={colors.correct} />
				<text x={700} y={465} textAnchor="middle" {...txt(52)}>
					書かれたのは、完成から2000年後
				</text>
			</g>
		</svg>
	);
};

// 映画が広めたイメージ
export const FilmImage: React.FC = () => {
	const frame = useCurrentFrame();
	const off = (frame * 6) % 220;
	return (
		<svg width={1300} height={560} viewBox="0 0 1300 560">
			<rect x={0} y={80} width={1300} height={400} fill="#111" />
			{[...Array(8)].map((_, i) => (
				<g key={i} transform={`translate(${i * 220 - off} 0)`}>
					<rect x={20} y={130} width={180} height={300} fill="#5a4630" />
					<path d="M50 400 L110 220 L170 400 Z" fill="#c9a96e" />
					{[...Array(12)].map((__, j) => (
						<rect key={j} x={10 + (j % 6) * 36} y={j < 6 ? 95 : 445} width={20} height={20} fill="#ddd" />
					))}
				</g>
			))}
			<text x={650} y={50} textAnchor="middle" {...txt(44, colors.goldSoft)}>
				くりかえし描かれたイメージ
			</text>
		</svg>
	);
};

// 墓に刻まれた肩書き
export const TitleInscription: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1100} height={600} viewBox="0 0 1100 600">
			<path d="M300 560 L300 120 Q 550 20 800 120 L800 560 Z" fill="#b8a888" stroke="#7a6a52" strokeWidth={8} />
			{[...Array(5)].map((_, i) => (
				<rect key={i} x={360} y={170 + i * 70} width={380} height={18} fill="#7a6a52" opacity={0.5} />
			))}
			<g opacity={fadeIn(frame, 20)}>
				<rect x={330} y={300} width={440} height={90} rx={10} fill="rgba(5,9,18,0.9)" />
				<text x={550} y={360} textAnchor="middle" {...txt(36, colors.goldSoft)}>
					ピラミッドの側面の監督
				</text>
			</g>
		</svg>
	);
};

// 治った骨折の跡
export const HealedBone: React.FC = () => {
	const frame = useCurrentFrame();
	const heal = interpolate(frame, [30, 80], [0, 1], clamp);
	return (
		<svg width={1300} height={520} viewBox="0 0 1300 520">
			<g transform="translate(650 260)">
				<rect x={-420} y={-30} width={840} height={60} rx={30} fill="#efe6d2" />
				<circle cx={-420} cy={-30} r={45} fill="#efe6d2" />
				<circle cx={-420} cy={30} r={45} fill="#efe6d2" />
				<circle cx={420} cy={-30} r={45} fill="#efe6d2" />
				<circle cx={420} cy={30} r={45} fill="#efe6d2" />
				<path d="M-10 -32 L20 0 L-10 32" stroke={heal > 0.5 ? '#d8c9a8' : colors.correct} strokeWidth={10} fill="none" />
				<ellipse rx={60 * heal} ry={44 * heal} fill="#e3d6b8" opacity={0.9} />
			</g>
			<text x={650} y={440} textAnchor="middle" {...txt(48, colors.goldSoft)} opacity={fadeIn(frame, 70)}>
				骨折が、きれいに治った跡
			</text>
		</svg>
	);
};

// 労働者の町：パン工房とたくさんの骨
export const WorkersTown: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={620} viewBox="0 0 1300 620">
			<rect width={1300} height={620} rx={30} fill="#d8c08a" />
			{[...Array(4)].map((_, r) =>
				[...Array(6)].map((__, c) => (
					<rect key={`${r}-${c}`} x={100 + c * 190} y={80 + r * 120} width={170} height={100} fill="#b39462" stroke="#7a5a2a" strokeWidth={4} opacity={fadeIn(frame, (r * 6 + c) * 2)} />
				)),
			)}
			<g opacity={fadeIn(frame, 60)}>
				<rect x={120} y={500} width={460} height={90} rx={16} fill="rgba(5,9,18,0.9)" />
				<text x={350} y={560} textAnchor="middle" {...txt(40, colors.goldSoft)}>
					パンを焼く工房
				</text>
				<rect x={720} y={500} width={460} height={90} rx={16} fill="rgba(5,9,18,0.9)" />
				<text x={950} y={560} textAnchor="middle" {...txt(40, colors.goldSoft)}>
					ウシやヒツジの骨
				</text>
			</g>
		</svg>
	);
};

// 国に集められ、交代で働いた
export const ShiftRotation: React.FC = () => {
	const frame = useCurrentFrame();
	const a = (frame / 60) * Math.PI;
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<path d="M520 450 L650 280 L780 450 Z" fill="#c9a96e" />
			<ellipse cx={650} cy={380} rx={450} ry={180} fill="none" stroke={colors.goldSoft} strokeWidth={4} strokeDasharray="16 12" />
			{[...Array(8)].map((_, i) => {
				const t = a + (i / 8) * Math.PI * 2;
				return <Person key={i} x={650 + Math.cos(t) * 450} y={400 + Math.sin(t) * 180} s={0.7} color={Math.sin(t) > 0 ? '#e8d9b0' : '#8a7a62'} />;
			})}
			<text x={650} y={80} textAnchor="middle" {...txt(44, colors.goldSoft)}>
				村から集められ、交代で働く
			</text>
		</svg>
	);
};

// 5つの手がかりを全てたどった
export const FiveCluesDone: React.FC = () => {
	const frame = useCurrentFrame();
	const clues = ['2万年前', '地下2km', '地震', '重りと滑車', '奴隷'];
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

// ---- 名前の残った人々 ----

// 紅海の近くのワディ・アル・ジャルフ
export const RedSeaMap: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={660} viewBox="0 0 1300 660">
			<rect width={1300} height={660} rx={30} fill="#d8c08a" />
			<path d="M380 0 C 360 200 400 380 380 660" stroke="#3d7bb0" strokeWidth={30} fill="none" />
			<path d="M820 120 L1300 40 L1300 660 L1080 660 C 1000 450 900 300 820 120 Z" fill="#3d7bb0" />
			<text x={1120} y={400} textAnchor="middle" {...txt(44, '#fff')}>
				紅海
			</text>
			<text x={330} y={620} textAnchor="end" {...txt(36, '#123b63')}>
				ナイル川
			</text>
			<Pin at={[360, 180]} label="ギザ" color={colors.gold} show={fadeIn(frame, 0)} dx={-80} dy={10} />
			<Pin at={[880, 260]} label="ワディ・アル・ジャルフ" color={colors.correct} pulse show={fadeIn(frame, 20)} dx={-40} dy={-34} />
		</svg>
	);
};

// 岩の倉庫からパピルスの束
export const PapyrusFind: React.FC = () => {
	const frame = useCurrentFrame();
	const open = interpolate(frame, [30, 80], [0, 1], ease);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#5a4630" />
			<path d="M200 560 L200 200 Q 650 40 1100 200 L1100 560 Z" fill="#2b2016" />
			<rect x={650 - 380 * open} y={300} width={760 * open} height={180} fill="#e8d9a8" />
			{[...Array(6)].map((_, i) => (
				<rect key={i} x={650 - 340 * open} y={330 + i * 24} width={680 * open} height={8} fill="#5a4630" opacity={0.6} />
			))}
			<rect x={610} y={290} width={80} height={200} rx={30} fill="#d9c890" />
		</svg>
	);
};

// メレルと40人の船の班
export const MererCrew: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#1f3354" />
			<rect y={430} width={1300} height={170} fill="#2c5d8a" />
			<path d="M250 430 L1050 430 L980 500 L320 500 Z" fill="#8a5a32" />
			<line x1={650} y1={430} x2={650} y2={160} stroke="#5a3a24" strokeWidth={10} />
			<path d="M660 170 L900 400 L660 400 Z" fill="#f4ecdc" />
			{[...Array(20)].map((_, i) => (
				<Person key={i} x={300 + i * 37} y={430} s={0.45} color="#3b2a16" />
			))}
			<g opacity={fadeIn(frame, 20)}>
				<Person x={400} y={430} s={0.8} color={colors.goldSoft} />
				<text x={400} y={340} textAnchor="middle" {...txt(40, colors.goldSoft)}>
					メレル
				</text>
			</g>
			<text x={1000} y={120} textAnchor="middle" {...txt(44, '#fff')} opacity={fadeIn(frame, 40)}>
				仲間 約40人
			</text>
		</svg>
	);
};

// 石灰岩を船でギザへ
export const LimestoneRoute: React.FC = () => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [10, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	return (
		<svg width={1300} height={640} viewBox="0 0 1300 640">
			<rect width={1300} height={640} rx={30} fill="#d8c08a" />
			<path d="M700 0 C 680 200 720 420 700 640" stroke="#3d7bb0" strokeWidth={60} fill="none" />
			<path d="M690 300 L420 300" stroke="#3d7bb0" strokeWidth={30} />
			<Pin at={[900, 420]} label="石切り場（トゥラ）" color={colors.goldSoft} dx={40} dy={60} />
			<path d="M340 300 L380 240 L420 300 Z" fill="#c9a96e" />
			<Pin at={[380, 300]} label="ギザ" color={colors.correct} dy={60} />
			<RouteLine d="M880 420 L720 420 L700 300 L430 300" p={p} />
			<Boat x={interpolate(p, [0, 0.4, 1], [880, 710, 440])} y={interpolate(p, [0, 0.4, 0.55, 1], [410, 410, 290, 290])} scale={1.4} />
		</svg>
	);
};

// 「アケト・クフ」＝クフ王の地平線
export const AkhetKhufu: React.FC = () => {
	const frame = useCurrentFrame();
	const sun = interpolate(frame, [0, 60], [380, 250], ease);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#2a1f3a" />
			<circle cx={650} cy={sun} r={70} fill={colors.gold} />
			<path d="M330 420 L520 250 L560 280 L560 420 Z" fill="#c9a96e" />
			<path d="M970 420 L780 250 L740 280 L740 420 Z" fill="#c9a96e" />
			<rect x={300} y={420} width={700} height={20} fill="#c9a96e" />
			<text x={650} y={530} textAnchor="middle" {...mincho(64, colors.goldSoft)} opacity={fadeIn(frame, 40)}>
				「クフ王の地平線」
			</text>
		</svg>
	);
};

// 何度も何度も往復した
export const RoundTrips: React.FC = () => {
	const frame = useCurrentFrame();
	const t = (frame % 90) / 90;
	const x = 200 + 900 * (t < 0.5 ? t * 2 : 2 - t * 2);
	const trips = Math.floor(frame / 45) + 1;
	return (
		<svg width={1300} height={520} viewBox="0 0 1300 520">
			<rect width={1300} height={520} rx={30} fill="#1f3354" />
			<rect y={300} width={1300} height={220} fill="#2c5d8a" />
			<Boat x={x} y={300} scale={2} />
			<text x={650} y={120} textAnchor="middle" {...mincho(80, colors.goldSoft)}>
				往復 {trips}回目
			</text>
		</svg>
	);
};

// 2隻目の船が眠る穴
export const SecondBoat: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#d8c08a" />
			<path d="M800 520 L1050 160 L1300 520 Z" fill="#c9a96e" />
			{[0, 1].map((i) => (
				<g key={i}>
					<rect x={120 + i * 350} y={360} width={300} height={90} rx={10} fill="#5a4630" />
					<text x={270 + i * 350} y={500} textAnchor="middle" {...txt(36, colors.ink)}>
						{i === 0 ? '1隻目（1954年）' : '2隻目'}
					</text>
				</g>
			))}
			{[...Array(12)].map((_, i) => (
				<rect key={i} x={490 + (i % 6) * 44} y={380 + Math.floor(i / 6) * 28} width={36} height={14} fill="#a8703f" opacity={fadeIn(frame, 20 + i * 3)} />
			))}
		</svg>
	);
};

// 部品およそ1650を組み上げる
export const BoatParts: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [0, 90], [0, 1650], ease));
	const shown = Math.floor(n / 25);
	return (
		<svg width={1300} height={580} viewBox="0 0 1300 580">
			<rect width={1300} height={580} rx={30} fill="rgba(5,9,18,0.75)" />
			{[...Array(shown)].map((_, i) => (
				<rect key={i} x={100 + (i % 22) * 50} y={120 + Math.floor(i / 22) * 26} width={42} height={14} fill="#a8703f" />
			))}
			<text x={650} y={480} textAnchor="middle" {...mincho(110, colors.goldSoft)}>
				{n.toLocaleString('ja-JP')}
				<tspan {...txt(50)}>個の部品</tspan>
			</text>
		</svg>
	);
};

// ---- まだ解けていない謎 ----

// ミューオンで中を透かす
export const MuonScan: React.FC = () => {
	const frame = useCurrentFrame();
	const found = fadeIn(frame, 70, 20);
	return (
		<PyramidSection>
			{[...Array(24)].map((_, i) => {
				const x = 120 + i * 48;
				const y = ((frame * 12 + i * 61) % 760) - 60;
				return <line key={i} x1={x} y1={y} x2={x - 12} y2={y + 40} stroke="#7fd0ff" strokeWidth={3} opacity={0.7} />;
			})}
			<path d="M575 340 L655 240" stroke={colors.correct} strokeWidth={30} opacity={found} />
			<text x={720} y={210} {...txt(40, colors.correct)} opacity={found}>
				大きな空間（30m以上）
			</text>
		</PyramidSection>
	);
};

// 女王の間に置かれた特殊なフィルム
export const NagoyaFilm: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<PyramidSection>
			<g opacity={fadeIn(frame, 10)}>
				<rect x={630} y={385} width={64} height={50} fill={colors.goldSoft} stroke="#000" strokeWidth={3} />
				<text x={900} y={470} textAnchor="middle" {...txt(36, '#fff')}>
					女王の間のフィルム
				</text>
			</g>
			<path d="M662 385 L610 300" stroke={colors.goldSoft} strokeWidth={4} strokeDasharray="10 8" opacity={fadeIn(frame, 40)} />
		</PyramidSection>
	);
};

// 北側の入口の上の通路と、5ミリのカメラ
export const HiddenCorridor: React.FC = () => {
	const frame = useCurrentFrame();
	const cam = interpolate(frame, [40, 100], [0, 1], ease);
	return (
		<svg width={1300} height={600} viewBox="0 0 1300 600">
			<rect width={1300} height={600} rx={30} fill="#1a1612" />
			{[...Array(4)].map((_, r) =>
				[...Array(5)].map((__, c) => <rect key={`${r}-${c}`} x={60 + c * 240} y={40 + r * 130} width={230} height={120} fill="#9a8a72" stroke="#5a4a36" strokeWidth={5} />),
			)}
			<rect x={200} y={220} width={900} height={110} fill="#0b0b0b" opacity={fadeIn(frame, 10, 20)} />
			<text x={650} y={290} textAnchor="middle" {...txt(44, colors.goldSoft)} opacity={fadeIn(frame, 25)}>
				長さ 約9mの通路
			</text>
			<line x1={1250} y1={380} x2={1250 - 300 * cam} y2={330} stroke={colors.correct} strokeWidth={6} />
			<circle cx={1250 - 300 * cam} cy={330} r={10} fill={colors.correct} />
			<text x={1240} y={460} textAnchor="end" {...txt(36, '#fff')} opacity={fadeIn(frame, 60)}>
				直径5ミリのカメラ
			</text>
		</svg>
	);
};

// まだ開かれていない封筒
export const SealedEnvelope: React.FC = () => {
	const frame = useCurrentFrame();
	const wob = Math.sin(frame / 8) * 2;
	return (
		<svg width={1100} height={560} viewBox="0 0 1100 560">
			<g transform={`rotate(${wob} 550 280)`}>
				<rect x={250} y={130} width={600} height={340} rx={14} fill="#f4ecdc" />
				<path d="M250 130 L550 330 L850 130" stroke="#c9b48a" strokeWidth={8} fill="none" />
				<circle cx={550} cy={330} r={46} fill={colors.correct} />
				<text x={550} y={345} textAnchor="middle" {...txt(36)}>
					2026
				</text>
			</g>
			<text x={550} y={540} textAnchor="middle" {...txt(44, colors.goldSoft)}>
				予告された「新発見」
			</text>
		</svg>
	);
};
