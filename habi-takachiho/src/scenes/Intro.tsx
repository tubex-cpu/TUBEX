import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="2026年11月22日・23日" captions={c} from={0} to={0}>
				<Photo id="yk-kaguraden-night" move="in" label="2026年11月22日・23日" />
			</Beat>
			<Beat name="年に一度だけ" captions={c} from={1} to={1}>
				<Photo id="tj-honden" move="in" label="年に一度だけ" />
			</Beat>
			<Beat name="天岩戸の物語" captions={c} from={2} to={2}>
				<Photo id="art-kunisada-w" move="scroll" label="天岩戸の物語" />
			</Beat>
			<Beat name="岩戸そのものが御神体" captions={c} from={3} to={3}>
				<Photo id="gorge-light" move="in" label="岩戸そのものが御神体" />
			</Beat>
			<Beat name="記紀には、高千穂の名が？" captions={c} from={4} to={4}>
				<Photo id="kojiki-shinpukuji" move="in" label="記紀には、高千穂の名が？" />
			</Beat>
			<Beat name="天岩戸は、いくつもある" captions={c} from={5} to={5}>
				<Stage label="天岩戸は、いくつもある" labelBottom>
					<ReliefMap view='nihon' focus={P.erihara} zoom={1.02} pins={[{at: P.takachihoTown, name: '高千穂', big: true, t: 10}, {at: P.erihara, name: '恵利原の水穴', sub: '三重・志摩', t: 30}, {at: P.togakushi, name: '戸隠神社', sub: '長野', t: 50}]} />
				</Stage>
			</Beat>
			<Beat name="なぜ高千穂が？" captions={c} from={6} to={6}>
				<Photo id="gorge-manai" move="in" label="なぜ高千穂が？" />
			</Beat>
			<Beat name="太陽が隠れた神話の正体は？" captions={c} from={7} to={7}>
				<Photo id="ecl-annular" move="in" label="太陽が隠れた神話の正体は？" />
			</Beat>
			<Beat name="1700年前の空を計算する" captions={c} from={8} to={8}>
				<Photo id="kiri-pan-w" move="scroll" label="1700年前の空を計算する" />
			</Beat>
			<Beat name="卑弥呼の時代の空に" captions={c} from={9}>
				<Photo id="miya-cape" move="out" label="卑弥呼の時代の空に" />
			</Beat>
		</SceneFrame>
	);
};
