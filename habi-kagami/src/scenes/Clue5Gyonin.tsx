import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5GyoninCaptions as c} from '../data/captions';

// 即身仏を目指したのは、位の高い僧だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue5Gyonin = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Gyonin" label="第5の手がかり" title="即身仏を目指したのは、位の高い僧だった？">
			<Beat name="徳の高い僧？" captions={c} from={0} to={0}>
				<Photo id="kesa-met" move="in" label="徳の高い僧？" />
			</Beat>
			<Beat name="湯殿山の寺の身分" captions={c} from={1} to={2}>
				<Stage label="湯殿山の寺の身分">
					<Flow steps={[{head: '山内', body: '寺を経営'}, {head: '僧侶'}, {head: '一世行人', body: '行者', hot: true}]} />
				</Stage>
			</Beat>
			<Beat name="即身仏はどこから？" captions={c} from={3} to={4}>
				<Photo id="haguro-stone-steps" move="in" label="即身仏はどこから？" />
			</Beat>
			<Beat name="尊敬を集める道" captions={c} from={5} to={5}>
				<Photo id="dewa-kuyoto" move="in" label="尊敬を集める道" />
			</Beat>
			<Beat name="「海」の字" captions={c} from={6} to={6}>
				<Photo id="mokujiki-fudo" move="in" label="「海」の字" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="どんな修行を？" captions={c} from={10}>
				<Photo id="senninzawa" move="in" label="どんな修行を？" />
			</Beat>
		</SceneFrame>
	);
};
