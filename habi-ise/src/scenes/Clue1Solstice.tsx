import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {SolsticeSun, ToriiRecycle} from '../components/IseArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1SolsticeCaptions as c} from '../data/captions';

// 冬至の朝日が大鳥居の真ん中から昇るように、宇治橋は作られた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Clue1Solstice = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Solstice" label="第1の手がかり" title="冬至の朝日が大鳥居の真ん中から昇るように、宇治橋は作られた？">
			<Beat name="冬至の朝" captions={c} from={0} to={2}>
				<Stage label="冬至の朝">
					<SolsticeSun />
				</Stage>
			</Beat>
			<Beat name="長さおよそ102m" captions={c} from={3} to={3}>
				<Photo id="naiku-ujibashi-side" move="in" label="長さおよそ102m" />
			</Beat>
			<Beat name="大鳥居のほぼ真ん中から" captions={c} from={4} to={4}>
				<Photo id="naiku-ujibashi-torii" move="in" label="大鳥居のほぼ真ん中から" />
			</Beat>
			<Beat name="冬至に合わせて作られた？" captions={c} from={5} to={6}>
				<Photo id="naiku-ujibashi-sky" move="in" label="冬至に合わせて作られた？" />
			</Beat>
			<Beat name="川に直角にかかる橋" captions={c} from={7} to={7}>
				<Photo id="naiku-isuzu" move="in" label="川に直角にかかる橋" />
			</Beat>
			<Beat name="大鳥居の秘密" captions={c} from={8} to={10}>
				<Stage label="大鳥居の秘密">
					<ToriiRecycle />
				</Stage>
			</Beat>
			<Beat name="桑名・七里の渡しの鳥居（2006年撮影）" captions={c} from={11} to={11}>
				<Photo id="real-kuwana-torii" move="in" label="桑名・七里の渡しの鳥居（2006年撮影）" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="最初から伊勢に？" captions={c} from={15}>
				<Photo id="yamatohime-painting" move="in" label="最初から伊勢に？" />
			</Beat>
		</SceneFrame>
	);
};
