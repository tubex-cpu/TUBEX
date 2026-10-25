import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {FourRulers, HeightCompare, KeyholeParts, KofunDimensions, KofunEra, LengthCompare, NumbersVary, TopThree, VolumeCompare} from '../components/NintokuArt1';
import {UnderwaterSkirt} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue1SizeCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 世界最大の墓だった？（素材はすべてこの場面だけで使う）
export const Clue1Size = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Size" label="第1の手がかり" title="世界最大の墓だった？">
			<Beat name="住宅街の真ん中の森" captions={c} from={0} to={1}>
				<Photo id="park-4" move="out" label="住宅街の真ん中の森" />
			</Beat>
			<Beat name="KeyholeParts" captions={c} from={2} to={2}>
				<Visual label="空から見ると？">
					<KeyholeParts />
				</Visual>
			</Beat>
			<Beat name="KofunEra" captions={c} from={3} to={4}>
				<Visual label="前方後円墳の時代">
					<KofunEra />
				</Visual>
			</Beat>
			<Beat name="これが、仁徳天皇陵古墳" captions={c} from={5} to={6}>
				<Photo id="daisen-h2" label="これが、仁徳天皇陵古墳" />
			</Beat>
			<Beat name="KofunDimensions" captions={c} from={7} to={10}>
				<Visual label="どれほど大きい？">
					<KofunDimensions />
				</Visual>
			</Beat>
			<Beat name="三重の濠" captions={c} from={11} to={11}>
				<Photo id="moat-1" move="right" label="三重の濠" />
			</Beat>
			<Beat name="宇宙からも、見える？" captions={c} from={12} to={12}>
				<Photo id="mozu-aster" label="宇宙からも、見える？" />
			</Beat>
			<Beat name="甲子園球場、およそ12個" captions={c} from={13} to={13}>
				<Photo id="kisaragi-4" label="甲子園球場、およそ12個分" />
			</Beat>
			<Beat name="形を見るには、どこから？" captions={c} from={14} to={15}>
				<Photo id="city-hall" move="out" label="形を見るには、どこから？" />
			</Beat>
			<Beat name="空から見下ろす" captions={c} from={16} to={16}>
				<Photo id="city-hall-view" label="空から見下ろす" />
			</Beat>
			<Beat name="2番目に大きい古墳は？" captions={c} from={17} to={17}>
				<Photo id="konda" move="out" label="2番目に大きい古墳は？" />
			</Beat>
			<Beat name="3番目は？" captions={c} from={18} to={18}>
				<Photo id="kamiishizu" label="3番目は？" />
			</Beat>
			<Beat name="4番目は、岡山に" captions={c} from={19} to={19}>
				<Photo id="tsukuriyama" label="4番目は、岡山に" />
			</Beat>
			<Beat name="TopThree" captions={c} from={20} to={20}>
				<Visual label="巨大古墳は、大阪に集まる">
					<TopThree />
				</Visual>
			</Beat>
			<Beat name="「世界最大の墓」？" captions={c} from={21} to={22}>
				<Photo id="moat-8" label="「世界最大の墓」？" />
			</Beat>
			<Beat name="世界三大墳墓" captions={c} from={23} to={24}>
				<Photo id="pyramid" move="out" label="世界三大墳墓" />
			</Beat>
			<Beat name="始皇帝の墓のまわりに" captions={c} from={25} to={25}>
				<Photo id="terracotta" label="始皇帝の墓のまわりに" />
			</Beat>
			<Beat name="ひとりの王のために" captions={c} from={26} to={26}>
				<Photo id="qin" label="ひとりの王のために" />
			</Beat>
			<Beat name="FourRulers" captions={c} from={27} to={28}>
				<Visual label="何で比べる？">
					<FourRulers />
				</Visual>
			</Beat>
			<Beat name="LengthCompare" captions={c} from={29} to={30}>
				<Visual label="長さで比べると？">
					<LengthCompare />
				</Visual>
			</Beat>
			<Beat name="UnderwaterSkirt" captions={c} from={31} to={32}>
				<Visual label="水の下に、何が？">
					<UnderwaterSkirt />
				</Visual>
			</Beat>
			<Beat name="HeightCompare" captions={c} from={33} to={34}>
				<Visual label="高さで比べると？">
					<HeightCompare />
				</Visual>
			</Beat>
			<Beat name="VolumeCompare" captions={c} from={35} to={36}>
				<Visual label="体積では？">
					<VolumeCompare />
				</Visual>
			</Beat>
			<Beat name="NumbersVary" captions={c} from={37} to={38}>
				<Visual label="数字は、資料で変わる">
					<NumbersVary />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={39} to={41}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 39, 40, fps)} />
			</Beat>
			<Beat name="人の手だけで、どれだけ？" captions={c} from={42}>
				<Photo id="pyramid-2" label="人の手だけで、どれだけ？" />
			</Beat>
		</SceneFrame>
	);
};
