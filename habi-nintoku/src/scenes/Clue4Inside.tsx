import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {ChamberFinds, FrontAndBack, LidReburied, Meiji1872, NoEntryLine} from '../components/NintokuArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue4InsideCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 中を見た人は誰もいない？（素材はすべてこの場面だけで使う）
export const Clue4Inside = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Inside" label="第4の手がかり" title="中を見た人は誰もいない？">
			<Beat name="研究者でも、入れない" captions={c} from={0} to={1}>
				<Photo id="daisen-h4" move="out" label="研究者でも、入れない" />
			</Beat>
			<Beat name="NoEntryLine" captions={c} from={2} to={3}>
				<Visual label="入れるのは、どこまで？">
					<NoEntryLine />
				</Visual>
			</Beat>
			<Beat name="Meiji1872" captions={c} from={4} to={5}>
				<Visual label="明治5年、何が起きた？">
					<Meiji1872 />
				</Visual>
			</Beat>
			<Beat name="長持形石棺とは？" captions={c} from={6} to={6}>
				<Photo id="sarcophagus" label="長持形石棺とは？" />
			</Beat>
			<Beat name="ChamberFinds" captions={c} from={7} to={7}>
				<Visual label="見つかった品々">
					<ChamberFinds />
				</Visual>
			</Beat>
			<Beat name="描き残された石室と石棺" captions={c} from={8} to={10}>
				<Photo id="meiji-drawing" label="描き残された石室と石棺" />
			</Beat>
			<Beat name="小さな飾りが下がる冑" captions={c} from={11} to={11}>
				<Photo id="helmet-ise" label="小さな飾りが下がる冑" />
			</Beat>
			<Beat name="鋲で留めた甲" captions={c} from={12} to={12}>
				<Photo id="cuirass" label="鋲で留めた甲" />
			</Beat>
			<Beat name="LidReburied" captions={c} from={13} to={15}>
				<Visual label="棺の中は？">
					<LidReburied />
				</Visual>
			</Beat>
			<Beat name="FrontAndBack" captions={c} from={16} to={18}>
				<Visual label="見つかったのは、どこ？">
					<FrontAndBack />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={19} to={21}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 19, 20, fps)} />
			</Beat>
			<Beat name="宝は、どこへ？" captions={c} from={22}>
				<Photo id="glass-bowl" label="宝は、どこへ？" />
			</Beat>
		</SceneFrame>
	);
};
