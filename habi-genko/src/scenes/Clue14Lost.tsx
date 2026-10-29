import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {KofunCount, LostTimeline, SaveCampaign} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue14LostCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 百舌鳥古墳群は、昔のまま残っている？（素材はすべてこの場面だけで使う）
export const Clue14Lost = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue14Lost" label="第14の手がかり" title="百舌鳥古墳群は、昔のまま残っている？">
			<Beat name="世界遺産の古墳群" captions={c} from={0} to={0}>
				<Photo id="nagatsuka" label="世界遺産の古墳群" />
			</Beat>
			<Beat name="KofunCount" captions={c} from={1} to={2}>
				<Visual label="いくつ、残っている？">
					<KofunCount />
				</Visual>
			</Beat>
			<Beat name="LostTimeline" captions={c} from={3} to={5}>
				<Visual label="いつ、消えた？">
					<LostTimeline />
				</Visual>
			</Beat>
			<Beat name="消えた大塚山古墳" captions={c} from={6} to={7}>
				<Photo id="otsukayama-beads" label="消えた大塚山古墳" />
			</Beat>
			<Beat name="最後に消えた古墳" captions={c} from={8} to={9}>
				<Photo id="moat-13" label="最後に消えた古墳" />
			</Beat>
			<Beat name="市民が守った古墳" captions={c} from={10} to={11}>
				<Photo id="itasuke" move="out" label="市民が守った古墳" />
			</Beat>
			<Beat name="こわされそうになった" captions={c} from={12} to={13}>
				<Photo id="itasuke-2026" label="こわされそうになった" />
			</Beat>
			<Beat name="SaveCampaign" captions={c} from={14} to={15}>
				<Visual label="立ち上がったのは？">
					<SaveCampaign />
				</Visual>
			</Beat>
			<Beat name="運動の記念" captions={c} from={16} to={17}>
				<Photo id="itasuke-2" label="運動の記念" />
			</Beat>
			<Beat name="タヌキが見られる？" captions={c} from={18} to={18}>
				<Photo id="tanuki" label="タヌキが見られる？" />
			</Beat>
			<Beat name="濠の水は、何のため？" captions={c} from={19} to={21}>
				<Photo id="moat-12" label="濠の水は、何のため？" />
			</Beat>
			<Beat name="判決" captions={c} from={22} to={24}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 22, 23, fps)} />
			</Beat>
			<Beat name="世界遺産で、何が変わった" captions={c} from={25}>
				<Photo id="haniwa-house" label="世界遺産で、何が変わった？" />
			</Beat>
		</SceneFrame>
	);
};
