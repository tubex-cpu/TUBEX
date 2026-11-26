import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9MeiCaptions as c} from '../data/captions';

// 鏡には、銅は徐州から、職人は洛陽からと書いてある？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue9Mei = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Mei" label="第9の手がかり" title="鏡には、銅は徐州から、職人は洛陽からと書いてある？">
			<Beat name="黒塚の鏡の銘文" captions={c} from={0} to={0}>
				<Photo id="c12-kurozuka-museum-mirrors" move="in" label="黒塚の鏡の銘文" />
			</Beat>
			<Beat name="鏡が名乗る故郷" captions={c} from={1} to={2}>
				<Stage label="鏡が名乗る故郷">
					<Cards cards={[{head: '銅出徐州', body: '銅は徐州から'}, {head: '師出洛陽', body: '職人は洛陽から', tone: 'gold'}]} tone='bronze' size={50} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="魏の材料と職人" captions={c} from={3} to={4}>
				<Stage label="魏の材料と職人" labelBottom>
					<ReliefMap view='eastasia' zoom={1.1} focus={P.rakuyo} pins={[{at: P.rakuyo, name: '洛陽', sub: '魏の都', big: true, t: 6}]} />
				</Stage>
			</Beat>
			<Beat name="書いてあることは本当か" captions={c} from={5} to={6}>
				<Photo id="c09-koganezuka-ryuko" move="in" label="書いてあることは本当か" />
			</Beat>
			<Beat name="ぎこちない銘文？" captions={c} from={7} to={7}>
				<Photo id="c09-xiwangmu-relief" move="in" label="ぎこちない銘文？" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="科学の分析なら？" captions={c} from={11}>
				<Photo id="c10-galena" move="in" label="科学の分析なら？" />
			</Beat>
		</SceneFrame>
	);
};
