import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue10DenpunCaptions as c} from '../data/captions';

// 縄文人の体は、でんぷんを食べこなせた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue10Denpun = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Denpun" label="第10の手がかり" title="縄文人の体は、でんぷんを食べこなせた？">
			<Beat name="2026年7月 金沢大学など" captions={c} from={0} to={0}>
				<Photo id="c10-kanazawa-univ" move="in" label="2026年7月 金沢大学など" />
			</Beat>
			<Beat name="縄文の女性" captions={c} from={1} to={1}>
				<Stage label="縄文の女性" labelBottom>
					<ReliefMap view='archipelago' zoom={1.25} focus={P.iyai} pins={[{at: P.iyai, name: '群馬県の岩陰の遺跡', sub: '8000年以上前', big: true, t: 8}]} />
				</Stage>
			</Beat>
			<Beat name="つばの酵素の遺伝子" captions={c} from={2} to={2}>
				<Photo id="c10-dna-helix" move="out" label="つばの酵素の遺伝子" />
			</Beat>
			<Beat name="人によって違う数" captions={c} from={3} to={3}>
				<Photo id="c10-pipette" move="in" label="人によって違う数" />
			</Beat>
			<Beat name="その数は" captions={c} from={4} to={4}>
				<Stage label="その数は">
					<Figures figs={[{value: '9', label: '縄文の女性', small: '遺伝子の数（およそ）', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="米づくりより前から" captions={c} from={5} to={5}>
				<Photo id="c10-naganohara-asama" move="in" label="米づくりより前から" />
			</Beat>
			<Beat name="慎重な言い方" captions={c} from={6} to={6}>
				<Stage label="慎重な言い方">
					<Figures figs={[{value: '2人', label: '調べられた人数', small: '縄文と弥生'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="寒さに強い体？" captions={c} from={10}>
				<Photo id="spare-agatsuma-valley" move="up" label="寒さに強い体？" />
			</Beat>
		</SceneFrame>
	);
};
