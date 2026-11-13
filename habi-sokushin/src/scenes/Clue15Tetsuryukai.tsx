import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue15TetsuryukaiCaptions as c} from '../data/captions';

// 鉄竜海上人の体は、自然にミイラになった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue15Tetsuryukai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue15Tetsuryukai" label="第15の手がかり" title="鉄竜海上人の体は、自然にミイラになった？">
			<Beat name="修行を途中でやめた行者" captions={c} from={0} to={1}>
				<Photo id="haguro-saikan" move="in" label="修行を途中でやめた行者" />
			</Beat>
			<Beat name="夢枕に立った" captions={c} from={2} to={3}>
				<Photo id="kesa-cleveland" move="in" label="夢枕に立った" />
			</Beat>
			<Beat name="内臓を取り出し、石灰を詰めた" captions={c} from={4} to={5}>
				<Photo id="quicklime" move="in" label="内臓を取り出し、石灰を詰めた" />
			</Beat>
			<Beat name="専門の知識を持つ者の手" captions={c} from={6} to={6}>
				<Photo id="kahaku-inside" move="in" label="専門の知識を持つ者の手" />
			</Beat>
			<Beat name="重さの違い" captions={c} from={7} to={7}>
				<Stage label="重さの違い">
					<Figures figs={[{value: '4〜7kg', label: 'ほかの即身仏'}, {value: '15kg', label: '石灰を詰めた鉄竜海', accent: true}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="ほかの即身仏は？" captions={c} from={11}>
				<Photo id="yomogi-aizu" move="in" label="ほかの即身仏は？" />
			</Beat>
		</SceneFrame>
	);
};
