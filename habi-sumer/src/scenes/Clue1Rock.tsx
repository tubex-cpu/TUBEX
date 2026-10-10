import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {BigText} from '../components/BigText';
import {Center, ClayTablet, CompareCards, Label, PetroglyphRock, ReedPress} from '../components/Illustrations';
import {SceneFrame} from '../components/SceneFrame';
import {VerdictStamp} from '../components/VerdictStamp';
import {clue1RockCaptions as c} from '../data/captions';
import {colors, gothicFamily} from '../theme';

const Fact = ({children, ok}: {readonly children: React.ReactNode; readonly ok?: boolean}) => (
	<div style={{fontFamily: gothicFamily, fontWeight: 700, fontSize: 48, color: ok === false ? colors.correct : colors.text, display: 'flex', gap: 20}}>
		<span style={{color: colors.gold}}>■</span>
		{children}
	</div>
);

// 1:49 第1の手がかり 海峡の岩
export const Clue1Rock = () => {
	const {fps} = useVideoConfig();
	return (
	<SceneFrame captions={c} label="第1の手がかり" title="海峡の岩">
		<Beat name="場所" captions={c} from={0} to={1}>
			<BigText size={120} color={colors.goldSoft} sub="関門海峡に面した島">山口県下関市・彦島 杉田</BigText>
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
				<PetroglyphRock highlight />
				<div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
					<Fact>約100年前に写真つきで報告</Fact>
					<Fact>下関市の文化財</Fact>
					<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 90, color: colors.gold}}>岩は本物</div>
				</div>
			</Center>
		</Beat>
		<Beat name="市の説明" captions={c} from={7} to={9}>
			<div style={{position: 'absolute', left: 260, right: 260, top: 210, padding: 60, borderRadius: 24, background: 'rgba(244,236,220,0.08)', border: `2px solid ${colors.gold}`, display: 'flex', flexDirection: 'column', gap: 34}}>
				<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 56, color: colors.gold}}>下関市の説明</div>
				<Fact>とがった石で、表面を何度もたたいて刻む</Fact>
				<Fact>似た模様：有明海周辺の装飾古墳・朝鮮半島南部の岩刻画</Fact>
				<Fact ok={false}>「シュメール」の記述：なし</Fact>
			</div>
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
			<BigText size={110} sub="丸や三角は、世界中どこにでもある形">人の目は、見たいものを見つけてしまう</BigText>
		</Beat>
		<Beat name="判決" captions={c} from={19} to={21}>
			<VerdictStamp verdict="half" from={captionFrame(c, 19, 20, fps)} premountFor={fps} />
		</Beat>
		<Beat name="本当の物語" captions={c} from={22} to={22}>
			<BigText size={100} color={colors.goldSoft}>海でつながっていた、日本の古代の物語</BigText>
		</Beat>
		<Beat name="次の疑問" captions={c} from={23}>
			<BigText size={100} sub="始まりは約100年前。岩ではなく、ある「言葉」">いつ、誰が言い出したのか？</BigText>
		</Beat>
	</SceneFrame>
);
};
