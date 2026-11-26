import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Namari} from './scenes/Clue10Namari';
import {Clue11Sanjigen} from './scenes/Clue11Sanjigen';
import {Clue12Kurozuka} from './scenes/Clue12Kurozuka';
import {Clue13Kannai} from './scenes/Clue13Kannai';
import {Clue14Kage} from './scenes/Clue14Kage';
import {Clue15Densei} from './scenes/Clue15Densei';
import {Clue16Makyo} from './scenes/Clue16Makyo';
import {Clue17Kami} from './scenes/Clue17Kami';
import {Clue18Kyodai} from './scenes/Clue18Kyodai';
import {Clue19Haifu} from './scenes/Clue19Haifu';
import {Clue1Hyakumai} from './scenes/Clue1Hyakumai';
import {Clue20Haka} from './scenes/Clue20Haka';
import {Clue21Hashihaka} from './scenes/Clue21Hashihaka';
import {Clue22Makimuku} from './scenes/Clue22Makimuku';
import {Clue23Hirabaru} from './scenes/Clue23Hirabaru';
import {Clue24Yoshinogari} from './scenes/Clue24Yoshinogari';
import {Clue25Tenrankai} from './scenes/Clue25Tenrankai';
import {Clue2Nengo} from './scenes/Clue2Nengo';
import {Clue3Shisha} from './scenes/Clue3Shisha';
import {Clue4Keisho3} from './scenes/Clue4Keisho3';
import {Clue5Seishi} from './scenes/Clue5Seishi';
import {Clue6Keisho4} from './scenes/Clue6Keisho4';
import {Clue7Kazu} from './scenes/Clue7Kazu';
import {Clue8China} from './scenes/Clue8China';
import {Clue9Mei} from './scenes/Clue9Mei';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第3の手がかり）、中盤（第4〜第7の手がかり）、後半（第8の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Hyakumai + d.Clue2Nengo + d.Clue3Shisha + d.Clue4Keisho3 + d.Clue5Seishi + d.Clue6Keisho4 + d.Clue7Kazu + d.Clue8China - 10 * T;
export const lateStart = midStart + d.Clue9Mei + d.Clue10Namari + d.Clue11Sanjigen + d.Clue12Kurozuka + d.Clue13Kannai + d.Clue14Kage + d.Clue15Densei + d.Clue16Makyo + d.Clue17Kami - 9 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：卑弥呼の鏡判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiKagamiVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 卑弥呼は、魏の皇帝から銅鏡百枚をもらった？" durationInFrames={d.Clue1Hyakumai} premountFor={fps}>
					<Clue1Hyakumai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 卑弥呼が使いを送ったのは、239年？" durationInFrames={d.Clue2Nengo} premountFor={fps}>
					<Clue2Nengo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 銅鏡百枚は、卑弥呼の使いが持ち帰った？" durationInFrames={d.Clue3Shisha} premountFor={fps}>
					<Clue3Shisha />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 卑弥呼の年号が刻まれた鏡が、見つかっている？" durationInFrames={d.Clue4Keisho3} premountFor={fps}>
					<Clue4Keisho3 />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 鏡が届いた年、正始元年の鏡もある？" durationInFrames={d.Clue5Seishi} premountFor={fps}>
					<Clue5Seishi />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 存在しない年号、景初四年の鏡は、偽物？" durationInFrames={d.Clue6Keisho4} premountFor={fps}>
					<Clue6Keisho4 />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 三角縁神獣鏡は、百枚しかない？" durationInFrames={d.Clue7Kazu} premountFor={fps}>
					<Clue7Kazu />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 三角縁神獣鏡は、中国で1枚も見つかっていない？" durationInFrames={d.Clue8China} premountFor={fps}>
					<Clue8China />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 鏡には、銅は徐州から、職人は洛陽からと書いてある？" durationInFrames={d.Clue9Mei} premountFor={fps}>
					<Clue9Mei />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり 鉛の成分を調べれば、作った場所が分かる？" durationInFrames={d.Clue10Namari} premountFor={fps}>
					<Clue10Namari />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第11の手がかり 中国製と日本製の三角縁神獣鏡は、はっきり見分けられる？" durationInFrames={d.Clue11Sanjigen} premountFor={fps}>
					<Clue11Sanjigen />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第12の手がかり 黒塚古墳では、33枚の鏡が棺を取り囲んでいた？" durationInFrames={d.Clue12Kurozuka} premountFor={fps}>
					<Clue12Kurozuka />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第13の手がかり 黒塚古墳で、いちばん大切にされたのは三角縁神獣鏡？" durationInFrames={d.Clue13Kannai} premountFor={fps}>
					<Clue13Kannai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第14の手がかり どこから出たか分からない鏡の故郷は、もう突き止められない？" durationInFrames={d.Clue14Kage} premountFor={fps}>
					<Clue14Kage />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第15の手がかり 鏡は、作られてすぐに墓に入れられた？" durationInFrames={d.Clue15Densei} premountFor={fps}>
					<Clue15Densei />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第16の手がかり 卑弥呼の鏡は、光を当てると絵が浮かぶ魔鏡だった？" durationInFrames={d.Clue16Makyo} premountFor={fps}>
					<Clue16Makyo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第17の手がかり 鏡は、神そのものとしてまつられてきた？" durationInFrames={d.Clue17Kami} premountFor={fps}>
					<Clue17Kami />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第18の手がかり 同じ型の兄弟の鏡が、全国に散らばっている？" durationInFrames={d.Clue18Kyodai} premountFor={fps}>
					<Clue18Kyodai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第19の手がかり 奈良の王が、鏡を全国に配った？" durationInFrames={d.Clue19Haifu} premountFor={fps}>
					<Clue19Haifu />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第20の手がかり 三角縁神獣鏡は、卑弥呼の墓から出ている？" durationInFrames={d.Clue20Haka} premountFor={fps}>
					<Clue20Haka />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第21の手がかり 箸墓古墳は、卑弥呼が亡くなったころに築かれた？" durationInFrames={d.Clue21Hashihaka} premountFor={fps}>
					<Clue21Hashihaka />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第22の手がかり 奈良の纒向に、卑弥呼の時代の大きな町があった？" durationInFrames={d.Clue22Makimuku} premountFor={fps}>
					<Clue22Makimuku />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第23の手がかり 日本最大の古代の鏡は、九州から出ている？" durationInFrames={d.Clue23Hirabaru} premountFor={fps}>
					<Clue23Hirabaru />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第24の手がかり 吉野ヶ里で、卑弥呼の時代の王の墓が見つかった？" durationInFrames={d.Clue24Yoshinogari} premountFor={fps}>
					<Clue24Yoshinogari />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第25の手がかり 卑弥呼の鏡の謎は、2026年の特別展で解けた？" durationInFrames={d.Clue25Tenrankai} premountFor={fps}>
					<Clue25Tenrankai />
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
			<Audio name="BGM 前半「魏の都」" src={staticFile('bgm/bgm1-gi.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「鏡の謎」" src={staticFile('bgm/bgm2-kagami.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「天秤」" src={staticFile('bgm/bgm3-tenbin.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
