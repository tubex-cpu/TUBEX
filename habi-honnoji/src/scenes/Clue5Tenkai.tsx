import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {AgeCheck, FiveCluesDone, LanternInscription, YamazakiMap} from '../components/HonnojiArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue5TenkaiCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 光秀は生き延びて天海になった？（素材はすべてこの場面だけで使う）
export const Clue5Tenkai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Tenkai" label="第5の手がかり" title="光秀は生き延びて天海になった？">
			<Beat name="YamazakiMap" captions={c} from={0} to={2}>
				<Visual label="天王山のふもとで">
					<YamazakiMap />
				</Visual>
			</Beat>
			<Beat name="坂本城をめざして" captions={c} from={3} to={4}>
				<Photo id="sakamoto-05" move="left" label="坂本城をめざして" />
			</Beat>
			<Beat name="光秀は、生き延びた？" captions={c} from={5} to={7}>
				<Photo id="tenkai" label="光秀は、生き延びた？" />
			</Beat>
			<Beat name="比叡山に残る、光秀の名" captions={c} from={8} to={9}>
				<Photo id="hiei" move="out" label="比叡山に残る、光秀の名" />
			</Beat>
			<Beat name="日光の「明智平」" captions={c} from={10} to={10}>
				<Photo id="akechidaira" move="right" label="日光の「明智平」" />
			</Beat>
			<Beat name="AgeCheck" captions={c} from={11} to={14}>
				<Visual label="年齢は、合うのか？">
					<AgeCheck />
				</Visual>
			</Beat>
			<Beat name="LanternInscription" captions={c} from={15} to={17}>
				<Visual label="名前だけで、本人と言える？">
					<LanternInscription />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="FiveCluesDone" captions={c} from={21}>
				<Visual label="5つの手がかりを、全てたどった">
					<FiveCluesDone />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
