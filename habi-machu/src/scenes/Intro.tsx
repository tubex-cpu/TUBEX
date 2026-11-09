import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {LidarScan} from '../components/MachuArt';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="南米ペルー、アンデスの山の上" captions={c} from={0} to={0}>
				<Stage label="南米ペルー、アンデスの山の上" labelBottom>
					<ReliefMap view='sudamerica' focus={P.machu} zoom={1.6} pins={[{at: P.machu, name: 'マチュピチュ', sub: '標高 約2430m', big: true, t: 15}, {at: P.lima, name: 'リマ', t: 35}]} />
				</Stage>
			</Beat>
			<Beat name="谷の上の尾根に" captions={c} from={1} to={1}>
				<Photo id="mp-sunrise-allard" move="in" label="谷の上の尾根に" />
			</Beat>
			<Beat name="誰もが知る遺跡" captions={c} from={2} to={3}>
				<Photo id="mp-wayna-pan-w" move="scroll" label="誰もが知る遺跡" />
			</Beat>
			<Beat name="本当に「発見」だった？" captions={c} from={4} to={4}>
				<Photo id="old-sameplace" move="in" label="本当に「発見」だった？" />
			</Beat>
			<Beat name="本当の名前は？" captions={c} from={5} to={5}>
				<Photo id="wayna-tallest" move="in" label="本当の名前は？" />
			</Beat>
			<Beat name="ここに住んでいたのは？" captions={c} from={6} to={6}>
				<Photo id="mp-houses-dd47" move="in" label="ここに住んでいたのは？" />
			</Beat>
			<Beat name="密林の下に、何が？" captions={c} from={7} to={7}>
				<Photo id="cloudforest-1" move="in" label="密林の下に、何が？" />
			</Beat>
			<Beat name="なぜ、福島の会社が？" captions={c} from={8} to={9}>
				<Photo id="adatara-1" move="in" label="なぜ、福島の会社が？" />
			</Beat>
			<Beat name="最新の科学が見通す" captions={c} from={10} to={10}>
				<Stage label="最新の科学が見通す">
					<LidarScan />
				</Stage>
			</Beat>
			<Beat name="もうひとつのマチュピチュ" captions={c} from={11}>
				<Photo id="mp-clouds-unsplash" move="out" label="もうひとつのマチュピチュ" />
			</Beat>
		</SceneFrame>
	);
};
