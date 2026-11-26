import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2DokiCaptions as c} from '../data/captions';

// 縄文土器は、世界最古の土器？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue2Doki = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Doki" label="第2の手がかり" title="縄文土器は、世界最古の土器？">
			<Beat name="縄文の土器" captions={c} from={0} to={0}>
				<Photo id="c02-kaen-sasayama" move="in" label="縄文の土器" />
			</Beat>
			<Beat name="世界最古と言われてきた" captions={c} from={1} to={1}>
				<Photo id="c02-flame-cleveland" move="up" label="世界最古と言われてきた" />
			</Beat>
			<Beat name="さらに古い土器" captions={c} from={2} to={2}>
				<Stage label="さらに古い土器">
					<ReliefMap view='chinajp' zoom={1.04} pins={[{at: P.xianren, name: '中国の洞窟', sub: '約2万年前の土器', big: true, t: 8, color: '#ff8f80'}, {at: P.torihama, name: '日本列島', sub: '約1万6000年前の土器', t: 40, dy: 80}]} />
				</Stage>
			</Beat>
			<Beat name="東アジアのあちこちで" captions={c} from={3} to={3}>
				<Photo id="c02-china-pottery" move="in" label="東アジアのあちこちで" />
			</Beat>
			<Beat name="判決" captions={c} from={4} to={6}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 4, 5, fps)} />
			</Beat>
			<Beat name="ずっと同じだった？" captions={c} from={7}>
				<Photo id="c03-deep-ushinuma" move="in" label="ずっと同じだった？" />
			</Beat>
		</SceneFrame>
	);
};
