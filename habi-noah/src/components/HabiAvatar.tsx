import type React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export type Expression = 'doubt' | 'think' | 'stern' | 'closed';

type Props = {
	readonly expression: Expression;
	readonly mouthOpen: boolean;
};

// 画面左下で話すハビ判事（口パクは2枚の画像を切り替える）
export const HabiAvatar: React.FC<Props> = ({expression, mouthOpen}) => {
	const frame = useCurrentFrame();
	const size = 300;
	return (
		<div
			style={{
				position: 'absolute',
				left: 10,
				bottom: -10,
				width: size,
				height: size,
				translate: `0px ${interpolate(Math.sin(frame / 20), [-1, 1], [0, -6])}px`,
				filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.6))',
			}}
		>
			{(['0', '1'] as const).map((m) => (
				<Img
					key={m}
					src={staticFile(`habi/${expression}-${m}.png`)}
					style={{position: 'absolute', inset: 0, width: size, height: size, opacity: (m === '1') === mouthOpen ? 1 : 0}}
				/>
			))}
		</div>
	);
};
