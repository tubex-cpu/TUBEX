import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// まだ解けていない謎（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" >
			<Beat name="どこで作られたのか" captions={c} from={0} to={1}>
				<Photo id="spare-koganezuka-239" move="in" label="どこで作られたのか" />
			</Beat>
			<Beat name="なぜ中国から出ない？" captions={c} from={2} to={2}>
				<Photo id="spare-seiryu3-tnm" move="in" label="なぜ中国から出ない？" />
			</Beat>
			<Beat name="存在しない年号" captions={c} from={3} to={3}>
				<Photo id="spare-seiryu3-amamiya" move="in" label="存在しない年号" />
			</Beat>
			<Beat name="卑弥呼の墓の中は" captions={c} from={4} to={4}>
				<Photo id="spare-mount-miwa" move="in" label="卑弥呼の墓の中は" />
			</Beat>
			<Beat name="謎のエリアの発掘は続く" captions={c} from={5} to={5}>
				<Photo id="matome-yoshinogari" move="in" label="謎のエリアの発掘は続く" />
			</Beat>
			<Beat name="103枚の鏡が答えを待つ" captions={c} from={6}>
				<Photo id="unsolved-kyuhaku-may" move="in" label="103枚の鏡が答えを待つ" />
			</Beat>
		</SceneFrame>
	);
};
