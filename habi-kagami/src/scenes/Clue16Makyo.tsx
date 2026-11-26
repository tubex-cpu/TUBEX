import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue16MakyoCaptions as c} from '../data/captions';

// 卑弥呼の鏡は、光を当てると絵が浮かぶ魔鏡だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue16Makyo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue16Makyo" label="第16の手がかり" title="卑弥呼の鏡は、光を当てると絵が浮かぶ魔鏡だった？">
			<Beat name="魔鏡" captions={c} from={0} to={0}>
				<Photo id="c16-makyo-front" move="in" label="魔鏡" />
			</Beat>
			<Beat name="金属の3Dプリンター" captions={c} from={1} to={1}>
				<Photo id="c16-metal-3dprinter" move="in" label="金属の3Dプリンター" />
			</Beat>
			<Beat name="光の中に浮かぶ文様" captions={c} from={2} to={3}>
				<Photo id="c16-makyo-amida" move="in" label="光の中に浮かぶ文様" />
			</Beat>
			<Beat name="確かめたのは複製" captions={c} from={4} to={5}>
				<Photo id="c16-makyo-back" move="in" label="確かめたのは複製" />
			</Beat>
			<Beat name="鬼道に仕えた女王" captions={c} from={6} to={6}>
				<Photo id="c17-iwato-hokkei" move="in" label="鬼道に仕えた女王" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="日本人にとって鏡とは" captions={c} from={10}>
				<Photo id="c17-shinkyo" move="in" label="日本人にとって鏡とは" />
			</Beat>
		</SceneFrame>
	);
};
