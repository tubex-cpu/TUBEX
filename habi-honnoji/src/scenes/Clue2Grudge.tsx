import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {FroisNote, MilitaryCode, PoemCard, TwoRecords, UnknownYears} from '../components/HonnojiArt1';
import {GratitudeQuote} from '../components/HonnojiArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue2GrudgeCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 信長への恨みだった？（素材はすべてこの場面だけで使う）
export const Clue2Grudge = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Grudge" label="第2の手がかり" title="信長への恨みだった？">
			<Beat name="光秀は、恨みを積み重ねて" captions={c} from={0} to={1}>
				<Photo id="mitsuhide-ukiyoe" label="光秀は、恨みを積み重ねていた？" />
			</Beat>
			<Beat name="家康をもてなす役" captions={c} from={2} to={4}>
				<Photo id="azuchi" move="right" label="家康をもてなす役" />
			</Beat>
			<Beat name="TwoRecords" captions={c} from={5} to={9}>
				<Visual label="その話は、どの記録に？">
					<TwoRecords />
				</Visual>
			</Beat>
			<Beat name="UnknownYears" captions={c} from={10} to={12}>
				<Visual label="光秀は、謎の多い人物">
					<UnknownYears />
				</Visual>
			</Beat>
			<Beat name="異例の速さで出世した男" captions={c} from={13} to={14}>
				<Photo id="yoshiaki" label="異例の速さで出世した男" />
			</Beat>
			<Beat name="愛宕山で開かれた、連歌の" captions={c} from={15} to={16}>
				<Photo id="atago" move="left" label="愛宕山で開かれた、連歌の会" />
			</Beat>
			<Beat name="PoemCard" captions={c} from={17} to={21}>
				<Visual label="その句に、決意が隠されていた？">
					<PoemCard />
				</Visual>
			</Beat>
			<Beat name="MilitaryCode" captions={c} from={22} to={23}>
				<Visual label="光秀自身が書いた文書">
					<MilitaryCode />
				</Visual>
			</Beat>
			<Beat name="GratitudeQuote" captions={c} from={24} to={26}>
				<Visual label="光秀は、信長をどう思っていた？">
					<GratitudeQuote />
				</Visual>
			</Beat>
			<Beat name="FroisNote" captions={c} from={27} to={29}>
				<Visual label="別の記録が語ること">
					<FroisNote />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={30} to={32}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 30, 31, fps)} />
			</Beat>
			<Beat name="本当の黒幕は、別にいた？" captions={c} from={33}>
				<Photo id="atago-torii" move="out" label="本当の黒幕は、別にいた？" />
			</Beat>
		</SceneFrame>
	);
};
