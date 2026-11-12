import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {BigYears, Relations} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue28SportsCaptions as c} from '../data/captions';

// 白峯神宮がスポーツの神なのは、崇徳上皇が球技を好んだから？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue28Sports = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue28Sports" label="第28の手がかり" title="白峯神宮がスポーツの神なのは、崇徳上皇が球技を好んだから？">
			<Beat name="全国から" captions={c} from={0} to={1}>
				<Stage label="全国から">
					<Cards cards={[{head: 'サッカー', body: '選手が参拝'}, {head: 'バレーボール', body: 'ボールを奉納'}, {head: '球技の神', body: '白峯神宮', tone: 'gold'}]} tone='moss' size={46} height={330} top={370} />
				</Stage>
			</Beat>
			<Beat name="怨霊が、なぜスポーツの神に？" captions={c} from={2} to={4}>
				<Stage label="怨霊が、なぜスポーツの神に？">
					<Relations nodes={[{id: 's', x: 520, y: 560, name: '崇徳上皇', sub: '球技が好きだった？', hot: true}, {id: 'b', x: 1400, y: 560, name: 'スポーツの神', sub: '白峯神宮'}]} edges={[{a: 's', b: 'b', label: 'なぜ？', red: true, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="精大明神" captions={c} from={5} to={7}>
				<Photo id="shiramine-kemari" move="in" label="精大明神" />
			</Beat>
			<Beat name="境内で続く蹴鞠" captions={c} from={8} to={9}>
				<Stage label="境内で続く蹴鞠">
					<Cards cards={[{head: '4月', body: '蹴鞠の奉納'}, {head: '7月', body: '蹴鞠の奉納'}]} tone='moss' size={52} height={300} top={390} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="いつから「三大怨霊」に？" captions={c} from={13}>
				<Stage label="いつから「三大怨霊」に？">
					<BigYears value={3} unit='人' caption='平将門・菅原道真・崇徳上皇' tone='shrine' />
				</Stage>
			</Beat>
		</SceneFrame>
	);
};
