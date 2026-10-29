import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {EighteenDone, JapanAncestors, NoMuNoRoots, NotGasCollapse, PrepareReal, Subduction} from '../components/MuArt4';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue18JapanCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 次に沈むのは、日本列島？（素材はすべてこの場面だけで使う）
export const Clue18Japan = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue18Japan" label="第18の手がかり" title="次に沈むのは、日本列島？">
			<Beat name="火山と地震の帯のまんなか" captions={c} from={0} to={2}>
				<Photo id="japan-space" move="out" label="火山と地震の帯のまんなか" />
			</Beat>
			<Beat name="JapanAncestors" captions={c} from={3} to={4}>
				<Visual label="日本人のルーツは？">
					<JapanAncestors />
				</Visual>
			</Beat>
			<Beat name="Subduction" captions={c} from={5} to={7}>
				<Visual label="地震が起きる仕組み">
					<Subduction />
				</Visual>
			</Beat>
			<Beat name="NotGasCollapse" captions={c} from={8} to={10}>
				<Visual label="ムーの仕組みとは別物">
					<NotGasCollapse />
				</Visual>
			</Beat>
			<Beat name="PrepareReal" captions={c} from={11} to={14}>
				<Visual label="本当に備えるべきこと">
					<PrepareReal />
				</Visual>
			</Beat>
			<Beat name="NoMuNoRoots" captions={c} from={15} to={17}>
				<Visual label="ないものは、ルーツにならない">
					<NoMuNoRoots />
				</Visual>
			</Beat>
			<Beat name="長い旅の物語" captions={c} from={18} to={19}>
				<Photo id="japan-coast" move="out" label="長い旅の物語" />
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="EighteenDone" captions={c} from={23} to={23}>
				<Visual label="18の手がかりの、その先">
					<EighteenDone />
				</Visual>
			</Beat>
			<Beat name="海は、大陸を呑み込んでい" captions={c} from={24}>
				<Photo id="pacific-wave" move="out" label="海は、大陸を呑み込んでいた" />
			</Beat>
		</SceneFrame>
	);
};
