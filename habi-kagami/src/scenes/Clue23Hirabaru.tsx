import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Balance} from '../components/KagamiArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue23HirabaruCaptions as c} from '../data/captions';

// 日本最大の古代の鏡は、九州から出ている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue23Hirabaru = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue23Hirabaru" label="第23の手がかり" title="日本最大の古代の鏡は、九州から出ている？">
			<Beat name="弥生時代の終わりの墓" captions={c} from={0} to={0}>
				<Stage label="弥生時代の終わりの墓" labelBottom>
					<ReliefMap view='kyushu' zoom={1.12} focus={P.hirabaru} pins={[{at: P.hirabaru, name: '平原遺跡', sub: '糸島市', big: true, t: 6}, {at: P.yoshinogari, name: '吉野ヶ里遺跡', t: 30}]} />
				</Stage>
			</Beat>
			<Beat name="割れた鏡40枚分" captions={c} from={1} to={1}>
				<Photo id="c23-hirabaru-tomb" move="in" label="割れた鏡40枚分" />
			</Beat>
			<Beat name="直径46.5センチ" captions={c} from={2} to={3}>
				<Photo id="c23-hirabaru-mirror" move="in" label="直径46.5センチ" />
			</Beat>
			<Beat name="八咫鏡と同じ？" captions={c} from={4} to={4}>
				<Photo id="c23-hirabaru-drawing" move="in" label="八咫鏡と同じ？" />
			</Beat>
			<Beat name="伊都国" captions={c} from={5} to={6}>
				<Photo id="c23-itoshima-view" move="in" label="伊都国" />
			</Beat>
			<Beat name="鏡の古い中心" captions={c} from={7} to={7}>
				<Photo id="c23-itokoku-museum" move="in" label="鏡の古い中心" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="九州に引き戻す" captions={c} from={11} to={11}>
				<Stage label="九州に引き戻す">
					<Balance from={-0.9} to={-0.55} left={[{text: '三角縁神獣鏡の中心', shaky: true}, {text: '鏡を配った王権', shaky: true}, {text: '箸墓古墳の年代'}, {text: '纒向の大集落'}]} right={[{text: '弥生の鏡の中心', fresh: true}, {text: '国宝の巨大な鏡', fresh: true}]} />
				</Stage>
			</Beat>
			<Beat name="王の墓は？" captions={c} from={12}>
				<Photo id="c23-hirabaru-tomb2" move="in" label="王の墓は？" />
			</Beat>
		</SceneFrame>
	);
};
