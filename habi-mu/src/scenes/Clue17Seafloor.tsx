import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {GavelVerdict} from '../components/GavelVerdict';
import {CoralOnTop, CrustSection, EchoSounder, GraniteMu, GuyotStory, NoSunkenCrust, RingOfFire, SunkenIslands, WoodAndStone} from '../components/MuArt4';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue17SeafloorCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 太平洋の海の底に、大陸が沈んでいる？（素材はすべてこの場面だけで使う）
export const Clue17Seafloor = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue17Seafloor" label="第17の手がかり" title="太平洋の海の底に、大陸が沈んでいる？">
			<Beat name="GraniteMu" captions={c} from={0} to={2}>
				<Visual>
					<GraniteMu />
				</Visual>
			</Beat>
			<Beat name="大きな手がかり" captions={c} from={3} to={3}>
				<Photo id="granite" label="大きな手がかり" />
			</Beat>
			<Beat name="CrustSection" captions={c} from={4} to={7}>
				<Visual label="大陸の岩、海の底の岩">
					<CrustSection />
				</Visual>
			</Beat>
			<Beat name="WoodAndStone" captions={c} from={8} to={11}>
				<Visual label="木は浮き、石は沈む">
					<WoodAndStone />
				</Visual>
			</Beat>
			<Beat name="太平洋の海底は、玄武岩" captions={c} from={12} to={12}>
				<Photo id="pillow-basalt" label="太平洋の海底は、玄武岩" />
			</Beat>
			<Beat name="NoSunkenCrust" captions={c} from={13} to={13}>
				<Visual>
					<NoSunkenCrust />
				</Visual>
			</Beat>
			<Beat name="沈んだ島は、本当にある" captions={c} from={14} to={16}>
				<Photo id="guyot-map" label="沈んだ島は、本当にある" />
			</Beat>
			<Beat name="EchoSounder" captions={c} from={17} to={20}>
				<Visual label="音で深さを測る">
					<EchoSounder />
				</Visual>
			</Beat>
			<Beat name="ギヨー" captions={c} from={21} to={21}>
				<Photo id="guyot-map-2" label="ギヨー" />
			</Beat>
			<Beat name="GuyotStory" captions={c} from={22} to={24}>
				<Visual label="なぜ平らなのか">
					<GuyotStory />
				</Visual>
			</Beat>
			<Beat name="CoralOnTop" captions={c} from={25} to={26}>
				<Visual>
					<CoralOnTop />
				</Visual>
			</Beat>
			<Beat name="SunkenIslands" captions={c} from={27} to={28}>
				<Visual label="沈んだ島は、本当にある">
					<SunkenIslands />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={29} to={31}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 29, 30, fps)} />
			</Beat>
			<Beat name="RingOfFire" captions={c} from={32}>
				<Stage label="日本は？" labelBottom>
					<RingOfFire />
				</Stage>
			</Beat>
		</SceneFrame>
	);
};
