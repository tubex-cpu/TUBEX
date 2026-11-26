import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8ChinaCaptions as c} from '../data/captions';

// 三角縁神獣鏡は、中国で1枚も見つかっていない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue8China = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8China" label="第8の手がかり" title="三角縁神獣鏡は、中国で1枚も見つかっていない？">
			<Beat name="魏の鏡なら" captions={c} from={0} to={1}>
				<Stage label="魏の鏡なら" labelBottom>
					<ReliefMap view='eastasia' zoom={1.05} pins={[{at: P.rakuyo, name: '中国', sub: '確かな出土 0枚', big: true, t: 8, color: '#ff8f80'}, {at: P.taihou, name: '朝鮮半島', sub: '0枚', t: 30}, {at: P.nara, name: '日本', sub: '500枚以上', t: 52}]} />
				</Stage>
			</Beat>
			<Beat name="洛陽で見つかった？" captions={c} from={2} to={3}>
				<Photo id="c08-han-mirror-tnm" move="in" label="洛陽で見つかった？" />
			</Beat>
			<Beat name="倭のためだけの鏡？" captions={c} from={4} to={4}>
				<Photo id="c08-mount-mang" move="in" label="倭のためだけの鏡？" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="鏡は何と名乗る？" captions={c} from={8}>
				<Photo id="c09-tsubai-15-xuzhou" move="in" label="鏡は何と名乗る？" />
			</Beat>
		</SceneFrame>
	);
};
