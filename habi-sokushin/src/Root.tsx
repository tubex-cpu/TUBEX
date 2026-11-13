import {AbsoluteFill, Composition, Folder} from 'remotion';
import {HabiSokushinVideo} from './HabiSokushinVideo';
import {sceneDurations as d, TOTAL_FRAMES} from './data/timeline';
import {Closing} from './scenes/Closing';
import {Clue10Honmyokai} from './scenes/Clue10Honmyokai';
import {Clue11Shinnyokai} from './scenes/Clue11Shinnyokai';
import {Clue12Eye} from './scenes/Clue12Eye';
import {Clue13Tetsumonkai} from './scenes/Clue13Tetsumonkai';
import {Clue14Ikeda} from './scenes/Clue14Ikeda';
import {Clue15Tetsuryukai} from './scenes/Clue15Tetsuryukai';
import {Clue16Chukai} from './scenes/Clue16Chukai';
import {Clue17Enmyokai} from './scenes/Clue17Enmyokai';
import {Clue18Fly} from './scenes/Clue18Fly';
import {Clue19Processed} from './scenes/Clue19Processed';
import {Clue1Count} from './scenes/Clue1Count';
import {Clue20Kouchi} from './scenes/Clue20Kouchi';
import {Clue21Yutei} from './scenes/Clue21Yutei';
import {Clue22Fingerprint} from './scenes/Clue22Fingerprint';
import {Clue23Meiji} from './scenes/Clue23Meiji';
import {Clue24Bukkai} from './scenes/Clue24Bukkai';
import {Clue25Excavation} from './scenes/Clue25Excavation';
import {Clue26Dochu} from './scenes/Clue26Dochu';
import {Clue27Shitou} from './scenes/Clue27Shitou';
import {Clue28Zhanggong} from './scenes/Clue28Zhanggong';
import {Clue29Thailand} from './scenes/Clue29Thailand';
import {Clue2Yudono} from './scenes/Clue2Yudono';
import {Clue30Lost} from './scenes/Clue30Lost';
import {Clue31Myokai} from './scenes/Clue31Myokai';
import {Clue32Koromo} from './scenes/Clue32Koromo';
import {Clue33Fame} from './scenes/Clue33Fame';
import {Clue3Goshintai} from './scenes/Clue3Goshintai';
import {Clue4Haguro} from './scenes/Clue4Haguro';
import {Clue5Gyonin} from './scenes/Clue5Gyonin';
import {Clue6Mokujiki} from './scenes/Clue6Mokujiki';
import {Clue7Urushi} from './scenes/Clue7Urushi';
import {Clue8Kane} from './scenes/Clue8Kane';
import {Clue9Unburied} from './scenes/Clue9Unburied';
import {Intro} from './scenes/Intro';
import {JudgeEntrance} from './scenes/JudgeEntrance';
import {RootsStory} from './scenes/RootsStory';
import {Summary} from './scenes/Summary';
import {UnsolvedMystery} from './scenes/UnsolvedMystery';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiSokushin720 = () => (
	<AbsoluteFill style={{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
		<HabiSokushinVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiSokushin" component={HabiSokushinVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
		<Composition id="HabiSokushin720" component={HabiSokushin720} durationInFrames={TOTAL_FRAMES} fps={30} width={1280} height={720} />
		<Folder name="Scenes">
			<Composition id="Intro" component={Intro} durationInFrames={d.Intro} fps={30} width={1920} height={1080} />
			<Composition id="JudgeEntrance" component={JudgeEntrance} durationInFrames={d.JudgeEntrance} fps={30} width={1920} height={1080} />
			<Composition id="Clue1Count" component={Clue1Count} durationInFrames={d.Clue1Count} fps={30} width={1920} height={1080} />
			<Composition id="Clue2Yudono" component={Clue2Yudono} durationInFrames={d.Clue2Yudono} fps={30} width={1920} height={1080} />
			<Composition id="Clue3Goshintai" component={Clue3Goshintai} durationInFrames={d.Clue3Goshintai} fps={30} width={1920} height={1080} />
			<Composition id="Clue4Haguro" component={Clue4Haguro} durationInFrames={d.Clue4Haguro} fps={30} width={1920} height={1080} />
			<Composition id="Clue5Gyonin" component={Clue5Gyonin} durationInFrames={d.Clue5Gyonin} fps={30} width={1920} height={1080} />
			<Composition id="Clue6Mokujiki" component={Clue6Mokujiki} durationInFrames={d.Clue6Mokujiki} fps={30} width={1920} height={1080} />
			<Composition id="Clue7Urushi" component={Clue7Urushi} durationInFrames={d.Clue7Urushi} fps={30} width={1920} height={1080} />
			<Composition id="Clue8Kane" component={Clue8Kane} durationInFrames={d.Clue8Kane} fps={30} width={1920} height={1080} />
			<Composition id="Clue9Unburied" component={Clue9Unburied} durationInFrames={d.Clue9Unburied} fps={30} width={1920} height={1080} />
			<Composition id="Clue10Honmyokai" component={Clue10Honmyokai} durationInFrames={d.Clue10Honmyokai} fps={30} width={1920} height={1080} />
			<Composition id="Clue11Shinnyokai" component={Clue11Shinnyokai} durationInFrames={d.Clue11Shinnyokai} fps={30} width={1920} height={1080} />
			<Composition id="Clue12Eye" component={Clue12Eye} durationInFrames={d.Clue12Eye} fps={30} width={1920} height={1080} />
			<Composition id="Clue13Tetsumonkai" component={Clue13Tetsumonkai} durationInFrames={d.Clue13Tetsumonkai} fps={30} width={1920} height={1080} />
			<Composition id="Clue14Ikeda" component={Clue14Ikeda} durationInFrames={d.Clue14Ikeda} fps={30} width={1920} height={1080} />
			<Composition id="Clue15Tetsuryukai" component={Clue15Tetsuryukai} durationInFrames={d.Clue15Tetsuryukai} fps={30} width={1920} height={1080} />
			<Composition id="Clue16Chukai" component={Clue16Chukai} durationInFrames={d.Clue16Chukai} fps={30} width={1920} height={1080} />
			<Composition id="Clue17Enmyokai" component={Clue17Enmyokai} durationInFrames={d.Clue17Enmyokai} fps={30} width={1920} height={1080} />
			<Composition id="Clue18Fly" component={Clue18Fly} durationInFrames={d.Clue18Fly} fps={30} width={1920} height={1080} />
			<Composition id="Clue19Processed" component={Clue19Processed} durationInFrames={d.Clue19Processed} fps={30} width={1920} height={1080} />
			<Composition id="Clue20Kouchi" component={Clue20Kouchi} durationInFrames={d.Clue20Kouchi} fps={30} width={1920} height={1080} />
			<Composition id="Clue21Yutei" component={Clue21Yutei} durationInFrames={d.Clue21Yutei} fps={30} width={1920} height={1080} />
			<Composition id="Clue22Fingerprint" component={Clue22Fingerprint} durationInFrames={d.Clue22Fingerprint} fps={30} width={1920} height={1080} />
			<Composition id="Clue23Meiji" component={Clue23Meiji} durationInFrames={d.Clue23Meiji} fps={30} width={1920} height={1080} />
			<Composition id="Clue24Bukkai" component={Clue24Bukkai} durationInFrames={d.Clue24Bukkai} fps={30} width={1920} height={1080} />
			<Composition id="Clue25Excavation" component={Clue25Excavation} durationInFrames={d.Clue25Excavation} fps={30} width={1920} height={1080} />
			<Composition id="Clue26Dochu" component={Clue26Dochu} durationInFrames={d.Clue26Dochu} fps={30} width={1920} height={1080} />
			<Composition id="Clue27Shitou" component={Clue27Shitou} durationInFrames={d.Clue27Shitou} fps={30} width={1920} height={1080} />
			<Composition id="Clue28Zhanggong" component={Clue28Zhanggong} durationInFrames={d.Clue28Zhanggong} fps={30} width={1920} height={1080} />
			<Composition id="Clue29Thailand" component={Clue29Thailand} durationInFrames={d.Clue29Thailand} fps={30} width={1920} height={1080} />
			<Composition id="Clue30Lost" component={Clue30Lost} durationInFrames={d.Clue30Lost} fps={30} width={1920} height={1080} />
			<Composition id="Clue31Myokai" component={Clue31Myokai} durationInFrames={d.Clue31Myokai} fps={30} width={1920} height={1080} />
			<Composition id="Clue32Koromo" component={Clue32Koromo} durationInFrames={d.Clue32Koromo} fps={30} width={1920} height={1080} />
			<Composition id="Clue33Fame" component={Clue33Fame} durationInFrames={d.Clue33Fame} fps={30} width={1920} height={1080} />
			<Composition id="RootsStory" component={RootsStory} durationInFrames={d.RootsStory} fps={30} width={1920} height={1080} />
			<Composition id="UnsolvedMystery" component={UnsolvedMystery} durationInFrames={d.UnsolvedMystery} fps={30} width={1920} height={1080} />
			<Composition id="Summary" component={Summary} durationInFrames={d.Summary} fps={30} width={1920} height={1080} />
			<Composition id="Closing" component={Closing} durationInFrames={d.Closing} fps={30} width={1920} height={1080} />
		</Folder>
	</>
);
