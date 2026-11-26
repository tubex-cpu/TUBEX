import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, svgGothic, svgMincho} from './Cinema';
import {Canvas, H, W, rand, type Tone} from './IzumoKit';

// 縄文1万年判決：写真では見せられない「しくみ・位置・流れ」の図解

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fade = (f: number, at: number, len = 16) => interpolate(f, [at, at + len], [0, 1], clamp);

const Label: React.FC<{readonly x: number; readonly y: number; readonly text: string; readonly at: number; readonly color?: string; readonly size?: number; readonly anchor?: 'start' | 'middle' | 'end'}> = ({x, y, text, at, color = '#efe6d2', size = 46, anchor = 'start'}) => {
	const frame = useCurrentFrame();
	return (
		<text x={x} y={y} textAnchor={anchor} {...svgGothic(size, color, 900)} opacity={fade(frame, at)}>
			{text}
		</text>
	);
};

// 貯蔵穴（フラスコ状の穴）の断面。木の実が下からたまっていく
export const StoragePit: React.FC<{readonly tone?: Tone}> = ({tone = 'ember'}) => {
	const frame = useCurrentFrame();
	const g = 420; // 地面
	const cx = 760;
	const pit = `M ${cx - 120} ${g} C ${cx - 130} ${g + 120} ${cx - 330} ${g + 200} ${cx - 320} ${g + 360} C ${cx - 310} ${g + 470} ${cx + 310} ${g + 470} ${cx + 320} ${g + 360} C ${cx + 330} ${g + 200} ${cx + 130} ${g + 120} ${cx + 120} ${g}`;
	const fill = interpolate(frame, [60, 200], [0, 1], easeInOut);
	const nuts = Array.from({length: 120}, (_, i) => {
		const row = Math.floor(i / 12);
		const x = cx - 270 + (i % 12) * 48 + (row % 2) * 22 + rand(i) * 8;
		const y = g + 420 - row * 30 - rand(i + 50) * 6;
		return {x, y, show: i / 120 < fill};
	});
	return (
		<Canvas tone={tone}>
			<rect x={0} y={g} width={W} height={H - g} fill="#3a2716" />
			<rect x={0} y={g - 8} width={W} height={16} fill="#5b7a3a" />
			<clipPath id="pitclip">
				<path d={pit} />
			</clipPath>
			<path d={pit} fill="#140c06" stroke="#c9a06a" strokeWidth={6} opacity={fade(frame, 6, 30)} />
			<g clipPath="url(#pitclip)">
				{nuts.map((n, i) => (n.show ? <ellipse key={i} cx={n.x} cy={n.y} rx={20} ry={15} fill={i % 3 === 0 ? '#8a5a2b' : '#a8743a'} stroke="#3a220f" strokeWidth={3} /> : null))}
			</g>
			<line x1={cx - 120} y1={g - 60} x2={cx + 120} y2={g - 60} stroke={colors.gold} strokeWidth={4} opacity={fade(frame, 24)} />
			<Label x={cx} y={g - 84} text="入り口はすぼまる" at={24} anchor="middle" color={colors.goldSoft} />
			<line x1={cx + 340} y1={g + 360} x2={cx + 440} y2={g + 360} stroke={colors.gold} strokeWidth={4} opacity={fade(frame, 44)} />
			<Label x={cx + 460} y={g + 376} text="底は広い" at={44} color={colors.goldSoft} />
			<Label x={cx + 460} y={g + 200} text="秋の木の実をたくわえる" at={110} />
			<Label x={cx + 460} y={g + 260} text="冬まで保つ" at={150} color="#ffcf9a" />
		</Canvas>
	);
};

// クリの花粉は重く、林の近くにしか落ちない
export const PollenFall: React.FC<{readonly tone?: Tone}> = ({tone = 'moss'}) => {
	const frame = useCurrentFrame();
	const ground = 760;
	const trees = [180, 330, 480];
	const dots = Array.from({length: 160}, (_, i) => {
		const dist = Math.pow(rand(i + 7), 2.6) * 1300; // 近いほど多い
		const x = 560 + dist;
		const t0 = 20 + rand(i + 3) * 120;
		const y = interpolate(frame, [t0, t0 + 70], [300 + rand(i + 9) * 80, ground - 10 - rand(i + 11) * 30], {...clamp, easing: easeOut.easing});
		return {x, y, o: fade(frame, t0, 10)};
	});
	return (
		<Canvas tone={tone}>
			<rect x={0} y={ground} width={W} height={H - ground} fill="#2a3a22" />
			{trees.map((x, i) => (
				<g key={i} opacity={fade(frame, i * 6)}>
					<rect x={x - 18} y={ground - 260} width={36} height={260} fill="#4b3420" />
					<circle cx={x} cy={ground - 330} r={130} fill="#3f6b32" stroke="#e8d27a" strokeWidth={4} strokeDasharray="4 14" />
				</g>
			))}
			{dots.map((d, i) => (
				<circle key={i} cx={d.x} cy={d.y} r={7} fill="#f4e27a" opacity={d.o * 0.9} />
			))}
			<Label x={330} y={ground + 80} text="クリの林" at={10} anchor="middle" color={colors.goldSoft} size={50} />
			<line x1={560} y1={ground + 30} x2={1840} y2={ground + 30} stroke="rgba(239,230,210,0.5)" strokeWidth={4} opacity={fade(frame, 120)} />
			<Label x={1200} y={ground + 100} text="林から離れるほど、花粉は届かない" at={140} anchor="middle" />
			<Label x={720} y={400} text="重い花粉" at={40} anchor="middle" color="#f4e27a" />
		</Canvas>
	);
};

// 縄文の村（広場を家が囲む）と弥生の村（二重の堀と柵）
export const VillagePlan: React.FC<{readonly tone?: Tone}> = ({tone = 'night'}) => {
	const frame = useCurrentFrame();
	const L = {x: 500, y: 590};
	const R = {x: 1420, y: 590};
	const ring = (n: number) => Array.from({length: n}, (_, i) => (i / n) * Math.PI * 2);
	const right = fade(frame, 90, 30);
	return (
		<Canvas tone={tone}>
			<Label x={L.x} y={230} text="縄文の村" at={0} anchor="middle" color={colors.goldSoft} size={64} />
			<circle cx={L.x} cy={L.y} r={120} fill="rgba(200,170,90,0.18)" stroke={colors.gold} strokeWidth={4} opacity={fade(frame, 10)} />
			{ring(8).map((a, i) => (
				<rect key={i} x={L.x + Math.cos(a) * 40 - 12} y={L.y + Math.sin(a) * 40 - 8} width={24} height={16} rx={4} fill="#d8c08a" opacity={fade(frame, 20 + i * 2)} />
			))}
			{ring(14).map((a, i) => (
				<circle key={i} cx={L.x + Math.cos(a) * 250} cy={L.y + Math.sin(a) * 250} r={34} fill="#7a5a34" stroke="#e8cf98" strokeWidth={3} opacity={fade(frame, 30 + i * 3)} />
			))}
			<Label x={L.x} y={L.y + 10} text="広場・墓" at={28} anchor="middle" size={34} />
			<Label x={L.x} y={950} text="真ん中に広場、まわりに家" at={70} anchor="middle" size={40} />
			<g opacity={right}>
				<Label x={R.x} y={230} text="弥生の村" at={90} anchor="middle" color="#ff9a8a" size={64} />
				<ellipse cx={R.x} cy={R.y} rx={330} ry={270} fill="none" stroke="#2f6f9a" strokeWidth={22} />
				<ellipse cx={R.x} cy={R.y} rx={280} ry={225} fill="none" stroke="#2f6f9a" strokeWidth={18} />
				{Array.from({length: 48}, (_, i) => {
					const a = (i / 48) * Math.PI * 2;
					return <line key={i} x1={R.x + Math.cos(a) * 252} y1={R.y + Math.sin(a) * 200} x2={R.x + Math.cos(a) * 262} y2={R.y + Math.sin(a) * 210 - 26} stroke="#d9c08a" strokeWidth={5} />;
				})}
				{[-120, 0, 120].map((dx, i) => (
					<rect key={i} x={R.x + dx - 30} y={R.y - 40 + (i % 2) * 70} width={60} height={44} rx={6} fill="#7a5a34" stroke="#e8cf98" strokeWidth={3} />
				))}
				<rect x={R.x + 170} y={R.y - 170} width={44} height={44} fill="#c0392b" />
				<Label x={R.x} y={950} text="二重の堀と柵で囲む" at={120} anchor="middle" size={40} color="#ffcfc4" />
			</g>
		</Canvas>
	);
};

// ストーンサークル：石の並びが夏至の日の入りの方向を指す。石の下には墓の穴
export const SunLine: React.FC<{readonly tone?: Tone; readonly graves?: boolean}> = ({tone = 'ember', graves: showGraves = false}) => {
	const frame = useCurrentFrame();
	const c1 = {x: 640, y: 720};
	const c2 = {x: 1060, y: 580};
	const stones = (c: {x: number; y: number}, r: number, n: number, k: number) =>
		Array.from({length: n}, (_, i) => {
			const a = (i / n) * Math.PI * 2;
			return <ellipse key={`${k}-${i}`} cx={c.x + Math.cos(a) * r} cy={c.y + Math.sin(a) * r * 0.7} rx={22} ry={14} fill="#9a8f7a" stroke="#2a241a" strokeWidth={3} opacity={fade(frame, 6 + i)} />;
		});
	const line = interpolate(frame, [40, 100], [0, 1], easeInOut);
	const sx = c1.x + (c2.x - c1.x) * 2.5 * line;
	const sy = c1.y + (c2.y - c1.y) * 2.5 * line;
	const graves = showGraves ? fade(frame, 130, 30) : 0;
	return (
		<Canvas tone={tone}>
			<circle cx={1730} cy={370} r={70} fill="#ffb04a" opacity={fade(frame, 80) * 0.9} />
			<Label x={1730} y={500} text="夏至の日の入り" at={90} anchor="middle" color="#ffcf8a" />
			{stones(c1, 190, 26, 1)}
			{stones(c2, 150, 22, 2)}
			<circle cx={c1.x} cy={c1.y} r={16} fill={colors.gold} />
			<circle cx={c2.x} cy={c2.y} r={16} fill={colors.gold} />
			<line x1={c1.x} y1={c1.y} x2={sx} y2={sy} stroke="#ffb04a" strokeWidth={8} strokeDasharray="18 12" />
			<g opacity={graves}>
				{[0, 1, 2, 3, 4, 5].map((i) => {
					const a = (i / 6) * Math.PI * 2 + 0.4;
					return <rect key={i} x={c1.x + Math.cos(a) * 190 - 26} y={c1.y + Math.sin(a) * 133 + 34} width={52} height={30} rx={6} fill="#c0392b" opacity={0.85} />;
				})}
				<Label x={c1.x} y={c1.y + 300} text="石の組の下に、穴" at={130} anchor="middle" color="#ffb3a6" size={48} />
			</g>
		</Canvas>
	);
};

// 人の数の波（模式図）。増えて、減る。出来事の印を置く
export type WaveMark = {readonly year: number; readonly label: string; readonly red?: boolean};
export const PopWave: React.FC<{readonly marks: readonly WaveMark[]; readonly tone?: Tone; readonly note?: string}> = ({marks, tone = 'night', note = '人の数の動き（模式図）'}) => {
	const frame = useCurrentFrame();
	const x = (y: number) => 200 + ((16000 - y) / 13500) * 1520;
	const base = 820;
	const curve = (y: number) => {
		const a = Math.exp(-Math.pow((y - 5000) / 1700, 2)) * 370;
		const b = Math.exp(-Math.pow((y - 9000) / 1500, 2)) * 120;
		return base - 40 - a - b;
	};
	const pts = Array.from({length: 136}, (_, i) => 16000 - i * 100).map((y) => `${x(y)},${curve(y)}`);
	const p = interpolate(frame, [10, 110], [0, 1], easeInOut);
	const shown = pts.slice(0, Math.max(2, Math.round(pts.length * p)));
	return (
		<Canvas tone={tone}>
			<line x1={200} y1={base} x2={1730} y2={base} stroke="rgba(239,230,210,0.4)" strokeWidth={4} />
			{[16000, 12000, 8000, 4000].map((y) => (
				<text key={y} x={x(y)} y={base + 56} textAnchor="middle" {...svgGothic(32, '#9fb0c8', 700)}>
					{y}年前
				</text>
			))}
			<polyline points={shown.join(' ')} fill="none" stroke={colors.goldSoft} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
			{marks.map((m, i) => {
				const at = 60 + i * 26;
				return (
					<g key={i} opacity={fade(frame, at)}>
						<line x1={x(m.year)} y1={base} x2={x(m.year)} y2={360} stroke={m.red ? '#e0604f' : '#7fa7d0'} strokeWidth={4} strokeDasharray="10 8" />
						<text x={x(m.year)} y={340} textAnchor="middle" {...svgGothic(40, m.red ? '#ffb3a6' : '#cfe2ff', 900)}>
							{m.label}
						</text>
					</g>
				);
			})}
			<text x={1730} y={base + 110} textAnchor="end" {...svgGothic(30, '#8ea2bd', 700)} opacity={fade(frame, 40)}>
				{note}
			</text>
		</Canvas>
	);
};

// 二つの流れが混ざり合う（縄文の人々 ＋ 海を渡ってきた人々 → いまの日本人）
export const MixStream: React.FC<{readonly a: string; readonly b: string; readonly out: string; readonly tone?: Tone}> = ({a, b, out, tone = 'night'}) => {
	const frame = useCurrentFrame();
	const pa = 'M 140 460 C 600 460 800 640 1180 660';
	const pb = 'M 780 860 C 920 820 1050 720 1180 660';
	const po = 'M 1180 660 L 1800 660';
	const da = interpolate(frame, [6, 70], [1600, 0], clamp);
	const db = interpolate(frame, [50, 110], [900, 0], clamp);
	const dout = interpolate(frame, [100, 150], [700, 0], clamp);
	return (
		<Canvas tone={tone}>
			<path d={pa} fill="none" stroke="#d9a845" strokeWidth={56} strokeLinecap="round" strokeDasharray={1600} strokeDashoffset={da} opacity={0.9} />
			<path d={pb} fill="none" stroke="#4f8fc9" strokeWidth={40} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={db} opacity={0.9} />
			<path d={po} fill="none" stroke="url(#mixg)" strokeWidth={72} strokeLinecap="round" strokeDasharray={700} strokeDashoffset={dout} />
			<defs>
				<linearGradient id="mixg" x1="0" x2="1" y1="0" y2="0">
					<stop offset="0" stopColor="#d9a845" />
					<stop offset="1" stopColor="#8fb0a0" />
				</linearGradient>
			</defs>
			<text x={140} y={410} {...svgMincho(60, '#ffd98a')} opacity={fade(frame, 10)}>
				{a}
			</text>
			<text x={740} y={880} textAnchor="end" {...svgMincho(52, '#a8d0ff')} opacity={fade(frame, 60)}>
				{b}
			</text>
			<text x={1780} y={590} textAnchor="end" {...svgMincho(64, '#fbf6ea')} opacity={fade(frame, 120)}>
				{out}
			</text>
		</Canvas>
	);
};

// 長さをくらべる（定規のように二本の帯を伸ばす）
export const SpanCompare: React.FC<{readonly spans: readonly {readonly label: string; readonly years: number; readonly accent?: boolean}[]; readonly tone?: Tone}> = ({spans, tone = 'night'}) => {
	const frame = useCurrentFrame();
	const max = Math.max(...spans.map((s) => s.years));
	return (
		<Canvas tone={tone}>
			{spans.map((s, i) => {
				const at = 10 + i * 40;
				const g = interpolate(frame, [at, at + 60], [0, 1], easeOut);
				const y = 380 + i * 260;
				const w = (s.years / max) * 1180 * g;
				return (
					<g key={i} opacity={fade(frame, at)}>
						<text x={210} y={y - 30} {...svgGothic(52, '#efe6d2', 900)}>
							{s.label}
						</text>
						<rect x={210} y={y} width={w} height={90} rx={10} fill={s.accent ? '#c79a3a' : '#4f6f93'} />
						<text x={210 + w + 24} y={y + 70} {...svgMincho(70, s.accent ? '#ffd98a' : '#cfe2ff')}>
							約{Math.round((s.years * g) / 100) * 100}年
						</text>
					</g>
				);
			})}
		</Canvas>
	);
};
