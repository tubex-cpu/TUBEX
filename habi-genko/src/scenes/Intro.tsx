import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Armada, ArrowNock, DiceAndCards, InkBoard, MudSection, SeabedDescent, ShipLength, StormSeason, TechReveal, YearRewind} from '../components/GenkoArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// 謎の先出し（素材はすべてこの場面だけで使う）
export const Intro = () => (
	<SceneFrame captions={c} voice="Intro">
		<Beat name="750年前" captions={c} from={0} to={0}>
			<Stage>
				<YearRewind />
			</Stage>
		</Beat>
		<Beat name="大帝国" captions={c} from={1} to={1}>
			<Photo id="map-mongol-1-w" move="in" label="海の向こうの、大帝国" />
		</Beat>
		<Beat name="大艦隊" captions={c} from={2} to={2}>
			<Stage>
				<Armada />
			</Stage>
		</Beat>
		<Beat name="一夜の嵐" captions={c} from={3} to={3}>
			<Photo id="kyosai-mouko-w" move="left" label="一夜の嵐で、消えた？" />
		</Beat>
		<Beat name="神の風" captions={c} from={4} to={4}>
			<Photo id="isai-kamikaze" move="in" label="神の風に、救われた？" />
		</Beat>
		<Beat name="海の底" captions={c} from={5} to={5}>
			<Stage label="その物語が、崩れ始めている？">
				<SeabedDescent />
			</Stage>
		</Beat>
		<Beat name="鷹島沖" captions={c} from={6} to={6}>
			<Photo id="takashima-air" move="in" label="2026年10月28日、鷹島の沖" />
		</Beat>
		<Beat name="サイコロと札" captions={c} from={7} to={7}>
			<Stage label="泥の中から、何が？">
				<DiceAndCards />
			</Stage>
		</Beat>
		<Beat name="遊んでいた" captions={c} from={8} to={8}>
			<Photo id="kozaki-site-1" move="right" label="兵士たちは、遊んでいた？" />
		</Beat>
		<Beat name="最大級の船" captions={c} from={9} to={9}>
			<Stage label="これまでで、最大級？">
				<ShipLength />
			</Stage>
		</Beat>
		<Beat name="出土品" captions={c} from={10} to={10}>
			<Photo id="takashima-finds" move="in" label="証拠は、それだけではない" />
		</Beat>
		<Beat name="木の板" captions={c} from={11} to={11}>
			<Stage label="年号が、合わない？">
				<InkBoard />
			</Stage>
		</Beat>
		<Beat name="南宋の矢" captions={c} from={12} to={12}>
			<Stage label="敵だった国の、武器？">
				<ArrowNock />
			</Stage>
		</Beat>
		<Beat name="教科書の物語" captions={c} from={13} to={13}>
			<Photo id="mohon-fukuda-1" move="left" label="教科書の物語にも、疑い？" />
		</Beat>
		<Beat name="11月" captions={c} from={14} to={14}>
			<Stage label="なぜ、一晩で消えた？">
				<StormSeason />
			</Stage>
		</Beat>
		<Beat name="一騎打ち" captions={c} from={15} to={15}>
			<Photo id="ekotoba-shiraishi" move="right" label="一騎打ちで、負けた？" />
		</Beat>
		<Beat name="3人の兵士" captions={c} from={16} to={16}>
			<Photo id="ekotoba-tetsuhau-w" move="left" label="この3人は、あとから？" />
		</Beat>
		<Beat name="嵐の前の2か月" captions={c} from={17} to={17}>
			<Photo id="borui-iki-3-w" move="right" label="嵐の前の2か月に、何が？" />
		</Beat>
		<Beat name="習った元寇" captions={c} from={18} to={18}>
			<Photo id="yosai-mouko" move="out" label="習った元寇は、本当の元寇？" />
		</Beat>
		<Beat name="泥の中" captions={c} from={19} to={19}>
			<Stage label="答えは、泥の中に">
				<MudSection />
			</Stage>
		</Beat>
		<Beat name="最新の技術" captions={c} from={20} to={21}>
			<Stage label="最新の技術が、何を暴いた？">
				<TechReveal />
			</Stage>
		</Beat>
		<Beat name="驚くべき発見" captions={c} from={22}>
			<Photo id="genkai-1" move="out" label="教科書をくつがえす、発見とは？" />
		</Beat>
	</SceneFrame>
);
