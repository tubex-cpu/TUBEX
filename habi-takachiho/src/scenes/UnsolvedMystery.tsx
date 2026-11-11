import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// UnsolvedMystery（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" >
			<Beat name="本当にあった出来事？" captions={c} from={0} to={2}>
				<Photo id="gorge-kihachi" move="in" label="本当にあった出来事？" />
			</Beat>
			<Beat name="並び立つ、二つの神話の里" captions={c} from={3} to={4}>
				<Stage label="並び立つ、二つの神話の里" labelBottom>
					<ReliefMap view='kyushu' focus={P.takachihoPeak} zoom={1.1} pins={[{at: P.takachihoTown, name: '高千穂町', t: 10}, {at: P.takachihoPeak, name: '高千穂峰', t: 30}]} />
				</Stage>
			</Beat>
			<Beat name="2028年" captions={c} from={5} to={6}>
				<Photo id="yk-yutate" move="in" label="2028年" />
			</Beat>
			<Beat name="次の時代へ" captions={c} from={7}>
				<Photo id="gorge-bridge" move="in" label="次の時代へ" />
			</Beat>
		</SceneFrame>
	);
};
