import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {EclipseShift, SlowEarth} from '../components/TakachihoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6EclipseCaptions as c} from '../data/captions';

// 天岩戸の神話は、日食の記憶？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue6Eclipse = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Eclipse" label="第6の手がかり" title="天岩戸の神話は、日食の記憶？">
			<Beat name="皆既日食" captions={c} from={0} to={1}>
				<Photo id="ecl-total" move="in" label="皆既日食" />
			</Beat>
			<Beat name="古代の人々の恐れ" captions={c} from={2} to={3}>
				<Photo id="ecl-diamond" move="in" label="古代の人々の恐れ" />
			</Beat>
			<Beat name="いつの日食？" captions={c} from={4} to={4}>
				<Photo id="gorge-above" move="in" label="いつの日食？" />
			</Beat>
			<Beat name="自転のわずかな遅れ" captions={c} from={5} to={6}>
				<Stage label="自転のわずかな遅れ">
					<SlowEarth />
				</Stage>
			</Beat>
			<Beat name="注目された2つの日食" captions={c} from={7} to={9}>
				<Stage label="注目された2つの日食">
					<Figures figs={[{value: '247', label: '年', small: '3月24日の日食'}, {value: '248', label: '年', small: '9月5日の日食'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="2012年の見直し" captions={c} from={10} to={11}>
				<Stage label="2012年の見直し" labelBottom>
					<EclipseShift />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="247年と248年" captions={c} from={15}>
				<Photo id="yoshi-north" move="in" label="247年と248年" />
			</Beat>
		</SceneFrame>
	);
};
