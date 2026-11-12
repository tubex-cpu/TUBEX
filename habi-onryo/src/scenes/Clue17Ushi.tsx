import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue17UshiCaptions as c} from '../data/captions';

// 道真の亡きがらを運ぶ牛が動かなくなった場所に、太宰府天満宮は建てられた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue17Ushi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue17Ushi" label="第17の手がかり" title="道真の亡きがらを運ぶ牛が動かなくなった場所に、太宰府天満宮は建てられた？">
			<Beat name="903年2月25日" captions={c} from={0} to={1}>
				<Photo id="enokisha-torii" move="in" label="903年2月25日" />
			</Beat>
			<Beat name="牛車で運ばれた亡きがら" captions={c} from={2} to={3}>
				<Photo id="engi-oxcart" move="in" label="牛車で運ばれた亡きがら" />
			</Beat>
			<Beat name="弟子 味酒安行" captions={c} from={4} to={4}>
				<Photo id="dazaifu-shinjiike" move="in" label="弟子 味酒安行" />
			</Beat>
			<Beat name="天満宮の始まり" captions={c} from={5} to={6}>
				<Stage label="天満宮の始まり">
					<TimeBar stops={[{label: '903年', sub: '道真が亡くなる'}, {label: '905年', sub: '墓の上に御堂'}, {label: '919年', sub: '社殿を造る', accent: true}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="境内の牛の像" captions={c} from={7} to={8}>
				<Photo id="dazaifu-ox" move="in" label="境内の牛の像" />
			</Beat>
			<Beat name="当時の記録は？" captions={c} from={9} to={9}>
				<Photo id="dazaifu-taikobashi" move="in" label="当時の記録は？" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="本殿の前の梅" captions={c} from={13}>
				<Photo id="dazaifu-tobiume" move="in" label="本殿の前の梅" />
			</Beat>
		</SceneFrame>
	);
};
