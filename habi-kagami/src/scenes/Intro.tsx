import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {CountBars, MirrorAnatomy} from '../components/KagamiArt';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="奈良盆地 黒塚古墳" captions={c} from={0} to={0}>
				<Photo id="open-nara-dawn" move="in" label="奈良盆地 黒塚古墳" />
			</Beat>
			<Beat name="荒らされていない石の部屋" captions={c} from={1} to={1}>
				<Photo id="open-kurozuka-sekishitsu" move="in" label="荒らされていない石の部屋" />
			</Beat>
			<Beat name="棺を囲んだ33枚" captions={c} from={2} to={2}>
				<Photo id="open-mirror-wall" move="in" label="棺を囲んだ33枚" />
			</Beat>
			<Beat name="三角縁神獣鏡" captions={c} from={3} to={3}>
				<Stage label="三角縁神獣鏡">
					<MirrorAnatomy />
				</Stage>
			</Beat>
			<Beat name="卑弥呼の鏡？" captions={c} from={4} to={4}>
				<Photo id="open-sankaku-akamon" move="in" label="卑弥呼の鏡？" />
			</Beat>
			<Beat name="魏志倭人伝" captions={c} from={5} to={5}>
				<Photo id="c01-weizhi" move="scroll" label="魏志倭人伝" />
			</Beat>
			<Beat name="数が合わない" captions={c} from={6} to={7}>
				<Stage label="数が合わない">
					<CountBars bars={[{label: '魏志倭人伝', value: 100, sub: '銅鏡百枚'}, {label: '見つかった枚数', value: 560, accent: true, sub: '500枚以上'}]} />
				</Stage>
			</Beat>
			<Beat name="本場の中国からは？" captions={c} from={8} to={8}>
				<Photo id="c08-luoyang-mirror" move="in" label="本場の中国からは？" />
			</Beat>
			<Beat name="神社の下に眠っていた鏡" captions={c} from={9} to={9}>
				<Photo id="c04-kanbara-haiden" move="in" label="神社の下に眠っていた鏡" />
			</Beat>
			<Beat name="この世に存在しない年号" captions={c} from={10} to={10}>
				<Photo id="matome-large-mirror" move="in" label="この世に存在しない年号" />
			</Beat>
			<Beat name="もし、卑弥呼の鏡でないなら" captions={c} from={11} to={13}>
				<Stage label="もし、卑弥呼の鏡でないなら" labelBottom>
					<ReliefMap view='honshu' zoom={1.08} focus={P.nara} pins={[{at: P.nara, name: '奈良', sub: '鏡が最も多い', big: true, t: 10}, {at: P.hirabaru, name: '九州', t: 40}]} />
				</Stage>
			</Beat>
			<Beat name="本物の百枚はどこに" captions={c} from={14} to={14}>
				<Photo id="open-kurozuka-zenkei" move="in" label="本物の百枚はどこに" />
			</Beat>
			<Beat name="2026年秋 九州国立博物館" captions={c} from={15} to={15}>
				<Photo id="c25-kyuhaku-front" move="in" label="2026年秋 九州国立博物館" />
			</Beat>
			<Beat name="鏡に残った影" captions={c} from={16} to={16}>
				<Photo id="c14-tomio-mirror1" move="in" label="鏡に残った影" />
			</Beat>
			<Beat name="三次元の計測 3Dプリンター" captions={c} from={17} to={18}>
				<Photo id="c11-3d-scanner" move="in" label="三次元の計測 3Dプリンター" />
			</Beat>
			<Beat name="卑弥呼の鏡は、本当にこの鏡なのか" captions={c} from={19}>
				<Photo id="open-sankaku-maebashi-pair" move="in" label="卑弥呼の鏡は、本当にこの鏡なのか" />
			</Beat>
		</SceneFrame>
	);
};
