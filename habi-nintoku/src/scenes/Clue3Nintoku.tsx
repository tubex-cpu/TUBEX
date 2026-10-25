import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {BuildOrder, FiveKings, KamadoSmoke, NoNameTag, TwoChronicles} from '../components/NintokuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue3NintokuCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 眠っているのは仁徳天皇？（素材はすべてこの場面だけで使う）
export const Clue3Nintoku = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Nintoku" label="第3の手がかり" title="眠っているのは仁徳天皇？">
			<Beat name="16代目の天皇" captions={c} from={0} to={0}>
				<Photo id="nintoku-chikanobu" label="16代目の天皇" />
			</Beat>
			<Beat name="「民のかまど」" captions={c} from={1} to={1}>
				<Photo id="nintoku-gekko" label="「民のかまど」" />
			</Beat>
			<Beat name="KamadoSmoke" captions={c} from={2} to={5}>
				<Visual label="かまどの煙">
					<KamadoSmoke />
				</Visual>
			</Beat>
			<Beat name="「聖帝」とたたえられた" captions={c} from={6} to={6}>
				<Photo id="kozu-1910" label="「聖帝」とたたえられた" />
			</Beat>
			<Beat name="難波の高津宮" captions={c} from={7} to={7}>
				<Photo id="kozu" move="left" label="難波の高津宮" />
			</Beat>
			<Beat name="日本書紀に書かれた、不思" captions={c} from={8} to={8}>
				<Photo id="nihonshoki" label="日本書紀に書かれた、不思議な話" />
			</Beat>
			<Beat name="工事の日、鹿が" captions={c} from={9} to={9}>
				<Photo id="deer" label="工事の日、鹿が" />
			</Beat>
			<Beat name="鹿の耳から、モズ？" captions={c} from={10} to={11}>
				<Photo id="shrike" move="out" label="鹿の耳から、モズ？" />
			</Beat>
			<Beat name="百舌鳥古墳群" captions={c} from={12} to={13}>
				<Photo id="moat-3" label="百舌鳥古墳群" />
			</Beat>
			<Beat name="宮内庁が管理する墓" captions={c} from={14} to={14}>
				<Photo id="iha" label="宮内庁が管理する墓" />
			</Beat>
			<Beat name="すぐ南の、もうひとつの巨" captions={c} from={15} to={16}>
				<Photo id="kamiishizu-h" move="right" label="すぐ南の、もうひとつの巨大古墳" />
			</Beat>
			<Beat name="BuildOrder" captions={c} from={17} to={18}>
				<Visual label="順番が、合わない？">
					<BuildOrder />
				</Visual>
			</Beat>
			<Beat name="NoNameTag" captions={c} from={19} to={20}>
				<Visual label="名前は、見つかっていない">
					<NoNameTag />
				</Visual>
			</Beat>
			<Beat name="年代を示す、埴輪" captions={c} from={21} to={21}>
				<Photo id="haniwa-takara" label="年代を示す、埴輪" />
			</Beat>
			<Beat name="中国の歴史書『宋書』" captions={c} from={22} to={22}>
				<Photo id="songshu" label="中国の歴史書『宋書』" />
			</Beat>
			<Beat name="FiveKings" captions={c} from={23} to={25}>
				<Visual label="5人の倭の王">
					<FiveKings />
				</Visual>
			</Beat>
			<Beat name="TwoChronicles" captions={c} from={26} to={26}>
				<Visual label="2つの国の記録">
					<TwoChronicles />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={27} to={29}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 27, 28, fps)} />
			</Beat>
			<Beat name="中を見た人は、いない？" captions={c} from={30}>
				<Photo id="daisen-h3" label="中を見た人は、いない？" />
			</Beat>
		</SceneFrame>
	);
};
