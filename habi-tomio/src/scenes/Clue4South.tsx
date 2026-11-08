import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4SouthCaptions as c} from '../data/captions';

// 蛇行剣は、南九州で生まれた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Clue4South = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4South" label="第4の手がかり" title="蛇行剣は、南九州で生まれた？">
			<Beat name="ほかの古墳からも" captions={c} from={0} to={1}>
				<Photo id="chasuri-mirror" move="in" label="ほかの古墳からも" />
			</Beat>
			<Beat name="多いのは、どこ？" captions={c} from={2} to={2}>
				<Stage label="多いのは、どこ？" labelBottom>
					<ReliefMap view='nishinihon' focus={P.ebino} zoom={1.3} pins={[{at: P.ebino, name: 'えびの市', sub: '1か所で10本', big: true, t: 10}, {at: P.saitobaru, name: '西都原古墳群', t: 30, dx: 120}]} />
				</Stage>
			</Beat>
			<Beat name="地下式横穴墓" captions={c} from={3} to={3}>
				<Photo id="chikashiki-zu" move="in" label="地下式横穴墓" />
			</Beat>
			<Beat name="南九州の剣？" captions={c} from={4} to={4}>
				<Photo id="ikime-tomb" move="in" label="南九州の剣？" />
			</Beat>
			<Beat name="どちらが古い？" captions={c} from={5} to={7}>
				<Stage label="どちらが古い？" labelBottom>
					<ReliefMap view='nishinihon' zoom={1.1} pins={[{at: P.ebino, name: '南九州', sub: '5〜6世紀が多い', t: 10}, {at: P.tomio, name: '富雄丸山古墳', sub: '4世紀後半', big: true, t: 40}]} lines={[{pts: [P.tomio, P.ebino], t: 60, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="これまでの最長は？" captions={c} from={8} to={8}>
				<Photo id="munohara-kabuto" move="in" label="これまでの最長は？" />
			</Beat>
			<Beat name="見直しを迫られる考え" captions={c} from={9} to={9}>
				<Photo id="saito-oni" move="in" label="見直しを迫られる考え" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="盾の形の鏡は？" captions={c} from={13}>
				<Photo id="daryu-yanai" move="in" label="盾の形の鏡は？" />
			</Beat>
		</SceneFrame>
	);
};
