import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {JapaneseDiverClaim, LidarFields, LostInWar, NanyoMap, NoEvidenceList, PlatinumCoffin} from '../components/MuArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue8PlatinumCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 海の底に、プラチナの棺が眠る？（素材はすべてこの場面だけで使う）
export const Clue8Platinum = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Platinum" label="第8の手がかり" title="海の底に、プラチナの棺が眠る？">
			<Beat name="PlatinumCoffin" captions={c} from={0} to={2}>
				<Visual label="白く光る棺？">
					<PlatinumCoffin />
				</Visual>
			</Beat>
			<Beat name="JapaneseDiverClaim" captions={c} from={3} to={6}>
				<Visual label="日本の潜水夫が見つけた？">
					<JapaneseDiverClaim />
				</Visual>
			</Beat>
			<Beat name="NanyoMap" captions={c} from={7} to={9}>
				<Visual label="南洋群島">
					<NanyoMap />
				</Visual>
			</Beat>
			<Beat name="NoEvidenceList" captions={c} from={10} to={12}>
				<Visual label="証拠は？">
					<NoEvidenceList />
				</Visual>
			</Beat>
			<Beat name="LostInWar" captions={c} from={13} to={13}>
				<Visual label="「記録は失われた」">
					<LostInWar />
				</Visual>
			</Beat>
			<Beat name="LidarFields" captions={c} from={14} to={16}>
				<Visual label="森の下に広がるもの">
					<LidarFields />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={17} to={19}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 17, 18, fps)} />
			</Beat>
			<Beat name="ムーの生き残りの島？" captions={c} from={20}>
				<Photo id="moai-nau" move="out" label="ムーの生き残りの島？" />
			</Beat>
		</SceneFrame>
	);
};
