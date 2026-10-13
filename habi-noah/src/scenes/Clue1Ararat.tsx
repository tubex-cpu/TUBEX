import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {AncientRecords, AraratMountain, ArkDimensions, BoatFormation, DigResult, DrillRig, FloodRain, FoldedStrata, MuseumShelves, SoilVsShip, UrartuMap, WoodDating} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue1AraratCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 第1の手がかり アララト山の船の形
export const Clue1Ararat = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Ararat" label="第1の手がかり" title="アララト山に“船の形”？">
			<Beat name="聖書の物語" captions={c} from={0} to={2}>
				<Photo id="noah-art" label="神はノアに、船をつくれと命じた">
					<Visual label="神はノアに、船をつくれと命じた">
						<FloodRain />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="方舟の大きさ" captions={c} from={3} to={4}>
				<Visual label="全ての動物を乗せた船の大きさは？">
					<ArkDimensions />
				</Visual>
			</Beat>
			<Beat name="40日40夜" captions={c} from={5} to={5}>
				<Photo id="deluge-art" label="40日40夜、雨は降り続いた">
					<Visual label="40日40夜、雨は降り続いた">
						<FloodRain />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="アララトの山々" captions={c} from={6} to={7}>
				<Photo id="ararat" label="船がとどまった場所は……">
					<Visual label="船がとどまった場所は……">
						<AraratMountain />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="1959年の航空写真" captions={c} from={8} to={11}>
				<Photo id="durupinar" label="1959年、航空写真に写りこんだ形">
					<Visual label="1959年、航空写真に写りこんだ形">
						<BoatFormation />
					</Visual>
				</Photo>
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
				<Visual label="1955年、氷河から持ち帰られた木材">
					<WoodDating />
				</Visual>
			</Beat>
			<Beat name="年代測定" captions={c} from={22} to={23}>
				<Visual label="その木は、いつのもの？">
					<WoodDating result />
				</Visual>
			</Beat>
			<Beat name="アララト・アノマリー" captions={c} from={24} to={26}>
				<Photo id="ararat" move="out" label="1949年、雪の中に写った黒い影">
					<Visual label="1949年、雪の中に写った黒い影">
						<AraratMountain showBoat={false} />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="最近のニュース" captions={c} from={27} to={28}>
				<Photo id="durupinar" move="out" label="2023年「土は約5000年前のもの」">
					<Visual label="2023年「土は約5000年前のもの」">
						<BoatFormation natural />
					</Visual>
				</Photo>
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
			<Beat name="古い記録" captions={c} from={41} to={46}>
				<Visual label="方舟がとどまった山は、どこだった？">
					<AncientRecords />
				</Visual>
			</Beat>
			<Beat name="博物館" captions={c} from={47}>
				<Visual label="答えは、山ではなく博物館の中に">
					<MuseumShelves />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
