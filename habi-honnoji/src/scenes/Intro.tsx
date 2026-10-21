import {Beat} from '../components/Beat';
import {SoldierThought, TroopsSurround} from '../components/HonnojiArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {introCaptions as c} from '../data/captions';

// 謎の先出し（素材はすべてこの場面だけで使う）
export const Intro = () => (
	<SceneFrame captions={c} voice="Intro">
		<Beat name="TroopsSurround" captions={c} from={0} to={0}>
			<Visual label="夜明け前の本能寺を、誰が？">
				<TroopsSurround />
			</Visual>
		</Beat>
		<Beat name="率いていたのは、明智光秀" captions={c} from={1} to={1}>
			<Photo id="mitsuhide" label="率いていたのは、明智光秀" />
		</Beat>
		<Beat name="SoldierThought" captions={c} from={2} to={4}>
			<Visual label="兵士たちは、何を知っていた？">
				<SoldierThought />
			</Visual>
		</Beat>
		<Beat name="2026年、光秀の「幻の" captions={c} from={5} to={6}>
			<Photo id="sakamoto-09" move="out" label="2026年、光秀の「幻の城」で何が？" />
		</Beat>
		<Beat name="当日に書かれた手紙が、黒" captions={c} from={7} to={7}>
			<Photo id="iwakuni" move="left" label="当日に書かれた手紙が、黒幕説を揺るがす？" />
		</Beat>
		<Beat name="光秀は、なぜ信長を討った" captions={c} from={8}>
			<Photo id="honnoji-yoshitoshi" label="光秀は、なぜ信長を討ったのか" />
		</Beat>
	</SceneFrame>
);
