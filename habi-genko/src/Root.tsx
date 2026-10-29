import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiNintokuVideo} from './HabiNintokuVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {VerdictStamp} from './components/VerdictStamp';
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

// 投稿用の720p版（1920×1080の画面をそのまま縮小）
const HabiNintoku720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiNintokuVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="HabiNintoku" component={HabiNintokuVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="HabiNintoku720" component={HabiNintoku720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
			<Folder name="Scenes">
				<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
				<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
				<Composition id="Clue1Size" component={Clue1Size} durationInFrames={d.Clue1Size} fps={30} width={1920} height={1080} />
				<Composition id="Clue2Build" component={Clue2Build} durationInFrames={d.Clue2Build} fps={30} width={1920} height={1080} />
				<Composition id="Clue3Craft" component={Clue3Craft} durationInFrames={d.Clue3Craft} fps={30} width={1920} height={1080} />
				<Composition id="Clue4Haniwa" component={Clue4Haniwa} durationInFrames={d.Clue4Haniwa} fps={30} width={1920} height={1080} />
				<Composition id="Clue5Baicho" component={Clue5Baicho} durationInFrames={d.Clue5Baicho} fps={30} width={1920} height={1080} />
				<Composition id="Clue6Nintoku" component={Clue6Nintoku} durationInFrames={d.Clue6Nintoku} fps={30} width={1920} height={1080} />
				<Composition id="Clue7Juryo" component={Clue7Juryo} durationInFrames={d.Clue7Juryo} fps={30} width={1920} height={1080} />
				<Composition id="Clue8Kings" component={Clue8Kings} durationInFrames={d.Clue8Kings} fps={30} width={1920} height={1080} />
				<Composition id="Clue9Name" component={Clue9Name} durationInFrames={d.Clue9Name} fps={30} width={1920} height={1080} />
				<Composition id="Clue10Inside" component={Clue10Inside} durationInFrames={d.Clue10Inside} fps={30} width={1920} height={1080} />
				<Composition id="Clue11Boston" component={Clue11Boston} durationInFrames={d.Clue11Boston} fps={30} width={1920} height={1080} />
				<Composition id="Clue12Treasure" component={Clue12Treasure} durationInFrames={d.Clue12Treasure} fps={30} width={1920} height={1080} />
				<Composition id="Clue13Entry" component={Clue13Entry} durationInFrames={d.Clue13Entry} fps={30} width={1920} height={1080} />
				<Composition id="Clue14Lost" component={Clue14Lost} durationInFrames={d.Clue14Lost} fps={30} width={1920} height={1080} />
				<Composition id="Clue15Heritage" component={Clue15Heritage} durationInFrames={d.Clue15Heritage} fps={30} width={1920} height={1080} />
				<Composition id="Clue16Now" component={Clue16Now} durationInFrames={d.Clue16Now} fps={30} width={1920} height={1080} />
				<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
				<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
				<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
				<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
			</Folder>
			<Folder name="Elements">
				<Composition
					id="VerdictStamp"
					component={VerdictStamp}
					durationInFrames={90}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{verdict: 'half', size: 380}}
				/>
			</Folder>
		</>
	);
};
