import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {AncientLegend, Back160, KeyFound, MuuEmpire, NameBirth, ReadAsMu, UnreadGlyphs} from '../components/MuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue1NameCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// ムーは、古代から語り継がれてきた？（素材はすべてこの場面だけで使う）
export const Clue1Name = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Name" label="第1の手がかり" title="ムーは、古代から語り継がれてきた？">
			<Beat name="映画、漫画、雑誌の定番" captions={c} from={0} to={1}>
				<Photo id="churchward-mapbook" move="out" label="映画、漫画、雑誌の定番" />
			</Beat>
			<Beat name="MuuEmpire" captions={c} from={2} to={2}>
				<Visual label="海の底の「ムウ帝国」">
					<MuuEmpire />
				</Visual>
			</Beat>
			<Beat name="AncientLegend" captions={c} from={3} to={4}>
				<Visual label="何千年も前から？">
					<AncientLegend />
				</Visual>
			</Beat>
			<Beat name="Back160" captions={c} from={5} to={5}>
				<Visual label="160年前へ">
					<Back160 />
				</Visual>
			</Beat>
			<Beat name="フランスの神父" captions={c} from={6} to={6}>
				<Photo id="brasseur" label="フランスの神父" />
			</Beat>
			<Beat name="中米のマヤ文明" captions={c} from={7} to={7}>
				<Photo id="palenque" move="out" label="中米のマヤ文明" />
			</Beat>
			<Beat name="UnreadGlyphs" captions={c} from={8} to={8}>
				<Visual label="誰にも読めない文字">
					<UnreadGlyphs />
				</Visual>
			</Beat>
			<Beat name="マドリードの図書館で" captions={c} from={9} to={9}>
				<Photo id="madrid-museum" move="left" label="マドリードの図書館で" />
			</Beat>
			<Beat name="宣教師ランダ" captions={c} from={10} to={10}>
				<Photo id="landa" label="宣教師ランダ" />
			</Beat>
			<Beat name="文字とアルファベットの対" captions={c} from={11} to={12}>
				<Photo id="landa-alphabet" label="文字とアルファベットの対応表？" />
			</Beat>
			<Beat name="KeyFound" captions={c} from={13} to={13}>
				<Visual label="これで読める？">
					<KeyFound />
				</Visual>
			</Beat>
			<Beat name="マヤの絵文書" captions={c} from={14} to={15}>
				<Photo id="madrid-b" move="out" label="マヤの絵文書" />
			</Beat>
			<Beat name="ReadAsMu" captions={c} from={16} to={17}>
				<Visual label="ある文字を「ムー」と">
					<ReadAsMu />
				</Visual>
			</Beat>
			<Beat name="NameBirth" captions={c} from={18} to={19}>
				<Visual label="名前の、はじまり">
					<NameBirth />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="本には、何が書かれていた" captions={c} from={23}>
				<Photo id="madrid-c" label="本には、何が書かれていた？" />
			</Beat>
		</SceneFrame>
	);
};
