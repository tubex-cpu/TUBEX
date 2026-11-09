import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3FortressCaptions as c} from '../data/captions';

// マチュピチュは、インカ最後の要塞だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue3Fortress = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Fortress" label="第3の手がかり" title="マチュピチュは、インカ最後の要塞だった？">
			<Beat name="切り立った崖の上" captions={c} from={0} to={2}>
				<Photo id="mp-dd37" move="in" label="切り立った崖の上" />
			</Beat>
			<Beat name="インカ最後の拠点は？" captions={c} from={3} to={4}>
				<Stage label="インカ最後の拠点は？" labelBottom>
					<ReliefMap view='cusco' focus={P.machu} zoom={1.1} pins={[{at: P.machu, name: 'マチュピチュ', big: true, t: 10}, {at: P.vilcabamba, name: 'エスピリトゥ・パンパ', sub: 'ビルカバンバ', t: 40, dy: -90}]} />
				</Stage>
			</Beat>
			<Beat name="戦いの跡は？" captions={c} from={5} to={5}>
				<Photo id="espiritu-pampa" move="in" label="戦いの跡は？" />
			</Beat>
			<Beat name="16世紀の文書" captions={c} from={6} to={7}>
				<Stage label="16世紀の文書">
					<Figures figs={[{value: '1990', label: '年', small: 'ジョン・ロウの研究'}, {value: '16', label: '世紀', small: '谷の畑の一覧', accent: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="インカ王パチャクテク" captions={c} from={8} to={9}>
				<Photo id="pachacuti-brooklyn" move="in" label="インカ王パチャクテク" />
			</Beat>
			<Beat name="ウルバンバ川の谷" captions={c} from={10} to={10}>
				<Stage label="ウルバンバ川の谷" labelBottom>
					<ReliefMap view='cusco' zoom={1.1} focus={P.ollantay} pins={[{at: P.machu, name: 'マチュピチュ', big: true, t: 30}, {at: P.cusco, name: 'クスコ', sub: '都', t: 10}]} areas={[{at: [-72.3, -13.25], r: 170, t: 60, label: '王の領地？', dy: 15}]} />
				</Stage>
			</Beat>
			<Beat name="王の離宮" captions={c} from={11} to={12}>
				<Photo id="royal-residence" move="in" label="王の離宮" />
			</Beat>
			<Beat name="別の考えも" captions={c} from={13} to={13}>
				<Photo id="intihuatana-1" move="in" label="別の考えも" />
			</Beat>
			<Beat name="判決" captions={c} from={14} to={16}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 14, 15, fps)} />
			</Beat>
			<Beat name="いつ建てられた？" captions={c} from={17}>
				<Photo id="main-temple-1" move="in" label="いつ建てられた？" />
			</Beat>
		</SceneFrame>
	);
};
