import {Beat} from '../components/Beat';
import {DoggerlandMap, FloodMythWorld, JomonSeaMap, SeaLevelChart} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Footprints, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 足元にあった物語（素材はすべてこの場面だけで使う）
export const RootsStory = () => (
	<SceneFrame captions={c} voice="RootsStory" label="調査の先に" title="本当の大洪水は、日本にも来ていた">
		<Beat name="船はなかった" captions={c} from={0} to={2}>
			<Photo id="aivazovsky-descent" label="船も、世界の洪水も、なかった。でも――" />
		</Beat>
		<Beat name="本当の大洪水" captions={c} from={3} to={4}>
			<Photo id="glacier" move="out" label="もっと大きな、本当の「大洪水」があった？" />
		</Beat>
		<Beat name="氷河期" captions={c} from={5} to={6}>
			<Photo id="ice-age-earth" label="2万年前、海面は120m以上も低かった" />
		</Beat>
		<Beat name="氷がとける" captions={c} from={7} to={7}>
			<Photo id="antarctica" move="right" label="やがて、氷がとけはじめる" />
		</Beat>
		<Beat name="海がのぼる" captions={c} from={8} to={9}>
			<Visual label="海は、何千年もかけて陸にのぼってきた">
				<SeaLevelChart />
			</Visual>
		</Beat>
		<Beat name="ドッガーランドの地図" captions={c} from={10} to={11}>
			<Photo id="doggerland-map" label="北海の底に、人が暮らす陸地があった？" />
		</Beat>
		<Beat name="漁船の網" captions={c} from={12} to={12}>
			<Photo id="trawler" move="left" label="漁船の網にかかった、泥炭のかたまり" />
		</Beat>
		<Beat name="ドッガーランドが沈む" captions={c} from={13} to={14}>
			<Visual label="ふるさとが、少しずつ海に消えていく">
				<DoggerlandMap />
			</Visual>
		</Beat>
		<Beat name="縄文時代" captions={c} from={15} to={16}>
			<Photo id="jomon-flame" label="6000年前、縄文時代の日本で" />
		</Beat>
		<Beat name="縄文海進" captions={c} from={17} to={19}>
			<Visual label="6000年前、海は栃木県まで来ていた？" labelColor={colors.goldSoft}>
				<JomonSeaMap />
			</Visual>
		</Beat>
		<Beat name="貝塚" captions={c} from={20} to={21}>
			<Photo id="anrakuji" move="out" label="海のない県から出てくる、海の貝がら" />
		</Beat>
		<Beat name="水子貝塚" captions={c} from={22} to={22}>
			<Photo id="mizuko" move="right" label="埼玉県富士見市・水子貝塚" />
		</Beat>
		<Beat name="昔の海岸線" captions={c} from={23} to={23}>
			<Photo id="tokyo-bay" label="貝塚をつなぐと、昔の海岸線が浮かぶ" />
		</Beat>
		<Beat name="生き延びた" captions={c} from={24} to={24}>
			<Photo id="kaizuka" move="left" label="のぼってくる海と生きた、縄文の人々" />
		</Beat>
		<Beat name="世界の洪水神話" captions={c} from={25} to={25}>
			<Visual label="なぜ世界中に、洪水の物語があるのか">
				<FloodMythWorld />
			</Visual>
		</Beat>
		<Beat name="インドの洪水神話" captions={c} from={26} to={26}>
			<Photo id="matsya" label="インドにも、洪水から人を救う物語" />
		</Beat>
		<Beat name="ギリシャの洪水神話" captions={c} from={27} to={27}>
			<Photo id="deucalion" move="right" label="ギリシャにも、洪水を生き延びた夫婦の物語" />
		</Beat>
		<Beat name="胸が熱くなる" captions={c} from={28}>
			<Visual label="海がのぼる時代を、生き延びた記憶">
				<Footprints sea />
			</Visual>
		</Beat>
	</SceneFrame>
);
