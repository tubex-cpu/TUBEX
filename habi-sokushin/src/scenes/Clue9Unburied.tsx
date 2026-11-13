import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9UnburiedCaptions as c} from '../data/captions';

// 即身仏は、必ず土に埋められた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue9Unburied = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Unburied" label="第9の手がかり" title="即身仏は、必ず土に埋められた？">
			<Beat name="逆の願い" captions={c} from={0} to={1}>
				<Stage label="逆の願い">
					<Flow steps={[{head: '土に埋める', body: '3年後に\n掘り出す'}, {head: '埋めない', body: 'そのまま\n祀る', hot: true}, {head: '仏像の中', body: '遺体を\n納める'}]} />
				</Stage>
			</Beat>
			<Beat name="全海法師の遺言" captions={c} from={2} to={2}>
				<Photo id="ishiyamadera-dainichi" move="in" label="全海法師の遺言" />
			</Beat>
			<Beat name="弥勒菩薩を待つ" captions={c} from={3} to={3}>
				<Photo id="miroku-met" move="in" label="弥勒菩薩を待つ" />
			</Beat>
			<Beat name="茨城県桜川市 妙法寺" captions={c} from={4} to={4}>
				<Photo id="myohoji-sakuragawa-hondo" move="in" label="茨城県桜川市 妙法寺" />
			</Beat>
			<Beat name="狭い像の中" captions={c} from={5} to={6}>
				<Photo id="haguro-pagoda-snow" move="in" label="狭い像の中" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="一人一人の即身仏へ" captions={c} from={10}>
				<Photo id="tsuruoka-akagawa" move="in" label="一人一人の即身仏へ" />
			</Beat>
		</SceneFrame>
	);
};
