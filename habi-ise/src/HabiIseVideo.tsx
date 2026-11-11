import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue1Solstice} from './scenes/Clue1Solstice';
import {Clue2Origin} from './scenes/Clue2Origin';
import {Clue3Regalia} from './scenes/Clue3Regalia';
import {Clue4Mirror} from './scenes/Clue4Mirror';
import {Clue5Hebrew} from './scenes/Clue5Hebrew';
import {Clue6Curse} from './scenes/Clue6Curse';
import {Clue7Dannoura} from './scenes/Clue7Dannoura';
import {Clue8Seen} from './scenes/Clue8Seen';
import {Clue9Sengu} from './scenes/Clue9Sengu';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第3の手がかり）、中盤（第4〜第7の手がかり）、後半（第8の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Solstice + d.Clue2Origin + d.Clue3Regalia - 5 * T;
export const lateStart = midStart + d.Clue4Mirror + d.Clue5Hebrew + d.Clue6Curse + d.Clue7Dannoura - 4 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：マチュピチュ判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiIseVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 冬至の朝日が大鳥居の真ん中から昇るように、宇治橋は作られた？" durationInFrames={d.Clue1Solstice} premountFor={fps}>
					<Clue1Solstice />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 伊勢神宮は、最初から伊勢にあった？" durationInFrames={d.Clue2Origin} premountFor={fps}>
					<Clue2Origin />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 三種の神器は、すべて皇居にある？" durationInFrames={d.Clue3Regalia} premountFor={fps}>
					<Clue3Regalia />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 八咫鏡は、天皇でさえ見ることができない？" durationInFrames={d.Clue4Mirror} premountFor={fps}>
					<Clue4Mirror />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 八咫鏡の裏には、ヘブライ文字が刻まれている？" durationInFrames={d.Clue5Hebrew} premountFor={fps}>
					<Clue5Hebrew />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 草薙剣は、祟る？" durationInFrames={d.Clue6Curse} premountFor={fps}>
					<Clue6Curse />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 草薙剣は、壇ノ浦の海に永遠に沈んだ？" durationInFrames={d.Clue7Dannoura} premountFor={fps}>
					<Clue7Dannoura />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 草薙剣を、実際に見た人がいる？" durationInFrames={d.Clue8Seen} premountFor={fps}>
					<Clue8Seen />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 伊勢神宮の遷宮の木は、伊勢の山から伐り出される？" durationInFrames={d.Clue9Sengu} premountFor={fps}>
					<Clue9Sengu />
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
			<Audio name="BGM 前半「冬至の朝」" src={staticFile('bgm/bgm1-kumo.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「見えない鏡」" src={staticFile('bgm/bgm2-hone.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「木曽の森から」" src={staticFile('bgm/bgm3-mori.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
