import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {ClayCasing, ShieldMirror} from '../components/TomioArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5MirrorCaptions as c} from '../data/captions';

// 盾の形の鏡は、中国から来た？（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Clue5Mirror = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Mirror" label="第5の手がかり" title="盾の形の鏡は、中国から来た？">
			<Beat name="剣のすぐ下から" captions={c} from={0} to={1}>
				<Stage label="剣のすぐ下から">
					<ShieldMirror />
				</Stage>
			</Beat>
			<Beat name="斜めに立てかけて" captions={c} from={2} to={3}>
				<Stage label="斜めに立てかけて">
					<ClayCasing mirrorFocus />
				</Stage>
			</Beat>
			<Beat name="鼉龍とは？" captions={c} from={4} to={5}>
				<Photo id="mokusei-tate" move="in" label="鼉龍とは？" />
			</Beat>
			<Beat name="中国の鏡？" captions={c} from={6} to={6}>
				<Photo id="han-animals" move="in" label="中国の鏡？" />
			</Beat>
			<Beat name="日本で作られた？" captions={c} from={7} to={8}>
				<Photo id="naiko-shimoike" move="in" label="日本で作られた？" />
			</Beat>
			<Beat name="身を守る道具" captions={c} from={9} to={9}>
				<Photo id="tate-haniwa-muro" move="in" label="身を守る道具" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="棺の中には？" captions={c} from={13}>
				<Photo id="tate-haniwa-tsuka" move="in" label="棺の中には？" />
			</Beat>
		</SceneFrame>
	);
};
