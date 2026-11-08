import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// UnsolvedMystery（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" >
			<Beat name="なぜ、粘土の中に？" captions={c} from={0} to={2}>
				<Photo id="kofun-sunset" move="in" label="なぜ、粘土の中に？" />
			</Beat>
			<Beat name="2人の関係は？" captions={c} from={3} to={4}>
				<Photo id="heijo" move="in" label="2人の関係は？" />
			</Beat>
			<Beat name="この墓の主は？" captions={c} from={5}>
				<Photo id="aerial-nara-park-w" move="scroll" label="この墓の主は？" />
			</Beat>
		</SceneFrame>
	);
};
