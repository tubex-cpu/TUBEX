import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Lineage} from '../components/IzumoArt3';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue18KokusoCaptions as c} from '../data/captions';

// 出雲大社を守る家は、神話の神の子孫？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue18Kokuso = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue18Kokuso" label="第18の手がかり" title="出雲大社を守る家は、神話の神の子孫？">
			<Beat name="出雲国造" captions={c} from={0} to={1}>
				<Photo id="senge-takatomi" move="in" label="出雲国造" />
			</Beat>
			<Beat name="祖先は、アメノホヒ？" captions={c} from={2} to={4}>
				<Photo id="kumano-taisha" move="in" label="祖先は、アメノホヒ？" />
			</Beat>
			<Beat name="2つの家に" captions={c} from={5} to={5}>
				<Photo id="kamosu-shrine" move="in" label="2つの家に" />
			</Beat>
			<Beat name="記録では、いつまで？" captions={c} from={6} to={6}>
				<Stage label="記録では、いつまで？">
					<Lineage />
				</Stage>
			</Beat>
			<Beat name="716年、都で" captions={c} from={7} to={8}>
				<Photo id="engishiki" move="in" label="716年、都で" />
			</Beat>
			<Beat name="国造は、都に上った？" captions={c} from={9} to={10}>
				<Stage label="国造は、都に上った？" labelBottom>
					<ReliefMap view='nihonkai' focus={[134.6, 35.0]} zoom={1.35} pins={[{at: P.taisha, name: '出雲', t: 6}, {at: P.nara, name: '都', big: true, t: 50}]} lines={[{pts: [P.taisha, P.nara], t: 14, len: 60, arrow: true}]} />
				</Stage>
			</Beat>
			<Beat name="服従か、祝福か" captions={c} from={11} to={12}>
				<Photo id="kamosu-shrine-2" move="in" label="服従か、祝福か" />
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="神在月の夜、出雲では？" captions={c} from={16}>
				<Photo id="kumano-haiden" move="in" label="神在月の夜、出雲では？" />
			</Beat>
		</SceneFrame>
	);
};
