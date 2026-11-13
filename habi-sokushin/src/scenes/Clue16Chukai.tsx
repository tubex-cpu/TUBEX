import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue16ChukaiCaptions as c} from '../data/captions';

// 忠海上人は、掘り出したとき乾いていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue16Chukai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue16Chukai" label="第16の手がかり" title="忠海上人は、掘り出したとき乾いていた？">
			<Beat name="酒田市 海向寺" captions={c} from={0} to={1}>
				<Photo id="haguro-ideha-shrine" move="in" label="酒田市 海向寺" />
			</Beat>
			<Beat name="ヨモギでいぶした" captions={c} from={2} to={3}>
				<Photo id="yomogi-cc0" move="in" label="ヨモギでいぶした" />
			</Beat>
			<Beat name="日本ミイラ研究グループの報告" captions={c} from={4} to={4}>
				<Stage label="日本ミイラ研究グループの報告">
					<Cards cards={[{head: '燻製', body: '乾燥が足りず\nいぶしたと伝わる'}, {head: '縛った跡', body: '胸と腹に\nひもの跡', tone: 'red'}]} tone='ink' size={48} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="乾燥の処置" captions={c} from={5} to={5}>
				<Photo id="buson-hosomichi-fan" move="in" label="乾燥の処置" />
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="もう1体の即身仏" captions={c} from={9}>
				<Photo id="persimmon-tree" move="in" label="もう1体の即身仏" />
			</Beat>
		</SceneFrame>
	);
};
