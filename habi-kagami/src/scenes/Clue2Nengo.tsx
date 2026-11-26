import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2NengoCaptions as c} from '../data/captions';

// 卑弥呼が使いを送ったのは、239年？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue2Nengo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Nengo" label="第2の手がかり" title="卑弥呼が使いを送ったのは、239年？">
			<Beat name="教科書では239年" captions={c} from={0} to={0}>
				<Photo id="c02-nihonshoki-tanaka" move="scroll" label="教科書では239年" />
			</Beat>
			<Beat name="書かれた年が違う" captions={c} from={1} to={2}>
				<Stage label="書かれた年が違う">
					<Cards cards={[{head: '魏志倭人伝', body: '景初二年\n238年', tone: 'red'}, {head: '梁書・日本書紀', body: '景初三年\n239年'}]} tone='ink' size={50} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="戦いの最中に？" captions={c} from={3} to={5}>
				<Stage label="戦いの最中に？">
					<TimeBar stops={[{label: '238年 夏', sub: '倭の使いが帯方郡へ？'}, {label: '238年 秋', sub: '公孫氏が滅ぶ', accent: true}, {label: '239年', sub: '景初三年'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="決め手はない" captions={c} from={6} to={6}>
				<Photo id="c02-luoyang-wall" move="in" label="決め手はない" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="鏡を運んだのは誰？" captions={c} from={10}>
				<Photo id="c02-luoyang-palace3" move="in" label="鏡を運んだのは誰？" />
			</Beat>
		</SceneFrame>
	);
};
