import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {BellGrowth} from '../components/IzumoArt2';
import {Cards, Figures} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue11BurialCaptions as c} from '../data/captions';

// 青銅器は、敵から隠すために埋められた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue11Burial = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue11Burial" label="第11の手がかり" title="青銅器は、敵から隠すために埋められた？">
			<Beat name="なぜ、谷の斜面に？" captions={c} from={0} to={3}>
				<Stage label="なぜ、谷の斜面に？">
					<Figures figs={[{value: '358', label: '本の銅剣', small: '荒神谷'}, {value: '22', label: '個・本', small: '荒神谷の銅鐸と銅矛'}, {value: '39', label: '個の銅鐸', small: '加茂岩倉', accent: true}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="埋めた理由は？" captions={c} from={4} to={10}>
				<Stage label="埋めた理由は？">
					<Cards cards={[{head: '隠した', body: '攻められる前に\n一時的に', tone: 'red'}, {head: '禁じられた', body: '祭りを\nやめさせられ', tone: 'dark'}, {head: '捧げた', body: '大地の神に\n祈って', tone: 'gold'}, {head: 'しまっておいた', body: '祭りのときだけ\n掘り出す', tone: 'dark'}]} tone='bronze' size={38} />
				</Stage>
			</Beat>
			<Beat name="注目されていること" captions={c} from={11} to={13}>
				<Stage label="注目されていること">
					<BellGrowth />
				</Stage>
			</Beat>
			<Beat name="終わりの合図？" captions={c} from={14} to={14}>
				<Photo id="dotaku-late-large" move="in" label="終わりの合図？" />
			</Beat>
			<Beat name="判決" captions={c} from={15} to={17}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 15, 16, fps)} />
			</Beat>
			<Beat name="何を祭るようになった？" captions={c} from={18}>
				<Photo id="nishidani-mound" move="in" label="何を祭るようになった？" />
			</Beat>
		</SceneFrame>
	);
};
