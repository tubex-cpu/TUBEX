import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3RegaliaCaptions as c} from '../data/captions';

// 三種の神器は、すべて皇居にある？（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Clue3Regalia = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Regalia" label="第3の手がかり" title="三種の神器は、すべて皇居にある？">
			<Beat name="三種の神器" captions={c} from={0} to={0}>
				<Stage label="三種の神器">
					<Cards cards={[{head: '鏡', body: '八咫鏡'}, {head: '剣', body: '草薙剣'}, {head: '勾玉', body: '八尺瓊勾玉'}]} tone='ink' size={52} height={300} top={400} />
				</Stage>
			</Beat>
			<Beat name="孫に授けた神器" captions={c} from={1} to={2}>
				<Photo id="tenson-korin" move="in" label="孫に授けた神器" />
			</Beat>
			<Beat name="天皇の位のしるし" captions={c} from={3} to={3}>
				<Photo id="enthronement-2019" move="in" label="天皇の位のしるし" />
			</Beat>
			<Beat name="2019年5月1日" captions={c} from={4} to={4}>
				<Photo id="kenji-2019" move="in" label="2019年5月1日" />
			</Beat>
			<Beat name="勾玉は、皇居に" captions={c} from={5} to={6}>
				<Photo id="magatama-jade" move="in" label="勾玉は、皇居に" />
			</Beat>
			<Beat name="本体は、どこに？" captions={c} from={7} to={8}>
				<Stage label="本体は、どこに？" labelBottom>
					<ReliefMap view='honshu' zoom={1.05} focus={P.atsuta} pins={[{at: P.naiku, name: '伊勢神宮', sub: '八咫鏡', big: true, t: 10, dx: -150, dy: 40}, {at: P.atsuta, name: '熱田神宮', sub: '草薙剣', big: true, t: 40}, {at: P.kokyo, name: '皇居', sub: '勾玉と形代', t: 70}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="天皇でさえ見られない？" captions={c} from={12}>
				<Photo id="mirror-naiko" move="in" label="天皇でさえ見られない？" />
			</Beat>
		</SceneFrame>
	);
};
