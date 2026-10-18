import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {ErosionMethod, FriendsGraffiti, GizaMap, InheritedBuilding, KhufuFace, MortarDating, PyramidSpecs, ScatterAges} from '../components/PyramidArt1';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue1AgeCaptions as c} from '../data/captions';

// 第1の手がかり 2万年以上前に造られた？（素材はすべてこの場面だけで使う）
export const Clue1Age = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Age" label="第1の手がかり" title="2万年以上前に造られた？">
			<Beat name="ギザの台地" captions={c} from={0} to={1}>
				<Visual label="カイロのすぐ西、ギザの台地">
					<GizaMap />
				</Visual>
			</Beat>
			<Beat name="クフ王のピラミッド" captions={c} from={2} to={2}>
				<Photo id="great-pyramid" move="out" label="最も大きな、クフ王のピラミッド" />
			</Beat>
			<Beat name="大きさ" captions={c} from={3} to={4}>
				<Visual label="どれほど巨大なのか？">
					<PyramidSpecs />
				</Visual>
			</Beat>
			<Beat name="4500年前" captions={c} from={5} to={5}>
				<Photo id="usaaf-1943" move="left" label="教科書では、4500年前" />
			</Beat>
			<Beat name="クフ王の顔" captions={c} from={6} to={7}>
				<Visual label="クフ王は、どんな顔だった？">
					<KhufuFace />
				</Visual>
			</Beat>
			<Beat name="象牙の像" captions={c} from={8} to={9}>
				<Photo id="khufu-statuette" label="最大のピラミッドの王の、ただひとつの像" />
			</Beat>
			<Beat name="ボローニャ" captions={c} from={10} to={11}>
				<Photo id="bologna" move="right" label="2026年1月、イタリアからの発表" />
			</Beat>
			<Beat name="すり減り" captions={c} from={12} to={12}>
				<Visual label="石のすり減り方で、年代がわかる？">
					<ErosionMethod />
				</Visual>
			</Beat>
			<Beat name="化粧石" captions={c} from={13} to={13}>
				<Photo id="casing-bm" label="ピラミッドをおおっていた、白い石" />
			</Beat>
			<Beat name="持ち去られた石" captions={c} from={14} to={14}>
				<Photo id="sultan-hassan" label="はがされた石は、どこへ？" />
			</Beat>
			<Beat name="守られた部分" captions={c} from={15} to={15}>
				<Photo id="khafre-top" move="out" label="守られた面と、さらされた面" />
			</Beat>
			<Beat name="修理しただけ" captions={c} from={16} to={17}>
				<Visual label="クフ王が造ったのでは、ない？">
					<InheritedBuilding />
				</Visual>
			</Beat>
			<Beat name="ばらつき" captions={c} from={18} to={20}>
				<Visual label="その数字、どこまで信じられる？">
					<ScatterAges />
				</Visual>
			</Beat>
			<Beat name="しっくいの炭" captions={c} from={21} to={24}>
				<Visual label="しっくいの炭が教える年代は？">
					<MortarDating />
				</Visual>
			</Beat>
			<Beat name="落書き" captions={c} from={25} to={28}>
				<Visual label="造った人々が残した、赤い文字">
					<FriendsGraffiti />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={29} to={31}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 29, 30, fps)} />
			</Beat>
			<Beat name="ピラミッドの下" captions={c} from={32}>
				<Photo id="cheops-side" move="left" label="ピラミッドの下に、何が眠る？" />
			</Beat>
		</SceneFrame>
	);
};
