import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {BuriedSeal, DigContinues} from '../components/YamataiArt2';
import {unsolvedMysteryCaptions as c} from '../data/captions';
import {colors} from '../theme';

// まだ解けていない謎
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} voice="UnsolvedMystery" label="未決" title="新しい溝と、消えた金印">
		<Beat name="残った謎" captions={c} from={0} to={1}>
			<Photo id="yoshinogari-2017" move="out" label="ボクにも、まだ判決が出せない謎" />
		</Beat>
		<Beat name="新しい溝" captions={c} from={2} to={2}>
			<Visual label="新しい溝の中に、何が眠る？" labelColor={colors.goldSoft}>
				<DigContinues />
			</Visual>
		</Beat>
		<Beat name="親魏倭王の金印" captions={c} from={3} to={4}>
			<Photo id="nara-basin2" label="卑弥呼の金印は、どこに？" />
		</Beat>
		<Beat name="土の中" captions={c} from={5} to={5}>
			<Visual label="今この瞬間も、土の中に？">
				<BuriedSeal />
			</Visual>
		</Beat>
		<Beat name="また判決を" captions={c} from={6}>
			<Photo id="toro2" move="right" label="新しい発見があったら、もう一度判決を" />
		</Beat>
	</SceneFrame>
);
