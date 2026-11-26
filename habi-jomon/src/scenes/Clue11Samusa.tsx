import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue11SamusaCaptions as c} from '../data/captions';

// 縄文人は、寒さに強い体だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue11Samusa = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue11Samusa" label="第11の手がかり" title="縄文人は、寒さに強い体だった？">
			<Beat name="2026年8月 東京大学など" captions={c} from={0} to={0}>
				<Photo id="c11-yasuda" move="in" label="2026年8月 東京大学など" />
			</Beat>
			<Beat name="選び抜かれた跡" captions={c} from={1} to={1}>
				<Photo id="c11-dna-cpk" move="in" label="選び抜かれた跡" />
			</Beat>
			<Beat name="三つの遺伝子" captions={c} from={2} to={2}>
				<Stage label="三つの遺伝子">
					<Cards cards={[{head: '脂肪', body: 'たくわえ\nやすく'}, {head: '熱', body: '体の中で\nつくる'}, {head: '冷たさ', body: '感じる\n働き'}]} tone='night' size={48} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="氷河期を生き延びる？" captions={c} from={3} to={3}>
				<Photo id="c11-lab" move="in" label="氷河期を生き延びる？" />
			</Beat>
			<Beat name="いつ身につけた？" captions={c} from={4} to={4}>
				<Stage label="いつ身につけた？">
					<TimeBar stops={[{label: '氷河期', sub: '祖先が身につける', accent: true}, {label: '1万6000年前', sub: '縄文の始まり'}]} tone='sea' />
				</Stage>
			</Beat>
			<Beat name="読み解きの難しさ" captions={c} from={5} to={5}>
				<Photo id="c11-dna-purification" move="in" label="読み解きの難しさ" />
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="大きな災害" captions={c} from={9}>
				<Photo id="c12-iojima-aerial" move="in" label="大きな災害" />
			</Beat>
		</SceneFrame>
	);
};
