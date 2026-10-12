import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {ArkBuilding, BlackSeaFill, FloodRain, UrartuMap} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue4BlackSeaCaptions as c} from '../data/captions';
import {clue4BlackSeaMouth as mouth} from '../data/mouth';
import {colors} from '../theme';

// 第4の手がかり 黒海大洪水
export const Clue4BlackSea = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4BlackSea" mouth={mouth} expressions={{0: 'think', 8: 'doubt', 10: 'stern', 18: 'think'}} hideAvatar={[[15, 17]]} label="第4の手がかり" title="海がまるごとあふれた？">
			<Beat name="黒海" captions={c} from={0} to={1}>
				<Photo id="black-sea" label="トルコの北に広がる黒海">
					<Visual label="トルコの北に広がる黒海">
						<UrartuMap />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="湖だった" captions={c} from={2} to={3}>
				<Visual label="黒海は、かつて海ではなかった？">
					<BlackSeaFill />
				</Visual>
			</Beat>
			<Beat name="なだれこむ" captions={c} from={4} to={7}>
				<Visual label="ナイアガラの何百倍の水が、湖へ？" labelColor={colors.goldSoft}>
					<BlackSeaFill />
				</Visual>
			</Beat>
			<Beat name="海底の証拠" captions={c} from={8} to={9}>
				<Photo id="black-sea" move="out" label="海の底に、昔の岸辺の跡">
					<Visual label="海の底に、昔の岸辺の跡">
						<BlackSeaFill />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="スピード" captions={c} from={10} to={14}>
				<Visual label="一気に？　それとも、ゆっくり？">
					<FloodRain />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={15} to={17}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 15, 16, fps)} />
			</Beat>
			<Beat name="そのまま信じたら" captions={c} from={18}>
				<Photo id="ark-encounter" label="聖書をそのまま信じたら、どうなる？">
					<Visual label="聖書をそのまま信じたら、どうなる？">
						<ArkBuilding />
					</Visual>
				</Photo>
			</Beat>
		</SceneFrame>
	);
};
