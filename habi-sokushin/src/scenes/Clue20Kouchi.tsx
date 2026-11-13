import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {BigYears} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue20KouchiCaptions as c} from '../data/captions';

// 弘智法印は、日本で最も古い即身仏？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue20Kouchi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue20Kouchi" label="第20の手がかり" title="弘智法印は、日本で最も古い即身仏？">
			<Beat name="新潟県長岡市 西生寺" captions={c} from={0} to={0}>
				<Photo id="hokuetsu-cover" move="in" label="新潟県長岡市 西生寺" />
			</Beat>
			<Beat name="現存最古とされる僧のミイラ" captions={c} from={1} to={1}>
				<Stage label="現存最古とされる僧のミイラ">
					<BigYears value={1363} unit='年' caption='南北朝時代に亡くなった僧' tone='night' />
				</Stage>
			</Beat>
			<Beat name="鈴木牧之『北越雪譜』" captions={c} from={2} to={2}>
				<Photo id="kouchi-hokuetsu" move="in" label="鈴木牧之『北越雪譜』" />
			</Beat>
			<Beat name="長岡市寺泊" captions={c} from={3} to={3}>
				<Photo id="teradomari-street" move="in" label="長岡市寺泊" />
			</Beat>
			<Beat name="大英博物館で見つかった台本" captions={c} from={4} to={4}>
				<Photo id="british-museum-court" move="in" label="大英博物館で見つかった台本" />
			</Beat>
			<Beat name="寺が示す調査の結果" captions={c} from={5} to={6}>
				<Stage label="寺が示す調査の結果">
					<Cards cards={[{head: '1959年の調査', body: 'ニセモノ疑惑が\nきっかけ'}, {head: '亡くなった年齢', body: '82歳？\n60歳前後？', tone: 'red'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="石の棺に入った即身仏" captions={c} from={10}>
				<Photo id="asakawa-road" move="in" label="石の棺に入った即身仏" />
			</Beat>
		</SceneFrame>
	);
};
