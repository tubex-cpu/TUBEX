import {Composition, Folder} from 'remotion';
import {HabiNoahVideo} from './HabiNoahVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {VerdictStamp} from './components/VerdictStamp';
import {Clue1Ararat} from './scenes/Clue1Ararat';
import {Clue2Tablet} from './scenes/Clue2Tablet';
import {Clue3Layers} from './scenes/Clue3Layers';
import {Clue4BlackSea} from './scenes/Clue4BlackSea';
import {Clue5Animals} from './scenes/Clue5Animals';
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
				id="HabiNoah"
				component={HabiNoahVideo}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Folder name="Scenes">
				<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
				<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
				<Composition id="Clue1Ararat" component={Clue1Ararat} durationInFrames={d.Clue1Ararat} fps={30} width={1920} height={1080} />
				<Composition id="Clue2Tablet" component={Clue2Tablet} durationInFrames={d.Clue2Tablet} fps={30} width={1920} height={1080} />
				<Composition id="Clue3Layers" component={Clue3Layers} durationInFrames={d.Clue3Layers} fps={30} width={1920} height={1080} />
				<Composition id="Clue4BlackSea" component={Clue4BlackSea} durationInFrames={d.Clue4BlackSea} fps={30} width={1920} height={1080} />
				<Composition id="Clue5Animals" component={Clue5Animals} durationInFrames={d.Clue5Animals} fps={30} width={1920} height={1080} />
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
