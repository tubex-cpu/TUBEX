import {Beat} from '../components/Beat';
import {Dig2018, DodanReveal, ErodedEdges, HaniwaRowFound, HeritageAreas, OjinPrecedent, OneToRow, PrecedentCheck, ReliefMethod, StonePaving} from '../components/NintokuArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {rootsStoryCaptions as c} from '../data/captions';

// 動き出した巨大古墳（素材はすべてこの場面だけで使う）
export const RootsStory = () => (
	<SceneFrame captions={c} voice="RootsStory" label="調査の先に" title="動き出した巨大古墳">
		<Beat name="答えは、見つからなかった" captions={c} from={0} to={0}>
			<Photo id="daisen-b6" label="答えは、見つからなかった" />
		</Beat>
		<Beat name="閉ざされた古墳が、動き出" captions={c} from={1} to={2}>
			<Photo id="daisen-2024" move="out" label="閉ざされた古墳が、動き出す" />
		</Beat>
		<Beat name="2018年、初めての共同" captions={c} from={3} to={4}>
			<Photo id="moat-5" label="2018年、初めての共同発掘" />
		</Beat>
		<Beat name="Dig2018" captions={c} from={5} to={6}>
			<Visual label="どこを掘った？">
				<Dig2018 />
			</Visual>
		</Beat>
		<Beat name="HaniwaRowFound" captions={c} from={7} to={8}>
			<Visual label="地面の下から">
				<HaniwaRowFound />
			</Visual>
		</Beat>
		<Beat name="StonePaving" captions={c} from={9} to={9}>
			<Visual label="堤の上には？">
				<StonePaving />
			</Visual>
		</Beat>
		<Beat name="OneToRow" captions={c} from={10} to={11}>
			<Visual label="1本から、列へ">
				<OneToRow />
			</Visual>
		</Beat>
		<Beat name="1500年以上前の埴輪" captions={c} from={12} to={12}>
			<Photo id="haniwa-warrior" label="1500年以上前の埴輪" />
		</Beat>
		<Beat name="2回目の調査でも" captions={c} from={13} to={13}>
			<Photo id="moat-6" label="2回目の調査でも" />
		</Beat>
		<Beat name="2019年、世界文化遺産" captions={c} from={14} to={15}>
			<Photo id="daisen-h5" move="left" label="2019年、世界文化遺産へ" />
		</Beat>
		<Beat name="HeritageAreas" captions={c} from={16} to={16}>
			<Visual label="百舌鳥と古市">
				<HeritageAreas />
			</Visual>
		</Beat>
		<Beat name="ReliefMethod" captions={c} from={17} to={20}>
			<Visual label="「赤色立体図」とは？">
				<ReliefMethod />
			</Visual>
		</Beat>
		<Beat name="DodanReveal" captions={c} from={21} to={21}>
			<Visual label="浮かび上がったのは？">
				<DodanReveal />
			</Visual>
		</Beat>
		<Beat name="PrecedentCheck" captions={c} from={22} to={23}>
			<Visual label="前例は、あるのか？">
				<PrecedentCheck />
			</Visual>
		</Beat>
		<Beat name="OjinPrecedent" captions={c} from={24} to={27}>
			<Visual label="応神天皇陵とされる古墳では">
				<OjinPrecedent />
			</Visual>
		</Beat>
		<Beat name="ErodedEdges" captions={c} from={28} to={29}>
			<Visual label="まだ、わからないこと">
				<ErodedEdges />
			</Visual>
		</Beat>
		<Beat name="森の下に隠れた形" captions={c} from={30} to={30}>
			<Photo id="nisanzai" move="out" label="森の下に隠れた形" />
		</Beat>
		<Beat name="1500年前の人々の手仕" captions={c} from={31}>
			<Photo id="haniwa-house" label="1500年前の人々の手仕事" />
		</Beat>
	</SceneFrame>
);
