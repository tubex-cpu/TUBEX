import type React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

type Props = {
	readonly tint?: string;
};

// 夜の法廷：藍色のグラデーション、柱、ゆっくり瞬く星、ビネット
export const CourtBackground: React.FC<Props> = ({tint = colors.nightLight}) => {
	const frame = useCurrentFrame();
	const stars = [
		[120, 90], [340, 160], [620, 70], [880, 140], [1180, 60], [1420, 150],
		[1660, 80], [1820, 190], [250, 260], [1530, 280], [760, 230], [1040, 210],
	];

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse at 50% 35%, ${tint} 0%, ${colors.night} 70%)`,
			}}
		>
			<svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
				{stars.map(([x, y], i) => (
					<circle
						key={i}
						cx={x}
						cy={y}
						r={2.2}
						fill={colors.goldSoft}
						opacity={interpolate(Math.sin(frame / 25 + i * 1.7), [-1, 1], [0.15, 0.7])}
					/>
				))}
				{[140, 1780].map((x) => (
					<g key={x} opacity={0.35}>
						<rect x={x - 45} y={180} width={90} height={900} fill={colors.nightLight} />
						<rect x={x - 60} y={160} width={120} height={30} fill={colors.nightLight} />
						{[0, 1, 2].map((k) => (
							<rect key={k} x={x - 30 + k * 25} y={200} width={8} height={880} fill={colors.night} opacity={0.5} />
						))}
					</g>
				))}
				<rect x={0} y={1010} width={1920} height={70} fill={colors.wood} opacity={0.55} />
			</svg>
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};
