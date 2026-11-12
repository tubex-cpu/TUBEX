import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {BigYears, Flow} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7GhqCaptions as c} from '../data/captions';

// 戦後、将門塚をならそうとしたGHQのブルドーザーが横転した？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue7Ghq = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Ghq" label="第7の手がかり" title="戦後、将門塚をならそうとしたGHQのブルドーザーが横転した？">
			<Beat name="よく知られた話" captions={c} from={0} to={3}>
				<Stage label="よく知られた話">
					<Flow steps={[{head: '1945年', body: '占領軍が\n大手町を整地'}, {head: '重機が横転？', body: '運転手が\n亡くなった？', hot: true}, {head: '当時の記録', body: '文書・報道が\n見つからない', dim: true}]} />
				</Stage>
			</Beat>
			<Beat name="記録は、見つかるのか" captions={c} from={4} to={5}>
				<Photo id="kubizuka-old-street" move="in" label="記録は、見つかるのか" />
			</Beat>
			<Beat name="将門塚の戦後" captions={c} from={6} to={9}>
				<Stage label="将門塚の戦後">
					<TimeBar stops={[{label: '1960年', sub: '保存会'}, {label: '1971年', sub: '都の旧跡'}, {label: '2020年', sub: '6回目の改修', accent: true}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="祟りの物語は、全国へ" captions={c} from={10}>
				<Photo id="foxfire-chikanobu" move="in" label="祟りの物語は、全国へ" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="2026年の出来事" captions={c} from={14}>
				<Stage label="2026年の出来事">
					<BigYears value={2026} unit='年' caption='夏の将門塚' tone='shrine' />
				</Stage>
			</Beat>
		</SceneFrame>
	);
};
