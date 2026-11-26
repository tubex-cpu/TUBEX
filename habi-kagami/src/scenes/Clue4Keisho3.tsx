import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4Keisho3Captions as c} from '../data/captions';

// 卑弥呼の年号が刻まれた鏡が、見つかっている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue4Keisho3 = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Keisho3" label="第4の手がかり" title="卑弥呼の年号が刻まれた鏡が、見つかっている？">
			<Beat name="出雲の山あい" captions={c} from={0} to={0}>
				<Stage label="出雲の山あい" labelBottom>
					<ReliefMap view='westjapan' zoom={1.1} focus={P.kambara} pins={[{at: P.kambara, name: '神原神社', sub: '島根県雲南市', big: true, t: 8}]} />
				</Stage>
			</Beat>
			<Beat name="社殿の下の小さな塚" captions={c} from={1} to={2}>
				<Photo id="spare-kanbara-honden" move="in" label="社殿の下の小さな塚" />
			</Beat>
			<Beat name="1972年 石の部屋" captions={c} from={3} to={3}>
				<Photo id="c04-kanbara-sekishitsu" move="in" label="1972年 石の部屋" />
			</Beat>
			<Beat name="刻まれていた年号" captions={c} from={4} to={6}>
				<Photo id="c04-kanbara-mirror" move="in" label="刻まれていた年号" />
			</Beat>
			<Beat name="国の重要文化財" captions={c} from={7} to={7}>
				<Photo id="c04-izumo-museum" move="in" label="国の重要文化財" />
			</Beat>
			<Beat name="もう1枚の景初三年" captions={c} from={8} to={8}>
				<Photo id="c04-koganezuka-mirror" move="in" label="もう1枚の景初三年" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="もう一つの年" captions={c} from={12}>
				<Photo id="c05-chausuyama-funkyu" move="in" label="もう一つの年" />
			</Beat>
		</SceneFrame>
	);
};
