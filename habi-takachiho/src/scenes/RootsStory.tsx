import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// RootsStory（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" >
			<Beat name="手がかりを、つなぐと" captions={c} from={0} to={0}>
				<Photo id="yk-dawn-sea" move="in" label="手がかりを、つなぐと" />
			</Beat>
			<Beat name="光が消え、また戻る" captions={c} from={1} to={2}>
				<Photo id="art-mikagura" move="in" label="光が消え、また戻る" />
			</Beat>
			<Beat name="8世紀、日本書紀に" captions={c} from={3} to={3}>
				<Photo id="real-shoki-open-cave" move="in" label="8世紀、日本書紀に" />
			</Beat>
			<Beat name="神話を、この土地に" captions={c} from={4} to={5}>
				<Photo id="gorge-columnar" move="in" label="神話を、この土地に" />
			</Beat>
			<Beat name="800年前の神楽" captions={c} from={6} to={6}>
				<Photo id="yk-iki" move="in" label="800年前の神楽" />
			</Beat>
			<Beat name="冬の夜、神を迎える" captions={c} from={7} to={7}>
				<Photo id="yk-bonfire-shrine" move="in" label="冬の夜、神を迎える" />
			</Beat>
			<Beat name="体の中で受け継がれた" captions={c} from={8} to={8}>
				<Photo id="yk-1914" move="in" label="体の中で受け継がれた" />
			</Beat>
			<Beat name="岩戸を開け続ける" captions={c} from={9}>
				<Photo id="tj-meotosugi" move="in" label="岩戸を開け続ける" />
			</Beat>
		</SceneFrame>
	);
};
