import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {BigText} from '../components/BigText';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const rows = [
	{clue: '海峡の岩', note: '岩は本物。でもシュメール文字ではない', mark: '△', color: colors.half},
	{clue: '100年前の言葉', note: '似ているのは世界によくある特徴', mark: '△', color: colors.half},
	{clue: '菊の紋', note: '模様は本当にある。でも3000年の空白', mark: '○', color: colors.correct},
	{clue: '最新AI', note: '歌はよみがえった。日本への道はない', mark: '×', color: colors.wrong},
	{clue: '神の遺伝子', note: '特別につなぐ遺伝子はない', mark: '×', color: colors.wrong},
];

const VerdictBoard = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{position: 'absolute', left: 200, right: 200, top: 140, display: 'flex', flexDirection: 'column', gap: 14}}>
			{rows.map((r, i) => {
				const at = captionFrame(c, 0, i + 1, fps);
				return (
					<div
						key={r.clue}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 40,
							padding: '6px 40px',
							borderRadius: 18,
							background: 'rgba(244,236,220,0.08)',
							opacity: interpolate(frame, [at - 20, at - 5], [0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						}}
					>
						<div style={{width: 120, fontFamily: minchoFamily, fontWeight: 800, fontSize: 72, color: r.color, textAlign: 'center', scale: interpolate(frame, [at, at + 8, at + 12], [0, 1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
							{r.mark}
						</div>
						<div style={{width: 380, fontFamily: minchoFamily, fontWeight: 800, fontSize: 54, color: colors.text}}>{r.clue}</div>
						<div style={{fontFamily: gothicFamily, fontWeight: 700, fontSize: 38, color: colors.muted}}>{r.note}</div>
					</div>
				);
			})}
		</div>
	);
};

// 24:20 まとめ
export const Summary = () => (
	<SceneFrame captions={c} label="閉廷" title="今夜の判決">
		<Beat name="判決ボード" captions={c} from={0} to={5}>
			<VerdictBoard />
		</Beat>
		<Beat name="あだ名の民族" captions={c} from={6} to={8}>
			<BigText size={100} sub="その空白に、後の人々が物語を書き込んできた">本当の姿がわからない民族</BigText>
		</Beat>
		<Beat name="結論" captions={c} from={9}>
			<BigText size={120} color={colors.gold}>本当の話は、作り話に負けないくらい、面白い。</BigText>
		</Beat>
	</SceneFrame>
);
