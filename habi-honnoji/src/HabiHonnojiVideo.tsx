import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Clue1Cry} from './scenes/Clue1Cry';
import {Clue2Grudge} from './scenes/Clue2Grudge';
import {Clue3Hideyoshi} from './scenes/Clue3Hideyoshi';
import {Clue4Shikoku} from './scenes/Clue4Shikoku';
import {Clue5Tenkai} from './scenes/Clue5Tenkai';
import {Closing} from './scenes/Closing';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.11;

// BGMの区間：前半（冒頭〜第2の手がかり）、中盤（第3〜第5の手がかり）、後半（本当の物語〜締め）
const midStart = d.Intro + d.JudgeEntrance + d.Clue1Cry + d.Clue2Grudge - 4 * T;
const lateStart = midStart + d.Clue3Hideyoshi + d.Clue4Shikoku + d.Clue5Tenkai - 3 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：本能寺の変判決（本編）
// シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiHonnojiVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 「敵は本能寺にあり」と叫んだ？" durationInFrames={d.Clue1Cry} premountFor={fps}>
					<Clue1Cry />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 信長への恨みだった？" durationInFrames={d.Clue2Grudge} premountFor={fps}>
					<Clue2Grudge />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 黒幕は秀吉だった？" durationInFrames={d.Clue3Hideyoshi} premountFor={fps}>
					<Clue3Hideyoshi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 四国の問題で追い詰められていた？" durationInFrames={d.Clue4Shikoku} premountFor={fps}>
					<Clue4Shikoku />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 光秀は天海になった？" durationInFrames={d.Clue5Tenkai} premountFor={fps}>
					<Clue5Tenkai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="光秀の幻の城" durationInFrames={d.RootsStory} premountFor={fps}>
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
				name="BGM 前半「夜明け前」"
				src={staticFile('bgm/bgm1-dawn.mp3')}
				durationInFrames={midStart + fps}
				volume={fadeVolume(midStart + fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 中盤「黒幕」"
				src={staticFile('bgm/bgm2-plot.mp3')}
				from={midStart - fps}
				durationInFrames={lateStart - midStart + 2 * fps}
				volume={fadeVolume(lateStart - midStart + 2 * fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 後半「幻の城」"
				src={staticFile('bgm/bgm3-castle.mp3')}
				from={lateStart - fps}
				durationInFrames={durationInFrames - lateStart + fps}
				volume={fadeVolume(durationInFrames - lateStart + fps, fps)}
				premountFor={fps}
			/>
		</>
	);
};
