import type {Caption} from '@remotion/captions';
import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {subtitles} from '../data/subtitles';
import {CourtBackground} from './CourtBackground';
import {SceneHeader} from './SceneHeader';
import {Subtitles} from './Subtitles';

type Props = {
	readonly captions: Caption[];
	// ナレーション音声（public/voice/<voice>.mp3）
	readonly voice: string;
	readonly label?: string;
	readonly title?: string;
	readonly tint?: string;
	readonly children: React.ReactNode;
};

// 各シーン共通の枠：背景・ビジュアル・章ラベル・字幕・ナレーション
// （ハビ判事は判決の場面だけに登場する。GavelVerdict を参照）
export const SceneFrame: React.FC<Props> = ({voice, label, title, tint, children}) => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<CourtBackground tint={tint} />
			{children}
			{label && title ? <SceneHeader label={label} title={title} /> : null}
			<Subtitles captions={subtitles[voice]} />
			<Audio name="ナレーション" src={staticFile(`voice/${voice}.mp3`)} premountFor={fps} />
		</AbsoluteFill>
	);
};
