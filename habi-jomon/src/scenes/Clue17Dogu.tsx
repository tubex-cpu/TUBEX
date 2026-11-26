import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Flow, Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue17DoguCaptions as c} from '../data/captions';

// 土偶は、宇宙人をかたどった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue17Dogu = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue17Dogu" label="第17の手がかり" title="土偶は、宇宙人をかたどった？">
			<Beat name="縄文の祈り" captions={c} from={0} to={0}>
				<Photo id="c17-heart-dogu" move="in" label="縄文の祈り" />
			</Beat>
			<Beat name="宇宙人？" captions={c} from={1} to={1}>
				<Photo id="c17-shakoki-kamegaoka" move="up" label="宇宙人？" />
			</Beat>
			<Beat name="その名前の由来" captions={c} from={2} to={2}>
				<Stage label="その名前の由来">
					<Scroll text={'遮光器'} source='1891年 坪井正五郎' />
				</Stage>
			</Beat>
			<Beat name="あの目は" captions={c} from={3} to={3}>
				<Photo id="c17-shakoki-face" move="in" label="あの目は" />
			</Beat>
			<Beat name="東北の北部で" captions={c} from={4} to={4}>
				<Stage label="東北の北部で">
					<Flow steps={[{head: '晩期の土偶'}, {head: '形が少しずつ\n変わる'}, {head: '遮光器土偶', hot: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="何のために？" captions={c} from={8}>
				<Photo id="c18-shimoyakebe-dogu" move="in" label="何のために？" />
			</Beat>
		</SceneFrame>
	);
};
