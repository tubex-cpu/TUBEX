import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Clue1Size} from './scenes/Clue1Size';
import {Clue2Build} from './scenes/Clue2Build';
import {Clue3Nintoku} from './scenes/Clue3Nintoku';
import {Clue4Inside} from './scenes/Clue4Inside';
import {Clue5Boston} from './scenes/Clue5Boston';
import {Closing} from './scenes/Closing';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.11;

// BGMの区間：前半（冒頭〜第2の手がかり）、中盤（第3〜第5の手がかり）、後半（本当の物語〜締め）
const midStart = d.Intro + d.JudgeEntrance + d.Clue1Size + d.Clue2Build - 4 * T;
const lateStart = midStart + d.Clue3Nintoku + d.Clue4Inside + d.Clue5Boston - 3 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：仁徳天皇陵判決（本編）
// シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiNintokuVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 世界最大の墓だった？" durationInFrames={d.Clue1Size} premountFor={fps}>
					<Clue1Size />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 造るのに15年以上かかった？" durationInFrames={d.Clue2Build} premountFor={fps}>
					<Clue2Build />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 眠っているのは仁徳天皇？" durationInFrames={d.Clue3Nintoku} premountFor={fps}>
					<Clue3Nintoku />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 中を見た人は誰もいない？" durationInFrames={d.Clue4Inside} premountFor={fps}>
					<Clue4Inside />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 宝はアメリカに渡った？" durationInFrames={d.Clue5Boston} premountFor={fps}>
					<Clue5Boston />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="動き出した巨大古墳" durationInFrames={d.RootsStory} premountFor={fps}>
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
				name="BGM 前半「百舌鳥の森」"
				src={staticFile('bgm/bgm1-mozu.mp3')}
				durationInFrames={midStart + fps}
				volume={fadeVolume(midStart + fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 中盤「調査」"
				src={staticFile('bgm/bgm2-survey.mp3')}
				from={midStart - fps}
				durationInFrames={lateStart - midStart + 2 * fps}
				volume={fadeVolume(lateStart - midStart + 2 * fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 後半「浮かび上がる形」"
				src={staticFile('bgm/bgm3-relief.mp3')}
				from={lateStart - fps}
				durationInFrames={durationInFrames - lateStart + fps}
				volume={fadeVolume(durationInFrames - lateStart + fps, fps)}
				premountFor={fps}
			/>
		</>
	);
};
