import type React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {photos} from '../data/photos';
import {easeInOut, Telop, useBeatLength} from './Cinema';
import {gothicFamily} from '../theme';

type Props = {
	// src/data/photos.ts に登録した写真のID
	readonly id: string;
	// 写真がまだ無いときに代わりに出す図解
	readonly children?: React.ReactNode;
	// カメラの動き（in: 寄る / out: 引く / left・right: 横に流す / up・down: 縦に流す / scroll: 横長の絵巻を端から端までたどる）
	readonly move?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'scroll';
	readonly label?: string;
};

// 実写真：映画のように色を整え、ビートの長さいっぱいを使ってゆっくりカメラを動かす
export const Photo: React.FC<Props> = ({id, children, move = 'in', label}) => {
	const frame = useCurrentFrame();
	const length = useBeatLength();
	const photo = photos[id];
	if (!photo) {
		return <>{children ?? null}</>;
	}
	const t = interpolate(frame, [0, Math.max(60, length)], [0, 1], easeInOut);
	const src = staticFile(`photos/${photo.file}`);
	const grade = 'contrast(1.08) saturate(0.88) brightness(0.94)';
	let body: React.ReactNode;
	if (move === 'scroll') {
		// 横長の絵巻：高さいっぱいに置き、左から右へたどる
		body = (
			<AbsoluteFill style={{overflow: 'hidden'}}>
				<Img src={src} style={{position: 'absolute', top: 0, height: '100%', left: 0, filter: grade, translate: `calc(${-t * 100}% + ${t * 1920}px) 0px`}} />
			</AbsoluteFill>
		);
	} else if (photo.fit === 'contain') {
		const s = 0.96 + 0.06 * (move === 'out' ? 1 - t : t);
		body = (
			<>
				<Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(48px) brightness(0.35) saturate(0.7)', scale: '1.25'}} />
				<Img src={src} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', filter: grade, scale: String(s), boxShadow: '0 20px 80px rgba(0,0,0,0.8)'}} />
			</>
		);
	} else {
		const scale = move === 'out' ? 1.2 - 0.14 * t : move === 'in' ? 1.06 + 0.14 * t : 1.14;
		const x = move === 'left' ? 70 - 140 * t : move === 'right' ? -70 + 140 * t : 0;
		const y = move === 'up' ? 50 - 100 * t : move === 'down' ? -50 + 100 * t : 0;
		body = (
			<Img
				src={src}
				style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: photo.position ?? 'center', filter: grade, scale: String(scale), translate: `${x}px ${y}px`}}
			/>
		);
	}
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			{body}
			{/* 影は青く、全体を少し沈ませて、テレビでも締まった画にする */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,22,40,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(4,8,16,0.7) 100%)'}} />
			{label ? <Telop text={label} bottom={photo.labelBottom} /> : null}
			<div style={{position: 'absolute', right: 28, top: 36, fontFamily: gothicFamily, fontWeight: 700, fontSize: 18, color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 4px #000'}}>
				{photo.credit}
			</div>
		</AbsoluteFill>
	);
};
