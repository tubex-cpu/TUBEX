import type React from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {svgGothic} from './Cinema';
import {Canvas} from './IzumoKit';

// まとめ：19の判決を並べる
export const VerdictBoard: React.FC<{readonly rows: readonly {q: string; v: 'right' | 'half' | 'wrong'}[]; readonly startAt: readonly number[]}> = ({rows, startAt}) => {
	const frame = useCurrentFrame();
	const col = (v: string) => (v === 'right' ? colors.correct : v === 'half' ? colors.half : colors.wrong);
	const word = (v: string) => (v === 'right' ? '正しい' : v === 'half' ? '半分正しい' : 'まちがい');
	const half = Math.ceil(rows.length / 2);
	return (
		<Canvas tone="night">
			{rows.map((r, i) => {
				const c = i < half ? 0 : 1;
				const k = i < half ? i : i - half;
				const x = 90 + c * 900;
				const y = 110 + k * 76;
				const lit = frame >= startAt[i];
				return (
					<g key={i} opacity={lit ? 1 : 0.35}>
						<text x={x} y={y + 44} {...svgGothic(30, '#9fb0c8', 900)}>
							{i + 1}
						</text>
						<text x={x + 56} y={y + 46} {...svgGothic(36, '#f6eedb', 900)}>
							{r.q}
						</text>
						{lit ? (
							<g>
								<rect x={x + 580} y={y + 4} width={210} height={56} rx={10} fill={col(r.v)} />
								<text x={x + 685} y={y + 44} textAnchor="middle" {...svgGothic(30, '#fff', 900)}>
									{word(r.v)}
								</text>
							</g>
						) : null}
					</g>
				);
			})}
		</Canvas>
	);
};
