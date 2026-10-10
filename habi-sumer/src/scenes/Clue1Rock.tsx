import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Center, ClayTablet, CompareCards, Label, PetroglyphRock, ReedPress} from '../components/Illustrations';
import {EyeShapes, KanmonMap, OldBook, OldPhoto, PeckingRock, SeaRoutes, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {VerdictStamp} from '../components/VerdictStamp';
import {clue1RockCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 1:49 第1の手がかり 海峡の岩
export const Clue1Rock = () => {
	const {fps} = useVideoConfig();
	return (
	<SceneFrame captions={c} label="第1の手がかり" title="海峡の岩">
		<Beat name="場所" captions={c} from={0} to={1}>
			<Visual label="山口県下関市・彦島 杉田">
				<KanmonMap />
			</Visual>
		</Beat>
		<Beat name="岩の模様" captions={c} from={2} to={3}>
			<Center>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<PetroglyphRock />
					<Label>丸・三角・四角・人の形</Label>
				</div>
			</Center>
		</Beat>
		<Beat name="岩は本物" captions={c} from={4} to={6}>
			<Center>
				<OldPhoto>
					<PetroglyphRock />
				</OldPhoto>
			</Center>
		</Beat>
		<Beat name="市の説明" captions={c} from={7} to={9}>
			<Visual label="とがった石で、何度もたたいて刻む">
				<PeckingRock />
			</Visual>
		</Beat>
		<Beat name="くさび形文字" captions={c} from={10} to={13}>
			<Center>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<ReedPress />
					<Label>葦のペンで粘土に「押す」＝くさび形文字</Label>
				</div>
			</Center>
		</Beat>
		<Beat name="作り方の比較" captions={c} from={14} to={14}>
			<CompareCards
				left={<div style={{scale: '0.6', margin: -120}}><PetroglyphRock /></div>}
				right={<ClayTablet width={340} />}
				leftLabel="石を石でたたいて刻む"
				rightLabel="葦で粘土に押しつける"
				leftColor={colors.text}
			/>
		</Beat>
		<Beat name="見たいものを見る" captions={c} from={15} to={18}>
			<Visual label="丸や三角は、世界中どこにでもある">
				<EyeShapes />
			</Visual>
		</Beat>
		<Beat name="判決" captions={c} from={19} to={21}>
			<VerdictStamp verdict="half" from={captionFrame(c, 19, 20, fps)} premountFor={fps} />
		</Beat>
		<Beat name="本当の物語" captions={c} from={22} to={22}>
			<Visual label="海でつながっていた古代の日本">
				<SeaRoutes />
			</Visual>
		</Beat>
		<Beat name="次の疑問" captions={c} from={23}>
			<Visual label="始まりは約100年前の「言葉」">
				<OldBook title="日本人のルーツは？" year="大正〜昭和" />
			</Visual>
		</Beat>
	</SceneFrame>
);
};
