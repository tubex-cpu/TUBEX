import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {LegendGap} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue14SeiryodenCaptions as c} from '../data/captions';

// 清涼殿の落雷は、当時から道真の祟りとして恐れられた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue14Seiryoden = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue14Seiryoden" label="第14の手がかり" title="清涼殿の落雷は、当時から道真の祟りとして恐れられた？">
			<Beat name="923年 皇太子の死" captions={c} from={0} to={0}>
				<Photo id="engi-mortuary" move="in" label="923年 皇太子の死" />
			</Beat>
			<Beat name="『日本紀略』" captions={c} from={1} to={2}>
				<Stage label="『日本紀略』">
					<Cards cards={[{head: '923年の記録', body: '世の人は言った\n「道真の霊のしわざ」', tone: 'red'}]} tone='ink' size={52} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="止まらない不幸" captions={c} from={3} to={4}>
				<Stage label="止まらない不幸">
					<TimeBar stops={[{label: '923年', sub: '名誉を回復'}, {label: '925年', sub: '次の皇太子も'}, {label: '930年', sub: '清涼殿に雷', accent: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="930年6月26日 清涼殿" captions={c} from={5} to={5}>
				<Photo id="seiryoden" move="in" label="930年6月26日 清涼殿" />
			</Beat>
			<Beat name="天皇の住まいに雷" captions={c} from={6} to={6}>
				<Photo id="engi-seiryoden" move="in" label="天皇の住まいに雷" />
			</Beat>
			<Beat name="醍醐天皇は" captions={c} from={7} to={7}>
				<Photo id="seiryoden-inside" move="in" label="醍醐天皇は" />
			</Beat>
			<Beat name="当時の記録に、道真の名は？" captions={c} from={8} to={9}>
				<Stage label="当時の記録に、道真の名は？">
					<LegendGap from={900} to={960} marks={[{year: 923, label: '道真の霊が\n初めて記録に'}, {year: 930, label: '清涼殿の落雷', sub: '記録に道真の名は？'}, {year: 941, label: '落雷と道真が\n結びつく', sub: '日蔵の話', story: true}]} gapLabel='落雷と道真が結びつくまで' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="祟りの物語は、どう描かれた？" captions={c} from={13}>
				<Photo id="engi-met-thunder" move="in" label="祟りの物語は、どう描かれた？" />
			</Beat>
		</SceneFrame>
	);
};
