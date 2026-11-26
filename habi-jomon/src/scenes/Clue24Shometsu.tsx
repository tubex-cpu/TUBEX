import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {CountBars} from '../components/KagamiArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue24ShometsuCaptions as c} from '../data/captions';

// 縄文人は、消滅した？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue24Shometsu = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue24Shometsu" label="第24の手がかり" title="縄文人は、消滅した？">
			<Beat name="いまの日本人の遺伝子" captions={c} from={0} to={0}>
				<Photo id="c24-sefa-utaki" move="in" label="いまの日本人の遺伝子" />
			</Beat>
			<Beat name="受け継いだ割合" captions={c} from={1} to={2}>
				<Stage label="受け継いだ割合">
					<CountBars bars={[{label: '近畿', value: 13}, {label: '東北', value: 19}, {label: '沖縄', value: 28, accent: true}]} unit='%' max={30} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="私たちの体の中に" captions={c} from={3} to={3}>
				<Photo id="c24-hibikinada" move="in" label="私たちの体の中に" />
			</Beat>
			<Beat name="判決" captions={c} from={4} to={6}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 4, 5, fps)} />
			</Beat>
		</SceneFrame>
	);
};
