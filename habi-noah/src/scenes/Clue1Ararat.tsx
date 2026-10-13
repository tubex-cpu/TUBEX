import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {AncientRecords, ArkDimensions, BoatFormation, DigResult, DrillRig, FoldedStrata, SoilVsShip, UrartuMap, WoodDating} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue1AraratCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 第1の手がかり アララト山の船の形（素材はすべてこの場面だけで使う）
export const Clue1Ararat = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Ararat" label="第1の手がかり" title="アララト山に“船の形”？">
			<Beat name="聖書の物語" captions={c} from={0} to={2}>
				<Photo id="augsburg-flood" label="神は、なぜ全てを流そうとしたのか" />
			</Beat>
			<Beat name="方舟の大きさ" captions={c} from={3} to={3}>
				<Visual label="全ての動物を乗せた船の大きさは？">
					<ArkDimensions />
				</Visual>
			</Beat>
			<Beat name="ひとつがいずつ" captions={c} from={4} to={4}>
				<Photo id="savery-ark" move="right" label="全ての動物が、ひとつの船に？" />
			</Beat>
			<Beat name="40日40夜" captions={c} from={5} to={5}>
				<Photo id="deluge-art" label="40日40夜、雨は降り続いた" />
			</Beat>
			<Beat name="アララトの山々" captions={c} from={6} to={6}>
				<Photo id="demyle-ararat" move="left" label="船がとどまった場所は……" />
			</Beat>
			<Beat name="1959年の航空写真" captions={c} from={7} to={9}>
				<Visual label="1959年、航空写真に写りこんだ形">
					<BoatFormation />
				</Visual>
			</Beat>
			<Beat name="船首" captions={c} from={10} to={11}>
				<Photo id="durupinar-2" move="out" label="大きさまで、聖書の方舟と同じ？" />
			</Beat>
			<Beat name="一度掘られている" captions={c} from={12} to={16}>
				<Visual label="実はこの場所、一度掘られている">
					<DigResult />
				</Visual>
			</Beat>
			<Beat name="地層" captions={c} from={17} to={18}>
				<Visual label="船の形は、なぜできたのか">
					<FoldedStrata />
				</Visual>
			</Beat>
			<Beat name="ナヴァラの木材" captions={c} from={19} to={21}>
				<Photo id="ararat-cones" move="right" label="1955年、氷河から持ち帰られた木材" />
			</Beat>
			<Beat name="年代測定" captions={c} from={22} to={23}>
				<Visual label="その木は、いつのもの？">
					<WoodDating result />
				</Visual>
			</Beat>
			<Beat name="アララト・アノマリー" captions={c} from={24} to={25}>
				<Photo id="ararat" move="out" label="1949年、雪の中に写った黒い影" />
			</Beat>
			<Beat name="人工衛星" captions={c} from={26} to={26}>
				<Photo id="ararat-space" label="宇宙から見ても、船は見えるのか？" />
			</Beat>
			<Beat name="最近のニュース" captions={c} from={27} to={28}>
				<Photo id="durupinar-3" move="left" label="2023年「土は約5000年前のもの」" />
			</Beat>
			<Beat name="土と船" captions={c} from={29} to={32}>
				<Visual label="そのニュース、何を測った？">
					<SoilVsShip />
				</Visual>
			</Beat>
			<Beat name="先月の掘削" captions={c} from={33} to={33}>
				<Visual label="ドリルを折った層の正体は、まだ不明">
					<DrillRig />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={34} to={37}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 34, 35, fps)} />
			</Beat>
			<Beat name="アララトの山々" captions={c} from={38} to={40}>
				<Visual label="聖書は「アララト山」とは書いていない？" labelColor={colors.goldSoft}>
					<UrartuMap />
				</Visual>
			</Beat>
			<Beat name="ベロッソス" captions={c} from={41} to={43}>
				<Photo id="babylon" move="right" label="2300年前の神官が書き残したこと" />
			</Beat>
			<Beat name="ジューディー" captions={c} from={44} to={44}>
				<Photo id="cudi" move="left" label="コーランが伝える山は、別の場所？" />
			</Beat>
			<Beat name="古い記録" captions={c} from={45} to={46}>
				<Visual label="方舟がとどまった山は、どこだった？">
					<AncientRecords />
				</Visual>
			</Beat>
			<Beat name="博物館" captions={c} from={47}>
				<Photo id="bm-court" label="答えは、山ではなく博物館の中に" />
			</Beat>
		</SceneFrame>
	);
};
