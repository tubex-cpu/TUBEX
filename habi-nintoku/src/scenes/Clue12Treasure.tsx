import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {KnifeDiagram, TreasurePath, WrapperNote} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue12TreasureCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 明治5年の宝は、すべて失われた？（素材はすべてこの場面だけで使う）
export const Clue12Treasure = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue12Treasure" label="第12の手がかり" title="明治5年の宝は、すべて失われた？">
			<Beat name="埋め戻された宝" captions={c} from={0} to={1}>
				<Photo id="otsukayama-armor" label="埋め戻された宝" />
			</Beat>
			<Beat name="残されたのは、絵だけ？" captions={c} from={2} to={3}>
				<Photo id="sakai-museum" label="残されたのは、絵だけ？" />
			</Beat>
			<Beat name="2025年6月、思いがけ" captions={c} from={4} to={5}>
				<Photo id="daisen-park" label="2025年6月、思いがけない発表" />
			</Beat>
			<Beat name="目利きの遺品" captions={c} from={6} to={7}>
				<Photo id="kokugakuin" label="目利きの遺品" />
			</Beat>
			<Beat name="WrapperNote" captions={c} from={8} to={9}>
				<Visual label="包み紙に書かれていたのは？">
					<WrapperNote />
				</Visual>
			</Beat>
			<Beat name="KnifeDiagram" captions={c} from={10} to={11}>
				<Visual label="中に入っていたもの">
					<KnifeDiagram />
				</Visual>
			</Beat>
			<Beat name="木の箱に押された印" captions={c} from={12} to={13}>
				<Photo id="masuda" label="木の箱に押された印" />
			</Beat>
			<Beat name="TreasurePath" captions={c} from={14} to={14}>
				<Visual label="宝がたどった道">
					<TreasurePath />
				</Visual>
			</Beat>
			<Beat name="150年ぶりの公開" captions={c} from={15} to={17}>
				<Photo id="otsukayama-beads" label="150年ぶりの公開" />
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="今も、誰も入れない？" captions={c} from={21}>
				<Photo id="gosashi" label="今も、誰も入れない？" />
			</Beat>
		</SceneFrame>
	);
};
