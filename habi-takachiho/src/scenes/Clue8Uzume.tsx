import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {KaguraNight} from '../components/TakachihoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8UzumeCaptions as c} from '../data/captions';

// 天宇受売命の舞は、神楽の始まり？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue8Uzume = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Uzume" label="第8の手がかり" title="天宇受売命の舞は、神楽の始まり？">
			<Beat name="人を楽しませる芸" captions={c} from={0} to={1}>
				<Photo id="art-sarutahiko" move="in" label="人を楽しませる芸" />
			</Beat>
			<Beat name="鈿女の舞" captions={c} from={2} to={3}>
				<Photo id="gen-uzume-kagura" move="in" label="鈿女の舞" />
			</Beat>
			<Beat name="手力雄の舞" captions={c} from={4} to={4}>
				<Photo id="yk-giant-tajikarao" move="in" label="手力雄の舞" />
			</Beat>
			<Beat name="戸取の舞" captions={c} from={5} to={5}>
				<Photo id="gen-todori" move="in" label="戸取の舞" />
			</Beat>
			<Beat name="夜が明けていく" captions={c} from={6} to={6}>
				<Stage label="夜が明けていく">
					<KaguraNight dancers={3} />
				</Stage>
			</Beat>
			<Beat name="岩戸の前の歌と舞（古語拾遺）" captions={c} from={7} to={8}>
				<Photo id="real-kogo-uzume" move="in" label="岩戸の前の歌と舞（古語拾遺）" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="これからも続く？" captions={c} from={12}>
				<Photo id="yk-masks-shelf" move="in" label="これからも続く？" />
			</Beat>
		</SceneFrame>
	);
};
