import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {RumorChain} from '../components/IseArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5HebrewCaptions as c} from '../data/captions';

// 八咫鏡の裏には、ヘブライ文字が刻まれている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Clue5Hebrew = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Hebrew" label="第5の手がかり" title="八咫鏡の裏には、ヘブライ文字が刻まれている？">
			<Beat name="鏡の裏の都市伝説" captions={c} from={0} to={1}>
				<Photo id="gen-hebrew-rumor" move="in" label="鏡の裏の都市伝説" />
			</Beat>
			<Beat name="どこから来た話？" captions={c} from={2} to={3}>
				<Photo id="mirror-hirabaru-drawing" move="in" label="どこから来た話？" />
			</Beat>
			<Beat name="伝聞の伝聞" captions={c} from={4} to={7}>
				<Stage label="伝聞の伝聞">
					<RumorChain />
				</Stage>
			</Beat>
			<Beat name="誰の目にも触れない" captions={c} from={8} to={8}>
				<Photo id="naiku-aramatsuri" move="in" label="誰の目にも触れない" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="草薙剣の記録" captions={c} from={12}>
				<Photo id="atsuta-honden" move="in" label="草薙剣の記録" />
			</Beat>
		</SceneFrame>
	);
};
