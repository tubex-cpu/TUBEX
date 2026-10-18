import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {HiddenCorridor, MuonScan, NagoyaFilm, SealedEnvelope} from '../components/PyramidArt3';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';
import {colors} from '../theme';

// まだ解けていない謎
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} voice="UnsolvedMystery" label="未決" title="目的のわからない空間">
		<Beat name="残った謎" captions={c} from={0} to={1}>
			<Photo id="khufu-pyramid-gary" move="out" label="ボクにも、まだ判決が出せない謎" />
		</Beat>
		<Beat name="ミューオン" captions={c} from={2} to={3}>
			<Visual label="宇宙からの粒で、中を見る？" labelColor={colors.goldSoft}>
				<MuonScan />
			</Visual>
		</Beat>
		<Beat name="名古屋大学" captions={c} from={4} to={5}>
			<Visual label="最初にとらえたのは、日本の技術">
				<NagoyaFilm />
			</Visual>
		</Beat>
		<Beat name="かくれた通路" captions={c} from={6} to={7}>
			<Visual label="北側の入口の上に、何が？">
				<HiddenCorridor />
			</Visual>
		</Beat>
		<Beat name="予告" captions={c} from={8} to={10}>
			<Visual label="中身は、まだ明かされていない">
				<SealedEnvelope />
			</Visual>
		</Beat>
		<Beat name="メンカウラー" captions={c} from={11} to={11}>
			<Photo id="menkaure-musik" label="すぐ近くのピラミッドにも？" />
		</Beat>
		<Beat name="また判決を" captions={c} from={12}>
			<Photo id="flood-time-1890s" move="right" label="発表があったら、もう一度判決を" />
		</Beat>
	</SceneFrame>
);
