import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Relations} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue10NaritasanCaptions as c} from '../data/captions';

// 将門を祀る神社の氏子は、成田山に参ってはいけない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue10Naritasan = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Naritasan" label="第10の手がかり" title="将門を祀る神社の氏子は、成田山に参ってはいけない？">
			<Beat name="成田山新勝寺" captions={c} from={0} to={1}>
				<Photo id="narita-niomon" move="in" label="成田山新勝寺" />
			</Beat>
			<Beat name="乱を鎮める祈り" captions={c} from={2} to={4}>
				<Stage label="乱を鎮める祈り" labelBottom>
					<ReliefMap view='kanto' zoom={1.1} focus={P.narita} pins={[{at: P.narita, name: '成田', sub: '寛朝の祈り', big: true, t: 10}, {at: P.iwai, name: '将門の本拠', t: 40}, {at: P.tsuka, name: '大手町', t: 60}]} />
				</Stage>
			</Beat>
			<Beat name="1000年前の戦の記憶" captions={c} from={5} to={6}>
				<Stage label="1000年前の戦の記憶">
					<Relations nodes={[{id: 'n', x: 520, y: 560, name: '成田山', sub: '将門を倒す祈り'}, {id: 'k', x: 1400, y: 560, name: '神田明神', sub: '将門を祀る', hot: true}]} edges={[{a: 'n', b: 'k', label: '参ってはいけない？', red: true, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="氏子は、参れない？" captions={c} from={7} to={9}>
				<Photo id="narita-overview" move="in" label="氏子は、参れない？" />
			</Beat>
			<Beat name="決まりなのか？" captions={c} from={10} to={11}>
				<Stage label="決まりなのか？">
					<Cards cards={[{head: '寺や神社の決まり？', body: '決まりはない', tone: 'red'}, {head: 'いまも', body: '気にする人がいる\n言い伝え'}]} tone='ink' size={46} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="2人目の怨霊" captions={c} from={15}>
				<Photo id="michizane-masanobu" move="in" label="2人目の怨霊" />
			</Beat>
		</SceneFrame>
	);
};
