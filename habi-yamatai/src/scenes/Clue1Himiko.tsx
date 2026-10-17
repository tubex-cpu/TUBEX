import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {EnvoyVoyage, GiftCompare, KunaWar, NoAnimals, NoRecordsJapan, QueenChosen, RecordChecklist, ScrollCounter, StormMan, ThousandAttendants, ThreeKingdoms} from '../components/YamataiArt1';
import {clue1HimikoCaptions as c} from '../data/captions';

// 第1の手がかり 卑弥呼は実在したか（素材はすべてこの場面だけで使う）
export const Clue1Himiko = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Himiko" label="第1の手がかり" title="卑弥呼は、本当にいたのか？">
			<Beat name="三国時代" captions={c} from={0} to={0}>
				<Visual label="1800年前、中国は3つの国に分かれていた">
					<ThreeKingdoms />
				</Visual>
			</Beat>
			<Beat name="三国志" captions={c} from={1} to={1}>
				<Photo id="weizhi" label="『三国志』の中に、日本のことが？" />
			</Beat>
			<Beat name="2000字" captions={c} from={2} to={3}>
				<Visual label="わずか2000字の記録に、何が？">
					<ScrollCounter />
				</Visual>
			</Beat>
			<Beat name="当時の日本" captions={c} from={4} to={5}>
				<Photo id="toro1" move="left" label="1800年前の日本は、どんな国だった？" />
			</Beat>
			<Beat name="いない動物" captions={c} from={6} to={7}>
				<Visual label="ウシも、ウマもいない国？">
					<NoAnimals />
				</Visual>
			</Beat>
			<Beat name="海を渡る男" captions={c} from={8} to={9}>
				<Visual label="嵐にあえば、その男のせいに？">
					<StormMan />
				</Visual>
			</Beat>
			<Beat name="争い" captions={c} from={10} to={11}>
				<Photo id="toro3" move="out" label="国々は、何年も争いあった" />
			</Beat>
			<Beat name="女王が立つ" captions={c} from={12} to={14}>
				<Visual label="選ばれたのは、ひとりの女性">
					<QueenChosen />
				</Visual>
			</Beat>
			<Beat name="宮殿" captions={c} from={15} to={15}>
				<Photo id="yoshinogari-iseki" label="見張りの高い建物と、柵" />
			</Beat>
			<Beat name="千人の女性" captions={c} from={16} to={16}>
				<Visual label="女王の姿を見た者は、ほとんどいない">
					<ThousandAttendants />
				</Visual>
			</Beat>
			<Beat name="どこまで信じられる" captions={c} from={17} to={18}>
				<Visual label="この記録は、どこまで信じられる？">
					<RecordChecklist />
				</Visual>
			</Beat>
			<Beat name="魏の都へ" captions={c} from={19} to={19}>
				<Visual label="使いは、海を越えて魏の都へ">
					<EnvoyVoyage />
				</Visual>
			</Beat>
			<Beat name="洛陽" captions={c} from={20} to={22}>
				<Photo id="luoyang-palace" move="out" label="魏の皇帝は、何を贈った？" />
			</Beat>
			<Beat name="贈り物" captions={c} from={23} to={24}>
				<Visual label="女王への贈り物は、桁ちがい">
					<GiftCompare />
				</Visual>
			</Beat>
			<Beat name="狗奴国" captions={c} from={25} to={28}>
				<Visual label="晩年、南の国との争い">
					<KunaWar />
				</Visual>
			</Beat>
			<Beat name="日本に記録なし" captions={c} from={29} to={30}>
				<Visual label="日本には、この時代の文字がない">
					<NoRecordsJapan />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={31} to={33}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 31, 32, fps)} />
			</Beat>
			<Beat name="道のり" captions={c} from={34}>
				<Photo id="tsushima" label="この記録には、道のりも書かれている" />
			</Beat>
		</SceneFrame>
	);
};
