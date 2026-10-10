import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Center, ClayTablet, CompareCards, Label, PetroglyphRock, ReedPress} from '../components/Illustrations';
import {EyeShapes, KanmonMap, OldBook, OldPhoto, PeckingRock, SeaRoutes, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {GavelVerdict} from '../components/GavelVerdict';
import {clue1RockCaptions as c} from '../data/captions';
import {clue1RockMouth as mouth} from '../data/mouth';
import {colors} from '../theme';

// 1:49 第1の手がかり 海峡の岩
export const Clue1Rock = () => {
	const {fps} = useVideoConfig();
	return (
	<SceneFrame captions={c} voice="Clue1Rock" mouth={mouth} expressions={{0: 'doubt', 10: 'think', 15: 'stern', 22: 'think'}} hideAvatar={[[19, 21]]} label="第1の手がかり" title="シュメール文字が刻まれた岩？">
		<Beat name="場所" captions={c} from={0} to={1}>
			<Visual label="日本の島に、5000年前の文字が？">
				<KanmonMap />
			</Visual>
		</Beat>
		<Beat name="岩の模様" captions={c} from={2} to={3}>
			<Center>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<PetroglyphRock />
					<Label>これが、シュメール文字……なのか？</Label>
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
			<Visual label="市の説明に、ある名前が出てこない">
				<PeckingRock />
			</Visual>
		</Beat>
		<Beat name="くさび形文字" captions={c} from={10} to={13}>
			<Center>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<ReedPress />
					<Label>シュメール人は、文字を「書かなかった」</Label>
				</div>
			</Center>
		</Beat>
		<Beat name="作り方の比較" captions={c} from={14} to={14}>
			<CompareCards
				left={<div style={{scale: '0.6', margin: -120}}><PetroglyphRock /></div>}
				right={<ClayTablet width={340} />}
				leftLabel="彦島の岩：たたいて刻む"
				rightLabel="シュメール：粘土に押す"
				leftColor={colors.text}
			/>
		</Beat>
		<Beat name="見たいものを見る" captions={c} from={15} to={18}>
			<Visual label="なぜ「シュメール文字」に見えたのか">
				<EyeShapes />
			</Visual>
		</Beat>
		<Beat name="判決" captions={c} from={19} to={21}>
			<GavelVerdict verdict="half" strikeAt={captionFrame(c, 19, 20, fps)} />
		</Beat>
		<Beat name="本当の物語" captions={c} from={22} to={22}>
			<Visual label="この岩が、本当に語っていること">
				<SeaRoutes />
			</Visual>
		</Beat>
		<Beat name="次の疑問" captions={c} from={23}>
			<Visual label="すべての始まりは、100年前の“ある言葉”">
				<OldBook title="日本人のルーツは？" year="大正〜昭和" />
			</Visual>
		</Beat>
	</SceneFrame>
);
};
