import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {NamePeaks} from '../components/MachuArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2NameCaptions as c} from '../data/captions';

// マチュピチュは、インカ時代からの名前？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue2Name = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Name" label="第2の手がかり" title="マチュピチュは、インカ時代からの名前？">
			<Beat name="ふたつの峰" captions={c} from={0} to={1}>
				<Stage label="ふたつの峰">
					<NamePeaks />
				</Stage>
			</Beat>
			<Beat name="3種類の史料" captions={c} from={2} to={3}>
				<Photo id="map-1912" move="in" label="3種類の史料" />
			</Beat>
			<Beat name="ビンガムの野帳" captions={c} from={4} to={5}>
				<Photo id="bingham-tent" move="in" label="ビンガムの野帳" />
			</Beat>
			<Beat name="古い地図には？" captions={c} from={6} to={6}>
				<Photo id="wayna-full" move="in" label="古い地図には？" />
			</Beat>
			<Beat name="決め手の記録" captions={c} from={7} to={8}>
				<Stage label="決め手の記録">
					<Figures figs={[{value: '1588', label: '年', small: '「ワイナピチュの町」の記録', accent: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="この都市の名は？" captions={c} from={9} to={10}>
				<Photo id="wayna-vrchol" move="in" label="この都市の名は？" />
			</Beat>
			<Beat name="世界中で知られた名前" captions={c} from={11} to={11}>
				<Photo id="map-expedition-1912-w" move="scroll" label="世界中で知られた名前" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="何のための都市？" captions={c} from={15}>
				<Photo id="old-canyon" move="in" label="何のための都市？" />
			</Beat>
		</SceneFrame>
	);
};
