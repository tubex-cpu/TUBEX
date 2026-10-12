import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Center} from '../components/Illustrations';
import {AnimalCount, ArkBuilding, ArkDimensions, EverestWater, FoldedStrata, VerdictTiles} from '../components/NoahArt';
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
			<Beat name="中の様子" captions={c} from={3} to={4}>
				<Visual label="つくった人たちは、物語を本当だと信じている">
					<ArkDimensions />
				</Visual>
			</Beat>
			<Beat name="計算" captions={c} from={5} to={9}>
				<Center>
					<AnimalCount />
				</Center>
			</Beat>
			<Beat name="グループ" captions={c} from={10} to={11}>
				<Visual label="「種類」ではなく「グループ」なら乗れる？">
					<ArkBuilding />
				</Visual>
			</Beat>
			<Beat name="水" captions={c} from={12} to={13}>
				<Visual label="本当の問題は、水だった">
					<EverestWater />
				</Visual>
			</Beat>
			<Beat name="地層" captions={c} from={14} to={14}>
				<Visual label="世界中の地層は、何を語る？">
					<FoldedStrata />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={15} to={17}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 15, 16, fps)} />
			</Beat>
			<Beat name="手がかり終わり" captions={c} from={18}>
				<VerdictTiles />
			</Beat>
		</SceneFrame>
	);
};
