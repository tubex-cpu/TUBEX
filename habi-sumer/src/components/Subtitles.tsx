import type {Caption} from '@remotion/captions';
import type React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, gothicFamily} from '../theme';

type Props = {
	readonly captions: Caption[];
};

// ナレーション字幕（画面下部のテロップ）
export const Subtitles: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ms = (frame / fps) * 1000;
	const current = captions.find((c) => ms >= c.startMs && ms < c.endMs + 300);
	if (!current) {
		return null;
	}

	const local = frame - (current.startMs / 1000) * fps;
	const size = current.text.length > 70 ? 40 : current.text.length > 34 ? 46 : 52;

	return (
		<div
			style={{
				position: 'absolute',
				left: 320,
				right: 120,
				bottom: 50,
				display: 'flex',
				justifyContent: 'center',
				opacity: interpolate(local, [0, 6], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
				translate: interpolate(local, [0, 8], ['0px 12px', '0px 0px'], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
			}}
		>
			<div
				lang="ja"
				style={{
					fontFamily: gothicFamily,
					fontWeight: 700,
					fontSize: size,
					lineHeight: 1.45,
					color: colors.text,
					textAlign: 'center',
					padding: '18px 40px',
					borderRadius: 14,
					background: 'rgba(5, 9, 18, 0.72)',
					borderTop: `3px solid ${colors.gold}`,
					textShadow: '0 2px 6px rgba(0,0,0,0.6)',
					maxWidth: 1600,
					wordBreak: 'auto-phrase',
				}}
			>
				{current.text}
			</div>
		</div>
	);
};
