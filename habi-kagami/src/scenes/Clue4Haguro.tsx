import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {Relations, Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4HaguroCaptions as c} from '../data/captions';

// 湯殿山と羽黒山は、争っていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue4Haguro = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Haguro" label="第4の手がかり" title="湯殿山と羽黒山は、争っていた？">
			<Beat name="羽黒山" captions={c} from={0} to={0}>
				<Photo id="haguro-pagoda" move="in" label="羽黒山" />
			</Beat>
			<Beat name="江戸・寛永寺" captions={c} from={1} to={1}>
				<Photo id="kaneiji-map" move="in" label="江戸・寛永寺" />
			</Beat>
			<Beat name="1630年" captions={c} from={2} to={2}>
				<Stage label="1630年">
					<Relations heads={[{x: 520, text: '天台宗'}, {x: 1400, text: '真言宗', red: true}]} nodes={[{id: 'h', x: 520, y: 560, name: '羽黒山', sub: '別当 天宥'}, {id: 'k', x: 520, y: 760, name: '寛永寺', sub: '江戸'}, {id: 'y', x: 1400, y: 660, name: '湯殿山の4か寺', sub: '注連寺・大日坊 ほか', hot: true}]} edges={[{a: 'h', b: 'k', label: '末寺に'}, {a: 'h', b: 'y', label: '争い', red: true}]} />
				</Stage>
			</Beat>
			<Beat name="幕府の裁き" captions={c} from={3} to={3}>
				<Stage label="幕府の裁き">
					<TimeBar stops={[{label: '1630年', sub: '争いの始まり'}, {label: '1639年', sub: '湯殿山が勝訴', accent: true}, {label: '1666年', sub: '湯殿山が勝訴', accent: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="湯殿山が出した文書" captions={c} from={4} to={5}>
				<Stage label="湯殿山が出した文書">
					<Scroll text={'一世行人の\n海の字は\n空海に由来する'} source='湯殿山側が訴訟で出した文書（要約）' />
				</Stage>
			</Beat>
			<Beat name="争いと即身仏" captions={c} from={6} to={6}>
				<Photo id="haguro-sanjin" move="in" label="争いと即身仏" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="即身仏を目指した人々" captions={c} from={10}>
				<Photo id="haguro-yamabushi" move="in" label="即身仏を目指した人々" />
			</Beat>
		</SceneFrame>
	);
};
