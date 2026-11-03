import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue14IronCaptions as c} from '../data/captions';

// 出雲の力は、鉄から生まれた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue14Iron = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue14Iron" label="第14の手がかり" title="出雲の力は、鉄から生まれた？">
			<Beat name="鉄の国、出雲？" captions={c} from={0} to={1}>
				<Photo id="wako-museum" move="in" label="鉄の国、出雲？" />
			</Beat>
			<Beat name="鉄の剣" captions={c} from={2} to={3}>
				<Photo id="kanbara-iron" move="in" label="鉄の剣" />
			</Beat>
			<Beat name="使うことと、作ること" captions={c} from={4} to={5}>
				<Photo id="forge-edo" move="in" label="使うことと、作ること" />
			</Beat>
			<Beat name="鉄の材料は、どこから？" captions={c} from={6} to={6}>
				<Photo id="gaya-slag" move="in" label="鉄の材料は、どこから？" />
			</Beat>
			<Beat name="鉄を作った、古い跡は？" captions={c} from={7} to={8}>
				<Stage label="鉄を作った、古い跡は？" labelBottom>
					<ReliefMap view='chugoku' focus={[132.8, 35.1]} zoom={1.9} pins={[{at: P.imasaya, name: '今佐屋山遺跡', sub: '石見・古墳時代の後半', t: 10, big: true, dx: -60, dy: 80}, {at: P.okuizumo, name: '仁多郡', sub: '風土記に鉄', t: 50, dx: 120, dy: 10}, {at: P.taisha, name: '出雲大社', t: 30, dx: -60}]} />
				</Stage>
			</Beat>
			<Beat name="奈良時代には" captions={c} from={9} to={9}>
				<Photo id="tatara-site" move="in" label="奈良時代には" />
			</Beat>
			<Beat name="出雲の鉄の歩み" captions={c} from={10} to={10}>
				<Stage label="出雲の鉄の歩み">
					<TimeBar stops={[{label: '弥生', sub: '海の向こうから\n手に入れる'}, {label: '古墳後期', sub: '石見で\n鉄を作る'}, {label: '733年', sub: '風土記に\n出雲の鉄'}, {label: '江戸', sub: 'たたら製鉄が\n栄える', accent: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="力の源は？" captions={c} from={11} to={12}>
				<Photo id="kanbara-sword" move="in" label="力の源は？" />
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="なぜ、国を譲った？" captions={c} from={16}>
				<Photo id="inasa-pano-w" move="scroll" label="なぜ、国を譲った？" />
			</Beat>
		</SceneFrame>
	);
};
