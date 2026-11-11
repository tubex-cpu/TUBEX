import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiTakachihoVideo} from './HabiTakachihoVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {Thumb1Kagura, Thumb2Iwato, Thumb3Eclipse} from './thumbnails/Thumbnails';
import {Closing} from './scenes/Closing';
import {Clue10Unesco} from './scenes/Clue10Unesco';
import {Clue1Kagura} from './scenes/Clue1Kagura';
import {Clue2History} from './scenes/Clue2History';
import {Clue3Iwato} from './scenes/Clue3Iwato';
import {Clue4Shrine} from './scenes/Clue4Shrine';
import {Clue5Descent} from './scenes/Clue5Descent';
import {Clue6Eclipse} from './scenes/Clue6Eclipse';
import {Clue7Himiko} from './scenes/Clue7Himiko';
import {Clue8Uzume} from './scenes/Clue8Uzume';
import {Clue9Future} from './scenes/Clue9Future';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiTakachiho720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiTakachihoVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiTakachiho" component={HabiTakachihoVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiTakachiho720" component={HabiTakachiho720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Kagura" component={Clue1Kagura} durationInFrames={d.Clue1Kagura} fps={30} width={1920} height={1080} />
			<Composition id="Clue2History" component={Clue2History} durationInFrames={d.Clue2History} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Iwato" component={Clue3Iwato} durationInFrames={d.Clue3Iwato} fps={30} width={1920} height={1080} />
			<Composition id="Clue4Shrine" component={Clue4Shrine} durationInFrames={d.Clue4Shrine} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Descent" component={Clue5Descent} durationInFrames={d.Clue5Descent} fps={30} width={1920} height={1080} />
			<Composition id="Clue6Eclipse" component={Clue6Eclipse} durationInFrames={d.Clue6Eclipse} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Himiko" component={Clue7Himiko} durationInFrames={d.Clue7Himiko} fps={30} width={1920} height={1080} />
			<Composition id="Clue8Uzume" component={Clue8Uzume} durationInFrames={d.Clue8Uzume} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Future" component={Clue9Future} durationInFrames={d.Clue9Future} fps={30} width={1920} height={1080} />
			<Composition id="Clue10Unesco" component={Clue10Unesco} durationInFrames={d.Clue10Unesco} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
		<Folder name="Thumbnails">
			<Composition id="Thumb1Kagura" component={Thumb1Kagura} durationInFrames={1} fps={30} width={1280} height={720} />
			<Composition id="Thumb2Iwato" component={Thumb2Iwato} durationInFrames={1} fps={30} width={1280} height={720} />
			<Composition id="Thumb3Eclipse" component={Thumb3Eclipse} durationInFrames={1} fps={30} width={1280} height={720} />
		</Folder>
	</>
);
