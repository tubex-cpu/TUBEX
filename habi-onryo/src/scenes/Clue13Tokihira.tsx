import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {Scroll} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue13TokihiraCaptions as c} from '../data/captions';

// 道真を追い落とした藤原時平は、道真の祟りで若死にした？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue13Tokihira = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue13Tokihira" label="第13の手がかり" title="道真を追い落とした藤原時平は、道真の祟りで若死にした？">
			<Beat name="大宰府での暮らし" captions={c} from={0} to={0}>
				<Photo id="tofuro-field" move="in" label="大宰府での暮らし" />
			</Beat>
			<Beat name="903年2月25日" captions={c} from={1} to={1}>
				<Photo id="enokisha" move="in" label="903年2月25日" />
			</Beat>
			<Beat name="都を去るときの歌" captions={c} from={2} to={2}>
				<Stage label="都を去るときの歌">
					<Scroll text={'東風吹かば\nにほひおこせよ\n梅の花\n主なしとて\n春な忘れそ'} source='『拾遺和歌集』' />
				</Stage>
			</Beat>
			<Beat name="次々と起きた不幸" captions={c} from={3} to={4}>
				<Stage label="次々と起きた不幸">
					<TimeBar stops={[{label: '908年', sub: '藤原菅根'}, {label: '909年', sub: '藤原時平 39歳', accent: true}, {label: '913年', sub: '源光'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="祟りとされたのは、いつ？" captions={c} from={5} to={6}>
				<Photo id="engi-tokihira-dying" move="in" label="祟りとされたのは、いつ？" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="道真の霊を恐れたのは" captions={c} from={10}>
				<Photo id="michizane-tenpai" move="in" label="道真の霊を恐れたのは" />
			</Beat>
		</SceneFrame>
	);
};
