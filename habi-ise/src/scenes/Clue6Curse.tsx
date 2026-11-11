import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6CurseCaptions as c} from '../data/captions';

// 草薙剣は、祟る？（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Clue6Curse = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Curse" label="第6の手がかり" title="草薙剣は、祟る？">
			<Beat name="ヤマタノオロチの尾から" captions={c} from={0} to={0}>
				<Photo id="orochi-yoshitoshi-w" move="scroll" label="ヤマタノオロチの尾から" />
			</Beat>
			<Beat name="ヤマトタケルと熱田" captions={c} from={1} to={1}>
				<Photo id="takeru-yoshitoshi" move="in" label="ヤマトタケルと熱田" />
			</Beat>
			<Beat name="668年、盗まれた剣" captions={c} from={2} to={4}>
				<Photo id="sword-kanto" move="in" label="668年、盗まれた剣" />
			</Beat>
			<Beat name="686年6月" captions={c} from={5} to={6}>
				<Photo id="atsuta-forest" move="in" label="686年6月" />
			</Beat>
			<Beat name="記録された祟り" captions={c} from={7} to={8}>
				<Stage label="記録された祟り">
					<Cards cards={[{head: '日本書紀 朱鳥元年（686年）', body: '天皇の病を卜うに\n草薙剣に祟れり', tone: 'dark'}]} tone='shrine' size={54} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="海の底へ？" captions={c} from={12}>
				<Photo id="kanmon-straits" move="in" label="海の底へ？" />
			</Beat>
		</SceneFrame>
	);
};
