import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue32KoromoCaptions as c} from '../data/captions';

// 即身仏は、いまも衣を替えて祀られている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue32Koromo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue32Koromo" label="第32の手がかり" title="即身仏は、いまも衣を替えて祀られている？">
			<Beat name="大日坊の衣替え" captions={c} from={0} to={0}>
				<Photo id="shonai-plain" move="in" label="大日坊の衣替え" />
			</Beat>
			<Beat name="真如海上人の衣替え" captions={c} from={1} to={2}>
				<Stage label="真如海上人の衣替え">
					<Cards cards={[{head: '大日坊', body: '6年に一度\n丑年と未年'}, {head: '前回', body: '2021年10月14日', tone: 'gold'}]} tone='shrine' size={48} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="弘智法印の衣替え" captions={c} from={3} to={3}>
				<Stage label="弘智法印の衣替え">
					<Cards cards={[{head: '西生寺', body: '12年に一度\n子年'}, {head: '前回', body: '2020年3月', tone: 'gold'}]} tone='shrine' size={48} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="お守りと予約制の拝観" captions={c} from={4} to={4}>
				<Photo id="haguro-shukubo" move="in" label="お守りと予約制の拝観" />
			</Beat>
			<Beat name="守ることの難しさ" captions={c} from={5} to={5}>
				<Stage label="守ることの難しさ">
					<Cards cards={[{head: '2025年', body: '大日坊が\n拝観料を改める'}, {head: '理由', body: '参拝者の減少\n物価の上昇', tone: 'red'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="信仰の対象" captions={c} from={6} to={6}>
				<Photo id="haguro-ohtorii-snow" move="in" label="信仰の対象" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="なぜ知られるようになったのか" captions={c} from={10}>
				<Photo id="chokai-paddies" move="in" label="なぜ知られるようになったのか" />
			</Beat>
		</SceneFrame>
	);
};
