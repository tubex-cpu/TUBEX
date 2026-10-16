import type React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat} from '../components/Beat';
import {CourtImage} from '../components/CourtImage';
import {SceneFrame} from '../components/SceneFrame';
import {closingCaptions as c} from '../data/captions';

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
		<Beat name="チャンネル登録" captions={c} from={2} to={2}>
			<CourtImage shot="court-verdict" />
		</Beat>
		<Beat name="また閉園後の法廷で" captions={c} from={3}>
			<CourtImage shot="court-bow" />
		</Beat>
		<FadeOut />
	</SceneFrame>
);
