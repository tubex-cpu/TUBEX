import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1RebelCaptions as c} from '../data/captions';

// 平将門は、朝廷に逆らった悪人？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue1Rebel = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Rebel" label="第1の手がかり" title="平将門は、朝廷に逆らった悪人？">
			<Beat name="平将門" captions={c} from={0} to={1}>
				<Photo id="masakado-kunisada" move="in" label="平将門" />
			</Beat>
			<Beat name="坂東市 石井営所跡" captions={c} from={2} to={3}>
				<Photo id="iwai-eisho" move="in" label="坂東市 石井営所跡" />
			</Beat>
			<Beat name="国府を次々に" captions={c} from={4} to={6}>
				<Stage label="国府を次々に" labelBottom>
					<ReliefMap view='kanto' zoom={1.05} pins={[{at: P.iwai, name: '石井', sub: '将門の本拠', big: true, t: 6}, {at: P.hitachi, name: '常陸国府', t: 20}, {at: P.shimotsuke, name: '下野国府', t: 50, dy: 70}, {at: P.kozuke, name: '上野国府', t: 75, dy: 70}]} lines={[{pts: [P.iwai, P.hitachi], t: 12, len: 20, arrow: true}, {pts: [P.iwai, P.shimotsuke], t: 42, len: 20, arrow: true}, {pts: [P.shimotsuke, P.kozuke], t: 66, len: 22, arrow: true}]} />
				</Stage>
			</Beat>
			<Beat name="朝廷から見れば" captions={c} from={7} to={7}>
				<Photo id="iwai-eisho-stone" move="in" label="朝廷から見れば" />
			</Beat>
			<Beat name="関東で語り継がれた姿" captions={c} from={8} to={9}>
				<Photo id="kokuo-shrine" move="in" label="関東で語り継がれた姿" />
			</Beat>
			<Beat name="民衆の英雄？" captions={c} from={10} to={11}>
				<Photo id="masakado-geese-moon" move="in" label="民衆の英雄？" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="なぜ「新しい天皇」を？" captions={c} from={15}>
				<Photo id="masakado-kunisada-katata" move="in" label="なぜ「新しい天皇」を？" />
			</Beat>
		</SceneFrame>
	);
};
