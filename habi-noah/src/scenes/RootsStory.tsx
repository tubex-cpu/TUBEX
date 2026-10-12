import {Beat} from '../components/Beat';
import {FloodMythWorld, JomonSeaMap, SeaLevelChart, VerdictTiles} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Footprints, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 足元にあった物語
export const RootsStory = () => (
	<SceneFrame captions={c} voice="RootsStory" label="調査の先に" title="本当の大洪水は、日本にも来ていた">
		<Beat name="船はなかった" captions={c} from={0} to={2}>
			<VerdictTiles />
		</Beat>
		<Beat name="本当の大洪水" captions={c} from={3} to={4}>
			<Photo id="glacier" move="out" label="もっと大きな、本当の「大洪水」があった">
				<Visual label="もっと大きな、本当の「大洪水」があった">
					<SeaLevelChart />
				</Visual>
			</Photo>
		</Beat>
		<Beat name="氷河期" captions={c} from={5} to={6}>
			<Photo id="glacier" label="2万年前、海面は120m以上も低かった">
				<Visual label="2万年前、海面は120m以上も低かった">
					<SeaLevelChart />
				</Visual>
			</Photo>
		</Beat>
		<Beat name="海がのぼる" captions={c} from={7} to={9}>
			<Visual label="海は、何千年もかけて陸にのぼってきた">
				<SeaLevelChart />
			</Visual>
		</Beat>
		<Beat name="日本にも" captions={c} from={10} to={14}>
			<Visual label="6000年前、海は栃木県まで来ていた？" labelColor={colors.goldSoft}>
				<JomonSeaMap />
			</Visual>
		</Beat>
		<Beat name="貝塚" captions={c} from={15} to={17}>
			<Visual label="海のない県から出てくる、海の貝がら">
				<JomonSeaMap />
			</Visual>
		</Beat>
		<Beat name="生き延びた" captions={c} from={18} to={18}>
			<Photo id="kaizuka" label="のぼってくる海と生きた、縄文の人々">
				<Visual label="のぼってくる海と生きた、縄文の人々">
					<Footprints sea />
				</Visual>
			</Photo>
		</Beat>
		<Beat name="世界の洪水神話" captions={c} from={19} to={21}>
			<Visual label="なぜ世界中に、洪水の物語があるのか">
				<FloodMythWorld />
			</Visual>
		</Beat>
		<Beat name="胸が熱くなる" captions={c} from={22}>
			<Photo id="kaizuka" move="out" label="海がのぼる時代を、生き延びた記憶">
				<Visual label="海がのぼる時代を、生き延びた記憶">
					<FloodMythWorld />
				</Visual>
			</Photo>
		</Beat>
	</SceneFrame>
);
