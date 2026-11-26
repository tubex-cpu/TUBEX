import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, Figures} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue25TenrankaiCaptions as c} from '../data/captions';

// 卑弥呼の鏡の謎は、2026年の特別展で解けた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue25Tenrankai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue25Tenrankai" label="第25の手がかり" title="卑弥呼の鏡の謎は、2026年の特別展で解けた？">
			<Beat name="2026年10月31日 九州国立博物館" captions={c} from={0} to={0}>
				<Photo id="c25-kyuhaku-south" move="in" label="2026年10月31日 九州国立博物館" />
			</Beat>
			<Beat name="これまでにない展覧会" captions={c} from={1} to={2}>
				<Stage label="これまでにない展覧会">
					<Figures figs={[{value: '103枚', label: '集められた鏡'}, {value: '53枚', label: '三角縁神獣鏡', accent: true}, {value: '6枚', label: '年号を刻んだ鏡'}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="三角縁神獣鏡がヤマト王権をつくった" captions={c} from={3} to={4}>
				<Photo id="c25-kyuhaku-wa" move="in" label="三角縁神獣鏡がヤマト王権をつくった" />
			</Beat>
			<Beat name="論争は続く" captions={c} from={5} to={5}>
				<Stage label="論争は続く">
					<Cards cards={[{head: '魏で作った', body: ''}, {head: '倭のために特別に', body: ''}, {head: '日本で作った', body: ''}, {head: '海を渡った職人', body: ''}]} tone='ink' size={42} height={240} top={420} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
		</SceneFrame>
	);
};
