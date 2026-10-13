import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {BlackSeaFill, DeepShipwreck, DistanceMap, LakeRiseDebate} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue4BlackSeaCaptions as c} from '../data/captions';

// 第4の手がかり 黒海大洪水（素材はすべてこの場面だけで使う）
export const Clue4BlackSea = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4BlackSea" label="第4の手がかり" title="海がまるごとあふれた？">
			<Beat name="黒海" captions={c} from={0} to={0}>
				<Photo id="black-sea" label="トルコの北に広がる黒海" />
			</Beat>
			<Beat name="海峡" captions={c} from={1} to={1}>
				<Photo id="bosphorus" move="out" label="細い海峡で、地中海とつながる" />
			</Beat>
			<Beat name="湖だった" captions={c} from={2} to={4}>
				<Visual label="黒海は、かつて海ではなかった？">
					<BlackSeaFill />
				</Visual>
			</Beat>
			<Beat name="ナイアガラ" captions={c} from={5} to={5}>
				<Photo id="niagara" move="right" label="この滝の、何百倍もの勢い？" />
			</Beat>
			<Beat name="逃げた人々" captions={c} from={6} to={7}>
				<Photo id="sinop" move="left" label="湖のまわりの人々は、どうなった？" />
			</Beat>
			<Beat name="海底の証拠" captions={c} from={8} to={8}>
				<Photo id="sinop-space" label="海の底に、昔の岸辺の跡" />
			</Beat>
			<Beat name="バラード" captions={c} from={9} to={10}>
				<Photo id="ballard" move="out" label="タイタニック号を見つけた探検家も" />
			</Beat>
			<Beat name="スピード" captions={c} from={11} to={14}>
				<Visual label="一気に？　それとも、ゆっくり？">
					<LakeRiseDebate />
				</Visual>
			</Beat>
			<Beat name="深い海の底" captions={c} from={15} to={16}>
				<Visual label="酸素のない海の底に、眠っていたもの">
					<DeepShipwreck />
				</Visual>
			</Beat>
			<Beat name="古代の商船" captions={c} from={17} to={18}>
				<Photo id="kyrenia" move="right" label="参考：同じ時代のギリシャ商船（キレニア船）" />
			</Beat>
			<Beat name="1000キロ" captions={c} from={19} to={20}>
				<Visual label="黒海とメソポタミアは、つながるのか？">
					<DistanceMap />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={21} to={23}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 21, 22, fps)} />
			</Beat>
			<Beat name="そのまま信じたら" captions={c} from={24}>
				<Photo id="savery-thanks" move="left" label="聖書をそのまま信じたら、どうなる？" />
			</Beat>
		</SceneFrame>
	);
};
