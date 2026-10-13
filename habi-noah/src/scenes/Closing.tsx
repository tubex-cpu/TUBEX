import {interpolate, useCurrentFrame} from 'remotion';
import {Beat} from '../components/Beat';
import {UnreadTablet} from '../components/Illustrations';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {closingCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const SubscribeButton = () => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				display: 'inline-block',
				fontFamily: gothicFamily,
				fontWeight: 900,
				fontSize: 72,
				color: '#fff',
				background: '#e62117',
				borderRadius: 18,
				padding: '26px 80px',
				scale: interpolate(Math.sin(frame / 8), [-1, 1], [0.97, 1.04]),
			}}
		>
			チャンネル登録
		</div>
	);
};

// 締め
export const Closing = () => (
	<SceneFrame captions={c} voice="Closing">
		<Beat name="感想を待っています" captions={c} from={0} to={1}>
			<Photo id="dove-2" label="次に裁いてほしい説を、コメントで" />
		</Beat>
		<Beat name="次の法廷" captions={c} from={2} to={2}>
			<Visual label="次の法廷：人々は、自分から文字を捨てたのか？" labelColor={colors.goldSoft}>
				<UnreadTablet fading />
			</Visual>
		</Beat>
		<Beat name="チャンネル登録" captions={c} from={3} to={3}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 90, color: colors.text, marginBottom: 50}}>次の判決を見逃すな</div>
				<SubscribeButton />
			</div>
		</Beat>
		<Beat name="また閉園後の法廷で" captions={c} from={4}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 340, textAlign: 'center', fontFamily: minchoFamily, fontWeight: 800, fontSize: 110, color: colors.gold}}>
				また、閉園後の法廷で。
			</div>
		</Beat>
	</SceneFrame>
);
