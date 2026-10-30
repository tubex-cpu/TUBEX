import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Kamikaze} from './scenes/Clue10Kamikaze';
import {Clue11Survivors} from './scenes/Clue11Survivors';
import {Clue12Wrecks} from './scenes/Clue12Wrecks';
import {Clue13Search} from './scenes/Clue13Search';
import {Clue14Ships} from './scenes/Clue14Ships';
import {Clue15Board} from './scenes/Clue15Board';
import {Clue16Arrows} from './scenes/Clue16Arrows';
import {Clue17Games} from './scenes/Clue17Games';
import {Clue18Bakufu} from './scenes/Clue18Bakufu';
import {Clue19Shinkoku} from './scenes/Clue19Shinkoku';
import {Clue1Letter} from './scenes/Clue1Letter';
import {Clue2Islands} from './scenes/Clue2Islands';
import {Clue3Samurai} from './scenes/Clue3Samurai';
import {Clue4Tetsuhau} from './scenes/Clue4Tetsuhau';
import {Clue5Ekotoba} from './scenes/Clue5Ekotoba';
import {Clue6Storm} from './scenes/Clue6Storm';
import {Clue7Envoys} from './scenes/Clue7Envoys';
import {Clue8Wall} from './scenes/Clue8Wall';
import {Clue9Fleet} from './scenes/Clue9Fleet';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第6の手がかり）、中盤（第7〜第13の手がかり）、後半（第14の手がかり〜締め）
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Letter + d.Clue2Islands + d.Clue3Samurai + d.Clue4Tetsuhau + d.Clue5Ekotoba + d.Clue6Storm - 8 * T;
export const lateStart = midStart + d.Clue7Envoys + d.Clue8Wall + d.Clue9Fleet + d.Clue10Kamikaze + d.Clue11Survivors + d.Clue12Wrecks + d.Clue13Search - 7 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：元寇判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiGenkoVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 元は、いきなり攻めてきた？" durationInFrames={d.Clue1Letter} premountFor={fps}>
					<Clue1Letter />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 最初に襲われたのは博多だった？" durationInFrames={d.Clue2Islands} premountFor={fps}>
					<Clue2Islands />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 鎌倉武士は一騎打ちで負けた？" durationInFrames={d.Clue3Samurai} premountFor={fps}>
					<Clue3Samurai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり てつはうは音だけのこけおどし？" durationInFrames={d.Clue4Tetsuhau} premountFor={fps}>
					<Clue4Tetsuhau />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 教科書のあの絵は、見たままを描いた？" durationInFrames={d.Clue5Ekotoba} premountFor={fps}>
					<Clue5Ekotoba />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 1度目の元軍は、嵐で追い返された？" durationInFrames={d.Clue6Storm} premountFor={fps}>
					<Clue6Storm />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 幕府は、元の使いを斬った？" durationInFrames={d.Clue7Envoys} premountFor={fps}>
					<Clue7Envoys />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 博多湾に、20キロの石の壁を築いた？" durationInFrames={d.Clue8Wall} premountFor={fps}>
					<Clue8Wall />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 2度目は、14万人の大軍だった？" durationInFrames={d.Clue9Fleet} premountFor={fps}>
					<Clue9Fleet />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり 2度目は、嵐だけで勝った？" durationInFrames={d.Clue10Kamikaze} premountFor={fps}>
					<Clue10Kamikaze />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第11の手がかり 嵐で、元軍は全滅した？" durationInFrames={d.Clue11Survivors} premountFor={fps}>
					<Clue11Survivors />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第12の手がかり 海に沈んだ元の船は、見つからない？" durationInFrames={d.Clue12Wrecks} premountFor={fps}>
					<Clue12Wrecks />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第13の手がかり 海の底の船は、潜って探せば見つかる？" durationInFrames={d.Clue13Search} premountFor={fps}>
					<Clue13Search />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第14の手がかり 元の船は、急いで造った手抜きの船だった？" durationInFrames={d.Clue14Ships} premountFor={fps}>
					<Clue14Ships />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第15の手がかり 元の船には、文字は残っていない？" durationInFrames={d.Clue15Board} premountFor={fps}>
					<Clue15Board />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第16の手がかり 元軍は、滅ぼした国の武器まで使っていた？" durationInFrames={d.Clue16Arrows} premountFor={fps}>
					<Clue16Arrows />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第17の手がかり 元の兵士は、戦うだけの集団だった？" durationInFrames={d.Clue17Games} premountFor={fps}>
					<Clue17Games />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第18の手がかり 元に勝った幕府は、強くなった？" durationInFrames={d.Clue18Bakufu} premountFor={fps}>
					<Clue18Bakufu />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第19の手がかり 神風は、昔からの信仰だった？" durationInFrames={d.Clue19Shinkoku} premountFor={fps}>
					<Clue19Shinkoku />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="海の底が語りはじめた" durationInFrames={d.RootsStory} premountFor={fps}>
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
			<Audio name="BGM 前半「海の底の謎」" src={staticFile('bgm/bgm1-umi.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「博多湾の攻防」" src={staticFile('bgm/bgm2-hakata.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「海の底が語る」" src={staticFile('bgm/bgm3-kaitei.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
