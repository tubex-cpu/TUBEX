import {interpolate, useCurrentFrame} from 'remotion';
import {Beat} from '../components/Beat';
import {Habi} from '../components/Habi';
import {ClueIcon, type ClueKind, ScaleBalance, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {judgeEntranceCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const clues = ['海峡の岩', '100年前の言葉', '菊の紋', '最新AI', '神の遺伝子'];
const kinds: ClueKind[] = ['rock', 'words', 'flower', 'ai', 'dna'];

const ClueRow = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 120, right: 120, top: 250, display: 'flex', gap: 24, justifyContent: 'center'}}>
			{clues.map((t, i) => (
				<div
					key={t}
					style={{
						width: 320,
						padding: '36px 0',
						borderRadius: 18,
						background: colors.paper,
						textAlign: 'center',
						opacity: interpolate(frame, [i * 8, i * 8 + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						translate: interpolate(frame, [i * 8, i * 8 + 16], ['0px 40px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 34, color: colors.clayDark}}>手がかり {i + 1}</div>
					<div style={{display: 'flex', justifyContent: 'center', margin: '10px 0', background: colors.night, borderRadius: 14, marginInline: 20}}>
						<ClueIcon kind={kinds[i]} size={200} />
					</div>
					<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 42, color: colors.ink, marginTop: 8}}>{t}</div>
				</div>
			))}
		</div>
	);
};

// 1:07 ハビ判事登場
export const JudgeEntrance = () => (
	<SceneFrame captions={c} label="開廷" title="閉園後の法廷">
		<Beat name="ハビ判事" captions={c} from={0} to={2}>
			<div style={{position: 'absolute', left: 240, top: 150}}>
				<Habi size={520} gavel />
			</div>
			<div style={{position: 'absolute', left: 900, top: 330}}>
				<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 44, color: colors.gold}}>裁判長</div>
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 150, color: colors.text}}>ハビ判事</div>
				<div style={{fontFamily: gothicFamily, fontWeight: 700, fontSize: 44, color: colors.muted}}>信じるのは、証拠だけ。</div>
			</div>
		</Beat>
		<Beat name="今夜の問い" captions={c} from={3} to={3}>
			<Visual label="今夜の審理：日本人は、シュメール人の子孫か">
				<ScaleBalance />
			</Visual>
		</Beat>
		<Beat name="5つの手がかり" captions={c} from={4}>
			<ClueRow />
		</Beat>
	</SceneFrame>
);
