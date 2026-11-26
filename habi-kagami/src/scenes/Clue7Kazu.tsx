import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {CountBars} from '../components/KagamiArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7KazuCaptions as c} from '../data/captions';

// 三角縁神獣鏡は、百枚しかない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue7Kazu = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Kazu" label="第7の手がかり" title="三角縁神獣鏡は、百枚しかない？">
			<Beat name="数え方で差がある" captions={c} from={0} to={2}>
				<Stage label="数え方で差がある">
					<CountBars bars={[{label: '1990年代', value: 330}, {label: '2010年', value: 560}, {label: '2025年', value: 600, accent: true, sub: '奈良市の資料'}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="百枚の5倍以上" captions={c} from={3} to={3}>
				<Photo id="c07-tsubai-21" move="in" label="百枚の5倍以上" />
			</Beat>
			<Beat name="何度ももらった？" captions={c} from={4} to={5}>
				<Photo id="c07-kai-choshizuka" move="in" label="何度ももらった？" />
			</Beat>
			<Beat name="二度目からの枚数は" captions={c} from={6} to={7}>
				<Photo id="c07-tsubai-26" move="in" label="二度目からの枚数は" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="最初の疑い" captions={c} from={11} to={11}>
				<Stage label="最初の疑い">
					<Cards cards={[{head: '年号', body: '合う'}, {head: '数', body: '合わない', tone: 'red'}]} tone='ink' size={60} height={300} top={380} />
				</Stage>
			</Beat>
			<Beat name="中国からは？" captions={c} from={12}>
				<Photo id="c08-palace-museum-mirror" move="in" label="中国からは？" />
			</Beat>
		</SceneFrame>
	);
};
