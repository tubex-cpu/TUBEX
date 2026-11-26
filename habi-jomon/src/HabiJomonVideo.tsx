import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Denpun} from './scenes/Clue10Denpun';
import {Clue11Samusa} from './scenes/Clue11Samusa';
import {Clue12Funka} from './scenes/Clue12Funka';
import {Clue13Senso} from './scenes/Clue13Senso';
import {Clue14Heiwa} from './scenes/Clue14Heiwa';
import {Clue15Koeki} from './scenes/Clue15Koeki';
import {Clue16Yayoi} from './scenes/Clue16Yayoi';
import {Clue17Dogu} from './scenes/Clue17Dogu';
import {Clue18Kowasu} from './scenes/Clue18Kowasu';
import {Clue19Basshi} from './scenes/Clue19Basshi';
import {Clue1Nagasa} from './scenes/Clue1Nagasa';
import {Clue20Kanjo} from './scenes/Clue20Kanjo';
import {Clue21Jinko} from './scenes/Clue21Jinko';
import {Clue22Kanrei} from './scenes/Clue22Kanrei';
import {Clue23Horobi} from './scenes/Clue23Horobi';
import {Clue24Shometsu} from './scenes/Clue24Shometsu';
import {Clue2Doki} from './scenes/Clue2Doki';
import {Clue3Kawari} from './scenes/Clue3Kawari';
import {Clue4Bunmei} from './scenes/Clue4Bunmei';
import {Clue5Kari} from './scenes/Clue5Kari';
import {Clue6Teiju} from './scenes/Clue6Teiju';
import {Clue7Kuri} from './scenes/Clue7Kuri';
import {Clue8Chozo} from './scenes/Clue8Chozo';
import {Clue9Urushi} from './scenes/Clue9Urushi';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第3の手がかり）、中盤（第4〜第7の手がかり）、後半（第8の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Nagasa + d.Clue2Doki + d.Clue3Kawari + d.Clue4Bunmei + d.Clue5Kari + d.Clue6Teiju + d.Clue7Kuri + d.Clue8Chozo - 10 * T;
export const lateStart = midStart + d.Clue9Urushi + d.Clue10Denpun + d.Clue11Samusa + d.Clue12Funka + d.Clue13Senso + d.Clue14Heiwa + d.Clue15Koeki + d.Clue16Yayoi + d.Clue17Dogu + d.Clue18Kowasu + d.Clue19Basshi + d.Clue20Kanjo - 12 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：縄文1万年判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiJomonVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 縄文時代は、1万年以上続いた？" durationInFrames={d.Clue1Nagasa} premountFor={fps}>
					<Clue1Nagasa />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 縄文土器は、世界最古の土器？" durationInFrames={d.Clue2Doki} premountFor={fps}>
					<Clue2Doki />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 縄文の暮らしは、1万年間ほとんど変わらなかった？" durationInFrames={d.Clue3Kawari} premountFor={fps}>
					<Clue3Kawari />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 縄文時代は、文明と呼べる？" durationInFrames={d.Clue4Bunmei} premountFor={fps}>
					<Clue4Bunmei />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 縄文人は、狩りで暮らしていた？" durationInFrames={d.Clue5Kari} premountFor={fps}>
					<Clue5Kari />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 縄文人は、移動しながら暮らしていた？" durationInFrames={d.Clue6Teiju} premountFor={fps}>
					<Clue6Teiju />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 縄文人は、クリの森を育てていた？" durationInFrames={d.Clue7Kuri} premountFor={fps}>
					<Clue7Kuri />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 縄文人は、冬のために木の実を貯めていた？" durationInFrames={d.Clue8Chozo} premountFor={fps}>
					<Clue8Chozo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 縄文人は、漆を使いこなしていた？" durationInFrames={d.Clue9Urushi} premountFor={fps}>
					<Clue9Urushi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり 縄文人の体は、でんぷんを食べこなせた？" durationInFrames={d.Clue10Denpun} premountFor={fps}>
					<Clue10Denpun />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第11の手がかり 縄文人は、寒さに強い体だった？" durationInFrames={d.Clue11Samusa} premountFor={fps}>
					<Clue11Samusa />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第12の手がかり 縄文人は、大災害でも滅びなかった？" durationInFrames={d.Clue12Funka} premountFor={fps}>
					<Clue12Funka />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第13の手がかり 縄文時代には、戦争がなかった？" durationInFrames={d.Clue13Senso} premountFor={fps}>
					<Clue13Senso />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第14の手がかり 縄文人は、平和主義だった？" durationInFrames={d.Clue14Heiwa} premountFor={fps}>
					<Clue14Heiwa />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第15の手がかり 縄文人は、遠くの村と品物をやりとりしていた？" durationInFrames={d.Clue15Koeki} premountFor={fps}>
					<Clue15Koeki />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第16の手がかり 争いが増えたのは、弥生時代から？" durationInFrames={d.Clue16Yayoi} premountFor={fps}>
					<Clue16Yayoi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第17の手がかり 土偶は、宇宙人をかたどった？" durationInFrames={d.Clue17Dogu} premountFor={fps}>
					<Clue17Dogu />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第18の手がかり 土偶は、わざと壊された？" durationInFrames={d.Clue18Kowasu} premountFor={fps}>
					<Clue18Kowasu />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第19の手がかり 縄文人は、大人になると歯を抜いた？" durationInFrames={d.Clue19Basshi} premountFor={fps}>
					<Clue19Basshi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第20の手がかり 縄文のストーンサークルは、太陽の暦だった？" durationInFrames={d.Clue20Kanjo} premountFor={fps}>
					<Clue20Kanjo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第21の手がかり 縄文の終わりごろ、人の数は激減した？" durationInFrames={d.Clue21Jinko} premountFor={fps}>
					<Clue21Jinko />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第22の手がかり 縄文の暮らしを終わらせたのは、寒さ？" durationInFrames={d.Clue22Kanrei} premountFor={fps}>
					<Clue22Kanrei />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第23の手がかり 縄文人は、弥生人に滅ぼされた？" durationInFrames={d.Clue23Horobi} premountFor={fps}>
					<Clue23Horobi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第24の手がかり 縄文人は、消滅した？" durationInFrames={d.Clue24Shometsu} premountFor={fps}>
					<Clue24Shometsu />
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
			<Audio name="BGM 前半「森の村」" src={staticFile('bgm/bgm1-mori.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「祈り」" src={staticFile('bgm/bgm2-inori.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「海を渡る」" src={staticFile('bgm/bgm3-umi.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
