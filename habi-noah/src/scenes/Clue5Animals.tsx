import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Center} from '../components/Illustrations';
import {AnimalCount, ArkBuilding, EverestWater, TwoAccounts, VerdictTiles, WoodenShipLimit} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue5AnimalsCaptions as c} from '../data/captions';

// 第5の手がかり 全ての動物を乗せた船（素材はすべてこの場面だけで使う）
export const Clue5Animals = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Animals" label="第5の手がかり" title="全ての動物は、船に乗れた？">
			<Beat name="ケンタッキーの方舟" captions={c} from={0} to={1}>
				<Photo id="ark-encounter" label="アメリカに建つ、実物大の方舟" />
			</Beat>
			<Beat name="155メートル" captions={c} from={2} to={2}>
				<Photo id="ark-encounter-2" move="out" label="長さ155m。まるで木のビル" />
			</Beat>
			<Beat name="中の様子" captions={c} from={3} to={3}>
				<Photo id="ark-encounter-005" move="right" label="中には、動物たちの小屋まで" />
			</Beat>
			<Beat name="木の船の限界" captions={c} from={4} to={5}>
				<Visual label="木だけで、この大きさの船は浮かぶ？">
					<WoodenShipLimit />
				</Visual>
			</Beat>
			<Beat name="ワイオミング号" captions={c} from={6} to={8}>
				<Photo id="wyoming" move="left" label="史上最大級の木造船は、どうなった？" />
			</Beat>
			<Beat name="陸の上の建物" captions={c} from={9} to={10}>
				<Visual label="ケンタッキーの方舟は、海に浮かぶ？">
					<ArkBuilding />
				</Visual>
			</Beat>
			<Beat name="計算" captions={c} from={11} to={15}>
				<Center>
					<AnimalCount />
				</Center>
			</Beat>
			<Beat name="聖書を読むと" captions={c} from={16} to={16}>
				<Photo id="vienna-genesis" label="聖書を読むと、ふしぎな食いちがいが" />
			</Beat>
			<Beat name="ふたつの語り" captions={c} from={17} to={21}>
				<Visual label="ひとつがい？　七つがい？">
					<TwoAccounts />
				</Visual>
			</Beat>
			<Beat name="グループ" captions={c} from={22} to={23}>
				<Photo id="savery-ark-2" move="right" label="「種類」ではなく「グループ」なら乗れる？" />
			</Beat>
			<Beat name="水" captions={c} from={24} to={24}>
				<Visual label="本当の問題は、水だった">
					<EverestWater />
				</Visual>
			</Beat>
			<Beat name="エベレスト" captions={c} from={25} to={25}>
				<Photo id="everest" move="out" label="この山まで沈める水は、どこに？" />
			</Beat>
			<Beat name="地層" captions={c} from={26} to={26}>
				<Photo id="grand-canyon" move="left" label="世界中の地層は、何を語る？" />
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
