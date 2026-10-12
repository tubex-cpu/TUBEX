import type React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {photos} from '../data/photos';
import {colors, gothicFamily} from '../theme';

type Props = {
	// src/data/photos.ts に登録した写真のID
	readonly id: string;
	// 写真がまだ無いときに代わりに出す図解
	readonly children: React.ReactNode;
	// ズームの向き（in: 寄る / out: 引く）とパンの方向
	readonly move?: 'in' | 'out' | 'left' | 'right';
	readonly label?: string;
};

// 実写真（あれば）：ゆっくりズーム・パンし、右下に出典を表示する。無ければ図解を出す
export const Photo: React.FC<Props> = ({id, children, move = 'in', label}) => {
	const frame = useCurrentFrame();
	const photo = photos[id];
	if (!photo) {
		return <>{children}</>;
	}
	const t = interpolate(frame, [0, 900], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const scale = move === 'out' ? 1.14 - 0.1 * t : 1.04 + 0.1 * t;
	const x = move === 'left' ? 30 - 60 * t : move === 'right' ? -30 + 60 * t : 0;
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<Img
				src={staticFile(`photos/${photo.file}`)}
				style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: photo.position ?? 'center', scale: String(scale), translate: `${x}px 0px`}}
			/>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)'}} />
			{label ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 150,
						textAlign: 'center',
						fontFamily: gothicFamily,
						fontWeight: 900,
						fontSize: 58,
						color: colors.text,
						textShadow: '0 4px 18px rgba(0,0,0,0.9)',
					}}
				>
					{label}
				</div>
			) : null}
			<div style={{position: 'absolute', right: 24, top: 120, fontFamily: gothicFamily, fontWeight: 700, fontSize: 20, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 4px #000'}}>
				{photo.credit}
			</div>
		</AbsoluteFill>
	);
};
