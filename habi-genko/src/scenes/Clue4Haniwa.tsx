import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {HaniwaFence, HaniwaLegend, HaniwaOrder, KidaiToHaniwa, NintokuHaniwa} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue4HaniwaCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 埴輪は、いけにえの身代わりだった？（素材はすべてこの場面だけで使う）
export const Clue4Haniwa = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Haniwa" label="第4の手がかり" title="埴輪は、いけにえの身代わりだった？">
			<Beat name="日本書紀に書かれた、埴輪" captions={c} from={0} to={0}>
				<Photo id="nihonshoki" label="日本書紀に書かれた、埴輪の始まり" />
			</Beat>
			<Beat name="皇后が亡くなった" captions={c} from={1} to={2}>
				<Photo id="saki-misasagi" label="皇后が亡くなった" />
			</Beat>
			<Beat name="HaniwaLegend" captions={c} from={3} to={5}>
				<Visual label="どうするべきか？">
					<HaniwaLegend />
				</Visual>
			</Beat>
			<Beat name="「土師」という名前" captions={c} from={6} to={7}>
				<Photo id="saki-haisho" label="「土師」という名前" />
			</Beat>
			<Beat name="相撲の神様" captions={c} from={8} to={8}>
				<Photo id="sumo" label="相撲の神様" />
			</Beat>
			<Beat name="土師ニサンザイ古墳" captions={c} from={9} to={10}>
				<Photo id="nisanzai" move="out" label="土師ニサンザイ古墳" />
			</Beat>
			<Beat name="人の形の、身代わり？" captions={c} from={11} to={11}>
				<Photo id="haniwa-horse" label="人の形の、身代わり？" />
			</Beat>
			<Beat name="最初に現れた埴輪は？" captions={c} from={12} to={13}>
				<Photo id="haniwa-takara" label="最初に現れた埴輪は？" />
			</Beat>
			<Beat name="KidaiToHaniwa" captions={c} from={14} to={14}>
				<Visual label="もとになったのは？">
					<KidaiToHaniwa />
				</Visual>
			</Beat>
			<Beat name="HaniwaOrder" captions={c} from={15} to={16}>
				<Visual label="埴輪が現れた順番">
					<HaniwaOrder />
				</Visual>
			</Beat>
			<Beat name="HaniwaFence" captions={c} from={17} to={18}>
				<Visual label="何のために並べた？">
					<HaniwaFence />
				</Visual>
			</Beat>
			<Beat name="順番が、逆？" captions={c} from={19} to={20}>
				<Photo id="haniwa-shield" label="順番が、逆？" />
			</Beat>
			<Beat name="神話として" captions={c} from={21} to={21}>
				<Photo id="haniwa-shieldman" label="神話として" />
			</Beat>
			<Beat name="NintokuHaniwa" captions={c} from={22} to={23}>
				<Visual label="仁徳天皇陵の埴輪は？">
					<NintokuHaniwa />
				</Visual>
			</Beat>
			<Beat name="最も古い、人の形？" captions={c} from={24} to={25}>
				<Photo id="haniwa-woman" label="最も古い、人の形？" />
			</Beat>
			<Beat name="判決" captions={c} from={26} to={28}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 26, 27, fps)} />
			</Beat>
			<Beat name="寄りそう小さな古墳たち" captions={c} from={29}>
				<Photo id="moat-3" label="寄りそう小さな古墳たち" />
			</Beat>
		</SceneFrame>
	);
};
