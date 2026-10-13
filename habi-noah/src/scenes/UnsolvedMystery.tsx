import {Beat} from '../components/Beat';
import {LabWaiting} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {ScaleBalance, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';
import {colors} from '../theme';

// まだ解けていない謎
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} voice="UnsolvedMystery" label="未決" title="ドリルを折った層の正体は？">
		<Beat name="あの地形" captions={c} from={0} to={1}>
			<Photo id="durupinar-4" move="out" label="ボクにも、まだ判決が出せない謎" />
		</Beat>
		<Beat name="研究室" captions={c} from={2} to={2}>
			<Photo id="c14-lab" label="この冬、研究室で答えが出る" />
		</Beat>
		<Beat name="硬い層" captions={c} from={3} to={4}>
			<Visual label="石になった木？　ただの岩？" labelColor={colors.goldSoft}>
				<ScaleBalance undecided />
			</Visual>
		</Beat>
		<Beat name="結果待ち" captions={c} from={5}>
			<Visual label="結果が出たら、もう一度判決を">
				<LabWaiting />
			</Visual>
		</Beat>
	</SceneFrame>
);
