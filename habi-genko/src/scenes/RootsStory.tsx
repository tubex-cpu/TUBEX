import {Beat} from '../components/Beat';
import {Dig2018, DodanReveal, ErodedEdges, HaniwaRowFound, OjinPrecedent, OneToRow, PrecedentCheck, ReliefMethod, StonePaving} from '../components/NintokuArt2';
import {Dig2021} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {rootsStoryCaptions as c} from '../data/captions';

// 動き出した巨大古墳（素材はすべてこの場面だけで使う）
export const RootsStory = () => (
	<SceneFrame captions={c} voice="RootsStory" label="調査の先に" title="動き出した巨大古墳">
		<Beat name="答えは、見つからなかった" captions={c} from={0} to={0}>
			<Photo id="maruhoyama-moat-2" label="答えは、見つからなかった" />
		</Beat>
		<Beat name="閉ざされた古墳が、動き出" captions={c} from={1} to={2}>
			<Photo id="gobyoyama-balloon" move="out" label="閉ざされた古墳が、動き出す" />
		</Beat>
		<Beat name="2018年、初めての共同" captions={c} from={3} to={5}>
			<Photo id="moat-9" label="2018年、初めての共同発掘" />
		</Beat>
		<Beat name="Dig2018" captions={c} from={6} to={7}>
			<Visual label="どこを掘った？">
				<Dig2018 />
			</Visual>
		</Beat>
		<Beat name="HaniwaRowFound" captions={c} from={8} to={9}>
			<Visual label="地面の下から">
				<HaniwaRowFound />
			</Visual>
		</Beat>
		<Beat name="StonePaving" captions={c} from={10} to={12}>
			<Visual label="堤の上には？">
				<StonePaving />
			</Visual>
		</Beat>
		<Beat name="OneToRow" captions={c} from={13} to={14}>
			<Visual label="1本から、列へ">
				<OneToRow />
			</Visual>
		</Beat>
		<Beat name="1500年以上前の埴輪" captions={c} from={15} to={15}>
			<Photo id="haniwa-woman-2" label="1500年以上前の埴輪" />
		</Beat>
		<Beat name="世界遺産へ" captions={c} from={16} to={16}>
			<Photo id="moat-6" label="世界遺産へ" />
		</Beat>
		<Beat name="Dig2021" captions={c} from={17} to={18}>
			<Visual label="2021年、2回目の調査">
				<Dig2021 />
			</Visual>
		</Beat>
		<Beat name="そして2025年" captions={c} from={19} to={19}>
			<Photo id="omotezuka" label="そして2025年" />
		</Beat>
		<Beat name="近代の堺の展覧会" captions={c} from={20} to={20}>
			<Photo id="mozu-gobyo" label="近代の堺の展覧会" />
		</Beat>
		<Beat name="近づいて知る古墳へ" captions={c} from={21} to={22}>
			<Photo id="osamezuka-2" label="近づいて知る古墳へ" />
		</Beat>
		<Beat name="ReliefMethod" captions={c} from={23} to={26}>
			<Visual label="「赤色立体図」とは？">
				<ReliefMethod />
			</Visual>
		</Beat>
		<Beat name="DodanReveal" captions={c} from={27} to={28}>
			<Visual label="浮かび上がったのは？">
				<DodanReveal />
			</Visual>
		</Beat>
		<Beat name="PrecedentCheck" captions={c} from={29} to={30}>
			<Visual label="前例は、あるのか？">
				<PrecedentCheck />
			</Visual>
		</Beat>
		<Beat name="OjinPrecedent" captions={c} from={31} to={32}>
			<Visual label="応神天皇陵とされる古墳では">
				<OjinPrecedent />
			</Visual>
		</Beat>
		<Beat name="昭和10年の記録" captions={c} from={33} to={34}>
			<Photo id="muroto" label="昭和10年の記録" />
		</Beat>
		<Beat name="ErodedEdges" captions={c} from={35} to={37}>
			<Visual label="まだ、わからないこと">
				<ErodedEdges />
			</Visual>
		</Beat>
		<Beat name="森の下に隠れた形" captions={c} from={38} to={38}>
			<Photo id="magodayu-2" move="out" label="森の下に隠れた形" />
		</Beat>
		<Beat name="1500年前の人々の手仕" captions={c} from={39}>
			<Photo id="omotezuka-moat" label="1500年前の人々の手仕事" />
		</Beat>
	</SceneFrame>
);
