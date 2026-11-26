import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Balance} from '../components/KagamiArt';
import {Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue19HaifuCaptions as c} from '../data/captions';

// 奈良の王が、鏡を全国に配った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue19Haifu = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue19Haifu" label="第19の手がかり" title="奈良の王が、鏡を全国に配った？">
			<Beat name="1953年 椿井大塚山古墳" captions={c} from={0} to={1}>
				<Photo id="c19-tsubai-kouenbu" move="in" label="1953年 椿井大塚山古墳" />
			</Beat>
			<Beat name="考古学者 小林行雄" captions={c} from={2} to={3}>
				<Photo id="c19-tsubai-01" move="in" label="考古学者 小林行雄" />
			</Beat>
			<Beat name="1955年の考え" captions={c} from={4} to={4}>
				<Stage label="1955年の考え">
					<Flow steps={[{head: '近畿の王', body: '鏡を配る', hot: true}, {head: '各地の有力者', body: '鏡を受け取る'}, {head: '大和の王権', body: 'が生まれる'}]} />
				</Stage>
			</Beat>
			<Beat name="邪馬台国も近畿に？" captions={c} from={5} to={6}>
				<Photo id="c19-tsubai-04" move="in" label="邪馬台国も近畿に？" />
			</Beat>
			<Beat name="その後の研究" captions={c} from={7} to={8}>
				<Photo id="c19-tsubai-10" move="in" label="その後の研究" />
			</Beat>
			<Beat name="三角縁神獣鏡が王権をつくった？" captions={c} from={9} to={11}>
				<Photo id="c19-tsubai-view" move="in" label="三角縁神獣鏡が王権をつくった？" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="天秤は" captions={c} from={15} to={15}>
				<Stage label="天秤は">
					<Balance from={-0.35} to={-0.6} left={[{text: '三角縁神獣鏡の中心', shaky: true}, {text: '鏡を配った王権', shaky: true, fresh: true}]} right={[]} note='一つ目の問いの答えしだいで消える重り' />
				</Stage>
			</Beat>
			<Beat name="卑弥呼の墓からは？" captions={c} from={16}>
				<Photo id="c20-hashihaka-zenkei" move="in" label="卑弥呼の墓からは？" />
			</Beat>
		</SceneFrame>
	);
};
