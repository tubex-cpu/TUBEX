import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue17EnmyokaiCaptions as c} from '../data/captions';

// 円明海上人は、木食行の果てに亡くなった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue17Enmyokai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue17Enmyokai" label="第17の手がかり" title="円明海上人は、木食行の果てに亡くなった？">
			<Beat name="もとは羽黒山の山伏" captions={c} from={0} to={1}>
				<Photo id="mokujiki-self" move="in" label="もとは羽黒山の山伏" />
			</Beat>
			<Beat name="柿渋" captions={c} from={2} to={2}>
				<Photo id="persimmon-cut" move="in" label="柿渋" />
			</Beat>
			<Beat name="柿のタンニン" captions={c} from={3} to={3}>
				<Photo id="kakishibu-tools" move="in" label="柿のタンニン" />
			</Beat>
			<Beat name="日本ミイラ研究グループの調査" captions={c} from={4} to={5}>
				<Stage label="日本ミイラ研究グループの調査">
					<Cards cards={[{head: '修行の物語', body: '木食行の果てに\n亡くなった'}, {head: '調査の指摘', body: '病気など\nほかの原因の可能性', tone: 'red'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="その死は" captions={c} from={6} to={6}>
				<Photo id="kahaku-exterior" move="in" label="その死は" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="最も奇妙な発見" captions={c} from={10}>
				<Photo id="calliphora-face" move="in" label="最も奇妙な発見" />
			</Beat>
		</SceneFrame>
	);
};
