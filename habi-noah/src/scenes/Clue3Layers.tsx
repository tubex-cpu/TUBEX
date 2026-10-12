import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {CourtWithText} from '../components/CourtImage';
import {GavelVerdict} from '../components/GavelVerdict';
import {BlackSeaFill, CityFloodDates, FloodLayerDig, FloodRain} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {MesopotamiaMap, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue3LayersCaptions as c} from '../data/captions';
import {clue3LayersMouth as mouth} from '../data/mouth';
import {colors, minchoFamily} from '../theme';

// 第3の手がかり 洪水の地層
export const Clue3Layers = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Layers" mouth={mouth} expressions={{0: 'doubt', 10: 'stern', 20: 'closed', 26: 'think'}} hideAvatar={[[9, 9], [23, 25]]} label="第3の手がかり" title="大洪水の跡が見つかった？">
			<Beat name="ウル" captions={c} from={0} to={2}>
				<Photo id="ur-ziggurat" label="前回の舞台、シュメールの町ウル">
					<Visual label="前回の舞台、シュメールの町ウル">
						<MesopotamiaMap />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="泥の層" captions={c} from={3} to={5}>
				<Photo id="woolley-dig" label="王墓の下に、何もない層が">
					<Visual label="王墓の下に、何もない層が">
						<FloodLayerDig />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="大洪水の跡だ" captions={c} from={6} to={8}>
				<Visual label="「ついにノアの洪水の証拠が！」" labelColor={colors.goldSoft}>
					<FloodLayerDig />
				</Visual>
			</Beat>
			<Beat name="ハビの驚き" captions={c} from={9} to={9}>
				<CourtWithText shot="court-think">
					<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 100, color: colors.goldSoft, lineHeight: 1.3}}>
						ついに、
						<br />
						証拠が……？
					</div>
				</CourtWithText>
			</Beat>
			<Beat name="町ごとの層" captions={c} from={10} to={15}>
				<Visual label="ほかの町の“洪水”は、いつ起きた？">
					<CityFloodDates />
				</Visual>
			</Beat>
			<Beat name="ふたつの川" captions={c} from={16} to={19}>
				<Visual label="ふたつの川にはさまれた土地">
					<MesopotamiaMap />
				</Visual>
			</Beat>
			<Beat name="世界の終わり" captions={c} from={20} to={22}>
				<Visual label="ある町にとっては、世界の終わりだった">
					<FloodRain />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={23} to={25}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 23, 24, fps)} />
			</Beat>
			<Beat name="もっと大きな洪水" captions={c} from={26}>
				<Visual label="海がまるごと、あふれた？">
					<BlackSeaFill />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
