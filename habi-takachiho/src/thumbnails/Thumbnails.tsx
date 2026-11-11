import type React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {gothicFamily, minchoFamily} from '../theme';

// YouTubeサムネイル（1280×720）。3段：上＝白・大／中＝白・小／下＝赤・特大

const outline = (w: number, color = '#000') => ({
	WebkitTextStroke: `${w}px ${color}`,
	paintOrder: 'stroke fill' as const,
});

const Habi: React.FC<{readonly file?: string; readonly right?: number; readonly size?: number}> = ({file = 'doubt-0.png', right = -20, size = 330}) => (
	<Img src={staticFile(`habi/${file}`)} style={{position: 'absolute', right, bottom: -10, width: size, height: size, filter: 'drop-shadow(0 0 18px rgba(0,0,0,0.9))'}} />
);

const Three: React.FC<{readonly top: string; readonly mid: string; readonly bottom: string; readonly bottomSize?: number}> = ({top, mid, bottom, bottomSize = 140}) => (
	<div style={{position: 'absolute', left: 44, top: 40, right: 40}}>
		<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 96, lineHeight: 1.05, color: '#fff', ...outline(14)}}>{top}</div>
		<div style={{marginTop: 14, fontFamily: gothicFamily, fontWeight: 900, fontSize: 56, lineHeight: 1.1, color: '#fff', ...outline(10)}}>{mid}</div>
		<div style={{marginTop: 10, fontFamily: minchoFamily, fontWeight: 800, fontSize: bottomSize, lineHeight: 1.05, color: '#ff3b2f', ...outline(16, '#fff')}}>{bottom}</div>
	</div>
);

const Photo: React.FC<{readonly id: string; readonly pos?: string; readonly dim?: number}> = ({id, pos = 'center', dim = 0.8}) => (
	<>
		<Img src={staticFile(`photos/${id}.jpg`)} style={{position: 'absolute', inset: 0, width: 1280, height: 720, objectFit: 'cover', objectPosition: pos, filter: `brightness(${dim})`}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.45) 100%)'}} />
	</>
);

// 速報：年に一度、33番すべて
export const Thumb1Kagura: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="yk-kaguraden-night" pos="center 60%" dim={1.05} />
		<Three top="高千穂の夜神楽" mid="年に一度だけ" bottom="33番すべてを舞う夜" bottomSize={110} />
		<Habi />
	</AbsoluteFill>
);

// 逆張り：天岩戸は本当に高千穂に？
export const Thumb2Iwato: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="yasu-cave" dim={0.75} />
		<Three top="天岩戸" mid="本当に高千穂に" bottom="ある？" bottomSize={170} />
		<Habi file="stern-0.png" />
	</AbsoluteFill>
);

// 恐怖：太陽が消えた日
export const Thumb3Eclipse: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="ecl-total" dim={0.95} />
		<Three top="天岩戸神話" mid="太陽が消えた日" bottom="卑弥呼の死と日食？" bottomSize={110} />
	</AbsoluteFill>
);
