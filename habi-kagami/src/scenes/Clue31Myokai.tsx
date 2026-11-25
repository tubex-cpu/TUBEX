import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue31MyokaiCaptions as c} from '../data/captions';

// 即身仏は、すべて寺が守っている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue31Myokai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue31Myokai" label="第31の手がかり" title="即身仏は、すべて寺が守っている？">
			<Beat name="寺と檀家" captions={c} from={0} to={1}>
				<Photo id="sensoji-incense" move="in" label="寺と檀家" />
			</Beat>
			<Beat name="山形県米沢市" captions={c} from={2} to={2}>
				<Stage label="山形県米沢市">
					<ReliefMap view='shonai' zoom={1.0} pins={[{at: P.yonezawa, name: '米沢', sub: '明海上人', big: true, t: 6, dy: -40}, {at: P.yudono, name: '湯殿山', t: 40}]} />
				</Stage>
			</Beat>
			<Beat name="目を治すために" captions={c} from={3} to={3}>
				<Photo id="komenoko-taki" move="in" label="目を治すために" />
			</Beat>
			<Beat name="国内でただひとつ" captions={c} from={4} to={6}>
				<Stage label="国内でただひとつ">
					<Cards cards={[{head: '多くの即身仏', body: '寺が守る'}, {head: '明海上人', body: '個人の家が守る', tone: 'gold'}]} tone='moss' size={48} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="衣を替えて" captions={c} from={10}>
				<Photo id="mokugyo-met-w" move="scroll" label="衣を替えて" />
			</Beat>
		</SceneFrame>
	);
};
