import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {BeatLength} from './Cinema';

type Props = {
	readonly name: string;
	readonly captions: Caption[];
	// このビジュアルを出し始める字幕の番号
	readonly from: number;
	// この字幕の終わりまで表示（省略時はシーンの最後まで）
	readonly to?: number;
	readonly children: React.ReactNode;
};

const FADE = 12;

const BeatFade: React.FC<{readonly duration: number; readonly children: React.ReactNode}> = ({duration, children}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				opacity: interpolate(frame, [0, FADE, duration - FADE, duration], [0, 1, 1, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
				scale: interpolate(frame, [0, FADE * 2], [1.015, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.16, 1, 0.3, 1),
				}),
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

// ナレーションの字幕番号に合わせて、画面中央のビジュアルを切り替える
export const Beat: React.FC<Props> = ({name, captions, from, to, children}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const start = Math.max(0, Math.round((captions[from].startMs / 1000) * fps) - 6);
	const end =
		to === undefined
			? durationInFrames
			: Math.round(((captions[to].endMs + 300) / 1000) * fps);
	const duration = Math.max(1, end - start);

	return (
		<Sequence name={name} from={start} durationInFrames={duration} premountFor={fps}>
			<BeatLength.Provider value={duration}>
				<BeatFade duration={duration}>{children}</BeatFade>
			</BeatLength.Provider>
		</Sequence>
	);
};

// 字幕番号の開始フレーム（Beat内のローカル時間で使う）
export const captionFrame = (captions: Caption[], from: number, index: number, fps: number) =>
	Math.round(((captions[index].startMs - captions[from].startMs) / 1000) * fps) + 6;
