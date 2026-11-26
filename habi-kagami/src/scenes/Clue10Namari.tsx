import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue10NamariCaptions as c} from '../data/captions';

// 鉛の成分を調べれば、作った場所が分かる？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue10Namari = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Namari" label="第10の手がかり" title="鉛の成分を調べれば、作った場所が分かる？">
			<Beat name="青銅の中の鉛" captions={c} from={0} to={0}>
				<Photo id="c10-galena2" move="in" label="青銅の中の鉛" />
			</Beat>
			<Beat name="大型放射光施設 SPring-8" captions={c} from={1} to={1}>
				<Photo id="c10-spring8-bldg" move="in" label="大型放射光施設 SPring-8" />
			</Beat>
			<Beat name="分析の結果は" captions={c} from={2} to={2}>
				<Photo id="c10-spring8-hall" move="in" label="分析の結果は" />
			</Beat>
			<Beat name="原料の産地と、作った場所" captions={c} from={3} to={4}>
				<Stage label="原料の産地と、作った場所">
					<Flow steps={[{head: '原料', body: '中国の鉱山？'}, {head: '運ぶ', body: '海を渡る'}, {head: '鋳込む', body: 'どこで？', hot: true}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="形を比べれば？" captions={c} from={8}>
				<Photo id="c11-kashihara" move="in" label="形を比べれば？" />
			</Beat>
		</SceneFrame>
	);
};
