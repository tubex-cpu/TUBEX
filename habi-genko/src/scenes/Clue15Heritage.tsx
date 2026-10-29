import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {HeritageAreas} from '../components/NintokuArt2';
import {BufferZone} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue15HeritageCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 世界遺産になって、発掘が進んだ？（素材はすべてこの場面だけで使う）
export const Clue15Heritage = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue15Heritage" label="第15の手がかり" title="世界遺産になって、発掘が進んだ？">
			<Beat name="2019年7月6日" captions={c} from={0} to={1}>
				<Photo id="wh-flag" label="2019年7月6日" />
			</Beat>
			<Beat name="HeritageAreas" captions={c} from={2} to={3}>
				<Visual label="百舌鳥と古市">
					<HeritageAreas />
				</Visual>
			</Beat>
			<Beat name="高く評価されたもの" captions={c} from={4} to={4}>
				<Photo id="furuichi" label="高く評価されたもの" />
			</Beat>
			<Beat name="発掘は、進んだ？" captions={c} from={5} to={6}>
				<Photo id="wh-monument" label="発掘は、進んだ？" />
			</Beat>
			<Beat name="守るためのルール" captions={c} from={7} to={8}>
				<Photo id="wh-monument-2" label="守るためのルール" />
			</Beat>
			<Beat name="BufferZone" captions={c} from={9} to={12}>
				<Visual label="2026年2月、市民からの提案">
					<BufferZone />
				</Visual>
			</Beat>
			<Beat name="未来へ守り伝える約束" captions={c} from={13} to={13}>
				<Photo id="maruhoyama-moat-3" label="未来へ守り伝える約束" />
			</Beat>
			<Beat name="判決" captions={c} from={14} to={16}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 14, 15, fps)} />
			</Beat>
			<Beat name="仁徳天皇陵そのものは？" captions={c} from={17}>
				<Photo id="konda-haisho-2" label="仁徳天皇陵そのものは？" />
			</Beat>
		</SceneFrame>
	);
};
