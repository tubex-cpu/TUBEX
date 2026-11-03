import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, easeOut, Reveal, svgGothic, svgMincho} from './Cinema';
import {Canvas, rand} from './IzumoKit';

// 出雲判決：冒頭〜第7の手がかりの図解

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BRONZE = '#5f8f7c';
const BRONZE_LIGHT = '#9cc7b1';
const EARTH = '#3b2a1c';

// 銅剣1本（横向き。x,y は柄の端）
const Sword: React.FC<{readonly x: number; readonly y: number; readonly len?: number; readonly w?: number; readonly color?: string; readonly mark?: boolean; readonly rot?: number}> = ({
	x,
	y,
	len = 150,
	w = 12,
	color = BRONZE,
	mark,
	rot = 0,
}) => (
	<g transform={`translate(${x} ${y}) rotate(${rot})`}>
		<rect x={0} y={-w * 0.28} width={len * 0.16} height={w * 0.56} fill={color} opacity={0.9} />
		<path d={`M ${len * 0.16} ${-w / 2} L ${len * 0.9} ${-w * 0.42} L ${len} 0 L ${len * 0.9} ${w * 0.42} L ${len * 0.16} ${w / 2} Z`} fill={color} />
		<line x1={len * 0.18} y1={0} x2={len * 0.95} y2={0} stroke={BRONZE_LIGHT} strokeWidth={w * 0.12} opacity={0.6} />
		{mark ? (
			<g stroke="#ffcf7a" strokeWidth={w * 0.22} strokeLinecap="round">
				<line x1={len * 0.04} y1={-w * 0.22} x2={len * 0.12} y2={w * 0.22} />
				<line x1={len * 0.12} y1={-w * 0.22} x2={len * 0.04} y2={w * 0.22} />
			</g>
		) : null}
	</g>
);

// 銅鐸1個（x,y は底の中心、h は高さ）
export const Bell: React.FC<{readonly x: number; readonly y: number; readonly h: number; readonly color?: string; readonly mark?: boolean; readonly opacity?: number}> = ({x, y, h, color = BRONZE, mark, opacity = 1}) => {
	const w = h * 0.62;
	return (
		<g transform={`translate(${x} ${y})`} opacity={opacity}>
			<path d={`M ${-w * 0.36} ${-h * 0.82} Q 0 ${-h * 1.12} ${w * 0.36} ${-h * 0.82}`} stroke={color} strokeWidth={h * 0.07} fill="none" />
			<path d={`M ${-w * 0.36} ${-h * 0.8} L ${w * 0.36} ${-h * 0.8} L ${w / 2} 0 L ${-w / 2} 0 Z`} fill={color} />
			{[0.3, 0.5].map((k) => (
				<line key={k} x1={-w * 0.4} y1={-h * k} x2={w * 0.4} y2={-h * k} stroke={BRONZE_LIGHT} strokeWidth={h * 0.02} opacity={0.6} />
			))}
			<line x1={0} y1={-h * 0.78} x2={0} y2={-h * 0.05} stroke={BRONZE_LIGHT} strokeWidth={h * 0.02} opacity={0.5} />
			{mark ? (
				<g stroke="#ffcf7a" strokeWidth={h * 0.04} strokeLinecap="round">
					<line x1={-w * 0.1} y1={-h * 0.95} x2={w * 0.1} y2={-h * 0.85} />
					<line x1={w * 0.1} y1={-h * 0.95} x2={-w * 0.1} y2={-h * 0.85} />
				</g>
			) : null}
		</g>
	);
};

// 冒頭：土の中から、銅剣が次々と現れる（数が数えあがる）
export const SwordReveal: React.FC = () => {
	const frame = useCurrentFrame();
	const n = Math.round(interpolate(frame, [10, 150], [0, 358], easeInOut));
	return (
		<Canvas tone="ember">
			<rect x={0} y={330} width={1920} height={750} fill={EARTH} opacity={0.75} />
			{[...Array(358)].map((_, i) => {
				const row = i % 4;
				const col = Math.floor(i / 4);
				const x = 140 + col * 18.6 + row * 6;
				const y = 420 + row * 120;
				return i < n ? <Sword key={i} x={x} y={y} len={110} w={9} rot={-90 + (rand(i) - 0.5) * 6} color={i === n - 1 ? BRONZE_LIGHT : BRONZE} /> : null;
			})}
			<text x={1780} y={820} textAnchor="end" {...svgMincho(170, colors.goldSoft)}>
				{n}
			</text>
			<text x={1780} y={880} textAnchor="end" {...svgGothic(40, '#efe6d2', 900)}>
				本
			</text>
		</Canvas>
	);
};

// 冒頭：平安時代の出雲大社（言い伝え）と、15階建てのビル
export const HeightTeaser: React.FC = () => {
	const frame = useCurrentFrame();
	const grow = interpolate(frame, [10, 90], [0, 1], easeOut);
	const ground = 960;
	const m = 12; // 1mあたりのピクセル
	const h = 48 * m * grow;
	return (
		<Canvas tone="night">
			<line x1={100} y1={ground} x2={1820} y2={ground} stroke="#4a5a72" strokeWidth={4} />
			{/* 本殿：9本の柱で持ち上げた社殿 */}
			<g transform={`translate(760 ${ground})`}>
				{[-90, 0, 90].map((dx) => (
					<rect key={dx} x={dx - 9} y={-h + 110 * grow} width={18} height={Math.max(0, h - 110 * grow)} fill="#b9895c" />
				))}
				<path d={`M -140 ${-h + 110 * grow} L 140 ${-h + 110 * grow} L 140 ${-h + 40 * grow} L -140 ${-h + 40 * grow} Z`} fill="#c9a06a" opacity={grow} />
				<path d={`M -175 ${-h + 45 * grow} L 0 ${-h - 30 * grow} L 175 ${-h + 45 * grow} Z`} fill="#6b4a2e" opacity={grow} />
				<path d={`M 0 ${-h + 110 * grow} L 0 0`} stroke="none" />
				<path d={`M -40 0 L 40 0 L 30 ${-h + 120 * grow} L -30 ${-h + 120 * grow} Z`} fill="#8a6440" opacity={0.0} />
				<line x1={-60} y1={0} x2={-25} y2={-h + 115 * grow} stroke="#d8b483" strokeWidth={6} opacity={0.0} />
			</g>
			{/* 長い階段 */}
			<path d={`M 860 ${ground - h + 110 * grow} L 1500 ${ground}`} stroke="#d8b483" strokeWidth={10} opacity={grow} />
			{/* ビル */}
			<Reveal at={60}>
				<g transform={`translate(1640 ${ground})`}>
					<rect x={-80} y={-48 * m} width={160} height={48 * m} fill="#2b3b55" stroke="#5a6f92" strokeWidth={3} />
					{[...Array(15)].map((_, i) => (
						<line key={i} x1={-80} y1={-(i + 1) * 3.2 * m} x2={80} y2={-(i + 1) * 3.2 * m} stroke="#5a6f92" strokeWidth={2} />
					))}
					<text x={0} y={-48 * m - 24} textAnchor="middle" {...svgGothic(34, '#c9d3e3', 900)}>
						15階建て
					</text>
				</g>
			</Reveal>
			<g opacity={interpolate(frame, [80, 100], [0, 1], clamp)}>
				<line x1={420} y1={ground} x2={420} y2={ground - 48 * m} stroke={colors.goldSoft} strokeWidth={4} />
				<line x1={400} y1={ground - 48 * m} x2={440} y2={ground - 48 * m} stroke={colors.goldSoft} strokeWidth={4} />
				<text x={390} y={ground - 24 * m} textAnchor="end" {...svgMincho(110, colors.goldSoft)}>
					48m
				</text>
			</g>
		</Canvas>
	);
};

// 冒頭：3キロ離れた2つの谷に、同じ印
export const MarkMatch: React.FC = () => {
	const frame = useCurrentFrame();
	const link = interpolate(frame, [70, 120], [0, 1], easeInOut);
	return (
		<Canvas tone="bronze">
			<Reveal at={8}>
				<g transform="translate(470 620)">
					<Sword x={-330} y={0} len={560} w={60} mark />
					<circle cx={-330 + 50} cy={0} r={70} fill="none" stroke="#ffcf7a" strokeWidth={5} opacity={interpolate(frame, [30, 45], [0, 1], clamp)} />
					<text x={0} y={140} textAnchor="middle" {...svgMincho(56, colors.goldSoft)}>
						荒神谷の銅剣
					</text>
				</g>
			</Reveal>
			<Reveal at={36}>
				<g transform="translate(1450 760)">
					<Bell x={0} y={0} h={420} mark />
					<circle cx={0} cy={-380} r={70} fill="none" stroke="#ffcf7a" strokeWidth={5} opacity={interpolate(frame, [55, 70], [0, 1], clamp)} />
					<text x={0} y={80} textAnchor="middle" {...svgMincho(56, colors.goldSoft)}>
						加茂岩倉の銅鐸
					</text>
				</g>
			</Reveal>
			<path d="M 210 560 Q 820 330 1450 380" stroke="#ffcf7a" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${link} 1`} strokeLinecap="round" />
			<text x={830} y={420} textAnchor="middle" {...svgMincho(80, '#fff3d6')} opacity={interpolate(frame, [110, 130], [0, 1], clamp)}>
				同じ印
			</text>
		</Canvas>
	);
};

// 第1の手がかり：神「無」月の「な」は「の」
export const KanjiNo: React.FC = () => {
	const frame = useCurrentFrame();
	const swap = interpolate(frame, [70, 100], [0, 1], easeInOut);
	const chars = ['神', '無', '月'];
	return (
		<Canvas tone="shrine">
			{chars.map((c, i) => {
				const x = 560 + i * 400;
				if (i === 1) {
					return (
						<g key={c}>
							<text x={x} y={700} textAnchor="middle" {...svgMincho(300, '#fbf6ea')} opacity={1 - swap}>
								無
							</text>
							<text x={x} y={700} textAnchor="middle" {...svgMincho(300, '#ff9b7a')} opacity={swap}>
								の
							</text>
						</g>
					);
				}
				return (
					<text key={c} x={x} y={700} textAnchor="middle" {...svgMincho(300, '#fbf6ea')}>
						{c}
					</text>
				);
			})}
			<Reveal at={30}>
				<text x={960} y={850} textAnchor="middle" {...svgGothic(48, colors.goldSoft, 900)}>
					{'かみ「な」づき　→　「な」は「の」？'}
				</text>
			</Reveal>
		</Canvas>
	);
};

// 第1の手がかり：昔の月の名前（「な」がつく月）
export const MonthNames: React.FC = () => {
	const frame = useCurrentFrame();
	const names = ['睦月', '如月', '弥生', '卯月', '皐月', '水無月', '文月', '葉月', '長月', '神無月', '霜月', '師走'];
	return (
		<Canvas tone="night">
			{names.map((n, i) => {
				const a = ((i - 2.5) / 12) * Math.PI * 2;
				const x = 960 + Math.cos(a) * 300;
				const y = 590 + Math.sin(a) * 225;
				const hot = i === 5 || i === 9;
				const o = interpolate(frame, [6 + i * 4, 18 + i * 4], [0, 1], clamp);
				return (
					<g key={n} opacity={o}>
						<circle cx={x} cy={y} r={hot ? 92 : 70} fill={hot ? '#5a1f18' : '#16233a'} stroke={hot ? '#ff9b7a' : '#3c4f6e'} strokeWidth={4} />
						<text x={x} y={y + (hot ? 16 : 13)} textAnchor="middle" {...svgMincho(hot ? 46 : 38, hot ? '#ffd9c8' : '#dfe6f2')}>
							{n}
						</text>
						<text x={x} y={y - (hot ? 44 : 34)} textAnchor="middle" {...svgGothic(22, '#9fb0c8', 900)}>
							{i + 1}月
						</text>
					</g>
				);
			})}
			<Reveal at={70}>
				<text x={960} y={590} textAnchor="middle" {...svgMincho(54, colors.goldSoft)}>
					水の月
				</text>
				<text x={960} y={660} textAnchor="middle" {...svgMincho(54, colors.goldSoft)}>
					神の月
				</text>
			</Reveal>
		</Canvas>
	);
};

// 第2の手がかり：古い本の年代と、400年のすき間
export const BookGap: React.FC = () => {
	const frame = useCurrentFrame();
	const x = (yr: number) => 200 + ((yr - 690) / (1170 - 690)) * 1520;
	const books = [
		{yr: 712, name: '古事記', dy: 0},
		{yr: 720, name: '日本書紀', dy: 1},
		{yr: 733, name: '出雲国風土記', dy: 2},
		{yr: 1140, name: '奥義抄', dy: 0, hot: true},
	];
	const line = interpolate(frame, [6, 70], [0, 1], easeInOut);
	return (
		<Canvas tone="ink">
			<line x1={x(690)} y1={560} x2={x(690) + (x(1170) - x(690)) * line} y2={560} stroke="#4c5a70" strokeWidth={6} />
			{[700, 800, 900, 1000, 1100].map((y) => (
				<text key={y} x={x(y)} y={610} textAnchor="middle" {...svgGothic(28, '#7f8ea8', 700)} opacity={line}>
					{y}年
				</text>
			))}
			{books.map((b, i) => {
				const at = 20 + i * 22 + (b.hot ? 30 : 0);
				return (
					<g key={b.name} opacity={interpolate(frame, [at, at + 14], [0, 1], clamp)}>
						<circle cx={x(b.yr)} cy={560} r={14} fill={b.hot ? '#ff8f80' : colors.gold} />
						<line x1={x(b.yr)} y1={546} x2={x(b.yr)} y2={470 - b.dy * 70} stroke={b.hot ? '#ff8f80' : colors.gold} strokeWidth={3} />
						<text x={x(b.yr) + (b.hot ? 0 : 14)} y={455 - b.dy * 70} textAnchor={b.hot ? 'middle' : 'start'} {...svgMincho(50, b.hot ? '#ffd0c8' : '#fbf6ea')}>
							{b.name}
						</text>
						<text x={x(b.yr) + (b.hot ? 0 : 14)} y={455 - b.dy * 70 + (b.hot ? -62 : 0)} dx={b.hot ? 0 : 0} textAnchor={b.hot ? 'middle' : 'start'} {...svgGothic(28, '#9fb0c8', 700)} opacity={b.hot ? 1 : 0}>
							1140年ごろ
						</text>
					</g>
				);
			})}
			<g opacity={interpolate(frame, [110, 130], [0, 1], clamp)}>
				<path d={`M ${x(735)} 680 Q ${x(735)} 720 ${x(760)} 720 L ${x(910)} 720 Q ${x(937)} 720 ${x(937)} 760 Q ${x(937)} 720 ${x(965)} 720 L ${x(1115)} 720 Q ${x(1140)} 720 ${x(1140)} 680`} stroke="#ff8f80" strokeWidth={5} fill="none" />
				<text x={x(937)} y={840} textAnchor="middle" {...svgMincho(80, '#ffd0c8')}>
					400年以上
				</text>
				<text x={x(937)} y={900} textAnchor="middle" {...svgGothic(34, '#d7dfeb', 900)}>
					神々が出雲に集まる話は、どこにもない
				</text>
			</g>
		</Canvas>
	);
};

// 第3の手がかり：古事記3巻と、上巻の中の出雲
export const KojikiShare: React.FC = () => {
	const frame = useCurrentFrame();
	const fill = interpolate(frame, [50, 100], [0, 1], easeOut);
	const vols = ['上巻', '中巻', '下巻'];
	return (
		<Canvas tone="shrine">
			{vols.map((v, i) => (
				<Reveal key={v} at={8 + i * 12}>
					<g transform={`translate(${430 + i * 530} 360)`}>
						<rect x={-150} y={0} width={300} height={440} rx={14} fill={i === 0 ? '#3b2412' : '#211a16'} stroke={i === 0 ? colors.gold : '#5d4a3a'} strokeWidth={4} />
						<text x={0} y={-24} textAnchor="middle" {...svgMincho(60, i === 0 ? colors.goldSoft : '#cbbfa8')}>
							{v}
						</text>
						<text x={0} y={250} textAnchor="middle" {...svgGothic(34, '#cbbfa8', 900)}>
							{i === 0 ? '神々の時代' : i === 1 ? '天皇の時代' : '天皇の時代'}
						</text>
						{i === 0 ? (
							<g>
								<rect x={-150} y={440 - 440 * 0.34 * fill} width={300} height={440 * 0.34 * fill} rx={0} fill="#c0392b" opacity={0.85} />
								<text x={0} y={420} textAnchor="middle" {...svgMincho(52, '#fff')} opacity={fill}>
									出雲の話
								</text>
								<text x={200} y={440 - 440 * 0.17 * fill} {...svgMincho(70, '#ff9b7a')} opacity={fill}>
									約⅓
								</text>
							</g>
						) : null}
					</g>
				</Reveal>
			))}
		</Canvas>
	);
};

// 第3の手がかり：大国主の5つの名前
export const FiveNames: React.FC = () => {
	const frame = useCurrentFrame();
	const names = ['大国主神', 'オオナムヂ', 'アシハラシコオ', 'ヤチホコ', 'ウツシクニタマ'];
	return (
		<Canvas tone="shrine">
			<Reveal at={6}>
				<circle cx={960} cy={620} r={150} fill="#3b1a14" stroke={colors.gold} strokeWidth={5} />
				<text x={960} y={600} textAnchor="middle" {...svgMincho(70, colors.goldSoft)}>
					大国主
				</text>
				<text x={960} y={670} textAnchor="middle" {...svgGothic(30, '#e9d8c2', 900)}>
					5つの名前
				</text>
			</Reveal>
			{names.slice(1).map((n, i) => {
				const a = -Math.PI / 2 + ((i + 0.5) / 4) * Math.PI * 2 - Math.PI / 4;
				const x = 960 + Math.cos(a) * 520;
				const y = 620 + Math.sin(a) * 250;
				const at = 30 + i * 16;
				return (
					<g key={n} opacity={interpolate(frame, [at, at + 14], [0, 1], clamp)}>
						<line x1={960 + Math.cos(a) * 150} y1={620 + Math.sin(a) * 150} x2={x} y2={y} stroke="#7a5a3a" strokeWidth={3} />
						<rect x={x - 220} y={y - 50} width={440} height={96} rx={48} fill="#1d1410" stroke="#a07a4a" strokeWidth={3} />
						<text x={x} y={y + 16} textAnchor="middle" {...svgMincho(48, '#fbf6ea')}>
							{n}
						</text>
					</g>
				);
			})}
		</Canvas>
	);
};

// 第5の手がかり：八つの頭の大蛇と、枝分かれする川
export const OrochiRiver: React.FC = () => {
	const frame = useCurrentFrame();
	const morph = interpolate(frame, [70, 130], [0, 1], easeInOut);
	const heads = [...Array(8)].map((_, i) => {
		const ang = -Math.PI * 0.92 + (i / 7) * Math.PI * 0.84;
		return {ang, len: 420 + rand(i) * 120};
	});
	return (
		<Canvas tone="ember">
			{heads.map((h, i) => {
				const x1 = 960 + Math.cos(h.ang) * h.len;
				const y1 = 860 + Math.sin(h.ang) * h.len * 0.9;
				const cx = 960 + Math.cos(h.ang + 0.3) * h.len * 0.5;
				const cy = 860 + Math.sin(h.ang + 0.3) * h.len * 0.5;
				const draw = interpolate(frame, [8 + i * 6, 50 + i * 6], [0, 1], easeOut);
				const c = morph < 0.5 ? '#7a2a1e' : '#2c6c80';
				return (
					<g key={i}>
						<path d={`M 960 880 Q ${cx} ${cy} ${x1} ${y1}`} stroke={c} strokeWidth={interpolate(morph, [0, 1], [46, 18])} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} opacity={0.95} />
						<circle cx={x1} cy={y1} r={interpolate(morph, [0, 1], [30, 8])} fill={morph < 0.5 ? '#9c3423' : '#4fa3bd'} opacity={draw} />
						<circle cx={x1 + 8} cy={y1 - 8} r={7} fill="#ff4a2a" opacity={draw * (1 - morph)} />
					</g>
				);
			})}
			<path d="M 960 880 L 960 1080" stroke={morph < 0.5 ? '#7a2a1e' : '#2c6c80'} strokeWidth={interpolate(morph, [0, 1], [70, 40])} />
			<text x={250} y={420} {...svgMincho(64, '#ff9b7a')} opacity={1 - morph}>
				八つの頭
			</text>
			<text x={1420} y={420} {...svgMincho(64, '#9fd6e6')} opacity={morph}>
				いくつもの支流
			</text>
		</Canvas>
	);
};

// 第5の手がかり：たたら製鉄（砂鉄と炭を炉で焼いて、鉄を取り出す）
export const TataraFlow: React.FC = () => {
	const frame = useCurrentFrame();
	const fire = 0.75 + 0.25 * Math.sin(frame / 4);
	const steps = [
		{x: 380, title: '砂鉄', sub: '川の砂から'},
		{x: 960, title: '炉で焼く', sub: '炭の火で'},
		{x: 1540, title: '鉄', sub: 'かたい鉄の塊'},
	];
	return (
		<Canvas tone="ember">
			<Reveal at={8}>
				{[...Array(160)].map((_, i) => (
					<circle key={i} cx={380 + (rand(i) - 0.5) * 300} cy={640 + (rand(i + 4) - 0.5) * 120} r={3 + rand(i + 2) * 3} fill="#2a2a2e" />
				))}
			</Reveal>
			<Reveal at={34}>
				<path d="M 830 760 L 1090 760 L 1050 520 L 870 520 Z" fill="#6b4a32" stroke="#3a2618" strokeWidth={8} />
				<ellipse cx={960} cy={520} rx={90} ry={22} fill="#ff7a2a" opacity={fire} />
				{[...Array(10)].map((_, i) => (
					<circle key={i} cx={930 + rand(i) * 60} cy={500 - ((frame * 3 + i * 23) % 140)} r={4} fill="#ffc06a" opacity={0.8 - ((frame * 3 + i * 23) % 140) / 180} />
				))}
			</Reveal>
			<Reveal at={60}>
				<path d="M 1460 700 Q 1500 600 1580 610 Q 1660 620 1640 700 Q 1600 740 1520 730 Z" fill="#59606b" stroke="#9aa4b2" strokeWidth={4} />
			</Reveal>
			{steps.map((s, i) => (
				<Reveal key={s.title} at={8 + i * 26}>
					<text x={s.x} y={860} textAnchor="middle" {...svgMincho(60, colors.goldSoft)}>
						{s.title}
					</text>
					<text x={s.x} y={915} textAnchor="middle" {...svgGothic(32, '#e9d8c2', 900)}>
						{s.sub}
					</text>
				</Reveal>
			))}
			{[0, 1].map((i) => (
				<path key={i} d={`M ${560 + i * 580} 640 L ${760 + i * 580} 640`} stroke={colors.gold} strokeWidth={6} opacity={interpolate(frame, [26 + i * 26, 40 + i * 26], [0, 1], clamp)} markerEnd="" />
			))}
		</Canvas>
	);
};

// 第6の手がかり：谷の斜面の断面と、地面から50センチの粘土の層
export const DigSection: React.FC = () => {
	const frame = useCurrentFrame();
	const dig = interpolate(frame, [20, 90], [0, 1], easeInOut);
	return (
		<Canvas tone="moss">
			<path d="M 0 520 L 700 520 Q 1100 520 1500 330 L 1920 250 L 1920 1080 L 0 1080 Z" fill="#4a3a26" />
			<path d="M 0 520 L 700 520 Q 1100 520 1500 330 L 1920 250" stroke="#7aa05a" strokeWidth={14} fill="none" />
			<path d="M 0 600 L 700 600 Q 1100 600 1500 410 L 1920 330" stroke="#6b5434" strokeWidth={60} fill="none" opacity={0.6} />
			{/* 掘った穴 */}
			<g opacity={dig}>
				<path d="M 1040 470 L 1290 380 L 1300 470 L 1060 560 Z" fill="#20160e" />
				{[...Array(12)].map((_, i) => (
					<line key={i} x1={1070 + i * 18} y1={540 - i * 6.6} x2={1072 + i * 18} y2={505 - i * 6.6} stroke={BRONZE_LIGHT} strokeWidth={6} />
				))}
			</g>
			<g opacity={interpolate(frame, [70, 90], [0, 1], clamp)}>
				<line x1={1350} y1={360} x2={1350} y2={450} stroke="#fff3d6" strokeWidth={4} />
				<text x={1380} y={420} {...svgMincho(60, '#fff3d6')}>
					約50cm
				</text>
				<text x={1120} y={680} textAnchor="middle" {...svgGothic(36, '#efe6d2', 900)}>
					粘土の層
				</text>
			</g>
			<text x={320} y={470} textAnchor="middle" {...svgGothic(34, '#d9e6c8', 900)} opacity={interpolate(frame, [10, 24], [0, 1], clamp)}>
				谷の底
			</text>
		</Canvas>
	);
};

// 第7の手がかり：4列に、刃を立てて並べた銅剣（上から見た図）
export const RowsDiagram: React.FC = () => {
	const frame = useCurrentFrame();
	const counts = [34, 111, 120, 93];
	return (
		<Canvas tone="ember">
			<rect x={140} y={330} width={1640} height={600} rx={20} fill={EARTH} opacity={0.8} />
			{counts.map((n, r) => (
				<g key={r}>
					{[...Array(n)].map((_, i) => {
						const at = 6 + r * 20 + i * 0.5;
						const x = 200 + i * (1520 / 120);
						return <line key={i} x1={x} y1={380 + r * 140} x2={x} y2={480 + r * 140} stroke={BRONZE} strokeWidth={6} opacity={interpolate(frame, [at, at + 8], [0, 1], clamp)} />;
					})}
					<text x={170} y={440 + r * 140} textAnchor="end" {...svgGothic(34, colors.goldSoft, 900)} opacity={interpolate(frame, [6 + r * 20, 20 + r * 20], [0, 1], clamp)}>
						{'ABCD'[r]}
					</text>
				</g>
			))}
			<g opacity={interpolate(frame, [100, 120], [0, 1], clamp)}>
				<rect x={1300} y={820} width={440} height={90} rx={14} fill="rgba(3,6,14,0.8)" />
				<text x={1520} y={880} textAnchor="middle" {...svgMincho(48, colors.goldSoft)}>
					刃を立てて、4列
				</text>
			</g>
		</Canvas>
	);
};

// 第7の手がかり：なかご（持ち手）に刻まれたバツの印
export const NakagoMark: React.FC = () => {
	const frame = useCurrentFrame();
	const zoom = interpolate(frame, [40, 100], [0, 1], easeInOut);
	return (
		<Canvas tone="bronze">
			<g opacity={1 - zoom * 0.6}>
				<Sword x={260} y={560} len={1300} w={110} />
				<text x={300} y={720} {...svgGothic(36, '#cfe3d6', 900)}>
					なかご（持ち手の部分）
				</text>
			</g>
			<g opacity={zoom} transform={`translate(960 560) scale(${0.6 + zoom * 0.4})`}>
				<circle r={250} fill="#0c1a16" stroke="#ffcf7a" strokeWidth={6} />
				<rect x={-260} y={-60} width={520} height={120} fill={BRONZE} />
				<g stroke="#ffcf7a" strokeWidth={22} strokeLinecap="round">
					<line x1={-70} y1={-45} x2={70} y2={45} />
					<line x1={70} y1={-45} x2={-70} y2={45} />
				</g>
			</g>
			<text x={960} y={890} textAnchor="middle" {...svgMincho(60, colors.goldSoft)} opacity={interpolate(frame, [100, 120], [0, 1], clamp)}>
				ほとんどの剣に、同じ印
			</text>
		</Canvas>
	);
};

export {Sword};
