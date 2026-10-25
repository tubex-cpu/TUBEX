import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const rows = [
	{clue: '世界最大の墓', mark: '半分正しい', color: '#d98a12'},
	{clue: '15年以上かかった', mark: '正しい', color: colors.correct},
	{clue: '堺は最先端の工業地帯', mark: '正しい', color: colors.correct},
	{clue: '埴輪は身代わり', mark: 'まちがい', color: colors.wrong},
	{clue: '陪塚は家来の墓', mark: '半分正しい', color: '#d98a12'},
	{clue: '眠るのは仁徳天皇', mark: 'まちがい', color: colors.wrong},
	{clue: '生きているうちに造った', mark: '半分正しい', color: '#d98a12'},
	{clue: '倭の王は皇帝の家来', mark: '半分正しい', color: '#d98a12'},
	{clue: '名前は昔から伝わる', mark: '半分正しい', color: '#d98a12'},
	{clue: '中を見た人はいない', mark: 'まちがい', color: colors.wrong},
	{clue: '宝はアメリカへ', mark: '半分正しい', color: '#d98a12'},
	{clue: '明治の宝は失われた', mark: 'まちがい', color: colors.wrong},
	{clue: '今も誰も入れない', mark: 'まちがい', color: colors.wrong},
	{clue: '古墳群は昔のまま', mark: 'まちがい', color: colors.wrong},
	{clue: '世界遺産で発掘が進んだ', mark: 'まちがい', color: colors.wrong},
	{clue: '造られたときの姿のまま', mark: 'まちがい', color: colors.wrong},
];

// 16の判決を2列に並べる
const VerdictBoard = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{position: 'absolute', left: 70, right: 70, top: 130, display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoFlow: 'column', gridTemplateRows: 'repeat(8, auto)', gap: '10px 30px'}}>
			{rows.map((r, i) => {
				const at = captionFrame(c, 0, i + 1, fps);
				return (
					<div key={r.clue} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '6px 24px', borderRadius: 16, background: 'rgba(244,236,220,0.08)', opacity: interpolate(frame, [at - 20, at - 5], [0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
						<div style={{width: 190, fontFamily: gothicFamily, fontWeight: 900, fontSize: 32, color: '#fff', background: r.color, borderRadius: 12, padding: '6px 0', textAlign: 'center', whiteSpace: 'nowrap', scale: interpolate(frame, [at, at + 8, at + 12], [0, 1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{r.mark}</div>
						<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 36, whiteSpace: 'nowrap', color: colors.text}}>{r.clue}</div>
					</div>
				);
			})}
		</div>
	);
};

// まとめ
export const Summary = () => (
	<SceneFrame captions={c} voice="Summary" label="閉廷" title="今夜の判決">
		<Beat name="判決ボード" captions={c} from={0} to={16}>
			<VerdictBoard />
		</Beat>
		<Beat name="決まらなかった" captions={c} from={17} to={17}>
			<Photo id="osamezuka-5" move="out" label="誰が眠るのかは、まだわからない。でも――" />
		</Beat>
		<Beat name="埴輪と宝と土壇" captions={c} from={18} to={18}>
			<Photo id="magodayu-4" label="埴輪の列と、150年ぶりの宝と、浮かび上がった土壇" />
		</Beat>
		<Beat name="結論" captions={c} from={19}>
			<Photo id="daisen-park-2" label="本当の話は、作り話に負けないくらい、面白い。" />
		</Beat>
	</SceneFrame>
);
