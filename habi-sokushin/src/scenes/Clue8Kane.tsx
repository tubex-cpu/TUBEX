import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8KaneCaptions as c} from '../data/captions';

// 土に入った行者は、鉦を鳴らし続けた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue8Kane = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Kane" label="第8の手がかり" title="土に入った行者は、鉦を鳴らし続けた？">
			<Beat name="最も印象的な場面" captions={c} from={0} to={0}>
				<Photo id="okunoin-path" move="in" label="最も印象的な場面" />
			</Beat>
			<Beat name="空気を通す竹の筒" captions={c} from={1} to={1}>
				<Photo id="bamboo-cut" move="in" label="空気を通す竹の筒" />
			</Beat>
			<Beat name="鉦の音が止まるとき" captions={c} from={2} to={3}>
				<Photo id="kane-suda" move="in" label="鉦の音が止まるとき" />
			</Beat>
			<Beat name="各地に残る入定塚" captions={c} from={4} to={4}>
				<Photo id="zuhaku-nyujozuka" move="in" label="各地に残る入定塚" />
			</Beat>
			<Beat name="16世紀の宣教師も" captions={c} from={5} to={5}>
				<Photo id="enku-nyujozuka" move="in" label="16世紀の宣教師も" />
			</Beat>
			<Beat name="福島・宥貞法印の棺" captions={c} from={6} to={7}>
				<Stage label="福島・宥貞法印の棺">
					<Cards cards={[{head: '伝承', body: '棺の中で\n鉦を鳴らした'}, {head: '現存する棺', body: '中で鳴らすのは\n難しい', tone: 'red'}]} tone='ink' size={48} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="みな土に埋められた？" captions={c} from={11}>
				<Photo id="myohoji-sakuragawa-gate" move="in" label="みな土に埋められた？" />
			</Beat>
		</SceneFrame>
	);
};
