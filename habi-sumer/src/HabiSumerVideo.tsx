import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
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

const BGM_VOLUME = 0.11;

// BGMの区間：前半（冒頭〜第2の手がかり）、中盤（第3〜第5の手がかり）、後半（足元にあった物語〜締め）
const midStart = d.Intro + d.JudgeEntrance + d.Clue1Rock + d.Clue2Words - 4 * T;
const lateStart = midStart + d.Clue3Chrysanthemum + d.Clue4AI + d.Clue5DNA - 3 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：日本人とシュメール判決（本編）
// シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiSumerVideo = () => {
	const {fps, durationInFrames} = useVideoConfig();
	return (
		<>
			<TransitionSeries>
				<TransitionSeries.Sequence name="0:00 謎の先出し" durationInFrames={d.Intro} premountFor={fps}>
					<Intro />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="ハビ判事登場" durationInFrames={d.JudgeEntrance} premountFor={fps}>
					<JudgeEntrance />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第1の手がかり 海峡の岩" durationInFrames={d.Clue1Rock} premountFor={fps}>
					<Clue1Rock />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 100年前の言葉" durationInFrames={d.Clue2Words} premountFor={fps}>
					<Clue2Words />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 菊の紋" durationInFrames={d.Clue3Chrysanthemum} premountFor={fps}>
					<Clue3Chrysanthemum />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 最新AI" durationInFrames={d.Clue4AI} premountFor={fps}>
					<Clue4AI />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 神の遺伝子" durationInFrames={d.Clue5DNA} premountFor={fps}>
					<Clue5DNA />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="足元にあった物語" durationInFrames={d.RootsStory} premountFor={fps}>
					<RootsStory />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="まだ解けていない謎" durationInFrames={d.UnsolvedMystery} premountFor={fps}>
					<UnsolvedMystery />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="まとめ" durationInFrames={d.Summary} premountFor={fps}>
					<Summary />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="締め" durationInFrames={d.Closing} premountFor={fps}>
					<Closing />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			<Audio
				name="BGM 前半「閉園後の法廷」"
				src={staticFile('bgm/bgm1-night-court.mp3')}
				loop
				loopVolumeCurveBehavior="extend"
				durationInFrames={midStart + fps}
				volume={fadeVolume(midStart + fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 中盤「調査」"
				src={staticFile('bgm/bgm2-investigation.mp3')}
				loop
				loopVolumeCurveBehavior="extend"
				from={midStart - fps}
				durationInFrames={lateStart - midStart + 2 * fps}
				volume={fadeVolume(lateStart - midStart + 2 * fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 後半「足元にあった物語」"
				src={staticFile('bgm/bgm3-roots.mp3')}
				loop
				loopVolumeCurveBehavior="extend"
				from={lateStart - fps}
				durationInFrames={durationInFrames - lateStart + fps}
				volume={fadeVolume(durationInFrames - lateStart + fps, fps)}
				premountFor={fps}
			/>
		</>
	);
};
