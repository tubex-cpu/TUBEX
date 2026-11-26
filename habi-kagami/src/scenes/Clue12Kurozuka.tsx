import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue12KurozukaCaptions as c} from '../data/captions';

// 黒塚古墳では、33枚の鏡が棺を取り囲んでいた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue12Kurozuka = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue12Kurozuka" label="第12の手がかり" title="黒塚古墳では、33枚の鏡が棺を取り囲んでいた？">
			<Beat name="長さ130メートル" captions={c} from={0} to={1}>
				<Stage label="長さ130メートル" labelBottom>
					<ReliefMap view='nara' zoom={1.12} focus={P.kurozuka} pins={[{at: P.kurozuka, name: '黒塚古墳', sub: '天理市', big: true, t: 6}, {at: P.hashihaka, name: '箸墓古墳', t: 30}]} />
				</Stage>
			</Beat>
			<Beat name="棺の北半分を囲む" captions={c} from={2} to={3}>
				<Stage label="棺の北半分を囲む">
					<Figures figs={[{value: '17枚', label: '西側'}, {value: '15枚', label: '東側'}, {value: '1枚', label: '北の端', accent: true}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="布に包まれた鏡" captions={c} from={4} to={5}>
				<Photo id="c12-kurozuka-funcho" move="in" label="布に包まれた鏡" />
			</Beat>
			<Beat name="なぜ取り囲んだ？" captions={c} from={6} to={6}>
				<Photo id="c12-kurozuka-kouenbu" move="in" label="なぜ取り囲んだ？" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="いちばん大切な鏡は" captions={c} from={10}>
				<Photo id="c13-kurozuka-museum" move="in" label="いちばん大切な鏡は" />
			</Beat>
		</SceneFrame>
	);
};
