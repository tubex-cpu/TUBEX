import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8SeenCaptions as c} from '../data/captions';

// 草薙剣を、実際に見た人がいる？（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Clue8Seen = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Seen" label="第8の手がかり" title="草薙剣を、実際に見た人がいる？">
			<Beat name="江戸時代の記述" captions={c} from={0} to={1}>
				<Photo id="atsuta-nobunaga-wall" move="in" label="江戸時代の記述" />
			</Beat>
			<Beat name="記述された剣の姿" captions={c} from={2} to={2}>
				<Stage label="記述された剣の姿">
					<Figures figs={[{value: '85', label: 'cm', small: '記述された長さ'}]} tone='ink' note='刃先は菖蒲の葉のよう、全体は白っぽい（記述より）' />
				</Stage>
			</Beat>
			<Beat name="『神器考証』（1898年）が引く記述" captions={c} from={3} to={4}>
				<Photo id="real-shinki-sword-account" move="in" label="『神器考証』（1898年）が引く記述" />
			</Beat>
			<Beat name="伝え聞いた話" captions={c} from={5} to={6}>
				<Photo id="sword-bronze" move="in" label="伝え聞いた話" />
			</Beat>
			<Beat name="岐阜・高山の水無神社" captions={c} from={7} to={7}>
				<Photo id="real-minashi-haiden" move="in" label="岐阜・高山の水無神社" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="いまの伊勢の動き" captions={c} from={11}>
				<Photo id="naiku-aerial-1953" move="in" label="いまの伊勢の動き" />
			</Beat>
		</SceneFrame>
	);
};
