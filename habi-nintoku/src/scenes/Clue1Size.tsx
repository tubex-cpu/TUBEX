import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {FourRulers, HeightCompare, KeyholeParts, KofunDimensions, KofunEra, LengthCompare, NumbersVary, TopThree, VolumeCompare} from '../components/NintokuArt1';
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
			<Beat name="住宅街の真ん中の森" captions={c} from={0} to={0}>
				<Photo id="park-4" move="out" label="住宅街の真ん中の森" />
			</Beat>
			<Beat name="KeyholeParts" captions={c} from={1} to={2}>
				<Visual label="空から見ると？">
					<KeyholeParts />
				</Visual>
			</Beat>
			<Beat name="KofunEra" captions={c} from={3} to={4}>
				<Visual label="前方後円墳の時代">
					<KofunEra />
				</Visual>
			</Beat>
			<Beat name="これが、仁徳天皇陵古墳" captions={c} from={5} to={5}>
				<Photo id="daisen-h2" label="これが、仁徳天皇陵古墳" />
			</Beat>
			<Beat name="KofunDimensions" captions={c} from={6} to={7}>
				<Visual label="どれほど大きい？">
					<KofunDimensions />
				</Visual>
			</Beat>
			<Beat name="宇宙からも、見える？" captions={c} from={8} to={8}>
				<Photo id="mozu-aster" label="宇宙からも、見える？" />
			</Beat>
			<Beat name="甲子園球場、およそ12個" captions={c} from={9} to={9}>
				<Photo id="moat-1" move="right" label="甲子園球場、およそ12個分" />
			</Beat>
			<Beat name="2番目に大きい古墳は？" captions={c} from={10} to={10}>
				<Photo id="konda" move="out" label="2番目に大きい古墳は？" />
			</Beat>
			<Beat name="3番目は？" captions={c} from={11} to={11}>
				<Photo id="kamiishizu" label="3番目は？" />
			</Beat>
			<Beat name="TopThree" captions={c} from={12} to={12}>
				<Visual label="巨大古墳は、大阪に集まる">
					<TopThree />
				</Visual>
			</Beat>
			<Beat name="「世界最大の墓」？" captions={c} from={13} to={14}>
				<Photo id="moat-8" move="left" label="「世界最大の墓」？" />
			</Beat>
			<Beat name="世界三大墳墓" captions={c} from={15} to={15}>
				<Photo id="qin" label="世界三大墳墓" />
			</Beat>
			<Beat name="FourRulers" captions={c} from={16} to={17}>
				<Visual label="何で比べる？">
					<FourRulers />
				</Visual>
			</Beat>
			<Beat name="LengthCompare" captions={c} from={18} to={20}>
				<Visual label="長さで比べると？">
					<LengthCompare />
				</Visual>
			</Beat>
			<Beat name="高さで比べると……" captions={c} from={21} to={21}>
				<Photo id="pyramid" move="out" label="高さで比べると……" />
			</Beat>
			<Beat name="HeightCompare" captions={c} from={22} to={22}>
				<Visual label="ピラミッドの高さは？">
					<HeightCompare />
				</Visual>
			</Beat>
			<Beat name="VolumeCompare" captions={c} from={23} to={24}>
				<Visual label="体積では？">
					<VolumeCompare />
				</Visual>
			</Beat>
			<Beat name="NumbersVary" captions={c} from={25} to={26}>
				<Visual label="数字は、資料で変わる">
					<NumbersVary />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={27} to={29}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 27, 28, fps)} />
			</Beat>
			<Beat name="人の手だけで、どれだけ？" captions={c} from={30}>
				<Photo id="kisaragi-4" label="人の手だけで、どれだけ？" />
			</Beat>
		</SceneFrame>
	);
};
