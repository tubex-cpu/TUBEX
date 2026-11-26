import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Flow, Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue14HeiwaCaptions as c} from '../data/captions';

// 縄文人は、平和主義だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue14Heiwa = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue14Heiwa" label="第14の手がかり" title="縄文人は、平和主義だった？">
			<Beat name="本当に言える？" captions={c} from={0} to={0}>
				<Stage label="本当に言える？">
					<Scroll text={'縄文人は平和を大切にした'} source='よく語られる話' />
				</Stage>
			</Beat>
			<Beat name="骨が教えてくれること" captions={c} from={1} to={2}>
				<Stage label="骨が教えてくれること">
					<Flow steps={[{head: '骨', body: '亡くなった\n理由'}, {head: '考え方', body: '骨からは\n分からない', dim: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="考えられる理由" captions={c} from={3} to={4}>
				<Stage label="考えられる理由">
					<Cards cards={[{head: '人が少ない', body: '土地に\nゆとり'}, {head: 'やりとり', body: '足りないものを\n分け合う'}, {head: '蓄えが小さい', body: '奪い合う\nほどない', tone: 'gold'}]} tone='moss' size={44} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="遠い村とつながっていた？" captions={c} from={8}>
				<Photo id="c15-jade-coast" move="in" label="遠い村とつながっていた？" />
			</Beat>
		</SceneFrame>
	);
};
