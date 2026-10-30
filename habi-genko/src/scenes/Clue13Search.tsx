import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {DiverDredge, Magnetometer, MurkyDive, PhotoMosaic, SonarScan, TetheredROV} from '../components/GenkoArt4';
import {Figures} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue13SearchCaptions as c} from '../data/captions';

// 海の底の船は、潜って探せば見つかる？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue13Search = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue13Search" label="第13の手がかり" title="海の底の船は、潜って探せば見つかる？">
			<Beat name="潜れば、見つかる？" captions={c} from={0} to={3}>
				<Stage label="潜れば、見つかる？">
					<MurkyDive />
				</Stage>
			</Beat>
			<Beat name="音で、泥の下を探る" captions={c} from={4} to={7}>
				<Stage label="音で、泥の下を探る">
					<SonarScan />
				</Stage>
			</Beat>
			<Beat name="金属に反応する探査" captions={c} from={8} to={8}>
				<Stage label="金属に反応する探査">
					<Magnetometer />
				</Stage>
			</Beat>
			<Beat name="泥を、少しずつ" captions={c} from={9} to={10}>
				<Stage label="泥を、少しずつ">
					<DiverDredge />
				</Stage>
			</Beat>
			<Beat name="写真から、立体の姿を" captions={c} from={11} to={11}>
				<Stage label="写真から、立体の姿を">
					<PhotoMosaic />
				</Stage>
			</Beat>
			<Beat name="無人の潜水機" captions={c} from={12} to={12}>
				<Stage label="無人の潜水機">
					<TetheredROV />
				</Stage>
			</Beat>
			<Beat name="引き揚げたものを調べる" captions={c} from={13} to={16}>
				<Photo id="anchor-mouko-2" move="in" label="引き揚げたものを調べる" />
			</Beat>
			<Beat name="海の中の遺跡は、どれだけ？" captions={c} from={17} to={19}>
				<Stage label="海の中の遺跡は、どれだけ？">
					<Figures figs={[{value: '47万', label: 'か所', small: '日本の遺跡'}, {value: '400', label: 'か所', small: '海や湖の中の遺跡', accent: true}]} tone='sea' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="どんな船だった？" captions={c} from={23}>
				<Photo id="anchorstone-shotenji" move="in" label="どんな船だった？" />
			</Beat>
		</SceneFrame>
	);
};
