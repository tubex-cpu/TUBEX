import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Relations} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue12InnocentCaptions as c} from '../data/captions';

// 菅原道真は、無実の罪で大宰府に流された？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue12Innocent = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue12Innocent" label="第12の手がかり" title="菅原道真は、無実の罪で大宰府に流された？">
			<Beat name="901年1月" captions={c} from={0} to={0}>
				<Stage label="901年1月" labelBottom>
					<ReliefMap view='west' zoom={1.04} pins={[{at: P.kyoto, name: '京', t: 6}, {at: P.dazaifu, name: '大宰府', big: true, t: 50}]} lines={[{pts: [P.kyoto, P.dazaifu], t: 14, len: 50, arrow: true}]} />
				</Stage>
			</Beat>
			<Beat name="かけられた疑い" captions={c} from={1} to={2}>
				<Stage label="かけられた疑い">
					<Relations nodes={[{id: 'd', x: 960, y: 400, name: '醍醐天皇'}, {id: 't', x: 520, y: 700, name: '斉世親王', sub: '天皇の弟・道真の娘の夫'}, {id: 'm', x: 1400, y: 700, name: '菅原道真', hot: true}]} edges={[{a: 'm', b: 't', label: '天皇に立てようとした？', red: true, dash: true}, {a: 'd', b: 't', label: '兄弟'}]} />
				</Stage>
			</Beat>
			<Beat name="宇多上皇の願い" captions={c} from={3} to={3}>
				<Photo id="emperor-daigo" move="in" label="宇多上皇の願い" />
			</Beat>
			<Beat name="左大臣 藤原時平" captions={c} from={4} to={5}>
				<Photo id="tokihira-kunisada" move="in" label="左大臣 藤原時平" />
			</Beat>
			<Beat name="本当に無実だったのか" captions={c} from={6} to={7}>
				<Photo id="michizane-storm-drawing" move="in" label="本当に無実だったのか" />
			</Beat>
			<Beat name="大宰府で書いた詩" captions={c} from={8} to={8}>
				<Photo id="engi-exile" move="in" label="大宰府で書いた詩" />
			</Beat>
			<Beat name="名誉の回復" captions={c} from={9} to={10}>
				<Photo id="tofuro-stones" move="in" label="名誉の回復" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="追い落とした人々に" captions={c} from={14}>
				<Photo id="tofuro-onigawara" move="in" label="追い落とした人々に" />
			</Beat>
		</SceneFrame>
	);
};
