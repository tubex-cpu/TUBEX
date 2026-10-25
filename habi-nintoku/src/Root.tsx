import {Composition, Folder} from 'remotion';
import {HabiNintokuVideo} from './HabiNintokuVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {VerdictStamp} from './components/VerdictStamp';
import {Clue1Size} from './scenes/Clue1Size';
import {Clue2Build} from './scenes/Clue2Build';
import {Clue3Nintoku} from './scenes/Clue3Nintoku';
import {Clue4Inside} from './scenes/Clue4Inside';
import {Clue5Boston} from './scenes/Clue5Boston';
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
				id="HabiNintoku"
				component={HabiNintokuVideo}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Folder name="Scenes">
				<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
				<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
				<Composition id="Clue1Size" component={Clue1Size} durationInFrames={d.Clue1Size} fps={30} width={1920} height={1080} />
				<Composition id="Clue2Build" component={Clue2Build} durationInFrames={d.Clue2Build} fps={30} width={1920} height={1080} />
				<Composition id="Clue3Nintoku" component={Clue3Nintoku} durationInFrames={d.Clue3Nintoku} fps={30} width={1920} height={1080} />
				<Composition id="Clue4Inside" component={Clue4Inside} durationInFrames={d.Clue4Inside} fps={30} width={1920} height={1080} />
				<Composition id="Clue5Boston" component={Clue5Boston} durationInFrames={d.Clue5Boston} fps={30} width={1920} height={1080} />
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
