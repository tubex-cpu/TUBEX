import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue15EmakiCaptions as c} from '../data/captions';

// 北野天神縁起絵巻には、地獄で苦しむ醍醐天皇が描かれている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue15Emaki = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue15Emaki" label="第15の手がかり" title="北野天神縁起絵巻には、地獄で苦しむ醍醐天皇が描かれている？">
			<Beat name="北野天神縁起絵巻" captions={c} from={0} to={0}>
				<Photo id="engi-sf" move="in" label="北野天神縁起絵巻" />
			</Beat>
			<Beat name="承久本 1219年" captions={c} from={1} to={1}>
				<Photo id="engi-scroll2-a" move="in" label="承久本 1219年" />
			</Beat>
			<Beat name="2026年春 史上初の全巻公開" captions={c} from={2} to={2}>
				<Photo id="engi-scroll2-b" move="in" label="2026年春 史上初の全巻公開" />
			</Beat>
			<Beat name="第5巻 清涼殿の場面" captions={c} from={3} to={3}>
				<Photo id="engi-met-palace" move="in" label="第5巻 清涼殿の場面" />
			</Beat>
			<Beat name="雷をにらむ時平" captions={c} from={4} to={5}>
				<Photo id="raijin-statue" move="in" label="雷をにらむ時平" />
			</Beat>
			<Beat name="第7巻・第8巻 地獄めぐり" captions={c} from={6} to={7}>
				<Photo id="engi-hell" move="in" label="第7巻・第8巻 地獄めぐり" />
			</Beat>
			<Beat name="地獄の醍醐天皇は？" captions={c} from={8} to={8}>
				<Photo id="engi-kamo-river" move="in" label="地獄の醍醐天皇は？" />
			</Beat>
			<Beat name="なぜ未完成？" captions={c} from={9} to={11}>
				<Stage label="なぜ未完成？">
					<Cards cards={[{head: '最後の2巻', body: '場面の説明文が\nない'}, {head: '地獄の醍醐天皇', body: '描かれていない', tone: 'red'}]} tone='ink' size={48} height={330} top={370} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="どうして学問の神に？" captions={c} from={15}>
				<Photo id="tenjin-sesshu-kitano" move="in" label="どうして学問の神に？" />
			</Beat>
		</SceneFrame>
	);
};
