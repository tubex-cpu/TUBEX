import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {FakeSuspicion, MissingEvidence, OnlyThreeReaders, ReburiedTablets, TwoPillars, WhereNow} from '../components/MuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue5TabletsCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// ムーの記録が刻まれた粘土板がある？（素材はすべてこの場面だけで使う）
export const Clue5Tablets = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Tablets" label="第5の手がかり" title="ムーの記録が刻まれた粘土板がある？">
			<Beat name="インドの寺院の粘土板？" captions={c} from={0} to={2}>
				<Photo id="india-temple" move="out" label="インドの寺院の粘土板？" />
			</Beat>
			<Beat name="OnlyThreeReaders" captions={c} from={3} to={4}>
				<Visual label="読めるのは、ほかに2人だけ？">
					<OnlyThreeReaders />
				</Visual>
			</Beat>
			<Beat name="鉱物の研究者ニーヴン" captions={c} from={5} to={7}>
				<Photo id="niven" label="鉱物の研究者ニーヴン" />
			</Beat>
			<Beat name="メキシコの石の板" captions={c} from={8} to={8}>
				<Photo id="mexico-valley" move="out" label="メキシコの石の板" />
			</Beat>
			<Beat name="WhereNow" captions={c} from={9} to={10}>
				<Visual label="今、どこにある？">
					<WhereNow />
				</Visual>
			</Beat>
			<Beat name="MissingEvidence" captions={c} from={11} to={13}>
				<Visual label="確かめる手がかりは？">
					<MissingEvidence />
				</Visual>
			</Beat>
			<Beat name="ReburiedTablets" captions={c} from={14} to={17}>
				<Visual label="埋め戻された石の板">
					<ReburiedTablets />
				</Visual>
			</Beat>
			<Beat name="FakeSuspicion" captions={c} from={18} to={20}>
				<Visual label="本物か、偽物か">
					<FakeSuspicion />
				</Visual>
			</Beat>
			<Beat name="TwoPillars" captions={c} from={21} to={22}>
				<Visual label="大陸を支えた2本の柱">
					<TwoPillars />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={23} to={25}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 23, 24, fps)} />
			</Beat>
			<Beat name="南の海の、黒い石の都" captions={c} from={26}>
				<Photo id="nanmadol-e" move="out" label="南の海の、黒い石の都" />
			</Beat>
		</SceneFrame>
	);
};
