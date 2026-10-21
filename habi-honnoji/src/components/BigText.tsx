import type React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, minchoFamily} from '../theme';

type Props = {
	readonly children: React.ReactNode;
	readonly size?: number;
	readonly color?: string;
	readonly sub?: string;
	readonly top?: string;
};

// 画面中央の大きな見出し文字
export const BigText: React.FC<Props> = ({children, size = 130, color = colors.text, sub, top = '40%'}) => {
	const frame = useCurrentFrame();
	return (
		<div
			lang="ja"
			style={{
				position: 'absolute',
				left: 120,
				right: 120,
				top,
				translate: '0px -50%',
				textAlign: 'center',
				fontFamily: minchoFamily,
				fontWeight: 800,
				color,
				letterSpacing: interpolate(frame, [0, 60], [12, 4], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.16, 1, 0.3, 1),
				}),
				textShadow: '0 6px 30px rgba(0,0,0,0.6)',
				wordBreak: 'auto-phrase',
			}}
		>
			<div style={{fontSize: size, lineHeight: 1.25}}>{children}</div>
			{sub ? (
				<div
					style={{
						marginTop: 28,
						fontSize: size * 0.36,
						color: colors.muted,
						opacity: interpolate(frame, [15, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					{sub}
				</div>
			) : null}
		</div>
	);
};
