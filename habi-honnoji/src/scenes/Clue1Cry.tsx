import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {EmptyGate, MarchTurn, MemoirScroll, QuoteTimeline, TempleFire, TenkaMap} from '../components/HonnojiArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue1CryCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 「敵は本能寺にあり」と叫んだ？（素材はすべてこの場面だけで使う）
export const Clue1Cry = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Cry" label="第1の手がかり" title="「敵は本能寺にあり」と叫んだ？">
			<Beat name="TenkaMap" captions={c} from={0} to={1}>
				<Visual label="天下統一まで、あと一歩">
					<TenkaMap />
				</Visual>
			</Beat>
			<Beat name="わずかな供だけで、本能寺" captions={c} from={2} to={2}>
				<Photo id="nobunaga" label="わずかな供だけで、本能寺へ" />
			</Beat>
			<Beat name="丹波の亀山城から" captions={c} from={3} to={4}>
				<Photo id="kameyama" move="right" label="丹波の亀山城から" />
			</Beat>
			<Beat name="MarchTurn" captions={c} from={5} to={5}>
				<Visual label="軍勢は、どこへ向かった？">
					<MarchTurn />
				</Visual>
			</Beat>
			<Beat name="川を渡ったところで……" captions={c} from={6} to={7}>
				<Photo id="katsura" move="out" label="川を渡ったところで……" />
			</Beat>
			<Beat name="QuoteTimeline" captions={c} from={8} to={10}>
				<Visual label="その言葉は、いつ書かれた？">
					<QuoteTimeline />
				</Visual>
			</Beat>
			<Beat name="その場にいた兵士の証言" captions={c} from={11} to={14}>
				<Photo id="honnoji-yoshimori" label="その場にいた兵士の証言" />
			</Beat>
			<Beat name="MemoirScroll" captions={c} from={15} to={16}>
				<Visual label="兵士は、何と書き残した？">
					<MemoirScroll />
				</Visual>
			</Beat>
			<Beat name="EmptyGate" captions={c} from={17} to={18}>
				<Visual label="門の向こうに、人の姿は？">
					<EmptyGate />
				</Visual>
			</Beat>
			<Beat name="本能寺の中では、何が？" captions={c} from={19} to={21}>
				<Photo id="honnoji-hondo" move="left" label="本能寺の中では、何が？" />
			</Beat>
			<Beat name="信長が、最後に言ったこと" captions={c} from={22} to={24}>
				<Photo id="mori-ranmaru" label="信長が、最後に言ったことば" />
			</Beat>
			<Beat name="TempleFire" captions={c} from={25} to={26}>
				<Visual label="炎の中の最期">
					<TempleFire />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={27} to={29}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 27, 28, fps)} />
			</Beat>
			<Beat name="なぜ、そこまでして？" captions={c} from={30}>
				<Photo id="mitsuhide-statue" label="なぜ、そこまでして？" />
			</Beat>
		</SceneFrame>
	);
};
