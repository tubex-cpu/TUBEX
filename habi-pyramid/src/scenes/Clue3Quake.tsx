import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {ChamberAmplify, ResonanceCompare, SensorMap, StableShape} from '../components/PyramidArt2';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue3QuakeCaptions as c} from '../data/captions';

// 第3の手がかり 大ピラミッドは地震に強い？（素材はすべてこの場面だけで使う）
export const Clue3Quake = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Quake" label="第3の手がかり" title="大ピラミッドは地震に強い？">
			<Beat name="論文" captions={c} from={0} to={1}>
				<Photo id="cheops-laskar1" label="2026年5月、イギリスの科学誌に" />
			</Beat>
			<Beat name="1992年" captions={c} from={2} to={4}>
				<Photo id="cairo-1992-map" label="エジプトでも、地震は起きる？" />
			</Beat>
			<Beat name="立ち続けた" captions={c} from={5} to={5}>
				<Photo id="cheops-laskar2" move="out" label="それでも、4500年立ち続けた" />
			</Beat>
			<Beat name="37か所" captions={c} from={6} to={7}>
				<Visual label="37か所で、揺れを測ると？">
					<SensorMap />
				</Visual>
			</Beat>
			<Beat name="揺れ方" captions={c} from={8} to={9}>
				<Visual label="建物と地面で、何がちがう？">
					<ResonanceCompare />
				</Visual>
			</Beat>
			<Beat name="王の間" captions={c} from={10} to={10}>
				<Photo id="kings-chamber" label="王の間の真上には？" />
			</Beat>
			<Beat name="揺れの変化" captions={c} from={11} to={14}>
				<Visual label="揺れは、どう変わった？">
					<ChamberAmplify />
				</Visual>
			</Beat>
			<Beat name="倒れにくい形" captions={c} from={15} to={15}>
				<Visual label="倒れにくい形の秘密">
					<StableShape />
				</Visual>
			</Beat>
			<Beat name="設計か" captions={c} from={16} to={17}>
				<Photo id="cheops-meskens" move="right" label="わざと、こう設計した？" />
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="積み上げ方" captions={c} from={21}>
				<Photo id="giza-robster" move="left" label="巨大な石を、どうやって？" />
			</Beat>
		</SceneFrame>
	);
};
