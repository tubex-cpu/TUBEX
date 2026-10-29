import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiMuVideo} from './HabiMuVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {VerdictStamp} from './components/VerdictStamp';
import {Closing} from './scenes/Closing';
import {Clue10Walk} from './scenes/Clue10Walk';
import {Clue11Settle} from './scenes/Clue11Settle';
import {Clue12Collapse} from './scenes/Clue12Collapse';
import {Clue13Yonaguni} from './scenes/Clue13Yonaguni';
import {Clue14Forbidden} from './scenes/Clue14Forbidden';
import {Clue15Sandy} from './scenes/Clue15Sandy';
import {Clue16Lemuria} from './scenes/Clue16Lemuria';
import {Clue17Seafloor} from './scenes/Clue17Seafloor';
import {Clue18Japan} from './scenes/Clue18Japan';
import {Clue1Name} from './scenes/Clue1Name';
import {Clue2Maya} from './scenes/Clue2Maya';
import {Clue3Queen} from './scenes/Clue3Queen';
import {Clue4Churchward} from './scenes/Clue4Churchward';
import {Clue5Tablets} from './scenes/Clue5Tablets';
import {Clue6NanMadol} from './scenes/Clue6NanMadol';
import {Clue7Curse} from './scenes/Clue7Curse';
import {Clue8Platinum} from './scenes/Clue8Platinum';
import {Clue9Moai} from './scenes/Clue9Moai';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// 投稿用の720p版（1920×1080の画面をそのまま縮小）
const HabiMu720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiMuVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="HabiMu" component={HabiMuVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
			<Composition id="HabiMu720" component={HabiMu720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
			<Folder name="Scenes">
				<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
				<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
				<Composition id="Clue1Name" component={Clue1Name} durationInFrames={d.Clue1Name} fps={30} width={1920} height={1080} />
				<Composition id="Clue2Maya" component={Clue2Maya} durationInFrames={d.Clue2Maya} fps={30} width={1920} height={1080} />
				<Composition id="Clue3Queen" component={Clue3Queen} durationInFrames={d.Clue3Queen} fps={30} width={1920} height={1080} />
				<Composition id="Clue4Churchward" component={Clue4Churchward} durationInFrames={d.Clue4Churchward} fps={30} width={1920} height={1080} />
				<Composition id="Clue5Tablets" component={Clue5Tablets} durationInFrames={d.Clue5Tablets} fps={30} width={1920} height={1080} />
				<Composition id="Clue6NanMadol" component={Clue6NanMadol} durationInFrames={d.Clue6NanMadol} fps={30} width={1920} height={1080} />
				<Composition id="Clue7Curse" component={Clue7Curse} durationInFrames={d.Clue7Curse} fps={30} width={1920} height={1080} />
				<Composition id="Clue8Platinum" component={Clue8Platinum} durationInFrames={d.Clue8Platinum} fps={30} width={1920} height={1080} />
				<Composition id="Clue9Moai" component={Clue9Moai} durationInFrames={d.Clue9Moai} fps={30} width={1920} height={1080} />
				<Composition id="Clue10Walk" component={Clue10Walk} durationInFrames={d.Clue10Walk} fps={30} width={1920} height={1080} />
				<Composition id="Clue11Settle" component={Clue11Settle} durationInFrames={d.Clue11Settle} fps={30} width={1920} height={1080} />
				<Composition id="Clue12Collapse" component={Clue12Collapse} durationInFrames={d.Clue12Collapse} fps={30} width={1920} height={1080} />
				<Composition id="Clue13Yonaguni" component={Clue13Yonaguni} durationInFrames={d.Clue13Yonaguni} fps={30} width={1920} height={1080} />
				<Composition id="Clue14Forbidden" component={Clue14Forbidden} durationInFrames={d.Clue14Forbidden} fps={30} width={1920} height={1080} />
				<Composition id="Clue15Sandy" component={Clue15Sandy} durationInFrames={d.Clue15Sandy} fps={30} width={1920} height={1080} />
				<Composition id="Clue16Lemuria" component={Clue16Lemuria} durationInFrames={d.Clue16Lemuria} fps={30} width={1920} height={1080} />
				<Composition id="Clue17Seafloor" component={Clue17Seafloor} durationInFrames={d.Clue17Seafloor} fps={30} width={1920} height={1080} />
				<Composition id="Clue18Japan" component={Clue18Japan} durationInFrames={d.Clue18Japan} fps={30} width={1920} height={1080} />
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
