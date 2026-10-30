import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {GavelVerdict} from '../components/GavelVerdict';
import {ForbiddenRumor, KimuraClaim, Kuroshio, SandstoneJoints, SeaLevelRise, UnderwaterSteps} from '../components/MuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue13YonaguniCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 沖縄の海の底に、ムーの遺跡がある？（素材はすべてこの場面だけで使う）
export const Clue13Yonaguni = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue13Yonaguni" label="第13の手がかり" title="沖縄の海の底に、ムーの遺跡がある？">
			<Beat name="日本のいちばん西" captions={c} from={0} to={1}>
				<Photo id="yonaguni-island" move="out" label="日本のいちばん西" />
			</Beat>
			<Beat name="UnderwaterSteps" captions={c} from={2} to={4}>
				<Visual label="水深25メートルの階段">
					<UnderwaterSteps />
				</Visual>
			</Beat>
			<Beat name="1986年、ダイバーが見" captions={c} from={5} to={7}>
				<Photo id="yonaguni-b" label="1986年、ダイバーが見つけた" />
			</Beat>
			<Beat name="KimuraClaim" captions={c} from={8} to={13}>
				<Visual label="人工か、自然か">
					<KimuraClaim />
				</Visual>
			</Beat>
			<Beat name="SandstoneJoints" captions={c} from={14} to={17}>
				<Visual label="自然にできる階段">
					<SandstoneJoints />
				</Visual>
			</Beat>
			<Beat name="Kuroshio" captions={c} from={18} to={18}>
				<Stage label="黒潮" labelBottom>
					<Kuroshio />
				</Stage>
			</Beat>
			<Beat name="意見は、分かれている" captions={c} from={19} to={20}>
				<Photo id="yonaguni-c" move="left" label="意見は、分かれている" />
			</Beat>
			<Beat name="SeaLevelRise" captions={c} from={21} to={27}>
				<Visual label="海面は、120メートル上がった">
					<SeaLevelRise />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={28} to={30}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 28, 29, fps)} />
			</Beat>
			<Beat name="ForbiddenRumor" captions={c} from={31}>
				<Visual>
					<ForbiddenRumor />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
