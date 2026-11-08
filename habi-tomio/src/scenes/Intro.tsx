import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {SwordScale} from '../components/TomioArt';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="住宅街の丘の上" captions={c} from={0} to={0}>
				<Photo id="tomio-michinoeki" move="in" label="住宅街の丘の上" />
			</Beat>
			<Beat name="2023年1月" captions={c} from={1} to={1}>
				<Photo id="tomio-survey-u" move="in" label="2023年1月" />
			</Beat>
			<Beat name="人の背丈を超える剣？" captions={c} from={2} to={4}>
				<Stage label="人の背丈を超える剣？">
					<SwordScale />
				</Stage>
			</Beat>
			<Beat name="盾の形の、銅の鏡" captions={c} from={5} to={5}>
				<Photo id="daryu-yukino" move="in" label="盾の形の、銅の鏡" />
			</Beat>
			<Beat name="誰が、何のために？" captions={c} from={6} to={6}>
				<Photo id="konda-aerial" move="in" label="誰が、何のために？" />
			</Beat>
			<Beat name="棺の中には、なかった？" captions={c} from={7} to={8}>
				<Photo id="mokkan-shimoike" move="in" label="棺の中には、なかった？" />
			</Beat>
			<Beat name="この墓の主は？" captions={c} from={9} to={9}>
				<Photo id="tomio-zenkei" move="out" label="この墓の主は？" />
			</Beat>
			<Beat name="2026年1月、別の鏡にも" captions={c} from={10} to={10}>
				<Photo id="tomio-sankaku-1" move="in" label="2026年1月、別の鏡にも" />
			</Beat>
			<Beat name="奈良盆地の北" captions={c} from={11} to={11}>
				<Stage label="奈良盆地の北" labelBottom>
					<ReliefMap view='nara' focus={P.tomio} zoom={1.5} pins={[{at: P.tomio, name: '富雄丸山古墳', big: true, t: 10}, {at: P.heijo, name: '平城宮跡', t: 30}]} />
				</Stage>
			</Beat>
			<Beat name="最新の調査が導いたのは？" captions={c} from={12} to={13}>
				<Photo id="tomio-ortho-w" move="scroll" label="最新の調査が導いたのは？" />
			</Beat>
		</SceneFrame>
	);
};
