import {Composition, Folder} from 'remotion';
import {HabiPyramidVideo} from './HabiPyramidVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {VerdictStamp} from './components/VerdictStamp';
import {Clue1Age} from './scenes/Clue1Age';
import {Clue2Underground} from './scenes/Clue2Underground';
import {Clue3Quake} from './scenes/Clue3Quake';
import {Clue4Lift} from './scenes/Clue4Lift';
import {Clue5Workers} from './scenes/Clue5Workers';
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
				id="HabiPyramid"
				component={HabiPyramidVideo}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Folder name="Scenes">
				<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
				<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
				<Composition id="Clue1Age" component={Clue1Age} durationInFrames={d.Clue1Age} fps={30} width={1920} height={1080} />
				<Composition id="Clue2Underground" component={Clue2Underground} durationInFrames={d.Clue2Underground} fps={30} width={1920} height={1080} />
				<Composition id="Clue3Quake" component={Clue3Quake} durationInFrames={d.Clue3Quake} fps={30} width={1920} height={1080} />
				<Composition id="Clue4Lift" component={Clue4Lift} durationInFrames={d.Clue4Lift} fps={30} width={1920} height={1080} />
				<Composition id="Clue5Workers" component={Clue5Workers} durationInFrames={d.Clue5Workers} fps={30} width={1920} height={1080} />
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
