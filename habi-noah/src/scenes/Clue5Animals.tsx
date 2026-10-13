import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Center} from '../components/Illustrations';
import {AnimalCount, ArkBuilding, ArkDimensions, EverestWater, FoldedStrata, TwoAccounts, VerdictTiles, WoodenShipLimit} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue5AnimalsCaptions as c} from '../data/captions';

// 第5の手がかり 全ての動物を乗せた船
export const Clue5Animals = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Animals" label="第5の手がかり" title="全ての動物は、船に乗れた？">
			<Beat name="ケンタッキーの方舟" captions={c} from={0} to={2}>
				<Photo id="ark-encounter" label="アメリカに建つ、実物大の方舟">
					<Visual label="アメリカに建つ、実物大の方舟">
						<ArkBuilding />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="中の様子" captions={c} from={3} to={3}>
				<Photo id="ark-encounter" move="out" label="中には、動物たちの小屋まで">
					<Visual label="中には、動物たちの小屋まで">
						<ArkBuilding />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="ワイオミング号" captions={c} from={4} to={9}>
				<Visual label="木だけで、この大きさの船は浮かぶ？">
					<WoodenShipLimit />
				</Visual>
			</Beat>
			<Beat name="信じる人たち" captions={c} from={10} to={10}>
				<Visual label="つくった人たちは、物語を本当だと信じている">
					<ArkDimensions />
				</Visual>
			</Beat>
			<Beat name="計算" captions={c} from={11} to={15}>
				<Center>
					<AnimalCount />
				</Center>
			</Beat>
			<Beat name="ふたつの語り" captions={c} from={16} to={21}>
				<Visual label="聖書を読むと、ふしぎな食いちがいが">
					<TwoAccounts />
				</Visual>
			</Beat>
			<Beat name="グループ" captions={c} from={22} to={23}>
				<Visual label="「種類」ではなく「グループ」なら乗れる？">
					<ArkBuilding />
				</Visual>
			</Beat>
			<Beat name="水" captions={c} from={24} to={25}>
				<Visual label="本当の問題は、水だった">
					<EverestWater />
				</Visual>
			</Beat>
			<Beat name="地層" captions={c} from={26} to={26}>
				<Visual label="世界中の地層は、何を語る？">
					<FoldedStrata />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={27} to={29}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 27, 28, fps)} />
			</Beat>
			<Beat name="手がかり終わり" captions={c} from={30}>
				<VerdictTiles />
			</Beat>
		</SceneFrame>
	);
};
