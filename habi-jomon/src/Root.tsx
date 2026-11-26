import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiJomonVideo} from './HabiJomonVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Denpun} from './scenes/Clue10Denpun';
import {Clue11Samusa} from './scenes/Clue11Samusa';
import {Clue12Funka} from './scenes/Clue12Funka';
import {Clue13Senso} from './scenes/Clue13Senso';
import {Clue14Heiwa} from './scenes/Clue14Heiwa';
import {Clue15Koeki} from './scenes/Clue15Koeki';
import {Clue16Yayoi} from './scenes/Clue16Yayoi';
import {Clue17Dogu} from './scenes/Clue17Dogu';
import {Clue18Kowasu} from './scenes/Clue18Kowasu';
import {Clue19Basshi} from './scenes/Clue19Basshi';
import {Clue1Nagasa} from './scenes/Clue1Nagasa';
import {Clue20Kanjo} from './scenes/Clue20Kanjo';
import {Clue21Jinko} from './scenes/Clue21Jinko';
import {Clue22Kanrei} from './scenes/Clue22Kanrei';
import {Clue23Horobi} from './scenes/Clue23Horobi';
import {Clue24Shometsu} from './scenes/Clue24Shometsu';
import {Clue2Doki} from './scenes/Clue2Doki';
import {Clue3Kawari} from './scenes/Clue3Kawari';
import {Clue4Bunmei} from './scenes/Clue4Bunmei';
import {Clue5Kari} from './scenes/Clue5Kari';
import {Clue6Teiju} from './scenes/Clue6Teiju';
import {Clue7Kuri} from './scenes/Clue7Kuri';
import {Clue8Chozo} from './scenes/Clue8Chozo';
import {Clue9Urushi} from './scenes/Clue9Urushi';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiJomon720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiJomonVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiJomon" component={HabiJomonVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiJomon720" component={HabiJomon720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Nagasa" component={Clue1Nagasa} durationInFrames={d.Clue1Nagasa} fps={30} width={1920} height={1080} />
			<Composition id="Clue2Doki" component={Clue2Doki} durationInFrames={d.Clue2Doki} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Kawari" component={Clue3Kawari} durationInFrames={d.Clue3Kawari} fps={30} width={1920} height={1080} />
			<Composition id="Clue4Bunmei" component={Clue4Bunmei} durationInFrames={d.Clue4Bunmei} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Kari" component={Clue5Kari} durationInFrames={d.Clue5Kari} fps={30} width={1920} height={1080} />
			<Composition id="Clue6Teiju" component={Clue6Teiju} durationInFrames={d.Clue6Teiju} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Kuri" component={Clue7Kuri} durationInFrames={d.Clue7Kuri} fps={30} width={1920} height={1080} />
			<Composition id="Clue8Chozo" component={Clue8Chozo} durationInFrames={d.Clue8Chozo} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Urushi" component={Clue9Urushi} durationInFrames={d.Clue9Urushi} fps={30} width={1920} height={1080} />
			<Composition id="Clue10Denpun" component={Clue10Denpun} durationInFrames={d.Clue10Denpun} fps={30} width={1920} height={1080} />
			<Composition id="Clue11Samusa" component={Clue11Samusa} durationInFrames={d.Clue11Samusa} fps={30} width={1920} height={1080} />
			<Composition id="Clue12Funka" component={Clue12Funka} durationInFrames={d.Clue12Funka} fps={30} width={1920} height={1080} />
			<Composition id="Clue13Senso" component={Clue13Senso} durationInFrames={d.Clue13Senso} fps={30} width={1920} height={1080} />
			<Composition id="Clue14Heiwa" component={Clue14Heiwa} durationInFrames={d.Clue14Heiwa} fps={30} width={1920} height={1080} />
			<Composition id="Clue15Koeki" component={Clue15Koeki} durationInFrames={d.Clue15Koeki} fps={30} width={1920} height={1080} />
			<Composition id="Clue16Yayoi" component={Clue16Yayoi} durationInFrames={d.Clue16Yayoi} fps={30} width={1920} height={1080} />
			<Composition id="Clue17Dogu" component={Clue17Dogu} durationInFrames={d.Clue17Dogu} fps={30} width={1920} height={1080} />
			<Composition id="Clue18Kowasu" component={Clue18Kowasu} durationInFrames={d.Clue18Kowasu} fps={30} width={1920} height={1080} />
			<Composition id="Clue19Basshi" component={Clue19Basshi} durationInFrames={d.Clue19Basshi} fps={30} width={1920} height={1080} />
			<Composition id="Clue20Kanjo" component={Clue20Kanjo} durationInFrames={d.Clue20Kanjo} fps={30} width={1920} height={1080} />
			<Composition id="Clue21Jinko" component={Clue21Jinko} durationInFrames={d.Clue21Jinko} fps={30} width={1920} height={1080} />
			<Composition id="Clue22Kanrei" component={Clue22Kanrei} durationInFrames={d.Clue22Kanrei} fps={30} width={1920} height={1080} />
			<Composition id="Clue23Horobi" component={Clue23Horobi} durationInFrames={d.Clue23Horobi} fps={30} width={1920} height={1080} />
			<Composition id="Clue24Shometsu" component={Clue24Shometsu} durationInFrames={d.Clue24Shometsu} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
	</>
);
