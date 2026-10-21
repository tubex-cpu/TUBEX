import {Beat} from '../components/Beat';
import {CastleTimeline, DigFind2023, DroughtWall, HosokawaLetter, Isolation} from '../components/HonnojiArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {rootsStoryCaptions as c} from '../data/captions';

// 光秀の幻の城（素材はすべてこの場面だけで使う）
export const RootsStory = () => (
	<SceneFrame captions={c} voice="RootsStory" label="調査の先に" title="光秀の幻の城">
		<Beat name="なぜ討ったのか、答えは―" captions={c} from={0} to={1}>
			<Photo id="sakamoto-02" label="なぜ討ったのか、答えは――" />
		</Beat>
		<Beat name="光秀が助けを求めた相手" captions={c} from={2} to={2}>
			<Photo id="fujitaka" label="光秀が助けを求めた相手" />
		</Beat>
		<Beat name="HosokawaLetter" captions={c} from={3} to={5}>
			<Visual label="事件のあとに書いた手紙">
				<HosokawaLetter />
			</Visual>
		</Beat>
		<Beat name="Isolation" captions={c} from={6} to={7}>
			<Visual label="光秀は、孤立していった">
				<Isolation />
			</Visual>
		</Beat>
		<Beat name="本当に驚いたのは、ここか" captions={c} from={8} to={9}>
			<Photo id="biwa-sa" move="out" label="本当に驚いたのは、ここから" />
		</Beat>
		<Beat name="琵琶湖のほとりの、坂本城" captions={c} from={10} to={11}>
			<Photo id="sakamoto-01" label="琵琶湖のほとりの、坂本城" />
		</Beat>
		<Beat name="安土城に次ぐ、華麗な城" captions={c} from={12} to={12}>
			<Photo id="sakamoto-04" move="left" label="安土城に次ぐ、華麗な城" />
		</Beat>
		<Beat name="坂本城の最期" captions={c} from={13} to={14}>
			<Photo id="hidemitsu-ukiyoe" label="坂本城の最期" />
		</Beat>
		<Beat name="天下の宝を、燃やすわけに" captions={c} from={15} to={17}>
			<Photo id="hidemitsu-lake" label="天下の宝を、燃やすわけには" />
		</Beat>
		<Beat name="人々は、幻の城と呼んだ" captions={c} from={18} to={19}>
			<Photo id="honnoji-site" move="right" label="人々は、幻の城と呼んだ" />
		</Beat>
		<Beat name="DroughtWall" captions={c} from={20} to={22}>
			<Visual label="手がかりは、湖の中に">
				<DroughtWall />
			</Visual>
		</Beat>
		<Beat name="DigFind2023" captions={c} from={23} to={24}>
			<Visual label="2023年、地面の下から">
				<DigFind2023 />
			</Visual>
		</Beat>
		<Beat name="CastleTimeline" captions={c} from={25} to={28}>
			<Visual label="幻の城が、姿を現しはじめた">
				<CastleTimeline />
			</Visual>
		</Beat>
		<Beat name="光秀が治めた土地では" captions={c} from={29} to={30}>
			<Photo id="fukuchiyama" move="out" label="光秀が治めた土地では" />
		</Beat>
		<Beat name="光秀をまつる神社" captions={c} from={31} to={32}>
			<Photo id="goryo" label="光秀をまつる神社" />
		</Beat>
		<Beat name="たった一夜で、全てを賭け" captions={c} from={33}>
			<Photo id="ranmaru-end" label="たった一夜で、全てを賭けた理由" />
		</Beat>
	</SceneFrame>
);
