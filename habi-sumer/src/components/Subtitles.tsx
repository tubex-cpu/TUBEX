import type {Caption} from '@remotion/captions';
import type React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, gothicFamily} from '../theme';

type Props = {
	readonly captions: Caption[];
};

// ナレーション字幕（画面下部・常に1行。長い文は scripts/build-voice.py で分割済み）
export const Subtitles: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ms = (frame / fps) * 1000;
	const current = captions.filter((c) => ms >= c.startMs && ms < c.endMs + 300).pop();
	if (!current) {
		return null;
	}

	const local = frame - (current.startMs / 1000) * fps;
	const size = Math.min(54, Math.floor(1380 / current.text.length));

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
					lineHeight: 1.3,
					whiteSpace: 'nowrap',
					color: colors.text,
					textAlign: 'center',
					padding: '18px 40px',
					borderRadius: 14,
					background: 'rgba(5, 9, 18, 0.72)',
					borderTop: `3px solid ${colors.gold}`,
					textShadow: '0 2px 6px rgba(0,0,0,0.6)',
				}}
			>
				{current.text}
			</div>
		</div>
	);
};
