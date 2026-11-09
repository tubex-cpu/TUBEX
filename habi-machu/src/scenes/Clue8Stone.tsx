import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Doorway, Drainage} from '../components/MachuArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8StoneCaptions as c} from '../data/captions';

// マチュピチュが崩れないのは、石組みの技のおかげ？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue8Stone = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Stone" label="第8の手がかり" title="マチュピチュが崩れないのは、石組みの技のおかげ？">
			<Beat name="すき間のない石組み" captions={c} from={0} to={0}>
				<Photo id="ashlar-1" move="in" label="すき間のない石組み" />
			</Beat>
			<Beat name="モルタルを使わずに" captions={c} from={1} to={1}>
				<Photo id="ashlar-door" move="in" label="モルタルを使わずに" />
			</Beat>
			<Beat name="地震に強い形？" captions={c} from={2} to={3}>
				<Stage label="地震に強い形？">
					<Doorway />
				</Stage>
			</Beat>
			<Beat name="水の流れを調べる" captions={c} from={4} to={5}>
				<Photo id="fountain-1" move="in" label="水の流れを調べる" />
			</Beat>
			<Beat name="斜面を崩す最大の敵" captions={c} from={6} to={6}>
				<Photo id="uru-pellaea" move="in" label="斜面を崩す最大の敵" />
			</Beat>
			<Beat name="地面の下に隠されたもの" captions={c} from={7} to={8}>
				<Stage label="地面の下に隠されたもの">
					<Drainage />
				</Stage>
			</Beat>
			<Beat name="ただの畑ではない" captions={c} from={9} to={9}>
				<Photo id="terrace-1" move="in" label="ただの畑ではない" />
			</Beat>
			<Beat name="雨水を逃がす" captions={c} from={10} to={10}>
				<Photo id="water-2" move="in" label="雨水を逃がす" />
			</Beat>
			<Beat name="断層の上に建てた？" captions={c} from={11} to={12}>
				<Photo id="quarry-1" move="in" label="断層の上に建てた？" />
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="名を残した人々" captions={c} from={16}>
				<Photo id="aguas-2" move="in" label="名を残した人々" />
			</Beat>
		</SceneFrame>
	);
};
