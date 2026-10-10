import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {useVideoConfig} from 'remotion';
import {Clue1Rock} from './scenes/Clue1Rock';
import {Clue2Words} from './scenes/Clue2Words';
import {Clue3Chrysanthemum} from './scenes/Clue3Chrysanthemum';
import {Clue4AI} from './scenes/Clue4AI';
import {Clue5DNA} from './scenes/Clue5DNA';
import {Closing} from './scenes/Closing';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// ハビ判事：日本人とシュメール判決（本編）
// 各シーンの長さは scripts/build-captions.py の出力（300字/分換算）に合わせている
export const HabiSumerVideo = () => {
	const {fps} = useVideoConfig();
	return (
		<TransitionSeries>
			<TransitionSeries.Sequence name="0:00 謎の先出し" durationInFrames={1944} premountFor={fps}>
				<Intro />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="1:07 ハビ判事登場" durationInFrames={891} premountFor={fps}>
				<JudgeEntrance />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="1:49 第1の手がかり 海峡の岩" durationInFrames={5946} premountFor={fps}>
				<Clue1Rock />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="5:22 第2の手がかり 100年前の言葉" durationInFrames={6672} premountFor={fps}>
				<Clue2Words />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="9:22 第3の手がかり 菊の紋" durationInFrames={5103} premountFor={fps}>
				<Clue3Chrysanthemum />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="12:23 第4の手がかり 最新AI" durationInFrames={7266} premountFor={fps}>
				<Clue4AI />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="16:38 第5の手がかり 神の遺伝子" durationInFrames={7185} premountFor={fps}>
				<Clue5DNA />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="20:51 足元にあった物語" durationInFrames={3816} premountFor={fps}>
				<RootsStory />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="23:03 まだ解けていない謎" durationInFrames={2250} premountFor={fps}>
				<UnsolvedMystery />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="24:20 まとめ" durationInFrames={2640} premountFor={fps}>
				<Summary />
			</TransitionSeries.Sequence>
			<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
			<TransitionSeries.Sequence name="25:51 締め" durationInFrames={1341} premountFor={fps}>
				<Closing />
			</TransitionSeries.Sequence>
		</TransitionSeries>
	);
};
