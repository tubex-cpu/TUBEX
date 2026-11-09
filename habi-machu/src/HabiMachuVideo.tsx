import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Lidar} from './scenes/Clue10Lidar';
import {Clue1Bingham} from './scenes/Clue1Bingham';
import {Clue2Name} from './scenes/Clue2Name';
import {Clue3Fortress} from './scenes/Clue3Fortress';
import {Clue4Date} from './scenes/Clue4Date';
import {Clue5Virgins} from './scenes/Clue5Virgins';
import {Clue6People} from './scenes/Clue6People';
import {Clue7Spain} from './scenes/Clue7Spain';
import {Clue8Stone} from './scenes/Clue8Stone';
import {Clue9Japan} from './scenes/Clue9Japan';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第3の手がかり）、中盤（第4〜第7の手がかり）、後半（第8の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Bingham + d.Clue2Name + d.Clue3Fortress + d.Clue4Date - 6 * T;
export const lateStart = midStart + d.Clue5Virgins + d.Clue6People + d.Clue7Spain + d.Clue8Stone - 4 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：マチュピチュ判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiMachuVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり マチュピチュを発見したのは、ビンガム？" durationInFrames={d.Clue1Bingham} premountFor={fps}>
					<Clue1Bingham />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり マチュピチュは、インカ時代からの名前？" durationInFrames={d.Clue2Name} premountFor={fps}>
					<Clue2Name />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり マチュピチュは、インカ最後の要塞だった？" durationInFrames={d.Clue3Fortress} premountFor={fps}>
					<Clue3Fortress />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり マチュピチュが建てられたのは、パチャクテクが王になったあと？" durationInFrames={d.Clue4Date} premountFor={fps}>
					<Clue4Date />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり マチュピチュは、太陽に仕える女性たちの都市だった？" durationInFrames={d.Clue5Virgins} premountFor={fps}>
					<Clue5Virgins />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり マチュピチュの住人は、地元の人々だった？" durationInFrames={d.Clue6People} premountFor={fps}>
					<Clue6People />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり マチュピチュは、スペイン人に知られていなかった？" durationInFrames={d.Clue7Spain} premountFor={fps}>
					<Clue7Spain />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり マチュピチュが崩れないのは、石組みの技のおかげ？" durationInFrames={d.Clue8Stone} premountFor={fps}>
					<Clue8Stone />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり マチュピチュと日本は、何のつながりもない？" durationInFrames={d.Clue9Japan} premountFor={fps}>
					<Clue9Japan />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり マチュピチュの全体像は、もう分かっている？" durationInFrames={d.Clue10Lidar} premountFor={fps}>
					<Clue10Lidar />
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
			<Audio name="BGM 前半「雲の上の都市」" src={staticFile('bgm/bgm1-kumo.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「骨が語る」" src={staticFile('bgm/bgm2-hone.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「密林の下」" src={staticFile('bgm/bgm3-mori.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
