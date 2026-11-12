import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiIseVideo} from './HabiIseVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {Thumb1Hinoki, Thumb2Katashiro, Thumb3Curse} from './thumbnails/Thumbnails';
import {Closing} from './scenes/Closing';
import {Clue1Solstice} from './scenes/Clue1Solstice';
import {Clue2Origin} from './scenes/Clue2Origin';
import {Clue3Regalia} from './scenes/Clue3Regalia';
import {Clue4Mirror} from './scenes/Clue4Mirror';
import {Clue5Hebrew} from './scenes/Clue5Hebrew';
import {Clue6Curse} from './scenes/Clue6Curse';
import {Clue7Dannoura} from './scenes/Clue7Dannoura';
import {Clue8Seen} from './scenes/Clue8Seen';
import {Clue9Sengu} from './scenes/Clue9Sengu';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiIse720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiIseVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiIse" component={HabiIseVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiIse720" component={HabiIse720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Solstice" component={Clue1Solstice} durationInFrames={d.Clue1Solstice} fps={30} width={1920} height={1080} />
			<Composition id="Clue2Origin" component={Clue2Origin} durationInFrames={d.Clue2Origin} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Regalia" component={Clue3Regalia} durationInFrames={d.Clue3Regalia} fps={30} width={1920} height={1080} />
			<Composition id="Clue4Mirror" component={Clue4Mirror} durationInFrames={d.Clue4Mirror} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Hebrew" component={Clue5Hebrew} durationInFrames={d.Clue5Hebrew} fps={30} width={1920} height={1080} />
			<Composition id="Clue6Curse" component={Clue6Curse} durationInFrames={d.Clue6Curse} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Dannoura" component={Clue7Dannoura} durationInFrames={d.Clue7Dannoura} fps={30} width={1920} height={1080} />
			<Composition id="Clue8Seen" component={Clue8Seen} durationInFrames={d.Clue8Seen} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Sengu" component={Clue9Sengu} durationInFrames={d.Clue9Sengu} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
		<Folder name="Thumbnails">
			<Composition id="Thumb1Hinoki" component={Thumb1Hinoki} durationInFrames={1} fps={30} width={1280} height={720} />
			<Composition id="Thumb2Katashiro" component={Thumb2Katashiro} durationInFrames={1} fps={30} width={1280} height={720} />
			<Composition id="Thumb3Curse" component={Thumb3Curse} durationInFrames={1} fps={30} width={1280} height={720} />
		</Folder>
	</>
);
