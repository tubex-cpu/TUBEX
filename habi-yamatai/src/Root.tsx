import {Composition, Folder} from 'remotion';
import {HabiYamataiVideo} from './HabiYamataiVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {VerdictStamp} from './components/VerdictStamp';
import {Thumb1Sea, Thumb2Seal, Thumb3Shoki} from './thumbnails/Thumbnails';
import {Clue1Himiko} from './scenes/Clue1Himiko';
import {Clue2Route} from './scenes/Clue2Route';
import {Clue3GoldSeal} from './scenes/Clue3GoldSeal';
import {Clue4Yoshinogari} from './scenes/Clue4Yoshinogari';
import {Clue5Hashihaka} from './scenes/Clue5Hashihaka';
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
				id="HabiYamatai"
				component={HabiYamataiVideo}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Folder name="Scenes">
				<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
				<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
				<Composition id="Clue1Himiko" component={Clue1Himiko} durationInFrames={d.Clue1Himiko} fps={30} width={1920} height={1080} />
				<Composition id="Clue2Route" component={Clue2Route} durationInFrames={d.Clue2Route} fps={30} width={1920} height={1080} />
				<Composition id="Clue3GoldSeal" component={Clue3GoldSeal} durationInFrames={d.Clue3GoldSeal} fps={30} width={1920} height={1080} />
				<Composition id="Clue4Yoshinogari" component={Clue4Yoshinogari} durationInFrames={d.Clue4Yoshinogari} fps={30} width={1920} height={1080} />
				<Composition id="Clue5Hashihaka" component={Clue5Hashihaka} durationInFrames={d.Clue5Hashihaka} fps={30} width={1920} height={1080} />
				<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
				<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
				<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
				<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
			</Folder>
			<Folder name="Thumbnails">
				<Composition id="Thumb1Sea" component={Thumb1Sea} durationInFrames={1} fps={30} width={1280} height={720} />
				<Composition id="Thumb2Seal" component={Thumb2Seal} durationInFrames={1} fps={30} width={1280} height={720} />
				<Composition id="Thumb3Shoki" component={Thumb3Shoki} durationInFrames={1} fps={30} width={1280} height={720} />
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
