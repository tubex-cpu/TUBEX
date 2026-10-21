import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {LetterJune2, ReturnMarch, SupplyBases, SuspectBoard, WaterSiege} from '../components/HonnojiArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue3HideyoshiCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 黒幕は秀吉だった？（素材はすべてこの場面だけで使う）
export const Clue3Hideyoshi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Hideyoshi" label="第3の手がかり" title="黒幕は秀吉だった？">
			<Beat name="いちばん得をしたのは、誰" captions={c} from={0} to={2}>
				<Photo id="hideyoshi" label="いちばん得をしたのは、誰？" />
			</Beat>
			<Beat name="備中高松城" captions={c} from={3} to={3}>
				<Photo id="takamatsu-ruins" move="out" label="備中高松城" />
			</Beat>
			<Beat name="WaterSiege" captions={c} from={4} to={4}>
				<Visual label="城を、水の中に孤立させる">
					<WaterSiege />
				</Visual>
			</Beat>
			<Beat name="和睦は、なぜこんなに早く" captions={c} from={5} to={7}>
				<Photo id="takamatsu-ukiyoe" label="和睦は、なぜこんなに早く？" />
			</Beat>
			<Beat name="ReturnMarch" captions={c} from={8} to={9}>
				<Visual label="およそ200キロを、どれだけで？">
					<ReturnMarch />
				</Visual>
			</Beat>
			<Beat name="毛利とも、話がついていた" captions={c} from={10} to={11}>
				<Photo id="motonari" label="毛利とも、話がついていた？" />
			</Beat>
			<Beat name="SuspectBoard" captions={c} from={12} to={15}>
				<Visual label="黒幕は、誰？">
					<SuspectBoard />
				</Visual>
			</Beat>
			<Beat name="2026年6月、公開され" captions={c} from={16} to={17}>
				<Photo id="iwakuni" move="left" label="2026年6月、岩国で公開された手紙" />
			</Beat>
			<Beat name="毛利を支えた武将、吉川元" captions={c} from={18} to={18}>
				<Photo id="kikkawa" label="毛利を支えた武将、吉川元春" />
			</Beat>
			<Beat name="LetterJune2" captions={c} from={19} to={23}>
				<Visual label="事件の当日、毛利は何を考えていた？">
					<LetterJune2 />
				</Visual>
			</Beat>
			<Beat name="SupplyBases" captions={c} from={24} to={26}>
				<Visual label="大返しの速さの秘密は？">
					<SupplyBases />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={27} to={29}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 27, 28, fps)} />
			</Beat>
			<Beat name="答えは、意外な場所に" captions={c} from={30}>
				<Photo id="motochika" label="答えは、意外な場所に" />
			</Beat>
		</SceneFrame>
	);
};
