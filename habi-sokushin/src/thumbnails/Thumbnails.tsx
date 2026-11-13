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

// 速報：2026年、将門塚の夜
export const Thumb1Tsuka: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="kubizuka-new-stone" dim={0.7} />
		<Three top="日本三大怨霊" mid="2026年、将門塚で何が？" bottom="祟りは本当か" bottomSize={130} />
		<Habi />
	</AbsoluteFill>
);

// 逆張り：祟った者を、なぜ神に
export const Thumb2Kami: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="kanda-zuishinmon-night" dim={0.8} />
		<Three top="祟ったはずの3人を" mid="日本人は手厚く祀ってきた" bottom="怨霊はなぜ神に？" bottomSize={112} />
		<Habi file="stern-0.png" />
	</AbsoluteFill>
);

// 恐怖：首・雷・血の呪い
export const Thumb3Kubi: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="takiyasha-kuniyoshi" dim={0.85} pos="right" />
		<Three top="日本三大怨霊" mid="首が飛び、雷が落ち、血で呪う" bottom="祟りの正体" bottomSize={130} />
	</AbsoluteFill>
);
