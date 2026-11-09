import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Kinship} from '../components/MachuArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6PeopleCaptions as c} from '../data/captions';

// マチュピチュの住人は、地元の人々だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue6People = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6People" label="第6の手がかり" title="マチュピチュの住人は、地元の人々だった？">
			<Beat name="2023年7月の論文" captions={c} from={0} to={2}>
				<Stage label="2023年7月の論文">
					<Figures figs={[{value: '68', label: '人', small: '遺伝子を調べた人数（2023年の論文）'}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="帝国のあちこちから" captions={c} from={3} to={5}>
				<Stage label="帝国のあちこちから" labelBottom>
					<ReliefMap view='sudamerica' zoom={1.15} focus={P.machu} pins={[{at: P.machu, name: 'マチュピチュ', big: true, t: 70}]} areas={[{at: P.coast, r: 70, t: 10, label: '海岸', dy: -95}, {at: P.highland, r: 70, t: 25, label: '高地', dy: -95}, {at: P.amazon, r: 90, t: 40, label: 'アマゾン', dy: -115}]} lines={[{pts: [P.coast, P.machu], t: 60, arrow: true}, {pts: [P.highland, P.machu], t: 70, arrow: true}, {pts: [P.amazon, P.machu], t: 80, arrow: true}]} />
				</Stage>
			</Beat>
			<Beat name="血のつながりは？" captions={c} from={6} to={8}>
				<Stage label="血のつながりは？">
					<Kinship />
				</Stage>
			</Beat>
			<Beat name="王に仕えた人々" captions={c} from={9} to={10}>
				<Photo id="guaman-chasqui" move="in" label="王に仕えた人々" />
			</Beat>
			<Beat name="国際的な共同体" captions={c} from={11} to={12}>
				<Photo id="mp-misty-unsplash" move="in" label="国際的な共同体" />
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="なぜ知られずに残った？" captions={c} from={16}>
				<Photo id="sacsay-1" move="in" label="なぜ知られずに残った？" />
			</Beat>
		</SceneFrame>
	);
};
