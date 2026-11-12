import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {Scroll} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue11KentoshiCaptions as c} from '../data/captions';

// 菅原道真は、遣唐使を廃止した？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue11Kentoshi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue11Kentoshi" label="第11の手がかり" title="菅原道真は、遣唐使を廃止した？">
			<Beat name="菅原道真" captions={c} from={0} to={1}>
				<Photo id="tenjin-egara" move="in" label="菅原道真" />
			</Beat>
			<Beat name="894年 遣唐使の廃止？" captions={c} from={2} to={3}>
				<Photo id="nenchu-gyoji-1" move="in" label="894年 遣唐使の廃止？" />
			</Beat>
			<Beat name="道真が書き残した文章" captions={c} from={4} to={5}>
				<Stage label="道真が書き残した文章">
					<Scroll text={'唐の国は乱れ\n海の道は危うい\n派遣するかどうか\n公卿で議論されたい'} source='道真の文章（『菅家文草』）の要約' />
				</Stage>
			</Beat>
			<Beat name="決めた記録は？" captions={c} from={6} to={7}>
				<Stage label="決めた記録は？">
					<TimeBar stops={[{label: '838年', sub: '最後に海を渡った遣唐使'}, {label: '894年', sub: '再検討を求める', accent: true}, {label: '907年', sub: '唐が滅びる'}]} tone='sea' />
				</Stage>
			</Beat>
			<Beat name="899年 右大臣" captions={c} from={8} to={9}>
				<Photo id="nenchu-gyoji-2" move="in" label="899年 右大臣" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="道真に何が起きたのか" captions={c} from={13}>
				<Photo id="michizane-kuniyoshi-farewell" move="in" label="道真に何が起きたのか" />
			</Beat>
		</SceneFrame>
	);
};
