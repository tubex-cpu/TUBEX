import type {Caption} from '@remotion/captions';
import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CourtBackground} from './CourtBackground';
import {type Expression, HabiAvatar} from './HabiAvatar';
import {SceneHeader} from './SceneHeader';
import {Subtitles} from './Subtitles';

type Props = {
	readonly captions: Caption[];
	// ナレーション音声（public/voice/<voice>.mp3）と口パクデータ
	readonly voice: string;
	readonly mouth: string;
	// 字幕番号ごとのハビ判事の表情（その番号から切り替わる）
	readonly expressions?: Record<number, Expression>;
	// ハビ判事を隠す字幕番号の範囲（一枚絵のハビ判事が出ている間など）
	readonly hideAvatar?: [number, number?][];
	readonly label?: string;
	readonly title?: string;
	readonly tint?: string;
	readonly children: React.ReactNode;
};

// 各シーン共通の枠：背景・ビジュアル・章ラベル・話すハビ判事・字幕・ナレーション
export const SceneFrame: React.FC<Props> = ({captions, voice, mouth, expressions = {0: 'doubt'}, hideAvatar = [], label, title, tint, children}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const ms = (frame / fps) * 1000;
	const index = captions.filter((c) => c.startMs - 200 <= ms).length - 1;
	let expression: Expression = 'doubt';
	for (const [k, v] of Object.entries(expressions).sort((a, b) => Number(a[0]) - Number(b[0]))) {
		if (Number(k) <= index) {
			expression = v;
		}
	}
	const toFrame = (i: number | undefined, edge: 'start' | 'end') =>
		i === undefined ? durationInFrames : Math.round(((edge === 'start' ? captions[i].startMs - 200 : captions[i].endMs + 300) / 1000) * fps);
	const hidden = hideAvatar.some(([a, b]) => frame >= toFrame(a, 'start') && frame < toFrame(b, 'end'));

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<CourtBackground tint={tint} />
			{children}
			{label && title ? <SceneHeader label={label} title={title} /> : null}
			{hidden ? null : <HabiAvatar expression={expression} mouthOpen={mouth[frame] === '1'} />}
			<Subtitles captions={captions} />
			<Audio name="ナレーション" src={staticFile(`voice/${voice}.mp3`)} premountFor={fps} />
		</AbsoluteFill>
	);
};
