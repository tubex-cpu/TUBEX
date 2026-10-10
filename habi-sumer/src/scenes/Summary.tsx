import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {SumerianStatue} from '../components/Scenery';
import {CourtWithText} from '../components/CourtImage';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';
import {summaryMouth as mouth} from '../data/mouth';
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

// 空白に、後の人々の物語が書き込まれていく
const StatueWithStories = () => {
	const frame = useCurrentFrame();
	const tags = [
		{t: '「シュメール」＝あだ名', x: 330, y: 230, c: colors.half},
		{t: '日本人の祖先？', x: 1420, y: 250, c: colors.japan},
		{t: '失われた文明？', x: 380, y: 560, c: colors.muted},
		{t: '宇宙から来た？', x: 1400, y: 560, c: colors.muted},
	];
	return (
		<>
			<div style={{position: 'absolute', left: 0, right: 0, top: 140, display: 'flex', justifyContent: 'center'}}>
				<SumerianStatue size={620} />
			</div>
			{tags.map((tg, i) => (
				<div
					key={tg.t}
					style={{
						position: 'absolute',
						left: tg.x,
						top: tg.y,
						translate: '-50% 0px',
						fontFamily: gothicFamily,
						fontWeight: 900,
						fontSize: 48,
						color: colors.night,
						background: tg.c,
						padding: '14px 30px',
						borderRadius: 40,
						opacity: interpolate(frame, [i * 25, i * 25 + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						scale: interpolate(frame, [i * 25, i * 25 + 12], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					{tg.t}
				</div>
			))}
		</>
	);
};

// 24:20 まとめ
export const Summary = () => (
	<SceneFrame captions={c} voice="Summary" mouth={mouth} expressions={{0: 'stern', 6: 'closed'}} hideAvatar={[[9]]} label="閉廷" title="今夜の判決">
		<Beat name="判決ボード" captions={c} from={0} to={5}>
			<VerdictBoard />
		</Beat>
		<Beat name="あだ名の民族" captions={c} from={6} to={8}>
			<StatueWithStories />
		</Beat>
		<Beat name="結論" captions={c} from={9}>
			<CourtWithText shot="court-verdict">
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 80, lineHeight: 1.45, color: colors.gold}}>
					本当の話は、
					<br />
					作り話に
					<br />
					負けないくらい、
					<br />
					面白い。
				</div>
			</CourtWithText>
		</Beat>
	</SceneFrame>
);
