import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {DriftApart, FixedContinents, LemurPuzzle, LemuriaBridge, PlateAccepted} from '../components/MuArt4';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue16LemuriaCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 科学者も、海に沈んだ大陸を信じていた？（素材はすべてこの場面だけで使う）
export const Clue16Lemuria = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue16Lemuria" label="第16の手がかり" title="科学者も、海に沈んだ大陸を信じていた？">
			<Beat name="LemuriaBridge" captions={c} from={0} to={2}>
				<Visual label="もうひとつの消えた大陸">
					<LemuriaBridge />
				</Visual>
			</Beat>
			<Beat name="レムールの化石" captions={c} from={3} to={5}>
				<Photo id="lemur" move="out" label="レムールの化石" />
			</Beat>
			<Beat name="LemurPuzzle" captions={c} from={6} to={7}>
				<Visual label="沈んだ陸の橋？">
					<LemurPuzzle />
				</Visual>
			</Beat>
			<Beat name="FixedContinents" captions={c} from={8} to={9}>
				<Visual label="動かない大陸">
					<FixedContinents />
				</Visual>
			</Beat>
			<Beat name="人類の故郷？" captions={c} from={10} to={10}>
				<Photo id="madagascar" move="out" label="人類の故郷？" />
			</Beat>
			<Beat name="ヴェーゲナー" captions={c} from={11} to={12}>
				<Photo id="wegener" label="ヴェーゲナー" />
			</Beat>
			<Beat name="DriftApart" captions={c} from={13} to={14}>
				<Visual label="大陸が、動く">
					<DriftApart />
				</Visual>
			</Beat>
			<Beat name="PlateAccepted" captions={c} from={15} to={17}>
				<Visual label="プレートテクトニクス">
					<PlateAccepted />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="太平洋の海の底へ" captions={c} from={21}>
				<Photo id="pacific-sea" move="out" label="太平洋の海の底へ" />
			</Beat>
		</SceneFrame>
	);
};
