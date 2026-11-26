import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VillagePlan} from '../components/JomonArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue16YayoiCaptions as c} from '../data/captions';

// 争いが増えたのは、弥生時代から？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue16Yayoi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue16Yayoi" label="第16の手がかり" title="争いが増えたのは、弥生時代から？">
			<Beat name="村の形" captions={c} from={0} to={1}>
				<Stage label="村の形">
					<VillagePlan />
				</Stage>
			</Beat>
			<Beat name="佐賀県 吉野ヶ里遺跡" captions={c} from={2} to={2}>
				<Photo id="c16-yoshinogari-moat" move="in" label="佐賀県 吉野ヶ里遺跡" />
			</Beat>
			<Beat name="鳥取県 青谷上寺地遺跡" captions={c} from={3} to={3}>
				<Photo id="c16-aoya-excavation" move="in" label="鳥取県 青谷上寺地遺跡" />
			</Beat>
			<Beat name="蓄えができると" captions={c} from={4} to={4}>
				<Photo id="c16-yoshinogari-tower" move="up" label="蓄えができると" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="何に祈っていたのか" captions={c} from={8}>
				<Photo id="c17-chukudogu" move="in" label="何に祈っていたのか" />
			</Beat>
		</SceneFrame>
	);
};
