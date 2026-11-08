import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {KofunCompare} from '../components/TomioArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1SizeCaptions as c} from '../data/captions';

// 富雄丸山古墳は、日本最大の古墳？（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Clue1Size = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Size" label="第1の手がかり" title="富雄丸山古墳は、日本最大の古墳？">
			<Beat name="4世紀の後半" captions={c} from={0} to={1}>
				<Photo id="tomio-fukiishi1" move="in" label="4世紀の後半" />
			</Beat>
			<Beat name="円墳としては？" captions={c} from={2} to={3}>
				<Photo id="maruhaka-zenkei" move="in" label="円墳としては？" />
			</Beat>
			<Beat name="古墳全体で比べると？" captions={c} from={4} to={7}>
				<Stage label="古墳全体で比べると？">
					<KofunCompare />
				</Stage>
			</Beat>
			<Beat name="とてつもない大きさ" captions={c} from={8} to={9}>
				<Photo id="goshiki-aerial" move="in" label="とてつもない大きさ" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="昔から知られていた？" captions={c} from={13}>
				<Photo id="daisen-balloon" move="in" label="昔から知られていた？" />
			</Beat>
		</SceneFrame>
	);
};
