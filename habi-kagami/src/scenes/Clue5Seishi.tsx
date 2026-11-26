import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5SeishiCaptions as c} from '../data/captions';

// 鏡が届いた年、正始元年の鏡もある？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue5Seishi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Seishi" label="第5の手がかり" title="鏡が届いた年、正始元年の鏡もある？">
			<Beat name="遠く離れた三つの古墳" captions={c} from={0} to={1}>
				<Stage label="遠く離れた三つの古墳" labelBottom>
					<ReliefMap view='honshu' zoom={1.04} pins={[{at: P.kanisawa, name: '蟹沢古墳', sub: '群馬', t: 6}, {at: P.morio, name: '森尾古墳', sub: '兵庫', t: 24}, {at: P.takeshima, name: '竹島の古墳', sub: '山口', t: 42}]} />
				</Stage>
			</Beat>
			<Beat name="欠けた1文字" captions={c} from={2} to={4}>
				<Stage label="欠けた1文字">
					<Cards cards={[{head: '正なら', body: '正始元年\n240年 魏', tone: 'red'}, {head: '泰なら', body: '泰始元年\n265年 西晋'}]} tone='bronze' size={50} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="欠けた文字を補い合う" captions={c} from={5} to={6}>
				<Photo id="c05-kanisawa-mirror" move="in" label="欠けた文字を補い合う" />
			</Beat>
			<Beat name="桜井茶臼山古墳" captions={c} from={7} to={7}>
				<Photo id="c05-chausuyama-coffin" move="in" label="桜井茶臼山古墳" />
			</Beat>
			<Beat name="是の1文字" captions={c} from={8} to={9}>
				<Photo id="c05-chausuyama-3d" move="in" label="是の1文字" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="卑弥呼の年号がそろった" captions={c} from={13} to={13}>
				<Stage label="卑弥呼の年号がそろった">
					<Figures figs={[{value: '239年', label: '景初三年 1枚'}, {value: '240年', label: '正始元年 3枚', accent: true}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="存在しない年号？" captions={c} from={14}>
				<Photo id="c06-hiromine15" move="in" label="存在しない年号？" />
			</Beat>
		</SceneFrame>
	);
};
