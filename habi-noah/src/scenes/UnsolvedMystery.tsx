import {Beat} from '../components/Beat';
import {BoatFormation, DrillRig, LabWaiting} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {ScaleBalance, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';
import {unsolvedMysteryMouth as mouth} from '../data/mouth';
import {colors} from '../theme';

// まだ解けていない謎
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} voice="UnsolvedMystery" mouth={mouth} expressions={{0: 'think', 3: 'doubt', 6: 'stern'}} label="未決" title="ドリルを折った層の正体は？">
		<Beat name="判決を出せない謎" captions={c} from={0} to={0}>
			<Visual label="ボクにも、まだ判決が出せない">
				<ScaleBalance undecided />
			</Visual>
		</Beat>
		<Beat name="あの地形" captions={c} from={1} to={2}>
			<Photo id="durupinar" label="この冬、答えが出る">
				<Visual label="この冬、答えが出る">
					<BoatFormation />
				</Visual>
			</Photo>
		</Beat>
		<Beat name="硬い層" captions={c} from={3} to={4}>
			<Visual label="石になった木？　ただの岩？" labelColor={colors.goldSoft}>
				<DrillRig />
			</Visual>
		</Beat>
		<Beat name="結果待ち" captions={c} from={5}>
			<Visual label="結果が出たら、もう一度判決を">
				<LabWaiting />
			</Visual>
		</Beat>
	</SceneFrame>
);
