import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Balance} from '../components/KagamiArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue24YoshinogariCaptions as c} from '../data/captions';

// 吉野ヶ里で、卑弥呼の時代の王の墓が見つかった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue24Yoshinogari = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue24Yoshinogari" label="第24の手がかり" title="吉野ヶ里で、卑弥呼の時代の王の墓が見つかった？">
			<Beat name="吉野ヶ里遺跡" captions={c} from={0} to={0}>
				<Photo id="c24-yoshinogari-tower" move="in" label="吉野ヶ里遺跡" />
			</Beat>
			<Beat name="謎のエリア" captions={c} from={1} to={1}>
				<Photo id="c24-yoshinogari-kitanaikaku" move="in" label="謎のエリア" />
			</Beat>
			<Beat name="2023年 石の棺" captions={c} from={2} to={3}>
				<Photo id="unsolved-yoshinogari-tomb" move="in" label="2023年 石の棺" />
			</Beat>
			<Beat name="王の持ち物は？" captions={c} from={4} to={4}>
				<Photo id="c24-yoshinogari-tumulus-in" move="in" label="王の持ち物は？" />
			</Beat>
			<Beat name="2026年 連なる墓" captions={c} from={5} to={5}>
				<Photo id="c24-yoshinogari-jars" move="in" label="2026年 連なる墓" />
			</Beat>
			<Beat name="有力者たちの墓？" captions={c} from={6} to={6}>
				<Photo id="c24-yoshinogari-tumulus" move="in" label="有力者たちの墓？" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="また九州へ" captions={c} from={10} to={10}>
				<Stage label="また九州へ">
					<Balance from={-0.55} to={-0.4} left={[{text: '三角縁神獣鏡の中心', shaky: true}, {text: '鏡を配った王権', shaky: true}, {text: '箸墓古墳の年代'}, {text: '纒向の大集落'}]} right={[{text: '弥生の鏡の中心'}, {text: '国宝の巨大な鏡'}, {text: '吉野ヶ里の墓', fresh: true}]} />
				</Stage>
			</Beat>
			<Beat name="特別展で解けた？" captions={c} from={11}>
				<Photo id="c24-yoshinogari-kango" move="in" label="特別展で解けた？" />
			</Beat>
		</SceneFrame>
	);
};
