import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue18KowasuCaptions as c} from '../data/captions';

// 土偶は、わざと壊された？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue18Kowasu = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue18Kowasu" label="第18の手がかり" title="土偶は、わざと壊された？">
			<Beat name="壊れた姿" captions={c} from={0} to={0}>
				<Photo id="c18-isedotai-dogu" move="in" label="壊れた姿" />
			</Beat>
			<Beat name="どこから出る？" captions={c} from={1} to={1}>
				<Photo id="c18-sekibo-tnm" move="up" label="どこから出る？" />
			</Beat>
			<Beat name="二つの考え" captions={c} from={2} to={3}>
				<Stage label="二つの考え">
					<Cards cards={[{head: 'わざと壊した', body: '病気やけがの\n身代わり', tone: 'red'}, {head: '自然に壊れた', body: '壊れやすい\nつくり'}]} tone='ink' size={50} height={330} top={370} />
				</Stage>
			</Beat>
			<Beat name="国宝 合掌土偶" captions={c} from={4} to={4}>
				<Photo id="c18-gassho" move="in" label="国宝 合掌土偶" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="体にも刻まれた祈り？" captions={c} from={8}>
				<Photo id="c19-yoshigo-view" move="in" label="体にも刻まれた祈り？" />
			</Beat>
		</SceneFrame>
	);
};
