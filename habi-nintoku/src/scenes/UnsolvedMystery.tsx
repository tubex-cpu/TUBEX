import {Beat} from '../components/Beat';
import {DateGap, UnknownChamber} from '../components/NintokuArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// 後円部には誰が眠る？（素材はすべてこの場面だけで使う）
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} voice="UnsolvedMystery" label="未決" title="後円部には誰が眠る？">
		<Beat name="ボクにも、まだ判決が出せ" captions={c} from={0} to={1}>
			<Photo id="kisaragi-1" move="out" label="ボクにも、まだ判決が出せない謎" />
		</Beat>
		<Beat name="UnknownChamber" captions={c} from={2} to={3}>
			<Visual label="記録も、絵もない">
				<UnknownChamber />
			</Visual>
		</Beat>
		<Beat name="DateGap" captions={c} from={4} to={5}>
			<Visual label="年代の、ずれ">
				<DateGap />
			</Visual>
		</Beat>
		<Beat name="前方部に眠るのは？" captions={c} from={6} to={7}>
			<Photo id="helmet-met" label="前方部に眠るのは？" />
		</Beat>
		<Beat name="中を調べられない墓" captions={c} from={8} to={9}>
			<Photo id="gosashi" label="天皇陵の多くは、中を調べられていない" />
		</Beat>
		<Beat name="長い年月をかけて造った墓" captions={c} from={10} to={10}>
			<Photo id="moat-7" move="left" label="長い年月をかけて造った墓" />
		</Beat>
		<Beat name="新しい発見があったら、も" captions={c} from={11}>
			<Photo id="daisen-h5" label="新しい発見があったら、もう一度判決を" />
		</Beat>
	</SceneFrame>
);
