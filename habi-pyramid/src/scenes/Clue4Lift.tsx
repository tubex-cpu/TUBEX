import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {BlockRate, CounterweightGallery, EdgeRamp, InsideOut, RampTheory, WetSand} from '../components/PyramidArt2';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue4LiftCaptions as c} from '../data/captions';

// 第4の手がかり 重りと滑車で持ち上げた？（素材はすべてこの場面だけで使う）
export const Clue4Lift = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Lift" label="第4の手がかり" title="重りと滑車で持ち上げた？">
			<Beat name="石切り場" captions={c} from={0} to={0}>
				<Photo id="tura-lepsius" label="230万個の石は、どこから？" />
			</Beat>
			<Beat name="アスワン" captions={c} from={1} to={1}>
				<Photo id="aswan-quarry" move="right" label="800キロ南から運ばれた石" />
			</Beat>
			<Beat name="ペース" captions={c} from={2} to={3}>
				<Visual label="いったい、どんなペースで？">
					<BlockRate />
				</Visual>
			</Beat>
			<Beat name="坂道" captions={c} from={4} to={4}>
				<Visual label="坂道とそりで、引き上げた？">
					<RampTheory />
				</Visual>
			</Beat>
			<Beat name="ハトヌブ" captions={c} from={5} to={7}>
				<Photo id="hatnub" move="left" label="2018年、石切り場で見つかった跡" />
			</Beat>
			<Beat name="壁画" captions={c} from={8} to={9}>
				<Photo id="djehutihotep" label="そりの前の人は、何をしている？" />
			</Beat>
			<Beat name="濡れた砂" captions={c} from={10} to={10}>
				<Visual label="砂に水をかけると？">
					<WetSand />
				</Visual>
			</Beat>
			<Beat name="高く積む" captions={c} from={11} to={12}>
				<Photo id="cheops-laskar3" move="out" label="問題は、高く積む方法" />
			</Beat>
			<Beat name="内側から" captions={c} from={13} to={14}>
				<Visual label="内側から、外へ？">
					<InsideOut />
				</Visual>
			</Beat>
			<Beat name="大回廊" captions={c} from={15} to={16}>
				<Photo id="grand-gallery" label="斜めにのぼる、大回廊" />
			</Beat>
			<Beat name="重り" captions={c} from={17} to={18}>
				<Visual label="大回廊は、巨大な装置だった？">
					<CounterweightGallery />
				</Visual>
			</Beat>
			<Beat name="小さな部屋" captions={c} from={19} to={20}>
				<Photo id="pyramid-interior" move="right" label="盗掘を防ぐ仕掛け、ではなかった？" />
			</Beat>
			<Beat name="計算" captions={c} from={21} to={22}>
				<Visual label="最新の計算で、もう一度">
					<EdgeRamp />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={23} to={25}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 23, 24, fps)} />
			</Beat>
			<Beat name="積んだ人々" captions={c} from={26}>
				<Photo id="haghe-geezeh" move="left" label="石を積み上げたのは、誰？" />
			</Beat>
		</SceneFrame>
	);
};
