import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {SexRatio} from '../components/MachuArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5VirginsCaptions as c} from '../data/captions';

// マチュピチュは、太陽に仕える女性たちの都市だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue5Virgins = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Virgins" label="第5の手がかり" title="マチュピチュは、太陽に仕える女性たちの都市だった？">
			<Beat name="墓から掘り出された骨" captions={c} from={0} to={1}>
				<Photo id="old-heaviest" move="in" label="墓から掘り出された骨" />
			</Beat>
			<Beat name="太陽の処女？" captions={c} from={2} to={4}>
				<Photo id="sun-temple-solstice" move="in" label="太陽の処女？" />
			</Beat>
			<Beat name="調べ直すと？" captions={c} from={5} to={8}>
				<Stage label="調べ直すと？">
					<SexRatio />
				</Stage>
			</Beat>
			<Beat name="骨の中の遺伝子" captions={c} from={9} to={9}>
				<Photo id="moon-cavern" move="in" label="骨の中の遺伝子" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="この土地の人々だった？" captions={c} from={13}>
				<Photo id="terrace-south" move="in" label="この土地の人々だった？" />
			</Beat>
		</SceneFrame>
	);
};
