import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Mark} from './scenes/Clue10Mark';
import {Clue11Burial} from './scenes/Clue11Burial';
import {Clue12King} from './scenes/Clue12King';
import {Clue13Crossroads} from './scenes/Clue13Crossroads';
import {Clue14Iron} from './scenes/Clue14Iron';
import {Clue15Yuzuri} from './scenes/Clue15Yuzuri';
import {Clue16Shrine} from './scenes/Clue16Shrine';
import {Clue17Collapse} from './scenes/Clue17Collapse';
import {Clue18Kokuso} from './scenes/Clue18Kokuso';
import {Clue19Kamiari} from './scenes/Clue19Kamiari';
import {Clue1Kannazuki} from './scenes/Clue1Kannazuki';
import {Clue2Okugi} from './scenes/Clue2Okugi';
import {Clue3Kojiki} from './scenes/Clue3Kojiki';
import {Clue4Kunibiki} from './scenes/Clue4Kunibiki';
import {Clue5Orochi} from './scenes/Clue5Orochi';
import {Clue6Kojindani} from './scenes/Clue6Kojindani';
import {Clue7Swords} from './scenes/Clue7Swords';
import {Clue8Bells} from './scenes/Clue8Bells';
import {Clue9Kamo} from './scenes/Clue9Kamo';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第5の手がかり）、中盤（第6〜第14の手がかり）、後半（第15の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Kannazuki + d.Clue2Okugi + d.Clue3Kojiki + d.Clue4Kunibiki + d.Clue5Orochi - 7 * T;
export const lateStart = midStart + d.Clue6Kojindani + d.Clue7Swords + d.Clue8Bells + d.Clue9Kamo + d.Clue10Mark + d.Clue11Burial + d.Clue12King + d.Clue13Crossroads + d.Clue14Iron - 9 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：出雲判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiIzumoVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 神無月は、神様がいない月？" durationInFrames={d.Clue1Kannazuki} premountFor={fps}>
					<Clue1Kannazuki />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 神々が出雲に集まる話は、古事記に書いてある？" durationInFrames={d.Clue2Okugi} premountFor={fps}>
					<Clue2Okugi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 古事記の神話の3分の1は、出雲の話？" durationInFrames={d.Clue3Kojiki} premountFor={fps}>
					<Clue3Kojiki />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 出雲の国は、神が引き寄せて作った？" durationInFrames={d.Clue4Kunibiki} premountFor={fps}>
					<Clue4Kunibiki />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり ヤマタノオロチは、暴れ川だった？" durationInFrames={d.Clue5Orochi} premountFor={fps}>
					<Clue5Orochi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 出雲に、大きな力を持つ国はなかった？" durationInFrames={d.Clue6Kojindani} premountFor={fps}>
					<Clue6Kojindani />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 358本の銅剣は、戦いの武器だった？" durationInFrames={d.Clue7Swords} premountFor={fps}>
					<Clue7Swords />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 銅剣の国と、銅鐸の国は、別々だった？" durationInFrames={d.Clue8Bells} premountFor={fps}>
					<Clue8Bells />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 加茂岩倉の銅鐸は、すべて出雲で作られた？" durationInFrames={d.Clue9Kamo} premountFor={fps}>
					<Clue9Kamo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり 荒神谷と加茂岩倉は、関係がない？" durationInFrames={d.Clue10Mark} premountFor={fps}>
					<Clue10Mark />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第11の手がかり 青銅器は、敵から隠すために埋められた？" durationInFrames={d.Clue11Burial} premountFor={fps}>
					<Clue11Burial />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第12の手がかり 出雲には、王がいた？" durationInFrames={d.Clue12King} premountFor={fps}>
					<Clue12King />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第13の手がかり 出雲は、閉ざされた国だった？" durationInFrames={d.Clue13Crossroads} premountFor={fps}>
					<Clue13Crossroads />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第14の手がかり 出雲の力は、鉄から生まれた？" durationInFrames={d.Clue14Iron} premountFor={fps}>
					<Clue14Iron />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第15の手がかり 出雲は、ヤマトに国を譲った？" durationInFrames={d.Clue15Yuzuri} premountFor={fps}>
					<Clue15Yuzuri />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第16の手がかり 出雲大社は、高さ48メートルの神殿だった？" durationInFrames={d.Clue16Shrine} premountFor={fps}>
					<Clue16Shrine />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第17の手がかり 巨大な神殿は、何度も倒れた？" durationInFrames={d.Clue17Collapse} premountFor={fps}>
					<Clue17Collapse />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第18の手がかり 出雲大社を守る家は、神話の神の子孫？" durationInFrames={d.Clue18Kokuso} premountFor={fps}>
					<Clue18Kokuso />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第19の手がかり 神在月、神々は縁結びの会議を開く？" durationInFrames={d.Clue19Kamiari} premountFor={fps}>
					<Clue19Kamiari />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="神々が出雲に集まる本当の理由" durationInFrames={d.RootsStory} premountFor={fps}>
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
			<Audio name="BGM 前半「神々の国」" src={staticFile('bgm/bgm1-kami.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「土の中の青銅器」" src={staticFile('bgm/bgm2-seidou.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「天にとどく宮」" src={staticFile('bgm/bgm3-taisha.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
