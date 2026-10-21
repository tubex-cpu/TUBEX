import {Composition, Folder} from 'remotion';
import {HabiHonnojiVideo} from './HabiHonnojiVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {VerdictStamp} from './components/VerdictStamp';
import {Clue1Cry} from './scenes/Clue1Cry';
import {Clue2Grudge} from './scenes/Clue2Grudge';
import {Clue3Hideyoshi} from './scenes/Clue3Hideyoshi';
import {Clue4Shikoku} from './scenes/Clue4Shikoku';
import {Clue5Tenkai} from './scenes/Clue5Tenkai';
import {Closing} from './scenes/Closing';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="HabiHonnoji"
				component={HabiHonnojiVideo}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Folder name="Scenes">
				<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
				<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
				<Composition id="Clue1Cry" component={Clue1Cry} durationInFrames={d.Clue1Cry} fps={30} width={1920} height={1080} />
				<Composition id="Clue2Grudge" component={Clue2Grudge} durationInFrames={d.Clue2Grudge} fps={30} width={1920} height={1080} />
				<Composition id="Clue3Hideyoshi" component={Clue3Hideyoshi} durationInFrames={d.Clue3Hideyoshi} fps={30} width={1920} height={1080} />
				<Composition id="Clue4Shikoku" component={Clue4Shikoku} durationInFrames={d.Clue4Shikoku} fps={30} width={1920} height={1080} />
				<Composition id="Clue5Tenkai" component={Clue5Tenkai} durationInFrames={d.Clue5Tenkai} fps={30} width={1920} height={1080} />
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
