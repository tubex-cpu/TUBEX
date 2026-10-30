import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {GavelVerdict} from '../components/GavelVerdict';
import {CollapseStory, FarmCapacity, ForestGone, GenomeNoCrash, RealDecline, ToSouthAmerica, YonaguniMap} from '../components/MuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue12CollapseCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// イースター島の人々は、木を切りつくして滅んだ？（素材はすべてこの場面だけで使う）
export const Clue12Collapse = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue12Collapse" label="第12の手がかり" title="イースター島の人々は、木を切りつくして滅んだ？">
			<Beat name="ForestGone" captions={c} from={0} to={2}>
				<Visual label="森は、どこへ？">
					<ForestGone />
				</Visual>
			</Beat>
			<Beat name="CollapseStory" captions={c} from={3} to={8}>
				<Visual label="広く知られた「崩壊」">
					<CollapseStory />
				</Visual>
			</Beat>
			<Beat name="GenomeNoCrash" captions={c} from={9} to={12}>
				<Visual label="遺伝子に残る記録">
					<GenomeNoCrash />
				</Visual>
			</Beat>
			<Beat name="FarmCapacity" captions={c} from={13} to={15}>
				<Visual label="島で養える人数">
					<FarmCapacity />
				</Visual>
			</Beat>
			<Beat name="石を並べた畑" captions={c} from={16} to={16}>
				<Photo id="manavai" label="石を並べた畑" />
			</Beat>
			<Beat name="ToSouthAmerica" captions={c} from={17} to={20}>
				<Stage label="南アメリカまで" labelBottom>
					<ToSouthAmerica />
				</Stage>
			</Beat>
			<Beat name="RealDecline" captions={c} from={21} to={21}>
				<Visual label="人口を減らしたもの">
					<RealDecline />
				</Visual>
			</Beat>
			<Beat name="今も島に暮らす人々" captions={c} from={22} to={22}>
				<Photo id="rapanui-people" label="今も島に暮らす人々" />
			</Beat>
			<Beat name="判決" captions={c} from={23} to={25}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 23, 24, fps)} />
			</Beat>
			<Beat name="YonaguniMap" captions={c} from={26}>
				<Stage label="日本の海へ" labelBottom>
					<YonaguniMap />
				</Stage>
			</Beat>
		</SceneFrame>
	);
};
