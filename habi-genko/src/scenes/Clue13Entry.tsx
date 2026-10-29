import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {BoatCrossing, EntryTimeline, LowestTier} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue13EntryCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 天皇陵には、今も誰も入れない？（素材はすべてこの場面だけで使う）
export const Clue13Entry = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue13Entry" label="第13の手がかり" title="天皇陵には、今も誰も入れない？">
			<Beat name="「生きた墓」" captions={c} from={0} to={1}>
				<Photo id="konda-haisho" label="「生きた墓」" />
			</Beat>
			<Beat name="研究者たちの願い" captions={c} from={2} to={3}>
				<Photo id="moat-7" label="研究者たちの願い" />
			</Beat>
			<Beat name="EntryTimeline" captions={c} from={4} to={6}>
				<Visual label="扉が開きはじめた">
					<EntryTimeline />
				</Visual>
			</Beat>
			<Beat name="LowestTier" captions={c} from={7} to={8}>
				<Visual label="どこまで入れる？">
					<LowestTier />
				</Visual>
			</Beat>
			<Beat name="BoatCrossing" captions={c} from={9} to={11}>
				<Visual label="2025年3月7日">
					<BoatCrossing />
				</Visual>
			</Beat>
			<Beat name="墳丘で見たものは？" captions={c} from={12} to={13}>
				<Photo id="haniwa-warrior" label="墳丘で見たものは？" />
			</Beat>
			<Beat name="積み直された石" captions={c} from={14} to={14}>
				<Photo id="magodayu" label="積み直された石" />
			</Beat>
			<Beat name="1500年の時を越えて" captions={c} from={15} to={15}>
				<Photo id="haniwa-inari" label="1500年の時を越えて" />
			</Beat>
			<Beat name="判決" captions={c} from={16} to={18}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 16, 17, fps)} />
			</Beat>
			<Beat name="まわりの古墳は、どうなっ" captions={c} from={19}>
				<Photo id="osamezuka" label="まわりの古墳は、どうなった？" />
			</Beat>
		</SceneFrame>
	);
};
