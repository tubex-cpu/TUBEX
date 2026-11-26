import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue15DenseiCaptions as c} from '../data/captions';

// 鏡は、作られてすぐに墓に入れられた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue15Densei = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue15Densei" label="第15の手がかり" title="鏡は、作られてすぐに墓に入れられた？">
			<Beat name="荒らされていない木の棺" captions={c} from={0} to={0}>
				<Photo id="c15-tomio-survey" move="in" label="荒らされていない木の棺" />
			</Beat>
			<Beat name="前漢から新の時代の鏡" captions={c} from={1} to={2}>
				<Photo id="c15-kiryu-mirror" move="in" label="前漢から新の時代の鏡" />
			</Beat>
			<Beat name="作られてから何年？" captions={c} from={3} to={3}>
				<Stage label="作られてから何年？">
					<TimeBar stops={[{label: '前漢〜新', sub: '鏡が作られる'}, {label: '約400年', sub: '受け継がれる？', accent: true}, {label: '4世紀後半', sub: '墓に入る'}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="代々の宝？" captions={c} from={4} to={5}>
				<Photo id="c15-tomio-dakoken" move="in" label="代々の宝？" />
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="不思議な力？" captions={c} from={9}>
				<Photo id="c16-kyohaku2" move="in" label="不思議な力？" />
			</Beat>
		</SceneFrame>
	);
};
