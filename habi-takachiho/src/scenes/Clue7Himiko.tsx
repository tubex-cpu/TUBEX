import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7HimikoCaptions as c} from '../data/captions';

// 天照大神の正体は、卑弥呼だと証明された？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue7Himiko = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Himiko" label="第7の手がかり" title="天照大神の正体は、卑弥呼だと証明された？">
			<Beat name="邪馬台国の女王" captions={c} from={0} to={1}>
				<Photo id="gen-himiko" move="in" label="邪馬台国の女王" />
			</Beat>
			<Beat name="魏志倭人伝によれば" captions={c} from={2} to={2}>
				<Photo id="hashihaka" move="in" label="魏志倭人伝によれば" />
			</Beat>
			<Beat name="似ている二人？" captions={c} from={3} to={4}>
				<Photo id="gen-two-queens" move="in" label="似ている二人？" />
			</Beat>
			<Beat name="白鳥庫吉（1910年の論文）" captions={c} from={5} to={6}>
				<Photo id="real-shiratori-portrait" move="in" label="白鳥庫吉（1910年の論文）" />
			</Beat>
			<Beat name="大きな壁" captions={c} from={7} to={9}>
				<Stage label="大きな壁">
					<Cards cards={[{head: '古事記・日本書紀', body: '卑弥呼の名は\n出てこない', tone: 'dark'}, {head: '魏志倭人伝', body: '天照大神の名は\n出てこない', tone: 'dark'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="揺れ動く計算" captions={c} from={10} to={10}>
				<Photo id="ecl-sequence" move="in" label="揺れ動く計算" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="岩戸の前で舞った神" captions={c} from={14}>
				<Photo id="art-okame" move="in" label="岩戸の前で舞った神" />
			</Beat>
		</SceneFrame>
	);
};
