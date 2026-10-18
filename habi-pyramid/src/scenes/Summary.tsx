import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const rows = [
	{clue: '2万年以上前に造られた', note: '審査前の、ばらつきの大きい推定', mark: 'まちがい', color: colors.wrong},
	{clue: '地下2キロの巨大構造物', note: '証拠はなく、論文の撤回まで', mark: 'まちがい', color: colors.wrong},
	{clue: '地震に強いつくり', note: '本当に揺れに強かった', mark: '正しい', color: colors.correct},
	{clue: '重りと滑車', note: '物理では成り立つ。証拠はまだない', mark: '半分正しい', color: '#d98a12'},
	{clue: '奴隷が造った', note: '墓と手当てを受けた人々だった', mark: 'まちがい', color: colors.wrong},
];

const VerdictBoard = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{position: 'absolute', left: 110, right: 110, top: 140, display: 'flex', flexDirection: 'column', gap: 14}}>
			{rows.map((r, i) => {
				const at = captionFrame(c, 0, i + 1, fps);
				return (
					<div key={r.clue} style={{display: 'flex', alignItems: 'center', gap: 36, padding: '6px 36px', borderRadius: 18, background: 'rgba(244,236,220,0.08)', opacity: interpolate(frame, [at - 20, at - 5], [0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
						<div style={{width: 230, fontFamily: gothicFamily, fontWeight: 900, fontSize: 40, color: '#fff', background: r.color, borderRadius: 12, padding: '8px 0', textAlign: 'center', whiteSpace: 'nowrap', scale: interpolate(frame, [at, at + 8, at + 12], [0, 1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{r.mark}</div>
						<div style={{width: 540, fontFamily: minchoFamily, fontWeight: 800, fontSize: 44, whiteSpace: 'nowrap', color: colors.text}}>{r.clue}</div>
						<div style={{fontFamily: gothicFamily, fontWeight: 700, fontSize: 32, color: colors.muted}}>{r.note}</div>
					</div>
				);
			})}
		</div>
	);
};

// まとめ
export const Summary = () => (
	<SceneFrame captions={c} voice="Summary" label="閉廷" title="今夜の判決">
		<Beat name="判決ボード" captions={c} from={0} to={5}>
			<VerdictBoard />
		</Beat>
		<Beat name="決まらなかった" captions={c} from={6} to={6}>
			<Photo id="great-sphinx" move="out" label="2万年前の文明は、なかった。でも――" />
		</Beat>
		<Beat name="名前の残った人々" captions={c} from={7} to={7}>
			<Photo id="bread-mould-2" label="パンとビールを供えられた人々" />
		</Beat>
		<Beat name="結論" captions={c} from={8}>
			<Photo id="sphinx-panorama" label="本当の話は、作り話に負けないくらい、面白い。" />
		</Beat>
	</SceneFrame>
);
