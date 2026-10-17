import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CourtImage, type CourtShot} from './CourtImage';
import {VerdictStamp} from './VerdictStamp';

type Props = {
	readonly verdict: 'correct' | 'half' | 'wrong';
	// 判決（ハンコ）を出すフレーム（Beat内のローカル時間）
	readonly strikeAt: number;
};

// 判決シーン：ハビ判事が小槌を打ち下ろし、判決のハンコが押される
export const GavelVerdict: React.FC<Props> = ({verdict, strikeAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const hit = strikeAt - 4;
	const shot: CourtShot =
		frame < strikeAt - 14
			? 'court-listen'
			: frame < strikeAt - 8
				? 'gavel-1'
				: frame < hit
					? 'gavel-2'
					: frame < strikeAt + 4
						? 'gavel-3'
						: frame < strikeAt + 10
							? 'gavel-4'
							: 'court-verdict';
	const shake = frame >= hit && frame < hit + 10 ? Math.sin(frame * 2.7) * interpolate(frame, [hit, hit + 10], [14, 0]) : 0;
	return (
		<AbsoluteFill style={{translate: `${shake}px ${shake * 0.6}px`}}>
			<CourtImage shot={shot} zoom={shot === 'court-listen'} dim={shot === 'court-verdict' ? 0.45 : 0} />
			<AbsoluteFill
				style={{
					background: '#fff',
					opacity: interpolate(frame, [hit, hit + 2, hit + 8], [0, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				}}
			/>
			<Audio src={staticFile('sfx/gavel.mp3')} from={hit} volume={0.8} premountFor={fps} />
			<Audio src={staticFile('sfx/stamp.mp3')} from={strikeAt + 12} volume={0.6} premountFor={fps} />
			<VerdictStamp verdict={verdict} from={strikeAt + 12} premountFor={fps} style={{left: '27%'}} />
		</AbsoluteFill>
	);
};
