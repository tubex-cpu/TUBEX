import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// RootsStory（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" >
			<Beat name="手がかりを、つなぐと" captions={c} from={0} to={1}>
				<Photo id="nara-basin-w" move="scroll" label="手がかりを、つなぐと" />
			</Beat>
			<Beat name="てっぺんに眠った人物" captions={c} from={2} to={2}>
				<Photo id="ishimakura" move="in" label="てっぺんに眠った人物" />
			</Beat>
			<Beat name="造り出しに眠った人物" captions={c} from={3} to={5}>
				<Photo id="tomio-nendokaku" move="in" label="造り出しに眠った人物" />
			</Beat>
			<Beat name="守るための剣" captions={c} from={6} to={6}>
				<Photo id="hirata-tekken-w" move="scroll" label="守るための剣" />
			</Beat>
			<Beat name="謎の4世紀" captions={c} from={7} to={8}>
				<Photo id="nara-city-w" move="scroll" label="謎の4世紀" />
			</Beat>
			<Beat name="名もない有力者たち" captions={c} from={9} to={10}>
				<Photo id="yata-hills" move="in" label="名もない有力者たち" />
			</Beat>
			<Beat name="2027年、国の史跡へ" captions={c} from={11}>
				<Photo id="tomio-river" move="in" label="2027年、国の史跡へ" />
			</Beat>
		</SceneFrame>
	);
};
