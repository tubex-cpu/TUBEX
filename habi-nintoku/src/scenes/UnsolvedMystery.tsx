import {Beat} from '../components/Beat';
import {DateGap, UnknownChamber} from '../components/NintokuArt2';
import {SameOrNot, WhichTomb} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// まだ解けていない謎（素材はすべてこの場面だけで使う）
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} voice="UnsolvedMystery" label="未決" title="まだ解けていない謎">
		<Beat name="ボクにも、まだ判決が出せ" captions={c} from={0} to={1}>
			<Photo id="magodayu-3" move="out" label="ボクにも、まだ判決が出せない謎" />
		</Beat>
		<Beat name="UnknownChamber" captions={c} from={2} to={3}>
			<Visual label="記録も、絵もない">
				<UnknownChamber />
			</Visual>
		</Beat>
		<Beat name="DateGap" captions={c} from={4} to={7}>
			<Visual label="年代の、ずれ">
				<DateGap />
			</Visual>
		</Beat>
		<Beat name="天皇陵の多くは、中を調べ" captions={c} from={8} to={9}>
			<Photo id="osamezuka-4" label="天皇陵の多くは、中を調べられていない" />
		</Beat>
		<Beat name="長い年月をかけて造った墓" captions={c} from={10} to={11}>
			<Photo id="omotezuka-moat-2" move="left" label="長い年月をかけて造った墓" />
		</Beat>
		<Beat name="SameOrNot" captions={c} from={12} to={14}>
			<Visual label="土壇の下には？">
				<SameOrNot />
			</Visual>
		</Beat>
		<Beat name="WhichTomb" captions={c} from={15} to={17}>
			<Visual label="ボストンの宝は、どこから？">
				<WhichTomb />
			</Visual>
		</Beat>
		<Beat name="新しい発見があったら、も" captions={c} from={18}>
			<Photo id="kusunoki-2" label="新しい発見があったら、もう一度判決を" />
		</Beat>
	</SceneFrame>
);
