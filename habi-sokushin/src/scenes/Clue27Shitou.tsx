import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue27ShitouCaptions as c} from '../data/captions';

// 日本には、中国から渡ってきた僧のミイラがある？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue27Shitou = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue27Shitou" label="第27の手がかり" title="日本には、中国から渡ってきた僧のミイラがある？">
			<Beat name="横浜市鶴見区 總持寺" captions={c} from={0} to={1}>
				<Photo id="sojiji-corridor" move="in" label="横浜市鶴見区 總持寺" />
			</Beat>
			<Beat name="唐の禅僧・石頭希遷" captions={c} from={2} to={2}>
				<Photo id="shitou-print" move="in" label="唐の禅僧・石頭希遷" />
			</Beat>
			<Beat name="海を渡った肉身仏" captions={c} from={3} to={3}>
				<Stage label="海を渡った肉身仏">
					<TimeBar stops={[{label: '辛亥革命', sub: '日本へ'}, {label: '1914年', sub: '大正博覧会'}, {label: '1975年', sub: '總持寺へ', accent: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="本当に石頭希遷か" captions={c} from={4} to={6}>
				<Stage label="本当に石頭希遷か">
					<Cards cards={[{head: '中国の伝記', body: 'ミイラにした\n記述なし'}, {head: '博覧会', body: '別の寺の像と\n紹介'}, {head: '研究グループ', body: '確かめようが\nない', tone: 'red'}]} tone='ink' size={42} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="漆で固める中国の作り方" captions={c} from={7} to={7}>
				<Photo id="nanhua-1918" move="in" label="漆で固める中国の作り方" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="中国で起きた事件" captions={c} from={11}>
				<Photo id="datian-view" move="in" label="中国で起きた事件" />
			</Beat>
		</SceneFrame>
	);
};
