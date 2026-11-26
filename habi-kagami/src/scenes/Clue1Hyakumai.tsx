import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1HyakumaiCaptions as c} from '../data/captions';

// 卑弥呼は、魏の皇帝から銅鏡百枚をもらった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue1Hyakumai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Hyakumai" label="第1の手がかり" title="卑弥呼は、魏の皇帝から銅鏡百枚をもらった？">
			<Beat name="魏の都 洛陽" captions={c} from={0} to={0}>
				<Photo id="c01-luoyang-palace" move="in" label="魏の都 洛陽" />
			</Beat>
			<Beat name="卑弥呼の使い" captions={c} from={1} to={2}>
				<Stage label="卑弥呼の使い" labelBottom>
					<ReliefMap view='eastasia' zoom={1.06} pins={[{at: P.rakuyo, name: '洛陽', sub: '魏の都', big: true, t: 6}, {at: P.taihou, name: '帯方郡', t: 30}, {at: P.hirabaru, name: '倭', t: 54}]} lines={[{pts: [P.hirabaru, P.taihou, P.rakuyo], t: 20, arrow: true}]} />
				</Stage>
			</Beat>
			<Beat name="贈り物の中に" captions={c} from={3} to={4}>
				<Stage label="贈り物の中に">
					<Scroll text={'銅鏡百枚'} source='魏志倭人伝 皇帝の詔書' />
				</Stage>
			</Beat>
			<Beat name="国中の人に見せよ" captions={c} from={5} to={6}>
				<Stage label="国中の人に見せよ">
					<Cards cards={[{head: 'お返しの品', body: '錦・毛織物\n絹'}, {head: '特に与える品', body: '刀・銅鏡百枚\n真珠・鉛丹', tone: 'red'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="破格のもてなし" captions={c} from={7} to={7}>
				<Photo id="c01-luoyang-lingtai" move="in" label="破格のもてなし" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="鏡はいつ届いた？" captions={c} from={11}>
				<Photo id="c01-han-mirrors" move="in" label="鏡はいつ届いた？" />
			</Beat>
		</SceneFrame>
	);
};
