import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {HeightTeaser, MarkMatch, SwordReveal} from '../components/IzumoArt1';
import {P, ReliefMap} from '../components/IzumoMap';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="1984年、夏" captions={c} from={0} to={0}>
				<Photo id="unnan-valley" move="in" label="1984年、夏" />
			</Beat>
			<Beat name="土の中から、次々と" captions={c} from={1} to={1}>
				<Stage label="土の中から、次々と">
					<SwordReveal />
				</Stage>
			</Beat>
			<Beat name="日本中の数を、ひとつの谷が？" captions={c} from={2} to={3}>
				<Photo id="kojindani-swords-wall" move="right" label="日本中の数を、ひとつの谷が？" />
			</Beat>
			<Beat name="そのほとんどに、同じ印" captions={c} from={4} to={5}>
				<Photo id="kojindani-swords-case" move="in" label="そのほとんどに、同じ印" />
			</Beat>
			<Beat name="山を越えた、もう一つの谷" captions={c} from={6} to={6}>
				<Stage label="山を越えた、もう一つの谷" labelBottom>
					<ReliefMap view='izumo' focus={P.kamo} zoom={1.9} pins={[{at: P.kojindani, name: '荒神谷', t: 10}, {at: P.kamo, name: '加茂岩倉', t: 40, big: true, dy: 70}]} />
				</Stage>
			</Beat>
			<Beat name="39個の銅鐸" captions={c} from={7} to={7}>
				<Photo id="kamo-dotaku-display-2" move="in" label="39個の銅鐸" />
			</Beat>
			<Beat name="神話のふるさと" captions={c} from={8} to={8}>
				<Photo id="izumo-plain-satellite" move="in" label="神話のふるさと" />
			</Beat>
			<Beat name="国を引き寄せた神" captions={c} from={9} to={9}>
				<Photo id="shimane-iss" move="in" label="国を引き寄せた神" />
			</Beat>
			<Beat name="大蛇を退治した神" captions={c} from={10} to={10}>
				<Photo id="orochi-chikanobu-tri" move="left" label="大蛇を退治した神" />
			</Beat>
			<Beat name="ただのお話だった？" captions={c} from={11} to={12}>
				<Photo id="inasa-lowtide" move="out" label="ただのお話だった？" />
			</Beat>
			<Beat name="2000年、境内から" captions={c} from={13} to={14}>
				<Photo id="shin-no-mihashira" move="in" label="2000年、境内から" />
			</Beat>
			<Beat name="高さ48メートルの神殿？" captions={c} from={15} to={15}>
				<Stage label="高さ48メートルの神殿？">
					<HeightTeaser />
				</Stage>
			</Beat>
			<Beat name="2026年秋、ある発表" captions={c} from={16} to={18}>
				<Stage label="2026年秋、ある発表">
					<MarkMatch />
				</Stage>
			</Beat>
			<Beat name="日本中の神々が、出雲に？" captions={c} from={19} to={20}>
				<Stage label="日本中の神々が、出雲に？" labelBottom>
					<ReliefMap view='nihonkai' focus={P.taisha} zoom={1.35} gather={{to: P.taisha, n: 90, t: 10, spread: 1100}} pins={[{at: P.taisha, name: '出雲', big: true, t: 120}]} />
				</Stage>
			</Beat>
			<Beat name="神無月と、神在月" captions={c} from={21} to={21}>
				<Photo id="kannazuki-kunisada" move="in" label="神無月と、神在月" />
			</Beat>
			<Beat name="11月18日の夜" captions={c} from={22} to={22}>
				<Photo id="inasa-sunset-1" move="in" label="11月18日の夜" />
			</Beat>
			<Beat name="神々は、なぜ出雲に？" captions={c} from={23} to={25}>
				<Photo id="taisha-pano-w" move="scroll" label="神々は、なぜ出雲に？" />
			</Beat>
			<Beat name="最新の研究が導いたのは？" captions={c} from={26} to={28}>
				<Photo id="kamo-buried-1" move="in" label="最新の研究が導いたのは？" />
			</Beat>
		</SceneFrame>
	);
};
