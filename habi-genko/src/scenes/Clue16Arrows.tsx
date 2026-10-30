import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {ArmsFlow, SieveMud} from '../components/GenkoArt4';
import {Cards, MapScene} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue16ArrowsCaptions as c} from '../data/captions';

// 元軍は、滅ぼした国の武器まで使っていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue16Arrows = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue16Arrows" label="第16の手がかり" title="元軍は、滅ぼした国の武器まで使っていた？">
			<Beat name="船底の泥を、ふるうと？" captions={c} from={0} to={2}>
				<Stage label="船底の泥を、ふるうと？">
					<SieveMud />
				</Stage>
			</Beat>
			<Beat name="どんな矢だった？" captions={c} from={3} to={8}>
				<Stage label="どんな矢だった？">
					<Cards cards={[{head: '色', body: '黒い漆\n端に赤い漆', tone: 'dark'}, {head: '矢筈', body: '溝がなく\n皿のように浅い', tone: 'gold'}, {head: '羽根', body: '鳥の羽ではなく\n木の板', tone: 'dark'}]} tone='ember' size={44} />
				</Stage>
			</Beat>
			<Beat name="武器の改良" captions={c} from={9} to={9}>
				<Photo id="mongol-bow" move="in" label="武器の改良" />
			</Beat>
			<Beat name="なぜ、元の船に？" captions={c} from={10} to={12}>
				<Stage label="なぜ、元の船に？">
					<ArmsFlow />
				</Stage>
			</Beat>
			<Beat name="南宋の兵が、南宋の矢を" captions={c} from={13} to={16}>
				<Photo id="mongol-helmet-2" move="in" label="南宋の兵が、南宋の矢を" />
			</Beat>
			<Beat name="江南軍の旅の跡" captions={c} from={17} to={19}>
				<Stage label="江南軍の旅の跡" labelBottom>
					<MapScene cam={{lon: 125.5, lat: 31.5, zoom: 1.0}} routes={[{from: 'keigen', to: 'takashima', at: 10, color: '#ff8f80'}]} pins={[{key: 'keigen', name: '慶元（今の寧波）', at: 5, big: true}, {key: 'takashima', name: '鷹島', at: 70}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="戦うだけの集団？" captions={c} from={23}>
				<Photo id="kushida-1" move="in" label="戦うだけの集団？" />
			</Beat>
		</SceneFrame>
	);
};
