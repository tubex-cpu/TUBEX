import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2YudonoCaptions as c} from '../data/captions';

// 即身仏は、湯殿山の行者たちが生んだ？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue2Yudono = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Yudono" label="第2の手がかり" title="即身仏は、湯殿山の行者たちが生んだ？">
			<Beat name="出羽三山" captions={c} from={0} to={0}>
				<Photo id="yudono-gassan-view" move="in" label="出羽三山" />
			</Beat>
			<Beat name="大日如来の山" captions={c} from={1} to={1}>
				<Photo id="dainichi-met" move="in" label="大日如来の山" />
			</Beat>
			<Beat name="注連寺" captions={c} from={2} to={2}>
				<Photo id="churenji-hondo" move="in" label="注連寺" />
			</Beat>
			<Beat name="大日坊" captions={c} from={3} to={3}>
				<Photo id="dainichibo-honden" move="in" label="大日坊" />
			</Beat>
			<Beat name="新潟県長岡市 西生寺" captions={c} from={4} to={5}>
				<Photo id="saishoji" move="in" label="新潟県長岡市 西生寺" />
			</Beat>
			<Beat name="すべてが同じ流れ？" captions={c} from={6} to={6}>
				<Stage label="すべてが同じ流れ？">
					<Cards cards={[{head: '湯殿山の流れ', body: '本明海・真如海\n鉄門海 ほか'}, {head: 'ほかの流れ', body: '弘智法印・宥貞法印\n行人様 ほか', tone: 'gold'}]} tone='moss' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="湯殿山とは" captions={c} from={10}>
				<Photo id="yudono-torii" move="in" label="湯殿山とは" />
			</Beat>
		</SceneFrame>
	);
};
