import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {AiSatellite, AncientGenome, JapanRootsClaim, LaserTerrain, LastFragment, MuCities, MuNameReveal, MuRises, MuSinking, NoOldRecord, ScienceNow, SurvivorsFlee, WalkingStatueTease, WhoCounted} from '../components/MuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {introCaptions as c} from '../data/captions';

// 謎の先出し（素材はすべてこの場面だけで使う）
export const Intro = () => (
	<SceneFrame captions={c} voice="Intro">
		<Beat name="MuRises" captions={c} from={0} to={0}>
			<Stage label="1万2000年前の太平洋" labelBottom>
				<MuRises />
			</Stage>
		</Beat>
		<Beat name="MuCities" captions={c} from={1} to={2}>
			<Stage label="7つの大都市、6400万人" labelBottom>
				<MuCities />
			</Stage>
		</Beat>
		<Beat name="MuSinking" captions={c} from={3} to={4}>
			<Stage label="ひと晩で、海の底へ" labelBottom>
				<MuSinking />
			</Stage>
		</Beat>
		<Beat name="MuNameReveal" captions={c} from={5} to={5}>
			<Visual>
				<MuNameReveal />
			</Visual>
		</Beat>
		<Beat name="SurvivorsFlee" captions={c} from={6} to={6}>
			<Stage label="生き残りは、島々へ？" labelBottom>
				<SurvivorsFlee />
			</Stage>
		</Beat>
		<Beat name="ムーの都の跡？" captions={c} from={7} to={7}>
			<Photo id="nanmadol-a" move="out" label="ムーの都の跡？" />
		</Beat>
		<Beat name="墓を暴いた男" captions={c} from={8} to={8}>
			<Photo id="nanmadol-b" move="left" label="墓を暴いた男" />
		</Beat>
		<Beat name="海に背を向ける石像" captions={c} from={9} to={9}>
			<Photo id="tongariki-a" label="海に背を向ける石像" />
		</Beat>
		<Beat name="海の底の、巨大な階段" captions={c} from={10} to={10}>
			<Photo id="yonaguni-a" label="海の底の、巨大な階段" />
		</Beat>
		<Beat name="JapanRootsClaim" captions={c} from={11} to={11}>
			<Stage label="日本人のルーツは、ムー？" labelBottom>
				<JapanRootsClaim />
			</Stage>
		</Beat>
		<Beat name="LastFragment" captions={c} from={12} to={12}>
			<Visual>
				<LastFragment />
			</Visual>
		</Beat>
		<Beat name="NoOldRecord" captions={c} from={13} to={14}>
			<Visual label="古い記録が、ない？">
				<NoOldRecord />
			</Visual>
		</Beat>
		<Beat name="WhoCounted" captions={c} from={15} to={15}>
			<Visual>
				<WhoCounted />
			</Visual>
		</Beat>
		<Beat name="名前は、どこで生まれた？" captions={c} from={16} to={16}>
			<Photo id="madrid-a" move="out" label="名前は、どこで生まれた？" />
		</Beat>
		<Beat name="本当に1万2000年前？" captions={c} from={17} to={17}>
			<Photo id="nanmadol-c" label="本当に1万2000年前？" />
		</Beat>
		<Beat name="WalkingStatueTease" captions={c} from={18} to={19}>
			<Visual label="石像は、歩いた？">
				<WalkingStatueTease />
			</Visual>
		</Beat>
		<Beat name="ScienceNow" captions={c} from={20} to={20}>
			<Visual label="最新の科学が、謎に挑む">
				<ScienceNow />
			</Visual>
		</Beat>
		<Beat name="AiSatellite" captions={c} from={21} to={21}>
			<Visual label="人工知能が、衛星写真を読む">
				<AiSatellite />
			</Visual>
		</Beat>
		<Beat name="AncientGenome" captions={c} from={22} to={22}>
			<Visual label="古い骨に残った遺伝子">
				<AncientGenome />
			</Visual>
		</Beat>
		<Beat name="LaserTerrain" captions={c} from={23} to={23}>
			<Visual label="森の下に、隠れていたもの">
				<LaserTerrain />
			</Visual>
		</Beat>
		<Beat name="伝説をくつがえす発見とは" captions={c} from={24}>
			<Photo id="pacific-night" move="out" label="伝説をくつがえす発見とは？" />
		</Beat>
	</SceneFrame>
);
