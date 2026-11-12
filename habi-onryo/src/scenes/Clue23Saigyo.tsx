import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Relations, Scroll} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue23SaigyoCaptions as c} from '../data/captions';

// 崇徳上皇の墓を、西行は本当に訪ねた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue23Saigyo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue23Saigyo" label="第23の手がかり" title="崇徳上皇の墓を、西行は本当に訪ねた？">
			<Beat name="歌人・西行" captions={c} from={0} to={1}>
				<Stage label="歌人・西行">
					<Relations nodes={[{id: 'sa', x: 560, y: 560, name: '西行', sub: '歌人'}, {id: 'su', x: 1360, y: 560, name: '崇徳上皇', sub: '歌を愛した上皇', hot: true}]} edges={[{a: 'sa', b: 'su', label: '和歌の友'}]} />
				</Stage>
			</Beat>
			<Beat name="1168年 四国へ" captions={c} from={2} to={4}>
				<Stage label="1168年 四国へ" labelBottom>
					<ReliefMap view='west' zoom={1.25} focus={P.shiramine} pins={[{at: P.kyoto, name: '京', t: 6}, {at: P.shiramine, name: '白峯', sub: '崇徳上皇の墓', big: true, t: 40}]} lines={[{pts: [P.kyoto, P.shiramine], t: 12, len: 40, arrow: true, dash: true, bend: -0.2}]} />
				</Stage>
			</Beat>
			<Beat name="荒れ果てた墓の前で" captions={c} from={5} to={5}>
				<Photo id="shiramine-goryo" move="in" label="荒れ果てた墓の前で" />
			</Beat>
			<Beat name="西行の一首" captions={c} from={6} to={7}>
				<Stage label="西行の一首">
					<Scroll text={'よしや君\n昔の玉の床とても\nかからん後は\n何にかはせん'} source='西行の歌集より' />
				</Stage>
			</Beat>
			<Beat name="歌集に残る旅" captions={c} from={8} to={9}>
				<Photo id="tonshoji-chokugaku" move="in" label="歌集に残る旅" />
			</Beat>
			<Beat name="『雨月物語』「白峯」へ" captions={c} from={10} to={10}>
				<Photo id="foxfire-hiroshige" move="in" label="『雨月物語』「白峯」へ" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="物語の中の上皇" captions={c} from={14}>
				<Photo id="yasui-shaden" move="in" label="物語の中の上皇" />
			</Beat>
		</SceneFrame>
	);
};
