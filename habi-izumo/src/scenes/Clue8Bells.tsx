import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {PitLayout} from '../components/IzumoArt2';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8BellsCaptions as c} from '../data/captions';

// 銅剣の国と、銅鐸の国は、別々だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue8Bells = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Bells" label="第8の手がかり" title="銅剣の国と、銅鐸の国は、別々だった？">
			<Beat name="1985年、7メートル先で" captions={c} from={0} to={3}>
				<Stage label="1985年、7メートル先で">
					<PitLayout />
				</Stage>
			</Beat>
			<Beat name="学者たちは、また驚いた" captions={c} from={4} to={5}>
				<Photo id="kojindani-dotaku-2" move="in" label="学者たちは、また驚いた" />
			</Beat>
			<Beat name="2つの文化の地域？" captions={c} from={6} to={8}>
				<Stage label="2つの文化の地域？">
					<ReliefMap view='nihonkai' focus={P.taisha} zoom={1.15} areas={[{at: [130.6, 33.5], r: 120, color: '#7fb0d0', label: '銅矛', t: 10}, {at: [135.6, 34.75], r: 130, color: '#e9a13b', label: '銅鐸', t: 40}]} pins={[{at: P.taisha, name: '出雲', big: true, t: 80}]} />
				</Stage>
			</Beat>
			<Beat name="北九州の銅矛" captions={c} from={9} to={10}>
				<Photo id="kyushu-spear" move="in" label="北九州の銅矛" />
			</Beat>
			<Beat name="境目にあたる出雲で" captions={c} from={11} to={13}>
				<Photo id="dotaku-bm" move="in" label="境目にあたる出雲で" />
			</Beat>
			<Beat name="判決" captions={c} from={14} to={16}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 14, 15, fps)} />
			</Beat>
			<Beat name="12年後" captions={c} from={17}>
				<Photo id="kamo-guidance" move="in" label="12年後" />
			</Beat>
		</SceneFrame>
	);
};
