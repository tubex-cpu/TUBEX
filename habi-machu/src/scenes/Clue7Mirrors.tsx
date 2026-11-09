import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {MirrorAges} from '../components/TomioArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7MirrorsCaptions as c} from '../data/captions';

// 棺の中の鏡は、古墳と同じ時代のもの？（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Clue7Mirrors = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Mirrors" label="第7の手がかり" title="棺の中の鏡は、古墳と同じ時代のもの？">
			<Beat name="2024年3月の発表" captions={c} from={0} to={1}>
				<Photo id="gangoji-lab" move="in" label="2024年3月の発表" />
			</Beat>
			<Beat name="竹の櫛と、赤い朱" captions={c} from={2} to={3}>
				<Photo id="kushi" move="in" label="竹の櫛と、赤い朱" />
			</Beat>
			<Beat name="中国で作られた鏡" captions={c} from={4} to={5}>
				<Photo id="hokaku-terado" move="in" label="中国で作られた鏡" />
			</Beat>
			<Beat name="三角縁神獣鏡" captions={c} from={6} to={6}>
				<Photo id="sankaku-kanisawa" move="in" label="三角縁神獣鏡" />
			</Beat>
			<Beat name="虺龍文鏡" captions={c} from={7} to={7}>
				<Photo id="han-gameboard" move="in" label="虺龍文鏡" />
			</Beat>
			<Beat name="画像鏡" captions={c} from={8} to={8}>
				<Photo id="gazokyo-samita" move="in" label="画像鏡" />
			</Beat>
			<Beat name="古墳より、何年古い？" captions={c} from={9} to={10}>
				<Stage label="古墳より、何年古い？">
					<MirrorAges />
				</Stage>
			</Beat>
			<Beat name="墓の主は、有力者？" captions={c} from={11} to={11}>
				<Photo id="han-met-b" move="in" label="墓の主は、有力者？" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="どんな人物だった？" captions={c} from={15}>
				<Photo id="cinnabar" move="in" label="どんな人物だった？" />
			</Beat>
		</SceneFrame>
	);
};
