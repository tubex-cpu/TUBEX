import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {CTSlice, Shrapnel, TetsuhauCut} from '../components/GenkoArt3';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4TetsuhauCaptions as c} from '../data/captions';

// てつはうは音だけのこけおどし？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue4Tetsuhau = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Tetsuhau" label="第4の手がかり" title="てつはうは音だけのこけおどし？">
			<Beat name="いちばん有名な場面" captions={c} from={0} to={2}>
				<Photo id="mohon-ndl-e7-w" move="scroll" label="いちばん有名な場面" />
			</Beat>
			<Beat name="炎を上げる、丸い玉" captions={c} from={3} to={4}>
				<Photo id="tetsuhau-tnm" move="in" label="炎を上げる、丸い玉" />
			</Beat>
			<Beat name="中に、何が？" captions={c} from={5} to={6}>
				<Stage label="中に、何が？">
					<TetsuhauCut />
				</Stage>
			</Beat>
			<Beat name="音で驚かすだけ？" captions={c} from={7} to={7}>
				<Photo id="tetsuhau-kyuhaku" move="in" label="音で驚かすだけ？" />
			</Beat>
			<Beat name="海の底から、実物が" captions={c} from={8} to={10}>
				<Photo id="tetsuhau-1" move="in" label="海の底から、実物が" />
			</Beat>
			<Beat name="割らずに、中を見ると？" captions={c} from={11} to={12}>
				<Stage label="割らずに、中を見ると？">
					<CTSlice />
				</Stage>
			</Beat>
			<Beat name="爆発すると、どうなる？" captions={c} from={13} to={14}>
				<Stage label="爆発すると、どうなる？">
					<Shrapnel />
				</Stage>
			</Beat>
			<Beat name="溶かした鉄の破片" captions={c} from={15} to={16}>
				<Photo id="tetsuhau-2" move="in" label="溶かした鉄の破片" />
			</Beat>
			<Beat name="威力は、どれほど？" captions={c} from={17} to={19}>
				<Photo id="tetsuhau-kyuhaku-2" move="out" label="威力は、どれほど？" />
			</Beat>
			<Beat name="本当に、戦場で" captions={c} from={20} to={20}>
				<Photo id="helmet-takashima" move="in" label="本当に、戦場で" />
			</Beat>
			<Beat name="判決" captions={c} from={21} to={23}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 21, 22, fps)} />
			</Beat>
			<Beat name="あの絵は、本当に？" captions={c} from={24}>
				<Photo id="tapestry-mouko" move="in" label="あの絵は、本当に？" />
			</Beat>
		</SceneFrame>
	);
};
