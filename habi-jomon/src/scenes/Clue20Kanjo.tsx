import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {SunLine} from '../components/JomonArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue20KanjoCaptions as c} from '../data/captions';

// 縄文のストーンサークルは、太陽の暦だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue20Kanjo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue20Kanjo" label="第20の手がかり" title="縄文のストーンサークルは、太陽の暦だった？">
			<Beat name="秋田県 大湯環状列石" captions={c} from={0} to={0}>
				<Photo id="c20-oyu-nonakado" move="in" label="秋田県 大湯環状列石" />
			</Beat>
			<Beat name="石が指す方向" captions={c} from={1} to={2}>
				<Stage label="石が指す方向">
					<SunLine />
				</Stage>
			</Beat>
			<Beat name="石の下から" captions={c} from={3} to={3}>
				<Photo id="c20-oyu-manza" move="in" label="石の下から" />
			</Beat>
			<Beat name="判決" captions={c} from={4} to={6}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 4, 5, fps)} />
			</Beat>
			<Beat name="二つ目の問い" captions={c} from={7}>
				<Photo id="c21-oyu-snow" move="in" label="二つ目の問い" />
			</Beat>
		</SceneFrame>
	);
};
