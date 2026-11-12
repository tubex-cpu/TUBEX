import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Naritasan} from './scenes/Clue10Naritasan';
import {Clue11Kentoshi} from './scenes/Clue11Kentoshi';
import {Clue12Innocent} from './scenes/Clue12Innocent';
import {Clue13Tokihira} from './scenes/Clue13Tokihira';
import {Clue14Seiryoden} from './scenes/Clue14Seiryoden';
import {Clue15Emaki} from './scenes/Clue15Emaki';
import {Clue16Gakumon} from './scenes/Clue16Gakumon';
import {Clue17Ushi} from './scenes/Clue17Ushi';
import {Clue18Tobiume} from './scenes/Clue18Tobiume';
import {Clue19Ojigo} from './scenes/Clue19Ojigo';
import {Clue1Rebel} from './scenes/Clue1Rebel';
import {Clue20Hogen} from './scenes/Clue20Hogen';
import {Clue21Bloodsutra} from './scenes/Clue21Bloodsutra';
import {Clue22Murder} from './scenes/Clue22Murder';
import {Clue23Saigyo} from './scenes/Clue23Saigyo';
import {Clue24Tengu} from './scenes/Clue24Tengu';
import {Clue25Feared} from './scenes/Clue25Feared';
import {Clue26Shiramine} from './scenes/Clue26Shiramine';
import {Clue27Olympic} from './scenes/Clue27Olympic';
import {Clue28Sports} from './scenes/Clue28Sports';
import {Clue29Sandai} from './scenes/Clue29Sandai';
import {Clue2Shinno} from './scenes/Clue2Shinno';
import {Clue30Goryo} from './scenes/Clue30Goryo';
import {Clue31Gion} from './scenes/Clue31Gion';
import {Clue3Hidesato} from './scenes/Clue3Hidesato';
import {Clue4Laugh} from './scenes/Clue4Laugh';
import {Clue5Flying} from './scenes/Clue5Flying';
import {Clue6Tsuka} from './scenes/Clue6Tsuka';
import {Clue7Ghq} from './scenes/Clue7Ghq';
import {Clue8Incident} from './scenes/Clue8Incident';
import {Clue9Kanda} from './scenes/Clue9Kanda';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第3の手がかり）、中盤（第4〜第7の手がかり）、後半（第8の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Rebel + d.Clue2Shinno + d.Clue3Hidesato + d.Clue4Laugh + d.Clue5Flying + d.Clue6Tsuka + d.Clue7Ghq + d.Clue8Incident + d.Clue9Kanda + d.Clue10Naritasan - 12 * T;
export const lateStart = midStart + d.Clue11Kentoshi + d.Clue12Innocent + d.Clue13Tokihira + d.Clue14Seiryoden + d.Clue15Emaki + d.Clue16Gakumon + d.Clue17Ushi + d.Clue18Tobiume - 8 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：日本三大怨霊判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiOnryoVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 平将門は、朝廷に逆らった悪人？" durationInFrames={d.Clue1Rebel} premountFor={fps}>
					<Clue1Rebel />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 将門は、神のお告げで「新皇」を名乗った？" durationInFrames={d.Clue2Shinno} premountFor={fps}>
					<Clue2Shinno />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 将門を討ち取ったのは、大ムカデを退治した英雄・俵藤太？" durationInFrames={d.Clue3Hidesato} premountFor={fps}>
					<Clue3Hidesato />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 将門の首は、笑い、胴を探して叫んだ？" durationInFrames={d.Clue4Laugh} premountFor={fps}>
					<Clue4Laugh />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 将門の首は、京から東京まで飛んできた？" durationInFrames={d.Clue5Flying} premountFor={fps}>
					<Clue5Flying />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 将門塚を動かそうとすると、祟りが起きる？" durationInFrames={d.Clue6Tsuka} premountFor={fps}>
					<Clue6Tsuka />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 戦後、将門塚をならそうとしたGHQのブルドーザーが横転した？" durationInFrames={d.Clue7Ghq} premountFor={fps}>
					<Clue7Ghq />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 2026年、将門塚で騒いだ男に、罰が下った？" durationInFrames={d.Clue8Incident} premountFor={fps}>
					<Clue8Incident />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 神田明神は、将門を神の座から外したことがある？" durationInFrames={d.Clue9Kanda} premountFor={fps}>
					<Clue9Kanda />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり 将門を祀る神社の氏子は、成田山に参ってはいけない？" durationInFrames={d.Clue10Naritasan} premountFor={fps}>
					<Clue10Naritasan />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第11の手がかり 菅原道真は、遣唐使を廃止した？" durationInFrames={d.Clue11Kentoshi} premountFor={fps}>
					<Clue11Kentoshi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第12の手がかり 菅原道真は、無実の罪で大宰府に流された？" durationInFrames={d.Clue12Innocent} premountFor={fps}>
					<Clue12Innocent />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第13の手がかり 道真を追い落とした藤原時平は、道真の祟りで若死にした？" durationInFrames={d.Clue13Tokihira} premountFor={fps}>
					<Clue13Tokihira />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第14の手がかり 清涼殿の落雷は、当時から道真の祟りとして恐れられた？" durationInFrames={d.Clue14Seiryoden} premountFor={fps}>
					<Clue14Seiryoden />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第15の手がかり 北野天神縁起絵巻には、地獄で苦しむ醍醐天皇が描かれている？" durationInFrames={d.Clue15Emaki} premountFor={fps}>
					<Clue15Emaki />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第16の手がかり 菅原道真は、はじめから学問の神だった？" durationInFrames={d.Clue16Gakumon} premountFor={fps}>
					<Clue16Gakumon />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第17の手がかり 道真の亡きがらを運ぶ牛が動かなくなった場所に、太宰府天満宮は建てられた？" durationInFrames={d.Clue17Ushi} premountFor={fps}>
					<Clue17Ushi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第18の手がかり 道真の梅は、京都から大宰府まで飛んできた？" durationInFrames={d.Clue18Tobiume} premountFor={fps}>
					<Clue18Tobiume />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第19の手がかり 崇徳上皇は、父とされる鳥羽上皇の、本当の子ではなかった？" durationInFrames={d.Clue19Ojigo} premountFor={fps}>
					<Clue19Ojigo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第20の手がかり 崇徳上皇は、自ら兵を挙げて、保元の乱を起こした？" durationInFrames={d.Clue20Hogen} premountFor={fps}>
					<Clue20Hogen />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第21の手がかり 崇徳上皇は、自分の血で呪いの経を書いた？" durationInFrames={d.Clue21Bloodsutra} premountFor={fps}>
					<Clue21Bloodsutra />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第22の手がかり 崇徳上皇は、讃岐で殺された？" durationInFrames={d.Clue22Murder} premountFor={fps}>
					<Clue22Murder />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第23の手がかり 崇徳上皇の墓を、西行は本当に訪ねた？" durationInFrames={d.Clue23Saigyo} premountFor={fps}>
					<Clue23Saigyo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第24の手がかり 崇徳上皇は、死後、天狗になった？" durationInFrames={d.Clue24Tengu} premountFor={fps}>
					<Clue24Tengu />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第25の手がかり 崇徳上皇は、亡くなってすぐに怨霊として恐れられた？" durationInFrames={d.Clue25Feared} premountFor={fps}>
					<Clue25Feared />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第26の手がかり 明治天皇は、崇徳上皇の霊を京都に迎えるために神社を建てた？" durationInFrames={d.Clue26Shiramine} premountFor={fps}>
					<Clue26Shiramine />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第27の手がかり 昭和天皇は、東京オリンピックの成功を祈って崇徳上皇を慰霊した？" durationInFrames={d.Clue27Olympic} premountFor={fps}>
					<Clue27Olympic />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第28の手がかり 白峯神宮がスポーツの神なのは、崇徳上皇が球技を好んだから？" durationInFrames={d.Clue28Sports} premountFor={fps}>
					<Clue28Sports />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第29の手がかり 「日本三大怨霊」は、昔からそう呼ばれていた？" durationInFrames={d.Clue29Sandai} premountFor={fps}>
					<Clue29Sandai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第30の手がかり 怨霊は、神として祀れば守り神になる？" durationInFrames={d.Clue30Goryo} premountFor={fps}>
					<Clue30Goryo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第31の手がかり 京都の祇園祭は、怨霊を鎮める祭りから始まった？" durationInFrames={d.Clue31Gion} premountFor={fps}>
					<Clue31Gion />
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
			<Audio name="BGM 前半「将門」" src={staticFile('bgm/bgm1-masakado.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「天神」" src={staticFile('bgm/bgm2-michizane.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「白峯」" src={staticFile('bgm/bgm3-sutoku.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
