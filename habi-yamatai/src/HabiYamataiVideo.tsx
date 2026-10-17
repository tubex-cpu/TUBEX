import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Clue1Himiko} from './scenes/Clue1Himiko';
import {Clue2Route} from './scenes/Clue2Route';
import {Clue3GoldSeal} from './scenes/Clue3GoldSeal';
import {Clue4Yoshinogari} from './scenes/Clue4Yoshinogari';
import {Clue5Hashihaka} from './scenes/Clue5Hashihaka';
import {Closing} from './scenes/Closing';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.11;

// BGMの区間：前半（冒頭〜第2の手がかり）、中盤（第3〜第5の手がかり）、後半（本当の物語〜締め）
const midStart = d.Intro + d.JudgeEntrance + d.Clue1Himiko + d.Clue2Route - 4 * T;
const lateStart = midStart + d.Clue3GoldSeal + d.Clue4Yoshinogari + d.Clue5Hashihaka - 3 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：邪馬台国判決（本編）
// シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiYamataiVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 卑弥呼は実在したか" durationInFrames={d.Clue1Himiko} premountFor={fps}>
					<Clue1Himiko />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 魏志倭人伝の道のり" durationInFrames={d.Clue2Route} premountFor={fps}>
					<Clue2Route />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 志賀島の金印" durationInFrames={d.Clue3GoldSeal} premountFor={fps}>
					<Clue3GoldSeal />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 吉野ヶ里の謎のエリア" durationInFrames={d.Clue4Yoshinogari} premountFor={fps}>
					<Clue4Yoshinogari />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 箸墓古墳" durationInFrames={d.Clue5Hashihaka} premountFor={fps}>
					<Clue5Hashihaka />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="1300年前から続く謎解き" durationInFrames={d.RootsStory} premountFor={fps}>
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
				name="BGM 前半「女王の国」"
				src={staticFile('bgm/bgm1-queen.mp3')}
				durationInFrames={midStart + fps}
				volume={fadeVolume(midStart + fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 中盤「道のり」"
				src={staticFile('bgm/bgm2-route.mp3')}
				from={midStart - fps}
				durationInFrames={lateStart - midStart + 2 * fps}
				volume={fadeVolume(lateStart - midStart + 2 * fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 後半「争いを終わらせた女王」"
				src={staticFile('bgm/bgm3-peace.mp3')}
				from={lateStart - fps}
				durationInFrames={durationInFrames - lateStart + fps}
				volume={fadeVolume(durationInFrames - lateStart + fps, fps)}
				premountFor={fps}
			/>
		</>
	);
};
