import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="南米ペルー、雲の上の都市" captions={c} from={0} to={0}>
				<Stage label="南米ペルー、雲の上の都市" labelBottom>
					<ReliefMap view='sudamerica' focus={P.machu} zoom={1.6} pins={[{at: P.machu, name: 'マチュピチュ', sub: '標高 約2430m', big: true, t: 15}, {at: P.lima, name: 'リマ', t: 35}]} />
				</Stage>
			</Beat>
			<Beat name="私たちが教わってきたこと" captions={c} from={1} to={1}>
				<Photo id="mp-sunrise-allard" move="in" label="私たちが教わってきたこと" />
			</Beat>
			<Beat name="密林の奥の「発見」？" captions={c} from={2} to={2}>
				<Photo id="old-sameplace" move="in" label="密林の奥の「発見」？" />
			</Beat>
			<Beat name="最後の要塞？" captions={c} from={3} to={3}>
				<Photo id="wayna-tallest" move="in" label="最後の要塞？" />
			</Beat>
			<Beat name="太陽に仕える女性たち？" captions={c} from={4} to={4}>
				<Photo id="mp-houses-dd47" move="in" label="太陽に仕える女性たち？" />
			</Beat>
			<Beat name="常識がくつがえる" captions={c} from={5} to={5}>
				<Photo id="mp-wayna-pan-w" move="scroll" label="常識がくつがえる" />
			</Beat>
			<Beat name="探検家より9年前" captions={c} from={6} to={6}>
				<Stage label="探検家より9年前">
					<Figures figs={[{value: '1902', label: '年', small: '壁に残された農民の名前', accent: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="本当の名前は？" captions={c} from={7} to={7}>
				<Photo id="cloudforest-1" move="in" label="本当の名前は？" />
			</Beat>
			<Beat name="住人の正体は？" captions={c} from={8} to={8}>
				<Photo id="mp-clouds-unsplash" move="in" label="住人の正体は？" />
			</Beat>
			<Beat name="最新の科学が書きかえる" captions={c} from={9} to={9}>
				<Stage label="最新の科学が書きかえる">
					<Cards cards={[{head: '骨から', body: '放射性炭素\nの年代測定', tone: 'dark'}, {head: '遺伝子から', body: '古代の\nDNAの解析', tone: 'dark'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="2026年、日本のレーザー" captions={c} from={10} to={10}>
				<Photo id="adatara-1" move="in" label="2026年、日本のレーザー" />
			</Beat>
			<Beat name="どこまで本当？" captions={c} from={11}>
				<Stage label="どこまで本当？">
					<Cards cards={[{head: '発見者', body: 'ビンガム？'}, {head: '名前', body: 'マチュピチュ？'}, {head: '住人', body: '地元の人々？'}]} tone='night' size={50} height={280} top={400} />
				</Stage>
			</Beat>
		</SceneFrame>
	);
};
