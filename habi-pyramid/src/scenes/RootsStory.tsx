import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {AkhetKhufu, BoatParts, LimestoneRoute, MererCrew, PapyrusFind, RedSeaMap, RoundTrips, SecondBoat} from '../components/PyramidArt3';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// 名前の残った人々（素材はすべてこの場面だけで使う）
export const RootsStory = () => (
	<SceneFrame captions={c} voice="RootsStory" label="調査の先に" title="名前の残った人々">
		<Beat name="なかった" captions={c} from={0} to={2}>
			<Photo id="spelterini" label="2万年前の文明も、地下都市も――" />
		</Beat>
		<Beat name="ここから" captions={c} from={3} to={3}>
			<Photo id="cheops-laskar4" move="right" label="本当に驚いたのは、ここから" />
		</Beat>
		<Beat name="紅海" captions={c} from={4} to={4}>
			<Visual label="2013年、紅海の近くの乾いた谷">
				<RedSeaMap />
			</Visual>
		</Beat>
		<Beat name="パピルス" captions={c} from={5} to={6}>
			<Visual label="岩の倉庫に眠っていたのは？">
				<PapyrusFind />
			</Visual>
		</Beat>
		<Beat name="メレル" captions={c} from={7} to={9}>
			<Visual label="書いたのは、ひとりの役人">
				<MererCrew />
			</Visual>
		</Beat>
		<Beat name="石灰岩" captions={c} from={10} to={12}>
			<Visual label="船で運んだ白い石は、どこへ？">
				<LimestoneRoute />
			</Visual>
		</Beat>
		<Beat name="アケト・クフ" captions={c} from={13} to={14}>
			<Visual label="ピラミッドの、本当の名前">
				<AkhetKhufu />
			</Visual>
		</Beat>
		<Beat name="アンクハフ" captions={c} from={15} to={15}>
			<Photo id="ankhhaf" label="日誌に出てくる、上司の名前" />
		</Beat>
		<Beat name="往復" captions={c} from={16} to={18}>
			<Visual label="何度も、何度も">
				<RoundTrips />
			</Visual>
		</Beat>
		<Beat name="名前のある人々" captions={c} from={19} to={20}>
			<Photo id="roberts-sphinx" label="名前のある人々が、積んだ石" />
		</Beat>
		<Beat name="船の穴" captions={c} from={21} to={21}>
			<Photo id="boat-pit" move="left" label="日本の人々が関わる、4500年前の船" />
		</Beat>
		<Beat name="クフ王の船" captions={c} from={22} to={23}>
			<Photo id="khufu-ship-1" move="right" label="全長およそ43メートル" />
		</Beat>
		<Beat name="2隻目" captions={c} from={24} to={25}>
			<Visual label="すぐ隣に、もう一隻">
				<SecondBoat />
			</Visual>
		</Beat>
		<Beat name="大エジプト博物館" captions={c} from={26} to={26}>
			<Photo id="gem" label="2025年11月、全面開館" />
		</Beat>
		<Beat name="部品" captions={c} from={27} to={28}>
			<Visual label="来館者の目の前で、組み立てが始まった">
				<BoatParts />
			</Visual>
		</Beat>
		<Beat name="組み立て" captions={c} from={29} to={30}>
			<Photo id="khufu-ship-2" move="out" label="4500年前の船を、もう一度" />
		</Beat>
		<Beat name="名前が残る場所" captions={c} from={31}>
			<Photo id="haghe-nile" label="名前が残らないはずだった人々" />
		</Beat>
	</SceneFrame>
);
