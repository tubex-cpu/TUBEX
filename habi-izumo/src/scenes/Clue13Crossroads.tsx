import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {MagatamaMaking, PotteryShare} from '../components/IzumoArt2';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue13CrossroadsCaptions as c} from '../data/captions';

// 出雲は、閉ざされた国だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue13Crossroads = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue13Crossroads" label="第13の手がかり" title="出雲は、閉ざされた国だった？">
			<Beat name="葬式の土器は、どこの？" captions={c} from={0} to={1}>
				<Stage label="葬式の土器は、どこの？">
					<PotteryShare />
				</Stage>
			</Beat>
			<Beat name="吉備の国" captions={c} from={2} to={2}>
				<Photo id="tatetsuki-finds" move="in" label="吉備の国" />
			</Beat>
			<Beat name="遠くの国々から" captions={c} from={3} to={3}>
				<Photo id="tatetsuki-top" move="in" label="遠くの国々から" />
			</Beat>
			<Beat name="特殊器台" captions={c} from={4} to={5}>
				<Photo id="tokushu-kidai" move="in" label="特殊器台" />
			</Beat>
			<Beat name="海の向こうに目を向けると" captions={c} from={6} to={6}>
				<Photo id="japan-sea" move="in" label="海の向こうに目を向けると" />
			</Beat>
			<Beat name="楽浪郡の焼き物" captions={c} from={7} to={8}>
				<Photo id="lelang-incense" move="in" label="楽浪郡の焼き物" />
			</Beat>
			<Beat name="青銅器の材料は？" captions={c} from={9} to={10}>
				<Photo id="glass-beads" move="in" label="青銅器の材料は？" />
			</Beat>
			<Beat name="海の道の十字路？" captions={c} from={11} to={11}>
				<Stage label="海の道の十字路？" labelBottom>
					<ReliefMap view='nihonkai' focus={P.taisha} zoom={1.12} pins={[{at: P.taisha, name: '出雲', big: true, t: 4}, {at: P.rakuro, name: '楽浪郡', t: 20, dy: 70}, {at: P.kaya, name: '朝鮮半島南部', t: 30, dy: 60}, {at: P.kitakyushu, name: '北九州', t: 40, dy: 60}, {at: P.kibi, name: '吉備', t: 50, dy: 60}, {at: P.hokuriku, name: '北陸', t: 60}]} lines={[{pts: [P.taisha, P.rakuro], t: 20}, {pts: [P.taisha, P.kaya], t: 30}, {pts: [P.taisha, P.kitakyushu], t: 40}, {pts: [P.taisha, P.kibi], t: 50}, {pts: [P.taisha, P.hokuriku], t: 60, bend: -0.12}]} />
				</Stage>
			</Beat>
			<Beat name="もう一つの特産品" captions={c} from={12} to={12}>
				<Photo id="agate-stones" move="in" label="もう一つの特産品" />
			</Beat>
			<Beat name="玉づくり" captions={c} from={13} to={13}>
				<Stage label="玉づくり">
					<MagatamaMaking />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={14} to={16}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 14, 15, fps)} />
			</Beat>
			<Beat name="王たちの力の源は？" captions={c} from={17}>
				<Photo id="tamatsukuri-site" move="in" label="王たちの力の源は？" />
			</Beat>
		</SceneFrame>
	);
};
