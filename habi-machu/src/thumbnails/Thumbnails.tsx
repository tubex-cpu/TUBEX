import type React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {gothicFamily, minchoFamily} from '../theme';

// YouTubeサムネイル（1280×720）。3段：上＝白・大／中＝白・小／下＝赤・特大
// 「解明」「新発見」とは書かない（密林の下で見つかったのは、まだ「遺構の候補」）

const outline = (w: number, color = '#000') => ({
	WebkitTextStroke: `${w}px ${color}`,
	paintOrder: 'stroke fill' as const,
});

const Habi: React.FC<{readonly file?: string; readonly right?: number; readonly size?: number}> = ({file = 'doubt-0.png', right = -20, size = 360}) => (
	<Img src={staticFile(`habi/${file}`)} style={{position: 'absolute', right, bottom: -10, width: size, height: size, filter: 'drop-shadow(0 0 18px rgba(0,0,0,0.9))'}} />
);

const Three: React.FC<{readonly top: string; readonly mid: string; readonly bottom: string; readonly bottomSize?: number; readonly left?: number}> = ({top, mid, bottom, bottomSize = 150, left = 44}) => (
	<div style={{position: 'absolute', left, top: 40, right: 40}}>
		<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 96, lineHeight: 1.05, color: '#fff', ...outline(14)}}>{top}</div>
		<div style={{marginTop: 14, fontFamily: gothicFamily, fontWeight: 900, fontSize: 56, lineHeight: 1.1, color: '#fff', ...outline(10)}}>{mid}</div>
		<div style={{marginTop: 10, fontFamily: minchoFamily, fontWeight: 800, fontSize: bottomSize, lineHeight: 1.05, color: '#ff3b2f', ...outline(16, '#fff')}}>{bottom}</div>
	</div>
);

const Photo: React.FC<{readonly id: string; readonly pos?: string; readonly dim?: number}> = ({id, pos = 'center', dim = 0.85}) => (
	<>
		<Img src={staticFile(`photos/${id}.jpg`)} style={{position: 'absolute', inset: 0, width: 1280, height: 720, objectFit: 'cover', objectPosition: pos, filter: `brightness(${dim})`}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.45) 100%)'}} />
	</>
);

// 速報：日本のレーザーが密林の下を見通した
export const Thumb1Laser: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="mp-clouds-unsplash" />
		<svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
			{[...Array(9)].map((_, i) => (
				<line key={i} x1={1000} y1={-20} x2={520 + i * 80} y2={720} stroke="#ff3b3b" strokeWidth={4} opacity={0.75} />
			))}
		</svg>
		<Three top="マチュピチュ" mid="日本のレーザーが密林の下に" bottom="もう一つの姿" />
		<Habi size={330} right={-30} />
	</AbsoluteFill>
);

// 逆張り：「発見者」はビンガムではなかった
export const Thumb2Bingham: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="old-mp-1912" dim={0.75} />
		<Img src={staticFile('photos/bingham-portrait.jpg')} style={{position: 'absolute', right: 0, top: 0, width: 470, height: 720, objectFit: 'cover', objectPosition: 'center 20%', filter: 'grayscale(1) brightness(0.9)'}} />
		<AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 100%)'}} />
		<Three top="マチュピチュ" mid="「発見者」は本当に" bottom={'あの探検家？'} bottomSize={120} />
		<div style={{position: 'absolute', left: 44, bottom: 40, padding: '8px 22px', background: 'rgba(5,9,18,0.92)', border: '3px solid #e2bb63', borderRadius: 10, fontFamily: gothicFamily, fontWeight: 900, fontSize: 44, color: '#fff'}}>
			壁に残された「1902年」
		</div>
	</AbsoluteFill>
);

// 恐怖：骨の遺伝子が明かした、住人の正体
export const Thumb3People: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Photo id="mp-misty-unsplash" dim={0.7} />
		<Three top="マチュピチュ" mid="骨の遺伝子が明かした" bottom="住人の正体" />
		<div style={{position: 'absolute', left: 44, bottom: 40, padding: '8px 22px', background: 'rgba(5,9,18,0.92)', border: '3px solid #e2bb63', borderRadius: 10, fontFamily: gothicFamily, fontWeight: 900, fontSize: 44, color: '#fff'}}>
			血のつながりは、たった1組
		</div>
		<Habi file="stern-0.png" size={330} right={-20} />
	</AbsoluteFill>
);
