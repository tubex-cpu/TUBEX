import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const rows = [
	{clue: '「敵は本能寺にあり」', note: '同じ時代の記録になく、兵士も知らなかった', mark: 'まちがい', color: colors.wrong},
	{clue: '信長への恨み', note: '多くは作り話。でも衝突の記録はある', mark: '半分正しい', color: '#d98a12'},
	{clue: '黒幕は秀吉', note: '証拠はなく、毛利との密約もなかった可能性', mark: 'まちがい', color: colors.wrong},
	{clue: '四国の問題', note: '追い詰められていたことは、手紙が証明', mark: '正しい', color: colors.correct},
	{clue: '光秀は天海になった', note: '証拠はない', mark: 'まちがい', color: colors.wrong},
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
			<Photo id="fukuchiyama-2" move="out" label="本当の理由は、まだわからない。でも――" />
		</Beat>
		<Beat name="感謝と幻の城" captions={c} from={7} to={7}>
			<Photo id="biwa-omi3" label="感謝を書き残した男と、幻の城" />
		</Beat>
		<Beat name="結論" captions={c} from={8}>
			<Photo id="hiei-sakura" label="本当の話は、作り話に負けないくらい、面白い。" />
		</Beat>
	</SceneFrame>
);
