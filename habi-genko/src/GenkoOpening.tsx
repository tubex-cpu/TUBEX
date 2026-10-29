import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Clue1Letter} from './scenes/Clue1Letter';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';

// 確認用：冒頭（謎の先出し〜第1の手がかり）
export const OPENING_FRAMES = d.Intro + d.JudgeEntrance + d.Clue1Letter - 2 * T;

export const GenkoOpening = () => {
	const {fps, durationInFrames} = useVideoConfig();
	return (
		<>
			<TransitionSeries>
				<TransitionSeries.Sequence name="謎の先出し" durationInFrames={d.Intro} premountFor={fps}>
					<Intro />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="ハビ判事登場" durationInFrames={d.JudgeEntrance} premountFor={fps}>
					<JudgeEntrance />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第1の手がかり" durationInFrames={d.Clue1Letter} premountFor={fps}>
					<Clue1Letter />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			<Audio
				name="BGM 前半「海の底の謎」"
				src={staticFile('bgm/bgm1-umi.mp3')}
				volume={(f) => 0.12 * interpolate(f, [0, 2 * fps, durationInFrames - 2 * fps, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
			/>
		</>
	);
};
