import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {LegendGap} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue25FearedCaptions as c} from '../data/captions';

// 崇徳上皇は、亡くなってすぐに怨霊として恐れられた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue25Feared = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue25Feared" label="第25の手がかり" title="崇徳上皇は、亡くなってすぐに怨霊として恐れられた？">
			<Beat name="都では何が起きたのか" captions={c} from={0} to={2}>
				<Stage label="都では何が起きたのか">
					<LegendGap from={1150} to={1190} marks={[{year: 1164, label: '崇徳上皇が\n亡くなる'}, {year: 1177, label: '怨霊を疑う\n日記の記録', story: true}]} gapLabel='およそ13年' />
				</Stage>
			</Beat>
			<Beat name="続いた不幸" captions={c} from={3} to={4}>
				<Stage label="続いた不幸">
					<TimeBar stops={[{label: '1176年', sub: '近しい人々が亡くなる'}, {label: '1177年4月', sub: '大火事', accent: true}, {label: '1177年6月', sub: '鹿ケ谷の陰謀'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="貴族の日記には" captions={c} from={5} to={5}>
				<Photo id="yasui-torii" move="in" label="貴族の日記には" />
			</Beat>
			<Beat name="贈られた名" captions={c} from={6} to={6}>
				<Stage label="贈られた名">
					<Cards cards={[{head: 'これまで', body: '讃岐院'}, {head: '1177年', body: '崇徳院', tone: 'gold'}]} tone='shrine' size={60} height={300} top={390} />
				</Stage>
			</Beat>
			<Beat name="都に建てられた社" captions={c} from={7} to={7}>
				<Photo id="sutoku-mausoleum-kyoto" move="in" label="都に建てられた社" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="霊は、その後どうなった？" captions={c} from={11}>
				<Photo id="sutoku-monument" move="in" label="霊は、その後どうなった？" />
			</Beat>
		</SceneFrame>
	);
};
