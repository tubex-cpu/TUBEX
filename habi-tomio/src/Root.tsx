import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiTomioVideo} from './HabiTomioVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
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

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiTomio720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiTomioVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiTomio" component={HabiTomioVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiTomio720" component={HabiTomio720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Size" component={Clue1Size} durationInFrames={d.Clue1Size} fps={30} width={1920} height={1080} />
			<Composition id="Clue2History" component={Clue2History} durationInFrames={d.Clue2History} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Sword" component={Clue3Sword} durationInFrames={d.Clue3Sword} fps={30} width={1920} height={1080} />
			<Composition id="Clue4South" component={Clue4South} durationInFrames={d.Clue4South} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Mirror" component={Clue5Mirror} durationInFrames={d.Clue5Mirror} fps={30} width={1920} height={1080} />
			<Composition id="Clue6Coffin" component={Clue6Coffin} durationInFrames={d.Clue6Coffin} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Mirrors" component={Clue7Mirrors} durationInFrames={d.Clue7Mirrors} fps={30} width={1920} height={1080} />
			<Composition id="Clue8Owner" component={Clue8Owner} durationInFrames={d.Clue8Owner} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Tenri" component={Clue9Tenri} durationInFrames={d.Clue9Tenri} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
	</>
);
