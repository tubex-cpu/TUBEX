import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, gothicFamily, minchoFamily} from '../theme';

type Props = {
	readonly label: string;
	readonly title: string;
};

// 左上の章ラベル（例：第1の手がかり｜海峡の岩）
export const SceneHeader: React.FC<Props> = ({label, title}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				top: 60,
				left: 80,
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				opacity: interpolate(frame, [10, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				translate: interpolate(frame, [10, 40], ['-40px 0px', '0px 0px'], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.16, 1, 0.3, 1),
				}),
			}}
		>
			<div
				style={{
					fontFamily: gothicFamily,
					fontWeight: 900,
					fontSize: 30,
					color: colors.night,
					background: colors.gold,
					padding: '8px 18px',
					borderRadius: 8,
				}}
			>
				{label}
			</div>
			<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 40, color: colors.text}}>{title}</div>
		</div>
	);
};
