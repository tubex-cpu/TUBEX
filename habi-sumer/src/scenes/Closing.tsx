import {interpolate, useCurrentFrame} from 'remotion';
import {Beat} from '../components/Beat';
import {CourtWithText} from '../components/CourtImage';
import {SceneFrame} from '../components/SceneFrame';
import {closingCaptions as c} from '../data/captions';
import {closingMouth as mouth} from '../data/mouth';
import {colors, gothicFamily, minchoFamily} from '../theme';

const SubscribeButton = () => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				display: 'inline-block',
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

const big = {fontFamily: minchoFamily, fontWeight: 800, fontSize: 76, color: colors.text, lineHeight: 1.4} as const;

// 締め
export const Closing = () => (
	<SceneFrame captions={c} voice="Closing" mouth={mouth} hideAvatar={[[0]]}>
		<Beat name="感想を待っています" captions={c} from={0} to={1}>
			<CourtWithText shot="court-listen">
				<div style={big}>
					次に裁いてほしい説を
					<br />
					<span style={{color: colors.gold}}>コメントで</span>
				</div>
			</CourtWithText>
		</Beat>
		<Beat name="次の法廷" captions={c} from={2} to={2}>
			<CourtWithText shot="court-think">
				<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 44, color: colors.gold}}>次の法廷</div>
				<div style={{...big, marginTop: 10}}>
					誰にも読めない文字
					<br />
					人々は自分から
					<br />
					文字を捨てたのか
				</div>
			</CourtWithText>
		</Beat>
		<Beat name="チャンネル登録" captions={c} from={3} to={3}>
			<CourtWithText shot="court-verdict">
				<div style={{...big, marginBottom: 50}}>次の判決を見逃すな</div>
				<SubscribeButton />
			</CourtWithText>
		</Beat>
		<Beat name="お辞儀" captions={c} from={4}>
			<CourtWithText shot="court-bow">
				<div style={big}>
					また、
					<br />
					閉園後の法廷で。
				</div>
			</CourtWithText>
		</Beat>
	</SceneFrame>
);
