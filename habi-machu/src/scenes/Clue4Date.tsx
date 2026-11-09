import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {DateShift} from '../components/MachuArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4DateCaptions as c} from '../data/captions';

// マチュピチュが建てられたのは、パチャクテクが王になったあと？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue4Date = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Date" label="第4の手がかり" title="マチュピチュが建てられたのは、パチャクテクが王になったあと？">
			<Beat name="これまでの説明" captions={c} from={0} to={2}>
				<Photo id="coricancha-1" move="in" label="これまでの説明" />
			</Beat>
			<Beat name="4か所の墓から" captions={c} from={3} to={5}>
				<Photo id="royal-tomb" move="in" label="4か所の墓から" />
			</Beat>
			<Beat name="わずかな量から年代を測る" captions={c} from={6} to={6}>
				<Stage label="わずかな量から年代を測る">
					<Figures figs={[{value: '26', label: '人', small: '骨と歯の年代を測定'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="骨が示した年代は？" captions={c} from={7} to={10}>
				<Stage label="骨が示した年代は？">
					<DateShift />
				</Stage>
			</Beat>
			<Beat name="問い直される歴史" captions={c} from={11} to={12}>
				<Photo id="sun-temple-1" move="in" label="問い直される歴史" />
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="ここに暮らしたのは？" captions={c} from={16}>
				<Photo id="old-house-door" move="in" label="ここに暮らしたのは？" />
			</Beat>
		</SceneFrame>
	);
};
