import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue10HonmyokaiCaptions as c} from '../data/captions';

// 本明海上人は、藩主の身代わりになった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue10Honmyokai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Honmyokai" label="第10の手がかり" title="本明海上人は、藩主の身代わりになった？">
			<Beat name="鶴岡市東岩本" captions={c} from={0} to={0}>
				<Stage label="鶴岡市東岩本" labelBottom>
					<ReliefMap view='shonai' zoom={1.1} pins={[{at: P.honmyoji, name: '本明寺', sub: '本明海上人', big: true, t: 6}, {at: P.yudono, name: '湯殿山', t: 50}]} />
				</Stage>
			</Beat>
			<Beat name="庄内藩の武士" captions={c} from={1} to={1}>
				<Photo id="tsurugaoka-moat" move="in" label="庄内藩の武士" />
			</Beat>
			<Beat name="1661年 藩主・酒井忠当の病" captions={c} from={2} to={3}>
				<Stage label="1661年 藩主・酒井忠当の病">
					<Cards cards={[{head: 'よく言われる話', body: '藩主の\n身代わり'}, {head: '日本人名大辞典', body: '病気平癒を\n祈る使い', tone: 'gold'}]} tone='ink' size={48} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="数千日の修行" captions={c} from={4} to={4}>
				<Photo id="gassan-hiking" move="in" label="数千日の修行" />
			</Beat>
			<Beat name="熟していない松ぼっくり" captions={c} from={5} to={5}>
				<Photo id="pine-cone" move="in" label="熟していない松ぼっくり" />
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="飢饉の年の即身仏" captions={c} from={9}>
				<Photo id="asama-yorubun" move="in" label="飢饉の年の即身仏" />
			</Beat>
		</SceneFrame>
	);
};
