import type React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

type Props = {
	readonly size?: number;
	readonly style?: React.CSSProperties;
	readonly gavel?: boolean;
};

// ハビ判事：法服を着たハシビロコウ。まばたきと、ゆっくりした呼吸だけ動く
export const Habi: React.FC<Props> = ({size = 420, style, gavel = false}) => {
	const frame = useCurrentFrame();
	const blinkPhase = frame % 130;
	const eyeOpen = blinkPhase > 122 ? 0.1 : 1;
	const breathe = interpolate(Math.sin(frame / 22), [-1, 1], [0, 6]);
	const gavelRot = gavel
		? interpolate(frame % 90, [0, 8, 14, 90], [0, -38, 0, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

	return (
		<svg width={size} height={size * 1.25} viewBox="0 0 400 500" style={style}>
			{/* 法服 */}
			<path
				d={`M70 500 C 70 330 120 ${270 - breathe} 200 ${270 - breathe} C 280 ${270 - breathe} 330 330 330 500 Z`}
				fill="#14141c"
			/>
			<path d={`M170 ${280 - breathe} L200 360 L230 ${280 - breathe} Z`} fill={colors.paper} />
			<rect x={192} y={300} width={16} height={40} fill={colors.gold} opacity={0.9} />
			{/* 首 */}
			<path d="M165 290 C 160 230 175 205 200 200 C 225 205 240 230 235 290 Z" fill="#7d8a96" />
			{/* 頭 */}
			<ellipse cx={200} cy={150} rx={88} ry={80} fill="#8e9ba7" />
			<path d="M140 95 C 150 60 175 58 185 72 C 175 70 160 80 150 100 Z" fill="#6e7a86" />
			<path d="M200 76 C 215 52 238 56 240 70 C 228 66 215 74 208 86 Z" fill="#6e7a86" />
			{/* 大きなくちばし（靴のような形） */}
			<path
				d="M150 160 C 110 165 60 185 40 215 C 30 232 45 248 75 245 C 120 240 175 225 205 195 Z"
				fill="#c9b27a"
			/>
			<path d="M60 236 C 95 232 150 220 200 196" stroke="#8c7442" strokeWidth={4} fill="none" />
			<path d="M40 215 C 34 226 38 236 50 240 L 45 222 Z" fill="#8c7442" />
			{/* 目：鋭い黄色の目 */}
			<g transform={`translate(214 134) scale(1 ${eyeOpen})`}>
				<circle r={17} fill="#f4e27a" />
				<circle r={7} fill="#111" />
				<circle cx={-3} cy={-3} r={2.5} fill="#fff" />
			</g>
			<path d="M192 116 L236 124" stroke="#4d5763" strokeWidth={6} strokeLinecap="round" />
			{/* 判事の小槌 */}
			{gavel ? (
				<g transform={`translate(320 360) rotate(${gavelRot})`}>
					<rect x={-6} y={-90} width={12} height={90} rx={4} fill={colors.woodLight} />
					<rect x={-34} y={-118} width={68} height={34} rx={8} fill={colors.wood} />
				</g>
			) : null}
		</svg>
	);
};
