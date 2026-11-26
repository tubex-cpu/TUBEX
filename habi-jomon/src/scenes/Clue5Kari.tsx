import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5KariCaptions as c} from '../data/captions';

// 縄文人は、狩りで暮らしていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue5Kari = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Kari" label="第5の手がかり" title="縄文人は、狩りで暮らしていた？">
			<Beat name="弓矢でシカを追う？" captions={c} from={0} to={0}>
				<Photo id="c05-ichikawa-diorama" move="in" label="弓矢でシカを追う？" />
			</Beat>
			<Beat name="狩りだけ？" captions={c} from={1} to={1}>
				<Photo id="c05-shell-midden" move="up" label="狩りだけ？" />
			</Beat>
			<Beat name="木の実・魚・貝" captions={c} from={2} to={2}>
				<Photo id="c05-walnut" move="in" label="木の実・魚・貝" />
			</Beat>
			<Beat name="サケが中心の土地も" captions={c} from={3} to={3}>
				<Photo id="c05-salmon-river" move="right" label="サケが中心の土地も" />
			</Beat>
			<Beat name="土地ごとの組み合わせ" captions={c} from={4} to={4}>
				<Stage label="土地ごとの組み合わせ">
					<Cards cards={[{head: '森', body: 'ドングリ・クリ\nクルミ'}, {head: '川・海', body: 'サケ・貝\n海の獣'}, {head: '畑', body: '育てた植物', tone: 'gold'}]} tone='moss' size={46} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="獲物を追って移り住んだ？" captions={c} from={8}>
				<Photo id="c06-uenohara-mori" move="in" label="獲物を追って移り住んだ？" />
			</Beat>
		</SceneFrame>
	);
};
