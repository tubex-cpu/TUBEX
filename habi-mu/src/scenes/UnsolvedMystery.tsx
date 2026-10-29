import {Beat} from '../components/Beat';
import {BeforeEuropeans, IndusClaim, RomeTablets, ScriptInventions, UnderThirty, WhenCarved} from '../components/MuArt4';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// まだ解けていない謎（素材はすべてこの場面だけで使う）
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} voice="UnsolvedMystery" label="未決" title="まだ解けていない謎">
		<Beat name="ボクにも、まだ判決が出せ" captions={c} from={0} to={1}>
			<Photo id="rapanui-land-2" move="out" label="ボクにも、まだ判決が出せない謎" />
		</Beat>
		<Beat name="木の板に刻まれた記号" captions={c} from={2} to={4}>
			<Photo id="rongo-b" label="木の板に刻まれた記号" />
		</Beat>
		<Beat name="ロンゴロンゴ" captions={c} from={5} to={5}>
			<Photo id="rongo-c" label="ロンゴロンゴ" />
		</Beat>
		<Beat name="UnderThirty" captions={c} from={6} to={7}>
			<Visual label="30点未満、誰にも読めない">
				<UnderThirty />
			</Visual>
		</Beat>
		<Beat name="IndusClaim" captions={c} from={8} to={10}>
			<Visual label="インダス文字と、そっくり？">
				<IndusClaim />
			</Visual>
		</Beat>
		<Beat name="いつ生まれた？" captions={c} from={11} to={12}>
			<Photo id="rongo-staff" label="いつ生まれた？" />
		</Beat>
		<Beat name="RomeTablets" captions={c} from={13} to={14}>
			<Visual label="1枚だけ、古い木">
				<RomeTablets />
			</Visual>
		</Beat>
		<Beat name="BeforeEuropeans" captions={c} from={15} to={15}>
			<Visual label="ヨーロッパの船より前">
				<BeforeEuropeans />
			</Visual>
		</Beat>
		<Beat name="自分たちの力で、文字を？" captions={c} from={16} to={17}>
			<Photo id="rongo-aruku" label="自分たちの力で、文字を？" />
		</Beat>
		<Beat name="ScriptInventions" captions={c} from={18} to={19}>
			<Visual label="文字をゼロから生んだ場所">
				<ScriptInventions />
			</Visual>
		</Beat>
		<Beat name="WhenCarved" captions={c} from={20} to={20}>
			<Visual label="刻まれたのは、いつ？">
				<WhenCarved />
			</Visual>
		</Beat>
		<Beat name="新しい発見があったら、ま" captions={c} from={21}>
			<Photo id="tongariki-night" move="out" label="新しい発見があったら、また判決を" />
		</Beat>
	</SceneFrame>
);
