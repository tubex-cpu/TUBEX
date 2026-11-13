import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Honmyokai} from './scenes/Clue10Honmyokai';
import {Clue11Shinnyokai} from './scenes/Clue11Shinnyokai';
import {Clue12Eye} from './scenes/Clue12Eye';
import {Clue13Tetsumonkai} from './scenes/Clue13Tetsumonkai';
import {Clue14Ikeda} from './scenes/Clue14Ikeda';
import {Clue15Tetsuryukai} from './scenes/Clue15Tetsuryukai';
import {Clue16Chukai} from './scenes/Clue16Chukai';
import {Clue17Enmyokai} from './scenes/Clue17Enmyokai';
import {Clue18Fly} from './scenes/Clue18Fly';
import {Clue19Processed} from './scenes/Clue19Processed';
import {Clue1Count} from './scenes/Clue1Count';
import {Clue20Kouchi} from './scenes/Clue20Kouchi';
import {Clue21Yutei} from './scenes/Clue21Yutei';
import {Clue22Fingerprint} from './scenes/Clue22Fingerprint';
import {Clue23Meiji} from './scenes/Clue23Meiji';
import {Clue24Bukkai} from './scenes/Clue24Bukkai';
import {Clue25Excavation} from './scenes/Clue25Excavation';
import {Clue26Dochu} from './scenes/Clue26Dochu';
import {Clue27Shitou} from './scenes/Clue27Shitou';
import {Clue28Zhanggong} from './scenes/Clue28Zhanggong';
import {Clue29Thailand} from './scenes/Clue29Thailand';
import {Clue2Yudono} from './scenes/Clue2Yudono';
import {Clue30Lost} from './scenes/Clue30Lost';
import {Clue31Myokai} from './scenes/Clue31Myokai';
import {Clue32Koromo} from './scenes/Clue32Koromo';
import {Clue33Fame} from './scenes/Clue33Fame';
import {Clue3Goshintai} from './scenes/Clue3Goshintai';
import {Clue4Haguro} from './scenes/Clue4Haguro';
import {Clue5Gyonin} from './scenes/Clue5Gyonin';
import {Clue6Mokujiki} from './scenes/Clue6Mokujiki';
import {Clue7Urushi} from './scenes/Clue7Urushi';
import {Clue8Kane} from './scenes/Clue8Kane';
import {Clue9Unburied} from './scenes/Clue9Unburied';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第3の手がかり）、中盤（第4〜第7の手がかり）、後半（第8の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Count + d.Clue2Yudono + d.Clue3Goshintai + d.Clue4Haguro + d.Clue5Gyonin + d.Clue6Mokujiki + d.Clue7Urushi + d.Clue8Kane + d.Clue9Unburied + d.Clue10Honmyokai + d.Clue11Shinnyokai - 13 * T;
export const lateStart = midStart + d.Clue12Eye + d.Clue13Tetsumonkai + d.Clue14Ikeda + d.Clue15Tetsuryukai + d.Clue16Chukai + d.Clue17Enmyokai + d.Clue18Fly + d.Clue19Processed + d.Clue20Kouchi + d.Clue21Yutei + d.Clue22Fingerprint - 11 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：即身仏判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiSokushinVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 即身仏は、日本に十数体しかない？" durationInFrames={d.Clue1Count} premountFor={fps}>
					<Clue1Count />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 即身仏は、湯殿山の行者たちが生んだ？" durationInFrames={d.Clue2Yudono} premountFor={fps}>
					<Clue2Yudono />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 湯殿山の御神体は、語ってはいけない？" durationInFrames={d.Clue3Goshintai} premountFor={fps}>
					<Clue3Goshintai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 湯殿山と羽黒山は、争っていた？" durationInFrames={d.Clue4Haguro} premountFor={fps}>
					<Clue4Haguro />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 即身仏を目指したのは、位の高い僧だった？" durationInFrames={d.Clue5Gyonin} premountFor={fps}>
					<Clue5Gyonin />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 行者たちは、木の実や草だけで何年も暮らした？" durationInFrames={d.Clue6Mokujiki} premountFor={fps}>
					<Clue6Mokujiki />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 即身仏になるため、行者は漆を飲んだ？" durationInFrames={d.Clue7Urushi} premountFor={fps}>
					<Clue7Urushi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 土に入った行者は、鉦を鳴らし続けた？" durationInFrames={d.Clue8Kane} premountFor={fps}>
					<Clue8Kane />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 即身仏は、必ず土に埋められた？" durationInFrames={d.Clue9Unburied} premountFor={fps}>
					<Clue9Unburied />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり 本明海上人は、藩主の身代わりになった？" durationInFrames={d.Clue10Honmyokai} premountFor={fps}>
					<Clue10Honmyokai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第11の手がかり 真如海上人は、大飢饉の年に入定した？" durationInFrames={d.Clue11Shinnyokai} premountFor={fps}>
					<Clue11Shinnyokai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第12の手がかり 鉄門海上人は、自分の目をくりぬいた？" durationInFrames={d.Clue12Eye} premountFor={fps}>
					<Clue12Eye />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第13の手がかり 鉄門海上人は、生きたまま土に入った？" durationInFrames={d.Clue13Tetsumonkai} premountFor={fps}>
					<Clue13Tetsumonkai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第14の手がかり 同じ時代の人々は、鉄門海の即身仏をあがめた？" durationInFrames={d.Clue14Ikeda} premountFor={fps}>
					<Clue14Ikeda />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第15の手がかり 鉄竜海上人の体は、自然にミイラになった？" durationInFrames={d.Clue15Tetsuryukai} premountFor={fps}>
					<Clue15Tetsuryukai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第16の手がかり 忠海上人は、掘り出したとき乾いていた？" durationInFrames={d.Clue16Chukai} premountFor={fps}>
					<Clue16Chukai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第17の手がかり 円明海上人は、木食行の果てに亡くなった？" durationInFrames={d.Clue17Enmyokai} premountFor={fps}>
					<Clue17Enmyokai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第18の手がかり 即身仏の体の中から、ハエの抜け殻が見つかった？" durationInFrames={d.Clue18Fly} premountFor={fps}>
					<Clue18Fly />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第19の手がかり 即身仏の多くは、亡くなったあとに整えられた？" durationInFrames={d.Clue19Processed} premountFor={fps}>
					<Clue19Processed />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第20の手がかり 弘智法印は、日本で最も古い即身仏？" durationInFrames={d.Clue20Kouchi} premountFor={fps}>
					<Clue20Kouchi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第21の手がかり 宥貞法印は、石の棺の中で鉦を鳴らしながら亡くなった？" durationInFrames={d.Clue21Yutei} premountFor={fps}>
					<Clue21Yutei />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第22の手がかり 鉄門海上人の即身仏は、本人だと確かめられた？" durationInFrames={d.Clue22Fingerprint} premountFor={fps}>
					<Clue22Fingerprint />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第23の手がかり 明治天皇が、即身仏を禁じた？" durationInFrames={d.Clue23Meiji} premountFor={fps}>
					<Clue23Meiji />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第24の手がかり 最後の即身仏・仏海上人は、生きたまま土に入った？" durationInFrames={d.Clue24Bukkai} premountFor={fps}>
					<Clue24Bukkai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第25の手がかり 仏海上人の遺体は、58年後に掘り出された？" durationInFrames={d.Clue25Excavation} premountFor={fps}>
					<Clue25Excavation />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第26の手がかり 土中入定と即身仏は、同じ信仰だった？" durationInFrames={d.Clue26Dochu} premountFor={fps}>
					<Clue26Dochu />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第27の手がかり 日本には、中国から渡ってきた僧のミイラがある？" durationInFrames={d.Clue27Shitou} premountFor={fps}>
					<Clue27Shitou />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第28の手がかり 中国では、仏像の中から僧の遺体が見つかった？" durationInFrames={d.Clue28Zhanggong} premountFor={fps}>
					<Clue28Zhanggong />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第29の手がかり タイの高僧は、自らミイラになった？" durationInFrames={d.Clue29Thailand} premountFor={fps}>
					<Clue29Thailand />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第30の手がかり 即身仏の中には、失われたものがある？" durationInFrames={d.Clue30Lost} premountFor={fps}>
					<Clue30Lost />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第31の手がかり 即身仏は、すべて寺が守っている？" durationInFrames={d.Clue31Myokai} premountFor={fps}>
					<Clue31Myokai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第32の手がかり 即身仏は、いまも衣を替えて祀られている？" durationInFrames={d.Clue32Koromo} premountFor={fps}>
					<Clue32Koromo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第33の手がかり 湯殿山の即身仏が広く知られたのは、明治以降？" durationInFrames={d.Clue33Fame} premountFor={fps}>
					<Clue33Fame />
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
			<Audio name="BGM 前半「湯殿山」" src={staticFile('bgm/bgm1-yudono.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「行者」" src={staticFile('bgm/bgm2-gyoja.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「祈り」" src={staticFile('bgm/bgm3-inori.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
