import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill} from 'remotion';
import {CourtBackground} from './CourtBackground';
import {SceneHeader} from './SceneHeader';
import {Subtitles} from './Subtitles';

type Props = {
	readonly captions: Caption[];
	readonly label?: string;
	readonly title?: string;
	readonly tint?: string;
	readonly children: React.ReactNode;
};

// 各シーン共通の枠：背景・章ラベル・ビジュアル・字幕
export const SceneFrame: React.FC<Props> = ({captions, label, title, tint, children}) => (
	<AbsoluteFill style={{overflow: 'hidden'}}>
		<CourtBackground tint={tint} />
		{children}
		{label && title ? <SceneHeader label={label} title={title} /> : null}
		<Subtitles captions={captions} />
	</AbsoluteFill>
);
