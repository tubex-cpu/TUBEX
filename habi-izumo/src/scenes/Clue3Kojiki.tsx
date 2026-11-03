import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {FiveNames, KojikiShare} from '../components/IzumoArt1';
import {Cards, Figures} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3KojikiCaptions as c} from '../data/captions';

// 古事記の神話の3分の1は、出雲の話？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue3Kojiki = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Kojiki" label="第3の手がかり" title="古事記の神話の3分の1は、出雲の話？">
			<Beat name="3巻のうち、上巻には？" captions={c} from={0} to={3}>
				<Stage label="3巻のうち、上巻には？">
					<KojikiShare />
				</Stage>
			</Beat>
			<Beat name="出雲に降り立った神" captions={c} from={4} to={4}>
				<Photo id="orochi-yoshitoshi-1" move="in" label="出雲に降り立った神" />
			</Beat>
			<Beat name="須賀の地に、宮を" captions={c} from={5} to={5}>
				<Photo id="suga-shrine" move="in" label="須賀の地に、宮を" />
			</Beat>
			<Beat name="大国主の神" captions={c} from={6} to={6}>
				<Photo id="musubi-statue" move="in" label="大国主の神" />
			</Beat>
			<Beat name="因幡の白兎" captions={c} from={7} to={7}>
				<Photo id="hakuto-coast" move="in" label="因幡の白兎" />
			</Beat>
			<Beat name="いくつもの名前？" captions={c} from={8} to={8}>
				<Stage label="いくつもの名前？">
					<FiveNames />
				</Stage>
			</Beat>
			<Beat name="国を造った神" captions={c} from={9} to={9}>
				<Photo id="okuninushi-kyoto" move="in" label="国を造った神" />
			</Beat>
			<Beat name="不思議なこと" captions={c} from={10} to={11}>
				<Photo id="izanagi-eitaku" move="in" label="不思議なこと" />
			</Beat>
			<Beat name="2つの本で、何が違う？" captions={c} from={12} to={13}>
				<Stage label="2つの本で、何が違う？">
					<Cards cards={[{head: '古事記', body: '出雲の物語が\nくわしい', tone: 'gold'}, {head: '日本書紀', body: '本文では\n多くが\n出てこない', tone: 'dark'}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="なぜ、古事記だけが？" captions={c} from={14} to={15}>
				<Photo id="hakuto-usagi" move="in" label="なぜ、古事記だけが？" />
			</Beat>
			<Beat name="3分の1は、正確？" captions={c} from={16} to={16}>
				<Stage label="3分の1は、正確？">
					<Figures figs={[{value: '約⅓', label: 'の数え方は？', small: '上巻か、神話全体か', accent: true}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={17} to={19}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 17, 18, fps)} />
			</Beat>
			<Beat name="出雲の人々は、どう語った？" captions={c} from={20}>
				<Photo id="shimane-peninsula-sea" move="out" label="出雲の人々は、どう語った？" />
			</Beat>
		</SceneFrame>
	);
};
