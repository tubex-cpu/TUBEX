import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue19BasshiCaptions as c} from '../data/captions';

// 縄文人は、大人になると歯を抜いた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue19Basshi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue19Basshi" label="第19の手がかり" title="縄文人は、大人になると歯を抜いた？">
			<Beat name="抜かれた前歯" captions={c} from={0} to={0}>
				<Photo id="c19-yoshigo-trench" move="scroll" label="抜かれた前歯" />
			</Beat>
			<Beat name="調べた人骨の" captions={c} from={1} to={1}>
				<Stage label="調べた人骨の" labelBottom>
					<ReliefMap view='archipelago' zoom={1.3} focus={P.yoshigo} pins={[{at: P.yoshigo, name: '吉胡貝塚', sub: '愛知県田原市', big: true, t: 8}]} />
				</Stage>
			</Beat>
			<Beat name="大人の証し？" captions={c} from={2} to={2}>
				<Photo id="c19-yoshigo-park" move="in" label="大人の証し？" />
			</Beat>
			<Beat name="どこから広がった？" captions={c} from={3} to={3}>
				<Stage label="どこから広がった？" labelBottom>
					<ReliefMap view='archipelago' zoom={1.05} pins={[{at: P.sendaibay, name: '仙台湾', sub: '約4000年前', big: true, t: 8}]} lines={[{pts: [P.sendaibay, P.yoshigo], t: 30, arrow: true}, {pts: [P.sendaibay, P.torihama], t: 42, arrow: true}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={4} to={6}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 4, 5, fps)} />
			</Beat>
			<Beat name="空の動きにも？" captions={c} from={7}>
				<Photo id="c20-oyu-sundial" move="in" label="空の動きにも？" />
			</Beat>
		</SceneFrame>
	);
};
