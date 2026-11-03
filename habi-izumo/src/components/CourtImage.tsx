import type React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export type CourtShot = 'court-listen' | 'court-think' | 'court-verdict' | 'court-bow' | 'gavel-1' | 'gavel-2' | 'gavel-3' | 'gavel-4';

type Props = {
	readonly shot: CourtShot;
	readonly dim?: number;
	readonly zoom?: boolean;
	readonly style?: React.CSSProperties;
};

// 法廷のハビ判事（一枚絵）：ゆっくり寄るカメラと、ろうそくの揺らぎ
export const CourtImage: React.FC<Props> = ({shot, dim = 0, zoom = true, style}) => {
	const frame = useCurrentFrame();
	const flicker = interpolate(Math.sin(frame / 3.1) + Math.sin(frame / 7.3), [-2, 2], [0.02, 0.08]);
	return (
		<AbsoluteFill style={{overflow: 'hidden', ...style}}>
			<Img
				src={staticFile(`habi/${shot}.jpg`)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					scale: zoom ? String(interpolate(frame, [0, 600], [1.02, 1.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})) : '1',
				}}
			/>
			<AbsoluteFill style={{background: `rgba(255, 160, 70, ${flicker})`, mixBlendMode: 'screen'}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)'}} />
			{dim ? <AbsoluteFill style={{background: `rgba(0,0,0,${dim})`}} /> : null}
		</AbsoluteFill>
	);
};

// 一枚絵のハビ判事＋左側の文字パネル
export const CourtWithText: React.FC<{readonly shot: CourtShot; readonly children: React.ReactNode}> = ({shot, children}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<CourtImage shot={shot} />
			<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,8,16,0.88) 0%, rgba(5,8,16,0.6) 38%, rgba(5,8,16,0) 60%)'}} />
			<div
				style={{
					position: 'absolute',
					left: 110,
					top: 190,
					width: 820,
					opacity: interpolate(frame, [6, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					translate: interpolate(frame, [6, 26], ['-30px 0px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};
