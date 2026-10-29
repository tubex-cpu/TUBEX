import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Walk} from './scenes/Clue10Walk';
import {Clue11Settle} from './scenes/Clue11Settle';
import {Clue12Collapse} from './scenes/Clue12Collapse';
import {Clue13Yonaguni} from './scenes/Clue13Yonaguni';
import {Clue14Forbidden} from './scenes/Clue14Forbidden';
import {Clue15Sandy} from './scenes/Clue15Sandy';
import {Clue16Lemuria} from './scenes/Clue16Lemuria';
import {Clue17Seafloor} from './scenes/Clue17Seafloor';
import {Clue18Japan} from './scenes/Clue18Japan';
import {Clue1Name} from './scenes/Clue1Name';
import {Clue2Maya} from './scenes/Clue2Maya';
import {Clue3Queen} from './scenes/Clue3Queen';
import {Clue4Churchward} from './scenes/Clue4Churchward';
import {Clue5Tablets} from './scenes/Clue5Tablets';
import {Clue6NanMadol} from './scenes/Clue6NanMadol';
import {Clue7Curse} from './scenes/Clue7Curse';
import {Clue8Platinum} from './scenes/Clue8Platinum';
import {Clue9Moai} from './scenes/Clue9Moai';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.11;

// BGMの区間：前半（冒頭〜第5の手がかり）、中盤（第6〜第11の手がかり）、後半（第12の手がかり〜締め）
const midStart = d.Intro + d.JudgeEntrance + d.Clue1Name + d.Clue2Maya + d.Clue3Queen + d.Clue4Churchward + d.Clue5Tablets - 7 * T;
const lateStart = midStart + d.Clue6NanMadol + d.Clue7Curse + d.Clue8Platinum + d.Clue9Moai + d.Clue10Walk + d.Clue11Settle - 6 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：ムー大陸判決（本編）
// シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiMuVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり ムーは、古代から語り継がれてきた？" durationInFrames={d.Clue1Name} premountFor={fps}>
					<Clue1Name />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり マヤの本には、沈んだ大陸が書かれていた？" durationInFrames={d.Clue2Maya} premountFor={fps}>
					<Clue2Maya />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり ムーの女王は、エジプトに文明を伝えた？" durationInFrames={d.Clue3Queen} premountFor={fps}>
					<Clue3Queen />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 6400万人が暮らす大陸があった？" durationInFrames={d.Clue4Churchward} premountFor={fps}>
					<Clue4Churchward />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり ムーの記録が刻まれた粘土板がある？" durationInFrames={d.Clue5Tablets} premountFor={fps}>
					<Clue5Tablets />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 南の海の石の都は、ムーの都だった？" durationInFrames={d.Clue6NanMadol} premountFor={fps}>
					<Clue6NanMadol />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 墓を暴いた男は、呪いで命を落とした？" durationInFrames={d.Clue7Curse} premountFor={fps}>
					<Clue7Curse />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 海の底に、プラチナの棺が眠る？" durationInFrames={d.Clue8Platinum} premountFor={fps}>
					<Clue8Platinum />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり モアイは、沈んだ大陸を見張っている？" durationInFrames={d.Clue9Moai} premountFor={fps}>
					<Clue9Moai />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり 重いモアイは、引きずって運ばれた？" durationInFrames={d.Clue10Walk} premountFor={fps}>
					<Clue10Walk />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第11の手がかり イースター島の人々は、沈んだ大陸から逃げてきた？" durationInFrames={d.Clue11Settle} premountFor={fps}>
					<Clue11Settle />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第12の手がかり イースター島の人々は、木を切りつくして滅んだ？" durationInFrames={d.Clue12Collapse} premountFor={fps}>
					<Clue12Collapse />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第13の手がかり 沖縄の海の底に、ムーの遺跡がある？" durationInFrames={d.Clue13Yonaguni} premountFor={fps}>
					<Clue13Yonaguni />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第14の手がかり 上陸禁止の島が、ムーの証拠を隠している？" durationInFrames={d.Clue14Forbidden} premountFor={fps}>
					<Clue14Forbidden />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第15の手がかり 太平洋には、地図から消された島がある？" durationInFrames={d.Clue15Sandy} premountFor={fps}>
					<Clue15Sandy />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第16の手がかり 科学者も、海に沈んだ大陸を信じていた？" durationInFrames={d.Clue16Lemuria} premountFor={fps}>
					<Clue16Lemuria />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第17の手がかり 太平洋の海の底に、大陸が沈んでいる？" durationInFrames={d.Clue17Seafloor} premountFor={fps}>
					<Clue17Seafloor />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第18の手がかり 次に沈むのは、日本列島？" durationInFrames={d.Clue18Japan} premountFor={fps}>
					<Clue18Japan />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="本当に沈んでいた大陸" durationInFrames={d.RootsStory} premountFor={fps}>
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
				name="BGM 前半「夜の海」"
				src={staticFile('bgm/bgm1-ocean.mp3')}
				durationInFrames={midStart + fps}
				volume={fadeVolume(midStart + fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 中盤「石の都」"
				src={staticFile('bgm/bgm2-stones.mp3')}
				from={midStart - fps}
				durationInFrames={lateStart - midStart + 2 * fps}
				volume={fadeVolume(lateStart - midStart + 2 * fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 後半「航海」"
				src={staticFile('bgm/bgm3-voyage.mp3')}
				from={lateStart - fps}
				durationInFrames={durationInFrames - lateStart + fps}
				volume={fadeVolume(durationInFrames - lateStart + fps, fps)}
				premountFor={fps}
			/>
		</>
	);
};
