import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiOnryoVideo} from './HabiOnryoVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Naritasan} from './scenes/Clue10Naritasan';
import {Clue11Kentoshi} from './scenes/Clue11Kentoshi';
import {Clue12Innocent} from './scenes/Clue12Innocent';
import {Clue13Tokihira} from './scenes/Clue13Tokihira';
import {Clue14Seiryoden} from './scenes/Clue14Seiryoden';
import {Clue15Emaki} from './scenes/Clue15Emaki';
import {Clue16Gakumon} from './scenes/Clue16Gakumon';
import {Clue17Ushi} from './scenes/Clue17Ushi';
import {Clue18Tobiume} from './scenes/Clue18Tobiume';
import {Clue19Ojigo} from './scenes/Clue19Ojigo';
import {Clue1Rebel} from './scenes/Clue1Rebel';
import {Clue20Hogen} from './scenes/Clue20Hogen';
import {Clue21Bloodsutra} from './scenes/Clue21Bloodsutra';
import {Clue22Murder} from './scenes/Clue22Murder';
import {Clue23Saigyo} from './scenes/Clue23Saigyo';
import {Clue24Tengu} from './scenes/Clue24Tengu';
import {Clue25Feared} from './scenes/Clue25Feared';
import {Clue26Shiramine} from './scenes/Clue26Shiramine';
import {Clue27Olympic} from './scenes/Clue27Olympic';
import {Clue28Sports} from './scenes/Clue28Sports';
import {Clue29Sandai} from './scenes/Clue29Sandai';
import {Clue2Shinno} from './scenes/Clue2Shinno';
import {Clue30Goryo} from './scenes/Clue30Goryo';
import {Clue31Gion} from './scenes/Clue31Gion';
import {Clue3Hidesato} from './scenes/Clue3Hidesato';
import {Clue4Laugh} from './scenes/Clue4Laugh';
import {Clue5Flying} from './scenes/Clue5Flying';
import {Clue6Tsuka} from './scenes/Clue6Tsuka';
import {Clue7Ghq} from './scenes/Clue7Ghq';
import {Clue8Incident} from './scenes/Clue8Incident';
import {Clue9Kanda} from './scenes/Clue9Kanda';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';
import {Thumb1Tsuka, Thumb2Kami, Thumb3Kubi} from './thumbnails/Thumbnails';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiOnryo720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiOnryoVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiOnryo" component={HabiOnryoVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiOnryo720" component={HabiOnryo720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Rebel" component={Clue1Rebel} durationInFrames={d.Clue1Rebel} fps={30} width={1920} height={1080} />
			<Composition id="Clue2Shinno" component={Clue2Shinno} durationInFrames={d.Clue2Shinno} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Hidesato" component={Clue3Hidesato} durationInFrames={d.Clue3Hidesato} fps={30} width={1920} height={1080} />
			<Composition id="Clue4Laugh" component={Clue4Laugh} durationInFrames={d.Clue4Laugh} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Flying" component={Clue5Flying} durationInFrames={d.Clue5Flying} fps={30} width={1920} height={1080} />
			<Composition id="Clue6Tsuka" component={Clue6Tsuka} durationInFrames={d.Clue6Tsuka} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Ghq" component={Clue7Ghq} durationInFrames={d.Clue7Ghq} fps={30} width={1920} height={1080} />
			<Composition id="Clue8Incident" component={Clue8Incident} durationInFrames={d.Clue8Incident} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Kanda" component={Clue9Kanda} durationInFrames={d.Clue9Kanda} fps={30} width={1920} height={1080} />
			<Composition id="Clue10Naritasan" component={Clue10Naritasan} durationInFrames={d.Clue10Naritasan} fps={30} width={1920} height={1080} />
			<Composition id="Clue11Kentoshi" component={Clue11Kentoshi} durationInFrames={d.Clue11Kentoshi} fps={30} width={1920} height={1080} />
			<Composition id="Clue12Innocent" component={Clue12Innocent} durationInFrames={d.Clue12Innocent} fps={30} width={1920} height={1080} />
			<Composition id="Clue13Tokihira" component={Clue13Tokihira} durationInFrames={d.Clue13Tokihira} fps={30} width={1920} height={1080} />
			<Composition id="Clue14Seiryoden" component={Clue14Seiryoden} durationInFrames={d.Clue14Seiryoden} fps={30} width={1920} height={1080} />
			<Composition id="Clue15Emaki" component={Clue15Emaki} durationInFrames={d.Clue15Emaki} fps={30} width={1920} height={1080} />
			<Composition id="Clue16Gakumon" component={Clue16Gakumon} durationInFrames={d.Clue16Gakumon} fps={30} width={1920} height={1080} />
			<Composition id="Clue17Ushi" component={Clue17Ushi} durationInFrames={d.Clue17Ushi} fps={30} width={1920} height={1080} />
			<Composition id="Clue18Tobiume" component={Clue18Tobiume} durationInFrames={d.Clue18Tobiume} fps={30} width={1920} height={1080} />
			<Composition id="Clue19Ojigo" component={Clue19Ojigo} durationInFrames={d.Clue19Ojigo} fps={30} width={1920} height={1080} />
			<Composition id="Clue20Hogen" component={Clue20Hogen} durationInFrames={d.Clue20Hogen} fps={30} width={1920} height={1080} />
			<Composition id="Clue21Bloodsutra" component={Clue21Bloodsutra} durationInFrames={d.Clue21Bloodsutra} fps={30} width={1920} height={1080} />
			<Composition id="Clue22Murder" component={Clue22Murder} durationInFrames={d.Clue22Murder} fps={30} width={1920} height={1080} />
			<Composition id="Clue23Saigyo" component={Clue23Saigyo} durationInFrames={d.Clue23Saigyo} fps={30} width={1920} height={1080} />
			<Composition id="Clue24Tengu" component={Clue24Tengu} durationInFrames={d.Clue24Tengu} fps={30} width={1920} height={1080} />
			<Composition id="Clue25Feared" component={Clue25Feared} durationInFrames={d.Clue25Feared} fps={30} width={1920} height={1080} />
			<Composition id="Clue26Shiramine" component={Clue26Shiramine} durationInFrames={d.Clue26Shiramine} fps={30} width={1920} height={1080} />
			<Composition id="Clue27Olympic" component={Clue27Olympic} durationInFrames={d.Clue27Olympic} fps={30} width={1920} height={1080} />
			<Composition id="Clue28Sports" component={Clue28Sports} durationInFrames={d.Clue28Sports} fps={30} width={1920} height={1080} />
			<Composition id="Clue29Sandai" component={Clue29Sandai} durationInFrames={d.Clue29Sandai} fps={30} width={1920} height={1080} />
			<Composition id="Clue30Goryo" component={Clue30Goryo} durationInFrames={d.Clue30Goryo} fps={30} width={1920} height={1080} />
			<Composition id="Clue31Gion" component={Clue31Gion} durationInFrames={d.Clue31Gion} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
		<Folder name="Thumbnails">
			<Composition id="Thumb1Tsuka" component={Thumb1Tsuka} durationInFrames={1} fps={30} width={1280} height={720} />
			<Composition id="Thumb2Kami" component={Thumb2Kami} durationInFrames={1} fps={30} width={1280} height={720} />
			<Composition id="Thumb3Kubi" component={Thumb3Kubi} durationInFrames={1} fps={30} width={1280} height={720} />
		</Folder>
	</>
);
