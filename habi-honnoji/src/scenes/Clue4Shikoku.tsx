import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {ShikokuCountdown, ShikokuMap, TieDiagram} from '../components/HonnojiArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue4ShikokuCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 四国の問題で追い詰められていた？（素材はすべてこの場面だけで使う）
export const Clue4Shikoku = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Shikoku" label="第4の手がかり" title="四国の問題で追い詰められていた？">
			<Beat name="2014年、岡山の美術館" captions={c} from={0} to={1}>
				<Photo id="hayashibara" move="left" label="2014年、岡山の美術館で" />
			</Beat>
			<Beat name="四国の大名から届いた手紙" captions={c} from={2} to={4}>
				<Photo id="kochi" move="right" label="四国の大名から届いた手紙" />
			</Beat>
			<Beat name="TieDiagram" captions={c} from={5} to={6}>
				<Visual label="光秀と四国を結ぶ糸">
					<TieDiagram />
				</Visual>
			</Beat>
			<Beat name="ShikokuMap" captions={c} from={7} to={13}>
				<Visual label="信長は、方針を変えた">
					<ShikokuMap />
				</Visual>
			</Beat>
			<Beat name="ShikokuCountdown" captions={c} from={14} to={17}>
				<Visual label="手紙から、わずか12日後に">
					<ShikokuCountdown />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="光秀の物語には、続きがあ" captions={c} from={21}>
				<Photo id="atago-torii" move="out" label="光秀の物語には、続きがある" />
			</Beat>
		</SceneFrame>
	);
};
