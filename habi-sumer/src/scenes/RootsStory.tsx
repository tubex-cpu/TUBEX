import {Beat} from '../components/Beat';
import {JapanGunma, TwoStreams} from '../components/Illustrations';
import {ClueIcons, Footprints, PersonSilhouette, RockShelter, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// 20:51 足元にあった物語
export const RootsStory = () => (
	<SceneFrame captions={c} label="調査の先に" title="本当の驚きは、ここから" tint="#2d2a1a">
		<Beat name="手がかりは途切れた" captions={c} from={0} to={2}>
			<ClueIcons />
		</Beat>
		<Beat name="群馬の山あい" captions={c} from={3} to={5}>
			<Visual label="答えは、日本の山奥に眠っていた">
				<RockShelter />
			</Visual>
		</Beat>
		<Beat name="群馬の縄文女性" captions={c} from={6} to={10}>
			<JapanGunma />
		</Beat>
		<Beat name="ふたつの流れ" captions={c} from={11} to={12}>
			<TwoStreams />
		</Beat>
		<Beat name="自分は何者か" captions={c} from={13} to={14}>
			<Visual label="なぜ人は「特別な祖先」を求めるのか">
				<PersonSilhouette question color="#8e9ba7" />
			</Visual>
		</Beat>
		<Beat name="生き延びた証" captions={c} from={15}>
			<Visual label="あなたのDNAに刻まれた、本当の旅">
				<Footprints sea />
			</Visual>
		</Beat>
	</SceneFrame>
);
