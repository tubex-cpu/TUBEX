import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// UnsolvedMystery（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" >
			<Beat name="どんな姿をしている？" captions={c} from={0} to={2}>
				<Photo id="shinpo-tachi" move="in" label="どんな姿をしている？" />
			</Beat>
			<Beat name="冬至と天照大神" captions={c} from={3} to={3}>
				<Photo id="winter-sunset-w" move="scroll" label="冬至と天照大神" />
			</Beat>
			<Beat name="宮中の祭り（大嘗会の古図）" captions={c} from={4} to={4}>
				<Photo id="real-daijoe-old" move="in" label="宮中の祭り（大嘗会の古図）" />
			</Beat>
			<Beat name="鎮魂は天鈿女命に始まる（古語拾遺）" captions={c} from={5} to={5}>
				<Photo id="real-kogo-chinkon" move="in" label="鎮魂は天鈿女命に始まる（古語拾遺）" />
			</Beat>
			<Beat name="弱くなる太陽" captions={c} from={6} to={6}>
				<Photo id="solar-eclipse" move="in" label="弱くなる太陽" />
			</Beat>
			<Beat name="偶然か、祈りか" captions={c} from={7} to={8}>
				<Photo id="sun-torii-dawn" move="in" label="偶然か、祈りか" />
			</Beat>
			<Beat name="2033年" captions={c} from={9}>
				<Photo id="geku-goshoden-kodenchi" move="in" label="2033年" />
			</Beat>
		</SceneFrame>
	);
};
