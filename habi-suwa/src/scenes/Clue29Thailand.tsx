import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue29ThailandCaptions as c} from '../data/captions';

// タイの高僧は、自らミイラになった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue29Thailand = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue29Thailand" label="第29の手がかり" title="タイの高僧は、自らミイラになった？">
			<Beat name="タイ・サムイ島" captions={c} from={0} to={0}>
				<Photo id="samui-wat-phrayai" move="in" label="タイ・サムイ島" />
			</Beat>
			<Beat name="ルアンポー・デーン（1973年没）" captions={c} from={1} to={2}>
				<Photo id="luangphodaeng" move="in" label="ルアンポー・デーン（1973年没）" />
			</Beat>
			<Beat name="伝えられていること" captions={c} from={3} to={4}>
				<Stage label="伝えられていること">
					<Flow steps={[{head: '1973年', body: '瞑想中に\n亡くなる'}, {head: '自らミイラに', body: 'うまくいかず', dim: true}, {head: '保存', body: 'ほかの人々の手で', hot: true}, {head: '2002年', body: 'X線の調査'}]} />
				</Stage>
			</Beat>
			<Beat name="体を残そうとした僧と、支えた人々" captions={c} from={5} to={6}>
				<Photo id="ivolginsky" move="in" label="体を残そうとした僧と、支えた人々" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="無事に守られてきた？" captions={c} from={10}>
				<Photo id="kiyochika-fire" move="in" label="無事に守られてきた？" />
			</Beat>
		</SceneFrame>
	);
};
