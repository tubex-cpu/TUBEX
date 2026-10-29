import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {EasterMap, FacingClaim, FacingVillage, MountainTop, WatchOrBarrier} from '../components/MuArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue9MoaiCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// モアイは、沈んだ大陸を見張っている？（素材はすべてこの場面だけで使う）
export const Clue9Moai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Moai" label="第9の手がかり" title="モアイは、沈んだ大陸を見張っている？">
			<Beat name="イースター島、ラパ・ヌイ" captions={c} from={0} to={0}>
				<Photo id="rapanui-land" move="out" label="イースター島、ラパ・ヌイ" />
			</Beat>
			<Beat name="EasterMap" captions={c} from={1} to={2}>
				<Visual label="太平洋にぽつんと">
					<EasterMap />
				</Visual>
			</Beat>
			<Beat name="900体以上の巨大な石像" captions={c} from={3} to={3}>
				<Photo id="tongariki-b" label="900体以上の巨大な石像" />
			</Beat>
			<Beat name="MountainTop" captions={c} from={4} to={5}>
				<Visual label="大陸の山の頂？">
					<MountainTop />
				</Visual>
			</Beat>
			<Beat name="FacingClaim" captions={c} from={6} to={7}>
				<Visual label="海に背を向ける">
					<FacingClaim />
				</Visual>
			</Beat>
			<Beat name="WatchOrBarrier" captions={c} from={8} to={10}>
				<Visual label="何を見張っている？">
					<WatchOrBarrier />
				</Visual>
			</Beat>
			<Beat name="本当に、内陸を向いている" captions={c} from={11} to={14}>
				<Photo id="tongariki-c" move="left" label="本当に、内陸を向いている" />
			</Beat>
			<Beat name="一族の祖先の姿" captions={c} from={15} to={16}>
				<Photo id="moai-akahanga" label="一族の祖先の姿" />
			</Beat>
			<Beat name="FacingVillage" captions={c} from={17} to={19}>
				<Visual label="見つめていたのは、村">
					<FacingVillage />
				</Visual>
			</Beat>
			<Beat name="海を見る7体" captions={c} from={20} to={22}>
				<Photo id="akivi" label="海を見る7体" />
			</Beat>
			<Beat name="ラノ・ララク" captions={c} from={23} to={24}>
				<Photo id="raraku-south" move="out" label="ラノ・ララク" />
			</Beat>
			<Beat name="造りかけのモアイ" captions={c} from={25} to={26}>
				<Photo id="raraku-moai" label="造りかけのモアイ" />
			</Beat>
			<Beat name="判決" captions={c} from={27} to={29}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 27, 28, fps)} />
			</Beat>
			<Beat name="どうやって運んだ？" captions={c} from={30}>
				<Photo id="tongariki-d" move="out" label="どうやって運んだ？" />
			</Beat>
		</SceneFrame>
	);
};
