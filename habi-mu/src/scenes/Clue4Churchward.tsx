import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {AnswerInBook, GasChambers, MuBook1926, MuExtent, MuInJapan, MuSeries, OneManReading, TwoRecords, WhereFrom} from '../components/MuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue4ChurchwardCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 6400万人が暮らす大陸があった？（素材はすべてこの場面だけで使う）
export const Clue4Churchward = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Churchward" label="第4の手がかり" title="6400万人が暮らす大陸があった？">
			<Beat name="MuBook1926" captions={c} from={0} to={1}>
				<Visual label="1926年、1冊の本">
					<MuBook1926 />
				</Visual>
			</Beat>
			<Beat name="ジェームズ・チャーチワー" captions={c} from={2} to={3}>
				<Photo id="churchward" label="ジェームズ・チャーチワード" />
			</Beat>
			<Beat name="MuExtent" captions={c} from={4} to={5}>
				<Visual label="太平洋のまんなかに">
					<MuExtent />
				</Visual>
			</Beat>
			<Beat name="本に描かれたムー大陸" captions={c} from={6} to={7}>
				<Photo id="churchward-map" label="本に描かれたムー大陸" />
			</Beat>
			<Beat name="GasChambers" captions={c} from={8} to={11}>
				<Visual label="なぜ、沈んだ？">
					<GasChambers />
				</Visual>
			</Beat>
			<Beat name="南の島々の遺跡は、名残？" captions={c} from={12} to={12}>
				<Photo id="nanmadol-d" label="南の島々の遺跡は、名残？" />
			</Beat>
			<Beat name="MuSeries" captions={c} from={13} to={14}>
				<Visual label="ムーの本は、続いた">
					<MuSeries />
				</Visual>
			</Beat>
			<Beat name="MuInJapan" captions={c} from={15} to={18}>
				<Visual label="日本にも届いた">
					<MuInJapan />
				</Visual>
			</Beat>
			<Beat name="WhereFrom" captions={c} from={19} to={20}>
				<Visual label="どこから来た数字？">
					<WhereFrom />
				</Visual>
			</Beat>
			<Beat name="AnswerInBook" captions={c} from={21} to={22}>
				<Visual label="答えは、本の中に">
					<AnswerInBook />
				</Visual>
			</Beat>
			<Beat name="OneManReading" captions={c} from={23} to={24}>
				<Visual label="ひとりの読み解き">
					<OneManReading />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={25} to={27}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 25, 26, fps)} />
			</Beat>
			<Beat name="TwoRecords" captions={c} from={28}>
				<Visual label="すべての土台">
					<TwoRecords />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
