import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {BothRewrite, DistanceCounter, FiftyPins, GlyphSwap, LiRuler, RadialReading, RecordCrack, RouteNorth, RouteToPacific, SealTeaser, SouthToEast, TwoRoads, YamatoNames} from '../components/YamataiArt1';
import {clue2RouteCaptions as c} from '../data/captions';

// 第2の手がかり 魏志倭人伝の道のり（素材はすべてこの場面だけで使う）
export const Clue2Route = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Route" label="第2の手がかり" title="記録の道のりをたどると？">
			<Beat name="帯方郡から" captions={c} from={0} to={1}>
				<Visual label="海を渡り、九州の北の岸へ">
					<RouteNorth />
				</Visual>
			</Beat>
			<Beat name="壱岐" captions={c} from={2} to={2}>
				<Photo id="iki" label="ここまでは、今の地図と合う" />
			</Beat>
			<Beat name="唐津" captions={c} from={3} to={3}>
				<Photo id="karatsu" move="left" label="末盧国、伊都国、奴国" />
			</Beat>
			<Beat name="1万2000里" captions={c} from={4} to={5}>
				<Visual label="女王の国まで、どれだけ遠い？">
					<DistanceCounter />
				</Visual>
			</Beat>
			<Beat name="里の長さ" captions={c} from={6} to={7}>
				<Visual label="1里の長さが、合わない？">
					<LiRuler />
				</Visual>
			</Beat>
			<Beat name="南へ" captions={c} from={8} to={11}>
				<Visual label="書かれたとおりに進むと……">
					<RouteToPacific />
				</Visual>
			</Beat>
			<Beat name="記録のまちがい" captions={c} from={12} to={13}>
				<Visual label="記録のどこかが、おかしい？">
					<RecordCrack />
				</Visual>
			</Beat>
			<Beat name="新井白石" captions={c} from={14} to={15}>
				<Photo id="arai" label="新井白石は、考えを変えた？" />
			</Beat>
			<Beat name="本居宣長" captions={c} from={16} to={16}>
				<Photo id="motoori" label="本居宣長の、大胆な推理" />
			</Beat>
			<Beat name="ふたつの道" captions={c} from={17} to={17}>
				<Visual label="研究者の道は、ふたつに分かれた">
					<TwoRoads />
				</Visual>
			</Beat>
			<Beat name="畿内説" captions={c} from={18} to={19}>
				<Visual label="「南」は「東」のまちがい？">
					<SouthToEast />
				</Visual>
			</Beat>
			<Beat name="九州説" captions={c} from={20} to={22}>
				<Visual label="一本道ではなく、放射状？">
					<RadialReading />
				</Visual>
			</Beat>
			<Beat name="どちらも読みかえ" captions={c} from={23} to={23}>
				<Visual label="どちらにも、弱点がある？">
					<BothRewrite />
				</Visual>
			</Beat>
			<Beat name="台と壹" captions={c} from={24} to={26}>
				<Visual label="国の名前が、ちがう？">
					<GlyphSwap />
				</Visual>
			</Beat>
			<Beat name="やまと" captions={c} from={27} to={29}>
				<Visual label="「やまと」は、ふたつある？">
					<YamatoNames />
				</Visual>
			</Beat>
			<Beat name="50か所" captions={c} from={30} to={32}>
				<Visual label="候補地は、どこまで増えた？">
					<FiftyPins />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={33} to={35}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 33, 34, fps)} />
			</Beat>
			<Beat name="金の印" captions={c} from={36}>
				<Visual label="道のりではなく、モノで決められる？">
					<SealTeaser />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
