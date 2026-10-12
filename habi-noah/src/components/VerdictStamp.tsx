import type React from 'react';
import {Easing, interpolate, Interactive, useCurrentFrame, type InteractivitySchema} from 'remotion';
import {colors, gothicFamily, minchoFamily} from '../theme';

type Verdict = 'correct' | 'half' | 'wrong';

type Props = {
	readonly verdict: Verdict;
	readonly size?: number;
	readonly style?: React.CSSProperties;
};

const verdictInfo: Record<Verdict, {mark: string; label: string; color: string}> = {
	correct: {mark: '○', label: '正しい', color: colors.correct},
	half: {mark: '△', label: '半分正しい', color: colors.half},
	wrong: {mark: '×', label: 'まちがい', color: colors.wrong},
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
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				...style,
			}}
		>
			<div
				style={{
					width: size,
					height: size,
					borderRadius: '50%',
					border: `14px solid ${info.color}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: minchoFamily,
					fontWeight: 800,
					fontSize: size * 0.72,
					lineHeight: 1,
					color: info.color,
					background: 'rgba(244, 236, 220, 0.94)',
					rotate: '-8deg',
					boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
					scale: interpolate(frame, [0, 10, 16], [2.4, 0.92, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.3, 0, 0.2, 1),
					}),
					opacity: interpolate(frame, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				}}
			>
				{info.mark}
			</div>
			<div
				style={{
					marginTop: 30,
					fontFamily: gothicFamily,
					fontWeight: 900,
					fontSize: 72,
					color: info.color,
					textShadow: '0 4px 16px rgba(0,0,0,0.6)',
					opacity: interpolate(frame, [14, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				}}
			>
				判決：{info.label}
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
