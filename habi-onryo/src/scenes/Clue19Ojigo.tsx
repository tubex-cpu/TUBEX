import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {LegendGap, Relations} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue19OjigoCaptions as c} from '../data/captions';

// 崇徳上皇は、父とされる鳥羽上皇の、本当の子ではなかった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue19Ojigo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue19Ojigo" label="第19の手がかり" title="崇徳上皇は、父とされる鳥羽上皇の、本当の子ではなかった？">
			<Beat name="崇徳上皇 1119年生まれ" captions={c} from={0} to={0}>
				<Photo id="sutoku-miei" move="in" label="崇徳上皇 1119年生まれ" />
			</Beat>
			<Beat name="父 鳥羽上皇" captions={c} from={1} to={1}>
				<Photo id="emperor-toba" move="in" label="父 鳥羽上皇" />
			</Beat>
			<Beat name="なぜ父に疎まれたのか" captions={c} from={2} to={3}>
				<Photo id="sutoku-hyakunin" move="in" label="なぜ父に疎まれたのか" />
			</Beat>
			<Beat name="「叔父子」" captions={c} from={4} to={6}>
				<Stage label="「叔父子」">
					<Relations nodes={[{id: 'w', x: 960, y: 380, name: '白河法皇', sub: '鳥羽上皇の祖父'}, {id: 't', x: 520, y: 600, name: '鳥羽上皇'}, {id: 'j', x: 1400, y: 600, name: '待賢門院璋子'}, {id: 's', x: 960, y: 820, name: '崇徳上皇', hot: true}]} edges={[{a: 'w', b: 't', label: '祖父と孫'}, {a: 't', b: 'j', label: '夫婦'}, {a: 'w', b: 's', label: '本当の父？', red: true, dash: true, at: 70}]} />
				</Stage>
			</Beat>
			<Beat name="当時の記録で確かめられる？" captions={c} from={7} to={9}>
				<Stage label="当時の記録で確かめられる？">
					<LegendGap from={1100} to={1240} marks={[{year: 1119, label: '崇徳上皇が\n生まれる'}, {year: 1215, label: '叔父子の話', sub: '『古事談』', story: true}]} gapLabel='およそ100年後の説話' />
				</Stage>
			</Beat>
			<Beat name="閉ざされた道" captions={c} from={10} to={11}>
				<Photo id="tadamichi-miei" move="in" label="閉ざされた道" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="戦に巻き込まれた上皇" captions={c} from={15}>
				<Photo id="hogen-heiji-screen-1" move="in" label="戦に巻き込まれた上皇" />
			</Beat>
		</SceneFrame>
	);
};
