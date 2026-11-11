import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {easeInOut, svgGothic, svgMincho} from './Cinema';
import {Canvas, rand} from './IzumoKit';
import {P, ReliefMap} from './IzumoMap';

// 高千穂判決：図解

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fade = (f: number, at: number, len = 16) => interpolate(f, [at, at + len], [0, 1], clamp);

// 面をつけた舞い手のシルエット（鈴と御幣を持つ）
const Dancer: React.FC<{readonly x: number; readonly y: number; readonly h: number; readonly sway: number; readonly color?: string}> = ({x, y, h, sway, color = '#050302'}) => (
	<g transform={`translate(${x} ${y}) scale(${h / 300}) rotate(${sway * 6})`} fill={color}>
		<ellipse cx={0} cy={-262} rx={24} ry={30} />
		<path d="M -40 -226 L 40 -226 L 70 -60 L 90 0 L -90 0 L -70 -60 Z" />
		<path d={`M 40 -200 L ${110 + sway * 20} ${-260 + sway * 30}`} stroke={color} strokeWidth={16} strokeLinecap="round" />
		<path d={`M -40 -200 L ${-110 + sway * 20} ${-250 - sway * 30}`} stroke={color} strokeWidth={16} strokeLinecap="round" />
		<circle cx={118 + sway * 20} cy={-268 + sway * 30} r={12} fill="#d9b25a" />
		<path d={`M ${-118 + sway * 20} ${-262 - sway * 30} l -10 -40 l 10 8 l 10 -8 Z`} fill="#f4ecdc" />
	</g>
);

// 夜の神楽宿：注連と切り紙の飾り、焚き火の明かり、夜通し舞う人
export const KaguraNight: React.FC<{readonly dancers?: number}> = ({dancers = 2}) => {
	const frame = useCurrentFrame();
	const flick = 0.85 + 0.15 * Math.sin(frame * 0.7) * Math.sin(frame * 0.23);
	return (
		<Canvas tone="ember">
			{/* 星空 */}
			{Array.from({length: 90}, (_, i) => (
				<circle key={i} cx={rand(i) * 1920} cy={rand(i + 300) * 330} r={1 + rand(i + 9) * 2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(frame * 0.05 + i))} />
			))}
			{/* 山の稜線 */}
			<path d="M 0 420 L 220 330 L 420 380 L 640 300 L 900 370 L 1150 290 L 1400 360 L 1650 310 L 1920 380 L 1920 520 L 0 520 Z" fill="#0d0705" />
			{/* 神楽宿の舞台 */}
			<rect x={260} y={380} width={1400} height={520} fill="#2a1408" />
			<rect x={260} y={380} width={1400} height={520} fill={`rgba(255,160,70,${0.45 * flick})`} />
			{/* 注連縄と切り紙（彫り物） */}
			<path d="M 260 420 Q 960 470 1660 420" stroke="#d9c08a" strokeWidth={14} fill="none" />
			{Array.from({length: 14}, (_, i) => {
				const x = 330 + i * 98;
				const y = 425 + Math.sin((i / 13) * Math.PI) * 42;
				return (
					<g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(frame * 0.05 + i) * 4})`}>
						<rect x={-26} y={0} width={52} height={70} fill="#f4ecdc" opacity={0.92} />
						<rect x={-16} y={14} width={32} height={12} fill="#2a1408" />
						<rect x={-10} y={36} width={20} height={20} fill="#2a1408" />
					</g>
				);
			})}
			{/* 舞い手 */}
			{Array.from({length: dancers}, (_, i) => (
				<Dancer key={i} x={760 + i * 400 - (dancers - 1) * 200 + 200} y={860} h={380} sway={Math.sin(frame * 0.09 + i * 1.7)} />
			))}
			{/* 焚き火 */}
			{Array.from({length: 14}, (_, i) => {
				const t = (frame * 0.9 + i * 13) % 60;
				return <circle key={i} cx={180 + rand(i) * 60 + Math.sin(t * 0.3) * 10} cy={900 - t * 6} r={10 - t / 8} fill="#ffb347" opacity={1 - t / 60} />;
			})}
			<ellipse cx={210} cy={910} rx={110} ry={30} fill={`rgba(255,170,70,${0.6 * flick})`} />
		</Canvas>
	);
};

// 夜神楽の33番：日没から夜明けまで
export const KaguraClock: React.FC = () => {
	const frame = useCurrentFrame();
	const cx = 960;
	const cy = 860;
	const r = 640;
	const lit = interpolate(frame, [10, 130], [0, 33], clamp);
	const sky = interpolate(frame, [100, 150], [0, 1], clamp);
	return (
		<Canvas tone="night">
			<rect width={1920} height={1080} fill={`rgba(240,150,80,${0.25 * sky})`} />
			<path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} stroke="#33445e" strokeWidth={6} fill="none" />
			{Array.from({length: 33}, (_, i) => {
				const a = Math.PI - (i / 32) * Math.PI;
				const x = cx + Math.cos(a) * r;
				const y = cy - Math.sin(a) * r;
				const on = i < lit;
				return <circle key={i} cx={x} cy={y} r={i === 0 || i === 32 ? 20 : 13} fill={on ? colors.gold : '#2a3650'} opacity={on ? 1 : 0.8} />;
			})}
			<text x={cx - r} y={cy + 70} textAnchor="middle" {...svgMincho(46, colors.goldSoft)}>
				日没
			</text>
			<text x={cx - r} y={cy + 120} textAnchor="middle" {...svgGothic(32, '#efe6d2', 900)} opacity={fade(frame, 14)}>
				1番 彦舞
			</text>
			<text x={cx + r} y={cy + 70} textAnchor="middle" {...svgMincho(46, '#ffd9a8')}>
				夜明け
			</text>
			<text x={cx + r} y={cy + 120} textAnchor="middle" {...svgGothic(32, '#efe6d2', 900)} opacity={fade(frame, 130)}>
				33番 雲下し
			</text>
			<text x={cx} y={cy - 120} textAnchor="middle" {...svgMincho(150, colors.goldSoft)}>
				{Math.round(lit)}
			</text>
			<text x={cx} y={cy - 40} textAnchor="middle" {...svgGothic(40, '#efe6d2', 900)}>
				番
			</text>
		</Canvas>
	);
};

// 天岩戸の物語：太陽が岩屋に隠れて闇になり（close）、舞と笑いで戸が開く（open）
export const IwatoStory: React.FC<{readonly phase: 'close' | 'open'}> = ({phase}) => {
	const frame = useCurrentFrame();
	const doorX = phase === 'close' ? interpolate(frame, [20, 70], [0, 1], easeInOut) : interpolate(frame, [70, 120], [1, 0.35], easeInOut);
	const light = phase === 'close' ? 1 - doorX : interpolate(frame, [70, 130], [0, 1], clamp);
	const cave = {x: 1180, y: 300, w: 380, h: 520};
	return (
		<Canvas tone="ink">
			<rect width={1920} height={1080} fill={`rgba(255,210,120,${0.35 * light})`} />
			{/* 光の筋 */}
			{Array.from({length: 12}, (_, i) => (
				<path key={i} d={`M ${cave.x + cave.w / 2} ${cave.y + cave.h / 2} L ${cave.x + cave.w / 2 + Math.cos((i / 12) * Math.PI * 2) * 1400} ${cave.y + cave.h / 2 + Math.sin((i / 12) * Math.PI * 2) * 1400}`} stroke="#ffe7a8" strokeWidth={60} opacity={0.18 * light} />
			))}
			{/* 岩山と洞窟 */}
			<path d="M 900 960 L 1000 260 L 1200 160 L 1500 180 L 1760 300 L 1860 960 Z" fill="#3b3a36" stroke="#555" strokeWidth={4} />
			<rect x={cave.x} y={cave.y} width={cave.w} height={cave.h} rx={160} fill="#ffd36b" opacity={0.95} />
			{/* 岩戸（左から閉まる） */}
			<rect x={cave.x - 20} y={cave.y - 10} width={(cave.w + 40) * doorX} height={cave.h + 20} rx={40} fill="#5a5750" stroke="#2a2925" strokeWidth={6} />
			{/* 神々（シルエット） */}
			{Array.from({length: 9}, (_, i) => (
				<g key={i} transform={`translate(${120 + i * 80} ${900 - (i % 3) * 20})`} fill="#0b0b0e" opacity={phase === 'open' ? 1 : fade(frame, 60)}>
					<circle cx={0} cy={-150} r={20} />
					<path d="M -26 -128 L 26 -128 L 36 0 L -36 0 Z" />
				</g>
			))}
			{phase === 'open' ? (
				<g>
					<Dancer x={820} y={900} h={340} sway={Math.sin(frame * 0.25)} color="#0b0b0e" />
					<text x={500} y={460} textAnchor="middle" {...svgMincho(60, '#fff3d6')} opacity={interpolate(frame, [20, 34, 60, 70], [0, 1, 1, 0], clamp)}>
						どっと笑う神々
					</text>
				</g>
			) : (
				<text x={500} y={460} textAnchor="middle" {...svgMincho(60, '#c9d3e3')} opacity={fade(frame, 70)}>
					世界が闇に
				</text>
			)}
		</Canvas>
	);
};

// 第6の手がかり：地球の自転の遅れの値によって、古代の日食の皆既帯がずれる（イメージ）
export const EclipseShift: React.FC = () => {
	const frame = useCurrentFrame();
	const shift = interpolate(frame, [30, 90, 150, 210], [0, -260, 160, 0], easeInOut);
	return (
		<ReliefMap view="nihon" focus={P.kyushuNorth} zoom={1.15} pins={[{at: P.kyushuNorth, name: '北九州', big: true, t: 10, dy: -80}]}>
			{(p, k) => {
				const [x, y] = p(P.kyushuNorth);
				return (
					<g>
						<path
							d={`M ${x - 700 + shift} ${y - 520} L ${x - 560 + shift} ${y - 520} L ${x + 600 + shift} ${y + 560} L ${x + 460 + shift} ${y + 560} Z`}
							fill="rgba(5,8,20,0.55)"
							stroke="#ffcf7a"
							strokeWidth={4 * k}
							strokeDasharray={`${16 * k} ${10 * k}`}
						/>
						<text x={x + 260 + shift} y={y - 160} {...svgGothic(36 * k, '#fff3d6', 900)} stroke="rgba(0,0,0,0.85)" strokeWidth={8 * k} paintOrder="stroke">
							皆既の帯（イメージ）
						</text>
					</g>
				);
			}}
		</ReliefMap>
	);
};

// 第6の手がかり：地球の自転が少しずつ遅くなる
export const SlowEarth: React.FC = () => {
	const frame = useCurrentFrame();
	const rot = frame * 2.2;
	const gap = interpolate(frame, [40, 140], [0, 1], easeInOut);
	return (
		<Canvas tone="night">
			<g transform="translate(560 600)">
				<circle r={260} fill="#1f4f7a" stroke="#7fb0d8" strokeWidth={4} />
				{Array.from({length: 6}, (_, i) => (
					<ellipse key={i} cx={0} cy={0} rx={Math.abs(260 * Math.cos(((rot + i * 30) * Math.PI) / 180))} ry={260} fill="none" stroke="#5f8fb8" strokeWidth={2} opacity={0.6} />
				))}
				<path d="M -320 -300 A 440 440 0 0 1 320 -300" stroke={colors.gold} strokeWidth={6} fill="none" markerEnd="" />
				<path d="M 320 -300 l -30 -4 l 18 26 Z" fill={colors.gold} />
			</g>
			<g opacity={fade(frame, 30)}>
				<text x={1000} y={420} {...svgGothic(36, '#efe6d2', 900)}>
					1日のわずかなずれも
				</text>
				<rect x={1000} y={450} width={700} height={40} rx={10} fill="#2a3650" />
				<rect x={1000} y={450} width={30 + 670 * gap} height={40} rx={10} fill="#e9a13b" />
				<text x={1000} y={560} {...svgGothic(36, '#efe6d2', 900)}>
					1700年分つみ重なると
				</text>
				<text x={1000} y={660} {...svgMincho(58, '#ffcf7a')} opacity={fade(frame, 120)}>
					日食の見えた場所がずれる
				</text>
			</g>
		</Canvas>
	);
};
