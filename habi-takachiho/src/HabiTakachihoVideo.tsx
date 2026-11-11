import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Unesco} from './scenes/Clue10Unesco';
import {Clue1Kagura} from './scenes/Clue1Kagura';
import {Clue2History} from './scenes/Clue2History';
import {Clue3Iwato} from './scenes/Clue3Iwato';
import {Clue4Shrine} from './scenes/Clue4Shrine';
import {Clue5Descent} from './scenes/Clue5Descent';
import {Clue6Eclipse} from './scenes/Clue6Eclipse';
import {Clue7Himiko} from './scenes/Clue7Himiko';
import {Clue8Uzume} from './scenes/Clue8Uzume';
import {Clue9Future} from './scenes/Clue9Future';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第3の手がかり）、中盤（第4〜第7の手がかり）、後半（第8の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Kagura + d.Clue2History + d.Clue3Iwato + d.Clue4Shrine - 6 * T;
export const lateStart = midStart + d.Clue5Descent + d.Clue6Eclipse + d.Clue7Himiko + d.Clue8Uzume - 4 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：マチュピチュ判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiTakachihoVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 高千穂の夜神楽は、観光客のためのショー？" durationInFrames={d.Clue1Kagura} premountFor={fps}>
					<Clue1Kagura />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 夜神楽は、神話の時代から続いている？" durationInFrames={d.Clue2History} premountFor={fps}>
					<Clue2History />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 天岩戸は、高千穂にある？" durationInFrames={d.Clue3Iwato} premountFor={fps}>
					<Clue3Iwato />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 天岩戸神社の御神体は、洞窟そのもの？" durationInFrames={d.Clue4Shrine} premountFor={fps}>
					<Clue4Shrine />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 天孫降臨の地は、宮崎の高千穂？" durationInFrames={d.Clue5Descent} premountFor={fps}>
					<Clue5Descent />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 天岩戸の神話は、日食の記憶？" durationInFrames={d.Clue6Eclipse} premountFor={fps}>
					<Clue6Eclipse />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 天照大神の正体は、卑弥呼だと証明された？" durationInFrames={d.Clue7Himiko} premountFor={fps}>
					<Clue7Himiko />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 天宇受売命の舞は、神楽の始まり？" durationInFrames={d.Clue8Uzume} premountFor={fps}>
					<Clue8Uzume />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 高千穂の夜神楽は、消えかけている？" durationInFrames={d.Clue9Future} premountFor={fps}>
					<Clue9Future />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり 神楽は、もう世界遺産になった？" durationInFrames={d.Clue10Unesco} premountFor={fps}>
					<Clue10Unesco />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="本当の物語" durationInFrames={d.RootsStory} premountFor={fps}>
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
			<Audio name="BGM 前半「夜の神楽宿」" src={staticFile('bgm/bgm1-kumo.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「隠れた太陽」" src={staticFile('bgm/bgm2-hone.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「夜明けの舞」" src={staticFile('bgm/bgm3-mori.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
