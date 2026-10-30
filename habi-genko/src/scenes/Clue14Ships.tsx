import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {CrowdedBay, DoublePlank, HullSection, KeelJoint, SugarSoak} from '../components/GenkoArt4';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue14ShipsCaptions as c} from '../data/captions';

// 元の船は、急いで造った手抜きの船だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue14Ships = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue14Ships" label="第14の手がかり" title="元の船は、急いで造った手抜きの船だった？">
			<Beat name="急いで造った船？" captions={c} from={0} to={2}>
				<Photo id="anchorstone-kushida-2" move="in" label="急いで造った船？" />
			</Beat>
			<Beat name="高麗の船ではなかった？" captions={c} from={3} to={6}>
				<Stage label="高麗の船ではなかった？">
					<HullSection />
				</Stage>
			</Beat>
			<Beat name="船の底を調べると？" captions={c} from={7} to={8}>
				<Stage label="船の底を調べると？">
					<DoublePlank />
				</Stage>
			</Beat>
			<Beat name="2025年の新発見" captions={c} from={9} to={12}>
				<Stage label="2025年の新発見">
					<KeelJoint />
				</Stage>
			</Beat>
			<Beat name="碇石" captions={c} from={13} to={14}>
				<Photo id="anchorstone-kushida-1-w" move="scroll" label="碇石" />
			</Beat>
			<Beat name="木の形を、どう守る？" captions={c} from={15} to={17}>
				<Stage label="木の形を、どう守る？">
					<SugarSoak />
				</Stage>
			</Beat>
			<Beat name="当時の中国の造船技術" captions={c} from={18} to={20}>
				<Photo id="sinan-1" move="in" label="当時の中国の造船技術" />
			</Beat>
			<Beat name="狭い湾に、何百隻も" captions={c} from={21} to={21}>
				<Stage label="狭い湾に、何百隻も">
					<CrowdedBay />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={22} to={24}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 22, 23, fps)} />
			</Beat>
			<Beat name="乗っていたのは、どんな人？" captions={c} from={25}>
				<Photo id="lion-mouko" move="in" label="乗っていたのは、どんな人？" />
			</Beat>
		</SceneFrame>
	);
};
