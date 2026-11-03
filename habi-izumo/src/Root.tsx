import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiIzumoVideo} from './HabiIzumoVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Mark} from './scenes/Clue10Mark';
import {Clue11Burial} from './scenes/Clue11Burial';
import {Clue12King} from './scenes/Clue12King';
import {Clue13Crossroads} from './scenes/Clue13Crossroads';
import {Clue14Iron} from './scenes/Clue14Iron';
import {Clue15Yuzuri} from './scenes/Clue15Yuzuri';
import {Clue16Shrine} from './scenes/Clue16Shrine';
import {Clue17Collapse} from './scenes/Clue17Collapse';
import {Clue18Kokuso} from './scenes/Clue18Kokuso';
import {Clue19Kamiari} from './scenes/Clue19Kamiari';
import {Clue1Kannazuki} from './scenes/Clue1Kannazuki';
import {Clue2Okugi} from './scenes/Clue2Okugi';
import {Clue3Kojiki} from './scenes/Clue3Kojiki';
import {Clue4Kunibiki} from './scenes/Clue4Kunibiki';
import {Clue5Orochi} from './scenes/Clue5Orochi';
import {Clue6Kojindani} from './scenes/Clue6Kojindani';
import {Clue7Swords} from './scenes/Clue7Swords';
import {Clue8Bells} from './scenes/Clue8Bells';
import {Clue9Kamo} from './scenes/Clue9Kamo';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiIzumo720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiIzumoVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiIzumo" component={HabiIzumoVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiIzumo720" component={HabiIzumo720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Kannazuki" component={Clue1Kannazuki} durationInFrames={d.Clue1Kannazuki} fps={30} width={1920} height={1080} />
			<Composition id="Clue2Okugi" component={Clue2Okugi} durationInFrames={d.Clue2Okugi} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Kojiki" component={Clue3Kojiki} durationInFrames={d.Clue3Kojiki} fps={30} width={1920} height={1080} />
			<Composition id="Clue4Kunibiki" component={Clue4Kunibiki} durationInFrames={d.Clue4Kunibiki} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Orochi" component={Clue5Orochi} durationInFrames={d.Clue5Orochi} fps={30} width={1920} height={1080} />
			<Composition id="Clue6Kojindani" component={Clue6Kojindani} durationInFrames={d.Clue6Kojindani} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Swords" component={Clue7Swords} durationInFrames={d.Clue7Swords} fps={30} width={1920} height={1080} />
			<Composition id="Clue8Bells" component={Clue8Bells} durationInFrames={d.Clue8Bells} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Kamo" component={Clue9Kamo} durationInFrames={d.Clue9Kamo} fps={30} width={1920} height={1080} />
			<Composition id="Clue10Mark" component={Clue10Mark} durationInFrames={d.Clue10Mark} fps={30} width={1920} height={1080} />
			<Composition id="Clue11Burial" component={Clue11Burial} durationInFrames={d.Clue11Burial} fps={30} width={1920} height={1080} />
			<Composition id="Clue12King" component={Clue12King} durationInFrames={d.Clue12King} fps={30} width={1920} height={1080} />
			<Composition id="Clue13Crossroads" component={Clue13Crossroads} durationInFrames={d.Clue13Crossroads} fps={30} width={1920} height={1080} />
			<Composition id="Clue14Iron" component={Clue14Iron} durationInFrames={d.Clue14Iron} fps={30} width={1920} height={1080} />
			<Composition id="Clue15Yuzuri" component={Clue15Yuzuri} durationInFrames={d.Clue15Yuzuri} fps={30} width={1920} height={1080} />
			<Composition id="Clue16Shrine" component={Clue16Shrine} durationInFrames={d.Clue16Shrine} fps={30} width={1920} height={1080} />
			<Composition id="Clue17Collapse" component={Clue17Collapse} durationInFrames={d.Clue17Collapse} fps={30} width={1920} height={1080} />
			<Composition id="Clue18Kokuso" component={Clue18Kokuso} durationInFrames={d.Clue18Kokuso} fps={30} width={1920} height={1080} />
			<Composition id="Clue19Kamiari" component={Clue19Kamiari} durationInFrames={d.Clue19Kamiari} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
	</>
);
