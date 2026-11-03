import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TombSection, YosumiTomb} from '../components/IzumoArt2';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue12KingCaptions as c} from '../data/captions';

// 出雲には、王がいた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue12King = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue12King" label="第12の手がかり" title="出雲には、王がいた？">
			<Beat name="西谷の、奇妙な墓" captions={c} from={0} to={1}>
				<Photo id="nishidani-3" move="in" label="西谷の、奇妙な墓" />
			</Beat>
			<Beat name="どれほどの大きさ？" captions={c} from={2} to={3}>
				<Stage label="どれほどの大きさ？">
					<YosumiTomb />
				</Stage>
			</Beat>
			<Beat name="石を貼った斜面" captions={c} from={4} to={5}>
				<Photo id="nishidani-2" move="in" label="石を貼った斜面" />
			</Beat>
			<Beat name="墓の中には？" captions={c} from={6} to={9}>
				<Stage label="墓の中には？">
					<TombSection />
				</Stage>
			</Beat>
			<Beat name="出雲平野の王？" captions={c} from={10} to={10}>
				<Photo id="mukibanda-yosumi" move="in" label="出雲平野の王？" />
			</Beat>
			<Beat name="同じ形の墓は、どこに？" captions={c} from={11} to={13}>
				<Stage label="同じ形の墓は、どこに？" labelBottom>
					<ReliefMap view='nihonkai' focus={[134.5, 36.0]} zoom={1.2} areas={[{at: [133.3, 35.3], r: 150, color: '#e9a13b', label: '約90基', t: 10}, {at: [137.0, 36.6], r: 90, color: '#7fd0a0', label: '8基', t: 50}]} pins={[{at: P.taisha, name: '出雲', t: 5, dx: -110, dy: -10}]} />
				</Stage>
			</Beat>
			<Beat name="王の墓を舞台に" captions={c} from={14} to={14}>
				<Photo id="sugitani-4" move="in" label="王の墓を舞台に" />
			</Beat>
			<Beat name="判決" captions={c} from={15} to={17}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 15, 16, fps)} />
			</Beat>
			<Beat name="出雲の中だけで？" captions={c} from={18}>
				<Photo id="mukibanda-sentani" move="in" label="出雲の中だけで？" />
			</Beat>
		</SceneFrame>
	);
};
