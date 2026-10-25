import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {AncientVsModern, BuildSteps, ConstructionPeriod, Crowd, HaniwaUncounted, ShipView, StonesAndHaniwa, WorkerStats} from '../components/NintokuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue2BuildCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 造るのに15年以上かかった？（素材はすべてこの場面だけで使う）
export const Clue2Build = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Build" label="第2の手がかり" title="造るのに15年以上かかった？">
			<Beat name="1500年以上前の墓" captions={c} from={0} to={0}>
				<Photo id="daisen-z2" label="1500年以上前の墓" />
			</Beat>
			<Beat name="BuildSteps" captions={c} from={1} to={2}>
				<Visual label="どうやって造った？">
					<BuildSteps />
				</Visual>
			</Beat>
			<Beat name="古代と同じ方法なら？" captions={c} from={3} to={4}>
				<Photo id="moat-2" move="right" label="古代と同じ方法なら？" />
			</Beat>
			<Beat name="ConstructionPeriod" captions={c} from={5} to={5}>
				<Visual label="工期は？">
					<ConstructionPeriod />
				</Visual>
			</Beat>
			<Beat name="WorkerStats" captions={c} from={6} to={7}>
				<Visual label="人と費用は？">
					<WorkerStats />
				</Visual>
			</Beat>
			<Beat name="Crowd" captions={c} from={8} to={8}>
				<Visual label="現場にいた人々">
					<Crowd />
				</Visual>
			</Beat>
			<Beat name="AncientVsModern" captions={c} from={9} to={10}>
				<Visual label="現代の機械なら？">
					<AncientVsModern />
				</Visual>
			</Beat>
			<Beat name="HaniwaUncounted" captions={c} from={11} to={12}>
				<Visual label="まだ数えていないもの">
					<HaniwaUncounted />
				</Visual>
			</Beat>
			<Beat name="ただの土の山ではない" captions={c} from={13} to={14}>
				<Photo id="goshiki-2" label="ただの土の山ではない" />
			</Beat>
			<Beat name="StonesAndHaniwa" captions={c} from={15} to={16}>
				<Visual label="斜面と堤に並んだもの">
					<StonesAndHaniwa />
				</Visual>
			</Beat>
			<Beat name="造られた当時の姿は？" captions={c} from={17} to={17}>
				<Photo id="goshiki-1" move="out" label="造られた当時の姿は？" />
			</Beat>
			<Beat name="石と埴輪の山" captions={c} from={18} to={18}>
				<Photo id="goshiki-3" label="石と埴輪の山" />
			</Beat>
			<Beat name="今は、森に見えるけれど" captions={c} from={19} to={19}>
				<Photo id="daisen-b5" label="今は、森に見えるけれど" />
			</Beat>
			<Beat name="ShipView" captions={c} from={20} to={20}>
				<Visual label="海からも見えた？">
					<ShipView />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={21} to={23}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 21, 22, fps)} />
			</Beat>
			<Beat name="その王とは？" captions={c} from={24}>
				<Photo id="nintoku-matsuoka" label="その王とは？" />
			</Beat>
		</SceneFrame>
	);
};
