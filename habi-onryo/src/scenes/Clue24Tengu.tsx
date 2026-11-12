import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Flow} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue24TenguCaptions as c} from '../data/captions';

// 崇徳上皇は、死後、天狗になった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue24Tengu = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue24Tengu" label="第24の手がかり" title="崇徳上皇は、死後、天狗になった？">
			<Beat name="天狗の王になった？" captions={c} from={0} to={1}>
				<Photo id="matsuyama-tengu" move="in" label="天狗の王になった？" />
			</Beat>
			<Beat name="江戸時代の物語" captions={c} from={2} to={5}>
				<Stage label="江戸時代の物語">
					<Flow steps={[{head: '西行', body: '白峯の墓を\n訪ねる'}, {head: '上皇の霊', body: '夜に現れる'}, {head: '天狗の相模', body: '平家の滅びを\n語る', hot: true}, {head: '西行の歌', body: '霊がしずまる'}]} note='1776年『雨月物語』「白峯」' />
				</Stage>
			</Beat>
			<Beat name="歌集に残る話との違い" captions={c} from={6} to={6}>
				<Photo id="tonshoji-hall" move="in" label="歌集に残る話との違い" />
			</Beat>
			<Beat name="国芳が描いた天狗たち" captions={c} from={7} to={8}>
				<Photo id="sanukiin-tengu" move="in" label="国芳が描いた天狗たち" />
			</Beat>
			<Beat name="研究者の見方" captions={c} from={9} to={9}>
				<Photo id="yasui-ema" move="in" label="研究者の見方" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="亡くなってすぐに？" captions={c} from={13}>
				<Photo id="yasui-shaden-2" move="in" label="亡くなってすぐに？" />
			</Beat>
		</SceneFrame>
	);
};
