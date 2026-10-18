import type React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {colors, gothicFamily, minchoFamily} from '../theme';

// YouTubeサムネイル（1280×720）。競合の「卑弥呼の想像図」「九州説vs畿内説の地図」を避け、
// この動画だけの事実（記録の矛盾・消えた金印・1300年前の歴史家）を切り口にする

const outline = (w: number, color = '#000') => ({
	WebkitTextStroke: `${w}px ${color}`,
	paintOrder: 'stroke fill' as const,
});

const Habi: React.FC<{readonly file?: string; readonly right?: number; readonly size?: number}> = ({file = 'doubt-0.png', right = -20, size = 400}) => (
	<Img src={staticFile(`habi/${file}`)} style={{position: 'absolute', right, bottom: -10, width: size, height: size, filter: 'drop-shadow(0 0 18px rgba(0,0,0,0.9))'}} />
);

const Tag: React.FC<{readonly children: React.ReactNode; readonly top?: number; readonly left?: number}> = ({children, top = 34, left = 40}) => (
	<div style={{position: 'absolute', top, left, padding: '6px 22px', background: colors.gold, color: colors.ink, fontFamily: gothicFamily, fontWeight: 900, fontSize: 44, borderRadius: 10}}>{children}</div>
);

// 案1：記録どおりに進むと、海の上
export const Thumb1Sea: React.FC = () => (
	<AbsoluteFill style={{background: '#06182c', overflow: 'hidden'}}>
		<svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute'}}>
			{[...Array(10)].map((_, i) => (
				<path key={i} d={`M0 ${80 + i * 70} Q 320 ${60 + i * 70} 640 ${80 + i * 70} T 1280 ${80 + i * 70}`} stroke="#123a5c" strokeWidth={3} fill="none" />
			))}
			{/* 九州 */}
			<path d="M60 40 L230 20 L330 40 L380 120 L370 230 L320 330 L260 360 L200 320 L170 250 L110 210 L70 140 Z" fill="#bfa77c" stroke="#7d6646" strokeWidth={5} />
			{/* 記録どおりの道のり：南へ、海の上へ */}
			<path d="M200 70 C 260 200 300 330 380 470 C 430 560 480 620 540 690" stroke={colors.correct} strokeWidth={14} strokeDasharray="34 20" fill="none" strokeLinecap="round" />
			<circle cx={540} cy={690} r={30} fill="none" stroke={colors.correct} strokeWidth={10} />
			<text x={210} y={200} fill="#3b2a16" fontFamily={gothicFamily} fontWeight={900} fontSize={56}>
				九州
			</text>
			<text x={330} y={665} fill="#fff" fontFamily={gothicFamily} fontWeight={900} fontSize={44} stroke="#000" strokeWidth={8} paintOrder="stroke">
				ここ？
			</text>
		</svg>
		<Tag top={40} left={470}>
			邪馬台国
		</Tag>
		<div style={{position: 'absolute', left: 470, top: 130, fontFamily: gothicFamily, fontWeight: 900, fontSize: 64, color: '#fff', ...outline(10)}}>記録どおりに進むと</div>
		<div style={{position: 'absolute', left: 450, top: 210, fontFamily: minchoFamily, fontWeight: 800, fontSize: 190, lineHeight: 1, color: colors.goldSoft, ...outline(16)}}>海の上</div>
		<div style={{position: 'absolute', left: 470, top: 430, padding: '8px 20px', background: 'rgba(5,9,18,0.92)', border: `3px solid ${colors.gold}`, borderRadius: 10, fontFamily: gothicFamily, fontWeight: 900, fontSize: 40, color: '#fff'}}>
			唯一の記録が指した場所は？
		</div>
		<Habi size={330} right={-30} />
	</AbsoluteFill>
);

// 案2：卑弥呼の金印は、まだ土の中
export const Thumb2Seal: React.FC = () => (
	<AbsoluteFill style={{background: '#120d08', overflow: 'hidden'}}>
		<Img src={staticFile('photos/na-seal.jpg')} style={{position: 'absolute', left: -40, top: 60, width: 640, height: 420, objectFit: 'cover', filter: 'brightness(0.95)'}} />
		<div style={{position: 'absolute', left: 30, top: 470, padding: '4px 16px', background: 'rgba(5,9,18,0.9)', fontFamily: gothicFamily, fontWeight: 900, fontSize: 30, color: colors.muted}}>見つかった金印（漢）</div>
		{/* 地面の断面と、まだ見つかっていない金印 */}
		<div style={{position: 'absolute', left: 640, top: 0, width: 640, height: 720, background: 'linear-gradient(180deg, #3a2a18 0%, #2a1c10 100%)'}} />
		<div style={{position: 'absolute', left: 820, top: 300, width: 260, height: 260, border: `10px dashed ${colors.goldSoft}`, borderRadius: 18, boxShadow: `0 0 80px ${colors.gold}`}} />
		<div style={{position: 'absolute', left: 820, top: 300, width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: minchoFamily, fontWeight: 800, fontSize: 200, color: colors.goldSoft, ...outline(10)}}>？</div>
		<Tag>邪馬台国</Tag>
		<div style={{position: 'absolute', right: 40, top: 40, fontFamily: gothicFamily, fontWeight: 900, fontSize: 64, color: '#fff', textAlign: 'right', ...outline(10)}}>卑弥呼の金印</div>
		<div style={{position: 'absolute', right: 30, top: 120, fontFamily: minchoFamily, fontWeight: 800, fontSize: 120, lineHeight: 1.05, color: colors.goldSoft, textAlign: 'right', ...outline(14)}}>まだ土の中</div>
		<div style={{position: 'absolute', left: 30, bottom: 30, padding: '8px 20px', background: 'rgba(5,9,18,0.92)', border: `3px solid ${colors.gold}`, borderRadius: 10, fontFamily: gothicFamily, fontWeight: 900, fontSize: 40, color: '#fff'}}>
			見つかった場所が、邪馬台国？
		</div>
	</AbsoluteFill>
);

// 案3：1300年前の歴史家も、解けなかった
export const Thumb3Shoki: React.FC = () => (
	<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
		<Img src={staticFile('photos/nihonshoki-1286.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 760, height: 720, objectFit: 'cover', objectPosition: '70% center', filter: 'brightness(0.8)'}} />
		<div style={{position: 'absolute', left: 560, top: 0, width: 720, height: 720, background: 'linear-gradient(90deg, rgba(5,9,18,0) 0%, rgba(5,9,18,0.95) 30%, #050912 100%)'}} />
		<Tag>邪馬台国</Tag>
		<div style={{position: 'absolute', right: 40, top: 70, fontFamily: gothicFamily, fontWeight: 900, fontSize: 60, color: '#fff', textAlign: 'right', ...outline(10)}}>日本最古の歴史書も</div>
		<div style={{position: 'absolute', right: 30, top: 150, fontFamily: minchoFamily, fontWeight: 800, fontSize: 132, lineHeight: 1.05, color: colors.goldSoft, textAlign: 'right', ...outline(14)}}>
			解けなかった
		</div>
		<div style={{position: 'absolute', right: 40, top: 310, padding: '8px 20px', background: 'rgba(5,9,18,0.92)', border: `3px solid ${colors.gold}`, borderRadius: 10, fontFamily: gothicFamily, fontWeight: 900, fontSize: 40, color: '#fff'}}>
			1300年続く、女王の謎
		</div>
		<Habi file="stern-0.png" size={360} right={10} />
	</AbsoluteFill>
);
