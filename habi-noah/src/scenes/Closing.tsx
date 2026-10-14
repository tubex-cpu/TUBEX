import type React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat} from '../components/Beat';
import {CourtImage} from '../components/CourtImage';
import {SceneFrame} from '../components/SceneFrame';
import {closingCaptions as c} from '../data/captions';
import {colors, gothicFamily} from '../theme';

// 次の法廷の予告（控えめな帯。チャンネル登録の誘導はナレーションだけで、アイコンやテロップは出さない）
const NextCourt: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 90,
				display: 'flex',
				justifyContent: 'center',
				opacity: interpolate(frame, [10, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
			}}
		>
			<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 52, color: colors.goldSoft, padding: '12px 40px', borderRadius: 14, background: 'rgba(5, 9, 18, 0.85)'}}>
				次の法廷：人々は、自分から文字を捨てたのか？
			</div>
		</div>
	);
};

// 最後はゆっくり暗転
const FadeOut: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return <AbsoluteFill style={{background: '#000', opacity: interpolate(frame, [durationInFrames - 45, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />;
};

// 締め：「最後まで見てくれてありがとう」から終わりまで、法廷のハビ判事が語る
export const Closing = () => (
	<SceneFrame captions={c} voice="Closing">
		{/* 場面の切り替わりの間もハビ判事が映り続けるよう、下にずっと敷いておく */}
		<CourtImage shot="court-listen" zoom={false} />
		<Beat name="ありがとう" captions={c} from={0} to={1}>
			<CourtImage shot="court-listen" />
		</Beat>
		<Beat name="次の法廷" captions={c} from={2} to={2}>
			<CourtImage shot="court-think" zoom={false} />
			<NextCourt />
		</Beat>
		<Beat name="チャンネル登録" captions={c} from={3} to={3}>
			<CourtImage shot="court-verdict" />
		</Beat>
		<Beat name="また閉園後の法廷で" captions={c} from={4}>
			<CourtImage shot="court-bow" />
		</Beat>
		<FadeOut />
	</SceneFrame>
);
