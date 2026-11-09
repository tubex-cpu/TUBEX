import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiMachuVideo} from './HabiMachuVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Lidar} from './scenes/Clue10Lidar';
import {Clue1Bingham} from './scenes/Clue1Bingham';
import {Clue2Name} from './scenes/Clue2Name';
import {Clue3Fortress} from './scenes/Clue3Fortress';
import {Clue4Date} from './scenes/Clue4Date';
import {Clue5Virgins} from './scenes/Clue5Virgins';
import {Clue6People} from './scenes/Clue6People';
import {Clue7Spain} from './scenes/Clue7Spain';
import {Clue8Stone} from './scenes/Clue8Stone';
import {Clue9Japan} from './scenes/Clue9Japan';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiMachu720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiMachuVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiMachu" component={HabiMachuVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiMachu720" component={HabiMachu720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Bingham" component={Clue1Bingham} durationInFrames={d.Clue1Bingham} fps={30} width={1920} height={1080} />
			<Composition id="Clue2Name" component={Clue2Name} durationInFrames={d.Clue2Name} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Fortress" component={Clue3Fortress} durationInFrames={d.Clue3Fortress} fps={30} width={1920} height={1080} />
			<Composition id="Clue4Date" component={Clue4Date} durationInFrames={d.Clue4Date} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Virgins" component={Clue5Virgins} durationInFrames={d.Clue5Virgins} fps={30} width={1920} height={1080} />
			<Composition id="Clue6People" component={Clue6People} durationInFrames={d.Clue6People} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Spain" component={Clue7Spain} durationInFrames={d.Clue7Spain} fps={30} width={1920} height={1080} />
			<Composition id="Clue8Stone" component={Clue8Stone} durationInFrames={d.Clue8Stone} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Japan" component={Clue9Japan} durationInFrames={d.Clue9Japan} fps={30} width={1920} height={1080} />
			<Composition id="Clue10Lidar" component={Clue10Lidar} durationInFrames={d.Clue10Lidar} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
	</>
);
