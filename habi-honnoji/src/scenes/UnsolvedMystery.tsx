import {Beat} from '../components/Beat';
import {AshesSearch, LegendMap} from '../components/HonnojiArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// 信長の遺体はどこへ？（素材はすべてこの場面だけで使う）
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} voice="UnsolvedMystery" label="未決" title="信長の遺体はどこへ？">
		<Beat name="ボクにも、まだ判決が出せ" captions={c} from={0} to={1}>
			<Photo id="honnoji-nobukazu" move="out" label="ボクにも、まだ判決が出せない謎" />
		</Beat>
		<Beat name="AshesSearch" captions={c} from={2} to={3}>
			<Visual label="焼け跡から、見つからない">
				<AshesSearch />
			</Visual>
		</Beat>
		<Beat name="LegendMap" captions={c} from={4} to={5}>
			<Visual label="遺骨を運んだという言い伝え">
				<LegendMap />
			</Visual>
		</Beat>
		<Beat name="静岡に伝わる「首塚」" captions={c} from={6} to={7}>
			<Photo id="nishiyama-kubizuka" label="静岡に伝わる「首塚」" />
		</Beat>
		<Beat name="新しい発見があったら、も" captions={c} from={8}>
			<Photo id="honnoji-site" label="新しい発見があったら、もう一度判決を" />
		</Beat>
	</SceneFrame>
);
