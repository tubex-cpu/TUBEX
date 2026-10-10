import {Composition, Folder} from 'remotion';
import {HabiSumerVideo} from './HabiSumerVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {VerdictStamp} from './components/VerdictStamp';
import {Clue1Rock} from './scenes/Clue1Rock';
import {Clue2Words} from './scenes/Clue2Words';
import {Clue3Chrysanthemum} from './scenes/Clue3Chrysanthemum';
import {Clue4AI} from './scenes/Clue4AI';
import {Clue5DNA} from './scenes/Clue5DNA';
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
				id="HabiSumer"
				component={HabiSumerVideo}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Folder name="Scenes">
				<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
				<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
				<Composition id="Clue1Rock" component={Clue1Rock} durationInFrames={d.Clue1Rock} fps={30} width={1920} height={1080} />
				<Composition id="Clue2Words" component={Clue2Words} durationInFrames={d.Clue2Words} fps={30} width={1920} height={1080} />
				<Composition id="Clue3Chrysanthemum" component={Clue3Chrysanthemum} durationInFrames={d.Clue3Chrysanthemum} fps={30} width={1920} height={1080} />
				<Composition id="Clue4AI" component={Clue4AI} durationInFrames={d.Clue4AI} fps={30} width={1920} height={1080} />
				<Composition id="Clue5DNA" component={Clue5DNA} durationInFrames={d.Clue5DNA} fps={30} width={1920} height={1080} />
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
