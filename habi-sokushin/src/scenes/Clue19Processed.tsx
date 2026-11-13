import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue19ProcessedCaptions as c} from '../data/captions';

// 即身仏の多くは、亡くなったあとに整えられた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue19Processed = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue19Processed" label="第19の手がかり" title="即身仏の多くは、亡くなったあとに整えられた？">
			<Beat name="ここまでの手がかり" captions={c} from={0} to={2}>
				<Stage label="ここまでの手がかり">
					<Cards cards={[{head: '鉄竜海', body: '内臓・石灰'}, {head: '忠海', body: '燻製・縛った跡'}, {head: '円明海', body: '柿渋'}, {head: '多くの即身仏', body: '乾燥の処置', tone: 'red'}]} tone='ink' size={40} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="昭和の修復" captions={c} from={3} to={5}>
				<Stage label="昭和の修復">
					<Scroll text={'作られた時点の\n状態を判断するのは\n難しい'} source='坂上和弘（国立科学博物館）2022年の論文（要約）' />
				</Stage>
			</Beat>
			<Beat name="数百年の信仰と、昭和の修復" captions={c} from={6} to={6}>
				<Photo id="manto-hasedera" move="in" label="数百年の信仰と、昭和の修復" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="最も古い即身仏" captions={c} from={10}>
				<Photo id="kouchi-brooklyn" move="in" label="最も古い即身仏" />
			</Beat>
		</SceneFrame>
	);
};
