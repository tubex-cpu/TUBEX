import {interpolate, useCurrentFrame} from 'remotion';
import {Beat} from '../components/Beat';
import {Habi} from '../components/Habi';
import {SceneFrame} from '../components/SceneFrame';
import {closingCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const SubscribeButton = () => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				fontFamily: gothicFamily,
				fontWeight: 900,
				fontSize: 64,
				color: '#fff',
				background: '#e62117',
				borderRadius: 18,
				padding: '26px 70px',
				scale: interpolate(Math.sin(frame / 8), [-1, 1], [0.97, 1.04]),
			}}
		>
			チャンネル登録
		</div>
	);
};

// 25:51 締め
export const Closing = () => (
	<SceneFrame captions={c}>
		<div style={{position: 'absolute', left: 200, top: 170}}>
			<Habi size={480} gavel />
		</div>
		<Beat name="感想を待っています" captions={c} from={0} to={1}>
			<div style={{position: 'absolute', left: 820, right: 100, top: 300, fontFamily: minchoFamily, fontWeight: 800, fontSize: 76, color: colors.text, lineHeight: 1.4}}>
				ご感想・次に裁いてほしい説を
				<br />
				<span style={{color: colors.gold}}>コメントで</span>
			</div>
		</Beat>
		<Beat name="次の法廷" captions={c} from={2} to={2}>
			<div style={{position: 'absolute', left: 820, right: 100, top: 260}}>
				<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 44, color: colors.gold}}>次の法廷</div>
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 68, color: colors.text, lineHeight: 1.35, marginTop: 10}}>
					誰にも読めない文字
					<br />
					人々は自分から
					<br />
					文字を捨てたのか
				</div>
			</div>
		</Beat>
		<Beat name="チャンネル登録" captions={c} from={3}>
			<div style={{position: 'absolute', left: 860, top: 300, display: 'flex', flexDirection: 'column', gap: 50, alignItems: 'flex-start'}}>
				<SubscribeButton />
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 70, color: colors.text}}>また閉園後の法廷で会おう。</div>
			</div>
		</Beat>
	</SceneFrame>
);
