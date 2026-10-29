import {AbsoluteFill, Composition, Folder} from 'remotion';
import {GenkoOpening, OPENING_FRAMES} from './GenkoOpening';
import {sceneDurations as d} from './data/timeline';
import {Clue1Letter} from './scenes/Clue1Letter';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';

const Opening720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<GenkoOpening />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="GenkoOpening" component={GenkoOpening} durationInFrames={OPENING_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="GenkoOpening720" component={Opening720} durationInFrames={OPENING_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Letter" component={Clue1Letter} durationInFrames={d.Clue1Letter} fps={30} width={1920} height={1080} />
		</Folder>
	</>
);
