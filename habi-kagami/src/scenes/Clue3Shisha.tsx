import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3ShishaCaptions as c} from '../data/captions';

// 銅鏡百枚は、卑弥呼の使いが持ち帰った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue3Shisha = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Shisha" label="第3の手がかり" title="銅鏡百枚は、卑弥呼の使いが持ち帰った？">
			<Beat name="詔書の続き" captions={c} from={0} to={1}>
				<Photo id="c03-luoyang-museum" move="in" label="詔書の続き" />
			</Beat>
			<Beat name="海を渡ったのは" captions={c} from={2} to={3}>
				<Stage label="海を渡ったのは" labelBottom>
					<ReliefMap view='eastasia' zoom={1.1} focus={P.taihou} pins={[{at: P.taihou, name: '帯方郡', sub: '梯儁', big: true, t: 6}, {at: P.hirabaru, name: '倭', t: 40}]} lines={[{pts: [P.taihou, P.tsushima, P.hirabaru], t: 20, arrow: true, label: '240年'}]} />
				</Stage>
			</Beat>
			<Beat name="感謝の手紙" captions={c} from={4} to={4}>
				<Photo id="c03-stone-tiger" move="in" label="感謝の手紙" />
			</Beat>
			<Beat name="240年 正始元年" captions={c} from={5} to={6}>
				<Photo id="c03-itoshima-sea" move="in" label="240年 正始元年" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="その年号は鏡に？" captions={c} from={10}>
				<Photo id="c04-kanbara-torii" move="in" label="その年号は鏡に？" />
			</Beat>
		</SceneFrame>
	);
};
