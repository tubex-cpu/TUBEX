import type React from 'react';
import {Easing, interpolate, Interactive, useCurrentFrame, type InteractivitySchema} from 'remotion';
import {colors, gothicFamily, minchoFamily} from '../theme';

type Verdict = 'correct' | 'half' | 'wrong';

type Props = {
	readonly verdict: Verdict;
	readonly size?: number;
	readonly style?: React.CSSProperties;
};

const verdictInfo: Record<Verdict, {label: string; color: string}> = {
	correct: {label: '正しい', color: colors.correct},
	half: {label: '半分正しい', color: '#d98a12'},
	wrong: {label: 'まちがい', color: colors.wrong},
};

// 判決のハンコ：上から叩きつけるように押される
const VerdictStampInner: React.FC<Props> = ({verdict, size = 380, style}) => {
	const frame = useCurrentFrame();
	const info = verdictInfo[verdict];

	return (
		<Interactive.Div
			style={{
				position: 'absolute',
				left: '50%',
				top: '46%',
				translate: '-50% -50%',
				...style,
			}}
		>
			<div
				style={{
					padding: `${size * 0.08}px ${size * 0.18}px`,
					border: `${size * 0.035}px solid ${info.color}`,
					borderRadius: size * 0.05,
					background: 'rgba(244, 236, 220, 0.96)',
					rotate: '-6deg',
					boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
					textAlign: 'center',
					whiteSpace: 'nowrap',
					scale: interpolate(frame, [0, 10, 16], [2.4, 0.92, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.3, 0, 0.2, 1),
					}),
					opacity: interpolate(frame, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				}}
			>
				<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: size * 0.14, color: colors.ink, letterSpacing: 8}}>判決</div>
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: size * 0.3, lineHeight: 1.15, color: info.color}}>{info.label}</div>
			</div>
		</Interactive.Div>
	);
};

const verdictStampSchema = {
	verdict: {
		type: 'enum',
		default: 'half',
		description: '判決',
		variants: {correct: {}, half: {}, wrong: {}},
	},
	size: {type: 'number', default: 380, min: 100, step: 10, description: 'ハンコの大きさ', hiddenFromList: false},
} as const satisfies InteractivitySchema;

export const VerdictStamp = Interactive.withSchema({
	Component: VerdictStampInner,
	componentName: '<VerdictStamp>',
	schema: verdictStampSchema,
	wrapInSequence: true,
});
