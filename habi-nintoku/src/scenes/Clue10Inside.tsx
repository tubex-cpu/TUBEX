import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {ChamberFinds, FrontAndBack, LidReburied, Meiji1872, NoEntryLine} from '../components/NintokuArt2';
import {Gowland1872, TwoTheories} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue10InsideCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 中を見た人は誰もいない？（素材はすべてこの場面だけで使う）
export const Clue10Inside = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Inside" label="第10の手がかり" title="中を見た人は誰もいない？">
			<Beat name="NoEntryLine" captions={c} from={0} to={2}>
				<Visual label="研究者でも、入れない？">
					<NoEntryLine />
				</Visual>
			</Beat>
			<Beat name="Meiji1872" captions={c} from={3} to={4}>
				<Visual label="明治5年、何が起きた？">
					<Meiji1872 />
				</Visual>
			</Beat>
			<Beat name="TwoTheories" captions={c} from={5} to={5}>
				<Visual label="きっかけは？">
					<TwoTheories />
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
			<Beat name="2026年、沖ノ島で" captions={c} from={13} to={13}>
				<Photo id="okinoshima-view" label="2026年、沖ノ島で" />
			</Beat>
			<Beat name="明治5年、もうひとつの巡" captions={c} from={14} to={15}>
				<Photo id="mint" label="明治5年、もうひとつの巡り合わせ" />
			</Beat>
			<Beat name="Gowland1872" captions={c} from={16} to={17}>
				<Visual label="イギリスから来た技師">
					<Gowland1872 />
				</Visual>
			</Beat>
			<Beat name="大英博物館に" captions={c} from={18} to={18}>
				<Photo id="silla-jar-bm" label="大英博物館に" />
			</Beat>
			<Beat name="「日本アルプス」の名付け" captions={c} from={19} to={19}>
				<Photo id="alps" label="「日本アルプス」の名付け親" />
			</Beat>
			<Beat name="LidReburied" captions={c} from={20} to={22}>
				<Visual label="棺の中は？">
					<LidReburied />
				</Visual>
			</Beat>
			<Beat name="FrontAndBack" captions={c} from={23} to={25}>
				<Visual label="見つかったのは、どこ？">
					<FrontAndBack />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={26} to={28}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 26, 27, fps)} />
			</Beat>
			<Beat name="宝は、どこへ？" captions={c} from={29}>
				<Photo id="glass-bowl" label="宝は、どこへ？" />
			</Beat>
		</SceneFrame>
	);
};
