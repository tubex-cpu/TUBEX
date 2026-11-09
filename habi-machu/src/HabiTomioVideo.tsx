import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {interpolate, staticFile, useVideoConfig} from 'remotion';
import {sceneDurations as d, TRANSITION_FRAMES as T} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue1Size} from './scenes/Clue1Size';
import {Clue2History} from './scenes/Clue2History';
import {Clue3Sword} from './scenes/Clue3Sword';
import {Clue4South} from './scenes/Clue4South';
import {Clue5Mirror} from './scenes/Clue5Mirror';
import {Clue6Coffin} from './scenes/Clue6Coffin';
import {Clue7Mirrors} from './scenes/Clue7Mirrors';
import {Clue8Owner} from './scenes/Clue8Owner';
import {Clue9Tenri} from './scenes/Clue9Tenri';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第3の手がかり）、中盤（第4〜第7の手がかり）、後半（第8の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = d.Intro + d.JudgeEntrance + d.Clue1Size + d.Clue2History + d.Clue3Sword - 5 * T;
export const lateStart = midStart + d.Clue4South + d.Clue5Mirror + d.Clue6Coffin + d.Clue7Mirrors - 4 * T;

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ハビ判事：富雄丸山古墳判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiTomioVideo = () => {
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
				<TransitionSeries.Sequence name="第1の手がかり 富雄丸山古墳は、日本最大の古墳？" durationInFrames={d.Clue1Size} premountFor={fps}>
					<Clue1Size />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第2の手がかり 巨大な古墳だと、昔から知られていた？" durationInFrames={d.Clue2History} premountFor={fps}>
					<Clue2History />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第3の手がかり 巨大な剣は、戦いの武器だった？" durationInFrames={d.Clue3Sword} premountFor={fps}>
					<Clue3Sword />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第4の手がかり 蛇行剣は、南九州で生まれた？" durationInFrames={d.Clue4South} premountFor={fps}>
					<Clue4South />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第5の手がかり 盾の形の鏡は、中国から来た？" durationInFrames={d.Clue5Mirror} premountFor={fps}>
					<Clue5Mirror />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第6の手がかり 1600年前の木の棺は、もう残っていない？" durationInFrames={d.Clue6Coffin} premountFor={fps}>
					<Clue6Coffin />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第7の手がかり 棺の中の鏡は、古墳と同じ時代のもの？" durationInFrames={d.Clue7Mirrors} premountFor={fps}>
					<Clue7Mirrors />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第8の手がかり 墓の主は、女性だった？" durationInFrames={d.Clue8Owner} premountFor={fps}>
					<Clue8Owner />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="第9の手がかり 天理の三角縁神獣鏡は、この古墳から出た？" durationInFrames={d.Clue9Tenri} premountFor={fps}>
					<Clue9Tenri />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />
				<TransitionSeries.Sequence name="巨大な剣が語る、本当の物語" durationInFrames={d.RootsStory} premountFor={fps}>
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
			<Audio name="BGM 前半「丘の上の古墳」" src={staticFile('bgm/bgm1-oka.mp3')} durationInFrames={midStart + fps} volume={fadeVolume(midStart + fps, fps)} premountFor={fps} />
			<Audio name="BGM 中盤「波打つ剣」" src={staticFile('bgm/bgm2-tsurugi.mp3')} from={midStart - fps} durationInFrames={lateStart - midStart + 2 * fps} volume={fadeVolume(lateStart - midStart + 2 * fps, fps)} premountFor={fps} />
			<Audio name="BGM 後半「棺の中の宝」" src={staticFile('bgm/bgm3-hitsugi.mp3')} from={lateStart - fps} durationInFrames={durationInFrames - lateStart + fps} volume={fadeVolume(durationInFrames - lateStart + fps, fps)} premountFor={fps} />
		</>
	);
};
