import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiKagamiVideo} from './HabiKagamiVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Namari} from './scenes/Clue10Namari';
import {Clue11Sanjigen} from './scenes/Clue11Sanjigen';
import {Clue12Kurozuka} from './scenes/Clue12Kurozuka';
import {Clue13Kannai} from './scenes/Clue13Kannai';
import {Clue14Kage} from './scenes/Clue14Kage';
import {Clue15Densei} from './scenes/Clue15Densei';
import {Clue16Makyo} from './scenes/Clue16Makyo';
import {Clue17Kami} from './scenes/Clue17Kami';
import {Clue18Kyodai} from './scenes/Clue18Kyodai';
import {Clue19Haifu} from './scenes/Clue19Haifu';
import {Clue1Hyakumai} from './scenes/Clue1Hyakumai';
import {Clue20Haka} from './scenes/Clue20Haka';
import {Clue21Hashihaka} from './scenes/Clue21Hashihaka';
import {Clue22Makimuku} from './scenes/Clue22Makimuku';
import {Clue23Hirabaru} from './scenes/Clue23Hirabaru';
import {Clue24Yoshinogari} from './scenes/Clue24Yoshinogari';
import {Clue25Tenrankai} from './scenes/Clue25Tenrankai';
import {Clue2Nengo} from './scenes/Clue2Nengo';
import {Clue3Shisha} from './scenes/Clue3Shisha';
import {Clue4Keisho3} from './scenes/Clue4Keisho3';
import {Clue5Seishi} from './scenes/Clue5Seishi';
import {Clue6Keisho4} from './scenes/Clue6Keisho4';
import {Clue7Kazu} from './scenes/Clue7Kazu';
import {Clue8China} from './scenes/Clue8China';
import {Clue9Mei} from './scenes/Clue9Mei';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiKagami720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiKagamiVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiKagami" component={HabiKagamiVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiKagami720" component={HabiKagami720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Hyakumai" component={Clue1Hyakumai} durationInFrames={d.Clue1Hyakumai} fps={30} width={1920} height={1080} />
			<Composition id="Clue2Nengo" component={Clue2Nengo} durationInFrames={d.Clue2Nengo} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Shisha" component={Clue3Shisha} durationInFrames={d.Clue3Shisha} fps={30} width={1920} height={1080} />
			<Composition id="Clue4Keisho3" component={Clue4Keisho3} durationInFrames={d.Clue4Keisho3} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Seishi" component={Clue5Seishi} durationInFrames={d.Clue5Seishi} fps={30} width={1920} height={1080} />
			<Composition id="Clue6Keisho4" component={Clue6Keisho4} durationInFrames={d.Clue6Keisho4} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Kazu" component={Clue7Kazu} durationInFrames={d.Clue7Kazu} fps={30} width={1920} height={1080} />
			<Composition id="Clue8China" component={Clue8China} durationInFrames={d.Clue8China} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Mei" component={Clue9Mei} durationInFrames={d.Clue9Mei} fps={30} width={1920} height={1080} />
			<Composition id="Clue10Namari" component={Clue10Namari} durationInFrames={d.Clue10Namari} fps={30} width={1920} height={1080} />
			<Composition id="Clue11Sanjigen" component={Clue11Sanjigen} durationInFrames={d.Clue11Sanjigen} fps={30} width={1920} height={1080} />
			<Composition id="Clue12Kurozuka" component={Clue12Kurozuka} durationInFrames={d.Clue12Kurozuka} fps={30} width={1920} height={1080} />
			<Composition id="Clue13Kannai" component={Clue13Kannai} durationInFrames={d.Clue13Kannai} fps={30} width={1920} height={1080} />
			<Composition id="Clue14Kage" component={Clue14Kage} durationInFrames={d.Clue14Kage} fps={30} width={1920} height={1080} />
			<Composition id="Clue15Densei" component={Clue15Densei} durationInFrames={d.Clue15Densei} fps={30} width={1920} height={1080} />
			<Composition id="Clue16Makyo" component={Clue16Makyo} durationInFrames={d.Clue16Makyo} fps={30} width={1920} height={1080} />
			<Composition id="Clue17Kami" component={Clue17Kami} durationInFrames={d.Clue17Kami} fps={30} width={1920} height={1080} />
			<Composition id="Clue18Kyodai" component={Clue18Kyodai} durationInFrames={d.Clue18Kyodai} fps={30} width={1920} height={1080} />
			<Composition id="Clue19Haifu" component={Clue19Haifu} durationInFrames={d.Clue19Haifu} fps={30} width={1920} height={1080} />
			<Composition id="Clue20Haka" component={Clue20Haka} durationInFrames={d.Clue20Haka} fps={30} width={1920} height={1080} />
			<Composition id="Clue21Hashihaka" component={Clue21Hashihaka} durationInFrames={d.Clue21Hashihaka} fps={30} width={1920} height={1080} />
			<Composition id="Clue22Makimuku" component={Clue22Makimuku} durationInFrames={d.Clue22Makimuku} fps={30} width={1920} height={1080} />
			<Composition id="Clue23Hirabaru" component={Clue23Hirabaru} durationInFrames={d.Clue23Hirabaru} fps={30} width={1920} height={1080} />
			<Composition id="Clue24Yoshinogari" component={Clue24Yoshinogari} durationInFrames={d.Clue24Yoshinogari} fps={30} width={1920} height={1080} />
			<Composition id="Clue25Tenrankai" component={Clue25Tenrankai} durationInFrames={d.Clue25Tenrankai} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
	</>
);
