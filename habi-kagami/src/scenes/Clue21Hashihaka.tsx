import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {Balance} from '../components/KagamiArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue21HashihakaCaptions as c} from '../data/captions';

// 箸墓古墳は、卑弥呼が亡くなったころに築かれた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue21Hashihaka = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue21Hashihaka" label="第21の手がかり" title="箸墓古墳は、卑弥呼が亡くなったころに築かれた？">
			<Beat name="国立歴史民俗博物館" captions={c} from={0} to={1}>
				<Photo id="c21-rekihaku" move="in" label="国立歴史民俗博物館" />
			</Beat>
			<Beat name="築かれた直後は" captions={c} from={2} to={3}>
				<Stage label="築かれた直後は">
					<TimeBar stops={[{label: '240年', sub: ''}, {label: '247年ごろ', sub: '卑弥呼が亡くなる', accent: true}, {label: '260年', sub: ''}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="直径百歩あまりの塚" captions={c} from={4} to={4}>
				<Photo id="c21-hashinaka-ike" move="in" label="直径百歩あまりの塚" />
			</Beat>
			<Beat name="異論も少なくない" captions={c} from={5} to={5}>
				<Photo id="c21-rekihaku2" move="in" label="異論も少なくない" />
			</Beat>
			<Beat name="2026年2月 濠の中の通り道" captions={c} from={6} to={6}>
				<Photo id="unsolved-hashihaka-far" move="in" label="2026年2月 濠の中の通り道" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="天秤は" captions={c} from={10} to={10}>
				<Stage label="天秤は">
					<Balance from={-0.4} to={-0.65} left={[{text: '三角縁神獣鏡の中心', shaky: true}, {text: '鏡を配った王権', shaky: true}, {text: '箸墓古墳の年代', fresh: true}]} right={[]} note='鏡とは別の重り' />
				</Stage>
			</Beat>
			<Beat name="すぐそばには" captions={c} from={11}>
				<Photo id="c22-miwayama" move="in" label="すぐそばには" />
			</Beat>
		</SceneFrame>
	);
};
