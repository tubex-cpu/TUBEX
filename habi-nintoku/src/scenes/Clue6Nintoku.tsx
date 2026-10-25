import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {BuildOrder, FiveKings, KamadoSmoke, NoNameTag, TwoChronicles} from '../components/NintokuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue6NintokuCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 眠っているのは仁徳天皇？（素材はすべてこの場面だけで使う）
export const Clue6Nintoku = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Nintoku" label="第6の手がかり" title="眠っているのは仁徳天皇？">
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
			<Beat name="鳥の名前を持つ天皇" captions={c} from={7} to={10}>
				<Photo id="nintoku-matsuoka" label="鳥の名前を持つ天皇" />
			</Beat>
			<Beat name="難波の高津宮" captions={c} from={11} to={11}>
				<Photo id="kozu" move="left" label="難波の高津宮" />
			</Beat>
			<Beat name="工事の日、鹿が" captions={c} from={12} to={13}>
				<Photo id="deer" label="工事の日、鹿が" />
			</Beat>
			<Beat name="鹿の耳から、モズ？" captions={c} from={14} to={16}>
				<Photo id="shrike" move="out" label="鹿の耳から、モズ？" />
			</Beat>
			<Beat name="宮内庁が管理する墓" captions={c} from={17} to={18}>
				<Photo id="iha" label="宮内庁が管理する墓" />
			</Beat>
			<Beat name="すぐ南の、もうひとつの巨" captions={c} from={19} to={20}>
				<Photo id="kamiishizu-h" move="right" label="すぐ南の、もうひとつの巨大古墳" />
			</Beat>
			<Beat name="BuildOrder" captions={c} from={21} to={22}>
				<Visual label="順番が、合わない？">
					<BuildOrder />
				</Visual>
			</Beat>
			<Beat name="年代を知る手がかり" captions={c} from={23} to={24}>
				<Photo id="mozu-hachiman" label="年代を知る手がかり" />
			</Beat>
			<Beat name="NoNameTag" captions={c} from={25} to={27}>
				<Visual label="誰の墓？">
					<NoNameTag />
				</Visual>
			</Beat>
			<Beat name="名前は、見つかっていない" captions={c} from={28} to={29}>
				<Photo id="haniwa-young" label="名前は、見つかっていない" />
			</Beat>
			<Beat name="中国の歴史書『宋書』" captions={c} from={30} to={31}>
				<Photo id="songshu" label="中国の歴史書『宋書』" />
			</Beat>
			<Beat name="FiveKings" captions={c} from={32} to={34}>
				<Visual label="5人の倭の王">
					<FiveKings />
				</Visual>
			</Beat>
			<Beat name="TwoChronicles" captions={c} from={35} to={35}>
				<Visual label="2つの国の記録">
					<TwoChronicles />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={36} to={38}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 36, 37, fps)} />
			</Beat>
			<Beat name="いつから、造られた？" captions={c} from={39}>
				<Photo id="daisen-h4" move="out" label="いつから、造られた？" />
			</Beat>
		</SceneFrame>
	);
};
