import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {NestBells} from '../components/IzumoArt2';
import {Cards, Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9KamoCaptions as c} from '../data/captions';

// 加茂岩倉の銅鐸は、すべて出雲で作られた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue9Kamo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Kamo" label="第9の手がかり" title="加茂岩倉の銅鐸は、すべて出雲で作られた？">
			<Beat name="1996年10月14日" captions={c} from={0} to={2}>
				<Photo id="kamo-site-1" move="in" label="1996年10月14日" />
			</Beat>
			<Beat name="その数は？" captions={c} from={3} to={4}>
				<Photo id="kamo-dotaku-display-1" move="in" label="その数は？" />
			</Beat>
			<Beat name="大きさは？" captions={c} from={5} to={5}>
				<Stage label="大きさは？">
					<Figures figs={[{value: '20', label: '個', small: '高さ45cmほど'}, {value: '19', label: '個', small: '高さ30cmほど'}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="不思議な埋め方" captions={c} from={6} to={8}>
				<Stage label="不思議な埋め方">
					<NestBells />
				</Stage>
			</Beat>
			<Beat name="国宝に" captions={c} from={9} to={9}>
				<Photo id="kamo-dotaku-18" move="in" label="国宝に" />
			</Beat>
			<Beat name="表面には、絵が" captions={c} from={10} to={10}>
				<Photo id="dotaku-kagawa" move="in" label="表面には、絵が" />
			</Beat>
			<Beat name="どこで作られた？" captions={c} from={11} to={12}>
				<Photo id="dotaku-mold" move="in" label="どこで作られた？" />
			</Beat>
			<Beat name="同じ鋳型の兄弟は、どこに？" captions={c} from={13} to={15}>
				<Stage label="同じ鋳型の兄弟は、どこに？" labelBottom>
					<ReliefMap view='nihonkai' focus={[134.5, 35.0]} zoom={1.3} pins={[{at: P.kamo, name: '加茂岩倉', big: true, t: 6}, {at: P.tajima, name: '但馬', t: 30, dy: -30}, {at: P.awaji, name: '淡路', t: 36}, {at: P.osaka, name: '大阪', t: 42, dx: 60}, {at: P.wakayama, name: '和歌山', t: 48, dy: 60}, {at: P.tokushima, name: '徳島', t: 54, dy: 60}, {at: P.tottori, name: '鳥取', t: 60}, {at: P.fukui, name: '福井', t: 66}]} lines={[{pts: [P.kamo, P.tajima], t: 30, dash: true}, {pts: [P.kamo, P.awaji], t: 36, dash: true}, {pts: [P.kamo, P.osaka], t: 42, dash: true}, {pts: [P.kamo, P.wakayama], t: 48, dash: true}, {pts: [P.kamo, P.tokushima], t: 54, dash: true}, {pts: [P.kamo, P.tottori], t: 60, dash: true}, {pts: [P.kamo, P.fukui], t: 66, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="どこで作られた？" captions={c} from={16} to={17}>
				<Stage label="どこで作られた？">
					<Cards cards={[{head: '多くは', body: '近畿で\n作られた？', tone: 'gold'}, {head: '一部は', body: '出雲で\n作られた？', tone: 'dark'}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="2つの谷は、関係がある？" captions={c} from={21}>
				<Photo id="kamo-dotaku-35" move="in" label="2つの谷は、関係がある？" />
			</Beat>
		</SceneFrame>
	);
};
