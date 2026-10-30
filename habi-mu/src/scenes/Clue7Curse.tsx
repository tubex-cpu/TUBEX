import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {AncestorsPlace, DeathRecord, GermanColony, KingTomb, NightOfCurse, NoChainDeaths, SunAndStone} from '../components/MuArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue7CurseCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 墓を暴いた男は、呪いで命を落とした？（素材はすべてこの場面だけで使う）
export const Clue7Curse = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Curse" label="第7の手がかり" title="墓を暴いた男は、呪いで命を落とした？">
			<Beat name="GermanColony" captions={c} from={0} to={0}>
				<Visual label="ドイツの植民地">
					<GermanColony />
				</Visual>
			</Beat>
			<Beat name="ドイツの役人ベルク" captions={c} from={1} to={1}>
				<Photo id="ponape-1899" label="ドイツの役人ベルク" />
			</Beat>
			<Beat name="KingTomb" captions={c} from={2} to={3}>
				<Visual label="王の墓">
					<KingTomb />
				</Visual>
			</Beat>
			<Beat name="1907年4月" captions={c} from={4} to={5}>
				<Photo id="nanmadol-k" label="1907年4月" />
			</Beat>
			<Beat name="NightOfCurse" captions={c} from={6} to={7}>
				<Visual label="墓の主の怒り？">
					<NightOfCurse />
				</Visual>
			</Beat>
			<Beat name="作り話ではない" captions={c} from={8} to={10}>
				<Photo id="nanmadol-l" move="left" label="作り話ではない" />
			</Beat>
			<Beat name="DeathRecord" captions={c} from={11} to={12}>
				<Visual label="記録に残る死因">
					<DeathRecord />
				</Visual>
			</Beat>
			<Beat name="SunAndStone" captions={c} from={13} to={13}>
				<Visual label="赤道に近い島">
					<SunAndStone />
				</Visual>
			</Beat>
			<Beat name="NoChainDeaths" captions={c} from={14} to={16}>
				<Visual>
					<NoChainDeaths />
				</Visual>
			</Beat>
			<Beat name="AncestorsPlace" captions={c} from={17} to={20}>
				<Visual>
					<AncestorsPlace />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={21} to={23}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 21, 22, fps)} />
			</Beat>
			<Beat name="もうひとつの宝の話" captions={c} from={24}>
				<Photo id="nanmadol-m" move="out" label="もうひとつの宝の話" />
			</Beat>
		</SceneFrame>
	);
};
