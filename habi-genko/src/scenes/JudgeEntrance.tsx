import type React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Beat} from '../components/Beat';
import {CourtImage} from '../components/CourtImage';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {judgeEntranceCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const clues = ['世界最大？', '15年以上？', '最先端の堺？', '埴輪は身代わり？', '家来の墓？', '仁徳天皇？', '生前に造った？', '皇帝の家来？', '名前の由来？', '中を見た人？', 'ボストンの宝？', '明治の宝？', '入れない？', '消えた古墳？', '世界遺産？', '今の姿？'];

// 今夜の16の手がかり（2段に並べる）
const ClueRow = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 80, right: 80, top: 170, display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center'}}>
			{clues.map((cl, i) => (
				<div
					key={cl}
					style={{
						width: 200,
						padding: '14px 0',
						borderRadius: 16,
						background: colors.paper,
						textAlign: 'center',
						opacity: interpolate(frame, [i * 4, i * 4 + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 24, color: colors.clayDark}}>手がかり {i + 1}</div>
					<div style={{margin: '8px 10px 4px', fontFamily: minchoFamily, fontWeight: 800, fontSize: 72, lineHeight: 1, color: colors.clay}}>？</div>
					<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 22, whiteSpace: 'nowrap', color: colors.ink}}>{cl}</div>
				</div>
			))}
		</div>
	);
};

// 法廷の重い木の扉（左右に開く）
const DoorLeaf: React.FC<{readonly side: 'left' | 'right'; readonly open: number}> = ({side, open}) => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			bottom: 0,
			width: '50%',
			[side]: 0,
			transformOrigin: side === 'left' ? 'left center' : 'right center',
			transform: `perspective(2400px) rotateY(${(side === 'left' ? -1 : 1) * open * 100}deg)`,
			background: 'linear-gradient(90deg, #3b2214 0%, #5a3520 45%, #4a2b18 100%)',
			boxShadow: 'inset 0 0 120px rgba(0,0,0,0.7)',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			gap: 60,
			padding: '0 90px',
		}}
	>
		{[0, 1].map((i) => (
			<div key={i} style={{height: 380, borderRadius: 10, border: '10px solid #2a170c', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6), 0 0 0 4px #6e4428', background: 'linear-gradient(180deg, #5f3a22, #452815)'}} />
		))}
		<div
			style={{
				position: 'absolute',
				top: 500,
				[side === 'left' ? 'right' : 'left']: 40,
				width: 26,
				height: 140,
				borderRadius: 13,
				background: 'linear-gradient(90deg, #8a6a2a, #e2bb63, #8a6a2a)',
			}}
		/>
	</div>
);

const DoorReveal: React.FC = () => {
	const frame = useCurrentFrame();
	const open = interpolate(frame, [8, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.2, 1)});
	return (
		<AbsoluteFill>
			<CourtImage shot="court-bow" />
			<AbsoluteFill style={{background: `rgba(0,0,0,${0.75 * (1 - open)})`}} />
			{open < 1 ? (
				<AbsoluteFill style={{opacity: interpolate(open, [0.85, 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
					<DoorLeaf side="left" open={open} />
					<DoorLeaf side="right" open={open} />
				</AbsoluteFill>
			) : null}
			<Audio src={staticFile('sfx/door.mp3')} from={4} volume={0.7} />
		</AbsoluteFill>
	);
};

const NamePlate: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				left: 90,
				top: 80,
				opacity: interpolate(frame, [10, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				translate: interpolate(frame, [10, 28], ['-30px 0px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				padding: '14px 36px',
				borderRadius: 12,
				background: 'rgba(5, 9, 18, 0.85)',
				borderLeft: `8px solid ${colors.gold}`,
			}}
		>
			<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 30, color: colors.gold}}>閉園後の法廷</div>
			<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 64, color: colors.text, lineHeight: 1.1}}>ハビ判事</div>
		</div>
	);
};

// ハビ判事登場：扉が開くと、夜の法廷の判事席にハビ判事
export const JudgeEntrance = () => (
	<SceneFrame captions={c} voice="JudgeEntrance">
		<Beat name="扉が開く" captions={c} from={0} to={0}>
			<DoorReveal />
		</Beat>
		<Beat name="証拠だけ" captions={c} from={1} to={1}>
			<CourtImage shot="court-think" />
			<NamePlate />
		</Beat>
		<Beat name="今夜の問い" captions={c} from={2} to={3}>
			<Photo id="daisen-z1" label="眠るのは、本当に仁徳天皇？" />
		</Beat>
		<Beat name="5つの手がかり" captions={c} from={4}>
			<ClueRow />
		</Beat>
	</SceneFrame>
);
