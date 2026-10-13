import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// 謎の先出し（素材はすべてこの場面だけで使う）
export const Intro = () => (
	<SceneFrame captions={c} voice="Intro">
		<Beat name="ドリルが砕けた" captions={c} from={0} to={1}>
			<Photo id="core-drill" label="ドリルが砕けた。地下に何が？" />
		</Beat>
		<Beat name="石になった木" captions={c} from={2} to={2}>
			<Photo id="petrified-wood" move="out" label="石灰岩より硬い「何か」の正体は？" />
		</Beat>
		<Beat name="船の形の真下" captions={c} from={3} to={3}>
			<Photo id="durupinar" move="left" label="長さ160m、船の形をした地形の真下" />
		</Beat>
		<Beat name="聖書は本当？" captions={c} from={4} to={4}>
			<Photo id="noah-art" label="聖書の物語は、本当だった？" />
		</Beat>
		<Beat name="おかしな証拠" captions={c} from={5} to={6}>
			<Photo id="gilgamesh-tablet5" move="right" label="聖書より1000年以上古い、そっくりな物語？" />
		</Beat>
		<Beat name="丸い方舟" captions={c} from={7} to={7}>
			<Photo id="guffa-1920s" move="out" label="方舟は、丸かった？" />
		</Beat>
		<Beat name="日本にも" captions={c} from={8} to={9}>
			<Photo id="jomon-shards" label="もっと大きな洪水が、日本にも？" />
		</Beat>
		<Beat name="今夜の問い" captions={c} from={10}>
			<Photo id="michelangelo-deluge" move="left" label="ノアの方舟は、本当にあったのか" />
		</Beat>
	</SceneFrame>
);
