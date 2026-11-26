import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {PollenFall} from '../components/JomonArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7KuriCaptions as c} from '../data/captions';

// 縄文人は、クリの森を育てていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue7Kuri = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Kuri" label="第7の手がかり" title="縄文人は、クリの森を育てていた？">
			<Beat name="クリの花粉" captions={c} from={0} to={0}>
				<Photo id="c07-chestnut-flowers" move="in" label="クリの花粉" />
			</Beat>
			<Beat name="村のまわりは" captions={c} from={1} to={2}>
				<Stage label="村のまわりは">
					<PollenFall />
				</Stage>
			</Beat>
			<Beat name="なぜクリばかり？" captions={c} from={3} to={3}>
				<Stage label="なぜクリばかり？">
					<Cards cards={[{head: '自然の森', body: 'いろいろな木が\n混ざる'}, {head: '三内丸山', body: 'クリばかり', tone: 'red'}]} tone='moss' size={50} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="残し、育てた？" captions={c} from={4} to={4}>
				<Photo id="c14-sannai-village" move="in" label="残し、育てた？" />
			</Beat>
			<Beat name="2025年 アズキの研究" captions={c} from={5} to={5}>
				<Photo id="c07-azuki" move="in" label="2025年 アズキの研究" />
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="冬まで、どう保った？" captions={c} from={9}>
				<Photo id="c08-konara-acorns" move="in" label="冬まで、どう保った？" />
			</Beat>
		</SceneFrame>
	);
};
