import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue17KamiCaptions as c} from '../data/captions';

// 鏡は、神そのものとしてまつられてきた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue17Kami = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue17Kami" label="第17の手がかり" title="鏡は、神そのものとしてまつられてきた？">
			<Beat name="背中に刻まれた神々" captions={c} from={0} to={0}>
				<Photo id="c17-xiwangmu-mirror" move="in" label="背中に刻まれた神々" />
			</Beat>
			<Beat name="長寿と魔除けの願い" captions={c} from={1} to={2}>
				<Photo id="c17-xiwangmu-peach" move="in" label="長寿と魔除けの願い" />
			</Beat>
			<Beat name="鏡は神そのものに" captions={c} from={3} to={4}>
				<Stage label="鏡は神そのものに">
					<Scroll text={'この鏡を見ることは\n私を見るのと同じように'} source='日本書紀 天照大神の言葉（要約）' />
				</Stage>
			</Beat>
			<Beat name="伊勢神宮 内宮" captions={c} from={5} to={5}>
				<Photo id="c17-naiku-ujibashi" move="in" label="伊勢神宮 内宮" />
			</Beat>
			<Beat name="鏡作坐天照御魂神社" captions={c} from={6} to={6}>
				<Photo id="c17-kagamitsukuri-haiden" move="in" label="鏡作坐天照御魂神社" />
			</Beat>
			<Beat name="鏡の前で手を合わせる" captions={c} from={7} to={7}>
				<Photo id="c17-masakaki" move="in" label="鏡の前で手を合わせる" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="一つ目の問いは預ける" captions={c} from={11} to={11}>
				<Stage label="一つ目の問いは預ける">
					<Cards cards={[{head: '年号', body: '合う'}, {head: '数', body: '合わない', tone: 'red'}, {head: '中国', body: '出ない', tone: 'red'}, {head: '作った場所', body: '決まらない', tone: 'red'}]} tone='ink' size={44} height={300} top={380} />
				</Stage>
			</Beat>
			<Beat name="二つ目の問い" captions={c} from={12}>
				<Photo id="c17-kagamitsukuri-honden" move="in" label="二つ目の問い" />
			</Beat>
		</SceneFrame>
	);
};
