import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {DakoSword, IyoStory, MissingCentury, PeaceQueen, QueenSunrise, ShokiQuote, Timeline1300} from '../components/YamataiArt2';
import {rootsStoryCaptions as c} from '../data/captions';

// 本当の物語（素材はすべてこの場面だけで使う）
export const RootsStory = () => (
	<SceneFrame captions={c} voice="RootsStory" label="調査の先に" title="1300年前から続く謎解き">
		<Beat name="決まらなかった" captions={c} from={0} to={1}>
			<Photo id="kurozuka-funcho" move="out" label="場所も、墓も、金印も――" />
		</Beat>
		<Beat name="ここから" captions={c} from={2} to={3}>
			<Photo id="haniwa-mesuri" label="本当に驚いたのは、ここから" />
		</Beat>
		<Beat name="日本書紀" captions={c} from={4} to={5}>
			<Photo id="nihonshoki-683" label="日本の正式な歴史書に、何が？" />
		</Beat>
		<Beat name="神功皇后" captions={c} from={6} to={6}>
			<Photo id="jingu-kunisada" label="神功皇后の時代に書かれていたのは？" />
		</Beat>
		<Beat name="魏志の引用" captions={c} from={7} to={8}>
			<Visual label="日本書紀が書き写した、中国の記録">
				<ShokiQuote />
			</Visual>
		</Beat>
		<Beat name="重ねて書いた" captions={c} from={9} to={9}>
			<Photo id="jingu-yen" label="倭の女王は、神功皇后？" />
		</Beat>
		<Beat name="1300年" captions={c} from={10} to={11}>
			<Visual label="謎解きは、いつから続いている？">
				<Timeline1300 />
			</Visual>
		</Beat>
		<Beat name="もうひとつの物語" captions={c} from={12} to={13}>
			<Photo id="yoshinogari-sword" label="記録を読み直すと、見えてくるもの" />
		</Beat>
		<Beat name="武力ではなく" captions={c} from={14} to={14}>
			<Visual label="争いを終わらせたのは？">
				<PeaceQueen />
			</Visual>
		</Beat>
		<Beat name="壱与" captions={c} from={15} to={16}>
			<Visual label="女王が亡くなると、何が起きた？">
				<IyoStory />
			</Visual>
		</Beat>
		<Beat name="謎の4世紀" captions={c} from={17} to={18}>
			<Visual label="日本が、記録から消えた？">
				<MissingCentury />
			</Visual>
		</Beat>
		<Beat name="富雄丸山古墳" captions={c} from={19} to={19}>
			<Photo id="tomio-zenkei" move="right" label="謎の時代が、少しずつ見えてきた" />
		</Beat>
		<Beat name="蛇行剣" captions={c} from={20} to={20}>
			<Visual label="東アジア最大の鉄の剣">
				<DakoSword />
			</Visual>
		</Beat>
		<Beat name="盾形の鏡" captions={c} from={21} to={21}>
			<Photo id="tomio-funkyu" move="left" label="誰も見たことのない形の品" />
		</Beat>
		<Beat name="史跡に" captions={c} from={22} to={22}>
			<Photo id="tomio-fukiishi" label="2027年、国の史跡に" />
		</Beat>
		<Beat name="みんなで立てた女王" captions={c} from={23} to={24}>
			<Photo id="miwa" move="out" label="1800年前、みんなで立てた女王" />
		</Beat>
		<Beat name="最初の記録" captions={c} from={25}>
			<Visual label="この国の最初の記録に残った物語">
				<QueenSunrise />
			</Visual>
		</Beat>
	</SceneFrame>
);
