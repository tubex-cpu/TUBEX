import {Beat} from '../components/Beat';
import {Center, Label, UnreadTablet} from '../components/Illustrations';
import {PhoneNotifications, ScaleBalance, TabletBuried, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';
import {colors, minchoFamily} from '../theme';

// 23:03 まだ解けていない謎
export const UnsolvedMystery = () => (
	<SceneFrame captions={c} label="未決" title="自ら文字を捨てた人々？" tint="#1d2a33">
		<Beat name="判決を出せない謎" captions={c} from={0} to={0}>
			<Visual label="ボクにも、まだ判決が出せない">
				<ScaleBalance undecided />
			</Visual>
		</Beat>
		<Beat name="読めない文字" captions={c} from={1} to={4}>
			<Center>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<UnreadTablet />
					<Label>100年以上、誰ひとり読めていない文字</Label>
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
			<Visual label="通知に疲れて、SNSをやめるように？">
				<PhoneNotifications />
			</Visual>
		</Beat>
		<Beat name="なぜ" captions={c} from={10}>
			<Visual label="人類は一度、文字を“捨てた”のか？" labelColor={colors.goldSoft}>
				<TabletBuried />
			</Visual>
		</Beat>
	</SceneFrame>
);
