import type React from 'react';
import {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, gothicFamily, minchoFamily} from '../theme';

// テレビの大画面で見ても「映画のように」見せるための共通部品
// ・FilmLook：粒子（フィルムグレイン）とビネットを全画面に重ねる
// ・Telop：画面中央の問いかけ（濃い帯の上に大きな明朝）
// ・Stage：図解を全画面の舞台として見せる
// ・ClueOpener：手がかりの冒頭に出す章扉

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)} as const;
export const easeInOut = {...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1)} as const;

// いま表示しているビート（Beat）の長さ。写真のカメラの動きをビートの長さに合わせるのに使う
export const BeatLength = createContext<number>(240);
export const useBeatLength = () => useContext(BeatLength);

// フィルムの粒子とビネット（全シーンの一番上に重ねる）
export const FilmLook: React.FC = () => {
	const frame = useCurrentFrame();
	const k = Math.floor(frame / 2) % 4;
	const dx = ((frame * 37) % 7) * 40;
	const dy = ((frame * 53) % 5) * 40;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)'}} />
			<Img
				src={staticFile(`fx/grain-${k}.png`)}
				style={{position: 'absolute', left: -dx, top: -dy, width: 2240, height: 1260, opacity: 0.07, mixBlendMode: 'overlay'}}
			/>
		</AbsoluteFill>
	);
};

// 問いかけのテロップ：画面いっぱいの濃い帯に、大きな明朝の白文字と金の細線
export const Telop: React.FC<{readonly text: string; readonly bottom?: boolean; readonly accent?: string}> = ({text, bottom = false, accent = colors.gold}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [6, 26], [0, 1], easeOut);
	const size = Math.min(84, Math.floor(1500 / Math.max(8, text.length)));
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				...(bottom ? {bottom: 170} : {top: 96}),
				height: size + 70,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(90deg, rgba(3,6,14,0) 0%, rgba(3,6,14,0.86) 18%, rgba(3,6,14,0.9) 50%, rgba(3,6,14,0.86) 82%, rgba(3,6,14,0) 100%)',
				opacity: t,
			}}
		>
			<div style={{position: 'absolute', top: 0, height: 2, width: `${60 * t}%`, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`}} />
			<div style={{position: 'absolute', bottom: 0, height: 2, width: `${60 * t}%`, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`}} />
			<div
				style={{
					fontFamily: minchoFamily,
					fontWeight: 800,
					fontSize: size,
					letterSpacing: interpolate(t, [0, 1], [0.3, 0.08]) + 'em',
					color: '#fbf6ea',
					whiteSpace: 'nowrap',
					textShadow: `0 0 28px rgba(226,187,99,0.35), 0 4px 18px rgba(0,0,0,0.9)`,
				}}
			>
				{text}
			</div>
		</div>
	);
};

// 図解を全画面の舞台として見せる（1920×1080のSVGをそのまま敷く）
export const Stage: React.FC<{readonly children: React.ReactNode; readonly label?: string; readonly labelBottom?: boolean}> = ({children, label, labelBottom}) => (
	<AbsoluteFill style={{background: '#04070f'}}>
		{children}
		{label ? <Telop text={label} bottom={labelBottom} /> : null}
	</AbsoluteFill>
);

// 手がかりの章扉：暗い海に光が差し、「第◯の手がかり」と問いが浮かび上がる
export const ClueOpener: React.FC<{readonly label: string; readonly title: string}> = ({label, title}) => {
	const frame = useCurrentFrame();
	const out = interpolate(frame, [96, 116], [1, 0], clamp);
	const sweep = interpolate(frame, [0, 70], [-40, 140], easeInOut);
	const rule = interpolate(frame, [10, 40], [0, 1], easeOut);
	const size = Math.min(112, Math.floor(1640 / Math.max(6, title.length)));
	if (out <= 0) {
		return null;
	}
	return (
		<AbsoluteFill style={{opacity: out, background: 'radial-gradient(ellipse at 50% 55%, #10233a 0%, #050a14 62%, #010205 100%)'}}>
			<AbsoluteFill style={{background: `linear-gradient(105deg, transparent ${sweep - 18}%, rgba(255,226,160,0.10) ${sweep}%, transparent ${sweep + 18}%)`}} />
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				{[...Array(40)].map((_, i) => {
					const x = (i * 211) % 1920;
					const y = 1080 - ((frame * (0.6 + (i % 5) * 0.25) + i * 97) % 1180);
					return <circle key={i} cx={x} cy={y} r={1.5 + (i % 3)} fill="#cfe3ff" opacity={0.12 + (i % 4) * 0.05} />;
				})}
			</svg>
			<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34}}>
				<div
					style={{
						fontFamily: minchoFamily,
						fontWeight: 800,
						fontSize: 58,
						letterSpacing: interpolate(frame, [0, 40], [0.6, 0.3], easeOut) + 'em',
						color: colors.gold,
						opacity: interpolate(frame, [4, 22], [0, 1], clamp),
					}}
				>
					{label}
				</div>
				<div style={{width: 900 * rule, height: 2, background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`}} />
				<div
					style={{
						fontFamily: minchoFamily,
						fontWeight: 800,
						fontSize: size,
						color: '#fbf6ea',
						whiteSpace: 'nowrap',
						opacity: interpolate(frame, [18, 40], [0, 1], clamp),
						translate: `0px ${interpolate(frame, [18, 50], [24, 0], easeOut)}px`,
						textShadow: '0 0 40px rgba(226,187,99,0.4), 0 6px 24px rgba(0,0,0,0.9)',
					}}
				>
					{title}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// 大きな数字や言葉を、ゆっくり浮かび上がらせる（図解の中で使う）
export const Reveal: React.FC<{readonly at?: number; readonly children: React.ReactNode; readonly rise?: number}> = ({at = 0, children, rise = 20}) => {
	const frame = useCurrentFrame();
	return (
		<g opacity={interpolate(frame, [at, at + 18], [0, 1], clamp)} transform={`translate(0 ${interpolate(frame, [at, at + 30], [rise, 0], easeOut)})`}>
			{children}
		</g>
	);
};

export const svgMincho = (size: number, color: string = '#fbf6ea') => ({fontFamily: minchoFamily, fontWeight: 800, fontSize: size, fill: color});
export const svgGothic = (size: number, color: string = '#fbf6ea', weight = 900) => ({fontFamily: gothicFamily, fontWeight: weight, fontSize: size, fill: color});
