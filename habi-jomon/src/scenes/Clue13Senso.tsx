import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {CountBars} from '../components/KagamiArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue13SensoCaptions as c} from '../data/captions';

// 縄文時代には、戦争がなかった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue13Senso = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue13Senso" label="第13の手がかり" title="縄文時代には、戦争がなかった？">
			<Beat name="2016年 全国の人骨を調べる" captions={c} from={0} to={0}>
				<Photo id="c13-arrowheads-many" move="in" label="2016年 全国の人骨を調べる" />
			</Beat>
			<Beat name="暴力の跡を数える" captions={c} from={1} to={1}>
				<Photo id="c13-jomon-arrowheads" move="in" label="暴力の跡を数える" />
			</Beat>
			<Beat name="くらべると" captions={c} from={2} to={4}>
				<Stage label="くらべると">
					<CountBars bars={[{label: '縄文の大人', value: 1.8, accent: true}, {label: '子どもも含む', value: 0.9}, {label: '世界の狩猟採集民', value: 10, sub: '10%を超える例も'}]} unit='%' max={12} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="ゼロではない" captions={c} from={5} to={5}>
				<Photo id="c13-obsidian-blades" move="in" label="ゼロではない" />
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="争いを嫌う人々？" captions={c} from={9}>
				<Photo id="c14-goshono-stones" move="in" label="争いを嫌う人々？" />
			</Beat>
		</SceneFrame>
	);
};
