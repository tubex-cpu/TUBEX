import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {ConcaveRoad, DBaseLean, EighteenPeople, MoaiSize, RoadMoaiCount, RopeWalk, SledgeTheory, ThreeAgree, WalkedLegend} from '../components/MuArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue10WalkCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 重いモアイは、引きずって運ばれた？（素材はすべてこの場面だけで使う）
export const Clue10Walk = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Walk" label="第10の手がかり" title="重いモアイは、引きずって運ばれた？">
			<Beat name="MoaiSize" captions={c} from={0} to={1}>
				<Visual label="10メートル、数十トン">
					<MoaiSize />
				</Visual>
			</Beat>
			<Beat name="SledgeTheory" captions={c} from={2} to={3}>
				<Visual label="寝かせて、引きずった？">
					<SledgeTheory />
				</Visual>
			</Beat>
			<Beat name="WalkedLegend" captions={c} from={4} to={5}>
				<Visual>
					<WalkedLegend />
				</Visual>
			</Beat>
			<Beat name="2025年秋の研究" captions={c} from={6} to={7}>
				<Photo id="raraku-volcano" label="2025年秋の研究" />
			</Beat>
			<Beat name="RoadMoaiCount" captions={c} from={8} to={9}>
				<Visual label="道のモアイ">
					<RoadMoaiCount />
				</Visual>
			</Beat>
			<Beat name="DBaseLean" captions={c} from={10} to={12}>
				<Visual label="前に傾く体">
					<DBaseLean />
				</Visual>
			</Beat>
			<Beat name="RopeWalk" captions={c} from={13} to={14}>
				<Visual label="ロープで左右に">
					<RopeWalk />
				</Visual>
			</Beat>
			<Beat name="EighteenPeople" captions={c} from={15} to={16}>
				<Visual label="18人で、歩いた">
					<EighteenPeople />
				</Visual>
			</Beat>
			<Beat name="ConcaveRoad" captions={c} from={17} to={18}>
				<Visual label="道にも、秘密">
					<ConcaveRoad />
				</Visual>
			</Beat>
			<Beat name="反論もある" captions={c} from={19} to={20}>
				<Photo id="moai-traveling" move="left" label="反論もある" />
			</Beat>
			<Beat name="ThreeAgree" captions={c} from={21} to={21}>
				<Visual label="3つの証拠">
					<ThreeAgree />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={22} to={24}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 22, 23, fps)} />
			</Beat>
			<Beat name="歩かせた人々は、どこから" captions={c} from={25}>
				<Photo id="tongariki-e" label="歩かせた人々は、どこから？" />
			</Beat>
		</SceneFrame>
	);
};
