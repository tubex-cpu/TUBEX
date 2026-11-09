import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7SpainCaptions as c} from '../data/captions';

// マチュピチュは、スペイン人に知られていなかった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue7Spain = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Spain" label="第7の手がかり" title="マチュピチュは、スペイン人に知られていなかった？">
			<Beat name="1532年" captions={c} from={0} to={0}>
				<Photo id="atahualpa-capture" move="in" label="1532年" />
			</Beat>
			<Beat name="神殿の上に、教会" captions={c} from={1} to={1}>
				<Photo id="coricancha-wall" move="in" label="神殿の上に、教会" />
			</Beat>
			<Beat name="壊された跡は？" captions={c} from={2} to={3}>
				<Photo id="mp-from-intipunku" move="in" label="壊された跡は？" />
			</Beat>
			<Beat name="植民地時代の文書には？" captions={c} from={4} to={6}>
				<Stage label="植民地時代の文書には？">
					<TimeBar stops={[{label: '1532年', sub: 'スペインの\n征服'}, {label: '16世紀', sub: '文書に\n「ピチュ」', accent: true}, {label: '1588年', sub: '「ワイナピチュ\nの町」', accent: true}, {label: '1911年', sub: 'ビンガム'}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="役人たちは知っていた" captions={c} from={7} to={7}>
				<Photo id="cusco-plaza-w" move="scroll" label="役人たちは知っていた" />
			</Beat>
			<Beat name="実際に訪れたのか？" captions={c} from={8} to={9}>
				<Photo id="vitcos" move="in" label="実際に訪れたのか？" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="なぜ崩れずに残った？" captions={c} from={13}>
				<Photo id="three-windows-1" move="in" label="なぜ崩れずに残った？" />
			</Beat>
		</SceneFrame>
	);
};
