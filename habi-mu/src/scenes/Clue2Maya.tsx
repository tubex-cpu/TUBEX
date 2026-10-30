import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {BeRoad, CrossedAnswers, KanjiKana, KeyReborn, Knorozov1952, NotAlphabet, WrongKey} from '../components/MuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue2MayaCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// マヤの本には、沈んだ大陸が書かれていた？（素材はすべてこの場面だけで使う）
export const Clue2Maya = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Maya" label="第2の手がかり" title="マヤの本には、沈んだ大陸が書かれていた？">
			<Beat name="表の、落とし穴" captions={c} from={0} to={1}>
				<Photo id="landa-alphabet-2" label="表の、落とし穴" />
			</Beat>
			<Beat name="NotAlphabet" captions={c} from={2} to={3}>
				<Visual label="アルファベットでは、ない？">
					<NotAlphabet />
				</Visual>
			</Beat>
			<Beat name="KanjiKana" captions={c} from={4} to={4}>
				<Visual label="漢字とかなに近い">
					<KanjiKana />
				</Visual>
			</Beat>
			<Beat name="WrongKey" captions={c} from={5} to={6}>
				<Visual label="合わない鍵">
					<WrongKey />
				</Visual>
			</Beat>
			<Beat name="CrossedAnswers" captions={c} from={7} to={9}>
				<Visual label="すれ違った質問と答え">
					<CrossedAnswers />
				</Visual>
			</Beat>
			<Beat name="沈んだ土地の物語は？" captions={c} from={10} to={10}>
				<Photo id="codex-calendar" label="沈んだ土地の物語は？" />
			</Beat>
			<Beat name="Knorozov1952" captions={c} from={11} to={12}>
				<Visual label="1952年、新しい読み方">
					<Knorozov1952 />
				</Visual>
			</Beat>
			<Beat name="BeRoad" captions={c} from={13} to={14}>
				<Visual label="「B」と聞かれて">
					<BeRoad />
				</Visual>
			</Beat>
			<Beat name="解読を進めた研究者" captions={c} from={15} to={16}>
				<Photo id="knorozov" label="解読を進めた研究者" />
			</Beat>
			<Beat name="王の名前、即位の日付" captions={c} from={17} to={17}>
				<Photo id="copan-stela" move="out" label="王の名前、即位の日付" />
			</Beat>
			<Beat name="KeyReborn" captions={c} from={18} to={19}>
				<Visual>
					<KeyReborn />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="物語は、どう広まった？" captions={c} from={23}>
				<Photo id="stela-catherwood" label="物語は、どう広まった？" />
			</Beat>
		</SceneFrame>
	);
};
