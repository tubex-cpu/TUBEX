import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Relations} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue11SanjigenCaptions as c} from '../data/captions';

// 中国製と日本製の三角縁神獣鏡は、はっきり見分けられる？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue11Sanjigen = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue11Sanjigen" label="第11の手がかり" title="中国製と日本製の三角縁神獣鏡は、はっきり見分けられる？">
			<Beat name="二つに分けてきた" captions={c} from={0} to={1}>
				<Stage label="二つに分けてきた">
					<Cards cards={[{head: '中国製とされた鏡', body: '文様がくっきり'}, {head: '日本製とされた鏡', body: '文様がぼやけ\n文字がくずれる', tone: 'gold'}]} tone='bronze' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="三次元で記録する" captions={c} from={2} to={2}>
				<Photo id="c11-3d-scanning" move="in" label="三次元で記録する" />
			</Beat>
			<Beat name="同じ鋳型の傷" captions={c} from={3} to={4}>
				<Photo id="c11-tsubai-19" move="in" label="同じ鋳型の傷" />
			</Beat>
			<Beat name="どちらか一方？" captions={c} from={5} to={5}>
				<Stage label="どちらか一方？">
					<Relations nodes={[{id: 'k', x: 560, y: 520, name: '中国製とされた鏡'}, {id: 'w', x: 1360, y: 520, name: '日本製とされた鏡'}, {id: 'm', x: 960, y: 800, name: '同じ鋳型の傷', hot: true}]} edges={[{a: 'k', b: 'm'}, {a: 'w', b: 'm'}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="墓の中では" captions={c} from={9}>
				<Photo id="c12-kurozuka-funkyu" move="in" label="墓の中では" />
			</Beat>
		</SceneFrame>
	);
};
