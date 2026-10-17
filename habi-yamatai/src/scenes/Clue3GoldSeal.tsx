import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {ForgeryDoubt, Gap180, HanVsWei, MissingSeal, NaKokuMap, OneSun, SealSpec, TwoDates} from '../components/YamataiArt2';
import {clue3GoldSealCaptions as c} from '../data/captions';

// 第3の手がかり 志賀島の金印（素材はすべてこの場面だけで使う）
export const Clue3GoldSeal = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3GoldSeal" label="第3の手がかり" title="志賀島の金印は、卑弥呼のもの？">
			<Beat name="志賀島" captions={c} from={0} to={1}>
				<Photo id="shikanoshima" move="right" label="1784年、田んぼの水路から何が？" />
			</Beat>
			<Beat name="金印の大きさ" captions={c} from={2} to={3}>
				<Visual label="純金の、小さな印">
					<SealSpec />
				</Visual>
			</Beat>
			<Beat name="漢委奴国王" captions={c} from={4} to={5}>
				<Photo id="na-seal" label="これこそ、卑弥呼の印？" />
			</Beat>
			<Beat name="漢か魏か" captions={c} from={6} to={7}>
				<Visual label="刻まれた文字に、決定的なちがい">
					<HanVsWei />
				</Visual>
			</Beat>
			<Beat name="偽物の疑い" captions={c} from={8} to={8}>
				<Visual label="江戸時代の偽物？">
					<ForgeryDoubt />
				</Visual>
			</Beat>
			<Beat name="滇王之印" captions={c} from={9} to={11}>
				<Photo id="dian-seal" label="1956年、中国で見つかった金の印" />
			</Beat>
			<Beat name="1寸" captions={c} from={12} to={12}>
				<Visual label="一辺の長さに、意味がある？">
					<OneSun />
				</Visual>
			</Beat>
			<Beat name="光武帝" captions={c} from={13} to={14}>
				<Photo id="guangwu" label="西暦57年、皇帝が授けた印" />
			</Beat>
			<Beat name="180年前" captions={c} from={15} to={15}>
				<Visual label="卑弥呼とは、時代がちがう？">
					<Gap180 />
				</Visual>
			</Beat>
			<Beat name="奴国の場所" captions={c} from={16} to={16}>
				<Visual label="金印が教えてくれた、奴国の場所">
					<NaKokuMap />
				</Visual>
			</Beat>
			<Beat name="親魏倭王の金印" captions={c} from={17} to={19}>
				<Visual label="卑弥呼の金印は、どこに？">
					<MissingSeal />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="ふたつの候補地" captions={c} from={23}>
				<Visual label="2026年、ふたつの候補地が動いた">
					<TwoDates />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
