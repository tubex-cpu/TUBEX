import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Inside} from './scenes/Clue10Inside';
import {Clue11Boston} from './scenes/Clue11Boston';
import {Clue12Treasure} from './scenes/Clue12Treasure';
import {Clue13Entry} from './scenes/Clue13Entry';
import {Clue14Lost} from './scenes/Clue14Lost';
import {Clue15Heritage} from './scenes/Clue15Heritage';
import {Clue16Now} from './scenes/Clue16Now';
import {Clue1Size} from './scenes/Clue1Size';
import {Clue2Build} from './scenes/Clue2Build';
import {Clue3Craft} from './scenes/Clue3Craft';
import {Clue4Haniwa} from './scenes/Clue4Haniwa';
import {Clue5Baicho} from './scenes/Clue5Baicho';
import {Clue6Nintoku} from './scenes/Clue6Nintoku';
import {Clue7Juryo} from './scenes/Clue7Juryo';
import {Clue8Kings} from './scenes/Clue8Kings';
import {Clue9Name} from './scenes/Clue9Name';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.11;

// BGMの区間：前半（冒頭〜第5の手がかり）、中盤（第6〜第11の手がかり）、後半（第12の手がかり〜締め）
const midStart = d.Intro + d.JudgeEntrance + d.Clue1Size + d.Clue2Build + d.Clue3Craft + d.Clue4Haniwa + d.Clue5Baicho - 7 * T;
const lateStart = midStart + d.Clue6Nintoku + d.Clue7Juryo + d.Clue8Kings + d.Clue9Name + d.Clue10Inside + d.Clue11Boston - 6 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：仁徳天皇陵判決（本編）
// シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiNintokuVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 世界最大の墓だった？" durationInFrames={d.Clue1Size} premountFor={fps}>
					<Clue1Size />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 造るのに15年以上かかった？" durationInFrames={d.Clue2Build} premountFor={fps}>
					<Clue2Build />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 古墳の時代、堺は最先端の工業地帯だった？" durationInFrames={d.Clue3Craft} premountFor={fps}>
					<Clue3Craft />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 埴輪は、いけにえの身代わりだった？" durationInFrames={d.Clue4Haniwa} premountFor={fps}>
					<Clue4Haniwa />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 周りの小さな古墳は、家来の墓？" durationInFrames={d.Clue5Baicho} premountFor={fps}>
					<Clue5Baicho />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 眠っているのは仁徳天皇？" durationInFrames={d.Clue6Nintoku} premountFor={fps}>
					<Clue6Nintoku />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 王は、生きているうちに自分の墓を造った？" durationInFrames={d.Clue7Juryo} premountFor={fps}>
					<Clue7Juryo />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 倭の王は、中国の皇帝の家来だった？" durationInFrames={d.Clue8Kings} premountFor={fps}>
					<Clue8Kings />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 天皇陵の名前は、昔から伝わっていた？" durationInFrames={d.Clue9Name} premountFor={fps}>
					<Clue9Name />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第10の手がかり 中を見た人は誰もいない？" durationInFrames={d.Clue10Inside} premountFor={fps}>
					<Clue10Inside />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第11の手がかり 宝はアメリカに渡った？" durationInFrames={d.Clue11Boston} premountFor={fps}>
					<Clue11Boston />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第12の手がかり 明治5年の宝は、すべて失われた？" durationInFrames={d.Clue12Treasure} premountFor={fps}>
					<Clue12Treasure />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第13の手がかり 天皇陵には、今も誰も入れない？" durationInFrames={d.Clue13Entry} premountFor={fps}>
					<Clue13Entry />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第14の手がかり 百舌鳥古墳群は、昔のまま残っている？" durationInFrames={d.Clue14Lost} premountFor={fps}>
					<Clue14Lost />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第15の手がかり 世界遺産になって、発掘が進んだ？" durationInFrames={d.Clue15Heritage} premountFor={fps}>
					<Clue15Heritage />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第16の手がかり 仁徳天皇陵は、造られたときの姿のまま？" durationInFrames={d.Clue16Now} premountFor={fps}>
					<Clue16Now />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="動き出した巨大古墳" durationInFrames={d.RootsStory} premountFor={fps}>
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
				name="BGM 前半「百舌鳥の森」"
				src={staticFile('bgm/bgm1-mozu.mp3')}
				durationInFrames={midStart + fps}
				volume={fadeVolume(midStart + fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 中盤「調査」"
				src={staticFile('bgm/bgm2-survey.mp3')}
				from={midStart - fps}
				durationInFrames={lateStart - midStart + 2 * fps}
				volume={fadeVolume(lateStart - midStart + 2 * fps, fps)}
				premountFor={fps}
			/>
			<Audio
				name="BGM 後半「浮かび上がる形」"
				src={staticFile('bgm/bgm3-relief.mp3')}
				from={lateStart - fps}
				durationInFrames={durationInFrames - lateStart + fps}
				volume={fadeVolume(durationInFrames - lateStart + fps, fps)}
				premountFor={fps}
			/>
		</>
	);
};
