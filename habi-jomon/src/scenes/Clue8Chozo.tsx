import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {StoragePit} from '../components/JomonArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8ChozoCaptions as c} from '../data/captions';

// 縄文人は、冬のために木の実を貯めていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue8Chozo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Chozo" label="第8の手がかり" title="縄文人は、冬のために木の実を貯めていた？">
			<Beat name="フラスコの形の穴" captions={c} from={0} to={2}>
				<Stage label="フラスコの形の穴">
					<StoragePit />
				</Stage>
			</Beat>
			<Beat name="しぶを抜く" captions={c} from={3} to={3}>
				<Photo id="c08-chestnuts" move="in" label="しぶを抜く" />
			</Beat>
			<Beat name="秋の恵みで冬を越える" captions={c} from={4} to={4}>
				<Photo id="c08-goshono-storehouse" move="right" label="秋の恵みで冬を越える" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="縄文人の技術は" captions={c} from={8}>
				<Photo id="c08-sannai-storehouses" move="in" label="縄文人の技術は" />
			</Beat>
		</SceneFrame>
	);
};
