import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {HeightTeaser, MarkMatch, SwordReveal} from '../components/IzumoArt1';
import {TimeBar} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="2026年11月18日、水曜日" captions={c} from={0} to={0}>
				<Photo id="inasa-sunset-1" move="in" label="2026年11月18日、水曜日" />
			</Beat>
			<Beat name="海の向こうから、神々が" captions={c} from={1} to={2}>
				<Stage label="海の向こうから、神々が" labelBottom>
					<ReliefMap view='nihonkai' focus={P.taisha} zoom={1.35} gather={{to: P.taisha, n: 90, t: 10, spread: 1100}} pins={[{at: P.taisha, name: '出雲', big: true, t: 120}]} />
				</Stage>
			</Beat>
			<Beat name="神無月と、神在月" captions={c} from={3} to={4}>
				<Photo id="kannazuki-kunisada" move="in" label="神無月と、神在月" />
			</Beat>
			<Beat name="神々は、なぜ出雲に？" captions={c} from={5} to={7}>
				<Photo id="taisha-pano-w" move="scroll" label="神々は、なぜ出雲に？" />
			</Beat>
			<Beat name="1984年、夏" captions={c} from={8} to={8}>
				<Photo id="unnan-valley" move="in" label="1984年、夏" />
			</Beat>
			<Beat name="土の中から、次々と" captions={c} from={9} to={9}>
				<Stage label="土の中から、次々と">
					<SwordReveal />
				</Stage>
			</Beat>
			<Beat name="日本中の数を、ひとつの谷が？" captions={c} from={10} to={11}>
				<Photo id="kojindani-swords-wall" move="right" label="日本中の数を、ひとつの谷が？" />
			</Beat>
			<Beat name="そのほとんどに、同じ印" captions={c} from={12} to={13}>
				<Photo id="kojindani-swords-case" move="in" label="そのほとんどに、同じ印" />
			</Beat>
			<Beat name="山を越えた、もう一つの谷" captions={c} from={14} to={14}>
				<Stage label="山を越えた、もう一つの谷" labelBottom>
					<ReliefMap view='izumo' focus={P.kamo} zoom={1.9} pins={[{at: P.kojindani, name: '荒神谷', t: 10}, {at: P.kamo, name: '加茂岩倉', t: 40, big: true, dy: 70}]} />
				</Stage>
			</Beat>
			<Beat name="39個の銅鐸" captions={c} from={15} to={15}>
				<Photo id="kamo-dotaku-display-2" move="in" label="39個の銅鐸" />
			</Beat>
			<Beat name="神話のふるさと" captions={c} from={16} to={16}>
				<Photo id="izumo-plain-satellite" move="in" label="神話のふるさと" />
			</Beat>
			<Beat name="国を引き寄せた神" captions={c} from={17} to={17}>
				<Photo id="shimane-iss" move="in" label="国を引き寄せた神" />
			</Beat>
			<Beat name="大蛇を退治した神" captions={c} from={18} to={18}>
				<Photo id="orochi-chikanobu-tri" move="left" label="大蛇を退治した神" />
			</Beat>
			<Beat name="ただのお話だった？" captions={c} from={19} to={20}>
				<Photo id="inasa-lowtide" move="out" label="ただのお話だった？" />
			</Beat>
			<Beat name="2000年、境内から" captions={c} from={21} to={22}>
				<Photo id="shin-no-mihashira" move="in" label="2000年、境内から" />
			</Beat>
			<Beat name="高さ48メートルの神殿？" captions={c} from={23} to={23}>
				<Stage label="高さ48メートルの神殿？">
					<HeightTeaser />
				</Stage>
			</Beat>
			<Beat name="2026年秋、ある発表" captions={c} from={24} to={26}>
				<Stage label="2026年秋、ある発表">
					<MarkMatch />
				</Stage>
			</Beat>
			<Beat name="消えた王国の記憶？" captions={c} from={27} to={28}>
				<Photo id="kamo-buried-1" move="in" label="消えた王国の記憶？" />
			</Beat>
			<Beat name="最新の研究が導いたのは？" captions={c} from={29} to={31}>
				<Stage label="最新の研究が導いたのは？">
					<TimeBar stops={[{label: '1984年', sub: '銅剣358本'}, {label: '1996年', sub: '銅鐸39個'}, {label: '2000年', sub: '巨大な柱'}, {label: '2026年', sub: '同じ印', accent: true}]} tone='shrine' />
				</Stage>
			</Beat>
		</SceneFrame>
	);
};
