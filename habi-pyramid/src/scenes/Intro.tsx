import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {AgeCounter, Countdown2026, RetractionStamp, UndergroundTeaser} from '../components/PyramidArt1';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// 謎の先出し（素材はすべてこの場面だけで使う）
export const Intro = () => (
	<SceneFrame captions={c} voice="Intro">
		<Beat name="ギザ" captions={c} from={0} to={0}>
			<Photo id="giza-air" label="4500年前の石の山に、何が起きた？" />
		</Beat>
		<Beat name="2万年前" captions={c} from={1} to={1}>
			<Visual label="造られたのは、もっと昔？">
				<AgeCounter />
			</Visual>
		</Beat>
		<Beat name="地下2キロ" captions={c} from={2} to={2}>
			<Visual label="地下2キロに、何が眠る？">
				<UndergroundTeaser />
			</Visual>
		</Beat>
		<Beat name="撤回" captions={c} from={3} to={3}>
			<Visual label="その論文に、何が起きた？">
				<RetractionStamp />
			</Visual>
		</Beat>
		<Beat name="地震" captions={c} from={4} to={4}>
			<Photo id="great-pyramid-se" move="left" label="4500年、なぜ崩れなかった？" />
		</Beat>
		<Beat name="予告" captions={c} from={5} to={6}>
			<Visual label="「歴史を書きかえる発見」は、いつ？">
				<Countdown2026 />
			</Visual>
		</Beat>
		<Beat name="今夜の問い" captions={c} from={7}>
			<Photo id="sphinx-pyramid" move="right" label="ピラミッドは、誰が、どうやって？" />
		</Beat>
	</SceneFrame>
);
