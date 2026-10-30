import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Doggerland, GondwanaStretch, RealStories, Zealandia94} from '../components/MuArt4';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {rootsStoryCaptions as c} from '../data/captions';

// 本当に沈んでいた大陸（素材はすべてこの場面だけで使う）
export const RootsStory = () => (
	<SceneFrame captions={c} voice="RootsStory" label="本当の物語" title="本当に沈んでいた大陸">
		<Beat name="2017年の論文" captions={c} from={0} to={2}>
			<Photo id="nz-alps" move="out" label="2017年の論文" />
		</Beat>
		<Beat name="ジーランディア" captions={c} from={3} to={4}>
			<Photo id="zealandia-topo" label="ジーランディア" />
		</Beat>
		<Beat name="Zealandia94" captions={c} from={5} to={7}>
			<Visual label="94％が、海の下">
				<Zealandia94 />
			</Visual>
		</Beat>
		<Beat name="海の上に出ている、ほんの" captions={c} from={8} to={8}>
			<Photo id="newcaledonia" label="海の上に出ている、ほんの一部" />
		</Beat>
		<Beat name="GondwanaStretch" captions={c} from={9} to={11}>
			<Visual label="何千万年もかけて">
				<GondwanaStretch />
			</Visual>
		</Beat>
		<Beat name="沈んだ大陸は、本当にあっ" captions={c} from={12} to={14}>
			<Photo id="nz-coast" move="left" label="沈んだ大陸は、本当にあった" />
		</Beat>
		<Beat name="沈んだのは、大陸だけでは" captions={c} from={15} to={15}>
			<Photo id="northsea" move="out" label="沈んだのは、大陸だけではない" />
		</Beat>
		<Beat name="Doggerland" captions={c} from={16} to={20}>
			<Stage label="ドッガーランド" labelBottom>
				<Doggerland />
			</Stage>
		</Beat>
		<Beat name="本当の話のほうが、面白い" captions={c} from={21} to={22}>
			<Photo id="moai-stars" label="本当の話のほうが、面白い" />
		</Beat>
		<Beat name="海の上の石の都" captions={c} from={23} to={23}>
			<Photo id="nanmadol-n" label="海の上の石の都" />
		</Beat>
		<Beat name="星を読む航海" captions={c} from={24} to={24}>
			<Photo id="hokulea-2" label="星を読む航海" />
		</Beat>
		<Beat name="歩いた石像" captions={c} from={25} to={25}>
			<Photo id="tongariki-f" label="歩いた石像" />
		</Beat>
		<Beat name="RealStories" captions={c} from={26}>
			<Visual label="そして、本物の大陸">
				<RealStories />
			</Visual>
		</Beat>
	</SceneFrame>
);
