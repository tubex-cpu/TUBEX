import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2OriginCaptions as c} from '../data/captions';

// 伊勢神宮は、最初から伊勢にあった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Clue2Origin = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Origin" label="第2の手がかり" title="伊勢神宮は、最初から伊勢にあった？">
			<Beat name="日本書紀によれば" captions={c} from={0} to={2}>
				<Photo id="shoki-koan-w" move="scroll" label="日本書紀によれば" />
			</Beat>
			<Beat name="倭姫命" captions={c} from={3} to={3}>
				<Photo id="yamatohime-miya" move="in" label="倭姫命" />
			</Beat>
			<Beat name="各地をめぐる旅" captions={c} from={4} to={4}>
				<Stage label="各地をめぐる旅">
					<ReliefMap view='kinki' zoom={1.03} pins={[{at: P.kasanui, name: '笠縫邑', sub: '奈良', t: 10, dx: -60}, {at: P.omi, name: '近江', t: 30}, {at: P.mino, name: '美濃', t: 45, dx: 80, dy: 70}, {at: P.naiku, name: '伊勢', big: true, t: 65}]} lines={[{pts: [P.kasanui, P.omi], t: 20, len: 25}, {pts: [P.omi, P.mino], t: 35, len: 25}, {pts: [P.mino, P.naiku], t: 50, len: 30}]} />
				</Stage>
			</Beat>
			<Beat name="常世の波が寄せる国" captions={c} from={5} to={7}>
				<Photo id="naiku-isuzu-winter" move="in" label="常世の波が寄せる国" />
			</Beat>
			<Beat name="元伊勢" captions={c} from={8} to={8}>
				<Photo id="hibara-jinja" move="in" label="元伊勢" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="八咫鏡は、どこに？" captions={c} from={12}>
				<Photo id="naiku-stairs" move="in" label="八咫鏡は、どこに？" />
			</Beat>
		</SceneFrame>
	);
};
