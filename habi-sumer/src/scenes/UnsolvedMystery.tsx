import {Beat} from '../components/Beat';
import {BigText} from '../components/BigText';
import {Center, Label, UnreadTablet} from '../components/Illustrations';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';
import {colors, minchoFamily} from '../theme';

// 23:03 まだ解けていない謎
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} label="未決" title="まだ解けていない謎" tint="#1d2a33">
		<Beat name="判決を出せない謎" captions={c} from={0} to={0}>
			<BigText size={130} color={colors.goldSoft}>まだ判決を出せない謎</BigText>
		</Beat>
		<Beat name="読めない文字" captions={c} from={1} to={4}>
			<Center>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<UnreadTablet />
					<Label>シュメールの東どなり（今のイラン）の文字――今も誰にも読めない</Label>
				</div>
			</Center>
		</Beat>
		<Beat name="文字を捨てた？" captions={c} from={5} to={7}>
			<Center>
				<UnreadTablet fading />
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 110, color: colors.text, lineHeight: 1.4}}>
					自分たちで
					<br />
					<span style={{color: colors.gold}}>捨てた？</span>
				</div>
			</Center>
		</Beat>
		<Beat name="SNS疲れ" captions={c} from={8} to={9}>
			<BigText size={110} sub="もちろん、これは仮説">通知に疲れて、SNSをやめるように</BigText>
		</Beat>
		<Beat name="なぜ" captions={c} from={10}>
			<BigText size={130} color={colors.goldSoft}>なぜ彼らは、文字を捨てたのか</BigText>
		</Beat>
	</SceneFrame>
);
