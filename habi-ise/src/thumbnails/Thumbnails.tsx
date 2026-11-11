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

// 速報：八咫鏡の器の木
export const Thumb1Hinoki: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="naiku-ujibashi-backlit" dim={0.9} />
		<Three top="三種の神器" mid="2025年、八咫鏡の器の木が" bottom="伐り出された" bottomSize={120} />
		<Habi />
	</AbsoluteFill>
);

// 逆張り：皇居にあるのは
export const Thumb2Katashiro: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="naiku-gomon" dim={0.75} />
		<Three top="三種の神器" mid="皇居にあるのは" bottom="分身（形代）？" bottomSize={120} />
		<Habi file="stern-0.png" />
	</AbsoluteFill>
);

// 恐怖：草薙剣の祟り
export const Thumb3Curse: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="atsuta-forest" dim={0.95} />
		<Three top="三種の神器" mid="天皇を病に倒した？" bottom="草薙剣の祟り" bottomSize={130} />
	</AbsoluteFill>
);
