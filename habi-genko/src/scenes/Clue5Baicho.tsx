import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {BaichoMap, NagayamaOrder, TsukamawariFinds} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue5BaichoCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 周りの小さな古墳は、家来の墓？（素材はすべてこの場面だけで使う）
export const Clue5Baicho = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Baicho" label="第5の手がかり" title="周りの小さな古墳は、家来の墓？">
			<Beat name="BaichoMap" captions={c} from={0} to={2}>
				<Visual label="巨大古墳のまわりに">
					<BaichoMap />
				</Visual>
			</Beat>
			<Beat name="家来の墓？" captions={c} from={3} to={4}>
				<Photo id="osamezuka-5" label="家来の墓？" />
			</Beat>
			<Beat name="塚廻古墳" captions={c} from={5} to={7}>
				<Photo id="tsukamawari" label="塚廻古墳" />
			</Beat>
			<Beat name="TsukamawariFinds" captions={c} from={8} to={9}>
				<Visual label="中から見つかったもの">
					<TsukamawariFinds />
				</Visual>
			</Beat>
			<Beat name="身分の高い人物？" captions={c} from={10} to={11}>
				<Photo id="magatama" label="身分の高い人物？" />
			</Beat>
			<Beat name="永山古墳" captions={c} from={12} to={14}>
				<Photo id="nagayama" move="out" label="永山古墳" />
			</Beat>
			<Beat name="NagayamaOrder" captions={c} from={15} to={17}>
				<Visual label="順番は？">
					<NagayamaOrder />
				</Visual>
			</Beat>
			<Beat name="ほとんどが、発掘されてい" captions={c} from={18} to={18}>
				<Photo id="kisaragi-1" label="ほとんどが、発掘されていない" />
			</Beat>
			<Beat name="判決" captions={c} from={19} to={21}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 19, 20, fps)} />
			</Beat>
			<Beat name="この古墳の主は？" captions={c} from={22}>
				<Photo id="daisen-h3" label="この古墳の主は？" />
			</Beat>
		</SceneFrame>
	);
};
