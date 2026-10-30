import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Galley, LanternGame, SternHalf, ThreeNations, TinyPieces} from '../components/GenkoArt4';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue17GamesCaptions as c} from '../data/captions';

// 元の兵士は、戦うだけの集団だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue17Games = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue17Games" label="第17の手がかり" title="元の兵士は、戦うだけの集団だった？">
			<Beat name="2026年10月、国をこえた調査" captions={c} from={0} to={2}>
				<Stage label="2026年10月、国をこえた調査">
					<ThreeNations />
				</Stage>
			</Beat>
			<Beat name="3号船の正体は？" captions={c} from={3} to={7}>
				<Stage label="3号船の正体は？">
					<SternHalf />
				</Stage>
			</Beat>
			<Beat name="船の中から、何が？" captions={c} from={8} to={12}>
				<Stage label="船の中から、何が？">
					<TinyPieces />
				</Stage>
			</Beat>
			<Beat name="すぐそばには？" captions={c} from={13} to={15}>
				<Stage label="すぐそばには？">
					<Galley />
				</Stage>
			</Beat>
			<Beat name="船の中の暮らし" captions={c} from={16} to={19}>
				<Stage label="船の中の暮らし">
					<LanternGame />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="勝った日本の側は？" captions={c} from={23}>
				<Photo id="kameyama-statue-3" move="in" label="勝った日本の側は？" />
			</Beat>
		</SceneFrame>
	);
};
