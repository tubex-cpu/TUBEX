import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Relations} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue22FingerprintCaptions as c} from '../data/captions';

// 鉄門海上人の即身仏は、本人だと確かめられた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue22Fingerprint = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue22Fingerprint" label="第22の手がかり" title="鉄門海上人の即身仏は、本人だと確かめられた？">
			<Beat name="数百年前の遺体" captions={c} from={0} to={1}>
				<Photo id="fingerprint-kit" move="in" label="数百年前の遺体" />
			</Beat>
			<Beat name="1962年の報告" captions={c} from={2} to={3}>
				<Stage label="1962年の報告">
					<Relations nodes={[{id: 'h', x: 520, y: 560, name: '生前の手形', sub: '注連寺に残る'}, {id: 's', x: 1400, y: 560, name: '即身仏の指', sub: '型を取る', hot: true}]} edges={[{a: 'h', b: 's', label: '指紋が一致'}]} />
				</Stage>
			</Beat>
			<Beat name="伝説の中の事実" captions={c} from={4} to={6}>
				<Photo id="hiroshige-enoshima-kaicho-w" move="scroll" label="伝説の中の事実" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="明治の世に" captions={c} from={10}>
				<Photo id="meiji-emperor" move="in" label="明治の世に" />
			</Beat>
		</SceneFrame>
	);
};
