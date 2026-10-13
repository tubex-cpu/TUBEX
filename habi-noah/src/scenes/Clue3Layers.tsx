import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {CityFloodDates, FloodLayerDig, NovelCover, TownFlood} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {MesopotamiaMap, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue3LayersCaptions as c} from '../data/captions';

// 第3の手がかり 洪水の地層（素材はすべてこの場面だけで使う）
export const Clue3Layers = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Layers" label="第3の手がかり" title="大洪水の跡が見つかった？">
			<Beat name="ウル" captions={c} from={0} to={0}>
				<Photo id="ur-ziggurat-2" move="out" label="1929年、シュメールの町ウル" />
			</Beat>
			<Beat name="金の髪飾り" captions={c} from={1} to={1}>
				<Photo id="puabi" label="前回の法廷で登場した、金の花の髪飾り" />
			</Beat>
			<Beat name="ウーリー" captions={c} from={2} to={2}>
				<Photo id="woolley" label="発掘を率いた考古学者、ウーリー" />
			</Beat>
			<Beat name="泥の層" captions={c} from={3} to={5}>
				<Visual label="王墓の下に、何もない層が">
					<FloodLayerDig />
				</Visual>
			</Beat>
			<Beat name="大洪水の跡だ" captions={c} from={6} to={8}>
				<Photo id="koch-noah" move="right" label="「ついにノアの洪水の証拠が！」" />
			</Beat>
			<Beat name="クリスティー" captions={c} from={9} to={13}>
				<Visual label="この発掘現場を訪れた、意外な人物">
					<NovelCover />
				</Visual>
			</Beat>
			<Beat name="町ごとの層" captions={c} from={14} to={16}>
				<Visual label="ほかの町の“洪水”は、いつ起きた？">
					<CityFloodDates />
				</Visual>
			</Beat>
			<Beat name="キシュ" captions={c} from={17} to={18}>
				<Photo id="kish" move="left" label="町ごとに、時代がばらばら？" />
			</Beat>
			<Beat name="エリドゥ" captions={c} from={19} to={20}>
				<Visual label="すぐ近くの町には、洪水の層がない？">
					<MesopotamiaMap />
				</Visual>
			</Beat>
			<Beat name="ふたつの川" captions={c} from={21} to={21}>
				<Photo id="euphrates" move="right" label="ふたつの大きな川にはさまれた土地" />
			</Beat>
			<Beat name="春の洪水" captions={c} from={22} to={23}>
				<Photo id="marshes" label="雪どけの水が、春に川をあふれさせる" />
			</Beat>
			<Beat name="世界の終わり" captions={c} from={24} to={26}>
				<Visual label="ある町にとっては、世界の終わりだった">
					<TownFlood />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={27} to={29}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 27, 28, fps)} />
			</Beat>
			<Beat name="もっと大きな洪水" captions={c} from={30}>
				<Photo id="black-sea-coast" move="out" label="海がまるごと、あふれた？" />
			</Beat>
		</SceneFrame>
	);
};
