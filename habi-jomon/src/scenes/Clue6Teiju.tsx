import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6TeijuCaptions as c} from '../data/captions';

// 縄文人は、移動しながら暮らしていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue6Teiju = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Teiju" label="第6の手がかり" title="縄文人は、移動しながら暮らしていた？">
			<Beat name="狩りと採集の民は" captions={c} from={0} to={0}>
				<Stage label="狩りと採集の民は">
					<Flow steps={[{head: '獲物を追う'}, {head: '移り住む'}, {head: 'また移る', dim: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="ところが" captions={c} from={1} to={1}>
				<Photo id="c06-uenohara-pots" move="in" label="ところが" />
			</Beat>
			<Beat name="南九州の台地" captions={c} from={2} to={2}>
				<Stage label="南九州の台地" labelBottom>
					<ReliefMap view='kyushu' zoom={1.1} focus={P.uenohara} pins={[{at: P.uenohara, name: '上野原遺跡', sub: '鹿児島県 約1万年前', big: true, t: 8}]} />
				</Stage>
			</Beat>
			<Beat name="1700年続いた村" captions={c} from={3} to={3}>
				<Photo id="c06-sannai-tower" move="in" label="1700年続いた村" />
			</Beat>
			<Beat name="世界でも珍しい" captions={c} from={4} to={4}>
				<Photo id="c06-sannai-longhouse-in" move="left" label="世界でも珍しい" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="住み続けられた理由" captions={c} from={8}>
				<Photo id="c07-chestnut-burrs" move="in" label="住み続けられた理由" />
			</Beat>
		</SceneFrame>
	);
};
