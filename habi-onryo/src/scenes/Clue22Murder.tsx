import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue22MurderCaptions as c} from '../data/captions';

// 崇徳上皇は、讃岐で殺された？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue22Murder = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue22Murder" label="第22の手がかり" title="崇徳上皇は、讃岐で殺された？">
			<Beat name="1164年8月 46歳" captions={c} from={0} to={1}>
				<Photo id="shiramine-gu" move="in" label="1164年8月 46歳" />
			</Beat>
			<Beat name="どのように亡くなったのか" captions={c} from={2} to={3}>
				<Stage label="どのように亡くなったのか">
					<Cards cards={[{head: '『今鏡』', body: '平安時代の終わりの\n歴史物語'}, {head: '上皇の最期', body: '息子を嘆く\n心の痛み'}]} tone='ink' size={46} height={330} top={370} />
				</Stage>
			</Beat>
			<Beat name="まったく違う話" captions={c} from={4} to={6}>
				<Stage label="まったく違う話">
					<Cards cards={[{head: '暗殺の話', body: '二条天皇の命令で\n地元の武士が？', tone: 'red'}, {head: '八十場の泉', body: 'なきがらを\n浸したという'}, {head: '出てくるのは', body: '江戸時代の\n讃岐の地誌など'}]} tone='shrine' size={42} height={350} top={360} />
				</Stage>
			</Beat>
			<Beat name="白峯の山" captions={c} from={7} to={7}>
				<Photo id="shiramine-pagoda" move="in" label="白峯の山" />
			</Beat>
			<Beat name="白峯寺" captions={c} from={8} to={8}>
				<Photo id="tonshoji-gate" move="in" label="白峯寺" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="墓を訪ねた人は" captions={c} from={12}>
				<Photo id="shiramine-yohaisho" move="in" label="墓を訪ねた人は" />
			</Beat>
		</SceneFrame>
	);
};
