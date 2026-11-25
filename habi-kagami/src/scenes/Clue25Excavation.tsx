import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {LegendGap, Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue25ExcavationCaptions as c} from '../data/captions';

// 仏海上人の遺体は、58年後に掘り出された？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue25Excavation = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue25Excavation" label="第25の手がかり" title="仏海上人の遺体は、58年後に掘り出された？">
			<Beat name="1961年7月" captions={c} from={0} to={1}>
				<Stage label="1961年7月">
					<LegendGap from={1895} to={1970} marks={[{year: 1903, label: '仏海が\n亡くなる'}, {year: 1961, label: '墓が\n掘り起こされる', story: true}]} gapLabel='58年' />
				</Stage>
			</Beat>
			<Beat name="冒頭の場面" captions={c} from={2} to={3}>
				<Photo id="iegata-sekkan" move="in" label="冒頭の場面" />
			</Beat>
			<Beat name="棺の中の仏海" captions={c} from={4} to={5}>
				<Stage label="棺の中の仏海">
					<Scroll text={'一部ミイラ化\nせるも\n概ね腐敗'} source='小片保『民族衛生』1962年（要約）' tone='ember' />
				</Stage>
			</Beat>
			<Beat name="パラフィンで座禅の姿に" captions={c} from={6} to={6}>
				<Photo id="funagata-mokkan" move="in" label="パラフィンで座禅の姿に" />
			</Beat>
			<Beat name="村上の寺町" captions={c} from={7} to={8}>
				<Photo id="murakami-kyoouji-gate" move="in" label="村上の寺町" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="土中入定と即身仏" captions={c} from={12}>
				<Photo id="akagawa-green" move="in" label="土中入定と即身仏" />
			</Beat>
		</SceneFrame>
	);
};
