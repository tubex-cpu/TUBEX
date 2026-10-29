import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {ChartErased, ChartWithIsland, DepthSounding, OnlyOnPaper, SandyMap, SandyTimeline} from '../components/MuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue15SandyCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 太平洋には、地図から消された島がある？（素材はすべてこの場面だけで使う）
export const Clue15Sandy = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue15Sandy" label="第15の手がかり" title="太平洋には、地図から消された島がある？">
			<Beat name="SandyMap" captions={c} from={0} to={0}>
				<Visual label="サンゴの海">
					<SandyMap />
				</Visual>
			</Beat>
			<Beat name="ChartWithIsland" captions={c} from={1} to={4}>
				<Visual label="100年以上、地図に">
					<ChartWithIsland />
				</Visual>
			</Beat>
			<Beat name="ChartErased" captions={c} from={5} to={7}>
				<Visual label="2012年、消えた">
					<ChartErased />
				</Visual>
			</Beat>
			<Beat name="研究船サザン・サーベイヤ" captions={c} from={8} to={11}>
				<Photo id="southern-surveyor" label="研究船サザン・サーベイヤー号" />
			</Beat>
			<Beat name="DepthSounding" captions={c} from={12} to={15}>
				<Visual label="そこには、何もなかった">
					<DepthSounding />
				</Visual>
			</Beat>
			<Beat name="SandyTimeline" captions={c} from={16} to={18}>
				<Visual label="気づいていた人々">
					<SandyTimeline />
				</Visual>
			</Beat>
			<Beat name="OnlyOnPaper" captions={c} from={19} to={20}>
				<Visual label="地図の上だけの島">
					<OnlyOnPaper />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={21} to={23}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 21, 22, fps)} />
			</Beat>
			<Beat name="科学者も信じた？" captions={c} from={24}>
				<Photo id="sclater" label="科学者も信じた？" />
			</Beat>
		</SceneFrame>
	);
};
