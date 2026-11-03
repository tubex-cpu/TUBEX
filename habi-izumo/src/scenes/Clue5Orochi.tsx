import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {OrochiRiver, TataraFlow} from '../components/IzumoArt1';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5OrochiCaptions as c} from '../data/captions';

// ヤマタノオロチは、暴れ川だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue5Orochi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Orochi" label="第5の手がかり" title="ヤマタノオロチは、暴れ川だった？">
			<Beat name="肥の河のほとりで" captions={c} from={0} to={1}>
				<Photo id="orochi-print-old" move="in" label="肥の河のほとりで" />
			</Beat>
			<Beat name="最後の娘の番" captions={c} from={2} to={3}>
				<Photo id="kagura-orochi-2" move="in" label="最後の娘の番" />
			</Beat>
			<Beat name="酒に酔った大蛇" captions={c} from={4} to={6}>
				<Photo id="kagura-orochi-1" move="in" label="酒に酔った大蛇" />
			</Beat>
			<Beat name="三種の神器の一つ" captions={c} from={7} to={7}>
				<Photo id="orochi-chikanobu" move="in" label="三種の神器の一つ" />
			</Beat>
			<Beat name="オロチの正体は？" captions={c} from={8} to={8}>
				<Photo id="hii-river-1" move="in" label="オロチの正体は？" />
			</Beat>
			<Beat name="八つの頭は、川の流れ？" captions={c} from={9} to={12}>
				<Stage label="八つの頭は、川の流れ？">
					<OrochiRiver />
				</Stage>
			</Beat>
			<Beat name="もう一つの説" captions={c} from={13} to={14}>
				<Photo id="iron-sand" move="in" label="もう一つの説" />
			</Beat>
			<Beat name="砂鉄から、鉄へ" captions={c} from={15} to={15}>
				<Stage label="砂鉄から、鉄へ">
					<TataraFlow />
				</Stage>
			</Beat>
			<Beat name="時代は、合う？" captions={c} from={16} to={17}>
				<Photo id="okuizumo-loop" move="in" label="時代は、合う？" />
			</Beat>
			<Beat name="確かめられた説？" captions={c} from={18} to={18}>
				<Photo id="okuizumo-gorge" move="in" label="確かめられた説？" />
			</Beat>
			<Beat name="2026年10月から" captions={c} from={19} to={19}>
				<Photo id="museum-ext-2" move="in" label="2026年10月から" />
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="本当に、大きな国は？" captions={c} from={23}>
				<Photo id="unnan-hills" move="in" label="本当に、大きな国は？" />
			</Beat>
		</SceneFrame>
	);
};
