import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Balance, CountBars} from '../components/KagamiArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue18KyodaiCaptions as c} from '../data/captions';

// 同じ型の兄弟の鏡が、全国に散らばっている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue18Kyodai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue18Kyodai" label="第18の手がかり" title="同じ型の兄弟の鏡が、全国に散らばっている？">
			<Beat name="兄弟の鏡" captions={c} from={0} to={0}>
				<Photo id="c18-chohoji" move="in" label="兄弟の鏡" />
			</Beat>
			<Beat name="同じ顔の鏡" captions={c} from={1} to={2}>
				<Stage label="同じ顔の鏡" labelBottom>
					<ReliefMap view='westjapan' zoom={1.04} pins={[{at: P.manneyama, name: '万年山古墳', sub: '大阪', big: true, t: 6}, {at: P.ishizukayama, name: '福岡', t: 20}, {at: P.nakaoda, name: '広島', t: 30}, {at: P.nishimotomezuka, name: '兵庫', t: 40}, {at: P.tsubai, name: '京都', t: 50}, {at: P.kurozuka, name: '奈良', t: 60}]} lines={[{pts: [P.manneyama, P.ishizukayama], t: 20, dash: true}, {pts: [P.manneyama, P.nakaoda], t: 30, dash: true}, {pts: [P.manneyama, P.nishimotomezuka], t: 40, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="どこにいちばん多い？" captions={c} from={3} to={5}>
				<Stage label="どこにいちばん多い？">
					<CountBars bars={[{label: '奈良', value: 100, accent: true}, {label: '京都', value: 66}, {label: '兵庫', value: 40}, {label: '大阪', value: 38}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="天秤は" captions={c} from={9} to={9}>
				<Stage label="天秤は">
					<Balance from={0} to={-0.35} left={[{text: '三角縁神獣鏡の中心', shaky: true, fresh: true}]} right={[]} note='この重りが効くのは、卑弥呼の鏡なら' />
				</Stage>
			</Beat>
			<Beat name="誰が配った？" captions={c} from={10}>
				<Photo id="c19-tsubai-funkyu" move="in" label="誰が配った？" />
			</Beat>
		</SceneFrame>
	);
};
