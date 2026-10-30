import {AbsoluteFill, Composition, Folder} from 'remotion';
import {GenkoOpening, OPENING_FRAMES} from './GenkoOpening';
import {HabiGenkoVideo} from './HabiGenkoVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Kamikaze} from './scenes/Clue10Kamikaze';
import {Clue11Survivors} from './scenes/Clue11Survivors';
import {Clue12Wrecks} from './scenes/Clue12Wrecks';
import {Clue13Search} from './scenes/Clue13Search';
import {Clue14Ships} from './scenes/Clue14Ships';
import {Clue15Board} from './scenes/Clue15Board';
import {Clue16Arrows} from './scenes/Clue16Arrows';
import {Clue17Games} from './scenes/Clue17Games';
import {Clue18Bakufu} from './scenes/Clue18Bakufu';
import {Clue19Shinkoku} from './scenes/Clue19Shinkoku';
import {Clue1Letter} from './scenes/Clue1Letter';
import {Clue2Islands} from './scenes/Clue2Islands';
import {Clue3Samurai} from './scenes/Clue3Samurai';
import {Clue4Tetsuhau} from './scenes/Clue4Tetsuhau';
import {Clue5Ekotoba} from './scenes/Clue5Ekotoba';
import {Clue6Storm} from './scenes/Clue6Storm';
import {Clue7Envoys} from './scenes/Clue7Envoys';
import {Clue8Wall} from './scenes/Clue8Wall';
import {Clue9Fleet} from './scenes/Clue9Fleet';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiGenko720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiGenkoVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiGenko" component={HabiGenkoVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiGenko720" component={HabiGenko720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Composition id="GenkoOpening" component={GenkoOpening} durationInFrames={OPENING_FRAMES} fps={30} width={1920} height={1080} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Letter" component={Clue1Letter} durationInFrames={d.Clue1Letter} fps={30} width={1920} height={1080} />
			<Composition id="Clue2Islands" component={Clue2Islands} durationInFrames={d.Clue2Islands} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Samurai" component={Clue3Samurai} durationInFrames={d.Clue3Samurai} fps={30} width={1920} height={1080} />
			<Composition id="Clue4Tetsuhau" component={Clue4Tetsuhau} durationInFrames={d.Clue4Tetsuhau} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Ekotoba" component={Clue5Ekotoba} durationInFrames={d.Clue5Ekotoba} fps={30} width={1920} height={1080} />
			<Composition id="Clue6Storm" component={Clue6Storm} durationInFrames={d.Clue6Storm} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Envoys" component={Clue7Envoys} durationInFrames={d.Clue7Envoys} fps={30} width={1920} height={1080} />
			<Composition id="Clue8Wall" component={Clue8Wall} durationInFrames={d.Clue8Wall} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Fleet" component={Clue9Fleet} durationInFrames={d.Clue9Fleet} fps={30} width={1920} height={1080} />
			<Composition id="Clue10Kamikaze" component={Clue10Kamikaze} durationInFrames={d.Clue10Kamikaze} fps={30} width={1920} height={1080} />
			<Composition id="Clue11Survivors" component={Clue11Survivors} durationInFrames={d.Clue11Survivors} fps={30} width={1920} height={1080} />
			<Composition id="Clue12Wrecks" component={Clue12Wrecks} durationInFrames={d.Clue12Wrecks} fps={30} width={1920} height={1080} />
			<Composition id="Clue13Search" component={Clue13Search} durationInFrames={d.Clue13Search} fps={30} width={1920} height={1080} />
			<Composition id="Clue14Ships" component={Clue14Ships} durationInFrames={d.Clue14Ships} fps={30} width={1920} height={1080} />
			<Composition id="Clue15Board" component={Clue15Board} durationInFrames={d.Clue15Board} fps={30} width={1920} height={1080} />
			<Composition id="Clue16Arrows" component={Clue16Arrows} durationInFrames={d.Clue16Arrows} fps={30} width={1920} height={1080} />
			<Composition id="Clue17Games" component={Clue17Games} durationInFrames={d.Clue17Games} fps={30} width={1920} height={1080} />
			<Composition id="Clue18Bakufu" component={Clue18Bakufu} durationInFrames={d.Clue18Bakufu} fps={30} width={1920} height={1080} />
			<Composition id="Clue19Shinkoku" component={Clue19Shinkoku} durationInFrames={d.Clue19Shinkoku} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
	</>
);
