import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {FifteenVsTwenty, Reign87, ShokiTwentyYears} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue7JuryoCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 王は、生きているうちに自分の墓を造った？（素材はすべてこの場面だけで使う）
export const Clue7Juryo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Juryo" label="第7の手がかり" title="王は、生きているうちに自分の墓を造った？">
			<Beat name="ShokiTwentyYears" captions={c} from={0} to={2}>
				<Visual label="日本書紀の記録">
					<ShokiTwentyYears />
				</Visual>
			</Beat>
			<Beat name="亡くなる前から？" captions={c} from={3} to={4}>
				<Photo id="moat-5" label="亡くなる前から？" />
			</Beat>
			<Beat name="始皇帝も" captions={c} from={5} to={6}>
				<Photo id="qin-portrait" move="out" label="始皇帝も" />
			</Beat>
			<Beat name="FifteenVsTwenty" captions={c} from={7} to={8}>
				<Visual label="不思議と近い数字">
					<FifteenVsTwenty />
				</Visual>
			</Beat>
			<Beat name="Reign87" captions={c} from={9} to={10}>
				<Visual label="注意が必要">
					<Reign87 />
				</Visual>
			</Beat>
			<Beat name="考古学では？" captions={c} from={11} to={12}>
				<Photo id="kisaragi-2" label="考古学では？" />
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="中国の皇帝と倭の王" captions={c} from={16}>
				<Photo id="liu-yu" label="中国の皇帝と倭の王" />
			</Beat>
		</SceneFrame>
	);
};
