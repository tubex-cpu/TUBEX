import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9SenguCaptions as c} from '../data/captions';

// 伊勢神宮の遷宮の木は、伊勢の山から伐り出される？（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Clue9Sengu = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Sengu" label="第9の手がかり" title="伊勢神宮の遷宮の木は、伊勢の山から伐り出される？">
			<Beat name="20年に一度の遷宮" captions={c} from={0} to={1}>
				<Photo id="sengu-2013" move="in" label="20年に一度の遷宮" />
			</Beat>
			<Beat name="準備は、もう始まっている" captions={c} from={2} to={2}>
				<Photo id="geku-kodenchi" move="in" label="準備は、もう始まっている" />
			</Beat>
			<Beat name="木曽の山で" captions={c} from={3} to={5}>
				<Photo id="hinoki-goshinboku" move="in" label="木曽の山で" />
			</Beat>
			<Beat name="伊勢へ運び込まれる" captions={c} from={6} to={6}>
				<Photo id="okihiki-hoeisha" move="in" label="伊勢へ運び込まれる" />
			</Beat>
			<Beat name="2026年、お木曳" captions={c} from={7} to={8}>
				<Photo id="okihiki-okabiki" move="in" label="2026年、お木曳" />
			</Beat>
			<Beat name="五十鈴川の川曳" captions={c} from={9} to={9}>
				<Photo id="okihiki-kawabiki-w" move="scroll" label="五十鈴川の川曳" />
			</Beat>
			<Beat name="伊勢の森の木は？" captions={c} from={10} to={11}>
				<Photo id="aramatsuri-old-new" move="in" label="伊勢の森の木は？" />
			</Beat>
			<Beat name="木曽から、伊勢へ" captions={c} from={12} to={12}>
				<Stage label="木曽から、伊勢へ">
					<TimeBar stops={[{label: '2025年5月', sub: '山口祭'}, {label: '2025年6月', sub: '御杣始祭\n（木曽）', accent: true}, {label: '2026年4月', sub: 'お木曳'}, {label: '2026年8月', sub: '川曳'}, {label: '2033年', sub: '遷宮'}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
		</SceneFrame>
	);
};
