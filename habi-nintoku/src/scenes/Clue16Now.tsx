import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {FiveCluesDone} from '../components/NintokuArt2';
import {MoatVolume, WaterSupply} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue16NowCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 仁徳天皇陵は、造られたときの姿のまま？（素材はすべてこの場面だけで使う）
export const Clue16Now = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue16Now" label="第16の手がかり" title="仁徳天皇陵は、造られたときの姿のまま？">
			<Beat name="森に変わった山" captions={c} from={0} to={1}>
				<Photo id="komoyamazuka" label="森に変わった山" />
			</Beat>
			<Beat name="くずれの原因は？" captions={c} from={2} to={3}>
				<Photo id="moat-11" label="くずれの原因は？" />
			</Beat>
			<Beat name="MoatVolume" captions={c} from={4} to={6}>
				<Visual label="濠の水は、どれだけ？">
					<MoatVolume />
				</Visual>
			</Beat>
			<Beat name="水に削られる墳丘" captions={c} from={7} to={7}>
				<Photo id="maruhoyama" label="水に削られる墳丘" />
			</Beat>
			<Beat name="WaterSupply" captions={c} from={8} to={10}>
				<Visual label="水の悩み">
					<WaterSupply />
				</Visual>
			</Beat>
			<Beat name="今も続く、守る仕事" captions={c} from={11} to={12}>
				<Photo id="kusunoki" label="今も続く、守る仕事" />
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="FiveCluesDone" captions={c} from={16}>
				<Visual label="16の手がかりを、全てたどった">
					<FiveCluesDone />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
