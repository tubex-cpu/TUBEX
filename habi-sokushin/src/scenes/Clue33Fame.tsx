import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue33FameCaptions as c} from '../data/captions';

// 湯殿山の即身仏が広く知られたのは、明治以降？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue33Fame = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue33Fame" label="第33の手がかり" title="湯殿山の即身仏が広く知られたのは、明治以降？">
			<Beat name="生前に建てられた石碑" captions={c} from={0} to={1}>
				<Photo id="haguro-stone-snow" move="in" label="生前に建てられた石碑" />
			</Beat>
			<Beat name="神と仏を分ける政策" captions={c} from={2} to={3}>
				<Stage label="神と仏を分ける政策">
					<Flow steps={[{head: '明治維新'}, {head: '神仏分離', body: '湯殿山は神社に'}, {head: '寺', body: '祭りの立場を\n失う', hot: true}, {head: '即身仏を\n前面に'}]} />
				</Stage>
			</Beat>
			<Beat name="岩鼻通明氏の見方" captions={c} from={4} to={4}>
				<Photo id="haguro-shoreisai" move="in" label="岩鼻通明氏の見方" />
			</Beat>
			<Beat name="江戸時代からの開帳" captions={c} from={5} to={5}>
				<Photo id="shunsho-kaicho" move="in" label="江戸時代からの開帳" />
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
		</SceneFrame>
	);
};
